!(function(win,plugin){
    /** 插件js执行前，已经绑定获取设计器方法*****/
    var designer  = plugin.getDesigner();

    var paramsCfg = designer.paramCfg; //获取 页面设计前的输入参数,调用处传入的参数

    /** 业务控件类型枚举， ******/
    var BizControlTypeEnum = {
        'selectperson':{
            icon:'',
            "controlType":"textInput",//控件基础类型
            "bizControlType":"textarea",//控件的业务类型
            "configTemplate":"findTextAreaBizProps4configTemplate",  //获取模板的JS方法名，根据bizControlType作为分类
            templateHtml:'<div></div>',
            getDisplay:function(field,data){

            }
        },
        'datepicker':{

        },
        'cellphone':{

        }
    };
    plugin.findTextAreaBizProps4configTemplate = function(){
        //
        return BizControlTypeEnum.templateHtml;
    };

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

})(window,com.oui.DesignBiz);//脚本插件执行前，会根据 命名包自动创建命名对象,并可以根据对象获取设计器对象

