'use strict';

var https = require('https');
var logger = require('../utils/logger.js');

// module.exports = {
// 	sendMessage: sendMessage
// };

exports.sendMessage = function (message) {
	var options = {
		host: 'api.telegram.org',
		port: 443,
		path: '/bot264564233:AAGLuB4TcWAGVaBI8dbAS27aw-9pLp5xk_c/sendMessage?chat_id=217126464&parse_mode=html&text=' + encodeURIComponent(message),
		method: 'GET'
	};
	var reqTelegram = https.get(options, function (res) {
		res.on('data', function (d) {
			process.stdout.write(d);
		});
	});
	reqTelegram.end();

	reqTelegram.on('error', function (e) {
		logger.error('Error sending Telegram message:' + e);
	});
};

// if (validConfs()) {
// 	logger.info(util.getMicrotime() + ' - All environment variables found, continuing');
// 	logger.info(util.getMicrotime() + ' - Environment set: ' + environment);
// } else {
// 	logger.error(util.getMicrotime() + ' - Environment variables not found, exiting.');
// 	process.exit(1);
// }
