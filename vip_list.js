var co = require('co');
var util = require('util');
var qWaitChange = require('./utils/common').qWaitChange

describe('vip list', function() {
    it('the vip user may be delete', function(done) {
        co(function*() {
            browser.driver.manage().window().maximize();
            yield browser.setLocation('setup_viplist')
            var vip = yield element.all(by.repeater('item in listVip')).count();
            yield browser.driver.findElement(by.xpath('//a[text()="下一页"]')).click()
            vip += yield element.all(by.repeater('item in listVip')).count();
            expect(vip).toBe(11)
            yield browser.driver.findElement(by.xpath('//tr/td/div/ul/li[1]/a[text()="上一页"]')).click()
            yield qWaitChange(() => browser.driver.findElement(by.xpath('//tr[1]/td[10]/a')).getText().catch(err => null), cur => cur === '删除')
            yield browser.driver.findElement(by.xpath('//tr[1]/td[10]/a')).isDisplayed()
            yield browser.driver.findElement(by.xpath('//tr[1]/td[10]/a')).click()
            var vipCount = yield element.all(by.repeater('item in listVip')).count();
            // vipCount += yield element.all(by.repeater('item in listVip')).count();
            // console.log('vipCount=' + vipCount)
            expect(vipCount).toBe(10)
            done();
        })
    }, 100000)
})