/**
 * Created by xiangsongtao on 16/3/4.
 */
let mongoose = require('mongoose');

//MyInfo的数据模型
let Tags = mongoose.model('Tags');
let Articles = mongoose.model('Articles');
let Comments = mongoose.model('Comments');
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');

let marked = require('marked');
let hljs = require('highlight.js');

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
    //增加,增加的同时对标签使用num++
    add: function (req, res, next) {
        let {title, publish_time, tags, state, content} =  req.body;
        let article = new Articles({
            title,
            publish_time,
            read_num: 0,
            comment_num: 0,
            comment_id: "",
            tags,
            state,
            content
        });
        article.save();
        //tag used_num ++
        for (let tag_id of article.tags) {
            Tags.findOne({_id: tag_id}, function (err, tag) {
                if (!!tag) {
                    tag.used_num++;
                    tag.save();
                }
            })
        }

        res.status(200);
        res.send({
            "code": "1",
            "msg": "article add success!",
            "data": article
        });
    },
    //对标签使用num进行处理
    editById: function (req, res, next) {
        Articles.findOne({_id: req.body._id}, function (err, article) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!article) {
                let {title, publish_time, tags, state, content} = req.body;
                /**
                 * tag判断操作
                 * */
                let oldTags = article.tags;
                //找新增的
                for (let new_tag of tags) {
                    if (oldTags.indexOf(new_tag) === -1) {
                        Tags.findOne({_id: new_tag}, function (err, tag) {
                            if (!!tag) {
                                tag.used_num++;
                                tag.save();
                            }
                        });
                    }
                }
                //找去除的
                for (let old_tag of oldTags) {
                    if (tags.indexOf(old_tag) === -1) {
                        Tags.findOne({_id: old_tag}, function (err, tag) {
                            if (!!tag && tag.used_num > 0) {
                                tag.used_num--;
                                tag.save();
                            }
                        });
                    }
                }

                /**
                 * markdown转html
                 **/
                marked.setOptions({
                    renderer: new marked.Renderer(),
                    gfm: true,
                    tables: true,
                    breaks: true,
                    pedantic: false,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false,
                    highlight: function (code) {
                        return hljs.highlightAuto(code).value;
                    }
                });
                article.content = marked(content);



                //数据写入并保存
                article.title = title;
                article.publish_time = publish_time;
                article.tags = tags;
                article.state = state;
                // article.content = content;
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
     * 评论统计在评论新增、修改、删除的时候进行,
     * 评论的数据模型带有文章id,因此可追溯
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
                //替换标签名字不对数据库数据进行修改
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "article list get success!",
                    "data": articles
                });
            });
        })
    },
    getAllWithPages: function (req, res, next) {
        //查找文章
        let from = parseInt(req.params[0]);
        let limit = parseInt(req.params[1]);
        Articles.find({}).sort('-publish_time').skip(from).limit(limit).exec(function (err, docs) {
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
                doc.read_num++;
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
                        "data": article
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
        //删除文章还要删除和文章一起的评论,还有标签统计
        Articles.findOne({_id: req.params.id}, function (err, article) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!article) {
                //减去tags的引用
                for (let tag of article.tags) {
                    Tags.findOne({_id: tag}, function (err, tag) {
                        if (!!tag && tag.used_num > 0) {
                            tag.used_num--;
                            tag.save();
                        }
                    });
                }

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
                        "msg": `delete success, article && tag_num && comment has removed!`
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
        Articles.find({}, {'title': 1, 'publish_time': 1, 'read_num': 1, 'comment_num': 1, 'state': 1}).sort('-publish_time').exec(function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            let historyArr = [];
            let yearObj = {};
            let monthObj = {};

            //将时间戳转化为Date
            function toDate(timestamp) {
                let timestampInt = parseInt(timestamp);
                if (timestampInt.toString().length === 13) {
                    //正确的时间戳
                    return new Date(timestampInt);
                } else {
                    //错误的时间戳返回现在时间
                    return new Date();
                }
            }

            //当前循环的-年-月
            let yearNow = 0;
            let monthNow = 0;
            for (let i = 0, docLen = docs.length; docLen > i; i++) {
                //记录当前文章的时间-年-月
                let tplYear = toDate(docs[i].publish_time).getFullYear();
                let tplMonth = toDate(docs[i].publish_time).getMonth() + 1;
                if (yearNow !== tplYear) {
                    //保存上一年的年月数据,如果存在的话
                    if (yearNow !== 0) {
                        yearObj.data.push(monthObj);
                        historyArr.push(yearObj);
                    }
                    //初始化
                    yearNow = tplYear;
                    monthNow = tplMonth;
                    yearObj = {
                        "year": yearNow,
                        "data": []
                    };
                    monthObj = {
                        "month": monthNow,
                        "data": []
                    };
                    monthObj.data.push(docs[i]);
                    //判断是否为最后一个,如果是则保存月和年
                    if (docLen == i + 1) {
                        yearObj.data.push(monthObj);
                        historyArr.push(yearObj);
                    }
                } else {
                    //在年中遍历
                    if (tplMonth === monthNow) {
                        //同月的情况
                        monthObj.data.push(docs[i]);
                        if (docLen === i + 1) {
                            yearObj.data.push(monthObj);
                            historyArr.push(yearObj);
                        }

                    } else {
                        //不同月的情况
                        //保存上一个月的obj,(monthObj创建就会附加article数据)
                        yearObj.data.push(monthObj);
                        monthNow = tplMonth;
                        monthObj = {
                            "month": monthNow,
                            "data": []
                        };
                        monthObj.data.push(docs[i]);
                        if (docLen === i + 1) {
                            yearObj.data.push(monthObj);
                            historyArr.push(yearObj);
                        }
                    }

                }
            }
            res.status(200);
            res.send({
                "code": "1",
                "msg": `article history find success!`,
                "data": historyArr
            });
        })
    },
    getByTagId: function (req, res, next) {
        //根据tag查找文章,不限制文章数量
        Articles.find({tags: {"$in": [req.params.id]}}, function (err, docs) {
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






