const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Barang = require('./barang');

const Laporan = sequelize.define('Laporan', {
    IdLaporan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    jenisLaporan: {
        type: DataTypes.ENUM('BarangMasuk', 'BarangKeluar'),
        allowNull: false,
    },
    IdBarang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Barang,
            key: 'IdBarang'
        },
    },
    Jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

Laporan.belongsTo(Barang, { foreignKey: 'IdBarang' });
Barang.hasMany(Laporan, { foreignKey: 'IdBarang' });

module.exports = Laporan;