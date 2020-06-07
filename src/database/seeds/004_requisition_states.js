const requisitionStates = require('../../utils/enums/EnumRequisitonStates');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('requisition_states')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('requisition_states').insert([
        { state: requisitionStates.PENDING },
        { state: requisitionStates.COMPLETED },
        { state: requisitionStates.REFUSED },
      ]);
    });
};
