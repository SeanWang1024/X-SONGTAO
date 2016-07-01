/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
        .controller('myInfoCtrl', ['$scope', 'AJAX', 'API', '$log', '$verification', function ($scope, AJAX, API, $log, $verification) {

            //获取我的信息
            AJAX({
                method: 'get',
                url: API.getMyInfo,
                success: function (response) {
                    console.log('AJAX response');
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.myinfo = response.data;
                        console.log($scope.myinfo)
                    }
                }
            });

            $("#imgUpload").dropzone({
                url: "admin/api/myinfo/imgupload"
            });


            //监听input元素
            let isChanged = false;
            $scope.$watchGroup([
                "myinfo.full_name",
                "myinfo.position",
                "myinfo.address", "myinfo.motto",
                "myinfo.personal_state"
            ], function () {
                isChanged = true;
            });
            //保存操作
            $scope.save = function () {
                if (isChanged) {
                    AJAX({
                        method: 'put',
                        url: API.postMyInfo,
                        data: {
                            _id: $scope.myinfo._id,
                            full_name: $scope.myinfo.full_name,
                            position: $scope.myinfo.position,
                            address: $scope.myinfo.address,
                            motto: $scope.myinfo.motto,
                            personal_state: $scope.myinfo.personal_state,
                            img_url: $scope.myinfo.img_url,
                        },
                        success: function (response) {
                            if (parseInt(response.code) === 1) {
                                // alert(response.msg)
                                $log.debug(response.msg);
                            } else {
                                $log.error(response.msg);
                            }
                        },
                        complete: function () {
                            isChanged = false;
                        }
                    });
                }
            };


            //修改登录信息
            $scope.changeAuthorizationInfo = function () {

                if (!$verification.isUsername($scope.myinfo.username)) {
                    alert('用户名无效');
                    return false;
                }
                if (!$verification.isPassword($scope.myinfo.password)) {
                    alert('旧密码无效');
                    return false;
                }
                if (!$verification.isPassword($scope.myinfo.new_password)) {
                    alert('新密码无效');
                    return false;
                }

                AJAX({
                    method: 'post',
                    url: API.changePassword,
                    data: {
                        _id: $scope.myinfo._id,
                        username: $scope.myinfo.username,
                        password: $scope.myinfo.password,
                        new_password: $scope.myinfo.new_password,
                    },
                    success: function (response) {
                        if (parseInt(response.code) === 1) {
                            $log.debug(response.msg);
                        } else {
                            $log.error(response.msg);
                        }
                    }
                });
            };
        }]);
})();


