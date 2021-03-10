import puppeteer, { Page } from 'puppeteer';

(async () => {
    const url = 'http://pizza.com';
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);
    await getPageTitle(page);
    await page.waitForTimeout(2500);    

    await browser.close();
})();

async function getPageTitle(page: Page) {
    const title = await page.$eval('title', element => element.textContent);

    console.log('title', title);
    
}