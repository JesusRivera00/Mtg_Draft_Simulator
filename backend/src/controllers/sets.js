const supabase = require('../models/index');

const getSets = async (req, res) => {
  try {
    const { data, error } = await supabase.from('sets').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSets };