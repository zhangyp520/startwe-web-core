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

//cssArray.push(oui.getContextPath()+"res_common/third/bootstrap-3.3.7/css/bootstrap.min.css");
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
//jsArray.push(oui.getContextPath()+"res_common/third/bootstrap-3.3.7/js/bootstrap.min.js");
/** 编辑器代码***/
jsArray.push(oui.getContextPath()+"res_common/third/editor/dist/summernote.min.js");
jsArray.push(oui.getContextPath()+"res_common/third/editor/dist/lang/summernote-zh-CN.js");
jsArray.push(oui.getContextPath()+'res_engine/graph-common/js/tree-map.js');

var resourceUrls = [
    oui.getContextPath()+'res_common/third/html2canvas/dist/html2canvas.min.js',
    oui.getContextPath()+"res_engine/sys-design/js/sys-design.js"
];
oui.require(jsArray,function(){
    /** 默认不缓存 welcome加载资源***/
    oui.require(resourceUrls,function(){
        var me = com.oui.models.sys.web.SysController4Design;
        me.resourceUrls = resourceUrls.join(',').split(',');
        resourceUrls.length=0;
        resourceUrls =null;
        me.init();
    });//业务资源不做缓存
},function(){},true);//需要缓存的资源





