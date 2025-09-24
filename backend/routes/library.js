const express = require('express');
const router = express.Router();
const Library = require('../models/Library');
const auth = require('../middleware/auth');

// Helper function to sanitize volumeInfo
const sanitizeVolumeInfo = (volumeInfo) => {
  try {
    if (!volumeInfo) return {};
    
    // Create a clean object with only the fields we expect
    const sanitized = {
      title: volumeInfo.title || '',
      subtitle: volumeInfo.subtitle || '',
      authors: Array.isArray(volumeInfo.authors) ? volumeInfo.authors : [],
      publisher: volumeInfo.publisher || '',
      publishedDate: volumeInfo.publishedDate || '',
      description: volumeInfo.description || '',
      pageCount: typeof volumeInfo.pageCount === 'number' ? volumeInfo.pageCount : null,
      categories: Array.isArray(volumeInfo.categories) ? volumeInfo.categories : [],
      averageRating: typeof volumeInfo.averageRating === 'number' ? volumeInfo.averageRating : null,
      ratingsCount: typeof volumeInfo.ratingsCount === 'number' ? volumeInfo.ratingsCount : null,
      language: volumeInfo.language || '',
      imageLinks: {
        thumbnail: volumeInfo.imageLinks?.thumbnail || '',
        smallThumbnail: volumeInfo.imageLinks?.smallThumbnail || ''
      }
    };

    // Handle industry identifiers
    try {
      if (Array.isArray(volumeInfo.industryIdentifiers)) {
        // Handle array of objects
        sanitized.industryIdentifiers = volumeInfo.industryIdentifiers
          .filter(identifier => identifier && typeof identifier === 'object')
          .map(identifier => ({
            type: String(identifier.type || ''),
            identifier: String(identifier.identifier || '')
          }));
      } else if (typeof volumeInfo.industryIdentifiers === 'string') {
        // Handle stringified array
        const parsed = JSON.parse(volumeInfo.industryIdentifiers);
        if (Array.isArray(parsed)) {
          sanitized.industryIdentifiers = parsed
            .filter(identifier => identifier && typeof identifier === 'object')
            .map(identifier => ({
              type: String(identifier.type || ''),
              identifier: String(identifier.identifier || '')
            }));
        } else {
          sanitized.industryIdentifiers = [];
        }
      } else {
        sanitized.industryIdentifiers = [];
      }
    } catch (e) {
      console.error('Error processing industryIdentifiers:', e);
      console.error('Original industryIdentifiers:', volumeInfo.industryIdentifiers);
      sanitized.industryIdentifiers = [];
    }

    // Ensure all fields are properly typed according to schema
    if (!sanitized.title) sanitized.title = 'Unknown Title';
    if (!Array.isArray(sanitized.authors)) sanitized.authors = [];
    if (!Array.isArray(sanitized.categories)) sanitized.categories = [];
    if (!sanitized.imageLinks) sanitized.imageLinks = {};
    if (!Array.isArray(sanitized.industryIdentifiers)) sanitized.industryIdentifiers = [];

    // Ensure each industry identifier is properly formatted
    sanitized.industryIdentifiers = sanitized.industryIdentifiers.map(identifier => ({
      type: String(identifier.type || ''),
      identifier: String(identifier.identifier || '')
    }));

    return sanitized;
  } catch (error) {
    console.error('Error sanitizing volumeInfo:', error);
    console.error('Received volumeInfo:', JSON.stringify(volumeInfo, null, 2));
    // Return a minimal valid object rather than throwing
    return {
      title: volumeInfo?.title || 'Unknown Title',
      authors: [],
      imageLinks: {},
      industryIdentifiers: []
    };
  }
};

// Get book status in user's library
router.get('/status/:bookId', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const library = await Library.findOne({
      userId: req.user._id,
      bookId: req.params.bookId
    });

    if (!library) {
      return res.json({
        bookId: req.params.bookId,
        isLiked: false,
        inNest: false,
        addedAt: null,
        userId: req.user._id
      });
    }

    res.json({
      bookId: library.bookId,
      isLiked: library.isLiked,
      inNest: library.inNest,
      addedAt: library.addedAt,
      userId: library.userId
    });
  } catch (error) {
    console.error('Error getting book status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle like status
router.post('/like', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: 'User ID is required' });
    }

    const { bookId, volumeInfo } = req.body;
    const sanitizedVolumeInfo = sanitizeVolumeInfo(volumeInfo);

    let library = await Library.findOne({ userId: req.user._id, bookId });

    if (library) {
      library.isLiked = !library.isLiked;
      library.volumeInfo = sanitizedVolumeInfo;
      await library.save();
    } else {
      library = new Library({
        userId: req.user._id,
        bookId,
        volumeInfo: sanitizedVolumeInfo,
        isLiked: true,
        addedAt: new Date()
      });
      console.log('Creating new library entry:', {
        userId: req.user._id,
        bookId,
        isLiked: true
      });
      await library.save();
    }

    res.json({ 
      success: true, 
      message: 'Like status updated successfully',
      isLiked: library.isLiked
    });
  } catch (error) {
    console.error('Error toggling like status:', error);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Library validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
});

// Toggle nest status
router.post('/nest', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      console.error('No user ID in request');
      return res.status(401).json({ success: false, message: 'User ID is required' });
    }

    console.log('Nest request received:', {
      userId: req.user._id,
      bookId: req.body.bookId
    });

    const { bookId, volumeInfo } = req.body;
    console.log('Raw volumeInfo:', JSON.stringify(volumeInfo, null, 2));
    
    const sanitizedVolumeInfo = sanitizeVolumeInfo(volumeInfo);
    console.log('Sanitized volumeInfo:', JSON.stringify(sanitizedVolumeInfo, null, 2));

    let library = await Library.findOne({ userId: req.user._id, bookId });
    console.log('Existing library entry:', library);

    if (library) {
      library.inNest = !library.inNest;
      library.volumeInfo = sanitizedVolumeInfo;
      await library.save();
    } else {
      library = new Library({
        userId: req.user._id,
        bookId,
        volumeInfo: sanitizedVolumeInfo,
        inNest: true
      });
      await library.save();
    }

    res.json({ 
      success: true, 
      message: 'Nest status updated successfully',
      inNest: library.inNest
    });
  } catch (error) {
    console.error('Error toggling nest status:', error);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Library validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
});

// Get all liked books
router.get('/liked', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const likedBooks = await Library.find({
      userId: req.user._id,
      isLiked: true
    }).sort({ addedAt: -1 });

    res.json(likedBooks.map(book => ({
      id: book.bookId,
      volumeInfo: book.volumeInfo
    })));
  } catch (error) {
    console.error('Error getting liked books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all books in nest
router.get('/nest', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const nestBooks = await Library.find({
      userId: req.user._id,
      inNest: true
    }).sort({ addedAt: -1 });

    res.json(nestBooks.map(book => ({
      id: book.bookId,
      volumeInfo: book.volumeInfo
    })));
  } catch (error) {
    console.error('Error getting nest books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;