/**
 * 封装业务组件类
 * @param win
 */
(function(win,$){

	// INIT BROWSER


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

	var __jsclazz_= win.__jsclazz_  ;
	var _tool_pkg_ = win._tool_pkg_;
	var Clz_Data =win.__jsclazz_.Clz_Data;
	var Tool = _tool_pkg_.Tool;

	//调用时，var neihe = getBrowser("n");  所获得的就是浏览器所用内核。
	//调用时  var banben = getBrowser("v"); 所获得的就是浏览器的版本号。
	//调用时  var browser = getBrowser(); 所获得的就是浏览器内核加版本号。
	_tool_pkg_.browser = {};
	_tool_pkg_.browser[getBrowser("n")] = getBrowser("v");
	/**
	 * 业务组件实现类
	 */
	Tool.Class({
		pkg : _tool_pkg_.NAME+".biz",
		clazzName : "Tool",
		Stat : { //start Static  静态属性或者方法，可以为空
			/**
			 * 控制器全名
			 */
			controllerFullName:"",
			controllerClz:"",
			getApiPathByController:function(fullName,method){
				var path = oui.getContextPath()+fullName+'.'+method+'.biz';
				return path;
			},
			/**
			 * 获取当前页面的js控制器类
			 */
			getControllerClass:function(fullName){
				//如果传入全路径的字符串 则返回全路径类
				if((typeof fullName =='string') && fullName){
					var clz = _tool_pkg_.biz.Tool.getClass(fullName);
					if(clz){
						return clz;
					}
					try{
						clz = eval(fullName);
					}catch(e){
					}
					return clz;
				}

				if(_tool_pkg_.biz.Tool.controllerFullName && _tool_pkg_.biz.Tool.controllerClz){
					return  _tool_pkg_.biz.Tool.controllerClz;
				}
				if(!_tool_pkg_.biz.Tool.controllerFullName){
					_tool_pkg_.biz.Tool.controllerFullName=$('body').attr(_tool_pkg_.get("prefix")+'controller');
					if(!_tool_pkg_.biz.Tool.controllerFullName){
						_tool_pkg_.biz.Tool.controllerFullName="window";
					}
				}
				if(_tool_pkg_.biz.Tool.controllerFullName=="window"){
					_tool_pkg_.biz.Tool.controllerClz = window;
					return window;
				}
				var clz = _tool_pkg_.biz.Tool.getClass(_tool_pkg_.biz.Tool.controllerFullName);
				if(clz){
					_tool_pkg_.biz.Tool.controllerClz = clz;
					return clz;
				}
				try{
					clz = eval(_tool_pkg_.biz.Tool.controllerFullName);
					_tool_pkg_.biz.Tool.controllerClz = clz;
				}catch(e){
				}
				return clz;
			},
			/**
			 * 根据方法名全路径配置 获取js类 和执行函数
			 */
			getClassAndFun:function(funName,cfg){
				var fun="";
				if(!funName){
					return  {
						clz: "",
						fun: "",
						funName:""
					};
				}
				if(funName.indexOf('.')>0){
					var lastIndex=funName.lastIndexOf("\.");
					var fullName=funName.substring(0,lastIndex);//类的全名

					fun=funName.substring(lastIndex+1,funName.length);//函数名称

					var clz = _tool_pkg_.biz.Tool.getClass(fullName);
					if(clz){

						return  {
							clz:clz||"",
							fun:clz[fun]||"",
							funName:fun
						};
					}
					try{
						clz = eval(fullName);
					}catch(e){
						return {clz:clz,fun:""};
					}
					return {
						clz:clz||"",
						fun:clz[fun]||"",
						funName:fun
					};
				}
				//closest
				var clsFullName= $(cfg.el).closest('['+_tool_pkg_.get("prefix")+'controller'+']').attr(_tool_pkg_.get("prefix")+'controller');
				var clz = _tool_pkg_.biz.Tool.getControllerClass(clsFullName);
				if(!clz){
					return {};
				}
				return {
					clz:clz,
					fun:clz[funName]||"",
					funName:funName
				};
			},
			/**
			 * 给js类构件 getSuper函数获取父类的方法
			 */
			buildSuper:function(clz){
				if(typeof clz.superClass =='undefined'){
					return ;
				}
				if(!clz.superClass){
					return ;
				}
				clz.getSuper = _tool_pkg_.biz.Tool.getSuper;
				/**
				 * 创建对象
				 */
				clz.create = _tool_pkg_.biz.Tool.createObject;
			},
			/**
			 * 获取Js对象类的父类
			 */
			getSuper:function(){
				return  Clz_Data[this.superClass];
			},

			/**
			 * 根据父类创建Js对象,如果没有父类,则需要实现自定义抽象类的create函数
			 */
			createObject:function(cfg){
				var obj = this.getSuper().create(this);
				obj._initObject(cfg);
				return obj;
			},
			/**
			 * 过滤已经加载的js 类进行依赖引入
			 */
			getUrlsByRefs:function(refs){
				refs = refs ||[];
				var arr = [];
				for(var i=0,len=refs.length;i<len;i++){
					if(typeof __jsclazz_.Clz_Data[refs[i]] !=='undefined'){
						continue;
					}
					var url = _tool_pkg_.cfg.JsClassPath.get(refs[i] );
					if((typeof url =='undefined' || (!url)) && (refs[i] .lastIndexOf(".js")<0) ){
						alert("在"+_tool_pkg_.NAME+".cfg.JsClassPath中获取不到[js类:"+refs[i]+"的url配置]");
						continue;
					}
					url = url ||refs[i];
					arr.push(url);
				}
				return arr;
			},
			/**
			 * 创建或者扩展js类的属性和方法
			 */
			crateOrUpdateClass:function(clz){
				var _clz =null;

				if(typeof clz.refs =='undefined'){
					if(typeof clz.buildClass =='undefined' ){
						_clz = _tool_pkg_.biz.Tool.Class({
							"package" : clz["package"],
							"class" : clz["class"]
						});
						_tool_pkg_.biz.Tool.createStatic(_clz, clz);
						_tool_pkg_.biz.Tool.buildSuper(_clz);
					}else {
						_clz = clz.buildClass();
						if((typeof _clz != "undefined") && _clz.FullName && _clz.Package){
							_tool_pkg_.biz.Tool.createStatic(_clz, clz);
						}
					}
					clz = _clz;
				}else{
					if(typeof clz.refs =='string'){
						clz.refs = clz.refs.split(",");
					}
					var requireUrls = _tool_pkg_.biz.Tool.getUrlsByRefs(clz.refs);
					_tool_pkg_.biz.Tool.require(requireUrls,function(){
						if(typeof clz.buildClass =='undefined' ){
							_clz = _tool_pkg_.biz.Tool.Class({
								"package" : clz["package"],
								"class" : clz["class"]
							});
							_tool_pkg_.biz.Tool.createStatic(_clz, clz);
							_tool_pkg_.biz.Tool.buildSuper(_clz);
						}else {
							_clz = clz.buildClass();
							if((typeof _clz != "undefined") && _clz.FullName && _clz.Package){
								_tool_pkg_.biz.Tool.createStatic(_clz, clz);
							}
						}
						clz = _clz;
					});
				}
				clz.__data = function(){
					return this
				};
				return clz;
			},
			loadSortState:{},
			requireWithSort:function(arrs,callback){
				if(typeof arrs =='undefined' ||(!arrs)){
					arrs =[];
				}else if(typeof arrs =='string'){
					arrs = arrs.split(",");
				}
				_tool_pkg_.biz.Tool.loadSortState[arrs.join(",")] = false;
				if(arrs.length==0){
					callback&&callback();
					_tool_pkg_.biz.Tool.loadSortState[arrs.join(",")] = true;
					return ;
				}
				var funs = [];
				for(var i=0,len=arrs.length;i<len;i++){
					funs[i] = {
						idx:i,
						url:arrs[i],
						lastUrl:(i>0?arrs[i-1]:""),
						len:len,
						run:function(){
							var me = this;
							var lastUrl = this.lastUrl;
							if(!lastUrl){
								_tool_pkg_.biz.Tool.require([me.url],function(){
									me.callback();
								});
								return ;
							}
							me.inter = window.setInterval(function(){
								if(typeof _tool_pkg_.biz.Tool.Loader.loadStates[me.lastUrl]=='undefined'){
									return ;
								}
								window.clearInterval(me.inter);
								delete me.inter;
								_tool_pkg_.biz.Tool.require([me.url],function(){
									me.callback();
								});
							}, 1);

						},
						callback:function(){
							if(this.idx == this.len-1){
								callback&&callback();
								_tool_pkg_.biz.Tool.loadSortState[arrs.join(",")] = true;
							}else if(this.idx>=0){
								funs[this.idx+1].run();
							}
						}
					};
				}
				funs[0].run();
			},
			/**
			 * 判断是否加载所有顺序执行的资源
			 */
			loadedAll4config:function(callback){
				var cfg = _tool_pkg_.biz.Tool.loadSortState;
				for(var i in cfg){
					if(cfg[i] !== true){
						window.setTimeout(function(){
							_tool_pkg_.biz.Tool.loadedAll4config(callback);
						}, 10);
						return false;
					}
				}
				callback&& callback();
				return true;
			},
			cssLoaderOver:true,
			/**
			 * 加载 Css资源配置Config
			 * @param cfg
			 * baseConfigUrl:公共的资源配置Js插件
			 * configUrls:当前页面的按需加载的资源配置文件
			 * callback回调函数,一般在callback中执行当前页面的初始化
			 */
			requireCssConfig:function(cfg){
				_tool_pkg_.biz.Tool.cssLoaderOver = false;
				var baseConfigUrl =cfg.baseConfigUrl||"",configUrls =cfg.configUrls||[],callback=cfg.callback;
				//arr.unshift("ui/cfgs/_tool_pkg_.cfg.JsClassPath.js");
				if(!baseConfigUrl){
					_tool_pkg_.cfg.CssClassPath.init();
					_tool_pkg_.biz.Tool.require(configUrls, function() {//加载资源配置文件
						var data = _tool_pkg_.cfg.CssClassPath.getRequireUrls();
						var urls = data.urls ||[];
						_tool_pkg_.biz.Tool.require(urls, function(){
							callback&&callback();
							_tool_pkg_.biz.Tool.cssLoaderOver = true;
						});
					});
					return ;
				}

				_tool_pkg_.biz.Tool.require([baseConfigUrl],function(){
					_tool_pkg_.cfg.CssClassPath.init();
					_tool_pkg_.biz.Tool.require(configUrls, function() {//加载资源配置文件
						var data = _tool_pkg_.cfg.CssClassPath.getRequireUrls();
						var urls = data.urls ||[];
						_tool_pkg_.biz.Tool.require(urls, function(){
							callback&&callback();
							_tool_pkg_.biz.Tool.cssLoaderOver = true;
						});
					});
				});
			},
			/**
			 * 加载 资源配置Config
			 * @param cfg
			 * baseConfigUrl:公共的资源配置Js插件
			 * configUrls:当前页面的按需加载的资源配置文件
			 * callback回调函数,一般在callback中执行当前页面的初始化
			 */
			requireConfig:function(cfg){
				console.log('css is over:'+_tool_pkg_.biz.Tool.cssLoaderOver);
				if(_tool_pkg_.biz.Tool.cssLoaderOver == false){
					window.setTimeout(function(){
						_tool_pkg_.biz.Tool.requireConfig(cfg);
					},10);
					return ;
				}
				var baseConfigUrl =cfg.baseConfigUrl||"",configUrls =cfg.configUrls||[],callback=cfg.callback;
				//arr.unshift("ui/cfgs/_tool_pkg_.cfg.JsClassPath.js");
				if(!baseConfigUrl){
					_tool_pkg_.cfg.JsClassPath.init();
					_tool_pkg_.biz.Tool.require(configUrls, function() {//加载资源配置文件
						var data = _tool_pkg_.cfg.JsClassPath.getRequireUrls();
						var urls = data.urls ||[];
						var pluginUrls= data.pluginUrls ||[];
						_tool_pkg_.biz.Tool.require(urls, function(){
							_tool_pkg_.biz.Tool.require(pluginUrls, function(){
								_tool_pkg_.biz.Tool.loadedAll4config(callback);
							});
						});
					});
					return ;
				}

				_tool_pkg_.biz.Tool.require([baseConfigUrl],function(){
					_tool_pkg_.cfg.JsClassPath.init();
					_tool_pkg_.biz.Tool.require(configUrls, function() {//加载资源配置文件
						var data = _tool_pkg_.cfg.JsClassPath.getRequireUrls();
						var urls = data.urls ||[];
						var pluginUrls= data.pluginUrls ||[];
						_tool_pkg_.biz.Tool.require(urls, function(){
							_tool_pkg_.biz.Tool.require(pluginUrls, function(){
								_tool_pkg_.biz.Tool.loadedAll4config(callback);
							});
						});
					});
				});
			},
			requiredData:{},
			/**
			 * 获取当前页面没有被引入的url,如果没有引入则需要放置到requiredData中,作为下一次引入的排重验证
			 */
			getHasNotRequireUrls:function(arr){
				var requiredData = _tool_pkg_.biz.Tool.requiredData;
				var urls = [];
				for(var i=0,len=arr.length;i<len;i++){
					if(typeof requiredData[arr[i]] !=='undefined'){

						continue;
					}else{
						requiredData[arr[i]] = true;
					}
					urls.push(arr[i]);
				}
				return urls;
			},
			sortUrls:[],
			require:function(arr,callback){
				var urls = _tool_pkg_.biz.Tool.getHasNotRequireUrls(arr);
				_tool_pkg_.biz.Tool.concatSortUrls(urls);
				_tool_pkg_.biz.Tool.Loader.require(urls,callback);
			},
			concatSortUrls:function(urls){

				if(typeof urls =='undefined' || urls.length ==0){
					return ;
				}
				_tool_pkg_.biz.Tool.sortUrls=_tool_pkg_.biz.Tool.sortUrls.concat(urls);
			},


			/**
			 * 定义类
			 * 	_tool_pkg_.biz.Tool.Class({
			  		"package" : "cn.chinatowercom.demo.example.capuser",
					"class" : "CapUserList"
				});

			 返回类对象
			 */
			Class:function(cfg){
				if(typeof cfg["pkg"] =="undefined"){
					cfg.pkg =cfg["package"];
				}
				//alert(cfg.pkg);
				if(typeof cfg["clazzName"] =="undefined"){
					cfg.clazzName = cfg["class"];
				}
				//alert(cfg.clazzName);
				Tool.Class(cfg);
				_tool_pkg_.biz.Tool.currentJsClass = __jsclazz_.Clz_Data[cfg.pkg+"."+cfg.clazzName];
				return _tool_pkg_.biz.Tool.currentJsClass;
			},
			/**
			 * 根据类全名获取JS类
			 */
			getClass:function(fullName){
				return __jsclazz_.Clz_Data[fullName];
			},
			Clear:_tool_pkg_.Clear,
			PACKAGE_PREFIX: Tool.PACKAGE_PREFIX,
			/**
			 * 检测类
			 * _tool_pkg_.biz.Tool.isClassWithPackage(Hello)
			 */
			isClassWithPackage:function(obj){
				try{

					if((typeof obj =="undefined") || obj == null){
						return false;
					}
					var pkg = _tool_pkg_.biz.Tool.PACKAGE_PREFIX;
					if(typeof pkg =="undefined"){
						alert("请技术经理配置coframe/tools/skins/common.jsp中"+Tool.FULLNAME+".PACKAGE_PREFIX 的值;构建包必须以该属性值为前缀,若存在多个请以英文逗号隔开");
						return false;
					}
					if(pkg =="" || pkg ==null){
						alert("请技术经理配置coframe/tools/skins/common.jsp中"+Tool.FULLNAME+".PACKAGE_PREFIX 的值;构建包必须以该属性值为前缀,若存在多个请以英文逗号隔开");
						return false;
					}
					if(typeof obj["package"] =="string" && (obj["package"].indexOf(pkg) >=0)){
						return true;
					}
					if(typeof obj["package"] =="string" && pkg.indexOf(",")>0){
						var arr = pkg.split(",");
						var len =arr.length;
						for(var i=0;i<len;i++){
							if(obj["package"].indexOf(arr[i]) >=0){
								return true;
							}
						}
					}
				}catch(e){
				}
				return false;
			},
			/**
			 * 存储补丁对象
			 */
			pache:{
			},

			/**
			 * 加载补丁的实现方式
			 * json格式配置，
			 _tool_pkg_.biz.Tool.loadPache({
				"statics/js/swfupload/swfupload.js":{//复制全名配置第三方js路径
					//加载js脚本之前执行 
					before:function(){
						
					},
					//加载js脚本之后执行
					after:function(){
						try{
							window.SWFUpload = SWFUpload;
						}catch(e){
							alert("statics/js/swfupload/swfupload.js打补丁时错误");
						}
					}
				}
			});
			 * 加载第三方补丁
			 *
			 */
			loadPache:function(cfg){
				var me = _tool_pkg_.biz.Tool.pache;
				for(var i in cfg){
					me[i] = cfg[i];
				}
			},
			/**
			 * 日志处理处理函数
			 */
			log: Tool.log,
			/**
			 * jsp页面的根路径
			 */
			contextPath: Tool.contextPath,

			/**
			 * 创建类的静态方法或者属性
			 */
			createStatic:function(clz,cfg){
				//start _tool_pkg_.biz.Tool.createStatic
				Tool.Extend(clz,{
					Stat:cfg
				});
				//end _tool_pkg_.biz.Tool.createStatic
			},
			/**
			 * 创建命名空间
			 */
			NS:_tool_pkg_.NS,
			/**
			 * 第三方js库目录
			 */
			ThirdResPath:"statics/js/",

			/**
			 * 执行ajax请求
			 * $.ajax({ url:urlStr, type:'POST', data:json, cache:false,
			 * contentType:'text/json', success:function(text){ var returnJson =
			 * nui.decode(text); if(returnJson.exception == null){
			 * CloseWindow("saveSuccess"); }else{ nui.alert("保存失败", "系统提示",
			 * function(action){ if(action == "ok" || action == "close"){
			 * //CloseWindow("saveFailed"); } }); } } });
			 *
			 *
			 * _tool_pkg_.biz.Tool.evalPath({
						url : "cn.chinatowercom.frame.biz.cmp.del.biz.ext",
						data : json,
						callback : function(o) {
							var returnJson = nui.decode(text);
							if (returnJson.exception == null) {
								grid.reload();
								nui.alert("删除成功", "系统提示", function(action) {
								});
							} else {
								grid.unmask();
								nui.alert("删除失败", "系统提示");
							}
						}
					  });
			 执行ajax异步请求
			 */
			evalPath : function(cfg) {
				//start _tool_pkg_.biz.Tool.evalPath
				var url =Tool.getFullPath(cfg.url);

				if(typeof cfg.async=="undefined"){
					cfg.async = true;
				}
				$.ajax({
					url : url,
					data : _tool_pkg_.biz.Tool.encode(cfg.data || {}),
					success : function(text) {
						var obj = _tool_pkg_.biz.Tool.decode(text);
						if(obj.exception != null){
							if(cfg.exception){
								cfg.exception(obj);
							}
							return ;
						}
						if(cfg.callBack){
							cfg.callBack(obj);
						}else if(cfg.callback){
							cfg.callback(obj);
						}
					},
					error : cfg.error || function(o) {
						_tool_pkg_.biz.Tool.log("网络连接异常:请求失败或者超时,"+_tool_pkg_.biz.Tool.encode(o) );
					},
					type : "POST",cache : false,contentType : 'text/json',
					dataType : "json",
					async:cfg.async
				});
				//end _tool_pkg_.biz.Tool.evalPath
			},
			trim:function(t){
				return (t||"").replace(/^\s+|\s+$/g, "");
			}
		}
	});
	/**
	 * @class _tool_pkg_.biz.Tool.Loader
	 * @desc js加载类
	 *
	 */
	Tool.Class({
		pkg : _tool_pkg_.NAME+".biz.Tool",
		clazzName : "Loader",
		Priv:{
			init:function(){
				this.over =false;
				this.doc = document;
				this.IS_CSS_REG = /\.css(?:\?|$)/i;
				this.READY_STATE_REG = /^(?:loaded|complete|undefined)$/;

				// bug fix
				// `onload` event is not supported in WebKit < 535.23 and Firefox < 9.0
				// ref:
				//  - https://bugs.webkit.org/show_activity.cgi?id=38995
				//  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
				//  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
				this.isOldWebKit = (window.navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) * 1 < 536;
				// For some cache cases in IE 6-8, the script executes IMMEDIATELY after
				// the end of the insert execution, so use `currentlyAddingScript` to
				// hold current node
				this.currentlyAddingScript = '';
				this.head = this.doc.getElementsByTagName('head')[0];
				// ref: #185 & http://dev.jquery.com/ticket/2709
				this.baseElement = this.head.getElementsByTagName("base")[0];
				this.idx=-1;
			}
			,isFunction : function(fn) {
				return "[object Function]" === Object.prototype.toString.call(fn);
			}
			,pollCss : function(node, callback) {
				var _self = this;
				var sheet = node.sheet;
				var isLoaded = false;

				// for WebKit < 536
				if(_self.isOldWebKit) {
					if(sheet) {
						isLoaded = true;
					}
				} else {
					if (sheet) {  // for Firefox < 9.0
						try {
							if(sheet.cssRules) {
								isLoaded = true;
							}
						} catch (ex) {
							// The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
							// to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
							// in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
							if(ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
								isLoaded = true;
							}
						}
					}
				}

				setTimeout(function() {
					if (isLoaded) {
						// Place callback here to give time for style rendering
						var currUrl =_self.urls[parseInt(node.getAttribute("load_js_idx"))];
						_tool_pkg_.biz.Tool.Loader.loadStates[currUrl]=true;
						_self.isFunction(callback) && callback();
					} else {
						_self.pollCss(node, callback);
					}
				}, 50);
			}
			,addOnload : function(node, callback, isCss) {
				var _self = this;
				var missingOnload = isCss && (_self.isOldWebKit || !("onload" in node));
				// for Old WebKit and Old Firefox
				if(missingOnload) {
					setTimeout(function() {
						_self.pollCss(node, callback);
					}, 10);  // Begin after node insertion
					return;
				}
				node.setAttribute("done","false");
				node.onload = node.onerror = node.onreadystatechange = function() {


					/*if (!(node.getAttribute("done")=='false') && (!node.readyState || node.readyState === "loaded" || node.readyState === "complete")) {
					 alert('done');
					 node.setAttribute("done",'true');
					 node.onload = node.onerror = node.onreadystatechange = null;
					 // Remove the script to reduce memory leak
					 if(!isCss) {
					 _self.head.removeChild(node);
					 }
					 // Dereference the node
					 node = null;
					 _self.isFunction(callback) && callback();
					 }*/
					if(_self.READY_STATE_REG == null){
						return ;
					}

					if((node.getAttribute("done")=='false')&&_self.READY_STATE_REG.test(node.readyState)) {
						var currUrl =_self.urls[parseInt(node.getAttribute("load_js_idx"))];
						_tool_pkg_.biz.Tool.Loader.loadStates[currUrl]=true;
						node.setAttribute("done","true");
						// Ensure only run once and handle memory leak in IE
						node.onload = node.onerror = node.onreadystatechange = null;
						// Remove the script to reduce memory leak
						if(!isCss) {
							_self.head.removeChild(node);
						}
//			            else{
//			            	_self.head.removeChild(node);
//			            }
						// Dereference the node
						node = null;
						_self.isFunction(callback) && callback();

					}
				};
			} ,use : function(url, callback, charset) {
				var isCss = this.IS_CSS_REG.test(url);
				var node = this.doc.createElement(isCss ? "link" : "script");
				node.setAttribute("load_js_idx",(++this.idx));
				if(undefined != charset) {
					node.charset = charset;
				}
				this.addOnload(node, function(){
					callback(node.getAttribute("load_js_idx"));
				}, isCss);
				if (isCss) {
					node.rel = "stylesheet";
					if(url&&url.indexOf('?')>0){
						node.href=url +'&_t='+_tool_pkg_.loadStartTime;
					}else{
						node.href =url +'?_t='+_tool_pkg_.loadStartTime;
					}

				} else {
					//node.defer = true;
					//node.setAttribute("defer", true);
					node.async = true;
					if(url&&url.indexOf('?')>0){
						node.src=url +'&_t='+_tool_pkg_.loadStartTime;
					}else{
						node.src =url +'?_t='+_tool_pkg_.loadStartTime;
					}
				}
				this.currentlyAddingScript = node;

				// ref: #185 & http://dev.jquery.com/ticket/2709
				this.baseElement ? this.head.insertBefore(node, this.baseElement) : this.head.appendChild(node);
				this.currentlyAddingScript = null;
			}
		},
		Cons:function(obj){
			this.init();
			if(!obj){
				return ;
			}
			for(var i in obj){
				this[i] = obj[i];
			}
		},
		Stat:{
			allLoaders:[],
			loadStates:{},
			callOver:function(){},
			clearLoaders:function(){
				var loaders = _tool_pkg_.biz.Tool.Loader.allLoaders;
				for(var i=0,len=loaders.length;i<len;i++){
					_tool_pkg_.biz.Tool.Clear(loaders[i]);
					loaders[i] = null;
				}
				loaders.length =0;
			},
			stoped:false,
			onStop:function(){
				if(_tool_pkg_.biz.Tool.Loader.stoped == true){
					return ;
				}
				_tool_pkg_.biz.Tool.Loader.stoped = true;
				_tool_pkg_.biz.Tool.Loader.clearLoaders();
				var callOver = _tool_pkg_.biz.Tool.Loader.callOver;
				return callOver && callOver();
			},
			hasStop:function(){
				var loaders = _tool_pkg_.biz.Tool.Loader.allLoaders,len=loaders.length;
				for(var k=0;k<len;k++){
					if(typeof loaders[k].over =='undefined'){
						return false;
					}
					if(loaders[k].over == false){
						return false;
					}
				}
				return true;
			},
			require:function(arr,fun){
				if(arr == null || arr.length ==0){
					return fun && fun();
				}
				var currFun = '';
				if(_tool_pkg_.biz.Tool.Loader.allLoaders.length ==0){
					_tool_pkg_.biz.Tool.Loader.stoped=false;
					_tool_pkg_.biz.Tool.Loader.callOver = fun;
					currFun = function(){
						if(_tool_pkg_.biz.Tool.Loader.hasStop() == true){
							_tool_pkg_.biz.Tool.Loader.onStop();
						}

					};
				}else{
					currFun = function(){
						fun();
						if(_tool_pkg_.biz.Tool.Loader.hasStop() == true){
							_tool_pkg_.biz.Tool.Loader.onStop();
						}
					};
				}

				var path = _tool_pkg_.biz.Tool.contextPath;
				var loader = new _tool_pkg_.biz.Tool.Loader();
				_tool_pkg_.biz.Tool.Loader.allLoaders.push(loader);
				loader.count=0;
				loader.len = arr.length;
				loader.currFun = currFun;
				loader.urls=arr;
				for(var i=0,len=arr.length;i<len;i++){
					var tempUrl = path+arr[i];
					if(arr[i].indexOf('http:\/\/')==0 || arr[i].indexOf('https:\/\/')==0){
						tempUrl =arr[i];
					}
					loader.use(tempUrl,function(){
						loader.count++;
						if(loader.count ==loader.len){
							loader.over = true;
							if(loader.currFun !=null){
								loader.currFun();
							}
						}else{
							loader.over = false;
						}

					},'utf-8');
				}
			}

		}
	});



})(window,window.$$||window.$);

