const charges = require('../../commons/enums/EnumCharges');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('charges')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('charges').insert([
        { charge: charges.ADMIN },
        { charge: charges.SECRETARY },
        { charge: charges.TEACHER },
        { charge: charges.HEAD_CLASS },
        { charge: charges.GUARDIAN },
      ]);
    });
};
