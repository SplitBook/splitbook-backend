const knex = require('../database');
const Config = require('../utils/ConfigUtils');

module.exports = {
  async store(req, res) {
    const { school_enrollment_id, state_id, adopted_books_ids } = req.body;
    const trx = await knex.transaction();

    try {
      const defaultStateId = parseInt(
        await Config.getConfig(
          Config.EnumConfigs.DEFAULT_REQUISITION_STATE_ID.key
        )
      );

      const [requisition] = await trx('requisitions')
        .insert({
          school_enrollment_id,
          state_id: state_id || defaultStateId,
        })
        .returning('*');

      const requisitionBooks = adopted_books_ids.map((id) => {
        return { adopted_book_id: id, requisition_id: requisition.id };
      });

      const requisition_books = await trx('book_requisitions')
        .insert(requisitionBooks)
        .returning('*');

      await trx.commit();

      return res.json({ ...requisition, requisition_books });
    } catch (err) {
      await trx.rollback();
      return res.status(406).json(err);
    }
  },
};
