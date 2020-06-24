const reportTypes = {
  DELIVERY: {
    type: 'Entrega',
    table: 'deliveries',
    column: 'delivery_date',
  },
  RETURN: {
    type: 'Devolução',
    table: 'returns',
    column: 'return_date',
  },
};

module.exports = reportTypes;
