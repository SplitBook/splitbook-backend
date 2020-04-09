const Handbook = require('../models/Handbook');

module.exports = {
  async index(req, res) {
    const handbooks = await Handbook.findAll();

    return res.json(handbooks);
  },

  async store(req, res) {
    const { isbn, name, author } = req.body;

    try {
      const handbook = await Handbook.create({ isbn, name, author });

      return res.json(handbook);
    } catch {
      return res
        .status(409)
        .json({ error: 'There is already a manual with that ISBN' });
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    const handbook = await Handbook.destroy({
      where: { id },
    });

    if (handbook) {
      return res.json();
    }

    return res.status(404).json({ error: 'Handbook Not Found' });
  },

  async edit(req, res) {
    const { id } = req.params;
    const { isbn, name } = req.body;

    const handbook = await Handbook.findByPk(id);

    if (handbook) {
      try {
        const [, [updatedHandbook]] = await Handbook.update(
          { isbn, name },
          { returning: true, where: { id } }
        );
        return res.json(updatedHandbook);
      } catch {
        return res.status(406).json({ error: 'Invalid Values' });
      }
    }
    return res.status(404).json({ error: 'Handbook Not Found' });
  },
};
