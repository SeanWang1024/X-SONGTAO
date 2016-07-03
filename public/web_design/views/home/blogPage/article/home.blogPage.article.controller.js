/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //Detail控制器-catalogueName-type-id
        .controller('DetailController', ['$scope', '$stateParams', '$http', 'API', '$localStorage', '$timeout', function ($scope, $stateParams, $http, API, $localStorage, $timeout) {

            //评论人的信息
            $scope.commentUsername;
            $scope.commentEmail;
            //对文章进行评论的input
            $scope.commentToArt;
            //对评论进行评论的input内容
            $scope.commentToComment;


            var url = API.getArticleById.replace('id', $stateParams.id);
            $http.get(url).success(function (response) {
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.article = response.data;
                    //获取评论
                    var url = API.getArticlesComments.replace('article_id', $scope.article._id);
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


            //点击回复按钮触发动作
            $scope.commentThisArtBtn = function (commentInfo) {

                commentInfo = {
                    "_id": "57739bccdc24e834188f2eef",
                    "article_id": "576ec5284165e58703cf7246",
                    "pre_id": "576ec5284165e58703cf7246",
                    "name": "22222222",
                    "email": "12@123.com",
                    "time": "2009-01-17T19:57:02.222Z",
                    "content": "576e5920e093fcd80d2af658-增加主评论1",
                    "ip": "12.123.123.123",
                    "state": false,
                    "__v": 0,
                    "next_id": []
                }
                //如果有论人的信息,则不显示输入框
                if (!!$scope.commentUsername && !!$scope.commentEmail) {
                    $scope.canComment = true;
                    $localStorage.commentAuth = {
                        commentUsername: $scope.commentUsername,
                        commentEmail: $scope.commentEmail,
                    }
                }
                let content = (commentInfo.article_id.toString() === commentInfo.pre_id.toString()) ? $scope.commentToArt : $scope.commentToComment;
                if (!content) {
                    return false;
                }

                let params = {
                    article_id: commentInfo.article_id,
                    pre_id: commentInfo.pre_id,
                    next_id: [],
                    name: $scope.commentUsername,
                    email: $scope.commentEmail,
                    time: new Date(),
                    content: content,
                    state: true
                };


                console.log('评论内容:');
                console.log(params);

                //send
                $timeout(function () {
                    $scope.commentToArt = '';
                    $scope.commentToComment = '';
                //    对评论的评论回复还需要隐藏评论框
                    $('.comments__reply').removeClass('active');
                }, 2000, true)


            }

            //自评论点击回复按钮
            $scope.commentToComemntBtn = function ($event) {
                let $this = $($event.currentTarget).parents('.comments__ask').next('.comments__reply');
                $('.comments__reply').not($this).removeClass('active');
                $this.toggleClass('active');
            };

            //判断是否能评论
            $scope.canComment = canComment();
            function canComment() {
                if (!!$localStorage.commentAuth) {
                    if ($scope.commentUsername && $scope.commentEmail) {
                        return true
                    } else {
                        $scope.commentUsername = $localStorage.commentAuth.commentUsername;
                        $scope.commentEmail = $localStorage.commentAuth.commentEmail;
                        return true
                    }
                } else {
                    return false;
                }
            }


        }])
})();