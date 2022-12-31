/**
 * Created by YangH on 2018/11/26.
 */
(function (win, oui) {

    //计算结果类型
    var CalcResultType = {
        NUMBER: 1,
        VARCHAR: 2,
        DATE: 3,
        DATETIME: 4,
        BOOLE_DB: 5,
        BOOLE_rom: 6,
        SELECT_PERSON: 7,
        SELECT_DEPARTMENT: 8
    };

    var Operator = {
        common: [
            {
                sign: "+",
                icon: "plus",
                support: [CalcResultType.VARCHAR, CalcResultType.NUMBER, CalcResultType.DATE, CalcResultType.DATETIME, CalcResultType.SELECT_PERSON, CalcResultType.SELECT_DEPARTMENT]
            },
            {
                sign: "-",
                icon: "minus-sign",
                support: [CalcResultType.NUMBER, CalcResultType.DATE, CalcResultType.DATETIME]
            },
            {
                sign: "*",
                icon: "multiplication",
                support: [CalcResultType.NUMBER]
            },
            {
                sign: "/",
                icon: "division",
                support: [CalcResultType.NUMBER]
            },
            {
                sign: "(",
                icon: "left-brackets",
                support: [CalcResultType.NUMBER]
            }, {
                sign: ")",
                icon: "right-brackets",
                support: [CalcResultType.NUMBER]
            }
        ],
        condition: [
            {
                sign: ">",
                icon: "greater-than"
            }
            , {
                sign: "<",
                icon: "less-than"
            }
            , {
                sign: ">=",
                icon: "greater-than-equal"
            }
            , {
                sign: "<=",
                icon: "less-than-equal"
            },
            {
                sign: "<>",
                icon: "greater-than-less"
            }, {
                sign: "=",
                icon: "equality-sign"
            }
        ]
    };

    var FunctionsConfig = {
        commonFunc: [
            {
                title: '日期差',
                func: "subDate",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: false
            },
            {
                title: "日期时间差",
                func: "subDateTime",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: false
            },
            {
                title: "取整数",
                func: "getInt",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取余数",
                func: "getMod",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取年",
                func: "getYear",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取月",
                func: "getMonth",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取日",
                func: "getDay",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取星期几",
                func: "weekday",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "向上取整",
                func: "roundUp",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "向下取整",
                func: "roundDown",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "大写长格式",
                func: "toUpperForLong",
                support: [CalcResultType.VARCHAR],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "大写短格式",
                func: "toUpperForShort",
                support: [CalcResultType.VARCHAR],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "中文小写",
                func: "toUpper",
                support: [CalcResultType.VARCHAR],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取日期",
                func: "date",
                support: [CalcResultType.VARCHAR],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取时间",
                func: "time",
                support: [CalcResultType.VARCHAR],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            }, {
                title: "取年月",
                func: "getYearMonth",
                support: [CalcResultType.VARCHAR],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            }, {
                title: "取身份证生日",
                func: "getIDBirthday",
                support: [CalcResultType.DATE],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            },
            {
                title: "取年龄",
                func: "getAge",
                support: [CalcResultType.VARCHAR, CalcResultType.NUMBER],
                fieldSourceType: ["main", "sub"],
                isCheckControl: true
            }
        ],
        subFunc: [
            {
                title: "合计",
                func: "sum",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main"],//结果字段来源
                isCheckControl: true
            },
            {
                title: "平均",
                func: 'avg',
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main"],
                isCheckControl: true
            },
            {
                title: "最大",
                func: 'max',
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main"],
                isCheckControl: true
            },
            {
                title: '最小',
                func: "min",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main"],
                isCheckControl: true
            },
            {
                title: '行数',
                func: "count",
                support: [CalcResultType.NUMBER],
                fieldSourceType: ["main"],
                isCheckControl: true
            }
        ]
    };
    var Variable = {
        org: [
            {
                name: "当前登录人员姓名",
                code: "org_currentUser"
            },
            {
                name: "当前登录人员的手机号",
                code: "org_currentUserPhone"
            },
            {
                name: "当前登录人员所在单位",
                code: "org_currentUserOrg"
            },
            {
                name: "当前登录人员所在部门",
                code: "org_currentUserDepartment"
            },
        ],
        date: [
            {
                name: "系统日期",
                code: "date_currentDate"
            },
            {
                name: "系统日期时间",
                code: "date_currentDateTime"
            },
            {
                name: "系统时间",
                code: "date_currentTime"
            },
            {
                name: "本月初日期",
                code: "date_currentMonthStart"
            },
            {
                name: "本月末日期",
                code: "date_currentMonthEnd"
            },
        ],
        system: [
            {
                name: "创建人",
                code: "creator",
            },
            {
                name: "创建日期时间",
                code: "createTime",
                supportFunc: ["subDate", "subDateTime"]
            },
            {
                name: "修改日期时间",
                code: "modifyTime",
                supportFunc: ["subDate", "subDateTime"]
            }
        ]
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

    var CalcBiz = {
        "package": "com.oui.calc",
        "class": "CalcBiz",
        "data": {},
        getData: function () {
            return this.data;
        },
        fieldsMap: {},
        customInputTab: 'customInput',
        FieldPre: "{",
        FieldSuf: "}",
        FuncFieldPre: "{func_",
        FuncFieldSuf: "}",
        VarPre: "[",
        VarSuf: "]",
        getFieldStr4Show: function (str) {
            return this.FieldPre + str + this.FieldSuf;
        },
        getFieldStr4Calc: function (str) {
            return this.FieldPre + str + this.FieldSuf;
        },
        getFieldStr4Calc4Func: function (str) {
            return this.FuncFieldPre + str + this.FuncFieldSuf;
        },
        init: function (options) {
            if (!options.items || options.items.length <= 0) {
                throw "请传入字段列表";
            }
            if (!options.resultType) {//如果没有传 这默认数字计算
                options.resultType = CalcResultType.NUMBER;
            }
            options = $.extend(true, {}, options);
            //处理字段列表
            options.fields = this.mergeFields(options.items);
            this.data = $.extend(true, {
                showCalcName: false,//是否显示计算式名称设置
                resultType: 1,//计算结果类型
                resultSourceType: "main",//结果字段来源，（主表还是明细表）
                useFunction: false,
                formulaStr: "",
                displayStr: "",
                calcName: ""
            }, options);
            if (options.fillback) {
                var fillBack = options.fillback;
                this.data.formulaStr = fillBack.formulaStr || "";
                this.data.displayStr = fillBack.displayStr || "";
                this.data.calcName = fillBack.calcName || "";
            }
            var tab = options.fields[0].tab;
            this.data.tab = tab;
            this.data.tabFields = this.fieldsMap[tab];

            this.data.operateList = Operator.common;
            this.data.commonFunctionList = FunctionsConfig.commonFunc;
            this.data.subFunctionList = FunctionsConfig.subFunc;
            this.data.customInputStr = "";

            console.log(this.data.tabFields);
        },
        getFormulaStr: function () {
            return this.data.formulaStr;
        },
        getDisplayStr: function () {
            return this.data.displayStr;
        },
        mergeFields: function (items) {
            var fields = [];
            var item = null;
            var itemField = null;
            var newItem = null;
            var itemFields = null;
            var newItemFields = null;
            var self = this;
            var tab = null;
            for (var i = 0, len = items.length; i < len; i++) {
                newItem = {
                    title: items[i].title
                };
                itemFields = items[i].fields;
                newItemFields = [];
                for (var j = 0, jLen = itemFields.length; j < jLen; j++) {
                    itemField = itemFields[j];
                    if (itemField.dataType) {
                        if (itemField.dataType.toLowerCase() === 'number') {
                            itemField.dataType = CalcResultType.NUMBER;
                        }
                    } else {
                        itemField.dataType = CalcResultType.NUMBER;
                    }
                    newItemFields.push(itemField);
                }
                tab = oui.uuid(8);
                newItem.tab = tab;
                fields.push(newItem);
                self.fieldsMap[tab] = newItemFields;
            }
            fields.push({
                title: "手动输入",
                tab: self.customInputTab
            });
            return fields;
        },
        checkFormula: function (str) {
            var result = true;
            //FIXME 因为下面要将文本输入的字符串替换掉，所以需要校验计算式中是否按钮两个单引号在一起的情况
            var matchArray = str.match(/(\'\')+/gi);
            if (matchArray && matchArray.length > 0) {
                return false;
            }
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
                    result = false;
                    break;
                }
            }
            return result;
        },
        addFormula: function (str, formulaStr) {
            var self = this;
            var temp = self.data.formulaStr + formulaStr;
            if (self.checkFormula(temp)) {
                self.data.displayStr = self.data.displayStr + str;
                self.data.formulaStr = self.data.formulaStr + formulaStr;
                oui.getById("calc-textArea").render();
            } else {
                //self.settingCustomInputValue("");
                this.data.customInputStr = "";
                $("#customInputControl").val("");
                // oui.getById("calc-tab").render();
                oui.getTop().oui.alert("操作不被允许，请检查！");
            }
        },
        tabChange: function (cfg) {
            var $tab = $(cfg.el);
            this.data.tab = $tab.attr("tab");
            this.data.customInputStr = "";
            oui.getById("calc-tab").render();
            $("#customInputControl").val("");
        },
        searchInput: function (cfg) {
            var $this = $(cfg.el);
            var value = $this.val();
            var $ul = $(".calc-info-list");
            var $lis = $ul.find("li");
            if (value === null && value === '') {
                $lis.show();
            } else {
                $lis.each(function () {
                    var _$this = $(this);
                    if (_$this.html().indexOf(value) >= 0) {
                        _$this.show();
                    } else {
                        _$this.hide();
                    }
                });
            }
        },
        searchBtnClick: function (cfg) {
            var $this = $(cfg.el);
            var isDelete = $this.hasClass("calcSearch-btn-del");
            if (isDelete) {
                $this.removeClass("calcSearch-btn-del");
                $this.parent().find(".calcSearch-input").val("");
                $this.parent().find(".calcSearch-input").trigger("input");
            } else {
                $this.addClass("calcSearch-btn-del");
                $this.parent().find(".calcSearch-input").trigger("input");
            }
        },
        calcNameInput: function (cfg) {
            var $this = $(cfg.el);
            this.data.calcName = $this.val();
        },
        customInput: function (cfg) {
            var self = this;
            var calcType = self.data.resultType;
            var $this = $(cfg.el);
            var oValue = $this.val();
            var $errorSpan = $(".error-light-tips");
            if (calcType === CalcResultType.NUMBER) {
                if (self.data.customInputStr.length === 0 && self.data.formulaStr.match(/^.*\d$/)) {
                    $errorSpan.html("请先清除已输入的公式再输入").show();
                    $this.val(self.data.customInputStr);
                    return false;
                }
                oui.clearNotNum4pc(cfg.e, cfg.el, false, true);
                oValue = $this.val();
            } else {
            }
            $errorSpan.hide();
            if (self.data.customInputStr === oValue) {
                return false;
            }
            var cLength = self.data.customInputStr.length;
            // if (cLength !== 0 && calcType !== CalcResultType.NUMBER) {
            //     cLength = cLength + 2;
            // }
            var previewValue = self.data.displayStr;
            var oldLen = previewValue.length;
            self.data.displayStr = previewValue.substring(0, oldLen - cLength);
            self.data.formulaStr = self.data.formulaStr.substring(0, self.data.formulaStr.length - cLength);
            self.data.customInputStr = oValue;
            if (self.data.customInputStr.length > 0) {
                if (calcType !== CalcResultType.NUMBER) {
                    self.addFormula("'" + oValue + "'", "'" + oValue + "'");
                } else {
                    self.addFormula(oValue, oValue);
                }
            }
            oui.getById("calc-textArea").render();
        },
        clearCalc: function (cfg) {
            var self = this;
            self.data.displayStr = "";
            self.data.formulaStr = "";
            oui.getById("calc-textArea").render();
        },
        //字段单击
        fieldClick: function (cfg) {
            var $li = $(cfg.el);
            var fieldId = $li.attr("fieldId");
            var fieldName = $li.html();
            var isSub = $li.attr("isSub");//是否是明细表字段
            var fieldDataType = $li.attr("dataType");
            var self = this;
            // if (self.data.resultType + "" === CalcResultType.NUMBER + "") {//结果字段是数值字段
            //     if (fieldDataType + "" !== CalcResultType.NUMBER + "") {
            //         oui.getTop().alert("请选择数字字段");
            //     }
            // }

        },
        //字段双击
        fieldDblClick: function (cfg) {
            var self = this;
            var $li = $(cfg.el);
            var fieldId = $li.attr("fieldId");
            var fieldName = $li.html();
            var isSub = $li.attr("isSub");//是否是明细表字段
            var fieldDataType = $li.attr("dataType");
            if (self.data.resultType + "" === CalcResultType.NUMBER + "") {//结果字段是数值字段
                if (fieldDataType + "" !== CalcResultType.NUMBER + "") {
                    oui.getTop().alert("请选择数字字段");
                    return;
                }
            }
            self.addFormula(self.getFieldStr4Show(fieldName), self.getFieldStr4Calc(fieldId));
        },
        operateClick: function (cfg) {
            var self = this;
            var $el = $(cfg.el);
            var sign = $el.attr("sign");
            // var calcType = FormCalcBiz.bizCfg.calcType;
            // if ((calcType == I_CalcType.DATE || calcType == I_CalcType.DATETIME) && (sign == "+" || sign == "-")) {
            //     FormCalcBiz.addFormula4Sign4Date(sign);
            // } else {
            //     self.settingCustomInputValue("");
            self.addFormula(sign, sign);
            // }
        }
    };

    oui.biz.Tool.crateOrUpdateClass(CalcBiz);

})(window, window.oui);





