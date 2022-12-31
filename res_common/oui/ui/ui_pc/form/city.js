/**
 * 城市选择组件
 * Created by YangH on 2018/11/13.
 */
(function (win, oui) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;

    //城市选择
    var City = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ',value,data,placeholder,validate';
        this.init = init;
        this.afterRender = afterRender;
    };

    City.FullName = "oui.$.ctrl.city";//设置当前类全名
    ctrl["city"] = City;//将控件类指定到特定命名空间下

    City.templateHtml = [];
    City.templateHtml[0] =
        '<input ' +
        ' id="{{id}}"' +
        ' type="text"' +
        ' class="oui-form"' +
        ' value="{{value }}"' +
        ' name="{{name}}"' +
        ' placeholder="{{placeholder}}"' +
        ' validate="{{validate}}"' +
        ' onfocus="oui.hideErrorInfo(this);"' +
        ' onkeyup="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);"' +
        ' />';

    var init = function () {
    };

    var afterRender = function(){
        var self = this;
        var $el = $(self.getEl());
        if (self.attr("right") !== "readOnly") {
            var input = $el.find('input')[0];
            if(!window.Vcity){
                oui.require([
                    oui.getContextPath()+'res_common/third/citySelect/pc/css/cityselect.css',
                    oui.getContextPath() + 'res_common/third/citySelect/cityData.js',
                    oui.getContextPath()+'res_common/third/citySelect/pc/js/cityselect.js'
                ],function () {
                    new Vcity.CitySelector({
                        input: input,
                        choose: function (value) {
                            self.attr("value", value);
                            self.triggerUpdate();
                            self.triggerAfterUpdate();
                            oui.validate($(self.getEl()).find('#' + self.attr('id'))[0]);
                        }
                    });
                });
            } else {
                new Vcity.CitySelector({
                    input: input,
                    choose: function (value) {
                        self.attr("value", value);
                        self.triggerUpdate();
                        self.triggerAfterUpdate();
                        oui.validate($(self.getEl()).find('#' + self.attr('id'))[0]);
                    }
                });
            }
        }
    };

})(window, oui);





