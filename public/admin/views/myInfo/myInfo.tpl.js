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
            .state('myInfo', {
                params: {
                    id: ''
                },
                url: "/myInfo",
                resolve: {
                    response: function ($http) {
                        //var id = $stateParams.id;
                        return $http.get('/admin/api/myinfo/', {
                                cache: false
                            })
                            .success(function (response) {
                                console.log('我的信息返回 结果:');
                                console.log(response);
                                return response;
                            });
                    }
                },
                controller: 'myInfoCtrl',
                templateUrl: './views/myInfo/myInfo.tpl.html'
            })
    }])
    //myInfo的控制器
    .controller('myInfoCtrl', function ($scope, response, $http) {
        if(!response.data.myInfo.personalStateHTML){
            response.data.myInfo.personalStateHTML = '';
        }
        //页面中数据写入
        $scope.myinfo = response.data.myInfo;
        //文本输入
        var toolbar = ['bold', 'italic', 'underline', 'color', '|', 'ol', 'ul', '|', 'indent', 'outdent', 'alignment'];
        var editor = new Simditor({
            textarea: $('#editor'),
            toolbar: toolbar
            //optional options
        });

        //文本数据写入
        editor.setValue(response.data.myInfo.personalStateHTML);

        //初始化图片上传插件
        $("#imgUpload").dropzone({
            url: "admin/api/myinfo/imgupload"
        });

        //点击显示input内容进行修改
        $(".inputContentStatic").click(function () {
            var $this = $(this);
            $this.css("display", "none").siblings(".inputContent").css("display", "block").focus();
            $this.siblings(".form-control-feedback").addClass("hidden");
        })
        $(".inputContent").blur(function () {
            var $this = $(this);
            var value = $this.css("display", "none").val();
            $this.siblings(".inputContentStatic").text(value).css("display", "block");
            $this.siblings(".form-control-feedback").removeClass("hidden")
            //alert()
        })

        //提交表单
        $("#confirmSubmit").click(function () {
            var data = {
                name: $("#name").val(),
                position: $("#position").val(),
                address: $("#address").val(),
                mood: $("#mood").val(),
                personalStateHTML: editor.getValue()
            };

            //发送前,icon显示
            var $this = $(this);
            var $sendingIcon = $this.find(".sending");
            $sendingIcon.css("display", "inline-block");
            $http.post("/admin/api/myinfo", data)
                .success(function (res) {
                    console.log("-----")
                    console.log(res);
                    //发送成功
                    $(".form-control-feedback").addClass("hidden")
                    $sendingIcon.css("display", "none");
                    //显示对勾
                    $this.find(".sended").css("display", "inline-block");
                    //对消失勾
                    setTimeout(function () {
                        $this.find(".sended").css("display", "none");
                    }, 1000);
                });
        })
    });




