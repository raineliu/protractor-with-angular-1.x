//配置文件

exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://wushuu-selenium:4444/wd/hub',
    specs: ['add_test_data.js', 'home.js', 'shop_basic_set.js', 'list.js', 'vip_list.js', 'add_ads_space.js', 'add_ads_group.js', 'add_ads_content.js', 'ads_click_test.js', 'delete_ads_content.js', 'delete_ads_group.js', 'delete_ads_space.js', 'delete_test_data.js'],
    capabilities: {
        browserName: 'chrome'
    },
    jasmineNodeOpts: {
        print: function() {}
    },
    onPrepare: function() {
        global.adsGroup = "inital adsGroup Value";
        global.adsSpace = "inital adsSpace Value";
        global.ads = "inital ads Value";
        global.clickPrice = 3;
        global.showPrice = 0.3;
        global.owner_account = global.owner_account || 'test666';
        global.owner_password = global.owner_password || '12345678';
        global.owner_id;
        global.shop_id;
        global.ap_id;
        global.roles_id;
        browser.params.storeServer = browser.params.storeServer || "wushuu-server/gitlab-ci/web/store";
        browser.params.mallServer = browser.params.mallServer || "wushuu-server/web/mall";
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'all'
        }));
    }
}