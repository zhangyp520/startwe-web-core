var cssArray = [];
if (oui.os.mobile) {
    cssArray = [
        oui.getContextPath() + "res_common/oui/ui/ui_phone/css/dialog.css"
    ];
} else {
    cssArray = [
        oui.getContextPath() + "res_common/oui/ui/ui_pc/css/dialog1.6.css"
    ];
}
// cssArray.push(oui.getContextPath()+"res_common/third/bootstrap-3.3.7/css/bootstrap.min.css");
// cssArray.push(oui.getContextPath()+"res_apps/common/font/iconfont/iconfont.css");
// cssArray.push(oui.getContextPath()+"res_apps/common/css/index.css");
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
//jsArray.push(oui.getContextPath()+"res_apps/common/js/index.js");
oui.require(jsArray,function(){
    /** 默认不缓存 portal加载资源***/
    oui.require([oui.getContextPath()+'res_engine/portal/portal-runtime.js'],function(){
         
        var me = com.startwe.models.portal.web.PortalController; 
        me.init();
    });
},function(){},true);
