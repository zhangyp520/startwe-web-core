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
cssArray.push(oui.getContextPath()+"res_apps/common/font/iconfont/iconfont.css");

cssArray.push(oui.getContextPath()+"res_apps/common/css/login.css");
cssArray.push(oui.getContextPath()+"res_apps/common/css/register.css");

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


oui.require(jsArray,function(){
    oui.require([oui.getContextPath()+"res_apps/account/js/account.js"],function(){
        var me = com.oursui.models.account.web.AccountController;
        me.init();
    });
},function(){},true);
