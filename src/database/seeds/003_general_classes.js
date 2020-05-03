exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('general_classes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('general_classes').insert([
        { class: '5º A' },
        { class: '5º B' },
        { class: '6º A' },
        { class: '6º B' },
        { class: '7º A' },
        { class: '7º B' },
        { class: '8º A' },
        { class: '8º B' },
        { class: '9º A' },
        { class: '9º B' },
        { class: '10º A' },
        { class: '10º B' },
        { class: '10º C' },
        { class: '11º A' },
        { class: '11º B' },
        { class: '11º C' },
        { class: '12º A' },
        { class: '12º B' },
        { class: '12º C' },
      ]);
    });
};
