const {Key} = require('selenium-webdriver');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    promise = require('selenium-webdriver').promise,
    Builder = require('selenium-webdriver').Builder;

var browser = require('./lib/common').testEnv();
if (browser == "chrome") {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
} else if (browser == "headless") {
    // headless chrome
    const chrome = require('selenium-webdriver/chrome');
    const width = 640;
    const height = 480;
    driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options().headless().windowSize({width, height}))
        .build();
} else if (browser == "firefox") {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
}

class BasePage {

    constructor() {
        global.driver = driver;
    }

    async sendKeys(WebDriverLocator, keys, retries) {
        try {
            const element = await driver.findElement(WebDriverLocator)
            await element.click()
            await element.clear()
            await element.sendKeys(keys)
            return
        } catch (err) {
            if (retries === 0) {
                throw new Error(`Unable to send keys to ${WebDriverLocator.toString()} after maximum retries, error : ${err.message}`)
            }
            await driver.sleep(250)
            return this.sendKeys(WebDriverLocator, keys, retries - 1)
        }
    }

    async click(WebDriverLocator, retries) {
        try {
            const element = await driver.findElement(WebDriverLocator)
            await element.click()
            return
        } catch (err) {
            if (retries === 0) {
                throw new Error(`Still not able to click ${WebDriverLocator.toString()} after maximum retries, Error message: ${err.message.toString()}`)
            }
            await driver.sleep(250)
            return this.click(WebDriverLocator, retries - 1)
        }
    }

    async quit() {
        if (browser == "firefox") {
            await driver.quit();
        } else {
            await driver.close();
            await driver.quit();
        }
    }
}

module.exports = BasePage;