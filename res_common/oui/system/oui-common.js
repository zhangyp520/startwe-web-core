!(function (window,$) {
  //退出页面时的确认提示
  oui.confirmClose = function (e) {
    e = e || window.event;
    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = '确定退出吗1？';
    }
    // For Safari chrome
    return '确定退出吗2?';
  };
  oui.heartTime = 22 * 60 * 1000; //默认22分钟心跳
  /** 判断某个对象是否是空对象****/
  oui.isEmptyObject = function(obj){
    if(!obj){
      return true;
    }
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  };
  /**
   * 检测客户端心跳
   */
  var checkingTimer = null;
  oui.checkHeart = function () {
    var url = oui_context.contextPath + 'common.do?method=time';
    if ((!location.port) || (!location.hostname)) {
      return;
    }
    oui.getData(url, {_t: new Date().getTime()}, function () {
      if (checkingTimer) {
        window.clearTimeout(checkingTimer);
        checkingTimer = null;
      }
      checkingTimer = window.setTimeout(oui.checkHeart, oui.heartTime);
    }, false);

  };
  /***
   * 根据模板配置 替换 某个容器里面的内容
   * url,scripts,controller,initMethod,container,callback,params
   * @param tplCfg
   */
  oui.replaceByTplConfig = function(tplCfg){
 
    
    var url = tplCfg.url;
    var scripts = tplCfg.scripts ||[];
    var container = tplCfg.container ||'body';
    var callback = tplCfg.callback;
    var params = tplCfg.params||"";
    var openType = tplCfg.openType||'inner';
    //iframe打开页面
    if(openType =='iframe'){
      /**访问一个iframe默认页面，然后加载基础资源后替换模板*/
      var baseUrl = oui.getContextPath()+'res_engine/iframe-base-1.html';
      var iframeId = 'zk_'+oui.getUUIDLong();
      baseUrl = oui.setParam(baseUrl,'_t',oui.getUUIDLong());
      $(container).html('<iframe iframe-id='+iframeId+' frameborder="0" scrolling="no"  class="content-iframe" src="'+baseUrl+'"></iframe>');
      var $iframe = $('iframe[iframe-id='+iframeId+']',container);

      /**iframe的加载绑定机制***/
      oui.bindIframeReady($iframe[0],function(doc,cwin,win,iframe){
        cwin.$('.container',doc).html('<oui-include type="html" src="'+url+'"></oui-include>');
        cwin.oui.parse('.container');
        cwin.oui.require(scripts,function(){
          callback&&callback(params);
          iframe.style.visibility = 'hidden';
          // 提前还原高度
          iframe.setAttribute('height', 'auto'); // 或设为''

          //延迟调用处理 iframe高度自适应问题
          setTimeout(function() {
            iframe.setAttribute('height', doc.body.scrollHeight);
            iframe.style.visibility = 'visible';
          }, 100);
        });
      });

    }else{
      /**内嵌 inner 内容替换打开 ****/
      oui.clearByContainer(container);
      //<oui-include url="/res_apps/test/views/menu1.art.html" ref="hello" type="module" data="menuData"></oui-include>
      if(url.lastIndexOf('art.html')>-1 || url.lastIndexOf('vue.html')>-1 ){
        //模块加载

        $(container).html('<oui-include type="module" ref="router_include_v'+oui.getUUIDLong()+'" data="_data().getView().data" url="'+url+'"  ></oui-include>');
      }else{
        $(container).html('<oui-include type="html" src="'+url+'"></oui-include>');
      }
      oui.parse(container);
      oui.require(scripts,function(){
        callback&&callback(params);
      });
    }
  };

  oui.isObject = function(obj){
    return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] === 'Object';
  };
  /***
   * 获取 portal当前活动的页签id
   * @returns {*}
   */
  oui.getPortalActiveTabId = function(){
      var id = '';
      try{
        id = oui.util.eval("com.oui.portal.PortalController.data.activeTabId");
      }catch(err){
        id ='';
      }
      return id;
  };
  oui.addOuiParams4Url = function (url) {
    if(window['oui_context']){
      if(oui_context['oui_params']){
        url = oui.setParam(url, "oui_params", oui_context['oui_params']);
      }
      var ouiCoreParams = oui_context['oui_core_params'];
      if (ouiCoreParams && oui.isObject(ouiCoreParams)) {//存在coreParams
        for(var paramKey in ouiCoreParams){
          if(ouiCoreParams.hasOwnProperty(paramKey)){
            var paramValue = ouiCoreParams[paramKey];
            url = oui.setParam(url, paramKey, paramValue);
          }
        }
      }
    }
    return url;
  };

  /**
   * 页面跳转不记录历史记录
   * @param url
   * @param params
   */
  oui.go4replace = function (url, params) {
    if (!url) {
      return;
    }
    url = oui.addOuiParams4Url(url);
    var param = $.extend({}, params || {});
    param = $.param(param);
    if (param.length > 0) {
      if (url.indexOf('?') > 0) {
        url = url + '&' + param;
      } else {
        url = url + '?' + param;
      }
    }
    if(window.location.replace){
      window.location.replace(url);
    }else {
      window.location.href = url;
    }
  };

  /**
   * 页面调整
   * @param url
   * @param data 是否传入数据参数
   * @param isReplace 是否使用 replace
   * @param hasTime 是否跟时间戳
   */
  oui.go = function (url, data, isReplace, hasTime) {
    if (!url) {
      return;
    }
    url = oui.addOuiParams4Url(url);
    if (!hasTime) {
      url = oui.setParam(url, "_t", new Date().getTime());
    }
    var param = $.extend({}, data || {});
    param = $.param(param);
    if (param.length > 0) {
      if (url.indexOf('?') > 0) {
        url = url + '&' + param;
      } else {
        url = url + '?' + param;
      }
    }
    if(isReplace){
      setTimeout(function(){
        if(window.location.replace){
          window.location.replace(url);
        } else {
          window.location.href = url;
        }
      },10);
    } else {
      setTimeout(function(){
        window.location.href = url;
      },10);
    }
  };


// 框架常量
  oui.constant = {
    BACK_URL_KEY: "oui_back_url" //返回函数所用的地址key
  };
  /**
   * 页面返回
   */
  oui.back = function (win,url) {
    win = win || window;
    if(url){
      win.location.replace(url);
      return ;
    }
    var oui_back_url = oui.getParam(oui.constant.BACK_URL_KEY);
    if(oui_back_url && oui_back_url.length > 0){
      oui_back_url = decodeURIComponent(oui_back_url);
      window.location.href = oui_back_url;
      return ;
    }
    if(win.history){
      win.history.go(-1);
    } else {
      win.location.href = document.referrer;
    }
  };
//登出系统的方法
  oui.logout = function () {
    oui.getTop().location.href = oui_url.logout;
  };
//判断当前页面是否是顶层页面
  oui.isTop = function () {
    try {
      if (oui_isTop) {
        return true;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * 获取图片路径的title显示
   * @param imgId
   * @param width
   * @param height
   */
  oui.getImgUrl4Title = function (imgId, width, height) {
    if (imgId && (imgId.indexOf('data:') >= 0)) {
      return "";
    } else {
      return oui.getImgUrl(imgId, width, height);
    }
  };

  /**
   * 获取静态图片访问路径
   */
  oui.getImgUrl = function (imgId,width,height) {
    /** 对于base64的图片数据直接返回 ***/
    if(imgId && (imgId.indexOf('data:')>=0)){
      return imgId;
    }
    if (imgId && imgId.indexOf('/') > 0) { //如果是系统默认配置路径则返回路径

      var url ='';
      if((imgId.indexOf('/')==0) || (imgId.indexOf('http:')==0) || (imgId.indexOf('https:')==0)){
        url = oui.addOuiParams4Url(imgId);
      }else{
        url = oui.addOuiParams4Url(oui_context.contextPath + imgId);
      }
      if(width){
        url = oui.addParam(url,'width',width);
      }
      if(height){
        url = oui.addParam(url,'height',height);
      }
      return url;
    } else if (imgId && imgId.indexOf('.') > 0) { //只传入文件名的场景
      return oui_context.contextPath + 'res_apps/form/form-images/' + imgId;
    }

    return "";
    // if (!width) {
    //     width = "";
    // }
    // if (!height) {
    //     height = "";
    // }
    // var showImgUrl = oui.addOuiParams4Url(oui_context.contextPath + "file.do?method=showImage&id=" + imgId + "&width=" + width + "&height=" + height);
    // return showImgUrl;
  };

  /**
   * 生产二维码图片
   * @param content
   * @returns {string}
   */
  oui.showQRcode = function (content) {
    content = encodeURIComponent(content);
    return oui_context.contextPath + "file.do?method=showQRcode&content=" + content;
  };


  oui.isPortal = function(){
    return false;
  };
//oui.getUploadUrl =function(){
//	return  oui_context.contextPath + "file.do?method=doUpload";
//}
  var topMainWin = null;
  oui.getTopMain = function(){
    if(topMainWin){
      return topMainWin;
    }
    if(oui.getTop().$("#mainFrame").length > 0){
      topMainWin = oui.getTop().$("#mainFrame")[0].contentWindow;
    }else{
      topMainWin = oui.getTop();
    }
    return topMainWin;
  };

//获取顶层页面
  var topWin = null;
  oui.getParent = function (win) {
    var p;
    try {
      p = win.parent;
      if (!p.oui) {
        return win;
      }
    } catch (e) {
      return win;
    }
    return p;
  };
  oui.getTop = function () {
    if (topWin) {
      return topWin;
    }
    topWin = (function (p, c) {
      while (p != c) {

        c = p;
        p = oui.getParent(p);
      }
      return c;
    })(oui.getParent(window), window);
    return topWin;
  };
//获取在线人数
  oui.getOnlineUser = function () {
    var url = "common.do";
    var count = oui.getData(url, "method=countOnlineUser");
    return count;
  };

  oui.urlParam = {
    map: {},
    inited: false,
    /**
     * 设置 获取 全局属性
     */
    attr: function (k, v) {
      var len = arguments.length;
      if (len == 2) {
        this.map[k] = v;
        return;
      }
      if (len == 1) {
        return this.map[k];
      }
      if (!len) {
        return this.map;
      }
    },
    /**
     * 初始化url参数
     */
    initUrlParam: function () {
      this.inited = true;
      var url = location.search; //获取url中"?"符后的字串
      if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?")+1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          this.map[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
      }
    }
  };
  /**
   * 获取页面参数
   */
  oui.getParam = function (key) {
    if (oui.urlParam.inited == false) {
      oui.urlParam.initUrlParam();
    }
    if (typeof key == 'undefined') {
      if(oui.getNS() != window){
        return oui.getNS()._params;
      }else{
        return oui.urlParam.attr();
      }
    }
    if(oui.getNS() != window){
      return oui.getNS()._params[key];
    }else{
      return oui.urlParam.attr(key);
    }
  };
  oui.$xpath = function xpath(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
      xnodes.push(xres);
    }
    return xnodes;
  };
//获取xpath
  function readXPath(element) {
    //if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    //	return '//*[@id=\"' + element.id + '\"]';
    //}
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element == document.body) {//递归到body处，结束递归
      return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1,//在nodelist中的位置，且每次点击初始化
        siblings = element.parentNode.childNodes;//同级的子元素

    for (var i = 0, l = siblings.length; i < l; i++) {
      var sibling = siblings[i];
      //如果这个元素是siblings数组中的元素，则执行递归操作
      if (sibling == element) {
        return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
        //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
      } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
        ix++;
      }
    }
  }

