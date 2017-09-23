const {Key} = require('selenium-webdriver');
const fs = require('fs');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    promise = require('selenium-webdriver').promise,
    Builder = require('selenium-webdriver').Builder;

var browser = require('../lib/common').testEnv();
if (browser == "chrome") {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
} else if (browser == "headless") {
    // headless chrome
    const chrome = require('selenium-webdriver/chrome');
    const width = 925;
    const height = 400;
    driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options().headless()/*.windowSize({width, height})*/)
        .build();
} else if (browser == "firefox") {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
}

const removeImage = (fileName) => {
    fs.unlink(fileName, (err) => {
        if (err) {
            console.log("failed to delete the file " + err.message);
        } else {
            console.log("file deleted ");
        }
    });
};

class BasePage {

    constructor() {
        global.driver = driver;
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(5000);
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
            await driver.sleep(550)
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
            await driver.sleep(550)
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


    // later at somepoint , de couple the methods i.e. get location, delete file, screenshot , and check if the files are different
    async captureScreenshot(screenShotFileName, screenShotFileLocation, elementScreenShotFileName, elementScreenShotFileLocation, webElement) {
        try {
            console.log("Element screenshot "+webElement);
            // gets the element location
            var x, y, h, w;

            var elementLocation = await driver.findElement(webElement)
            await elementLocation.getLocation().then(function (location) {
                x = location.x;
                y = location.y;
            });

            var elementSize = await driver.findElement(webElement);

            await elementSize.getSize().then(function (size) {
                h = size.height;
                w = size.width;
            })

            console.log("element x = " + x);
            console.log("element y = " + y);
            console.log("element h = " + h);
            console.log("element w = " + w);

            // takes screenshot of the entire page
            await driver.takeScreenshot().then(
                function (image, err) {
                    require('fs').writeFile(screenShotFileLocation + '/' + screenShotFileName, image, 'base64', function (err) {
                        if (err) {
                            console.log("Failed to take screenshot " + err.message);
                        } else {
                            console.log("Took a screenshot")
                        }
                    });
                }
            );

            // extract the web element from the screenshot based on the x,y,h,w
            var Jimp = require("jimp");
            var location = screenShotFileLocation + '/' + screenShotFileName;
            Jimp.read("shot/john.png" /*location*/, function (err, image) {
                if (err) throw err;
                image.crop(x, y, w, h)
                    .write(elementScreenShotFileLocation + '/' + elementScreenShotFileName, () => {
                        removeImage('./' + screenShotFileLocation + '/' + screenShotFileName);
                    });
            });

            // compares a two images and spots the difference into a third file
            var resemble = require('resemblejs');
            var diff = resemble(elementScreenShotFileLocation+'/'+elementScreenShotFileName).compareTo('shot/baseline.png').scaleToSameSize().onComplete(function (data) {
                console.log(data);
                if (data.rawMisMatchPercentage > 0) {
                    fs.writeFileSync('./shot/diff.png', data.getBuffer());
                }
            });

        } catch (err) {
            throw  new Error('Unable to screenshot ' + err.message);
        }
    }

}

module.exports = BasePage;