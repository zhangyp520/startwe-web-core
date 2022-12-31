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
			if(clz.prototype._priv[i]){
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





  (function (win,$) {
  /******
   * 控件的标签维护
   * @type {oui|{}}
   */
  var constant = oui.$.constant = {

    controlTagName: "oui-form",//我们表单控件标签名
    viewTagName:"oui-view", //页面模板框架
    reportTagName:"oui-report",//报表组件
    includeTagName: "oui-include",//我们的页面中的include标签
    tableTagName: "oui-table",//我们页面中的table标签
    pagerTagName: 'oui-pager', //分页标签
    conditionTagName: 'oui-condition',//查询条件标签
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
    var Parser = oui.$.Parser;
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
    /**pc 和 移动 都有的控件 */
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

    multiselect:{
      tag:constant.controlTagName,
      controlClass:'multiselect',
      fileName:'multi-select'
    },
    number:{
      tag:constant.controlTagName,
      controlClass:'number'
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
        var Parser = oui.$.Parser;
        Parser.parseInclude(el,callback);
      }
    },
    ouiview:{/** oui-veiw 自定义渲染区域****/
      tag:constant.viewTagName,
      controlClass:'ouiview',
      fileName:'oui-view',
      isCommon:true,//公共组件
      cssType:CssTypeEnum.noCss//没有样式
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
        var Parser = oui.$.Parser;
        Parser.parseByDom(el,$(el).attr('type'),callback);
      }//默认解析
    },
    report:{
      tag:constant.reportTagName,
      controlClass:'report',
      isCommon:true,//公共组件
      cssType:CssTypeEnum.common//公共样式
    }
  };

  var tags = [];
  var tagsWithType = [];
  var tagMap = {};
  !(function(){

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
  })();
  var tagCfg={
    defaultParse:defaultParse,
    defaultParse4childrenEnum:defaultParse4childrenEnum,
    defaultParseByDom:defaultParseByDom,
    CssTypeEnum:CssTypeEnum,
    FormControlEnum:FormControlEnum,
    TagEnum:TagEnum,
    tags:tags,
    tagsWithType:tagsWithType,
    tagMap:tagMap
  };
  oui.$.tagCfg = tagCfg;

})(window,$);





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






