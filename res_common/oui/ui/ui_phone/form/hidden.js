(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var Hidden = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
    };
    Hidden.FullName = "oui.$.ctrl.hidden";//设置当前类全名
    ctrl["hidden"] = Hidden;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Hidden.templateHtml = [];
    Hidden.templateHtml[0] = '<input id="{{id}}" style="{{fieldStyle}}" name="{{name}}" type="hidden" value="{{value}}"/>';
    Hidden.templateHtml[1] = '<input id="{{id}}"  class="oui-form"  style="{{fieldStyle}}" name="{{name}}" type="text" value="{{value}}" {{=commonEvent}}/>';
    /***********************************控件事件***********************************/
})(window);





