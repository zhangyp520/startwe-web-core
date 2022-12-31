/**
 * 地理位置控件
 * Created by oui on 2016/3/23.
 */
(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var Lbs = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        this.init = init;
        this.getPosition = getPosition;
        this.afterRender = afterRender;
        this.getData4DB = getData4DB;
        this.clearContent = clearContent;
        this.exampleChange = exampleChange;
    };
    ctrl["lbs"] = Lbs;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    Lbs.FullName = "oui.$.ctrl.lbs";//设置当前类全名 静态变量

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Lbs.templateHtml = [];
    Lbs.templateHtml[0] = '<input type="hidden" validate="{{validate}}" id="{{id}}" name="{{name}}" value="{{value}}" />\
                           <div class="lbs-info {{if value && value.length > 0}}lbs-info-left{{/if}}" onclick="oui.getByOuiId({{ouiId}}).getPosition(this);">\
                           <div class="lbs-item">{{if value && value.length > 0}}{{=value}}{{else}}点击获取位置{{/if}}</div>\
                           </div>\
                           <i class="form-delete-info" onclick="oui.getByOuiId({{ouiId}}).clearContent(this);" style="display: {{if value && value.length > 0}}block{{else}}none{{/if}};"></i>';

    Lbs.templateHtml4Map =
        '<div class="lbs-map-area">' +
        '<oui-map id="map_{{ouiId}}" name="map_{{name}}" location="{{=location }}" onSearch="true" centerIsFixed="true" ></oui-map>' +
        '</div>' +
        '<div class="lbs-map-footer">' +
        '<oui-form type="multiselect" id="sel_{{ouiId}}" name="sel_{{name}}" onAfterUpdate="oui.getTop().oui.getPageParam(\'lbs_{{ouiId}}_callback\')" value="1" data=\'[{id:1,value:1,display:"地址信息"},{id:2,value:2,display:"经纬度"}]\'></oui-form>' +
        '<div class="lbs-map-example">示例：X省X市X区(县)X街道</div> '+
        '</div>' +
        '';
    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/
    /**
     * 初始化value
     */
    var init = function () {
        var data = this.attr('data');
        if (!data) {
            data = '{}';
        }
        data = oui.parseJson(data);
        if (this.attr("value")) {
            var data4DB = this.attr("data4DB");
            data4DB = oui.parseJson(data4DB || '{}');
            if (data4DB.longitude && data4DB.latitude) {
                data = $.extend(true, {}, data4DB);
            }
            // else {
            //     this.attr("value", "");
            // }
        }
        this.attr('data', data)
    };

    var afterRender = function () {
        template.helper("oui", oui);
    };

    var clearContent = function () {
        var self = this;
        var ouiId = self.attr("ouiId");
        self.attr("value", "");
        self.attr("data", "");
        self.render();
        self.triggerUpdate();
        self.triggerAfterUpdate();
    };

    /**
     * 实列按钮改变事件
     * @param control
     */
    var exampleChange = function(control){
        var mapDialog = oui.$.ctrl.dialog._MapDialog;
        if(mapDialog){
            var $example = $(mapDialog.getEl()).find(".lbs-map-example");
            var values = control.getValue();
            var address = "示例：";
            if(!values || values.indexOf("1") >= 0){
                address += "X省X市X区(县)X街道";
            }
            if (values.indexOf("2") >= 0) {
                address += "(经度:00.00;纬度:00.00)";
            } else {
                address = "示例：X省X市X区(县)X街道";
            }
            $example.html(address);
        }
    };

    /**
     * 点击更新 选中value
     */
    var getPosition = function (el) {
        if (this.attr("right") === "preview") {
            return false;
        }
        var self = this;
        var ouiId = self.attr("ouiId");
        var otherAttrs = this.attr("otherAttrs") || "{}";
        var allowLocation = oui.getJsonAttr(otherAttrs, 'allowLocation');

        if (allowLocation === "true" || allowLocation) {
            oui.getTop().oui.alert("请在手机上使用该功能!");
        } else {
            if (!self.renderMapFunc) {
                self.renderMapFunc = template.compile(Lbs.templateHtml4Map);
            }
            var html = self.renderMapFunc({
                ouiId: ouiId,
                name: self.attr("name"),
                location: "true"//模版传入true,会出现 第二次不渲染 boolean true的问题
            });

            var mapDialog = oui.getTop().oui.showHTMLDialog({
                title: "地理位置",
                contentStyle: 'width:70%;height:90%',
                content: html,
                actions: [
                    {
                        text: "确定",
                        action: function () {
                            var $el = $(self.getEl());
                            var map = mapDialog.getWindow().oui.getById("map_" + ouiId);
                            var values = mapDialog.getWindow().oui.getById("sel_" + ouiId).getValue();
                            map.getCurrentShowMarker(function (currentMarker) {
                                if (currentMarker) {
                                    var address = "";
                                    if(!values || values.indexOf("1") >= 0){
                                        address = currentMarker.info;
                                    }
                                    if (values.indexOf("2") >= 0) {
                                        address += "(经度:" + currentMarker.lng + ";纬度:" + currentMarker.lat + ")";
                                    } else {
                                        address = currentMarker.info;
                                    }
                                    // var positionStr = currentMarker.info;
                                    self.attr("value", address);
                                    var data = {longitude: currentMarker.lng + "", latitude: currentMarker.lat + ""};
                                    self.attr("data", data);//oui.parseString(data) // 用对象JMY-3558
                                    mapDialog.hide();
                                    self.render();
                                    oui.validate($el.find('#' + self.attr('id'))[0]);
                                    self.triggerUpdate();
                                    self.triggerAfterUpdate();
                                } else {
                                    oui.getTop().oui.alert("请选择地点.");
                                }
                            });
                        }
                    },
                    {
                        text: "取消",
                        cls: "oui-dialog-cancel",
                        action: function () {
                            mapDialog.hide();
                        }
                    }
                ]
            });
            var $mapElDialogEl = $(mapDialog.getEl());
            $mapElDialogEl.find(".oui-dialog-bd").addClass("oui-class-lbs-map-dialog");
            oui.getTop().oui.setPageParam("lbs_"+ouiId + '_callback', function () {
                if(mapDialog){
                    var multiSelect = oui.getTop().oui.getById("sel_"+self.attr("ouiId"));
                    var $example = $(mapDialog.getEl()).find(".lbs-map-example");
                    var values = multiSelect.getValue();
                    var address = "示例：";
                    if(!values || values.indexOf("1") >= 0){
                        address += "X省X市X区(县)X街道";
                    }
                    if (values.indexOf("2") >= 0) {
                        address += "(经度:00.00;纬度:00.00)";
                    } else {
                        address = "示例：X省X市X区(县)X街道";
                    }
                    $example.html(address);
                }
            });

            oui.getTop().oui.parse();
        }
        return false;
    };

    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var data = oui.parseJson(this.attr("data") || {});
        data4DB.longitude = data.longitude;
        data4DB.latitude = data.latitude;
        return data4DB;
    };

    /*******************************控件类的自定义函数 end******************************************/
})(window);





