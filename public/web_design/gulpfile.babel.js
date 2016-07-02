'use strict';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();
import bs from 'browser-sync';
const browserSync = bs.create();

//environment
const PATH = {
    SRC: "./",
    DIST: "../web"
};
//页面模板在此目录下
const APP_VIEWS = '../../app/views';
const APP_VIEWS_WEB = '../../app/views/web.client.view.hbs';
// const APP_VIEWS_ADMIN = '../../app/views/admin.server.view.hbs';
/**
 * 设置自动构建环境(默认)
 * DEV;源码
 * TES;源码 + 文件名加MD5
 * PRO;文件名加MD5 + 压缩
 * */
var ENV = "DEV";

gulp.task('clean:dist', function () {
    return gulp.src(PATH.DIST, {read: false})
        .pipe($.clean({force: true}));
});

gulp.task('move:index', function () {
    // var stream = gulp.src(`${PATH.SRC}/index.html`).pipe($.rename("home.client.view.hbs"));
    var stream = gulp.src(`${PATH.SRC}/index.html`);
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}`));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(`${PATH.DIST}`));
            break;
        case 'PRO':
            return stream.pipe($.htmlmin({collapseWhitespace: true})).pipe(gulp.dest(`${PATH.DIST}`));
            break;
    }
});

// gulp.task('sdfe',function () {
//     return gulp.src(`sdfe.html`).pipe($.htmlmin({collapseWhitespace: true})).pipe(gulp.dest('css'))
// })

gulp.task('move:tpl', ()=> {
    var stream = gulp.src(`${PATH.SRC}/views/**/*.html`).pipe($.rename({dirname: ''}));;
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/tpl`));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(`${PATH.DIST}/tpl`));
            break;
        case 'PRO':
            return stream.pipe($.htmlmin({collapseWhitespace: true})).pipe(gulp.dest(`${PATH.DIST}/tpl`));
            break;
    }
});

