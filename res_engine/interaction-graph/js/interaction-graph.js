!(function () {
    var InteractionDesignController = {
        "package": "com.startwe.models.project.web",//com.startwe.models.project.web.InteractionDesignController
        "class": "InteractionDesignController",
        varPrefix:'var',
        init: function () {
            var me = this;
            me.canEdit = true;
            template.helper('InteractionDesignController',this);

            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'interaction-design',oui.parseJson(oui.parseString(urlParams)));

            me.init4menuActionEnums();
            me.data.interactions = [];
            me.data.isShow4Conditions= false;
            me.data.id = id ||"";
            me.data.inputParams=[];
            me.data.outputParams=[];
            me.data.varParams=[];
            me.data.varIndex=0;
            me.init4Global();

            if(id){
                me.data.loadInteractionDesignUrl = urlParams.loadInteractionDesignUrl;
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

                me.init4emptyNodes();
                oui.parse({
                    callback:function(){
                        me.bindEvents();
                    }
                });
            }

        },
        /** 初始化全局变量，用于页面渲染数据模板***/
        init4Global:function(){
            var me = this;
            me.data.global={
                inputParams:{
                    paramKey:'inputParams',
                    title:'输入定义',
                    data:me.data.inputParams
                },
                varParams:{
                    paramKey:'varParams',
                    title:'变量定义',
                    data:me.data.varParams
                },
                outputParams:{
                    paramKey:'outputParams',
                    title:'输出定义',
                    data:me.data.outputParams
                }
            };
        },
        /*******
         * 根据数据类型获取默认控件类型
         *
         * @param dataType
         */
        findDefaultDataTypeEnum:function(dataType){
            var defaultDataType = 'STRING';
            var typeEnum = oui.dataTypeEnum[dataType];
            if(!typeEnum){
                typeEnum = oui.dataTypeEnum[defaultDataType];
            }
            return typeEnum;
        },
        /** 控制规则预览*****/
        showConditionInfoAfter:function(info,obj){
            var me = com.startwe.models.project.web.InteractionDesignController;
            if(me.data.isShow4Conditions){
                $(obj.getEl()).find('.group-condition-preview').show();
            }else{
                $(obj.getEl()).find('.group-condition-preview').hide();
            }
        },
        /*****
         * 根据选择变量字段，获取对应类型进行 条件设置或者赋值设置
         * @param cfg
         * @param condition
         * @param value
         * @returns {Array}
         */
        filterField4SysVar:function (cfg, condition, value) {
            var me = com.startwe.models.project.web.InteractionDesignController;
            var result = [];
            if (!condition) {
                return result;
            }
            var allVars = me.findAllVars();
            //单选,下拉不支持
            if (cfg.controlType === "radio" || cfg.controlType === "singleselect") {
                return result;
            }

            oui.findManyFromArrayBy(allVars,function(item){
                if(item.name == cfg.name) {
                    return ;
                }
                if((item.controlType == cfg.controlType) && (item.dataType == cfg.dataType)){
                    result.push({
                        value:'ctx_var_'+item.name,
                        display:item.title
                    });
                }
            });
            return result;
        },

        /*****
         * 获取所有变量
         * @returns {Array}
         */
        findAllVars:function(){
            var me = this;
            var params = [];
            oui.findManyFromArrayBy(me.data.inputParams,function(item){
                var defaultDataTypeEnum = me.findDefaultDataTypeEnum(item.dataType);
                params.push({
                    title:item.name+' ['+defaultDataTypeEnum.desc+'][输入定义]',
                    dataType:item.dataType,
                    opt:defaultDataTypeEnum.opt||'=',
                    controlType:defaultDataTypeEnum.controlType||'textfield',
                    showType:defaultDataTypeEnum.showType||0,
                    name:item.name
                });
            });
            oui.findManyFromArrayBy(me.data.varParams,function(item){
                var defaultDataTypeEnum = me.findDefaultDataTypeEnum(item.dataType);
                params.push({

                    title:item.name+' ['+defaultDataTypeEnum.desc+'][变量定义]',
                    dataType:item.dataType,
                    opt:defaultDataTypeEnum.opt||'=',
                    controlType:defaultDataTypeEnum.controlType||'textfield',
                    showType:defaultDataTypeEnum.showType||0,
                    name:item.name
                });
            });
            oui.findManyFromArrayBy(me.data.outputParams,function(item){
                var defaultDataTypeEnum = me.findDefaultDataTypeEnum(item.dataType);
                params.push({

                    title:item.name+' ['+defaultDataTypeEnum.desc+'][输出定义]',
                    dataType:item.dataType,
                    opt:defaultDataTypeEnum.opt||'=',
                    controlType:defaultDataTypeEnum.controlType||'textfield',
                    showType:defaultDataTypeEnum.showType||0,
                    name:item.name
                });
            });
            return params;
        },
        findVarsByDataType:function(dataType){
            var me = this;
            var allVars = me.findAllVars();
            var result =[];
            oui.findManyFromArrayBy(allVars,function(item){
                if(item.dataType == dataType){
                    result.push({
                        value: item.name,
                        display:item.title
                    });
                }
            });
            return result;
        },
        /*****
         * 获取参数设置的校验配置
         * @param varName
         * @param paramKey
         * @param index
         */
        findValidate4params:function(varName,paramKey,index){
            var validate ={};
            if(varName=='varName'){
                validate= {
                    require:true,
                    lettersOrNumber:true,
                    failMode: 'msgPosEl',
                    msgPos: 'append',
                    msgPosEl: '#'+varName+'-'+paramKey+'-'+index+'-error'
                };
            }else if(varName =='varFieldType'){
                validate= {
                    require:true,
                    failMode: 'msgPosEl',
                    msgPos: 'append',
                    msgPosEl: '#'+varName+'-'+paramKey+'-'+index+'-error'
                };
            }
            return validate;
        },
        /*****
         * 转换条件值给前端用
         * @param conditions
         */
        transConditions4front:function(conditions){
            var me = this;
            var tempConditions =oui.clone(conditions);
            oui.findManyFromArrayBy(tempConditions,function(item){
                if(item.valueType=='var'){
                    if(item.value){
                        if(item.value.indexOf('ctx_var_')!=0){
                            item.value = 'ctx_var_'+item.value;
                        }
                    }else{
                        item.valueType ='value';
                    }
                }
                if( item.expression&&(item.expression=='or' || item.expression=='and')&&(item.value)){
                    if(typeof item.value =='string'){
                        item.value = oui.parseString(me.transConditions4front(oui.parseJson(item.value)));
                    }else if(typeof item.value=='object'){
                        item.value = me.transConditions4front(item.value);
                    }
                }
            });
            return tempConditions;
        },
        /***
         * 转换条件值给后端用
         * @param conditions
         */
        transConditions4server:function(conditions){
            var me = this;
            var tempConditions =oui.clone(conditions);
            oui.findManyFromArrayBy(tempConditions,function(item){
                item.valueType ='value';
                if(item.value&&((item.value+'').indexOf('ctx_var_')==0)){
                    item.valueType ='var';
                    item.value = item.value.substring('ctx_var_'.length,item.value.length);
                    if(!item.value){
                        item.valueType ='value';
                    }
                }
                if( item.expression&&(item.expression=='or' || item.expression=='and')&&(item.value)){
                    if(typeof item.value =='string'){
                        item.value = oui.parseString(me.transConditions4server(oui.parseJson(item.value)));
                    }else if(typeof item.value=='object'){
                        item.value = me.transConditions4server(item.value);
                    }
                }
            });
            return tempConditions;
        },
        init4menuActionEnums:function(){
            var me = this;
            me.menuActionEnum = {

                addLogic4load:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4load',
                            prevId:'',
                            name:'数据加载逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4remove:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4remove',
                            prevId:'',
                            name:'数据删除逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4update:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4update',
                            prevId:'',
                            name:'数据更新逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4new:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4new',
                            prevId:'',
                            name:'新增逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4batchNew:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4batchNew',
                            prevId:'',
                            name:'批量新增逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4batchUpdate:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4batchUpdate',
                            prevId:'',
                            name:'批量更新逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4batchRemove:{
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4batchRemove',
                            prevId:'',
                            name:'批量删除逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addLogic4query:{//添加查询逻辑资源
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'logic4query',
                            prevId:'',
                            name:'查询逻辑资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },

                addPage:{
                    //添加页面资源
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            nodeType:'page4list',
                            prevId:'',
                            name:'页面资源'
                        };
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                edit:{//编辑节点内容,
                    action:function(node,treeMap,interactionGraph){
                        var view = oui.getById('view-interaction');
                        var resource = node.node.resource; //当前节点 绑定的逻辑资源
                        var config = me.findResourceConfigByNode(node);
                        var resourceTypeName = config.resourceTypeName;
                        var queryResourceUrl = config.queryResourceUrl;
                        var html = view.getHtmlByTplId('node-edit-tpl',{
                            treeMap:treeMap,
                            resourceTypeName:resourceTypeName,
                            resourceType:node.node.nodeType,
                            queryResourceUrl:queryResourceUrl,
                            resource:resource,
                            nodeId:node.id
                        });
                        var dialog = oui.getTop().oui.showHTMLDialog({
                            title:'设置 资源绑定',
                            contentStyle:'width:940px;',
                            content:html,
                            actions: [{
                                cls:'oui-dialog-cancel',
                                text:'取消',
                                action:function(){
                                    dialog&&dialog.hide();
                                    return false;
                                }
                            },{
                                cls:'oui-dialog-ok',
                                text:'确定',
                                action:function(){
                                    var dialogEl = dialog.getEl();
                                    var isCheck = oui.checkForm(dialogEl);
                                    if(!isCheck){
                                        return;
                                    }
                                    var config = oui.getFormValue(dialogEl);
                                    var node4update = config.node;
                                    node.node.name =node4update.name;

                                    var view = oui.getById('resource-temp');
                                    var data =view.getData();
                                    node.node.resource = data.resource;
                                    interactionGraph.refreshByNodeId(node.id,treeMap);
                                    me.saveDesign();
                                    dialog&&dialog.hide();
                                    return false;
                                }
                            }]
                        });
                        oui.getTop().oui.parse({container:dialog.getEl(),callback:function(){

                        }});

                    }
                },

                addParent:{//添加一个新节点 作为当前节点的父节点
                    action:function(node,treeMap,interactionGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            name:'新的节点',
                            parentId:node.parentId||""
                        };
                        var isRefreshRoot = !node.parentId;
                        treeMap.addParentNode(newNode,node); //添加节点
                        if(isRefreshRoot){
                            interactionGraph.refreshByRoot(treeMap);
                        }else{
                            interactionGraph.refreshByNodeId(newNode.parentId,treeMap);
                        }
                    }
                },
                addBrother:{ //在当前节点后面添加一个兄弟节点,考虑顺序调整
                    action:function(node,treeMap,interactionGraph){
                        if(!node.parentId){ //根节点不能添加兄弟节点
                            return ;
                        }
                        var newNode = {
                            id:treeMap.newId(),
                            name:'新的节点',
                            parentId:node.parentId
                        };

                        treeMap.addBrotherNode(newNode,node); //添加节点

                        interactionGraph.refreshByNodeId(node.parentId,treeMap);
                    }
                },
                addLoop:{//添加循环节点
                    action:function(node,treeMap,interactionGraph){

                        var loopStart = {
                            id:treeMap.newId(),
                            name:'循环开始',
                            loopStart:true,
                            parentId:node.id
                        };
                        treeMap.addNode(loopStart); //添加节点
                        var loopEnd = {
                            id:treeMap.newId("join-"),
                            parentId:'',
                            loopEnd:true,
                            prevId:loopStart.id,
                            name:'循环结束'
                        };
                        treeMap.addNode(loopEnd); //添加节点

                        interactionGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                remove:{//删除当前节点
                    action:function(node,treeMap,interactionGraph){
                        //根节点不能删除
                        if(!node.parentId){
                            if(node.childIds&&node.childIds.length==1){
                                //根节点只有一个子节点时，才能删除，将子节点作为根节点
                                treeMap.removeRoot(node);
                                interactionGraph.refreshByRoot(treeMap);
                            }
                        }else{
                            var parentId = node.parentId;
                            treeMap.removeNode(node);
                            interactionGraph.refreshByNodeId(parentId,treeMap);
                        }
                    }
                },
                remove4join:{
                    //join节点提供清除后续节点功能
                    action:function(node,treeMap,interactionGraph){
                        if(node.prevId){//是join节点
                            var childIdsAll = treeMap.findChildIdsAll(node.id);
                            if(childIdsAll.length){
                                for(var i= 0,len=childIdsAll.length;i<len;i++){
                                    treeMap.removeNode(treeMap.findNode(childIdsAll[i]));
                                }
                                interactionGraph.refreshByNodeId(node.prevId,treeMap);
                            }
                        }
                    }
                },
                removeAll:{ //删除当前和所有子孙
                    action:function(node,treeMap,interactionGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        treeMap.removeNodeAll(node);
                        interactionGraph.refreshByNodeId(parentId,treeMap);

                    }
                },
                removeAll4join:{ //删除当前和所有子孙
                    action:function(node,treeMap,interactionGraph){
                        if(node.prevId){//是join节点
                            treeMap.removeNodeAll4join(node);
                            interactionGraph.refreshByNodeId(node.prevId,treeMap);
                        }

                    }
                },
                hideMenu:{
                    action:function(node,treeMap,interactionGraph){

                    }
                },
                /** 对于拖拽处理的两个节点位置交换逻辑 *****/

                //            <!--swap,addParentByTarget,addBrotherByTarget,addChildByTarget,hideMenu4DragEnd -->
                swapSort:{
                    ///交换两个节点的顺序
                    action:function(node,treeMap,interactionGraph,targetNode){
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
                            interactionGraph.refreshByNodeId(node.parentId,treeMap);
                        }

                    }
                },
                swap:{
                    /***
                     * 交换算法， 只变更更 交换 两个节点 的名称而已
                     * @param node
                     * @param treeMap
                     * @param interactionGraph
                     * @param targetNode
                     */
                    action:function(node,treeMap,interactionGraph,targetNode){
                        var id = node.id;
                        var targetId = targetNode.id;


                        var nodeName = treeMap.findNodeName(node.id);
                        var targetNodeName = treeMap.findNodeName(targetNode.id);
                        treeMap.updateNodeName(node.id,targetNodeName);
                        treeMap.updateNodeName(targetNode.id,nodeName);
                        //刷新 分别刷新两个节点的父节点即可
                        if(treeMap.isRoot(node.id) || treeMap.isRoot(targetNode.id)){
                            interactionGraph.refreshByRoot(treeMap);
                        }else{
                            interactionGraph.refreshByNodeId(node.parentId,treeMap);
                            interactionGraph.refreshByNodeId(targetNode.parentId,treeMap);
                        }

                    }
                },
                addChildByTarget:{//将节点添加到目标节点下，作为目标节点的子节点
                    action:function(node,treeMap,interactionGraph,targetNode){
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

                        interactionGraph.refreshByNodeId(targetNode.id,treeMap);
                        interactionGraph.refreshByNodeId(lastParentId,treeMap);
                    }
                },
                hideMenu4DragEnd:{
                    action:function(node,treeMap,interactionGraph,targetNode){

                    }
                }
            };

        },
        onUpdate4interaction:function(outerControl){
            if((outerControl) &&(!outerControl.getValue())){
                //清空节点
                var viewControl = oui.getById('resource-temp');
                var data = viewControl.getData();
                data.resource={};
                viewControl.render();
            }
        },
        /****
         * 根据节点的类型获取 节点资源配置
         * @param node
         * @returns {{}}
         */
        findResourceConfigByNode:function(node){
            var me = this;
            var cfg = {},resourceTypeName;
            var nodeType = node.node.nodeType;
            var queryResourceUrl = me.data['queryResourceUrl2'+nodeType]||'';
            if(nodeType =='page4list'){
                resourceTypeName = '页面';
            }else{
                resourceTypeName = '逻辑';
            }
            cfg.queryResourceUrl = queryResourceUrl;
            cfg.resourceTypeName = resourceTypeName;
            return cfg;
        },
        /***
         * 逻辑选择或者页面设计选择后回调
         * @param result
         * @returns {{dataType: string, data: (Array|*), fillback: Function}}
         */
        resourceSelectCallback:function(result){

            var data = [];
            var serverData = result.resources||[];
            oui.findManyFromArrayBy(serverData,function(item){
                item.value = item.name;
            });
            var dataCfg= {
                dataType:'array', data:serverData, fillback:function(selected){
                    var control = oui.getById('resource-temp');
                    var data =control.getData();
                    data.resource = {
                        id:selected.id,
                        resourceType:selected.resourceType,
                        name:selected.name,
                        inputParams:selected.inputParams||[]
                    };
                    control.render();
                }
            };
            return dataCfg;
        },
        //逻辑选择回调自定义脚本
        interactionSelectCallback:function(result){
            //如果result不是对象数组类型,或者数组元素中没有value属性，
            //则需要重新组织数据数组并给dataCfg.data属性赋值,如dataCfg.data=[{value:'这是真实值'}];
            //array 下拉回填

            //console.log(result);
            /*
             * var config= {
                 name:'testLogic',
                 inputParams:[{dataType:'STRING','name':'hello'}],
                 outputParams:[{dataType:'STRING',name:'hello2'}],
                 paramMap:{
                 hello:'test2',
                 hello2:'test1'
                 }
             };
             */
            var data = [];
            var serverData = result.interactions||[];
            oui.findManyFromArrayBy(serverData,function(item){
                item.value = item.name;
            });
            var me = com.startwe.models.project.web.InteractionDesignController;
            var dataCfg= {
                dataType:'array', data:serverData, fillback:function(selected){
                    var control = oui.getById('resource-temp');
                    var data =control.getData();
                    var nodeId = data.nodeId;
                    var node = me.treeMap.findNode(nodeId);

                    data.resource = {
                        id:selected.id,
                        name:selected.name,
                        inputParams:selected.inputParams||[],
                        outputParams:selected.outputParams||[]
                    };
                    node.node.resource =data.resource;
                    control.render();
                }
            };
            return dataCfg;
        },
        getCurrNodeData:function(nodeId){
            var me = this;
            var node =  me.treeMap.findNode(nodeId);
            return {
                nodeId:nodeId,
                resource:node.node.resource
            };
        },
        init4emptyNodes:function(id){
            var me = this;
            me.data.interactions = [];
            me.data.interactions.push({"id":id||oui.getUUIDLong(),"parentId":null,"sort":0,"name":me.data.name+'-交互设计'});
        },
        load:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'load');
            oui.getData(me.data.loadInteractionDesignUrl||path,param,function(res){
                if(res.success){

                    var data = res.interactionNodes||[];
                    me.data.interactions=oui.parseJson(data);
                    me.data.name = res.name;
                    me.data.projectId = res.projectId||'';


                    me.data.queryResourceUrl2logic4query = res.queryResourceUrl2logic4query||'';
                    me.data.queryResourceUrl2logic4load = res.queryResourceUrl2logic4load||'';
                    me.data.queryResourceUrl2logic4update = res.queryResourceUrl2logic4update||'';
                    me.data.queryResourceUrl2logic4remove = res.queryResourceUrl2logic4remove||'';
                    me.data.queryResourceUrl2logic4new = res.queryResourceUrl2logic4new||'';
                    me.data.queryResourceUrl2logic4batchUpdate = res.queryResourceUrl2logic4batchUpdate||'';
                    me.data.queryResourceUrl2logic4batchRemove = res.queryResourceUrl2logic4batchRemove||'';
                    me.data.queryResourceUrl2logic4batchNew = res.queryResourceUrl2logic4batchNew||'';
                    me.data.queryResourceUrl2page4list = res.queryResourceUrl2page4list||'';
                    me.data.queryResourceUrl2page4load = res.queryResourceUrl2page4load||'';

                    me.data.saveInteractionUrl = res.saveInteractionUrl||'';
                    me.init4Global();
                    if((!me.data.interactions)||(!me.data.interactions.length)){
                        me.init4emptyNodes(param.id);
                    }else{
                        me.data.interactions[0].name= me.data.name+'-交互设计';
                    }
                    me.treeMap = me.array2interactionTreeMap(me.data.interactions,'id','parentId','name',true);
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
            var arr = me.treeMap2array(me.treeMap);
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'save');
            oui.postData(me.data.saveInteractionUrl||path,{
                id:me.data.id,
                inputParams:me.data.inputParams||[],
                outputParams:me.data.outputParams||[],
                varParams:me.data.varParams||[],
                interactionNodes:arr
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
            $('.node', '.interactionchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '.interactionchart').removeClass('allowedDropTarget');
            $('.second-menu').remove();
        },
        /** 绑定拖拽事件****/
        bindEvents:function(){
            var me = this;
            if(me.canEdit) {
                me.dragData = {};
                $(document).on('dragstart', '.interactionchart .node', function (e) {
                    $('.node', '.interactionchart').removeClass('allowedDrop');
                    $('.allowedDropTarget', '.interactionchart').removeClass('allowedDropTarget');
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
                $(document).on('dragover', '.interactionchart .node', function (e) {
                    e.preventDefault();
                    var nodeId = $(e.target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    //console.log('dragover:'+nodeId);

                    //$(e.target).addClass('');
                });
                $(document).on('dragend', '.interactionchart .node', function (e) {
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

                        $('.node', '.interactionchart').removeClass('allowedDrop');
                        $('.allowedDropTarget', '.interactionchart').removeClass('allowedDropTarget');

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
                    if($(e.target).closest('.el-color-dropdown').length || ($(e.target).is('.el-color-dropdown'))){
                        
                        return ;
                    } 
                    me.hideMenu();
                });
                try{
                    $(document).off('mousedown', '.interaction-graph-content');
                }catch(err){
                }
                //.interaction-graph-content
                $(document).on('mousedown', '.interaction-graph-content', function (e) {
                    var $this = $('.interactionchart');
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
                    var $chart = $('.interactionchart');
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
            var view = oui.getById('view-interaction');
            var html = view.getHtmlByTplId('interaction-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','.interactionchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            var view = oui.getById('view-interaction');
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
        array2interactionTreeMap:function(arr){
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
            return InteractionDesignController.data;
        },
        getData4inputParams:function(){
            var me = this;
            return me.data.global.inputParams;
        },
        getData4varParams:function(){
            var me = this;
            return me.data.global.varParams;
        },
        getData4outputParams:function(){
            var me = this;
            return me.data.global.outputParams;
        },
        findDataTypes:function(){
            var me = this;
            if(!me.dataTypeArray){
                me.dataTypeArray = [];
                for(var i in oui.dataTypeEnum){
                    me.dataTypeArray.push({
                        value:oui.dataTypeEnum[i].name,
                        display:oui.dataTypeEnum[i].desc
                    });
                }
            }
            return me.dataTypeArray;
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
            var view = oui.getById('view-interaction');
            var $node = $('.node[node-id='+targetNodeId+']','.interactionchart');
            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu' ).remove();
            $('.interactionchart').closest('.interaction-graph-content').append(html);
            oui.follow4fixed($node[0],$('.second-menu')[0],true);
        },
        newVarName:function(){
            var me = this;
            var name = me.varPrefix+me.data.varIndex;
            me.data.varIndex++;
            return name;
        },
        /** 事件处理方法开始......******/
        /***
         * 添加变量
          * @param cfg
         */
        event2addVar:function(cfg){
            var me = this;
            var paramKey = $(cfg.el).attr('param-key');
            var paramsData = me.data[paramKey]||[];
            paramsData.push({
                name:me.newVarName(),
                dataType:oui.dataTypeEnum.STRING.name
            });
            var view = oui.getById(paramKey+'-view');
            view&&view.render();
        },
        event2addCurrVar:function(cfg){
            var me = this;
            var paramKey = $(cfg.el).attr('param-key');
            var index = $(cfg.el).attr('var-index');
            index = parseInt(index);
            var arr = me.data[paramKey]||[];
            arr.splice(index+1,0,{
                name:me.newVarName(),
                fieldType:oui.fieldTypeEnum.string_type.name
            });
            var view = oui.getById(paramKey+'-view');
            view&&view.render();
        },
        /*****
         * 删除变量列表
         * @param cfg
         */
        event2removeVars:function(cfg){
            var me = this;
            var paramKey = $(cfg.el).attr('param-key');
            me.data[paramKey]= [];
            var view = oui.getById(paramKey+'-view');
            view&&view.render();
        },
        // param-key="{{paramKey}}" var-index="{{index}}" oui-e-click="event2removeCurrVar"
        event2removeCurrVar:function(cfg){
            var me = this;
            var paramKey = $(cfg.el).attr('param-key');
            var index = $(cfg.el).attr('var-index');
            index = parseInt(index);
            var arr = me.data[paramKey]||[];
            arr.splice(index,1);
            var view = oui.getById(paramKey+'-view');
            view&&view.render();
        },
        event2showMenu:function(cfg){
            var me = this;
            if(!me.canEdit){
                return ;
            }
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('view-interaction');
            $('.allowedDrop','.interactionchart').removeClass('allowedDrop');
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
            $('.interactionchart').closest('.interaction-graph-content').append(html);
            oui.follow4fixed(cfg.el,$('.second-menu')[0],true);

        },
        event2menuAction:function(cfg){
            console.log(cfg,'页面3')
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
            $('.allowedDrop','.interactionchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            return false;
        },
        event2editNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            var view = oui.getById('view-interaction');
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
            me.treeMap.updateNodeName(nodeId,$(cfg.el).val());
            me.refreshByNodeId(nodeId,me.treeMap);

        },
        /*****
         * 渲染组织机构图的放大或者缩小渲染
         */
        renderOrgChartScale:function(count){
            var me = this;
            var $chart = $('.interactionchart');
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
         * 导出组织机构图
         * @param cfg
         */
        event2exportGraph:function(cfg){

            var $chartContainer = $('.interactionchart');
            var me = this;
            var treeMap = me.treeMap;
            var name = me.data.name+'.png';
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
                $(cfg.el).removeClass('interactionToolbar-group-icon-open');
                $(cfg.el).addClass('interactionToolbar-group-icon-close');
                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.expandChildren(ids[i]);
                }
            }else{
                me.isRootChildrenUnExpand = true;
                $(cfg.el).removeClass('interactionToolbar-group-icon-close');
                $(cfg.el).addClass('interactionToolbar-group-icon-open');

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
    InteractionDesignController = oui.biz.Tool.crateOrUpdateClass(InteractionDesignController);
}());



