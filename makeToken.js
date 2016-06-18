'use strict';

var crypto = require('crypto');
var randomstring = require('randomstring');

var startTime = process.hrtime();
var salt = randomstring.generate({
	length: 32,
	charset: 'alphanumeric',
	capitalization: 'lowercase'
});

var token = randomstring.generate({
	length: 16,
	capitalization: 'lowercase',
	readable: true,
	charset: 'alphanumeric'
});

var passwordDigested = crypto.createHmac('sha256', salt).update(token).digest('hex');
console.log('\ntoken: ' + token);

console.error('\n"internal": {');
console.error('  "token": "' + passwordDigested + '",');
console.error('  "salt": "' + salt + '"');
console.error('},');

var diff = process.hrtime(startTime);
console.log(diff);
