var gulp = require('gulp');
var gulpsass = require('gulp-sass');
var webserver = require('gulp-webserver');
var data = require('./src/data/dada.json');
var url = require('url');
var path = require('path');
var fs = require('fs');
// console.log(webserver);
//编译sass
gulp.task('devsass', function() {
    return gulp.src('./src/scss/*.{scss,sass}')
        .pipe(gulpsass())
        .pipe(gulp.dest('./src/css/'));
});
//时刻监听变化
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.{scss,sass}', gulp.series('devsass'))
});
//起服务器
gulp.task('server', function() {
    return gulp.src('./src')
        .pipe(webserver({
            port: 8081,
            // host: "localhost",
            // open: true,
            livereload: true, //监听变化自动刷新
            middleware: function(req, res, next) {
                //get请求
                var pathname = url.parse(req.url).pathname;
                // console.log(pathname);
                if (pathname === '/favicon.ico') {
                    res.end('');
                    return;
                };
                if (pathname === '/api/index.swiper') { //接口

                } else { //静态文件
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));;
                }
            }
        }))
});
gulp.task('dev', gulp.series('devsass', 'server', 'watch'))