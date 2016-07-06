/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //Detail控制器-catalogueName-type-id
        .controller('DetailController', ['$scope', '$stateParams', 'AJAX', 'API', '$localStorage','$timeout', function ($scope, $stateParams, AJAX, API, $localStorage,$timeout) {

            //评论人的信息
            $scope.commentUsername;
            $scope.commentEmail;
            //对文章进行评论的input
            $scope.commentToArt;
            //对评论进行评论的input内容
            $scope.commentToComment;


            AJAX({
                method: 'get',
                url: API.getArticleById.replace('id', $stateParams.id),
                success: function (response) {
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.article = response.data;
                        getCommentList($scope.article._id);
                    }
                },
                error: function (err) {

                }
            });




            //点击回复按钮触发动作
            $scope.commentThisArtBtn = function (commentInfo) {

                console.log('commentInfo')
                console.log(commentInfo)
                //如果有论人的信息,则不显示输入框
                if (!!$scope.commentUsername && !!$scope.commentEmail) {
                    $scope.canComment = true;
                    $localStorage.commentAuth = {
                        commentUsername: $scope.commentUsername,
                        commentEmail: $scope.commentEmail,
                    }
                }

                if (!$scope.commentToArt) {
                    alert("评论内容不能为空")
                    return false;
                }

                let params = {
                    article_id: commentInfo._id,
                    pre_id: commentInfo._id,
                    next_id: [],
                    name: $scope.commentUsername,
                    email: $scope.commentEmail,
                    time: new Date(),
                    content: $scope.commentToArt,
                    state: true,
                    isIReplied:false
                };

                //send
                AJAX({
                    method: 'post',
                    url: API.newComment,
                    data: params,
                    success: function (response) {
                        console.log(response);
                        if (parseInt(response.code) === 1) {
                            console.log("评论成功@@@!!!!")
                            $scope.commentToArt = '';
                            $scope.commentToComment = '';
                            //    对评论的评论回复还需要隐藏评论框
                            $('.comments__reply').removeClass('active');

                            //刷新
                            getCommentList(commentInfo._id);
                        }
                    },
                    error: function (err) {

                    }
                });
            };

            $scope.$watch('commentToComment',function () {
                console.log($scope.commentToComment)
            })
            //对评论进行评论
            $scope.commentThisCommentBtn = function (commentInfo,content) {
                // $scope.$apply();

                console.log('commentInfo')
                console.log(commentInfo + "--" + content)
                //如果有论人的信息,则不显示输入框
                if (!!$scope.commentUsername && !!$scope.commentEmail) {
                    $scope.canComment = true;
                    $localStorage.commentAuth = {
                        commentUsername: $scope.commentUsername,
                        commentEmail: $scope.commentEmail,
                    }
                }

                if (!content) {
                    alert("评论内容不能为空")
                    return false;
                }

                let params = {
                    article_id: commentInfo.article_id,
                    pre_id: commentInfo._id,
                    next_id: [],
                    name: $scope.commentUsername,
                    email: $scope.commentEmail,
                    time: new Date(),
                    content: content,
                    state: true,
                    isIReplied:false
                };

                //send
                AJAX({
                    method: 'post',
                    url: API.newComment,
                    data: params,
                    success: function (response) {
                        console.log(response);
                        if (parseInt(response.code) === 1) {
                            console.log("评论成功@@@!!!!")
                            $scope.commentToComment = '';
                            //    对评论的评论回复还需要隐藏评论框
                            $('.comments__reply').removeClass('active');

                            //刷新
                            getCommentList(commentInfo.article_id);

                        }
                    },
                    error: function (err) {
                    }
                });
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



            function getCommentList(id) {
                //获取评论
                return AJAX({
                    method: 'get',
                    url: API.getArticlesComments.replace('article_id',id),
                    success: function (response) {
                        console.log('-----response------')
                        console.log(response)
                        if (parseInt(response.code) === 1) {
                            $scope.commentList = response.data;
                        }
                    }
                })
            }

        }])
})();