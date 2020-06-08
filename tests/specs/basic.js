const {auto_testing_link_login,auto_testing_password,auto_testing_user} = require('../../config');
const driver = require('webdriverio');

describe('Discord Login', () => {
	it('should have the right title', async () => {
		const titleElm = $('div.colorHeaderPrimary-26Jzh-:nth-child(1)');
		const emailElm = $('div.marginBottom20-32qID7 > div:nth-child(2) > input:nth-child(1)')
		const passElm = $('.block-egJnc0 > div:nth-child(2) > div:nth-child(2) > input:nth-child(1)');
		const button = $('button.marginBottom8-AtZOdT')
		await browser.url(auto_testing_link_login)
	//	await expect(browser).toHaveTitle('Discord')
		await expect(emailElm).toHaveText('Welcome back!')
	})
})