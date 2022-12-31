(function(win){
	
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	var constant =oui.$.constant;
	/**
	 * 控件类设计构造器
	 */
	var NumberOnLine = function(cfg) {
		/***************************一 控件必须实现:控件继承call、控件全名定义FullName、控件的html内容模板函数getTemplateHtml ****/
		Control.call(this,cfg);//必须继承控件超类
	};
	ctrl["numberonline"] = NumberOnLine;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
	
	/*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
	NumberOnLine.FullName = "oui.$.ctrl.numberonline";//设置当前类全名 静态变量

	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	NumberOnLine.templateHtml=[];
	NumberOnLine.templateHtml[0] = '<input id="{{id}}" class="oui-form" style="{{fieldStyle}}" name="{{name}}" '+
	'disabled="disabled" '+
	'value="{{=value}}" validate="{{validate}}" type="text"/>' ; //onclick="oui.getByOuiId({{ouiId}}).plusClick();"

})(window);





