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
            $http.get('/admin/api/article')
                .success(function (response) {
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
        $http.get("api/tags")
            .success(function (res) {
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
                        onDropdownShow: function (event) {
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
                            }//lifeStyleLength
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
        if(date<10){
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
            if(title == '' || time == ''){
                alert("标题和时间是必填选项");
                return
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
                $http.post("admin/api/article/add", data)
                    .success(function (res) {
                        //alert("新增成功")
                        $('#articleModal').modal('hide')
                        //刷新articleList
                        refreshArticleList();
                    });
            } else {
                //有id值,则是"修改"
                $http.post("admin/api/article/" + articleId, data)
                    .success(function (res) {
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
                return
            }
            //显示之后将数据写入modal中,只进行当前这次
            $('#articleModal').one('show.bs.modal', function (e) {
                $http.get("admin/api/article/" + id)
                    .success(function (res) {
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
            })
            //显示modal
            $('#articleModal').modal('show');
        })

        /*
         * 添加按钮
         * */
        $("#addArticle").click(function () {
            //清除modal之前的残留
            cleanModal();
            $('#articleModal').modal('show')
        });

        /*
         * 删除按钮
         * */
        $("#deleteArticle").click(function () {
            var id = $("#table").find(".active").children().eq(0).text();
            if (id == '' || id == null) {
                alert("删除前请选择");
                return
            }
            $http.delete("admin/api/article/" + id)
                .success(function (res) {
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




