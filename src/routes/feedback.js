const router = require('express').Router();
const FeedbackService = require('../services/feedback');
const multer = require('multer');

router.post('/api/feedbacks', multer().none(), (req, res) => {
  const { body } = req;
  FeedbackService.createFeedback(body)
    .then(result => {
      res.status(200);
      res.send('ok');
    })
    .catch(error => {
      res.status(500);
      res.send('internal error');
    });
});

module.exports = router;
