/**
 * pc phone 公共common
 */
var test4Date = new Date();
(function () {
    var FlowBiz = {
        'package': 'oui.flow',
        'class': 'FlowCommon',
        flowData: {
        },
        isNotCheckSaved:false,// 默认需要再页面离开时校验 是否已经保存
        newId: 0, //生成数据关系id
        toProcessProps:false,//是否显示流程属性面板页签
        isVertical: true,//是否竖向输出
        zoomScale: 1, //缩放比例
        themeId: 1,// 1,底色填充 2、无底色填充
        newId4server: 2, //生成 前端jsuuid,默认占用 开始和结束节点
        contextMenus: {},
        //拦截方法Before用于执行 隐藏tips或者隐藏actionSheet弹框
        eventBefore2hideTipsOrActionSheetFunNames: 'event2setAutoBranch,event2setSelectBranch,event2deleteBranch,event2replaceNode,event2editProp,event2addNode,event2delNode,event2addBrotherNode,event2delCurrNode,event2trans,event2vertical,event2renderByThemeId',
        eventBefore2validateFunNames:'saveWorkFlow,event2addNode,event2addBrotherNode,event2replaceNode,event2editProp,event2trans,event2vertical,event2processProps,event2processGraph',
        /**
         * 设置拦截配置
         */
        setInterceptFuns: function (funNames, fun) {
            var arr;
            var _self = this;
            if (typeof funNames == 'string') {
                arr = funNames.split(',');
            } else {
                arr = funNames || [];
            }
            var funName;
            for (var i = 0, len = arr.length; i < len; i++) {
                funName = arr[i];
                if (!funName) {
                    continue;
                }
                _self[funName + 'Before'] = fun;
            }
        },
        /*
         *获取FlowUi方法
         */
        getFlowUi: function () {
            throw new Error('未实现getFlowUi方法');
        },
        getFlowBiz: function () {
            throw new Error('未实现getFlowBiz方法');
        },
        nodeIdMap: {}, //key为节点id ,值为 树结构的treeNode对象
        initStart: function (param) {
            var _self = this;
            _self.design4Runtime = oui.getParam('design4Runtime')=='true'?true:false;
            _self.offsetY = 100; //横向 160 纵向为100
            _self.x_distance_S = 60; //横向为80 纵向为60

            _self.x_distance = 180 - _self.offsetY; //横向120
            _self.y_distance = 100;
            _self.rootPosX = 150; //第一个节点 左偏移量

            _self.nodeWidth = 65;
            _self.nodeHeight = 65;
            _self.nodeSplitWidth = 16;
            _self.rootPosY = 10;

            _self.Events = {
                click: 'click', //pc 上点击事件,移动上轻触摸事件 touchstart
                actionMenu: 'contextmenu' //pc上 右键菜单事件,移动上用touchstart
            };
            if (oui.os.mobile) {
                _self.Events = {
                    click: 'tap', //pc 上点击事件,移动上轻触摸事件 touchstart
                    actionMenu: 'tap' //pc上 右键菜单事件,移动上用touchstart
                };
                _self.isVertical= true;
            }else{
                if(_self.isFlowNew){ // 在流程新建 时，默认pc为 横向
                    _self.flowData.viewType = _self.ViewType.horizontal.value;
                }
                _self.isVertical= false;
            }
            //if(_self.isVertical){
            //    _self.nodeHeight = 65+_self.nodeSplitWidth;
            //}
            var FlowUi = this.getFlowUi();
            FlowUi.setBiz(_self);
            _self.initAttrsByUrlParam();
            FlowUi.config = $.extend(true, FlowUi.config, FlowUi.themes[_self.themeId] || {});
            template.helper('oui', oui);
            template.helper('FlowBiz', _self);
            template.helper('console',console);
            oui.parse();
            FlowUi.render();
            _self.setInterceptFuns(_self.eventBefore2validateFunNames,function(cfg){ //校验拦截初始化
                //update formData
                //校验之前需要保存流程属性
                _self.updateWorkFlowProps(); //更新流程属性后 再校验 保证正确性
                var isCheck =  _self.validate();
                if(!isCheck){
                    return false;
                }
            });
        },
        /**
         * 根据url参数 初始化 FlowBiz的参数
         */
        initAttrsByUrlParam: function () {
            var urlparam = oui.getParam();
            var _self = this;
            for (var i in urlparam) {
                if ((urlparam[i] && urlparam[i] == 'true')) {
                    _self[i] = true;
                }
                else if ((urlparam[i] && urlparam[i] == 'false')) {
                    _self[i] = false;
                } else {
                    _self[i] = urlparam[i];
                }
            }
        },
        //初始化结束接口
        initEnd: function () {
            var _self = this;
            _self.inited = true;
            data  =_self.flowData;
            _self.oldProcessPropData = {
                name: data.name ||"",
                //rights: oui.parseString(data.rights ||[]),
                importance: data.importance
            };
            /** urldialog打开的场景 初始化完成后，根据外部传入workflowJSON渲染****/
        },
        /**
         * 当页面第一次改变后触发 效果改变接口
         */
        changeView :function(){

        },
        /**
         * 根据 服务端data数据 转换为前端需要的数据进行流程图显示
         * @param data
         * @returns {*}
         */
        serverData2Model: function () {
            var _self = this;
            var workFlowNodeList = _self.flowData.workFlowNodeList || [];
            var parentId = '';
            var nodeType = '';
            if(_self.flowData.viewType==_self.ViewType.vertical.value){ //横向纵向判断
                _self.isVertical = true;
            }else{
                _self.isVertical = false;
            }
            if(_self.isPreview){ //预览态流程 需要处理启动者的显示名称
                if(workFlowNodeList && workFlowNodeList[0] ){
                    workFlowNodeList[0].nodeDisplayName = _self.currLoginNodeName;
                    workFlowNodeList[0].nodeName=_self.currLoginNodeName;
                    workFlowNodeList[0].nodeId=_self.currLoginNodeId;
                }
            }
            for (var i = 0, len = workFlowNodeList.length; i < len; i++) {
                workFlowNodeList[i].name = workFlowNodeList[i].nodeDisplayName;

                parentId = workFlowNodeList[i].parentId || [];
                if (typeof parentId !== 'object') {
                    parentId = [parentId];
                }
                nodeType = workFlowNodeList[i].nodeType;
                if (nodeType && nodeType == 'join') {
                    workFlowNodeList[i].isJoin = true;
                }
                if (nodeType && nodeType == 'split') {
                    workFlowNodeList[i].isSplit = true;
                }
                if (nodeType && nodeType == 'end') {
                    workFlowNodeList[i].isEnd = true;
                }
                workFlowNodeList[i].id = workFlowNodeList[i].id + '';
                workFlowNodeList[i].pid = parentId ? parentId.join(',') : "";
                _self.nodePersonMap2nodePersonList(workFlowNodeList[i]);
            }
        },
        /**
         * 将流程节点上的 nodePersonMap转为 nodePersonList
         * @param node
         */
        nodePersonMap2nodePersonList:function(node){
            var _self = this;
            if(!_self.isIndex){
                return ;
            }
            var arr = [];
            node.nodePersonList = node.nodePersonList || arr;
            var comments = [];
            var nodePersonList = node.nodePersonList;
            for(var i= 0,len=nodePersonList.length;i<len;i++ ){
                if(nodePersonList[i].comment){
                    comments.push(nodePersonList[i].comment);
                }
            }
            node.comments = comments;
            //var nodePersonMap = node.nodePersonMap;
            //var comments = [];
            //for(var i in nodePersonMap){
            //    if(nodePersonMap[i].comment){
            //        comments.push(nodePersonMap[i].comment);
            //    }
            //    arr.push(nodePersonMap[i]);
            //}
            //node.comments = comments;
            //node.nodePersonList = arr;
        },
        /**
         * 前端模型数据转后端数据
         */
        model2ServerData: function () {
            var _self = this;
            var workFlowNodeList = _self.workFlowNodeList || [];
            var pid = '';
            var workFlowNodeNamesArr = [];
            for (var i = 0, len = workFlowNodeList.length; i < len; i++) {
                workFlowNodeList[i].nodeDisplayName = workFlowNodeList[i].name ||workFlowNodeList[i].nodeName;
                pid = (workFlowNodeList[i].pid + '') || '';

                if (workFlowNodeList[i].isSplit) {
                    workFlowNodeList[i].nodeType = "split";
                    workFlowNodeList[i].nodeName = undefined;
                    workFlowNodeList[i].nodeDisplayName = undefined;
                    workFlowNodeList[i].nodeId = undefined;
                }
                if (workFlowNodeList[i].isJoin) {
                    workFlowNodeList[i].nodeType = "join";
                    workFlowNodeList[i].nodeName = undefined;
                    workFlowNodeList[i].nodeDisplayName = undefined;
                    workFlowNodeList[i].nodeId = undefined;
                }
                if (workFlowNodeList[i].isEnd) {
                    workFlowNodeList[i].nodeType = "end";
                    workFlowNodeList[i].nodeName = undefined;
                    workFlowNodeList[i].nodeDisplayName = undefined;
                    workFlowNodeList[i].nodeId = undefined;
                }
                if(workFlowNodeList[i].nodeName){
                    workFlowNodeNamesArr.push(workFlowNodeList[i].nodeName);
                }
                workFlowNodeList[i].parentId = pid ? pid.split(',') : undefined;
            }
            _self.flowData.workFlowNodeNames= workFlowNodeNamesArr.join(","); // 将节点名称存放到 workFlowNodeNames上
            if(!_self.flowData.bizId){
                _self.flowData.bizId =  _self.flowData.moduleId;
                _self.flowData.bizType =  _self.flowData.moduleType;
            }
        },
        getFlowData: function () {
            var _self = this;
            _self.model2ServerData(); //先转换为后端需要的数据
            var flowData = _self.flowData;
            flowData.workFlowNodeList = _self.workFlowNodeList;
            return flowData;
        },
        /**
         *  流程保存成功回调
         * @param msg
         */
        saveWorkFlowCallback: function (msg, cfg) {
            console.log('save workflow callback...');
            var _self = this;
            var id = msg.id;
            msg.isNew = _self.isFlowNew;
            _self.flowData.id = id;
            //window.parent.oui.showAutoTips({content: '保存成功'});
            if (!cfg) {
                return;
            }
            var saveType = $(cfg.el).attr('saveType');
            if (saveType == 'save4test') { //保存并测试返回结果
                //根据Id 查询 流程定义数据 并根据id获取数据 验证所有属性的回填情况

                //_self.getWorkFlowFromServer(cfg); //根据Id请求服务端 流程数据
            }
            var saveWorkFlowCallbackBiz = _self.moduleBizController || $(cfg.el).attr('saveWorkFlowCallbackBiz');

            if(saveWorkFlowCallbackBiz && (saveType=='save4test')){
                var successFun = function(msg){
                    _self.getWorkFlowFromServerCallback(msg, cfg, id);
                }
                var errorFun = function(msg){
                    _self.getWorkFlowFromServerError(msg, cfg, id);
                };
                var saveSuccess = function(msg){
                    eval(saveWorkFlowCallbackBiz + '.getWorkFlowFromServer(successFun,errorFun);');
                }
                var saveError = function(msg){
                    eval(saveWorkFlowCallbackBiz + '.getWorkFlowFromServer(successFun,errorFun);');
                }
                try {
                    eval(saveWorkFlowCallbackBiz+'.saveWorkFlowSuccess(msg,cfg,saveSuccess,saveError)');

                } catch (eve) {
                    throw eve;
                }
            }
            if (saveWorkFlowCallbackBiz) {

                try {
                    eval(saveWorkFlowCallbackBiz + '.saveWorkFlowSuccess(msg,cfg);');
                } catch (eve) {
                    throw eve;
                }
            }
            //console.log(msg); //保存成功回调
        },
        /**
         * 流程保存失败回调
         * @param msg
         */
        saveWorkFlowError: function (msg, cfg) {
            var _self = this;
            if (typeof msg == 'string') {
                console.log(msg);
            }
            console.log('保存流程模板失败');
            if (!cfg) {
                return;
            }
            var saveWorkFlowCallbackBiz = _self.moduleBizController || $(cfg.el).attr('saveWorkFlowCallbackBiz');
            if (saveWorkFlowCallbackBiz) {
                if(eval(saveWorkFlowCallbackBiz) ==_self){
                    return ;
                }

                try {
                    eval(saveWorkFlowCallbackBiz + '.saveWorkFlowError(msg,cfg);');
                } catch (eve) {
                    throw eve;
                }
            }
        },
        /**
         * 获取服务端流程数据 回调
         * @param msg
         * @param cfg
         * @param id
         */
        getWorkFlowFromServerCallback: function (msg, cfg, id) {
            //console.log('加载服务端流程数据数据成功:id=' + id);
            //console.log(msg);
            var _self = this;
            if (!cfg) {
                return;
            }
            if (!cfg.el) {
                return;
            }
            var saveType = $(cfg.el).attr('saveType');
            if (saveType == 'save4test') { //保存并测试返回结果
                var currFlowData = _self.getFlowData();
                _self.testCompareJson(currFlowData, msg);
            }
        },
        testCompareJson: function (leftJson, rightJson) {
            var Tool = oui.biz.Tool;
            var _self = this;
            var leftJsonStr = Tool.encode(leftJson);
            var rightJsonStr = Tool.encode(rightJson);
            if (typeof oui.showCompareJsonDialog == 'undefined') {

                Tool.require(['res_engine/workflow/compareJson.js'], function () {
                    _self.testCompareJson4recuired(leftJsonStr, rightJsonStr);
                });
                return;
            }
            _self.testCompareJson4recuired(leftJsonStr, rightJsonStr);
        },
        /**
         * 如果已经加载了请求资源则直接调用测试 json比较工具
         * @param leftJson
         * @param rightJson
         */
        testCompareJson4recuired: function (leftJson, rightJson) {
            oui.getTop().oui.showCompareJsonDialog({leftJson: leftJson, rightJson: rightJson});
        },
        getWorkFlowFromServerError: function (msg, cfg, id) {
            console.log('加载服务端流程数据数据失败;id=' + id);
            console.log(msg);

        },
        /**
         *  根据流程id获取服务端数据
         */
        getWorkFlowFromServer: function (cfg) {
            var _self = this;
            oui.getTop().oui.alert('流程图 没有实现getWorkFlowFromServer接口');
            //var id = _self.flowData.id;
            //var contextPath = oui.getContextPath();
            //var flowId = oui.getPageParam('encodeFlowId');
            //var url = oui.addParams(contextPath + "workflow/workflow.do", {flowId: id});
            //url = attachSecurityParam(url,flowId);
            //oui.getData(contextPath + "workflow/workflow.do",url, function (result) {
            //    if (result.success) {
            //        var msg = oui.parseJson(result.msg);
            //        _self.getWorkFlowFromServerCallback(msg, cfg, id);
            //    } else {
            //        _self.getWorkFlowFromServerError(msg, cfg, id);
            //    }
            //});
        },
        /**
         * 更新流程属性
         */
        updateWorkFlowProps:function(){
            var _self = this;
            if(!$.trim($("#flow-ui-processProp").html())){ //没有渲染过流程属性面板
                return ;
            }
            var data = _self.getFlowData();
            var propData = oui.getFormValue();
            var propData4Display = oui.getFormData();
            if(propData.selectPerson4right){
                propData.selectPerson4right = propData4Display.selectPerson4right;
            }
            $.extend(true,data,propData);
            var selectPerson4right = propData.selectPerson4right ||'[]';
            var selectPerson4rightJson = oui.parseJson(selectPerson4right);
            var rights = [];
            for(var i= 0,len=selectPerson4rightJson.length;i<len;i++){
                rights.push({
                    toId:selectPerson4rightJson[i].id,
                    toName:selectPerson4rightJson[i].name,
                    toType:selectPerson4rightJson[i].typeFlag
                });
            }
            data.rights = rights;
        },
        ///**
        // * 将流程表单 转为应用表单
        // * @param cfg
        // */
        //transToApp:function(cfg){
        //    var formId =oui.getParam('moduleId'); //表单Id
        //    var _self = this;
        //    var url = oui.getContextPath() + "form/form.do?method=formAppRight&formId=" + formId;
        //    oui.getTop().oui.confirmDialog('确认转换为无流程表单',function(){
        //        if(oui.os.mobile){
        //            //TODO 移动端  url路径与pc端路径不同
        //            oui.go('appAuthority', {
        //                formId: formId
        //            },true);
        //            return ;
        //        }
        //        window.parent.location.href =url;
        //    },function(){
        //
        //    },{title:'确认？'});
        //},
        /**
         * 触发页面改变逻辑
         */
        changed:function(){
            var _self = this;
            if(!this.isEdit){
                return;
            }
            if (this.inited) {
                this.hasChange = true;
                this.changeView();
            }
        },

        /**
         * 判断页面是否改变
         * @returns {boolean}
         */
        hasSaveData:function(){
            var _self = this;
            if(_self.isNotCheckSaved){
                return true;
            }

            //_self.updateWorkFlowProps(); //首先更新 流程属性
            //var oldData= _self.oldProcessPropData;
            //var flowData = _self.flowData;
            //if(oldData.importance != flowData.importance){ //判断流程重要程度是否变更
            //    return false;
            //}
            //if(oldData.name != flowData.name){ //判断流程名称是否变更
            //    return false;
            //}
            //if(oldData.rights != oui.parseString(flowData.rights ||[])){ //判断 流程权限是否变更
            //    return false;
            //}
            return !this.hasChange;
        },
        /***保存时需要清空 缓存的Dialog对象 ***/
        clear4topDialog:function(){
            try{
                var _self = this;
                if(_self.editPropDialog){
                    var el = _self.editPropDialog.getEl();
                    oui.getTop().oui.clearByContainer(el);
                    oui.getTop().$(el).remove();
                }
                if(_self.editBranchDialog){
                    var el = _self.editBranchDialog.getEl();
                    oui.getTop().oui.clearByContainer(el);
                    oui.getTop().$(el).remove();
                }
            }catch(e){

            }
        },
        /**
         * 保存工作流定义
         */
        saveWorkFlow: function (cfg) {
            var _self = this;
            var data = _self.getFlowData();
            var contextPath = oui.getContextPath();
            //保存前校验
            var isCheck = oui.validate4value(data.workFlowNodeList.length,{
                failMsg:'流程节点数不能小于{{validateValue}}' ,
                minValue:_self.ValidateConfig.workFlowNodeListMinSize,
                failMode:_self.ValidateConfig.failMode
            });
            if(!isCheck){
                return false;
            }
            _self.clear4topDialog();
            //_self.saveWorkFlowCallback.call(_self, data, cfg);
            var saveUrl = oui.getPageParam('saveWorkFlowUrl');
            oui.postData(saveUrl, data, function (response) {
                if (response.success) {
                    _self.hasChange = false; //保存提交后 ，数据为没改变状态
                    _self.isNotCheckSaved = true; //保存提交后， 不需要校验是否保存
                    var msg = oui.parseJson(response.msg);
                    _self.saveWorkFlowCallback.call(_self, msg, cfg);
                }
            }, function (msg) {
                _self.saveWorkFlowError.call(_self, msg, cfg);
            });
        },
        /**
         * 初始化默认值
         */
        init4default:function(){
            var _self = this;
            $.extend(true,_self,{
                flowData:{
                    state:_self.StateEnum.enable.value,
                    viewType:_self.ViewType.vertical.value,
                    importance:_self.WorkFlowImportance.normal.value
                }
            })
        },
        /**
         * 转到我的列表页面
         */
        event2formList:function(){
            var _self = this;
            _self.clear4topDialog();
            var url = oui.getPageParam("returnFormListUrl");
            var param = {
                formType:"bizForm"
            };
            url = oui.addParams(url,param);
            oui.getTopMain().oui.go(url,{},true);
            return false;
        },
        /**
         * 清空流程节点
         */
        clearNodes:function(cfg){
            var _self = this;
            /** 清空后，权限只能是默认编辑****/
            //var lastFirstNode = _self.workFlowNodeList[0];
            //lastFirstNode = lastFirstNode || _self.emptyNodes[0];
            //var formRight = lastFirstNode.formRight ||'-2';
            _self.workFlowNodeList = [];

            $.each(_self.emptyNodes,function(){
                _self.workFlowNodeList.push($.extend(true,{},this));
            });
            _self.workFlowNodeList[0].formRight = '-2';
            _self.flowData.workFlowNodeList = _self.workFlowNodeList;
            _self.serverData2Model();
            _self.refresh();
        },
        /** 初始化空节点 **/
        initEmptyNodes:function(workFlowJson,param){
            var _self = this;
            var arr = [//发起人的默认权限时撤销流程
                {"id":"jsuuid-1","nodeType":'person',"nodeDisplayName":"发起人",formRight:'-2',nodeRight:_self.WorkFlowNodeRight.cancel.name, "nodeName":param.currLoginNodeName,'nodeId':param.currLoginNodeId},
                {"id":"jsuuid-2","nodeType":'end',"nodeName":"end","nodeId":"end","parentId":["jsuuid-1"]}
            ];
            if((!workFlowJson) || (!workFlowJson.workFlowNodeList) ||(workFlowJson.workFlowNodeList.length<2) ){
                _self.emptyNodes = arr;
                return _self.emptyNodes;
            }
            _self.emptyNodes = [
                {"id":workFlowJson.workFlowNodeList[0].id,"nodeType":'person',"nodeDisplayName":"发起人" ,nodeRight:workFlowJson.workFlowNodeList[0].nodeRight||"","nodeName":param.currLoginNodeName,'nodeId':param.currLoginNodeId},
                {"id": workFlowJson.workFlowNodeList[workFlowJson.workFlowNodeList.length-1].id,"nodeType":'end',"nodeName":"end","nodeId":"end","parentId":[workFlowJson.workFlowNodeList[0].id]}
            ];
            return _self.emptyNodes;
        },
        /**默认值全部勾选 ****/
        findNodeRightValue:function(node){
            var _self = this;
            if(node&&node.nodeRight){
                return node.nodeRight;
            }else{
                return [_self.WorkFlowNodeRight.addNodes.name,_self.WorkFlowNodeRight.rollBack.name,_self.WorkFlowNodeRight.stop.name,_self.WorkFlowNodeRight.notify.name].join(',')
            }
        },
        /**
         * 初始化流程图渲染
         */
        init: function (param) {
            /** 初始化 判断是否在弹框里面设置了流程图数据***/
            var ouiInDialog = oui.getParam('ouiInDialog');
            var ouiDialogId = oui.getParam('ouiDialogId');
            if(ouiDialogId&&ouiInDialog){
                var currDialog = oui.getCurrUrlDialog();
                if(currDialog){
                    var workflowJSON = currDialog.attr('workflowJSON');
                    if(workflowJSON){
                        if(typeof workflowJSON =='object'){
                            workflowJSON =oui.parseString(workflowJSON);
                            workflowJSON = workflowJSON.replace(/jsuuid-/ig,oui.getUUIDLong());
                        }
                        param.workFlowJSONStr = workflowJSON;
                    }
                }
            }

            if((!param) || (typeof param !='object')){
                throw new Error('oui.flow.FlowBiz.init流程初始化必须传入对象参数');
                return ;
            }
            var sd = new Date();
            var _self = this;
            /************************************* 一、初始化流程中属性的默认值*********************************************/
            _self.init4default();
            /************************************* 二、url参数处理*********************************************/
            _self.urlParam =oui.getParam() ||{}; //保存url参数
            if( (!_self.urlParam.method) || (_self.urlParam.method=='viewFlowDiagram')  ){
                _self.isIndex = true;
            }else{
                _self.isIndex = false;
            }

            if(_self.urlParam.hideSaveButton && _self.urlParam.hideSaveButton =='true'){ //隐藏保存按钮
                _self.isHideSaveButton = true; //是否隐藏保存按钮
            }else{
                _self.isHideSaveButton = false;
            }
            if(_self.isIndex){
                _self.isHideSaveButton = true;
            }
            /************************************* 三、流程初始化页面传入参数逻辑处理******************************/
            var workFlowJson = null;
            if(param.workFlowJSONStr && (param.workFlowJSONStr !='null')){
                /** 更新 */
                workFlowJson = oui.parseJson(param.workFlowJSONStr);
                /*** 缓存发起节点和结束节点 */
                _self.initEmptyNodes(workFlowJson,param);
            }else{
                /** 新增 **/
                /*** 缓存发起节点和结束节点 */
                _self.initEmptyNodes(null,param);
                var arr = [];
                $.each(_self.emptyNodes,function(){
                   arr.push($.extend(true,{},this));
                });
                workFlowJson ={
                    workFlowNodeList:arr
                };
            }

            param.flowData = workFlowJson;
            if(param.isPreview){
                param.isHideSaveButton = true;
            }
            /************************************** 四、与业务模块集成流程的 逻辑处理 api调用  开始*****************/
            var controller = $('body',window.parent.document).attr('oui-controller');
            var moduleBizController =controller;
            if(controller && (window !=window.parent)){ //流程图 被父页面通过iframe嵌套了
                moduleBizController = 'window.parent.'+controller;
            }else{ //页面 include html集成 业务模块类型通过url参数传入,其他参数在模块业务类中定义相关接口
                //通过url传入 模块类型参数, 模块业务中实现相关逻辑
                moduleBizController= window.FlowBizModuleController; //根据业务模块定义 业务控制器类
                 // window open的页面集成 或者url参数传入的集成方式
                //TODO 需要完善 集成逻辑 //所有参数接口通过url参数定义

            }
            try{
                if((!param.workFlowJSONStr) || (param.workFlowJSONStr=='null')){ //新建时根据父页面的api获取模块信息,或者根据集成的业务模块api获取模块信息
                    var json = eval(moduleBizController+'.getWorkFlowJson4String()');//接口获取
                    var moduleJson = oui.parseJson(json);
                    $.extend(true,param.flowData,moduleJson);
                }
            }catch (e){

            }
            $.extend(true, _self, param); //将参数拷贝到 oui.flow.FlowBiz上
            /************************************ 五、服务端数据转前端渲染数据、pc端、phone端等业务子类的初始化开始的调用*********/
            _self.moduleBizController = moduleBizController; //初始化存放 外部模块的biz类

            _self.serverData2Model(); //服务端数据转换为前端数据
            _self.initStart(param); //初始化参数 ，并将url参数存到 FlowBiz上

            if(_self.isEdit){ //编辑态对流程节点属性编辑时所需
                _self.chooseTypeItemsJson = oui.parseString([
                    {display:_self.WorkFlowChooseType.single.desc,value:_self.WorkFlowChooseType.single.value},
                    {display:_self.WorkFlowChooseType.multi.desc,value:_self.WorkFlowChooseType.multi.value},
                    {display:_self.WorkFlowChooseType.all.desc,value:_self.WorkFlowChooseType.all.value},
                    {display:_self.WorkFlowChooseType.competition.desc,value:_self.WorkFlowChooseType.competition.value}
                ]);
                _self.nodeRightItemsJson = oui.parseString([
                    {display:_self.WorkFlowNodeRight.addNodes.desc,value:_self.WorkFlowNodeRight.addNodes.name},
                    {display:_self.WorkFlowNodeRight.rollBack.desc,value:_self.WorkFlowNodeRight.rollBack.name},
                    {display:_self.WorkFlowNodeRight.stop.desc,value:_self.WorkFlowNodeRight.stop.name}
                    ,
                    {display:_self.WorkFlowNodeRight.notify.desc,value:_self.WorkFlowNodeRight.notify.name}

                ]);
                _self.nodeRightItemsJson4notify = oui.parseString([
                    {display:_self.WorkFlowNodeRight.notify.desc,value:_self.WorkFlowNodeRight.notify.name}
                ]);
                _self.nodeRightItemsJson4cancel = oui.parseString([
                    {display:_self.WorkFlowNodeRight.cancel.desc,value:_self.WorkFlowNodeRight.cancel.name}
                ]);
                _self.otherAttrs4notifyNodeJson = oui.parseString({ notifyJson:oui.parseJson(_self.nodeRightItemsJson4notify),nodeRightItemsJson:oui.parseJson(_self.nodeRightItemsJson)});

                //节点属性 弹出框 的确定 取消按钮数组
                _self.nodePropDialogActions = [{text:"确定",
                    id:"confirm-ok",
                    cls:'oui-dialog-ok',
                    action: function(){
                        var isCheck = _self.updateNodeProp();
                        if(!isCheck){ //校验不通过
                            return ;
                        }
                        _self.clearNodePropOuiControls();
                        _self.editPropDialog.hide();
                    }
                }, { cls:'oui-dialog-cancel',
                    text:"取消",
                    id:"cancel",
                    action:function(){
                        _self.clearNodePropOuiControls();
                        _self.editPropDialog.hide();
                    }
                }];
                _self.branchEditActions =[{text:"确定",
                    id:"confirm-ok",
                    cls:'oui-dialog-ok',
                    action: function(){
                        var flag = _self.updateNodeBranch();
                        if(typeof flag =='boolean'){
                            if(!flag){
                                return ;
                            }
                        }
                        _self.editBranchDialog.hide();
                    }
                }, { cls:'oui-dialog-cancel',
                    text:"取消",
                    id:"cancel",
                    action:function(){

                        _self.editBranchDialog.hide();
                    }
                }];
                if((!_self.formRightHtml)&&(oui.os.mobile)){
                    var cellRightUrl = oui.getPageParam('cellRightUrl');
                    if(!_self.design4Runtime){//不设计态为自由流程运行态设计
                        _self.formRightHtml = oui.loadUrl(cellRightUrl,true,false);
                    }

                }
            }
            //url参数包括 hideSaveButton, currentNodeId ,当前处理的节点Id (uuid)
            var workFlowNodeList = _self.flowData.workFlowNodeList ? _self.flowData.workFlowNodeList : arr;//流程结构化数据
            _self.workFlowNodeList = workFlowNodeList;//保存到_self上
            if((typeof _self.currentNodeIdx !='undefined') && _self.currentNodeIdx >= 0){//当前高亮节点索引
                _self.currentNodeId =_self.workFlowNodeList[_self.currentNodeIdx].id || null;
            }else{
                _self.currentNodeId = null;
            }
            _self.refresh();
            _self.bindEvents();
            this.initEnd();
        },

        /**
         * 设置业务模块的控制器
         * @param controller
         */
        setModuleBizController:function(controller){
            var _self = this;
            _self.moduleBizController = controller;
        },
        ADD_TYPE: oui.SelectPerson_ADD_TYPE, //引用 oui-common中的选人类型
        /**
         * 绑定事件公共接口
         */
        bindEvents: function () {
        },
        /*** 显示编辑按钮****/
        event2showEditIcon:function(cfg){
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeid');
            var currNode = _self.nodeIdMap[nodeId];
            if(_self.isEdit &&(currNode&&currNode.nodeType !='end')){
                $(cfg.el).attr('href',$(cfg.el).attr('node-img-high-src'));
            }
        },
        /* 隐藏编辑按钮*****/
        event2hideEditIcon:function(cfg){
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeid');
            var currNode = _self.nodeIdMap[nodeId];
            if(_self.isEdit &&(currNode&&currNode.nodeType !='end')){
                $(cfg.el).attr('href',$(cfg.el).attr('node-img-src'));
            }
        },
        /**
         * 显示菜单前 验证节点是否是 split节点
         */
        event2contextMenuBefore: function (cfg) {
            var _self = this;
            var nodeId;
            var toId= $(cfg.el).attr('toId');
            if(_self.isPreview){
                /**如果是预览态，并且不是分支条件 查看 则返回 ***/
                if(!toId){
                    return false;
                }
            }
            if(toId){
                if(_self.design4Runtime){//自由流程 运行态用设计态进行设计 不支持分支和条件
                    return false;
                }
                //if(true){
                //    return false;
                //}
                /*** 移动端不支持 线条事件 设置条件 查看条件 ***/
                if(oui.os.mobile){
                    return false;
                }
                //线条
                nodeId = toId;
                var fromId = $(cfg.el).attr('fromId');
                if(!fromId){
                    return false;
                }
                var fromNode = _self.nodeIdMap[fromId];
                if(!fromNode){
                    return false;
                }
                var treeNode = _self.nodeIdMap[nodeId];
                if(treeNode && treeNode.notifyNode){ //知会节点不能设置分支条件
                    return false;
                }
                if(treeNode&& treeNode.isSplit){ //split节点不设置事件
                    return false;
                }
                if(!fromNode.isSplit){
                    /** 不是运行态则返回***/
                    if(!(_self.isIndex || _self.isPreview)){
                        return false;
                    }else{
                        /**运行态 考虑 分支条件剔除的情况 **/

                    }
                }
                return true;
            }else{
                //节点
                nodeId = $(cfg.el).attr('nodeId');
            }
            var nodeTextId = 'text-' + nodeId;
            var treeNode = _self.nodeIdMap[nodeId];
            if(_self.isIndex){
                if(treeNode.isJoin){
                    return false;
                }
                /**无节点状态*/
                if(!treeNode.state){
                    return false;
                }
                /** 节点状态是完成 ，但是 无人员列表 则无需显示时间或者意见**/
                if(treeNode.state == _self.WorkFlowNodeState.state_done.value){
                    if(!treeNode.nodePersonList){
                        return false;
                    }
                    if(!treeNode.nodePersonList.length){
                        return false;
                    }

                }
                /**节点状态未到达**/
                if(treeNode.state === _self.WorkFlowNodeState.state_none.value){
                    return false;
                }
                if( ((!treeNode.comments)|| treeNode.comments.length==0) && ((!treeNode.nodePersonList ) || (treeNode.nodePersonList.length==0 ) || (treeNode.nodeType=='person' )   )   ){

                    if(treeNode.nodeType=='person' ){ // 如果是人的节点，则判断 是否是 已发、或者已办 ，(在流程节点点击时触发 )如果是已发或者已办 而没有意见则显示已发或者已办时间
                        if( (treeNode.state != _self.WorkFlowNodeState.state_done.value) ){
                            return false;
                        }
                    }
                    //return false;
                }
            }
            if ((typeof treeNode.isSplit != 'undefined') && (treeNode.isSplit)) {
                return false;
            }

        },
        /**
         * 更新节点属性
         */
        updateNodeProp:function(){
        	// 校验单元格默认值是否合法
            var _self = this;
            var el = _self.editPropDialog.getEl();
            var $el = $(el);
            /*
             * 更新 节点 显示名称 更新 节点执行模式 节点权限
             */
            var chooseTypeProp = oui.getTop().oui.getById('chooseType');
            var chooseType =chooseTypeProp.attr('value');
            chooseType = parseInt(chooseType);
            var nodeRightProp = oui.getTop().oui.getById('nodeRight');
            var isNotifyProp = oui.getTop().oui.getById('notifyNode');
            var nodeRight='';
            if(nodeRightProp){
                nodeRight = nodeRightProp.attr('value');
            }
            var nodeDisplayNameProp = oui.getTop().oui.getById('nodeDisplayName');
            var nodeDisplayName = nodeDisplayNameProp.attr('value');
            nodeDisplayName = $.trim(nodeDisplayName);
            var currId = _self.editPropDialog.attr('nodeId');
            var currIdx = _self.getIndexByNodeId(currId);
            var lastNodeDisplayName =  _self.flowData.workFlowNodeList[currIdx].nodeDisplayName;//获取上一次保存的节点显示名称
            _self.flowData.workFlowNodeList[currIdx].nodeDisplayName = nodeDisplayName ||_self.flowData.workFlowNodeList[currIdx].nodeName;
            _self.flowData.workFlowNodeList[currIdx].chooseType = chooseType;

            /** 节点权限***/
            if(nodeRightProp) {
                _self.flowData.workFlowNodeList[currIdx].nodeRight = nodeRight;
            }
            /**节点是否为知会节点 ****/
            if(isNotifyProp){
               var isNotify =isNotifyProp.attr('value') || false ;
                if(typeof isNotify =='string'){
                    if(isNotify == 'true'){
                        isNotify = true;
                    }else{
                        isNotify = false;
                    }
                }
                if(isNotify){
                    _self.flowData.workFlowNodeList[currIdx].branchObject = null;
                }
                _self.flowData.workFlowNodeList[currIdx].notifyNode = isNotify;
            }
            _self.flowData.workFlowNodeList[currIdx].name = nodeDisplayName ||_self.flowData.workFlowNodeList[currIdx].nodeName;
            /*
             * 更新 节点权限配置
             */
            //if(!oui.os.mobile){
            //}
            try{
                var formRight= _self.findFormRightByUI();
                _self.flowData.workFlowNodeList[currIdx].formRight = formRight;
            }catch(e){

            }

            var isCheck= _self.validateWorkFlowNode(_self.flowData.workFlowNodeList[currIdx]);
            if(!isCheck){ //如果校验失败，则将当前节点显示名称指定为上一次保存的值
                _self.flowData.workFlowNodeList[currIdx].nodeDisplayName = lastNodeDisplayName;
                _self.flowData.workFlowNodeList[currIdx].name =lastNodeDisplayName;
                return false;
            }
            _self.refresh();
            return true;
        },
        /** 根据ui获取formright***/
        findFormRightByUI:function(){
            var formRight ='';
            try{
                if(!oui.os.mobile){ // pc
                    formRight= oui.getTop().$('#form-right-iframe-flow')[0].contentWindow.formBizControls.getData4string();
                }else{ //移动
                    formRight= oui.getTop().formBizControls.getData4string();
                }
            }catch(e){
            }
            if(!formRight){
                formRight ='-1';
            }
            return formRight;
        },
        /*** 回填权限***/
        fillbackFormRight:function(formRight){
            try{
                oui.getTop().formBizControls.fillbackRight(formRight);
            }catch(e){
            }
        },
        /**
         * 清除 oui-form标签解析 后的缓存的控件对象
         */
        clearNodePropOuiControls:function(){
            var _self = this;
            var chooseTypeOuiId = _self.editPropDialog.attr('chooseTypeOuiId');
            var nodeDisplayNameOuiId = _self.editPropDialog.attr('nodeDisplayNameOuiId');
            chooseTypeOuiId && oui.getTop().oui.clearByOuiId(chooseTypeOuiId);
            nodeDisplayNameOuiId && oui.getTop().oui.clearByOuiId(nodeDisplayNameOuiId);
        },
        /**
         * 流程节点属性面板弹框 显示完成 parse后更新 属性的ouiId
         */
        updateNodePropOuiIds:function(){
            var _self = this;
            var chooseTypeProp = oui.getTop().oui.getById('chooseType');
            var nodeDisplayNameProp =oui.getTop().oui.getById('nodeDisplayName');
            chooseTypeProp && _self.editPropDialog.attr('chooseTypeOuiId',chooseTypeProp.attr('ouiId') );
            nodeDisplayNameProp && _self.editPropDialog.attr('nodeDisplayNameOuiId',nodeDisplayNameProp.attr('ouiId') );
            var nodeId= _self.editPropDialog.attr('nodeId');
            var currIdx = _self.getIndexByNodeId(nodeId);
            var formRight = _self.flowData.workFlowNodeList[currIdx].formRight
            if(!formRight){
                formRight ='-1';
                if(currIdx ==0){//第一个节点，发起节点 默认回填 -2
                    formRight = '-2';
                }
            }

            _self.flowData.workFlowNodeList[currIdx].formRight = formRight;
            /** 移动端需要 动态 增加样式到 dialog 控制 单元格权限、主表明细表tab页显示 **/
            if(oui.os.mobile){
                _self.fillbackFormRight(formRight);
                var $dialogEl = $(_self.editPropDialog.getEl());
                var $dialogContent = $dialogEl.find('.oui-html-dialog-content');
                if(!$dialogContent.hasClass('flow-ui-nodeProps-dialog-box')){
                    $dialogContent.addClass('flow-ui-nodeProps-dialog-box');
                }
            }
        },
        /***
         * 取消 事件
         * @param cfg
         */
        event2cancelEditProp:function(cfg){
            var _self = this;
            _self.hideContextMenu && _self.hideContextMenu();
            return false;
        },
        /******
         * 设置线上 条件
         * @param cfg
         */
        event2setLineCondition:function(cfg){
            var _self = this;
            var fromId = $(cfg.el).attr('fromId');
            var toId = $(cfg.el).attr('toId');
            if((!fromId) || (!toId)){
                return ;
            }
            //alert('条件设置'+fromId+','+toId);
            var fromNode = _self.nodeIdMap[fromId];
            var toNode = _self.nodeIdMap[toId];

            if((!fromNode) || (!toNode)){
                return ;
            }
            /** 必须是split 节点才进行分支设置 ***/
            if(!fromNode.isSplit){
                return ;
            }
            //console.log(fromNode);
            //console.log(toNode);

        },
        /** 鼠标移入join节点**/
        event2mouseenterJoin:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var imgEl = cfg.el;
            $(imgEl).attr('href',FlowUi.config.basePath+_self.getJoinImgSrc(true));
            var id = $(cfg.el).attr('nodeId');
            var node = _self.nodeIdMap[id];
            var hasWidth = _self.hasElWidth(cfg.el);
            var obj = oui.showTips({el:cfg.el, content: '添加节点',
                left:hasWidth?0:8,top:hasWidth?8:16+10,
                mustRender:true,singleton:true});

        },
        /** 鼠标离开join节点***/
        event2leaveJoin:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var imgEl = cfg.el;
            $(imgEl).attr('href',FlowUi.config.basePath+_self.getJoinImgSrc(false));
            oui.hideTips();
        },
        hasElWidth:function(el){
            var w=$(el).width();
            if(w==0){
                return false;
            }
            return true;
        },
        event2mouseenterLine:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var fromId = $(cfg.el).attr('fromId');
            var toId = $(cfg.el).attr('toId');
            if((!fromId) || (!toId)){
                return ;
            }
            //alert('条件设置'+fromId+','+toId);
            var fromNode = _self.nodeIdMap[fromId];
            var toNode = _self.nodeIdMap[toId];

            if((!fromNode) || (!toNode)){
                return ;
            }
            /** 必须是split 节点才进行分支设置 ***/
            if((!fromNode.isSplit) && (!_self.isIndex)){
                return ;
            }
            if(_self.design4Runtime){
                return;
            }
            if(toNode.isSplit){ //如果当前是分支节点则退出
                return ;
            }
            var el = cfg.el;
            var imgEl;
            if($(cfg.el).is('image')){
                el = $(cfg.el).parent().find('path[fromid='+fromId+'][toid='+toId+']')[0];
                imgEl = cfg.el;
                imgEl&&$(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(true));
            }else{
                imgEl = $(cfg.el).parent().find('image[fromid='+fromId+'][toid='+toId+']')[0];
                imgEl&&$(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(true));
            }
            var content= '设置分支条件';
            if(_self.isIndex || _self.isPreview) {
                content = '查看分支条件';
                /** 知会节点 无分支条件***/
                if(toNode&&toNode.notifyNode){
                    content = '知会节点无分支条件';
                }
            }else{
                /**   知会节点 设计态不能设置无分支条件***/
                if(toNode&&toNode.notifyNode){
                    content = '知会节点不能设置分支条件';
                }
            }

            if(imgEl){
                var hasWidth = _self.hasElWidth(imgEl);
                var obj = oui.showTips({el:imgEl, content: content,
                    left:hasWidth?0:8,top:hasWidth?8:16+10,
                    mustRender:true,singleton:true});
            }

            $(el).attr('stroke-width','5');
            $(el).css('stroke-width','5');

            $(el).attr('stroke','#ffaa1f');
            $(el).css('stroke','#ffaa1f');

        },

        /**鼠标离开设置线条样式 ****/
        event2leaveLine:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var fromId = $(cfg.el).attr('fromId');
            var toId = $(cfg.el).attr('toId');
            if((!fromId) || (!toId)){
                return ;
            }
            //alert('条件设置'+fromId+','+toId);
            var fromNode = _self.nodeIdMap[fromId];
            var toNode = _self.nodeIdMap[toId];

            if((!fromNode) || (!toNode)){
                return ;
            }
            /** 必须是split 节点才进行分支设置 ***/
            if((!fromNode.isSplit)&& (!_self.isIndex)){
                return ;
            }
            if(toNode.isSplit){ //如果当前是分支节点则退出
                return ;
            }
            var el = cfg.el;
            if($(cfg.el).is('image')){
                el = $(cfg.el).parent().find('path[fromid='+fromId+'][toid='+toId+']')[0];
                var imgEl = cfg.el;
                $(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(false));
            }else{
                var imgEl = $(cfg.el).parent().find('image[fromid='+fromId+'][toid='+toId+']')[0];
                $(imgEl).attr('href',FlowUi.config.basePath+_self.getSplitImgSrc(false));
            }
            oui.hideTips();
            $(el).attr('stroke-width','3');
            $(el).css('stroke-width','3');

            $(el).attr('stroke','#b7b7b7');
            $(el).css('stroke','#b7b7b7');
        },
        removeBranchLine:function(el){
            $(el).attr('stroke-dasharray','');
        },
        /** 渲染分支线条***/
        renderBranchLine:function(el){
            $(el).attr('stroke-dasharray','10,3');
            $(el).attr('stroke-width','3');
            $(el).css('stroke-width','3');
        },
        /* 判断节点是否有分支***/
        hasBranch:function(node){
            if(!node){
                return false;
            }
            if(node.branchObject){
                return true;
            }
            return false;
        },
        /** 设置 自动分子条件  ***/
        event2setAutoBranch:function(cfg){
            var _self = this;
            _self.isAutoBranch = true;
            _self.event2setNodeBranch(cfg);
            return false;
        },
        /****设置手工选择分支条件 ***/
        event2setSelectBranch:function(cfg){
            var _self = this;
            _self.isAutoBranch = false;
            _self.event2setNodeBranch(cfg);
            return false;
        },
        /**删除 分支条件 ***/
        event2deleteBranch:function(cfg){
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeId');
            var currIdx = _self.getIndexByNodeId(nodeId);
            if(currIdx<0){
                return ;
            }
            var currNode =  _self.flowData.workFlowNodeList[currIdx];

            currNode.branchObject = null;
            _self.refresh();
            return false;
        },
        /*** 设置字段分支条件  和 设置手工选择分支条件 中公共调用方法*****/
        event2setNodeBranch:function(cfg){
            //flow-tpl-branchSetting
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            _self.branchSetting = {
                node:treeNode
            };
            var html = FlowUi.render('flow-tpl-branchSetting',true);
            _self.clear4topDialogLastCache();

            var actions = _self.branchEditActions;
            var title;
            if(_self.isAutoBranch){
                title="自动分支条件";
            }else{
                title="手动选择分支";
            }
            _self.editBranchDialog = oui.getTop().oui.showHTMLDialog({
                title:title,
                dialog4bizType:"workflow",
                contentStyle: ('width:690px;'),
                content:html,
                center:false,
                nodeId:treeNode.id,
                actions:actions
            });
            oui.getTop().oui.parse();
            _self.fillbackNodeBranch(treeNode.id);
            return false;
        },
        /**清空顶层的含有该业务的缓存的dialog ****/
        clear4topDialogLastCache:function(){
            oui.getTop().oui.clearBy(function(control){
                if(control&&control.attr){
                    if(control.attr('dialog4bizType') == "workflow"){
                        oui.getTop().$(control.getEl()).remove();
                        return true;
                    }
                }
                return false;
            });
        },
        fillbackNodeBranch:function(nodeId){
            var _self = this;
            var index = _self.getIndexByNodeId(nodeId);
            if(index <0){
                return ;
            }
            var data = _self.workFlowNodeList;
            var curr = data[index];
            var condition4brach = oui.getTop().oui.getById('condition4branch');
            var conditions = (curr.branchObject&&curr.branchObject.conditionList)? curr.branchObject.conditionList:[];
            condition4brach&&condition4brach.fillback( conditions);
        },
        /*** 更新节点分支配置 **/
        updateNodeBranch:function(){
            var _self = this;
            var dialog =  _self.editBranchDialog;
            if(!dialog){
                return ;
            }
            var nodeId = dialog.attr('nodeId');
            var currIdx = _self.getIndexByNodeId(nodeId);
            if(currIdx<0){
                return ;
            }
            var currNode =  _self.flowData.workFlowNodeList[currIdx];
            var des4branch = oui.getTop().oui.getById('nodeBranchDes');
            var des='';
            if(des4branch){
                des = des4branch.attr('value');
                des = $.trim(des); //剔除空格
            }
            if(!des){
                $(dialog.getEl()).find('#condition4branch-error').html('分支描述不能为空');
                return false;
            }
            var conditions =null;
            var condition4branch = oui.getTop().oui.getById('condition4branch');
            var conditionInfo='';
            if(condition4branch){
                conditions = condition4branch.getConditions();
                conditionInfo = condition4branch.getConditionInfo();
            }
            if(_self.isAutoBranch ){
                if(conditions&& conditions.length){
                    currNode.branchObject = {
                        des:des,
                        autoBranch:_self.isAutoBranch,
                        conditionList:conditions,
                        conditionInfo:conditionInfo
                    };
                }else{
                    currNode.branchObject = {
                        des:des,
                        autoBranch:false,
                        conditionList:null
                    };
                    /***自动分子条件不能为空 ****/
                    $(dialog.getEl()).find('#condition4branch-error-condition').html('分支条件不能为空');
                    return false;
                }
            }else{
                currNode.branchObject = {
                    des:des,
                    autoBranch:false,
                    conditionList:null
                };
            }
            _self.refresh();
        },
        updateNotifyFunBind:function(){
            var _self = this;
            /** 设置流程节点 是否为知会节点 的 改变事件*****/
            oui.getTop().oui.setPageParam('flow_node_update_isNotify',function(control){
                var v = control.attr('value');
                var otherAttrs  = control.attr('otherAttrs');
                otherAttrs = oui.parseJson(otherAttrs);
                var currNode = _self.nodeProps.node ||{};
                var nodeRightObj = oui.getTop().oui.getById('nodeRight');
                var valueArr = _self.findNodeRightValue().split(',');
                var chooseTypeControl = oui.getTop().oui.getById('chooseType');
                var node =  _self.nodeProps.node ||{};
                if(v){
                    if(nodeRightObj){
                        nodeRightObj.attr('data',otherAttrs.notifyJson);
                    }
                    if(chooseTypeControl){

                        var chooseTypeValue = (( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') || ((node.nodeId.indexOf('member#')>-1 && node.nodeType !=_self.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 ) )?_self.WorkFlowChooseType.single.value:_self.WorkFlowChooseType.all.value );
                        chooseTypeControl.attr('value',chooseTypeValue);
                        chooseTypeControl.attr('right','readOnly');
                        chooseTypeControl.render();
                    }
                }else{
                    if(nodeRightObj){
                        nodeRightObj.attr('data',otherAttrs.nodeRightItemsJson);
                    }
                    if(chooseTypeControl){
                        chooseTypeControl.attr('right','edit');

                        var chooseTypeValue = (( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') || ((node.nodeId.indexOf('member#')>-1 && node.nodeType !=_self.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 ) )?_self.WorkFlowChooseType.single.value:_self.WorkFlowChooseType.all.value )
                        chooseTypeControl.attr('value',chooseTypeValue);

                        var isReadOnly = (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender')||((node.nodeId.indexOf('member#')>-1 && node.nodeType !=_self.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 );
                        if(isReadOnly){ //只读判断
                            chooseTypeControl.attr('right','readOnly');
                        }
                        chooseTypeControl.render();
                    }
                }
                var data = nodeRightObj.attr('data') ||[];
                var newValueArr= [];
                for(var i in data){
                    if(valueArr.indexOf(data[i].value+'')<0){
                        continue;
                    }
                    newValueArr.push(data[i].value);
                }
                nodeRightObj.attr('value',newValueArr.join(','));
                nodeRightObj.render();

            } );
        },
        event2editProp:function(cfg){
            /**
             * 编辑节点属性
             * @param cfg
             */
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            _self.nodeProps = {
                node:treeNode
            };
            if(!treeNode.formRight){
                if(treeNode.isRoot){
                    treeNode.formRight = '-2'; //默认编辑
                }else{
                    treeNode.formRight = '-1';//默认浏览
                }
            }
            _self.clear4topDialogLastCache();
            var html = FlowUi.render('flow-tpl-nodeProps',true);
            /** 设置流程节点 是否为知会节点 的 改变事件*****/
            _self.updateNotifyFunBind();
            var actions = _self.nodePropDialogActions;
            _self.editPropDialog = oui.getTop().oui.showHTMLDialog({
                title:"节点属性",
                contentStyle:'width:1050px',
                dialog4bizType:"workflow",
				//TODO 修改弹出框样式超出bug
                //contentStyle: ('width:600px;'), 
                content:html,
                center:false,
                nodeId:treeNode.id,
                actions:actions
            });
            oui.getTop().oui.parse();
            _self.updateNodePropOuiIds();
            return false;
        },
        showNodeProps:function(){
        },
        /**
         * tips显示节点名称
         * @param cfg
         */
        showTipsMsg4nodeDisplayName:function(cfg){
            var _self = this;
            var id = $(cfg.el).attr('nodeId');
            var node = _self.nodeIdMap[id];
            //if(oui.browser.ie){
            //
            //    var obj = oui.showTips({el:$('rect[nodeid='+id+']')[0], content: node.name,left:32.5,top:70});
            //}else{
            //    oui.showTips({el:cfg.el, content: node.name});
            //}
            //var svgPos =$('#ouiflow').position();
            var rectEl = $('rect[nodeid='+id+']')[0];
            var hasWidth = _self.hasElWidth(rectEl);
            var obj = oui.showTips({el:rectEl, content: oui.escapeStringToHTML( node.name ||""),
                left:hasWidth?0:32.5,top:hasWidth?8:70, //兼容问题处理，某些机器下svg内的元素没有宽度或者高度，的适配处理
                mustRender:true,singleton:true});
        },
        hideTips4nodeDisplayName:function(cfg){
            oui.hideTips();
        },
        /**
         * 事件触发节点菜单显示
         * pc:右键菜单
         * phone:轻点触摸显示actionsheet
         * 在事件触发前对 菜单列表的数据进行相关设置
         * 在 event2contextMenu事件触发方法中调用
         */
        putContextMenu4event: function (cfg) {
            var e = cfg.e;
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
            var _self = this;
            var isLine =false;
            var toId = $(cfg.el).attr('toId');
            var nodeId;
            if(toId){
                isLine = true;
                nodeId = toId;
            }else{
                nodeId = $(cfg.el).attr('nodeId');
            }
            var nodeTextId = 'text-' + nodeId;
            var treeNode = _self.nodeIdMap[nodeId];
            var clickName = _self.Events.click;
            var contextMenus = _self.contextMenus;
            if (!contextMenus) {
                contextMenus = _self.contextMenus = {};
            }
            contextMenus.menuClick = clickName; //指定菜单模板数据属性设置
            contextMenus.nodeId = nodeId;
            contextMenus.isRoot = treeNode.isRoot ? true : false;
            contextMenus.node = treeNode;
            contextMenus.isFirst = (nodeId ==_self.flowData.workFlowNodeList[0].id);
            contextMenus.hasNodeMembers = (treeNode.nodePersonList && treeNode.nodePersonList.length>0) &&(treeNode.nodeType!='person') ;
            contextMenus.hasComments = (treeNode.comments && treeNode.comments.length>0);
            contextMenus.isLine = isLine;
            var FlowUi = _self.getFlowUi();
            var html = FlowUi.render('flow-ui-contextMenus', true);
            var elSelector;
            if(isLine){
                elSelector = cfg.el;
            }else{
                elSelector = "[nodeTextId=" + nodeTextId + "][nodeId=" + nodeId + "]";
                elSelector = "rect[nodeId=" + nodeId + "]";
                elSelector = elSelector.toLowerCase();
            }
            var left = (_self.nodeWidth / 2);
            var top = (_self.nodeHeight - 2);
            return {
                isLine:isLine,
                nodeId:nodeId,
                el: $(elSelector),
                left: left,
                top: top,
                content: html
            };
        },
        /**
         * 绑定 流程节点上的菜单事件
         * pc 右键菜单
         * phone 触摸轻点actionSheet菜单
         * 分别实现该方法接口
         */
        event2contextMenu: function (cfg) {

        },
        /***催办事件处理 **/
        event2HastenWork:function(cfg){
            var nodeId =$(cfg.el).attr('nodeId');
            /**由嵌入流程图的页面进行扩展 **/
            var WorkflowRuntime = oui.getNS().WorkflowRuntime || window.parent.oui.getNS().WorkflowRuntime ||{} ;
            WorkflowRuntime.event2HastenWork&&WorkflowRuntime.event2HastenWork(nodeId);
        },
        /**
         * 添加串发节点
         */
        addNodes4Serial:function(id,nodes,idx){
            var _self = this;
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (i == 0) {
                    _self.addNodes([nodes[i]], id,false,idx);
                } else {
                    _self.addNodes([nodes[i]], nodes[i - 1].id);
                }
            }
        },
        /**
         * 创建或者更新子节点数据
         * @param treeNode
         * @param childNode
         * @param joinId
         */
        updateChildNode4brotherJoin:function(treeNode,childNode,joinId){
            var _self = this;
            if(childNode&& (!childNode.isJoin)){//非聚合节点之间处理
                childNode.pid = joinId;

                var index = _self.getIndexByNodeId(childNode.id);
                _self.flowData.workFlowNodeList[index].pid = joinId;
            }else if(childNode&& (childNode.isJoin)){ //子节点为聚合节点需要将聚合节点的pid重新整理为新的
                var brotherIds = childNode.pid?(childNode.pid+'').split(','):[];
                var currPidx = brotherIds.indexOf(treeNode.id+'');
                if(currPidx>=0){
                    brotherIds.splice(currPidx,1,joinId);
                }else{
                    brotherIds.push(joinId);
                }
                childNode.pid = brotherIds.join(',');
                var index = _self.getIndexByNodeId(childNode.id);
                _self.flowData.workFlowNodeList[index].pid = brotherIds.join(',');
            }
        },
        /**
         * 根据节点id和节点类型获取默认的执行模式
         * @param typeFlag
         */
        getDefaultChooseTypeByNodeType:function(nodeId,nodeType){
            var _self = this;
            /**相对角色发送者，单人 默认执行模式为单人;否则为 多人执行模式*/
            if(nodeType == _self.WorkFlowNodeType.person.value || nodeId =='relRole_sender' || ((nodeId.indexOf('member#')>-1 && nodeType !=_self.WorkFlowNodeType.formControl.value) || nodeId.indexOf('deptLeader#')>-1)){
                return _self.WorkFlowChooseType.single.value;
            }
            return _self.WorkFlowChooseType.all.value;
        },
        /**
         * 根据选人界面选择的节点列表 (人员,部门,角色等)
         * 创建流程图需要的节点数组对象
         * @param persons
         * @returns {Array}
         */
        createArrayNodesByPersonSelectedNodes:function(persons){
            if(!persons){
                return [];
            }
            var nodes = [];
            var _self = this;
            for (var i = 0, len = persons.length; i < len; i++) { //根据选择的人员、部门、角色等创建节点数据
                nodes.push({
                    nodeId: persons[i].id,
                    nodeName:persons[i].name,
                    nodeRight:_self.findNodeRightValue({}),
                    nodeDisplayName:persons[i].name,
                    name: persons[i].name,
                    chooseType:_self.getDefaultChooseTypeByNodeType(persons[i].id,persons[i].typeFlag),
                    nodeType: persons[i].typeFlag
                });
            }
            return nodes;
        },
        /**
         * 根据分割节点获取聚合节点
         * @param splitId
         * @returns {*}
         */
        getJoinIdBySplitId:function(splitId){
            var _self = this;
            var node = _self.nodeIdMap[splitId];
            var join = _self.findJoin(node);
            if(!join){
                return "";
            }
            return join.id;
        },
        /**
         * 如果当前节点的父亲节点为split节点 则根据当前节点获取当前分支在流程图中的顺序
         * 根据当前分支获取 对应的索引
         */
        getCurrBranchIndex:function(node){
            var _self = this;
            if(!node){
                return -1;
            }
            if(!node.parents){
                return -1;
            }
            if(!node.parents[0]){
                return -1;
            }
            var splitId = node.parents[0].id;
            var joinId = _self.getJoinIdBySplitId(splitId);
            var joinIndex = _self.getIndexByNodeId(joinId);
            var joinNode = _self.flowData.workFlowNodeList[joinIndex];
            var pids = joinNode.pid?joinNode.pid.split(','):[];
            var branchNode = _self.getCurrBranchNodeByFirstNode(node);
            if(branchNode){
                return pids.indexOf(branchNode.id);
            }else{
                return -1;
            }
        },
        /**
         * 根据 当前分支的第一个节点获取 当前分支的最后一个节点(聚合节点的其中一个父Id)
         * @param node
         * @returns {*}
         */
        getCurrBranchNodeByFirstNode:function(node){
            var _self = this;
            if(!node){
                return null;
            }
            if(!node.parents){
                return null;
            }
            if(!node.parents[0]){
                return null;
            }
            var splitId = node.parents[0].id;
            var joinId = _self.getJoinIdBySplitId(splitId);
            var currBranchNode = _self.getCurrBranchNode(node,node.children,splitId,joinId);
            return currBranchNode;
        },
        /**
         * 获取当前分支的最后一个节点
         * @param node
         * @param children
         * @param splitId
         * @param joinId
         * @returns {*}
         */
        getCurrBranchNode:function(node,children,splitId,joinId){
            var _self = this;
            if(children[0].id ==joinId){
                return node;
            }
            if((!children) || (!children.length) ){
                return node;
            }
            for(var i= 0,len=children.length;i<len;i++){
                var curr = _self.getCurrBranchNode(children[i],children[i].children,splitId,joinId);
                if(curr === children[i]){
                    return curr;
                }
                if(!curr){
                    return children[i];
                }
            }
            return null;
        },
        /**
         * 增加兄弟节点
         * @param nodeId
         * @param data
         */
        selectBrotherOkFun:function(nodeId,data){
            var _self = this;
            //console.log(data);
            var persons = data.data;
            var addType = data.flowType;
            var isSerial = false;
            if ((addType + '') == (_self.ADD_TYPE.serial + "")) { //串发
                isSerial = true;
            } else { //并发 TODO

            }
            if (!persons) {
                return;
            }
            if (persons.length <= 0) {
                return;
            }
            var nodes = _self.createArrayNodesByPersonSelectedNodes(persons); //根据 选人界面选择的节点数据，创建 节点数组
            var treeNode = _self.nodeIdMap[nodeId];
            var brotherId = treeNode.parents[0].id;
            var childNode = treeNode.children[0];

            if(treeNode.parents[0]&& treeNode.parents[0].isSplit){

                var splitId =treeNode.parents[0].id;
                var joinId =  _self.getJoinIdBySplitId(splitId);
                var currBranchIdx = _self.getCurrBranchIndex(treeNode);//获取当前分支的在流程图中显示顺序,插入兄弟节点时需要在join节点上表现顺序
                currBranchIdx=-1;
                var insertIdx = _self.getIndexByNodeId(treeNode.id);
                if ((!isSerial) && nodes.length > 0) {
                    _self.addNodes(nodes, splitId,false,insertIdx,true); //添加节点列表到数组
                    var cpids = [];//获取聚合节点的父节点列表
                    for(var k= 0,len=nodes.length;k<len;k++){//将新增加的并非节点列表中id放到 聚合节点的父节点列表中
                        cpids.push(nodes[k].id);
                    }
                    _self.updateJoinNodeParentIds(joinId,cpids,currBranchIdx);
                } else {
                    _self.addNodes4Serial(splitId,nodes,insertIdx,true);//添加串发节点
                    _self.updateJoinNodeParentIds(joinId,[nodes[nodes.length-1].id],currBranchIdx); //追加最后一个到 聚合节点的父节点列表中
                }
            }else{
                var newSplitId = _self.createSplitNode(brotherId); //根据父节点创建分割节点
                treeNode.pid = newSplitId;//指定当前节点的父节点为 分割节点
                var index = _self.getIndexByNodeId(treeNode.id);//获取当前节点的索引
                _self.flowData.workFlowNodeList[index].pid = newSplitId; //更新数组中当前节点的父节点
                if ((!isSerial) && nodes.length > 0) {
                    var insertIdx = _self.getIndexByNodeId(treeNode.id);
                    _self.addNodes(nodes, newSplitId, false); //添加节点列表到数组
                    var joinId = _self.createJoinNode(nodeId); //创建聚合节点
                    var cpids = [];//获取聚合节点的父节点列表
                    for(var k= 0,len=nodes.length;k<len;k++){//将新增加的并非节点列表中id放到 聚合节点的父节点列表中
                        cpids.push(nodes[k].id);
                    }
                    _self.updateJoinNodeParentIds(joinId,cpids);
                    _self.updateChildNode4brotherJoin(treeNode,childNode,joinId);//如果子节点为聚合节点则需要更新聚合节点的父节点数据，否则直接指定父节点为聚合节点
                    var currNodeIdx = _self.getIndexByNodeId(treeNode.id);//获取当前节点的索引
                    /**
                     * 添加后改变 顺序
                     */
                    var currNode = _self.flowData.workFlowNodeList[currNodeIdx] ;
                    _self.flowData.workFlowNodeList.splice(currNodeIdx,1);
                    var firstIdx = _self.getIndexByNodeId(nodes[0].id);
                    _self.flowData.workFlowNodeList.splice(firstIdx,0,currNode);
                } else {
                    _self.addNodes4Serial(newSplitId,nodes);//添加串发节点
                    var joinId = _self.createJoinNode(nodeId); //创建聚合节点
                    _self.updateJoinNodeParentIds(joinId,[nodes[nodes.length-1].id]); //追加最后一个到 聚合节点的父节点列表中
                    _self.updateChildNode4brotherJoin(treeNode,childNode,joinId);//如果子节点为聚合节点则需要更新聚合节点的父节点数据，否则直接指定父节点为聚合节点

                    /**
                     * 添加后改变 顺序
                     */
                    var currNodeIdx = _self.getIndexByNodeId(treeNode.id);//获取当前节点的索引
                    var currNode = _self.flowData.workFlowNodeList[currNodeIdx] ;
                    _self.flowData.workFlowNodeList.splice(currNodeIdx,1);
                    var firstIdx = _self.getIndexByNodeId(nodes[0].id);
                    _self.flowData.workFlowNodeList.splice(firstIdx,0,currNode);
                }

            }

            _self.refresh();
        },
        /**
         * 更新聚合节点的父节点列表
         * @param joinId
         * @param pids
         * @param branchIndex (如果传入则需要制定顺序)
         */
        updateJoinNodeParentIds:function(joinId,pids,branchIndex){

            if(!pids ){
                return ;
            }
            if(!pids.length){
                return ;
            }
            var _self = this;
            var joinIndex = _self.getIndexByNodeId(joinId); //获取聚合节点索引
            var joinPids = _self.flowData.workFlowNodeList[joinIndex].pid+''; //获取聚合节点的所有父节点列表
            joinPids = joinPids?joinPids.split(','):[];

            var arr = [];
            if(typeof pids =='string'){
                arr  = pids?(pids+'').split(','):[];
            }else{
                arr = pids;
            }
            if((typeof branchIndex =='number')&& branchIndex>-1){
                for(var i= 0,len=arr.length;i<len;i++){
                    joinPids.splice(branchIndex+i+1,0,arr[i]);
                }
            }else{
                for(var i= 0,len=arr.length;i<len;i++){
                    joinPids.push(arr[i]);
                }
            }
            _self.flowData.workFlowNodeList[joinIndex].pid = joinPids.join(',');
        },
        /***
         * 暴露外部使用的加签方法
         * @param nodeId
         * @param data
         * @param cmd
         * @returns {*}
         */
        addNodes4SelfOrBrother:function(nodeId,data,isBrother){
            var _self  =this;
            if(!isBrother){
                _self.selectOkFun(nodeId,data);
            }else {
                _self.selectBrotherOkFun(nodeId,data);
            }
            return  _self.getFlowData();
        },
        /**
         * 执行 选人界面公共回调逻辑
         * pc和phone的公共调用方法
         * @param nodeId 操作的节点
         * @param data 回调的人员数据
         *
         */
        selectOkFun: function (nodeId, data) {
            var _self = this;
            //console.log(data);
            var persons = data.data;
            var addType = data.flowType;
            var isSerial = false;
            if ((addType + '') == (_self.ADD_TYPE.serial + "")) { //串发
                isSerial = true;
            } else { //并发 TODO

            }
            if (!persons) {
                return;
            }
            if (persons.length <= 0) {
                return;
            }
            var nodes = [];
            for (var i = 0, len = persons.length; i < len; i++) {
                nodes.push({
                    nodeId: persons[i].id,
                    nodeName:persons[i].name,
                    nodeDisplayName:persons[i].name,
                    nodeRight:_self.findNodeRightValue({}),
                    name: persons[i].name,
                    chooseType:_self.getDefaultChooseTypeByNodeType(persons[i].id,persons[i].typeFlag),
                    nodeType: persons[i].typeFlag
                });
            }
            var treeNode = _self.nodeIdMap[nodeId];

            if ((!isSerial) && nodes.length > 1) {
                var emptyId = _self.addNodes(nodes, nodeId, true); //是否追加空节点
                _self.updateParentId(nodeId, emptyId, true);

            } else {

                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (i == 0) {
                        _self.addNodes([nodes[i]], nodeId);
                    } else {
                        _self.addNodes([nodes[i]], nodes[i - 1].id);
                    }

                }
                _self.updateParentId(nodeId, nodes[nodes.length - 1].id);
            }
            _self.refresh();
        },
        selectBrotherOkCallback:function(data){
            var selectDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
            var nodeId = selectDialog.attr('nodeId');
            var _self = this;//不能指向this callback的配置不能指向this引用了
            _self.selectBrotherOkFun(nodeId,data);
        },
        /**
         * 选人界面回调接口
         */
        selectOkCallback: function (data) {
            var selectDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
            var nodeId = selectDialog.attr('nodeId');
            var _self = this;//不能指向this callback的配置不能指向this引用了
            _self.selectOkFun(nodeId, data);//公共回调方法 需要传入
        },
        /**
         * 替换节点的执行逻辑
         */
        replaceNodeFun: function (nodeId, data) {
            var _self = this;
            var persons = data.data;
            var nodes = [];
            for (var i = 0, len = persons.length; i < len; i++) {
                nodes.push({
                    nodeId: persons[i].id,
                    name: persons[i].name,
                    nodeName:persons[i].name,
                    nodeDisplayName:persons[i].name,
                    nodeType: persons[i].typeFlag
                });
            }
            if (nodes.length != 1) {
                return;
            }
            _self.replaceNodeById(nodes[0], nodeId);
            _self.refresh();
        },
        /**
         * 替换节点回调的接口
         */
        replaceCallBack: function (data) {
            var _self = this;
            var selectDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
            var nodeId = selectDialog.attr('nodeId');
            _self.replaceNodeFun(nodeId, data);
        },
        /** 工作流中 根据design4Runtime  判断节点选人界面 ***/
        findSelectPersonTabs4workflow:function(){
            var design4Runtime = oui.getParam('design4Runtime');
            var showTab = '';
            if((design4Runtime&&design4Runtime=='true')||((typeof design4Runtime=='boolean') && design4Runtime)){
                showTab='3';
            }else{
                showTab='3,4,1,2,5';
            }
            return showTab;
        },
        /**
         * 替换节点,具体逻辑实现
         */
        event2replaceNode: function (cfg) {
            var nodeId = $(cfg.el).attr('nodeId');
            var _self = this;
            var showTab = _self.findSelectPersonTabs4workflow();
            oui.getTop().oui.selectPerson({
                showType:5,
                filterSelf: false,
                defaultTabIndex:1,
                tabs: showTab,//tab页签显示配置 [组,联系人]
                nodeId: nodeId,
                title: '替换节点',
                isAll:false,
                allowCompany:false,
                isFlow: true,
                fillback: [],//回填选中数据
                isMulti:false,
                maxSize: 1,//选人多少限制
                extend:_self.findSelectPersonExtend(),
                operType: 'replace',
                /*
                 *callback:function(action){
                 //alert(action);
                 },
                 */
                callbackOk: function (data) {
                    _self.replaceCallBack(data);
                }, //替换节点的回调方法
                callbackCancel: function (data) {
                    //alert('cancel-data');
                }
            });
            return false;
            //oui.hideTips();
        },
        /**
         * 添加兄弟节点
         * @param cfg
         */
        event2addBrotherNode:function(cfg){
            var nodeId = $(cfg.el).attr('nodeId');
            var _self = this;
            var showTab = _self.findSelectPersonTabs4workflow();
            oui.getTop().oui.selectPerson({
                showType:5,
                filterSelf: false,
                defaultTabIndex:1,
                tabs: showTab,//tab页签显示配置 [组,联系人]
                isFlow: true,
                isAll:false,
                allowCompany:false,
                fillback: [],//回填选中数据
                maxSize: -1,//选人多少限制
                duplicate: false,//是否允许重复
                extend:_self.findSelectPersonExtend(),
                nodeId: nodeId,
                title: '节点选择',
                operType: 'addBrother',
                callbackOk: function (data, flowType) {
                    _self.selectBrotherOkCallback(data,nodeId);
                },//确定回调 返回false将不会关闭窗口

                callbackCancel: function () {

                }//取消回调
            });
            return false;
        },
        /** 获取选人界面扩展的页签,包括表单控件****/
        findSelectPersonExtend:function(){
            var _self = this;
            if(!_self.flowData.bizId){
                return null;
            }
            var design4Runtime = oui.getParam('design4Runtime');
            if((design4Runtime&&design4Runtime=='true')||((typeof design4Runtime=='boolean') && design4Runtime)){
                return null;
            }
            var extend = {
                tabs:[{
                    title:"表单控件",
                    type:"formControl",
                    icon:"forms",
                    des:"表单内组织机构控件",
                    url:oui.addParams(oui.getPageParam("selectPersonUrl"),{
                        formId:_self.flowData.bizId,
                        subFormId:"",
                        type:"3",
                        showSub:false,
                        containMulti:'true,false'
                    })
                }]
            };
            return extend;
        },
        /**
         * 点击或者手机上轻点事件触发 添加节点
         */
        event2addNode: function (cfg) {
            var nodeId = $(cfg.el).attr('nodeId');
            var _self = this;
            var showTab = _self.findSelectPersonTabs4workflow();
            oui.getTop().oui.selectPerson({
                showType:5,
                filterSelf: false,
                defaultTabIndex:1,
                tabs: showTab,//tab页签显示配置 [组,联系人]
                isFlow: true,
                isAll:false,
                allowCompany:false,
                fillback: [],//回填选中数据
                maxSize: -1,//选人多少限制
                extend:_self.findSelectPersonExtend(),
                nodeId: nodeId,
                title: '节点选择',
                operType: 'add',
                callbackOk: function (data, flowType) {
                    _self.selectOkCallback(data);
                },//确定回调 返回false将不会关闭窗口

                callbackCancel: function () {

                }//取消回调
            });
            return false;
            //oui.hideTips();
        },
        zoomPx: 0,
        /**
         * 放大
         */
        event2ZoomBig: function (cfg) { //放大
            var _self = this;
            _self.zoomPx += 10;
            _self.zoomScale = (_self.mc_width + _self.zoomPx) / _self.mc_width;
            $(_self.getFlowUi().RaphaelObj.canvas).css('zoom', _self.zoomScale);
        },
        /**
         * 缩小
         */
        event2ZoomSmall: function (cfg) { //缩小
            var _self = this;
            _self.zoomPx -= 10;
            _self.zoomScale = (_self.mc_width + _self.zoomPx) / _self.mc_width;
            if (_self.zoomScale < 0.5) {
                _self.zoomPx += 10;
                _self.zoomScale = (_self.mc_width + _self.zoomPx) / _self.mc_width;
            }
            $(_self.getFlowUi().RaphaelObj.canvas).css('zoom', _self.zoomScale);
        },
        /**
         * 更新节点的父节点Id
         */
        updateParentId: function (lastPid, newPid) {
            var _self = this;
            var treeNode = _self.nodeIdMap[lastPid]; //根据父id找到对应的树结构的 节点对象
            var ids = _self.getIdsByParentNode(treeNode); //根据 父节点 获取子节点的id列表
            //根据Id列表在 数组的 流程节点对象中找到并制定新的父id
            var data = _self.workFlowNodeList;
            if (ids.length <= 0) {
                return;
            }
            for (var i = 0, len = data.length; i < len; i++) {
                if (ids.indexOf(data[i].id) >= 0) {
                    //data[i].pid = newPid; // 将父亲节点重新赋值
                    var pids = (data[i].pid + '').split(',');
                    var spliceIdx = pids.indexOf(lastPid + '');
                    if ((typeof _self.nodeIdMap[newPid].isSplit != 'undefined' && _self.nodeIdMap[newPid].isSplit) && data[i].isJoin) {
                        pids.splice(spliceIdx, 1);
                    } else {
                        pids.splice(spliceIdx, 1, newPid);
                    }
                    data[i].pid = pids.join(',');
                }
            }
        },
        /**
         * 根据 父节点获取 子节点的所有Id列表,不用获取孙子节点
         */
        getIdsByParentNode: function (node) {
            var ids = [];
            var arr = node.children;
            for (var i = 0, len = arr.length; i < len; i++) {
                ids.push(arr[i].id);
            }
            return ids;
        },
        /**
         * 点击或者手机上轻点事件触发 删除节点
         */
        event2delNode: function (cfg) {
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            _self.removeByTreeNode(treeNode);
            _self.refresh();
            return false;
        },

        /**
         * 只删除当前节点
         */
        event2delCurrNode: function (cfg) {
            var _self = this;
            var nodeId = $(cfg.el).attr('nodeId');
            var treeNode = _self.nodeIdMap[nodeId];
            if ((treeNode.parents && treeNode.parents.length == 1) &&
                (treeNode.children && treeNode.children.length == 1) &&
                (treeNode.parents[0].children.length == 2)
            ) {
                if ((treeNode.parents[0].isSplit) && (treeNode.children[0].isJoin)) {
                    var brotherChilds = treeNode.parents[0].children;
                    _self.updateParentId(treeNode.parents[0].id, treeNode.parents[0].pid);
                    _self.removeByTreeNode(treeNode.parents[0], true);

                    ///
                    var targetNode;
                    if ((treeNode.id + '') == (treeNode.children[0].parents[0].id + '')) {
                        targetNode = treeNode.children[0].parents[1];
                    } else {
                        targetNode = treeNode.children[0].parents[0];
                    }

                    /********* 如果当前没有兄弟节点 ,删除节点时 需要删除分支对象 *********************/
                    targetNode.branchObject = null;
                    var index = _self.getIndexByNodeId(targetNode.id);
                    if(_self.flowData.workFlowNodeList[index]){
                        _self.flowData.workFlowNodeList[index].branchObject = null;
                    }
                    for(var i= 0,len=brotherChilds.length;i<len;i++){
                        if(!brotherChilds[i]){
                            continue;
                        }
                        brotherChilds[i].branchObject = null;
                        var idx = _self.getIndexByNodeId(brotherChilds[i].id);
                        if(_self.flowData.workFlowNodeList[idx]){
                            _self.flowData.workFlowNodeList[idx].branchObject = null;
                        }
                    }
                    _self.updateParentId(treeNode.children[0].id, targetNode.id);
                    _self.removeByTreeNode(treeNode.children[0], true);
                }

            }
            _self.updateParentId(nodeId, treeNode.pid);
            _self.removeByTreeNode(treeNode, true);
            _self.refresh();
            return false;
        },

        /**
         * 在指定节点id后面创建分割节点
         * @param id
         */
        createSplitNode:function(id){
            var _self = this;
            var data = _self.workFlowNodeList;
            //console.log(oui.biz.Tool.encode(data));
            var idx = _self.getIndexByNodeId(id);
            var splitId = _self.createNewId4server();
            _self.nodeIdMap[splitId] = {
                id: splitId,
                name: '',
                //name:'split',
                isSplit: true,
                pid: id
            };
            data.splice(idx + 1, 0, _self.nodeIdMap[splitId]);
            return splitId;
        },
        /**
         * 指定节点 后面创建 聚合节点
         * @param id
         */
        createJoinNode:function(id){
            var _self = this;
            var data = _self.workFlowNodeList;
            var idx = _self.getIndexByNodeId(id);
            var newId = _self.createNewId4server();
            _self.nodeIdMap[newId] = {
                id: newId,
                //name:'join',
                name: '',
                isJoin: true,
                pid: id
            };
            data.splice(idx +1, 0, _self.nodeIdMap[newId]);
            return newId;
        },

        /**
         * 根据当前节点添加后续节点列表
         * 根据父节点 添加子节点
         */
        addNodes: function (nodes, id, addEmpty,insertIndex,isReverse) {
            var _self = this;
            var data = _self.workFlowNodeList;
            //console.log(oui.biz.Tool.encode(data));
            var idx = _self.getIndexByNodeId(id);
            var pids = [];
            var splitId = null;

            if (addEmpty && nodes.length > 1) {
                splitId = _self.createNewId4server();
                _self.nodeIdMap[splitId] = {
                    id: splitId,
                    name: '',
                    //name:'split',
                    isSplit: true,
                    pid: id
                };
                data.splice(idx + 1, 0, _self.nodeIdMap[splitId]);
            }
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (!nodes[i].id) {
                    nodes[i].id = _self.createNewId4server();
                }
                nodes[i].pid = splitId ? splitId : id;

                _self.nodeIdMap[nodes[i].id] = nodes[i];
                if((typeof insertIndex =='number') && insertIndex>-1){
                    data.splice(  (insertIndex + i + 1), 0, nodes[i]);
                }else{
                    data.splice(splitId ? (idx + i + 2) : (idx + i + 1), 0, nodes[i]);
                }
                pids.push(nodes[i].id);

            }
            if (addEmpty && nodes.length > 1) {
                var newId = _self.createNewId4server();
                _self.nodeIdMap[newId] = {
                    id: newId,
                    //name:'join',
                    name: '',
                    isJoin: true,
                    pid: pids.join(',')
                };
                data.splice(idx + i + 2, 0, _self.nodeIdMap[newId]);
                return newId;
            }
            return null;
        },
        /**
         *  将replaceId替换 为 node节点
         */
        replaceNodeById: function (node, replaceId) {
            var _self = this;
            var data = _self.workFlowNodeList;
            var idx = _self.getIndexByNodeId(replaceId);
            if (idx < 0) {
                return;
            }
            var pid = data[idx].pid;
            node.pid = pid;
            if( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') ){
                node.chooseType =_self.WorkFlowChooseType.single.value;
            }else{
                node.chooseType = data[idx].chooseType ||_self.WorkFlowChooseType.single.value;
            }
            node.formRight = data[idx].formRight ||"-1";
            node.nodeRight = data[idx].nodeRight ||"";
            node.notifyNode = data[idx].notifyNode || false;
            node.branchObject = data[idx].branchObject||null;
            data.splice(idx, 1, node);
            if (!node.id) {
                node.id = _self.createNewId4server();
            }
            if(node.notifyNode){
                /** 知会节点需要 重置 执行默认默认值****/
                if(typeof node.notifyNode =='string'){
                    if(node.notifyNode =='true'){
                        node.notifyNode = true;
                    }else{
                        node.notifyNode = false;
                    }
                }
                var chooseTypeValue = (( (node.nodeType ==_self.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') )?_self.WorkFlowChooseType.single.value:_self.WorkFlowChooseType.all.value );
                node.chooseType =  chooseTypeValue;
            }


            _self.nodeIdMap[node.id] = node;
            _self.updateParentId(replaceId, node.id); //lastId为replaceId newId为node.id
        },
        /**
         * 根据节点找到 数组中节点索引
         */
        getIndexByNodeId: function (id) {
            var _self = this;
            var data = _self.workFlowNodeList;
            for (var i = 0, len = data.length; i < len; i++) {
                if ((data[i].id + '') == (id + '')) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 根据 树结构节点找到所有的孙子节点 在 数组结构的节点中找到并标记删除
         * 删除流程节点
         * justDeletCurr true 仅仅删除当前节点 不需递归 找子节点和孙子节点
         *
         */
        removeByTreeNode: function (node, justDeletCurr) {
            var _self = this;
            var idx = _self.getIndexByNodeId(node.id); //数组节点中找到索引
            if (idx < -1) { //没有找到当前节点
                return;
            }
            var data = _self.workFlowNodeList;
            var ids = [];
            if (!justDeletCurr) { //如果没有配置 则默认执行孙子节点查找
                ids = _self.getChildrenIdsByTreeNode(node); //在树节点中找到所有
            }
            var newArr = [];
            if (!ids) {
                ids = [];
            }
            ids.push(node.id);
            if (ids.length == 1) { //如果只有一个元素 则执行删除;并返回
                data.splice(idx, 1);
                return;
            }
            //如果是多个 则执行 标记删除 在重置
            /*
             * 第一次遍历 用于处理删除标记
             */
            for (var i = 0, len = data.length; i < len; i++) {
                if (ids.indexOf(data[i].id) > -1) {
                    data[i] = null;
                }
            }
            /*
             * 第二次遍历 用于将无删除标记的控件放入新数组
             */
            for (var i = 0, len = data.length; i < len; i++) {
                if (!data[i]) {
                    continue;
                }
                newArr.push(data[i]);
            }
            /*
             * 重新赋值给 流程节点数据对象
             */
            _self.workFlowNodeList = newArr;

        },
        /**
         * 根据treeNode获取子节点以及孙子节点
         * 树结构的节点
         */
        getChildrenIdsByTreeNode: function (node) {
            var _self = this;
            var data = _self.workFlowNodeList;
            var arr = [];
            var children = node.children;
            for (var i = 0, len = children.length; i < len; i++) {
                var currArr = _self.getChildrenIdsByTreeNode(children[i]);//获取子节点的id列表
                arr.push(children[i].id); //将当前子节点放入输入
                arr = arr.concat(currArr);//将当前子节点的孙子节点列表放入数组
            }
            return arr;
        },
        flowIdPrefix: 'jsuuid-',
        /**
         * 根据外部传入数据 自增 客户端id
         */
        createNewId: function () {
            var _self = this;
            _self.newId++;
            return _self.flowIdPrefix + _self.newId;
        },
        /**
         * 为新增节点增加Id
         */
        createNewId4server: function () {
            var _self = this;
            _self.newId4server++;
            return _self.flowIdPrefix + _self.newId4server;
        },

        /**
         * 根据id获取子节点列表
         */
        getChildrenByNode: function (node, arr, idx) {
            var _self = this;
            var i = idx || 0;
            i = i + 1;
            _self.nodeIdMap[node.id] = node;
            var newId = _self.createNewId();
            node.newId = newId;
            var children = [];


            for (var len = arr.length; i < len; i++) {
                if (('' + arr[i].pid).split(',').indexOf(node.id + '') < 0) {
                    continue;
                }
                children.push(arr[i]);
                arr[i].children = _self.getChildrenByNode(arr[i], arr, i);
                _self.setNodeParents(arr[i], node);
            }
            if(_self.isVertical){//如果是纵向则兄弟节点顺序相反
                children = children.reverse();
            }
            return children;
        },
        /**
         * 设置节点的父节点
         * 聚合场景 是多父节点
         */
        setNodeParents: function (node, parentNode) {
            if (!node.parents) {
                node.parents = [];
            }
            var ps = node.parents;
            var hasParent = false;
            for (var i = 0, len = ps.length; i < len; i++) {
                if (ps[i].id == parentNode.id) {
                    hasParent = true;
                    break;
                }
            }
            if (!hasParent) {
                node.parents.push(parentNode);
            }
            if(parentNode&&parentNode.isSplit){
                node.isParentSplit = true;
            }else{
                node.isParentSplit = false;
            }
        },
        /**
         * 根据数组 节点创建 树对象
         */
        createTreeNode: function (arr) {
            var _self = this;
            var node = {};
            var root = arr[0];
            this.nodeIdMap = {};
            root.children = _self.getChildrenByNode(root, arr, 0);
            root.parents = [];
            root.isRoot = true;
            return root;
        },
        /**
         * 创建 flow-ui流程图所需的数据
         *@param data 数据
         *@param isVertical 是否纵向输出
         */
        createNodeData: function (data, isVertical) {
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var obj = {states: {}, paths: {}};
            var states = obj.states;
            var paths = obj.paths;
            var x, y, posCfg;

            for (var i = 0, len = data.length; i < len; i++) {
                var newId = data[i].newId;
                var statusImg=null;
                var hastenWorkImg =null;
                if (isVertical) {
                    posCfg = _self.rotate({x: data[i].x, y: data[i].y}, Math.PI / 2);
                    x = posCfg.x;
                    y = posCfg.y;
                } else {
                    x = data[i].x;
                    y = data[i].y;
                }
                var attr;
                if (i == 0) {
                    attr = $.extend(true, {}, FlowUi.config.tools.states.start.attr, {
                        "x": x,
                        "y": y,
                        "width": _self.nodeWidth,
                        "height": _self.nodeHeight
                    });

                }else if(data[i].isEnd){
                    attr = $.extend(true, {}, FlowUi.config.tools.states.end.attr, {
                        "x": x,
                        "y": y,
                        "width": _self.nodeWidth,
                        "height": _self.nodeHeight
                    });
                } else {

                    if( FlowUi.config.tools.states[data[i].nodeType]&& _self.WorkFlowNodeType[data[i].nodeType]){
                        attr = $.extend(true, {}, FlowUi.config.tools.states[data[i].nodeType].attr, {
                            "x": x,
                            "y": y,
                            "width": _self.nodeWidth,
                            "height": _self.nodeHeight
                        });
                    }else{
                        attr = {
                            "x": x,
                            "y": y,
                            "width": _self.nodeWidth,
                            "height": _self.nodeHeight
                        };
                    }
                }
                /*
                 *if(data[i].isSplit){
                 type ='split';
                 var sw = FlowUi.config.tools.states.split.attr.width;
                 var sh = FlowUi.config.tools.states.split.attr.height;
                 attr.x =attr.x+attr.width/2-sw/2;
                 attr.y=attr.y+attr.height/2-sh/2;
                 attr.width = sw;
                 attr.height =sh;
                 }else if(data[i].isJoin){
                 type= 'join';

                 var sw = FlowUi.config.tools.states.join.attr.width;
                 var sh = FlowUi.config.tools.states.join.attr.height;
                 attr.x =attr.x+attr.width/2-sw/2;
                 attr.y=attr.y+attr.height/2-sh/2;
                 attr.width = sw;
                 attr.height =sh;
                 }
                 */
                var type = data[i].type || 'task';
                if (data[i].isSplit) {
                    type = 'split';
                    var sw = FlowUi.config.tools.states.split.attr.width;
                    var sh = FlowUi.config.tools.states.split.attr.height;
                    attr.x = attr.x + attr.width / 2 - sw / 2;
                    attr.y = attr.y + attr.height / 2 - sh / 2;
                    attr.width = sw;
                    attr.height = sh;
                } else if (data[i].isJoin) {
                    type = 'join';

                    var sw = FlowUi.config.tools.states.join.attr.width;
                    var sh = FlowUi.config.tools.states.join.attr.height;
                    attr.x = attr.x + attr.width / 2 - sw / 2;
                    attr.y = attr.y + attr.height / 2 - sh / 2;
                    attr.width = sw;
                    attr.height = sh;
                }else  if(data[i].isEnd){
                    type="end";
                }else if(_self.isIndex){
                    // 浏览态 的状态图标 和意见图标
                    // statusImg commentsImg

                    // 根据节点状态 、是否是当前节点、是否是第一个节点 获取对应图标
                    var state = data[i].state;
                    if(data[i].nodeType=='person'){
                        var personState;
                        var personAttitude;
                        /**节点状态是已经处理，但是却没有人员列表,则指定默认状态*/
                        if( state ===_self.WorkFlowNodeState.state_done.value  && ( (!data[i].nodePersonList) || (!data[i].nodePersonList.length) )){
                            personState = _self.WorkFlowPersonState.state_done.value;
                            personAttitude = _self.WorkFlowPersonAttitude.agree.value;
                        }else{
                            personState = data[i].nodePersonList && data[i].nodePersonList.length>0?data[i].nodePersonList[0].state:_self.WorkFlowPersonState.state_none.value;
                            personAttitude = data[i].nodePersonList && data[i].nodePersonList.length>0?data[i].nodePersonList[0].attitude:_self.WorkFlowPersonAttitude.no_read.value;
                        }
                        statusImg = _self.getStatusImg({
                            nodeType:data[i].nodeType,
                            nodeState:state,
                            personState:personState,
                            personAttitude:personAttitude,
                            isCurrent:(data[i].id == _self.currentNodeId),
                            isFirst:(i==0)
                        });
                    }else{
                        statusImg = _self.getStatusImg({
                            nodeType:data[i].nodeType,
                            nodeState:state,
                            isCurrent:(data[i].id == _self.currentNodeId),
                            isFirst:(i==0)
                        });
                    }
                    /**催办图标获取 **/
                    hastenWorkImg =  _self.getHastenWorkImg({
                        nodeType:data[i].nodeType,
                        notifyNode:data[i].notifyNode,
                        nodeState:state,
                        isCurrent:(data[i].id == _self.currentNodeId),
                        isFirst:(i==0)
                    });

                    if(data[i].id == _self.currentNodeId && (attr)){
                        attr.fill = '#fa8d00'; //橘黄色与  图标颜色一致
                    }
                }
                var notifyImg = _self.getNotifyImg({
                    nodeType:data[i].nodeType,
                    notifyNode:data[i].notifyNode,
                    nodeState:state,
                    isCurrent:(data[i].id == _self.currentNodeId),
                    isFirst:(i==0)
                });
                states[newId] = {
                    id: data[i].id,
                    "type": i == 0 ? 'start' : type,
                    "text": {
                        "text": data[i].name
                    },
                    "attr": attr
                };
                if(statusImg &&(statusImg.indexOf('state_none')<0) ){ //如果状态图标找到则 绑定到显示位置,state_none 尚未到达无需状态
                    states[newId].statusImg = {
                        width:22,
                        height:22,
                        src:statusImg
                    };
                }
                /* 催办图标**/
                if(hastenWorkImg&&hastenWorkImg.length>0){
                    states[newId].hastenWorkImg = {
                        cursor : "pointer",
                        width:38,
                        height:17,
                        src:hastenWorkImg
                    };
                }
                /** 知会图标创建****/
                if(notifyImg&&notifyImg.length){
                    states[newId].notifyImg = {
                        //cursor : "pointer",
                        width:17,
                        height:17,
                        src:notifyImg
                    };
                }
                /** 判断父节点是否 是split 如果是 则需要 提供分支图标显示***/
                if(data[i].isParentSplit && (!data[i].isSplit)){
                    var splitImgSrc  = _self.getSplitImgSrc();
                    states[newId].splitImg =  {
                        pid:data[i].pid,
                        cursor : "pointer",
                        width:16,
                        height:16,
                        src:splitImgSrc
                    };
                }else{
                    states[newId].splitImg = null;
                }
                if(data[i].isJoin){
                    states[newId].joinImg =  {
                        cursor : "pointer",
                        width:16,
                        height:16,
                        src:_self.getJoinImgSrc()
                    };
                }else{
                    states[newId].joinImg = null;
                }
                /*
                 * 节点图标 根据节点类型配置 获取图标 如果没有配置则走默认
                 */
                if( FlowUi.config.tools.states[data[i].nodeType]&& _self.WorkFlowNodeType[data[i].nodeType]){
                    var imgConfig =  FlowUi.config.tools.states[data[i].nodeType].img;
                    if(imgConfig){
                        states[newId].img = imgConfig;
                    }
                }
                _self.nodeIdMap[data[i].id].attr = attr;
                //if( FlowUi.config.tools.states[data[i].nodeType]&& _self.WorkFlowNodeType[data[i].nodeType]){
                //   var imgConfig = FlowUi.config.tools.states[data[i].nodeType];
                //    _self.nodeIdMap[data[i].id].img = imgConfig.img;
                //}

                _self.buildPathsByNode(data[i], paths, isVertical);
            }
            return obj;
        },
        /**
         * 根据节点创建 连接线
         */
        buildPathsByNode: function (node, paths, isVertical) {
            var _self = this;
            var lines = node.lines;
            var pathId;
            for (var i = 0, len = lines.length; i < len; i++) {

                pathId = _self.createNewId();
                paths[pathId] = lines[i];
                var dots = lines[i].dots;
                if (isVertical) {
                    lines[i].dots = _self.getDots4vertical(dots);
                }
            }
        },
        /**
         * 根据点列表 进行正时针旋转90度后返回 点列表
         *
         */
        getDots4vertical: function (dots) {
            var _self = this;
            var arr = [];
            var curr;
            for (var i = 0, len = dots.length; i < len; i++) {
                curr = _self.rotate(dots[i], Math.PI / 2);
                //curr.x +=500;
                curr.x += (_self.nodeWidth / 2 + _self.nodeHeight / 2);
                curr.y -= (_self.nodeWidth / 2 - _self.nodeHeight / 2);
                arr.push(curr);
            }
            return arr;
        },
        /**
         *
         * 备份 数组的流程节点数据，深度clone备份需要 遍历数组 对元素对象进行深度复制
         */
        cloneWorkFlowNodeList: function (arr) {
            var items = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                items[i] = $.extend(true, {}, arr[i]);
            }
            //return $.extend(true,[],arr);
            return items;
        },
        event2processGraph:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            _self.toProcessProps = false;
            FlowUi.render('flow-ui-item'); //渲染按钮
            FlowUi.render('flow-ui-bottomButtons');
            $("#ouiflow").show();
            $("#flow-ui-viewType").show();
            $("#flow-ui-processProp").hide();
            _self.scroll2center();
            return false;
        },
        event2processProps:function(cfg){
            var _self = this;
            var FlowUi = _self.getFlowUi();
            _self.toProcessProps = true;
            FlowUi.render('flow-ui-item'); //渲染按钮
            if(!$("#flow-ui-processProp").hasClass('flow-ui-processProp')){
                _self.processProp = _self.flowData; //流程数据渲染
                var rights = _self.processProp.rights ||"[]";
                var rightJson = oui.parseJson(rights);
                var persons = [];
                var selectPerson4right ='';
                var selectPerson4rightValue =[];
                for(var i= 0,len=rightJson.length;i<len;i++){
                    persons.push({
                        id:rightJson[i].toId,
                        name:rightJson[i].toName,
                        typeFlag:rightJson[i].toType
                    });
                    selectPerson4rightValue.push(rightJson[i].toId);
                }
                if(persons.length>0){
                    selectPerson4right = oui.parseString(persons);
                }
                _self.processProp.selectPerson4right = selectPerson4right;
                _self.processProp.selectPerson4rightValue = selectPerson4rightValue.join(",");
                FlowUi.render('flow-ui-processProp');
                oui.parse();
            }
            FlowUi.render('flow-ui-bottomButtons');
            $("#ouiflow").hide();
            $("#flow-ui-viewType").hide();
            $("#flow-ui-processProp").show();
            return false;
        },
        /**
         * 横向
         */
        event2trans: function (cfg) {
            var _self = this;
            var ViewType = _self.ViewType;
            var FlowUi = _self.getFlowUi();
            _self.isVertical = false;
            _self.flowData.viewType = ViewType.horizontal.value;
            FlowUi.render('flow-ui-viewType'); //渲染横向纵向
            $('#ouiflow').css({width:'',height:'',left:0,top:0});
            _self.refresh();
            return false;
        },
        /**
         * 纵向
         */
        event2vertical: function (cfg) {
            var _self = this;
            var ViewType = _self.ViewType;
            var FlowUi = _self.getFlowUi();
            _self.isVertical = true;
            _self.flowData.viewType = ViewType.vertical.value;
            FlowUi.render('flow-ui-viewType');
            $('#ouiflow').css({width:'',height:'',left:0,top:0});
            _self.refresh();
            return false;
        },
        /**
         * 根据 按钮或者元素上配置的 flow-themeId属性获取对应的渲染配置
         */
        event2renderByThemeId: function (cfg) {
            var _self = this;
            var FlowUi = _self.getFlowUi();
            var el = cfg.el;
            var themeId = $(el).attr('flow-themeId');
            _self.themeId = themeId;
            FlowUi.render('flow-ui-item');
            FlowUi.config = $.extend(true, FlowUi.config, FlowUi.themes[themeId] || {});
            _self.refresh();
        },

        /**
         * 根据工作流结构数据刷新流程图
         */
        refresh: function () {

            this.newId = 0; //刷新时将newId复原
            var _self = this;
            _self.progressBar = oui.progress("加载中...");
            _self.hideContextMenu && _self.hideContextMenu();
            if (_self.isVertical) {
                _self.offsetY = 100; //横向 160 纵向为100
                _self.x_distance_S = 64; //横向为80 纵向为60 //分子节点 和聚合节点连接线距离
                _self.x_distance = 120 //串发节点连线距离
                _self.rootPosY = -17; //第一个节点 左偏移量
                _self.rootPosX =150;
                //_self.nodeHeight = 65+_self.nodeSplitWidth;
            } else {
                _self.offsetY = 60; //横向 60 纵向为100
                _self.x_distance_S = 65; //横向为80 纵向为60
                _self.x_distance = 130;
                _self.rootPosY = 0; //第一个节点 左偏移量
                _self.rootPosX=50;
                //_self.nodeHeight = 65;
            }
            _self.maxLevel_H = 0;
            _self.maxLevel_V = 0;
            _self.mc_width = 0;
            _self.mc_height = 0;
            _self.branchLevelVMap = new FlowBiz.Map();
            _self.splitJoinMap = new FlowBiz.Map();
            _self.joinSplitMap = new FlowBiz.Map();
            var cloneArr = _self.cloneWorkFlowNodeList(_self.workFlowNodeList);
            //console.log(oui.biz.Tool.encode(_self.workFlowNodeList));
            //console.log('create before...');
            var startNode = _self.createTreeNode(cloneArr);
            //console.log(oui.biz.Tool.encode(_self.workFlowNodeList));
            //console.log('create after...');
            _self.countLevelH(startNode, 0); //计算横向层级
            _self.countLevelV(startNode, 0); //计算纵向层级
            _self.countPosition(startNode, "false"); //计算节点位置
            _self.countDistance(); //计算 宽高
            _self.countNodeLinesPosition(startNode); //计算节点的连接线位置
            var workflowTreeNode = _self.createNodeData(cloneArr, _self.isVertical);//根据数组节点创建 树结构流程节点
            _self.workflowTreeNode = workflowTreeNode;
            var width = _self.isVertical ? _self.mc_height : _self.mc_width;
            var height = _self.isVertical ? _self.mc_width : _self.mc_height;
            width+=100;
            height+=100;
            //if(height<=120){
            //    height=150;
            //}
            //if((!_self.isVertical) &&(width<500)){
            //    width=500;
            //}
            //console.log('refresh..');
            //console.log(oui.biz.Tool.encode(_self.workFlowNodeList));
            //console.log(_self.workFlowNodeList);
            $(function () {
                $("#ouiflow").css({left:0,top:0,position: "relative",width:'',height:''});
                $('#ouiflow').html(""); //渲染流程图区域
                $('#ouiflow').FlowUi({// 初始化流程图区域渲染
                    basePath: oui.getContextPath() + 'res_engine/workflow/',
                    //restore:eval("({states:{rect1:{type:'start',text:{text:'开始'}, attr:{ x:496, y:47, width:100, height:50}, props:{text:{value:'开始'},temp1:{value:''},temp2:{value:''}}},rect2:{type:'task',text:{text:'任务1'}, attr:{ x:499, y:156, width:100, height:50}, props:{text:{value:'任务1'},temp1:{value:''},temp2:{value:''}}},rect3:{type:'fork',text:{text:'分支'}, attr:{ x:499, y:263, width:100, height:50}, props:{text:{value:'分支'},temp1:{value:''},temp2:{value:''}}},rect4:{type:'task',text:{text:'任务2'}, attr:{ x:117, y:358, width:100, height:50}, props:{text:{value:'任务2'},temp1:{value:''},temp2:{value:''}}},rect5:{type:'task',text:{text:'任务3'}, attr:{ x:294, y:364, width:100, height:50}, props:{text:{value:'任务3'},temp1:{value:''},temp2:{value:''}}},rect6:{type:'task',text:{text:'任务4'}, attr:{ x:785, y:358, width:100, height:50}, props:{text:{value:'任务4'},temp1:{value:''},temp2:{value:''}}},rect7:{type:'join',text:{text:'合并'}, attr:{ x:501, y:364, width:100, height:50}, props:{text:{value:'合并'},temp1:{value:''},temp2:{value:''}}},rect8:{type:'end',text:{text:'结束'}, attr:{ x:498, y:593, width:100, height:50}, props:{text:{value:'结束'},temp1:{value:''},temp2:{value:''}}}},paths:{path9:{from:'rect1',to:'rect2', dots:[],text:{text:'TO 任务1',textPos:{x:27,y:-10}}, props:{text:{value:'TO 任务1'}}},path10:{from:'rect2',to:'rect3', dots:[],text:{text:'TO 分支',textPos:{x:39,y:-6}}, props:{text:{value:'TO 分支'}}},path11:{from:'rect3',to:'rect5', dots:[],text:{text:'TO 任务3',textPos:{x:33,y:-8}}, props:{text:{value:'TO 任务3'}}},path12:{from:'rect5',to:'rect7', dots:[],text:{text:'TO 合并',textPos:{x:30,y:-5}}, props:{text:{value:'TO 合并'}}},path13:{from:'rect7',to:'rect8', dots:[],text:{text:'TO 结束',textPos:{x:38,y:-8}}, props:{text:{value:'TO 结束'}}},path14:{from:'rect3',to:'rect4', dots:[{x:316,y:291}],text:{text:'TO 任务2',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务2'}}},path15:{from:'rect4',to:'rect7', dots:[{x:318,y:498}],text:{text:'TO 合并',textPos:{x:-11,y:11}}, props:{text:{value:'TO 合并'}}},path16:{from:'rect3',to:'rect6', dots:[{x:762,y:283}],text:{text:'TO 任务4',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务4'}}},path17:{from:'rect6',to:'rect7', dots:[],text:{text:'TO 合并',textPos:{x:30,y:10}}, props:{text:{value:'TO 合并'}}}},props:{props:{name:{value:'新建流程'},key:{value:''},desc:{value:''}}}})"),
                    //restore: eval("({states:{rect16:{type:'start',text:{text:'开始'}, attr:{ x:496, y:47, width:100, height:50}, props:{text:{value:'开始'},temp1:{value:''},temp2:{value:''}}},rect17:{type:'task',text:{text:'任务1'}, attr:{ x:499, y:156, width:100, height:50}, props:{text:{value:'任务1'},temp1:{value:''},temp2:{value:''}}},rect18:{type:'fork',text:{text:'分支'}, attr:{ x:499, y:263, width:100, height:50}, props:{text:{value:'分支'},temp1:{value:''},temp2:{value:''}}},rect19:{type:'task',text:{text:'任务2'}, attr:{ x:274, y:362, width:100, height:50}, props:{text:{value:'任务2'},temp1:{value:''},temp2:{value:''}}},rect20:{type:'task',text:{text:'任务3'}, attr:{ x:499, y:365, width:100, height:50}, props:{text:{value:'任务3'},temp1:{value:''},temp2:{value:''}}},rect21:{type:'task',text:{text:'任务4'}, attr:{ x:701, y:364, width:100, height:50}, props:{text:{value:'任务4'},temp1:{value:''},temp2:{value:''}}},rect22:{type:'join',text:{text:'合并'}, attr:{ x:499, y:472, width:100, height:50}, props:{text:{value:'合并'},temp1:{value:''},temp2:{value:''}}},rect23:{type:'end',text:{text:'结束'}, attr:{ x:498, y:593, width:100, height:50}, props:{text:{value:'结束'},temp1:{value:''},temp2:{value:''}}}},paths:{path24:{from:'rect16',to:'rect17', dots:[],text:{text:'TO 任务1',textPos:{x:27,y:-10}}, props:{text:{value:'TO 任务1'}}},path25:{from:'rect17',to:'rect18', dots:[],text:{text:'TO 分支',textPos:{x:39,y:-6}}, props:{text:{value:'TO 分支'}}},path26:{from:'rect18',to:'rect20', dots:[],text:{text:'TO 任务3',textPos:{x:33,y:-8}}, props:{text:{value:'TO 任务3'}}},path27:{from:'rect20',to:'rect22', dots:[],text:{text:'TO 合并',textPos:{x:30,y:-5}}, props:{text:{value:'TO 合并'}}},path28:{from:'rect22',to:'rect23', dots:[],text:{text:'TO 结束',textPos:{x:38,y:-8}}, props:{text:{value:'TO 结束'}}},path29:{from:'rect18',to:'rect19', dots:[{x:316,y:291}],text:{text:'TO 任务2',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务2'}}},path30:{from:'rect19',to:'rect22', dots:[{x:318,y:498}],text:{text:'TO 合并',textPos:{x:-11,y:11}}, props:{text:{value:'TO 合并'}}},path31:{from:'rect18',to:'rect21', dots:[{x:762,y:283}],text:{text:'TO 任务4',textPos:{x:0,y:-10}}, props:{text:{value:'TO 任务4'}}},path32:{from:'rect21',to:'rect22', dots:[{x:747,y:495}],text:{text:'TO 合并',textPos:{x:30,y:10}}, props:{text:{value:'TO 合并'}}}},props:{props:{name:{value:'新建流程'},key:{value:''},desc:{value:''}}}})"),
                    restore: workflowTreeNode,
                    width: width,
                    height: height,
                    tools: {
                        save: {
                            onclick: function (data) {
                                console.log(data);
                                console.log(oui.biz.Tool.encode(eval('(' + data + ')')));

                                alert('save:\n' + data);
                            }
                        }
                    }
                });
                _self.scroll2center();
                _self.progressBar && _self.progressBar.hide();
            });
            _self.changed();
        }
    };
    /**
     * 滚动条滚动到居中位置
     */
    FlowBiz.scroll2center=function(){
        var _self = this;
        //if(_self.isVertical){
        //    var scrollSize = $('html,body')[0].scrollWidth - $('html,body').width();
        //    $('html,body').scrollLeft(scrollSize/2);
        //}else{
        //    var scrollSize = $('html,body').height()-$('iframe',window.parent.document).height();
        //    $('html,body').scrollTop(scrollSize/2);
        //}
        if(_self.isVertical){
            var scrollSize = $('.flow-body')[0].scrollWidth - $('.flow-body').width();
            var barWidth =$('.flow-body')[0].offsetWidth -$('.flow-body')[0].clientWidth;
            var barHeight = $('.flow-body')[0].offsetHeight-$('.flow-body')[0].clientHeight;

            if(barWidth<=0 && barHeight<=0){
                $("#ouiflow").css({position:'relative',left:(0)+'px'});
            }else if(barHeight<=0){
                $("#ouiflow").css({position:'relative',left:(17/2)+'px'});
            }
            $('.flow-body').scrollLeft(scrollSize/2);
        }else{
            var scrollSize = $('.flow-body')[0].scrollHeight - $('.flow-body').height();
            $('.flow-body').scrollTop(scrollSize/2);
        }
    }
    /************流程图位置计算 开始*****************************************************/

    /**
     * 计算横向层次
     * @param node
     * @param index
     */
    FlowBiz.countLevelH = function (node, index) {
        var _self = this;
        var _parent = node.parents;
        var children = node.children;
        node.index = index;
        if (node.level_H && node.level_H > 100) {
            throw "流程图显示最大支持的横向节点数为100！";
        }
        var maxCurrentLevel_H = 0;
        var _parent1;
        if (_parent.length == 0) {
            node.level_H = 1;
        } else if (node.isJoin) {
            for (var i = 0, len = _parent.length; i < len; i++) {
                _parent1 = _parent[i];
                if (_parent1.level_H > maxCurrentLevel_H) {
                    maxCurrentLevel_H = _parent1.level_H;
                }
            }
            maxCurrentLevel_H++;
            if (node.level_H >= maxCurrentLevel_H) {
                return;
            }
            node.level_H = maxCurrentLevel_H;
            if (node.level_H > _self.maxLevel_H) {
                _self.maxLevel_H = node.level_H;
            }
        } else {
            for (var i = 0, len = _parent.length; i < len; i++) {
                _parent1 = _parent[i];
                node.level_H = _parent1.level_H + 1;
                if (node.level_H > maxCurrentLevel_H) {
                    maxCurrentLevel_H = node.level_H;
                }
            }
            if (node.level_H > _self.maxLevel_H) {
                _self.maxLevel_H = node.level_H;
            }
        }

        for (var k = 0, len = children.length; k < len; k++) {
            _self.countLevelH(children[k], k);
        }
    };

    /**
     * 计算垂直层次
     * @param node
     * @param index
     */
    FlowBiz.countLevelV = function (node, index) {
        var _self = this;
        if (node.level_V > 0) return;
        var children = node.children;
        node.index = index;
        if (node.level_V > 100) {
            throw  "流程图显示最大支持的纵向节点数为100！";
        }
        var child;
        if (children.length == 0) {
            node.level_V = 1;
        } else {
            var result = 0;
            for (var i = 0, len = children.length; i < len; i++) {
                child = children[i];
                _self.countLevelV(child, i);
                result += child.level_V;
            }

            node.level_V = result;
            if (node.level_V > _self.maxLevel_V) {
                _self.maxLevel_V = node.level_V;
            }
            // Split节点
            if (node.isSplit) {
                // Split节点等于每个分支到对应Join节点之间的所有闭环level_V最大值之和。
                var join = _self.findJoin(node);
                result = 0;
                for (var j = 0, jLen = children.length; j < jLen; j++) {
                    child = children[j];
                    var splits = _self.findAllSplit(child, join);
                    var max = 1;
                    if (child.isSplit) {
                        splits.push(child);
                    }
                    for (var k = 0, kLen = splits.length; k < kLen; k++) {
                        var kNode = splits[k];
                        _self.countLevelV(kNode, kNode.index);
                        if (max < kNode.level_V) {
                            max = kNode.level_V;
                        }
                    }
                    result += max;
                }
                if (result < children.length) {
                    result = children.length;
                }
                node.level_V = result;
                if (result > _self.maxLevel_V) {
                    _self.maxLevel_V = result;
                }
                if (join != null) {
                    join.level_V = result;
                }
            } else if (node.isJoin || children[0].isJoin) {
                // Join节点
                node.level_V = 1;
            } else {
                // 普通节点
                // 查找后续的第一个Split节点，遇到Join或End则终止
                var split = children[0];

                while (!split.isSplit) {
                    if (split.children.length == 0) {
                        break;
                    }
                    if (split.isJoin) {
                        break;
                    }
                    split = split.children[0];
                }
            }
        }
    };

    /**
     * 计算最终的距离
     */
    FlowBiz.countDistance = function () {
        var _self = this;
        _self.mc_width =_self.countedSVGWidth+65; //默认加一个宽度
        _self.mc_height = _self.mc_height = _self.y_distance * _self.maxLevel_V;
        //_self.mc_width = _self.x_distance * _self.maxLevel_H;
    };


    /**
     * 计算节点与子节点之间的连线
     */
    FlowBiz.countNodeLinesPosition = function (node) {
        var x = node.x;
        var y = node.y;
        var children = node.children;
        var lines = [];
        var _self = this;
        if (children.length > 0) {
            //取父与子的中点
            var firstChild = children[0];
            var endChild = children[children.length - 1];
            var lines = [];
            //var midPos = {x: (x+firstChild.x)/2+_self.nodeWidth/2,y:node.y+_self.nodeHeight/2};
            var dots = [], currPos;
            //分割线与子节点的横线连接
            for (var i = 0, len = children.length; i < len; i++) {
                dots = [];

                if (node.y == children[i].y) {
                    //dots = [midPos];
                } else {

                    if (node.isSplit) {
                        dots = [{
                            x: node.x + _self.nodeWidth / 2,
                            y: children[i].y + _self.nodeHeight / 2
                        }];
                    }
                    if (children[i].isJoin) {
                        dots = [{
                            x: children[i].x + _self.nodeWidth / 2,
                            y: node.y + _self.nodeHeight / 2
                        }];
                    }
                }
                lines.push({
                    nodeId: node.id,
                    "from": node.newId,
                    "to": children[i].newId,
                    "dots": dots,
                    "text": {
                        "text": "",// "TO "+children[i].name,
                        "textPos": {
                            "x": -1,
                            "y": -1
                        }
                    },
                    "props": {
                        "text": {
                            "value": ""// "TO "+children[i].name
                        }
                    }
                });
                _self.countNodeLinesPosition(children[i]);
            }

        }
        var newLines = [];
        if(lines&& lines.length){
            var centerIdx;
            if(lines.length%2 ==0){
                centerIdx = lines.length/2-1;
            }else{
                centerIdx = parseInt(lines.length/2);
            }
            if(centerIdx<0){
                centerIdx = 0;
            }
            for(var i= 0;i<= centerIdx;i++){
                newLines.push(lines[i]);
            }

            for(var j=lines.length-1;j>centerIdx;j--){
                newLines.push(lines[j]);
            }
        }
        node.lines = newLines;
    };
    /**
     * 旋转 点的位置
     * FlowBiz.rotate({x : 0,y : 4},-Math.PI / 4) //第二个参数为负数时逆时针旋转，否则正时针旋转
     *
     */
    FlowBiz.rotate = function (source, angle)//angle为正时逆时针转动, 单位为弧度
    {
        var a, r;
        var _self = this;
        a = Math.atan2(source.y, source.x)//atan2自带坐标系识别, 注意X,Y的顺序

        a += angle//旋转
        r = Math.sqrt(source.x * source.x + (source.y) * (source.y))//半径

        var nx = Math.cos(a) * r;
        var ny = Math.sin(a) * r;

        nx += (_self.mc_height); //位置变换

        ny -= _self.y_distance;
        //ny-=_self.y_distance-_self.nodeHeight*3/2;


        return {
            x: nx,
            y: ny
        }

    };
    /**
     * 计算节点的位置
     * @param node
     * @param isNew
     */
    FlowBiz.countPosition = function (node, isNew) {
        var _self = this;
        var _parent = node.parents;
        var children = node.children;
        var isCountX = false;
        var xPosition = 0;
        var y = 0;
        if (_parent.length == 0) {
            node.x = _self.rootPosX;
            node.y = _self.maxLevel_V * _self.y_distance / 2 + _self.rootPosY;
            _self.firstPos = {x:node.x,y:node.y};
        } else {
            xPosition = _parent[0].x + _self.x_distance;
            if (_parent.length == 1) {
                if ((node.isSplit && children.length > 1) // 实体Split
                    || _parent[0].isSplit || _parent[0].isJoin) { // 父节点为Split节点，缩短其连线
                    xPosition = _parent[0].x + _self.x_distance_S;
                } else if (children.length == 0) { // END节点
                    // xPosition = _parent[0].x + _self.x_distance_S + 10;
                    //_self.mc_width = xPosition + 60;
                }
            } else {
                isCountX = true;
            }
            if (isCountX) {
                var maxXPos = _parent[0].x ||0;
                for (var i = 1, len = _parent.length; i < len; i++) {
                    //取父节点中x位置最大的作为相对位置
                    maxXPos = Math.max(maxXPos,_parent[i].x||0);

                    /*
                     * 注释掉之前的算法 用于计算聚合节点x位置
                     */
                    //var iNode = _parent[i];
                    //if (isCountX && (node.level_H == iNode.level_H + 1)) {
                    //    xPosition = iNode.x + _self.x_distance_S;
                    //    break;
                    //}
                }
                xPosition = maxXPos+ _self.x_distance_S; //计算出当前聚合节点的x位置
            }
            node.x = xPosition;

            if (_parent.length == 1 && _parent[0].isJoin) {
                y = _parent[0].y;
            } else {
                // 以父节点位置为基准
                // 减去所有兄弟占位的一半
                var disp = _parent[0].level_V;
                y = _parent[0].y - disp * _self.y_distance / 2;
                var branchLevelV;


                // 加上前面的兄弟节点的偏移
                for (var i = 0, len = node.index; i < len; i++) {
                    var sibling = _parent[0].children[i];
                    branchLevelV = _self.getBranchLevelV(sibling);
                    y += branchLevelV * _self.y_distance;
                }
                // 减去自身的偏移的一半 父为split而且子节点数大于1（考虑分支）
                if (_parent[0].isSplit) {
                    if (_parent[0].children.length > 1) {
                        branchLevelV = _self.getBranchLevelV(node);
                        y += branchLevelV * _self.y_distance / 2;
                    } else { // split的唯一父节点是split的情况,直接赋值为父节点的Y值
                        y = _parent[0].y;
                    }
                } else {
                    //console.log(node.level_V);
                    y += node.level_V * _self.y_distance / 2;
                }

            }
            if (_parent.length > 1) {
                node.y = (_parent[0].y + _parent[_parent.length - 1].y) / 2;
            } else {
                node.y = (y);
            }
        }
        if (node.x != 0 && node.y != 0) {
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                _self.countPosition(child, isNew);
            }
        }
        if(node.isEnd && node.x&&node.y){
            _self.endPos = {
                x:node.x,
                y:node.y
            };
            _self.countedSVGWidth = _self.endPos.x - _self.firstPos.x;
        }
    };


    /**
     * 根据split节点查找join节点
     * @param split
     * @returns {*}
     */
    FlowBiz.findJoin = function (split) {
        var self = this;
        var key = split.id;
        if (self.splitJoinMap.containsKey(key)) {
            return self.splitJoinMap.get(key);
        }
        /***找出所有的join节点 ****/
        var joins = self.findAllJoin(split);
        var children = split.children;
        var arr = [];
        /** 遍历所有的join节点，判断当前节点以及子节点和孙子节点都于join节点 属于同一条分支或者同一条线上 ****/
        for (var i = 0, len = joins.length; i < len; i++) {
            var join = joins[i];
            var allPass = true;
            for (var j = 0, jLen = children.length; j < jLen; j++) {
                var child = children[j];
                if (!self.passThrough(child, join)) {
                    allPass = false;
                    break;
                }
            }
            /***如果当前join节点与split节点在同一条线上，则放入join列表 ***/
            if (allPass) {
                arr.push(join);
            }
        }
        if (arr == null || arr.length < 1) {
            return null;
        }
        if (arr.length == 1) {
            return arr[0];
        }
        /*** 存在 多分子，多join节点时，需要取一个join节点作为目标，判断与后续 同一条线上的join节点，将同一条线上的最后一个join节点作为split的匹配节点 ****/
        var result = arr[0];
        for (var i = 0, len = arr.length; i < len; i++) {
            var aNode = arr[i];
            if (result.id == aNode.id) {
                continue;
            }
            if (self.passThrough(aNode, result)) {
                result = aNode;
            }
        }

        self.splitJoinMap.put(key, result);
        self.joinSplitMap.put(result.id, split);
        return result;
    };

    /**
     * 查找所有的join节点
     * @param node
     * @returns {Array}
     */
    FlowBiz.findAllJoin = function (node) {
        var self = this;
        var result = [];
        var children = node.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.parents.length > 1) {
                result.push(child);
            }
            var arr = self.findAllJoin(child);
            for (var j = 0, jLen = arr.length; j < jLen; j++) {
                result.push(arr[j]);
            }
        }
        return self.unique(result);
    };

    /**
     * 去重
     * @param array
     */
    FlowBiz.unique = function (array) {
        var map = new FlowBiz.Map();
        for (var i = 0, len = array.length; i < len; i++) {
            var node = array[i];
            map.put(node.id, node);
        }
        array = null;//释放数组内存
        return map.values();//直接将map的值转化为数组
    };

    /**
     * 计算两个节点是否通过
     * @param node1
     * @param node2
     * @returns {boolean}
     */
    FlowBiz.passThrough = function (node1, node2) {
        var self = this;
        var children = node1.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.id == node2.id) {
                return true;
            }
            if (self.passThrough(child, node2)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 根据join节点查找split节点
     * @param join
     * @returns {*}
     */
    FlowBiz.findSplit = function (join) {
        var self = this;
        var key = join.id;
        // 先从Join-Split缓存中找
        if (self.joinSplitMap.containsKey(key)) {
            return self.joinSplitMap.get(key);
        }
        var splits = self.findAllSplit(self.startNode, join);

        for (var i = 0, len = splits.length; i < len; i++) {
            var split = splits[i];
            if (self.findJoin(split).id == join.id) {
                self.joinSplitMap.put(key, split);
                return split;
            }
        }
        return null;
    };

    /**
     * 查找所有的split节点
     * @param node
     * @param end
     * @returns {*}
     */
    FlowBiz.findAllSplit = function (node, end) {
        var self = this;
        var result = [];
        if (node == null || end == null) {
            return result;
        }
        if (node.id == end.id) {
            return result;
        }
        var children = node.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.isSplit) {
                result.push(child);
            }
            var arr = self.findAllSplit(child, end);
            for (var j = 0, jLen = arr.length; j < jLen; j++) {
                result.push(arr[j]);
            }
        }
        return self.unique(result);
    };
    /**
     * 获取分支节点的垂直位置
     * @param node
     * @returns {number|*}
     */
    FlowBiz.getBranchLevelV = function (node) {
        var self = this;
        var key = node.id;
        if (self.branchLevelVMap.containsKey(key)) {
            return self.branchLevelVMap.get(key);
        }
        var max = node.level_V;
        var l;
        if (node.isSplit) {
            // 如果是Split，直接从对应的Join节点开始找下一个环
            var join = self.findJoin(node);
            l = self.getBranchLevelV(join);
            if (max < l) {
                max = l;
            }
        } else {
            var children = node.children;
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                // 遇到第一个join停止
                if (child.isJoin) {
                    break;
                }
                if (child.level_V > max) {
                    max = child.level_V;
                }
                l = self.getBranchLevelV(child);
                if (max < l) {
                    max = l;
                }
            }
        }
        // 缓存
        self.branchLevelVMap.put(key, max);
        return max;
    };
    /**
     * 根据当前节点获取 分支的 levelV
     默认返回当前节点的LevelV
     */
    /*
     *FlowBiz.getBranchLevelV = function(node){
     return node.level_V;
     };
     */
    /**
     * Map 构造函数
     * @constructor
     */
    var Map = function () {
        this.container = {};
    }

    /**
     * 存入
     * @param key 存入数据的关键字
     * @param value 存入的数据
     */
    Map.prototype.put = function (key, value) {
        try {
            if (key != null && key != "") {
                this.container[key] = value;
            }
        } catch (e) {
            return e;
        }
    };

    /**
     * 取出
     * @param key 存入数据的关键字
     */
    Map.prototype.get = function (key) {
        try {
            return this.container[key];
        } catch (e) {
            return e;
        }
    };

    /**
     * 删除
     * @param key 存入数据的关键字
     * @returns {*}
     */
    Map.prototype.remove = function (key) {
        var result = null;
        try {
            result = this.container[key];
            delete this.container[key];
        } catch (e) {
            return result;
        }
        return result;
    };

    /**
     * 清空
     */
    Map.prototype.clear = function () {
        try {
            delete this.container;
            this.container = {};
        } catch (e) {
            return e;
        }
    };

    /**
     * 获取所有key
     */
    Map.prototype.keys = function () {
        var keys = [];
        for (var p in this.container) {
            keys.push(p);
        }
        return keys;
    };

    /**
     * 获取所有value
     */
    Map.prototype.values = function () {
        var values = [];
        var keys = this.keys();
        for (var i = 0; i < keys.length; i++) {
            values.push(this.container[keys[i]]);
        }
        return values;
    };

    /**
     * 判断key是否包含
     * @param key 存入数据的关键字
     * @returns {*} true 包含，false 不包含
     */
    Map.prototype.containsKey = function (key) {
        try {
            for (var p in this.container) {
                if (p == key) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return e;
        }
    };

    /**
     * 判断是否包含该值
     * @param value 存入数据的值
     * @returns {*}
     */
    Map.prototype.containsValue = function (value) {
        try {
            for (var p in this.container) {
                if (this.container[p] === value) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return e;
        }
    };

    /**
     * 获取长度
     */
    Map.prototype.size = function () {
        return this.keys().length;
    };

    /**
     * 判断是否为空
     * @returns {boolean} true为空，false不为空
     */
    Map.prototype.isEmpty = function () {
        return this.keys().length == 0
    };

    Map.prototype.valueArray = function () {
        return this.values();
    };
    /**
     * Map 类
     */
    FlowBiz.Map = Map;
    /**********流程图位置计算结束*******************************************************/

    /**
     * 创建FlowBiz类
     */
    FlowBiz = oui.createClass(FlowBiz);

    /**
     * 启用停用 枚举
     * @type {{enable, disable, DRAFT}}
     */
    FlowBiz.StateEnum ={
        enable:{value:1,desc:'启用'},
        disable:{value:2,desc:'停用'},
        DRAFT:{value:3,desc:'草稿'}
    };

    /**
     * 流程状态枚举
     * @type {{}}
     */
    FlowBiz.WorkFlowState = {
        waitSend: {
            value: 0,
            desc: "保存待发"
        },
        on: {
            value: 1,
            desc: "流转中"
        },
        stop: {
            value: 2,
            desc: "终止"
        },
        off: {
            value: 3,
            desc: "完结"
        }
    };
    /**
     * 流程节点状态枚举
     * @type {{}}
     */
    FlowBiz.WorkFlowNodeState = {
        state_none: {
            value: 0,
            desc: "尚未到达"
        },
        state_waitDo: {
            value: 1,
            desc: "流程到达,所有人员待办未处理"
        },
        state_waitDo_someOne: {
            value: 2,
            desc: "流程到达,部分人员已处理"
        },
        state_done: {
            value: 3,
            desc: "流程到达,所有人员已处理"
        }
    };
    /**
     * 流程节点人员状态
     * state_none(0, "尚未到达"),
     state_waitSend(1,"保存待发"),
     state_sent(2, "已发"),
     state_waitDo(3, "待办"),
     state_done(4, "已办");
     * @type {{}}
     */
    FlowBiz.WorkFlowPersonState = {
        state_none: {
            value: 0,
            desc: "尚未到达"
        },
        state_waitSend:{
            value: 1,
            desc: "保存待发"
        },
        state_sent:{
            value: 2,
            desc: "已发"
        },
        state_waitDo: {
            value: 3,
            desc: "待办"
        },
        state_done: {
            value: 4,
            desc: "已办"
        }
    };
    /**
     * 获取节点状态图标
     * @param cfg
     * @returns {string}
     */
    FlowBiz.getStatusImgName = function(cfg){
        var _self = this;
        var nodeState=cfg.nodeState||0,personState=cfg.personState||0,personAttitude=cfg.personAttitude||1,isCurrent=cfg.isCurrent||false,isFirst=cfg.isFirst||false,nodeType=cfg.nodeType;
        var statusImgName ='';
        if(nodeType=='person'){
            var personKey = _self.getEnumKeyByValue(personState,_self.WorkFlowPersonState);
            var attitudeKey="";
            if(!personKey){
                personKey = _self.getEnumKeyByValue(_self.WorkFlowPersonState.state_none.value,_self.WorkFlowPersonState);
            }
            statusImgName = personKey;
            if(personKey && (personKey!='state_none') && (personKey!='state_waitSend')&& (personKey!='state_sent')){ //state_none,state_waitSend,state_sent 不用判断attitude状态
                attitudeKey = _self.getEnumKeyByValue(personAttitude,_self.WorkFlowPersonAttitude);
                if(!attitudeKey){
                    attitudeKey=_self.getEnumKeyByValue(_self.WorkFlowPersonAttitude.no_read.value,_self.WorkFlowPersonAttitude);
                }
                statusImgName+= ('_'+attitudeKey);
            }

        }else{
            var nodeKey = _self.getEnumKeyByValue(nodeState,_self.WorkFlowNodeState);
            if(!nodeKey){
                nodeKey = "state_none";
            }
            statusImgName = nodeKey;
        }
        if(isCurrent){
            return statusImgName+'_3'; //橘黄色图标为当前高亮节点
        }else if(isFirst){
            return statusImgName+'_2'; //发起者图标
        }else{
            return statusImgName+'_1'; //默认图标
        }
    };
    /**
     * 根据配置对象 获取当前状态图标
     * @param cfg { var nodeState=cfg.nodeState||0,personState=cfg.personState||0,personAttitude=cfg.personAttitude||1,isCurrent=cfg.isCurrent||false,isFirst=cfg.isFirst||false,nodeType=cfg.nodeType;
       }
     */
    FlowBiz.getStatusImg = function(cfg){
        var _self = this;
        return 'img/16/'+_self.getStatusImgName(cfg)+'.png';
    };
    /**获取催办图标 ***/
    FlowBiz.getHastenWorkImg = function(cfg){
        var _self = this;
        var nodeState = cfg.nodeState||"";
        var src = '';
        var noHastan = oui.getParam('noHastan');
        /** 如果页面参数传入无需催办，则不显示催办按钮****/
        if(noHastan && noHastan =='true'){
            return '';
        }
        if(_self.WorkFlowNodeState.state_waitDo.value == nodeState || _self.WorkFlowNodeState.state_waitDo_someOne.value == nodeState){
            /** 运行态当前人 必须是发起人才能有催办功能,催办功能2018-7-9之前 的逻辑注释如下***/
            //if((_self.currLoginNodeId ==_self.workFlowNodeList[0].nodeId) && (!cfg.notifyNode)){
            //    src= 'img/16/hasten_work.png';
            //}
            /**** 所有人都有催办功能，需求变更 2018-7-9 产品康艳要求 */
            if(!cfg.notifyNode){
                src= 'img/16/hasten_work.png';
            }
        }
        return src;
    };
    FlowBiz.getNotifyImg = function(cfg){
        var src = '';
        if(cfg.notifyNode){
            if(!cfg.isCurrent){
                src= 'img/16/notify_1.png';
            }else{
                src= 'img/16/notify_3.png';
            }
        }
        return src;
    }
    /***如果当前节点的父节点是split节点，则需要在当前节点前面增加 一个split图标 ***/
    FlowBiz.getSplitImgSrc = function(isHigh){
        var _self = this;
        if(isHigh){
            return 'img/16/split-high.png';
        }else{
            return 'img/16/split.png';
        }
    };
    /** 获取join节点 的图片显示****/
    FlowBiz.getJoinImgSrc = function(isHigh){
        var _self = this;
        if(isHigh){
            return 'img/16/join-high.png';
        }else{
            return 'img/16/join.png';
        }
    };

    /**
     * 根据 枚举值 和枚举对象获取对应的 枚举 key
     * @param v
     * @param enumClz
     * @returns {*}
     */
    FlowBiz.getEnumKeyByValue = function(v,enumClz){
        for(var j in enumClz){
            if(v ===enumClz[j].value){
                return j;
            }
        }
        return null;
    }
    /**
     * 人员态度 枚举
     * @type {{no_read: {value: number, desc: string}, has_read: {value: number, desc: string}, hold: {value: number, desc: string}, agree: {value: number, desc: string}, disagree: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowPersonAttitude = {
        no_read: {
            value: 1,
            desc: "未看"
        },
        has_read: {
            value: 2,
            desc: "已阅"
        },
        hold: {
            value: 3,
            desc: "暂存待办"
        },
        agree: {
            value: 4,
            desc: "同意"
        },
        disagree: {
            value: 5,
            desc: "不同意"
        },
        stop:{
            value: 6,
            desc: "终止"
        }
    };

    /**
     * 流程显示方式
     * @type {{horizontal: {value: number, desc: string}, vertical: {value: number, desc: string}}}
     */
    FlowBiz.ViewType = {
        horizontal: {
            value: 1,
            desc: "横向"
        },
        vertical: {
            value: 2,
            desc: "纵向"
        }
    };
    /**
     * 节点类型
     * @type {{all: {value: string, desc: string}, person: {value: string, desc: string}, department: {value: string, desc: string}, company: {value: string, desc: string}, level: {value: string, desc: string}, post: {value: string, desc: string}, role: {value: string, desc: string}, team: {value: string, desc: string}}}
     */
    FlowBiz.WorkFlowNodeType= oui.WorkFlowNodeType; //oui-common中定义流程节点类型
    /**
     * 重要程度 枚举
     * @type {{normal: {value: number, desc: string}, important: {value: number, desc: string}, very_important: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowImportance ={
        normal:{
            value:1,
            desc:'普通'
        },
        important:{
            value:2,
            desc:'重要'
        },
        very_important:{
            value:3,
            desc:'非常重要'
        }
    };
    /**
     * 单元格权限枚举
     * @type {{}}
     */
    FlowBiz.FieldRightEnum = {
        edit:{
            name:'edit',
            value:1,
            desc:'编辑'
        },
        view:{
            name:'view',
            value:2,
            desc:'浏览'
        },
        hidden:{
            name:'hidden',
            value:3,
            desc:'隐藏'
        },
        invisible:{
            name:'invisible',
            value:4,
            desc:'不可见'
        }
    };
    /**
     * 流程节点执行模式 枚举
     * @type {{single: {value: number, desc: string}, multi: {value: number, desc: string}, all: {value: number, desc: string}, competition: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowChooseType =oui.WorkFlowChooseType;
    /**
     * 流程节点权限 枚举
     * @type {{stop: {value: number, desc: string}, rollBack: {value: number, desc: string}, addNodes: {value: number, desc: string}}}
     */
    FlowBiz.WorkFlowNodeRight = oui.WorkFlowNodeRight;//oui-common中的流程节点权限枚举
    /**
     * 校验配置
     * @type {{workFlowNodeListMaxSize: number, nodePersonListMaxSize: number, commentsMaxSize: number}}
     */
    FlowBiz.ValidateConfig ={
        workFlowNodeListMinSize:3,//节点的最少数量限制
        workFlowNodeListMaxSize:60, //节点的总数限制
        nodePersonListMaxSize:100, //节点的成员数限制 查看态用
        commentsMaxSize:100, //意见回复数限制
        failMode:'alert', //失败的提示模式
        workFlowProp:{ //流程属性校验配置
            name:{
                des:"流程名称",
                require:true,
                maxLength:60 //流程标题不能超过60个字符
            },
            des:{
                des:"流程描述",
                maxLength:1000 //流程描述不能超过1000个字符
            }
        },
        workFlowNode:{
            nodeDisplayName:{ //流程节点 的显示名称属性
                maxLength:50 //最大长度为50
            }
        }
    };

    ///**
    // * 校验流程属性
    // * @param flowData
    // * @returns {boolean}
    // */
    //FlowBiz.validateWorkFlowProp = function(flowData) {
    //    var _self = this;
    //    var isCheck = true;
    //    var workFlowPropCfg = _self.ValidateConfig.workFlowProp;
    //
    //    for(var i in workFlowPropCfg){
    //        isCheck = oui.validate4value(flowData[i]||"" ,{
    //            failMsg:workFlowPropCfg[i].des+'长度不能超过{{validateValue}}个字符' ,
    //            maxLength:workFlowPropCfg[i].maxLength,
    //            failMode:_self.ValidateConfig.failMode
    //        });
    //        if(!isCheck){
    //            return false;
    //        }
    //        isCheck = oui.validate4value(flowData[i]||"" ,{
    //            failMsg:workFlowPropCfg[i].des+'不能为空' ,
    //            require:workFlowPropCfg[i].require ||false,
    //            failMode:_self.ValidateConfig.failMode
    //        });
    //        if(!isCheck){
    //            return false;
    //        }
    //    }
    //    return true;
    //};
    /**
     * 校验workFlowNode节点数据
     */
    FlowBiz.validateWorkFlowNode = function(node){
        var _self = this;
        if((!node) || (!node.nodeDisplayName)){
            return true;
        }
        var isCheck = oui.validate4value( node.nodeDisplayName,{
            failMsg:'节点显示名称长度不能超过{{validateValue}}个字符' ,
            maxLength:_self.ValidateConfig.workFlowNode.nodeDisplayName.maxLength,
            failMode:_self.ValidateConfig.failMode
        });
        if(!isCheck){
            return false;
        }
        return true;
    };
    /** 角色类型枚举***/
    FlowBiz.RoleTypeEnum = {
        orgMgr:{
            value:"orgMgr",
            display:"单位管理员"
        },
        departmentMgr:{
            value:'departmentMgr',
            display:"部门管理员"
        },
        depLeader:{
            value:'depLeader',
            display:"部门主管"
        },
        formMgr:{
            value:'formMgr',
            display:"表单管理员"
        },
        surveyMgr:{
            value:'surveyMgr',
            display:"调查管理员"
        }
    };
    /*** 流程分支条件 值变量 ****/
    FlowBiz.roleVarFields = [FlowBiz.RoleTypeEnum.depLeader];
    /**** 流程分支条件的变量 **/

    FlowBiz.processVarFields =[
        {id:'relOrg_sender4Dept',title:'发起人所属部门',opt:'=,!=,in,notIn',controlType:'selectdept' },
        {id:'relOrg_sender4PartTimeDept',title:'发起人所属兼职部门',opt:'=,!=,in,notIn',controlType:'selectdept' },
        {id:'relOrg_sender4Role',title:'发起人角色',opt:'=,!=',controlType:'singleselect',showType:'',data:FlowBiz.roleVarFields },
        {id:'relOrg_preNode4Dept',title:'上节点所属部门',opt:'=,!=,in,notIn',controlType:'selectdept',showType:''},
        {id:'relOrg_preNode4PartTimeDept',title:'上节点所属兼职部门',opt:'=,!=,in,notIn',controlType:'selectdept',showType:''},
        {id:'relOrg_preNode4Role',title:'上节点角色',opt:'=,!=',controlType:'singleselect',showType:'',data:FlowBiz.roleVarFields}
    ];
    /**
     * 获取节点校验数 （排除了 分割节点 和聚合节点）
     * @param nodes
     * @returns {number}
     */
    FlowBiz.getNodesSize4validate = function(nodes){
        var count = 0;
        for(var i= 0,len=nodes.length;i<len;i++){
            var node = nodes[i];
            if(node.nodeType =='split'){
                continue;
            }
            if(node.nodeType =='join'){
                continue;
            }
            count++;
        }
        return count;
    };
    FlowBiz.validate = function(isValidateNodes){ // 流程数据校验
        var _self = this;
        var flowData = _self.getFlowData();
        //var isCheck = _self.validateWorkFlowProp(flowData);
        //if(!isCheck){
        //    return false;
        //}
        var isCheck = true;
        var nodeLen = flowData.workFlowNodeList.length;
        isCheck = oui.validate4value(nodeLen,{
            failMsg:'流程节点数不能大于{{validateValue}}' ,
            maxValue:_self.ValidateConfig.workFlowNodeListMaxSize,
            failMode:_self.ValidateConfig.failMode
        });
        if(!isCheck){
            return false;
        }
        if(!isValidateNodes){//如果无需校验节点中的属性则直接返回
            return true;
        }
        var len = flowData.workFlowNodeList.length;
        var workFlowNodeList = flowData.workFlowNodeList;
        for(var i= 0;i<len;i++){ //循环校验每个节点数据
            isCheck = _self.validateWorkFlowNode(workFlowNodeList[i]);
            if(!isCheck){
                return false;
            }
        }
        return true;
    };
})();








