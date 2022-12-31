(function () {
    /***运行态 控件值渲染模板适配器,根据控件htmlType做适配处理 ******/
    var  PageDesignControlRuntimeAdapter = {
        templateMap: {},
        htmlTypeRender: {}
    };
    var html = oui.loadUrl(oui.getContextPath()+'res_engine/page_design/common/page-design-runtime-tpl.html',1);
    var $tpls = $(html);
    $tpls.each(function(){
        var id = this.id;
        if(id.indexOf('page_runtime_control')>-1){
            PageDesignControlRuntimeAdapter.templateMap[id.replace('page_runtime_control_','')] = $.trim(this.innerHTML);
        }
    });
    PageDesignControlRuntimeAdapter.getHtmlTypeRender = function(htmlType) {
        if(!this.htmlTypeRender[htmlType]) {
            if(!this.templateMap[htmlType]){
                this.htmlTypeRender[htmlType] = function(){};
            }else{
                this.htmlTypeRender[htmlType] = template.compile(this.templateMap[htmlType]);
            }
        }
        return this.htmlTypeRender[htmlType];
    };
    PageDesignControlRuntimeAdapter.render = function(control, data) {
        return this.getHtmlTypeRender(control.htmlType)({
                control:control || {},data:data || {}
            })||"";
    };

    oui.PageDesignControlRuntimeAdapter = PageDesignControlRuntimeAdapter;
})(window);

