/**
 * Created by xiangsongtao on 15/12/24.
 */
angular.module('xstApp')
//进入后,scrollTop滚到0
  .directive("scrollTopZero",function(){
    return{
      restirect:'E',
      replace:true,
      link:function(){
        $('.bg-right-contentInner').scrollTop(0);
        $('.bg-right').scrollTop(0);
        $('.bigBox').scrollTop(0);
      }
    }
  })
//分页按钮
  .directive("pageSelect",["$rootScope",function($rootScope){
    return{
      restirect:'E',
      replace:true,
      link:function(scope,element){
        //默认初始的当前页nowPageNum = 1
        $rootScope.nowPageNum = 1;
        //监听当前页数的变化,如果变化,就更新当前页的css
        $rootScope.$watch("nowPageNum", function () {
          //滚到头顶
          $('.bg-right-contentInner').scrollTop(0);
          $('.bg-right').scrollTop(0);
          $('.bigBox').scrollTop(0);
          //更新Pagination>li的样式
          //var $PaginationPageNum = $(".pagination .pageNum");
          var $PaginationPageNum = element.find(".pageNum");
          var length = $PaginationPageNum.length;
          for (var i = 0; length > i; i++) {
            if (parseInt($PaginationPageNum.eq(i).text()) == parseInt($rootScope.nowPageNum)) {
              $PaginationPageNum.eq(i).addClass("active").siblings().removeClass("active");
              return;
            }
          }
        }, true);
        //下一个
        var $next = element.find(".next");
        $next.click(function () {
          //console.log('.pagination .next');
          if ($rootScope.nowPageNum == $rootScope.pageNum) {return}
          $rootScope.nowPageNum = parseInt($rootScope.nowPageNum) + 1;
          //console.log($rootScope.nowPageNum);
          element.find("li").removeClass("disabled");
          if ($rootScope.nowPageNum == $rootScope.pageNum) {
            $next.addClass("disabled");
          }
          $rootScope.$apply();
        });
      //  上一个
        var $prev = element.find(".prev");
        $prev.click(function () {
          //console.log('.pagination .prev');
          if ($rootScope.nowPageNum == 1) {return}
          $rootScope.nowPageNum = parseInt($rootScope.nowPageNum) - 1;
          $prev.find("li").removeClass("disabled");
          if ($rootScope.nowPageNum == 1) {
            $prev.addClass("disabled");
          }
          $rootScope.$apply();
        });
      //  中间数字,动态添加的内容需要绑定到document上
        $(document).on("click", ".pagination .pageNum", function () {
          //console.log('.pagination .pageNum');
          var $this = $(this);
          $rootScope.nowPageNum = parseInt($this.text());
          //判断是否到头顶尾部
          if ($rootScope.nowPageNum == 1) {
            $(".pagination .prev").addClass("disabled");
          } else {
            $(".pagination .prev").removeClass("disabled");
          }
          if ($rootScope.nowPageNum == $rootScope.pageNum) {
            $(".pagination .next").addClass("disabled");
          } else {
            $(".pagination .next").removeClass("disabled");
          }
          $rootScope.$apply();
        });
      }
    }
  }])
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
;
