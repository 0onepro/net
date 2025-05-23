const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/create-session', async (req, res) => {
  try {
    const response = await axios.post(
      'https://engine.hyperbeam.com/v0/vm',
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.HYPERBEAM_KEY || 'sk_test_OzqfKmqu99ypRajVStstD9RSE-BEStIh8zCQfEYQ61Q'}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error creating session:', error.response?.data || error.message);
    res.status(500).send('Error creating session');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
