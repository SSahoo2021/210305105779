app.get('/numbers', async (req, res) => {
    try {
      const { url } = req.query;
      const urls = Array.isArray(url) ? url : [url];
  
      const responsePromises = urls.map((url) => sendRequest(url));
      const responses = await Promise.allSettled(responsePromises);
  
      const validResponses = responses
        .filter((response) => response.status === 'fulfilled' && response.value !== null)
        .map((response) => response.value);
  
      const mergedNumbers = validResponses.reduce((merged, response) => {
        return merged.concat(response.numbers);
      }, []);
  
      const uniqueNumbers = [...new Set(mergedNumbers)];
      const sortedNumbers = uniqueNumbers.sort((a, b) => a - b);
  
      const responsePayload = {
        numbers: sortedNumbers
      };
  
      res.json(responsePayload);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });