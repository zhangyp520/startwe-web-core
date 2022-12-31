(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	/**
	 * 控件类构造器
	 */
	var Demo = function(cfg) {
		Control.call(this,cfg);//必须继承控件超类
		this.attrs = this.attrs+",msg,afterPlusClick";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		this.init = function(){};
		this.plusClick= plusClick; 
	}; 
	ctrl["demo"] = Demo;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
	
	Demo.FullName = "oui.$.ctrl.demo";//设置当前类全名 静态变量
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Demo.templateHtml = '<input id="{{id}}" name="{{name}}" value="{{=value}}" type="text" {{=commonEvent}} />'+
	'<button class="numbox-btn-plus" onclick="oui.getByOuiId({{ouiId}}).plusClick();">+</button>' ; 

	
	
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












