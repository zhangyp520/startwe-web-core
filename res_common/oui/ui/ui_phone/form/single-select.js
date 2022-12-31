(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var SingleSelect = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ",data,isShowSelect,hideInput,title";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        this.init = init;

        this.showSelect = showSelect;//下拉单选框 显示方法
        this.hideSelect = hideSelect; //下拉单选框		隐藏方法
        this.showOrHideSelect = showOrHideSelect;
        this.singleSelectClick2showDisplay = singleSelectClick2showDisplay;
        this.getDisplay4readOnly = getDisplay4readOnly;
        this.openActionSheet = openActionSheet;
        this.showDialogSelect = showDialogSelect;
        this.isEnumControl=true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
        this.getData4DB = getData4DB;
        this.change = change;
        this.getEnumItemDisplay = getEnumItemDisplay;
        this.hasNoEnumValue = hasNoEnumValue //判断当前值是否在枚举项中存在对应的值
        //this.setSelected = setSelected;
        //if (!(!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/))) {
        //    this.afterRender = function () {
        //        $(this.getEl()).find("[onTap]").each(function () {
        //            $(this).removeAttr('onclick').attr("onclick", $(this).attr("ontap")).removeAttr("ontap");
        //        });
        //    }
        //}
        //this.getDisplay = getDisplay;
    };
    SingleSelect.FullName = "oui.$.ctrl.singleselect";//设置当前类全名
    ctrl["singleselect"] = SingleSelect;//将控件类指定到特定命名空间下

    /**
     * 定义 控件浏览态的模板
     * @type {Array}
     */
    SingleSelect.templateHtml4readOnly = [];
    SingleSelect.templateHtml4readOnly[0] = '{{each data as item index}}' +
        '{{if (item.value+"")==(value+"")}}' +
        '{{=oui.escapeStringToHTML(item.display)}}' +
        '{{/if}}' +
        '{{/each}}';
    SingleSelect.templateHtml4readOnly[1] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[2] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[3] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[4] = SingleSelect.templateHtml4readOnly[0];
    SingleSelect.templateHtml4readOnly[5] = SingleSelect.templateHtml4readOnly[0];
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(SingleSelect,'edit4ReadOnly,edit4View','0,1,2,3,4,5',SingleSelect.templateHtml4readOnly[0]);
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    SingleSelect.templateHtml = [];
    SingleSelect.templateHtml[0] = '<select id="{{id}}" validate="{{validate}}" style="{{fieldStyle}}" class="oui-form" name="{{name}}" onfocus="oui.hideErrorInfo(this);"  onchange="oui.getByOuiId({{ouiId}}).change(this);" > ' +
        '<option value="" {{if (!value) ||( (value+"")=="-1" )}}selected="selected"{{/if}} >请选择</option>' +
        '{{each data as item index}}' +
        '<option value="{{item.value}}" {{if (item.value+"") && (item.value+"")==(value+"")}}selected="selected"{{/if}} >{{item.display}}</option>' +
        '{{/each}}' +
        '</select>' +
        '<span class="design-arrow"></span>';

    SingleSelect.templateHtml[1] =
        '<select id="{{id}}" class="oui-form" name="{{name}}"onfocus="oui.hideErrorInfo(this);" onchange="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" > ' +
        '{{each data as item index}}' +
        '<optgroup label="{{index}}">' +
        '{{each item as i idx}}' +
        '<option value="{{i.value}}" {{if (item.value+"") && (item.value+"")==(value+"")}}selected="selected"{{/if}} >{{i.display}}</option>' +
        '{{/each}}' +
        '</optgroup>' +
        '{{/each}}' +
        ' </select>' +
        '<span class="design-arrow"></span>';

    //'<option value="" {{if (!value) ||( (value+"")=="-1" )}}selected="selected"{{/if}} >请选择</option>' +

    /**
     * 下拉多选
     * @type {string}
     */
    SingleSelect.templateHtml[2] =
        SingleSelect.templateHtml[3] =
            ' <input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />\
                <input type="text" id="singleselect-text-{{id}}" ontap="oui.getByOuiId({{ouiId}}).showOrHideSelect();" name="{{name}}" value="{{=oui.getByOuiId(ouiId).getDisplay4readOnly()}}" placeholder="{{placeholder || \'请选择\'}}" readonly="readonly" />\
                <span class="singleselect-arrow"></span>\
                <div class="oui-select-mask-layer" ontap="oui.getByOuiId({{ouiId}}).hideSelect();"></div>\
                <div id="ul_{{id}}" class="oui-select-pop-area {{if hideInput}}singleselect-hidden-radio{{/if}}"  {{if !isShowSelect}}style="display:none;"{{/if}}>\
                    <i class="select-triangle border-top border-right"></i>\
                    <ul >\
                        <li class="{{if !(value+"")}}active{{/if}}">\
                            <label  for="singleselect_{{id}}_default" onclick="return false;" ontap="oui.getByOuiId({{ouiId}}).singleSelectClick2showDisplay(this,-1);">\
                                <div class="radio-button-wrapper">\
                                    <input  type="radio" id="singleselect_{{id}}_default" name="singleselect-{{name}}" onclick="return false;"  {{if !(value+"")}}checked="checked"{{/if}}>\
                                    <i class="selected-icon"></i>\
                                </div>\
                                请选择\
                            </label>\
                        </li>\
                        {{each data as item index}}\
                        <li class="{{if item.value!="" && (item.value+"")==(value+"")}}active{{/if}}">\
                            <label  for="singleselect_{{id}}_{{index}}" onclick="return false;" ontap="oui.getByOuiId({{ouiId}}).singleSelectClick2showDisplay(this,{{index}});">\
                                <div class="radio-button-wrapper">\
                                    <input  type="radio" id="singleselect_{{id}}_{{index}}" name="singleselect-{{name}}" onclick="return false;"  value="{{item.value}}" {{if (item.value+"")==(value+"")}}checked="checked"{{/if}}>\
                                    <i class="selected-icon"></i>\
                                </div>\
                                {{=oui.escapeStringToHTML(item.display)}}\
                            </label>\
                        </li>\
                        {{/each}}\
                    </ul>\
                </div>\
            </div>\
            ';
    SingleSelect.templateHtml[4] = '\
        <input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}">\
        <div class="singleSelect-actionsheet" onTap="oui.getByOuiId({{ouiId}}).openActionSheet();">\
        {{each data as item index}}\
            {{if (item.value+"") && ((item.value+"") == (value+""))}}{{item.display}}{{/if}}\
        {{/each}}\
        </div>\
        <i class="right-arrow"></i>';


    SingleSelect.dialogSelectTemplate = '<div class="single-select-search">\
                                            <i class="single-select-search-icon"></i>\
                                            <input type="text" class="inputSearch" oninput="oui.$.ctrl.singleselect.input2filterItems(this);" placeholder="请输入搜索关键字…">\
                                        </div>\
                                        <div id="single-select-serach-nothing" style="display: none" class="single-select-serach-nothing">未搜索到相应内容</div>\
                                        <div class="single-select-current">\
                                            <span class="single-select-display-title">{{if (!(value+""))}}当前未选择 {{else}}当前选择: {{/if}}</span>\
                                            <span class="single-select-display">\
                                            {{each data as item index}}\
                                                {{if (item.value+"") && (item.value+"")==(value+"")}}\
                                                    {{=oui.escapeStringToHTML(item.display)}}\
                                                {{/if}}\
                                            {{/each}}\
                                            </span>\
                                        </div>\
                                        <ul class="single-select-search-ul">\
                                                <li class="single-li-default">\
                                                    <label for="singleselect_dialog_default" onclick="return false;" ontap="oui.$.ctrl.singleselect.setSelected(this,-1);">\
                                                        <div class="radio-button-wrapper">\
                                                            <input id="singleselect_dialog_default" name="singleselect-dialog-{{name}}" type="radio"   {{if !(value+"")}}checked="checked"{{/if}}/>\
                                                            <i class="selected-icon"></i>\
                                                        </div>\
                                                       请选择\
                                                    </label>\
                                                </li>\
                                            {{each data as item index}}\
                                                <li class="single-li-{{index}}">\
                                                    <label for="singleselect_dialog_{{index}}" onclick="return false;" ontap="oui.$.ctrl.singleselect.setSelected(this,{{index}});">\
                                                        <div class="radio-button-wrapper">\
                                                            <input id="singleselect_dialog_{{index}}" name="singleselect-dialog-{{name}}" type="radio" value="{{item.value}}" {{if item.value!="" && (item.value+"")==(value+"")}}checked="checked"{{/if}}/>\
                                                            <i class="selected-icon"></i>\
                                                        </div>\
                                                       {{=oui.escapeStringToHTML(item.display)}}\
                                                    </label>\
                                                </li>\
                                            {{/each}}\
                                        </ul>';
    SingleSelect.templateHtml[5] = '\
                <input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />\
                <input type="text" id="singleselect-text-{{id}}" ontap="oui.getByOuiId({{ouiId}}).showDialogSelect();" name="{{name}}" value="{{=oui.getByOuiId(ouiId).getDisplay4readOnly()}}" readonly="readonly" placeholder="请选择" />\
                {{if !hideInput}}<span class="singleselect-arrow" ontap="oui.getByOuiId({{ouiId}}).showDialogSelect();"></span>{{/if}}';
    //<div id="select4dialog_{{ouiId}}" style="display:none">' + SingleSelect.dialogSelectTemplate + '</div>';
    /************************************控件初始化init **************************/

    var Length4Dialog = 20; // 当下拉框的长度超出20后 则以弹出框的方式展现


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

        if (this.attr("right") == "preview") {
            if (oui.os.mobile) {
                if ((d.length > Length4Dialog) && (showType + '') == '0') {
                    showType = 5; //模板5 为 当下拉选项大于20时 以 弹框显示下拉选项
                    this.attr('showType', showType);
                }
            }
        } else {
            if ((d.length > Length4Dialog) && (showType + '') == '0') {
                showType = 5; //模板5 为 当下拉选项大于20时 以 弹框显示下拉选项
                this.attr('showType', showType);
            }
        }

        if (showType == "1") {
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
                if (dataKey+"" === value +"") {
                    this.attr('value', dataKey);
                    break;
                }
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
    /**
     * 下拉值改变后事件触发 triggerAfterUpdate
     * @param obj
     */
    var change = function (obj) {
        var ouiId = this.attr("ouiId");
        oui.$.ctrl.ouiformcontrol.change(ouiId, obj);
        // oui.validate(obj);
        this.triggerAfterUpdate();
    };


    var getDisplay4readOnly = function () {
        var d = this.attr('data');
        var v = this.attr('value') || '';
        var currText = '', currV;

        for (var i = 0, len = d.length; i < len; i++) {
            currV = d[i].value + '';
            if (v == currV) {
                currText = oui.escapeStringToHTML(d[i].display);
                break;
            }
        }
        return currText;
    };

    /**
     * 下拉单选显示的值
     * @param el
     * @param index
     */
    var singleSelectClick2showDisplay = function (el, index) {

        var $el = $(el).find("input[type='radio']");
        var $checkRadio = $("input[name='" + $el.attr("name") + "']:checked");

        $checkRadio && $checkRadio.length > 0 && ($checkRadio[0].checked = false);

        $el[0].checked = true;

        var data = this.attr('data');
        var containerEl = this.getEl();
        $(containerEl).find(".active").removeClass("active");
        $(el).parent().addClass("active");
        var $hidden = $(containerEl).find("#" + this.attr('id')); //隐藏框的值
        var $input = $(containerEl).find('#singleselect-text-' + this.attr('id'));//显示框的值回填
        if(index ==-1){
            this.attr('value','');
            $hidden.val("");
            $input.val("请选择");
        }else{
            var item = data[index];
            this.attr("value", item.value);
            $hidden.val(item.value);
            $input.val(item.display);
        }
        oui.validate(containerEl); // 验证外框元素
        this.hideSelect();
        this.triggerUpdate();
        this.triggerAfterUpdate();
        return false;
    };

    /**
     * 下拉单选框 显示方法
     */
    var showSelect = function () {
        this.attr('isShowSelect', true);
        var id = this.attr('id');
        var $centerEl = $(this.getEl());
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").show();
        $ul.show();
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
        return false;
    };
    /**
     * 下拉单选框 隐藏方法
     */
    var hideSelect = function () {
        this.attr('isShowSelect', false);

        var id = this.attr('id');
        var $centerEl = $(this.getEl());
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").hide();
        $ul.hide();
        return false;
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
                    $(_controll.getEl()).find(".radio-actionsheet").html(_data[index].display);
                    _controll.triggerUpdate();
                    _controll.triggerAfterUpdate();
                    return false;
                }
            });
        }
        oui.showActionSheetDialog({items: items});
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

        oui.getTop().oui.showDialogSelect({
            data: data,
            value: value,
            currControl: self,
            title:self.attr("title"),
            ok: SingleSelect.SingleDialogCallback
        });
        return false;
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
     * 弹出对话框类型的下拉选择框
     * @param options
     *
     */
    oui.showDialogSelect = function (options) {
        options = options || {};
        if (!options.data) {
            options.data = [];
        }
        if (typeof options.value == 'undefined') {
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
        var content = oui.$.ctrl.singleselect.renderDialogSelectTemplate(options);
        var data = options.data;
        var selectedIndex = -1;
        var value = options.value;

        for (var i = 0, len = data.length; i < len; i++) {
            if ((data[i].value + '') == (value + '')) {
                selectedIndex = i;
            }
        }
        var pOui = oui.getTop().oui;
        pOui.$.ctrl.dialog.SingleSelectDialog = oui.getTop().oui.showHTMLDialog({
            title: title,
            singleItems: data,
            selectedIndex: selectedIndex,
            center: true,
            cls: "dialog-display-b",
            pos: "down",
            content: content,
            actions: [{
                text: "取消",
                action: function () {
                    //self.singleDialog.hide();
                    var _singleSelectDialog = pOui.$.ctrl.dialog.SingleSelectDialog;
                    var callback = _singleSelectDialog.attr('cancel');
                    callback && callback();
                    _singleSelectDialog.hide();
                }
            }, {
                text: "确定",
                action: function () {

                    var _singleSelectDialog = pOui.$.ctrl.dialog.SingleSelectDialog;
                    var _selectedIndex = _singleSelectDialog.attr("selectedIndex");
                    var callback = _singleSelectDialog.attr('ok');
                    var _data = _singleSelectDialog.attr("data");
                    if ((!(_selectedIndex + '')) || (_selectedIndex == -1)) {
                        callback && callback("", _data, -1);
                    }else{
                        callback && callback(_data[_selectedIndex].value, _data, _selectedIndex);
                    }

                    _singleSelectDialog.hide();
                    //var selectedIndex = self.singleDialog.attr('selectedIndex');
                    //self.attr('value', (typeof selectedIndex != "") ? self.attr('data')[selectedIndex].value : "");
                    //self.render();
                    //self.singleDialog.hide();
                }
            }]
        });
        pOui.$.ctrl.dialog.SingleSelectDialog.attr(options);
        return pOui.$.ctrl.dialog.SingleSelectDialog;
    };

    /**
     * 下拉框弹出选择后的回调函数
     * @param value
     * @param data
     * @param selectedIndex
     * @constructor
     */
    SingleSelect.SingleDialogCallback = function (value, data, selectedIndex) {
        var currControl = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog.attr('currControl');
        if(selectedIndex ==-1){
            currControl.attr('value', "");
        }else{
            currControl.attr('value', (typeof selectedIndex != "") ? currControl.attr('data')[selectedIndex].value : "");
        }
        currControl.render();
        currControl.triggerUpdate();
        currControl.triggerAfterUpdate();
    };


    /**
     *
     * @param el
     * @param index
     * @returns {boolean}
     */
    SingleSelect.setSelected = function (el, index) {
        var $el = $(el).find("input[type='radio']");
        var $checkRadio = $("input[name='" + $el.attr("name") + "']:checked");
        $checkRadio && $checkRadio.length > 0 && ($checkRadio[0].checked = false);
        $el[0].checked = true;
        //var data = this.attr('data');
        //var item = data[index];
        var display = $(el).text();

        var SingleSelectDialog = oui.getTop().oui.$.ctrl.dialog.SingleSelectDialog;//$containerEl.find("#select4dialog_" + ouiId);
        SingleSelectDialog.attr("selectedIndex", index);
        var $select4dialog = $(SingleSelectDialog.getEl());
        if(index !=-1){
            $select4dialog.find(".single-select-display-title").html("当前选择:");
            $select4dialog.find('.single-select-display').html(oui.escapeStringToHTML(display));
        }else{
            $select4dialog.find(".single-select-display-title").html("当前未选择");
            $select4dialog.find('.single-select-display').html("");
        }
        return false;
    };


    /**
     * 搜索框输入事件
     * @param el
     */
    SingleSelect.input2filterItems = function (el) {
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
        if(noSelectors.length == data.length){
            $('#single-select-serach-nothing').show();
        }else{
            $('#single-select-serach-nothing').hide();
        }
        selectors.push('.single-li-default');
        $ul.find(selectors.join(',')).show();
        $ul.find(noSelectors.join(',')).hide();
    };

    var getData4DB = function(){
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var vals = this.getValue() || "";
        if(vals){
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
    var getEnumItemDisplay = function(){
        var value = this.attr('value');
        if(!value){
            return '请选择';
        }
        var data = this.attr('data') ||[];
        data = oui.parseJson(data);
        for(var i= 0,len=data.length;i<len;i++){
            if((data[i].value+'') == (value+'')){
                return data[i].display;
            }
        }
        /**没有枚举值的 显示内容 ***/
        var itemDisplay = this.attr('noEnumValueDisplay') || '该项已经被删除';
        return itemDisplay;
    };
    /**判断当前value是否在枚举项中不存在 **/
    var hasNoEnumValue= function () {
        var value = this.attr('value');
        if(!(value+'')){
            return false;
        }
        var data = this.attr('data') ||[];
        data = oui.parseJson(data);
        for(var i= 0,len=data.length;i<len;i++){
            if((data[i].value+'') == (value+'')){
                return false;
            }
        }
        return true;
    };
})(window);





