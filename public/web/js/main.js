'use strict';

angular.module('xstApp', [
//'ngAnimate',
'ui.router']);

'use strict';

angular.module('xstApp').factory("$api", [function () {
    var url = "http://localhost:8088";
    return {
        getUserInfo: url + '/api/user_info'
    };
}]);

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

/**
 * Created by xiangsongtao on 16/2/8.
 */
var prefix = '/web/';
var pagesize = 20;
angular.module('xstApp').config(['$stateProvider', '$urlRouterProvider', '$api', function ($stateProvider, $urlRouterProvider, $api) {
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
        resolve: {
            response: function response($http) {
                return $http.get('/admin/api/myinfo', {
                    cache: true
                }).success(function (response) {
                    return response;
                }).error(function (erroInfo, status) {
                    $(".blackShade.error").addClass("show");
                    $(".blackShade.error h3").text("哎呦,好像出错了!");
                    $(".blackShade.error span").html(erroInfo);
                    $(".blackShade.error small").text("状态码:" + status);
                });
            }
        },
        controller: 'blogPageController',
        url: "/blog",
        templateUrl: prefix + 'tpl/home.blogPage.html'
    }).state('blog.articleList', {
        resolve: {
            response: function response($http) {
                return $http.get('/api/blog/articles', {
                    cache: true
                }).success(function (response) {
                    return response;
                }).error(function (erroInfo, status) {
                    $(".blackShade.error").addClass("show");
                    $(".blackShade.error h3").text("哎呦,好像出错了!");
                    $(".blackShade.error span").html(erroInfo);
                    $(".blackShade.error small").text("状态码:" + status);
                });
            }
        },
        controller: 'ArticleListController',
        url: "/articleList",
        templateUrl: prefix + 'tpl/home.blogPage.articleList.html'
    }).state('blog.historyList', {
        resolve: {
            response: function response($http) {
                return $http.get('/api/LifeStyle/historys', {
                    cache: true
                }).success(function (response) {
                    return response;
                }).error(function (erroInfo, status) {
                    $(".blackShade.error").addClass("show");
                    $(".blackShade.error h3").text("哎呦,好像出错了!");
                    $(".blackShade.error span").html(erroInfo);
                    $(".blackShade.error small").text("状态码:" + status);
                });
            }
        },
        controller: 'HistoryListController',
        url: "/historyList",
        templateUrl: prefix + 'tpl/home.blogPage.historyList.html'
    }).state('blog.tagList', {
        resolve: {
            response: function response($http) {
                return $http.get('/api/LifeStyle/tags', {
                    cache: true
                }).success(function (response) {
                    return response;
                }).error(function (erroInfo, status) {
                    $(".blackShade.error").addClass("show");
                    $(".blackShade.error h3").text("哎呦,好像出错了!");
                    $(".blackShade.error span").html(erroInfo);
                    $(".blackShade.error small").text("状态码:" + status);
                });
            }
        },
        //controller:'',
        controller: 'TagListController',
        url: "/tagList",
        templateUrl: prefix + 'tpl/home.blogPage.tagList.html'
    })
    // .state('blog',{
    //
    // })

    //技术博客
    //
    // .state('blog.FrontEnd-articleList', {
    //     resolve: {
    //         response: function ($http) {
    //             return $http.get('/api/FrontEnd/articles', {
    //                 cache: true
    //             })
    //                 .success(function (response) {
    //                     return response;
    //                 })
    //                 .error(function (erroInfo, status) {
    //                     $(".blackShade.error").addClass("show");
    //                     $(".blackShade.error h3").text("哎呦,好像出错了!");
    //                     $(".blackShade.error span").html(erroInfo);
    //                     $(".blackShade.error small").text("状态码:" + status);
    //                 });
    //         }
    //     },
    //     controller: 'ArticleListController',
    //     url: "/frontEndArticleList",
    //     templateUrl: prefix + 'tpl/home.blogPage.articleList.html'
    // })
    // .state('blog.FrontEnd-historyList', {
    //     resolve: {
    //         response: function ($http) {
    //             return $http.get('/api/FrontEnd/historys', {
    //                 cache: true
    //             })
    //                 .success(function (response) {
    //                     return response;
    //                 })
    //                 .error(function (erroInfo, status) {
    //                     $(".blackShade.error").addClass("show");
    //                     $(".blackShade.error h3").text("哎呦,好像出错了!");
    //                     $(".blackShade.error span").html(erroInfo);
    //                     $(".blackShade.error small").text("状态码:" + status);
    //                 });
    //         }
    //     },
    //     controller: 'HistoryListController',
    //     url: "/frontEndHistoryList",
    //     templateUrl: prefix + 'tpl/home.blogPage.historyList.html'
    // })
    // .state('blog.FrontEnd-tagList', {
    //     resolve: {
    //         response: function ($http) {
    //             return $http.get('/api/FrontEnd/tags', {
    //                 cache: true
    //             })
    //                 .success(function (response) {
    //
    //                     return response;
    //                 })
    //                 .error(function (erroInfo, status) {
    //                     $(".blackShade.error").addClass("show");
    //                     $(".blackShade.error h3").text("哎呦,好像出错了!");
    //                     $(".blackShade.error span").html(erroInfo);
    //                     $(".blackShade.error small").text("状态码:" + status);
    //                 });
    //         }
    //     },
    //     //controller:'',
    //     controller: 'TagListController',
    //     url: "/frontEndTagList",
    //     templateUrl: prefix + 'tpl/home.blogPage.tagList.html'
    // })
    //详细内容页,公用模板
    .state('detail', {
        params: {
            'catalogueName': '',
            'type': '',
            'id': ''
        },
        url: "/:catalogueName/:type/:id",
        resolve: {
            response: function response($http, $stateParams) {
                var catalogueName = $stateParams.catalogueName;
                var type = $stateParams.type;
                var id = $stateParams.id;
                return $http.get('api/' + catalogueName + '/' + type + '/' + id, {
                    cache: true
                }).success(function (response) {
                    return response;
                }).error(function (erroInfo, status) {
                    $(".blackShade.error").addClass("show");
                    $(".blackShade.error h3").text("哎呦,好像出错了!");
                    $(".blackShade.error span").html(erroInfo);
                    $(".blackShade.error small").text("状态码:" + status);
                });
            }
        },
        controller: 'DetailController',
        templateUrl: function templateUrl(urlParams) {
            switch (urlParams.type) {
                case 'article':
                    return prefix + 'tpl/home.blogPage.article.html';
                    break;
                case 'tag':
                    return prefix + 'tpl/home.blogPage.tag.html';
                    break;
                default:
                    alert("404");
            }
        }
    });
}]);

