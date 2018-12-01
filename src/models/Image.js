const mongoose = require('mongoose');

const schema = mongoose.Schema({
  filename: {
    type: String
  },
  mimetype: {
    type: String
  },
  path: {
    type: String
  },
  size: {
    // bytes
    type: Number
  },
  url: {
    type: String
  },
  createdAt: {
    // ms
    type: Number
  },
  expiredAt: {
    type: Number
  }
});

const Image = mongoose.model('Image', schema);

module.exports = Image;
