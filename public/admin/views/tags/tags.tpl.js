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
            .state('tags', {
                url: "/tags",
                resolve: {
                    response: function ($http) {
                        return $http.get('api/tags', {
                                cache: false
                            })
                            .success(function (response) {
                                console.log('tags查找所有response');
                                console.log(response);
                                return response;
                            });
                    }
                },
                templateUrl: './views/tags/tags.tpl.html',
                controller: 'tagsCtrl'
            })
    }])
    //myInfo的控制器
    .controller('tagsCtrl', function ($scope, $http,response,$timeout) {

        /*
         * 写入页面信息
         */
        $scope.tagLists = response.data.tagLists;
        //console.log('response.data');
        //console.log(response.data);


        /*
         * 数据更新时,查找所有内容,之后自动刷新列表
         * */
        function refreshTagsList() {
            $http.get('api/tags')
                .success(function (response) {
                    console.log('tagLists,refreshtagLists');
                    console.log(response);
                    $scope.tagLists = response.tagLists;
                });
        }


        //执行行内修改的函数
        $scope.inlineTableEdit= function () {
            $timeout(function(){
                $('#table').Tabledit({
                    url: 'api/tags/edit',
                    deleteButton: false,
                    saveButton: false,
                    buttons: {
                        edit: {
                            class: 'btn btn-sm btn-default',
                            html: '<span class="glyphicon glyphicon-pencil"></span>',
                            action: 'edit'
                        }
                    },
                    columns: {
                        identifier: [0, 'id'],
                        editable: [[1, 'name'], [3, 'markClass', '{"0":"normal","1":"big","2":"huge"}'], [5, 'state', '{"true":"启用","false":"禁用"}']]
                    }
                });
            },0,false);
        };

        //模态框弹出
        $('#addTags').modal({
            //需要点击才能弹出
            show: false,
            //背景变黑但是点击不消失
            backdrop: 'static'
        });

        //保存按钮
        $("#saveTags").click(function () {
            var $tagname = $('#tagname');
            var tagname = $tagname.val();
            if (tagname == '' || tagname == null) {
                $tagname.focus();
                //has-error
                $tagname.parent().addClass('has-error');
                $tagname.click(function () {
                    $tagname.parent().removeClass('has-error');
                });
                $tagname.keydown(function () {
                    $tagname.parent().removeClass('has-error');
                });

                return
            }
            var data = {
                name: tagname,
                catalogueName: $('#catname').val(),
                markClass: $('#markclass').val(),
                state: $('#state').val()
            }
            console.log('data')
            console.log(data)


            var $sendingIcon = $(this).find(".sending");
            $sendingIcon.css("display", "inline-block");
            //发送数据

            $http.post("api/tags/add", data)
                .success(function (res) {

                    $sendingIcon.css("display", "none");
                    //清空数据
                    $('#tagname').val('')
                    $('#addTags').modal('hide');

                    //数据刷新
                    refreshTagsList();
                });


            //success

        })
    });




