
!(function(win){

    var HtmlParser = {

        /****
         * 根据字符串内容 和标签名获取 内容代码
         * @param str
         * @param ele
         * @returns {string|*}
         */
        getInnerCode4Mutil:function getInnerCode4Mutil(content,ele) {
            var me = this;
            var arr=[];
            var str = ''+content;
            var len = ele.length;
            do{
                var startIndex = str.indexOf('<'+ele)+len+1;
                var endIndex = str.indexOf("</"+ele+">");
                if(endIndex<0 || (startIndex-len-1<0)){
                    break;
                }
                var temp =str.substring(startIndex,endIndex);
                temp = temp.substring(temp.indexOf('>')+1);

                var splitStart = str.indexOf('<'+ele);
                var splitEndIndex = str.indexOf("</"+ele+">")+len+3;
                var rep = str.substring(splitStart,splitEndIndex);

                arr.push({
                    tag:ele,
                    attrString:me.getElementAttrString(str,ele),
                    content:temp
                });
                str = str.replace(rep,"");
            }while(true);
            return arr;
        },
        /****
         * 根据字符串内容 和标签名获取 内容代码
         * @param str
         * @param ele
         * @returns {string|*}
         */
        getInnerCode4One:function getInnerCode4One(str,ele) {
            var len = ele.length; // <>\n
            var startIndex = str.indexOf('<'+ele)+len+1;
            var endIndex = str.lastIndexOf("</"+ele+">");
            if(endIndex<0 || (startIndex-len-1)<0){
                return '';
            }
            var temp =str.substring(startIndex,endIndex);
            temp = temp.substring(temp.indexOf('>')+1);
            return temp;
        },
        /****
         * 获取 元素的属性字符串内容
         * @param str
         * @param ele
         */
        getElementAttrString:function getElementAttrString(str,ele){
            var len = ele.length; // <>\n
            var startIndex = str.indexOf('<'+ele)+len+1;
            var endIndex = str.indexOf("</"+ele+">");
            var temp =str.substring(startIndex,endIndex);
            temp = temp.substring(0,temp.indexOf('>'));
            return temp;
        }

    };
    function isIE() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        } else {
            return false;
        }
    }
    if (isIE()) { // 追加ie promise插件
        var script = document.createElement('script');
        script.type = 'text/javaScript';
        script.src = '/res_common/third/Promise/bluebird.js';  // bluebird 文件地址
        document.getElementsByTagName('head')[0].appendChild(script);
    }
