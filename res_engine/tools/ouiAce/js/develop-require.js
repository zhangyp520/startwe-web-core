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
cssArray.push(oui.getContextPath()+"res_apps/common/css/index.css");
cssArray.push(oui.getContextPath()+'res_common/third/shape/css/shape.css'); //画图组件
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
/* 画图组件所需***/
jsArray.push(oui.getContextPath()+'res_common/third/algebra/algebra-0.2.5.min.js');
jsArray.push(oui.getContextPath()+'res_common/third/shape_min/shape.min.js');
oui.require(jsArray,function(){
    /** 默认不缓存 myidea 所需资源***/
    oui.require([
        oui.getContextPath()+'res_common/oui/ui/ui_pc/controls/tips/tips.js',
        oui.getContextPath()+"res_engine/tools/ouiAce/ace/ace.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/ace/ext-language_tools.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/ace/ext-statusbar.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/ace/ext-static_highlight.js",
        oui.getContextPath()+"res_common/third/jquery.zTreeV3.5/js/jquery.ztree.core.js",
        oui.getContextPath()+"res_common/third/jquery-scrollbar-master/jquery.scrollbar.min.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/zip/zip.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/zip/mime-types.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/js/zip-tool.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/js/beautify.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/js/HTML-Beautify.js",
        oui.getContextPath()+"res_engine/tools/ouiAce/js/myidea.js"
    ],function(){
        var MyIdea = oui.myidea.MyIdea;
        MyIdea.buildLayout();
    });
},function(){},true);
