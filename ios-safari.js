"use strict";

require("./helpers/setup");

var wd = require("wd"),
		_ = require('underscore'),
		serverConfigs = require('./helpers/appium-servers');

describe("ios safari", function () {
	this.timeout(3000000);
	var driver;
	var allPassed = true;

	before(function () {
		var serverConfig = process.env.SAUCE ?
			serverConfigs.sauce : serverConfigs.local;
		driver = wd.promiseChainRemote(serverConfig);
		require("./helpers/logging").configure(driver);

		var desired = _.clone(require("./helpers/caps").ios81);
		desired.browserName = 'safari';
		if (process.env.SAUCE) {
			desired.name = 'ios - safari';
			desired.tags = ['sample'];
		}
		return driver.init(desired);
	});

	after(function () {
		return driver
			.quit()
			.finally(function () {
				if (process.env.SAUCE) {
					return driver.sauceJobStatus(allPassed);
				}
			});
	});

	afterEach(function () {
		allPassed = allPassed && this.currentTest.state === 'passed';
	});


	it("should get the url", function () {
		return driver

			.sleep(1000)

			.get('https://m.sportsbet.com.au')

			//go the 3rd race item in homepage carousel
			.waitForElementByCss('#next-to-jump .swiper-wrapper >  div:nth-of-type(3)', 5000).click()

			//add to bet slip
			.waitForElementByCss('.card-outcome-list > :first-child .rc-content-bet-options  div:first-child a', 5000).click()

			//open bet slip
			.waitForElementByCss('a.sportsbet-button-betslip', 5000).click()

			//add money to the bet
			.waitForElementByCss('#se_betslip-S-wrapper > div:nth-child(1) .stake-control-plus.btn.right', 5000).click()

			//place bet
			.waitForElementByCss('#bet-slip-footer-button', 15000).click()

			//login
			.waitForElementByCss('iframe#oauth_iframe', 5000)
			.sleep(5000)

			//click on the bet value input box, should get focus
			.elementByCss('.prepended-input input').click().sendKeys('100')


			.title().should.eventually.include('sauce labs');
	});

});
