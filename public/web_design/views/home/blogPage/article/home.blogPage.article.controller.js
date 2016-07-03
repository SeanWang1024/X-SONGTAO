/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
        //Detail控制器-catalogueName-type-id
        .controller('DetailController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
            var url = API.getArticleById.replace('id', $stateParams.id);
            $http.get(url).success(function (response) {
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.article = response.data;
                    //获取评论
                    var url =  API.getArticlesComments.replace('article_id', $scope.article._id);
                    $http.get(url).success(function (response) {
                        console.log('-----response------')
                        console.log(response)
                        if (parseInt(response.code) === 1) {
                            $scope.comment = response.data;
                        }
                    });
                }
            }).error(function (erroInfo, status) {
            });




            $scope.commentThisArt= function (artId) {
                $
                
                
                
                
            }
            function canComment() {
                
            }








        }])
})();