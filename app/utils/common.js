/**
 * Created by xiangsongtao on 16/3/4.
 */


//查找标签
var mongoose = require('mongoose');
var Tags = mongoose.model('Tags');
var TagData;
Tags.find({}, function (err, docs) {
    if (err) {
        return next(err);
    }
    TagData = docs;
});


module.exports = {
    //根据标签id查找标签名字
    findTagNameById: function (id) {
        //循环标签列表
        for (var i = 0; TagData.length > i; i++) {
            if (TagData[i]._id == id) {
                //找到的话返回名字,并且是激活状态
                if (TagData[i].state) {
                    return TagData[i].name;
                } else {
                    //否则返回false
                    return false;
                }
            }
        }
    }
}
