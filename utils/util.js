'use strict';

var startTime = process.hrtime();
var crypto = require('crypto');

var isValidToken = function (passwordFromDb, saltFromDb, hashFromReq) {
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

var getMicrotime = function () {
	return process.hrtime(startTime);
};

module.exports = {
	isValidToken: isValidToken,
	isEmpty: isEmpty,
	isNotEmpty: isNotEmpty,
	getMicrotime: getMicrotime
};
