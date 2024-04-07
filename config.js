module.exports = {
  JWTSecretKey: process.env.JWTSecretKey,
  AWSConfig: {
    AccessKeyId: process.env.AccessKeyId,
    SecretAccessKey: process.env.SecretAccessKey,
    ImageS3Bucket: process.env.ImageS3Bucket,
    Region: process.env.Region,
    PreSignedUrlExpiry: process.env.PreSignedUrlExpiry,
    SignatureVersion: process.env.SignatureVersion
  },
  Google: {
    ClientId: process.env.ClientId,
    ClientSecret: process.env.ClientSecret
  },
  DatabaseKeys: {
    Database: process.env.Database,
    Host: process.env.Host,
    UserName: process.env.UserName,
    Password: process.env.Password,
    Dialect: process.env.Dialect
  }

};
