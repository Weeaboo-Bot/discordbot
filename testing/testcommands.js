const {Builder, By, Key, until} = require('selenium-webdriver');

(async function testActionCommands() {
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        await driver.get('https://discordapp.com/api/v6/channels/715437135213363271/messages');
        await driver.findElement(By.className('form-2fGMdU')).sendKeys('webdriver','!cry');

    } finally {
        await driver.quit();
    }
})();