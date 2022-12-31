var cssArray = [];
if (oui.os.mobile) {
    cssArray = [
        oui.getContextPath() + "res_common/oui/ui/ui_phone/css/dialog.css"
    ];
} else {
    cssArray = [
        oui.getContextPath() + "res_common/oui/ui/ui_pc/css/dialog.css"
    ];
}

cssArray.push(oui.getContextPath()+"res_common/third/bootstrap-3.3.7/css/bootstrap.min.css");
cssArray.push(oui.getContextPath()+"res_common/third/editor/dist/summernote.css");
cssArray.push(oui.getContextPath()+"res_apps/common/font/iconfont/iconfont.css");
//css资源 顺序需要倒叙
oui.require4notSort(cssArray,function(){},function(){},false);

var jsArray = [];

if(oui.os.mobile){
    jsArray.push(oui.getContextPath()+"res_common/third/jquery.tap/jquery.tap.js");
}

if(!oui.os.mobile){
    jsArray.push(
        oui.getContextPath()+"res_common/oui/ui/ui_pc/dialog/dialog.js"
    );
} else {
    jsArray.push(
        oui.getContextPath()+"res_common/oui/ui/ui_phone/dialog/dialog.js"
    );
}
jsArray.push(oui.getContextPath()+"res_common/third/lazy-load/lazy-load-img.min.js");
jsArray.push(oui.getContextPath()+"res_common/third/bootstrap-3.3.7/js/bootstrap.min.js");
/** 编辑器代码***/
jsArray.push(oui.getContextPath()+"res_common/third/editor/dist/summernote.min.js");
jsArray.push(oui.getContextPath()+"res_common/third/editor/dist/lang/summernote-zh-CN.js");
oui.require(jsArray,function(){
    //私有资源暂时不缓存
    oui.require([oui.getContextPath()+"res_apps/circle/js/circle-startwe.js"],function(){
        var me = com.oursui.models.circle.web.Circle4StartweController4Load;
        me.init();
    });
},function(){},true);//公共资源默认缓存
