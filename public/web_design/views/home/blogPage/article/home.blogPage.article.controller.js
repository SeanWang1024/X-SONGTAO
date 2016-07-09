/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //Detail控制器-catalogueName-type-id
        .controller('DetailController', ['$scope', '$stateParams', 'AJAX', 'API', '$localStorage', '$timeout', function ($scope, $stateParams, AJAX, API, $localStorage, $timeout) {

            $scope.chain = {
                selectId: 'selectId',
                main_state: 'default',//default,going,success,error
                sub_state: 'default',//default,going,success,error
            };

            function changeState(isArt, state) {
                if (isArt) {
                    $scope.chain.main_state = state;
                } else {
                    $scope.chain.sub_state = state;
                }
            }

            //评论人的信息
            $scope.commentInfo = {
                username: '',
                email: ''
            };
            $scope.canComment = false;

            //获取文章
            AJAX({
                method: 'get',
                url: API.getArticleById.replace('id', $stateParams.id),
                success: function (response) {
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.article = response.data;
                        getCommentList($scope.article._id);
                    }
                },
                error: function (err) {

                }
            });


            //记录回复时间,间隔1min后才能回复。
            let commentTime;
            //点击回复按钮触发动作
            $scope.commentBtn = function (info, commentContent) {
                changeState(!info.article_id, 'going');

                // if (!!commentTime && new Date().getTime() - commentTime < 1000 * 60) {
                //     alert("您评论过于平凡,请1min后再评论!")
                //     return false;
                // }
                // commentTime = new Date().getTime();


                //如果有论人的信息,则不显示输入框
                if (!!$scope.commentInfo.username && !!$scope.commentInfo.email) {
                    $scope.canComment = true;
                    $localStorage.commentAuth = {
                        commentUsername: $scope.commentInfo.username,
                        commentEmail: $scope.commentInfo.email
                    }
                } else {
                    changeState(!info.article_id, 'error');
                    return false;
                }

                let article_id;
                if (!info.article_id) {
                    article_id = info._id;
                    // console.log("这个是对文章的评论!")
                } else {
                    article_id = info.article_id;
                    // console.log("这个是对评论的回复")
                }

                let params = {
                    article_id: article_id,
                    pre_id: info._id,
                    next_id: [],
                    name: $scope.commentInfo.username,
                    email: $scope.commentInfo.email,
                    time: new Date(),
                    content: commentContent,
                    state: false,
                    isIReplied: false
                };

                //send
                AJAX({
                    method: 'post',
                    url: API.newComment,
                    data: params,
                    success: function (response) {
                        // console.log(response);
                        if (parseInt(response.code) === 1) {
                            // console.log("评论成功@@@!!!!")

                            changeState(!info.article_id, 'success');

                            //对评论数++
                            $scope.article.comment_num++;

                            //刷新
                            getCommentList(article_id);
                            if (info.article_id) {
                                // 对评论的评论回复还需要隐藏评论框
                                $timeout(function () {
                                    $scope.chain.selectId = '';
                                }, 1000, true);
                            }

                        } else {
                            changeState(!info.article_id, 'error');
                        }
                    },
                    error: function (err) {
                        changeState(!info.article_id, 'error');
                    },
                    complete: function () {
                        $timeout(function () {
                            changeState(!info.article_id, 'default');
                        }, 1000, true);
                    }
                });
            };


            //自评论点击回复按钮
            $scope.commentToComemntBtn = function ($event) {
                let $this = $($event.currentTarget).parents('.comments__ask').next('.comments__reply');
                $('.comments__reply').not($this).removeClass('active');
                $this.toggleClass('active');
            };

            //首次进入判断是否能评论
            $scope.canComment = canComment();
            function canComment() {
                if (!!$localStorage.commentAuth) {
                    if ($scope.commentUsername && $scope.commentEmail) {
                        return true
                    } else {
                        $scope.commentInfo.username = $localStorage.commentAuth.commentUsername;
                        $scope.commentInfo.email = $localStorage.commentAuth.commentEmail;
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
                    url: API.getArticlesComments.replace('article_id', id),
                    success: function (response) {
                        // console.log('-----response------')
                        // console.log(response)
                        if (parseInt(response.code) === 1) {
                            $scope.commentList = response.data;
                        }
                    }
                })
            }

        }])
})();