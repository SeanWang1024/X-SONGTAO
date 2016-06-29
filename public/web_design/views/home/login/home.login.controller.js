/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //登陆控制器
        .controller('loginController', ['$scope', '$http', 'API', function ($scope, $http, API) {
            console.log(API.login);


            $("#login").click(function () {
                var username = document.getElementById("username").value;
                var password = document.getElementById("password").value;

                var data = {
                    username: username,
                    password: password
                };
                if (username == '' || password == '') {
                    alert("用户名/密码不能为空")
                    return false;
                }
                $http.post(API.login, data)
                    .success(function (response) {
                        if (parseInt(response.code) === 1) {
                            //login success
                            window.location.href = `/admin/${response.token}`
                        } else {
                            //login error
                            alert("用户名/密码错误")
                        }
                    });
            })
        }])
})();