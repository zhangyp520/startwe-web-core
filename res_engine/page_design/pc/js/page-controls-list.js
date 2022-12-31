/** 默认未分类控件，不管是否使用调用方传入的控件列表 都可以使用的控件，如 插入文本， 插入表格一类****/
oui.ns('com.oui.absolute.AbsoluteDesign');
com.oui.absolute.AbsoluteDesign.controlsListHtmlTypes ={
    textInput:{
        display:'基础组件',
        name:'textInput',
        value:'textInput'
    },
    show:{
        display:'展示组件',
        name:'show',
        value:'show'
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
        "htmlType":"textInput",
        "controlType":"textfield",
        "showType":0,
        "formField":true,
        "name":"单行文字", 
        "style": "{ width: $('.paper-area-outer').width() ,height:60 }" ,
        "description":"单行文字", 
    },
    {
        "htmlType":"textInput",
        "controlType":"textarea",
        "showType":0,
        "formField":true,
        "name":"多行文字",
        "style": "{ width: $('.paper-area-outer').width() , height:100 }" ,
        "description":"多行文字" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"title",
        "showType":0, 
        "formField":false, 
        "name":"标题",
        "style": "{ width: $('.paper-area-outer').width() ,height:60 }" ,
        "description":"标题" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"describe",
        "showType":0,
        "formField":true,
        "name":"描述文字",
        "style": "{ width: $('.paper-area-outer').width() ,height:60 }" ,
        "description":"描述文字"
    } ,
    {
        "htmlType":"textInput",
        "controlType":"number",
        "showType":0,
        "formField":true,
        "name":"数字",
        "style": "{ width: $('.paper-area-outer').width() ,height:60 }" ,
        "description":"数字" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"phone",
        "showType":0,
        "formField":true,
        "name":"手机",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"手机" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"email",
        "showType":0,
        "formField":true,
        "name":"邮箱",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"邮箱" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"link",
        "showType":0,
        "formField":true,
        "name":"链接",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"链接" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"date",
        "showType":0,
        "formField":true,
        "name":"日期",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"日期" 
    }  ,
    {
        "htmlType":"textInput",
        "controlType":"timepicker",
        "showType":0,
        "formField":true,
        "name":"时间",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"时间" 
    }  ,
    // {
    //     "htmlType":"textInput",
    //     "controlType":"search_textInput",
    //     "showType":0,
    //     "formField":false,
    //     "name":"日期范围",
    //     "description":"日期范围" 
    // }  ,
    // {
    //     "htmlType":"textInput",
    //     "controlType":"search_textInput",
    //     "showType":0,
    //     "formField":false,
    //     "name":"时间范围",
    //     "description":"时间范围" 
    // } 
    // ,
    {
        "htmlType":"textInput",
        "controlType":"button",
        "showType":0, 
        "formField":false, 
        "name":"按钮",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"按钮" 
    } ,
    // {
    //     "htmlType":"textInput",
    //     "controlType":"attach",
    //     "showType":0,
    //     "formField":true,
    //     "name":"附件",
    //     "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
    //     "description":"附件" 
    // },
    {
        "htmlType":"textInput",
        "controlType":"switch",
        "showType":0,
        "formField":true,
        "name":"开关",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"开关" 
    }
    ,
    {
        "htmlType":"textInput",
        "controlType":"select",
        "showType":0,
        "formField":true,
        "name":"下拉选择",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        otherAttrs: {

            sourceType:'diy',
            sourceDiyValues:{
                defaultShow: "di0",
                items: [{
                    display: "选项1",
                    value: "1",
                    key: "di0"
                }, {
                    display: "选项2",
                    value: "2",
                    key: "di1"
                }, {
                    display: "选项3",
                    value: "3",
                    key: "di2"
                }]
            },opt:'in,notIn'
        },
        "description":"下拉选择" 
    },
    {
        "htmlType":"textInput",
        "controlType":"radio",
        "showType":0,
        "formField":true,
        "name":"单选",
        "style": "{ width: $('.paper-area-outer').width()  , height:100  }" ,
        otherAttrs: {

            sourceType:'diy',
            sourceDiyValues:{
                defaultShow: "di0",
                items: [{
                    display: "选项1",
                    value: "1",
                    key: "di0"
                }, {
                    display: "选项2",
                    value: "2",
                    key: "di1"
                }, {
                    display: "选项3",
                    value: "3",
                    key: "di2"
                }]
            },
            opt:'in,notIn'
        },
        "description":"单选" 
    } ,
    {
        "htmlType":"textInput",
        "controlType":"checkbox",
        "showType":0,
        "formField":true,
        "name":"复选",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        otherAttrs: {
            sourceType:'diy',
            sourceDiyValues:{
                multiple:true,
                defaultShow: "di0",
                items: [{
                    display: "选项1",
                    value: "1",
                    key: "di0"
                }, {
                    display: "选项2",
                    value: "2",
                    key: "di1"
                }, {
                    display: "选项3",
                    value: "3",
                    key: "di2"
                }]
            }
        },
        "description":"复选" 
    },
    
    {
        "htmlType":"textInput",
        "controlType":"splitline",
        "showType":0, 
        "formField":false, 
        "name":"分割线",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"分割线" 
    }
    ,
    
    {
        "htmlType":"textInput",
        "controlType":"richtext",
        "showType":0,
        "formField":true,
        "name":"富文本",
        "style":"{width:$('.paper-area-outer').width() , height:300}",
        "description":"富文本" 
    },
    {
        "htmlType":"textInput",
        "controlType":"counter",
        "showType":0,
        "formField":true,
        "name":"计数器",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"计数器"
    },
    {
        "htmlType":"textInput",
        "controlType":"position",
        "showType":0,
        "formField":true,
        "name":"定位",
        "style": "{ width: $('.paper-area-outer').width(),height:60  }" ,
        "description":"定位"
    },
    {
        "htmlType":"textInput",
        "controlType":"address",
        "showType":0,
        "formField":true,
        "name":"地址",
        "style": "{ width: $('.paper-area-outer').width(), height:60  }" ,
        "description":"地址" 
    },
    {
        "htmlType":"show",
        "controlType":"tableList",
        "showType":0,
        "formField":true,
        "name":"表格组件",
        "style": "{ width: $('.paper-area-outer').width() ,height:250 , layoutType:'hideTitle'}" ,
        "description":"表格组件" ,
        otherAttrs:{
            privateEventTypes:[
                {value:'loadData',display:'加载数据'},
                {value:'go2add',display:'添加'},
                {value:'impExcel',display:'导入'},
                {value:'expExcel',display:'导出'},
                {value:'batchRemove',display:'批量删除',eventInputParams:[{name:'rows',type:'array'}]},
                {value:'go2edit',display:'编辑',eventInputParams:[{name:'row',type:'object'}]},
                {value:'go2detail',display:'详情',eventInputParams:[{name:'row',type:'object'}]},
                {value:'removeOne',display:'删除行',eventInputParams:[{name:'row',type:'object'}]}
            ]
        }
    },
    {
        "htmlType":"show",
        "controlType":"txtTemplate",
        "showType":0,
        "formField":false,
        "name":"文字标签",
        "style": "{ width: $('.paper-area-outer').width() ,height:250 , layoutType:'hideTitle'}" ,
        "description":"文字标签" 
    }
];
 
  
 