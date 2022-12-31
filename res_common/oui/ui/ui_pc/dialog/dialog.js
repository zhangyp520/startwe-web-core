(function(win){
	var ctrl = oui.$.ctrl;
	var Control = ctrl.basecontrol;
	/**
	 * 控件类构造器
	 */
	var Dialog = function(cfg) {
		Control.call(this,cfg);//必须继承控件超类
		/*
		 * 增加dialog皮肤  theme属性(默认不配置，否则从1...n)
		 */
		this.attrs = this.attrs+",events,direction,success,error,ok,cancel,close,no,title,content,lValue,mValue,rValue,actions,contentCls,contentStyle,titleStyle,theme,isHideHeader,isNotTop";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		this.show=show;
		this.hide=hide;
		this.afterRender=afterRender;
		this.closeClick=closeClick;
		this.cancelClick=cancelClick;
		this.okClick=okClick;
		this.noClick=noClick;
		this.init = function(){
			this.attr("title",this.attr("title")||"");
			this.attr("content",this.attr("content")||"");

			this.attr("directionCls",Dialog.direction[this.attr("direction")]||"oui-zoomIn");
			this.attr("lValue",this.attr("lValue")||"取消");
			this.attr("mValue",this.attr("mValue")||"否");
			this.attr("rValue",this.attr("rValue")||"确定");
		};
		this.getWindow = getWindow;
		this.setContentStyle = setContentStyle;
	};
	/***获取dialog里面的window对象 ****/
	var getWindow = function(){
		var el = this.getEl();
		if(this.attr('url')){
			var iframe = $(el).find('iframe');
			if(iframe&& iframe.length){
				return iframe[0].contentWindow;
			}else{
				return win;
			}
		}else{
			return win;
		}
	};
	ctrl["dialog"] = Dialog;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

	Dialog.FullName = "oui.$.ctrl.dialog";//设置当前类全名 静态变量
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Dialog.templateHtml=[];
	Dialog.templateHtml[0] ='<div class="oui-dialog oui-show test1">'+
	'<div class="oui-dialog-cnt oui-animated oui-zoomIn">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick()" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-bd ">'+

	'<div class="oui-dialog-content" style="{{contentStyle}}">{{=content}}</div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')" class="oui-dialog-ok submit-button" targetOuiId={{ouiId}}>{{rValue}}</button>'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).cancelClick(\'cancel\')" class="oui-dialog-cancel" targetOuiId={{ouiId}}>{{lValue}}</button>'+
	'</div>'+
	'</div>'+
	'</div>' ;

	Dialog.templateHtml[1] ='<div class="oui-dialog oui-show test2">'+
	'<div class="oui-dialog-cnt">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-bd">'+
	'<h4>{{content}}</h4>'+
	'<div class="oui-dialog-content" style="{{contentStyle}}"><input value="{{value}}" {{=commonEvent}} type="text"></div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).cancelClick(\'cancel\')" class="oui-dialog-cancel" targetOuiId={{ouiId}}>{{lValue}}</button>'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')" class="oui-dialog-ok submit-button" targetOuiId={{ouiId}}>{{rValue}}</button>'+
	'</div>'+
	'</div>'+
	'</div>' ;
	Dialog.templateHtml[2]='<div class="oui-loading-block oui-dialog oui-show test3">'+
	'<div class="oui-loading-cnt">'+
	'<i class="oui-loading-bright"  ></i>'+
	'<p>{{content}}</p>'+
	'</div>'+
	'</div>';
	Dialog.templateHtml[3]='<div class="oui-loading-wrap">'+
	'<p>{{content}}</p>'+
	'<i class="oui-loading" ></i>'+
	'</div>';
	Dialog.templateHtml[4] ='<div class="oui-dialog oui-show test4">'+
	'<div class="oui-dialog-cnt oui-animated  oui-zoomIn ">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-bd">'+

	'<div class="oui-dialog-content">{{=content}}</div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')"  class="oui-dialog-ok submit-button" targetOuiId={{ouiId}}>{{rValue}}</button>'+
	'</div>'+
	'</div>'+
	'</div>' ;
	Dialog.templateHtml[5] ='<div class="oui-dialog oui-show test5">'+
	'<div class="oui-dialog-cnt">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-bd">'+

	'<div class="oui-dialog-content" style="{{contentStyle}}">{{content}}</div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
	'</div>'+
	'</div>'+

	'</div>' ;
	Dialog.templateHtml[6] ='<div class="oui-dialog oui-show test6">'+
	'<div class="oui-dialog-cnt">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-bd">'+
	'<h4>{{content}}</h4>'+
	'<div class="oui-dialog-content" style="{{contentStyle}}"><textarea {{=commonEvent}} value={{value}} class="oui-textarea"></textarea></div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+

	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).cancelClick(\'cancel\')" class="oui-dialog-cancel" targetOuiId={{ouiId}}>{{lValue}}</button>'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')" class="oui-dialog-ok submit-button" targetOuiId={{ouiId}}>{{rValue}}</button>'+
	'</div>'+
	'</div>'+
	'</div>' ;
	Dialog.templateHtml[7] ='<div class="oui-dialog oui-show test7">'+
	'<div class="oui-dialog-cnt" style="{{contentStyle}}">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-bd">'+

	'<div class="oui-dialog-content" style="{{contentStyle}}">{{content}}</div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+

	'<button type="button"  class="oui-dialog-cancel" onclick="oui.getByOuiId({{ouiId}}).cancelClick(\'cancel\')" targetOuiId={{ouiId}}>{{lValue}}</button>'+
	'<button type="button" class="oui-dialog-no submit-button" onclick="oui.getByOuiId({{ouiId}}).noClick(\'no\')" targetOuiId={{ouiId}}>{{mValue}}</button>'+
	'<button type="button" class="oui-dialog-ok submit-button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')" targetOuiId={{ouiId}}>{{rValue}}</button>'+
	'</div>'+
	'</div>'+
	'</div>' ;

	Dialog.templateHtml[8]='<div class="oui-dialog oui-show test8" style="">'+
	'<div  class="oui-dialog-cnt oui-dialog-all oui-animated  {{directionCls}}" style="{{contentStyle}}">'+
	'{{if !(isHideHeader || isHideHeader+"" === "true")}}'+
	'<header class="oui-dialog-hd{{!theme?"":"-"+theme}} oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'{{/if}}'+
	'<div class="oui-dialog-bd{{=url?"-iframe":""}} oui-dialog-body ">'+

	'<div class="oui-dialog-content {{contentCls}}"  >{{=content}}</div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
	'{{each actions as item index}}'+
	'<span type="button" id="{{item.id}}" class="{{item.cls||"oui-dialog-ok"}} submit-button" onclick="oui.getByOuiId({{ouiId}}).attr(\'actions\')[{{index}}].action();"  dialog-btn-idx="{{index}}"  targetOuiId={{ouiId}}>{{item.text||""}}</span>'+
	'{{/each}}'+
	'</div>'+
	'</div>'+

	'</div>' ;

	/**
	 * 进度条模板
	 */
	Dialog.templateHtml[9]='<div class="oui-dialog  oui-show test9">'+


		'<div class="oui-dialog-cnt oui-animated  oui-zoomIn" >'+
		'{{=content||"<img src=\''+oui_context.contextPath+'res_common/oui/ui/ui_pc/images/oui-progress.gif\'/>" }}'+
		'</div>'+
	'</div>' ;
	Dialog.templateHtml[10] ='<div class="oui-dialog oui-show test10">'+
	'<div class="oui-dialog-cnt oui-dialog-animate-{{direction}}">'+
	'<header class="oui-dialog-hd oui-border-b">'+
	'<h3>{{=title}}</h3>'+
	'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
	'</header>'+
	'<div class="oui-dialog-body">'+

	'<div class="oui-dialog-content" style="{{contentStyle}}">{{=content}}</div>'+
	'</div>'+
	'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).cancelClick(\'cancel\')" class="oui-dialog-cancel" targetOuiId={{ouiId}}>{{lValue}}</button>'+
	'<button type="button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')" class="oui-dialog-ok submit-button" targetOuiId={{ouiId}}>{{rValue}}</button>'+
	'</div>'+
	'</div>'+

	'</div>' ;
	/**
	 * oui.showUrlDialog 的模板
	 var obj= oui.showUrlDialog({
		url:'/CloudUI/res_apps/form/pc/design/design.html',
		contentStyle:'width:600px;height:500px',
		actions:[{text:'tt',
		cls:'',//cls:'',//指定自定义样式名 可以实现自定义按钮样式和位置
		action:function(){ obj.hide(); }}],
		title:'heloo'
	 });
	 */
	Dialog.templateHtml[11]='<div class="oui-dialog oui-show test11">'+
		'<div class="oui-dialog-area" style="{{contentStyle}}">'+
			'{{if isShowClose}}'+
			'<span class="show-close-btn" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId="{{ouiId}}"></span>'+
			'{{/if}}'+
			'{{if !(isHideHeader || isHideHeader+"" === "true")}}'+
			'<header class="oui-dialog-hd{{!theme?"":"-"+theme}} oui-border-b">' +
				'<h3 style="{{titleStyle}}">{{=title}}</h3>'+
				'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
			'</header>'+
			'{{/if}}'+
			'<div class="oui-dialog-iframe-content" style="padding:{{if url}}0{{/if}};{{isHideHeader?("top:0;"):""}}{{isHideFooter?("bottom:0;"):""}}">'+
			'{{if url}}'+
			'<iframe id="{{iframeId}}" src="{{url}}&ouiDialogId={{ouiId}}"></iframe>'+
			'{{/if}}'+

			'{{if (!url) && content}}'+
			'{{=content}}'+
			'{{/if}}'+
			'</div>'+
			'<div class="oui-dialog-ft{{!theme?"":"-"+theme}}{{isHideFooter?"-hide":""}}">'+
				'{{each actions as item index}}'+
				'<span type="button" id="{{item.id}}" class="{{item.cls||"oui-dialog-ok"}} submit-button" onclick="oui.getByOuiId({{ouiId}}).attr(\'actions\')[{{index}}].action();"  dialog-btn-idx="{{index}}"  targetOuiId={{ouiId}}>{{item.text||""}}</span>'+
				'{{/each}}'+
			'</div>'+
	'</div>'+
	'</div>';

	Dialog.templateHtml[12] =
		'<div class="oui-dialog">'+
		'<div class="oui-dialog-cnt" style="{{contentStyle}}">'+
		'{{if !(isHideHeader || isHideHeader+"" === "true")}}'+
		'<header class="oui-dialog-hd">'+
		'<h3>{{=title}}</h3>'+
		'<i class="oui-dialog-close" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId={{ouiId}}></i>'+
		'</header>'+
		'{{/if}}'+
		'<div class="oui-dialog-bd">'+
		'{{each inputs as item index}}'+
		'<div class="dialog-input" style="{{item.inputAreaStyle}}">'+
		'{{if item.title && item.title.length > 0}}'+
		'<label>{{=item.title}}</label>'+
		'{{/if}}'+
        '{{if item.errorElId && item.errorElId.length > 0}}'+
        '<span style="color:#ff0000" id="{{=item.errorElId}}"></span>'+
        '{{/if}}'+
		'{{if item.type=="textarea"}}'+
		'<textarea name="dialogInput-{{ouiId}}" {{if item.rows}}rows="{{item.rows}}"{{/if}} {{if item.readOnly}}readOnly="readOnly"{{/if}} style="{{item.style}}"  class="input-dialog-text" validate="{{oui.parseString(item.validate)}}" placeholder="{{item.placeholder || \'请输入...\'}}">{{item.value}}</textarea>'+
		'{{else}}'+
		'{{if item.type=="number"}}'+
		'<oui-form type="number" id="number-{{ouiId}}" {{if item.readOnly}}readOnly="readOnly"{{/if}} style="{{item.style}}" name="dialogInput-{{ouiId}}" value="{{item.value||0}}"  placeholder="{{item.placeholder || \'请输入...\'}}" validate="{{oui.parseString(item.validate)}}"></oui-form>'+
		'{{else}}'+
		'<input type="{{item.type || \'text\'}}" {{if item.readOnly}}readOnly="readOnly"{{/if}} style="{{item.style}}" name="dialogInput-{{ouiId}}" validate="{{oui.parseString(item.validate)}}" class="input-dialog-text" value="{{item.value}}" placeholder="{{item.placeholder || \'请输入...\'}}">'+
		'{{/if}}'+
		'{{/if}}'+
		'</div>'+
		'{{/each}}'+
		'</div>'+
		'<div class="oui-dialog-ft">'+
		'<span class="oui-dialog-ok submit-button" onclick="oui.getByOuiId({{ouiId}}).okClick(\'ok\')" targetOuiId={{ouiId}}>{{rValue}}</span>'+
		'<span class="oui-dialog-cancel" onclick="oui.getByOuiId({{ouiId}}).cancelClick(\'cancel\')" targetOuiId={{ouiId}}>{{lValue}}</span>'+
		'</div>'+
		'</div>'+
		'</div>';
	/** 显示图片dialod****/
	Dialog.templateHtml[13] = '<div class="oui-dialog-viewImage">'+
		'<i class="image-box-close"  onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId="{{ouiId}}" title="关闭"></i>'+
		'<div class="view-image-content">'+
		'<div class="view-image-box">'+
		'<img src="{{imgUrl}}" title="{{oui.getImgUrl4Title(imgUrl)}}" />'+
		'</div>'+
		'</div>'+
		'<div class="view-image-bg" onclick="oui.getByOuiId({{ouiId}}).closeClick(\'close\')" targetOuiId="{{ouiId}}"></div>'+
		'</div>';
	/** 动态设置dialog 内容样式****/
	var setContentStyle = function(cfg){
		var param = cfg;
		if(typeof cfg =='string'){
			param = {};
			var arr = cfg.split(';');
			for(var i= 0,len=arr.length;i<len;i++){
				var key = arr[i].split(':')[0]||'';
				key = $.trim(key);
				var v = arr[i].split(':')[1]||'';
				v = $.trim(v);
				param[key]= v;
			}
		}
		var showType = this.attr('showType');
		showType = parseInt(showType+'');
		var el = this.getEl();
		if([0,1,4,5,6,7,10].indexOf(showType)>-1){
			$(el).find('.oui-dialog-content').css(param);
		}
		switch (showType){
			case 7:
			case 8:
			case 12:
				$(el).find('.oui-dialog-cnt').css(param);
				break;
			case 11:
				$(el).find('.oui-dialog-area').css(param);
				break;
		}
	};
	/**
	 * 点击关闭按钮触发的事件
	 */
	var closeClick=function(){

		if(this.attr('canNotClose')){
			return ;
		}
		this.hide('close');

	};
	var okClick=function(){
		this.hide('ok');

	};
	var cancelClick=function(){
		this.hide('cancel');

	};
	var noClick=function(){
		this.hide('cancel');

	};


	/**
	 * 显示当前对话框控件
	 * @param cfg Object 传入一个属性配置的参数，用于重新显示对话框
	 */
	var show=function(cfg){
		var el=this.getEl();
		if(cfg){
			this.attr(cfg);
		}
		var showType=this.attr("showType");
		var url=this.attr("url")||"";
		//以后将用ouiId来获取dialog对象 备忘编号【1】
		var ouiId =this.attr("ouiId");
		if(showType=='8'){
			this.attr("directionCls",Dialog.direction[this.attr("direction")]||"oui-zoomIn");
		}
		if((showType=="8") &&  (url)){
			$.ajax({
				url:url,
				success:function(text){
					var obj=oui.getByOuiId("ouiId");
					obj.attr('content',text);
					obj.render();
					obj.attr("success") && obj.attr("success")();
				},
				error:function(){
					var obj=oui.getByOuiId("ouiId");
					obj.attr('content','require url error...');
					obj.render();
					obj.attr("error") && obj.attr("error")();
				}
			});
		}else{
			this.render();
			$(el).find(".oui-dialog").hasClass("oui-show")?"":$(el).find(".oui-dialog").addClass("oui-show");
		}

	};

	/**
	 *隐藏当前的对话框
	 * @param action string 传入隐藏过后的所要执行的回调函数 ok,close,cancel,no当传入为空时只隐藏
	 */
	var hide=function(action){
		//销毁事件的绑定
		var zIndex = this.attr('zIndex')-1;
		Dialog.zIndex = zIndex;
		var el=this.getEl();
		var showType=this.attr("showType");
		if((showType+"")=="9"){
			var finish=this.attr("finish");
			finish&&finish();
		}
		if((showType+'') =='11'){
			$(el).find(".oui-dialog").is("hidden")? "": $(el).find(".oui-dialog").hide();
		}else{
			$(el).find(".oui-dialog").is("hidden")? "": $(el).find(".oui-dialog").hide();
		}
		//$(el).find(".oui-dialog").hasClass("oui-show")?$(el).find(".oui-dialog").removeClass("oui-show"):"";
		var callback = this.attr('callback');
		if(action){
			if(callback){
				callback(action);
			}
			var actionFun = this.attr(action);
			if(actionFun){
				actionFun();
			}
		}
		var me = this;
		/**隐藏时弹框时，清空缓存和dom对象 ***/
        me.showScrollBar&&me.showScrollBar();
        oui.clearByContainer(el);
        oui.clearByOuiId(me.attr('ouiId'));
		$(el).remove();
	};
	/**
	 * 用于页面渲染后初始化事件得绑定
	 */
	var afterRender=function(){
	//事件绑定，用户自定义的html事件绑定
		this.attr("events")&&this.attr("events")(this);

		$(this.getEl()).children().css('z-index',Dialog.dialogMaxZIndex+1);
		var me = this;
		$(Dialog.currDialogOuiIds).each(function(){
			var curr = oui.getByOuiId(this);
			if(!curr){
				return ;
			}
			if(me==curr){
				return ;
			}
			$(curr.getEl()).children().css('z-index',curr.attr('zIndex'));
		});


	};
	Dialog.msgIdx=0;
	Dialog.direction={
		left:"oui-inLeft",
		right:"oui-inRight",
		top:"oui-bounceInDown",
		down:"oui-bounceInUp",
		none:"oui-none"
	};
	Dialog.currDialogOuiIds = []; //当前页的所有弹出框的ouiId列表
	/**
	 *
	 * @param cfg 传入一个dialog控件的属性配置参数，用于初始化dialog对象属性配置
	 * @returns {Object} 返回一个通过cfg属性创建好的Dialog对象
	 */
	Dialog.dialog=function(cfg){
		Dialog.msgIdx++;
		var cfg=cfg;
		//dialog='<oui-control id="dialog_'+Dialog.msgIdx+'" type="dialog" showType="'+cfg.showType+'" mValue="'+cfg.mValue+  '" rValue="'+cfg.rValue+ '" lValue="'+cfg.lValue+ '" title="'+cfg.title+' content="'+cfg.content+'"></oui-control>';
		//var obj = oui.parseHtml(dialog,cfg);
		//$('body').append(obj.getHtml());
		var obj= oui.$.Parser.createControl(//创建我们的控件对象
			Dialog, //控件具体实现类
			{
				id:"dialog_"+Dialog.msgIdx,
				ouiId : oui.$.Parser.getNewId(),// 为控件自增ouiId
				type:"dialog",
				value:""//需要为控件赋上的值
			});
		obj.attr(cfg);
		obj.init();
		var ouiId =obj.attr('ouiId');//获取当前元素

		if(!cfg.isHidden)$('body').append(obj.getHtml());
		Dialog.zIndex++;
		Dialog.dialogMaxZIndex++;
		Dialog.currDialogOuiIds.push(ouiId);
		obj.attr('zIndex',Dialog.zIndex);
		obj.afterRender();


		return obj;
	};
	/*******************************控件类的自定义函数 end******************************************/
	/**
	 *带进度条的对话框
	 */
	var currProgress=null;
	oui.progress=function(msg,callback){
		var cfg={};
		cfg["content"]=msg;
		cfg["showType"]=9;
		cfg["percent"]=0;
		cfg["finish"]=callback;
		if(!oui.isEmptyObject(currProgress)){
			currProgress.attr(cfg);
			currProgress.show();
			return currProgress;
		}
		currProgress=Dialog.dialog(cfg);
		return  currProgress;
	};

	oui.progress.hide = function () {
		if(!oui.isEmptyObject(currProgress)){
			currProgress.hide();
		}
	};
	/**
	 *带进度条的对话框
	 {content:"html标签",
	 title:"标签名称",、
	 actions:[{text:"test确定",
				cls:'',//指定自定义样式名 可以实现自定义按钮样式和位置
				action: function(){
					alert("hhhhhh") ;obj.hide();
					}
			},
			{
				text:"test取消"

			}],
			success:function(){

			},
			error:function(){

			}
		}
	 */
	oui.showHTMLDialog=function(cfg){
		if(cfg){
			if(typeof cfg.isNotTop =='undefined'){
				cfg.isNotTop = true;
			}
		}
		var obj = oui.open(cfg);
		return obj;
	};

	/**
	 * 弹出新页面 调用 window.open
	 * 调用示例
	 * oui.openWindow({url:'/workflow/workflow.do?method=index&flowId=5763d2eb2492621c90e94bb0',title:'hello',params:{status:'no',scroll:'yes'}})
	 * 参数列表 配置 http://www.cnblogs.com/stswordman/archive/2006/06/02/415853.html
	 * @param cfg
	 */
	oui.openWindow = function(cfg){
		if(typeof cfg =='string'){
			cfg = {url:cfg};
		}
		var id = 'win_'+oui.getUUIDLong();
		var url=cfg.url,openType=cfg.openType||"",params=cfg.params ||{};
		var arr = [];
		params = $.extend(true,{
			status:'no',
			scroll:'yes',
			scrollbars:'yes',
			resizable:'yes',
			height:window.screen.availHeight-68,
			width: window.screen.availWidth-15,
			top:1,
			left:2,
			resizable: 'no', 
		},params);
		 
		for(var i in params){
			arr.push(i+'='+params[i]);
		}
		var openParam = arr.join(',');
 
        url = oui.addOuiParams4Url(url);
		url = oui.setParam(url,'ouiInWindowDialog','true');
		url = oui.setParam(url,'windowId',id);

		
		if(openType=='_blank'){//页签打开
			openParam=null;
		}
		if(!window._openMap){
			window._openMap = {};
		}
		/***循环处理 清空缓存 ****/
		for(var i in window._openMap){
			try{
				if(window._openMap[i]&&window._openMap[i].win&&(window._openMap[i].win.closed || (!window._openMap[i].win.top))){
					window._openMap[i]= null;
					delete window._openMap[i];
				}
			}catch(err){
			}
		}
		var win = null;
	
		
		if(openParam){
			win = window.open(url,openType,openParam);
		}else{
			win = window.open(url,openType);
		}
		window._openMap[id] =  {
			params:cfg.windowParams||"",
			win:win
		};
 
		return win;
	};
	/**
	 * oui.showUrlDialog 的模板
	 var obj= oui.showUrlDialog({
		url:'/CloudUI/res_apps/form/pc/design/design.html',
		contentStyle:'width:600px;height:500px', //自定义窗体宽度 高度
		actions:[{text:'tt',
		cls:'',//cls:'',//指定自定义样式名 可以实现自定义按钮样式和位置
		action:function(){ obj.hide(); }}],
		title:'heloo'
	 });
	 */
	oui.showUrlDialog=function(cfg){
		if(cfg && cfg.url){
			var url = oui.addParams(cfg.url,{_t:new Date().getTime()});
			cfg.url = url;
		}
		var obj = oui.open(cfg); 
		return obj;
	};
	/**
	 * alert 框控件
	 * @param msg String 显示的信息
	 * @param title String 显示信息的标题
	 * @param ok  Function当用户点击确定是的回调函数
	 * @param close Function 当用户点击关闭按钮时执行的回调函数
	 * @returns {Object} 当前创建的对话框控件
	 */
	var alertDialog =null;
	oui.alert = function(msg,ok,param){
		param = param ||{};
		var title = param.title ||"提示";
		var c = param.close ||"";

		var cfg={};
		$.extend(true,cfg,param);
		cfg["content"]=msg;
		cfg["showType"]=4;
		cfg["title"]=title;

		cfg['ok']=ok;
		cfg['close']=c;
		if(!oui.isEmptyObject(alertDialog)){
			alertDialog.attr(cfg);
			alertDialog.show();
			return alertDialog ;
		}
		var obj=Dialog.dialog(cfg);
		alertDialog = obj;
		return  obj;
	}
	/**
	 * confirm 框控件
	 * @param msg String 显示的信息
	 * @param title String 显示信息的标题
	 * @param ok  Function当用户点击确定是的回调函数
	 * @param close Function 当用户点击关闭按钮时执行的回调函数
	 * @returns {Object} 当前创建的对话框控件
	 */
	oui.confirmDialog = function(msg,ok,cancel,param){
		param = param ||{};
		var title  = param.title ||"";
		var c = param.close ||"";

		var cfg={};
		cfg.rValue = param.confirmName ||'确认';
		cfg["content"]=msg;
		cfg["showType"]=0;
		cfg["title"]=title||"确认?";
		cfg['ok']=ok;
		cfg['close']=c;
		cfg['cancel']=cancel;
		$.extend(true,cfg,param);

		var obj=Dialog.dialog(cfg);
		return  obj;
	}
	/**
	 * notify 框控件
	 * @param msg String 显示的信息
	 * @param title String 显示信息的标题

	 * @param close Function 当用户点击关闭按钮时执行的回调函数
	 * @returns {Object} 当前创建的对话框控件
	 */
	oui.notify=function(msg,title,close){
		var cfg={};
		cfg["content"]=msg;
		cfg["showType"]=5;
		cfg["title"]=title||"提示框";

		cfg['close']=close;
		var obj=Dialog.dialog(cfg);
		return  obj;
	};
	/**
	 * prompt 框控件
	 * @param title String 显示的信息
	 * @param callback String 显示信息的标题
     * @param inputs String 显示信息的标题
	 * @param options object 配置
     * @returns {Object} 当前创建的对话框控件
	 */
    oui.showInputDialog = function (title, callback, inputs, options) {

        var cfg = {
            'showType': 12,
            'title': title
        };

        if (inputs && inputs.length > 0) {
            cfg['inputs'] = inputs;
        } else {
            cfg['inputs'] = [{type: 'text'}];
        }
        if(options){
        	cfg = $.extend(true,cfg,options);
		}

        var obj = Dialog.dialog(cfg);

		obj.okClick = function(clickName){
			var flag = true;
			if (callback) {
				var valuesArray = [];
				var values = $(this.getEl()).find('[name=dialogInput-'+this.attr('ouiId')+']');
				if (values.length > 0) {
					var flag = true;
					flag =  oui.checkForm(this.getEl());
					if(!flag){
						return false ;
					}
					values.each(function (i, o) {
						valuesArray.push($(this).val());
					});
					if(flag === false){
						return false;
					}
				}
				if (valuesArray.length == 1) {
					valuesArray = valuesArray[0];
				}
				flag = callback(valuesArray);
			}
			if (typeof flag == 'undefined' || flag) {
				this.hide('ok');
			}
			return false;
		};
		oui.parse();
        return obj;

		//var cfg={};
		//cfg["content"]=msg;
		//cfg["showType"]=1;
		//cfg["title"]=title||"请输入";
        //
		//cfg['ok']=ok;
		//cfg['close']=close;
		//cfg['cancel']=cancel;
		//var obj=Dialog.dialog(cfg);
		//return  obj;
	};
	/**
	 *loading 控件
	 *@param msg String 等待时显示的内容
	 *@param ismode Boolean 是否是以模态的形式显示等待框
	 */
	oui.loading=function(msg,ismode){
		var cfg={};
		if(ismode){
			cfg["showType"]=2;
		}else{
			cfg["showType"]=3;
		}
		cfg["content"]=msg;
		var obj=Dialog.dialog(cfg);
		return  obj
	};
	/**
	 * 多行文本 框控件
	 * @param msg String 显示的信息
	 * @param title String 显示信息的标题
	 * @param ok  Function当用户点击确定是的回调函数
	 * @param close Function 当用户点击关闭按钮时执行的回调函数
	 * @param cancel Function 当用户点击取消按钮时执行的回调函数
	 * @returns {Object} 当前创建的对话框控件
	 */

	oui.multiline=function(msg,title,ok,close,cancel){
		var cfg={};
		cfg["content"]=msg;
		cfg["showType"]=6;
		cfg["title"]=title||"请输入";
		cfg['ok']=ok;
		cfg['close']=close;
		cfg['cancel']=cancel;
		var obj=Dialog.dialog(cfg);
		return  obj;
	};
	/**
	 * yesnocancel 框控件
	 * @param msg String 显示的信息
	 * @param title String 显示信息的标题
	 * @param ok  Function当用户点击确定是的回调函数
	 * @param close Function 当用户点击关闭按钮时执行的回调函数
	 * @param cancel Function 当用户点击取消按钮时执行的回调函数
	 * @param no  Function当用户点击确定是的回调函数
	 * @returns {Object} 当前创建的对话框控件
	 */
	oui.yesnocancel=function(msg,title,ok,close,cancel,no){
		var cfg={};
		cfg["content"]=msg;
		cfg["showType"]=7;
		cfg["title"]=title||"yesnocancel";
		cfg['ok']=ok;
		cfg['close']=close;
		cfg['cancel']=cancel;
		cfg['no']=no;
		var obj=Dialog.dialog(cfg);
		return  obj;
	};
	/**
	 * 更新上传组件参数
	 */
	Dialog.updateUploadOptions = function(options){
		if(!options){
			return ;
		}
		if(!options.fileUploadLimit){
			if(typeof options.fileUploadLimit!='number'){
				options.fileUploadLimit='10';
			}
		}
		Dialog.upDialog.attr({
			/**
			 * 上传完成所有
			*/
			completeSuccess:function(){
				var data = oui.$.ctrl.dialog.upDialog.attr("successFiles");
				var result = [];
				for(var i in data){
					var serverData = oui.parseJson(data[i].serverData);
					var f= data[i].file;
					result.push({
						imgId:serverData.msg,
						success:serverData.success,
						name:f.name,
						clientFile:f
					});
				}
				var swfUpload = oui.$.ctrl.dialog.upDialog.attr('swfUpload');
				oui.$.ctrl.dialog.upDialog.hide();
				oui.$.ctrl.dialog.upDialog.attr({canNotClose:false,uploading:false});
				options.completeSuccess && options.completeSuccess(result,swfUpload);

			},
			fileNameMaxLength:options.fileNameMaxLength,
			isSingle:options.isSingle
		});
		//if(Dialog.upDialog.attr('swfUpload')){
		//	/*
		//	 * 更新 上传组件参数
		//	 */
		//	var swfUpload = Dialog.upDialog.attr('swfUpload');
		//	swfUpload.setPostParams(options.postParams || {});//上传参数
		//	swfUpload.setFileSizeLimit(options.fileSizeLimit || "5 MB"); //文件大小限制
 		//	swfUpload.setFileTypes(options.fileTypes || "*.*"); //文件类型限制
		//	swfUpload.setFileUploadLimit(options.fileUploadLimit);//文件个数限制
		//	if(options.isSingle){
		//		swfUpload.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE);
		//	}else{
		//		swfUpload.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES);
		//	}
        //
		//}

	};
	/**
	 * 初始化附件上传插件,解决 ie下不兼容问题；解决ie9下 getAttribute和getAttributeNode为null的问题
	 */
	var initSwfUploadPlugin = function(){
		if(oui.initedSwfUploadPlugin){
			return ;
		}

		oui.initedSwfUploadPlugin = true;
		/**
		 * 解决ie下 不兼容的问题
		 */
		SWFUpload.prototype.getFlashHTML = function (flashVersion) {
			var classid = "";
			if (oui.browser.ie){
				classid = ' classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
				//onload=' onload="flashLoadEnd();"';
			}

			return ['<object ',classid, 'id="', this.movieName, '" type="application/x-shockwave-flash" data="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
				'<param name="wmode" value="', this.settings.button_window_mode, '" />',
				'<param name="movie" value="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" />',
				'<param name="quality" value="high" />',
				'<param name="allowScriptAccess" value="always" />',
				'<param name="flashvars" value="' + this.getFlashVars() + '" />',
				'</object>'].join("");
		};
		/**
		 * 解决ie9 getAttribute 为null的问题
		 */
		SWFUpload.prototype.cleanUp = function () {
			var key, movieElement = this.getMovieElement();
			// Pro-actively unhook all the Flash functions
			try {
				if (movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
					this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
					for (key in movieElement) {
						try {//解决ie9 getAttribute 为null的问题
							if (typeof(movieElement[key]) === "function" && key[0] <= 'Z') {
								movieElement[key] = null;
							}
						} catch (ex) {
						}
					}
				}
			} catch (ex1) {

			}

			// Fix Flashes own cleanup code so if the SWF Movie was removed from the page
			// it doesn't display errors.
			window["__flash__removeCallback"] = function (instance, name) {
				try {
					if (instance) {
						instance[name] = null;
					}
				} catch (flashEx) {

				}
			};

			return movieElement;
		};

	};
	var interval,nextInter;
	/**
	 * 解决ie下flash加载 jquery报错问题(swfUpload getAttribute getAttributeNode为null)
	 */
	/*
     *
	 var flashLoadEnd = function(){
		if(true){
			return ;
		}
		if(!oui.browser.ie){ //解决 swfUpload在ie下的兼容问题
			return ;
		}
		var movieName = Dialog.upDialog.attr('swfUpload').movieName;
		if(interval || nextInter){
			return ;
		}
		var interval= setInterval(function(){
			if(document.getElementById(movieName)){
				clearInterval(interval);
				interval=null;
				document.getElementById(movieName).getAttribute = null;
				document.getElementById(movieName).getAttributeNode = null;

				var nextInter = setInterval(function(){
					if((!document.getElementById(movieName).getAttribute) ||(!document.getElementById(movieName).getAttributeNode)){
						document.getElementById(movieName).getAttribute = HTMLElement.prototype.getAttribute;
						document.getElementById(movieName).getAttributeNode = HTMLElement.prototype.getAttributeNode;

					}else{
						clearInterval(nextInter);
						nextInter=null;
					}
				},30);
			}
		},30);
	};
     */

	/**
	 * flash 上传
	 */
	oui.upload4flash = function(options){

		if(oui.browser.firefox && (!navigator.plugins['Shockwave Flash'])){
			oui.alert('您的火狐浏览器上没有安装flash播放插件,将会影响上传功能',function(){},'firefox flash未安装');
			return ;
		}
		var sessionId = oui_context.sessionId ||"";
		options =options || {};
		options.postParams= options.postParams || { sessionId:sessionId};
		//上传文件名的最大字符数限制(包含文件后缀名)
		/*
		if(!options.fileNameMaxLength){ //上传的文件名的最大字符数
			options.fileNameMaxLength=150;
		}else if(typeof options.fileNameMaxLength =='string'){
			options.fileNameMaxLength=parseInt(options.fileNameMaxLength);
		}*/

		initSwfUploadPlugin();
		if(typeof Dialog.upDialog !='undefined'  &&(Dialog.upDialog)){
			Dialog.updateUploadOptions(options);
			Dialog.upDialog.show();
			Dialog.upDialog.attr('swfUpload').loadFlash();

			return Dialog.upDialog;
		}
		/*
		 * 上传框模板
		 */
		var html= '<div id="content">'+
		'<form>'+
			'<div class="oui-dialog-upload-button">'+
				'<span id="spanButtonPlaceholder"></span>'+
			'</div>'+
		'</form>'+
		'<div class="oui-dialog-upload-area">'+
			'<div id="divFileProgressContainer"></div>'+
			'<div id="thumbnails">'+
				'<table id="infoTable" border="0"  >'+
				'</table>'+
			'</div>'+
		'</div>'+
		'</div>';
		/*
		 *
		 <input id="btnUpload" type="button" value="上  传"
						onclick="startUploadFile();" class="btn3_mouseout"
						/>
					<input id="btnCancel" type="button" value="取消所有上传"
						onclick="cancelUpload();" disabled="disabled" class="btn3_mouseout"
						/>
		 */
		var upDialog = oui.showHTMLDialog({
			title:options.title || "文件上传",
			content:html,
			actions:[{text:"上传",
				id:"upload-ok",

				cls:'oui-dialog-ok',
				action: function(){ //开始上传
					var swfUp = oui.$.ctrl.dialog.upDialog.attr('swfUpload');
					var errorFiles = oui.$.ctrl.dialog.upDialog.attr('errorFiles');
					if(errorFiles&&errorFiles.length>0){
						//oui.alert('文件名不能超过50个字符');

						return ;
					}
					var states = swfUp.getStats();
					if(typeof states !='undefined'){
						if(states.files_queued<=0){
							return ;
						}
						if(states.files_queued>1&& oui.$.ctrl.dialog.upDialog.attr("isSingle") ){
							alert('单文件上传只能上传一个文件');
							return ;
						}
					}
					oui.$.ctrl.dialog.upDialog.attr('uploading',true);
					oui.$.ctrl.dialog.upDialog.attr({canNotClose:true});
					oui.$.ctrl.dialog.upDialog.attr('successFiles',{});
					oui.$.ctrl.dialog.upDialog.attr('swfUpload').startUpload();
					oui.$.ctrl.dialog.upDialog.attr('errorFiles',[]);
				}
			},
			{ cls:'oui-dialog-cancel',
				text:"取消",
				id:"upload-cancel",
				action:function(){
					oui.$.ctrl.dialog.upDialog.attr('errorFiles',[]);
					if(oui.$.ctrl.dialog.upDialog.attr('uploading')){
						return;
					}

					var infoTable = document.getElementById("infoTable");

					var rows = infoTable.rows;

					var ids = new Array();
					var row;
					if(rows==null){
						return false;
					}
					for(var i=0;i<rows.length;i++){
						ids[i] = rows[i].id;
					}
					for(var i=0;i<ids.length;i++){

						deleteFile(ids[i]);
					}
					oui.$.ctrl.dialog.upDialog.hide();
					oui.$.ctrl.dialog.upDialog.attr({canNotClose:false});


				}
			}]
		});
		Dialog.upDialog = upDialog;
		Dialog.updateUploadOptions(options);

		var uploadUrl = oui.addOuiParams4Url(oui_context.contextPath+"file.do?method=doUpload&sessionId="+sessionId);
        var settings = {
			flash_url : oui_context.contextPath+"res_common/third/swfupload/swfupload.swf?sessionId="+sessionId,
			flash9_url : oui_context.contextPath+"res_common/third/swfupload/swfupload_fp9.swf?sessionId="+sessionId,
			//upload_url:  oui_context.contextPath+"FileUploadServlet.htm1",
			upload_url:  uploadUrl,
			post_params: options.postParams ,
			use_query_string:true,
			swfupload_preload_handler:function(){
				//alert(this.movieName);

			},
			// File Upload Settings
			file_size_limit : options.fileSizeLimit || "5 MB",	// 文件大小控制
			file_types : options.fileTypes || "*.*",
			file_types_description : "All Files",
			file_upload_limit : options.fileUploadLimit||"10",
			file_queue_error_handler : fileQueueError,
			file_dialog_complete_handler : fileDialogComplete,//选择好文件后提交
			file_queued_handler : fileQueued,
			upload_progress_handler : uploadProgress,
			upload_error_handler : uploadError,
			upload_success_handler : uploadSuccess,
			upload_complete_handler : uploadComplete,
			button_placeholder_id : "spanButtonPlaceholder",
			button_width: '110',
			button_height: 25,
			//button_image_url:oui_context.contextPath+'res_common/third/swfupload/images/brow-btn.png',
			button_text : '<span class="button">＋请选择文件 </span>',
			button_text_style : '.button {text-align:center; font-family: Helvetica, Arial, sans-serif; font-size: 14px; color:#ffffff;} ',
			button_text_top_padding: 7,
			button_text_left_padding: 0,
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_cursor: SWFUpload.CURSOR.HAND,
			//button_image_url: oui_context.contextPath+"res_common/third/swfupload/images/brower_65x29.png",
			button_action:options.isSingle?SWFUpload.BUTTON_ACTION.SELECT_FILE:SWFUpload.BUTTON_ACTION.SELECT_FILES, //单文件上传
			custom_settings : {
				upload_target : "divFileProgressContainer"
			},
			// Debug Settings
			debug: false  //是否显示调试窗口

		};
		var swfu = new SWFUpload(settings);
		upDialog.attr('swfUpload',swfu);

		return Dialog.upDialog;
	};

	/**
	 * html上传组件
	 */
	oui.upload4html = function(options){

		var sessionId = oui_context.sessionId ||"";
		options =options || {};
		options.postParams= options.postParams || { sessionId:sessionId};
		//上传文件名的最大字符数限制(包含文件后缀名)
		/*if(!options.fileNameMaxLength){ //上传的文件名的最大字符数
			options.fileNameMaxLength=150;
		}else if(typeof options.fileNameMaxLength =='string'){
			options.fileNameMaxLength=parseInt(options.fileNameMaxLength);
		}*/
		if(!options.fileSizeLimit){
			//options.fileSizeLimit = '5 MB'; //默认不设置文件大小限制
		}
		if(!options.fileTypes){
			options.fileTypes = "*.*";
		}
		if(!options.fileUploadLimit){
			try{
				options.fileUploadLimit = (oui.uploadConfig.defaultFileUploadLimit); //默认文件限制
			}catch(e){}
		}
		if(options.fileInterceptor){
			options.postParams.fileInterceptor=options.fileInterceptor ;
		}
		if(!oui.isEmptyObject(Dialog.upDialog)){
			Dialog.upDialog.attr(options);
			Dialog.upDialog.show();

			return Dialog.upDialog;
		}

		/*
		 *
		 <input id="btnUpload" type="button" value="上  传"
						onclick="startUploadFile();" class="btn3_mouseout"
						/>
					<input id="btnCancel" type="button" value="取消所有上传"
						onclick="cancelUpload();" disabled="disabled" class="btn3_mouseout"
						/>
		 */
		var upDialog = oui.showUrlDialog({
			contentStyle: (options.contentStyle || 'width:600px;max-height:410px'),
			url:oui.getContextPath()+'file.do?method=upload&_t='+(new Date().getTime()),
			title:options.title || "文件上传",
			actions:[{text:"上传",
				id:"upload-ok",
				cls:'oui-dialog-ok',
				action: function(){ //开始上传

					var iframe = $(oui.$.ctrl.dialog.upDialog.getEl()).find('iframe');
					var win = iframe[0].contentWindow;
					var upData = win.UploadData;  //上传对象
					//submitDatas
					var submitDatas = upData.submitDatas;

					var errorFiles = oui.$.ctrl.dialog.upDialog.attr('errorFiles');
					if(errorFiles&&errorFiles.length>0){
						//oui.alert('文件名不能超过50个字符');
						win.uploadError.call(win);
						return ;
					}
					if(submitDatas.length >1 && oui.$.ctrl.dialog.upDialog.attr("isSingle")){
						oui.alert('单文件上传，只能上传一个文件');
						return ;
					}
					var fileUploadLimit = parseInt(oui.$.ctrl.dialog.upDialog.attr("fileUploadLimit")||oui.uploadConfig.defaultFileUploadLimit);
					if(fileUploadLimit<0){
						fileUploadLimit =0;
					}
					if(submitDatas.length>fileUploadLimit){
						var fileUploadMaxLimit = oui.$.ctrl.dialog.upDialog.attr('fileUploadMaxLimit');

						oui.alert('上传文件不能超过'+fileUploadMaxLimit+'个,还能上传'+fileUploadLimit+'个');
						return ;
					}
					if(submitDatas.length==0){
						return ;

					}
					oui.getTop().oui.progress("上传中...");
					win.upload.call(win);


				}
			},
			{ cls:'oui-dialog-cancel',
				text:"取消",
				id:"upload-cancel",
				action:function(){
					var iframe = $(oui.$.ctrl.dialog.upDialog.getEl()).find('iframe');
					var win = iframe[0].contentWindow;
					oui.$.ctrl.dialog.upDialog.attr('errorFiles',[]);
					if(oui.$.ctrl.dialog.upDialog.attr('uploading')){
						return;
					}
					win.cancel.call(win);
					oui.$.ctrl.dialog.upDialog.hide();
					oui.$.ctrl.dialog.upDialog.attr({canNotClose:false});


				}
			}]
		});
		Dialog.upDialog = upDialog;
		Dialog.upDialog.attr(options);
	 	return Dialog.upDialog;
	};
	Dialog.zIndexDefault = 3000;
	Dialog.zIndex=Dialog.zIndexDefault;
	Dialog.dialogMaxZIndex=Dialog.zIndexDefault;
	/**
	 * open 框控件
	 * @param option Object 传入一个属性配置参数，数据格式如下:url :请求的地址,text:按钮显示的名称,action:为按钮绑定的事件,title：窗口显示的标题，URL也可以传入content，表示不请求url,直接显示页面
	 {url:"res_common/demo.jsp",title:"names",actions:[
			{
				text:"test确定",
				action: function(){
					alert("hhhhhh") ;obj.hide();
					}
			},
			{
				text:"test取消"

			}],
			success:function(){

			},
			error:function(){

			}
		}
	 * @returns {Object} 当前创建的对话框控件
	 */
	oui.open=function(option){
		console.info(option,'option');
		var params=option.params||"";
		var isHidden = option.isHidden || false;
		var progressBar=option.progressBar||"";
		var callback=progressBar.callback||function(){};
		if(!option){
			option = {};
		}
		if(!option.actions){
			option.actions =[];
		}
		var url=option? option["url"]:"";
		var obj,isNotTop=false;
		if(option&&option.isNotTop){
			isNotTop = option.isNotTop;
		}
		if(url && !isHidden){ //目前是iframe弹出框，不用 ajax弹出框
			option["showType"]=11;
			url = oui.addOuiParams4Url(url);
			if(url.indexOf('?')<0){
				url = url+('?ouiInDialog=true');
			}else if(url.indexOf('ouiInDialog=true')<0){
				url = url+('&ouiInDialog=true');
			}
			url=url+'&_t'+(new Date()).getTime();
			option.url = url;

		}else if(option.isImgDialog && !isHidden ){
			/** 弹框图片****/
			option["showType"]=13;
		}else{
			var content=option? option["content"]:"";
			option["showType"]=8;
		}
		if(isNotTop){
			oui.hideScrollBar();
			obj=Dialog.dialog(option);
			obj.showScrollBar = function(){
				oui.showScrollBar();
			}
		}else{
			

			
			oui.getTop().oui.hideScrollBar();
			obj = oui.getTop().oui.$.ctrl.dialog.dialog(option); 
			obj.showScrollBar = function(){
				try{
					//页面已经销毁的情况，匿名函数还存在，则异常的问题修复
					if(!oui){
						window.top.oui.showScrollBar();
					}else{
						oui.getTop().oui.showScrollBar();
					}
				}catch(e){

				}
			}
		}
		return  obj;
	};
	/**隐藏滚动条 ***/
	oui.hideScrollBar = function(container){
		container = container ||'body';
		$(container).addClass('oui-body-bar-hidden');
	};
	 /** 显示滚动条***/
	oui.showScrollBar= function(container){
		container = container ||'body';
		$(container).removeClass('oui-body-bar-hidden');
	};
	/**
	 * 弹出富文本框
	 */
	oui.showRichText = function(options){
		options =options || {};
		if(!oui.isEmptyObject(Dialog.richDialog)){
			Dialog.richDialog.attr(options);
			Dialog.richDialog.show();
			/**初始化iframe 的父窗体 ***/
			var iframe = $(Dialog.richDialog.getEl()).find('iframe');
			iframe[0].contentWindow.getParentWindow = function(){return window };
			return Dialog.richDialog;
		}

		var richDialog = oui.showUrlDialog({
			contentStyle: (options.contentStyle || 'width:588px;max-height:470px'),
			url:oui.getContextPath()+'res_common/oui/ui/ui_pc/dialog/richtext.html?_t='+(new Date().getTime()),
			title:options.title || '文本编辑',
			actions:[{text:"确定",
				id:"rich-ok",
				cls:'oui-dialog-ok',
				action: function(){ //开始上传

					var iframe = $(oui.$.ctrl.dialog.richDialog.getEl()).find('iframe');
					var win = iframe[0].contentWindow;
					win.getParentWindow = function(){return window };
					win.save.call(win);
					oui.$.ctrl.dialog.richDialog.hide('ok');
				}
			},
			{	text: "清除样式",
				id:"rich-clear",
				cls:'oui-dialog-ok',
				action: function(){ //开始上传
					var iframe = $(oui.$.ctrl.dialog.richDialog.getEl()).find('iframe');
					var win = iframe[0].contentWindow;
					win.getParentWindow = function(){return window };
					win.clearStyle.call(win);
				}
			},
			{ cls:'oui-dialog-cancel',
				text:"取消",
				id:"rich-cancel",
				action:function(){
					var iframe = $(oui.$.ctrl.dialog.richDialog.getEl()).find('iframe');
					var win = iframe[0].contentWindow;
					win.cancel.call(win);
					oui.$.ctrl.dialog.richDialog.hide('cancel');
				}
			}]
		});
		Dialog.richDialog = richDialog;
		Dialog.richDialog.attr(options);
		/**初始化iframe 的父窗体 ***/
		var iframe = $(oui.$.ctrl.dialog.richDialog.getEl()).find('iframe');
		iframe[0].contentWindow.getParentWindow = function(){return window };
		return Dialog.richDialog;
	};
	/**
	 * json对象比较方法
	 * @param options
	 * @returns {*|compareJsonDialog}
	 */
	oui.showCompareJsonDialog = function(options){
		options =options || {};
		if(typeof Dialog.compareJsonDialog !='undefined'  &&(Dialog.compareJsonDialog)){
			Dialog.compareJsonDialog.attr(options);
			Dialog.compareJsonDialog.show();
			return Dialog.compareJsonDialog;
		}

		var compareJsonDialog = oui.showUrlDialog({
			contentStyle: (options.contentStyle || 'width:100%px;max-height:100%'),
			url:oui.getContextPath()+'res_apps/test/treegrid/jsonCompare.html?_t='+(new Date().getTime()),
			title:options.title || 'json对象比对',
			theme:1,
			isHideFooter:true,
			actions:[{text:"确定",
				id:"rich-ok",
				cls:'oui-dialog-ok',
				action: function(){ //开始上传

					var iframe = $(oui.$.ctrl.dialog.compareJsonDialog.getEl()).find('iframe');
					var win = iframe[0].contentWindow;
					win.save.call(win);
					oui.$.ctrl.dialog.compareJsonDialog.hide();
				}
			},
				{ cls:'oui-dialog-cancel',
					text:"取消",
					id:"rich-cancel",
					action:function(){
						var iframe = $(oui.$.ctrl.dialog.compareJsonDialog.getEl()).find('iframe');
						var win = iframe[0].contentWindow;
						win.cancel.call(win);
						oui.$.ctrl.dialog.compareJsonDialog.hide();
					}
				}]
		});
		Dialog.compareJsonDialog = compareJsonDialog;
		Dialog.compareJsonDialog.attr(options);
		return Dialog.compareJsonDialog;
	};

	/***创建js资源加载器 ***/
	function createLoaderJs(win){
		win.oui_contextPath = win.parent.oui_contextPath;
		win.oui_context = null;
		(function(ctx){
			if(ctx){
				win.oui_context= {};
			}
			for(var i in ctx){
				win.oui_context[i] = ctx[i];
			}
		})(win.parent.oui_context);
		win.getContextPath =function() {
			if (win.oui_context && win.oui_context.contextPath) {
				return win.oui_context.contextPath;
			}
			var doc = win.document;
			var pathName = doc.location.pathname;
			var index = pathName.substr(1).indexOf("/");
			var result = pathName.substr(0, index + 1) + "/";
			if (!win.oui_context) {
				win.oui_context = {};

			}
			win.oui_context.contextPath = result;
			return result;
		};
		win.loadConfig ={loadedAll:false,newId:0};
		win.getNewTagId = function(){
			win.loadConfig.newId ++;
			return win.loadConfig.newId;
		}
		win.load4sort =function (arr,callback){
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
					win.loadArr([this.url],function(){
						callback();
					});

				}else{
					var me = this;
					win.loadArr([this.url],function(){
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
		};

		/**
		 * 加载js列表资源
		 */
		win.loadArr =function(arr,callback){
			var idPrefix = 'script_';
			var contextPath = win.getContextPath();

			for(var i=0,len=arr.length;i<len;i++){
				var currNewId = idPrefix+win.getNewTagId();
				win.loadConfig[currNewId] = {loaded:false};
				win.loadJs(currNewId,contextPath+arr[i],function(){
					var sid = this.getAttribute('id');
					win.loadConfig[sid].loaded = true;
					var flag = true;
					if(!callback){
						return ;
					}
					if(win.loadConfig.loadedAll){
						return ;
					}
					for(var k in win.loadConfig){
						if(k =='loadedAll' || k =='newId'){
							continue;
						}
						if(!win.loadConfig[k].loaded){
							flag  = false;
						}
					}
					if(flag){
						win.loadConfig.loadedAll = true;
						callback();
					}
				});
			}
		};
		/**
		 * 加载 js资源
		 */
		win.loadJs = function (sid,jsurl,callback){
			win.loadConfig.loadedAll = false; //没有加载完毕
			var doc = win.document;
			var nodeHead = doc.getElementsByTagName('head')[0];
			var nodeScript = null;
			if(doc.getElementById(sid) == null){
				nodeScript = doc.createElement('script');
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
					callback.call(doc.getElementById(sid));
				}
			}
		};
		win.bindReady=function(win,ouiId){
			win.$(win.document).ready(function(){
				var dialog= win.parent.oui.getByOuiId(ouiId);
				var onReady = dialog.attr("onReady");
				onReady&&onReady(win.document,win,win.parent);
			});
		}
	}
	/**根据静态页面url，自动引入公共脚本，并执行,动态可扩展脚本,pc端实现
	 *
	 *  url,actions,onReady,script,css,useCommon
	 * *****/
	oui.showUrlDialog4AutoScript=function(cfg){
		var headHtml = $('head').html();//开发规范中的公共资源
		cfg = cfg ||{};
		var dialog = oui.showUrlDialog(cfg);
		var iframe = $(dialog.getEl()).find('iframe')[0];
		var jquerySrc = 'res_common/third/jquery/jquery-2.1.4.min.js';
		var contextPath = oui.getContextPath();
		oui.bindIframeReady(iframe,function(contentDoc,contentWin,parentWin){
			var headHtml ='';
			var scriptSrcs=[];
			var scripts = cfg.script ||[];

			if(typeof scripts =='string'){
				scripts = scripts.split(',');
			}
			if(scripts.length){
				scriptSrcs=['res_common/third/laydate/laydate.dev.js','res_common/oui_pc.min.js'];
			}
			var ouiId =dialog.attr('ouiId');
			createLoaderJs(contentWin);
			if(scriptSrcs.length){
				contentWin.loadArr([jquerySrc],function(){
					contentWin.load4sort(scriptSrcs,function(){
						if(scripts.length){
							contentWin.load4sort(scripts,function(){
								//end
								contentWin.bindReady(contentWin,ouiId);
							});
						}else{
							//end
							contentWin.bindReady(contentWin,ouiId);
						}
					});
				});
			}else{
				contentWin.bindReady(contentWin,ouiId);
			}
		});
		return dialog;
	};
	/**
	 * {imgUrl,}
	 * @param param
	 */
	oui.showImgDialog = function(cfg){
		if(cfg){
			if(typeof cfg.isNotTop =='undefined'){
				cfg.isNotTop = true;
			}
		}
		cfg.isImgDialog = true;
		var obj = oui.open(cfg);
		return obj;
	};
	//由于现有项目已经在用uplaod4flash的api 所以通过覆盖方式保持api不变
	oui.upload4flash = oui.upload4html; //将flash上传 改为html5上传


	/***
	 *
	 *  oui.showCodeDialog({
        params:['a','b'],//函数 参数变量名
        startCode:'var str="123";//第一行固定\nstr+="hh1";\nstr+="hh2";',//开始代码
        endCode:'return str;//最后一行固定',//结尾代码
        returnType:'string'//返回值类型
    },function(jsonResult){//回调 返回修改后的codeJson对象
        //test 测试函数调用
        var fun= oui.parseJson2Function(jsonResult);
        var result = fun('hello','hehe');
        console.log(jsonResult);
        console.log(result);
    },{
        contentStyle:''//dialog样式相关
    });
	 *
	 * @param json{params,startCode,bodyCode,endCode,returnType},json格式对象,params为数组,变量名列表
	 * @param callback:function(json){}//回调返回json格式与 输入json格式相同
	 * @param options dialog样式相关属性 {contentStyle}
	 */
	oui.showCodeDialog = function(json,callback,styleCfg){
		/** 如果传入参数为字符串，字符串的函数模板,转换为包含内容的参数数组****/
		json = oui.parseJson(json);
		var params = [];
		params = params.concat(json.params||[]) ;
		var startTag = 'function('+params.join(',')+'){';
		var endTag = '}';
		var startCode =json.startCode ||'';
		var bodyCode = json.bodyCode ||'';
		var endCode =json.endCode ||'';
		var startCodeRows = startCode.split('\n').length ||1;
		var endCodeRows = endCode.split('\n').length||1;
		var returnType = json.returnType ||'string';
		var keys = ['startTag','startCode','bodyCode','endCode','endTag'];
		if(!styleCfg){
			styleCfg = {};
		}
		if(!styleCfg.contentStyle){
			styleCfg.contentStyle = 'width:800px;';
		}
		var bodyCodeRows = styleCfg.bodyCodeRows||15;

		oui.getTop().oui.showInputDialog(styleCfg&&styleCfg.title||'脚本编辑', function(result){
			var jsonResult = {
				params:params,
				startCode:startCode,
				bodyCode:bodyCode,
				endCode : endCode,
				returnType:returnType
			};
			for(var i= 0,len=result.length;i<len;i++){
				if(keys[i] =='bodyCode'){
					jsonResult[keys[i]] = result[i];
					break;
				}
			}
			if(callback){
				var flag = callback(jsonResult); //执行回调
				if((typeof flag =='boolean') && (!flag)){
					return false;
				}
			}
		}, [{
			type:"textfield",value:startTag,readOnly:true,inputAreaStyle:'margin-bottom:0;margin-top:-10px',placeholder:" ",style:'padding:0;min-height: 20px;line-height: 20px;'
		},{
			type:"textarea",value:startCode,readOnly:true,style:startCode?'padding: 0 15px;':'display:none',placeholder:" ",rows:startCodeRows,style:'height:auto;',inputAreaStyle:'margin-bottom:0'
		},{
			type:"textarea",value:bodyCode,readOnly:false,rows:bodyCodeRows-startCodeRows-endCodeRows ,placeholder:" ",style:'line-height:20px;height:auto;',inputAreaStyle:'margin-bottom:0;padding: 0 10px;'//内容行数
		},{
			type:"textarea",value:endCode,readOnly:true,style:endCode?'padding: 0 15px;':'display:none',placeholder:" ",rows:endCodeRows,style:'height:auto;',inputAreaStyle:'margin-bottom:0'
		},{
			type:"textfield",value:endTag,readOnly:true,inputAreaStyle:'margin-bottom:-10px',placeholder:" ",style:'height: 20px; min-height: auto; padding:0;line-height: normal;'
		}], styleCfg);

	};
	/*****
	 *
	 * @param params 数组[],除了数组最后一项为函数内容外，前面的参数为变量定义列表
	 * @param callback:function(params,funcString){} 返回 第一个参数数组 [] 除了数组最后一项为函数内容外，前面的参数为变量定义列表；第二个参数方法整体字符串
	 * @param options 样式相关，dialog弹框样式
	 */
	oui.showCodeDialogByParams = function(params,callback,options){

		/** 如果传入参数为字符串，字符串的函数模板,转换为包含内容的参数数组****/
		if(typeof params =='string'){
			try{
				params = oui.parseString2FunctionParams(params);
			}catch(err){
				params = [];
			}
		}
		var fun = Function.apply(null,params);
		var paramStr = fun.toString().replace('anonymous',''); //初始化的 参数代码
		oui.showInputDialog(options&&options.title||'脚本编辑', function(result){
			var resultParams =[] ;
			if(result){
				resultParams = oui.parseString2FunctionParams(result);
			}
			if(callback){
				var resultFun = Function.apply(null,resultParams);
				var resultStr = resultFun.toString().replace('anonymous',''); //初始化的 参数代码
				var flag = callback(resultParams,resultStr,result); //执行回调
				if((typeof flag =='boolean') && (!flag)){
					return false;
				}
			}
		}, [{type:"textarea",value:paramStr}], options);

	};
	/***
	 *
	 // 左右选项选择框,支持多页签
	 oui.showOptionsDialog({
	  isShowSearch:true,//是否显示搜索框
	  onlyShowCurrTabSelected:true,//在已选列表中是否只显示当前页签的选项
	  tabs:[{id:'1',name:'页签1'},{id:'2',name:'页签2'}],//自定义页签
	  value:'hello,hello2',//回填已经选择的值，以逗号隔开
	  data:[{value:'hello',display:'Hello1',tabId:'1'},{value:'hello2',display:'Hell2',tabId:'2'}],//待选项数据格式
	  confirm:function(value,selects,obj){console.log(value)}
	  });//确定回调

	  //无页签使用 左右选择框
	  oui.showOptionsDialog({
	  isShowSearch:true,
	  value:'hello,hello2',
	  data:[{value:'hello',display:'Hello1'},{value:'hello2',display:'Hell2'}],
	  confirm:function(value,selects,obj){console.log(value)}
	  });

	 //显示 树结构
	 oui.showOptionsDialog({notClone4Component:true, tabs:[{tabId:1,name:'ho',renderType:'tree',treeCfg:{nodes:[{value:1,id:1,pid:null,name:'hello',tabId:1,display:'hello'}] } }]});

	 //多页签 树 和单项列表展现
	 oui.showOptionsDialog({notClone4Component:true,isShowSearch:true, tabs:[{tabId:1,name:'ho',renderType:'tree',treeCfg:{view:{addDiyDom:function(treeId,treeNode){console.log(treeId);}}, nodes:[{value:1,id:1,pid:null,name:'hello',open: true,tabId:1,display:'hello' },{value:2,id:2,pid:1,open: true,name:'hello2',tabId:1,display:'hello2' },{value:3,id:3,pid:2,open: true,name:'hello3',tabId:1,display:'hello3' }] } },{name:'岗位',id:2,data:[{tabId:2,value:3333,display:'hello'}] }],confirm:function(v,s,o){console.log(v);console.log(s),console.log(o)}});

	 /*
	  *oui.showOptionsDialog({
                    notClone4Component:true,

                    tabs:[
                        {
                            tabId:1,name:'ho',
                            renderType:'tree',
                            idKey:'id',
                            parentIdKey:'pid',

                            treeCfg:{
                                nodes:[

                                    {value:1,id:1,pid:null,name:'hello',tabId:1,display:'hello'},
                                    {value:2,id:2,pid:null,name:'hello2',tabId:1,display:'hello2'
                                    },
                                    {value:3,id:3,pid:2,name:'hello3',tabId:1,display:'hello3'}

                                ]
                            }
                        }
                    ],
                    confirm:function(value,selects,obj){
                        console.log(value,selects);
                    }
                });
	  */
	/*
	 *
	 * @param options
	 */
	oui.showOptionsDialog = function(options){
		oui.getTop().oui.require([oui.getContextPath()+'res_common/oui/ui/ui_pc/controls/select-item/select-item.js'],function(){
			oui.getTop().oui.showItemsSelectDialog(options);
		});
	};
	/**
	 * {
     *      downloadUrl, //下载excel的路径
     *      completeSuccess:function(results){},//返回文件
     *
     *      validateUrl, //校验excel的路径 xxx.do?xxx&fileId=yyyy,失败返回{downloadUrl:'xxx'},成功返回{resultUrl:'xxx'} ==>查看消息返回 {msg:'xxx'}
     *  }
	 * @param options
	 */
	oui.showImportExcelDialog = function(options){
		oui.getTop().oui.require([oui.getContextPath()+'res_common/oui/ui/ui_pc/css/import-excel.css']);
		oui.getTop().oui.require([oui.getContextPath()+'res_common/oui/ui/ui_pc/dialog/import-excel.js'],function(){
			oui.getTop().oui.showImportExcelDialog4Require(options);
		});
	};

	oui.showImportFileDialog = function(options){
		oui.getTop().oui.require([oui.getContextPath()+'res_common/oui/ui/ui_pc/css/import-excel.css']);
		oui.getTop().oui.require([oui.getContextPath()+'res_common/oui/ui/ui_pc/dialog/import-file.js'],function(){
			oui.getTop().oui.showImportFileDialog4Require(options);
		});
	};
    oui.showCalcDialog = function (options) {
        oui.getTop().oui.require([oui.getContextPath()+'res_common/oui/ui/ui_pc/dialog/calc-dialog-main.js'],function(){
            oui.getTop().oui.showCalcDialog4Require(options);
        });
    }
})(window);