!(function(win,$){
  /**
   * 错误码配置

   */
  oui.errorCode={
    'go2login':'1001', //需要转到登陆页
    'go2reg':'1002'// 需要转到注册页
  };
  /**
   * 回到登陆页
   */
  oui.go2login=function(ret){
    if((typeof ret =='object')&&(!ret.success)  && ((ret.msg + "")==oui.errorCode.go2login)){
      oui.getTop().oui.confirmDialog('当前会话已经消失,回到首页登录',function(){
		  let loginType = oui.cookie('loginType');
		  if(loginType == 'admin'){
			  oui.cookie('loginType',"");
			  window.location.replace(oui.getContextPath()+'index4vue.html#res_startwe/html/admin.vue.html');
		  } else {
			  window.location.replace(oui.getContextPath()+'index4vue.html#res_startwe/html/login.vue.html');
		  }
      },function(){},{title:'登录超时'});
      return true;
    }
    return false;
  };
  /*** 数据类型枚举*****/
  oui.dataTypeEnum={
	  STRING:{
		  name:'STRING',
		  value:0,
		  showType:0,
		  opt:'=,!=,like,startWith,notStartWith,endWith,notEndWith,Null,NotNull,NullOrEmpty,NotNullAndEmpty',
		  assign:'=',
		  controlType:'textfield',
		  desc:'字符串'
	  },
	  NUMBER_INTEGER:{
		  name:'NUMBER_INTEGER',
		  value:1,
		  showType:0,
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  controlType:'number',
		  dotNum:0,
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  desc:'数字Integer'
	  },
	  NUMBER_LONG:{
		  name:'NUMBER_LONG',
		  value:2,
		  showType:0,
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  controlType:'number',
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  dotNum:0,
		  desc:'数字Long'
	  },
	  NUMBER_DOUBLE:{
		  name:'NUMBER_DOUBLE',
		  value:3,
		  showType:0,
		  dotNum:5,
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  controlType:'number',
		  desc:'数字DOUBLE'
	  },
	  BOOLEAN:{
		  name:'BOOLEAN',
		  opt:'=,!=,Null,NotNull',
		  showType:0,
		  controlType:'switch',
		  assign:'=,&=,|=',
		  value:4,
		  desc:'布尔'
	  },
	  DATE:{
		  name:'DATE',
		  controlType:'datepicker',
		  showType:0,//yMd
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  assign:'=',
		  value:5,
		  desc:'日期'
	  },
	  DATETIME:{//时间格式 yyyy-MM-dd HH:mm
		  name:'DATETIME',
		  controlType:'datepicker',
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  assign:'=',
		  showType:7,
		  value:6,
		  desc:'日期时间'
	  },
	  ARRAYS_INTEGER:{ // Integer数组
		  name:'ARRAYS_INTEGER',
		  value:7,
		  opt:'=,>,>=,<,<=,!=,in,notIn,between,notBetween,Null,NotNull',
		  assign:'=',
		  showType:0,
		  controlType:'number',
		  dotNum:0,
		  desc:'Integer数组'
	  },
	  ARRAYS_STRING:{
		  name:'ARRAYS_STRING',
		  value:8,
		  opt:'=,!=,like,in,notIn,startWith,notStartWith,endWith,notEndWith,Null,NotNull,NullOrEmpty,NotNullAndEmpty',
		  showType:0,
		  assign:'=',
		  controlType:'textfield',
		  desc:'字符串数组'
	  },
	  TIME:{//时间类型 格式：HH:mm
		  name:'TIME',
		  controlType:'timepicker',
		  showType:0,
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  assign:'=',
		  value:9,
		  desc:'时间'
	  },
	  ARRAYS_LONG:{// Long 数组
		  name:'ARRAYS_LONG',
		  controlType:'number',
		  showType:0,
		  opt:'=,>,>=,<,<=,!=,in,notIn,between,notBetween,Null,NotNull',
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  dotNum:0,
		  value:10,
		  desc:'Long数组'
	  },
	  TABLE:{ //表模型
		  name:'TABLE',
		  controlType:'outercontrol',
		  showType:0,
		  opt:'=,!=,Null,NotNull',
		  assign:'=',
		  dotNum:0,
		  value:11,
		  desc:'表模型'
	  },
	  TABLE_DATA:{//数据模型
		  name:'TABLE_DATA',
		  controlType:'outercontrol',
		  showType:0,
		  opt:'=,!=,Null,NotNull',
		  assign:'=',
		  dotNum:0,
		  value:12,
		  desc:'数据模型'
	  },
	  DATAMAP:{
		  name:'DATAMAP',
		  value:13,
		  showType:0,
		  opt:'=,!=,Null,NotNull',
		  assign:'=',
		  controlType:'outercontrol',
		  desc:'DataMap'

	  },
	  DATAMAP_LIST:{
		  name:'DATAMAP_LIST',
		  value:14,
		  showType:0,
		  opt:'=,!=,Null,NotNull',
		  assign:'=',
		  controlType:'outercontrol',
		  desc:'DataMapList'
	  },
	  NUMBER_DECIMAL:{
		  name:'NUMBER_DECIMAL',
		  value:15,
		  showType:0,
		  dotNum:5,
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  controlType:'number',
		  desc:'数字BigDecimal'
	  },
	  CHAR:{
		  name:'CHAR',
		  value:16,
		  showType:0,
		  opt:'=,!=,Null,NotNull,NullOrEmpty,NotNullAndEmpty',
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  controlType:'textfield',
		  desc:'Char'
	  },
	  NUMBER_FLOAT:{
		  name:'NUMBER_FLOAT',
		  value:17,
		  showType:0,
		  dotNum:5,
		  opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
		  assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
		  controlType:'number',
		  desc:'数字Float'
	  },

	  OBJECT:{
		  name:'OBJECT',
		  value:18,
		  showType:0,
		  opt:'=,!=,Null,NotNull',
		  assign:'=',
		  controlType:'editree',
		  desc:'Object'
	  },
	  TREE_NODE:{
		  name:'TREE_NODE',
		  value:19,
		  showType:0,
		  opt:'=,!=,Null,NotNull',
		  assign:'=',
		  controlType:'edittree',
		  desc:'TreeNode'
	  }
  };
  oui.fieldTypeEnum ={
    "int_type":{
      "name":"int_type",
      "desc":"int",
      "dataType":"NUMBER_INTEGER"
    },
    "double_type":{
      "name":"double_type",
      "desc":"double",
      "dataType":"NUMBER_DOUBLE"
    },
    "float_type":{
      "name":"float_type",
      "desc":"float",
      "dataType":"NUMBER_DOUBLE"
    },
    "long_type":{
      "name":"long_type",
      "desc":"long",
      "dataType":"NUMBER_LONG"
    },
    "short_type":{
      "name":"short_type",
      "desc":"short",
      "dataType":"NUMBER_INTEGER"
    },
    "byte_type":{
      "name":"byte_type",
      "desc":"byte",
      "dataType":"NUMBER_INTEGER"
    },
    "boolean_type":{
      "name":"boolean_type",
      "desc":"boolean",
      "dataType":"BOOLEAN"
    },
    "char_type":{
      "name":"char_type",
      "desc":"char",
      "dataType":"STRING"
    },
    "string_type":{
      "name":"string_type",
      "desc":"string",
      "dataType":"STRING"
    },
    "decimal_type":{
      "name":"decimal_type",
      "desc":"decimal",
      "dataType":"NUMBER_DECIMAL"
    },
    "date_type":{
      "name":"date_type",
      "desc":"date",
      "dataType":"DATE"
    },
    "datetime_type":{
      "name":"datetime_type",
      "desc":"datetime",
      "dataType":"DATETIME"
    },
    "time_type":{
      "name":"time_type",
      "desc":"time",
      "dataType":"TIME"
    },
    "table_type":{
      "name":"table_type",
      "desc":"实体",
      "dataType":"TABLE"
    },
    "tableData_type":{
      "name":"tableData_type",
      "desc":"实体列表",
      "dataType":"TABLE_DATA"
    },
  	"object_type":{
	  "name":"object_type",
	  "desc":"Object",
	  "dataType":"OBJECT"
  	},
  	"tree_node_type":{
	  "name":"tree_node_type",
	  "desc":"TreeNode",
	  "dataType":"TREE_NODE"
  	},
  	"upload_file_type":{
	  "name":"upload_file_type",
	  "desc":"附件",
	  "dataType":"UPLOAD_FILE"
  	}
  };

  /**
   * 发送短信验证码
   * @param phone
   * @param sendingReason
   */
  oui.sendPhoneCode = function(phone,owner,bizType){
    var url = oui_url.smsSendUrl||'';
    if(!url){
      throw  new Error('短信验证码发送路径不能为空');
    }
    /** 极验成功 后会设置 极验 验证码 到 ouiValidateCode,和对应手机号码  ouiValidatePhone***/
    var ouiValidateVerify = oui.getPageParam('ouiValidateVerify');
    var ouiValidatePhone = oui.getPageParam('ouiValidatePhone');
    /** 如果没有收到极验时的极验 验证码 则返回****/
    if(!ouiValidateVerify){
      oui.getTop().oui.alert("极验失败，不能发送短信验证码");
      return ;
    }
    /** 如果没有收到极验时用的 手机号码 则返回 ***/
    if((!ouiValidatePhone) || (ouiValidatePhone != phone)){
      oui.getTop().oui.alert("极验失败，不能发送短信验证码");
      return ;
    }
    if(!owner){
      throw new Error('发送短信验证码失败，owner不能为空');
    }
    if(!bizType){
      throw new Error('发送短信验证码失败，bizType不能为空');
    }
    var param = {
      phone:phone,
      ouiValidatePhone:ouiValidatePhone,
      owner:owner,
      bizType:bizType,
      verify_code:oui.parseString(ouiValidateVerify)
    };
    oui.getData(url,param ,function(res){
      if(res.success){ //成功发送验证码到手机

      }else{ //发送验证码失败
        oui.getTop().oui.alert(res.msg);
      }
    });
  };
  /**
   * 回到注册页
   */
  oui.go2reg=function(ret){
    if((typeof ret =='object')&&(!ret.success) && ((ret.msg + "")==oui.errorCode.go2reg)){
      oui.confirmDialog('您还未注册,进入注册页',function(){
        //积木云 JMY-893在线查看的预览和查看模版不可用
        //window.location.href = oui.getContextPath()+'login.do?method=reg';

        window.location.href = oui.getContextPath()+'index.html?method=reg';

      },function(){},{title:'温馨提示'});
      return true;
    }
    return false;
  };
  /**
   * 向服务器端请求数据
   * 第一个参数url 传入null调用统一控制器
   * 第二个参数params url后跟的参数
   * 第三个参数callback 回调函数(回调函数为null就是同步请求，并将服务器发来的数据作为返回值，同步申请也不需要滚动条
   * 给了回调函数的话，将它作为请求成功的回调函数，并将服务器返回的值作为回调函数的第一个参数)
   * 第四个参数progressBar 进度条（不给出表示使用默认进度条，null表示不需要进度条，ProgressBar对象表示需要自己控制进度条）
   */
  oui.getData = function(url,params,callback,progressBar,error){

    var options = {};
    if(typeof url =='object'){
      options = url;
      url = options.url;
      params = options.params || params;
      callback = options.callback || callback;
      progressBar = options.progressBar ||progressBar;
      error = options.error || error;
    }
    if(progressBar){
      oui.progress(typeof progressBar =='string' ?progressBar:'加载中...');
    }else if(typeof progressBar =='undefined'){
      oui.progress('加载中...');
    }
    var ajaxResult=null;
    url = oui.addOuiParams4Url(url);
    if(params){
      var json = oui.parseJson(params);
      for(var i in json){
        if(json.hasOwnProperty(i)){
          url = oui.setParam(url,i,oui.parseString(json[i]));
        }
      }
    }
    $.ajax({
      url : url,
      data : {},
      timeout:10000000,
      success : function(text) {
        try{
          var obj = oui.parseJson(text);
          ajaxResult = obj;
        }catch(e){
          ajaxResult = text;
        }
        //login.do?method=index
        //判断是否是自动登陆返回的信息，如果是重新刷新页面
        //session消失逻辑判断
        if (oui.go2login(ajaxResult)) { //登陆拦截
          oui.progress.hide();
          return;
        }
        if (oui.go2reg(ajaxResult)) { //注册拦截
          oui.progress.hide();
          return;
        }
        if($.isPlainObject(ajaxResult)){
          if (ajaxResult.hasOwnProperty("success") && ajaxResult.hasOwnProperty("msg")) {
            if (ajaxResult.success != true) {
              if(error){
                error(ajaxResult);
              } else {
                oui.errorCallback(ajaxResult);
              }
              try{
                oui.progress.hide();
              }catch(e){
              }
              return;
            }
          }
        }
        callback && callback(ajaxResult);
        try{
          oui.progress.hide();
        }catch(e){
        }
        //callback&&callback(ajaxResult);
        //progressObj&&progressObj.hide();
        //console.log(new Date() - startData);
      },
      error : function(o) {
        if(error){
          error(o);
        } else {
          oui.errorCallback(o);
        }
        try {
          oui.progress.hide();
        }catch (e) {

        }
      },
      type : "GET",
      cache : false,
      contentType : 'text/json',
      dataType : "text",
      async:!callback?false:true
    });

    return ajaxResult;
  };
  /**
   *  ajax请求失败的执行方法
   *
   */
  oui.errorCallback = function(ret){
    var _oui = oui.getTop().oui || oui;
    console.log(ret);
    if(!ret){
      _oui.alert('请求失败，可能由于网络或者服务器无响应！');
      return ;
    }
    if(typeof ret =='string'){
      ret = _oui.parseJson(ret);
      if(!ret.msg){
        _oui.alert('请求失败，可能由于网络或者服务器无响应！');
      }
    }else if(typeof ret =='object'){
      if(ret.responseText && ((ret.status+'') =='404')){
        _oui.alert('请求失败，可能由于网络或者服务器无响应！');
        return ;
      }
    }
    if(!ret.msg){
      _oui.alert('请求失败，可能由于网络或者服务器无响应！');
      return ;
    }
    if(ret.errorType&&ret.errorType=='not_login'){
      _oui.alert(ret.msg,function(){
        //TODO 	跳转到登录
      });
    }else{
      _oui.alert(ret.msg);
    }
  };
  /**
   * 根据 html文本  截取body中的内容
   * @param text
   * @returns {string}
   */
  oui.getPageBodyHtml = function(text,filter){
    return oui.subHtml(text,'<body','</body>',filter);
  };
  /**截取html内容 ****/
  oui.subHtml = function(text,startTag,endTag,filter){
    if(startTag&&endTag){
      if( (text.indexOf(startTag)<0) || (text.lastIndexOf(endTag)<0)){
        return text;
      }else{
        var result = text.substring(text.indexOf(startTag),text.lastIndexOf(endTag));
        result=result+endTag;
        result = $(result);
        var arr =[];
        $(result).each(function(){
          if(filter){
            var flag = filter(this);
            if(typeof flag =='boolean'){
              //如果需要过滤 和排除则返回false
              if(!flag){
                return ;
              }
            }
          }
          arr.push(this.outerHTML);
        });
        result = arr.join('');
        return result;
      }
    }else{
      return text;
    }
  };
  /**截取html内容类型 ***/
  oui.SubContentType={
    subBody:1, //截取body中内容
    subHtml:2, //截取 整个html内容
    subBodyExcludeJSCss:3 //截取body中内容，剔除应用中js css资源
  };
  /* 根据内容截取****/
  oui.subContentBy=function(text,startTag,endTag,subContentType){
    var result='';
    try{
      if(startTag&& endTag){
        result = oui.subHtml(text,startTag,endTag);
      }else{
        switch (subContentType){
          case oui.SubContentType.subHtml:
            result = text;
            break;
          case oui.SubContentType.subBody:
            result = oui.getPageBodyHtml(text);
            break;
          case oui.SubContentType.subBodyExcludeJSCss:
            result = oui.getPageBodyHtml(text,function(el){
              if($(el).is('link')){
                return false;
              }
              if($(el).is('script') && ($(el).attr('src'))){
                return false;
              }
            });
            break;
        }
      }
    }catch(e){
      result = text ;
    }
    return result;
  };
  oui.callbacks={};
  oui.loadUrl4ThirdInclude = function(url,subContentType,progressBar,startTag,endTag,callback){
    if(typeof url=='object'){
      var temp = url;
      subContentType= temp.subContentType,progressBar=temp.progressBar,startTag=temp.startTag,endTag=temp.endTag,callback=temp.callback;
      var tempUrl=temp.url;
      url=tempUrl;
    }
    var callbackId = 'callback_'+oui.getUUIDLong();
    oui.callbacks[callbackId] = callback; //设置回调
    var iframeUrl = oui_context.contextPath+'webrobot-inner.html';
    iframeUrl = oui.setParam(iframeUrl,'_t',new Date().getTime());
    var iframe = document.getElementById('oui-third-iframe');
    if(iframe == null){
      $(document.body).append('<iframe style="width:1px;height:1px;visibility:hidden;" onload="oui.getPageParam(\''+callbackId+'\')();" id="oui-third-iframe" src="'+iframeUrl+'" ></iframe>');
      iframe = document.getElementById('oui-third-iframe');
      oui.setPageParam(callbackId,function(){
        setTimeout(function(){
          if(!iframe.contentWindow){
            iframe = document.getElementById('oui-third-iframe');
          }
          iframe.contentWindow.postMessage(  {//向子页面发送消息 用于ajax请求
                cmd:'loadUrl',
                param:{
                  url:url,
                  subContentType:subContentType,
                  progressBar:progressBar,
                  startTag:startTag,
                  endTag:endTag
                },
                callbackId:callbackId
              },
              '*');
        },1);
      });

    }else{
      iframe.contentWindow.postMessage(  {//向子页面发送消息 用于ajax请求
            cmd:'loadUrl',
            param:{
              url:url,
              subContentType:subContentType,
              progressBar:progressBar,
              startTag:startTag,
              endTag:endTag
            },
            callbackId:callbackId
          },
          '*');
    }
  };
  oui.loadUrl4ChromeExt = function(url,subContentType,progressBar,startTag,endTag,callback){
    if(typeof url=='object'){
      var temp = url;
      subContentType= temp.subContentType,progressBar=temp.progressBar,startTag=temp.startTag,endTag=temp.endTag,callback=temp.callback;
      var tempUrl=temp.url;
      url=tempUrl;
    }
    chrome.runtime.sendMessage(
        {
          cmd:'loadUrl',
          param:{
            url:url,
            subContentType:subContentType,
            progressBar:progressBar,
            startTag:startTag,
            endTag:endTag,
            callback:callback
          }
        },
        function(response) {
          callback&&callback(response);
        }
    );
  };

  /***
   * 根据url获取 url的html 内容 ，默认只有url一个参数 则截取body里面的内容，如果有startTag和endTag则获取 开始位置到endTag的位置进行截取
   * @param url
   * @param subContentType 值定义
   * 			oui.SubContentType.subBody --1、截取body中内容,
   * 			oui.SubContentType.subHtml--2、返回整个html,
   * 			oui.SubContentType.subBodyExcludeJSCss-- 3、截取body中内容，并且排除js和css的路径
   * @param progressBar
   * @param startTag
   * @param endTag
   * @param callback 含有callback则为异步回调
   * @param config 用法：oui.loadUrl(config); //支持一个对象配置参数，要求只能传入一个参数，并且参数中含有相关属性配置
   */
  oui.loadUrl = function(url,subContentType,progressBar,startTag,endTag,callback,postParam){

    if(typeof url=='object'){
      var temp = url;
      var subContentType= temp.subContentType,progressBar=temp.progressBar,startTag=temp.startTag,endTag=temp.endTag,callback=temp.callback,tempUrl=temp.url;
      url=tempUrl;
      postParam = temp.postParam;
    }
    if(postParam){
      oui.postData(url,postParam,function(res){
        callback&&callback(res);
      },function(res){
        callback&&callback(res);
      });
      return;
    }
    if(typeof subContentType=='undefined'){
      /** 默认值截取body***/
      subContentType= oui.SubContentType.subBody;
    }else{
      if(!subContentType){
        /** 截取整个html内容***/
        subContentType = oui.SubContentType.subHtml;
      }else{
        if(typeof subContentType =='boolean'){
          if(subContentType){
            subContentType= oui.SubContentType.subBody;
          }else{
            subContentType= oui.SubContentType.subHtml;
          }
        }
      }
    }
    var  progressObj=null;
    if(progressBar){

      progressObj = oui.progress(progressBar);
    }
    if(callback){
      oui.getData(url,{isHtml:true},function(ajaxResult){
        if(progressObj){
          progressObj.hide();
        }
        //异步处理
        var text = oui.subContentBy(ajaxResult,startTag,endTag,subContentType);
        callback(text);
      },false);
      return null;
    }else{
      var ajaxResult = oui.getData(url,{isHtml:true},null,false);
      ajaxResult = oui.subContentBy(ajaxResult,startTag,endTag,subContentType);
      if(progressObj){
        progressObj.hide();
      }
      return ajaxResult;
    }
  };
  /**
   * 将字符串转换成Unicode字符串
   * @param {} str 要转换的字符串
   * @return {String} Unicode字符串
   */
  function str2UnicodeHex(str){
    if(str==null || str==""){
      return "";
    }
    var tempBuffer = [];
    for(var i=0; i<str.length; i++){
      var tempChar = str.charCodeAt(i);
      //38是&号，61是=号
      //if(tempChar==38 || tempChar==61){
      if(tempChar<128){
        tempBuffer.push(str.charAt(i));
      }else{
        tempBuffer.push(addLength(Number(tempChar).toString(16)));
      }
    }
    return tempBuffer.join("");
  }
  var DataUtilZeroArray = ["\\u","\\u0","\\u00","\\u000"];
  function addLength(str){
    var count = 4-str.length;
    return DataUtilZeroArray[4-str.length]+str;
  }

//判断一个对象是否是是数组，如果不是，赋值，如果是，添加进去
  function putToArray(obj,name,value){
    if(obj[name]==null){//第一次是个属性
      obj[name] = value;
    }else if($.isArray(obj[name])){//第三次是数组，不用构造数组， 直接赋值
      obj[name].push(value);
    }else{//第二次 是数组，构造数组并且赋值
      var firstObj = obj[name];
      obj[name] = [];
      obj[name].push(firstObj);
      obj[name].push(value);
    }
  }
//将属性放入JSON对象中， 包含嵌套对象
  function putToObj(obj,item){
    var name = item.name;
    var value = item.value;

    var objNames = name.split(".");
    var nameLength = objNames.length;
    if(nameLength==0){//主对象
      obj[name] = value;
    }else{//子对象
      var preObj = obj;//上一级对象
      for(var i=0;i<nameLength;i++){
        var objName  = objNames[i];
        if(i==nameLength-1){//属性
          putToArray(preObj,objName,value);
        }else if(i==0){//第一级子对象
          if(obj[objName]==null||obj[objName]==""){
            obj[objName] = new Object();
          }
          preObj = obj[objName];
        }else{//其他级子对象
          preObj[objName] = new Object();
        }
      }
    }
  }
//获取表单数据的JSON格式
  $.fn.getFormValue = function(options){
    if(this[0].tagName.toLowerCase()!="form"){
      alert("当前对象不是form!");
      return;
    }
    var tempData = this.serializeArray();
    var result = {};
    if(tempData!=null && tempData.length>0){
      for(var i=0,len=tempData.length; i<len; i++){
        putToObj(result,tempData[i]);
      }
    }
    result = JSON.stringify(result);
    return result;
  };
  /***
   *
   *
   * 根据数组 拆分成多组
   * @param arr
   * @param groupSize
   * @returns {Array}
   */
  oui.splitArray = function(arr,batchSize,fun){
    var groups=[];
    if((!arr) ||(!arr.length)){
      throw new Error('分组数据不能为空');
    }
    batchSize = batchSize||500;
    if(arr.length<batchSize){
      groups.push( arr);
      fun&&fun(arr);
    }else{
      for(var startIndex= 0,max=arr.length;startIndex<max;startIndex+=batchSize){
        var endIndex = startIndex+batchSize;
        if(endIndex>max){
          endIndex = max;
        }
        var currArr = arr.slice(startIndex,endIndex);
        groups.push(currArr);
        fun&&fun(currArr);
      }
    }
    return groups;
  };
  oui.buildBatch = function(length,batchLength,fun){
    var groups=[];
    if( ! length ){
      throw new Error('分组数据不能为空');
    }
    batchLength = batchLength||500;
    if( length<batchLength){
      var temp = {start:0,end:length};
      groups.push( temp);
      fun&&fun(temp);
    }else{
      for(var startIndex= 0,max=length;startIndex<max;startIndex+=batchLength){
        var endIndex = startIndex+batchLength;
        if(endIndex>max){
          endIndex = max;
        }
        var curr = {start:startIndex,end:endIndex};
        groups.push(curr);
        fun&&fun(curr);
      }
    }
    return groups;
  };
  oui.runBatch = function(arr,run,over){
    var tasks = [];
    if(!arr){
      return ;
    }
    if(!arr.length){
      return ;
    }
    for(var i= 0,len=arr.length;i<len;i++){
      tasks.push({
        idx:i,
        source:arr[i],
        run:function(){
          var me = this;
          run&&run(me);
        },
        next:function(){
          var me = this;
          var idx = me.idx;
          if(idx==len-1){
            over&&over(me,arr);
          }else{
            tasks[idx+1].run();
          }
        }
      });
    }
    tasks[0].run();
  };
//请求数据状态
// var postDataRequestState = false;
  /*****
   * 提交参数
   * url, //业务提交url
   * mqUrl, //查询业务url对应mq队列的Url
   * data,//业务提交的数据
   * success,//在业务url提交成功后，自动会走队列查询轮询，查询队列url成功回调，成功后轮询结束
   * fail, //提交业务Url失败回调 //1、需要保证业务url提交成功才走 队列查询 2、如果队列查询超时也会执行失败逻辑
   * progress //进度
   * @param config
   */
  oui.postData4mq = function(config){
    var url = config.url;
    var data = config.data ||{};
    var success = config.success;
    var fail = config.fail;
    var progress = config.progress;
    var mqUrl = config.mqUrl;
    oui.postData(url,data,function(ret){
      config.result = ret;
      oui.postData4timer(config);
    },function(msg,ret){
      fail&&fail(msg,ret);
    },progress);
  };
  /** 轮询数据提交****/
  oui.postData4timer = function(config){
    if(oui.tempTimer){
      //当前存在 定时请求timer
      return;
    }
    var timeOut = config.timeOut || 1000*30;//默认尝试30秒查询队列结果
    var timeStep = config.timeStep ||1000;//默认间隔一秒轮询一次
    config.timeOut = timeOut;
    config.timeStep = timeStep;
    config.start = config.start || new Date().getTime();//默认值为0
    config.end = new Date().getTime();
    oui.tempTimer = setTimeout(function(){
      /** mq 结果查询****/
      var mqUrl = config.mqUrl;
      var result = config.result;
      oui.postData(mqUrl,result,function(mqResult){
        config.mqResult = mqResult;
        //成功回调后 处理
        config.success&&config.success(config.mqResult,config.result,config);
        oui.tempTimer = null;
      },function(msg,mqResult){
        config.mqResult = mqResult;
        config.mqMsg = msg;
        //失败回调后 轮询
        oui.tempTimer = null;
        config.end = new Date().getTime(); //重置end时间
        if(config.end - config.start>config.timeOut){ //超时退出
          config.fail&&config.fail('查询队列消息超时',mqResult);
          return ;
        }
        oui.postData4timer(config);
      },progress);
    },timeStep);
  };
//数据提交函数
  oui.postData = function(url,data,successCallBack,failedCallBack,progress){
    // if(postDataRequestState){
    // 	console.log(url);
    // 	oui.alert("不能重复提交,请稍候");
    // 	return;
    // }
    // if(postDataRequestState === false){
    //    postDataRequestState = true;
    // }
    if(successCallBack==null){
      oui.alert("回调函数为空!");
      // postDataRequestState = false;
      return;
    }

    if(typeof(data)=="string"){
      data = ((data==null)?"":(data));
    }else if(typeof(data)=="object"){
      data = JSON.stringify(data);
    }
    if(typeof progress=='undefined'){
      progress = '保存中';
    }
    if(progress){
      if(typeof progress=='string'){
        oui.progress(progress);
      }else{
        oui.progress('保存中');
      }
    }
    url = oui.addOuiParams4Url(url);
    $.ajax({
      url: url,
      type: "post",
      data: { ouiData: data },
      timeout:10000000,
      cache : false,
      //contentType : 'text/json',
      dataType : "json",
      error : function(ret){
        // postDataRequestState = false;
        oui.progress.hide();
        oui.errorCallback(ret);
//    		if(failedCallBack==null||failedCallBack==undefined){//不成功时，又无失败回调函数，则系统提示
//    			oui.alert(oui.i18n("common_submit_error")+":"+ret.status);
//    		}else{//不成功时，有回调函数，执行回调函数
//    			failedCallBack(ret);
//    		}
      },
      success: function (text) {
        // postDataRequestState = false;
        oui.progress.hide();
        var ret = text;

        if(ret.success==true){//成功后执行成功回调函数


          successCallBack(ret);
        }else{//不成功时
          if(oui.go2login(ret)){ //登陆拦截
            return ;
          }
          if(oui.go2reg(ret)){ //注册拦截
            return ;
          }
          if(failedCallBack==null||failedCallBack==undefined){//不成功时，又无失败回调函数，则系统提示
            oui.getTop().oui.alert(ret.msg);
          }else{//不成功时，有回调函数，执行回调函数
            failedCallBack(ret.msg, ret);
          }
        }
      }
    });
  };
  /**
   * post 模拟表单提交
   * @param url 地址
   * @param data 数据
   * @param target 跳转target
   */
  oui.postForm = function (url, data, target) {
    var form = $("<form method='post' style='display: none;'></form>");
    form.attr({"action":url});
    var arg = null;
    for (arg in data) {
      var input = $("<input type='hidden' />");
      input.attr({"name":arg});
      input.val(data[arg]);
      form.append(input);
    }
    $(document.body).append(form);
    form.submit();
  };
  /*****
   * jsonutil
   */
  (function(_){
    var JsonPathUtil = {
      /**
       * init 初始化输入数据； 初始化事件 初始化执行
       */
      init : function() {

        $.fn.serializeObj = function(){
          var o = {};
          var a = this.serializeArray();
          $.each(a, function() {
            JsonPathUtil.setObjByPath(this.name,o,this.value||"");
          });
          return o;
        };
      },
      /**
       * 支持含数组的jsonpath
       * @param attr
       * @param obj
       * @param v
       */
      setObjByPath:function(attr,obj,v,notArray){
        if(typeof  notArray =='undefined'){
          notArray = false;
        }
        var arrStart = attr.indexOf("\[");
        var arrEnd = attr.indexOf("\]");
        if(arrStart<0 || arrEnd<0 || arrEnd < arrStart){
          return JsonPathUtil.setObjByPathNoArr(attr, obj, v,notArray);
        }
        var parts = attr.split("\.");
        var start =0,end = parts.length;
        var container = obj;
        try{
          for(start = 0; start < end; start++) {
            var part = parts[start];
            var arrStart = part.indexOf("\[");
            var arrEnd = part.indexOf("\]");
            if(arrStart>0 && arrEnd>arrStart){//含数组字符
              /*
               * 解析数组,对数组的值进行设置
               */
              var strIdx = part.substring(arrStart+1,arrEnd);
              var idx = parseInt(strIdx);
              var arrPart = part.substring(0,arrStart);
              if (!container[arrPart]){
                container[arrPart] = [];
              }
              if(!container[arrPart][idx] ){
                container[arrPart][idx] = {};
              }
              if(start == end -1){
                container[arrPart][idx] = v;
              }else{
                container = container[arrPart][idx];
              }
            }else{
              /*
               * 普通对象属性设置
               */
              if(start == end -1){
                JsonPathUtil.putToArray(container,part,v,notArray);
              }else{
                if (!container[part]){
                  container[part] = {};
                }
                container = container[part];
              }
            }
          }
        }catch(e){ //如果解析含数组jsonpath产生异常，则采用无数组jsonPath解析
          return JsonPathUtil.setObjByPathNoArr(attr, obj, v,notArray);
        }

        return obj;
      },
      /**
       * 无数组 存jsonpath的对象设置
       * @param attr
       * @param obj
       * @param v
       */
      setObjByPathNoArr:function(attr,obj,v,notArray){
        var parts = attr.split("\.");
        var start =0,end = parts.length;
        var container = obj;
        for(start = 0; start < end; start++) {
          var part = parts[start];
          if(start == end -1){//最后一个节点为属性
            JsonPathUtil.putToArray(container,part,v,notArray);
          }else{
            if (!container[part]){
              container[part] = {};
            }
            container = container[part];
          }
        }
        return obj;
      },
      /**
       * 给对象传入值，如果元素多次出现，则表现为数组
       */
      putToArray:function (obj,name,value,notArray){
        if(obj[name]==null){//第一次是个属性
          obj[name] = value;
        }else if(obj[name] instanceof Array){//第三次是数组，不用构造数组， 直接赋值
          //TODO 解决数组整体赋值的bug
          if(notArray){//不是数组，直接赋值
            obj[name] = value
          }else{//是数组追加值
            obj[name].push(value);
          }
        }else{//第二次 是数组，构造数组并且赋值
          if(notArray){
            obj[name] = value;
          }else{
            var firstObj = obj[name];
            obj[name] = [];
            obj[name].push(firstObj);
            obj[name].push(value);

          }
        }
      },

      getJsonByPath:function(attr, obj){
        if ((typeof obj == 'object') && (obj instanceof Array)) {
          return obj[attr];
        }
        if(typeof attr =='undefined'){
          return null;
        }
        var attrs = attr.split("\.");
        var temps = [ obj ];
        var idx = 0;
        for ( var k = 0; k < attrs.length; k += 1) {
          var item = temps[idx];
          if ((typeof item[attrs[k]]) == "undefined") {
            return null;
          }
          temps.push(item[attrs[k]]);
          idx += 1;
        }
        return temps[idx];
      }

    };
    _.JsonPathUtil = JsonPathUtil;
  })(oui);
  /*支持将form数据转多级对象的json*/
  oui.JsonPathUtil.init();






})(window,window.$$||window.$);
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
      console.info( $(container),'container')

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
        openType: '_blank',
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





