const express = require('express');
const { validateBody, authenticate } = require('../../middlewares');
const { schemas } = require('../../models/transaction');
const ctrl = require('../../controllers/transactions');
const { ctrlWrapper } = require('../../helpers');

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(ctrl.getAll));

router.post(
  '/',
  authenticate,
  validateBody(schemas.addTransactionSchema),
  ctrlWrapper(ctrl.addTransaction)
);

router.post(
  '/detailed',
  authenticate,
  validateBody(schemas.getDetailedTransactionSchema),
  ctrlWrapper(ctrl.getDetailedTransactions)
);

router.get('/categories', ctrlWrapper(ctrl.getAllCategories));

module.exports = router;