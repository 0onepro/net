const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// تخزين الجلسات النشطة
const activeSessions = new Map();

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
    
    // حفظ الجلسة لمدة 30 دقيقة
    activeSessions.set(response.data.session_id, {
      created: Date.now(),
      ttl: 30 * 60 * 1000 // 30 دقيقة
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).send('Error creating session');
  }
});

// تنظيف الجلسات كل 5 دقائق
setInterval(() => {
  const now = Date.now();
  activeSessions.forEach((session, id) => {
    if (now - session.created > session.ttl) {
      axios.delete(`https://engine.hyperbeam.com/v0/vm/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.HYPERBEAM_KEY || 'sk_test_OzqfKmqu99ypRajVStstD9RSE-BEStIh8zCQfEYQ61Q'}`
        }
      }).catch(console.error);
      activeSessions.delete(id);
    }
  });
}, 5 * 60 * 1000); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
