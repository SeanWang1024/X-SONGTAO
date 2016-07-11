/**
 * Created by xiangsongtao on 16/2/22.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
        .controller('articleCtrl', ['AJAX', 'API', '$scope', '$timeout', '$stateParams', 'marked', '$log', '$q', '$filter', '$rootScope', '$state', function (AJAX, API, $scope, $timeout, $stateParams, marked, $log, $q, $filter, $rootScope, $state) {
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
                },function () {
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
                },function () {
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
                            }else{
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
                autoTextarea($TextArea, 10);
            }

            /**
             * 文本框根据输入内容自适应高度
             * @param                {HTMLElement}        输入框元素
             * @param                {Number}                设置光标与输入框保持的距离(默认0)
             * @param                {Number}                设置最大高度(可选)
             */
            function autoTextarea(elem, extra, maxHeight) {
                extra = extra || 0;
                var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                    isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                    addEvent = function (type, callback) {
                        elem.addEventListener ?
                            elem.addEventListener(type, callback, false) :
                            elem.attachEvent('on' + type, callback);
                    },
                    getStyle = elem.currentStyle ? function (name) {
                        var val = elem.currentStyle[name];

                        if (name === 'height' && val.search(/px/i) !== 1) {
                            var rect = elem.getBoundingClientRect();
                            return rect.bottom - rect.top -
                                parseFloat(getStyle('paddingTop')) -
                                parseFloat(getStyle('paddingBottom')) + 'px';
                        }
                        return val;
                    } : function (name) {
                        return getComputedStyle(elem, null)[name];
                    },
                    minHeight = parseFloat(getStyle('height'));

                elem.style.resize = 'none';

                function change() {
                    var scrollTop, height,
                        padding = 0,
                        style = elem.style;
                    if (elem._length === elem.value.length) return;
                    elem._length = elem.value.length;

                    if (!isFirefox && !isOpera) {
                        padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                    }
                    ;
                    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    elem.style.height = minHeight + 'px';
                    if (elem.scrollHeight > minHeight) {
                        if (maxHeight && elem.scrollHeight > maxHeight) {
                            height = maxHeight - padding;
                            style.overflowY = 'auto';
                        } else {
                            height = elem.scrollHeight - padding;
                            style.overflowY = 'hidden';
                        }
                        ;
                        style.height = height + extra + 'px';
                        scrollTop += parseInt(style.height) - elem.currHeight;
                        document.body.scrollTop = scrollTop;
                        document.documentElement.scrollTop = scrollTop;
                        elem.currHeight = parseInt(style.height);
                    }
                    ;
                };

                addEvent('propertychange', change);
                addEvent('input', change);
                addEvent('focus', change);
                change();
            };

        }]);
})();




