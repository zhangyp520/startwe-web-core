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
})(window);;
/**
 * 封装业务组件类
 * @param win
 */
(function(win){
	
	//TODO INIT BROWSER 
	
	
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

	
	
})(window);

/**
 * @class _tool_pkg_.cfg.JsClassPath
 * js依赖关系配置数据
 * _tool_pkg_.cfg.JsClassPath.js
 */
(function(win){
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
})(window);
/**
 * @class _tool_pkg_.cfg.CssClassPath
 * js依赖关系配置数据
 * _tool_pkg_.cfg.CssClassPath.js
 */
(function(win){
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
})(window);
/**
 * json处理工具
 * encode
 * decode
 * clone
 * @param win
 */
(function(win){

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

})(window);

/**
 * 公共的事件处理组件
 */
(function(win) {
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
	if(!oui.os.mobile){ //保持pc上运行
		Events.init(); //默认执行初始化绑定事件
	}
})(window);;
/**
 * pc phone 公共common
 */
var test4Date = new Date();
(function () {
    var FlowBiz = {
        'package': 'oui.flow',
        'class': 'FlowCommon',
        flowData: {
        },
        isNotCheckSaved:false,// 默认需要再页面离开时校验 是否已经保存
        newId: 0, //生成数据关系id
        toProcessProps:false,//是否显示流程属性面板页签
        isVertical: true,//是否竖向输出
        zoomScale: 1, //缩放比例
        themeId: 1,// 1,底色填充 2、无底色填充
        newId4server: 2, //生成 前端jsuuid,默认占用 开始和结束节点
        contextMenus: {},
        //拦截方法Before用于执行 隐藏tips或者隐藏actionSheet弹框
        eventBefore2hideTipsOrActionSheetFunNames: 'event2setAutoBranch,event2setSelectBranch,event2deleteBranch,event2replaceNode,event2editProp,event2addNode,event2delNode,event2addBrotherNode,event2delCurrNode,event2trans,event2vertical,event2renderByThemeId',
        eventBefore2validateFunNames:'saveWorkFlow,event2addNode,event2addBrotherNode,event2replaceNode,event2editProp,event2trans,event2vertical,event2processProps,event2processGraph',
        /**
         * 设置拦截配置
         */
        setInterceptFuns: function (funNames, fun) {
            var arr;
            var _self = this;
            if (typeof funNames == 'string') {
                arr = funNames.split(',');
            } else {
                arr = funNames || [];
            }
            var funName;
            for (var i = 0, len = arr.length; i < len; i++) {
                funName = arr[i];
                if (!funName) {
                    continue;
                }
                _self[funName + 'Before'] = fun;
            }
        },
        /*
         *获取FlowUi方法
         */
        getFlowUi: function () {
            throw new Error('未实现getFlowUi方法');
        },
        getFlowBiz: function () {
            throw new Error('未实现getFlowBiz方法');
        },
        nodeIdMap: {}, //key为节点id ,值为 树结构的treeNode对象
        initStart: function (param) {
            var _self = this;
            _self.design4Runtime = oui.getParam('design4Runtime')=='true'?true:false;
            _self.offsetY = 100; //横向 160 纵向为100
            _self.x_distance_S = 60; //横向为80 纵向为60

            _self.x_distance = 180 - _self.offsetY; //横向120
            _self.y_distance = 100;
            _self.rootPosX = 150; //第一个节点 左偏移量

            _self.nodeWidth = 65;
            _self.nodeHeight = 65;
            _self.nodeSplitWidth = 16;
            _self.rootPosY = 10;

            _self.Events = {
                click: 'click', //pc 上点击事件,移动上轻触摸事件 touchstart
                actionMenu: 'contextmenu' //pc上 右键菜单事件,移动上用touchstart
            };
            if (oui.os.mobile) {
                _self.Events = {
                    click: 'tap', //pc 上点击事件,移动上轻触摸事件 touchstart
                    actionMenu: 'tap' //pc上 右键菜单事件,移动上用touchstart
                };
                _self.isVertical= true;
            }else{
                if(_self.isFlowNew){ // 在流程新建 时，默认pc为 横向
                    _self.flowData.viewType = _self.ViewType.horizontal.value;
                }
                _self.isVertical= false;
            }
            //if(_self.isVertical){
            //    _self.nodeHeight = 65+_self.nodeSplitWidth;
            //}
            var FlowUi = this.getFlowUi();
            FlowUi.setBiz(_self);
            _self.initAttrsByUrlParam();
            FlowUi.config = $.extend(true, FlowUi.config, FlowUi.themes[_self.themeId] || {});
            template.helper('oui', oui);
            template.helper('FlowBiz', _self);
            template.helper('console',console);
            oui.parse();
            FlowUi.render();
            _self.setInterceptFuns(_self.eventBefore2validateFunNames,function(cfg){ //校验拦截初始化
                //update formData
                //校验之前需要保存流程属性
                _self.updateWorkFlowProps(); //更新流程属性后 再校验 保证正确性
                var isCheck =  _self.validate();
                if(!isCheck){
                    return false;
                }
            });
        },
        /**
         * 根据url参数 初始化 FlowBiz的参数
         */
        initAttrsByUrlParam: function () {
            var urlparam = oui.getParam();
            var _self = this;
            for (var i in urlparam) {
                if ((urlparam[i] && urlparam[i] == 'true')) {
                    _self[i] = true;
                }
                else if ((urlparam[i] && urlparam[i] == 'false')) {
                    _self[i] = false;
                } else {
                    _self[i] = urlparam[i];
                }
            }
        },
        //初始化结束接口
        initEnd: function () {
            var _self = this;
            _self.inited = true;
            data  =_self.flowData;
            _self.oldProcessPropData = {
                name: data.name ||"",
                //rights: oui.parseString(data.rights ||[]),
                importance: data.importance
            };
            /** urldialog打开的场景 初始化完成后，根据外部传入workflowJSON渲染****/
        },
        /**
         * 当页面第一次改变后触发 效果改变接口
         */
        changeView :function(){

        },
        /**
         * 根据 服务端data数据 转换为前端需要的数据进行流程图显示
         * @param data
         * @returns {*}
         */
        serverData2Model: function () {
            var _self = this;
            var workFlowNodeList = _self.flowData.workFlowNodeList || [];
            var parentId = '';
            var nodeType = '';
            if(_self.flowData.viewType==_self.ViewType.vertical.value){ //横向纵向判断
                _self.isVertical = true;
            }else{
                _self.isVertical = false;
            }
            if(_self.isPreview){ //预览态流程 需要处理启动者的显示名称
                if(workFlowNodeList && workFlowNodeList[0] ){
                    workFlowNodeList[0].nodeDisplayName = _self.currLoginNodeName;
                    workFlowNodeList[0].nodeName=_self.currLoginNodeName;
                    workFlowNodeList[0].nodeId=_self.currLoginNodeId;
                }
            }
            for (var i = 0, len = workFlowNodeList.length; i < len; i++) {
                workFlowNodeList[i].name = workFlowNodeList[i].nodeDisplayName;

                parentId = workFlowNodeList[i].parentId || [];
                if (typeof parentId !== 'object') {
                    parentId = [parentId];
                }
                nodeType = workFlowNodeList[i].nodeType;
                if (nodeType && nodeType == 'join') {
                    workFlowNodeList[i].isJoin = true;
                }
                if (nodeType && nodeType == 'split') {
                    workFlowNodeList[i].isSplit = true;
                }
                if (nodeType && nodeType == 'end') {
                    workFlowNodeList[i].isEnd = true;
                }
                workFlowNodeList[i].id = workFlowNodeList[i].id + '';
                workFlowNodeList[i].pid = parentId ? parentId.join(',') : "";
                _self.nodePersonMap2nodePersonList(workFlowNodeList[i]);
            }
        },
        /**
         * 将流程节点上的 nodePersonMap转为 nodePersonList
         * @param node
         */
        nodePersonMap2nodePersonList:function(node){
            var _self = this;
            if(!_self.isIndex){
                return ;
            }
            var arr = [];
            node.nodePersonList = node.nodePersonList || arr;
            var comments = [];
            var nodePersonList = node.nodePersonList;
            for(var i= 0,len=nodePersonList.length;i<len;i++ ){
                if(nodePersonList[i].comment){
                    comments.push(nodePersonList[i].comment);
                }
            }
            node.comments = comments;
            //var nodePersonMap = node.nodePersonMap;
            //var comments = [];
            //for(var i in nodePersonMap){
            //    if(nodePersonMap[i].comment){
            //        comments.push(nodePersonMap[i].comment);
            //    }
            //    arr.push(nodePersonMap[i]);
            //}
            //node.comments = comments;
            //node.nodePersonList = arr;
        },
        /**
         * 前端模型数据转后端数据
         */
        model2ServerData: function () {
            var _self = this;
            var workFlowNodeList = _self.workFlowNodeList || [];
            var pid = '';
            var workFlowNodeNamesArr = [];
            for (var i = 0, len = workFlowNodeList.length; i < len; i++) {
                workFlowNodeList[i].nodeDisplayName = workFlowNodeList[i].name ||workFlowNodeList[i].nodeName;
                pid = (workFlowNodeList[i].pid + '') || '';

                if (workFlowNodeList[i].isSplit) {
                    workFlowNodeList[i].nodeType = "split";
                    workFlowNodeList[i].nodeName = undefined;
                    workFlowNodeList[i].nodeDisplayName = undefined;
                    workFlowNodeList[i].nodeId = undefined;
                }
                if (workFlowNodeList[i].isJoin) {
                    workFlowNodeList[i].nodeType = "join";
                    workFlowNodeList[i].nodeName = undefined;
                    workFlowNodeList[i].nodeDisplayName = undefined;
                    workFlowNodeList[i].nodeId = undefined;
                }
                if (workFlowNodeList[i].isEnd) {
                    workFlowNodeList[i].nodeType = "end";
                    workFlowNodeList[i].nodeName = undefined;
                    workFlowNodeList[i].nodeDisplayName = undefined;
                    workFlowNodeList[i].nodeId = undefined;
                }
                if(workFlowNodeList[i].nodeName){
                    workFlowNodeNamesArr.push(workFlowNodeList[i].nodeName);
                }
                workFlowNodeList[i].parentId = pid ? pid.split(',') : undefined;
            }
            _self.flowData.workFlowNodeNames= workFlowNodeNamesArr.join(","); // 将节点名称存放到 workFlowNodeNames上
            if(!_self.flowData.bizId){
                _self.flowData.bizId =  _self.flowData.moduleId;
                _self.flowData.bizType =  _self.flowData.moduleType;
            }
        },
        getFlowData: function () {
            var _self = this;
            _self.model2ServerData(); //先转换为后端需要的数据
            var flowData = _self.flowData;
            flowData.workFlowNodeList = _self.workFlowNodeList;
            return flowData;
        },
        /**
         *  流程保存成功回调
         * @param msg
         */
        saveWorkFlowCallback: function (msg, cfg) {
            console.log('save workflow callback...');
            var _self = this;
            var id = msg.id;
            msg.isNew = _self.isFlowNew;
            _self.flowData.id = id;
            //window.parent.oui.showAutoTips({content: '保存成功'});
            if (!cfg) {
                return;
            }
            var saveType = $(cfg.el).attr('saveType');
            if (saveType == 'save4test') { //保存并测试返回结果
                //根据Id 查询 流程定义数据 并根据id获取数据 验证所有属性的回填情况

                //_self.getWorkFlowFromServer(cfg); //根据Id请求服务端 流程数据
            }
            var saveWorkFlowCallbackBiz = _self.moduleBizController || $(cfg.el).attr('saveWorkFlowCallbackBiz');

            if(saveWorkFlowCallbackBiz && (saveType=='save4test')){
                var successFun = function(msg){
                    _self.getWorkFlowFromServerCallback(msg, cfg, id);
                }
                var errorFun = function(msg){
                    _self.getWorkFlowFromServerError(msg, cfg, id);
                };
                var saveSuccess = function(msg){
                    eval(saveWorkFlowCallbackBiz + '.getWorkFlowFromServer(successFun,errorFun);');
                }
                var saveError = function(msg){
                    eval(saveWorkFlowCallbackBiz + '.getWorkFlowFromServer(successFun,errorFun);');
                }
                try {
                    eval(saveWorkFlowCallbackBiz+'.saveWorkFlowSuccess(msg,cfg,saveSuccess,saveError)');

                } catch (eve) {
                    throw eve;
                }
            }
            if (saveWorkFlowCallbackBiz) {

                try {
                    eval(saveWorkFlowCallbackBiz + '.saveWorkFlowSuccess(msg,cfg);');
                } catch (eve) {
                    throw eve;
                }
            }
            //console.log(msg); //保存成功回调
        },
        /**
         * 流程保存失败回调
         * @param msg
         */
        saveWorkFlowError: function (msg, cfg) {
            var _self = this;
            if (typeof msg == 'string') {
                console.log(msg);
            }
            console.log('保存流程模板失败');
            if (!cfg) {
                return;
            }
            var saveWorkFlowCallbackBiz = _self.moduleBizController || $(cfg.el).attr('saveWorkFlowCallbackBiz');
            if (saveWorkFlowCallbackBiz) {
                if(eval(saveWorkFlowCallbackBiz) ==_self){
                    return ;
                }

                try {
                    eval(saveWorkFlowCallbackBiz + '.saveWorkFlowError(msg,cfg);');
                } catch (eve) {
                    throw eve;
                }
            }
        },
        /**
         * 获取服务端流程数据 回调
         * @param msg
         * @param cfg
         * @param id
         */
        getWorkFlowFromServerCallback: function (msg, cfg, id) {
            //console.log('加载服务端流程数据数据成功:id=' + id);
            //console.log(msg);
            var _self = this;
            if (!cfg) {
                return;
            }
            if (!cfg.el) {
                return;
            }
            var saveType = $(cfg.el).attr('saveType');
            if (saveType == 'save4test') { //保存并测试返回结果
                var currFlowData = _self.getFlowData();
                _self.testCompareJson(currFlowData, msg);
            }
        },
        testCompareJson: function (leftJson, rightJson) {
            var Tool = oui.biz.Tool;
            var _self = this;
            var leftJsonStr = Tool.encode(leftJson);
            var rightJsonStr = Tool.encode(rightJson);
            if (typeof oui.showCompareJsonDialog == 'undefined') {

                Tool.require(['res_engine/workflow/compareJson.js'], function () {
                    _self.testCompareJson4recuired(leftJsonStr, rightJsonStr);
                });
                return;
            }
            _self.testCompareJson4recuired(leftJsonStr, rightJsonStr);
        },
        /**
         * 如果已经加载了请求资源则直接调用测试 json比较工具
         * @param leftJson
         * @param rightJson
         */
        testCompareJson4recuired: function (leftJson, rightJson) {
            oui.getTop().oui.showCompareJsonDialog({leftJson: leftJson, rightJson: rightJson});
        },
        getWorkFlowFromServerError: function (msg, cfg, id) {
            console.log('加载服务端流程数据数据失败;id=' + id);
            console.log(msg);

        },
        /**
         *  根据流程id获取服务端数据
         */
        getWorkFlowFromServer: function (cfg) {
            var _self = this;
            oui.getTop().oui.alert('流程图 没有实现getWorkFlowFromServer接口');
            //var id = _self.flowData.id;
            //var contextPath = oui.getContextPath();
            //var flowId = oui.getPageParam('encodeFlowId');
            //var url = oui.addParams(contextPath + "workflow/workflow.do", {flowId: id});
            //url = attachSecurityParam(url,flowId);
            //oui.getData(contextPath + "workflow/workflow.do",url, function (result) {
            //    if (result.success) {
            //        var msg = oui.parseJson(result.msg);
            //        _self.getWorkFlowFromServerCallback(msg, cfg, id);
            //    } else {
            //        _self.getWorkFlowFromServerError(msg, cfg, id);
            //    }
            //});
        },
        /**
         * 更新流程属性
         */
        updateWorkFlowProps:function(){
            var _self = this;
            if(!$.trim($("#flow-ui-processProp").html())){ //没有渲染过流程属性面板
                return ;
            }
            var data = _self.getFlowData();
            var propData = oui.getFormValue();
            var propData4Display = oui.getFormData();
            if(propData.selectPerson4right){
                propData.selectPerson4right = propData4Display.selectPerson4right;
            }
            $.extend(true,data,propData);
            var selectPerson4right = propData.selectPerson4right ||'[]';
            var selectPerson4rightJson = oui.parseJson(selectPerson4right);
            var rights = [];
            for(var i= 0,len=selectPerson4rightJson.length;i<len;i++){
                rights.push({
                    toId:selectPerson4rightJson[i].id,
                    toName:selectPerson4rightJson[i].name,
                    toType:selectPerson4rightJson[i].typeFlag
                });
            }
            data.rights = rights;
        },
        ///**
        // * 将流程表单 转为应用表单
        // * @param cfg
        // */
        //transToApp:function(cfg){
        //    var formId =oui.getParam('moduleId'); //表单Id
        //    var _self = this;
        //    var url = oui.getContextPath() + "form/form.do?method=formAppRight&formId=" + formId;
        //    oui.getTop().oui.confirmDialog('确认转换为无流程表单',function(){
        //        if(oui.os.mobile){
        //            //TODO 移动端  url路径与pc端路径不同
        //            oui.go('appAuthority', {
        //                formId: formId
        //            },true);
        //            return ;
        //        }
        //        window.parent.location.href =url;
        //    },function(){
        //
        //    },{title:'确认？'});
        //},
        /**
         * 触发页面改变逻辑
         */
        changed:function(){
            var _self = this;
            if(!this.isEdit){
                return;
            }
            if (this.inited) {
                this.hasChange = true;
                this.changeView();
            }
        },

        /**
         * 判断页面是否改变
         * @returns {boolean}
         */
        hasSaveData:function(){
            var _self = this;
            if(_self.isNotCheckSaved){
                return true;
            }

            //_self.updateWorkFlowProps(); //首先更新 流程属性
            //var oldData= _self.oldProcessPropData;
            //var flowData = _self.flowData;
            //if(oldData.importance != flowData.importance){ //判断流程重要程度是否变更
            //    return false;
            //}
            //if(oldData.name != flowData.name){ //判断流程名称是否变更
            //    return false;
            //}
            //if(oldData.rights != oui.parseString(flowData.rights ||[])){ //判断 流程权限是否变更
            //    return false;
            //}
            return !this.hasChange;
        },
        /***保存时需要清空 缓存的Dialog对象 ***/
        clear4topDialog:function(){
            try{
                var _self = this;
                if(_self.editPropDialog){
                    var el = _self.editPropDialog.getEl();
                    oui.getTop().oui.clearByContainer(el);
                    oui.getTop().$(el).remove();
                }
                if(_self.editBranchDialog){
                    var el = _self.editBranchDialog.getEl();
                    oui.getTop().oui.clearByContainer(el);
                    oui.getTop().$(el).remove();
                }
            }catch(e){

            }
        },
        /**
         * 保存工作流定义
         */
        saveWorkFlow: function (cfg) {
            var _self = this;
            var data = _self.getFlowData();
            var contextPath = oui.getContextPath();
            //保存前校验
            var isCheck = oui.validate4value(data.workFlowNodeList.length,{
                failMsg:'流程节点数不能小于{{validateValue}}' ,
                minValue:_self.ValidateConfig.workFlowNodeListMinSize,
                failMode:_self.ValidateConfig.failMode
            });
            if(!isCheck){
                return false;
            }
            _self.clear4topDialog();
            //_self.saveWorkFlowCallback.call(_self, data, cfg);
            var saveUrl = oui.getPageParam('saveWorkFlowUrl');
            oui.postData(saveUrl, data, function (response) {
                if (response.success) {
                    _self.hasChange = false; //保存提交后 ，数据为没改变状态
                    _self.isNotCheckSaved = true; //保存提交后， 不需要校验是否保存
                    var msg = oui.parseJson(response.msg);
                    _self.saveWorkFlowCallback.call(_self, msg, cfg);
                }
            }, function (msg) {
                _self.saveWorkFlowError.call(_self, msg, cfg);
            });
        },
        /**
         * 初始化默认值
         */
        init4default:function(){
            var _self = this;
            $.extend(true,_self,{
                flowData:{
                    state:_self.StateEnum.enable.value,
                    viewType:_self.ViewType.vertical.value,
                    importance:_self.WorkFlowImportance.normal.value
                }
            })
        },
        /**
         * 转到我的列表页面
         */
        event2formList:function(){
            var _self = this;
            _self.clear4topDialog();
            var url = oui.getPageParam("returnFormListUrl");
            var param = {
                formType:"bizForm"
            };
            url = oui.addParams(url,param);
            oui.getTopMain().oui.go(url,{},true);
            return false;
        },
        /**
         * 清空流程节点
         */
        clearNodes:function(cfg){
            var _self = this;
            /** 清空后，权限只能是默认编辑****/
            //var lastFirstNode = _self.workFlowNodeList[0];
            //lastFirstNode = lastFirstNode || _self.emptyNodes[0];
            //var formRight = lastFirstNode.formRight ||'-2';
            _self.workFlowNodeList = [];

            $.each(_self.emptyNodes,function(){
                _self.workFlowNodeList.push($.extend(true,{},this));
            });
            _self.workFlowNodeList[0].formRight = '-2';
            _self.flowData.workFlowNodeList = _self.workFlowNodeList;
            _self.serverData2Model();
            _self.refresh();
        },
        /** 初始化空节点 **/
        initEmptyNodes:function(workFlowJson,param){
            var _self = this;
            var arr = [//发起人的默认权限时撤销流程
                {"id":"jsuuid-1","nodeType":'person',"nodeDisplayName":"发起人",formRight:'-2',nodeRight:_self.WorkFlowNodeRight.cancel.name, "nodeName":param.currLoginNodeName,'nodeId':param.currLoginNodeId},
                {"id":"jsuuid-2","nodeType":'end',"nodeName":"end","nodeId":"end","parentId":["jsuuid-1"]}
            ];
            if((!workFlowJson) || (!workFlowJson.workFlowNodeList) ||(workFlowJson.workFlowNodeList.length<2) ){
                _self.emptyNodes = arr;
                return _self.emptyNodes;
            }
            _self.emptyNodes = [
                {"id":workFlowJson.workFlowNodeList[0].id,"nodeType":'person',"nodeDisplayName":"发起人" ,nodeRight:workFlowJson.workFlowNodeList[0].nodeRight||"","nodeName":param.currLoginNodeName,'nodeId':param.currLoginNodeId},
                {"id": workFlowJson.workFlowNodeList[workFlowJson.workFlowNodeList.length-1].id,"nodeType":'end',"nodeName":"end","nodeId":"end","parentId":[workFlowJson.workFlowNodeList[0].id]}
            ];
            return _self.emptyNodes;
        },
        /**默认值全部勾选 ****/
        findNodeRightValue:function(node){
            var _self = this;
            if(node&&node.nodeRight){
                return node.nodeRight;
            }else{
                return [_self.WorkFlowNodeRight.addNodes.name,_self.WorkFlowNodeRight.rollBack.name,_self.WorkFlowNodeRight.stop.name,_self.WorkFlowNodeRight.notify.name].join(',')
            }
        },
        /**
         * 初始化流程图渲染
         */
        init: function (param) {
            /** 初始化 判断是否在弹框里面设置了流程图数据***/
            var ouiInDialog = oui.getParam('ouiInDialog');
            var ouiDialogId = oui.getParam('ouiDialogId');
            if(ouiDialogId&&ouiInDialog){
                var currDialog = oui.getCurrUrlDialog();
                if(currDialog){
                    var workflowJSON = currDialog.attr('workflowJSON');
                    if(workflowJSON){
                        if(typeof workflowJSON =='object'){
                            workflowJSON =oui.parseString(workflowJSON);
                            workflowJSON = workflowJSON.replace(/jsuuid-/ig,oui.getUUIDLong());
                        }
                        param.workFlowJSONStr = workflowJSON;
                    }
                }
            }

            if((!param) || (typeof param !='object')){
                throw new Error('oui.flow.FlowBiz.init流程初始化必须传入对象参数');
                return ;
            }
            var sd = new Date();
            var _self = this;
            /************************************* 一、初始化流程中属性的默认值*********************************************/
            _self.init4default();
            /************************************* 二、url参数处理*********************************************/
            _self.urlParam =oui.getParam() ||{}; //保存url参数
            if( (!_self.urlParam.method) || (_self.urlParam.method=='viewFlowDiagram')  ){
                _self.isIndex = true;
            }else{
                _self.isIndex = false;
            }

            if(_self.urlParam.hideSaveButton && _self.urlParam.hideSaveButton =='true'){ //隐藏保存按钮
                _self.isHideSaveButton = true; //是否隐藏保存按钮
            }else{
                _self.isHideSaveButton = false;
            }
            if(_self.isIndex){
                _self.isHideSaveButton = true;
            }
            /************************************* 三、流程初始化页面传入参数逻辑处理******************************/
            var workFlowJson = null;
            if(param.workFlowJSONStr && (param.workFlowJSONStr !='null')){
                /** 更新 */
                workFlowJson = oui.parseJson(param.workFlowJSONStr);
                /*** 缓存发起节点和结束节点 */
                _self.initEmptyNodes(workFlowJson,param);
            }else{
                /** 新增 **/
                /*** 缓存发起节点和结束节点 */
                _self.initEmptyNodes(null,param);
                var arr = [];
                $.each(_self.emptyNodes,function(){
                   arr.push($.extend(true,{},this));
                });
                workFlowJson ={
                    workFlowNodeList:arr
                };
            }

            param.flowData = workFlowJson;
            if(param.isPreview){
                param.isHideSaveButton = true;
            }
            /************************************** 四、与业务模块集成流程的 逻辑处理 api调用  开始*****************/
            var controller = $('body',window.parent.document).attr('oui-controller');
            var moduleBizController =controller;
            if(controller && (window !=window.parent)){ //流程图 被父页面通过iframe嵌套了
                moduleBizController = 'window.parent.'+controller;
            }else{ //页面 include html集成 业务模块类型通过url参数传入,其他参数在模块业务类中定义相关接口
                //通过url传入 模块类型参数, 模块业务中实现相关逻辑
                moduleBizController= window.FlowBizModuleController; //根据业务模块定义 业务控制器类
                 // window open的页面集成 或者url参数传入的集成方式
                //TODO 需要完善 集成逻辑 //所有参数接口通过url参数定义

            }
            try{
                if((!param.workFlowJSONStr) || (param.workFlowJSONStr=='null')){ //新建时根据父页面的api获取模块信息,或者根据集成的业务模块api获取模块信息
                    var json = eval(moduleBizController+'.getWorkFlowJson4String()');//接口获取
                    var moduleJson = oui.parseJson(json);
                    $.extend(true,param.flowData,moduleJson);
                }
            }catch (e){

            }
            $.extend(true, _self, param); //将参数拷贝到 oui.flow.FlowBiz上
            /************************************ 五、服务端数据转前端渲染数据、pc端、phone端等业务子类的初始化开始的调用*********/
            _self.moduleBizController = moduleBizController; //初始化存放 外部模块的biz类

            _self.serverData2Model(); //服务端数据转换为前端数据
            _self.initStart(param); //初始化参数 ，并将url参数存到 FlowBiz上

            if(_self.isEdit){ //编辑态对流程节点属性编辑时所需
                _self.chooseTypeItemsJson = oui.parseString([
                    {display:_self.WorkFlowChooseType.single.desc,value:_self.WorkFlowChooseType.single.value},
                    {display:_self.WorkFlowChooseType.multi.desc,value:_self.WorkFlowChooseType.multi.value},
                    {display:_self.WorkFlowChooseType.all.desc,value:_self.WorkFlowChooseType.all.value},
                    {display:_self.WorkFlowChooseType.competition.desc,value:_self.WorkFlowChooseType.competition.value}
                ]);
                _self.nodeRightItemsJson = oui.parseString([
                    {display:_self.WorkFlowNodeRight.addNodes.desc,value:_self.WorkFlowNodeRight.addNodes.name},
                    {display:_self.WorkFlowNodeRight.rollBack.desc,value:_self.WorkFlowNodeRight.rollBack.name},
                    {display:_self.WorkFlowNodeRight.stop.desc,value:_self.WorkFlowNodeRight.stop.name}
                    ,
                    {display:_self.WorkFlowNodeRight.notify.desc,value:_self.WorkFlowNodeRight.notify.name}

                ]);
                _self.nodeRightItemsJson4notify = oui.parseString([
                    {display:_self.WorkFlowNodeRight.notify.desc,value:_self.WorkFlowNodeRight.notify.name}
                ]);
                _self.nodeRightItemsJson4cancel = oui.parseString([
                    {display:_self.WorkFlowNodeRight.cancel.desc,value:_self.WorkFlowNodeRight.cancel.name}
                ]);
                _self.otherAttrs4notifyNodeJson = oui.parseString({ notifyJson:oui.parseJson(_self.nodeRightItemsJson4notify),nodeRightItemsJson:oui.parseJson(_self.nodeRightItemsJson)});

                //节点属性 弹出框 的确定 取消按钮数组
                _self.nodePropDialogActions = [{text:"确定",
                    id:"confirm-ok",
                    cls:'oui-dialog-ok',
                    action: function(){
                        var isCheck = _self.updateNodeProp();
                        if(!isCheck){ //校验不通过
                            return ;
                        }
                        _self.clearNodePropOuiControls();
                        _self.editPropDialog.hide();
                    }
                }, { cls:'oui-dialog-cancel',
                    text:"取消",
                    id:"cancel",
                    action:function(){
                        _self.clearNodePropOuiControls();
                        _self.editPropDialog.hide();
                    }
                }];
                _self.branchEditActions =[{text:"确定",
                    id:"confirm-ok",
                    cls:'oui-dialog-ok',
                    action: function(){
                        var flag = _self.updateNodeBranch();
                        if(typeof flag =='boolean'){
                            if(!flag){
                                return ;
                            }
                        }
                        _self.editBranchDialog.hide();
                    }
                }, { cls:'oui-dialog-cancel',
                    text:"取消",
                    id:"cancel",
                    action:function(){

                        _self.editBranchDialog.hide();
                    }
                }];
                if((!_self.formRightHtml)&&(oui.os.mobile)){
                    var cellRightUrl = oui.getPageParam('cellRightUrl');
                    if(!_self.design4Runtime){//不设计态为自由流程运行态设计
                        _self.formRightHtml = oui.loadUrl(cellRightUrl,true,false);
                    }

                }
            }
            //url参数包括 hideSaveButton, currentNodeId ,当前处理的节点Id (uuid)
            var workFlowNodeList = _self.flowData.workFlowNodeList ? _self.flowData.workFlowNodeList : arr;//流程结构化数据
            _self.workFlowNodeList = workFlowNodeList;//保存到_self上
            if((typeof _self.currentNodeIdx !='undefined') && _self.currentNodeIdx >= 0){//当前高亮节点索引
                _self.currentNodeId =_self.workFlowNodeList[_self.currentNodeIdx].id || null;
            }else{
                _self.currentNodeId = null;
            }
            _self.refresh();
            _self.bindEvents();
            this.initEnd();
        },

        /**
         * 设置业务模块的控制器
         * @param controller
         */
        setModuleBizController:function(controller){
            var _self = this;
            _self.moduleBizController = controller;
        },
        ADD_TYPE: oui.SelectPerson_ADD_TYPE, //引用 oui-common中的选人类型
        /**
         * 绑定事件公共接口
         */
        bindEvents: function () {
        },
        /*** 显示编辑按钮****/
        event2showEditIcon:function(cfg){
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeid');
            var currNode = _self.nodeIdMap[nodeId];
            if(_self.isEdit &&(currNode&&currNode.nodeType !='end')){
                $(cfg.el).attr('href',$(cfg.el).attr('node-img-high-src'));
            }
        },
        /* 隐藏编辑按钮*****/
        event2hideEditIcon:function(cfg){
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeid');
            var currNode = _self.nodeIdMap[nodeId];
            if(_self.isEdit &&(currNode&&currNode.nodeType !='end')){
                $(cfg.el).attr('href',$(cfg.el).attr('node-img-src'));
            }
        },
        /**
         * 显示菜单前 验证节点是否是 split节点
         */
        event2contextMenuBefore: function (cfg) {
            var _self = this;
            var nodeId;
            var toId= $(cfg.el).attr('toId');
            if(_self.isPreview){
                /**如果是预览态，并且不是分支条件 查看 则返回 ***/
                if(!toId){
                    return false;
                }
            }
            if(toId){
                if(_self.design4Runtime){//自由流程 运行态用设计态进行设计 不支持分支和条件
                    return false;
                }
                //if(true){
                //    return false;
                //}
                /*** 移动端不支持 线条事件 设置条件 查看条件 ***/
                if(oui.os.mobile){
                    return false;
                }
                //线条
                nodeId = toId;
                var fromId = $(cfg.el).attr('fromId');
                if(!fromId){
                    return false;
                }
                var fromNode = _self.nodeIdMap[fromId];
                if(!fromNode){
                    return false;
                }
                var treeNode = _self.nodeIdMap[nodeId];
                if(treeNode && treeNode.notifyNode){ //知会节点不能设置分支条件
                    return false;
                }
                if(treeNode&& treeNode.isSplit){ //split节点不设置事件
                    return false;
                }
                if(!fromNode.isSplit){
                    /** 不是运行态则返回***/
                    if(!(_self.isIndex || _self.isPreview)){
                        return false;
                    }else{
                        /**运行态 考虑 分支条件剔除的情况 **/

                    }
                }
                return true;
            }else{
                //节点
                nodeId = $(cfg.el).attr('nodeId');
            }
            var nodeTextId = 'text-' + nodeId;
            var treeNode = _self.nodeIdMap[nodeId];
            if(_self.isIndex){
                if(treeNode.isJoin){
                    return false;
                }
                /**无节点状态*/
                if(!treeNode.state){
                    return false;
                }
                /** 节点状态是完成 ，但是 无人员列表 则无需显示时间或者意见**/
                if(treeNode.state == _self.WorkFlowNodeState.state_done.value){
                    if(!treeNode.nodePersonList){
                        return false;
                    }
                    if(!treeNode.nodePersonList.length){
                        return false;
                    }

                }
                /**节点状态未到达**/
                if(treeNode.state === _self.WorkFlowNodeState.state_none.value){
                    return false;
                }
                if( ((!treeNode.comments)|| treeNode.comments.length==0) && ((!treeNode.nodePersonList ) || (treeNode.nodePersonList.length==0 ) || (treeNode.nodeType=='person' )   )   ){

                    if(treeNode.nodeType=='person' ){ // 如果是人的节点，则判断 是否是 已发、或者已办 ，(在流程节点点击时触发 )如果是已发或者已办 而没有意见则显示已发或者已办时间
                        if( (treeNode.state != _self.WorkFlowNodeState.state_done.value) ){
                            return false;
                        }
                    }
                    //return false;
                }
            }
            if ((typeof treeNode.isSplit != 'undefined') && (treeNode.isSplit)) {
                return false;
            }

        },
        /**
         * 更新节点属性
         */
        updateNodeProp:function(){
        	// 校验单元格默认值是否合法
            var _self = this;
            var el = _self.editPropDialog.getEl();
            var $el = $(el);
            /*
             * 更新 节点 显示名称 更新 节点执行模式 节点权限
             */
            var chooseTypeProp = oui.getTop().oui.getById('chooseType');
            var chooseType =chooseTypeProp.attr('value');
            chooseType = parseInt(chooseType);
            var nodeRightProp = oui.getTop().oui.getById('nodeRight');
            var isNotifyProp = oui.getTop().oui.getById('notifyNode');
            var nodeRight='';
            if(nodeRightProp){
                nodeRight = nodeRightProp.attr('value');
            }
            var nodeDisplayNameProp = oui.getTop().oui.getById('nodeDisplayName');
            var nodeDisplayName = nodeDisplayNameProp.attr('value');
            nodeDisplayName = $.trim(nodeDisplayName);
            var currId = _self.editPropDialog.attr('nodeId');
            var currIdx = _self.getIndexByNodeId(currId);
            var lastNodeDisplayName =  _self.flowData.workFlowNodeList[currIdx].nodeDisplayName;//获取上一次保存的节点显示名称
            _self.flowData.workFlowNodeList[currIdx].nodeDisplayName = nodeDisplayName ||_self.flowData.workFlowNodeList[currIdx].nodeName;
            _self.flowData.workFlowNodeList[currIdx].chooseType = chooseType;

            /** 节点权限***/
            if(nodeRightProp) {
                _self.flowData.workFlowNodeList[currIdx].nodeRight = nodeRight;
            }
            /**节点是否为知会节点 ****/
            if(isNotifyProp){
               var isNotify =isNotifyProp.attr('value') || false ;
                if(typeof isNotify =='string'){
                    if(isNotify == 'true'){
                        isNotify = true;
                    }else{
                        isNotify = false;
                    }
                }
                if(isNotify){
                    _self.flowData.workFlowNodeList[currIdx].branchObject = null;
                }
                _self.flowData.workFlowNodeList[currIdx].notifyNode = isNotify;
            }
            _self.flowData.workFlowNodeList[currIdx].name = nodeDisplayName ||_self.flowData.workFlowNodeList[currIdx].nodeName;
            /*
             * 更新 节点权限配置
             */
            //if(!oui.os.mobile){
            //}
            try{
                var formRight= _self.findFormRightByUI();
                _self.flowData.workFlowNodeList[currIdx].formRight = formRight;
            }catch(e){

            }

            var isCheck= _self.validateWorkFlowNode(_self.flowData.workFlowNodeList[currIdx]);
            if(!isCheck){ //如果校验失败，则将当前节点显示名称指定为上一次保存的值
                _self.flowData.workFlowNodeList[currIdx].nodeDisplayName = lastNodeDisplayName;
                _self.flowData.workFlowNodeList[currIdx].name =lastNodeDisplayName;
                return false;
            }
            _self.refresh();
            return true;
        },
        /** 根据ui获取formright***/
        findFormRightByUI:function(){
            var formRight ='';
            try{
                if(!oui.os.mobile){ // pc
                    formRight= oui.getTop().$('#form-right-iframe-flow')[0].contentWindow.formBizControls.getData4string();
                }else{ //移动
                    formRight= oui.getTop().formBizControls.getData4string();
                }
            }catch(e){
            }
            if(!formRight){
                formRight ='-1';
            }
            return formRight;
        },
        /*** 回填权限***/
        fillbackFormRight:function(formRight){
            try{
                oui.getTop().formBizControls.fillbackRight(formRight);
            }catch(e){
            }
        },
        /**
         * 清除 oui-form标签解析 后的缓存的控件对象
         */
        clearNodePropOuiControls:function(){
            var _self = this;
            var chooseTypeOuiId = _self.editPropDialog.attr('chooseTypeOuiId');
            var nodeDisplayNameOuiId = _self.editPropDialog.attr('nodeDisplayNameOuiId');
            chooseTypeOuiId && oui.getTop().oui.clearByOuiId(chooseTypeOuiId);
            nodeDisplayNameOuiId && oui.getTop().oui.clearByOuiId(nodeDisplayNameOuiId);
        },
        /**
         * 流程节点属性面板弹框 显示完成 parse后更新 属性的ouiId
         */
        updateNodePropOuiIds:function(){
            var _self = this;
            var chooseTypeProp = oui.getTop().oui.getById('chooseType');
            var nodeDisplayNameProp =oui.getTop().oui.getById('nodeDisplayName');
            chooseTypeProp && _self.editPropDialog.attr('chooseTypeOuiId',chooseTypeProp.attr('ouiId') );
            nodeDisplayNameProp && _self.editPropDialog.attr('nodeDisplayNameOuiId',nodeDisplayNameProp.attr('ouiId') );
            var nodeId= _self.editPropDialog.attr('nodeId');
            var currIdx = _self.getIndexByNodeId(nodeId);
            var formRight = _self.flowData.workFlowNodeList[currIdx].formRight
            if(!formRight){
                formRight ='-1';
                if(currIdx ==0){//第一个节点，发起节点 默认回填 -2
                    formRight = '-2';
                }
            }

            _self.flowData.workFlowNodeList[currIdx].formRight = formRight;
            /** 移动端需要 动态 增加样式到 dialog 控制 单元格权限、主表明细表tab页显示 **/
            if(oui.os.mobile){
                _self.fillbackFormRight(formRight);
                var $dialogEl = $(_self.editPropDialog.getEl());
                var $dialogContent = $dialogEl.find('.oui-html-dialog-content');
                if(!$dialogContent.hasClass('flow-ui-nodeProps-dialog-box')){
                    $dialogContent.addClass('flow-ui-nodeProps-dialog-box');
                }
            }
        },
        /***
         * 取消 事件
         * @param cfg
         */
        event2cancelEditProp:function(cfg){
            var _self = this;
            _self.hideContextMenu && _self.hideContextMenu();
            return false;
        },
        /******
         * 设置线上 条件
         * @param cfg
         */
        event2setLineCondition:function(cfg){
            var _self = this;
            var fromId = $(cfg.el).attr('fromId');
            var toId = $(cfg.el).attr('toId');
            if((!fromId) || (!toId)){
                return ;
            }
            //alert('条件设置'+fromId+','+toId);
            var fromNode = _self.nodeIdMap[fromId];
            var toNode = _self.nodeIdMap[toId];

            if((!fromNode) || (!toNode)){
                return ;
            }
            /** 必须是split 节点才进行分支设置 ***/
            if(!fromNode.isSplit){
                return ;
            }
            //console.log(fromNode);
            //console.log(toNode);

        },
        /** 鼠标移入join节点**/
        event2mouseenterJoin:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var imgEl = cfg.el;
            $(imgEl).attr('href',FlowUi.config.basePath+_self.getJoinImgSrc(true));
            var id = $(cfg.el).attr('nodeId');
            var node = _self.nodeIdMap[id];
            var hasWidth = _self.hasElWidth(cfg.el);
            var obj = oui.showTips({el:cfg.el, content: '添加节点',
                left:hasWidth?0:8,top:hasWidth?8:16+10,
                mustRender:true,singleton:true});

        },
        /** 鼠标离开join节点***/
        event2leaveJoin:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var imgEl = cfg.el;
            $(imgEl).attr('href',FlowUi.config.basePath+_self.getJoinImgSrc(false));
            oui.hideTips();
        },
        hasElWidth:function(el){
            var w=$(el).width();
            if(w==0){
                return false;
            }
            return true;
        },
        event2mouseenterLine:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var fromId = $(cfg.el).attr('fromId');
            var toId = $(cfg.el).attr('toId');
            if((!fromId) || (!toId)){
                return ;
            }
            //alert('条件设置'+fromId+','+toId);
            var fromNode = _self.nodeIdMap[fromId];
            var toNode = _self.nodeIdMap[toId];

            if((!fromNode) || (!toNode)){
                return ;
            }
            /** 必须是split 节点才进行分支设置 ***/
            if((!fromNode.isSplit) && (!_self.isIndex)){
                return ;
            }
            if(_self.design4Runtime){
                return;
            }
            if(toNode.isSplit){ //如果当前是分支节点则退出
                return ;
            }
            var el = cfg.el;
            var imgEl;
            if($(cfg.el).is('image')){
                el = $(cfg.el).parent().find('path[fromid='+fromId+'][toid='+toId+']')[0];
                imgEl = cfg.el;
                imgEl&&$(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(true));
            }else{
                imgEl = $(cfg.el).parent().find('image[fromid='+fromId+'][toid='+toId+']')[0];
                imgEl&&$(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(true));
            }
            var content= '设置分支条件';
            if(_self.isIndex || _self.isPreview) {
                content = '查看分支条件';
                /** 知会节点 无分支条件***/
                if(toNode&&toNode.notifyNode){
                    content = '知会节点无分支条件';
                }
            }else{
                /**   知会节点 设计态不能设置无分支条件***/
                if(toNode&&toNode.notifyNode){
                    content = '知会节点不能设置分支条件';
                }
            }

            if(imgEl){
                var hasWidth = _self.hasElWidth(imgEl);
                var obj = oui.showTips({el:imgEl, content: content,
                    left:hasWidth?0:8,top:hasWidth?8:16+10,
                    mustRender:true,singleton:true});
            }

            $(el).attr('stroke-width','5');
            $(el).css('stroke-width','5');

            $(el).attr('stroke','#ffaa1f');
            $(el).css('stroke','#ffaa1f');

        },

        /**鼠标离开设置线条样式 ****/
        event2leaveLine:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var fromId = $(cfg.el).attr('fromId');
            var toId = $(cfg.el).attr('toId');
            if((!fromId) || (!toId)){
                return ;
            }
            //alert('条件设置'+fromId+','+toId);
            var fromNode = _self.nodeIdMap[fromId];
            var toNode = _self.nodeIdMap[toId];

            if((!fromNode) || (!toNode)){
                return ;
            }
            /** 必须是split 节点才进行分支设置 ***/
            if((!fromNode.isSplit)&& (!_self.isIndex)){
                return ;
            }
            if(toNode.isSplit){ //如果当前是分支节点则退出
                return ;
            }
            var el = cfg.el;
            if($(cfg.el).is('image')){
                el = $(cfg.el).parent().find('path[fromid='+fromId+'][toid='+toId+']')[0];
                var imgEl = cfg.el;
                $(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(false));
            }else{
                var imgEl = $(cfg.el).parent().find('image[fromid='+fromId+'][toid='+toId+']')[0];
                $(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(false));
            }
            oui.hideTips();
            $(el).attr('stroke-width','3');
            $(el).css('stroke-width','3');

            $(el).attr('stroke','#b7b7b7');
            $(el).css('stroke','#b7b7b7');
        },
        removeBranchLine:function(el){
            $(el).attr('stroke-dasharray','');
        },
        /** 渲染分支线条***/
        renderBranchLine:function(el){
            $(el).attr('stroke-dasharray','10,3');
            $(el).attr('stroke-width','3');
            $(el).css('stroke-width','3');
        },
        /* 判断节点是否有分支***/
        hasBranch:function(node){
            if(!node){
                return false;
            }
            if(node.branchObject){
                return true;
            }
            return false;
        },
        /** 设置 自动分子条件  ***/
        event2setAutoBranch:function(cfg){
            var _self = this;
            _self.isAutoBranch = true;
            _self.event2setNodeBranch(cfg);
            return false;
        },
        /****设置手工选择分支条件 ***/
        event2setSelectBranch:function(cfg){
            var _self = this;
            _self.isAutoBranch = false;
            _self.event2setNodeBranch(cfg);
            return false;
        },
        /**删除 分支条件 ***/
        event2deleteBranch:function(cfg){
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeId');
            var currIdx = _self.getIndexByNodeId(nodeId);
            if(currIdx<0){
                return ;
            }
            var currNode =  _self.flowData.workFlowNodeList[currIdx];

            currNode.branchObject = null;
            _self.refresh();
            return false;
        },
        /*** 设置字段分支条件  和 设置手工选择分支条件 中公共调用方法*****/
        event2setNodeBranch:function(cfg){
            //flow-tpl-branchSetting
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            _self.branchSetting = {
                node:treeNode
            };
            var html = FlowUi.render('flow-tpl-branchSetting',true);
            _self.clear4topDialogLastCache();

            var actions = _self.branchEditActions;
            var title;
            if(_self.isAutoBranch){
                title="自动分支条件";
            }else{
                title="手动选择分支";
            }
            _self.editBranchDialog = oui.getTop().oui.showHTMLDialog({
                title:title,
                dialog4bizType:"workflow",
                contentStyle: ('width:690px;'),
                content:html,
                center:false,
                nodeId:treeNode.id,
                actions:actions
            });
            oui.getTop().oui.parse();
            _self.fillbackNodeBranch(treeNode.id);
            return false;
        },
        /**清空顶层的含有该业务的缓存的dialog ****/
        clear4topDialogLastCache:function(){
            oui.getTop().oui.clearBy(function(control){
                if(control&&control.attr){
                    if(control.attr('dialog4bizType') == "workflow"){
                        oui.getTop().$(control.getEl()).remove();
                        return true;
                    }
                }
                return false;
            });
        },
        fillbackNodeBranch:function(nodeId){
            var _self = this;
            var index = _self.getIndexByNodeId(nodeId);
            if(index <0){
                return ;
            }
            var data = _self.workFlowNodeList;
            var curr = data[index];
            var condition4brach = oui.getTop().oui.getById('condition4branch');
            var conditions = (curr.branchObject&&curr.branchObject.conditionList)? curr.branchObject.conditionList:[];
            condition4brach&&condition4brach.fillback( conditions);
        },
        /*** 更新节点分支配置 **/
        updateNodeBranch:function(){
            var _self = this;
            var dialog =  _self.editBranchDialog;
            if(!dialog){
                return ;
            }
            var nodeId = dialog.attr('nodeId');
            var currIdx = _self.getIndexByNodeId(nodeId);
            if(currIdx<0){
                return ;
            }
            var currNode =  _self.flowData.workFlowNodeList[currIdx];
            var des4branch = oui.getTop().oui.getById('nodeBranchDes');
            var des='';
            if(des4branch){
                des = des4branch.attr('value');
                des = $.trim(des); //剔除空格
            }
            if(!des){
                $(dialog.getEl()).find('#condition4branch-error').html('分支描述不能为空');
                return false;
            }
            var conditions =null;
            var condition4branch = oui.getTop().oui.getById('condition4branch');
            var conditionInfo='';
            if(condition4branch){
                conditions = condition4branch.getConditions();
                conditionInfo = condition4branch.getConditionInfo();
            }
            if(_self.isAutoBranch ){
                if(conditions&& conditions.length){
                    currNode.branchObject = {
                        des:des,
                        autoBranch:_self.isAutoBranch,
                        conditionList:conditions,
                        conditionInfo:conditionInfo
                    };
                }else{
                    currNode.branchObject = {
                        des:des,
                        autoBranch:false,
                        conditionList:null
                    };
                    /***自动分子条件不能为空 ****/
                    $(dialog.getEl()).find('#condition4branch-error-condition').html('分支条件不能为空');
                    return false;
                }
            }else{
                currNode.branchObject = {
                    des:des,
                    autoBranch:false,
                    conditionList:null
                };
            }
            _self.refresh();
        },
        updateNotifyFunBind:function(){
            var _self = this;
            /** 设置流程节点 是否为知会节点 的 改变事件*****/
            oui.getTop().oui.setPageParam('flow_node_update_isNotify',function(control){
                var v = control.attr('value');
                var otherAttrs  = control.attr('otherAttrs');
                otherAttrs = oui.parseJson(otherAttrs);
                var currNode = _self.nodeProps.node ||{};
                var nodeRightObj = oui.getTop().oui.getById('nodeRight');
                var valueArr = _self.findNodeRightValue().split(',');
                var chooseTypeControl = oui.getTop().oui.getById('chooseType');
                var node =  _self.nodeProps.node ||{};
                if(v){
                    if(nodeRightObj){
                        nodeRightObj.attr('data',otherAttrs.notifyJson);
                    }
                    if(chooseTypeControl){

                        var chooseTypeValue = (( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') || ((node.nodeId.indexOf('member#')>-1 && node.nodeType !=_self.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 ) )?_self.WorkFlowChooseType.single.value:_self.WorkFlowChooseType.all.value );
                        chooseTypeControl.attr('value',chooseTypeValue);
                        chooseTypeControl.attr('right','readOnly');
                        chooseTypeControl.render();
                    }
                }else{
                    if(nodeRightObj){
                        nodeRightObj.attr('data',otherAttrs.nodeRightItemsJson);
                    }
                    if(chooseTypeControl){
                        chooseTypeControl.attr('right','edit');

                        var chooseTypeValue = (( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') || ((node.nodeId.indexOf('member#')>-1 && node.nodeType !=_self.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 ) )?_self.WorkFlowChooseType.single.value:_self.WorkFlowChooseType.all.value )
                        chooseTypeControl.attr('value',chooseTypeValue);

                        var isReadOnly = (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender')||((node.nodeId.indexOf('member#')>-1 && node.nodeType !=_self.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 );
                        if(isReadOnly){ //只读判断
                            chooseTypeControl.attr('right','readOnly');
                        }
                        chooseTypeControl.render();
                    }
                }
                var data = nodeRightObj.attr('data') ||[];
                var newValueArr= [];
                for(var i in data){
                    if(valueArr.indexOf(data[i].value+'')<0){
                        continue;
                    }
                    newValueArr.push(data[i].value);
                }
                nodeRightObj.attr('value',newValueArr.join(','));
                nodeRightObj.render();

            } );
        },
        event2editProp:function(cfg){
            /**
             * 编辑节点属性
             * @param cfg
             */
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            _self.nodeProps = {
                node:treeNode
            };
            if(!treeNode.formRight){
                if(treeNode.isRoot){
                    treeNode.formRight = '-2'; //默认编辑
                }else{
                    treeNode.formRight = '-1';//默认浏览
                }
            }
            _self.clear4topDialogLastCache();
            var html = FlowUi.render('flow-tpl-nodeProps',true);
            /** 设置流程节点 是否为知会节点 的 改变事件*****/
            _self.updateNotifyFunBind();
            var actions = _self.nodePropDialogActions;
            _self.editPropDialog = oui.getTop().oui.showHTMLDialog({
                title:"节点属性",
                contentStyle:'width:1050px',
                dialog4bizType:"workflow",
				//TODO 修改弹出框样式超出bug
                //contentStyle: ('width:600px;'), 
                content:html,
                center:false,
                nodeId:treeNode.id,
                actions:actions
            });
            oui.getTop().oui.parse();
            _self.updateNodePropOuiIds();
            return false;
        },
        showNodeProps:function(){
        },
        /**
         * tips显示节点名称
         * @param cfg
         */
        showTipsMsg4nodeDisplayName:function(cfg){
            var _self = this;
            var id = $(cfg.el).attr('nodeId');
            var node = _self.nodeIdMap[id];
            //if(oui.browser.ie){
            //
            //    var obj = oui.showTips({el:$('rect[nodeid='+id+']')[0], content: node.name,left:32.5,top:70});
            //}else{
            //    oui.showTips({el:cfg.el, content: node.name});
            //}
            //var svgPos =$('#ouiflow').position();
            var rectEl = $('rect[nodeid='+id+']')[0];
            var hasWidth = _self.hasElWidth(rectEl);
            var obj = oui.showTips({el:rectEl, content: oui.escapeStringToHTML( node.name ||""),
                left:hasWidth?0:32.5,top:hasWidth?8:70, //兼容问题处理，某些机器下svg内的元素没有宽度或者高度，的适配处理
                mustRender:true,singleton:true});
        },
        hideTips4nodeDisplayName:function(cfg){
            oui.hideTips();
        },
        /**
         * 事件触发节点菜单显示
         * pc:右键菜单
         * phone:轻点触摸显示actionsheet
         * 在事件触发前对 菜单列表的数据进行相关设置
         * 在 event2contextMenu事件触发方法中调用
         */
        putContextMenu4event: function (cfg) {
            var e = cfg.e;
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
            var _self = this;
            var isLine =false;
            var toId = $(cfg.el).attr('toId');
            var nodeId;
            if(toId){
                isLine = true;
                nodeId = toId;
            }else{
                nodeId = $(cfg.el).attr('nodeId');
            }
            var nodeTextId = 'text-' + nodeId;
            var treeNode = _self.nodeIdMap[nodeId];
            var clickName = _self.Events.click;
            var contextMenus = _self.contextMenus;
            if (!contextMenus) {
                contextMenus = _self.contextMenus = {};
            }
            contextMenus.menuClick = clickName; //指定菜单模板数据属性设置
            contextMenus.nodeId = nodeId;
            contextMenus.isRoot = treeNode.isRoot ? true : false;
            contextMenus.node = treeNode;
            contextMenus.isFirst = (nodeId ==_self.flowData.workFlowNodeList[0].id);
            contextMenus.hasNodeMembers = (treeNode.nodePersonList && treeNode.nodePersonList.length>0) &&(treeNode.nodeType!='person') ;
            contextMenus.hasComments = (treeNode.comments && treeNode.comments.length>0);
            contextMenus.isLine = isLine;
            var FlowUi = _self.getFlowUi();
            var html = FlowUi.render('flow-ui-contextMenus', true);
            var elSelector;
            if(isLine){
                elSelector = cfg.el;
            }else{
                elSelector = "[nodeTextId=" + nodeTextId + "][nodeId=" + nodeId + "]";
                elSelector = "rect[nodeId=" + nodeId + "]";
                elSelector = elSelector.toLowerCase();
            }
            var left = (_self.nodeWidth / 2);
            var top = (_self.nodeHeight - 2);
            return {
                isLine:isLine,
                nodeId:nodeId,
                el: $(elSelector),
                left: left,
                top: top,
                content: html
            };
        },
        /**
         * 绑定 流程节点上的菜单事件
         * pc 右键菜单
         * phone 触摸轻点actionSheet菜单
         * 分别实现该方法接口
         */
        event2contextMenu: function (cfg) {

        },
        /***催办事件处理 **/
        event2HastenWork:function(cfg){
            var nodeId =$(cfg.el).attr('nodeId');
            /**由嵌入流程图的页面进行扩展 **/
            var WorkflowRuntime = oui.getNS().WorkflowRuntime || window.parent.oui.getNS().WorkflowRuntime ||{} ;
            WorkflowRuntime.event2HastenWork&&WorkflowRuntime.event2HastenWork(nodeId);
        },
        /**
         * 添加串发节点
         */
        addNodes4Serial:function(id,nodes,idx){
            var _self = this;
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (i == 0) {
                    _self.addNodes([nodes[i]], id,false,idx);
                } else {
                    _self.addNodes([nodes[i]], nodes[i - 1].id);
                }
            }
        },
        /**
         * 创建或者更新子节点数据
         * @param treeNode
         * @param childNode
         * @param joinId
         */
        updateChildNode4brotherJoin:function(treeNode,childNode,joinId){
            var _self = this;
            if(childNode&& (!childNode.isJoin)){//非聚合节点之间处理
                childNode.pid = joinId;

                var index = _self.getIndexByNodeId(childNode.id);
                _self.flowData.workFlowNodeList[index].pid = joinId;
            }else if(childNode&& (childNode.isJoin)){ //子节点为聚合节点需要将聚合节点的pid重新整理为新的
                var brotherIds = childNode.pid?(childNode.pid+'').split(','):[];
                var currPidx = brotherIds.indexOf(treeNode.id+'');
                if(currPidx>=0){
                    brotherIds.splice(currPidx,1,joinId);
                }else{
                    brotherIds.push(joinId);
                }
                childNode.pid = brotherIds.join(',');
                var index = _self.getIndexByNodeId(childNode.id);
                _self.flowData.workFlowNodeList[index].pid = brotherIds.join(',');
            }
        },
        /**
         * 根据节点id和节点类型获取默认的执行模式
         * @param typeFlag
         */
        getDefaultChooseTypeByNodeType:function(nodeId,nodeType){
            var _self = this;
            /**相对角色发送者，单人 默认执行模式为单人;否则为 多人执行模式*/
            if(nodeType == _self.WorkFlowNodeType.person.value || nodeId =='relRole_sender' || ((nodeId.indexOf('member#')>-1 && nodeType !=_self.WorkFlowNodeType.formControl.value) || nodeId.indexOf('deptLeader#')>-1)){
                return _self.WorkFlowChooseType.single.value;
            }
            return _self.WorkFlowChooseType.all.value;
        },
        /**
         * 根据选人界面选择的节点列表 (人员,部门,角色等)
         * 创建流程图需要的节点数组对象
         * @param persons
         * @returns {Array}
         */
        createArrayNodesByPersonSelectedNodes:function(persons){
            if(!persons){
                return [];
            }
            var nodes = [];
            var _self = this;
            for (var i = 0, len = persons.length; i < len; i++) { //根据选择的人员、部门、角色等创建节点数据
                nodes.push({
                    nodeId: persons[i].id,
                    nodeName:persons[i].name,
                    nodeRight:_self.findNodeRightValue({}),
                    nodeDisplayName:persons[i].name,
                    name: persons[i].name,
                    chooseType:_self.getDefaultChooseTypeByNodeType(persons[i].id,persons[i].typeFlag),
                    nodeType: persons[i].typeFlag
                });
            }
            return nodes;
        },
        /**
         * 根据分割节点获取聚合节点
         * @param splitId
         * @returns {*}
         */
        getJoinIdBySplitId:function(splitId){
            var _self = this;
            var node = _self.nodeIdMap[splitId];
            var join = _self.findJoin(node);
            if(!join){
                return "";
            }
            return join.id;
        },
        /**
         * 如果当前节点的父亲节点为split节点 则根据当前节点获取当前分支在流程图中的顺序
         * 根据当前分支获取 对应的索引
         */
        getCurrBranchIndex:function(node){
            var _self = this;
            if(!node){
                return -1;
            }
            if(!node.parents){
                return -1;
            }
            if(!node.parents[0]){
                return -1;
            }
            var splitId = node.parents[0].id;
            var joinId = _self.getJoinIdBySplitId(splitId);
            var joinIndex = _self.getIndexByNodeId(joinId);
            var joinNode = _self.flowData.workFlowNodeList[joinIndex];
            var pids = joinNode.pid?joinNode.pid.split(','):[];
            var branchNode = _self.getCurrBranchNodeByFirstNode(node);
            if(branchNode){
                return pids.indexOf(branchNode.id);
            }else{
                return -1;
            }
        },
        /**
         * 根据 当前分支的第一个节点获取 当前分支的最后一个节点(聚合节点的其中一个父Id)
         * @param node
         * @returns {*}
         */
        getCurrBranchNodeByFirstNode:function(node){
            var _self = this;
            if(!node){
                return null;
            }
            if(!node.parents){
                return null;
            }
            if(!node.parents[0]){
                return null;
            }
            var splitId = node.parents[0].id;
            var joinId = _self.getJoinIdBySplitId(splitId);
            var currBranchNode = _self.getCurrBranchNode(node,node.children,splitId,joinId);
            return currBranchNode;
        },
        /**
         * 获取当前分支的最后一个节点
         * @param node
         * @param children
         * @param splitId
         * @param joinId
         * @returns {*}
         */
        getCurrBranchNode:function(node,children,splitId,joinId){
            var _self = this;
            if(children[0].id ==joinId){
                return node;
            }
            if((!children) || (!children.length) ){
                return node;
            }
            for(var i= 0,len=children.length;i<len;i++){
                var curr = _self.getCurrBranchNode(children[i],children[i].children,splitId,joinId);
                if(curr === children[i]){
                    return curr;
                }
                if(!curr){
                    return children[i];
                }
            }
            return null;
        },
        /**
         * 增加兄弟节点
         * @param nodeId
         * @param data
         */
        selectBrotherOkFun:function(nodeId,data){
            var _self = this;
            //console.log(data);
            var persons = data.data;
            var addType = data.flowType;
            var isSerial = false;
            if ((addType + '') == (_self.ADD_TYPE.serial + "")) { //串发
                isSerial = true;
            } else { //并发 TODO

            }
            if (!persons) {
                return;
            }
            if (persons.length <= 0) {
                return;
            }
            var nodes = _self.createArrayNodesByPersonSelectedNodes(persons); //根据 选人界面选择的节点数据，创建 节点数组
            var treeNode = _self.nodeIdMap[nodeId];
            var brotherId = treeNode.parents[0].id;
            var childNode = treeNode.children[0];

            if(treeNode.parents[0]&& treeNode.parents[0].isSplit){

                var splitId =treeNode.parents[0].id;
                var joinId =  _self.getJoinIdBySplitId(splitId);
                var currBranchIdx = _self.getCurrBranchIndex(treeNode);//获取当前分支的在流程图中显示顺序,插入兄弟节点时需要在join节点上表现顺序
                currBranchIdx=-1;
                var insertIdx = _self.getIndexByNodeId(treeNode.id);
                if ((!isSerial) && nodes.length > 0) {
                    _self.addNodes(nodes, splitId,false,insertIdx,true); //添加节点列表到数组
                    var cpids = [];//获取聚合节点的父节点列表
                    for(var k= 0,len=nodes.length;k<len;k++){//将新增加的并非节点列表中id放到 聚合节点的父节点列表中
                        cpids.push(nodes[k].id);
                    }
                    _self.updateJoinNodeParentIds(joinId,cpids,currBranchIdx);
                } else {
                    _self.addNodes4Serial(splitId,nodes,insertIdx,true);//添加串发节点
                    _self.updateJoinNodeParentIds(joinId,[nodes[nodes.length-1].id],currBranchIdx); //追加最后一个到 聚合节点的父节点列表中
                }
            }else{
                var newSplitId = _self.createSplitNode(brotherId); //根据父节点创建分割节点
                treeNode.pid = newSplitId;//指定当前节点的父节点为 分割节点
                var index = _self.getIndexByNodeId(treeNode.id);//获取当前节点的索引
                _self.flowData.workFlowNodeList[index].pid = newSplitId; //更新数组中当前节点的父节点
                if ((!isSerial) && nodes.length > 0) {
                    var insertIdx = _self.getIndexByNodeId(treeNode.id);
                    _self.addNodes(nodes, newSplitId, false); //添加节点列表到数组
                    var joinId = _self.createJoinNode(nodeId); //创建聚合节点
                    var cpids = [];//获取聚合节点的父节点列表
                    for(var k= 0,len=nodes.length;k<len;k++){//将新增加的并非节点列表中id放到 聚合节点的父节点列表中
                        cpids.push(nodes[k].id);
                    }
                    _self.updateJoinNodeParentIds(joinId,cpids);
                    _self.updateChildNode4brotherJoin(treeNode,childNode,joinId);//如果子节点为聚合节点则需要更新聚合节点的父节点数据，否则直接指定父节点为聚合节点
                    var currNodeIdx = _self.getIndexByNodeId(treeNode.id);//获取当前节点的索引
                    /**
                     * 添加后改变 顺序
                     */
                    var currNode = _self.flowData.workFlowNodeList[currNodeIdx] ;
                    _self.flowData.workFlowNodeList.splice(currNodeIdx,1);
                    var firstIdx = _self.getIndexByNodeId(nodes[0].id);
                    _self.flowData.workFlowNodeList.splice(firstIdx,0,currNode);
                } else {
                    _self.addNodes4Serial(newSplitId,nodes);//添加串发节点
                    var joinId = _self.createJoinNode(nodeId); //创建聚合节点
                    _self.updateJoinNodeParentIds(joinId,[nodes[nodes.length-1].id]); //追加最后一个到 聚合节点的父节点列表中
                    _self.updateChildNode4brotherJoin(treeNode,childNode,joinId);//如果子节点为聚合节点则需要更新聚合节点的父节点数据，否则直接指定父节点为聚合节点

                    /**
                     * 添加后改变 顺序
                     */
                    var currNodeIdx = _self.getIndexByNodeId(treeNode.id);//获取当前节点的索引
                    var currNode = _self.flowData.workFlowNodeList[currNodeIdx] ;
                    _self.flowData.workFlowNodeList.splice(currNodeIdx,1);
                    var firstIdx = _self.getIndexByNodeId(nodes[0].id);
                    _self.flowData.workFlowNodeList.splice(firstIdx,0,currNode);
                }

            }

            _self.refresh();
        },
        /**
         * 更新聚合节点的父节点列表
         * @param joinId
         * @param pids
         * @param branchIndex (如果传入则需要制定顺序)
         */
        updateJoinNodeParentIds:function(joinId,pids,branchIndex){

            if(!pids ){
                return ;
            }
            if(!pids.length){
                return ;
            }
            var _self = this;
            var joinIndex = _self.getIndexByNodeId(joinId); //获取聚合节点索引
            var joinPids = _self.flowData.workFlowNodeList[joinIndex].pid+''; //获取聚合节点的所有父节点列表
            joinPids = joinPids?joinPids.split(','):[];

            var arr = [];
            if(typeof pids =='string'){
                arr  = pids?(pids+'').split(','):[];
            }else{
                arr = pids;
            }
            if((typeof branchIndex =='number')&& branchIndex>-1){
                for(var i= 0,len=arr.length;i<len;i++){
                    joinPids.splice(branchIndex+i+1,0,arr[i]);
                }
            }else{
                for(var i= 0,len=arr.length;i<len;i++){
                    joinPids.push(arr[i]);
                }
            }
            _self.flowData.workFlowNodeList[joinIndex].pid = joinPids.join(',');
        },
        /***
         * 暴露外部使用的加签方法
         * @param nodeId
         * @param data
         * @param cmd
         * @returns {*}
         */
        addNodes4SelfOrBrother:function(nodeId,data,isBrother){
            var _self  =this;
            if(!isBrother){
                _self.selectOkFun(nodeId,data);
            }else {
                _self.selectBrotherOkFun(nodeId,data);
            }
            return  _self.getFlowData();
        },
        /**
         * 执行 选人界面公共回调逻辑
         * pc和phone的公共调用方法
         * @param nodeId 操作的节点
         * @param data 回调的人员数据
         *
         */
        selectOkFun: function (nodeId, data) {
            var _self = this;
            //console.log(data);
            var persons = data.data;
            var addType = data.flowType;
            var isSerial = false;
            if ((addType + '') == (_self.ADD_TYPE.serial + "")) { //串发
                isSerial = true;
            } else { //并发 TODO

            }
            if (!persons) {
                return;
            }
            if (persons.length <= 0) {
                return;
            }
            var nodes = [];
            for (var i = 0, len = persons.length; i < len; i++) {
                nodes.push({
                    nodeId: persons[i].id,
                    nodeName:persons[i].name,
                    nodeDisplayName:persons[i].name,
                    nodeRight:_self.findNodeRightValue({}),
                    name: persons[i].name,
                    chooseType:_self.getDefaultChooseTypeByNodeType(persons[i].id,persons[i].typeFlag),
                    nodeType: persons[i].typeFlag
                });
            }
            var treeNode = _self.nodeIdMap[nodeId];

            if ((!isSerial) && nodes.length > 1) {
                var emptyId = _self.addNodes(nodes, nodeId, true); //是否追加空节点
                _self.updateParentId(nodeId, emptyId, true);

            } else {

                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (i == 0) {
                        _self.addNodes([nodes[i]], nodeId);
                    } else {
                        _self.addNodes([nodes[i]], nodes[i - 1].id);
                    }

                }
                _self.updateParentId(nodeId, nodes[nodes.length - 1].id);
            }
            _self.refresh();
        },
        selectBrotherOkCallback:function(data){
            var selectDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
            var nodeId = selectDialog.attr('nodeId');
            var _self = this;//不能指向this callback的配置不能指向this引用了
            _self.selectBrotherOkFun(nodeId,data);
        },
        /**
         * 选人界面回调接口
         */
        selectOkCallback: function (data) {
            var selectDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
            var nodeId = selectDialog.attr('nodeId');
            var _self = this;//不能指向this callback的配置不能指向this引用了
            _self.selectOkFun(nodeId, data);//公共回调方法 需要传入
        },
        /**
         * 替换节点的执行逻辑
         */
        replaceNodeFun: function (nodeId, data) {
            var _self = this;
            var persons = data.data;
            var nodes = [];
            for (var i = 0, len = persons.length; i < len; i++) {
                nodes.push({
                    nodeId: persons[i].id,
                    name: persons[i].name,
                    nodeName:persons[i].name,
                    nodeDisplayName:persons[i].name,
                    nodeType: persons[i].typeFlag
                });
            }
            if (nodes.length != 1) {
                return;
            }
            _self.replaceNodeById(nodes[0], nodeId);
            _self.refresh();
        },
        /**
         * 替换节点回调的接口
         */
        replaceCallBack: function (data) {
            var _self = this;
            var selectDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
            var nodeId = selectDialog.attr('nodeId');
            _self.replaceNodeFun(nodeId, data);
        },
        /** 工作流中 根据design4Runtime  判断节点选人界面 ***/
        findSelectPersonTabs4workflow:function(){
            var design4Runtime = oui.getParam('design4Runtime');
            var showTab = '';
            if((design4Runtime&&design4Runtime=='true')||((typeof design4Runtime=='boolean') && design4Runtime)){
                showTab='3';
            }else{
                showTab='3,4,1,2,5';
            }
            return showTab;
        },
        /**
         * 替换节点,具体逻辑实现
         */
        event2replaceNode: function (cfg) {
            var nodeId = $(cfg.el).attr('nodeId');
            var _self = this;
            var showTab = _self.findSelectPersonTabs4workflow();
            oui.getTop().oui.selectPerson({
                showType:5,
                filterSelf: false,
                defaultTabIndex:1,
                tabs: showTab,//tab页签显示配置 [组,联系人]
                nodeId: nodeId,
                title: '替换节点',
                isAll:false,
                allowCompany:false,
                isFlow: true,
                fillback: [],//回填选中数据
                isMulti:false,
                maxSize: 1,//选人多少限制
                extend:_self.findSelectPersonExtend(),
                operType: 'replace',
                /*
                 *callback:function(action){
                 //alert(action);
                 },
                 */
                callbackOk: function (data) {
                    _self.replaceCallBack(data);
                }, //替换节点的回调方法
                callbackCancel: function (data) {
                    //alert('cancel-data');
                }
            });
            return false;
            //oui.hideTips();
        },
        /**
         * 添加兄弟节点
         * @param cfg
         */
        event2addBrotherNode:function(cfg){
            var nodeId = $(cfg.el).attr('nodeId');
            var _self = this;
            var showTab = _self.findSelectPersonTabs4workflow();
            oui.getTop().oui.selectPerson({
                showType:5,
                filterSelf: false,
                defaultTabIndex:1,
                tabs: showTab,//tab页签显示配置 [组,联系人]
                isFlow: true,
                isAll:false,
                allowCompany:false,
                fillback: [],//回填选中数据
                maxSize: -1,//选人多少限制
                duplicate: false,//是否允许重复
                extend:_self.findSelectPersonExtend(),
                nodeId: nodeId,
                title: '节点选择',
                operType: 'addBrother',
                callbackOk: function (data, flowType) {
                    _self.selectBrotherOkCallback(data,nodeId);
                },//确定回调 返回false将不会关闭窗口

                callbackCancel: function () {

                }//取消回调
            });
            return false;
        },
        /** 获取选人界面扩展的页签,包括表单控件****/
        findSelectPersonExtend:function(){
            var _self = this;
            if(!_self.flowData.bizId){
                return null;
            }
            var design4Runtime = oui.getParam('design4Runtime');
            if((design4Runtime&&design4Runtime=='true')||((typeof design4Runtime=='boolean') && design4Runtime)){
                return null;
            }
            var extend = {
                tabs:[{
                    title:"表单控件",
                    type:"formControl",
                    icon:"forms",
                    des:"表单内组织机构控件",
                    url:oui.addParams(oui.getPageParam("selectPersonUrl"),{
                        formId:_self.flowData.bizId,
                        subFormId:"",
                        type:"3",
                        showSub:false,
                        containMulti:'true,false'
                    })
                }]
            };
            return extend;
        },
        /**
         * 点击或者手机上轻点事件触发 添加节点
         */
        event2addNode: function (cfg) {
            var nodeId = $(cfg.el).attr('nodeId');
            var _self = this;
            var showTab = _self.findSelectPersonTabs4workflow();
            oui.getTop().oui.selectPerson({
                showType:5,
                filterSelf: false,
                defaultTabIndex:1,
                tabs: showTab,//tab页签显示配置 [组,联系人]
                isFlow: true,
                isAll:false,
                allowCompany:false,
                fillback: [],//回填选中数据
                maxSize: -1,//选人多少限制
                extend:_self.findSelectPersonExtend(),
                nodeId: nodeId,
                title: '节点选择',
                operType: 'add',
                callbackOk: function (data, flowType) {
                    _self.selectOkCallback(data);
                },//确定回调 返回false将不会关闭窗口

                callbackCancel: function () {

                }//取消回调
            });
            return false;
            //oui.hideTips();
        },
        zoomPx: 0,
        /**
         * 放大
         */
        event2ZoomBig: function (cfg) { //放大
            var _self = this;
            _self.zoomPx += 10;
            _self.zoomScale = (_self.mc_width + _self.zoomPx) / _self.mc_width;
            $(_self.getFlowUi().RaphaelObj.canvas).css('zoom', _self.zoomScale);
        },
        /**
         * 缩小
         */
        event2ZoomSmall: function (cfg) { //缩小
            var _self = this;
            _self.zoomPx -= 10;
            _self.zoomScale = (_self.mc_width + _self.zoomPx) / _self.mc_width;
            if (_self.zoomScale < 0.5) {
                _self.zoomPx += 10;
                _self.zoomScale = (_self.mc_width + _self.zoomPx) / _self.mc_width;
            }
            $(_self.getFlowUi().RaphaelObj.canvas).css('zoom', _self.zoomScale);
        },
        /**
         * 更新节点的父节点Id
         */
        updateParentId: function (lastPid, newPid) {
            var _self = this;
            var treeNode = _self.nodeIdMap[lastPid]; //根据父id找到对应的树结构的 节点对象
            var ids = _self.getIdsByParentNode(treeNode); //根据 父节点 获取子节点的id列表
            //根据Id列表在 数组的 流程节点对象中找到并制定新的父id
            var data = _self.workFlowNodeList;
            if (ids.length <= 0) {
                return;
            }
            for (var i = 0, len = data.length; i < len; i++) {
                if (ids.indexOf(data[i].id) >= 0) {
                    //data[i].pid = newPid; // 将父亲节点重新赋值
                    var pids = (data[i].pid + '').split(',');
                    var spliceIdx = pids.indexOf(lastPid + '');
                    if ((typeof _self.nodeIdMap[newPid].isSplit != 'undefined' && _self.nodeIdMap[newPid].isSplit) && data[i].isJoin) {
                        pids.splice(spliceIdx, 1);
                    } else {
                        pids.splice(spliceIdx, 1, newPid);
                    }
                    data[i].pid = pids.join(',');
                }
            }
        },
        /**
         * 根据 父节点获取 子节点的所有Id列表,不用获取孙子节点
         */
        getIdsByParentNode: function (node) {
            var ids = [];
            var arr = node.children;
            for (var i = 0, len = arr.length; i < len; i++) {
                ids.push(arr[i].id);
            }
            return ids;
        },
        /**
         * 点击或者手机上轻点事件触发 删除节点
         */
        event2delNode: function (cfg) {
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            _self.removeByTreeNode(treeNode);
            _self.refresh();
            return false;
        },

        /**
         * 只删除当前节点
         */
        event2delCurrNode: function (cfg) {
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            if ((treeNode.parents && treeNode.parents.length == 1) &&
                (treeNode.children && treeNode.children.length == 1) &&
                (treeNode.parents[0].children.length == 2)
            ) {
                if ((treeNode.parents[0].isSplit) && (treeNode.children[0].isJoin)) {
                    var brotherChilds = treeNode.parents[0].children;
                    _self.updateParentId(treeNode.parents[0].id, treeNode.parents[0].pid);
                    _self.removeByTreeNode(treeNode.parents[0], true);

                    ///
                    var targetNode;
                    if ((treeNode.id + '') == (treeNode.children[0].parents[0].id + '')) {
                        targetNode = treeNode.children[0].parents[1];
                    } else {
                        targetNode = treeNode.children[0].parents[0];
                    }

                    /********* 如果当前没有兄弟节点 ,删除节点时 需要删除分支对象 *********************/
                    targetNode.branchObject = null;
                    var index = _self.getIndexByNodeId(targetNode.id);
                    if(_self.flowData.workFlowNodeList[index]){
                        _self.flowData.workFlowNodeList[index].branchObject = null;
                    }
                    for(var i= 0,len=brotherChilds.length;i<len;i++){
                        if(!brotherChilds[i]){
                            continue;
                        }
                        brotherChilds[i].branchObject = null;
                        var idx = _self.getIndexByNodeId(brotherChilds[i].id);
                        if(_self.flowData.workFlowNodeList[idx]){
                            _self.flowData.workFlowNodeList[idx].branchObject = null;
                        }
                    }
                    _self.updateParentId(treeNode.children[0].id, targetNode.id);
                    _self.removeByTreeNode(treeNode.children[0], true);
                }

            }
            _self.updateParentId(nodeId, treeNode.pid);
            _self.removeByTreeNode(treeNode, true);
            _self.refresh();
            return false;
        },

        /**
         * 在指定节点id后面创建分割节点
         * @param id
         */
        createSplitNode:function(id){
            var _self = this;
            var data = _self.workFlowNodeList;
            //console.log(oui.biz.Tool.encode(data));
            var idx = _self.getIndexByNodeId(id);
            var splitId = _self.createNewId4server();
            _self.nodeIdMap[splitId] = {
                id: splitId,
                name: '',
                //name:'split',
                isSplit: true,
                pid: id
            };
            data.splice(idx + 1, 0, _self.nodeIdMap[splitId]);
            return splitId;
        },
        /**
         * 指定节点 后面创建 聚合节点
         * @param id
         */
        createJoinNode:function(id){
            var _self = this;
            var data = _self.workFlowNodeList;
            var idx = _self.getIndexByNodeId(id);
            var newId = _self.createNewId4server();
            _self.nodeIdMap[newId] = {
                id: newId,
                //name:'join',
                name: '',
                isJoin: true,
                pid: id
            };
            data.splice(idx +1, 0, _self.nodeIdMap[newId]);
            return newId;
        },

        /**
         * 根据当前节点添加后续节点列表
         * 根据父节点 添加子节点
         */
        addNodes: function (nodes, id, addEmpty,insertIndex,isReverse) {
            var _self = this;
            var data = _self.workFlowNodeList;
            //console.log(oui.biz.Tool.encode(data));
            var idx = _self.getIndexByNodeId(id);
            var pids = [];
            var splitId = null;

            if (addEmpty && nodes.length > 1) {
                splitId = _self.createNewId4server();
                _self.nodeIdMap[splitId] = {
                    id: splitId,
                    name: '',
                    //name:'split',
                    isSplit: true,
                    pid: id
                };
                data.splice(idx + 1, 0, _self.nodeIdMap[splitId]);
            }
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (!nodes[i].id) {
                    nodes[i].id = _self.createNewId4server();
                }
                nodes[i].pid = splitId ? splitId : id;

                _self.nodeIdMap[nodes[i].id] = nodes[i];
                if((typeof insertIndex =='number') && insertIndex>-1){
                    data.splice(  (insertIndex + i + 1), 0, nodes[i]);
                }else{
                    data.splice(splitId ? (idx + i + 2) : (idx + i + 1), 0, nodes[i]);
                }
                pids.push(nodes[i].id);

            }
            if (addEmpty && nodes.length > 1) {
                var newId = _self.createNewId4server();
                _self.nodeIdMap[newId] = {
                    id: newId,
                    //name:'join',
                    name: '',
                    isJoin: true,
                    pid: pids.join(',')
                };
                data.splice(idx + i + 2, 0, _self.nodeIdMap[newId]);
                return newId;
            }
            return null;
        },
        /**
         *  将replaceId替换 为 node节点
         */
        replaceNodeById: function (node, replaceId) {
            var _self = this;
            var data = _self.workFlowNodeList;
            var idx = _self.getIndexByNodeId(replaceId);
            if (idx < 0) {
                return;
            }
            var pid = data[idx].pid;
            node.pid = pid;
            if( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') ){
                node.chooseType =_self.WorkFlowChooseType.single.value;
            }else{
                node.chooseType = data[idx].chooseType ||_self.WorkFlowChooseType.single.value;
            }
            node.formRight = data[idx].formRight ||"-1";
            node.nodeRight = data[idx].nodeRight ||"";
            node.notifyNode = data[idx].notifyNode || false;
            node.branchObject = data[idx].branchObject||null;
            data.splice(idx, 1, node);
            if (!node.id) {
                node.id = _self.createNewId4server();
            }
            if(node.notifyNode){
                /** 知会节点需要 重置 执行默认默认值****/
                if(typeof node.notifyNode =='string'){
                    if(node.notifyNode =='true'){
                        node.notifyNode = true;
                    }else{
                        node.notifyNode = false;
                    }
                }
                var chooseTypeValue = (( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') )?_self.WorkFlowChooseType.single.value:_self.WorkFlowChooseType.all.value );
                node.chooseType =  chooseTypeValue;
            }


            _self.nodeIdMap[node.id] = node;
            _self.updateParentId(replaceId, node.id); //lastId为replaceId newId为node.id
        },
        /**
         * 根据节点找到 数组中节点索引
         */
        getIndexByNodeId: function (id) {
            var _self = this;
            var data = _self.workFlowNodeList;
            for (var i = 0, len = data.length; i < len; i++) {
                if ((data[i].id + '') == (id + '')) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 根据 树结构节点找到所有的孙子节点 在 数组结构的节点中找到并标记删除
         * 删除流程节点
         * justDeletCurr true 仅仅删除当前节点 不需递归 找子节点和孙子节点
         *
         */
        removeByTreeNode: function (node, justDeletCurr) {
            var _self = this;
            var idx = _self.getIndexByNodeId(node.id); //数组节点中找到索引
            if (idx < -1) { //没有找到当前节点
                return;
            }
            var data = _self.workFlowNodeList;
            var ids = [];
            if (!justDeletCurr) { //如果没有配置 则默认执行孙子节点查找
                ids = _self.getChildrenIdsByTreeNode(node); //在树节点中找到所有
            }
            var newArr = [];
            if (!ids) {
                ids = [];
            }
            ids.push(node.id);
            if (ids.length == 1) { //如果只有一个元素 则执行删除;并返回
                data.splice(idx, 1);
                return;
            }
            //如果是多个 则执行 标记删除 在重置
            /*
             * 第一次遍历 用于处理删除标记
             */
            for (var i = 0, len = data.length; i < len; i++) {
                if (ids.indexOf(data[i].id) > -1) {
                    data[i] = null;
                }
            }
            /*
             * 第二次遍历 用于将无删除标记的控件放入新数组
             */
            for (var i = 0, len = data.length; i < len; i++) {
                if (!data[i]) {
                    continue;
                }
                newArr.push(data[i]);
            }
            /*
             * 重新赋值给 流程节点数据对象
             */
            _self.workFlowNodeList = newArr;

        },
        /**
         * 根据treeNode获取子节点以及孙子节点
         * 树结构的节点
         */
        getChildrenIdsByTreeNode: function (node) {
            var _self = this;
            var data = _self.workFlowNodeList;
            var arr = [];
            var children = node.children;
            for (var i = 0, len = children.length; i < len; i++) {
                var currArr = _self.getChildrenIdsByTreeNode(children[i]);//获取子节点的id列表
                arr.push(children[i].id); //将当前子节点放入输入
                arr = arr.concat(currArr);//将当前子节点的孙子节点列表放入数组
            }
            return arr;
        },
        flowIdPrefix: 'jsuuid-',
        /**
         * 根据外部传入数据 自增 客户端id
         */
        createNewId: function () {
            var _self = this;
            _self.newId++;
            return _self.flowIdPrefix + _self.newId;
        },
        /**
         * 为新增节点增加Id
         */
        createNewId4server: function () {
            var _self = this;
            _self.newId4server++;
            return _self.flowIdPrefix + _self.newId4server;
        },

        /**
         * 根据id获取子节点列表
         */
        getChildrenByNode: function (node, arr, idx) {
            var _self = this;
            var i = idx || 0;
            i = i + 1;
            _self.nodeIdMap[node.id] = node;
            var newId = _self.createNewId();
            node.newId = newId;
            var children = [];


            for (var len = arr.length; i < len; i++) {
                if (('' + arr[i].pid).split(',').indexOf(node.id + '') < 0) {
                    continue;
                }
                children.push(arr[i]);
                arr[i].children = _self.getChildrenByNode(arr[i], arr, i);
                _self.setNodeParents(arr[i], node);
            }
            if(_self.isVertical){//如果是纵向则兄弟节点顺序相反
                children = children.reverse();
            }
            return children;
        },
        /**
         * 设置节点的父节点
         * 聚合场景 是多父节点
         */
        setNodeParents: function (node, parentNode) {
            if (!node.parents) {
                node.parents = [];
            }
            var ps = node.parents;
            var hasParent = false;
            for (var i = 0, len = ps.length; i < len; i++) {
                if (ps[i].id == parentNode.id) {
                    hasParent = true;
                    break;
                }
            }
            if (!hasParent) {
                node.parents.push(parentNode);
            }
            if(parentNode&&parentNode.isSplit){
                node.isParentSplit = true;
            }else{
                node.isParentSplit = false;
            }
        },
        /**
         * 根据数组 节点创建 树对象
         */
        createTreeNode: function (arr) {
            var _self = this;
            var node = {};
            var root = arr[0];
            this.nodeIdMap = {};
            root.children = _self.getChildrenByNode(root, arr, 0);
            root.parents = [];
            root.isRoot = true;
            return root;
        },
        /**
         * 创建 flow-ui流程图所需的数据
         *@param data 数据
         *@param isVertical 是否纵向输出
         */
        createNodeData: function (data, isVertical) {
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var obj = {states: {}, paths: {}};
            var states = obj.states;
            var paths = obj.paths;
            var x, y, posCfg;

            for (var i = 0, len = data.length; i < len; i++) {
                var newId = data[i].newId;
                var statusImg=null;
                var hastenWorkImg =null;
                if (isVertical) {
                    posCfg = _self.rotate({x: data[i].x, y: data[i].y}, Math.PI / 2);
                    x = posCfg.x;
                    y = posCfg.y;
                } else {
                    x = data[i].x;
                    y = data[i].y;
                }
                var attr;
                if (i == 0) {
                    attr = $.extend(true, {}, FlowUi.config.tools.states.start.attr, {
                        "x": x,
                        "y": y,
                        "width": _self.nodeWidth,
                        "height": _self.nodeHeight
                    });

                }else if(data[i].isEnd){
                    attr = $.extend(true, {}, FlowUi.config.tools.states.end.attr, {
                        "x": x,
                        "y": y,
                        "width": _self.nodeWidth,
                        "height": _self.nodeHeight
                    });
                } else {

                    if( FlowUi.config.tools.states[data[i].nodeType]&& _self.WorkFlowNodeType[data[i].nodeType]){
                        attr = $.extend(true, {}, FlowUi.config.tools.states[data[i].nodeType].attr, {
                            "x": x,
                            "y": y,
                            "width": _self.nodeWidth,
                            "height": _self.nodeHeight
                        });
                    }else{
                        attr = {
                            "x": x,
                            "y": y,
                            "width": _self.nodeWidth,
                            "height": _self.nodeHeight
                        };
                    }
                }
                /*
                 *if(data[i].isSplit){
                 type ='split';
                 var sw = FlowUi.config.tools.states.split.attr.width;
                 var sh = FlowUi.config.tools.states.split.attr.height;
                 attr.x =attr.x+attr.width/2-sw/2;
                 attr.y=attr.y+attr.height/2-sh/2;
                 attr.width = sw;
                 attr.height =sh;
                 }else if(data[i].isJoin){
                 type= 'join';

                 var sw = FlowUi.config.tools.states.join.attr.width;
                 var sh = FlowUi.config.tools.states.join.attr.height;
                 attr.x =attr.x+attr.width/2-sw/2;
                 attr.y=attr.y+attr.height/2-sh/2;
                 attr.width = sw;
                 attr.height =sh;
                 }
                 */
                var type = data[i].type || 'task';
                if (data[i].isSplit) {
                    type = 'split';
                    var sw = FlowUi.config.tools.states.split.attr.width;
                    var sh = FlowUi.config.tools.states.split.attr.height;
                    attr.x = attr.x + attr.width / 2 - sw / 2;
                    attr.y = attr.y + attr.height / 2 - sh / 2;
                    attr.width = sw;
                    attr.height = sh;
                } else if (data[i].isJoin) {
                    type = 'join';

                    var sw = FlowUi.config.tools.states.join.attr.width;
                    var sh = FlowUi.config.tools.states.join.attr.height;
                    attr.x = attr.x + attr.width / 2 - sw / 2;
                    attr.y = attr.y + attr.height / 2 - sh / 2;
                    attr.width = sw;
                    attr.height = sh;
                }else  if(data[i].isEnd){
                    type="end";
                }else if(_self.isIndex){
                    // 浏览态 的状态图标 和意见图标
                    // statusImg commentsImg

                    // 根据节点状态 、是否是当前节点、是否是第一个节点 获取对应图标
                    var state = data[i].state;
                    if(data[i].nodeType=='person'){
                        var personState;
                        var personAttitude;
                        /**节点状态是已经处理，但是却没有人员列表,则指定默认状态*/
                        if( state ===_self.WorkFlowNodeState.state_done.value  && ( (!data[i].nodePersonList) || (!data[i].nodePersonList.length) )){
                            personState = _self.WorkFlowPersonState.state_done.value;
                            personAttitude = _self.WorkFlowPersonAttitude.agree.value;
                        }else{
                            personState = data[i].nodePersonList && data[i].nodePersonList.length>0?data[i].nodePersonList[0].state:_self.WorkFlowPersonState.state_none.value;
                            personAttitude = data[i].nodePersonList && data[i].nodePersonList.length>0?data[i].nodePersonList[0].attitude:_self.WorkFlowPersonAttitude.no_read.value;
                        }
                        statusImg = _self.getStatusImg({
                            nodeType:data[i].nodeType,
                            nodeState:state,
                            personState:personState,
                            personAttitude:personAttitude,
                            isCurrent:(data[i].id == _self.currentNodeId),
                            isFirst:(i==0)
                        });
                    }else{
                        statusImg = _self.getStatusImg({
                            nodeType:data[i].nodeType,
                            nodeState:state,
                            isCurrent:(data[i].id == _self.currentNodeId),
                            isFirst:(i==0)
                        });
                    }
                    /**催办图标获取 **/
                    hastenWorkImg =  _self.getHastenWorkImg({
                        nodeType:data[i].nodeType,
                        notifyNode:data[i].notifyNode,
                        nodeState:state,
                        isCurrent:(data[i].id == _self.currentNodeId),
                        isFirst:(i==0)
                    });

                    if(data[i].id == _self.currentNodeId && (attr)){
                        attr.fill = '#fa8d00'; //橘黄色与  图标颜色一致
                    }
                }
                var notifyImg = _self.getNotifyImg({
                    nodeType:data[i].nodeType,
                    notifyNode:data[i].notifyNode,
                    nodeState:state,
                    isCurrent:(data[i].id == _self.currentNodeId),
                    isFirst:(i==0)
                });
                states[newId] = {
                    id: data[i].id,
                    "type": i == 0 ? 'start' : type,
                    "text": {
                        "text": data[i].name
                    },
                    "attr": attr
                };
                if(statusImg &&(statusImg.indexOf('state_none')<0) ){ //如果状态图标找到则 绑定到显示位置,state_none 尚未到达无需状态
                    states[newId].statusImg = {
                        width:22,
                        height:22,
                        src:statusImg
                    };
                }
                /* 催办图标**/
                if(hastenWorkImg&&hastenWorkImg.length>0){
                    states[newId].hastenWorkImg = {
                        cursor : "pointer",
                        width:38,
                        height:17,
                        src:hastenWorkImg
                    };
                }
                /** 知会图标创建****/
                if(notifyImg&&notifyImg.length){
                    states[newId].notifyImg = {
                        //cursor : "pointer",
                        width:17,
                        height:17,
                        src:notifyImg
                    };
                }
                /** 判断父节点是否 是split 如果是 则需要 提供分支图标显示***/
                if(data[i].isParentSplit && (!data[i].isSplit)){
                    var splitImgSrc  = _self.getSplitImgSrc();
                    states[newId].splitImg =  {
                        pid:data[i].pid,
                        cursor : "pointer",
                        width:16,
                        height:16,
                        src:splitImgSrc
                    };
                }else{
                    states[newId].splitImg = null;
                }
                if(data[i].isJoin){
                    states[newId].joinImg =  {
                        cursor : "pointer",
                        width:16,
                        height:16,
                        src:_self.getJoinImgSrc()
                    };
                }else{
                    states[newId].joinImg = null;
                }
                /*
                 * 节点图标 根据节点类型配置 获取图标 如果没有配置则走默认
                 */
                if( FlowUi.config.tools.states[data[i].nodeType]&& _self.WorkFlowNodeType[data[i].nodeType]){
                    var imgConfig =  FlowUi.config.tools.states[data[i].nodeType].img;
                    if(imgConfig){
                        states[newId].img = imgConfig;
                    }
                }
                _self.nodeIdMap[data[i].id].attr = attr;
                //if( FlowUi.config.tools.states[data[i].nodeType]&& _self.WorkFlowNodeType[data[i].nodeType]){
                //   var imgConfig = FlowUi.config.tools.states[data[i].nodeType];
                //    _self.nodeIdMap[data[i].id].img = imgConfig.img;
                //}

                _self.buildPathsByNode(data[i], paths, isVertical);
            }
            return obj;
        },
        /**
         * 根据节点创建 连接线
         */
        buildPathsByNode: function (node, paths, isVertical) {
            var _self = this;
            var lines = node.lines;
            var pathId;
            for (var i = 0, len = lines.length; i < len; i++) {

                pathId = _self.createNewId();
                paths[pathId] = lines[i];
                var dots = lines[i].dots;
                if (isVertical) {
                    lines[i].dots = _self.getDots4vertical(dots);
                }
            }
        },
        /**
         * 根据点列表 进行正时针旋转90度后返回 点列表
         *
         */
        getDots4vertical: function (dots) {
            var _self = this;
            var arr = [];
            var curr;
            for (var i = 0, len = dots.length; i < len; i++) {
                curr = _self.rotate(dots[i], Math.PI / 2);
                //curr.x +=500;
                curr.x += (_self.nodeWidth / 2 + _self.nodeHeight / 2);
                curr.y -= (_self.nodeWidth / 2 - _self.nodeHeight / 2);
                arr.push(curr);
            }
            return arr;
        },
        /**
         *
         * 备份 数组的流程节点数据，深度clone备份需要 遍历数组 对元素对象进行深度复制
         */
        cloneWorkFlowNodeList: function (arr) {
            var items = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                items[i] = $.extend(true, {}, arr[i]);
            }
            //return $.extend(true,[],arr);
            return items;
        },
        event2processGraph:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            _self.toProcessProps = false;
            FlowUi.render('flow-ui-item'); //渲染按钮
            FlowUi.render('flow-ui-bottomButtons');
            $("#ouiflow").show();
            $("#flow-ui-viewType").show();
            $("#flow-ui-processProp").hide();
            _self.scroll2center();
            return false;
        },
        event2processProps:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            _self.toProcessProps = true;
            FlowUi.render('flow-ui-item'); //渲染按钮
            if(!$("#flow-ui-processProp").hasClass('flow-ui-processProp')){
                _self.processProp = _self.flowData; //流程数据渲染
                var rights = _self.processProp.rights ||"[]";
                var rightJson = oui.parseJson(rights);
                var persons = [];
                var selectPerson4right ='';
                var selectPerson4rightValue =[];
                for(var i= 0,len=rightJson.length;i<len;i++){
                    persons.push({
                        id:rightJson[i].toId,
                        name:rightJson[i].toName,
                        typeFlag:rightJson[i].toType
                    });
                    selectPerson4rightValue.push(rightJson[i].toId);
                }
                if(persons.length>0){
                    selectPerson4right = oui.parseString(persons);
                }
                _self.processProp.selectPerson4right = selectPerson4right;
                _self.processProp.selectPerson4rightValue = selectPerson4rightValue.join(",");
                FlowUi.render('flow-ui-processProp');
                oui.parse();
            }
            FlowUi.render('flow-ui-bottomButtons');
            $("#ouiflow").hide();
            $("#flow-ui-viewType").hide();
            $("#flow-ui-processProp").show();
            return false;
        },
        /**
         * 横向
         */
        event2trans: function (cfg) {
            var _self = this;
            var ViewType = _self.ViewType;
            var FlowUi = _self.getFlowUi();
            _self.isVertical = false;
            _self.flowData.viewType = ViewType.horizontal.value;
            FlowUi.render('flow-ui-viewType'); //渲染横向纵向
            $('#ouiflow').css({width:'',height:'',left:0,top:0});
            _self.refresh();
            return false;
        },
        /**
         * 纵向
         */
        event2vertical: function (cfg) {
            var _self = this;
            var ViewType = _self.ViewType;
            var FlowUi = _self.getFlowUi();
            _self.isVertical = true;
            _self.flowData.viewType = ViewType.vertical.value;
            FlowUi.render('flow-ui-viewType');
            $('#ouiflow').css({width:'',height:'',left:0,top:0});
            _self.refresh();
            return false;
        },
        /**
         * 根据 按钮或者元素上配置的 flow-themeId属性获取对应的渲染配置
         */
        event2renderByThemeId: function (cfg) {
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var el = cfg.el;
            var themeId = $(el).attr('flow-themeId');
            _self.themeId = themeId;
            FlowUi.render('flow-ui-item');
            FlowUi.config = $.extend(true, FlowUi.config, FlowUi.themes[themeId] || {});
            _self.refresh();
        },

        /**
         * 根据工作流结构数据刷新流程图
         */
        refresh: function () {

            this.newId = 0; //刷新时将newId复原
            var _self = this;
            _self.progressBar = oui.progress("加载中...");
            _self.hideContextMenu && _self.hideContextMenu();
            if (_self.isVertical) {
                _self.offsetY = 100; //横向 160 纵向为100
                _self.x_distance_S = 64; //横向为80 纵向为60 //分子节点 和聚合节点连接线距离
                _self.x_distance = 120 //串发节点连线距离
                _self.rootPosY = -17; //第一个节点 左偏移量
                _self.rootPosX =150;
                //_self.nodeHeight = 65+_self.nodeSplitWidth;
            } else {
                _self.offsetY = 60; //横向 60 纵向为100
                _self.x_distance_S = 65; //横向为80 纵向为60
                _self.x_distance = 130;
                _self.rootPosY = 0; //第一个节点 左偏移量
                _self.rootPosX=50;
                //_self.nodeHeight = 65;
            }
            _self.maxLevel_H = 0;
            _self.maxLevel_V = 0;
            _self.mc_width = 0;
            _self.mc_height = 0;
            _self.branchLevelVMap = new FlowBiz.Map();
            _self.splitJoinMap = new FlowBiz.Map();
            _self.joinSplitMap = new FlowBiz.Map();
            var cloneArr = _self.cloneWorkFlowNodeList(_self.workFlowNodeList);
            //console.log(oui.biz.Tool.encode(_self.workFlowNodeList));
            //console.log('create before...');
            var startNode = _self.createTreeNode(cloneArr);
            //console.log(oui.biz.Tool.encode(_self.workFlowNodeList));
            //console.log('create after...');
            _self.countLevelH(startNode, 0); //计算横向层级
            _self.countLevelV(startNode, 0); //计算纵向层级
            _self.countPosition(startNode, "false"); //计算节点位置
            _self.countDistance(); //计算 宽高
            _self.countNodeLinesPosition(startNode); //计算节点的连接线位置
            var workflowTreeNode = _self.createNodeData(cloneArr, _self.isVertical);//根据数组节点创建 树结构流程节点
            _self.workflowTreeNode = workflowTreeNode;
            var width = _self.isVertical ? _self.mc_height : _self.mc_width;
            var height = _self.isVertical ? _self.mc_width : _self.mc_height;
            width+=100;
            height+=100;
            //if(height<=120){
            //    height=150;
            //}
            //if((!_self.isVertical) &&(width<500)){
            //    width=500;
            //}
            //console.log('refresh..');
            //console.log(oui.biz.Tool.encode(_self.workFlowNodeList));
            //console.log(_self.workFlowNodeList);
            $(function () {
                $("#ouiflow").css({left:0,top:0,position: "relative",width:'',height:''});
                $('#ouiflow').html(""); //渲染流程图区域
                $('#ouiflow').FlowUi({// 初始化流程图区域渲染
                    basePath: oui.getContextPath() + 'res_engine/workflow/',
                    //restore:eval("({states:{rect1:{type:'start',text:{text:'开始'}, attr:{ x:496, y:47, width:100, height:50}, props:{text:{value:'开始'},temp1:{value:''},temp2:{value:''}}},rect2:{type:'task',text:{text:'任务1'}, attr:{ x:499, y:156, width:100, height:50}, props:{text:{value:'任务1'},temp1:{value:''},temp2:{value:''}}},rect3:{type:'fork',text:{text:'分支'}, attr:{ x:499, y:263, width:100, height:50}, props:{text:{value:'分支'},temp1:{value:''},temp2:{value:''}}},rect4:{type:'task',text:{text:'任务2'}, attr:{ x:117, y:358, width:100, height:50}, props:{text:{value:'任务2'},temp1:{value:''},temp2:{value:''}}},rect5:{type:'task',text:{text:'任务3'}, attr:{ x:294, y:364, width:100, height:50}, props:{text:{value:'任务3'},temp1:{value:''},temp2:{value:''}}},rect6:{type:'task',text:{text:'任务4'}, attr:{ x:785, y:358, width:100, height:50}, props:{text:{value:'任务4'},temp1:{value:''},temp2:{value:''}}},rect7:{type:'join',text:{text:'合并'}, attr:{ x:501, y:364, width:100, height:50}, props:{text:{value:'合并'},temp1:{value:''},temp2:{value:''}}},rect8:{type:'end',text:{text:'结束'}, attr:{ x:498, y:593, width:100, height:50}, props:{text:{value:'结束'},temp1:{value:''},temp2:{value:''}}}},paths:{path9:{from:'rect1',to:'rect2', dots:[],text:{text:'TO 任务1',textPos:{x:27,y:-10}}, props:{text:{value:'TO 任务1'}}},path10:{from:'rect2',to:'rect3', dots:[],text:{text:'TO 分支',textPos:{x:39,y:-6}}, props:{text:{value:'TO 分支'}}},path11:{from:'rect3',to:'rect5', dots:[],text:{text:'TO 任务3',textPos:{x:33,y:-8}}, props:{text:{value:'TO 任务3'}}},path12:{from:'rect5',to:'rect7', dots:[],text:{text:'TO 合并',textPos:{x:30,y:-5}}, props:{text:{value:'TO 合并'}}},path13:{from:'rect7',to:'rect8', dots:[],text:{text:'TO 结束',textPos:{x:38,y:-8}}, props:{text:{value:'TO 结束'}}},path14:{from:'rect3',to:'rect4', dots:[{x:316,y:291}],text:{text:'TO 任务2',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务2'}}},path15:{from:'rect4',to:'rect7', dots:[{x:318,y:498}],text:{text:'TO 合并',textPos:{x:-11,y:11}}, props:{text:{value:'TO 合并'}}},path16:{from:'rect3',to:'rect6', dots:[{x:762,y:283}],text:{text:'TO 任务4',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务4'}}},path17:{from:'rect6',to:'rect7', dots:[],text:{text:'TO 合并',textPos:{x:30,y:10}}, props:{text:{value:'TO 合并'}}}},props:{props:{name:{value:'新建流程'},key:{value:''},desc:{value:''}}}})"),
                    //restore: eval("({states:{rect16:{type:'start',text:{text:'开始'}, attr:{ x:496, y:47, width:100, height:50}, props:{text:{value:'开始'},temp1:{value:''},temp2:{value:''}}},rect17:{type:'task',text:{text:'任务1'}, attr:{ x:499, y:156, width:100, height:50}, props:{text:{value:'任务1'},temp1:{value:''},temp2:{value:''}}},rect18:{type:'fork',text:{text:'分支'}, attr:{ x:499, y:263, width:100, height:50}, props:{text:{value:'分支'},temp1:{value:''},temp2:{value:''}}},rect19:{type:'task',text:{text:'任务2'}, attr:{ x:274, y:362, width:100, height:50}, props:{text:{value:'任务2'},temp1:{value:''},temp2:{value:''}}},rect20:{type:'task',text:{text:'任务3'}, attr:{ x:499, y:365, width:100, height:50}, props:{text:{value:'任务3'},temp1:{value:''},temp2:{value:''}}},rect21:{type:'task',text:{text:'任务4'}, attr:{ x:701, y:364, width:100, height:50}, props:{text:{value:'任务4'},temp1:{value:''},temp2:{value:''}}},rect22:{type:'join',text:{text:'合并'}, attr:{ x:499, y:472, width:100, height:50}, props:{text:{value:'合并'},temp1:{value:''},temp2:{value:''}}},rect23:{type:'end',text:{text:'结束'}, attr:{ x:498, y:593, width:100, height:50}, props:{text:{value:'结束'},temp1:{value:''},temp2:{value:''}}}},paths:{path24:{from:'rect16',to:'rect17', dots:[],text:{text:'TO 任务1',textPos:{x:27,y:-10}}, props:{text:{value:'TO 任务1'}}},path25:{from:'rect17',to:'rect18', dots:[],text:{text:'TO 分支',textPos:{x:39,y:-6}}, props:{text:{value:'TO 分支'}}},path26:{from:'rect18',to:'rect20', dots:[],text:{text:'TO 任务3',textPos:{x:33,y:-8}}, props:{text:{value:'TO 任务3'}}},path27:{from:'rect20',to:'rect22', dots:[],text:{text:'TO 合并',textPos:{x:30,y:-5}}, props:{text:{value:'TO 合并'}}},path28:{from:'rect22',to:'rect23', dots:[],text:{text:'TO 结束',textPos:{x:38,y:-8}}, props:{text:{value:'TO 结束'}}},path29:{from:'rect18',to:'rect19', dots:[{x:316,y:291}],text:{text:'TO 任务2',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务2'}}},path30:{from:'rect19',to:'rect22', dots:[{x:318,y:498}],text:{text:'TO 合并',textPos:{x:-11,y:11}}, props:{text:{value:'TO 合并'}}},path31:{from:'rect18',to:'rect21', dots:[{x:762,y:283}],text:{text:'TO 任务4',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务4'}}},path32:{from:'rect21',to:'rect22', dots:[{x:747,y:495}],text:{text:'TO 合并',textPos:{x:30,y:10}}, props:{text:{value:'TO 合并'}}}},props:{props:{name:{value:'新建流程'},key:{value:''},desc:{value:''}}}})"),
                    restore: workflowTreeNode,
                    width: width,
                    height: height,
                    tools: {
                        save: {
                            onclick: function (data) {
                                console.log(data);
                                console.log(oui.biz.Tool.encode(eval('(' + data + ')')));

                                alert('save:\n' + data);
                            }
                        }
                    }
                });
                _self.scroll2center();
                _self.progressBar && _self.progressBar.hide();
            });
            _self.changed();
        }
    };
    /**
     * 滚动条滚动到居中位置
     */
    FlowBiz.scroll2center=function(){
        var _self = this;
        //if(_self.isVertical){
        //    var scrollSize = $('html,body')[0].scrollWidth - $('html,body').width();
        //    $('html,body').scrollLeft(scrollSize/2);
        //}else{
        //    var scrollSize = $('html,body').height()-$('iframe',window.parent.document).height();
        //    $('html,body').scrollTop(scrollSize/2);
        //}
        if(_self.isVertical){
            var scrollSize = $('.flow-body')[0].scrollWidth - $('.flow-body').width();
            var barWidth =$('.flow-body')[0].offsetWidth -$('.flow-body')[0].clientWidth;
            var barHeight = $('.flow-body')[0].offsetHeight-$('.flow-body')[0].clientHeight;

            if(barWidth<=0 && barHeight<=0){
                $("#ouiflow").css({position:'relative',left:(0)+'px'});
            }else if(barHeight<=0){
                $("#ouiflow").css({position:'relative',left:(17/2)+'px'});
            }
            $('.flow-body').scrollLeft(scrollSize/2);
        }else{
            var scrollSize = $('.flow-body')[0].scrollHeight - $('.flow-body').height();
            $('.flow-body').scrollTop(scrollSize/2);
        }
    }
    /************流程图位置计算 开始*****************************************************/

    /**
     * 计算横向层次
     * @param node
     * @param index
     */
    FlowBiz.countLevelH = function (node, index) {
        var _self = this;
        var _parent = node.parents;
        var children = node.children;
        node.index = index;
        if (node.level_H && node.level_H > 100) {
            throw "流程图显示最大支持的横向节点数为100！";
        }
        var maxCurrentLevel_H = 0;
        var _parent1;
        if (_parent.length == 0) {
            node.level_H = 1;
        } else if (node.isJoin) {
            for (var i = 0, len = _parent.length; i < len; i++) {
                _parent1 = _parent[i];
                if (_parent1.level_H > maxCurrentLevel_H) {
                    maxCurrentLevel_H = _parent1.level_H;
                }
            }
            maxCurrentLevel_H++;
            if (node.level_H >= maxCurrentLevel_H) {
                return;
            }
            node.level_H = maxCurrentLevel_H;
            if (node.level_H > _self.maxLevel_H) {
                _self.maxLevel_H = node.level_H;
            }
        } else {
            for (var i = 0, len = _parent.length; i < len; i++) {
                _parent1 = _parent[i];
                node.level_H = _parent1.level_H + 1;
                if (node.level_H > maxCurrentLevel_H) {
                    maxCurrentLevel_H = node.level_H;
                }
            }
            if (node.level_H > _self.maxLevel_H) {
                _self.maxLevel_H = node.level_H;
            }
        }

        for (var k = 0, len = children.length; k < len; k++) {
            _self.countLevelH(children[k], k);
        }
    };

    /**
     * 计算垂直层次
     * @param node
     * @param index
     */
    FlowBiz.countLevelV = function (node, index) {
        var _self = this;
        if (node.level_V > 0) return;
        var children = node.children;
        node.index = index;
        if (node.level_V > 100) {
            throw  "流程图显示最大支持的纵向节点数为100！";
        }
        var child;
        if (children.length == 0) {
            node.level_V = 1;
        } else {
            var result = 0;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                _self.countLevelV(child, i);
                result += child.level_V;
            }

            node.level_V = result;
            if (node.level_V > _self.maxLevel_V) {
                _self.maxLevel_V = node.level_V;
            }
            // Split节点
            if (node.isSplit) {
                // Split节点等于每个分支到对应Join节点之间的所有闭环level_V最大值之和。
                var join = _self.findJoin(node);
                result = 0;
                for (var j = 0, jLen = children.length; j < jLen; j++) {
                    child = children[j];
                    var splits = _self.findAllSplit(child, join);
                    var max = 1;
                    if (child.isSplit) {
                        splits.push(child);
                    }
                    for (var k = 0, kLen = splits.length; k < kLen; k++) {
                        var kNode = splits[k];
                        _self.countLevelV(kNode, kNode.index);
                        if (max < kNode.level_V) {
                            max = kNode.level_V;
                        }
                    }
                    result += max;
                }
                if (result < children.length) {
                    result = children.length;
                }
                node.level_V = result;
                if (result > _self.maxLevel_V) {
                    _self.maxLevel_V = result;
                }
                if (join != null) {
                    join.level_V = result;
                }
            } else if (node.isJoin || children[0].isJoin) {
                // Join节点
                node.level_V = 1;
            } else {
                // 普通节点
                // 查找后续的第一个Split节点，遇到Join或End则终止
                var split = children[0];

                while (!split.isSplit) {
                    if (split.children.length == 0) {
                        break;
                    }
                    if (split.isJoin) {
                        break;
                    }
                    split = split.children[0];
                }
            }
        }
    };

    /**
     * 计算最终的距离
     */
    FlowBiz.countDistance = function () {
        var _self = this;
        _self.mc_width =_self.countedSVGWidth+65; //默认加一个宽度
        _self.mc_height = _self.mc_height = _self.y_distance * _self.maxLevel_V;
        //_self.mc_width = _self.x_distance * _self.maxLevel_H;
    };


    /**
     * 计算节点与子节点之间的连线
     */
    FlowBiz.countNodeLinesPosition = function (node) {
        var x = node.x;
        var y = node.y;
        var children = node.children;
        var lines = [];
        var _self = this;
        if (children.length > 0) {
            //取父与子的中点
            var firstChild = children[0];
            var endChild = children[children.length - 1];
            var lines = [];
            //var midPos = {x: (x+firstChild.x)/2+_self.nodeWidth/2,y:node.y+_self.nodeHeight/2};
            var dots = [], currPos;
            //分割线与子节点的横线连接
            for (var i = 0, len = children.length; i < len; i++) {
                dots = [];

                if (node.y == children[i].y) {
                    //dots = [midPos];
                } else {

                    if (node.isSplit) {
                        dots = [{
                            x: node.x + _self.nodeWidth / 2,
                            y: children[i].y + _self.nodeHeight / 2
                        }];
                    }
                    if (children[i].isJoin) {
                        dots = [{
                            x: children[i].x + _self.nodeWidth / 2,
                            y: node.y + _self.nodeHeight / 2
                        }];
                    }
                }
                lines.push({
                    nodeId: node.id,
                    "from": node.newId,
                    "to": children[i].newId,
                    "dots": dots,
                    "text": {
                        "text": "",// "TO "+children[i].name,
                        "textPos": {
                            "x": -1,
                            "y": -1
                        }
                    },
                    "props": {
                        "text": {
                            "value": ""// "TO "+children[i].name
                        }
                    }
                });
                _self.countNodeLinesPosition(children[i]);
            }

        }
        var newLines = [];
        if(lines&& lines.length){
            var centerIdx;
            if(lines.length%2 ==0){
                centerIdx = lines.length/2-1;
            }else{
                centerIdx = parseInt(lines.length/2);
            }
            if(centerIdx<0){
                centerIdx = 0;
            }
            for(var i= 0;i<= centerIdx;i++){
                newLines.push(lines[i]);
            }

            for(var j=lines.length-1;j>centerIdx;j--){
                newLines.push(lines[j]);
            }
        }
        node.lines = newLines;
    };
    /**
     * 旋转 点的位置
     * FlowBiz.rotate({x : 0,y : 4},-Math.PI / 4) //第二个参数为负数时逆时针旋转，否则正时针旋转
     *
     */
    FlowBiz.rotate = function (source, angle)//angle为正时逆时针转动, 单位为弧度
    {
        var a, r;
        var _self = this;
        a = Math.atan2(source.y, source.x)//atan2自带坐标系识别, 注意X,Y的顺序

        a += angle//旋转
        r = Math.sqrt(source.x * source.x + (source.y) * (source.y))//半径

        var nx = Math.cos(a) * r;
        var ny = Math.sin(a) * r;

        nx += (_self.mc_height); //位置变换

        ny -= _self.y_distance;
        //ny-=_self.y_distance-_self.nodeHeight*3/2;


        return {
            x: nx,
            y: ny
        }

    };
    /**
     * 计算节点的位置
     * @param node
     * @param isNew
     */
    FlowBiz.countPosition = function (node, isNew) {
        var _self = this;
        var _parent = node.parents;
        var children = node.children;
        var isCountX = false;
        var xPosition = 0;
        var y = 0;
        if (_parent.length == 0) {
            node.x = _self.rootPosX;
            node.y = _self.maxLevel_V * _self.y_distance / 2 + _self.rootPosY;
            _self.firstPos = {x:node.x,y:node.y};
        } else {
            xPosition = _parent[0].x + _self.x_distance;
            if (_parent.length == 1) {
                if ((node.isSplit && children.length > 1) // 实体Split
                    || _parent[0].isSplit || _parent[0].isJoin) { // 父节点为Split节点，缩短其连线
                    xPosition = _parent[0].x + _self.x_distance_S;
                } else if (children.length == 0) { // END节点
                    // xPosition = _parent[0].x + _self.x_distance_S + 10;
                    //_self.mc_width = xPosition + 60;
                }
            } else {
                isCountX = true;
            }
            if (isCountX) {
                var maxXPos = _parent[0].x ||0;
                for (var i = 1, len = _parent.length; i < len; i++) {
                    //取父节点中x位置最大的作为相对位置
                    maxXPos = Math.max(maxXPos,_parent[i].x||0);

                    /*
                     * 注释掉之前的算法 用于计算聚合节点x位置
                     */
                    //var iNode = _parent[i];
                    //if (isCountX && (node.level_H == iNode.level_H + 1)) {
                    //    xPosition = iNode.x + _self.x_distance_S;
                    //    break;
                    //}
                }
                xPosition = maxXPos+ _self.x_distance_S; //计算出当前聚合节点的x位置
            }
            node.x = xPosition;

            if (_parent.length == 1 && _parent[0].isJoin) {
                y = _parent[0].y;
            } else {
                // 以父节点位置为基准
                // 减去所有兄弟占位的一半
                var disp = _parent[0].level_V;
                y = _parent[0].y - disp * _self.y_distance / 2;
                var branchLevelV;


                // 加上前面的兄弟节点的偏移
                for (var i = 0, len = node.index; i < len; i++) {
                    var sibling = _parent[0].children[i];
                    branchLevelV = _self.getBranchLevelV(sibling);
                    y += branchLevelV * _self.y_distance;
                }
                // 减去自身的偏移的一半 父为split而且子节点数大于1（考虑分支）
                if (_parent[0].isSplit) {
                    if (_parent[0].children.length > 1) {
                        branchLevelV = _self.getBranchLevelV(node);
                        y += branchLevelV * _self.y_distance / 2;
                    } else { // split的唯一父节点是split的情况,直接赋值为父节点的Y值
                        y = _parent[0].y;
                    }
                } else {
                    //console.log(node.level_V);
                    y += node.level_V * _self.y_distance / 2;
                }

            }
            if (_parent.length > 1) {
                node.y = (_parent[0].y + _parent[_parent.length - 1].y) / 2;
            } else {
                node.y = (y);
            }
        }
        if (node.x != 0 && node.y != 0) {
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                _self.countPosition(child, isNew);
            }
        }
        if(node.isEnd && node.x&&node.y){
            _self.endPos = {
                x:node.x,
                y:node.y
            };
            _self.countedSVGWidth = _self.endPos.x - _self.firstPos.x;
        }
    };


    /**
     * 根据split节点查找join节点
     * @param split
     * @returns {*}
     */
    FlowBiz.findJoin = function (split) {
        var self = this;
        var key = split.id;
        if (self.splitJoinMap.containsKey(key)) {
            return self.splitJoinMap.get(key);
        }
        /***找出所有的join节点 ****/
        var joins = self.findAllJoin(split);
        var children = split.children;
        var arr = [];
        /** 遍历所有的join节点，判断当前节点以及子节点和孙子节点都于join节点 属于同一条分支或者同一条线上 ****/
        for (var i = 0, len = joins.length; i < len; i++) {
            var join = joins[i];
            var allPass = true;
            for (var j = 0, jLen = children.length; j < jLen; j++) {
                var child = children[j];
                if (!self.passThrough(child, join)) {
                    allPass = false;
                    break;
                }
            }
            /***如果当前join节点与split节点在同一条线上，则放入join列表 ***/
            if (allPass) {
                arr.push(join);
            }
        }
        if (arr == null || arr.length < 1) {
            return null;
        }
        if (arr.length == 1) {
            return arr[0];
        }
        /*** 存在 多分子，多join节点时，需要取一个join节点作为目标，判断与后续 同一条线上的join节点，将同一条线上的最后一个join节点作为split的匹配节点 ****/
        var result = arr[0];
        for (var i = 0, len = arr.length; i < len; i++) {
            var aNode = arr[i];
            if (result.id == aNode.id) {
                continue;
            }
            if (self.passThrough(aNode, result)) {
                result = aNode;
            }
        }

        self.splitJoinMap.put(key, result);
        self.joinSplitMap.put(result.id, split);
        return result;
    };

    /**
     * 查找所有的join节点
     * @param node
     * @returns {Array}
     */
    FlowBiz.findAllJoin = function (node) {
        var self = this;
        var result = [];
        var children = node.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.parents.length > 1) {
                result.push(child);
            }
            var arr = self.findAllJoin(child);
            for (var j = 0, jLen = arr.length; j < jLen; j++) {
                result.push(arr[j]);
            }
        }
        return self.unique(result);
    };

    /**
     * 去重
     * @param array
     */
    FlowBiz.unique = function (array) {
        var map = new FlowBiz.Map();
        for (var i = 0, len = array.length; i < len; i++) {
            var node = array[i];
            map.put(node.id, node);
        }
        array = null;//释放数组内存
        return map.values();//直接将map的值转化为数组
    };

    /**
     * 计算两个节点是否通过
     * @param node1
     * @param node2
     * @returns {boolean}
     */
    FlowBiz.passThrough = function (node1, node2) {
        var self = this;
        var children = node1.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.id == node2.id) {
                return true;
            }
            if (self.passThrough(child, node2)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 根据join节点查找split节点
     * @param join
     * @returns {*}
     */
    FlowBiz.findSplit = function (join) {
        var self = this;
        var key = join.id;
        // 先从Join-Split缓存中找
        if (self.joinSplitMap.containsKey(key)) {
            return self.joinSplitMap.get(key);
        }
        var splits = self.findAllSplit(self.startNode, join);

        for (var i = 0, len = splits.length; i < len; i++) {
            var split = splits[i];
            if (self.findJoin(split).id == join.id) {
                self.joinSplitMap.put(key, split);
                return split;
            }
        }
        return null;
    };

    /**
     * 查找所有的split节点
     * @param node
     * @param end
     * @returns {*}
     */
    FlowBiz.findAllSplit = function (node, end) {
        var self = this;
        var result = [];
        if (node == null || end == null) {
            return result;
        }
        if (node.id == end.id) {
            return result;
        }
        var children = node.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.isSplit) {
                result.push(child);
            }
            var arr = self.findAllSplit(child, end);
            for (var j = 0, jLen = arr.length; j < jLen; j++) {
                result.push(arr[j]);
            }
        }
        return self.unique(result);
    };
    /**
     * 获取分支节点的垂直位置
     * @param node
     * @returns {number|*}
     */
    FlowBiz.getBranchLevelV = function (node) {
        var self = this;
        var key = node.id;
        if (self.branchLevelVMap.containsKey(key)) {
            return self.branchLevelVMap.get(key);
        }
        var max = node.level_V;
        var l;
        if (node.isSplit) {
            // 如果是Split，直接从对应的Join节点开始找下一个环
            var join = self.findJoin(node);
            l = self.getBranchLevelV(join);
            if (max < l) {
                max = l;
            }
        } else {
            var children = node.children;
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                // 遇到第一个join停止
                if (child.isJoin) {
                    break;
                }
                if (child.level_V > max) {
                    max = child.level_V;
                }
                l = self.getBranchLevelV(child);
                if (max < l) {
                    max = l;
                }
            }
        }
        // 缓存
        self.branchLevelVMap.put(key, max);
        return max;
    };
    /**
     * 根据当前节点获取 分支的 levelV
     默认返回当前节点的LevelV
     */
    /*
     *FlowBiz.getBranchLevelV = function(node){
     return node.level_V;
     };
     */
    /**
     * Map 构造函数
     * @constructor
     */
    var Map = function () {
        this.container = {};
    }

    /**
     * 存入
     * @param key 存入数据的关键字
     * @param value 存入的数据
     */
    Map.prototype.put = function (key, value) {
        try {
            if (key != null && key != "") {
                this.container[key] = value;
            }
        } catch (e) {
            return e;
        }
    };

    /**
     * 取出
     * @param key 存入数据的关键字
     */
    Map.prototype.get = function (key) {
        try {
            return this.container[key];
        } catch (e) {
            return e;
        }
    };

    /**
     * 删除
     * @param key 存入数据的关键字
     * @returns {*}
     */
    Map.prototype.remove = function (key) {
        var result = null;
        try {
            result = this.container[key];
            delete this.container[key];
        } catch (e) {
            return result;
        }
        return result;
    };

    /**
     * 清空
     */
    Map.prototype.clear = function () {
        try {
            delete this.container;
            this.container = {};
        } catch (e) {
            return e;
        }
    };

    /**
     * 获取所有key
     */
    Map.prototype.keys = function () {
        var keys = [];
        for (var p in this.container) {
            keys.push(p);
        }
        return keys;
    };

    /**
     * 获取所有value
     */
    Map.prototype.values = function () {
        var values = [];
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            values.push(this.container[keys[i]]);
        }
        return values;
    };

    /**
     * 判断key是否包含
     * @param key 存入数据的关键字
     * @returns {*} true 包含，false 不包含
     */
    Map.prototype.containsKey = function (key) {
        try {
            for (var p in this.container) {
                if (p == key) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return e;
        }
    };

    /**
     * 判断是否包含该值
     * @param value 存入数据的值
     * @returns {*}
     */
    Map.prototype.containsValue = function (value) {
        try {
            for (var p in this.container) {
                if (this.container[p] === value) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return e;
        }
    };

    /**
     * 获取长度
     */
    Map.prototype.size = function () {
        return this.keys().length;
    };

    /**
     * 判断是否为空
     * @returns {boolean} true为空，false不为空
     */
    Map.prototype.isEmpty = function () {
        return this.keys().length == 0
    };

    Map.prototype.valueArray = function () {
        return this.values();
    };
    /**
     * Map 类
     */
    FlowBiz.Map = Map;
    /**********流程图位置计算结束*******************************************************/

    /**
     * 创建FlowBiz类
     */
    FlowBiz = oui.createClass(FlowBiz);

    /**
     * 启用停用 枚举
     * @type {{enable, disable, DRAFT}}
     */
    FlowBiz.StateEnum ={
        enable:{value:1,desc:'启用'},
        disable:{value:2,desc:'停用'},
        DRAFT:{value:3,desc:'草稿'}
    };

    /**
     * 流程状态枚举
     * @type {{}}
     */
    FlowBiz.WorkFlowState = {
        waitSend: {
            value: 0,
            desc: "保存待发"
        },
        on: {
            value: 1,
            desc: "流转中"
        },
        stop: {
            value: 2,
            desc: "终止"
        },
        off: {
            value: 3,
            desc: "完结"
        }
    };
    /**
     * 流程节点状态枚举
     * @type {{}}
     */
    FlowBiz.WorkFlowNodeState = {
        state_none: {
            value: 0,
            desc: "尚未到达"
        },
        state_waitDo: {
            value: 1,
            desc: "流程到达,所有人员待办未处理"
        },
        state_waitDo_someOne: {
            value: 2,
            desc: "流程到达,部分人员已处理"
        },
        state_done: {
            value: 3,
            desc: "流程到达,所有人员已处理"
        }
    };
    /**
     * 流程节点人员状态
     * state_none(0, "尚未到达"),
     state_waitSend(1,"保存待发"),
     state_sent(2, "已发"),
     state_waitDo(3, "待办"),
     state_done(4, "已办");
     * @type {{}}
     */
    FlowBiz.WorkFlowPersonState = {
        state_none: {
            value: 0,
            desc: "尚未到达"
        },
        state_waitSend:{
            value: 1,
            desc: "保存待发"
        },
        state_sent:{
            value: 2,
            desc: "已发"
        },
        state_waitDo: {
            value: 3,
            desc: "待办"
        },
        state_done: {
            value: 4,
            desc: "已办"
        }
    };
    /**
     * 获取节点状态图标
     * @param cfg
     * @returns {string}
     */
    FlowBiz.getStatusImgName = function(cfg){
        var _self = this;
        var nodeState=cfg.nodeState||0,personState=cfg.personState||0,personAttitude=cfg.personAttitude||1,isCurrent=cfg.isCurrent||false,isFirst=cfg.isFirst||false,nodeType=cfg.nodeType;
        var statusImgName ='';
        if(nodeType=='person'){
            var personKey = _self.getEnumKeyByValue(personState,_self.WorkFlowPersonState);
            var attitudeKey="";
            if(!personKey){
                personKey = _self.getEnumKeyByValue(_self.WorkFlowPersonState.state_none.value,_self.WorkFlowPersonState);
            }
            statusImgName = personKey;
            if(personKey && (personKey!='state_none') && (personKey!='state_waitSend')&& (personKey!='state_sent')){ //state_none,state_waitSend,state_sent 不用判断attitude状态
                attitudeKey = _self.getEnumKeyByValue(personAttitude,_self.WorkFlowPersonAttitude);
                if(!attitudeKey){
                    attitudeKey=_self.getEnumKeyByValue(_self.WorkFlowPersonAttitude.no_read.value,_self.WorkFlowPersonAttitude);
                }
                statusImgName+= ('_'+attitudeKey);
            }

        }else{
            var nodeKey = _self.getEnumKeyByValue(nodeState,_self.WorkFlowNodeState);
            if(!nodeKey){
                nodeKey = "state_none";
            }
            statusImgName = nodeKey;
        }
        if(isCurrent){
            return statusImgName+'_3'; //橘黄色图标为当前高亮节点
        }else if(isFirst){
            return statusImgName+'_2'; //发起者图标
        }else{
            return statusImgName+'_1'; //默认图标
        }
    };
    /**
     * 根据配置对象 获取当前状态图标
     * @param cfg { var nodeState=cfg.nodeState||0,personState=cfg.personState||0,personAttitude=cfg.personAttitude||1,isCurrent=cfg.isCurrent||false,isFirst=cfg.isFirst||false,nodeType=cfg.nodeType;
       }
     */
    FlowBiz.getStatusImg = function(cfg){
        var _self = this;
        return 'img/16/'+_self.getStatusImgName(cfg)+'.png';
    };
    /**获取催办图标 ***/
    FlowBiz.getHastenWorkImg = function(cfg){
        var _self = this;
        var nodeState = cfg.nodeState||"";
        var src = '';
        var noHastan = oui.getParam('noHastan');
        /** 如果页面参数传入无需催办，则不显示催办按钮****/
        if(noHastan && noHastan =='true'){
            return '';
        }
        if(_self.WorkFlowNodeState.state_waitDo.value == nodeState || _self.WorkFlowNodeState.state_waitDo_someOne.value == nodeState){
            /** 运行态当前人 必须是发起人才能有催办功能,催办功能2018-7-9之前 的逻辑注释如下***/
            //if((_self.currLoginNodeId ==_self.workFlowNodeList[0].nodeId) && (!cfg.notifyNode)){
            //    src= 'img/16/hasten_work.png';
            //}
            /**** 所有人都有催办功能，需求变更 2018-7-9 产品康艳要求 */
            if(!cfg.notifyNode){
                src= 'img/16/hasten_work.png';
            }
        }
        return src;
    };
    FlowBiz.getNotifyImg = function(cfg){
        var src = '';
        if(cfg.notifyNode){
            if(!cfg.isCurrent){
                src= 'img/16/notify_1.png';
            }else{
                src= 'img/16/notify_3.png';
            }
        }
        return src;
    }
    /***如果当前节点的父节点是split节点，则需要在当前节点前面增加 一个split图标 ***/
    FlowBiz.getSplitImgSrc = function(isHigh){
        var _self = this;
        if(isHigh){
            return 'img/16/split-high.png';
        }else{
            return 'img/16/split.png';
        }
    };
    /** 获取join节点 的图片显示****/
    FlowBiz.getJoinImgSrc = function(isHigh){
        var _self = this;
        if(isHigh){
            return 'img/16/join-high.png';
        }else{
            return 'img/16/join.png';
        }
    };

    /**
     * 根据 枚举值 和枚举对象获取对应的 枚举 key
     * @param v
     * @param enumClz
     * @returns {*}
     */
    FlowBiz.getEnumKeyByValue = function(v,enumClz){
        for(var j in enumClz){
            if(v ===enumClz[j].value){
                return j;
            }
        }
        return null;
    }
    /**
     * 人员态度 枚举
     * @type {{no_read: {value: number, desc: string}, has_read: {value: number, desc: string}, hold: {value: number, desc: string}, agree: {value: number, desc: string}, disagree: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowPersonAttitude = {
        no_read: {
            value: 1,
            desc: "未看"
        },
        has_read: {
            value: 2,
            desc: "已阅"
        },
        hold: {
            value: 3,
            desc: "暂存待办"
        },
        agree: {
            value: 4,
            desc: "同意"
        },
        disagree: {
            value: 5,
            desc: "不同意"
        },
        stop:{
            value: 6,
            desc: "终止"
        }
    };

    /**
     * 流程显示方式
     * @type {{horizontal: {value: number, desc: string}, vertical: {value: number, desc: string}}}
     */
    FlowBiz.ViewType = {
        horizontal: {
            value: 1,
            desc: "横向"
        },
        vertical: {
            value: 2,
            desc: "纵向"
        }
    };
    /**
     * 节点类型
     * @type {{all: {value: string, desc: string}, person: {value: string, desc: string}, department: {value: string, desc: string}, company: {value: string, desc: string}, level: {value: string, desc: string}, post: {value: string, desc: string}, role: {value: string, desc: string}, team: {value: string, desc: string}}}
     */
    FlowBiz.WorkFlowNodeType= oui.WorkFlowNodeType; //oui-common中定义流程节点类型
    /**
     * 重要程度 枚举
     * @type {{normal: {value: number, desc: string}, important: {value: number, desc: string}, very_important: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowImportance ={
        normal:{
            value:1,
            desc:'普通'
        },
        important:{
            value:2,
            desc:'重要'
        },
        very_important:{
            value:3,
            desc:'非常重要'
        }
    };
    /**
     * 单元格权限枚举
     * @type {{}}
     */
    FlowBiz.FieldRightEnum = {
        edit:{
            name:'edit',
            value:1,
            desc:'编辑'
        },
        view:{
            name:'view',
            value:2,
            desc:'浏览'
        },
        hidden:{
            name:'hidden',
            value:3,
            desc:'隐藏'
        },
        invisible:{
            name:'invisible',
            value:4,
            desc:'不可见'
        }
    };
    /**
     * 流程节点执行模式 枚举
     * @type {{single: {value: number, desc: string}, multi: {value: number, desc: string}, all: {value: number, desc: string}, competition: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowChooseType =oui.WorkFlowChooseType;
    /**
     * 流程节点权限 枚举
     * @type {{stop: {value: number, desc: string}, rollBack: {value: number, desc: string}, addNodes: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowNodeRight = oui.WorkFlowNodeRight;//oui-common中的流程节点权限枚举
    /**
     * 校验配置
     * @type {{workFlowNodeListMaxSize: number, nodePersonListMaxSize: number, commentsMaxSize: number}}
     */
    FlowBiz.ValidateConfig ={
        workFlowNodeListMinSize:3,//节点的最少数量限制
        workFlowNodeListMaxSize:60, //节点的总数限制
        nodePersonListMaxSize:100, //节点的成员数限制 查看态用
        commentsMaxSize:100, //意见回复数限制
        failMode:'alert', //失败的提示模式
        workFlowProp:{ //流程属性校验配置
            name:{
                des:"流程名称",
                require:true,
                maxLength:60 //流程标题不能超过60个字符
            },
            des:{
                des:"流程描述",
                maxLength:1000 //流程描述不能超过1000个字符
            }
        },
        workFlowNode:{
            nodeDisplayName:{ //流程节点 的显示名称属性
                maxLength:50 //最大长度为50
            }
        }
    };

    ///**
    // * 校验流程属性
    // * @param flowData
    // * @returns {boolean}
    // */
    //FlowBiz.validateWorkFlowProp = function(flowData) {
    //    var _self = this;
    //    var isCheck = true;
    //    var workFlowPropCfg = _self.ValidateConfig.workFlowProp;
    //
    //    for(var i in workFlowPropCfg){
    //        isCheck = oui.validate4value(flowData[i]||"" ,{
    //            failMsg:workFlowPropCfg[i].des+'长度不能超过{{validateValue}}个字符' ,
    //            maxLength:workFlowPropCfg[i].maxLength,
    //            failMode:_self.ValidateConfig.failMode
    //        });
    //        if(!isCheck){
    //            return false;
    //        }
    //        isCheck = oui.validate4value(flowData[i]||"" ,{
    //            failMsg:workFlowPropCfg[i].des+'不能为空' ,
    //            require:workFlowPropCfg[i].require ||false,
    //            failMode:_self.ValidateConfig.failMode
    //        });
    //        if(!isCheck){
    //            return false;
    //        }
    //    }
    //    return true;
    //};
    /**
     * 校验workFlowNode节点数据
     */
    FlowBiz.validateWorkFlowNode = function(node){
        var _self = this;
        if((!node) || (!node.nodeDisplayName)){
            return true;
        }
        var isCheck = oui.validate4value( node.nodeDisplayName,{
            failMsg:'节点显示名称长度不能超过{{validateValue}}个字符' ,
            maxLength:_self.ValidateConfig.workFlowNode.nodeDisplayName.maxLength,
            failMode:_self.ValidateConfig.failMode
        });
        if(!isCheck){
            return false;
        }
        return true;
    };
    /** 角色类型枚举***/
    FlowBiz.RoleTypeEnum = {
        orgMgr:{
            value:"orgMgr",
            display:"单位管理员"
        },
        departmentMgr:{
            value:'departmentMgr',
            display:"部门管理员"
        },
        depLeader:{
            value:'depLeader',
            display:"部门主管"
        },
        formMgr:{
            value:'formMgr',
            display:"表单管理员"
        },
        surveyMgr:{
            value:'surveyMgr',
            display:"调查管理员"
        }
    };
    /*** 流程分支条件 值变量 ****/
    FlowBiz.roleVarFields = [FlowBiz.RoleTypeEnum.depLeader];
    /**** 流程分支条件的变量 **/

    FlowBiz.processVarFields =[
        {id:'relOrg_sender4Dept',title:'发起人所属部门',opt:'=,!=,in,notIn',controlType:'selectdept' },
        {id:'relOrg_sender4PartTimeDept',title:'发起人所属兼职部门',opt:'=,!=,in,notIn',controlType:'selectdept' },
        {id:'relOrg_sender4Role',title:'发起人角色',opt:'=,!=',controlType:'singleselect',showType:'',data:FlowBiz.roleVarFields },
        {id:'relOrg_preNode4Dept',title:'上节点所属部门',opt:'=,!=,in,notIn',controlType:'selectdept',showType:''},
        {id:'relOrg_preNode4PartTimeDept',title:'上节点所属兼职部门',opt:'=,!=,in,notIn',controlType:'selectdept',showType:''},
        {id:'relOrg_preNode4Role',title:'上节点角色',opt:'=,!=',controlType:'singleselect',showType:'',data:FlowBiz.roleVarFields}
    ];
    /**
     * 获取节点校验数 （排除了 分割节点 和聚合节点）
     * @param nodes
     * @returns {number}
     */
    FlowBiz.getNodesSize4validate = function(nodes){
        var count = 0;
        for(var i= 0,len=nodes.length;i<len;i++){
            var node = nodes[i];
            if(node.nodeType =='split'){
                continue;
            }
            if(node.nodeType =='join'){
                continue;
            }
            count++;
        }
        return count;
    };
    FlowBiz.validate = function(isValidateNodes){ // 流程数据校验
        var _self = this;
        var flowData = _self.getFlowData();
        //var isCheck = _self.validateWorkFlowProp(flowData);
        //if(!isCheck){
        //    return false;
        //}
        var isCheck = true;
        var nodeLen = flowData.workFlowNodeList.length;
        isCheck = oui.validate4value(nodeLen,{
            failMsg:'流程节点数不能大于{{validateValue}}' ,
            maxValue:_self.ValidateConfig.workFlowNodeListMaxSize,
            failMode:_self.ValidateConfig.failMode
        });
        if(!isCheck){
            return false;
        }
        if(!isValidateNodes){//如果无需校验节点中的属性则直接返回
            return true;
        }
        var len = flowData.workFlowNodeList.length;
        var workFlowNodeList = flowData.workFlowNodeList;
        for(var i= 0;i<len;i++){ //循环校验每个节点数据
            isCheck = _self.validateWorkFlowNode(workFlowNodeList[i]);
            if(!isCheck){
                return false;
            }
        }
        return true;
    };
})();
;
/**
 * FlowUi 创建
 */
