const {Key} = require('selenium-webdriver');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    promise = require('selenium-webdriver').promise;

var BasePage = require('./BasePage');

const CHANNELS_BUTTON = By.css('#tviplayer > div.ipNav.ipNav--iplayer > ul > li.ipNav__item.item--channels > button');
const CBEEBIES = By.css('#tvip-channels-stream-inner > ul > li.tvip-channel-cbeebies > a > img');
const CBEEBIES_IPLAYER = By.css('#walled-garden > div.popup.enter.cbeebies > div.body > div > a'); // #walled-garden > div.popup.enter.cbeebies > div.body > div > a
const PETER_RABBIT = By.linkText("Peter Rabbit");
const SEARCH_BOX = By.css('#orb-search-q');
const Cbbebies_logo = By.css('.children-logo');
const video_1 = By.css('#main > div > ul > li:nth-child(1) > div > a > div.primary > div.overlay');
const play_button = By.css('.play-cta');
const no_thanks = By.linkText('No thanks');

class HomePage extends BasePage {
    async navigateToGet() {
        await driver.get("https://www.bbc.co.uk/iplayer");
    }

    async gotocbeebies() {
        await this.captureScreenshot('CHANNELS_BUTTON.png', 'shot', '0_CHANNELS_BUTTON.png', 'shot', CHANNELS_BUTTON);
        await  this.click(CHANNELS_BUTTON, 4);
        await this.captureScreenshot('CBEEBIES.png', 'shot', '1_CBEEBIES.png', 'shot', CBEEBIES);
        await this.click(CBEEBIES, 4);
        await this.captureScreenshot('CBEEBIES_IPLAYER.png', 'shot', '2_CBEEBIES_IPLAYER.png', 'shot', CBEEBIES_IPLAYER);
        await this.click(CBEEBIES_IPLAYER, 2);
        await this.captureScreenshot('cbbebies.png', 'shot', '3_cbbebies.png', 'shot', Cbbebies_logo);
    }

    async goto_peter_rabbit() {
        await this.sendKeys(SEARCH_BOX, "peter rabbit");
        await this.captureScreenshot('SEARCH_BOX.png', 'shot', '4_SEARCH_BOX.png', 'shot', SEARCH_BOX);
        await this.click(PETER_RABBIT, 2);
    }

    async gotofirstvideo(){
        await this.waitForVisible(video_1);
        await this.captureScreenshot('video_1.png', 'shot', '5_video_1.png', 'shot', video_1);
        await this.click(video_1);
        await this.click(play_button);
    }
}

module.exports = new HomePage();