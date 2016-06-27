var express = require('express');
var router = express.Router();
let $checkToken = require('../utils/checkToken.utils.js');

/* GET 前端显示-blog home page. */
router.get('/', function (req, res, next) {
    res.render('home.client.view.hbs');
});
/* GET home page. */
router.get('/admin/:token', function (req, res, next) {
    $checkToken(req.params.token).then(function () {
        console.log("验证通过,进入admin!");
        //可以进入admin页面
        res.status(200);
        res.render('admin.server.view.hbs');
    },function () {
        //发送登录页面
        console.log("验证失败,进入login!");
        res.status(200);
        res.redirect('/#/login');
    });
});
module.exports = router;