'use strict';
/**
 * Created by xiangsongtao on 16/2/8.
 * Home 路由
 */

(function () {
    angular.module('xstApp')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/blog", "/blog/articleList").otherwise("/");
            $stateProvider
            /**
             * 首页
             * */
                .state('home', {
                    url: "/",
                    templateUrl: 'web/tpl/home.index.html',
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
                })
                .state('blog.articleList', {
                    controller: 'ArticleListController',
                    url: "/articleList",
                    templateUrl: 'web/tpl/home.blogPage.articleList.html'
                })
                .state('blog.historyList', {
                    controller: 'HistoryListController',
                    url: "/historyList",
                    templateUrl: 'web/tpl/home.blogPage.historyList.html'
                })
                .state('blog.tagList', {
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
                })
                .state('blog.detail', {
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
                })


        }])
})();
