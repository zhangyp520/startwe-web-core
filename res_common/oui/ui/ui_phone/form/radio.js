(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var Radio = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数
        //this.attrs = this.attrs+",hasOptionOther";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 单选框初始化
         */
        this.init = init;
        this.radioClick = radioClick;
        this.hasEnumOther = hasEnumOther;
        this.getData4DB = getData4DB;
        this.changeOtherText = changeOtherText;
        this.validate = validate;
        this.openActionSheet = openActionSheet;
        this.isEnumControl = true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
        if (!(!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/))) {
            this.afterRender = function () {
                $(this.getEl()).find("[onTap]").each(function () {
                    $(this).removeAttr('onclick').attr("onclick", $(this).attr("ontap")).removeAttr("ontap");
                });
            }
        }
    };

    Radio.FullName = "oui.$.ctrl.radio";//设置当前类全名
    ctrl["radio"] = Radio;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Radio.templateHtml = [];
    Radio.templateHtml[0] = Radio.templateHtml[1] = Radio.templateHtml[2] =
        '{{each data as item index}}' +
        '{{if (item.value +"") !="-1"}}' +
        '<div>' +
        '<label oId="{{item.id}}" class="canInputLabel" for="radio_{{id}}_{{index}}" index="{{index}}" onclick="return false;" onTap="oui.getByOuiId({{ouiId}}).radioClick(this);" >' +
        '<div class="radio-button-wrapper">' +
        '<input type="radio" id="radio_{{id}}_{{index}}"  name="{{name}}" value="{{item.value}}" onclick="return false;" {{if item.value!="" && item.value==value}}checked="checked"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>' +
        '</label>' +
        '</div>' +
        '{{else}}' +
        '<div>' +
        '<label oId="{{item.id}}" onclick="return false;" class="oui-class-others canInputLabel" for="radio_{{id}}_{{index}}" onTap="oui.getByOuiId({{ouiId}}).radioClick(this);" >' +
        '<div class="radio-button-wrapper">' +
        '<input type="radio" id="radio_{{id}}_{{index}}"  onclick="return false;"  name="{{name}}" value="{{item.value}}" {{if item.value!="" && item.value==value}}checked="checked"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '&nbsp;其它' +
        '</label>' +
        '<input id="radio-other-{{id}}" class="oui-input-others" oninput="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onpropertychange="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onblur="oui.getByOuiId({{ouiId}}).changeOtherText(this);oui.validate(this);oui.getByOuiId({{ouiId}}).triggerAfterUpdate();"  validate="{maxLength:30,msgPosEl:\'#radio-other-{{id}}\',msgPos:\'after\',failMode:\'msgPosEl\',title:\'其它\'}" {{if item.value!=value }}disabled="disabled"{{/if}} type="text" value="{{=oui.escapeStringToHTML(item.display)}}">' +
        '</div>' +
        '{{/if}}' +
        '{{/each}}';

    Radio.templateHtml[3] = '\
        <input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}">\
        <div class="radio-actionsheet" onTap="oui.getByOuiId({{ouiId}}).openActionSheet();">\
        {{each data as item index}}\
            {{if item.value!="" && (item.value+"" == value+"")}}{{item.display}}{{/if}}\
        {{/each}}\
        </div>\
        <i class="right-arrow"></i>\
    ';

    Radio.templateHtml[4] = Radio.templateHtml[0];

    Radio.templateHtml4readOnly = [];
    Radio.templateHtml4readOnly[0] = '{{each data as item index}}' +
        '{{if ((item.value +"") !="-1")&&(value==item.value)}}' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '{{/if}}' +
        '{{if ((item.value +"") =="-1")&&(value==item.value)}}' +
        '{{=oui.escapeStringToHTML(item.display||"其它")}}' +
        '{{/if}}' +
        '{{/each}}';
    Radio.templateHtml4readOnly[4] = Radio.templateHtml4readOnly[3] = Radio.templateHtml4readOnly[2] = Radio.templateHtml4readOnly[1] = Radio.templateHtml4readOnly[0];

    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(Radio, 'edit4ReadOnly,edit4View', '0,1,2,3', Radio.templateHtml4readOnly[0]);
    /************************************控件初始化init **************************/
    var init = function () {

        this.attr('isControlValidate', true);//复选框 的验证属性需要输出到最外层的div上

        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            oui.log("单选按钮 需要配置data属性");
            throw e;
        }

        var value = this.attr("value");
        var data = this.attr("data");
        var data4DB = this.attr("data4DB");
        if (value + "") {
            if (data) {
                var dataKey = '';
                for (var k = 0, alen = data.length; k < alen; k++) {
                    dataKey = data[k].value + '';
                    if (dataKey + "" === value + "") {
                        if (dataKey === "-1") {
                            data4DB = oui.parseJson(data4DB || '{}');
                            if (data4DB.value === '-1') {
                                data[k].display = data4DB.display;
                            }
                        }
                        this.attr('value', dataKey);
                        break;
                    }
                    this.attr("value", "");
                }
                this.attr("data", data);
            } else {
                this.attr("data", []);
                this.attr("value", "");
            }
        } else {
            this.attr("value", "");
        }
    };


    /**
     * 判断是否含有其它选项
     */
    var hasEnumOther = function () {
        var data = this.attr('data');
        if (!data) {
            return false;
        }
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].value == '-1') {
                return true;
            }
        }
        return false;
    };

    /***********************************控件事件***********************************/
    var radioClick = function (el) {
        var $el = $(el).find("input[type='radio']");
        if ($el.is(":checked")) {//本身被选中状态，再次点击则取消
            $el[0].checked = false;
            this.attr("value", "");
        } else {//本身没有被选中，取消其他选中的，选中当前的
            var $checkRadio = $("input[name='" + $el.attr("name") + "']:checked");
            $checkRadio && $checkRadio.length > 0 && ($checkRadio[0].checked = false);
            $el[0].checked = true;
            this.attr("value", $el.val());
        }
        var containerEl = this.getEl();
        var $otherInputEl = $(containerEl).find('#radio-other-' + this.attr('id'));
        if (this.attr('value') === '-1') {
            $otherInputEl.removeAttr('disabled');
        } else {
            $otherInputEl.attr('disabled', 'disabled');
            $otherInputEl.val('');
            this.changeOtherText($otherInputEl[0]);
        }
        this.validate();
        this.triggerUpdate();
        this.triggerAfterUpdate();
        return false;
    };

    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var vals = this.getValue() || "";
        if (vals) {
            var data = this.attr("data");
            data = oui.parseJson(data || '[]');
            var item = null;
            for (var j = 0; j < data.length; j++) {
                item = data[j];
                if ((vals + '') == (item.value + '')) {
                    data4DB.display = item.display;
                    data4DB.value = item.value;
                    data4DB.id = item.id;
                    break;
                }
            }
        }
        return data4DB;
    };

    /**
     * 改变其它中的输入文本
     */
    var changeOtherText = function (el) {
        var otext = $(el).val();
        if ((this.attr('value') + '') != '-1') {
            $(el).val('');
            return;
        }
        var data = this.attr('data');
        var len = data.length;
        for (var i = len - 1; i > -1; i--) {
            if ((data[i].value + '') == '-1') {
                data[i].display = otext;
                break;
            }
        }
        this.triggerUpdate();
    };

    var validate = function () {
        var el = this.getEl();
        return oui.validate(el);
    };

    var openActionSheet = function () {
        var self = this;
        var data = this.attr("data");
        data = oui.parseJson(data);
        var items = [];

        for (var i = 0, len = data.length; i < len; i++) {
            items.push({
                title: data[i].display,
                ouiId: self.attr("ouiId"),
                action: function (index) {
                    var _ouiId = this.ouiId;
                    var _controll = oui.getByOuiId(_ouiId);
                    var _data = _controll.attr("data");
                    _data = oui.parseJson(_data);
                    _controll.attr("value", _data[index].value);
                    _controll.triggerUpdate();
                    _controll.triggerAfterUpdate();
                    $(_controll.getEl()).find(".radio-actionsheet").html(_data[index].display);
                    return false;
                }
            });
        }
        oui.showActionSheetDialog({items: items});
        return false;
    }
})(window);





