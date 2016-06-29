/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //HistoryList控制器
        .controller('HistoryListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
            $http.get(API.getArticleHistoryWithStructure).success(function (response) {
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.historyLists = response.data;
                }
            }).error(function (erroInfo, status) {
            });
        }])
})();