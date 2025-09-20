const express = require('express');
const router = express.Router();
const GoogleBooksAPI = require('../utils/googleBooksAPI');
const Book = require('../models/Book');

// Search books from Google Books API
router.get('/search', async (req, res) => {
  try {
    const { query, maxResults } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const books = await GoogleBooksAPI.searchBooks(query, maxResults);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed information about a specific book
router.get('/:googleBookId', async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const book = await GoogleBooksAPI.getBookById(googleBookId);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
