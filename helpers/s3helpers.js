function generateS3KeyFromUserId(userId, originalFilename) {
    const date = new Date();
    const year = date.getFullYear();
    const key = `user/${year}/${userId}/${originalFilename}`;
    return key;
}

module.exports = {
    generateS3KeyFromUserId
}