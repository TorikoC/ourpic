const Image = require('../models/Image');
const fs = require('fs');

const CronJob = require('cron').CronJob;
// 每12小时执行一次
const job = new CronJob('0 0 */12 * * *', function() {
  console.log('清理过期图片定时任务开始');
  const where = {
    expiredAt: {
      $lt: new Date().getTime()
    }
  };
  Image.find(where, { path: 1 }, (err, result) => {
    if (err) {
      return;
    }
    if (!result) {
      return;
    }
    result.forEach(obj => {
      if (!obj.path) {
        return;
      }
      console.log('unlink: ', obj.path);
      fs.unlink(obj.path, err => {
        if (err) {
          return;
        }
      });
    });
    Image.remove(where, error => {
      if (error) {
        console.log('error', error);
        return;
      }
      console.log('清理过期图片定时任务结束');
    });
  });
});

module.exports = job;
