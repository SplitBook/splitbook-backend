const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const { generateCode } = require('../utils/PhysicalBookUtils');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');
const Config = require('../utils/ConfigUtils');

module.exports = {
  /*
   * Search By:
   * ISBN
   * Physical Book Id (Code)
   * State
   * Name
   * Publishing Company
   */
  async index(req, res, next) {
    const {
      search,
      page,
      limit,
      orderBy,
      desc,
      book_isbn,
      available,
      state_id,
      location_id,
    } = req.query;

    const filter = getFiltersFromObject({
      book_isbn,
      available,
      state_id,
      location_id,
    });

    try {
      const pagination = await createPagination(
        'physical_books',
        { search, page, limit },
        {
          orderBy: orderBy || 'physical_books.updated_at',
          filter,
          desc: orderBy ? desc : true,
          selects: [
            'physical_books.*',
            'book_locations.location',
            'book_states.state',
            'books.name',
            'books.publishing_company',
          ],
          searchColumns: [
            'book_isbn',
            'book_locations.location',
            'physical_books.id',
            'book_states.state',
            'books.name',
            'books.publishing_company',
          ],
          leftJoins: [
            [
              'book_locations',
              'book_locations.id',
              'physical_books.location_id',
            ],
            ['book_states', 'book_states.id', 'physical_books.state_id'],
            ['books', 'books.isbn', 'physical_books.book_isbn'],
          ],
        }
      );

      return res.json(pagination);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async store(req, res, next) {
    const {
      book_isbn,
      available,
      state_id,
      location_id,
      description,
    } = req.body;

    const { quantity } = req.query;

    const book = await knex('books')
      .select('code')
      .where('isbn', book_isbn)
      .whereNull('deleted_at')
      .first();

    if (book) {
      const defaultBookStateId = await Config.getConfig(
        Config.EnumConfigs.DEFAULT_BOOK_STATE_ID.key
      );

      const trx = await knex.transaction();

      let physicalBooks = [];

      for (let i = 0; i < quantity; i++) {
        const { code } = book;

        const id = `${code}-${generateCode()}`;

        try {
          const [physicalBook] = await trx('physical_books')
            .insert({
              id,
              book_isbn,
              available,
              state_id: state_id || defaultBookStateId,
              location_id,
              description,
            })
            .returning('*');

          physicalBooks = [...physicalBooks, physicalBook];
        } catch (err) {
          await trx.rollback();
          return res.status(406).json(err);
        }
      }

      await trx.commit();

      return res.json(
        physicalBooks.length > 1 ? physicalBooks : physicalBooks[0]
      );
    }

    return res.status(406).json({ error: 'Physical Book not found.' });
  },

  async update(req, res) {
    const { id } = req.params;
    const { available, state_id, location_id, description } = req.body;

    try {
      const { statusCode, data } = await softUpdate('physical_books', id, {
        available,
        state_id,
        location_id,
        description,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res.status(await softDelete('physical_books', id)).send();
  },
};
