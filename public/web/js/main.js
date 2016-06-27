'use strict';

(function () {
    angular.module('xstApp', ['ui.router'])
    /**
     * 配置文件
     * */
    .factory('API', function () {
        var url = "http://localhost:8088";
        var MY_INFO_ID = '576b95155fce2dfd3874e738';
        return {
            /**
             * 用户、登录相关
             * */
            MY_INFO_ID: MY_INFO_ID,
            //登录
            login: url + '/api/login',
            //获取我的信息
            getMyInfo: url + '/api/user/' + MY_INFO_ID,

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

            /**
             * 标签相关
             * */
            //获取标签列表(带有结构的)
            getTagsListWithStructure: url + '/api/tags_with_structure',
            //由标签id获取文章列表
            getArticlesWithTagId: url + '/api/article_tag/id',

            /**
             * 获取评论
             * */
            getArticlesComments: url + '/api/article/comments/article_id'

        };
    });
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
    $(document).on("click", ".btn-back", function () {
        $(".bg-right-imgBox").toggleClass("bg-right-imgBox-showMe");
        $(".bg-right-imgBox").parent().toggleClass("lockScreen");
    });

    //  激活工具提示js
    if (document.documentElement.clientWidth < 991) {
        //  激活工具提示js
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

    //触发点击图片显示模态框
    $(document).on("click", ".article-index-body-img", function () {
        $("#articleImg").modal();
    });
    $('#articleImg').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var title = button.data('title');
        var url = button.data('url');
        var position = button.data('position');
        var time = button.data('time');
        var modal = $(this);
        modal.find('.article-img').attr("src", url);
        modal.find('.article-title').text(title);
        modal.find('.article-position').text(position);
        modal.find('.article-time').text(time);
    });

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

'use strict';
/**
 * Created by xiangsongtao on 16/2/8.
 */

// var pagesize = 20;
(function () {
    var prefix = '/web/';
    angular.module('xstApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("/blog", "/blog/articleList").otherwise("/");

        $stateProvider
        //  首页
        .state('home', {
            url: "/",
            templateUrl: prefix + 'tpl/home.index.html'
        })
        //  登陆
        .state('login', {
            url: "/login",
            templateUrl: prefix + 'tpl/home.login.html',
            controller: 'loginController'
        }).state('blog', {
            controller: 'blogPageController',
            url: "/blog",
            templateUrl: prefix + 'tpl/home.blogPage.html'
        }).state('blog.articleList', {
            controller: 'ArticleListController',
            url: "/articleList",
            templateUrl: prefix + 'tpl/home.blogPage.articleList.html'
        }).state('blog.historyList', {
            controller: 'HistoryListController',
            url: "/historyList",
            templateUrl: prefix + 'tpl/home.blogPage.historyList.html'
        }).state('blog.tagList', {
            controller: 'TagListController',
            url: "/tagList",
            templateUrl: prefix + 'tpl/home.blogPage.tagList.html'
        })
        //根据tagid查找文章列表
        .state('blog.findArticlesByTag', {
            params: {
                'id': ''
            },
            controller: 'findArticlesByTagController',
            url: "/articleList/tag/:id",
            templateUrl: prefix + 'tpl/home.blogPage.articleList.html'
        }).state('blog.detail', {
            params: {
                'id': ''
            },
            url: "/article/:id",
            controller: 'DetailController',
            templateUrl: prefix + 'tpl/home.blogPage.article.html'
        });
    }]);
})();

/**
 * Created by xiangsongtao on 16/2/8.
 */
angular.module('xstApp')

