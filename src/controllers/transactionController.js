const Transaction = require('../models/Transaction');

const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  try {
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: !isNaN(search) ? parseFloat(search) : { $exists: false } }
      ]
    };

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const totalCount = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

module.exports = { listTransactions };
