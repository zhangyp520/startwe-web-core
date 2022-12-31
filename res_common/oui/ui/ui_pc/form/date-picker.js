(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var DatePicker = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数
        this.attrs = this.attrs + ",format,isLoadServerTime";//为了减少模板的代码量，所以在这对年份进行封装
        // this.open = _open;
        this.init = init;
        this.getValueByFormat = getValueByFormat;
        this.initValuesByValue = initValuesByValue;
        this.changeTime = changeTime;
        this.setValue = setValue;
        this.loadServerTime = loadServerTime;//获取服务器时间进行回填
        this.clearValue = clearValue;
        this.afterRender = afterRender;
    };

    DatePicker.FullName = "oui.$.ctrl.datepicker";//设置当前类全名
    //控件HTML代码模板
    DatePicker.templateHtml = [];
    DatePicker.serverTimePath = oui.getContextPath() + 'common.do?method=time';
    /**
     * 时间tips模板
     */
    DatePicker.timeTipsTemplate = '<i class="oui-datetime-item"></i>' +
        '<select class="oui-datetime-houi" onchange="oui.getByOuiId({{ouiId}}).changeTime();" >' +
        '{{each harr as item index}}' +
        '<option class="oui-datetime-option" value="{{item}}">{{item}}</option>' +
        '{{/each}}' +
        '</select>' +
        ':' +
        '<select class="oui-datetime-min" onchange="oui.getByOuiId({{ouiId}}).changeTime();" >' +
        '{{each marr as item index}}' +
        '<option class="oui-datetime-option" value="{{item}}">{{item}}</option>' +
        '{{/each}}' +
        '</select>';
    DatePicker.templateHtml[0] = '<input class="laydate-icon" ' +
        '{{if right&&(right=="design")}}disabled="disabled" {{/if}} ' +
        'id="{{id}}" readonly="readonly" name="{{name}}" value="{{value}}" validate="{{validate}}">' +
        '<i class="form-delete-info" {{if value}} style=\"display:block\"{{/if}} onclick="oui.getByOuiId({{ouiId}}).clearValue();"></i>';
    DatePicker.templateHtml[1] = DatePicker.templateHtml[0];
    DatePicker.templateHtml[2] =
        '<input class="oui-datetime-icon" onkeyup="oui.getByOuiId({{ouiId}}).resetValue(this);"' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{else}}' +
        ' onclick="oui.hideErrorInfo(this);" ' +
        '{{/if}}' +
        'id="{{id}}" name="{{name}}" readonly="readonly" value="{{value}}" validate="{{validate}}"><i onclick="oui.getByOuiId({{ouiId}}).clearTime();">×</i>' +
        '';
    DatePicker.templateHtml[3] = DatePicker.timeTipsTemplate;
    DatePicker.templateHtml[4] = DatePicker.templateHtml[0]; //YYYY-MM
    DatePicker.templateHtml[5] = DatePicker.templateHtml[0];//YYYY
    //内嵌 年月的选择
    DatePicker.templateHtml[6] = '<input style="display: none;" id="{{id}}" readonly="readonly" name="{{name}}" value="{{value}}" validate="{{validate}}">' +
        '<div id="static_{{ouiId}}"></div>';//YYYY-MM 内嵌

    //laydate格式化内容，和showType对应
    var laydateDefaultFormats = [
        'yyyy-MM-dd',
        'yyyy-MM-dd HH:mm',
        'HH:mm',
        'HH:mm',
        'yyyy-MM',
        'yyyy',
        'yyyy-MM'
    ];
    //laydate类型，和showType对应
    var laydateDefaultDateType = [
        'date',
        'datetime',
        'time',
        'time',
        'month',
        'year',
        'month'
    ];

    /** 清空控件 值****/
    var clearValue = function () {
        var v = this.attr('value');
        var me = this;
        if (v) {
            me.attr('value', "");
            me.initValuesByValue();
            $(me.getEl()).find('#' + me.attr('id')).val(me.attr('value'));
            $(me.getEl()).find('.form-delete-info').hide();
            me.triggerUpdate();
            me.triggerAfterUpdate(); //点击后执行 afterUpdate
        }
    };
    var initValuesByValue = function () {
        var year, month, day, h, m, s;

        if (!this.attr('value')) {

            year = '';
            month = '';
            day = '';
            h = '';
            m = '';
            s = '';
            this.attr({
                year: year,
                month: month,
                day: day,
                hh: h,
                mm: m,
                ss: s
            });
            return;
        }
        var format = this.attr('format') || "YYYY-MM-DD hh:mm:ss";

        var date = DatePicker.getDate(this.attr('value'), format);
        if (date) {
            this.attr({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hh: date.getHours(),
                mm: date.getMinutes(),
                ss: date.getSeconds()
            });
            this.attr('value', DatePicker.format(date, format));
        } else {
            this.attr('value', '');
        }
    };

    var setValue = function (v) {
        this.attr("value", v);
        this.initValuesByValue();
        this.render();
        this.triggerAfterUpdate();
    };

    /** 获取服务器时间并回填值 TODO***/
    var loadServerTime = function () {
        var me = this;
        oui.postData(DatePicker.serverTimePath, {}, function (res) {
            if (res.success) {
                me.attr('value', res.msg);
                me.initValuesByValue();
                $(me.getEl()).find('#' + me.attr('id')).val(me.attr('value'));
                $(me.getEl()).find('.form-delete-info').show();
                me.triggerUpdate();
                me.triggerAfterUpdate(); //点击后执行 afterUpdate
            } else {
                oui.getTop().oui.alert('获取服务器时间失败，请稍后再试');
                console.log(res.msg);
            }
        }, function (res) {
            oui.getTop().oui.alert('由于网络原因，获取服务器时间失败，请稍后再试');
            console.log(res);
        });
    };

    var afterRender = function () {
        var self = this;
        var right = self.attr("right");
        //浏览态不需要绑定任何东西
        if (right === "readOnly" || right === 'design') {
            return;
        }
        var $el = $(self.getEl());
        var $input = $el.find("input");
        //服务器获取事件，不需要引入js TODO 需要绑定点击事件,需要动态绑定点击事件
        if (this.attr('isLoadServerTime')) {
            //     this.loadServerTime();
            var _loadServerTime = function () {
                self.loadServerTime();
            };
            $input.off("click", _loadServerTime).on("click", _loadServerTime);
            return;
        }
        var ouiId = self.attr("ouiId");
        var showType = self.attr("showType");
        var format = laydateDefaultFormats[showType] || laydateDefaultFormats[1];
        var laydateRender = function () {
            var laydateType = laydateDefaultDateType[showType] || laydateDefaultDateType[1];
            var elem = $input[0];
            var position = null;
            var changeFunc = null;
            var showBottom = true;
            if(showType+'' === '6'){
                elem = $el.find("#static_" + ouiId)[0];
                position = 'static';
                changeFunc = function (value) {
                    self.attr("value", value);
                    if (value) {
                        $el.find('.form-delete-info').show();
                    } else {
                        $el.find('.form-delete-info').hide();
                    }
                    self.triggerUpdate();
                    self.triggerAfterUpdate(); //点击后执行 afterUpdate
                };
                showBottom = false;
            }
            if ($input.length > 0) {
                laydate.render({
                    elem: elem, //指定元素
                    type: laydateType,
                    format: format,
                    position: position,
                    hideSeconds: true,
                    showBottom: showBottom,
                    change: changeFunc,
                    done: function (value) {
                        self.attr("value", value);
                        if (value) {
                            $el.find('.form-delete-info').show();
                        } else {
                            $el.find('.form-delete-info').hide();
                        }
                        self.triggerUpdate();
                        self.triggerAfterUpdate(); //点击后执行 afterUpdate
                    }
                });
            }
        };
        /** 按需加载资源**/
        if (!window['laydate']) {
            oui.require([oui.getContextPath() + 'res_common/third/laydate_v5.0.9/laydate.dev.js'], function () {
                laydateRender();
            });
        } else {
            laydateRender();
        }
    };

    /**
     * 弹出日期选择框
     */
    oui.selectDate = function (showType, choose, clearTime, options) {
        if (!window['laydate']) {
            oui.require([oui.getContextPath() + 'res_common/third/laydate_v5.0.9/laydate.dev.js'], function () {
                oui.selectDate(showType, choose, clearTime, options)
            });
            return;
        }
        if (!options || !options.el) {
            console.error("el不能为空");
            return;
        }
        if(typeof options.show === "undefined"){
            options.show = true;
        }
        var format = laydateDefaultFormats[showType] || laydateDefaultFormats[1];
        var laydateType = laydateDefaultDateType[showType] || laydateDefaultDateType[1];
        laydate.render({
            elem: options.el, //指定元素
            type: laydateType,
            format: format,
            show: !!options.show,
            hideSeconds: true,
            closeStop: options.closeStop ? options.closeStop : '',
            done: function (value) {
                choose && choose(value);
                if (!value) {
                    clearTime && clearTime();
                }
            }
        });
    };




    /** year : /YYYY/ */
    var _y4 = "([0-9]{4})";
    /** year : /YY/ */
    var _y2 = "([0-9]{2})";
    /** index year */
    var _yi = -1;
    /** month : /MM/ */
    var _M2 = "(0[1-9]|1[0-2])";
    /** month : /M/ */
    var _M1 = "([1-9]|1[0-2])";
    /** index month */
    var _Mi = -1;
    /** day : /DD/ */
    var _d2 = "(0[1-9]|[1-2][0-9]|30|31)";
    /** day : /d/ */
    var _d1 = "([1-9]|[1-2][0-9]|30|31)";
    /** index day */
    var _di = -1;
    /** hour : /HH/ */
    var _H2 = "([0-1][0-9]|20|21|22|23)";
    /** hour : /H/ */
    var _H1 = "([0-9]|1[0-9]|20|21|22|23)";
    /** index hour */
    var _Hi = -1;
    /** minute : /mm/ */
    var _m2 = "([0-5][0-9])";
    /** minute : /m/ */
    var _m1 = "([0-9]|[1-5][0-9])";
    /** index minute */
    var _mi = -1;
    /** second : /ss/ */
    var _s2 = "([0-5][0-9])";
    /** second : /s/ */
    var _s1 = "([0-9]|[1-5][0-9])";
    /** index month */
    var _si = -1;
    var regexp;

    /** 日期转换兼容****/
    function getDate(dateString, formatString) {
        if (formatString) {
            formatString = formatString.replace(/y/ig, 'Y').replace(/d/ig, 'D').replace(/H/ig, 'h');
        }

        if (validateDate(dateString, formatString)) {
            var now = new Date();
            var vals = regexp.exec(dateString);
            var index = validateIndex(formatString);
            var year = index[0] >= 0 ? vals[index[0] + 1] : now.getFullYear();
            var month = index[1] >= 0 ? (vals[index[1] + 1] - 1) : now.getMonth();
            var day = index[2] >= 0 ? vals[index[2] + 1] : now.getDate();
            var hour = index[3] >= 0 ? vals[index[3] + 1] : "";
            var minute = index[4] >= 0 ? vals[index[4] + 1] : "";
            var second = index[5] >= 0 ? vals[index[5] + 1] : "";
            var validate;
            if (hour == "") {
                validate = new Date(year, month, day);
            } else {
                validate = new Date(year, month, day, hour, minute, second);
            }
            if (validate.getDate() == day) {
                return validate;
            }
        }
        try {
            /***处理值格式 ***/
            var arr = dateString.split(' ');
            var date;
            if (arr.length == 2) { //年月日 时:分
                var ymd = arr[0].split('-');
                var y = parseInt(ymd[0]);
                var m = parseInt(ymd[1]) - 1;
                var d = parseInt(ymd[2]);
                var hms = arr[1].split(":");
                var h, mm, s = 0;
                if (hms.length == 2) {
                    h = parseInt(hms[0]);
                    mm = parseInt(hms[1]);
                } else if (hms.length == 3) {

                    h = parseInt(hms[0]);
                    mm = parseInt(hms[1]);
                    s = parseInt(hms[2]);
                }
                if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(mm) || isNaN(s)) {
                    date = null;
                } else {
                    date = new Date(y, m, d, h, mm, s);
                }
                return date;
            } else if (arr.length == 1) {//年月日 或者十分秒
                if (arr[0].indexOf('-') > 0) {
                    var ymd = arr[0].split('-');
                    var y = parseInt(ymd[0]);
                    var m = parseInt(ymd[1]) - 1;
                    var d = parseInt(ymd[2]);
                    var date;
                    if (isNaN(y) || isNaN(m) || isNaN(d)) {
                        date = null;
                    } else {
                        if (dateString.length < formatString.length) {
                            date = new Date(y, m, d, 0, 0);
                        } else {
                            date = new Date(y, m, d);
                        }
                    }
                    return date;
                } else if (arr[0].indexOf(':') > 0) {
                    var date = null;
                    var hms = arr[0].split(':');
                    var h = parseInt(hms[0]);
                    var mm = parseInt(hms[1]);
                    var s = parseInt(hms[2]);
                    if (isNaN(h) || isNaN(mm) || isNaN(s)) {
                        date = null;
                    } else {
                        var now = new Date();
                        date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, mm, s);
                    }
                    return date;
                }
            }
        } catch (e) {
            return null;
        }
        return null;
        //alert("时间格式不正确");
        //throw new Error("时间格式不正确 date:[" + dateString + ']format:[' + formatString + ']');

    }

    DatePicker.getDate = getDate;

    function validateDate(dateString, formatString) {
        var dateString = trim(dateString);
        if (dateString == "") {
            return;
        }
        var reg = formatString;
        reg = reg.replace(/YYYY/, _y4);
        reg = reg.replace(/YY/, _y2);
        reg = reg.replace(/MM/, _M2);
        reg = reg.replace(/M/, _M1);
        reg = reg.replace(/DD/, _d2);
        reg = reg.replace(/D/, _d1);
        reg = reg.replace(/hh/, _H2);
        reg = reg.replace(/h/, _H1);
        reg = reg.replace(/mm/, _m2);
        reg = reg.replace(/m/, _m1);
        reg = reg.replace(/ss/, _s2);
        reg = reg.replace(/s/, _s1);
        reg = new RegExp("^" + reg + "$");
        regexp = reg;
        return reg.test(dateString);
    }

    function validateIndex(formatString) {
        var ia = new Array();
        var i = 0;
        _yi = formatString.search(/YYYY/);
        if (_yi < 0) {
            _yi = formatString.search(/YY/);
        }
        if (_yi >= 0) {
            ia[i] = _yi;
            i++;
        }
        _Mi = formatString.search(/MM/);
        if (_Mi < 0) {
            _Mi = formatString.search(/M/);
        }
        if (_Mi >= 0) {
            ia[i] = _Mi;
            i++;
        }
        _di = formatString.search(/DD/);
        if (_di < 0) {
            _di = formatString.search(/DD/);
        }
        if (_di >= 0) {
            ia[i] = _di;
            i++;
        }
        _Hi = formatString.search(/hh/);
        if (_Hi < 0) {
            _Hi = formatString.search(/h/);
        }
        if (_Hi >= 0) {
            ia[i] = _Hi;
            i++;
        }
        _mi = formatString.search(/mm/);
        if (_mi < 0) {
            _mi = formatString.search(/m/);
        }
        if (_mi >= 0) {
            ia[i] = _mi;
            i++;
        }
        _si = formatString.search(/ss/);
        if (_si < 0) {
            _si = formatString.search(/s/);
        }
        if (_si >= 0) {
            ia[i] = _si;
            i++;
        }
        var ia2 = new Array(_yi, _Mi, _di, _Hi, _mi, _si);
        for (i = 0; i < ia.length - 1; i++) {
            for (j = 0; j < ia.length - 1 - i; j++) {
                if (ia[j] > ia[j + 1]) {
                    temp = ia[j];
                    ia[j] = ia[j + 1];
                    ia[j + 1] = temp;
                }
            }
        }
        for (i = 0; i < ia.length; i++) {
            for (j = 0; j < ia2.length; j++) {
                if (ia[i] == ia2[j]) {
                    ia2[j] = i;
                }
            }
        }
        return ia2;
    }

    function trim(str) {
        if (!str) {
            return str;
        }
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    DatePicker.format = function (date, format) {
        if (!format) {
            format = 'YYYY-MM-DD hh:mm:ss';
        }
        var o = {

            "M+": date.getMonth() + 1, //month
            "D+": date.getDate(),//day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        }
        var formatV = format.replace(/y/ig, 'Y').replace(/d/ig, 'D').replace(/H/ig, 'h');
        if (/(Y+)/.test(formatV))
            formatV = formatV.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(formatV)) {
                formatV = formatV.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return formatV;
    };

    /**
     * 设置显示在html页面的时间格式
     */
    var getValueByFormat = function () {
        var year, month, day, h, m, s;
        year = this.attr('year');
        month = this.attr('month');
        day = this.attr('day');
        h = this.attr('hh');
        m = this.attr('mm');
        s = this.attr('ss');
        var values = [year, month, day, h, m, s];
        if (values.join('') == '') {
            return '';
        }
        var dateTypes = ["YYYY", "MM", "DD", "hh", "mm", "ss"];
        var value = this.attr('format') || "YYYY-MM-DD hh:mm:ss";
        for (var i = dateTypes.length - 1; i >= 0; i--) {
            if (parseInt(values[i]) < 10) {
                value = value.replace(dateTypes[i], '0' + values[i]);
            } else {
                value = value.replace(dateTypes[i], values[i]);
            }

        }
        return value;
    };

    /**
     * 打开时间控件显示 或者隐藏
     */
    var openTime = function () {
        var el = this.getEl();
        if (!this.attr('isShow')) {
            this.show();
        } else {
            this.hide();
        }
    };
    /**
     * 显示时间控件弹出层
     */
    var showTime = function () {
        var el = this.getEl();
        this.attr('isShow', true);
        this.initValuesByValue();
        $(el).find('.oui-datetime-container').show();
        if (!this.attr('hh')) {
            this.attr('hh', 0);
        }
        if (!this.attr('mm')) {
            this.attr('mm', 0);
        }
        if (this.attr('hh') < 10) {
            $(el).find('.oui-datetime-houi').val('0' + this.attr('hh'));
        } else {
            $(el).find('.oui-datetime-houi').val(this.attr('hh'));
        }
        if (this.attr('mm') < 10) {
            $(el).find('.oui-datetime-min').val('0' + this.attr('mm'));
        } else {
            $(el).find('.oui-datetime-min').val(this.attr('mm'));
        }

    };
    /**
     * 隐藏时间控件弹出层
     */
    var hideTime = function () {
        var el = this.getEl();
        this.attr('isShow', false);
        if ((this.attr('showType') + '') == '3') {
            oui.hideTips();
        } else {
            $(el).find('.oui-datetime-container').hide();
        }

    };
    var init = function () {
        var value = this.attr('value');
        value = value.replace(/ /ig, ' ');//剔除特殊
        value = value.replace(/ /ig, ' ');
        this.attr('value', value);
        if (!this.attr('format')) { //对于没有配置的format进行初始化
            this.attr('format', DatePicker.formats[this.attr('showType')]);
        }
        var showType = this.attr("showType");
        if (((showType + '') == '2') || ((showType + '') == '3')) {//时间控件逻辑处理
            var harr = [];
            var marr = [];
            for (var i = 0; i < 24; i += 1) {
                if (i < 10) {
                    harr.push('0' + i);
                } else {
                    harr.push('' + i);
                }
            }
            for (var i = 0; i < 60; i += 1) {
                if (i < 10) {
                    marr.push('0' + i);
                } else {
                    marr.push('' + i);
                }
            }
            this.attr('harr', harr);
            this.attr('marr', marr);
            this.open = openTime;
            this.show = showTime;
            this.hide = hideTime;
            this.clearTime = clearTime;
            this.choose = confirmTime;
            this.resetValue = resetValue;
        }
        this.initValuesByValue();

        var otherAttrs = this.attr('otherAttrs') || '{}';
        otherAttrs = oui.parseJson(otherAttrs);
        var isLoadServerTime = otherAttrs.isLoadServerTime || this.attr('isLoadServerTime');
        if (isLoadServerTime && (typeof isLoadServerTime == 'string')) {
            if (isLoadServerTime == 'true') {
                isLoadServerTime = true;
            } else {
                isLoadServerTime = false;
            }
        }
        if (isLoadServerTime) {
            this.attr('isLoadServerTime', true);
        } else {
            this.attr('isLoadServerTime', false);
        }
    };
    /**
     * 清空控件时间
     */
    var clearTime = function () {
        var el = this.getEl();

        this.attr('value', '');
        $(el).find('input').val('');

        this.attr('el') && $(this.attr('el')).val('');

        this.attr('clearTime') && this.attr('clearTime')(this.attr('value'));
        this.hide();
    };
    /**
     * 选择控件时间
     */
    var confirmTime = function () {
        this.changeTime();
        this.attr('choose') && this.attr('choose')(this.attr('value'));
        this.hide();
    };
    /**
     * 改变控件时间
     */
    var changeTime = function (sel) {
        var el = this.getEl();
        var hh = $(el).find('.oui-datetime-houi').val();
        var mm = $(el).find('.oui-datetime-min').val();
        this.attr('hh', parseInt(hh));
        this.attr('mm', parseInt(mm));

        this.attr('value', this.getValueByFormat());
        this.attr('changeTime') && this.attr('changeTime')(this.attr('value'));
        $(el).find('input').val(this.attr('value'));
        this.triggerUpdate();
        this.triggerAfterUpdate();
        //this.render();
    };
    /**
     * 重置当前控件对象的value到元素上渲染
     */
    var resetValue = function (el) {
        $(el).val(this.attr('value'));
    };

    /**
     * 日期格式化参数
     */
    DatePicker.formats = [ //格式化参数 与showType的索引一一对应
        'YYYY-MM-DD',
        'YYYY-MM-DD hh:mm',
        'hh:mm',
        'hh:mm',
        'YYYY-MM',
        'YYYY'
    ];

    /**
     * 显示当前时间tips框
     */
    DatePicker.currTimeTip = null;
    DatePicker.showTimeTips = function (el, changeTime, choose, clearTime) {
        var ouiId = oui.$.Parser.getNewId();
        if (!$(el).val()) {
            $(el).val('00:00');
            changeTime && changeTime($(el).val());
        }
        if (DatePicker.currTimeTip) {
            oui.clearBy(function (control) {
                if (control == DatePicker.currTimeTip) {
                    $(control.getEl()).remove();
                    return true;
                }
            });
            DatePicker.currTimeTip = null;
        }
        var obj = oui.$.Parser.createControl(//创建我们的控件对象
            DatePicker, //控件具体实现类
            {
                id: "date-picker-time-tips-" + ouiId,
                el: el,
                showType: 3,
                ouiId: ouiId,// 为控件自增ouiId
                type: "datepicker",
                changeTime: changeTime,
                choose: choose,
                clearTime: clearTime,
                value: $(el).val()//需要为控件赋上的值
            });
        obj.init();
        oui.showTips({
            el: el,
            mustRender: true,
            scrollTop: $(el).position().top,
            content: obj.getHtml()
        });
        obj.show();
        DatePicker.currTimeTip = obj;
        return DatePicker.currTimeTip;
    };
    oui.showTimeTips = DatePicker.showTimeTips;
    ctrl["datepicker"] = DatePicker;//将控件类指定到特定命名空间下
    /***********************************控件事件***********************************/
})(window);





