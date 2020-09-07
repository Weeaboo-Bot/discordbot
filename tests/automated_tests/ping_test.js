const { remote } = require('webdriverio');
let { browser } = require('./login_util');
const { email, password } = require('../../config');

(async () => {
	browser = await remote({
		capabilities: { browserName: 'chrome' },

	});

	await browser.navigateTo('https://discord.com/login?redirect_to=%2Fchannels%2F713913408881426472%2F715437135213363271');


	// Login
	const userInput = await browser.$('input[name="email"]');
	await userInput.setValue(email);
	const passwordInput = await browser.$('input[name="password"]');
	await passwordInput.setValue(password);
	const loginButton = await browser.$('input[type="submit"]');
    loginButton.click();
 
    console.log(await browser.getTitle());
    


	const searchInput = await browser.$('#form-2fGMdu');
	await searchInput.setValue('~ping');

	await browser.keys('Enter');

	console.log(await browser.getTitle());

	await browser.deleteSession();

})().catch((err) => {
	console.error(err);
	return browser.deleteSession();
});