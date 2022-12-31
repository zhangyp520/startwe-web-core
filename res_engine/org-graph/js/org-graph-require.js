oui.require([
    oui.getContextPath()+'res_engine/graph-common/js/tree-map.js'
],function(){
    oui.setPageParam('graphPath',oui.getContextPath()+'res_engine/org-graph/js/org-graph.js');
    oui.require([
        oui.getPageParam('graphPath'),
        oui.getContextPath()+'res_common/third/html2canvas/dist/html2canvas.min.js'
        //oui.getContextPath()+'res_engine/org-graph/js/test-org-graph.js'
    ],function(){
        oui.ready(function () {
            var me = com.oui.org.OrgGraph;
            me.init();
        });
    });
}, function(){
}, !(oui_context&&oui_context.debug));

