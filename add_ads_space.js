//广告测试  前提：用户是充值用户
var path = require('path');
var util = require('util');
var EC = protractor.ExpectedConditions;
var co = require('co');

describe('广告管理系统', function() {

    describe('商城端广告位', function() {
        beforeAll(function() {
            co(function*() {
                browser.driver.manage().window().maximize();
                browser.get('http://' + browser.params.mallServer + '/index.html#/');
                yield element(by.id('mall-user-input')).sendKeys('cmol');
                yield element(by.id('mall-password-input')).sendKeys('12345678');
                // element(by.model('user.checkIn')).click();
                yield element(by.id('mall-login-btn')).click();
                yield browser.setLocation('adv');
            })
        });

        it('添加广告位', function(done) {
            co(function*() {
                yield element(by.buttonText('新增广告位')).click();
                yield element(by.cssContainingText('option', '图片')).click();
                yield element(by.model('space.desc')).sendKeys('图片广告位');
                yield element(by.buttonText('保存')).click();
                yield browser.wait(EC.urlIs('http://' + browser.params.mallServer + '/index.html#/adv'), 5000);
                element.all(by.repeater('item in spaceList').column('item.index')).last().getText().then(function(spaceIdText) {
                    console.log("spaceIdText=" + spaceIdText);
                    global.adsSpace = spaceIdText;
                });
                done()
            })
        });
    });
})