/**
 * @class _tool_pkg_.cfg.JsClassPath
 * js依赖关系配置数据
 * _tool_pkg_.cfg.JsClassPath.js
 */
(function(win,$){
	var _tool_pkg_ = win._tool_pkg_;
	var JsClassPath={
		"package":_tool_pkg_.NAME+".cfg",
		"class":"JsClassPath",
		getCfgs:function(){
			if(typeof JsClassPath.cfgs =='undefined' || (!JsClassPath.cfgs)){
				JsClassPath.init();
			}
			return JsClassPath.cfgs;
		},
		get:function(fullName){
			return JsClassPath.getCfgs()[fullName];
		},
		requiredData:{},
		/**
		 * 预加载设置请求资源
		 */
		preRequireRefs:function(refs){
			if(typeof refs =='string'){
				refs = refs.split(",");
			}else if(!refs){
				refs = [];
			}
			var requiredData = JsClassPath.requiredData;
			for(var i=0,len=refs.length;i<len;i++){
				if(typeof requiredData[refs[i]] =='undefined'){
					requiredData[refs[i]] =true;
					JsClassPath.preRequireRefs(JsClassPath.refs[refs[i]] ||[] );
				}else{
					continue;
				}
			}
		},
		/**
		 * 获取加载的url列表
		 */
		getRequireUrls:function(){
			var rs = JsClassPath.requires;
			JsClassPath.preRequireRefs(rs); //预处理加载js资源
			JsClassPath.preRequireRefs(JsClassPath.requirePlugins); //预处理加载插件js资源

			var requiredData = JsClassPath.requiredData;
			var arr = [];
			var cfgs = JsClassPath.cfgs;
			var pluginUrls = [];
			for(var i in requiredData){
				if(typeof cfgs[i] =='undefined'  ||(!cfgs[i])){
					alert("请检查你的配置文件;没有配置["+i+" 的js路径]");
					continue;
				}
				if(cfgs[i].lastIndexOf("Plugin.js")>0){ //过滤插件
					pluginUrls.push(cfgs[i]);
				}else{
					arr.push( cfgs[i]);
				}
			}
			return {
				urls:arr, //非插件资源
				pluginUrls:pluginUrls//插件资源
			};

		},
		createConfig:function(cfg){
			if(typeof cfg =='undefined'){
				return ;
			}
			for(var i in cfg){
				if(typeof JsClassPath.cfgs[i] !=='undefined'){
					alert("你的资源配置文件中配置了重复别名:可能原因1:当前页面引入的资源配置文件中存在与公共资源中相同的别名:["+i+"]");
					return ;
				}else{
					JsClassPath.cfgs[i] = cfg[i];
				}
			}
		},
		createRefs:function(refs){
			if(typeof refs =='undefined'){
				return ;
			}
			for(var i in refs){
				if(typeof JsClassPath.refs[i] !=='undefined'){
					alert("你的资源配置文件中配置了重复依赖:可能原因1:当前页面引入的资源配置文件中存在与公共资源依赖配置中相同的别名:["+i+"]");
					return ;
				}else{
					JsClassPath.refs[i] = refs[i];
				}
			}
		},
		/**
		 * 引入资源
		 */
		imports:function(arr){
			if(typeof arr =='undefined' ||(!arr)){
				return ;
			}
			if(typeof JsClassPath.requires =='string'){
				JsClassPath.requires = JsClassPath.requires.split(",") ;
			}else if(!JsClassPath.requires){
				JsClassPath.requires = [];
			}
			if(typeof arr=='string'){
				arr = arr.split(",");
			}
			for(var i=0,len=arr.length;i<len;i++){
				JsClassPath.requires.push(arr[i]);
			}
		},
		importPlugins:function(arr){
			if(typeof arr =='undefined' ||(!arr)){
				return ;
			}
			if(typeof JsClassPath.requirePlugins =='string'){
				JsClassPath.requirePlugins = JsClassPath.requirePlugins.split(",") ;
			}else if(!JsClassPath.requirePlugins){
				JsClassPath.requirePlugins = [];
			}
			if(typeof arr=='string'){
				arr = arr.split(",");
			}
			for(var i=0,len=arr.length;i<len;i++){
				JsClassPath.requirePlugins.push(arr[i]);
			}
		},
		/**
		 * 提供插件重写,实现当前html页面中的资源配置
		 */
		config:function(){
			JsClassPath.createConfig({}); //创建资源配置
			JsClassPath.createRefs({}); //创建依赖关系
			JsClassPath.imports([]); //引入资源
			JsClassPath.importPlugins([]); //引入资源

		},
		/**
		 * 初始化js路径配置,依赖配置,当前html页面请求资源
		 */
		init:function(){
			JsClassPath.cfgs = {
			};
			JsClassPath.refs={
			};
			JsClassPath.requires =[];
			JsClassPath.requirePlugins=[];
			JsClassPath.config();
		}
	};
	JsClassPath = _tool_pkg_.biz.Tool.crateOrUpdateClass(JsClassPath);
})(window,window.$$||window.$);
/**
 * @class _tool_pkg_.cfg.CssClassPath
 * js依赖关系配置数据
 * _tool_pkg_.cfg.CssClassPath.js
 */
