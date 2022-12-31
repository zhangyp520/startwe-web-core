
/** 默认未分类控件，不管是否使用调用方传入的控件列表 都可以使用的控件，如 插入文本， 插入表格一类****/

com.oui.absolute.AbsoluteDesign.controlsListHtmlTypes ={
    layout:{
        display:'布局组件',
        name:'layout',
        value:'layout'
    },
    navigation:{
        display:'导航组件',
        name:'navigation',
        value:'navigation'
    },
    show:{
        display:'展示组件',
        name:'show',
        value:'show'
    },
    chart:{
        display:'图表组件',
        name:'show',
        value:'show'
    },
    form:{
        display:'图表组件',
        name:'form',
        value:'form'
    }
};
/**
 * controlType 对应组件名称README.en.md的第二步的组件名称对应上
 * formField 是否是表单输入控件
 * showType 组件呈现对应模板显示位置，默认下标对应0
 * name 侧边栏对应组件标题
 * description 组件描述内容，输入后，再选择组件可回填输入内容
 * fieldType 字段类型，dataType数据类型，controlType控件类型,有数据交互的才有 "fieldType":"string"，没有数据交互（没有数据保存到数据库）就可以不配置此参数
 * innerStyle   配置组件标题和实际控件的样式
 * style  控件最外层样式
 * */  


/**
 * 列表呈现的相关控件
 * */ 
com.oui.absolute.AbsoluteDesign.pageListControls = [

    {
        "htmlType":"layout",
        "controlType":"button",
        "showType":0,
        "formField":false,
        "name":"布局",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"布局", 
    },
    {
        "htmlType":"layout",
        "controlType":"grid",
        "showType":0,
        "formField":false,
        "name":"栅格",
        "style": "{ width: $('.paper-area-outer').width() , height:100 }" ,
        "description":"栅格" 
    } ,
    {
        "htmlType":"layout",
        "controlType":"container2",
        "showType":0,
        "formField":false,
        "name":"容器",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"容器" 
    } ,
    {
        "htmlType":"layout",
        "controlType":"tab",
        "showType":0,
        "formField":false,
        "name":"选项卡",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"选项卡"
    } ,
    {
        "htmlType":"layout",
        "controlType":"divider",
        "showType":0,
        "formField":false,
        "name":"分割线",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"分割线" 
    } ,
    {
        "htmlType":"layout",
        "controlType":"paragraph",
        "showType":0,
        "formField":false,
        "name":"段落",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"段落" 
    } ,
    {
        "htmlType":"layout",
        "controlType":"gutter",
        "showType":0,
        "formField":false,
        "name":"间距",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"间距" 
    } ,
    {
        "htmlType":"layout",
        "controlType":"iframe",
        "showType":0,
        "formField":false,
        "name":"iframe",
        "style": "{ width: $('.paper-area-outer').width()  }" ,
        "description":"iframe" 
    } ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"date",
    //     "showType":0,
    //     "formField":false,
    //     "name":"日期",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"日期" 
    // }  ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"timepicker",
    //     "showType":0,
    //     "formField":false,
    //     "name":"时间",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"时间" 
    // }  ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"search_codition",
    //     "showType":0,
    //     "formField":false,
    //     "name":"日期范围",
    //     "description":"日期范围" 
    // }  ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"search_codition",
    //     "showType":0,
    //     "formField":false,
    //     "name":"时间范围",
    //     "description":"时间范围" 
    // } 
    // ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"button",
    //     "showType":0,
    //     "formField":false,
    //     "name":"按钮",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"按钮" 
    // } ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"attach",
    //     "showType":0,
    //     "formField":false,
    //     "name":"附件",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"附件" 
    // },
    // {
    //     "htmlType":"codition",
    //     "controlType":"switch",
    //     "showType":0,
    //     "formField":false,
    //     "name":"开关",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"开关" 
    // }
    // ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"select",
    //     "showType":0,
    //     "formField":false,
    //     "name":"下拉选择",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"下拉选择" 
    // },
    // {
    //     "htmlType":"codition",
    //     "controlType":"radio",
    //     "showType":0,
    //     "formField":false,
    //     "name":"单选",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"单选" 
    // } ,
    // {
    //     "htmlType":"codition",
    //     "controlType":"checkbox",
    //     "showType":0,
    //     "formField":false,
    //     "name":"复选",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"复选" 
    // },
    
    // {
    //     "htmlType":"codition",
    //     "controlType":"splitline",
    //     "showType":0,
    //     "formField":false,
    //     "name":"分割线",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"分割线" 
    // }
    // ,
    
    // {
    //     "htmlType":"codition",
    //     "controlType":"richtext",
    //     "showType":0,
    //     "formField":false,
    //     "name":"富文本",
    //     "description":"富文本" 
    // },
    // {
    //     "htmlType":"codition",
    //     "controlType":"counter",
    //     "showType":0,
    //     "formField":false,
    //     "name":"计数器",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"计数器"
    // },
    // {
    //     "htmlType":"codition",
    //     "controlType":"position",
    //     "showType":0,
    //     "formField":false,
    //     "name":"定位",
    //     "style": "{ width: $('.paper-area-outer').width(),height:40  }" ,
    //     "description":"定位"
    // },
    // {
    //     "htmlType":"codition",
    //     "controlType":"address",
    //     "showType":0,
    //     "formField":false,
    //     "name":"地址",
    //     "style": "{ width: $('.paper-area-outer').width()  }" ,
    //     "description":"地址" 
    // }
];
 
  