/**
 * Created by xiangsongtao on 16/2/8.
 */
angular.module('xstApp')

//登陆控制器
.controller('loginController', ['$scope', '$http', function ($scope, $http) {
    $("#login").click(function () {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        var data = {
            username: username,
            password: password
        };
        if (username == '' || password == '') {
            alert("用户名/密码不能为空");
            alert(username);
            alert(password);
            return;
        }
        $http.post('/dologin', data).success(function (response) {
            if (response) {
                window.location.href = "/admin";
            }
        });
    });
}])
//LifeStyleBlog控制器
.controller('LifeStyleController', ['$scope', 'response', function ($scope, response) {
    $scope.myInfo = response.data.myInfo;
    $scope.blogPage = response.data.LifeStyleIndex;
    //背景图片的替换函数
    $scope.getBackgroundStyle = function (imagepath) {
        return {
            'background-image': 'url(' + imagepath + ')'
        };
    };

    $('[data-toggle="popover"]').popover({
        //trigger: 'focus'
    });
}])
//FrontEndBlog控制器
.controller('blogPageController', ['$scope', 'response', function ($scope, response) {
    $scope.myInfo = response.data.myInfo;
    $scope.blogPage = response.data.FrontEndIndex;
    //背景图片的替换函数
    $scope.getBackgroundStyle = function (imagepath) {
        return {
            'background-image': 'url(' + imagepath + ')'
        };
    };

    $('[data-toggle="popover"]').popover({
        //trigger: 'focus'
    });
}])
//ArticleList控制器
.controller('ArticleListController', ['$scope', '$http', 'response', '$rootScope', function ($scope, $http, response, $rootScope) {
    console.log(response);
    $scope.articleLists = response.data.articleLists;
    //总共文章数
    var totalArticlesNum = response.data.articleLists.length;
    $rootScope.totalArticlesNum = totalArticlesNum;
    //每页多少
    var onePageArticlesNum = pagesize;
    $rootScope.onePageArticlesNum = onePageArticlesNum;
    //分几页
    var pageNum = parseInt(totalArticlesNum / onePageArticlesNum);
    $rootScope.pageNum = pageNum;
    //存放分页数量的数组,用于ng-repeat
    var pagePagination = [];
    for (var i = 0; pageNum > i; i++) {
        pagePagination.push(i + 1);
    }
    $scope.pagePagination = pagePagination;
}])
//HistoryList控制器
.controller('HistoryListController', ['$scope', 'response', function ($scope, response) {
    $scope.historyLists = response.data;
}])
//TagList控制器
.controller('TagListController', ['$scope', 'response', function ($scope, response) {
    $scope.tagLists = response.data;
}])
//Detail控制器-catalogueName-type-id
.controller('DetailController', ['$scope', 'response', function ($scope, response) {
    $scope.detail = response.data;
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

/**
 * Created by xiangsongtao on 16/2/9.
 */
angular.module('xstApp').filter("pageSelect", ['$rootScope', function ($rootScope) {
    return function (inputArray, pageNow) {
        var array = [];
        if (pageNow == null || pageNow == '') {
            pageNow = 1;
        }
        //总共文章数
        var totalArticlesNum = $rootScope.totalArticlesNum;
        //每页的文章数
        var onePageArticlesNum = $rootScope.onePageArticlesNum;
        for (var i = (pageNow - 1) * onePageArticlesNum; onePageArticlesNum * pageNow > i && totalArticlesNum > i; i++) {
            array.push(inputArray[i]);
        }
        return array;
    };
}]);

/**
 * Created by xiangsongtao on 16/2/9.
 */
angular.module('xstApp').filter("toTrusted", ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

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