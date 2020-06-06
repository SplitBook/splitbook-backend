const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { createPagination } = require('../utils/PaginatorUtils');

module.exports = {
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc } = req.query;

    try {
      const pagination = await createPagination(
        'students',
        { search, page, limit },
        {
          orderBy: orderBy || 'students.number',
          desc,
          searchColumns: [
            'students.number',
            'students.name',
            'students.born_date',
          ],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async store(req, res, next) {
    const { name, photo, born_date } = req.body;
    let { number } = req.body;

    number = String(number).padStart('7', '0');

    try {
      const [student] = await knex('students')
        .insert({ name, number, photo, born_date })
        .returning('*');

      return res.json(student);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, photo, born_date, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('students', id, {
        name,
        photo,
        born_date,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('students', id)).send();
  },
};
