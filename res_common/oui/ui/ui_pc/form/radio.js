(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	//控件构造器
	var Radio = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数
		//this.attrs = this.attrs+",data";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 单选框初始化
		 */
		this.init = init;
		this.radioClick = radioClick;
		this.hasEnumOther = hasEnumOther;
		this.getData4DB = getData4DB;
		this.changeOtherText = changeOtherText; 
		this.validate = validate;
		this.isEnumControl=true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
	};
	Radio.FullName = "oui.$.ctrl.radio";//设置当前类全名
	ctrl["radio"] = Radio;//将控件类指定到特定命名空间下	
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Radio.templateHtml=[];
	Radio.templateHtml[0] ='{{each data as item index}}'+


	'{{if (item.value +"") !="-1"}}'+
		'<label for="radio_{{id}}_{{index}}">'+
		'<div class="radio-button-wrapper">'+
		'<input type="radio" id="radio_{{id}}_{{index}}" name="{{name}}" '+
		'{{if right&&(right=="design")}}disabled="disabled" '+
		'{{else}}'+
		'onclick="oui.getByOuiId({{ouiId}}).radioClick(this,{{index}});" '+
		'{{/if}}'+
		'value="{{item.value}}"'+
		'{{if (value+"")&& (item.value==value)}}checked="checked"{{/if}}  {{=commonEvent}} />'+
		'<i class="selected-icon"></i>'+
		'</div>'+
		'<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>'+
		'</label>'+
	'{{/if}}'+
	
	'{{if (item.value +"") =="-1"}}'+
		'<div class="oui-class-other">'+
			'<label for="radio_{{id}}_{{index}}">'+
			'<div class="radio-button-wrapper">'+
			'<input type="radio" id="radio_{{id}}_{{index}}" name="{{name}}" '+
			'{{if right&&(right=="design")}}disabled="disabled" '+
			'{{else}}'+
			'onclick="oui.getByOuiId({{ouiId}}).radioClick(this,{{index}});" '+
			'{{/if}}'+
			'value="{{item.value}}"'+
			'{{if item.value==value}}checked="checked"{{/if}}  {{=commonEvent}} />'+
			'<i class="selected-icon"></i>'+
			'</div>'+
			'其它'+
			'</label>'+
			'<input  validate="{maxLength:30,msgPosEl:\'#radio-other-{{id}}\',msgPos:\'after\',failMode:\'msgPosEl\',title:\'其它\'}"'+
			'id="radio-other-{{id}}" {{if !(item.value==value)}}disabled="disabled"{{/if}} class="oui-input-others" oninput="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onpropertychange="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onblur="oui.getByOuiId({{ouiId}}).changeOtherText(this);oui.validate(this);oui.getByOuiId({{ouiId}}).triggerAfterUpdate();" type="text" value="{{=oui.escapeStringToHTML(item.display)}}"/>'+
		'</div>'+
	'{{/if}}'+	
	
	'{{/each}}';
	Radio.templateHtml[1] ='{{each data as item index}}'+
		'{{if (item.value +"") !="-1"}}'+
		'<span>'+
			'<label for="radio_{{id}}_{{index}}">'+
			'<div class="radio-button-wrapper">'+
			'<input type="radio" id="radio_{{id}}_{{index}}" name="{{name}}" '+
			'{{if right&&(right=="design")}}disabled="disabled" '+
			'{{else}}'+
			'onclick="oui.getByOuiId({{ouiId}}).radioClick(this,{{index}});" '+
			'{{/if}}'+
			'value="{{item.value}}"'+
			'{{if (value+"")&& (item.value==value)}}checked="checked"{{/if}}  {{=commonEvent}} />'+
			'<i class="selected-icon"></i>'+
			'</div>'+
			'<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>'+
			'</label>'+

		'</span>'+
		'{{/if}}'+
	
		'{{if (item.value +"") =="-1"}}'+
		'<span>'+
			'<div class="oui-class-other">'+
				'<label for="radio_{{id}}_{{index}}">'+
				'<div class="radio-button-wrapper">'+
				'<input type="radio" id="radio_{{id}}_{{index}}" name="{{name}}" '+
				'{{if right&&(right=="design")}}disabled="disabled" '+
				'{{else}}'+
				'onclick="oui.getByOuiId({{ouiId}}).radioClick(this,{{index}});" '+
				'{{/if}}'+
				'value="{{item.value}}"'+
				'{{if item.value==value}}checked="checked"{{/if}}  {{=commonEvent}} />'+
				'<i class="selected-icon"></i>'+
				'</div>'+
				'其它'+
				'</label>'+
				'<input '+
				'validate="{maxLength:30,msgPosEl:\'#radio-other-{{id}}\',msgPos:\'after\',failMode:\'msgPosEl\',title:\'其它\'}" '+				
				'id="radio-other-{{id}}" {{if !(item.value==value)}}disabled="disabled"{{/if}} class="oui-input-others" oninput="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onpropertychange="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onblur="oui.getByOuiId({{ouiId}}).changeOtherText(this);oui.validate(this);oui.getByOuiId({{ouiId}}).triggerAfterUpdate();" type="text" value="{{=oui.escapeStringToHTML(item.display)}}"/>'+
			'</div>'+
		'</span>'+
		'{{/if}}'+	
	
	    '{{/each}}';
	Radio.templateHtml[4]=Radio.templateHtml[3]=Radio.templateHtml[2]=Radio.templateHtml[1];
	//showType=4  -->  平铺单选
	//浏览态 单选框 模板
	Radio.templateHtml4readOnly=[];
	Radio.templateHtml4readOnly[0] ='{{each data as item index}}'+
	'{{if ((item.value +"") !="-1")&&(value==item.value)}}'+
		'{{=oui.escapeStringToHTML(item.display)}}'+
	'{{/if}}'+
	'{{if ((item.value +"") =="-1")&&(value==item.value)}}'+
		'{{=oui.escapeStringToHTML(item.display||"其它")}}'+
	'{{/if}}'+	
	'{{/each}}';
	Radio.templateHtml4readOnly[4]=Radio.templateHtml4readOnly[3] = Radio.templateHtml4readOnly[2] = Radio.templateHtml4readOnly[1] = Radio.templateHtml4readOnly[0];
	/** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
	Control.buildTemplate(Radio,'edit4ReadOnly,edit4View','0,1,2,3,4',Radio.templateHtml4readOnly[0]);
	/************************************控件初始化init **************************/
	var init =function(){
		var d = this.attr("data");
		this.attr('isControlValidate',true);//复选框 的验证属性需要输出到最外层的div上
		if(d){
			this.attr("data",oui.parseJson(d));
		}else{
			oui.log("单选按钮 需要配置data属性");
			throw e;
		}

        var value = this.attr("value");
        var data = this.attr("data");
        var data4DB = this.attr("data4DB");
        if (value + "") {
            if(data){
                var dataKey = '';
                for (var k = 0, alen = data.length; k < alen; k++) {
                    dataKey = data[k].value + '';
                    if (dataKey+"" === value +"") {
                        if(dataKey === "-1") {
                            data4DB = oui.parseJson(data4DB || '{}');
                            if (data4DB.value === '-1') {
                                data[k].display = data4DB.display;
                            }
                        }
                        this.attr('value', dataKey);
                        break;
                    }
                    this.attr("value", "");
                }
                this.attr("data", data);
            }else {
                this.attr("data",[]);
                this.attr("value", "");
            }
        }else {
            this.attr("value", "");
        }

	};
	/**
	 * 判断是否含有其它选项
	 */
	var hasEnumOther = function(){
		var data = this.attr('data');
		if(!data){
			return false;
		}
		for(var i=0,len=data.length;i<len;i++){
			if(data[i].value =='-1'){
				return true;
			}
		}
		return false;
	};
	/***********************************控件事件***********************************/
	var radioClick = function(el,index){
		var data = this.attr('data');
		var lastValue = this.attr('value')+'';
		var targetValue = data[index].value+'';
		if((lastValue && targetValue) && (lastValue  == targetValue)){
			//值相同则 说明已经被选中，则切换为不选中
			this.attr("value",""); //清空值
			var containerEl = this.getEl();
			var $otherInputEl = $(containerEl).find('#radio-other-'+this.attr('id'));
			if( targetValue=='-1' ){
				$otherInputEl.attr('disabled','disabled');
				$otherInputEl.val('');
				this.changeOtherText($otherInputEl[0]);
			}else{
				$otherInputEl.removeAttr('disabled');
				//值相同则取消选中
				el&&$(el).removeAttr("checked");
			}
		}else{
			this.attr("value",data[index].value);
			var containerEl = this.getEl();
			var $otherInputEl = $(containerEl).find('#radio-other-'+this.attr('id'));
			if((this.attr('value')=='-1') ||(this.attr('value')==-1)){
				$otherInputEl.removeAttr('disabled');
			}else{
				$otherInputEl.attr('disabled','disabled');
				$otherInputEl.val('');
				this.changeOtherText($otherInputEl[0]);
			}
		}
		this.validate();
		this.triggerUpdate();
		this.triggerAfterUpdate();
	};

	var getData4DB = function(){
		var data4DB = Control.getProtoType().getData4DB.call(this);
		var vals = this.getValue() || "";
		if(vals){
			var data = this.attr("data");
			data = oui.parseJson(data || '[]');
			var item = null;
			for (var j = 0; j < data.length; j++) {
				item = data[j];
				if ((vals + '') == (item.value + '')) {
					data4DB.display = item.display;
					data4DB.value = item.value;
					data4DB.id = item.id;
					break;
				}
			}
		}
		return data4DB;
	};

	/**
	 * 改变其它中的输入文本
	 */
	var changeOtherText = function(el){
		var otext = $(el).val();
		if((this.attr('value')+'') !='-1'){
			$(el).val('');
		}
		var data = this.attr('data');
		var len = data.length;
		for(var i=len-1;i>-1;i--){
			if((data[i].value+'')=='-1'){
				data[i].display = otext;
				break;
			}
		}
        this.triggerUpdate();
    };
	var validate = function(){
		var el = this.getEl();
		if(this.hasEnumOther()){
			var $radioEl= $(el).find('#radio-other-'+this.attr('id'));
			if($radioEl&&$radioEl.length){
				var flag = oui.validate($radioEl[0]);
				if(!flag){
					return flag;
				}
			}
		}
		return oui.validate(el);
	};
})(window);





