'use strict';

(function () {
    angular.module('xstApp', ['ui.router', 'ngStorage', 'hc.marked', 'btorfs.multiselect', 'angularMoment', 'ng-bs3-datepicker'])
    /**
     * 配置文件
     * */
    //moment国际化选择
    .run(['amMoment', function (amMoment) {
        amMoment.changeLocale('Zh-cn');
    }])
    // hljs.initHighlightingOnLoad();
    .config(['markedProvider', function (markedProvider) {
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
    }])
    //html5的路由模式,去掉#,无要在开头设置<base href="/" />
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }])
    /**
     * 拓展$log方法,为其加上时间戳
     * */
    .config(['$provide', function ($provide) {
        $provide.decorator('$log', ['$delegate', function ($delegate) {
            var origDebug = $delegate.debug;
            $delegate.debug = function () {
                var args = [].slice.call(arguments);
                args[0] = [new Date().toString(), ': ', args[0]].join('');

                // Send on our enhanced message to the original debug method.
                origDebug.apply(null, args);
            };
            return $delegate;
        }]);
    }])
    /**
     * $log的debug方法显示开关
     * */
    .config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(false);

        // $log.log("log")
        // $log.info("info")
        // $log.warn("warn")
        // $log.error("error")
        // $log.debug("ello")
    }]);
})();

/**
 * Created by xiangsongtao on 16/6/26.
 */
(function () {
    angular.module('xstApp').factory("timestampToDate", [function () {
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
    }]).filter("toEnMonth", [function () {
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
            } else if (!imgName) {
                return false;
            } else {
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
                    console.log("访问内容需要token! code:10");
                    $rootScope.relogin();
                } else if (parseInt(response.data.code) == 9) {
                    //需要补充,如果code为9,则代表用户没有访问权限,
                    alert("您代表用户组没有修改权限! code:9");
                    httpParams.success && httpParams.success(response.data);
                }if (parseInt(response.data.code) == 8) {
                    //需要补充,如果code为8,则数据库查找错误,
                    console.log("后台服务错误,请联系后台管理人员! code:8");
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
 * Created by xiangsongtao on 16/7/10.
 */
(function () {
    angular.module('xstApp').factory('API', [function () {
        //接口API根地址
        var url = CONFIG.url;
        //我的信息_id
        var MY_INFO_ID = CONFIG.MY_INFO_ID;
        //我对对评论进行回复的信息
        var MY = CONFIG.MY;
        var EMAIL = CONFIG.EMAIL;
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
            //post 为了安全起见
            getMyInfoWithOriginal: url + '/api/user/original',
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
            //评论已阅读 post
            changeCommentReplyState: url + '/api/changeCommentReplyState',
            //评论审核状态 post
            changeAuthState: url + '/api/changeCommentAuthState',
            //删除评论 delete
            delComment: url + '/api/comment/id',
            //新增评论
            newComment: url + '/api/comment'
        };
    }]);
})();
/**
 * Created by xiangsongtao on 16/7/11.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
    .factory("$autoTextarea", ['$http', '$localStorage', '$rootScope', function ($http, $localStorage, $rootScope) {
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
        return autoTextarea;
    }]);
})();
(function () {
    angular.module('xstApp')

    /**
     * 图片加载失败的时候进行处理
     * <img height="100%" ng-src="{{video.imgUrl}}" err-src="images/video-img-404.png">
     *  如果err-src不传入数据,则计算使用最近尺寸比例匹配的图片
     * */
    .directive('errSrc', [function () {
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                element.css({ "opacity": 0 });

                var emptyTransparent = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";

                //如果失败
                element.on('error', function () {
                    // console.log('--------------')
                    // console.log(attrs.errSrc )
                    // console.log(attrs.src )
                    // console.log(attrs.src != attrs.errSrc)
                    if (!!attrs.errSrc && attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    } else {
                        // console.log(getPlaceHolderImgUrl())
                        attrs.$set('src', emptyTransparent);
                    }
                    element.css({ "opacity": 1, "transition": "opacity ease 300ms" });
                });
                //如果成功
                element.on('load', function () {
                    element.css({ "opacity": 1, "transition": "opacity ease 300ms" });
                });
            }
        };
    }]);
})();

