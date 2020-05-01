'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('book_requisitions', {
      school_year_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'resumes', key: 'school_year_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      class_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'resumes', key: 'class_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      subject_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'resumes', key: 'subject_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      book_isbn: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'books', key: 'isbn' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      requisition_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: 'requisitions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book_requisitions');
  },
};
