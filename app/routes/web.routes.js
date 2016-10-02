var express = require('express');
var router = express.Router();
var cors = require('cors');
let getClientIp = require('../utils/getClientIp.utils.js');
// router.use(function (req, res, next) {
//     // console.log(req.path);
//     //对于访问api的路由,直接通过
//     if (req.path.includes('/api')) {
//         next();
//     } else {
//         //对于访问子页面的路由,跳转到启动页
//         res.sendfile('public/index.html');
//     }
// });
let mongoose = require('mongoose');
//数据模型
let Statistic = mongoose.model('Statistic');
//控制器
let StatisticController = require('../controllers/statistic.controller.js');
//数据库查询同一错误处理


/**
 * 访问数据统计
 * */
router.all('*', cors(), function (req, res, next) {
	let ip = getClientIp(req);
	ip = '114.216.27.113';
	let path = req.path.toString();
	let time = new Date();
	StatisticController.record(ip, path, time);
	next();
});


/* GET 前端显示-blog home page. 前后端合并*/
router.get('/', function (req, res, next) {
	res.set('Content-Type', 'text/html');
	res.sendfile('public/index.html');
});
module.exports = router;