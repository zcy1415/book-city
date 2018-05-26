var obj = {
    "zs": 456
}
var gulp = require('gulp');
var server = require('gulp-webserver');
var url = require('url');
var data = require("./src/js/data.js")
var flag = false;
var minjs = require("gulp-uglify")
var babel = require('gulp-babel');
var miniCss = require('gulp-minify-css');
var miniHtml = require('gulp-htmlmin');
gulp.task('miniH', function() {
    gulp.src('./src/**/*.html')
        .pipe(miniHtml({
            collapseWhitespace: true, //压缩HTML
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('./dist'))
});
gulp.task('minicss', function() {
    gulp.src('./src/css/style.css')
        .pipe(miniCss('style.min.css')) //设置压缩后的文件名
        .pipe(gulp.dest('./dist'));
});
gulp.task('babel', function() {
    gulp.src('./src/js/*.js') //需要编译的文件
        .pipe(babel({
            presets: 'es2015' //指定编译后的版本为es5
        }))
        .pipe(minjs())
        .pipe(gulp.dest('./dist')); //编译后存放文件的路径
});

gulp.task('server', function() {
    gulp.src('dist/')
        .pipe(server({
            port: 8800,
            host: "localhost",
            livereload: true,
            open: true,
            middleware: function(req, res, next) {
                var uname = url.parse(req.url, true);
                if (/\/book/.test(uname.pathname)) {
                    res.end(JSON.stringify(data(req.url)));
                    return false;
                }
                if (uname.pathname == "/detal") {
                    res.end(JSON.stringify({ "meg": flag }))
                    return;
                }
                if (uname.pathname == "/login") {
                    if (obj[uname.query.user] && obj[uname.query.user] == uname.query.pwd) {
                        flag = true
                        res.end(JSON.stringify({ "meg": "成功" }))
                    } else {
                        res.end(JSON.stringify({ "meg": "失败" }))
                    }
                }
                next();
            }
        }))
});

gulp.task('default', ["server"])