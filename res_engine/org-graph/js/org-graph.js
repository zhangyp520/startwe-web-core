!(function () {
    var OrgGraph = {
        "package": "com.oui.org",
        "class": "OrgGraph",
        array2orgTreeMap:function(arr,idKey,parentIdKey,nameKey,isFlow){
            return com.oui.TreeMap.array2treeMap(arr,idKey,parentIdKey,nameKey,isFlow);
        },
        checkSameDeptName:function(nodeId,name,parentId){
            var me = this;
            var flag = true;
            var children = me.treeMap.findChildren(parentId)||[];
            var one = oui.findOneFromArrayBy(children,function(curr){
                if((curr.id !=nodeId) && name == curr.node.name){
                    return true;
                }
            });
            if(one){
                flag = false;
            }

            return flag;
        },
        show:function(arr,canEdit){
            var me = this;
            me.canEdit = canEdit;
            me.treeMap = me.array2orgTreeMap(arr,'id','parentId','name',false);
            me.refreshByRoot(me.treeMap);
        },
        findDepts:function(){
            var me = this;
            var ids = me.treeMap.ids ||[];
            var arr = [];
            for(var i= 0,len=ids.length;i<len;i++){
                arr.push(me.treeMap.findNode(ids[i]).node);
            }
            return arr;
        },
        initValidateCfg:function(){
            var validate = {
                deptEdit:{

                    name:{
                        maxLength:20,
                        require:true,
                        title:'组织名称',
                        failMode:'msgPosEl',
                        msgPos:'append',
                        msgPosEl:'#orgName_error'
                    },
                    limitCount:{
                        minValue:0,
                        maxValue:500,
                        require:false,
                        title:'编制',
                        failMode:'msgPosEl',
                        msgPos:'append',
                        msgPosEl:'#limitCount_error'
                    },
                    orgCode:{
                        maxLength:20,
                        require:false,
                        title:'组织编码',
                        failMode:'msgPosEl',
                        msgPos:'append',
                        msgPosEl:'#orgCode_error'
                    },
                    description:{
                        maxLength:249,
                        require:false,
                        title:'文本描述',
                        failMode:'msgPosEl',
                        msgPos:'append',
                        msgPosEl:'#description_error'
                    }
                },
                historyEdit:{
                    name : {
                        maxLength:20,
                        require:true,
                        title:'版本名称',
                        failMode:'msgPosEl',
                        msgPos:'append',
                        msgPosEl:'#orgVersionName_error'
                    }
                }
            };
            return validate;
        },
        findDeptEditValidate:function(){
            var me = this;
            var validate = me.validate.deptEdit;
            var json = {};
            for(var key in validate){
                json[key] = oui.parseString(validate[key]);
            }
            return json;
        },
        checkTopForm:function(container){
            var isCheck = oui.getTop().oui.checkForm(container);
            if(!isCheck){
                return false;
            }
            return true;
        },
        init: function (cfg) {
            cfg = cfg ||{};
            var me = this;
            me.canEdit = true;
            template.helper('OrgGraph',this);


            var tpl = oui.loadUrl(oui.getContextPath()+'res_engine/org-graph/dept.tpl.html');
            $('body').append(tpl);//加载公共模板

            var url = oui.getContextPath()+'res_engine/org-graph/js/tree-map-test.json';
            var json = oui.loadUrl(url);
            //var json = oui.getPageParam('depts');
            me.data.orgs= oui.parseJson(json);
            //idKey,parentIdKey,nameKey
            var isFlow = cfg.isFlow;
            me.scale = 1;
            me.treeMap = me.array2orgTreeMap(me.data.orgs,'id','parentId','name',isFlow);
            if(me.treeMap.rootIds.length!=1){
                if(me.treeMap.rootIds.length==0){
                    oui.getTop().oui.alert('没有组织机构根节点');
                    return ;
                }else if(me.treeMap.rootIds.length>1){
                    oui.getTop().oui.alert('组织机构根节点存在多个');
                    return ;
                }
            }
            me.validate= me.initValidateCfg();
            me.menuActionEnum = {
                add:{ //添加子节点
                    api:'addDepartment',
                    display:'添加子部门',
                    action:function(node,treeMap,orgGraph,targetNode){
                        var view = oui.getById('view-org');
                        var params = {
                            org:{
                                id: '',
                                parentId:node.id,
                                parentOrgName:treeMap.findNodeName(node.id),
                                name:'新的部门',
                                limitCount:0,
                                leaderId:'',
                                leaderName:'',
                                orgCode:'',
                                description:''
                            },
                            validate:me.findDeptEditValidate()
                        };
                        var html = view.getHtmlByTplId('dept-edit-tpl',params);
                        me.dialog4editDept = oui.getTop().oui.showHTMLDialog({
                            title:'添加部门',
                            content:html,
                            actions:[{
                                cls:'oui-dialog-cancel submit-button',
                                text:'取消',
                                action:function(){
                                    me.dialog4editDept.hide();
                                }
                            },{
                                cls:'oui-dialog-ok submit-button',
                                text:'保存',
                                action:function(){

                                    var isCheck =  me.checkTopForm($(me.dialog4editDept.getEl()));
                                    if(!isCheck){
                                        return ;
                                    }
                                    params.org.name = $(me.dialog4editDept.getEl()).find('[name=orgName]').val();

                                    var isCheck= me.checkSameDeptName('new',params.org.name,node.id);
                                    if(!isCheck){
                                        oui.getTop().oui.alert('与同级部门同名');
                                        return;
                                    }

                                    params.org.orgCode = $(me.dialog4editDept.getEl()).find('[name=orgCode]').val();
                                    params.org.description = oui.getTop().oui.getById('description4dept').getValue();
                                    var leaderControl = oui.getTop().oui.getById('selectPerson4leader');
                                    var leaderId = leaderControl.getValue();
                                    params.org.leaderId =leaderId;
                                    params.org.leaderName = leaderControl.getDisplay4readOnly();
                                    params.org.limitCount = oui.getTop().oui.getById('limitCount4dept').getValue();

                                    var url = oui.getPageParam('addDeptUrl');
                                    oui.postData(url,params.org,function(res){
                                        if(res.success){
                                            var msg = oui.parseJson(res.msg);
                                            var department =msg.department||{};
                                            var newNode = department;
                                            treeMap.addNode(newNode); //添加节点
                                            //刷新当前节点和下面的节点列表
                                            orgGraph.refreshByNodeId(node.id,treeMap);
                                            me.dialog4editDept.hide();
                                        }else{
                                            oui.getTop().oui.alert('保存部门失败:'+res.msg);
                                        }

                                    },function(res){
                                        oui.getTop().oui.alert(res);
                                    },'保存中...');

                                }
                            }
                            ]
                        });
                        oui.getTop().oui.parse({
                            container:$(me.dialog4editDept.getEl())
                        });
                    }
                },
                edit:{
                    action:function(node,treeMap,orgGraph,targetNode){
                        var view = oui.getById('view-org');
                        var leaderData= [];
                        if(node.node.leaderId){
                            leaderData=[{
                                id:node.node.leaderId,
                                typeFlag:'person',
                                name:node.node.leaderName||''
                            }];
                        }
                        var params = {
                            leaderData:oui.parseString(leaderData),
                            org:node.node,
                            validate:me.findDeptEditValidate()
                        };
                        var html = view.getHtmlByTplId('dept-edit-tpl',params);
                        me.dialog4editDept = oui.getTop().oui.showHTMLDialog({
                            title:'编辑部门',
                            content:html,
                            actions:[{
                                cls:'oui-dialog-cancel submit-button',
                                text:'取消',
                                action:function(){
                                    me.dialog4editDept.hide();
                                }
                            },{
                                cls:'oui-dialog-ok submit-button',
                                text:'保存',
                                action:function(){
                                    params.org.name = $(me.dialog4editDept.getEl()).find('[name=orgName]').val();

                                    var isCheck = me.checkTopForm($(me.dialog4editDept.getEl()));
                                    if(!isCheck){
                                        return ;
                                    }
                                    var isCheck= me.checkSameDeptName(node.id,params.org.name,node.parentId);
                                    if(!isCheck){
                                        oui.getTop().oui.alert('与同级部门同名');
                                        return;
                                    }
                                    params.org.orgCode = $(me.dialog4editDept.getEl()).find('[name=orgCode]').val();
                                    params.org.description = oui.getTop().oui.getById('description4dept').getValue();
                                    var leaderControl = oui.getTop().oui.getById('selectPerson4leader');
                                    var leaderId = leaderControl.getValue();
                                    params.org.leaderId =leaderId;
                                    params.org.leaderName = leaderControl.getDisplay4readOnly();
                                    params.org.limitCount = oui.getTop().oui.getById('limitCount4dept').getValue();

                                    var url = node.node.extraAttrs.updateUrl;
                                    oui.postData(url,params.org,function(res){
                                        if(res.success){
                                            var msg = oui.parseJson(res.msg);
                                            var department =msg.department||{};
                                            node.node = department;
                                            //刷新当前节点和下面的节点列表
                                            orgGraph.refreshByNodeId(node.id,treeMap);
                                            me.dialog4editDept.hide();
                                        }else{
                                            oui.getTop().oui.alert('保存部门失败:'+res.msg);
                                        }

                                    },function(res){
                                        oui.getTop().oui.alert(res);
                                    },'保存中...');

                                }
                            }
                            ]
                        });
                        oui.getTop().oui.parse({
                            container:$(me.dialog4editDept.getEl())
                        });
                    }
                },
                addParent:{//添加一个新节点 作为当前节点的父节点
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){
                            return;
                        }else{
                            var view = oui.getById('view-org');
                            var params = {
                                org:{
                                    id: '',
                                    parentId:node.parentId,
                                    parentOrgName:treeMap.findNodeName(node.parentId),
                                    name:'新的部门',
                                    limitCount:0,
                                    leaderId:'',
                                    leaderName:'',
                                    orgCode:'',
                                    description:''
                                },
                                validate:me.findDeptEditValidate()
                            };
                            var html = view.getHtmlByTplId('dept-edit-tpl',params);
                            me.dialog4editDept = oui.getTop().oui.showHTMLDialog({
                                title:'添加部门',
                                content:html,
                                actions:[{
                                    cls:'oui-dialog-cancel submit-button',
                                    text:'取消',
                                    action:function(){
                                        me.dialog4editDept.hide();
                                    }
                                },{
                                    cls:'oui-dialog-ok submit-button',
                                    text:'保存',
                                    action:function(){

                                        params.org.name = $(me.dialog4editDept.getEl()).find('[name=orgName]').val();

                                        var isCheck =  me.checkTopForm($(me.dialog4editDept.getEl()));
                                        if(!isCheck){
                                            return ;
                                        }
                                        var isCheck= me.checkSameDeptName(node.id,params.org.name,node.parentId);
                                        if(!isCheck){
                                            oui.getTop().oui.alert('与同级部门同名');
                                            return;
                                        }

                                        params.org.orgCode = $(me.dialog4editDept.getEl()).find('[name=orgCode]').val();
                                        params.org.description = oui.getTop().oui.getById('description4dept').getValue();

                                        var leaderControl = oui.getTop().oui.getById('selectPerson4leader');
                                        var leaderId = leaderControl.getValue();
                                        params.org.leaderId =leaderId;
                                        params.org.leaderName = leaderControl.getDisplay4readOnly();
                                        params.org.limitCount = oui.getTop().oui.getById('limitCount4dept').getValue();
                                        var url = node.node.extraAttrs.addParentUrl||"";
                                        oui.postData(url,{
                                            department:params.org,
                                            currentId:node.id
                                        },function(res){
                                            if(res.success){
                                                var msg = oui.parseJson(res.msg);
                                                var department =msg.department||{};
                                                var newNode = department;
                                                var isRefreshRoot = !node.parentId;
                                                treeMap.addParentNode(newNode,node); //添加节点
                                                if(isRefreshRoot){
                                                    orgGraph.refreshByRoot(treeMap);
                                                }else{
                                                    orgGraph.refreshByNodeId(newNode.parentId,treeMap);
                                                }


                                                me.dialog4editDept.hide();
                                            }else{
                                                oui.getTop().oui.alert('保存部门失败:'+res.msg);
                                            }

                                        },function(res){
                                            oui.getTop().oui.alert(res);
                                        },'保存中...');

                                    }
                                }
                                ]
                            });
                            oui.getTop().oui.parse({
                                container:$(me.dialog4editDept.getEl())
                            });
                        }
                    }
                },
                addBrother:{ //在当前节点后面添加一个兄弟节点,考虑顺序调整
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){ //根节点不能添加兄弟节点
                            return ;
                        }
                        //TODO 暂时调用 父节点添加子节点功能
                        me.menuActionEnum.add.action(treeMap.findParent(node.id),treeMap,orgGraph);
                        if(false){
                            //TODO 实际添加同级算法
                            var newNode = {
                                id:treeMap.newId(),
                                name:'新的节点',
                                parentId:node.parentId
                            };
                            treeMap.addBrotherNode(newNode,node); //添加节点
                            orgGraph.refreshByNodeId(node.parentId,treeMap);
                        }
                    }
                },
                remove:{//删除当前节点
                    action:function(node,treeMap,orgGraph){
                        //根节点不能删除
                        if(!node.parentId){
                            return;
                            //if(node.childIds&&node.childIds.length==1){
                            //    //根节点只有一个子节点时，才能删除，将子节点作为根节点
                            //    treeMap.removeRoot(node);
                            //    orgGraph.refreshByRoot(treeMap);
                            //}
                        }else{
                            oui.getTop().oui.confirmDialog('确认删除部门',function(){
                                var url = node.node.extraAttrs.deleteUrl;
                                oui.postData(url,{
                                    id:node.id,
                                    includeChildren:false
                                },function(res){
                                    if(res.success){
                                        var parentId = node.parentId;
                                        treeMap.removeNode(node);
                                        orgGraph.refreshByNodeId(parentId,treeMap);
                                    }else{
                                        oui.getTop().oui.alert('删除部门失败:'+res.msg);
                                    }

                                },function(res){
                                    oui.getTop().oui.alert(res);
                                },'删除中...');

                            },function(){
                            });

                        }
                    }
                },
                removeAll:{ //删除当前和所有子孙
                    action:function(node,treeMap,orgGraph){
                        if(!node.parentId){
                            return ;
                        }

                        oui.getTop().oui.confirmDialog('确认删除部门',function(){
                            var url = node.node.extraAttrs.deleteUrl;
                            oui.postData(url,{
                                id:node.id,
                                includeChildren:true
                            },function(res){
                                if(res.success){
                                    var parentId = node.parentId;
                                    treeMap.removeNodeAll(node);
                                    orgGraph.refreshByNodeId(parentId,treeMap);
                                }else{
                                    oui.getTop().oui.alert('删除部门失败:'+res.msg);
                                }

                            },function(res){
                                oui.getTop().oui.alert(res);
                            },'删除中...');

                        },function(){

                        });

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

                            var url = node.node.extraAttrs.exchangeSortUrl||'';
                            oui.postData(url,{
                                currentId:node.id,
                                targetId:targetNode.id
                            },function(res){
                                if(res.success){
                                    var orgOrder= node.node.orgOrder;
                                    var targetOrgOrder = targetNode.node.orgOrder;
                                    node.node.orgOrder = targetOrgOrder;
                                    targetNode.node.orgOrder = orgOrder;
                                    var parentNode = treeMap.findNode(node.parentId);
                                    if(parentNode){
                                        var childIds = parentNode.childIds ||[];
                                        var nodeIdx = childIds.indexOf(node.id);
                                        var targetIdx = childIds.indexOf(targetNode.id);
                                        childIds[nodeIdx] = targetNode.id;
                                        childIds[targetIdx] = node.id;
                                    }
                                    orgGraph.refreshByNodeId(node.parentId,treeMap);

                                }else{
                                    oui.getTop().oui.alert('交换顺序失败:'+res.msg);
                                }

                            },function(res){
                                oui.getTop().oui.alert(res);
                            },'顺序交换中...');
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

                        var url = node.node.extraAttrs.updateParentUrl||'';
                        oui.postData(url,{
                            currentId:node.id,
                            targetId:targetNode.id
                        },function(res){
                            if(res.success){

                                //可以考虑 刷新整个页面
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



                            }else{
                                oui.getTop().oui.alert('调整部门失败:'+res.msg);
                            }

                        },function(res){
                            oui.getTop().oui.alert(res);
                        },'部门调整中...');
                    }
                },
                hideMenu4DragEnd:{
                    action:function(node,treeMap,orgGraph,targetNode){

                    }
                }
            };
            oui.parse({
                callback:function(){
                    me.bindEvents();
                }
            });
        },
        event2hideHistoryOperation:function(cfg){
            $('#orgHistory').removeClass('oui-operation-show');
        },
        event2showOrgHistoryList:function(cfg){
            var me =this ;
            var showHistoryUrl= oui.getPageParam('showHistoryUrl');
            oui.getData(showHistoryUrl,{
            },function(res){
                if(res.success){
                    var msg = oui.parseJson(res.msg);
                    var versions = msg.histories ||[];
                    var view = oui.getById('view-org');
                    var html = view.getHtmlByTplId('org-history-tpl',{versions:versions});
                    var $orgHistory = $('#orgHistory');
                    if($orgHistory&&$orgHistory.length){
                        $orgHistory[0].outerHTML = html;
                    }else{
                        $('body').append(html);
                    }
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中..',function(res){
                oui.getTop().oui.alert(res.msg);
            });
        },

        event2showOrgByVersion:function(cfg){
            var me = this;
            var url = $(cfg.el).attr('version-url');
            $('.version-active').removeClass('version-active');
            $(cfg.el).addClass('version-active');

            var data = oui.getData(url,{},function(res){
                if(res.success){
                    var msg = oui.parseJson(res.msg);
                    var departments = oui.parseJson(msg.orgJSON||[]);
                    me.show(departments,false);
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...',function(res){
                oui.getTop().oui.alert(res);
            });
        },
        event2delVersion:function(cfg){
            var me = this;
            var delUrl = $(cfg.el).attr('del-url');
            oui.getTop().oui.confirmDialog('确认删除版本',function(){
                oui.postData(delUrl,{id:$(cfg.el).attr('version-id')},function(res){
                    if(res.success){
                        oui.getTop().oui.showAutoTips('删除版本成功');
                        me.event2showOrgHistoryList();
                    }else{
                        oui.getTop().oui.alert('删除版本失败');
                    }
                },function(res){
                    oui.getTop().oui.alert(res);
                },'删除中');
            },function(){
            });

        },
        event2showCurrOrg:function(cfg){
            var url = window.location.href;
            oui.go4replace(url);
        },

        /** 保存当前组织架构版本****/
        event2saveVersion:function(cfg){
            var me = this;
            var view = oui.getById('view-org');
            var html = view.getHtmlByTplId('org-version-tpl',{
                version:{
                },
                validate:{
                    name:oui.parseString(me.validate.historyEdit.name)
                }
            });
            me.versionDialog = oui.getTop().oui.showHTMLDialog({
                title:'Tips:最多保存50个版本',
                content:html,
                actions:[
                    {
                        cls:'oui-dialog-cancel submit-button',
                        text:'取消',
                        action:function(){
                            me.versionDialog.hide();
                        }
                    },
                    {
                        cls:'oui-dialog-ok submit-button',
                        text:'保存',
                        action:function(){
                            var verisonName = oui.getTop().$(me.versionDialog.getEl()).find('#orgVersionName').val();
                            var isCheck = oui.getTop().oui.checkForm($(me.versionDialog.getEl()));
                            if(!isCheck){
                                return ;
                            }
                            var saveVersionUrl = oui.getPageParam('saveVersionUrl');
                            oui.postData(saveVersionUrl,{
                                name:verisonName
                            },function(res){
                                if(res.success){
                                    oui.getTop().oui.showAutoTips("保存版本成功");
                                    me.versionDialog.hide();
                                }else{
                                    oui.getTop().oui.alert('保存版本失败');
                                }
                            },function(res){
                                oui.getTop().oui.alert(res);
                            });

                        }
                    }
                ]
            });

        },
        /*****
         * 渲染组织机构图的放大或者缩小渲染
         */
        renderOrgChartScale:function(count){
            var me = this;
            var $chart = $('.orgchart');
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
        hideMenu:function(){
            $('.node', '.orgchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '.orgchart').removeClass('allowedDropTarget');
            $('.second-menu').remove();
        },
        /** 绑定拖拽事件****/
        bindEvents:function(){
            var me = this;
            if(me.canEdit) {
                me.dragData = {};
                $(document).on('dragstart', '.orgchart .node', function (e) {
                    $('.node', '.orgchart').removeClass('allowedDrop');
                    $('.allowedDropTarget', '.orgchart').removeClass('allowedDropTarget');
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
                $(document).on('dragover', '.orgchart .node', function (e) {
                    e.preventDefault();
                    var nodeId = $(e.target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    //console.log('dragover:'+nodeId);

                    //$(e.target).addClass('');
                });
                $(document).on('dragend', '.orgchart .node', function (e) {
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

                        $('.node', '.orgchart').removeClass('allowedDrop');
                        $('.allowedDropTarget', '.orgchart').removeClass('allowedDropTarget');

                        if (me.dragData.fromNodeId == me.dragData.toNodeId) {
                            return;
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
                $(document).on('mousedown',function(e){
                    if ($(e.target).closest('.node').length) {
                        return;
                    } else {
                        me.hideMenu();
                    }
                });
                $(document).on('mousedown', '.manager-content', function (e) {
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
                    var $chart = $('.orgchart');
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

            var view = oui.getById('view-org');
            if(treeMap.isFlow){
                this.refreshByRoot(treeMap);
                return ;
            }
            var html = view.getHtmlByTplId('org-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','.orgchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            if(treeMap.isFlow){
            }
            var style = $('.orgchart').attr('style');
            var view = oui.getById('view-org');
            view.render();
            $('.orgchart').attr('style',style);
        },
        expandChildren:function(cfg){
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
        event2ToggleExpand:function(cfg){
            var me = this;
            var isRootChildrenUnExpand = me.isRootChildrenUnExpand;
            var root = me.treeMap.findRoot();
            root.unExpand= false;
            if(isRootChildrenUnExpand){
                me.isRootChildrenUnExpand = false;
                $(cfg.el).removeClass('toolbar-group-icon-open');
                $(cfg.el).addClass('toolbar-group-icon-close');
                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.expandChildren(ids[i]);
                }
            }else{
                me.isRootChildrenUnExpand = true;
                $(cfg.el).removeClass('toolbar-group-icon-close');
                $(cfg.el).addClass('toolbar-group-icon-open');

                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.unExpandChildren(ids[i]);
                }
            }
            me.refreshByRoot(me.treeMap);
        },
        /** 数据定义****/
        data: {},
        /** 数据返回***/
        getData: function () {
            return OrgGraph.data;
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
            var treeMap = me.treeMap;
            //只有兄弟节点可以调整顺序，只有非子节点才可以拖拽到另外一个节点下

            if(treeMap.isChild(nodeId,targetNodeId)){
                return ;
            }
            /*

             {{if treeMap.isBrothers(nodeId,targetNodeId)}}
             <div class="menu-text" node-id="{{nodeId}}" target-node-id="{{targetNodeId}}" menu-action-id="swapSort" oui-e-{{treeMap.clickName}}="event2menuAction">
             顺序调整
             </div>
             {{/if}}
             <%--<div class="menu-text" node-id="{{nodeId}}" target-node-id="{{targetNodeId}}" menu-action-id="swap" oui-e-{{treeMap.clickName}}="event2menuAction">--%>
             <%--交换位置--%>
             <%--</div>--%>
             {{if !treeMap.isChild(nodeId,targetNodeId)}}
             {{if !treeMap.hasParents(nodeId,targetNodeId)}}
             <div class="menu-text" node-id="{{nodeId}}" target-node-id="{{targetNodeId}}" menu-action-id="addChildByTarget" oui-e-{{treeMap.clickName}}="event2menuAction">
             变更为目标节点的子节点
             </div>
             {{/if}}
             {{/if}}

              */
            var count =0;
            if(treeMap.isBrothers(nodeId,targetNodeId)){
               count++;
            }
            if(!treeMap.isChild(nodeId,targetNodeId)){
                if(!treeMap.hasParents(nodeId,targetNodeId)){
                    count++;
                }
            }
            if(count==0){
                return ;
            }

            if(me.dragData.fromNodeId&&me.dragData.toNodeId){
                $('.node[node-id='+me.dragData.fromNodeId+'],.node[node-id='+me.dragData.toNodeId+']','.orgchart').addClass('allowedDrop');
                $('.node[node-id='+me.dragData.toNodeId+']','.orgchart').addClass('allowedDropTarget');
            }
            var view = oui.getById('view-org');
            var $node = $('.node[node-id='+targetNodeId+']','.orgchart');
            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu','.orgchart').remove();
            $node.find('.title').append(html);
        },

        /** 事件处理方法开始......******/

        event2showMenu:function(cfg){
            var me = this;
            if(!me.canEdit){
                return ;
            }
            var nodeId = $(cfg.el).attr('node-id');
            var view = oui.getById('view-org');
            me.hideMenu();
            var html = view.getHtmlByTplId('node-menu-tpl',{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $(cfg.el).find('.title').append(html);
        },
        event2menuAction:function(cfg){
            var me = this;
            cfg.e.stopPropagation&&cfg.e.stopPropagation();
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
            me.hideMenu();
            return false;
        },
        event2editNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            var view = oui.getById('view-org');
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
        /***
         * 导出组织机构图
         * @param cfg
         */
        event2exportGraph:function(cfg){
            var $chartContainer = $('.orgchart') ;
            var me = this;
            var treeMap = me.treeMap;
            com.oui.TreeMap.exportGraph(treeMap,$chartContainer,'org.png',function(){

            });

        },
        event2showOrgLogList:function(cfg){
            var url = oui.getPageParam('showLogUrl');
            oui.getTop().oui.showUrlDialog({
                isHideFooter:true,
                contentStyle:'width:100%',
                url:url
            });
        },
        /** 这是方法****/
        test: function () {
            alert('hello test');
        }
    };
    OrgGraph = oui.biz.Tool.crateOrUpdateClass(OrgGraph);
}());