//获取xpath
  function readXPath4all(element) {
    //if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    //	return '//*[@id=\"' + element.id + '\"]';
    //}
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element == document.body) {//递归到body处，结束递归
      return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1,//在nodelist中的位置，且每次点击初始化
        siblings = element.parentNode.childNodes;//同级的子元素

    for (var i = 0, l = siblings.length; i < l; i++) {
      var sibling = siblings[i];
      //如果这个元素是siblings数组中的元素，则执行递归操作
      if (sibling == element) {
        return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase()  ;
        //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
      } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
        ix++;
      }
    }
  }

  function readSelector(el) {
    if (!(el instanceof Element))
      return '';
    var path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
      var selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector += '#' + el.id;
        path.unshift(selector);
        break;
      } else {
        var sib = el, nth = 1;
        while (sib = sib.previousElementSibling) {
          if (sib.nodeName.toLowerCase() == selector)
            nth++;
        }
        if (nth != 1)
          selector += ":nth-of-type("+nth+")";
      }
      path.unshift(selector);
      el = el.parentNode;
    }
    return path.join(" > ");
  }
  /****
   * 获取当前元素相关信息
   * @param element
   */
  function readElementCfg(element){
    var outerHtml = element.outerHTML ||"";
    var innerHtml = element.innerHTML ||""
    var innerText = element.innerText||"";
    var tagInfo =outerHtml.replace(innerHtml,'');
    var path = readXPath(element);
    var path4all = readXPath4all(element);
    var selector =  readSelector(element);
    var cfg = {
      xpath:path,//xpath
      xpath4all:path4all,
      domSelector:selector, //元素定位器
      domTagName:element.tagName,//元素标签名
      domId:element.id,//元素id
      domClassName:element.className,//元素class Name
      domTagInfo:tagInfo,//元素标签信息
      domContent:innerText//元素内容
    };
    return cfg;
  }
  oui.readXPath = readXPath;
  oui.readXPath4All = readXPath4all;
  oui.readElementCfg = readElementCfg;
  oui.query = function queryBySelector(selector){
    return document.querySelectorAll(selector)||[];
  };
  /***设置页面参数 **/
  oui.setPageParam = function(key,v){
    if(!oui.getNS()._params){
      oui.getNS()._params = {};
    }
    if(typeof key=='object'){
      oui.getNS()._params = $.extend(true,oui.getNS()._params,key);
    }else{
      oui.getNS()._params[key] = v;
    }
    return  oui.getNS()._params;
  };
  /**获取页面参数 ***/
  oui.getPageParam=function(key){
    if(!oui.getNS()._params){
      oui.getNS()._params = {};
    }
    return  oui.getNS()._params[key];
  };
  /** 删除页面参数*****/
  oui.removePageParam = function(key){
    if(!oui.getNS()._params){
      oui.getNS()._params = {};
    }
    oui.getNS()._params[key] = null;
    delete oui.getNS()._params[key];
  };
  /** 获取加密后的url，keys为顺序的加密字段列表多个以逗号隔开**/
  oui.getEncodeUrl = function(url,keys){
    if(typeof keys =='string'){
      keys = keys.split(',');
    }
    var param ='';
    for(var i= 0,len=keys.length;i<len;i++){
      param+=(oui.getPageParam(keys[i])||"");
    }
    url = attachSecurityParam(url,param);
    return url;
  };

  /** 根据url获取参数****/
  oui.getParamByUrl = function(url,key){
    var cfg = {};
    if(!url){
      return cfg;
    }
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?")+1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        if(strs[i].split("=")[0]){
          cfg[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
      }
    }
    if(key){
      return cfg[key]||"";
    }
    return cfg;
  };
//修改URL里面的参数
  oui.setParam = function (url, paramName, paramValue,backUrl) {
    var cfg = oui.getParamByUrl(url);
    cfg[paramName] = paramValue;
    var first;
    if(url.indexOf("?")>-1){
      first = url.substring(0,url.indexOf("?"));
    }else{
      first = url;
    }
    var paramStr = $.param(cfg);
    url = first+'?'+paramStr;

    if (backUrl) {
      url = oui.setBackUrl(url, backUrl);
    }

    return url;
  };
//清楚URL中某个参数
  oui.delParam = function (url, paramName) {
    var cfg = oui.getParamByUrl(url);
    delete cfg[paramName];
    var first;
    if(url.indexOf("?")>-1){
      first = url.substring(0,url.indexOf("?"));
    }else{
      first = url;
    }
    var paramStr = $.param(cfg);
    url = first+'?'+paramStr;
    return url;
  };

//往URL中添加一组参数
  oui.addParams = function (url, params,backUrl) {
    var paramStr = "";
    if (typeof params === 'object') {
      paramStr = $.param(params);
    }
    if (url.indexOf("?") >= 0) {
      url += "&" + paramStr;
    } else {
      url += "?" + paramStr;
    }
    if (backUrl) {
      url = oui.setBackUrl(url, backUrl);
    }
    return url;
  };
//往URL中添加一个参数
  oui.addParam = function (url, paramName, paramValue, backUrl) {
    var cfg = {};
    cfg[paramName] = paramValue;
    var paramStr = $.param(cfg);
    if (url.indexOf("?") >= 0) {
      url += "&" + paramStr;
    } else {
      url += "?" + paramStr;
    }
    if (backUrl) {
      url = oui.setBackUrl(url, backUrl);
    }
    return url;
  };

  /**
   * 设置返回地址
   * @param url
   * @param backUrl
   */
  oui.setBackUrl = function (url, backUrl) {
    if(!backUrl){
      backUrl = window.location.href;
    }
    backUrl = encodeURIComponent(backUrl);
    return oui.setParam(url, oui.constant.BACK_URL_KEY, backUrl);
  };

  oui.uploadURL = window.oui_url&&window.oui_url.doUpload ? oui.addOuiParams4Url(window.oui_url.doUpload) : "";//防止有些urldialog没有引入 oui_context.jsp

//返回国际化语言
  oui.i18n = function (key) {
    var str = oui.$.i18nResources[key];
    if (str == null) {
      return key;
    } else {
      return str;
    }
  };
//将对象转JSON字符串
  oui.parseString = function (obj) {
    if(typeof obj =='string'){
      return obj;
    }
    return JSON.stringify(obj);
  };
//将字符串转换成JSON对象
  oui.parseJson = function (str) {

    if (typeof str == 'undefined') {
      return {};
    }
    if (!str) {
      return {};
    }
    if (typeof str == 'object') {
      return str;
    }
    /* eval 作用域处理****/
    if (str.indexOf('[') == 0) {
      return eval.call(window,str);
    } 
    return eval.call(window,"(" + str + ")");
  };
  oui.clone = function(obj){
    return $.extend(true,{},obj);
  };
//关闭层对话框
  oui.closeDialog = function (dialogId) {
    // mini.hideMessageBox(dialogId);
  };
//进度条
  oui.progress = function (msg) {
    if (msg == null || msg == undefined) {
      msg = oui.i18n("common_wait_tip");
    }
    return null;
  };
  oui.progress.hide = function(){
  };
//提示信息
  oui.alert = function (msg, callback) {
    // return mini.alert(msg, oui.i18n("common_msgBox_alert_title"), callback);
    return null;
  };
//确认对话框
  oui.confirmDialog = function (msg, okCallback, cancelCallBack) {
    // return mini.confirm(msg, oui.i18n("common_msgBox_confirm_title"), function (action) {
    //     if (action == "ok") {
    //         okCallback();
    //     } else {
    //         cancelCallBack && cancelCallBack();
    //     }
    // });
    return null;
  };
//输入对话框
  /**
   *
   * @param title
   * @param callback 如果data不是Array 返回一个字符串
   *  function(data){
   *      data = [
   *          'value1','value2',...
   *      ]
   *  }
   * @param inputs 不传入代表只有一个文本框
   *  [
   *      {
   *          title:'',
   *          value:'',
   *          validate:
   *          {
   *
   *          },
   *          type:'',//文本框（text），数字框(number)，日期(date)，日期时间(datetime) 文本域 默认 文本框
   *      },
   *      {
   *          title:'',
   *          value:'',
   *          type:'',//文本框，数字框，日期，日期时间 文本域
   *      }
   *  ]
   * @returns {*}
   */
  oui.showInputDialog = function (title, callback, inputs) {
    if (title == "" || title == null) {
      title = oui.i18n("common_msgBox_alert_title");
    }
    // return mini.prompt("", title, callback, false);
  };
//屏幕右下方弹出一个消息框
  oui.showRightDialog = function (options) {
//	options = {
//		    content: options.content,    
//		    state: (options.state==null?default: options.state),      //default|success|info|warning|danger
//		    x: (options.x==null?right:options.x),          //left|center|right
//		    y: (options.y==null?buttom:options.y),          //top|center|bottom
//		    timeout: 0     //自动消失间隔时间。默认2000（2秒）。
//	}
//     mini.showTips(options);
  };
//HTML对话框
  oui.showHTMLDialog = function (options) {
    // return mini.showMessageBox(options);
  };
//通过一个URL构造对话框
  oui.showUrlDialog = function (options) {
//	var param = {
//	    url: String,        //页面地址
//	    title: String,      //标题
//	    iconCls: String,    //标题图标
//	    width: Number,      //宽度
//	    height: Number,     //高度
//	    allowResize: Boolean,       //允许尺寸调节
//	    allowDrag: Boolean,         //允许拖拽位置
//	    showCloseButton: Boolean,   //显示关闭按钮
//	    showMaxButton: Boolean,     //显示最大化按钮
//	    showModal: Boolean,         //显示遮罩
//	    onload: function () {       //弹出页面加载完成
//	        var iframe = this.getIFrameEl(); 
//	        var data = {};       
//	        //调用弹出页面方法进行初始化
//	        iframe.contentWindow.SetData(data); 
//	                        
//	    },
//	    ondestroy: function (action) {  //弹出页面关闭前
//	        if (action == "ok") {       //如果点击“确定”
//	            var iframe = this.getIFrameEl();
//	            //获取选中、编辑的结果
//	            var data = iframe.contentWindow.GetData();
//	            data = mini.clone(data);    //必须。克隆数据。
//	            ......
//	        }                        
//	    }
//
//	}
//     mini.open(options);
  };
//关闭url对话框
  oui.close = function (action) {
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
  };
  /**
   * 获取Blob
   * @param {stirng} base64
   */
  function getBlob(base64) {
    var contentType = /data:([^;]*);/i.exec(base64)[1];
    var baseData = base64.substr(base64.indexOf("base64,") + 7, base64.length);
    return b64toBlob(baseData,contentType);
  }
  oui.getBlob = getBlob;
  /**
   * base64转Blob
   * @param {string} b64Data
   * @param {string} contentType
   * @param {number} sliceSize
   */
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  /**
   *
   * base64文件下载
   * ***/
  oui.downloadFile4base64 = function(url,fileName){
    var blob = getBlob(url);
    if (navigator.msSaveBlob) {

      navigator.msSaveBlob(blob, fileName);
    } else {
      var uuid = oui.getUUIDLong();
      $('body').append('<a id="btnDownLoad-'+uuid+'" style="display:none"></a>');
      var btnDownload = $('#btnDownLoad-'+uuid)[0];
      btnDownload.download = fileName;
      btnDownload.href = URL.createObjectURL(blob);
      btnDownload.click();
      $(btnDownload).remove();
    }
  };
//下载文件的函数
  oui.downloadFile = function (url, jsonParam) {
    var param = $.param(jsonParam || {});
    if (param) {
      param = '&' + param;
    }
    var downloadUrl = url + param;
    downloadUrl = oui.addOuiParams4Url(downloadUrl);
    if(oui.os.mobile){
      oui.go(downloadUrl);
    } else {
      if ($("#_downloadFrame").length == 0) {
        $("body").append("<iframe id='_downloadFrame' src='' width=0 height=0 style='display:none'></iframe>");
      }
      $("#_downloadFrame").attr("src", downloadUrl);
    }

  };
  var getFileSize = function (fSize) {
    var nSize = 0;
    if ((fSize + "").indexOf(" ") > 0) {
      var a_fSize = fSize.split(" ");
      var i_fSize = a_fSize[0];
      var s_sizeType = a_fSize[1];
      switch (s_sizeType) {
        case 'B':
          nSize = i_fSize / 1024;
          break;
        case 'KB':
          nSize = i_fSize;
          break;
        case 'MB':
          nSize = i_fSize * 1024;
          break;
        case  'GB':
          nSize = i_fSize * 1024 * 1024;
          break;
        default :
          break;
      }
    } else {
      nSize = fSize;
    }
    return nSize * 1024;
  };

