'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'professors',
      'user_id',
      Sequelize.INTEGER,
      {
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        unique: true,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('guardians', 'user_id');
  },
};
