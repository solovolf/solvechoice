/*
浏览器平台版本判断插件
包含对各大操作系统和平台的判断(win,mac,linux,iphone,ipod,ipad,android,ios) 其中android,win添加了版本号的判断
包含对各大主流浏览器的判断(opera,ie,safari,chrome,firfox,微信浏览器)
 */
var client=function(){
    var engine={
        ie:0,
        gecko:0,
        webkit:0,
        khtml:0,
        opera:0,
        ver:null//完整版本号
    }
    var browser={
        ie:0,
        firefox:0,
        safari:0,
        opera:0,
        chrome:0,
        weixin:0,
        ver:null//版本号
    }
    var system={
        win:false,
        mac:false,
        x11:false,

        iphone:false,
        ipod:false,
        ipad:false,

        android:false,
        nokiaN:false,
        winMobile:false,

        wii:false,
        ps:false
    }

    var ua=navigator.userAgent;
    if(window.opera){
        browser.ver=window.opera.version();
        browser.opera=true;
    }else if(/MicroMessenger/i.test(ua)){
        browser.weixin=true;
        browser.ver=parseFloat(/MicroMessenger\/(\S+)/i.exec(ua)[1]);
    }else if(/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver=/AppleWebKit\/(\S+)/.exec(ua)[1];
        engine.webkit=parseFloat(engine.ver);

        if(/Chrome\/(\S+)/.test(ua)){
            browser.ver=/Chrome\/(\S+)/.exec(ua)[1];
            browser.chrome=true;
        }else if(/Version\/(\S+)/.test(ua)){
            browser.ver=/Version\/(\S+)/.exec(ua)[1];
            browser.safari=true;
        }else{
            var safariVersion=1;
            if(engine.webkit<100){
                safariVersion=1;
            }else if(engine.webkit<312){
                safariVersion=1.2;
            }else if(engine.webkit<412){
                safariVersion=1.3;
            }else{
                safariVersion=2;
            }
            browser.safari=browser.ver=safariVersion;
        }
    }else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
        engine.ver=browser.ver=/rv:([^\)]+)\) Gecko\/\d{8}/.exec(ua)[1];
        engine.gecko=parseFloat(engine.ver);
        if(/Firefox\/(\S+)/.test(ua)){
            browser.ver=/Firefox\/(\S+)/.exec(ua)[1];
            browser.firefox=parseFloat(browser.ver);
        }
    }else if(/MISE/.test(ua)){
        browser.ie=true;
        if(window.atob){
            browser.ver=10;
        }else if(document.addEventListener){
            browser.ver=9;
        }else if(document.querySelector){
            browser.ver=8;
        }else if(window.XMLHttpRequest){
            browser.ver=7;
        }else if(document.compatMode){
            browser.ver=6;
        }
    }

    var p =navigator.platform;
    system.win=p.indexOf('Win')==0;
    system.mac=p.indexOf('Mac')==0;
    system.x11=(p=='x11')||(p.indexOf('Linux')==0);

    if(system.win){
        var winsys=/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.exec(ua);
        if(winsys){
            if(winsys[1]=='NT'){
                switch(winsys[2]){
                    case '5.0':
                        system.win='2000';
                        break;
                    case '5.1':
                        system.win='xp';
                        break;
                    case '6.0':
                        system.win='Vista';
                        break;
                    case '6.1':
                        system.win='7';
                        break;
                    default:
                        system.win='NT';
                        break;
                }
            }else if(winsys[1]=='9x'){
                system.win='ME';
            }else{
                system.win=winsys[1];
            }
        }
    }

    system.iphone=ua.indexOf('iPhone') > -1;
    system.ipod=ua.indexOf('iPod') > -1;
    system.ipad=ua.indexOf('iPad') > -1;
    system.nokiaN=ua.indexOf('NokiaN') > -1;

    if(system.win=='CE'){
        system.winMobile=system.win;
    }else if(system.win=="Ph"){
        var winPhoneVer=/Windows Phone OS (\d+.\d+)/.exec(ua)
        if(winPhoneVer.length>1){
            system.win='Phone';
            system.winMobile=parseFloat(winPhoneVer[1])
        }
    }

    if(/Android (\d+\.\d+)/.test(ua)){
        system.android=/Android (.{0,5}\.\d;)/.exec(ua)[1];
    }

    system.wii=ua.indexOf('Wii')>-1;
    system.ps=/playstation/i.test(ua);

    return{
        browser:browser,
        system:system
    };
}
