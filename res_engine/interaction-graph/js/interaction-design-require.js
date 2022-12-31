oui.require([
    oui.getContextPath()+'res_engine/graph-common/js/tree-map.js'
],function(){
    oui.require([
        oui.getContextPath()+'res_engine/interaction-graph/js/interaction-graph.js',
        oui.getContextPath()+'res_common/third/html2canvas/dist/html2canvas.min.js'
    ],function(){
        var me = com.startwe.models.project.web.InteractionDesignController;
        me.init({
            isFlow:true
        });
    });
}, function(){ }, !(oui_context&&oui_context.debug));

