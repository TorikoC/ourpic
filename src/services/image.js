const Image = require('../models/Image');

module.exports = {
  createImage: option => {
    return Promise.resolve(Image.create(option));
  },
  deleteImage: where => {
    return Promise.resolve(Image.remove(where));
  },
  updateOneImage: (where, option) => {
    return Promise.resolve(Image.updateOne(where, option));
  }
};
