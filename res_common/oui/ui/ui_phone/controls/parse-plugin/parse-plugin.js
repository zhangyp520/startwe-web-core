(function(){
	var Parser= oui.$.Parser;
	var constant =oui.$.constant;
	if(!Parser.fn){
		Parser.fn = {};
	}
	Parser.fn.createControl = function(clz,cfg){
		var obj = new clz(cfg);// 1,new控件对象 2,初始化对象属性配置对象,基本函数set,get 3,初始化默认值 4,初始化构造参数 
		this.controlData[obj.attr(constant.ouiIdName)] = obj; //缓存控件对象
		this.ids.push(obj.attr(constant.ouiIdName));//缓存控件ID进入有序列表
		return obj;
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





