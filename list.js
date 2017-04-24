var util = require('util');
var child = require('child_process');
var assert = require('assert');
var request = require('request');
var should = require("should")
var request = request.defaults({
	jar: true
});
var qs = require('querystring');
var encrypt = require('./rsa/decrypt').encrypt;
var check_response = require('./utils/common').check_response;
var qWaitChange = require('./utils/common').qWaitChange
var co = require('co');

describe('list set/', function() {
	var EC = protractor.ExpectedConditions;
	// beforeAll(function(done) {
	// 	element(by.id('store-login-btn')).click().then(() => done())
	// })
	var categoryMacList = {
		"black": [
			'11:11:00:00:11:00',
			'11:11:00:00:11:01',
			'11:11:00:00:11:02',
			'11:11:00:00:11:03'
		],
		"white": [
			'11:11:00:00:11:10',
			'11:11:00:00:11:11',
			'11:11:00:00:11:12',
			'11:11:00:00:11:13'
		],
		"vip": [
			'11:11:00:00:11:20',
			'11:11:00:00:11:21',
			'11:11:00:00:11:22',
			'11:11:00:00:11:23',
			'11:11:00:00:11:24',
			'11:11:00:00:11:25',
			'11:11:00:00:11:26',
			'11:11:00:00:11:27',
			'11:11:00:00:11:28',
			'11:11:00:00:11:29',
			'11:11:00:00:11:30'
		]
	}

	Object.keys(categoryMacList).forEach((category, cid) =>
		it("add " + category + " list", function(done) {
			co(function*() {
				var macList = categoryMacList[category]
				yield browser.setLocation('setup_whitelist')
					//yield browser.sleep('1000')
				yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[3]/div/div/div/div[1]/ul/li[' + (cid + 1) + ']/a')).click()

				for (let i = 0; i < macList.length; i++) {
					yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[1]/input')).clear()
					yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[1]/input')).sendKeys(macList[i])
					yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[2]/button')).click()
					yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[2]/ul/li[' + (cid + 1) + ']/a')).click()
				}
				yield browser.wait(EC.alertIsPresent(), 3000);
				yield browser.switchTo().alert().accept()
				var tdList = yield browser.driver.findElements(by.xpath('//tr/td[1]'))
				expect(tdList.length).toBe(macList.length - 1)
				yield browser.driver.findElement(by.xpath('//tr[1]/td[3]/a')).isDisplayed()
				yield browser.driver.findElement(by.xpath('//tr[1]/td[3]/a')).click()
				var curLength = yield qWaitChange(() => {
					return browser.driver.findElements(by.xpath('//tr/td[1]')).then(curLength => curLength.length)
				}, cur => cur == (macList.length - 2))
				expect(curLength).toBe(macList.length - 2)
				done()
			})
		})
	)

	describe('add roles', function() {
		it('/oa/prior/login', function(done) {
			var time = new Date();
			time = parseInt(time.getTime(), 10);
			time = time.toString(); //转换成字符串
			var form = {
				'account': 'oauth',
				'password': 'admin&^%$#',
				'time': time
			};
			form = JSON.stringify(form); //将json对象转换成字符串
			//加密
			encrypt(form).then(function(data) {
				form = data;
			}).then(function() {
				request.post({
					'url': 'http://' + browser.params.mallServer + '/service/201/node-tair-web/oa/prior/login',

					'form': {
						'form': form
					}
				}, function(err, httpResponse, body) {
					// console.log("oa/prior/login body=" + body)
					check_response(err, body).then(function(msg) {
						done()
					})
				});
			})
		})

		it('/roles/add', function(done) {
			var form = {
				'owner': global.owner_id,
				'type': 'vip',
				'level': '1',
			}
			request.post({
				'url': 'http://' + browser.params.storeServer + '/service/201/node-tair-web/oa/acl/roles/add',
				'form': form
			}, function(err, httpResponse, body) {
				check_response(err, body).then(function(msg) {
					console.log('add vip:' + JSON.stringify(body))
					done()
				})
			})
		})
	})

	describe('the list should be able to continue to add', function() {
		var reCategoryMacList = {
			"black": ['11:11:00:00:11:04', '11:11:00:00:11:05'],
			"white": ['11:11:00:00:11:14', '11:11:00:00:11:15'],
			"vip": ['11:11:00:00:11:31', '11:11:00:00:11:32']
		}
		Object.keys(reCategoryMacList).forEach((reCategory, reId) =>
			it('readd ' + reCategory + 'list', function(done) {
				co(function*() {
					var reMacList = reCategoryMacList[reCategory]
					yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[3]/div/div/div/div[1]/ul/li[' + (reId + 1) + ']/a')).click()
					for (let i = 0; i < reMacList.length; i++) {
						yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[1]/input')).clear()
						yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[1]/input')).sendKeys(reMacList[i])
						yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[2]/button')).click()
						yield browser.driver.findElement(by.xpath('//*[@id="ng-view"]/section/div[2]/div[2]/ul/li[' + (reId + 1) + ']/a')).click()
					}
					var tdListLength = yield qWaitChange(() =>
						browser.driver.findElements(by.xpath('//tr/td[1]')).then(curLength => curLength.length),
						cur =>
						cur == (reMacList.length + categoryMacList[reCategory].length - 2)
					)

					// tdListLength.should.equal(reMacList.length + categoryMacList[reCategory].length - 2)
					expect(tdListLength).toBe(reMacList.length + categoryMacList[reCategory].length - 2)
					done()
				})
			})
		)
	})
})