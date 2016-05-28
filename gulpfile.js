/*
 html处压缩用到的注释必须与processhtml插件的一样 否则无法正确压缩

 目前的功能是将某个目录下所有的html文件(不包含嵌套)都进行检索压缩到dist目录下,如果html文件正确包含了压缩css/js的注释标记则html里面的文件会被正确压缩,否则压缩后的html文件将不能正确引用js/css资源

 后面将要把没有被标记压缩的js/css文件也同步压缩到dist目录下,但是这些未被标记的文件将不会被合并
 */


var filepath="./node_modules/";
var fs=require('fs'),
    gulp=require(''+filepath+'gulp'),
    minifycss=require(''+filepath+'gulp-minify-css'),     //压缩css
    concat=require(''+filepath+'gulp-concat'),            //文件合并
    minifyjs=require(''+filepath+'gulp-uglify'),            //压缩js
    rename=require(''+filepath+'gulp-rename'),            //文件重命名
    notify=require(''+filepath+'gulp-notify'),            //消息提醒
    del=require('del'),
    browserSync=require('browser-sync').create(),
    processhtml=require('gulp-processhtml'),
    fileinclude=require('gulp-file-include');
var htmlList=[];
var htmlSrc='src';
var minifySrc='dist';
var copySrc=['img','data'];//不需要压缩,但是要复制到dist目录下的文件夹名称

/*
 对路径下所有的html进行操作,是总的调用方法
 */
function handleHtml(){
    getHtmlList();
    for(var i=0; i<htmlList.length; i++){
        var jsList=getHtmlJsList(htmlList[i]);
        var cssList=getHtmlCssList(htmlList[i]);
        if(jsList){
            minifyJsList(jsList,htmlList[i]);
        }
        if(cssList){
            minifyCssList(cssList,htmlList[i]);
        }
        //copyFiles();
        gulp.src('src/'+htmlList[i])
            .pipe(processhtml())
            .pipe(gulp.dest('dist/'))
            .pipe(notify({
                message:"操作完成"
            }));
    }
}
/*
 获得当前路径下的所有html
 */
function getHtmlList(){
    var files=fs.readdirSync(__dirname+'/'+htmlSrc);
    for(var i=0; i<files.length; i++){
        var fileName=files[i].split('.');
        if(fileName.length>1&&fileName[fileName.length-1]==='html'){
            htmlList.push(files[i]);
        }
    }
}
/*
 获得单个html下引用的js文件
 */
function getHtmlJsList(name){
    var text=fs.readFileSync(__dirname+'/'+htmlSrc+'/'+name,'utf8');
    var scriptStr=text.match(/<!-- build:js.+-->[\s\S]+<!-- \/build -->/g);
    if(scriptStr&&scriptStr.length>0){
        scriptStr=scriptStr[0];
    }else{
        return null;
    }
    var srcArr=scriptStr.match(/src=".+\.js"/g);
    for(var i=0; i<srcArr.length; i++){
        srcArr[i]=srcArr[i].replace(/src="|"+/g,'');
    }
    addUrlToList(srcArr);
    return srcArr;
}
/*
 获得单个html下引用的css文件
 */
function getHtmlCssList(name){
    var text=fs.readFileSync(__dirname+'/'+htmlSrc+'/'+name,'utf8');
    var styleStr=text.match(/<!-- build:css.+-->[\s\S]+<!-- \/build -->/g);
    if(styleStr&&styleStr.length>0){
        styleStr=styleStr[0];
    }
    else{
        return null;
    }
    var srcArr=styleStr.match(/href=".+\.css"/g);
    for(var i=0; i<srcArr.length; i++){
        srcArr[i]=srcArr[i].replace(/href="|"+/g,'');
    }
    addUrlToList(srcArr);
    return srcArr;
}
/*
 根据js列表压缩成一个js
 */
function minifyJsList(jsList,name){
    gulp.src(jsList)
        .pipe(concat(name.replace('\.html','')+'.min.js'))
        .pipe(gulp.dest(minifySrc+'/js'))
        .pipe(minifyjs())    //压缩
        .pipe(gulp.dest(minifySrc+'/js'));
}
/*
 根据css列表压缩成一个css
 */
function minifyCssList(cssList,name){
    gulp.src(cssList)
        .pipe(concat(name.replace('\.html','')+'.min.css'))
        .pipe(gulp.dest(minifySrc+'/css'))
        .pipe(minifycss())    //压缩
        .pipe(gulp.dest(minifySrc+'/css'));
}
/*
 数组的添加路径操作
 */
function addUrlToList(list){
    for(var i=0; i<list.length; i++){
        list[i]=htmlSrc+'/'+list[i]
    }
}

function copyFiles(){
    for(var i=0;i<copySrc.length;i++){
        var files=fs.readdirSync(__dirname+'/'+htmlSrc+'/'+copySrc[i]);
        copyDir(htmlSrc+'/'+copySrc[i],minifySrc,function(err){
            if(err){
                console.log(err+':'+files[i]+'转换错误');
            }
        })
    }
}
/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist, callback) {
    fs.access(__dirname+'/'+dist, function(err){
        if(err){
            // 目录不存在时创建目录
            fs.mkdirSync(__dirname+'/'+dist);
        }
        _copy(null, src, dist);
    });

    function _copy(err, src, dist) {
        if(err){
            callback(err);
        } else {
            fs.readdir(src, function(err, paths) {
                if(err){
                    callback(err)
                } else {
                    paths.forEach(function(path) {
                        var _src = src + '/' +path;
                        var _dist = dist + '/' +path;
                        fs.stat(_src, function(err, stat) {
                            if(err){
                                callback(err);
                            } else {
                                // 判断是文件还是目录
                                if(stat.isFile()) {
                                    fs.writeFileSync(_dist, fs.readFileSync(_src));
                                } else if(stat.isDirectory()) {
                                    // 当是目录是，递归复制
                                    copyDir(_src, _dist, callback)
                                }
                            }
                        })
                    })
                }
            })
        }
    }
}









handleHtml();

/*
task
 */
gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js'], cb)
});
gulp.task('build',function(){
    handleHtml();
});
gulp.task('watch', function() {
    // 建立浏览器自动刷新服务器
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    // 自动刷新
    gulp.watch(['src/*.html','src/js/*.js'], function() {
        browserSync.reload();
    });
    gulp.watch('src/css/*.css').on('change',function(){
        browserSync.reload('src/css/*.css');
    });
});

gulp.task('default', ['watch']);