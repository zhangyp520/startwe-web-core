!(function (win, $) {

    var SysController4Design = {
        "package": "com.oui.models.sys.web",//com.oui.models.sys.web.SysController4Design
        "class": "SysController4Design",
        data:{
        },


        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'sys-design',oui.parseJson(oui.parseString(urlParams)));

            template.helper("SysController4Design",this);
            me.data.clickName = oui.os.mobile?'tap':'click';

            me.data.apiMap={};
            me.data.sys = {
            };
            me.nodeTypeEnum = {
                root:{
                  name:'root'
                },
                sys:{
                    name:'sys'
                }

            };
            me.menuActionEnum = {
                designPage:{//设计页面
                    action:function(node,treeMap,orgGraph){
                        var id = node.id;
                        orgGraph.showPageDesign(id);
                    }
                },
                addSys:{
                    api:'addSys',
                    display:'添加系统',
                    getApiParams:function(node,treeMap,orgGraph){
                        var ids = treeMap.ids ||[];
                        var params = {
                            sys:{
                                id: treeMap.newId(),
                                parentId:node.id,
                                name:'新的系统'+(ids.length+1),
                                nodeType:me.nodeTypeEnum.sys.name
                            }
                        };
                        return params;
                    },

                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var newNode = result.sys;
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
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
                        var view = oui.getById("sys-design");
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
                                 text:"取消"
                            }],
                            success:function(){

                            },
                            error:function(){

                            }
                        });
                    }
                },
                removeAll4ajax:{ //删除当前和所有子孙,并执行后台api删除
                    api:'removeAllNode',
                    display:'删除节点',
                    getApiParams:function(node,treeMap,orgGraph){
                        var params = {
                            nodeId:node.id,
                            nodeType:node.node.nodeType,
                            menuId:me.data.sys.id,
                            circleId:me.data.sys.circleId
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
                            treeMap.removeNode(node);
                            orgGraph.refreshByNodeId(parentId,treeMap);
                        }
                        //删除节点时，同时删除 所有菜单
                        //
                        oui.db.sys_config.removeOne(node.id,function(){
                            console.log('删除当前系统的菜单成功');
                            if(com.oui.portal.PortalController.data.sysId ==node.id){//删除的是当前系统，需要刷新portal
                                setTimeout(function(){
                                    oui.go4replace(oui.getContextPath()+'index-1.html');
                                },2000);
                            }
                        },function(){
                            console.log('删除当前系统的菜单失败');
                        });
                    }
                },
                removeAll:{ //删除当前和所有子孙
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
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
                me.data.sys.circleId = urlParams.circleId||'';
                oui.db.sys_config.selectOne('root',function(res){
                    if(!res){
                        me.init4default();
                    }else{
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
            me.treeMap = me.newTreeMap({
                id:'root',
                "clickName":"click",
                "idKey":"id",
                "parentIdKey":"parentId",
                "nameKey":"name",
                "ids":["root"],
                "rootIds":["root"],
                "map":{"root":{"id":"root","joinId":"","prevId":"","parentId":"","parentIds":[],"childIds":[ ],
                    "node":{"id":"root","name":"系统维护","parentId":"","nodeType":"root","prevId":"","joinId":""},"unExpand":false}
                },"direction":""
            });
        },
        destroy:function(){
          //页面销毁触发
            var me = this;
            template.helper('SysController4Design',null);
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
            $(document).on('dragstart','#control_sys-design .orgchart .node',function(e){
                me.dragData.fromNodeId ='';
                me.dragData.toNodeId = '';
                me.dragData.timer4dragend=null;
                var nodeId = $(e.target).attr('node-id');
                if(!nodeId){
                    return;
                }
                $('#control_sys-design .second-menu').remove();
                me.dragData.fromNodeId = nodeId;
                $('.node','#control_sys-design .orgchart').removeClass('allowedDrop');
            });
            $(document).on('dragover','#control_sys-design .orgchart .node',function(e){
                e.preventDefault();
                var nodeId = $(e.target).attr('node-id');
                if(!nodeId){
                    return ;
                }
                //console.log('dragover:'+nodeId);

                //$(e.target).addClass('');
            });
            $(document).on('dragend','#control_sys-design .orgchart .node',function(e){
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

                    $('.node','#control_sys-design .orgchart').removeClass('allowedDrop');
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
                $(document).off('mousedown', '#control_sys-design .sys-design-graph');
            }catch(err){
            }
            /*** 拖拽事件处理***/
            $(document).on('mousedown', '#control_sys-design .sys-design-graph', function (e) {
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
            $('.node', '#control_sys-design .orgchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '#control_sys-design .orgchart').removeClass('allowedDropTarget');
            $('#control_sys-design .second-menu').remove();
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
            var view = oui.getById('sys-design');
            var html = view.getHtmlByTplId('sys-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','#control_sys-design .orgchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            var view = oui.getById('sys-design');
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
            var view = oui.getById('sys-design');
            var $node = $('.node[node-id='+targetNodeId+']','.orgchart');



            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu').remove();
            $('.orgchart').closest('.sys-design-graph').append(html);
            oui.follow4fixed($node.find('.title')[0],$('.second-menu')[0],true);
        },

        /** 事件处理方法开始......******/

        event2showMenu:function(cfg){
            var me = this;
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('sys-design');
            $('.allowedDrop','.orgchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            var html = view.getHtmlByTplId('node-menu-sys-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $('.orgchart').closest('.sys-design-graph').append(html);
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
                menuId:me.data.sys.id,
                circleId:me.data.sys.circleId
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
            var view = oui.getById('sys-design');
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
            if(me.data.sys.id == nodeId){
                me.data.sys.name = $(cfg.el).val();
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
        saveDesign:function(success){
            var me = this;
            var saveDesignApi = me.data.saveDesignUrl;
            var param = {
                sysId:me.data.sys.id,
                treeMap:me.treeMap
            };
            if(saveDesignApi){
                oui.postData(saveDesignApi,param,function(res){
                    if(res.success){
                        success&&success();
                    }else{
                        oui.getTop().oui.alert(res.msg);
                    }
                    com.oui.portal.PortalController.refreshHeader();//刷新头部
                },function(err){
                    oui.getTop().oui.alert(err);
                },'保存中...');

            }else{
                //本地存储
                console.log('本地存储');
                oui.db.sys_config.saveOrUpdate(me.treeMap,function(){
                    console.log('保存成功');
                    com.oui.portal.PortalController.refreshHeader();//刷新头部
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
                    var sys = res.sys||{};
                    me.data.sys = sys;
                    if(res.designJson){
                        me.treeMap = me.newTreeMap(oui.parseJson(res.designJson),'id','parentId','name');
                    }else{
                        me.treeMap = me.array2orgTreeMap([{
                            id:sys.id,
                            name:sys.name,
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
    SysController4Design = oui.biz.Tool.crateOrUpdateClass(SysController4Design);
})(window,window.$$||window.$);