(function(win){
  var validateAttrName = "validate";
  /*
     *  验证组件
     *  必填
     *  最小长度
     *	最大长度
     最小值
     最大值
     多选：至少选择项
     多选：最多选择项
     多选：恰好选择项
     phone:手机号码
     email:邮箱地址
     */
  var validatorNames ="require,minLength,maxLength,minValue,maxValue,checkedSizeGt,checkedSizeLt,checkedSizeEq,phone,email,emailOrPhone,number,sixNumber,fourNumber,sixNumberAndEng,numberSixToEighteen,numberAndEngSixToEighteen,passForThreeCombinations,passStartWithEng,passForThreeCombWithoutSpecChar,passForThreeCombWithSpecChar,dotNum,specialChars,website,tel,fax,qq,fileUploadLimit,imageUploadLimit,lettersOrNumber,dateYMD,dateYM,dateY,dateYMDhms,dateYMDhm,dateYMDh,enumData".split(',');
  /**
   * 校验类
   */
  var Validator = {
    /*
         *支持属性 title validateValue
         */
    fax_error_msg:'{{title}}请输入正确的传真号码',
    tel_error_msg:'{{title}}请输入正确的固话号码（号码前加区号），如：028-66886688',
    qq_error_msg:'{{title}}请输入正确的QQ号码',
    specialChars_error_msg:'{{title}}不能包含特殊字符',
    website_error_msg:'{{title}}请输入正确的网址，如：http（或https）：//Formtalk.com',
    require_error_msg:'{{title}}此项必填',
    email_error_msg:'{{title}}请输入正确的E-mail地址，如：123@126.com，多个请用英文分号(;)隔开',
    phone_error_msg:'{{title}}请输入正确的手机号码',
    emailOrPhone_error_msg:'{{title}}请输入正确的手机号码或邮箱号码',
    cellphones_error_msg:'{{title}}手机号码不在特定范围内',
    checkMsgCode_error_msg:'{{title}}手机验证码不能为空',
    maxLength_error_msg:'{{title}}最多{{validateValue}}个字',
    minLength_error_msg:'{{title}}至少{{validateValue}}个字',
    maxValue_error_msg:'{{title}}不能大于{{validateValue}}{{(validate&&validate.percentNum)?"%":""}}',
    minValue_error_msg:'{{title}}不能小于{{validateValue}}{{(validate&&validate.percentNum)?"%":""}}',
    dotNum_error_msg:'{{title}}小数点后位数不能大于{{validateValue}}',
    checkedSizeGt_error_msg:'{{title}}至少选择{{validateValue}}个选项',
    checkedSizeLt_error_msg:'{{title}}最多选择{{validateValue}}个选项',
    checkedSizeEq_error_msg:'{{title}}只能选择{{validateValue}}个选项',
    fileUploadLimit_error_msg:'{{title}}附件不能超过{{validateValue}}个',
    imageUploadLimit_error_msg:'{{title}}图片不能超过{{validateValue}}个',
    number_error_msg:'{{title}}请输入数字',
    sixNumber_error_msg:'{{title}}请输入6位数字',
    fourNumber_error_msg:'{{title}}请输入4位数字',
    sixNumberAndEng_error_msg:'{{title}}请输入6位数字及英文字母组合',
    numberSixToEighteen_error_msg:'{{title}}请输入6至18位的纯数字',
    numberAndEngSixToEighteen_error_msg:'{{title}}密码须包含数字、字母两种元素，且密码位数为6-18位',
    passForThreeCombinations_error_msg:'{{title}}密码为数字，大、小写字母，特殊符号至少包含三种，长度为8-18位',
    passStartWithEng_error_msg:'{{title}}以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
    passForThreeCombWithoutSpecChar_error_msg:'{{title}}必须包含大小写字母和数字的组合，不能使用特殊字符，长度在6-18位之间',
    passForThreeCombWithSpecChar_error_msg:'{{title}}必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-18之间',
    lettersOrNumber_error_msg:'{{title}}请输入正确文本(字母、数字、字母和数字组合)',
    dateYMDhms_error_msg:'{{title}}请输入格式正确的日期时间,时间格式：yyyy-mm-dd HH:MM:ss; 例如：2008-08-08 08:08:08',
    dateYMDhm_error_msg:'{{title}}请输入格式正确的日期时间,时间格式：yyyy-mm-dd HH:MM; 例如：2008-08-08 08:08',
    dateYMDh_error_msg:'{{title}}请输入格式正确的日期时间,时间格式：yyyy-mm-dd HH; 例如：2008-08-08 08',
    dateYMD_error_msg:'{{title}}请输入格式正确的日期,日期格式：yyyy-mm-dd; 例如：2008-08-08 ',
    dateYM_error_msg:'{{title}}请输入格式正确的日期,日期格式：yyyy-mm; 例如：2008-08',
    dateY_error_msg:'{{title}}请输入格式正确的年份,日期格式：yyyy; 例如：2008',
    enumData_error_msg:'{{title}}不在枚举范围'
  };

  /**
   *@param container 指定表单范围校验
   *@param options {
		 isFindErrorBreak //是否在找到第一个验证错误时就终止校验, true:在遇到第一个校验错误则终止校验并返回,false:遇到校验错误项继续往下校验	 
		 failCallback //校验失败时触发 failCallback(failEls),触发参数为 失败的元素列表
	 }
   *@return true:校验通过; false:校验失败
   *调用方式如 oui.checkForm("#formid",{isFindErrorBreak:false,failCallback:function(failEls){ }});
   *如：
   var checkResult = oui.checkForm("#contentForm", {
		isFindErrorBreak: false,
		isNotCheckRequire:false,//默认为false ，需要校验 ，true：不校验必填项
		failCallback: function(failEls) {//校验失败回调
			if(!(failEls && failEls.length)){
				return ;
			} 
			var scrollCenterPos = ($(document.body).height()/2); 
			$(document.body).scrollTop($(failEls[0]).parent().offset().top-scrollCenterPos);
		}
	 });
   *-------------------------------------------------
   *该方法需要配合页面中配置元素的validate属性
   * 在html元素的validate上的配置项为
   * okMode:'no',//默认为无消息提示 ,1、oktips自动显示消息然后消失
   * failMode:'alert', //默认为alert ; 其中 1、alert为弹出框提示错误信息 ,
   2、msgPosEl在指定元素位置显示错误信息，如果failMode配置为msgPosEl，需要配置msgPosEl属性定位,如'#test'
   3、tips 自动显示消息然后消失
   * okMsg:'',//默认为空
   * msgPosEl: 消息显示位置,依赖与failMode属性值 msgPosEl
   * failMsg:'校验失败',//默认为校验失败
   failCallback: 配置校验失败的回调函数 接口参数分别为(el,key,json) 元素、校验属性、校验对象,
   msgPos:'inner' 默认值为 inner,不是必填项,结合faileMode、msgPosEl属性使用,支持值inner,before,after,append; inner：错误消息在指定元素内替换innerHTML;before:错误消息创建标签到指定元素的前面;after:错误消息创建标签到指定元素的后面;append:错误消息在指定元素里面显示 ;该配置依赖failMode和 msgPosEl属性用于元素定位显示

   * 验证所有
   *------------------------------------------------------------------------
   */
  oui.checkForm = function(container,options){
    var $container = null;
    if(typeof container=='string'){
      $container = $(container);
    }else{
      $container = $(container||document.body);
    }
    if((!$container) || ($container.length==0)){
      return true;
    }
    options = options ||{};
    var isFindErrorBreak = options.isFindErrorBreak?true:false;
    var isNotCheckRequire = options.isNotCheckRequire ||false; //是否不校验必填
    var failEls = [];
    var arr = $container.find('['+validateAttrName+']');
    var isCheckOk= false;
    var result = true;
    for(var i=0,len=arr.length;i<len;i++){
      isCheckOk = oui.validate(arr[i],isNotCheckRequire);
      if(!isCheckOk){
        result = false;
        failEls.push(arr[i]);
        if(isFindErrorBreak){
          window.setTimeout(function(){
            (options.failCallback &&failEls.length)&&options.failCallback(failEls);
          },1);
          return false;
        }
      }
    }
    window.setTimeout(function(){
      (options.failCallback &&failEls.length)&&options.failCallback(failEls);
    },1);
    return result;
  };
  /**
   * 根据数据 进行校验
   * json : key为 属性名 ,value为属性值
   * data: key为属性名,value 为验证对象
   */
  oui.checkData = function(json,data,isFindErrorBreak,isNotCheckRequire){
    var isCheckOk = true;
    var result = true;
    for(var i in data){ //根据校验配置进行遍历校验
      if(i=='require' && isNotCheckRequire){
        continue;
      }
      isCheckOk = oui.validate4value(json[i],data[i],i);
      if(!isCheckOk){
        result = false;
        if(isFindErrorBreak){
          return false;
        }
      }
    }
    return result;
  };
  /**
   * 根据值和验证对象、元素信息(可为元素对象、或者id、或者name,根据具体应用场景适配)进行验证
   */
  oui.validate4value = function(v,validate,el,isNotCheckRequire){

    var json = oui.parseJson(validate);
    var len = validatorNames.length;
    var key='',isCheckOk = true;//校验状态是否验证通过
    var validateErrorKey ='';
    for(var j=0;j<len;j++){
      key = validatorNames[j];
      if(!json[key]){
        if(typeof json[key] !='number'){
          continue;
        }
      }

      if(key =='require' && isNotCheckRequire){
        continue;
      }
      if((typeof Validator[key+'4value'] =='function') ){
        isCheckOk = Validator[key+'4value'](v,json);
      }
      if(!isCheckOk){//验证不通过直接退出循环
        validateErrorKey = key;
        break;
      }
    }

    /*
         * 如果有自定义验证方法，执行自定义验证；否则执行默认验证逻辑
         */
    var validateMethod = json.validateMethod || oui.showValidateMsg;
    validateMethod(json,isCheckOk,el,validateErrorKey);//执行验证逻辑
    return isCheckOk;
  };
  /** 校验值并获取消息内容*****/
  oui.validate4message = function(v,validate,isNotCheckRequire){
     
    var json = oui.parseJson(validate);
    var len = validatorNames.length;
    var key='',isCheckOk = true;//校验状态是否验证通过
    var validateErrorKey ='';
    for(var j=0;j<len;j++){
      key = validatorNames[j];
      if(!json[key]){
        if(typeof json[key] !='number'){
          continue;
        }
      }
      if(key =='require' && isNotCheckRequire){
        continue;
      }
      if((typeof Validator[key+'4value'] =='function') ){
        isCheckOk = Validator[key+'4value'](v,json);
      }
      if(!isCheckOk){//验证不通过直接退出循环
        validateErrorKey = key;
        break;
      }
    }
    var result = {success:true};
    if(validateErrorKey && (!isCheckOk)){
      result.success = false;
      var  failMsg=json.failMsg;
      failMsg = json[validateErrorKey+'_error_msg']|| failMsg|| (Validator[validateErrorKey+'_error_msg']||'');
      var obj = {title: json.title||'',validateValue:((typeof json[validateErrorKey]!='undefined')?json[validateErrorKey]:''),validate:json};
      var render = template.compile(failMsg);
      result.msg = render(obj);
    }
    if(!result.success){
      return result;
    }
    /* 自定义校验 配置**/
    if(validate.check){
      if(typeof validate.check=='string'){
        var check = oui.parseJson(validate.check);
        result = check&&check(v,validate);
      }else{
        result = validate.check(v,validate);
      }
    }
    return result;
  };
  oui.scroll2ErrorEl = function(el,isNotCheckRequire){
    $(el).focus();
    oui.validate(el,isNotCheckRequire);
  };
  /**
   *验证单个标签
   * 在html元素的validate上的配置项为
   * okMode:'no',//默认为无消息提示
   * failMode:'alert', //默认为alert
   * okMsg:'',//默认为空
   * failMsg:'校验失败',//默认为校验失败
   * validateMethod: oui.showValidateMsg //默认可不用配置；校验时的消息提示执行函数(第一个参数json,第二个参数isCheckOk,第三个参数el);不配置时执行验证方法为 oui.showValidateMsg = function(json,isCheckOk,el) {};可自定义
   */
  oui.validate= function(el,isNotCheckRequire){
    if(!el){ //错误元素,不验证
      return true;
    }

    var validate = $(el).attr(validateAttrName);
    if(!validate){//无验证配置，不需要验证
      return true;
    }
    var json = oui.parseJson(validate);
    var len = validatorNames.length;
    var key='',isCheckOk = true;//校验状态是否验证通过
    var validateErrorKey ='';
    for(var j=0;j<len;j++){
      key = validatorNames[j];
      if(!json[key]){
        if(typeof json[key] !='number'){
          continue;
        }
      }
      if((typeof Validator[key] =='function') ){
        if(key =='require' && isNotCheckRequire){ // 对必填项不进行校验
          continue;
        }
        if(key=='minLength' && isNotCheckRequire){ //对最小值不进行校验
          var v = $(el).val();
          if(!v.length){
            continue;
          }
        }
        isCheckOk = Validator[key](el,json);
      }
      if(!isCheckOk){//验证不通过直接退出循环
        validateErrorKey = key;
        break;
      }
    }

    /*
         * 如果有自定义验证方法，执行自定义验证；否则执行默认验证逻辑
         */
    var validateMethod = json.validateMethod || oui.showValidateMsg;
    validateMethod(json,isCheckOk,el,validateErrorKey);//执行验证逻辑
    return isCheckOk;
  };
  /**
   * 根据mode批量显示 消息
   */
  oui.showMsgByModes = function(modes,msg,sourceObj,key,json){
    var arr =[];
    if(typeof modes =='string'){
      arr = modes.split(',');
    }else{
      arr = modes ||[];
    }
    var mode ='';
    for(var i=0,len=arr.length;i<len;i++){
      mode =arr[i];
      oui.showMsgByMode(mode,msg,sourceObj,key,json);
    }
  };
  /**
   * 根据消息提示方式 提示信息
   */
  oui.showMsgByMode = function(mode,msg,sourceObj,key,json){
    mode = mode ||'alert';
    msg = oui.escapeStringToHTML(msg, false);
    switch(mode){

      case 'tips':
        //oui.showAutoTips(msg);
        oui.getTop().oui.showAutoTips({content:msg,boxStyle:'background-color:#e07365'});
        break;

      case 'oktips':
        oui.getTop().oui.showAutoTips({content:msg});
        break;

      case 'alert':
        if(oui.getTop().oui){

          oui.getTop().oui.alert(msg);
        }else{
          oui.alert(msg);
        }
        break;

      case 'msgPosEl': // 指定元素位置显示提示信息
        //oui.alert(msg);
        var el = json.msgPosEl;
        if (typeof el == 'string') {
          if (el.indexOf('oui.getNS') > -1) {
            try {
              el = oui.parseJson(el);
            } catch (err) {
            }
          }
        }
        if((!el) ||(!$(el).length)){
          break;
        }
        var $el = $(el);

        if(!json.msgPos){
          json.msgPos ='inner';
        }

        if(json.msgPos =='inner'){
          $el.html(msg||"");
          $el.attr('title',msg||'');
        }else if(json.msgPos=='before'){
          var $prev=$el.prev();
          if($prev&&$prev.length>0&& $prev.is('i')&&$prev.hasClass('oui-error-info')){
            $($prev[0]).html(msg||"");
            $($prev[0]).attr('title',msg||"");
          }else{
            $el.before('<i class="oui-error-info">'+(msg||"")+'</i>');
            $el.prev().attr('title',msg||'');
          }
          if(!msg){
            $el.prev().hide();
          }else{
            $el.prev().show();
          }
        }else if(json.msgPos=='after'){
          var $next=$el.next();
          if($next&&$next.length>0&& $next.is('i')&&$next.hasClass('oui-error-info')){
            $($next[0]).html(msg||"");
            $($next[0]).attr('title',msg||'');
          }else{
            $el.after('<i class="oui-error-info">'+(msg||"")+'</i>');
            $el.next().attr('title',msg||'');
          }
          if(!msg){
            $el.next().hide();
          }else{
            $el.next().show();
          }
        }else if(json.msgPos=='append'){
          var $innerEl=$el.find('.oui-error-info');
          if($innerEl.length>0){
            $($innerEl[0]).html(msg||"");
            $($innerEl[0]).attr('title',msg||"");
          }else{
            $el.append('<i class="oui-error-info">'+(msg||"")+'</i>');
            $el.find('i.oui-error-info').attr('title',msg||"");
          }
          if(!msg){
            $el.find('.oui-error-info').hide();
          }else{
            $el.find('.oui-error-info').show();
          }
        }
        break;

    }

  };
  /**
   * 根据校验元素 隐藏错误消息
   */
  oui.hideErrorInfo = function(valiateEl){
    if(!valiateEl){
      return ;
    }
    $(valiateEl).removeClass('error-border-highlight');
    var targetHighEl = $(valiateEl).attr('targetHighBorderEl');
    if(targetHighEl){
      $(getTargetHighEl(targetHighEl)).removeClass('error-border-highlight');
    }
    var validate = $(valiateEl).attr('validate');
    if(!validate){
      return ;
    }

    var json = oui.parseJson(validate);
    if(!json){
      return ;
    }
    if(!json.msgPosEl){
      return ;
    }
    if(!json.msgPos){ //默认为 inner
      // json.msgPos ='inner';
      return ;
    }
    var $el = $(getTargetHighEl(json.msgPosEl));
    if(json.msgPos=='before'){
      var $prev=$el.prev();
      if($prev&&$prev.length>0&& $prev.is('i')&&$prev.hasClass('oui-error-info')){
        $($prev[0]).hide();
      }else{
        return ;
      }
    }else if(json.msgPos=='after'){
      var $next=$el.next();
      if($next&&$next.length>0&& $next.is('i')&&$next.hasClass('oui-error-info')){
        $($next[0]).hide();
      }else{
        return ;
      }
    }else if(json.msgPos=='append'){
      var $innerEl=$el.find('.oui-error-info');
      if($innerEl.length>0){
        $($innerEl[0]).hide();
      }else{
        return ;
      }
    }
  };

  /**
   * 获取高亮目标元素
   * @param el
   */
  var getTargetHighEl = function(el){
    if (typeof el == 'string') {
      if (el.indexOf('oui.getNS') > -1) {
        try {
          el = oui.parseJson(el);
        } catch (err) {
        }
      }
    }
    return el;
  };

  /**
   * 根据，json对象,校验状态，元素进行提示
   * oui.showValidateMsg({"msgPosEl":validateJson.msgPosEl,"failMode":validateJson.failMode,"msgPos":validateJson.msgPos,failMsg:'hello123'},false,fieldObj[0],'error4unique');
   * okMode
   * failMode
   * okMsg
   * failMsg
   */
  oui.showValidateMsg = function(json,isCheckOk,el,key){
    var okMode = json.okMode,failMode=json.failMode,okMsg=json.okMsg,failMsg=json.failMsg;
    okMode=okMode ||'msgPosEl';
    failMode = failMode ||'alert,msgPosEl';
    //okMsg=okMsg || (Validator[key+'_ok_msg']||"");
    okMsg=json[key+'_ok_msg'] || okMsg || (Validator[key+'_ok_msg']||"");
    //failMsg = failMsg|| (Validator[key+'_error_msg']||'');
    failMsg = json[key+'_error_msg']|| failMsg|| (Validator[key+'_error_msg']||'');

    var okModes = okMode.split(',');
    var failModes = failMode.split(',');
    var currModes=[];
    var msg ='';
    var obj = {title: json.title||'',validateValue:((typeof json[key]!='undefined')?json[key]:''),validate:json};
    var resultMsg='';
    if(isCheckOk){
      currModes = okModes ||[];
      msg =okMsg;
      var render = template.compile(msg);
      resultMsg = render(obj);
      if(oui.isDom(el)){
        $(el).removeClass('error-border-highlight');
        var targetHighEl = $(el).attr('targetHighBorderEl');
        if(targetHighEl){
          $(getTargetHighEl(targetHighEl)).removeClass('error-border-highlight');
        }
      }
    }else{
      currModes = failModes ||[];
      msg = failMsg;
      var render = template.compile(msg);
      resultMsg = render(obj);
      if(oui.isDom(el)){
        $(el).addClass('error-border-highlight');
        var targetHighEl = $(el).attr('targetHighBorderEl');
        if(targetHighEl){
          $(getTargetHighEl(targetHighEl)).addClass('error-border-highlight');
        }
      }
      if(json.failCallback4noMsg){
        json.failCallback4noMsg(resultMsg,el,key,json);
        return ;
      }
    }
    for(var i=0,len=currModes.length;i<len;i++){

      oui.showMsgByMode(currModes[i], resultMsg,el,key,json);
      if(isCheckOk){
        continue;
      }
      if(typeof json.failCallback=='function'){
        json.failCallback(el,key,json);
      }else if((typeof json.failCallback=='string') && json.failCallback && (window[json.failCallback])){
        window[json.failCallback](el,key,json);
      }
    }
  };

  Validator.require4value = function(v,json,isNotCheckRequire){
    if((!json.require) ||((typeof json.require=='string' && json.require=='false'))){
      return true;
    }
    if(isNotCheckRequire){
      return true;
    }
    if(!v){
      if((typeof v =='boolean') || (typeof v=='number')){
        return true;
      }else {
        return false;
      }
    }else if(!$.trim(v)){
      return false;
    }else{

      return true;
    }
  };

  var specialCharsReg = new RegExp("[`~!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]");
  /**
   * 特殊字符校验
   *
   */
  Validator.specialChars = function(el,json){
    //^$*{}.?+\\d\\D\\s\\S\\w\\W\\b\\B\\A\\G\\Z\\z
    var v = $(el).val();
    return Validator.specialChars4value(v,json);
  };
  /**
   * 针对MongoDB特殊字符校验
   */
  Validator.specialChars4value = function(v,json){
    if((!json.specialChars) ||((typeof json.specialChars=='string' && json.specialChars=='false'))){
      return true;
    }
    if(specialCharsReg.test(v+'')){
      return false;
    }
    return true;
  };

  /***字母和数字组合校验 **/
  Validator.lettersOrNumber= function(el,json)
  {
    var v = $(el).val();
    return Validator.lettersOrNumber4value(v,json);
  };
  /***字母和数字组合校验 **/
  Validator.lettersOrNumber4value= function(v,json)
  {
    if((!json.lettersOrNumber) ||((typeof json.lettersOrNumber=='string' && json.lettersOrNumber=='false'))){
      return true;
    }
    var re =  /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/
    if (re.test(v))
    {
      return true;
    }else{
      return false;
    }
  };
  /**
   * 必填校验
   *
   */
  Validator.require = function(el,json,isNotCheckRequire){
    if((!json.require) ||((typeof json.require=='string' && json.require=='false'))){
      return true;
    }
    if(isNotCheckRequire){
      return true;
    }
    var controlType = $(el).attr('type');
    /*
         * 单选必填校验
         */
    if($(el).is('div') && (controlType=='radio' || controlType =='imagesingle' )){
      var checkedLen = $(el).find('input[type="radio"]:checked').length;
      if(checkedLen<=0){
        return false;
      }else {
        return true;
      }
    }
    /*
         * 多选必填校验
         */
    if($(el).is('div') && (controlType=='multiselect' || controlType=='imagemulti')){
      var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
      if(checkedLen<=0){
        return false;
      }else {
        return true;
      }
    }
    return Validator.require4value($(el).val(),json);
  };
  /**
   * 对于富文本控件 ，根据值获取text内容
   * @param value
   */
  var getText4richtext = function(value){
    if(!document.getElementById("val-richtext4value")){
      $(document.body).append('<div style="display:none"  id="val-richtext4value"></div>');
    }
    var $val4richtext = $("#val-richtext4value");
    $val4richtext.html(value.replace(/<script/gi, "&lt;script").replace(/<\/script/gi, "&lt;\/script"));
    return $.trim($val4richtext.text());
  };
  Validator.maxLength4value=function(v,json){
    if(typeof v =='boolean'){
      return true;
    }
    if(typeof json.maxLength=='undefined'){
      return true;
    }
    if(typeof json.maxLength=='string' && (!json.maxLength)){
      return true;
    }
    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    json.maxLength = parseInt(json.maxLength);
    if(typeof v =='number'){
      v =v+'';
    }
    if(json.number){
      var vlen = v.length;
      if(v.indexOf('.')>=0){
        vlen--;
      }
      if(v.indexOf('-')==0){
        vlen--;
      }
      if(vlen>15){ //数字校验 长度15位
        return false;
      }else if(vlen>json.maxLength){
        return false;
      }else{
        return true;
      }
    }else if((typeof json.isHtmlText !='undefined') && (json.isHtmlText)){
      if(getText4richtext(v).length>json.maxLength){
        return false;
      }
    }else if(v.length>json.maxLength){
      return false;
    }
    return true;
  };
  /**
   * 最大长度校验
   *
   */
  Validator.maxLength = function(el,json){
    var v = $(el).val();
    return Validator.maxLength4value(v,json);
  };
  /**
   * 附件个数校验
   */
  Validator.fileUploadLimit = function(el,json){
    var v = $(el).val();
    return Validator.fileUploadLimit4value(v,json);
  };
  /**
   * 附件个数校验
   */
  Validator.fileUploadLimit4value = function(v,json){
    if(!v){
      return true;
    }
    var arr =v.split(',');

    if(!json.fileUploadLimit){
      return true;
    }
    var fulimit = parseInt(json.fileUploadLimit);
    if(!fulimit){
      return true;
    }

    if(arr.length>fulimit){
      return false;
    }
    return true;
  };
  /**
   * 图片个数校验
   */
  Validator.imageUploadLimit = function(el,json){
    var v = $(el).val();
    return Validator.imageUploadLimit4value(v,json);
  };
  /**
   * 图片个数校验
   */
  Validator.imageUploadLimit4value = function(v,json){
    if(!v){
      return true;
    }
    var arr =v.split(',');
    if(!json.imageUploadLimit){
      return true;
    }
    var fulimit = parseInt(json.imageUploadLimit);
    if(!fulimit){
      return true;
    }

    if(arr.length>fulimit){
      return false;
    }
    return true;
  };
  Validator.minLength4value=function(v,json){
    if(typeof v =='boolean'){
      return true;
    }
    if(typeof json.minLength=='undefined'){
      return true;
    }
    if(typeof json.minLength=='string' && (!json.minLength)){
      return true;
    }
    json.minLength = parseInt(json.minLength);
    if(typeof v =='number'){
      v =v+'';
    }

    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    if(v.length<json.minLength){
      return false;
    }
    return true;
  };
  /**
   * 至少填写长度校验
   *
   */
  Validator.minLength = function(el,json){
    var v = $(el).val();
    return Validator.minLength4value(v,json);
  };
  Validator.minValue4value = function(v,json){

    if(typeof json.minValue =='undefined'){
      return true;
    }
    if((typeof json.minValue =='string') && (!json.minValue)){
      return true;
    }
    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    if(typeof v =='undefined'){
      return true;
    }
    if(!(v+'')){
      return true;
    }
    var minValue = parseFloat(json.minValue);
    try{
      if(typeof v=='number'){
        if(typeof json.percentNum !='undefined'){
          if((json.percentNum=='true') || (json.percentNum===true)){
            if((v*100)<minValue){
              return false;
            }else{
              return true;
            }
          }
        }
        if(v<minValue){
          return false;
        }
      }
      if(typeof json.percentNum !='undefined') {
        if ((json.percentNum == 'true') ||( json.percentNum === true)) {
          if ((v)&&((parseFloat(v) * 100) < minValue ) ) {
            return false;
          }else{
            return true;
          }
        }
      }

      if((v)&&(parseFloat(v)<minValue)){
        return false;
      }

    }catch(e){

    }
    return true;
  };
  /**
   * 最小值验证
   */
  Validator.minValue = function(el,json){
    var v = $(el).val();
    return Validator.minValue4value(v,json);
  };
  Validator.maxValue4value = function(v,json){
    if(typeof json.maxValue =='undefined'){
      return true;
    }
    if((typeof json.maxValue =='string') && (!json.maxValue)){
      return true;
    }
    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    if(typeof v =='undefined'){
      return true;
    }
    if(!(v+'')){
      return true;
    }
    var maxValue = parseFloat(json.maxValue);

    try{
      if(typeof v=='number'){

        if(typeof json.percentNum !='undefined') {
          if (json.percentNum == 'true' || json.percentNum === true) {
            if ((v * 100) > maxValue ) {
              return false;
            }else{
              return true;
            }
          }
        }
        if(v>maxValue){
          return false;
        }
      }
      if(typeof json.percentNum !='undefined') {
        if ((json.percentNum == 'true') || (json.percentNum === true)) {
          if ((v)&&((parseFloat(v) * 100) > maxValue) ) {
            return false;
          }else{
            return true;
          }
        }
      }

      if((v)&&(parseFloat(v)>maxValue)){
        return false;
      }

    }catch(e){

    }
    return true;
  };
  /**
   * 最大值验证
   */
  Validator.maxValue = function(el,json){
    var v = $(el).val();
    return Validator.maxValue4value(v,json);
  };
  /**
   * 数字的小数点后位数校验
   */
  Validator.dotNum4value = function(v,json){
    var dotNum=4; //小数点最多4位
    if(typeof json.dotNum =='undefined'){
      return true;
    }

    if(typeof json.dotNum=='string'){
      if(!json.dotNum){
        return true;
      }
      dotNum = parseInt(json.dotNum);
    }else if(typeof json.dotNum=='number'){
      dotNum = json.dotNum;
    }
    if(!v){
      if(typeof v=='string'){
        return true;
      }
    }
    var str = v+'';
    var arr = str.split('.');
    if(arr.length>1){
      if(json.percentNum){//百分数校验
        if(arr[1].length>dotNum+2){
          return false;
        }else{
          return true;
        }
      }
      if(arr[1].length>dotNum){
        return false;
      }
    }
    return true;
  };
  /**
   * 数字的小数点后位数校验
   */
  Validator.dotNum = function(el,json){
    var v = $(el).val();
    return Validator.dotNum4value(v,json);
  };

  /**
   * 多选框 至少选择 多少项验证
   */
  Validator.checkedSizeGt4value = function(v,json){

    if(!json.checkedSizeGt){
      return true;
    }
    var gtLen = parseInt(json.checkedSizeGt);
    if(v){
      var arr = v.split(',');

      if(arr.length<gtLen){
        return false;
      }else{
        return true;
      }
    }else{
      if(!json.require){
        return true;
      }
      return false;
    }
  };
  /**
   * 多选框 至少选择 多少项验证
   */
  Validator.checkedSizeGt = function(el,json){

    if(!json.checkedSizeGt){
      return true;
    }
    var gtLen = parseInt(json.checkedSizeGt);
    var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
    if((!json.require)&&(checkedLen==0)){
      return true;
    }
    if(checkedLen<gtLen){ //小于 至少选择数 则返回false
      return false;
    }
    return true;
  };
  Validator.checkedSizeLt4value = function(v,json){
    if(!json.checkedSizeLt){
      return true;
    }
    if(!v){
      v = '';
    }
    var arr = v.split(',');

    var ltLen = parseInt(json.checkedSizeLt);
    if((!json.require)&&((!v) || arr.length==0)){
      return true;
    }
    if(arr.length>ltLen){ //大于 最多选择数 则返回false
      return false;
    }
    return true;
  };
  /**
   * 多选框 最多选择 多少项验证
   */
  Validator.checkedSizeLt = function(el,json){

    if(!json.checkedSizeLt){
      return true;
    }
    var ltLen = parseInt(json.checkedSizeLt);
    var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
    if((!json.require)&&checkedLen==0){
      return true;
    }
    if(checkedLen>ltLen){ //大于 最多选择数 则返回false
      return false;
    }
    return true;
  };
  /**
   * 多选框 恰好选择 多少项验证
   */
  Validator.checkedSizeEq = function(v,json){

    if(!json.checkedSizeEq){
      return true;
    }
    var eqLen = parseInt(json.checkedSizeEq);
    if(!v){
      v = '';
    }
    var arr = v.split(',');
    if((!json.require)&&((!v)||arr.length==0)){
      return true;
    }
    if(arr.length!=eqLen){ //不等于 配置的相等选择数 则返回false
      return false;
    }
    return true;
  };
  /**
   * 多选框 恰好选择 多少项验证
   */
  Validator.checkedSizeEq = function(el,json){

    if(!json.checkedSizeEq){
      return true;
    }
    var eqLen = parseInt(json.checkedSizeEq);
    var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
    if((!json.require)&&checkedLen==0){
      return true;
    }
    if(checkedLen!=eqLen){ //不等于 配置的相等选择数 则返回false
      return false;
    }
    return true;
  };

  /**
   * 手机验证码不能为空的校验
   * @param el
   * @param json
   */
  Validator.checkMsgCode = function(el,json){
    var v = $(el).val();
    return Validator.checkMsgCode4value(v,json);
  };
  /**
   * 验证码非空校验
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.checkMsgCode4value = function(v,json){
    if(json.checkMsgCode){
      if(!v){
        return false;
      }
    }
    return true;
  };
  /****
   * 指定范围的手机号码验证
   * @param el
   * @param json
   */
  Validator.cellphones = function(el,json){
    var v = $(el).val();
    return Validator.cellphones4value(v,json);
  };
  /**
   * 校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.cellphones4value = function(el,json){
    var v = $(el).val();
    var phones = json.cellphones;
    if(!phones){
      return true;
    }
    if(!v){ //如果配置了电话号码范围，却没有值则表示不在范围内
      return false;
    }
    var arr = $.trim(phones).split(',');
    for(var i= 0,len=arr.length;i<len;i++){
      if($.trim(arr[i]) == v){
        return true;
      }
    }
    return false;
  };
  /** 校验值是否在枚举值范围内****/
  Validator.enumData = function(el,json){
    var v = $(el).val();
    return Validator.enumData4value(v,json);
  };
  /***
   * 枚举项 校验 {enumData:[{value:1,display:'hello1'},{value:2,display:'hello2'}]}
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.enumData4value = function(v,json){
    var flag = true;
    if(typeof v =='undefined'){
      return flag;
    }
    if(typeof v =='string'){
      if(!v){
        return flag;
      }
    }
    if(!json.enumData){
      return flag;
    }

    var data = oui.parseJson(json.enumData);
    if(!data.length){
      return flag;
    }
    if(json.isMulti){//多个枚举值
      var vs = v.split(',');

      for(var i= 0,len=vs.length;i<len;i++){
        var one = null;
        one = oui.findOneFromArrayBy(data,function(item){
          if((item.value+'') == (vs[i]+'')){
            return true;
          }
        });
        if(!one){
          flag = false;
          return flag;
        }
      }
    }else{
      var one = oui.findOneFromArrayBy(data,function(item){
        if((item.value+'') == (v+'')){
          return true;
        }
      });
      if(!one){
        flag = false;
      }
    }

    return flag;
  };
  /**
   * 手机号码或邮箱的校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.emailOrPhone = function(el,json){
    var v = $(el).val();
    return Validator.emailOrPhone4value(v,json);
  };

  /**
   * 手机号码或邮箱的校验
   */
  Validator.emailOrPhone4value = function(v,json){
    if(!json.emailOrPhone){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (mobileReg.test(value) != true) {
      var arr = v.split(';');
      var flag=false;
      for(var i=0,len=arr.length;i<len;i++){
        if(!arr[i]){
          continue;
        }
        flag = emailReg.test(arr[i]);
        if(!flag){
          return false;
        }
      }
      return true;
    }
    return true;
  };

  /**
   * 6-18位纯数字校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.numberSixToEighteen = function(el,json){
    var v = $(el).val();
    return Validator.numberSixToEighteen4value(v,json);
  };

  var numberSixToEighteenReg = /^[0-9]{6,18}$/;

  /**
   * 6-18位纯数字校验
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.numberSixToEighteen4value = function(v,json){
    
    if(!json.numberSixToEighteen){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (numberSixToEighteenReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 6-18位数字加英文字母校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.numberAndEngSixToEighteen = function(el,json){
    var v = $(el).val();
    return Validator.numberAndEngSixToEighteen4value(v,json);
  };
  var numberAndEngSixToEighteenReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
  /**
   * 6-18位数字加英文字母校验
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.numberAndEngSixToEighteen4value = function(v,json){
    if(!json.numberAndEngSixToEighteen){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (numberAndEngSixToEighteenReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 密码为数字，大、小写字母，特殊符号至少包含三种，长度为8-18位
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombinations = function(el,json){
    var v = $(el).val();
    return Validator.passForThreeCombinations4value(v,json);
  };
  var passForThreeCombinationsReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,18}$/;
  /**
   * 密码为数字，大、小写字母，特殊符号至少包含三种，长度为8-18位
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombinations4value = function(v,json){
    if(!json.passForThreeCombinations){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passForThreeCombinationsReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passStartWithEng = function(el,json){
    var v = $(el).val();
    return Validator.passStartWithEng4value(v,json);
  };
  var passStartWithEngReg = /^[a-zA-Z]\w{6,18}$/;

  /**
   * 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passStartWithEng4value = function(v,json){
    if(!json.passStartWithEng){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passStartWithEngReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-18 之间
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithoutSpecChar = function(el,json){
    var v = $(el).val();
    return Validator.passForThreeCombWithoutSpecChar4value(v,json);
  };
  var passForThreeCombWithoutSpecCharReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,18}$/;
  /**
   * 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-18之间
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithoutSpecChar4value = function(v,json){
    if(!json.passForThreeCombWithoutSpecChar){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passForThreeCombWithoutSpecCharReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-18 之间
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithSpecChar = function(el,json){
    var v = $(el).val();
    return Validator.passForThreeCombWithSpecChar4value(v,json);
  };
  var passForThreeCombWithSpecCharReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/;
  /**
   * 必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-18之间
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithSpecChar4value = function(v,json){
    if(!json.passForThreeCombWithSpecChar){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passForThreeCombWithSpecCharReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 移动电话号码校验
   */
  Validator.phone = function(el,json){
    var v = $(el).val();
    return Validator.phone4value(v,json);
  };

  var mobileReg = /^1[3456789]\d{9}$/;
  /**
   * 移动电话号码校验
   */
  Validator.phone4value = function(v,json){
    if(!json.phone){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (mobileReg.test(value) != true) {
      return false;
    }
    return true;
  };
  // sixNumberAndEng sixNumber fourNumber
  /**
   * 6位数字及英文组合校验
   */
  Validator.sixNumberAndEng = function(el,json){
    var v = $(el).val();
    return Validator.sixNumberAndEng4value(v,json);
  };

  var sixNumberAndEngReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6}$/;
  /**
   * 6位数字及英文组合校验
   */
  Validator.sixNumberAndEng4value = function(v,json){
    if(!json.sixNumberAndEng){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (sixNumberAndEngReg.test(value) != true) {
      return false;
    }
    return true;
  };
  /**
   * 6位纯数字校验
   */
  Validator.sixNumber = function(el,json){
    var v = $(el).val();
    return Validator.sixNumber4value(v,json);
  };

  var sixNumberReg = /^[0-9]{6}$/;
  /**
   * 6位纯数字校验
   */
  Validator.sixNumber4value = function(v,json){
    if(!json.sixNumber){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (sixNumberReg.test(value) != true) {
      return false;
    }
    return true;
  };
  /**
   * 4位纯数字校验
   */
  Validator.fourNumber = function(el,json){
    var v = $(el).val();
    return Validator.fourNumber4value(v,json);
  };

  var fourNumberReg = /^[0-9]{4}$/;
  /**
   * 4位纯数字校验
   */
  Validator.fourNumber4value = function(v,json){
    if(!json.fourNumber){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (fourNumberReg.test(value) != true) {
      return false;
    }
    return true;
  };
  /*
     *  网址正则规则
     */
  var websiteReg = new RegExp("^(http|https)\\://(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])|([a-zA-Z0-9_\\-\\.])+\\.(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum|uk|me))((:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\\-\\._\\?\\,\\'/\\\\\\+&amp;%\\$#\\=~])*)$");

  /**
   * 网址校验
   */
  Validator.website = function(el,json){
    var v = $(el).val();
    return Validator.website4value(v,json);
  };
  /**
   * 网址校验
   *
   */
  Validator.website4value=function(v,json){
    if(!json.website){ //没配置网址校验
      return true;
    }
    if(!v){ // 没有必填，并且值为空不用校验
      return true;
    }

    if(!websiteReg.test(v)){ //网址的正则校验
      return false;
    }
    return true;
  };
  // var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
  var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  /**
   * email 校验
   */
  Validator.email = function(el,json){
    var v = $(el).val();
    return Validator.email4value(v,json);
  };
  /**
   * 校验email
   */
  Validator.email4value = function(v,json){
    if(!json.email){
      return true;
    }
    if(!v){
      return true;
    }
    var arr = v.split(';');
    var flag=false;
    for(var i=0,len=arr.length;i<len;i++){
      if(!arr[i]){
        continue;
      }
      flag = emailReg.test(arr[i]);
      if(!flag){
        return false;
      }
    }
    return true;
  };
  /**
   * 固定电话校验
   */
  Validator.tel =function(el,json){
    var v = $(el).val();
    return Validator.tel4value(v,json);
  };
  /**
   * 固定电话校验
   */
  Validator.tel4value = function(v,json){
    if(!v){
      return true;
    }
    if(!json.tel){
      return true;
    }
    var result=v.match(/\d{3}-\d{8}|\d{4}-\d{7}/);
    if(result==null){
      return false;
    }
    return true;
  };
  /**
   * 传真号码正则
   */
  var faxReg = /^(\d{3,4}-)?\d{7,8}$/;
  /**
   * 传真号码校验
   */
  Validator.fax = function(el,json){
    var v = $(el).val();
    return Validator.fax4value(v,json);
  };
  /**
   * 传真号码校验值
   */
  Validator.fax4value = function(v,json){
    if(!v){
      return true;
    }
    if(!json.fax){
      return true;
    }
    return faxReg.test(v);
  };

  function isDate(dateString){
    if(dateString.trim()=="")return true;
    //年月日正则表达式
    var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(r==null){
      return false;
    }
    var d=new Date(r[1],r[3]-1,r[4]);
    var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
    return (num!=0);
  }
  function isDateTime(dateString)
  {
    if(dateString.trim()=="")return true;
    var result=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if(result==null) return false;
    var d= new Date(result[1], result[3]-1, result[4], result[5], result[6], result[7]);
    return (d.getFullYear()==result[1]&&(d.getMonth()+1)==result[3]&&d.getDate()==result[4]&&d.getHours()==result[5]&&d.getMinutes()==result[6]&&d.getSeconds()==result[7]);
  }
  function isDateYMDhm(dateString){
    if(dateString.trim()=="")return true;
    var str = dateString+':01';
    if(isDateTime(str)){
      return true;
    }else{
      return false;
    }
  }
  function isDateYMDh(dateString){
    if(dateString.trim()=="")return true;
    var str = dateString+':01:01';
    if(isDateTime(str)){
      return true;
    }else{
      return false;
    }
  }
  function isDateYM(dateString){
    if(dateString.trim()=="")return true;
    var str= dateString+"-01";
    if(isDate(str)){
      return true;
    }else{
      return false;
    }
  }
  function isDateY(dateString){
    if(dateString.trim()=="")return true;
    var str= dateString+"-01-01";
    if(isDate(str)){
      return true;
    }else{
      return false;
    }
  }


  /** 日期年月日 时:分:秒 验证**/
  Validator.dateYMDhms =function(el,json){
    var v =$(el).val();
    return Validator.dateYMDhms4value(v,json);
  };
  Validator.dateYMDhms4value = function(v,json){
    var flag = true;
    if(!json.dateYMDhms){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateTime(v+'');
      }
    }
    return flag;
  };
  /** 日期年月日 时:分 验证**/
  Validator.dateYMDhm =function(el,json){
    var v =$(el).val();
    return Validator.dateYMDhm4value(v,json);
  };
  Validator.dateYMDhm4value = function(v,json){
    var flag = true;
    if(!json.dateYMDhm){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateYMDhm(v+'');
      }
    }
    return flag;
  };

  /** 日期年月日 时 验证**/
  Validator.dateYMDh =function(el,json){
    var v =$(el).val();
    return Validator.dateYMDh4value(v,json);
  };
  Validator.dateYMDh4value = function(v,json){
    var flag = true;
    if(!json.dateYMDh){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateYMDh(v+'');
      }
    }
    return flag;
  };
  /** 日期年月日 验证**/
  Validator.dateYMD =function(el,json){
    var v =$(el).val();
    return Validator.dateYMD4value(v,json);
  };
  Validator.dateYMD4value = function(v,json){
    var flag = true;
    if(!json.dateYMD){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDate(v+'');
      }
    }
    return flag;
  };
  /** 年月 校验****/
  Validator.dateYM =function(el,json){
    var v =$(el).val();
    return Validator.dateYM4value(v,json);
  };
  Validator.dateYM4value = function(v,json){
    var flag = true;
    if(!json.dateYM){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateYM(v+'');
      }
    }
    return flag;
  };
  /** 年 校验****/
  Validator.dateY =function(el,json){
    var v =$(el).val();
    return Validator.dateY4value(v,json);
  };
  Validator.dateY4value = function(v,json){
    var flag = true;
    if(!json.dateY){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateY(v+'');
      }
    }
    return flag;
  };
  /**
   *  整数：^-?\d+$
   非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$
   正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
   非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$
   负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
   浮点数 ^(-?\d+)(\.\d+)?$
   */
  /**
   * 数字校验
   */
  Validator.number = function(el,json){
    var v =$(el).val();
    return Validator.number4value(v,json);
  };
  /***
   * 是否为整数
   * @param v
   * @returns {boolean}
   */
  var intNumber = function(v){
    var intReg = /^-?\d+$/;
    var flag = true;
    if(typeof v !='undefined'){
      if(v+''){
        flag = intReg.test(v+'');
      }
    }
    return flag;
  };
  var floatNumber = function(v){
    var floatReg = /^(-?\d+)(\.\d+)?$/;
    var flag = true;
    if(typeof v !='undefined'){
      if(v+''){
        flag = floatReg.test(v+'');
      }
    }
    return flag;
  };
  Validator.number4value = function(v,json){
    var flag = true;
    if(!json.number){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = intNumber(v)||floatNumber(v);
      }
    }
    return flag;
  };
  /**
   * qq号码校验规则
   */
  var qqReg = /^[1-9][0-9]{4,9}$/;
  /**
   * qq号码校验
   */
  Validator.qq = function(el,json){
    var v =$(el).val();
    return Validator.qq4value(v,json);
  };
  Validator.qq4value = function(v,json){
    if(!v){
      return true;
    }
    if(!json.qq){
      return true;
    }
    return qqReg.test(v);
  };
  oui.$.Validator = Validator;

  /**
   * pc端 清除非数字输入
   */
  oui.clearNotNum4pc = function(event,obj,isInt,canNotMinus,maxLength,isNotFocus){
    event = window.event || event;
    if (event.keyCode == 37 | event.keyCode == 39) {
      return;
    }
    var lastPos = oui.getCurPos(obj);
    var t = obj.value.charAt(0);
    //先把非数字的都替换掉，除了数字和.
    obj.value = obj.value.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是.
    obj.value = obj.value.replace(/^\./g, "");
    //保证只有出现一个.而没有多个.
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //如果第一位是负号，则允许添加   如果不允许添加负号 可以把这块注释掉

    if(isInt&&obj.value){//如果只支持整数
      obj.value = ''+obj.value;
      if(obj.value.indexOf('.')>=0){
        obj.value = obj.value.substring(0,obj.value.indexOf('.'));
      }

    }

    if (t == '-'&&(!canNotMinus)) {//如果支持负数
      obj.value = '-' + obj.value;
    }
    var v =obj.value;
    var vLen =v.length;
    if(vLen>15){ //数字校验，长度不能超过15
      var hasMinus=false,isNotInt=false;
      if(v.indexOf('-')==0){
        vLen--;
        hasMinus=true;
      }
      if(v.indexOf('.')>0){
        vLen--;
        isNotInt=true;
      }
      if(vLen>15){
        var numLen=15;
        if(hasMinus&&isNotInt){
          numLen+=2;
        }else if(hasMinus || isNotInt){
          numLen+=1;
        }
        v = v.substring(0,numLen);
        obj.value = v;
      }
    }
    if(maxLength){
      obj.value  = obj.value.substring(0,maxLength);
    }
    oui.setCurPos(obj,lastPos,lastPos,isNotFocus);
  };
  /**
   * 清除不是数字的字符
   * @param obj
   * @param isInt
   * @param canNotMinus
   * @param maxLength
   * @param dotNum
   */
  oui.clearNoNum = function(obj,isInt,canNotMinus,maxLength,dotNum){
    var sIndex = -1;
    try {
      sIndex = obj.selectionStart;
    }catch (e){

    }

    if(obj.value.length <= 0) return;
    var fh='';
    if(obj.value.indexOf('-')==0){
      fh='-';
    }

    //先把非数字的都替换掉，除了数字和.
    obj.value = obj.value.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是.
    obj.value = obj.value.replace(/^\./g, "");
    //保证只有出现一个.而没有多个.
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    if(isInt&&obj.value){//如果只支持整数
      obj.value = ''+parseInt(obj.value);
      if(obj.value.indexOf('.')>=0){
        obj.value = obj.value.substring(0,obj.value.indexOf('.'));
      }
    }

    if (!canNotMinus) {//如果支持负数
      obj.value = fh + obj.value;
    }

    var vIndex = obj.value.indexOf(".");
    var toalLen = 15;
    dotNum = dotNum || 4;
    var v = obj.value;
    var _v = v.split(".")[0];
    var __v = v.split(".")[1];
    if (vIndex > -1) {
      for (var __len = dotNum; __len >= 0; __len--) {
        if (__v && __v.length >= __len) {
          var _len = toalLen - __len;

          if (_v.length >= _len) {
            _v = _v.substring(0, _len);
          }

          if (__v.length > 0) {
            v = _v + '.' + __v.substring(0, __len);
          }
          break;
        }
      }
    } else {
      if (_v.length > toalLen) {
        v = _v.substring(0, toalLen);
      }
    }
    obj.value = v;

    if(maxLength){
      obj.value  = obj.value.substring(0,maxLength);
    }

    if(sIndex > -1){
      try {
        obj.setSelectionRange(sIndex, sIndex);
      }catch (e){
      }
    }
  };

})(window);






