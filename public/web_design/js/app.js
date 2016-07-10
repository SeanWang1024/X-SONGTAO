'use strict';

(function () {
    angular.module('xstApp', ['ui.router', 'ngStorage', 'hc.marked', 'btorfs.multiselect', 'angularMoment', 'ng-bs3-datepicker'])
    /**
     * 配置文件
     * */
        //moment国际化选择
        .run(['amMoment',function (amMoment) {
            amMoment.changeLocale('Zh-cn');
        }])
        // hljs.initHighlightingOnLoad();
        .config(['markedProvider', function (markedProvider) {
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
                    return hljs.highlightAuto(code).value;
                }
            });
        }])
        //html5的路由模式,去掉#,无要在开头设置<base href="/" />
        .config(['$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode(true);
        }])
        /**
         * 拓展$log方法,为其加上时间戳
         * */
        .config(['$provide', function ($provide) {
            $provide.decorator('$log', ['$delegate', function ($delegate) {
                var origDebug = $delegate.debug;
                $delegate.debug = function () {
                    var args = [].slice.call(arguments);
                    args[0] = [new Date().toString(), ': ', args[0]].join('');

                    // Send on our enhanced message to the original debug method.
                    origDebug.apply(null, args)
                };
                return $delegate;
            }]);
        }])
        /**
         * $log的debug方法显示开关
         * */
        .config(['$logProvider', function ($logProvider) {
            $logProvider.debugEnabled(false);

            // $log.log("log")
            // $log.info("info")
            // $log.warn("warn")
            // $log.error("error")
            // $log.debug("ello")
        }])

})();



