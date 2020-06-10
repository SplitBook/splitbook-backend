const knex = require('../database');
const { softDelete, softUpdate } = require('../utils/DatabaseOperations');
const {
  createPagination,
  getFiltersFromObject,
} = require('../utils/PaginatorUtils');
const IpUtils = require('../utils/IpUtils');

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
              'book_requisitions.requisition_id',
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

  async store(req, res, next) {
    const {
      physical_book_id,
      book_requisition_id,
      delivery_date,
      return_date,
    } = req.body;

    try {
      const [requisitionsPhysicalBook] = await knex(
        'requisitions_physical_book'
      )
        .insert({
          physical_book_id,
          book_requisition_id,
          delivery_date,
          return_date,
        })
        .returning('*');

      return res.json(requisitionsPhysicalBook);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const {
      physical_book_id,
      book_requisition_id,
      delivery_date,
      return_date,
      active,
    } = req.body;

    try {
      const { statusCode, data } = await softUpdate(
        'requisitions_physical_book',
        id,
        {
          physical_book_id,
          book_requisition_id,
          delivery_date,
          return_date,
          active,
        }
      );

      return res.status(statusCode).json(data);
    } catch (err) {
      return res.status(406).json(err);
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    return res
      .status(await softDelete('requisitions_physical_book', id))
      .send();
  },
};
