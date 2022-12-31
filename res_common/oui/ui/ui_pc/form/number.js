(function(win){
	
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	var constant =oui.$.constant;
	/**
	 * 控件类设计构造器
	 */
	var Number = function(cfg) {
		/***************************一 控件必须实现:控件继承call、控件全名定义FullName、控件的html内容模板函数getTemplateHtml ****/
		Control.call(this,cfg);//必须继承控件超类
		/***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
		this.attrs = this.attrs+",step,max,min,format,numberFieldCls,dotNum";//当前控件自定义属性，无则去掉本行代码
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		this.plus=plus;
		this.getFormatValue= getFormatValue;
		this.getInputValueByFormatAndValue = getInputValueByFormatAndValue;
		this.getValueByFormatValue = getValueByFormatValue;//根据格式化显示值 还原实际值
		this.setValueBefore = setValueBefore;
		this.afterRender = afterRender;
		this.init = function(){
			var min = this.attr("min");
			var max = this.attr("max");
			
			var value = ""
			var step = this.attr("step") || "1";
			
			if((this.attr("min")&&this.attr("min")!="")){
				this.attr("min",this.parseToNum(min));
				value=this.attr("value") ||this.attr("min");
			}
			else{
				value=this.attr("value") ;
			}
			if(this.attr("max")&&this.attr("max")!=""){
				this.attr("max",this.parseToNum(max));
			}

			try {
				parseFloat(this.attr("value"));
			}catch (e){
                this.attr("value","");
			}

			//this.attr("value",this.parseToNum(value));
			this.attr("step",this.parseToNum(step));

			var format = this.attr('format');
			var otherAttrs = this.attr('otherAttrs');
			otherAttrs = oui.parseJson(otherAttrs||"{}");
			format = format || otherAttrs.format || "";
			this.attr('format',format);
			var dotNum = this.attr('dotNum');
			var validate = this.attr('validate') ||"{}";
			validate = oui.parseJson(validate);
			validate.percentNum = false;
			if(dotNum){
				if(!validate.dotNum){
					validate.dotNum = parseInt(dotNum);
				}
			}
			var numberFieldCls = this.attr('numberFieldCls');
			if(format){
				if(format =='%'){//百分位
					numberFieldCls = numberFieldCls ||  'oui-number-percent';
					validate.percentNum = true;
				}else if(format ==','){ //千分位
					numberFieldCls = numberFieldCls || 'oui-number-split'
				}
				this.attr('numberFieldCls',numberFieldCls);
			}
			this.attr('validate',oui.parseString(validate));
			var formatValue = this.getFormatValue();
			this.attr('formatValue',formatValue);
			this.attr('inputValue',this.getInputValueByFormatAndValue());
		};
		
		/***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
		this.parseToNum=parseToNum;
		
		this.minusClick = minusClick;
		this.plusClick= plusClick;
		this.afterChange=afterChange;
		this.clearTimer=clearTimer;
		this.minus=minus;
		this.validate = validate;
		this.clearNoNum = clearNoNum;
		this.change = change; //值改变处理
		this.blur4change = blur4change;//失去焦点处理
		this.focus = focus;
	};
	ctrl["number"] = Number;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
	
	/*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
	Number.FullName = "oui.$.ctrl.number";//设置当前类全名 静态变量

	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Number.templateHtml=[];
	Number.templateHtml[0] = '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" targetHighBorderEl="#number-{{id}}" validate="{{validate}}" />' +
		'<input id="number-{{id}}" onfocus="oui.hideErrorInfo(this);" class="oui-form {{numberFieldCls}}" style="{{fieldStyle}}"'+
	'{{if right&&(right=="design")}}disabled="disabled" '+
	'{{/if}}'+
	'value="{{=inputValue}}" onkeyup="oui.getByOuiId({{ouiId}}).clearNoNum(event,this);oui.getByOuiId({{ouiId}}).change();" ' +
		'oninput="oui.getByOuiId({{ouiId}}).clearNoNum(event,this);oui.getByOuiId({{ouiId}}).change();" ' +
		'onpropertychange="oui.getByOuiId({{ouiId}}).clearNoNum(event,this);oui.getByOuiId({{ouiId}}).change();"  ' +
		'onblur="oui.getByOuiId({{ouiId}}).blur4change();"' +
		' type="text"/>' +
		'{{if format&&format=="%" }}'+
		'<span class="oui-number-percent-char">%</span>'+
		'{{/if}}' +

		'{{if format&&format=="," }}'+
		'<div class="oui-number-split-area" onclick="oui.getByOuiId({{ouiId}}).focus();">{{formatValue}}</div>'+
		'{{/if}}' +
		''+
		'' ;


	//onclick="oui.getByOuiId({{ouiId}}).plusClick();"
	Number.templateHtml[1] ='<button class="oui-number-minus" onmouseout="oui.getByOuiId({{ouiId}}).clearTimer();"  onmouseup="oui.getByOuiId({{ouiId}}).clearTimer();" onmousedown="oui.getByOuiId({{ouiId}}).minusClick();">-</button>'+
	'<input name="{{name}}" onfocus="oui.hideErrorInfo(this);" class="oui-form" validate="{{validate}}" value="{{=value}}" ' +
		'oninput="oui.getByOuiId({{ouiId}}).clearNoNum(event,this);oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" ' +
		'onpropertychange="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" ' +
		'onblur="oui.$.ctrl.ouiformcontrol.blur({{ouiId}},this);"' +
		'type="text" onkeyup="oui.getByOuiId({{ouiId}}).clearNoNum(event,this);"/>'+
	'<button class="oui-number-plus" onmouseout="oui.getByOuiId({{ouiId}}).clearTimer();" onmouseup="oui.getByOuiId({{ouiId}}).clearTimer();" onmousedown="oui.getByOuiId({{ouiId}}).plusClick();">+</button>' ; //onclick="oui.getByOuiId({{ouiId}}).plusClick();"

	Number.templateHtml4readOnly=[];
	Number.templateHtml4readOnly[0] =  '{{formatValue}}' +
		'{{if (format&&format=="%")&&(formatValue) }}'+
		'%'+
		'{{/if}}' +
		'';
	Number.templateHtml4readOnly[1] = Number.templateHtml4readOnly[0];

	/** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
	Control.buildTemplate(Number,'edit4ReadOnly,edit4View','0,1',Number.templateHtml4readOnly[0]);

	/*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
	
	/*******************************控件类的自定义函数 start******************************************/
	//数字控件进行设置值前的绑定
	var setValueBefore = function() {
		this.init();
		this.attr('canBlur',false);
	};
	var afterRender = function () {
        var me = this;
	    setTimeout(function () {
            me.attr('canBlur',true);
        },1);
	};
	var change = function(){
		this.triggerUpdate&&this.triggerUpdate();
		this.afterChange&&this.afterChange(); // 如果子类控件对象上实现了afterChange 函数 则执行 缓存同步后置脚本	
	};
	/** 数字输入 获取焦点****/
	var focus = function(){
		var el = this.getEl();
		var $splitArea = $(el).find('.oui-number-split-area');
		if($splitArea &&$splitArea.length){
			$splitArea.addClass('display_none');
		}
		var id = this.attr('id');
		$(el).find('#number-'+id).focus();
	};
	/* 失去焦点处理事件*****/
	var blur4change = function(){
		var el = this.getEl();
		var id = this.attr('id');

		if(!this.attr('canBlur')){
            this.attr('canBlur',true);
		    return ;
        }
		var format = this.attr('format');
		var validate = this.attr('validate') ||{};
		validate = oui.parseJson(validate);
		var dotNum = validate.dotNum ||0;
		/** 百分数处理****/
		if(format =='%'){

			var formatValue = this.attr('formatValue');
			if(formatValue){
				formatValue = oui.fixedNumber(parseFloat(formatValue+""),dotNum)
			}
			this.attr('formatValue',formatValue);
			this.attr('value',this.getValueByFormatValue());
			$(el).find('#'+id).val(this.attr('value'));
			$(el).find('#number-'+id).val(formatValue);
		}else{
			var value = $(el).find('#number-'+id).val();
			if(value){
				value = oui.fixedNumber(parseFloat(value+""),dotNum)
			}
			this.attr('value',value);
			this.attr('formatValue',this.getFormatValue());
			$(el).find('#'+id).val(value);
			$(el).find('#number-'+id).val(value);
		}


		var $splitArea = $(el).find('.oui-number-split-area');
		if($splitArea &&$splitArea.length){
			$splitArea.html(this.getFormatValue());
			$splitArea.removeClass('display_none');
		}
		this.triggerUpdate&&this.triggerUpdate();
		this.triggerAfterUpdate && this.triggerAfterUpdate();
		if(this.attr&&this.attr('onAfterChange')){
			eval(this.attr('onAfterChange'));
		}
	};
	/** 千分位转换函数***/
	function toThousands(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	/** 根据format获取 输入框中的值 *****/
	var getInputValueByFormatAndValue = function(){
		var format = this.attr('format');
		var inputValue ='';
		if(format =='%'){ //百分号 处理
			inputValue = this.getFormatValue();
		}else if(format ==','){ //千分位处理
			inputValue = this.attr('value');
		}else{
			inputValue = this.attr('value');
		}
		return inputValue;
	};
	/*** 获取格式化显示值******/
	var getFormatValue = function(){
		var format = this.attr('format');
		var value = this.attr('value');
		var displayValue = value;
		if(format && value ){
			if(format =='%'){ //百分号 处理
				var validate = oui.parseJson(this.attr('validate')||'{}');
				var dotNum = validate.dotNum ||0;
                displayValue = oui.fixedNumber(((parseFloat(value + "") * 100).toPrecision(12)), dotNum);
			}else if(format ==','){ //千分位处理
				displayValue = toThousands(value);
			}
		}
		return displayValue;
	};
	var getValueByFormatValue = function(){
		var formatValue = this.attr('formatValue');
		var format =this.attr('format');
		var value = formatValue;
		if(format && formatValue ){
			if(format =='%'){ //百分号 处理
				var validate = oui.parseJson(this.attr('validate')||'{}');
				var dotNum = validate.dotNum ||0;
				var tempNum= Math.pow(10,dotNum);
				value = oui.fixedNumber((parseFloat(formatValue+'')*(tempNum)/(100*tempNum)),dotNum+2);
				var maxLength =validate.maxLength ||15;
				if((value+'').length > maxLength){
					value= value.substring(0,15);
				}
			}else if(format ==','){ //千分位处理
				value = formatValue.split(',').join('');
			}
		}
		return value;
	};
	/**
	 * 模拟控件类设计全局函数 minusClick
	 */
	var minusClick = function(){
		this.clearTimer();
		var ouiId =this.attr(constant.ouiIdName);
		var obj = oui.getByOuiId(ouiId); // 获取控件对象
		if (!obj) {
			return;
		}
		var v =parseFloat(obj.attr("value")||'0');// 获取控件值
		var min=obj.attr("min");
		var step=obj.attr("step");
		v-=step; // 业务操作 改变控件值
		if(min!=""||min===0){
			if(v<min){
				return;
			}
		}
		obj.attr("value",v);
		$(obj.getEl()).find('input').val(v);
		//this.render();
		this.triggerUpdate();
		this.triggerAfterUpdate();
		this.minus();//默认延迟500 执行，如果长按则执行快速追加
	};
	var _numberTimer="";
	var plus=function(time){
		var ouiId=this.attr("ouiId");
		this.clearTimer();
		_numberTimer=setTimeout(function(){
			var obj=oui.getByOuiId(ouiId);
			obj.plusClick();
			obj.plus(70);
		},time||500);//默认500ms后执行，处理点击事件和按事件
	};
	var minus=function(time){
		var ouiId=this.attr("ouiId");
		this.clearTimer();
		_numberTimer=setTimeout(function(){
			var obj=oui.getByOuiId(ouiId);
			obj.minusClick();
			obj.minus(70);
		},time||500);//默认500ms后执行，处理点击事件和按事件
	};
	var clearTimer=function(){
		if(!_numberTimer){
			return;
		}
		clearTimeout(_numberTimer);
		_numberTimer=null;
	};
	/**
	 * 模拟控件类设计全局函数 plusClick
	 */
	var plusClick=function(){
		this.clearTimer();
		var ouiId =this.attr(constant.ouiIdName);
		var obj = oui.getByOuiId(ouiId); // 获取控件对象
		if (!obj) {
			return;
		}
		var v =parseFloat(obj.attr("value")||'0');// 获取控件值
		var max=obj.attr("max");
		var step=obj.attr("step");
		v+=step; // 业务操作 改变控件值 
		if(max||max===0){
			if(v>max){
				return;
			}
		}
		obj.attr("value",v);
		$(obj.getEl()).find('input').val(v);
		this.triggerUpdate();
		this.triggerAfterUpdate();
		this.plus();//默认延迟500 执行，如果长按则执行快速追加
	};
	var afterChange=function(){
		
		
		var v=this.attr("value");
		/**
		 * 判断输入是否是最大值或最小值
		 */
		var min=this.attr("min");
		var max=this.attr("max");		
		if(max||max===0){
			if(this.parseToNum(v)>this.attr("max")){
				this.attr('value',max);
				this.render();
				return;
			}
			this.attr("value",this.parseToNum(v));
		}
		if(min||min===0){
			if(this.parseToNum(v)<this.attr("min")){
				this.attr('value',min);
				this.render()
				return;
			}
			this.attr("value",this.parseToNum(v));
		}
		
	};
	/**
	 *将字符串的数字转换为Number类型
	 *@param String str 出入数字字符串
	 *@return Number 该数字的Number类型
	 */
	var parseToNum=function(str){
		if(typeof str=='undefined'||str==''){
			return "";
		}
		try{
			var v = parseFloat(str);
			return v;
		}catch(e){
			alert("请输入数字");
		}
	};
	/**
	 * 将页面获取的step，min，max，value从字符串类型转换为Number类型，该函数提供给init调用。初始化step，min，max，value
	 */
	var validate = function(){
		var el = this.getEl();
		var targetEl = $(el).find('#'+this.attr('id'))[0];
		return oui.validate(targetEl);
	};
	var clearNoNum = function(event,el,isNotFocus){  //清空非数字计算
		var obj = el;
		event = window.event || event;
        if (event.keyCode == 37 | event.keyCode == 39) {
			return;
        }
		if(event.type &&event.type=='keyup'){
			if(document.activeElement&&(document.activeElement !=el)){
				return ;
			}
		}
		var validate = oui.parseJson(this.attr('validate')||'{}');
		var isInt,maxLength;
		if(typeof validate.dotNum !='undefined' && ((validate.dotNum+'')=='0')){
			isInt = true;
		}
		maxLength = validate.maxLength ||15;
		var canNotMinus = validate.canNotMinus || false;
		oui.clearNotNum4pc(event,obj,isInt,canNotMinus,maxLength,isNotFocus);
		var format = this.attr('format');
		if(format =='%'){
			this.attr('formatValue',obj.value);
			this.attr('value',this.getValueByFormatValue());
		}else if(format==','){
			this.attr('value',obj.value);
			this.attr('formatValue',this.getFormatValue());
		}else{
			this.attr('value',obj.value);
			this.attr('formatValue',obj.value);
		}
	};
	/*******************************控件类的自定义函数 end******************************************/
})(window);





