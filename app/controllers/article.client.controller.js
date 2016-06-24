/**
 * Created by xiangsongtao on 16/3/4.
 */
var mongoose = require('mongoose');
var basicData = require('../services/basicData.server.js');

//MyInfo的数据模型
var Tags = mongoose.model('Tags');
var Article = mongoose.model('Articles');

//加载工具类
var utils = require('../utils/common.js');


module.exports = {
    getArticleList: function (req, res, next) {
        //定义数据结构
        var articleLists = {
            articleLists: []
        };
        var data = {
            title: "",
            time: "",
            readNum: "",
            tags: [],
            content: ""
        };
        var tag = {
            id: "",
            name: ""
        };

        //查找文章
        Article.find({catalogueName: req.params.catalogueName,state: true}, function (err, docs) {
            if (err) {
                res.end("error");
                return next();
            }

            //数据处理加工之后再发送到前端
            for (var i = 0; docs.length > i; i++) {
                data = {
                    tags: []
                };
                //标签补充
                //如果标签为空,则直接跳过
                if (docs[i].tags !== null) {
                    for (var j = 0; docs[i].tags.length > j; j++) {
                        tag = {};
                        var id = docs[i].tags[j];
                        tag.id = id;
                        var nameTpl = utils.findTagNameById(id);
                        if (nameTpl) {
                            tag.name = nameTpl;
                        } else {
                            continue;
                        }
                        data.tags.push(tag);
                    }
                }

                //补充其他数据
                data.content = docs[i].content;
                data.state = docs[i].state;
                data.articleType = docs[i].articleType;
                data.readNum = docs[i].readNum;
                data.time = docs[i].time;
                data.title = docs[i].title;
                data.catalogueName = docs[i].catalogueName;
                data._id = docs[i]._id;
                //填装
                articleLists.articleLists.push(data);
            }
            res.status(200);
            res.json(articleLists);

        })

    },
    getById: function (req, res, next) {

        /*
         * 定义article文档索引
         * ArticleIndexData包含文件:
         * index  name  _id
         * 未排序,返回原始顺序
         * */
        var ArticleIndexData = [];
        Article.find({}, function (err, docs) {
            if (err) {
                res.end("error");
                return next();
            }
            for (var i = 0; docs.length > i; i++) {
                //针对分类名简历索引
                if (req.params.catalogueName == docs[i].catalogueName) {
                    var ArticleIndex = {};
                    ArticleIndex._id = docs[i]._id;
                    ArticleIndex.title = docs[i].title;
                    ArticleIndex.index = i;
                    ArticleIndexData.push(ArticleIndex);
                }
            }
        });

        //定义article结构
        var data = {
            tags: [],
            otherPages: {}
        };
        var tag = {
            id: "",
            name: ""
        };


        Article.findOne({_id: req.params.id}, function (err, doc) {
            if (err) {
                res.end("error");
                return next();
            } else {
                //将得到的标签压入栈中
                if (doc.tags !== null) {
                    for (var i = 0; doc.tags.length > i; i++) {
                        tag = {};
                        var id = doc.tags[i];
                        tag.id = id;
                        //结果确认
                        var nameTpl = utils.findTagNameById(id);
                        if (nameTpl) {
                            tag.name = nameTpl;
                        } else {
                            continue;
                        }
                        data.tags.push(tag);
                    }
                }
                //其他数据
                data.type = doc.type;
                data.typeName = '文章';
                data.catalogueName = req.params.catalogueName;
                if (req.params.catalogueName == 'LifeStyle') {
                    data.catalogueCNName = basicData.LifeStyleIndex.catalogueCNName;
                    data.catalogueIconClass = basicData.LifeStyleIndex.catalogueIconClass;
                } else if (req.params.catalogueName == 'FrontEnd') {
                    data.catalogueCNName = basicData.FrontEndIndex.catalogueCNName;
                    data.catalogueIconClass = basicData.FrontEndIndex.catalogueIconClass;
                }
                data.articleType = doc.articleType;
                data._id = doc._id;
                data.title = doc.title;
                data.time = doc.time;
                data.state = doc.state;
                data.content = doc.content;
                data.readNum = doc.readNum;
                //其余页的信息
                for (var i = 0; ArticleIndexData.length > i; i++) {
                    if (ArticleIndexData[i]._id.toString() == doc._id.toString()) {
                        //如果是第一个元素的情况
                        if (i === 0) {
                            data.otherPages.prevPageID = '';
                            data.otherPages.prevPageName = '';
                            data.otherPages.nextPageID = ArticleIndexData[i + 1]._id;
                            data.otherPages.nextPageName = ArticleIndexData[i + 1].title;
                        } else if (i === ArticleIndexData.length - 1) {
                            //如果是最后一个元素的情况
                            data.otherPages.prevPageID = ArticleIndexData[i - 1]._id;
                            data.otherPages.prevPageName = ArticleIndexData[i - 1].title;
                            data.otherPages.nextPageID = '';
                            data.otherPages.nextPageName = '';
                        } else {
                            data.otherPages.prevPageID = ArticleIndexData[i - 1]._id;
                            data.otherPages.prevPageName = ArticleIndexData[i - 1].title;
                            data.otherPages.nextPageID = ArticleIndexData[i + 1]._id;
                            data.otherPages.nextPageName = ArticleIndexData[i + 1].title;
                        }
                    }
                }
                //阅读数+1并保存结果
                doc.readNum += 1;
                doc.save();
                //返回
                res.status(200);
                res.send(data);
            }
        });
    }
}
;






