(function () {


    /******************** 绝对布局设计器 运行态 控件数据渲染接口定义 参考 ******************************************/
    var PageData = function () {
        this.getData =  getData;
        this.getHtml = getHtml;
        this.getControl = getControl;
        this.getDataList = getDataList;
        this.renderAfter = renderAfter;
        this.getDesigner = getDesigner;
    };
    /*** 根据id获取控件定义对象****/
    var getControl = function (id) {
        return {};
    };
    /** 获取主表数据*****/
    var getData = function () {
        return {};
    };
    /** 获取数据表格中数据******/
    var getDataList = function (detailId) {
        return [];
    };
    /**** 根据控件定义 和控件数据 获取 html内容 *****/
    var getHtml = function (control,dataMap) {
        return oui.PageDesignControlRuntimeAdapter.render(control,dataMap[control.id]);
    };

    /** 运行态获取 设计对象*****/
    var getDesigner = function(){
        return this.tpl;
    };
    /**** 整个页面模板渲染完成的后置脚本,如处理 二次加工dom操作*****************/
    var renderAfter = function(){

    };
    /************************绝对布局设计器 运行态 控件数据渲染接口定义 参考结束  *******************************************************/
})(window);

