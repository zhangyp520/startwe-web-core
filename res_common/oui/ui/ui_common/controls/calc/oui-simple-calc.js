/**
 * 简单计算组件
 * Created by yangH on 2018/3/12.
 */

(function () {

    /**
     * 简单计算组件
     */
    var SimpleCalc = {};

    var operator = {
        common: [
            {
                sign: "+",
                icon: "plus"
            },
            {
                sign: "-",
                icon: "minus-sign"
            },
            {
                sign: "*",
                icon: "multiplication"
            },
            {
                sign: "/",
                icon: "division"
            },
            {
                sign: "(",
                icon: "left-brackets"
            }, {
                sign: ")",
                icon: "right-brackets"
            }
        ]
    };

    var calcTemplateHtml =
        '<link rel="stylesheet" type="text/css" href="{{oui.getContextPath()}}res_apps/form/pc/formReport/css/form-report.css?d={{oui.uuid(8,10)}}" />' +
        '<div class="add-fomula-dialog">' +
        '<div class="fomula-input-title">' +
        '<p>公式名称</p>' +
        '<div><input type="text" value="{{calcName }}"></div>' +
        '</div>' +
        '<div class="fomula-count-info">' +
        '<p>公式预览<button class="clear-count">清除</button></p>' +
        '<div class="detail-cash-info">' +
        '<textarea readonly class="form-count-top-preview" calcStr="{{calcStr }}">{{calcDisplayStr }}</textarea>' +
        '</div>' +
        '</div>' +
        '<div class="total-operate-content">' +
        '<div class="operate-content-left">' +
        '<div class="left-select-title">' +
        '<span class="select-info-title active" target="#dataItem">表单数据</span>' +
        '<span class="select-info-title" target="#customInput">手动输入</span>' +
        '</div>' +
        '<ul id="dataItem" class="left-select-input left-data-list">' +
        '{{each items as item index}}' +
        '<li value="{{item.value }}" display="{{item.display }}" title="{{item.display }}">{{item.display }}</li>' +
        '{{/each}}' +
        '</ul>' +
        '<div id="customInput" class="left-select-input left-enter-input" style="display: none;"><input type="text" placeholder="请输入数字"></div>' +
        '</div>' +
        '<div class="operate-content-right">' +
        '<p class="right-select-title">运算符</p>' +
        '<ul class="operate-simbols-content">' +
        '{{each commonOperators as op index}}' +
        '<li sign="{{op.sign }}">' +
        '<div class="midright-li-area">' +
        '<span class="midright-li-area-frame">' +
        '<i class="operator-icon icon-{{op.icon }}"></i>' +
        '</span>' +
        '</div>' +
        '</li>' +
        '{{/each}}' +
        '</ul>' +
        '</div>' +
        '<div class="operate-mid-line"></div>' +
        '</div>' +
        '</div>';

    SimpleCalc.show = function (cfg) {
        var self = this;
        var _cfg = $.extend(true, {
            items: null,//[{display:'xxx',value:'abc'}]
            fillback: null,
            checkLoop: false,
            callback: function (calcStr, calcDisplayStr) {
            }
        }, cfg);

        var renderFunc = template.compile(calcTemplateHtml);
        if (!_cfg.fillback) {
            _cfg.fillback = {};
        }
        var calcHtml = renderFunc({
            calcName: _cfg.fillback.calcName || "",
            calcStr: _cfg.fillback.calcStr || "",
            calcDisplayStr: _cfg.fillback.calcDisplayStr || "",
            commonOperators: operator.common,
            items: _cfg.items || []
        });

        var itemsMap = {};
        var items = _cfg.items || [];
        for (var i = 0, len = items.length; i < len; i++) {
            itemsMap[items[i].value] = items[i];
        }

        self.calcStr = _cfg.fillback.calcStr || "";

        var simpleCalcDialog = oui.getTop().oui.showHTMLDialog({
            title: _cfg.title || '计算式设置',
            contentStyle: 'width: 700px;height: 500px',
            content: calcHtml,
            actions: [{
                text: "确定",
                action: function () {
                    // var DialogFormCalcBiz = formCalcDialog.getWindow().oui.getNS().FormCalcBiz;
                    // var calcStr = DialogFormCalcBiz.getReturnCalc();
                    // var calcDisplayStr = DialogFormCalcBiz.getReturnCalc4Display();
                    var $el = $(simpleCalcDialog.getEl());
                    var calcName = $el.find(".fomula-input-title input").val();
                    if (!calcName || calcName.length <= 0) {
                        oui.getTop().oui.alert("请输入公式名称!");
                        return false;
                    }
                    var calcStr = self.calcStr;
                    if(!calcStr){
                        oui.getTop().oui.alert("计算式不能为空!");
                        return false;
                    }
                    var calcDisplayStr = $(simpleCalcDialog.getEl()).find(".form-count-top-preview").val();
                    var reg = /(\+|\-|\*|\/|\()$/g;
                    if (calcStr) {
                        if (reg.test(calcStr)) {
                            oui.getTop().oui.alert("公式非法，请检查公式");
                            return false;
                        }
                        var regLeft = /\(/g;
                        var regRight = /\)/g;
                        var leftKs = calcStr.match(regLeft) || [];
                        var rightKs = calcStr.match(regRight) || [];
                        if (leftKs.length !== rightKs.length) {
                            oui.getTop().oui.alert("公式非法，请检查公式");
                            return false;
                        }

                        var regTwo = /\{([^{]+)}|\{([^{]+)}/ig;
                        var fields = calcStr.match(regTwo);
                        if (fields && fields.length > 0) {
                            for (var i = 0, len = fields.length; i < len; i++) {
                                var field = fields[i];
                                var fieldName = field.replace("{", "").replace("}", "");
                                if (!itemsMap[fieldName]) {
                                    oui.getTop().oui.alert("参与计算式的字段不存在或已被删除，请重新设置");
                                    return false;
                                }
                                //calcFormula = calcFormula.replace(field, "oui.formatNumber(formatType,Number(oui.JsonPathUtil.getJsonByPath('" + fieldName + "',item)),dotNum)");
                            }
                        }
                    }

                    _cfg.callback && _cfg.callback({
                        calcName: calcName,
                        calcStr: calcStr,
                        calcDisplayStr: calcDisplayStr
                    });
                    simpleCalcDialog.hide();
                }
            }, {
                text: "取消",
                cls: "oui-dialog-cancel",
                action: function () {
                    simpleCalcDialog.hide();
                }
            }]
        });

        self._simpleCalcDialog = simpleCalcDialog;

        self.setPreview = function (value) {
            var el = self._simpleCalcDialog.getEl();
            var $el = $(el);
            $el.find(".form-count-top-preview").val(value);
        };
        console.log(self);
        initView.call(self);
    };

    var regArray = [
        /^[\+|\-|\*|\/|\)]/gi,//不能以 +，-，*，/开头
        /[\+|\-|\*|\/|\(][\+|\-|\*|\/|\)]+/gi,//不能出现(+,-,*,/,()(+,-,*,/,)) 排列组合
        /(\)[a-z]*(\(|\{|\[))+/gi,//“)”后不能出现 函数，字段，变量
        /(\}[a-z]*(\(|\{|\[))+/gi,//字段后面不能出现 函数，字段，变量
        /(\][a-z]*(\(|\{|\[))+/gi,//变量后面不能出现,函数,字段,变量
        /(\d+[a-z]*(\(|\{|\[))+/gi,//数字后面不能出现,函数,字段,变量
        /(\}\{)+/gi,//字段和字段不能在一起
        /(\]\[)+/gi,//变量和变量不能在一起
        /(\)\()+/gi,//）（不能在一起
        /([\}|\]|\)]\d)+/gi,//字段，变量，括号，后面不能出现数字
        /(\d+[\{|\[|\(])+/gi,//数字后面不能直接出现 字段，变量，括号
        /(\d+[a-z*]+\()+/gi,//数字后面不能直接出现 函数
        /([\}|\]|\)|\']\')+/gi,
        /(\'[\{|\[|\(])+/gi,
        /(\'[a-z]*\()+/gi,//手动输入文本，不能直接跟函数
    ];

    var checkFormula = function (str) {
        var result = true;
        var r = null;
        var dotReg = /\'.*?\'/gi;
        var dArray = str.match(dotReg);
        var temp = str;
        if (dArray && dArray.length > 0) {
            temp = str.replace(dotReg, "'cs'");
        }
        for (var i = 0, len = regArray.length; i < len; i++) {
            r = regArray[i];
            var mA = temp.match(r);
            if (mA && mA.length > 0) {
                console.log(mA);
                result = false;
                break;
            }
        }
        return result;
    };

    var addFormula = function (calcStr, displayStr) {
        var self = this;
        var el = self._simpleCalcDialog.getEl();
        var $el = $(el);

        var temp = self.calcStr + calcStr;
        if (checkFormula(temp)) {
            self.setPreview($el.find(".form-count-top-preview").val() + displayStr);
            self.calcStr = self.calcStr + calcStr;
        } else {
            settingCustomInputValue.call(self, "");
            oui.getTop().oui.alert("操作不被允许，请检查！");
        }
    };
    var customInputValue = "";

    var settingCustomInputValue = function (value) {
        var self = this;
        var el = self._simpleCalcDialog.getEl();
        var $el = $(el);
        var $customInputControl = $el.find(".left-enter-input input");
        if ($customInputControl && $customInputControl.length > 0) {
            $customInputControl.val(value);
            customInputValue = value;
        }
    };

    var initView = function () {
        var self = this;
        var el = self._simpleCalcDialog.getEl();
        var $el = $(el);
        $el.find(".left-data-list").on("dblclick", "li", function () {
            var $li = $(this);
            var value = $li.attr("value");
            var display = $li.attr("display");
            addFormula.call(self, "{" + value + "}", "{" + display + "}");
        });


        $el.find(".operate-simbols-content").on("click", "li", function () {
            var $li = $(this);
            var sign = $li.attr("sign");
            settingCustomInputValue.call(self, "");
            addFormula.call(self, sign, sign);
        });

        $el.find(".clear-count").on("click", function () {
            self.calcStr = '';
            $el.find(".form-count-top-preview").val('');
        });

        $el.find(".select-info-title").on("click", function () {
            var $this = $(this);
            var area = $this.attr("target");
            var $area = $el.find(area);
            $el.find(".select-info-title").removeClass("active");
            $this.addClass("active");
            $el.find(".left-select-input").hide();
            $area.show();
        });

        customInputValue = "";
        $el.find(".left-enter-input input").on("input", function (e) {
            var $this = $(this);
            var oValue = $this.val();
            if (customInputValue.length === 0 && self.calcStr.match(/^.*\d$/)) {
                oui.getTop().oui.alert("请先清除已输入的公式再输入");
                $this.val(customInputValue);
                return false;
            }
            oui.clearNotNum4pc(e, this, false, true);
            oValue = $this.val();
            if (customInputValue === oValue) {
                return;
            }
            var cLength = customInputValue.length;
            var previewValue = $el.find(".form-count-top-preview").val();
            var oldLen = previewValue.length;
            self.setPreview(previewValue.substring(0, oldLen - cLength));
            self.calcStr = self.calcStr.substring(0, self.calcStr.length - cLength);
            customInputValue = oValue;
            if (customInputValue.length > 0) {
                addFormula.call(self, oValue, oValue);
            }
        });

    };

    oui.SimpleCalc = SimpleCalc;
})();

