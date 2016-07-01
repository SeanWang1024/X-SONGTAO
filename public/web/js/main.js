'use strict';

(function () {
    angular.module('xstApp', ['ui.router'])
    /**
     * 配置文件
     * */
    .factory('API', function () {
        var url = "http://localhost:8088";
        var MY_INFO_ID = '576b95155fce2dfd3874e738';
        return {
            /**
             * 用户、登录相关
             * */
            MY_INFO_ID: MY_INFO_ID,
            //登录
            login: url + '/api/login',
            //获取我的信息
            getMyInfo: url + '/api/user/' + MY_INFO_ID,
            postMyInfo: url + '/api/user',
            changePassword: url + '/api/change_password',

            /**
             * 文章相关
             * */
            //获取最新的十条文章
            ArticleFrom: "0",
            ArticleTo: "10",
            newUpdateArticle: url + '/api/articles/from_to',
            //由文章id获取文章详情
            getArticleById: url + '/api/article/id',
            //获取文章历史记录
            getArticleHistoryWithStructure: url + '/api/article_history',

            /**
             * 标签相关
             * */
            //获取标签列表(带有结构的)
            getTagsListWithStructure: url + '/api/tags_with_structure',
            //由标签id获取文章列表
            getArticlesWithTagId: url + '/api/article_tag/id',

            /**
             * 获取评论
             * */
            getArticlesComments: url + '/api/article/comments/article_id',
            changeCommentState: url + '/api/changeCommentState'

        };
    });
})();

console.log('你好!你这是在.....想看源码?联系我吧!');
(function () {

    $(".blackShade.error").click(function () {
        $(this).removeClass("show");
    });

    $(document).on("click", ".aboutme", function () {
        event.preventDefault();
        $('.bg-right').scrollTop(0);
        $(".bg-right-imgBox").toggleClass("bg-right-imgBox-showMe");
        $(".bg-right-imgBox").parent().toggleClass("lockScreen");
    });

    // $(document).on("click", ".btn-back", function () {
    //   $(".bg-right-imgBox").toggleClass("bg-right-imgBox-showMe");
    //   $(".bg-right-imgBox").parent().toggleClass("lockScreen");
    // });

    //  激活工具提示js
    if (document.documentElement.clientWidth < 991) {
        //  激活工具提示js
        $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
            trigger: 'hover',
            placement: 'bottom'
        });
    } else {
        $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
            trigger: 'hover',
            placement: 'right'
        });
    }

    // //触发点击图片显示模态框
    // $(document).on("click", ".article-index-body-img", function () {
    //   $("#articleImg").modal();
    // });
    // $('#articleImg').on('show.bs.modal', function (event) {
    //   var button = $(event.relatedTarget);
    //   var title = button.data('title');
    //   var url = button.data('url');
    //   var position = button.data('position');
    //   var time = button.data('time');
    //   var modal = $(this);
    //   modal.find('.article-img').attr("src", url);
    //   modal.find('.article-title').text(title);
    //   modal.find('.article-position').text(position);
    //   modal.find('.article-time').text(time);
    // })

    //微信加好友的模态框
    $(document).on("click", ".fa.fa-weixin", function () {
        $("#socialContact").modal();
    });
    $('#socialContact').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var title = button.data('title');
        var url = button.data('url');
        var modal = $(this);
        modal.find('.socialContact-title').text(title);
        modal.find('.socialContact-img').attr("src", url);
    });
})();

/**
 * Created by xiangsongtao on 16/2/27.
 */
(function () {
    angular.module('xstApp')
    //数据在页面中写入完毕后,执行repeatDone内的方法函数->repeat-done="inlineTableEdit()"
    .directive('repeatDone', function () {
        return {
            link: function link(scope, element, attrs) {
                if (scope.$last) {
                    // 这个判断意味着最后一个 OK
                    scope.$eval(attrs.repeatDone); // 执行绑定的表达式
                }
            }
        };
    });
})();
/**
 * Created by xiangsongtao on 16/6/26.
 */