gulp.task('move:fonts', ()=> {
    var stream = gulp.src(`${PATH.SRC}/fonts/*.*`);
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/fonts`));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(`${PATH.DIST}/fonts`));
            break;
        case 'PRO':
            return stream.pipe($.htmlmin({collapseWhitespace: true})).pipe(gulp.dest(`${PATH.DIST}/fonts`));
            break;
    }
});

gulp.task('css:common', ()=> {
    // var stream = gulp.src(`${PATH.SRC}/lib/**/*.css`)
    var stream = gulp.src([
        `${PATH.SRC}/lib/reset.css`,
        `${PATH.SRC}/lib/bootstrap.min.css`,
        `${PATH.SRC}/lib/font-awesome.min.css`,
    ])
        .pipe($.autoprefixer({
            browsers: ['IE 8'],
            cascade: false
        }))
        .pipe($.concat('common.css'));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/css`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB))
                .pipe(gulp.dest(`${PATH.DIST}/css`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB))
                .pipe($.cleanCss())
                .pipe(gulp.dest(`${PATH.DIST}/css`));
            break;
    }
});
gulp.task('css:main', ()=> {
    var stream = gulp.src(`${PATH.SRC}/css/**/main.scss`)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['IE 8'],
            cascade: false
        }));
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/css`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB))
                .pipe(gulp.dest(`${PATH.DIST}/css`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB))
                .pipe($.cleanCss())
                .pipe(gulp.dest(`${PATH.DIST}/css`));
            break;
    }
});

gulp.task('js:common', function () {
    var stream = gulp.src([
        `${PATH.SRC}/lib/jquery.min.js`,
        `${PATH.SRC}/lib/angular.js`,
        `${PATH.SRC}/lib/angular-ui-router.min.js`,
        `${PATH.SRC}/lib/bootstrap.min.js`,
    ]).pipe($.concat('common.js')).pipe($.babel());
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB)).pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB)).pipe($.uglify()).pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
    }
});

gulp.task('js:common.admin', function () {
    var stream = gulp.src([
        `${PATH.SRC}/lib/admin/dropzone.js`,
        `${PATH.SRC}/lib/admin/marked.js`,
        `${PATH.SRC}/lib/admin/highlight.js`,
        `${PATH.SRC}/lib/admin/angular-marked.min.js`,
        `${PATH.SRC}/lib/admin/angular-highlightjs.js`
    ]).pipe($.concat('common.admin.js')).pipe($.babel());
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB)).pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB)).pipe($.uglify()).pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
    }
});

gulp.task('js:main', function () {
    var stream = gulp.src([`${PATH.SRC}/js/**/*.js`,`${PATH.SRC}/views/**/*.js`]).pipe($.concat('main.js')).pipe($.babel());
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
        case 'TES':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB)).pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
        case 'PRO':
            return stream.pipe($.md5Plus(10, APP_VIEWS_WEB)).pipe($.uglify()).pipe(gulp.dest(`${PATH.DIST}/js`));
            break;
    }
});


gulp.task('move:images', function () {
    var stream = gulp.src([
        `${PATH.SRC}/img/**/*.*`,
        `${PATH.SRC}/*.png`,
        `${PATH.SRC}/*ico`,
    ]);
    switch (ENV) {
        case 'DEV':
            return stream.pipe(gulp.dest(`${PATH.DIST}/img`));
            break;
        case 'TES':
            return stream.pipe(gulp.dest(`${PATH.DIST}/img`));
            break;
        case 'PRO':
            return stream.pipe($.imagemin()).pipe(gulp.dest(`${PATH.DIST}/img`));
            break;
    }
});

// gulp.task('browserSync:server', function () {
//     browserSync.init({
//         notify: false,
//         server: {
//             //开启的目录
//             baseDir: [PATH.DIST]
//         },
//         port: 8088,
//         // files: [
//         //     `${PATH.DIST}/**/*.*`
//         // ]
//     });
//    gulp.watch(`${PATH.SRC}/tpl/*.html`, ['move:tpl']).on('change', browserSync.reload);
// gulp.watch(`${PATH.SRC}/fonts/*.*`, ['move:fonts']);
// gulp.watch(`${PATH.SRC}/lib/**/*.css`, ['css:common']);
// gulp.watch(`${PATH.SRC}/css/**/main.scss`, ['css:main']);
// gulp.watch(`${PATH.SRC}/lib/**/*.js`, ['js:common']).on('change', browserSync.reload);
// gulp.watch(`${PATH.SRC}/js/**/*.js`, ['js:main']).on('change', browserSync.reload);
// gulp.watch(`${PATH.SRC}/img/**/*.*`, ['move:images']);
// gulp.watch(`${PATH.SRC}/index.html`, ['move:index']).on('change', browserSync.reload);
//
// });

gulp.task("watch",function () {
    gulp.watch(`${PATH.SRC}/views/**/*.html`, ['move:tpl']);
    // // gulp.watch(`${PATH.SRC}/fonts/*.*`, ['move:fonts']);
    gulp.watch(`${PATH.SRC}/lib/**/*.css`, ['css:common']);
    gulp.watch(`${PATH.SRC}/css/**/*.scss`, ['css:main']);
    gulp.watch(`${PATH.SRC}/lib/**/*.js`, ['js:common']);
    gulp.watch(`${PATH.SRC}/js/**/*.js`, ['js:main']);
    gulp.watch(`${PATH.SRC}/views/**/*.js`, ['js:main']);
    // // gulp.watch(`${PATH.SRC}/img/**/*.*`, ['move:images']);
    gulp.watch(`${PATH.SRC}/index.html`, ['move:index']);
});

gulp.task('default', $.sequence(
    'clean:dist',
    ['move:index'],
    [
        'move:tpl',
        'move:fonts',
        'css:common',
        'css:main',
        'js:common',
        'js:common.admin',
        'js:main',
        'move:images',
    ]
));

/**
 * 设置自动构建环境
 * DEV;源码
 * TES;文件名打码
 * PRO;文件打码压缩,发布
 * */
gulp.task("SetDevEnv", function () {
    ENV = "DEV";
});
gulp.task("SetTesEnv", function () {
    ENV = "TES";
});
gulp.task("SetProEnv", function () {
    ENV = "PRO";
});

gulp.task("DEVELOPMENT", $.sequence('SetDevEnv', 'default','watch'));
gulp.task("TESTONLINE", $.sequence('SetTesEnv', 'default'));
gulp.task("PRODUCTION", $.sequence('SetProEnv', 'default'));

