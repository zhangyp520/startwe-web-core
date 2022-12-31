/**
 * 获取当前页面上下文
 */
oui.getContextPath = function () {
    if (oui_context && oui_context.contextPath) {
        return oui_context.contextPath;
    }
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1) + "/";
    if (!oui_context) {
        oui_context = {};

    }
    oui_context.contextPath = result;
    return result;
};
var cssArray = [];
if (oui.os.mobile) {
    cssArray = [
        oui.getContextPath() + "res_common/third/swiper/swiper.css",//imagegroup 第三方资源
        oui.getContextPath() + "res_common/oui/ui/ui_phone/css/dialog.css",
        oui.getContextPath() + "res_common/oui/ui/ui_phone/css/control.css"
    ];
} else {
    cssArray = [
        oui.getContextPath() + "res_common/third/SuperSlide/css/slide.css",//imagegroup 第三方资源
        oui.getContextPath() + "res_common/oui/ui/ui_pc/css/pc-common.css",
        oui.getContextPath() + "res_common/oui/ui/ui_pc/css/dialog.css",
        oui.getContextPath() + "res_common/oui/ui/ui_pc/css/control.css",
        oui.getContextPath() + "res_common/oui/ui/ui_pc/controls/tree/css/tree.css",
        oui.getContextPath() + "res_common/oui/ui/ui_pc/controls/tips/css/tips.css",
        oui.getContextPath()+ "res_common/third/color-picker/css/spectrum.css",
        oui.getContextPath()+'res_common/third/shape/css/shape.css'
    ];
}

oui.require4notSort(cssArray,function(){},function(){},false);

var jsArray = [];

if(oui.os.mobile){
    jsArray.push(oui.getContextPath()+"res_common/third/jquery.tap/jquery.tap.js");
}

if(!oui.os.mobile){
    jsArray.push(
        oui.getContextPath()+"res_common/oui/ui/ui_pc/dialog/dialog.js"
    );
    jsArray.push( oui.getContextPath()+"res_common/oui/ui/ui_pc/controls/tips/tips.js");
//        jsArray.push(oui.getContextPath()+"res_common/oui/system/oui-print.js");
} else {
    jsArray.push(
        oui.getContextPath()+"res_common/oui/ui/ui_phone/dialog/dialog.js"
    );
}
jsArray.push(oui.getContextPath()+'res_common/third/color-picker/spectrum.js');
//    jsArray.push(oui.getContextPath()+'res_common/third/html2canvas/dist/html2canvas.js');
jsArray.push(oui.getContextPath()+"res_common/third/jquery-mousewheel-master/jquery.mousewheel.js");
jsArray.push(oui.getContextPath()+'res_common/third/export/exportFile.js');
jsArray.push(oui.getContextPath()+'res_engine/page_design/pc/js/page-design.js');
jsArray.push(oui.getContextPath()+'res_engine/page_design/pc/js/page-validate.js');
jsArray.push(oui.getContextPath()+'res_engine/page_design/pc/js/page-controls.js');
//    jsArray.push(oui.getContextPath()+'res_common/third/algebra/algebra-0.2.5.min.js');
//    jsArray.push(oui.getContextPath()+'res_common/third/shape_min/shape.min.js');
//    jsArray.push(oui.getContextPath()+'res_common/third/jquery.print/jQuery.print.js');
oui.require(jsArray,function(){
    var me = com.oui.absolute.AbsoluteDesign;
    me.init();
},function(){},false);






