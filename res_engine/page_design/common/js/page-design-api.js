/*********************************************************************************************************
 *
 *  绝对布局设计器，输入参数：
 *  var params ={
    buttons:'print,save',
    bizJs:[oui.getContextPath()+'res_engine/page_design/pc/js/page-plugin.js'],//设计态，运行态
    mainTemplate:"",//获取页面业务属性设置的模板js方法名
    controls:[
     {
         "id":"controls_312321",//设计器自动生成
         "parentId":"", //父id，如果在主表中的控件，值为page.id,如果是明细表中的控件，值为明细表Id
         "controlType":"textInput",//控件基础类型
         "bizControlType":"textarea",//控件的业务类型
         "configTemplate":"abc",  //获取模板的JS方法名，根据bizControlType作为分类
         "showType":0,
         "formField":true,//是否是可提交的表单字段
         "title":"多行文本",
         "icon":"1.gif", //自定义 图标 可为空，如果在自定义的bizCss中追加了样式路径，可以通过样式控制 待拖拽区域样式，设计区域样式，运行态样式，属性面板样式
         "otherAttrs":{}
     }],
     saveCallBack:'saveCallback',//保存回调
     page:{} //设计器json
    }

    输出参数：
    saveCallBack(mainConfig,controlConfig,page);//保存

    printCallBack(mainConfig,controlConfig,page);//打印
************************************************************************************/



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
}


