/**
 * Created by xiangsongtao on 16/2/22.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
        .controller('articleCtrl', ['AJAX', 'API', '$scope', '$timeout', '$stateParams', 'marked', '$log', '$q', '$filter', '$rootScope', '$state', '$autoTextarea', function (AJAX, API, $scope, $timeout, $stateParams, marked, $log, $q, $filter, $rootScope, $state, $autoTextarea) {
            $scope.selection = [];

            //编辑框的句柄
            let $TextArea = document.getElementById('textarea');


            //判断文章是新增还是修改
            if (!$stateParams._id) {
                // console.log("新增文章")
            } else {
                getArticle($stateParams._id).then(function (response) {
                    if (parseInt(response.code) === 1) {
                        $scope.article = response.data;
                        //预先确定已选择的标签
                        $scope.selection = $scope.article.tags;
                        //记录原始编辑内容
                        //原始记录翻译一份到预览区
                        $scope.article.content_marked = marked($scope.article.content);
                        //时间
                        $scope.date = $filter('date')($scope.article.publish_time, 'yyyy/MM/dd HH:mm:ss');
                        //textarea尺寸计算
                        $timeout(function () {
                            resizeTextarea();
                        }, 0, false);
                    }
                });
            }


            //获取标签列表
            $scope.options = function () {
                return $q(function (resolve, reject) {
                    AJAX({
                        method: 'get',
                        url: API.getTagsList,
                        success: function (response) {
                            if (parseInt(response.code) === 1) {
                                resolve(response.data);
                                // console.log(response.data);
                            }
                        }
                    });
                });
            };


            /**
             * markdown相关
             * */
            $scope.$watch('article.content', function () {
                if (!!$scope.article) {
                    $scope.article.content_marked = marked($scope.article.content || '');
                    resizeTextarea();
                }
            });
            //窗口句柄
            let $outerBox = angular.element(document.getElementById('adminBox-content'));
            //显示预览
            $scope.isPreview = false;
            $scope.previewBtn = function () {
                $outerBox.toggleClass('preview');
                $scope.isPreview = !$scope.isPreview;
            };
            //页面销毁时,调整窗口比例
            $scope.$on("$destroy", function () {
                $outerBox.removeClass('preview');
            });


            /**
             * 保存相关
             * */
            //发布按钮
            $scope.isPublishing = false;
            $scope.publishBtn = function () {
                $scope.article.state = true;
                $scope.isPublishing = true;
                saveArticle(collectEditedArtInfo()).then(function (data) {
                    history.back();
                    $scope.isPublishing = false;
                }, function () {
                    $scope.isPublishing = false;
                })
            };
            //保存草稿
            $scope.isDrafting = false;
            $scope.draftBtn = function () {
                $scope.article.state = false;
                $scope.isDrafting = true;
                saveArticle(collectEditedArtInfo()).then(function (data) {
                    $scope.isDrafting = false;
                }, function () {
                    $scope.isDrafting = false;
                })
            }

            function saveArticle(data) {
                return $q(function (resolve, reject) {
                    AJAX({
                        method: 'post',
                        url: API.postArt,
                        data: data,
                        success: function (response) {
                            if (parseInt(response.code) === 1) {
                                resolve(response);
                            } else {
                                reject();
                            }
                        }
                    });
                })
            }


            //由文章id获取文章原始信息
            function getArticle(id) {
                let defer = $q.defer();
                AJAX({
                    method: 'get',
                    url: API.getRawArticleById.replace('id', id),
                    success: function (response) {
                        defer.resolve(response);
                    },
                    error: function (response) {
                        defer.reject(response);
                    }
                });
                return defer.promise;
            }

            //获取书写的文章信息
            function collectEditedArtInfo() {
                let tagsArr = [];
                for (let tag of $scope.selection) {
                    tagsArr.push(tag._id);
                }
                let params = {
                    "_id": $scope.article._id,
                    "title": $scope.article.title,
                    "publish_time": new Date($scope.date),
                    "tags": tagsArr,
                    "state": $scope.article.state,
                    "content": $scope.article.content,
                };
                return params;
            }

            function resizeTextarea() {
                $autoTextarea($TextArea, 10);
            }


        }]);
})();




