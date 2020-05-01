'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('guardians', 'user_id', Sequelize.INTEGER, {
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      unique: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('guradians', 'user_id');
  },
};
