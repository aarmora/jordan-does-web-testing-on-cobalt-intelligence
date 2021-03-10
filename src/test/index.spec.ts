import { expect } from 'chai';
import { fail } from 'assert';
import puppeteer, { Browser, Page } from 'puppeteer';
const puppeteerFirefox = require('puppeteer-firefox');


const cliArgs = process.argv.slice(2);
const firefox = cliArgs.includes('firefox');
let browser: Browser;

describe('Cobalt Intelligence', async () => {
    let page: Page;

    before(async () => {
        browser = await puppeteer.launch({ headless: false});
    });

    describe('Base page layout', () => {
        it('should have 4 top buttons', async () => {
            const context = await browser.createIncognitoBrowserContext();
            page = await context.newPage();

            const url = 'https://cobaltintelligence.com/';
            await page.goto(url);

            const buttonSelectors = '.hometop-btn.mat-button.mat-button-base';
            await page.waitForSelector(buttonSelectors);
            const tabs = await page.$$(buttonSelectors);

            expect(tabs.length).to.equal(4);
            await context.close();
        });
        

        it('should have a hamburger menu with a smaller view port', async () => {
            const context = await browser.createIncognitoBrowserContext();
            page = await context.newPage();
            await page.setViewport({ width: 250, height: 250 });

            const url = 'https://cobaltintelligence.com/';
            await page.goto(url);

            const hamburgerSelector = '#menu-toggle';
            try {
                await page.waitForSelector(hamburgerSelector, {
                    visible: true
                });
            }
            catch (e) {
                fail('Element should be visible')
            }
            const hamburgerMenu = await page.$(hamburgerSelector);
            expect(hamburgerMenu).to.be.ok;

            await context.close();
        });

        it('should not have a hamburger menu with a larger view port', async () => {
            const context = await browser.createIncognitoBrowserContext();
            page = await context.newPage();
            await page.setViewport({ width: 1980, height: 1020 });

            const url = 'https://cobaltintelligence.com/';
            await page.goto(url);

            const hamburgerSelector = '#menu-toggle';
            try {
                await page.waitForSelector(hamburgerSelector, {
                    visible: true,
                    timeout: 5000
                });
                fail('Should not reach here');
            }
            catch (e) {
                expect(e).to.be.ok;
            }
            await context.close();
        });
    });


});