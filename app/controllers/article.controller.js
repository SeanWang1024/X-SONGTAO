/**
 * Created by xiangsongtao on 16/3/4.
 */
let mongoose = require('mongoose');

//MyInfo的数据模型
let Tags = mongoose.model('Tags');
let Articles = mongoose.model('Articles');
let Comments = mongoose.model('Comments');
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');

//获取所有tags的array
function findAllTags() {
    return new Promise(function (resolve) {
        Tags.find({}, function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            !!docs ? resolve(docs) : resolve([]);
        });
    })
}
//由id在tagsAray中查找他的名字
function findTagNameById(tags, id) {
    for (let tag of tags) {
        if (tag._id.toString() === id.toString()) {
            return tag.name;
            break;
        }
    }
    return null;
}

module.exports = {
    add: function (req, res, next) {
        let {title, publish_time, author, tags, state, content} =  req.body;
        let article = new Articles({
            title,
            publish_time,
            author,
            read_num: 0,
            comment_num: 0,
            comment_id: "",
            tags,
            state,
            content
        });
        article.save();
        res.status(200);
        res.send({
            "code": "1",
            "msg": "article add success!",
            "data": article
        });
    },
    editById: function (req, res, next) {
        Articles.findOne({_id: req.body._id}, function (err, article) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!article) {
                let {title, publish_time, author, tags, state, content} = req.body;
                //数据写入并保存
                article.title = title;
                article.publish_time = publish_time;
                article.author = author;
                article.tags = tags;
                article.state = state;
                article.content = content;
                //保存
                article.save();
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "article edit success!",
                    "data": article
                });
            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": "article edit failure, article non-exist!"
                });
            }
        });
    },
    /***
     * 需要在查询文章的时候,对comment_num进行统计
     * 还有tag_num进行统计
     */
    getAll: function (req, res, next) {
        //查找文章
        Articles.find({}, function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //docs不为空,最少为[]
            let articles = docs;
            findAllTags().then(function (tags) {
                for (let i = 0, art_len = articles.length; art_len > i; i++) {
                    for (let j = 0; articles[i].tags.length > j; j++) {
                        //tag id => tag name
                        // articles[i].tags[j] = findTagNameById(tags, articles[i].tags[j]);

                        //tag id => tag name
                        let name = findTagNameById(tags, articles[i].tags[j]);
                        if (!name) {
                            //对于未找到tagid的则去除此位置
                            articles[i].tags.splice(j, 1);
                            j--;
                        } else {
                            articles[i].tags[j] = name;
                        }
                    }
                }
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "article list get success!",
                    "data": articles
                });
            });
        })
    },
    getAllWithPages:function (req, res, next) {
        //查找文章
        let from = parseInt(req.params[0]);
        let limit = parseInt(req.params[1]);
        Articles.find({}).sort('publish_time').skip(from).limit(limit).exec(function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //docs不为空,最少为[]
            let articles = docs;
            findAllTags().then(function (tags) {
                for (let i = 0, art_len = articles.length; art_len > i; i++) {
                    for (let j = 0; articles[i].tags.length > j; j++) {
                        //tag id => tag name
                        let name = findTagNameById(tags, articles[i].tags[j]);
                        if (!name) {
                            //对于未找到tagid的则去除此位置
                            articles[i].tags.splice(j, 1);
                            j--;
                        } else {
                            articles[i].tags[j] = name;
                        }
                    }
                }
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "article list get success!",
                    "data": articles
                });
            });
        });
    },
    getById: function (req, res, next) {
        //需要处理,因为单个文章是文章的全文,并且含有文章的评论信息
        Articles.findOne({_id: req.params.id}, function (err, doc) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!doc) {
                //阅读数++
                doc.read_num ++;
                doc.save();
                let article = doc;
                findAllTags().then(function (tags) {
                    for (let j = 0; article.tags.length > j; j++) {
                        //tag id => tag name
                        let name = findTagNameById(tags, article.tags[j]);
                        if (!name) {
                            //对于未找到tagid的则去除此位置
                            article.tags.splice(j, 1);
                            j--;
                        } else {
                            article.tags[j] = name;
                        }
                    }

                    res.status(200);
                    res.send({
                        "code": "1",
                        "msg": `get aurticle ${req.params.id} success! but get comment need other request to {{url}}/api/article/comments/:id`,
                        "data": {
                            article
                        }
                    });
                });
            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": `article non-exist!`
                });
            }
        });
    },
    delete: function (req, res, next) {
        //删除文章还要删除和文章一起的评论
        Articles.findOne({_id: req.params.id}, function (err, article) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!article) {
                //先删除评论!!
                Comments.remove({article_id: article._id}, function (err) {
                    if (err) {
                        DO_ERROR_RES(res);
                        return next();
                    }
                    article.remove();
                    res.status(200);
                    res.send({
                        "code": "1",
                        "msg": `delete success, article && comment has removed!`
                    });
                });
            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": `article non-exist!`
                });
            }

        });
    },
    //获取文章历史记录,需要根据【年】->【月】->【文章arr】划分组合
    getHistory: function (req, res, next) {
        Articles.find({}, {'title': 1, 'publish_time': 1, 'author': 1, 'read_num': 1, 'comment_num': 1, 'state': 1}).sort('-publish_time').exec(function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            let historyArr = [];
            let yearObj = {};
            let monthObj = {};
            let articleArr = [];

            function toDate(timestamp) {
                let timestampInt = parseInt(timestamp);
                if(timestampInt.toString().length === 13){
                    //正确的时间戳
                    return new Date(timestampInt);
                }else{
                    //错误的时间戳返回现在时间
                    return new Date();
                }
            }

            //new Date().getDate()
            //new Date().getMonth()
            //new Date().getFullYear()
            // while(docs.length){
                // if(){
                //
                // }
            // }

            res.status(200);
            res.send({
                "code": "1",
                "msg": `article history find success!`,
                "data": docs
            });

        })
    },
    getByTagId: function (req, res, next) {
        //根据tag查找文章,不限制文章数量
        Articles.find({tags:{"$in":[req.params.id]}}, function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //docs不为空,最少为[]
            let articles = docs;
            findAllTags().then(function (tags) {
                for (let i = 0, art_len = articles.length; art_len > i; i++) {
                    for (let j = 0; articles[i].tags.length > j; j++) {
                        //tag id => tag name
                        let name = findTagNameById(tags, articles[i].tags[j]);
                        if (!name) {
                            //对于未找到tagid的则去除此位置
                            articles[i].tags.splice(j, 1);
                            j--;
                        } else {
                            articles[i].tags[j] = name;
                        }
                    }
                }
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "find article by tag_id success!",
                    "data": articles
                });
            });
        })
    }
}
;






