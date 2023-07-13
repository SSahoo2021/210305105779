const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const registerCompany = async () => {
  try {
    const response = await axios.post('http://20.244.56.144/train/register', {
      companyName: 'Train Central',
      ownerName: 'Rahul',
      rollNo: '1',
      ownerEmail: 'ratpl@abc.edu',
      accessCode: 'FKDLjg'
    });
    const { clientID, clientSecret } = response.data;
    return { clientID, clientSecret };
  } catch (error) {
    console.error('Company registration failed:', error.message);
    throw error;
  }
};

const authenticateCompany = async (clientID, clientSecret) => {
  try {
    const response = await axios.post('http://20.244.56.144/train/auth', {
      companyName: 'Train Central',
      clientID,
      ownerName: 'Rahul',
      ownerEmail: 'rahul@abc.edu',
      rollNo: '1',
      clientSecret
    });
    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error('Company authentication failed:', error.message);
    throw error;
  }
};

// Get train schedules from John Doe Railways API
const getTrainSchedules = async (accessToken) => {
  try {
    const response = await axios.get('http://20.244.56.144/train/trains', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to retrieve train schedules:', error.message);
    throw error;
  }
};

// Filter and sort trains based on criteria
const filterAndSortTrains = (trains) => {
  const now = new Date();
  const next12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  const filteredTrains = trains.filter((train) => {
    const departureTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      train.departureTime.Hours,
      train.departureTime.Minutes,
      train.departureTime.Seconds
    );
    return departureTime > now && departureTime < next12Hours;
  });

  return filteredTrains.sort((a, b) => {
    if (a.price.AC !== b.price.AC) {
      return a.price.AC - b.price.AC;
    } else if (a.seatsAvailable.AC !== b.seatsAvailable.AC) {
      return b.seatsAvailable.AC - a.seatsAvailable.AC;
    } else {
      const aDelay = a.delayedBy || 0;
      const bDelay = b.delayedBy || 0;
      return bDelay - aDelay;
    }
  });
};

// Route handler for GET /trains
app.get('/trains', async (req, res) => {
  try {
    const { clientID, clientSecret } = await registerCompany();
    const accessToken = await authenticateCompany(clientID, clientSecret);
    const trainSchedules = await getTrainSchedules(accessToken);
    const filteredTrains = filterAndSortTrains(trainSchedules);

    res.json(filteredTrains);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});