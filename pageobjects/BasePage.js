const {Key} = require('selenium-webdriver');
const fs = require('fs');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    promise = require('selenium-webdriver').promise,
    Builder = require('selenium-webdriver').Builder;

var browser = require('../lib/common').testEnv();
if (browser == "chrome") {
    var chromeCapabilities = webdriver.Capabilities.chrome();
    var chromeOptions = {
        'args': ['--test-type', '--start-maximized', '--enable-viewport ']
    };
    chromeCapabilities.set('chromeOptions', chromeOptions);
    driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
} else if (browser == "headlesschrome") {
    // headless chrome
    const chrome = require('selenium-webdriver/chrome');
    const width = 1800;
    const height = 1200;
    driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options().headless().windowSize({width, height}))
        .build();
} else if (browser == "firefox") {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
} else if (browser == "phantom") {
    var phantomjs_exe = require('phantomjs-prebuilt').path;
    var customPhantom = webdriver.Capabilities.phantomjs();
    customPhantom.set("phantomjs.binary.path", phantomjs_exe);
    //build custom phantomJS driver
    driver = new webdriver.Builder().withCapabilities(customPhantom).build();
} // don't work
else if (browser == "safari") {
    var capabilities = {
        'applicationName': 'desktop'
    }
    driver = new Builder()
        .forBrowser('safari')
        .build();
} // opera don't work
// else if (browser == "opera") {
//     var customPhantom = webdriver.Capabilities.opera();
//     customPhantom.set("opera.binary.path", "/Users/jmo51/Desktop/javascript/webdriverjspageobject/node_modules/operadriver/bin/operadriver");
//     driver = new webdriver.Builder().withCapabilities(customPhantom).build();
//     // driver = new Builder()
//     //     .forBrowser('opera')
//     //     .build();
//
// }

