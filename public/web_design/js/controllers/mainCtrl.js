/**
 * Created by xiangsongtao on 16/2/8.
 */
angular.module('xstApp')

    //登陆控制器
    .controller('loginController', ['$scope', '$http', function ($scope, $http) {
        $("#login").click(function () {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            var data = {
                username: username,
                password: password
            }
            if (username == '' || password == '') {
                alert("用户名/密码不能为空")
                alert(username)
                alert(password)
                return
            }
            $http.post('/dologin', data)
                .success(function (response) {
                    if (response) {
                        window.location.href = "/admin"
                    }
                });
        })
    }])
    //LifeStyleBlog控制器
    .controller('LifeStyleController', ['$scope', 'response', function ($scope, response) {
        $scope.myInfo = response.data.myInfo;
        $scope.blogPage = response.data.LifeStyleIndex;
        //背景图片的替换函数
        $scope.getBackgroundStyle = function (imagepath) {
            return {
                'background-image': 'url(' + imagepath + ')'
            }
        };

        $('[data-toggle="popover"]').popover({
            //trigger: 'focus'
        })
    }])
    //FrontEndBlog控制器
    .controller('blogPageController', ['$scope', 'response', function ($scope, response) {
        $scope.myInfo = response.data.myInfo;
        $scope.blogPage = response.data.FrontEndIndex;
        //背景图片的替换函数
        $scope.getBackgroundStyle = function (imagepath) {
            return {
                'background-image': 'url(' + imagepath + ')'
            }
        };

        $('[data-toggle="popover"]').popover({
            //trigger: 'focus'
        })
    }])
    //ArticleList控制器
    .controller('ArticleListController', ['$scope', '$http','response','$rootScope', function ($scope, $http,response,$rootScope) {
        console.log(response)
        $scope.articleLists = response.data.articleLists;
        //总共文章数
        var totalArticlesNum = response.data.articleLists.length;
        $rootScope.totalArticlesNum = totalArticlesNum;
        //每页多少
        var onePageArticlesNum = pagesize;
        $rootScope.onePageArticlesNum = onePageArticlesNum;
        //分几页
        var pageNum = parseInt(totalArticlesNum / onePageArticlesNum);
        $rootScope.pageNum = pageNum;
        //存放分页数量的数组,用于ng-repeat
        var pagePagination = [];
        for (var i = 0; pageNum > i; i++) {
            pagePagination.push(i + 1);
        }
        $scope.pagePagination = pagePagination;

    }])
    //HistoryList控制器
    .controller('HistoryListController', ['$scope','response', function ($scope,response) {
        $scope.historyLists = response.data;
    }])
    //TagList控制器
    .controller('TagListController', ['$scope','response', function ($scope,response) {
        $scope.tagLists = response.data;
    }])
    //Detail控制器-catalogueName-type-id
    .controller('DetailController', ['$scope','response', function ($scope,response) {
        $scope.detail = response.data;
    }])





