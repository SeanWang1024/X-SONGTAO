/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xSongtaoAdminApp')
  //路由
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider
    //.when("/", "/")
    //.otherwise("");
    $stateProvider
      .state('catalogue', {
        url: "/catalogue",
        templateUrl: './views/catalogue/catalogue.tpl.html',
        controller:'catalogueCtrl'
      })
  }])
  //myInfo的控制器
  .controller('catalogueCtrl', function () {

  });




