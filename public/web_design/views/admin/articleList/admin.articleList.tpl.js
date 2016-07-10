/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
    .controller('articleListCtrl', ['AJAX', 'API', '$scope', '$log', '$rootScope', '$state', function (AJAX, API, $scope, $log, $rootScope, $state) {
        if (!$rootScope.isLogin) {
            $state.go('home');
            return;
        }
        getArticles();
        function getArticles() {
            $scope.isLoaded = false;
            return AJAX({
                method: 'get',
                url: API.getArticleList,
                success: function (response) {
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.articleLists = response.data;
                        // console.log($scope.articleLists);
                    }
                },
                complete:function () {
                    $scope.isLoaded = true;
                }
            });
        }


        let deleteArticleId;
        $scope.delArtBtn = function (_id) {
            deleteArticleId = _id;
        }
        $scope.confirmDelArtBtn = function () {
            AJAX({
                method: 'delete',
                url: API.deleteArt.replace('id', deleteArticleId),
                success: function (response) {
                    // console.log('response');
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        // $scope.commentList = response.data;
                        // console.log(response.data);
                        //刷新文章列表
                        getArticles();
                    }
                }
            });
        }
    }]);




