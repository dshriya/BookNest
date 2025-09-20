const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  googleBookId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  authors: [{
    type: String
  }],
  description: String,
  pageCount: Number,
  categories: [{
    type: String
  }],
  imageLinks: {
    thumbnail: String,
    smallThumbnail: String
  },
  publishedDate: String,
  publisher: String,
  averageRating: Number,
  userRatings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  }],
  addedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);
