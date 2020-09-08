// Modules to format timestamps in logging
const moment = require('moment'), m = require('./loggerColor');

module.exports = class CustomLogger {

  static log(content, type = 'log') {

    /**
     * Adds a timestamp to the input string
     * @param {string} string Text to Log
     * @returns {string} The Formatted Text
     */
    function log(string) {
      return console.log(
          `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${string}`);
    }

    switch (type) {
    case 'output': {
      return log('🗐 ' + m.log(content));
    }
    case 'success': {
      return log('✔️  ' + m.successMsg(content));
    }
    case 'warning': {
      return log('🔔  ' + m.warningMsg(content));
    }
    case 'error': {
      return log('❌  ' + m.errorMsg(content));
    }
    case 'splitter': {
      return log(m.splitter(content));
    }
    case 'cmd': {
      return log('📂  ' + m.cmdLoad(content));
    }
    case 'acmd': {
      return log('🚨  ' + m.cmdLoad(content));
    }
    case 'mcmd': {
      return log('🎼  ' + m.cmdLoad(content));
    }
    case 'gcmd': {
      return log('🎲  ' + m.cmdLoad(content));
    }
    case 'rpgcmd': {
      return log('⚔️  ' + m.cmdLoad(content));
    }
    case 'twitch': {
      return log('🎮  ' + m.custom(content));
    }
    case 'tweet': {
      return log('🐦  ' + m.twitter(content));
    }
    }
  }
}
