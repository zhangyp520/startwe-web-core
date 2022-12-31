!(function (win,$) {
  var ctrl = oui.$.ctrl;
  var constant = oui.$.constant;
  var Parser =  oui.$.Parser = {
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
      var data = this.controlData;
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
     * @param selector 指定定位器进行选择控件
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
     * 根据定位器 获取 控件的ouiId列表，包括元素本身
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
    /*****
     * 解析完成后回调绑定
     * @param parsingMap
     * @param callback
     */
    bindOver:function(parsingMap,callback){

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
    },


    /*** 基础解析控件****/
    parseByContainerBase:function(container,tags,callback){

      /** 遍历所有 控件类型枚举，进行解析 ***/
      var selecter = tags ||[];
      var parsingMap = oui.newParsingMap();
      parsingMap.results = [];
      /** 控件解析完成后的执行逻辑***/

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
              var me = oui.$.Parser;
              me.bindOver(parsingMap,callback);
            });
          }catch(e){
            console.log('解析控件异常:'+tagEnum.tag+'\n'+Parser.getControlUrls(tagEnum,true).join('\n'));
            parsingMap.count--;
            parsingMap.results.push({tag:selecter[i],size:$(selecter[i]).length,error:'解析控件异常:'+tagEnum.tag+'\n'+Parser.getControlUrls(tagEnum,true).join(', '),success:false});
            var me = oui.$.Parser;
            me.bindOver(parsingMap,callback);
            console.error(e);
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
        var me = oui.$.Parser;
        me.bindOver(parsingMap,callback);
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
      var tagsWithType = oui.$.tagCfg.tagsWithType;
      var eachTags = someTags || tagsWithType||[];
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
    parseInclude: function (el,callback,error) {
      var type = $(el).attr('type'); // html,js,tpl,module
      type = type || 'module';//默认为module 加载
      var src = $(el).attr('src') || $(el).attr('url') ;
      var url = src;

      if(!src){
        throw new Error('include url 不存在:'+el.outerHTML);
      }
      if(src.indexOf('http')!=0){
        if(src.indexOf('.')!=0 && src.indexOf('/')!=0){
          url = oui_context.contextPath + src;
        }
      }


      if (type == 'js') {

      } else if (type == 'html') {
        var text = oui.loadUrl(url, true, false);
        el.outerHTML = text;
      } else if (type == 'tpl') {
        var text = oui.loadUrl(url, true, false);
        el.outerHTML = text;
        //TODO 根据模板id渲染ui-id位置
      }else if(type =='module'){ //  按照模块加载方式加载组件
        //引入模板
        var data = oui.util.getControllerData(el);
        //console.log('parseInclude:'+url);
        //console.log(el.parentNode);
        var params = oui.util.getParamsUrl(oui.getContextPath()+'index4vue.html#'+url);
        var path = params.path || url;

        oui.util.loadComponent(path,data,params,el,function(options){
          //成功回调
          callback&&callback();
        },function(err){
          //失败回调
          error&&error(err);
          console.log(err);
          console.log('路由['+url+']资源加载异常!!!');
        });
        return ;
      }
      callback&&callback();
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
        id = oui.getUUIDLong();
        // oui.log('控件' + controlClass + '中没有ID属性，请为控件赋上ID属性!');
        // throw new Error('控件' + controlClass + '中没有ID属性，请为控件赋上ID属性!');
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
          id:id,
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
      var clazz = controlObj;
      var config = clazz.tplTypeConfig||{};
      var showType = obj.attr('showType');
      var tplType = config[showType];
      if(!tplType){
        tplType = oui.TplTypeEnum.artTemplate.name;
      }
      if(!tplType){
        throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
      }
      var tplTypeEnum = oui.TplTypeEnum[tplType];
      if(!tplTypeEnum){
        throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
      }
      tplTypeEnum.beforeRender&&tplTypeEnum.beforeRender(obj,el);//模板引擎渲染前处理
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
      tplTypeEnum.render&&tplTypeEnum.render(obj);//特定模板引擎渲染处理
      tplTypeEnum.afterRender&&tplTypeEnum.afterRender(obj);//特定模板引擎渲染后处理
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
      var tagMap = oui.$.tagCfg.tagMap;
      var currEnum =  tagMap[tag];
      if(!currEnum){
        return null;
      }
      if(currEnum.controlClass){
        //如果指定类控件类，则为指定类
        return currEnum;
      }else if(currEnum.childrenEnum){
        if(type){ //需要指定子枚举
          //如果有子枚举，则返回子枚举中的类
          return tagMap[tag+'[type='+type+']'];
        }else{
          return currEnum;
        }
      }
      return currEnum;
    }
  }; //定义 解析器
  var tagCfg = oui.$.tagCfg;
  /** 自定义标签组件的解析*****/
  var defaultParse = tagCfg.defaultParse;
  var defaultParse4childrenEnum = tagCfg.defaultParse4childrenEnum;
  var defaultParseByDom = tagCfg.defaultParseByDom;
  var CssTypeEnum = tagCfg.CssTypeEnum;
  var FormControlEnum = tagCfg.FormControlEnum;
  var TagEnum = tagCfg.TagEnum;
  /*****
   * 动态追加标签,或者更新oui标签
   * @param tag
   * @param cfg
   * @returns {*}
   */
  oui.tag = function(tag,cfg){
    var tagMap = tagCfg.tagMap;
    var tagsWithType = tagCfg.tagsWithType;
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
        tagMap[tag+'[type='+controlClass+']'] = currEnum.childrenEnum[id];
        tagsWithType .push(tag+'[type='+controlClass+']');
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
        tagCfg.tags.push(tag);
        tagsWithType.push(tag);
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
   * 根据定位器找 表单数据
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
  oui.log  = function (msg) {
    if (oui_context&&oui_context.debug) {//开发期debug配置 true则执行
      oui.alert(msg);//原生alert函数执行
      console.log(msg);//日志输出
    }
  };//调试日志输出
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

})(window,window.$$||window.$);