// /**
//  * Created by xiangsongtao on 16/7/9.
//  */
// (function () {
//     angular.module('xstApp')
//         .directive('noData', function () {
//             return {
//                 restrict:'E',
//                 replace:true,
//                 template:'<div class="nodata" ng-if="ndData.length"><img src="web/img/employee.svg" alt="当前没有数据诶"><p class="content">{{ndText}}</p></div>',
//                 scope:{
//                     ndData:'=',
//                     ndText:'@'
//                 },
//                 controller:function ($scope) {
//                     console.log($scope.ndData)
//                     console.log($scope.ndText)
//                 }
//             }
//         })
// })();
/**
 * Created by xiangsongtao on 16/3/21.
 */

(function () {
    angular.module('xstApp')

    /**
     * 用$ionicLoading改造出$ionicToast提示
     * */
    .factory("$toast", ['$timeout', '$rootScope', '$log', function ($timeout, $rootScope, $log) {
        //传入参数有两种情况
        var _contentBox = [];
        var _token = true;
        //将内容布置好
        //<div id="toaster-container">
        // <div class="toaster">
        // <span>text</span>
        // </div>
        // </div>
        // <div class="alert alert-success" role="alert">
        //     <a href="#" class="alert-link">...</a>
        // </div>
        var _outerHtml = '<div id="toaster-container"></div>';
        var _innerHtml;
        //上传
        angular.element(document.body).append(_outerHtml);
        //定位
        var $toasterContainer = angular.element(document.getElementById('toaster-container'));

        function showToast(argsArray) {
            //1. 字符串,表示toast要显示的
            //2. 配置参数options,表示需要对options进行配置
            var _during = angular.isArray(argsArray) && argsArray.length > 1 && !!argsArray[1] ? argsArray[1] : 1300;
            var _interval = angular.isArray(argsArray) && argsArray.length > 2 && !!argsArray[2] ? argsArray[2] : 300;
            //拿牌
            _token = false;
            //取第一个
            var noticeToShow = _contentBox.shift();
            //填入
            _innerHtml = '<div class="toaster alert alert-success"><span>' + noticeToShow + '</span></div>';
            //清空 上膛
            $toasterContainer.empty().append(_innerHtml).addClass('visible active');
            //定时后取消显示
            $timeout(function () {
                $toasterContainer.removeClass("active");
                $timeout(function () {
                    $toasterContainer.removeClass('visible');
                    //归还牌子
                    _token = true;
                    //广播事件
                    $rootScope.$broadcast("toastComplete");
                }, _interval);
            }, _during);
        };
        //设置监听 事件请求
        $rootScope.$on("toastRequest", function (event, data) {
            //将消息推到末尾
            _contentBox.push(data[0]);
            if (_token) {
                showToast(data);
            }
        });
        //设置监听 事件完成
        $rootScope.$on("toastComplete", function () {
            if (_contentBox.length > 0) {
                showToast();
            }
        });
        // $rootScope.$on("$locationChangeSuccess",function () {
        //     console.log("$locationChangeSuccess");
        //     console.log(_contentBox)
        //
        // });
        //
        // $rootScope.$on("toastAbandon",function () {
        //
        // });

        return {
            show: function show() {
                if (arguments[0] && angular.isString(arguments[0])) {
                    var argsArray = Array.prototype.slice.call(arguments);
                    $log.debug("$ionicToast:" + argsArray);
                    //如果第一个参数是字符串,则显示
                    $rootScope.$broadcast("toastRequest", argsArray);
                } else {
                    $rootScope.$broadcast("toastRequest", "操作失败!");
                    $log.error('注意使用方法: $ionicToast.show("string")!');
                    // console.log('注意使用方法: $ionicToast.show("string")!');
                    return false;
                }
            }
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
(function () {
    angular.module('xstApp')
    //myInfo的控制器
    .controller('articleCtrl', ['AJAX', 'API', '$scope', '$timeout', '$stateParams', 'marked', '$log', '$q', '$filter', '$rootScope', '$state', '$autoTextarea', function (AJAX, API, $scope, $timeout, $stateParams, marked, $log, $q, $filter, $rootScope, $state, $autoTextarea) {
        $scope.selection = [];

        //编辑框的句柄
        var $TextArea = document.getElementById('textarea');

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
            saveArticle(collectEditedArtInfo()).then(function (data) {
                history.back();
                $scope.isPublishing = false;
            }, function () {
                $scope.isPublishing = false;
            });
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
                        } else {
                            reject();
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
            $autoTextarea($TextArea, 10);
        }
    }]);
})();

/**
 * Created by xiangsongtao on 16/2/22.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
    .controller('articleListCtrl', ['AJAX', 'API', '$scope', '$log', function (AJAX, API, $scope, $log) {

        $scope.isLoaded = false;
        //获取文章列表
        AJAX({
            method: 'get',
            url: API.getArticleList,
            success: function success(response) {
                if (parseInt(response.code) === 1) {
                    $scope.articleLists = response.data;
                    $log.debug("文章列表获取成功!");
                }
            },
            error: function error() {
                $log.error("文章列表获取失败!");
            },
            complete: function complete() {
                $scope.isLoaded = true;
            }
        });

        var deleteArticle = void 0;
        $scope.delArtBtn = function (article) {
            deleteArticle = article;
        };
        $scope.confirmDelArtBtn = function () {
            AJAX({
                method: 'delete',
                url: API.deleteArt.replace('id', deleteArticle._id),
                success: function success(response) {
                    if (parseInt(response.code) === 1) {
                        //刷新文章列表
                        $scope.articleLists.splice($scope.articleLists.indexOf(deleteArticle), 1);
                    }
                }
            });
        };
    }]);
})();

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
                success: function success(response) {
                    // console.log(response)
                    if (parseInt(response.code) === 1) {
                        $scope.commentList = response.data;
                    }
                },
                complete: function complete() {
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
        };
        $scope.confirmAddComment = function (item) {
            // $scope.isSubmitReply = true;

            //进行评论的逻辑处理,我对此的评论
            // console.log('评论内容:');
            // console.log($scope.comment_info.content);
            var params = {
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
                    success: function success(response) {
                        if (parseInt(response.code) === 1) {
                            $log.debug("回复成功: " + response);
                            //刷新文章列表
                            getComments();
                        }
                    },
                    error: function error(response) {
                        $log.debug("回复失败: " + response);
                    }
                });
            }).finally(function () {
                $scope.comment_info.content = "";
            });
        };

        //    删除评论
        var delComm = void 0;
        $scope.delbtn = function (item) {
            delComm = item;
        };
        $scope.confirmDelCommBtn = function () {
            AJAX({
                method: 'delete',
                url: API.delComment.replace('id', delComm._id),
                success: function success(response) {
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
            var defer = $q.defer();
            AJAX({
                method: 'post',
                url: API.changeAuthState,
                data: {
                    _id: _id
                },
                success: function success(response) {
                    if (parseInt(response.code) === 1) {
                        //刷新文章列表
                        $log.debug("状态改变成功");
                        defer.resolve();
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
                    return true;
                    break;
            }
        };

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
                    return true;
                    break;
            }
        };

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
                    return true;
                    break;
            }
        };

        //如果对用户的文章评论进行了评论,则标记此评论为已阅读
        //此接口只对我有效
        function changeCommentReplyState(_id) {
            var defer = $q.defer();
            var params = {
                _id: _id
            };
            AJAX({
                method: 'post',
                url: API.changeCommentReplyState,
                data: params,
                success: function success(response) {
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

/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp').controller('myInfoCtrl', ['$scope', 'AJAX', 'API', '$log', '$verification', '$timeout', '$rootScope', '$state', '$localStorage', '$autoTextarea', function ($scope, AJAX, API, $log, $verification, $timeout, $rootScope, $state, $localStorage, $autoTextarea) {

        //获取我的信息
        AJAX({
            method: 'post',
            url: API.getMyInfoWithOriginal,
            data: {
                _id: API.MY_INFO_ID
            },
            success: function success(response) {
                if (parseInt(response.code) === 1) {
                    $scope.myinfo = response.data;
                    //重新计算textarea的高度
                    $timeout(function () {
                        resizeTextarea();
                    }, 0, true);
                }
            },
            error: function error(err) {
                $log.error(err);
            }
        });

        //取值
        var changedValue = void 0;
        $scope.setThis = function (value) {
            changedValue = value;
        };
        //保存操作
        $scope.save = function (value) {

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
                            // alert("我的信息修改失败: " + response.msg);
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

                        //密码修改成功,需要提示用户重新登录,自动退出!
                        $timeout(function () {
                            $localStorage.$reset();
                            $rootScope.isLogin = false;
                            $state.go('login');
                        }, 200, true);
                    } else {
                        $scope.textState = '失败!';
                        $log.error(response.msg);
                    }
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
                changedValue = false;
                $scope.save(true);
            }
        });

        //textare自动提升高度

        var $TextArea = document.getElementById('personalState__textarea');
        // resizeTextarea();
        $scope.$watch('myinfo.personal_state', function () {
            if (!!$scope.myinfo && $scope.myinfo.personal_state) {
                resizeTextarea();
            }
        });

        function resizeTextarea() {
            $autoTextarea($TextArea, 10);
        }
    }]);
})();

/**
 * Created by xiangsongtao on 16/2/22.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
    .controller('tagsCtrl', ['AJAX', 'API', '$scope', '$log', '$timeout', '$rootScope', '$state', function (AJAX, API, $scope, $log, $timeout, $rootScope, $state) {
        /*
         * 写入页面信息
         */
        $scope.isLoaded = false;
        getTags();
        function getTags() {

            return AJAX({
                method: 'get',
                url: API.getTagsList,
                success: function success(response) {
                    // console.log(response);   /
                    if (parseInt(response.code) === 1) {
                        $scope.tagLists = response.data;
                        // console.log($scope.tagLists);
                    }
                },
                complete: function complete() {
                    $scope.isLoaded = true;
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
                        angular.element(document.getElementById('addTag')).modal('hide');
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 2000, true);
                    } else {
                        //操作提示
                        $scope.submitText = '新增失败, 标签名称已存在!';
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 2000, true);

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
                        angular.element(document.getElementById('editTag')).modal('hide');
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 2000, true);
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
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 2000, true);
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
                        angular.element(document.getElementById('delTag')).modal('hide');
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 2000, true);
                    } else {
                        //操作提示
                        $scope.submitText = '删除失败!';
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 2000, true);
                        $log.error(response.msg);
                    }
                }
            });
        };
    }]);
})();

