const configs = {
  CURRENT_SCHOOL_YEAR_ID: { key: 'current_school_year_id', defaultValue: 1 },
  DEFAULT_REQUISITION_STATE_ID: {
    key: 'default_requisition_state_id',
    defaultValue: 1,
    array: false,
  },
  DEFAULT_BOOK_STATE_ID: {
    key: 'default_book_state_id',
    defaultValue: 1,
    array: false,
  },
  BLOCKED_REQUISITION_IDS: {
    key: 'blocked_requisition_ids',
    defaultValue: '2,3',
    array: true,
  },
  ACCEPTED_REQUISITION_IDS_TO_DELIVER: {
    key: 'accepted_requisition_ids_to_deliver_a_book',
    defaultValue: '2',
    array: true,
  },
  ACCEPTED_REQUISITION_IDS_TO_RETURN: {
    key: 'accepted_requisition_ids_to_return_a_book',
    defaultValue: '2',
    array: true,
  },
};

module.exports = configs;
