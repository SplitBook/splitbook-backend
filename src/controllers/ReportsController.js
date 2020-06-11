const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');
const EnumReportTypes = require('../utils/enums/EnumReportTypes');

module.exports = {
  /*
   * Search By:
   * Report Type
   * Requisition State
   * Report description
   */
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc, is_file_signed } = req.query;
    const filter = getFiltersFromObject({ is_file_signed });

    try {
      let pagination = await createPagination(
        'reports',
        { search, page, limit },
        {
          selects: [
            'reports.*',
            'requisitions.school_enrollment_id',
            'requisitions.state_id',
            'requisition_states.state',
          ],
          orderBy: orderBy || ['reports.updated_at'],
          desc: orderBy ? desc : true,
          filter,
          searchColumns: [
            'reports.type',
            'reports.description',
            'requisition_states.state',
          ],
          innerJoins: [
            ['requisitions', 'requisitions.id', 'reports.requisition_id'],
            [
              'requisition_states',
              'requisition_states.id',
              'requisitions.state_id',
            ],
          ],
        }
      );

      pagination.data = pagination.data.map((report) => {
        report.file_signed = IpUtils.getReportsAddress(report.file_signed);
        report.file = IpUtils.getReportsAddress(report.file);

        return report;
      });

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async get(req, res) {
    const { id } = req.params;

    let report = await knex('reports')
      .select('*')
      .whereNull('reports.deleted_at')
      .where('reports.id', id)
      .orderBy([
        { column: 'reports.type', order: 'asc' },
        { column: 'reports.updated_at', order: 'desc' },
      ])
      .first();

    if (report) {
      report.file_signed = IpUtils.getReportsAddress(report.file_signed);
      report.file = IpUtils.getReportsAddress(report.file);

      const { table } = Object.values(EnumReportTypes).find(
        ({ type }) => type === report.type
      );

      const objects = await knex(table)
        .select(
          `${table}.*`,
          'book_states.state',
          'requisitions_physical_book.physical_book_id',
          'physical_books.book_isbn',
          'books.name',
          'books.publishing_company',
          'books.cover',
          'books.code',
          'books.subject_id',
          'school_subjects.school_subject'
        )
        .where(`${table}.report_id`, report.id)
        .whereNull(`${table}.deleted_at`)
        .innerJoin(
          'requisitions_physical_book',
          'requisitions_physical_book.id',
          `${table}.requisition_physical_book_id`
        )
        .innerJoin('book_states', 'book_states.id', `${table}.book_state_id`)
        .innerJoin(
          'physical_books',
          'physical_books.id',
          'requisitions_physical_book.physical_book_id'
        )
        .innerJoin('books', 'books.isbn', 'physical_books.book_isbn')
        .leftJoin('school_subjects', 'school_subjects.id', 'books.subject_id');

      report[`${table}`] = objects.map((obj) => {
        obj.cover = IpUtils.getImagesAddress(obj.cover);
        return obj;
      });

      return res.json(report);
    }

    return res.status(404).json({ error: 'Report not found.' });
  },

  async update(req, res) {
    const { id } = req.params;
    const { valid, description, report_date } = req.body;
    const { delete_file_signed } = req.query;
    let file_signed = req.file ? req.file.filename : undefined;

    if (delete_file_signed && file_signed === undefined) file_signed = null;

    const is_file_signed = file_signed
      ? true
      : file_signed === null
      ? false
      : undefined;

    const trx = await knex.transaction();

    try {
      let { statusCode, data: report } = await softUpdate('reports', id, {
        file_signed,
        valid,
        description,
        is_file_signed,
        report_date,
      });

      if (statusCode !== 404) {
        report.file_signed = IpUtils.getReportsAddress(report.file_signed);
        report.file = IpUtils.getReportsAddress(report.file);

        if (is_file_signed) {
          const { table } = Object.values(EnumReportTypes).find(
            ({ type }) => type === report.type
          );

          const objects = await knex(table)
            .select(
              `${table}.requisition_physical_book_id`,
              'requisitions_physical_book.physical_book_id',
              `${table}.book_state_id`
            )
            .where(`${table}.report_id`, report.id)
            .whereNull(`${table}.deleted_at`)
            .innerJoin(
              'requisitions_physical_book',
              'requisitions_physical_book.id',
              `${table}.requisition_physical_book_id`
            );

          for (let i = 0; i < objects.length; i++) {
            const column =
              table === EnumReportTypes.RETURN.table
                ? 'return_date'
                : 'delivery_date';

            await trx('requisitions_physical_book')
              .where('id', objects[i].requisition_physical_book_id)
              .update({
                [column]: report.report_date,
                updated_at: new Date(),
              });

            await trx('physical_books')
              .where('id', objects[i].physical_book_id)
              .update({
                state_id: objects[i].book_state_id,
                updated_at: new Date(),
                available: table === EnumReportTypes.RETURN.table,
              });
          }

          report[`${table}`] = objects;
          await trx.commit();
        }
      }

      return res.status(statusCode).json(report);
    } catch (err) {
      await trx.rollback();
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    const report = await knex('reports')
      .whereNull('reports.deleted_at')
      .where('id', id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    const { table } = Object.values(EnumReportTypes).find(
      ({ type }) => type === report.type
    );

    const objects = await knex(table)
      .select(
        `${table}.*`,
        'requisitions_physical_book.delivery_date',
        'requisitions_physical_book.return_date'
      )
      .where(`${table}.report_id`, report.id)
      .whereNull(`${table}.deleted_at`)
      .innerJoin(
        'requisitions_physical_book',
        'requisitions_physical_book.id',
        `${table}.requisition_physical_book_id`
      );

    const trx = await knex.transaction();

    try {
      await trx(table)
        .whereIn(
          'id',
          objects.map((obj) => obj.id)
        )
        .del();

      if (table === EnumReportTypes.DELIVERY.table) {
        const delivery = objects.find((obj) => obj.delivery_date !== null);

        if (delivery) {
          throw {
            error: `Requisition Physical Book ${delivery.requisition_physical_book_id} was already delivery. Impossible to delete.`,
          };
        }

        await trx('requisitions_physical_book').whereIn(
          'id',
          objects.map((obj) => obj.requisition_physical_book_id)
        );
      } else if (table === EnumReportTypes.RETURN.table) {
        const returnObject = objects.find((obj) => obj.return_date !== null);

        if (returnObject) {
          throw {
            error: `Requisition Physical Book ${delivery.requisition_physical_book_id} was already returned. Impossible to delete.`,
          };
        }
      }
      await trx('reports').where('id', id).del();

      await trx.commit();

      return res.status(204).send();
    } catch (err) {
      await trx.rollback();
      return res.status(406).json(err);
    }
  },
};
