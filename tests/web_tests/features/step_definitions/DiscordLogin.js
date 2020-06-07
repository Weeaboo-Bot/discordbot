const { auto_testing_link, auto_testing_password, auto_testing_user} = require('../../../../config');
const { Builder, By, Key, until } = require('selenium-webdriver');


module.exports = async function login(){
	//First login
	let driver = await new Builder().forBrowser('chrome').build();
	const email = By.css('div.marginBottom20-32qID7 > div:nth-child(2) > input:nth-child(1)');
	const pass = By.css('.block-egJnc0 > div:nth-child(2) > div:nth-child(2) > input:nth-child(1)');
	const loginButton = By.css('button.marginBottom8-AtZOdT')
	try{
		
		await driver.get('https://www.discord.com/login');
		await driver.findElement(email).sendKeys(auto_testing_user);
		await driver.wait(until.elementTextContains(email,auto_testing_user),1000);
		await driver.findElement(pass).sendKeys(auto_testing_password);
		await driver.wait(until.elementTextContains(pass,auto_testing_password),1000);
		await driver.findElement(loginButton).click();
		
	} catch (e) {
		console.log(e);
	} finally {
		await driver.quit();
	}
}