/* 
   加密解密方法
   
   使用aes.js加密   
*/
let CryptoJS = require("./aes")

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse('wx16b7359e1021fc')
const IV = CryptoJS.enc.Utf8.parse('wx16b7359e1021fc')

/**
 * AES加密 ：字符串 key iv  返回base64
 */
function Encrypt(word, keyStr, ivStr) {
   let key = KEY
   let iv = IV

   if (keyStr) {
      key = CryptoJS.enc.Utf8.parse(keyStr);
      iv = CryptoJS.enc.Utf8.parse(ivStr);
   }
   let srcs = CryptoJS.enc.Utf8.parse(word);
   let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
   });
   let hexStr = encrypted.ciphertext.toString().toUpperCase();
   return hexStr
}

/**
 * AES解密 ：字符串 key iv  返回base64
 *
 */
function Decrypt(word, keyStr, ivStr) {
   let key = KEY
   let iv = IV

   if (keyStr) {
      key = CryptoJS.enc.Utf8.parse(keyStr);
      iv = CryptoJS.enc.Utf8.parse(ivStr);
   }

   let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
   let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
   let decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
   });
   let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
   return decryptedStr.toString();
}

export default {
   Encrypt,
   Decrypt
}