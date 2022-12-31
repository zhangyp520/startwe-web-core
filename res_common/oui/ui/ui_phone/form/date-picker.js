(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /**
     * 控件类构造器
     */
    var DatePicker = function (cfg) {
        Control.call(this, cfg);//必须继承控件超类
        this.attrs = this.attrs + ",format,isLoadServerTime";//为了减少模板的代码量，所以在这对年份进行封装
        /*当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
         /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.getValue = getValue;
        this.afterRender = afterRender;
        this.changeVal = changeVal;
        this.clearContent = clearContent;
        this.loadServerTime = loadServerTime;//获取服务端时间
        this.initValuesByValue = initValuesByValue;
    };
    ctrl["datepicker"] = DatePicker;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)
    DatePicker.FullName = "oui.$.ctrl.datepicker";//设置当前类全名 静态变量
    DatePicker.formats = [ //格式化参数 与showType的索引一一对应
        'YYYY-MM-DD',
        'YYYY-MM-DD hh:mm'
    ];

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    DatePicker.templateHtml = [];

    DatePicker.templateHtml[0] = '<input type="text" {{if isLoadServerTime}}onTap=\"oui.getByOuiId({{ouiId}}).loadServerTime();\"{{/if}} class="form-text-indent" id="{{id}}" value="{{value}}" readonly="readonly" name="{{name}}" validate="{{validate}}" oninput="oui.getByOuiId({{ouiId}}).changeVal(this);" onchange="oui.getByOuiId({{ouiId}}).changeVal(this);"><span class="form-ico-datepicker"></span><i onTap="oui.getByOuiId({{ouiId}}).clearContent(this,\'{{ouiId}}\');" id="form_delete_info_btn_{{ouiId}}" class="form-delete-info"></i>';
    DatePicker.templateHtml[1] = '<input type="text" {{if isLoadServerTime}}onTap=\"oui.getByOuiId({{ouiId}}).loadServerTime();\"{{/if}} class="form-text-indent" id="{{id}}" value="{{value}}" readonly="readonly" name="{{name}}" validate="{{validate}}" oninput="oui.getByOuiId({{ouiId}}).changeVal(this);" onchange="oui.getByOuiId({{ouiId}}).changeVal(this);"><span class="form-ico-datepicker"></span><i onTap="oui.getByOuiId({{ouiId}}).clearContent(this,\'{{ouiId}}\');" id="form_delete_info_btn_{{ouiId}}" class="form-delete-info"></i>';

    DatePicker.serverTimePath = oui.getContextPath()+'common.do?method=time';
    var dateByDateStr = function (dateStr) {
        var dateStrArray = dateStr.replace(/\d+(?=-[^-]+$)/, function (a) {
            return parseInt(a, 10) - 1;
        }).match(/\d+/g);
        var date = null;
        if (dateStrArray && dateStrArray.length > 0) {
            date = eval('new Date(' + dateStrArray + ')');
        }
        return date;
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
        if(date){
            this.attr({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hh: date.getHours(),
                mm: date.getMinutes(),
                ss: date.getSeconds()
            });
            this.attr('value',DatePicker.format(date,format));
        }else{
            this.attr('value','');
        }
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
        try{
            /***处理值格式 ***/
            var arr= dateString.split(' ');
            var date ;
            if(arr.length==2){ //年月日 时:分
                var ymd = arr[0].split('-');
                var y = parseInt(ymd[0]);
                var m = parseInt(ymd[1])-1;
                var d = parseInt(ymd[2]);
                var hms = arr[1].split(":");
                var h, mm,s=0;
                if(hms.length==2){
                    h = parseInt(hms[0]);
                    mm= parseInt(hms[1]);
                }else if(hms.length==3){

                    h = parseInt(hms[0]);
                    mm= parseInt(hms[1]);
                    s = parseInt(hms[2]);
                }
                if(isNaN(y) || isNaN(m) || isNaN(d) ||isNaN(h) || isNaN(mm) || isNaN(s)){
                    date = null;
                }else{
                    date = new Date(y,m,d,h,mm,s);
                }
                return date;
            }else if(arr.length==1){//年月日 或者十分秒
                if(arr[0].indexOf('-')>0){
                    var ymd = arr[0].split('-');
                    var y = parseInt(ymd[0]);
                    var m = parseInt(ymd[1])-1;
                    var d = parseInt(ymd[2]);
                    var date ;
                    if(isNaN(y) || isNaN(m) || isNaN(d)){
                        date = null;
                    }else{
                        if(dateString.length<formatString.length){
                            date = new Date(y,m,d,0,0);
                        }else{
                            date = new Date(y,m,d);
                        }
                    }
                    return date;
                }else if(arr[0].indexOf(':')>0){
                    var date = null;
                    var hms = arr[0].split(':');
                    var h = parseInt(hms[0]);
                    var mm= parseInt(hms[1]);
                    var s = parseInt(hms[2]);
                    if(isNaN(h) || isNaN(mm) || isNaN(s)) {
                        date = null;
                    }else{
                        var now = new Date();
                        date = new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,mm,s);
                    }
                    return date;
                }
            }
        }catch(e){
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
    var init = function () {
        var self = this;
        if (!self.attr("showType")) {
            self.attr("showType", 0);
        }
        if (!this.attr('format')) { //对于没有配置的format进行初始化
            this.attr('format', DatePicker.formats[this.attr('showType')]);
        }
        var value = this.attr("value");
        value = dateByDateStr(value);
        if (value) {
            value = value.format(self.attr("showType") + "" === "0" ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm');//oui.dateStrByDateStr(value, self.attr("showType") + "" === "0" ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm');
        } else {
            value = "";
        }
        this.attr("value", value);
        var otherAttrs = this.attr('otherAttrs') ||'{}';
        otherAttrs = oui.parseJson(otherAttrs);
        var isLoadServerTime = otherAttrs.isLoadServerTime || this.attr('isLoadServerTime');
        if(isLoadServerTime && (typeof isLoadServerTime =='string')){
            if(isLoadServerTime =='true'){
                isLoadServerTime = true;
            }else{
                isLoadServerTime = false;
            }
        }
        if(isLoadServerTime){
            this.attr('isLoadServerTime',true);
        }else{
            this.attr('isLoadServerTime',false);
        }
    };
    /** 获取服务器时间并回填值 ***/
    var loadServerTime = function(){
        var me = this;
        oui.postData(DatePicker.serverTimePath,{},function(res){
            if(res.success){
                me.attr('value',res.msg);
                me.initValuesByValue();
                $(me.getEl()).find('#'+me.attr('id')).val(me.attr('value')).trigger('change');
                // me.triggerUpdate();
                // me.triggerAfterUpdate(); //点击后执行 afterUpdate
            }else{
                oui.getTop().oui.alert('获取服务器时间失败，请稍后再试');
                console.log(res.msg);
            }
        },function(res){
            oui.getTop().oui.alert('由于网络原因，获取服务器时间失败，请稍后再试');
            console.log(res);
        });
    };
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
        oui.hideErrorInfo(obj);
        self.triggerUpdate();
        self.triggerAfterUpdate();
        return false;
    };

    var getValue = function () {
        return this.attr("value");
    };

    var afterRender = function () {
        var self = this;
        var showType = parseInt(self.attr("showType"));
        var ouiId = self.attr("ouiId");
        if (self.attr("value") !== '') {
            $("#form_delete_info_btn_" + ouiId).show();
        } else {
            $("#form_delete_info_btn_" + ouiId).hide();
        }
        if(this.attr('isLoadServerTime')){
            return ;
        }
        var currDate = new Date();

        var currYear = (currDate).getFullYear();

        var opt = {};
        opt.date = {preset: 'date'};
        opt.datetime = {preset: 'datetime'};
        opt.time = {preset: 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            mode: 'scroller', //日期选择模式
            lang: 'zh',
            startYear: currYear - 85, //开始年份
            endYear: currYear + 50, //结束年份
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
                    $(self.getEl()).find("input").scroller('destroy').scroller($.extend(opt[showType === 1 ? 'datetime' : 'date'], opt['default']));
                }, null);
            } else {
                $(self.getEl()).find("input").scroller('destroy').scroller($.extend(opt[showType === 1 ? 'datetime' : 'date'], opt['default']));
            }
        }
    };

    /*******************************控件类的自定义函数 end******************************************/
})
(window);





