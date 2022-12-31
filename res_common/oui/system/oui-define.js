//var oui = function(){
//
//};
//var global= global||{};
//global.oui = oui;
//window.oui = oui;
//
//oui.extend = function() {
//
//  var length = arguments.length;
//  var target = arguments[0] || {};
//  if (typeof target!="object" && typeof target != "function") {
//    target = {};
//  }
//
//  for (var i = 1; i < length; i++) {
//    var source = arguments[i];
//    if(Object.assign){
//      Object.assign(target,source);
//      continue;
//    }
//    for (var key in source) {
//      // 使用for in会遍历数组所有的可枚举属性，包括原型。
//      if (Object.prototype.hasOwnProperty.call(source, key)) {
//        target[key] = source[key];
//      }
//    }
//  }
//  return target;
//};
///***
// * 制定命名空间
// * @param namespace
// * @returns {Window}
// * @constructor
// */
//oui.NS = function(namespace) {
//  var nsparts = namespace.split(".");
//  var parent = window;
//
//  if (nsparts[0] === "oui") {
//    nsparts = nsparts.slice(1);
//    parent = oui;
//  }
//
//  for (var i = 0; i < nsparts.length; i++) {
//    var partname = nsparts[i];
//    if (typeof parent[partname] === "undefined") {
//      parent[partname] = {};
//    }
//
//    parent = parent[partname];
//  }
//
//  return parent;
//};
///***
// * 指定命名空间
// * @type {(function(*): Window)|*}
// */
//oui.ns  =oui.NS;
///***
// * 定义class类
// * @param cfg
// * @returns {_class_}
// * @constructor
// */
//oui.Class = function (cfg) {
//  if((!cfg.pkg)||(!cfg.className)){
//    throw new Error("pkg或className不能为空");
//  }
//  var pkg = oui.ns(cfg.pkg);
//  var _class_ = function (options) {
//
//  };
//  _class_.fullName = cfg.pkg+'.'+cfg.className;
//  pkg[cfg.className] = _class_;
//  oui.extend(_class_,cfg);
//  return _class_;
//};
oui.ns('oui.$');
oui.ns('oui.$.ctrl');

//框架初始化点
(function (win, $) {
  if(typeof win['template']!='undefined'){//处理全局模板帮助
    template.helper('oui',oui);
  }
  /**
   * 上下文初始化
   */

  if (typeof win.oui_context == 'undefined') {
    win.oui_context = {};
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
    }
    /**
     * 处理浏览器名和版本
     */
    function _set(bname, bver) {
      name = bname;
      ver = bver;
    }
    /**
     * IE 需要特殊逻辑判断
     */
    function isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
      } else {
        return false;
      }
    }
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
    }
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
      //android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      android: u.indexOf('Android') > -1  , // android终端或uc浏览器
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

  }

  /** 本地缓存 **/
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
        //判断是否是chrome-extension
        if(window.oui_context && window.oui_context.isChromeExt){
          if(currUrl&&currUrl.indexOf(url)>-1&&(currUrl.indexOf('chrome-extension:')>=0)){
            callback&&callback();
            return;
          }
        }else{
          if(currUrl&&currUrl.indexOf(url)>-1 ){
            callback&&callback();
            return;
          }
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
        if(window.oui_context && window.oui_context.isChromeExt){
          if(currUrl&&currUrl.indexOf(url)>-1 &&currUrl.indexOf('chrome-extension:')>=0 ){
            callback&&callback();
            return;
          }
        }else{
          if(currUrl&&currUrl.indexOf(url)>-1 ){
            callback&&callback();
            return;
          }
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
  }
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
  function onloaded(script, callback,error){//绑定加载完的回调函数
    if(script.readyState){ //ie
      script.attachEvent('onreadystatechange', function(){
        if(script.readyState == 'loaded' || script.readyState == 'complete'){
          script.className = 'loaded';
          callback && (callback.constructor === Function) && callback();
          script=null;
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
        script =null;
      }, false);
      if(error){
        script.addEventListener('error',function(){
          error && (error.constructor === Function) && error();
        }, false);
      }
    }
  }
  /** 按需加载封装***/
  function loadJsCss(url, callback,error ){// 非阻塞的加载 后面的js会先执行
    var isJs = /\/.+\.js($|\?)/i.test(url) ? true : false;
    /** 动态远程脚本场景 jsonp调用场景**/
    if(url.indexOf('__script__')>=0 && oui.getParamByUrl(url,'__script__')){
      isJs = true;
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

  /**
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




