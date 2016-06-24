/**
 * Created by xiangsongtao on 16/2/8.
 */
var prefix = '/web/';
var pagesize = 20;
angular.module('xstApp')
    .config(['$stateProvider', '$urlRouterProvider','$api', function ($stateProvider, $urlRouterProvider,$api) {
        $urlRouterProvider
            .when("/blog", "/blog/articleList")
            .otherwise("/");

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
            })
            .state('blog', {
                resolve: {
                    response: function ($http) {
                        return $http.get('/admin/api/myinfo', {
                            cache: true
                        })
                            .success(function (response) {
                                return response;
                            })
                            .error(function (erroInfo, status) {
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
            })


            .state('blog.articleList', {
                resolve: {
                    response: function ($http) {
                        return $http.get('/api/blog/articles', {
                            cache: true
                        })
                            .success(function (response) {
                                return response;
                            })
                            .error(function (erroInfo, status) {
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
            })
            .state('blog.historyList', {
                resolve: {
                    response: function ($http) {
                        return $http.get('/api/LifeStyle/historys', {
                            cache: true
                        })
                            .success(function (response) {
                                return response;
                            })
                            .error(function (erroInfo, status) {
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
            })
            .state('blog.tagList', {
                resolve: {
                    response: function ($http) {
                        return $http.get('/api/LifeStyle/tags', {
                            cache: true
                        })
                            .success(function (response) {
                                return response;
                            })
                            .error(function (erroInfo, status) {
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
                    response: function ($http, $stateParams) {
                        var catalogueName = $stateParams.catalogueName;
                        var type = $stateParams.type;
                        var id = $stateParams.id;
                        return $http.get('api/' + catalogueName + '/' + type + '/' + id, {
                            cache: true
                        })
                            .success(function (response) {
                                return response;
                            })
                            .error(function (erroInfo, status) {
                                $(".blackShade.error").addClass("show");
                                $(".blackShade.error h3").text("哎呦,好像出错了!");
                                $(".blackShade.error span").html(erroInfo);
                                $(".blackShade.error small").text("状态码:" + status);
                            });
                    }
                },
                controller: 'DetailController',
                templateUrl: function (urlParams) {
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
            })

    }])
