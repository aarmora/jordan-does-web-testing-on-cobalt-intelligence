import { expect } from 'chai';
import { fail } from 'assert';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
const puppeteerFirefox = require('puppeteer-firefox');


const cliArgs = process.argv.slice(2);
const firefox = cliArgs.includes('firefox');
let browser: Browser;

describe('Cobalt Intelligence', async () => {
    let page: Page;

    before(async () => {
        browser = await setUpBrowser();
        // await notify(`${firefox ? 'Firefox: ' : ''}Started integration tests`);
    });

    afterEach(async function () {
        if (this.currentTest && this.currentTest.state === 'failed') {
            // await notify(`${firefox ? 'Firefox: ' : ''}${this.currentTest.title} - ${this.currentTest.state}`);
        }
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

        it('should have three pricing tiers', async () => {
            const context = await browser.createIncognitoBrowserContext();
            page = await context.newPage();
            await page.setViewport({ width: 1920, height: 1080 });

            const url = 'https://cobaltintelligence.com/';
            await page.goto(url);

            const pricingSelectors = '.pricings > div';
            await page.waitForSelector(pricingSelectors);
            const pricings = await page.$$(pricingSelectors);

            expect(pricings.length).to.equal(3);
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


async function setUpBrowser() {
    let browser: Browser;

    let ubuntu = cliArgs.includes('ubuntu');
    let headless = cliArgs.includes('headless');
    let firefox = cliArgs.includes('firefox');

    if (!headless && process.env.hasOwnProperty("PPTR_HEADLESS") && String(process.env.PPTR_HEADLESS) === 'true') {
        headless = true;
    }

    console.log('puppeteer: ');
    console.log(`    headless: ${headless}`);
    console.log(`    ubuntu: ${ubuntu}`);
    console.log(`    firefox: ${firefox}`);

    if (ubuntu && !firefox) {
        const pptrArgs: puppeteer.LaunchOptions = {
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
            ]
        };

        if (process.env.hasOwnProperty("PPTR_EXEC_PATH")) {
            pptrArgs.executablePath = process.env.PPTR_EXEC_PATH;
        }

        browser = await puppeteer.launch(pptrArgs);
    }
    else if (ubuntu && firefox) {
        const pptrArgs: puppeteer.LaunchOptions = {
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
            ]
        };

        if (process.env.hasOwnProperty("PPTR_EXEC_PATH")) {
            pptrArgs.executablePath = process.env.PPTR_EXEC_PATH;
        }

        browser = await puppeteerFirefox.launch();

    }
    else if (firefox) {
        const pptrArgs: puppeteer.LaunchOptions = {
            headless,
            args: [`--window-size=${1800},${1200}`]
        };

        if (process.env.hasOwnProperty("PPTR_EXEC_PATH")) {
            pptrArgs.executablePath = process.env.PPTR_EXEC_PATH;
        }

        browser = await puppeteerFirefox.launch(pptrArgs);

    }
    else {
        const pptrArgs: puppeteer.LaunchOptions = {
            headless,
            args: [`--window-size=${1800},${1200}`]
        };

        if (process.env.hasOwnProperty("PPTR_EXEC_PATH")) {
            pptrArgs.executablePath = process.env.PPTR_EXEC_PATH;
        }

        browser = await puppeteer.launch(pptrArgs);
    }

    return Promise.resolve(browser);
}

// async function notify(message: string) {

//     return new Promise(async (resolve) => {

//         if (process.env.discordWebhookURL) {
//             const hook = new Webhook(process.env.discordWebhookURL);
//             await hook.info('Cobalt Intelligence Testing', message);
//         }
//         else {
//             console.log(message);
//         }

//         resolve();
//     });
// }