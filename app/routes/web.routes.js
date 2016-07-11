var express = require('express');
var router = express.Router();
let $checkToken = require('../utils/checkToken.utils.js');


// router.use(function (req, res,next) {
//     // console.log(req.path);
//     //对于访问api的路由,直接通过
//     if(req.path.indexOf('/api')>=0){
//         next();
//     }else{
//         //对于访问angualr子页面的路由,跳转到angular启动页
//         res.sendfile('public/web/index.html');
//     }
// });
/* GET 前端显示-blog home page. 前后端合并*/
router.get('/', function (req, res, next) {
    res.set('Content-Type', 'text/html');
    res.sendfile('public/web/index.html');
});
module.exports = router;