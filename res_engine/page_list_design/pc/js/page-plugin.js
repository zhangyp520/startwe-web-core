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
        alert('保存回调');
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
        cfg[field.id]
    }

})(window,com.oui.DesignBiz);//脚本插件执行前，会根据 命名包自动创建命名对象,并可以根据对象获取设计器对象

