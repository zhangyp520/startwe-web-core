!(function () {
    var LogicGraph = {
        "package": "com.startwe.models.project.web",//com.startwe.models.project.web.LogicDesignController
        "class": "LogicDesignController",
        varPrefix:'var',
        init: function () {
            var me = this; 
            me.logicsTreeData = {};
            me.data.settings={}
            me.canEdit = true;
            template.helper('LogicGraph',this);

            //var urlParams = oui.getPageParam('urlParams')||{};


            //console.info(oui.getPageParam('urlParams'),"oui.getPageParam('urlParams')")

            var paramCfg = com.oui.absolute.AbsoluteDesign.paramCfg;
            
            var urlParams = {
                "id": top.oui.getPageParam('logicId'),
                "loadLogicUrl":  paramCfg.params.loadLogicUrl
            }

            if(me.getLogicSettingData().ref){
                var view4setting = me.getLogicSettingData().ref.getView();
                view4setting&&view4setting.destroy&&view4setting.destroy();
            }

            
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'logic-design',oui.parseJson(oui.parseString(urlParams)));

            me.init4menuActionEnums();
            me.data.logics = [];
            me.data.isShow4Conditions= false;
            me.data.id = id ||"";
            me.data.inputParams=[];
            me.data.outputParams=[];
            me.data.varParams=[];
            me.data.varIndex=0;
            
            me.init4Global();
  
            if(id){
                me.data.loadLogicUrl = urlParams.loadLogicUrl;
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
        /** ??????????????????????????????????????????????????????***/
        init4Global:function(){
            var me = this;
            me.data.global={
                inputParams:{
                    paramKey:'inputParams',
                    title:'????????????',
                    data:me.data.inputParams
                },
                varParams:{
                    paramKey:'varParams',
                    title:'????????????',
                    data:me.data.varParams
                },
                outputParams:{
                    paramKey:'outputParams',
                    title:'????????????',
                    data:me.data.outputParams
                }
            };
        },
        /*******
         * ??????????????????????????????????????????
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
        /*****
         * ?????????????????????????????? ??????????????????
         * @param fieldType
         * @returns {*}
         */
        findDefaultFieldTypeEnum:function(fieldType){
            var typeEnum = oui.fieldTypeEnum[fieldType];
            if(!typeEnum){
                typeEnum = oui.fieldTypeEnum.string_type;
            }
            return typeEnum;
        },
        /** ??????????????????*****/
        showConditionInfoAfter:function(info,obj){
            var me = com.startwe.models.project.web.LogicDesignController;
            if(me.data.isShow4Conditions){
                $(obj.getEl()).find('.group-condition-preview').show();
            }else{
                $(obj.getEl()).find('.group-condition-preview').hide();
            }
        },
        event2showOrHidePreview:function(cfg){
            var me = this;
            if(me.data.isShow4Conditions){
                me.data.isShow4Conditions= false;
            }else{
                me.data.isShow4Conditions= true;
            }
            var obj= oui.getTop().oui.getById('edit4logicCondition');
            if(me.data.isShow4Conditions){
                $(obj.getEl()).find('.group-condition-preview').show();
                $(cfg.el).find('.glyphicon').addClass('glyphicon-eye-open');
                $(cfg.el).find('label').text('????????????');
            }else{

                $(obj.getEl()).find('.group-condition-preview').hide();
                $(cfg.el).find('.glyphicon').removeClass('glyphicon-eye-open');
                $(cfg.el).find('label').text('????????????');
             }
        },
        /*****
         * ??????????????????????????????????????????????????? ??????????????????????????????
         * @param cfg
         * @param condition
         * @param value
         * @returns {Array}
         */
        filterField4SysVar:function (cfg, condition, value) {
            var me = com.startwe.models.project.web.LogicDesignController;
            var result = [];
            if (!condition) {
                return result;
            }
            var allVars = me.findAllVars();
            //??????,???????????????
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
        getCache:oui.getCache4include,
        getLogicSettingData:function (){
            var me = this;
            var inputParams = oui.clone(me.data.inputParams||[]);
            var outputParams = oui.clone(me.data.outputParams||[]);
            var varParams = oui.clone(me.data.varParams||[]);
            return this.getCache('logicSetting',{
                drawer:false,
                inputParams:inputParams,
                outputParams:outputParams,
                varParams:varParams,
                onUpdate:function (k,v,ov,options){
                    console.log('logic-graph-1.6.js ????????????????????????',arguments);
                    me.data.inputParams = oui.clone(v.inputParams ||[]);
                    me.data.outputParams = oui.clone(v.outputParams||[]);
                    me.data.varParams = oui.clone(v.varParams||[]);
                    me.onUpdate(k,v,ov,options);//ajax??????????????????
                }
            });
        },
        /***
         * ????????? ??????????????? ????????????
         * @param k
         * @param v
         */
        onUpdate:function (k,v,ov,options){

            this.saveDesign();
            console.log('logic-graph-1.6.js????????????????????? ',k,v,ov,options);
        },
        /*****
         * ??????????????????
         * @returns {Array}
         */
        findAllVars:function(){
            var me = this;
            var params = [];
            oui.findManyFromArrayBy(me.data.inputParams,function(item){
                var fieldTypeEnum = me.findDefaultFieldTypeEnum(item.fieldType);
                var defaultDataTypeEnum = me.findDefaultDataTypeEnum(fieldTypeEnum.dataType);
                params.push({
                    title:item.name+' ['+defaultDataTypeEnum.desc+'][????????????]',
                    fieldType:item.fieldType,
                    dataType:fieldTypeEnum.dataType,
                    opt:defaultDataTypeEnum.opt||'=',
                    controlType:defaultDataTypeEnum.controlType||'textfield',
                    showType:defaultDataTypeEnum.showType||0,
                    name:item.name
                });
            });
            oui.findManyFromArrayBy(me.data.varParams,function(item){
                var fieldTypeEnum = me.findDefaultFieldTypeEnum(item.fieldType);
                var defaultDataTypeEnum = me.findDefaultDataTypeEnum(fieldTypeEnum.dataType);
                params.push({

                    title:item.name+' ['+defaultDataTypeEnum.desc+'][????????????]',
                    fieldType:item.fieldType,
                    dataType:fieldTypeEnum.dataType,

                    opt:defaultDataTypeEnum.opt||'=',
                    controlType:defaultDataTypeEnum.controlType||'textfield',
                    showType:defaultDataTypeEnum.showType||0,
                    name:item.name
                });
            });
            oui.findManyFromArrayBy(me.data.outputParams,function(item){
                var fieldTypeEnum = me.findDefaultFieldTypeEnum(item.fieldType);
                var defaultDataTypeEnum = me.findDefaultDataTypeEnum(fieldTypeEnum.dataType);
                params.push({

                    title:item.name+' ['+defaultDataTypeEnum.desc+'][????????????]',
                    fieldType:item.fieldType,
                    dataType:fieldTypeEnum.dataType,
                    opt:defaultDataTypeEnum.opt||'=',
                    controlType:defaultDataTypeEnum.controlType||'textfield',
                    showType:defaultDataTypeEnum.showType||0,
                    name:item.name
                });
            });
            return params;
        },
        //???????????????????????????

        findFields4Conditions:function (){
            var me = this;
            var params = [];
            var arr = oui.util.transLogicVars2ConditionFields(me.data.inputParams,'????????????');
            var arr4vars = oui.util.transLogicVars2ConditionFields(me.data.varParams,'????????????');
            var arr4output = oui.util.transLogicVars2ConditionFields(me.data.outputParams,'????????????');
            params= params.concat(arr).concat(arr4vars).concat(arr4output);

            return params;
        },
        /***
         * ???????????????
         */
        findValueTypes4Conditions:function (){
            return oui.util.findValueTypeEnums("value,var,expr,callLogic");
        },
        findValueFields4conditions:function (){

            //1.????????????
            //2.????????????
            //3.??????????????????????????? ?????? ?????? ??????
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
        findVarsByFieldType:function(fieldType){
            var me = this;
            var allVars = me.findAllVars();
            var result =[];
            oui.findManyFromArrayBy(allVars,function(item){
                if(item.fieldType == fieldType){
                    result.push({
                        value: item.name,
                        display:item.title
                    });
                }
            });
            return result;
        },
        destroyLogicEditNodeDrawControllers:function (){
            var $el = $('#logic-drawer').find('.sider-logic-edit-drawer');
            if($el&&$el.length){
                var contorller= $el.attr('oui-controller');
                var $controllers = $el.find('[oui-controller]');
                var controllers = [contorller];
                $controllers.each(function (){
                    var temp = $(this).attr('oui-controller');
                    if(temp){
                        controllers.push(temp);
                    }
                });
                oui.destroyVueControllers(controllers);
            }
            $('#logic-drawer').append('<div class="sider-logic-edit-drawer"></div>');
        },
        /*****
         * ?????????????????????????????????
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
         * ???????????????????????????
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
         * ???????????????????????????
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
        getCurrentNodeData:function (){
            var me = this;
            var nodeId = this.data.settings.currentNodeId;
            var TreeMap = this.treeMap;
            var node = TreeMap.map[nodeId].node;
            return node;
        },
        findCurrentNodeExecuteData4Fields:function (){
            //?????????????????? ??????????????????
            var me = this;
            var nodeId = this.data.settings.currentNodeId;
            var node =  me.treeMap.findNode(nodeId);
            var tempExecutes = node.node.executeObjects||[];
            var arr =  oui.findManyFromArrayBy(tempExecutes,function(item4execute){
                if(item4execute.valueType!='callLogic'){
                    return true;
                }
            })||[];
            return arr;
        },
        findCurrentNodeExecuteData4Calllogic:function (){
            var me = this;
            var nodeId = this.data.settings.currentNodeId;
            var node =  me.treeMap.findNode(nodeId);
            var tempExecutes = node.node.executeObjects||[];
            var one =  oui.findOneFromArrayBy(tempExecutes,function(item4execute){
                if(item4execute.valueType=='callLogic'){
                    return true;
                }
            });
            if(one){
                if(typeof one.value =='string'){
                    one.value = oui.parseJson(one.value);
                }
            }else{
                one = {
                    value:{},
                    valueType:'callLogic'
                };
            }
            return one;
        },
        saveCurrentNodeData:function (nodeData,callback){
            var me = this;
            var nodeId = this.data.settings.currentNodeId;
            var TreeMap = this.treeMap;
            var node = TreeMap.map[nodeId].node = nodeData;
            this.saveDesign(callback);
        },
        init4menuActionEnums:function(){
            var me = this;
            me.menuActionEnum = {
                add:{ //???????????????
                    action:function(node,treeMap,logicGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            parentId:node.id,
                            inLoop: !!node.node.loopStart || !!node.node.inLoop,
                            prevId:'',
                            name:'????????????'
                        };
                        treeMap.addNode(newNode); //????????????
                        //??????????????????????????????????????????
                        logicGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                interfaceSettings:{//????????????
                    action:function(node,treeMap,logicGraph){
                        // //??????????????????????????????????????????
                        // var view = oui.getById('view-logic');
                        // var html = view.getHtmlByTplId('node-interface-tpl',{
                        //     treeMap:treeMap,
                        //     logicName:me.data.logicName,
                        //     nodeId:node.id
                        // });
                        // var lastDatas = oui.clone({
                        //     inputParams:me.data.inputParams,
                        //     outputParams:me.data.outputParams,
                        //     varParams:me.data.varParams
                        // });
                        // var dialog = oui.getTop().oui.showHTMLDialog({
                        //     title:'??????????????????',
                        //     contentStyle:'width:940px;',
                        //     content:html,
                        //     actions: [{
                        //         cls:'oui-dialog-cancel',
                        //         text:'??????',
                        //         action:function(){
                        //             dialog&&dialog.hide();
                        //             me.data.inputParams = lastDatas.inputParams||[];
                        //             me.data.outputParams = lastDatas.outputParams||[];
                        //             me.data.varParams = lastDatas.varParams||[];
                        //             me.init4Global();
                        //             return false;
                        //         }
                        //     },{
                        //         cls:'oui-dialog-ok',
                        //         text:'??????',
                        //         action:function(){

                        //             //????????????
                        //             if(!oui.checkForm(dialog.getEl())){
                        //                 oui.getTop().oui.alert('????????????????????????????????????');
                        //                 return ;
                        //             }
                        //             //????????????

                        //             var config = oui.getFormValue(dialog.getEl());
                        //             var inputParams = config.inputParams||[];
                        //             var outputParams = config.outputParams||[];
                        //             var varParams = config.varParams||[];
                        //             var tempAll =[];
                        //             var tempAll4Row =[];

                        //             var errorIds = [];
                        //             oui.findManyFromArrayBy(inputParams,function(item,index){
                        //                 var elId ='varName-inputParams-'+index+'-error';
                        //                 var tempName = $.trim(item.name||'');
                        //                 if(item.define){
                        //                     item.define= oui.parseJson(item.define);
                        //                 }else{
                        //                     item.define ='';
                        //                     delete item.define;
                        //                 }
                        //                 if(tempName){
                        //                     if(tempAll.indexOf(tempName)>-1){
                        //                         var one = oui.findOneFromArrayBy(tempAll4Row,function(temp4row){
                        //                             if(temp4row.value == tempName){
                        //                                 return true;
                        //                             }
                        //                         });
                        //                         if(one){
                        //                             if(!one.addFirst){
                        //                                 errorIds.push(one.id);
                        //                                 one.addFirst = true;
                        //                             }
                        //                         }
                        //                         errorIds.push(elId);
                        //                     }else{
                        //                         tempAll.push(tempName);
                        //                         tempAll4Row.push({value:tempName,addFirst:false,id:elId});
                        //                     }
                        //                 }
                        //             });
                        //             oui.findManyFromArrayBy(varParams,function(item,index){
                        //                 var elId ='varName-varParams-'+index+'-error';
                        //                 var tempName = $.trim(item.name||'');
                        //                 if(item.define){
                        //                     item.define= oui.parseJson(item.define);
                        //                 }
                        //                 if(tempName){
                        //                     if(tempAll.indexOf(tempName)>-1){
                        //                         var one = oui.findOneFromArrayBy(tempAll4Row,function(temp4row){
                        //                             if(temp4row.value == tempName){
                        //                                 return true;
                        //                             }
                        //                         });
                        //                         if(one){
                        //                             if(!one.addFirst){
                        //                                 errorIds.push(one.id);
                        //                                 one.addFirst = true;
                        //                             }
                        //                         }
                        //                         errorIds.push(elId);
                        //                     }else{
                        //                         tempAll.push(tempName);
                        //                         tempAll4Row.push({value:tempName,addFirst:false,id:elId});
                        //                     }
                        //                 }
                        //             });
                        //             oui.findManyFromArrayBy(outputParams,function(item,index){
                        //                 var elId ='varName-outputParams-'+index+'-error';
                        //                 var tempName = $.trim(item.name||'');
                        //                 if(item.define){
                        //                     item.define= oui.parseJson(item.define);
                        //                 }
                        //                 if(tempName){
                        //                     if(tempAll.indexOf(tempName)>-1){
                        //                         var one = oui.findOneFromArrayBy(tempAll4Row,function(temp4row){
                        //                             if(temp4row.value == tempName){
                        //                                 return true;
                        //                             }
                        //                         });
                        //                         if(one){
                        //                             if(!one.addFirst){
                        //                                 errorIds.push(one.id);
                        //                                 one.addFirst = true;
                        //                             }
                        //                         }
                        //                         errorIds.push(elId);
                        //                     }else{
                        //                         tempAll.push(tempName);
                        //                         tempAll4Row.push({value:tempName,addFirst:false,id:elId});
                        //                     }
                        //                 }
                        //             });
                        //             tempAll.length=0;
                        //             tempAll=null;
                        //             tempAll4Row.length=0;
                        //             tempAll4Row =null;
                        //             if(errorIds.length){//????????????
                        //                 var elSelector= '#'+errorIds.join(',#');
                        //                 $(elSelector).html('<i class="oui-error-info" title="???????????????">???????????????</i>');
                        //                 errorIds.length=0;
                        //                 errorIds=null;
                        //                 oui.getTop().oui.alert('????????????????????????????????????');
                        //                 return ;
                        //             }
                        //             me.data.inputParams = inputParams;
                        //             me.data.outputParams = outputParams;
                        //             me.data.varParams = varParams;
                        //             me.init4Global();
                        //             me.saveDesign();
                        //             dialog&&dialog.hide();
                        //             return false;
                        //         }
                        //     }]
                        // });
                        // oui.parse({container:dialog.getEl(),callback:function(){

                        // }});


                        //?????????????????? oui.util.loadComponent;//??????????????????????????????
                        // let logic_drawer = 'res_engine/page_design/pc/components-logic/search-setting-logic.vue.html';
                        // oui.util.loadComponent(logic_drawer,'','',document.querySelector("#logic-drawer .sider-logic-drawer"));

                        me.getLogicSettingData().ref.drawer = true;
                        me.getLogicSettingData().ref.inputParams = oui.clone(me.data.inputParams);
                        me.getLogicSettingData().ref.varParams = oui.clone(me.data.varParams);
                        me.getLogicSettingData().ref.outputParams = oui.clone(me.data.outputParams);
                        me.getLogicSettingData().ref.init();
                    }
                },
                edit:{//??????????????????,
                    action:function(node,treeMap,logicGraph){

                        me.data.settings.currentNodeId  = node.id;
                        var lastConditions = node.node.conditionObjects||[];
                        var callLogic4Execute =null; //???????????????????????????
                        var lastExecutes = node.node.executeObjects||[];
                        var executes =[];
                        var conditions= me.transConditions4front(lastConditions);
                        var tempExecutes = me.transConditions4front(lastExecutes);
                        oui.findManyFromArrayBy(tempExecutes,function(item4execute){
                            if(item4execute.valueType=='callLogic'){
                                callLogic4Execute = oui.parseJson(item4execute.value);
                            }else{
                                executes.push(item4execute);
                            }
                        });
                        var view = oui.getById('view-logic');
                        var html = view.getHtmlByTplId('node-edit-tpl',{
                            treeMap:treeMap,
                            queryLogicsUrl:me.data.queryLogicsUrl,
                            callLogic:callLogic4Execute,
                            nodeId:node.id
                        });
                        
                        //????????????
                        if(node.node.loopStart) {
                            let logic_drawer = 'res_engine/page_design/pc/components-logic/condition-setting-loop.vue.html';
                            var dom=document.querySelector("#logic-drawer .sider-logic-edit-drawer");
                            if(dom==null){
                                $('#logic-drawer').append('<div class="sider-logic-edit-drawer"></div>');
                            }
                            oui.util.loadComponent(logic_drawer,'','',document.querySelector("#logic-drawer .sider-logic-edit-drawer"));

                        }else{


                            let logic_drawer = 'res_engine/page_design/pc/components-logic/condition-setting-logic.vue.html';
                            var dom=document.querySelector("#logic-drawer .sider-logic-edit-drawer");
                            if(dom==null){
                                $('#logic-drawer').append('<div class="sider-logic-edit-drawer"></div>');
                            }
                            oui.util.loadComponent(logic_drawer,node,'',document.querySelector("#logic-drawer .sider-logic-edit-drawer"));

                        }
                    
                         

                      
                        // var dialog = oui.getTop().oui.showHTMLDialog({
                        //     title:'?????? ????????????',
                        //     contentStyle:'width:940px;',
                        //     content:html,
                        //     actions: [{
                        //         cls:'oui-dialog-cancel',
                        //         text:'??????',
                        //         action:function(){
                        //             dialog&&dialog.hide();
                        //             return false;
                        //         }
                        //     },{
                        //         cls:'oui-dialog-ok',
                        //         text:'??????',
                        //         action:function(){
                        //             //
                        //             var view4callLogic = oui.getTop().oui.getById('callLogic-temp');
                        //             if(!oui.checkForm(view4callLogic.getEl())){
                        //                 oui.getTop().oui.alert('????????????????????????????????????');
                        //                 return ;
                        //             }
                        //             var config = oui.getFormValue(dialog.getEl());
                        //             var node4update = config.node;
                        //             node.node.name =node4update.name;
                        //             var control =oui.getTop().oui.getById('edit4logicCondition');
                        //             conditions = control.getConditions();

                        //             conditions = me.transConditions4server(conditions);
                        //             var executeControl = oui.getTop().oui.getById('edit4logicExecute');
                        //             executes = executeControl.getConditions()||[];
                        //             executes = me.transConditions4server(executes);
                        //             node.node.conditionObjects = conditions;
                        //             node.node.executeObjects = executes;


                        //             var callLogic = config.callLogic;
                        //             if(callLogic&&callLogic.name){
                        //                 var data4callLogic = view4callLogic.getData();
                        //                 data4callLogic.callLogic.targetInputParams = callLogic.targetInputParams||[];
                        //                 data4callLogic.callLogic.targetOutputParams = callLogic.targetOutputParams||[];
                        //                 executes.push({
                        //                     valueType:'callLogic',
                        //                     value:oui.parseString(data4callLogic.callLogic)
                        //                 });
                        //             }
                        //             logicGraph.refreshByNodeId(node.id,treeMap);
                        //             me.saveDesign();
                        //             dialog&&dialog.hide();
                        //             return false;
                        //         }
                        //     }]
                        // });
                        // oui.getTop().oui.parse({container:dialog.getEl(),callback:function(){
                        //     var control =oui.getTop().oui.getById('edit4logicCondition');
                        //     control.fillback(conditions);
                        //     var executeControl = oui.getTop().oui.getById('edit4logicExecute');
                        //     executeControl.fillback(executes);
                        // }});

                    }
                },
                addLinkedQuery:{
                    action:function(node,treeMap,logicGraph){
                        me.data.settings.currentNodeId  = node.id;
                        let logic_drawer = 'res_engine/page_design/pc/components-logic/setting-linkedquery.vue.html';
                        var dom=document.querySelector("#logic-drawer .sider-logic-edit-drawer");
                        if(dom==null){
                            $('#logic-drawer').append('<div class="sider-logic-edit-drawer"></div>');
                        }
                        oui.util.loadComponent(logic_drawer,'','',document.querySelector("#logic-drawer .sider-logic-edit-drawer"));
                    }
                },
                add4join:{
                    action:function(node,treeMap,logicGraph){
                        if(!node.childIds ||(!node.childIds.length)||(node.childIds.length!=1)){
                            var newNode = {
                                id:treeMap.newId(),
                                parentId:node.id,
                                prevId:'',
                                name:'????????????'
                            };
                            treeMap.addNode(newNode); //????????????
                        }else {//????????????????????? ???????????????????????????
                            var childNode = treeMap.findNode(node.childIds[0]);
                            if(childNode){
                                var newNode = {
                                    id:treeMap.newId(),
                                    name:'????????????',
                                    prevId:'',
                                    parentId:childNode.parentId||""
                                };
                                treeMap.addParentNode(newNode,childNode); //????????????
                            }
                        }

                        //??????????????????????????????????????????
                        logicGraph.refreshByNodeId(node.prevId,treeMap);
                    }
                },
                addGrandson:{
                    /** ?????????????????? ***/
                    action:function(node,treeMap,logicGraph){
                        var newNode = {
                            id:treeMap.newId("join-"),
                            parentId:'',
                            prevId:node.id,
                            inLoop: !!node.node.loopStart || !!node.node.inLoop,
                            name:'????????????'
                        };
                        if(node.joinId){
                            oui.getTop().oui.alert('????????????????????????');
                            return ;
                        }
                        treeMap.addNode(newNode); //????????????
                        //??????????????????????????????????????????
                        logicGraph.refreshByNodeId(node.id,treeMap);
                    }
                },

                addParent:{//????????????????????? ??????????????????????????????
                    action:function(node,treeMap,logicGraph){
                        var newNode = {
                            id:treeMap.newId(),
                            name:'????????????',
                            inLoop: !!node.node.loopStart || !!node.node.inLoop,
                            parentId:node.parentId||""
                        };
                        var isRefreshRoot = !node.parentId;
                        treeMap.addParentNode(newNode,node); //????????????
                        if(isRefreshRoot){
                            logicGraph.refreshByRoot(treeMap);
                        }else{
                            logicGraph.refreshByNodeId(newNode.parentId,treeMap);
                        }
                    }
                },
                addBrother:{ //?????????????????????????????????????????????,??????????????????
                    action:function(node,treeMap,logicGraph){
                        if(!node.parentId){ //?????????????????????????????????
                            return ;
                        }
                        var newNode = {
                            id:treeMap.newId(),
                            name:'????????????',
                            inLoop: !!node.node.loopStart || !!node.node.inLoop,
                            parentId:node.parentId
                        };

                        treeMap.addBrotherNode(newNode,node); //????????????

                        logicGraph.refreshByNodeId(node.parentId,treeMap);
                    }
                },
                addLoop:{//??????????????????
                    action:function(node,treeMap,logicGraph){

                        var loopStart = {
                            id:treeMap.newId(),
                            name:'????????????',
                            loopStart:true,
                            parentId:node.id
                        };
                        treeMap.addNode(loopStart); //????????????
                        var loopEnd = {
                            id:treeMap.newId("join-"),
                            parentId:'',
                            loopEnd:true,
                            prevId:loopStart.id,
                            name:'????????????'
                        };
                        treeMap.addNode(loopEnd); //????????????

                        logicGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addSql:{//??????sql
                    action:function(node,treeMap,logicGraph){

                        var sqlStart = {
                            id:treeMap.newId(),
                            name:'??????SQL??????',
                            // loopStart:true,
                            parentId:node.id
                        };
                        treeMap.addNode(sqlStart); //????????????
                         

                        logicGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addBreak:{//??????break
                    action:function(node,treeMap,logicGraph){

                        var breakStart = {
                            id:treeMap.newId(),
                            name:'Break',
                            type:10,
                            // loopStart:true,
                            parentId:node.id
                        };
                        treeMap.addNode(breakStart); //????????????
                         

                        logicGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                addContinue:{//??????continue
                    action:function(node,treeMap,logicGraph){

                        var continueStart = {
                            id:treeMap.newId(),
                            name:'Continue',
                            type:11,
                            // loopStart:true,
                            parentId:node.id
                        };
                        treeMap.addNode(continueStart); //????????????
                         

                        logicGraph.refreshByNodeId(node.id,treeMap);
                    }
                },
                remove:{//??????????????????
                    action:function(node,treeMap,logicGraph){
                        //?????????????????????
                        if(!node.parentId){
                            if(node.childIds&&node.childIds.length==1){
                                //??????????????????????????????????????????????????????????????????????????????
                                treeMap.removeRoot(node);
                                logicGraph.refreshByRoot(treeMap);
                            }
                        }else{
                            var parentId = node.parentId;
                            treeMap.removeNode(node);
                            logicGraph.refreshByNodeId(parentId,treeMap);
                        }
                    }
                },
                remove4join:{
                    //join????????????????????????????????????
                    action:function(node,treeMap,logicGraph){
                        if(node.prevId){//???join??????
                            var childIdsAll = treeMap.findChildIdsAll(node.id);
                            if(childIdsAll.length){
                                for(var i= 0,len=childIdsAll.length;i<len;i++){
                                    treeMap.removeNode(treeMap.findNode(childIdsAll[i]));
                                }
                                logicGraph.refreshByNodeId(node.prevId,treeMap);
                            }
                        }
                    }
                },
                removeAll:{ //???????????????????????????
                    action:function(node,treeMap,logicGraph){
                        if(!node.parentId){
                            return ;
                        }
                        var parentId = node.parentId;
                        treeMap.removeNodeAll(node);
                        logicGraph.refreshByNodeId(parentId,treeMap);

                    }
                },
                removeAll4join:{ //???????????????????????????
                    action:function(node,treeMap,logicGraph){
                        if(node.prevId){//???join??????
                            treeMap.removeNodeAll4join(node);
                            logicGraph.refreshByNodeId(node.prevId,treeMap);
                        }

                    }
                },
                hideMenu:{
                    action:function(node,treeMap,logicGraph){

                    }
                },
                /** ??????????????????????????????????????????????????? *****/

                //            <!--swap,addParentByTarget,addBrotherByTarget,addChildByTarget,hideMenu4DragEnd -->
                swapSort:{
                    ///???????????????????????????
                    action:function(node,treeMap,logicGraph,targetNode){
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
                            logicGraph.refreshByNodeId(node.parentId,treeMap);
                        }

                    }
                },
                swap:{
                    /***
                     * ??????????????? ???????????? ?????? ???????????? ???????????????
                     * @param node
                     * @param treeMap
                     * @param logicGraph
                     * @param targetNode
                     */
                    action:function(node,treeMap,logicGraph,targetNode){
                        var id = node.id;
                        var targetId = targetNode.id;


                        var nodeName = treeMap.findNodeName(node.id);
                        var targetNodeName = treeMap.findNodeName(targetNode.id);
                        treeMap.updateNodeName(node.id,targetNodeName);
                        treeMap.updateNodeName(targetNode.id,nodeName);
                        //?????? ??????????????????????????????????????????
                        if(treeMap.isRoot(node.id) || treeMap.isRoot(targetNode.id)){
                            logicGraph.refreshByRoot(treeMap);
                        }else{
                            logicGraph.refreshByNodeId(node.parentId,treeMap);
                            logicGraph.refreshByNodeId(targetNode.parentId,treeMap);
                        }

                    }
                },
                addChildByTarget:{//??????????????????????????????????????????????????????????????????
                    action:function(node,treeMap,logicGraph,targetNode){
                        //???????????????????????????????????? ???????????????????????? ????????????
                        //???????????????????????????????????????????????????
                        //??????????????????
                        if(!node.parentId){ //?????????????????????????????????????????????
                            return ;
                        }
                        /****
                         * ???????????????????????? ????????????????????????
                         */
                        if(treeMap.hasParents(node.id,targetNode.id)){
                            return ;
                        }
                        /*****
                         * ?????????????????????????????????????????????????????????
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
                         * ???????????????????????????????????????????????????
                         */
                        var childIds= targetNode.childIds||[];
                        childIds.push(nodeId);
                        targetNode.childIds = childIds;

                        node.parentIds = [targetNode.id];
                        node.parentId = targetNode.id;

                        logicGraph.refreshByNodeId(targetNode.id,treeMap);
                        logicGraph.refreshByNodeId(lastParentId,treeMap);
                    }
                },
                hideMenu4DragEnd:{
                    action:function(node,treeMap,logicGraph,targetNode){

                    }
                }
            };

        },
        onUpdate4logic:function(outerControl){
            if((outerControl) &&(!outerControl.getValue())){
                //????????????
                var viewControl = oui.getById('callLogic-temp');
                var data = viewControl.getData();
                data.callLogic={};
                viewControl.render();
            }
        },
        //?????????????????????????????????
        logicSelectCallback:function(result){
            //??????result????????????????????????,???????????????????????????value?????????
            //???????????????????????????????????????dataCfg.data????????????,???dataCfg.data=[{value:'???????????????'}];
            //array ????????????

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
            var serverData = result.resources||[];
            oui.findManyFromArrayBy(serverData,function(item){
                item.value = item.name;
            });
            var??dataCfg=??{
                dataType:'array',??data:serverData,??fillback:function(selected){
                    var control = oui.getById('callLogic-temp');
                    var data =control.getData();
                    data.callLogic = {
                        id:selected.id,
                        name:selected.name,
                        inner:selected.inner,
                        inputParams:selected.inputParams||[],
                        outputParams:selected.outputParams||[],
                        targetInputParams:[],
                        targetOutputParams:[]
                    };
                    control.render();
                }
            };
            return dataCfg;
        },
        getCurrNodeData:function(nodeId){
            var me = this;
            var node =  me.treeMap.findNode(nodeId);
            var tempExecutes = node.node.executeObjects||[];
            var executes =[];
            var callLogic4Execute=null;
            oui.findOneFromArrayBy(tempExecutes,function(item4execute){
                if(item4execute.valueType=='callLogic'){
                    callLogic4Execute = oui.parseJson(item4execute.value);
                    return true;
                }
            });
            return {
                callLogic:callLogic4Execute
            };
        },
        init4emptyNodes:function(id){
            var me = this;
            me.data.logics = [];
            me.data.logics.push({"id":id||oui.getUUIDLong(),"parentId":null,"sort":0,"name":"start"});
        },
        load:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'load');
            oui.getData(me.data.loadLogicUrl||path,param,function(res){
                if(res.success){

                    console.info(res,'resresres')

                    var data = res.logicNodes||[];
                    me.data.logics=oui.parseJson(data);
                    me.data.logicName = res.logicName;
                    me.data.inputParams = oui.parseJson(res.inputParams||[]);
                    me.data.outputParams = oui.parseJson(res.outputParams||[]);
                    me.data.varParams = oui.parseJson(res.varParams||[]);
                    me.data.projectId = res.projectId||'';
                    me.data.queryLogicsUrl = res.queryLogicsUrl||'';    
                    me.data.saveLogicUrl = res.saveLogicUrl||'';
                    me.data.queryPageModelsUrl = res.queryPageModelsUrl||"";
                    me.data.createLogicApiUrl = res.createLogicApiUrl||"";
                    me.data.associationRuntimeQueryUrl = res.associationRuntimeQueryUrl||'';
                    me.data.formAndFieldList = res.formAndFieldList||null;
                    me.init4Global();
                    if((!me.data.logics)||(!me.data.logics.length)){
                        me.init4emptyNodes(param.id);
                    }
                    me.treeMap = me.array2logicTreeMap(me.data.logics,'id','parentId','name',true);
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'?????????...',function(err){
                oui.getTop().oui.alert(err);
            });
        },  
        /*<a href="#" oui-e-{{LogicGraph.treeMap.clickName}}="event2buildApi">??????api??????</a> <textarea id="build-api-textarea"></textarea>
         */
        event2buildApi:function(){
            var me = this;
            var createLogicApiUrl = me.data.createLogicApiUrl;
            oui.postData(createLogicApiUrl,{

            },function(res){
                if(res.success){
                    var url = (res.logicExecuteUrl||"");
                    oui.getTop().oui.showInputDialog("????????????api", function (desc) { 
                    }, [
                        {
                            type: "textarea",
                            value:url
                        }
                    ],{
                        contentStyle:'width:700px'
                    });
                    //$('#build-api-span').text(res.logicExecuteUrl||"");
                }else if(res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('????????????');
                }
            });
        },
        //????????????api??????
        event2buildTestApi:function(){
            var me = this;
            var createLogicApiUrl = me.data.createLogicApiUrl;
            oui.postData(createLogicApiUrl,{

            },function(res){
                if(res.success){
                    var url =location.origin+''+(res.logicTestExecuteUrl||"");
                    oui.getTop().oui.showInputDialog("??????????????????api", function (desc) {

                    }, [
                        {
                            type: "textarea",
                            value:url
                        }
                    ],{
                        contentStyle:'width:700px'
                    });
                    //$('#build-api-span').text(res.logicExecuteUrl||"");
                }else if(res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('????????????');
                }
            });
        },
        saveDesign:function(success){
           
            var me = this;
            var arr = me.treeMap2array(me.treeMap);
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'save');
            oui.postData(me.data.saveLogicUrl||path,{
                id:me.data.id,
                inputParams:me.data.inputParams||[],
                outputParams:me.data.outputParams||[],
                varParams:me.data.varParams||[],
                logicNodes:arr
            },function(res){
                if(res.success){
                    success&&success();
                }else if(res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('????????????');
                }
            });
        },
        saveQueryDesign:function(success){
           
            var me = this;
            var arr = me.treeMap2array(me.treeMap);
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'save');
            oui.postData(me.data.saveLogicUrl||path,{
                id:me.data.id,
                inputParams:me.data.inputParams||[],
                outputParams:me.data.outputParams||[],
                varParams:me.data.varParams||[],
                logicNodes:arr
            },function(res){
                if(res.success){
                    success&&success();
                }else if(res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('????????????');
                }
            });
        },
        event2save:function(){
            var me = this; 
            me.saveDesign(function(){
                var dialog = oui.getTop().oui.alert('????????????');
                setTimeout(function(){
                    dialog.hide();
                },800);
            });
        },
        saveLoopDesign:function(success){
            var me = this;
            var arr = me.treeMap2array(me.treeMap);
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'save');
            oui.postData(me.data.saveLogicUrl||path,{
                id:me.data.id,
                inputParams:me.data.inputParams||[],
                outputParams:me.data.outputParams||[],
                varParams:me.data.varParams||[],
                logicNodes:arr
            },function(res){
                if(res.success){
                    success&&success();
                }else if(res.msg){
                    oui.getTop().oui.alert(res.msg);
                }else{
                    oui.getTop().oui.alert('????????????');
                }
            });
        },
        hideMenu:function(){
            $('.node', '.logicchart').removeClass('allowedDrop');
            $('.allowedDropTarget', '.logicchart').removeClass('allowedDropTarget');
            $('.second-menu').remove();
        },
        /** ??????????????????****/
        bindEvents:function(){
            var me = this;
            if(me.canEdit) {
                me.dragData = {};
                $(document).on('dragstart', '.logicchart .node', function (e) {
                    $('.node', '.logicchart').removeClass('allowedDrop');
                    $('.allowedDropTarget', '.logicchart').removeClass('allowedDropTarget');
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
                $(document).on('dragover', '.logicchart .node', function (e) {
                    e.preventDefault();
                    var nodeId = $(e.target).attr('node-id');
                    if (!nodeId) {
                        return;
                    }
                    //console.log('dragover:'+nodeId);

                    //$(e.target).addClass('');
                });
                $(document).on('dragend', '.logicchart .node', function (e) {
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

                        $('.node', '.logicchart').removeClass('allowedDrop');
                        $('.allowedDropTarget', '.logicchart').removeClass('allowedDropTarget');

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
                /* ????????????????????????????????????????????????*****/
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
                    $(document).off('mousedown', '.logic-graph-content');
                }catch(err){
                }
                //.logic-graph-content
                $(document).on('mousedown', '.logic-graph-content', function (e) {
                    var $this = $('.logicchart');
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
                    var $chart = $('.logicchart');
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
         * ???????????? ????????????????????????????????????????????????????????????
         * @node
         * @treeMap
         * ***/
        refreshByNodeId:function(nodeId,treeMap){
            var view = oui.getById('view-logic');
            var html = view.getHtmlByTplId('logic-table-tpl',{
                treeMap:treeMap,
                nodeId:nodeId
            });
            var $table = $('[table-node-id='+nodeId+']','.logicchart');
            $table[0].outerHTML = html;
        },
        refreshByRoot:function(treeMap){
            var view = oui.getById('view-logic');
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
        /** ?????????treeMap ***/
        array2logicTreeMap:function(arr){
            var me = this;
            var treeMap = com.oui.TreeMap.array2treeMap(arr,'id','parentId','name',true);
            return treeMap;
        },
        /* treeMap?????????***/
        treeMap2array:function(treeMap){
            var me = this;
            var arr = com.oui.TreeMap.treeMap2array(treeMap);
            return arr;
        },
        /** ????????????****/
        data: {},
        /** ????????????***/
        getData: function () {
            console.info(LogicGraph.data,'LogicGraphdata')
            return LogicGraph.data;
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
        /** ?????????????????????***/
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
        /** ??????????????????**/
        findFieldTypes:function(){
            var me = this;
            if(!me.fieldTypeArray){
                me.fieldTypeArray = [];
                for(var i in oui.fieldTypeEnum){
                    me.fieldTypeArray.push({
                        value:oui.fieldTypeEnum[i].name,
                        display:oui.fieldTypeEnum[i].desc
                    });
                }
            }
            return me.fieldTypeArray;
        },
        /** ????????????????????????......******/

        /******
         * ??????????????? ???????????? ????????????
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
            var view = oui.getById('view-logic');
            var $node = $('.node[node-id='+targetNodeId+']','.logicchart');
            var html = view.getHtmlByTplId('node-menu-dragend-tpl',{
                nodeId:nodeId,
                targetNodeId:targetNodeId,
                treeMap:me.treeMap
            });
            $('.second-menu' ).remove();
            $('.logicchart').closest('.logic-graph-content').append(html);
            oui.follow4fixed($node[0],$('.second-menu')[0],true);
        },
        newVarName:function(){
            var me = this;
            var name = me.varPrefix+me.data.varIndex;
            me.data.varIndex++;
            return name;
        },
        /** ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????***/
        fieldTypeOnUpdate:function(control){
            var v = control.getValue();
            var id = control.attr('id');
            var ids = id.split('-');
            ids[0] ='tableModel';
            var outerId = ids.join('-');
            if(v&& v =='table_type'){
                $('#'+outerId).show();
            }else{
                $('#'+outerId).hide();
            }
            ids[0]='tableModelId';
            var elModelId = ids.join('-');
            ids[0]='tableModelDefineJson';
            var modeJsonId = ids.join('-');
            ids[0] ='tableModelName';
            var tableModelNameId = ids.join('-');
            oui.getById(elModelId).setValue('');
            oui.getById(modeJsonId).setValue('');
            oui.getById(tableModelNameId).setValue('');

        },
        /** ????????????????????????,?????????????????????????????????????????????key***/
        findInnerVars:function(){
            var me = this;
            if(!me.innerVars){
                //?????????????????????????????????
                me.innerVars=[{
                    value:'',
                    display:'??????????????????'
                },{
                    value:'formData',
                    display:'????????????(????????????)'
                },{
                    value:'dataList',
                    display:'??????????????????(????????????)'
                }];
            }
            return me.innerVars;
        },
        /** ????????????????????????????????????????????????*****/
        innerVarOnUpdate:function(control){
            var id = control.attr('id');
            var ids = id.split('-');
            ids[0]='varName';
            var varNameId = ids.join('-');
            oui.getById(varNameId).setValue(control.getValue());
        },
        /** ??????????????????????????????????????????????????????****/
        tableModelSelectCallback:function(result,control){
            var serverData = result.resources||[];
            oui.findManyFromArrayBy(serverData,function(item){
                item.value = item.name;
            });
            var??dataCfg=??{
                dataType:'array',??data:serverData,??fillback:function(selected){
                    var id = control.attr('id');
                    var ids = id.split('-');
                    ids[0]='tableModelId';
                    var elModelId = ids.join('-');
                    ids[0]='tableModelDefineJson';
                    var modeJsonId = ids.join('-');
                    oui.getById(elModelId).setValue(selected.id);
                    oui.getById(modeJsonId).setValue(oui.parseString(selected.define));
                }
            };
            return dataCfg;
        },
        /** ????????????????????????......******/
        /***
         * ????????????
          * @param cfg
         */
        event2addVar:function(cfg){
            var me = this;
            var paramKey = $(cfg.el).attr('param-key');
            var paramsData = me.data[paramKey]||[];
            paramsData.push({
                name:me.newVarName(),
                fieldType:oui.fieldTypeEnum.string_type.name
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
         * ??????????????????
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
            var view = oui.getById('view-logic');
            $('.allowedDrop','.logicchart').removeClass('allowedDrop');
            $('.second-menu' ).remove();
            var tplId ='node-menu-tpl';
            var node = me.treeMap.findNode(nodeId);
            console.log("??????????????????", node.node);
            // const nodeToEnd = me.treeMap.ids.slice(me.treeMap.ids.indexOf(node.node.id)) 
            // console.log('nodeToEnd', nodeToEnd);
            if( node.prevId ){
                tplId = 'node-menu4join-tpl';
            }else if( me.treeMap.isRoot(nodeId) ){
                tplId='node-menu-start-tpl';//????????????
            }


            var html = view.getHtmlByTplId(tplId,{
                nodeId:nodeId,
                treeMap:me.treeMap
            });
            $('.logicchart').closest('.logic-graph-content').append(html);
            oui.follow4fixed(cfg.el,$('.second-menu')[0],true);

        },
        event2menuAction:function(cfg){
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
 
            if(me.menuActionEnum[menuId]&&(notsaveIds.indexOf(menuId)<0)){ //??????????????????
                me.saveDesign();
            }
            $('.allowedDrop','.logicchart').removeClass('allowedDrop');
            $('.second-menu').remove();
            return false;
        },
        event2editNodeName:function(cfg){
            var nodeId = $(cfg.el).attr('node-id');
            var me = this;
            var view = oui.getById('view-logic');
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
         * ????????????????????????????????????????????????
         */
        renderOrgChartScale:function(count){
            var me = this;
            var $chart = $('.logicchart');
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
        /** ???????????????????????????****/
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
         * ?????????????????????
         * @param cfg
         */
        event2exportGraph:function(cfg){

            var $chartContainer = $('.logicchart');
            var me = this;
            var treeMap = me.treeMap;
            var name = me.data.logicName+'.png';
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
                $(cfg.el).removeClass('logicToolbar-group-icon-open');
                $(cfg.el).addClass('logicToolbar-group-icon-close');
                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.expandChildren(ids[i]);
                }
            }else{
                me.isRootChildrenUnExpand = true;
                $(cfg.el).removeClass('logicToolbar-group-icon-close');
                $(cfg.el).addClass('logicToolbar-group-icon-open');

                var ids = me.treeMap.findChildIds(me.treeMap.findRootId());
                for(var i= 0,len=ids.length;i<len;i++){
                    me.treeMap.unExpandChildren(ids[i]);
                }
            }
            me.refreshByRoot(me.treeMap);
        },
        /** ????????????****/
        test: function () {
            alert('hello test');
        }
    };
 
    LogicGraph = oui.biz.Tool.crateOrUpdateClass(LogicGraph);
}());



