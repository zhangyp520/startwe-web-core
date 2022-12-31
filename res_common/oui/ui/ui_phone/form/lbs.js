/**
 * 地理位置控件
 * Created by oui on 2016/3/23.
 */
(function (win, oui) {
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
        '<oui-map id="map_{{ouiId}}" name="map_{{name}}" location=\'{{=location }}\' onSearch="true" centerIsFixed="true" ></oui-map>' +
        '</div>' +
        '<div class="lbs-map-footer">' +
        '<oui-form type="multiselect" onAfterUpdate="oui.getByOuiId({{ouiId}}).exampleChange" id="sel_{{ouiId}}" name="sel_{{name}}" value="1" data=\'[{id:1,value:1,display:"地址信息"},{id:2,value:2,display:"经纬度"}]\'></oui-form>' +
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
        this.attr('data', data);
        this.attr("first",true);
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


    var afterRender = function () {
        template.helper("oui", oui);
        var self = this;
        var value = self.attr("value") || '';
        var validate = self.attr("validate");
        validate = oui.parseJson(validate || '{}');
        if (validate['autoPosition'] + '' === 'true' && (value === '') && self.attr("right") !== 'edit4ReadOnly' && self.attr("right") !== 'readOnly' && self.attr("first") + '' === "true") {
            if (!oui.bridge.clientReadyState) {
                oui.getEvent().once("clientReady", function () {
                    self.getPosition(null, true);
                    self.attr("first",false);
                });
            } else {
                self.getPosition(null, true);
                self.attr("first",false);
            }
        }
    };

    var clearContent = function () {
        var self = this;
        var ouiId = self.attr("ouiId");
        self.attr("value", "");
        self.attr("data", "");
        self.attr("first",false);
        self.render();
        self.triggerUpdate();
        self.triggerAfterUpdate();
    };

    var convertFrom = function (position, type, callback) {
        var self = this;
        var _newPosition = null;
        if (oui.appType.qing || oui.appType.enterpriseKdweibo) {
            _newPosition = {
                longitude: position[0],
                latitude: position[1]
            };
            callback && callback(_newPosition);
        } else {
            self.mapApi.convertFrom(position, type, function (location) {
                callback && callback(location);
            });
        }
    };

    var getMapApi = function (callback) {
        var self = this;
        if (self.MapApiObj) {
            callback && callback(self.MapApiObj);
        } else {
            var ApiObj = oui["_" + oui.MapApiConfig.MapApiName];
            if (!ApiObj) {
                oui.require4notSort([
                    oui.getContextPath() + oui.MapApiConfig.BaseUrl + oui.MapApiConfig.MapApiName + ".js"
                ], function () {
                    //重新执行afterRender
                    callback && callback(oui["_" + oui.MapApiConfig.MapApiName]);
                });
            } else {
                self.MapApiObj = ApiObj;
                callback && callback(ApiObj);
            }
        }
    };

    /**
     * 点击更新 选中value
     */
    var getPosition = function (el, isAutoPosition) {
        if (this.attr("right") === "preview") {
            return false;
        }
        var self = this;
        var ouiId = self.attr("ouiId");

        var otherAttrs = this.attr("otherAttrs") || "{}";
        var allowLocation = oui.getJsonAttr(otherAttrs, 'allowLocation');
        var _progress = null;
        //
        var callback = function (result) {
            var positionStr = result.address;
            var position = result.location;
            self.attr("value", positionStr);
            var data = {
                longitude: position.lng + "",
                latitude: position.lat + ""
            };
            self.attr("data", data);
            //TODO 临时解决 table 新增，和修改同时执行在自动定位下会出现两个结果
            var $el = $(self.getEl());
            if($el.is("div") && $el.attr("ouiid") > 0){
                self.render();
                oui.validate($(self.getEl()).find('#' + self.attr('id'))[0]);
                self.triggerUpdate();
                self.triggerAfterUpdate();
            }
        };

        if (allowLocation === "true" || allowLocation || (isAutoPosition && self.attr("first"))) {//不允许手动标注
            _progress = oui.progress("定位中...");
            oui.getLocation(function (res) {
                // res = {
                //     lng:108.222,
                //     lat:30.222
                // };
                if (res) {
                    getMapApi.call(self, function (ApiObj) {
                        ApiObj.ready(function () {
                            self.mapApi = new ApiObj(null, {
                                initEnd: function (api) {
                                    self.mapApi = api;
                                    convertFrom.call(self, [res.longitude, res.latitude], "gps", function (c) {
                                        self.mapApi.locationConvert2Address({
                                            lng: c.longitude,
                                            lat: c.latitude
                                        }, function (result) {
                                            if (result.status) {
                                                callback({
                                                    location: {
                                                        lng: c.longitude,
                                                        lat: c.latitude
                                                    },
                                                    address: result.address
                                                });
                                            } else {
                                                // callback({
                                                //     location: {
                                                //         lng:108.222,
                                                //         lat:30.222
                                                //     },
                                                //     address: '测试'
                                                // });
                                                oui.alert(oui.parseString(result));
                                            }
                                            _progress && _progress.finish && _progress.finish();
                                        });
                                    });
                                }
                            });
                        });
                    });
                } else {//TODO 考虑使用api自带的定位
                    _progress && _progress.finish && _progress.finish();
                    oui.toast('定位失败!');
                }
            });
        } else {
            _progress = oui.progress("定位中...");
            oui.getLocation(function (res) {
                _progress && _progress.finish && _progress.finish();
                if (!self.renderMapFunc) {
                    self.renderMapFunc = template.compile(Lbs.templateHtml4Map);
                }
                var location = "true";

                var showDialog = function () {
                    var html = self.renderMapFunc({
                        ouiId: ouiId,
                        name: self.attr("name"),
                        location: location//模版传入true,会出现 第二次不渲染 boolean true的问题
                    });

                    var mapDialog = oui.getTop().oui.showHTMLDialog({
                        title: "地理位置",
                        center: false,
                        isClose: false,
                        contentStyle: 'width:640px;height:90%',
                        content: html,
                        actions: [
                            {
                                text: "取消",
                                cls: "oui-dialog-cancel",
                                action: function () {
                                    mapDialog.hide();
                                    return false;
                                }
                            }, {
                                text: "确定",
                                action: function () {
                                    // var map = mapDialog.getWindow().oui.getById("map_" + ouiId);
                                    var $multiSel = $mapElDialogEl.find("#control_sel_" + ouiId);
                                    var values = oui.getByOuiId($multiSel.attr("ouiId")).getValue();
                                    var $map = $mapElDialogEl.find("#control_map_"+ouiId);
                                    var mapOuiId = $map.attr("ouiId");
                                    var map = oui.getByOuiId(mapOuiId);
                                    // var map = oui.getById("map_" + ouiId);
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
                                            callback({
                                                address: address,//currentMarker.info,
                                                location: {
                                                    lng: currentMarker.lng,
                                                    lat: currentMarker.lat
                                                }
                                            });
                                            mapDialog.hide();
                                        } else {
                                            oui.getTop().oui.alert("请选择地点.");
                                        }
                                    });
                                    return false;
                                }
                            }
                        ]
                    });
                    oui.$.ctrl.dialog._MapDialog = mapDialog;
                    var $mapElDialogEl = $(mapDialog.getEl());
                    $mapElDialogEl.find(".oui-dialog-bd").addClass("oui-class-lbs-map-dialog");
                    oui.parse({
                        container:mapDialog.getEl()
                    });
                };

                if (res) {
                    location = oui.parseString({
                        lng: res.longitude,
                        lat: res.latitude
                    });
                    getMapApi.call(self, function (ApiObj) {
                        ApiObj.ready(function () {
                            self.mapApi = new ApiObj(null, {
                                initEnd: function (api) {
                                    self.mapApi = api;
                                    convertFrom.call(self, [res.longitude, res.latitude], "gps", function (c) {
                                        location = oui.parseString({
                                            lng: c.longitude,
                                            lat: c.latitude
                                        });
                                        showDialog();
                                    });
                                }
                            });
                        });
                    });
                } else {
                    showDialog();
                }
            });
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
})(window, oui);





