(function(golbal){
    var bodyVue=new Vue({
        el:'#content',
        data:{
            pageState:0,
            lunchList:[],
            delflag:false
        },
        methods:{
            beginEditMenu:function(eve){
                this.pageState=2;
                myShakeEvent.stop();
            },
            backToMainPage:function() {
                this.pageState=1;
                myShakeEvent.start();
            },
            resetMenu:function(msg){
                dialog.showConfirm('提示',typeof msg ==='string'?msg:'确定要恢复到原始菜单吗?',function(){
                    localStorage.lunch=jsonData.lunchList.join();
                    bodyVue.lunchList=localStorage.lunch.split(',');
                });
            },
            delMenuItem:function(eve){
                if(this.delflag){
                    return;
                }
                this.delflag=true;
                var index=eve.currentTarget.getAttribute('data-index');
                eve.currentTarget.parentNode.classList.add('item-remove');
                var self=this;
                setTimeout(function(){
                    self.lunchList.splice(index,1);
                    localStorage.lunch=self.lunchList.join(',');
                    self.delflag=false;
                },500);
            },
            addMenuItem:function(){
                dialog.showPropmt('请输入菜单名称',function(msg){
                    if(msg){
                        bodyVue.lunchList.push(msg);
                        localStorage.lunch=bodyVue.lunchList.join(',');
                        document.querySelector('#y_propmt .inputcontent').value='';
                        dialog.tip('录入成功!');
                    }else{
                        dialog.tip('请输入菜单');
                    }
                });
                document.querySelector('#y_propmt .inputcontent').focus();
            }
        }
    });

    golbal.addEventListener('load',function(){
        bodyVue.pageState=1;
        if(localStorage.lunch){
            bodyVue.lunchList=localStorage.lunch.split(',');
        }else{
            bodyVue.$options.methods.resetMenu('您暂时没有菜单,需要使用默认菜单吗?');
        }
    });

    /*
     bind shake
     */
    var myShakeEvent=new Shake({
        threshold:10,
        timeout: 3000
    });
    myShakeEvent.start();
    window.addEventListener('shake',shakeEventDidOccur,false);
    function shakeEventDidOccur(){
        var audio=document.getElementById("shake_audio");
        audio.pause();
        audio.currentTime = 0;
        audio.play();
        setTimeout(function(){
            var result=document.getElementById("reswrapper");
            if(bodyVue.lunchList.length==0){
                result.innerHTML='没有菜单,请编辑菜单';
                return;
            }
            result.style.display='block';
            result.classList.add('res-animate');
            setTimeout(function(){
                result.classList.remove('res-animate');
            },2000);
            var num=Math.floor(Math.random()*bodyVue.lunchList.length);
            result.innerHTML="摇得《"+bodyVue.lunchList[num]+"》！";
        },1000)
    }
})(window)