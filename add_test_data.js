var child = require('child_process');
var assert = require('assert');
var request = require('request');
var request = request.defaults({
    jar: true
});
var qs = require('querystring');
var encrypt = require('./rsa/decrypt').encrypt;
var check_response = require('./utils/common').check_response;


// var owner_id;
var owner_name = '测试账号';
// var owner_account = 'test6';
// var owner_password = '12345678';

// var shop_id;
var shop_name = '测试店铺';
var shop_introduction = '店主很懒，什么都没有留下！';
var shop_address = '街道口';
var shop_type = '30元/月';
var shop_contact = 't';
var shop_phone = '1111111111';

// var ap_id;
var ap_mac = '60:cd:a9:00:00:00';
var ap_authcode = '60cda9000000';

describe('add test data', function() {
    it('/oa/prior/login', function(done) {
        var time = new Date();
        time = parseInt(time.getTime(), 10);
        time = time.toString(); //转换成字符串
        //json键值对
        var form = {
            'account': 'oauth',
            'password': 'admin&^%$#',
            'time': time
        };
        form = JSON.stringify(form); //将json对象转换成字符串
        //加密
        encrypt(form).then(function(data) {
            form = data;
        }).then(function() {
            request.post({
                'url': 'http://' + browser.params.mallServer + '/service/201/node-tair-web/oa/prior/login',

                'form': {
                    'form': form
                }
            }, function(err, httpResponse, body) {
                // console.log("oa/prior/login body=" + body)
                check_response(err, body).then(function(msg) {
                    done()
                })
            });
        })
    })

    it('/owner/add', function(done) {
        //json用于保存数据
        var form = {
            'name': owner_name,
            'account': global.owner_account,
            'password': global.owner_password,
        }
        request.post({
            'url': 'http://' + browser.params.mallServer + '/service/201/node-tair-web/oa/owner/add',
            'form': form
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log("owner/add msg:" + msg);
                global.owner_id = msg.id;
                console.log('global.owner_id=' + global.owner_id);
                done();
            })
        })
    })

    it('/shop/add', function(done) {
        var form = {
            'owner': global.owner_id,
            'name': shop_name,
            'introduction': shop_introduction,
            'address': shop_address,
            'type': shop_type,
            'contact': shop_contact,
            'phone': shop_phone,
            'code': 0,
        }
        request.post({
            'url': 'http://' + browser.params.mallServer + '/service/201/node-tair-web/oa/shop/add',
            'form': form
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log("shop/add msg:" + msg);
                global.shop_id = msg.id;
                console.log('global.shop_id=' + global.shop_id);
                done();
            })
        })
    })

    it('/ap/add', function(done) {
        var form = {
            'owner': global.owner_id,
            'shopId': global.shop_id,
            'ssid': '',
            'type': 'CP WLAN2100',
            'mac': ap_mac,
            'authcode': ap_authcode,
            'openid': 'yrnst97np1gv34mprbq757j0edig347e',
        }
        request.post({
            'url': 'http://' + browser.params.mallServer + '/service/201/node-tair-web/oa/ap/add',
            'form': form
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log("shop/add msg:" + msg);
                global.ap_id = msg.id;
                console.log('global.ap_id=' + global.ap_id);
                done();
            })
        })
    })

    // it('/roles/add', function(done) {
    //     var form = {
    //         'owner': global.owner_id,
    //         'type': 'vip',
    //         'level': '1',
    //     }
    //     request.post({
    //         'url': 'http://' + browser.params.storeServer + '/service/201/node-tair-web/oa/acl/roles/add',
    //         'form': form
    //     }, function(err, httpResponse, body) {
    //         check_response(err, body).then(function(msg) {
    //             // console.log('add vip:' + JSON.stringify(body))
    //             done()
    //         })
    //     })
    // })
})