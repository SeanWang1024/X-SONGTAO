'use strict';

(function () {
    angular.module('xstApp', ['ui.router'])
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
                postMyInfo:`${url}/api/user`,
                changePassword:`${url}/api/change_password`,

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

                /**
                 * 标签相关
                 * */
                //获取标签列表(带有结构的)
                getTagsListWithStructure: `${url}/api/tags_with_structure`,
                //由标签id获取文章列表
                getArticlesWithTagId: `${url}/api/article_tag/id`,

                /**
                 * 获取评论
                 * */
                getArticlesComments: `${url}/api/article/comments/article_id`,
                changeCommentState: `${url}/api/changeCommentState`,

            }

        });
})();



