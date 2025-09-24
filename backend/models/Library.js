const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  volumeInfo: {
    title: String,
    subtitle: String,
    authors: [String],
    publisher: String,
    publishedDate: String,
    description: String,
    pageCount: Number,
    categories: [String],
    averageRating: Number,
    ratingsCount: Number,
    imageLinks: {
      thumbnail: String,
      smallThumbnail: String
    },
    language: String,
    industryIdentifiers: [{
      _id: false,
      type: { type: String },
      identifier: { type: String }
    }]
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  inNest: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only have one entry per book
librarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;