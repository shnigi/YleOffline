const CryptoJS = require('crypto-js');

/**
 * Fetch the current TV shows using JSONP and fetch JSONP polyfill.
 *
 * @param {string} url - The encrypted URL
 * @param {string} decryptKey - Your decryption key
 * @return {string} The decrypted URL
 */
export default function decrypt(url, decryptKey) {
  const data = CryptoJS.enc.Base64.parse(url).toString(CryptoJS.enc.Hex);
  const key = CryptoJS.enc.Utf8.parse(decryptKey);
  const iv = CryptoJS.enc.Hex.parse(data.substr(0, 32));
  const message = CryptoJS.enc.Hex.parse(data.substr(32));

  const options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };

  const params = CryptoJS.lib.CipherParams.create({ciphertext: message});
  const decryptedMessage = CryptoJS.AES.decrypt(params, key, options);
  return decryptedMessage.toString(CryptoJS.enc.Utf8);
}
