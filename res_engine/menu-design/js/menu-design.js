!(function (win, $) {

    var MenuController4Design = {
        "package": "com.oui.models.menu.web",//com.oui.models.menu.web.MenuController4Design
        "class": "MenuController4Design",
        data:{
        },

        /** 获取当前系统id*/
        getSysId:function(){
            return com.oui.portal.PortalController.data.sysId; //系统id
        },
        getSysName:function(){
            var sys = com.oui.portal.PortalController.data.sys||[];
            var sysId = this.getSysId();
            var curr = oui.findOneFromArrayBy(sys,function(item){
                if(item.id ==sysId ){
                    return true;
                }
            });
            return curr? curr.display:'';
        },

        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'menu-design',oui.parseJson(oui.parseString(urlParams)));

            template.helper("MenuController4Design",this);
            me.data.clickName = oui.os.mobile?'tap':'click';

            me.data.apiMap={};
            me.data.menu = {
            };
            me.nodeTypeEnum = {
                root:{
                  name:'root'
                },
                menu:{
                    name:'menu'
                }

            };
            me.menuActionEnum = {
                addMenu:{
                    api:'addMenu',
                    display:'添加菜单',
                    getApiParams:function(node,treeMap,orgGraph){
                        var ids = treeMap.ids ||[];
                        var params = {
                            menu:{
                                id: treeMap.newId(),
                                parentId:node.id,
                                name:'新的菜单'+(ids.length+1),
                                nodeType:me.nodeTypeEnum.menu.name
                            }
                        };
                        return params;
                    },

                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var newNode = result.menu;
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                designPage:{
                    //设计页面
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var tempNode = node.node ||{} ;
                        tempNode.page = tempNode.page ||{};
                        var page = tempNode.page;
                        var controls = page.controls ||[];
                        controls = oui.parseJson(controls);//处理控件字符串为数组
                        page.events = oui.parseJson(page.events||{});//处理事件的字符串为对象
                        page.controls = controls;
                        page.style = oui.parseJson(page.style);
                        page.innerStyle = oui.parseJson(page.innerStyle);
                        page.pageDesignType = 'normalForm';

                        //TODO 处理 页面url 加载表单设计器

                        //转换后台返回的数据格式，浮点数被转字符串问题修复 fix定位位置问题
                        //page = me.transPage4Front(page);
                        /*


                         pageBizPropsUrl:'res_engine/page_design/pc/page-biz-tpl-robot.art.html', //页面业务属性扩展url
                         controlBizPropsUrl:'res_engine/page_design/pc/components-biz-prop-art-tpl-robot', //控件业务属性扩展url
                         buttons:'preview,save,merge,split,insertColumn4prev,insertRow4prev,removeColumn,removeRow',
                         bizJs:'res_engine/page_design/pc/js/page-plugin-robot.js',
                         saveCallBack:'saveCallback'
                         */
                        //保存菜单页面回调命令
                        var dialog = oui.showPageDesign({
                            //pageBizPropsUrl:'res_engine/page_design/pc/page-biz-tpl-robot.art.html', //页面业务属性扩展url
                            //controlBizPropsUrl:'res_engine/page_design/pc/components-biz-prop-art-tpl-robot', //控件业务属性扩展url
                            buttons:'preview,save,merge,split,insertColumn4prev,insertRow4prev,removeColumn,removeRow',
                            bizJs:'res_engine/menu-design/js/page-design-plugin-1.6.js',

                            uploadUrl:oui.uploadURL,//跨静态页面传值，用于上传组件
                            /**必须参数*/
                            controls: [],//已有的控件列表
                            mainTemplate: '',//页面的业务属性面板模板获取方法
                            saveCallBack:'saveCallback',
                            /**非必须参数*/
                            viewType:'urlDialog',
                            useControls:false,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件全控件列表
                            page:page,//页面设计对象，如果是打印则是打印模板设计对象
                            scriptPkg:"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
                            bizCss: [],
                            canCloneControl:true,//是否可以复制控件
                            //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
                            params: {
                            }
                        });
                        com.oui.portal.PortalController._currentDialog = dialog;
                        com.oui.portal.PortalController._tempPage = page;
                        com.oui.portal.PortalController.cmd4saveMenuPageDesign = function(param,event){
                            //保存回调处理
                            var _tempPage = param.page ||{};
                            for(var k in _tempPage ){
                                this._tempPage[k] = _tempPage[k];
                            }

                            //this._tempPage =
                            var win = this._currentDialog.getWindow();
                            me.saveDesign(function(){
                                win.postMessage({
                                    cmd:'cmd4saveCallbackSuccess',//加载系统和系统菜单
                                    param:{
                                        message:'保存成功'
                                    }
                                },'*');
                            });
                        };

                    }
                },
                editEnName:{ //编辑英文名，一般用于导出项目代码的目录名
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var name = node.node.enName||node.id;
                        oui.getTop().oui.showInputDialog('编辑英文名称',function(v){
                            if(!v){
                                oui.getTop().oui.alert('英文名称不能为空');
                                return ;
                            }
                            var url = me.data.apiMap['updateNodeEnName'];
                            if(url){
                                oui.postData(url,{
                                    nodeId:node.id,
                                    nodeType:node.node.nodeType,
                                    oldEnName:name,
                                    newEnName:v
                                },function(res){
                                    if(res.success){
                                        node.node.enName = v;
                                        orgGraph.refreshByNodeId(node.id,treeMap);
                                        me.saveDesign();
                                    }else{
                                        oui.getTop().oui.alert(res.msg);
                                    }
                                },'保存中');
                            }else{
                                node.node.enName = v;
                                orgGraph.refreshByNodeId(node.id,treeMap);
                                me.saveDesign();
                            }

                        },[{type:"text",value:name}]);
                    }
                },
                editName:{
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var name = node.node.name;
                        oui.getTop().oui.showInputDialog('编辑名称',function(v){
                            if(!v){
                                oui.getTop().oui.alert('节点名称不能为空');
                                return ;
                            }
                            var url = me.data.apiMap['updateNodeName'];
                            if(url){
                                oui.postData(url,{
                                    nodeId:node.id,
                                    nodeType:node.node.nodeType,
                                    oldName:name,
                                    newName:v
                                },function(res){
                                    if(res.success){
                                        node.node.name = v;
                                        orgGraph.refreshByNodeId(node.id,treeMap);
                                        me.saveDesign();
                                    }else{
                                        oui.getTop().oui.alert(res.msg);
                                    }
                                },'保存中');
                            }else{
                                node.node.name = v;
                                orgGraph.refreshByNodeId(node.id,treeMap);
                                me.saveDesign();
                            }

                        },[{type:"text",value:name}]);
                    }
                },
                edit:{
                    /** 业务编辑，如配置页面url，指定自定义页面等 ***/
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var name = node.node.name;
                        var view = oui.getById("menu-design");
                        var html = view.getHtmlByTplId('node-biz-edit-tpl',{
                            treeMap:me.treeMap,
                            nodeId:node.id
                        });
                        var obj = oui.getTop().oui.showHTMLDialog( {
                            content:html,
                            title:"业务设置",
                            actions:[{text:"确定",
                                 cls:'',//指定自定义样式名 可以实现自定义按钮样式和位置
                                 action: function(){
                                     alert("hhhhhh") ;

                                     obj.hide();
                                 }
                            },{
                                cls:'oui-dialog-cancel',
                                text:"取消",
                                action: function(){

                                    obj.hide();
                                }
                            }],
                            success:function(){

                            },
                            error:function(){

                            }
                        });
                    }
                },
                addApp:{
                    api:'addApp',
                    display:'添加应用',
                    getApiParams:function(node,treeMap,orgGraph){
                        var ids = treeMap.ids ||[];
                        var newNode = {
                            id: treeMap.newId(),
                            parentId:node.id,
                            name:'新的应用'+(ids.length+1),
                            nodeType:me.nodeTypeEnum.app.name,
                            menuId:me.data.menu.id,
                            circleId:me.data.menu.circleId,
                            moduleId:node.id
                        };
                        var params = {
                            app:newNode
                        };
                        return params;
                    },
                    action:function(node,treeMap,orgGraph,target,result){
                        var newNode = result.app;
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addPage:{
                    api:'addPage',
                    display:'添加页面',
                    getApiParams:function(node,treeMap,orgGraph){
                        var params = {};
                        var ids = treeMap.ids ||[];
                        var moduleId = node.parentId;
                        var newNode = {
                            id: treeMap.newId(),
                            parentId:node.id,
                            name:'新的页面'+(ids.length+1),
                            nodeType:me.nodeTypeEnum.page.name,
                            menuId:me.data.menu.id,
                            circleId:me.data.menu.circleId,
                            appId:node.id,
                            moduleId:moduleId
                        };
                        params.page = newNode;
                        return params;
                    },
                    action:function(node,treeMap,orgGraph,target,result){
                        var newNode = result.page;
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic:{
                    api:'addLogic',
                    display:'添加逻辑',
                    getApiParams:function(node,treeMap,orgGraph){
                        var params = {

                        };
                        var ids = treeMap.ids ||[];
                        var moduleId= node.parentId;
                        var newNode = {
                            id: treeMap.newId(),
                            parentId:node.id,
                            name:'新的逻辑'+(ids.length+1),
                            nodeType:me.nodeTypeEnum.logic.name,
                            menuId:me.data.menu.id,
                            circleId:me.data.menu.circleId,
                            appId:node.id,
                            moduleId:moduleId
                        };
                        params.logic = newNode;
                        return params;
                    },
                    action:function(node,treeMap,orgGraph,target,result,res){
                        var newNode = result.logic;
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                removeAll4ajax:{ //删除当前和所有子孙,并执行后台api删除
                    api:'removeAllNode',
                    display:'删除节点',
                    getApiParams:function(node,treeMap,orgGraph){
                        var params = {
                            nodeId:node.id,
                            nodeType:node.node.nodeType,
                            menuId:me.data.menu.id,
                            circleId:me.data.menu.circleId
                        };
                        return params;
                    },
                    action:function(node,treeMap,orgGraph,target,result){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        treeMap.removeNodeAll(node);
                        orgGraph.refreshByNodeId(parentId,treeMap);

                    }
                },
                add:{ //添加子节点
                    action:function(node,treeMap,orgGraph){
                        var newNode = {
                            id: treeMap.newId(),
                            parentId:node.id,
                            name:'新的节点'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addParent:{//添加一个新节点 作为当前节点的父节点
                    action:function(node,treeMap,orgGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            name:'新的节点',
                            parentId:node.parentId||""
                        };
                        var isRefreshRoot = !node.parentId;
                        treeMap.addParentNode(newNode,node); //添加节点
                        if(isRefreshRoot){
                            orgGraph.refreshByRoot(treeMap);
                        }else{
                            orgGraph.refreshByNodeId(newNode.parentId,treeMap);
                        }
                    }
                },
                addBrother:{ //在当前节点后面添加一个兄弟节点,考虑顺序调整
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){ //根节点不能添加兄弟节点
                            return ;
                        }
                        var newNode = {
                            id:treeMap.newId(),
                            name:'新的节点',
                            parentId:node.parentId
                        };

                        treeMap.addBrotherNode(newNode,node); //添加节点

                        orgGraph.refreshByNodeId(node.parentId,treeMap);
                    }
                },
                remove:{//删除当前节点
                    action:function(node,treeMap,orgGraph){
                        //根节点不能删除
                        if(!node.parentId){
                            if(node.childIds&&node.childIds.length==1){
                                //根节点只有一个子节点时，才能删除，将子节点作为根节点
                                treeMap.removeRoot(node);
                                orgGraph.refreshByRoot(treeMap);
                            }
                        }else{
                            var parentId = node.parentId;
                            //删除时需要判断是否存在页面设计
                            //删除页面设计,再删除节点
                            //TODO
                            treeMap.removeNode(node);
                            orgGraph.refreshByNodeId(parentId,treeMap);
                        }
                    }
                },
                removeAll:{ //删除当前和所有子孙
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        //删除当前和所有孙子节点时，需要遍历删除所有表单设计
                        //TODO
                        treeMap.removeNodeAll(node);
                        orgGraph.refreshByNodeId(parentId,treeMap);

                    }
                },
                hideMenu:{
                    action:function(node,treeMap,orgGraph){

                    }
                },
                /** 对于拖拽处理的两个节点位置交换逻辑 *****/

                //            <!--swap,addParentByTarget,addBrotherByTarget,addChildByTarget,hideMenu4DragEnd -->
                swapSort:{
                    ///交换两个节点的顺序
                    action:function(node,treeMap,orgGraph,targetNode){
                        if((!node) ||(!targetNode)){
                            return ;
                        }
                        if(node.parentId == targetNode.parentId){
                            var parentNode = treeMap.findNode(node.parentId);
                            if(parentNode){
                                var childIds = parentNode.childIds ||[];
                                var nodeIdx = childIds.indexOf(node.id);
                                var targetIdx = childIds.indexOf(targetNode.id);
                                childIds[nodeIdx] = targetNode.id;
                                childIds[targetIdx] = node.id;
                            }
                            orgGraph.refreshByNodeId(node.parentId,treeMap);
                        }

                    }
                },
                swap:{
                    /***
                     * 交换算法， 只变更更 交换 两个节点 的名称而已
                     * @param node
                     * @param treeMap
                     * @param orgGraph
                     * @param targetNode
                     */
                    action:function(node,treeMap,orgGraph,targetNode){
                        var id = node.id;
                        var targetId = targetNode.id;


                        var nodeName = treeMap.findNodeName(node.id);
                        var targetNodeName = treeMap.findNodeName(targetNode.id);
                        treeMap.updateNodeName(node.id,targetNodeName);
                        treeMap.updateNodeName(targetNode.id,nodeName);
                        //刷新 分别刷新两个节点的父节点即可
                        if(treeMap.isRoot(node.id) || treeMap.isRoot(targetNode.id)){
                            orgGraph.refreshByRoot(treeMap);
                        }else{
                            orgGraph.refreshByNodeId(node.parentId,treeMap);
                            orgGraph.refreshByNodeId(targetNode.parentId,treeMap);
                        }

                    }
                },
                addChildByTarget:{//将节点添加到目标节点下，作为目标节点的子节点
                    action:function(node,treeMap,orgGraph,targetNode){
                        //将当前节点的父亲节点中的 子节点列表中移除 当前节点
                        //目标节点的子节点列表中增加当前节点
                        //刷新目标节点
                        if(!node.parentId){ //根节点不能作为目标节点的子节点
                            return ;
                        }
                        /****
                         * 祖先节点不能作为 目标节点的子节点
                         */
                        if(treeMap.hasParents(node.id,targetNode.id)){
                            return ;
                        }
                        /*****
                         * 剔除当前节点在父节点的子节点列表中位置
                         */
                        var lastParentId = node.parentId;
                        var nodeId = node.id;
                        var parentNode = treeMap.findNode(lastParentId);
                        if(parentNode && parentNode.childIds){
                            var idx = parentNode.childIds.indexOf(nodeId);
                            if(idx>-1){
                                parentNode.childIds.splice(idx,1);
                            }
                        }
                        /**
                         * 目标节点的子节点列表中增加当前节点
                         */
                        var childIds= targetNode.childIds||[];
                        childIds.push(nodeId);
                        targetNode.childIds = childIds;

                        node.parentIds = [targetNode.id];
                        node.parentId = targetNode.id;

                        orgGraph.refreshByNodeId(targetNode.id,treeMap);
                        orgGraph.refreshByNodeId(lastParentId,treeMap);
                    }
                },
                hideMenu4DragEnd:{
                    action:function(node,treeMap,orgGraph,targetNode){

                    }
                }
            };
            if(id){
                //编辑
                me.load({
                    id:id
                },function(){
                    oui.parse({
                        callback:function(){
                            me.bindEvents();
                        }
                    });
                });
            }else{
                me.data.menu.circleId = urlParams.circleId||'';
                var sysId = me.getSysId();
                oui.db.sys_menu.selectOne(sysId,function(res){
                    if(!res){
                        me.init4default();
                    }else{
                        var lastNode =res;
                        lastNode.map['root'].node.name = me.getSysName(); //根节点的名称修改
                        me.treeMap = me.newTreeMap(res);
                    }
                    //新增
                    oui.parse({
                        callback:function(){
                            me.bindEvents();
                        }
                    });
                },function(){
                });
                //创建一个新菜单
            }
        },
        init4default:function(){
            var me = this;
            var sysId = me.getSysId();
            me.treeMap = me.newTreeMap({
                id:sysId,
                "clickName":"click",
                "idKey":"id",
                "parentIdKey":"parentId",
                "nameKey":"name",
                "ids":["root"],
                "rootIds":["root"],
                "map":{"root":{"id":"root","joinId":"","prevId":"","parentId":"","parentIds":[],"childIds":[ ],
                    "node":{"id":"root","name":me.getSysName(),"parentId":"","nodeType":"root","prevId":"","joinId":""},"unExpand":false}
                },"direction":""
            });
        },
        destroy:function(){
          //页面销毁触发
            var me = this;
            template.helper('MenuController4Design',null);
            me.data=null;
            oui.biz.Tool.Clear(me);
        },
        /** 根据输入变量获取控件类型***/
        findControlType4param:function(propDefine){
            var dataTypeEnum = oui.dataTypeEnum[propDefine.dataType]
            return dataTypeEnum.controlType||"textfield";
        },
        /** 根据输入变量获取显示类型***/
        findShowType4param:function(propDefine){
            var dataTypeEnum = oui.dataTypeEnum[propDefine.dataType]
            var showType =dataTypeEnum.showType;
            if(typeof showType !='undefined'){
                return showType;
            }
            showType=0;
            return showType;
        },
        /** 根据输入变量获取输入校验*****/
        findValidate4param:function(propDefine){
            return {};
        },
        /** 绑定拖拽事件****/
        bindEvents:function(){
            var me = this;
            me.dragData = {};
            $(document).on('dragstart','#control_menu-design .orgchart .node',function(e){
                me.dragData.fromNodeId ='';
                me.dragData.toNodeId = '';
                me.dragData.timer4dragend=null;
                var nodeId = $(e.target).attr('node-id');
                if(!nodeId){
                    return;
                }
                $('.second-menu').remove();
                me.dragData.fromNodeId = nodeId;
                $('.node','.orgchart').removeClass('allowedDrop');
            });
            $(document).on('dragover','#control_menu-design .orgchart .node',function(e){
                e.preventDefault();
                var nodeId = $(e.target).attr('node-id');
                if(!nodeId){
                    return ;
                }
                //console.log('dragover:'+nodeId);

                //$(e.target).addClass('');
            });
            $(document).on('dragend','#control_menu-design .orgchart .node',function(e){
                var nodeId = $(e.target).attr('node-id');
                if(!nodeId){
                    return ;
                }
                if(me.dragData.timer4dragend){
                    try{
                        clearTimeout(me.dragData.timer4dragend);
                    }catch(err){
                    }
                    me.dragData.timer4dragend = null;
                }
                me.dragData.timer4dragend = setTimeout(function(){
                    console.log('drag end,from:'+me.dragData.fromNodeId+',to:'+me.dragData.toNodeId);

                    $('.node','.orgchart').removeClass('allowedDrop');
                    if(me.dragData.fromNodeId == me.dragData.toNodeId){
                        return ;
                    }
                    if(me.dragData.fromNodeId&&me.dragData.toNodeId){
                        $('.node[node-id='+me.dragData.fromNodeId+'],.node[node-id='+me.dragData.toNodeId+']').addClass('allowedDrop');
                    }
                    me.dragEnd(me.dragData.fromNodeId,me.dragData.toNodeId);

                    me.dragData.timer4dragend = null;
                },1);

            });
            $(document).on('drop',function(e){
                var target = e.target;
                if(!$(target).hasClass('node')){
                    try{
                        target = $(target).closest('.node')[0];
                    }catch(err){
                    }
                    if(!target){
                        return ;
                    }
                }
                var nodeId = $(target).attr('node-id');
                if(!nodeId){
                    return ;
                }
                me.dragData.toNodeId = nodeId;
                //console.log(e);
                //console.log('drop:'+nodeId);

            });

            $(document).on('mousedown',function(e){
                if ($(e.target).closest('.node').length) {
                    return;
                }
                if($(e.target).closest('.second-menu').length || ($(e.target).is('.second-menu'))){
                    return ;
                }
                me.hideMenu&&me.hideMenu();
            });
            try{
                $(document).off('mousedown', '#control_menu-design .menu-design-graph');
            }catch(err){
            }
            /*** 拖拽事件处理***/
            $(document).on('mousedown', '#control_menu-design .menu-design-graph', function (e) {
                var $this = $('.orgchart');
                if ($(e.target).closest('.node').length) {
                    $this.data('panning', false);
                    //e.preventDefault();
                    return;
                } else {
                    $this.css('cursor', 'move').data('panning', true);

                }
                var lastX = 0;
                var lastY = 0;
                var lastTf = $this.css('transform')||"none";
                if (lastTf !== 'none') {
                    var temp = lastTf.split(',');
                    if (lastTf.indexOf('3d') === -1) {
                        lastX = parseInt(temp[4]);
                        lastY = parseInt(temp[5]);
                    } else {
                        lastX = parseInt(temp[12]);
                        lastY = parseInt(temp[13]);
                    }
                }
                var startX = e.pageX - lastX;
                var startY = e.pageY - lastY;

                $(document).on('mousemove', function (ev) {
                    var newX = ev.pageX - startX;
                    var newY = ev.pageY - startY;
                    var lastTf = $this.css('transform')||'none';
                    if (lastTf === 'none') {
                        if (lastTf.indexOf('3d') === -1) {
                            $this.css('transform', 'matrix(1, 0, 0, 1, ' + newX + ', ' + newY + ')');
                        } else {
                            $this.css('transform', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + newX + ', ' + newY + ', 0, 1)');
                        }
                    } else {
                        var matrix = lastTf.split(',');
                        if (lastTf.indexOf('3d') === -1) {
                            matrix[4] = ' ' + newX;
                            matrix[5] = ' ' + newY + ')';
                        } else {
                            matrix[12] = ' ' + newX;
                            matrix[13] = ' ' + newY;
                        }
                        $this.css('transform', matrix.join(','));
                    }
                });
            });
            $(document).on('mouseup', function (e) {
                var $chart = $('.orgchart');
                if ($chart.data('panning')) {
                    $chart.css('cursor', 'default');
                    $(this).off('mousemove');
                    $chart.data('panning', false);
                }
            });
        },

        hideMenu:function(){
            $('.node', '#control_menu-design .orgchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '#control_menu-design .orgchart').removeClass('allowedDropTarget');
            $('#control_menu-design .second-menu').remove();
        },
        /****
         * 显示页面设计
         * @param id
         */
        showPageDesign:function(id){
            var me  = this;

            var loadUrl =  oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),'loadPageDesign');
            oui.getData(me.data.loadPageDesignUrl||loadUrl,{
                id:id
            },function(res){
                var page = res.page||{};

                var controls = page.controls ||[];
                controls = oui.parseJson(controls);
                page.controls = controls;
                page.style = oui.parseJson(page.style);
                page.innerStyle = oui.parseJson(page.innerStyle);
                //page.pageDesignType = 'normalForm';
                var treeNode = me.treeMap.findNode(id);
                var node = treeNode.node;
                node.parentId= treeNode.parentId;
                node.id = treeNode.id;
                oui.showPageDesign({
                    designTplUrl:oui.getContextPath()+'res_engine/page_design/common/runtime/page-runtime-edit-tpl.html',
                    uploadUrl:oui.uploadURL,//跨静态页面传值，用于上传组件
                    /**必须参数*/
                    controls: [],//已有的控件列表
                    mainTemplate: '',//页面的业务属性面板模板获取方法
                    bizJs:[oui.getContextPath()+'res_apps/menu/js/page-design/page-design-plugin.js'],
                    saveCallBack:'saveCallBack',
                    /**非必须参数*/
                    viewType:'openWindow',
                    buttons: "save", //按钮参数,如save,print 等按钮事件名
                    useControls:false,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件全控件列表
                    page:page,//页面设计对象，如果是打印则是打印模板设计对象
                    scriptPkg:"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
                    bizCss: [],
                    canCloneControl:true,//是否可以复制控件
                    //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
                    params: {
                        nodeJson :oui.parseString(node),
                        saveUrl:  me.data.savePageDesignUrl|| oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),'savePageDesign')
                    }
                });
            },'设计加载中...',function(res){
               oui.getTop().oui.alert('由于网络原因，加载失败');
            });

        },
        /**
         * 根据节点 和树对象刷新某个节点和节点下面的所有节点
         * @node
         * @treeMap
         * ***/
        refreshByNodeId:function(nodeId,treeMap){
            var view = oui.getById('menu-design');
            var html = view.getHtmlByTplId('menu-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','#control_menu-design .orgchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            var view = oui.getById('menu-design');
            view.render();
        },
        newTreeMap:function(treeMapObj,idKey,parentIdKey,nameKey){
            var me = this;
            treeMapObj.idKey = idKey||'id';
            treeMapObj.parentIdKey = parentIdKey||'parentId';
            treeMapObj.nameKey = nameKey||'name';
            treeMapObj.clickName = oui.os.mobile?'tap':'click';
            var treeMap = com.oui.TreeMap.newTreeMap(treeMapObj);
            return treeMap;
        },
        array2orgTreeMap:function(arr,idKey,parentIdKey,nameKey){
            var me = this;
            var treeMap = com.oui.TreeMap.array2treeMap(arr,idKey,parentIdKey,nameKey);
            return treeMap;
        },
        expandChildren:function(cfg){
            cfg.e.stopPropagation&&cfg.e.stopPropagation();
            var $node = $(cfg.el).closest('.node[node-id]');
            var nodeId = $node.attr('node-id');
            var me = this;
            me.treeMap.expandChildren(nodeId);
            var parentNode = me.treeMap.findParent(nodeId);
            if(parentNode&& parentNode.id){
                me.refreshByNodeId(parentNode.id,me.treeMap);
            }else{
                me.refreshByRoot(me.treeMap);
            }
        },
        unExpandChildren:function(cfg){
            cfg.e.stopPropagation&&cfg.e.stopPropagation();
            var $node = $(cfg.el).closest('.node[node-id]');
            var nodeId = $node.attr('node-id');
            var me = this;
            me.treeMap.unExpandChildren(nodeId);
            var parentNode = me.treeMap.findParent(nodeId);
            if(parentNode&& parentNode.id){
                me.refreshByNodeId(parentNode.id,me.treeMap);
            }else{
                me.refreshByRoot(me.treeMap);
            }
        },
        /** 数据返回***/
        getData: function () {
            var me = this;
            return me.data;
        },
        /** 方法处理方法开始......******/

        /******
         * 拖拽结束后 两个节点 处理逻辑
         * @param nodeId
         * @param targetNodeId
         */
        dragEnd:function(nodeId,targetNodeId){
            var me = this;
            if(!nodeId){
                return ;
            }
            if(!targetNodeId){
                return ;
            }

            //当前不提供 拖拽功能
            var hasMenus = false;
            if(!hasMenus){
                me.hideMenu();
                return;
            }

            var currNode = me.treeMap.findNode(nodeId);
            var targetNode = me.treeMap.findNode(targetNodeId);
            var view = oui.getById('menu-design');
            var $node = $('.node[node-id='+targetNodeId+']','.orgchart');



            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu').remove();
            $('.orgchart').closest('.menu-design-graph').append(html);
            oui.follow4fixed($node.find('.title')[0],$('.second-menu')[0],true);
        },

        /** 事件处理方法开始......******/

        event2showMenu:function(cfg){
            var me = this;
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('menu-design');
            $('.allowedDrop','.orgchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            var html = view.getHtmlByTplId('node-menu-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $('.orgchart').closest('.menu-design-graph').append(html);
            oui.follow4fixed(cfg.el,$('.second-menu')[0],true);
        },
        event2menuAction:function(cfg){
            cfg.e.stopPropagation&&cfg.e.stopPropagation();
            var me = this;
            var menuId = $(cfg.el).attr('menu-action-id');
            if(!me.menuActionEnum[menuId]){
                return ;
            }
            var nodeId = $(cfg.el).attr('node-id');
            var targetNodeId = $(cfg.el).attr('target-node-id');
            var treeMap = me.treeMap;
            var node = treeMap.findNode(nodeId);
            var targetNode = null;
            if(targetNodeId){
                targetNode = treeMap.findNode(targetNodeId);
            }
            var currActionEnum = me.menuActionEnum[menuId];

            if(currActionEnum.before){
                var flag = currActionEnum.before(node,treeMap,me,targetNode);
                if(typeof flag =='boolean'){
                    if(!flag){
                        return;
                    }
                }
            }
            var params = {
                menuId:me.data.menu.id,
                circleId:me.data.menu.circleId
            };
            if(currActionEnum.getApiParams){
                params = $.extend(true,params, currActionEnum.getApiParams(node,treeMap,me,targetNode) );
            }

            if(currActionEnum.api){
                var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),currActionEnum.api);
                var apiMap = me.data.apiMap;

                if(apiMap&& apiMap[currActionEnum.api]){
                    oui.postData(apiMap[currActionEnum.api]||path,params, function(res){
                        if(res.success){
                            currActionEnum.action(node,treeMap,me,targetNode,params,res);
                            //添加完成后，执行设计保存
                            me.saveDesign();
                        }else{
                            oui.getTop().oui.alert(res.msg||((currActionEnum.display||'') +'处理失败'));
                        }
                    },function(res){
                        oui.getTop().oui.alert(res.msg||('由于网络原因：'+(currActionEnum.display||'') +'处理失败'));
                    });
                }else{
                    currActionEnum.action(node,treeMap,me,targetNode,params);
                    //添加完成后，执行设计保存
                    me.saveDesign();
                }
            }else{
                currActionEnum.action(node,treeMap,me,targetNode,params);
                me.saveDesign();
            }
            $('.allowedDrop','.orgchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            return false;
        },
        event2editNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            var view = oui.getById('menu-design');
            var html = view.getHtmlByTplId('node-name-edit-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $(cfg.el).attr('draggable',false);
            $(cfg.el).append(html);
            $(cfg.el).find('.title').hide();
            $(cfg.el).find('input').focus();
        },
        event2updateCurrNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            if(me.data.menu.id == nodeId){
                me.data.menu.name = $(cfg.el).val();
            }
            me.treeMap.updateNodeName(nodeId,$(cfg.el).val());
            me.refreshByNodeId(nodeId,me.treeMap);

        },
        event2exportGraph:function(cfg){
            var $chartContainer = $('.orgchart');
            var me = this;
            var treeMap = me.treeMap;
            if(!treeMap.direction){
                treeMap.direction ='';
            }
            var name = me.treeMap.findRoot().node.name+'.png';
            com.oui.TreeMap.exportGraph(treeMap,$chartContainer,name,function(){
                $chartContainer.removeClass('canvasContainer');
            });
        },
        /**
         * 获取独立的vue模板
         * @param treeNode
         * @returns {*}
         */
        findNodeHtml4vue:function(treeNode){
            var me = this;
            var page = treeNode.node.page;
            var tempPage = oui.parseJson(oui.parseString(page));

            var content = tempPage.content;
            tempPage.content ='';
            tempPage.listContent ='';

            if(!me._tpl4vuehtml){
                var tplText = oui.loadUrl(oui.getContextPath()+'res_engine/page_design/pc/code-page-runtime-edit.art.html',2);
                me._tpl4vuehtml = template.compile(tplText);
            }
            var html = me._tpl4vuehtml({
                contextPath:oui.getContextPath(),
                name:treeNode.node.name,
                enName:treeNode.node.enName ||treeNode.id,
                content:content,
                pageJson:oui.parseString(tempPage)
            });
            return html;
        },
        //获取节点html代码
        findNodeHtml:function(treeNode){
            var me = this;
            var page = treeNode.node.page;
            var tempPage4content = oui.parseJson(oui.parseString(page));
            tempPage4content.listContent ='';
            var content = tempPage4content.content||'';
            if(!me._tpl4html){
                var tplText = oui.loadUrl(oui.getContextPath()+'res_engine/page_design/pc/code-page-runtime.html',2);
                me._tpl4html = template.compile(tplText);
            }
            var html = me._tpl4html({
                contextPath:oui.getContextPath(),
                name:treeNode.node.name,
                enName:treeNode.node.enName ||treeNode.id,
                content:content,
                pageJson:oui.parseString(tempPage4content)
            });
            return html;
        },
        /***
         * 导出所有节点源代码
         * @param nodeId
         */
        appendNode2zip:function(nodeId,zip){
            var me = this;
            var treeMap = me.treeMap;
            var nodes = treeMap.findChildren(nodeId)||[];
            oui.eachArray(nodes,function(item){

                //创建目录
                var pids = treeMap.findParentIdsAll(item.id)||[];
                pids = pids.reverse();//反序
                var path = [];
                oui.eachArray(pids,function(pid){
                    //var currNode = treeMap.findNode(pid);
                    path.push(treeMap.findNodeEnName(pid));
                });
                //创建源代码路径资源
                path.push(treeMap.findNodeEnName(item.id)+'.vue.html');
                var html4vue = me.findNodeHtml4vue(item); //根据页面设计获取页面vueHtml
                var html = me.findNodeHtml(item);
                var vuePath = path.join('/');
                var htmlPath = vuePath.replace('.vue.html','.html');

                //构造文件
                zip.addFile(vuePath,html4vue); //添加 模板文件
                zip.addFile(htmlPath,html); //添加 模板文件



                me.appendNode2zip(item.id,zip);
            });
        },
        /**导出整个系统 */
        event2exportSys:function(cfg){
            var me = this;
            // me.treeMap;
            console.log(me.treeMap);
            //根据树结构创建目录 和设计包
            //根据树结构创建目录，创建页面

            oui.require([
                oui.getContextPath()+"res_engine/tools/ouiAce/ace/ace.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/ace/ext-language_tools.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/ace/ext-statusbar.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/ace/ext-static_highlight.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/zip/zip.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/zip/mime-types.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/js/zip-tool.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/js/beautify.js",
                oui.getContextPath()+"res_engine/tools/ouiAce/js/HTML-Beautify.js"
            ],function(){

                var z = new ZipArchive();
                me.appendNode2zip('root',z);
                var name = me.treeMap.findNodeName('root');
                oui.getTop().oui.showInputDialog('导出项目-输入项目名称',function(v){
                    if(!v){
                        oui.getTop().oui.alert('项目名称不能为空');
                        return ;
                    }
                    z.export(v);
                },[{type:"text",value:name}]);

            });
        },
        saveDesign:function(success){
            var me = this;
            var saveDesignApi = me.data.saveDesignUrl;
            var param = {
                menuId:me.data.menu.id,
                treeMap:me.treeMap
            };
            if(saveDesignApi){
                oui.postData(saveDesignApi,param,function(res){
                    if(res.success){
                        success&&success();
                    }else{
                        oui.getTop().oui.alert(res.msg);
                    }
                    com.oui.portal.PortalController.refreshMenus();//刷新portal菜单
                },function(err){
                    oui.getTop().oui.alert(err);
                },'保存中...');

            }else{
                //本地存储
                console.log('本地存储');
                oui.db.sys_menu.saveOrUpdate(me.treeMap,function(){
                    console.log('保存成功');
                    com.oui.portal.PortalController.refreshMenus();//刷新portal菜单
                    success&&success();
                },function(){
                    console.log('保存失败');
                });
            }
        },
        /****
         * 保存 项目设计
         * @param cfg
         */
        event2saveDesign:function(cfg){
            var me = this;
            me.saveDesign(function(){
                var d= oui.getTop().oui.alert('保存成功');
                setTimeout(function(){
                    d.hide();
                },800);
            });
        },

        load:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),'loadDesign');
            var id = oui.getParam('id');
            path = me.urlParams.loadmenuDesignPath||path;
            oui.getData(path,param,function(res){
                if(res.success){
                    var menu = res.menu||{};
                    me.data.menu = menu;
                    if(res.designJson){
                        me.treeMap = me.newTreeMap(oui.parseJson(res.designJson),'id','parentId','name');
                    }else{
                        me.treeMap = me.array2orgTreeMap([{
                            id:menu.id,
                            name:menu.name,
                            parentId:null,
                            nodeType:me.nodeTypeEnum.root.name
                        }],'id','parentId','name');
                    }
                    me.data.saveDesignUrl =res.saveDesignUrl;
                    me.data.treeMap = me.treeMap||{};
                    me.data.apiMap = res.apiMap||{};
                    me.data.loadLogicUrl = res.loadLogicUrl;
                    me.data.loadInteractionDesignUrl = res.loadInteractionDesignUrl;
                    me.data.loadPageDesignUrl = res.loadPageDesignUrl;
                    me.data.savePageDesignUrl = res.savePageDesignUrl;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...');
        }
    };
    MenuController4Design = oui.biz.Tool.crateOrUpdateClass(MenuController4Design);
})(window,window.$$||window.$);




