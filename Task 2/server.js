sconst express = require('express');
const axios = require('axios');
const app = express();
const port = "http:/20.244.56.144/numbers/primes&url";

app.get('/numbers', async (req, res) => {
  try {
    const urls = req.query.url;
    const responsePromises = urls.map((url) => axios.get(url, { timeout: 500 }));
    const responses = await Promise.allSettled(responsePromises);

    const mergedNumbers = [];
    responses.forEach((response) => {
      if (response.status === 'fulfilled') {
        const { numbers } = response.value.data;
        mergedNumbers.push(...numbers);
      }
    });

    const uniqueNumbers = [...new Set(mergedNumbers)];
    const sortedNumbers = uniqueNumbers.sort((a, b) => a - b);

    res.json({ numbers: sortedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
