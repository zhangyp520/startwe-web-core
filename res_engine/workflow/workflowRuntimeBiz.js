/**
 * 工作流业务js
 * @author zhangj
 */
(function() {
    var contextPath = oui.getContextPath();
    var NS = oui.getNS();
    var WorkflowRuntimeBiz = {
        /**
         * 发送流程
         * @param templateId 模板直接发起模板Id
         * @param flowId 待发发起流程Id
         * @param moduleType 模块类型
         * @param moduleId 模块Id
         * @param selectPerson 选人信息
         * @param callback
         */
        send: function(url, templateId, flowId, moduleType, moduleId, selectPerson, callback, failedCallback) {
            oui.postData(url,{
                templateId: templateId,
                flowId: flowId,
                moduleType: moduleType,
                moduleId: moduleId,
                selectPerson: selectPerson
            }, callback, failedCallback, false);
        },
        /**
         * 外部发送流程
         * @param url
         * @param templateId 模板Id
         * @param moduleType 模块
         * @param moduleId 模块Id
         */
        send4External: function(url, templateId, moduleType, moduleId, callback) {
            oui.postData(url,{
                templateId: templateId,
                moduleType: moduleType,
                moduleId: moduleId
            }, callback, null, false);
        },
        /**
         * 暂存待发
         * @param templateId 模板Id
         * @param moduleType 模块
         * @param moduleId 模块Id
         */
        waitSend: function(url, flowId, templateId, moduleType, moduleId, callback, failedCallback) {
            oui.postData(url,{
            	flowId:flowId,
                templateId: templateId,
                moduleType: moduleType,
                moduleId: moduleId
            }, callback, failedCallback, false);
        },
        /**
         * 处理流程
         * @param flowId 流程ID
         * @param nodeId 流程节点ID
         * @param attitude 态度
         * @param comments 流程意见
         */
        handle: function(url, flowId, nodeId, comments, attachments, selectPerson, selectPersonResult, flowType, parallel, notify, callback) {
            oui.postData(url,{
                flowId: flowId,
                nodeId: nodeId,
                comments: comments,
                attachments: attachments,
                selectPerson: selectPerson,
                flowType : flowType,
                addedPersons: selectPersonResult,
                parallel: parallel,
                notify: notify
            }, callback, null, false);
        },
        /**
         * 暂存待办
         * @param flowId 流程ID
         * @param nodeId 流程节点ID
         * @param comments 流程意见
         */
        waitHandle: function(url, flowId, nodeId, comments, attachments, selectPersonResult, flowType, parallel, notify, callback) {
            oui.postData(url,{
                flowId: flowId,
                nodeId: nodeId,
                comments: comments,
                attachments: attachments,
                addedPersons: selectPersonResult,
                flowType : flowType,
                parallel: parallel,
                notify: notify
            }, callback, null, false);
        },
        /**
         * 回退流程
         * @param flowId 流程ID
         * @param nodeId 流程节点ID
         * @param comments 流程意见
         */
        rollBack: function(url, flowId, nodeId, rollBackType, comments, callback) {
            oui.postData(url,{
                flowId: flowId,
                nodeId: nodeId,
                rollBackType: rollBackType,
                comments: comments
            }, callback, null, '回退中');
        },
        /**
         * 终止流程
         * @param flowId 流程ID
         * @param nodeId 流程节点ID
         * @param comments 流程意见
         */
        stop: function(url, flowId, nodeId, comments, callback) {
            oui.postData(url,{
                flowId: flowId,
                nodeId: nodeId,
                comments: comments
            }, callback, null, '终止中');
        },
        /**
         * 预提交到下一节点
         * @param templateId 模板
         * @param flowId 流程Id
         * @param nodeId 节点
         */
        preSubmit2NextNode: function (url, templateId, flowId, nodeId, tempDataId, callback) {
            oui.postData(url,{
                templateId:templateId,
                flowId: flowId,
                nodeId: nodeId,
                tempDataId: tempDataId
            }, callback, null, false);
        },
        /**
         * 催办
         */
        urge:function(url, flowId, nodeId, comments, callback){
        	oui.postData(url,{
                flowId: flowId,
                nodeId: nodeId,
                comments: comments
            }, callback, null, false);
        }
    };

    NS.WorkflowRuntimeBiz = WorkflowRuntimeBiz;
})();








