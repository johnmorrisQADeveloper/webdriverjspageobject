const {Key} = require('selenium-webdriver');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    promise = require('selenium-webdriver').promise;

var BasePage = require('./BasePage');

const CHANNELS_BUTTON = By.css('#tviplayer > div.ipNav.ipNav--iplayer > ul > li.ipNav__item.item--channels > button');
const CBEEBIES = By.css('#tvip-channels-stream-inner > ul > li.tvip-channel-cbeebies > a > img');
const CBEEBIES_IPLAYER = By.css('#walled-garden > div.popup.enter.cbeebies > div.body > div > a');
const PETER_RABBIT = By.linkText("Peter Rabbit");

class HomePage extends BasePage {

    async navigateToGet() {
        await driver.get("https://www.bbc.co.uk/iplayer");
    }

    async gotocbeebies() {
        await  this.click(CHANNELS_BUTTON);
        await this.click(CBEEBIES);
        await this.click(CBEEBIES_IPLAYER);
    }

    async goto_peter_rabbit() {
        await this.click(PETER_RABBIT);
    }
}

module.exports = new HomePage();