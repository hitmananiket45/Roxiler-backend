const axios = require('axios');  // Import axios to fetch data from the external API
const Transaction = require('../models/Transaction');

const getBarChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    // Fetch data from third-party API as a fallback
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Define the price ranges
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity }
    ];

    const barChartData = priceRanges.map((range) => {
      const count = transactions.filter(item => 
        item.price >= range.min && item.price < range.max
      ).length;
      return { range: range.range, count };
    });

    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error.message);
    res.status(500).json({ message: 'Error fetching bar chart data', error: error.message });
  }
};

module.exports = { getBarChartData };