!(function (window,$) {
  oui.TplTypeEnum = {
    artTemplate:{
      value:1,
      name:'artTemplate',
      /*****
       * 模板编译并返回artTemplate编译函数
       * @param tpl
       * @returns {*|*|*|*}
       */
      compile:function (tpl) {
        return template.compile(tpl);
      },
      beforeRender:function(control,el){

      },
      render:function(control){

      },
      afterRender:function(control){

      },
      /***
       *  根据控件和控件类 渲染模板返回html内容
       * @param control
       * @param clazz
       * @returns {*}
       */
      getHtml:function(control,clazz,right){
         if(right){
             return clazz._getHtml[right+control.attr('showType')](control.getMap());
         }else{
           var right = control.attr('right')||'';
           return clazz._getHtml[right+control.attr('showType')](control.getMap());
         }
      }
    },
    vue:{
      value:2,
      name:'vue',
      /******
       * vue组件直接返回div占位即可,在render渲染前产生vue对象缓存并进行dom绑定
       *
       * @param control
       * @param clazz
       */
      getHtml:function(control,clazz,right){
        var controlOuiId = control.attr('ouiId');
        return '<div v-id="'+controlOuiId+'"></div>';
      },

      compile:function (tpl) {
        return oui.Vue.compile(tpl);
      },
      /** vue引擎 控件渲染前处理****/
      beforeRender:function(control,el){
      },
      /** vue引擎 控件渲染处理,绑定控件的数据与vue模板****/
      render:function(control){
        var clazz = control.constructor;
        var right = control.attr('right')||"";
        var render = clazz._getHtml[right+control.attr('showType')]; //获取缓存的渲染模板
        var data = control.getMap();
        //控件属性, 事件,方法维护由开发组件的人员维护
        // 事件名,方法名,属性名相互不能重复
        var eventNames = control.findEventNames();//事件维护
        var methodNames =control.findMethodNames();//方法维护
        var names = eventNames.concat(methodNames);
        var methods ={
          //获取当前控件
          getControl:function () {
            var ouiId = this.ouiId;
            return oui.getByOuiId(ouiId);
          }
        };
        /** 便利方法名和事件名 动态创建 vue的方法绑定*****/
        oui.eachArray(names,function (item,index) {
          if(!control[item]){
            return;
          }
          var tempFun = function () {
            var funName = arguments.callee.__funName__;
            var currControl = this.getControl();
            currControl[funName].apply(currControl, arguments);
          };
          tempFun.__funName__ = item;
          methods[item] = tempFun;
        });
        if(control.vue){

          control.vue.$destroy && control.vue.$destroy();
          control.vue = null;

        }
        control.vue = new oui.Vue({
          el:$(control.getEl()).children()[0],
          data:data,
          // watch:{value:function () {
          //     console.log(this);
          // }},
          methods:methods,
          render:render.render
        });
      },
      /** vue引擎 控件渲染后处理****/
      afterRender:function(control){

      }
    },
    react:{
      value:3,
      name:'react',
      compile:function (tpl) {
        throw new Error('目前不支持React模板');
        return oui.React.compile(tpl);
      }
    }
    // TODO 其它模板框架在这里扩展
  };
  oui.findTplTypeEnumByValue = function(value){
    var tplTypes = oui.TplTypeEnum;
    for(var i in tplTypes){
      if(tplTypes[i] && ((tplTypes[i].value+'')==(value+''))){
        return tplTypes[i];
      }
    }
    return null;
  };
})(window,window.$$||window.$);





