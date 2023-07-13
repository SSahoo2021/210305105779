const express = require('express');
const axios = require('axios');
const app = express();
const port = "http://20.244.56.144/numbers/fibo&url";

app.get('/numbers', async (req, res) => {
  try {
    const { url } = req.query;
    const urls = Array.isArray(url) ? url : [url];
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});