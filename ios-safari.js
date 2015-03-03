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
			.get('http://jsbin.com/bobufugixu/1/')
			.waitForElementByCss('iframe#search-iframe', 5000)
			.frame( 'search-iframe' )
			.elementByCss('#sb_form_q').sendKeys('foo bar')
			.elementByCss('#sb_form_go').click()
			.sleep(15000);

	});

});