/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //blogPageController控制器
    .controller('blogPageController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getMyInfo).success(function (response) {
            // console.log(response);
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

        // $('#socialContact').on('show.bs.modal', function (event) {
        //     var button = $(event.relatedTarget);
        //     var title = button.data('title');
        //     var url = button.data('url');
        //     var modal = $(this);
        //     modal.find('.socialContact-title').text(title);
        //     modal.find('.socialContact-img').attr("src", url);
        // })

        // $scope.showBox=function (title,src) {
        //     $scope.modalInfo = {
        //         src:src
        //     };
        // }
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
    //登陆控制器
    .controller('loginController', ['$scope', 'AJAX', 'API', '$localStorage', '$rootScope', '$state', function ($scope, AJAX, API, $localStorage, $rootScope, $state) {

        angular.element(document.getElementById('username')).focus();

        $scope.data = {
            username: '',
            password: ''
        };
        $scope.loginBtn = function () {
            if (!$scope.data.username) {
                $scope.errText = "请输入用户名!";
                // alert('请输入用户名');
                return;
            }
            if (!$scope.data.password) {
                $scope.errText = "请输入密码!";
                // alert('请输入用户名');
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
                        if ($scope.data.username.indexOf("visitor") !== -1) {
                            $localStorage.commentAuth = {
                                "commentUsername": "Visitor",
                                "commentEmail": "visitor@email.com"
                            };
                        } else {
                            $localStorage.commentAuth = {
                                "commentUsername": API.MY,
                                "commentEmail": API.EMAIL
                            };
                        }

                        //开启tooltip
                        $rootScope.tooltip();
                        $rootScope.isLogin = true;
                        $state.go('home');
                    } else {
                        switch (parseInt(response.code)) {
                            case 2:
                                $scope.errText = "用户名或密码错误,请再检查!";
                                break;
                            default:
                                $scope.errText = "系统错误!";
                                break;
                        }
                    }
                },
                error: function error() {
                    $scope.errText = "系统错误!";
                    // alert("系统错误!");
                }
            });
        };

        $scope.keydown = function ($event) {
            var e = $event || window.$event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                // enter 键
                //要做的事情
                $scope.loginBtn();
            }
        };
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //Detail控制器-catalogueName-type-id
    .controller('DetailController', ['$scope', '$stateParams', 'AJAX', 'API', '$localStorage', '$timeout', '$verification', '$interval', function ($scope, $stateParams, AJAX, API, $localStorage, $timeout, $verification, $interval) {

        $scope.chain = {
            selectId: 'selectId',
            main_state: 'default', //default,going,success,error,email,clock
            sub_state: 'default' };

        //default,going,success,error,email,clock
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
            success: function success(response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.article = response.data;
                    getCommentList($scope.article._id);
                }
            },
            error: function error(err) {}
        });

        //记录回复时间,间隔30s后才能回复。
        var commentTime = void 0;
        //点击回复按钮触发动作
        $scope.commentBtn = function (info, commentContent) {
            changeState(!info.article_id, 'going');

            if (!!commentTime && new Date().getTime() - commentTime < 1000 * 30) {
                var a = false;
                $interval(function () {
                    if (a) {
                        a = false;
                        changeState(!info.article_id, 'clock');
                    } else {
                        a = true;
                        changeState(!info.article_id, 'error');
                    }
                }, 500, 6, true);
                $timeout(function () {
                    changeState(!info.article_id, 'default');
                }, 3000, true);
                return false;
            }
            commentTime = new Date().getTime();

            //如果有论人的信息,则不显示输入框 $verification
            if (!!$scope.commentInfo.username && !!$scope.commentInfo.email && $verification.isEmail($scope.commentInfo.email)) {

                $scope.canComment = true;
                $localStorage.commentAuth = {
                    commentUsername: $scope.commentInfo.username,
                    commentEmail: $scope.commentInfo.email
                };
            } else {
                var a = false;
                $interval(function () {
                    if (a) {
                        a = false;
                        changeState(!info.article_id, 'email');
                    } else {
                        a = true;
                        changeState(!info.article_id, 'error');
                    }
                }, 500, 6, true);
                $timeout(function () {
                    changeState(!info.article_id, 'default');
                }, 3000, true);
                return false;
            }

            var article_id = void 0;
            if (!info.article_id) {
                article_id = info._id;
                // console.log("这个是对文章的评论!")
            } else {
                    article_id = info.article_id;
                    // console.log("这个是对评论的回复")
                }

            var params = {
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
                success: function success(response) {
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
                error: function error(err) {
                    changeState(!info.article_id, 'error');
                },
                complete: function complete() {
                    $timeout(function () {
                        changeState(!info.article_id, 'default');
                    }, 1000, true);
                }
            });
        };

        //自评论点击回复按钮
        $scope.commentToComemntBtn = function ($event) {
            var $this = $($event.currentTarget).parents('.comments__ask').next('.comments__reply');
            $('.comments__reply').not($this).removeClass('active');
            $this.toggleClass('active');
        };

        //首次进入判断是否能评论
        $scope.canComment = canComment();
        function canComment() {
            if (!!$localStorage.commentAuth) {
                if ($scope.commentUsername && $scope.commentEmail) {
                    return true;
                } else {
                    $scope.commentInfo.username = $localStorage.commentAuth.commentUsername;
                    $scope.commentInfo.email = $localStorage.commentAuth.commentEmail;
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
                    // console.log('-----response------')
                    // console.log(response)
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
        $scope.isLoaded = false;
        var url = API.newUpdateArticle.replace("from", API.ArticleFrom).replace("to", API.ArticleTo);
        $http.get(url).success(function (response) {
            // console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {}).finally(function () {
            $scope.isLoaded = true;
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
        $scope.isLoaded = false;
        $http.get(API.getArticleHistoryWithStructure).success(function (response) {
            // console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.historyLists = response.data;
            }
        }).error(function (erroInfo, status) {}).finally(function () {
            $scope.isLoaded = true;
        });
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //TagList控制器
    .controller('TagListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $scope.isLoaded = false;
        $http.get(API.getTagsListWithStructure).success(function (response) {
            // console.log("TagListController response");
            // console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.tagLists = response.data;
            }
        }).error(function (erroInfo, status) {}).finally(function () {
            $scope.isLoaded = true;
        });
    }]).controller('findArticlesByTagController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
        var url = API.getArticlesWithTagId.replace('id', $stateParams.id);
        $scope.isLoaded = false;
        $http.get(url).success(function (response) {
            // console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {}).finally(function () {
            $scope.isLoaded = true;
        });;
    }]);
})();
/**
 * Created by xiangsongtao on 16/7/4.
 */