(function(win){
  var ctrl = oui.$.ctrl;
  var constant =oui.$.constant;
  var common_attrs = "id,name,type,cls,bindProp,style,data,showType,otherAttrs,onUpdate,onAfterUpdate,parentControlId,parentControlName,weakDependence,script4onChange,oui-controller";

  var common_events="onUpdate";
  var common_methods="render";
  /**
   * 抽象类定义
   */
  var Control = function(cfg) {
    var map ={
      isPc:(!oui.os.mobile),
      clickName:(!oui.os.mobile)?'onclick':'onTap',
      showType:"0"
    };//装所有控件属性
    //right :edit,readOnly,hidden,design
    this._map_ = map;
    this.getMap = getMap;//获取所有控件属性
    this.attr = attr;//暴露控件属性获取与设置的接口
    this.attr(cfg);//初始化构造参数
    this.eventNames = common_events;
    this.methodNames = common_methods;
    this.attrs =common_attrs;//控件公共属性列表
    this.getEl = getEl;//获取当前控件元素
    this.getHtml = getHtml;//暴露获取控件最终HTML的接口
    this.render = render;//渲染控件元素
    this.putElAttr2Control = putElAttr2Control;//根据对象属性列表设置当前控件属性缓存
    this.clear = clear; //清楚缓存对象
    this.triggerUpdate = triggerUpdate;
    this.triggerAfterUpdate = triggerAfterUpdate; //值改变 后执行事件 一般 失去焦点，下拉、单选 、多选 则是 triggerUpdate后执行
    this.hasChildrenControl = hasChildrenControl;//判断当前控件是否有子控件列表
    this.change4enumControl = change4enumControl; //下拉，单选，多选 枚举项改变后触发
    this.getView = getView;// 获取当前控件所属视图
    this.getSourceHtml = getSourceHtml; //获取原始代码中配置html内容
    this.getSourceHtmlEscape = getSourceHtmlEscape;//获取转义后的html
    this.getSourceHtmlEscapeRuntime = getSourceHtmlEscapeRuntime; //获取运行态源码
    this.filterEnumDataByParentControlValue = filterEnumDataByParentControlValue;// 过滤当前控件的待选项(根据父控件的值)
    this.findEventNames = findEventNames;
    this.findMethodNames = findMethodNames;
  };
  var getMap = function(){
    return this._map_;
  };
  var findEventNames = function () {
    var eventNames= this.eventNames;
    if(!eventNames){
      return [];
    }
    return eventNames.split(',');
  };
  var findMethodNames = function () {
    var methodNames= this.methodNames;
    if(!methodNames){
      return [];
    }
    return methodNames.split(',');
  };
  /***判断当前控件是否有子控件 **/
  var hasChildrenControl = function(){
    var id = this.attr('id');
    var name = this.attr('name');
    var flag = oui.hasChildrenControl(id) || oui.hasChildrenControl(name);
    if(!flag){
      var $Parser = oui.$.Parser;
      var ids = $Parser.ids||[];
      var curr = oui.findOneFromArrayBy(ids,function(ouiId){
        var curr = oui.getByOuiId(ouiId);
        if(curr){
          var parentControlId = curr.attr('parentControlId');
          var parentControlName = curr.attr('parentControlName');
          if( parentControlId&&(parentControlId ==id) ){
            $Parser.hasChildrenControlIdMap[id] = true;
            return true;
          }
          if( parentControlName&&(parentControlName ==name)){
            $Parser.hasChildrenControlNameMap[name] = true;
            return true;
          }
        }
      });
      if(curr){
        flag = true;
      }
    }
    return flag;
  };
  /*** 值改变时触发 枚举级联的控件渲染******/
  var change4enumControl = function(){
    var isEnumControl = this.isEnumControl;
    if(!isEnumControl){
      return ;
    }
    var id = this.attr('id');
    var value = this.attr('value');
    var name = this.attr('name');
    /**没有子控件则返回 **/
    if(!this.hasChildrenControl()){
      return ;
    }
    var controls = oui.getChildrenControlsById(id) ||[];
    var controls4name = oui.getChildrenControlsByName(name) ||[];
    controls = controls.concat(controls4name);
    //判断当前 枚举控件 是否在条件组件中
    var otherAttrs = this.attr('otherAttrs') ||'{}';
    otherAttrs = oui.parseJson(otherAttrs);
    /*** 单独处理 在条件组件中的 下拉、单选 等控件,清理非条件组件下的级联控件****/
    if(otherAttrs && otherAttrs.conditionOuiId){
      //在条件组件中，则进行 判断条件组件中的字段之间级联处理
      var tempControls = [];
      var conditionControl = oui.getByOuiId(otherAttrs.conditionOuiId);
      if(conditionControl && conditionControl.ouiGroupControl){
        var conditionEl = conditionControl.getEl();
        $(conditionEl).parent('li').parent('ul').children('li').each(function(){
          var $curr = $(this);
          if($curr.hasClass('group-condition-rules-or-li')){
            return;
          }
          var $currEl = $curr.children('div[ouiid]');
          if($currEl.length && $currEl.length ==1){
            var currConditionControl = oui.getByOuiId($currEl.attr('ouiId'));
            if(currConditionControl&& currConditionControl.getSelectedFieldControl){
              var currFieldControl = currConditionControl.getSelectedFieldControl();
              if(controls.indexOf(currFieldControl)>-1){
                tempControls.push(currFieldControl);
              }
            }
          }
        });
      }
      controls = tempControls;
    }else{
      /** 清理条件组件下的 级联控件****/
      var tempControls = [];
      for(var i= 0,len=controls.length;i<len;i++){
        if(controls[i]&&controls[i].attr){
          var tempOtherAttrs = oui.parseJson(controls[i].attr('otherAttrs')||"{}");
          if(!(tempOtherAttrs && tempOtherAttrs.conditionOuiId)){
            tempControls.push(controls[i]);
          }
        }
      }
      controls = tempControls;
    }
    var hasCurrIdx = controls.indexOf(this);
    if(hasCurrIdx>-1){
      //剔除 本对象，防止 循环触发调用
      controls.splice(hasCurrIdx,1);
    }
    /**没有子控件则返回 **/
    if(!controls.length){
      return ;
    }
    /** 遍历找出当前枚举项***/
    var data = this.attr('data');

    var idx=-1;
    var enumIds = []; //需要考虑多选场景
    var enumId = null;
    var valueArr = (value+'')?(value+'').split(','):[];
    var isMulti = valueArr.length>1;
    if(value+''){
      if(isMulti){
        for(var i= 0,len=data.length;i<len;i++){
          if((valueArr.indexOf(data[i].value+'')>-1) &&(data[i].id)){
            enumIds.push(data[i].id);
          }
        }
        /** 没找到则返回**/
        if(!enumIds.length){
          return ;
        }
      }else{
        for(var i= 0,len=data.length;i<len;i++){
          if((value+'') == (data[i].value+'')){
            idx = i;
            break;
          }
        }
        /** 没找到则返回**/
        if(idx == -1){
          return ;
        }
        /*** 没有枚举id则返回**/
        enumId = data[idx].id;
        if(!enumId){
          return ;
        }
      }


    }

    /** 循环处理子控件的data属性，根据原始的data数据进行遍历找出子枚举项，渲染对应的枚举项****/
    for(var i= 0,len=controls.length;i<len;i++){
      var oldData = controls[i].attr('oldData')||[];
      var chData = [];
      if(enumId || (enumIds&&enumIds.length)){
        for(var j= 0,chLen=oldData.length;j<chLen;j++){
          if(isMulti){
            if(enumIds.indexOf(oldData[j].parentId)>-1){
              chData.push(oldData[j]);
            }
          }else{
            if(enumId ==oldData[j].parentId){
              chData.push(oldData[j]);
            }
          }
        }
      }
      if(!(value+'')){
        //父枚举值为空，对弱依赖关系的处理
        /*** 如果值为空，强依赖 则进行强依赖枚举 枚举过滤****/
        if((!controls[i].attr('weakDependence')) || (controls[i].attr('weakDependence')=='false')){
          controls[i].attr('value','');
          controls[i].attr('data',chData);
        }else{
          //值不存在，如果是弱依赖，则需要显示原始枚举项
          controls[i].attr('value','');
          controls[i].attr('data',oldData);
        }
      }else{
        //值存在，则进行枚举过滤
        controls[i].attr('value','');
        controls[i].attr('data',chData);
      }

      controls[i].render();
      controls[i].triggerUpdate();
    }
  };
  /** 根据父控件过滤枚举控件 待选项*****/
  var filterEnumDataByParentControlValue = function(){
    var parentControlName = this.attr('parentControlName');
    var parentControlId = this.attr('parentControlId');
    var oldData = this.attr('oldData')||this.attr('data') ||[];
    var currParantControl;
    var parentControl;
    if(parentControlId){
      currParantControl = oui.getById(parentControlId);
      parentControl = currParantControl;
    }else if(parentControlName){
      var otherAttrs = this.attr('otherAttrs') ||'{}';
      otherAttrs = oui.parseJson(otherAttrs);
      /*** 单独处理 在条件组件中的 下拉、单选 等控件****/
      //判断是否在条件组件中，如果在条件组件中，则进行筛选；如果不在条件中则 根据name找单个控件
      if(otherAttrs && otherAttrs.conditionOuiId){
        var controls = oui.getManyByName(parentControlName);
        //存在多个同名情况的处理
        var tempControls = [];
        var conditionControl = oui.getByOuiId(otherAttrs.conditionOuiId);
        if(conditionControl && conditionControl.ouiGroupControl){
          var conditionEl = conditionControl.getEl();
          $(conditionEl).parent('li').parent('ul').children('li').each(function(){
            var $curr = $(this);
            if($curr.hasClass('group-condition-rules-or-li')){
              return;
            }
            var $currEl = $curr.children('div[ouiid]');
            if($currEl.length && $currEl.length ==1){
              var currConditionControl = oui.getByOuiId($currEl.attr('ouiId'));
              if(currConditionControl&& currConditionControl.getSelectedFieldControl){
                var currFieldControl = currConditionControl.getSelectedFieldControl();
                if(controls.indexOf(currFieldControl)>-1){
                  tempControls.push(currFieldControl);
                }
              }
            }
          });
        }
        controls = tempControls;
        if(controls && controls.length >=1){
          parentControl = controls[0];
        }
      }else{
        //需要 业务保证 name使用的唯一性,否则可能找到多个同名的依赖父控件
        parentControl = oui.getByName(parentControlName);
      }

      /** 父控件不存在 则直接返回原始数据**/
      if(!parentControl){
        return oldData;
      }
    }else{
      return oldData;
    }
    var chData = [];
    /** 遍历找出当前枚举项***/
    var data = parentControl.attr('data') ||[];
    var value = parentControl.attr('value') ||"";

    var valueArr = (value+'')?(value+'').split(',') : [];
    var isMulti = valueArr&&(valueArr.length>1);
    var idx=-1;
    var enumId = null;
    var enumIds = [];
    if(value+''){
      if(isMulti){
        //value存在 则进行过滤
        for(var i= 0,len=data.length;i<len;i++){
          if(valueArr.indexOf(data[i].value+'')>-1){
            enumIds.push(data[i].id);
          }
        }
        /** 没找到则返回**/
        if(!enumIds.length){
          return oldData;
        }
      }else{
        //value存在 则进行过滤
        for(var i= 0,len=data.length;i<len;i++){
          if((value+'') == (data[i].value+'')){
            idx = i;
            break;
          }
        }
        /** 没找到则返回**/
        if(idx == -1){
          return oldData;
        }
        /*** 没有枚举id则返回**/
        enumId = data[idx].id;
        if(!enumId){
          return oldData;
        }
      }


    }else{
      //值不存在，则进行判断是否弱依赖
      if((!this.attr('weakDependence')) || (this.attr('weakDependence')=='false')){
        //强依赖 返回 空数组
        return chData;
      }else{
        //弱依赖 返回 原数据
        return oldData;
      }
    }
    if(enumId || (enumIds && enumIds.length)){
      for(var j= 0,chLen=oldData.length;j<chLen;j++){
        if(isMulti){
          if(enumIds.indexOf(oldData[j].parentId)>-1){
            chData.push(oldData[j]);
          }
        }else{
          if(enumId ==oldData[j].parentId){
            chData.push(oldData[j]);
          }
        }

      }
    }
    return chData;
  };
  /** 获取当前控件所属视图****/
  var getView = function(){
    var el = this.getEl();
    var mvSelector ='.oui-class-ouiview';
    var $mv = $(el).closest(mvSelector);
    var view = null;
    if(($mv) && ($mv.length)){
      var ouiId = $mv.attr('ouiid');
      if(ouiId){
        view = oui.getByOuiId(ouiId);
      }
    }
    return view;
  };
  /**
   * 触发更新事件
   */
  var triggerUpdate = function(){
    var bindProp = this.attr('bindProp'); //数据绑定
    if(bindProp){
      var value = this.attr('value');
      var view = this.getView();
      if(view){
        var data = view.getData();
        var oldV = oui.JsonPathUtil.getJsonByPath(bindProp,data) || null; //当前内存中的值
        if(oldV !== value){
          oui.JsonPathUtil.setObjByPath(bindProp,data,value,true);
        }
      }else{
        var oldV = oui.JsonPathUtil.getJsonByPath(bindProp,window) || null; //当前内存中的值
        if(oldV !== value){
          oui.JsonPathUtil.setObjByPath(bindProp,window,value,true);
        }
      }
    }

    this.change4enumControl();
    var onUpdate = this.attr('onUpdate');
    if(onUpdate){
      var el = this.getEl();
      var controller = $(el).closest('[oui-controller]').attr('oui-controller');
      if(controller){
        controller = oui.parseJson(controller);
      }else{
        controller = window;
      }
      var onUpdates = [];
      if(typeof onUpdate =='string'){
        var arr =  onUpdate.split(',');
        for(var i= 0,len=arr.length;i<len;i++){
          var fun = $.trim(arr[i]);
          if(fun){
            if(fun.indexOf('\.')>0){//全路径的类方法指定
              var tempFun;
              try{
                tempFun = win.eval(fun);
              }catch(err){
              }
              if(tempFun)
                onUpdates.push(tempFun);
            }else{//
              var tempFun = (controller&&controller[fun]) || window[fun];
              if(tempFun){
                onUpdates.push(tempFun);
              }
            }
          }
        }
      }else if(onUpdate){
        onUpdates.push(onUpdate);
      }
      for(var i= 0,len=onUpdates.length;i<len;i++){
        onUpdates[i]&& onUpdates[i](this);
      }
    }

  };

  /**
   * 触发更新后事件，一般在 失去焦点 ，点击后执行
   */
  var triggerAfterUpdate = function(){
    var onAfterUpdate = this.attr('onAfterUpdate');
    if(onAfterUpdate){
      var onAfterUpdates = [];
      if(typeof onAfterUpdate =='string'){
        var arr =  onAfterUpdate.split(',');
        for(var i= 0,len=arr.length;i<len;i++){
          if($.trim(arr[i])){
            try {
              onAfterUpdates.push(win.eval($.trim(arr[i])));
            }catch (e){
              if (window.oui_context && oui_context.debug + '' === 'true') {
                console.error("onAfterUpdate配置错误" + e);
              }
            }
          }
        }
      }else if(onAfterUpdate){
        onAfterUpdates.push(onAfterUpdate);
      }
      for(var i= 0,len=onAfterUpdates.length;i<len;i++){
        onAfterUpdates[i]&& onAfterUpdates[i](this);
      }
    }

    //值改变事件
    var script4onChange = this.attr('script4onChange');
    if((typeof script4onChange !='undefined') && (script4onChange)){
      var script4onChangeFun =this.attr('script4onChangeFun');
      if(!script4onChangeFun){
        try{
          script4onChangeFun = oui.parseJson2Function(script4onChange);
          this.attr('script4onChangeFun',script4onChangeFun);
        }catch(e){
          oui.getTop().oui.alert('值改变触发脚本解析异常，请联系管理员，检查脚本错误：'+e);
          throw e;
        }
      }

      try{
        script4onChangeFun&&script4onChangeFun(this);//执行值改变事件
      }catch(e){
        oui.getTop().oui.alert('值改变触发脚本执行异常，请联系管理员，检查脚本错误：'+e);
        throw e;
      }
    }
  };
  /**
   * 清楚控件对象  map中的缓存对象
   */
  var clear = function(){
    var map = this.getMap();
    for(var i in map){
      map[i] = null;
      delete map[i];
    }
    for( var i in this){
      this[i] = null;
      delete this[i];
    }
  };
  /**
   * 根据控件对象、属性列表、元素设置控件对象的属性值
   * @param el
   */
  var putElAttr2Control = function(el) {
    if (!el) {return;}
    var arr = this.attrs.split(',');
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] == 'value') {continue;}// 在解析引擎中默认会解析value属性
      var v = '';
      if (arr[i] == 'cls') {v = $(el).attr("class");}
      else {v = $(el).attr(arr[i]);}

      if(v){
        this.getMap()[arr[i]] = v;
      }else{
        this.getMap()[arr[i]] = this.getMap()[arr[i]] || "";
      }
      // 解析元素属性，并设置到对象map中
    }
  };
  /**
   * 获取控件将渲染的html内容,可提供子类重写
   */

  var getHtml = function(){
    var h = "";
    var clazz = this.constructor;
    if(!clazz._getHtml){
      clazz._getHtml = {};
    }
    var tplTypeConfig  =clazz.tplTypeConfig||{};
    clazz.tplTypeConfig = tplTypeConfig;
    var tplType = tplTypeConfig[this.attr('showType')];
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;
    }
    if(!clazz._getHtml[this.attr('showType')]){
      var temp = clazz.templateHtml[this.attr('showType')];
      if(!temp){
        oui.log('控件类:'+clazz.FullName+' 中没有定义控件模板templateHtml属性');
        throw e ;
      }

      if(!tplType){
        throw  new Error(""+clazz.fullName+"模板类型没有指定,请联系前端控件维护人员");
      }
      if(!oui.TplTypeEnum[tplType]){
        throw  new Error(""+clazz.fullName+"模板类型不支持"+tplType+",请联系前端控件维护人员");
      }
      clazz._getHtml[this.attr('showType')] = oui.TplTypeEnum[tplType].compile(temp);//根据模板类型进行编译模板并缓存
    }
    var map = this.getMap();
    h = oui.TplTypeEnum[tplType].getHtml(this,clazz);

    var s = '<div ';

    if(map['oui-controller']){
      s+='oui-controller="'+map['oui-controller']+'" ';
    }
    s+= ('ouiId="'+map.ouiId+'" ');//ouiId定义
    s+= ('id="'+constant.controlIdPrefix+map.id+'" ');//id 定义
    s+= ('showType="'+map.showType+'" ');//showType 模板号
    if(map.style){ s+= ('style="'+map.style+'" '); } // 继承标签style定义
    var names = clazz.FullName.split('.');
    var controlName = names[names.length-1];
    var showTypeInCls = ' '+constant.controlClassNamePrefix+controlName;
    if(map.showType!=0){
      showTypeInCls +="-"+map.showType;
    }
    /***必填样式 ***/
    var require = oui.getJsonAttr(map,'validate.require');
    if(typeof require =='string'){
      if(require =='true'){
        require = true;
      }else{
        require = false;
      }
    }
    if(map.cls){
      if(require){
        s+= ('class="'+map.cls+showTypeInCls+' oui-require"');
      }else{
        s+= ('class="'+map.cls+showTypeInCls+'"');
      }

    }else{

      if(require){
        s+= ('class="'+showTypeInCls+' oui-require"');
      }else{
        s+= ('class="'+showTypeInCls+'"');
      }

    }// 继承标签 class定义
    s+='>';
    s+=h;
    s+='</div>';
    return s ;//根据对象返回html内容
  };
  /**
   * 获取当前控件对应的元素
   * @returns
   */
  var getEl = function(){
    var ouiId =this.attr(constant.ouiIdName);//获取当前元素
    return $("["+constant.ouiIdName+"='"+ouiId+"']")[0] || document.getElementById(this.attr('id'));
  };
  /**
   * 渲染当前控件对象的dom操作,
   * 可以由子类重写 实现对dom进行操作
   */
  var render = function(){
    var el = this.getEl();
    if(!el){return ;}
    var clazz = this.constructor;
    var config = clazz.tplTypeConfig||{};
    var showType = this.attr('showType');
    var tplType = config[showType];
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;
    }
    //if(!tplType){
    //  throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
    //}
    var tplTypeEnum = oui.TplTypeEnum[tplType];

    if(!tplTypeEnum){
      throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
    }
    tplTypeEnum.beforeRender&&tplTypeEnum.beforeRender(this,el);//模板引擎渲染前处理

    this.beforeRender&&this.beforeRender();//之前控件自身的渲染前处理
    var html = this.getHtml();
    el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
    el = null;
    tplTypeEnum.render&&tplTypeEnum.render(this);//特定模板引擎渲染处理
    tplTypeEnum.afterRender&&tplTypeEnum.afterRender(this);//特定模板引擎渲染后处理

    this.afterRender&&this.afterRender();//执行控件自身的后置渲染
  };
  /**
   * 获取或者设置对象属性值
   当输入参数有一个，如果参数类型为字符串；则返回该属性对应的值
   当输入参数有一个，如果参数类型为对象，则批量设置改对象的属性值
   当输入参数有两个,则设置对象的属性值
   * @param key
   * @param v
   */
  var attr = function(key,v){
    var len = arguments.length;
    if(len==1 && typeof key=='string'){//当输入参数有一个，如果参数类型为字符串；则返回该属性对应的值
      if(key =='value'){
        if(typeof this.getMap()[key]=='string'){
          return $.trim(this.getMap()[key]);
        }
      }
      return this.getMap()[key];
    }
    if(len==1 && typeof key=='object'){//当输入参数有一个，如果参数类型为对象，则批量设置改对象的属性值
      var o = key;
      for(var i in o){
        this.getMap()[i] = o[i];
      }
      return ;
    }
    if(len==2){//当输入参数有两个,则设置对象的属性值
      this.getMap()[key] = v;
    }
  };
  /** 获取原始代码的html内容**/
  var getSourceHtml = function(){
    return this.attr('sourceHtml');
  };
  /** 获取转义后的sourceHTML***/
  var getSourceHtmlEscape = function(){
    var s = this.attr('sourceHtml') ||'';
    var attrs = this.attrs;
    var keys = ['class'].concat(attrs.split(',')); // class默认没有在样式属性中
    var $s = $(s);
    var tag = $s[0].tagName.toLowerCase();
    var attrStrs = [];
    for(var i= 0,len=keys.length;i<len;i++){
      var key = keys[i];
      var v = $s.attr(key);

      if(v&&key){
        v = v.replace(/}}/g,' } } ').replace(/{{/g,' { { ');
        v = oui.escapeStringToHTML(v);//{{ }} 双层花括号是模板语法的特殊语法,不能有模板语法
        attrStrs.push(key+'="'+v+'"');
      }
    }
    var html ='<'+tag+' '+attrStrs.join(' ')+'>'+$s.html()+'</'+tag+'>';
    return html;
  };
  /** 获取当前控件运行态对应的源码****/
  var getSourceHtmlEscapeRuntime = function(){
    var s = this.attr('sourceHtml') ||'';
    var attrs = this.attrs;
    var keys = ['class'].concat(attrs.split(',')); // class默认没有在样式属性中
    var $s = $(s);
    var tag = $s[0].tagName.toLowerCase();
    var attrStrs = [];
    for(var i= 0,len=keys.length;i<len;i++){
      var key = keys[i];
      var v ='';
      if(key =='sourceHtml'){
        continue;
      }else if(key =='class'){
        v = $s.attr(key);
      }else{
        v = this.attr(key);
        if(typeof v =='object'){
          v = oui.parseString(v);
        }else if ((typeof v =='function') ||(v instanceof Function)){
          v = $s.attr(key);
        }else{
          v +='';
        }

      }
      if(v&&key){
        v = v.replace(/}}/g,' } } ').replace(/{{/g,' { { ');
        v = oui.escapeStringToHTML(v);//{{ }} 双层花括号是模板语法的特殊语法,不能有模板语法
        attrStrs.push(key+'="'+v+'"');
      }
    }
    var html ='<'+tag+' '+attrStrs.join(' ')+'>'+$s.html()+'</'+tag+'>';
    return html;
  };
  var _currProType = null;
  Control.getProtoType = function () {
    if (!_currProType) {
      _currProType = new Control({});
    }
    return _currProType;
  };
  /** 字段权限枚举
   *  hidden,invisible隐藏和不可见两种权限 控件不实现模板
   * *****/
  var FieldRightEnum={
    edit:{
      name:'edit',
      desc:'编辑',
      value:1
    }, //编辑
    view: {
      name:'readOnly',
      desc:'浏览',
      value:2
    },//浏览
    hidden:{
      name:'hidden',
      desc:'隐藏',
      value:3
    },//隐藏
    invisible:{
      name:'invisible',
      desc:'不可见',
      value:4
    },// 不可见
    edit4ReadOnly:{
      name:'edit4ReadOnly',
      desc:'编辑不可改',
      value:5
    },// 编辑不可改
    edit4View:{
      name:'edit4View',
      desc:'浏览可提交',
      value:6
    }//浏览可提交
  };
  oui.FieldRightEnum =FieldRightEnum;

  /** 创建控件类的模板 ****/
  /***
   *
   * @param ControlClz 指定控件类
   * @param right 指定权限模板
   * @param showType 指定模板编号
   * @param tempHtml 指定模板字符串内容
   * @param tplType 模板类型 ,参考 tpl-type.js ,TplTypeEnum{vue,react,artTemplate,...}中的name
   */
  Control.buildTemplate = function(ControlClz,right,showType,tempHtml,tplType){

    if(typeof right =='object'){
      showType = right.showType;
      tempHtml = right.tpl||'';
      tplType = right.tplType||'';
      right = right.right ||'';
    }
    if(typeof showType =='undefined'){
      showType =0;
    }else{
      if(!(showType+'')){
        showType=0;
      }
    }
    if(!right){
      right ='';
    }
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;//默认为artTemplate模板
    }
    if((right.indexOf(',')>0) || ((''+showType).indexOf(',')>0)){
      Control.buildBatchTemplate(ControlClz,right,showType,tempHtml,tplType);
    }else{
      if(!ControlClz.tplTypeConfig){
        ControlClz.tplTypeConfig = {};
      }
      ControlClz.tplTypeConfig[showType] = tplType;
      if(right == FieldRightEnum.edit.name){
        if(!ControlClz.templateHtml){
          ControlClz.templateHtml = [];
        }
        ControlClz.templateHtml[showType] = tempHtml;
      }else{
        if(!ControlClz['templateHtml4'+right]){
          ControlClz['templateHtml4'+right] = [];
        }
        ControlClz['templateHtml4'+right][showType] = tempHtml;
      }
    }
  };
  /** 批量创建模板，指定的模板引用相同时可以用批量创建模板*****/
  Control.buildBatchTemplate = function(ControlClz,right,showType,tempHtml,tplType){
    var rightArr = right.split(',');
    var showTypeArr = (''+showType).split(',');
    for(var i= 0,len=rightArr.length;i<len;i++){
      for(var j= 0,sLen=showTypeArr.length;j<sLen;j++){
        Control.buildTemplate(ControlClz,rightArr[i],showTypeArr[j],tempHtml,tplType);
      }
    }
  };
  ctrl['basecontrol'] = Control;//将抽象控件类放入到oui.$.ctrl命名空间下
})(window);






