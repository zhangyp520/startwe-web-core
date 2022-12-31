(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.basecontrol;
	//控件构造器
	var TabsView = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
		this.attrs = this.attrs+",activeTabId,marginLeft";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		this.init = init;
		this.setData = setData;
		this.getActiveTab = getActiveTab; 
		this.afterRender = afterRender;
		 
		this.active = active;
	};
	TabsView.FullName = "oui.$.ctrl.tabsview";//设置当前类全名
	ctrl["tabsview"] = TabsView;//将控件类指定到特定命名空间下	
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	TabsView.templateHtml=[]; 
	
	TabsView.templateHtml[0] ='<ul>'+
		'{{each data as item index}}'+
		'<li style="width:{{item.width}}" class="oui-tabsview-icon oui-tabview-link {{item.iconCls}} {{if activeTabId==item.id}}oui-tabsview-active{{/if}} "> <span onclick="oui.getByOuiId({{ouiId}}).active(\'{{item.id}}\');">{{item.title}}</span></li>'+
		'{{/each}}'+
    '</ul>'+
    '<div>'+
    	'{{=content}}'+
	' </div>' ;
	/************************************控件初始化init **************************/
	var init =function(){ //解析属性和容器结构
		//var d = this.attr("data");
		
		var el = document.getElementById(this.attr('id'));
		var data = [];
		var idx =0;
		var $tabs = $(el).children();
		var tabLen = $tabs.length; 
		$tabs.each(function(){
			var currData ={
				getJson:function(s){
					
					return eval('('+s+')');
				}
			};
			var attrs = ($(this).attr("attrs") ||"").split(",");
			for(var i=0,len=attrs.length;i<len;i++){
				currData[attrs[i]] = $(this).attr(attrs[i]) ||"";
			}
			data.push({
				idx:(idx++),
				id:$(this).attr("id"),
				title:$(this).attr("title"),
				iconCls:$(this).attr("iconCls") ||"",
				width:(100/tabLen)+"%",
				_render:template.compile($(this).html()),
				data:currData,
				getHtml:function(){
					return this._render(this.data);
				}
			});
		});
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
	var active = function(tabId){
		if(!tabId){
			return ;
		}
		this.attr('activeTabId',tabId);	
		var ac=this.getActiveTab();
		var h = (ac && ac.getHtml)?ac.getHtml():"";
		this.attr('content',h);		
		this.render();
	};
	var afterRender = function(){
		var el = this.getEl();
		 
		$(el).find("oui-control").each(function(){
			oui.parseByDom(this);
		});
		
	}; 
})(window);












