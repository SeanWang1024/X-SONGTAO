/**
 * Created by xiangsongtao on 16/2/22.
 */
'use strict';
angular.module('xSongtaoAdminApp')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
    .when("/", "/myInfo")
    .otherwise("/myInfo");
  }]);
