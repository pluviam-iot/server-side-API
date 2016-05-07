'use strict';

var crypto = require('crypto');

var isValidPassword = function (passwordFromDb, saltFromDb, hashFromReq) {
	var passwordDigested = crypto.createHmac('sha256', saltFromDb).update(hashFromReq).digest('hex');
	console.log('passwordFromDb:' + passwordFromDb + ' saltFromDb:' + saltFromDb + ' hashFromReq:' + hashFromReq + ' passwordDigested:' + passwordDigested);
	return (passwordDigested === passwordFromDb);
};

var isNotEmpty = function (item) {
	return typeof item !== 'undefined' && item;
};

var isEmpty = function (item) {
	return !(typeof item !== 'undefined' && item);
};

module.exports = {
  isValidPassword: isValidPassword,
  isEmpty: isEmpty,
  isNotEmpty: isNotEmpty
};
