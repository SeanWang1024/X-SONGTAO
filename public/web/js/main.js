'use strict';

(function () {
    angular.module('xstApp', ['ui.router', 'ngStorage', 'hc.marked', 'btorfs.multiselect', 'angularMoment', 'ng-bs3-datepicker'])
    /**
     * 配置文件
     * */
    .run(function (amMoment) {
        amMoment.changeLocale('Zh-cn');
    }).factory('API', function () {
        var url = "http://localhost:8088";
        var MY_INFO_ID = '576b95155fce2dfd3874e738';
        var MY = '我';
        var EMAIL = '280304286@163.com';
        return {
            /**
             * 用户、登录相关
             * */
            MY_INFO_ID: MY_INFO_ID,
            MY: MY,
            EMAIL: EMAIL,
            //登录
            login: url + '/api/login',
            //获取我的信息
            getMyInfo: url + '/api/user/' + MY_INFO_ID,
            getMyInfoWithOriginal: url + '/api/user/original/' + MY_INFO_ID,
            postMyInfo: url + '/api/user',
            changePassword: url + '/api/change_password',
            imgUpload: url + '/api/imgupload',
            imgResource: url + '/uploads/',

            /**
             * 文章相关
             * */
            //获取最新的十条文章
            ArticleFrom: "0",
            ArticleTo: "10",
            newUpdateArticle: url + '/api/articles/from_to',
            //由文章id获取文章详情
            getArticleById: url + '/api/article/id',
            //获取文章历史记录
            getArticleHistoryWithStructure: url + '/api/article_history',

            //获取文章列表
            getArticleList: url + '/api/articles',

            //由文章id获取文章详情(原始markdown版本)
            getRawArticleById: url + '/api/article/raw/id',

            //新增(如果传入的_id不存在的电话)-修改文章,
            postArt: url + '/api/article',

            //delete 文章
            deleteArt: url + '/api/article/id',

            /**
             * 标签相关
             * */
            //获取标签列表(带有结构的)
            getTagsListWithStructure: url + '/api/tags_with_structure',
            //由标签id获取文章列表
            getArticlesWithTagId: url + '/api/article_tag/id',

            //获取标签列表(原始)
            getTagsList: url + '/api/tags',
            //增加 post
            addTag: url + '/api/tag',
            //修改 put
            editTag: url + '/api/tag',
            //删除 delete
            deleteTag: url + '/api/tag/id',

            /**
             * 获取评论
             * */
            getArticlesComments: url + '/api/article/comments/article_id',
            changeCommentState: url + '/api/changeCommentState',

            getCommentToArticleList: url + '/api/commentToArticleList',
            postComment: url + '/api/comment',

            //  评论已阅读 post
            changeCommentReplyState: url + '/api/changeCommentReplyState',

            //  评论审核状态 post
            changeAuthState: url + '/api/changeCommentAuthState',

            //    删除评论 delete
            delComment: url + '/api/comment/id',

            //    新增评论
            newComment: url + '/api/comment'

        };
    }).config(['markedProvider', function (markedProvider) {
        // hljs.initHighlightingOnLoad();
        markedProvider.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            highlight: function highlight(code) {
                return hljs.highlightAuto(code).value;
            }
        });
    }]);
})();

console.log('你好!你这是在.....想看源码?联系我吧!');
(function () {

    $(".blackShade.error").click(function () {
        $(this).removeClass("show");
    });

    $(document).on("click", ".aboutme", function () {
        event.preventDefault();
        $('.bg-right').scrollTop(0);
        $(".bg-right-imgBox").toggleClass("bg-right-imgBox-showMe");
        $(".bg-right-imgBox").parent().toggleClass("lockScreen");
    });

    // $(document).on("click", ".btn-back", function () {
    //   $(".bg-right-imgBox").toggleClass("bg-right-imgBox-showMe");
    //   $(".bg-right-imgBox").parent().toggleClass("lockScreen");
    // });

    //  激活工具提示js
    if (document.documentElement.clientWidth < 991) {
        // 激活工具提示js
        $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
            trigger: 'hover',
            placement: 'bottom'
        });
    } else {
        $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
            trigger: 'hover',
            placement: 'right'
        });
    }

    // //触发点击图片显示模态框
    // $(document).on("click", ".article-index-body-img", function () {
    //   $("#articleImg").modal();
    // });
    // $('#articleImg').on('show.bs.modal', function (event) {
    //   var button = $(event.relatedTarget);
    //   var title = button.data('title');
    //   var url = button.data('url');
    //   var position = button.data('position');
    //   var time = button.data('time');
    //   var modal = $(this);
    //   modal.find('.article-img').attr("src", url);
    //   modal.find('.article-title').text(title);
    //   modal.find('.article-position').text(position);
    //   modal.find('.article-time').text(time);
    // })

    //微信加好友的模态框
    $(document).on("click", ".fa.fa-weixin", function () {
        $("#socialContact").modal();
    });
    $('#socialContact').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var title = button.data('title');
        var url = button.data('url');
        var modal = $(this);
        modal.find('.socialContact-title').text(title);
        modal.find('.socialContact-img').attr("src", url);
    });
})();

