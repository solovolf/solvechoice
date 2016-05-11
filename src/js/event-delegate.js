//事件代理
(function(){
    HTMLElement.prototype.delegate=function(eventType,className,callback){
        //循环判断
        function circleParent(eve){
            var target=eve.target;
            while(target!==eve.currentTarget){
                if(target.classList.contains(className)){
                    callback(eve,target);//被代理的元素对象
                    return;
                }else{
                    target=target.parentNode;
                }
            }
        }
        //判断
        if(eventType=='tap'){
            this.addEvent(eventType,function(eve){
                circleParent(eve);
            });
        }else{
            this.addEventListener(eventType,function(eve){
                circleParent(eve);
            });
        }
    }
})();