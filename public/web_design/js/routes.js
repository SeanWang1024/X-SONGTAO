'use strict';
/**
 * Created by xiangsongtao on 16/2/8.
 */

// var pagesize = 20;
(function () {
    const prefix = '/web/';
    angular.module('xstApp')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
                    controller: 'blogPageController',
                    url: "/blog",
                    templateUrl: prefix + 'tpl/home.blogPage.html'
                })
                .state('blog.articleList', {
                    controller: 'ArticleListController',
                    url: "/articleList",
                    templateUrl: prefix + 'tpl/home.blogPage.articleList.html'
                })
                .state('blog.historyList', {
                    controller: 'HistoryListController',
                    url: "/historyList",
                    templateUrl: prefix + 'tpl/home.blogPage.historyList.html'
                })
                .state('blog.tagList', {
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
                })
                .state('blog.detail', {
                    params: {
                        'id': ''
                    },
                    url: "/article/:id",
                    controller: 'DetailController',
                    templateUrl: prefix + 'tpl/home.blogPage.article.html'
                })
        }])
})();
