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


    oui.showCalcDialog4Require = function (options) {
        var jsVersion;
        if (oui_context && oui_context.js_version) {
            jsVersion = oui_context.js_version;
        } else {
            jsVersion = "?jv=" + new Date().getTime();
        }
        var calcDialog = oui.getTop().oui.showUrlDialog({
            url: oui.getContextPath() + 'res_common/oui/ui/ui_pc/dialog/calc-dialog.html' + jsVersion,
            title: "计算设置",
            contentStyle: 'width: 650px;height: 80%;max-height:550px;',
            actions: [
                {
                    text: "取消",
                    cls:"oui-dialog-cancel",
                    action: function () {
                        calcDialog.hide();
                    }
                },
                {
                    text: "确定",
                    action: function () {
                        //TODo 校验
                        var calcDialogWindow = calcDialog.getWindow();
                        var CalcBiz = calcDialogWindow.com.oui.calc.CalcBiz;
                        var formulaStr = CalcBiz.getFormulaStr();
                        var calcDisplayStr = CalcBiz.getDisplayStr();
                        var reg = /(\+|\-|\*|\/|\()$/g;
                        if (formulaStr) {
                            if (reg.test(formulaStr)) {
                                oui.getTop().oui.alert("公式非法，请检查公式");
                                return false;
                            }
                            var regLeft = /\(/g;
                            var regRight = /\)/g;
                            var leftKs = formulaStr.match(regLeft) || [];
                            var rightKs = formulaStr.match(regRight) || [];
                            if (leftKs.length !== rightKs.length) {
                                oui.getTop().oui.alert("公式非法，请检查公式");
                                return false;
                            }
                            if (options.checkLoop) {
                                //TODO 先不校验
                            }
                        }
                        options.callback && options.callback({
                            calcName: "",//计算式名称
                            formulaStr: formulaStr,
                            displayStr: calcDisplayStr
                        });
                        calcDialog.hide();
                    }
                }
            ]
        });
        calcDialog.attr("dialogOptions", options);
        calcDialog.attr("oui_context", oui_context);
        oui.getTop().oui.$.ctrl.dialog.calcDialog = calcDialog;
    };

})(window, window.oui);





