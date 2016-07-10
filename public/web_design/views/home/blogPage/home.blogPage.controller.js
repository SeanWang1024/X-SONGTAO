/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //blogPageController控制器
        .controller('blogPageController', ['$scope', '$http', 'API', function ($scope, $http, API) {
            $http.get(API.getMyInfo).success(function (response) {
                // console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.myInfo = response.data;
                }
   

            }).error(function (erroInfo, status) {
                // $(".blackShade.error").addClass("show");
                // $(".blackShade.error h3").text("哎呦,好像出错了!");
                // $(".blackShade.error span").html(erroInfo);
                // $(".blackShade.error small").text("状态码:" + status);
            });
            $('[data-toggle="popover"]').popover()


            // $('#socialContact').on('show.bs.modal', function (event) {
            //     var button = $(event.relatedTarget);
            //     var title = button.data('title');
            //     var url = button.data('url');
            //     var modal = $(this);
            //     modal.find('.socialContact-title').text(title);
            //     modal.find('.socialContact-img').attr("src", url);
            // })

            // $scope.showBox=function (title,src) {
            //     $scope.modalInfo = {
            //         src:src
            //     };
            // }





            
        }])
})();