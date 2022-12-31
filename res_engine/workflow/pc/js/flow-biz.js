/**
 * FlowBiz 创建
 */
(function (FlowUi) {
	
    var FlowBiz = {
        "package": "oui.flow",
        "class": "FlowBiz",
		/*
		 *获取FlowUi方法
		 */
		getFlowUi:function(){ //重写父类方法 用于获取 FlowUi类对象
			return FlowUi;
		},
		getFlowBiz:function(){//重写父类方法 用于获取FlowBiz类对象
			return FlowBiz;
		}, 
		getSuper:function(){ //父类
			return oui.flow.FlowCommon;
		},
		initStart:function(param){ //初始化开始接口实现
			var _self = this;
			try{
				var isTest = window.parent.oui.getParam('isTest');
				_self.isTest = isTest;
			}catch(e){

			}
			//FlowUi.config.basePath = oui.getContextPath()+'res_engine/workflow/';
			//_self.setInterceptFuns(_self.eventBefore2hideTipsOrActionSheetFunNames,function(cfg){
			//	//_self.hideTips(cfg);//所有这些事件操作执行tips隐藏
			//}); //设置 Before拦截
			_self.getSuper().initStart.call(_self,param); //父类的方法在子类执行
			
		},
		
		initEnd:function(){ //初始化结束接口实现
			var _self = this;
			_self.getSuper().initEnd.call(this); //初始化结束父类调用
			oui.Guide.trigger4custom("#ouiflow");
		},
		//init 在父类oui.flow.FlowCommon中已经实现 ,分别调用了 initStart 和initEnd以及初始化流程逻辑		
		//绑定事件接口实现
		bindEvents:function(){
			var _self = this;
			$('#ouiflow').draggable({
				//containment:'.flow-drag-area',
				//scroll:true,
				//containment: [50,50,'100%','100%'],
				start: function(event,ui) {
				},
				stop:function(event,ui){
					$(this).find("p").html(":-|");
				}
			});
			$(document).on('mousedown',function(e){
				_self.hideTips({e:e});
			})
			_self.bindBeforeUnload();
		},
		bindBeforeUnload: function () {
			var _self = this;
			if(_self.isIndex){//浏览态无需处理该逻辑
				return ;
			}
			window.onbeforeunload = function (e) {

				if (_self.hasSaveData()) {
					return;
				}
				if(!oui_context){ //没有上下文配置对象
					return ;
				}
				/**
				 * 没有userId表示没有登录 则不验证
				 */
				if(oui_context && (!oui_context.userId)){
					return ;
				}
				return (e || window.event).returnValue = '有信息未保存';
			}
		},
		/**
		 * 放大 覆盖父类方法
		 */
		event2ZoomBig:function(cfg){ //放大
			var _self = this;
			_self.zoomPx+=10;
			_self.zoomScale= (_self.mc_width+_self.zoomPx)/_self.mc_width;
			$(document.body).css('zoom',_self.zoomScale);
		},
		/**
		 * 缩小 覆盖父类方法
		 */
		event2ZoomSmall:function(cfg){ //缩小
			var _self = this; 
			_self.zoomPx-=10;
			_self.zoomScale= (_self.mc_width+_self.zoomPx)/_self.mc_width;
			if( _self.zoomScale<0.5){
				_self.zoomPx +=10; 
				_self.zoomScale= (_self.mc_width+_self.zoomPx)/_self.mc_width;
			}
			$(document.body).css('zoom',_self.zoomScale);
		},
		/**
		 * pc端 右键菜单功能 
		 */
		event2contextMenu:function(cfg){
			var _self = this;
			var tipCfg = _self.putContextMenu4event(cfg);
			var nodeIdMap =_self.nodeIdMap;
			var nodeId =tipCfg.nodeId;
			var FlowUi = _self.getFlowUi(); 
			var x,y;
			//var width = parseFloat($(tipCfg.el).attr('width'));
			//var height = parseFloat($(tipCfg.el).attr('height'));
			var workflowTreeNode = _self.workflowTreeNode;
			var rectNode = workflowTreeNode.states[nodeId];
			
			var attr = nodeIdMap[nodeId].attr;
			if(nodeIdMap[nodeId].isEnd){
				return ;
			}
			//var html = FlowUi.render('flow-ui-contextMenus',true);
			//$(tipCfg.el).after(html);
			_self.operNode4design = _self.contextMenus;
			$("#flow-ui-contextMenus")[0].innerHTML = tipCfg.content;
			x = attr.x;
			y = attr.y;
			var svgPos = $('#ouiflow').position();
			var left = x +svgPos.left - $("#flow-ui-contextMenus").width()/2;
			var top = y +svgPos.top ;
			/**线条 并且是允许态则 执行线条的位置定位 **/
			if(tipCfg.isLine && (_self.isIndex || _self.isPreview)){
				var e = cfg.e;
				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				left = e.pageX || e.clientX + scrollX;
				top = e.pageY || e.clientY + scrollY;
				top+=8;
				left -=$("#flow-ui-contextMenus").width()/2;
			}else{
				/****线条和节点 在设计态都根据节点位置定位 ***/
				if( nodeIdMap[nodeId].isJoin){
					//top+=10;
					left-=8;
					top-=$("#flow-ui-contextMenus").height()/2;
					top+=7;
				}else{
					left = left+20;
					top = top-8;
				}
				left+=12;
				if(_self.isIndex){ //运行态流程 位置处理
					left+= $("#flow-ui-contextMenus").width()/2;
					left+=30;
					top+=40;
				}
			}

			$("#flow-ui-contextMenus").css({
				'position':'absolute',
				display:'',
				'left':left, 
				'top':top
			});

		},
		/**
		 * pc端 右键菜单功能 
		 */
		event2contextMenu_TEST:function(cfg){
			var _self = this;
			var tipCfg = _self.putContextMenu4event(cfg);
			var obj= oui.showTips({
				el:tipCfg.el, 
				content:tipCfg.content
			});
			
			var $tipEl = $(obj.getEl());
			 
			var nodeIdMap = oui.flow.FlowBiz.nodeIdMap;
			var nodeId = $(tipCfg.el).attr('nodeId');
			console.log($(tipCfg.el).attr('x'));
			console.log($(tipCfg.el).attr('y'));
			console.log($(tipCfg.el).attr('width'));
			console.log($(tipCfg.el).attr('height'));
			var x = parseFloat($(tipCfg.el).attr('x'));
			var y = parseFloat($(tipCfg.el).attr('y'));
			//var width = parseFloat($(tipCfg.el).attr('width'));
			//var height = parseFloat($(tipCfg.el).attr('height'));
			var workflowTreeNode = _self.workflowTreeNode;
			var rectNode = workflowTreeNode.states[nodeId];
			
			var attr = _self.nodeIdMap[nodeId].attr;
			
			x = attr.x;
			y = attr.y; 
			var left,top;
			
			if(oui.browser.ie){
				var offset = $('rect[nodeid='+nodeId+']').offset();
				//var offset = $(cfg.e.target).offset();
				left = cfg.e.pageX-$tipEl.width()/2;
				top = cfg.e.pageY+10 ;
				
				
			}else{
				left = x+_self.nodeWidth-_self.y_distance+$("svg").offset().left;
				top = y+_self.nodeHeight ; 
				top = top+$("#ouiflow").scrollTop()+_self.nodeHeight/2;
				top=top+55;
				
				 
				if(_self.nodeIdMap[nodeId].isJoin){
					left-=_self.nodeWidth/2
					left+=attr.width/2;
					top-=20;
				}
			}
				
			$tipEl.css({top:top+"px",left:left+"px"});
			//$tipEl.css('zoom',_self.zoomScale);
			//left:left+"px",
		}
	};
	
	//类继承实现 
	FlowBiz = $.extend(true,{},FlowBiz.getSuper(),FlowBiz);
	FlowBiz = oui.createClass(FlowBiz);
	FlowBiz.getPosByEl=function(oElement) {//oElement 当前元素
        if (typeof (oElement.offsetParent) != 'undefined') {
			for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
				posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
        }
		return {x:posX, y:posY};
    };
	/**
	 *  pc端隐藏 流程节点 操作tips
	 * @param cfg
	 */
	FlowBiz.hideContextMenu = function(cfg){
		var $menu =  $("#flow-ui-contextMenus") ;
		if($menu.length<=0){
			return ;
		}
		$menu.hide();
	};
	//pc特有
	FlowBiz.hideTips = function(cfg){ //该方法目前在元素中通过oui-e- 配置函数名使用
		var e =cfg.e;

	 	var $menu =  $("#flow-ui-contextMenus") ;
		if($menu.length<=0){
			return ;
		}
		if(oui.isInDom(e.target,$menu[0])){
			return ;
		}
		$menu.hide();
		//var tips = oui.getTips();
		//if(!tips){
		//	return ;
		//}
		//if(tips.attr('hidden')){
		//	return ;
		//}
		//if(oui.isInDom(e.target,tips.getEl())){ //判断目标元素是否在tips容器里面
		//	return ;
		//}
		//oui.hideTips();
	};
})(oui.flow.FlowUi);








