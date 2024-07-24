var express = require('express');
var router = express.Router();
var Barang = require('../models/barang');
var Laporan = require('../models/laporan');
var Laporan = require('../models/laporan');
const { authenticate, authorize } = require('../middelware/auth');

//pada bagian ini hanya dapat di lakukan oleh karyawan
router.get('/', authenticate, authorize(['karyawan']), async (req, res, next) => {
    try {
        const Barangs = await Barang.findAll();
        res.json(Barangs);
    } catch (err) {
        next(err);
    }
});

router.post('/', authenticate, authorize(['karyawan']), async (req, res, next) => {
    try {
        const { namaBarang, jumlah } = req.body;
        let existingBarang = await Barang.findOne({ where: { namaBarang } });
        if (existingBarang) {
            return res.status(409).json({
                message: 'Barang sudah ada, lakukan update',
                existingBarang
            });
        }
        const newBarang = await Barang.create({ namaBarang, jumlah });
        const jenisLaporan = 'BarangMasuk';
        const IdBarang = newBarang.IdBarang;
        const newLaporan = await Laporan.create({ jenisLaporan, IdBarang, Jumlah: jumlah });
        res.status(201).json({
            newBarang,
            newLaporan,
            message: 'Barang masuk'
        });
    } catch (err) {
        next(err);
    }
});

router.put('/keluar/:IdBarang', authenticate, authorize(['karyawan']), async (req, res, next) => {
    try {
        const { jumlahkeluar } = req.body;
        const Barangs = await Barang.findByPk(req.params.IdBarang);

        if (!Barangs) {
            return res.status(404).json({ message: 'Barang tidak ada' });
        }
        const jenisLaporan = "BarangKeluar";
        const IdBarang = Barangs.IdBarang;
        const jumlahawal = Barangs.jumlah;
        const jumlahakhir = jumlahawal - jumlahkeluar;

        if (jumlahakhir < 0) {
            return res.status(400).json({ message: 'Jumlah barang tidak mencukupi' });
        }

        Barangs.jumlah = jumlahakhir;
        await Laporan.create({ jenisLaporan, IdBarang, Jumlah: jumlahkeluar }); // Corrected to record the quantity taken out
        await Barangs.save();

        res.json(Barangs);
    } catch (err) {
        next(err);
    }
});


router.put('/masuk/:IdBarang', authenticate, authorize(['karyawan']), async (req, res, next) => {
    try {
        const { jumlahmasuk } = req.body;
        const Barangs = await Barang.findByPk(req.params.IdBarang);

        if (!Barangs) {
            return res.status(404).json({ message: 'Barang tidak ada' });
        }

        const jenisLaporan = "BarangMasuk";
        const IdBarang = Barangs.IdBarang;
        const jumlahawal = Barangs.jumlah;
        const jumlahakhir = jumlahawal + jumlahmasuk;

        Barangs.jumlah = jumlahakhir;
        await Laporan.create({ jenisLaporan, IdBarang, Jumlah: jumlahmasuk });
        await Barangs.save();

        res.json(Barangs);
    } catch (err) {
        next(err);
    }
});


router.delete('/:IdBarang', authenticate, authorize(['karyawan']), async (req, res, next) => {
    try {
        const IdBarang = req.params.IdBarang;
        const Barangs = await Barang.findByPk(IdBarang);
        
        if (!Barangs) {
            return res.status(404).json({ message: 'Barang not found' });
        }
        const Laporans = await Laporan.findAll({ where: { IdBarang } });
        for (const laporan of Laporans) {
            await laporan.destroy();
        }
        await Barangs.destroy();

        res.json({ message: 'Barang dan laporan terkait dihapus' });
    } catch (err) {
        next(err);
    }
});


module.exports = router;