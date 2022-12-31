!(function () {
    var PageRuntime = {
        "package": "com.startwe.models.page.web",//com.startwe.models.page.web.PageRuntime
        "class": "PageRuntime",
        data:{},
        init: function () {
            var me = this;
            me.data={};
            template.helper('PageRuntime',this);
            var urlParams = oui.getPageParam('urlParams')||{};
            me.urlParams = urlParams;
            me.data.clickName = oui.mobile?'tap':'click';
            oui.setPageParam('_menu_page_'+'logic-design',oui.parseJson(oui.parseString(urlParams)));
            var initPath = urlParams.initPath;
            oui.getData(initPath,{},function(res){
                console.log('runtime:');
                console.log(res);
                //nodeType,nodeId,content
                if(res.success){
                    var nodeId = res.nodeId;
                    var nodeType = res.nodeType;
                    var content = res.content;
                    if((nodeType!='page')&&(nodeType!='pageList')){
                        content=content||[];
                        content= oui.parseJson(content);
                    }
                    //TODO 处理 运行态的页面js
                    var requireUrls = [];
                    if(nodeType=='page'){
                        requireUrls.push(oui.getContextPath()+'res_common/oui/system/component-adapter.js');
                        requireUrls.push(oui.getContextPath()+'res_common/oui/system/util.js');
                        requireUrls.push(oui.getContextPath()+'res_engine/page_design/common/js/page-design-runtime.js');
                        requireUrls.push(oui.getContextPath()+'res_engine/page-runtime/js/page-runtime.tpl.js');
                    }
                    oui.require(requireUrls,function(){
                        me.data.nodeId = nodeId;
                        me.data.nodeType = nodeType;
                        console.log(urlParams);
                        if(nodeType=='page'){
                            content.events = oui.parseJson(content.events);//处理字符串属性
                            if(urlParams.editId&&urlParams.formData){ //edit
                                var formData = urlParams.formData;
                                var controls = content.controls||[];

                                var mainData = {

                                };
                                var detailData ={};
                                /*** 循环处理数据绑定****/
                                oui.findManyFromArrayBy(controls,function(item){
                                    var bizId =item.bizId||item.id||'';
                                    //主表数据
                                    if((!item.detailId) &&(item.formField) ){
                                        //显示值处理
                                        var display = oui.util.findDisplayByControlAndFormData(item,formData);
                                        mainData[bizId]= {
                                            value:formData[bizId]||"",
                                            display:display
                                        };
                                    }
                                });

                                var pageData = oui.util.createPageData({
                                    refresh:function(){
                                        me.refresh&&me.refresh();
                                    },
                                    save:function(success,error){
                                        me.saveFormData(success,error);
                                    },
                                    logics:{
                                        logic4update : me.urlParams.logic4update ||"",
                                        logic4query : me.urlParams.logic4query||'',
                                        logic4new : me.urlParams.logic4new||''
                                    },
                                    dataId:formData.id,

                                    designer:content,
                                    mainData:mainData||{},//主表数据
                                    detailData:detailData||{}//子表数据
                                });
                                pageData.beforeInit(function(){
                                    me.data.content = pageData.render(); //渲染
                                    var logic4update = me.urlParams.logic4update ||"";
                                    me.data.pageData = pageData;
                                    me.data.dataId = formData.id;
                                    me.data.saveUrl = logic4update;
                                    me.data.logic4query = me.urlParams.logic4query||'';
                                    me.data.logic4new = me.urlParams.logic4new||'';
                                    oui.parse({
                                        callback:function(){
                                            me.bindEvents();
                                            if(nodeType=='page'){
                                                pageData.afterInit();//渲染完成
                                                me.refresh();
                                            }
                                        }
                                    });
                                }); //初始化前
                                return;

                                //var html = tplRender(me.data);
                                //me.data.content = html;
                            }else{//new

                                var pageData = oui.util.createPageData({
                                    refresh:function(){
                                        me.refresh&&me.refresh();
                                    },
                                    save:function(success,error){
                                      me.saveFormData(success,error);
                                    },
                                    logics:{
                                        logic4query : me.urlParams.logic4query||'',
                                        logic4new : me.urlParams.logic4new||''
                                    },
                                    designer:content,
                                    mainData:{},//主表数据
                                    detailData:{}//子表数据
                                });
                                pageData.beforeInit(function(){
                                    me.data.content = pageData.render(); //渲染

                                    var logic4new = me.urlParams.logic4new ||"";
                                    //var tplRender = template.compile(content.content||"");
                                    me.data.dataId='';
                                    me.data.pageData = pageData;
                                    me.data.saveUrl = logic4new;
                                    me.data.logic4new = logic4new;
                                    me.data.logic4query = me.urlParams.logic4query||'';
                                    oui.parse({
                                        callback:function(){
                                            me.bindEvents();
                                            console.info(me.bindEvents,'bindEvents')
                                            if(nodeType=='page'){
                                                pageData.afterInit();//渲染完成
                                                me.refresh();
                                            }
                                        }
                                    });
                                }); //初始化前
                                return ;
                                //var html = tplRender(me.data);
                                //me.data.content = html;

                            }
                            //TODO 处理明细表数据，主表数据


                        }else if(nodeType=='pageList'){
                           
                            me.data.pageId = nodeId; //页面id
                            me.data.nodeId = nodeId+'-list';
                            me.data.logic4query = content.logic4query;

                            var loadMenusUrl = oui.getParam('loadMenusUrl');
                            var nodeType4page = oui.getParamByUrl(loadMenusUrl,'nodeType');
                            var editDataId = oui.getParam('editDataId');
                             
                            if(nodeType4page =='page'){
                                //在列表中驱动加载页面
                                //id,根据id查询数据，再跳转页面
                                if(editDataId){
                                    //更新数据
                                    oui.getData(me.data.logic4query,{
                                        queryParam:oui.parseString([{
                                            field:'id',//把id传入作为查询条件
                                            value:editDataId
                                        }])
                                    },function(res){
                                        var one ={};
                                        if(res.success && res.dataList&&res.dataList.length){
                                            one = res.dataList[0];
                                        }
                                        if(one.extraAttrs&&one.extraAttrs.logic4load){
                                            var menuId =oui.getParamByUrl(loadMenusUrl,'nodeId');
                                            var Portal=com.startwe.models.portal.web.PortalController;
                                            var menus = Portal.data.menus||[];
                                            var menu = oui.findOneFromArrayBy(menus,function(item){
                                                if(menuId == item.id){
                                                    return true;
                                                }
                                            });
                                            if(menu){
                                                //传值到页面编辑
                                                var temp = oui.clone(menu.params||{});
                                                temp.logic4load = one.extraAttrs.logic4load;
                                                temp.logic4update = one.extraAttrs.logic4update;
                                                /* logic4new: "/3qMRf2.biz?m=startwe&o_as=46f0e3c9be2837119c73392339d112eb79e3842b"
                                                 logic4query: "/Qzauu2.biz?m=startwe&o_as=5c2b72a975b4293821895194cc6b8c7c9e912c3d"
                                                 ***/
                                                temp.logic4new = me.data.logic4new;
                                                temp.logic4query = me.data.logic4query;
                                                temp.formData = one;
                                                temp.editId = one.id;
                                                Portal.doActionByMenuConfig(menu,temp);
                                            }
                                        }
                                    });
                                }else{
                                    if(!me.data.logic4query){
                                        var menuId =oui.getParamByUrl(loadMenusUrl,'nodeId');
                                        var Portal=com.startwe.models.portal.web.PortalController;
                                        var menus = Portal.data.menus||[];
                                        var menu = oui.findOneFromArrayBy(menus,function(item){
                                            if(menuId == item.id){
                                                return true;
                                            }
                                        });
                                        if(menu){
                                            //传值到页面编辑
                                            var temp = oui.clone(menu.params||{});
                                            temp.logic4new = me.data.logic4new;
                                            temp.logic4query = me.data.logic4query;
                                            Portal.doActionByMenuConfig(menu,temp);
                                        }
                                    }else{
                                        //新增数据
                                        oui.getData(me.data.logic4query,{
                                            queryParam:oui.parseString([{
                                                field:'id',
                                                value:null
                                            }])
                                        },function(res){
                                            var logic4new = res.logic4new;
                                            me.data.logic4new = logic4new;

                                            var menuId =oui.getParamByUrl(loadMenusUrl,'nodeId');
                                            var Portal=com.startwe.models.portal.web.PortalController;
                                            var menus = Portal.data.menus||[];
                                            var menu = oui.findOneFromArrayBy(menus,function(item){
                                                if(menuId == item.id){
                                                    return true;
                                                }
                                            });
                                            if(menu){
                                                //传值到页面编辑
                                                var temp = oui.clone(menu.params||{});
                                                temp.logic4new = me.data.logic4new;
                                                temp.logic4query = me.data.logic4query;
                                                Portal.doActionByMenuConfig(menu,temp);
                                            }
                                        });
                                    }

                                }

                            }else{
                                //列表渲染
                                oui.getData(me.data.logic4query,{},function(res){
                                    var logic4new = res.logic4new;
                                    me.data.logic4new = logic4new;
                                    //获取列表的渲染模板
                                    //ajax 拉取列表模板
                                    //ajax拉取查询页面模板配置
                                    if(content.otherAttrs&&content.otherAttrs.queryPages&&content.otherAttrs.queryPages.length){

                                        var queryPageTplUrl = content.queryPageTplUrl||'';
                                        queryPageTplUrl = queryPageTplUrl||'res_engine/page-runtime/runtime-list.tpl.html';
                                        queryPageTplUrl = oui.getContextPath()+queryPageTplUrl;//查询页面模板
                                        content.listContent = oui.loadUrl(queryPageTplUrl);
                                        me.data.queryPage =content.otherAttrs.queryPages[0];
                                        var dynamicConditionFieldsIds = me.data.queryPage.dynamicConditionFields||[];
                                        var queryFieldsIds = me.data.queryPage.queryFields ||[];

                                        //处理查询模板
                                        var dynamicConditionFieldsMap = {};
                                        var queryFieldsMap={};
                                        me.data.queryPage.dynamicConditionFieldsMap= dynamicConditionFieldsMap;
                                        me.data.queryPage.queryFieldsMap= queryFieldsMap;
                                        if(me.data.queryPage.queryConditionShowType ==1){ //简单
                                            me.data.queryPage.queryConditionShowType4condition =10;

                                        }else if(me.data.queryPage.queryConditionShowType ==2){ //平铺
                                            me.data.queryPage.queryConditionShowType4condition =6;
                                        }else if(me.data.queryPage.queryConditionShowType ==3){//高级查询
                                            me.data.queryPage.queryConditionShowType4condition =2;
                                        }

                                        var relationTablesTree = me.data.queryPage.relationTablesTree||{};
                                        var ids = relationTablesTree.ids||[];
                                        var map = relationTablesTree.map ||{};
                                        oui.eachArray(ids,function(currId){
                                            var node = map[currId];
                                            if(node){
                                                if(node.node.nodeType=='mainForm' ||node.node.nodeType=='form'){
                                                    if(node.node.dynamicConditionFields){
                                                        oui.eachArray(node.node.dynamicConditionFields,function(field){
                                                            field.nodeId = currId;
                                                            dynamicConditionFieldsMap[currId+'_'+field.value] = field;
                                                        });
                                                    }
                                                    if(node.node.queryFields){
                                                        oui.eachArray(node.node.queryFields,function(field){
                                                            field.nodeId = currId;
                                                            queryFieldsMap[currId+'_'+field.value] = field;
                                                        });
                                                    }
                                                }
                                            }
                                        });

                                        var queryFields = [];
                                        var dynamicConditionFields = [];

                                        oui.eachArray(queryFieldsIds,function(fieldId){
                                            if(queryFieldsMap[fieldId]){
                                                queryFields.push(queryFieldsMap[fieldId]);
                                            }
                                        });
                                        oui.eachArray(dynamicConditionFieldsIds,function(fieldId){
                                            if(dynamicConditionFieldsMap[fieldId]){
                                                dynamicConditionFields.push(dynamicConditionFieldsMap[fieldId]);
                                            }
                                        });
                                        me.data.queryPage.queryFields= queryFields;
                                        me.data.queryPage.dynamicConditionFields = dynamicConditionFields;
                                    }else{
                                        //默认配置
                                    }

                                    var tplRender = template.compile(content.listContent||"");
                                    var html = tplRender(me.data);
                                    me.data.content = html;
                                    oui.parse({
                                        callback:function(){
                                            me.bindEvents();
                                        }
                                    });
                                });
                            }

                            return ;
                        }else{
                            me.data.content = content;
                        }
                        oui.parse({
                            callback:function(){
                                me.bindEvents();
                                if(nodeType=='page'){

                                    pageData.afterInit();//渲染完成
                                    me.refresh();
                                }
                            }
                        });
                    });

                }else{
                    oui.getTop().oui.alert(res.msg);
                }

            },'加载中...');
        },
        getView:function(menuId){
            var activeId =  menuId || this.data.activeTabId||'default';
            if(!this.refs){
                this.refs = {};
            }
            var view4currTab  = this.refs[activeId];
            if(!view4currTab){
                view4currTab = {
                    currTabId:activeId
                };
                this.refs[activeId] =view4currTab;
            }

            if(!view4currTab.refs){
                view4currTab.refs = {};
            }
            if(!view4currTab.data){
                view4currTab.data = {
                    currTabId:activeId
                };
            }
            return view4currTab;
        },
        refresh:function(){

        },
        getData:function(){
            var me = this;
            return me.data;
        },
        event2showChildMenus: function (cfg) {
            var menuId = $(cfg.el).attr('menu-id');
            var Portal=com.startwe.models.portal.web.PortalController;
            var menus = Portal.data.menus||[];
            var menu = oui.findOneFromArrayBy(menus,function(item){
                if(menuId == item.id){
                    return true;
                }
            });
            if(menu){
                Portal.doActionByMenuConfig(menu,menu.params||{});
            }
        },
        //查询回调
        searchCallback:function(condition){
            var me = com.startwe.models.page.web.PageRuntime;
            var pageId = me.data.nodeId.split('-')[0];
            var tb = oui.getById('list-'+pageId);
            tb&&tb.query(condition);
        },
        //取消查询回调
        searchCancelback:function(condition){
            var me = com.startwe.models.page.web.PageRuntime;
            var pageId = me.data.nodeId.split('-')[0];
            var tb = oui.getById('list-'+pageId);
            tb&&tb.query();
        },
        //从列表页面 跳转到新增页面
        event2new:function(cfg){
            var me = this;
            var menuId = $(cfg.el).attr('menu-id');
            var Portal=com.startwe.models.portal.web.PortalController;
            var menus = Portal.data.menus||[];
            var menu = oui.findOneFromArrayBy(menus,function(item){
                if(menuId == item.id){
                    return true;
                }
            });
            if(menu){
                //传值到页面编辑
                var temp = oui.clone(menu.params||{});
                temp.logic4new = me.data.logic4new;
                temp.logic4query = me.data.logic4query;
                Portal.doActionByMenuConfig(menu,temp);
            }
        },
        //发起审批
        event2start:function(cfg){
            var me = this;
            var menuId = $(cfg.el).attr('menu-id');
            var Portal=com.startwe.models.portal.web.PortalController;
            var menus = Portal.data.menus||[];
            var menu = oui.findOneFromArrayBy(menus,function(item){
                if(menuId == item.id){
                    return true;
                }
            });
            if(menu){
                //传值到页面编辑
                //访问 流程审批的发起页面
                var baseUrl = oui.getContextPath()+'portal4vue.html';
                var approvUrl = oui.getContextPath()+'res_engine/approval_form/approvalform.vue.html';
                approvUrl = oui.addParam(approvUrl,'formId',menu.id);
                var url = baseUrl+'#'+approvUrl;
                oui.openWindow({
                    title:'发起审批',
                    url:url
                });
            }
        },
        /***
         * 保存表单数据
         */
        saveFormData:function(success,error){
            var me = this;
            var saveUrl =  me.data.saveUrl;
            //保存 数据
            var container = $('.pg-block-cont .page-abs')[0];
            var flag = oui.checkForm(container);
            if(!flag){
                return;
            }


            var dataValue =  me.data.pageData.getFormValue();

            dataValue.id  = me.data.dataId;
            oui.postData(saveUrl,{
                formData:dataValue
            },function(res){
                //保存成功后 刷新列表页面
                if(res.success){
                    var menuId = me.data.nodeId +'-list';
                    var Portal=com.startwe.models.portal.web.PortalController;
                    var menus = Portal.data.menus||[];
                    var menu = oui.findOneFromArrayBy(menus,function(item){
                        if(menuId == item.id){
                            return true;
                        }
                    });
                    if(menu){
                        //传值到页面编辑
                        Portal.doActionByMenuConfig(menu,menu.params||{});
                    }
                    success&&success(dataValue,res);
                }else{
                    error&&error(dataValue,res);
                    oui.getTop().oui.alert(res.msg||'保存失败');
                }
            });
        },
        //编辑页面中的保存逻辑
        event2save:function(cfg){
            //TODO 处理保存逻辑
            var me = this;
            var saveUrl = $(cfg.el).attr('save-url');//保存逻辑
            //TODO 获取当前页面的表单数据
            //保存 数据
            var container = $(cfg.el).parent().parent()[0];
            var flag = oui.checkForm(container);
            if(!flag){
                return;
            }
            //TODO 保存业务数据处理
            var dataValue = oui.getFormValue(container);
            dataValue.id  = $(cfg.el).attr('save-id');
            oui.postData(saveUrl,{
                formData:dataValue
            },function(res){
                //保存成功后 刷新列表页面
                if(res.success){
                    var menuId = me.data.nodeId +'-list';
                    var Portal=com.startwe.models.portal.web.PortalController;
                    var menus = Portal.data.menus||[];
                    var menu = oui.findOneFromArrayBy(menus,function(item){
                        if(menuId == item.id){
                            return true;
                        }
                    });
                    if(menu){
                        //传值到页面编辑
                        Portal.doActionByMenuConfig(menu,menu.params||{});
                    }
                }else{
                    oui.getTop().oui.alert(res.msg||'保存失败');
                }
            });
        },
        event2edit:function(cfg){
            var menuId = $(cfg.el).attr('menu-id');
            var tableId = 'list-'+menuId;
            var table = oui.getById(tableId);
            var selects = table.getSelecteds();
            if(selects&&(selects.length!=1)){
                oui.getTop().oui.alert('只能选择一行数据');
                return;
            }
            var one = selects[0];
            if(one.extraAttrs&&one.extraAttrs.logic4load){
                var me = this;
                var Portal=com.startwe.models.portal.web.PortalController;
                var menus = Portal.data.menus||[];
                var menu = oui.findOneFromArrayBy(menus,function(item){
                    if(menuId == item.id){
                        return true;
                    }
                });
                if(menu){
                    //传值到页面编辑
                    var temp = oui.clone(menu.params||{});
                    temp.logic4load = one.extraAttrs.logic4load;
                    temp.logic4update = one.extraAttrs.logic4update;
                    /* logic4new: "/3qMRf2.biz?m=startwe&o_as=46f0e3c9be2837119c73392339d112eb79e3842b"
                     logic4query: "/Qzauu2.biz?m=startwe&o_as=5c2b72a975b4293821895194cc6b8c7c9e912c3d"
                     ***/
                    temp.logic4new = me.data.logic4new;
                    temp.logic4query = me.data.logic4query;
                    var key = 'dataObject'||'entity';
                    //temp.formData = one;
                    temp.editId = one.id;

                    oui.getData(temp.logic4load,{},function(res){
                        temp.formData = res[key];
                        Portal.doActionByMenuConfig(menu,temp);

                    });
                }
            }
        },
        event2remove:function(cfg){
            var menuId = $(cfg.el).attr('menu-id');
            var tableId = 'list-'+menuId;
            var table = oui.getById(tableId);
            var selects = table.getSelecteds();
            if(selects&&(selects.length!=1)){
                oui.getTop().oui.alert('只能选择一行数据');
                return;
            }
            var me = this;
            var one = selects[0];
            if(one.extraAttrs&&one.extraAttrs.logic4remove){
                var url = one.extraAttrs.logic4remove;
                oui.postData(url,{
                    id:one.id,
                    formData:{
                        id:one.id
                    }
                },function(res){
                    if(res.success){
                        var dialog = oui.getTop().oui.alert('删除成功');
                        setTimeout(function(){
                            dialog.hide();
                            var Portal=com.startwe.models.portal.web.PortalController;
                            var menus = Portal.data.menus||[];
                            var listMenuId = menuId+'-list';
                            var menu = oui.findOneFromArrayBy(menus,function(item){
                                if(listMenuId == item.id){
                                    return true;
                                }
                            });
                            if(menu){
                                //传值到页面编辑
                                Portal.doActionByMenuConfig(menu,menu.params||{});
                            }
                        },1000);
                    }else{
                        oui.getTop().oui.alert('删除失败');
                    }
                });
            }
        },
        bindEvents:function(){

        }
    };
    PageRuntime = oui.biz.Tool.crateOrUpdateClass(PageRuntime);
}());



