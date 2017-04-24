var path = require('path');
var util = require('util');
var co = require('co');

describe('basic set', function() {
	var EC = protractor.ExpectedConditions;
	beforeAll(function() {
		browser.driver.manage().window().maximize();
		browser.get('http://' + browser.params.storeServer + '/index.html#/')
			// element(by.id('userName')).sendKeys(global.owner_account);
			// element(by.id('password')).sendKeys(global.owner_password);
			// element(by.model('user.rememberMe')).click();
		element(by.id('store-login-btn')).click()
		browser.setLocation('setup_basic');
	})

	it('update head', function(done) {
		co(function*() {
			$('.img-circle').click()
			var absolutePath = 'C:/work/img/3.jpg'
			yield $('input[type="file"][id="input-1"]').sendKeys(absolutePath);
			yield element.all(by.css('a.fileinput-upload-button')).then(function(items) {
				items[0].click()
			});
			yield browser.wait(EC.alertIsPresent(), 2000);
			yield browser.switchTo().alert().accept()
			var imgAttr = yield $('.img-circle').getAttribute('src')
			imgAttr = path.extname(imgAttr)
				// console.log('imgAttr=' + imgAttr)
			expect(imgAttr).toEqual('.jpg'); //img/initUser.png
			done()
		})
	})

	it('update shop name', function(done) {
		var shop_name = '测试店铺' + Math.random();
		// console.log('shop_name=' + shop_name)
		co(function*() {
			yield element.all(by.css('#inputPassword3')).then(function(items) {
				items[0].clear()
				items[0].sendKeys(shop_name)
			})
			yield $('a.btn-primary').click()
			yield browser.wait(EC.alertIsPresent(), 2000)
			yield browser.switchTo().alert().accept()
			var shop = yield element.all(by.css('.username')).then(function(items) {
				return items[0]
			})
			var shop_name_first = yield shop.getText()
				// console.log('shop_name_first=' + shop_name_first)
			expect(shop_name_first).toEqual(shop_name)
			yield shop.click()
			var shop_name_second = yield $('li.ng-scope a.ng-binding').getText()
				// console.log('shop_name_second=' + shop_name_second)
			expect(shop_name_second).toEqual(shop_name)
			done()
		})
	})

	it('package type status', function(done) {
		co(function*() {
			var type = yield browser.findElement(by.xpath('//div[text()="套餐类型"]/following-sibling::div[1]/input'));
			var type_status1 = yield type.getAttribute('disabled');
			var type_status2 = yield type.getAttribute('readonly');
			var type_value = yield type.getAttribute('value');
			expect(type_status1).toBe('true');
			expect(type_status2).toBe('true');
			expect(type_value).toBe('30元/月');
			console.log(type_status1 + "   " + type_status2 + "    " + type_value)
			done()
		})
	})

	it('add data', function(done) {
		co(function*() {
			var longitude = yield browser.findElement(by.xpath('//div[text()="本店经度"]/following-sibling::div[1]/input'));
			longitude.clear()
			longitude.sendKeys('114.31667');

			var latitude = yield browser.findElement(by.xpath('//div[text()="本店纬度"]/following-sibling::div[1]/input'));
			latitude.clear()
			latitude.sendKeys('30.51667');

			var time = yield browser.findElement(by.xpath('//div[text()="营业时间"]/following-sibling::div[1]/input'));
			time.clear()
			time.sendKeys('9:00-23:00');

			yield $('a.btn-primary').click()
			yield browser.wait(EC.alertIsPresent(), 2000)
			yield browser.switchTo().alert().accept()

			var longitude_value = yield longitude.getAttribute('value')
			expect(longitude_value).toBe('114.31667')

			var latitude_value = yield latitude.getAttribute('value')
			expect(latitude_value).toBe('30.51667')

			var time_value = yield time.getAttribute('value')
			expect(time_value).toBe('9:00-23:00')
			done()
		})
	})
})