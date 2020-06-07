const { Then,When,Given } = require('cucumber');
const { auto_testing_link, auto_testing_password, auto_testing_user} = require('../../../../config');
const { Builder, By, Key, until } = require('selenium-webdriver');
const login = require('./DiscordLogin')

Given(/^command !ping$/, function() {
		console.log('This is the !ping command Test')
});
When(/^I type !ping$/, async function() {
	
	//First login
	let driver = await new Builder().forBrowser('chrome').build();
const msg = '~ping';
const msgForm = By.css('.textArea-12jD-V')
	// setTimeout(function() {
	// 	login()
	// }, 5000);
	try{
		await driver.get(auto_testing_link);
		await driver.findElement(msgForm).sendKeys(msg, Key.RETURN);
		
	} catch (e) {
		console.log(e);
	} finally {
		await driver.quit();
	}


});
Then(/^Weboo Bot will respond with a Pong string$/, function() {

});