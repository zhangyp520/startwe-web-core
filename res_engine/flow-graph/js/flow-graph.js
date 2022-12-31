!(function () {
    var FlowGraph = {
        "package": "com.startwe.models.flow.web",//com.startwe.models.flow.web.FlowDesignController
        "class": "FlowDesignController",
        varPrefix:'var',
        init: function () {
            var me = this;
            me.canEdit = true;
            template.helper('FlowGraph',this);
            var param = oui.getParam();

            var paramCfg= {};
            if (param.ouiInWindowDialog && ((param.ouiInWindowDialog + '') == 'true')) {//openWindow
                var windowId = param.windowId;
                if ((!window.opener) || (!window.opener._openMap) || (!window.opener._openMap[windowId])) {
                    //父窗体不存在，则关闭当前窗体
                    oui.getTop().oui.alert('调用页面设计器入口页面已经刷新或者关闭，请尝试关闭当前页面后，重新打开');
                    //window.close();
                    return;
                }
                if (window.opener._openMap[windowId].params) {
                    paramCfg = oui.parseJson(window.opener._openMap[windowId].params);
                }
                paramCfg.viewType = 'openWindow';
            } else if (param.ouiInDialog && ((param.ouiInDialog + '') == 'true')) {//urlDialog
                var dialog = oui.getCurrUrlDialog();
                paramCfg = oui.parseJson(dialog.attr('params'));
                paramCfg.viewType = 'urlDialog';
            }
            var urlParams = paramCfg;
            var id = urlParams.flowId ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'flow-design',oui.parseJson(oui.parseString(urlParams)));

            me.init4menuActionEnums();
            me.data.flows = [];
            me.data.flowTreeMap = {};
            me.data.isShow4Conditions= false;
            me.data.id = id ||"";
            me.data.inputParams=[];
            me.data.outputParams=[];
            me.data.varParams=[];
            me.data.varIndex=0;

            if(id){
                me.data.loadFlowUrl = urlParams.loadFlowUrl;
                me.load({
                },function(){
                    oui.parse({
                        callback:function(){
                            me.bindEvents();
                        }
                    });
                });
            }else{
                oui.parse({
                    callback:function(){
                        me.bindEvents();
                    }
                });
            }

        },
        init4menuActionEnums:function(){
            var me = this;
            me.menuActionEnum = {
                add:{ //添加子节点
                    action:function(node,treeMap,flowGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            prevId:'',
                            name:'新的节点'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        flowGraph.refreshByNodeId(node.id,treeMap);
                    }
                },

                edit:{//编辑节点内容,
                    action:function(node,treeMap,flowGraph){
                        me.event2editNodeName(node);
                    }
                },
                add4join:{
                    action:function(node,treeMap,flowGraph){
                        if(!node.childIds ||(!node.childIds.length)||(node.childIds.length!=1)){
                            var newNode = {
                                id:treeMap.newId(),
                                parentId:node.id,
                                prevId:'',
                                name:'新的节点'
                            };
                            treeMap.addNode(newNode); //添加节点
                        }else {//存在子节点，则 插入子节点的父节点
                            var childNode = treeMap.findNode(node.childIds[0]);
                            if(childNode){
                                var newNode = {
                                    id:treeMap.newId(),
                                    name:'新的节点',
                                    prevId:'',
                                    parentId:childNode.parentId||""
                                };
                                treeMap.addParentNode(newNode,childNode); //添加节点
                            }
                        }

                        //刷新当前节点和下面的节点列表
                        flowGraph.refreshByNodeId(node.prevId,treeMap);
                    }
                },
                addGrandson:{
                    /** 添加孙子节点 ***/
                    action:function(node,treeMap,flowGraph){
                        var newNode = {
                            id:treeMap.newId("join-"),
                            parentId:'',
                            prevId:node.id,
                            name:'新的节点'
                        };
                        if(node.joinId){
                            oui.getTop().oui.alert('孙子节点已经存在');
                            return ;
                        }
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        flowGraph.refreshByNodeId(node.id,treeMap);
                    }
                },

                addParent:{//添加一个新节点 作为当前节点的父节点
                    action:function(node,treeMap,flowGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            name:'新的节点',
                            parentId:node.parentId||""
                        };
                        var isRefreshRoot = !node.parentId;
                        treeMap.addParentNode(newNode,node); //添加节点
                        if(isRefreshRoot){
                            flowGraph.refreshByRoot(treeMap);
                        }else{
                            flowGraph.refreshByNodeId(newNode.parentId,treeMap);
                        }
                    }
                },
                addBrother:{ //在当前节点后面添加一个兄弟节点,考虑顺序调整
                    action:function(node,treeMap,flowGraph){
                        if(!node.parentId){ //根节点不能添加兄弟节点
                            return ;
                        }
                        var newNode = {
                            id:treeMap.newId(),
                            name:'新的节点',
                            parentId:node.parentId
                        };

                        treeMap.addBrotherNode(newNode,node); //添加节点

                        flowGraph.refreshByNodeId(node.parentId,treeMap);
                    }
                },

                remove:{//删除当前节点
                    action:function(node,treeMap,flowGraph){
                        //根节点不能删除
                        if(!node.parentId){
                            if(node.childIds&&node.childIds.length==1){
                                //根节点只有一个子节点时，才能删除，将子节点作为根节点
                                treeMap.removeRoot(node);
                                flowGraph.refreshByRoot(treeMap);
                            }
                        }else{
                            var parentId = node.parentId;
                            treeMap.removeNode(node);
                            flowGraph.refreshByNodeId(parentId,treeMap);
                        }
                    }
                },
                remove4join:{
                    //join节点提供清除后续节点功能
                    action:function(node,treeMap,flowGraph){
                        if(node.prevId){//是join节点
                            var childIdsAll = treeMap.findChildIdsAll(node.id);
                            if(childIdsAll.length){
                                for(var i= 0,len=childIdsAll.length;i<len;i++){
                                    treeMap.removeNode(treeMap.findNode(childIdsAll[i]));
                                }
                                flowGraph.refreshByNodeId(node.prevId,treeMap);
                            }
                        }
                    }
                },
                removeAll:{ //删除当前和所有子孙
                    action:function(node,treeMap,flowGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        treeMap.removeNodeAll(node);
                        flowGraph.refreshByNodeId(parentId,treeMap);

                    }
                },
                removeAll4join:{ //删除当前和所有子孙
                    action:function(node,treeMap,flowGraph){
                        if(node.prevId){//是join节点
                            treeMap.removeNodeAll4join(node);
                            flowGraph.refreshByNodeId(node.prevId,treeMap);
                        }

                    }
                },
                hideMenu:{
                    action:function(node,treeMap,flowGraph){

                    }
                },
                /** 对于拖拽处理的两个节点位置交换逻辑 *****/

                //            <!--swap,addParentByTarget,addBrotherByTarget,addChildByTarget,hideMenu4DragEnd -->
                swapSort:{
                    ///交换两个节点的顺序
                    action:function(node,treeMap,flowGraph,targetNode){
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
                            flowGraph.refreshByNodeId(node.parentId,treeMap);
                        }

                    }
                },
                swap:{
                    /***
                     * 交换算法， 只变更更 交换 两个节点 的名称而已
                     * @param node
                     * @param treeMap
                     * @param flowGraph
                     * @param targetNode
                     */
                    action:function(node,treeMap,flowGraph,targetNode){
                        var id = node.id;
                        var targetId = targetNode.id;


                        var nodeName = treeMap.findNodeName(node.id);
                        var targetNodeName = treeMap.findNodeName(targetNode.id);
                        treeMap.updateNodeName(node.id,targetNodeName);
                        treeMap.updateNodeName(targetNode.id,nodeName);
                        //刷新 分别刷新两个节点的父节点即可
                        if(treeMap.isRoot(node.id) || treeMap.isRoot(targetNode.id)){
                            flowGraph.refreshByRoot(treeMap);
                        }else{
                            flowGraph.refreshByNodeId(node.parentId,treeMap);
                            flowGraph.refreshByNodeId(targetNode.parentId,treeMap);
                        }

                    }
                },
                addChildByTarget:{//将节点添加到目标节点下，作为目标节点的子节点
                    action:function(node,treeMap,flowGraph,targetNode){
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

                        flowGraph.refreshByNodeId(targetNode.id,treeMap);
                        flowGraph.refreshByNodeId(lastParentId,treeMap);
                    }
                },
                hideMenu4DragEnd:{
                    action:function(node,treeMap,flowGraph,targetNode){

                    }
                }
            };

        },

        init4emptyNodes:function(id){
            var me = this;
            me.data.flows = [];
            me.data.flows.push({"id":id||oui.getUUIDLong(),"parentId":null,"sort":0,"name":"start"});
            me.treeMap = me.array2flowTreeMap(me.data.flows);
        },
        flowJson2TreeMap:function(){
            //流程树 只能转换为treeMap后，结构就简化了，但是不支持 复杂流程图的情况
            var me = this;
            var json = me.data.flow.json;
            json = oui.parseJson(json);
            var ids = json.ids ||[];
            var rootIds = json.rootIds ||[];
            var map = json.map ||{};
            var lineMap = json.lineMap||{};

            var map4tree = {};
            for(var k in map){
                var curr = map[k];
                var childIds =[];
                oui.eachArray(curr.lineIds,function(cid){
                    childIds.push(cid.split('_')[1]);
                    if(!lineMap[cid]){
                        lineMap[cid]= {
                            id:cid,
                            fromId:curr.id,
                            toId:cid.split('_')[1],
                            lineType:''
                        }
                    }
                });
                map4tree[k] = {
                    "id":curr.id,
                    "childIds":childIds ,
                    nodeType:curr.nodeType,//节点类型
                    "name":curr.name,
                    w:curr.w, //宽度
                    h:curr.h, //高度
                    x:curr.x,//x位置
                    y:curr.y,//y位置
                    node:curr.node
                };
            }
            for(var k in lineMap){
                var fromId = k.split('_')[0];
                var toId = k.split('_')[1];
                if(!map4tree[toId].parentIds){
                    map4tree[toId].parentIds = [];
                }
                if(!map4tree[fromId].node.lineMap){
                    map4tree[fromId].node.lineMap = {};
                }

                map4tree[fromId].node.lineMap[k] = lineMap[k] ;

                map4tree[toId].parentIds.push(fromId);
                map4tree[toId].parentId = map4tree[toId].parentIds.join('_');
            }
            var treeMap =  com.oui.TreeMap.newTreeMap({
                rootIds:rootIds,
                ids:ids,
                map:map4tree
            });
            return treeMap;
        },
        treeMap2FlowJson:function(){
            var treeMap = this.treeMap;
            var ids = treeMap.ids||[];
            var rootIds = treeMap.rootIds ||[];
            var map = treeMap.map;
            var map4flow = {};
            var lineMap = {};
            var lineIds = [];
            var json = {
                ids:ids,
                rootIds:rootIds,
                lineIds:lineIds,
                map:map4flow,
                lineMap:lineMap
            };
            for(var k in map ){
                var curr = map[k];
                var currLineIds = [];
                var tempNode = oui.parseJson(oui.parseString(curr.node));
                tempNode['lineMap'] = null;
                delete tempNode['lineMap'];
                map4flow[k] = {
                    "id":curr.id,
                    nodeType:curr.nodeType,//节点类型
                    "name":curr.name,
                    w:curr.w, //宽度
                    h:curr.h, //高度
                    x:curr.x,//x位置
                    y:curr.y,//y位置
                    node:tempNode
                };
                oui.eachArray(curr.childIds,function(cid){
                    currLineIds.push(curr.id+'_'+cid);
                    lineIds.push(curr.id+'_'+cid);
                    if(!curr.node.lineMap){
                        curr.node.lineMap = {};
                    }
                    if(!curr.node.lineMap[curr.id+'_'+cid]){
                        curr.node.lineMap[curr.id+'_'+cid] = {
                            id:curr.id+'_'+cid,
                            fromId:curr.id,
                            toId:cid,
                            lineType:''
                        };
                    }
                    lineMap[curr.id+'_'+cid] = curr.node.lineMap[curr.id+'_'+cid];

                });
                map4flow[k].lineIds = currLineIds;
            }
            return oui.parseString(json);

        },
        load:function(param,callback){
            var me = this;
            oui.getData(me.data.loadFlowUrl,param,function(res){
                if(res.success){
                    me.data.flow = res.flow;
                    me.data.saveFlowUrl = res.flow.extraAttrs.saveUrl||'';

                    //相关加载资源
                    oui.getTop().oui.setPageParam('oui_process_activity_loadPageDesignUrl',res.flow.extraAttrs.loadPageDesignUrl);
                    oui.getTop().oui.setPageParam('oui_process_activity_queryPageModelsUrl',res.flow.extraAttrs.queryPageModelsUrl);
                    oui.getTop().oui.setPageParam('oui_process_queryPageFieldsByFormIdsUrl',res.flow.extraAttrs.queryPageFieldsByFormIdsUrl);
                    me.data.processConfig = res.flow.extraAttrs.processConfig;

                    //if(!me.data.flow.json){
                    //    me.init4emptyNodes(param.id);
                    //}else{
                    //    me.treeMap =  me.flowJson2TreeMap();
                    //}
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...',function(err){
                oui.getTop().oui.alert(err);
            });
        },
        saveDesign:function(success){
            var me = this;
            me.data.flow.json = oui.parseString(me.treeMap2FlowJson());
            oui.postData(me.data.saveFlowUrl,{
                flow:me.data.flow
            },function(res){
                if(res.success){
                    success&&success();
                }else if(res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('保存失败');
                }
            });
        },
        event2save:function(){
            var me = this;
            me.saveDesign(function(){
                var dialog = oui.getTop().oui.alert('保存成功');
                setTimeout(function(){
                    dialog.hide();
                },800);
            });
        },
        hideMenu:function(){
            $('.node', '.flowchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '.flowchart').removeClass('allowedDropTarget');
            $('.second-menu').remove();
        },
        /** 绑定拖拽事件****/
        bindEvents:function(){
            var me = this;
            if(me.canEdit) {
                me.dragData = {};
                $(document).on('dragstart', '.flowchart .node', function (e) {
                    $('.node', '.flowchart').removeClass('allowedDrop');
                    $('.allowedDropTarget', '.flowchart').removeClass('allowedDropTarget');
                    me.dragData.fromNodeId = '';
                    me.dragData.toNodeId = '';
                    me.dragData.timer4dragend = null;
                    var nodeId = $(e.target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    me.dragData.fromNodeId = nodeId;
                    me.hideMenu();

                });
                $(document).on('dragover', '.flowchart .node', function (e) {
                    e.preventDefault();
                    var nodeId = $(e.target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    //console.log('dragover:'+nodeId);

                    //$(e.target).addClass('');
                });
                $(document).on('dragend', '.flowchart .node', function (e) {
                    var nodeId = $(e.target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    if (me.dragData.timer4dragend) {
                        try {
                            clearTimeout(me.dragData.timer4dragend);
                        } catch (err) {
                        }
                        me.dragData.timer4dragend = null;
                    }
                    me.dragData.timer4dragend = setTimeout(function () {
                        console.log('drag end,from:' + me.dragData.fromNodeId + ',to:' + me.dragData.toNodeId);

                        $('.node', '.flowchart').removeClass('allowedDrop');
                        $('.allowedDropTarget', '.flowchart').removeClass('allowedDropTarget');

                        if (me.dragData.fromNodeId == me.dragData.toNodeId) {
                            return;
                        }
                        if(!me.treeMap.isBrothers(me.dragData.fromNodeId, me.dragData.toNodeId)){
                            return ;
                        }
                        me.dragEnd(me.dragData.fromNodeId, me.dragData.toNodeId);

                        me.dragData.timer4dragend = null;
                    }, 1);

                });
                $(document).on('drop', function (e) {
                    var target = e.target;
                    if (!$(target).hasClass('node')) {
                        try {
                            target = $(target).closest('.node')[0];
                        } catch (err) {
                        }
                        if (!target) {
                            return;
                        }
                    }
                    var nodeId = $(target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    me.dragData.toNodeId = nodeId;
                    //console.log(e);
                    //console.log('drop:'+nodeId);
                });
                /* 全局事件绑定，点击空白处关闭菜单*****/
                $(document).on('mousedown',function(e){
                    if ($(e.target).closest('.node').length) {
                        return;
                    }
                    if($(e.target).closest('.second-menu').length || ($(e.target).is('.second-menu'))){
                        return ;
                    }
                    me.hideMenu();
                });
                try{
                    $(document).off('mousedown', '.flow-graph-content');
                }catch(err){
                }
                //.flow-graph-content
                $(document).on('mousedown', '.flow-graph-content', function (e) {
                    var $this = $('.flowchart');
                    if ($(e.target).closest('.node').length) {
                        $this.data('panning', false);
                        //e.preventDefault();
                        return;
                    } else {
                        $this.css('cursor', 'move').data('panning', true);

                    }
                    var lastX = 0;
                    var lastY = 0;
                    var lastTf = $this.css('transform');
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
                        var lastTf = $this.css('transform');
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
                    var $chart = $('.flowchart');
                    if(!$chart){
                        return ;
                    }
                    if(!$chart.length){
                        return ;
                    }
                    if ($chart.data('panning')) {
                        $chart.css('cursor', 'default');
                        $(this).off('mousemove');
                        $chart.data('panning', false);
                    }
                });
            }

        },
        /**
         * 根据节点 和树对象刷新某个节点和节点下面的所有节点
         * @node
         * @treeMap
         * ***/
        refreshByNodeId:function(nodeId,treeMap){
            var view = oui.getById('view-flow');
            var html = view.getHtmlByTplId('flow-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','.flowchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            var view = oui.getById('view-flow');
            view.render();
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
        /** 数组转treeMap ***/
        array2flowTreeMap:function(arr){
            var me = this;
            var treeMap = com.oui.TreeMap.array2treeMap(arr,'id','parentId','name',true);
            return treeMap;
        },
        /* treeMap转数组***/
        treeMap2array:function(treeMap){
            var me = this;
            var arr = com.oui.TreeMap.treeMap2array(treeMap);
            return arr;
        },
        /** 数据定义****/
        data: {},
        /** 数据返回***/
        getData: function () {
            return FlowGraph.data;
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
            var view = oui.getById('view-flow');
            var $node = $('.node[node-id='+targetNodeId+']','.flowchart');
            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu' ).remove();
            $('.flowchart').closest('.flow-graph-content').append(html);
            oui.follow4fixed($node[0],$('.second-menu')[0],true);
        },

        event2showMenu:function(cfg){
            var me = this;
            if(!me.canEdit){
                return ;
            }
            if(me.isEditName){
                return;
            }
            if($(cfg.e.target).is('input')){
                return ;
            }
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('view-flow');
            $('.allowedDrop','.flowchart').removeClass('allowedDrop');
            $('.second-menu' ).remove();
            var tplId ='node-menu-tpl';
            var node = me.treeMap.findNode(nodeId);
            if(node.prevId ){
                tplId = 'node-menu4join-tpl';
            }else if(me.treeMap.isRoot(nodeId)){
                tplId='node-menu-start-tpl';//开始节点
            }


            var html = view.getHtmlByTplId(tplId,{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $('.flowchart').closest('.flow-graph-content').append(html);
            oui.follow4fixed(cfg.el,$('.second-menu')[0],true);

        },
        event2menuAction:function(cfg){
            console.log(cfg,'页面2')
            cfg.e.stopPropagation&&cfg.e.stopPropagation();
            var me = this;
            var menuId = $(cfg.el).attr('menu-action-id');
            var nodeId = $(cfg.el).attr('node-id');
            var targetNodeId = $(cfg.el).attr('target-node-id');
            var treeMap = me.treeMap;
            var node = treeMap.findNode(nodeId);
            var targetNode = null;
            if(targetNodeId){
                targetNode = treeMap.findNode(targetNodeId);
            }
            me.menuActionEnum[menuId]&&me.menuActionEnum[menuId].action(node,treeMap,me,targetNode);
            var notsaveIds = 'edit,interfaceSettings,hideMenu'.split(',');
            if(me.menuActionEnum[menuId]&&(notsaveIds.indexOf(menuId)<0)){ //需要自动保存
                me.saveDesign();
            }
            $('.allowedDrop','.flowchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            return false;
        },
        event2editNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            if($(cfg.e.target).is('input')){
                return ;
            }
            me.isEditName = true;
            var view = oui.getById('view-flow');
            var html = view.getHtmlByTplId('node-name-edit-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $(cfg.el).attr('draggable',false);
            $(cfg.el).append(html);
            $(cfg.el).find('.title').hide();
            $(cfg.el).find('input').focus();
            me.hideMenu();
        },
        event2graphSetting:function(cfg){
            //流程属性设置

        },


        event2updateCurrNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            me.treeMap.updateNodeName(nodeId,$(cfg.el).val());
            me.isEditName = false;
            me.saveDesign(function(){
                me.refreshByRoot(me.treeMap);
            });
        },
        /*****
         * 渲染组织机构图的放大或者缩小渲染
         */
        renderOrgChartScale:function(count){
            var me = this;
            var $chart = $('.flowchart');
            var lastTf = $chart.css('transform')||'none';
            //matrix(0.851172, 0, 0, 0.851172, 0, 0)
            if(lastTf.indexOf('matrix')>-1){
                var str = lastTf.substring(lastTf.indexOf('(')+1,lastTf.indexOf(')'));
                var arr = str.split(',');
                var value= parseFloat(arr[0]);
                var endValue = parseFloat(arr[2]);
                if(value>1.5){
                    value = 1.5;
                }
                if(value<0.5){
                    value = 0.5;
                }
                var posX =1;
                var posY = 50;
                try{
                    posX = parseFloat(arr[4]);
                    posY = parseFloat(arr[5]);
                }catch(err){
                    posX =1;
                    posY = 50;
                }
                lastTf = 'matrix('+value+',0,0,'+value+','+posX+','+posY+')';
            }
            me.scale = 1+(count<0?-0.1:0.1);
            if (lastTf === 'none') {
                $chart.css('transform', 'scale(' + me.scale + ',' +me.scale + ')');
            } else {
                if (lastTf.indexOf('3d') === -1) {
                    $chart.css('transform', lastTf + ' scale(' + me.scale + ',' + me.scale + ')');
                } else {
                    $chart.css('transform', lastTf + ' scale3d(' + me.scale + ',' + me.scale + ', 1)');
                }
            }
        },
        event2small:function(cfg){
            var me = this;
            me.renderOrgChartScale(-1);
        },
        event2big:function(cfg){
            var me = this;
            me.renderOrgChartScale(1);
        },
        /** 改变流程图显示方向****/
        event2direction:function(){
            var me = this;
            if(me.treeMap.direction&&me.treeMap.direction=='l2r'){
                me.treeMap.direction='';
            }else{
                me.treeMap.direction='l2r';
            }
            me.refreshByRoot(me.treeMap);
        },
        /***
         *
         * @param cfg
         */
        event2exportGraph:function(cfg){

            var $chartContainer = $('.flowchart');
            var me = this;
            var treeMap = me.treeMap;
            var name = me.data.flowName+'.png';
            com.oui.TreeMap.exportGraph(treeMap,$chartContainer,name,function(){
            });
        },

        event2ToggleExpand:function(cfg){
            cfg.e.stopPropagation&&cfg.e.stopPropagation();
            var me = this;
            var isRootChildrenUnExpand = me.isRootChildrenUnExpand;
            var root = me.treeMap.findRoot();
            root.unExpand= false;
            if(isRootChildrenUnExpand){
                me.isRootChildrenUnExpand = false;
                $(cfg.el).removeClass('flowToolbar-group-icon-open');
                $(cfg.el).addClass('flowToolbar-group-icon-close');
                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.expandChildren(ids[i]);
                }
            }else{
                me.isRootChildrenUnExpand = true;
                $(cfg.el).removeClass('flowToolbar-group-icon-close');
                $(cfg.el).addClass('flowToolbar-group-icon-open');

                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.unExpandChildren(ids[i]);
                }
            }
            me.refreshByRoot(me.treeMap);
        },
        /** 这是方法****/
        test: function () {
            alert('hello test');
        }
    };
    FlowGraph = oui.biz.Tool.crateOrUpdateClass(FlowGraph);
}());



