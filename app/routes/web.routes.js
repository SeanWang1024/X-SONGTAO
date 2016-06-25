var express = require('express');
var router = express.Router();

//数据库
// var mongoose = require('mongoose');

//数据模型
// var MyInfo = mongoose.model('MyInfo');
// var Tags = mongoose.model('Tags');
// var Article = mongoose.model('Articles');

//控制器
// var TagsController = require('../controllers/tags.client.controller.js');
// var HistoryController = require('../controllers/history.client.controller.js');
// var ArticleController = require('../controllers/article.client.controller.js');

//加载工具类
// var utils = require('../utils/common.js');

/* GET 前端显示-blog home page. */
router.get('/', function (req, res, next) {
    res.render('home.client.view.hbs');
});
/* GET home page. */
router.get('/admin', function (req, res, next) {
    //判断是否登录,需要完善
    if (true) {
        res.render('admin.server.view.hbs');
    } else {

    }
});


// //最近更新--查找文章list
// router.get('/api/blog/articles', ArticleController.getArticleList);
//
// //根据文章id查找文章内容,url定义数据
// //根据文章id查找
// router.get('/api/:catalogueName/article/:id', ArticleController.getById);
// //时间轴
// router.get('/api/:catalogueName/historys', HistoryController.getHistoryList);
// //标签库
// router.get('/api/:catalogueName/tags', TagsController.getTagsList);
//
// //根据标签id查找文章集合
// router.get('/api/:catalogueName/tag/:id', TagsController.getTagById);


module.exports = router;
