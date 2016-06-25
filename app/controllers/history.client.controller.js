/**
 * Created by xiangsongtao on 16/3/4.
 */
let mongoose = require('mongoose');

//MyInfo的数据模型
let Tags = mongoose.model('Tags');
let Article = mongoose.model('Articles');

module.exports = {
    getHistoryList: function (req, res, next) {
        let historyList = [];
        let dataEach = {
            yearAndMonth: '',
            articles: []
        };

        /*
         * 输入iso时间返回年月日格式
         *
         * */
        function SeparateISOTime(ISOTime) {
            let resultDate = {};
            resultDate.year = ISOTime.getFullYear();
            if (ISOTime.getMonth() + 1 < 10) {
                resultDate.month = "0" + (ISOTime.getMonth() + 1)
            }
            return resultDate;
        }

        //查找标签
        Article.find({catalogueName: req.params.catalogueName}, function (err, docs) {
            if (err) {
                res.end("error");
                return next();
            }
            let docsTpl = docs;
            let recordYear = '';
            let recordMonth = '';
            while (docsTpl.length) {
                //查找转移完毕,清空record
                recordYear = '';
                recordMonth = '';
                dataEach = {
                    yearAndMonth: '',
                    articles: []
                };
                //取出第一项
                let dataFirst = docsTpl.shift();
                //记录信息
                let dataFirstTpl = SeparateISOTime(dataFirst.time);
                recordYear = dataFirstTpl.year;
                recordMonth = dataFirstTpl.month;
                //创建盒子
                dataEach.yearAndMonth = recordYear + "-" + recordMonth;
                //取出来的第一个保存
                dataEach.articles.push(dataFirst);
                //查找剩余的
                for (let i = 0; docsTpl.length > i; i++) {
                    let docTplTime = SeparateISOTime(docsTpl[i].time);
                    let tplYear = docTplTime.year;
                    let tplMonth = docTplTime.month;
                    //如果找到同年同月的article,则取出来保存
                    if (recordYear == tplYear && recordMonth == tplMonth) {
                        //数据转移
                        dataEach.articles.push(docsTpl[i]);
                        //删除转移的数据
                        docsTpl.splice(i, 1);
                        //向前计数一位
                        i--;
                    }
                }
                //保存数据
                historyList.push(dataEach);
            }
            res.status(200);
            res.send(historyList);
        });

    }
}
;






