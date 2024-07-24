const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Barang = sequelize.define('Barang', {
    IdBarang: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    namaBarang: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Barang;