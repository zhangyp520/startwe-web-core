/**
 * Created by oui on 2016/3/31.
 */
(function(win){
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var SerialNumber = function(cfg) {
        Control.call(this,cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.validate = validate;
    };
    SerialNumber.FullName = "oui.$.ctrl.serialnumber";//设置当前类全名
    ctrl["serialnumber"] = SerialNumber;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    SerialNumber.templateHtml=[];
    SerialNumber.templateHtml[0] ='<input id="{{id}}" class="oui-form" '+
        '{{if right&&(right=="design")}}disabled="disabled" '+
        '{{/if}}'+
        'style="{{fieldStyle}}" name="{{name}}" validate="{{validate}}" onfocus="oui.hideErrorInfo(this);" readOnly="readOnly" type="text" value="{{value}}" {{=commonEvent}} />' ;
    /***********************************控件事件***********************************/
    var validate = function(){
        var el = this.getEl();
        var targetEl = $(el).find('#'+this.attr('id'))[0];
        return oui.validate(targetEl);
    }
})(window);





