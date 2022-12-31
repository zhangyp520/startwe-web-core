!(function (win, $) {

    var ProjectController4Design = {
        "package": "com.oursui.models.project.web",//com.oursui.models.project.web.ProjectController4Design
        "class": "ProjectController4Design",
        data:{
        },


        init:function(){
            var me = this;
            me.PortalController = com.oursui.models.portal.web.PortalController;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'project-design',oui.parseJson(oui.parseString(urlParams)));

            template.helper("ProjectController4Design",this);
            me.data.clickName = oui.os.mobile?'tap':'click';

            me.data.project = {
            };
            me.nodeTypeEnum = {
                project:{
                    name:'project'
                },
                module:{
                    name:'module'
                },
                app:{
                    name:'app'
                },
                page:{
                    name:'page'
                },
                logic:{
                    name:'logic'
                },
                view:{
                    name:'view'
                }
            };
            me.menuActionEnum = {
                showListPageUrl:{//获取列表页面url
                    action:function(node,treeMap,orgGraph){
                        //获取列表访问地址
                        var url = me.data.showPageUrl;
                        url = oui.addParams(url,{
                            nodeId:node.id,
                            nodeType:'pageList'
                        });

                        oui.getData(url,{},function(res){
                            if(res.success&&res.url){
                                var menuUrl = res.url;

                                var htmlUrl = oui.getContextPath()+'index.html';
                                htmlUrl = oui.addParams(htmlUrl,{
                                    loadMenusUrl:menuUrl
                                });

                                oui.getTop().oui.showInputDialog('获取列表访问地址',function(v){
                                },[{type:"textarea",value:htmlUrl}]);
                            }
                        });
                    }
                },
                showEditPageUrl:{//获取编辑页面url
                   action:function(node,treeMap,orgGraph){
                       var url = me.data.showPageUrl;
                       url = oui.addParams(url,{
                           nodeId:node.id,
                           nodeType:'page'
                       });
                       oui.getData(url,{},function(res){
                           if(res.success&&res.url){

                               var menuUrl = res.url;

                               var htmlUrl = oui.getContextPath()+'index.html';
                               htmlUrl = oui.addParams(htmlUrl,{
                                   loadMenusUrl:menuUrl
                               });
                               oui.getTop().oui.showInputDialog('获取表单访问地址',function(v){
                               },[{type:"textarea",value:htmlUrl}]);
                           }
                       });
                   }
                },

                designPage:{//设计页面
                    action:function(node,treeMap,orgGraph){
                        var id = node.id;
                        orgGraph.showPageDesign(id);
                    }
                },
                designQueryPage:{
                    //设计查询页面
                    action:function(node,treeMap,orgGraph){
                        //后期改造
                        //<oui-include url="res_engine/page_design/pc/page_biz_config.vue.html" type="module"></oui-include>

                    }
                },
                designLogic:{//设计逻辑
                    action:function(node,treeMap,orgGraph){
                        //在portal中添加菜单
                        var menu = {
                            id:'logic-design',
                            menuPath:'circle-list/circle/project-list/project-design/logic-design',
                            parentId:'project-design',
                            icon:'',
                            defaultNotShow:true, //默认不显示在菜单中
                            url:'res_engine/logic-graph/logic-design.tpl.html',
                            scripts:[oui.getContextPath()+'res_engine/logic-graph/js/logic-design-require.js'],
                            openType:'inner', //inner,location,openWindow,htmlDialog,urlDialog
                            display:'逻辑设计'
                        };
                        me.PortalController.addMenu(menu);
                        
                        //执行菜单路径
                        me.PortalController.doActionByMenuConfig(menu,{//参数对象作为url的动态参数
                            id:node.id,//传入 逻辑节点id
                            loadLogicUrl:me.data.loadLogicUrl
                        });
                    }
                },
                interactionDesign:{//应用节点上的功能
                    display:'交互设计',
                    action:function(node,treeMap,orgGraph,target,result){
                        //一个应用可以多个交互，默认是一个
                        var menu = {
                            id:'interaction-design',
                            menuPath:'circle-list/circle/project-list/project-design/interaction-design',
                            parentId:'project-design',
                            icon:'',
                            defaultNotShow:true, //默认不显示在菜单中
                            url:'res_engine/interaction-graph/interaction-design.tpl.html',
                            scripts:[oui.getContextPath()+'res_engine/interaction-graph/js/interaction-design-require.js'],
                            openType:'inner', //inner,location,openWindow,htmlDialog,urlDialog
                            display:'交互设计'
                        };
                        me.PortalController.addMenu(menu);
                        //执行菜单路径
                        me.PortalController.doActionByMenuConfig(menu,{//参数对象作为url的动态参数
                            id:node.id,//传入 逻辑节点id
                            loadInteractionDesignUrl:me.data.loadInteractionDesignUrl
                        });

                    }
                },
                addModule:{
                    api:'addModule',
                    display:'添加模块',
                    getApiParams:function(node,treeMap,orgGraph){
                        var ids = treeMap.ids ||[];
                        var params = {
                            module:{
                                id: treeMap.newId(),
                                parentId:me.data.project.id,
                                name:'新的模块'+(ids.length+1),
                                nodeType:me.nodeTypeEnum.module.name,
                                projectId:me.data.project.id,
                                circleId:me.data.project.circleId
                            }
                        };
                        return params;
                    },

                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var newNode = result.module;
                        treeMap.addNode(newNode); //添加节点
                        //刷新当前节点和下面的节点列表
                        orgGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                editProjectConfig:{
                    //项目配置
                    action:function(node,treeMap,orgGraph,targetNode,result){
                        var url = oui.getContextPath()+'index4vue.html#/res_apps/project/project-config/project-config.vue.html';
                        url = oui.addParam(url,'projectId',me.data.project.id);
                        url = oui.addParam(url,'circleId',me.data.project.circleId);
                        url = oui.addParam(url,'queryProjectsUrl',me.data.queryProjectsUrl);

                        oui.getData(me.data.queryProjectsUrl,{
                            circleId:me.data.project.circleId
                        },function(res){
                            var projects = res.projects ||[];
                            var arr = [];
                            oui.eachArray(projects,function(item){
                                var currProject = false;
                                if(item.id == me.data.project.id){
                                    currProject = true;
                                }
                                arr.push({
                                    queryPageFieldsByFormIdUrl:item.extraAttrs.queryPageFieldsByFormIdUrl,
                                    value:item.id,
                                    display: currProject?(item.name+'(当前项目)'): item.name
                                });
                            });
                            var dialog = oui.getTop().oui.showUrlDialog({
                                title:'项目配置',
                                url:url,
                                isHideFooter:true,
                                contentStyle:'width:100%，height:800px'
                            });
                            if(!me.treeMap.rbacModelConfig){
                                me.treeMap.rbacModelConfig ={
                                    projectId:me.data.project.id,
                                    projectId4RbacModel:me.data.project.id,
                                    participantTypeList:[],
                                    participantTypeMap:{},
                                    tableModelConfigMap:{}
                                };
                            }
                            if(!me.treeMap.flowEngineConfig){
                                me.treeMap.flowEngineConfig = {
                                    engineType:'primeton_bps',
                                    website:'',
                                    projectUpdatePath:''
                                };
                            }
                            dialog.attr('rbacModelConfigJson',oui.parseString(me.treeMap.rbacModelConfig||{}));
                            dialog.attr('projectsJson',oui.parseString(arr));
                            dialog.attr('queryPagesByProjectIdUrl',me.data.queryPagesByProjectIdUrl);
                            dialog.attr('json4save',oui.parseString({
                                projectId:me.data.project.id,
                                circleId:me.data.project.circleId,
                                treeMap:oui.parseString(me.treeMap)
                            }));

                            dialog.attr('saveDesignUrl',me.data.saveDesignUrl);//保存组织机构模型配置
                            com.oursui.models.project.web.ProjectController4Design.dialog4projectConfig = dialog;
                            oui.getTop().oui.ns('com.oursui.models.project.web').ProjectController4Design =com.oursui.models.project.web.ProjectController4Design ;
                        });
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

                        },[{type:"text",value:name}]);
                    }
                },
                designFlow:{
                    //流程设计
                    display:'流程模板设计',
                    action:function(node,treeMap,orgGraph){
                        var id = node.id; //模块id
                        var url = oui.getContextPath()+'portal.html';
                        url = oui.setParam(url,'loadMenusUrl','res_engine/flow-graph/js/flow-tree.json');
                        url = oui.setParam(url,'moduleId',id);
                        //遍历获得模块列表，表单列表
                        var ids = treeMap.ids||[];
                        var tempMap =treeMap.map;
                        var modules = [];
                        var pagesMap = {};
                        //查询 根据当前项目模块id列表查询所有的流程模板菜单

                        var moduleIds = [];
                        oui.eachArray(ids,function(id){
                            var currNode = tempMap[id].node;
                            console.log(currNode.nodeType);
                            if(currNode.nodeType =='module'){
                                modules.push({
                                    id:currNode.id,
                                    nodeType:'module',
                                    name:currNode.name
                                });
                                moduleIds.push(currNode.id);
                            }
                        });
                        //查询流程列表
                        var queryFlowsByModuleIdsUrl = me.data.queryFlowsByModuleIdsUrl;
                        queryFlowsByModuleIdsUrl =  oui.addParams(queryFlowsByModuleIdsUrl,{
                            moduleId:id,
                            moduleIds:moduleIds.join(',')
                        });
                        var flowId4default = '';
                        var loadFlowUrl='';
                        oui.postData(queryFlowsByModuleIdsUrl,{},function(res){
                            var flows = res.flows ||[];
                            var createFlowUrls = res.createFlowUrls ||[];
                            oui.eachArray(modules,function(module,idx){
                                module.children = [];
                                module.createFlowUrl = createFlowUrls[idx];
                            });
                            oui.eachArray(flows,function(flow){
                                var idx = moduleIds.indexOf(flow.moduleId);
                                var module = modules[idx];
                                flow.parentId  =  flow.moduleId;
                                flow.nodeType='flow';
                                if(flow.moduleId == id){ //当前模块id
                                    if(!flowId4default){
                                        flowId4default = flow.id;
                                        loadFlowUrl = flow.extraAttrs.loadUrl;
                                    }
                                }
                                module.children.push(flow);
                            });

                            var windowParam = {
                                currModuleId:id, //当前模块id
                                flowId:flowId4default,//流程id
                                loadFlowUrl:loadFlowUrl,
                                modules:modules
                            };
                            url = oui.setParam(url,'flowId',flowId4default);
                            oui.openWindow({
                                url: url,
                                windowParams:oui.parseString(windowParam)
                            });
                        },null,'加载中...');


                    }
                },
                designRelations:{
                    display:'设计业务关系', //设计业务关系
                    action:function(node,treeMap,orgGraph){
                        var id = node.id; //模块id
                        var url = oui.getContextPath()+'relation4vue.html#'+'res_engine/relation_graph/index.vue.html?moduleId='+id;
                        //遍历获得模块列表，表单列表
                        var ids = treeMap.ids||[];
                        var tempMap =treeMap.map;
                        var modules = [];
                        var pagesMap = {};
                        oui.eachArray(ids,function(id){
                            var currNode = tempMap[id].node;
                            console.log(currNode.nodeType);
                            if(currNode.nodeType =='module'){
                                modules.push({
                                    id:currNode.id,
                                    name:currNode.name
                                });
                            }else if(currNode.nodeType =='page'){
                                if(!pagesMap[currNode.moduleId]){
                                    pagesMap[currNode.moduleId]= [];
                                }
                                pagesMap[currNode.moduleId].push({
                                    id:currNode.id,
                                    name:currNode.name
                                });
                            }
                        });
                        oui.eachArray(modules,function(item){
                            item.children = pagesMap[item.id]||[] ;
                        });
                        var windowParam = {
                            currModuleId:id, //当前模块id
                            modules:modules, //模块列表
                            queryPageFieldsInProjectUrl:me.data.queryPageFieldsInProjectUrl, //查询页面字段的url  (参数 formId,moduleId)
                            loadRelationsUrl:me.data.loadRelationsUrl,
                            saveRelationsUrl: me.data.saveRelationsUrl,
                            saveFormFieldRelationsUrl:me.data.saveFormFieldRelationsUrl
                        };
                        oui.openWindow({
                            url: url,
                            windowParams:oui.parseString(windowParam)
                        });

                    }
                },
                exportPkg:{
                    action:function(node,treeMap,orgGraph){
                        var exportUrl = me.data.exportUrl;
                        exportUrl = oui.addParams(exportUrl,{
                            userId:oui.cookie('userId'),
                            tokenId:oui.cookie('tokenId'),
                            nodeId:node.node.id,
                            nodeType:node.node.nodeType
                        });
                        oui.downloadFile(exportUrl);
                    }
                },
                importPkg:{
                    //oui.showImportFileDialog({fileTypes:'*.zip',uploadURL:''});
                    //导入项目包
                    action:function(node,treeMap,orgGraph){
                        var importUrl = me.data.importUrl;
                        importUrl = oui.addParams(importUrl,{
                            userId:oui.cookie('userId'),
                            tokenId:oui.cookie('tokenId'),
                            nodeId:node.node.id,
                            nodeType:node.node.nodeType
                        });
                        oui.showImportFileDialog({
                            fileTypes:'*.zip',uploadURL:importUrl,completeSuccess:function(res,dialog){
                                me.load({id: me.urlParams.id},function(res){
                                    me.refreshByRoot();
                                    setTimeout(function(){
                                        dialog.hide();
                                    },1000);
                                });
                            }
                        });
                    }
                },
                createLogicsAndInteractionsByPage:{
                    //createLogicsAndInteractionsByPageUrl
                    display:'为页面创建逻辑和交互设计',
                    getApiParams:function(node,treeMap,orgGraph){
                        var params = {
                            id:node.id
                        };
                        return params;
                    },
                    action:function(node,treeMap,orgGraph,target,result){
                        oui.postData(me.data.createLogicsAndInteractionsByPageUrl,this.getApiParams(node,treeMap,orgGraph), function(res){
                            if(res.success){
                                //添加完成后，执行刷新
                                me.load({id: me.urlParams.id},function(res){
                                    me.refreshByRoot(treeMap,node.node.parentId);//刷新当前应用
                                });
                            }else{
                                oui.getTop().oui.alert(res.msg|| '处理失败');
                            }
                        });

                    }
                },
                //折叠兄弟节点
                unExpandBrothers:{
                    display:'折叠兄弟节点',
                    action:function(node,treeMap,orgGraph,target,result){

                        var ids = me.treeMap.findChildIds(me.treeMap.findParentId(node.node.id));
                        for(var i= 0,len=ids.length;i<len;i++){
                            if(ids[i] != node.node.id){
                                me.treeMap.unExpandChildren(ids[i]);
                            }
                        }
                        me.refreshByNodeId(node.node.parentId,treeMap);
                    }
                },
                //isCreateByGuide
                addAppByGuide:{
                    //api:'addApp',
                    display:'添加应用(自动创建应用交互、逻辑、页面)',
                    getApiParams:function(node,treeMap,orgGraph){
                        var ids = treeMap.ids ||[];
                        var newNode = {
                            id: treeMap.newId(),
                            parentId:node.id,
                            name:'默认应用'+(ids.length+1),
                            nodeType:me.nodeTypeEnum.app.name,
                            projectId:me.data.project.id,
                            circleId:me.data.project.circleId,
                            moduleId:node.id
                        };
                        var params = {
                            isCreateByGuide:true,
                            app:newNode
                        };
                        return params;
                    },
                    action:function(node,treeMap,orgGraph,target,result){
                        var apiMap = me.data.apiMap;
                        oui.postData(apiMap['addApp'],this.getApiParams(node,treeMap,orgGraph), function(res){
                            if(res.success){
                                //添加完成后，执行刷新
                                me.load({id: me.urlParams.id},function(res){
                                    me.refreshByRoot(treeMap,node.node.id);//刷新当前节点
                                });
                            }else{
                                oui.getTop().oui.alert(res.msg|| '处理失败');
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
                            projectId:me.data.project.id,
                            circleId:me.data.project.circleId,
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
                            enName:me.data.project.enName,
                            name:'新的页面'+(ids.length+1),
                            nodeType:me.nodeTypeEnum.page.name,
                            projectId:me.data.project.id,
                            circleId:me.data.project.circleId,
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
                            projectId:me.data.project.id,
                            circleId:me.data.project.circleId,
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
                            projectId:me.data.project.id,
                            circleId:me.data.project.circleId
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
                            //默认只展现 根节点的子节点列表
                            me.unExpandRootChildrenAll();
                        }
                    });
                });
            }else{
                me.data.project.circleId = urlParams.circleId||'';
                //新增
                oui.parse({
                    callback:function(){
                        me.bindEvents();
                    }
                });
            }
        },
        /***
         * 折叠收起除了root子节点外的所有子节点
         */
        unExpandRootChildrenAll:function(){
            var me = this;
            var allIds = me.treeMap.ids ||[];
            oui.eachArray(allIds,function(nodeId){
                var node = me.treeMap.findNode(nodeId);
                if(node.node){
                    if(node.node.nodeType =='app'){//只折叠应用下的页面和逻辑
                        me.treeMap.unExpandChildren(nodeId);
                    }
                }
            });
            me.refreshByRoot(me.treeMap);
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
                $(document).off('mousedown', '.project-design-graph');
            }catch(err){
            }
            /*** 拖拽事件处理***/
            $(document).on('mousedown', '.project-design-graph', function (e) {
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
        /***
         * 将后端返回的page转为前端所需格式,处理浮点数格式问题
         * @param page
         */
        transPage4Front:function(page){
            var controls =page.controls||[];
            var style =page.style||{};
            var innerStyle= page.innerStyle||{};

            //处理页面基本样式
            this.transPropValue('width',style);
            this.transPropValue('width4px',style);
            this.transPropValue('height',style);
            this.transPropValue('height4px',style);


            //处理内部样式

            //转换控件样式
            this.transPropValue('style.width',innerStyle);
            this.transPropValue('style.height',innerStyle);
            this.transPropValue('style.opacity',innerStyle);
            this.transPropValue('style.zIndex',innerStyle);
            this.transPropValue('style.borderBottomWidth',innerStyle);
            this.transPropValue('style.borderLeftWidth',innerStyle);
            this.transPropValue('style.borderRightWidth',innerStyle);
            this.transPropValue('style.borderTopWidth',innerStyle);


            //转换子对象中属性 数字类型的属性
            this.transPropValue('styleField.lineHeight',innerStyle);
            this.transPropValue('styleField.fontSize',innerStyle);
            this.transPropValue('styleField.borderBottomWidth',innerStyle);
            this.transPropValue('styleField.borderLeftWidth',innerStyle);
            this.transPropValue('styleField.borderRightWidth',innerStyle);
            this.transPropValue('styleField.borderTopWidth',innerStyle);

            //标题属性
            this.transPropValue('styleTitle.lineHeight',innerStyle);
            this.transPropValue('styleTitle.fontSize',innerStyle);

            var me = this;
            //遍历处理 控件列表的样式
            oui.eachArray(controls,function(item){
                //处理控件特殊类型
                if(item.controlType=='textButton'){
                    item.controlType = 'textbutton';
                }
                me.transPropValue('style.width',item);
                me.transPropValue('style.height',item);
                me.transPropValue('style.left',item);
                me.transPropValue('style.top',item);
                me.transPropValue('style.lineHeight',item);
                me.transPropValue('style.opacity',item);
                me.transPropValue('style.columnSize',item);
                me.transPropValue('style.rowSize',item);
                me.transPropValue('style.zIndex',item);
                me.transPropValue("style.borderBottomWidth",item);
                me.transPropValue("style.borderLeftWidth",item);
                me.transPropValue("style.borderRightWidth",item);
                me.transPropValue("style.borderTopWidth",item);
                me.transPropValue("style.borderRadius",item);

                //处理布局rect
                me.transPropValue("style.rect.top",item );
                me.transPropValue("style.rect.bottom",item );
                me.transPropValue("style.rect.left",item );
                me.transPropValue("style.rect.right",item );
                me.transPropValue("style.rect.columnIndex",item  );
                me.transPropValue("style.rect.rowIndex",item  );

                //处理表格单元格占位
                var cellsMap = item.style.cellsMap;
                for(var ck in cellsMap){
                    me.transPropValue("top",cellsMap[ck]);
                    me.transPropValue("bottom",cellsMap[ck]);
                    me.transPropValue("left",cellsMap[ck]);
                    me.transPropValue("right",cellsMap[ck]);
                    me.transPropValue("columnIndex",cellsMap[ck]);
                    me.transPropValue("rowIndex",cellsMap[ck]);
                }
                //处理column线条
                oui.eachArray(item.style.columnLines||[],function(cline){
                    me.transPropValue("config.lineHeight",cline);
                    me.transPropValue("fromPos.left",cline);
                    me.transPropValue("fromPos.top",cline);
                    me.transPropValue("toPos.left",cline);
                    me.transPropValue("toPos.top",cline);
                });
                //处理row线条
                oui.eachArray(item.style.rowLines||[],function(cline){
                    me.transPropValue("config.lineHeight",cline);
                    me.transPropValue("fromPos.left",cline);
                    me.transPropValue("fromPos.top",cline);
                    me.transPropValue("toPos.left",cline);
                    me.transPropValue("toPos.top",cline);
                });


                //处理内部样式 字段处理
                me.transPropValue('innerStyle.styleField.lineHeight',item);
                me.transPropValue('innerStyle.styleField.fontSize',item);
                me.transPropValue('innerStyle.styleField.borderBottomWidth',item);
                me.transPropValue('innerStyle.styleField.borderLeftWidth',item);
                me.transPropValue('innerStyle.styleField.borderRightWidth',item);
                me.transPropValue('innerStyle.styleField.borderTopWidth',item);

                //内部样式标题处理
                me.transPropValue('innerStyle.styleTitle.lineHeight',item);
                me.transPropValue('innerStyle.styleTitle.fontSize',item);

            });
            return page;
        },
        transPropValue:function(path,obj){
            if(typeof obj =='object'){
                var s = oui.JsonPathUtil.getJsonByPath(path,obj);
                if((typeof s=='string') && s){
                    oui.JsonPathUtil.setObjByPath(path,obj,parseFloat(s),true);
                }
            }
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
                var queryPageModelsUrl = res.queryPageModelsUrl; //查询页面模型的url;
                var queryPageFieldsUrl  = res.queryPageFieldsUrl;//查询页面模型的字段列表的url
                var queryPageFieldsAndAssociationFieldsUrl = res.queryPageFieldsAndAssociationFieldsUrl;//查询直接和间接关联的字段
                var queryPageAssociationFieldsUrl = res.queryPageAssociationFieldsUrl;//查询页面的关联字段
                var queryFlowsUrl = res.queryFlowsUrl;
                var controls = page.controls ||[];
                controls = oui.parseJson(controls);//处理控件字符串为数组
                page.events = oui.parseJson(page.events||{});//处理事件的字符串为对象
                page.controls = controls;
                page.style = oui.parseJson(page.style);
                page.innerStyle = oui.parseJson(page.innerStyle);
                page.pageDesignType = page.pageDesignType ||'normalForm';
                var treeNode = me.treeMap.findNode(id);
                var node = treeNode.node;
                node.parentId= treeNode.parentId;
                node.id = treeNode.id;
                //转换后台返回的数据格式，浮点数被转字符串问题修复 fix定位位置问题
                page = me.transPage4Front(page);
                //buttons:'preview,save,merge,split,insertColumn4prev,insertRow4prev,removeColumn,removeRow',
                //    bizJs:'res_engine/menu-design/js/page-design-plugin.js',
                //
                //    uploadUrl:oui.uploadURL,//跨静态页面传值，用于上传组件
                ///**必须参数*/
                //    controls: [],//已有的控件列表
                //    mainTemplate: '',//页面的业务属性面板模板获取方法
                //    saveCallBack:'saveCallback',
                ///**非必须参数*/
                //    viewType:'urlDialog',
                //    useControls:false,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件全控件列表
                //    page:page,//页面设计对象，如果是打印则是打印模板设计对象
                //    scriptPkg:"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
                //    bizCss: [],
                //    canCloneControl:true,//是否可以复制控件
                //    //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
                //    params: {
                //}

                oui.showPageDesign({
                    designTplUrl:oui.getContextPath()+'res_engine/page_design/common/runtime/page-design-form-tpl.html',
                    uploadUrl:oui.uploadURL,//跨静态页面传值，用于上传组件
                    /**必须参数*/
                    controls: [],//已有的控件列表
                    mainTemplate: '',//页面的业务属性面板模板获取方法
                    bizJs:[oui.getContextPath()+'res_apps/project/js/page-design/page-design-plugin.js'],
                    saveCallBack:'saveCallBack',
                    /**非必须参数*/
                    viewType:'openWindow',
                    buttons: "preview,save,merge,split,insertColumn4prev,insertRow4prev,removeColumn,removeRow", //按钮参数,如save,print 等按钮事件名
                    useControls:false,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件全控件列表
                    page:page,//页面设计对象，如果是打印则是打印模板设计对象
                    scriptPkg:"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
                    bizCss: [],
                    canCloneControl:true,//是否可以复制控件
                    //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
                    params: {
                        nodeJson :oui.parseString(node),
                        queryPageModelsUrl:queryPageModelsUrl,//查询页面模型列表的url
                        queryPageFieldsUrl:queryPageFieldsUrl,//查询页面模型字段列表的url
                        queryPageAssociationFieldsUrl:queryPageAssociationFieldsUrl,//查询页面关联字段
                        queryPageFieldsAndAssociationFieldsUrl:queryPageFieldsAndAssociationFieldsUrl,//查询直接关联和间接关联的字段的url
                        saveUrl:  me.data.savePageDesignUrl|| oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),'savePageDesign'),
                        queryFlowsUrl: queryFlowsUrl,
                        omUrlMap:me.data.omUrlMap
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
            var view = oui.getById('project-design');
            var html = view.getHtmlByTplId('design-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','.orgchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap,nodeId){
            var me = this;
            var view = oui.getById('project-design');
            view.render();
            if(nodeId){
                //隐藏其他节点，显示当前节点
                //todo
            }
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
            var view = oui.getById('project-design');
            var $node = $('.node[node-id='+targetNodeId+']','.orgchart');



            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu').remove();
            $('.orgchart').closest('.project-design-graph').append(html);
            oui.follow4fixed($node.find('.title')[0],$('.second-menu')[0],true);
        },

        /** 事件处理方法开始......******/

        event2showMenu:function(cfg){
            var me = this;
            if($(cfg.e.target).is('input')){
                //文本输入时不做处理
                return ;
            }
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('project-design');
            $('.allowedDrop','.orgchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            var html = view.getHtmlByTplId('node-menu-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $('.orgchart').closest('.project-design-graph').append(html);
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
            var view = oui.getById('project-design');
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
        },
        load:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Design',''),'loadDesign');
            var id = oui.getParam('id');
            path = me.urlParams.loadProjectDesignPath||path;
            oui.getData(path,param,function(res){
                if(res.success){
                    var project = res.project||{};
                    me.data.project = project;
                    if(res.designJson){
                        me.treeMap = me.newTreeMap(oui.parseJson(res.designJson),'id','parentId','name');
                    }else{
                        me.treeMap = me.array2orgTreeMap([{
                            id:project.id,
                            name:project.name,
                            parentId:null,
                            nodeType:me.nodeTypeEnum.project.name
                        }],'id','parentId','name');
                        me.treeMap.rbacModelConfig = {
                            //参与者类型编码列表
                            participantTypeList:[],
                            participantTypeMap:{},
                            projectId:project.id,
                            projectId4RbacModel:project.id,
                            tableModelConfigMap:{}
                        };
                        me.treeMap.flowEngineConfig = {
                            engineType:'primeton_bps',
                            engineIp:'',
                            enginePort:''
                        }
                    }
                    me.data.saveDesignUrl =res.saveDesignUrl;
                    me.data.treeMap = me.treeMap||{};
                    me.data.apiMap = res.apiMap||{};
                    me.data.loadLogicUrl = res.loadLogicUrl;
                    me.data.loadInteractionDesignUrl = res.loadInteractionDesignUrl;
                    me.data.loadPageDesignUrl = res.loadPageDesignUrl;
                    me.data.createLogicsAndInteractionsByPageUrl = res.createLogicsAndInteractionsByPageUrl;
                    me.data.savePageDesignUrl = res.savePageDesignUrl;
                    me.data.showPageUrl = res.showPageUrl;//查看页面访问路径
                    me.data.queryPageFieldsInProjectUrl = res.queryPageFieldsInProjectUrl;//查询字段列表
                    me.data.loadRelationsUrl = res.loadRelationsUrl;
                    me.data.saveRelationsUrl = res.saveRelationsUrl;
                    me.data.saveFormFieldRelationsUrl = res.saveFormFieldRelationsUrl;
                    me.data.exportUrl = res.exportUrl;//导出url
                    me.data.importUrl = res.importUrl;//导入url
                    me.data.queryFlowsByModuleIdsUrl = res.queryFlowsByModuleIdsUrl;//查询流程模板列表
                    me.data.queryProjectsUrl = res.queryProjectsUrl; //查询项目列表的url
                    me.data.queryPagesByProjectIdUrl = res.queryPagesByProjectIdUrl;
                    me.data.omUrlMap = res.omUrlMap;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...');
        }
    };
    ProjectController4Design = oui.biz.Tool.crateOrUpdateClass(ProjectController4Design);
})(window, jQuery);