oui.require([
    oui.getContextPath()+'res_engine/graph-common/js/tree-map.js'
],function(){
    oui.require([
        oui.getContextPath()+'res_engine/flow-graph/js/flow-graph.js'
    ],function(){
        var me = com.startwe.models.flow.web.FlowDesignController;
        me.init({
            isFlow:true
        });
        oui.require([oui.getContextPath()+'res_common/third/html2canvas/dist/html2canvas.min.js'],function(){},true);
    });
}, function(){ }, !(oui_context&&oui_context.debug));

