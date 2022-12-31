(function(win){
	/*******************************依赖的Js类 start***********************************************************/
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	/*******************************依赖的Js类 end************************************************************/
	/**
	 * 控件类构造器
	 */
	var Color = function(cfg) {
		/***************************一 控件必须实现:控件继承call ****/
		Control.call(this,cfg);//必须继承控件超类
		/***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
		this.attrs = this.attrs+",change,color,move";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		this.init = init;
		this.pickerColor=pickerColor;
		this.colorChange=colorChange;
		this.afterRender=afterRender;
		/***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/

	}; 
	ctrl["color"] = Color;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
	
	/*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
	Color.FullName = "oui.$.ctrl.color";//设置当前类全名 静态变量
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Color.templateHtml=[];

	Color.templateHtml[0] = '' +
	'<div class="oui-color-container">'+
	'{{each data as item index}}'+
		'<div>' +
			'<p>{{item.text}}</p>'+
			'<input targetOuiId="{{ouiId}}" onclick="oui.getByOuiId({{ouiId}}).pickerColor(this)" color="{{item.color}}"  style="display: inline;"/>'+

		'</div>' +
	'{{/each}}'+
	'</div>';
	/*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
	var afterRender=function(){
		var el=this.getEl();
	 	this.colorChange($(el).find("input"));
	};
	var init=function(){
		var d = this.attr("data");
		if(d){
			this.attr("data",oui.parseJson(d));
		}else{
			oui.log("颜色控件 需要配置data属性");
		}
	};
	var pickerColor=function(el){
		this.colorChange($(el));
	};
	var colorChange=function (domObj) {
		$.each(domObj, function () {
			var color=$(this).attr("color");
			var obj=oui.getByOuiId($(this).attr("targetOuiId"));
			$(this).spectrum({
				cancelText: "取消",
				chooseText: "选择",
				clearText: "清除",
				togglePaletteMoreText: "更多选项",
				togglePaletteLessText: "隐藏",
				noColorSelectedText: "尚未选择任何颜色",
				color:color,
				preferredFormat: "rgb",
				preferredFormat: "hex",
				showInput: true,
				move:function(color){
					var r=color._r;
					var g=color._g;
					var b=color._b;
					var rgb='rgb('+r+','+g+','+b+')';
					obj.attr("value",rgb);
					var move=obj.attr("move");
					if(move){
						eval(move+"(obj)");
					}
				},
				change:function(color){
					var r=color._r;
					var g=color._g;
					var b=color._b;
					var rgb='rgb('+r+','+g+','+b+')';
					obj.attr("value",rgb);
					var change=obj.attr("change");
					if(change){
						eval(change+"(obj)");
					}
					obj.triggerUpdate();
					obj.triggerAfterUpdate();
				}
			});
		});

	};

	/*******************************控件类的自定义函数 start******************************************/

	/*******************************控件类的自定义函数 end******************************************/
})(window);












