(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var MultiSelect = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数
        this.attrs = this.attrs + ",data,isShowSelect,hideInput,title";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 单选框初始化
         */
        this.init = init;
        this.multiSelectClick = multiSelectClick;
        this.getData4DB = getData4DB;
        this.changeOtherText = changeOtherText;
        this.sortValue = sortValue;
        this.validate = validate;
        this.showSelect = showSelect;
        this.showDialogSelect = showDialogSelect;
        this.isEnumControl=true; //是枚举项控件,用途：1对于子控件的枚举项的渲染

        if (!(!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/))) {
            this.afterRender = function () {
                $(this.getEl()).find("[onTap]").each(function () {
                    $(this).removeAttr('onclick').attr("onclick", $(this).attr("ontap")).removeAttr("ontap");
                });
            }
        }

        this.getDisplay4readOnly = getDisplay4readOnly;//获取浏览态显示值
        this.multiSelectClick2showDisplay = multiSelectClick2showDisplay; //下拉多选框的选择事件
        this.showSelect = showSelect;//下拉多选框 显示方法
        this.hideSelect = hideSelect; //下拉多选框		隐藏方法
        this.showOrHideSelect = showOrHideSelect;
    };
    MultiSelect.FullName = "oui.$.ctrl.multiselect";//设置当前类全名
    ctrl["multiselect"] = MultiSelect;//将控件类指定到特定命名空间下

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    MultiSelect.templateHtml = [];
    //移动端没有下拉多选 也就是 showtype为3的情况，所以 所有模板相等
    MultiSelect.templateHtml[0] = MultiSelect.templateHtml[1] =
        '{{each data as item index}}' +
        '{{if (item.value +"") !="-1"}}' +
        '<div>' +
        '<label oId="{{item.id}}" class="canInputLabel" index="{{index}}" for="multiSelect_{{id}}_{{index}}" onclick="return false;"  ontap="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" >' +
        '<div class="multiSelect-wrapper">' +
        '<input type="checkbox" id="multiSelect_{{id}}_{{index}}" onclick="return false;" name="{{name}}" value="{{item.value}}" {{if value.split(",").indexOf((item.value+""))>=0 && item.value!=""}}checked="checked"{{/if}}  />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>' +
        '</label>' +
        '</div>' +
        '{{else}}' +
        '<div>' +
        '<label oId="{{item.id}}" class="oui-class-others canInputLabel" onclick="return false;"  ontap="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" for="multiSelect_{{id}}_{{index}}">' +
        '<div class="multiSelect-wrapper">' +
        '<input type="checkbox" id="multiSelect_{{id}}_{{index}}" onclick="return false;" name="{{name}}" value="{{item.value}}" {{if value.split(",").indexOf((item.value+""))>=0 && item.value!=""}}checked="checked"{{/if}} {{=commonEvent}}/>' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '&nbsp;其它' +
        '</label>' +
        '<input id="MultiSelect-other-{{id}}" class="oui-input-others" oninput="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onpropertychange="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onblur="oui.getByOuiId({{ouiId}}).changeOtherText(this);oui.validate(this);oui.getByOuiId({{ouiId}}).triggerAfterUpdate();" type="text" validate="{maxLength:30,msgPosEl:\'#MultiSelect-other-{{id}}\',msgPos:\'after\',failMode:\'msgPosEl\',title:\'其它\'}" {{if value.split(",").indexOf(item.value)<0}}disabled="disabled"{{/if}} value="{{=oui.escapeStringToHTML(item.display)}}">' +
        '</div>' +
        '{{/if}}' +
        '{{/each}}';


    /**
     * 下拉多选
     * @type {string}
     */
    MultiSelect.templateHtml[2] = MultiSelect.templateHtml[3] =
        '<input type="text" id="{{id}}" ontap="oui.getByOuiId({{ouiId}}).showOrHideSelect();" name="input_{{name}}" selValue="{{value}}" value="{{=oui.getByOuiId(ouiId).getDisplay4readOnly()}}" readonly="readonly" placeholder="请选择" />\
            {{if !hideInput}}<span class="MultiSelect-arrow"></span>{{/if}}\
            <div class="oui-select-mask-layer" ontap="oui.getByOuiId({{ouiId}}).hideSelect();"></div>\
            <div id="ul_{{id}}" class="oui-select-pop-area"  {{if !isShowSelect}}style="display:none;"{{/if}}>\
                <i class="select-triangle border-top border-right"></i>\
                <ul>\
                    {{each data as item index}}\
                    <li>\
                        <label  for="multiSelect_{{id}}_{{index}}" onclick="return false;" ontap="oui.getByOuiId({{ouiId}}).multiSelectClick2showDisplay(this);">\
                            <div class="multiSelect-wrapper">\
                                <input  type="checkbox" id="multiSelect_{{id}}_{{index}}" name="{{name}}" onclick="return false;"  value="{{item.value}}" {{if value.split(",").indexOf((item.value+""))>=0 && item.value!=""}}checked="checked"{{/if}}>\
                                <i class="selected-icon"></i>\
                            </div>\
                            <div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>\
                        </label>\
                    </li>\
                    {{/each}}\
                </ul>\
            </div>\
        </div>\
        ';

    MultiSelect.dialogSelectTemplate =
        '<div class="single-select-search">\
            <i class="single-select-search-icon"></i>\
            <input type="text" class="inputSearch" oninput="oui.$.ctrl.multiselect.input2filterItems(this);" placeholder="请输入搜索关键字…">\
        </div>\
        <div id="multi-select-serach-nothing" style="display: none" class="multi-select-serach-nothing">未搜索到相应内容</div>\
        <div class="multi-select-current">\
            <span class="multi-select-display-title">{{if (!value) && (value!==0)}}当前未选择 {{else}}当前选择: {{/if}}</span>\
            <span class="multi-select-display">\
            {{=oui.getDisplay4Multi(data,value)}}\
            </span>\
        </div>\
        <ul class="multi-select-search-ul">\
            {{each data as item index}}\
                <li class="multi-li-{{index}}">\
                    <label for="MultiSelect_dialog_{{index}}" onclick="return false;" ontap="oui.$.ctrl.multiselect.setSelected(this,{{index}});">\
                        <div class="multiSelect-wrapper">\
                            <input id="MultiSelect_dialog_{{index}}" onclick="return false;" name="MultiSelect-dialog-{{name}}" type="checkbox" value="{{item.value}}" {{if value.split(",").indexOf((item.value+""))>=0 && item.value!=""}}checked="checked"{{/if}}/>\
                            <i class="selected-icon"></i>\
                        </div>\
                       <div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>\
                    </label>\
                </li>\
            {{/each}}\
        </ul>';
    /**
     * 全屏dialog式的多选
     * @type {string}
     */
    MultiSelect.dialogSelectTemplate4HtmlDialog = '<div class="html-dialog-multiSelect">' +
        '<dl>' +
        '{{each data as item index}}' +
        '<dd class="multi-li-{{index}} {{if value.split(\',\').indexOf((item.value+\'\'))>=0 && item.value!=\'\'}}selected{{/if}}" val="{{item.value}}" ontap="oui.$.ctrl.multiselect.setSelected4HtmlDialog(this,{{index}});">' +
        '<i>{{=oui.escapeStringToHTML(item.display)}}</i>' +
        '<i class="selected-icon"></i>' +
        '</dd>' +
        '{{/each}}' +
        '</dl>' +
        '</div>';

    MultiSelect.templateHtml[4] = '\
                <input type="text" id="multiSelect-text-{{id}}" ontap="oui.getByOuiId({{ouiId}}).showDialogSelect();" name="{{name}}" value="{{=oui.getByOuiId(ouiId).getDisplay4readOnly()}}" readOnly="readOnly" readonly="readonly" placeholder="请选择" />\
                <input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />\
                {{if !hideInput}}<span class="multiselect-arrow" ontap="oui.getByOuiId({{ouiId}}).showDialogSelect();"></span>{{/if}}';

    MultiSelect.templateHtml[5] = MultiSelect.templateHtml[4];
    MultiSelect.templateHtml[6] = MultiSelect.templateHtml[0];

    MultiSelect.templateHtml4readOnly = [];
    MultiSelect.templateHtml4readOnly[0] =
        '{{each data as item index}}' +
        '{{if (value.split(",").indexOf(item.value+"")>=0) && (item.value+"" != "-1")}}' +
        '<p >' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '</p >' +
        '{{else if (value.split(",").indexOf(item.value+"") >= 0) && (item.value+"" == "-1")}}' +
        '<p >' +
        '{{=oui.escapeStringToHTML(item.display || "其它")}}' +
        '</p >' +
        '{{/if}}' +
        '{{/each}}';
    MultiSelect.templateHtml4readOnly[1] = MultiSelect.templateHtml4readOnly[0];
    MultiSelect.templateHtml4readOnly[2] = MultiSelect.templateHtml4readOnly[0];//下拉多选模板
    MultiSelect.templateHtml4readOnly[3] = MultiSelect.templateHtml4readOnly[0];//下拉多选浮动模板
    MultiSelect.templateHtml4readOnly[4] = MultiSelect.templateHtml4readOnly[0];//下拉多选浮动模板
    MultiSelect.templateHtml4readOnly[5] = MultiSelect.templateHtml4readOnly[0];//下拉多选浮动模板
    MultiSelect.templateHtml4readOnly[6] = MultiSelect.templateHtml4readOnly[0];//选项平铺开


    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(MultiSelect,'edit4ReadOnly,edit4View','0,1,2,3,4,5',MultiSelect.templateHtml4readOnly[0]);
    //MultiSelect.templateHtml[1] = '{{each data as item index}}' +
    //    '<div>' +
    //    '<input type="checkbox" class="oui-multiSelect" id="MultiSelect_{{id}}_{{index}}" name="{{name}}" onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" value="{{item.value}}" ' +
    //    '{{if value.split(",").indexOf(item.value)>=0}}checked="checked"{{/if}}  {{=commonEvent}} />' +
    //    ' <label for="MultiSelect_{{id}}_{{index}}">{{=item.text}}</label>' +
    //    '</div>' +
    //    '{{/each}}';
    //
    //MultiSelect.templateHtml[2] = '{{each data as item index}}' +
    //    '<div>' +
    //    '<input type="checkbox" class="oui-multiSelect" id="MultiSelect_{{id}}_{{index}}" name="{{name}}" onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" value="{{item.value}}" ' +
    //    '{{if value.split(",").indexOf(item.value)>=0}}checked="checked"{{/if}}  {{=commonEvent}} />' +
    //    '<label for="MultiSelect_{{id}}_{{index}}">{{=item.text}}</label>' +
    //    '</div>' +
    //    '{{/each}}';
    /************************************控件初始化init **************************/
    var init = function () {
        this.attr('isControlValidate', true);//复选框 的验证属性需要输出到最外层的div上
        var d = this.attr("data");
        if (!this.attr('value')) {
            this.attr('value', '');
        }
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("value","");
            oui.log("单选按钮 需要配置data属性");
            throw e;
        }

        var value = this.attr("value");
        var data = this.attr("data");
        var data4DB = this.attr("data4DB");
        if(value){
            if(data){
                var valueArray = value.split(",");
                var cfg = {};
                for (var i = 0, len = valueArray.length; i < len; i++) {
                    cfg[valueArray[i]] = valueArray[i];
                }
                var sorts = [];
                var dataKey = '';
                for (var k = 0, alen = data.length; k < alen; k++) {
                    dataKey = data[k].value + '';
                    if (dataKey+"" === cfg[dataKey]+"") {
                        if(dataKey === "-1"){
                            data4DB = oui.parseJson(data4DB || '{}');
                            if(typeof data4DB === 'object'){
                                data4DB = data4DB.items;
                            }
                            if(!data4DB){
                                data4DB = '[]';
                            }
                            if (data4DB && data4DB.length > 0) {
                                for (var j = 0, jLen = data4DB.length; j < jLen; j++) {
                                    if (data4DB[j].value === '-1') {
                                        data[k].display = data4DB[j].display;
                                    }
                                }
                            }
                        }
                        sorts.push(dataKey);
                    }
                }
                var nv = sorts.join(',');
                this.attr('value', nv);
                this.attr("data", data);
            }else {
                this.attr("data",[]);
                this.attr("value", "");
            }
        }else {
            this.attr("value", "");
        }

        var hideInput = this.attr("hideInput");
        if (hideInput == "true" || hideInput == true || hideInput == "hideInput") {
            this.attr("hideInput", true);
        } else {
            this.attr("hideInput", false);
        }
    };

    /***********************************控件事件***********************************/

    var multiSelectClick = function (el) {
        if (!el) {
            return;
        }
        var containerEl = this.getEl();

        var $el = $(el).find("input[type='checkbox']");
        el = $el[0];
        el.checked = !el.checked;

        var value = this.attr('value');
        var arr = [];
        if (value) {
            arr = value.split(",")
        }
        var v = $(el).val();
        var idx = arr.indexOf(v);
        if (el.checked) {//选中状态
            if (idx >= 0) {
                return;
            }
            arr.push(v);
            this.attr("value", arr.join(',')); //将当前选中值追加到value中
            arr = null;
            if (v == '-1') {
                $(containerEl).find('#MultiSelect-other-' + this.attr('id') + '').removeAttr('disabled');
            }
        } else {//非选中状态
            if (idx >= 0) { //移除当前取消选中的value
                arr.splice(idx, 1);
            }
            this.attr("value", arr.join(","));
            arr = null;
            if (v == '-1') {
                var $otherEl = $(containerEl).find('#MultiSelect-other-' + this.attr('id') + '');
                $otherEl.val('');
                this.changeOtherText($otherEl[0]);
                $otherEl.attr('disabled', 'disabled');
            }
        }
        this.sortValue();
        this.validate();
        this.triggerUpdate();
        this.triggerAfterUpdate();
        return false;
    };
    var sortValue = function () {
        var v = this.attr('value');
        if (!v) {
            return;
        }
        var data = this.attr('data');
        if (!data) {
            return;
        }
        var arr = v.split(',');
        var cfg = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            cfg[arr[i]] = arr[i];
        }
        var sorts = [];
        var dataKey = '';
        for (var k = 0, alen = data.length; k < alen; k++) {
            dataKey = data[k].value + '';
            if (dataKey == cfg[dataKey]) {
                sorts.push(dataKey);
            }
        }
        var nv = sorts.join(',');
        this.attr('value', nv);
    };

    oui.getDisplay4Multi = function (d, v) {
        var arr = [];
        var currText, currV;
        v = v || '';
        v = v.split(',');
        for (var i = 0, len = d.length; i < len; i++) {
            currText = d[i].display;
            currV = d[i].value + '';
            if ((currText) && (v.indexOf(currV) > -1)) {
                // arr.push(currText);
                arr.push(oui.escapeStringToHTML(currText));
            }
        }
        return arr.join('，');
    };

    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var d = this.attr('data');
        var v = this.attr('value') || '';
        var arr = [];
        v = v.split(',');
        var item = null;
        for (var i = 0, len = d.length; i < len; i++) {
            item = d[i];
            if (v.indexOf(item.value + '') > -1) {
                arr.push({
                    display: item.display,
                    value: item.value,
                    id: item.id
                });
            }
        }
        data4DB.items = arr;
        return data4DB;
    };

    /**
     * 改变其它中的输入文本
     */
    var changeOtherText = function (el) {
        var otext = $(el).val();
        if (this.attr('value').indexOf('-1') < 0) {
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


    /**
     * 获取浏览态显示
     *@isBr 是否换行显示 true:换行显示 ,否则则以中文逗号隔开
     */
    var getDisplay4readOnly = function () {

        var d = this.attr('data');
        var v = this.attr('value') || '';
        var arr = [];
        var currText, currV;
        v = v.split(',');
        var showType = this.attr('showType');
        for (var i = 0, len = d.length; i < len; i++) {
            currText = d[i].display;
            currV = d[i].value + '';
            /**下拉多选 其它选择 的显示文本 ***/
            if(((showType+'') =='3') && ((currV+'')=='-1')){
                currText = d[i].display || '其它';
            }
            if ((currText) && (v.indexOf(currV) > -1)) {
                arr.push(currText);
                //arr.push(oui.escapeStringToHTML(currText));
            }
        }
        return arr.join('，');
    };


    /**
     * 下拉多选框 选择某项的逻辑事件
     1、更新显示文本框中的内容
     2、更新value列表
     */
    var multiSelectClick2showDisplay = function (el) {
        this.multiSelectClick(el);
        var $inputEl = $(this.getEl()).find('#' + this.attr('id'));
        $inputEl.val(this.getDisplay4readOnly());
        $inputEl.attr('selValue', this.attr('value'));
        $inputEl.attr('value', this.getDisplay4readOnly());
        this.triggerUpdate();
        this.triggerAfterUpdate();
        return false;
    };
    /**
     * 下拉多选框 显示方法
     */
    var showSelect = function () {
        this.attr('isShowSelect', true);
        var $centerEl = $(this.getEl());
        var id = this.attr('id');
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").show();
        $ul.show();
        return false;
    };
    /**
     * 显示或隐藏 下拉多选框
     */
    var showOrHideSelect = function () {
        if (this.attr('isShowSelect')) {
            this.hideSelect();
        } else {
            this.showSelect();
        }
        return false;
    };
    /**
     * 下拉多选框 隐藏方法
     */
    var hideSelect = function () {
        this.attr('isShowSelect', false);
        var $centerEl = $(this.getEl());
        var id = this.attr('id');
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").hide();
        $ul.hide();
        return false;
    };


    /**
     * 控件的点击 显示下拉弹出选择
     * @returns {boolean}
     */
    var showDialogSelect = function () {
        var self = this;
        //var $el = $(self.getEl());
        var data = self.attr("data");
        data = oui.parseJson(data);
        var value = self.attr('value');

        oui.getTop().oui.showDialogSelect4Multi({
            data: data,
            value: value,
            currControl: self,
            title:self.attr('title'),
            ok: MultiSelect.MultiDialogCallback
        });
        return false;
    };


    /**
     * 渲染下拉单选框模板
     * @param data
     * @param showType
     * @returns {*}
     */
    MultiSelect.renderDialogSelectTemplate = function (data, showType) {
        if(showType === '5'){
            if (!this._renderDialogSelectTemplate4HtmlDialog) {
                this._renderDialogSelectTemplate4HtmlDialog = template.compile(this.dialogSelectTemplate4HtmlDialog);
            }
            return this._renderDialogSelectTemplate4HtmlDialog(data);
        } else {
            if (!this._renderDialogSelectTemplate) {
                this._renderDialogSelectTemplate = template.compile(this.dialogSelectTemplate);
            }
            return this._renderDialogSelectTemplate(data);
        }
    };

    /**
     * 弹出对话框类型的下拉选择框
     * @param options
     *
     */
    oui.showDialogSelect4Multi = function (options) {
        options = options || {};
        if (!options.data) {
            options.data = [];
        }
        if (typeof options.value === 'undefined') {
            options.value = "";
        }
        if (!options.ok) {
            options.ok = function () {
            };
        }
        if (!options.cancel) {
            options.cancel = function () {
            };
        }

        var title = options.title || '下拉选择';
        var currControl = options.currControl;
        var content = null;
        var showType = currControl.attr("showType");
        if(showType === '5'){
            content = oui.$.ctrl.multiselect.renderDialogSelectTemplate(options, showType);
        } else {
            content = oui.$.ctrl.multiselect.renderDialogSelectTemplate(options, showType);
        }

        var data = options.data;
        var selectedIndexs = [];
        var value = options.value;
        if(typeof value =='undefined'){
            value="";
        }
        options.value=value;
        for (var i = 0, len = data.length; i < len; i++) {
            if (value && (value+'').split(',').indexOf(data[i].value+'') >= 0) {
                selectedIndexs.push(i);
            }
        }
        var pOui = oui.getTop().oui;
        pOui.$.ctrl.dialog.MultiSelectDialog = oui.getTop().oui.showHTMLDialog({
            title: title,
            multiItems: data,
            selectedIndexs: selectedIndexs,
            center: showType !== '5',
            cls: "dialog-display-b",
            pos: showType === '5' ? "right" : "down",
            content: content,
            actions: [{
                text: "取消",
                cls:"oui-dialog-cancel",
                action: function () {
                    //self.singleDialog.hide();
                    var _MultiSelectDialog = pOui.$.ctrl.dialog.MultiSelectDialog;
                    var callback = _MultiSelectDialog.attr('cancel');
                    callback && callback();
                    _MultiSelectDialog.hide();
                }
            }, {
                text: "确定",
                cls:"oui-dialog-ok",
                action: function () {
                    var _MultiSelectDialog = pOui.$.ctrl.dialog.MultiSelectDialog;
                    var _selectedIndexs = _MultiSelectDialog.attr("selectedIndexs") || [];
                    // if ((!_selectedIndexs) || (_selectedIndexs.length === 0 )) {
                    //     oui.getTop().oui.alert('未选择选项');
                    //     return;
                    // }
                    // console.log(_selectedIndexs);
                    var callback = _MultiSelectDialog.attr('ok');
                    var _data = _MultiSelectDialog.attr("data") || [];
                    var selectedValueArr = [];
                    var _selectedUpdateIndexs = [];
                    for (var i = 0, len = _data.length; i < len; i++) {
                        if (_selectedIndexs.indexOf(i) >= 0) {
                            selectedValueArr.push(_data[i].value);
                            _selectedUpdateIndexs.push(i);
                        }
                    }
                    callback && callback(selectedValueArr.join(','), _data, _selectedUpdateIndexs);
                    _MultiSelectDialog.hide();
                }
            }]
        });
        pOui.$.ctrl.dialog.MultiSelectDialog.attr(options);
        return pOui.$.ctrl.dialog.MultiSelectDialog;
    };

    /**
     * 下拉框弹出选择后的回调函数
     * @param value
     * @param data
     * @param selectedIndexs
     * @constructor
     */
    MultiSelect.MultiDialogCallback = function (value, data, selectedIndexs) {
        var currControl = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr('currControl');
        currControl.attr('value', value);
        currControl.render();
        currControl.validate();
        currControl.triggerUpdate();
        currControl.triggerAfterUpdate();
    };

    /**
     * 下拉多选每一项的点击事件
     * @param el
     * @param index
     * @returns {boolean}
     */
    MultiSelect.setSelected4HtmlDialog = function (el, index) {
        var $el = $(el);
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog;
        var arr = MultiSelectDialog.attr("selectedIndexs") || [];
        var idx = arr.indexOf(parseInt(index + ""));
        if($el.hasClass('selected')){//已经是选中状态
            if (idx >= 0) { //移除当前取消选中的value
                arr.splice(idx, 1);
            }
            $el.removeClass("selected");
        } else {//不是选中状态
            if (idx >= 0) {
                return false;
            }
            arr.push(parseInt(index + ""));
            $el.addClass("selected");
        }
        MultiSelectDialog.attr("selectedIndexs", arr);
        return false;
    };

    /**
     *
     * @param el
     * @param index
     * @returns {boolean}
     */
    MultiSelect.setSelected = function (el, index) {
        var $el = $(el).find("input[type='checkbox']");
        el = $el[0];
        el.checked = !el.checked;
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog;//$containerEl.find("#select4dialog_" + ouiId);

        var arr = MultiSelectDialog.attr("selectedIndexs") || [];
        var idx = arr.indexOf(parseInt(index + ""));
        if (el.checked) {//选中状态
            if (idx >= 0) {
                return false;
            }
            arr.push(parseInt(index + ""));
        } else {//非选中状态
            if (idx >= 0) { //移除当前取消选中的value
                arr.splice(idx, 1);
            }
        }
        var _data = MultiSelectDialog.attr("data") || [];

        var displayArr = [];
        for (var i = 0, len = _data.length; i < len; i++) {
            if (arr.indexOf(i) >= 0) {
                displayArr.push(oui.escapeStringToHTML(_data[i].display));
            }
        }
        MultiSelectDialog.attr("selectedIndexs", arr);
        var $select4dialog = $(MultiSelectDialog.getEl());
        $select4dialog.find(".multi-select-display-title").html("当前选择:");
        $select4dialog.find('.multi-select-display').html(displayArr.join(","));

        return false;
    };


    /**
     * 搜索框输入事件
     * @param el
     */
    MultiSelect.input2filterItems = function (el) {
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog;
        var $dialogEl = $(MultiSelectDialog.getEl());
        var $ul = $dialogEl.find('ul');
        $ul.children().hide();
        var data = MultiSelectDialog.attr('multiItems');
        data = oui.parseJson(data);
        var display = $(el).val();
        var selectors = [];
        var noSelectors = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].display.indexOf(display) >= 0) {
                selectors.push('.multi-li-' + i);
            } else {
                noSelectors.push('.multi-li-' + i);
            }
        }
        if (noSelectors.length == data.length) {
            $('#multi-select-serach-nothing').show();
        } else {
            $('#multi-select-serach-nothing').hide();
        }
        $ul.find(selectors.join(',')).show();
        $ul.find(noSelectors.join(',')).hide();
    };

})(window);