//var isSupportReg = true;
//var regMap ={};
//try{
//    regMap={
//        _styleRegex: new RegExp("(?<=<style.*>)[ \s\S]*?(?=<\/style>)",'gmi'),
//        _styleAttrRegex: new RegExp("(?<=<style) .+(?=>)","gmi"),
//        _htmlRegex: new RegExp("(?<=<template.*>)[\s\S]*?(?=<\/template>)",'gmi'),
//        _scriptRegex: new RegExp("(?<=<script.*>)[ \s\S]*?(?=<\/script>)",'gmi')
//    };
//}catch(err){
//    isSupportReg = false;
//}
    var util = {
        startTemplateTag:'{{',
        endTemplateTag:'}}',
        endWith:function(str,endFix){
            if((str.lastIndexOf(endFix)+(endFix.length)) == str.length){
                return true
            }
            return false;
        },
        //获取路由的路径和详细参数
        getParamsUrl: function(url) {
            var tempUrl = url || location.hash;
            var hashDeatail = tempUrl.split("?"),
                hashName = hashDeatail[0].split("#")[1], //路由地址
                params = hashDeatail[1] ? hashDeatail[1].split("&") : [], //参数内容
                query = {};
            for (var i = 0; i < params.length; i++) {
                var item = params[i].split("=");
                var key = decodeURIComponent(item[0]);
                var v  = decodeURIComponent(item[1]);
                oui.JsonPathUtil.setObjByPath(key,query,v,true);
            }
            return {
                currentUrl:tempUrl,
                path: hashName,
                query: query,
                params: params
            }
        },
        /**
         *
         *   <summary>
         *          小数位不够，用0补足位数
         *   </summary>
         *   <param name="number">要处理的数字</param>
         *   <param name="dotNum">生成的小数位数</param>
         *
         * @param number
         * @param dotNum
         * @returns {string|number}
         */
        changeDecimalBuZero: function(number, dotNum) {
            var f_x = parseFloat(number).toFixed(dotNum);
            if (isNaN(f_x)) {
                return 0;
            }
            var s_x = number.toString();
            var pos_decimal = s_x.indexOf(".");
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += ".";
            }
            while (s_x.length <= pos_decimal + dotNum) {
                s_x += "0";
            }
            return s_x;
        },
        componentRandomGenKeyId(compName){
            return `${compName}_${this.genKey()}${Math.random().toString().split('.')[1].slice(0,5)}`
        },
        // 生成不同的 key
        genKey: function genKey() {
            var t = 'xxxxxxxx'
            return t.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0
                var v = c === 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        },
        hasClass: function hasClass (elem, cls) {
            cls = cls || '';
            if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
            return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
        },
        addClass: function addClass(ele, cls) {
            if (!util.hasClass(ele, cls)) {
                ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
            }
        },
        removeClass:function removeClass(elem, cls) {
            if (util.hasClass(elem, cls)) {
                var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
                while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                    newClass = newClass.replace(' ' + cls + ' ', ' ');
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            }
        },

        eval:function(fn){
            if(typeof fn =='object'){
                return fn;
            }
            var Fn = Function;  //一个变量指向Function，防止有些前端编译工具报错
            try{
                var temp = new Fn('return ' + fn)();
                return temp;
            }catch(err){
                //console.log(err);
                return null;
            }
        },
        /***
         * 获取当前元素配置控制器的data属性
         * @param el
         * @returns {*|jQuery}
         */
        getControllerData:function(el){
            if(el.outerHTML.indexOf('search-setting-logic.vue')>-1){
                // debugger;
            }
            var clz = util.getController(el);
            var data = $(el).attr('data');

            if(clz && (clz !=window)){
                if(typeof data =='string'){
                    if(data.indexOf('(')>-1){//方法调用
                        var funPath = data.substring(0,data.indexOf('('));
                        if(funPath.indexOf('.')<0){
                            data = clz.FullName+'.'+data;
                        }
                    }else{//属性调用
                        if(data.indexOf('.')<0){
                            data = clz.FullName+'.'+data;
                        }
                    }
                }
            }

            try{
                if(!data){
                    data = window;
                }else{
                    data = oui.parseJson(data);
                }
            }catch(e){
                console.log(el.outerHTML+'解析异常');
                oui.log(el.outerHTML+'解析异常');
                data = {};
            }
            return data;
        },
        getController:function(el){
            var controller = $(el).attr('oui-controller');
            var clz = '';
            if(controller){
                clz = oui.biz.Tool.getControllerClass(controller);
            }else{
                var clsFullName= $(el).closest('[oui-controller]').attr('oui-controller');
                if(clsFullName){
                    try{
                        clz = oui.biz.Tool.getControllerClass(clsFullName);
                    }catch(err){
                        try{
                            clz = oui.parseJson(clsFullName);
                        }catch(cerr){
                            clz = window;
                        }
                    }
                }
            }
            return clz;
        },
        /****
         *
         */
        /**
         * 解析组件
         */
        parseComponent: function parseComponent(content, options) {
            if (!content) throw Error("content is null.");
            if (!options) options = {};
            var styles,styleAttrs,htmls,scripts;
            styles = [];
            styleAttrs = [];
            htmls =[];
            scripts =[];

            HtmlParser.getInnerCode4Mutil(content,'style').forEach(function(item){
                styles.push(item.content||"");
                styleAttrs.push(item.attrString||"");
            });
            htmls.push( HtmlParser.getInnerCode4One(content,'template')||""); //获取html模板内容
            scripts.push( HtmlParser.getInnerCode4One(content,'script')||"");

            //先处理脚本
            var script = scripts.join("");
            script = "(" + /{[\s\S]*}/gmi.exec(script) + ")";

            var obj = util.eval(script);
            for (var prop in obj) {
                options[prop] = obj[prop];
            }
            options.templateType= options.templateType||'vue';//默认为vue模板

            var style = "";
            if (styles != null && styles.length > 0) {
                if(options.templateType =='vue'){
                    style = "<component scoped :is=\"'style'\"";
                }else{
                    style = "<style type=\"text/css\" scoped ";
                }
                if (styleAttrs != null && styleAttrs.length > 0) {
                    style += styleAttrs.join("");
                }
                style += ">";
                style += styles.join("");

                if(options.templateType =='vue'){
                    style += "</component>";
                }else{
                    style += "</style>";
                }

            }

            if (htmls == null || htmls.length <= 0) {
                throw Error("not found '<template>' tag.");
            }
            var html = htmls.join("");
            html = html.replace(/(<!--.*?-->)/g, '');
            if (style) {
                if(options.templateType =='vue'){ //vue模板特殊处理样式模板
                    var index = html.lastIndexOf("</");
                    if (index !== -1) {
                        html = html.substr(0, index) + style + html.substr(index);
                    }
                    options.styleTemplate = style;
                }else{
                    options.styleTemplate = style;
                }

            }else{
                options.styleTemplate ='';
            }
            options.template = html;
            obj =null;
            delete obj;
            return options;
        },
        loadComponent4Instance:function loadComponent4Vue(url,options,compParams,isInclude){
            var target = this;
            var viewsMap =oui.viewsMap;
            //console.log('loadComponent:'+url);
            if(viewsMap[url] &&viewsMap[url].options){
                return oui.getComponent(url,options,compParams,isInclude);
            }
            var url4load = url;
            var contextPath = oui.getContextPath();

            if(url.indexOf('/')==0){ //以斜杠开头
                if(url.indexOf(contextPath)!=0){
                    url4load= contextPath+url.substring(1);
                }
            }else{//以相对路径 或者http路径开头
                if(url.indexOf('http')!=0){//以相对路径开头
                    url4load = contextPath+url;
                }
            }


            /** 模板不存在 尝试 通过ajax拉取模板资源，并解析渲染 ***/
            if(oui_context.promise){ //chrome插件扩展
                return  new Promise(function(success,error){
                    oui.loadUrl({
                        url:url4load,
                        subContentType:2,
                        callback:function(html){
                            var text = html;
                            var tplOptions = target.parseComponent(text, {});
                            viewsMap[url] ={
                                url:url,
                                options:tplOptions //模板属性
                            };
                            success(oui.getComponent(url,options,compParams,isInclude));
                        }
                    });
                });
            }else{
                var text = oui.loadUrl(url4load, true, false);
                var tplOptions = target.parseComponent(text, {});
                viewsMap[url] ={
                    url:url,
                    options:tplOptions //模板属性
                };
                return oui.getComponent(url,options,compParams,isInclude);
            }
        },
        /**
         * 加载单文件组件
         */
        loadComponent: function loadComponent (url, options,params,el,success,error) {

            var target = this;
            var viewsMap =oui.viewsMap;
            //console.log('loadComponent:'+url);
            if(viewsMap[url] &&viewsMap[url].options){
                oui.renderComponent(url,options,params,success,error,el);
                return;
            }

            /** 模板不存在 尝试 通过ajax拉取模板资源，并解析渲染 ***/
            var url4load = url;
            var contextPath = oui.getContextPath();

            if(url.indexOf('/')==0 ||url.indexOf('chrome-extension')==0){ //以斜杠开头
                if(url.indexOf(contextPath)!=0){
                    url4load= contextPath+url.substring(1);
                }
            }else{//以相对路径 或者http路径开头
                if(url.indexOf('http')!=0){//以相对路径开头
                    url4load = contextPath+url;
                }
            }

            if(NProgress){
                NProgress.start();
            }
            var text = '';
            if(oui_context.promise){ //chrome插件扩展
                oui.loadUrl({
                    url:url4load,
                    subContentType:2,
                    callback:function(html){

                        if(NProgress){
                            NProgress.set(0.5);
                            NProgress.done();
                        }
                        text = html;
                        var tplOptions = target.parseComponent(text, {});
                        viewsMap[url] ={
                            url:url,
                            options:tplOptions //模板属性
                        };
                        oui.renderComponent(url,options,params,success,error,el);//加载渲染属性
                    }
                });
                return  ;
            }else{
                text = oui.loadUrl(url4load, true, false);
            }

            if(NProgress){
                NProgress.set(0.5);
                NProgress.done();
            }
            var tplOptions = target.parseComponent(text, {});
            viewsMap[url] ={
                url:url,
                options:tplOptions //模板属性
            };
            oui.renderComponent(url,options,params,success,error,el);//加载渲染属性

            //axios.get(url)
            //.then(function (response) {
            //    //ajax拉取后 先缓存资源
            //    var tplOptions = target.parseComponent(response.data, {});
            //    viewsMap[url] ={
            //        url:url,
            //        options:tplOptions //模板属性
            //    };
            //    oui.renderComponent(url,options,success,error,el);//加载渲染属性
            //});
        }
    };
    var PageData = function (cfg) {
        var temp = {
            designerId:null,//设计器id
            dataId:null, //当前页面的数据Id
            designer:null,
            mainData:null,
            detailData:null
        };
        this.setFormDataByFormValue = setFormDataByFormValue;
        this.getPageData = getPageData; this.getFormValue = getFormValue;this.getFormData = getFormData;
        this.getControlByBizId = getControlByBizId;
        this.getData =  getData;
        this.getValue = getValue;
        this.getDisplay = getDisplay;
        this.getControl = getControl;
        this.getDataList = getDataList;
        this.addDataRow = addDataRow;
        this.getDesigner = getDesigner;
        this.getControlRenderDataById =  getControlRenderDataById;
        this.findControlUrl = findControlUrl;
        this.getClientType = getClientType;
        this.findFieldStyle4Dom = findFieldStyle4Dom;
        this.render = render;
        this.updatePageData = updatePageData;
        this.beforeInit = beforeInit; //初始化前
        this.afterInit = afterInit; //初始化后
        this.bindEvents = bindEvents;
        // this.findPath = findPath;
        $.extend(true,this,temp,cfg);
        this.bindEvents(); //绑定事件

    };
    //获取当前组件所在的端类型
    var getClientType = function(clientType){
        return oui.util.getClientType(clientType);
    };

    /**
     * 根据formValue，设置formData
     * @param formValue
     * @returns {{}}
     */
    var setFormDataByFormValue = function (formValue){
        var me = this;
        var mainData = me.mainData ||{};
        if(formValue.id){
            this.dataId = formValue.id; //数据Id
        }
        oui.eachArray(me.designer.controls||[],function(item){
            if((item.formField||item.isFormField) &&(!item.detailId)){ //非明细表表单字段
                var currData = mainData[item.bizId] ;
                if(!currData){
                    currData = {
                        value:formValue[item.bizId]
                    };
                }

                currData.value = formValue[item.bizId];
                mainData[item.bizId]= currData;
            }
        });
        return mainData;
    }
    var getFormValue = function(){
        var me = this;
        var mainData = me.mainData ||{};
        var cfg = {

        };
        oui.eachArray(me.designer.controls||[],function(item){
            if((item.formField||item.isFormField) &&(!item.detailId)){ //非明细表表单字段
                var currData = mainData[item.bizId]||{};
                cfg [item.bizId] = currData.value;
            }
        });
        if(this.dataId){
            cfg['id'] = this.dataId;//默认的数据id
        }
        return cfg;
    };
    var getFormData = function(){
        var me = this;
        var mainData = me.mainData ||{};
        var cfg = {

        };
        oui.eachArray(me.designer.controls||[],function(item){
            if(item.formField &&(!item.detailId)){ //非明细表表单字段
                var currData = mainData[item.bizId]||{};
                cfg [item.id] = currData;
            }
        });
        return cfg;
    };



    var getPageData = function(){
        return this;
    };
    /***
     * 绑定事件
     */
    var bindEvents = function(){
        var designer = this.getDesigner();
        var events = designer.events ||{};
        //绑定 交互动作事件
        bindInteractionEvents(this,events);

        for (var k in events) {
            if(k =='interaction'){
                continue;
            }
            if(events[k]){//有配置才绑定事件配置
                var m= k.charAt(0).toUpperCase()+ k.substring(1);
                this['on'+m] = oui.parseJson2Function(events[k]);
            }
        }
    };
    //页面事件类型枚举
    /*
     * ',            请选择触发方式,
     * 单击,
     * 双击,
     * 单击前,
     * 单击前,
     * 单击后,
     * 双击前,
     * 双击后,
     * 鼠标移入,
     * 鼠标移出,
     * 按下鼠标,
     * 页面值改变事件,
     * 页面加载事件,
     * 组件值改变事件,
     * 组件加载事件,          '
     * 页面公共事件
     */
    var PageEventTypeEnum = {//beforeInit,init,afterInit
        beforeInit:{
            name:'beforeInit',
            value:'beforeInit',
            display:'页面加载前事件' //数据准备
        },
        afterInit:{
            name:'afterInit',
            value:'afterInit',
            display:'页面加载后事件'//渲染后
        },
        valueChange:{
            name:'valueChange',
            value:'valueChange',
            display:'页面值改变事件'
        }
    };
    //控件事件类型枚举 控件公共事件
    var ControlEventTypeEnum ={
        click:{ //单击
            name:'click',
            value:'click',
            display:'单击'
        },
        dblclick:{ //双击
            name:'dblclick',
            value:'dblclick',
            display:'双击'
        },
        mouseenter:{
            name:'mouseenter',
            value:'mouseenter',
            display:'鼠标移入'
        },
        mouseleave:{
            name:'mouseleave',
            value:'mouseleave',
            display:'鼠标离开'
        },
        mousedown:{
            name:'mousedown',
            value:'mousedown',
            display:'鼠标按下'
        },
        beforeInit:{
            name:'beforeInit',
            value:'beforeInit',
            display:'组件加载前事件' //数据准备
        },
        afterInit:{
            name:'afterInit',
            value:'afterInit',
            display:'组件加载后事件'//渲染后
        },
        valueChange:{
            name:'valueChange',
            value:'valueChange',
            display:'组件值改变事件'
        }

    };

    util.PageEventTypeEnum = PageEventTypeEnum;
    util.ControlEventTypeEnum = ControlEventTypeEnum;

    //页面事件 包括 公共事件,页面私有事件，页面自定义事件
    //控件事件 包括 控件公共事件，控件私有事件，控件自定义事件
    util.findEventTypes = function (pageOrControl){
        var arr = [];
        //规则：所有事件类型不能重复，确保唯一
        //1.先放自定义事件,每个页面或者每个控件在线自定义的
        //2.再放私有事件,根据页面类型存放
        //3.最后放公共事件

        //自定义事件
        var defineEventTypes = oui.JsonPathUtil.getJsonByPath("otherAttrs.defineEventTypes",pageOrControl) ||[];
        oui.eachArray(defineEventTypes,function (item){
            arr.push({
                value:item.value,
                display:item.display,
                eventInputParams:item.eventInputParams||[],
                eventOutputParams:item.eventOutputParams||[],
                eventTempParams:item.eventTempParams||[],
                type:'define'
            });
        })

        //从页面控件列表中找到对应类型的控件
        var pageControls = oui.JsonPathUtil.getJsonByPath("com.oui.absolute.AbsoluteDesign.pageListControls",window);
        var privateEventTypes4config =null;
        if(pageControls && pageOrControl.controlType){//存在控件配置并且当前对象是控件,获取私有配置
            var one = oui.findOneFromArrayBy(pageControls,function (item){
                if(item.controlType == pageOrControl.controlType){
                    return true;
                }
            });
            if(one){
                privateEventTypes4config  =  oui.JsonPathUtil.getJsonByPath("otherAttrs.privateEventTypes",one)  ;
            }
        }else{
            //处理不同类型页面的私有配置 TODO
        }
        //公共配置没有找到 尝试从当前控件中找，进行错误防护
        if(!privateEventTypes4config || (!privateEventTypes4config.length)){
            privateEventTypes4config  =  oui.JsonPathUtil.getJsonByPath("otherAttrs.privateEventTypes",pageOrControl)  ;
            //私有事件
        }

        oui.eachArray(privateEventTypes4config||[],function (item){
            arr.push({
                value:item.value,
                display:item.display,

                eventInputParams:item.eventInputParams||[],
                eventOutputParams:item.eventOutputParams||[],
                eventTempParams:item.eventTempParams||[],
                type:'private'
            });
        })

        if(pageOrControl.controlType){//是控件

            for(var k in ControlEventTypeEnum){
                arr.push({
                    value:ControlEventTypeEnum[k].value,
                    display:ControlEventTypeEnum[k].display,

                    eventInputParams:ControlEventTypeEnum[k].eventInputParams||[],
                    eventOutputParams:ControlEventTypeEnum[k].eventOutputParams||[],
                    eventTempParams:ControlEventTypeEnum[k].eventTempParams||[],
                    type:'common'
                });
            }
        }else{//是页面
            for(var k in PageEventTypeEnum){
                arr.push({
                    value:PageEventTypeEnum[k].value,
                    display:PageEventTypeEnum[k].display,
                    eventInputParams:PageEventTypeEnum[k].eventInputParams||[],
                    eventOutputParams:PageEventTypeEnum[k].eventOutputParams||[],
                    eventTempParams:PageEventTypeEnum[k].eventTempParams||[],
                    type:'common'
                });
            }
        }
        return arr;

    }

    //varSourceType:'', //变量值数据来源
    // 1.url参数 2.路由参数 3.页面变量 4.控件值 5.控件的相关数据
    // 6.表单数据  7.当前window全局变量 8.顶层window全局变量 9.本地存储cookie 10.本地存储 sessionStorage
    // 11.本地存储localStorage 12.本地存储 indexedDB 13.当前交互动作输入参数 14.当前交互动作输出参数 15.当前交互动作临时变量  16.页面的相关数据
    /**
     * 变量值 的数据来源
     * @type {{}}
     */
    var VarSourceTypeEnum = {

        url:{
            name:'url',
            value:'url',
            display:'url参数',
            //获取url参数
            findInputValue:function (eventRootQueue,controller,targetInputParam){
                var v = '';
                if(targetInputParam.name){
                    var value = oui.getParam(targetInputParam.name);
                    if(typeof value !='undefined'){
                        v = value;
                    }
                }
                return v;
            },
            //更新url参数
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    var param = oui.getParam();
                    param[targetOutputParam.name] = v;
                }
            }
        },
        router:{
            name:'router',
            value:'router',
            display:'router参数',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                var query = oui.router.query||{}; //路由参数
                if(targetInputParam.name){
                    v   = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,query);
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                var query = oui.router.query||{}; //路由参数
                if(targetOutputParam.name){
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,query,v,true);
                }
            }
        },
        pageVar:{
            name:'pageVar',
            value:'pageVar',
            display:'页面变量',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name){
                    var pageData = controller.getPageData();
                    if(!pageData.pageVar){
                        pageData.pageVar = {};
                    }
                    v   = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,controller.getPageData().pageVar);
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    var pageData = controller.getPageData();
                    if(!pageData.pageVar){
                        pageData.pageVar = {};
                    }
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,controller.getPageData().pageVar,v,true);
                }
            }
        },
        pageData:{
            name:'pageData',
            value:'pageData',
            display:'页面相关数据',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name){
                    var pageData = controller.getPageData();
                    v   = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,pageData);
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    var pageData = controller.getPageData();
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,pageData,v,true);
                }
            }
        },
        controlValue:{
            name:'controlValue',
            value:'controlValue',
            display:'控件值',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    var pageData = controller.getPageData();
                    //var title = targetInputParam.config.title ;//控件的标题
                    var control = pageData.getControl(targetInputParam.config.controlId);
                    if(control && (control.bizId == targetInputParam.name)){ //控件存在
                        var formValue = pageData.getFormValue();
                        v = formValue[control.bizId];
                    }
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    var pageData = controller.getPageData();
                    var control = pageData.getControl(targetOutputParam.config.controlId);
                    if(control && (control.bizId == targetOutputParam.name)){ //控件存在
                        if(!pageData.mainData[control.bizId]){
                            pageData.mainData[control.bizId] = {
                                value:v,
                                display:v
                            };
                        }
                        pageData.mainData[control.bizId].value = v;
                        //TODO 需要验证 值改变后 控件显示的同步问题

                    }
                }
            }
        },
        controlData:{
            name:'controlData',
            value:'controlData',
            display:'控件相关数据',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    v = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,controller);//获取相关数据中的值
                }else{
                    v = controller;
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,controller,v,true);
                }
            }
        },
        formValue:{
            name:'formValue',
            value:'formValue',
            display:'表单数据',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';

                if(targetInputParam.name =='$formValue'){ //处理表单数据
                    var pageData = controller.getPageData();
                    v = pageData.getFormValue();
                }else if(targetInputParam.name ){ //存控件的 bizId
                    var pageData = controller.getPageData();
                    v = pageData.mainData[targetInputParam.name].value;
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if( targetOutputParam.name=='$formValue' ){//没有 控件bizId，则回填整个表单数据
                    var pageData = controller.getPageData();
                    pageData.setFormDataByFormValue(v);
                }else if(targetOutputParam.name){
                    var pageData = controller.getPageData();
                    //直接指定
                    pageData.mainData[targetOutputParam.name].value = v;
                }
            }
        },
        windowGlobalVar:{
            name:'windowGlobalVar',
            value:'windowGlobalVar',
            display:'当前window全局变量',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    v = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,window);//获取相关数据中的值
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,window,v,true);
                }
            }
        },
        topWindowGlobalVar:{
            name:'topWindowGlobalVar',
            value:'topWindowGlobalVar',
            display:'顶层window全局变量',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    v = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,window.top);//获取相关数据中的值
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,window.top,v,true);
                }
            }
        },
        cookie:{
            name:'cookie',
            value:'cookie',
            display:'本地存储cookie',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    v = oui.cookie(targetInputParam.name);
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.cookie(targetOutputParam.name,v);
                }
            }
        },
        sessionStorage:{
            name:'sessionStorage',
            value:'sessionStorage',
            display:'本地存储sessionStorage',

            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    v =oui.session(targetInputParam.name);
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.session(targetOutputParam.name,v);
                }
            }
        },
        localStorage:{
            name:'localStorage',
            value:'localStorage',
            display:'本地存储localStorage',

            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name ){ //存控件的 bizId
                    v =oui.storage.get(targetInputParam.name);
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.storage.set(targetOutputParam.name,v);
                }
            }
        },
        indexedDB:{
            name:'indexedDB',
            value:'indexedDB',
            display:'本地存储indexedDB', //oui.ns(ns).db = oui.buildDB(config ,callback);
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                /*
                query:{},//检索数据条件的配置
                update:{}//更新数据行的配置
                 */
                //构造数据库
                return  new Promise(function(success,error){
                    if(targetInputParam.name ){ //查询的表
                        var db = util.buildDB(targetInputParam);
                        var oper =targetInputParam.config.oper ||'query';//query,selectOne
                        if(oper =='query'){
                            db[targetInputParam.name].query(targetInputParam.config.query||{},function (res){
                                success&&success(res);
                            },function (err){
                                error&&error(err);
                            });
                        }else if(oper =='selectOne'){
                            db[targetInputParam.name].selectOne(targetInputParam.config.query||{},function (res){
                                if(res){
                                    if(res && res.length){
                                        success&&success(res[0]);
                                    }else{
                                        success&&success(null);
                                    }
                                }
                            },function (err){
                                error&&error(err);
                            });
                        }

                    }
                });

            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){

                return  new Promise(function(success,error){
                    var db = util.buildDB(targetOutputParam);
                    if(targetOutputParam.name){//存储的表
                        var oper = targetOutputParam.config.oper;
                        if(oper =='updateBy'){
                            db[targetOutputParam.name].updateBy({ //v是对象,更新多个
                                condition:targetOutputParam.config.condition||{},
                                entity:v
                            },function (res){
                                success&&success(res);
                            },function (err){
                                error&&error(err);
                            });
                        }else if(oper =='saveOrUpdate'){//v 是对象,更新一个
                            db[targetOutputParam.name].saveOrUpdate(v,function (res){
                                success&&success(res);
                            },function (err){
                                error&&error(err);
                            });

                        }else if(oper =='removeBy'){//v 是对象,删除多个
                            db[targetOutputParam.name].removeBy(v,function (res){
                                success&&success(res);
                            },function (err){
                                error&&error(err);
                            });
                        }else if(oper =='removeOne'){//v 是对象,删除一个
                            db[targetOutputParam.name].removeOne(v,function (res){
                                success&&success(res);
                            },function (err){
                                error&&error(err);
                            })
                        }
                    }
                });
            }
        },
        rootQueueInputParams:{
            name:'rootQueueInputParams',
            value:'rootQueueInputParams',
            display:'当前交互动作输入参数',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name){
                    v   = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,eventRootQueue._event_params.inputParams);
                }else{
                    v = eventRootQueue._event_params.inputParams;
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,eventRootQueue._event_params.inputParams,v,true);
                }else{
                    eventRootQueue._event_params.inputParams = v||{};
                }
            }
        },
        rootQueueOutputParams:{
            name:'rootQueueOutputParams',
            value:'rootQueueOutputParams',
            display:'当前交互动作输出参数',
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name){
                    v   = oui.JsonPathUtil.getJsonByPath(targetInputParam.name,eventRootQueue._event_params.outputParams);
                }else{
                    v = eventRootQueue._event_params.outputParams;
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){

                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,eventRootQueue._event_params.outputParams,v,true);
                }else{
                    eventRootQueue._event_params.outputParams = v ||{};
                }
            }
        },
        rootQueueTempParams:{
            name:'rootQueueTempParams',
            value:'rootQueueTempParams',
            display:'当前交互动作临时变量', // _event_params={args:arguments,inputParams:{'+code4eventParams+'},tempParams:{}};
            findInputValue:function (eventRootQueue,controller,targetInputParam){

                var v = '';
                if(targetInputParam.name) {

                    v = oui.JsonPathUtil.getJsonByPath(targetInputParam.name, eventRootQueue._event_params.tempParams);
                }else{
                    v = eventRootQueue._event_params.tempParams;
                }
                return v;
            },
            updateOutputValue : function (eventRootQueue,controller,targetOutputParam,v){
                if(targetOutputParam.name){
                    oui.JsonPathUtil.setObjByPath(targetOutputParam.name,eventRootQueue._event_params.tempParams,v,true);
                }else{
                    eventRootQueue._event_params.tempParams = v;
                }
            }
        },



        findInputValue:function (eventRootQueue,controller,targetInputParam){
            //根据特定的枚举执行 对应的方法
            var v = '';
            if(targetInputParam.varSourceType){
                var currEnum = this[targetInputParam.varSourceType];
                if(currEnum&&currEnum.findInputValue){
                    v = currEnum.findInputValue(eventRootQueue,controller,targetInputParam);
                }
            }
            return v;
        },
        updateOutputValue:function (eventRootQueue,controller,targetOutputParam,v){
            //根据特定的枚举执行 对应的方法
            if(targetOutputParam.varSourceType){
                var currEnum = this[targetOutputParam.varSourceType];
                if(currEnum&&currEnum.updateOutputValue){
                    return  currEnum.updateOutputValue(eventRootQueue,controller,targetOutputParam,v);
                }
            }
            return null;
        }

    };

    /**
     * 根据参数 构造数据库，如果没有配置则构造默认数据库
     * @param targetParam
     * @returns {*}
     */
    util.buildDB = function (targetParam){
        if(targetParam.name && targetParam.config){ //indexedDB 数据库名
            if(!targetParam.config.dbConfig){
                targetParam.config.dbConfig = {};
            }
            var dbConfig = targetParam.config.dbConfig; // dbName,dbVersion,dbStores
            if(!dbConfig.dbName){ //构造默认数据库配置
                dbConfig.dbName = 'oui_default';
            }
            dbConfig.dbVersion = dbConfig.dbVersion||1;
            var dbns = oui.ns('oui.'+dbConfig.dbName)
            if(!dbns.db){
                /*
                 {
                  dbName:'page_design_db', //数据库名
                  dbVersion:1,//数据库版本，每次要做表结构变更时，更新该属性，否则表结构不变更
                  dbStores:{
                    o_page_design:{//page_design_db-自动任务配置页面
                      name:'o_page_design',
                      indexs:{
                        'pk_id':{
                          key:'id',
                          keyPaths:['id'],
                          options:{
                            unique:true
                          }
                        }
                      }
                    }
                  }
                }
                 */

                if(!dbConfig.dbStores){
                    dbConfig.dbStores ={
                    };
                }
                /***
                 * 构造默认数据表配置
                 * @type {{name, indexs: {pk_id: {options: {unique: boolean}, keyPaths: string[], key: string}}}}
                 */
                if(!dbConfig.dbStores[targetParam.name]){
                    dbConfig.dbStores[targetParam.name] = {
                        name:targetParam.name,
                        indexs:{
                            'pk_id':{
                                key:'id',
                                keyPaths:['id'],
                                options:{
                                    unique:true
                                }
                            }
                        }
                    };
                }
                dbns.db = oui.buildDB(dbConfig);
            }

        }
        return  oui.ns('oui.'+dbConfig.dbName).db;
    }

    /**
     *
     * 前端逻辑调用的执行过程封装
     * {
     *
     *     "inputParams":[
     *         {
     *             "dynamic":false,
     *             "fieldType":"int_type",
     *             "name":"pageIndex",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"int_type",
     *             "name":"pageSize",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"string_type",
     *             "name":"queryParam",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"table_type",
     *             "name":"dataObjectModel",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"string_type",
     *             "name":"mainDataId",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"string_type",
     *             "name":"detailTableId",
     *             "urlEncodeKey":false
     *         }
     *     ],
     *     "outputParams":[
     *         {
     *             "dynamic":false,
     *             "fieldType":"tableData_type",
     *             "name":"dataList",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"int_type",
     *             "name":"total",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"boolean_type",
     *             "name":"success",
     *             "urlEncodeKey":false
     *         }
     *     ],
     *     //目标输入输出来源 变量 跟 后端逻辑有所不同
     *     "targetInputParams":[
     *         {
     *             varSourceType:'', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
     *             "fieldType":"string_type", //变量类型
     *             "name":"queryParam", //变量名
     *             config:{// 解析变量的特殊配置
     *                 //针对 控件值、控件相关数据 绑定的配置
     *                 controlId:'', //控件id
     *
     *                 //针对 indexedDB存储的数据获取规则的配置
     *                 query:{},//检索数据条件的配置
     *             }
     *         }
     *     ],
     *     "targetOutputParams":[
     *          {
     *             varSourceType:'', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
     *             "fieldType":"string_type", //变量类型
     *             "name":"queryParam", //变量名
     *             config:{// 解析变量的特殊配置
     *                 //针对 控件值、控件相关数据 绑定的配置
     *                 controlId:'', //控件id
     *
     *                 //针对 indexedDB存储的数据获取规则的配置
     *                 query:{},//检索数据条件的配置
     *                 update:{}//更新数据行的配置
     *             }
     *         }
     *     ]
     * }
     * 前端页面执行后端逻辑的调用时，输入来源于 页面Url参数、自定义的页面变量、控件值、控件的相关数据；输出绑定到 自定义的页面变量、控件值、控件数据源
     * 这个方法用于前端调用执行的自动化
     * @param config
     * @param callback
     */
    // 处理 前端执行后端逻辑调用的过程
    util.executeLogic = function (eventRootQueue,controller,config,callback,error){
        // 处理执行动作配置

        //输入参数映射用于构造  逻辑调用 的输入
        //输出参数映射用于构造 逻辑响应输出后的绑定
        var inputParams = config.inputParams ||[]; //逻辑的输入定义
        var outputParams = config.outputParams ||[]; //逻辑的输出定义
        var executePath = config.executePath; //ajax执行的逻辑路径 （后端根据逻辑Id自动构造到当前config配置中）
        var logicId = config.logicId; //逻辑id

        var targetInputParams = config.targetInputParams ||[];//输入参数绑定
        var targetOutputParams = config.targetOutputParams ||[];//输出参数绑定

        //构造输入参数
        var input= {};
        var qu= oui.Queue.createNewQueue();
        oui.util.appendInputQueueTask(eventRootQueue,controller,qu,input,inputParams,targetInputParams);//输入参数构造队列任务
        qu.start(function (){
            oui.postData(executePath,input,function (res){
                if (res.success) {
                    var quEnd = oui.Queue.createNewQueue();
                    oui.util.appendOutputQueueTask(eventRootQueue,controller,quEnd,res,outputParams,targetOutputParams); //输出参数构造队列任务
                    quEnd.start(function (){
                        callback&&callback();
                    });
                }else{
                    error&&error(res.msg||'请求失败');
                }
            },function (err){
                if(err==null){
                    error&&error('后端逻辑执行失败');
                }else if(typeof err =='string'){
                    error&&error(err);
                }else{
                    error&&error(err.msg||'后端逻辑执行失败');
                }
            },config.loadingMsg||'处理中...');
        });
    };

    /***
     *  根据输入参数配置，构造 输入参数设置队列
     * @param eventRootQueue
     * @param controller
     * @param qu
     * @param input
     * @param inputParams
     * @param targetInputParams
     */
    util.appendInputQueueTask = function(eventRootQueue,controller,qu,input,inputParams,targetInputParams){
        oui.eachArray(inputParams,function(item,index){
            var targetInput = targetInputParams[index];
            var value = '';
            if(targetInput){
                //根据目标参数配置的数据来源 获取对应值;
                //取值
                value = oui.util.findValueByTargetInputParam(eventRootQueue,controller,targetInput);
                if(value !=null && value instanceof Promise){
                    qu.add({
                        name:item.name,
                        promise:value,
                        run:function (){
                            var me =this;
                            this.promise.then(function (res){
                                input[me.name] = res;
                                me.inited = true;
                            }).finally(function (){
                                me.inited = true;
                            });
                        }
                    });
                }
            }
            input[item.name] = value;
        });
    };
    /***
     * 根据输出参数 构造 输出参数设置队列
     * @param eventRootQueue
     * @param controller
     * @param quEnd
     * @param res
     * @param outputParams
     * @param targetOutputParams
     */
    util.appendOutputQueueTask = function (eventRootQueue,controller,quEnd,res,outputParams,targetOutputParams){
        //回调 处理 变更值
        oui.eachArray(outputParams,function (item,index){
            var targetOutput = targetOutputParams[index];
            if(targetOutput){
                var v = res[item.name]; //当前返回的属性值
                //回填值到指定 的输出 上
                //回填值
                var promise = oui.util.updateValueByOutputParam(eventRootQueue,controller,targetOutput,v);
                if(promise !=null && (promise instanceof Promise)){
                    quEnd.add({
                        promise:promise,
                        run:function (){
                            var me =this;
                            this.promise.then(function (res){

                                me.inited = true;
                            }).finally(function (){
                                me.inited = true;
                            });
                        }
                    });
                }
            }
        });
    }
    /**
     *
     * 前端Excel导入调用的执行过程封装
     * {
     *
     *     "inputParams":[
     *         {
     *             "dynamic":false,
     *             "fieldType":"int_type",
     *             "name":"pageIndex",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"int_type",
     *             "name":"pageSize",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"string_type",
     *             "name":"queryParam",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"table_type",
     *             "name":"dataObjectModel",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"string_type",
     *             "name":"mainDataId",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"string_type",
     *             "name":"detailTableId",
     *             "urlEncodeKey":false
     *         }
     *     ],
     *     "outputParams":[
     *         {
     *             "dynamic":false,
     *             "fieldType":"tableData_type",
     *             "name":"dataList",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"int_type",
     *             "name":"total",
     *             "urlEncodeKey":false
     *         },
     *         {
     *             "dynamic":false,
     *             "fieldType":"boolean_type",
     *             "name":"success",
     *             "urlEncodeKey":false
     *         }
     *     ],
     *     //目标输入输出来源 变量 跟 后端逻辑有所不同
     *     "targetInputParams":[
     *         {
     *             varSourceType:'', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
     *             "fieldType":"string_type", //变量类型
     *             "name":"queryParam", //变量名
     *             config:{// 解析变量的特殊配置
     *                 //针对 控件值、控件相关数据 绑定的配置
     *                 controlId:'', //控件id
     *
     *                 //针对 indexedDB存储的数据获取规则的配置
     *                 query:{},//检索数据条件的配置
     *             }
     *         }
     *     ],
     *     "targetOutputParams":[
     *          {
     *             varSourceType:'', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
     *             "fieldType":"string_type", //变量类型
     *             "name":"queryParam", //变量名
     *             config:{// 解析变量的特殊配置
     *                 //针对 控件值、控件相关数据 绑定的配置
     *                 controlId:'', //控件id
     *
     *                 //针对 indexedDB存储的数据获取规则的配置
     *                 query:{},//检索数据条件的配置
     *                 update:{}//更新数据行的配置
     *             }
     *         }
     *     ]
     * }
     * 前端页面执行Excel导入的后端逻辑的调用时，输入来源于 页面Url参数、自定义的页面变量、控件值、控件的相关数据；输出绑定到 自定义的页面变量、控件值、控件数据源
     * 这个方法用于前端Excel导入调用执行的自动化
     * excel导入
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executeImpExcel = function (eventRootQueue,controller,config,callback,error){
        config.uploadType = 'impExcel';
        oui.util.executeUpload(eventRootQueue,controller,config,callback,error);
    };
    /**
     * excel 导出
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executeExpExcel = function (eventRootQueue,controller,config,callback,error){
        config.downloadType ='expExcel';
        oui.util.executeDownload(eventRootQueue,controller,config,callback,error);
    };

    /**
     * 文件下载
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executeDownload = function (eventRootQueue,controller,config,callback,error){
        // 处理执行动作配置

        //输入参数映射用于构造  文件上传的输入
        //输出参数映射用于构造 文件上传后响应输出后的绑定

        //config.logicId
        // 逻辑id 后台自动转换 为对应的逻辑地址
        //config.executePath

        // 处理执行动作配置

        //输入参数映射用于构造  逻辑调用 的输入
        //输出参数映射用于构造 逻辑响应输出后的绑定
        var inputParams = config.inputParams ||[]; //逻辑的输入定义
        var executePath = config.executePath; //ajax执行的逻辑路径 （后端根据逻辑Id自动构造到当前config配置中）
        var logicId = config.logicId; //逻辑id
        var targetInputParams = config.targetInputParams ||[];//输入参数绑定

        if(!config.downloadType){
            config.downloadType ='downloadFile';
        }
        if(!executePath){
            if(config.downloadType =='downloadFile'){
                error('文件下载的后端逻辑没有配置');
            }else{
                error('Excel导出的后端逻辑没有配置');
            }
            return;
        }
        //构造输入参数
        var input= {};
        var qu= oui.Queue.createNewQueue();
        oui.util.appendInputQueueTask(eventRootQueue,controller,qu,input,inputParams,targetInputParams);//输入参数构造队列任务
        qu.start(function (){
            var url = oui.addParams(executePath,input);
            var xhr = new XMLHttpRequest();
            if(typeof(xhr) !="undefined") {
                // 现在使用的方法 可在下载完成的时候关闭load弹窗
                oui.getTop().oui.progress('文件正在下载...');
                xhr.open('GET', url, true);    // 也可用POST方式
                xhr.responseType = "blob";
                debugger
                xhr.onload = function () {
                    if (this.status === 200) {
                        var headerName = xhr.getResponseHeader("Content-disposition");
                        var blob = this.response;
                        if (navigator.msSaveBlob == null) {
                            var a = document.createElement('a');

                            a.download = decodeURIComponent(headerName).substring(20);
                            a.href = URL.createObjectURL(blob);
                            $("body").append(a);    // 修复firefox中无法触发click
                            a.click();
                            URL.revokeObjectURL(a.href);
                            $(a).remove();
                        } else {
                            navigator.msSaveBlob(blob, decodeURIComponent(headerName).substring(20));
                        }
                        oui.getTop().oui.progress('下载完成!!!');
                        setTimeout(function (){
                            oui.getTop().oui.progress.hide();
                        },1000);
                    }

                };
                xhr.send();
            }
            else {
                window.location.href = url;
            }
        });


    }

    /**
     * 执行通用上传动作
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executeUpload= function (eventRootQueue,controller,config,callback,error){

        // 处理执行动作配置

        //输入参数映射用于构造  文件上传的输入
        //输出参数映射用于构造 文件上传后响应输出后的绑定
        //config.uploadURL
        //config.downloadUrl //下载excel导入模板

        //config.logicId
        //config.downloadLogicId
        // 逻辑id 后台自动转换 为对应的逻辑地址
        //config.executePath
        //config.downloadUrl
        /*
         * config 数据结构
         *  //excel导入 组件的前端参数
            maxFileSize:maxFileSize,
            isSingle:isSingle,
            fileTypes:fileTypes,
            fileSizeLimit:fileSizeLimit,
            fileNameMaxLength:fileNameMaxLength

            //excel导入逻辑输入输出相关参数
            inputParams:[],
            outputParams:[],
            targetInputParams:[],
            targetOutputParams:[],

            //下载导入模板的相关输入参数
            downloadConfig:{
               inputParams:[], //输入参数中配置 fileName:'',//导出的文件名,后缀名等
               targetInputParams:[]
            }
         */


        var inputParams = config.inputParams ||[]; //逻辑的输入定义
        var outputParams = config.outputParams ||[]; //逻辑的输出定义
        var executePath = config.executePath; //ajax执行的逻辑路径 （后端根据逻辑Id自动构造到当前config配置中）
        var logicId = config.logicId; //逻辑id

        var targetInputParams = config.targetInputParams ||[];//输入参数绑定
        var targetOutputParams = config.targetOutputParams ||[];//输出参数绑定

        var downloadConfig = config.downloadConfig||{};

        //构造输入参数
        var input= {};
        var downloadInput= {};
        var qu= oui.Queue.createNewQueue();
        oui.util.appendInputQueueTask(eventRootQueue,controller,qu,input,inputParams,targetInputParams);//输入参数构造队列任务

        if(config.downloadUrl){
            oui.util.appendInputQueueTask(eventRootQueue,controller,qu,downloadInput,downloadConfig.inputParams||[],downloadConfig.targetInputParams||[]);//下载模板的输入参数构造队列任务
        }

        var cfgFun = {
            uploadFile:oui.showImportFileDialog,
            impExcel:oui.showImportExcelDialog
        };
        if(!config.uploadType){
            config.uploadType = 'uploadFile';
        }

        qu.start(function (){
            var url = '';
            if(!config.executePath){
                if(config.uploadType=='uploadFile'){
                    error&&error('未配置文件上传逻辑');
                }else{
                    error&&error('未配置Excel导入逻辑');
                }
                return;
            }

            url = oui.addParams(config.executePath,input);
            var downloadUrl = config.downloadUrl;
            if(downloadUrl){
                downloadUrl = oui.addParams(downloadUrl,downloadInput);
            }

            //根据类型 执行上传方法
            cfgFun[config.uploadType]({
                uploadURL:url,
                postParams:input,
                downloadUrl:downloadUrl,

                maxFileSize:config.maxFileSize||'',
                isSingle:config.isSingle||'',
                fileTypes:config.fileTypes||'',
                fileSizeLimit:config.fileSizeLimit||'',
                fileNameMaxLength:config.fileNameMaxLength||1024,
                completeSuccess:function (resArr,dialog){
                    var hasOneError = oui.findOneFromTreeArrayBy(resArr,function (res){
                        if(!res.success){
                            return true;
                        }
                    });
                    if(!hasOneError){ //全部上传成功
                        var quEnd = oui.Queue.createNewQueue();
                        oui.util.appendOutputQueueTask(eventRootQueue,controller,quEnd,resArr,outputParams,targetOutputParams); //输出参数构造队列任务
                        quEnd.start(function (){
                            debugger;
                            callback&&callback();
                        });
                    }else {
                        error&&error(hasOneError.msg||'请求失败');
                    }

                }

            })

        });
    };
    /**
     * 交互动作中执行文件上传
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executeUploadFile = function (eventRootQueue,controller,config,callback,error){
        config.uploadType = 'uploadFile';
        oui.util.executeUpload(eventRootQueue,controller,config,callback,error);
    };
    /**
     * 交互动作中执行文件下载
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executeDownloadFile = function (eventRootQueue,controller,config,callback,error){
        config.downloadType ='downloadFile';
        oui.util.executeDownload(eventRootQueue,controller,config,callback,error);

    };
    /**
     * 页面转向
     * @param eventRootQueue
     * @param controller
     * @param config
     * @param callback
     * @param error
     */
    util.executePageTurn = function (eventRootQueue,controller,config,callback,error){
        // 处理执行动作配置


        //输入参数映射用于构造  逻辑调用 的输入
        //输出参数映射用于构造 逻辑响应输出后的绑定
        var inputParams = config.inputParams ||[]; //逻辑的输入定义
        var outputParams = config.outputParams ||[]; //逻辑的输出定义
        var executePath = config.executePath; //ajax执行的逻辑路径 （后端根据逻辑Id自动构造到当前config配置中）
        var logicId = config.logicId; //逻辑id

        var targetInputParams = config.targetInputParams ||[];//输入参数绑定
        var targetOutputParams = config.targetOutputParams ||[];//输出参数绑定

        //构造输入参数
        var input= {};
        var qu= oui.Queue.createNewQueue();
        oui.eachArray(inputParams,function(item,index){
            var targetInput = targetInputParams[index];
            var value = '';
            if(targetInput){
                //根据目标参数配置的数据来源 获取对应值;
                //取值
                value = oui.util.findValueByTargetInputParam(eventRootQueue,controller,targetInput);
                if(value !=null && value instanceof Promise){
                    qu.add({
                        name:item.name,
                        promise:value,
                        run:function (){
                            var me =this;
                            this.promise.then(function (res){
                                input[me.name] = res;
                                me.inited = true;
                            }).finally(function (){
                                me.inited = true;
                            });
                        }
                    });
                }
            }
            input[item.name] = value;
        });


        qu.start(function (){
            var url = '';
            if( config.executePath == ExecutePathTypeEnum.externalLink.value || (config.executePath == ExecutePathTypeEnum.innerLink.value))  //外部连接或者内部链接
            {
                if(config.linkAddress){
                    url = oui.addParams(config.linkAddress,input);
                }
            } else if( config.executePath ==  ExecutePathTypeEnum.viewPage.value)  { //跳转到页面模型
                var param = oui.getParam()
                var renderUrl = param.renderUrl;
                // itemId,只需要一个配置,也是row.id
                input.renderUrl = renderUrl; //默认url参数，无需配置
                input.pageType = config.pageType ;//需要配置
                input.viewType = config.viewType; //需要配置
                input.viewId = config.renderPage; //需要配置

                input.pageId = oui.storage.get('pageId');
                input.renderUrl = oui.storage.get('renderUrl');
                input.excutedSelectedLogicUrl = oui.storage.get('excutedSelectedLogicUrl');
                url =oui.getContextPath()+'list.html';
                url = oui.addParams(url, input);
            }
            if(url){
                if(config.pageLocation =='newTab'){//tab页
                    //TODO 新页签功能还没有实现，暂时用页面跳转
                    oui.go4replace(url);
                }else if(config.pageLocation =='newPage'){ //新页面
                    top.oui.openWindow({
                        url: url,
                        openType:'_blank'
                    });
                }else if(config.pageLocation =='currentPage'){ //当前页
                    oui.go4replace(url);
                }else{
                    //TODO 扩展其他打开方式
                }
            }
            callback&&callback();
        });
    };



    //根据输入参数 数据来源配置 获取对应的值
    util.findValueByTargetInputParam = function (eventRootQueue,controller,targetInputParam){
        var v = '';
        // 根据不同的参数来源 获取对应的值
        v = VarSourceTypeEnum.findInputValue(eventRootQueue,controller,targetInputParam);
        return v;
    };
    //根据输出参数配置，将值更新到对应输出参数上
    util.updateValueByOutputParam = function (eventRootQueue,controller,targetOutputParam,v){
        // 根据不同的参数来源， 设置值到对应的变量上
        return  VarSourceTypeEnum.updateOutputValue(eventRootQueue,controller,targetOutputParam,v);
    }
    //执行动作枚举
    var ExecuteActionTypeEnum = {

        BACK_END_LOGIC:{
            name:'backEndLogic',
            value:1,
            display:'执行后端逻辑',
            getBodyCode:function (item){//当前交互动作
                //执行后端逻辑
                var config = item.executeActionConfig ||{};
                var bodyCode =' var config = '+oui.parseString(config)+' ; var me = this; oui.util.executeLogic(me.queue,controller,config,function(){ me.inited= true; },function(msg){me.queue.queues.length=0;me.queue.hasError=true;me.queue.errorDetail='+oui.parseString(item)+' })'; //成功当前任务执行完毕，失败则需要清空队列任务

                return bodyCode;
            }
        },
        PAGE_TURN:{
            name:'pageTurn',
            value:2,
            display:'页面转向',
            /**
             * 构造页面跳转的代码
             * @param item
             * @returns {string}
             */
            getBodyCode:function (item){//当前交互动作
                var config = item.executeActionConfig||{};
                var bodyCode =' var config = '+oui.parseString(config)+' ; var me = this; oui.util.executePageTurn(me.queue,controller,config,function(){ me.inited= true; },function(msg){me.queue.queues.length=0;me.queue.hasError=true;me.queue.errorDetail='+oui.parseString(item)+' })'; //成功当前任务执行完毕，失败则需要清空队列任务
                return bodyCode;
            }
        },
        UPLOAD_FILE:{
            name:'uploadFile',
            value:3,
            display:'文件上传',
            /**
             * 构造上传的代码
             * @param item
             * @returns {string}
             */
            getBodyCode:function (item){//当前交互动作
                var config = item.executeActionConfig||{};
                var bodyCode =' var config = '+oui.parseString(config)+' ; var me = this; oui.util.executeUploadFile(me.queue,controller,config,function(){ me.inited= true; },function(msg){me.queue.queues.length=0;me.queue.hasError=true;me.queue.errorDetail='+oui.parseString(item)+' })'; //成功当前任务执行完毕，失败则需要清空队列任务
                return bodyCode;
            }
        },
        DOWNLOAD_FILE:{
            name:'downloadFile',
            value:4,
            display:'文件下载',
            /**
             * 构造excel导入的代码
             * @param item
             * @returns {string}
             */
            getBodyCode:function (item){//当前交互动作
                var config = item.executeActionConfig||{};
                var bodyCode =' var config = '+oui.parseString(config)+' ; var me = this; oui.util.executeDownloadFile(me.queue,controller,config,function(){ me.inited= true; },function(msg){me.queue.queues.length=0;me.queue.hasError=true;me.queue.errorDetail='+oui.parseString(item)+' })'; //成功当前任务执行完毕，失败则需要清空队列任务
                return bodyCode;
            }
        },
        IMP_EXCEL:{//excel导入
            name:'impExcel',
            value:5,
            display:'excel导入',
            /**
             * 构造excel导入的代码
             * @param item
             * @returns {string}
             */
            getBodyCode:function (item){//当前交互动作
                var config = item.executeActionConfig||{};
                var bodyCode =' var config = '+oui.parseString(config)+' ; var me = this; oui.util.executeImpExcel(me.queue,controller,config,function(){ me.inited= true; },function(msg){me.queue.queues.length=0;me.queue.hasError=true;me.queue.errorDetail='+oui.parseString(item)+' })'; //成功当前任务执行完毕，失败则需要清空队列任务
                return bodyCode;
            }
        },
        EXP_EXCEL:{//excel导出
            name:'expExcel',
            value:6,
            display:'excel导出',
            /**
             * 构造excel导出的代码
             * @param item
             * @returns {string}
             */
            getBodyCode:function (item){//当前交互动作
                var config = item.executeActionConfig||{};
                var bodyCode =' var config = '+oui.parseString(config)+' ; var me = this; oui.util.executeExpExcel(me.queue,controller,config,function(){ me.inited= true; },function(msg){me.queue.queues.length=0;me.queue.hasError=true;me.queue.errorDetail='+oui.parseString(item)+' })'; //成功当前任务执行完毕，失败则需要清空队列任务
                return bodyCode;
            }
        },
        SHOW_DIALOG:{
            name:'showDialog',
            value:7,
            display:'弹框'
        },
        SHOW_TIPS:{
            name:'showTips',
            value: 8,
            display:'tips'
        },
        UPDATE_COMPONENTS:{
            name:'updateComponents',
            value:9,
            display:'更新组件列表'
        },
        COMMON_API:{
            name:'commonAPI',
            value:10,
            display:'执行公共API'
        },
        COMPONENT_API:{
            name:'componentAPI',
            value:11,
            display:'执行组件API'
        }

    };

    /***
     * 获取 执行动作类型数组 {value,display}
     * @returns {*[]}
     */
    util.findExecuteActionTypeArray = function (){
        var arr = [];
        for(var k in ExecuteActionTypeEnum){
            arr.push({value:ExecuteActionTypeEnum[k].name,display:ExecuteActionTypeEnum[k].display});
        }
        return arr;
    };
    ExecuteActionTypeEnum.findEnumByValue = function (value){
        for (var k in ExecuteActionTypeEnum){
            if(ExecuteActionTypeEnum[k].value == value ||( k==value) || ( ExecuteActionTypeEnum[k].name==value)){
                return ExecuteActionTypeEnum[k];
            }
        }
        return null;
    };
    ExecuteActionTypeEnum.findEnumByName = function (name){
        if(ExecuteActionTypeEnum[name]){
            return ExecuteActionTypeEnum[name];
        }
        for (var k in ExecuteActionTypeEnum){
            if(ExecuteActionTypeEnum[k].name == name){
                return ExecuteActionTypeEnum[k];
            }
        }
        return null;
    };
    /*
      EXTERNAL_LINK("externalLink", "外部链接"),
        PAGE_MODEL("pageModel", "页面模型");
     */
    var ExecutePathTypeEnum = {
        externalLink:{
            name:'externalLink',
            value:'externalLink',
            display:'外部链接'
        },
        innerLink:{
            name:'innerLink',
            value:'innerLink',
            display:'内部链接'
        },
        viewPage:{
            name:'viewPage',
            value:'pageModel',
            display:'呈现页面'
        }
    }
    //执行完成后枚举
    var ExecuteFinishTypeEnum ={
        finish:{ //执行结束
            name:'executeFinish',
            value:'executeFinish',
            display:'执行结束'
        },
        callback:{//执行回调
            name:'executeCallback',
            value:'executeCallback',
            display:'执行回调'
        }

    };

    /**
     * 根据当前交互动作 获取对应的运行代码
     * @param item
     * @returns {string}
     */
    var buildRunListCode = function (item){
        var s=[];
        var bodyCode ='';
        /*
        trigMethod 用于绑定事件类型 -事件绑定
        executeAction：用于构造 动态执行脚本-执行动作
        executeActionConfig: 用于 执行动作的配置
        afterExecuteFinish：用于执行完成后前端逻辑控制-执行回调

         */
        var currEnum = ExecuteActionTypeEnum.findEnumByValue(item.executeAction);
        if(currEnum && currEnum.getBodyCode){ //根据 执行动作类型 获取对应的运行态执行代码
            bodyCode = currEnum.getBodyCode(item);
        }
        //根据执行动作处理 对应代码
        if(bodyCode){
            s.push('runList.push({queue:qu, run:function(){ '+bodyCode+' }});');
        }

        //如果存在回调交互动作，则递归追加代码
        if (item.callbackInteractive) {
            s.push(buildRunListCode(item.callbackInteractive));
        }
        return s.join(' ');
    }
    /**
     * 交互动作 处理 数据结构
     * {
     * 	//页面跳转场景
     * 	"trigMethod":"",
     *     "executeAction":"pageTurn",
     *     "executeActionConfig": { // 根据不同执行动作，配置不同
     * 		"pageLocation":"", //页面打开位置
     * 		"executePath":"", //页面执行路径
     * 		"renderPage":"",  //呈现页面
     * 	    } ,
     *     "afterExecuteFinish":"executeFinish",
     *     "id":"398278082710026935",
     *     "superId":"",
     *     "callbackInteractive":""
     * },
     *
     * {
     * 	//逻辑调用场景
     * 	"trigMethod":"",
     *     "executeAction":"backEndLogic",
     *     "executeActionConfig": { // 根据不同执行动作，配置不同
     *
     * 		    "logicId":"",
     * 		    "inputParams":[
     *
     *   		],
     * 	    	"outputParams":[
     *
     *   		]
     *
     *   	} ,
     *     "afterExecuteFinish":"executeFinish",
     *     "id":"398278082710026935",
     *     "superId":"",
     *     "callbackInteractive":""
     * }
     */

    /**
     * 为 页面 或者 控件 绑定交互动作中的事件
     * @param events
     */
    var bindInteractionEvents = function (controller,events){
        if (events&& events.interaction) {

            var interaction = events.interaction ||[];
            //遍历交互事件, 确保 每个只配置一个
            oui.eachArray(interaction, function (item) {
                var m= item.trigMethod.charAt(0).toUpperCase()+ item.trigMethod.substring(1);
                //构造调用方法
                var code = buildRunListCode(item);
                var config = item.executeActionConfig||{};
                var eventInputParams = config.eventInputParams||[];//交互动作事件的输入参数
                var one4sucess = oui.findOneFromArrayBy(eventInputParams,function (item){
                    if(item=='_success' || item.name=='_success'){
                        return true;
                    }
                });
                var one4error = oui.findOneFromArrayBy(eventInputParams,function (item){
                    if(item =='_error' || item.name =='_error'){
                        return true;
                    }
                });
                if(!one4sucess){
                    eventInputParams.push({
                        name:'_success',
                        type:'function'
                    });
                }
                if(!one4error){
                    eventInputParams.push({
                        name:'_error',
                        type:'function'
                    });
                }
                var inputParamsCode = buildParamsCode(eventInputParams);
                var tempParamsCode = buildParamsCode(config.eventTempParams||[]); //交互动作事件的临时变量
                var outputParamsCode = buildParamsCode(config.eventOutputParams||[]);//交互动作事件的输出变量

                var startCode = 'var controller = this; var _event_params={args:arguments,inputParams:'+inputParamsCode+',tempParams:'+tempParamsCode+',outputParams:'+outputParamsCode+'};';
                var bodyCode  = 'var qu  =  oui.Queue.createNewQueue(); qu._event_params=_event_params; var runList=[];'+code+' ; qu.addAll(runList); qu.start(function(){ if(qu.hasError){ _error&&_error(controller); console.log(\''+m+':error\',qu.errorDetail);  }else { _success&&_success(controller); console.log(\'complete  '+m+'  \'); } qu._event_params=null; });';

                var funParams = findInputParams4function(eventInputParams);
                controller ['on'+m] = oui.parseJson2Function({
                    params:funParams,
                    startCode:startCode,
                    bodyCode:bodyCode, //内容区代码
                    endCode:'',
                    returnType:''
                });
            });


        }
    };
    /**
     * 根据输入参数对象数组 获取js函数的输入参数
     * @param params
     * @returns {*[]}
     */
    var findInputParams4function = function (params){
        var str = [];
        oui.eachArray(params,function (item){
            if(typeof item =='string'){
                str.push(item );
            }else if(item.name){
                str.push(item.name);
            }
        });
        return str;
    }
    /**
     * 根据参数对象数组转为 事件调用的开始行代码
     * [{name:'user',type:'string_type'},{name:'pass',type:'string_type'}]
     * 转为 {user:user,pass:pass}这样的字符串结构
     * @param params
     * @returns {string}
     */
    var buildParamsCode = function (params){
        var str = [];
        oui.eachArray(params,function (item){
            if(typeof item =='string'){
                str.push(item+':'+item);
            }else{
                str.push(item.name+':'+item.name);
            }
        });
        return '{'+str.join(',')+'}'
    }


    /*** 获取控件值dom上的样式*****/
    var findFieldStyle4Dom = function(item){
        var s = item.innerStyle&&item.innerStyle.styleFieldString;
        return s||"";
    };

    /****
     * 获取控件访问url
     * @param controlId
     */
    var findControlUrl = function(controlId){
        var me = this;
        var control = me.getControl(controlId);
        return util.findControlUrl(control);
    };
    /**
     * 根据业务id获取控件
     * @param bizId
     * @returns {{}}
     */
    var getControlByBizId = function(bizId){
        var controls= this.designer.controls||[];
        var one = oui.findOneFromArrayBy(controls,function(item){
            if(item.bizId == bizId){
                return true;
            }
        });
        return one ||{};
    };
    /***
     * 根据控件id 获取控件渲染数据
     * @param controlId
     * @returns {{}}
     */
    var getControlRenderDataById = function(controlId,rowIndex){
        var me = this;
        if(!me.controlCache){
            me.controlCache = {};
        }
        var data = {};
        //获取控件的渲染数据
        var control = me.getControl(controlId);
        if(control){

            //从缓存获取控件渲染对象
            if(typeof rowIndex !='undefined'){
                if(me.controlCache[controlId+'_'+rowIndex]){
                    data = me.controlCache[controlId+'_'+rowIndex];
                    if(control.detailId && (typeof rowIndex !='undefined')){
                        var detailData = this.getDataList(control.detailId);
                        data.value= this.getValue(control,detailData[rowIndex]||{}); //组件值
                    }
                    return me.controlCache[controlId+'_'+rowIndex];
                }
            }else{
                if(me.controlCache[controlId]){
                    data = me.controlCache[controlId];
                    data.value= this.getValue(control,this.mainData||{}); //组件值
                    return me.controlCache[controlId];
                }
            }


            data.showType = control.showType;//控件显示类型
            data.controlId = control.id; //控件id
            data.bizId = control.bizId; //控件业务id
            data.dataId   = me.dataId; //数据id
            data.designerId = me.designerId; //设计器定义id
            data.control = control; //控件定义
            data.rowIndex = rowIndex; //处理表格行数据

            data.id='field-'+control.id; //组件id
            data.name='field-'+control.id;//组件name
            data.bindProp = control.bizId; //双向绑定的业务属性

            data.title=control.name; //组件title
            if(control.detailId && (typeof rowIndex !='undefined')){
                data.detailId  = control.detailId;
                var detailData = this.getDataList(control.detailId);
                data.value= this.getValue(control,detailData[rowIndex]||{}); //组件值
            }else{
                data.value= this.getValue(control,this.mainData||{}); //组件值
            }
            data.style= me.findFieldStyle4Dom(control); //组件style样式
            data.cls = 'control-field-value-abs oui-comp-'+control.controlType;//组件css样式
            data.otherAttrs = control.otherAttrs;
            if(data.hasAssociation){ //存在关联关系
                data.controlUrl = 'res_common/oui/ui/ui_pc/components/association.vue.html';
            }

            //绑定事件脚本
            data.bindEvents = function(){
                var control = this.control; //根据当前控件的业务属性配置 获取对应的脚本
                var events = control.events||{}; //前端事件脚本配置
                bindInteractionEvents(this,events); //绑定控件的事件
                for (var k in events) {
                    if(k =='interaction'){
                        continue;
                    }
                    if(events[k]){//有配置才绑定事件配置
                        var m= k.charAt(0).toUpperCase()+ k.substring(1);
                        this['on'+m] = oui.parseJson2Function(events[k]);
                    }
                }
            };
            if(control.formField||control.isFormField){ //表单类控件才需要处理
                //更新表单字段处理
                data.onUpdate = function(key,v,ov,options){
                    this.value = v;
                    this.updatePageData(key,options);
                    //值改变事件
                    if(this.detailId && (typeof this.rowIndex !='undefined')){
                        this.onValueChange&&this.onValueChange(key,v,options,this.rowIndex,this.detailId);
                    }else{
                        this.onValueChange&&this.onValueChange(key,v,options);
                    }
                };
                data.updatePageData = function(key,options){
                    if(this.detailId && (typeof this.rowIndex !='undefined')){
                        this.getPageData().updatePageData(key,options,this.rowIndex,this.detailId);//更新明细表
                    }else{
                        this.getPageData().updatePageData(key,options);//更新主表
                    }
                }
            }else{
                //非表单类控件的更新事件
                //值改变事件
                data.onUpdate = function(key,v,ov,options){
                    this.onValueChange&&this.onValueChange(key,v,options);
                }
            }
            data.getPageData = function(){
                return me;
            };
            var placeholder = control.placeholder||(control.otherAttrs&&control.otherAttrs.placeholder)||"";
            if(placeholder){
                data.placeholder= placeholder;
            }
            if(control.controlType=='button'){
                initDefaultEvents4Button(control.events.interaction);
            }
            if(control.controlType=='tableList'){
                initDefaultEvents4tableList(control.events.interaction);
            }
            data.bindEvents();
        }
        if(typeof rowIndex !='undefined'){
            me.controlCache[controlId+'_'+rowIndex] =data;
        }else{
            me.controlCache[controlId]=data;
        }
        return data;
    };
    //TODO 为按钮初始化默认按钮事件,处理 保存和新增情况的交互配置参数,当设计态配置好了后，需要把这部分代码删除掉

    var initDefaultEvents4Button = function (interaction){
        if(interaction&&interaction.length){
            interaction.forEach(item => {
                debugger;
                /*
                 * 目前这些代码都是暂时写死的，后续设计态配置完善后，需要删除掉
                 */
                if(item.trigMethod == "click" &&(item.executeAction=='backEndLogic') && item.executeAction&&item.executeActionConfig&&item.executeActionConfig.logicId ) { //对应页面加载事件的配置，自动形成的事件交互
                    item.executeActionConfig.inputParams = [{
                        name:'id'
                    },{
                        name:'formData'
                    }];
                    item.executeActionConfig.loadingMsg ='保存中...'
                    item.executeActionConfig.outputParams=[
                        {
                            name:'dataObject'
                        },{
                            name:'success'
                        }];
                    item.executeActionConfig.targetInputParams=[{
                        varSourceType:'url', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"itemId", // url参数名
                        config:{// 解析变量的特殊配置
                        }
                    },{
                        varSourceType:'formValue', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"$formValue", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    }];
                    item.executeActionConfig.targetOutputParams=[{
                        varSourceType:'formValue', //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"$formValue", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    }];

                }

            });

        }
    }

    //对列表事件的默认配置预制
    var initDefaultEvents4tableList = function (interaction){
        if(interaction&&interaction.length){
            interaction.forEach(item => {
                /*
                 * 目前这些代码都是暂时写死的，后续设计态配置完善后，需要删除掉
                 */
                if(item.trigMethod == "loadData" && item.executeAction&&item.executeActionConfig&&item.executeActionConfig.logicId ) { //对应页面加载事件的配置，自动形成的事件交互
                    item.executeActionConfig.loadingMsg ='加载中...'
                    item.executeActionConfig.inputParams = [{
                        name:'pageIndex'
                    },{
                        name:'pageSize'
                    } ,{
                        name:'queryParam'
                    } ];
                    item.executeActionConfig.outputParams=[
                        {
                            name:'dataList'
                        },{
                            name:'success'
                        },{
                            name:'total'
                        }];
                    item.executeActionConfig.targetInputParams=[{
                        varSourceType:VarSourceTypeEnum.controlData.value, //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"pageIndex", // url参数名
                        config:{// 解析变量的特殊配置
                        }
                    },{
                        varSourceType:VarSourceTypeEnum.controlData.value, //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"pageSize", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    },{
                        varSourceType:VarSourceTypeEnum.controlData.value, //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"queryParam", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    }];
                    item.executeActionConfig.targetOutputParams=[{
                        varSourceType:VarSourceTypeEnum.controlData.value, //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"dataList", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    },{
                        varSourceType:VarSourceTypeEnum.rootQueueTempParams.value, //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"success", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    },{
                        varSourceType:VarSourceTypeEnum.controlData.value, //变量值数据来源 1.url参数 2.自定义页面变量 3.控件值 4.控件的相关数据 5.表单数据  6.当前window全局变量 7.顶层window全局变量 8.本地存储cookie 9.本地存储 sessionStorage 10.本地存储localStorage 11.本地存储 indexedDB
                        "name":"total", // 更新表单数据
                        config:{// 解析变量的特殊配置
                        }
                    }];

                }

                //删除行 事件 默认配置预制
                if(item.trigMethod == "removeOne" && item.executeAction&&item.executeActionConfig&&item.executeActionConfig.logicId){
                    item.executeActionConfig.loadingMsg ='删除中...';

                    item.executeActionConfig.inputParams = [{
                        name:'id'
                    }];
                    item.executeActionConfig.outputParams=[];
                    item.executeActionConfig.targetInputParams=[{
                        varSourceType:VarSourceTypeEnum.rootQueueInputParams.value,
                        "name":"row.id", // url参数名
                        config:{// 解析变量的特殊配置
                        }
                    }];
                    item.executeActionConfig.targetOutputParams=[];
                }
                //编辑行 事件默认配置
                if(item.trigMethod == "go2edit" && item.executeAction&&item.executeActionConfig ){
                    item.executeActionConfig.inputParams = [{
                        name:'itemId'
                    }];
                    item.executeActionConfig.outputParams=[];
                    item.executeActionConfig.targetInputParams=[{
                        varSourceType:VarSourceTypeEnum.rootQueueInputParams.value,
                        "name":"row.id", // url参数名
                        config:{// 解析变量的特殊配置
                        }
                    }];
                    item.executeActionConfig.targetOutputParams=[];
                }
                //详情行 事件默认配置
                if(item.trigMethod == "go2detail" && item.executeAction&&item.executeActionConfig ){
                    item.executeActionConfig.inputParams = [{
                        name:'itemId'
                    }];
                    item.executeActionConfig.outputParams=[];
                    item.executeActionConfig.targetInputParams=[{
                        varSourceType:VarSourceTypeEnum.rootQueueInputParams.value,
                        "name":"row.id", // url参数名
                        config:{// 解析变量的特殊配置
                        }
                    }];
                    item.executeActionConfig.targetOutputParams=[];
                }
                //添加事件 默认配置
                /*
                   var param = oui.getParam();
                var renderUrl = param.renderUrl;
                var pageId = param.pageId;
                var url =oui.getContextPath()+'list.html';
                url = oui.addParams(url,{
                    renderUrl: renderUrl,
                    pageType:'form',
                    viewType:oui.PageTypeEnum.form.value,
                    pageId:pageId
                });
                 */
                if(item.trigMethod == "go2add" && item.executeAction&&item.executeActionConfig ){
                    item.executeActionConfig.inputParams = [{
                        name:'pageId'
                    }];
                    item.executeActionConfig.outputParams=[];
                    item.executeActionConfig.targetInputParams=[{
                        varSourceType:VarSourceTypeEnum.url.value,
                        "name":"pageId", // url参数名
                        config:{// 解析变量的特殊配置
                        }
                    }];
                    item.executeActionConfig.targetOutputParams=[];
                }

            });

        }
    }

    var render = function(){
        if(!this._render){
            if(this.designer&&this.designer.content){
                this._render = template.compile(this.designer.content);
            }else{
                return '';
            }
        }
        this.content =this._render({pageData:this});
        return this.content;
    };
    //初始化前执行
    //beforeInit,init,afterInit

    var beforeInit = function(callback,error){
        if(this.onBeforeInit){

            this.onBeforeInit(callback,error);
        }else{
            callback&&callback();
        }
    };
    //初始化后执行
    var afterInit = function(){
        this.onAfterInit&&this.onAfterInit();
    };
    /*** 根据id获取控件定义对象****/
    var getControl = function (id) {
        var controls= this.designer.controls||[];
        var one = oui.findOneFromArrayBy(controls,function(item){
            if(item.id == id){
                return true;
            }
        });
        return one ||{};
    };
    /** 获取主表数据*****/
    var getData = function () {
        return this.mainData||{};
    };
    /** 获取数据表格中数据******/
    var getDataList = function (detailId) {
        var detailData = this.detailData||{};
        return detailData[detailId]||[];
    };
    /** 给指定明细表 在指定行索引前添加默认行数据 **/
    var addDataRow = function(detailId,row,idx){
        if(!this.detailData){
            this.detailData = {};
        }
        if(!this.detailData[detailId]){
            this.detailData[detailId] =[];
        }
        var dataList = this.getDataList(detailId);
        if(typeof idx !='undefined'){
            //指定位置添加行
            dataList.splice(idx,0,row||{});
        }else{
            //默认添加到最后一行
            dataList.push(row||{});
        }
        return true;
    };
    /*****
     * 更新表单数据
     * @param key
     * @param v
     * @param oldv
     */
    var updatePageData = function(key,options,idx,detailId){
        if(!key){
            return ;
        }
        if(typeof idx =='undefined'){
            // 更新主表
            if(!this.mainData){
                this.mainData = {};
            }
            this.mainData[key] =options;

        }else{
            //更新明细表
            if(!this.detailData){
                this.detailData = {};
            }
            if(!this.detailData[detailId]){
                this.detailData[detailId] = [];
            }
            if(!this.detailData[detailId][idx]){
                this.detailData[detailId][idx]= {};
            }
            this.detailData[detailId][idx][key] = options;
        }
    };

    /**** 根据控件定义 和控件数据 获取 html内容,对特殊值的处理 由页面自行处理扩展机制 *****/
    var getValue = function (control,dataMap) {
        //return oui.PageDesignControlRuntimeAdapter.render(control,dataMap[control.id]);
        if((typeof dataMap[control.bizId]=='undefined') || dataMap[control.bizId]==null){
            return "";
        }
        if((typeof dataMap[control.bizId].value=='undefined') || dataMap[control.bizId].value==null){
            return "";
        }
        return dataMap[control.bizId].value+"";
    };

    /** 获取控件显示值*/
    var getDisplay = function(control,dataMap){
        if((typeof dataMap[control.bizId]=='undefined') || dataMap[control.bizId]==null){
            return "";
        }
        if((typeof dataMap[control.bizId].display=='undefined') || dataMap[control.bizId].display==null){
            return "";
        }
        return dataMap[control.bizId].display+"";
    };

    /** 运行态获取 设计对象*****/
    var getDesigner = function(){
        return this.designer||{};
    };

    /**创建 页面数据对象 用于渲染一个页面 oui.util.createPageData({}); ***/
    util.createPageData = function(cfg){
        return new PageData(cfg);
    };
    /** 获取当前页面所在的端类型**/
    util.getClientType = function(clientType){
        if(clientType){
            return clientType;
        }
        //TODO 继续优化 获取当前组件所在的端类型
        var clientType = oui.getParam('clientType');
        return clientType || 'pc';
    };
    /****
     * 根据控件 和表单数据 获取某个控件的显示值
     * @param control
     * @param formData
     * @returns {*|string}
     */
    util.findDisplayByControlAndFormData = function(control,formData){
        var temp = formData;
        var item = control;
        var key = item.bizId||item.id;
        var display=temp[key]||'';
        var value = temp[key]||'';
        var valueArr = value.split(',');

        if(item&&item.otherAttrs&&item.otherAttrs.data&&item.otherAttrs.data.length){
            if(valueArr.length==1){ //只有一个值
                //枚举项处理
                var enumItem = oui.findOneFromArrayBy(item.otherAttrs.data,function(enumTemp){
                    if(enumTemp.value ==value){
                        return true;
                    }
                });
                if(enumItem){
                    display = enumItem.display;
                }
            }else if(valueArr.length>1){//超过两个值
                var displayArr =[];
                var enumItems = oui.findManyFromArrayBy(item.otherAttrs.data,function(enumTemp){
                    if(valueArr.indexOf(enumTemp.value+'')>-1){
                        displayArr.push(enumTemp.display);
                        return true;
                    }
                });
                if(enumItems&&enumItems.length){
                    display = displayArr.join('，');
                }
            }
        }
        return display;
    };
    /***
     * 单选，下拉，多选才执行的
     * 渲染oui-talbe单元格
     * @param text
     * @param item
     * @param index
     * @param columnField
     * @param tableOuiId
     */
    util.onRenderCell4ouiTable = function(text, item, index, columnField, tableOuiId){
        var otherAttrs = columnField.otherAttrs; //业务扩展
        if(text){//存在值
            if((!columnField.bizId) && columnField.fieldName){
                columnField.bizId = columnField.fieldName;
            }
            return oui.util.findDisplayByControlAndFormData(columnField,item);
        }
        return text;
    };
    util.findControlUrl = function(control){
        if(control && control.hasAssociation){ //存在关联关系
            //TODO 后续考虑 多端 的关联控件适配
            return 'res_common/oui/ui/ui_pc/components/association.vue.html';
        }else if(control){
            return 'res_common/oui/ui/ui_pc/components/'+control.controlType+'.vue.html';
        }
        return '';
    };
    util.findDefaultDataTypeEnum = function(dataType){
        var defaultDataType = 'STRING';
        var typeEnum = oui.dataTypeEnum[dataType];
        if(!typeEnum){
            typeEnum = oui.dataTypeEnum[defaultDataType];
        }
        return typeEnum;
    };

    /*****
     * 根据字段类型获取默认 字段类型枚举
     * @param fieldType
     * @returns {*}
     */
    util.findDefaultFieldTypeEnum = function(fieldType){
        var typeEnum = oui.fieldTypeEnum[fieldType];
        if(!typeEnum){
            typeEnum = oui.fieldTypeEnum.string_type;
        }
        return typeEnum;
    };
    /**
     * 值类型枚举
     */
    util.ValueTypeEnum = {
        value:{
            name:'value',
            value:'value',
            display:'输入值'
        },var:{
            name:'var',
            value:'var',
            display:'变量' //输入，输出，变量定义
        }
        //TODO 暂时注释掉 表达式 和 逻辑调用的场景
        // ,expr:{
        //     name:'expr',
        //     value:'expr',
        //     display:'表达式' //自定义表达式脚本
        // },callLogic:{
        //     name:'callLogic',
        //     value:'callLogic',
        //     display:'逻辑调用'
        // }
        ,contextVar4Null:{
            name:'contextVar4Null',
            value:'contextVar4Null',
            expr:'Null',
            display:'Null',
            innerVar:true
        },contextVar4NotNUll:{
            name:'contextVar4NotNUll',
            expr:'NotNull',
            value:'contextVar4NotNUll',
            display:'NotNull',
            innerVar:true
        },contextVar4NullOrEmpty:{
            name:'contextVar4NullOrEmpty',
            value:'contextVar4NullOrEmpty',
            expr:'NullOrEmpty',
            display:'NullOrEmpty',
            innerVar:true

        },contextVar4NotNullAndEmpty:{
            name:'contextVar4NotNullAndEmpty',
            value:'contextVar4NotNullAndEmpty',
            display:'NotNullAndEmpty',
            expr:'NotNullAndEmpty',
            innerVar:true
        }
    };
    /**
     * 获取值类型枚举
     */
    util.findValueTypeEnums = function (keys){
        var arr=[];
        if(!keys){
            for(var k in util.ValueTypeEnum){
                arr.push(util.ValueTypeEnum[k]);
            }
        }else{
            if(typeof keys =='string'){
                keys = keys.split(',');
            }
            for(var k in util.ValueTypeEnum){
                if(keys.indexOf(k)>-1 ||
                    (keys.indexOf(util.ValueTypeEnum[k].name)>-1) ||
                    (keys.indexOf(util.ValueTypeEnum[k].value+'')>-1)||
                    keys.indexOf(util.ValueTypeEnum[k].display)>-1 ){

                    arr.push(util.ValueTypeEnum[k]);
                }
            }
        }
        return arr;
    };
    /**
     * 表达式类型枚举
     */
    util.ExpressionTypeEnum ={
        eq:{
            name:'eq',
            expr:'=',
            value:1,
            display:'等于'
        },
        ne:{
            name:'ne',
            expr:'!=',
            value:2,
            display:'不等于'
        },
        like:{
            name:'like',
            expr:'like',
            value:3,
            display:'包含'
        },
        gt:{
            name:'gt',
            expr:'>',
            value:4,
            display:'大于'
        },
        gte:{
            name:'gte',
            expr:'>=',
            value:5,
            display:'大于等于'
        },
        lt:{
            name:'lt',
            expr:'<',
            value:6,
            display:'小于'
        },
        lte:{
            name:'lte',
            expr:'<=',
            value:7,
            display:'小于等于'
        },
        in:{
            name:'in',
            expr:'in',
            value:8,
            display:'特定范围(In)'
        },
        all:{
            name:'all',
            expr:'all',
            value:9,
            display:'全部包含'
        },
        notIn:{
            name:'notIn',
            expr:'notIn',
            value:10,
            display:'不在特定范围(NotIn)'
        },
        startWith:{
            name:'startWith',
            expr:'startWith',
            value:11,
            display:'开头等于'
        },
        notStartWith:{
            name:'notStartWith',
            expr:'notStartWith',
            value:12,
            display:'开头不等于'
        },
        endWith:{
            name:'endWith',
            expr:'endWith',
            value:13,
            display:'结尾等于'
        },
        notEndWith:{
            name:'notEndWith',
            expr:'notEndWith',
            value:14,
            display:'结尾不等于'
        },
        between:{
            name:'between',
            expr:'between',
            value:15,
            display:'在指定区间'
        },
        notBetween:{
            name:'notBetween',
            expr:'notBetween',
            value:16,
            display:'不在指定区间'
        },
        Null:{
            name:'Null',
            expr:'Null',
            value:17,
            display:'Null',
            innerVar:true
        },
        NotNull:{
            name:'NotNull',
            expr:'NotNull',
            value:18,
            display:'NotNull',
            innerVar:true
        },
        NullOrEmpty:{
            name:'NullOrEmpty',
            expr:'NullOrEmpty',
            value:19,
            display:'NullOrEmpty',
            innerVar:true
        },
        NotNullAndEmpty:{
            name:'NotNullAndEmpty',
            expr:'NotNullAndEmpty',
            value:20,
            display:'NotNullAndEmpty',
            innerVar:true
        },
        or:{
            name:'or',
            expr:'or',
            value:21,
            display:'OR'

        },
        and:{
            name:'and',
            expr:'and',
            value:22,
            display:'AND'
        }
    };

    util.AssignmentTypeEnum = {         //赋值运算符 =,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=
        eq:{
            name:'eq',
            expr:'=',
            value:1,
            display:'='
        },
        //针对数字类的 add, subtract, multiply and divide;
        addEq:{
            name:'addEq',
            expr:'+=',
            value:2,
            display:'+='
        },
        subtractEq:{
            name:'subtractEq',
            expr:'-=',
            value:3,
            display:'-='
        },
        multiplyEq:{
            name:'multiplyEq',
            expr:'*=',
            value:4,
            display:'*='
        },
        divideEq:{
            name:'divideEq',
            expr:'/=',
            value:5,
            display:'/='
        },
        remainderEq:{
            name:'remainderEq',
            expr:'%=',
            value:6,
            display:'%='
        },
        //针对int ,对short,byte,long,等需要转换后处理
        leftMoveEq:{
            name:'leftMoveEq',
            expr:'<<=',
            value:7,
            display:'<<='
        },
        rightMoveEq:{
            name:'rightMoveEq',
            expr:'>>=',
            value:8,
            display:'>>='
        },
        noFlagMoveEq:{
            name:'noFlagMoveEq',
            expr:'>>>=',
            value:9,
            display:'>>>='
        },
        andEq:{
            name:'andEq',
            expr:'&=',
            value:10,
            display:'&='
        },
        orEq:{
            name:'orEq',
            expr:'|=',
            value:11,
            display:'|='
        }
    };
    /**
     * 获取表达式列表
     * @param keys
     * @returns {*[]}
     */
    util.findExpressions = function (keys){
        var arr=[];
        if(!keys){
            for(var k in util.ExpressionTypeEnum){
                arr.push({
                    value:util.ExpressionTypeEnum[k].expr,
                    display:util.ExpressionTypeEnum[k].display,
                    innerVar:util.ExpressionTypeEnum[k].innerVar
                });
            }
        }else{
            if(typeof keys =='string'){
                keys = keys.split(',');
            }
            for(var k in util.ExpressionTypeEnum){
                if(keys.indexOf(k)>-1 ||(keys.indexOf(util.ExpressionTypeEnum[k].expr)>-1)){
                    arr.push({
                        value:util.ExpressionTypeEnum[k].expr,
                        display:util.ExpressionTypeEnum[k].display,
                        innerVar:util.ExpressionTypeEnum[k].innerVar
                    });
                }
            }
        }
        return arr;

    };
    util.findAssignments = function (keys){
        var arr=[];
        if(!keys){
            for(var k in util.AssignmentTypeEnum){
                arr.push({
                    value:util.AssignmentTypeEnum[k].expr,
                    display:util.AssignmentTypeEnum[k].display,
                    innerVar:util.AssignmentTypeEnum[k].innerVar
                });
            }
        }else{
            if(typeof keys =='string'){
                keys = keys.split(',');
            }
            for(var k in util.AssignmentTypeEnum){
                if(keys.indexOf(k)>-1 ||(keys.indexOf(util.AssignmentTypeEnum[k].expr)>-1)){
                    arr.push({
                        value:util.AssignmentTypeEnum[k].expr,
                        display:util.AssignmentTypeEnum[k].display,
                        innerVar:util.AssignmentTypeEnum[k].innerVar
                    });
                }
            }
        }
        return arr;

    };
    //流程变量转条件字段,TODO 后续要调整数据结构 成树型结构
    /*
     * <oui-field v-for="(field,index) in fields" :title="field.title" :showtype="field.showType" :datatype="field.dataType" :opt="field.opt" :controltype="field.controlType"
     :name="field.name"  ></oui-field>
     */
    util.transProcessVars2ConditionFields = function(vars){
        console.log(vars);
        /*
         dataType: {display: "String", data4DB: {…}, value: "String"}
         description: {display: "", value: ""}
         displayName: {display: "ID【页面新的应用(默认预制)】", data4DB: {…}, value: "ID【页面新的应用(默认预制)】"}
         initialValue: {display: "", value: ""}
         isArray: {display: "否", value: false}
         name: {display: "page_432848991814680576_id", data4DB: {…}, value: "page_432848991814680576_id"}
         sourceType
         */
        var fields = [];
        oui.eachArray(vars ||[],function(item){
            var fieldType = item.dataType?item.dataType.value:'string';
            fieldType = fieldType.toLowerCase()+'_type';
            var fieldTypeEnum = oui.util.findDefaultFieldTypeEnum(fieldType);
            var defaultDataTypeEnum = oui.util.findDefaultDataTypeEnum(fieldTypeEnum.dataType);
            var field = {
                title:item.displayName.value,
                fieldType:fieldType,
                dataType:fieldTypeEnum.dataType,
                opt:defaultDataTypeEnum.opt||'=',
                controlType:defaultDataTypeEnum.controlType||'textfield',
                showType:defaultDataTypeEnum.showType||0,
                name:item.name.value
            };
            fields.push(field);
        });
        return fields;
    };
    /***
     * 将 逻辑变量转为 字段列表树
     * @param tree
     */
    util.transLogicVars2ConditionFields = function (tree,fieldSourceType){
        var rootIds = [];
        var map4tree ={};
        var ids=[];
        var idMap={};
        oui.eachTreeArray(tree,function (item){
            //处理根节点
            if((!item.parentId) ||(item.id==item.parentId) ){
               if(rootIds.indexOf(item.id)<0){
                   rootIds.push(item.id);
               }
            }
            if(ids.indexOf(item.id)<0){
                ids.push(item.id);
            }
            if(!idMap[item.id]){
                idMap[item.id] = [];
            }
            if(item.parentId){
                var brothers = idMap[item.parentId];
                if(!brothers){
                    brothers=[];
                    idMap[item.parentId]=brothers;
                }
                if(brothers.indexOf(item.id)<0){
                    brothers.push(item.id);
                }
            }

            var fieldTypeEnum = oui.util.findDefaultFieldTypeEnum(item.fieldType);
            var defaultDataTypeEnum = oui.util.findDefaultDataTypeEnum(fieldTypeEnum.dataType);
            var controlType= item.otherAttrs.controlType || defaultDataTypeEnum.controlType||'textfield';
            /*
              tempBean.getOtherAttrs().put("controlType",bean.getControlType());
                        tempBean.getOtherAttrs().put("showType",bean.getShowType());
                        tempBean.getOtherAttrs().put("htmlType",bean.getHtmlType());
                        tempBean.getOtherAttrs().put("formField",bean.getFormField());
             */
            var showType = item.otherAttrs.showType;
            if(typeof showType =='undefined' || showType===''){
                showType = defaultDataTypeEnum.showType||0;
            }
            var dotNum = item.otherAttrs.dotNum;
            if(typeof dotNum=='undefined'){
                dotNum = defaultDataTypeEnum.dotNum||0;

            }

            var opt= item.otherAttrs.opt||'';
            opt = opt.split(',');
            var deftOpt= defaultDataTypeEnum.opt||'=';
            deftOpt = deftOpt.split(',');
            opt= oui.mergeArray(opt,deftOpt,'$value').join(',');
            var assign = item.otherAttrs.assign||'';
            var deftAssign = defaultDataTypeEnum.assign||'=';
            assign = assign.split(',');
            deftAssign = deftAssign.split(',');
            assign = oui.mergeArray(assign,deftAssign,'$value').join(',');
            var field = {
                id:item.id,
                array:item.array,
                idPath:item.idPath,
                parentId:item.parentId,
                namePath:item.namePath,
                displayPath:item.displayPath||item.namePath,
                childIds:idMap[item.id],
                fieldSourceType:fieldSourceType, //字段类型, 输入,变量定义，输出
                display:item.display||item.name,//字段中文显示名称，与name对应
                name:item.name,
                desc:item.desc ,//描述
                fieldType:item.fieldType,
                dataType:fieldTypeEnum.dataType,
                opt:opt,
                assign:assign,
                controlType:controlType, //如果是表单控件，TODO 逻辑接口那带过来
                showType:showType,
                dotNum:dotNum,
                tableModelId:item.tableModelId,
                tableModelName:item.tableModelName,
                otherAttrs:item.otherAttrs
            };
            map4tree[item.id] = field;
        });
        var arr = [];
        oui.eachArray(rootIds,function (rootId){
            var item = oui.clone(map4tree[rootId]);
            arr.push(item);
            util.eachMapTree4Children(map4tree,rootId,item);
        });
        return arr;
    }
    //处理map结构 树对象列表
    util.eachMapTree4Children = function (map4tree,id,item,includeChildIdsKey,sort){
        item.children = [];
        if(item && item.childIds){
            oui.eachArray(item.childIds,function (cid){
                var citem = oui.clone(map4tree[cid]);
                item.children.push(citem);
                util.eachMapTree4Children(map4tree,cid,citem,includeChildIdsKey,sort);
            });
            if(!includeChildIdsKey){
                item.childIds=''; //删除 子节点Id列表
                delete item.childIds;
            }
            if(sort){
                item.children.sort(sort);
                if(includeChildIdsKey){
                    var childIds = [];
                    oui.eachArray(item.children,function (item){
                        childIds.push(item.id);
                    });
                    item.childIds = childIds;
                }
            }
        }
    };
    util.buildPageLimitTpl = function(tpl,designer){
        var tableMap =oui.parseJson(oui.parseString( tpl.tableMap ||{}));
        var controls = (designer.controls) ||[];
        var defaultLimit = {
            edit:{
                edit:true,
                read:false,
                hidden:false,
                canNotRead:false,
                required:false,
                defaultValue:''
            },
            read:{
                edit:false,
                read:true,
                hidden:false,
                canNotRead:false,
                required:false,
                defaultValue:''
            },
            hidden:{
                edit:false,
                read:false,
                hidden:true,
                canNotRead:false,
                required:false,
                defaultValue:''
            },
            canNotRead:{
                edit:false,
                read:false,
                hidden:false,
                canNotRead:true,
                required:false,
                defaultValue:''
            }
        };
        var tplId = tpl.id ||tpl.value;
        var currDefault = defaultLimit[tplId] ||defaultLimit.edit;
        if(!tableMap[designer.id]){
            tableMap[designer.id] = {
                id:designer.id,
                name:designer.name
            };
        }
        var ids = [];
        var detailControlIds = [];
        oui.eachArray(controls,function(item){
            ids.push(item.id);
            if(item.controlType =='detail'){ //明细表控件
                detailControlIds.push(item.id);
                if(!tableMap[item.id]){
                    tableMap[item.id] = {
                        id:item.id,
                        name:item.name
                    };
                }else{
                    tableMap[item.id].id = item.id;
                    tableMap[item.id].name = item.name;
                }
            }else{

                var id = item.id;
                var name = item.name;
                var bizId = item.bizId;
                var controlType = item.controlType;
                var detailId = item.detailId;
                if(detailId){//明细表中的控件
                    var parentId = item.parentId;
                    if(!tableMap[parentId]){
                        tableMap[parentId] ={
                            id:parentId,
                            name:''
                        };
                    }
                    if(item.formField){
                        if(!tableMap[parentId].fieldMap){
                            tableMap[parentId].fieldMap = {};
                        }
                        if(!tableMap[parentId].fieldMap[id]){
                            tableMap[parentId].fieldMap[id] = {
                                controlId:id,
                                name:name,
                                controlType:controlType,
                                bizId:bizId,
                                otherAttrs:oui.parseJson(oui.parseString(item.otherAttrs)),
                                limitMap:oui.parseJson(oui.parseString(currDefault)) //默认处理
                            };

                        }else{
                            tableMap[parentId].fieldMap[id].controlId = id;
                            tableMap[parentId].fieldMap[id].name = name;
                            tableMap[parentId].fieldMap[id].controlType = controlType;
                            tableMap[parentId].fieldMap[id].bizId = bizId;
                            tableMap[parentId].fieldMap[id].otherAttrs = oui.parseJson(oui.parseString(item.otherAttrs));
                        }

                    }
                }else{
                    if(item.formField){
                        //主表中的控件
                        if(!tableMap[designer.id].fieldMap){
                            tableMap[designer.id].fieldMap = {};
                        }
                        if(!tableMap[designer.id].fieldMap[id]){
                            tableMap[designer.id].fieldMap[id] = {
                                controlId:id,
                                name:name,
                                controlType:controlType,
                                bizId:bizId,
                                otherAttrs:oui.parseJson(oui.parseString(item.otherAttrs)),
                                limitMap:oui.parseJson(oui.parseString(currDefault))
                            };
                        }else{
                            tableMap[designer.id].fieldMap[id].controlId = id;
                            tableMap[designer.id].fieldMap[id].name = name;
                            tableMap[designer.id].fieldMap[id].controlType = controlType;
                            tableMap[designer.id].fieldMap[id].bizId = bizId;
                            tableMap[designer.id].fieldMap[id].otherAttrs = oui.parseJson(oui.parseString(item.otherAttrs));
                        }
                    }
                }
            }
        });
        var tables = [];
        var tableMap4update = {};
        var tabIds =[designer.id].concat(detailControlIds);
        //将tableMap还原为多页签
        for(var k in tableMap){
            if(tabIds.indexOf(k)<0){
                //清除要删除的明细表
                continue;
            }

            var curr = tableMap [k];
            var temp = {};
            temp.id = curr.id;
            temp.name = curr.name;
            var fieldMap = curr.fieldMap ||{};
            var idxs = [];
            for(var id in fieldMap){
                if(ids.indexOf(id)<0){
                    //清除要删除的字段
                    continue;
                }
                idxs.push(ids.indexOf(id));
            }
            idxs = idxs.sort(function(v1,v2){
                return v1<v2;
            });
            tableMap4update[k] ={
                id:curr.id,
                name:curr.name,
                fieldMap:{}
            };
            var data = [];
            var count=0;
            oui.eachArray(idxs,function(idx){
                var cid = ids[idx];
                fieldMap[cid].tabId = curr.id;
                fieldMap[cid].rowId = count++;
                data.push(fieldMap[cid]);
                tableMap4update[k].fieldMap[cid] = oui.parseJson(oui.parseString(fieldMap[cid]));
            });
            temp.data = data;
            tables.push(temp);
        }
        //遍历tables 构造 tableMap
        tpl.tableMap  = tableMap4update;//初始化构造
        tpl.tables = tables;
        return tpl;
    };
    //处理登陆验证字符串 传递到跨越url上
    util.createLoginTokenStr = function(){
        var tokenId = oui.cookie('tokenId');
        var userId =  oui.cookie('userId');
        return tokenId+"__"+userId
    };

    /*
      form(0,"表单页"),
    list(1,"列表页"),
    edit(2,"编辑页"),
    detail(3,"详情页"),
    report(4,"报表页"),
    prototype(5,"原型页"),//静态图（可能客户只需要简单的静态页面）
    print(6,"打印页");
     */
    var PageTypeEnum = {
        form:{name:'form',value:0,display:'表单',createPageViewUrlKey:'createPageViewFormUrl'},
        list:{name:'list',value:1,display:'列表',createPageViewUrlKey:'createPageViewListUrl'},
        edit:{name:'edit',value:2,display:'编辑',createPageViewUrlKey:'createPageViewEditUrl'},
        detail:{name:'detail',value:3,display:'详情',createPageViewUrlKey:'createPageViewDetailUrl'},
        report:{name:'report',value:4,display:'报表',createPageViewUrlKey:'createPageViewReportUrl'},
        prototype:{name:'prototype',value:5,display:'原型',createPageViewUrlKey:'createPageViewPrototypeUrl'},
        print:{name:'print',value:6,display:'打印',createPageViewUrlKey:'createPageViewPrintUrl'},
        findEnumValues:function (){
            var  arr = [];
            for(var k in PageTypeEnum){
                if( PageTypeEnum[k] &&PageTypeEnum[k].name && PageTypeEnum[k].display){
                    arr.push(PageTypeEnum[k].value);
                }
            }
            return arr;
        },
        findEnumNames:function (){
            var  arr = [];
            for(var k in PageTypeEnum){
                if( PageTypeEnum[k] &&PageTypeEnum[k].name && PageTypeEnum[k].display){
                    arr.push(PageTypeEnum[k].name);
                }
            }
            return arr;
        },
        findPageTypeEnumByValue:function (v){
            for(var k in PageTypeEnum){
                if((PageTypeEnum[k].value+'') == (v+'')){
                    return PageTypeEnum[k];
                }
            }
            return null;
        },

        findPageTypeNameByValue:function (v){
            var o = this.findPageTypeEnumByValue(v);
            if(o){
                return o.name;
            }
            return null;
        }
    }
    /***
     * 逻辑类型
     * @type {{}}
     */
    var LogicTypeEnum = {
        /*
        insert(1,"新增","simple"),
    update(2,"更新","simple"),
    query(3,"查询","simple"),
    remove(4,"删除","simple"),
    load(5,"加载","simple"),
    union(6,"关联查询","advance"),
    logic(7,"逻辑编排","advance")
         */
        insert:{
            name:'insert',
            value:1,
            display:'新增'
        },
        update:{
            name:'update',
            value:2,
            display:'更新'
        },
        query:{
            name:'query',
            value:3,
            display:'查询'
        },
        remove:{
            name:'remove',
            value:4,
            display:'删除'
        },
        load:{
            name:'load',
            value:5,
            display:'加载'
        },
        union:{
            name:'union',
            value:6,
            display:'关联查询'
        },
        arrange:{
            name:'arrange',
            value:7,
            display:'逻辑编排'
        },
        findEnums:function (){
            var  arr = [];
            for(var k in LogicTypeEnum){
                if( LogicTypeEnum[k] &&LogicTypeEnum[k].name && LogicTypeEnum[k].value){
                    arr.push(LogicTypeEnum[k]);
                }
            }
            return arr;
        },
        findEnumValues:function (){
            var  arr = [];
            for(var k in LogicTypeEnum){
                if( LogicTypeEnum[k] &&LogicTypeEnum[k].name && LogicTypeEnum[k].value){
                    arr.push(LogicTypeEnum[k].value);
                }
            }
            return arr;
        },
        findEnumNames:function (){
            var  arr = [];
            for(var k in LogicTypeEnum){
                if( LogicTypeEnum[k] &&LogicTypeEnum[k].name && LogicTypeEnum[k].value){
                    arr.push(LogicTypeEnum[k].name);
                }
            }
            return arr;
        },
        findEnumByValue:function (v){
            var  arr = [];
            for(var k in LogicTypeEnum){
                if( LogicTypeEnum[k] &&LogicTypeEnum[k].name && (v == LogicTypeEnum[k].value)){
                    return LogicTypeEnum[k];
                }
            }
            return null;
        }

    };

    var oui =win.oui ||{};
    win.oui = oui;

    oui.session = function (key,v){
        if(arguments.length==1){
            return window.sessionStorage.getItem(key);
        }else if(arguments.length==2){
            window.sessionStorage.setItem(key,v);
        }
    }
    oui.PageTypeEnum = PageTypeEnum;
    oui.LogicTypeEnum = LogicTypeEnum;


    oui.clearScriptTag = function(urls){
        if((!urls)||(!urls.length)){
            return ;
        }
        var tempUrls = [];
        oui.eachArray(urls,function (url,index){
            var temp =url;
            if(url.indexOf('.js')>-1){
                temp = url.substring(0,url.lastIndexOf('.js')+3);
            }else if(url.indexOf('.css')>-1){
                temp = url.substring(0,url.lastIndexOf('.css')+4);
            }
            tempUrls.push(temp);
        });
        var scripts = $('script[src],script[data-url]');
        for(var i = 0,len=scripts.length; i < len; i++){//是否已加载
            var src =scripts[i].getAttribute('data-url') || scripts[i].src;
            if(src.indexOf('.js')>-1){
                src = src.substring(0,src.lastIndexOf('.js')+3);
            }else if(src.indexOf('.css')>-1){
                src = src.substring(0,src.lastIndexOf('.css')+4);
            }
            if(tempUrls.indexOf(src)>-1){
                //删除dom元素
                scripts[i].outerHTML='';
            }
        }
    };

    /***
     * 从树结构数据中找到一条数据
     * @param treeArr
     * @param fun
     * @returns {null}
     */
    oui.findOneFromTreeArrayBy = function(treeArr,fun){
        var me = this;
        var curr = null;
        oui.findOneFromArrayBy(treeArr,function (item) {
            var flag = fun(item);
            if(flag){
                curr = item;
                return true;
            }
            var one = me.findOneFromTreeArrayBy(item.children||[],fun);
            if(one){
                curr = one ;
                return true;
            }
        });
        return curr;
    };
    /***
     * 遍历一堆树
     * @param arr
     * @param fun
     * @returns {boolean}
     */
    oui.eachTreeArray = function(arr,fun){
        var me = this;
        var outerFlag = true;
        oui.eachArray(arr,function (item,index){

            var flag = fun(item,index);
            if(typeof flag =='boolean'){
                if(!flag){
                    outerFlag = false;
                    return false;
                }
            }
            outerFlag = me.eachTreeArray(item.children||[],fun);
            if(typeof outerFlag =='boolean'){
                if(!outerFlag){
                    return false;
                }
            }
        });
        return outerFlag;
    };

    /**
     * 自定义函数，根据自定义规则删除树中多个元素
     * @param trees
     * @param fun
     */
    oui.removeFromTreeArrayBy = function (trees,fun){
        oui.removeFromArrayBy(trees,function (item) {
            if(fun(item)){
                return true;
            }
            oui.removeFromTreeArrayBy(item.children||[],fun);
        })
    }

    /** 根据自定义条件查询数组中的元素 多个 **/
    oui.findManyFromTreeArrayBy = function (arr,fun){
        var newArr = [];
        oui.findManyFromArrayBy(arr,function (item,index){
            var flag = fun(item,index);
            if(flag){
                newArr.push(item);
            }
            var children = oui.findManyFromTreeArrayBy(item.children ||[],fun);
            newArr = newArr.concat(children);
        });
        return newArr;
    };
    /***
     * 合并两个数组,放在后面的覆盖前面的
     * @param arr1
     * @param arr2
     * @param keyOrFun
     * @param sort
     * @returns {*[]}
     */
    oui.mergeArray = function (arr1,arr2,keyOrFun,sort,mapFun,mergeFun){
        arr1=arr1||[];
        arr2=arr2||[];
        var tempArr = arr1.concat(arr2);
        var arr = [];
        if(keyOrFun){
            var map={};
            oui.eachArray(tempArr,function (item) {
                var key;

                if(typeof keyOrFun=='function'){
                    key = keyOrFun(item);
                }else if(typeof keyOrFun=='string'){
                    if(keyOrFun=='$value'){ //为值覆盖，处理简单数据类型 的唯一
                        key=item;
                    }else {//处理对象类型的唯一
                        key = item[keyOrFun];
                    }
                }
                if(!key){ //必须要确保key存在才进行合并，不存在 则无合并规则,或者该合并数据是脏数据
                    return;
                }
                if(typeof map[key]=='undefined'){
                    map[key] = item;
                    arr.push(item);
                    mapFun&&mapFun(item);
                }else{
                    var lastMaped = oui.clone(map[key]);
                    //merge
                    if(typeof map[key]=='object'){
                        var temp = oui.clone(item);
                        var curr=map[key];
                        for(var k in temp){
                            curr[k] = temp[k];
                        }
                    }else{
                        map[key] = item;
                    }
                    mergeFun&&mergeFun(map[key],lastMaped,item);
                }
            });
        }
        if(sort){
            arr.sort(sort);
        }
        return arr;
    };
    /**
     * 合并树算法
     * @param tree1
     * @param tree2
     * @param idKey
     * @param parentIdKey
     * @param sort
     * @param mapFun
     * @param mergeFun
     * @returns {*[]}
     */
    oui.mergeTree = function (tree1,tree2,idKey,parentIdKey,sort,mapFun,mergeFun){
        tree1=tree1||[];
        tree2=tree2||[];
        var tree = tree1.concat(tree2);
        if ((!tree) || tree.length === 0) {
            return [];
        }
        var rootIds = [];
        var map4tree ={};
        var ids=[];
        var idMap={};
        parentIdKey =parentIdKey || 'parentId';
        idKey=idKey || 'id';

        oui.eachTreeArray(tree,function (item){
            //处理根节点
            if((!item[parentIdKey]) ||(item[idKey]==item[parentIdKey]) ){
                if(rootIds.indexOf(item[idKey])<0){
                    rootIds.push(item[idKey]);
                }
            }
            if(ids.indexOf(item[idKey])<0){
                ids.push(item[idKey]);
            }
            if(!idMap[item[idKey]]){
                idMap[item[idKey]] = [];
            }
            if(item[parentIdKey]){
                var brothers = idMap[item[parentIdKey]];
                if(!brothers){
                    brothers=[];
                    idMap[item[parentIdKey]]=brothers;
                }
                if(brothers.indexOf(item[idKey])<0){
                    brothers.push(item[idKey]);
                }
            }
            var temp = {};
            for(var k in item){
                if(k=='children'){
                    continue;
                }
                temp[k] = oui.clone(item[k]);
            }
            if(typeof map4tree[item[idKey]] =='undefined'){
                map4tree[item[idKey]] = temp;
                mapFun&&mapFun(temp);
            }else{
                var lastMaped = oui.clone(map4tree[item[idKey]]);
                //merge
                if(typeof map4tree[item[idKey]]=='object'){
                    var curr=map4tree[item[idKey]];
                    for(var k in temp){ //合并后面的节点属性到当前节点上
                        curr[k] = temp[k];
                    }
                }else{
                    map4tree[item[idKey]] = temp;
                }
                mergeFun&&mergeFun(map4tree[item[idKey]],lastMaped,item);
            }
        });
        var arr = [];
        oui.eachArray(rootIds,function (rootId){
            var item = oui.clone(map4tree[rootId]);
            arr.push(item);
            util.eachMapTree4Children(map4tree,rootId,item,sort);
        });
        if(sort){
            arr.sort(sort);
        }
        return arr;
    }
    /**
     * 保留树结构的 树节点过滤
     * @param treeData
     * @param fun
     * @returns {*[]}
     */
    oui.filterTree = function (treeData,fun,fun4filtered){
        if ((!treeData) || treeData.length === 0) {
            return [];
        }
        const array = [];
        oui.eachArray(treeData,function (item) {
            let flag = fun(item);
            var tempArr = oui.filterTree(item.children||[],fun);

            if((tempArr.length>0 )|| flag){
                var temp = {};
                for(var k in item){
                    if(k=='children'){
                        continue;
                    }
                    temp[k] = oui.clone(item[k]);
                }
                temp.children = tempArr;
                fun4filtered&&fun4filtered(temp);
                array.push(temp);
            }
        });
        return array;
    };
    oui.findParents = function(tree,node,fun){
        var arr = [];
        if(!node ||(!node.parentId) ){
            return arr;
        }
        var one = oui.findOneFromTreeArrayBy(tree,function (item){
            if(item.id == node.parentId){
                fun&&fun(item);
                return true;
            }
        });
        if(one){
            arr.push(one);
            return arr.concat(this.findParents(tree,one,fun));
        }
        return  arr;
    }



    win.oui.util = util;
})(window);


(function () {
    var attachEvent = document.attachEvent,
        stylesCreated = false;

    if (!attachEvent) {
        var requestFrame = (function(){
            var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
                function(fn){ return window.setTimeout(fn, 20); };
            return function(fn){ return raf(fn); };
        })();

        var cancelFrame = (function(){
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
                window.clearTimeout;
            return function(id){ return cancel(id); };
        })();

        function resetTriggers(element){
            var triggers = element.__resizeTriggers__,
                expand = triggers.firstElementChild,
                contract = triggers.lastElementChild,
                expandChild = expand.firstElementChild;
            contract.scrollLeft = contract.scrollWidth;
            contract.scrollTop = contract.scrollHeight;
            expandChild.style.width = expand.offsetWidth + 1 + 'px';
            expandChild.style.height = expand.offsetHeight + 1 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
        };

        function checkTriggers(element){
            return element.offsetWidth != element.__resizeLast__.width ||
                element.offsetHeight != element.__resizeLast__.height;
        }

        function scrollListener(e){
            var element = this;
            resetTriggers(this);
            if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
            this.__resizeRAF__ = requestFrame(function(){
                if (checkTriggers(element)) {
                    element.__resizeLast__.width = element.offsetWidth;
                    element.__resizeLast__.height = element.offsetHeight;
                    element.__resizeListeners__.forEach(function(fn){
                        fn.call(element, e);
                    });
                }
            });
        };

        /* Detect CSS Animations support to detect element display/re-attach */
        var animation = false,
            animationstring = 'animation',
            keyframeprefix = '',
            animationstartevent = 'animationstart',
            domPrefixes = 'Webkit Moz O ms'.split(' '),
            startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
            pfx  = '';
        {
            var elm = document.createElement('fakeelement');
            if( elm.style.animationName !== undefined ) { animation = true; }

            if( animation === false ) {
                for( var i = 0; i < domPrefixes.length; i++ ) {
                    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                        pfx = domPrefixes[ i ];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animationstartevent = startEvents[ i ];
                        animation = true;
                        break;
                    }
                }
            }
        }

        var animationName = 'resizeanim';
        var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
        var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
    }

    function createStyles() {
        if (!stylesCreated) {
            //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
            var css = (animationKeyframes ? animationKeyframes : '') +
                    '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
                    '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
            stylesCreated = true;
        }
    }


    window.addResizeListener = function(element, fn){
        if (attachEvent) element.attachEvent('onresize', fn);
        else {
            if (!element.__resizeTriggers__) {
                if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                createStyles();
                element.__resizeLast__ = {};
                element.__resizeListeners__ = [];
                (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
                element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
                    '<div class="contract-trigger"></div>';
                element.appendChild(element.__resizeTriggers__);
                resetTriggers(element);
                element.addEventListener('scroll', scrollListener, true);

                /* Listen for a css animation to detect element display/re-attach */
                animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
                    if(e.animationName == animationName)
                        resetTriggers(element);
                });
            }
            element.__resizeListeners__.push(fn);
        }
    };

    window.removeResizeListener = function(element, fn){
        if (attachEvent) element.detachEvent('onresize', fn);
        else {
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.removeEventListener('scroll', scrollListener);
                element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
            }
        }
    }
})();