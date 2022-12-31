(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.ouiformcontrol;
	//控件构造器
	var RichText = function(cfg) {
		Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数
		this.attrs = this.attrs+",richStyle,onContentChange,toolBarType";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 单选框初始化
		 */
		this.init = init; 
		this.afterRender = afterRender;
		this.afterRender4require = afterRender4require;
		this.destroy = destroy;
	};
	RichText.FullName = "oui.$.ctrl.richtext";//设置当前类全名
	ctrl["richtext"] = RichText;//将控件类指定到特定命名空间下	
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	RichText.templateHtml=[];
	RichText.templateHtml[0] ='<textarea id="{{id}}" '+
	'{{if right&&(right=="design")}}disabled="disabled" '+
	'{{/if}}'+
	'name="{{name}}" style="{{richStyle}}" onfocus="oui.hideErrorInfo(this);" class="oui-form" validate="{{validate}}" {{=commonEvent}} ></textarea>';
	 
	/************************************控件初始化init **************************/
	var init =function(){
		
	}; 
	function getContextPath(){
		if(oui.getContextPath){
			return oui.getContextPath();
		}
		var pathName = document.location.pathname;
		var index = pathName.substr(1).indexOf("/");
		var result = pathName.substr(0, index + 1) + "/";
		if(result =='/res_common/' || result =='/res_apps/'){//获取的第一个目录路径与 公共路径相同则根路径为/
			result = '/';
		}
		return result;
	}
	var loadConfig ={loadedAll:false,newId:0};
	function getNewTagId(){
		loadConfig.newId ++;
		return loadConfig.newId;
	}
	function load4sort(arr,callback){
		if(arr.length==0){
			callback();
			return ;
		}
		var runArr = [];
		var next = function(){
			var idx = this.idx;
			var len = this.len;
			runArr[idx+1].run();
		}
		var run = function(){
			var idx= this.idx;
			var len = this.len;
			
			if(idx==len-1){
				loadArr([this.url],function(){
					callback();	
				});
					
			}else{
				var me = this;
				loadArr([this.url],function(){
					me.next();
				});
			}
		}
		for(var i=0,len=arr.length;i<len;i++){
			runArr.push({
				url:arr[i],
				idx:i,
				len:len,
				next:next,
				run: run
			});
		}
		runArr[0].run();
	}
	
	/**
	 * 加载js列表资源
	 */
	function loadArr(arr,callback){
		var idPrefix = 'script_4richedit_';
		var contextPath = getContextPath();
		
		for(var i=0,len=arr.length;i<len;i++){
			var currNewId = idPrefix+getNewTagId();
			loadConfig[currNewId] = {loaded:false};
			loadJs(currNewId,contextPath+arr[i],function(){
				var sid = this.getAttribute('id');
				loadConfig[sid].loaded = true;
				var flag = true;
				if(!callback){
					return ;
				}
				if(loadConfig.loadedAll){
					return ;
				}
				for(var k in loadConfig){
					if(k =='loadedAll' || k =='newId'){
						continue;
					}
					if(!loadConfig[k].loaded){
						flag  = false;
					}
				}
				if(flag){
					loadConfig.loadedAll = true;
					callback();
				}
			});
		}
	}
	/**
	 * 加载 js资源
	 */
	function loadJs(sid,jsurl,callback){
		loadConfig.loadedAll = false; //没有加载完毕
		var nodeHead = document.getElementsByTagName('head')[0];
		var nodeScript = null;
		if(document.getElementById(sid) == null){
			nodeScript = document.createElement('script');
			nodeScript.setAttribute('type', 'text/javascript');
			nodeScript.setAttribute('src', jsurl);
			nodeScript.setAttribute('id',sid);
			if (callback != null) {
				nodeScript.onload = nodeScript.onreadystatechange = function(){
					if (nodeScript.ready) {
						return false;
					}
					if (!nodeScript.readyState || nodeScript.readyState == "loaded" || nodeScript.readyState == 'complete') {
						nodeScript.ready = true;
						callback.call(nodeScript);
					}
				};
			}
			nodeHead.appendChild(nodeScript);
		} else {
			if(callback != null){
				callback.call(document.getElementById(sid));
			}
		}
	};
	/**
	 * 渲染后置函数
	 */
	var  afterRender = function(){
		var _self = this;
		if(typeof win.nicEditor =='function'){ //判断Editor是否已经加载
			_self.afterRender4require();
			return ;
		}
		oui.require([
			oui.getContextPath()+'res_common/third/nicEdit/nicEdit.js'
		],function(){
			_self.afterRender4require();
		},function(){},(oui_context&&oui_context.debug)?false:true);
	};
	/**
	 * 渲染后置函数中执行 资源引入 并且在回调中执行富文本初始化
	 */
	var afterRender4require = function(){
		var _self = this;
		 
		$(function() {  
			 
			
			 var toolBarType = _self.attr('toolBarType') ||'1'; //默认为1,简单模式 ; 
			 var toolBarButtonsConfig = { //1:简单模式 2:全功能
			 	 "1":{
			 	 	'bold' : {name : "加粗", command : 'Bold', tags : ['B','STRONG'], css : {'font-weight' : 'bold'}, key : 'b'},
					'italic' : {name : "倾斜", command : 'Italic', tags : ['EM','I'], css : {'font-style' : 'italic'}, key : 'i'},
					'underline' : {name : "底线", command : 'Underline', tags : ['U'], css : {'text-decoration' : 'underline'}, key : 'u'},
					'left' : {name : "居左", command : 'justifyleft', noActive : true},
					'center' : {name : "居中", command : 'justifycenter', noActive : true},
					'right' : {name : "居右", command : 'justifyright', noActive : true,hidden:true},
					'justify' : {name :"两端对齐", command : 'justifyfull', noActive : true,hidden:true},
					'ol' : {name :"有序列表",hidden:true, command : 'insertorderedlist', tags : ['OL']},
					'ul' : 	{name : "无序列表",hidden:true, command : 'insertunorderedlist', tags : ['UL']},
					'subscript' : {name : "下标",hidden:true, command : 'subscript', tags : ['SUB']},
					'superscript' : {name : "上标",hidden:true, command : 'superscript', tags : ['SUP']},
					'strikethrough' : {name : "删除线", command : 'strikeThrough', css : {'text-decoration' : 'line-through'}},
					'removeformat' : {name : "清除样式",hidden:true, command : 'removeformat', noActive : true},
					'indent' : {name : "缩进",hidden:true, command : 'indent', noActive : true},
					'outdent' : {name : "删除缩进",hidden:true, command : 'outdent', noActive : true},
					'hr' : {name : "横线",hidden:true, command : 'insertHorizontalRule', noActive : true},
					'upload':{name : '上传图片', type : 'nicUploadButton',hidden:true},
					'xhtml' : {name : 'Edit HTML', type : 'nicCodeButton',hidden:true}  ,
					
					'forecolor' : {name : __('字体颜色'), type : 'nicEditorColorButton', noClose : true,hidden:true},
					'bgcolor' : {name : __('背景颜色'), type : 'nicEditorBgColorButton', noClose : true,hidden:true},
					'link' : {name : '添加链接', type : 'nicLinkButton', tags : ['A'],hidden:false},
					'unlink' : {name : '取消链接',  command : 'unlink', noActive : true,hidden:true}
			 	 },
			 	 "2":{ //全功能 
			 	 	 'bold' : {name : "加粗", command : 'Bold', tags : ['B','STRONG'], css : {'font-weight' : 'bold'}, key : 'b'},
					'italic' : {name : "倾斜", command : 'Italic', tags : ['EM','I'], css : {'font-style' : 'italic'}, key : 'i'},
					'underline' : {name : "底线", command : 'Underline', tags : ['U'], css : {'text-decoration' : 'underline'}, key : 'u'},
					'left' : {name : "居左", command : 'justifyleft', noActive : true},
					'center' : {name : "居中", command : 'justifycenter', noActive : true},
					'right' : {name : "居右", command : 'justifyright', noActive : true},
					'justify' : {name :"两端对齐", command : 'justifyfull', noActive : true},
					'ol' : {name :"有序列表",hidden:false, command : 'insertorderedlist', tags : ['OL']},
					'ul' : 	{name : "无序列表",hidden:false, command : 'insertunorderedlist', tags : ['UL']},
					'subscript' : {name : "下标",hidden:false, command : 'subscript', tags : ['SUB']},
					'superscript' : {name : "上标",hidden:false, command : 'superscript', tags : ['SUP']},
					'strikethrough' : {name : "删除线", command : 'strikeThrough', css : {'text-decoration' : 'line-through'}},
					'removeformat' : {name : "清除样式",hidden:true, command : 'removeformat', noActive : true},
					'indent' : {name : "缩进",hidden:false, command : 'indent', noActive : true},
					'outdent' : {name : "删除缩进",hidden:false, command : 'outdent', noActive : true},
					'hr' : {name : "横线",hidden:false, command : 'insertHorizontalRule', noActive : true},
					'upload':{name : '上传图片', type : 'nicUploadButton',hidden:true},
					'xhtml' : {name : 'Edit HTML', type : 'nicCodeButton',hidden:true},
					'forecolor' : {name : ('字体颜色'), type : 'nicEditorColorButton', noClose : true,hidden:false},
					'bgcolor' : {name : ('背景颜色'), type : 'nicEditorBgColorButton', noClose : true,hidden:false},
					'fontSize' : {name : ('字体大小'), type : 'nicEditorFontSizeSelect', command : 'fontsize',hidden:false},
					'fontFamily' : {name : ('字体类型'), type : 'nicEditorFontFamilySelect', command : 'fontname',hidden:false},
					'fontFormat' : {name : ('标题'), type : 'nicEditorFontFormatSelect', command : 'formatBlock',hidden:false},
					'link' : {name : '添加链接', type : 'nicLinkButton', tags : ['A'],hidden:false},
					'unlink' : {name : '取消链接',  command : 'unlink', noActive : true,hidden:false}
			
			 	 }
			 }; 
			 var value = _self.attr('value');
			 var buttons = toolBarButtonsConfig[toolBarType];
			 var panelInstance =  new nicEditor({
				fullPanel : true,
				iconsPath : getContextPath()+'res_common/third/nicEdit/nicEditorIcons.gif',
				buttons : buttons,
				buttonList : ['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','link','unlink','forecolor','bgcolor']
				
			}).panelInstance(_self.attr('id'));
			var editor = panelInstance.nicInstances[0];  
			
			editor.setContent(value.replace(/<script/gi, "&lt;script").replace(/<\/script/gi, "&lt;\/script"));
			//alert(_self.attr('value'));
			
			editor.richtextControl = _self;
			editor.onChange = function(){
				
				if(!this.richtextControl){
					return ;
				}
				var lastValue = this.richtextControl.attr('value');
				var currValue = this.getContent();
				if(lastValue ==currValue){
					return ;
				}
				this.saveContent();
				this.richtextControl.attr('value',currValue);
				this.richtextControl.triggerUpdate();
				this.richtextControl.triggerAfterUpdate();
				if(this.richtextControl.attr('onContentChange')){
					eval(this.richtextControl.attr('onContentChange')); 
				}
			}
			_self.attr({
				value:value,	
				editor:editor,
				panelInstance:panelInstance
			}); 
		});
	};
	/**
	 * 销毁对象方法
	 *
	 */ 
	var destroy  = function(){
		if(this.attr('editor')){
			this.attr('panelInstance').removeInstance();
			this.attr('editor').remove();
			this.attr('editor','');
			this.attr('panelInstance','');
		}
		
	};
	
})(window);