/**
 * 表单可输入控件value 和 data的定义
 * <p>
 * 控件数据存储格式如下：
 * <ul>
 * 		<li><b>单行文本框：</b>value={ "field_8eff0858" : "单行文本框数据" } data=无</li>
 * 		<li><b>多行文本框：</b>value={ "field_8eff0858" : "多行文本框数据" } data=无</li>
 * 		<li><b>电话号码(验证码)：</b>value={ "field_8eff0858" : "电话号码数据" } data={code:'验证码'}</li>
 * 		<li><b>数字：</b>value={ "field_8eff0858" : 12340 } data=无</li>
 * 		<li><b>隐藏框：</b>value={ "field_8eff0858" : "隐藏框数据" } data=无</li>
 * 		<li><b>下拉框：</b>value={ "field_8eff0858" : 1 } data={ "field_8eff0858" : { "display" : "选项1", "id" : "4849541620753999324", value : 1}}</li>
 * 		<li><b>单选框：</b>value={ "field_8eff0858" : 1 } data={ "field_8eff0858" : { "display" : "选项1", "id" : "4849541620753999324", value : 1}}</li>
 * 		<li><b>多选框：</b>value={ "field_8eff0858" : [1, 2] } data={ "field_8eff0858" : [{ "display" : "选项1", "id" : "4849541620753999324", "value" : 1}, { "display" : "选项2", "id" : "4849541620753999321", "value" : 2}]}</li
 * 		<li><b>日期：</b>value={ "field_8eff0858" : （注：DateTime类型) } data={ "field_8eff0858" : { "year" : 2016, "month" : 11, "day" : 11, "startTime" : 11231231231, "endTime" : 1143213123132, "showType" : ？} }</li>
 * 		<li><b>时间：</b>value={ "field_8eff0858" : 10200（注：时间为2：00，数据库存储整型） } data={ "field_8eff0858" : { "display" : "2:00" } }</li>
 * 		<li><b>插入图片：</b>value={ "field_8eff0858" : "4849541620753999324" } data={ "field_8eff0858" : [ { "display" : "图片1.jpg", "size" : 111, "id" : "4849541620753999324"} ]}</li>
 * 		<li><b>插入附件：</b>value={ "field_8eff0858" : "4849541620753999324" } data={ "field_8eff0858" : [ { "display" : "图片2.jpg", "size" : 111, "id" : "4849541620753999324"} ]}</li>
 * 		<li><b>图片组：</b>value=无 data=无</li>
 * 		<li><b>开关：</b>value=false（注：Boolean型） data=无</li>
 * 		<li><b>评分：</b>value=4 data=无</li>
 * 		<li><b>分割线：</b>value=无 data=无</li>
 * 		<li><b>文字说明：</b>value=无 data=无</li>
 * 		<li><b>分页：</b>value=无 data=无</li>
 * 		<li><b>地理位置：</b>value={ "field_8eff0858" : "四川省乐山市市中区科技大楼(柏杨东路)" } data={ "field_8eff0858" :  { "longitude" : "103.760546", "latitude" : "29.581702" }}</li>//TODO
 * 		<li><b>图片多选：</b>value={ "field_8eff0858" : [1, 2] } data={ "field_8eff0858" : [{ "display" : "", "value" : 1, "id" : "4849541620753999324"}] }</li>
 * 		<li><b>图片单选：</b>value={ "field_8eff0858" : 2 }  data={ "field_8eff0858" : { "display" : "", "value" : 2, "id" : "4849541620753999324"} }</li
 * 		<li><b>流水号：</b>value={ "field_8eff0858" : "规则12016_11_1100000" }  data=无</li>
 * 		<li><b>选人：</b>value={ "field_8eff0858" : "4849541620753999324" }  data={ "field_8eff0858" : [{"name" : "张三", "id": "4849541620753999324", "state" : 1, "openId" : "4849541620753999324", "typeFlag" : "person"}] }</li>
 * 		<li><b>选部门：</b>value={ "field_8eff0858" : "5918732553721390304" }  data={ "field_8eff0858" : [{"name" : "部门1", "id": "5918732553721390304", "state" : 1, "openId" : "5918732553721390304", "typeFlag" : "department"}] }</li>
 * 		<li><b>地址：</b>value={ "field_8eff0858" : "四川省 成都市 双流 正兴镇火石岩村3组"} data={ "field_8eff0858" : { "province" :{ "id": "123123", "value" : "123123", "display" : "213123"}, "city":{ "id" : "213123","value" : "213123", "display" : "1223123"}, "area":{ "id" : "213123", "value" : "w123123", "display" : "123123"}, info:"具体地址"}}</li>
 * 		<li><b>外部控件：</b>value={ "field_8eff0858" : 实际值  } data={}</li>

 * </ul>
 */
