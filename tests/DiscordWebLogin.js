const {Builder, By, Key, until} = require('selenium-webdriver');
const {auto_testing_link_login,auto_testing_password,auto_testing_user} = require('../config');

(async function example() {
	let driver = await new Builder().forBrowser('firefox').build();
	const loginForm = By.className('html.full-motion.theme-dark.platform-web body div#app-mount.appMount-3lHmkl div.app-1q1i1E div.splashBackground-1FRCko.wrapper-3Q5DdO.scrollbarGhost-2F9Zj2.scrollbar-3dvm_9 div.leftSplit-1qOwnR div.wrapper-6URcxg div.pageContainer-3m3TSa form.authBoxExpanded-2jqaBe.authBox-hW6HRx.theme-dark');
	
	const emailField = By.css('div.marginBottom20-32qID7 > div:nth-child(2) > input:nth-child(1)');
	const passField = By.css('.block-egJnc0 > div:nth-child(2) > div:nth-child(2) > input:nth-child(1)')
	const loginButton = By.css('button.marginBottom8-AtZOdT')
	try {
		
		await driver.get("https://www.discord.com/login");
//		await driver.wait(until.elementIsVisible(loginButton),7000);
		await driver.findElement(emailField).sendKeys("sdoran0369@yahoo.com");
		await driver.findElement(passField).sendKeys("Cyclones#2022");
		await driver.findElement(loginButton).click();
		await driver.wait(until.titleIs('Discord'), 7000);
	} finally {
		await driver.quit();
	}
})();