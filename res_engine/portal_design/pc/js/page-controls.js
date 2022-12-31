
/** 默认未分类控件，不管是否使用调用方传入的控件列表 都可以使用的控件，如 插入文本， 插入表格一类****/
com.oui.absolute.AbsoluteDesign.defaultControls4Normal = [

    {
        "htmlType":"read",
        "controlType":"label",
        "showType":0,
        "formField":false,
        "name":"插入文本",
        "description":"插入文本",
        "fieldType":"string",
            innerStyle:{styleTitle:{textAlign:'center'}},
            "style":{width:793,height:60,layoutType:'onlyTitle'}
    },
    {
        "htmlType":"button",
        "controlType":"button",
        "showType":0,
        "formField":false,
        "name":"按钮",
        "description":"按钮",
        innerStyle:{
            styleFieldOuter:{
                textAlign:'center'
            }
        },
        "style":{width:793,height:60,layoutType:'hideTitle'}
    },
    {
        "htmlType":"read",
        "controlType":"image",
        "showType":0,
        "formField":false,
        "name":"查看图片",
        "fieldType":"string",
        "style":{width:300,height:300,layoutType:'hideTitle' }
    },
    {
        "htmlType":"read",//二维码
        "controlType":"qrcode",
        "showType":0,
        "formField":false,
        "name":"二维码",
        "fieldType":"string",
        "style":{width:300,height:300,layoutType:'hideTitle'}
    },
    {
        "htmlType":"read",//条型码
        "controlType":"barcode",
        "showType":0,
        "formField":false,
        "name":"条形码",
        "fieldType":"string",
        "style":{width:793,height:150,layoutType:'hideTitle'}
    },
    {
        "htmlType":"container",//容器
        "controlType":"tabs", //多页签
        "showType":1,
        "formField":false,
        "name":"多页签",
        "style":{width:793,height:210,layoutType:'hideTitle'},
        "innerStyle":{
            "styleInnerOuter":{
                "verticalAlign":"top"
            }
        },
        "otherAttrs":{
            data:[{id:oui.getUUIDLong(), value:oui.getUUIDLong(),display:'页签0',contentType:'none',pageId:'',url:'',content:''},{id:oui.getUUIDLong(),value:oui.getUUIDLong(),contentType:'none',display:'页签1',pageId:'',url:'',content:''}]
        }
    },
    {
        "htmlType":"customTable",//表格
        "controlType":"table", //表格
        "showType":0,
        "formField":false,
        "name":"自定义列表",
        "style":{width:793,height:210,layoutType:'hideTitle'},
        "innerStyle":{
            "styleInnerOuter":{
                "verticalAlign":"top"
            }
        },
        "otherAttrs":{
            data:[]
        }
    },
    {
        "htmlType":"tableLine",
        "controlType":"tableLine",
        "showType":0,
        "formField":false,
        "name":"插入表格",
        "fieldType":"string",
        "style":{
            width:600,height:210,
            borderLeftWidth:0,
            borderTopWidth:0,
            borderRightWidth:0,
            borderBottomWidth:0,
            lineHeight:1,
            columnSize:3,
            rowSize:3,
            columnLines:(function(){
                var me = com.oui.absolute.AbsoluteDesign;
                return me.createTableColumnLines({
                    style:{
                        width:600,height:210,
                        lineHeight:1,
                        lineColor:'#e6e6e6',
                        columnSize:3,
                        rowSize:3,
                        borderRightWidth:0,
                        borderBottomWidth:0,
                        borderLeftWidth:0,
                        borderTopWidth:0
                    }
                });
            })(), //默认3列(4条竖线)
            rowLines:(function(){
                var me = com.oui.absolute.AbsoluteDesign;
                return me.createTableRowLines({
                    style:{
                        width:600,height:210,
                        lineHeight:1,
                        lineColor:'#e6e6e6',
                        columnSize:3,
                        rowSize:3,
                        borderRightWidth:0,
                        borderBottomWidth:0,
                        borderLeftWidth:0,
                        borderTopWidth:0
                    }
                });
            })()//默认3行(4条横线)
        }
    },
    {
        "htmlType":"tableLine",
        "controlType":"detail",
        "showType":0,
        "formField":false,
        "name":"插入表格",
        "fieldType":"string",
        "otherAttrs": {
            "buttons":[{"round":false,"plain":true,"display":"添加","buttonShowType":"default","disabled":false,"id":oui.getUUIDLong(),"circle":false,"buttonLayout":"leftIcon","value":oui.getUUIDLong(),"contentType":"page","events":{"click":{"params":[],"startCode":"","bodyCode":"var detail = this.getDetail();//获取明细表\n//var pageData= detail.getPageData();//页面对象\ndetail.event2add(); //默认添加方法,当然这里可以自定义添加事件\n","endCode":"","returnType":"string"}}},{"plain":true,"display":"删除","buttonShowType":"danger","disabled":false,"id":oui.getUUIDLong(),"buttonLayout":"onlyText","value":oui.getUUIDLong(),"contentType":"page","buttonSize":"medium","events":{"click":{"params":[],"startCode":"","bodyCode":"var detail = this.getDetail(); //获取明细表对象\n//var pageData = detail.getPageData();//获取页面对象\ndetail.event2remove();//默认的删除事件，当然这里可以自定义扩展删除行逻辑\n","endCode":"","returnType":"string"}}}],
            "rowButtons":[{"plain":true,"display":"编辑","buttonShowType":"default","id":oui.getUUIDLong(),"buttonLayout":"onlyText","value":oui.getUUIDLong(),"contentType":"page","events":{"click":{"params":[],"startCode":"","bodyCode":"var detail = this.getDetail();//获取当前明细表\n//var pageData = detail.getPageData();//页面对象\n//var mainData = pageData.mainData;//主表数据\nvar rowIndex = this.rowIndex; //当前编辑行\ndetail.event2editRow(rowIndex);//编辑行","endCode":"","returnType":"string"}},"round":false,"buttonSize":"small"}],
            "editingButtons":[{"plain":true,"display":"确定","buttonShowType":"default","id":oui.getUUIDLong(),"buttonLayout":"onlyText","value":oui.getUUIDLong(),"contentType":"page","events":{"click":{"params":[],"startCode":"","bodyCode":"var detail = this.getDetail();//获取当前明细表\n//var pageData = detail.getPageData();//页面对象\n//var mainData = pageData.mainData;//主表数据\nvar rowIndex = this.rowIndex; //当前编辑行\ndetail.event2saveRow(rowIndex);//保存行","endCode":"","returnType":"string"}},"round":false,"buttonSize":"small"}]
        },
        "style":{
            width:600,height:120,
            borderLeftWidth:0,
            borderTopWidth:0,
            borderRightWidth:0,
            borderBottomWidth:0,
            lineHeight:1,
            columnSize:3,
            rowSize:2,
            columnLines:(function(){
                var me = com.oui.absolute.AbsoluteDesign;
                return me.createTableColumnLines({
                    style:{
                        width:600,height:120,
                        lineHeight:1,
                        lineColor:'#e6e6e6',
                        columnSize:3,
                        rowSize:2,
                        borderRightWidth:0,
                        borderBottomWidth:0,
                        borderLeftWidth:0,
                        borderTopWidth:0
                    }
                });
            })(), //默认3列(4条竖线)
            rowLines:(function(){
                var me = com.oui.absolute.AbsoluteDesign;
                return me.createTableRowLines({
                    style:{
                        width:600,height:120,
                        lineHeight:1,
                        lineColor:'#e6e6e6',
                        columnSize:3,
                        rowSize:2,
                        borderRightWidth:0,
                        borderBottomWidth:0,
                        borderLeftWidth:0,
                        borderTopWidth:0
                    }
                });
            })()//默认3行(4条横线)
        }
    }
];
/*** 基本分类控件*****/
com.oui.absolute.AbsoluteDesign.defaultControls =[
/** id,name,htmlType,controlType,fieldType**/
    {
        "htmlType":"button",
        "controlType":"button",
        "showType":0,
        "formField":false,
        "name":"按钮"
    },
    {
        "htmlType":"tableLine",
        "controlType":"tableLine",
        "showType":0,
        "formField":false,
        "name":"插入格子"
    },
    {
        "htmlType":"container",
        "controlType":"search_container",
        "showType":0,
        "formField":false,
        "name":"查询容器"
    },
    {
        "htmlType":"tableLine",
        "controlType":"detail",
        "showType":0,
        "formField":false,
        "name":"插入数据格子"
    },
    {
        "htmlType":"customTable",
        "controlType":"table",
        "showType":0,
        "formField":false,
        "name":"自定义列表"
    },
    {
        "htmlType":"container",
        "controlType":"tabs",
        "showType":0,
        "formField":false,
        "name":"多页签"
    },
    {
        "htmlType":"textInput",
        "controlType":"textfield",
        "showType":0,
        "formField":true,
        "name":"单行输入框",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"textInput",
        "controlType":"textarea",
        "showType":0,
        "formField":true,
        "name":"多行输入框",
        "fieldType":"string",
        "style":{width:793,height:80}
    },
    {
        "htmlType":"textInput",
        "controlType":"number",
        "showType":0,
        "formField":true,
        "name":"数字输入框",
        "fieldType":"number",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"textInput",
        "controlType":"cellphone",
        "showType":0,
        "formField":true,
        "name":"手机",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    //登录控件
    {
        "htmlType":"textInput",
        "controlType":"loginaccount",
        "showType":0,
        "formField":true,
        "name":"登录账号框",
        "fieldType":"string",
        "style":{width:779,height:60}
    },
    {
        "htmlType":"textInput",
        "controlType":"password",
        "showType":0,
        "formField":true,
        "name":"登录密码框",
        "fieldType":"string",
        "style":{width:779,height:60}
    },
    {
        "htmlType":"textInput",
        "controlType":"loginverify",
        "showType":0,
        "formField":true,
        "name":"登录验证码框",
        "fieldType":"string",
        "style":{width:779,height:60}
    },
    {
        "htmlType":"selectInput",//
        "controlType":"condition", //条件组件
        "showType":3,
        "name":"条件组件",
        "formField":false,
        "style":{width:793,height:210,layoutType:'hideTitle'},
        "innerStyle":{
            "styleInnerOuter":{
                "verticalAlign":"top"
            }
        },
        "otherAttrs":{
            fields:[],
            conditions:[]
        }
    },
    {
        "htmlType":"selectInput",
        "controlType":"singleselect",
        "showType":0,
        "formField":true,
        "name":"下拉框",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"datepicker",
        "showType":0,
        "formField":true,
        "name":"日期",
        "fieldType":"date",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"datetime",
        "showType":0,
        "formField":true,
        "name":"日期时间",
        "fieldType":"datetime",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"timepicker",
        "formField":true,
        "showType":0,
        "name":"时间",
        "fieldType":"time",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"uploadimage",
        "showType":0,
        "formField":true,
        "name":"上传图片",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"attachment",
        "showType":0,
        "formField":true,
        "name":"附件",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"address",
        "showType":0,
        "formField":true,
        "name":"省市区",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"outercontrol",
        "showType":0,
        "formField":true,
        "name":"外部控件",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"lbs",
        "showType":0,
        "formField":true,
        "name":"地理位置",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"selectperson",
        "showType":0,
        "formField":true,
        "name":"选人",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"selectInput",
        "controlType":"selectdept",
        "showType":0,
        "formField":true,
        "name":"选部门",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"repeatSelect",
        "controlType":"radio",
        "showType":0,
        "formField":true,
        "name":"单选",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"repeatSelect",
        "controlType":"multiselect",
        "showType":0,
        "formField":true,
        "name":"多选",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"repeatSelect",
        "controlType":"switch",
        "showType":0,
        "formField":true,
        "name":"开关",
        "fieldType":"boolean",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"repeatSelect",
        "controlType":"score",
        "showType":0,
        "formField":true,
        "name":"评分",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"repeatSelect",
        "controlType":"imagesingle",
        "showType":0,
        "formField":true,
        "name":"图片单选",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"repeatSelect",
        "controlType":"imagemulti",
        "showType":0,
        "formField":true,
        "name":"图片多选",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"image",
        "showType":0,
        "formField":false,
        "name":"查看图片"
    },
    {
        "htmlType":"read",//二维码
        "controlType":"qrcode",
        "showType":0,
        "formField":false,
        "name":"二维码"
    },
    {
        "htmlType":"read",//条型码
        "controlType":"barcode",
        "showType":0,
        "formField":false,
        "name":"条形码"
    },
    {
        "htmlType":"read",
        "controlType":"hidden",
        "showType":0,
        "formField":true,
        "name":"隐藏框",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"seperateline",
        "showType":0,
        "formField":false,
        "name":"分割线",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"label",
        "showType":0,
        "formField":false,
        "name":"文字说明",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"imagegroup",
        "showType":0,
        "formField":false,
        "name":"图片组",
        "style":{width:400,height:300}
    },
    {
        "htmlType":"read",
        "controlType":"serialnumber",
        "showType":0,
        "formField":true,
        "name":"流水号",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"video",
        "showType":0,
        "formField":true,
        "name":"视频",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"mixedplay",
        "showType":0,
        "formField":true,
        "name":"混播",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"doc",
        "showType":0,
        "formField":true,
        "name":"文档",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"streammedia",
        "showType":0,
        "formField":true,
        "name":"流媒体",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"webpage",
        "showType":0,
        "formField":true,
        "name":"网页",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"richtext",
        "showType":0,
        "formField":true,
        "name":"富文本",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"subtitles",
        "showType":0,
        "formField":true,
        "name":"字幕",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"weather",
        "showType":0,
        "formField":true,
        "name":"天气",
        "fieldType":"string",
        "style":{width:793,height:360}
    },
    {
        "htmlType":"read",
        "controlType":"countdown",
        "showType":0,
        "formField":true,
        "name":"倒计时",
        "fieldType":"string",
        "style":{width:793,height:60}
    },
    {
        "htmlType":"read",
        "controlType":"pag",
        "showType":0,
        "formField":false,
        "name":"分页",
        "fieldType":"string",
        "style":{width:793,height:60,layoutType:'hideTitle'}
    },
    {
        "htmlType":"read",
        "controlType":"carousel",
        "showType":0,
        "formField":false,
        "name":"轮播图",
        "fieldType":"string",
        "style":{width:793,height:60,layoutType:'hideTitle'}
    },
    {
        "htmlType":"read",
        "controlType":"calendar",
        "showType":0,
        "formField":false,
        "name":"日历",
        "fieldType":"string",
        "style":{width:793,height:60,layoutType:'hideTitle'}
    },
    {
        "htmlType":"read",
        "controlType":"inputNumber",
        "showType":0,
        "formField":false,
        "name":"计数器",
        "fieldType":"string",
        "style":{width:793,height:60,layoutType:'hideTitle'}
    },

    {
        "htmlType":"read",
        "controlType":"layout",
        "showType":0,
        "formField":false,
        "name":"布局",
        "fieldType":"string",
        "style":{width:793,height:60,layoutType:'hideTitle'},
        
    },
    // {
    //     "htmlType":"other",
    //     "controlType":"textbutton",
    //     "showType":0,
    //     "formField":false,
    //     "name":"文本按钮",
    //     "fieldType":"string",
    //     "style":{width:793,height:60}
    // }
];


com.oui.absolute.AbsoluteDesign.listAssembly = [
    {
        "htmlType":"tableLine",
        "controlType":"tableLine",
        "showType":0,
        "formField":false,
        "name":"通用容器"
    },
    {
        "htmlType":"container",
        "controlType":"project_table",
        "showType":0,
        "formField":false,
        "name":"列表组件",
    },
    {
        "htmlType":"container",
        "controlType":"project-query",
        "showType":0,
        "formField":false,
        "name":"查询组件"
    },
    {
        "htmlType":"container",
        "controlType":"button",
        "showType":0,
        "formField":false,
        "name":"按钮组件"
    },
    {
        "htmlType":"container",
        "controlType":"pag",
        "showType":0,
        "formField":false,
        "name":"查询按钮"
    },
    {
        "htmlType":"container",
        "controlType":"project_addBut",
        "showType":0,
        "formField":false,
        "name":"新增按钮"
    },
    {
        "htmlType":"container",
        "controlType":"project_editBut",
        "showType":0,
        "formField":false,
        "name":"编辑按钮"
    },
    {
        "htmlType":"container",
        "controlType":"project_deleteBut",
        "showType":0,
        "formField":false,
        "name":"删除按钮"
    },
    {
        "htmlType":"container",
        "controlType":"pag",
        "showType":0,
        "formField":false,
        "name":"分页按钮"
    },
    {
        "htmlType":"container",
        "controlType":"project-page",
        "showType":0,
        "formField":false,
        "name":"分页组件"
    },
]

com.oui.absolute.AbsoluteDesign.editAssembly = [
    {
        "type":1,
        "htmlType":"tableLine",
        "controlType":"tableLine",
        "showType":0,
        "formField":false,
        "name":"通用容器"
    },
    {
        "type":1,
        "htmlType":"container",
        "controlType":"project_table",
        "showType":0,
        "formField":false,
        "name":"栅格布局"
    },
    {
        "type":2,
        "htmlType":"textInput",
        "controlType":"textfield",
        "showType":0,
        "formField":false,
        "name":"文本"
    },
    {
        "type":2,
        "htmlType":"read",
        "controlType":"image",
        "showType":0,
        "formField":false,
        "name":"图片"
    },
    // {
    //     "type":2,
    //     "htmlType":"container",
    //     "controlType":"pag",
    //     "showType":0,
    //     "formField":false,
    //     "name":"图标"
    // },
    // {
    //     "type":2,
    //     "htmlType":"container",
    //     "controlType":"pag",
    //     "showType":0,
    //     "formField":false,
    //     "name":"链接"
    // },
    {
        "type":2,
        "htmlType":"button",
        "controlType":"button",
        "showType":0,
        "formField":false,
        "name":"按钮"
    },
    // {
    //     "type":3,
    //     "htmlType":"container",
    //     "controlType":"pag",
    //     "showType":0,
    //     "formField":false,
    //     "name":"下拉单选"
    // },
    // {
    //     "type":3,
    //     "htmlType":"container",
    //     "controlType":"pag",
    //     "showType":0,
    //     "formField":false,
    //     "name":"下拉多选"
    // },
    {
        "type":3,
        "htmlType":"repeatSelect",
        "controlType":"radio",
        "showType":0,
        "formField":false,
        "name":"单选"
    },
    {
        "type":3,
        "htmlType":"repeatSelect",
        "controlType":"multiselect",
        "showType":0,
        "formField":false,
        "name":"多选"
    },
]

com.oui.absolute.AbsoluteDesign.Chart = [
    {
        "htmlType":"container",
        "controlType":"project-Histogram",
        "showType":0,
        "formField":false,
        "name":"柱状图"
    },
]



