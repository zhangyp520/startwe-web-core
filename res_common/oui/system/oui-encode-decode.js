//加密解密开始
oui.encode4des = function(message,key){
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var enCfg= {};
    enCfg.mode = CryptoJS.mode.ECB;
    enCfg.padding = CryptoJS.pad.Pkcs7;
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, enCfg);
    return encrypted.ciphertext.toString();
};
oui.decode4des = function(message,key){
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var deTextCfg = {};
    deTextCfg.ciphertext = CryptoJS.enc.Hex.parse(message);
    var deCfg = {};
    deCfg.mode =  CryptoJS.mode.ECB;
    deCfg.padding = CryptoJS.pad.Pkcs7;
    var decrypted = CryptoJS.DES.decrypt(deTextCfg , keyHex, deCfg);
    return decrypted.toString(CryptoJS.enc.Utf8);
};

