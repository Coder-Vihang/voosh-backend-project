const AccessRoles = {
    ADMIN: 1,
    PUBLIC: 2,
    PRIVATE: 3
}

const JWTConstants = {
    EXPIRY: '1h'
}

const AWSConstants= {
    S3: 's3'
}

module.exports = {
    AccessRoles,
    JWTConstants,
    AWSConstants
}