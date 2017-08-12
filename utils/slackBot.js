'use strict';

var logger = require('../utils/logger.js');
var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
	token: 'xoxb-225860073970-slg6XKntRwEwqvxkqmrFTtYP', // Add a bot https://my.slack.com/services/new/bot and put the token
	name: 'Pluviam Bot'
});

bot.on('start', function () {
	console.log('Slack bot started');
});



var sendMessage = function (message) {
	// var options = {
	// 	host: 'api.telegram.org',
	// 	port: 443,
	// 	path: '/bot264564233:AAGLuB4TcWAGVaBI8dbAS27aw-9pLp5xk_c/sendMessage?chat_id=217126464&parse_mode=html&text=' + encodeURIComponent(message),
	// 	method: 'GET'
	// };
	// var reqTelegram = https.get(options, function (res) {
	// 	res.on('data', function (d) {
	// 		process.stdout.write(d);
	// 	});
	// });
	// reqTelegram.end();
	//
	// reqTelegram.on('error', function (e) {
	//
	// });


	bot.postMessageToChannel('server-bots', message).fail(function (error) {
		logger.error('Error sending Slack message:' + error);
	});
};

module.exports = {
	sendMessage: sendMessage
};
