const prepareResponsePayload = (trains) => {
    return trains.map((train) => {
      return {
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        departureTime: train.departureTime,
        seatsAvailable: {
          sleeper: train.seatsAvailable.sleeper,
          AC: train.seatsAvailable.AC
        },
        price: {
          sleeper: train.price.sleeper,
          AC: train.price.AC
        },
        delayedBy: train.delayedBy || 0
      };
    });
  };
  
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