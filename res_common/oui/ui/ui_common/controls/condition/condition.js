/** 简单搜索控件 */
(function(win, oui) {
	var Condition;
	var ctrl = oui.$.ctrl;
	var Control = ctrl.basecontrol;
	Condition = function (cfg) {
		Control.call(this, cfg);//必须继承控件超类

		this.attrs = this.attrs + ",callback,cancelback" ; //简单，组合，公共接口
		this.attrs = this.attrs+	",selectedFieldId,selectedFieldValue,selectedOperationValue,selectedFieldDisplay,hasNoEnumValue,noEnumValueDisplay,onlyOneItem,notClearEmptyCondition,hideButton,searchTitle";//简单条件所需属性
		this.attrs = this.attrs+',settingBtnText,title,maxLimitMsgTitle,maxLimitMsgTitle4all,confirmName,cancelName,conditions,align,maxConditionLenth,contentStyle,maxGroupConditionLenth,useOrRule,showConditionInfoAfter,onShowSelectedFieldOuiFormSysVar,onShowSelectedFieldOuiForm,onHideSelectedFieldOuiForm,onHideSelectedFieldOuiFormSysVar,onShowFields,onHideFields,isFilterSettingFields,afterRender4Condition,isShowCalcRule,calc,useSysVar4fiedValue,filterFields,findSysVars';//useSysVar4fiedValue:是否使用系统变量作为字段值 组合条件所需属性
		this.init = init;
		this.isSimpleCondition = isSimpleCondition;
		this.afterRender = afterRender;
		this.selectField = selectField; //选中指定字段
		this.showFields = showFields; //显示 可选字段列表
		this.hideFields = hideFields;//隐藏可选字段列表
		this.getField = getField; //根据 字段id获取对应的字段
		this.getSelectedField = getSelectedField;//根据字段id获取 选中的字段
		this.getField4OuiForm = getField4OuiForm; //根据字段id获取字段 ，该返回对象 ouiform控件所需配置属性
		this.findSysVars = findSysVars;//根据当前控件 获取对应的系统变量列表
		this.getSelectedFieldVarValue = getSelectedFieldVarValue;//找出当前条件字段的变量类型
		this.getSelectedField4OuiForm = getSelectedField4OuiForm;//根据当前选中字段id获取字段 ，该返回对象 ouiform控件所需配置属性
		this.onHideSelectedFieldOuiForm = onHideSelectedFieldOuiForm;
		this.onShowSelectedFieldOuiForm =onShowSelectedFieldOuiForm;

		this.onHideSelectedFieldOuiFormSysVar = onHideSelectedFieldOuiFormSysVar;
		this.onShowSelectedFieldOuiFormSysVar =onShowSelectedFieldOuiFormSysVar;

		this.isShowCalcRule = isShowCalcRule;
		this.fillback = fillback;// 回填 设置 选中字段id和选中字段值
		this.search = search; // 搜索执行逻辑
		this.mousedown4valueArea = mousedown4valueArea;//鼠标点击 条件值区域
		this.tap4showCancelBtn= tap4showCancelBtn;//移动端显示取消按钮
		this.keydown = keydown; //绑定keydown事件，用于处理 enter键事件
		this.getSelectedFieldControl = getSelectedFieldControl; //获取当前选中控件
		this.getSelectedFieldValue = getSelectedFieldValue ; //获取当前选中控件值
		this.getFieldIdByName = getFieldIdByName; //根据字段名 获取字段id
		this.getFormulaByFieldId = getFormulaByFieldId; // 根据字段id 获取 查询条件表达式
		this.getConditionsByFieldId = getConditionsByFieldId; // 根据字段id获取条件
		this.findConditionsByFieldId4Empty = findConditionsByFieldId4Empty;// 根据字段获取默认空值的条件项数组
		this.getFieldOperations =getFieldOperations //获取字段的表达式列表
		this.getSelectedFieldOperations = getSelectedFieldOperations; //获取选中列的所有 条件表达式列表
		this.getSelectedFieldSelectedOperation = getSelectedFieldSelectedOperation; //根据选中列获取 选中的条件表达式,默认为 =
		this.selectFieldOperation = selectFieldOperation ; //选中 条件表达式 触发值更新
		this.showOperations = showOperations // 显示 当前选择列的可选条件表达式列表
		this.hideOperations = hideOperations; // 隐藏 当前选择列的可选条件表达式列表
		this.cancel = cancel; //取消事件触发 条件重置
		this.getConditions4Simple = getConditions4Simple;
		/***** 组合条件特有 ****/
		this.showGroupConditions = showGroupConditions;// 显示组合条件列表
		this.add = add; //组合条件中添加 简单条件
		this.del = del;//组合条件中删除 简单条件
		this.accordion = accordion;// 组合条件中 展开 或者 收起简单条件
		this.calc = calc; //组合条件中 计算表达式 条件
		this.addRule = addRule; //给 or规则条件 中 增加 子条件 ，或者给 根增加子条件
		this.delRule = delRule; // 删除 指定规则 ，or规则,清空所有
		this.confirm4group = confirm4group ;// 组合条件中确定执行
		this.cancel4group = cancel4group;//组合条件中 取消执行
		this.hideGroupConditions = hideGroupConditions;// 隐藏条件弹出层
		this.getConditions4Group = getConditions4Group;
		this.getConditionInfo = getConditionInfo; //获取条件描述信息
		this.showConditionInfo = showConditionInfo;//  显示 条件表达式 详细信息
		/** 字段列表的显示或者隐藏 */
		this.showOrHideFields = showOrHideFields;
		this.showOrHideOperations = showOrHideOperations;
		this.showOrHideGroupConditions = showOrHideGroupConditions;
		this.update4conditionChange = update4conditionChange //条件值变更事件
		this.update4conditionFieldVarChange = update4conditionFieldVarChange;

		this.hasNoVarValue = hasNoVarValue;
		/** 移动端特殊0**/
		this.go2search = go2search;
		this.getAllControlSize = getAllControlSize;

		this.isRepeat = isRepeat;//条件组件是否平铺显示
		this.hasAccordion = hasAccordion;
		this.showOrHideMore = showOrHideMore;
		this.reset4group = reset4group;//移动端  showType=6的重置功能
	};
	Condition.templateHtml = [];

	/**
	 * oui-form控件渲染模板
	 * @type {string}
	 */
	Condition.fieldOuiFormTemplate4field ='{{if (oui.getByOuiId(ouiId).getSelectedField4OuiForm() !=null) }} ' +
		'<oui-form type="{{selectedField4OuiForm.controlType}}" ' +
		'otherAttrs="{conditionOuiId:{{ouiId}}}"'+
		'onUpdate="oui.getByOuiId({{ouiId}}).update4conditionChange" '+
		'showType="{{selectedField4OuiForm.showType}}" ' +
		'id="fieldValue-{{id}}-{{selectedField4OuiForm.id}}" ' +
		'{{if selectedField4OuiForm.parentControlName}}'+
		'parentControlName="{{selectedField4OuiForm.parentControlName}}" '+
		'weakDependence="{{selectedField4OuiForm.weakDependence}}" '+
		'{{/if}}'+
		'name="{{selectedField4OuiForm.name}}" '+
		'noEnumValueDisplay="{{noEnumValueDisplay}}"'+
		'{{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()=="control"}}'+
		'{{if (selectedField4OuiForm.controlType =="selectperson") && selectedFieldDisplay}}'+
		'data="{{oui.parseString(selectedFieldDisplay)}}" fillback="true" '+ //选人回填
		'{{else}}'+
		'data="{{oui.parseString(selectedField4OuiForm.data)}}" '+
		'{{/if}}'+
		'value="{{selectedFieldValue||""}}" '+
		'{{/if}}'+
		'{{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()!="control"}}'+
		'data="{{oui.parseString(selectedField4OuiForm.data)}}" '+
		'value="{{selectedFieldValue||""}}" '+
		'{{/if}}'+
		'placeholder="{{selectedField4OuiForm.placeholder||""}}"'+
		'class="{{selectedField4OuiForm.class}}" '+
		'style="{{selectedField4OuiForm.style}}" '+
		/** 选人选部门专用 **/
		'chooseType="{{selectedField4OuiForm.chooseType}}" '+
		'tabs="{{selectedField4OuiForm.tabs||""}}" '+
		'isMulti="{{(selectedField4OuiForm.isMulti+"")|| "false"}}" '+
		'filterSelf="false" '+//选人用
		'maxSize="100" '+//选人选部门用
		'validate="{{selectedField4OuiForm.validate||"{}"}}" '+
		/** 单选多选事件***/
		'hideInput="{{(selectedField4OuiForm.hideInput||true)+""}}" '+
		'onHide="oui.getByOuiId({{ouiId}}).onHideSelectedFieldOuiForm" ' +
		'onShow="oui.getByOuiId({{ouiId}}).onShowSelectedFieldOuiForm"'+
		/** 数字控件 格式输出 ****/
		'{{if selectedField4OuiForm.controlType =="number"}}'+
		'format="{{oui.getJsonAttr(selectedField4OuiForm.otherAttrs,"format")}}"'+
		'dotNum="{{selectedField4OuiForm.dotNum||"0"}}"'+
		'{{/if}}'+
		' >' +
		'</oui-form>' +
		'{{/if}}';
	/****
	 * 根据 字段，控件对象，开始值和结束值，获取条件数组
	 * @param field
	 * @param control
	 * @param startValue
	 * @param endValue
	 * @returns {Array}
	 */
	var getAreaConditionsByStartAndEndValue = function(field,control,startValue,endValue,startDisplay,endDisplay){
		startDisplay = startDisplay || startValue;
		endDisplay = endDisplay || endValue;
		var condition=[];
		var startCurr = {
			'field' :field.name,
			'expression' : '>=', //表达式的操作符
			'value' : startValue,
			formulaJson:control.attr('formulaJson'),
			'display':startDisplay,
			'dataType' : field.dataType
		};
		var endCurr = {
			'field' :field.name,
			'expression' : '<=', //表达式的操作符
			'value' : endValue,
			formulaJson:control.attr('formulaJson'),
			'display':endDisplay,
			'dataType' : field.dataType
		};
		var startArr = getConditions4ValueFieldControl.call(control,startCurr);
		var endArr = getConditions4ValueFieldControl.call(control,endCurr);
		condition = condition.concat(startArr);
		condition = condition.concat(endArr);
		return condition;
	};
	Condition.dateAreaEnum = {
		today:{
			value:1,
			display:'今天',
			getConditions:function(field,control){
				var startValue = oui.getDateStr3();
				var endValue = startValue;
				return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue);
			}
		},
		currWeek:{
			value:2,
			display:'本周',
			getConditions:function(field,control){
				var startEnd = oui.getWeekStartAndEnd();
				var startValue = startEnd[0];
				var endValue = startEnd[1];
				return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue);
			}
		},
		//lastWeek:{
		//	value:3,
		//	display:'上周',
		//	getConditions:function(field,control){
		//		var startEnd = oui.getWeekStartAndEnd(-1);
		//		var startValue = startEnd[0];
		//		var endValue = startEnd[1];
		//		return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue);
		//	}
		//},
		currMonth:{
			value:4,
			display:'本月',
			getConditions:function(field,control){
				var startEnd = oui.getMonthStartAndEnd();
				var startValue = startEnd[0];
				var endValue = startEnd[1];
				return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue);
			}
		},
		//lastMonth:{
		//	value:5,
		//	display:'上月',
		//	getConditions:function(field,control){
		//		var startEnd = oui.getMonthStartAndEnd(-1);
		//		var startValue = startEnd[0];
		//		var endValue = startEnd[1];
		//		return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue);
		//	}
		//},
		currYear:{
			value:6,
			display:'本年',
			getConditions:function(field,control){
				var startEnd = oui.getYearStartAndEnd();
				var startValue = startEnd[0];
				var endValue = startEnd[1];
				return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue);
			}
		},
		selectDate:{
			value:7,
			display:'选择范围',
			getConditions:function(field,control,startControl,endControl){
				var startValue = startControl.getValue();
				var startDisplay = getValueDisplay4Adapter(startControl);
				var endValue = endControl.getValue();
				var endDisplay = getValueDisplay4Adapter(endControl);
				return getAreaConditionsByStartAndEndValue(field,control,startValue,endValue,startDisplay,endDisplay);
			}
		}
	};
	Condition.dateAreaData = [
		Condition.dateAreaEnum.today,
		Condition.dateAreaEnum.currWeek,
		//Condition.dateAreaEnum.lastWeek,
		Condition.dateAreaEnum.currMonth,
		//Condition.dateAreaEnum.lastMonth,
		Condition.dateAreaEnum.currYear,
		Condition.dateAreaEnum.selectDate];
	Condition.dateAreaDataString = oui.parseString(Condition.dateAreaData);
	Condition.dateAreaData4MonthString = oui.parseString([
		Condition.dateAreaEnum.currMonth,
		Condition.dateAreaEnum.currYear,
		Condition.dateAreaEnum.selectDate]);

	/*** 选择区域 值改变事件触发 ***/

	Condition.fieldOuiFormTemplate = '' +
		'{{if (oui.getByOuiId(ouiId).getSelectedField4OuiForm() !=null) }} ' +
			'{{if selectedField4OuiForm.show4Area}}' +
			'<div class="select-radio-area">' +
			'{{if !oui.os.mobile}}'+
			'<oui-form type="radio" otherAttrs="{conditionOuiId:{{ouiId}}}" id="fieldValue-select-{{id}}-{{selectedField4OuiForm.id}}" showType="4" name="select_{{selectedField4OuiForm.name}}" data="{{selectedField4OuiForm.dataString}}"' +
			' onUpdate="oui.$.ctrl.condition.update4ConditionArea" ></oui-form> ' +
			'{{else}}'+
			//移动端用 singleselect
			'<oui-form type="singleselect" otherAttrs="{conditionOuiId:{{ouiId}}}" id="fieldValue-select-{{id}}-{{selectedField4OuiForm.id}}" showType="0" name="select_{{selectedField4OuiForm.name}}" data="{{selectedField4OuiForm.dataString}}"' +
			' onUpdate="oui.$.ctrl.condition.update4ConditionArea" ></oui-form> ' +

			'{{/if}}' +

			'</div>' +
			'<div class="select-control-area display_none"> ' +
			'<span class="start-info">从</span>' +
			'<oui-form type="{{selectedField4OuiForm.controlType}}" ' +
			'otherAttrs="{conditionOuiId:{{ouiId}}}"'+
			'onUpdate="oui.getByOuiId({{ouiId}}).update4conditionChange" '+
			'showType="{{selectedField4OuiForm.showType}}" ' +
			'id="fieldValue-start-{{id}}-{{selectedField4OuiForm.id}}" ' + //区间范围 -start
			'{{if selectedField4OuiForm.parentControlName}}'+
			'parentControlName="{{selectedField4OuiForm.parentControlName}}" '+
			'weakDependence="{{selectedField4OuiForm.weakDependence}}" '+
			'{{/if}}'+
			'name="start_{{selectedField4OuiForm.name}}" '+ //区间范围 start_
			'noEnumValueDisplay="{{noEnumValueDisplay}}"'+
			'{{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()=="control"}}'+
			'{{if (selectedField4OuiForm.controlType =="selectperson") && selectedFieldDisplay}}'+
			'data="{{oui.parseString(selectedFieldDisplay)}}" fillback="true" '+ //选人回填
			'{{else}}'+
			'data="{{oui.parseString(selectedField4OuiForm.data)}}" '+
			'{{/if}}'+
			'value="{{selectedFieldValue||""}}" '+
			'{{/if}}'+
			'{{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()!="control"}}'+
			'data="{{oui.parseString(selectedField4OuiForm.data)}}" '+
			'value="{{selectedFieldValue||""}}" '+
			'{{/if}}'+
			'placeholder="{{selectedField4OuiForm.placeholder||""}}"'+
			'class="{{selectedField4OuiForm.class}}" '+
			'style="{{selectedField4OuiForm.style}}" '+
			/** 选人选部门专用 **/
			'chooseType="{{selectedField4OuiForm.chooseType}}" '+
			'tabs="{{selectedField4OuiForm.tabs||""}}" '+
			'isMulti="{{(selectedField4OuiForm.isMulti+"")|| "false"}}" '+
			'filterSelf="false" '+//选人用
			'maxSize="100" '+//选人选部门用
			'validate="{{selectedField4OuiForm.validate||"{}"}}" '+
			/** 单选多选事件***/
			'hideInput="{{(selectedField4OuiForm.hideInput||true)+""}}" '+
			'onHide="oui.getByOuiId({{ouiId}}).onHideSelectedFieldOuiForm" ' +
			'onShow="oui.getByOuiId({{ouiId}}).onShowSelectedFieldOuiForm"'+
			/** 数字控件 格式输出 ****/
			'{{if selectedField4OuiForm.controlType =="number"}}'+
			'format="{{oui.getJsonAttr(selectedField4OuiForm.otherAttrs,"format")}}"'+
			'dotNum="{{selectedField4OuiForm.dotNum||"0"}}"'+
			'{{/if}}'+
			' >' +
			'</oui-form>' +

			'<span class="end-info">到</span>' +

			'<oui-form type="{{selectedField4OuiForm.controlType}}" ' +
			'otherAttrs="{conditionOuiId:{{ouiId}}}"'+
			'onUpdate="oui.getByOuiId({{ouiId}}).update4conditionChange" '+
			'showType="{{selectedField4OuiForm.showType}}" ' +
			'id="fieldValue-end-{{id}}-{{selectedField4OuiForm.id}}" ' + //区间范围 -end
			'{{if selectedField4OuiForm.parentControlName}}'+
			'parentControlName="{{selectedField4OuiForm.parentControlName}}" '+
			'weakDependence="{{selectedField4OuiForm.weakDependence}}" '+
			'{{/if}}'+
			'name="end_{{selectedField4OuiForm.name}}" '+ //区间范围 end_
			'noEnumValueDisplay="{{noEnumValueDisplay}}"'+
			'{{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()=="control"}}'+
			'{{if (selectedField4OuiForm.controlType =="selectperson") && selectedFieldDisplay}}'+
			'data="{{oui.parseString(selectedFieldDisplay)}}" fillback="true" '+ //选人回填
			'{{else}}'+
			'data="{{oui.parseString(selectedField4OuiForm.data)}}" '+
			'{{/if}}'+
			'value="{{selectedFieldValue||""}}" '+
			'{{/if}}'+
			'{{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()!="control"}}'+
			'data="{{oui.parseString(selectedField4OuiForm.data)}}" '+
			'value="{{selectedFieldValue||""}}" '+
			'{{/if}}'+
			'placeholder="{{selectedField4OuiForm.placeholder||""}}"'+
			'class="{{selectedField4OuiForm.class}}" '+
			'style="{{selectedField4OuiForm.style}}" '+
			/** 选人选部门专用 **/
			'chooseType="{{selectedField4OuiForm.chooseType}}" '+
			'tabs="{{selectedField4OuiForm.tabs||""}}" '+
			'isMulti="{{(selectedField4OuiForm.isMulti+"")|| "false"}}" '+
			'filterSelf="false" '+//选人用
			'maxSize="100" '+//选人选部门用
			'validate="{{selectedField4OuiForm.validate||"{}"}}" '+
			/** 单选多选事件***/
			'hideInput="{{(selectedField4OuiForm.hideInput||true)+""}}" '+
			'onHide="oui.getByOuiId({{ouiId}}).onHideSelectedFieldOuiForm" ' +
			'onShow="oui.getByOuiId({{ouiId}}).onShowSelectedFieldOuiForm"'+
			/** 数字控件 格式输出 ****/
			'{{if selectedField4OuiForm.controlType =="number"}}'+
			'format="{{oui.getJsonAttr(selectedField4OuiForm.otherAttrs,"format")}}"'+
			'dotNum="{{selectedField4OuiForm.dotNum||"0"}}"'+
			'{{/if}}'+
			' >' +
			'</oui-form>' +
			'</div>' +
			'{{else}}' +
			Condition.fieldOuiFormTemplate4field + //普通字段
			'{{/if}}' +
		'{{/if}}';
	/** 简单条件模板 **/
	Condition.templateHtml[0] ='<div class="simple-condition">'+
		'	<div class="simple-condition-fields-area {{selectedFieldId && ((selectedFieldId+"") =="-2" )?"error-border-highlight":""}} {{if (selectedFieldId) && ((selectedFieldId+"") !="-1")}}simple-condition-field-half{{/if}}">'+
		'{{if showType==10}}' +
		'   <div class="simple-condition-select-icon" title="请选择" {{clickName}}="oui.getByOuiId({{ouiId}}).showOrHideFields();">' +
		'	</div>' +
		'{{/if}}' +
		'	<div class="simple-condition-selected" title="{{oui.getByOuiId(ouiId).getField(selectedFieldId)==null?("请选择"):oui.getByOuiId(ouiId).getField(selectedFieldId).title}}" value="{{selectedFieldId||-1}}" {{showType!=10?clickName:"_clicktemp"}}="oui.getByOuiId({{ouiId}}).showOrHideFields();"> ' +
		'{{if selectedFieldId && ((selectedFieldId+"") =="-2" )}}'+
		'该字段已经被删除'+
		'{{else}}'+
		'{{ oui.getByOuiId(ouiId).getField(selectedFieldId)==null?("请选择"):oui.getByOuiId(ouiId).getField(selectedFieldId).title }}'+

		'{{/if}}' +
		'	</div>'+
		'		<div class="simple-condition-options display_none">'+
		'<div class="oui-condition-field-mask-layer" {{clickName}}="oui.getByOuiId({{ouiId}}).hideFields();"></div>'+
		'			<ul class="">' +
		'				<li class="{{oui.getByOuiId(ouiId).ouiGroupControl?"":"display_none"}}" title="请选择" value="-1"  {{clickName}}="oui.getByOuiId({{ouiId}}).selectField(-1);">请选择</li>'+
		'				{{each data as item index}}'+
		'					<li title="{{oui.escapeStringToHTML(item.title)}}" value="{{item.id}}"  {{clickName}}="oui.getByOuiId({{ouiId}}).selectField(\'{{item.id}}\');" >{{oui.escapeStringToHTML(item.title)}}</li>'+
		'				{{/each}}'+
		'			</ul>'+
		'		</div>'+
		'	</div>'+
		'	<div class="condition-operation-area">' +
		'		<div class="condition-operation-selected" {{clickName}}="oui.getByOuiId({{ouiId}}).showOrHideOperations();"> ' +
		'{{if selectedFieldId && ((selectedFieldId+"") =="-2" )}}'+
		'{{oui.getByOuiId(ouiId).getSelectedFieldSelectedOperation().display}}'+
		'{{else}}'+
		'{{ oui.getByOuiId(ouiId).getField(selectedFieldId)==null?("运算符"):oui.getByOuiId(ouiId).getSelectedFieldSelectedOperation().display }}'+
		'{{/if}}'+
		'		</div>'+
		'		<div class="condition-operation-options display_none">'+
		'			<div class="oui-condition-operation-mask-layer" {{clickName}}="oui.getByOuiId({{ouiId}}).hideOperations();"></div>'+
		'			<ul class="">'+
		'				{{each oui.getByOuiId(ouiId).getSelectedFieldOperations() as operation index}}'+
		'					<li title="{{oui.escapeStringToHTML(operation.display)}}" value="{{operation.value}}"  {{clickName}}="oui.getByOuiId({{ouiId}}).selectFieldOperation(\'{{operation.value}}\');" >{{oui.escapeStringToHTML(operation.display)}}</li>'+
		'				{{/each}}'+
		'			</ul>'+
		'		</div>'+
		'	</div>'+
			//系统变量区域
		'{{if (oui.getByOuiId(ouiId).getSelectedField4OuiForm() !=null)&&(oui.getByOuiId(ouiId).findSysVars().length>0) }} ' +
		' <div class="condition-var-area {{if oui.getByOuiId(ouiId).hasNoVarValue()}} error-border-highlight{{/if}} ">' +

		'<oui-form type="singleselect" showType="3" id="fieldVarValue-{{id}}-{{selectedField4OuiForm.id}}" ' +
		'value="{{oui.getByOuiId(ouiId).getSelectedFieldVarValue()}}" ' +
		'data="{{oui.parseString(oui.getByOuiId(ouiId).findSysVars())}}" ' +
		'class="{{selectedField4OuiForm.class}}" '+
		'hideInput="true" '+
		'otherAttrs="{conditionOuiId:{{ouiId}} }" '+
		'onShow="oui.getByOuiId({{ouiId}}).onShowSelectedFieldOuiFormSysVar"'+
		'onHide="oui.getByOuiId({{ouiId}}).onHideSelectedFieldOuiFormSysVar" ' +
		'onUpdate="oui.getByOuiId({{ouiId}}).update4conditionFieldVarChange" '+
		'></oui-form>'+
		'</div>'+
		'{{/if}}'+
		'	<div onkeydown="oui.getByOuiId({{ouiId}}).keydown(event);" ontap="oui.getByOuiId({{ouiId}}).tap4showCancelBtn()" onmousedown="oui.getByOuiId({{ouiId}}).mousedown4valueArea();" class="simple-condition-value-area {{if hasNoEnumValue}}error-border-highlight{{/if}} {{if oui.getByOuiId(ouiId).getSelectedFieldVarValue()!="control"}}display_none{{/if}}"  ' +
		' >'+
		Condition.fieldOuiFormTemplate+
		'	</div>'+
		'	<i class="oui-simple-search-submit-btn " title="{{searchTitle}}" {{clickName}}="oui.getByOuiId({{ouiId}}).search();"></i>'+
		'</div>'+
		'{{if !isPc}}'+
		'<div class="oui-condition-go2search {{showDefaultSearchBtn?"":"display_none"}}" {{clickName}}="oui.getByOuiId({{ouiId}}).go2search();" > <span class="search-icon"></span> 搜索数据</div>'+
		'<div class="oui-condition-cancel display_none" {{clickName}}="oui.getByOuiId({{ouiId}}).cancel();" >取消</div>'+
		'{{/if}}';

	/** 在组合条件中 其中一个简单条件的模板  */
	Condition.group4SimpleTemplate = '' +
		'{{if item&&item.or}}' +
		'<li class="group-condition-rules-or-li">' +

		'<div class="group-condition-rules">' +
		'<span class="group-condition-rules-or">或</span>'+
		'<span class="group-condition-rules-match">匹配以下规则 </span>'+
			//'<span class="group-condition-rules-addMsg">添加规则</span>'+
			//'<button {{clickName}}="oui.getByOuiId({{item.ouiGroupControl.getMap().ouiId}}).addRule({{item.parentId||"null"}},{{item.id||"null"}});">and</button>'+
			//'<button {{clickName}}="oui.getByOuiId({{item.ouiGroupControl.getMap().ouiId}}).addRule({{item.parentId||"null"}},{{item.id||"null"}},true);">or</button>'+
		'<button class="group-condition-del-group"  {{clickName}}="oui.getByOuiId({{item.ouiGroupControl.getMap().ouiId}}).delRule({{item.parentId||"null"}},{{item.id||"null"}});" >删除或关系</button> ' +
		'</div>'+
		'<ul condition-control-id="{{item.id}}" class="group-condition-rules-or-content">'+
		'{{=item.getHtml()}}'+
		'</ul>'+
		'</li>'+
		'{{else}}' +
		'<li class=\"{{(item.getSelectedField4OuiForm&&item.getSelectedField4OuiForm()&&item.getSelectedField4OuiForm().isOneLine)?"li-one-line":""}}\">' +
		'{{=item.getHtml()}} ' +
		'{{if item.hasAccordion&&item.hasAccordion()}}'+
		'<span class="group-condition-accordion"  {{clickName}}="oui.getByOuiId({{item.getMap().ouiId}}).accordion({{item.parentId||"null"}},{{item.id||"null"}});" >accordion</span> ' +
		'{{else}}'+
		'<span class="group-condition-accordion display_none"  {{clickName}}="oui.getByOuiId({{item.getMap().ouiId}}).accordion({{item.parentId||"null"}},{{item.id||"null"}});" >accordion</span> ' +
		'{{/if}}'+
		'<span class="group-condition-calc {{if !(item.isShowCalcRule && item.isShowCalcRule())}}display_none{{/if}}"  {{clickName}}="oui.getByOuiId({{item.getMap().ouiId}}).calc({{item.parentId||"null"}},{{item.id||"null"}});">设置计算</span>' +
		'<span class="group-condition-add"  {{clickName}}="oui.getByOuiId({{item.getMap().ouiId}}).add({{item.parentId||"null"}},{{item.id||"null"}});">add</span>' +
		'<span class="group-condition-del"  {{clickName}}="oui.getByOuiId({{item.getMap().ouiId}}).del({{item.parentId||"null"}},{{item.id||"null"}});" >del</span> ' +

		'</li>' +
		'{{/if}}';
	Condition._renderGroup4SimpleTemplate = template.compile(Condition.group4SimpleTemplate);
	/** 组合条件模板
	 * showGroupConditions(),
	 * add(index),
	 * del(index),
	 * confirm4group(),
	 * cancel4group();
	 * tips效果
	 * **/
	Condition.templateHtml[1] = '' +
		'<div class="group-condition {{hideButton?"group-condition-hide":""}} {{settingBtnText?"condition-setting-btn":""}}" {{clickName}}="oui.getByOuiId({{ouiId}}).showOrHideGroupConditions();"> {{settingBtnText||""}}</div>' +
		'<div class="group-condition-area condition-{{align||"left"}} display_none">' +
		'<div class="group-condition-triangle"></div>'+
		'<div class="group-condition-title" > {{title}}</div>' +
		'<div class="group-condition-preview {{if !useOrRule}}display_none{{/if}}"  >' +
		'<i class="group-condition-preview-title">规则预览</i>'+
		'<div class="group-condition-preview-content"></div>'+
		'</div>'+
		'<div class="oui-condition-group-mask-layer" {{clickName}}="oui.getByOuiId({{ouiId}}).hideGroupConditions();"></div>'+
		'<div class="oui-condition-content" style="{{contentStyle}}" >' +
		'{{if useOrRule}}'+
		'<div class="group-condition-rules">' +
		'<span class="group-condition-rules-match">匹配以下规则 </span>'+
		'<span class="group-condition-rules-addMsg">添加规则</span>'+
		'<button {{clickName}}="oui.getByOuiId({{ouiId}}).addRule(null,null);">并关系(and)</button>'+
		'<button {{clickName}}="oui.getByOuiId({{ouiId}}).addRule(null,null,true);">或关系(or)</button>'+
			//'<button class="group-condition-del-group"  {{clickName}}="" >删除规则</button> ' +
		'</div>'+
		'{{/if}}'+
		'<ul class="oui-condition-root">' +

		'{{each controls as item index}}'+
		Condition.group4SimpleTemplate+
		'{{/each}}'+
		'</ul>'+
		'<button class="group-condition-add-rule" onclick="oui.getByOuiId({{ouiId}}).addRule(null,null);">添加条件</button>'+
		'</div>'+
		'<div class="group-condition-foot-area" >' +
		'<span class="group-condition-more-btn display_none" {{clickName}}="oui.getByOuiId({{ouiId}}).showOrHideMore();">展开</span>' +
		'{{if oui.os.mobile}}' +
		'<span class="group-condition-cancel-btn"  {{clickName}}="oui.getByOuiId({{ouiId}}).cancel4group();">{{cancelName}}</span>' +
		'{{if (showType+"")=="6"}}'+
		'<span class="group-condition-cancel-btn"  {{clickName}}="oui.getByOuiId({{ouiId}}).reset4group();">重置</span>' +
		'{{/if}}'+
		'<span class="group-condition-confirm-btn" {{clickName}}="oui.getByOuiId({{ouiId}}).confirm4group();">{{confirmName}}</span>' +
		'{{else}}'+
		'<span class="group-condition-confirm-btn" {{clickName}}="oui.getByOuiId({{ouiId}}).confirm4group();">{{confirmName}}</span>' +
		'<span class="group-condition-cancel-btn"  {{clickName}}="oui.getByOuiId({{ouiId}}).cancel4group();">{{cancelName}}</span>' +
		'{{/if}}'+
		'</div>'+
		'</div>';

	/**弹框效果 **/
	Condition.templateHtml[2] = Condition.templateHtml[1];
	/**页面内部显示效果 **/
	Condition.templateHtml[3] = Condition.templateHtml[1];
	/** 条件tips平铺 显示效果 模板***/
	Condition.templateHtml[4] = Condition.templateHtml[1];

	/** 条件内嵌平铺 显示效果 模板***/
	Condition.templateHtml[5] = Condition.templateHtml[1];

	/** 条件弹窗平铺 显示效果 模板***/
	Condition.templateHtml[6] = Condition.templateHtml[1];

	/** 简单条件 10套模板 showType=10 *****/
	Condition.templateHtml[10] = Condition.templateHtml[0];
	Condition.FullName = "oui.$.ctrl.condition";//设置当前类全名
	ctrl["condition"] = Condition;//将控件类指定到特定命名空间下
	/*
	 *var configTemplate = {
	 // 搜索按钮回调函数
	 callback : function() { },
	 cancelback : function(){ },
	 // 表单控件集合
	 data : [ {
	 controlType : "",// 控件类型
	 showType : "",
	 id : "",//字段ID
	 name : "",//元素name
	 data : "",//控件数据源
	 value : "",
	 style : "",
	 filedStyle : "",
	 validate : "",
	 require : "",
	 title : "",// 控件标题
	 opt : "",//控件搜索可用操作符
	 dataType : ""// 数据库数据类型
	 } ]
	 *
	 */
	var getFieldIdByName = function(name){
		if(name ==-1){
			return -1;
		}
		var data = this.attr('data') ||[];
		for(var i= 0,len=data.length;i<len;i++){
			if(data[i].name == name){
				return data[i].id;
			}
		}
		return -2;
	};
	/** 显示 或者隐藏更多 字段****/
	var showOrHideMore = function(){
		var el = this.getEl();
		var $content = $(el).find('.oui-condition-content');
		if($content.hasClass('oui-condition-content-auto')){
			$content.removeClass('oui-condition-content-auto');
			$(el).find('.group-condition-more-btn').text('展开');
		}else{
			$content.addClass('oui-condition-content-auto');
			$(el).find('.group-condition-more-btn').text('收起');
		}
	};
	/*** 选中字段 类型为 raido或者multiselect 则需要显示 待选项是否可折叠 ****/
	var hasAccordion = function() {
		var selectedField4OuiForm = this.getSelectedField4OuiForm();
		if(selectedField4OuiForm && selectedField4OuiForm.controlType){
			if(selectedField4OuiForm.controlType =='radio' || selectedField4OuiForm.controlType=='multiselect'){
				if(typeof selectedField4OuiForm.hasAccordion !='undefined'){
					if((selectedField4OuiForm.hasAccordion+'') =='true'){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}
		}
		return false;
	};
	/** 条件是否平铺显示***/
	var isRepeat = function(){
		var showType = this.attr('showType');
		showType = parseInt(showType+'');
		if(showType == 4 || showType ==5 || showType==6){ //tips弹出的、 平铺显示的模板 4
			return true;
		}
		if(this.ouiGroupControl){
			showType  = this.ouiGroupControl.attr('showType');
			showType = parseInt(showType+'');
			if(showType == 4 || showType ==5 || showType==6){ //tips弹出的、 平铺显示的模板 4
				return true;
			}
		}
		return false;
	};
	var isSimpleCondition = function () {
        var showType = this.attr('showType');
        showType = parseInt(showType+'');
		if(showType==0 || showType==10){
			return true;
		}else{
			return false;
		}
    };
	var afterRender = function(){
		var el = this.getEl();

		var controls = this.attr('controls')||[];
		$(el).find('oui-form').each(function(){
			oui.parseByDom(this);
		});
		/**渲染已经删除的字段的 右侧 值显示 ***/
		var showType = this.attr('showType');
		showType = parseInt(showType+'');
		if((showType+'') !='0') { // 组合规则条件  渲染时需要渲染 条件 表达式

			/** 组合条件特定样式处理 ******/
			switch (showType){

				case 1:// 1,4 tips
				case 4:
					if(showType ==1){
						$(el).addClass('selector-condition');
					}else{
						$(el).addClass('paved-condition');
					}
					$(el).addClass('tips-condition');
					break;
				case 2://2,5 dialog
				case 5:
					if(showType ==2){
						$(el).addClass('selector-condition');
					}else{
						$(el).addClass('paved-condition');
					}
					$(el).addClass('dialog-condition');
					break;
				case 3://3,6 内嵌
				case 6:
					if(showType ==3){
						$(el).addClass('selector-condition');
					}else{
						$(el).addClass('paved-condition');
					}
					$(el).addClass('inner-condition');
					break;
			}
			if(this.ouiGroupControl){
				var controlMap = this.ouiGroupControl.attr('controlMap') ||{};

				var afterRender4Condition = this.ouiGroupControl.attr('afterRender4Condition');
				if(afterRender4Condition){
					if(typeof afterRender4Condition =='string'){
						afterRender4Condition = eval(afterRender4Condition);
					}
				}
				if(afterRender4Condition){
					for(var i in controlMap){
						if(controlMap[i]&&controlMap[i].attr){
							afterRender4Condition&&afterRender4Condition(this.ouiGroupControl,controlMap[i]);
						}
					}
				}
				/** 平铺所有条件场景 ***/
				if([4,5,6].indexOf(showType)>-1){
					if(!this.attr('inited4repeat')){
						this.attr('inited4repeat',true);
						this.fillback([]);//默认填充所有
					}
					/** 内嵌平铺  需要做判断 条件内容高度，如果大于120 就显示，否则不显示***/
					if(showType ==6){
						var $root = $(this.ouiGroupControl.getEl()).find('.oui-condition-root');
						var height =$root[0].scrollHeight ||0;
						if(height>118){//118高度为三行高度，此处写死,超过三行高度，需要显示 更多按钮
							$(this.ouiGroupControl.getEl()).find('.group-condition-more-btn').removeClass('display_none');
						}else{
							$(this.ouiGroupControl.getEl()).find('.group-condition-more-btn').addClass('display_none');
						}
					}
				}
			}
		}
		if(this.isSimpleCondition()){
			var me = this;
			window.setTimeout(function(){
				/**如果简单查询只有一项并且 ，选中项为空，则执行默认选中这项 ****/
				var data = me.attr('data');
				data = oui.parseJson(data ||'[]');
				var selectedField = me.getSelectedField();
				if((selectedField == null) && (!me.ouiGroupControl)&&data.length){
					me.selectField(data[0].id);
					if(data.length<=1){
						if(showType ==10){
                            $(me.getEl()).find('.simple-condition').addClass('simple-condition-onlyOne');
                        }
					}
				}
			},10);
		}
		this.showConditionInfo();

	};
	/** 显示条件表达式 详细信息 */
	var showConditionInfo = function(){
		var showType = this.attr('showType');
		if((showType+'') !='0'){ // 组合规则条件  渲染时需要渲染 条件 表达式
			var info= this.getConditionInfo();
			$(this.getEl()).find('.group-condition-preview-content').html(info);
			var showConditionInfoAfter = this.attr('showConditionInfoAfter');
			showConditionInfoAfter&&showConditionInfoAfter(info,this);
		}
	};
	/**获取总控件数 **/
	var getAllControlSize = function(){
		var controlMap = this.ouiGroupControl.attr('controlMap');
		var count =0;
		for(var i in controlMap){
			count++;
		}
		return count;
	};
	/**递归创建 Or的条件列表 **/
	var buildChildControls = function(clickName,isPc,data4OuiForm,data,display,condition,ouiControl){
		var control =null;
		var controlMap = ouiControl.attr('controlMap');
		if(!controlMap){
			ouiControl.attr('controlMap',{});
			controlMap = ouiControl.attr('controlMap');
		}
		if(condition.expression == 'or'){
			var conditions = condition.value ||[];
			control = {
				id:newId4Condition(),
				isPc:isPc,
				ouiGroupControl:ouiControl,
				clickName:clickName,
				controls:[],
				or:true,
				hasAccordion:function(){
					return false;
				},
				getConditions: function () {
					var childControls = this.controls ||[] ;
					var arr = [];
					for(var i= 0,len=childControls.length;i<len;i++){
						arr = arr.concat(childControls[i].getConditions());
					}
					if(!arr.length){
						return arr;
					}
					var orCondition = [{
						"expression":"or",
						"value":arr
					}];
					return orCondition;
				},
				getHtml:function(){
					var controls = this.controls;
					var arr = [];
					var currIsPc = this.isPc;
					var currClickName = this.clickName;
					for(var i= 0,len=controls.length;i<len;i++){
						arr.push( Condition._renderGroup4SimpleTemplate({
							isPc:currIsPc,
							ouiId:(controls[i]&&controls[i].attr)?controls[i].attr('ouiId'):'',
							clickName:currClickName,
							item:controls[i]
						}) );
					}
					return arr.join('');
				}
			};
			if(conditions.length ==0){
				var curr = oui.create({
					clickName:clickName,
					isPc:isPc,
					data:data,
					data4OuiForm:data4OuiForm,
					showType:0,
					selectedFieldId:-1, //字段id
					selectedFieldValue:'', //条件值
					selectedFieldDisplay:'',
					selectedOperationValue:'', //条件表达式
					type:'condition'
				});

				curr.id = newId4Condition();
				curr.parentId = control.id;
				control.controls.push(curr);
				controlMap[curr.id] = curr;
				curr.ouiGroupControl =ouiControl;

				init4simple.call(curr);

			}else{
				for (var i= 0,len=conditions.length;i<len;i++){
					var curr = buildChildControls(clickName,isPc,data4OuiForm,data,conditions[i].display ||'',conditions[i],ouiControl);
					curr.parentId = control.id;
					control.controls.push(curr);
				}
			}
			controlMap[control.id] = control;
		}else{
			var conditionValue;
			if(condition.type == Condition.FormRelationActionCopyTypeEnum.formula.value){
				conditionValue= Condition.CalcExprKey ; //计算表达式的key
			}else{
				conditionValue = condition.value;
			}
			control = oui.create({
				clickName:clickName,
				isPc:isPc,
				data:data,
				data4OuiForm:data4OuiForm,
				showType:0,
				noEnumValueDisplay:ouiControl.attr('noEnumValueDisplay')||"",
				selectedFieldDisplay:display,
				selectedFieldId:ouiControl.getFieldIdByName(condition.field), //字段id
				selectedFieldValue:conditionValue, //条件值
				selectedOperationValue:condition.expression, //条件表达式
				type:'condition'
			});
			if(condition.type && (condition.type == Condition.FormRelationActionCopyTypeEnum.formula.value)){
				control.attr('formulaJson',condition.formulaJson);
			}
			control.ouiGroupControl = ouiControl;
			control.id =  newId4Condition();
			controlMap[control.id] = control;
			init4simple.call(control);
		}
		return control;
	};
	/***计算表达式的key */
	Condition.CalcExprKey = 'calcExpr';
	Condition.FormRelationActionCopyTypeEnum ={
		copy:{
			value:1,
			desc:"字段拷贝"
		},
		formula:{
			value:2,
			desc:"计算式"
		}
	};
	Condition.controlNewId = 0;
	var newId4Condition = function(){
		Condition.controlNewId++;
		return Condition.controlNewId;
	};
	var sortFields4RepeatGroup = function(){
		var showType = this.attr('showType');
		showType = parseInt(showType+'');
		var data = this.attr('data') ||[];
		if(showType ==6){ //平铺场景 ，对 单选，多选，下拉 排列到后面
			var endTypes = 'radio,singleselect,multiselect,checkbox,datepicker'.split(',');
			var endArr = [];
			var startArr = oui.removeFromArrayBy(data,function(item){
				if(endTypes.indexOf(item.controlType)>-1){
					if(item.controlType =='datepicker'){
						//日期或者日期时间，需要单独显示一行
						item.isOneLine = true; //处理 单独行显示
						endArr.push(item);
						return true;
					}else{
						var showMode = OuiFormAdapterUtil.findFieldEnumShowMode4Adapter(item);
						if(showMode == OuiFormAdapterUtil.enumDataShowMode.repeat.value){
							item.isOneLine = true; //处理 单独行显示
							endArr.push(item);
							return true;
						}
					}

				}
			});
			data = startArr.concat(endArr);
			this.attr('data',data);
		}
		return data;
	};
	/** 私有方法 开始******************************************************************************************************/
	/** 组合条件**/
	var init4group = function(){
		this.ouiGroupControl = this;
		this.attr('useOrRule');
		if(this.attr('useOrRule') =='true' || this.attr('useOrRule') === true){
			this.attr('useOrRule',true);
		}else{
			this.attr('useOrRule',false);
		}
		var title = this.attr('title') ||"设置筛选条件" ; //标题名称
		var confirmName = this.attr('confirmName') ||"查询"; //查询按钮名称
		var cancelName = this.attr('cancelName'); //取消按钮名称
		if((this.attr('showType')+'') == '6'){
			if(!cancelName){
				if(!oui.os.mobile){ //pc上才默认重置
					cancelName = '重置';
				}
			}
		}
		cancelName= cancelName ||'取消' ; //取消按钮名称
		var maxConditionLenth = this.attr('maxConditionLenth') ||'8';
		var maxGroupConditionLenth = this.attr('maxGroupConditionLenth') ||'20'; //所有条件总数
		var showConditionInfoAfter = this.attr('showConditionInfoAfter');
		if(showConditionInfoAfter){
			showConditionInfoAfter = win.eval(showConditionInfoAfter);
		}
		maxConditionLenth = parseInt(maxConditionLenth);
		maxGroupConditionLenth = parseInt(maxGroupConditionLenth);
		this.attr({
			maxGroupConditionLenth:maxGroupConditionLenth,
			maxConditionLenth:maxConditionLenth,
			title:title,
			showConditionInfoAfter:showConditionInfoAfter,
			confirmName:confirmName,
			cancelName:cancelName
		});
		var conditions = this.attr('conditions') || "[]";
		if(conditions =='null'){
			conditions = "[]";
		}

		this.getConditions = getConditions4Group; //组合条件获取 方法覆盖
		conditions = oui.parseJson(conditions);
		buildGroupByConditions.call(this,conditions);

		this.fillback = fillback4group; //组合控件的回填方法覆盖
		this.cancel = cancel4group;
		this.isShowGroupConditions = false;


	};
	/****
	 * 根据条件列表 回填 条件组
	 */
	var buildGroupByConditions = function(conditions){
		var controlMap = this.attr('controlMap');
		if(controlMap){
			for(var i in controlMap){
				if(controlMap[i]&&controlMap[i].attr){
					oui.clearByOuiId(controlMap[i].attr('ouiId'));
				}
			}
			delete controlMap;
		}
		controlMap ={};
		this.attr('controlMap',controlMap); //清空controlMap
		//var oldControls = this.attr('controls');
		//if(oldControls && oldControls.length>0 ){
		//	for(var i= 0,len=oldControls.length;i<len;i++){
		//		oui.clearByOuiId(oldControls[i].attr('ouiId'));
		//	}
		//}
		var controls = [];
		var data = this.attr('data');
		var data4OuiForm = this.attr('data4OuiForm');
		var clickName = this.attr('clickName');
		var isPc = this.attr('isPc');

		conditions = conditions ||[];
		for(var i= 0,len=conditions.length;i<len;i++){
			var display = conditions[i].display ||'';
			var control =  buildChildControls(clickName,isPc,data4OuiForm,data,display,conditions[i],this);
			controlMap[control.id] = control;
			control.parentId = null;
			controls.push(control);
		}
		if(controls.length ==0){
			var control = oui.create({
				clickName:clickName,
				isPc:isPc,
				data:data,
				data4OuiForm:data4OuiForm,
				showType:0,
				selectedFieldId:-1, //字段id
				selectedFieldValue:'', //条件值
				selectedOperationValue:'', //条件表达式
				type:'condition'
			});
			control.id = newId4Condition();
			controlMap[control.id] = control;
			control.parentId = null;
			control.ouiGroupControl = this;
			init4simple.call(control);
			controls.push(control);

		}
		this.attr('controls',controls);
	};
	/** 根据字段id获取 空值条件项***/
	var findConditionsByFieldId4Empty = function(fieldId){
		var condition = [];
		if((fieldId+'') =='-1'){
			return condition;
		}
		/** 获取字段 */
		var field = this.getField(fieldId);
		var value = '';
		var display = '';
		var expression = this.getFormulaByFieldId(fieldId);
		var dataType =field.dataType;
		var newDataType ='';
		if(expression =='in' || expression =='notIn'){
			switch (dataType){
				case oui.dataTypeEnum.STRING.name:
					newDataType = oui.dataTypeEnum.ARRAYS_STRING.name;
					break;
				case oui.dataTypeEnum.NUMBER_INTEGER.name:
					newDataType = oui.dataTypeEnum.ARRAYS_INTEGER.name;
					break;
				case oui.dataTypeEnum.NUMBER_LONG.name:
					newDataType = oui.dataTypeEnum.ARRAYS_LONG.name;
					break;
				case oui.dataTypeEnum.ARRAYS_LONG.name:
					newDataType = oui.dataTypeEnum.ARRAYS_LONG.name;
					break;
				default :
					newDataType = oui.dataTypeEnum.ARRAYS_STRING.name;
					break;
			}
			dataType = newDataType;
		}
		var curr = {
			'field' :field.name,
			'expression' : expression, //表达式的操作符
			'value' : value,
			formulaJson:this.attr('formulaJson'),
			'display':display,
			'dataType' : dataType
		};
		if(this.attr('formulaJson')){
			curr.type = Condition.FormRelationActionCopyTypeEnum.formula.value;
		}else{
			curr.type= Condition.FormRelationActionCopyTypeEnum.copy.value;
		}
		condition.push(curr);
		return condition;
	};
	/**
	 * 组合条件 回填
	 * @param conditons
	 */
	var fillback4group = function(conditions){
		var showType = this.attr('showType');
		showType = parseInt(showType+'');

		/** 条件平铺模式 需要 显示所有 待选条件*****/
		if([4,5,6].indexOf(showType)>-1){
			var data4ouiForm = this.attr('data4OuiForm') ||[];
			var all = [];
			var paramConLen = (conditions||[]).length;
			//根据传入的条件 与 全量条件进行合并
			for(var i= 0,len=data4ouiForm.length;i<len;i++){
				var field = data4ouiForm[i].name;
				var currFind = null;
				if(paramConLen){
					/** 在 现有参数条件数组中找 如果找到则 追加找到的条件项**/
					currFind = oui.findOneFromArrayBy(conditions||[],function(item,idx){
						if(item.field == field){
							return true;
						}
					});
				}
				var currs = [];
				if(currFind){//找到现有条件项 直接追加
					currs.push(currFind);
				}else{ //根据 字段id或者字段name找默认空值条件
					currs = this.findConditionsByFieldId4Empty(data4ouiForm[i].id || data4ouiForm[i].name) ||[];
				}
				all = all.concat(currs);
			}
			conditions = all;
		}
		buildGroupByConditions.call(this,conditions);
		this.render();
		this.isShowGroupConditions = false;
	};
	/** 简单条件初始化 */
	var init4simple=function(){
		//console.log('初始化简单条件');
		//console.log(this);
		//console.log(this.getMap());
		//console.log('初始化简单条件结束');
		var selectedField4OuiForm = this.getSelectedField4OuiForm();

		if(selectedField4OuiForm){
			var controlType = selectedField4OuiForm.controlType;
			if(controlType =='singleselect' ){
				var data = oui.parseJson(selectedField4OuiForm.data||[]);
				var selectedFieldValue = this.attr('selectedFieldValue');
				if(selectedFieldValue && ((selectedFieldValue+'') !='-1') &&(!selectedField4OuiForm.isCheckBox)){
					/** 选中值与待选项不一致，并且 不是由 开关转换而来的***/
					var hasValue = false;
					for(var i= 0,len=data.length;i<len;i++){
						if(selectedFieldValue && ((selectedFieldValue+'') == data[i].value)){
							hasValue = true;
							if(data[i].isDeleted){
								hasValue = false;
							}
							break;
						}
					}
					if(!hasValue){
						if(!this.attr('formulaJson')){
							this.attr('hasNoEnumValue',true);
						}else if(selectedFieldValue == Condition.CalcExprKey){
							data.splice(0,0,{value:Condition.CalcExprKey,display:'计算表达式'});
						}
					}

				}
			}
		}
		this.attr('selectedField4OuiForm',selectedField4OuiForm);
		if(!this.attr('selectedOperationValue')){
			this.attr('selectedOperationValue','='); //默认相等表达式
		}
		/***不清空 条件值为空的条件,false:清空，true：不清空 *****/
		var notClearEmptyCondition= false; //默认值处理
		if(!this.ouiGroupControl){ //组合条件中 包含的简单条件空值不清空条件， 只有简单条件的空值需要清空
			notClearEmptyCondition = this.attr('notClearEmptyCondition') ||'false';
		}else{
			var groupShowType = this.ouiGroupControl.attr('showType');
			groupShowType = parseInt(groupShowType+"");
			if(groupShowType ==4 || groupShowType ==5 || groupShowType ==6){
				//平铺模式，清除空值条件
				notClearEmptyCondition = this.attr('notClearEmptyCondition') ||'false';
			}else{
				notClearEmptyCondition = this.attr('notClearEmptyCondition') ||'true';
			}

		}

		if(typeof notClearEmptyCondition =='string'){
			if(notClearEmptyCondition =='true'){
				notClearEmptyCondition = true;
			}else{
				notClearEmptyCondition = false;
			}
		}
		this.attr('notClearEmptyCondition',notClearEmptyCondition);
		this.attr('showDefaultSearchBtn',true);
		this.getConditions = getConditions4Simple; //赋值
		this.isShowFields = false;
		this.isShowOperations = false;
	};
	/**  ouiForm控件显示隐藏 事件***/
	var onHideSelectedFieldOuiForm =function(ouiFormControl){
		var otherAttrs = ouiFormControl.attr('otherAttrs');
		var conditionOuiId = oui.getJsonAttr(otherAttrs,'conditionOuiId');
		var conditonControl = oui.getByOuiId(conditionOuiId);
		if(!conditonControl){
			return ;
		}
		var ouiGroupControl = conditonControl.ouiGroupControl;
		if(ouiGroupControl){
			var curr_onHideSelectedFieldOuiForm = ouiGroupControl.attr('onHideSelectedFieldOuiForm');
			if(curr_onHideSelectedFieldOuiForm){
				if(typeof curr_onHideSelectedFieldOuiForm =='string'){
					curr_onHideSelectedFieldOuiForm = eval(curr_onHideSelectedFieldOuiForm);
				}
				curr_onHideSelectedFieldOuiForm(ouiGroupControl,conditonControl, ouiFormControl);
			}
		}
	};
	var onShowSelectedFieldOuiFormSysVar = function (ouiFormSysVarControl){
		var otherAttrs = ouiFormSysVarControl.attr('otherAttrs');
		var conditionOuiId = oui.getJsonAttr(otherAttrs,'conditionOuiId');
		var conditonControl = oui.getByOuiId(conditionOuiId);
		if(!conditonControl){
			return ;
		}
		var ouiGroupControl = conditonControl.ouiGroupControl;
		if(ouiGroupControl){

			var useSysVar4fiedValue = ouiGroupControl.attr('useSysVar4fiedValue');
			if(useSysVar4fiedValue){
				if(typeof useSysVar4fiedValue =='string'){
					if(useSysVar4fiedValue=='true'){
						useSysVar4fiedValue = true;
					}else{
						useSysVar4fiedValue = false;
					}
				}
			}

			/** 如果使用了系统变量， 操作符opers 过滤 变量的配置，则执行 过滤逻辑***/
			var controlType = ouiFormSysVarControl.attr('type');
			if(useSysVar4fiedValue  &&(controlType=='singleselect')){
				var expv = conditonControl.getSelectedFieldSelectedOperation();
				if(expv && expv.value ) {
					var vars = conditonControl.findSysVars();
					var temp = [];
					$.each(vars,function(){
						if(!this.opers){
							temp.push(this);
						}else{
							if(this.opers&& (this.opers.split(',').indexOf(expv.value)>-1)){
								temp.push(this);
							}
						}
					});
					ouiFormSysVarControl.attr('data',temp);
					ouiFormSysVarControl.render();
				}
			}
			var curr_onShowSelectedFieldOuiForm = ouiGroupControl.attr('onShowSelectedFieldOuiFormSysVar');
			if(curr_onShowSelectedFieldOuiForm){
				if(typeof curr_onShowSelectedFieldOuiForm =='string'){
					curr_onShowSelectedFieldOuiForm = eval(curr_onShowSelectedFieldOuiForm);
				}
				curr_onShowSelectedFieldOuiForm(ouiGroupControl,conditonControl, ouiFormSysVarControl);
			}
		}
	};
	var onHideSelectedFieldOuiFormSysVar = function (ouiFormSysVarControl){
		var otherAttrs = ouiFormSysVarControl.attr('otherAttrs');
		var conditionOuiId = oui.getJsonAttr(otherAttrs,'conditionOuiId');
		var conditonControl = oui.getByOuiId(conditionOuiId);
		if(!conditonControl){
			return ;
		}
		var ouiGroupControl = conditonControl.ouiGroupControl;
		if(ouiGroupControl){
			var curr_onHideSelectedFieldOuiForm = ouiGroupControl.attr('onHideSelectedFieldOuiFormSysVar');
			if(curr_onHideSelectedFieldOuiForm){
				if(typeof curr_onHideSelectedFieldOuiForm =='string'){
					curr_onHideSelectedFieldOuiForm = eval(curr_onHideSelectedFieldOuiForm);
				}
				curr_onHideSelectedFieldOuiForm(ouiGroupControl,conditonControl, ouiFormSysVarControl);
			}
		}
	};
	/** ouiForm控件的显示隐藏事件***/
	var onShowSelectedFieldOuiForm = function(ouiFormControl){
		var otherAttrs = ouiFormControl.attr('otherAttrs');
		var conditionOuiId = oui.getJsonAttr(otherAttrs,'conditionOuiId');
		var conditonControl = oui.getByOuiId(conditionOuiId);
		if(!conditonControl){
			return ;
		}
		var ouiGroupControl = conditonControl.ouiGroupControl;
		if(ouiGroupControl){
			var curr_onShowSelectedFieldOuiForm = ouiGroupControl.attr('onShowSelectedFieldOuiForm');
			if(curr_onShowSelectedFieldOuiForm){
				if(typeof curr_onShowSelectedFieldOuiForm =='string'){
					curr_onShowSelectedFieldOuiForm = eval(curr_onShowSelectedFieldOuiForm);
				}
				curr_onShowSelectedFieldOuiForm(ouiGroupControl,conditonControl, ouiFormControl);
			}
		}
	};
	var getAttrsByDom = function(dom,attrs){
		var arr = (typeof attrs =='string')?attrs.split(','):attrs;
		var cfg = {};
		for(var i= 0,len=arr.length;i<len;i++){
			cfg[arr[i]] = $(dom).attr(arr[i]);
		}
		return cfg;
	};
	Condition.newId = 0;
	Condition.getNewFieldId = function(){
		Condition.newId++;
		return Condition.newId;
	};
	/** 私有方法 结束******************************************************************************************************/
	/**
	 * 解析输入参数
	 */
	var init = function(renderBeforeEl){
		//data,callback,cancelback
		var data = this.attr('data');
		if(data){
			//if(true){
			//	throw new Error('请采用标签配置 字段列表');
			//	return ;
			//}
			data = oui.parseJson(data);
			for(var i= 0,len=data.length;i<len;i++){
				if(!data[i].id){
					data[i].id = Condition.getNewFieldId();
				}
				/* 默认是弱依赖***/
				if((typeof data[i].weakDependence =='undefined') || (typeof data[i].weakDependence =='string' && (!data[i].weakDependence) )){
					data[i].weakDependence = true;
				}
				data[i].weakDependence= data[i].weakDependence+'';
			}
		}else{
			data = [];
			var attrs = 'id,name,parentControlName,weakDependence,title,controlType,showType,dataType,opt,data,style,class,isMulti,otherAttrs,placeholder,dotNum,hasAccordion'.split(',');
			$(renderBeforeEl).find('oui-field').each(function(){
				var curr = getAttrsByDom(this,attrs);
				if(!curr.id){
					curr.id =Condition.getNewFieldId();
				}
				/** 默认是弱依赖***/
				curr.weakDependence = (curr.weakDependence+'') ||'true';
				if((typeof curr.weakDependence =='undefined') || (typeof curr.weakDependence =='string' && (!curr.weakDependence) )){
					curr.weakDependence = true;
				}
				curr.weakDependence= curr.weakDependence+'';
				data.push(curr);
			});
		}
		var filterFields = this.attr('filterFields');
		if(filterFields){
			if(typeof filterFields =='string'){
				filterFields = eval(filterFields);
			}
			this.attr('filterFields',filterFields);
			data =oui.removeFromArrayBy(data,filterFields);
		}

		var callback = this.attr('callback');
		var cancelback = this.attr('cancelback');
		if(callback){
			if(typeof callback =='string'){
				callback = win.eval(callback);
			}
		}
		if(cancelback){
			if(typeof  cancelback =='string'){
				cancelback = win.eval(cancelback);
			}
		}
		var data4ouiForm = [];
		this.attr({
			callback:callback ||function(){},
			cancelback:cancelback||''
		});
		var clickName ='onclick';
		var isPc = true;
		if(oui.os.mobile){
			clickName = 'onTap';
			isPc = false;
		}
		this.attr('clickName',clickName);
		this.attr('isPc',isPc);

		this.attr('data',data ||[]);
		var showType = parseInt(this.attr('showType')+'');
		if(showType ==6){ //对平铺 场景 的字段进行排序
			data = sortFields4RepeatGroup.call(this);
		}
		this.attr('data4OuiForm',OuiFormAdapterUtil.cloneFields4adapter(data||[],this));
		if(showType ==0||showType==10){
			var onlyOneItem = this.attr('onlyOneItem');
			if(typeof onlyOneItem =='string'){
				if(onlyOneItem =='true'){
					onlyOneItem = true;
				}else{
					onlyOneItem = false;
				}
				this.attr('onlyOneItem',onlyOneItem);
			}
			init4simple.call(this); //初始化 简单条件
		}else{
			init4group.call(this); // 初始化 组合条件
		}
	};
	/**
	 * 根据字段id获取 需要渲染oui-form控件的 field对象 该对象中可以做各类控件的适配 在后端往前端数据回填时用
	 * @param
	 * @returns {*}
	 */
	var getField4OuiForm = function(fieldId){
		if(fieldId ==-1){
			return null;
		}
		var controls4OuiForm = this.attr('data4OuiForm')||[];
		var control4OuiForm ;
		for(var i= 0,len=controls4OuiForm.length;i<len;i++){
			if(controls4OuiForm[i].id == fieldId){
				control4OuiForm = controls4OuiForm[i];
				break;
			}
		}
		var expressValue = this.getSelectedFieldSelectedOperation();
		var field = this.getField(this.attr('selectedFieldId'));
		if(field && (field.controlType=='singleselect' || field.controlType=='radio' || field.controlType=='imagesingle' || field.controlType=='selectperson'|| field.controlType=='selectdept'   )){
			/*** 单选，下拉，图片单选，选人，选部门在从库到前端（回填）需要适配in notIn ****/
			if((expressValue&&expressValue.value =='in') || (expressValue&&expressValue.value =='notIn')){
				/** 下拉，单选，图片单选 适配为多选; ***/
				if(field.controlType=='singleselect' || field.controlType=='radio' || field.controlType=='imagesingle'){
					OuiFormControlAdapter.multiselect.adapter(control4OuiForm,this,expressValue&&expressValue.value);
				}else{
					/***选人 选部门 根据in或者 notIn适配为多选 *****/
					OuiFormControlAdapter[field.controlType].adapter(control4OuiForm,this,expressValue&&expressValue.value);
					control4OuiForm.isMulti=true;
				}
			}else{
				control4OuiForm.showType = field.showType;
				control4OuiForm.controlType = field.controlType;
				OuiFormControlAdapter[field.controlType].adapter(control4OuiForm,this,expressValue&&expressValue.value);
			}
			this.attr('selectedField4OuiForm',control4OuiForm);
			return control4OuiForm;
		}
		return control4OuiForm;
	};
	/**
	 * 获取当前选中的 控件
	 * @returns {*}
	 */
	var getSelectedField4OuiForm = function(){
		var selectedField4OuiForm = this.getField4OuiForm(this.attr('selectedFieldId'));
		if(selectedField4OuiForm != this.attr('selectedField4OuiForm')){
			this.attr('selectedField4OuiForm',selectedField4OuiForm);
		}
		return selectedField4OuiForm;
	};

	/**获取当前选中控件的 系统变量值 ***/
	var getSelectedFieldVarValue = function(){
		var defaultVarValue = 'control';//系统变量的默认值为control ，从控件选择
		var fieldValue = this.attr('selectedFieldValue');
		var vars = this.findSysVars();
		for(var i= 0,len=vars.length;i<len;i++){
			if(vars[i].value == fieldValue){
				return fieldValue;
			}
		}
		return defaultVarValue;
	};
	/***获取当前字段对应的系统变量 **/
	var findSysVars = function(){
		var vars =[];
		var useSysVar4fiedValue = this.ouiGroupControl==null?this.attr('useSysVar4fiedValue'):  this.ouiGroupControl.attr('useSysVar4fiedValue');
		var findSysVars_fun = this.ouiGroupControl==null?this.attr('findSysVars'):  this.ouiGroupControl.attr('findSysVars');
		if(!useSysVar4fiedValue){
			return vars;
		}
		if((useSysVar4fiedValue==='false') || (useSysVar4fiedValue ===false)){
			return vars;
		}
		var selectedField4OuiForm = this.getSelectedField4OuiForm();
		if(!selectedField4OuiForm){
			return vars;
		}
		var field = this.getField(this.attr('selectedFieldId'));
		if(!field){
			return vars;
		}
		var tempVars = [];
		/**自定义系统变量 *****/
		if(findSysVars_fun){
			if(typeof findSysVars_fun == 'string'){
				findSysVars_fun = eval(findSysVars_fun);
			}
			tempVars = findSysVars_fun( field,this.ouiGroupControl==null?this:this.ouiGroupControl,this.attr('selectedFieldValue')) ||[] ;
		}
		var formControlType =field.controlType;
		if(OuiFormControlAdapter[formControlType] && OuiFormControlAdapter[formControlType].findSysVarsData){
			vars = OuiFormControlAdapter[formControlType].findSysVarsData()||[] ;
		}
		if(tempVars&&tempVars.length){
			if( !vars.length){
				vars.push({
					value:'control',
					display:'手工输入'
				});
			}
			vars = vars.concat(tempVars);//控件的系统变量+自定义变量(可能是表单字段)
		}
		return vars;
	};
	/**
	 * 根据字段id获取可选的条件列表
	 * @param fieldId
	 * @returns {Array}
	 */
	var getFieldOperations = function(fieldId){
		var field = this.getField(fieldId);
		var arr = [];
		if(!field){
			return arr;
		}
		var operations = field.opt ||'';
		operations= operations.split(',');
		for(var i= 0,len=operations.length;i<len;i++){
			var display = operations[i];
			if(operations[i] == "like" || operations[i] == "all"){
				display = "包含";
			}
			if(operations[i] == "notIn"  ){
				display = "not in";
			}
			arr.push({
				display:display,
				value:operations[i]
			});
		}
		return arr;
	};
	/*** 根据操作符获取  显示 表达式 ***/
	var getDisplay4Operation = function(operations,value){
		for(var i= 0,len=operations.length;i<len;i++){
			if(operations[i].value == value){
				return operations[i].display;
			}
		}
		return value;
	};
	/****
	 * 选中 操作符 = ,>=, like,all 等
	 */
	var selectFieldOperation = function(v){
		var el = this.getEl();
		var lastOperationValue = this.attr('selectedOperationValue');
		this.attr('selectedOperationValue',v);
		$(el).find('.condition-operation-selected').html(this.getSelectedFieldSelectedOperation().display); //更新选中行的显示值
		this.hideOperations();
		if(this.ouiGroupControl){
			var selectedFieldId = this.attr('selectedFieldId');
			var id = this.attr('id');
			var ouiControlId = 'fieldValue-'+id+'-'+selectedFieldId;
			var field = this.getSelectedField();

			/*** 对 条件表达式 为 in对  单选、下拉，图片单选 选人，选部门 进行适配 ***/
			if(((v=='in' || lastOperationValue =='in') ||(v=='notIn' || lastOperationValue =='notIn') ) && (
				field.controlType=='radio' || field.controlType=='singleselect' || field.controlType=='imagesingle' || field.controlType=='selectperson'|| field.controlType=='selectdept' ) ){

				/***选人、选部门 不需要重新渲染，但是需要修改为多选 ******/
				if(field.controlType =='selectperson' || field.controlType=='selectdept'){
					this.attr('selectedFieldValue','');
					this.fillback(selectedFieldId,'',v,'');
					var currControl = oui.getById(ouiControlId);
					if(v =='in'|| v =='notIn'){

						currControl&&currControl.attr('isMulti',true);
					}else{
						currControl&&currControl.attr('isMulti',false);
					}
				}else{
					var currControl = oui.getById(ouiControlId);
					/*** 单选 下拉 图片单选  则执行回填 ****/
					currControl&&currControl.attr('value','');
					this.attr('selectedFieldValue','');
					this.fillback(selectedFieldId,'',v,'');
				}
				//this.render();

			}else{
				/****** 选人、选部门 需要处理 控件属性为单选  ****************/
				if(field.controlType =='selectperson' || field.controlType=='selectdept'){
					currControl&&currControl.attr('isMulti',false);
				}
			}

			this.ouiGroupControl.attr('selectedControlOuiId',this.attr('ouiId'));
			this.ouiGroupControl.attr('updateType','operation');
			this.ouiGroupControl.showConditionInfo();
			this.ouiGroupControl.triggerUpdate();
			this.ouiGroupControl.triggerAfterUpdate();

		}

		this.triggerUpdate();
		this.triggerAfterUpdate();

		return false;
	};

	/** 当前选择列的可选条件表达式列表 **/
	var showOperations = function(){
		var operations = this.getSelectedFieldOperations();
		if((!operations) || (!operations.length) ){
			return ;
		}
		this.isShowOperations = true;
		var el = this.getEl();
		$(el).find('.condition-operation-options').removeClass('display_none');
		/** 吸附渲染 **/
		oui.follow4fixed( $(el).find('.condition-operation-area')[0],$(el).find('.condition-operation-options')[0]);

		return false;
	};
	/**
	 * 隐藏条件表达式 列表
	 */
	var hideOperations =function(){
		this.isShowOperations = false;
		var el = this.getEl();
		$(el).find('.condition-operation-options').addClass('display_none');
		return false;
	};
	/**  获取选中列的所有 条件表达式列表*/
	var getSelectedFieldOperations =function(){
		return  this.getFieldOperations(this.attr('selectedFieldId'));
	};
	/** 根据选中列获取 选中的条件表达式,默认为 = */
	var getSelectedFieldSelectedOperation = function(){
		var operations = this.getSelectedFieldOperations();
		var selectedOperationValue  = this.attr('selectedOperationValue');
		if(!selectedOperationValue){
			var defaultV = this.getFormulaByFieldId(this.attr('selectedFieldId'));
			selectedOperationValue = defaultV;
			this.attr('selectedOperationValue',selectedOperationValue);
		}
		var oper = {
			display:'=',
			value:'='
		};
		for(var i= 0,len = operations.length;i<len;i++){
			if(operations[i].value == selectedOperationValue){
				oper = operations[i];
				break;
			}
		}
		if(oper.value !=selectedOperationValue){
			this.attr('selectedOperationValue',oper.value);
		}
		return oper;
	};
	var getSelectedField = function(){
		return this.getField(this.attr('selectedFieldId'));
	};
	/** 更新控件适配器 属性配置 **/
	var OuiFormAdapterUtil={
		enumDataShowMode:{
			repeat:{
				value:1,
				minSize:0,
				maxSize:6 //枚举平铺显示时，需要选项最大长度限制【<=6】
			},
			def:{
				value:2,
				minSize:7,
				maxSize:20 //枚举默认下拉模式显示【>6,<=20】
			},
			dialog:{
				value:3,
				minSize:21 //枚举弹框下拉模式显示【>=21】
			}
		},
		cloneFields4adapter:function(fields,currControl){
			var arr = [];
			for(var i= 0,len=fields.length;i<len;i++){
				var field = {};
				field = $.extend(true,{},fields[i]);
				field.data = oui.parseJson(field.data ||[]);
				arr.push(field);

				if(! OuiFormControlAdapter[fields[i].controlType] ){
					continue;
				}
				if(typeof OuiFormControlAdapter[fields[i].controlType].adapter !='function' ){
					continue;
				}
				OuiFormControlAdapter[fields[i].controlType].adapter(field,currControl);

			}
			return arr;
		},
		update:function(field,cfg){
			for(var i in cfg){
				field[i] = cfg[i];
			}
		},
		/** 根据字段 的data长度 获取对应的显示方式******/
		findFieldEnumShowMode4Adapter:function(field){
			var data  = oui.parseJson(field.data ||[]);
			var len =data.length ||0;
			if(len <= OuiFormAdapterUtil.enumDataShowMode.repeat.maxSize){
				return OuiFormAdapterUtil.enumDataShowMode.repeat.value;
			}else if(len <= OuiFormAdapterUtil.enumDataShowMode.def.maxSize){
				return OuiFormAdapterUtil.enumDataShowMode.def.value;
			}else{
				return OuiFormAdapterUtil.enumDataShowMode.dialog.value;
			}
		}
	};
	//OuiFormControlAdapter.number.adapter(field);
	/*** 根据不同控件类型 实现 适配器方法 **/
	var OuiFormControlAdapter = {
		/** 外部控件适配**/
		'outercontrol':{
			adapter:function(field,currControl){

				var cfg ={
					controlType:'textfield',
					validate:{
						maxLength:200,
						failMode:'tips'
					}
				};
				cfg.validate = oui.parseString(cfg.validate);
				OuiFormAdapterUtil.update(field,cfg);
			}
		},
		'numberonline':{
			adapter:function(field,currControl){
				//"maxLength":15,"failMode":"tips","dotNum":' + $el.attr("dotNum") + '
				if(field.dotNum){
					if(typeof field.dotNum =='string'){
						field.dotNum = parseInt(field.dotNum);
					}
				}else{
					field.dotNum=0;
				}
				var cfg ={
					controlType:'number',
					validate:{
						maxLength:15,
						failMode:'tips',
						dotNum : field.dotNum
					}
				};
				cfg.validate = oui.parseString(cfg.validate);
				OuiFormAdapterUtil.update(field,cfg);
			}
		},
		'number':{
			adapter:function(field,currControl){
				//"maxLength":15,"failMode":"tips","dotNum":' + $el.attr("dotNum") + '
				if(field.dotNum){
					if(typeof field.dotNum =='string'){
						field.dotNum = parseInt(field.dotNum);
					}
				}else{
					field.dotNum=0;
				}
				var cfg ={
					validate:{
						maxLength:15,
						failMode:'tips',
						dotNum :field.dotNum
					}
				};
				cfg.validate = oui.parseString(cfg.validate);
				OuiFormAdapterUtil.update(field,cfg);
			}
		},
		'datepicker':{
			sysVars:[
				{
					value:'control',
					display:'选择日期'
				},
				{
					value:'date_currentDate',
					display:'系统日期'
				}
			],
			findSysVarsData:function(){
				return this.sysVars;
			},
			adapter:function(field,currControl){
				var showType =0;
				var lastShowType=field.showType;
				if(field.dataType =='DATETIME'){
					showType=1;
				}else if(field.dataType =='DATE'){

					if(lastShowType){
						showType = lastShowType;
					}else{
						showType=0;
					}
				}
				if(currControl&&currControl.isRepeat()){
					if(lastShowType){
						showType = lastShowType;
					}else{
						showType=0;
					}
					field.dataType ='DATE';
					field.show4Area = true;//显示为日期区间
					if((showType+'') =='4'){
						field.dataString = Condition.dateAreaData4MonthString;
					}else{
						field.dataString = Condition.dateAreaDataString;
					}
				}
				OuiFormAdapterUtil.update(field,{
					showType:showType
				});
			}
		},
		'multiselect':{
			adapter:function(field,currControl){
				//$el.attr("showType", "3").attr("hideInput", true);
				var showType =3; //下拉多选的模板
				var showMode = OuiFormAdapterUtil.findFieldEnumShowMode4Adapter(field);
				if(showMode == OuiFormAdapterUtil.enumDataShowMode.dialog.value){ //弹框模式
					showType = 4;//多选弹框下拉模式
				}
				if(currControl&&currControl.isRepeat()){

					if(showMode == OuiFormAdapterUtil.enumDataShowMode.repeat.value){
						showType = 6;// 多选 平铺的模板
					}
				}
				OuiFormAdapterUtil.update(field,{
					controlType:'multiselect',
					showType:showType,
					hideInput:true
				});
			}
		},
		'imagemulti':{
			adapter:function(field,currControl){
				var showType =3; //下拉多选的模板
				var showMode = OuiFormAdapterUtil.findFieldEnumShowMode4Adapter(field);
				if(showMode == OuiFormAdapterUtil.enumDataShowMode.dialog.value){ //弹框模式
					showType = 4;//多选弹框下拉模式
				}
				if(currControl&&currControl.isRepeat()){
					if(showMode == OuiFormAdapterUtil.enumDataShowMode.repeat.value){
						showType = 6;// 多选 平铺的模板
					}
				}
				OuiFormAdapterUtil.update(field,{
					controlType:'multiselect',
					showType:showType,
					hideInput:true
				});
			}
		},
		'radio':{
			adapter:function(field,currControl){

				var showType =3; //下拉选的模板
				var controlType ='singleselect';
				var showMode = OuiFormAdapterUtil.findFieldEnumShowMode4Adapter(field);
				if(showMode == OuiFormAdapterUtil.enumDataShowMode.dialog.value){ //弹框模式
					//弹框下拉模式
					showType = 5; //单选弹框下拉
				}
				if(currControl&&currControl.isRepeat()){
					if(showMode == OuiFormAdapterUtil.enumDataShowMode.repeat.value){
						showType = 4;// radio 平铺的模板
						controlType = 'radio';
					}
				}

				var datas =field.data ||[];
				for(var n = 0, l = datas.length; n < l; n++){
					if(datas[n].text == ""){
						datas[n].text = "其他";
						break;
					}
				}
				OuiFormAdapterUtil.update(field,{
					controlType:controlType,
					data:datas,
					showType:showType,
					hideInput:true
				});
			}
		},
		'imagesingle':{

			adapter:function(field,currControl){
				var showType =3; //下拉单选的模板
				var controlType ='singleselect';
				var showMode = OuiFormAdapterUtil.findFieldEnumShowMode4Adapter(field);
				if(showMode == OuiFormAdapterUtil.enumDataShowMode.dialog.value){ //弹框模式
					//弹框下拉模式
					showType = 5; //单选弹框下拉
				}
				if(currControl&&currControl.isRepeat()){
					if(showMode == OuiFormAdapterUtil.enumDataShowMode.repeat.value){
						showType = 4;// radio 平铺的模板
						controlType = 'radio';
					}
				}
				OuiFormAdapterUtil.update(field,{
					controlType:controlType,
					showType:showType,
					hideInput:true
				});
			}
		},
		'singleselect':{
			adapter:function(field,currControl){
				var showType =3; //下拉多选的模板
				var controlType ='singleselect';
				var showMode = OuiFormAdapterUtil.findFieldEnumShowMode4Adapter(field);
				if(showMode == OuiFormAdapterUtil.enumDataShowMode.dialog.value){ //弹框模式
					//弹框下拉模式
					showType = 5; //单选弹框下拉
				}
				if(currControl&&currControl.isRepeat()){
					if(showMode == OuiFormAdapterUtil.enumDataShowMode.repeat.value){
						showType = 4;// radio 平铺的模板
						controlType = 'radio';
					}

				}
				OuiFormAdapterUtil.update(field,{
					showType:showType,
					controlType:controlType,
					hideInput:true
				});
			}
		},
		'score':{
			adapter:function(field,currControl){
				var data = [];
				for(var n = 1, l = 5; n <= l; n++){
					data.push({ display : n + "分", value : n, sortValue : n });
				}
				var showType =3; //下拉多选的模板
				var controlType ='singleselect'
				if(currControl&&currControl.isRepeat()){
					showType = 4;// radio 平铺的模板
					controlType = 'radio';
				}
				OuiFormAdapterUtil.update(field,{
					data:data,
					controlType:controlType,
					showType:showType,
					hideInput:true
				});
			}
		},
		'checkbox':{
			adapter:function(field,currControl){
				var data =[{display: "开", sortValue:0, value: "true"}, {display: "关", sortValue:1, value: "false"}];
				var showType =3; //下拉多选的模板
				var controlType ='singleselect'
				if(currControl&&currControl.isRepeat()){
					showType = 4;// radio 平铺的模板
					controlType = 'radio';
				}
				OuiFormAdapterUtil.update(field,{
					hasAccordion:false,
					data:data,
					isCheckBox:true,
					controlType:controlType,
					showType:showType,
					hideInput:true
				});
			}
		},
		'serialnumber':{
			adapter:function(field,currControl){
				OuiFormAdapterUtil.update(field,{
					showType:0,
					controlType:'textfield'
				});
			}
		},
		'selectperson':{
			sysVars:[
				{
					value:'control',
					display:'选人'
				},
				{
					value:'org_currentUser',
					display:'当前登录人'
				}
			],
			findSysVarsData:function(){
				return this.sysVars;
			},
			adapter:function(field,currControl,expresValue){
				if((expresValue&&expresValue =='in') || (expresValue&&expresValue =='notIn')){

					OuiFormAdapterUtil.update(field,{
						showType:6,//自定义选择类型
						chooseType:'person,role,department',//自定义选择人和自定义角色
						tabs:'1,2,3,5,6,7,8',//剔除相对角色
						isMulti:true,
						filterSelf:false
					});
				}else{
					OuiFormAdapterUtil.update(field,{
						showType:6,//自定义选择类型
						chooseType:'person',//自定义选择人和自定义角色
						tabs:'1,2,3,5',//剔除相对角色
						isMulti:false,
						filterSelf:false
					});
				}
			}
		},
		/** 选部门适配 **/
		'selectdept':{
			sysVars:[
				{
					value:'control',
					display:'选部门'
				},
				{
					value:'org_currentUserDepartment',
					opers:'=,!=,like',
					display:'当前登录人所属部门'
				},
				{
					value:'org_currentUserPartTimeDepartment',
					opers:'in,notIn',
					display:'当前登录人所属兼职部门'
				}
			],
			findSysVarsData:function(){
				return this.sysVars;
			},
			adapter:function(field,currControl){
				OuiFormAdapterUtil.update(field,{
					showType:4,
					isMulti:false,
					tabs:'1,2,3,6,7,8',//剔除相对角色
					controlType:'selectperson'
				});
			}
		}

	};


	/******控件业务方法 *****************************/
	/** 显示 可选择的字段 **/
	var showFields = function(){
		this.isShowFields = true;
		var el = this.getEl();
		if(this.ouiGroupControl){
			var onShowFields = this.ouiGroupControl.attr('onShowFields');
			var isFilterSettingFields = this.ouiGroupControl.attr('isFilterSettingFields');
			if(typeof isFilterSettingFields =='string'){
				if(isFilterSettingFields=='true'){
					isFilterSettingFields = true;
				}else{
					isFilterSettingFields = false;
				}
			}
			/** 平铺场景 ，需要过滤相同字段****/
			if(this.ouiGroupControl.isRepeat()){
				isFilterSettingFields = true;
			}
			/** 过滤已经设置的字段显示***/
			if(isFilterSettingFields){
				var conditions = this.ouiGroupControl.getConditions() ||[];
				var $options = $(el).find('.simple-condition-options');
				$options.find('li').removeClass('display_none');
				var showLiSelector = [];
				var fieldId;
				for(var i= 0,len=conditions.length;i<len;i++){
					fieldId = this.getFieldIdByName(conditions[i].field);
					if(fieldId){
						showLiSelector.push('li[value='+fieldId+']');
					}
				}
				$options.find(showLiSelector.join(',')).addClass('display_none');
			}
			if(onShowFields){
				if(typeof onShowFields =='string'){
					onShowFields = eval(onShowFields);
				}
				onShowFields && onShowFields(this.ouiGroupControl,this);
			}
		}else{
			var onShowFields = this.attr('onShowFields');
			if(onShowFields){
				if(typeof onShowFields =='string'){
					onShowFields = eval(onShowFields);
				}
				onShowFields && onShowFields(this,this);
			}
		}
		$(el).find('.simple-condition-options').removeClass('display_none');
		$(el).find('.simple-condition-options').css('height','auto');
		/**吸附渲染功能 ***/
		oui.follow4fixed( $(el).find('.simple-condition-fields-area')[0],$(el).find('.simple-condition-options')[0]);
		return false;
	};
	/** 字段列表的显示或者隐藏 */
	var showOrHideFields = function(){
		if(!this.isShowFields){
			this.showFields();

		}else{
			this.hideFields();
		}
		return false;
	};
	/** 表达式的显示或者隐藏**/
	var showOrHideOperations = function(){
		if(!this.isShowOperations){
			this.showOperations();
		}else{
			this.hideOperations();
		}
		return false;
	};
	var showOrHideGroupConditions = function(){
		if(!this.isShowGroupConditions){
			this.showGroupConditions();
		}else{
			this.hideGroupConditions();
		}
		return false;
	};
	/** 隐藏可选择的字段 **/
	var hideFields = function(){
		this.isShowFields = false;
		var el = this.getEl();
		if(this.ouiGroupControl){
			var onHideFields = this.ouiGroupControl.attr('onHideFields');
			if(onHideFields){
				if(typeof onHideFields =='string'){
					onHideFields = eval(onHideFields);
				}
				onHideFields && onHideFields(this.ouiGroupControl,this);
			}
		}
		$(el).find('.simple-condition-options').addClass('display_none');
		return false;
	};
	/** 选中某个字段 **/
	var selectField = function(fieldId){
		oui.targetElBlur();
		var data = this.attr('data');
		var currFieldId =  this.attr('selectedFieldId');
		this.attr('showDefaultSearchBtn',false);
		if(currFieldId !== fieldId){
			this.fillback(fieldId,'');
		}else{
			this.hideFields();
		}
		this.ouiGroupControl && this.ouiGroupControl.showConditionInfo();
		if(this.ouiGroupControl){
			$(this.getEl()).parent().find('.group-condition-calc').addClass('display_none');
			if(this.isShowCalcRule()){
				$(this.getEl()).parent().find('.group-condition-calc').removeClass('display_none');
			}
			/** 是否显示  展开或者折叠**/
			$(this.getEl()).parent().find('.group-condition-accordion').addClass('display_none');
			if(this.hasAccordion()){
				$(this.getEl()).parent().find('.group-condition-accordion').removeClass('display_none');
			}

			this.ouiGroupControl.attr('selectedControlOuiId',this.attr('ouiId'));
			this.ouiGroupControl.attr('updateType','field');
			this.ouiGroupControl.triggerUpdate();
			this.ouiGroupControl.triggerAfterUpdate();

		}
		this.triggerUpdate();
		this.triggerAfterUpdate();

		return false;
	};
	/**
	 * 回填 简单条件
	 * @param fieldId
	 * @param fieldValue
	 */
	var fillback = function(fieldId,fieldValue,operationValue,display4ouiform){
		var lastId = this.attr('selectedFieldId');
		if(this.getField(fieldId)==null){
			var tempFieldId = this.getFieldIdByName(fieldId);
			if(tempFieldId+""){
				if((tempFieldId+"")!="-1"){
					fieldId = tempFieldId;
				}
			}
		}

		this.attr('selectedFieldId',fieldId);
		this.attr('selectedField4OuiForm',this.getSelectedField4OuiForm());
		this.attr('selectedFieldValue',fieldValue);
		this.attr('selectedFieldDisplay',display4ouiform||'');
		if(!operationValue){
			this.attr('selectedOperationValue',this.getFormulaByFieldId(fieldId));
		}else{
			this.attr('selectedOperationValue',operationValue);
		}
		if((lastId) && ((lastId +'') != '-1')){
			oui.clearById('fieldValue-'+this.attr('id')+'-'+lastId);
		}
		this.attr('showDefaultSearchBtn',false);
		this.isShowFields = false;
		this.isShowOperations = false;
		this.render();
		oui.parse();
		if(((fieldId+"") !='-1') && (fieldValue+"")){
			var el = this.getEl();
			var $searchBtn= $(el).find('.oui-simple-search-submit-btn');
			$searchBtn.addClass('oui-simple-search-close');
		}
	};

	/**
	 * 根据字段id获取字段
	 * @param fieldId
	 */
	var getField = function(fieldId){
		if(fieldId ==-1){
			return null;
		}
		var data = this.attr('data');
		if(!data.length){
			return null;
		}
		for(var i= 0,len = data.length;i<len;i++){
			if(data[i].id == fieldId){
				return data[i];
			}
		}
		return null;
	};
	/**
	 * 获取当前控件
	 * @returns {null}
	 */
	var getSelectedFieldControl = function(){
		var selectedFieldId = this.attr('selectedFieldId');
		if(!selectedFieldId){
			return null;
		}
		var id = this.attr('id');
		var ouiControlId = 'fieldValue-'+id+'-'+selectedFieldId;
		var selectedControl = oui.getById(ouiControlId);
		return selectedControl;
	};
	/**
	 * 获取当前控件值
	 * @returns {*}
	 */
	var getSelectedFieldValue = function(){
		var selectedFieldValue = this.attr('selectedFieldValue');
		var selectedControl = this.getSelectedFieldControl();
		if(selectedControl ==null){
			return '';
		}
		var value = selectedControl.attr('value');
		if(value !==selectedFieldValue){
			this.attr('selectedFieldValue',value);
		}
		return value;
	};
	/**
	 * 获取条件表达式
	 * @param fieldId
	 * @returns {string}
	 */
	var getFormulaByFieldId  = function(fieldId){
		var field = this.getField(fieldId);
		var formula = "=";
		if(!field){
			return formula;
		}
		if(field.optCustom && field.optCustom == true){
			formula = field.opt;
		}else{
			switch(field.controlType){
				case "hidden":
				case "cellphone":
				case "textfield":
				case "serialnumber":
					formula = "like";
					break;
				case "multiselect":
				case "imagemulti":
					formula = "all";
					break;
				default:
					break;
			}
		}

		return formula;
	};
	/** oui-form onUpdate事件被触发 **/
	var  update4conditionChange = function(control){
		if(!control){
			return ;
		}
		var otherAttrs = control.attr('otherAttrs') ||'{}';
		otherAttrs = oui.parseJson(otherAttrs);
		var conditionOuiId = otherAttrs.conditionOuiId ;
		if(!conditionOuiId){
			return ;
		}
		var conditonControl = oui.getByOuiId(conditionOuiId);
		if(!conditonControl){
			return ;
		}

		var ouiGroupControl = conditonControl.ouiGroupControl;
		ouiGroupControl&&ouiGroupControl.showConditionInfo();
		if(ouiGroupControl){

			if(ouiGroupControl.isRepeat()){
				//平铺场景，需要 清楚错误信息,如日期区间 开始时间大于结束时间的场景
				$(ouiGroupControl.getEl()).find('.error-border-highlight').removeClass('error-border-highlight');
			}
			ouiGroupControl.attr('selectedControlOuiId',conditonControl.attr('ouiId'));
			ouiGroupControl.attr('updateType','fieldValue');
			ouiGroupControl.triggerUpdate();
			ouiGroupControl.triggerAfterUpdate();

		}else{
			var $searchBtn= $(conditonControl.getEl()).find('.oui-simple-search-submit-btn');
			if($searchBtn.hasClass('oui-simple-search-close')){
				//清除当前值 并搜索 请选择
				$searchBtn.removeClass('oui-simple-search-close');
			}
			//if(oui.os.mobile){
			//    conditonControl.tap4showCancelBtn();
			//}

		}
	};
	/**条件表达式右侧 系统变量 改变后 控制 条件值显示与隐藏 以及值改变 ***/
	var update4conditionFieldVarChange = function(control){
		if(!control){
			return ;
		}
		var otherAttrs = control.attr('otherAttrs') ||'{}';
		otherAttrs = oui.parseJson(otherAttrs);
		var conditionOuiId = otherAttrs.conditionOuiId ;
		if(!conditionOuiId){
			return ;
		}
		var conditonControl = oui.getByOuiId(conditionOuiId);
		if(!conditonControl){
			return ;
		}
		var ouiGroupControl = conditonControl.ouiGroupControl;
		if(ouiGroupControl){
			var $fieldValueArea = $(control.getEl()).parent().next();
			if(control.attr('value') == 'control'){ //如果值为控件选择 则显示 值控件 否则隐藏
				$fieldValueArea.removeClass('display_none');

				//error-border-highlight
				var fieldValueIds = control.attr('id').split('-');
				fieldValueIds[0]= 'fieldValue';
				var fieldValueId = fieldValueIds.join('-');
				var fieldValueControl = oui.getById(fieldValueId);
				fieldValueControl&&fieldValueControl.setValue('');
				$fieldValueArea.removeClass("error-border-highlight");
			}else{
				$fieldValueArea.addClass('display_none');

				var fieldValueIds = control.attr('id').split('-');
				fieldValueIds[0]= 'fieldValue';
				var fieldValueId = fieldValueIds.join('-');
				var fieldValueControl = oui.getById(fieldValueId);
				fieldValueControl&&fieldValueControl.setValue('');
			}
			ouiGroupControl.showConditionInfo();
			ouiGroupControl.attr('selectedControlOuiId',conditonControl.attr('ouiId'));
			ouiGroupControl.attr('updateType','fieldVarValue');
			ouiGroupControl.triggerUpdate();
			ouiGroupControl.triggerAfterUpdate();
		}
	};

	var getConditions4ValueFieldControl = function(curr){
		var conditions = [];
		if(this.attr('formulaJson')){
			curr.type = Condition.FormRelationActionCopyTypeEnum.formula.value;
		}else{
			curr.type= Condition.FormRelationActionCopyTypeEnum.copy.value;
		}
		var notClearEmptyCondition = this.attr('notClearEmptyCondition');
		if(notClearEmptyCondition){
			conditions.push(curr);
		}else{
			/** 如果配置为false，或者默认不配置 则需要清空 空值的条件，判断值是否为空，如果不为空则追加条件，否则不增加条件****/
			if((curr.value+"")){
				conditions.push(curr);
			}
		}
		return conditions;
	};
	/** 控件 区间范围 值改变处理脚本******/
	Condition.update4ConditionArea = function(control){
		var otherAttrs = control.attr('otherAttrs');
		otherAttrs = oui.parseJson(otherAttrs);
		var conditionOuiId= otherAttrs.conditionOuiId;
		var conditionControl = oui.getByOuiId(conditionOuiId);
		var value = control.getValue();
		var $conditonEl = $(conditionControl.getEl());
		if(value){
			if((value+'') !=(Condition.dateAreaEnum.selectDate.value+'')){ //选择范围
				$conditonEl.find('.select-control-area').addClass('display_none');
			}else{
				$conditonEl.find('.select-control-area').removeClass('display_none');
				//清空 日期区域值
				var id  = control.attr('id');
				var startId = id.replace('select','start');
				var endId = id.replace('select','end');
				var startControl = oui.getById(startId);
				var endControl = oui.getById(endId);
				startControl.setValue('');
				endControl.setValue('');
			}
		}else{
			$conditonEl.find('.select-control-area').addClass('display_none')
		}
	};
	var findConditionsByDateAreaEnumValue = function(value,field,control){
		if(!value){
			return [];
		}
		var area =Condition.dateAreaEnum;
		var enum4date ;
		for( var i in area){
			if(area[i].value == value){
				enum4date = area[i];
				break;
			}
		}
		if(!enum4date){
			return [];
		}else{
			return enum4date.getConditions(field,control);
		}
	};
	/****
	 * 简单条件 是根据字段id获取条件列表
	 * 根据字段id 获取 条件列表
	 * @param fieldId
	 * @returns {Array}
	 */
	var getConditionsByFieldId = function(fieldId){
		var condition = [];
		if((fieldId+'') =='-1'){
			return condition;
		}
		/** 获取字段 */
		var field = this.getField(fieldId);
		var id = this.attr('id');
		var ouiControlId = 'fieldValue-'+id+'-'+fieldId;
		/** 获取oui控件 **/
		var ouiControl = oui.getById(ouiControlId);
		var startControl,endControl;
		if(!ouiControl){
			//判断是否是区间控件
			var startId = 'fieldValue-start-'+id+'-'+fieldId;
			var endId = 'fieldValue-end-'+id+'-'+fieldId;
			startControl = oui.getById(startId);
			var endControl = oui.getById(endId);
			if((!startControl) && (!endControl)){
				return condition;
			}else{
				var selectId = 'fieldValue-select-'+id+'-'+fieldId;
				var selectAreaControl = oui.getById(selectId);
				if(selectAreaControl){
					var selectValue = selectAreaControl.getValue();
					if(!selectValue){
						return condition;
					}
					if((selectValue+'') != (Condition.dateAreaEnum.selectDate.value+'')){
						return findConditionsByDateAreaEnumValue(parseInt(selectValue),field,this);
					}else{
						return Condition.dateAreaEnum.selectDate.getConditions(field,this,startControl,endControl);
					}
				}else{
					return [];
				}

			}
		}
		var sysVarControlId =  'fieldVarValue-'+id+'-'+fieldId;//系统变量下拉选择控件Id
		var formControlType =field.controlType;
		var vars = this.findSysVars();
		var value = '';
		var display = '';
		/***获取系统变量的值作为条件右侧的值 **/
		if(vars.length>0){
			var sysVarControl = oui.getById(sysVarControlId);
			/**获取系统变量配置 作为 字段条件右侧的值 **/
			if(sysVarControl && sysVarControl.attr('value') !='control'){
				value = sysVarControl.attr('value');
				display = sysVarControl.getEnumItemDisplay();
			}
		}
		/** 获取字段值 **/
		if(!value){
			value = ouiControl.attr('value');
			display = getValueDisplay4Adapter(ouiControl);
		}
		var expression = this.attr('selectedOperationValue');
		var dataType =field.dataType;
		var newDataType ='';
		if(expression =='in' || expression =='notIn'){
			switch (dataType){
				case oui.dataTypeEnum.STRING.name:
					newDataType = oui.dataTypeEnum.ARRAYS_STRING.name;
					break;
				case oui.dataTypeEnum.NUMBER_INTEGER.name:
					newDataType = oui.dataTypeEnum.ARRAYS_INTEGER.name;
					break;
				case oui.dataTypeEnum.NUMBER_LONG.name:
					newDataType = oui.dataTypeEnum.ARRAYS_LONG.name;
					break;
				case oui.dataTypeEnum.ARRAYS_LONG.name:
					newDataType = oui.dataTypeEnum.ARRAYS_LONG.name;
					break;
				default :
					newDataType = oui.dataTypeEnum.ARRAYS_STRING.name;
					break;
			}
			dataType = newDataType;
		}
		var curr = {
			'field' :field.name,
			'expression' : expression, //表达式的操作符
			'value' : value,
			formulaJson:this.attr('formulaJson'),
			'display':display,
			'dataType' : dataType
		};
		var temp = getConditions4ValueFieldControl.call(this,curr);
		condition = condition.concat(temp);
		return condition;
	};

	/** 根据控件 获取 显示值 的 适配 ***/
	var getValueDisplay4Adapter = function(control){
		var type = control.attr('type');
		if(type =='singleselect' || type=='radio'){
			var data = control.attr('data');
			var value = control.attr('value');
			for(var i= 0,len=data.length;i<len;i++){
				if((data[i].value+'') == (value+'')){
					return data[i].display;
				}
			}
		}
		if(type =='multiselect' || type =='selectperson'){
			var display =  control.getDisplay4readOnly();
			if(type =='selectperson'){
				return control.getData4DB().items;
			}
			return display;
		}
		if(type =='number' ){
			if(control.attr('format')=='%' ){
				var fv =control.getFormatValue? control.getFormatValue():'';
				if(fv){
					return fv+'%';
				}else{
					return '';
				}
			}
			if(control.attr('format')==',' ){
				var fv =control.getFormatValue? control.getFormatValue():'';
				return fv;
			}
		}
		return control.attr('value');
	};
	/** 鼠标点击 条件值区域，解决 enter键后 鼠标事件需要点击两次才能删除的问题****/
	var mousedown4valueArea = function(){
		var me = this;
		var $searchBtn= $(me.getEl()).find('.oui-simple-search-submit-btn');
		/** 如果搜索按钮没有显示 就按enter 则不执行****/
		$searchBtn.removeClass('oui-simple-search-close');
	};
	var tap4showCancelBtn = function(){
		if(!oui.os.mobile){
			return ;
		}
		var me = this;
		$(me.getEl()).find('.oui-condition-cancel').removeClass('display_none');
	};
	/** 简单搜索  enter键盘事件绑定*****/
	var keydown = function(event){
		var me = this;
		event = window.event || event;
		if (event.keyCode == 13 || event.keyCode == '13') {
			if(oui.browser.ie == "9.0"){
				return false;
			}
			var $searchBtn= $(me.getEl()).find('.oui-simple-search-submit-btn');
			/** 如果搜索按钮没有显示 就按enter 则不执行****/
			if($searchBtn.hasClass('oui-simple-search-close')){
				return false;
			}
			/***组合控件不做 enter键绑定 ***/
			if(me.ouiGroupControl){
				return false;
			}
			if(me.tempTimer){
				window.clearTimeout(me.tempTimer);
			}

			me.tempTimer = window.setTimeout(function(){
				me.search();
				me.tempTimer = null;
			},1);
		}
	};
	/** 搜索 */
	var search = function() {
		var el = this.getEl();
		var $searchBtn= $(el).find('.oui-simple-search-submit-btn');
		var $focusEl = $(el).find('*:focus');
		var hasCloseIcon = $searchBtn.hasClass('oui-simple-search-close');
		var me = this;
		$focusEl.blur();
		window.setTimeout(function(){
			if(!oui.checkForm($(el).find(".simple-condition"))){
				return false;
			}
			// 当前查询的字段名 selectedFieldId
			var fieldId = me.attr('selectedFieldId');
			if(!fieldId){
				oui.alert("请选择需要查询的字段！");
				return false;
			}
			var callback = me.attr('callback');

			var fieldValue = me.getSelectedFieldValue();
			if($searchBtn.hasClass('oui-simple-search-close')){
				//清除当前值 并搜索 请选择
				fieldId= "";
				var fieldControl = me.getSelectedFieldControl();
				fieldControl&&fieldControl.setValue&&fieldControl.setValue('');
				$searchBtn.removeClass('oui-simple-search-close');
				//cancel
				var cancelback = me.attr('cancelback');
				if(cancelback){
					cancelback([],me);
					me.triggerUpdate();
					me.triggerAfterUpdate();
					return ;
				}
			}else{
				if(fieldValue+""){
					//搜索 逻辑
					$searchBtn.addClass('oui-simple-search-close');
				}
			}
			if((fieldId+'-1') != "-1"){
				if(!(fieldValue+"")){
					var notClearEmptyCondition = me.attr('notClearEmptyCondition');
					if(!notClearEmptyCondition){
						fieldId = "";
					}
				}
			}
			// 请选择
			if((fieldId+'-1') == "-1"){
				callback&&callback([],me);
				return false;
			}
			var condition = me.getConditions();
			callback&&callback(condition,me);
			me.triggerUpdate();
			me.triggerAfterUpdate();
		},5);
		return false;
	};
	/**
	 * 根据当前选择字段获取对应的条件,以数组返回
	 * @returns {Array|*}
	 */
	var getConditions4Simple = function(){
		var fieldId = this.attr('selectedFieldId');
		var condition = this.getConditionsByFieldId(fieldId);
		return condition;
	};
	/** 获取条件详细信息 */
	var getConditionInfo = function(){
		var conditions = this.getConditions();
		return getConditionInfo4Show(conditions||[],this);
	};
	/** 判断变量值是否已经被删除**/
	var hasNoVarValue = function(){
		var vars = this.findSysVars()||[];
		var v = this.attr('selectedFieldValue');
		for(var i= 0,len=vars.length;i<len;i++){
			if((vars[i].value == v) && vars[i].isDeleted){
				return true;
			}
		}
		return false;
	};

	/**判断某个值是否在系统变量里面 ***/
	var isValueInSysVars  = function(value,formControlType,control,field){
		var vars =[];
		if(OuiFormControlAdapter[formControlType] && OuiFormControlAdapter[formControlType].findSysVarsData){
			vars = OuiFormControlAdapter[formControlType].findSysVarsData()||[] ;
		}
		var groupControl = control.ouiGroupControl || control;
		var findSysVars_fun = groupControl.attr('findSysVars');

		if(findSysVars_fun&&(typeof findSysVars_fun == 'string') ){
			findSysVars_fun = eval(findSysVars_fun);
		}
		var tempVars = findSysVars_fun&&findSysVars_fun(field,groupControl,value);
		if(tempVars&&tempVars.length>0){
			vars = vars.concat(tempVars);
		}
		var isSysVar = false;
		if(vars.length>0){
			for(var k= 0,varLen= vars.length;k<varLen;k++){
				if(vars[k].value ==value){
					isSysVar = true;
					break;
				}
			}
		}
		return isSysVar;
	};
	var getConditionInfo4Show = function(conditions,control){

		var arr = [];
		for(var i= 0,len=conditions.length;i<len;i++){
			if(conditions[i].expression =='or'){
				if(i!=0){
					arr.push('<span class="or">or</span>');
				}
				arr.push('（');
				var temp =  getConditionInfo4Show(conditions[i].value||[],control);
				arr.push(temp);
				arr.push('）')
			}else{
				if( i !=0){
					arr.push('<span class="and">and</span>');
				}
				var fieldId = control.getFieldIdByName(conditions[i].field);
				var field = control.getField(fieldId);
				var value = conditions[i].value;
				var operations = control.getFieldOperations(fieldId);
				var operDisplay = getDisplay4Operation(operations,conditions[i].expression);
				if(value ===''){
					arr.push(' '+ oui.escapeStringToHTML(field.title) +' '+operDisplay+' <span class="empty">空</span> ');
				}else{
					var formControlType = field.controlType;
					var isSysVar = isValueInSysVars(value,formControlType,control,field);

					var display ='';
					/***如果值在系统变量里面 则用系统变量的显示值 **/
					if(isSysVar){
						display = conditions[i].display;
					}else{
						/**根据控件类型做适配 ***/
						display  = getDisplay4conditionShow(conditions[i].display, field.controlType);
					}
					if(field.controlType =='selectperson' || field.controlType=='selectdept'){
						arr.push(' '+ oui.escapeStringToHTML(field.title) +' '+operDisplay+' '+oui.escapeStringToHTML(display)+' ');
					}else{
						arr.push(' '+ oui.escapeStringToHTML(field.title) +' '+operDisplay+' '+oui.escapeStringToHTML(conditions[i].display||value)+' ');
					}
				}
			}
		}
		return arr.join('');
	};
	/****
	 * 根据条件列表中传入的display 和 控件类型进行适配转换
	 * @param display
	 * @param controlType
	 * @returns {*}
	 */
	var getDisplay4conditionShow = function(display,controlType){
		if(controlType =='selectperson' || controlType =='selectdept'){
			var displayObjArr = oui.parseJson(display||'[]');
			var displayArr = [];
			for(var i= 0,len=displayObjArr.length;i<len;i++){
				displayArr.push(displayObjArr[i].name);
			}
			return displayArr.join('，');
		}else{
			//TODO 	其它类型控件 的值显示回填
			return display;
		}

	};
	/**
	 * 根据 简单条件列表获取 所有的条件组合
	 */
	var getConditions4Group = function(){
		var controls = this.attr('controls') ||[] ;
		var arr = [];
		for(var i= 0,len=controls.length;i<len;i++){
			arr = arr.concat(controls[i].getConditions());
		}

		return arr;
	};
	/**
	 * 取消事件
	 */
	var cancel = function(){
		var el = this.getEl();
		this.attr('showDefaultSearchBtn',true);
		$(el).find('.oui-condition-go2search').removeClass('display_none');
		this.fillback(-1,'');
		var cancelback = this.attr('cancelback');
		cancelback&&cancelback([],this);
		if(oui.os.mobile){
			var me = this;
			$(me.getEl()).find('.oui-condition-cancel').addClass('display_none');
		}
		return false;
	};
	var go2search = function(){
		var el = this.getEl();
		$(el).find('.oui-condition-go2search').addClass('display_none');
		return false;
	};
	/** 组合条件特有方法************************/
	/**显示组合条件列表*/
	var showGroupConditions = function(){
		this.isShowGroupConditions = true;
		var el = this.getEl();
		$(el).find('.group-condition-area').removeClass('display_none');
		return false;
	};
	/**添加条件 （and，or） **/
	var addRule = function (parentId,id,isOr){

		var controlMap = this.attr('controlMap');
		if(!controlMap){
			controlMap = {};
			this.attr('controlMap',controlMap);
		}
		var controls;
		var $ul;
		/* or中增加**/
		if(id){
			//condition-control-id 指定位置增加
			var currControl = controlMap[id];
			controls = currControl.controls;
			if(!controls){
				controls = [];
				currControl.controls = controls;
			}
			if(currControl.or){
				$ul = $(this.getEl()).find('ul[condition-control-id='+currControl.id+']');
			}
		}else{
			/**根下面 增加条件 **/
			controls = this.attr('controls');
			if(!controls){
				controls = [];
				this.attr('controls',controls);
			}
			$ul = $(this.getEl()).find('.oui-condition-root');
			//.oui-condition-root
			//最外层增加
		}
		var maxConditionLenth = this.attr('maxConditionLenth');
		var maxLimitMsgTitle = this.attr("maxLimitMsgTitle");
		maxLimitMsgTitle = maxLimitMsgTitle || "组合规则条件项";
		var maxLimitMsgTitle4all = this.attr("maxLimitMsgTitle4all");
		maxLimitMsgTitle4all = maxLimitMsgTitle4all || "组合条件总数";
		if(controls.length>=maxConditionLenth){
			oui.getTop().oui.alert(maxLimitMsgTitle+'不能超过'+maxConditionLenth+'个');
			//oui.getTop().oui.showAutoTips({content:maxLimitMsgTitle+'不能超过'+maxConditionLenth+'个',boxStyle:'background-color:#e07365'});
			return ;
		}
		var maxGroupConditionLenth = this.attr('maxGroupConditionLenth');
		var allControlSize = this.getAllControlSize();
		if(allControlSize>=maxGroupConditionLenth){
			oui.getTop().oui.alert(maxLimitMsgTitle4all+'不能超过'+maxGroupConditionLenth+'个');
			//oui.getTop().oui.showAutoTips({content:maxLimitMsgTitle4all+'不能超过'+maxGroupConditionLenth+'个',boxStyle:'background-color:#e07365'});
			return ;
		}

		var data = this.attr('data');
		var data4OuiForm = this.attr('data4OuiForm');
		var clickName = this.attr('clickName');
		var isPc = this.attr('isPc');
		var control;
		if(isOr){
			if( (controls ) &&((controls.length&&controls[0].or) || (controls.length ==0)) ){
				oui.getTop().oui.alert('条件的第一项不能是OR');
				return ;
			}
			control = {
				id:newId4Condition(),
				isPc:isPc,
				ouiGroupControl:this,
				clickName:clickName,
				controls:[],
				or:true,
				getConditions: function () {
					var childControls = this.controls ||[] ;
					var arr = [];
					for(var i= 0,len=childControls.length;i<len;i++){
						arr = arr.concat(childControls[i].getConditions());
					}
					if(arr.length==0){
						return arr;
					}
					var orCondition = [{
						"expression":"or",
						"value":arr
					}];
					return orCondition;
				},
				getHtml:function(){
					var controls = this.controls;
					var arr = [];
					var currIsPc = this.isPc;
					var currClickName = this.clickName;
					for(var i= 0,len=controls.length;i<len;i++){
						arr.push( Condition._renderGroup4SimpleTemplate({
							isPc:currIsPc,
							ouiId:(controls[i]&&controls[i].attr)?controls[i].attr('ouiId'):'',
							clickName:currClickName,
							item:controls[i]
						}) );
					}
					return arr.join('');
				}
			};
			var curr = oui.create({
				clickName:clickName,
				isPc:isPc,
				data:data,
				data4OuiForm:data4OuiForm,
				showType:0,
				selectedFieldId:-1, //字段id
				selectedFieldValue:'', //条件值
				selectedFieldDisplay:'',
				selectedOperationValue:'', //条件表达式
				type:'condition'
			});

			curr.id = newId4Condition();
			curr.parentId = control.id;
			control.controls.push(curr);
			controlMap[curr.id] = curr;
			curr.ouiGroupControl =this;
			controlMap[control.id] = control;
			init4simple.call(curr);
		}else{
			control = oui.create({
				isPc:isPc,
				clickName:clickName,
				data:data,
				data4OuiForm:data4OuiForm,
				showType:0,
				selectedFieldId:-1, //字段id
				selectedFieldValue:'', //条件值
				selectedOperationValue:'', //条件表达式
				type:'condition'
			});
			control.id = newId4Condition();
			control.ouiGroupControl = this;
			controlMap[control.id] = control;
			init4simple.call(control); //初始化简单条件
		}
		control.parentId = id;
		var tempData = {
			isPc:isPc,
			clickName:clickName,
			ouiId:this.attr('ouiId'),
			item:control
		};
		controls.push(control);

		var newHtml = Condition._renderGroup4SimpleTemplate(tempData);
		$ul.append(newHtml);
		this.ouiGroupControl.showConditionInfo();
	};


	/**组合条件中 在指定位置添加条件 */
	var add = function(parentId,id,isOr){
		var controls  ;
		if(!this.ouiGroupControl){
			this.ouiGroupControl = this;
		}
		//if(!this.ouiGroupControl){
		//	throw new Error('组合控件对象找不到');
		//}
		var controlMap = this.ouiGroupControl.attr('controlMap');
		if(!controlMap){
			controlMap = {};
			this.ouiGroupControl.attr('controlMap',controlMap);
		}


		if(parentId){
			var parentControl = controlMap[parentId] ;
			if(!parentControl){
				throw new Error( 'Or表达式的条件控件找不到');
			}
			controls= parentControl.controls;
			if(!parentControl.controls){
				controls=parentControl.controls = [];
			}
		}else{
			controls = this.ouiGroupControl.attr('controls');
			if(!controls){
				this.ouiGroupControl.attr('controls',[]);
				controls = this.ouiGroupControl.attr('controls');
			}
		}

		var maxLimitMsgTitle = this.ouiGroupControl.attr("maxLimitMsgTitle");
		maxLimitMsgTitle = maxLimitMsgTitle || "组合规则条件项";
		var maxLimitMsgTitle4all = this.ouiGroupControl.attr("maxLimitMsgTitle4all");
		maxLimitMsgTitle4all = maxLimitMsgTitle4all || "组合条件总数";


		var maxConditionLenth = this.ouiGroupControl.attr('maxConditionLenth');
		if(controls.length>=maxConditionLenth){
			//oui.getTop().oui.showAutoTips({content:maxLimitMsgTitle+'不能超过'+maxConditionLenth+'个',boxStyle:'background-color:#e07365'});
			oui.getTop().oui.alert(maxLimitMsgTitle+'不能超过'+maxConditionLenth+'个');
			return ;
		}
		var maxGroupConditionLenth = this.ouiGroupControl.attr('maxGroupConditionLenth');
		var allControlSize = this.getAllControlSize();
		if(allControlSize>=maxGroupConditionLenth){
			oui.getTop().oui.alert(maxLimitMsgTitle4all+'不能超过'+maxGroupConditionLenth+'个');
			//oui.getTop().oui.showAutoTips({content:maxLimitMsgTitle4all+'不能超过'+maxGroupConditionLenth+'个',boxStyle:'background-color:#e07365'});
			return ;
		}
		var currControlIndex =findOuiControlIndex(controls,id);

		var data = this.attr('data');
		var data4OuiForm = this.attr('data4OuiForm');
		var clickName = this.attr('clickName');
		var isPc = this.attr('isPc');
		var control = oui.create({
			isPc:isPc,
			clickName:clickName,
			data:data,
			data4OuiForm:data4OuiForm,
			showType:0,
			selectedFieldId:-1, //字段id
			selectedFieldValue:'', //条件值
			selectedOperationValue:'', //条件表达式
			type:'condition'
		});
		control.id = newId4Condition();
		control.parentId = parentId;
		control.ouiGroupControl =controls[currControlIndex].ouiGroupControl;
		controlMap[control.id] = control;
		init4simple.call(control); //初始化简单条件
		var tempData = {
			isPc:isPc,
			clickName:clickName,
			ouiId:this.attr('ouiId'),
			item:control
		};
		//指定位置插入控件
		controls.splice(currControlIndex+1,0,control);
		var newHtml = Condition._renderGroup4SimpleTemplate(tempData);
		/**插入之前找到 当前 简单控件的元素,并在后方追加 新的 简单条件控件 */
		if((currControlIndex>-1) && controls[currControlIndex]){
			var $currEl = $(controls[currControlIndex].getEl());
			$currEl.parent().after(newHtml);
		}else{
			var el = this.getEl();
			$(el).find('.group-condition-area').find('ul').html(newHtml);
		}
		this.ouiGroupControl.showConditionInfo();

		return false;
	};
	/** 私有方法 ，根据 ouiId找到当前控件 */
	var findOuiControlIndex = function(controls,id){
		for(var i= 0,len=controls.length;i<len;i++){
			if((controls[i].id+'') == (id+'')){
				return i;
			}
		}
		return -1;
	};
	/**删除规则 **/
	var delRule = function(parentId,id){
		var controls  ;
		if(!this.ouiGroupControl){
			throw new Error('组合控件对象找不到');
		}
		var controlMap = this.ouiGroupControl.attr('controlMap');
		if(!controlMap){
			controlMap = {};
			this.ouiGroupControl.attr('controlMap',controlMap);
		}
		if(parentId){
			var parentControl = controlMap[parentId] ;
			if(!parentControl){
				throw new Error( 'Or表达式的条件控件找不到');
			}
			controls= parentControl.controls;
			if(!parentControl.controls){
				controls=parentControl.controls = [];
			}
		}else{
			controls = this.ouiGroupControl.attr('controls');
			if(!controls){
				this.ouiGroupControl.attr('controls',[]);
				controls = this.ouiGroupControl.attr('controls');
			}
		}

		var currControlIndex = findOuiControlIndex(controls,id);
		if(currControlIndex==-1){
			return false;
		}
		if(!controls[currControlIndex]){
			return false ;
		}
		var currControl =  controls[currControlIndex];
		var ids = getIdAndChildrenIds(currControl);
		ids.push(currControl.id);
		controls.splice(currControlIndex,1);
		for(var i= 0,len=  ids.length;i<len;i++){
			if(controlMap[ids[i]]){
				controlMap[ids[i]] = null;
				delete controlMap[ids[i]];
			}
		}
		var $ul = $(this.ouiGroupControl.getEl()).find('ul[condition-control-id='+id+']');
		oui.clearByContainer($ul.parent());
		$ul.parent().remove();
		var ouiGroupControl = this.ouiGroupControl;
		ouiGroupControl&&ouiGroupControl.showConditionInfo();
		if(ouiGroupControl){//规则删除执行更新事件
			ouiGroupControl.attr('updateType','rule');
			ouiGroupControl.triggerUpdate();
			ouiGroupControl.triggerAfterUpdate();
		}
		return false;
	};
	/**根据 控件获取id列表 ****/
	var getIdAndChildrenIds = function(control){
		var controls = control.controls ||[];
		var ids = [];
		for(var i= 0,len=controls.length;i<len;i++){
			ids.push(controls[i].id);
			var currIds = getIdAndChildrenIds(controls[i]);
			ids = ids.concat(currIds);
		}
		return ids;
	};
	/**计算表达式接口调用显示***/
	var calc = function(parentId,id){
		if(!this.ouiGroupControl){
			return ;
		}
		var rule = this.ouiGroupControl.attr('calc');
		if(typeof rule =='string'){
			if(rule){
				rule = eval(rule);
			}
		}
		if(rule){
			try{
				rule(this.ouiGroupControl,this);
			}catch(e){
			}
		}
	};
	/***是否显示 计算图标到 条件组件中的显示规则 **/
	var isShowCalcRule = function(){
		var controls  ;
		if(!this.ouiGroupControl){
			return false;
		}
		/**通过自定义显示 计算规则 来进行扩展显示逻辑 **/
		var rule = this.ouiGroupControl.attr('isShowCalcRule');
		if(typeof rule =='string'){
			if(rule){
				rule = eval(rule);
			}
		}
		if(rule){
			try{
				return rule(this.ouiGroupControl,this);
			}catch(e){
				return false;
			}
		}
		return false;
	};
	var accordion = function(parentId,id){
		var el = this.getEl();
		if($(el).hasClass('condition-height-clear')){
			$(el).removeClass('condition-height-clear');
		}else{
			$(el).addClass('condition-height-clear');
		}
	};
	/** 组合条件中 在指定位置删除条件 ***/
	var del = function(parentId,id){
		var controls  ;
		if(!this.ouiGroupControl){
			this.ouiGroupControl = this;
		}
		var controlMap = this.ouiGroupControl.attr('controlMap');
		if(!controlMap){
			controlMap = {};
			this.ouiGroupControl.attr('controlMap',controlMap);
		}
		if(parentId){
			var parentControl = controlMap[parentId] ;
			if(!parentControl){
				throw new Error( 'Or表达式的条件控件找不到');
			}
			controls= parentControl.controls;
			if(!parentControl.controls){
				controls=parentControl.controls = [];
			}
		}else{
			controls = this.ouiGroupControl.attr('controls');
			if(!controls){
				this.ouiGroupControl.attr('controls',[]);
				controls = this.ouiGroupControl.attr('controls');
			}
		}

		var currControlIndex = findOuiControlIndex(controls,id);
		if(currControlIndex==-1){
			return false;
		}
		if(!controls[currControlIndex]){
			return false ;
		}
		var groupControl = this.ouiGroupControl;
		if(controls.length ==1 ||((currControlIndex==0) && (controls[1]&&controls[1].or))){
			this.add(parentId,id);
			var $el = $(controls[currControlIndex].getEl()); //找到当前简单控件位置
			oui.clearByOuiId(controls[currControlIndex].attr('ouiId'));//清空对象
			controlMap[id] = null;
			controls.splice(currControlIndex,1); //删除指定元素
			delete controlMap[id];
			oui.clearByContainer($el.parent());
			$el.parent().remove(); //删除指定元素

			//controls[currControlIndex].fillback(-1,'','');
			//var $el = $(controls[currControlIndex].getEl()); //找到当前简单控件位置
			//$el.parent().find('.group-condition-calc').addClass('display_none');
		}else{
			var $el = $(controls[currControlIndex].getEl()); //找到当前简单控件位置
			oui.clearByOuiId(controls[currControlIndex].attr('ouiId'));//清空对象
			controlMap[id] = null;
			controls.splice(currControlIndex,1); //删除指定元素
			delete controlMap[id];
			oui.clearByContainer($el.parent());
			$el.parent().remove(); //删除指定元素
		}
		groupControl&&groupControl.triggerUpdate();
		groupControl&&groupControl.triggerAfterUpdate();
		groupControl&&groupControl.showConditionInfo();
		return false;
	};
	var check4repeat = function(conditions,showErrorDialog){
		var me = this;
		var flag = true;
		if(me.isRepeat()){
			/** 校验日期选择是否存在问题***/
			var dateFieldsMap = {};
			oui.findManyFromArrayBy(conditions||[],function(item){
				if((item.expression=='>=' || item.expression=='<=') &&(item.dataType=='DATETIME' || item.dataType=='DATE')){
					if(!dateFieldsMap[item.field]){
						dateFieldsMap[item.field] = [];
					}
					dateFieldsMap[item.field].push(item);
					return true;
				}
			});
			for(var i in dateFieldsMap){
				if(dateFieldsMap[i].length>1){
					var currArr =dateFieldsMap[i];
					var startValue = currArr[0].value||"";
					var endValue = currArr[1].value||"";
					startValue= startValue.replace(/-/ig,'').replace(/ /ig,'');
					if(startValue){
						startValue = parseInt(startValue);
					}
					endValue= endValue.replace(/-/ig,'').replace(/ /ig,'');
					if(endValue){
						endValue = parseInt(endValue);
					}
					if(startValue&&endValue){
						if(startValue>endValue){
							flag = false;
						}
					}
				}
				if(!flag){
					//校验失败 处理 对应的元素
					if(showErrorDialog){
						var fieldId = me.getFieldIdByName(i);

						var field = me.getField(fieldId);
						if(field){
							var selector =('[name=start_'+i+'],[name=end_'+i+']').replace(/\./ig,'\\\.');
							$(me.getEl()).find(selector).parent().addClass('error-border-highlight');
							oui.getTop().oui.alert(field.title+',开始日期不能大于结束日期');
						}
					}
					break;
				}
			}
		}
		return flag;
	};
	/** 组合条件 确认执行 */
	var confirm4group = function(){
		var controls  = this.attr('controls');
		if( (controls&& controls.length ==1) &&(controls[0].or) ){
			oui.getTop().oui.alert('条件的第一项不能是OR');
			return ;
		}
		var conditions = this.getConditions();
		//check4repeat
		var flag = check4repeat.call(this,conditions,true);
		if(!flag){
			return ;
		}
		this.hideGroupConditions();
		var callback = this.attr('callback');
		callback&&callback(conditions,this);
		this.triggerUpdate();
		this.triggerAfterUpdate();
		return false;
	};
	/** 重置功能*****/
	var reset4group = function(){
		var showType = parseInt(this.attr('showType')+'');
		if(showType == 6){
			//平铺内嵌 模式， 取消 为重置，清空条件列表
			this.fillback([]);
			this.showGroupConditions();
		}
	};

	/** 组合条件 取消执行 */
	var cancel4group = function(){
		var showType = parseInt(this.attr('showType')+'');
		this.hideGroupConditions();
		var cancelback = this.attr('cancelback');
		var conditions = this.getConditions();
		/*** pc 端的取消就是重置******/
		if(!oui.os.mobile){
			if(showType == 6){
				//平铺内嵌 模式， 取消 为重置，清空条件列表
				this.reset4group();
			}
		}else{
			//移动端 的取消 就是隐藏弹出框，不重置条件
		}
		cancelback&&cancelback(conditions,this);
		return false;
	};
	/** 隐藏条件 弹出层 */
	var hideGroupConditions = function(){
		var controls  = this.attr('controls');
		if( (controls&& controls.length ==1) &&(controls[0].or) ){
			oui.getTop().oui.alert('条件的第一项不能是OR');
			return ;
		}
		this.isShowGroupConditions = false;
		var el = this.getEl();
		$(el).find('.group-condition-area').addClass('display_none');
		return false;
	};
	/** pc中才绑定该事件***/
	if(!oui.os.mobile){
		/** 滚动条滚动时，隐藏模拟的选择框*****/
		$(win.document).ready(function () { //本人习惯这样写了
			$(win).scroll(function () {
				$('.simple-condition-options').not('.display_none').find('.oui-condition-field-mask-layer').trigger('click');
			});
		});
	}
})(window, oui);