(function(win,$){
  var ctrl = oui.$.ctrl;
  var constant =oui.$.constant;
  var common_attrs = "id,name,type,title,cls,bindProp,style,fieldStyle,enable,value,right,showType,data,validate,isControlValidate,otherAttrs,containerId,onAfterChange,onUpdate,onAfterUpdate,parentControlId,parentControlName,weakDependence,relationEvent,hasRelationBtn,relationReadOnly,data4DB,calc,calcStr,script4readOnlyClick,script4onChange";//隐藏属性valueObj,解析formData时传入
  var BaseControl = ctrl.basecontrol;
  var common_events="onUpdate";
  var common_methods="render";
  /**
   * 抽象类定义
   */
  var OuiFormControl = function(cfg) {
    /** 表单控件的默认固定属性设置 */
    var map ={ //底层抽象公共属性
      showType:"0",
      allowInput:true,
      isControlValidate:false,//验证标签最终是否输出到最外层div元素上
      right:"edit"
    };
    /** 继承抽象类 BaseControl */
    BaseControl.call(this, $.extend(true,map,cfg)); //继承抽象类

    /**重写BaseControl中的属性和方法 ***/
    this.attrs =common_attrs;//控件公共属性列表
    this.eventNames = common_events;
    this.methodNames = common_methods;
    this.getHtml = getHtml;//暴露获取控件最终HTML的接口
    this.render = render;

    /** 表单类控件的属性 或者方法 **/
    this.attr('commonEvent',getCommonEvent(this.getMap())); //设置changeEvent属性
    this.setValue = setValue;
    this.setValueBefore = function(){};
    this.getValue = getValue;
    this.getDisplay= getDisplay;
    this.getData4DB = getData4DB;
    this.validate = validate;
    this.click4readOnly = click4readOnly;//浏览态的点击事件

  };
  var _renderControlCode =null;

  /** 浏览态点击事件****/
  var click4readOnly = function(){
    var otherAttrs = this.attr('otherAttrs');
    otherAttrs = oui.parseJson(otherAttrs||'{}');
    var script4readOnlyClick = otherAttrs.script4readOnlyClick ||this.attr('script4readOnlyClick');
    if((typeof script4readOnlyClick !='undefined') && (script4readOnlyClick)){
      var click4readOnlyFun =this.attr('click4readOnly');
      if(!click4readOnlyFun){
        try{
          click4readOnlyFun = oui.parseJson2Function(script4readOnlyClick);
          this.attr('click4readOnly',click4readOnlyFun);
        }catch(e){
          oui.getTop().oui.alert('浏览态点击触发脚本解析异常，请联系管理员，检查脚本错误：'+e);
          throw e;
        }
      }

      try{
        click4readOnlyFun&&click4readOnlyFun(this);//执行点击事件
      }catch(e){
        oui.getTop().oui.alert('浏览态点击触发脚本执行异常，请联系管理员，检查脚本错误：'+e);
        throw e;
      }
    }
  };
  var getControlCode = function(obj){
    if(!_renderControlCode){
      _renderControlCode = template.compile('validate="{{validate}}"');
    }
    return _renderControlCode(obj);

  };

  /**
   * 验证当前控件是否通过公共接口
   */
  var validate = function(){

    //var el = this.getEl();
    //return oui.validate(el);
    return true;
  };
  /**
   * 获取控件将渲染的html内容,可提供子类重写
   */

  var getHtml = function(){
    this.attr("commonEvent",getCommonEvent(this.getMap()));
    var right = this.attr('right')||'edit';
    var h = "";

    var clazz = this.constructor;
    if(!clazz._getHtml){
      clazz._getHtml = {};
    }
    var tplTypeConfig  =clazz.tplTypeConfig||{};
    clazz.tplTypeConfig = tplTypeConfig;
    var tplType = tplTypeConfig[this.attr('showType')];
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;
    }
    if(!tplType){
      throw  new Error(""+clazz.fullName+"模板类型没有指定,请联系前端控件维护人员");
    }
    if(!oui.TplTypeEnum[tplType]){
      throw  new Error(""+clazz.fullName+"模板类型不支持"+tplType+",请联系前端控件维护人员");
    }
    //规范要求 同一个showType在不同的权限下使用相同的 模板类型配置

    if(!clazz._getHtml[right+this.attr('showType')]){// 缓存编译函数
      var temp ='';
      if(right=='edit' || right=='design' || right=="preview"|| right=='disabled'){
        if(!clazz.templateHtml[this.attr('showType')]){
          oui.log('控件类:'+clazz.FullName+' 中没有定义控件模板templateHtml属性');
          throw e ;
        }
        temp = clazz.templateHtml[this.attr('showType')];
      }else{
        var temp = '';
        if(clazz['templateHtml4'+right]&&clazz['templateHtml4'+right][this.attr('showType')]){
          temp = clazz['templateHtml4'+right][this.attr('showType')];
        }
      }
      if(temp){
        clazz._getHtml[right+this.attr('showType')] =oui.TplTypeEnum[tplType].compile(temp); //编译模板并 缓存模板渲染函数
      }
    }
    var map = this.getMap();


    // || right=="preview" 预览可编辑 需要生成二维码数据
    if(right =='design' || right=='disabled'){

      var tempe = this.attr('commonEvent');
      this.attr('commonEvent',"");

      h = oui.TplTypeEnum[tplType].getHtml(this,clazz);
      this.attr('commonEvent',tempe);
    }else if(right =='edit'){
      h = oui.TplTypeEnum[tplType].getHtml(this,clazz);
    }else{

      if(this['getHtml4'+right]){ //如果存在自定义 right类型则根据right类型执行函数渲染对应状态
        h = this['getHtml4'+right]();
      }else if(clazz._getHtml[right+this.attr('showType')]){
        h = oui.TplTypeEnum[tplType].getHtml(this,clazz);
      }else if((right == oui.FieldRightEnum.view.name) || (right==oui.FieldRightEnum.edit4ReadOnly.name) || (right ==oui.FieldRightEnum.edit4View.name)){//只读状态只输出文本内容
        //对于浏览态的控件 1、如果传入了valueObj的display属性则显示控件内容
        //2、如果没有传入valueObj则使用默认value显示控件内容
        var vo = this.attr('valueObj');
        if(vo && vo.display){
          h= vo.display;
        }else{
          h = this.attr('value');
        }
        h = oui.escapeStringToHTML(h);
      }
    }
    //relationEvent,relationReadOnly
    var relationEvent = this.attr('relationEvent');
    /**判断是否显示 关联btn ****/
    var hasRelationBtn = this.attr('hasRelationBtn');
    var hasRelationBtnValue = false;
    if(hasRelationBtn ==='true'){
      hasRelationBtnValue = true;
    }else if(hasRelationBtn ==='false'){
      hasRelationBtn = false;
    }else if( hasRelationBtn && (typeof hasRelationBtn =='string')){
      try{
        var fun = eval(hasRelationBtn);
        if(fun){
          hasRelationBtnValue = fun(this);
        }
      }catch(e){
        hasRelationBtnValue = false;
      }
    }else if(typeof  hasRelationBtn =='function'){
      hasRelationBtnValue = hasRelationBtn(this);
    }

    //var relationReadOnly = this.attr('relationReadOnly');

    var s = '<div ';

    s+= ('ouiId="'+map.ouiId+'" ');//ouiId定义
    s+= ('id="'+constant.controlIdPrefix+map.id+'" ');//id 定义
    s+= ('type="'+map.type+'" ');//控件类型定义
    if(map.isControlValidate){

      s+=(getControlCode(map)+' ');//校验
    }
    s+= ('showType="'+map.showType+'" ');//showType 模板号
    if(map.style){ s+= ('style="'+map.style+'" '); } // 继承标签style定义
    var names = clazz.FullName.split('.');
    var controlName = names[names.length-1];
    var showTypeInCls =' '+constant.controlClassNamePrefix+controlName;
    if(map.showType!=0){
      showTypeInCls +="-"+map.showType;
    }
    /***必填样式 ***/
    var require = oui.getJsonAttr(map,'validate.require');
    if(typeof require =='string'){
      if(require =='true'){
        require = true;
      }else{
        require = false;
      }
    }
    if(map.cls){
      s+= ('class="'+map.cls+showTypeInCls+' oui-'+right+' ');  //编辑权限根据 配置csss样式控制
    }else{
      s+= ('class="'+showTypeInCls+' oui-'+right+' ');

    }// 继承标签 class定义

    if(require){
      s+=('oui-require'+' ');
    }
    if(hasRelationBtnValue ){
      s+='oui-relation-readOnly" ';
    }else{
      s+='" ';
    }
    s+='>';

    /*** 关联控件的模板处理  ***/
    if(hasRelationBtnValue){
      if(!clazz._getHtml['readOnly'+this.attr('showType')]){// 缓存编译函数
        var temp = '';
        if(clazz['templateHtml4'+'readOnly']&&clazz['templateHtml4'+'readOnly'][this.attr('showType')]){
          temp = clazz['templateHtml4'+'readOnly'][this.attr('showType')];
        }
        if(temp){

          clazz._getHtml['readOnly'+this.attr('showType')] = oui.TplTypeEnum[tplType].compile(temp); //编译模板并 缓存模板渲染函数
        }
      }

      if(!relationEvent){
        relationEvent="oui._noop";
      }
      var rehtml='';
      if(this['getHtml4readOnly']){ //如果存在自定义 right类型则根据right类型执行函数渲染对应状态
        rehtml = this['getHtml4readOnly']();
      }else if(clazz._getHtml['readOnly'+this.attr('showType')]){
        rehtml = oui.TplTypeEnum[tplType].getHtml(this,clazz,'readOnly');
      }else{
        //只读状态只输出文本内容
        //对于浏览态的控件 1、如果传入了valueObj的display属性则显示控件内容
        //2、如果没有传入valueObj则使用默认value显示控件内容
        var vo = this.attr('valueObj');
        if(vo && vo.display){
          rehtml= vo.display;
        }else{
          rehtml= this.attr('value');
        }
        rehtml = oui.escapeStringToHTML(rehtml);
      }
      s+='<input id="'+map.id+'" class="oui-form" name="'+map.name+'" validate="'+oui.escapeStringToHTML(map.validate||"")+'"  type="hidden" value="'+map.value+'"/>';
      if(oui.os.mobile){
        s+='<div class="oui-relation">'+rehtml+'</div><i class="oui-relation-icon" onTap="'+relationEvent+'(oui.getByOuiId('+map.ouiId+'));"></i>';
      }else{
        s+='<div class="oui-relation">'+rehtml+'</div><i class="oui-relation-icon" onclick="'+relationEvent+'(oui.getByOuiId('+map.ouiId+'));" ></i>';
      }
    }else{

      var script4readOnlyClick = oui.getJsonAttr(map.otherAttrs||{},'script4readOnlyClick')||map.script4readOnlyClick||"";
      if(script4readOnlyClick){//只读，可点击
        /* 只读 可点击事件元素追加div***/
        if((right == oui.FieldRightEnum.view.name) || (right==oui.FieldRightEnum.edit4ReadOnly.name) || (right ==oui.FieldRightEnum.edit4View.name)){
          h = '<div target-oui-id="'+map.ouiId+'" class="oui-'+oui.FieldRightEnum.view.name+'-canclick">'+h+'</div>';
        }
      }
      s+=h;

    }
    s+='</div>';
    return s ;//根据对象返回html内容
  };

  /**************************************************公共事件处理start******************************************************/

  /**
   * 基本控件值 改变事件 value同步到控件对象缓存中, validate验证配置
   */
  var commonEventTemplate='oninput="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" onpropertychange="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" onblur="oui.$.ctrl.ouiformcontrol.blur({{ouiId}},this);"';
  /**
   * 获取 值改变事件的绑定字符串
   */
  var getCommonEvent = function(cfg){
    if(!OuiFormControl._getCommonEventTemplate){
      OuiFormControl._getCommonEventTemplate = template.compile(commonEventTemplate);
    }
    return OuiFormControl._getCommonEventTemplate(cfg);
  };
  /**
   * 值改变事件触发 同步到控件对象缓存中
   */
  OuiFormControl.change = function(ouiId,el){
    var obj = oui.getByOuiId(ouiId);
    if(!obj){return ;}
    var lastV= obj.attr('value');
    var v = $(el).val();
    obj.attr('value',v);
    obj.triggerUpdate();
    obj.afterChange&&obj.afterChange(); // 如果子类控件对象上实现了afterChange 函数 则执行 缓存同步后置脚本
  };
  /**
   * 控件的焦点离开事件
   */
  OuiFormControl.blur = function(ouiId,el){
    var obj = oui.getByOuiId(ouiId);
    if(!obj){return ;}
    obj.blur&&obj.blur(); // 如果子类实现了blur方法，则执行
    obj.triggerUpdate&&obj.triggerUpdate();
    obj.triggerAfterUpdate && obj.triggerAfterUpdate();
    if(obj.attr&&obj.attr('onAfterChange')){
      eval(obj.attr('onAfterChange'));
    }
  };
  /**************************************************公共事件处理end******************************************************/
  /**
   * 改变值，执行控件渲染功能
   */
  var setValue = function(v,notTriggerUpdate){
    if(typeof v =='string' || typeof v === 'boolean' || typeof v === 'number'){
      this.attr("value",v);
    }else if(v){
      var value = v.value ||"";
      var data = v.data;
      var data4DB = v.data4DB;
      this.attr('value',value);
      this.attr('data',data);
      this.attr('data4DB',data4DB);
    }else{//空值
      this.attr('value','');
    }

    this.setValueBefore&&this.setValueBefore();
    this.render();
    if(!notTriggerUpdate){//默认执行 值改变后事件触发，如果用户配置了true，则不执行触发值改变后事件
      this.triggerAfterUpdate();
    }
  };

  /**
   * 获取控件的value值
   * @returns {*}
   */
  var getValue = function(){
    var v= this.attr('value');
    return v;
  };

  /**
   * 渲染当前控件对象的dom操作,
   * 可以由子类重写 实现对dom进行操作
   */
  var render = function(){
    var el = this.getEl();
    if(!el){return ;}
    var html = this.getHtml();

    var clazz = this.constructor;
    var config = clazz.tplTypeConfig||{};
    var showType = this.attr('showType');
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
    tplTypeEnum.beforeRender&&tplTypeEnum.beforeRender(this,el);//模板引擎渲染前处理
    this.beforeRender&&this.beforeRender();
    el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
    el = null;
    if(this.attr('right') =='design'){//设计期取消事件
      this.afterRender4Design && this.afterRender4Design();
      return ;
    }
    tplTypeEnum.render&&tplTypeEnum.render(this);//特定模板引擎渲染处理
    tplTypeEnum.afterRender&&tplTypeEnum.afterRender(this);//特定模板引擎渲染后处理
    this.afterRender&&this.afterRender();
  };
  /**
   * 获取显示属性
   */
  var getDisplay=function(){
    return '';
  };

  /**
   * 获取后端存储处数据
   * @returns {{}}
   */
  var getData4DB = function(){
    var data4DB = this.attr('data4DB');
    if(!data4DB){
      data4DB = {};
      this.attr('data4DB',data4DB);
    }else if(typeof data4DB =='string'){
      data4DB = oui.parseJson(data4DB);
      this.attr('data4DB',data4DB);
    }
    return data4DB;
  };
  var _currProType = null;
  OuiFormControl.getProtoType = function () {
    if (!_currProType) {
      _currProType = new OuiFormControl({});
    }
    return _currProType;
  };
  /** 创建模板方法 定义****/
  OuiFormControl.buildTemplate = function(ControlClz,right,showType,tpl,tplType){
    if(right&&(typeof right =='object')){
      showType = right.showType;
      tpl = right.tpl||'';
      tplType = right.tplType||'';
      right = right.right ||'';
    }
    if(!right){
      right ='edit';
    }
    BaseControl.buildTemplate(ControlClz,right,showType,tpl,tplType);
  };
  ctrl['ouiformcontrol'] = OuiFormControl;//将抽象控件类放入到oui.$.ctrl命名空间下

  var clickName = 'click';
  if(oui.os.mobile){
    clickName = 'tap';
  }
  //对浏览态的控件进行事件绑定
  var readOnlySelector = '.oui-'+oui.FieldRightEnum.view.name+'-canclick';
  $(document).on(clickName,readOnlySelector  ,function(e){
    var me = this;
    var ouiId = $(me).attr('target-oui-id');
    if(!ouiId){ //不是oui控件不做处理
      return;
    }
    var curr = oui.getByOuiId(ouiId);
    if((!curr) || (oui.isEmptyObject(curr))){ // 控件不存在不做处理
      return ;
    }
    me.disabled = 'disabled';
    $(me).addClass('submit-button-disabled');
    oui.bindTimer(function(){
      try{
        curr&&curr.click4readOnly&&curr.click4readOnly();
      }catch(err){
      }
      return true;
    },function(){
      $(me).removeAttr('disabled');
      $(me).removeClass('submit-button-disabled');
    },500);
  });

})(window,window.$$||window.$);






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