//将字符串转化为字节长度，用于文件大小的比较
  oui.fileSize2Byte = getFileSize;

  /**
   * confirm, 截图完成后，确定事件 function(base64,boxData,o){},第一个参数返回base64，第二个参数截图宽高位置信息，第三个参数截图对象
   * cancel, 取消事件，关闭窗口
   * cropBoxResizable, 是否允许改变截图框大小，默认值false
   * boxWidth, 截图框默认宽
   * boxHeight,截图框默认高
   * showPreview,是否显示预览区域，默认值true
   * panelStyle 截图组件外框样式
   * ***/
  oui.showCutImg = function(options){
    var topId = oui.getUUIDLong();
    var outerHtml = '<oui-cutimg showType="1"  ></oui-cutimg>';
    var props = 'cropBoxResizable,boxWidth,boxHeight,showPreview,panelStyle'.split(',');
    var $outer = oui.getTop().$(outerHtml);
    for(var i= 0,len=props.length;i<len;i++){
      var key = props[i];
      var v = options[key]||"";
      $outer.attr(key,v);
    }
    var confirmFun = options.confirm ||function(){};
    if(confirmFun && (typeof confirmFun =='string')){
      confirmFun = eval(confirmFun);
    }
    oui.getTop().oui.setPageParam('tempfun_confirm_'+topId,function(base64,boxData,o){
      confirmFun && confirmFun(base64,boxData,o);
      var el = o.getEl();
      oui.getTop().oui.clearByOuiId(topId);
      oui.getTop().$(el).remove();
    });

    var cancelFun = options.cancel ||function(){};
    if(cancelFun && (typeof cancelFun =='string')){
      cancelFun = eval(cancelFun);
    }
    oui.getTop().oui.setPageParam('tempfun_cancel_'+topId,function(o){
      cancelFun&&cancelFun(o);
      var el = o.getEl();
      oui.getTop().oui.clearByOuiId(topId);
      oui.getTop().$(el).remove();
    });
    $outer.attr('confirm','oui.getTop().oui.getPageParam("tempfun_confirm_'+topId+'")');
    $outer.attr('cancel','oui.getTop().oui.getPageParam("tempfun_cancel_'+topId+'")');
    $outer.attr('class','cutimg-hide oui-class-cutimg');
    $outer.attr('id',topId);
    oui.getTop().$(oui.getTop().document.body).append($outer);
    oui.getTop().oui.parse();
    var topObj = oui.getTop().oui.getById(topId);
    topObj&&topObj.showCutImg();
  };

  /** 获取顶层页面 dialog最大 z-index***/
  oui.getTopMaxZIndex = function(){
    try{
      var dialogZIndex = oui.getTop().oui.$.ctrl.dialog.dialogMaxZIndex;
      return dialogZIndex;
    }catch(e){
      return 99;
    }
  };
  oui.uploadBase64 = function(base64,callback,fileName){
    var file = oui.getBlob(base64);
    file.name = fileName || (oui.getUUIDLong()+'.jpeg');
    oui.upload4ajax({
      file: file,
      data: {
      },
      success: function(result){
        var sdata = oui.parseJson(result);
        if(sdata.success){
          sdata.msg = oui.parseJson(sdata.msg);
        }
        var previewUrl = sdata.msg.previewUrl;
        var downloadUrl =sdata.msg.downloadUrl;
        callback({
          imgId:sdata.msg.id,
          downloadUrl:downloadUrl,
          previewUrl:previewUrl,
          success:result.success,
          size:file.size || 0,
          name:file.name,
          clientFile:file
        });
      },
      error: null,
      progress: null
    });
  };
//TODO SHANGC
  oui.upload4ajax = function(options){
    var _options = {
      url: oui.uploadURL,
      file: null,
      fileSizeLimit:( oui&&oui.uploadConfig&&oui.uploadConfig.defaultFileSizeLimit )|| "5 MB",
      fileNameMaxLength: 100,
      data: {
        isEncoder: false,
        bucket: ''
      },
      success: null,
      error: null,
      progress: null
    };

    $.extend(_options, options);

    if (options.hasOwnProperty("isEncoder")) {
      _options.isEncoder = options.isEncoder;
    }
    if (options.hasOwnProperty("bucket")) {
      _options.bucket = options.bucket;
    }

    var data;

    if (_options.file) {
      var fileSize = _options.file.size || 0;
      var fileName = _options.file.name || '';

      if (fileName.indexOf(".") < 0) {
        oui.getTop().oui.alert("上传文件命名需要后缀名");
        _options.error && _options.error();
        return;
      }

      if (fileName.length > _options.fileNameMaxLength && fileName.length !== 0) {
        oui.getTop().oui.alert("上传文件名超出" + _options.fileNameMaxLength + "个字符,请修改文件名后上传!");
        _options.error && _options.error();
        return;
      }
      var fileSizeLimit = getFileSize(_options.fileSizeLimit);
      if (fileSize > fileSizeLimit) {
        oui.getTop().oui.alert('上传文件超过' + _options.fileSizeLimit + '限制，请重新选择上传!');
        _options.error && _options.error();
        return;
      }
      data = new FormData();
      data.append('file', _options.file, fileName);
    }

    if (_options.data && data) {
      var _d = _options.data;
      for (var key in _d) {
        data.append(key, _d[key]);
      }
      _d = null;
    }

    if (!data) {
      oui.getTop().oui.alert('您还没有选择上传文件哦！');
      _options.error && _options.error();
      return;
    }

    $.ajax({
      url: _options.url,
      type: 'POST',
      data: data,
      dataType: "json",
      processData: false,
      contentType: false,
      //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
      //xhr: function () {
      //    var xhr = $.ajaxSettings.xhr();
      //    if (_options.progress && xhr.upload) {
      //        xhr.upload.addEventListener("progress", _options.progress, false);
      //        return xhr;
      //    }
      //},
      success: function (data) {
        data = oui.parseJson(data);
        _options.success && _options.success(data);
      },
      error: function (e) {
        _options.error && _options.error(e);
      }
    });
  };


  /**
   * 获取当前页面全路径
   * @returns {string}
   */
  oui.getFullPath = function (noContextPath) {
    var protocol = location.protocol;
    var host = location.hostname;
    var port = location.port;
    if(!noContextPath){
      return protocol + "//" + host + ((port == "") ? "" : (":" + port)) + oui.getContextPath();
    } else {
      return protocol + "//" + host + ((port == "") ? "" : (":" + port));
    }
  };

  /**
   * 计算图片高度和宽度
   * @param options
   * 1、如果没有传高、宽显示原图大小
   * 2、如果只传了宽：以‘宽度’缩小尺度为标准，来重新计算缩小的‘高度’
   * 3、如果只传了高：以‘高度’缩小尺度为标准，来重新计算缩小的‘宽度’
   * 4、如果都传了，并且高或宽，有其一小于原始大小，则进行缩小
   *      如果‘宽度’缩小尺度大于‘高度’缩小，就以‘宽度’缩小尺度为标准，来重新计算缩小的‘高度’
   *      如果‘高度’缩小尺度大于‘宽度’缩小，就以‘高度’缩小尺度为标准，来重新计算缩小的‘宽度’
   * 5、如果都穿了，值都比原始图片大：显示原图大小
   */
  oui.calculateImg = function (options) {
    var _options = {
      url: '',
      obj: null,
      w: 0,
      h: 0
    };

    $.extend(_options, options);

    if (!_options.url || _options.url.length < 0) {
      return;
    }

    var imgObj = new Image();
    imgObj.src = _options.url;

    //利用图片对象加载完成的事件 获取图片的高宽
    imgObj.onload = function () {
      (function (obj, _options) {
        var iW = parseFloat(obj.width);
        var iH = parseFloat(obj.height);

        if ((!_options.w || _options.w <= 0) && (!_options.h || _options.h <= 0)) {
          //不做处理

        } else if (_options.w && _options.w > 0 && (!_options.h || _options.h <= 0)) {
          iH = iH * (_options.w / iW);
          iW = _options.w;
        } else if (_options.h && _options.h > 0 && (!_options.w || _options.w <= 0)) {
          iW = iW * (_options.h / iH);
          iH = _options.h;
        } else if (_options.w && _options.w > 0 && _options.h && _options.h > 0) {
          if (iW > _options.w || iH > _options.h) {
            if (_options.w / iW >= _options.h / iH) {
              //iW = iW;
              iH = iH * (_options.w / iW);
              iW = _options.w;
            } else {
              iW = iW * (_options.h / iH);
              iH = _options.h;
            }
          }
        }

        $(_options.obj).width(iW);
        $(_options.obj).height(iH);

        imgObj = null;
      })(this, _options);
    };

    imgObj.onerror = function () {
      imgObj = null;
    };
  };

  oui.escapeStringToHTML = function (str, isEscapeSpace) {
    if (typeof str === "undefined" || typeof str === null) {
      return "";
    }
    str = str + "";
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/\r/g, "");
    str = str.replace(/\n/g, "<br/>");
    str = str.replace(/\'/g, "&#039;");
    str = str.replace(/"/g, "&quot;");
    if (typeof(isEscapeSpace) != 'undefined' && (isEscapeSpace == true || isEscapeSpace == "true")) {
      // str = str.replace(/\s/g, "&nbsp;");
      str = str.replace(/\s/g, "&ensp;");
    }
    return str;
  };

  oui.escapeHTMLToString = function (str) {
    if (typeof str === "undefined" || typeof str === null) {
      return "";
    }
    str = str + "";
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/&ensp;/g, " ");
    str = str.replace(/&#39;/g, "\'");
    str = str.replace(/&#039;/g, "\'");
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/<br>/g, "\n");
    str = str.replace(/<br\/>/g, "\n");
    str = str.replace(/<br \/>/g, "\n");
    return str;
  };

  oui.escapeStringToJavascript = function (str) {
    if (typeof str === "undefined" || typeof str === null) {
      return str;
    }
    str = str + "";
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/\r/g, "");
    str = str.replace(/\n/g, "");
    str = str.replace(/\'/g, "\\\'");
    str = str.replace(/"/g, "\\\"");
    return str;
  };

  /**
   * 字符串trim
   */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
  };
  /**
   * 根据对象和 key 获取对象中的属性值
   * @param obj
   * @param key
   * @returns {*}
   */
  oui.getJsonAttr = function (obj, key) { // getObjAttr  ----> getJsonAttr
    var json = oui.parseJson(obj);
    var kv = json[key];
    if (typeof kv == 'undefined') { //未定义
      return "";
    }
    if (typeof kv == 'number' || typeof kv == 'boolean') {// 数字 or bool
      return kv;
    }
    if (!kv) {
      return "";
    }
    return kv;
  };
  /**
   * 简单的复制实现
   * 依赖 jquery.zeroclipboard.min.js
   */
  $.fn.clipboard = function (options) {//
    $(this).on("copy", function (e) {
      e.clipboardData.clearData();
      e.clipboardData.setData("text/plain", $(options.target).val());
      e.preventDefault();
      var success = options.success;
      if (typeof success == 'function') {
        success();
      }
    });
  };
  oui.createClipBoard = function(el,callback,error,isFirst){
    var clipboard = new Clipboard(el);
    clipboard.on('success', function (e) {
      e.clearSelection();
      clipboard.destroy();
      clipboard = oui.createClipBoard(el,callback,error);
      callback&&callback();
      $('#copy-text-area').hide();
      $('#copy_button_').hide();
    });
    clipboard.on('error', function (e) {
      if (!Clipboard.isSupported()) {
        oui.getTop().oui.alert('当前浏览器不支持复制功能，请手动复制');
      } else {

        if(isFirst){
          var $copy_text = $('#copy_text');
          var $copy_button =$('#copy_button_');
          $copy_button.attr("data-clipboard-text", $copy_text.val());
          $copy_button.show();
          $('#copy-text-area_').show();
          $(el).focus();
          $(el).trigger('click');
          return ;
        }
        error&&error();
      }
      $('#copy-text-area').hide();
      $('#copy_button_').hide();
    });
    return clipboard;
  };
  /***
   * 复制文本功能
   * @param text
   * @param callback
   * @param error
   */
  oui.copyText = function(text,callback,error){
    oui.require([oui.getContextPath()+'res_common/third/clipboard.js/dist/clipboard.min.js'],function(){
      var $copy_text = $('#copy_text');
      var $copy_button =$('#copy_button_');
      var isFirst = false;
      if((!$copy_text)||(!$copy_text.length)){
        $(document.body).append('<div id="copy-text-area_" style="opacity: 0"><input type="text" id="copy_text"/></div>');
        $copy_text = $('#copy_text');
        $(document.body).append('<button type="button" id="copy_button_" style="opacity: 0" data-clipboard-action="copy" data-clipboard-target="#copy_text"  ></button>');
        $copy_button =$('#copy_button_');
        isFirst = true;
      }
      $copy_text.val(text);
      $copy_button.attr("data-clipboard-text", text);
      $copy_button.show();
      $('#copy-text-area_').show();
      $copy_text.val(text);
      var clipboard = oui.createClipBoard($copy_button[0],callback,error,isFirst);
      $copy_button.trigger('click');
    });
  };

  /**
   * 判断一个js对象是否为 dom对象
   */
  oui.isDom = ( typeof HTMLElement === 'object' ) ? function (obj) {
    return obj instanceof HTMLElement;
  } : function (obj) {
    return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };
  /**
   * 判断 目标元素是否在容器中或者本身
   * @param target 目标元素
   @param el 容器元素
   */
  oui.isInDom = function (target, el) {
    if (!target) {
      return false;
    }
    if (!el) {
      return false;
    }
    if ($(target).closest(el).length > 0) { //判断当前事件的元素 是否在指定元素范围内
      return true;
    }
    return false;
  };
  /**
   *  根据容器渲染图片
   *  <img src='pre.png' oui-img-src='' />
   *   TODO 待完善 功能未实现
   * @param el
   */
  oui.renderImgs = function (el) {
    //$(el).find('[form-img-src]').each(function(){ //图片渲染方式
    //    if($(this).attr('src') == $(this).attr('form-img-src')){
    //        return ;
    //    }
    //    $(this).attr('src',$(this).attr('form-img-src'));
    //});
  };
  /**
   * cavas 转图片对象
   */
  oui.canvas2Image = function (el) {
    if (!el) {
      return null;
    }
    if ($(el).length == 0) {
      return null;
    }
    var cavas = $(el)[0];
    var image = new Image();
    image.src = cavas.toDataURL("image/png");
    return image;
  };
  /**
   * jqery qrcode支持table 和 canvas渲染 扩展image
   * @param el
   * @param options
   */
  oui.qrcode = function (el, options) {
    if(!$.fn.qrcode){
      /** 按需加载处理二维码***/
      oui.require([oui.getContextPath()+'res_common/third/jquery/jquery.qrcode.min.js'],function(){
        if($.fn.qrcode){
          oui.qrcode(el,options);
        }
      },function(){
        console.log('按需加载二维码失败');
      },(oui_context&&oui_context.debug?false:true));
    }else{
      var target = $(el);
      var image = options.render === 'image';
      if (image) {
        options.render = 'canvas';
      }
      target.qrcode(options);
      if (image) {
        var imageObject = oui.canvas2Image(target.find('canvas'));
        target.empty().append(imageObject);
      }
    }
  };
  oui.barcode = function (el, value, options) {
    if(!$.fn.barcode){
      /** 按需加载处理条形码***/
      oui.require([oui.getContextPath()+'res_common/third/jquery/jquery-barcode.js'],function(){
        if($.fn.barcode){
          oui.barcode(el,value,options);
        }
      },function(){
        console.log('按需加载条形码失败');
      },(oui_context&&oui_context.debug?false:true));

    }else{
      var  target = $(el);
      var image = options.output === 'image';
      if (image) {
        el.append("<canvas id='canvasTarget'></canvas>");
        target = el.find("#canvasTarget");
        options.output = 'canvas';
      }
      target.barcode(value, "code128", options);
      if (image) {
        var imageObject = oui.canvas2Image(target);
        el.empty().append(imageObject);
      }
    }

  };
  oui.svg2Image = function (el) {
    var svgXml = $(el)[0].outerHTML();

    var image = new Image();
    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流
    return image;
  };

  /*** 转换字符串 函数为 函数的参数列表 ***/
  oui.parseString2FunctionParams = function(str){
    var resultParams =[] ;
    if(str){
      /** 解析代码参数****/
      var paramStr = str.substring(0,str.indexOf('{'));
      paramStr = paramStr.substring(paramStr.lastIndexOf('('),paramStr.lastIndexOf(')')+1);
      paramStr = paramStr.replace('(','');
      paramStr = paramStr.replace(')','');
      if(paramStr){
        /** 剔除参数中的注释**/
        var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
        paramStr =paramStr.replace(reg, function(word) {
          // 去除注释后的文本
          return (/^\/{2,}/.test(word) || /^\/\*/.test(word) )? "" : word;
        });
        paramStr = paramStr.split(','); //分割逗号
        /** 变量trim***/
        for(var i= 0,len=paramStr.length;i<len;i++){
          paramStr[i] = $.trim(paramStr[i]);
        }
        /** 连接变量***/
        resultParams= resultParams.concat(paramStr);
      }
      /** 解析 代码内容***/
      var start = str.indexOf('{')+1;
      var end = str.lastIndexOf('}');
      var codeBody = str.substring(start,end);
      resultParams.push(codeBody);//添加 代码内容
    }
    return resultParams;
  };
  /** 转换字符串 为可执行函数***/
  oui.parseString2Function = function(str){
    var params = oui.parseString2FunctionParams(str);
    var fun = Function.apply(null,params);
    return fun;
  };
  /** 转换json对象配置为 可执行函数****/
  oui.parseJson2Function = function(json){
    json = oui.parseJson(json);
    var params = json.params ||[];
    var startCode =json.startCode ||'';
    var bodyCode = json.bodyCode ||'';
    var endCode =json.endCode ||'';
    if(startCode){
      startCode+='\n';
    }
    if(bodyCode){
      bodyCode+='\n';
    }
    var code = startCode + bodyCode + endCode;
    var arr = [].concat(params);
    arr.push(code);
    var fun = Function.apply(null,arr);
    return fun;
  };
  /** 根据json获取方法内容***/
  oui.getFunctionStringByJson = function(json){
    try{
      var fun = oui.parseJson2Function(json);
      var resultStr = fun.toString().replace('anonymous','').replace('\n/*``*/','').trim(); //初始化的 参数代码
      return resultStr;
    }catch(e){
      return "脚本错误，无法解析"+oui.parseString(json);
    }
  };
  /**
   * 获取单行文本、多行文本中鼠标的位置
   */
  oui.getCurPos = function (el) {
    var curCurPos = '';
    var all_range = '';
    if (navigator.userAgent.indexOf("MSIE") > -1) { //IE

      if ($(el).get(0).tagName == "TEXTAREA") {
        // 根据body创建textRange
        all_range = document.body.createTextRange();
        // 让textRange范围包含元素里所有内容
        all_range.moveToElementText($(el).get(0));
      } else {
        // 根据当前输入元素类型创建textRange
        all_range = $(el).get(0).createTextRange();
      }

      // 输入元素获取焦点
      $(el).focus();

      // 获取当前的textRange,如果当前的textRange是一个具体位置而不是范围,textRange的范围从start到end.此时start等于end
      var cur_range = document.selection.createRange();

      // 将当前的textRange的end向前移"选中的文本.length"个单位.保证start=end
      cur_range.moveEnd('character', -cur_range.text.length)

      // 将当前textRange的start移动到之前创建的textRange的start处, 此时当前textRange范围变为整个内容的start处到当前范围end处
      cur_range.setEndPoint("StartToStart", all_range);

      // 此时当前textRange的Start到End的长度,就是光标的位置
      curCurPos = cur_range.text.length;
    } else {
      // 文本框获取焦点
      $(el).focus();
      // 获取当前元素光标位置
      curCurPos = $(el).get(0).selectionStart;
    }
    // 返回光标位置
    return curCurPos;
  };
