//广告测试  前提：用户是充值用户
var path = require('path');
var util = require('util');
var co = require('co');
var EC = protractor.ExpectedConditions;



describe('商城端广告位', function() {

    beforeAll(function() {
        browser.driver.manage().window().maximize();
        browser.get('http://' + browser.params.mallServer + '/index.html#/');
        element(by.id('mall-user-input')).sendKeys('cmol');
        element(by.id('mall-password-input')).sendKeys('12345678');
        element(by.model('user.checkIn')).click();
        element(by.id('mall-login-btn')).click();
        browser.setLocation('adv');
    });

    it('删除广告位', function(done) {
        browser.findElement(by.xpath('//tr/td[2][text()="' + global.adsSpace + '"]/following-sibling::td[4]')).then(el => el.click())
        done()
    });
});