(function(){
	var Parser= oui.$.Parser;
	var constant =oui.$.constant;
	var ctrl = oui.$.ctrl ;//我们的框架-控件库命名空间
	if(!Parser.fn){
		Parser.fn = {};
	}
	Parser.fn.createControl = function(clz,cfg){
		var obj = new clz(cfg);// 1,new控件对象 2,初始化对象属性配置对象,基本函数set,get 3,初始化默认值 4,初始化构造参数 
		this.controlData[obj.attr(constant.ouiIdName)] = obj; //缓存控件对象
		this.ids.push(obj.attr(constant.ouiIdName));//缓存控件ID进入有序列表
		return obj;
	};
	Parser.fn.createByDom = function(el){
		/****************一、获取当前元素对象的class属性和控件类 *********************************************************/
		var id = $(el).attr("id");
		var controlClass = $(el).attr("type").toLowerCase(); // 获取控件的class配置,规范要求class配置的第一个为控件类
		var controlObj = ctrl[controlClass];//根据分割的数组，取最后一个元素,为控件类名;取oui.$.ctrl命名空间下的控件
		if (!controlObj) { //如果控件对应的类不存在则返回;
			oui.log('Parser.fn.createByDom, html代码中配置的 : type=' + controlClass + '没有对应的控件类');
			throw e;
		}
		var ouiId = Parser.getNewId();
		if((!id) ){
			id= "control_"+ouiId;
		}
		var cValue = Parser.formData[id] || $(el).attr("value") || $.trim($(el).html());
		/****************二、将控件的属性组装成对象,根据具体实现类由抽象类创建控件对象 *********************************************************/
		var valueObj = (typeof cValue == 'object') ? cValue : {};
		var v = (typeof cValue == 'object') ? cValue.value : cValue;
		var obj = Parser.createControl(//创建我们的控件对象
			controlObj, //控件具体实现类
			{
				ouiId: ouiId,// 为控件自增ouiId
				type: controlClass,
				valueObj: valueObj,
				value: v//需要为控件赋上的值
			},
			el);
		obj.attr('sourceHtml', el.outerHTML);
		return obj;
	};

	oui.createByDom = function(el){
		var control = Parser.fn.createByDom.call(Parser,el);
		return control;
	};

	oui.createByOuiHtml = function(ouiHtml){
		return oui.createByDom($(ouiHtml)[0]);
	};
	oui.create=function(cfg){
		
		if(!cfg){
			return;
		}
		var type=cfg['type'];
		if(!type){
			return;
		}
		var id=cfg['id'];
		var ouiId =cfg["ouiId"];
		if((!id) ||(!ouiId)){
			if(!ouiId){
				ouiId = oui.$.Parser.getNewId();
				cfg.ouiId =ouiId;
			}
			if(!id){
				id= "control_"+ouiId;
				cfg.id=id;
			}

		}
		var o=oui.$.ctrl[type];
		var obj=Parser.fn.createControl.call(Parser,o,{	
			id:id,
			ouiId : ouiId,
			type:type
		});
		obj.attr(cfg);
		return obj;
	};
	/**
	 * 根据ouiId 克隆 控件对象
	 * @param el
	 * @param before
	 * @param after
	 */
	oui.cloneByOuiId = function(el,before,after,filter){
		var ouiId = $(el).attr('ouiId');
		if(ouiId){
			var curr = oui.getByOuiId(ouiId);
			if(filter){
				var beforeFlag = filter(el,curr);
				if(typeof beforeFlag =='undefined'){

				}else if(!beforeFlag){
					return ;
				}
			}
			var map = curr.getMap();
			var json = oui.parseString(map);
			json = oui.parseJson(json);
			var cfg = $.extend(true,json,{ouiId:"",id:""});
			var cloneObj = oui.create(cfg);
			before&&before(cloneObj);
			var html = cloneObj.getHtml();
			el.outerHTML = html; // 由于当前控件通过 克隆创建的控件对象；还不存在dom对象，所以需要 强制渲染 outerHTML ，而不采用控件的render
			after&&after(cloneObj);
		}
	}
	/**
	 * 克隆页面中的控件
	 * @param $el
	 * @param before
	 * @param after
	 * @returns {*|jQuery}
	 */
	oui.cloneControl =function($el,before,after,filter){
		var $cloneEl = $($el).clone();
		$($cloneEl).each(function(){
			oui.cloneByOuiId(this,before,after,filter);
			$(this).find('div[ouiid]').each(function(){
				oui.cloneByOuiId(this,before,after,filter);
			});
		});
		$($el).after($cloneEl);
		$cloneEl = $($el).next();
		return $cloneEl;
	};

	/**
	 * 删除控件和元素
	 * @param $el
	 * @param before
	 * @param after
	 */
	oui.removeControl = function($el,filter){
		oui.eachControl4batch($el,function(el,curr){
		},function(el,curr){
			if(curr&& curr.attr){
				oui.clearByOuiId(curr.attr('ouiId'));
			}
			if(el){
				el.outerHTML = "";
				el = null;
			}
		},filter);

	};
	/**
	 * 遍历元素，并执行处理逻辑
	 * @param el
	 * @param before
	 * @param after
	 */
	oui.each4control = function(el,before,after,filter){

		var ouiId = $(el).attr('ouiId');
		var curr = null;
		if(ouiId){
			curr = oui.getByOuiId(ouiId);
		}
		if(filter){
			var beforeFlag = filter(el,curr);
			if(typeof beforeFlag =='undefined'){

			}else if(!beforeFlag){
				return ;
			}
		}
		before&&before(el,curr);
		after&&after(el,curr);
	};
	/**
	 * 遍历控件，执行逻辑
	 * @param $el
	 * @param fun
	 * @param after
	 */
	oui.eachControl4batch = function($el,fun,after,filter){
		$($el).each(function(){
			oui.each4control(this,fun,after,filter);
			$(this).find('div[ouiid]').each(function(){
				oui.each4control(this,fun,after,filter);
			});
		});
	}
})();





