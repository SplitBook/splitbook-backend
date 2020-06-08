const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { createPagination } = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');

module.exports = {
  async index(req, res, next) {
    const { search, page, limit, orderBy, desc } = req.query;

    try {
      let pagination = await createPagination(
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

      pagination.data = pagination.data.map((student) => {
        student.photo = IpUtils.getImagesAddress(student.photo);
        return student;
      });

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
      let [student] = await knex('students')
        .insert({ name, number, photo, born_date })
        .returning('*');

      student.photo = IpUtils.getImagesAddress(student.photo);

      return res.json(student);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, photo, born_date, active } = req.body;

    try {
      let { statusCode, data } = await softUpdate('students', id, {
        name,
        photo,
        born_date,
        active,
      });

      data.photo = IpUtils.getImagesAddress(data.photo);

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
