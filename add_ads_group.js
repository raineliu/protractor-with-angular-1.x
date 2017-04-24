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
        expect(browser.getCurrentUrl()).toEqual('http://' + browser.params.storeServer + '/index.html#/popularize_adv')
    });

    it('添加广告组', function(done) {

        co(function*() {

            element(by.partialButtonText('新增广告组')).click();

            //选择所有店铺
            // $('#ng-view a:contains("选择所有商铺")').click();
            $('#ng-view .dropdown-multiselect').click();
            var selectAll = browser.findElement(by.partialLinkText('选择所有商铺'));
            selectAll.click();
            $('#ng-view .dropdown-multiselect').click();
            //选取广告位id值最大的maxId
            $('#ng-view .btn-group .multiselect-selected-text').click();
            var ads_space_list = $("#group-space option");
            browser.driver.wait(EC.presenceOf(ads_space_list), 5000);
            var input_list = yield element.all(by.css(".multiselect-container input"))
            var space_id_list = yield input_list.map(function(input) {
                return input.getAttribute("value")
            })

            // console.log("space_id_list=" + space_id_list) //如果广告位不存在，下拉列表会加载不出来

            var max_space_id = space_id_list.map(Number).reduce(function(pre, cur) {
                return pre > cur ? pre : cur
            })
            console.log("max_space_id=" + max_space_id)
            var ads_space_input = $(".multiselect-container input[value='" + max_space_id + "']")
            yield ads_space_input.click();
            // console.log("group.budget")

            //预算
            var budget = element(by.model('group.budget'));
            yield browser.driver.wait(EC.visibilityOf(budget), 5000);
            yield budget.sendKeys('123', protractor.Key.CONTROL, "a", protractor.Key.NULL, '3000');
            // console.log("click-price-input")
            yield budget.click()
            yield browser.driver.wait(EC.invisibilityOf(ads_space_input), 5000);
            //点击价格
            var clickPrice = element(by.id('click-price-input'));
            yield clickPrice.sendKeys('123', protractor.Key.CONTROL, "a", protractor.Key.NULL, '' + global.clickPrice + '');
            // console.log("show-price-input")
            //展示价格
            var showPrice = element(by.id('show-price-input'));
            yield showPrice.sendKeys('123', protractor.Key.CONTROL, "a", protractor.Key.NULL, '' + global.showPrice + '');
            // console.log("group-save-btn")
            var saveButton = element(by.id('group-save-btn'));
            yield saveButton.click();
            // console.log("adsGroup 页面")
            browser.wait(EC.urlIs('http://' + browser.params.storeServer + '/index.html#/popularize_adv'), 5000);
            // console.log("adsGroup 列表")
            var groupIdTextList = yield element.all(by.exactRepeater('item in groupList').column('item.index')).getText()
                // console.log("adsGroup 过滤")
            groupIdTextList = groupIdTextList.filter(function(item) {
                return item != undefined && item != ""
            })

            // console.log("groupIdTextList="+util.inspect(groupIdTextList));
            console.log("groupId=" + groupIdTextList[groupIdTextList.length - 1]);
            global.adsGroup = groupIdTextList[groupIdTextList.length - 1];
            console.log('global.adsGroup=' + global.adsGroup)
            done()
        })
    });
});