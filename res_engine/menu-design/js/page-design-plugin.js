!(function(win,plugin){
    /** 插件js执行前，已经绑定获取设计器方法*****/
    var designer  = plugin.getDesigner();

    var paramsCfg = designer.paramCfg; //获取 页面设计前的输入参数,调用处传入的参数
    /** 保存回调****/
    plugin.saveCallback = function(mainConfig,controlConfig,page){
        console.log('mainConfig');
        console.log(mainConfig);
        console.log('controlConfig');
        console.log(controlConfig);
        console.log('page');
        console.log(page);
        //保存成功后需要保存表单定义与自动采集任务建立关联 根据pageDesignId作为关联
        window.parent.postMessage({
            cmd:'cmd4saveMenuPageDesign',// 发送 保存页面定义的命令
            param:{
                page:page
            }
        },'*');
    };
    plugin.hello = function(){
        return 'hello'
    };
    /** 打印事件post提交回调后执行打印逻辑***/
    plugin.printCallback = function(res){
        alert('打印数据前post回调');
    };
    var cfg = {
        kyeL:'xxxx'
    };
    plugin.getDisplay  =function(field,data){

    };

    //删除表单定义回调处理
    designer.removeCallback = function(){
        var param = oui.getParam();
        oui.biz.api('removePageDesign',{ //删除表单定义
            id:param.id
        },function(res){
            //删除成功后 发送消息到 portal,通过portal驱动删除自动任务
            window.parent.postMessage({
                cmd:'cmd4removeGuide',// 发送 保存页面定义的命令
                param:{
                }
            },'*');
        },function(res){
            console.log('加载表单失败');
            console.log(res);
        });
    };
    /***
     * 保存成功回调 的命令监听
     * @param data
     * @param event
     */
    designer.cmd4saveCallbackSuccess = function(data,event){
      oui.alert(data.message);
    };
})(window,com.oui.DesignBiz);//脚本插件执行前，会根据 命名包自动创建命名对象,并可以根据对象获取设计器对象

