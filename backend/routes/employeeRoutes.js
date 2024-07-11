const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// CRUD routes for users
router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
