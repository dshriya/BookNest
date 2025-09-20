const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

async function testGoogleBooksAPI() {
    try {
        console.log('Testing Google Books API connection...');
        
        // Simple search for "Harry Potter" with max 2 results
        const response = await axios.get(GOOGLE_BOOKS_API_URL, {
            params: {
                q: 'Harry Potter',
                maxResults: 2,
                key: API_KEY
            }
        });

        if (response.data && response.data.items) {
            console.log('\n✅ API Connection Successful!');
            console.log('\nSample book found:');
            const book = response.data.items[0].volumeInfo;
            console.log('Title:', book.title);
            console.log('Authors:', book.authors);
            console.log('Published:', book.publishedDate);
        }
    } catch (error) {
        console.error('\n❌ API Connection Failed!');
        if (error.response) {
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testGoogleBooksAPI();