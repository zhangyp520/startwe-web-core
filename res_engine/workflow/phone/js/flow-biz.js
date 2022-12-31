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
			_self.ValidateConfig.failMode = 'tips'; //移动端提示模式
			//移动端需要截取 includeFormTop部分到页面显示页签
			var formWorkFlowUrl= oui.getPageParam('formWorkFlowUrl');
			//移动端设计态才显示顶部页签
			if(_self.isEdit){
				_self.design4Runtime = oui.getParam('design4Runtime') == 'true'?true:false;
				if(!_self.design4Runtime){
					var html = oui.loadUrl(formWorkFlowUrl,oui.SubContentType.subBody,false,'<workflow-top','</workflow-top>');
					$(document.body).append(html);
				}
			}
			_self.getSuper().initStart.call(_self,param); //父类的方法在子类执行
			_self.setInterceptFuns(_self.eventBefore2hideTipsOrActionSheetFunNames,function(cfg){
				//oui.hideTips();//所有这些事件操作执行tips隐藏
				if(_self.actionSheet && (!$.isEmptyObject(_self.actionSheet))){//隐藏actionSheet
					_self.actionSheet.close();
				}
			}); //设置 Before拦截
			_self.setInterceptFuns(_self.eventBefore2validateFunNames,function(cfg){ //校验拦截初始化
				_self.updateWorkFlowProps(); //更新流程属性后 再校验 保证正确性
				var isCheck =  _self.validate();
				if(!isCheck){
					return false;
				}
				if(_self.actionSheet && (!$.isEmptyObject(_self.actionSheet))){//隐藏actionSheet
					_self.actionSheet.close();
				}
			});


		},
		/**
		 * 编辑节点属性
		 * @param cfg
		 */
		event2editProp:function(cfg){
			var _self = this;
			var FlowUi = _self.getFlowUi();
			var nodeId = $(cfg.el).attr('nodeId');
			var treeNode = _self.nodeIdMap[nodeId];
			_self.nodeProps = {
				node:treeNode
			};
			_self.updateNotifyFunBind();
			var html = FlowUi.render('flow-tpl-nodeProps',true);
			var actions =   [_self.nodePropDialogActions[1],_self.nodePropDialogActions[0]];//移动端 按钮顺序相反
			_self.editPropDialog = oui.getTop().oui.showHTMLDialog({
				title:"节点属性",
				content:html,
				center:false,
				nodeId:treeNode.id,
				actions:actions
			});
			oui.getTop().oui.parse();
			_self.updateNodePropOuiIds();
			return false;
		},
		event2cancelEditProp:function(){
			var _self = this;
			_self.actionSheet.hide();
			if(_self.design4Runtime){
				var dialog = oui.getCurrUrlDialog();
				dialog&&dialog.showFooter();
			}
			return false;
		},
		initEnd:function(){ //初始化结束接口实现
			var _self = this;
			_self.getSuper().initEnd.call(this); //初始化结束父类调用
			//console.log('time load process:'+(new Date()-test4Date));
			//alert('time load process:'+(new Date()-test4Date));
		},
		//init 在父类oui.flow.FlowCommon中已经实现 ,分别调用了 initStart 和initEnd以及初始化流程逻辑		
		//绑定事件接口实现
		bindEvents:function(){

		},
		/**
		 * 免登陆 测试移动端工作流
		 */
		testflow4phone:function(){
			$(function(){
				$.cookie("client_open_id", "", -1);
				$.cookie("client_open_id", "3158D6C8AD085A7EEFFCC856C9D3718FC157E6120F187AE35697058C98477B32");
				$("#go2flow").attr('href',oui);
			})
		},
		/**
		 * 移动端弹框菜单功能 
		 */
		event2contextMenu:function(cfg){
			var _self = this;
			var tipCfg = _self.putContextMenu4event(cfg);
			var nodeIdMap =_self.nodeIdMap;
			var nodeId = tipCfg.nodeId;
			var FlowUi = _self.getFlowUi();
			var x,y;
			var workflowTreeNode = _self.workflowTreeNode;
			var rectNode = workflowTreeNode.states[nodeId];
			var attr = nodeIdMap[nodeId].attr;
			if(nodeIdMap[nodeId].isEnd){
				return ;
			}
			if(_self.design4Runtime){
				//移动端设计态运行，需要将dialog
				var dialog = oui.getCurrUrlDialog();
				dialog.hideFooter();
				_self.actionSheet = oui.showActionSheetDialog({content:tipCfg.content,cancel:function(){
					dialog.showFooter();
				}});
			}else{

				_self.actionSheet = oui.showActionSheetDialog({content:tipCfg.content });
			}

			return false;
		}
	};
	//类继承实现 
	FlowBiz = $.extend(true,{},FlowBiz.getSuper(),FlowBiz);
	oui.NS(FlowBiz['package'])[FlowBiz['class']] = FlowBiz;
	//FlowBiz = oui.createClass(FlowBiz);
	//pc特有
	FlowBiz.hideTips = function(cfg){ //该方法目前在元素中通过oui-e- 配置函数名使用
		var e =cfg.e;
		var _self = this;
		var $menu =  $("#flow-ui-contextMenus") ;
		if($menu.length<=0){
			return ;
		}
		if(oui.isInDom(e.target,$menu[0])){
			return ;
		}
		//_self.actionSheet && (!$.isEmptyObject(_self.actionSheet)) &&_self.actionSheet.close();
	};
})(oui.flow.FlowUi);








