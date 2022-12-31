/**
 * @author oui
 * @date 2015/12/26 0026
 */
(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var Checkbox = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",onselect,onunselect";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        //this.afterRender = afterRender;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
        this.click2update = click2update;
        if (!(!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/))) {
            this.afterRender = function () {
                $(this.getEl()).find("[onTap]").each(function () {
                    $(this).removeAttr('onclick').removeAttr("ontap");//.attr("onclick", $(this).attr("ontap")).removeAttr("ontap");
                    $(this).find("input").removeAttr("onclick");
                });
            }
        }
    };
    ctrl["checkbox"] = Checkbox;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    Checkbox.FullName = "oui.$.ctrl.checkbox";//设置当前类全名 静态变量

    /**
     * 定义 控件浏览态的模板
     * @type {Array}
     */
    Checkbox.templateHtml4readOnly = [];
    Checkbox.templateHtml4readOnly[0] = '{{(value+"" )=="true"?"开":"关"}}';
    Checkbox.templateHtml4readOnly[1] = Checkbox.templateHtml4readOnly[0];
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(Checkbox,'edit4ReadOnly,edit4View','0,1',Checkbox.templateHtml4readOnly[0]);
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Checkbox.templateHtml = [];
    Checkbox.templateHtml[0] =
        '<label onTap="oui.getByOuiId({{ouiId}}).click2update(this);" onclick="return false;" >' +
        '<div class="oui-checkbox middle"> ' +
        '<input type="checkbox" id="{{id}}" onclick="return false;" validate="{{validate}}" name="{{name}}" value="{{(value || value=="true")?"true":"false"}}"' +
        ' {{if value=="true" || value===true}}checked="checked"{{/if}} /> ' +
        '<i class="checkbox"></i>' +
        '</div>' +
        '</label>';

    Checkbox.templateHtml[1] =
        '<label  onTap="oui.getByOuiId({{ouiId}}).click2update(this);" onclick="return false;">\
            <div class="oui-checkbox middle oui-checkbox-1" >\
                <input type="checkbox" id="{{id}}" onclick="return false;" validate="{{validate}}" name="{{name}}" value="{{(value || value==\'true\')?\'true\':\'false\'}}" {{if value==\'true\' || value===true}}checked="checked"{{/if}} >\
                <i class="checkbox"></i>\
            </div>\
        </label>';

    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/
    /**
     * 初始化value
     */
    var init = function () {
        if (!this.attr('value')) {
            this.attr('value', false);
        }
    };
    /**
     * 点击更新 选中value
     */
    var click2update = function (el) {
        el = $(el).find("input[type='checkbox']")[0];
        //这里为了移动端预览可以点击 将这里的代码给注释掉
        //if ((!this.attr('right')) || this.attr('right') != 'edit') {
        //    return;
        //}

        el.checked = !el.checked;

        var isCheck = $(el).is(":checked");
        this.attr('value', isCheck);
        this.triggerUpdate();
        this.triggerAfterUpdate();
        var onSelect = this.attr("onselect");
        var onunselect = this.attr("onunselect");
        if (onSelect && isCheck) {
            try {
                eval(onSelect);
            } catch (e) {
                throw e;
            }
        } else {
            if (onunselect && !isCheck) {
                try {
                    eval(onunselect);
                } catch (e) {
                    throw e;
                }
            }
        }
        return false;
        //this.render();
    };

    /*******************************控件类的自定义函数 end******************************************/
})(window);





