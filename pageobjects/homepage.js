const {Key} = require('selenium-webdriver');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    promise = require('selenium-webdriver').promise;

var BasePage = require('./BasePage');

const CHANNELS_BUTTON = By.css('li.ipNav__item:nth-child(2)');
const CBEEBIES = By.css('#tvip-channels-stream-inner > ul > li.tvip-channel-cbeebies > a > img');
const CBEEBIES_IPLAYER = By.css('a.button:nth-child(1)'); // #walled-garden > div.popup.enter.cbeebies > div.body > div > a
const PETER_RABBIT = By.linkText("Peter Rabbit");
const SEARCH_BOX = By.css('#orb-search-q');
const Cbbebies_logo = By.css('.children-logo');

class HomePage extends BasePage {

    async navigateToGet() {
        await driver.get("https://www.bbc.co.uk/iplayer");
    }

    async gotocbeebies() {
        await  this.click(CHANNELS_BUTTON, 2);
        //await this.captureScreenshot('john.png', 'shot', 'new1.png', 'shot', CBEEBIES_IPLAYER);
        await this.click(CBEEBIES, 2);
        await this.captureScreenshot('john.png', 'shot', 'new2.png', 'shot', CBEEBIES_IPLAYER);
        await this.click(CBEEBIES_IPLAYER, 2);
        await this.captureScreenshot('john.png', 'shot', 'new3.png', 'shot', Cbbebies_logo);

    }

    async goto_peter_rabbit() {
        await this.sendKeys(SEARCH_BOX, "peter rabbit");
        await this.click(PETER_RABBIT, 2);
    }
}

module.exports = new HomePage();