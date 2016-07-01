'use strict';
/**
 * Created by xiangsongtao on 16/6/29.
 * 后台路由
 */

(function () {
    angular.module('xstApp')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
            $stateProvider
            /**
             * 修改我的信息 
             * */
                .state('admin', {
                    url: "/admin",
                    templateUrl: 'web/tpl/admin.html'
                })
                .state('admin.myInfo', {
                    url: "/myInfo",
                    controller: 'myInfoCtrl',
                    templateUrl: 'web/tpl/admin.myinfo.tpl.html'
                })
                .state('admin.articleManager', {
                    url: "/articleManager",
                    templateUrl: 'web/tpl/admin.articleManager.tpl.html'
                    // controller: 'paperCtrl'
                })
                


                .state('admin.articleManager.articleList', {
                    url: "/articleList",
                    templateUrl: 'web/tpl/admin.articleList.tpl.html',
                    controller: 'articleListCtrl'
                })
                .state('admin.articleManager.article', {
                    url: "/article",
                    templateUrl: 'web/tpl/admin.article.tpl.html',
                    controller: 'articleCtrl'
                })
                .state('admin.tags', {
                    url: "/tags",
                    templateUrl: 'web/tpl/admin.tags.tpl.html',
                    controller: 'tagsCtrl'
                })


        }])
})();
