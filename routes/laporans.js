var express = require('express');
var router = express.Router();
var Laporan = require('../models/laporan');
const { authenticate, authorize } = require('../middelware/auth');


//dalam laporan ini hanya pemilik yang dapat melihat laporan
router.get('/',authenticate, authorize(['pemilik']), async (req, res, next) => {
    try {
        const Laporans = await Laporan.findAll();
        res.json(Laporans);
    } catch (err) {
        next(err);
    }
});

module.exports = router;