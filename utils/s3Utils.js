const AWS = require('aws-sdk');
const config = require('../config'); 

AWS.config.update({
    accessKeyId: config.AWSConfig.AccessKeyId,
    secretAccessKey: config.AWSConfig.SecretAccessKey,
    region: config.AWSConfig.Region,
    signatureVersion: config.AWSConfig.SignatureVersion
});

const s3 = new AWS.S3();

module.exports = s3;
