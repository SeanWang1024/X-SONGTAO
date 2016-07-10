/**
 * Created by xiangsongtao on 16/2/22.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
        .controller('articleListCtrl', ['AJAX', 'API', '$scope', '$log', function (AJAX, API, $scope, $log) {

            $scope.isLoaded = false;
            //获取文章列表
            AJAX({
                method: 'get',
                url: API.getArticleList,
                success: function (response) {
                    if (parseInt(response.code) === 1) {
                        $scope.articleLists = response.data;
                        $log.debug("文章列表获取成功!");
                    }
                },
                error:function () {
                    $log.error("文章列表获取失败!");
                },
                complete:function () {
                    $scope.isLoaded = true;
                }
            });

            let deleteArticle;
            $scope.delArtBtn = function (article) {
                deleteArticle = article;
            };
            $scope.confirmDelArtBtn = function () {
                AJAX({
                    method: 'delete',
                    url: API.deleteArt.replace('id', deleteArticle._id),
                    success: function (response) {
                        if (parseInt(response.code) === 1) {
                            //刷新文章列表
                            $scope.articleLists.splice($scope.articleLists.indexOf(deleteArticle),1);
                        }
                    }
                });
            }
        }]);
})();




