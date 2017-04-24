//广告测试  前提：用户是充值用户
var path = require('path');
var util = require('util');
var co = require('co');
var EC = protractor.ExpectedConditions;

describe("商户端广告投放", function() {

    beforeAll(function() {
        browser.driver.manage().window().maximize();
        browser.get('http://' + browser.params.storeServer + '/index.html#/');
        // element(by.id('userName')).sendKeys('test');
        // element(by.id('password')).sendKeys('12345678');
        // element(by.model('user.rememberMe')).click();
        element(by.id('store-login-btn')).click();
        browser.setLocation('popularize_adv');
    });

    it('删除广告组', function(done) {
        browser.findElement(by.xpath('//tr/td[2][text()="' + global.adsGroup + '"]/following-sibling::td[7]')).then(el => el.click())
        done()
    });
});