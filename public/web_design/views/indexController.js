/**
 * Created by xiangsongtao on 16/7/4.
 */
(function () {
    angular.module('xstApp')
    //主页
        .controller('indexController', ['$scope', '$rootScope', '$localStorage', '$state', function ($scope, $rootScope, $localStorage, $state) {
            //初始化
            $rootScope.isLogin = false;

            $rootScope.confirmLogout = function () {
                $localStorage.$reset();
                $rootScope.isLogin = false;
                $state.go('home');
            };

            //    进入检查是否有token,是否能直接登录
            if (!!$localStorage.authorization) {
                let time = parseInt($localStorage.authorization.time);
                if ((new Date().getTime() - time) < 1000 * 60 * 60 * 2) {
                    //token有效,能进入
                    $rootScope.isLogin = true;
                }
            }


        }])
})();