const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Number,
    default: Date.now()
  }
});

const Feedback = mongoose.model('Feedback', schema);

module.exports = Feedback;
