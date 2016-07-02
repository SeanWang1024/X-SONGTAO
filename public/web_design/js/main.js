console.log('你好!你这是在.....想看源码?联系我吧!');
(function () {

  $(".blackShade.error").click(function(){
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
  if(document.documentElement.clientWidth<991){
     // 激活工具提示js
    $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
      trigger: 'hover',
      placement:'bottom'
    });
  }else{
    $('[data-toggle="tooltip"]').tooltip('destroy').tooltip({
      trigger: 'hover',
      placement:'right'
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
  })

})();
