/**
 * Created by xiangsongtao on 16/3/4.
 */
let mongoose = require('mongoose');
//数据模型
let Statistic = mongoose.model('Statistic');
//控制器
let StatisticController = require('../controllers/statistic.controller.js');
//数据库查询同一错误处理
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');


module.exports = {
    record: function record(ip, path) {
        let VisitInfo = new Statistic({ip, path});
        //保存
        VisitInfo.save(function (err) {
            console.log('访问信息记录成功')
        });
    },
    get: function get(req, res, next) {
        Statistic.find({}, function (err, docs) {
            res.status(200);
            res.send({
                "code": "1",
                "msg": "get all statistic success!",
                "data": docs
            });
        })
    },
    getDays: function get(req, res, next) {

        var timestamp = parseInt(req.params.timestamp);
        var time = (req.query.time);
        console.log(timestamp)
        console.log(time)


        Statistic.find({"time":{ "$gt":new Date('2016/09/28 17:56:00') , "$lt":new Date('2016/09/28 17:59:00') }}, function (err, docs) {
            res.status(200);
            res.send({
                "code": "1",
                "msg": "get all statistic success!",
                "data": docs
            });
        })
    },
    search: function search(req, res, next) {

    }
}
;






