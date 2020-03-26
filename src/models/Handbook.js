const { Model, DataTypes } = require('sequelize');

class Handbook extends Model {
    static init(sequelize) {
        super.init({
            isbn: DataTypes.STRING,
            name: DataTypes.STRING,
        }, {
            sequelize
        });
    }
}

module.exports = Handbook;