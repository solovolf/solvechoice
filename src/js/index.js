(function (golbal) {
    if(typeof document.addEventListener === 'undefined'){
    // if(true){
        document.body.style.backgroundColor='#FFFFFF';
        document.body.style.textAlign='center';
        document.body.innerHTML=('<h2 style="margin-top: 40px;font-size: 30px;">此网站不支持ie8及以下浏览器<br>请下载最新版本的chrome内核的浏览器(比如:猎豹浏览器)</h2><br><a style="font-size: 20px" href="http://www.liebao.cn/download.html">猎豹浏览器下载页</a><br><br><a style="font-size: 20px" href="http://dl.liebao.cn/kb/KSBrowser_5.3.108.11949_r1.exe">猎豹浏览器安装包</a>');
        return;
    }

    var myShakeEvent = null;

    var bodyVue = new Vue({
        el: 'body',
        data: {
            clientType: 0,//0移动,1pc
            pageState: 0,//1,移动首页/2,移动菜单/3,pc首页
            lunchList: [],
            delflag: false
        },
        methods: {
            beginEditMenu: function (eve) {
                this.pageState = 2;
                myShakeEvent.stop();
            },
            backToMainPage: function () {
                this.pageState = 1;
                myShakeEvent.start();
            },
            resetMenu: function (msg) {
                dialog.showConfirm('提示', typeof msg === 'string' ? msg : '确定要恢复到原始菜单吗?', function () {
                    localStorage.lunch = jsonData.lunchList.join();
                    bodyVue.lunchList = localStorage.lunch.split(',');
                });
            },
            delMenuItem: function (eve) {
                if (this.delflag) {
                    return;
                }
                this.delflag = true;
                var index = eve.currentTarget.getAttribute('data-index');
                eve.currentTarget.parentNode.classList.add('item-remove');
                var self = this;
                setTimeout(function () {
                    self.lunchList.splice(index, 1);
                    localStorage.lunch = self.lunchList.join(',');
                    self.delflag = false;
                }, 500);
            },
            addMenuItem: function () {
                dialog.showPropmt('请输入菜单名称', function (msg) {
                    if (msg) {
                        bodyVue.lunchList.push(msg);
                        localStorage.lunch = bodyVue.lunchList.join(',');
                        document.querySelector('#y_propmt .inputcontent').value = '';
                        dialog.tip('录入成功!');
                    } else {
                        dialog.tip('请输入菜单');
                    }
                });
                document.querySelector('#y_propmt .inputcontent').focus();
            },
            pcEditMenu: function () {
                this.pageState = 5;
            },
            closeMenuBanner: function () {
                this.pageState = 4;
            },
            startRandom: function () {
                var self = this;
                var count = self.lunchList.length - 1;
                var res = document.getElementById('pc_res');
                var curIndex = 0
                var interval = window.setInterval(function () {
                    if (++curIndex > count) {
                        curIndex = 0
                    }
                    res.innerHTML = self.lunchList[curIndex];
                }, 100);
                setTimeout(function () {
                    clearInterval(interval);
                    var index = parseInt(Math.random() * count);
                    res.innerHTML = self.lunchList[index];
                }, 2000);
            }
        }
    });


    //判断访问终端
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }

    //初始化,根据不同的浏览器显示不同的页面
    golbal.addEventListener('load', function () {
        if (localStorage.lunch) {
            bodyVue.lunchList = localStorage.lunch.split(',');
        } else {
            bodyVue.$options.methods.resetMenu('您暂时没有菜单,需要使用默认菜单吗?');
        }
        if (browser.versions.mobile || browser.versions.android || browser.versions.ios) {
            bodyVue.pageState = 1;
            myShakeEvent = new Shake({
                threshold: 10,
                timeout: 3000
            });
            myShakeEvent.start();
            window.addEventListener('shake', shakeEventDidOccur, false);
            function shakeEventDidOccur() {
                var audio = document.getElementById("shake_audio");
                audio.pause();
                audio.currentTime = 0;
                audio.play();
                setTimeout(function () {
                    var result = document.getElementById("reswrapper");
                    if (bodyVue.lunchList.length == 0) {
                        result.innerHTML = '没有菜单,请编辑菜单';
                        return;
                    }
                    result.style.display = 'block';
                    result.classList.add('res-animate');
                    setTimeout(function () {
                        result.classList.remove('res-animate');
                    }, 2000);
                    var num = Math.floor(Math.random() * bodyVue.lunchList.length);
                    result.innerHTML = "摇得《" + bodyVue.lunchList[num] + "》！";
                }, 1000)
            }
        } else {
            bodyVue.clientType = 1;
            bodyVue.pageState = 4;
        }
    });
})(window)