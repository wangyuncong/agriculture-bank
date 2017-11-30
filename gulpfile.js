var gulp = require("gulp");
var concat = require("gulp-concat")
var minify = require("gulp-minify-css")
var rename=require("gulp-rename");
var uglify=require("gulp-uglify");
var htmlmin=require("gulp-htmlmin");
var compilesass = require("gulp-sass");
var watch = require("gulp-watch");
var webserver = require("gulp-webserver")
var fs = require("fs")
//压缩css
gulp.task("mincss",function(){
    gulp.src("./css/style.css")
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./css/"))
})

//压缩html
var options={
    removeComments:true,//清除HTML注释
    collapseWhitespace:true,//压缩html
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
}
gulp.task("minhtml",function(){
    gulp.src("./index.html")
        .pipe(htmlmin(options))
        .pipe(rename("index.min.html"))
        .pipe(gulp.dest("./html/"))
})

//服务
gulp.task("httpserver",function(){
    gulp.src("./")
        .pipe(webserver({
            port:8080,
            host:"localhost",
            livereload:true,
            fallback:"index.html",
            open:true
        }))
})
gulp.task('mockserver',function(){
    gulp.src("./")
        .pipe(webserver({
            port:3000,
            host:"localhost",
            middleware:function(req,res,next){
                //console.log(req.url)
                res.writeHeader(200,{
                    "Content-type":"text/json;charset=utf-8",
                    "Access-Control-Allow-Origin":"*"
                });
                if(req.url=="/data"){
                    var filename = req.url.split("/")[1];
                    var filepath = require("path").join(__dirname,"data",filename+".json")
                    console.log(filepath)
                    fs.exists(filepath,function(exist){
                        if(exist){
                            fs.readFile(filepath,function(err,data){
                                if(err){
                                    throw err;
                                }else{
                                    console.log(data)
                                    res.end(data)
                                }
                            })
                        }else{
                            console.log("555")
                        }
                    })
                }
                  
            }
        }))
})

gulp.task("default",["mincss","minhtml","httpserver","mockserver"])

