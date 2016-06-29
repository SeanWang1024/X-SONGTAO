/**
 * Created by xiangsongtao on 16/2/9.
 */
(function () {
    angular.module('xstApp')
        .filter("toTrusted", ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }])
})();
