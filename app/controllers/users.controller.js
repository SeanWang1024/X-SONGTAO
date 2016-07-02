/**
 * Created by xiangsongtao on 16/3/3.
 */
let mongoose = require('mongoose');
let $base64 = require('../utils/base64.utils.js');
let fs = require('fs');
//MyInfo的数据模型
let Users = mongoose.model('Users');
//数据库查询同一错误处理
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');
let marked = require('marked');
module.exports = {
    register: function (req, res, next) {
        let user_ip = req.ip.split(":")[3];
        Users.findOne({username: req.body.username}, function (err, user) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //如果没有数据,则增加
            if (!user) {
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
        let user_ip = req.headers.host;
        console.log("------用户当前请求的ip------");
        console.log(user_ip);
        Users.findOne({username: username}, function (err, user) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //有用户数据且密码正确
            if (!!user && (user.password === password)) {
                user.login_info.push({
                    login_time: new Date().getTime(),
                    login_ip: user_ip
                });
                user.save();
                res.status(200);
                // res.cookie('rememberme', '1', { maxAge: 900000})
                res.send({
                    "code": "1",
                    "msg": "login success! please use token to access!",
                    "token": $base64.encode(`${username}|${password}|${new Date().getTime()}`),
                    "data": user
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
    changePassword: function (req, res, next) {
        let {_id, username, password, new_password} = req.body;

        Users.findOne({_id: _id}, function (err, user) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //有用户数据且密码正确
            if (!!user) {
                if (user.password === password) {
                    user.username = username;
                    user.password = new_password;
                    user.save();
                    res.status(200);
                    res.send({
                        "code": "1",
                        "msg": "user password change success, you should re-login!",
                        "data": user
                    });
                    // res.redirect('/#/login');
                } else {
                    res.status(200);
                    res.send({
                        "code": "2",
                        "msg": "user password not right!"
                    });
                }

            } else {
                res.status(200);
                res.send({
                    "code": "3",
                    "msg": "user non-exist, please check out!"
                });
            }
        });
    },
    getAll: function (req, res, next) {
        Users.find({}, function (err, users) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            res.send({
                "code": "1",
                "msg": "user list",
                "data": users
            })
        })
    },
    //用于home显示
    getById: function (req, res, next) {
        Users.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //将我的介绍由markdown转化为html输出
            // marked
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
            });
            user.personal_state = marked(user.personal_state);

            if (!!user) {
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "user list",
                    "data": user
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
    //原始的个人信息,可以二次修改
    getByIdWithOriginal: function (req, res, next) {
        Users.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }

            if (!!user) {
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "user list",
                    "data": user
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
    edit: function (req, res, next) {
        Users.findOne({_id: req.body._id}, function (err, user) {
            if (err) {
                DO_ERROR_RES(res);
                return next();
            }
            //如果没有数据,则增加
            if (!user) {
                //发送
                res.status(200);
                res.send({
                    "code": "2",
                    "msg": "user not find!"
                });
            } else {
                ({
                    full_name: user.full_name,
                    position: user.position,
                    address: user.address,
                    motto: user.motto,
                    personal_state: user.personal_state,
                    img_url: user.img_url
                } = req.body);
                user.save();
                res.status(200);
                res.send({
                    "code": "1",
                    "msg": "user update success!"
                });
            }
        });


    },
    delete: function (req, res, next) {
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






