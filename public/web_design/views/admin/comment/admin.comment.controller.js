/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
    .controller('commentCtrl', ['AJAX', 'API', '$scope', '$log', '$timeout', '$rootScope', '$state', function (AJAX, API, $scope, $log, $timeout, $rootScope, $state) {

        if (!$rootScope.isLogin) {
            $state.go('home');
            return;
        }
        /*
         * 写入页面信息
         */
        getComments();
        function getComments() {
            return AJAX({
                method: 'get',
                url: API.getCommentToArticleList,
                success: function (response) {
                    // console.log('response');
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.commentList = response.data;
                        // console.log($scope.commentList);
                    }
                }
            });
        }


        //进行评论
        $scope.isSubmitReply = false;
        //评论的内容
        $scope.comment_info = {
            content: '',
        };
        $scope.comment = function (item, $event) {
            let target = $($event.currentTarget).parents('.comments__ask');
            target.siblings().removeClass('isReply');
            target.toggleClass('isReply');
        }
        $scope.commentThis = function ($event, item) {
            $scope.isSubmitReply = true;

            //进行评论的逻辑处理,我对此的评论
            // console.log($scope.comment_info.content)
            let params = {
                article_id: item.article_id._id,
                pre_id: item._id,
                next_id: [],
                name: "我",
                email: "280304286@163.com",
                time: new Date(),
                content: $scope.comment_info.content,
                isIReplied: true,
                state: true
            }
            // console.log(params)
            AJAX({
                method: 'post',
                url: API.postComment,
                data: params,
                success: function (response) {
                    // console.log('response');
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        // $scope.commentList = response.data;
                        // console.log(response.data);
                        changeCommentReplyState(item._id);
                    }
                }
            });

            $timeout(function () {
                $scope.isSubmitReply = false;
                $($event.currentTarget).parents('.comments__ask').toggleClass('isReply')
            }, 1000, true)
        }

        //    删除评论
        let delCommId;
        $scope.delbtn = function (id) {
            delCommId = id;

        };
        $scope.confirmDelCommBtn = function () {
            // console.log('delete:' + delCommId);
            AJAX({
                method: 'delete',
                url: API.delComment.replace('id', delCommId),
                success: function (response) {
                    // console.log('response');
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        // $scope.commentList = response.data;
                        // console.log(response.data);
                        //刷新文章列表
                        getComments();
                    }
                }
            });


        }


        //如果对用户的文章评论进行了评论,则标记此评论为已阅读
        function changeCommentReplyState(_id) {
            let params = {
                _id: _id,
                isIReplied: true,
            }
            return AJAX({
                method: 'post',
                url: API.changeCommentReplyState,
                data: params,
                success: function (response) {
                    // console.log('response');
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        // $scope.commentList = response.data;
                        // console.log(response.data);
                        //刷新文章列表
                        getComments();
                    }
                }
            });

        }


    }]);




