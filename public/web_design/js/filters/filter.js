/**
 * Created by xiangsongtao on 16/6/26.
 */
(function () {
    angular.module('xstApp')
        .factory("timestampToDate", function () {
            return function (timestamp) {
                let timestampInt = parseInt(timestamp);
                if (timestampInt.toString().length === 13) {
                    //正确的时间戳
                    return new Date(timestampInt);
                } else {
                    //错误的时间戳返回现在时间
                    return new Date();
                }
            }
        })
        .filter("toEnMonth", ['timestampToDate', function (timestampToDate) {
            return function (value) {
                // var date = timestampToDate(value);
                // let month = parseInt(value);
                switch (parseInt(value)) {
                    case 1:
                        return "Jan";
                        break;
                    case 2:
                        return "Feb";
                        break;
                    case 3:
                        return "Mar";
                        break;
                    case 4:
                        return "Apr";
                        break;
                    case 5:
                        return "May";
                        break;
                    case 6:
                        return "Jun";
                        break;
                    case 7:
                        return "Jul";
                        break;
                    case 8:
                        return "Aug";
                        break;
                    case 9:
                        return "Sept";
                        break;
                    case 10:
                        return "Oct";
                        break;
                    case 11:
                        return "Nov";
                        break;
                    case 12:
                        return "Dec";
                        break;

                }
            }
        }])
})();