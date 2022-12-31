(function(win){
	/*******************************依赖的Js类 start***********************************************************/
	var ctrl = oui.$.ctrl;
	var Control = ctrl.basecontrol;
	/*******************************依赖的Js类 end************************************************************/
	/**
	 * 控件类构造器
	 */
	var Tree = function(cfg) {
		/***************************一 控件必须实现:控件继承call ****/
		Control.call(this,cfg);//必须继承控件超类
		/***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
		this.attrs = this.attrs+",beforeClick,rule,showcheckbox,canDrag";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
		/**
		 * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
		 * 该函数，需要实现继承父类初始化的功能
		 */
		/**
		 *树的数据配置格式
		 *var a=[
		 {
             text:'smith',
             icon:'',
             id:'1',
             pid:'0'
         },
		 {
             text:'kong',
             icon:'',
             id:'2',
             pid:'1'
         },
		 {
             text:'dong',
             icon:'',
             id:'3',
             pid:'2'
         },
		 {
             text:'dong',
             icon:'',
             id:'4',
             pid:'1'
         }
		 ];

		 var o=[
		 {
             text:'1',
             icon:'',
             childen:[
             {
                 text:'2',
                 icon:'',
                 childen:[
                     {
                     text:'3',
                     icon:'',
                 }
                 ]
             }

             ]
         }
		 ];
		 *
		 */

		this.folderClick=folderClick;
		this.arrowClick=arrowClick;
		this.fileClick=fileClick;
		this.folderItem=folderItem;
		this.fileItem=fileItem;
		this.afterRender = afterRender;
		this.getNodeById = getNodeById;
		this.init = function(){
			var canDrag = this.attr('canDrag');
			if(canDrag && canDrag =='true'){
				this.attr('canDrag',true);
			}else{
				this.attr('canDrag',false);
			}
			var showcheckbox = this.attr('showcheckbox');
			if(showcheckbox&& showcheckbox=='true'){
				this.attr("showcheckbox",true);
			}else{
				this.attr("showcheckbox",false);
			}
			var d = this.attr("data");
			if(d){
				this.attr("data",oui.parseJson(d));
			}else{
				oui.log("tree 需要配置data属性");
				throw e;
			}
			var showType=this.attr("showType");
			if(showType==1||showType=="1"){
				var rule={};//用户传进来的rule需要转化成为对象，现在仍然是字符串 模拟数据
				var ru=this.attr("rule");
				if(ru||ru==""){
					rule['text']="text";
					rule['icon']="icon";
					rule['id']="id";
					rule['pid']="pid";
				}else{
					rule=oui.parseJson(ru);
				}
				this.attr("rule",rule);
				var arr=[];
				d=this.attr("data");
				for(var i=0,len=d.length;i<len;i++){
					if(d[i][rule.pid]=="0"||!(d[i][rule.pid])){
						arr.push(d[i]);
					}
				}
				this.attr("arrData",arr);
			}
			this.attr('eachRender',Tree.eachRender);
			this.attr("eachRenderOne",Tree.eachRenderOne);
			this.attr('console',console);
			this.attr("getChildrenByPid",Tree.getChildrenByPid);
			this.attr("hasChildren",Tree.hasChildren);
			this.attr("isCheckbox",true);
		};
		/***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
	};
	ctrl["tree"] = Tree;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

	/*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
	Tree.FullName = "oui.$.ctrl.tree";//设置当前类全名 静态变量
	/**
	 * 定义 html模板,
	 * 控件类必须要定义控件模板 属于当前作用域全局变量
	 */
	Tree.templateHtml=[];
	Tree.templateHtml[0] = '<ol class="oui-tree  {{if isCheckbox}}oui-tree-checkbox-show{{/if}}">' +
		'{{each data as item index}}'+
		'<li class="{{ (typeof item.children=="undefined"  || (item.children&&item.children.length&&item.children.length==0))?"oui-tree-file-null":""}}">'+

		'{{if (typeof item.children=="undefined"  || (item.children&&item.children.length&&item.children.length==0))}}'+
		'<a href="javascript:void(0)" class="oui-tree-icon-blank"></a>'+
		'<span class="oui-tree-nodeshow oui-tree-nodeshow-file" >'+
		'<span class="oui-tree-file"></span>'+
		'{{if showcheckbox}}'+
		'<input onchange="oui.getByOuiId({{ouiId}}).fileItem(this)" data-id="{{item[rule.id]}}" type="checkbox" class="oui-tree-checkbox">'+
		'{{/if}}'+
		'<span class="oui-tree-nodetext" data-id="{{item[rule.id]}}"  onclick="oui.getByOuiId({{ouiId}}).fileClick(\'{{item.id}}\')">{{item.text}}</span>'+
		'</span>'+
		'{{/if}}'+
		/**************文件夹的遍历代码***********/
		'{{if item.children && item.children.length>0}}'+
		'<a href="javascript:void(0)" onclick="oui.getByOuiId({{ouiId}}).arrowClick(this)" class="oui-tree-icon-unfold"></a>'+
		'<span class="oui-tree-nodeshow oui-tree-nodeshow-folder" onclick="oui.getByOuiId({{ouiId}}).folderClick(this)">'+
		'<span class="oui-tree-folder"></span>'+
		'{{if showcheckbox}}'+
		'<input class="oui-tree-checkbox"  data-id="{{item[rule.id]}}" type="checkbox" onchange="oui.getByOuiId({{ouiId}}).folderItem(this)"  id="n-{{ouiId}}{{(typeof idx=="undefined")?"":"-"+idx }}-{{index}}" {{if item.expand=="true"||item.expand==true}}checked="checked" {{/if}}/>' +
		'{{/if}}'+
		'<span class="oui-tree-nodetext" data-id="{{item[rule.id]}}" for="n-{{ouiId}}{{(typeof idx=="undefined")?"":"-"+idx }}-{{index}}">{{item.text}}</span>' +
		'</span>'+
		'{{=eachRender({data:item.children,eachRender:eachRender,console:console,ouiId:ouiId,idx: ((typeof idx=="undefined")?"":""+idx+"-")+""+index })}}'+

		'{{/if}}'+

		'</li>' +
		'{{/each}}'+
		' </ol>' ;
	Tree.templateHtml[1] ='<ol class="oui-tree  {{if isCheckbox}}oui-tree-checkbox-show{{/if}}">' +
		'{{each arrData as item index}}'+

		'{{if hasChildren(item[rule.id],ouiId,allData?allData:data)}}'+
		'<li  >'+
		'<a href="javascript:void(0)" onclick="oui.getByOuiId({{ouiId}}).arrowClick(this)" class="oui-tree-icon-unfold"></a>'+
		'<span class="oui-tree-nodeshow oui-tree-nodeshow-folder" onclick="oui.getByOuiId({{ouiId}}).folderClick(this)">'+
		'<span class="oui-tree-folder"></span>'+
		'{{if showcheckbox}}'+
		'<input onchange="oui.getByOuiId({{ouiId}}).folderItem(this)" data-id="{{item[rule.id]}}" type="checkbox" class="oui-tree-checkbox"  id="n-{{ouiId}}{{(typeof idx=="undefined")?"":"-"+idx }}-{{index}}" {{if item[rule.expand]=="true"||item[rule.expand]==true}}checked="checked" {{/if}}/>' +
		'{{/if}}'+
		'<span class="oui-tree-nodetext" data-id="{{item[rule.id]}}" for="n-{{ouiId}}{{(typeof idx=="undefined")?"":"-"+idx }}-{{index}}">{{item[rule.text]}}</span>' +
		'</span>'+
		'{{=eachRenderOne({arrData:getChildrenByPid(item[rule.id],ouiId,allData?allData:data),allData:allData?allData:data,hasChildren:hasChildren,rule:rule,getChildrenByPid:getChildrenByPid,eachRenderOne:eachRenderOne,console:console,ouiId:ouiId,idx: ((typeof idx=="undefined")?"":""+idx+"-")+""+index }) }}'+
		'</li>' +
		'{{/if}}'+


		'{{if !hasChildren(item[rule.id],ouiId,allData?allData:data)}}'+
		'<li>'+
		'<a href="javascript:void(0);" class="oui-tree-icon-blank"  ></a>'+
		'<span class="oui-tree-nodeshow oui-tree-nodeshow-file" >'+
		'<span class="oui-tree-file"></span>'+
		'{{if showcheckbox}}'+
		'<input type="checkbox" data-id="{{item[rule.id]}}" onchange="oui.getByOuiId({{ouiId}}).fileItem(this)" class="oui-tree-checkbox">'+
		'{{/if}}'+
		'<span class="oui-tree-nodetext" data-id="{{item[rule.id]}}" onclick="oui.getByOuiId({{ouiId}}).fileClick(\'{{item.id}}\')">{{item[rule.text]}}</span>'+
		'</span>'+
		'</li>' +
		'{{/if}}'+
		'{{/each}}'+
		' </ol>' ;
	Tree.eachRender = template.compile(Tree.templateHtml[0]);
	Tree.eachRenderOne = template.compile(Tree.templateHtml[1]);

	Tree.hasChildren=function(id,ouiId,data){

		var obj=oui.getByOuiId(ouiId);
		var rule=obj.attr("rule");
		for(var i=0,len=data.length;i<len;i++){
			if(data[i][rule.pid] ==id){
				return true;
			}
		}
		return false;
	};

	Tree.getChildrenByPid=function(id,ouiId,data){
		var obj=oui.getByOuiId(ouiId);
		var rule=obj.attr("rule");
		var data=data;

		var arr=[];
		for(var i=0,len=data.length;i<len;i++){
			if(data[i][rule.pid] ==id){
				arr.push(data[i]);
			}
		}
		return arr;

	};
	var arrowClick=function(el){
		$(el).hasClass("oui-tree-icon-unfold")?$(el).removeClass("oui-tree-icon-unfold").addClass("oui-tree-icon-fold"):$(el).removeClass("oui-tree-icon-fold").addClass("oui-tree-icon-unfold");
	};
	var folderClick=function(el){
		var ele=this.getEl();
		$(ele).find(".oui-tree-nodeshow-selected").removeClass("oui-tree-nodeshow-selected");
		$(el).hasClass("oui-tree-nodeshow-selected")?"":$(el).addClass("oui-tree-nodeshow-selected");
	};
	var folderItem=function(element){

		if($(element).is(":checked")){
			var parent=$(element).parent();
			$(parent).next().find("input").prop("checked",true);

		}else{
			var parent=$(element).parent();
			$(parent).next().find("input").prop("checked",false);
		}
		var sdata=[];
		var idx=$(element).data("id");
		var data=this.attr("data");

		var st=this.attr("showType");

		if(st==1){
			//var sdata=Tree.getChildrenByPid(idx,this.attr("ouiId"),this.attr("data"));
			//var arr=this.getAllChildrenNode(idx,data);
			//	console.log(arr);
		}


	};


	var fileItem=function(element){


	};
	/**
	 *模板1文件绑定点击事件
	 */
	var fileClick=function(id){

		var showType=this.attr("showType");
		var beforeClick=this.attr("beforeClick");
		var tree=this;
		var data=this.attr("data");
		var node="";
		var rule=this.attr("rule");
		if(showType=="1"){
			for(var i=0,len=data.length;i<len;i++){
				if(id==data[i][rule.id]){
					node=data[i];
				}
			}
			if(beforeClick){
				eval(beforeClick+('(node,tree);'));
			}
			return;
		}
		for(var i=0,len=data.length;i<len;i++){
			if(id==data[i].id){
				node=data[i];
			}
		}
		if(beforeClick){
			eval(beforeClick+('(node,tree);'));
		}
	};

	/***
	 * 渲染后置脚本
	 * 绑定拖拽事件等
	 */
	var afterRender =function(){
		var canDrag= this.attr('canDrag');
		if(!canDrag){
			return ;
		}
	}
	/******
	 * 根据id获取节点
	 * @param id
	 * @returns {*}
	 */
	var getNodeById = function(id){
		var data = this.attr('data');
		data = oui.parseJson(data ||'[]');
		for(var i= 0,len=data.length;i<len;i++){
			if(id == data[i].id){
				return data[i];
			}
		}
		return null;
	}

	/*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/



	/*******************************控件类的自定义函数 start******************************************/
	/**
	 * 模拟控件类设计全局函数 plusClick
	 */

	/*******************************控件类的自定义函数 end******************************************/
})(window);












