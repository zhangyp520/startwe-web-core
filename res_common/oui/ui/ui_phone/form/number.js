(function (win) {

    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    var constant = oui.$.constant;
    /**
     * 控件类设计构造器
     */
    var Number = function (cfg) {
        /***************************一 控件必须实现:控件继承call、控件全名定义FullName、控件的html内容模板函数getTemplateHtml ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
            //this.numberPanel = numberPanel;
            //this.compileDatePanel = compileDatePanel;
            //this.showNumberPanel = showNumberPanel;
            //this.numberClick = numberClick;
        this.attrs = this.attrs + ",format,numberFieldCls,dotNum";//当前控件自定义属性，无则去掉本行代码
        this.getFormatValue= getFormatValue;
        this.getInputValueByFormatAndValue = getInputValueByFormatAndValue; //根据format和value获取 输入框的值
        this.getValueByFormatValue = getValueByFormatValue;//根据格式化显示值 还原实际值
        this.afterRender = afterRender;
        this.init = function () {
            //this.setNumToMap();
            var v = this.attr("value");
            this.attr("value", v || "");

            try {
                parseFloat(this.attr("value"));
            }catch (e){
                this.attr("value","");
            }
            var format = this.attr('format');
            var otherAttrs = this.attr('otherAttrs');
            otherAttrs = oui.parseJson(otherAttrs||"{}");
            format = format || otherAttrs.format || "";
            this.attr('format',format);
            var validate = this.attr('validate') ||"{}";
            validate = oui.parseJson(validate);
            validate.percentNum = false;
            var dotNum = this.attr('dotNum');
            if(dotNum){
                if(!validate.dotNum){
                    validate.dotNum = parseInt(dotNum);
                }
            }

            var numberFieldCls = this.attr('numberFieldCls');
            if(format){
                if(format =='%'){//百分位
                    numberFieldCls = numberFieldCls ||  'oui-number-percent';
                    validate.percentNum = true;
                }else if(format ==','){ //千分位
                    numberFieldCls = numberFieldCls || 'oui-number-split'
                }
                this.attr('numberFieldCls',numberFieldCls);
            }
            this.attr('validate',oui.parseString(validate));
            var formatValue = this.getFormatValue();
            this.attr('formatValue',formatValue);
            this.attr('inputValue',this.getInputValueByFormatAndValue());
        };
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
        this.setValueBefore = setValueBefore;
        this.clearNoNum = clearNoNum;
        this.clearContent = clearContent;
        this.focus = focus;
        this.numFocus = numFocus;
        this.blur = blur;
        this.validate = validate;

    };
    ctrl["number"] = Number;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    Number.FullName = "oui.$.ctrl.number";//设置当前类全名 静态变量

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Number.templateHtml = [];
    //Number.templateHtml[0]='<span ontouchend="oui.getByOuiId({{ouiId}}).showNumberPanel()" class="oui-number-span" targetOuiId={{ouiId}}>{{value}}</span>';
    Number.templateHtml[0] = '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" targetHighBorderEl="oui.getNS().$(\'#number-{{id}}\')" validate="{{validate}}" />' +
        '<input type="text" id="number-{{id}}" ' +
        'onblur="oui.getByOuiId({{ouiId}}).blur({{ouiId}});" class="{{numberFieldCls}}" onfocus="oui.hideErrorInfo(this);oui.getByOuiId({{ouiId}}).numFocus({{ouiId}});" ' +
        'oninput="oui.getByOuiId({{ouiId}}).clearNoNum(this);" onpropertychange="oui.getByOuiId({{ouiId}}).clearNoNum(this);" ' +
        'value="{{inputValue}}"  placeholder="{{placeholder}}" style="{{fieldStyle}}" /> <i onTap="oui.getByOuiId({{ouiId}}).clearContent(this,\'{{ouiId}}\');" id="form_delete_info_btn_{{ouiId}}" class="form-delete-info"></i>' +
        '{{if format&&format=="%" }}'+
        '<span class="oui-number-percent-char">%</span>'+
        '{{/if}}' +

        '{{if format&&format=="," }}'+
        '<div class="oui-number-split-area" onclick="oui.getByOuiId({{ouiId}}).focus();">{{formatValue}}</div>'+
        '{{/if}}' +
        '';

    Number.templateHtml[1] = Number.templateHtml[0];

    /** 浏览态模板****/
    Number.templateHtml4readOnly= [];
    Number.templateHtml4readOnly[0] =  '{{formatValue}}' +
        '{{if (format&&format=="%" )&&(formatValue)}}'+
        '%'+
        '{{/if}}' +
        '';
    Number.templateHtml4readOnly[1] = Number.templateHtml4readOnly[0];
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(Number,'edit4ReadOnly,edit4View','0,1',Number.templateHtml4readOnly[0]);


    //暂时使用原生的，保留h5的键盘
    //Number.templateHtml[1] = '<input type="text" value="{{value}}" readonly="readonly" onTap="oui.getByOuiId({{ouiId}}).focus(this)"  placeholder="{{placeholder}}" id="{{id}}" style="{{fieldStyle}}" name="{{name}}" {{=commonEvent}} />';
    /** 千分位转换函数***/
    function toThousands(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    var setValueBefore = function() {
        this.init();
        this.attr('canBlur',false);
    };
    var afterRender = function () {
        var me = this;
        setTimeout(function () {
            me.attr('canBlur',true);
        },1);
    };
    /** 根据format获取 输入框中的值 *****/
    var getInputValueByFormatAndValue = function(){
        var format = this.attr('format');
        var inputValue ='';
        if(format =='%'){ //百分号 处理
            inputValue = this.getFormatValue();
        }else if(format ==','){ //千分位处理
            inputValue = this.attr('value');
        }else{
            inputValue = this.attr('value');
        }
        return inputValue;
    };
    /*** 获取格式化显示值******/
    var getFormatValue = function(){
        var format = this.attr('format');
        var value = this.attr('value');
        var displayValue = value;
        if(format && value ){
            if(format =='%'){ //百分号 处理
                var validate = oui.parseJson(this.attr('validate')||'{}');
                var dotNum = validate.dotNum ||0;
                displayValue = oui.fixedNumber(((parseFloat(value + "") * 100).toPrecision(12)), dotNum);
            }else if(format ==','){ //千分位处理
                displayValue = toThousands(value);
            }
        }
        return displayValue;
    };
    var getValueByFormatValue = function(){
        var formatValue = this.attr('formatValue');
        var format =this.attr('format');
        var value = formatValue;
        if(format && formatValue ){
            if(format =='%'){ //百分号 处理
                var validate = oui.parseJson(this.attr('validate')||'{}');
                var dotNum = validate.dotNum ||0;
                var tempNum= Math.pow(10,dotNum);
                value = oui.fixedNumber((parseFloat(formatValue+'')*(tempNum)/(100*tempNum)),dotNum+2);
                var maxLength =validate.maxLength ||15;
                if((value+'').length > maxLength){
                    value= value.substring(0,15);
                }
            }else if(format ==','){ //千分位处理
                value = formatValue.split(',').join('');
            }
        }
        return value;
    };
    var validate = function () {
        var el = this.getEl();
        var targetEl = $(el).find('#' + this.attr('id'))[0];
        return oui.validate(targetEl);
    };

    var clearContent = function (obj, ouiId) {
        var _c = oui.getByOuiId(ouiId);
        $(_c.getEl()).find("input").val('');
        _c.attr('value', '');
        _c.triggerUpdate();
        _c.triggerAfterUpdate();
    };

    /** 数字框获取焦点 时显示×按钮****/
    var numFocus = function (ouiId) {
        $("#form_delete_info_btn_" + ouiId).show();
    };
    /***控件 触发focus *******/
    var focus = function(){
        var el = this.getEl();
        var $splitArea = $(el).find('.oui-number-split-area');
        if($splitArea &&$splitArea.length){
            $splitArea.addClass('display_none');
        }
        var id = this.attr('id');
        $(el).find('#number-'+id).focus();
    };

    var blur = function (ouiId) {

        if(!this.attr('canBlur')){
            this.attr('canBlur',true);
            return ;
        }
        $("#form_delete_info_btn_" + ouiId).hide();
        var el = this.getEl();
        var id = this.attr('id');
        var format = this.attr('format');
        var validate = this.attr('validate') ||{};
        validate = oui.parseJson(validate);
        var dotNum = validate.dotNum ||0;
        /** 百分数处理****/
        /** 百分数处理****/
        if(format =='%'){

            var formatValue = this.attr('formatValue');
            if(formatValue){

                formatValue = oui.fixedNumber(parseFloat(formatValue+""),dotNum);
            }
            this.attr('formatValue',formatValue);
            this.attr('value',this.getValueByFormatValue());
            $(el).find('#'+id).val(this.attr('value'));
            $(el).find('#number-'+id).val(formatValue);
        }else{
            var value = $(el).find('#number-'+id).val();
            if(value){
                value = oui.fixedNumber(parseFloat(value+""),dotNum);
            }
            this.attr('value',value);
            this.attr('formatValue',this.getFormatValue());
            $(el).find('#'+id).val(value);
            $(el).find('#number-'+id).val(value);
        }
        var $splitArea = $(el).find('.oui-number-split-area');
        if($splitArea &&$splitArea.length){
            $splitArea.html(this.getFormatValue());
            $splitArea.removeClass('display_none');
        }
        this.triggerUpdate&&this.triggerUpdate();
        this.triggerAfterUpdate && this.triggerAfterUpdate();

    };

    function getCursortPosition(ctrl) {
        var CaretPos = 0;
        if (document.selection) {
            //ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        } else if (ctrl.selectionStart || ctrl.selectionStart == '0') CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    var clearNoNum = function (obj) {
        var validate = oui.parseJson(this.attr('validate')||'{}');
        var isInt,maxLength;
        if(typeof validate.dotNum !='undefined' && ((validate.dotNum+'')=='0')){
            isInt = true;
        }
        maxLength = validate.maxLength ||15;
        try{
            oui.clearNoNum(obj,isInt,false,maxLength);
        }catch (e){
        }
        var format = this.attr('format');
        if(format =='%'){ //百分号  输入值为格式化后的值，实际值 根据格式化参数获取实际值
            this.attr('formatValue',obj.value);
            this.attr('value',this.getValueByFormatValue());
        }else if(format==','){//千分位， 输入值为实际值 ，格式化的值，根据方法获取格式化值
            this.attr('value',obj.value);
            this.attr('formatValue',this.getFormatValue());
        }else{
            this.attr('value',obj.value);
            this.attr('formatValue',obj.value);
        }
        this.triggerUpdate();
    };

})
(window);





