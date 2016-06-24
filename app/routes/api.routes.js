'use strict';
let express = require('express');
let router = express.Router();

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

let fs = require('fs');

let mongoose = require('mongoose');
let basicData = require('../services/basicData.server.js');
let $base64 = require('../utils/base64.module.js')
//数据模型
// let Authorize = mongoose.model('Authorize');
let Users = mongoose.model('Users');
let Tags = mongoose.model('Tags');
let Comments = mongoose.model('Comments');

let Articles = mongoose.model('Articles');

//控制器
let MyInfoController = require('../controllers/myinfo.server.controller.js');
let TagsController = require('../controllers/tags.server.controller.js');
let ArticleController = require('../controllers/article.server.controller.js');


//数据库查询同一错误处理
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');
// function DO_ERROR_RES(res) {
//     res.status(200);
//     res.send({
//         "code": "9",
//         "msg": "system error or request params error, please check out!",
//     });
// }

// 验证token
function checkToken(token) {
    let [username,password,time] = $base64.decode(token).split("|");
    let timeNow = new Date().getTime();
    return new Promise(function (resolve, reject) {
        //2 hours authorize
        if ((timeNow - time) > 1000 * 60 * 60 * 2) {
            reject({
                "code": "10",
                "msg": "token time out!"
            });
        } else {
            Users.findOne({username: username, password: password}, function (err, doc) {
                if (err) {
                    DO_ERROR_RES(res);
                    reject();
                    return next();
                }
                if (!!doc) {
                    resolve(true);
                } else {
                    reject({
                        "code": "10",
                        "msg": "token format error!"
                    });
                }
            });
        }
    });
}
router.all('*', function (req, res, next) {
    /**
     * 过滤请求
     * get请求+post(login/register)请求不需要token,其余都需要token验证
     * */
    let method = req.method.toLocaleLowerCase();
    let path = req.path.toString();
    if (method === 'get' || path.includes('register') || path.includes('login')) {
        return next();
    } else {
        let authorization = req.get("authorization");

        if (!!authorization) {
            let token = authorization.split(" ")[1];
            checkToken(token).then(function () {
                return next();
            }, function (errObj) {
                res.status(200);
                res.send(errObj);
            })
        } else {
            res.status(200);
            res.send({
                "code": "10",
                "msg": "need token!"
            });
        }
    }
});

