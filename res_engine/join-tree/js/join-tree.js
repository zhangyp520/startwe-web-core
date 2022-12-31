!(function (win, $) {

    var JoinTreeController = {
        "package": "com.startwe.models.jointree.web",//com.startwe.models.jointree.web.JoinTreeController
        "class": "JoinTreeController",
        data:{
        },
 
        init:function(){ 
            var me = this;
            me.PortalController = com.startwe.models.portal.web.PortalController;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'join-tree',oui.parseJson(oui.parseString(urlParams)));
            me.data.clickName = oui.os.mobile?'tap':'click';

            me.data.project = {
            };
            me.nodeTypeEnum = {
                mainForm:{
                    name:'mainForm'
                },
                field:{
                    name:'field'
                },
                form:{
                    name:'form'
                }
            };
            me.menuActionEnum = {
                edit:{
                    //别名定义
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var name = node.node.varName;
                        oui.getTop().oui.showInputDialog('编辑名称',function(v){
                            if(node.node.varCount ==1){
                                node.node.varName = v||(node.node.formName);
                            }else{
                                node.node.varName = v||(node.node.formName+'_'+node.node.varCount);
                            }
                            orgGraph.refreshByNodeId(node.id,treeMap);
                            me.refreshTableVarCount();//刷新表变量并同步
                        },[{type:"text",value:name}]);
                    }
                },
                selectRootRelationForm:{ //只提供关联的字段可选
                    display:'通过关联字段选择关系表', //根节点处理
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var formId = node.node.formId;
                        var items = me.page.fields;
                        //过滤掉根节点下已经选择的关系字段对应的关系表
                        var nodes = treeMap.findChildren(node.id); //获取所有子节点
                        var fields= [];
                        oui.eachArray(items,function(item){
                            var flag = true;
                            oui.eachArray(nodes,function(temp){
                                if(item.value == temp.node.value){
                                    flag = false;
                                    return false;
                                }
                            });
                            if(flag){
                                var curr = oui.parseJson(oui.parseString(item));

                                curr.display =  item.fieldName+"->"+item.otherAttrs.association.targetFormName;
                                fields.push(curr);
                            }
                        });
                        oui.getTop().oui.showOptionsDialog({
                            isShowSearch:true,

                            data:fields,
                            confirm:function(value,selects,obj){//确定后回填到当前配置上
                                console.log(value);
                                console.log(selects);
                            
                                //遍历产生多个节点
                                oui.eachArray(selects,function(select){
                                    var associationField = oui.parseJson(oui.parseString(select.otherAttrs.association||{}));
                                    associationField.id = treeMap.newId();
                                    associationField.parentId =node.id;
                                    associationField.name = select.fieldName;
                                    associationField.nodeType = me.nodeTypeEnum.field.name;
                                    associationField.value = select.value;
                                    associationField.required = select.otherAttrs.required;
                                    treeMap.addNode(associationField); //添加字段节点
                                    var formMap = me.formMap ||{};
                                    var fields = formMap[associationField.targetFormId]||[];

                                    var tempArr = [];
                                    oui.eachArray(fields,function(item){
                                        var temp = oui.parseJson(oui.parseString(item));
                                        temp.value = associationField.targetFormId+"_"+item.fieldId;
                                        temp.display =item.fieldName+'['+item.formName+']';
                                        tempArr.push(temp);
                                    });
                                    var queryFields = oui.parseJson(oui.parseString(tempArr));
                                    var orderFields = oui.parseJson(oui.parseString(tempArr));
                                    var conditionFields = oui.parseJson(oui.parseString(tempArr));
                                    var dynamicConditionFields = oui.parseJson(oui.parseString(tempArr));

                                    var associationForm = {
                                        id:treeMap.newId(),
                                        parentId:associationField.id,
                                        nodeType: me.nodeTypeEnum.form.name,
                                        formId:associationField.targetFormId,
                                        queryFields:queryFields,
                                        orderFields:orderFields,
                                        conditionFields:conditionFields,
                                        dynamicConditionFields:dynamicConditionFields,
                                        formName:associationField.targetFormName,
                                        name : associationField.targetFormName
                                    };
                                    treeMap.addNode(associationForm); //添加表单节点
                                });
                                me.refreshTableVarCount();//刷新表变量并同步 
                                //刷新当前节点和下面的节点列表
                                orgGraph.refreshByNodeId(treeMap.rootIds[0],treeMap);


                            }
                        });

                    }
                },
                selectRelationForm:{ //只提供关联的字段可选
                    display:'通过关联字段选择关系表', //根节点处理
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var formId = node.node.formId; 
                        //根据当前表单查询
                        var queryPageAssociationFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageAssociationFieldsUrl;//查询页面字段列表
                        oui.postData(queryPageAssociationFieldsUrl,{
                            formId:formId
                        },function(res){
                            var items =res.fields||[];
                            var nodes = treeMap.findChildren(node.id); //获取所有子节点
                            var fields= [];
                            oui.eachArray(items,function(item){
                                var flag = true;
                                oui.eachArray(nodes,function(temp){
                                    if(item.value == temp.node.value){
                                        flag = false;
                                        return false;
                                    }
                                });
                                if(flag){
                                    var curr = oui.parseJson(oui.parseString(item));

                                    curr.display =  item.fieldName+"->"+item.otherAttrs.association.targetFormName;
                                    fields.push(curr);
                                }
                            });
                            oui.getTop().oui.showOptionsDialog({
                                isShowSearch:true,

                                data:fields,
                                confirm:function(value,selects,obj){//确定后回填到当前配置上
                                    console.log(value);
                                    console.log(selects);
                                    //遍历产生多个节点
                                    oui.eachArray(selects,function(select){
                                        var associationField = oui.parseJson(oui.parseString(select.otherAttrs.association||{}));
                                        associationField.id = treeMap.newId();
                                        associationField.parentId =node.id;
                                        associationField.name = select.fieldName;
                                        associationField.nodeType = me.nodeTypeEnum.field.name;
                                        associationField.value = select.value;
                                        associationField.required = select.otherAttrs.required;
                                        treeMap.addNode(associationField); //添加字段节点


                                        var formMap = me.formMap ||{};
                                        var fields = formMap[associationField.targetFormId]||[];

                                        var tempArr = [];
                                        oui.eachArray(fields,function(item){
                                            var temp = oui.parseJson(oui.parseString(item));
                                            temp.value = associationField.targetFormId+"_"+item.fieldId;
                                            temp.display =item.fieldName+'['+item.formName+']';
                                            tempArr.push(temp);
                                        });
                                        var queryFields = oui.parseJson(oui.parseString(tempArr));
                                        var orderFields = oui.parseJson(oui.parseString(tempArr));
                                        var conditionFields = oui.parseJson(oui.parseString(tempArr));
                                        var dynamicConditionFields = oui.parseJson(oui.parseString(tempArr));


                                        var associationForm = {
                                            id:treeMap.newId(),
                                            parentId:associationField.id,
                                            nodeType: me.nodeTypeEnum.form.name,
                                            formId:associationField.targetFormId,
                                            queryFields:queryFields,
                                            orderFields:orderFields,
                                            conditionFields:conditionFields,
                                            dynamicConditionFields:dynamicConditionFields,
                                            formName:associationField.targetFormName,
                                            name : associationField.targetFormName
                                        };
                                        treeMap.addNode(associationForm); //添加表单节点

                                    });
                                    me.refreshTableVarCount();//刷新表变量并同步
                                    //刷新当前节点和下面的节点列表
                                    orgGraph.refreshByNodeId(treeMap.rootIds[0],treeMap);

                                }
                            });
                        },function(res){
                        },'加载中...');
                    }
                },
                removeAll:{ //删除当前和所有子孙
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        treeMap.removeNodeAll(node);
                        me.refreshTableVarCount();//刷新表变量并同步
                        orgGraph.refreshByNodeId(treeMap.rootIds[0],treeMap);

                    }
                },
                removeAllByParent:{ //删除父亲节点和父亲节点下的所有
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        var parentNode = treeMap.findNode(parentId);
                        if(!parentNode.parentId){
                            return ;
                        }
                        var parId = parentNode.parentId;
                        treeMap.removeNodeAll(parentNode);
                        me.refreshTableVarCount();//刷新表变量并同步
                        orgGraph.refreshByNodeId(treeMap.rootIds[0],treeMap);
                    }
                },
                /*
                 <div class="menu-text" node-id="{{nodeId}}" menu-action-id="setQueryFields" oui-e-{{treeMap.clickName}}="event2menuAction">
                 设置列表查询字段
                 </div>
                 <div class="menu-text" node-id="{{nodeId}}" menu-action-id="setConditionFields" oui-e-{{treeMap.clickName}}="event2menuAction">
                 设置固定查询条件字段
                 </div>
                 <div class="menu-text" node-id="{{nodeId}}" menu-action-id="setDynamicConditionFields" oui-e-{{treeMap.clickName}}="event2menuAction">
                 设置动态查询条件字段
                 </div>
                 */
                setDynamicConditionFields:{
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var queryPageFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageFieldsUrl;//查询页面字段列表
                        var curr = node;
                        oui.postData(queryPageFieldsUrl,{
                            requireComplexFields:true,
                            formId:node.node.formId
                        },function(res){
                            var items =res.fields||[]; //id,name,bizId
                            var fields = [];
                            var value ='';
                            var values = [];
                            var queryFields = node.node.dynamicConditionFields||[];
                            oui.eachArray(queryFields,function(item){
                                values.push(item.value);
                            });
                            value = values.join(',');
                            oui.eachArray(items,function(item){
                                var displayForm='';
                                if(curr.node.varCount ==1){
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName);
                                }else{
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName+'_'+curr.node.varCount+'');
                                }
                                var temp = oui.parseJson(oui.parseString(item));
                                temp.value = node.node.formId+"_"+item.id;
                                temp.display =item.name+'['+displayForm+']';
                                fields.push(temp);
                            });
                            oui.getTop().oui.showOptionsDialog({
                                title:'选择动态查询条件字段',
                                isShowSearch:true,
                                value:value,
                                data:fields,
                                confirm:function(value,selects,obj){//确定后回填到当前配置上
                                    node.node.dynamicConditionFields = selects;
                                    me.refreshTableVarCount();

                                }
                            });
                        },function(res){
                        },'加载中...');
                    }
                },
                //设置可排序的字段
                setCanOrderFields:{
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var queryPageFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageFieldsUrl;//查询页面字段列表
                        var curr = node;
                        oui.postData(queryPageFieldsUrl,{
                            formId:node.node.formId
                        },function(res){
                            var items =res.fields||[]; //id,name,bizId
                            var fields = [];
                            var value ='';
                            var values = [];
                            var queryFields = node.node.orderFields||[];
                            oui.eachArray(queryFields,function(item){
                                values.push(item.value);
                            });
                            value = values.join(',');
                            oui.eachArray(items,function(item){
                                var displayForm='';
                                if(curr.node.varCount ==1){
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName);
                                }else{
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName+'_'+curr.node.varCount+'');
                                }
                                var temp = oui.parseJson(oui.parseString(item));
                                temp.value = node.node.formId+"_"+item.id;
                                temp.display =item.name+'['+displayForm+']';
                                fields.push(temp);

                            });
                            oui.getTop().oui.showOptionsDialog({
                                title:'选择可排序字段',
                                isShowSearch:true,
                                value:value,
                                data:fields,
                                confirm:function(value,selects,obj){//确定后回填到当前配置上
                                    node.node.orderFields = selects;
                                    me.refreshTableVarCount();

                                }
                            });
                        },function(res){
                        },'加载中...');
                    }
                },
                setConditionFields:{
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        //TODO 处理条件
                        var queryPageFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageFieldsUrl;//查询页面字段列表
                        var curr = node;
                        oui.postData(queryPageFieldsUrl,{
                            formId:node.node.formId,
                            requireComplexFields:true
                        },function(res){
                            var items =res.fields||[]; //id,name,bizId
                            var fields = [];
                            var value ='';
                            var values = [];
                            var queryFields = node.node.conditionFields||[];
                            oui.eachArray(queryFields,function(item){
                                values.push(item.value);
                            });
                            value = values.join(',');
                            oui.eachArray(items,function(item){
                                var temp = oui.parseJson(oui.parseString(item));

                                var displayForm ='';
                                if(curr.node.varCount ==1){
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName);
                                }else{
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName+'_'+curr.node.varCount+'');
                                }
                                temp.display = item.name+'['+ displayForm+']';
                                temp.value = node.node.formId+"_"+item.id;
                                fields.push(temp);
                            });
                            oui.getTop().oui.showOptionsDialog({
                                title:'选择固定条件字段',
                                isShowSearch:true,
                                value:value,
                                data:fields,
                                confirm:function(value,selects,obj){//确定后回填到当前配置上
                                    node.node.conditionFields = selects;
                                    me.refreshTableVarCount();
                                }
                            });
                        },function(res){
                        },'加载中...');
                    }
                },
                setQueryFields:{
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var curr = node;
                        var queryPageFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageFieldsUrl;//查询页面字段列表
                        oui.postData(queryPageFieldsUrl,{
                            formId:node.node.formId
                        },function(res){
                            var items =res.fields||[]; //id,name,bizId
                            var fields = [];
                            var value ='';
                            var values = [];
                            var queryFields = node.node.queryFields||[];
                            oui.eachArray(queryFields,function(item){
                                values.push(item.value);
                            });
                            value = values.join(',');
                            oui.eachArray(items,function(item){
                                var displayForm= '';
                                if(curr.node.varCount ==1){
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName);
                                }else{
                                    displayForm= curr.node.varName?(''+curr.node.formName+' as '+curr.node.varName):(curr.node.formName+'_'+curr.node.varCount+'');
                                }
                                var temp = oui.parseJson(oui.parseString(item));
                                temp.value = node.node.formId+"_"+item.id;
                                temp.display =item.name+'['+displayForm+']';
                                fields.push(temp);
                            });
                            oui.getTop().oui.showOptionsDialog({
                                title:'选择查询字段',
                                isShowSearch:true,
                                value:value,
                                data:fields,
                                confirm:function(value,selects,obj){//确定后回填到当前配置上
                                    node.node.queryFields = selects;
                                    me.refreshTableVarCount();
                                }
                            });
                        },function(res){
                        },'加载中...');
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
   
            
            var pageId =oui.getTop().com.oui.absolute.AbsoluteDesign.dialog4relationTables.attr('pageId'); //获取到 页面id
            //根据页面id 获取 页面相关业务信息，和关联的字段列表
            var queryPageAssociationFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageAssociationFieldsUrl;//查询页面字段列表
            //默认查询所有表单的映射字段 
            oui.postData(queryPageAssociationFieldsUrl,{
                formId:pageId
            },function(res){
                me.page ={
                    id:pageId,
                    name:res.name,
                    bizId:res.bizId,
                    fields:res.fields||[]
                };
                me.initCallback();
            },function(res){
                me.initCallback();
            },'加载中...');


        },
        findNodeName:function(id){
            var me =this;
            var node = me.treeMap.findNode(id);
            if(node.node.nodeType =='form' || node.node.nodeType=='mainForm'){
                if(node.node.varName){
                    return node.node.varName;
                }else{
                    if(node.node.varCount&&node.node.varCount==1){
                        return node.node.formName;
                    }else{
                        return node.node.formName+'_'+node.node.varCount;
                    }
                }
            }else{
                return node.node.name;
            }
        },
        initCallback:function(){
            var me = this;
            me.page = me.page ||{};
            var page = me.page;
         
            var relationTablesTreeJson = oui.getTop().com.oui.absolute.AbsoluteDesign.dialog4relationTables.attr('relationTablesTreeJson'); 
            console.info(relationTablesTreeJson,'relationTablesTreeJson')
            var relationTablesTree = oui.parseJson(relationTablesTreeJson);
            var isNew4first = false;
            if(!oui.isEmptyObject(relationTablesTree)){
                relationTablesTree.map[relationTablesTree.rootIds[0]].formName=page.name;
                relationTablesTree.map[relationTablesTree.rootIds[0]].node.formName=page.name;

                me.treeMap = me.newTreeMap(relationTablesTree,'id','parentId','name');
            }else{

                me.treeMap = me.array2orgTreeMap([{
                    id:page.id,
                    name:page.name,
                    formId:page.id,
                    formName:page.name,
                    varCount:1,
                    parentId:null,
                    nodeType:me.nodeTypeEnum.mainForm.name
                }],'id','parentId','name');
                isNew4first = true;
            }
  
            template.helper("JoinTreeController",this);
            me.refreshTableVarCount();//初始化时 就刷新变量配置
            oui.parse();
            me.bindEvents();
            me.loadFormMap(isNew4first);

        },
        loadFormMap:function(isNew4fisrt){
            var me = this;
            var queryPageFieldsUrl = oui.getTop().com.oui.absolute.AbsoluteDesign.paramCfg.params.queryPageFieldsUrl;//查询页面字段列表
            oui.postData(queryPageFieldsUrl,{
                formId:me.page.id,
                requireComplexFields:true,
                requireAssociationFormsAndFields:true
            },function(res){
                me.formMap = res.formMap||{};
                if(isNew4fisrt){
                    var formMap = me.formMap ||{};
                    var fields = formMap[me.page.id]||[];

                    var tempArr = [];
                    oui.eachArray(fields,function(item){
                        var temp = oui.parseJson(oui.parseString(item));
                        temp.value = item.formId+"_"+item.fieldId;
                        temp.display =item.fieldName+'['+item.formName+']';
                        tempArr.push(temp);
                    });
                    var queryFields = oui.parseJson(oui.parseString(tempArr));
                    var orderFields = oui.parseJson(oui.parseString(tempArr));
                    var conditionFields = oui.parseJson(oui.parseString(tempArr));
                    var dynamicConditionFields = oui.parseJson(oui.parseString(tempArr));
                    var node = me.treeMap.map[me.treeMap.rootIds[0]].node;
                    node.queryFields = queryFields;
                    node.orderFields = orderFields;
                    node.conditionFields = conditionFields;
                    node.dynamicConditionFields = dynamicConditionFields;
                    me.refreshTableVarCount();
                }
            },function(res){
            },'加载中...');
        },
        /***
         * 刷新查询表变量
         * @returns {*}
         */
        refreshTableVarCount:function(){
            var me = this;
            var treeMap = me.treeMap;
            if(!treeMap){
                return '';
            }
            var rootId = treeMap.rootIds[0];
            var ids = treeMap.findChildIdsAll(rootId); //获取所有子节点
            var cfgTableName = {
            };
            var cfgFieldName = {};
            var cfgFieldBizId = {};

            var cfgFieldName4condition = {};
            var cfgFieldBizId4conditon = {};

            var cfgVarNameApi4condition= {}; //重名处理
            var cfgVarNameApi={};//重名处理
            var varNameApiArr = [];
            var varNameApi4conditionArr = [];
            oui.eachArray([rootId].concat(ids),function(currId){
                var node = treeMap.findNode(currId);
                if(node.node.nodeType=='form' ||node.node.nodeType=='mainForm' ){
                    var count = cfgTableName[node.node.formId];
                    if(!count){
                        cfgTableName[node.node.formId]=1;
                    }else{
                        cfgTableName[node.node.formId] = cfgTableName[node.node.formId]+1;
                    }
                    node.node.varCount = cfgTableName[node.node.formId];
                    var curr = node;
                    if(curr.node.queryFields){
                        oui.eachArray(curr.node.queryFields,function(item){
                            if(!cfgFieldName[item.fieldName]){
                                cfgFieldName[item.fieldName] = 1;
                            }else{
                                cfgFieldName[item.fieldName] = cfgFieldName[item.fieldName] + 1;
                            }
                            if(!item.varName){ //处理字段名称别名

                                if(cfgFieldName[item.fieldName]==1){
                                    item.varName = item.fieldName;
                                }else{
                                    item.varName = item.fieldName+'_'+cfgFieldName[item.fieldName];
                                }
                            }
                            var fieldBizIdKey = item.fieldBizId;
                            if(item.fieldBizId =='id'){
                                fieldBizIdKey ='id_f';
                            }
                            // 处理字段名称变量名
                            if(!item.varName4api){ //处理字段变量名
                                if(!cfgFieldBizId[fieldBizIdKey]){
                                    cfgFieldBizId[fieldBizIdKey] =1;
                                }else{
                                    cfgFieldBizId[fieldBizIdKey]=cfgFieldBizId[fieldBizIdKey]+1;
                                }
                                if(cfgFieldBizId[fieldBizIdKey] ==1){
                                    item.varName4api = fieldBizIdKey;
                                }else{
                                    item.varName4api = fieldBizIdKey+"_"+cfgFieldBizId[fieldBizIdKey];
                                }
                            }
                            if(!cfgVarNameApi[item.varName4api]){
                                cfgVarNameApi[item.varName4api]=[];
                            }
                            cfgVarNameApi[item.varName4api].push(item);
                            if(varNameApiArr.indexOf(item.varName4api)<0){
                                varNameApiArr.push(item.varName4api);
                            }
                        });
                    }
                    if(curr.node.dynamicConditionFields){
                        oui.eachArray(curr.node.dynamicConditionFields,function(item){
                            if(!cfgFieldName4condition[item.fieldName]){
                                cfgFieldName4condition[item.fieldName] = 1;
                            }else{
                                cfgFieldName4condition[item.fieldName] = cfgFieldName4condition[item.fieldName] + 1;
                            }
                            if(!item.varName){ //处理字段名称别名

                                if(cfgFieldName4condition[item.fieldName]==1){
                                    item.varName = item.fieldName;
                                }else{
                                    item.varName = item.fieldName+'_'+cfgFieldName4condition[item.fieldName];
                                }
                            }

                            // 处理字段名称变量名
                            if(!item.varName4api){ //处理字段变量名
                                var tempKey = item.fieldBizId;
                                if(tempKey=='id'){
                                    tempKey ='id_f';
                                }
                                if(!cfgFieldBizId4conditon[tempKey]){
                                    cfgFieldBizId4conditon[tempKey] =1;
                                }else{
                                    cfgFieldBizId4conditon[tempKey]=cfgFieldBizId4conditon[tempKey]+1;
                                }
                                if(cfgFieldBizId4conditon[tempKey] ==1){
                                    item.varName4api = tempKey;
                                }else{
                                    item.varName4api = tempKey+"_"+cfgFieldBizId4conditon[tempKey];
                                }
                            }
                            if(!cfgVarNameApi4condition[item.varName4api]){
                                cfgVarNameApi4condition[item.varName4api]=[];
                            }
                            cfgVarNameApi4condition[item.varName4api].push(item);
                            if(varNameApi4conditionArr.indexOf(item.varName4api)<0){
                                varNameApi4conditionArr.push(item.varName4api);
                            }
                        });
                    }
                }else if(node.node.nodeType=='field'){
                    //字段处理
                    var pnode = treeMap.findParent(node.id);
                    var parNode =null;
                    var joinType ='';
                    //处理join类型 left 还是 inner
                    if(pnode.id !=rootId){
                        parNode = treeMap.findParent(pnode.id); //field
                        if(parNode.node.fieldJoinType =='left'){
                            joinType ='left';
                        }
                    }
                    if(node.node.required){
                        if(joinType=='left'){
                            node.node.fieldJoinType = 'left';
                        }else{
                            node.node.fieldJoinType = 'inner';
                        }
                    }else{
                        node.node.fieldJoinType ='left';
                    }
                }
            });
            me.rename4unique(cfgVarNameApi,varNameApiArr);
            me.rename4unique(cfgVarNameApi4condition,varNameApi4conditionArr);
            treeMap.ids = [rootId].concat(ids);//保证遍历顺序

            cfgTableName=null;
            cfgFieldName=null;
            cfgFieldBizId=null;
            cfgFieldName4condition=null;
            cfgFieldBizId4conditon=null;
            cfgVarNameApi=null;
            cfgVarNameApi4condition=null;
            varNameApiArr.length=0;
            varNameApiArr=null;
            varNameApi4conditionArr.length=0;
            varNameApi4conditionArr=null; 
            oui.getTop().com.oui.absolute.AbsoluteDesign.dialog4relationTables.attr('relationTablesTreeJson',oui.parseString(treeMap));
        },
        /**为了唯一命名进行重命名 **/
        rename4unique:function(cfg,uniquArr){
            for(var i in cfg){
                var currArr = cfg[i]||[];
                if(currArr.length>1){
                    var name = i;
                    var count=0;

                    oui.eachArray(currArr,function(item){
                        var newName = '';
                        do{
                            newName = name+'_'+count;
                            if(uniquArr.indexOf(newName)<0){
                                if(count==0){
                                    item.varName4api = name;
                                }else{
                                    item.varName4api = newName;
                                }
                                uniquArr.push(newName);//放入新名字
                                break;
                            }else{
                                count++;
                            }
                        }while(true);
                    });
                }
            }
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
            $(document).on('dragstart','.orgchart .node',function(e){
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
            $(document).on('dragover','.orgchart .node',function(e){
                e.preventDefault();
                var nodeId = $(e.target).attr('node-id');
                if(!nodeId){
                    return ;
                }
                //console.log('dragover:'+nodeId);

                //$(e.target).addClass('');
            });
            $(document).on('dragend','.orgchart .node',function(e){
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
                me.hideMenu();
            });
            try{
                $(document).off('mousedown', '.join-tree-graph');
            }catch(err){
            }
            /*** 拖拽事件处理***/
            $(document).on('mousedown', '.join-tree-graph', function (e) {
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
            $('.node', '.orgchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '.orgchart').removeClass('allowedDropTarget');
            $('.second-menu').remove();
        },

        /**
         * 根据节点 和树对象刷新某个节点和节点下面的所有节点
         * @node
         * @treeMap
         * ***/
        refreshByNodeId:function(nodeId,treeMap){
            var view = oui.getById('join-tree');
            var html = view.getHtmlByTplId('design-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','.orgchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            var view = oui.getById('join-tree');
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
            var view = oui.getById('join-tree');
            var $node = $('.node[node-id='+targetNodeId+']','.orgchart');



            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu').remove();
            $('.orgchart').closest('.join-tree-graph').append(html);
            oui.follow4fixed($node.find('.title')[0],$('.second-menu')[0],true);
        },

        /** 事件处理方法开始......******/

        event2showMenu:function(cfg){
            var me = this;
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('join-tree');
            $('.allowedDrop','.orgchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            var html = view.getHtmlByTplId('node-menu-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $('.orgchart').closest('.join-tree-graph').append(html);
            oui.follow4fixed(cfg.el,$('.second-menu')[0],true);
        },
        event2menuAction:function(cfg){
        console.log(cfg,'页面4')
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
            //if(menuId !='hideMenu'){
            //    //设计已经改变
            //    me.PortalController.changed = true;
            //}
            if(currActionEnum.before){
                var flag = currActionEnum.before(node,treeMap,me,targetNode);
                if(typeof flag =='boolean'){
                    if(!flag){
                        return;
                    }
                }
            }
            var params = {
                projectId:me.data.project.id,
                circleId:me.data.project.circleId
            };
            if(currActionEnum.getApiParams){
                params = $.extend(true,params, currActionEnum.getApiParams(node,treeMap,me,targetNode) );
            }

            if(currActionEnum.api){
                var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),currActionEnum.api);
                var apiMap = me.data.apiMap;

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
            } 
            $('.allowedDrop','.orgchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            return false;
        },
        event2editNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            var view = oui.getById('join-tree');
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
            if(me.data.project.id == nodeId){
                me.data.project.name = $(cfg.el).val();
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
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),'saveDesign');
            var param = {
                projectId:me.data.project.id,
                circleId:me.data.project.circleId,
                treeMap:oui.parseString(me.treeMap)
            };
            oui.postData(me.data.saveDesignUrl||path,param,function(res){
                if(res.success){
                    success&&success();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            },'保存中...');
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
        event2projectMgr:function(){
            var me = this;
            com.oui.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project-list.tpl.html",{
                circleId:me.urlParams.circleId
            });
        }
    };
    JoinTreeController = oui.biz.Tool.crateOrUpdateClass(JoinTreeController);
})(window, jQuery);