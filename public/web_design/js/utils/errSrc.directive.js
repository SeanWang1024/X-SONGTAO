(function () {
    angular.module('xstApp')

    /**
     * 图片加载失败的时候进行处理
     * <img height="100%" ng-src="{{video.imgUrl}}" err-src="images/video-img-404.png">
     *  如果err-src不传入数据,则计算使用最近尺寸比例匹配的图片
     * */
        .directive('errSrc', [function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.css({"opacity": 0});

                    var emptyTransparent = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";

                    //如果失败
                    element.on('error', function () {
                        // console.log('--------------')
                        // console.log(attrs.errSrc )
                        // console.log(attrs.src )
                        // console.log(attrs.src != attrs.errSrc)
                        if (!!attrs.errSrc && attrs.src != attrs.errSrc) {
                            attrs.$set('src', attrs.errSrc);
                        }else{
                            // console.log(getPlaceHolderImgUrl())
                            attrs.$set('src', emptyTransparent);
                        }
                        element.css({"opacity": 1,"transition":"opacity ease 300ms"});
                    });
                    //如果成功
                    element.on('load', function () {
                        element.css({"opacity": 1,"transition":"opacity ease 300ms"});
                    });
                }
            };
        }])
})();
