/**
 * 时间控件
 * <oui-form type="timepicker" showType="0"></oui-form>
 */
(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	//控件构造器
	var TimePicker = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数 
		//this.attrs = this.attrs+",format";//为了减少模板的代码量，所以在这对年份进行封装
		this.init =init;
		this.updateHoursAndMinutes = updateHoursAndMinutes;
		this.changeTime = changeTime;
		this.clearValue = clearValue;
		this.keyup4clearNotNum = keyup4clearNotNum;
		this.getData4DB = getData4DB;
	}; 
	ctrl['timepicker'] = TimePicker;
	TimePicker.FullName = "oui.$.ctrl.timepicker";//设置当前类全名
	//控件HTML代码模板
	TimePicker.templateHtml=[];
	TimePicker.templateHtml[0]= '<input type="hidden" value="{{value}}"  id="{{id}}" name="{{name}}" validate="{{validate}}"/>'+
	'<input id="houi-{{id}}" type="text" value="{{houi}}"  validate="{{validate}}" '+
	'{{if right&&(right=="design")}}disabled="disabled" '+
	'{{/if}}'+ 
	//ie 9卡死问题解决
	//'onpropertychange="oui.getByOuiId({{ouiId}}).changeTime(this);" onfocus="oui.hideErrorInfo(\'#{{id}}\');" onkeyup="oui.getByOuiId({{ouiId}}).changeTime(this);" oninput="oui.getByOuiId({{ouiId}}).changeTime(this);"'+
	//oui.clearNotNum4pc = function(event,obj,isInt,canNotMinus)
	//window.event ? window.event : arguments[0]
	'onfocus="oui.hideErrorInfo(\'#{{id}}\');" onkeyup="oui.getByOuiId({{ouiId}}).keyup4clearNotNum(this,window.event ? window.event : arguments[0]);"  onblur="oui.getByOuiId({{ouiId}}).changeTime(this,window.event ? window.event : arguments[0]);" '+
	' />'+
	'<i>:</i>'+
	'<input id="minutes-{{id}}" type="text" value="{{minutes}}" validate="{{validate}}" '+
	'{{if right&&(right=="design")}}disabled="disabled" '+
	'{{/if}}'+
	'onfocus="oui.hideErrorInfo(\'#{{id}}\');" onkeyup="oui.getByOuiId({{ouiId}}).keyup4clearNotNum(this,window.event ? window.event : arguments[0]);"  onblur="oui.getByOuiId({{ouiId}}).changeTime(this,window.event ? window.event : arguments[0]);" '+
	//ie 9卡死问题解决
	//'onpropertychange="oui.getByOuiId({{ouiId}}).changeTime(this);" onfocus="oui.hideErrorInfo(\'#{{id}}\');" onkeyup="oui.getByOuiId({{ouiId}}).changeTime(this);" oninput="oui.getByOuiId({{ouiId}}).changeTime(this);"'+
	'/>'+
	'<i '+
	'{{if right&&(right=="design")}}disabled="disabled" {{else}}'+
	'onclick="oui.getByOuiId({{ouiId}}).clearValue();" '+
	'{{/if}}'+
	'class="time-picker-clear">×</i>';
	/**
	 *初始化时 更新 houi和minutes
	 */
	var init = function(){
		this.updateHoursAndMinutes();
		
	};
	var clearValue = function(){
		this.attr('value','');
		this.attr('houi','');
		this.attr('minutes','');
		
		this.render();
	};
	/**
	 * 值改变时 更新 houi和minutes
	 */
	var updateHoursAndMinutes= function(){
		var v = this.attr('value');
		var isEmpty = false;
		var houi;
		var minutes;
		if(!v){
			isEmpty = true;
		}else{
			var arr = v.split(':');
			try{
				houi =parseInt(arr[0].replace(/e/ig,''));
				minutes = parseInt(arr[1].replace(/e/ig,''));
				if(isNaN(houi) || isNaN(minutes)){
					isEmpty = true;
				}
			}catch(e){
				isEmpty = true;
			}
		}
		if(!isEmpty){
			if(houi){
				if(houi<0){
					houi=0;
				}
				if(houi>23){
					houi=23;
				}
				if(houi<10){
					houi= '0'+houi;
				}
			}else{
				houi="00";
			}
			if(minutes){
				if(minutes<0){
					minutes=0;
				}
				if(minutes>59){
					minutes=59;
				}
				if(minutes<10){
					minutes = '0'+minutes;
				}
			}else{
				minutes="00";
			}
			this.attr('houi',houi+'');
			this.attr('minutes',minutes+'');
			this.attr('value',houi+':'+minutes);

		}else{
			this.attr('houi','');
			this.attr('minutes','');
			this.attr('value','');
		}
	};
	/**
	 * 通过keyup清除非数字和超长内容
	 */
	var keyup4clearNotNum = function(targetEl,evt){
		//事件，元素，int类型，是否不支持负数,长度 数据长度
		oui.clearNotNum4pc(evt,targetEl,true,true,2);
		
	};
	/**
	 * 时间改变事件
	 */
	var changeTime = function(targetEl,evt){
		
		var el = this.getEl();
		var id = this.attr('id');
		var $houi = $(el).find('#houi-'+id);
		var $minutes = $(el).find('#minutes-'+id);
		var houi= $houi.val();
		var minutes = $minutes.val(); 
		var lastV = this.attr('value'); 
		var tempV = (houi||"00")+":"+(minutes||"00");
		tempV = tempV.replace(/e/ig,'');
		this.attr('value',tempV);
		this.updateHoursAndMinutes();
		$(el).find('#houi-'+id).val(this.attr('houi'));
		$(el).find('#minutes-'+id).val(this.attr('minutes'));
		$(el).find('#'+id).val(this.attr('value'));
		this.triggerUpdate();
		this.triggerAfterUpdate();
	};

	var getData4DB = function(){
		var data4DB = Control.getProtoType().getData4DB.call(this);
		data4DB.display = this.getValue();
		return data4DB;
	};
})(window);





