/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
    .controller('commentCtrl', ['AJAX', 'API', '$scope', '$log', '$timeout', function (AJAX, API, $scope, $log, $timeout) {

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



        //进行评论
        $scope.isReply = false;
        $scope.isSubmitReply = false;
        $scope.commentThis = function () {
            $scope.isSubmitReply = true;

            //进行评论的逻辑处理


            $timeout(function () {
                $scope.isSubmitReply = false;
                $scope.isReply = false;
            },1000,true)

        }
        
    //    删除评论
        let delCommId;
        $scope.delbtn = function (id) {
            delCommId = id;

        };
        $scope.confirmDelCommBtn = function () {
            console.log('delete:'+delCommId)
        }


    }]);




