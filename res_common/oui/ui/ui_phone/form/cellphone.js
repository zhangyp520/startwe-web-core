/**
 * Created by oui on 2016/3/31.
 */
(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var CellPhone = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ',placeholder,otherAttrs,checkMsgCode';

        this.clearContent = clearContent;
        this.focus = focus;
        this.blur = blur;

        this.validate = validate;
        this.isCheckMsgCode = isCheckMsgCode;
        this.sendCode = sendCode;
        this.updateCode = updateCode;
        this.init = init;
        this.timer4sendCode = timer4sendCode;
        this.getData4DB = getData4DB;
        this.showVerify = showVerify;
    };

    CellPhone.FullName = "oui.$.ctrl.cellphone";//设置当前类全名
    ctrl["cellphone"] = CellPhone;//将控件类指定到特定命名空间下

    CellPhone.templateHtml4readOnly = [];
    CellPhone.templateHtml4readOnly[0] = '<a href="tel:{{value}}">{{value}}</a>';
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(CellPhone,'edit4ReadOnly,edit4View','0',CellPhone.templateHtml4readOnly[0]);

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    CellPhone.templateHtml = [];
    CellPhone.templateHtml[0] = '<input id="{{id}}" onfocus="oui.hideErrorInfo(this);" validate="{{validate}}" onblur="oui.getByOuiId({{ouiId}}).blur({{ouiId}});" onfocus="oui.getByOuiId({{ouiId}}).focus({{ouiId}});" style="{{fieldStyle}}" placeholder="{{placeholder}}" class="oui-form" name="{{name}}" type="tel" value="{{value}}" {{=commonEvent}} /><i onTap="oui.getByOuiId({{ouiId}}).clearContent(this,\'{{ouiId}}\');" id="form_delete_info_btn_{{ouiId}}" class="form-delete-info"></i>\
            {{if oui.getByOuiId(ouiId).isCheckMsgCode()}}\
            <div class="oui-cellphone-check">\
                <input id="checkMsgCode{{id}}" class="check-msg-code" type="text" validate="{{checkMsgCodeValidate}}" value="{{code}}" onblur="oui.getByOuiId({{ouiId}}).updateCode(this);" oninput="oui.getByOuiId({{ouiId}}).updateCode(this);"   class="oui-cellphone-validate-code" value="" placeholder="请输入手机验证码"/>\
                <button class="oui-cellphone-resend-btn" onclick="oui.getByOuiId({{ouiId}}).showVerify(this)">点击发送</button>\
                <span class="oui-cellphone-resend" style="display: none"><b class="timeout">60</b>s后重新获取</span>\
            </div>\
            {{/if}}';
    /***********************************控件事件***********************************/

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
        //$("#form_delete_info_btn_"+ouiId).hide();
    };
    var validate = function () {
        var el = this.getEl();
        var targetEl = $(el).find('#' + this.attr('id'))[0];
        var isCheck = oui.validate(targetEl);
        if (!isCheck) {
            return false;
        }
        if (this.isCheckMsgCode()) {
            var $msgCodeEl = $(el).find('input.check-msg-code')[0];
            isCheck = oui.validate($msgCodeEl);
            if(!isCheck){
                return false;
            }
        }
        return true;
    };

    /**
     * 判断控件是否需要验证码
     */
    var isCheckMsgCode = function(){
        var otherAttrs = this.attr('otherAttrs');
        otherAttrs = oui.parseJson(otherAttrs ||"{}");
        var checkMsgCode = this.attr('checkMsgCode');
        if(checkMsgCode =='true' || (checkMsgCode ===true)){
            return true;
        }else if(checkMsgCode =='false' || (checkMsgCode ===false)){
            return false;
        }else if(otherAttrs.checkMsgCode){ //需要校验手机验证码
            return true;
        }
        return false;
    };

    var init = function () {
        var data = this.attr('data');
        if(data){
            if(typeof data=='string'){
                data = oui.parseJson(data);
            }
            this.attr('data',data);

        }else{
            data = {};
            this.attr('data',data);
        }
        var code = data.code ||"";
        this.attr('code',code);
        var validate = this.attr('validate');
        validate = oui.parseJson(validate || "{}");
        var otherAttrs = this.attr('otherAttrs');
        otherAttrs = oui.parseJson(otherAttrs || "{}");

        var checkMsgCodeValidate = {};
        var isCheckMsgCode = this.isCheckMsgCode();
        if(isCheckMsgCode){ //校验 手机短信验证码 不能为空
            validate.require = true;
            checkMsgCodeValidate.require=true;
            checkMsgCodeValidate.checkMsgCode=true;
            checkMsgCodeValidate.require_error_msg="手机验证码不能为空";
            checkMsgCodeValidate.checkMsgCode_error_msg="手机验证码不能为空";

            checkMsgCodeValidate.failMode = validate.failMode ||'';
            checkMsgCodeValidate.msgPosEl =validate.msgPosEl ||'';
            checkMsgCodeValidate.msgPos =validate.msgPos ||'';
        }
        validate.cellphones = otherAttrs.cellphones || "";
        validate = oui.parseString(validate);
        this.attr('validate', validate);
        checkMsgCodeValidate = oui.parseString(checkMsgCodeValidate);
        this.attr('checkMsgCodeValidate',checkMsgCodeValidate);
    };

    /**
     * 获取手机验证码
     */
    var sendCode = function (el) {
        var verifyObj = oui.getVeriyObject();
        if((!verifyObj) ||(!verifyObj.getValidate())){
            oui.getTop().oui.alert('极验校验不成功');
            return ;
        }
        if (this.attr('right') == 'design' || this.attr('right') == 'preview') {
            return;
        }
        /**首先校验手机号码的正确性 */
        var $cellEl = $(this.getEl());
        var targetEl = $cellEl.find('#' + this.attr('id'))[0];
        var isCheck = oui.validate(targetEl);
        if (!isCheck) {
            return false;
        }
        if (this.isCheckMsgCode()) {
            if (!this.attr('value')) {
                oui.getTop().oui.alert('需要发送验证码的手机号码不能为空');
                return false;
            }
        }
        oui.setPageParam('ouiValidatePhone',this.attr('value'));
        oui.setPageParam('ouiValidateVerify',verifyObj.getValidate());
        $(el).hide();
        var _self = this;
        $cellEl.find('span.oui-cellphone-resend').show();
        var sendingReason = oui.getJsonAttr(_self.attr('otherAttrs'), 'sendingReason') || 'cellphoneControl';
        oui.sendPhoneCode(_self.attr('value'), sendingReason);
        this.timer4sendCode();
    };

    /*** 点击发送按钮时触发极验显示***/
    /*** 点击发送按钮时触发极验显示***/
    var showVerify = function(sendBtnEl){
        var _self = this;
        var el = this.getEl();
        var targetEl = $(el).find('#'+this.attr('id'))[0];
        var isCheck = oui.validate(targetEl);
        if(!isCheck){
            return false;
        }
        //$(el).find('.oui-cellphone-check').addClass('display_none');
        oui.showVerifyHtml({
            container:'body',//移动端 都在body上
            product:'bind',
            userId:this.attr('value'),
            onReady:function(){
                /*** bind 模式自动显示 图片校验区域***/
                var o = oui.getVeriyObject();
                o&& o.verify();
            },
            onClose:function(){
                /** 关闭时清除dom区域***/
                oui.destroyVerify();
            },
            onSuccess:function(validateResult){
                //$(el).find('.oui-cellphone-check').removeClass('display_none');
                _self.sendCode(sendBtnEl);
                oui.destroyVerify();
            }
        });
    };
    var timer4sendCode = function () {
        var _self = this;
        var $el = $(this.getEl());
        this._time = oui.getJsonAttr(this.attr('otherAttrs'), 'timeout') || 60;
        this._timer = window.setInterval(function () {
            $el.find('span.oui-cellphone-resend').find('.timeout').html(_self._time);
            _self._time--;
            if (_self._time < 0) {
                window.clearInterval(_self._timer);
                _self._timer = null;
                $el.find('button.oui-cellphone-resend-btn').show();
                $el.find('span.oui-cellphone-resend').hide();
            }
        }, 1000);
    };
    /**
     * 验证 手机号码正确性，并且验证手机验证码的正确性
     */
    var updateCode = function (codeEl) {
        if (this.attr('right') == 'design' || this.attr('right') == 'preview') {
            return;
        }
        var code = $(codeEl).val();
        this.attr('code', $.trim(code));
        var isCheck = this.validate();
        if (!isCheck) {
            return false;
        }
    };


    var getData4DB = function(){
        var data4DB = Control.getProtoType().getData4DB.call(this);
        if(this.isCheckMsgCode()){
            data4DB.code = this.attr('code');
        }
        return data4DB;
    };

    /** 极验功能 开始***/
    oui.destroyVerify=function(){
        $('#div_id_embed').remove();
    };
    /** 获取极验组件对象 *****/
    oui.getVeriyObject = function(){
        if(!win.gt_captcha_obj){
            /** 默认参数空对象， TODO 等待 前后端 短信发送功能联调好后 注释掉当前 if判断******/
            return {
                getValidate:function(){
                    return {}
                }
            }
        }
        return win.gt_captcha_obj;
    };
    /** 显示极验 的html
     * isLogin,
     * container
     * onSuccess(validate)
     *
     * *****/
    oui.showVerifyHtml = function(params){

        var html = '' +
            '<div id="div_id_embed" class=".div_id_embed"></div>';
        params = params ||{};
        if(params.container){
            $(params.container).append(html);
        }else{
            $(document.body).append(html);
        }

        params = params ||{};
        var url = oui.getContextPath()+"verifyCode.do?method=generateVerifyCode";
        oui.getData(url,{
            userId: params.userId ||""
        },function(res){
            initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: res.gt,
                product: params.product||'popup',
                challenge: res.challenge,
                offline: !res.success,
                new_captcha: res.new_captcha
            }, function (captchaObj) {
                win.gt_captcha_obj = captchaObj;
                captchaObj.appendTo("#div_id_embed");
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj.onSuccess(function () {
                    //console.log('校验成功'+oui.parseString(config));
                    var verifyOnSuccess = params.onSuccess ||"";
                    verifyOnSuccess&&verifyOnSuccess(captchaObj.getValidate(),captchaObj);
                    //if($("#getsms")!=null){
                    //    $("#getsms").removeAttr("disabled");
                    //}
                });
                captchaObj.onReady(function(){
                    params.onReady&&params.onReady();
                });
                captchaObj.onClose(function(){
                    params.onClose && params.onClose();
                });
            });
        });
    };
    /** 极验功能 结束***/
})(window);





