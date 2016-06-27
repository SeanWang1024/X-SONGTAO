/**
 * Created by xiangsongtao on 16/2/8.
 */
angular.module('xstApp')

//登陆控制器
    .controller('loginController', ['$scope', '$http', '$api', function ($scope, $http, $api) {
        console.log($api.login);


        $("#login").click(function () {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            var data = {
                username: username,
                password: password
            };
            if (username == '' || password == '') {
                alert("用户名/密码不能为空")
                // alert(username)
                // alert(password)
                return
            }
            $http.post($api.login, data)
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
    //blogPageController控制器
    .controller('blogPageController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getMyInfo).success(function (response) {
            console.log(response);
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
    }])
    //ArticleList控制器
    .controller('ArticleListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        let url = API.newUpdateArticle.replace("from", API.ArticleFrom).replace("to", API.ArticleTo);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {
            // $(".blackShade.error").addClass("show");
            // $(".blackShade.error h3").text("哎呦,好像出错了!");
            // $(".blackShade.error span").html(erroInfo);
            // $(".blackShade.error small").text("状态码:" + status);
        });

    }])
    //HistoryList控制器
    .controller('HistoryListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getArticleHistoryWithStructure).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.historyLists = response.data;
            }
        }).error(function (erroInfo, status) {
        });
    }])
    //TagList控制器
    .controller('TagListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getTagsListWithStructure).success(function (response) {
            console.log("TagListController response");
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.tagLists = response.data;
            }
        }).error(function (erroInfo, status) {
        });
    }])
    //Detail控制器-catalogueName-type-id
    .controller('DetailController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
        var url = API.getArticleById.replace('id', $stateParams.id);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.article = response.data;
                //获取评论
                var url =  API.getArticlesComments.replace('article_id', $scope.article._id);
                $http.get(url).success(function (response) {
                    console.log('-----response------')
                    console.log(response)
                    if (parseInt(response.code) === 1) {
                        $scope.comment = response.data;
                    }
                });
            }
        }).error(function (erroInfo, status) {
        });
    }])

    .controller('findArticlesByTagController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
        let url = API.getArticlesWithTagId.replace('id', $stateParams.id);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {
        });
    }])





