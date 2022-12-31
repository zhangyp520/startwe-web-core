var cssArray = [];
if (oui.os.mobile) {
    cssArray = [//TODO mobile
    ];
} else {
    cssArray = [ //TODO PC
    ];
}

//css资源 顺序需要倒叙
oui.require4notSort(cssArray,function(){},function(){},false);

var jsArray = [];

if(oui.os.mobile){//移动端 tap 事件
    jsArray.push(oui.getContextPath()+"res_common/third/jquery.tap/jquery.tap.js");
}

if(!oui.os.mobile){//TODO mobile
    //jsArray.push(
    //    oui.getContextPath()+"res_common/oui/ui/ui_pc/dialog/dialog.js"
    //);
} else {//TODO PC
    //jsArray.push(
    //    oui.getContextPath()+"res_common/oui/ui/ui_phone/dialog/dialog.js"
    //);
}

/** ie适配器***/
if(oui.browser.ie || oui.browser.isEdge){
    jsArray.push([oui.getContextPath()+'res_engine/portal/js/portal-ie-adapter.js']);
}
oui.require(jsArray,function(){
    /** 默认不缓存 portal加载资源***/
    oui.require([oui.getContextPath()+'res_engine/portal/js/portal.js'],function(){
        var me = com.oui.portal.PortalController;
        me.init();
    });//业务资源不做缓存
},function(){},true);//需要缓存的资源


