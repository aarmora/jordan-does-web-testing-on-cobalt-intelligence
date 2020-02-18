import { expect } from 'chai';
import { fail } from 'assert';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';


// describe('Cobalt Intelligence', async () => {
// 	const browser = await puppeteer.launch({ headless: false });
// 	let page: Page = await browser.newPage();

// 	it('should do something', () => {

// 	});
// });



describe('addition()', () => {
	it('should add both numbers together', () => {
		const sum = addition(1, 3);

		expect(sum).to.equal(4);
	});


	it('should handle negative numbers', () => {
		const sum = addition(1, -3);

		expect(sum).to.equal(-2);
	});
});

function addition(firstNumber: number, secondNumber: number) {
	if (secondNumber > 10) {
		secondNumber = 10;
	}
	return firstNumber + secondNumber;
}