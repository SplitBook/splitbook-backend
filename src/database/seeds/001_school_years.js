exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('school_years').then(function () {
    const currentYear = new Date().getFullYear();
    // Inserts seed entries
    return knex('school_years').insert([
      { school_year: `${currentYear}/${currentYear + 1}` },
    ]);
  });
};
