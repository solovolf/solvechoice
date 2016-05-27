/**
 * Created by coney on 16/5/11.
 */
(function(){
    "use strict"
    /*
     fastclick
     */
    try{
        FastClick.attach(document.body);
    }catch(e){

    }

    var page='main';
    //数组工具
    Array.prototype.inArray=function(elem){
        var i=0,
            len=this.length;
        for(; i<len; i++){
            if(this[i]===elem){
                return i;
            }
        }
        return -1;
    };
    //菜单列表对象
    function Lunch(){
        this.lunchList=[];
    }

    Lunch.prototype.getLunch=function(){
        this.lunchList=localStorage.lunch;
        if(!this.lunchList){
            this.lunchList=[];
        }else{
            this.lunchList=this.lunchList.split(',');
        }
        if(this.lunchList[0]=='null'||this.lunchList[0]=='undefined'){
            this.lunchList=[];
        }
    }
    Lunch.prototype.addLunchItem=function(item){
        var index=this.lunchList.inArray(item);
        if(index> -1){
            this.removeLunchItem(index);
        }
        this.lunchList.push(item);
        localStorage.lunch=this.lunchList.join();
    }
    Lunch.prototype.removeLunchItem=function(index){
        if(typeof index==='string'){
            index=this.lunchList.inArray(index);
        }
        this.lunchList.splice(index,1);
        localStorage.lunch=this.lunchList.join();
    }
    Lunch.prototype.clear=function(){
        this.lunchList=[];
        localStorage.lunch=null;
    }
    Lunch.prototype.getJson=function(callback){
        var self=this;
        var xhr=new XMLHttpRequest();
        xhr.open('get','data/data.json',true);
        xhr.onload=function(e){
            if(this.status===200){
                var results=JSON.parse(this.responseText);
                self.lunchList=results.lunchList;
                localStorage.lunch=self.lunchList.join();
                if(callback&&typeof callback==='function'){
                    callback();
                }
            }else{
                console.log(e);
            }
        };
        xhr.onerror=function(e){
            console.log(e);
        };
        xhr.send(null);
    }
    Lunch.prototype.judgeNull=function(){
        this.getLunch()
        if(this.lunchList.length==0){
            this.getJson();
        }
    }
    Lunch.prototype.showList=function(){
        var html='';
        for(var i=0; i<this.lunchList.length; i++){
            html+='<div class="item" data-index="'+i+'"><span class="menu_name">'+this.lunchList[i]+'</span><span class="close">✕</span>'+'</div>'
        }
        document.getElementById('list_wrapper').innerHTML=html;
    }
    var lun=new Lunch();
    lun.judgeNull();
    /*
     bind shake
     */
    var myShakeEvent=new Shake({
        threshold:5
    });
    myShakeEvent.start();
    window.addEventListener('shake',shakeEventDidOccur,false);
    function shakeEventDidOccur(){
        if(page!='main')
            return;
        var result=document.getElementById("result");
        if(lun.lunchList.length==0){
            result.innerHTML='没有菜单,请编辑菜单';
            return;
        }
        document.getElementById("reswrapper").style.display='block';
        var num=Math.floor(Math.random()*lun.lunchList.length);
        result.innerHTML="摇得"+lun.lunchList[num]+"！";
    }

    /*
     btn event
     */
    document.getElementById('btn_default').addEventListener('click',function(eve){
        lun.getJson(function(){
            lun.showList();
        });
    });
    document.getElementById('btn_edit').addEventListener('click',function(eve){
        document.getElementById('edit_wrapper').style.display='block';
        lun.showList();
        page='edit';
    });
    document.getElementById('btn_return').addEventListener('click',function(eve){
        document.getElementById('edit_wrapper').style.display='none';
        page='main';
    });
    document.getElementById('list_wrapper').delegate('click','close',function(eve,target){
        var index=target.parentNode.attributes['data-index'].value;
        lun.removeLunchItem(parseInt(index));
        lun.showList();
    });
    document.getElementById('btn_add').addEventListener('click',function(eve){
        var menuItem=prompt('请输入菜单名:','');
        if(menuItem&&menuItem.trim()){
            lun.addLunchItem(menuItem);
            lun.showList();
        }
    });
})()