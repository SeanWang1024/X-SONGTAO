/**
 * Created by xiangsongtao on 16/3/4.
 */
let mongoose = require('mongoose');
let config = require('../config/config.js');
//数据模型
let Statistic = mongoose.model('Statistic');
//控制器
let StatisticController = require('../controllers/statistic.controller.js');
//数据库查询同一错误处理
let DO_ERROR_RES = require('../utils/DO_ERROE_RES.js');
let superagent = require('superagent');
let moment = require('moment');

module.exports = {
	record: function record(ip, path, time) {
		let VisitInfo = new Statistic({ip, path, time});
		//保存
		VisitInfo.save(function (err) {
			console.log('访问信息记录成功')
		});
	},
	get: function get(req, res, next) {
		Statistic.find({'path': '/'}, function (err, docs) {
			res.status(200);
			res.send({
				"code": "1",
				"msg": "get all statistic success!",
				"data": docs
			});
		})
	},
	deleteAll: function deleteAll(req, res, next) {
		Statistic.remove({}, function (err, docs) {
			res.send({
				"code": "1",
				"msg": "delete all statistic success!"
			});
		})
	},
	getDays: function getDays(req, res, next) {
		var timestamp = parseInt(req.params.timestamp);
		var time = (req.query.time);
		console.log(timestamp)
		console.log(time)

		Statistic.find({
			"time": {
				"$gt": new Date('2016/09/28 17:56:00'),
				"$lt": new Date('2016/09/28 17:59:00')
			}
		}, function (err, docs) {
			res.status(200);
			res.send({
				"code": "1",
				"msg": "get all statistic success!",
				"data": docs
			});
		})
	},
	total: function search(req, res, next) {
		let _count = 0;
		let _result = [];
		for (let i = 0; 3 > i; i++) {
			let _start;
			let _end;
			switch (i) {
				case 0:
					_start = moment().startOf('day').format();
					_end = moment().endOf('day').format();
					break;
				case 1:
					_start = moment().startOf('month').format();
					_end = moment().endOf('month').format();
					break;
				case 2:
					_start = moment().startOf('year').format();
					_end = moment().endOf('year').format();
					break;
			}
			Statistic.count({
				'path': '/',
				"time": {
					"$gt": _start,
					"$lt": _end
				}
			}, function (err, count) {
				_result.push(count);
				_count++;
				_launch();
			})
		}

		function _launch() {
			if(_count === 3){
				res.status(200);
				res.send({
					"code": "1",
					"msg": "get chart data success!",
					"data": _result,
				});
			}
		}
	},
	/**
	 * map 数据
	 * */
	map: function map(req, res, next) {
		const _ak = config.baiduAK || 'yFKaMEQnAYc1hA0AKaNyHGd4HTQgTNvO';
		let result = [];
		let obj = {};
		let count = 0;
		let _dayStart = moment().startOf('day').format();
		let _dayEnd = moment().endOf('day').format();
		Statistic.find({
			'path': '/',
			"time": {
				"$gt": _dayStart,
				"$lt": _dayEnd
			}
		}, function (err, docs) {
			docs.forEach(function (doc) {
				superagent.get(`http://api.map.baidu.com/location/ip`)
					.query({output: 'json'})
					.query({ak: _ak})
					.query({ip: doc.ip})
					.query({coor: 'bd09ll'})
					.end(function (err, data) {
						var textObj = JSON.parse(data.text);
						let _city = textObj.content.address_detail.city;
						if (!!obj[_city]) {
							obj[_city][2]++;
						} else {
							obj[_city] = [textObj.content.point.x, textObj.content.point.y, 1]
						}
						count++;
						_launch();
					})
			});
			// 判断是否发送数据
			function _launch() {
				if (count === docs.length) {
					for (let a in obj) {
						result.push({
							name: a,
							value: [obj[a][0], obj[a][1], obj[a][2]]
						});
					}
					res.status(200);
					res.send({
						"code": "1",
						"msg": "get statistic map data success!",
						"data": result
					});
				}
			}
		})
	},
	/**
	 * chart 数据
	 * */
	chart: function chart(req, res, next) {
		let _dayStart = moment().hour(0).minute(0).second(0).millisecond(0).format();
		let _dayEnd = moment().hour(23).minute(59).second(59).millisecond(59).format();
		Statistic.find({
			'path': '/',
			"time": {
				"$gt": _dayStart,
				"$lt": _dayEnd
			}
		}, function (err, docs) {
			// 以小时为单位
			let _end = new Date().getHours() + 1;

			// 发送数据结构体
			let obj = {
				x: [],
				y: [],
			};

			// 生成原始数据
			for (let i = 0; _end > i; i++) {
				obj.x.push(i > 10 ? `${i}:00` : `0${i}:00`);
				obj.y.push(0)
			}
			// 数据库数据统计
			docs.forEach(function (doc) {
				obj.y[moment(doc.time).hour()]++
			});
			res.status(200);
			res.send({
				"code": "1",
				"msg": "get chart data success!",
				"data": obj
			});
		})
	},
}
;