(function () {
    angular.module('xstApp')
    //主页
    .controller('indexController', ['$scope', '$rootScope', '$localStorage', '$state', '$log', '$timeout', '$window', '$location', function ($scope, $rootScope, $localStorage, $state, $log, $timeout, $window, $location) {
        //初始化
        $rootScope.isLogin = false;

        //进入检查是否有token,是否能直接登录
        if (!!$localStorage.authorization) {
            var time = parseInt($localStorage.authorization.time);
            if (new Date().getTime() - time < 1000 * 60 * 60 * 2) {
                //token有效,能进入
                $rootScope.isLogin = true;
            }
        }

        //监听历史记录变化,如果进入受限页面则登录
        $rootScope.$on('$locationChangeStart', function (event, url) {
            // $rootScope.isLogin 判断当前是否登录
            // 如果访问的后台地址,如果未登录则跳转到首页
            // console.log('当前访问路径:' + url)
            // console.log('当前是否登录:' + !$rootScope.isLogin)
            if (url.toString().indexOf('admin') > 0 && !$rootScope.isLogin) {
                $rootScope.relogin();
            }
        });

        $rootScope.relogin = function () {
            $timeout(function () {
                $location.url('/login');
                $localStorage.$reset();
                $rootScope.isLogin = false;
                //开启tooltip
                $rootScope.tooltip();
                console.log('----您还未登陆,请登录!----');
            }, 200, true);
        };

        //退出操作
        $scope.logout = function () {
            angular.element(document.getElementById('logout')).modal();
        };
        $rootScope.confirmLogout = function () {
            $timeout(function () {
                $localStorage.$reset();
                $rootScope.isLogin = false;
                $location.url('/home');
                //开启tooltip
                $rootScope.tooltip();
            }, 200, true);
        };
        $rootScope.tooltip = tooltip;

        tooltip();
        function tooltip() {
            return $timeout(function () {
                var clientWidth = parseInt(document.documentElement.clientWidth);
                if (clientWidth < 768) {} else if (clientWidth < 991 && clientWidth > 768) {
                    $('[data-toggle="tooltip"]').tooltip({
                        trigger: 'hover',
                        placement: 'bottom'
                    });
                    return true;
                } else {
                    $('[data-toggle="tooltip"]').tooltip({
                        trigger: 'hover',
                        placement: 'right'
                    });
                    return true;
                }
            }, 300, true);
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
            cache: true,
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