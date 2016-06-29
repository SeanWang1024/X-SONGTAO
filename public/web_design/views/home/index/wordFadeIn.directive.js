/**
 * Created by xiangsongtao on 16/6/29.
 */
(function () {
    angular.module('xstApp')
    //index的文字反动
        .directive("indexWordFadeIn",function(){
            return{
                restirect:'E',
                replace:true,
                link:function(scope,element){
                    var headlines = $("#headlines");
                    setInterval(function () {
                        if(headlines.find('h1.current').next().length == 0){
                            headlines.find('h1').first().addClass('current').siblings().removeClass('current');
                        }else {
                            headlines.find('h1.current').next().addClass('current').siblings().removeClass('current');
                        }
                    },4000)
                }
            }
        })
})();