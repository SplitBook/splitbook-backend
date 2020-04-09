const { Model, DataTypes } = require('sequelize');

class Handbook extends Model {
    static init(sequelize) {
        super.init({
            isbn: DataTypes.STRING,
            name: DataTypes.STRING,
            author: DataTypes.STRING,
            active: DataTypes.BOOLEAN,
        }, {
            sequelize,
            paranoid: true,
        });

        this.removeAttribute('id');
    }
}

module.exports = Handbook;