(function () {
    angular.module('xstApp').factory("timestampToDate", function () {
        return function (timestamp) {
            var timestampInt = parseInt(timestamp);
            if (timestampInt.toString().length === 13) {
                //正确的时间戳
                return new Date(timestampInt);
            } else {
                //错误的时间戳返回现在时间
                return new Date();
            }
        };
    }).filter("toEnMonth", ['timestampToDate', function (timestampToDate) {
        return function (value) {
            // var date = timestampToDate(value);
            // let month = parseInt(value);
            switch (parseInt(value)) {
                case 1:
                    return "Jan";
                    break;
                case 2:
                    return "Feb";
                    break;
                case 3:
                    return "Mar";
                    break;
                case 4:
                    return "Apr";
                    break;
                case 5:
                    return "May";
                    break;
                case 6:
                    return "Jun";
                    break;
                case 7:
                    return "Jul";
                    break;
                case 8:
                    return "Aug";
                    break;
                case 9:
                    return "Sept";
                    break;
                case 10:
                    return "Oct";
                    break;
                case 11:
                    return "Nov";
                    break;
                case 12:
                    return "Dec";
                    break;

            }
        };
    }]);
})();
/**
 * Created by xiangsongtao on 16/2/9.
 */
(function () {
    angular.module('xstApp').filter("toTrusted", ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
})();

/**
 * Created by xiangsongtao on 16/7/1.
 */
(function () {
    angular.module('xstApp')
    //myInfo的控制器
    .factory("AJAX", ['$http', function ($http) {
        //获取Token,只是进行get请求和register、login的post请求是不需要token的。
        //登录会能获得token,如果localstorage中存在token信息,则发送时将token携带。
        //这里只是使用localstorage存放数据,古故$localStorage不使用
        return function (httpParams) {
            var authorization = httpParams.method.toLocaleLowerCase() !== 'get' && !!localStorage.authorization ? localStorage.authorization : null;
            var header = {
                'authorization': "token " + authorization,
                'Content-Type': 'application/json; charset=utf-8'
            };
            var params = {
                method: httpParams.method || "GET",
                data: httpParams.data,
                params: httpParams.params,
                url: httpParams.url,
                cache: httpParams.cache || false,
                timeout: httpParams.timeout || 15000,
                success: httpParams.success || angular.noop(),
                error: httpParams.error || angular.noop(),
                notify: httpParams.notify || angular.noop(),
                complete: httpParams.complete || angular.noop(),
                headers: angular.extend(header, httpParams.headers)
            };
            return $http(params).then(
            //success
            function (response) {
                httpParams.success && httpParams.success(response.data);
            },
            //error
            function (response) {
                httpParams.error && httpParams.error(response);
                // httpParams.error && httpParams.error("系统错误");
            },
            //notify
            function (response) {
                httpParams.notify && httpParams.notify(response);
            }).catch(function (e) {
                httpParams.catch && httpParams.catch(e);
            }).finally(function (value) {
                httpParams.complete && httpParams.complete(value);
            });
        };
    }]);
})();
/**
 * Created by xiangsongtao on 16/7/1.
 */
(function () {
    angular.module('xstApp').factory('$verification', function () {
        return {
            isUsername: function isUsername(e) {
                return (/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(e)
                );
            },
            //是否是手机号码
            isMobile: function isMobile(e) {
                return (/^((13[0-9])|(14[0-9])|(15[0-9])|(18[0-9])|(17[0-9]))\d{8}$/.test(e)
                );
            },
            //是否为 NaN, undefined, null , 0 , '', false
            isEmpty: function isEmpty(value) {
                if (value) {
                    return false;
                }
                return true;
            },
            isNum: function isNum(e) {
                var t = /^\d+$/;
                return t.test(e);
            },

            /**
             * 是否是昵称:  4-30个字符，可由中英文字母、数字、"-"、"_"组成。
             */
            isNickname: function isNickname(str) {
                var e = /^[\u4e00-\u9fa5_a-zA-Z0-9-\s]+$/;
                return e.test(str);
            },
            /**
             * 是否是密码
             * @param i
             * @returns {boolean}
             */
            isPassword: function isPassword(i) {
                if (!!i) {
                    return (/^[a-zA-Z0-9]{3,20}$/.test(i)
                    );
                } else {
                    return false;
                }
            },
            /**
             *
             * @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
             * @param:str ->待验证的参数。
             * @return -> true表示合格的邮箱。
             *
             */
            isEmail: function isEmail(str) {
                /**
                 * @descrition:邮箱规则
                 * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
                 * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
                 * 3.@符号是必填项
                 * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
                 * 5.邮件提供商域可以包含特殊字符-、_、.
                 */
                var e = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                //var e = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;

                return e.test(str);
            }
        };
    });
})();
/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
.controller('articleCtrl', function ($http, $scope, $timeout, response) {
    //页面中数据写入
    $scope.articleLists = response.data.articleLists;

    //页面载入完毕后,激活选中状态
    $scope.initTr = function () {
        $("#table tbody tr").click(function () {
            $(this).toggleClass("active").siblings().removeClass("active");
        });
    };

    /*
     * 数据更新时,查找所有内容,之后自动刷新列表
     * */
    function refreshArticleList() {
        $http.get('/admin/api/article').success(function (response) {
            console.log('article,refreshArticleList');
            console.log(response);
            $scope.articleLists = response.articleLists;
        });
    }

    /*
    * 模态框弹出
    * */
    $('#articleModal').modal({
        //需要点击才能弹出
        show: false,
        //背景变黑但是不弹出来
        backdrop: 'static'
    });

    //文本输入
    var toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment'];
    var editor = new Simditor({
        textarea: $('#articleContent'),
        toolbar: toolbar
    });

    /*
     * 请求后台更新tags的内容并写入,写入完毕后初始化#multTags->多选tags按钮
     * */
    $http.get("api/tags").success(function (res) {
        //console.log(res)
        //数据写入
        $scope.tagLists = res.tagLists;

        /*
         * 初始化多选tags->标签
         * 点击多选的时候判断分类名的情况,如果是lifestyle,则显示他的tags
         * 当分类名变化是,刷新tags的选中状态
         * */
        $timeout(function () {
            $('#multTags').multiselect({
                onDropdownShow: function onDropdownShow(event) {
                    var $catName = $("#catName");
                    //$('#multTags option:selected').each(function () {
                    //    $(this).prop('selected', false);
                    //});
                    //当前的值
                    var value = $catName.val();
                    var selectLi = $(".multiselect-container").find("li");
                    var selectLiLength = $(".multiselect-container").find("li").length;
                    var lifeStyleLength = $('#LifeStyleOptGroup').find("option").length;
                    var frontEndLength = $('#FrontEndOptGroup').find("option").length;
                    if (value == 'FrontEnd') {
                        //上面的是lifeStyle
                        for (var i = 0; lifeStyleLength + 1 > i; i++) {
                            selectLi.eq(i).css("display", "none");
                        }
                        //下面的是front-end
                        for (var i = lifeStyleLength + 1; selectLiLength > i; i++) {
                            selectLi.eq(i).css("display", "block");
                        }
                    } //lifeStyleLength
                    else if (value == 'LifeStyle') {
                            //上面的是lifeStyle
                            for (var i = 0; lifeStyleLength + 1 > i; i++) {
                                selectLi.eq(i).css("display", "block");
                            }
                            //下面的是front-end
                            for (var i = lifeStyleLength + 1; selectLiLength > i; i++) {
                                selectLi.eq(i).css("display", "none");
                            }
                        }
                    //$('#multTags').multiselect('refresh');
                }
            });
            //分类名改变时,刷新下面的标签
            $("#catName").change(function () {
                $('#multTags option:selected').each(function () {
                    $(this).prop('selected', false);
                });
                $('#multTags').multiselect('refresh');
            });
        }, 0, false);
    });

    /*
     * 获得今天的时间
     * 当点击"今天",将今天的日期写入input内
     * */
    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = dateNow.getMonth() + 1;
    var date = dateNow.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    //2016-02-27
    var dateNowFormat = year + "-" + month + "-" + date;
    console.log(dateNowFormat);
    $("#setToday").click(function () {
        $("#time").val(dateNowFormat);
    });

    /*
     * ISO时间转化为input-date能识别的时间 -> 2016-02-28
     * */
    function ISODate2Input(iso) {
        return iso.substr(0, 10);
    }

    /*
     * 数据提取 草稿--发布
     * */
    $(".submit").click(function () {
        //为空判断
        var title = document.getElementById('title').value;
        var time = document.getElementById('time').value;
        if (title == '' || time == '') {
            alert("标题和时间是必填选项");
            return;
        }

        var state;
        //判断是草稿还是发表
        if (this.id == 'publish') {
            state = true;
        } else if (this.id == 'draft') {
            state = false;
        }
        var data = {
            title: title,
            time: time,
            catalogueName: document.getElementById('catName').value,
            articleType: document.getElementById('artType').value,
            tags: $("#multTags").val(),
            state: state,
            content: editor.getValue()
        };

        //判断是"修改"还是"新增"
        var articleId = document.getElementById('articleId').value;
        if (!articleId) {
            //无id值,则是"新增"
            $http.post("admin/api/article/add", data).success(function (res) {
                //alert("新增成功")
                $('#articleModal').modal('hide');
                //刷新articleList
                refreshArticleList();
            });
        } else {
            //有id值,则是"修改"
            $http.post("admin/api/article/" + articleId, data).success(function (res) {
                //alert("修改成功")
                $('#articleModal').modal('hide');
                //刷新articleList
                refreshArticleList();
            });
        }
    });

    /*
     * 修改按钮
     * */
    $("#editArticle").click(function () {
        //清除modal之前的残留
        cleanModal();
        //得到当前点击的row id
        var id = $("#table").find(".active").children().eq(0).text();
        if (!id) {
            alert("修改请先选择");
            return;
        }
        //显示之后将数据写入modal中,只进行当前这次
        $('#articleModal').one('show.bs.modal', function (e) {
            $http.get("admin/api/article/" + id).success(function (res) {
                //console.log('//显示之后将数据写入modal中')
                //console.log(res)
                //数据写入modal中
                document.getElementById('articleId').value = res._id;
                document.getElementById('title').value = res.title;
                //input的输入框需要2016-02-02这样的数据
                document.getElementById('time').value = ISODate2Input(res.time);
                document.getElementById('catName').value = res.catalogueName;
                document.getElementById('artType').value = res.articleType;
                $('#multTags').multiselect('select', res.tags);
                editor.setValue(res.content);
            });
        });
        //显示modal
        $('#articleModal').modal('show');
    });

    /*
     * 添加按钮
     * */
    $("#addArticle").click(function () {
        //清除modal之前的残留
        cleanModal();
        $('#articleModal').modal('show');
    });

    /*
     * 删除按钮
     * */
    $("#deleteArticle").click(function () {
        var id = $("#table").find(".active").children().eq(0).text();
        if (id == '' || id == null) {
            alert("删除前请选择");
            return;
        }
        $http.delete("admin/api/article/" + id).success(function (res) {
            //刷新列表
            refreshArticleList();
        });
    });

    /*
     * modal内容清除
     * */
    function cleanModal() {
        document.getElementById('articleId').value = '';
        document.getElementById('title').value = '';
        document.getElementById('time').value = '';
        document.getElementById('catName').value = 'LifeStyle';
        document.getElementById('artType').value = undefined;
        //清空tag的选项
        $('#multTags option:selected').each(function () {
            $(this).prop('selected', false);
        });
        $('#multTags').multiselect('refresh');
        editor.setValue('');
    }
});

/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
.controller('articleCtrl', function ($http, $scope, $timeout) {
    //页面中数据写入
    // $scope.articleLists = response.data.articleLists;

    //页面载入完毕后,激活选中状态
    $scope.initTr = function () {
        $("#table tbody tr").click(function () {
            $(this).toggleClass("active").siblings().removeClass("active");
        });
    };

    /*
     * 数据更新时,查找所有内容,之后自动刷新列表
     * */
    function refreshArticleList() {
        $http.get('/admin/api/article').success(function (response) {
            console.log('article,refreshArticleList');
            console.log(response);
            $scope.articleLists = response.articleLists;
        });
    }

    /*
    * 模态框弹出
    * */
    $('#articleModal').modal({
        //需要点击才能弹出
        show: false,
        //背景变黑但是不弹出来
        backdrop: 'static'
    });

    //文本输入
    var toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment'];
    var editor = new Simditor({
        textarea: $('#articleContent'),
        toolbar: toolbar
    });

    /*
     * 请求后台更新tags的内容并写入,写入完毕后初始化#multTags->多选tags按钮
     * */
    $http.get("api/tags").success(function (res) {
        //console.log(res)
        //数据写入
        $scope.tagLists = res.tagLists;

        /*
         * 初始化多选tags->标签
         * 点击多选的时候判断分类名的情况,如果是lifestyle,则显示他的tags
         * 当分类名变化是,刷新tags的选中状态
         * */
        $timeout(function () {
            $('#multTags').multiselect({
                onDropdownShow: function onDropdownShow(event) {
                    var $catName = $("#catName");
                    //$('#multTags option:selected').each(function () {
                    //    $(this).prop('selected', false);
                    //});
                    //当前的值
                    var value = $catName.val();
                    var selectLi = $(".multiselect-container").find("li");
                    var selectLiLength = $(".multiselect-container").find("li").length;
                    var lifeStyleLength = $('#LifeStyleOptGroup').find("option").length;
                    var frontEndLength = $('#FrontEndOptGroup').find("option").length;
                    if (value == 'FrontEnd') {
                        //上面的是lifeStyle
                        for (var i = 0; lifeStyleLength + 1 > i; i++) {
                            selectLi.eq(i).css("display", "none");
                        }
                        //下面的是front-end
                        for (var i = lifeStyleLength + 1; selectLiLength > i; i++) {
                            selectLi.eq(i).css("display", "block");
                        }
                    } //lifeStyleLength
                    else if (value == 'LifeStyle') {
                            //上面的是lifeStyle
                            for (var i = 0; lifeStyleLength + 1 > i; i++) {
                                selectLi.eq(i).css("display", "block");
                            }
                            //下面的是front-end
                            for (var i = lifeStyleLength + 1; selectLiLength > i; i++) {
                                selectLi.eq(i).css("display", "none");
                            }
                        }
                    //$('#multTags').multiselect('refresh');
                }
            });
            //分类名改变时,刷新下面的标签
            $("#catName").change(function () {
                $('#multTags option:selected').each(function () {
                    $(this).prop('selected', false);
                });
                $('#multTags').multiselect('refresh');
            });
        }, 0, false);
    });

    /*
     * 获得今天的时间
     * 当点击"今天",将今天的日期写入input内
     * */
    var dateNow = new Date();
    var year = dateNow.getFullYear();
    var month = dateNow.getMonth() + 1;
    var date = dateNow.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    //2016-02-27
    var dateNowFormat = year + "-" + month + "-" + date;
    console.log(dateNowFormat);
    $("#setToday").click(function () {
        $("#time").val(dateNowFormat);
    });

    /*
     * ISO时间转化为input-date能识别的时间 -> 2016-02-28
     * */
    function ISODate2Input(iso) {
        return iso.substr(0, 10);
    }

    /*
     * 数据提取 草稿--发布
     * */
    $(".submit").click(function () {
        //为空判断
        var title = document.getElementById('title').value;
        var time = document.getElementById('time').value;
        if (title == '' || time == '') {
            alert("标题和时间是必填选项");
            return;
        }

        var state;
        //判断是草稿还是发表
        if (this.id == 'publish') {
            state = true;
        } else if (this.id == 'draft') {
            state = false;
        }
        var data = {
            title: title,
            time: time,
            catalogueName: document.getElementById('catName').value,
            articleType: document.getElementById('artType').value,
            tags: $("#multTags").val(),
            state: state,
            content: editor.getValue()
        };

        //判断是"修改"还是"新增"
        var articleId = document.getElementById('articleId').value;
        if (!articleId) {
            //无id值,则是"新增"
            $http.post("admin/api/article/add", data).success(function (res) {
                //alert("新增成功")
                $('#articleModal').modal('hide');
                //刷新articleList
                refreshArticleList();
            });
        } else {
            //有id值,则是"修改"
            $http.post("admin/api/article/" + articleId, data).success(function (res) {
                //alert("修改成功")
                $('#articleModal').modal('hide');
                //刷新articleList
                refreshArticleList();
            });
        }
    });

    /*
     * 修改按钮
     * */
    $("#editArticle").click(function () {
        //清除modal之前的残留
        cleanModal();
        //得到当前点击的row id
        var id = $("#table").find(".active").children().eq(0).text();
        if (!id) {
            alert("修改请先选择");
            return;
        }
        //显示之后将数据写入modal中,只进行当前这次
        $('#articleModal').one('show.bs.modal', function (e) {
            $http.get("admin/api/article/" + id).success(function (res) {
                //console.log('//显示之后将数据写入modal中')
                //console.log(res)
                //数据写入modal中
                document.getElementById('articleId').value = res._id;
                document.getElementById('title').value = res.title;
                //input的输入框需要2016-02-02这样的数据
                document.getElementById('time').value = ISODate2Input(res.time);
                document.getElementById('catName').value = res.catalogueName;
                document.getElementById('artType').value = res.articleType;
                $('#multTags').multiselect('select', res.tags);
                editor.setValue(res.content);
            });
        });
        //显示modal
        $('#articleModal').modal('show');
    });

    /*
     * 添加按钮
     * */
    $("#addArticle").click(function () {
        //清除modal之前的残留
        cleanModal();
        $('#articleModal').modal('show');
    });

    /*
     * 删除按钮
     * */
    $("#deleteArticle").click(function () {
        var id = $("#table").find(".active").children().eq(0).text();
        if (id == '' || id == null) {
            alert("删除前请选择");
            return;
        }
        $http.delete("admin/api/article/" + id).success(function (res) {
            //刷新列表
            refreshArticleList();
        });
    });

    /*
     * modal内容清除
     * */
    function cleanModal() {
        document.getElementById('articleId').value = '';
        document.getElementById('title').value = '';
        document.getElementById('time').value = '';
        document.getElementById('catName').value = 'LifeStyle';
        document.getElementById('artType').value = undefined;
        //清空tag的选项
        $('#multTags option:selected').each(function () {
            $(this).prop('selected', false);
        });
        $('#multTags').multiselect('refresh');
        editor.setValue('');
    }
});

/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp').controller('myInfoCtrl', ['$scope', 'AJAX', 'API', '$log', '$verification', function ($scope, AJAX, API, $log, $verification) {

        //获取我的信息
        AJAX({
            method: 'get',
            url: API.getMyInfo,
            success: function success(response) {
                console.log('AJAX response');
                console.log(response);
                if (parseInt(response.code) === 1) {
                    $scope.myinfo = response.data;
                    console.log($scope.myinfo);
                }
            }
        });

        $("#imgUpload").dropzone({
            url: "admin/api/myinfo/imgupload"
        });

        //监听input元素
        var isChanged = false;
        $scope.$watchGroup(["myinfo.full_name", "myinfo.position", "myinfo.address", "myinfo.motto", "myinfo.personal_state"], function () {
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
                        img_url: $scope.myinfo.img_url
                    },
                    success: function success(response) {
                        if (parseInt(response.code) === 1) {
                            // alert(response.msg)
                            $log.debug(response.msg);
                        } else {
                            $log.error(response.msg);
                        }
                    },
                    complete: function complete() {
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
                    new_password: $scope.myinfo.new_password
                },
                success: function success(response) {
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

/**
 * Created by xiangsongtao on 16/2/22.
 */
angular.module('xstApp')
//myInfo的控制器
.controller('tagsCtrl', function ($scope, $http, response, $timeout) {

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
        $http.get('api/tags').success(function (response) {
            console.log('tagLists,refreshtagLists');
            console.log(response);
            $scope.tagLists = response.tagLists;
        });
    }

    //执行行内修改的函数
    $scope.inlineTableEdit = function () {
        $timeout(function () {
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
        }, 0, false);
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

            return;
        }
        var data = {
            name: tagname,
            catalogueName: $('#catname').val(),
            markClass: $('#markclass').val(),
            state: $('#state').val()
        };
        console.log('data');
        console.log(data);

        var $sendingIcon = $(this).find(".sending");
        $sendingIcon.css("display", "inline-block");
        //发送数据

        $http.post("api/tags/add", data).success(function (res) {

            $sendingIcon.css("display", "none");
            //清空数据
            $('#tagname').val('');
            $('#addTags').modal('hide');

            //数据刷新
            refreshTagsList();
        });

        //success
    });
});

