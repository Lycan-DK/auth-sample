var multer = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var config = require('../config.js');

aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    secretAccessKey: config.aws.SECRET_ACCESS_KEY,
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    accessKeyId: config.aws.SECRET_ACCESS_ID,
    region: config.aws.REGION_NAME // region of your bucket
});

var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: config.aws.BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString()+ file.originalname)
      }
    })
  });

module.exports = upload;