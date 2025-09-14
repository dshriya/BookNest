// testReadTestTableUsers.js
// Node.js script to read all users from TestTable using axios

const axios = require('axios');

async function readUsers() {
  try {
    const response = await axios.get('http://localhost:5000/api/testtable');
    console.log('All users:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

readUsers();
