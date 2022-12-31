!(function (Adapter) {
    /** 配置 第三方 手写签章插件 的适配器*****/
    Adapter.jSignature = {
        //渲染类型对应的接口实现
        /** 配置 第三方资源的资源路径，按需加载****/
        findRequirePaths: function () {
            var arr = [oui.getContextPath() + "res_common/third/signature/jSignature.min.js"];
            if (oui.browser.ie) {
                try {//ie10以下场景
                    if (parseInt(oui.browser.ie) < 10) {
                        arr = [
                            oui.getContextPath() + 'res_common/third/signature/flashcanvas.js',
                            oui.getContextPath() + "res_common/third/signature/jSignature.min.js"
                        ];
                    }
                } catch (er) {
                }
            }
            return arr;
        },
        hasRequire: function () {
            var flag = false;
            //签章，默认在最顶层弹出 htmlDialog显示，所以判断最顶层是否存在 当前这个第三方签章组件的签章对象
            if (typeof oui.getTop().$.fn.jSignature != 'undefined') {
                flag = true;
            }
            return flag;
        },
        /** 控件对象销毁触发***/
        destroy: function (dom) {
            oui.getTop().$(dom).jSignature('destroy');
        },
        /*** 应用于控件的 初始化方法****/
        init: function (control) {
            var showType = control.attr('showType');
            showType = parseInt('showType');
            var lineHeight = control.attr('lineHeight') || '10';
            lineHeight = parseInt(lineHeight);
            var option = {
                width: control.attr('width') || '100%',
                height: control.attr('height') || '100%',
                color: control.attr('color') || "#000",
                lineWidth: lineHeight
            };
            control.setOptionByRenderType(option);
        },
        render: function (dom, option) {
            oui.getTop().$(dom).jSignature('init', option);
        },
        reset: function (dom) {
            oui.getTop().$(dom).jSignature('reset');
        },
        confirm: function (dom) {
            var data = oui.getTop().$(dom).jSignature('getData', 'image');
            return data;
        }
    };
})(oui.createPlugin('signature'));//plugin名 为 signature,表示为 该插件下的 适配器





