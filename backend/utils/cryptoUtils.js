const crypto = require('crypto');

// Function to generate a pair of keys
function generateKeyPair() {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            if (err) {
                return reject(err);
            }
            resolve({ publicKey, privateKey });
        });
    });
}

// Function to sign data
function signData(data, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'base64');
}

// Function to verify a signature
function verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
}

// Exporting the utility functions
module.exports = {
    generateKeyPair,
    signData,
    verifySignature
};