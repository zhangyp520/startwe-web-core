
/*-----------------------------------------------
* 初始化内容区大小
*----------------------------------------------*/
$(document).ready(function ($){
    var skins = [//皮肤选项
        'skin-blue',
        'skin-black',
        'skin-red',
        'skin-yellow',
        'skin-purple',
        'skin-green',
        'skin-blue-light',
        'skin-black-light',
        'skin-red-light',

        'skin-yellow-light',
        'skin-purple-light',
        'skin-green-light'
    ];
    //-------------初始化右侧区域大小----------------------------------------
    var mainheight = $(this).contents().find("body").height() - $('.main-header').height() - 45;
    $('#content_iframe').height(mainheight);
    //判断是否被嵌套
    //self != top && (top.location.href = self.location.href);
});
/*--------------------------------------------
 * 窗口大小改变时，需要重设右侧内容区的大小
 *-------------------------------------------*/
$(window).resize(function (){
    var mainheight = $("#bodyAutoHeight").height() - $('.main-header').height() - 45//获取页面隐藏的div高度来计算整个窗体大小
    $('#content_iframe').height(mainheight);
});
window.onresize = function (){
    var iframeName = $('[name="content_iframe"]');
    var windowHei = $(window).height(),
        iframeTop = iframeName.offset().top;
    iframeName.each(function (){
        var isShow = $(this).css("display");
        if(isShow == "block"){
            iframeTop = $(this).offset().top;
        }
    });
    var iframeHei = windowHei - iframeTop + 'px';
    iframeName.css("height", iframeHei);
};

function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if(r != null) return unescape(r[2]);
    return null; //返回参数值
};

/**
 * 门户 选择你的问题
 */
(function (){
    if($('#systemData').length > 0){

        $('.system-question').click(function (){

            $('#systemData').toggle();
        });
        $("#systemData").mouseleave(function (){
            $(this).hide()
        });
        $(".j-fullScreen").on("click",function(){
            if($(this).hasClass("active")){
                var el = document.documentElement;
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                if (rfs) {
                    rfs.call(el);
                }
                else if (typeof window.ActiveXObject !== "undefined") {
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
                $(this).removeClass("active");
            }else{
                var el = document;
                var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;
                if (cfs) {
                    cfs.call(el);
                }
                else if (typeof window.ActiveXObject !== "undefined") {
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
                $(this).addClass("active");
            }
        })



        $(document).mouseup(function (e){
            var _con = $('#systemData');   // 设置目标区域
            if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
                $("#systemData").hide();
            }
        });
    }

})();
/**
 * 左侧菜单搜索
 */
(function (){
    $("body").on("click", ".menu-opt", function (){
        var b = $(this).parents(".wrapper-menu");
        var c="add-effect";
        var a = b.hasClass(c);
        if(a){
            b.removeClass(c)
        } else {
            b.addClass(c)
        }
    });
})();
/**
 * 添加
 * @param name
 * @param url
 */
window.addTab = function (name, url){
    window.tab.addTab({
        name: name,
        url: url,
        id: $.md5(name)
    })
};
/**
 * 更新
 * @param name
 * @param url
 */
window.updateTab = function (name, url){
    window.tab.updateTab({
        name: name,
        url: url,
        id: $.md5(name)
    })
};
/**
 * 关闭
 * @param name
 */
window.assignClose = function (name){
    window.tab.delete(
        $('.tabListContainer li[data-id="' + $.md5(name) + '"]').find('.tabClose')
    )
};
/**
 * 改变标题
 * @param name
 */
window.changeTitle = function (name){
    window.tab.changeTitle(name)
};
/**
 * 获取名字
 * @returns {jQuery}
 */
window.getName = function (){
    return $('.tabListContainer li.active').find('.tabNameText').text()
};