/**
 * Created by xiangsongtao on 16/2/27.
 */
(function () {
    angular.module('xstApp')
    //数据在页面中写入完毕后,执行repeatDone内的方法函数->repeat-done="inlineTableEdit()"
    .directive('repeatDone', function () {
        return {
            link: function link(scope, element, attrs) {
                if (scope.$last) {
                    // 这个判断意味着最后一个 OK
                    scope.$eval(attrs.repeatDone); // 执行绑定的表达式
                }
            }
        };
    });
})();
/**
 * Created by xiangsongtao on 16/6/26.
 */
(function () {
    angular.module('xstApp').factory("timestampToDate", function () {
        return function (timestamp) {
            var timestampInt = parseInt(timestamp);
            if (timestampInt.toString().length === 13) {
                //正确的时间戳
                return new Date(timestampInt);
            } else {
                //错误的时间戳返回现在时间
                return new Date();
            }
        };
    }).filter("toEnMonth", ['timestampToDate', function (timestampToDate) {
        return function (value) {
            // var date = timestampToDate(value);
            // let month = parseInt(value);
            switch (parseInt(value)) {
                case 1:
                    return "Jan";
                    break;
                case 2:
                    return "Feb";
                    break;
                case 3:
                    return "Mar";
                    break;
                case 4:
                    return "Apr";
                    break;
                case 5:
                    return "May";
                    break;
                case 6:
                    return "Jun";
                    break;
                case 7:
                    return "Jul";
                    break;
                case 8:
                    return "Aug";
                    break;
                case 9:
                    return "Sept";
                    break;
                case 10:
                    return "Oct";
                    break;
                case 11:
                    return "Nov";
                    break;
                case 12:
                    return "Dec";
                    break;

            }
        };
    }]).filter("imgURl", ['API', function (API) {
        return function (imgName) {
            if (!!imgName && imgName.indexOf('http') === -1) {
                //正确的时间戳
                return '' + API.imgResource + imgName;
            } else {
                //错误的时间戳返回现在时间
                return imgName;
            }
        };
    }]);
})();
/**
 * Created by xiangsongtao on 16/2/9.
 */
