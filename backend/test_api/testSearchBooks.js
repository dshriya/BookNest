const axios = require('axios');
require('dotenv').config();

async function testSearchBooks() {
    try {
        console.log('Testing book search...');
        const query = 'Harry Potter';
        const url = `https://www.googleapis.com/books/v1/volumes`;
        
        const response = await axios.get(url, {
            params: {
                q: query,
                maxResults: 2,
                key: process.env.GOOGLE_BOOKS_API_KEY
            }
        });

        console.log('\n✅ Search Successful!');
        console.log('\nResults:');
        response.data.items.forEach((item, index) => {
            console.log(`\nBook ${index + 1}:`);
            console.log('Title:', item.volumeInfo.title);
            console.log('Authors:', item.volumeInfo.authors?.join(', ') || 'No authors listed');
            console.log('Published:', item.volumeInfo.publishedDate);
            console.log('ID:', item.id);
        });
    } catch (error) {
        console.error('\n❌ Search Failed!');
        if (error.response) {
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testSearchBooks();