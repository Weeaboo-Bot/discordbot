//Modules to format timestamps in logging
const   moment = require('moment'),
    m = require('./consoleColor');

/**
 * @param {string} string Text to Log
 */
module.exports = (string) => {
    log("📄  "+string);
}
/**
 * @param {string} string Text to Log
 */
module.exports.success = (string) => {
    return log("✔️  "+m.successMsg(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.warning = (string) => {
    return log("🔔  "+m.warningMsg(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.error = (string) => {
    return log("❌  "+m.errorMsg(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.splitter = (string) => {
    return log(m.splitter(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.cmd = (string) => {
    return log("👌  "+m.cmdLoad(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.mcmd = (string) => {
    return log("🎼  "+m.cmdLoad(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.gcmd = (string) => {
    return log("🎲  "+m.cmdLoad(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.acmd = (string) => {
    return log("🚨  "+m.cmdLoad(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.rpgcmd = (string) => {
    return log("⚔️  "+m.cmdLoad(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.twitch = (string) => {
    return log("🎮  "+m.custom(string));
}
/**
 * @param {string} string Text to Log
 */
module.exports.tweet = (string) => {
    return log("🐦  "+m.twitter(string));
}
/**
 * Adds a timestamp to the input string
 * @param {string} string Text to Log
 * @returns {string} The Formatted Text
 */
function log(string) {
    return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${string}`);
}