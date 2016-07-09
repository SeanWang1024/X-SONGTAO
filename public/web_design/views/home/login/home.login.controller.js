/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //登陆控制器
        .controller('loginController', ['$scope', 'AJAX', 'API', '$localStorage', '$rootScope', '$state', function ($scope, AJAX, API, $localStorage, $rootScope, $state) {
            if ($rootScope.isLogin) {
                $state.go('home');
            } else {
                $scope.data = {
                    username: '',
                    password: ''
                };
                $scope.loginBtn = function () {
                    if (!$scope.data.username) {
                        $scope.errText = "请输入用户名!";
                        // alert('请输入用户名');
                        return
                    }
                    if (!$scope.data.password) {
                        $scope.errText = "请输入密码!";
                        // alert('请输入用户名');
                        return
                    }
                    AJAX({
                        method: 'post',
                        url: API.login,
                        data: $scope.data,
                        success: function (response) {
                            if (parseInt(response.code) === 1) {
                                //权限信息
                                $localStorage.authorization = {
                                    token: response.token,
                                    time: new Date().getTime()
                                };
                                //我进行评论的信息
                                $localStorage.commentAuth = {
                                    "commentUsername": API.MY,
                                    "commentEmail": API.EMAIL
                                };
                                $rootScope.isLogin = true;
                                $state.go('home');
                            } else {
                                switch (parseInt(response.code)) {
                                    case 2:
                                        $scope.errText = "用户名或密码错误,请再检查!";
                                        break;
                                    default:
                                        $scope.errText = "系统错误!";
                                        break;
                                }
                            }
                        },
                        error: function () {
                            $scope.errText = "系统错误!";
                            // alert("系统错误!");
                        }
                    });
                };

                document.onkeydown=function(event){
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if(e && e.keyCode==13){ // enter 键
                        //要做的事情
                        $scope.loginBtn();
                    }
                };
            }
        }])
})();