/**
 * Created by xiangsongtao on 16/3/3.
 */
let mongoose = require('mongoose');
let $base64 = require('../utils/base64.module.js');
let fs = require('fs');
//MyInfo的数据模型
let Users = mongoose.model('Users');
//数据库查询同一错误处理
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');

module.exports = {
    register: function (req, res, next) {
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
    },
    login: function (req, res, next) {
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
    },
    getAll: function (req, res, next) {
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
    },
    getById: function (req, res, next) {
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
    },
    edit:function (req, res, next) {
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


    },
    delete:function (req, res, next) {
        Users.remove({_id: req.params.id}, function (err) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            res.status(200);
            res.send({
                "code": "1",
                "msg": `user ${req.params.id} delete success!`
            });
        });
    }
};






