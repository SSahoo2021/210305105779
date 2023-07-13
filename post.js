const axios = require('axios');
const registerCompany = async () => {
  try {
    const response = await axios.post('http://20.244.56.144/train/register', {
      companyName: 'Train Central',
      ownerName: 'Rahul',
      rollNo: '1',
      ownerEmail: 'ratpl@abc.edu',
      accessCode: 'FKDLjg'
    });

    console.log('Company registration successful:', response.data);
  } catch (error) {
    console.error('Company registration failed:', error.message);
  }
};

registerCompany();