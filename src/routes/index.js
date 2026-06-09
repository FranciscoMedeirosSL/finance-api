const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const expenseController = require('../controllers/expenseController');
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Expenses
router.get('/expenses', auth, expenseController.list);
router.post('/expenses', auth, expenseController.create);
router.put('/expenses/:id', auth, expenseController.update);
router.delete('/expenses/:id', auth, expenseController.remove);
router.get('/expenses/summary', auth, expenseController.summary);

// Categories
router.get('/categories', auth, categoryController.list);
router.post('/categories', auth, categoryController.create);
router.delete('/categories/:id', auth, categoryController.remove);

module.exports = router;
