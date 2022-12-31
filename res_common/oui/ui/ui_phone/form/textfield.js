(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var Textfield = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ',placeholder,scanScript';

        this.clearContent = clearContent;
        this.focus = focus;
        this.blur = blur;
        this.validate = validate;
        this.openInputDialog = openInputDialog;
        this.init = init;
        this.scanQRCode = scanQRCode;
    };

    Textfield.FullName = "oui.$.ctrl.textfield";//设置当前类全名
    ctrl["textfield"] = Textfield;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Textfield.templateHtml = [];
    Textfield.templateHtml[0] = '{{if allowScan}}<i onTap="oui.getByOuiId({{ouiId}}).scanQRCode();" class="form-scanCode-info"></i>{{/if}}<input id="{{id}}" {{if allowScan && notAllowEditScan}}readOnly="readOnly" unselectable="on" "{{/if}} onfocus="oui.hideErrorInfo(this);" validate="{{validate}}" onblur="oui.getByOuiId({{ouiId}}).blur({{ouiId}});" onfocus="oui.getByOuiId({{ouiId}}).focus({{ouiId}});" style="{{fieldStyle}};{{if allowScan && notAllowEditScan}}pointer-events:none;{{/if}}" placeholder="{{placeholder}}" class="oui-form" name="{{name}}" type="text" value="{{value}}" {{=commonEvent}} /><i onTap="oui.getByOuiId({{ouiId}}).clearContent(this,\'{{ouiId}}\');" id="form_delete_info_btn_{{ouiId}}" class="form-delete-info"></i>';
    Textfield.templateHtml[1] = '\
        <input type="hidden" id="{{id}}" value="{{value}}" name="{{name}}">\
        <div class="textfiled-input" onTap="oui.getByOuiId({{ouiId}}).openInputDialog();">{{value}}</div>\
        <i class="right-arrow"></i>\
    ';
    /***********************************控件事件***********************************/


    var init = function () {
        var otherAttrs = oui.parseJson(this.attr("otherAttrs") || '{}');
        var notAllowEditScan = !!otherAttrs.notAllowEditScan;
        var allowScan = !!otherAttrs.allowScan;
        //是否允许扫码录入
        this.attr("allowScan", allowScan);
        //不允许编辑扫码结果
        this.attr("notAllowEditScan", notAllowEditScan);
        //扫码后处理脚本
        var scanScript = otherAttrs.scanScript || this.attr('scanScript');
        if (scanScript) {
            this.attr('scanScript', scanScript);
        }
        //连续扫码
        var continueScan = !!otherAttrs.continueScan;
        this.attr("continueScan", continueScan);
    };
    var scanQRCode = function () {
        var self = this;
        var scanScript = this.attr('scanScript');
        var continueScan = self.attr("continueScan");
        oui.scanQRCode('none', function (result) {
            var oldValue = self.attr("value");
            if (scanScript) {
                try {
                    var fun = oui.parseJson2Function(scanScript);
                    result = fun(result);
                    if (scanScript.returnType) {
                        if (typeof result !== scanScript.returnType) {
                            oui.getTop().oui.alert('扫码内容处理脚本执行错误,注意检测返回值类型为字符串，请联系管理员处理:' + oui.getFunctionStringByJson(scanScript));
                            return false;
                        }
                    }
                } catch (e) {
                    oui.getTop().oui.alert('扫码内容处理脚本执行错误，请联系管理员处理:' + oui.getFunctionStringByJson(scanScript));
                    return false;
                }
                self.attr("value", result);
            } else {
                self.attr("value", result);
            }
            //TODO JMY-11074企业版移动端：明细表填写时，扫码关联，切换表格式列表式后，扫码未带出关联的值，后续看看是否需要放开
            // var elId = self.attr("id");
            // if (elId.indexOf("subForm_table") > -1) {//控件在明细表中触发 选中当前行事件
            //     var tableOuiId = self.attr("tableOuiId");
            //     oui.getNS().SubForm && oui.getNS().SubForm.updateCurrentRow4ScanQRCode && oui.getNS().SubForm.updateCurrentRow4ScanQRCode(elId, tableOuiId);
            // }

            self.render();
            self.triggerUpdate();
            self.triggerAfterUpdate();
            //TODO 连续扫码，直接访问表单的代码，后面考虑如何解耦开发
            var continueScan = self.attr("continueScan");
            if (continueScan && (!oldValue || oldValue.length === 0)) {
                var $el = $(self.getEl());
                try {
                    var $table = $el.closest(".oui-class-tablegrid");//必须是表格式的
                    //在明细表中
                    if ($table.length > 0) {
                        var tableId = $table.attr("id");
                        var subFormId = tableId.replace("control_subForm_table_", "");
                        var controlId = self.attr("id");
                        var rowsStr = "rows";
                        var rowsIndex = controlId.indexOf(rowsStr);
                        var cellIndex = controlId.indexOf("cell");
                        var rowIndex = -1;
                        if (rowsIndex >= 0 && cellIndex >= 0) {
                            rowIndex = controlId.substring(rowsIndex + rowsStr.length, cellIndex);
                        }
                        var fieldName = self.attr("name");
                        var eventLabel = true;// 触发事件表示
                        var triggerNextScanQRCode = function () {
                            if (eventLabel) {
                                setTimeout(function(){//延迟扫码，防止扫码过快超过接口限制
                                    var row = oui.getNS().SubForm.addRowBySubFormId(subFormId, rowIndex, function () {
                                        setTimeout(function () {
                                            try {
                                                var nextControlValue = row[fieldName];
                                                var nextControlOuiId = nextControlValue['controlOuiId'];
                                                var nextControl = oui.getByOuiId(nextControlOuiId);
                                                eventLabel = false;
                                                nextControl.scanQRCode();
                                            } catch (e) {
                                                console.log("连续扫码添加明细表数据错误");
                                            }
                                        }, 100);
                                    });
                                },600);
                            }
                        };
                        var onAfterUpdate = self.attr("onAfterUpdate");
                        if (typeof onAfterUpdate === 'string' && onAfterUpdate.indexOf("BizForm.doAutoRelation") > 0) {
                            oui.getEvent().on("autoRelationComplete", function () {
                                triggerNextScanQRCode();
                            });
                        } else {
                            triggerNextScanQRCode();
                        }
                    }
                } catch (e) {
                    console.log("连续扫码添加明细表数据错误");
                }
            }

        });
        // 扫码按钮不穿透的话，表格的行事件有问题
        // return false;
    };

    var focus = function (ouiId) {
        Control.focus && Control.focus(ouiId);
        $("#form_delete_info_btn_" + ouiId).show();
    };

    var blur = function (ouiId) {
        Control.blur && Control.blur(ouiId);
        $("#form_delete_info_btn_" + ouiId).hide();
    };

    var clearContent = function (obj, ouiId) {
        var _c = oui.getByOuiId(ouiId);
        $(_c.getEl()).find("input").val('');
        _c.attr('value', '');
        _c.triggerUpdate();
        _c.triggerAfterUpdate();
        //$("#form_delete_info_btn_"+ouiId).hide();
    };
    var validate = function () {
        var el = this.getEl();
        var targetEl = $(el).find('#' + this.attr('id'))[0];
        return oui.validate(targetEl);
    };

    var openInputDialog = function () {
        var self = this;
        var otherAttrs = self.attr("otherAttrs");
        otherAttrs = oui.parseJson(otherAttrs);
        var validate = self.attr("validate");
        validate = oui.parseJson(validate);
        var title = otherAttrs.title || "";
        oui.showInputDialog(title, function (result) {
            self.attr("value", result);
            self.triggerUpdate();
            self.triggerAfterUpdate();
            $(self.getEl()).find(".textfiled-input").html(result);
            //return false;
        }, [{
            validate: validate,
            value: self.attr("value")
        }]);
        return false;
    };
})(window);





