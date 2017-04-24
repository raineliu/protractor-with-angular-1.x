var child = require('child_process');
var assert = require('assert');
var request = require('request');
var request = request.defaults({
    jar: true
});
var qs = require('querystring');
var encrypt = require('./rsa/decrypt').encrypt;
var check_response = require('./utils/common').check_response;


describe('delete test data', function() {
    it('/account/owner/login', function(done) {
        var time = new Date();
        time = parseInt(time.getTime(), 10);
        time = time.toString(); //转换成字符串
        //json键值对
        var form = {
            'account': 'oauth',
            'password': 'admin&^%$#',
            'time': time
        };
        form = JSON.stringify(form);
        encrypt(form).then(function(data) {
            form = data;
        }).then(function() {
            request.post({
                'url': 'http://' + browser.params.mallServer + '/service/201/node-tair-web/oa/prior/login',
                'form': {
                    'form': form
                }
            }, function(err, httpResponse, body) {
                check_response(err, body).then(function(msg) {
                    done()
                })
            });
        })
    })

    it('/owner/remove', function(done) {
        var qs = {
            'id': global.owner_id,
        }
        request.get({
            'url': 'http://' + browser.params.storeServer + '/service/201/node-tair-web/oa/owner/remove',
            'qs': qs,
            json: true
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log('owner/remove :' + JSON.stringify(body));
                done();
            })
        })
    })

    it('/shop/remove', function(done) {
        var qs = {
            'id': global.shop_id,
        }
        request.get({
            'url': 'http://' + browser.params.storeServer + '/service/201/node-tair-web/oa/shop/remove',
            'qs': qs,
            json: true
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log('shop/remove:' + JSON.stringify(body));
                done();
            })
        })
    })

    it('/ap/remove', function(done) {
        var qs = {
            'id': global.ap_id,
        }
        request.get({
            'url': 'http://' + browser.params.storeServer + '/service/201/node-tair-web/oa/ap/remove',
            'qs': qs,
            json: true
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log('ap/remove:' + JSON.stringify(body));
                done();
            })
        })
    })

    it('/roles/remove', function(done) {
        var form = {
            'owner': global.owner_id,
            'type': 'vip',
            'level': '1',
        }
        request.post({
            'url': 'http://' + browser.params.storeServer + '/service/201/node-tair-web/oa/acl/roles/remove',
            'form': form
        }, function(err, httpResponse, body) {
            check_response(err, body).then(function(msg) {
                // console.log('/roles/remove:' + JSON.stringify(body))
                done()
            })
        })
    })



})