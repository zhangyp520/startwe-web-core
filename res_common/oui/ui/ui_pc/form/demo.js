(function(win){
	/*******************************依赖的Js类 start***********************************************************/
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	/*******************************依赖的Js类 end************************************************************/
	/**
	 * 控件类构造器
	 */
	var Demo = function(cfg) {
		/***************************一 控件必须实现:控件继承call ****/
		Control.call(this,cfg);//必须继承控件超类
		/***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
		this.attrs = this.attrs+",msg,afterPlusClick";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		this.init = function(){};
		/***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
		this.plusClick= plusClick; 
	}; 
	ctrl["demo"] = Demo;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
	
	/*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
	Demo.FullName = "oui.$.ctrl.demo";//设置当前类全名 静态变量
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Demo.templateHtml=[];
	Demo.templateHtml[0] = '<input id="{{id}}" name="{{name}}" value="{{=value}}" type="text" {{=commonEvent}} />'+
	'<button class="numbox-btn-plus" onclick="oui.getByOuiId({{ouiId}}).plusClick();">+</button>' ;

	/** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
	Control.buildTemplate(Demo,'edit4ReadOnly,edit4View','0,1', '<input id="{{id}}" name="{{name}}" value="{{=value}}" type="text" {{=commonEvent}} />'+
		'<button class="numbox-btn-plus" onclick="oui.getByOuiId({{ouiId}}).plusClick();">+</button>');
	/*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/


	
	
	/*******************************控件类的自定义函数 start******************************************/
	/**
	 * 模拟控件类设计全局函数 plusClick
	 */
	var plusClick=function(){
		var f = this.attr("afterPlusClick");
		if(this.isShow){
			return ;
		}
		this.isShow = true;
		var me = this;
		oui.confirmDialog(this.attr("msg"),function(){
			alert('confirmclick');
			if(f){
				eval(f);
			}
			me.isShow = false;
		},function(){
			me.isShow = false;
		});
	};
	/*******************************控件类的自定义函数 end******************************************/
})(window);












