//测试规范文件
var co = require('co');
var util = require('util');

describe('home page', function() {
    beforeAll(function() {
        browser.get('http://' + browser.params.storeServer + '/index.html');
        // browser.get('http://localhost:8888/dist/index.html#/')
    });
    it('login and remeber me', function(done) {
        co(function*() {
            yield element(by.id('userName')).sendKeys(global.owner_account);
            yield element(by.id('password')).sendKeys(global.owner_password);
            yield element(by.model('user.rememberMe')).click();
            yield element(by.id('store-login-btn')).click();
            yield browser.driver.sleep('1000')
            expect(browser.getCurrentUrl()).toEqual('http://' + browser.params.storeServer + '/index.html#/home');
            //注销返回首页
            yield element(by.xpath('//*[@id="user"]/span[2]')).click();
            yield element(by.xpath('//*[@id="navbar-collapse-header"]/ul/li[5]/ul/li/a[2]')).click(); //注销
            expect(element(by.id('userName')).getAttribute('value')).toBe(global.owner_account);
            expect(element(by.id('password')).getAttribute('value')).toBe(global.owner_password);
            done();
        })
    });
});