//Modules to return coloured outputs for the console
const chalk = require('chalk');

module.exports = {

    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    successMsg:function(input){
        return(chalk.green(input));
    },
    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    warningMsg:function(input){
        return(chalk.yellow(input));
    },
    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    errorMsg: function(input) {
        return(chalk.red(input));
    },
    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    twitter:function(input) {
        return(chalk.cyan(`${input}`));
    },
    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    splitter:function(input) {
        return(chalk.magenta(`-- ${input} --`));
    },
    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    cmdLoad:function(input) {
        return(chalk.blue(`## ${input}`));
    },
    /**
     * @param {string} input Text to Format
     * @returns {string} Formatted Text
     */
    custom:function(input) {
        return(chalk.magenta(input));
    }
}