/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
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
        $('[data-toggle="popover"]').popover();
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp');
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //index的文字反动
    .directive("indexWordFadeIn", function () {
        return {
            restirect: 'E',
            replace: true,
            link: function link(scope, element) {
                var headlines = $("#headlines");
                setInterval(function () {
                    if (headlines.find('h1.current').next().length == 0) {
                        headlines.find('h1').first().addClass('current').siblings().removeClass('current');
                    } else {
                        headlines.find('h1.current').next().addClass('current').siblings().removeClass('current');
                    }
                }, 4000);
            }
        };
    });
})();
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
                alert("用户名/密码不能为空");
                return false;
            }
            $http.post(API.login, data).success(function (response) {
                if (parseInt(response.code) === 1) {
                    //login success
                    window.location.href = '/admin/' + response.token;
                } else {
                    //login error
                    alert("用户名/密码错误");
                }
            });
        });
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')

    //Detail控制器-catalogueName-type-id
    .controller('DetailController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
        var url = API.getArticleById.replace('id', $stateParams.id);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.article = response.data;
                //获取评论
                var url = API.getArticlesComments.replace('article_id', $scope.article._id);
                $http.get(url).success(function (response) {
                    console.log('-----response------');
                    console.log(response);
                    if (parseInt(response.code) === 1) {
                        $scope.comment = response.data;
                    }
                });
            }
        }).error(function (erroInfo, status) {});
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //ArticleList控制器
    .controller('ArticleListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        var url = API.newUpdateArticle.replace("from", API.ArticleFrom).replace("to", API.ArticleTo);
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
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //HistoryList控制器
    .controller('HistoryListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getArticleHistoryWithStructure).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.historyLists = response.data;
            }
        }).error(function (erroInfo, status) {});
    }]);
})();
/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //TagList控制器
    .controller('TagListController', ['$scope', '$http', 'API', function ($scope, $http, API) {
        $http.get(API.getTagsListWithStructure).success(function (response) {
            console.log("TagListController response");
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.tagLists = response.data;
            }
        }).error(function (erroInfo, status) {});
    }]).controller('findArticlesByTagController', ['$scope', '$stateParams', '$http', 'API', function ($scope, $stateParams, $http, API) {
        var url = API.getArticlesWithTagId.replace('id', $stateParams.id);
        $http.get(url).success(function (response) {
            console.log(response);
            if (parseInt(response.code) === 1) {
                $scope.articleLists = response.data;
            }
        }).error(function (erroInfo, status) {});
    }]);
})();
'use strict';
/**
 * Created by xiangsongtao on 16/6/29.
 * 后台路由
 */

