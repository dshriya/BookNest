const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Add timeout and debugging
axios.defaults.timeout = 5000;
axios.interceptors.request.use(request => {
  console.log('Making request to:', request.url);
  return request;
});

async function testAuthentication() {
    try {
        console.log('1. Testing user registration...');
        const timestamp = new Date().getTime();
        const registerResponse = await axios.post(`${API_URL}/users/register`, {
            username: `testuser${timestamp}`,
            email: `test${timestamp}@example.com`,
            password: 'Test123!'
        });
        console.log('✅ Registration successful:', registerResponse.data);

        console.log('\n2. Testing login...');
        const loginResponse = await axios.post(`${API_URL}/users/login`, {
            email: `test${timestamp}@example.com`,
            password: 'Test123!'
        });
        authToken = loginResponse.data.token;
        console.log('✅ Login successful:', loginResponse.data);

        console.log('\n3. Testing get user settings...');
        const settingsResponse = await axios.get(`${API_URL}/users/settings`, {
            headers: {
                'x-auth-token': authToken
            }
        });
        console.log('✅ Settings retrieved:', settingsResponse.data);

    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('❌ Error Response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('❌ No response received:', error.message);
            console.error('Is the server running on port 5000?');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('❌ Error:', error.message);
        }
    }
}

// Run the tests
console.log('Starting authentication tests...\n');
testAuthentication();