// 设置当前光标位置方法
  oui.setCurPos = function (el, start, end,isNotFocus) {
    if (navigator.userAgent.indexOf("MSIE") > -1) {
      var all_range = '';

      if ($(el).get(0).tagName == "TEXTAREA") {
        // 根据body创建textRange
        all_range = document.body.createTextRange();
        // 让textRange范围包含元素里所有内容
        all_range.moveToElementText($(el).get(0));
      } else {
        // 根据当前输入元素类型创建textRange
        all_range = $(el).get(0).createTextRange();
      }
      if(!isNotFocus){
        $(el).focus();
      }
      // 将textRange的start设置为想要的start
      all_range.moveStart('character', start);

      // 将textRange的end设置为想要的end. 此时我们需要的textRange长度=end-start; 所以用总长度-(end-start)就是新end所在位置
      all_range.moveEnd('character', -(all_range.text.length - (end - start)));

      // 选中从start到end间的文本,若start=end,则光标定位到start处
      all_range.select();
    } else {
      // 文本框获取焦点
      if(!isNotFocus){
        $(el).focus();
      }

      // 选中从start到end间的文本,若start=end,则光标定位到start处
      $(el).get(0).setSelectionRange(start, end);
    }
  };


  /**
   * 日期格式化扩展
   * @param fmt
   * @returns {*}
   */
  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "H+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
  };


  /**
   * 通过时间戳转化日期字符串
   * @param time
   * @param _format
   * @returns {*}
   */
  oui.dateStrByTime = function (time, _format) {
    return new Date(time).format(_format || "yyyy-MM-dd HH:mm:ss");
  };

  /**
   * 将字符串转为日期对象
   * @param strDate
   * @returns {Object}
   */
  oui.dateByDateStr = function (strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
      function (a) {
        return parseInt(a, 10) - 1;
      }).match(/\d+/g) + ')');
    return date;
  };

  /**
   * 将字符串格式的时间转为想要的时间格式
   * @param strDate
   * @param _format
   * @returns {*}
   */
  oui.dateStrByDateStr = function (strDate, _format) {
    return oui.dateByDateStr(strDate).format(_format || 'yyyy-MM-dd HH:mm:ss');
  };
