// testUpdateTestTableUser.js
// Node.js script to update a user in TestTable using axios

const axios = require('axios');

async function updateUser(id) {
  try {
    const response = await axios.put(`http://localhost:5000/api/testtable/${id}`,
      {
        name: 'Updated User',
        age: 35,
        email: 'testuser@example.com'
      }
    );
    console.log('User updated:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Replace with the actual user _id you want to update
updateUser('68c6f79af757ff79465308d8');
