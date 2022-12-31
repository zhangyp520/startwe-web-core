(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var SingleSelect = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ",isShowSelect,hideInput,title,onHide,onShow,noEnumValueDisplay";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        this.init = init;
        this.getData4DB = getData4DB;
        this.radioClick = radioClick;
        this.showSelect = showSelect;//下拉单选框 显示方法
        this.hideSelect = hideSelect; //下拉单选框		隐藏方法
        this.showOrHideSelect = showOrHideSelect;
        this.showDialogSelect = showDialogSelect; //弹出htmlDialog 显示 下拉列表
        this.validate = validate;
        this.change = change;
        this.getTitleHtml = getTitleHtml;
        this.isEnumControl = true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
        this.getEnumItemDisplay = getEnumItemDisplay;
        this.hasNoEnumValue = hasNoEnumValue //判断当前值是否在枚举项中存在对应的值
    };
    SingleSelect.FullName = "oui.$.ctrl.singleselect";//设置当前类全名
    ctrl["singleselect"] = SingleSelect;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    SingleSelect.templateHtml = [];
    SingleSelect.templateHtml[0] = '<select id="{{id}}" validate="{{validate}}" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{/if}}' +
        'class="oui-form" style="{{fieldStyle}}" name="{{name}}" type="text" value="{{value}}" onblur="oui.validate(this);"  onchange="oui.getByOuiId({{ouiId}}).change(this);" > ' +
        '<option value="" {{if (!(value+"")) ||( (value+"")=="-1" )}}selected="selected"{{/if}} >请选择</option>' +
        '{{each data as item index}}' +
        '<option value="{{item.value}}" {{if (item.value+"")==(value+"")}}selected="selected"{{/if}} >{{=oui.escapeStringToHTML(item.display)}}</option>' +
        '{{/each}}' +
        ' </select>';
    SingleSelect.templateHtml[1] = '<select id="{{id}}" validate="{{validate}}" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{/if}}' +
        'class="oui-form" name="{{name}}" type="text" value="{{value}}" onblur="oui.validate(this);" onchange="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" > ' +
        '{{each data as item index}}' +
        '<optgroup label="{{index}}">' +
        '{{each item as i idx}}' +
        '<option value="{{i.value}}" {{if (item.value+"")==(value+"")}}selected="selected"{{/if}} >{{=oui.escapeStringToHTML(i.display)}}</option>' +
        '{{/each}}' +
        '</optgroup>' +
        '{{/each}}' +
        ' </select>';
    /**
     * 下拉单选模板 不浮动
     */
    SingleSelect.templateHtml[2] =
        //显示值
        '<input type="text" id="singleselect-text-{{id}}" onclick="oui.getByOuiId({{ouiId}}).showOrHideSelect();" title="{{=oui.escapeStringToHTML(oui.getByOuiId(ouiId).getEnumItemDisplay())}}" value="{{=oui.escapeStringToHTML(oui.getByOuiId(ouiId).getEnumItemDisplay())}}" readonly="readonly" />' +
            //实际值
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '{{if !hideInput}}<span class="singleselect-arrow" onclick="oui.getByOuiId({{ouiId}}).showOrHideSelect();"></span>{{/if}}' +
        '<div class="oui-select-mask-layer" onclick="oui.getByOuiId({{ouiId}}).hideSelect();"></div>' +
        '<ul id="ul_{{id}}" class="{{if hideInput}}singleselect-hidden-radio{{/if}}" {{if !isShowSelect}}style="display:none;"{{/if}}>' +
        '<li title="请选择">' +
        '<label>' +
        '<div class="radio-button-wrapper">' +
        '<input type="radio" id="radio_{{id}}_default" name="singleselect-{{name}}" ' +
        'onclick="oui.getByOuiId({{ouiId}}).radioClick(this,-1);" ' +
        '{{if (!value)}}checked=\"checked\"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '请选择' +
        '</label>' +
        '</li>' +
        '{{each data as item index}}' +
        '<li title="{{=oui.escapeStringToHTML(item.display)}}">' +
        '<label>' +
        '<div class="radio-button-wrapper">' +
        '<input type="radio" id="radio_{{id}}_{{index}}" name="singleselect-{{name}}" ' +
        'onclick="oui.getByOuiId({{ouiId}}).radioClick(this,{{index}});" ' +
        'value="{{item.value}}" {{if (item.value+"")==(value+"")}}checked="checked"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '</label>' +
        '</li>' +
        '{{/each}}' +
        '</ul>';
    /**
     * 下拉单选模板 浮动
     */
    SingleSelect.templateHtml[3] = SingleSelect.templateHtml[2];

    SingleSelect.templateHtml[4] = SingleSelect.templateHtml[2];
    SingleSelect.dialogSelectTemplate = '<div class="single-select-search">' +
        '<i class="single-select-search-icon"></i> <input type="text" id="search4single" name="search4single" class="inputSearch" onkeyup="oui.$.ctrl.singleselect.keyup2filterItems(this);" /> ' +
        '</div>' +
        '<div id="single-select-serach-nothing" style="display: none" class="single-select-serach-nothing">未搜索到相应内容</div>' +
        '<ul id="ul_single" class="{{if hideInput}}singleselect-hidden-radio{{/if}} single-select-search-ul"  >' +
        '<li class="single-li-default" title="请选择">' +
        '<label>' +
        '<div class="radio-button-wrapper">' +
        '<input type="radio" id="radio_default" name="singleselect-raido" ' +
        'onclick="oui.$.ctrl.singleselect.setSelected(this,-1);" ' +
        '{{if (!value)}}checked=\"checked\"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '请选择' +
        '</label>' +
        '</li>' +
        '{{each data as item index}}' +
        '<li class="single-li-{{index}}" title="{{=oui.escapeStringToHTML(item.display)}}">' +
        '<label>' +
        '<div class="radio-button-wrapper">' +
        '<input type="radio" id="radio_{{index}}" name="singleselect-raido" ' +
        'onclick="oui.$.ctrl.singleselect.setSelected(this,{{index}});" ' +
        'value="{{item.value}}" {{if (item.value+"")==(value+"")}}checked="checked"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '</label>' +
        '</li>' +
        '{{/each}}' +
        '</ul>';
    SingleSelect.templateHtml[5] =
        //显示值
        '<input type="text" readOnly="readOnly" placeholder="请选择" id="singleselect-text-{{id}}" onclick="oui.getByOuiId({{ouiId}}).showDialogSelect();" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{/if}}' +
        'value="{{each data as item index}}' +
        '{{if (item.value+"")==(value+"")}}' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '{{/if}}' +
        '{{/each}}"' +
        'title="{{each data as item index}}' +
        '{{if (item.value+"")==(value+"")}}' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '{{/if}}' +
        '{{/each}}"' +
        '  />' +
            //实际值
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '{{if !hideInput}}<span class="singleselect-arrow" onclick="oui.getByOuiId({{ouiId}}).showDialogSelect();"></span>{{/if}} ' +
        '<div id="select4dialog_{{id}}" style="display:none"> ' +
        SingleSelect.dialogSelectTemplate +
        '</div>';


    //浏览态模板
    SingleSelect.templateHtml4readOnly = [];
    SingleSelect.templateHtml4readOnly[0] = '{{each data as item index}}' +
        '{{if item.value==value}}' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '{{/if}}' +
        '{{/each}}';
    SingleSelect.templateHtml4readOnly[1] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[2] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[3] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[4] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[5] = SingleSelect.templateHtml4readOnly[0];
    Control.buildTemplate(SingleSelect, 'edit4ReadOnly,edit4View', '0,1,2,3,4,5', SingleSelect.templateHtml4readOnly[0]);
    SingleSelect.setSelected = function (el, index) { //设置当前选择行索引
        var SingleSelectDialog = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog;
        SingleSelectDialog.attr('selectedIndex', index);
        var display = $(el).parent().parent().text();
        var $dialogEl = $(SingleSelectDialog.getEl());
        $dialogEl.find('header').find('h3').html(getTitleHtml(display || '请选择'));
        //$dialogEl.find('.single-select-display').html(oui.escapeStringToHTML(display));
        //$dialogEl.find('.single-select-display-msg').html('当前选择:');
    };
    /**
     * 搜索 值改变时触发 选项显示或者隐藏
     * @param el
     */
    SingleSelect.keyup2filterItems = function (el) {
        var SingleSelectDialog = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog;
        var $dialogEl = $(SingleSelectDialog.getEl());
        var $ul = $dialogEl.find('ul');
        $ul.children().hide();
        var data = SingleSelectDialog.attr('singleItems');
        data = oui.parseJson(data);
        var display = $(el).val();
        var selectors = [];
        var noSelectors = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].display.indexOf(display) >= 0) {
                selectors.push('.single-li-' + i);
            } else {
                noSelectors.push('.single-li-' + i);
            }
        }
        if (noSelectors.length == data.length) {
            $dialogEl.find('#single-select-serach-nothing').show();
        } else {
            $dialogEl.find('#single-select-serach-nothing').hide();
        }
        selectors.push('.single-li-default'); //默认请选择
        $ul.find(selectors.join(',')).show();
        $ul.find(noSelectors.join(',')).hide();
    };
    var Length4Dialog = 20; // 当下拉框的长度超出20后 则以弹出框的方式展现
    /************************************控件初始化init **************************/
    var init = function () {

        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            oui.log("下拉框 需要配置data属性");
            throw e;
        }

        var v = this.attr("value");
        d = this.attr("data");

        var showType = this.attr("showType");
        if ((d.length > Length4Dialog) && (showType + '') == '0') {
            showType = 5; //模板5 为 当下拉选项大于20时 以 弹框显示下拉选项
            this.attr('showType', showType);
        }
        if (showType === "1") {
            for (var i in d) {
                var item = d[i];
                if (item && item.length > 0) {
                    this.attr("value", item[0].value);
                    break;
                }
            }
            return;
        }

        if (!v) {
            this.attr("value", '');
        }

        var value = this.attr("value");
        var data = this.attr("data");
        if (value + "") {
            var dataKey = '';
            for (var k = 0, alen = data.length; k < alen; k++) {
                dataKey = data[k].value + '';
                if (dataKey + "" === value + "") {
                    this.attr('value', dataKey);
                    break;
                }
                this.attr("value", "");
            }
        } else {
            this.attr("value", "");
        }
        if (this.attr('isShowSelect') && (this.attr('isShowSelect') == 'true' || this.attr('isShowSelect') == true)) {
            this.attr('isShowSelect', true);
        } else {
            this.attr('isShowSelect', false);
        }

        var hideInput = this.attr("hideInput");
        if (hideInput == "true" || hideInput == true || hideInput == "hideInput") {
            this.attr("hideInput", true);
        } else {
            this.attr("hideInput", false);
        }
    };

    /**
     * 下拉值改变后事件触发 triggerAfterUpdate
     * @param obj
     */
    var change = function (obj) {
        var ouiId = this.attr("ouiId");
        oui.$.ctrl.ouiformcontrol.change(ouiId, obj);
        oui.validate(obj);
        this.triggerAfterUpdate && this.triggerAfterUpdate();
    };

    /**
     * 下拉 单选 点击事件
     */
    var radioClick = function (el, index) {
        var data = this.attr('data');

        var containerEl = this.getEl();
        var $hidden = $(containerEl).find("#" + this.attr('id')); //隐藏框的值
        var $input = $(containerEl).find('#singleselect-text-' + this.attr('id'));//显示框的值回填
        if(index ==-1){
            this.attr('value','');
            $hidden.val("");
            $input.val("请选择");
            $input.attr('title', "请选择");
        }else{
            var item = data[index];
            this.attr("value", item.value);
            $hidden.val(item.value);
            $input.val(item.display);
            $input.attr('title', item.display);
        }
        oui.validate(containerEl); // 验证外框元素
        this.hideSelect();
        this.triggerUpdate();
        this.triggerAfterUpdate();
    };
    /**
     * 下拉单选框 显示方法
     */
    var showSelect = function () {
        this.attr('isShowSelect', true);
        var onShow = this.attr('onShow');
        if (onShow) {
            if (typeof onShow == 'string') {
                onShow = eval(onShow);
            }
            onShow(this);
        }
        var id = this.attr('id');
        var el = this.getEl();
        var $centerEl = $(el);
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").show();
        $ul.show();
        $ul.css('z-index',10);
        oui.follow4fixed(el, $ul[0]);
        return false;
    };
    /**
     * 显示或隐藏 下拉单选框
     */
    var showOrHideSelect = function () {
        if (this.attr('isShowSelect')) {
            this.hideSelect();
        } else {
            this.showSelect();
        }
    };
    /**
     * 渲染下拉单选框模板
     * @param data
     * @returns {*}
     */
    SingleSelect.renderDialogSelectTemplate = function (data) {
        if (!this._renderDialogSelectTemplate) {
            this._renderDialogSelectTemplate = template.compile(this.dialogSelectTemplate);
        }
        return this._renderDialogSelectTemplate(data);
    };
    /**
     * 弹框下拉单选
     * @param options {items,value,ok}
     */
    oui.showDialogSelect = function (options) {
        options = options || {};
        if (!options.data) {
            options.data = [];
        }

        if (!options.ok) {
            options.ok = function () {
            };
        }
        if (!options.cancel) {
            options.cancel = function () {
            };
        }
        var title = options.title || '请选择';
        var content = oui.$.ctrl.singleselect.renderDialogSelectTemplate(options)
        var data = options.data;
        var selectedIndex = -1;
        var value = options.value;
        if (typeof value == 'undefined') {
            value = "";
        }
        options.value = value;
        for (var i = 0, len = data.length; i < len; i++) {
            if ((data[i].value + '') == (value + '')) {
                selectedIndex = i;
                break;
            }
        }

        oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog = oui.getTop().oui.showHTMLDialog({
            title: title || '下拉选择',
            content: content,
            selectedIndex: selectedIndex,
            singleItems: oui.parseString(data),
            actions: [{
                text: "确定",
                id: "confirm-ok",
                cls: 'oui-dialog-ok',
                action: function () {
                    var _selectedIndex = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('selectedIndex');
                    if ((!(_selectedIndex + '')) || (_selectedIndex == -1)) {
                        //oui.getTop().oui.alert('未选择选项');
                        var ok = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('ok');
                        ok && ok("", oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('data'), -1);
                    } else {
                        var ok = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('ok');
                        ok && ok(oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('data')[_selectedIndex].value, oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('data'), _selectedIndex);
                    }
                    oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.hide();

                }
            }, {
                cls: 'oui-dialog-cancel',
                text: "取消",
                id: "cancel",
                action: function () {
                    var cancel = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('cancel');
                    cancel && cancel();
                    oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.hide();
                }
            }]
        });
        oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr(options);
        return oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog;
    };
    SingleSelect.SingleDialogCallback = function (value, data, selectedIndex) {
        var currControl = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('currControl');
        if (selectedIndex == -1) {
            currControl.attr('value', '');
        } else {
            currControl.attr('value', currControl.attr('data')[selectedIndex].value);
        }
        var onHide = currControl.attr('onHide');
        if (onHide) {
            if (typeof onHide == 'string') {
                onHide = eval(onHide);
            }
            onHide(currControl);
        }
        currControl.render();
        currControl.validate();
        currControl.triggerUpdate();
        currControl.triggerAfterUpdate();
    };
    /* 获取title的html**/
    var getTitleHtml = function (display) {
        if (display) {
            return '<span class="select-result" title="' + oui.escapeStringToHTML(display) + '" >' + oui.escapeStringToHTML(display) + '</span>';
        }
        var _self = this;
        var data = _self.attr('data') || [];
        var value = _self.attr('value');
        var display = '';
        for (var i = 0, len = data.length; i < len; i++) {
            if ((value + '') == data[i].value) {
                display = data[i].display;
            }
        }
        if (!display) {
            return '';
        }
        return '<span class="select-result" title="' + oui.escapeStringToHTML(display) + '" >' + oui.escapeStringToHTML(display) + '</span>';
    };
    var getEnumItemDisplay = function () {
        var value = this.attr('value');
        if (!value) {
            return '请选择';
        }
        var data = this.attr('data') || [];
        data = oui.parseJson(data);
        for (var i = 0, len = data.length; i < len; i++) {
            if ((data[i].value + '') == (value + '')) {
                if (data[i].isDeleted) {
                    var itemDisplay = this.attr('noEnumValueDisplay') || '该项已经被删除';
                    return itemDisplay;
                }
                return data[i].display;
            }
        }
        /**没有枚举值的 显示内容 ***/
        var itemDisplay = this.attr('noEnumValueDisplay') || '该项已经被删除';
        return itemDisplay;
    };
    /**判断当前value是否在枚举项中不存在 **/
    var hasNoEnumValue = function () {
        var value = this.attr('value');
        if (!(value + '')) {
            return false;
        }
        var data = this.attr('data') || [];
        data = oui.parseJson(data);
        for (var i = 0, len = data.length; i < len; i++) {
            if ((data[i].value + '') == (value + '')) {
                if (data[i].isDeleted) {
                    return true;
                }
                return false;
            }
        }
        return true;
    };
    /**
     * 弹出HtmlDialog 显示 可选列表
     */
    var showDialogSelect = function () {
        var _self = this;
        var data = _self.attr('data') || [];
        var value = _self.attr('value');
        _self.attr('title', _self.getTitleHtml());
        if (this.attr('right') == 'design') { //设计态不处理
            return;
        }
        var onShow = this.attr('onShow');
        if (onShow) {
            if (typeof onShow == 'string') {
                onShow = eval(onShow);
            }
            onShow(this);
            data = _self.attr('data');
            if(data.length<=20){
                this.attr('showType',3);
                this.render();
                this.showSelect();
                return ;
            }
        }
        _self.singleDialog = oui.getTop().oui.showDialogSelect({
            data: data,
            value: value,
            title: _self.attr('title') || '请选择',
            currControl: _self,
            ok: SingleSelect.SingleDialogCallback
        });
    };
    /**
     * 下拉单选框 隐藏方法
     */
    var hideSelect = function () {
        this.attr('isShowSelect', false);
        var onHide = this.attr('onHide');
        if (onHide) {
            if (typeof onHide == 'string') {
                onHide = eval(onHide);
            }
            onHide(this);
        }
        var id = this.attr('id');
        var $centerEl = $(this.getEl());
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").addClass("has-hide");
        $centerEl.find(".oui-select-mask-layer").hide();
        $ul.hide();
        return false;
    };
    var validate = function () {
        var el = this.getEl();
        var $validateEl = $(el).find('input[type=hidden]');
        var isCheck = oui.validate($validateEl);
        if (!isCheck) {
            oui.hideErrorInfo($validateEl);
        }
        return isCheck;
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
        } else {
            data4DB.display = "";
            data4DB.value = "";
            data4DB.id = "";
        }
        return data4DB;
    };
    /** 滚动条滚动时，隐藏模拟的选择框*****/
    $(win.document).ready(function () { //本人习惯这样写了
        $(win).scroll(function () {
            $('.oui-select-mask-layer').not('.has-hide').trigger('click');
        });
    });
})(window);