//获取当前日期yy-mm-dd
//date 为时间对象
  oui.getDateStr3 = function(date){
    date = date || new Date();
    var year = "";
    var month = "";
    var day = "";
    var now = date;
    year = ""+now.getFullYear();
    if((now.getMonth()+1)<10){
      month = "0"+(now.getMonth()+1);
    }else{
      month = ""+(now.getMonth()+1);
    }
    if((now.getDate())<10){
      day = "0"+(now.getDate());
    }else{
      day = ""+(now.getDate());
    }
    return year+"-"+month+"-"+day;
  };
  /**
   * 获得相对当前周AddWeekCount个周的起止日期
   * AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
   * **/
  oui.getWeekStartAndEnd=function(AddWeekCount){
    AddWeekCount = AddWeekCount||0;
    //起止日期数组
    var startStop = new Array();
    //一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;
    //获取当前时间
    var currentDate = new Date();
    //相对于当前日期AddWeekCount个周的日期
    currentDate = new Date(currentDate.getTime() + (millisecond * 7*AddWeekCount));
    //返回date是一周中的某一天
    var week = currentDate.getDay();
    //返回date是一个月中的某一天
    var month = currentDate.getDate();
    //减去的天数
    var minusDay = week != 0 ? week - 1 : 6;
    //获得当前周的第一天
    var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
    //获得当前周的最后一天
    var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
    //添加至数组
    startStop.push(oui.getDateStr3(currentWeekFirstDay));
    startStop.push(oui.getDateStr3(currentWeekLastDay));
    return startStop;
  };
  /**
   * 获得相对当月AddMonthCount个月的起止日期
   * AddMonthCount为0 代表当月 为-1代表上一个月  为1代表下一个月 以此类推
   * ***/
  oui.getMonthStartAndEnd = function(AddMonthCount,currentDate){
    AddMonthCount = AddMonthCount||0;
    //起止日期数组
    var startStop = new Array();
    //获取当前时间
    currentDate = currentDate || new Date();
    var month=currentDate.getMonth()+AddMonthCount;
    var year = currentDate.getFullYear();
    if(month<0){
      var n = parseInt((-month)/12);
      month += n*12;
      year = currentDate.getFullYear()-n;
    }
    var currentMonthFirstDay = new Date(year, month,1);
    var currentMonthLastDay = new Date(year, month+1, 0);
    startStop.push(oui.getDateStr3(currentMonthFirstDay));
    startStop.push(oui.getDateStr3(currentMonthLastDay));
    return startStop;
  };
  oui.getYearStartAndEnd = function(addYearCount){
    addYearCount = addYearCount||0;
    //起止日期数组
    var startStop = new Array();
    //获取当前时间
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear()+addYearCount;

    //添加至数组
    startStop.push(currentYear+'-01-01');
    startStop.push(currentYear+'-12-31');
    //返回
    return startStop;
  };
  /**
   * 重写window.console 解决 IE 不支持的bug
   */
  (function () {
    if (!window.console) {
      window.console = {};
      if (!window.console.log) {
        window.console.log = function (s) {
        }
      }
    } else {
      if (!window.console.log) {
        window.console.log = function (s) {
        }
      }
    }
  })();


  /**
   * 获取地理定位信息
   * 各个端在运行态会进行覆盖
   * @param callback
   */
  oui.getLocation = function (callback) {
    if (navigator.geolocation) {
      callback && callback();
      // navigator.geolocation.getCurrentPosition(function (position) {
      //     var coords = position.coords;
      //     callback && callback(coords);
      // }, function (e) {
      //     callback && callback();
      // }, {
      //     // 指示浏览器获取高精度的位置，默认为false
      //     enableHighAccuracy: true,
      //     // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
      //     timeout: 5000,
      //     // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
      //     maximumAge: 3000
      // });
    } else {
      oui.alert("您的浏览器暂不支持定位服务!");
    }
  };

  /**
   * 获取对象的长度
   */
  oui.getObjectLength = function (o) {
    var n, count = 0;
    for (n in o) {
      if (o.hasOwnProperty(n) && o[n] != undefined && o[n] != null) {
        count++;
      }
    }
    return count;
  };

  (function (_) {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    _.uuid = function (len, radix) {
      var chars = CHARS, uuid = [], i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    };

    _.uuidFast = function () {
      var chars = CHARS, uuid = new Array(36), rnd = 0, r;
      for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
          uuid[i] = '-';
        } else if (i == 14) {
          uuid[i] = '4';
        } else {
          if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
          r = rnd & 0xf;
          rnd = rnd >> 4;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
      return uuid.join('');
    };


    /**
     * 获取整型uuid
     */
    _.getUUIDLong = function () {
      //18 位防止后台转为long 超过 long 的最大值
      return oui.uuid(18, 10);
    };

    /**
     * 获取字符串类型的uuid
     */
    _.getUUIDString = function () {
      return oui.uuidFast();
    };
  })(oui);


  /**
   * 操作storage
   * @type {{get: oui.storage.get, set: oui.storage.set, remove: oui.storage.remove, clear: oui.storage.clear}}
   */
  oui.storage = {
    get: function (key) {
      return window.localStorage.getItem(key);
    },
    save: function (key, value) {
      window.localStorage.setItem(key, value);
    },
    set: function (key, value) {
      window.localStorage.setItem(key, value);
    },
    remove: function (key) {
      window.localStorage.removeItem(key);
    },
    clear: function () {
      window.localStorage.clear();
    }
  };

  /*** dom元素吸附定位 ****/
  oui.getScroll = function (type) {
    type = type ? 'scrollLeft' : 'scrollTop';
    return document.body[type] | document.documentElement[type];
  };

  oui.winArea = function (type) {
    return document.documentElement[type ? 'clientWidth' : 'clientHeight']
  };

  /** dom元素定位处理 **/
  oui.orien = function (elem, obj, pos) {
    var tops, rect = elem.getBoundingClientRect();
    obj.style.left = rect.left + (pos ? 0 : oui.getScroll(1)) + 'px';
    if (rect.bottom + obj.offsetHeight + 2 <= oui.winArea()) {
      tops = rect.bottom - 1;
    } else {
      tops = rect.top > obj.offsetHeight + 2 ? rect.top - obj.offsetHeight + 1 : oui.winArea() - obj.offsetHeight;
    }
    obj.style.top = Math.max(tops + (pos ? 0 : oui.getScroll() ), 1) + 'px';
  };
  /** 吸附定位  下拉、下拉多选，条件组件  底部隐藏后 浮动显示 */
  oui.flotTop4dropDown = function (elem, obj) {
    var rect = elem.getBoundingClientRect();
    $(obj).removeClass('dropdown-float-top');
    if (rect.bottom + obj.offsetHeight + 2 <= oui.winArea()) {
      //没有超出底部 高度
    } else {
      //超出底部高度
      $(obj).addClass('dropdown-float-top');
    }
  };
  /** 吸附定位  下拉、下拉多选，条件组件  底部隐藏后 浮动显示 */
  oui.follow4fixed = function (elem, obj, isFix) {
    /** 不采用吸附算法 */
    if (!isFix) {
      oui.flotTop4dropDown(elem, obj);
    }
    /**采用 吸附算法 **/
    var width = $(obj).width();
    var height = $(obj).height();
    $(obj).css('position','fixed');
    //obj.style.position = 'fixed';
    //$(obj).css('z-index',500);
    oui.orien(elem, obj, 1);
    $(obj).width(width);
    $(obj).height(height);

  };
  oui.follow4absolute = function (elem, obj) {
    obj.style.position = 'absolute';
    oui.orien(elem, obj);
  };

  /** 触发当前在焦点的元素失去焦点 ***/
  oui.targetElBlur = function () {
    if (oui.os.mobile) {
      var target = document.activeElement;
      if (target) {
        $(target).blur();
      }
    }
  };
  /** 将字节转 MB ****/
  oui.transByte2FileSize = function (bytes) {
    var kb = (bytes / 1024).toFixed(2);
    var mb = (kb / 1024).toFixed(2);
    if (bytes < 1024 || kb < 1024) {
      return kb + 'KB';
    } else {
      return mb + 'MB';
    }
  };
  var OURS_NS = function (name){
    var parts = name.split('.');
    var container = window;
    for(var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!container[part]) container[part] = {};
      container = container[part];
    }
    return container;
  };
  oui._NSIds =[];
  /**命名空间创建 **/
  oui.createNS=function(){
    var uuid = oui.getUUIDString();
    var namespace = OURS_NS('oui_namespace_'+uuid);
    oui._NSIds.push(uuid);
    return namespace;
  };
  /**获取当前命名空间Id ***/
  oui._getNSId = function(){
    if(!oui._NSIds.length){
      return null;
    }else{
      return oui._NSIds[oui._NSIds.length-1];
    }
  };
  /***获取当前命名空间对象 ****/
  oui.getNS = function(){
    var currId = oui._getNSId();
    if(currId == null){
      return window;
    }else {
      return window['oui_namespace_'+currId];
    }
  };

  oui._setNS = function (ns) {
    var currId = oui._getNSId();
    if (currId == null) {
    } else {
      window['oui_namespace_' + currId] = ns;
    }
  };

  /***清空当前命名空间对象 ***/
  oui.clearNS = function(){
    var currId = oui._getNSId();
    if(currId){
      oui._NSIds.splice(oui._NSIds.length-1,1);
      window['oui_namespace_'+currId] =null;
      delete window['oui_namespace_'+currId];
    }
  };
  /** 获取当前页面 容器*****/
  oui.getCurrPageContainer = function () {
    var container= 'body';
    if(oui.getNS() !=window){
      container= oui.getCurrUrlDialog().getEl();
    }
    return container;
  };
  /****获取当前页面所在的dialog对象 ***/
  oui.getCurrUrlDialog = function (isTop) {
    var ouiDialogId = "";
    if(oui.os.mobile){
      ouiDialogId = oui.getParam('ouiDialogId');
      if(ouiDialogId){
        return oui.getTop().oui.getByOuiId(ouiDialogId);
      }else{
        ouiDialogId = oui.getNS()._urlDialogOuiId;
        try{
          return oui.getByOuiId(ouiDialogId);
        }catch (e){
        }
      }
    }else{
      ouiDialogId = oui.getParam('ouiDialogId');
      if(isTop){
        try{
          return oui.getTop().oui.getByOuiId(ouiDialogId);
        }catch (e){
        }
      }else{
        try{
          return window.parent.oui.getByOuiId(ouiDialogId);
        }catch (e){
        }
      }

    }
    return null;
  };
  /**
   * cookie操作接口
   * @param key
   * @param value
   * @param days
   * @param path
   * @returns {null}
   */
  oui.cookie4second = function (key, value, second, path) {
    // var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if (value && value.length > 0) {
      second = second || 2;
      path = path || "/";
      var exp = new Date();
      exp.setTime(exp.getTime() + second * 1000);
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
    }
  };
  /** iframe ready事件绑定 ****/
  oui.bindIframeReady = function(iframe,fun){
    if(!iframe){
      return ;
    }
    if(iframe && ((!iframe.contentWindow) ||(!iframe.contentWindow.document) )){
      if(oui._currIframeTimer){
        window.clearTimeout(oui._currIframeTimer);
        oui._currIframeTimer = null;
      }
      oui._currIframeTimer =window.setTimeout(function(){
        oui.bindIframeReady(iframe,fun);
      },5);
      return ;
    }
    $(iframe.contentWindow).on('load',function(){
      var doc =iframe.contentDocument || iframe.contentWindow.document;
      fun&&fun(doc,iframe.contentWindow,window,iframe);
    });
    oui._currIframeTimer = null;
  };
  /**根据数字返回 26进制字母组 ***/
  oui.getCharCode=function(num){
    var code='';
    var reg = /^\d+$/g;
    if(typeof num !='number'){
      if(!reg.test(num+'')){
        return code;
      }
    }
    while (num>0){
      var m = num % 26;
      if (m==0){
        m = 26;
      }
      code =   String.fromCharCode(64 + parseInt(m)) + code;
      num = ( num - m ) /26;
    }
    return code;
  };
  /** 根据26进制字母组转为数字****/
  oui.getNumByCharCode = function(code){
    var num=-1;
    if(code){
      code = code.toUpperCase();
    }
    var reg = /^[A-Z]+$/g;
    if(!reg.test(code)){
      return num;
    }
    num=0;
    for (var i = code.length - 1, j = 1; i >= 0; i--, j *= 26){
      num +=  (code[i].charCodeAt(0) -64 )* j;
    }
    return num;
  };
  /** 根据自定义条件查询数组中的元素  一个**/
  oui.findOneFromArrayBy = function (arr,fun){
    if((!arr) ||(!arr.length)){
      return null;
    }
    for(var i= 0,len=arr.length;i<len;i++){
      if(fun&&fun(arr[i],i)){
        return arr[i];
      }
    }
    return null;
  };
  /** 根据自定义条件查询数组中的元素 多个 **/
  oui.findManyFromArrayBy = function (arr,fun){
    if((!arr) ||(!arr.length)){
      return null;
    }
    var temp = [];
    for(var i= 0,len=arr.length;i<len;i++){
      if(fun&&fun(arr[i],i)){
        temp.push(arr[i]);
      }
    }
    return temp;
  };
  /** 根据自定义条件查询数组中的元素 多个 **/
  oui.eachArray = function (arr,fun){
    if((!arr) ||(!arr.length)){
      return null;
    }
    if(!fun){
      return;
    }
    for(var i= 0,len=arr.length;i<len;i++){
      var flag = fun(arr[i],i);
      if(typeof flag =='boolean'){
        if(!flag){
          return ;
        }
      }
    }
  };

  /** 显示条件弹框****/
  oui.showConditionDialog = function(cfg,requireBack){
    var showType = cfg.showType ||'2';
    showType = parseInt(showType);
    if([2,5].indexOf(showType)<0){
      showType = 2;
    }
    cfg.showType = showType;
    cfg.type = 'condition';
    oui.requireByTagAndType('oui-condition','condition',function(){
      var obj = oui.getTop().oui.create(cfg);
      obj.init();
      obj.attr('hideButton',true);
      oui.getTop().$('body').append(obj.getHtml());
      obj.attr('callback',function(conditions,control){
        var ouiId = control.attr('ouiId');
        var el = control.getEl();
        cfg.callback&&cfg.callback(conditions,control);
        setTimeout(function(){
          try{
            oui.getTop().oui.clearByContainer(el);
            oui.clearByOuiId(ouiId);
            oui.getTop().$(el).remove();
          }catch(err){}
        },10);
      });
      obj.attr('cancelback',function(conditions,control){
        var ouiId = control.attr('ouiId');
        var el = control.getEl();
        cfg.cancelback&&cfg.cancelback(conditions,control);
        setTimeout(function(){
          try{
            oui.getTop().oui.clearByContainer(el);
            oui.clearByOuiId(ouiId);
            oui.getTop().$(el).remove();
          }catch(err){}
        },10);
      });
      obj.afterRender&&obj.afterRender();
      obj.showGroupConditions();
      requireBack&&requireBack(obj);
    });
  };
  /******
   * 根据 标签  类型，按需加载控件资源并执行回调
   * @param tag
   * @param type
   * @param callback
   * @param error
   */
  oui.requireByTagAndType = function(tag,type,callback,error){
    var Parser = oui.$.Parser;
    var tagEnum = Parser.findTagEnumByTag(tag,type);
    var urls = Parser.getControlUrls(tagEnum);
    if(urls&&urls.length){
      oui.require4notSort(urls,function(){
        callback&&callback();
      },function(e){
        console.log('加载资源异常：'+oui.parseString(urls));
        error&&error(e);
      },(oui_context&&oui_context.debug)?false:true);
    }else{
      callback&&callback();
    }
  };
  /**删除数组中的元素，根据 条件判断（条件是一个函数） ****/
  oui.removeFromArrayBy =function(attrList,fun){
    for(var i=0,flag=true,len=attrList.length;i<len;flag ? i++ : i){
      if(attrList[i]&&fun(attrList[i])){
        attrList.splice(i,1);
        flag = false;
      }else{
        flag = true;
      }
    }
    return attrList;
  };
  /***样式继承 ****/
  oui.styleExtend = function(style1,style2){
    if(style1 && style2){
      var style1Array = style1.split(";");
      var style2Array = style2.split(";");
      var i,len;
      var style1Object = {};
      var style2Object = {};
      var a;
      for (i = 0, len = style1Array.length; i < len; i++) {
        if(style1Array[i] && style1Array[i].indexOf(":") > -1){
          a = style1Array[i].split(":");
          style1Object[a[0]] = a[1];
        }
      }
      for (i = 0, len = style2Array.length; i < len; i++) {
        if(style2Array[i] && style2Array[i].indexOf(":") > -1){
          a = style2Array[i].split(":");
          style2Object[a[0]] = a[1];
        }
      }

      var styleNew = $.extend(true, {}, style1Object, style2Object);
      var styleArray = [];
      for(var key in styleNew){
        styleArray.push(key+":"+styleNew[key]);
      }
      return styleArray.join(";");
    }else if(style1){
      return style1;
    }else if(style2){
      return style2;
    }
    return ""
  };

  oui.startWith = function(input, str){
    if (str === null || str === "" || input.length === 0 || str.length > input.length) {
      return false;
    }
    return input.substr(0, str.length) === str;
  };

  oui.toThousands = function(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  };

  oui.formatNumber = function (formatType, value, dotNum) {
    if (formatType && formatType.length > 0 && (value !== null && typeof value !== 'object' && typeof value !== 'undefined' && value !== '') ) {
      if(!isNaN(value)){
        value = Number(value + "");
        if(formatType === ','){//千分位
          value = oui.toThousands(value)
        }else if(formatType === '%'){//百分数
          var sText = value+"";
          var sArray = [];
          var _dotNum = 0;
          if(sText.indexOf(".") > 0){
            sArray = sText.split(".");
            _dotNum = sArray[1].length - 2;
            if(_dotNum <= 0){
              _dotNum = 0;
            }
          }
          if (dotNum !== null && typeof dotNum !== 'undefined' && dotNum !== '' && dotNum !== '-1') {
            _dotNum = Number(dotNum);
          }
          value = (value * 100).toFixed(_dotNum) + "%";
        }
      }
    }else{
      if (dotNum !== null && typeof dotNum !== 'undefined' && dotNum !== '' && dotNum+'' !== '-1' && (value !== null && typeof value !== 'object' && typeof value !== 'undefined' && value !== '')) {
        value = value.toFixed(Number(dotNum));
      }
    }
    return value;
  };
  /*** 弹出显示webIM
   * userId,//用户登陆id或者临时uuid
   * title,//自定义聊天title
   * webSocketUrl,//支持自定义websocket路径
   * ****/
  oui.showWebIm = function(cfg){
    var userId = cfg.userId ||oui.getUUIDString();
    var url = oui.getContextPath()+'res_common/oui/ui/ui_common/controls/webim/webim.html';
    url = oui.setParam(url,'userId',userId);
    var win = oui.openWindow({
      url:url,
      openType:'_blank',
      title:cfg.title||"客服为你服务中"
    });
    var socketUrl = cfg.webSocketUrl+'/'+userId;
    win.websocketUrl = socketUrl;
  };
  /** 根据OuiSelectPersonVO列表创建流程实例
   * {type,list,start}
   * ***/
  oui.createWorkFlow = function(cfg){
    var process = {};
    var startArr = oui.createArrayNodesByPersonSelectedNodes([cfg.start]);
    var startNode = startArr[0];
    startNode.nodeRight = oui.WorkFlowNodeRight.cancel.name ;// 发起人默认权限允许撤回流程
    startNode.parentId = null;//第一个节点没有父节点 必须制定为null,因为后端会根据这个属性取开始节点
    var nodes =  oui.createArrayNodesByPersonSelectedNodes(cfg.list||[]);
    if(nodes&&(nodes.length ==1)){ //如果只有一个节点的情况，只能为串发
      cfg.type = oui.SelectPerson_ADD_TYPE.serial;
    }
    var type = cfg.type;
    if(typeof type=='undefined'){
      type = oui.SelectPerson_ADD_TYPE.serial; //默认串发
    }
    var workFlowNodeList = oui.createWorkFlowNodeListByType(startNode,nodes,type);
    process.workFlowNodeList = workFlowNodeList;
    var startName = startNode.nodeName;
    var names= [];
    names.push(startName);
    for(var i= 0,len=nodes.length;i<len;i++){
      names.push(nodes[i].nodeName);
    }
    process.workFlowNodeNames = names.join(',');
    return process;
  };

  /* 选人结果类型,并发，串发***/
  oui.SelectPerson_ADD_TYPE ={
    concurrency: 0, //并发
    serial: 1 //串发
  };
  /** 根据开始节点，节点列表，类型 返回 workFlowNodeList***/
  oui.createWorkFlowNodeListByType=function(startNode,nodes,type){
    var arr = [];
    var isSerial = false;
    if((type+"") == (oui.SelectPerson_ADD_TYPE.serial+"")){
      isSerial = true;
    }
    arr.push(startNode);
    /** 创建结束节点***/
    var endNode ={
      "id":oui.getUUIDLong(),
      "nodeType":"end",
      "parentId":[
      ],
      "isEnd":true
    };
    if(nodes&&nodes.length){
      //串发
      if(isSerial){
        nodes[0].parentId.push(startNode.id);
        arr.push(nodes[0]);
        for(var i= 1,len=nodes.length;i<len;i++){
          nodes[i].parentId.push(nodes[i-1].id);
          arr.push(nodes[i]);
        }
        endNode.parentId.push(nodes[nodes.length-1].id);
        arr.push(endNode);
      }else{//并发
        //split节点
        var splitNode = {
          "id":oui.getUUIDLong(),
          "name":"",
          "isSplit":true,
          "nodeType":"split",
          "parentId":[
            startNode.id
          ]
        };
        arr.push(splitNode);
        var nodeIds = [];
        for(var i= 0,len=nodes.length;i<len;i++){
          nodes[i].parentId.push(splitNode.id);
          nodeIds.push(nodes[i].id);
          arr.push(nodes[i]);
        }
        var joinNode =  {
          "id":oui.getUUIDLong(),
          "name":"",
          "isJoin":true,
          "nodeType":"join",
          "parentId":nodeIds
        };
        arr.push(joinNode);
        endNode.parentId.push(joinNode.id);
        arr.push(endNode);
      }
    }else{
      endNode.parentId.push(startNode.id);
      arr.push(endNode);
    }
    return arr;
  };
  /** 根据选人列表获取节点列表****/
  oui.createArrayNodesByPersonSelectedNodes = function(persons){
    if(!persons){
      return [];
    }
    var nodes = [];
    for (var i = 0, len = persons.length; i < len; i++) { //根据选择的人员、部门、角色等创建节点数据
      nodes.push({
        id:oui.getUUIDLong(),
        parentId:[],
        nodeId: persons[i].id,
        nodeName:persons[i].name,
        nodeRight:oui.findNodeRightValue({}),
        nodeDisplayName:persons[i].name,
        name: persons[i].name,
        chooseType:oui.getDefaultChooseTypeByNodeType(persons[i].id,persons[i].typeFlag),
        nodeType: persons[i].typeFlag
      });
    }
    return nodes;
  };
  /** 获取节点默认权限***/
  oui.findNodeRightValue=function(node){
    if(node&&node.nodeRight){
      return node.nodeRight;
    }else{
      return [oui.WorkFlowNodeRight.addNodes.name,oui.WorkFlowNodeRight.rollBack.name,oui.WorkFlowNodeRight.stop.name,oui.WorkFlowNodeRight.notify.name].join(',')
    }
  };
  /** 流程节点权限配置*****/
  oui.WorkFlowNodeRight = {
    addNodes:{
      name:'addNodes',
      value:11,
      desc:"加签"
    },
    rollBack:{
      name:'rollBack',
      value:9,
      desc:"回退"
    },
    stop:{
      name:'stop',
      value:6,
      desc:"终止"
    },
    notify:{
      name:'notify',
      value:18,
      desc:"知会"
    },
    cancel:{
      name:'cancel',
      value:5,
      desc:"允许发起人撤销已发流程"
    }
  };
  /**
   * 根据节点id和节点类型获取默认的执行模式
   * @param typeFlag
   */
  oui.getDefaultChooseTypeByNodeType = function(nodeId,nodeType){
    /**相对角色发送者，单人 默认执行模式为单人;否则为 多人执行模式*/
    if(nodeType == oui.WorkFlowNodeType.person.value || nodeId =='relRole_sender' || (nodeId.indexOf('member#')>-1 || nodeId.indexOf('deptLeader#')>-1)){
      return oui.WorkFlowChooseType.single.value;
    }
    return oui.WorkFlowChooseType.all.value;
  };
  /** 流程节点执行模式***/
  oui.WorkFlowChooseType ={
    single:{
      value:1,
      desc:"单人执行"
    },
    multi:{
      value:2,
      desc:"多人执行"
    },
    all:{
      value:3,
      desc:"全体执行"
    },
    competition:{
      value:4,
      desc:"竞争执行"
    }
  };
  /** 选人节点类型****/
  oui.WorkFlowNodeType={
    all:{
      value:'all',
      desc:'全体人员'
    },
    person:{
      value:'person',
      desc:'人员'
    },
    department:{
      value:'department',
      desc:'部门'
    },
    company:{
      value:'company',
      desc:'单位'
    },
    group:{
      value:'group',
      desc:'集团'
    },
    level:{
      value:'level',
      desc:'职位级别'
    },
    post:{
      value:'post',
      desc:'岗位'
    },
    role:{
      value:'role',
      desc:'角色'
    },
    relativeRole:{
      value:'relativeRole',
      desc:'相对角色'
    },
    team:{
      value:'team',
      desc:'组'
    },
    formControl:{
      value:"formControl",
      desc:"表单控件",
      manyPeople:true
    }
  };
  /*** 签章适配器****/
  oui.pluginAdapter = oui.pluginAdapter ||{};
  oui.createPlugin = function(pluginName){
    if(!oui.pluginAdapter[pluginName]){
      oui.pluginAdapter[pluginName] = {};
    }
    return oui.pluginAdapter[pluginName];
  };
  oui.hasRequireRenderEngine = function(pluginName,renderType){
    var plugin = oui.createPlugin(pluginName);
    var renderEngine = plugin[renderType];
    if(renderEngine&& renderEngine.hasRequire){
      return renderEngine.hasRequire();
    }else{
      throw new Error('渲染引擎 '+pluginName+'.Adapter.'+renderType+'没有实现hasRequire方法 ');
    }
  };
  oui.getRenderEngine = function(pluginName,renderType){
    var plugin = oui.createPlugin(pluginName);
    return plugin[renderType]||null;
  };
  /** 加载渲染引擎对应的资源****/
  oui.requireRenderEngine = function(pluginName,renderType,callback,isTop){

    var plugin = oui.createPlugin(pluginName);
    var renderEngine =plugin[renderType];
    //先判断当前渲染引擎是否存在，如果不存在 则进行按需加载 渲染引擎的适配器 api，再执行渲染引擎的资源按需加载
    //渲染引擎适配器路径 为 signature-{{renderType}}.js,
    if(!renderEngine){
      var renderEngineUrl = oui.getContextPath()+'res_common/oui/ui/ui_common/adapter/'+pluginName+'/'+renderType+'-api.js';
      oui.require([renderEngineUrl],function(){
        renderEngine = plugin[renderType];
        if(!oui.hasRequireRenderEngine(pluginName,renderType)){
          var requirePaths = renderEngine.findRequirePaths();
          if(requirePaths&&requirePaths.length){
            var requireArea = oui;
            if(isTop){
              requireArea = oui.getTop().oui;
            }
            requireArea.require(requirePaths,function(){
              callback&&callback();
            },function(){
              oui.getTop().oui.alert('渲染引擎 oui.pluginAdapter.'+pluginName+'.'+renderType+'加载配置资源失败'+oui.parseString(requirePaths));
            });
          }else{
            oui.getTop().oui.alert('渲染引擎 oui.pluginAdapter.'+pluginName+'.'+renderType+'配置资源路径不能为空 ');
            throw new Error('渲染引擎 oui.pluginAdapter.'+pluginName+'.'+renderType+'没有配置资源路径requirePaths ');
          }
        }else{
          callback&&callback();
        }
      },function(){
        oui.getTop().oui.alert('加载渲染适配器路径失败:'+renderEngineUrl+'');
      });
    }else{
      if(!oui.hasRequireRenderEngine(pluginName,renderType)){
        var requirePaths = renderEngine.findRequirePaths();
        if(requirePaths&&requirePaths.length){
          var requireArea = oui;
          if(isTop){
            requireArea = oui.getTop().oui;
          }
          requireArea.require(requirePaths,function(){
            callback&&callback();
          },function(){
            oui.getTop().oui.alert('渲染引擎 oui.pluginAdapter.'+pluginName+'.'+renderType+'加载配置资源失败'+oui.parseString(requirePaths));
          });
        }else{
          oui.getTop().oui.alert('渲染引擎 oui.pluginAdapter.'+pluginName+'.'+renderType+'配置资源路径不能为空 ');
          throw new Error('渲染引擎 oui.pluginAdapter.'+pluginName+'.'+renderType+'没有配置资源路径requirePaths ');
        }
      }else{
        callback&&callback();
      }
    }
  };
  /** 显示签章组件****/
  oui.showSignature = function(cfg){

    var renderType = cfg.renderType ||'jSignature';
    oui.requireRenderEngine('signature',renderType,function(){
      var renderEngine = oui.getRenderEngine('signature',renderType);
      var id = oui.getUUIDLong();
      var width = cfg.width ||'100%';
      var height = cfg.height ||'100%';
      var title = cfg.title ||"";
      var html = '<div id="'+id+'" style="width:'+width+';height:'+height+';"></div>';
      var confirm = cfg.confirm;
      var cancel = cfg.cancel;
      var reset = cfg.reset;
      var actions = [];
      var dialog =  null;
      var confirmAction = {
        cls:'oui-dialog-ok',
        text:'确定',
        action:function(){
          if(dialog){
            var data  =renderEngine.confirm($(dialog.getEl()).find('#'+dialog.attr('signatureId'))[0]);
            renderEngine.destroy($(dialog.getEl()).find('#'+dialog.attr('signatureId'))[0]);
            confirm&&confirm(data);
            dialog&&dialog.hide();
          }
        }
      };
      var cancelAction = {
        cls:'oui-dialog-cancel',
        text:'取消',
        action:function(){
          renderEngine.destroy($(dialog.getEl()).find('#'+dialog.attr('signatureId'))[0]);
          cancel&&cancel();
          dialog&&dialog.hide();
        }
      };
      var resetAction = {
        cls:'oui-dialog-cancel',
        text:'重置',
        action:function(){
          reset&&reset();
          if(dialog){
            renderEngine.reset($(dialog.getEl()).find('#'+dialog.attr('signatureId'))[0]);
          }
        }
      };
      if(oui.os.mobile){
        actions.push(cancelAction);
        actions.push(resetAction);
        actions.push(confirmAction);
      }else{
        actions.push(confirmAction);
        actions.push(cancelAction);
        actions.push(resetAction);
      }
      var dialog = oui.getTop().oui.showHTMLDialog({
        signatureId:id,
        callback:function(action){
          if(action =='close'){
            renderEngine.destroy($(dialog.getEl()).find('#'+dialog.attr('signatureId'))[0]);
          }
        },
        title:title,
        contentStyle: ('width:690px;'),
        content:html,
        center: false,
        actions:actions
      });
      renderEngine.render($(dialog.getEl()).find('#'+id)[0],{
        width:width,
        height:height,
        color:cfg.color||"red",
        lineHeight:cfg.lineHeight||10
      });
    },true);

  };
  /** 显示页面设计器
   oui.showPageDesign({
    //必须参数
controls:cfg.controls||[],//已有的控件列表
    canCloneControl:false,
    mainTemplate:cfg.mainTemplate||'',//页面的业务属性面板模板获取方法
    bizJs:cfg.bizJs||[],
    saveCallBack:cfg.saveCallBack||'',
    //非必须参数
    viewType:cfg.viewType ||'openWindow',
    buttons:cfg.buttons||"", //按钮参数,如save,print 等按钮事件名
    useControls:cfg.useControls,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件未全控件列表
    page:cfg.page,//页面设计对象，如果是打印则是打印模板设计对象
    scriptPkg:cfg.scriptPkg||"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
    bizCss:cfg.bizCss||[],
    //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
    params:cfg.params||{}
});
   ****/
  oui.showPageDesign = function(cfg){
    console.info(cfg,'ccfgjjklkklj')
    cfg = cfg||{};
    var url = oui.getContextPath()+'res_engine/page_design/pc/page-design.html';
    url = oui.addOuiParams4Url(url);
    url = oui.setParam(url,'_t',new Date().getTime());
    var params = {
      designTplUrl:cfg.designTplUrl||'',
      uploadUrl:oui.uploadURL,//跨静态页面传值，用于上传组件
      /**必须参数*/
      controls:cfg.controls||[],//已有的控件列表
      mainTemplate:cfg.mainTemplate||'',//页面的业务属性面板模板获取方法
      bizJs:cfg.bizJs||[],
      saveCallBack:cfg.saveCallBack||'',
      /**非必须参数*/
      viewType:cfg.viewType ||'openWindow',
      buttons:cfg.buttons||"", //按钮参数,如save,print 等按钮事件名
      useControls:cfg.useControls,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件未全控件列表
      page:cfg.page,//页面设计对象，如果是打印则是打印模板设计对象
      scriptPkg:cfg.scriptPkg||"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
      bizCss:cfg.bizCss||[],
      canCloneControl:cfg.canCloneControl,//是否可以复制控件
      //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
      params:cfg.params||{}
    };
    cfg.viewType = cfg.viewType ||'openWindow'; //新窗口打开
 

    if(cfg.viewType =='openWindow'){
      var win = oui.openWindow({
        url:url,
        windowParams:oui.parseString(params),
        title:cfg.title||'页面设计器'
      });
      return win;
    }else if(cfg.viewType =='urlDialog'){//url dialog
      var dialog = oui.getTop().oui.showUrlDialog({
        url: url,
        isHideHeader: true,
        isHideFooter: true,
        isShowClose: true,
        isClose: true,
        params:oui.parseString(params)
      });
      return dialog;
    }else{
      oui.getTop().oui.alert('viewType 只支持 openWindow,urlDialog');
    }
  };

  /** 流程图显示，并进行设计流程图
   * flowId,moduleId,design4Runtime,workflowJSON,confirm,cancel
   * **/
  oui.showProcessGraph = function(cfg){
    var url = oui.getContextPath()+'workflow/workflowTemplate.do?method=showProcessGraph';
    url = oui.setParam(url,'hideSaveButton',true);//隐藏按钮
    if(cfg.flowId){
      url = oui.setParam(url,'flowId',cfg.flowId);
    }
    if(cfg.moduleId){
      url = oui.setParam(url,'moduleId',cfg.moduleId);
    }
    if(cfg.design4Runtime){
      url = oui.setParam(url,'design4Runtime',cfg.design4Runtime);
    }
    var actions = [{text:"确定",
      id:"confirm-ok",
      cls:'oui-dialog-ok',
      action: function(){

        var data = dialog.getWindow().oui.flow.FlowBiz.getFlowData();
        if(cfg.confirm){
          var flag = cfg.confirm(data);
          if(typeof flag =='boolean'){
            if(!flag){
              return ;
            }
          }
        }
        dialog.hide();
        return false;
      }
    }, {
      text: "取消",
      cls:  "oui-dialog-cancel",
      action: function () {
        // BizForm.releaseSaveLabel();
        if(cfg.cancel){
          var flag = cfg.cancel();
          if(typeof flag =='boolean'){
            if(!flag){
              return ;
            }
          }
        }
        dialog.hide();
        return false;
      }
    }];
    var mobileActions = [];
    if(oui.os.mobile){
      actions = mobileActions = [actions[1],actions[0]];
    }
    var dialog = oui.getTop().oui.showUrlDialog({
      url: url,
      isHideHeader: true,
      isHideFooter: false,
      isShowClose: true,
      isClose: true,
      useIFrame:true,
      workflowJSON:cfg.workflowJSON||"",
      actions:actions
    });
  };
  (function(){
    /**
     * 事件机制
     * @type {{events: {}, on: _OuiEvent.on, trigger: _OuiEvent.trigger, off: _OuiEvent.off}}
     */
    var _OuiEvent = {
      //事件缓存对象
      events: {},
      /**
       * 绑定事件方法
       * @param eventName 事件名称
       * @param evenFunc 事件具体函数
       */
      on: function (eventName, evenFunc) {
        if (evenFunc && (typeof evenFunc == 'function')) {
          if (!_OuiEvent.events[eventName]) {
            _OuiEvent.events[eventName] = [];
          }
          evenFunc.isOnce = false;
          _OuiEvent.events[eventName].push(evenFunc);
        }
      },
      once: function(eventName, evenFunc){
        if (evenFunc && (typeof evenFunc == 'function')) {
          if (!_OuiEvent.events[eventName]) {
            _OuiEvent.events[eventName] = [];
          }
          evenFunc.isOnce = true;
          _OuiEvent.events[eventName].push(evenFunc);
        }
      },
      /**
       * 触发事件方法
       * @param eventName 事件名称
       */
      trigger: function (eventName) {
        var args = arguments;
        if (args.length >= 1) {
          if (args.length > 1) {
            args = [].prototype.slice.call(args);
            args = args.slice(1, args.length);
          }
          var events = _OuiEvent.events[eventName];
          if (events && events.length > 0) {
            var deleteArray = [];
            for (var i = 0, len = events.length; i < len; i++) {
              var eventFunc = events[i];
              if (eventFunc && (typeof eventFunc == 'function')) {
                eventFunc.apply(eventFunc, args);
                _OuiEvent.events[eventName][i] = null;
                delete _OuiEvent.events[eventName][i];
              }
            }
          }
        }
      },
      /**
       * 解除事件绑定
       * @param eventName 事件方法
       * @param eventFunc 具体事件，如果不传则取消所有相同事件名的事件
       */
      off: function (eventName, eventFunc) {
        if (_OuiEvent.events[eventName]) {
          var events = _OuiEvent.events[eventName];
          if (eventFunc) {
            var eventFuncIndex = -1;
            for (var i = 0, len = events.length; i < len; i++) {
              if (events[i] == eventFunc) {
                eventFuncIndex = i;
                break;
              }
            }
            if (eventFuncIndex > -1) {
              events.splice(eventFuncIndex, 1);
            }
            _OuiEvent.events[eventName] = events;
          } else {
            _OuiEvent.events[eventName] = [];
          }
        }
      }
    };

    //获取当前页面的event对象
    oui.getEvent = function(_ns){
      var NS =  _ns || oui.getNS();
      if(NS._event__){
        return NS._event__;
      } else {
        NS._event__ = _OuiEvent;
        return NS._event__;
      }
    };
  })();
  /**
   * 根据配置创建一个table对象
   * @param cfg
   * @param callback
   * @returns {cfg}
   */
  oui.createTable = function (cfg, callback) {
    if (!oui.$.ctrl["tablegrid"]) {
      var Parser = oui.$.Parser;
      var arr = Parser.getControlUrls(Parser.tagMap['oui-table']);
      oui.require4notSort(arr,
        function () {
          oui.createTable(cfg, callback);
        });
      return;
    }
    cfg = $.extend(true, {}, cfg, {
      type: "tablegrid",
      id: oui.getUUIDLong(),
      success: null
    });
    var table = oui.create(cfg);
    table.init();
    if (cfg.container) {
      oui.getNS().$(cfg.container).html(table.getHtml());
      table.render();
    }
    callback && callback(table);
    return table;
  };
  oui.bindTimer = function(fun,callback,time){
    if(!fun){
      return ;
    }
    var timer =  setTimeout(function(){
      if(!fun()){
        fun.timer = oui.bindTimer(fun,callback,time);
      }else{
        callback&&callback();
      }
    },time||500);
    fun.timer = timer;
  };
  oui.bindButtonEvents = function(selecter,fun,time){
    var clickName = 'click';
    if(oui.os.mobile){
      clickName = 'tap';
    }
    $(document).on(clickName,selecter||'.submit-button' ,function(e){
      var me = this;
      me.disabled = 'disabled';
      $(me).addClass('submit-button-disabled');
      oui.bindTimer(function(){
        if(fun){
          return fun();
        }
        return true;
      },function(){
        $(me).removeAttr('disabled');
        $(me).removeClass('submit-button-disabled');

      },time || 2000);
    });
  };
  /** 前端 数字控件 ，截取 数字精度，无需四舍五入*****/
  oui.fixedNumber = function(number,n){
    if (n > 20 || n < 0) {
      return number;
    }
    if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
      return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');
    // 整数的情况
    if (arr.length < 2) {
      result += '.';
      for (var i = 0; i < n; i += 1) {
        result += '0';
      }
      return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
      return result;
    }
    if (decimal.length < n) {
      for (var i = 0; i < n - decimal.length; i += 1) {
        result += '0';
      }
      return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    return result;
  };
  oui.parseDate2String = function(ymd, hms, format){
    ymd = ymd.concat(hms);
    format = format || 'YYYY-MM-DD hh:mm:ss';
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index){
      ymd.index = ++ymd.index|0;
      var num = ymd[ymd.index];
      return num < 10 ? '0' + (num|0) : num;
    });
  };
  /***
   * 数据库构造
   * @param buildOptions
   * @returns {{}}
   */
  oui.buildDB = function(buildOptions,callback){
    var dbObject = {};
    dbObject.init = function(params){
      this.dbName = params.dbName;
      this.dbVersion = params.dbVersion;
      this.dbStores = params.dbStores||{"default":{name:"default"}};
      if (!window.indexedDB)
      {
        window.alert("你的浏览器不支持IndexDB,请更换浏览器");
      }

      var request = indexedDB.open(this.dbName,this.dbVersion);
      //打开数据失败
      request.onerror = function(event)
      {
        alert("不能打开数据库,错误代码: " + event.target.errorCode);
      };
      request.onupgradeneeded = function(event)
      {
        //数据库升级时处理索引

        dbObject.db = event.target.result;
        //数据库升级了需要同步更新所有表
        dbObject.initBase(true);
        callback&&callback();
      };
      //打开数据库
      request.onsuccess = function(event)
      {
        //此处采用异步通知. 在使用curd的时候请通过事件触发
        dbObject.db = event.target.result;
        dbObject.buildTableMethods();
        dbObject.initBase();
        callback&&callback();
      };
    };
    dbObject.initBase = function(upgrad){
      //数据库升级了需要同步更新所有表
      var dbStores = this.dbStores||{};
      for(var k in dbStores){

        var name = dbStores[k].name;

        var hasFlag = false;
        if(!upgrad){
          if(this.db.objectStoreNames.contains(name)){
            hasFlag = true;
          }
        }
        if(upgrad){
          if(!this.db.objectStoreNames.contains(name)){
            var store= this.db.createObjectStore(name); //创建存储
            var indexs =dbStores[k].indexs;
            //创建索引
            if(indexs){
              for(var indexKey in indexs){
                var temp = indexs[indexKey];
                store.createIndex(temp.key,temp.keyPaths,temp.options); //创建索引
              }
            }
          }
        }else{
          if(!hasFlag){ //需要升级数据库
            //this.db.close(); //关闭数据库
          }
        }

      }

    };
    dbObject.Collection = function(cfg){
      for(var k in cfg){
        this[k] = cfg[k];
      }
    };
    dbObject.Collection.prototype ={ //集合的api固定 三个参数
      db:dbObject,
      saveOrUpdate:function put(params,success,error){
        this.db.put(this.name,params,success,error);
      },
      removeOne:function remove(params,success,error){
        var id =params;

        if(typeof params =='object'){
          id = params.id;
        }
        this.db.remove(this.name,id,success,error);
      },
      selectOne:function select(params,success,error){
        var id =params;

        if(typeof params =='object'){
          id = params.id;
        }
        this.db.select(this.name,id,success,error);
      },
      //查询多个
      query:function query(condition,success,error){
        //根据条件查询
        this.db.query(this.name,condition,success,error);
      },
      //根据条件保存多个
      updateBy: function updateBy(params,success,error){
        //根据条件把当前实体的属性更新到数据库表
        var me = this;
        var entity = params.entity;
        var condition = params.condition;

        //TODO 更新多个
        this.db.query(this.name,condition,function(result){
          for(var i= 0,len=result.length;i<len;i++){
            var temp = result[i];
            for(var k in entity){
              temp[k]=entity[k];
            }
            me.saveOrUpdate(temp,success,error);
          }
        },error);
      },
      //根据条件删除
      removeBy:function removeBy(condition,success,error){
        var me = this;
        //TODO 删除多个(批量删除)
        this.db.query(this.name,condition,function(result){
          for(var i= 0,len=result.length;i<len;i++){
            var temp = result[i];
            me.removeOne(temp.id,success,error);
          }
        },error);
      },
      removeAll:function(params,success,error){//清空表
        if(!oui.isEmptyObject(params)){//根据条件删除
          this.removeBy(params,success,error);
        }else{
          this.db.clear(this.name,success,error);
        }
      }
    };
    //构造集合增删改查操作
    dbObject.buildTableMethods = function buildTableMethods(){
      var dbStores = this.dbStores||{};
      var Collection= dbObject.Collection; //创建集合
      for(var k in dbStores){
        this[k] = new Collection(dbStores[k]);
      }
    };
    /**
     * 增加和编辑操作
     */
    dbObject.put = function(tableName,params,success,error)
    {
      //此处须显式声明事物
      var transaction = dbObject.db.transaction(tableName, "readwrite");
      var store = transaction.objectStore(tableName);
      if(!params.id){//根据当前时间创建id
        var currTime = new Date().getTime();
        var num = parseInt(oui.uuid(3,10)); //三位数1000毫秒以内
        currTime = currTime+""+num;
        params.id=currTime;
      }
      var request = store.put(params,params.id);
      request.onsuccess = function(){
        success&&success(params);
      };
      request.onerror = function(event){
        console.log(event);
        error&&error(event,params);
      }
    };
    /**
     * 删除数据
     */
    dbObject.remove = function(tableName,id,success,error)
    {
      // dbObject.db.transaction.objectStore is not a function
      var request = dbObject.db.transaction(tableName, "readwrite").objectStore(tableName).delete(id);
      request.onsuccess = function(){
        success&&success(tableName,id);
      };
      request.onerror = function(e){
        error&&error(e,tableName,id);
      }
    };

    /**
     * 查询操作
     */
    dbObject.select = function(tableName,id,success,error)
    {
      //第二个参数可以省略
      var transaction = dbObject.db.transaction(tableName,"readwrite");
      var store = transaction.objectStore(tableName);
      var request = null;
      if(id){
        request = store.get(id); //查询单条
      }else{
        request = store.getAll();//查询所有
      }

      request.onsuccess = function () {
        success&&success(request.result,tableName,id);
        console.log(request.result);
      };
      request.onerror = function (e) {
        error&&error(e,tableName,id);
        console.log(e);
      };
    };
    dbObject.query = function(tableName,condition,success,error){
      var tx = dbObject.db.transaction(tableName,"readwrite");
      var store = tx.objectStore(tableName);
      var c =store.openCursor();//打开游标
      var arr = [];
      c.onsuccess = function(e) {//成功执行回调
        var cursor = e.target.result;
        if (cursor){//如果存在
          console.log(cursor);
          console.log(cursor.key);//key是表的主键
          var flag = true;
          var isBreakCursor = false;
          var conditionResult= null;
          if(typeof condition =='function'){ //自定义函数作为查询条件
            conditionResult = condition(cursor.value,cursor);
            if(typeof conditionResult =='undefined'){ //undefined 默认为true
              flag = true;
            }else{//根据返回值，判断
              if(!conditionResult){
                flag = false;
              }else{ //判断是否为对象
                if(typeof conditionResult =='object'){
                  if(conditionResult.exclude){ //剔除结果
                    flag =false;
                  }
                  if(conditionResult.breakCursor){//退出游标查询
                    isBreakCursor = true;
                  }

                }
              }
            }
          }else if(typeof condition =='object'){ //根据对象条件查询
            //TODO 根据条件语法 查询
            //默认对象相等查询
            for(var k in condition){
              if(cursor.value){
                var v = condition[k];
                if(typeof v =='function'){
                  //方法判断处理
                  conditionResult = v(cursor.value,cursor);
                  if(typeof conditionResult =='undefined'){ //undefined 默认为true
                    flag = true;
                  }else{//根据返回值，判断
                    if(!conditionResult){
                      flag = false;
                    }else{ //判断是否为对象
                      if(typeof conditionResult =='object'){
                        if(conditionResult.exclude){ //剔除结果
                          flag =false;
                        }
                        if(conditionResult.breakCursor){//退出游标查询
                          isBreakCursor = true;
                        }
                      }
                    }
                  }
                }else if(typeof v =='object'){ //对象相等判断
                  if(oui.parseString(v) != oui.parseString(cursor.value[k])){
                    flag = false;
                  }
                }else{ //值相等判断
                  if(cursor.value[k]!=condition[k]){
                    flag = false;
                  }
                }
                if(!flag){
                  break;
                }
              }
            }

          }
          if(flag){
            arr.push(cursor.value);
          }
          if(!isBreakCursor){//没有退出游标则继续查询
            cursor.continue();//继续下一个
          }else{
            //执行结束
            success&&success(arr,tableName,condition);//成功回调
          }
        }else{//查询结束
          success&&success(arr,tableName,condition);//成功回调
        }
      };
      c.onerror = function(e) {//成功执行回调
        error&&error(e,tableName,condition);
      };
    };
    /**
     * 清除整个对象存储(表)
     */
    dbObject.clear = function(tableName,success,error)
    {
      var request = dbObject.db.transaction(tableName,"readwrite").objectStore(tableName).clear();
      request.onsuccess = function(){
        success&&success(tableName);
      };
      request.onerror = function(){
        error&&error(tableName);
      };
    };
    //默认初始化数据库
    dbObject.init(buildOptions);
    return dbObject;
  };
  /**加载api配置 **/
  oui.loadApiConfig =function(url,ns,callback){
    var me = this;
    oui.loadUrl({
      url: url,
      subContentType:2, //取整个json内容
      callback:function(json){
        var config = oui.util.eval(json);//获取配置对象
        var temp= oui.ns(ns);
        temp.apiConfig = config;
        if(config.useLocalDB && config.dbConfigPath){//使用本地数据库, 并且要进行数据库配置
          me.buildLocalApi(ns);
          //加载数据库配置，并 初始化数据库配置
          me.loadDBConfig(config.dbConfigPath,ns,function(){
            //加载完db配置之后， 扩展构建api方法
            callback&&callback(config);
          });
        }else{//api是调用后台服务
          me.buildServerApi(ns);
          callback&&callback(config);
        }
      }
    });

  };
  //构造本地api调用
  oui.buildLocalApi = function(ns){
    oui.ns(ns).api = function(name,param,success,error){
      var path = this.apiConfig.api4LocalDB[name];
      this.api.run(path,param,success,error);
    };
    oui.ns(ns).api.run = function(path,param,success,error){
      if(path){
        var storePath= path.substring(0,path.lastIndexOf('.'));
        var method = path.substring(path.lastIndexOf('.')+1);
        var store = oui.util.eval(storePath);
        store[method](param,function(res){ //回调返回
          success&&success({
            success:true,
            data:res
          });
          if(NProgress){
            NProgress.done();
          }
        },function(){
          error&&error();
          if(NProgress){
            NProgress.done();
          }
        }); //固定三个参数
      }
    };
  };
  //构造 远程api调用
  oui.buildServerApi =function(ns){
    //根据命名处理
    oui.ns(ns).api = function(name,param,success,error){
      var path = this.apiConfig.api[name]||"";
      this.api.run(path,param,success,error);
    };
    //运行任意url
    oui.ns(ns).api.run = function(path,param,success,error){
      if(path){
        oui.postData(path,param,success,error);
      }
    };
  };
  /**加载数据库配置 **/
  oui.loadDBConfig = function(url,ns,callback){
    oui.loadUrl({
      url: url,
      subContentType:2, //取整个json内容
      callback:function(json){
        var config = oui.util.eval(json);//获取配置对象
        oui.ns(ns).db = oui.buildDB(config ,callback);
      }
    });
  };
  //创建 全局数据库 indexedDB操作
  (function(){
    oui.db = oui.buildDB({
      dbName:'oui_db',
      dbVersion:2,//数据库版本升级,只能是数字，只能增不能减
      dbStores:{
        sys_menu:{
          name:'sys_menu',
          indexs:{//索引配置
            'pk_id':{
              key:'id',
              keyPaths:['id'],
              options:{
                unique:true
              }
            }
          }
        },
        sys_config:{
          name:'sys_config',
          indexs:{//索引配置
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
    }); //数据库操作
  })();
  /**
   *  获取当前时间
   */
  oui.getCurrTime = function (timestamp,format) {
    var d = new Date((timestamp|0) ? function(tamp){
      return tamp < 86400000 ? (+new Date() + tamp*86400000) : tamp;
    }(parseInt(timestamp)) : +new Date());
    return oui.parseDate2String(
      [d.getFullYear(), d.getMonth()+1, d.getDate()],
      [d.getHours(), d.getMinutes(), d.getSeconds()],
      format
    );
  };

  oui.saveImage = function (dom, fileName, cfg,callback) {
    cfg = cfg || {};
    cfg = $.extend(true, {
      width: "auto",
      height: "auto",
      quality: 1,
      imageType: "png",
      filter: function () {
      }
    },cfg);
    if(cfg.imageType.toLowerCase() === 'jpg'){
      cfg.imageType = "jpeg";
    }
    var imageType = cfg.imageType || "png";
    var saveImg = function(callbackFun){
      if (typeof dom === 'string') {
        dom = document.querySelector(dom);
      }
      // edge
      html2canvas(dom, {
        logging:false,
        useCORS: true,
        ignoreElements:cfg.filter
      }).then(function (canvas) {
        try {
          var context = canvas.getContext('2d');
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          var imgData = null;
          if (cfg.width !== "auto" || cfg.height !== "auto") {
            var TCanvas = document.createElement("canvas");
            var txc = TCanvas.getContext("2d");
            // 【重要】关闭抗锯齿
            txc.mozImageSmoothingEnabled = false;
            txc.webkitImageSmoothingEnabled = false;
            txc.msImageSmoothingEnabled = false;
            txc.imageSmoothingEnabled = false;
            if (cfg.width !== "auto") {
              TCanvas.width = cfg.width;
            } else {
              TCanvas.width = canvas.width;
            }
            if (cfg.height !== "auto") {
              TCanvas.height = cfg.height;
            } else {
              TCanvas.height = canvas.height;
            }
            txc.drawImage(canvas, 0, 0, TCanvas.width, TCanvas.height);
            imgData = TCanvas.toDataURL("image/"+imageType, cfg.quality);
          } else {
            imgData = canvas.toDataURL("image/"+imageType, cfg.quality);
          }
          var _fixType = function (type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
          };
          imgData = imgData.replace(_fixType(imageType), 'image/octet-stream');
          var saveFile = function (data, filename) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
            setTimeout(function(){
              callbackFun&&callbackFun();
            },500);
          };
          var filename = fileName + '.' + imageType;
          saveFile(imgData, filename);
        } catch (e) {
          console.error(e);
        }
      });
    };

    if(window.html2canvas){
      saveImg(callback);
    } else {
      oui.require([
        oui.getContextPath()+'res_common/third/html2canvas/dist/html2canvas.min.js'
      ],function () {
        saveImg(callback);
      });
    }
  };
})(window,window.$$||window.$);




