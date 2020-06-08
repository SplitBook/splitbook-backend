const EnumRequisitionStates = require('../../utils/enums/EnumRequisitonStates');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('requisition_states').then(function () {
    // Inserts seed entries
    return knex('requisition_states').insert([
      { state: EnumRequisitionStates.PENDING },
      { state: EnumRequisitionStates.COMPLETED },
      { state: EnumRequisitionStates.REFUSED },
    ]);
  });
};
