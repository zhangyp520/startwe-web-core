!(function(win,runtime){


    /***
     *  获取控件值接口定义
     *  根据控件id获取对应值，
     *  如果是明细表 ，则返回 pageData对象类型的数组
     *  pageData.getDisplay = function(controlId){
     *
     *  }
     *
     */
    var pageData = runtime.getPageData();



    //var content = runtime.getContent();
    //
    /***
     * 运行态根据模板调用 渲染html方法
     * *********/
    runtime.getHtml = function(pageData,contentTpl){
        if(!this._htmlRender){
            this._htmlRender = template.compile(contentTpl);
        }
        var html = this._htmlRender({pageData:pageData});
        return html;
    }
})(window,com.oui.DesignBizRuntime);

