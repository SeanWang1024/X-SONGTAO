/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //TagList控制器
        .controller('TagListController', ['$scope', '$http', 'API', '$state', function ($scope, $http, API, $state) {
            $http.get(API.getTagsListWithStructure).success(function (response) {
                // console.log("TagListController response");
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.tagLists = response.data;
                }
            }).error(function (erroInfo, status) {
            });

        }])
        .controller('findArticlesByTagController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
            let url = API.getArticlesWithTagId.replace('id', $stateParams.id);
            $http.get(url).success(function (response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.articleLists = response.data;
                }
            }).error(function (erroInfo, status) {
            });
        }])
})();