(function () {
    angular.module('xstApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
        $stateProvider
        /**
         * 修改我的信息 
         * */
        .state('admin', {
            url: "/admin",
            templateUrl: 'web/tpl/admin.html'
        }).state('admin.myInfo', {
            url: "/myInfo",
            controller: 'myInfoCtrl',
            templateUrl: 'web/tpl/admin.myinfo.tpl.html'
        }).state('admin.articleManager', {
            url: "/articleManager",
            templateUrl: 'web/tpl/admin.articleManager.tpl.html'
            // controller: 'paperCtrl'
        }).state('admin.articleManager.articleList', {
            url: "/articleList",
            templateUrl: 'web/tpl/admin.articleList.tpl.html',
            controller: 'articleListCtrl'
        }).state('admin.articleManager.article', {
            url: "/article",
            templateUrl: 'web/tpl/admin.article.tpl.html',
            controller: 'articleCtrl'
        }).state('admin.tags', {
            url: "/tags",
            templateUrl: 'web/tpl/admin.tags.tpl.html',
            controller: 'tagsCtrl'
        });
    }]);
})();

'use strict';
/**
 * Created by xiangsongtao on 16/2/8.
 * Home 路由
 */

(function () {
    angular.module('xstApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("/blog", "/blog/articleList").otherwise("/");

        $stateProvider
        /**
         * 首页
         * */
        .state('home', {
            url: "/",
            templateUrl: 'web/tpl/home.index.html'
        })
        /**
         * 登陆
         * */
        .state('login', {
            url: "/login",
            templateUrl: 'web/tpl/home.login.html',
            controller: 'loginController'
        })
        /**
         * 博客
         * */
        .state('blog', {
            controller: 'blogPageController',
            url: "/blog",
            templateUrl: 'web/tpl/home.blogPage.html'
        }).state('blog.articleList', {
            controller: 'ArticleListController',
            url: "/articleList",
            templateUrl: 'web/tpl/home.blogPage.articleList.html'
        }).state('blog.historyList', {
            controller: 'HistoryListController',
            url: "/historyList",
            templateUrl: 'web/tpl/home.blogPage.historyList.html'
        }).state('blog.tagList', {
            controller: 'TagListController',
            url: "/tagList",
            templateUrl: 'web/tpl/home.blogPage.tagList.html'
        })
        //根据tagid查找文章列表
        .state('blog.findArticlesByTag', {
            params: {
                'id': ''
            },
            controller: 'findArticlesByTagController',
            url: "/articleList/tag/:id",
            templateUrl: 'web/tpl/home.blogPage.articleList.html'
        }).state('blog.detail', {
            params: {
                'id': ''
            },
            url: "/article/:id",
            controller: 'DetailController',
            templateUrl: 'web/tpl/home.blogPage.article.html'
        })
        /**
         * 照片墙
         * */
        .state('blog.picture', {
            controller: 'pictureController',
            url: "/picture",
            templateUrl: 'web/tpl/home.picture.html'
        });
    }]);
})();