const { Transaction } = require('../../models/transaction');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Transaction.find(
    { owner },
    '-createAt -updateAt'
  ).populate('owner', 'name email balance');

  res.json(result);
};

module.exports = getAll;
