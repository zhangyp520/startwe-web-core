(function(win){
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;
    var constant =oui.$.constant;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var Report = function(cfg) {
        Control.call(this,cfg);//必须继承控件超类
        this.attrs = this.attrs+",renderType,isLoading,formatterDisplay,reportType,url,dataFormatter,emptyTipsIcon,groupKey,statisticsKey,styleCfg,phone,onclick,reportVO,onLoadData";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.hide=hide;
        this.show=show;
        this.afterRender=afterRender;
        this.getData = getData;
        this.setData = setData;
        this.loadData = loadData;//根据url加载数据
        this.getOptionByRenderType = getOptionByRenderType;//根据渲染引擎获取对应引擎需要的参数配置
        this.setOptionByRenderType = setOptionByRenderType; //根据渲染引擎 设置对应需要的参数配置
        this.initByReportType = initByReportType;//根据 报表类型初始化
        this.afterRenderByReportType = afterRenderByReportType;//根据报表类型渲染
        this.initByRenderType = initByRenderType;//根据渲染引擎 初始化对应引擎需要的参数
        this.afterRenderByRenderType = afterRenderByRenderType;//根据渲染引擎 ，渲染处理
        this.requireRenderEngine = requireRenderEngine;// 加载渲染引擎所需资源
        this.hasRequireRenderEngine = hasRequireRenderEngine;//判断是否已经加载渲染引擎

        this.destroy = destroy;

    };
    ctrl["report"] = Report;
    /**
     * 报表组件
     * @param author：
     * 调用方式：
     * {

    "style":"",
    "showType":"",
    "onclick":function(){},

    "reportType":"bar", //报表类型
    "groupKey":"030956206654372928", //分组项
    "statisticsKey":[//统计项
        {
            "id":"5ae98c7d23c2a13c1004d013-field_9sBVxy91",
            "display":"A.数字"
        },
        {
            "id":"5ae98c7d23c2a13c1004d013-5aeadf3923c2a14f0ca03e0f-field_cZWcS55t",
            "display":"A.明细表1.数字"
        },
        {
            "id":"other-groupCount",
            "display":"其他.分组计数"
        }
    ],
    "data":[//统计数据
        {
            "030956206654372928":{ //分组key
                "display":"子程序",
                "dataType":"STRING",
                "value":"子程序"
            },
            "other-groupCount":{//统计项 other-groupCount
                "formId":"other",
                "display":"2",
                "dataType":"NUMBER_LONG",
                "value":2
            },
            "5ae98c7d23c2a13c1004d013-field_9sBVxy91":{ //统计项 5ae98c7d23c2a13c1004d013-field_9sBVxy91
                "formId":"5ae98c7d23c2a13c1004d013",
                "display":"23",
                "dataType":"NUMBER_LONG",
                "value":23
            },
            "5ae98c7d23c2a13c1004d013-5aeadf3923c2a14f0ca03e0f-field_cZWcS55t":{
                "formId":"5ae98c7d23c2a13c1004d013",
                "display":"146",
                "dataType":"NUMBER_LONG",
                "value":146
            },
            "5ae9902323c2a13c1004d015-field_uSOFSfzd":{
                "formId":"5ae9902323c2a13c1004d015",
                "display":"0",
                "dataType":"NUMBER_LONG",
                "value":0
            }
        },
        {
            "030956206654372928":{
                "display":"1",
                "dataType":"STRING",
                "value":"1"
            },
            "other-groupCount":{
                "formId":"other",
                "display":"1",
                "dataType":"NUMBER_LONG",
                "value":1
            },
            "5ae98c7d23c2a13c1004d013-field_9sBVxy91":{
                "formId":"5ae98c7d23c2a13c1004d013",
                "display":"44",
                "dataType":"NUMBER_LONG",
                "value":44
            },
            "5ae98c7d23c2a13c1004d013-5aeadf3923c2a14f0ca03e0f-field_cZWcS55t":{
                "formId":"5ae98c7d23c2a13c1004d013",
                "display":"56",
                "dataType":"NUMBER_LONG",
                "value":56
            },
            "5ae9902323c2a13c1004d015-field_uSOFSfzd":{
                "formId":"5ae9902323c2a13c1004d015",
                "display":"0",
                "dataType":"NUMBER_LONG",
                "value":0
            }
        }
    ]
}
     *
     */
    Report.FullName = "oui.$.ctrl.report";//设置当前类全名 静态变量
    Report.templateHtml=[];

    var no_data_imgUrl=oui.getContextPath()+"res_apps/form/pc/formDataList/images/report-no-data.png";
    Report.templateHtml[0] = '' +
        '{{if (!data)||(!data.length)}}' +
        '<div class="form-report-no-data {{emptyTipsIcon}} {{if isLoading}}form-data-isLoading{{/if}}" >' +
        '   <p class="loading-msg">数据加载中...</p>' +
        '   <p class="no-data-msg">暂无数据</p>' +
        '</div>' +
        '{{/if}}';
    Report.templateHtml[1] = Report.templateHtml[0];

    var ChartType = {
        pie: {code: "pie", name: "饼状图"},
        bar: {code: "bar", name: "条形图"}, //showType柱状图0,横向图1
        line: {code: "line", name: "折线图"},//showType 折线图  0,面积图 1
        radar: {code: "radar", name: "雷达图"}
    };
    /** 根据不同渲染引擎 实现 报表渲染的 适配器 和对应引擎中不同报表类型的插件接口
     * ,通过 适配器插件机制实现 控件 的初始化渲染
     * 执行顺序：
     * 一、控件配置初始化
     * 二、渲染引擎默认初始化
     * 三、渲染引擎下特定报表类型配置初始化
     * 四、渲染引擎下特定报表类型配置后置渲染
     * 五、渲染引擎后置渲染
     *
     * 引擎接口包括{
     *      plugins:{},//特定类型
     *      init:function(){},
     *      hasRequire:function(){},//资源是否加载的检测
     *      require:function(callback){}
     * }
     * ****/
    Report.Adapter={
        /**
         * 基于echarts 报表渲染适配器
         *
         *
         * **/
        echarts:{
            plugins:{
                bar:{
                    init:function(control){
                        var options = control.getMap();
                        var styleCfg = options.styleCfg ||{max:true,legend:true};
                        var reportType = control.attr('reportType');
                        var showType = control.attr('showType');
                        showType = parseInt(showType+'');
                        var reportData = control.attr('data');
                        var groupKey = control.attr('groupKey');
                        var statisticsKey = control.attr('statisticsKey');
                        var option = control.getOptionByRenderType();
                        var tooltip = option.tooltip ||{};
                        var legend = option.legend ||{};
                        var grid = {
                            top: '40',
                            left: '3%',
                            right: '4%',
                            bottom: '10px',
                            containLabel: true
                        };
                        var axisLine = {
                            show: true,
                            lineStyle: {
                                color: "#b7b7b7",
                                width: 0.5
                            }
                        };
                        var valueAxis = {
                            axisTick: false,
                            splitLine: false,
                            axisLine: axisLine,
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        };
                        var categoryAxis = {
                            type: 'category',
                            axisTick: false,
                            splitLine: false,
                            axisLine: axisLine,
                            axisLabel: {
                                show: true,
                                formatter: function (value, index) {
                                    var text = value;
                                    if (value.length > 10) {
                                        text = value.substring(0, 10) + "…";
                                    }
                                    return text;
                                }
                            }
                        };
                        var chartType = reportType;
                        if(showType ==1){ //横向条形图
                            grid.left='10%';
                        }
                        var category = [];
                        var legendData = [];
                        var series = [];
                        //组装category分类轴数据
                        $.each(reportData, function (x, y) {
                            var name = oui.escapeHTMLToString(y[groupKey]['display']);
                            category.push(name);
                        });
                        var max = 0;
                        //处理数据组装出系列数据和图例数据
                        for(var i= 0,len=statisticsKey.length;i<len;i++){
                            var key = statisticsKey[i].id;
                            var name = oui.escapeHTMLToString(statisticsKey[i].display);
                            if(name==""){
                                name=" ";
                            }
                            legendData.push(name);
                            var data = [];
                            $.each(reportData, function (x, y) {
                                var value = y[key].value;
                                try{
                                    value = Number(value);
                                }catch(err){
                                    value = 0;
                                }
                                if (value > max) {
                                    max = value;
                                }
                                data.push(y[key]);
                            });

                            var formatterDisplay = control.attr('formatterDisplay');

                            var serie = {
                                name: name,
                                type: chartType,
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show:true,
                                            formatter: formatterDisplay||'{c}',//显示数值处理后，无法使用截断文本处理，待解决
                                            position : showType==1?'right':'top'
                                        }
                                    }
                                },
                                data: data,
                                barMaxWidth:35
                            };
                            series.push(serie);
                        }
                        categoryAxis.data = category;
                        legend.data = legendData;
                        tooltip.trigger = 'axis';
                        if(showType ==1){ //横向 bar
                            option.xAxis = valueAxis;
                            option.yAxis = categoryAxis;
                        }  else { //纵向
                            option.xAxis = categoryAxis;
                            option.yAxis = valueAxis;
                        }
                        if(options.phone){
                            grid.top='10';
                            if(styleCfg.legend){
                                //计算文字长度和屏幕宽度 来计算一个图例的高度
                                grid.top=(1+parseInt(legend.data.length/4))*30;
                            }
                        }
                        option.grid = grid;
                        option.tooltip = tooltip;
                        option.legend = legend;
                        option.series = series;
                        control.setOptionByRenderType(option);
                    },
                    afterRender:function(control){
                        var el =control.getEl();
                        var container = $(el);
                        var options = control.getMap();
                        var option = control.getOptionByRenderType();
                        var styleCfg = control.attr('styleCfg');
                        var reportType =control.attr('reportType');
                        var showType = control.attr('showType');
                        showType = parseInt(showType+'');
                        var legend = option.legend;
                        if(options.phone){

                            var categoryAxis = option.xAxis;
                            if(showType ==1){ //横向 bar
                                categoryAxis = option.yAxis ;
                            }
                            if(showType ==1){
                                var height=legend.data.length* categoryAxis.data.length* 30 + 40;
                                if(options.legend){
                                    height+=40;
                                }
                                if(height>container.height()){
                                    container.height(height);
                                }
                            }else{
                                var width=legend.data.length* categoryAxis.data.length* 30 + 40;
                                if(options.legend){
                                    width+=40;
                                }
                                if(width>container.width()){
                                    container.width(width);
                                }
                            }
                        }
                    }
                },
                line:{
                    init:function(control){
                        var options = control.getMap();
                        var styleCfg = options.styleCfg ||{max:true,legend:true};
                        var reportType = control.attr('reportType');
                        var showType = control.attr('showType');
                        showType = parseInt(showType+'');
                        var reportData = control.attr('data');
                        var groupKey = control.attr('groupKey');
                        var statisticsKey = control.attr('statisticsKey');
                        var option = control.getOptionByRenderType();
                        var tooltip = option.tooltip ||{};
                        var legend = option.legend ||{};
                        var grid = {
                            top: '40',
                            left: '3%',
                            right: '4%',
                            bottom: '10px',
                            containLabel: true
                        };
                        var axisLine = {
                            show: true,
                            lineStyle: {
                                color: "#b7b7b7",
                                width: 0.5
                            }
                        };
                        var valueAxis = {
                            axisTick: false,
                            splitLine: false,
                            axisLine: axisLine,
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        };
                        var categoryAxis = {
                            type: 'category',
                            axisTick: false,
                            splitLine: false,
                            axisLine: axisLine,
                            axisLabel: {
                                show: true,
                                formatter: function (value, index) {
                                    var text = value;
                                    if (value.length > 10) {
                                        text = value.substring(0, 10) + "…";
                                    }
                                    return text;
                                }
                            }
                        };
                        var chartType = reportType;
                        var category = [];
                        if (options.phone) {
                            grid.left='5%';
                            grid.right='10%';
                        }
                        categoryAxis.boundaryGap = false;
                        if(showType==0){ //默认是线条
                            categoryAxis.boundaryGap = false;

                        }else  if(showType ==1){
                            //面积图对于echart就是折线图加上area样式。

                        }
                        //组装category分类轴数据
                        $.each(reportData, function (x, y) {
                            var name = oui.escapeHTMLToString(y[groupKey]['display']);
                            category.push(name);
                        });
                        var legendData=[];
                        var series = [];
                        var max = 0;
                        //处理数据组装出系列数据和图例数据
                        for(var i= 0,len=statisticsKey.length;i<len;i++){
                            var key = statisticsKey[i].id;
                            var name = oui.escapeHTMLToString(statisticsKey[i].display);
                            if(name==""){
                                name=" ";
                            }
                            legendData.push(name);
                            var data = [];
                            $.each(reportData, function (x, y) {
                                var value =y[key]? y[key].value:0;
                                try{
                                    value = Number(value);
                                }catch(err){
                                    value = 0;
                                }
                                if (value > max) {
                                    max = value;
                                }
                                data.push(y[key]);
                            });
                            var formatterDisplay = control.attr('formatterDisplay');
                            var serie = {
                                name: name,
                                type: chartType,
                                data: data,
                                label:{
                                    normal:{
                                        formatter: formatterDisplay||'{c}',//显示数值处理后，无法使用截断文本处理，待解决
                                        show:true,            //显示数字
                                        position: 'top'        //这里可以自己选择位置
                                    }
                                },
                                barMaxWidth:35
                            };
                            if(showType ==1){
                                serie.stack = "总量";
                                serie.areaStyle = {normal: {}};
                            }
                            series.push(serie);
                        }


                        categoryAxis.data = category;
                        if(showType ==1){
                            if(styleCfg.max){
                                valueAxis.max = Number(max) + 5;
                            }
                        }
                        legend.data = legendData;
                        tooltip.trigger = 'axis';
                        option.xAxis = categoryAxis;
                        option.yAxis = valueAxis;

                        if(options.phone){
                            grid.top='10';
                            if(styleCfg.legend){
                                //计算文字长度和屏幕宽度 来计算一个图例的高度
                                grid.top=(1+parseInt(legend.data.length/4))*30;
                            }
                        }
                        option.grid = grid;
                        option.tooltip = tooltip;
                        option.legend = legend;
                        option.series = series;
                        control.setOptionByRenderType(option);
                    },
                    afterRender:function(control){
                    }
                },
                pie:{
                    init:function(control){
                        //饼图数据处理
                        var data = [];
                        var groupkey = control.attr('groupKey');
                        var reportData = control.attr('data');
                        var statisticsKey = control.attr('statisticsKey');

                        var option = control.getOptionByRenderType();
                        var series = option.series||[];
                        var legend = option.legend ||{};
                        var tooltip = option.tooltip ||{};
                        var category = [];
                        var seriesName = '数量';
                        for(var i= 0,len=statisticsKey.length;i<len;i++){
                            var key = statisticsKey[i].id;
                            $.each(reportData, function (x, y) {
                                // var name = $('<div/>').html(y[groupkey]['display']).text();
                                var name = oui.escapeHTMLToString(y[groupkey]['display'] ||"");
                                if(name==""){
                                    name=" ";
                                }
                                category.push(name);
                                var value = 0;
                                var display = 0;
                                if((typeof y[key] !='undefined') && y[key]){
                                    value=y[key].value;
                                    display=y[key].display;
                                }
                                data.push({name: name, value:value, display : display});
                            });

                            // 统计图鼠标放入扇形显示对应控件名字，循环执行，结果一致
                            seriesName=oui.escapeStringToHTML(statisticsKey[i].display ||"");
                        }

                        legend.data = category;
                        var formatterDisplay = control.attr('formatterDisplay');
                        series.push({
                            name:seriesName,
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '50%'],
                            data: data,

                            label: {
                                normal: {
                                    show: true,
                                    formatter: formatterDisplay||'{b}: {c}({d}%)'//显示数值处理后，无法使用截断文本处理，待解决

                                },
                                emphasis: {}
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    length: 30,
                                    length2: 25
                                }
                            }
                        });
                        tooltip.trigger = 'item';
                        option.tooltip = tooltip;
                        option.legend = legend;
                        option.series = series;
                        control.setOptionByRenderType(option);
                    },
                    afterRender:function(control){

                    }
                },
                radar:{
                    init:function(control){
                        var reportType = control.attr('reportType');
                        var groupkey = control.attr('groupKey');
                        var reportData = control.attr('data');
                        var statisticsKey = control.attr('statisticsKey');

                        var option = control.getOptionByRenderType();
                        var series = option.series||[];
                        var legend = option.legend ||{};
                        var tooltip = option.tooltip ||{};
                        var legendData = [];
                        //雷达图数据处理
                        var indicator = [];
                        var max = 0;
                        $.each(reportData, function (x, y) {
                            for(var i= 0,len=statisticsKey.length;i<len;i++) {
                                var key = statisticsKey[i].id;
                                if (key != groupkey) {
                                    var value = y[key].value;
                                    try{
                                        value = Number(value);
                                    }catch(err){
                                        value =0;
                                    }
                                    if (value > max) {
                                        max = value;
                                    }
                                }
                            }
                            if(max==0){
                                max=1;
                            }else{
                                max = max + max / 10;
                            }

                        });
                        $.each(reportData, function (x, y) {
                            var name = oui.escapeHTMLToString(y[groupkey]['display']);
                            indicator.push({name: name, max: parseFloat(max.toFixed(3))});
                        });

                        var data = [];
                        for(var i= 0,len=statisticsKey.length;i<len;i++) {
                           var key = statisticsKey[i].id;
                            var name = oui.escapeHTMLToString(statisticsKey[i].display);
                            if(name==""){
                                name=" ";
                            }
                            legendData.push(name);
                            var value = [];
                            var display = [];
                            $.each(reportData, function (x, y) {
                                var currV = y[key].value;
                                var currDis= y[key].display;

                                try{
                                    currV = Number(currV);
                                }catch(err){
                                    currV =0;
                                }
                                value.push(currV);
                                display.push(currDis);
                            });
                            data.push({value: value, name: name, display : display});
                        }
                        series.push({
                            name: "",
                            type: reportType,
                            label:{
                                normal:{
                                    show:false
                                    //,            //显示数字
                                    //position: 'top'        //这里可以自己选择位置
                                }
                            },
                            data: data
                        });
                        option.radar = {/* shape: 'circle',*/
                            indicator: indicator};
                        legend.data = legendData;
                        option.tooltip = tooltip;
                        option.legend = legend;
                        option.series = series;
                        control.setOptionByRenderType(option);
                    },
                    afterRender:function(control){

                    }
                }
            },
            init:function(control){
                var showType = control.attr('showType');
                showType = parseInt('showType'); //柱状图 showType=1--->横向 line则--->对应面积图
                var reportType = control.attr('reportType');
                var options = control.getMap();
                var styleCfg = control.attr('styleCfg') ||{
                        max:true,
                        legend:true
                    };
                var series = [];
                var color = ['#5990cf', '#84c9ab', '#e9ca48', '#e07365', '#8a84c9', '#59c0cf', '#e1a44d'];
                var tooltip = {//提示框，鼠标悬浮交互时的信息提示
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0.7)',//提示背景颜色，默认为透明度为0.7的黑色
                    borderColor: '#333',//提示边框颜色
                    borderWidth: 0, //提示边框线宽，单位px，默认为0（无边框）
                    formatter: "{b}<br/>数量:{c}"
                };
                var legend = {//图例，表述数据和图形的关联
                    show: styleCfg.legend,
                    formatter: function (name) {
                        return echarts.format.truncateText(name,100, '14px', '…');
                    },
                    tooltip: {
                        formatter: function (value) {//这里需要再转回来（escapeStringToHTML）,title显示才正常
                            return oui.escapeStringToHTML(value.name);
                        },
                        show: true
                    },
                    x: 'right'
                };
                var option = {
                    title: {
                        show: options.title != '',
                        text: options.title,
                        subtext: '',
                        x: 'center'//水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}
                    },
                    animation: !(options.phone != ''),
                    color: color
                };
                option.tooltip = tooltip;
                option.legend = legend;
                option.series = series;
                control.setOptionByRenderType(option);
            },
            /** 配置 第三方资源的资源路径，按需加载****/
            requirePaths:[oui.getContextPath()+"res_common/third/echarts/echarts.min.js"],
            /** 是否加载了第三方报表渲染引擎 ,每种引擎实现不同，echarts则判断 window.echarts是否存在****/
            hasRequire:function(){
                var flag =false;
                if((typeof window.echarts !=='undefined') && (window.echarts)){
                    flag = true;
                }
                return flag;
            },
            /** 控件对象销毁触发***/
            destroy:function(control){
                /** 如果存在 echarts实例，则进行销毁***/
                var echartsInstance = control.attr('echartsInstance');
                try{
                    echartsInstance&&echartsInstance.dispose();
                }catch(err){
                }
            },
            afterRender:function(control,el){
                //console.log("reportType:"+control.attr('reportType'));
                //console.log(control.getOptionByRenderType());
                el = el || control.getEl();
                var option = control.getOptionByRenderType();
                var options = control.getMap();
                function formatterFun(params, ticket, callback) {
                    var s = "";
                    var length = 40;
                    if (options.phone) {
                        length = 10;
                    }
                    if(params.seriesType=='radar'){
                        s = formatterName(params.name, 0, length);
                        for (var i = 0; i < params.value.length; i++) {
                            s += formatterSeriesName(option.radar.indicator[i].name, params.data.display[i], length);
                        }
                    }else{
                        if (undefined == params.length) {
                            s = formatterName(params.name, (params.data&&params.data.display)||"", length);
                            s += formatterSeriesName(params.seriesName, (params.data&&params.data.display)||"", length);
                        } else {
                            s = formatterName(params[0].name, (params[0]&&params[0].data&&params[0].data.display)||"", length);
                            for (var i = 0; i < params.length; i++) {
                                s += formatterSeriesName(params[i].seriesName, (params[i].data&&params[i].data.display)||"", length);
                            }
                        }
                    }
                    return s;
                }

                function htmlEncode(value) {
                    return $('<div/>').text(value).html();
                }
                //提示信息格式化name
                function formatterName(name,value,length){
                    var s = "";
                    for (var i = 0; i < Math.ceil(name.length / length); i++) {
                        var temp = name.substr(i * length, length);
                        s += htmlEncode(temp);
                        if (temp.length == length && i + 1 != Math.ceil(name.length / length)) {
                            s += "</br>";
                        }
                    }
                    var percentage;
                    if (undefined == options.data[0].countNum) {
                        percentage = "";
                        s += "</br>";
                    } else {
                        if (options.data[0].countNum > 0 && value > 0) {
                            percentage = value / options.data[0].countNum * 100;
                        } else {
                            percentage = 0;
                        }
                        s += "：(" + percentage.toFixed(1) + "%) ";
                    }
                    return s;
                }
                //提示信息格式化系列名称
                function formatterSeriesName(seriesName,value,length){
                    var s="</br>";
                    for (var i = 0; i < Math.ceil(seriesName.length / length); i++) {
                        var temp = seriesName.substr(i * length, length);
                        s += htmlEncode(temp);
                        if (temp.length == length && i + 1 != Math.ceil(seriesName.length / length)) {
                            s += "</br>";
                        }
                    }
                    s += ":" + value;
                    return s;
                }
                var tooltip = option.tooltip ||{};
                option.tooltip = tooltip;
                tooltip.formatter = formatterFun;
                var echartsInstance = control.attr('echartsInstance');
                if(echartsInstance){
                    /** 销毁后重新渲染******/
                    try{
                        echartsInstance.dispose&&echartsInstance.dispose();
                        echartsInstance = null;
                    }catch(err){
                    }
                }
                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(el);
                myChart.setOption(option);
                myChart.on('click',function(params){
                    var reportData = control.attr('data');
                    // 数据索引
                    var dataIndex=undefined;
                    if(options.reportType==ChartType.radar.code){
                        //如果是雷达图坐标
                        dataIndex=params.event.target.__dimIdx;
                    }else{
                        dataIndex=params['dataIndex'];
                    }
                    if(dataIndex!=undefined){
                        var groupKey = control.attr('groupKey');
                        var groupData=reportData[dataIndex][groupKey];
                        var result = {};
                        if(params.seriesType == ChartType.radar.code){
                            //雷达图 获取当前 统计项field
                            var currField = oui.findOneFromArrayBy(options.statisticsKey||[],function(item){
                                if(item.display == params.name){
                                    return true;
                                }
                            });
                            result = {
                                groupKey:groupKey,
                                groupData:groupData,
                                staticKey:currField,
                                staticData:reportData[dataIndex][currField.id]
                            };
                        }else{

                            /** 非雷达图 获取当前统计项*****/
                            var currField = options.statisticsKey[params['seriesIndex']] ||{};
                            result = {
                                groupKey:groupKey,
                                groupData:groupData,
                                staticKey:currField,
                                staticData:reportData[dataIndex][currField.id]
                            };
                        }
                        options.onclick&&options.onclick(result,control);
                        //options.callback(result);
                    }
                });
                control.attr('echartsInstance',myChart);
            }
        }
    };

    /*** 添加插件机制实现 特定 引擎插件*****/
    Report.setPlugin = function(renderType,cfg){
        Report.Adapter[renderType] = cfg;
    };
    /** 根据渲染引擎获取 对应引擎需要的参数****/
    var getOptionByRenderType = function(){
        var renderType = this.attr('renderType');
        return this.attr('option4'+renderType);
    };
    /** 根据渲染引擎 设置 对应的引擎需要的参数配置****/
    var setOptionByRenderType = function(option){
        var renderType = this.attr('renderType');
        this.attr('option4'+renderType,option);
    };

    /** 根据渲染引擎初始化**/
    var initByRenderType = function(){
        var renderType = this.attr('renderType');
        var reportType = this.attr('reportType');
        var renderEngine = Report.Adapter[renderType];
        renderEngine&&renderEngine.init(this);
    };
    /** 根据渲染引擎 渲染 报表****/
    var afterRenderByRenderType = function(){
        var renderType = this.attr('renderType');
        var reportType = this.attr('reportType');
        var renderEngine = Report.Adapter[renderType];
        renderEngine&&renderEngine.afterRender(this);
    };
    /** 对象调用销毁对象时执行 ****/
    var destroy = function(){
        var renderType = this.attr('renderType');
        var renderEngine = Report.Adapter[renderType];
        renderEngine&&renderEngine.destroy(this);
    };
    /** 根据 报表类型初始化**/
    var initByReportType =function(){
        var renderType = this.attr('renderType');
        var reportType = this.attr('reportType');
        var renderEngine = Report.Adapter[renderType];
        var plugin = renderEngine&&renderEngine.plugins&&renderEngine.plugins[reportType];
        plugin&&plugin.init(this);
    };
    /** 根据报表类型渲染 **/
    var afterRenderByReportType = function(){
        var renderType = this.attr('renderType');
        var reportType = this.attr('reportType');
        var renderEngine = Report.Adapter[renderType];
        var plugin = renderEngine&&renderEngine.plugins&&renderEngine.plugins[reportType];
        plugin&&plugin.afterRender(this);
    };
    /** 配置初始化****/
    var init=function(renderBeforeEl){
        var me = this;
        me.inited = false;
        this.attr('isLoading',true);
        var emptyTipsIcon = this.attr('emptyTipsIcon') || 'form-report-no-data-emptyTipsIcon';
        this.attr('emptyTipsIcon',emptyTipsIcon);
        var groupKey = this.attr('groupKey');
        var reportType = this.attr('reportType')||'line';
        var statisticsKey = this.attr('statisticsKey')||'[]';
        var data = this.attr('data') ||'[]';
        var styleCfg = this.attr('styleCfg') ||'{ max:true,legend:true}';
        var renderType = this.attr('renderType') || 'echarts';
        var phone = this.attr('phone');
        var onLoadData = this.attr('onLoadData');
        if(onLoadData){
            if(typeof onLoadData=='string'){
                onLoadData = oui.parseJson(onLoadData);
                this.attr('onLoadData',onLoadData);
            }
        }
        if(phone && ((phone+'') =='true')){
            phone = true;
        }else{
            phone = oui.os.mobile;
        }
        var formatterDisplay = this.attr('formatterDisplay');
        if(formatterDisplay){//自定义格式化 显示内容，目前用于 饼图的格式化处理
            formatterDisplay = oui.parseJson(formatterDisplay);
            this.attr('formatterDisplay',formatterDisplay);
        }
        var onclick = this.attr('onclick');
        if(onclick && (typeof onclick =='string')){
            onclick = eval(onclick);
        }else{
            onclick = oui._noop;
        }
        statisticsKey = oui.parseJson(statisticsKey);
        data = oui.parseJson(data);
        this.attr('statisticsKey',statisticsKey);
        this.attr('data',data);
        this.attr('reportType',reportType);
        styleCfg = oui.parseJson(styleCfg);
        if(typeof styleCfg.max =='undefined'){
            styleCfg.max = true;
        }
        if(typeof styleCfg.legend =='undefined'){
            styleCfg.legend  = true;
        }
        this.attr('styleCfg',styleCfg);
        this.attr('renderType',renderType);
        this.attr('phone',phone);
        this.attr('onclick',onclick);

        if(renderBeforeEl){
            var $dataEl = $(renderBeforeEl).find('data');
            var $statisticsKey = $(renderBeforeEl).find('static-keys');

            var $styleCfg = $(renderBeforeEl).find('style-cfg');
            /** 复杂对象支持 data配置json****/
            if($dataEl.length){
                var strData = $.trim($dataEl.html());
                var data = this.attr('data');
                if((!data.length) && (strData.length)){
                    data = oui.parseJson(strData);
                    this.attr('data',data);
                }
            }
            /** 复杂对象支持  static-keys 配置json数组*****/
            if($statisticsKey.length){
                var strData = $.trim($statisticsKey.html());
                var statisticsKey = this.attr('statisticsKey');
                if((!statisticsKey.length) && (strData.length)){
                    statisticsKey = oui.parseJson(strData);
                    this.attr('statisticsKey',statisticsKey);
                }
            }
            /** 复杂对象支持  static-cfg 配置json数组*****/
            if($styleCfg.length){
                var strData = $.trim($styleCfg.html());
                if(strData.length){
                    var styleCfgTemp = oui.parseJson(strData);
                    if(!oui.isEmptyObject(styleCfgTemp)){
                        this.attr('styleCfg',styleCfgTemp);
                    }
                }
            }
        }
        var reportVO = this.attr('reportVO');
        if(reportVO){
            reportVO = oui.parseJson(reportVO);
            this.attr(reportVO);
        }
        //自定义数据格式，需要转换的入口
        formatData.call(this);
    };
    /** 获取报表数据***/
    var getData = function(){
        return this.attr('data');
    };
    /** 设置报表数据，并渲染**/
    var setData = function(data,isVO){
        if(typeof isVO=='undefined'){
            if(data &&(data instanceof Array)){
                isVO= false;
            }else if(data){
                isVO = true;
            }
        }
        if(isVO){
            data= data||{};
            this.attr('reportVO',data);
            this.attr(data);
        }else{
            data= data||[];
            this.attr('data',data);
        }
        formatData.call(this);
        this.render();
    };
    /** 加载数据，并设置数据后渲染****/
    var loadData = function(){
        var url = this.attr('url');
        var me = this;
        if(url){
            this.attr('isLoading',true);
            $(this.getEl()).find('.form-report-no-data').addClass('form-data-isLoading');
            this.attr('data',[]);
            var html = this.getHtml();
            this.getEl().outerHTML = html;
            oui.getData(url,{},function(result){
                if(result&&result.success){
                    var json = oui.parseJson(result.msg);
                    var reportVO = json.reportVO||"" ;
                    me.attr('isLoading',false);
                    if(reportVO){
                        me.setData(reportVO,true);
                        me.attr('onLoadData')&&me.attr('onLoadData')(reportVO,true,me);
                    }else{
                        me.setData(json,false);
                        me.attr('onLoadData')&&me.attr('onLoadData')(json,false,me);
                    }
                }else{
                    oui.getTop().oui.alert(result.msg);
                }
            },'数据加载中',function(res){
                if((typeof res =='object') && res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('由于网络原因加载报表数据失败');
                }
                me.attr('isLoading',false);
                me.attr('data',[]);
                me.render();
                me.attr('onLoadData')&&me.attr('onLoadData')({},false,me);
            });
        }
    };
    /** 判断是否加载对应渲染引擎的资源***/
    var hasRequireRenderEngine = function(){
        var renderType = this.attr('renderType');
        var renderEngine = Report.Adapter[renderType];
        if(renderEngine&& renderEngine.hasRequire){
            return renderEngine.hasRequire();
        }else{
            throw new Error('渲染引擎 Report.Adapter.'+renderType+'没有实现hasRequire方法 ');
        }
    };
    /** 加载渲染引擎对应的资源****/
    var requireRenderEngine = function(){
        var renderType = this.attr('renderType');
        var renderEngine = Report.Adapter[renderType];
        if(renderEngine&& renderEngine.requirePaths&&renderEngine.requirePaths.length){
            var me = this;
            oui.require(renderEngine.requirePaths,function(){
                me.afterRender();
            },function(){
                oui.getTop().oui.alert('渲染引擎 Report.Adapter.'+renderType+'加载配置资源失败'+oui.parseString(renderEngine.requirePaths));
            });
        }else{
            oui.getTop().oui.alert('渲染引擎 Report.Adapter.'+renderType+'没有配置资源路径requirePaths ');
            throw new Error('渲染引擎 Report.Adapter.'+renderType+'没有配置资源路径requirePaths ');
        }
    };
    /** 控件渲染后置脚本*****/
    var afterRender=function(){
        if(!this.hasRequireRenderEngine()){
            this.requireRenderEngine();//按需加载 回调中 调用 控件afterRender方法，执行渲染
            return ;
        }

        var renderType = this.attr('renderType');
        var data = this.attr('data') ||[];
        var url = this.attr('url');
        /** 根据url 加载数据****/
        if((!data) || (!data.length) ){
            if(url){
                if(!this.inited){
                    this.inited = true;
                    this.loadData();
                    return ;
                }else{
                    this.attr('isLoading',false);
                    $(this.getEl()).find('.form-data-isLoading').removeClass('form-data-isLoading');
                }
            }else{
                this.attr('isLoading',false);
                $(this.getEl()).find('.form-data-isLoading').removeClass('form-data-isLoading');
            }

        }else if(data&&data.length){
            this.attr('isLoading',false);
            $(this.getEl()).find('.form-data-isLoading').removeClass('form-data-isLoading');
            /** 一、 初始化 渲染引擎适配 ***/
            this.initByRenderType();
            /** 二、报表类型在特定渲染引擎下的适配 ***/
            this.initByReportType();
            /** 三、执行特定报表类型在特定引擎下的渲染***/
            this.afterRenderByReportType();
            /** 四、执行引擎的公共渲染 ,执行渲染结束****/
            this.afterRenderByRenderType();
        }
        this.inited = true;
    };
    var formatData = function(){
        var dataFormatter = this.attr('dataFormatter');
        if(dataFormatter){
            if(typeof dataFormatter =='string'){
                dataFormatter = eval(dataFormatter);
            }
            var data = this.attr('data');
            data = dataFormatter&&dataFormatter(data,this);
            this.attr('data',data);
        }

    };
    /** 隐藏控件***/
    var hide=function(){
        var el=this.getEl();
        $(el).addClass('display_none');
        this.attr("hidden",true);
    };
    /** 显示控件****/
    var show=function(cfg){
        var el=this.getEl();
        $(el).removeClass('display_none');
        this.attr("hidden",false);
    };

})(window);