//register
router.post('/register', function (req, res, next) {
    let user_ip = req.ip.split(":")[3];
    Users.findOne({username: req.body.username}, function (err, doc) {
        if (err) {
            DO_ERROR_RES(res);
            return next();
        }
        //如果没有数据,则增加
        if (!doc) {
            let {username, password, full_name, position, address, motto, personal_state, img_url} = req.body;
            let login = new Users({
                username,
                password,
                login_info: [{
                    login_time: new Date().getTime().toString(),
                    login_ip: user_ip,
                }],
                full_name,//名字
                position,//职位
                address,//地址
                motto,//座右铭
                personal_state,//我的称述
                img_url//头像imgurl
            });
            //保存
            login.save();
            //发送
            res.status(200);
            let _id = login._id;
            let UserInfo = {_id, username, full_name, position, address, motto, personal_state, img_url};
            res.send({
                "code": "1",
                "msg": "user added and login success!",
                "token": $base64.encode(`${username}|${password}|${new Date().getTime()}`),
                "user_info": UserInfo
            });
        } else {
            //否则修改找到的数据
            res.status(200);
            res.send({
                "code": "2",
                "msg": "user already exist,please use another 'username'!"
            });
        }
    });
});
//login
router.post('/login', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let user_ip = req.ip.split(":")[3];
    console.log("------用户当前请求的ip------");
    console.log(user_ip);
    Users.findOne({username: username}, function (err, doc) {
        if (err) {
            DO_ERROR_RES(res);
            return next();
        }
        //如果没有数据,则增加
        if (!!doc && (doc.password === password)) {
            let {_id, username, full_name, position, address, motto, personal_state, img_url} = doc;
            doc.login_info.push({
                login_time: new Date().getTime(),
                login_ip: user_ip
            });
            //define user info
            let UserInfo = {_id, username, full_name, position, address, motto, personal_state, img_url};
            doc.save();
            res.status(200);
            res.send({
                "code": "1",
                "msg": "login success!",
                "token": $base64.encode(`${username}|${password}|${new Date().getTime()}`),
                "user_info": UserInfo
            });
        } else {
            res.status(200);
            res.send({
                "code": "2",
                "msg": "username or password error, please check out!"
            });
        }
    });
});
//all user list
router.get('/users', function (req, res, next) {
    Users.find({}, function (err, docs) {
        if (err) {
            DO_ERROR_RES(res);
            return next();
        }
        res.send({
            "code": "1",
            "msg": "user list",
            "data": docs
        })
    })
});
//find user by id
router.get('/user/:id', function (req, res, next) {
    Users.findOne({_id: req.params.id}, function (err, doc) {
        if (err) {
            DO_ERROR_RES(res);
            return next();
        }
        if (!!doc) {
            res.status(200);
            res.send({
                "code": "1",
                "msg": "user list",
                "data": doc
            })
        } else {
            res.status(200);
            res.send({
                "code": "2",
                "msg": "user non-exist"
            })
        }

    })
});
//edit user by id
router.put('/user', function (req, res, next) {
    Users.findOne({_id: req.body._id}, function (err, doc) {
        if (err) {
            DO_ERROR_RES(res);
            return next();
        }
        //如果没有数据,则增加
        if (!doc) {
            //发送
            res.status(200);
            res.send({
                "code": "2",
                "msg": "user not find!"
            });
        } else {
            ({
                full_name: doc.full_name,
                position: doc.position,
                address: doc.address,
                motto: doc.motto,
                personal_state: doc.personal_state,
                img_url: doc.img_url
            } = req.body);
            doc.save();
            res.status(200);
            res.send({
                "code": "1",
                "msg": "user update success!"
            });
        }
    });


});
//delete user by id
router.delete('/user/:id', function (req, res, next) {
    Users.findOne({_id: req.params.id}, function (err, doc) {
        if (err) {
            DO_ERROR_RES(res);
            return next();
        }
        if (!!doc) {
            doc.remove();
            res.status(200);
            res.send({
                "code": "1",
                "msg": `user ${req.params.id} delete success!`
            });
        } else {
            res.status(200);
            res.send({
                "code": "2",
                "msg": `delete failure, user not find!`
            });
        }

    });
});
//upload img
//之后还需要uuid找图片,图片压缩,裁剪的功能
router.post('/imgupload', multipartMiddleware, function (req, res, next) {
    if (req.files) {
        fs.readFile(req.files.file.path, function (err, data) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            let flag = req.files.file.originalFilename.lastIndexOf('.');
            let suffix = req.files.file.originalFilename.substr(flag);

            let newPath = "./public/uploads/" + Date.parse(new Date()) + suffix;
            let newPath2 = "./uploads/" + Date.parse(new Date()) + suffix;

            console.log('上传图片的存放位置:' + newPath);
            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    console.log("文件保存错误")
                    console.log(err)
                    res.end("writeFileerror");
                    return;
                }
                console.log("文件保存成功");

                //newPath2
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "image upload success!",
                    "data": newPath2
                });
            });
        });
    } else {
        //res.status(200);
        res.send(false);
    }
});


//栏目二 ->tags
//查找
router.get('/tags', TagsController.get);
//查找某个tag
router.get('/tag/:id', TagsController.getById);
//增加
router.post('/tag', TagsController.add);
//修改
router.put('/tag', TagsController.edit);
//delete
router.delete('/tag/:id', TagsController.delete);


//栏目三 ->article
//增加
router.post('/article', ArticleController.add);
//根据id修改
router.put('/article', ArticleController.editById);
//查找全部
router.get('/articles', ArticleController.getAll);
//根据id查找
router.get('/article/:id', ArticleController.getById);
//根据id删除
router.delete('/article/:id', ArticleController.deleteById);


//四 评论
//获取全部
router.get('/comments', function (req, res, next) {
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
});
//新增,当用户新增评论的时候,
//评论的文章的评论数++
//对评论进行评论的将前评论的next_id中新增自评论_id
router.post('/comment', function (req, res, next) {
    let {article_id, pre_id, next_id, name, email, time, content, ip, state} =  req.body;
    var comment = new Comments({
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
    let refreshArticle = new Promise(function (resolve, reject) {
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

    let refreshPreComment = new Promise(function(resolve, reject){
        Comments.findOne({_id:comment.pre_id},function (err, preComment) {
            if (err) {
                reject();
            }
            if(!!preComment && preComment.article_id === preComment.pre_id){
                //对根评论进行修改
                preComment.next_id.push(comment._id);
                //当前子评论关闭子子评论
                comment.next_id = [];
                preComment.save();
                resolve();
            }else{
                reject();
            }
        })
    });

    refreshArticle.then(function () {
        //保存评论
        comment.save();
        if(comment.article_id !== comment.pre_id){
            //对评论进行跟评
            refreshPreComment.then(function () {
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "comment create success, pre comment edit success!",
                    "data": comment
                });
            },function () {
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": "pre comment edit failure!"
                });
            })
        }else{
            res.status(200);
            res.send({
                "code": "1",
                "msg": "comment create success!",
                "data": comment
            });
        }
    },function () {
        res.status(200);
        res.send({
            "code": "2",
            "msg": "article non-exist, so comment create failure!"
        });
    });
});
//修改

//查询单个评论(将评论进行组装,还有子评论)

module.exports = router;