(function(win,$){
	var _tool_pkg_ = win._tool_pkg_;
	var CssClassPath={
		"package":_tool_pkg_.NAME+".cfg",
		"class":"CssClassPath",
		getCfgs:function(){
			if(typeof CssClassPath.cfgs =='undefined' || (!CssClassPath.cfgs)){
				CssClassPath.init();
			}
			return CssClassPath.cfgs;
		},
		get:function(fullName){
			return CssClassPath.getCfgs()[fullName];
		},
		requiredData:{},
		/**
		 * 预加载设置请求资源
		 */
		preRequireRefs:function(refs){
			if(typeof refs =='string'){
				refs = refs.split(",");
			}else if(!refs){
				refs = [];
			}
			var requiredData = CssClassPath.requiredData;
			for(var i=0,len=refs.length;i<len;i++){
				if(typeof requiredData[refs[i]] =='undefined'){
					requiredData[refs[i]] =true;
					CssClassPath.preRequireRefs(CssClassPath.refs[refs[i]] ||[] );
				}else{
					continue;
				}
			}
		},
		/**
		 * 获取加载的url列表
		 */
		getRequireUrls:function(){
			var rs = CssClassPath.requires;
			CssClassPath.preRequireRefs(rs); //预处理加载js资源
			CssClassPath.preRequireRefs(CssClassPath.requirePlugins); //预处理加载插件js资源

			var requiredData = CssClassPath.requiredData;
			var arr = [];
			var cfgs = CssClassPath.cfgs;
			var pluginUrls = [];
			for(var i in requiredData){
				if(typeof cfgs[i] =='undefined'  ||(!cfgs[i])){
					alert("请检查你的配置文件;没有配置["+i+" 的js路径]");
					continue;
				}
				if(cfgs[i].lastIndexOf("Plugin.js")>0){ //过滤插件
					pluginUrls.push(cfgs[i]);
				}else{
					arr.push( cfgs[i]);
				}
			}
			return {
				urls:arr, //非插件资源
				pluginUrls:pluginUrls//插件资源
			};

		},
		createConfig:function(cfg){
			if(typeof cfg =='undefined'){
				return ;
			}
			for(var i in cfg){
				if(typeof CssClassPath.cfgs[i] !=='undefined'){
					alert("你的资源配置文件中配置了重复别名:可能原因1:当前页面引入的资源配置文件中存在与公共资源中相同的别名:["+i+"]");
					return ;
				}else{
					CssClassPath.cfgs[i] = cfg[i];
				}
			}
		},
		createRefs:function(refs){
			if(typeof refs =='undefined'){
				return ;
			}
			for(var i in refs){
				if(typeof CssClassPath.refs[i] !=='undefined'){
					alert("你的资源配置文件中配置了重复依赖:可能原因1:当前页面引入的资源配置文件中存在与公共资源依赖配置中相同的别名:["+i+"]");
					return ;
				}else{
					CssClassPath.refs[i] = refs[i];
				}
			}
		},
		/**
		 * 引入资源
		 */
		imports:function(arr){
			if(typeof arr =='undefined' ||(!arr)){
				return ;
			}
			if(typeof CssClassPath.requires =='string'){
				CssClassPath.requires = CssClassPath.requires.split(",") ;
			}else if(!CssClassPath.requires){
				CssClassPath.requires = [];
			}
			if(typeof arr=='string'){
				arr = arr.split(",");
			}
			for(var i=0,len=arr.length;i<len;i++){
				CssClassPath.requires.push(arr[i]);
			}
		},
		importPlugins:function(arr){
			if(typeof arr =='undefined' ||(!arr)){
				return ;
			}
			if(typeof CssClassPath.requirePlugins =='string'){
				CssClassPath.requirePlugins = CssClassPath.requirePlugins.split(",") ;
			}else if(!CssClassPath.requirePlugins){
				CssClassPath.requirePlugins = [];
			}
			if(typeof arr=='string'){
				arr = arr.split(",");
			}
			for(var i=0,len=arr.length;i<len;i++){
				CssClassPath.requirePlugins.push(arr[i]);
			}
		},
		/**
		 * 提供插件重写,实现当前html页面中的资源配置
		 */
		config:function(){
			CssClassPath.createConfig({}); //创建资源配置
			CssClassPath.createRefs({}); //创建依赖关系
			CssClassPath.imports([]); //引入资源
			CssClassPath.importPlugins([]); //引入资源

		},
		/**
		 * 初始化js路径配置,依赖配置,当前html页面请求资源
		 */
		init:function(){
			CssClassPath.cfgs = {
			};
			CssClassPath.refs={
			};
			CssClassPath.requires =[];
			CssClassPath.requirePlugins=[];
			CssClassPath.config();
		}
	};
	CssClassPath = _tool_pkg_.biz.Tool.crateOrUpdateClass(CssClassPath);
})(window,window.$$||window.$);
/**
 * json处理工具
 * encode
 * decode
 * clone
 * @param win
 */
(function(win,$){

	var _tool_pkg_ = win._tool_pkg_;
	_tool_pkg_.biz.Tool.JSON = new (function () {
		var sb = [];
		var _dateFormat = null;
		var useHasOwn = !!{}.hasOwnProperty, replaceString = function (a, b) {
				var c = m[b];
				if (c) {
					return c
				}
				c = b.charCodeAt();
				return"\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
			}, doEncode = function (o, field) {
				if (o === null) {
					sb[sb.length] = "null";
					return
				}
				var t = typeof o;
				if (t == "undefined") {
					sb[sb.length] = "null";
					return
				} else {
					if (o.push) {
						sb[sb.length] = "[";
						var b, i, l = o.length, v;
						for (i = 0; i < l; i += 1) {
							v = o[i];
							t = typeof v;
							if (t == "undefined" || t == "function" || t == "unknown") {
							} else {
								if (b) {
									sb[sb.length] = ","
								}
								doEncode(v);
								b = true
							}
						}
						sb[sb.length] = "]";
						return
					} else {
						if (o.getFullYear) {
							if (_dateFormat) {
								sb[sb.length] = '"';
								if (typeof _dateFormat == "function") {
									sb[sb.length] = _dateFormat(o, field)
								} else {
									sb[sb.length] = _tool_pkg_.biz.Tool.formatDate(o, _dateFormat)
								}
								sb[sb.length] = '"'
							} else {
								var n;
								sb[sb.length] = '"';
								sb[sb.length] = o.getFullYear();
								sb[sb.length] = "-";
								n = o.getMonth() + 1;
								sb[sb.length] = n < 10 ? "0" + n : n;
								sb[sb.length] = "-";
								n = o.getDate();
								sb[sb.length] = n < 10 ? "0" + n : n;
								sb[sb.length] = "T";
								n = o.getHours();
								sb[sb.length] = n < 10 ? "0" + n : n;
								sb[sb.length] = ":";
								n = o.getMinutes();
								sb[sb.length] = n < 10 ? "0" + n : n;
								sb[sb.length] = ":";
								n = o.getSeconds();
								sb[sb.length] = n < 10 ? "0" + n : n;
								sb[sb.length] = '"'
							}
							return
						} else {
							if (t == "string") {
								if (strReg1.test(o)) {
									sb[sb.length] = '"';
									sb[sb.length] = o.replace(strReg2, replaceString);
									sb[sb.length] = '"';
									return
								}
								sb[sb.length] = '"' + o + '"';
								return
							} else {
								if (t == "number") {
									sb[sb.length] = o;
									return
								} else {
									if (t == "boolean") {
										sb[sb.length] = String(o);
										return
									} else {
										sb[sb.length] = "{";
										var b, i, v;
										for (i in o) {
											if (!useHasOwn || Object.prototype.hasOwnProperty.call(o, i)) {
												v = o[i];
												t = typeof v;
												if (t == "undefined" || t == "function" || t == "unknown") {
												} else {
													if (b) {
														sb[sb.length] = ","
													}
													doEncode(i);
													sb[sb.length] = ":";
													doEncode(v, i);
													b = true
												}
											}
										}
										sb[sb.length] = "}";
										return
									}
								}
							}
						}
					}
				}
			},
			m = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"},strReg1 = /["\\\x00-\x1f]/, strReg2 = /([\x00-\x1f\\"])/g;
		this.encode = function () {
			var ec;
			return function (o, dateFormat) {
				sb = [];
				_dateFormat = dateFormat;
				doEncode(o);
				_dateFormat = null;
				return sb.join("")
			}
		}();
		this.decode = function () {
			var dateRe1 = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.*\d*)?)Z*$/;
			var dateRe2 = new RegExp("^/+Date\\((-?[0-9]+).*\\)/+$", "g");
			var re = /[\"\'](\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})[\"\']/g;
			return function (json, parseDate) {
				if (json === "" || json === null || json === undefined) {
					return json
				}
				if (typeof json == "object") {
					json = this.encode(json)
				}
				function evalParse(json) {
					if (parseDate !== false) {
						json = json.replace(_tool_pkg_.biz.Tool.__js_dateRegEx, "$1new Date($2)");
						json = json.replace(re, "new Date($1,$2-1,$3,$4,$5,$6)");
						json = json.replace(_tool_pkg_.biz.Tool.__js_dateRegEx2, "new Date($1)")
					}
					return eval("(" + json + ")")
				}

				var data = null;
				if (window.JSON && window.JSON.parse) {
					var dateReviver = function (key, value) {
						if (typeof value === "string" && parseDate !== false) {
							dateRe1.lastIndex = 0;
							var a = dateRe1.exec(value);
							if (a) {
								value = new Date(a[1], a[2] - 1, a[3], a[4], a[5], a[6]);
								return value
							}
							dateRe2.lastIndex = 0;
							var a = dateRe2.exec(value);
							if (a) {
								value = new Date(parseInt(a[1]));
								return value
							}
						}
						return value
					};
					try {
						var json2 = json.replace(_tool_pkg_.biz.Tool.__js_dateRegEx, '$1"/Date($2)/"');
						data = window.JSON.parse(json2, dateReviver)
					} catch (ex) {
						data = evalParse(json)
					}
				} else {
					data = evalParse(json)
				}
				return data
			}
		}()
	})();
	_tool_pkg_.biz.Tool.dateInfo = {monthsLong: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], daysLong: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], daysShort: ["日", "一", "二", "三", "四", "五", "六"], quarterLong: ["一季度", "二季度", "三季度", "四季度"], quarterShort: ["Q1", "Q2", "Q2", "Q4"], halfYearLong: ["上半年", "下半年"], patterns: {d: "yyyy-M-d", D: "yyyy年M月d日", f: "yyyy年M月d日 H:mm", F: "yyyy年M月d日 H:mm:ss", g: "yyyy-M-d H:mm", G: "yyyy-M-d H:mm:ss", m: "MMMd日", o: "yyyy-MM-ddTHH:mm:ss.fff", s: "yyyy-MM-ddTHH:mm:ss", t: "H:mm", T: "H:mm:ss", U: "yyyy年M月d日 HH:mm:ss", y: "yyyy年MM月"}, tt: {AM: "上午", PM: "下午"}, ten: {Early: "上旬", Mid: "中旬", Late: "下旬"}, today: "今天", clockType: 24};
	_tool_pkg_.biz.Tool.__js_dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', "g");
	_tool_pkg_.biz.Tool.__js_dateRegEx2 = new RegExp("[\"']/Date\\(([0-9]+)\\)/[\"']", "g");
	_tool_pkg_.biz.Tool.encode =_tool_pkg_.biz.Tool.JSON.encode;
	_tool_pkg_.biz.Tool.decode = _tool_pkg_.biz.Tool.JSON.decode;
	_tool_pkg_.biz.Tool.formatDate = function (e, r, p) {
		if (!e || !e.getFullYear || isNaN(e)) {
			return""
		}
		var b = e.toString();
		var a = _tool_pkg_.biz.Tool.dateInfo;
		if (typeof(a) !== "undefined") {
			var j = typeof(a.patterns[r]) !== "undefined" ? a.patterns[r] : r;
			var k = e.getFullYear();
			var i = e.getMonth();
			var l = e.getDate();
			if (r == "yyyy-MM-dd") {
				i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
				l = l < 10 ? "0" + l : l;
				return k + "-" + i + "-" + l
			}
			if (r == "MM/dd/yyyy") {
				i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
				l = l < 10 ? "0" + l : l;
				return i + "/" + l + "/" + k
			}
			b = j.replace(/yyyy/g, k);
			b = b.replace(/yy/g, (k + "").substring(2));
			var o = e.getHalfYear();
			b = b.replace(/hy/g, a.halfYearLong[o]);
			var c = e.getQuarter();
			b = b.replace(/Q/g, a.quarterLong[c]);
			b = b.replace(/q/g, a.quarterShort[c]);
			b = b.replace(/MMMM/g, a.monthsLong[i].escapeDateTimeTokens());
			b = b.replace(/MMM/g, a.monthsShort[i].escapeDateTimeTokens());
			b = b.replace(/MM/g, i + 1 < 10 ? "0" + (i + 1) : i + 1);
			b = b.replace(/(\\)?M/g, function (t, s) {
				return s ? t : i + 1
			});
			var d = e.getDay();
			b = b.replace(/dddd/g, a.daysLong[d].escapeDateTimeTokens());
			b = b.replace(/ddd/g, a.daysShort[d].escapeDateTimeTokens());
			b = b.replace(/dd/g, l < 10 ? "0" + l : l);
			b = b.replace(/(\\)?d/g, function (t, s) {
				return s ? t : l
			});
			var g = e.getHours();
			var n = g > 12 ? g - 12 : g;
			if (a.clockType == 12) {
				if (g > 12) {
					g -= 12
				}
			}
			b = b.replace(/HH/g, g < 10 ? "0" + g : g);
			b = b.replace(/(\\)?H/g, function (t, s) {
				return s ? t : g
			});
			b = b.replace(/hh/g, n < 10 ? "0" + n : n);
			b = b.replace(/(\\)?h/g, function (t, s) {
				return s ? t : n
			});
			var f = e.getMinutes();
			b = b.replace(/mm/g, f < 10 ? "0" + f : f);
			b = b.replace(/(\\)?m/g, function (t, s) {
				return s ? t : f
			});
			var q = e.getSeconds();
			b = b.replace(/ss/g, q < 10 ? "0" + q : q);
			b = b.replace(/(\\)?s/g, function (t, s) {
				return s ? t : q
			});
			b = b.replace(/fff/g, e.getMilliseconds());
			b = b.replace(/tt/g, e.getHours() > 12 || e.getHours() == 0 ? a.tt.PM : a.tt.AM);
			var e = e.getDate();
			var h = "";
			if (e <= 10) {
				h = a.ten.Early
			} else {
				if (e <= 20) {
					h = a.ten.Mid
				} else {
					h = a.ten.Late
				}
			}
			b = b.replace(/ten/g, h)
		}
		return b.replace(/\\/g, "")
	};
	/**
	 * _tool_pkg_.biz.Tool.clone
	 * 克隆方法
	 */
	_tool_pkg_.biz.Tool.clone = function (e, c) {
		if (e === null || e === undefined) {
			return e
		}
		var b = _tool_pkg_.biz.Tool.encode(e);
		var d = _tool_pkg_.biz.Tool.decode(b);

		function copyObj(f) {
			for (var j = 0, g = f.length; j < g; j++) {
				var m = f[j];
				delete m._state;
				delete m._id;
				delete m._pid;
				delete m._uid;
				for (var k in m) {
					var h = m[k];
					if (h instanceof Array) {
						copyObj(h);
					}
				}
			}
		}

		if (c !== false) {
			copyObj(d instanceof Array ? d : [d])
		}
		return d;
	};
	_tool_pkg_.encode = _tool_pkg_.biz.Tool.encode;
	_tool_pkg_.decode = _tool_pkg_.biz.Tool.decode;
	_tool_pkg_.clone = _tool_pkg_.biz.Tool.clone;

})(window,window.$$||window.$);

