'use strict';

const assert = require('assert');
const {Builder, By, Key, promise, until} = require('selenium-webdriver');

promise.USE_PROMISE_MANAGER = false;
var homePage = require('../pageobjects/homepage');

describe('BBC iplayer', function () {

    it('navigate to BBC iplayer', async function () {
        await homePage.navigateToGet();
    });

    it('go to cbeeebies section', async function () {
        await homePage.gotocbeebies();
    });

    it('go peter rabbit', async function () {
        await homePage.goto_peter_rabbit();
    });

    it('open the first video', async function () {
        await homePage.gotofirstvideo();
    })

    after(async function () {
        await homePage.quit();
    });
});

