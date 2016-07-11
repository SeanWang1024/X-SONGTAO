/**
 * Created by xiangsongtao on 16/7/4.
 */
(function () {
    angular.module('xstApp')
    //主页
        .controller('indexController', ['$scope', '$rootScope', '$localStorage', '$state', '$log', '$timeout', '$window', '$location', function ($scope, $rootScope, $localStorage, $state, $log, $timeout, $window, $location) {
            //初始化
            $rootScope.isLogin = false;

            //进入检查是否有token,是否能直接登录
            if (!!$localStorage.authorization) {
                let time = parseInt($localStorage.authorization.time);
                if ((new Date().getTime() - time) < 1000 * 60 * 60 * 2) {
                    //token有效,能进入
                    $rootScope.isLogin = true;
                }
            }

            //监听历史记录变化,如果进入受限页面则登录
            $rootScope.$on('$locationChangeStart', function (event, url) {
                // $rootScope.isLogin 判断当前是否登录
                // 如果访问的后台地址,如果未登录则跳转到首页
                // console.log('当前访问路径:' + url)
                // console.log('当前是否登录:' + !$rootScope.isLogin)
                if (url.toString().indexOf('admin') > 0 && !$rootScope.isLogin) {
                    $rootScope.relogin();
                }
            });

            $rootScope.relogin = function () {
                $location.url('/login')
                console.log('----您还未登陆,请登录!----');
            };


            //退出操作
            $scope.logout = function () {
                angular.element(document.getElementById('logout')).modal();
            };
            $rootScope.confirmLogout = function () {
                $localStorage.$reset();
                $rootScope.isLogin = false;
                $location.url('/home');
                //开启tooltip
                $rootScope.tooltip();
            };
            $rootScope.tooltip = tooltip;


            tooltip();
            function tooltip() {
                return $timeout(function () {
                    if (document.documentElement.clientWidth < 991) {
                        $('[data-toggle="tooltip"]').tooltip({
                            trigger: 'hover',
                            placement: 'bottom'
                        });
                    } else {
                        $('[data-toggle="tooltip"]').tooltip({
                            trigger: 'hover',
                            placement: 'right'
                        });
                    }
                }, 300, true);

            }
        }])
})();