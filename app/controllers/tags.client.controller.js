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
    getTagsList: function (req, res, next) {
        //查找标签,只能查到启用的标签
        Tags.find({catalogueName: req.params.catalogueName,state:1}, function (err, docs) {
            if (err) {
                return next(err);
            }
            res.status(200);
            res.send(docs);
        });
    },
    getTagById: function (req, res, next) {
        //查找tag表
        var findTags;
        Tags.find({catalogueName:req.params.catalogueName}, function (err, docs) {
            if (err) {
                res.end("error");
                return next();
            }
            findTags = docs;
        });
        //
        var tagData = {
            articleList: []
        }
        /*
         * 定义article文档索引
         * ArticleIndexData包含文件:
         * index  name  _id
         * 未排序,返回原始顺序
         * */
        Article.find({catalogueName:req.params.catalogueName}, function (err, docs) {
            if (err) {
                res.end("error");
                return next();
            }
            //先找到所有的docs,然后查找tag的id匹配的doc,然后压入articleList中,只是id
            for (var i = 0; docs.length > i; i++) {
                for(var j=0;docs[i].tags.length>j;j++){
                    if(docs[i].tags[j] == req.params.id){
                        tagData.articleList.push(docs[i]);
                    }
                }
            }
            tagData.type = 'tag';
            tagData.typeName = '标签';
            tagData._id = req.params.id;
            tagData.catalogueName = req.params.catalogueName;
            if(req.params.catalogueName == 'FrontEnd'){
                tagData.catalogueCNName = basicData.FrontEndIndex.catalogueCNName;
                tagData.catalogueIconClass = basicData.FrontEndIndex.catalogueIconClass;
            }else if(req.params.catalogueName == 'LifeStyle'){
                tagData.catalogueCNName = basicData.LifeStyleIndex.catalogueCNName;
                tagData.catalogueIconClass = basicData.LifeStyleIndex.catalogueIconClass;
            }
            //tagData.name = req.params.id,

            //找到当前点击的标签的标签名
            for(var i = 0;findTags.length>i;i++){
                if(findTags[i]._id == req.params.id){
                    tagData.name = findTags[i].name;
                }
            }


            //找到文章的标签名
            for(var i = 0;tagData.articleList.length>i;i++){
                //清空
                var tagsTpl = [];
                for(var j =0;tagData.articleList[i].tags.length>j;j++){
                    //清空
                    var tagTpl = {
                        _id:'',
                        name:''
                    };
                    var name =utils.findTagNameById(tagData.articleList[i].tags[j])
                    if(name){
                        tagTpl._id = tagData.articleList[i].tags[j];
                        tagTpl.name = name;
                        tagsTpl.push(tagTpl);
                    }
                }
                tagData.articleList[i].tags = tagsTpl;
            }
            res.send(tagData)
        });
    }
}
;






