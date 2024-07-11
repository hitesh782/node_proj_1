const express = require('express');
const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../controllers/customerController');
const { getCustomersWithCriteriaSearch } = require('../controllers/customerController');
const router = express.Router();

router.route('/')
    .get(getCustomers)
    .post(createCustomer);

router.route('/criteria-search')
    .post(getCustomersWithCriteriaSearch);

router.route('/:id')
    .get(getCustomerById)
    .put(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;