(function () {
    angular.module('xstApp').filter("toTrusted", ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
})();

/**
 * Created by xiangsongtao on 16/7/1.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
    .factory("AJAX", ['$http', '$localStorage', '$rootScope', function ($http, $localStorage, $rootScope) {
        //获取Token,只是进行get请求和register、login的post请求是不需要token的。
        //登录会能获得token,如果localstorage中存在token信息,则发送时将token携带。
        //这里只是使用localstorage存放数据,古故$localStorage不使用
        return function (httpParams) {
            var token = void 0;
            if (!!$localStorage.authorization && !!$localStorage.authorization.token) {
                token = $localStorage.authorization.token;
            } else {
                token = null;
            }
            var header = {
                'authorization': "token " + token,
                'Content-Type': 'application/json; charset=utf-8'
            };
            var params = {
                method: httpParams.method || "GET",
                data: httpParams.data,
                params: httpParams.params,
                url: httpParams.url,
                cache: httpParams.cache || false,
                timeout: httpParams.timeout || 15000,
                success: httpParams.success || angular.noop(),
                error: httpParams.error || angular.noop(),
                notify: httpParams.notify || angular.noop(),
                complete: httpParams.complete || angular.noop(),
                headers: angular.extend(header, httpParams.headers)
            };
            return $http(params).then(
            //success
            function (response) {
                if (parseInt(response.data.code) == 10) {
                    //做退出操作,token异常
                    $rootScope.confirmLogout();
                } else if (parseInt(response.data.code) == 9) {
                    //需要补充,如果code为9,则代表用户没有访问权限,
                    alert("您代表用户组没有修改权限!");
                } else {
                    httpParams.success && httpParams.success(response.data);
                }
            },
            //error
            function (response) {
                httpParams.error && httpParams.error(response);
                // httpParams.error && httpParams.error("系统错误");
            },
            //notify
            function (response) {
                httpParams.notify && httpParams.notify(response);
            }).catch(function (e) {
                httpParams.catch && httpParams.catch(e);
            }).finally(function (value) {
                httpParams.complete && httpParams.complete(value);
            });
        };
    }]);
})();
/**
 * Created by xiangsongtao on 16/7/1.
 */
(function () {
    angular.module('xstApp').factory('$verification', function () {
        return {
            isUsername: function isUsername(e) {
                return (/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(e)
                );
            },
            //是否是手机号码
            isMobile: function isMobile(e) {
                return (/^((13[0-9])|(14[0-9])|(15[0-9])|(18[0-9])|(17[0-9]))\d{8}$/.test(e)
                );
            },
            //是否为 NaN, undefined, null , 0 , '', false
            isEmpty: function isEmpty(value) {
                if (value) {
                    return false;
                }
                return true;
            },
            isNum: function isNum(e) {
                var t = /^\d+$/;
                return t.test(e);
            },

            /**
             * 是否是昵称:  4-30个字符，可由中英文字母、数字、"-"、"_"组成。
             */
            isNickname: function isNickname(str) {
                var e = /^[\u4e00-\u9fa5_a-zA-Z0-9-\s]+$/;
                return e.test(str);
            },
            /**
             * 是否是密码
             * @param i
             * @returns {boolean}
             */
            isPassword: function isPassword(i) {
                if (!!i) {
                    return (/^[a-zA-Z0-9]{3,20}$/.test(i)
                    );
                } else {
                    return false;
                }
            },
            /**
             *
             * @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
             * @param:str ->待验证的参数。
             * @return -> true表示合格的邮箱。
             *
             */
            isEmail: function isEmail(str) {
                /**
                 * @descrition:邮箱规则
                 * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
                 * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
                 * 3.@符号是必填项
                 * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
                 * 5.邮件提供商域可以包含特殊字符-、_、.
                 */
                var e = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                //var e = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;

                return e.test(str);
            }
        };
    });
})();
/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器

.controller('articleCtrl', ['AJAX', 'API', '$scope', '$timeout', '$stateParams', 'marked', '$log', '$q', '$filter', '$rootScope', '$state', function (AJAX, API, $scope, $timeout, $stateParams, marked, $log, $q, $filter, $rootScope, $state) {
    if (!$rootScope.isLogin) {
        $state.go('home');
        return;
    }
    $scope.selection = [];

    //编辑框的句柄
    var $TextArea = document.getElementById('textarea');

    //判断文章是新增还是修改
    if (!$stateParams._id) {
        console.log("新增文章");
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
                success: function success(response) {
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
    var $outerBox = angular.element(document.getElementById('adminBox-content'));
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
        // console.log('collectEditedArtInfo')
        // console.log(collectEditedArtInfo())

        saveArticle(collectEditedArtInfo()).then(function (data) {
            $timeout(function () {
                $scope.isPublishing = false;
            }, 1000, true);
        });
    };
    //保存草稿
    $scope.isDrafting = false;
    $scope.draftBtn = function () {
        $scope.article.state = false;
        $scope.isDrafting = true;
        // console.log('collectEditedArtInfo')
        // console.log(collectEditedArtInfo())
        saveArticle(collectEditedArtInfo()).then(function (data) {
            $timeout(function () {
                $scope.isDrafting = false;
            }, 1000, true);
        });
    };

    function saveArticle(data) {
        return $q(function (resolve, reject) {
            AJAX({
                method: 'post',
                url: API.postArt,
                data: data,
                success: function success(response) {
                    if (parseInt(response.code) === 1) {
                        resolve(response);
                    }
                }
            });
        });
    }

    //由文章id获取文章原始信息
    function getArticle(id) {
        var defer = $q.defer();
        AJAX({
            method: 'get',
            url: API.getRawArticleById.replace('id', id),
            success: function success(response) {
                defer.resolve(response);
            },
            error: function error(response) {
                defer.reject(response);
            }
        });
        return defer.promise;
    }

    //获取书写的文章信息
    function collectEditedArtInfo() {
        var tagsArr = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = $scope.selection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var tag = _step.value;

                tagsArr.push(tag._id);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var params = {
            "_id": $scope.article._id,
            "title": $scope.article.title,
            "publish_time": new Date($scope.date),
            "tags": tagsArr,
            "state": $scope.article.state,
            "content": $scope.article.content
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
            addEvent = function addEvent(type, callback) {
            elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback);
        },
            getStyle = elem.currentStyle ? function (name) {
            var val = elem.currentStyle[name];

            if (name === 'height' && val.search(/px/i) !== 1) {
                var rect = elem.getBoundingClientRect();
                return rect.bottom - rect.top - parseFloat(getStyle('paddingTop')) - parseFloat(getStyle('paddingBottom')) + 'px';
            }
            return val;
        } : function (name) {
            return getComputedStyle(elem, null)[name];
        },
            minHeight = parseFloat(getStyle('height'));

        elem.style.resize = 'none';

        function change() {
            var scrollTop,
                height,
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
        return AJAX({
            method: 'get',
            url: API.getArticleList,
            success: function success(response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.articleLists = response.data;
                    // console.log($scope.articleLists);
                }
            }
        });
    }

    var deleteArticleId = void 0;
    $scope.delArtBtn = function (_id) {
        deleteArticleId = _id;
    };
    $scope.confirmDelArtBtn = function () {
        AJAX({
            method: 'delete',
            url: API.deleteArt.replace('id', deleteArticleId),
            success: function success(response) {
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
    };
}]);

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
            success: function success(response) {
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
        content: ''
    };
    $scope.comment = function (item, $event) {
        // let target = $($event.currentTarget).parents('.comments__ask');
        // target.siblings().removeClass('isReply');
        // target.toggleClass('isReply');
        $scope.replyBox = item;
    };
    $scope.commentThis = function ($event, item) {
        $scope.isSubmitReply = true;

        //进行评论的逻辑处理,我对此的评论
        // console.log($scope.comment_info.content)
        var params = {
            article_id: item.article_id._id,
            pre_id: item._id,
            next_id: [],
            name: "我",
            email: "280304286@163.com",
            time: new Date(),
            content: $scope.comment_info.content,
            isIReplied: true,
            state: true
        };
        // console.log(params)
        AJAX({
            method: 'post',
            url: API.postComment,
            data: params,
            success: function success(response) {
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
            $($event.currentTarget).parents('.comments__ask').toggleClass('isReply');
        }, 1000, true);
    };

    //    删除评论
    var delCommId = void 0;
    $scope.delbtn = function (id) {
        delCommId = id;
    };
    $scope.confirmDelCommBtn = function () {
        // console.log('delete:' + delCommId);
        AJAX({
            method: 'delete',
            url: API.delComment.replace('id', delCommId),
            success: function success(response) {
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
    };

    //改变此评论的审核状态true/false
    // function changeAuthState
    $scope.changeAuthState = function (_id) {
        console.log(_id);
        return AJAX({
            method: 'post',
            url: API.changeAuthState,
            data: {
                _id: _id
            },
            success: function success(response) {
                // console.log('response');
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    // $scope.commentList = response.data;
                    // console.log(response.data);
                    //刷新文章列表
                    $log.debug("状态改变成功");
                    // getComments();
                }
            }
        });
    };

    $scope.Condition;
    $scope.ConditionFilter = function (data) {
        if (!$scope.Condition) {
            return true;
        }
        switch (parseInt($scope.Condition)) {
            case 0:
                return true;
                break;
            //主评论
            case 1:
                return data.article_id._id.toString() === data.pre_id.toString();
                break;
            //子评论
            case 2:
                return data.article_id._id.toString() !== data.pre_id.toString();
                break;
            //主评论+未回复
            case 3:
                return !data.isIReplied && data.article_id._id.toString() === data.pre_id.toString();
                break;
            //主评论+未审核
            case 4:
                return !data.state && data.article_id._id.toString() === data.pre_id.toString();
                break;
            //主回复
            case 5:
                return !data.isIReplied;
                break;
            //未审核
            case 6:
                return !data.state;
                break;
            default:
                return true;
                break;

        }
    };

    //如果对用户的文章评论进行了评论,则标记此评论为已阅读
    //此接口只对我有效
    function changeCommentReplyState(_id) {
        var params = {
            _id: _id
        };
        return AJAX({
            method: 'post',
            url: API.changeCommentReplyState,
            data: params,
            success: function success(response) {
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

/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp').controller('myInfoCtrl', ['$scope', 'AJAX', 'API', '$log', '$verification', '$timeout', '$rootScope', '$state', function ($scope, AJAX, API, $log, $verification, $timeout, $rootScope, $state) {
        if (!$rootScope.isLogin) {
            $state.go('home');
            return;
        }
        //获取我的信息
        AJAX({
            method: 'get',
            url: API.getMyInfoWithOriginal,
            success: function success(response) {
                if (parseInt(response.code) === 1) {
                    $scope.myinfo = response.data;
                    // console.log($scope.myinfo);
                }
            }
        });

        //取值
        var changedValue = void 0;
        $scope.setThis = function (value) {
            changedValue = value;
        };
        //保存操作
        $scope.save = function (value) {
            // console.log(changedValue)
            // console.log(value)
            if (changedValue !== value) {
                AJAX({
                    method: 'put',
                    url: API.postMyInfo,
                    data: {
                        _id: $scope.myinfo._id,
                        full_name: $scope.myinfo.full_name,
                        position: $scope.myinfo.position,
                        address: $scope.myinfo.address,
                        motto: $scope.myinfo.motto,
                        personal_state: $scope.myinfo.personal_state,
                        img_url: $scope.myinfo.img_url
                    },
                    success: function success(response) {
                        if (parseInt(response.code) === 1) {
                            $log.debug(response.msg);
                        } else {
                            alert("我的信息修改失败: " + response.msg);
                            $log.error(response.msg);
                        }
                    }
                });
            }
        };

        //修改登录信息
        $scope.changeAuthorizationInfo = function () {
            if (!$verification.isUsername($scope.myinfo.username)) {
                alert('用户名无效');
                return false;
            }
            if (!$verification.isPassword($scope.myinfo.password)) {
                alert('旧密码无效');
                return false;
            }
            if (!$verification.isPassword($scope.myinfo.new_password)) {
                alert('新密码无效');
                return false;
            }
            AJAX({
                method: 'post',
                url: API.changePassword,
                data: {
                    _id: $scope.myinfo._id,
                    username: $scope.myinfo.username,
                    password: $scope.myinfo.password,
                    new_password: $scope.myinfo.new_password
                },
                success: function success(response) {
                    if (parseInt(response.code) === 1) {
                        $scope.textState = '成功!';
                        $log.debug(response.msg);
                    } else {
                        $scope.textState = '失败!';
                        $log.error(response.msg);
                    }
                },
                complete: function complete() {
                    $timeout(function () {
                        $scope.myinfo.new_password = null;
                        $scope.textState = 'Submit';
                    }, 2000, true);
                }
            });
        };

        /**
         * imgUpload 配置
         * */
        var config = {
            url: API.imgUpload,
            maxFilesize: 1000,
            paramName: "uploadImg",
            maxThumbnailFilesize: 10,
            parallelUploads: 1,
            //自动上传
            autoProcessQueue: true
        };
        var dropzone = new Dropzone(document.getElementById('imgUpload'), config);
        dropzone.on('success', function (file, response) {
            if (parseInt(response.code) === 1) {
                $scope.myinfo.img_url = response.data;
                isChanged = true;
                $scope.save();
            }
        });
    }]);
})();

/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
.controller('tagsCtrl', ['AJAX', 'API', '$scope', '$log', '$timeout', '$rootScope', '$state', function (AJAX, API, $scope, $log, $timeout, $rootScope, $state) {
    if (!$rootScope.isLogin) {
        $state.go('home');
        return;
    }
    /*
     * 写入页面信息
     */
    getTags();
    function getTags() {
        return AJAX({
            method: 'get',
            url: API.getTagsList,
            success: function success(response) {
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.tagLists = response.data;
                    console.log($scope.tagLists);
                }
            }
        });
    }

    //模态框弹出(新增)
    $scope.addNewTagBtn = function () {
        //init
        $scope.newTag = {
            name: null,
            catalogue_name: null
        };
    };
    $scope.confirmSaveNewTagBtn = function () {
        var data = {
            name: $scope.newTag.name,
            catalogue_name: $scope.newTag.catalogue_name
        };
        $scope.submitText = '正在提交...';
        AJAX({
            method: 'post',
            url: API.addTag,
            data: data,
            success: function success(response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $log.debug(response.msg);
                    // 刷新列表
                    getTags();
                    //操作提示
                    $scope.submitText = '新增成功!';
                    // $timeout(function () {
                    //   
                    // }, 1500, true);
                    angular.element(document.getElementById('addTag')).modal('hide');
                    $scope.submitText = null;
                } else {
                    //操作提示
                    $scope.submitText = '新增失败, 标签名称已存在!';
                    // $timeout(function () {
                    //
                    // }, 1500, true);
                    $scope.submitText = null;
                    $log.error(response.msg);
                }
            }
        });
    };

    //模态框弹出(修改)
    $scope.editTagBtn = function (tagInfo) {
        $scope.editTag = {
            _id: tagInfo._id,
            name: tagInfo.name,
            catalogue_name: tagInfo.catalogue_name
        };
    };
    $scope.confirmEditTagBtn = function () {
        $scope.submitText = '正在提交...';
        AJAX({
            method: 'put',
            url: API.editTag,
            data: $scope.editTag,
            success: function success(response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $log.debug(response.msg);
                    // 刷新列表
                    getTags();
                    //操作提示
                    $scope.submitText = '修改成功!';
                    // $timeout(function () {
                    //
                    // }, 1500, true);
                    angular.element(document.getElementById('editTag')).modal('hide');
                    $scope.submitText = null;
                } else {
                    //操作提示
                    switch (parseInt(response.code)) {
                        case 2:
                            $scope.submitText = '修改失败, 此标签不存在!';
                            break;
                        case 3:
                            $scope.submitText = '修改失败, 标签名称重复!';
                            break;
                        default:
                            $scope.submitText = '修改失败!';
                            break;
                    }
                    // $timeout(function () {
                    //
                    // }, 1500, true);
                    $scope.submitText = null;
                    $log.error(response.msg);
                }
            }
        });
    };

    //模态框弹出(删除)
    $scope.delTagBtn = function (id) {
        $scope.delTag = {
            _id: id
        };
    };
    $scope.confirmDelTagBtn = function () {
        $scope.submitText = '正在删除...';
        AJAX({
            method: 'delete',
            url: API.deleteTag.replace('id', $scope.delTag._id),
            success: function success(response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $log.debug(response.msg);
                    // 刷新列表
                    getTags();
                    //操作提示
                    $scope.submitText = '删除成功!';
                    // $timeout(function () {
                    //  
                    // }, 1500, true);
                    angular.element(document.getElementById('delTag')).modal('hide');
                    $scope.submitText = null;
                } else {
                    //操作提示
                    $scope.submitText = '删除失败!';
                    // $timeout(function () {
                    //  
                    // }, 1500, true);
                    $scope.submitText = null;
                    $log.error(response.msg);
                }
            }
        });
    };
}]);

/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //blogPageController控制器
    .controller('blogPageController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getMyInfo).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.myInfo = response.data;
            }
        }).error(function (erroInfo, status) {
            // $(".blackShade.error").addClass("show");
            // $(".blackShade.error h3").text("哎呦,好像出错了!");
            // $(".blackShade.error span").html(erroInfo);
            // $(".blackShade.error small").text("状态码:" + status);
        });
        $('[data-toggle="popover"]').popover();
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //登陆控制器
    .controller('loginController', ['$scope', 'AJAX', 'API', '$localStorage', '$rootScope', '$state', function ($scope, AJAX, API, $localStorage, $rootScope, $state) {
        if ($rootScope.isLogin) {
            $state.go('home');
        } else {
            $scope.data = {
                username: '',
                password: ''
            };
            $scope.loginBtn = function () {
                if (!$scope.data.username) {
                    alert('请输入用户名');
                    return;
                }
                if (!$scope.data.password) {
                    alert('请输入用户名');
                    return;
                }
                AJAX({
                    method: 'post',
                    url: API.login,
                    data: $scope.data,
                    success: function success(response) {
                        if (parseInt(response.code) === 1) {
                            //权限信息
                            $localStorage.authorization = {
                                token: response.token,
                                time: new Date().getTime()
                            };
                            //我进行评论的信息
                            $localStorage.commentAuth = {
                                "commentUsername": API.MY,
                                "commentEmail": API.EMAIL
                            };
                            $rootScope.isLogin = true;
                            $state.go('home');
                        } else {
                            switch (parseInt(response.code)) {
                                case 2:
                                    alert("用户名或密码错误,请再检查!");
                                    break;
                                default:
                                    alert("系统错误!");
                                    break;
                            }
                        }
                    },
                    error: function error() {
                        alert("系统错误!");
                    }
                });
            };
        }
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp');
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //index的文字反动
    .directive("indexWordFadeIn", function () {
        return {
            restirect: 'E',
            replace: true,
            link: function link(scope, element) {
                var headlines = $("#headlines");
                setInterval(function () {
                    if (headlines.find('h1.current').next().length == 0) {
                        headlines.find('h1').first().addClass('current').siblings().removeClass('current');
                    } else {
                        headlines.find('h1.current').next().addClass('current').siblings().removeClass('current');
                    }
                }, 4000);
            }
        };
    });
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //Detail控制器-catalogueName-type-id
    .controller('DetailController', ['$scope', '$stateParams', 'AJAX', 'API', '$localStorage', '$timeout', function ($scope, $stateParams, AJAX, API, $localStorage, $timeout) {

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
            success: function success(response) {
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.article = response.data;
                    getCommentList($scope.article._id);
                }
            },
            error: function error(err) {}
        });

        //点击回复按钮触发动作
        $scope.commentThisArtBtn = function (commentInfo) {

            console.log('commentInfo');
            console.log(commentInfo);
            //如果有论人的信息,则不显示输入框
            if (!!$scope.commentUsername && !!$scope.commentEmail) {
                $scope.canComment = true;
                $localStorage.commentAuth = {
                    commentUsername: $scope.commentUsername,
                    commentEmail: $scope.commentEmail
                };
            }

            if (!$scope.commentToArt) {
                alert("评论内容不能为空");
                return false;
            }

            var params = {
                article_id: commentInfo._id,
                pre_id: commentInfo._id,
                next_id: [],
                name: $scope.commentUsername,
                email: $scope.commentEmail,
                time: new Date(),
                content: $scope.commentToArt,
                state: true,
                isIReplied: false
            };

            //send
            AJAX({
                method: 'post',
                url: API.newComment,
                data: params,
                success: function success(response) {
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        console.log("评论成功@@@!!!!");
                        $scope.commentToArt = '';
                        $scope.commentToComment = '';
                        //    对评论的评论回复还需要隐藏评论框
                        $('.comments__reply').removeClass('active');

                        //刷新
                        getCommentList(commentInfo._id);
                    }
                },
                error: function error(err) {}
            });
        };

        $scope.$watch('commentToComment', function () {
            console.log($scope.commentToComment);
        });
        //对评论进行评论
        $scope.commentThisCommentBtn = function (commentInfo, content) {
            // $scope.$apply();

            console.log('commentInfo');
            console.log(commentInfo + "--" + content);
            //如果有论人的信息,则不显示输入框
            if (!!$scope.commentUsername && !!$scope.commentEmail) {
                $scope.canComment = true;
                $localStorage.commentAuth = {
                    commentUsername: $scope.commentUsername,
                    commentEmail: $scope.commentEmail
                };
            }

            if (!content) {
                alert("评论内容不能为空");
                return false;
            }

            var params = {
                article_id: commentInfo.article_id,
                pre_id: commentInfo._id,
                next_id: [],
                name: $scope.commentUsername,
                email: $scope.commentEmail,
                time: new Date(),
                content: content,
                state: true,
                isIReplied: false
            };

            //send
            AJAX({
                method: 'post',
                url: API.newComment,
                data: params,
                success: function success(response) {
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        console.log("评论成功@@@!!!!");
                        $scope.commentToComment = '';
                        //    对评论的评论回复还需要隐藏评论框
                        $('.comments__reply').removeClass('active');

                        //刷新
                        getCommentList(commentInfo.article_id);
                    }
                },
                error: function error(err) {}
            });
        };

        //自评论点击回复按钮
        $scope.commentToComemntBtn = function ($event) {
            var $this = $($event.currentTarget).parents('.comments__ask').next('.comments__reply');
            $('.comments__reply').not($this).removeClass('active');
            $this.toggleClass('active');
        };

        //判断是否能评论
        $scope.canComment = canComment();
        function canComment() {
            if (!!$localStorage.commentAuth) {
                if ($scope.commentUsername && $scope.commentEmail) {
                    return true;
                } else {
                    $scope.commentUsername = $localStorage.commentAuth.commentUsername;
                    $scope.commentEmail = $localStorage.commentAuth.commentEmail;
                    return true;
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
                success: function success(response) {
                    console.log('-----response------');
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.commentList = response.data;
                    }
                }
            });
        }
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //ArticleList控制器
    .controller('ArticleListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        var url = API.newUpdateArticle.replace("from", API.ArticleFrom).replace("to", API.ArticleTo);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {
            // $(".blackShade.error").addClass("show");
            // $(".blackShade.error h3").text("哎呦,好像出错了!");
            // $(".blackShade.error span").html(erroInfo);
            // $(".blackShade.error small").text("状态码:" + status);
        });
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //HistoryList控制器
    .controller('HistoryListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getArticleHistoryWithStructure).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.historyLists = response.data;
            }
        }).error(function (erroInfo, status) {});
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //TagList控制器
    .controller('TagListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getTagsListWithStructure).success(function (response) {
            console.log("TagListController response");
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.tagLists = response.data;
            }
        }).error(function (erroInfo, status) {});
    }]).controller('findArticlesByTagController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
        var url = API.getArticlesWithTagId.replace('id', $stateParams.id);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {});
    }]);
})();
/**
 * Created by xiangsongtao on 16/7/4.
 */
