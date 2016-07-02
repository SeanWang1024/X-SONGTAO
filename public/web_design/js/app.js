'use strict';

(function () {
    angular.module('xstApp', ['ui.router', 'hc.marked'])
    /**
     * 配置文件
     * */
        .factory('API', function () {
            const url = "http://localhost:8088";
            const MY_INFO_ID = '576b95155fce2dfd3874e738';
            return {
                /**
                 * 用户、登录相关
                 * */
                MY_INFO_ID: MY_INFO_ID,
                //登录
                login: `${url}/api/login`,
                //获取我的信息
                getMyInfo: `${url}/api/user/${MY_INFO_ID}`,
                getMyInfoWithOriginal: `${url}/api/user/original/${MY_INFO_ID}`,
                postMyInfo: `${url}/api/user`,
                changePassword: `${url}/api/change_password`,
                imgUpload: `${url}/api/imgupload`,
                imgResource: `${url}/uploads/`,

                /**
                 * 文章相关
                 * */
                //获取最新的十条文章
                ArticleFrom: "0",
                ArticleTo: "10",
                newUpdateArticle: `${url}/api/articles/from_to`,
                //由文章id获取文章详情
                getArticleById: `${url}/api/article/id`,
                //获取文章历史记录
                getArticleHistoryWithStructure: `${url}/api/article_history`,

                //获取文章列表
                getArticleList: `${url}/api/articles`,

                //由文章id获取文章详情(原始markdown版本)
                getRawArticleById: `${url}/api/article/raw/id`,

                /**
                 * 标签相关
                 * */
                //获取标签列表(带有结构的)
                getTagsListWithStructure: `${url}/api/tags_with_structure`,
                //由标签id获取文章列表
                getArticlesWithTagId: `${url}/api/article_tag/id`,

                //获取标签列表(原始)
                getTagsList: `${url}/api/tags`,
                //增加 post
                addTag: `${url}/api/tag`,
                //修改 put
                editTag: `${url}/api/tag`,
                //删除 delete
                deleteTag: `${url}/api/tag/id`,


                /**
                 * 获取评论
                 * */
                getArticlesComments: `${url}/api/article/comments/article_id`,
                changeCommentState: `${url}/api/changeCommentState`,

            }

        })
        .config(['markedProvider', function (markedProvider) {
            // hljs.initHighlightingOnLoad();
            markedProvider.setOptions({
                renderer: new marked.Renderer(),
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false,
                highlight: function (code) {
                    console.log(code)
                    console.log(hljs.highlightAuto(code).value)
                    return hljs.highlightAuto(code).value;
                }
            });
        }])
        // .config(function (hljsServiceProvider) {
        //     hljsServiceProvider.setOptions({
        //         // replace tab with 4 spaces
        //         tabReplace: '    '
        //     });
        // });
})();



