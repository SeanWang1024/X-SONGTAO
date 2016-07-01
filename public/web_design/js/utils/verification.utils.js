/**
 * Created by xiangsongtao on 16/7/1.
 */
(function () {
    angular.module('xstApp')
        .factory('$verification', function () {
            return {
                isUsername:function (e) {
                    return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(e);
                },
                //是否是手机号码
                isMobile: function (e) {
                    return /^((13[0-9])|(14[0-9])|(15[0-9])|(18[0-9])|(17[0-9]))\d{8}$/.test(e);
                },
                //是否为 NaN, undefined, null , 0 , '', false
                isEmpty: function (value) {
                    if (value) {
                        return false;
                    }
                    return true;
                },
                isNum: function (e) {
                    var t = /^\d+$/;
                    return t.test(e);
                },

                /**
                 * 是否是昵称:  4-30个字符，可由中英文字母、数字、"-"、"_"组成。
                 */
                isNickname: function (str) {
                    var e = /^[\u4e00-\u9fa5_a-zA-Z0-9-\s]+$/;
                    return e.test(str);
                },
                /**
                 * 是否是密码
                 * @param i
                 * @returns {boolean}
                 */
                isPassword: function (i) {
                    if(!!i){
                        return (/^[a-zA-Z0-9]{3,20}$/.test(i))
                    }else{
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
                isEmail: function (str) {
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
            }
        })
})();