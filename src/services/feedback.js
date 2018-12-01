const Feedback = require('../models/Feedback');

module.exports = {
  createFeedback(option) {
    return Promise.resolve(Feedback.create(option));
  }
};
