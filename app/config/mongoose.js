/**
 * 数据库配置及模型建立
 * */
var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function () {
    var db = mongoose.connect(config.mongodb);

    /**
     * id由数据库自己生成,名字为_id
     * */
    //我的个人信息数据模型
    mongoose.model('Users', new mongoose.Schema({
        username: String,//名字
        password: String,//职位
        login_info: [
            {
                login_time: Number,//地址
                login_ip: String,//登录IP地址
            }
        ],
        full_name: String,//名字
        position: String,//职位
        address: String,//地址
        motto: String,//座右铭
        personal_state: String,//我的称述
        img_url: String//头像imgurl
    }));


    //标签数据模型
    mongoose.model('Tags', new mongoose.Schema({
        name: String,//标签名称 eg: css html
        catalogue_name: String,//分类名称 eg: FrontEnd
        used_num: Number,//文章引用数
        create_time: Number//创建时间 时间戳
    }));


    //文章数据模型
    mongoose.model('Articles', new mongoose.Schema({
        title: String,                          //文章标题
        publish_time: Number,                   //文章发表时间
        author: String,//作者
        read_num: Number,                        //阅读数
        comment_num: Number,                     //评论数,当评论新增的时候进行++操作
        // comment_id: String,                     //评论的id,当文章创建时,创建一个comment
        tags: Array,                            //标签,包含标签的id array
        state: Boolean,                         //是否公开 0 草稿(不公开) 1 完成(公开)
        content: String                         //内容 HTML
    }));



    //评论数据模型
    mongoose.model('Comments', new mongoose.Schema({
        //自动维护
        article_id:String,//记录此评论所属的文章id
        pre_id:String,//钩子的id。即,上一条父记录id,如果没有则为根id->article_id(必须)
        next_id:Array,//沟槽id,即,下一条记录的id,一般是子评论的id。
        // groove_id:String,//下部沟槽id
        name: String,//评论人姓名、昵称
        email: String,//评论人邮箱
        time: Number,//评论时间,时间戳
        content: String,//评论内容
        ip: String,//对方ip
        state:Boolean,//是否审核通过 0, 未审核通过 1 审核通过
    }));


    //我的个人信息数据模型
    // mongoose.model('MyInfo', new mongoose.Schema({
    //     name: String,//名字
    //     position: String,//职位
    //     address: String,//地址
    //     motto: String,//座右铭
    //     personal_state: String,//我的称述
    //     img_url: String//头像imgurl
    // }));

    return db;
};