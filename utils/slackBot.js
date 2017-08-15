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
	bot.postMessageToChannel('server-bots', message).fail(function (error) {
		logger.error('Error sending Slack message:' + error);
	});
};

module.exports = {
	sendMessage: sendMessage
};
