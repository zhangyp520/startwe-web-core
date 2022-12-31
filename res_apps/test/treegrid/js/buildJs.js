	var build_time = (function(){
		new Date().getTime();
		var d = new Date();
		t = d.getFullYear()+''+(d.getMonth()+1)+''+d.getDate()+''+d.getHours();
		return t;
	})();
	
	/**
		 * 获取上下文
		 */
	function getContextPath(){
		
		if(window.ours_context && window.ours_context.contextPath){
			return window.ours_context.contextPath
		}
		
		var pathName = document.location.pathname;
		var index = pathName.substr(1).indexOf("/");
		var result = pathName.substr(0, index + 1) + "/";
		if(result =='/res_common/' || result =='/res_apps/'){//获取的第一个目录路径与 公共路径相同则根路径为/
			result = '/';
		}
		if(typeof window.ours_context =='undefined'){
			window.ours_context = {contextPath:''};
		}
		window.ours_context.contextPath = result;
		return result;
	}
	var loadConfig ={loadedAll:false,newId:0};
	function getNewTagId(){
		loadConfig.newId ++;
		return loadConfig.newId;
	}
	function load4sort(arr,callback){
		loadConfig.loadedAll = false; //没有加载完毕
		if(arr.length==0){
			callback();
			return ;
		}
		var runArr = [];
		var next = function(){
			var idx = this.idx;
			var len = this.len;
			runArr[idx+1].run();
		}
		var run = function(){
			var idx= this.idx;
			var len = this.len;
			if(idx==len-1){
				loadArr([this.url],function(){
					callback();	
				});
				
			}else{
				var me = this;
				loadArr([this.url],function(){
					me.next();
				});
			}
		}
		for(var i=0,len=arr.length;i<len;i++){
			runArr.push({
				url:arr[i],
				idx:i,
				len:len,
				next:next,
				run: run
			});
		}
		runArr[0].run();
	}

	/**
	 * 加载js列表资源
	 */
	function loadArr(arr,callback){
		var idPrefix = 'script_';
		var contextPath = getContextPath();
		
		for(var i=0,len=arr.length;i<len;i++){
			var currNewId = idPrefix+getNewTagId();
			loadConfig[currNewId] = {loaded:false};
			loadJs(currNewId,contextPath+arr[i],function(){
				var sid = this.getAttribute('id');
				loadConfig[sid].loaded = true;
				
				if(!callback){
					return ;
				}
				if(loadConfig.loadedAll){
					return ;
				}
				var flag = true;
				for(var k in loadConfig){
					if(k =='loadedAll' || k =='newId'){
						continue;
					}
					if(!loadConfig[k].loaded){
						flag  = false;
					}
				}
				if(flag){
					loadConfig.loadedAll = true;
					callback();
				}
			});
		}
	}
	/**
	 * 加载 js资源
	 */
	function loadJs(sid,jsurl,callback){
		loadConfig.loadedAll = false; //没有加载完毕
		var nodeHead = document.getElementsByTagName('head')[0];
		var nodeScript = null;
		if(jsurl&&jsurl.indexOf('?')>0){
			jsurl+= ('&_t='+build_time);
		}else{
			jsurl+=('?_t='+build_time);
		
		}
		if(document.getElementById(sid) == null){
			nodeScript = document.createElement('script');
			nodeScript.setAttribute('type', 'text/javascript');
			nodeScript.setAttribute('src', jsurl);
			nodeScript.setAttribute('id',sid);
			if (callback != null) {
				nodeScript.onload = nodeScript.onreadystatechange = function(){
					if (nodeScript.ready) {
						return false;
					}
					if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
						nodeScript.ready = true;
						callback.call(nodeScript);
					}
				};
			}
			nodeHead.appendChild(nodeScript);
		} else {
			if(callback != null){
				callback.call(document.getElementById(sid));
			}
		}
	};
	var console = (typeof window['console']=='undefined') ?{
		log:function(){}
	}:window.console;
	