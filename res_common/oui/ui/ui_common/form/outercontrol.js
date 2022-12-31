(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	//控件构造器
	var OuterControl = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
		this.validate = validate;
		this.attrs =this.attrs+',placeholder,isReadOnly,url,loadType,dataType,doScript,useOuterUrl,doScriptMethod';
		this.init = init;
		this.focus = focus;
		this.clearContent = clearContent;
		this.loadData = loadData;
		this.loadData4json = loadData4json;
		this.loadData4page = loadData4page;
		this.keyup = keyup;

		this.replaceUrlParams = replaceUrlParams;//url参数替换
		this.selectOne = selectOne;//多数据情况的下拉选择
		this.hideSelectArea = hideSelectArea;//隐藏下拉区域;
		this.showSelectArea = showSelectArea;//显示下拉区域;
		this.filterSelectArea = filterSelectArea;//过滤显示下拉区域
		this.loadJsonBack = loadJsonBack;
		this.showTable = showTable;//用表格显示 待选数据
		this.loadTable = loadTable;//已经存在表格 加载数据
		this.loadData4search = loadData4search; //无弹框搜索【请求外部地址】
		this.loadData4RealSearch = loadData4RealSearch;//在弹框里面 根据参数查询远程服务器数据
		this.showSelectAreaByDataCfg = showSelectAreaByDataCfg ;//根据数据配置显示下拉区域
	};
	OuterControl.FullName = "oui.$.ctrl.outercontrol";//设置当前类全名
	//该配置 为内部服务器指定路径

	// third.do?method=loadUrl
	OuterControl.ouiTransUrl = oui.getContextPath()+'thirdMenu.do?method=loadUrl';// 内部转换外部地址路径 TODO


	ctrl["outercontrol"] = OuterControl;//将控件类指定到特定命名空间下	
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	OuterControl.templateHtml=[];
	OuterControl.templateHtml[0] =


		'<button class=\"outercontrol-btn\" {{clickName}}=\"oui.getByOuiId({{ouiId}}).loadData()\">加载数据</button> '+
        //'<button class=\"outercontrol-search\" {{clickName}}=\"oui.getByOuiId({{ouiId}}).loadData4search()\">搜索</button> '+
		'<input  autocomplete="off" id=\"{{id}}\" name=\"{{name}}\" type=\"text\" value=\"{{value}}\" class=\"oui-form\" '+
		'{{if right&&(right==\"design\")}}disabled=\"disabled\" {{/if}} '+
		'{{(isReadOnly)?\"readonly=readonly\":\"\"}} '+
		'placeholder=\"{{placeholder}}\" '+
		'style=\"{{fieldStyle}}\" '+
		'validate=\"{{validate}}\" '+
		'{{=commonEvent}} '+
		'onfocus=\"oui.getByOuiId({{ouiId}}).focus();\" '+
		'onkeyup=\"oui.getByOuiId({{ouiId}}).keyup();\" '+
		'/> '+
		'<i {{clickName}}=\"oui.getByOuiId({{ouiId}}).clearContent();\" '+
		'id=\"form_delete_info_btn_{{ouiId}}\" '+
		'class=\"form-delete-info\" style=\"{{if value}}display:block;{{/if}}\" ></i> '+
		'<div class=\"outercontrol-select-mask\" {{clickName}}=\"oui.getByOuiId({{ouiId}}).hideSelectArea()\"></div> '+
		'<!--选择蒙层，点击此蒙层实现关闭下拉，移除oui-class-outercontrol上追加的show-select--> '+
		'<div class=\"outercontrol-select\"><!--选择下拉区域--> '+
		'<ul> '+
		'{{if data&&data.length}} '+
		'{{each data as item index}} '+
		'<li {{clickName}}=\"oui.getByOuiId({{ouiId}}).selectOne({{index}},this)\" value=\"{{item.value}}\">{{item.value}}</li> '+
		'{{/each}} '+
		'{{else}} '+
		'<li {{clickName}}=\"oui.getByOuiId({{ouiId}}).selectOne(-1,this)\" value=\"\">没有检索到内容</li> '+
		'{{/if}} '+
		'</ul> '+
		'</div> ';
	/***********************************控件事件***********************************/

	OuterControl.dialogTableTpl =


		'<style type=\"text/css\"> '+
		'.outercontrol-condition{ '+
		'display: block; '+
		'padding-bottom: 10px; '+
		'text-align: right; '+
		'} '+
		'.outercontrol-condition .oui-class-condition{ '+
		'width: 360px; '+
		'} '+
		'.outercontrol-table{ '+
		'display: block; '+
		'} '+
		'.outercontrol-real-time{ '+
		'background: url(\"{{oui.getContextPath()}}res_common/oui/ui/ui_pc/images/outercontrol-real-time.png\") center no-repeat; '+
		'background-size: 24px 24px; '+
		'width: 40px; '+
		'height: 30px; '+
		'display:inline-block; '+
		' cursor: pointer; '+
		'} '+
		'@media screen and (max-width: 720px) { '+
		'.outercontrol-condition{ '+
		'padding-bottom: 0; '+
		'text-align: inherit; '+
		'width: 100%; '+
		'display: -webkit-box; '+
		'display: -moz-box; '+
		'display: -ms-flexbox; '+
		'display: flex; '+
		'} '+
		'.outercontrol-condition .oui-class-condition{ '+
		'-webkit-box-flex: 1; '+
		'-moz-box-flex: 1; '+
		'-webkit-flex: 1; '+
		'-ms-flex: 1; '+
		'flex: 1; '+
		'} '+
		'.outercontrol-table{ '+
		'-webkit-box-flex: 1; '+
		'-webkit-flex: 1; '+
		'-ms-flex: 1; '+
		'flex: 1; '+
		'overflow: hidden; '+
		'} '+
		'.outercontrol-real-time{ '+
		'background: url(\"{{oui.getContextPath()}}res_common/oui/ui/ui_phone/images/outercontrol-real-time.png\") center no-repeat; '+
		'background-size: 24px 24px; '+
		'height: 44px; '+
		'} '+
		' '+
		'} '+
		'</style> '+
		'<div class=\"outercontrol-condition\"> '+
		'<oui-condition searchTitle=\"根据输入条件，在当前表格数据中检索\" id=\"{{conditionId}}\" '+
		'showType=\"0\" type=\"condition\" '+
		'callback=\"oui.getTop().oui.getPageParam(\'{{conditionId}}_callback\')\" '+
		'selectedFieldId=\"-1\" selectedFieldValue=\"\"> '+
		'{{each conditionFields as item index}} '+
		'<oui-field title=\"{{item.header}}\" placeholder=\"{{item.header}}\" showType=\"0\" dataType=\"STRING\" '+
		'opt=\"like\" controlType=\"textfield\" name=\"{{item.fieldName}}\"></oui-field> '+
		'{{/each}} '+
		'</oui-condition> '+
		'<div class=\"outercontrol-real-time\" title=\"根据条件在第三方服务器中检索数据\" condition-id="{{conditionId}}" {{clickName}}="oui.getTop().oui.getByOuiId({{table.getMap().ouiId}}).loadData4RealSearch();"></div> '+
		'</div> '+
		' '+
		'<div class=\"outercontrol-table\"> '+
		'{{=table.getHtml()}} '+
		'</div> ';
	OuterControl.dataMaxLength = 1000;// 对于数组 或者 数据的最大长度限制 1000
	var SearchTypeEnum ={
		def:0, //默认查询
		loadData4search:1, //只加载数据，不显示表格，要显示下拉的查询
		loadData4RealSearch:2 //根据参数变更，修改url 查询的数据
	};
	var init = function(){
		var otherAttrs = oui.parseJson(this.attr("otherAttrs") || '{}');
		var isReadOnly = this.attr('isReadOnly') || otherAttrs.isReadOnly;
		if((typeof isReadOnly) !=='boolean' ){ //非boolean型转换
			if(isReadOnly){//存在配置
				if(isReadOnly=='false'){//指定可编辑
					isReadOnly = false;
				}else{ //默认只读
					isReadOnly = true;
				}
			}else{//默认只读
				isReadOnly = true;
			}
		}
		var url = this.attr('url') ||otherAttrs.url;
		var loadType = this.attr('loadType') ||otherAttrs.loadType||'json';
		var dataType = this.attr('dataType') || otherAttrs.dataType || 'string';
		var doScript = otherAttrs.doScript || this.attr('doScript');
		if(doScript){
			doScript = oui.parseJson(doScript);
		}
		var doScriptMethod = otherAttrs.doScriptMethod || this.attr('doScriptMethod');
		if(doScriptMethod){
			doScriptMethod = oui.parseJson(doScriptMethod);
		}
		var useOuterUrl = this.attr('useOuterUrl');
		if((useOuterUrl+'') =='true'){
			useOuterUrl = true;
		}else{
			useOuterUrl = false;
		}
		this.attr('useOuterUrl',useOuterUrl);
		this.attr('doScript',doScript);
		this.attr('doScriptMethod',doScriptMethod);
		this.attr('url',url);
		this.attr('loadType',loadType);
		this.attr('dataType',dataType);
		if(loadType =='jsonp' || loadType =='jsonpList'){//jsonp则使用外部地址
			this.attr('useOuterUrl',true);
		}
		this.attr("isReadOnly", isReadOnly);
		var data = this.attr('data') ||'[]';
		data = oui.parseJson(data);
		this.attr('data',data);
		var ouiId = this.attr('ouiId');
		var callbackMethod = new Function('jsonResult','var ouiId="'+ouiId+'";oui.getByOuiId(ouiId).loadJsonBack(jsonResult);');
		this.attr('callbackMethod',callbackMethod);
	};

	/** json 或者jsonp回调函数 执行处理脚本****/
	var loadJsonBack = function(jsonResult){
		oui.progress.hide();
		var me = this;
		var doScript = me.attr('doScript');
		var funStr = oui.getFunctionStringByJson(doScript);
		if(doScript){
			try{
				var fun = oui.parseJson2Function(doScript);
				jsonResult = fun(jsonResult,me);
			}catch(e){

				oui.getTop().oui.alert('获取第三方数据失败,请联系管理员，检查第三方控件数据结果处理脚本,'+funStr+'\n'+e);
				throw new Error('获取第三方json数据失败,请联系管理员，检查第三方控件数据结果处理脚本,'+funStr+'\n'+e);
				return ;
			}
		}
		var doScriptMethod = me.attr('doScriptMethod');
		if(doScriptMethod){
			funStr = doScriptMethod.toString();
			try{
				jsonResult = doScriptMethod(jsonResult,me);
			}catch(e){

				oui.getTop().oui.alert('获取第三方数据失败,请联系管理员，检查第三方控件数据结果处理脚本,'+funStr+'\n'+e);
				throw new Error('获取第三方json数据失败,请联系管理员，检查第三方控件数据结果处理脚本,'+funStr+'\n'+e);
				return ;
			}
		}
		if((!jsonResult) || (typeof jsonResult !='object')){
			oui.getTop().oui.alert('获取第三方数据失败,请联系管理员，检查第三方控件数据结果处理脚本，返回值不正确,'+funStr+'\n');
			throw new Error('获取第三方json数据失败,请联系管理员，检查第三方控件数据结果处理脚本,返回值不正确'+funStr+'\n');
			return ;
		}
		var dataType = jsonResult.dataType;
		var fillback = jsonResult.fillback;
		var data = jsonResult.data;
		me.attr('dataCfg',jsonResult);//缓存结果配置
		if(dataType=='string'){//返回值为字符串，直接填充
			data = data||'';
			if(typeof data !='string'){
				oui.getTop().oui.alert('获取第三方数据失败,请联系管理员，检查第三方控件数据结果处理脚本，返回值类型不是string,'+funStr+'\n');
				throw new Error('获取第三方json数据失败,请联系管理员，检查第三方控件数据结果处理脚本,返回值类型不是string,'+funStr+'\n');
				return ;
			}
			me.attr('value',data);
			$(me.getEl()).find('input').val(data);
			me.hideSelectArea();
			try{
				fillback&&fillback(data);
			}catch(e){
				oui.getTop().oui.alert('获取第三方数据时，回填调用失败,请联系管理员，检查第三方控件数据结果处理脚本，回填函数执行失败,'+funStr+'\n'+e);
				throw new Error('获取第三方数据时，回填调用失败,请联系管理员，检查第三方控件数据结果处理脚本,回填函数执行失败'+funStr+'\n'+e);
				return ;
			}
			if(data){
				$(me.getEl()).find("#form_delete_info_btn_" + me.attr('ouiId')).show();
			}else{
				$(me.getEl()).find("#form_delete_info_btn_" + me.attr('ouiId')).hide();
			}
		}else if(((typeof data =='object') && (data instanceof Array)) && (dataType =='array')){
			//数组结果以下拉方式显示
			if(data.length>OuterControl.dataMaxLength){
				data.length=OuterControl.dataMaxLength;
				console.log('第三方数据超过'+OuterControl.dataMaxLength+'条，直接截取前面'+OuterControl.dataMaxLength+'条数据');
				oui.getTop().oui.alert('获取第三方数据提醒,请联系管理员，检查第三方控件数据结果处理脚本,数组长度超过'+OuterControl.dataMaxLength+'条,url:'+me.attr('url')+funStr+'\n');
				return ;
			}
			me.attr('data',data);
			me.render();
			me.showSelectArea();

		}else if((typeof data =='object') && (data instanceof Object) &&(dataType=='table')){

			var searchType = this.attr('searchType');
			if(searchType == SearchTypeEnum.loadData4search){
				me.showSelectAreaByDataCfg();
			}else if(searchType == SearchTypeEnum.loadData4RealSearch){
				//在弹出的表格 中进行远程查询
				me.loadTable();
			}else{
				me.showTable();
			}
		}else{
			var funStr = oui.getFunctionStringByJson(doScript);
			oui.getTop().oui.alert('获取第三方数据失败,请联系管理员，检查第三方控件数据结果处理脚本,返回值类型只支持 字符串,或者数组,'+funStr+'\n');
			throw new Error('获取第三方数据失败,请联系管理员，检查第三方控件数据结果处理脚本,返回值类型只支持 字符串,或者数组');
		}
	};
	/** 根据数据配置显示下拉****/
	var showSelectAreaByDataCfg = function(){
		var me = this;
		var dataCfg = this.attr('dataCfg') ||{};
		var data = dataCfg.data ||[];
		me.attr('data',data.data||[]);//数据在data属性中
		me.render();
		me.showSelectArea();
	};
	/** 对已经存在的表格加载数据****/
	var loadTable = function(){
		var me = this;
		try{
			var dataCfg = this.attr('dataCfg');
			var data = dataCfg.data;
			me.attr('data',data.data||[]);//数据在data属性中
			var table = me.attr('table');
			table.setData(data.data);
			table.render();
		}catch(err){

		}
	};
	/** 用表格显示待选数据**/
	var showTable = function(){
		if(!OuterControl.renderTableHtml){
			OuterControl.renderTableHtml = template.compile(OuterControl.dialogTableTpl);
		}
		var me = this;
		var doScript = me.attr('doScript');
		var funStr = oui.getFunctionStringByJson(doScript);
		//表格结果，确定回填
		//var w = oui.getTop().document.documentElement.clientWidth || oui.getTop().document.body.clientWidth;
		var h = oui.getTop().document.documentElement.clientHeight || oui.getTop().document.body.clientHeight;
		var dataCfg = this.attr('dataCfg');
		var data = dataCfg.data;
		var style = data.style;
		var fillback = dataCfg.fillback;
		if(style){
			var arr = style.split(';');
			var cfg = {};
			for(var i = 0,len=arr.length;i<len;i++){
				var key = $.trim(arr[i].split(':')[0]);
				var v = $.trim(arr[i].split(':')[1]);
				cfg[key] = v;
			}
		}else{
			cfg = {
				'width':'100%' //表格宽度100%
			};
		}
		if(!oui.os.mobile){
			var tableHeight = (h*0.8)-180;//80%高度, 删除头部，底部，内部padding值，以及条件搜索高度
			if(tableHeight<0){
				tableHeight =0;
			}
			cfg.height = tableHeight+'px';//表格高度实际计算
		}else{
			cfg.height = '100%';
		}
		var arr = [];
		for(var i in cfg){
			arr.push(i+':'+cfg[i]);
		}
		var tableStyle  = arr.join(';');
		data.style = tableStyle;


		me.attr('data',data.data||[]);//数据在data属性中
		//长度限制处理
		if(data.length>OuterControl.dataMaxLength){
			data.length=OuterControl.dataMaxLength;
			console.log('第三方数据超过'+OuterControl.dataMaxLength+'条，直接截取前面'+OuterControl.dataMaxLength+'条数据');
			oui.getTop().oui.alert('获取第三方数据提醒,请联系管理员，检查第三方控件数据结果处理脚本,数组长度超过'+OuterControl.dataMaxLength+'条,url:'+me.attr('url')+funStr+'\n');
			return ;
		}
		me.render();
		var contentStyle= 'width:80%;height:80%';
		if(oui.os.mobile){
			contentStyle= 'width:100%;height:100%';
		}else{
			contentStyle= 'width:80%;height:80%';
		}
		var actions = [];
		var okAction= {
			cls:'oui-dialog-ok',
			text:'确定',
			action:function(){
				var table = me.attr('table');
				var dialog = me.attr('dialog');
				var selecteds = table.getSelecteds();
				if(selecteds.length>1 || selecteds.length<1){
					oui.getTop().oui.alert('请选择一条数据');
					return false;
				}else {
					var selected = selecteds[0] ||{};
					var selectedValue =selecteds[0].value||"";
					me.attr('value',selectedValue);
					$(me.getEl()).find('input').val(selectedValue);
					me.hideSelectArea();
					if(selectedValue){
						$(me.getEl()).find("#form_delete_info_btn_" + me.attr('ouiId')).show();
					}else{
						$(me.getEl()).find("#form_delete_info_btn_" + me.attr('ouiId')).hide();
					}
					try{
						fillback&&fillback(selected);
					}catch(e){
						oui.getTop().oui.alert('获取第三方数据时，回填调用失败,请联系管理员，检查第三方控件数据结果处理脚本，回填函数执行失败,'+funStr+'\n'+e);
						throw new Error('获取第三方数据时，回填调用失败,请联系管理员，检查第三方控件数据结果处理脚本,回填函数执行失败'+funStr+'\n'+e);
						return ;
					}
				}
				var conditionId = me.attr('conditionId');
				oui.getTop().oui.setPageParam(conditionId+'_callback',null);
				dialog&&dialog.hide();
				return false;

			}
		};
		var cancelAction= {
			cls:'oui-dialog-cancel',
			text:'取消',
			action:function(){
				var dialog = me.attr('dialog');
				var conditionId = me.attr('conditionId');
				oui.getTop().oui.setPageParam(conditionId+'_callback',null);
				dialog&&dialog.hide();
				return false;
			}
		};
		if(oui.os.mobile){
			actions.push(cancelAction);
			actions.push(okAction);
		}else{
			actions.push(okAction);
			actions.push(cancelAction);
		}
		var columns = data.columns ||[];
		var conditionFields = data.conditionFields || [].concat(columns);

		me.attr('conditionFields',conditionFields);//如果用户配置的条件列表，则根据用户配置的来显示条件组件
		if(!columns.length){
			oui.getTop().oui.alert('获取第三方数据时，表格数据显示处理脚本错误,请联系管理员，检查第三方控件数据结果处理脚本，表格列信息columns配置不能为空,'+funStr+'\n');
			throw new Error('获取第三方数据时，表格数据显示处理脚本错误,请联系管理员，检查第三方控件数据结果处理脚本，表格列信息配置columns不能为空，'+funStr+'\n');
			return ;
		}else{
			columns.splice(0,0, {
					columnType: "checkboxcolumn",
					width: 40
				},
			{
				columnType: "indexcolumn",
				header: "序号",
				width: 70
			});
		}
		/** 行选择选中**/
		data.onRowclick = function(tb,row){
			tb.select(row);
		};
		var outerOuiId = me.attr('ouiId');
		oui.getTop().oui.createTable(data,function(table){
			var conditionId = 'condition_'+oui.getUUIDLong();
			var conditionFields = me.attr('conditionFields');
			me.attr('conditionId',conditionId);
			oui.getTop().oui.setPageParam(conditionId+'_callback',function(param){
				me.attr('table').query(param);
			});
			var html = OuterControl.renderTableHtml({
				table:table,
				conditionFields:conditionFields,
				conditionId:conditionId,
				clickName:me.attr('clickName'),
				outerOuiId:outerOuiId
			});

			var dialog = oui.getTop().oui.showHTMLDialog({
				title:'选择第三方数据',
				center:false, //移动上使用
				content:html ,
				contentStyle:contentStyle, //html的宽度，高度,pc上
				actions:actions
			});
			me.attr('dialog',dialog);
			me.attr('table',table);
			dialog.attr('outerControl',me);
			var rows = data.data ||[];
			var value = me.attr('value');
			var row = table.findRowBy(function(item){
				if(item.value == value){
					return true;
				}
			});
			table.select(row);
			oui.getTop().oui.parse({container:dialog.getEl()});
			table.render(); //显示完成后渲染表格
			/** 在表格上绑定此方法，用于外部控件加载外部控件数据 因为模板是弹出到最顶层，而最顶层与跨iframe访问时，需要外部控件的对象调用 *****/
			table.loadData4RealSearch = function(){ //给表格绑定查询功能
				me.loadData4RealSearch();
			};
		});

	};
	var replaceUrlParams = function(url){
		var me = this;
		var searchType = this.attr('searchType');
		var tempUrl = url;
		if(searchType == SearchTypeEnum.loadData4RealSearch){
			//在 已经弹出 的表格中 远程查询接口
			var conditionId = me.attr('conditionId');
			var conditionControl = oui.getTop().oui.getById(conditionId);
			if(conditionControl){
				try{
					var conditions = conditionControl.getConditions();
					var urlArr = tempUrl.split('?');
					if(urlArr.length>1){
						var prefixUrl = urlArr[0];
						var paramCfg = oui.getParamByUrl(tempUrl);
						var tempCfg = {};
						/** 处理变量参数****/
						for(var k in paramCfg){
							if((paramCfg[k].indexOf('{') ==0) && (paramCfg[k].lastIndexOf('}')==paramCfg[k].length-1)){
								paramCfg[k] = '';
							}
							if(paramCfg[k]){
								tempCfg[k] = paramCfg[k];
							}
						}
						/**赋值固定参数对象******/
						paramCfg = tempCfg;
						/** 根据条件 拼接参数******/
						if(conditions&&conditions.length){
							for(var i= 0,len=conditions.length;i<len;i++){
								var key  = conditions[i].field;
								var value = conditions[i].value;
								if(paramCfg[key]){
									paramCfg[key] = value;
								}else{
									if(key.indexOf('.')>-1){
										var tempKey = key.split('.')[1];
										if(tempKey){
											key = tempKey;
										}
									}
									paramCfg[key] = value;
								}
							}
						}
						tempUrl = oui.addParams(prefixUrl,paramCfg);
					}
				}catch(err){}
			}
		}else{
			var reg = /-?\{([^{]+)}/ig;
			var props = url.match(reg);
			var display = this.attr('value');
			try{
				if(props&&props.length){
					for(var i= 0,len=props.length;i<len;i++){
						var currProp = props[i];
						var prop = props[i].substring(1,props[i].length-1);
						if(prop =='0'){//代表当前控件
							tempUrl = tempUrl.replace('{0}',encodeURIComponent(display));//替换第一个参数为当前值
						}else{
							var control = oui.getByTitle(prop);
							if(control){
								if(control == this){
									tempUrl = tempUrl.replace(currProp,encodeURIComponent(display));

								}else{
									tempUrl = tempUrl.replace(currProp,encodeURIComponent(control.attr('value')));
								}
							}else{
								oui.getTop().oui.alert('加载第三方数据失败\n'+url+'\n找不到控件 {'+prop+'}，请联系管理员检查url配置');
								break;
							}
						}

					}
				}
			}catch(e){
			}
		}

		return tempUrl;
	};
	/** 加载json数据 或者文本数据**/
	var loadData4json = function(){
		var me = this;
		var baseUrl = OuterControl.ouiTransUrl+'';
		var url = this.attr('url');
		var ouiId = this.attr('ouiId');
		var searchType = this.attr('searchType'); //查询类型
		url = this.replaceUrlParams(url);  //替换url参数
		var useOuterUrl = this.attr('useOuterUrl');
		var loadType  = this.attr('loadType');
		if(loadType =='jsonp' || loadType =='jsonpList' ){
			url = oui.setParam(url,'callback','oui.getPageParam("loadUrl_'+ouiId+'")');
		}
		if(useOuterUrl || ((!baseUrl)||(baseUrl=='/'))||(url&&url.startsWith('/'))){ //如果配置使用第三方提供jsonp路径，则使用第三方路径，否则通过内部jsonp地址中转
			baseUrl = url;
		}else{//内部中转地址需要指定url属性 //始終請求内部地址，由后台服务器中转第三方路径
			baseUrl = oui.setParam(baseUrl,'url',encodeURIComponent(url));
		}
		baseUrl = oui.setParam(baseUrl,'__t__',oui.getUUIDLong());
		/** 设置临时回调函数**/
		oui.setPageParam('loadUrl_'+ouiId,me.attr('callbackMethod'));

		if(loadType =='jsonp' || loadType =='jsonpList'){
			oui.progress("加载第三方数据中,请稍后");
			if(!oui.getParamByUrl(baseUrl,'__script__')){//没有jsonp脚本 参数则增加
				baseUrl = oui.addParam(baseUrl,'__script__','load.js');
			}
			oui.require([baseUrl],function(){//加载第三方动态脚本
				oui.progress.hide();
			},function(){
				oui.getTop().oui.alert('加载第三方数据失败\n'+url);
				oui.progress.hide();
			});
		}else{
			try{
				oui.getData({
					url:baseUrl,
					progressBar:"加载第三方数据中,请稍后",
					callback:function(json){
						if(json.success){
							oui.getPageParam('loadUrl_'+ouiId)(json.msg);
						}else{
							oui.getTop().oui.alert('加载第三方数据失败\n'+url);
						}
					},
					error:function(){
						oui.getTop().oui.alert('加载第三方数据失败\n'+url);
					}
				});
			}catch(e){
				oui.getTop().oui.alert('加载第三方数据失败\n'+url);
			}
		}

	};
	/** 加载页面数据**/
	var loadData4page = function(){
		var url = this.attr('url');
		url = this.replaceUrlParams(url); //参数替换
		var baseUrl = OuterControl.ouiTransUrl+'';
		var useOuterUrl = this.attr('useOuterUrl');
		if(useOuterUrl || ((!baseUrl)||(baseUrl=='/'))){ //如果配置使用第三方提供jsonp路径，则使用第三方路径，否则通过内部jsonp地址中转
			baseUrl = url;
		}else{//内部中转地址需要指定url属性 //始終請求内部地址，由后台服务器中转第三方路径
			baseUrl = oui.setParam(baseUrl,'url',url);
		}
		var doScript = this.attr('doScript');
		if(!doScript){
			oui.getTop().oui.alert('获取第三页面数据失败，外部控件没有提供数据获取脚本，请联系管理员');
			return ;
		}
		var me = this;
		var confirm = {
			text: "确定",
			action: function () {
				var result = '';
				try{
					var fun = oui.parseJson2Function(doScript);
					result = fun(me.dialog.getWindow())||"";//传入当前iframe的window对象
					me.attr('value',result);
					$(me.getEl()).find('input').val(result);
					if(result){
						$(me.getEl()).find("#form_delete_info_btn_" + me.attr('ouiId')).show();
					}else{
						$(me.getEl()).find("#form_delete_info_btn_" + me.attr('ouiId')).hide();
					}
				}catch(e){
					var funStr = oui.getFunctionStringByJson(doScript);
					oui.getTop().oui.alert('获取第三方页面数据失败,请联系管理员，检查第三方控件数据结果处理脚本,'+funStr+'\n'+e);
					throw new Error('获取第三方页面数据失败,请联系管理员，检查第三方控件数据结果处理脚本,'+funStr+'\n'+e);
					return ;
				}
				me.dialog.hide();
				me.dialog = null;
				return false;
			}
		};
		var cancel = {
			text: "取消",
			cls: 'oui-dialog-cancel',
			action: function () {


				me.dialog.hide();
				me.dialog = null;
				return false;
			}
		};
		var actions = [];
		if(oui.os.mobile){
			/** 移动端，取消在前，确定在后***/
			actions.push(cancel);
			actions.push(confirm);
		}else{
			actions.push(confirm);
			actions.push(cancel);
		}
		var dialog = oui.showUrlDialog({
			title:'第三方数据页面',
			url:baseUrl,
			useIFrame:true,
			actions: actions
		});
		me.dialog = dialog;
		/** 监听iframe加载完成**/
		var processBar = oui.getTop().oui.progress("第三方页面加载中,请稍后");
		try{
			oui.bindIframeReady($(dialog.getEl()).find('iframe')[0],function(doc,win){
				processBar&&processBar.hide();
			});
		}catch(e){
			processBar&&processBar.hide();
			throw new Error(e);
			oui.getTop().oui.alert('加载第三页面错误，请联系管理员处理'+'\n'+e);
		}
	};
	/** 加载第三方数据***/
	var loadData = function(searhType){
		searhType = searhType || SearchTypeEnum.def;
		this.attr('searchType',searhType); //查询类型
		var loadType = this.attr('loadType')||'json'; //页面，json,默认值为json传输
		var ouiId = this.attr('ouiId');
		var url =this.attr('url');
		if(url){
			if(loadType =='page'){
				this.loadData4page();
			}else if(loadType =='json' || loadType =='jsonp'||loadType =='jsonList' || loadType =='jsonpList'){
				this.loadData4json();
			}
		}else{
			oui.getTop().oui.alert('获取第三方数据，所需url不能为空,请联系管理员配置第三方控件数据获取路径');
		}
		this.attr('hasLoadData',true);
	};

	var loadData4search = function(){
		this.loadData(SearchTypeEnum.loadData4search);
	};

	var loadData4RealSearch = function(){
		this.loadData(SearchTypeEnum.loadData4RealSearch);
	};
	var validate = function(){
		var el = this.getEl();
		var targetEl = $(el).find('#'+this.attr('id'))[0];
		return oui.validate(targetEl);
	};

	var focus = function () {
		var ouiId = this.attr('ouiId');
		var el = this.getEl();
		var targetEl = $(el).find('input')[0];
		if(!oui.os.mobile){
			oui.hideErrorInfo(targetEl);
		}
		var v = $(targetEl).val();
		if(v){
			$(el).find("#form_delete_info_btn_" + ouiId).show();
		}else{
			$(el).find("#form_delete_info_btn_" + ouiId).hide();
		}
		var data = this.attr('data');
		if(data && data.length){ //说明已经有数据
			this.showSelectArea();
			this.filterSelectArea();
		}else{
			//第一次触发外部接口调用显示
			//否则进行隐藏
			if(!this.attr('hasLoadData')){
				//this.loadData();
			}else{
				this.hideSelectArea();
			}
		}

	};
	var keyup = function(){
		var ouiId = this.attr('ouiId');
		var el = this.getEl();
		var targetEl = $(el).find('input')[0];
		var v = $(targetEl).val();
		if(v){
			$(el).find("#form_delete_info_btn_" + ouiId).show();
		}else{
			$(el).find("#form_delete_info_btn_" + ouiId).hide();
		}
		this.filterSelectArea();
	};
	var clearContent = function () {
		var el = this.getEl();
		var ouiId = this.attr('ouiId');
		$(el).find("input").val('');
		this.attr('value', '');
		$(el).find("#form_delete_info_btn_" + ouiId).hide();
		this.hideSelectArea();
		this.triggerUpdate();
		this.triggerAfterUpdate();
		return false;
	};
	/** 选中下拉中某个选项,并隐藏下拉区域 **/
	var selectOne = function(index){
		var me = this;
		var data = this.attr('data');
		var item = data[index]||{};
		var value = item.value||"";
		var el = this.getEl();
		$(el).find('input').val(value);
		this.attr('value',value);
		var ouiId = this.attr('ouiId');
		if(value){
			$(el).find("#form_delete_info_btn_" + ouiId).show();
		}else{
			$(el).find("#form_delete_info_btn_" + ouiId).hide();
		}
		try{
			var dataCfg = me.attr('dataCfg');//缓存结果配置
			var fillback = dataCfg.fillback;
			fillback&&fillback(item);
		}catch(e){
			oui.getTop().oui.alert('外部控件['+this.attr('title')+'],配置脚本中 fillback事件执行异常，请联系管理员检查');
		}
		this.hideSelectArea();
		this.triggerUpdate();
		this.triggerAfterUpdate();
	};
	/** 隐藏下拉区域**/
	var hideSelectArea = function(){
		var el = this.getEl();
		$(el).removeClass('show-select');
	};
	/** 显示下拉区域***/
	var showSelectArea = function(){
		var el = this.getEl();
		$(el).addClass('show-select');
		oui.follow4fixed($(el).find('input')[0],$(el).find('.outercontrol-select')[0]);
	};

	/** 过滤下拉区域***/
	var filterSelectArea = function(){
		var value = this.attr('value');
		//根据 当前控件值进行过滤 待选项
		var el = this.getEl();
		$(el).find('.outercontrol-select').find('li').each(function(){
			/** 模糊匹配**/
			if($(this).html().indexOf(value)>=0 || $(this).attr('value').indexOf(value)>=0 ){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
	};
})(window);





