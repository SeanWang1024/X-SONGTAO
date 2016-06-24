/**
 * Created by xiangsongtao on 16/2/8.
 */
// angular.module('xstApp')
//   .controller('scrollCtrl', ['$scope', function ($scope) {
//     //大于1200px的时候滑动设置
//     $(".bg-right-contentInner").scroll(function () {
//       var scrollTop = $('.bg-right-contentInner').scrollTop();
//       //console.log($('.bg-right-contentInner').scrollTop());
//       if (scrollTop > 35) {
//         $(".contentNavBox").addClass("contentNavBox-1200-fixed contentNavBox-1200-navShow");
//       }else{
//         $(".contentNavBox").removeClass("contentNavBox-1200-navShow");
//       }
//       //console.log("1200px滑动");
//     });
//     //991-1200之间滑动的设置
//     var tplValue = 0;
//     $(".bg-right").scroll(function () {
//       var navScrollTop = $('.bg-right').scrollTop();
//       //console.log(navScrollTop);
//       //console.log("991-1200滑动");
//       var $contentNavBox = $(".contentNavBox");
//       //contentNavBox-991-1200-navFixed
//       var $contentContentBox = $(".contentContentBox");
//       //contentContentBox-all-navFixed
//       var height = $(".bg-right-imgBox").height();
//       //排除干扰
//       $contentNavBox.removeClass('contentNavBox-l991-navFixed');
//       $contentNavBox.removeClass('contentNavBox-l991-navShow');
//       //导航条消失,并且向上滚动
//       if (navScrollTop > height + 64) {
//         $contentNavBox.addClass('contentNavBox-991-1200-navFixed');
//         $contentContentBox.addClass('contentContentBox-all-navFixed');
//       }
//       //向上滚动,并且让nav向下滚动显示
//       if (navScrollTop > height + 64 && navScrollTop < tplValue) {
//         $contentNavBox.addClass('contentNavBox-991-1200-navShow');
//       }
//       //如果向上滚动,则将nav收起来
//       if (navScrollTop > height + 64 && navScrollTop > tplValue) {
//         $contentNavBox.removeClass('contentNavBox-991-1200-navShow');
//       }
//       //全部显示
//       if (navScrollTop < height) {
//         $contentNavBox.removeClass('contentNavBox-991-1200-navFixed contentNavBox-991-1200-navShow');
//         $contentContentBox.removeClass('contentContentBox-all-navFixed');
//       }
//       tplValue = navScrollTop;
//     });
//     //小于991px的滑动设置
//     $(".bigBox").scroll(function () {
//       //console.log($('.bigBox').scrollTop());
//       //console.log("<991px");
//
//       var navScrollTop = $('.bigBox').scrollTop();
//       //console.log("991-1200滑动");
//       var $contentNavBox = $(".contentNavBox");
//       //contentNavBox-991-1200-navFixed
//       var $contentContentBox = $(".contentContentBox");
//       //contentContentBox-all-navFixed
//       //
//       //console.log($(".bg-right-imgBox").css("display"))
//       if($(".bg-right-imgBox").css("display") == 'none'){
//         var height = 0;
//       }else{
//         var height = $(".bg-right-imgBox").height();
//       }
//
//       //去除干扰
//       $contentNavBox.removeClass('contentNavBox-991-1200-navFixed');
//       $contentNavBox.removeClass('contentNavBox-991-1200-navShow');
//
//       //导航条消失,并且向上滚动
//       if (navScrollTop > height + 64) {
//         $contentNavBox.addClass('contentNavBox-l991-navFixed');
//         $contentContentBox.addClass('contentContentBox-all-navFixed');
//       }
//       //向上滚动,并且让nav向下滚动显示
//       if (navScrollTop > height + 64 && navScrollTop < tplValue) {
//         $contentNavBox.addClass('contentNavBox-l991-navShow');
//       }
//       //如果向上滚动,则将nav收起来
//       if (navScrollTop > height + 64 && navScrollTop > tplValue) {
//         $contentNavBox.removeClass('contentNavBox-l991-navShow');
//       }
//       //全部显示
//       if (navScrollTop == height || navScrollTop < height) {
//         $contentNavBox.removeClass('contentNavBox-l991-navFixed contentNavBox-l991-navShow');
//         $contentContentBox.removeClass('contentContentBox-all-navFixed');
//       }
//       tplValue = navScrollTop;
//     });
//     //窗口resize的时候讲nav改成relative
//     $(window).resize(function () {
//       //console.log("resize")
//       $(".contentNavBox").removeClass('contentNavBox-l991-navFixed contentNavBox-l991-navShow')
//         .removeClass('contentNavBox-991-1200-navFixed contentNavBox-991-1200-navShow')
//         .removeClass('contentNavBox-1200-fixed contentNavBox-1200-navShow');
//       $(".contentContentBox").removeClass('contentContentBox-all-navFixed');
//
//       //  激活工具提示js
//       if(document.documentElement.clientWidth<991){
//         //  激活工具提示js
//         $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
//           trigger: 'hover',
//           placement:'bottom'
//         });
//       }else{
//         $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
//           trigger: 'hover',
//           placement:'right'
//         });
//       }
//     });
//
//     function scrollTopVisually() {
//       var timeCrol = setInterval(function () {
//         $(window).scrollTop($(window).scrollTop() - 100);
//         if ($(window).scrollTop() == 0) {
//           clearInterval(timeCrol);
//         }
//       }, 10);
//
//     }
//   }])
//
