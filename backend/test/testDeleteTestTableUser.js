// testDeleteTestTableUser.js
// Node.js script to delete a user in TestTable using axios

const axios = require('axios');

async function deleteUser(id) {
  try {
    const response = await axios.delete(`http://localhost:5000/api/testtable/${id}`);
    console.log('User deleted:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Replace with the actual user _id you want to delete
// Example: deleteUser('6503e2f1c2a4b2d1e8a12345');
deleteUser('68c6f79af757ff79465308d8');
