const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const Config = require('../utils/ConfigUtils');
const IpUtils = require('../utils/IpUtils');

module.exports = {
  // async index(req, res, next) {
  //   const book_requisitions = await knex('book_requisitions')
  //     .select('*')
  //     .whereNull('deleted_at')
  //     .orderBy('created_at');

  //   return res.json(book_requisitions);
  // },

  async get(req, res) {
    const { id } = req.params;

    const bookRequisition = await knex('book_requisitions')
      .select(
        'book_requisitions.*',
        'books.isbn',
        'books.cover',
        'books.subject_id',
        'school_subjects.school_subject',
        'books.name',
        'requisitions_physical_book.id as requisition_physical_book_id',
        'requisitions_physical_book.physical_book_id',
        'requisitions_physical_book.delivery_date',
        'requisitions_physical_book.return_date'
      )
      .where('book_requisitions.id', id)
      .whereNull('book_requisitions.deleted_at')
      .whereNull('requisitions_physical_book.deleted_at')
      .innerJoin(
        'adopted_books',
        'adopted_books.id',
        'book_requisitions.adopted_book_id'
      )
      .innerJoin('books', 'books.isbn', 'adopted_books.book_isbn')
      .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id')
      .leftJoin(
        'requisitions_physical_book',
        'requisitions_physical_book.book_requisition_id',
        'book_requisitions.id'
      )
      .orderBy('books.subject_id', 'books.name')
      .first();

    if (bookRequisition) {
      bookRequisition.cover = IpUtils.getImagesAddress(bookRequisition.cover);

      return res.json(bookRequisition);
    }

    return res.status(404).json({ error: 'Book Requisition not found.' });
  },

  async store(req, res, next) {
    const { adopted_book_id, requisition_id } = req.body;

    try {
      const requisition = await knex('requisitions')
        .select('*')
        .whereNull('requisitions.deleted_at')
        .where({ id: requisition_id })
        .first();

      if (requisition) {
        const blockedRequisitionIds = await Config.getConfig(
          Config.EnumConfigs.BLOCKED_REQUISITION_IDS.key
        );

        if (!blockedRequisitionIds.includes(requisition.state_id)) {
          const [bookRequisition] = await knex('book_requisitions')
            .insert({
              adopted_book_id,
              requisition_id,
            })
            .returning('*');

          return res.json(bookRequisition);
        }

        return res
          .status(403)
          .json({ error: 'Requisition is not allowed to change.' });
      }

      return res.status(404).json({ error: 'Requisition not found.' });
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  // async update(req, res) {
  //   const { id } = req.params;
  //   const { adopted_book_id, requisition_id, active } = req.body;

  //   try {
  //     const { statusCode, data } = await softUpdate('book_requisitions', id, {
  //       adopted_book_id,
  //       requisition_id,
  //       active,
  //     });

  //     return res.status(statusCode).json(data);
  //   } catch (err) {
  //     return res.status(406).json(err);
  //   }
  // },

  async delete(req, res) {
    const { id } = req.params;

    const bookRequisition = await knex('book_requisitions')
      .select('book_requisitions.*', 'requisitions.state_id')
      .whereNull('book_requisitions.deleted_at')
      .where('book_requisitions.id', id)
      .innerJoin(
        'requisitions',
        'requisitions.id',
        'book_requisitions.requisition_id'
      )
      .first();

    if (bookRequisition) {
      try {
        const blockedRequisitionIds = await Config.getConfig(
          Config.EnumConfigs.BLOCKED_REQUISITION_IDS.key
        );

        if (!blockedRequisitionIds.includes(bookRequisition.state_id)) {
          return res.status(await softDelete('book_requisitions', id)).send();
        }

        return res
          .status(403)
          .json({ error: 'Requisition is not allowed to change.' });
      } catch (err) {
        return res.status(406).json({ error: err });
      }
    }

    return res.status(404).send();
  },
};
