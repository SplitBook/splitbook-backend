const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const Config = require('../utils/ConfigUtils');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');

module.exports = {
  /**
   * Search by:
   * Student Name
   * Guardian Name
   * Student Number
   * Class
   * School Year
   * Requisition State
   */
  async index(req, res, next) {
    const {
      search,
      page,
      limit,
      orderBy,
      desc,
      school_year_id,
      current_school_year,
      guardian_id,
      student_id,
      class_id,
      state_id,
    } = req.query;

    const filter = getFiltersFromObject({
      school_year_id: current_school_year ? req.school_year_id : school_year_id,
      guardian_id,
      student_id,
      class_id,
      state_id,
    });

    try {
      const pagination = await createPagination(
        'requisitions',
        { search, page, limit },
        {
          orderBy: orderBy || 'requisitions.created_at',
          desc: orderBy ? desc : true,
          selects: [
            'requisitions.*',
            'students.name as student_name',
            'students.number as student_number',
            'guardians.name as guardian_name',
            'general_classes.class',
            'school_years.school_year',
            'requisition_states.state',
          ],
          filter,
          searchColumns: [
            'students.name',
            'guardians.name',
            'students.number',
            'class',
            'school_year',
            'requisition_states.state',
          ],
          innerJoins: [
            [
              'school_enrollments',
              'requisitions.school_enrollment_id',
              'school_enrollments.id',
            ],
            ['students', 'students.id', 'school_enrollments.student_id'],
            ['guardians', 'guardians.id', 'school_enrollments.guardian_id'],
            [
              'school_years',
              'school_years.id',
              'school_enrollments.school_year_id',
            ],
            [
              'general_classes',
              'general_classes.id',
              'school_enrollments.class_id',
            ],
            [
              'requisition_states',
              'requisition_states.id',
              'requisitions.state_id',
            ],
          ],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async store(req, res, next) {
    const { school_enrollment_id, state_id } = req.body;

    const defaultStateId = await Config.getConfig(
      Config.EnumConfigs.DEFAULT_REQUISITION_STATE_ID.key
    );

    try {
      const [requisition] = await knex('requisitions')
        .insert({
          school_enrollment_id,
          state_id: state_id || defaultStateId,
        })
        .returning('*');

      return res.json(requisition);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { school_enrollment_id, state_id, active } = req.body;

    try {
      const { statusCode, data } = await softUpdate('requisitions', id, {
        school_enrollment_id,
        state_id,
        active,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('requisitions', id)).send();
  },
};
