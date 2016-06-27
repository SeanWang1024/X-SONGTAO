// /**
//  * Created by xiangsongtao on 16/2/9.
//  */
// angular.module('xstApp')
// .filter("pageSelect",['$rootScope', function ($rootScope) {
//   return function (inputArray,pageNow) {
//     var array = [];
//     if(pageNow == null || pageNow == ''){
//       pageNow = 1;
//     }
//     //总共文章数
//     var totalArticlesNum = $rootScope.totalArticlesNum;
//     //每页的文章数
//     var onePageArticlesNum = $rootScope.onePageArticlesNum;
//     for(var i = (pageNow-1)*onePageArticlesNum;onePageArticlesNum*pageNow>i && totalArticlesNum>i;i++){
//       array.push(inputArray[i])
//     }
//     return array;
//   }
// }])
