!(function (win, plugin) {
    

 

        /** 插件js执行前，已经绑定获取设计器方法*****/
var designer = plugin.getDesigner();
   
var paramsCfg = designer.paramCfg; //获取 页面设计前的输入参数,调用处传入的参数

    /** 保存回调****/
    plugin.saveCallBack = function (mainConfig, controlConfig, page) {


        var postUrl = com.oui.absolute.AbsoluteDesign.saveUrl;

        postUrl = oui.setParam(postUrl,'id',com.oui.absolute.AbsoluteDesign.data.id); 

        oui.postData(postUrl, {
            page:page
        }, function (res) {
 
            oui.getTop().oui.alert('保存成功');
            //刷新表格
           // setTimeout(function(){
                //window.location.reload();
                //designer.close();
           // },500);
        });
    };
 




})(window, com.oui.DesignBiz);//脚本插件执行前，会根据 命名包自动创建命名对象,并可以根据对象获取设计器对象