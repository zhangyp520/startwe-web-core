!(function(win){
    /** 插件js执行前，已经绑定获取设计器方法*****/


    /** 业务控件类型枚举， ******/
    var BizControlTypeEnum = {
        'selectperson':{
            icon:'',
            "controlType":"textInput",//控件基础类型
            "bizControlType":"textarea",//控件的业务类型
            "configTemplate":"",  //获取模板的JS方法名，根据bizControlType作为分类
            getDisplay:function(field,data){

            }
        },
        'datepicker':{

        },
        'cellphone':{

        }
    };

})(window );//脚本插件执行前，会根据 命名包自动创建命名对象,并可以根据对象获取设计器对象