(function () {
    var FlowBiz = null;


    var FlowUi = {
        "package": "oui.flow",
        "class": "FlowUi",
        prefix: "flow",
        tpls: {
            //"flow-tpl-item": "",
            "flow-tpl-viewType": "",
            "flow-tpl-bottomButtons": ""
        },
        setBiz: function (biz) {
            FlowBiz = biz;
        },
        getBiz: function () {
            return FlowBiz;
        },
        render: function (id, notUpdateEl) {
            if (!this.tpls) {
                this.tpls = {};
            }
            if (typeof id == "undefined") {
                var tpls = this.tpls
                for (var i in tpls) {
                    this.render(i);
                }
                return;
            }
            if (!id) {
                return;
            }
            if (id.indexOf(this.prefix + "-ui-") >= 0) {
                id = this.prefix + "-tpl-" + (id.replace(this.prefix + "-ui-", ""));
            }

            if (typeof this.tpls[id] == "" || !(this.tpls[id])) {

                this.tpls[id] = template.compile(document.getElementById(id).innerHTML);
                //console.log(this.tpls[id]);
            }
            var key = id.replace(this.prefix + "-tpl-", "");

            var html = this.tpls[id](this.getData.call({Events: FlowBiz.Events, FlowBiz: FlowBiz}, key));

            if (typeof notUpdateEl != 'undefined' && notUpdateEl == true) {
                return html;
            }
            var uiId = id.replace('-tpl-', '-ui-');
            //console.log(html);
            document.getElementById(uiId).outerHTML = html;
        },

        getData: function (key) {
            var FlowBiz = this.FlowBiz;
            if (!FlowBiz[key]) {
                return this;
            }
            this[key] = FlowBiz[key];
            return this[key];
        }
    };
    FlowUi = oui.createClass(FlowUi);
    FlowUi.themes = []; //样式皮肤配置
    FlowUi.config = {
        editable: true,
        lineHeight: 10, //15
        basePath: '',
        rect: {// 状态
            attr: {
                x: 10,
                y: 10,
                width: 100,
                height: 50,
                r: 3,
                fill: '#5990cf',
                stroke: '',
                "stroke-width": 1
            },
            showType: 'image&text',// image,text,image&text
            type: 'state',
            name: {
                text: 'state',
                'font-style': 'normal'
            },
            text: {
                text: '状态',
                fill: '#ffffff',
                'font-size': 13
            },
            margin: 5,
            props: [],
            img: {}
        },
        path: {// 路径转换
            attr: {
                path: {
                    path: 'M10 10L100 100',
                    stroke: '#5990cf',
                    fill: "none",
                    "stroke-width": 1
                },
                arrow: {
                    path: 'M10 10L10 10',
                    stroke: '#5990cf',
                    fill: "#5990cf",
                    "stroke-width": 1,
                    radius: 4
                },
                fromDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 1
                },
                toDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 1
                },
                bigDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                smallDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                text: {
                    cursor: "move",
                    'background': '#000'
                }
            },
            text: {
                patten: 'TO {to}',
                textPos: {
                    x: 0,
                    y: -10
                }
            },
            props: {
                text: {
                    name: 'text',
                    label: '显示',
                    value: '',
                    editor: function () {
                        return new FlowUi.editors.textEditor();
                    }
                }
            }
        },
        tools: {// 工具栏
            attr: {
                left: 10,
                top: 10
            },
            pointer: {},
            path: {},
            states: {},
            save: {
                onclick: function (data) {
                    alert(data);
                }
            }
        },
        props: {// 属性编辑器
            attr: {
                top: 10,
                right: 30
            },
            props: {}
        },
        restore: '',
        activeRects: {// 当前激活状态
            rects: [],
            rectAttr: {
                stroke: '#ff0000',
                "stroke-width": 2
            }
        },
        historyRects: {// 历史激活状态
            rects: [],
            pathAttr: {
                path: {
                    stroke: '#00ff00'
                },
                arrow: {
                    stroke: '#00ff00',
                    fill: "#00ff00"
                }
            }
        }
    };

    FlowUi.util = {
        isLine: function (p1, p2, p3) {// 三个点是否在一条直线上
            var s, p2y;
            if ((p1.x - p3.x) == 0)
                s = 1;
            else
                s = (p1.y - p3.y) / (p1.x - p3.x);
            p2y = (p2.x - p3.x) * s + p3.y;
            // $('body').append(p2.y+'-'+p2y+'='+(p2.y-p2y)+', ');
            if ((p2.y - p2y) < 10 && (p2.y - p2y) > -10) {
                p2.y = p2y;
                return true;
            }
            return false;
        },
        center: function (p1, p2) {// 两个点的中间点
            return {
                x: (p1.x - p2.x) / 2 + p2.x,
                y: (p1.y - p2.y) / 2 + p2.y
            };
        },
        nextId: (function () {
            var uid = 0;
            return function () {
                return ++uid;
            };
        })(),

        connPoint: function (rect, p) {// 计算矩形中心到p的连线与矩形的交叉点
            var start = p, end = {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2
            };
            // 计算正切角度
            var tag = (end.y - start.y) / (end.x - start.x);
            tag = isNaN(tag) ? 0 : tag;

            var rectTag = rect.height / rect.width;
            // 计算箭头位置
            var xFlag = start.y < end.y ? -1 : 1, yFlag = start.x < end.x
                ? -1
                : 1, arrowTop, arrowLeft;
            // 按角度判断箭头位置
            if (Math.abs(tag) > rectTag && xFlag == -1) {// top边
                arrowTop = end.y - rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) > rectTag && xFlag == 1) {// bottom边
                arrowTop = end.y + rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) < rectTag && yFlag == -1) {// left边
                arrowTop = end.y + yFlag * rect.width / 2 * tag;
                arrowLeft = end.x - rect.width / 2;
            } else if (Math.abs(tag) < rectTag && yFlag == 1) {// right边
                arrowTop = end.y + rect.width / 2 * tag;
                arrowLeft = end.x + rect.width / 2;
            }
            return {
                x: arrowLeft,
                y: arrowTop
            };
        },

        arrow: function (p1, p2, r) {// 画箭头，p1 开始位置,p2 结束位置, r前头的边长
            var atan = Math.atan2(p1.y - p2.y, p2.x - p1.x) * (180 / Math.PI);

            var centerX = p2.x - r * Math.cos(atan * (Math.PI / 180));
            var centerY = p2.y + r * Math.sin(atan * (Math.PI / 180));

            var x2 = centerX + r * Math.cos((atan + 120) * (Math.PI / 180));
            var y2 = centerY - r * Math.sin((atan + 120) * (Math.PI / 180));

            var x3 = centerX + r * Math.cos((atan + 240) * (Math.PI / 180));
            var y3 = centerY - r * Math.sin((atan + 240) * (Math.PI / 180));
            return [p2, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            }];
        }
    }

    /**流程节点画图 ***/
    FlowUi.rect = function (o, r) {

        var FlowUi = oui.flow.FlowUi;
        var FlowBiz = FlowUi.getBiz();
        var WorkFlowNodeState = FlowBiz.WorkFlowNodeState;
        var _this = this, _uid = FlowUi.util.nextId(), _o = $.extend(true, {}, FlowUi.config.rect, o), _id = 'rect' + _uid, _r = r, // Raphael画笔
            _rect, _img, _statusImg, _commentsImg,hastenWorkImg,notifyImg,splitImg,joinImg, // 图标
            _name, // 状态名称
            _text, // 显示文本
            circle_rect,//中间显示的头像
            _rect_text,// 文本的矩形
            _ox, _oy; // 拖动时，保存起点位置;
        //_o.text.text += _uid;
        var nodeMap = FlowBiz.nodeIdMap;
        var currNode = nodeMap[_o.id];
        var isEndNode = currNode&&currNode.nodeType&&(currNode.nodeType=='end');

        //_rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
        //    _o.attr.r).attr(_o.attr).attr({'fill': 'transparent'}); //透明色
        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
            _o.attr.r).attr(_o.attr).attr({'fill': '#ffffff'});
        var nodeWidth = FlowUi.getBiz().nodeWidth;
        if (_o.attr.width == nodeWidth) { //普通节点
            //if(FlowBiz.isVertical){
            //    circle_rect = _r.rect(_o.attr.x + (nodeWidth - 48) / 2, _o.attr.y, 48, 48, _o.attr.r).attr(_o.attr).attr({
            //        x: _o.attr.x + (nodeWidth - 48) / 2,
            //        y: _o.attr.y+FlowBiz.nodeSplitWidth/2,
            //        width: 48,
            //        height: 48
            //    });
            //}else{
            //
            //}
            circle_rect = _r.rect(_o.attr.x + (nodeWidth - 48) / 2, _o.attr.y, 48, 48, _o.attr.r).attr(_o.attr).attr({
                x: _o.attr.x + (nodeWidth - 48) / 2,
                y: _o.attr.y,
                width: 48,
                height: 48
            });
        } else if (_o.attr.width == 1) {//split 节点
            circle_rect = _r.rect(_o.attr.x, _o.attr.y, 5, 5, _o.attr.r).attr(_o.attr).attr({
                x: _o.attr.x - 3,
                y: _o.attr.y - 3,
                width: 7,
                height: 7
            });
        } else if (_o.attr.width == 15) { //join节点
            _rect.attr('fill', _o.attr.fill);
            if(FlowBiz.isIndex || FlowBiz.isPreview) {
                //运行态或者 预览态不做处理
            }else{
                joinImg =  _r.image(FlowUi.config.basePath + _o.joinImg.src, _o.attr.x , _o.attr.y  , _o.joinImg.width, _o.joinImg.height);
            }

        }

        /**节点图标 ****/
        if (_o.img && _o.img.src) {
            _img = _r.image(FlowUi.config.basePath + _o.img.src,
                _o.attr.x + _o.attr.width / 2 - _o.img.width / 2,
                _o.attr.y + (_o.attr.height - _o.img.height) / 2 - 9, _o.img.width,
                _o.img.height);
        }
        /** 状态图标***/
        //_o.statusImg = {src:_o.img.src,width:16,height:16};// 根据节点 在运行期状态给定不同的图标,此处暂时定制,后续完善配置项 TODO 需完善状态图标
        if (_o.statusImg && _o.statusImg.src) {
            _statusImg = _r.image(FlowUi.config.basePath + _o.statusImg.src,
                _o.attr.x - _o.statusImg.width / 2 + _o.attr.width / 2 + _o.attr.width / (2 * Math.sqrt(2)) - 5,
                _o.attr.y - _o.statusImg.height / 2 + _o.attr.height / 2 + _o.attr.height / (2 * Math.sqrt(2)) - 18, _o.statusImg.width,
                _o.statusImg.height);
        }
        /**意见 图标 ***/
        if (_o._commentsImg && _o._commentsImg.src) {
            _commentsImg = _r.image(FlowUi.config.basePath + _o.commentsImg.src,
                _o.attr.x - _o.commentsImg.width / 2 + _o.attr.width / 2 + _o.attr.width / (2 * Math.sqrt(2)) - 5,
                _o.attr.y - _o.commentsImg.height / 2 + _o.attr.height / 2 + _o.attr.height / (2 * Math.sqrt(2)), _o.commentsImg.width,
                _o.commentsImg.height);
        }
        /**TODO测试  催办功能 **/
        //_o.hastenWorkImg ={
        //    width:38,
        //    height:17,
        //    src:'img/16/hasten_work.png'
        //};
        /***催办图标和按钮 *****/
        if(_o.hastenWorkImg&& _o.hastenWorkImg.src){
            hastenWorkImg = _r.image(FlowUi.config.basePath + _o.hastenWorkImg.src,
                _o.attr.x + _o.attr.width-10 ,
                _o.attr.y   , _o.hastenWorkImg.width,
                _o.hastenWorkImg.height);
        }
        /** 知会图标显示****/
        if(_o.notifyImg&&_o.notifyImg.src){
            notifyImg = _r.image(FlowUi.config.basePath + _o.notifyImg.src,
                _o.attr.x + _o.attr.width-10 ,
                _o.attr.y   , _o.notifyImg.width,
                _o.notifyImg.height);
        }
        /***splitImg节点图标 ***/
        if(_o.splitImg && _o.splitImg.src){

            var currHasBranch = FlowBiz.hasBranch(FlowBiz.nodeIdMap[_o.id]);
            var shouldSplitImg = true;
            /** 运行态或者 预览态,自由流程编辑态， 没有分支条件，不需要分支图标****/
            if(FlowBiz.isIndex || FlowBiz.isPreview || FlowBiz.design4Runtime) {
                if (!currHasBranch) {
                    shouldSplitImg = false;
                }
            }
            if(shouldSplitImg){
                if(FlowBiz.isVertical){
                    splitImg =  _r.image(FlowUi.config.basePath + _o.splitImg.src,
                        _o.attr.x+25 ,
                        _o.attr.y-20   , _o.splitImg.width,
                        _o.splitImg.height);
                }else{
                    splitImg =  _r.image(FlowUi.config.basePath + _o.splitImg.src,
                        _o.attr.x -15 ,
                        _o.attr.y+25   , _o.splitImg.width,
                        _o.splitImg.height);

                }
            }

        }
        /*
         * 文字显示在节点矩形内
         _text = _r.text(
         _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
         _o.attr.y + (_o.attr.height - FlowUi.config.lineHeight) / 2
         + FlowUi.config.lineHeight, _o.text.text)
         .attr(_o.text);// 文本
         */
        /*
         * 文字显示在圆形节点下方
         */
        //_rect_text = _r.rect(_o.attr.x,_o.attr.y+_o.attr.height, _o.attr.width, _o.attr.height/2).attr({fill: "#000" });
        //.rect(100, 100*i, 80, 80, 5).attr({fill: "#fff"});
        _text = _r.text(
            _o.attr.x + _o.attr.width / 2,
            _o.attr.y + _o.attr.height - 5, _o.text.text)
            .attr(_o.text);// 文本
        if (_o.text.text && (_o.text.text.length > 6)) {
            _text.attr({
                text: _o.text.text.substring(0, 6) + '...'
            });
        }
        if ((_text && _text.node) && (_o.text.text.length > 0) && (!oui.os.mobile)) {
            $(_text.node).attr({
                'oui-e-mouseenter': 'showTipsMsg4nodeDisplayName',
                'oui-e-mouseleave': 'hideTips4nodeDisplayName'
            });
        }
        if (_o.text.text == 'split' || _o.text.text == 'join' || _o.text.text == 'end') {
            _text.attr({text: ''});
        }
        // 改变大小的边框
        var _bw = 5, _bbox = {
            x: _o.attr.x - _o.margin,
            y: _o.attr.y - _o.margin,
            width: _o.attr.width + _o.margin * 2,
            height: _o.attr.height + _o.margin * 2
        };

        //$([_rect.node, _text.node, _name.node, _img.node]).attr('oui-e-mousedown','event2contextMenu');

        var eConfig = {};

        $([_rect.node, _text.node]).attr({
            class:isEndNode?'end':'',
            nodeId: _o.id
        });

        // 绑定pc右键和移动端轻点触摸事件
        $([_rect.node, _text.node]).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
        $([_rect.node, _text.node]).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
        if(joinImg&&joinImg.node){
            $(joinImg.node).attr({
                nodeId: _o.id,
                style:'cursor:pointer;'
            });
            $(joinImg.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(joinImg.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
            if(!oui.os.mobile){
                $(joinImg.node).attr('oui-e-mouseenter','event2mouseenterJoin');
                $(joinImg.node).attr('oui-e-mouseleave','event2leaveJoin');
            }
        }
        if (circle_rect && circle_rect.node) {
            $(circle_rect.node).attr({
                class:isEndNode?'end':'',
                nodeId: _o.id
            });
            $(circle_rect.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(circle_rect.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
        }
        /**节点图标事件绑定 ***/
        if (_img && _img.node) {
            $(_img.node).attr({
                'node-img-src':FlowUi.config.basePath + _o.img.src,
                'node-img-high-src':FlowUi.config.basePath + 'img/16/flow-edit.png?_t='+oui.loadStartTime,
                class:isEndNode?'end':'',
                nodeId: _o.id
            });
            $(_img.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(_img.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
            $(_img.node).attr('oui-e-mouseenter', 'event2showEditIcon');
            $(_img.node).attr('oui-e-mouseleave', 'event2hideEditIcon');
        }
        /**状态图标事件绑定 **/
        if (_statusImg && _statusImg.node) {
            $(_statusImg.node).attr({
                nodeId: _o.id
            });
            $(_statusImg.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(_statusImg.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
        }
        $([_text.node]).attr({
            nodeTextId: 'text-' + _o.id
        });
        /** 催办图标事件绑定*****/
        if(hastenWorkImg&&hastenWorkImg.node){
            $(hastenWorkImg.node).attr({
                nodeId: _o.id,
                style:'cursor:pointer;'
            });
            $(hastenWorkImg.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2HastenWork');
            $(hastenWorkImg.node).attr('oui-e-' + FlowBiz.Events.click, 'event2HastenWork');
        }
        /** splitImg split图标事件绑定****/
        if(splitImg&&splitImg.node){
            $(splitImg.node).attr({
                nodeId: _o.id,
                fromId:_o.splitImg.pid,
                toId:_o.id,
                style:(!FlowBiz.design4Runtime)?'cursor:pointer;':''
            });

            $(splitImg.node).attr('oui-e-'+FlowBiz.Events.click,'event2contextMenu');
            if(!oui.os.mobile){
                if(!FlowBiz.design4Runtime){
                    $(splitImg.node).attr('oui-e-mouseenter','event2mouseenterLine');
                    $(splitImg.node).attr('oui-e-mouseleave','event2leaveLine');
                }
            }
        }

        // 根据_bbox，更新位置信息
        function resize() {
            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                - _o.margin * 2, rh = _bbox.height - _o.margin * 2;

            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            switch (_o.showType) {
                case 'image' :
                    _img && _img.attr({
                        x: rx + (rw - _o.img.width) / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
                case 'text' :
                    _rect.show();
                    _text.attr({
                        x: rx + rw / 2,

                        y: ry + rh / 2
                    }).show();// 文本
                    break;
                case 'image&text' :
                    _rect.show();
                    /*
                     *_name.attr({
                     x : rx + _o.img.width + (rw - _o.img.width) / 2,
                     y : ry + FlowUi.config.lineHeight / 2
                     }).show();
                     */

                    _text.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + (rh - FlowUi.config.lineHeight) / 2
                        + FlowUi.config.lineHeight
                    }).show();// 文本
                    _img && _img.attr({
                        x: rx + _o.img.width / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
            }


            $(_r).trigger('rectresize', _this);
        };

        // 函数----------------
        // 转化json字串
        this.toJson = function () {
            var data = "{type:'" + _o.type + "',text:{text:'"
                + _text.attr('text') + "'}, attr:{ x:"
                + Math.round(_rect.attr('x')) + ", y:"
                + Math.round(_rect.attr('y')) + ", width:"
                + Math.round(_rect.attr('width')) + ", height:"
                + Math.round(_rect.attr('height')) + "}, props:{";
            for (var k in _o.props) {
                data += k + ":{value:'"
                    + _o.props[k].value + "'},";
            }
            if (data.substring(data.length - 1, data.length) == ',')
                data = data.substring(0, data.length - 1);
            data += "}}";
            return data;
        };
        // 从数据中恢复图
        this.restore = function (data) {
            var obj = data;
            // if (typeof data === 'string')
            // obj = eval(data);

            _o = $.extend(true, _o, data);

            _text.attr({
                text: obj.text.text
            });
            resize();
        };

        this.getBBox = function () {
            return _bbox;
        };
        this.getId = function () {
            return _id;
        };
        this.remove = function () {
            _rect.remove();
            _text.remove();
            _img && _img.remove();
            _statusImg && _statusImg.remove();
            _commentsImg && _commentsImg.remove();
            hastenWorkImg&&hastenWorkImg.remove();
            notifyImg&&notifyImg.remove();
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr)
                _rect.attr(attr);
        };

        //resize();// 初始化位置
    };

    FlowUi.path = function (o, r, from, to) {
        var workflowTreeNode= oui.flow.FlowBiz.workflowTreeNode ||{};
        var _this = this, _r = r, _o = $.extend(true, {}, FlowUi.config.path), _path, _arrow, _text, _textPos = _o.text.textPos, _ox, _oy, _from = from, _to = to, _id = 'path'
            + FlowUi.util.nextId(), _dotList;

        // 点
        function dot(type, pos, left, right) {
            var _this = this, _t = type, _n, _lt = left, _rt = right, _ox, _oy, // 缓存移动前时位置
                _pos = pos;// 缓存位置信息{x,y}, 注意：这是计算出中心点
            switch (_t) {
                case 'from' :

                    _n = _r.rect(pos.x - _o.attr.fromDot.width / 2,
                        pos.y - _o.attr.fromDot.height / 2,
                        _o.attr.fromDot.width, _o.attr.fromDot.height)
                        .attr(_o.attr.fromDot);
                    break;
                case 'big' :
                    _n = _r.rect(pos.x - _o.attr.bigDot.width / 2,
                        pos.y - _o.attr.bigDot.height / 2,
                        _o.attr.bigDot.width, _o.attr.bigDot.height)
                        .attr(_o.attr.bigDot);
                    break;
                case 'small' :
                    _n = _r.rect(pos.x - _o.attr.smallDot.width / 2,
                        pos.y - _o.attr.smallDot.height / 2,
                        _o.attr.smallDot.width, _o.attr.smallDot.height)
                        .attr(_o.attr.smallDot);
                    break;
                case 'to' :
                    _n = _r.rect(pos.x - _o.attr.toDot.width / 2,
                        pos.y - _o.attr.toDot.height / 2,
                        _o.attr.toDot.width, _o.attr.toDot.height)
                        .attr(_o.attr.toDot);

                    break;
            }
            $(_n.node).on(FlowBiz.Events.click, function () {
                return false;
            });

            this.type = function (t) {
                if (t)
                    _t = t;
                else
                    return _t;
            };
            this.node = function (n) {
                if (n)
                    _n = n;
                else
                    return _n;
            };
            this.left = function (l) {
                if (l)
                    _lt = l;
                else
                    return _lt;
            };
            this.right = function (r) {
                if (r)
                    _rt = r;
                else
                    return _rt;
            };
            this.remove = function () {
                _lt = null;
                _rt = null;
                _n.remove();
            };
            this.pos = function (pos) {

                if (pos) {
                    if (typeof pos.x == 'undefined') {
                        pos.x = _pos.x || 0;
                    }
                    if (typeof pos.y == 'undefined') {
                        pos.y = _pos.y || 0;
                    }
                    _pos = pos;
                    _n.attr({
                        x: _pos.x - _n.attr('width') / 2,
                        y: _pos.y - _n.attr('height') / 2
                    });
                    return this;
                } else {
                    return _pos
                }
            };

            this.moveTo = function (x, y) {
                this.pos({
                    x: x,
                    y: y
                });

                switch (_t) {
                    case 'from' :
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(FlowUi.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(FlowUi.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        break;
                    case 'big' :

                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(FlowUi.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(FlowUi.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(FlowUi.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(FlowUi.util.center(_pos, _lt.left().pos()));
                        }
                        // 三个大点在一条线上，移除中间的小点
                        var pos = {
                            x: _pos.x,
                            y: _pos.y
                        };
                        if (FlowUi.util.isLine(_lt.left().pos(), pos, _rt
                                .right().pos())) {
                            _t = 'small';
                            _n.attr(_o.attr.smallDot);
                            this.pos(pos);
                            var lt = _lt;
                            _lt.left().right(_lt.right());
                            _lt = _lt.left();
                            lt.remove();
                            var rt = _rt;
                            _rt.right().left(_rt.left());
                            _rt = _rt.right();
                            rt.remove();
                            // $('body').append('ok.');
                        }
                        break;
                    case 'small' :// 移动小点时，转变为大点，增加俩个小点
                        if (_lt && _rt && !FlowUi.util.isLine(_lt.pos(), {
                                x: _pos.x,
                                y: _pos.y
                            }, _rt.pos())) {

                            _t = 'big';

                            _n.attr(_o.attr.bigDot);
                            var lt = new dot('small', FlowUi.util.center(_lt
                                .pos(), _pos), _lt, _lt
                                .right());
                            _lt.right(lt);
                            _lt = lt;

                            var rt = new dot('small', FlowUi.util.center(_rt
                                    .pos(), _pos), _rt.left(),
                                _rt);
                            _rt.left(rt);
                            _rt = rt;

                        }
                        break;
                    case 'to' :
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(FlowUi.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(FlowUi.util.center(_pos, _lt.left().pos()));
                        }
                        break;
                }

                refreshpath();
            };
        }

        function dotList() {
            // if(!_from) throw '没有from节点!';
            var _fromDot, _toDot, _fromBB = _from.getBBox(), _toBB = _to
                .getBBox(), _fromPos, _toPos;

            _fromPos = FlowUi.util.connPoint(_fromBB, {
                x: _toBB.x + _toBB.width / 2,
                y: _toBB.y + _toBB.height / 2
            });
            _toPos = FlowUi.util.connPoint(_toBB, _fromPos);

            _fromDot = new dot('from', _fromPos, null, new dot('small', {
                x: (_fromPos.x + _toPos.x) / 2,
                y: (_fromPos.y + _toPos.y) / 2
            }));
            _fromDot.right().left(_fromDot);
            _toDot = new dot('to', _toPos, _fromDot.right(), null);
            _fromDot.right().right(_toDot);

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = 'M' + d.pos().x + ' ' + d.pos().y, arr = '';
                if (typeof d.pos() == 'undefined' || typeof d.pos().x == 'undefined') {
                    return '';
                }
                if (typeof d.pos() == 'undefined' || typeof d.pos().y == 'undefined') {
                    return '';
                }
                // 线的路径
                while (d.right()) {
                    d = d.right();
                    if (typeof d.pos() == 'undefined' || typeof d.pos().x == 'undefined') {
                        continue;
                    }
                    if (typeof d.pos() == 'undefined' || typeof d.pos().y == 'undefined') {
                        continue;
                    }
                    p += 'L' + d.pos().x + ' ' + d.pos().y;
                }
                // 箭头路径
                var arrPos = FlowUi.util.arrow(d.left().pos(), d.pos(),
                    _o.attr.arrow.radius);

                arr = 'M' + arrPos[0].x + ' ' + arrPos[0].y + 'L' + arrPos[1].x
                    + ' ' + arrPos[1].y + 'L' + arrPos[2].x + ' '
                    + arrPos[2].y + 'z';
                return [p, arr];
            };
            this.toJson = function () {
                var data = "[", d = _fromDot;

                while (d) {
                    if (d.type() == 'big')
                        data += "{x:" + Math.round(d.pos().x) + ",y:"
                            + Math.round(d.pos().y) + "},";
                    d = d.right();
                }
                if (data.substring(data.length - 1, data.length) == ',')
                    data = data.substring(0, data.length - 1);
                data += "]";
                return data;
            };
            this.restore = function (data) {
                //console.log(data);
                var obj = data, d = _fromDot.right();

                for (var i = 0; i < obj.length; i++) {
                    d.moveTo(obj[i].x, obj[i].y);
                    d.moveTo(obj[i].x, obj[i].y);
                    d = d.right();
                }
                this.hide();
            };

            this.fromDot = function () {
                return _fromDot;
            };
            this.toDot = function () {
                return _toDot;
            };
            this.midDot = function () {// 返回中间点
                var mid = _fromDot.right(), end = _fromDot.right().right();
                while (end.right() && end.right().right()) {
                    end = end.right().right();
                    mid = mid.right();
                }
                return mid;
            };
            this.show = function () {
                var d = _fromDot;
                while (d) {
                    d.node().show();
                    d = d.right();
                }
            };
            this.hide = function () {
                var d = _fromDot;
                while (d) {
                    d.node().hide();
                    d = d.right();
                }
            };
            this.remove = function () {
                var d = _fromDot;
                while (d) {
                    if (d.right()) {
                        d = d.right();
                        d.left().remove();
                    } else {
                        d.remove();
                        d = null;
                    }
                }
            };
        }

        // 初始化操作
        _o = $.extend(true, _o, o);

        _dotList = new dotList();
        var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
        _o.attr.path.path = p[0];
        _o.attr.arrow.path = p[1];
        _path = _r.path(p[0]).attr(_o.attr.path);
        // 线条事件绑定 线条样式 TODO
        if(_path){
            if(o&& o.from&& o.to){
                if(workflowTreeNode &&workflowTreeNode.states &&workflowTreeNode.states[o.from]&&workflowTreeNode.states[o.to]){
                    $(_path.node).attr('fromId',workflowTreeNode.states[o.from].id);
                    $(_path.node).attr('toId',  workflowTreeNode.states[o.to].id);
                    $(_path.node).attr('oui-e-'+FlowBiz.Events.click,'event2contextMenu');
                    if(!oui.os.mobile){
                        $(_path.node).attr('oui-e-mouseenter','event2mouseenterLine');
                        $(_path.node).attr('oui-e-mouseleave','event2leaveLine');

                    }
                    var currHasBranch = FlowBiz.hasBranch(FlowBiz.nodeIdMap[workflowTreeNode.states[o.to].id]);
                    if(currHasBranch){
                        /** 如果存在分支条件则 需要将线条画成虚线****/
                        FlowBiz.renderBranchLine(_path.node);
                    }
                    if(FlowBiz.nodeIdMap[workflowTreeNode.states[o.from].id].isSplit){
                        /*** 运行态非分支则 线条不能变粗 ***/
                        if(FlowBiz.isIndex || FlowBiz.isPreview){
                            if(!currHasBranch){
                                $(_path.node).attr('oui-e-'+FlowBiz.Events.click,'');
                                $(_path.node).attr('oui-e-mouseenter','');
                                $(_path.node).attr('oui-e-mouseleave','');
                                /****运行态非分支条件无需变粗 ****/
                                $(_path.node).attr('stroke-width','1');
                                $(_path.node).css('stroke-width','1');
                            }
                        }else{
                            /** 设计态分支线条都要变粗****/
                            $(_path.node).attr('stroke-width','3');
                            $(_path.node).css('stroke-width','3');
                        }
                    }else if(currHasBranch && FlowBiz.isIndex){
                        /*** 当前节点存在分支，并且父节点不是分支，并且在运行态 ******/
                    }else{
                        $(_path.node).attr('oui-e-mouseenter','');
                        $(_path.node).attr('oui-e-mouseleave','');
                        $(_path.node).attr('oui-e-'+FlowBiz.Events.click,'');
                    }
                }
            }
            _path.toBack();
        }
        //_arrow = _r.path(p[1]).attr(_o.attr.arrow); //不显示箭头

        // 函数-------------------------------------------------
        this.from = function () {
            return _from;
        };
        this.to = function () {
            return _to;
        };
        // 恢复
        this.restore = function (data) {
            var obj = data;
            _o = $.extend(true, _o, data);

            _dotList.restore(obj.dots);
        };
        // 删除
        this.remove = function () {
            _dotList.remove();
            _path.remove();
            _arrow && _arrow.remove();
            //_text.remove();

        };
        // 刷新路径
        function refreshpath() {
            var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
            if (p) {
                _path.attr({
                    path: p[0]
                });
                _arrow && _arrow.attr({
                    path: p[1]
                });
            }

            // $('body').append('refresh.');
        }

        this.getId = function () {
            return _id;
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr && attr.path)
                _path.attr(attr.path);
            if (attr && attr.arrow)
                _arrow.attr(attr.arrow);
            // $('body').append('aaaaaa');
        };

    };

    FlowUi.props = function (o, r) {

    };

    // 属性编辑器
    FlowUi.editors = {
        textEditor: function () {
        }
    };
    FlowUi.RaphaelObj = null;
    // 初始化流程
    FlowUi.init = function (c, o) {
        var _r;
        var _w = $(window).width(), _h = $(window).height(), _states = {}, _paths = {};
        if (FlowUi.RaphaelObj) {
            FlowUi.RaphaelObj.clear();
            FlowUi.RaphaelObj = null;
        }
        _r = Raphael(c, o.width, o.height);
        FlowUi.RaphaelObj = _r;
        $.extend(true, FlowUi.config, o);
        /**
         * 删除： 删除状态时，触发removerect事件，连接在这个状态上当路径监听到这个事件，触发removepath删除自身；
         * 删除路径时，触发removepath事件
         */
            // 模式
        $(_r).data('mod', 'point');
        // 恢复
        if (o.restore) {
            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
            // o.restore);
            var data = o.restore;
            var rmap = {};
            if (data.states) {
                var trect = new Date();
                for (var k in data.states) {
                    var t1 = new Date();
                    var extObj = $
                        .extend(
                        true,
                        {},
                        FlowUi.config.tools.states[data.states[k].type],
                        data.states[k]);

                    var rect = new FlowUi.rect(
                        extObj, _r);
                    var t2 = new Date();
                    //console.log('createrect:'+(t2-t1));

                    //rect.restore(data.states[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                    var t2 = new Date();
                    //console.log(t2-t1);

                }
                var trect2 = new Date();
                //console.log('recttime:'+(trect2-trect));
                //alert('recttime:'+(trect2-trect));
            }
            if (data.paths) {
                var tp = new Date();
                for (var k in data.paths) {
                    var pathObj = $.extend(true, {},
                        FlowUi.config.tools.path, data.paths[k]);
                    var p = new FlowUi.path(pathObj,
                        _r, rmap[data.paths[k].from],
                        rmap[data.paths[k].to]);
                    p.restore(data.paths[k]);
                    //_paths[p.getId()] = p;
                }
                var tp2 = new Date();
                //console.log('pathtime:'+(tp2-tp));
                //alert('pathtime:'+(tp2-tp));
            }
        }
        // 历史状态
        var hr = FlowUi.config.historyRects, ar = FlowUi.config.activeRects;
        if (hr.rects.length || ar.rects.length) {
            var pmap = {}, rmap = {};
            for (var pid in _paths) {// 先组织MAP
                if (!rmap[_paths[pid].from().text()]) {
                    rmap[_paths[pid].from().text()] = {
                        rect: _paths[pid].from(),
                        paths: {}
                    };
                }
                rmap[_paths[pid].from().text()].paths[_paths[pid].text()] = _paths[pid];
                if (!rmap[_paths[pid].to().text()]) {
                    rmap[_paths[pid].to().text()] = {
                        rect: _paths[pid].to(),
                        paths: {}
                    };
                }
            }
            for (var i = 0; i < hr.rects.length; i++) {
                if (rmap[hr.rects[i].name]) {
                    rmap[hr.rects[i].name].rect.attr(hr.rectAttr);
                }
                for (var j = 0; j < hr.rects[i].paths.length; j++) {
                    if (rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]) {
                        rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]
                            .attr(hr.pathAttr);
                    }
                }
            }
            for (var i = 0; i < ar.rects.length; i++) {
                if (rmap[ar.rects[i].name]) {
                    rmap[ar.rects[i].name].rect.attr(ar.rectAttr);
                }
                for (var j = 0; j < ar.rects[i].paths.length; j++) {
                    if (rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]) {
                        rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]
                            .attr(ar.pathAttr);
                    }
                }
            }
        }
    };

    // 添加jquery方法
    $.fn.FlowUi = function (o) {

        return this.each(function () {
            FlowUi.init(this, o);
        });
    };

    $.FlowUi = FlowUi;
})();;
(function($) {
	var FlowUi = $.FlowUi;
	if(!oui.loadStartTime){
		oui.loadStartTime = new Date().getTime();
	}
	$.extend(true, FlowUi.config.tools.states, {
		start: {
			attr:{
				fill : '#73ae42',
				stroke : '',
				r:20
			},
			type: 'start',
			name: {
				text: '<<start>>'
			},
			text: {
				text: '开始'
			},
			img: {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		end:{
			attr:{
				fill : '#b7b7b7',
				stroke : '',
				r:40
			},
			type: 'end',
			name: {
				text: ''
			},
			text: {
				//text: 'end',
				fill:'#333'
			},
			img: {
				src: 'img/16/end.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		role:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'role',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/role.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		team:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'team',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/team.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		post:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'post',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/post.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		department:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'department',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		all:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'all',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		company:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'company',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		} ,
		group:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'group',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/department.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		} ,
		level:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'level',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/role.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		} ,
		relativeRole:{
			attr:{
				fill : '#5990cf',
				stroke : '',
				r:40
			},
			type: 'relativeRole',
			//name: {
			//	text: ''
			//},
			img: {
				src: 'img/16/relative-role.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		'end-cancel': {
			type: 'end-cancel',
			name: {
				text: '<<end-cancel>>'
			},
			text: {
				text: '取消'
			},
			img: {
				src: 'img/16/end_event_cancel.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		'end-error': {
			type: 'end-error',
			name: {
				text: '<<end-error>>'
			},
			text: {
				text: '错误'
			},
			img: {
				src: 'img/16/end_event_error.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		state: {
			type: 'state',
			name: {
				text: '<<state>>'
			},
			text: {
				text: ''
			},
			img: {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		fork: {
			type: 'fork',
			name: {
				text: '<<fork>>'
			},
			text: {
				text: '分支'
			},
			img: {
				src: 'img/16/gateway_parallel.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			} 
		},
		join: {
			type: 'join',
			name: {
				text: '<<join>>'
			},
			text: {
				text: '合并'
			},img:{}
		},
		task: {
			type: 'task',
			name: {
				text:''
				//text: '<<task>>'
			},
			text: {
				text: '任务'
			},
			img: {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			} 
		},
		decision: {
			type: 'decision',
			name: {
				text: '<<decision>>'
			},
			text: {
				text: '决定'
			},
			img: {
				src: 'img/16/gateway_parallel.png?_t='+oui.loadStartTime,
				width: 32,
				height: 32
			}
		}
	});
	/**
	 * ----------------------------------------------------------------------------
	 流程皮肤样式配置
	 ------------------------------------------------------------------------------
	 */
	
	/**
	 * 显示样式配置
	 */
	FlowUi.themes[1] = { //有底色样式
		tools:{
			states:{

				start: {
					attr:{
						fill : '#73ae42',
						stroke : '',
						r:40
					},
					type: 'start',
					name: {
						text: '<<start>>'
					},
					text: {
						text: '开始',
						fill:'#333'
					},
					img: {
						src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				end:{
					attr:{
						fill : '#b7b7b7',
						stroke : '',
						r:40
					},
					type: 'end',
					name: {
						text: ''
					},
					text: {
						//text: 'end',
						fill:'#333'
					},
					img: {
						src: 'img/16/end.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				split: {
					attr:{
						fill : '#B7B7B7',
						//stroke : '#5990cf',
						//"stroke-width" : 1 ,
						r:10	,
						width:1,
						height:1
					},
					type: 'split',
					name: {
						text: ''
					},
					text: {
						text: '',
						fill:'#5990cf'
					},
					img:{
					}
				},
				join: {
					attr:{
						fill : '#B7B7B7',
						'fill-opacity':1,
						//stroke : '#5990cf',
						"stroke-width" : 1,
						r:20,
						width:15,
						height:15
					},
					type: 'join',
					name: {
						text: ''
					},
					text: {
						text: '',
						fill:'#ffffff'
					},
					img:{
					}
				},
				task: {
					type: 'task',
					name: {
						text:''
						//text: '<<task>>'
					},
					text: {
						text: '任务'
					},
					img: {
						src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				role:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'role',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/role.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				team:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'team',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/team.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				department:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'department',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				post:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'post',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/post.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				all:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'all',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				company:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'company',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				} ,
				group:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'group',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/department.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				} ,
				level:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'level',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/role.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				} ,
				relativeRole:{
					attr:{
						fill : '#5990cf',
						stroke : '',
						r:40
					},
					type: 'relativeRole',
					//name: {
					//	text: ''
					//},
					img: {
						src: 'img/16/relative-role.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				}
			}
		},
		rect : {// 状态
			attr : {
				x : 10,
				y : 10,
				width : 100,
				height : 50,
				r : 40,
				fill : '#5990cf',
				stroke : '',
				"stroke-width" : 1
			},
			showType : 'image&text',// image,text,image&text
			type : 'state',
			name : {
				text : 'state',
				'font-style' : 'normal'
			},
			text : {
				text : '',
				fill:'#000000',
				//'z-index':2,
				'font-size' : 13
			},
			margin : 5,
			props : [],
			img : { }
		},
		path : {// 路径转换
			attr : {
				path : {
					path : 'M10 10L100 100',
					stroke : '#B7B7B7',
					fill : "none", 
					"stroke-width" : 1
				},
				arrow : {
					path : 'M10 10L10 10',
					stroke : '#5990cf',
					fill : "#5990cf",
					"stroke-width" : 1,
					radius : 4
				},
				fromDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				toDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				bigDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				smallDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				text : {
				    cursor : "move",
                    'background' : '#000'
				}
			},
			text : {
				patten : 'TO {to}',
				textPos : {
                    x : 0,
                    y : -10
                }
			},
			props : {
				text : {
					name : 'text',
					label : '显示',
					value : '',
					editor : function() {
						return new FlowUi.editors.textEditor();
					}
				}
			}
		}
	};
	/**
	 * 无底色皮肤
	 */
	FlowUi.themes[2] = {
		tools:{
			states:{
				start: {
					attr:{
						fill : '#f8f8f8',
						stroke : '#929292',
						r:0
					},
					type: 'start',
					name: {
						text: '<<start>>'
					},
					text: {
						text: '开始',
						fill:'#1eb222'
					},
					img: {
						src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				},
				task: {
					type: 'task',
					name: {
						text:''
						//text: '<<task>>'
					},
					text: {
						text: '任务'
					},
					img: {
						src: 'img/16/task_empty_b.png?_t='+oui.loadStartTime,
						width: 30,
						height: 30
					}
				}
			}
		},
		rect : {// 状态
			attr : {
				x : 10,
				y : 10,
				width : 100,
				height : 50,
				r : 0,
				fill : '#f8f8f8',
				stroke : '#929292',
				"stroke-width" : 1
			},
			showType : 'image&text',// image,text,image&text
			type : 'state',
			name : {
				text : 'state',
				'font-style' : 'normal'
			},
			text : {
				text : '',
				fill:'#5990cf',
				'font-size' : 13
			},
			margin : 5,
			props : [],
			img : {
				src: 'img/16/task_empty.png?_t='+oui.loadStartTime,
				width: 30,
				height: 30
			}
		},
		path : {// 路径转换
			attr : {
				path : {
					path : 'M10 10L100 100',
					stroke : '#686868',
					fill : "none",
					"stroke-width" : 1
				},
				arrow : {
					path : 'M10 10L10 10',
					stroke : '#959595',
					fill : "#959595",
					"stroke-width" : 1,
					radius : 4
				},
				fromDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				toDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				bigDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				smallDot : {
					width : 5,
					height : 5,
					stroke : '#fff',
					fill : '#000',
					cursor : "move",
					"stroke-width" : 1
				},
				text : {
				    cursor : "move",
                    'background' : '#000'
				}
			},
			text : {
				patten : 'TO {to}',
				textPos : {
                    x : 0,
                    y : -10
                }
			},
			props : {
				text : {
					name : 'text',
					label : '显示',
					value : '',
					editor : function() {
						return new FlowUi.editors.textEditor();
					}
				}
			}
		}
	};
	
})(jQuery);;
/**
 * FlowBiz 创建
 */
(function (FlowUi) {
	
    var FlowBiz = {
        "package": "oui.flow",
        "class": "FlowBiz",
		/*
		 *获取FlowUi方法
		 */
		getFlowUi:function(){ //重写父类方法 用于获取 FlowUi类对象
			return FlowUi;
		},
		getFlowBiz:function(){//重写父类方法 用于获取FlowBiz类对象
			return FlowBiz;
		}, 
		getSuper:function(){ //父类
			return oui.flow.FlowCommon;
		},
		initStart:function(param){ //初始化开始接口实现
			var _self = this;
			try{
				var isTest = window.parent.oui.getParam('isTest');
				_self.isTest = isTest;
			}catch(e){

			}
			//FlowUi.config.basePath = oui.getContextPath()+'res_engine/workflow/';
			//_self.setInterceptFuns(_self.eventBefore2hideTipsOrActionSheetFunNames,function(cfg){
			//	//_self.hideTips(cfg);//所有这些事件操作执行tips隐藏
			//}); //设置 Before拦截
			_self.getSuper().initStart.call(_self,param); //父类的方法在子类执行
			
		},
		
		initEnd:function(){ //初始化结束接口实现
			var _self = this;
			_self.getSuper().initEnd.call(this); //初始化结束父类调用
			oui.Guide.trigger4custom("#ouiflow");
		},
		//init 在父类oui.flow.FlowCommon中已经实现 ,分别调用了 initStart 和initEnd以及初始化流程逻辑		
		//绑定事件接口实现
		bindEvents:function(){
			var _self = this;
			$('#ouiflow').draggable({
				//containment:'.flow-drag-area',
				//scroll:true,
				//containment: [50,50,'100%','100%'],
				start: function(event,ui) {
				},
				stop:function(event,ui){
					$(this).find("p").html(":-|");
				}
			});
			$(document).on('mousedown',function(e){
				_self.hideTips({e:e});
			})
			_self.bindBeforeUnload();
		},
		bindBeforeUnload: function () {
			var _self = this;
			if(_self.isIndex){//浏览态无需处理该逻辑
				return ;
			}
			window.onbeforeunload = function (e) {

				if (_self.hasSaveData()) {
					return;
				}
				if(!oui_context){ //没有上下文配置对象
					return ;
				}
				/**
				 * 没有userId表示没有登录 则不验证
				 */
				if(oui_context && (!oui_context.userId)){
					return ;
				}
				return (e || window.event).returnValue = '有信息未保存';
			}
		},
		/**
		 * 放大 覆盖父类方法
		 */
		event2ZoomBig:function(cfg){ //放大
			var _self = this;
			_self.zoomPx+=10;
			_self.zoomScale= (_self.mc_width+_self.zoomPx)/_self.mc_width;
			$(document.body).css('zoom',_self.zoomScale);
		},
		/**
		 * 缩小 覆盖父类方法
		 */
		event2ZoomSmall:function(cfg){ //缩小
			var _self = this; 
			_self.zoomPx-=10;
			_self.zoomScale= (_self.mc_width+_self.zoomPx)/_self.mc_width;
			if( _self.zoomScale<0.5){
				_self.zoomPx +=10; 
				_self.zoomScale= (_self.mc_width+_self.zoomPx)/_self.mc_width;
			}
			$(document.body).css('zoom',_self.zoomScale);
		},
		/**
		 * pc端 右键菜单功能 
		 */
		event2contextMenu:function(cfg){
			var _self = this;
			var tipCfg = _self.putContextMenu4event(cfg);
			var nodeIdMap =_self.nodeIdMap;
			var nodeId =tipCfg.nodeId;
			var FlowUi = _self.getFlowUi(); 
			var x,y;
			//var width = parseFloat($(tipCfg.el).attr('width'));
			//var height = parseFloat($(tipCfg.el).attr('height'));
			var workflowTreeNode = _self.workflowTreeNode;
			var rectNode = workflowTreeNode.states[nodeId];
			
			var attr = nodeIdMap[nodeId].attr;
			if(nodeIdMap[nodeId].isEnd){
				return ;
			}
			//var html = FlowUi.render('flow-ui-contextMenus',true);
			//$(tipCfg.el).after(html);
			_self.operNode4design = _self.contextMenus;
			$("#flow-ui-contextMenus")[0].innerHTML = tipCfg.content;
			x = attr.x;
			y = attr.y;
			var svgPos = $('#ouiflow').position();
			var left = x +svgPos.left - $("#flow-ui-contextMenus").width()/2;
			var top = y +svgPos.top ;
			/**线条 并且是允许态则 执行线条的位置定位 **/
			if(tipCfg.isLine && (_self.isIndex || _self.isPreview)){
				var e = cfg.e;
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				left = e.pageX || e.clientX + scrollX;
				top = e.pageY || e.clientY + scrollY;
				top+=8;
				left -=$("#flow-ui-contextMenus").width()/2;
			}else{
				/****线条和节点 在设计态都根据节点位置定位 ***/
				if( nodeIdMap[nodeId].isJoin){
					//top+=10;
					left-=8;
					top-=$("#flow-ui-contextMenus").height()/2;
					top+=7;
				}else{
					left = left+20;
					top = top-8;
				}
				left+=12;
				if(_self.isIndex){ //运行态流程 位置处理
					left+= $("#flow-ui-contextMenus").width()/2;
					left+=30;
					top+=40;
				}
			}

			$("#flow-ui-contextMenus").css({
				'position':'absolute',
				display:'',
				'left':left, 
				'top':top
			});

		},
		/**
		 * pc端 右键菜单功能 
		 */
		event2contextMenu_TEST:function(cfg){
			var _self = this;
			var tipCfg = _self.putContextMenu4event(cfg);
			var obj= oui.showTips({
				el:tipCfg.el, 
				content:tipCfg.content
			});
			
			var $tipEl = $(obj.getEl());
			 
			var nodeIdMap = oui.flow.FlowBiz.nodeIdMap;
			var nodeId = $(tipCfg.el).attr('nodeId');
			console.log($(tipCfg.el).attr('x'));
			console.log($(tipCfg.el).attr('y'));
			console.log($(tipCfg.el).attr('width'));
			console.log($(tipCfg.el).attr('height'));
			var x = parseFloat($(tipCfg.el).attr('x'));
			var y = parseFloat($(tipCfg.el).attr('y'));
			//var width = parseFloat($(tipCfg.el).attr('width'));
			//var height = parseFloat($(tipCfg.el).attr('height'));
			var workflowTreeNode = _self.workflowTreeNode;
			var rectNode = workflowTreeNode.states[nodeId];
			
			var attr = _self.nodeIdMap[nodeId].attr;
			
			x = attr.x;
			y = attr.y; 
			var left,top;
			
			if(oui.browser.ie){
				var offset = $('rect[nodeid='+nodeId+']').offset();
				//var offset = $(cfg.e.target).offset();
				left = cfg.e.pageX-$tipEl.width()/2;
				top = cfg.e.pageY+10 ;
				
				
			}else{
				left = x+_self.nodeWidth-_self.y_distance+$("svg").offset().left;
				top = y+_self.nodeHeight ; 
				top = top+$("#ouiflow").scrollTop()+_self.nodeHeight/2;
				top=top+55;
				
				 
				if(_self.nodeIdMap[nodeId].isJoin){
					left-=_self.nodeWidth/2
					left+=attr.width/2;
					top-=20;
				}
			}
				
			$tipEl.css({top:top+"px",left:left+"px"});
			//$tipEl.css('zoom',_self.zoomScale);
			//left:left+"px",
		}
	};
	
	//类继承实现 
	FlowBiz = $.extend(true,{},FlowBiz.getSuper(),FlowBiz);
	FlowBiz = oui.createClass(FlowBiz);
	FlowBiz.getPosByEl=function(oElement) {//oElement 当前元素
        if (typeof (oElement.offsetParent) != 'undefined') {
			for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
				posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
        }
		return {x:posX, y:posY};
    };
	/**
	 *  pc端隐藏 流程节点 操作tips
	 * @param cfg
	 */
	FlowBiz.hideContextMenu = function(cfg){
		var $menu =  $("#flow-ui-contextMenus") ;
		if($menu.length<=0){
			return ;
		}
		$menu.hide();
	};
	//pc特有
	FlowBiz.hideTips = function(cfg){ //该方法目前在元素中通过oui-e- 配置函数名使用
		var e =cfg.e;

	 	var $menu =  $("#flow-ui-contextMenus") ;
		if($menu.length<=0){
			return ;
		}
		if(oui.isInDom(e.target,$menu[0])){
			return ;
		}
		$menu.hide();
		//var tips = oui.getTips();
		//if(!tips){
		//	return ;
		//}
		//if(tips.attr('hidden')){
		//	return ;
		//}
		//if(oui.isInDom(e.target,tips.getEl())){ //判断目标元素是否在tips容器里面
		//	return ;
		//}
		//oui.hideTips();
	};
})(oui.flow.FlowUi);