//登陆控制器
.controller('loginController', ['$scope', '$http', '$api', function ($scope, $http, $api) {
    console.log($api.login);

    $("#login").click(function () {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        var data = {
            username: username,
            password: password
        };
        if (username == '' || password == '') {
            alert("用户名/密码不能为空");
            // alert(username)
            // alert(password)
            return;
        }
        $http.post($api.login, data).success(function (response) {
            if (parseInt(response.code) === 1) {
                //login success
                window.location.href = '/admin/' + response.token;
            } else {
                //login error
                alert("用户名/密码错误");
            }
        });
    });
}])
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
}])
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
}])
//HistoryList控制器
.controller('HistoryListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
    $http.get(API.getArticleHistoryWithStructure).success(function (response) {
        console.log(response);
        if (parseInt(response.code) === 1) {
            $scope.historyLists = response.data;
        }
    }).error(function (erroInfo, status) {});
}])
//TagList控制器
.controller('TagListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
    $http.get(API.getTagsListWithStructure).success(function (response) {
        console.log("TagListController response");
        console.log(response);
        if (parseInt(response.code) === 1) {
            $scope.tagLists = response.data;
        }
    }).error(function (erroInfo, status) {});
}])
//Detail控制器-catalogueName-type-id
.controller('DetailController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
    var url = API.getArticleById.replace('id', $stateParams.id);
    $http.get(url).success(function (response) {
        console.log(response);
        if (parseInt(response.code) === 1) {
            $scope.article = response.data;
            //获取评论
            var url = API.getArticlesComments.replace('article_id', $scope.article._id);
            $http.get(url).success(function (response) {
                console.log('-----response------');
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.comment = response.data;
                }
            });
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

/**
 * Created by xiangsongtao on 16/2/8.
 */
// angular.module('xstApp')
//   .controller('scrollCtrl', ['$scope', function ($scope) {
//     //大于1200px的时候滑动设置
//     $(".bg-right-contentInner").scroll(function () {
//       var scrollTop = $('.bg-right-contentInner').scrollTop();
//       //console.log($('.bg-right-contentInner').scrollTop());
//       if (scrollTop > 35) {
//         $(".contentNavBox").addClass("contentNavBox-1200-fixed contentNavBox-1200-navShow");
//       }else{
//         $(".contentNavBox").removeClass("contentNavBox-1200-navShow");
//       }
//       //console.log("1200px滑动");
//     });
//     //991-1200之间滑动的设置
//     var tplValue = 0;
//     $(".bg-right").scroll(function () {
//       var navScrollTop = $('.bg-right').scrollTop();
//       //console.log(navScrollTop);
//       //console.log("991-1200滑动");
//       var $contentNavBox = $(".contentNavBox");
//       //contentNavBox-991-1200-navFixed
//       var $contentContentBox = $(".contentContentBox");
//       //contentContentBox-all-navFixed
//       var height = $(".bg-right-imgBox").height();
//       //排除干扰
//       $contentNavBox.removeClass('contentNavBox-l991-navFixed');
//       $contentNavBox.removeClass('contentNavBox-l991-navShow');
//       //导航条消失,并且向上滚动
//       if (navScrollTop > height + 64) {
//         $contentNavBox.addClass('contentNavBox-991-1200-navFixed');
//         $contentContentBox.addClass('contentContentBox-all-navFixed');
//       }
//       //向上滚动,并且让nav向下滚动显示
//       if (navScrollTop > height + 64 && navScrollTop < tplValue) {
//         $contentNavBox.addClass('contentNavBox-991-1200-navShow');
//       }
//       //如果向上滚动,则将nav收起来
//       if (navScrollTop > height + 64 && navScrollTop > tplValue) {
//         $contentNavBox.removeClass('contentNavBox-991-1200-navShow');
//       }
//       //全部显示
//       if (navScrollTop < height) {
//         $contentNavBox.removeClass('contentNavBox-991-1200-navFixed contentNavBox-991-1200-navShow');
//         $contentContentBox.removeClass('contentContentBox-all-navFixed');
//       }
//       tplValue = navScrollTop;
//     });
//     //小于991px的滑动设置
//     $(".bigBox").scroll(function () {
//       //console.log($('.bigBox').scrollTop());
//       //console.log("<991px");
//
//       var navScrollTop = $('.bigBox').scrollTop();
//       //console.log("991-1200滑动");
//       var $contentNavBox = $(".contentNavBox");
//       //contentNavBox-991-1200-navFixed
//       var $contentContentBox = $(".contentContentBox");
//       //contentContentBox-all-navFixed
//       //
//       //console.log($(".bg-right-imgBox").css("display"))
//       if($(".bg-right-imgBox").css("display") == 'none'){
//         var height = 0;
//       }else{
//         var height = $(".bg-right-imgBox").height();
//       }
//
//       //去除干扰
//       $contentNavBox.removeClass('contentNavBox-991-1200-navFixed');
//       $contentNavBox.removeClass('contentNavBox-991-1200-navShow');
//
//       //导航条消失,并且向上滚动
//       if (navScrollTop > height + 64) {
//         $contentNavBox.addClass('contentNavBox-l991-navFixed');
//         $contentContentBox.addClass('contentContentBox-all-navFixed');
//       }
//       //向上滚动,并且让nav向下滚动显示
//       if (navScrollTop > height + 64 && navScrollTop < tplValue) {
//         $contentNavBox.addClass('contentNavBox-l991-navShow');
//       }
//       //如果向上滚动,则将nav收起来
//       if (navScrollTop > height + 64 && navScrollTop > tplValue) {
//         $contentNavBox.removeClass('contentNavBox-l991-navShow');
//       }
//       //全部显示
//       if (navScrollTop == height || navScrollTop < height) {
//         $contentNavBox.removeClass('contentNavBox-l991-navFixed contentNavBox-l991-navShow');
//         $contentContentBox.removeClass('contentContentBox-all-navFixed');
//       }
//       tplValue = navScrollTop;
//     });
//     //窗口resize的时候讲nav改成relative
//     $(window).resize(function () {
//       //console.log("resize")
//       $(".contentNavBox").removeClass('contentNavBox-l991-navFixed contentNavBox-l991-navShow')
//         .removeClass('contentNavBox-991-1200-navFixed contentNavBox-991-1200-navShow')
//         .removeClass('contentNavBox-1200-fixed contentNavBox-1200-navShow');
//       $(".contentContentBox").removeClass('contentContentBox-all-navFixed');
//
//       //  激活工具提示js
//       if(document.documentElement.clientWidth<991){
//         //  激活工具提示js
//         $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
//           trigger: 'hover',
//           placement:'bottom'
//         });
//       }else{
//         $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
//           trigger: 'hover',
//           placement:'right'
//         });
//       }
//     });
//
//     function scrollTopVisually() {
//       var timeCrol = setInterval(function () {
//         $(window).scrollTop($(window).scrollTop() - 100);
//         if ($(window).scrollTop() == 0) {
//           clearInterval(timeCrol);
//         }
//       }, 10);
//
//     }
//   }])
//

/**
 * Created by xiangsongtao on 15/12/24.
 */
angular.module('xstApp')
//进入后,scrollTop滚到0
.directive("scrollTopZero", function () {
    return {
        restirect: 'E',
        replace: true,
        link: function link() {
            $('.bg-right-contentInner').scrollTop(0);
            $('.bg-right').scrollTop(0);
            $('.bigBox').scrollTop(0);
        }
    };
})
//分页按钮
.directive("pageSelect", ["$rootScope", function ($rootScope) {
    return {
        restirect: 'E',
        replace: true,
        link: function link(scope, element) {
            //默认初始的当前页nowPageNum = 1
            $rootScope.nowPageNum = 1;
            //监听当前页数的变化,如果变化,就更新当前页的css
            $rootScope.$watch("nowPageNum", function () {
                //滚到头顶
                $('.bg-right-contentInner').scrollTop(0);
                $('.bg-right').scrollTop(0);
                $('.bigBox').scrollTop(0);
                //更新Pagination>li的样式
                //var $PaginationPageNum = $(".pagination .pageNum");
                var $PaginationPageNum = element.find(".pageNum");
                var length = $PaginationPageNum.length;
                for (var i = 0; length > i; i++) {
                    if (parseInt($PaginationPageNum.eq(i).text()) == parseInt($rootScope.nowPageNum)) {
                        $PaginationPageNum.eq(i).addClass("active").siblings().removeClass("active");
                        return;
                    }
                }
            }, true);
            //下一个
            var $next = element.find(".next");
            $next.click(function () {
                //console.log('.pagination .next');
                if ($rootScope.nowPageNum == $rootScope.pageNum) {
                    return;
                }
                $rootScope.nowPageNum = parseInt($rootScope.nowPageNum) + 1;
                //console.log($rootScope.nowPageNum);
                element.find("li").removeClass("disabled");
                if ($rootScope.nowPageNum == $rootScope.pageNum) {
                    $next.addClass("disabled");
                }
                $rootScope.$apply();
            });
            //  上一个
            var $prev = element.find(".prev");
            $prev.click(function () {
                //console.log('.pagination .prev');
                if ($rootScope.nowPageNum == 1) {
                    return;
                }
                $rootScope.nowPageNum = parseInt($rootScope.nowPageNum) - 1;
                $prev.find("li").removeClass("disabled");
                if ($rootScope.nowPageNum == 1) {
                    $prev.addClass("disabled");
                }
                $rootScope.$apply();
            });
            //  中间数字,动态添加的内容需要绑定到document上
            $(document).on("click", ".pagination .pageNum", function () {
                //console.log('.pagination .pageNum');
                var $this = $(this);
                $rootScope.nowPageNum = parseInt($this.text());
                //判断是否到头顶尾部
                if ($rootScope.nowPageNum == 1) {
                    $(".pagination .prev").addClass("disabled");
                } else {
                    $(".pagination .prev").removeClass("disabled");
                }
                if ($rootScope.nowPageNum == $rootScope.pageNum) {
                    $(".pagination .next").addClass("disabled");
                } else {
                    $(".pagination .next").removeClass("disabled");
                }
                $rootScope.$apply();
            });
        }
    };
}])
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
    }]);
})();
// /**
//  * Created by xiangsongtao on 16/2/9.
//  */
// angular.module('xstApp')
// .filter("pageSelect",['$rootScope', function ($rootScope) {
//   return function (inputArray,pageNow) {
//     var array = [];
//     if(pageNow == null || pageNow == ''){
//       pageNow = 1;
//     }
//     //总共文章数
//     var totalArticlesNum = $rootScope.totalArticlesNum;
//     //每页的文章数
//     var onePageArticlesNum = $rootScope.onePageArticlesNum;
//     for(var i = (pageNow-1)*onePageArticlesNum;onePageArticlesNum*pageNow>i && totalArticlesNum>i;i++){
//       array.push(inputArray[i])
//     }
//     return array;
//   }
// }])

/**
 * Created by xiangsongtao on 16/2/9.
 */
angular.module('xstApp').filter("toTrusted", ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

/**
 * Created by xiangsongtao on 16/2/10.
 */
angular.module('xstApp').service("dataServ", ['$rootScope', function ($rootScope) {
    //var result = {
    //  status:200,
    //  statusText: "OK",
    //  data:{
    //    frontEndBlogIndex:"",
    //    balabalaBlogIndex:"",
    //    articleLists:"",
    //    historyLists:"",
    //    labelLists:""
    //  }
    //}
    //return result;
}]);