(function () {
    angular.module('xstApp')
    //主页
    .controller('indexController', ['$scope', '$rootScope', '$localStorage', '$state', function ($scope, $rootScope, $localStorage, $state) {
        //初始化
        $rootScope.isLogin = false;

        $rootScope.confirmLogout = function () {
            $localStorage.$reset();
            $rootScope.isLogin = false;
            $state.go('home');
        };

        //    进入检查是否有token,是否能直接登录
        if (!!$localStorage.authorization) {
            var time = parseInt($localStorage.authorization.time);
            if (new Date().getTime() - time < 1000 * 60 * 60 * 2) {
                //token有效,能进入
                $rootScope.isLogin = true;
            }
        }
    }]);
})();
'use strict';
/**
 * Created by xiangsongtao on 16/6/29.
 * 后台路由
 */

(function () {
    angular.module('xstApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("/admin/articleManager", "/admin/articleManager/articleList");
        // .otherwise("/");
        $stateProvider

        //修改我的信息
        .state('admin', {
            url: "/admin",
            templateUrl: 'web/tpl/admin.html'
        }).state('admin.myInfo', {
            url: "/myInfo",
            controller: 'myInfoCtrl',
            templateUrl: 'web/tpl/admin.myinfo.tpl.html'
        })

        //标签
        .state('admin.tags', {
            url: "/tags",
            templateUrl: 'web/tpl/admin.tags.tpl.html',
            controller: 'tagsCtrl'
        })
        //文章
        .state('admin.articleManager', {
            url: "/articleManager",
            templateUrl: 'web/tpl/admin.articleManager.tpl.html'
            // controller: 'paperCtrl'
        }).state('admin.articleManager.articleList', {
            url: "/articleList",
            templateUrl: 'web/tpl/admin.articleList.tpl.html',
            controller: 'articleListCtrl'
        }).state('admin.articleManager.article', {
            params: {
                _id: null
            },
            url: "/article/:_id",
            templateUrl: 'web/tpl/admin.article.tpl.html',
            controller: 'articleCtrl'
        })
        //    评论
        .state('admin.comment', {
            url: "/comments",
            templateUrl: 'web/tpl/admin.comment.tpl.html',
            controller: 'commentCtrl'
        });
    }]);
})();

