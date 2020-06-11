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

  // TODO get
  // TODO set delivery date when guardian submit report signed

  async store(req, res, next) {
    let { requisitions_physical_book, delivery_date } = req.body;

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
      Config.EnumConfigs.ACCEPTED_REQUISITION_IDS.key
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
            requisition.delivery_date =
              requisition.delivery_date || delivery_date;

            const {
              physical_book_id,
              book_requisition_id,
              deliveryDate,
            } = requisition;
            return {
              delivery_date: deliveryDate,
              physical_book_id,
              book_requisition_id,
            };
          })
        )
        .returning('*');

      const report_id = uuid();

      await trx('reports')
        .insert({
          id: report_id,
          requisition_id: bookRequisition.requisition_id,
          type: EnumReportTypes.DELIVERY.type,
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

      for (let i = 0; i < deliveries.length; i++) {
        await trx('physical_books')
          .where('id', requisitions_physical_book[i].physical_book_id)
          .update({ state_id: deliveries[i].book_state_id });
      }

      await trx.commit();
      return res.json(requisitionsPhysicalBook);
    } catch (err) {
      await trx.rollback();
      return res.status(406).json(err);
    }
  },

  // async update(req, res) {
  //   const { id } = req.params;
  //   const { physical_book_id, book_requisition_id, active } = req.body;

  //   try {
  //     const { statusCode, data } = await softUpdate(
  //       'requisitions_physical_book',
  //       id,
  //       {
  //         physical_book_id,
  //         book_requisition_id,
  //         delivery_date,
  //         return_date,
  //         active,
  //       }
  //     );

  //     return res.status(statusCode).json(data);
  //   } catch (err) {
  //     return res.status(406).json(err);
  //   }
  // },

  async delete(req, res) {
    const { id } = req.params;

    return res
      .status(await softDelete('requisitions_physical_book', id))
      .send();
  },
};
