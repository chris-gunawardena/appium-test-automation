"use strict";

require("./helpers/setup");

var wd = require("wd"),
		_ = require('underscore'),
		serverConfigs = require('./helpers/appium-servers');

describe("ios safari", function () {
	this.timeout(300000);
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
			.get('https://m.sb.qa.sbetenv.com')

			//go the 3rd race item in homepage carousel
			.waitForElementById('next-to-jump', 15000)
			.elementByCssSelector('#next-to-jump .swiper-wrapper >  div:nth-of-type(3)').click()

			//add to bet slip
			.waitForElementById('sbm-page-wrapper', 15000)
			.elementByCssSelector('.card-outcome-list > :first-child .rc-content-bet-options  div:first-child a').click()

			//open bet slip
			.elementByCssSelector('a.sportsbet-button-betslip').click()


			//add money to the bet
			.waitForElementById('sbm-page-wrapper', 15000)
			.elementByCssSelector('#se_betslip-S-wrapper > div:nth-child(1) .stake-control-plus.btn.right').click()


			//place bet
			.elementByCssSelector('#bet-slip-footer-button').click()

			//.sleep(5000)

			//login
			.waitForElementById('oauth_iframe', 15000)
			//.TargetLocator()
			.frame( 'oauth_iframe' )//driver.elementByCssSelector("iframe#oauth_iframe")
			.elementByCssSelector('#username').sendKeys('chrisgu')
			.elementByCssSelector('#password').sendKeys('sports99')
			.elementByCssSelector('.submit-button').click()


			.sleep(50000)
			//click on the bet value input box, should get focus
			.elementByCssSelector('.prepended-input input').click().sendKeys('100')

			.sleep(50000)

			.title().should.eventually.include('sauce labs');
	});

});
