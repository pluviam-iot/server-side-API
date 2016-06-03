'use strict';

var crypto = require('crypto');

var isValidPassword = function (passwordFromDb, saltFromDb, hashFromReq) {
	var passwordDigested = crypto.createHmac('sha256', saltFromDb).update(hashFromReq).digest('hex');
	console.log('passwordFromDb:' + passwordFromDb + ' saltFromDb:' + saltFromDb + ' hashFromReq:' + hashFromReq + ' passwordDigested:' + passwordDigested);
	return (passwordDigested === passwordFromDb);
};

module.exports = {
  isValidPassword: isValidPassword
};
