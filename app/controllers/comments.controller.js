/**
 * Created by xiangsongtao on 16/3/3.
 */
let mongoose = require('mongoose');
let fs = require('fs');
//MyInfo的数据模型
let Comments = mongoose.model('Comments');
let Articles = mongoose.model('Articles');
//数据库查询同一错误处理
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');

module.exports = {
    getAll:  function (req, res, next) {
        Comments.find({}, function (err, docs) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            res.send({
                "code": "1",
                "msg": "comments list",
                "data": docs
            })
        })
    },
    //区分获取的是根评论还是子评论
    getById: function (req, res, next) {
        //循环请求更具id获取评论信息
        let CommentsArr = [];

        function getCommentDetail(arr) {
            let totalLen = arr.length;
            let recordLen = 0;
            return new Promise(function (resolve, reject) {
                //执行
                getComment(arr);

                //函数定义
                function getComment(arr) {
                    console.log(`获取id:${arr[recordLen]}`);
                    Comments.findOne({_id: arr[recordLen]}, function (err, comment) {
                        if (err) {
                            DO_ERROR_RES(res);
                            reject();
                            return next();
                        }
                        recordLen++;
                        if (!!comment) {
                            CommentsArr.push(comment);
                        }

                        if (totalLen === recordLen) {
                            //请求完毕
                            resolve();
                        } else {
                            //还有未请求的数据
                            getComment(arr);
                        }
                    });
                }
            })
        }

        Comments.findOne({_id: req.params.comment_id}, function (err, comment) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!comment) {
                CommentsArr.push(comment);
                if (comment.article_id === comment.pre_id && comment.next_id.length > 0) {
                    //在这个情况下,next_id是可能有值的。
                    getCommentDetail(comment.next_id).then(function () {
                        res.status(200);
                        res.send({
                            "code": "1",
                            "msg": "find comment by comment_id success!",
                            "data": CommentsArr
                        })
                    }, function () {
                        res.status(200);
                        res.send({
                            "code": "2",
                            "msg": "get sub comment by comment_id failure!"
                        })
                    });
                } else {
                    res.status(200);
                    res.send({
                        "code": "1",
                        "msg": "find comment by comment_id success!",
                        "data": CommentsArr
                    })
                }

            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": "comment non-exist!"
                })
            }
        })
    },
    edit: function (req, res, next) {
        Comments.findOne({_id: req.body._id}, function (err, comment) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!comment) {
                let {name, email, time, content, ip, state} = req.body;
                //数据写入并保存
                comment.name = name;
                comment.email = email;
                comment.time = time;
                comment.content = content;
                comment.ip = ip;
                comment.state = state;
                //保存
                comment.save();
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "comment edit success!",
                    "data": comment
                });
            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": "comment edit failure, comment non-exist!"
                });
            }
        });
    },
    delete:function (req, res, next) {
        //更新文章
        function refreshArticle(comment) {
            return new Promise(function (resolve, reject) {
                Articles.findOne({_id: comment.article_id}, function (err, article) {
                    if (err) {
                        reject();
                    }

                    if (!!article) {
                        if (comment.article_id === comment.pre_id) {
                            //删除主评论时,统计下面子评论数
                            let deleteNum = comment.next_id.length + 1;
                            if (article.comment_num > deleteNum) {
                                article.comment_num -= deleteNum;
                            } else {
                                article.comment_num = 0;
                            }
                        } else {
                            //只是删除子评论自己
                            !!article.comment_num ? article.comment_num-- : (article.comment_num = 0);
                        }
                        article.save();
                        resolve();
                    } else {
                        reject();
                    }
                });
            })
        }

        //更新评论,
        function refreshComment(comment) {
            return new Promise(function (resolve, reject) {
                if (comment.article_id === comment.pre_id) {
                    //更新的评论是父评论,需要将手下的字评论删除
                    for (let child_comment_id of comment.next_id) {
                        Comments.remove({_id: child_comment_id});
                    }
                    resolve();
                } else {
                    Comments.findOne({_id: comment.pre_id}, function (err, preComment) {
                        if (err) {
                            reject();
                        }
                        if (!!preComment && preComment.article_id === preComment.pre_id) {
                            //更新的是子评论,需要到父级去除自己的信息
                            preComment.next_id.splice(preComment.next_id.indexOf(comment._id), 1);
                            preComment.save();
                            resolve();
                        } else {
                            reject();
                        }
                    })
                }

            });
        }

        Comments.findOne({_id: req.params.id}, function (err, comment) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!comment) {
                refreshArticle(comment).then(function () {
                    refreshComment(comment).then(function () {
                        comment.remove();
                        res.status(200);
                        res.send({
                            "code": "1",
                            "msg": `delete success, comment_num && pre_comment has removed!`
                        });
                    }, function () {
                        res.status(200);
                        res.send({
                            "code": "2",
                            "msg": `pre comment non-exist or error!`
                        });
                    })
                }, function () {
                    res.status(200);
                    res.send({
                        "code": "2",
                        "msg": `article non-exist!`
                    });
                });
            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": `comment non-exist!`
                });
            }
        });

    },
    getByArticleId:function (req, res, next) {
        let CommentsArr = [];
        Comments.find({article_id: req.params.article_id}, function (err, comments) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            for (let comment of comments) {
                if (comment.article_id === comment.pre_id) {
                    //根评论
                    let tpl = [];
                    tpl.push(comment);
                    for (let next_id of comment.next_id) {
                        //得到next_id,查找comments中的评论记录
                        for (let com of comments) {
                            if (next_id.toString() === com._id.toString()) {
                                tpl.push(com);
                            }
                        }
                    }
                    CommentsArr.push(tpl);
                }
            }
            res.status(200);
            res.send({
                "code": "1",
                "msg": "find comments by article_id success!",
                "data": CommentsArr
            });
        })
    },
    add: function (req, res, next) {
        let {article_id, pre_id, next_id, name, email, time, content, ip, state} =  req.body;
        let comment = new Comments({
            article_id,
            pre_id,
            next_id,
            name,
            email,
            time,
            content,
            ip,
            state
        });

        //将此评论挂载到article_id这个文章下
        function refreshArticle(article_id) {
            return new Promise(function (resolve, reject) {
                Articles.findOne({_id: article_id}, function (err, article) {
                    if (err) {
                        reject();
                    }
                    if (!!article) {
                        article.comment_num++;
                        article.save();
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }

        function refreshPreComment(comment) {
            return new Promise(function (resolve, reject) {
                Comments.findOne({_id: comment.pre_id}, function (err, preComment) {
                    if (err) {
                        reject();
                    }
                    if (!!preComment && preComment.article_id === preComment.pre_id) {
                        //对根评论进行修改
                        preComment.next_id.push(comment._id);
                        //当前子评论关闭子子评论
                        comment.next_id = [];
                        preComment.save();
                        resolve();
                    } else {
                        reject();
                    }
                })
            });
        }

        refreshArticle(article_id).then(function () {
            //保存评论
            comment.save();
            if (comment.article_id !== comment.pre_id) {
                //对评论进行跟评
                refreshPreComment(comment).then(function () {
                    res.status(200);
                    res.send({
                        "code": "1",
                        "msg": "comment create success, pre comment edit success!",
                        "data": comment
                    });
                }, function () {
                    res.status(200);
                    res.send({
                        "code": "2",
                        "msg": "pre comment edit failure!"
                    });
                })
            } else {
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "comment create success!",
                    "data": comment
                });
            }
        }, function () {
            res.status(200);
            res.send({
                "code": "2",
                "msg": "article non-exist, so comment create failure!"
            });
        });
    },
    check:function (req,res,next) {
        Comments.findOne({_id: req.body._id}, function (err, comment) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            if (!!comment) {
                let {state} = req.body;
                //数据写入并保存
                comment.state = !!state;
                //保存
                comment.save();
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "comment check success!",
                    "data": comment
                });
            } else {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": "comment check failure, comment non-exist!"
                });
            }
        });
    }
};






