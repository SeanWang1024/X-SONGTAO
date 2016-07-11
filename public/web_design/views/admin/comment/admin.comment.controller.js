/**
 * Created by xiangsongtao on 16/2/22.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
        .controller('commentCtrl', ['AJAX', 'API', '$scope', '$log', '$q', function (AJAX, API, $scope, $log, $q) {
            /*
             * 写入页面信息
             */
            getComments();
            function getComments() {
                $scope.isLoaded = false;
                return AJAX({
                    method: 'get',
                    url: API.getCommentToArticleList,
                    success: function (response) {
                        // console.log(response)
                        if (parseInt(response.code) === 1) {
                            $scope.commentList = response.data;
                        }
                    },
                    complete: function () {
                        $scope.isLoaded = true;
                    }
                });
            }


            //进行评论
            // $scope.isSubmitReply = false;
            //评论的内容
            $scope.comment_info = {
                content: ''
            };
            $scope.comment = function (item) {
                $scope.replyBox = item;
            }
            $scope.confirmAddComment = function (item) {
                // $scope.isSubmitReply = true;

                //进行评论的逻辑处理,我对此的评论
                // console.log('评论内容:');
                // console.log($scope.comment_info.content);
                let params = {
                    article_id: item.article_id._id,
                    pre_id: item._id,
                    next_id: [],
                    name: API.MY,
                    email: API.EMAIL,
                    time: new Date(),
                    content: $scope.comment_info.content,
                    //这里是增加对主评论的子评论,
                    // 既然是我的评论那我没有道理继续评论的理由,
                    // 故对自评论显示我已评论,我的评论,审核状态为true
                    // 但是主评论需要手动设置
                    isIReplied: true,
                    state: true
                };
                //将主评论设为我已评论
                changeCommentReplyState(item._id).then(function () {
                    AJAX({
                        method: 'post',
                        url: API.postComment,
                        data: params,
                        success: function (response) {
                            if (parseInt(response.code) === 1) {
                                $log.debug("回复成功: " + response);
                                //刷新文章列表
                                getComments();
                            }
                        },
                        error: function (response) {
                            $log.debug("回复失败: " + response);
                        }
                    });
                }).finally(function () {
                    $scope.comment_info.content = "";
                })
            }

            //    删除评论
            let delComm;
            $scope.delbtn = function (item) {
                delComm = item;
            };
            $scope.confirmDelCommBtn = function () {
                AJAX({
                    method: 'delete',
                    url: API.delComment.replace('id', delComm._id),
                    success: function (response) {
                        // console.log(response )
                        if (parseInt(response.code) === 1) {
                            //刷新文章列表
                            $scope.commentList.splice($scope.commentList.indexOf(delComm), 1);
                            // getComments();
                        }
                    }
                });


            };

            //改变此评论的审核状态true/false
            // function changeAuthState
            $scope.changeAuthState = function (_id) {
                // console.log(_id)
                let defer = $q.defer();
                AJAX({
                    method: 'post',
                    url: API.changeAuthState,
                    data: {
                        _id: _id
                    },
                    success: function (response) {
                        if (parseInt(response.code) === 1) {
                            //刷新文章列表
                            $log.debug("状态改变成功")
                            defer.resolve()
                        } else {
                            defer.reject();
                        }
                    }
                });
                return defer.promise;
            };

            //子主评论筛选
            $scope.Condition_1;
            $scope.ConditionFilter_1 = function (data) {
                if (!$scope.Condition_1) {
                    return true;
                }
                switch (parseInt($scope.Condition_1)) {
                    case 0:
                        return true;
                        break;
                    //主评论
                    case 1:
                        return !!data.article_id ? data.article_id._id.toString() === data.pre_id.toString() : false;
                        break;
                    //子评论
                    case 2:
                        return !!data.article_id ? data.article_id._id.toString() !== data.pre_id.toString() : true;
                        break;
                    default:
                        return true
                        break;
                }
            }

            //回复筛选
            $scope.Condition_2;
            $scope.ConditionFilter_2 = function (data) {
                if (!$scope.Condition_2) {
                    return true;
                }
                switch (parseInt($scope.Condition_2)) {
                    case 0:
                        return true;
                        break;
                    //未回复
                    case 1:
                        return !data.isIReplied;
                        break;
                    //已回复
                    case 2:
                        return !!data.isIReplied;
                        break;
                    //主评论+未回复
                    // case 3:
                    //     return !data.isIReplied && data.article_id._id.toString() === data.pre_id.toString();
                    //     break;
                    // //主评论+未审核
                    // case 4:
                    //     return !data.state && data.article_id._id.toString() === data.pre_id.toString();
                    //     break;
                    // //主回复
                    // case 5:
                    //     return !data.isIReplied;
                    //     break;
                    // //未审核
                    // case 6:
                    //     return !data.state;
                    //     break;
                    default:
                        return true
                        break;
                }
            }


            //审核筛选
            $scope.Condition_3;
            $scope.ConditionFilter_3 = function (data) {
                if (!$scope.Condition_3) {
                    return true;
                }
                switch (parseInt($scope.Condition_3)) {
                    case 0:
                        return true;
                        break;
                    //未审核
                    case 1:
                        return !data.state;
                        break;
                    //已审核
                    case 2:
                        return !!data.state;
                        break;
                    default:
                        return true
                        break;
                }
            }


            //如果对用户的文章评论进行了评论,则标记此评论为已阅读
            //此接口只对我有效
            function changeCommentReplyState(_id) {
                let defer = $q.defer();
                let params = {
                    _id: _id
                };
                AJAX({
                    method: 'post',
                    url: API.changeCommentReplyState,
                    data: params,
                    success: function (response) {
                        if (parseInt(response.code) === 1) {

                            defer.resolve();
                        } else {
                            defer.reject();
                        }
                    }
                });
                return defer.promise;
            }
        }]);
})();




