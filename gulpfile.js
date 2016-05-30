/*
 gulp 构建基础版
 将压缩后的js/css文件和重新指定引用地址的html文件全部放到dist目录中

 需要复制的目录不支持子目录,必须在copySrc中进行配置,如果有子目录需要写明
 重新制定js/css资源的html所指定的文件名需要在两处进行配置(html和js中)这个将在后续版本中进行改动
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
    copyFiles();

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
        gulp.src('src/'+htmlList[i])
            .pipe(processhtml())
            .pipe(gulp.dest('dist/'));
    }

    gulp.src('src').pipe(notify({
        message:"操作完成"
    }));
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
        gulp.src([htmlSrc+'/'+copySrc[i]+'/*.*']).pipe(gulp.dest(minifySrc+'/'+copySrc[i]));
    }
}


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