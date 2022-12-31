var exportFun  = function(){
    var arr = [];
    var data = [
        {
            "pc": "本科普通批次",
            "list": [
                {
                    "index": 1,
                    "code": "4425",
                    "name": "深圳大学",
                    "majorgroup": "不限选考科目",
                    "majorgroupcode": 1,
                    "majorlist": [
                        {
                            "index": 1,
                            "code": "12",
                            "name": "金融学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "18",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "68544",
                                    "jhs": "10",
                                    "pjf": "503"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "18",
                                    "pjf": "501"
                                },
                                {
                                    "year": 2018,
                                    "pw": "64386",
                                    "jhs": "-",
                                    "pjf": "486"
                                }
                            ]
                        },
                        {
                            "index": 2,
                            "code": "13",
                            "name": "会计学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "12",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "96520",
                                    "jhs": "10",
                                    "pjf": "478"
                                },
                                {
                                    "year": 2019,
                                    "pw": "71085",
                                    "jhs": "12",
                                    "pjf": "499"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 3,
                            "code": "10",
                            "name": "广告学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "20",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "113687",
                                    "jhs": "25",
                                    "pjf": "464"
                                },
                                {
                                    "year": 2019,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 4,
                            "code": "11",
                            "name": "工商管理",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "58",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "71682",
                                    "jhs": "27",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2019,
                                    "pw": "70165",
                                    "jhs": "28",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "66292",
                                    "jhs": "-",
                                    "pjf": "484"
                                }
                            ]
                        },
                        {
                            "index": 5,
                            "code": "14",
                            "name": "金融科技",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "16",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "86025",
                                    "jhs": "12",
                                    "pjf": "487"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "24",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "67252",
                                    "jhs": "-",
                                    "pjf": "483"
                                }
                            ]
                        }
                    ]
                },
                {
                    "index": 2,
                    "code": "44256",
                    "name": "深圳大学2",
                    "majorgroup": "不限选考科目",
                    "majorgroupcode": 1,
                    "majorlist": [
                        {
                            "index": 1,
                            "code": "12",
                            "name": "金融学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "18",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "68544",
                                    "jhs": "10",
                                    "pjf": "503"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "18",
                                    "pjf": "501"
                                },
                                {
                                    "year": 2018,
                                    "pw": "64386",
                                    "jhs": "-",
                                    "pjf": "486"
                                }
                            ]
                        },
                        {
                            "index": 2,
                            "code": "13",
                            "name": "会计学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "12",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "96520",
                                    "jhs": "10",
                                    "pjf": "478"
                                },
                                {
                                    "year": 2019,
                                    "pw": "71085",
                                    "jhs": "12",
                                    "pjf": "499"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 3,
                            "code": "10",
                            "name": "广告学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "20",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "113687",
                                    "jhs": "25",
                                    "pjf": "464"
                                },
                                {
                                    "year": 2019,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 4,
                            "code": "11",
                            "name": "工商管理",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "58",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "71682",
                                    "jhs": "27",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2019,
                                    "pw": "70165",
                                    "jhs": "28",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "66292",
                                    "jhs": "-",
                                    "pjf": "484"
                                }
                            ]
                        },
                        {
                            "index": 5,
                            "code": "14",
                            "name": "金融科技",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "16",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "86025",
                                    "jhs": "12",
                                    "pjf": "487"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "24",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "67252",
                                    "jhs": "-",
                                    "pjf": "483"
                                }
                            ]
                        }
                    ]
                }
            ]
        },{
            "pc": "本科提前批次",
            "list": [
                {
                    "index": 1,
                    "code": "4426",
                    "name": "暨南大学",
                    "majorgroup": "不限选考科目",
                    "majorgroupcode": 2,
                    "majorlist": [
                        {
                            "index": 1,
                            "code": "14",
                            "name": "金融学14",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "35",
                                    "pjf": "560"
                                },
                                {
                                    "year": 2020,
                                    "pw": "45852",
                                    "jhs": "48",
                                    "pjf": "569"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69852",
                                    "jhs": "12",
                                    "pjf": "666"
                                },
                                {
                                    "year": 2018,
                                    "pw": "12589",
                                    "jhs": "-",
                                    "pjf": "568"
                                }
                            ]
                        },
                        {
                            "index": 2,
                            "code": "16",
                            "name": "会计学16",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "12",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "85555",
                                    "jhs": "10",
                                    "pjf": "478"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69999",
                                    "jhs": "16",
                                    "pjf": "566"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 3,
                            "code": "10",
                            "name": "广告学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "20",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "113687",
                                    "jhs": "25",
                                    "pjf": "464"
                                },
                                {
                                    "year": 2019,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 4,
                            "code": "11",
                            "name": "工商管理",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "58",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "71682",
                                    "jhs": "27",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2019,
                                    "pw": "70165",
                                    "jhs": "28",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "66292",
                                    "jhs": "-",
                                    "pjf": "484"
                                }
                            ]
                        },
                        {
                            "index": 5,
                            "code": "14",
                            "name": "金融科技",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "16",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "86025",
                                    "jhs": "12",
                                    "pjf": "487"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "24",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "67252",
                                    "jhs": "-",
                                    "pjf": "483"
                                }
                            ]
                        }
                    ]
                },
                {
                    "index": 2,
                    "code": "44256",
                    "name": "深圳大学2",
                    "majorgroup": "不限选考科目",
                    "majorgroupcode": 1,
                    "majorlist": [
                        {
                            "index": 1,
                            "code": "12",
                            "name": "金融学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "18",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "68544",
                                    "jhs": "10",
                                    "pjf": "503"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "18",
                                    "pjf": "501"
                                },
                                {
                                    "year": 2018,
                                    "pw": "64386",
                                    "jhs": "-",
                                    "pjf": "486"
                                }
                            ]
                        },
                        {
                            "index": 2,
                            "code": "13",
                            "name": "会计学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "12",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "96520",
                                    "jhs": "10",
                                    "pjf": "478"
                                },
                                {
                                    "year": 2019,
                                    "pw": "71085",
                                    "jhs": "12",
                                    "pjf": "499"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 3,
                            "code": "10",
                            "name": "广告学",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "20",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "113687",
                                    "jhs": "25",
                                    "pjf": "464"
                                },
                                {
                                    "year": 2019,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2018,
                                    "pw": "-",
                                    "jhs": "-",
                                    "pjf": "-"
                                }
                            ]
                        },
                        {
                            "index": 4,
                            "code": "11",
                            "name": "工商管理",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "58",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "71682",
                                    "jhs": "27",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2019,
                                    "pw": "70165",
                                    "jhs": "28",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "66292",
                                    "jhs": "-",
                                    "pjf": "484"
                                }
                            ]
                        },
                        {
                            "index": 5,
                            "code": "14",
                            "name": "金融科技",
                            "data": [
                                {
                                    "year": 2021,
                                    "pw": "-",
                                    "jhs": "16",
                                    "pjf": "-"
                                },
                                {
                                    "year": 2020,
                                    "pw": "86025",
                                    "jhs": "12",
                                    "pjf": "487"
                                },
                                {
                                    "year": 2019,
                                    "pw": "69264",
                                    "jhs": "24",
                                    "pjf": "500"
                                },
                                {
                                    "year": 2018,
                                    "pw": "67252",
                                    "jhs": "-",
                                    "pjf": "483"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    oui.eachArray(data,function(item){
        var curr = item; //批次 对象
        var list = item.list ||[]; //学校列表
        oui.eachArray(list,function(school){
            var majorlist = school.majorlist ||[];
            var len =majorlist.length;
            arr.push({
                1:curr.pc, //批次
                2:school.index,//顺序
                3:'院校',
                4:school.code,
                5:school.name,//院校名称
                6:'专业组',
                7:'待2021大厚本公布结果',
                8: '待公布'
            });
            oui.eachArray(majorlist,function(marjor,idx4margor){
                if(idx4margor%2==0){
                    var left = marjor;
                    var right =null;
                    if(idx4margor+1<len){
                        right = majorlist[idx4margor+1];
                    }
                    arr.push({
                        1:curr.pc, //批次
                        2:school.index,//顺序
                        3:'专业'+(idx4margor+1), //左侧专业标题
                        4:left.code, //左侧专业代码
                        5:left.name,//左边的专业名词
                        6:'专业'+(idx4margor+2),//右侧专业标题
                        7:right?right.code:'', //右侧专业代码
                        8:right?right.name:''//右侧专业名词

                    });
                }
            });

        });
    });

    oui.require([oui.getContextPath()+'res_common/third/js-excel/excel.all.min.js',
        oui.getContextPath()+'res_common/oui/system/oui-excel.js'
    ],function(){

        oui.require(oui.getContextPath()+'res_common/oui/ui/ui_pc/dialog/export-excel.js',function(){
            var excel= oui.createExcel4ListObj('文件导出',[{key:'1',name:'批次'},{key:'2',name:'顺序'},{key:'3',name:'志愿'},
                {key:'4',name:'代码'},{key:'5',name:'名称'},{key:'6',name:'志愿'},{key:'7',name:'代码'},{key:'8',name:'名称'}],arr,{
                '!merges':{
                    s: {//s为开始
                        c: 1,//开始列
                        r: 1//开始取值范围
                    },
                    e: {//e结束
                        c: 4,//结束列
                        r: 1//结束范围
                    }

                }});

            excel.export();
        });
    });
}