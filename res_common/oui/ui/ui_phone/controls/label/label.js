/**
 * @author oui
 * @date 2015/12/16 0016
 */
(function (win) {

    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    var constant = oui.$.constant;
    /**
     * 控件类设计构造器
     */
    var Label = function (cfg) {
        /***************************一 控件必须实现:控件继承call、控件全名定义FullName、控件的html内容模板函数getTemplateHtml ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        //this.attrs = this.attrs + ",panel,step,max,min,placeholder";//当前控件自定义属性，无则去掉本行代码
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */

        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/


    };
    ctrl["label"] = Label;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    Label.FullName = "oui.$.ctrl.label";//设置当前类全名 静态变量

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Label.templateHtml = [];
    Label.templateHtml[0] = '<lable id="{{id}}" style="{{fieldStyle}}" name="{{name}}" {{=commonEvent}} >{{des}}</lable>';


})(window);





