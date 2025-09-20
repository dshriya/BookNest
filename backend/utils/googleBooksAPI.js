const axios = require('axios');

const axios = require('axios');
require('dotenv').config();

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY; // We'll set this up in .env

class GoogleBooksAPI {
  static async searchBooks(query, maxResults = 10) {
    try {
      const response = await axios.get(GOOGLE_BOOKS_API_URL, {
        params: {
          q: query,
          maxResults: maxResults,
          key: process.env.GOOGLE_BOOKS_API_KEY
        }
      });

      return response.data.items.map(book => ({
        googleBookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        description: book.volumeInfo.description,
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories || [],
        imageLinks: book.volumeInfo.imageLinks,
        publishedDate: book.volumeInfo.publishedDate,
        publisher: book.volumeInfo.publisher,
        averageRating: book.volumeInfo.averageRating
      }));
    } catch (error) {
      console.error('Error searching Google Books:', error.message);
      throw new Error('Failed to search books');
    }
  }

  static async getBookById(googleBookId) {
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/${googleBookId}`, {
        params: {
          key: API_KEY
        }
      });

      const book = response.data;
      return {
        googleBookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        description: book.volumeInfo.description,
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories || [],
        imageLinks: book.volumeInfo.imageLinks,
        publishedDate: book.volumeInfo.publishedDate,
        publisher: book.volumeInfo.publisher,
        averageRating: book.volumeInfo.averageRating
      };
    } catch (error) {
      console.error('Error fetching book details:', error.message);
      throw new Error('Failed to fetch book details');
    }
  }
}

module.exports = GoogleBooksAPI;
