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
            cmd:'cmd4savePageDesign',// 发送 保存页面定义的命令
            param:{
                guideId:oui.getParam('guideId'),
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
                    guideId:param.guideId
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
    //扩展设计器插件 用于回填元素dom信息绑定到控件上
    designer.cmd4pickDomFillBack = function (data,event){
        //这是一个监听来自chrome插件的消息 用于回填当前设计器的控件和元素选择器的绑定；
        var currentControl = designer.data.currentControl;
        //var control = designer.getControlById(data.controlId);
        var s = data.selector ||{};
        var temp =currentControl.otherAttrs.selector;
        for(var k in s){
            temp[k] = s[k];
        }
        designer.refreshBizProps();
        //designer.refreshBizProps();
    };
})(window,com.oui.DesignBiz);//脚本插件执行前，会根据 命名包自动创建命名对象,并可以根据对象获取设计器对象

