const crypto = require('crypto');
 
const ENCRYPTION_KEY = 'u1n2o3a4p5p6C7I8a9n1n2d3A4I5D6A7'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
 
function encrypt(text) {
 let iv = crypto.randomBytes(IV_LENGTH);
 let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let encrypted = cipher.update(text);
 
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 
 return iv.toString('hex') + ':' + encrypted.toString('hex');
}
 
function decrypt(text) {
 let textParts = text.split(':');
 let iv = new Buffer(textParts.shift(), 'hex');
 let encryptedText = new Buffer(textParts.join(':'), 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let decrypted = decipher.update(encryptedText);
 
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 
 return decrypted.toString();
}
 
module.exports = { decrypt, encrypt };