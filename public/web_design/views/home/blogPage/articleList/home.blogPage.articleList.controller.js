/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //ArticleList控制器
        .controller('ArticleListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
            let url = API.newUpdateArticle.replace("from", API.ArticleFrom).replace("to", API.ArticleTo);
            $http.get(url).success(function (response) {
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.articleLists = response.data;
                }
            }).error(function (erroInfo, status) {
                // $(".blackShade.error").addClass("show");
                // $(".blackShade.error h3").text("哎呦,好像出错了!");
                // $(".blackShade.error span").html(erroInfo);
                // $(".blackShade.error small").text("状态码:" + status);
            });

        }])
})();