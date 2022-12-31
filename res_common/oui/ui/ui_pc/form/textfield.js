(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	//控件构造器
	var Textfield = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
		this.validate = validate;
		this.attrs =this.attrs+',placeholder,isReadOnly,onclick,scanScript';
		this.click = click;
		this.init = init;
	};
	Textfield.FullName = "oui.$.ctrl.textfield";//设置当前类全名
	ctrl["textfield"] = Textfield;//将控件类指定到特定命名空间下	
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Textfield.templateHtml=[];
	Textfield.templateHtml[0] ='{{if right&&(right=="design") && allowScan}}<i class="form-scanCode-info"></i>{{/if}}<input id="{{id}}" class="oui-form" '+
	'{{if right&&(right=="design")}}disabled="disabled" '+
	'{{isReadOnly?"readonly=readonly":""}} onclick="oui.getByOuiId({{ouiId}}).click();" '+
	'{{/if}}'+
	'placeholder="{{placeholder}}"'+
	'style="{{fieldStyle}}" name="{{name}}" validate="{{validate}}" onfocus="oui.hideErrorInfo(this);" type="text" value="{{value}}" {{=commonEvent}}'+
	' onkeyup="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" />' ;
	Textfield.templateHtml[1] =Textfield.templateHtml[0];
	/***********************************控件事件***********************************/

	var init = function(){
        var otherAttrs = oui.parseJson(this.attr("otherAttrs") || '{}');
        var allowScan = !!otherAttrs.allowScan;
		var json = this.attr('json');
		if(json){
			json =oui.parseJson(json);
		}

        this.attr("allowScan", allowScan);
	};

	var validate = function(){
		var el = this.getEl();
		var targetEl = $(el).find('#'+this.attr('id'))[0];
		return oui.validate(targetEl);
	};
	var click = function(){
		var onclick = this.attr('onclick');
		if(typeof onclick =='string'){
			try{
				onclick = eval(onclick);
			}catch(e){}
		}
		onclick&&onclick(this);
	};

})(window);





