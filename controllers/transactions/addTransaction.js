const { Transaction } = require('../../models/transaction');
const { User } = require('../../models/user');

const addTransaction = async (req, res) => {
  const { _id: owner } = req.user;

  const category = req.body.isIncome ? 'Income' : req.body.category;
  const newTransaction = { ...req.body, category };

  const { balance } = await User.findById(owner);

  const newBalance = req.body.isIncome
    ? balance + Number(req.body.sum)
    : balance - Number(req.body.sum);

  const result = await (
    await Transaction.create({
      ...newTransaction,
      owner,
      balance: newBalance,
    })
  ).populate('owner', 'email');

  await User.findByIdAndUpdate(owner, {
    balance: newBalance,
  });

  res.status(201).json(result);
};

module.exports = addTransaction;
