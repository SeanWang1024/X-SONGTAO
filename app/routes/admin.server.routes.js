var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var fs = require('fs');

var mongoose = require('mongoose');
var basicData = require('../services/basicData.server.js');

//数据模型
// var MyInfo = mongoose.model('MyInfo');
var Tags = mongoose.model('Tags');
var Article = mongoose.model('Articles');

//控制器
var MyInfoController = require('../controllers/myinfo.server.controller.js');
var TagsController = require('../controllers/tags.server.controller.js');
var ArticleController = require('../controllers/article.server.controller.js');



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('admin.server.view.hbs');
});

//栏目一->myinfo
//get->myinfo数据
router.get('/api/myinfo', MyInfoController.get);
//post>myinfo数据
router.post('/api/myinfo', MyInfoController.edit);
//图片上传处理
router.post('/api/myinfo/imgupload', multipartMiddleware, MyInfoController.imgupload);

//栏目二 ->tags
//增加
router.post('/api/tags/add', TagsController.add);
//修改
router.post('/api/tags/edit', TagsController.edit);
//查找
router.get('/api/tags', TagsController.get);

//栏目三 ->article
//增加
router.post('/api/article/add', ArticleController.add);

//查找全部
router.get('/api/article', ArticleController.getAll);

//根据id查找
router.get('/api/article/:id', ArticleController.getById);
//根据id修改
router.post('/api/article/:id',ArticleController.editById);
//根据id删除
router.delete('/api/article/:id', ArticleController.deleteById);

module.exports = router;


