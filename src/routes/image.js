const path = require('path');

const router = require('express').Router();
const multer = require('multer');
const config = require('config');
const md5 = require('md5');
const base62 = require('base62/lib/ascii');

const ImageService = require('../services/image');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function(req, file, cb) {
    const type = file.originalname.split('.').pop();
    const filename = base62
      .encode(parseInt(md5(`${file.originalname}-${Date.now()}`), 16))
      .substr(0, config.get('hash_length'));
    cb(null, `${filename}.${type}`);
  }
});

const upload = multer({ storage });

router.post('/api/images', upload.single('image'), (req, res) => {
  const image = {
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    path: path.join(__dirname, '../images', req.file.filename),
    size: req.file.size,
    createdAt: Date.now(),
    expiredAt: Date.now() + config.get('default_age'),
    url: `${req.protocol}://${req.headers.host}/${req.file.filename}`
  };
  ImageService.createImage(image)
    .then(result => {
      res.send(result.url);
    })
    .catch(error => {
      res.status(500);
      res.send('internal error');
    });
});

router.put('/api/images/:name', upload.none(), (req, res) => {
  const { name } = req.params;
  const age = +req.body.age || 0;

  const where = {
    filename: name
  };
  const option = {
    $set: {
      expiredAt: age + Date.now()
    }
  };
  ImageService.updateOneImage(where, option)
    .then(() => {
      res.status(200);
      res.end('ok');
    })
    .catch(() => {
      res.status(500);
      res.end('internal error');
    });
});

module.exports = router;
