app.get('/trains', async (req, res) => {
    try {
      const { clientID, clientSecret } = await registerCompany();
      const accessToken = await authenticateCompany(clientID, clientSecret);
      const trainSchedules = await getTrainSchedules(accessToken);
      const filteredTrains = filterAndSortTrains(trainSchedules);
      const responsePayload = prepareResponsePayload(filteredTrains);
  
      res.json(responsePayload);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });