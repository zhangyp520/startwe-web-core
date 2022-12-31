/**
 * 创建 命名空间、创建类、创建对象、清楚对象的方法
 *

 * 创建类的列子1

com.oui.Tool.Class({
	pkg:"com.test",
	clazzName:"Test",
	Cons:function (obj){ //构造器可以为空，默认为复制 构造参数的属性到对象
		for(var i in obj){
			this[i] = obj[i];
		}
		com.test.Test.SuperClass.call(this);
	}, 
	Stat:{ //静态属性或者方法，可以为空
		hello:function(){
			alert('com.test.Test.hello');
		},
		SuperClass:com.oui.Data
		
	},
	Publ:{//公共方法或者属性，可以为空
		show:function(){
			alert('com.test.Test.public.show;');
		}
	}, 
	Priv:{ //权限方法、或者属性，可以为空
		go:function(){
			alert("com.test.Test.priv.go;");
		}
	}
});
*/

/**
 * 创建类的列子2
 */
/*
com.oui.Tool.Class({
	pkg:"com.test",
	clazzName:"Test2"
}); 
*/
/**
 * 对象调用的列子
 */
/*
var obj = new com.test.Test({ok:function(){alert('ok');},name:"name...."});
com.test.Test.hello();
obj.ok();
alert(obj.name);
com.oui.Clear(obj);//对象清除
alert(obj.name);
*/
//namespace 定义 com.oui.NS(pkg); 
(function(win) {
	var _jsns_= win._jsns_= win._jsns_||{};win._jsns_.Ns_Data = {};
	var _d = new Date();
	var loadStartTime= _d.getFullYear()+''+(_d.getMonth()+1)+''+_d.getDate()+''+_d.getHours();
	// 命名空间存放容器  
	var __jsclazz_= win.__jsclazz_ = win.__jsclazz_ || {};win.__jsclazz_.Clz_Data = {};
	var pwin={};
	try{
		pwin= win["parent"];
	}catch(e){
		pwin={};
	}
	// 类存放容器 
	var NS = function (name){
		if(!name){
			return null;
		}
		if(_jsns_.Ns_Data[name]){
			return _jsns_.Ns_Data[name];
		}
	    var parts = name.split('.');
	    var container = win;
	    for(var i = 0; i < parts.length; i++) {
	        var part = parts[i];
	        if (!container[part]) container[part] = {};
	        container = container[part];
	    }
	    var namespace = container;
	    namespace.NAME = name;
	    return _jsns_.Ns_Data[name] = namespace;
	};
	/**
	 *
	 */
	var getContextPath=function() {
		if(oui_context && oui_context.contextPath){
			return oui_context.contextPath;
		}
		var pathName = document.location.pathname;
		var index = pathName.substr(1).indexOf("/");

		var result = pathName.substr(0,index+1)+"/";

		if(['/res_apps/','/res_common/','/res_engine/'].indexOf(result)>-1){
			result= '/';
		}
		if(!oui_context){
			oui_context = {};
		}
		oui_context.contextPath = result;
		return result;
	};
	NS('oui_context');//定义命名空间 oui_context
	// 定义命名空间 com.oui 
	
	if(typeof win["oui_context"].bizPackage =='undefined'){
		win["oui_context"].bizPackage ="oui";
	}
	getContextPath();//调用上下文路径处理
	var mainTool =NS(win["oui_context"].bizPackage);
	mainTool.getContextPath = getContextPath;
	mainTool.loadStartTime = loadStartTime;
	win._tool_pkg_ = mainTool;
	win._tool_pkg_._map_ = {};
	win._tool_pkg_.set = function(key,v){
		if(typeof key =='string'){
			win._tool_pkg_._map_[key] = v;
			return ;
		}
		if(typeof key =='object' && typeof v =='undefined'){
			for(var ck in key){
				win._tool_pkg_._map_[ck] = key[ck];
			}
		}
		
	};
	win._tool_pkg_.set({
		contextPath : win["oui_context"].contextPath||"",
		bizPackage : win["oui_context"].bizPackage ||"oui",
		prefix : win["oui_context"].prefix ||"oui-",
		controlPrefix : win["oui_context"].controlPrefix||"oui-c-",
		eventPrefix :  win["oui_context"].eventPrefix ||"oui-e-",
		validatePrefix : win["oui_context"].validatePrefix || "oui-v-",
		beforePrifix : win["oui_context"].beforePrifix ||"oui-c-before-",
		afterPrifix : win["oui_context"].afterPrifix ||"oui-c-after-"
	});
	win._tool_pkg_.get=function(key){
		return 	win._tool_pkg_._map_[key];
	};
	win._tool_pkg_.getCtxMap=function(){
		return 	win._tool_pkg_._map_;
	};
	/**
	 * 判断是否注册同名的api
	 */
	var hasReged = function(name){
		if(typeof win._tool_pkg_[name] !=='undefined'){
			alert("已经定义了全局api:"+name+",请检测代码"+win._tool_pkg_.NAME+".reg()调用,定义的同名api;或者检测手动写"+win._tool_pkg_.NAME+"."+name+"=**的代码");
			return true ;
		}
		return false;
	};
	win._tool_pkg_.reg=function(name,f){
		if(typeof name =='string'){
			if(typeof f=='undefined'){
				alert("不能注册未定义的函数到全局api上");
				return ;
			}
			if(hasReged(name)){
				return ;
			}
			this[name] = f;
			return ;
		}
		if(typeof name =='object' && typeof f =='undefined'){
			for(var ck in name){
				if(hasReged(ck)){
					continue ;
				}
				this[ck] = name[ck];
			}
		}
	};
	mainTool.NS = NS;
	mainTool.ns = NS;
	//win.com.oui.Class
	mainTool.Class = function (cfg){ // 命名规则：public中不能存在 priv属性定义 
		var pkg = cfg["pkg"] ||cfg['package'],// 命名空间 
		
		scn = cfg["clazzName"]||cfg['class']; // 类名, 
		
		var ns =NS(pkg);
		if(cfg["use_par_def"] == true){
			try{
				var pscn = pwin._jsns_[pkg];
				if(pscn && pwin.__jsclazz_.Clz_Data[pkg+"."+scn]){
					ns[scn] =pscn; 
				}
				__jsclazz_.Clz_Data[pkg+"."+scn] = pscn;
			}catch(e){
			}
		}
		if(__jsclazz_.Clz_Data[pkg+"."+scn]){
			return __jsclazz_.Clz_Data[pkg+"."+scn];
		}
		var cons = cfg["Cons"] ,
		s = cfg["Stat"] ||{} ,// 静态方法 
		
		p = cfg["Publ"] ||{},// 公共方法 
		
		priv = cfg["Priv"]||{}; // 权限控制方法 
		
		var clz = ns[scn] = function(){
			for(var i in this._priv){
				if((!!this._priv[i]) && (!!this._priv[i].constructor)&& (!!this._priv[i].constructor.Package)&&(this !== this._priv)){
					this[i] = win._tool_pkg_.newObject(this._priv[i].constructor,this._priv[i]);
				} else {
					this[i] =  this._priv[i];
				}
			}
			this._const.apply(this,arguments);
		};
		clz.prototype = p; // 原型指定,公共方法与属性指定 
		
		clz.prototype._priv = priv;
		clz.prototype._const = cons || function(obj){
			for(var i in obj){
				this[i] = obj[i];
			}
		};
		for(var i in s){// 静态方法指定 
		
			clz[i] = s[i];
		}
		clz.Package=pkg;
		clz.ClazzName=scn;
		clz.FullName =pkg+"."+scn;
		clz["FULLNAME"] = clz.FullName;
		clz["CLASSNAME"] = scn;
		clz["PACKAGE"] = pkg;
		clz.prototype.constructor = clz;
		return __jsclazz_.Clz_Data[pkg+"."+scn] = clz;		
	};
})(window);

(function (win,undefined){
	var pwin={};
	try{
		pwin= win["parent"];
	}catch(e){
		pwin={};
	}
 	var Clear = function (o,scop){
 		try{
			if(o.scop === scop){
				for(var i in scop){
					if(scop[i] === o){
						scop[i] = undefined;
						delete scop[i];
					}
				}
			}
		}catch(e){
		
		}
		for(var i in o){
			delete o[i];
		}
	};
	var cloneObject = function (obj){
		var co = newObject(obj.constructor,obj); 
		return co;
	};
	var newObject = function(clz,cfg){
		var temp = new win._tool_pkg_.Object({});
		if(typeof cfg =='object'){
			if(cfg instanceof Array){
				temp = new win._tool_pkg_.Array([]);
				var i=0,len=cfg.length;
				for(;i<len;i++){
					if(i =='_const' || i =='_priv'){
						continue;
					}
					if((typeof cfg[i] =='object') && cfg[i].constructor && (cfg[i].constructor.Package || cfg[i] instanceof Array) ){
						if(cfg[i] instanceof Array){
							temp[i] = newObject(win._tool_pkg_.Array,cfg[i]);
						}else{
							temp[i] = newObject(cfg[i].constructor,cfg[i]);
						}
					}else{
						temp[i] =cfg[i];
					}
				}
			}else {
				for(var i in cfg){
					if(i =='_const' || i =='_priv'){
						continue;
					}
					if((typeof cfg[i] =='object') && cfg[i].constructor && (cfg[i].constructor.Package || cfg[i] instanceof Array) ){
						if(cfg[i] instanceof Array){
							temp[i] = newObject(win._tool_pkg_.Array,cfg[i]);
						}else{
							temp[i] = newObject(cfg[i].constructor,cfg[i]);
						}
					}else{
						temp[i] =cfg[i];
					}
				}
			}
			return temp; 
		}else if((!!cfg) && (typeof cfg =='number')){
			return  temp = cfg;
		}else if((!!cfg) && (typeof cfg =='string')){
			return temp = cfg;
		}else if((!!cfg) && (typeof cfg =='boolean')){
			return temp = cfg;
		}else if((!!cfg) && (typeof cfg =='undefined')){
			return temp = cfg;
		}else if((!!cfg) && (typeof cfg =='function')){
			return temp = cfg;
		}
		if(clz){
			return new clz();
		}
		return cfg;
	};
	var extend = function (clz,cfg){
		if(typeof clz =='undefined'){
			return {};
		}
		var s = cfg["Stat"] ||{} ,// 静态方法 
		
		priv = cfg["Priv"]||{}; // 权限控制方法 
		
		for(var i in priv){
			if(!!clz.prototype._priv[i]){
				//alert('extend path['+path+'] class['+clz.FullName+'] object property or function ['+i+'] has defined!!!');
				win._tool_pkg_.Tool.log('extend class['+clz.FullName+'] object property or function ['+i+'] has defined!!!');
				continue ;
			}
			clz.prototype._priv[i] = priv[i];
		}
		for(var i in s){// 静态方法或者属性指定 
		
			if(typeof clz[i] !="undefined" && (i !=='buildClass')){
				//alert('extend path['+path+'] class['+clz.FullName+'] static property or function ['+i+'] has defined!!!');
				//alert(ctc.Global.debug);
				//alert('extend path['+path+'] class['+clz.FullName+'] static property or function ['+i+'] has defined!!!');
				win._tool_pkg_.Tool.log('extend class['+clz.FullName+'] static property or function ['+i+'] has defined!!!');
				//此处是覆盖监测
				continue ;
			}
			clz[i] = s[i];
		}
		return clz;
	};
	//创建静态类 并赋予静态属性和方法
	var createClass =  function(clz){
		var _clz = win._tool_pkg_.Class({
			"pkg" : clz["package"] ||clz['pkg'],
			"clazzName" : clz["class"]||clz['clazzName']
		});
		return win._tool_pkg_.Extend(_clz, {Stat:clz});
	};
	win._tool_pkg_.Extend = extend;// 为类扩展属性、方法、静态属性、或者重写构造器 
	win._tool_pkg_.Clear = Clear ;// com.oui.Clear 
	win._tool_pkg_.cloneObject = cloneObject;// cloneObject(obj,cfg); 
	win._tool_pkg_.newObject = newObject; // com.oui.newObject(clz,cfg);
	win._tool_pkg_.createClass = createClass;//创建静态类 并赋予静态属性和方法
	
})(window); 
(function(win){
	/**
	 * 工具类
	 */ 
	win._tool_pkg_.Class({
		pkg:win._tool_pkg_.NAME,
		clazzName:"Tool",
		Stat:{
			contextPath:win["oui_context"]?win["oui_context"].contextPath:"",
			creating:{},
			debug:false,
			PACKAGE_PREFIX:null,//命名空间以该属性开始
			log:function(cfg){
				/*
				 * log({type:"info",msg:"hello log",write:function(msg){alert(msg);}});
				 */
				var me = win._tool_pkg_.Tool;
				if(me.debug != true){
					return ;
				}
				if(typeof cfg =='string'){
					cfg = {
							type:'info',
							msg:cfg,
							write:function(){
								alert(this.msg);
							}	
					};
				}
				if(typeof cfg =='undefined'){
					return ;
				}
				if(typeof cfg.msg=='undefined'){
					cfg.msg = "";
				}
				if(typeof cfg.type=='undefined'){
					cfg.type = "info";
				}
				if(typeof cfg.write !='function' ){
					cfg.write = function(){
						alert(this.msg);
					};
				}
				
				cfg.write();
			},
			Class:function (cfg){
				if(win._tool_pkg_.Tool.creating[cfg.pkg+"."+cfg.clazzName] == true){
					alert("class ["+(cfg.pkg||cfg['package'])+"."+(cfg.clazzName||cfg['class'])+"] has defined !!!");
					return ;
				}
				var _nclz = win._tool_pkg_.Class(cfg);
				win._tool_pkg_.Tool.creating[(cfg.pkg||cfg['package'])+"."+(cfg.clazzName||cfg['class'])] = true;
				return _nclz;
			},
			Extend:function(clz,cfg){
				return win._tool_pkg_.Extend(clz,cfg);
			},
			/**
			 * 创建类并附加静态方法和属性
			 */
			createClass:function(clz){
				return win._tool_pkg_.createClass(clz);
			},
			getFullPath:function(url,ctx){
				var fullPath ;
				if(url.indexOf("http")>=0 || url.indexOf("https")>=0){
					fullPath =  url;
				}else {
					fullPath =  (typeof ctx !='undefined')?(ctx+url):(win._tool_pkg_.Tool.contextPath+url);
				}
				return fullPath ;
			}
		}
	});
	/**
	 * 定义抽象类
	 */
	win._tool_pkg_.Tool.Class({
		use_par_def:false,
		pkg:win._tool_pkg_.NAME,
		clazzName:"Object",
		Cons:function (obj){ //构造器可以为空，默认为复制 构造参数的属性到对象
			if(!obj){
				return ;
			}
			for(var i in obj){
				this[i] = obj[i];
			}
		}
	});
	


	/*
	 *
	 对象克隆机制
	 var obj = new com.oui.Object({
	 	a:new com.oui.Object({b:
	 		new com.oui.Object({c:
	 			new com.oui.Object({d:new com.oui.Object({
	 				e:function(){alert('e..');},
	 				f:function(f){alert(f+'f..');}
	 			})})
	 		})
	 	})
	 }); 
	 obj = new com.oui.Array([
	 	new com.oui.Object({b:
	 		new com.oui.Object({c:
	 			new com.oui.Object({d:new com.oui.Object({
	 				e:function(){alert('e..');},
	 				f:function(f){alert(f+'f..');}
	 			})})
	 		})
	 	})
	 ]);
	 var obj2 = new com.oui.Object({
	 	x:obj,
	 	a:new com.oui.Object({b:
	 		new com.oui.Object({c:
	 			new com.oui.Object({d:new com.oui.Object({
	 				e:function(){alert('e..');},
	 				f:function(f){alert(f+'f..');}
	 			})})
	 		})
	 	})
	 });  
	 
	 obj.id =1;
	 obj.arr.id =1;
	 var cobj= com.oui.cloneObject(obj);
	 cobj.arr.id =2;
	 
	 cobj.id =2;
	 //cobj.value.push('a');
	 //cobj.value.push('b');
	// obj.value.push('d');
	 //obj.value.push('e');
	 var dobj = com.oui.cloneObject(obj);
	 dobj.id =3;
	 obj.getArray()[0].b.id =1;
	 cobj.getArray()[0].b.id =2;
	 dobj.getArray()[0].b.id =3;
	 
	 obj.getArray()[0].b.c.d.e = 1;
	 cobj.getArray()[0].b.c.d.e = 2;
	 dobj.getArray()[0].b.c.d.e = 3;
	 alert(obj.getArray()[0].b.c.d.e);
	 alert(cobj.getArray()[0].b.c.d.e );
	 alert(dobj.getArray()[0].b.c.d.e ); 
	 alert(com.oui.ToJSONString(obj));
	 
	 var obj3 = com.oui.cloneObject(obj2);
	 obj3.x.getArray()[0].b.c.d.e ='x';
	 	com.Tool.getCurrActive().data
	 var obj4 = com.oui.cloneObject(obj2);
	 obj4.x.getArray()[0].b.c.d.e ='y';
	 
	 var obj5 = com.oui.cloneObject(obj2);
	 obj5.x.getArray()[0].b.c.d.e ='z';
	 
	 alert(obj2.x.getArray()[0].b.c.d.e); 
	 alert(obj3.x.getArray()[0].b.c.d.e); 
	 alert(obj4.x.getArray()[0].b.c.d.e); 
	 alert(obj5.x.getArray()[0].b.c.d.e); 
	 */


	win._tool_pkg_.Tool.Class({
		use_par_def:false,
		pkg:win._tool_pkg_.NAME,
		clazzName:"Array",
		Cons:function (obj){ // 构造器可以为空，默认为复制 构造参数的属性到对象 
		
			this.__arr = new Array();
			this.__arr.constructor = Array;
			if(!obj){
				return ;
			}
			var i=0,len=obj.length;
			for(;i<len;i++){
				this.__arr.push(win._tool_pkg_.newObject(obj[i].constructor,obj[i]));
			}
			this.length = obj.length;
		}, 
		Stat:{
		},
		Publ:{// 公共方法或者属性，可以为空 
		
			 
		}, 
		Priv:{ 
			getArray : function(){
				return this.__arr;
			},
			getLength:function(){
				return this.length;
			}
		}
	});
	/**
	 * 定时器类
	 */
	win._tool_pkg_.Tool.Class({
		use_par_def:false,
		pkg:win._tool_pkg_.NAME,
		clazzName:"Runner",
		Cons:function (obj){ //  构造器可以为空，默认为复制 构造参数的属性到对象  
			for(var i in obj){
				this[i] = obj[i];
			}
		},  
		Priv:{ // 权限方法、或者属性，可以为空 
		
			isClose:false, // 外部可以使用 
			
			thread:null,// 私有属性，不提供外部使用 
			
			time:1,// 提供外部重写,间隔执行时间 
			
			run:function (){// 运行方法,提供外部重写 
			
				
			}
			,
			init:function(){// 初始化,提供外部重写 
			
				
			},
			onStop:function(){ // 监听停止事件,提供外部重写 
			
			
			},
			/**
			 * 启动进度条	
			 */
			start: function(){// 提供外部调用，开始(不能重写) 
			
				this.isClose = false;
				this.init();
				if(this.thread ==null  ){
					var me = this;
					this.thread = window.setInterval(function (){
						me.update(); 
					},this.time);
				}
			},
			/**
			 * 停止进度条 
			 */
			stop:function (){// 外部可以调用停止运行的方法,不能重写 
			
				this.isClose = true;
				if(this.thread !=null  ){
					window.clearInterval(this.thread);
		    		this.thread=null;
		    		this.onStop();// 在停止后执行的方法调用 
		    		
				}
			},
			update : function (id){// 私有方法,外部无需调用,不能重写 
			
				this.run();
				if( this.isClose == false){
					return ;
				} else if(this.isClose == true){
					this.stop();
				}
			}
		}
	});
	
	
	/**
	 *
	 *	 * 队列类
	 queue  examples
	 var qu1= com.oui.Queue.createNewQueue();
	qu1.addAll([{
		run:function(){
			var me = this;
			alert(this.id);
			window.setTimeout(function(){
				me.inited = true;
			},60);
		}
	},{
		run:function(){
			alert(this.id);
			var me =this;
			me.inited = true;
		}
	}]);
	var qu2= com.oui.Queue.createNewQueue();
	qu2.addAll([{
		run:function(){
			alert(this.id);
			var me = this;
			window.setTimeout(function(){
				me.inited = true;
			},50);
		}
	},{
		run:function(){
			alert(this.id);
			var me =this;
			me.inited = true;
		}
	}]);

	 qu2.add({
		run:function(){
			var me = this;
			alert(this.id);
			window.setTimeout(function(){
				me.inited = true;
			},60);
		}
	 }).start(function(){
	 	alert('qu2 over..');
	 });
	 qu1.start(function(){
	 	alert('qu1 over..');
	 },1);  

	 */
	win._tool_pkg_.Tool.Class({
		use_par_def:false,
		pkg:win._tool_pkg_.NAME,
		clazzName:"Queue",
		Cons:function (obj){ // 构造器可以为空，默认为复制 构造参数的属性到对象 
		
			for(var i in obj){
				this[i] = obj[i];
			}
		}, 
		Stat:{
			queue:null,
			queues:[],
			createNewQueue:function(){
				var o =new win._tool_pkg_.Queue({queues:[],id:win._tool_pkg_.Queue.queues.length });
				win._tool_pkg_.Queue.queues.push( o);
				return o;
			},
			//com.oui.Queue.getQueue().add();
			/*
			*com.oui.Queue.getQueue().addAll([{
				run:function(){
					alert(1);
					var me = this;
					window.setTimeout(function(){
						me.inited = true;
					},50);
				}
			},{
				run:function(){
					alert(2);
					var me =this;
					me.inited = true;
				}
			}]).start();
			
			var qu = com.oui.Queue.createNewQueue();
	      	qu.addAll([{
	      		time:300,
	      		run:function(){
	      			com.oui.$$("#form_div").html("<div style='color:red'>"+this.id+"</div>");
	      			alert(1);
	      		}
	      	} ]);
	      	qu.runAuto(function(){
	      		
	      	},300);
			
			com.oui.Queue.getQueue().add({
				run:function(){
					alert(4);
					var me =this;
					me.inited = true;
				}
			});
			com.oui.Queue.getQueue().add({
				run:function(){
					alert(3);
					var me =this;
					me.inited = true;
				}
			});
			
			*/
			getQueue:function(){
				if(win._tool_pkg_.Queue.queue == null){
					win._tool_pkg_.Queue.queue = new win._tool_pkg_.Queue({queues:[]});
				}
				return win._tool_pkg_.Queue.queue;
			}
		},
		Publ:{// 公共方法或者属性，可以为空 
		
			 
		}, 
		Priv:{ // 权限方法、或者属性，可以为空 
		
			queues:[],
			/**
			 *
			 		{	 
			 			run:function(){
			 				
			 			} 
					}
			 */
			add:function(cfg){
				if(!cfg){
					return this;
				}
				if(!cfg.run){
					return this;
				}
				var me = this;
				var obj ={
					inited:false, // run方法执行结束 
					
			 		created:false,// 创建queue对象，在运行runFirst后 改变状态为true 
			 		
			 		run: cfg.run || function(){ },
					runFirst:function(){
						if(this.created==true){
							return this;
						}else{
							this.created=true;
						}
						try{
							this.run();
						}catch(e){
							this.inited = true;
						}
						return this;
					},
					id:me.queues.length
				};
				for(var i in cfg){
					if(i == 'run'){
						continue;
					}
					obj[i] = cfg[i];
				}
				me.queues.push(obj);
				return me;
			},
			addAll:function(objs){
				var len = objs.length,i=0;
				for(;i<len;i++){
					this.add(objs[i]);
				}
				return this;
			},
			runQueue:function(time){
				var me = this;
				if(me.queues == null || me.queues.length ==0){
					me.callback();
					return ;
				}
				win.setTimeout(function(){
					
					var first = me.queues.shift();
					if(first !=null){
						first.runFirst();
						me.runQueue(time);
					}
				}, me.queues[0]["time"]==null?(time||10):me.queues[0]["time"]);
			},
			runAuto:function(callback,time){
				var me = this;
				var len = me.queues.length;
				if(len <=0){
					return ;
				}
				me.callback = callback;
				me.runQueue(time);
			},start:function(callback,time){
				var me = this;
				var pb = new win._tool_pkg_.Runner({
					time:time||10,
					startTime:new Date(),
					idx:0,
					queue:me,
					callback:callback||function(){},
					onStop: function(){
						pb.callback();
						this.queue.queues.length =0;
						win._tool_pkg_.Clear(pb);
						pb = undefined;
					},
					run:function(){
						var me = this;
						if(typeof this.queue =='undefined' ){
							this.stop();
							return ;
						}
						this.queue.idx = this.idx;
						if(typeof this.queue.queues=='undefined' || this.idx >=this.queue.queues.length){
							this.stop();
							return ;
						}
						
						if(this.queue.queues[this.idx].runFirst().inited == true ){
							this.idx ++;
						}
					}
				});
				pb.start();
				return this;
			}			
		}
	});
	
	/**
	 * 全局变量存储类
	 */
	win._tool_pkg_.Tool.Class({
		use_par_def : true,
		pkg : win._tool_pkg_.NAME,
		clazzName : "Data",
		Stat : {
			objs : []
		}
	});
})(window);





