const CryptoJS = require("crypto-js");

module.exports = {
    // des加密
    encrypt: function (data, key) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const encrypted = CryptoJS.DES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    // des解密
    decrypt: function (data, key) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        // direct decrypt ciphertext
        const decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(data)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            //这一步 是来填写 加密时候填充方式 padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}