/**
 * function to remove a file
 *
 * @param fileName : specify the file name to be removed
 */
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

    /**
     * function to input to a textbox
     *
     * @param WebDriverLocator : specify the webelement locator i.e. by css, id, linktxt, xpath
     * @param keys : specifies the values to send into the input box
     * @param retries : specify the number of attempts to do the below action before timeout
     * @returns {Promise} : returns a promise
     */
    async sendKeys(WebDriverLocator, keys, retries) {
        try {
            if (retries == null) {
                retries = 1;
            }
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

    /**
     * function to click an element
     *
     * @param WebDriverLocator : specify the webelement locator i.e. by css, id, linktxt, xpath
     * @param retries : specify the number of attempts to do the below action before timeout
     * @returns {Promise} : returns a promise
     */
    async click(WebDriverLocator, retries) {
        try {
            if (retries == null) {
                retries = 1;
            }
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

    /**
     * function to wait for an element to be visible and later click the element if visible
     *
     * @param WebDriverLocator : specify the webelement locator i.e. by css, id, linktxt, xpath
     * @param retries : specify the number of attempts to do the below action before timeout
     * @returns {Promise} : returns a promise
     */
    async waitForVisibleAndClick(WebDriverLocator, retries) {
        try {
            if (retries == null) {
                retries = 1;
            }
            const element = await driver.findElement(WebDriverLocator)
            await driver.wait(until.elementIsVisible(element), 1200)
            if (element.isDisplayed()) {
                element.click();
            }
        } catch (err) {
            if (retries === 0) {
                console.log(`Element ${locator.toString()} still not visible after maximum retries, Error message: ${err.message.toString()}`)
            }
            await driver.sleep(250)
            return waitForVisibleAndClick(WebDriverLocator, retries - 1)
        }
    }

    /**
     * function to wait for an element to be visible
     *
     * @param WebDriverLocator : specify the webelement locator i.e. by css, id, linktxt, xpath
     * @param retries : specify the number of attempts to do the below action before timeout
     * @returns {Promise} : returns a promise
     */
    async waitForVisible(WebDriverLocator, retries) {
        try {
            if (retries == null) {
                retries = 1;
            }
            const element = await driver.findElement(WebDriverLocator)
            await driver.wait(until.elementIsVisible(element), 500)
        } catch (err) {
            if (retries === 0) {
                console.log(`Element ${locator.toString()} still not visible after maximum retries, Error message: ${err.message.toString()}`)
            }
            await driver.sleep(250)
            return waitForVisible(WebDriverLocator, retries - 1)
        }
    }

    /**
     * function to switch to a frame
     *
     * @param frameName : specify the frame to switch to
     * @param retries : specify the number of attempts to do the below action before timeout
     * @returns {Promise} : returns a promise
     */
    async switchToFrame(frameName, retries) {
        try {
            if (retries == null) {
                retries = 1;
            }

        } catch (err) {

        }
    }

    /**
     * function to compare two images
     *
     * @param elementScreenShotFileName : cropped image name taken from the website to be compare against the baseline
     * @param elementScreenShotFileLocation : cropped image location taken from the website to be compare against the baseline
     * @param baselineElementScreenShotFileName : baseline image name
     * @param baselineElementScreenShotFileLocation: baseline image location
     * @returns {Promise.<void>} : returns a resolved promise.
     */
    async compareImages(elementScreenShotFileName, elementScreenShotFileLocation, baselineElementScreenShotFileName, baselineElementScreenShotFileLocation) {
        // compares a two images and spots the difference into a third file
        console.log("Comparing images " + elementScreenShotFileName + " - " + baselineElementScreenShotFileName);
        console.log("Location "+ elementScreenShotFileLocation + " -" + baselineElementScreenShotFileLocation);
        var resemble = require('resemblejs');
        var diff = resemble(elementScreenShotFileLocation + '/' + elementScreenShotFileName).compareTo(baselineElementScreenShotFileName + '/' + baselineElementScreenShotFileLocation).scaleToSameSize().onComplete(function (data) {
            //console.log(data);
            if (data.rawMisMatchPercentage > 0) {
                console.log("There is some difference in the images.. please have a look");
                fs.writeFileSync('./shot/diff.png', data.getBuffer());
            } else {
                console.log("The images are the same .. nothing is changed ");
            }
        });
    }

    /**
     * function to quit the browser
     *
     * @returns {Promise.<void>}
     */
    async quit() {
        if (browser == "firefox") {
            await driver.quit();
        } else {
            await driver.close();
            await driver.quit();
        }
    }

    /**
     * take an element screenshot .. currently only works on firefox.
     *
     * @param webElement :
        * @returns {Promise.<void>}
     */
    async takeScreenshotElement(webElement) {
        await driver.findElement(webElement).takeScreenshot().then(async function (image) {
            fs.writeFile('shot/png.jpg', image, 'base64').then(async function (data) {
                console.log(data);
            })
        });
    }

    /**
     * function to take a screenshot of an element
     *
     * @param screenShotFileName : initial screenhot filename
     * @param screenShotFileLocation : initial screenshot location
     * @param elementScreenShotFileName : name of the cropped element screenshot
     * @param elementScreenShotFileLocation location of the cropped element screenshot
     * @param webElement : web element locator
     * @returns {Promise.<void>} : returns a resolved promise
     */
    async captureScreenshot(screenShotFileName, screenShotFileLocation, elementScreenShotFileName, elementScreenShotFileLocation, webElement) {
        try {

            console.log("Attempting to take element screenshot " + webElement);
            var x, y, h, w;

            // works ..if you want to run as javascript dom ...
            // var element = await driver.executeScript("return document.querySelector('#tvip-nav > div > div.tvip-masthead-container > div > div > span').getBoundingClientRect()").then(function (value) {
            //     console.log("value of top " + value.top);
            //     console.log("value of bottom  " + value.bottom);
            //     console.log("value of height " + value.height);
            //     console.log("value of width " + value.width);
            //     console.log("value of right " + value.right);
            //     console.log("value of left " + value.left);
            //     x = value.left;
            //     y = value.top;
            // });


            // this works on firefox
            if (browser == "firefox") {
                driver.findElement(webElement).takeScreenshot().then(function (image) {
                    require('fs').writeFile(elementScreenShotFileLocation + '/' + elementScreenShotFileName, image, 'base64', function (err) {
                        if (err) {
                            console.log("Failed to take element screenshot " + webElement + " -- " + err.message);
                        } else {
                            console.log("Took element screenshot " + webElement);
                        }
                    })
                })
            }
            // works on phantomjs , and chrome bigger screen ..
            else {
                driver.sleep(250);
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

                driver.sleep(250);
                // optional ...
                // driver.executeScript("arguments[0].scrollIntoView(true);",elementLocation);
                // takes screenshot of the entire page
                await driver.takeScreenshot().then(
                    function (image, err) {
                        require('fs').writeFile(screenShotFileLocation + '/' + screenShotFileName, image, 'base64', function (err) {
                            if (err) {
                                console.log("Failed to take entire page screenshot " + err.message);
                            } else {
                                console.log("Took entire page screenshot ");
                            }
                        });
                    }
                );

                driver.sleep(250);
                // extract the web element from the screenshot based on the x,y,h,w
                var Jimp = require("jimp");
                var location = screenShotFileLocation + '/' + screenShotFileName;
                Jimp.read(screenShotFileLocation + '/' + screenShotFileName, function (err, image) {
                    if (err) throw err;
                    image.crop(x, y, w, h)
                        .write(elementScreenShotFileLocation + '/' + elementScreenShotFileName, () => {
                            removeImage('./' + screenShotFileLocation + '/' + screenShotFileName);
                        });
                });


            }
            
            //compares a two images and spots the difference into a third file
            var resemble = require('resemblejs');
            var diff = resemble(elementScreenShotFileLocation + '/' + elementScreenShotFileName).compareTo('shot/baseline/baseline.png').scaleToSameSize().onComplete(function (data) {
                if (data.rawMisMatchPercentage > 0) {
                    console.log("Something is different, please have a look");
                    fs.writeFileSync('./shot/diff.png', data.getBuffer());
                }
            });

        } catch (err) {
            throw  new Error('Unable to screenshot ' + err.message);
        }
    }


    /**
     * function to get text from a web element
     *
     * @param WebDriverLocator : specify the locator for the webelement
     * @param retries : no of attempts
     * @returns {Promise.<*>} :
     */
    async getText(WebDriverLocator, retries) {
        try {
            if (retries == null) {
                retries = 1;
            }
            const element = await this.driver.findElement(WebDriverLocator)
            const text = await element.getText()
            return text
        } catch (err) {
            if (retries === 0) {
                throw new Error(`Unable to get ${locator.toString()} text after maximum retries, error : ${err.message}`)
            }
            await this.driver.sleep(250)
            return this.getText(locator, retries - 1)
        }
    }
}

module.exports = BasePage;