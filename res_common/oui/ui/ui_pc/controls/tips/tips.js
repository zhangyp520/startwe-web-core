(function(win){
	/*******************************依赖的Js类 start***********************************************************/
	var ctrl = oui.$.ctrl;
	var Control = ctrl.basecontrol;
	var constant =oui.$.constant;
	/*******************************依赖的Js类 end************************************************************/
	/**
	 * 控件类构造器
	 */
	var Tips = function(cfg) {
		/***************************一 控件必须实现:控件继承call ****/
		Control.call(this,cfg);//必须继承控件超类
		/***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
		this.attrs = this.attrs+",content,isMenu";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		this.init = init;

		this.hide=hide;
		this.show=show;
		this.afterRender=afterRender;
		/***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/

	};
	ctrl["tips"] = Tips;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

	/*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
	Tips.FullName = "oui.$.ctrl.tips";//设置当前类全名 静态变量
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Tips.templateHtml=[];
	/*** tipsMenu菜单模板**************************/
	Tips.templateHtml4tipsMenu ='<div class="option-btn">'+
		'<dl>'+
		'{{each actions as item index}}'+
		'<dd onclick="oui.getByOuiId({{ouiId}}).getMap().actions[{{index}}].action({{index}});" class="{{item.cls||""}}">{{item.text}}</dd>'+
		'{{/each}}'+
		'</dl>'+
		'</div>';
	Tips.templateHtml[0] = '<div class="oui-tipbox" {{=events||""}} style="{{boxStyle}}">' +
	  '<span style="{{arrowStyle}}" ></span>'+
		 '{{if !isMenu}}'+
		'<div class="oui-tipbox-content" style="{{contentStyle}}">{{=content}}</div>'+
		'{{else}}'+
		'<div class="oui-tipbox-content" style="{{contentStyle}}">'+Tips.templateHtml4tipsMenu+'</div>'+
	'{{/if}}'+
     '</div>' ;
	Tips.templateHtml[1] = '<div class="oui-autotips" style="{{boxStyle}}">' +
	'{{=content}}'+
    '</div>' ;
    Tips.templateHtml[2] = Tips.templateHtml[1];


	/*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
	/*******************************控件类的自定义函数 start******************************************/
	/**
	 * 模拟控件类设计全局函数 plusClick
	 */
	 var init=function(){
	 };
	 var afterRender=function(){
	    oui.parse({container:this.getEl()});
		if((''+this.attr('showType'))=='1'){ //只对普通的tips有效，对于公共弹出的tips，然后默认两秒后消失的tips不执行
			return;
		}
		var clientWidth=document.body.scrollWidth;
         var clientHeight = document.documentElement.clientHeight;
		var el=this.getEl();


		var targetEl=this.attr("el");
		var width=$(el).width();

		var top =this.attr("top")||0;
		var left =this.attr("left")||0 ;

		if(typeof top =='string'){
			top=top.replace("px","");
			top=parseInt(top);
		}
		if(typeof left =='string'){
			left=left.replace("px","");
			left=parseInt(top);
		}
		var left=($(targetEl).offset().left+$(targetEl).width()/2-$(el).width()/2+left);
		var top=($(targetEl).height()+$(targetEl).offset().top+2+top);
		top-=15; //剔除padding
        var containerScrollTop =  this.attr('containerScrollTop');
        if(containerScrollTop&&containerScrollTop>0){
            top-= containerScrollTop;
        }
		if(left+width>clientWidth){
			var spanl=$(el).find("span").offset().left;
			var newspanl=spanl+left+width-clientWidth;
			$(el).find("span").css({left:newspanl+"px"});
			$(el).css({left:(clientWidth-width)+"px",top:top+"px"});
			$(el).find("span").css({"margin-left":0+"px"});
			this.attr('afterRender')&&this.attr('afterRender');
			return ;
		}
		if(left+width<width){
			var spanl=$(el).find("span").offset().left;
			var newspanl=spanl+left;
			left=0;
			$(el).find("span").css({left:newspanl+"px"});
			$(el).find("span").css({"margin-left":0+"px"});
			$(el).css({left:left+"px",top:top+"px"});
			this.attr('afterRender')&&this.attr('afterRender');
			return ;
		}

		$(el).css({left:left+"px",top:top+"px"});
		 $(el).removeClass('tips-padding-top');
		 $(el).removeClass('tips-padding-bottom');
		 var autoTop = this.attr("autoTop");
		 if(autoTop){
			 console.log('位置超出,top:'+top);
			 console.log('位置超出,元素高度:'+$(el).height());
			 console.log('位置超出,clientHeight:'+clientHeight)
			 if (top + $(el).height() > clientHeight) {
			     /** 适配纵向滚动条 适应外部传入滚动高度场景，实现自适应****/
                 var temp = 0;
                 if(containerScrollTop&&containerScrollTop>0){
                     temp = containerScrollTop;
                 }
                 $(el).css({top: ($(targetEl).offset().top - $(el).height()-temp) + "px"});
                 $(el).find("span").css({
                     "top": ($(el).height() - $(el).find("span").height() + 1) + "px",
                     "border":"0",
                     "border-bottom":"solid 1px #ccc",
                     "border-left":"solid 1px #ccc"
                 });
				 $(el).addClass('tips-padding-bottom');
			 }else{
				 $(el).addClass('tips-padding-top');
			 }
		 }else{
			 $(el).addClass('tips-padding-top');
		 }

		$(el).find("span").css({"margin-left":(-4)+"px"});


		this.attr('afterRender')&&this.attr('afterRender');

		this.attr("hidden",false);
	 };
	 var hide=function(){
		 var el=this.getEl();
		 $(el).hasClass("oui-tipbox-hide")?"":$(el).addClass("oui-tipbox-hide");
		 this.attr("hidden",true);

	 };
	 var show=function(cfg){
		 if(cfg){
			this.attr(cfg);
			this.render();
			this.attr("hidden",false);
			return;
		 }
		 var el=this.getEl();
		 $(el).hasClass("oui-tipbox-hide")?$(el).removeClass("oui-tipbox-hide"):"";
		 this.attr("hidden",false);

	 };
	 oui.getObjTips=function(option){
		var obj = oui.create({type:"tips" });
		obj.attr(option);
		$(document.body).append(obj.getHtml());
		obj.render();
		return obj;
	 };

	 /****
	  *option 配置参数如下{content:"",el:"所要显示的目标元素"，left:20,top:10,contentStyle:"background:red",arrowStyle:""}
	  */
	 oui.showTips=function(option){

		var obj=oui.getById('oui-tipbox-tips');
		var lastEl = null,el=null,currEl,lastHtml=null;
		var same=false;
		if(typeof option.singleton =='undefined' ){
			option.singleton = true;
		}
		if(!option.singleton){
			var obj=oui.getObjTips(option);
			return obj;
		}
		if(!obj){
			obj=oui.create({type:"tips",id:"oui-tipbox-tips"});
			if(!option){
				throw new Error('oui.showTips第一次调用必须传入配置参数');
				return ;
			}
			if(!option.el){
				throw new Error('oui.showTips第一次调用必须传入el元素参数');
				return ;
			}
			obj.attr(option);
			$(document.body).append(obj.getHtml());
		}else{
			if((!option.isMenu) && obj.attr('isMenu') ){
				obj.attr('isMenu',false);
				obj.attr('menus',null);
			}
			lastEl = obj.attr('el');
			lastHtml = obj.getHtml();
			option && obj.attr(option);
			currEl = obj.attr('el');
			if(currEl===lastEl && lastEl !=null){
				same = true;
			}
		}
		obj.attr("hidden",false);
		var lastBtn = Tips.tipsBtn;
		Tips.tipsBtn = obj.attr('el');
		Tips.tipsContainer = obj.getEl();
		Tips.tipObj = obj;
		Tips.isInTipsContainer = true;
		Tips.isInTipsBtn = true;
		var onShow = obj.attr('onShow');

		if(((same&&(!option.mustRender)) && (obj.getHtml() ==lastHtml)) ){
			if(lastBtn == Tips.tipsBtn){
				el = obj.getEl();
				(el&&$(el).hasClass("oui-tipbox-hide"))?$(el).removeClass("oui-tipbox-hide"):"";
				onShow&&onShow(obj,obj.attr('el'));

				return obj;
			}
		}
		obj.render();
		onShow&&onShow(obj,obj.attr('el'));
		return obj;
	 };
	 oui.hideTips=function(){
		 var ids =[];count=0;var els =[];
		 $('.oui-class-tips').each(function(){
			 var id = this.id;
			 if(id =='control_oui-tipbox-tips'){
				 ids.push(id);
				 count++;
			 }
			 if(count>1){
				 $(this).remove();
			 }
		});
		var obj=oui.getById('oui-tipbox-tips');
		if(!obj){
			 return;
		}
		obj.hide();
		var onHide = obj.attr('onHide');
		onHide&&onHide(obj,obj.attr('el'));
	 };
	 oui.getTips=function(){
		return oui.getById('oui-tipbox-tips');
	 };
	 /**
	  * showType=1,showType=2 自动弹出tips功能
	  */
	 var afterRender4auto = function(){
		if(this.attr('dialog')){
			var el = this.getEl();
			$(this.getEl()).css('z-index',600);
			var dialog = this.attr('dialog');
			var dialogEl = dialog.getEl();
			var header= $(dialogEl).find('.oui-dialog-hd')[0]
			var	 width = $($(dialogEl).find('.oui-dialog-area')[0]).width();
			var top = $(header).height()+$($(dialogEl).find('.oui-dialog-area')[0]).position().top;
			this.attr('top',top);
			$(el).css({'top': (top-$(header).height())+"px",width:width+"px"});
			$(el).css('left',"50%");
			$(el).css('margin-left',"-"+(width/2)+"px");

		}else if(this.attr('posEl')){ //指定显示位置的元素
			var el = this.getEl();
			$(this.getEl()).css('z-index',600);
			var posEl = this.attr('posEl');
			var	 width = $(posEl).width();
			var top = $(posEl).height()+$(posEl).position().top;
			this.attr('top',top);
			$(el).css({'top': (top-$(posEl).height())+"px",width:width+"px"});
			$(el).css('left',"50%");
			$(el).css('margin-left',"-"+(width/2)+"px");
		}else{
            var top = this.attr('top');
            if(typeof top !='number'){
                top = top ||50;
            }
			this.attr('top',top);
		}
		oui.getTop().oui.hideAutoTips();
	 };

	 Tips.afterRender4auto = afterRender4auto;
	 /**
	  * 隐藏自动显示tips
	  */
	 oui.hideAutoTips = function(){
		var obj = oui.getTop().oui.getById('oui-tipbox-auto');
		if(obj){
			var el = obj.getEl();
			var w = $(el).width();
			//if(true) return;
			var downTime=obj.attr('downTime')||500;
			var upTime=obj.attr('upTime')||1000;
			var waitTime=obj.attr('time') ||1500;

			$(el).animate({top:obj.attr('top')+"px",opacity:1},downTime,function(){
				if(obj.attr('interval')){
					window.clearInterval(obj.attr('interval'));
					obj.attr('interval',null);
				}
				var interval= window.setTimeout(function(){
					var upTop ='-35';
					if(obj.attr('dialog')&&obj.attr('dialog').getEl){
						var headerHeight = $(obj.attr('dialog').getEl()).find('.oui-dialog-hd').height();
						upTop = obj.attr('top')-headerHeight;

					}else if(obj.attr('posEl')){
						var posElHeight = $(obj.attr('posEl')).height();
						upTop = obj.attr('top')-posElHeight;
					}
					$(el).animate({top:upTop+'px',opacity:0},upTime,function(){
						obj.hide();
						obj.attr('interval',null);
						var callback = obj.attr('callback');
						callback&&callback();

					});
				},waitTime);
				obj.attr('interval',interval);
			})
		}
	 };
	 /***
	  * 显示自动弹出tips 1000毫秒后自动消失
      * cfg.top显示位置
	  */
	 oui.showAutoTips = function(cfg,time,callback){
		var waitTime=1500;
		if(typeof cfg =='string'){
			cfg = {content:cfg,time:time||waitTime,callback:callback||''};
		}
		if(cfg && (typeof cfg['time']=='undefined')){
			cfg['time']=waitTime;
		}
		var obj = oui.getTop().oui.getById('oui-tipbox-auto');
		 if(obj){
			 var tipEl = obj.getEl();
			 oui.getTop().oui.clearByContainer(obj.getEl());
			 oui.getTop().$(tipEl).remove();
		 }
		 obj= oui.getTop().oui.create({type:"tips",id:"oui-tipbox-auto",showType:1}); //自动弹出框
		 obj.afterRender = oui.getTop().oui.$.ctrl.tips.afterRender4auto;
		 obj.attr(cfg);
		 $(oui.getTop().document.body).append(obj.getHtml());
		 obj.afterRender();
		return obj;
	 };
	 /**
	 * 针对全局自动弹出的tips控件重写方法
	 * 获取当前控件对应的元素
	 * @returns
	 */
	var getEl = function(){
		var ouiId =this.attr(constant.ouiIdName);//获取当前元素
		return $(oui.getTop().document.body).find("["+constant.ouiIdName+"='"+ouiId+"']")[0] || oui.getTop().document.getElementById(this.attr('id'));
	};
	/**
	 *针对全局 自动弹出的tips控件重写方法
	 * 渲染当前控件对象的dom操作,
	 * 可以由子类重写 实现对dom进行操作
	 */
	var render = function(){
		var el = this.getEl();
		if(!el){return ;}
		var html = this.getHtml();
		el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
		el = null;
		if(this.attr('right') =='design'){//设计期取消事件
			return ;
		}
		this.afterRender&&this.afterRender();
	};


	/***绑定tips 移入和移除事件 **/
	var init4bindTips=function(){
		var _self = Tips;
		$(document).on('mouseover',function(e){

			if(oui.isInDom(e.target,_self.tipsContainer)  || (e.target == _self.tipsContainer)){
				_self.isInTipsContainer = true;
			}else{
				_self.isInTipsContainer = false;
			}
			if(e.target == _self.tipsBtn){
				_self.isInTipsBtn = true;
			}else{
				_self.isInTipsBtn = false;
			}
			window.setTimeout(function(){
				try{
					showOrHideTips();
				}catch(e){

				}
			},20);

		});
		$(document).on('mouseleave',function(e){
			if(e.target == _self.tipsContainer){
				_self.isInTipsContainer = false;
			}
			if(e.target == _self.tipsBtn){
				_self.isInTipsBtn = false;
			}
			window.setTimeout(function(){
				try{
					showOrHideTips();
				}catch(e){

				}
			},20);
		});
		$(document).on('mousedown',function(e){
			if((e.target != _self.tipsBtn) && (!oui.isInDom(e.target,$('.oui-class-tips'))) ){
				if(_self.currTipsMenu){
					_self.currTipsMenu.hide();
				}
				oui.hideTips();
				Tips.currTipsMenu = null;
				var obj =  oui.getTips();
				if(obj){
					var currEl = obj.getEl();
					oui.clearByContainer(obj.getEl());
					$(currEl).remove();
				}
			}
		});
	};
	/******* 显示或者隐藏 tips *****************/
	var showOrHideTips = function(){
		var _self = Tips;
		if(_self.isInTipsBtn || _self.isInTipsContainer){
			/** 显示tips****/

			if(_self.tipObj){
				if(!_self.tipObj.attr('leave4autoHide')){
					return ;
				}
				if(_self.tipObj.attr('hidden')){
					_self.tipObj.show();
					var onShow = _self.tipObj.attr("onShow");
					onShow&&onShow(_self.tipObj,_self.tipObj.attr('el'));
				}
			}
		}else{
			/*** 隐藏tips***********/
			if(_self.tipObj){
				if(!_self.tipObj.attr('leave4autoHide')){
					return ;
				}
				_self.tipObj.hide();
				var onHide = _self.tipObj.attr("onHide");
				onHide&&onHide(_self.tipObj,_self.tipObj.attr('el'));
			}
		}
	};
	init4bindTips();
	/**指定元素位置显示Tips菜单
	 * {el,onHide,onShow,actions:[{id,cls,action:function(){}}]}
	 * */
	oui.showTipsMenu = function(cfg){

		var options ={
			el: cfg.el,
			isMenu:true,
			cls:cfg.cls||"oui-class-tips",//支持外层样式扩展
			actions:cfg.actions||[],
			autoTop:true,//当到底部时，自动倒立显示tips
			leave4autoHide:false,
            containerScrollTop:cfg.containerScrollTop,
			onHide:function(tipObj,btnEl){
				/**active **/
				//$(btnEl).parent().removeClass('active');
				cfg.onHide&&cfg.onHide(tipObj,btnEl);
			},
			onShow:function(tipObj,btnEl){
				//if(!$(btnEl).parent().hasClass('active')){
				//	$(btnEl).parent().addClass('active');
				//}
				cfg.onShow&&cfg.onShow(tipObj,btnEl);
			}
		};
		Tips.currTipsMenu = oui.showTips(options);
		return Tips.currTipsMenu;
	};
	/*******************************控件类的自定义函数 end******************************************/
})(window);





