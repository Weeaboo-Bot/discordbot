const { createLogger, format, transports } = require('winston');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Custom log formatting
const logFormat = format.printf((info) => {
    const id = uuidv4();
    let log;
    const { timestamp, level, label, message, ...rest } = info;
    if (level == 'error') {
        log = `${id} ERROR - ${timestamp} - ${level} [${label}]: ${message}`;
    }
    log = `${timestamp} - ${level} [${label}]: ${message}`;

    // Check if rest is an object
    if (!(Object.keys(rest).length === 0 && rest.constructor === Object)) {
        log = `${log}\n${JSON.stringify(rest, null, 2)}`.replace(/\\n/g, '\n');
    }
    return log;
});


  const errorFormat = format.printf((info) => {
    const id = uuidv4();
    const { timestamp, level, label, message, ...rest } = info;
    let log = `${id} - ERROR - ${timestamp} - ${level} [${label}]: ${message}`;
    if (!(Object.keys(rest).length === 0 && rest.constructor === Object)) {
        log = `${log}\n${JSON.stringify(rest, null, 2)}`.replace(/\\n/g, '\n');
    }
    return log;
  });


/**
 * Create a new logger
 * @type {Logger}
 */
const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.errors({ stack: true }),
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
        // Logging to console
        new transports.Console({
            level: 'info',
            format: format.combine(format.colorize(), logFormat),
        }),
        new transports.Console({
            level: 'error',
            format: format.combine(format.colorize(), errorFormat),
        }),
        // Logging info and up to file
        new transports.File({
            filename: path.join(__basedir, 'logs/full.log'),
            level: 'info',
            format: logFormat,
            options: { flags: 'w' },
        }),
        // Logging only warns and errors to file
        new transports.File({
            filename: path.join(__basedir, 'logs/error.log'),
            level: 'warn',
            format: logFormat,
            options: { flags: 'w' },
        }),
    ],
});

module.exports = logger;
