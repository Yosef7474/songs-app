const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
songSchema.index({ artist: 1, album: 1 });
songSchema.index({ genre: 1 });

module.exports = mongoose.model('Song', songSchema);