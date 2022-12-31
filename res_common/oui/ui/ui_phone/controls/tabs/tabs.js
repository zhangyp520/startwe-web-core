(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.basecontrol;
	//控件构造器
	var Tabs = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
		this.attrs = this.attrs+",activeTabId,marginLeft";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		this.init = init;
		this.setData = setData;
		this.getActiveTab = getActiveTab;
		this.render = render;
		this.afterRender = afterRender;
		this.lastTab = lastTab;
		this.nextTab = nextTab;
		this.getPos = getPos;
		this.getMarginLeftByPos = getMarginLeftByPos;
		this.active = active;
	};
	Tabs.FullName = "oui.$.ctrl.tabs";//设置当前类全名
	ctrl["tabs"] = Tabs;//将控件类指定到特定命名空间下	
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Tabs.templateHtml=[]; 
	
	Tabs.templateHtml[0] ='<div id="{{id}}" class="oui-tabs" > '+
	'<div class="oui-tabs-head" targetOuiId="{{ouiId}}" style="height:30px;line-height:30px;overflow:hidden;margin-left:{{marginLeft}}px;position:relative">'+
	'<div class="oui-tabs-active" style="position:absolute;top:{{activeTop}}px;left:{{activeLeft}}px;height:{{activeHeight}}px;width:{{activeWidth}}px;border-radius:{{activeHeight/2}}px;background-color:lightblue;z-index:-1"></div>'+
	'{{each data as item index}}'+ 
	'<span class="oui-tabs-title" targetOuiId="{{ouiId}}" targetTabId="{{item.id}}"  > {{item.title}} '+
	'</span>'+
	'{{/each}}'+
	'</div>'+
	'<div class="oui-tabs-content oui-animated {{animateClass||""}}" targetOuiId="{{ouiId}}">{{=content}}</div>'+
	' </div>' ;
	/************************************控件初始化init **************************/
	var init =function(){ //解析属性和容器结构
		//var d = this.attr("data");
		
		var el = document.getElementById(this.attr('id'));
		var data = [];
		var idx =0;
		$(el).children().each(function(){
			var currData ={};
			var attrs = ($(this).attr("attrs") ||"").split(",");
			for(var i=0,len=attrs.length;i<len;i++){
				currData[attrs[i]] = $(this).attr(attrs[i]) ||"";
			}
			data.push({
				idx:(idx++),
				id:$(this).attr("id"),
				title:$(this).attr("title"),
				_render:template.compile($(this).html()),
				data:currData,
				getHtml:function(){
					return this._render(this.data);
				}
			});
		});
		
		if(!this.attr('marginLeft')){
			this.attr('marginLeft',0);
		}else	if(typeof this.attr('marginLeft') =='string'){
			this.attr('marginLeft',parseInt(this.attr('marginLeft')));
		}
		this.attr('data',data);
		var ac=this.getActiveTab();
		var h = (ac && ac.getHtml)?ac.getHtml():"";
		this.attr('content',h);		
	};
	/***********************************控件事件***********************************/
	var setData = function(data){
		this.attr('data',data);
		this.render();
	}; 
	/**
	 * 获取活动状态的tab页
 	 */
	 
	var getActiveTab = function(){
		var activeTabId = this.attr('activeTabId');	
		var d = this.attr('data') ||[];
		if(!activeTabId){
			return d[0];
		}
		for(var i=0,len=d.length;i<len;i++){
			if(d[i].id== activeTabId){
				return d[i];
			}
		}
		return null;
	}
	/**
	 * 渲染当前控件对象的dom操作,
	 * 可以由子类重写 实现对dom进行操作
	 */
	var render = function(){
		var el = this.getEl();
		if(!el){return ;}
		//var hammer =$(el).find('.oui-tabs-content').data("hammer");
		var hammer =$(el).data("hammer");
		hammer&&hammer.destroy();  
		var thammer= $(el).find('.oui-tabs-title').data('hammer');
		thammer&&thammer.destroy(); 
		var html = this.getHtml();
		el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
		el = null;
		this.afterRender();
	}; 
	var lastTab = function(){
		var tab = this.getActiveTab();
		if((!tab) || tab.idx<0){
			return null;
		}
		var d = this.attr('data');
		if(d && d[tab.idx-1]){
			return d[tab.idx-1];
		}
		return null;
		
	};

	var nextTab = function(){
		var tab = this.getActiveTab();
		
		var d = this.attr('data');
		if(!tab ){
			return null;
		} 
		if(!d){
			return null;
		}
		if(tab.idx>d.length-1){
			return null;
		}
		if(d[tab.idx+1]){
			return d[tab.idx+1];
		}
		return null;
	}
	/**
	 * 获取活动页签的距离左侧的位置
	 */
	var getPos = function(){
		var d = this.attr('data');
		var tab = this.getActiveTab();
		var w =0;
		for(var i=0;i<=tab.idx;i++){
			w+=d[i].width;
		}
		return w;
	};
	/**
	 * 获取当前活动页签的margin-left值
	 */
	var getMarginLeftByPos = function(pos){
		if(typeof pos =='undefined'){
			pos = this.getPos();
		}
		var mleft = this.attr('headerWidth')/2-pos;
		if(mleft>0 || this.attr('maxWidth')<=this.attr('headerWidth')){
			mleft =0;
			return mleft;
		}
		var maxleft =this.attr('headerWidth')/2-this.attr('maxWidth');
		var d = this.attr('data');
		var w = d&&d[d.length-1]?d[d.length-1].width:0;
		if((mleft-maxleft+w )< (this.attr('headerWidth')/2) ){
			mleft =	maxleft-w+this.attr('headerWidth')/2;
		}
		return mleft;
	}
	/**
	 *  渲染指定页签
	 */
	var active = function(actId){
		this.attr('activeTabId',actId);
		var tab = this.getActiveTab();
		this.attr('marginLeft',this.getMarginLeftByPos());
		this.attr('content',(tab && tab.getHtml) ?tab.getHtml():"");	
		this.render();
	};  
 
	var afterRender = function(){
		var el = this.getEl();
		var fun = this.attr("changeWidthFun");
		var idx = OrientaionFuns.indexOf(fun);
		if(fun && idx>=0){
			OrientaionFuns.splice(idx,1);
			fun=null;
			delete fun;
		}
		var me = this;
		this.attr("changeWidthFun",function(){
			var headerWidth = $(el).find('.oui-tabs-head').width()+this.attr("marginLeft");
			var maxWidth=0;
			var data = this.attr("data");
			$(data).each(function (){
				this.width= $('[targetTabId='+this.id+']').width();
				maxWidth+= this.width;
			});
			this.attr('headerWidth',headerWidth);
			this.attr('maxWidth',maxWidth);
			this.attr('marginLeft',this.getMarginLeftByPos());
			$(el).find('.oui-tabs-head').css('margin-left',this.attr('marginLeft')+"px");//默认只执行一次
		}); 
		OrientaionFuns.push(this.attr("changeWidthFun"));
		this.attr("changeWidthFun").source = this;
		
		$(el).find("oui-control").each(function(){
			oui.parseByDom(this);
		});  
		var data = this.attr("data");
		if(!this.attr('headerWidth')){ //init headerWidth maxWidth 在对象创建后只执行一次计算
			var headerWidth = $(el).find('.oui-tabs-head').width();
			var maxWidth=0;
			$(data).each(function (){
				this.width= $('[targetTabId='+this.id+']').width();
				maxWidth+= this.width;
			});
			this.attr('headerWidth',headerWidth);
			this.attr('maxWidth',maxWidth);
			this.attr('marginLeft',this.getMarginLeftByPos());
			$(el).find('.oui-tabs-head').css('margin-left',this.attr('marginLeft')+"px");//默认只执行一次
			 
			
		}
		var tab = this.getActiveTab();
		if(tab){
				var $tabspan =$(el).find('[targetTabId='+tab.id+']');
				 
				var pos = $tabspan.position();
				this.attr("activeWidth",$tabspan.width());
				this.attr("activeHeight",$tabspan.height()); 
				this.attr("activeLeft",pos.left);
				this.attr("activeTop",pos.top);
				$(el).find('.oui-tabs-active').animate({
					'top':pos.top,
					'left':pos.left,
					'width':this.attr('activeWidth'),
					'height':this.attr('activeHeight'),
					'border-radius':this.attr('activeHeight')/2
				});//默认只执行一次 
				
				
	
		} 
		$(el).find('.oui-tabs-title').hammer().on("tap",function(e){
			var targetTabId = $(this).attr('targetTabId');
			var ouiId = $(this).attr("targetOuiId");
			var obj = oui.getByOuiId(ouiId);
			if(!obj){
				return;
			} 
			obj.attr('animateClass','oui-inRight'); 
			obj.active(targetTabId);
		
		}); 
		//$(el).find(".oui-tabs-content").hammer()
		$(el).hammer().on('panleft',function(e){
			if(e.target!==this){
				return ;
			}
			var ouiId = $(this).attr('ouiId');
			var obj = oui.getByOuiId(ouiId); 
			var lastTab = obj.lastTab(); 
			if(!lastTab){
				var d =obj.attr('data');
				if(d && d.length>0){
					lastTab = d[d.length-1];
					 
				}else{ 
					return ;
				}
				
			}
			obj.attr('animateClass','oui-inRight'); 
			$(this).find('.oui-tabs-content').removeClass("oui-animated oui-out").addClass("oui-animated oui-out");
			window.setTimeout(function(){
				obj.active(lastTab.id); 
			},10);
			/*$(this).find('.oui-tabs-content').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				obj.active(lastTab.id); 
			}).addClass("oui-animated oui-out");*/
			
			//obj.active(lastTab.id); 
			
		}).on('panright',function(e){ 
			if(e.target!==this){
				return ;
			}
			var ouiId = $(this).attr('ouiId');
			var obj = oui.getByOuiId(ouiId); 
			var nextTab = obj.nextTab();
			
			if(!nextTab){
				var d =obj.attr('data');
				if(d && d.length>0){
					nextTab = d[0];
					 
				}else{
					return ;
				}
			}
			obj.attr('animateClass','oui-inLeft');
			$(this).find('.oui-tabs-content').removeClass("oui-animated oui-out").addClass("oui-animated oui-out");
			window.setTimeout(function(){
				obj.active(nextTab.id); 
			},10);
			/*$(this).find('.oui-tabs-content').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				obj.active(nextTab.id); 
			}).addClass("oui-animated oui-out");
			*/
			//obj.active(nextTab.id); 
		}) 
		.on('panend',function(e){
			var ouiId = $(this).attr('targetOuiId');
			var obj = oui.getByOuiId(ouiId);
			
		}); 
	};
	
	var OrientaionFuns = [];	
	$(window).on('orientationchange resize', function() {
		window.setTimeout(function(){  
			for(var i=0,len=OrientaionFuns.length;i<len;i++){
				OrientaionFuns[i].call(OrientaionFuns[i].source);
			}
		},300);
	});
})(window);












