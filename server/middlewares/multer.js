const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    // region: 'eu-west'
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        s3,
        bucket: 'djordjetest',
        key: (req,file,cb) => {
            cb(null, file.originalname);
        }
    })
}).single('answer');

module.exports =  upload;