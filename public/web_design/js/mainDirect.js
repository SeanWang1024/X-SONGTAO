/**
 * Created by xiangsongtao on 16/2/27.
 */
(function () {
    angular.module('xstApp')
    //数据在页面中写入完毕后,执行repeatDone内的方法函数->repeat-done="inlineTableEdit()"
        .directive('repeatDone', function() {
            return {
                link: function(scope, element, attrs) {
                    if (scope.$last) {                   // 这个判断意味着最后一个 OK
                        scope.$eval(attrs.repeatDone)    // 执行绑定的表达式
                    }
                }
            }
        })
})();