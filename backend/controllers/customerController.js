const asyncHandler = require('../utils/asyncHandler');
const Customer = require('../models/Customer');
const buildFilterQuery = require('../utils/filterUtils');


// @desc    Get all customers
// @route   GET /api/customers
const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find({});
    res.json(customers);
});

// @desc    Get all customers with filtering and pagination
// @route   POST /api/customers/filter
const getCustomersWithCriteriaSearch = asyncHandler(async (req, res) => {
    const { filters, size, page } = req.body;
    const limit = Number(size) || 10;
    const pageN = Number(page) || 1;

    const filterQuery = buildFilterQuery(filters);

    const count = await Customer.countDocuments(filterQuery);
    const customers = await Customer.find(filterQuery)
        .limit(limit)
        .skip(limit * (pageN - 1));

    res.json({ customers, pageN, pages: Math.ceil(count / limit) });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
        res.json(customer);
    } else {
        res.status(404);
        throw new Error('Customer not found');
    }
});

// @desc    Create a customer
// @route   POST /api/customers
const createCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
        res.status(400);
        throw new Error('Customer already exists');
    }

    const customer = await Customer.create({
        name,
        email,
        phone,
    });

    if (customer) {
        res.status(201).json(customer);
    } else {
        res.status(400);
        throw new Error('Invalid customer data');
    }
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
const updateCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (customer) {
        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.phone = phone || customer.phone;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } else {
        res.status(404);
        throw new Error('Customer not found');
    }
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
        await customer.remove();
        res.json({ message: 'Customer removed' });
    } else {
        res.status(404);
        throw new Error('Customer not found');
    }
});

module.exports = {
    getCustomers,
    getCustomersWithCriteriaSearch,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
