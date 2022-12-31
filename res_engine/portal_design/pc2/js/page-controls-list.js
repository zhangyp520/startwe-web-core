/** 默认未分类控件，不管是否使用调用方传入的控件列表 都可以使用的控件，如 插入文本， 插入表格一类****/

com.oui.absolute.AbsoluteDesign.controlsListHtmlTypes = {
    layout: {
        display: '布局组件',
        name: 'layout',
        value: 'layout'
    },
    navigation: {
        display: '导航组件',
        name: 'navigation',
        value: 'navigation'
    },
    show: {
        display: '展示组件',
        name: 'show',
        value: 'show'
    },
    chart: {
        display: '图表组件',
        name: 'show',
        value: 'show'
    },
    form: {
        display: '图表组件',
        name: 'form',
        value: 'form'
    },
    tableLine: {
        display: '布局组件2',
        name: 'tableLine',
        value: 'tableLine'
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
 * 门户呈现的相关控件  布局组件
 * */
com.oui.absolute.AbsoluteDesign.pageListControls = [

    {
        "htmlType": "layout",
        "controlType": "layoutPortal",
        "showType": 0,
        "formField": false,
        "name": "布局",
        // otherAttrs:{width:100},
        "description": "布局",
        "style": {
            "fontSize": '12',
            color: 'red',
            layoutType: 'hideTitle',
            width: $('.paper-area-outer').width(),
            height: $('.paper-area-outer').height()
        },

    },
    {
        "htmlType": "layout",
        "controlType": "layoutPortal_2",
        "showType": 0,
        "formField": false,
        "name": "布局-2",
        // otherAttrs:{width:100},
        "description": "布局-2",
        // "style":{ "fontSize":'12',color:'red',layoutType:'hideTitle',width: $('.paper-area-outer').width(),height:$('.paper-area-outer').height()},

        "style": {
            "width": 803,
            "height": 503,
            "layoutType":'hideTitle',
            "columnLines": [{
                    "fromPos": {
                        "left": 0,
                        "top": 0
                    },
                    "toPos": {
                        "left": 0,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 2
                    }
                },
                {
                    "fromPos": {
                        "left": 199.66666666666666,
                        "top": 0
                    },
                    "toPos": {
                        "left": 199.66666666666666,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 399.3333333333333,
                        "top": 0
                    },
                    "toPos": {
                        "left": 399.3333333333333,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 792,
                        "top": 0
                    },
                    "toPos": {
                        "left": 599,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                }
            ],
            "rowLines": [{
                    "fromPos": {
                        "left": 0,
                        "top": 0
                    },
                    "toPos": {
                        "left": 599,
                        "top": 0
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 0,
                        "top": 69.66666666666667
                    },
                    "toPos": {
                        "left": 599,
                        "top": 69.66666666666667
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 0,
                        "top": 473.33333333333337
                    },
                    "toPos": {
                        "left": 599,
                        "top": 139.33333333333334
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 0,
                        "top": 549
                    },
                    "toPos": {
                        "left": 599,
                        "top": 620
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                }
            ],
            "left": 0,
            "top": 0,
        },
    },
    {
        "htmlType": "layout",
        "controlType": "container",
        "showType": 0,
        "formField": false,
        "name": "容器",
        // "style": "{ width: $('.paper-area-outer').width()  }" ,
        "style": {
            "fontSize": '12',
            color: 'red',
            layoutType: 'hideTitle',
            width: $('.paper-area-outer').width(),
            height: $('.paper-area-outer').height()
        },
        "description": "容器"
    },
    {
        "htmlType": "layout",
        "controlType": "grid",
        "showType": 0,
        "formField": false,
        "name": "栅格",
        "style": "{ width: $('.paper-area-outer').width() , height:100 }",
        "description": "栅格"
    },
    {
        "htmlType": "layout",
        "controlType": "tab",
        "showType": 0,
        "formField": false,
        "name": "选项卡",
        "style": "{ width: $('.paper-area-outer').width()  }",
        "description": "选项卡"
    },
    {
        "htmlType": "layout",
        "controlType": "divider",
        "showType": 0,
        "formField": false,
        "name": "分割线",
        "style": "{ width: $('.paper-area-outer').width()  }",
        "description": "分割线"
    },
    {
        "htmlType": "layout",
        "controlType": "paragraph",
        "showType": 0,
        "formField": false,
        "name": "段落",
        "style": "{ width: $('.paper-area-outer').width()  }",
        "description": "段落"
    },
    {
        "htmlType": "layout",
        "controlType": "gutter",
        "showType": 0,
        "formField": false,
        "name": "间距",
        "style": "{ width: $('.paper-area-outer').width()  }",
        "description": "间距"
    },
    {
        "htmlType": "layout",
        "controlType": "iframe",
        "showType": 0,
        "formField": false,
        "name": "iframe",
        "style": "{ width: $('.paper-area-outer').width()  }",
        "description": "iframe"
    },
    {
        "style": {
            "width": 793,
            "height": 550,
            "lineHeight": 1,
            "columnSize": 3,
            "rowSize": 3,
            "mergeCellsMap": {
                "0_0": {

                    "left": 1,
                    "top": 1,
                    "right": 792,
                    "bottom": 69.66666666666667,
                    "startColumnIndex": 0,
                    "startRowIndex": 0,
                    "endColumnIndex": 2,
                    "endRowIndex": 0
                },
                "0_1": {

                    "left": 1,
                    "top": 70.66666666666667,
                    "right": 199.66666666666666,
                    "bottom": 549,
                    "startColumnIndex": 0,
                    "startRowIndex": 1,
                    "endColumnIndex": 0,
                    "endRowIndex": 2
                },
                "1_1": {

                    "left": 200.66666666666666,
                    "top": 70.66666666666667,
                    "right": 792,
                    "bottom": 473.33333333333337,
                    "startColumnIndex": 1,
                    "startRowIndex": 1,
                    "endColumnIndex": 2,
                    "endRowIndex": 1
                },
                "1_2": {

                    "left": 200.66666666666666,
                    "top": 474.33333333333337,
                    "right": 792,
                    "bottom": 549,
                    "startColumnIndex": 1,
                    "startRowIndex": 2,
                    "endColumnIndex": 2,
                    "endRowIndex": 2
                }
            },
            "columnLines": [{
                    "fromPos": {
                        "left": 0,
                        "top": 0
                    },
                    "toPos": {
                        "left": 0,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 199.66666666666666,
                        "top": 0
                    },
                    "toPos": {
                        "left": 199.66666666666666,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 399.3333333333333,
                        "top": 0
                    },
                    "toPos": {
                        "left": 399.3333333333333,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 792,
                        "top": 0
                    },
                    "toPos": {
                        "left": 599,
                        "top": 209
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                }
            ],
            "rowLines": [{
                    "fromPos": {
                        "left": 0,
                        "top": 0
                    },
                    "toPos": {
                        "left": 599,
                        "top": 0
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 10,
                    }
                },
                {
                    "fromPos": {
                        "left": 0,
                        "top": 69.66666666666667
                    },
                    "toPos": {
                        "left": 599,
                        "top": 69.66666666666667
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 0,
                        "top": 473.33333333333337
                    },
                    "toPos": {
                        "left": 599,
                        "top": 139.33333333333334
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                },
                {
                    "fromPos": {
                        "left": 0,
                        "top": 549
                    },
                    "toPos": {
                        "left": 599,
                        "top": 620
                    },
                    "config": {
                        "color": "#e6e6e6",
                        "lineHeight": 1
                    }
                }
            ]

        },
        "htmlType": "tableLine",
        "controlType": "tableLine",
        "showType": 0,
        "formField": false,
        "name": "插入表格"

    },
    // {
    //     "htmlType":"layout",
    //     "controlType":"header",
    //     "showType":0,
    //     "formField":false,
    //     "name":"Header容器",
    //     "style": { width: $('.paper-area-outer').width(),layoutType:'hideTitle',minHeight:'70' },
    //     "description":"Header容器" 
    // } ,
    // {
    //     "htmlType":"layout",
    //     "controlType":"aside",
    //     "showType":0,
    //     "formField":false,
    //     "name":"Aside容器",
    //     "style": "{ width: $('.paper-area-outer').width(),layoutType:'hideTitle' }" ,
    //     "description":"Aside容器" 
    // } ,
    // 导航组件开始
    {
        "htmlType": "navigation",
        "controlType": "menu",
        "showType": 0,
        "formField": false,
        "name": "菜单",
        // otherAttrs:{width:100},
        "style": {
            "fontSize": '12',
            color: 'red',
            layoutType: 'hideTitle',
            width: $('.paper-area-outer').width(),
            height: $('.paper-area-outer').height()
        },
        "description": "菜单"
    },

];