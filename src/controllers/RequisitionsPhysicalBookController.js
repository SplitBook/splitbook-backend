const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');
const Config = require('../utils/ConfigUtils');
const EnumReportTypes = require('../utils/enums/EnumReportTypes');
const { v4: uuid } = require('uuid');

module.exports = {
  async index(req, res, next) {
    const {
      search,
      page,
      limit,
      orderBy,
      desc,
      book_isbn,
      state_id,
      subject_id,
      location_id,
      requisition_id,
      adopted_book_id,
      available,
    } = req.query;

    const filter = getFiltersFromObject({
      book_isbn,
      state_id,
      subject_id,
      location_id,
      requisition_id,
      adopted_book_id,
      available,
    });

    try {
      let pagination = await createPagination(
        'requisitions_physical_book',
        { search, page, limit },
        {
          orderBy: orderBy || ['school_subjects.school_subject', 'books.name'],
          desc,
          filter,
          selects: [
            'requisitions_physical_book.*',
            'book_requisitions.requisition_id',
            'book_requisitions.adopted_book_id',
            'physical_books.book_isbn',
            'physical_books.available',
            'physical_books.state_id',
            'book_states.state',
            'physical_books.location_id',
            'book_locations.location',
            'physical_books.description',
            'books.name',
            'books.publishing_company',
            'books.cover',
            'books.subject_id',
            'school_subjects.school_subject',
          ],
          searchColumns: [
            'physical_books.book_isbn',
            'book_states.state',
            'book_locations.location',
            'physical_books.description',
            'books.name',
            'books.publishing_company',
            'requisitions_physical_book.physical_book_id',
            'school_subjects.school_subject',
          ],
          innerJoins: [
            [
              'book_requisitions',
              'book_requisitions.id',
              'requisitions_physical_book.book_requisition_id',
            ],
            [
              'physical_books',
              'physical_books.id',
              'requisitions_physical_book.physical_book_id',
            ],
            ['books', 'books.isbn', 'physical_books.book_isbn'],
          ],
          leftJoins: [
            ['school_subjects', 'school_subjects.id', 'books.subject_id'],
            [
              'book_locations',
              'book_locations.id',
              'physical_books.location_id',
            ],
            ['book_states', 'book_states.id', 'physical_books.state_id'],
          ],
        }
      );

      pagination.data = pagination.data.map((book) => {
        book.cover = IpUtils.getImagesAddress(book.cover);

        return book;
      });

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    let requisitionPhysicalBook = await knex('requisitions_physical_book')
      .select(
        'requisitions_physical_book.*',
        'book_requisitions.requisition_id',
        'book_requisitions.adopted_book_id',
        'physical_books.book_isbn',
        'physical_books.available',
        'physical_books.state_id',
        'book_states.state',
        'physical_books.location_id',
        'book_locations.location',
        'physical_books.description',
        'books.name',
        'books.publishing_company',
        'books.cover',
        'books.subject_id',
        'school_subjects.school_subject',
        'deliveries.id as delivery_id',
        'deliveries.report_id as delivery_report_id',
        'returns.id as return_id',
        'returns.report_id as return_report_id'
      )
      .where('requisitions_physical_book.id', id)
      .whereNull('requisitions_physical_book.deleted_at')
      .innerJoin(
        'book_requisitions',
        'book_requisitions.id',
        'requisitions_physical_book.book_requisition_id'
      )
      .innerJoin(
        'physical_books',
        'physical_books.id',
        'requisitions_physical_book.physical_book_id'
      )
      .innerJoin('books', 'books.isbn', 'physical_books.book_isbn')
      .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
      .leftJoin(
        'book_locations',
        'book_locations.id',
        'physical_books.location_id'
      )
      .leftJoin('book_states', 'book_states.id', 'physical_books.state_id')
      .leftJoin(
        'deliveries',
        'deliveries.requisition_physical_book_id',
        'requisitions_physical_book.id'
      )
      .leftJoin(
        'returns',
        'returns.requisition_physical_book_id',
        'requisitions_physical_book.id'
      )
      .first();

    if (requisitionPhysicalBook) {
      requisitionPhysicalBook.cover = IpUtils.getImagesAddress(
        requisitionPhysicalBook.cover
      );

      return res.json(requisitionPhysicalBook);
    }

    return res
      .status(406)
      .json({ error: 'Requisition Physical Book not found.' });
  },

  async deliveries(req, res, next) {
    let { requisitions_physical_book, delivery_date, description } = req.body;

    const bookRequisition = await knex('book_requisitions')
      .select('book_requisitions.requisition_id', 'requisitions.state_id')
      .where(
        'book_requisitions.id',
        requisitions_physical_book[0].book_requisition_id
      )
      .innerJoin(
        'requisitions',
        'requisitions.id',
        'book_requisitions.requisition_id'
      )
      .first();

    const acceptedStateIds = await Config.getConfig(
      Config.EnumConfigs.ACCEPTED_REQUISITION_IDS_TO_DELIVER.key
    );

    if (!acceptedStateIds.includes(bookRequisition.state_id)) {
      return res.status(403).json({
        error:
          'Requisition is not allowed to deliver books. Please change requisition state.',
      });
    }

    const trx = await knex.transaction();

    try {
      const requisitionsPhysicalBook = await trx('requisitions_physical_book')
        .insert(
          requisitions_physical_book.map((requisition) => {
            const { physical_book_id, book_requisition_id } = requisition;
            return {
              physical_book_id,
              book_requisition_id,
            };
          })
        )
        .returning('*');

      const report_id = uuid();
      const report_date = delivery_date;

      await trx('reports')
        .insert({
          id: report_id,
          requisition_id: bookRequisition.requisition_id,
          type: EnumReportTypes.DELIVERY.type,
          report_date,
          description,
        })
        .returning('*');

      const defaultBookStateId = await Config.getConfig(
        Config.EnumConfigs.DEFAULT_BOOK_STATE_ID.key
      );

      const deliveries = await trx('deliveries')
        .insert(
          requisitionsPhysicalBook.map((requisition, idx) => {
            return {
              requisition_physical_book_id: requisition.id,
              book_state_id:
                requisitions_physical_book[idx].book_state_id ||
                defaultBookStateId,
              report_id,
            };
          })
        )
        .returning('*');

      await trx.commit();
      return res.json(deliveries);
    } catch (err) {
      await trx.rollback();
      return res.status(406).json(err);
    }
  },

  async returns(req, res, next) {
    let { requisitions_physical_book, return_date, description } = req.body;

    const bookRequisitions = await knex('requisitions_physical_book')
      .select('requisitions_physical_book.*')
      .whereIn(
        'requisitions_physical_book.id',
        requisitions_physical_book.map((requisition) => requisition.id)
      )
      .whereNotNull('requisitions_physical_book.delivery_date');

    if (bookRequisitions.length !== requisitions_physical_book.length) {
      return res
        .status(406)
        .json({ error: 'There are some requisitions physical book invalids.' });
    }

    const requisition = await knex('book_requisitions')
      .select('book_requisitions.requisition_id', 'requisitions.state_id')
      .where('book_requisitions.id', bookRequisitions[0].book_requisition_id)
      .innerJoin(
        'requisitions',
        'requisitions.id',
        'book_requisitions.requisition_id'
      )
      .first();

    const acceptedStateIds = await Config.getConfig(
      Config.EnumConfigs.ACCEPTED_REQUISITION_IDS_TO_RETURN.key
    );

    if (!acceptedStateIds.includes(requisition.state_id)) {
      return res.status(403).json({
        error:
          'Requisition is not allowed to return books. Please change requisition state.',
      });
    }

    const trx = await knex.transaction();

    try {
      const report_id = uuid();
      const report_date = return_date;

      await trx('reports')
        .insert({
          id: report_id,
          requisition_id: requisition.requisition_id,
          type: EnumReportTypes.RETURN.type,
          report_date,
          description,
        })
        .returning('*');

      const returns = await trx('returns')
        .insert(
          bookRequisitions.map((requisition, idx) => {
            return {
              requisition_physical_book_id: requisition.id,
              book_state_id: requisitions_physical_book[idx].book_state_id,
              report_id,
            };
          })
        )
        .returning('*');

      await trx.commit();
      return res.json(returns);
    } catch (err) {
      await trx.rollback();
      return res.status(406).json(err);
    }
  },
};
