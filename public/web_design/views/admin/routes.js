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
                .state('myInfo', {
                    url: "/myInfo",
                    controller: 'myInfoCtrl',
                    templateUrl: 'web/tpl/admin.myinfo.html'
                })
                .state('article', {
                    url: "/article",
                    templateUrl: './views/article/article.tpl.html',
                    controller: 'articleCtrl'
                })
                .state('tags', {
                    url: "/tags",
                    templateUrl: './views/tags/tags.tpl.html',
                    controller: 'tagsCtrl'
                })


        }])
})();
