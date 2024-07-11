const express = require('express');
const router = express.Router();
const { createSapiens, getSapiens, getSapiensById, updateSapiens, deleteSapiens, getSystemConfig } = require('../controllers/sapiensController');

// CRUD routes for sapiens

router.route('/')
    .post(createSapiens)
    .get(getSapiens);

router.route('/:id')
    .get(getSapiensById)
    .put(updateSapiens)
    .delete(deleteSapiens);

router.route('/system-config')
    .get(getSystemConfig);

module.exports = router;