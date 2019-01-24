/**
*@author zhaohuatai
*/
var pebmd5des={
 iterations : 1000,
encrypt: function( data,  password,  salt){
	
	var password = CryptoJS.enc.Utf8.parse(password);
	var saltHexStrFromFun=pebmd5des.strToHexCharCode(salt);
	var salt = CryptoJS.enc.Hex.parse(saltHexStrFromFun);
	

	var md5 = CryptoJS.algo.MD5.create();
	md5.update(password);
	md5.update(salt);
	var result = md5.finalize();
	md5.reset();
	for(var i = 1; i < pebmd5des.iterations; i++) {
	    md5.update(result);
	    result = md5.finalize();
	    md5.reset();
	}
	var key = CryptoJS.lib.WordArray.create(result.words.slice(0, 2));
	var iv = CryptoJS.lib.WordArray.create(result.words.slice(2, 4));
	var encryptedHex = CryptoJS.DES.encrypt(data, key, { iv: iv});
	return encryptedHex.toString();
},

decrypt: function( encryptedHex,  password, salt){
	var password = CryptoJS.enc.Utf8.parse(password);
	
	var saltHexStrFromFun=pebmd5des.strToHexCharCode(salt);
	var salt = CryptoJS.enc.Hex.parse(saltHexStrFromFun);


	var md5 = CryptoJS.algo.MD5.create();
	md5.update(password);
	md5.update(salt);
	var result = md5.finalize();
	md5.reset();
	for(var i = 1; i < pebmd5des.iterations; i++) {
	    md5.update(result);
	    result = md5.finalize();
	    md5.reset();
	}
	var key = CryptoJS.lib.WordArray.create(result.words.slice(0, 2));
	var iv = CryptoJS.lib.WordArray.create(result.words.slice(2, 4));
	
	var decryptedHex = CryptoJS.DES.decrypt( { ciphertext: CryptoJS.enc.Hex.parse(encryptedHex) }, key, { iv: iv});
	
	var decryptedASCII=pebmd5des.hexCharCodeToStr(""+decryptedHex);
	return decryptedASCII;
},


strToHexCharCode: function (str) {
	if (str === "") {
		return "";
	} else {
		var hexCharCode = [];
		//hexCharCode.push("0x");
		for (var i = 0; i < str.length; i++) {
			hexCharCode.push((str.charCodeAt(i)).toString(16));
		}
		return hexCharCode.join("");
	}
},
 
hexCharCodeToStr: function (hexCharCodeStr) {
	var trimedStr = hexCharCodeStr;//.trim();
	var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		alert("illegal characters!");
		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16);
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");

}
}