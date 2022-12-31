(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var MultiSelect = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数set,get 2,初始化构造参数
        this.attrs = this.attrs + ",isShowSelect,hideInput,title";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得

        /**
         * 单选框初始化
         */
        this.init = init;
        this.multiSelectClick = multiSelectClick;
        this.getData4DB = getData4DB;
        this.changeOtherText = changeOtherText;
        this.validate = validate;
        this.sortValue = sortValue;

        this.getDisplay4readOnly = getDisplay4readOnly;//获取浏览态显示值
        this.multiSelectClick2showDisplay = multiSelectClick2showDisplay; //下拉多选框的选择事件
        this.showSelect = showSelect;//下拉多选框 显示方法
        this.hideSelect = hideSelect; //下拉多选框		隐藏方法
        this.showOrHideSelect = showOrHideSelect;
        this.showDialogSelect = showDialogSelect;

        this.hasEnumOther = hasEnumOther;
        this.getTitleHtml = getTitleHtml;
        this.isEnumControl=true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
    };
    MultiSelect.FullName = "oui.$.ctrl.multiselect";//设置当前类全名
    ctrl["multiselect"] = MultiSelect;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    MultiSelect.templateHtml = [];


    MultiSelect.templateHtml[0] = '{{each data as item index}}' +
        '{{if (item.value +"") !="-1"}}' +
        '<label for="MultiSelect_{{id}}_{{index}}" >' +
        '<div class="multiSelect-wrapper">' +
        '<input class="form-multiSelect" type="checkbox" id="MultiSelect_{{id}}_{{index}}" name="{{name}}" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{else}}' +
        ' onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" ' +
        '{{/if}}' +
        ' value="{{item.value}}" ' +
        '{{if value.split(",").indexOf(item.value+"")>=0}}checked="checked"{{/if}} />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>' +
        '</label>' +
        '{{/if}}' +

        '{{if (item.value +"") =="-1"}}' +
        '<div class="oui-class-other">' +
        '<label for="MultiSelect_{{id}}_{{index}}">' +
        '<div class="multiSelect-wrapper">' +
        '<input class="form-multiSelect" type="checkbox" id="MultiSelect_{{id}}_{{index}}" name="{{name}}"' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{else}}' +
        ' onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" ' +
        '{{/if}}' +
        ' value="{{item.value}}" ' +
        '{{if value.split(",").indexOf(item.value+"")>=0}}checked="checked"{{/if}}    />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '其它' +
        '</label>' +
        '<input validate="{maxLength:30,msgPosEl:\'#MultiSelect-other-{{id}}\',msgPos:\'after\',failMode:\'msgPosEl\',title:\'其它\'}" id="MultiSelect-other-{{id}}" {{if value.split(",").indexOf(item.value)<0}}disabled="disabled"{{/if}}  class="oui-input-others" oninput="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onpropertychange="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onblur="oui.getByOuiId({{ouiId}}).changeOtherText(this);oui.validate(this);oui.getByOuiId({{ouiId}}).triggerAfterUpdate();" type="text" value="{{=oui.escapeStringToHTML(item.display)}}"/>' +
        '</div>' +
        '{{/if}}' +

        '{{/each}}';

    MultiSelect.templateHtml[1] = '{{each data as item index}}' +
        '<span>' +
        '{{if (item.value +"") !="-1"}}' +
        '<label for="MultiSelect_{{id}}_{{index}}">' +
        '<div class="multiSelect-wrapper">' +
        '<input class="form-multiSelect" type="checkbox" id="MultiSelect_{{id}}_{{index}}" name="{{name}}" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{else}}' +
        ' onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" ' +
        '{{/if}}' +
        ' value="{{item.value}}" ' +
        '{{if value.split(",").indexOf(item.value+"")>=0}}checked="checked"{{/if}}   />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>' +
        '</label>' +
        '{{/if}}' +

        '{{if (item.value +"") =="-1"}}' +
        '<div class="oui-class-other">' +
        '<label for="MultiSelect_{{id}}_{{index}}">' +
        '<div class="multiSelect-wrapper">' +
        '<input class="form-multiSelect" type="checkbox" id="MultiSelect_{{id}}_{{index}}" name="{{name}}" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{else}}' +
        ' onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" ' +
        '{{/if}}' +
        ' value="{{item.value}}" ' +
        '{{if value.split(",").indexOf(item.value+"")>=0}}checked="checked"{{/if}}  />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '其它' +
        '</label>' +
        '<input validate="{maxLength:30,msgPosEl:\'#MultiSelect-other-{{id}}\',msgPos:\'after\',failMode:\'msgPosEl\',title:\'其它\'}" id="MultiSelect-other-{{id}}" {{if value.split(",").indexOf(item.value)<0}}disabled="disabled"{{/if}} class="oui-input-others" type="text" oninput="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onpropertychange="oui.getByOuiId({{ouiId}}).changeOtherText(this);" onblur="oui.getByOuiId({{ouiId}}).changeOtherText(this);oui.validate(this);oui.getByOuiId({{ouiId}}).triggerAfterUpdate();" value="{{=oui.escapeStringToHTML(item.display)}}"/>' +
        '</div>' +
        '{{/if}}' +
        '</span>' +
        '{{/each}}';
    //下拉多选模板 showType=2
    MultiSelect.templateHtml[2] = '<input type="text" placeholder="请选择" id="{{id}}" onclick="oui.getByOuiId({{ouiId}}).showOrHideSelect();" name="input_{{name}}" selValue="{{value}}" value="{{=oui.escapeStringToHTML(oui.getByOuiId(ouiId).getDisplay4readOnly())}}" readOnly="readOnly" />' +
        '{{if !hideInput}}<span class="multiselect-arrow" onclick="oui.getByOuiId({{ouiId}}).showOrHideSelect();"></span>{{/if}}'+
        '<div class="oui-select-mask-layer" onclick="oui.getByOuiId({{ouiId}}).hideSelect();"></div>'+
        '<ul id="ul_{{id}}" {{if !isShowSelect}}style="display:none;"{{/if}}>' +
        '{{each data as item index}}' +
        '<li title="{{=oui.escapeStringToHTML(item.display)}}">' +
        '<label>' +
        '<div class="multiSelect-wrapper">' +
        '<input class="form-multiSelect" type="checkbox" id="MultiSelect_{{id}}_{{index}}" name="{{name}}" ' +
        '{{if right&&(right=="design")}}disabled="disabled" ' +
        '{{else}}' +
        ' onclick="oui.getByOuiId({{ouiId}}).multiSelectClick2showDisplay(this);" ' +
        '{{/if}}' +
        ' value="{{item.value}}" ' +
        '{{if value.split(",").indexOf(item.value+"")>=0}}checked="checked"{{/if}}   />' +
        '<i class="selected-icon"></i>' +
        '</div>' +
        '<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>' +
        '</label>' +
        '</li>' +
        '{{/each}}' +
        '</ul>';
    //第4套模板：下拉多选的浮动的模板;与第三套模板下拉多选不浮动的模板html结构相同
    //靠样式 区分效果 oui-class-multiselect-2和 oui-class-multiselect-3区分
    MultiSelect.templateHtml[3] = MultiSelect.templateHtml[2];

    MultiSelect.dialogSelectTemplate='<div class="multi-select-search">'+
        '<i class="multi-select-search-icon"></i> <input type="text" id="search4multi" name="search4multi" class="inputSearch" onkeyup="oui.$.ctrl.multiselect.keyup2filterItems(this);" /> '+
        '</div>'+
        '<div class="multi-select-all">'+
        '<button class="btn-select-all" onclick="oui.$.ctrl.multiselect.selectAll();">全选</button>' +
        '<button class="btn-select-clear" onclick="oui.$.ctrl.multiselect.unSelectAll();">清空选项</button>'+
        '</div>'+
        '<div id="multi-select-serach-nothing" style="display: none" class="multi-select-serach-nothing">未搜索到相应内容</div>'+
            //'<div class="multi-select-current"><span class="multi-select-display-msg">'+
            //'{{if (!value) && (value!==0)}}当前未选择 {{else}}当前选择: {{/if}} </span><span class="multi-select-display">' +
            //'{{=oui.getDisplay4Multi(data,value)}}'+
            //'</span> </div>'+
        '<ul id="ul_multi" class="{{if hideInput}}multiselect-hidden-multi{{/if}} multi-select-search-ul"  >'+
        '{{each data as item index}}'+
        '<li class="multi-li-{{index}}" title="{{=oui.escapeStringToHTML(item.display)}}">'+
        '<label>'+
        '<div class="checkbox-wrapper">'+
        '<input type="checkbox" id="multi_{{index}}" name="multiselect-multi" '+
        'onclick="oui.$.ctrl.multiselect.setSelected(this,{{index}});" '+
        'value="{{item.value}}" {{if  (value+"").split(",").indexOf(item.value+"")>=0 }}checked="checked"{{/if}} />'+
        '<i class="selected-icon"></i>'+
        '</div>'+
        '<div class="button-wrapper-info">{{=oui.escapeStringToHTML(item.display)}}</div>'+
        '</label>'+
        '</li>'+
        '{{/each}}'+
        '</ul>';
    MultiSelect.templateHtml[4] =
        //显示值
        '<input type="text" readOnly="readOnly" placeholder="请选择" id="multiselect-text-{{id}}" onclick="oui.getByOuiId({{ouiId}}).showDialogSelect();" ' +
        '{{if right&&(right=="design")}}disabled="disabled" '+
        '{{/if}}'+
        'value="{{=oui.escapeStringToHTML(oui.getByOuiId(ouiId).getDisplay4readOnly())}}"  />'+
            //实际值
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />'+
        '{{if !hideInput}}<span class="multiselect-arrow" onclick="oui.getByOuiId({{ouiId}}).showDialogSelect();"></span>{{/if}} '+
        '<div id="select4dialog_{{id}}" style="display:none"> '+
        MultiSelect.dialogSelectTemplate+
        '</div>';
    MultiSelect.templateHtml[5] = MultiSelect.templateHtml[4]; //第6套域第5套 下拉多选模板相同

    MultiSelect.templateHtml[6] = MultiSelect.templateHtml[0];//第七套 第一套模板相同
    //多选框浏览态 模板
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
    MultiSelect.templateHtml4readOnly[6] = MultiSelect.templateHtml4readOnly[0];//平铺多选

    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(MultiSelect,'edit4ReadOnly,edit4View','0,1,2,3,4,5,6',MultiSelect.templateHtml4readOnly[0]);
    /************************************控件初始化init **************************/
    var init = function () {
        var d = this.attr("data");
        this.attr('isControlValidate', true);//复选框 的验证属性需要输出到最外层的div上
        if (!this.attr('value')) {
            this.attr('value', '');
        }
        if (this.attr('isShowSelect') && (this.attr('isShowSelect') == 'true' || this.attr('isShowSelect') == true)) {
            this.attr('isShowSelect', true);
        } else {
            this.attr('isShowSelect', false);
        }
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("value", "");
            oui.log("多选框 需要配置data属性");
            throw new Error("多选框 需要配置data属性");
//			this.attr("value",'123');
//			this.attr("data",[{text:"a",value:"123"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"},{text:"b",value:"1234"}]);
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
                                for(var j = 0,jLen = data4DB.length;j < jLen;j++){
                                    if(data4DB[j].value === '-1'){
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
        if(hideInput == "true" || hideInput == true || hideInput == "hideInput"){
            this.attr("hideInput",true);
        }else{
            this.attr("hideInput",false);
        }
    };

    /***********************************控件事件***********************************/
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
    };
    /**
     * 下拉多选框 显示方法
     */
    var showSelect = function () {
        this.attr('isShowSelect', true);
        var el = this.getEl();
        var $centerEl = $(el);
        var id = this.attr('id');
        var $ul = $centerEl.find('#ul_' + id);
        $centerEl.find(".oui-select-mask-layer").show();
        $ul.show();
        $ul.css('z-index',10);
        oui.follow4fixed(el ,$ul[0]);
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
    };

    var multiSelectClick = function (el) {
        var containerEl = this.getEl();
        if (!el) {
            return;
        }
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
                var $otherEl = $(containerEl).find('#MultiSelect-other-' + this.attr('id') + '');

                $otherEl.removeAttr('disabled');
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

        this.validate(); //执行校验
        this.triggerUpdate();
        this.triggerAfterUpdate();
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
    /*var getDisplay = function () {
     var d = this.attr('data');
     var v = this.attr('value') ||'';
     var arr = [];
     var currText,currV;
     v = v.split(',');
     for(var i=0,len=d.length;i<len;i++){
     currText=d[i].display;
     currV = d[i].value;
     if(currText&& v.indexOf(currV)>-1){
     arr.push(currText);
     }
     }
     return arr.join(',');
     };*/

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

    oui.getDisplay4Multi = function(d,v){
        var arr = [];
        var currText, currV;
        v =  v||'';
        v = v.split(',');
        for (var i = 0, len = d.length; i < len; i++) {
            currText = d[i].display;
            currV = d[i].value + '';
            if ((currText) && (v.indexOf(currV) > -1)) {
                arr.push(currText);
                //arr.push(oui.escapeStringToHTML(currText));
            }
        }
        return arr.join('，');
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
     * 改变其它中的输入文本
     */
    var changeOtherText = function (el) {
        var otext = $(el).val();
        if (this.attr('value').indexOf('-1') < 0) {
            $(el).val('');
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
    /**
     * 判断是否含有其它选项
     */
    var hasEnumOther = function(){
        var data = this.attr('data');
        if(!data){
            return false;
        }
        for(var i=0,len=data.length;i<len;i++){
            if(data[i].value =='-1'){
                return true;
            }
        }
        return false;
    };
    var validate = function () {
        var el = this.getEl();
        if(this.hasEnumOther()){
            var $multiEl= $(el).find('#MultiSelect-other-'+this.attr('id'));
            if($multiEl&&$multiEl.length){
                var flag = oui.validate($multiEl[0]);
                if(!flag){
                    return  flag;
                }
            }
        }
        return oui.validate(el);
    };
    /* 获取title的html**/
    var getTitleHtml = function(display){
        if(display){
            return  '<span class="select-result" title="'+oui.escapeStringToHTML(display)+'" >'+oui.escapeStringToHTML(display)+'</span>';
        }
        var _self = this;
        var display = _self.getDisplay4readOnly();
        if(!display){
            return '';
        }
        return  '<span class="select-result" title="'+oui.escapeStringToHTML(display)+'" >'+oui.escapeStringToHTML(display)+'</span>';
    };
    /**
     * 弹出HtmlDialog 显示 可选列表
     */
    var showDialogSelect = function(){
        var _self = this;
        var data = _self.attr('data');
        var value = _self.attr('value');
        if(this.attr('right')=='design'){ //设计态不处理
            return ;
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
        _self.attr('title',_self.getTitleHtml());
        _self.multiDialog = oui.getTop().oui.showDialogSelect4Multi({
            data:data,
            value:value,
            title:_self.attr('title')||'请选择' ,
            currControl:_self,
            ok:MultiSelect.MultiDialogCallback
        });
    };
    MultiSelect.MultiDialogCallback =function(value,data,selectedIndexs){
        var currControl = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr('currControl');
        currControl.attr('value',value);
        currControl.render();
        var onHide = currControl.attr('onHide');
        if (onHide) {
            if (typeof onHide == 'string') {
                onHide = eval(onHide);
            }
            onHide(currControl);
        }
        currControl.validate();
        currControl.triggerUpdate();
        currControl.triggerAfterUpdate();
    };
    /**
     * 渲染下拉多选模板
     * @param data
     * @returns {*}
     */
    MultiSelect.renderDialogSelectTemplate = function(data){
        if(!this._renderDialogSelectTemplate){
            this._renderDialogSelectTemplate = template.compile(this.dialogSelectTemplate);
        }
        return this._renderDialogSelectTemplate(data);
    };
    /**
     * 弹框下拉单选
     * @param options {items,value,ok}
     */
    oui.showDialogSelect4Multi = function(options){
        options = options ||{};
        if(!options.data){
            options.data = [];
        }

        if(!options.ok){
            options.ok = function(){};
        }
        if(!options.cancel){
            options.cancel = function(){};
        }
        var title = options.title ||'请选择';
        var content = oui.$.ctrl.multiselect.renderDialogSelectTemplate(options)
        var data = options.data;
        var selectedIndexs = [];
        var value = options.value;
        if(typeof value =='undefined'){
            value="";
        }
        options.value=value;
        for(var i= 0,len=data.length;i<len;i++){
            if((value+'').split(',').indexOf(data[i].value+'')>=0){
                selectedIndexs.push(i);
            }else{
                continue;
            }
        }

        oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog = oui.getTop().oui.showHTMLDialog({
            title:title || '请选择',
            content:content,
            selectedIndexs:selectedIndexs,
            multiItems:oui.parseString(data),
            actions: [{text:"确定",
                id:"confirm-ok",
                cls:'oui-dialog-ok',
                action: function(){
                    var selectedIndexs = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr('selectedIndexs');
                    if((!selectedIndexs) || (selectedIndexs.length ==0 )){
                        oui.getTop().oui.alert('未选择选项');
                        return ;
                    }
                    var ok = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr('ok');
                    var selectedValueArr = [];
                    var _data = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr('data');
                    _data = _data ||[];
                    var _selectedUpdateIndexs = [];
                    for(var i= 0,len=_data.length;i<len;i++){
                        if(selectedIndexs.indexOf(i)>=0){
                            selectedValueArr.push(_data[i].value);
                            _selectedUpdateIndexs.push(i);
                        }
                    }
                    var strIndex = selectedIndexs.join(',');
                    ok && ok(selectedValueArr.join(','),_data,_selectedUpdateIndexs);
                    oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.hide();
                }
            }, { cls:'oui-dialog-cancel',
                text:"取消",
                id:"cancel",
                action:function(){
                    var cancel = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr('cancel');
                    cancel && cancel();
                    oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.hide();
                }
            }]
        });
        oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog.attr(options);
        return oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog;
    };
    MultiSelect.selectAll =function(){
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog ;
        var multiItems = MultiSelectDialog.attr('multiItems');
        multiItems = oui.parseJson(multiItems);

        var selectedIndexs= MultiSelectDialog.attr('selectedIndexs') || [];
        for(var i= 0,len=multiItems.length;i<len;i++){
            selectedIndexs.push(i);
        }
        MultiSelectDialog.attr('selectedIndexs',selectedIndexs);
        var displayArr = [];
        var _data = MultiSelectDialog.attr('data')||[] ;
        for(var i= 0,len=_data.length;i<len;i++){
            if(selectedIndexs.indexOf(i) >= 0){
                displayArr.push(_data[i].display);
            }
        }
        var $dialogEl = $(MultiSelectDialog.getEl());
        $dialogEl.find('input[type=checkbox]').each(function(){
            this.checked = 'checked';
        });
        $dialogEl.find('header').find('h3').html(getTitleHtml(displayArr.join(',') ||"请选择"));

    };
    MultiSelect.unSelectAll = function(){
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog ;
        var selectedIndexs=  [];
        MultiSelectDialog.attr('selectedIndexs',selectedIndexs);
        var displayArr = [];
        var _data = MultiSelectDialog.attr('data')||[] ;
        for(var i= 0,len=_data.length;i<len;i++){
            if(selectedIndexs.indexOf(i) >= 0){
                displayArr.push(_data[i].display);
            }
        }
        var $dialogEl = $(MultiSelectDialog.getEl());
        $dialogEl.find('input[type=checkbox]').each(function(){
            $(this).removeAttr('checked')
        });
        $dialogEl.find('header').find('h3').html(getTitleHtml(displayArr.join(',') ||"请选择"));

    };
    MultiSelect.setSelected = function(el,index){ //设置当前选择行索引
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog ;
        var selectedIndexs= MultiSelectDialog.attr('selectedIndexs') || [];
        var _selectedIdx = selectedIndexs.indexOf(parseInt(index+''));

        if($(el).is(':checked')){
            if( _selectedIdx >=0 ){
            }else{
                selectedIndexs.push(parseInt(index+''));
            }
        }else{
            if(_selectedIdx>=0){
                selectedIndexs.splice(_selectedIdx,1);
            }
        }
        MultiSelectDialog.attr('selectedIndexs',selectedIndexs);

        var displayArr = [];
        var _data = MultiSelectDialog.attr('data')||[] ;
        for(var i= 0,len=_data.length;i<len;i++){
            if(selectedIndexs.indexOf(i) >= 0){
                displayArr.push(_data[i].display);
            }
        }
        var $dialogEl = $(MultiSelectDialog.getEl());
        $dialogEl.find('header').find('h3').html(getTitleHtml(displayArr.join(',') ||"请选择"));
        //$dialogEl.find('.multi-select-display').html(oui.escapeStringToHTML(displayArr.join(',')));
        //$dialogEl.find('.multi-select-display-msg').html('当前选择:');
    };
    /**
     * 搜索 值改变时触发 选项显示或者隐藏
     * @param el
     */
    MultiSelect.keyup2filterItems=function(el){
        var MultiSelectDialog = oui.getTop().oui.$.ctrl.dialog.MultiSelectDialog ;
        var $dialogEl = $(MultiSelectDialog.getEl());
        var $ul = $dialogEl.find('ul');
        $ul.children().hide();
        var data = MultiSelectDialog.attr('multiItems');
        data = oui.parseJson(data);
        var display = $(el).val();
        var selectors = [];
        var noSelectors = [];
        for(var i= 0,len=data.length;i<len;i++){
            if(data[i].display.indexOf(display)>=0){
                selectors.push('.multi-li-'+i);
            }else{
                noSelectors.push('.multi-li-'+i);
            }
        }
        if(noSelectors.length == data.length){
            $dialogEl.find('#multi-select-serach-nothing').show();
        }else{
            $dialogEl.find('#multi-select-serach-nothing').hide();
        }
        $ul.find(selectors.join(',')).show();
        $ul.find(noSelectors.join(',')).hide();
    };
})(window);