/**
 * 公共的事件处理组件
 */
(function(win,$) {
	var __jsclazz_= win.__jsclazz_  ;
	var _tool_pkg_ = win._tool_pkg_;
	var Clz_Data =win.__jsclazz_.Clz_Data;
	var Tool = _tool_pkg_.Tool;
	/**
	 * *.biz.Events
	 */
	var Events = {
		"package" :  _tool_pkg_.NAME+".biz",
		"class" : "Events",
		prefix:_tool_pkg_.get("eventPrefix"),//取Parse里面得事件前缀，Parse在页面上取 
		suffix:"",
		controllPrefix:_tool_pkg_.get('controlPrefix'),

		init:function(){
			Events.bindGlobalEvents();

		},
		/**
		 * 获取事件触发的对象
		 */
		getEventTarget:function(event){
			var target =  event.target?event.target:event.srcElement;
			return target;
		},
		/**
		 * 根据事件名,绑定执行函数
		 绑定之后，将会把cfg对象( var clz = cfg.clz,sourceFun=cfg.sourceFun,target=cfg.target,e=cfg.e)传入配置的函数中执行;
		 </pre>
		 */
		bindEvents : function(eventName, fun, selector) {
			var tempSelector = selector || "[" + Events.prefix+ eventName + Events.suffix+ "]";

			if(eventName =='propertychange'){
				/*
				 * ie9存在问题
				 && ((''+oui.browser.ie).indexOf('9')>=0)
				 */
				if(_tool_pkg_.browser.ie  && ((''+_tool_pkg_.browser.ie).indexOf('9')>=0) ){
					$(document).on('mouseover',tempSelector,function(e){
						if(this !== Events.getEventTarget(e)){
							return;
						}
						if(!$(this).data('__hasBindChange')){
							var currEl=null;
							var onInput = function(e) {
								var el = currEl || Events.getEventTarget(e);
								//alert(el ==  e.srcElement);
								//alert(e.ctrlKey == true && e.keyCode == 90);
								//alert(e.ctrlKey);
								var lastValue = $(el).data('data-oval')||"";

								if (lastValue !== el.value) { // selectionchange fires more often than needed
									$(el).data('data-oval',el.value);
									fun&&fun.call(el,e);
								}
							};
							var onFocusChange = function(event) {
								currEl = this;
								if (event.type === "focus") {
									$(this).data('data-oval',this.value);
									document.addEventListener("propertychange", onInput, false);
								} else {
									document.removeEventListener("propertychange", onInput, false);
								}
							};
							this.addEventListener("input", onInput, false);
							this.addEventListener("mouseup", onInput, false);
							this.addEventListener("cut", onInput, false);
							this.addEventListener("focus", onFocusChange, false);
							this.addEventListener("blur", onFocusChange, false);
							this.addEventListener("keyup", onInput, false);
							$(this).on('cut',function(){
								window.setTimeout(onInput,5);
							});
							$(this).data('__hasBindChange',true);
						}
					});

					return ;
				}
				$(document).on("input propertychange", tempSelector, fun);


				return ;
			}
			$(document).on(eventName, tempSelector, fun);
		},
		getEvFun:function(ev){
			if(typeof Events[Events.prefix+"_"+ev] =='undefined'){
				Events[Events.prefix+"_"+ev] = function(e){

					var sourceFun = $(this).attr(Events.prefix+ ev + Events.suffix);
					var controllId=$(this).attr(Events.controllPrefix+"own");
					var param = $(this).attr(Events.prefix+"param") ||"";
					if(!controllId){
						Events.runGlobalFunByFun({fun:sourceFun,el:this,e:e,param:param});
					}else{

						Events.runObjectFunByFun({fun:sourceFun,el:this,e:e,controllId:controllId,param:param});
					}
				};
			}
			return Events[Events.prefix+"_"+ev];
		},

		/**
		 * 绑定全局click事件
		 */
		bindGlobalEvents:function(evts){
			/**
			 * 测试，分离事件
			 */
			var evts=evts||"move,load,tap,touchstart,touchmove,touchend,oninput,toggle,propertychange,hover,blur,change,click,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mousewheel,contextmenu,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,unload";
			//evts=evts || "click,blur,propertychange";
			var arr=evts.split(",");
			var eventName="";
			for(var i=0,len=arr.length;i<len;i++){
				eventName=arr[i];
				if(Events[Events.prefix+"_"+eventName]){
					continue;
				}
				Events.bindEvents(arr[i], Events.getEvFun(arr[i]));
			}
			/**
			 * 禁用ie9右键菜单和 ctrl+z
			 */
			if(_tool_pkg_.browser.ie&& ((_tool_pkg_.browser.ie+'').indexOf('9')>=0)){
				$(document).on('keydown',function(e){
					e = e ||event;
					if(e.ctrlKey){
						if(e.keyCode==90){ //如果是ctrl+z则禁用
							e.returnValue = false;
							return false;
						}
					}
				});

				$(document).on('cut',function(e){
					e = e ||event;
					//Events.currCutEl = Events.getEventTarget(e);
					//e.returnValue=false;
					//return false;
				});
			}

		},
		/**
		 * 根据sourceFun绑定运行函数
		 * cfg:{sourceFun,target,e}
		 *
		 */
		runObjectFunByFun:function(cfg){
			var fun=cfg.fun,el=cfg.el,e=cfg.e,controllId=cfg.controllId,param=cfg.param||"";
			if(!fun){
				return;
			}

			var obj=_tool_pkg_.getByControllId(controllId);
			Events.runObjectFun({object:obj,fun:fun,el:el,e:e,controllId:controllId,param:param});
		},
		/**
		 * 执行全局类 中的函数
		 */
		runGlobalFunByFun:function(cfg){
			var fun=cfg.fun,el=cfg.el,e=cfg.e,param=cfg.param||"";

			if(!fun){
				return;
			}
			var cdata = _tool_pkg_.biz.Tool.getClassAndFun(fun,cfg);
			Events.runGlobalFun({clz:cdata.clz ||"",fun:cdata.funName ||"",el:el,e:e,runFun:cdata.fun ||"",param:param});

		},
		/**
		 * 运行全局函数
		 * @param cfg object 配置参数，形式如下：{object,fun,el}
		 *
		 */
		runObjectFun:function(cfg){
			var obj=cfg.object,fun=cfg.fun,el=cfg.el;
			if(!obj){
				return;
			}
			Events.runGlobalFunTestStart(cfg, "");

			var beffun =  $("["+_tool_pkg_.get("controlPrefix")+"controllId="+cfg.controllId+"]").attr(_tool_pkg_.get("beforePrifix")+fun);
			var cdata = _tool_pkg_.biz.Tool.getClassAndFun(beffun,cfg);
			if(cdata.clz && cdata.fun){
				var shoudContinue = cdata.fun.call(cdata.clz,cfg);
				if(typeof shoudContinue !=='undefined' && shoudContinue===false){
					Events.runGlobalFunTestEnd(cfg, "");
					return ;
				}
			}
			if(obj[fun]){
				obj[fun](cfg);
			}
			var affun =$("["+_tool_pkg_.get("controlPrefix")+"controllId="+cfg.controllId+"]").attr(_tool_pkg_.get("afterPrifix")+fun);
			var cadata =  _tool_pkg_.biz.Tool.getClassAndFun(affun,cfg);
			if(cadata.clz && cadata.fun){
				cadata.fun.call(cadata.clz,cfg);
			}
			Events.runGlobalFunTestEnd(cfg, "");
		},
		/**
		 * 执行全局函数
		 */
		runGlobalFun:function(cfg){
			var clz=cfg.clz,fun=cfg.fun; //执行全局静态方法 取函数名
			if(!clz){
				return;
			}
			Events.runGlobalFunTestStart(cfg,"");
			var el=cfg.el;
			if(clz[fun+"Before"]){

				var shoudContinue = clz[fun+"Before"](cfg);

				if( typeof shoudContinue !=='undefined' && shoudContinue===false){
					Events.runGlobalFunTestEnd(cfg, "");
					return;
				}
			}
			if(clz[fun]){
				clz[fun](cfg);
			}
			if(clz[fun+"After"]){
				clz[fun+"After"](cfg);
			}
			Events.runGlobalFunTestEnd(cfg, "");
		},


		/*runGlobalFun:function(cfg){

		 var clz=cfg.clz,fun=cfg.fun,ownClz=cfg.ownClz;


		 if(!clz){
		 return;
		 }
		 if(ownClz){

		 if(ownClz[fun+"Before"]){


		 if(ownClz[fun+"Before"].call(clz,cfg)===false){
		 return;
		 }
		 }
		 if(ownClz[fun]){
		 ownClz[fun ].call(clz,cfg)
		 }
		 if(ownClz[fun+"After"]){
		 ownClz[fun+"After" ].call(clz,cfg)
		 }
		 return ;
		 }


		 if(clz[fun+"Before"]){
		 if(clz[fun+"Before"](cfg)===false){
		 return;
		 }
		 }
		 if(clz[fun]){
		 clz[fun](cfg);
		 }
		 if(clz[fun+"After"]){
		 clz[fun+"After"](cfg);
		 }
		 },*/
		/**
		 * 运行全局函数之前运行以该函数名称相同，但是以_start结尾的函数
		 * @param cfg object 配置参数，形式如下:{clz:clz,fun:fun,ownClz:ownClz}
		 *
		 *
		 */
		runGlobalFunTestStart:function(cfg,endFix){
			var clz=cfg.clz,fun=cfg.fun;
			if(!clz){
				return;
			}


			if(clz[fun+endFix+"_start"]){
				if(clz[fun+endFix+"_start"]){
					clz[fun+endFix+"_start"](cfg);
					return;
				}
			}
		},
		/**
		 *  运行全局函数之前运行以该函数名称相同，但是以_end结尾的函数
		 * @param cfg object 配置参数，形式如下:{clz:clz,fun:fun,ownClz:ownClz}
		 */
		runGlobalFunTestEnd:function(cfg,endFix){
			var clz=cfg.clz,fun=cfg.fun,ownClz=cfg.ownClz;
			if(!clz){
				return;
			}
			if(ownClz){
				if(ownClz[fun+endFix+"_end"]){
					ownClz[fun+endFix+"_end"](cfg);
					return;
				}
			}
			if(clz[fun+endFix+"_end"]){
				if(clz[fun+endFix+"_end"]){
					clz[fun+endFix+"_end"](cfg);
					return;
				}
			}
		}

	};
	Events = _tool_pkg_.biz.Tool.crateOrUpdateClass(Events);
	Events.init(); //默认执行初始化绑定事件
})(window,window.$$||window.$);
