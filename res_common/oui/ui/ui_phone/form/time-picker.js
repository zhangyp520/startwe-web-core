(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /**
     * 控件类构造器
     */
    var TimePicker = function (cfg) {
        Control.call(this, cfg);//必须继承控件超类
        this.attrs = this.attrs + "";
        /*当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
         /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.getValue = getValue;
        this.changeTime = changeTime;
        this.afterRender = afterRender;
        this.changeVal = changeVal;
        this.clearContent = clearContent;
        this.getData4DB = getData4DB;
        this.updateHoursAndMinutes = updateHoursAndMinutes;
    };
    ctrl["timepicker"] = TimePicker;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
    TimePicker.FullName = "oui.$.ctrl.timepicker";//设置当前类全名 静态变量
    TimePicker.formats = [ //格式化参数 与showType的索引一一对应
        'hh:mm',
    ];

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    TimePicker.templateHtml = [];

    TimePicker.templateHtml[0] = '<input type="text" readonly="readonly" validate="{{validate}}" id="{{id}}" class="form-text-indent" value="{{value}}" name="{{name}}" oninput="oui.getByOuiId({{ouiId}}).changeVal(this);" onchange="oui.getByOuiId({{ouiId}}).changeVal(this);"><span class="form-ico-datetime"></span><i onTap="oui.getByOuiId({{ouiId}}).clearContent(this,\'{{ouiId}}\');" id="form_delete_info_btn_{{ouiId}}" class="form-delete-info"></i>';
    //TimePicker.templateHtml[1] = '<input type="date">';

    var clearContent = function (obj, ouiId) {
        var _c = oui.getByOuiId(ouiId);
        $(_c.getEl()).find("input").val('');
        _c.attr('value', '');
        $("#form_delete_info_btn_" + ouiId).hide();
        _c.triggerUpdate();
        _c.triggerAfterUpdate();
        return false;
    };

    var changeVal = function (obj) {
        var self = this;
        self.attr('value', obj.value);
        var ouiId = self.attr("ouiId");
        if (obj.value !== '') {
            $("#form_delete_info_btn_" + ouiId).show();
        } else {
            $("#form_delete_info_btn_" + ouiId).hide();
        }
        self.triggerUpdate();
        self.triggerAfterUpdate();
        oui.hideErrorInfo(obj);
        return false;
    };

    var changeTime = function (obj) {
        var self = this;
        self.attr("value", $(obj).val());
    };

    /**
     * 值改变时 更新 houi和minutes
     */
    var updateHoursAndMinutes = function () {
        var v = this.attr('value');
        if (!v) {
            this.attr('houi', '');
            this.attr('minutes', '');
            this.attr('value', '');
            return;
        }
        var arr = v.split(':');
        var houi = parseInt(arr[0].replace(/e/ig, ''));
        var minutes = parseInt(arr[1].replace(/e/ig, ''));

        if (houi) {
            try {
                houi = parseInt(houi);
            } catch (e) {
                houi = 0;
            }
            if (houi < 0) {
                houi = 0;
            }
            if (houi > 23) {
                houi = 23;
            }
            if (houi < 10) {
                houi = '0' + houi;
            }
        } else {
            houi = "";
        }
        if (minutes) {
            try {
                minutes = parseInt(minutes);
            } catch (e) {
                minutes = 0;
            }
            if (minutes < 0) {
                minutes = 0;
            }
            if (minutes > 59) {
                minutes = 59;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
        } else {
            minutes = "";
        }
        if (houi) {
            if (minutes) {
                this.attr('value', houi + ':' + minutes);
            } else {
                this.attr('value', houi + ':' + "00");
            }
        } else {
            if (minutes) {
                this.attr('value', "00" + ':' + minutes);
            } else {
                this.attr('value', "");
            }
        }
    };

    var init = function () {
        var self = this;
        if (!self.attr("showType")) {
            self.attr("showType", 0);
        }
        this.updateHoursAndMinutes();
    };

    var getValue = function () {
        return this.attr("value");
    };

    var afterRender = function () {
        var self = this;
        /**
         * 0:date(year-month-day) "yyyy-MM-dd"
         * 1:datetime(year-month-day hour:min)
         * 2:time (hour:min)
         * 3:date(year-month)
         */
        var ouiId = self.attr("ouiId");

        if (self.attr("value") !== '') {
            $("#form_delete_info_btn_" + ouiId).show();
        } else {
            $("#form_delete_info_btn_" + ouiId).hide();
        }

        var opt = {};
        opt.date = {preset: 'date'};
        opt.datetime = {preset: 'datetime'};
        opt.time = {preset: 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            mode: 'scroller', //日期选择模式
            lang: 'zh',
            onBeforeShow: function () {
                var target = document.activeElement;
                if (target) {
                    $(target).blur();
                }
            }
        };

        if (this.attr("right") !== "preview") {
            if (!$.scroller) {
                oui.require([
                    oui.getContextPath() + 'res_common/third/mobiscroll/mobiscroll.css',
                    oui.getContextPath() + 'res_common/third/mobiscroll/mobiscroll.js'
                ], function () {
                    $(self.getEl()).find("input").scroller('destroy').scroller($.extend(opt['time'], opt['default']));
                }, null);
            } else {
                $(self.getEl()).find("input").scroller('destroy').scroller($.extend(opt['time'], opt['default']));
            }
        }
    };

    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        data4DB.display = this.getValue();
        return data4DB;
    };
    /*******************************控件类的自定义函数 end******************************************/
})(window);





