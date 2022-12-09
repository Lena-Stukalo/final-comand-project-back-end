const { Transaction } = require('../../models/transaction');

const getDetailedTransactions = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Transaction.find({ owner }).populate('owner', 'name');

  const filterByDate = (array, reqq) => {
    const year = reqq.body.year;
    const month = reqq.body.month ? `${reqq.body.month}.` : '';
    const filterDate = month + year;

    const transactionsDate = reqq.body.month
      ? array.date.slice(3)
      : array.date.slice(6);

    return reqq.body.year ? transactionsDate === filterDate : array;
  };

  const calculateSum = (prevValue, curValue) => {
    return Number(prevValue) + Number(curValue.sum);
  };

  const objectOfExpenses = result
    .filter(item => !item.isIncome)
    .filter(item => filterByDate(item, req))
    .reduce((acc, { category, sum }) => {
      const currentSum = acc[category] ? acc[category] : 0;

      acc = { ...acc, [category]: currentSum + Number(sum) };
      return acc;
    }, {});

  const keys = Object.keys(objectOfExpenses);
  const values = Object.values(objectOfExpenses);

  const expenses = keys.reduce((acc, el, idx) => {
    acc.push({ category: el, sum: values[idx] });
    return acc;
  }, []);

  const totalIncome = result
    .filter(item => item.isIncome)
    .filter(item => filterByDate(item, req))
    .reduce((acc, item) => calculateSum(acc, item), 0);

  const totalExpense = result
    .filter(item => !item.isIncome)
    .filter(item => filterByDate(item, req))
    .reduce((acc, item) => calculateSum(acc, item), 0);

  const response = { totalIncome, totalExpense, expenses };

  res.json(response);
};

module.exports = getDetailedTransactions;
