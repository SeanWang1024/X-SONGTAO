// /**
//  * Created by xiangsongtao on 16/7/9.
//  */
// (function () {
//     angular.module('xstApp')
//         .directive('noData', function () {
//             return {
//                 restrict:'E',
//                 replace:true,
//                 template:'<div class="nodata" ng-if="ndData.length"><img src="web/img/employee.svg" alt="当前没有数据诶"><p class="content">{{ndText}}</p></div>',
//                 scope:{
//                     ndData:'=',
//                     ndText:'@'
//                 },
//                 controller:function ($scope) {
//                     console.log($scope.ndData)
//                     console.log($scope.ndText)
//                 }
//             }
//         })
// })();