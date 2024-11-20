const axios = require('axios');
const Transaction = require('../models/Transaction');

const seedDatabase = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid data received from API' });
    }

    // Clear existing data and insert new data
    await Transaction.deleteMany();
    const result = await Transaction.insertMany(data);

    res.status(200).json({ message: 'Database seeded successfully', records: result.length });
  } catch (error) {
    console.error('Error seeding database:', error.message);
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
};

module.exports = { seedDatabase };
