
/** 默认未分类控件，不管是否使用调用方传入的控件列表 都可以使用的控件，如 插入文本， 插入表格一类****/

oui.ns('com.oui.absolute.AbsoluteDesign');
com.oui.absolute.AbsoluteDesign.controlsListHtmlTypes ={
    codition:{
        display:'基础组件',
        name:'codition',
        value:'codition'
    },
    read:{
        display:'高级组件',
        name:'read',
        value:'read'
    },
    advance:{
        name:'advance',
        value:'advance',
        display:'高级'
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
        "htmlType":"codition",
        "controlType":"textfield",
        "showType":0,
        "formField":false,
        "name":"单行文字",
        "description":"单行文字", 
    },
    {
        "htmlType":"codition",
        "controlType":"textarea",
        "showType":0,
        "formField":false,
        "name":"多行文字",
        "description":"多行文字" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"title",
        "showType":0,
        "formField":false,
        "name":"标题",
        "description":"标题" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"describe",
        "showType":0,
        "formField":false,
        "name":"描述文字",
        "description":"描述文字"
    } ,
    {
        "htmlType":"codition",
        "controlType":"number",
        "showType":0,
        "formField":false,
        "name":"数字",
        "description":"电话" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"email",
        "showType":0,
        "formField":false,
        "name":"邮箱",
        "description":"邮箱" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"link",
        "showType":0,
        "formField":false,
        "name":"链接",
        "description":"链接" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"date",
        "showType":0,
        "formField":false,
        "name":"日期",
        "description":"日期" 
    }  ,
    {
        "htmlType":"codition",
        "controlType":"timepicker",
        "showType":0,
        "formField":false,
        "name":"时间",
        "description":"时间" 
    }  ,
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
    {
        "htmlType":"codition",
        "controlType":"button",
        "showType":0,
        "formField":false,
        "name":"按钮",
        "description":"按钮" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"switch",
        "showType":0,
        "formField":false,
        "name":"开关",
        "description":"开关" 
    }
    ,
    {
        "htmlType":"codition",
        "controlType":"dropdown_codition",
        "showType":0,
        "formField":false,
        "name":"下拉选择",
        "description":"下拉选择" 
    },
    {
        "htmlType":"codition",
        "controlType":"radio",
        "showType":0,
        "formField":false,
        "name":"单选",
        "description":"单选" 
    } ,
    {
        "htmlType":"codition",
        "controlType":"checkbox",
        "showType":0,
        "formField":false,
        "name":"复选",
        "description":"复选" 
    },
    
    {
        "htmlType":"codition",
        "controlType":"line",
        "showType":0,
        "formField":false,
        "name":"分割线",
        "description":"分割线" 
    }
    ,
    
    {
        "htmlType":"codition",
        "controlType":"richtext",
        "showType":0,
        "formField":false,
        "name":"富文本",
        "description":"富文本" 
    },
    {
        "htmlType":"codition",
        "controlType":"counter",
        "showType":0,
        "formField":false,
        "name":"计数器",
        "description":"计数器"
    },
    {
        "htmlType":"codition",
        "controlType":"position",
        "showType":0,
        "formField":false,
        "name":"定位",
        "description":"定位"
    },
    {
        "htmlType":"codition",
        "controlType":"address",
        "showType":0,
        "formField":false,
        "name":"地址",
        "description":"地址" 
    }
];
 
  



