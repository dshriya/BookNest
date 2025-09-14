// testCreateTestTableUser.js
// Node.js script to create a user in TestTable using axios

const axios = require('axios');

async function createUser() {
  try {
    const response = await axios.post('http://localhost:5000/api/testtable', {
      name: 'Test User',
      age: 25,
      email: 'testuser@example.com'
    });
    console.log('User created:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

createUser();