'use strict';
/**
 * Created by xiangsongtao on 16/2/8.
 * Home 路由
 */

(function () {
    angular.module('xstApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("/blog", "/blog/articleList").otherwise("/");

        $stateProvider
        /**
         * 首页
         * */
        .state('home', {
            url: "/",
            templateUrl: 'web/tpl/home.index.html'
        })
        /**
         * 登陆
         * */
        .state('login', {
            url: "/login",
            templateUrl: 'web/tpl/home.login.html',
            controller: 'loginController'
        })
        /**
         * 博客
         * */
        .state('blog', {
            controller: 'blogPageController',
            url: "/blog",
            templateUrl: 'web/tpl/home.blogPage.html'
        }).state('blog.articleList', {
            controller: 'ArticleListController',
            url: "/articleList",
            templateUrl: 'web/tpl/home.blogPage.articleList.html'
        }).state('blog.historyList', {
            controller: 'HistoryListController',
            url: "/historyList",
            templateUrl: 'web/tpl/home.blogPage.historyList.html'
        }).state('blog.tagList', {
            controller: 'TagListController',
            url: "/tagList",
            templateUrl: 'web/tpl/home.blogPage.tagList.html'
        })
        //根据tagid查找文章列表
        .state('blog.findArticlesByTag', {
            params: {
                'id': ''
            },
            controller: 'findArticlesByTagController',
            url: "/articleList/tag/:id",
            templateUrl: 'web/tpl/home.blogPage.articleList.html'
        }).state('blog.detail', {
            params: {
                'id': ''
            },
            url: "/article/:id",
            controller: 'DetailController',
            templateUrl: 'web/tpl/home.blogPage.article.html'
        })
        /**
         * 照片墙
         * */
        .state('blog.picture', {
            controller: 'pictureController',
            url: "/picture",
            templateUrl: 'web/tpl/home.picture.html'
        });
    }]);
})();