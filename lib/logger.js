
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: './logs/main.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 50,
            colorize: false,
			timestamp: customTimestamp,
			formatter: customFileFormatter
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
		})
	],
	exitOnError: false
});

module.exports = logger;
module.exports.stream = {
	write: function (message, encoding) {
		logger.info(message);
	}
};

function customFileFormatter (options) {
	return options.timestamp() + ' [' + options.level.toUpperCase() + '] ' + (undefined !== options.message ? options.message : '') +
	(options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
}
function customTimestamp () {
	var now = new Date();
	return now.toISOString();
}

// logger.log('silly', "127.0.0.1 - there's no place like home");
// logger.log('debug', "127.0.0.1 - there's no place like home");
// logger.log('verbose', "127.0.0.1 - there's no place like home");
// logger.log('info', "127.0.0.1 - there's no place like home");
// logger.log('warn', "127.0.0.1 - there's no place like home");
// logger.log('error', "127.0.0.1 - there's no place like home");
// logger.info("127.0.0.1 - there's no place like home");
// logger.warn("127.0.0.1 - there's no place like home");
// logger.error("127.0.0.1 - there's no place like home");
