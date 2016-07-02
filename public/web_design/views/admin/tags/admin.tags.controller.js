/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
    .controller('tagsCtrl', ['AJAX', 'API', '$scope', '$log', '$timeout', function (AJAX, API, $scope, $log, $timeout) {

        /*
         * 写入页面信息
         */
        getTags();
        function getTags() {
            return AJAX({
                method: 'get',
                url: API.getTagsList,
                success: function (response) {
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.tagLists = response.data;
                        console.log($scope.tagLists);
                    }
                }
            });
        }


        //模态框弹出(新增)
        $scope.addNewTagBtn = function () {
            //init
            $scope.newTag = {
                name: null,
                catalogue_name: null
            };
        };
        $scope.confirmSaveNewTagBtn = function () {
            let data = {
                name: $scope.newTag.name,
                catalogue_name: $scope.newTag.catalogue_name,
            };
            $scope.submitText = '正在提交...';
            AJAX({
                method: 'post',
                url: API.addTag,
                data: data,
                success: function (response) {
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        $log.debug(response.msg);
                        // 刷新列表
                        getTags();
                        //操作提示
                        $scope.submitText = '新增成功!';
                        $timeout(function () {
                            angular.element(document.getElementById('addTag')).modal('hide');
                            $scope.submitText = null;
                        }, 1500, true);
                    } else {
                        //操作提示
                        $scope.submitText = '新增失败, 标签名称已存在!';
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 1500, true);
                        $log.error(response.msg);
                    }
                }
            });
        };

        //模态框弹出(修改)
        $scope.editTagBtn = function (tagInfo) {
            $scope.editTag = {
                _id: tagInfo._id,
                name: tagInfo.name,
                catalogue_name: tagInfo.catalogue_name,
            };
        };
        $scope.confirmEditTagBtn = function () {
            $scope.submitText = '正在提交...';
            AJAX({
                method: 'put',
                url: API.editTag,
                data: $scope.editTag,
                success: function (response) {
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        $log.debug(response.msg);
                        // 刷新列表
                        getTags();
                        //操作提示
                        $scope.submitText = '修改成功!';
                        $timeout(function () {
                            angular.element(document.getElementById('editTag')).modal('hide');
                            $scope.submitText = null;
                        }, 1500, true);
                    } else {
                        //操作提示
                        switch (parseInt(response.code)) {
                            case 2:
                                $scope.submitText = '修改失败, 此标签不存在!';
                                break;
                            case 3:
                                $scope.submitText = '修改失败, 标签名称重复!';
                                break;
                            default:
                                $scope.submitText = '修改失败!';
                                break;
                        }
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 1500, true);
                        $log.error(response.msg);
                    }
                }
            });
        };

        //模态框弹出(删除)
        $scope.delTagBtn = function (id) {
            $scope.delTag = {
                _id: id
            };
        };
        $scope.confirmDelTagBtn = function () {
            $scope.submitText = '正在删除...';
            AJAX({
                method: 'delete',
                url: API.deleteTag.replace('id', $scope.delTag._id),
                success: function (response) {
                    // console.log(response);
                    if (parseInt(response.code) === 1) {
                        $log.debug(response.msg);
                        // 刷新列表
                        getTags();
                        //操作提示
                        $scope.submitText = '删除成功!';
                        $timeout(function () {
                            angular.element(document.getElementById('delTag')).modal('hide');
                            $scope.submitText = null;
                        }, 1500, true);
                    } else {
                        //操作提示
                        $scope.submitText = '删除失败!';
                        $timeout(function () {
                            $scope.submitText = null;
                        }, 1500, true);
                        $log.error(response.msg);
                    }
                }
            });
        }






    }]);




