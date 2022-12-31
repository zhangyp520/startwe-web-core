(function (win, $) {
    var oui = win.oui || (win.oui = {});
    oui.$ = oui.$ || (oui.$ = {});//我们的框架命名空间
    var ctrl = oui.$.ctrl = oui.$.ctrl || {};//我们的框架-控件库命名空间
    var constant = oui.$.constant = {

        controlTagName: "oui-form",//我们表单控件标签名
        viewTagName:"oui-view", //页面模板框架
        reportTagName:"oui-report",//报表组件
        includeTagName: "oui-include",//我们的页面中的include标签
        tableTagName: "oui-table",//我们页面中的table标签
        pagerTagName: 'oui-pager', //分页标签
        portalTagName: 'oui-portal-column',//门户栏目标签
        conditionTagName: 'oui-condition',//查询条件标签
        calendarTagName:'oui-calendar',//日历标签
        imgTagName:'oui-img',//图片展示标签
        imgGroupTagName:'oui-imagegroup',//图片
        cutImgTagName:'oui-cutimg',//截图组件
        mapTagName:'oui-map',//地图组件标签
        controlClassNamePrefix: "oui-class-",//class前缀
        controlIdPrefix: "control_",//控件Id值前缀,由外部配置传入id值
        ouiIdName: "ouiId"//我们表单控件内部ID名
    };
    oui.parsingId=0;
    oui.parsingMap = {};
    /** 创建新的解析map,用于保证解析的回调调用***/
    oui.newParsingMap = function(){
        oui.parsingId++;
        oui.parsingMap[oui.parsingId] ={
            id:oui.parsingId,
            size:0,
            count:0
        };
        return oui.parsingMap[oui.parsingId];
    };
    /** 清空 解析map***/
    oui.clearParsingMap = function(map){
        oui.parsingMap[map.id] = null;
        delete oui.parsingMap[map.id];
        map = null;
    };
    /** 默认解析控件函数 ***/
    var defaultParse = function(container,callback){
        var tag = this.tag;
        var me = this;
        var paringMap = oui.newParsingMap();
        paringMap.tag = tag;
        container = container ||'body';
        var $tag =  $(tag,$(container));
        if($tag && $tag.length){
            paringMap.count = $tag.length;
            paringMap.size = $tag.length;
            $tag.each(function () {

                me.parseByDom(this,function(){
                    paringMap.count--;
                    if(paringMap.count<=0){
                        callback&&callback(paringMap);
                        oui.clearParsingMap(paringMap);// 清空解析map
                    }
                }); // 根据dom进行解析控件对象
            });

        }else{
            if(paringMap&&(paringMap.count <=0)){
                callback&&callback(paringMap);
                oui.clearParsingMap(paringMap);// 清空解析map
            }
        }
    };
    /** 子枚举 默认解析函数,子枚举默认需要根据标签和 控件类型进行检索解析***/
    var defaultParse4childrenEnum = function(container,callback){
        var tag = this.tag;
        var me = this;
        var paringMap = oui.newParsingMap();
        paringMap.tag = tag;
        paringMap.controlClass = me.controlClass;
        container =container ||'body';
        var $tag = $(tag+'[type='+me.controlClass+']',$(container));
        if($tag&&$tag.length){
            paringMap.count = $tag.length;
            paringMap.size = $tag.length;
            $(tag+'[type='+me.controlClass+']',$(container)).each(function () {
                me.parseByDom(this,function(){
                    paringMap.count--;
                    if(paringMap.count<=0){
                        callback&&callback(paringMap);
                        oui.clearParsingMap(paringMap);// 清空解析map
                    }
                }); // 根据dom进行解析控件对象
            });
        }else{
            if(paringMap&&(paringMap.count <=0)){
                callback&&callback(paringMap);
                oui.clearParsingMap(paringMap);// 清空解析map
            }
        }


    };
    /** 默认根据dom解析控件***/
    var defaultParseByDom = function(el,callback){
        var controlClass = this.controlClass;
        controlClass&&Parser.parseByDom(el,controlClass,callback); // 根据dom进行解析控件对象
    };
    /** 控件组件 依赖的css位置 ****/
    var CssTypeEnum={
        default:0, //默认可不指定，pc和移动适配
        noCss:1,//无样式，则该组件不需要显示引入css路径，或者由js组件内动态控制
        common:2//引入公共样式
    };
    /** 表单类控件枚举 TODO 列举表单类控件***/
    var FormControlEnum = {/** 枚举所有表单类控件**/
        /** pc 和移动公共的表单类控件**/
        address:{
            tag:constant.controlTagName,
            controlClass:'address',
            isCommon:true,
            cssType:CssTypeEnum.noCss
        },
        outercontrol:{
            tag:constant.controlTagName,
            controlClass:'outercontrol',
            isCommon:true,
            cssType:CssTypeEnum.noCss
        },
        signature:{
            tag:constant.controlTagName,
            controlClass:'signature',
            isCommon:true,
            cssType:CssTypeEnum.noCss
        },
        city:{
            tag:constant.controlTagName,
            controlClass:'city',
            cssType:CssTypeEnum.noCss
        },
        /**pc 和 移动 都有的控件 */
        /** TODO 当前把 图片组放入表单控件枚举 的子枚举中 ，等表单代码改造时去掉****/
        imgGroup:{ /** 图片组组件**/
            tag:constant.controlTagName,
            controlClass:'imagegroup'
        },
        selectperson:{
            tag:constant.controlTagName,
            controlClass:'selectperson'
        },
        cellphone:{
            tag:constant.controlTagName,
            controlClass:'cellphone'
        },
        checkbox:{
            tag:constant.controlTagName,
            controlClass:'checkbox'
        },
        datepicker:{
            tag:constant.controlTagName,
            controlClass:'datepicker',
            fileName:'date-picker' //如果存在 文件名与类名不一致的情况配置，便于解析
        },
        hidden:{
            tag:constant.controlTagName,
            controlClass:'hidden'
        },
        imagemulti:{
            tag:constant.controlTagName,
            controlClass:'imagemulti'
        },
        imagesingle:{
            tag:constant.controlTagName,
            controlClass:'imagesingle'
        },
        lbs:{
            tag:constant.controlTagName,
            controlClass:'lbs'
        },
        multiselect:{
            tag:constant.controlTagName,
            controlClass:'multiselect',
            fileName:'multi-select'
        },
        number:{
            tag:constant.controlTagName,
            controlClass:'number'
        },
        numberonline:{
            tag:constant.controlTagName,
            controlClass:'numberonline',
            fileName:'number-online'
        },
        password:{
            tag:constant.controlTagName,
            controlClass:'password'
        },
        radio:{
            tag:constant.controlTagName,
            controlClass:'radio'
        },
        score:{
            tag:constant.controlTagName,
            controlClass:'score'
        },
        serialnumber:{
            tag:constant.controlTagName,
            controlClass:'serialnumber'
        },
        singleselect:{
            tag:constant.controlTagName,
            controlClass:'singleselect',
            fileName:'single-select'
        },
        textarea:{
            tag:constant.controlTagName,
            controlClass:'textarea'
        },
        textfield:{
            tag:constant.controlTagName,
            controlClass:'textfield'
        },
        timepicker:{
            tag:constant.controlTagName,
            controlClass:'timepicker',
            fileName:'time-picker'
        },
        uploadfile:{
            tag:constant.controlTagName,
            controlClass:'uploadfile',
            fileName:'upload-file'
        },

        /** 只有pc有的控件 ****/
        htmleditor:{
            tag:constant.controlTagName,
            controlClass:'htmleditor',
            fileName:'html-editor'
        },
        richtext:{
            tag:constant.controlTagName,
            controlClass:'richtext'
        }

    };

    /** 自定义标签与控件类的配置枚举
     *  其中表单类控件，没有全部列举
     * ****/
    var TagEnum = {
        include:{ /** oui-include 引入html资源*****/
            tag:constant.includeTagName,
            noResource:true, //没有资源
            controlClass:null,/** 内容include没有控件类，单独处理解析标签函数****/
            /** oui-include单独处理****/
            parseByDom:function(el,callback){
                Parser.parseInclude(el);
                callback&&callback();
            }
        },
        portal:{ /** portal栏目******/
            tag:constant.portalTagName,
            controlClass:null,/** portal 没有控件类，单独处理解析标签函数***/
            parse:defaultParse,
            noResource:true,
            parseByDom:function(el,callback){
                if (oui.parsePortal && oui.parsePortal.parseColumnByDom) {//检查页面是否存在栏目解析机制
                    oui.parsePortal.parseColumnByDom(el);
                }
                callback&&callback();
            }
        },
        ouiview:{/** oui-veiw 自定义渲染区域****/
            tag:constant.viewTagName,
            controlClass:'ouiview',
            fileName:'oui-view',
            isCommon:true,//公共组件
            cssType:CssTypeEnum.noCss//没有样式
        },
        calendar:{
            tag:constant.calendarTagName,
            controlClass:'calendar',
            fileName:'calendar',
            isCommon:true,//公共组件
            cssType:CssTypeEnum.common
        },
        tablegrid:{ /** oui-table 表格控件****/
            tag:constant.tableTagName,
            controlClass:'tablegrid',
            fileName:'oui-table',
            isCommon:true,//pc 移动公共
            cssType:CssTypeEnum.common//公共样式
        },
        pager:{/** 分页组件****/
            tag:constant.pagerTagName,
            controlClass:'pager',
            isCommon:true,
            cssType:CssTypeEnum.default//分页样式，pc移动 分别适配
        },
        condition:{ /** 条件组件****/
            tag:constant.conditionTagName,
            controlClass:'condition',
            isCommon:true,//是否是pc、移动公共组件
            cssType:CssTypeEnum.default // pc和移动分别适配样式
        },
        form:{ /** 表单类控件，统一为oui-form标签,不指定特定控件类****/
            tag:constant.controlTagName,
            controlClass:null,//表单类控件 单独实现解析
            childrenEnum:FormControlEnum,
            parseByDom:function(el,callback){
                Parser.parseByDom(el,$(el).attr('type'),callback);
            }//默认解析
        },
        imgGroup:{ /** 图片组组件**/
            tag:constant.imgGroupTagName,
            controlClass:'imagegroup'
        },
        img:{ /** orus-img 图片显示***/
            tag:constant.imgTagName,
            controlClass:'img',
            isCommon:true,
            fileName:'oui-img',
            cssType:CssTypeEnum.noCss,//无样式
            parseByDom:function(el,callback){/** 图片查看，单独处理解析函数，无需id也可以渲染，当无id指定时生成id*****/
                var id = $(el).attr('id');
                if(!id){
                    $(el).attr('id',oui.getUUIDLong());
                }
                Parser.parseByDom(el, this.controlClass,callback); // 根据dom进行解析控件对象
            }
        },
        cutimg:{/** 图片截取**/
            tag:constant.cutImgTagName,
            controlClass:'cutimg',
            fileName:'cut-img'
        },
        map:{ /** 地图组件***/
            tag:constant.mapTagName,
            controlClass:'map',
            isCommon:true, //公共组件
            cssType:CssTypeEnum.common //公共样式
        },
        report:{
            tag:constant.reportTagName,
            controlClass:'report',
            isCommon:true,//公共组件
            cssType:CssTypeEnum.common//公共样式
        }
    };
    /**
     * 实现开发期debug阶段日志输出函数
     */
    var log = function (msg) {
        if (oui_context.debug) {//开发期debug配置 true则执行
            oui.alert(msg);//原生alert函数执行
            console.log(msg);//日志输出
        }
    };
    /**
     * 我们的前端框架解析器
     */
    var Parser = oui.$.Parser || {
        newId: 0,// 存放控件Id,自增
        getNewId: function () {// 自增创建控件Id
            this.newId++;
            return this.newId;
        },
        ids: [],// 控件Id列表
        controlData: {},// {控件Id:控件对象,...}
        formData: {},//控件值(前后台交付的JSON， KEY：控件ID， VALUE：控件值)
        hasChildrenControlIdMap: {},
        hasChildrenControlNameMap: {},
            /**
         * 设置控件值方法
         */
        setFormData: function (d) {
            this.formData = d;
        },
        /**根据当前控件id找所有的子控件列表 ***/
        getChildrenControlsById: function (controlId) {
            var ids = this.ids;
            var _self = this;
            var curr;
            var arr = [];
            for (var i = 0, len = ids.length; i < len; i++) {
                curr = _self.getByOuiId(ids[i]);
                if (curr == null) {
                    continue;
                }
                if (curr.attr('parentControlId') == controlId) {
                    arr.push(curr);
                }
            }
            return arr;
        },
        getChildrenControlsByName: function (name) {
            if(!name){
                return [];
            }
            var ids = this.ids;
            var _self = this;
            var curr;
            var arr = [];
            for (var i = 0, len = ids.length; i < len; i++) {
                curr = _self.getByOuiId(ids[i]);
                if (curr == null) {
                    continue;
                }
                if (curr.attr('parentControlName') == name) {
                    arr.push(curr);
                }
            }
            return arr;
        },
        /**
         * 清空表单值
         */
        clearFormData: function (id) {
            if (id) {
                var obj = oui.getById(id);
                if (obj) {
                    obj.attr('value', '');
                    obj.render();
                }
                return;
            }
            var data = oui.$.Parser.controlData;
            for (var i in data) {
                if (data[i].attr('type') == 'dialog') {
                    continue;
                }
                data[i].attr('value', '');
                data[i].render();
            }
        },
        /**
         * 获取所有控件的 display
         * @param selector 指定选择器进行选择控件
         * @param rights 权限限制 控件的right属性,可以传入数组，可以传入字符串，用逗号隔开
         */
        getFormData: function (selector,rights) {
            var filterOuiIds = null;
            if (selector) {
                filterOuiIds = this.getOuiIdsBySelector(selector);
            }
            var ids = filterOuiIds ? filterOuiIds : this.ids, cd = this.controlData;
            var curr = null;
            var cfg = {};
            var data4DB = null;
            var rightsArr= [];
            if(rights){
                if(typeof rights =='string'){
                    rightsArr = rights.split(',');
                }else{
                    rightsArr = rights;
                }
            }
            for (var i = 0, len = ids.length; i < len; i++) {
                curr = cd[ids[i]];
                if (!curr) {
                    continue;
                }
                if (!curr.attr('allowInput')) {//对于不允许输入的控件,不用提交数据
                    continue;
                }
                if (!curr.attr("name")) {
                    continue;
                }
                /***如果传入了权限过滤提交 ，则需要判断当前控件的权限与传入权限是否匹配 ****/
                if(rightsArr&&rightsArr.length){
                    var right = curr.attr('right');
                    if(rightsArr.indexOf(right) < 0){//权限不匹配则退出
                        continue;
                    }
                }
                data4DB = curr.getData4DB();
                oui.JsonPathUtil.setObjByPath(curr.attr('name'), cfg, data4DB);
            }
            return cfg;
        },
        /**
         * 根据容器id 控件属于区域进行数据获取
         * @param containerId
         * @param needValueObject
         * @returns {{}}
         */
        getFormValueByContainerId: function (containerId,rights) {
            return this.getFormValue('#' + containerId,rights);
        },
        /**
         * 根据选择器 获取 控件的ouiId列表，包括元素本身
         * @param selector
         */
        getOuiIdsBySelector: function (selector) {
            var filterOuiIds = [];
            if (!selector) {
                return filterOuiIds
            }
            var ouiId = '';
            var container='body';
            try{
                container=oui.getCurrPageContainer();
            }catch (e){
                container='body';
            }
            $(selector,container).each(function () {
                ouiId = $(this).attr('ouiId');
                if (ouiId) {
                    filterOuiIds.push($(this).attr('ouiId'));
                }
                $(this).find('div[ouiid]').each(function () {
                    filterOuiIds.push($(this).attr('ouiId'));
                });
            });
            return filterOuiIds;
        },
        /**
         * 获取需要提交的json对象
         */
        getFormValue: function (selector,rights) {
            var filterOuiIds = null;
            if (selector) {
                filterOuiIds = this.getOuiIdsBySelector(selector);
            }
            var ids = filterOuiIds ? filterOuiIds : this.ids, cd = this.controlData;
            var rightsArr= [];
            if(rights){
                if(typeof rights =='string'){
                    rightsArr = rights.split(',');
                }else{
                    rightsArr = rights;
                }
            }
            var curr = null;
            var cfg = {};
            for (var i = 0, len = ids.length; i < len; i++) {
                curr = cd[ids[i]];
                if (!curr) {
                    continue;
                }
                if (!curr.attr('allowInput')) {//对于不允许输入的控件,不用提交数据
                    continue;
                }
                if (!curr.attr("name")) {
                    continue;
                }
                /***如果传入了权限过滤提交 ，则需要判断当前控件的权限与传入权限是否匹配 ****/
                if(rightsArr&&rightsArr.length){
                    var right = curr.attr('right');
                    if(rightsArr.indexOf(right) < 0){//权限不匹配则退出
                        continue;
                    }
                }
                oui.JsonPathUtil.setObjByPath(curr.attr('name'), cfg, curr.attr('value'));
                //putToObj(cfg,{name:curr.attr('name'),value:curr.attr('value')}); //原来实现的 转json的方法
            }
            return cfg;
        },
        /**清空某个容器中的所有控件 ***/
        clearByContainer: function (container) {
            $(container).find('div[ouiid]').each(function () {
                var ouiId = $(this).attr('ouiId');
                if (ouiId) {
                    oui.clearByOuiId(ouiId);
                }
            });
        },
        /**清空 根据函数判断进行清空 ***/
        clearBy: function (fun) {
            var d = this.controlData;
            var _self = this;
            var ids = [].concat(this.ids);
            for(var len=ids.length,i=len-1;i>-1;i--){
                if(ids[i] && d[ids[i]]&&fun(d[ids[i]])){
                    _self.clearByOuiId(ids[i]);
                }
            }
        },

        /* 根据条件获取控件对象 ****/
        getBy:function(fun){
            var ids = this.ids;
            var _self = this;
            var curr;
            var arr = [];
            for (var i = 0, len = ids.length; i < len; i++) {
                curr = _self.getByOuiId(ids[i]);
                if (curr == null) {
                    continue;
                }
                if(fun && fun(curr)){
                    return curr;
                }
            }
            return null;
        },
        /**
         * 根据ouiId 清楚控件对象缓存
         */
        clearByOuiId: function (ouiId) {
            var c = this.getByOuiId(ouiId);
            if (!c) {
                return;
            }
            var id = c.attr('id');
            if (this.hasChildrenControlIdMap[id]) {
                this.hasChildrenControlIdMap[id] = false;
                delete this.hasChildrenControlIdMap[id];
            }
            var name = c.attr('name');
            if (this.hasChildrenControlNameMap[name]) {
                this.hasChildrenControlNameMap[name] = false;
                delete this.hasChildrenControlNameMap[name];
            }
            c.clear();
            c = null;
            delete c;
            delete this.controlData[ouiId];
            var idx = this.ids.indexOf(parseInt(ouiId));
            if (idx < 0) {
                return;
            }
            this.ids.splice(idx, 1);
        },
        /**
         * 根据元素Id 清除控件对象
         */
        clearById: function (elId) {
            var container='body';
            try{
                container=oui.getCurrPageContainer();
            }catch (e){
                container='body';
            }
            var el = $("#" + constant.controlIdPrefix + elId,container)[0];
            if (!el) {
                return;
            }
            var ouiId = $(el).attr(constant.ouiIdName);
            this.clearByOuiId(ouiId);
        },
        /**
         * 清除没有元素的控件
         */
        clear4notUse: function () {
            var d = this.controlData;
            var _self = this;
            for (var i in d) {
                var id = d[i].attr('id');
                var curr = oui.getById(id);
                if (!curr) {
                    _self.clearByOuiId(i);
                }
            }
        },
        /*****
         * 获取控件依赖的静态资源
          * @param tagName
         *
         * @param isRequire 不管是否已经加载该资源，也要返回依赖资源
         */
        getControlUrls:function(tagEnum,isRequire){
            if(!tagEnum){
                return [];
            }
            if(tagEnum.noResource){
                return [];
            }
            var tagName=tagEnum.tag,controlClass=tagEnum.controlClass;

            tagName =tagName.toLowerCase();
            var folderName = tagName.replace('oui-','');
            if(!controlClass){
                var tempCls = folderName.replace(/-/ig,'');
                controlClass = tempCls;
            }
            /** 如果控件已经存在则返回空数组***/
            if(ctrl[controlClass]){
                /** 控件已经存在，但是还是需要该依赖资源时则返回，否则不返回**/
                if(!isRequire){
                    return [];
                }
            }
            var cssPath ='';
            var path = oui.getContextPath();
            path +='res_common/oui/ui/';
            if(tagEnum.isCommon){ //公共组件
                if(!tagEnum.cssType){
                    //默认 pc 移动做样式适配
                    if(oui.os.mobile){
                        cssPath = path+'ui_phone/';
                    }else{
                        cssPath = path+'ui_pc/';
                    }
                }else if(tagEnum.cssType == CssTypeEnum.common){
                    //pc和移动公共
                    cssPath= path+'ui_common/';
                }else if(tagEnum.cssType == CssTypeEnum.noCss){
                    //无需样式
                }
                //js公共目录
                path += 'ui_common/';
            }else{
                if(oui.os.mobile){
                    path += 'ui_phone/';
                }else{
                    path += 'ui_pc/';
                }
                /** 非表单类控件 样式路径处理***/
                if(!tagEnum.cssType){
                    //默认 pc 移动做样式适配
                    cssPath = path;
                }else if(tagEnum.cssType == CssTypeEnum.common){//不是公共控件，但是样式确是公共的，这种场景不可能存在
                    //pc和移动公共
                    cssPath= 'ui_common/';
                }else if(tagEnum.cssType == CssTypeEnum.noCss){
                    //无需样式
                    cssPath ='';
                }
            }

            if(tagName =='oui-form'){
                path +='form/';

                var fileName = tagEnum.fileName || controlClass;
                fileName += '.js';
                path+=fileName;
                cssPath ='';//表单类控件的样式 在表单公共样式里
            }else{
                folderName = tagEnum.fileName||folderName; //如果有指定文件名则用，否则按照默认规则截取
                path +='controls/'+folderName+'/';
                if(cssPath){ //需要css资源
                    cssPath +='controls/'+folderName+'/css/';
                    cssPath += (folderName+'.css');
                }
                var fileName= folderName+'.js';
                path+=fileName;
            }

            var requireArr=[];
            requireArr.push(path);
            if(cssPath){
                requireArr.push(cssPath);
            }
            return requireArr;
        },
        /*** 基础解析控件****/
        parseByContainerBase:function(container,tags,callback){

            /** 遍历所有 控件类型枚举，进行解析 ***/
            var selecter = tags ||[];
            var parsingMap = oui.newParsingMap();
            parsingMap.results = [];
            /** 控件解析完成后的执行逻辑***/
            var bindOver = function(parsingMap,callback){
                if(parsingMap.count<=0){
                    try {
                        if(window.LazyLoadImg){
                            LazyLoadImg.init = function(options){
                                var _options = $.extend({
                                    el: document.querySelector('body'),
                                    mode: 'default', //默认模式，将显示原图，diy模式，将自定义剪切，默认剪切居中部分
                                    time: 300, // 设置一个检测时间间隔
                                    complete: true, //页面内所有数据图片加载完成后，是否自己销毁程序，true默认销毁，false不销毁
                                    position: { // 只要其中一个位置符合条件，都会触发加载机制
                                        top: 0, // 元素距离顶部
                                        right: 0, // 元素距离右边
                                        bottom: 0, // 元素距离下面
                                        left: 0 // 元素距离左边
                                    },
                                    before: function () { // 图片加载之前执行方法
                                    },
                                    success: function (el) { // 图片加载成功执行方法
                                    },
                                    error: function (el) { // 图片加载失败执行方法
                                        el.src = oui.getContextPath() + "res_apps/common/image/img-error.png";
                                    }
                                }, options);
                                new LazyLoadImg(_options);
                            };
                            window.LazyLoadImg && window.LazyLoadImg.init();
                        }}catch (e){
                        console.error && console.error(e);
                    }
                    callback&&callback(parsingMap);
                    oui.clearParsingMap(parsingMap);
                }
            };
            if(selecter && selecter.length){
                /**解析方案一： 照顺序来加载渲染,缺点 遍历次数较多，查找dom次数较多*/
                parsingMap.count = selecter.length;
                parsingMap.size = selecter.length;
                for(var i = 0,len = selecter.length;i<len;i++){
                    var tagEnum = Parser.findTagEnumByTag(selecter[i]);
                    try{
                        tagEnum&&tagEnum.parse(container,function(result){
                            parsingMap.count--;
                            parsingMap.results.push({tag:result.tag,size:result.size});
                            bindOver(parsingMap,callback);
                        });
                    }catch(e){
                        console.log('解析控件异常:'+tagEnum.tag+'\n'+Parser.getControlUrls(tagEnum,true).join('\n'));
                        parsingMap.count--;
                        parsingMap.results.push({tag:selecter[i],size:$(selecter[i]).length,error:'解析控件异常:'+tagEnum.tag+'\n'+Parser.getControlUrls(tagEnum,true).join(', '),success:false});
                        bindOver(parsingMap,callback);
                        throw new Error(e);
                    }

                }
                /** 方案二： 理论上按需加载的组件解析，不应该要影响其他组件的解析，根据oui标签 找到dom直接解析 ，无顺序影响的独立控件解析TODO ,后续改造控件机制后采用下面的方案***/
                //$(selecter.join(','),container).each(function(){
                //var tagEnum = Parser.findTagEnumByTag(this.tagName);
                //tagEnum&&tagEnum.parseByDom(this);
                //});
            }else{
                /** 如果没有解析任务 处理结束任务***/
                bindOver(parsingMap,callback);
            }
        },
        /**  根据容器，解析容器内所有控件
         *
         * 指定标签 如果标签为父类标签（表单分类的标签 oui-form）,必须指定控件类型，否则不予处理
         *
         * *****/
        parseByContainer:function (container,someTags,callback) {
            /**一、解析页面中include引入外部资源的标签*/
            var urls =  [];
            var eachTags = someTags || Parser.OuiTagsWithType||[];
            var tags = [];
            for(var i=0,len=eachTags.length;i<len;i++){
                var tag = eachTags[i];
                var $tags = $(tag,$(container));
                /** 没有该标签不做处理***/
                if((!$tags) || (!$tags.length)){
                    continue;
                }
                if(tag == constant.controlTagName){
                    /** 表单分类的主类 不用处理，需要细化到特定控件***/
                    continue;
                }
                tags.push(tag);
                var currEnum = Parser.findTagEnumByTag(tag);
                var temp = Parser.getControlUrls(currEnum);
                if(temp&&temp.length){
                    if(urls.indexOf(temp[0])<0){
                        urls = urls.concat(temp);
                    }
                }
            }
            if(urls&&urls.length){
                 oui.require4notSort(urls,function(){
                     Parser.parseByContainerBase(container,tags,callback);
                 },function(e){
                     console.log('parseByContainer，按需加载解析控件错误:'+e);
                     console.log(e);
                 },(oui_context&&oui_context.debug)?false:true);
            }else{
                Parser.parseByContainerBase(container,tags,callback);
            }
        },

        /**
         * 解析全部
         */
        parse: function (param,callback) {
            if(typeof param =='string'){
                param = {
                    container:param,
                    callback:callback
                };
            }else{
                param = param ||{};
            }
            var container='body';
            try{
                container=oui.getCurrPageContainer();
            }catch (e){
                container='body';
            }
            param.container = param.container ||container;
            this.parseByContainer(param.container,param.tags,param.callback);
        },
        /**
         * 解析页面include
         * 使用方式：1、引入html<oui-include type="html" src="res_apps/form/common.html"></oui-include>
         * 2、引入js <oui-include type="js" src="res_apps/form/common.js"></oui-include>
         */
        parseInclude: function (el) {
            var type = $(el).attr('type'); // html,js
            var src = $(el).attr('src');
            var url = oui_context.contextPath + src;
            if (type == 'js') {

            } else if (type == 'html') {
                var text = oui.loadUrl(url, true, false);
                el.outerHTML = text;
            } else if (type == 'tpl') {
                var text = oui.loadUrl(url, true, false);
                el.outerHTML = text;
                //TODO 根据模板id渲染ui-id位置
            }

        },
        /**
         * 解析单个dom元素
         */
        parseByDom: function (el, controlClass,callback) {
            /****************一、获取当前元素对象的class属性和控件类 *********************************************************/
            var id = $(el).attr("id");
            var cValue = this.formData[id] || $(el).attr("value") || $.trim($(el).html());
            var tagName = el.tagName||'';
            tagName = tagName.toLowerCase();
            var folderName = tagName.replace('oui-','');
            //console.log('parse value:'+cValue);
            if($(el).attr("type")){
                controlClass = $(el).attr("type").toLowerCase(); // 获取控件的class配置,规范要求class配置的第一个为控件类
            }else{
                if(!controlClass){
                    var tempCls = folderName.replace(/-/ig,'');
                    controlClass = tempCls;
                }
            }
            var controlObj = ctrl[controlClass];//根据分割的数组，取最后一个元素,为控件类名;取oui.$.ctrl命名空间下的控件
            if (!id) {
                oui.log('控件' + controlClass + '中没有ID属性，请为控件赋上ID属性!');
                throw new Error('控件' + controlClass + '中没有ID属性，请为控件赋上ID属性!');
            }
            if (!controlObj) { //如果控件对应的类不存在则返回;
                var tagEnum = Parser.findTagEnumByTag(tagName,controlClass);//找到标签枚举
                var requireArr = Parser.getControlUrls(tagEnum);//根据特定标签枚举找到依赖资源
                oui.require4notSort(requireArr,function(){
                    /** 按需加载控件 **/
                    if(ctrl[controlClass]){
                        oui.parseByDom(el,controlClass,callback);
                    }else{
                        oui.log('html代码中配置的 : '+tagName+'没有对应的控件类,解析路径:'+requireArr.join(','));
                        throw new Error('html代码中配置的 : '+tagName+'没有对应的控件类,解析路径:'+requireArr.join(','));
                    }
                },function(){
                    console.log('html代码中配置的 : '+tagName+'没有对应的控件类,解析路径:'+requireArr.join(','));
                },(oui_context&&oui_context.debug)?false:true);
                return ;
            }

            /****************二、将控件的属性组装成对象,根据具体实现类由抽象类创建控件对象 *********************************************************/
            var valueObj = (typeof cValue == 'object') ? cValue : {};
            var v = (typeof cValue == 'object') ? cValue.value : cValue;
            var data4DB = '';
            /** 回填控件data4DB属性****/
            if(typeof cValue === 'object' && cValue.data4DB){
                data4DB = cValue.data4DB;
                $(el).attr("data4DB",oui.parseString(data4DB));
            }
            var obj = this.createControl(//创建我们的控件对象
                controlObj, //控件具体实现类
                {
                    ouiId: this.getNewId(),// 为控件自增ouiId
                    type: controlClass,
                    valueObj: valueObj,
                    value: v,//需要为控件赋上的值
                    data4DB:data4DB
                },
                el);

            // var data = obj.attr('data');
            /***创建控件时，如果是依赖于父控件对象渲染，则需要缓存data数据 ***/
            var parentControlId = obj.attr('parentControlId');//与weakDependence 配套使用控件之间的依赖关系
            var parentControlName = obj.attr('parentControlName');//与weakDependence 配套使用控件之间的依赖关系
            if (parentControlId) {
                this.hasChildrenControlIdMap[parentControlId] = true;
                obj.attr('oldData', obj.attr('data'));
                var weakDependence = obj.attr('weakDependence');
                if((!weakDependence) ||(weakDependence =='false')){ //如果是强依赖 则需要清空枚举
                    obj.attr('data', []);
                }else{
                    //判断依赖控件是否存在 ，并且处理默认待选项
                    var data = obj.filterEnumDataByParentControlValue();
                    obj.attr('data',data);
                }
            }else if (parentControlName) {
                this.hasChildrenControlNameMap[parentControlName] = true;
                obj.attr('oldData', obj.attr('data'));
                var weakDependence = obj.attr('weakDependence');
                if((!weakDependence) ||(weakDependence =='false')){ //如果是强依赖 则需要清空枚举
                    obj.attr('data', []);
                }else{
                    //判断依赖控件是否存在 ，并且处理默认待选项
                    var data = obj.filterEnumDataByParentControlValue();
                    obj.attr('data',data);
                }
            }
            obj.beforeRender&&obj.beforeRender();
            /******************三、得到当前控件对象的html内容 start******************************************************/
            var html = obj.getHtml();
            /******************四、获取当前元素的outterHTML 替换body中的内容为模板引擎渲染后的html，执行控件afterRender完成渲染后事件绑定效果处理等 ******************************************************/
            /** 缓存原始代码中配置的html */
            obj.attr('sourceHtml', el.outerHTML);
            el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
            el = null;

            if (obj.attr('right') == 'design') {//设计期取消事件
                obj.afterRender4Design && obj.afterRender4Design();
                callback&&callback(obj);
                return obj;
            }
            obj.afterRender && obj.afterRender();//初始化后的事件绑定,解决移动端无法通过模板配置事件的功能
            callback&&callback(obj);
            return obj;
        },
        /***根据id判断当前控件有没有子控件 ***/
        hasChildrenControl: function (id) {
            if(!id){
                return false;
            }
            if (this.hasChildrenControlIdMap[id] || this.hasChildrenControlNameMap[id]) {
                return true;
            }
            return false;
        },
        /**
         * 创建控件对象
         */
        createControl: function (clz, cfg, el) {
            var obj = new clz(cfg);// 1,new控件对象 2,初始化对象属性配置对象,基本函数set,get 3,初始化默认值 4,初始化构造参数
            obj.putElAttr2Control(el);//根据控件对象,属性列表和元素设置控件对象的属性
            obj.init && obj.init(el);//执行控件初始化,通过init完成对控件对象初始化的继承功能
            this.controlData[obj.attr(constant.ouiIdName)] = obj; //缓存控件对象
            this.ids.push(obj.attr(constant.ouiIdName));//缓存控件ID进入有序列表
            return obj;
        },
        /**
         * 根据元素Id获取控件对象
         */
        getById: function (elId) {
            var container='body';
            try{
                container=oui.getCurrPageContainer();
            }catch (e){
                container='body';
            }
            var el = $("#" + constant.controlIdPrefix + elId,container)[0];
            if (!el) {
                return null;
            }
            var ouiId = $(el).attr(constant.ouiIdName);
            return this.getByOuiId(ouiId);
        },
        getManyByTitle:function(title){
            if(!title){
                return [];
            }
            var _self = this;
            var ids = this.ids ||[];
            var controls = [];
            oui.findManyFromArrayBy(ids,function(id){
                var curr = _self.controlData[id];
                if(curr && (curr.attr('title') == title)){
                    controls.push(curr);
                    return true;
                }else{
                    return false;
                }
            });
            return controls;
        },
        getByTitle:function(title){
            if(!title){
                return null;
            }
            var _self = this;
            var ids = this.ids ||[];
            var targetId = oui.findOneFromArrayBy(ids,function(id){
                var curr = _self.controlData[id];
                if(curr && (curr.attr('title') == title)){
                    return true;
                }else{
                    return false;
                }
            });
            if(targetId){
                return _self.controlData[targetId];
            }else{
                return null;
            }
        },
        getManyByName:function(name){
            if(!name){
                return [];
            }
            var _self = this;
            var ids = this.ids ||[];
            var controls = [];
            oui.findManyFromArrayBy(ids,function(id){
                var curr = _self.controlData[id];
                if(curr && (curr.attr('name') == name)){
                    controls.push(curr);
                    return true;
                }else{
                    return false;
                }
            });
            return controls;
        },
        getByName:function(name){
            if(!name){
                return null;
            }
            var _self = this;
            var ids = this.ids ||[];
            var targetId = oui.findOneFromArrayBy(ids,function(id){
                var curr = _self.controlData[id];
                if(curr && (curr.attr('name') == name)){
                    return true;
                }else{
                    return false;
                }
            });
            if(targetId){
                return _self.controlData[targetId];
            }else{
                return null;
            }
        },
        /**
         * 根据控件Id获取控件对象
         */
        getByOuiId: function (ouiId) {
            return this.controlData[ouiId];
        },
        /**
         *  根据 标签找到对应的 控件枚举,
         *  @tag 标签名 如 oui-form,oui-table
         *  @type 如果是表单类特定类型的控件，需要传入控件类型，非表单类控件，不用传入类型参数
         *  ***/
        findTagEnumByTag: function(tag,type){
            if(!tag){
                return null;
            }
            tag = tag.toLowerCase();
            var currEnum = this.tagMap[tag];
            if(!currEnum){
                return null;
            }
            if(currEnum.controlClass){
                //如果指定类控件类，则为指定类
                return currEnum;
            }else if(currEnum.childrenEnum){
                if(type){ //需要指定子枚举
                    //如果有子枚举，则返回子枚举中的类
                    return this.tagMap[tag+'[type='+type+']'];
                }else{
                    return currEnum;
                }
            }
            return currEnum;
        }
    };

    /***
     *
     * 对所有控件枚举进行默认解析函数处理
     * *******/
    (function(){
        var tags = [];
        var tagsWithType = [];
        var tagMap = {};
        for(var i in TagEnum){
            /** 默认解析接口处理**/
            if(!TagEnum[i].parseByDom){
                TagEnum[i].parseByDom = defaultParseByDom;
            }
            /** 默认解析多个控件的接口处理**/
            if(!TagEnum[i].parse){
                TagEnum[i].parse = defaultParse;
            }
            /** 子枚举处理***/
            if(TagEnum[i].childrenEnum){
                var chEnum = TagEnum[i].childrenEnum;
                for(var j in chEnum ){
                    /** 子枚举 单控件解析默认接口实现**/
                    if(!chEnum[j].parseByDom){
                        chEnum[j].parseByDom = defaultParseByDom;
                    }
                    /** 子枚举 默认解析多个控件的接口处理**/
                    if(!chEnum[j].parse){// 子枚举中的控件的解析模式，按照 控件标签和控件类型组合解析 ,如 oui-form[type='textfield']
                        chEnum[j].parse = defaultParse4childrenEnum;
                    }
                    /** 将子枚举放入枚举map, key 为父枚举[tag名-子枚举类型]**/
                    tagMap[TagEnum[i].tag.toLowerCase()+'[type='+chEnum[j].controlClass+']'] = chEnum[j];//便于根据标签和类型找到对应的枚举 findTagEnumByTag
                    tagsWithType.push(TagEnum[i].tag.toLowerCase()+'[type='+chEnum[j].controlClass+']');
                }
            }
            tagMap[TagEnum[i].tag.toLowerCase()] = TagEnum[i];
            tags.push(TagEnum[i].tag);//子枚举不用 将标签再追加到 标签列表中
            tagsWithType.push(TagEnum[i].tag);
        }
        Parser.tagMap = tagMap;
        /** 标签数据缓存****/
        Parser.OuiTags = tags;
        Parser.OuiTagsWithType = tagsWithType;
    })();
    /*****
     * 动态追加标签,或者更新oui标签
     * @param tag
     * @param cfg
     * @returns {*}
     */
    oui.tag = function(tag,cfg){
        var currEnum;
        if(typeof cfg =='undefined'){
            currEnum = Parser.findTagEnumByTag(tag);
        }else{
            currEnum = Parser.findTagEnumByTag(tag);
            var controlClass = cfg.controlClass || tag.replace('oui-','').replace(/-/ig,"").toLowerCase();
            if(currEnum && (!currEnum.controlClass)){
                //如果枚举存在，并且控件类型也存在，则需要追加子枚举
                currEnum.childrenEnum = currEnum.childrenEnum||{};
                var id = oui.getUUIDString();
                currEnum.childrenEnum[id] = {
                    tag:tag,
                    controlClass:controlClass,//表单类控件 单独实现解析
                    parseByDom: cfg.parseByDom||defaultParseByDom,
                    parse:cfg.parse||defaultParse,
                    isCommon:cfg.isCommon||false
                };
                Parser.tagMap[tag+'[type='+controlClass+']'] = currEnum.childrenEnum[id];
                Parser.OuiTagsWithType.push(tag+'[type='+controlClass+']');
            }else if(currEnum){ //追加指定控件
                //当前枚举已经存在,并且控件类也存在
                currEnum.tag = tag;
                currEnum.controlClass = currEnum.controlClass || controlClass;
                currEnum.parseByDom =currEnum.parseByDom || cfg.parseByDom||defaultParseByDom;
                currEnum.parse = currEnum.parse|| cfg.parse||defaultParse;
                currEnum.isCommon = currEnum.isCommon ||cfg.isCommon || false;
            }else{
                //当前枚举不存在
                var id = oui.getUUIDString();
                currEnum = {
                    tag:tag,
                    controlClass:controlClass,//控件类型
                    parseByDom: cfg.parseByDom||defaultParseByDom,
                    parse:cfg.parse||defaultParse,
                    isCommon:cfg.isCommon||false
                };
                TagEnum[id] = currEnum;
                Parser.tagMap[tag] = currEnum;
                Parser.OuiTags.push(tag);
                Parser.OuiTagsWithType.push(tag);
            }
        }
        return currEnum;
    };
    /**
     * 函数是一个空函数,它什么也不做。
     * 当某些时候你需要传入函数参数,
     * 而且希望它什么也不做的时候,
     * 你可以使用该函数,
     * 也无需再新建一个空的函数
     * @private
     */
    var _noop = function () {
    };
    /*************************************对外暴露的接口方法******************************************/
    oui.$.Parser = Parser;//命名空间存放Parser
    oui.parse = function (param) {
        Parser.parse(param);
    };//parse函数暴露
    oui.setFormData = function (data) {
        Parser.setFormData(data);
    };//设置表单数据
    /**
     * 根据容器Id找 表单数据
     * @param containerId
     * @param rights 权限限制 控件的right属性,可以传入数组，可以传入字符串，用逗号隔开
     * @returns {*|{}}
     */
    oui.getFormValueByContainerId = function (containerId,rights) {
        return Parser.getFormValueByContainerId(containerId,rights);
    };
    /**
     * 根据选择器找 表单数据
     * @param selector
     * @param rights 权限限制 控件的right属性,可以传入数组，可以传入字符串，用逗号隔开
     * @returns {*}
     */
    oui.getFormValue = function (selector,rights) {
        return Parser.getFormValue(selector,rights);
    };//获取表单数据
    oui.getFormData = function (selector,rights) {//获取表单display
        return Parser.getFormData(selector,rights);
    };
    oui.log = log;//调试日志输出
    /*** 根据条件获取控件对象**/
    oui.getBy = function(fun){
        return Parser.getBy(fun);
    };
    oui.getById = function (id) {
        return Parser.getById(id);
    };//根据元素Id获取控件对象
    oui.getByOuiId = function (ouiId) {
        return Parser.getByOuiId(ouiId);
    };//根据控件Id获取控件对象
    oui.getOuiIdsBySelector = function (container) {
        return Parser.getOuiIdsBySelector(container);
    };//根据元素容器查找所有控件ouiId
    oui.clearByContainer = function (container) {
        Parser.clearByContainer(container);
    };//根据元素容器清除容器中所有控件对象缓存
    oui.clearById = function (elId) {
        Parser.clearById(elId);
    };//根据元素Id清除对应的控件对象缓存
    oui.clearByOuiId = function (ouiId) {
        Parser.clearByOuiId(ouiId);
    };//根据控件Id清除控件对象缓存
    oui.clearBy = function (fun) {
        Parser.clearBy(fun);
    };//根据指定函数的逻辑判断清空
    oui.clear4notUse = function () {
        Parser.clear4notUse();
    };//清空没有元素的控件
    oui.parseByDom = function (el, controlClass,callback) {
        Parser.parseByDom(el, controlClass,callback);
    };//根据dom解析
    oui.clearFormData = function (id) {
        Parser.clearFormData(id)
    };//清空表单数据
    /**根据当前控件id找所有的子控件列表 ***/
    oui.getChildrenControlsById = function (controlId) {
        return Parser.getChildrenControlsById(controlId);
    };
    /** 根据控件name找到所有的子控件列表******/
    oui.getChildrenControlsByName = function(name){
        return Parser.getChildrenControlsByName(name);
    };
    /***判断控件是否有子控件列表 ***/
    oui.hasChildrenControl = function (id) {
        return Parser.hasChildrenControl(id);
    };
    /** 根据title获取一个控件***/
    oui.getByTitle = function(title){
        return Parser.getByTitle(title);
    };
    /**根据title获取多个控件 ****/
    oui.getManyByTitle = function(title){
        return Parser.getManyByTitle(title);
    };
    /** 根据title获取一个控件***/
    oui.getByName = function(name){
        return Parser.getByName(name);
    };
    /**根据title获取多个控件 ****/
    oui.getManyByName = function(name){
        return Parser.getManyByName(name);
    };
    oui._noop = _noop;//空函数
})(window, $);
//框架初始化点
(function (win, $) {
    /**
     * 上下文初始化
     */

    if (typeof win.oui_context == 'undefined') {
        win.oui_context = {};
    }
    /**
     * 初始化上下文路径,如 /CloudUI/
     */
    if (typeof win.oui_context.contextPath == 'undefined') {
        var pathName = win.location.pathname;

        var index = pathName.substr(1).indexOf("/res_apps/");
        if (index < 0) {
            index = pathName.substr(1).indexOf("/res_common/");
        }
        var result = pathName.substr(0, index + 1) + "/";

        win.oui_context.contextPath = result;
        if (typeof win.oui_contextPath == 'undefined') {
            win.oui_contextPath = result;
        }
    }

    //实现函数如下所示
    function getBrowser(n) {
        var ua = navigator.userAgent.toLowerCase(),
            s,
            name = '',
            ver = 0;
        //探测浏览器
        (s = ua.match(/msie ([\d.]+)/)) ? _set("ie", _toFixedVersion(s[1])) :
            (s = ua.match(/firefox\/([\d.]+)/)) ? _set("firefox", _toFixedVersion(s[1])) :
                (s = ua.match(/chrome\/([\d.]+)/)) ? _set("chrome", _toFixedVersion(s[1])) :
                    (s = ua.match(/opera.([\d.]+)/)) ? _set("opera", _toFixedVersion(s[1])) :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? _set("safari", _toFixedVersion(s[1])) : 0;
        if (name != 'ie') { //ie的特殊判断逻辑
            var ieFlag = isIE();
            if (ieFlag) {
                _set('ie', IEVersion());
            }

        }
        /**
         * 解析浏览器版本号
         */
        function _toFixedVersion(ver, floatLength) {
            ver = ('' + ver).replace(/_/g, '.');
            floatLength = floatLength || 1;
            ver = String(ver).split('.');
            ver = ver[0] + '.' + (ver[1] || '0');
            ver = Number(ver).toFixed(floatLength);
            return ver;
        };
        /**
         * 处理浏览器名和版本
         */
        function _set(bname, bver) {
            name = bname;
            ver = bver;
        };
        /**
         * IE 需要特殊逻辑判断
         */
        function isIE() {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                return true;
            } else {
                return false;
            }
        };
        /**
         * IE 需要处理版本
         */
        function IEVersion() {
            var rv = -1;
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) {
                    rv = parseFloat(RegExp.$1);
                }
            } else if (navigator.appName == 'Netscape') {
                var ua = navigator.userAgent;
                var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) {
                    rv = parseFloat(RegExp.$1);
                }
            }
            return rv;
        };
        if(ua.indexOf('edge')>-1){
            oui.browser.edge = ua.substring(ua.indexOf('edge')+5);
            oui.browser.isEdge = true;
        }
        return (n == 'n' ? name : (n == 'v' ? ver : name + ver));
    }

    //调用时，var neihe = getBrowser("n");  所获得的就是浏览器所用内核。
    //调用时  var banben = getBrowser("v"); 所获得的就是浏览器的版本号。
    //调用时  var browser = getBrowser(); 所获得的就是浏览器内核加版本号。
    oui.browser = {};
    oui.browser[getBrowser("n")] = getBrowser("v");

    /**
     * 判断浏览器是不是微信浏览器
     */
    oui.browser.isWechat = (function (u) {
        return u.indexOf('MicroMessenger') > -1
    })(navigator.userAgent);


    /**
     * 直接由浏览器判断操作系统
     * @return {Object} 操作系统信息，格式：<br>
     *     {<br>
     *       mobile:true/false,   //是否移动设备<br>
     *       ios:true/false,      //是否ios系统<br>
     *       android:true/false,  //是否android系统<br>
     *       iPhone:true/false,   //是否iPhone手机<br>
     *       iPad:true/false,     //是否iPad<br>
     *     }
     * @example
     * ```
     *    var os = oui.os;
     * ```
     */
    oui.os = (function (u) {
        return { // 移动终端浏览器版本信息
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
        };
    })(navigator.userAgent);


    /**
     * cookie操作接口
     * @param key
     * @param value
     * @param days
     * @param path
     * @returns {null}
     */
    oui.cookie = function (key, value, days, path) {
        // var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (value && value.length > 0) {
            days = days || 30;
            path = path || "/";
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path;
        } else {

            var _value = null;
            var allcookies = document.cookie;
            var cookie_pos = allcookies.indexOf(key);   //索引的长度

            // 如果找到了索引，就代表cookie存在，
            // 反之，就说明不存在。
            if (cookie_pos != -1) {
                // 把cookie_pos放在值的开始，只要给值加1即可。
                cookie_pos += key.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
                var cookie_end = allcookies.indexOf(";", cookie_pos);

                if (cookie_end == -1) {
                    cookie_end = allcookies.length;
                }

                _value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
            }
            return _value;
            // if (arr = document.cookie.match(reg)) {
            //     return unescape(arr[2]);
            // } else {
            //     return null;
            // }
        }
    };


    /**
     * 端的上下文集合，这里只适用与移动端的 第三方端的加载
     * @type {{}}
     */
    oui.clientContext = {};

    /**
     * 获取当前端的上下文
     * @returns {*}
     */
    oui.getCurrentClientContext = function () {
        var appType = oui.appType;
        for (var key in appType) {
            if (key !== 'version' && appType[key]) {
                return oui.clientContext[key];
            }
        }
        return {};
    };

    /**
     * 端类型对象
     * @type {{}}
     */
    oui.appType = {};

    /**
     * 判断页面是否是通过端上应用访问的进入的
     */
    oui.isClient = function () {
        var _appType = oui.appType;
        for (var key in _appType) {
            if (_appType[key]) {
                return true;
            }
        }
        return false;
    };


    /**
     * 获取端的版本
     * ps:
     * oui.appType.version
     * ...
     */
    oui.appType.version = "";

    /**
     * 判断是否是企业版
     * @returns {{}|*}
     */
    oui.hasOrg = function () {
        return (window.oui_context && (oui_context.oui_hasOrg || (oui_context.oui_hasOrg+'' == 'true')));
    };

    /**
     * 获取操作系统的版本，兼容ios和android
     * @method version
     * @return {String} 操作系统版本信息
     * @example
     * ```
     * var version = oui.os.version
     * ```
     */
    oui.os.version = (function (u) {
        if (oui.os.android) {
            return u.match(/(Android);?[\s\/]+([\d.]+)?/)[2];
        } else if (oui.os.iPhone) {
            return oui.os.version = u.match(/(iPhone\sOS)\s([\d_]+)/)[2].replace(/_/g, '.');
        } else if (oui.os.iPad) {
            return oui.os.version = u.match(/(iPad).*OS\s([\d_]+)/)[2].replace(/_/g, '.');
        } else {
            return null;
        }
    })(navigator.userAgent);

    /***
     * 替换css内容中的 图片路径 为全路径
     * @param cssText
     */
    function replaceCssImg(path,text,fun){
        path = path.replace(/\\/ig,'/');
        var folder = path.substring(0,path.lastIndexOf('/')+1);
        var reg=/(?=url\()[^)]+(?=\))/g;
        var cssText = text;
        var result = cssText.match(reg);
        if(!result){
            fun&&fun(cssText);
            return ;
        }
        var paths = [];

        var urlMap = {};
        for(var i = 0,len=result.length;i<len;i++){
            var currPath =result[i];
            var key = currPath;
            currPath = currPath.replace(/\"/g,"").replace(/\'/g,"");
            if(currPath.indexOf('data:') >=0){
                continue;
            }
            if(currPath.indexOf('/') ==0){
                //绝对路径
            }else if(currPath.indexOf('http')==0){
                //以http打头的全路径
            }else{
                //根据当前css的目录位置 追加相对路径
                currPath = folder +currPath;
            }

            paths.push(currPath.replace('url','').replace('(','').replace(')',''));
            urlMap[key] = currPath.replace('url','').replace('(','').replace(')','');
        }
        if(paths&&paths.length){
            oui.require(paths,function(){
                cssText = cssText.replace(reg,function(temp){
                    if(urlMap[temp]){
                        var base64code = getLocalStorageByUrl(urlMap[temp]);
                        if(base64code){
                            return 'url('+base64code;
                        }
                        return 'url('+urlMap[temp];
                    }else{
                        return temp;
                    }
                });
                fun&&fun(cssText);
            },function(){
                fun&&fun(cssText);
            },(oui_context&&oui_context.debug)?false:true,true);

            //cssText = cssText.replace(reg,function(temp){
            //    return 'url('+urlMap[temp];
            //});
            //fun&&fun(cssText);
        }else{
            fun&&fun(cssText);
        }

    };

    var OuiLocalStorage ={
        defaultExprTime:60*60*24*30,//默认缓存30天
        Cache : {
            /**
             * 总容量5M
             * 存入缓存，支持字符串类型、json对象的存储
             * 页面关闭后依然有效 ie7+都有效
             * @param key 缓存key
             * @param stringVal
             * @time 数字 缓存有效时间（秒） 默认60s
             * 注：localStorage 方法存储的数据没有时间限制。第二天、第二周或下一年之后，数据依然可用。不能控制缓存时间，故此扩展
             * */
            put : function(key,stringVal,time){
                try{
                    if(!localStorage){return false;}
                    if(!time || isNaN(time)){time=OuiLocalStorage.defaultExprTime;}
                    var cacheExpireDate = (new Date()-1)+time*1000;
                    var cacheVal = {val:stringVal,exp:cacheExpireDate};
                    localStorage.setItem(key,JSON.stringify(cacheVal));//存入缓存值
                    //console.log(key+":存入缓存，"+new Date(cacheExpireDate)+"到期");
                }catch(e){}
            },
            /**获取缓存*/
            get : function (key){
                try{
                    if(!localStorage){return false;}
                    var cacheVal = localStorage.getItem(key);
                    var result = JSON.parse(cacheVal);
                    var now = new Date()-1;
                    if(!result){return null;}//缓存不存在
                    if(now>result.exp){//缓存过期
                        this.remove(key);
                        return "";
                    }
                    //console.log("get cache:"+key);
                    return result.val;
                }catch(e){
                    this.remove(key);
                    return null;
                }
            },/**移除缓存，一般情况不手动调用，缓存过期自动调用*/
            remove : function(key){
                if(!localStorage){return false;}
                localStorage.removeItem(key);
            },/**清空所有缓存*/
            clear : function(){
                if(!localStorage){return false;}
                localStorage.clear();
            }
        }//end Cache
    };
    /** 获取本地缓存key***/
    function getLocalStorageKeyByUrl(url){
        var key = url;
        if(url.indexOf('?')>0){
            key = url.substring(0,url.indexOf('?'));
        }
        return key;
    }
    /** 获取缓存版本***/
    function getLocalStorageVersionByUrl(url){
        var key = getLocalStorageKeyByUrl(url);
        var clientVersion = localStorage[key+"_version"] ||"";
        if(!clientVersion){
            return clientVersion;
        }
        try{
            var ver = JSON.parse(clientVersion);
            clientVersion = ver.version;
            var now = new Date()-1;
            if(now>ver.exp){//缓存版本过期
                localStorage.removeItem(key);
                localStorage.removeItem(key+'_version');
                clientVersion ='';
            }else{
                clientVersion = ver.version;
            }

        }catch(e){
            clientVersion='';
        }

        return clientVersion;
    }
    function getLocalStorageByUrl(url){
        var key = getLocalStorageKeyByUrl(url);
        if(!window.localStorage){
            window.localStorage = {};
        }
        var localStorage = window.localStorage;
        return localStorage[key] ||"";
    }
    function setLocalStorageByUrl(url,content){
        var version = getUrlVersionByUrl(url);
        var key = getLocalStorageKeyByUrl(url);
        if(!window.localStorage){
            window.localStorage = {};
        }
        window.localStorage[key] = content;
        var time = OuiLocalStorage.defaultExprTime;
        var cacheExpireDate = (new Date()-1)+time*1000;
        var ver= {
            version:version||"",
            exp:cacheExpireDate
        };
        window.localStorage[key+"_version"] =JSON.stringify(ver);
    }
    function hasLocalStorageByUrl(url){
        var key = getLocalStorageKeyByUrl(url);
        if(!window.localStorage){
            window.localStorage = {};
        }
        var localStorage = window.localStorage;
        var flag = false;
        if(localStorage[key]){
            var ver = localStorage[key+'_version'];
            if(ver) {
                ver = JSON.parse(ver);
                var now = new Date()-1;
                try {
                    if(now>ver.exp){//缓存版本过期
                        localStorage.removeItem(key);
                        localStorage.removeItem(key+'_version');
                        flag = false;
                    }else {
                        flag = true;
                    }
                }catch(e) {
                    flag = false;
                }
            }else {//无版本控制
                flag = false;
            }
        }else{
            flag = false;
        }
        return flag;
    }
    /** 获取url版本***/
    function getUrlVersionByUrl(url){
        var cfg = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(url.indexOf("?")+1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                if(strs[i].split("=")[0]){
                    cfg[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
                }
            }
        }
        return cfg['V']||"";
    }
    /** 根据内容创建js脚本***/
    function createJsCssByText(url,text,callback,error){
        var isJs = /\/.+\.js($|\?)/i.test(url) ? true : false;
        if(isJs){
            var scripts = document.getElementsByTagName('script');
            for(var i = 0; i < scripts.length; i++){//是否已加载
                var currUrl = scripts[i].getAttribute('data-url');
                if(currUrl&&currUrl.indexOf(url)>-1 ){
                    callback&&callback();
                    return;
                }
            }
            var s = document.createElement('script');
            s.setAttribute('data-url',url);
            s.innerHTML = text;
            document.body.appendChild(s);
            callback&&callback();

        }else{
            var existTag = document.getElementsByTagName('style');
            for(var i = 0; i < existTag.length; i++){//是否已加载
                var currUrl = existTag[i].getAttribute('data-url');
                if(currUrl&&currUrl.indexOf(url)>-1 ){
                    callback&&callback();
                    return;
                }
            }
            replaceCssImg(url,text,function(cssText){
                var s = document.createElement('style');
                s.setAttribute('data-url',url);
                s.innerHTML = cssText;
                document.head.appendChild(s);
                callback&&callback();
            });
        }

    }
    /*****
     * 通过ajax加载js，css资源
     * @param url
     * @param callback
     * @param error
     */
    function loadJsCss4CacheAndAjax(url,callback,error){
        var serverVersion = getUrlVersionByUrl(url);
        var clientVersion = getLocalStorageVersionByUrl(url);
        if((clientVersion == serverVersion) && (hasLocalStorageByUrl(url))){
            var text = getLocalStorageByUrl(url);
            createJsCssByText(url,text,callback,error);
        }else{
            ajax({
                method:'get',
                async:true,
                url:url,
                success:function(res){
                    setLocalStorageByUrl(url,res);
                    createJsCssByText(url,res,callback,error);
                },
                error:function(e){
                    error&&error(e);
                }
            });
        }

    }
    var ajaxLoading = {};
    /* 封装ajax函数
     * @param {string}opt.type http连接的方式，包括POST和GET两种方式
     * @param {string}opt.url 发送请求的url
     * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
     * @param {object}opt.data 发送的参数，格式为对象类型
     * @param {function}opt.success ajax发送并接收成功调用的回调函数
     */
    function ajax(opt) {

        opt = opt || {};
        opt.method = opt.method.toUpperCase() || 'POST';
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () {};
        opt.error = opt.error || function(){};
        if((ajaxLoading[opt.url] && ajaxLoading[opt.url].state =='loaded') || (ajaxLoading[opt.url] && ajaxLoading[opt.url].state =='loadedError')){
            if(ajaxLoading[opt.url].state =='loaded'){
                opt.success(ajaxLoading['response']||"");
            }else{
                opt.error(ajaxLoading['response']||"");
            }

            return ;
        }
        if((ajaxLoading[opt.url] && ajaxLoading[opt.url].state =='loading')){
            ajaxLoading[opt.url].success.push(opt.success);
            ajaxLoading[opt.url].error.push(opt.error);
            return ;
        }else{
            ajaxLoading[opt.url] = {
                state:'loading',
                success:[opt.success],
                error:[opt.error]
            };
        }
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }var params = [];
        for (var key in opt.data){
            params.push(key + '=' + opt.data[key]);
        }
        var postData = params.join('&');
        if (opt.method.toUpperCase() === 'POST') {
            xmlHttp.open(opt.method, opt.url, opt.async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xmlHttp.send(postData);
        }
        else if (opt.method.toUpperCase() === 'GET') {
            var tempUrl = opt.url;
            if(postData){
                if(opt.url.indexOf('?')>0){
                    tempUrl = opt.url+'&'+postData;
                }else{
                    tempUrl = opt.url+'?'+postData;
                }
            }
            xmlHttp.open(opt.method, tempUrl, opt.async);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                ajaxLoading[opt.url].state ='loaded';
                var callbacks = ajaxLoading[opt.url].success;
                var res = xmlHttp.responseText;
                while (callbacks && callbacks.length > 0) {
                    var cb = callbacks.shift();
                    if (cb && (typeof cb === 'function')) {
                        cb(res);
                    }
                }
            }
        };
        xmlHttp.onerror = function(e){
            ajaxLoading[opt.url].state ='loadedError';
            var callbacks = ajaxLoading[opt.url].error;
            while (callbacks && callbacks.length > 0) {
                var cb = callbacks.shift();
                if (cb && (typeof cb === 'function')) {
                    cb(e);
                }
            }
        }
    };
    /** ajax 获取图片**/
    function ajax4img(url,callback,error){
        var serverVersion = getUrlVersionByUrl(url);
        var clientVersion = getLocalStorageVersionByUrl(url);
        if((clientVersion == serverVersion) && (hasLocalStorageByUrl(url))){
            callback&&callback(getLocalStorageByUrl(url)||url);
        }else{
            var xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (this.status == 200) {
                    var blob = this.response;
                    var a = new FileReader();
                    a.onload = function (e) { callback&&callback(e.target.result); }
                    a.readAsDataURL(blob);
                }else if(this.status == 404){
                    error&&error();
                }
            };
            if(error){
                xhr.onerror = function(){
                    callback&&callback();
                };
            }
            xhr.send();
        }

    }
    /** 按需加载封装***/
    function loadJsCss(url, callback,error ){// 非阻塞的加载 后面的js会先执行
        var isJs = /\/.+\.js($|\?)/i.test(url) ? true : false;
        /** 动态远程脚本场景 jsonp调用场景**/
        if(url.indexOf('__script__')>=0 && oui.getParamByUrl(url,'__script__')){
            isJs = true;
        }
        function onloaded(script, callback,error){//绑定加载完的回调函数
            if(script.readyState){ //ie
                script.attachEvent('onreadystatechange', function(){
                    if(script.readyState == 'loaded' || script.readyState == 'complete'){
                        script.className = 'loaded';
                        callback && (callback.constructor === Function) && callback();
                    }
                });
                if(error){
                    script.attachEvent('onerror', function(){
                        error && (error.constructor === Function) && error();
                    });
                }

            }else{
                script.addEventListener('load',function(){
                    script.className = "loaded";
                    callback && (callback.constructor === Function) && callback();
                }, false);
                if(error){
                    script.addEventListener('error',function(){
                        error && (error.constructor === Function) && error();
                    }, false);
                }
            }
        }
        if(!isJs){ //加载css
            var links = document.getElementsByTagName('link');
            for(var i = 0; i < links.length; i++){//是否已加载
                var href = links[i].getAttribute('data-url') || links[i].href;
                if(href.indexOf(url)>-1){
                    callback && (callback.constructor === Function) && callback();
                    return;
                }
            }
            var link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            link.setAttribute('data-url',url);
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(link);
            callback && (callback.constructor === Function) && callback();
        }else{ //加载js
            var scripts = document.getElementsByTagName('script');
            for(var i = 0; i < scripts.length; i++){//是否已加载
                var src =scripts[i].getAttribute('data-url') || scripts[i].src;
                if(src.indexOf(url)>-1){
                    //已创建script
                    if(scripts[i].className === 'loaded'){//已加载
                        callback && (callback.constructor === Function) && callback();
                    }else{//加载中
                        onloaded(scripts[i], callback,error);
                    }
                    return;
                }
            }
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = url;
            script.setAttribute('data-url',url);
            document.body.appendChild(script);
            onloaded(script, callback,error);
        }
    }

    /** 按需加载的queue***/
    var require_queue_map ={};
    var require_id=0;
    var require_no_sort_map={};
    var require_no_sort_id=0;
    /** 获取当前按需加载列表***/
    oui.getCurrRequires = function(){
        return {
            require_queue_map:require_queue_map,
            require_no_sort_map:require_no_sort_map,
            require_id:require_id,
            require_no_sort_id:require_no_sort_id
        }
    };
    /** 按需加载完成后清除缓存队列***/
    oui.clearQueueRequire = function(require_queue){
        for(var i in require_queue_map){
            if(require_queue_map[i] ===require_queue){
                require_queue_map[i].length=0;
                delete require_queue_map[i];
            }
        }
    };
    /** 无序队列加载完成后 清除无序队列***/
    oui.clearNoSortRequire = function(noSortMap){
        for(var i in require_no_sort_map){
            if(require_no_sort_map[i] ===noSortMap){
                noSortMap = null;
                delete require_no_sort_map[i];
            }
        }
    };
    /*** 有序的按需加载****/
    oui.require = function(arr,callback,error,isCache,isImg){
        if((!arr) ||(!arr.length)){
            callback&&callback();
            return ;
        }
        require_id++;
        require_queue_map[require_id]=[];
        var require_queue = require_queue_map[require_id];
        if(typeof arr =='string'){
            arr = [arr];
        }
        (function(require_queue,arr,callback,errorFun,isCache,isImg){
            /** 将按需加载的url放入队列***/

            var version =(oui_context&&oui_context.js_version)?oui_context.js_version:'';
            for(var i= 0,len=arr.length;i<len;i++){
                var cfg = (function(idx,urls,over,err,isCache,isImg){
                    var currUrl = urls[idx];
                    if(currUrl.indexOf('?')>0){
                       currUrl+=(version.replace('?','&'));
                    }else{
                        currUrl+=version;
                    }
                    var temp = {
                        getIndex:function(){
                            return require_queue.indexOf(this);
                        },
                        inited:false,
                        isEnd:false,
                        isImg:isImg,
                        urls:urls,
                        url:currUrl,
                        error:err,
                        isCache:isCache,
                        run:function(){
                            if(this.inited){
                                this.next();
                                return ;
                            }else{
                                this.inited = true;
                            }
                            var me =this;
                            if(me.isImg){
                                ajax4img(me.url,function(base64){
                                    setLocalStorageByUrl(me.url,base64||me.url);
                                    me.next();
                                },function(){
                                    //setLocalStorageByUrl(me.url, "error:"+me.url);
                                    me.error&&me.error(me.url);
                                    console.log('error:'+me.url);
                                    me.next();
                                });
                            }else{
                                if(me.isCache){
                                    loadJsCss4CacheAndAjax(me.url,function(){
                                        me.next();
                                    },function(){
                                        me.error&&me.error(me.url);
                                        console.log('error:'+me.url);
                                        me.next();
                                    });
                                }else{
                                    loadJsCss(me.url,function(){
                                        me.next();
                                    },function(){
                                        me.error&&me.error(me.url);
                                        console.log('error:'+me.url);
                                        me.next();
                                    });
                                }
                            }


                        },
                        next:function(){
                            var idx = this.getIndex();
                            if(idx == (require_queue.length-1)){
                                if(this.isEnd){
                                    return ;
                                }else{
                                    this.isEnd = true;
                                }
                                //最后一个结束后执行回调
                                oui.clearQueueRequire(require_queue);
                                over&&over();
                            }else{
                                var nextQueue = require_queue[idx+1];
                                nextQueue&&nextQueue.run();
                            }
                        }
                    };
                    return temp;
                })(i,arr,callback,errorFun,isCache,isImg);
                require_queue.push(cfg);
            }
            require_queue[0].run();
        })(require_queue,arr,callback,error,isCache,isImg);

    };
    /** 无序的按需加载**/
    oui.require4notSort = function(arr,callback,error,isCache,isImg){
        if((typeof arr =='object') && arr.length>1){
            require_no_sort_id++;
            require_no_sort_map[require_no_sort_id]={
                count:arr.length,
                isOver:false
            };
            for(var i= 0,len=arr.length;i<len;i++){
                (function(url,noSortMap,over,error,isCache,isImg){
                    oui.require([url],function(){
                        noSortMap.count--;
                        if(noSortMap.count<0){
                            noSortMap.count=0;
                        }
                        if(noSortMap.count==0){
                            if(noSortMap.isOver){
                                return ;
                            }
                            noSortMap.isOver = true;
                            oui.clearNoSortRequire(noSortMap);
                            over&&over();
                        }
                    },function(){error&&error();},isCache,isImg);
                })(arr[i],require_no_sort_map[require_no_sort_id],callback,error,isCache,isImg);
            }
        }else{
            oui.require(arr,callback,error,isCache,isImg);
        }
    };
 oui.getContextPath = function () {
        if (oui_context && oui_context.contextPath) {
            return oui_context.contextPath;
        }
        var pathName = document.location.pathname;
        var index = pathName.substr(1).indexOf("/");
        var result = pathName.substr(0, index + 1) + "/";
        if (!oui_context) {
            oui_context = {};

        }
        oui_context.contextPath = result;
        return result;
    };    /**
     * 框架加载完成函数
     * @param readyOptions
     * @param callback
     */
    oui.ready = function (readyOptions, callback) {
        if (typeof readyOptions === 'function') {
            callback = readyOptions;
            readyOptions = {};
        }
        $(document).ready(function () {
            setTimeout(function () {
                callback && callback();
            }, 10);
        });
    };

})(window, $);

