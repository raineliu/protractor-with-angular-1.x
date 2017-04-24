//广告测试  前提：用户是充值用户
var path = require('path');
var util = require('util');
var co = require('co');
var EC = protractor.ExpectedConditions;


describe("商户端广告投放", function() {

    var waitElementTextPresent = function(locator, time) {
        // if (typeof time !== "number") {
        //     time = 2000
        // }
        time = time || 2000
        return new Promise(function(resolve, reject) {
            var counter = 0
            var intervalID = setInterval(() => {
                counter = counter + 1
                if (counter * 50 > time) {
                    clearInterval(intervalID)
                    reject(new Error("waitElementTextPresent timeout"))
                } else {
                    locator.getAttribute("value").then(function(text) {
                        console.log("waitElementTextPresent locator.getText() text=" + text)
                        if (text !== undefined && text !== "") {
                            clearInterval(intervalID)
                            resolve(text)
                        }
                    }).catch(function(err) {
                        clearInterval(intervalID)
                        reject(err)
                    })
                }
            }, 50)
        })
    }

    it('添加广告素材', function(done) {
        co(function*() {
            //点击广告投放
            // element(by.xpath('//*[@id="ng-view"]/descendant::ul/li[2]/a')).click();
            element(by.xpath('//*[@id="ng-view"]/section/div[2]/div/div/div/ul/li[2]/a')).click();
            element(by.buttonText('+新增广告')).click();
            //展开广告组选项
            var expandAdsGroup = $('#addContent .multiselect')
            yield browser.driver.wait(EC.visibilityOf(expandAdsGroup), 5000)
            expandAdsGroup.click()
            var adsElement = $("#content-group option")
            yield browser.driver.wait(EC.presenceOf(adsElement), 5000)

            var input_list = yield element.all(by.css(".multiselect-container input"))
            var group_id_list = yield input_list.map(function(input) {
                return input.getAttribute("value")
            })

            // console.log("group_id_list=" + group_id_list) //如果广告组不存在，下拉列表会加载不出来

            var max_group_id = group_id_list.map(Number).reduce(function(pre, cur) {
                return pre > cur ? pre : cur
            })
            console.log("max_group_id=" + max_group_id)

            var ads_group_input = $(".multiselect-container input[value='" + max_group_id + "']")
            yield ads_group_input.click();

            //跳转链接
            var jumpUrl = element(by.model('content.jumpUrl'));
            yield jumpUrl.click()
            yield browser.driver.wait(EC.invisibilityOf(ads_group_input), 5000);
            yield element(by.model('content.jumpUrl')).sendKeys('cn.bing.com');

            //权重
            var weight = element(by.model('content.weight'));
            yield weight.sendKeys('3');

            //标题
            var title = element(by.model('content.title'))
            yield title.sendKeys('广告图片');

            //图片
            var absolutePath = 'C:/work/img/' + parseInt(Math.random() * 15 + 1) + '.jpg'
            console.log('absolutePath=' + absolutePath)
            yield $('input[type="file"]').sendKeys(absolutePath);
            yield $('a.fileinput-upload-button').click()

            //等待进度条加载完成
            yield browser.driver.wait(EC.textToBePresentInElement($('.progress-bar-success'), '100%'), 5000);
            yield waitElementTextPresent(element(by.model("content.img")), 30000)
                //保存
            yield element.all(by.buttonText('保存')).last().click()
            yield browser.driver.wait(EC.invisibilityOf($("a.fileinput-upload-button")), 5000);

            //获取广告素材id
            yield browser.wait(EC.urlContains('popularize_adv'), 5000);
            // global.ads = yield element.all(by.repeater("item in contentList | orderBy: 'index'").column('item.index')).last().getText();
            global.ads = yield element.all(by.css('tr.ng-scope td:nth-child(2)')).last().getText();
            console.log("global.ads=" + global.ads);
            done()
        })
    });
});