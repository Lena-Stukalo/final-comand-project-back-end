const { Transaction } = require('../../models/transaction');

const addTransaction = async (req, res) => {
  const { _id: owner } = req.user;

  const category = req.body.isIncome ? 'Income' : req.body.category;
  const newTransaction = { ...req.body, category };

  const result = await (
    await Transaction.create({ ...newTransaction, owner })
  ).populate('owner', '_id');

  res.status(201).json(result);
};

module.exports = addTransaction;
