//广告点击测试  前置条件：需要有手机连接，有在线用户 参数space、user_id
var co = require('co');
var util = require('util');
var cycle_num = 50; //循环次数
var show_num = 0; //展示次数
var click_num = 0; //点击次数
var no_valid_ads_num = 0; //无可用广告次数
var recordId_first;
var qWaitChange = require('./utils/common').qWaitChange

var webdriver = browser.driver;
By = webdriver.By;
until = webdriver.until;

describe('广告测试', function() {
    var ads_url
    it('first recordId', function(done) {
        co(function*() {
            // console.log('global.ads=' + global.ads)
            browser.driver.manage().window().maximize();
            browser.get('http://' + browser.params.mallServer + '/index.html#/');
            element(by.id('mall-user-input')).sendKeys('cmol');
            element(by.id('mall-password-input')).sendKeys('12345678');
            // element(by.model('user.checkIn')).click();
            element(by.id('mall-login-btn')).click();
            browser.setLocation('ad_effect');
            recordId_first = yield browser.findElement(by.xpath("//tr/td[1][text()='1']/following-sibling::td[1]/span")).getText();
            console.log("recordId_first=" + recordId_first)
            done()
        })
    })

    it('show ads', function(done) {
        console.log('global.adsSpace=' + global.adsSpace)
        ads_url = 'http://' + browser.params.storeServer + '/test/checkAdv.html?space=' + global.adsSpace
        webdriver.manage().window().maximize();
        co(function*() {
            for (let i = 0; i < cycle_num; i++) {
                console.log('执行第' + (i + 1) + '次循环开始')
                yield visitTestAds(i);
                console.log('执行第' + (i + 1) + '次循环结束')
            }
            console.log('show_num=' + show_num)
            console.log('click_num=' + click_num)
            console.log('no_valid_ads_num=' + no_valid_ads_num)
            done()
        });
    }, 100000);

    function visitTestAds(i) {
        return co(function*() {
            console.log('第' + (i + 1) + '次刷新页面')
            yield webdriver.get(ads_url)

            //等待图片出现
            var adsImg = webdriver.findElement(by.css('.adv'))
            var imgSrc = yield qWaitChange(() => adsImg.getAttribute('src'),
                cur => cur !== 'http://' + browser.params.storeServer + '/test/img/banner_title.png')
            console.log('imgSrc=' + imgSrc)
            if (imgSrc === 'http://' + browser.params.storeServer + '/test/img/banner_title.png') {
                no_valid_ads_num++;
                console.log('no_valid_ads_num=' + no_valid_ads_num)
                console.log('无可用广告')
            } else {
                show_num++; //2
                console.log('show_num=' + show_num);

                //随机一个操作
                if (Math.random() > 0.5) {
                    console.log('不点击')
                } else {
                    console.log('点击图片')
                        //yield adsImg.click();
                    yield webdriver.executeScript('arguments[0].click();', adsImg);

                    var jumpUrl = yield qWaitChange(() => webdriver.getCurrentUrl(),
                        cur => cur === 'http://cn.bing.com/')
                    console.log('jumpUrl=' + jumpUrl)
                    if (jumpUrl == 'http://cn.bing.com/') {
                        click_num++;
                        console.log("点击图片跳转成功")
                    } else {
                        console.log("点击图片跳转失败")
                    }
                }
            }
        })
    }

    it('验证广告展示和点击次数是否一致', function(done) {

        co(function*() {
            browser.driver.manage().window().maximize();
            browser.get('http://' + browser.params.storeServer + '/index.html#/');
            // element(by.id('userName')).sendKeys('test');
            // element(by.id('password')).sendKeys('12345678');
            // element(by.model('user.rememberMe')).click();
            element(by.id('store-login-btn')).click();
            browser.setLocation('popularize_adv');
            element(by.xpath('//*[@id="ng-view"]/descendant::ul/li[2]')).click(); //点击广告投放

            //获取后台记录值
            var click = browser.findElement(by.xpath("//tr/td[2][text()='" + global.ads + "']/following-sibling::td[4]"));
            var clickValue = yield click.getText();
            var show = browser.findElement(by.xpath("//tr/td[2][text()='" + global.ads + "']/following-sibling::td[5]"));
            var showValue = yield show.getText()
            console.log('系统后台记录点击数：' + Number(clickValue) + '    展示数：' + Number(showValue))
            expect(click_num).toBe(Number(clickValue));
            expect(show_num).toBe(Number(showValue));
            done()
        })
    })

    it('广告效果验证', function(done) {
        var recordList = []
            //获取整页的记录ID
        var recordPropConf = {
            "id": "//tr/td[2]/span",
            "ad_id": "//tr/td[3]/span",
            "charge_type": "//tr/td[5]/span",
            "charge_price": "//tr/td[6]/div/span"
        }

        function getOnePageRecordList() {
            return co(function*() {
                var onePageRecordList = null
                for (let propName in recordPropConf) {
                    propList = yield getRecordPropList(recordPropConf[propName])
                        // console.log('propList=' + JSON.stringify(propList))
                    if (onePageRecordList === null) {
                        onePageRecordList = propList.map(function(propValue) {
                            var record = {}
                            record[propName] = propValue
                                // console.log('recode=' + JSON.stringify(record))
                            return record
                        })
                    } else {
                        propList.forEach(function(propValue, index) {
                            onePageRecordList[index][propName] = propValue
                                // console.log('onePageRecordList = ' + JSON.stringify(onePageRecordList))
                        })
                    }
                }
                return onePageRecordList
            })
        }

        function getRecordPropList(propXpathFinder) {
            return co(function*() {
                var recordPropElementList = yield element.all(by.xpath(propXpathFinder))
                return yield recordPropElementList.map(function(recordProp) {
                    return recordProp.getText()
                })
            })
        }

        function IndexOfRecord(recordId_first) {
            return co(function*() {
                //如果存在记录id，就返回编号，否则返回-1
                if (yield browser.isElementPresent(by.xpath("//tr/td[2]/span[contains(text(),'" + recordId_first + "')]"))) {
                    return yield browser.findElement(by.xpath("//tr/td[2]/span[contains(text(),'" + recordId_first + "')]/parent::td/preceding-sibling::td")).getText();
                } else {
                    return -1
                }
            })

        }


        function validateRecordList(recordList, done) {
            var actualAdShowNum = recordList.reduce(function(pre, record) {
                    if (record.charge_type === "展示") {
                        // console.log('展示价格：' + record.charge_price)
                        expect(parseFloat(record.charge_price)).toBe(global.showPrice)
                        return pre + 1
                    } else {
                        return pre
                    }

                }, 0)
                // console.log('actualAdShowNum=' + actualAdShowNum)
            expect(show_num).toEqual(actualAdShowNum);

            var actualAdClickNum = recordList.reduce(function(pre, record) {
                    if (record.charge_type === "点击") {
                        // console.log('点击价格：' + record.charge_price)
                        expect(parseFloat(record.charge_price)).toBe(global.clickPrice)
                        return pre + 1
                    } else {
                        return pre
                    }

                }, 0)
                // console.log('actualAdClickNum=' + actualAdClickNum)
            expect(click_num).toEqual(actualAdClickNum)
            done()
        }

        function checkAdsEffect() {
            return co(function*() {
                var index = yield IndexOfRecord(recordId_first)
                    // console.log('index=' + index)
                while (index == -1) {
                    recordList = recordList.concat(yield getOnePageRecordList());
                    // console.log('recordList =  ' + JSON.stringify(recordList))
                    element(by.linkText("下一页")).click()
                    index = yield IndexOfRecord(recordId_first)
                        // console.log('index  =  ' + index)
                }
                var getLastPageRecordList = yield getOnePageRecordList()
                index = index % 10;
                // console.log('-index- = ' + index)
                var lastPagePopRecordList = getLastPageRecordList.slice(0, index - 1)
                recordList = recordList.concat(lastPagePopRecordList)
                    // console.log('---recordList =  ' + JSON.stringify(recordList))
                recordList = recordList.filter(function(record) {
                        return record.ad_id == ads
                    })
                    // console.log('recordList =  ' + JSON.stringify(recordList))
                validateRecordList(recordList, done)
            })
        }

        co(function*() {
            // console.log('global.ads=' + global.ads)
            browser.driver.manage().window().maximize();
            browser.get('http://' + browser.params.mallServer + '/index.html#/');
            yield element(by.id('mall-user-input')).sendKeys('cmol');
            yield element(by.id('mall-password-input')).sendKeys('12345678');
            // yield element(by.model('user.checkIn')).click();
            yield element(by.id('mall-login-btn')).click();
            yield browser.setLocation('ad_effect');
            yield checkAdsEffect()
        })
    }, 100000)
})