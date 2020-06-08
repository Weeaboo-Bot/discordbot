const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');

// let discordFirefoxDriver = new webdriver.Builder()
// 		.forBrowser('firefox')
// 		.setChromeOptions(/* ... */)
// 		.setFirefoxOptions(/* ... */)
// 		.build();




let discordChromeDriver = new webdriver.Builder()
		.forBrowser('chrome')
		.setChromeOptions(/* ... */)
		.setFirefoxOptions(/* ... */)
		.build();
//
// let discordEdgeDriver = new webdriver.Builder()
// 		.forBrowser('edge')
// 		.setEdgeOptions(/* ... */)
// 		.setFirefoxOptions(/* ... */)
// 		.build();



module.exports = {
	discordChromeDriver
};