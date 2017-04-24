var NodeRSA = require('node-rsa');
var Promise = require('promise');
var promisify = require('es6-promisify');
var fs=require("fs");   

var options = {
  encryptionScheme: {
    scheme: 'pkcs1', //scheme
    hash: 'md5', //hash using for scheme
  },
  signingScheme: {
    scheme: 'pkcs1', //scheme
    hash: 'sha1', //hash using for scheme
  }
}

var fileread = promisify(fs.readFile);

exports.decrypt = function(text) {
  
  return fileread(__dirname + '/private_key','utf-8').then(function(data) {
    var key = new NodeRSA(data, 'pkcs1', options);
    return new Promise(function(resolve, reject) {
      var result = key.decrypt(text, 'utf8');
      resolve(result);
    })
  })
}

exports.encrypt = function(text) {
  
  return fileread(__dirname + '/private_key','utf-8').then(function(data) {
    var key = new NodeRSA(data, 'pkcs1', options);
    return new Promise(function(resolve, reject) {
      var result = key.encrypt(text, 'base64');
      resolve(result);
    })
  })
}