Array.prototype.remove = function (a, b) {
    var c = this.slice((b || a) + 1 || this.length);
    return this.length = 0 > a ? this.length + a : a, this.push.apply(this, c);
};

Array.prototype.getIndex = function (a) {
    var d, b = this.toString(), c = b.indexOf(a);
    return c >= 0 ? (d = new RegExp("((^|,)" + a + "(,|$))", "gi"), b.replace(d, "$2@$3").replace(/[^,@]/g, "").indexOf("@")) : -1;
};

(function (a, b) {
    com.startwe.models.portal.web.Tab = function (a, c) {
        this.event = a, this.left = 0, this.allList = [], this.iframe = c, this.allPostion = 0,
            this.idList = [], this.init = function () {
            var a = "<div class='tabContainer'>";
            a += "<div class='tabList'><ul class='tabListContainer' id='tabList'>", a += "</ul></div>",
                a += "<div class='tabMenu fa fa-ellipsis-h'></div></div>", b(this.event).append(a),
                b("body").append('<div id="popup_menu"><ul><li data-class="refresh"><i class="fa fa-refresh"></i>刷新本页</li><li data-class="closeLeft"><i class="fa fa-toggle-left"></i>关闭左边</li><li data-class="closeRight"><i class="fa fa-toggle-right"></i>关闭右边</li><li data-class="closeOther"><i class="fa fa-window-close"></i>关闭其他</li><li data-class="closeSelf"><i class="fa fa-window-close-o"></i>关闭自己</li></ul></div>'),
                b("body").append('<div id="more_menu"><p class="moreCloseAll">关闭所有</p><ul></ul></div>'),
                this.bindEvent();
        };
        this.isInArry = function (a, b) {
            for (var c = 0; c < b.length; c++) if (a === b[c]) return !0;
            return !1;
        };
        this.updateTab = function (a) {
            this.addTab(a);
        };
        this.changeTitle = function (a) {
            var c = this.event.find("#tabList li.active").index();
            this.event.find("#tabList li.active").attr("data-name", a),
                this.event.find("#tabList li.active").attr("data-id", b.md5(a)),
                b("#" + this.idList[c]).attr("id", b.md5(a)),
                this.event.find("#tabList li.active .tabNameText").text(a),
                this.allList[c] = a, this.idList[c] = b.md5(a);
        };
        this.findUrl = function(url,oneMenu){
            url = url || (oneMenu?oneMenu.url:'');
            var targetUrl = url;
            if(url.indexOf(".tpl.html")>0 && (oneMenu)){ //模板加载
                //模板加载
                targetUrl = oui.getContextPath()+'portal.html';
                targetUrl = oui.setParam(targetUrl,'loadMenusUrl',oui.getParam('loadMenusUrl'));
                targetUrl = oui.addParams(targetUrl,{
                    iframeId: c.id,
                    url:url,
                    scripts:oui.parseString(oneMenu.scripts||[]),
                    initPath:oneMenu.initPath
                });
            }else if((url.indexOf('.vue.html')>0 || (url.indexOf('.art.html')>0)) && oneMenu){
                targetUrl = oui.getContextPath()+'portal4vue.html';

                targetUrl = oui.setParam(targetUrl,'loadMenusUrl',oui.getParam('loadMenusUrl'));
                targetUrl = oui.addParams(targetUrl,{
                    iframeId: c.id,
                    url:url,
                    scripts:oui.parseString(oneMenu.scripts||[]),
                    initPath:oneMenu.initPath||""
                });
                //模板加载
            }else {
                //普通页面
            }
            return targetUrl;
        };
        this.addTab = function (a) {
            a.menuId = a.menuId|| a.id;
            var d, e, f, c = b.extend({
                name: "index",
                // todo 初始化界面
                //url: "https://www.baidu.com",
                menuId:'',
                url: "",
                id: "index",
                urlcode: '',
                isAllowClose: !0,
                classNameDemo: 'menu-this-Class'
            }, a);

            var url = c.url ;
            var targetUrl =url;
            var menuId = c.menuId;
            var Portal = com.startwe.models.portal.web.PortalController;
            var menus = Portal.data.menus ||[];
            var oneMenu = oui.findOneFromArrayBy(menus,function(item){
                if(item.id == menuId){
                    return true;
                }
            });
            if(oneMenu){

                //oui.bindIframeReady($('iframe[id='+ c.id+']')[0],function(doc,contentWin,win,iframe){
                //});
            }
            if(url && oneMenu){
                if(url.indexOf(".tpl.html")>0){ //模板加载
                    //模板加载
                    targetUrl = oui.getContextPath()+'portal.html';
                    targetUrl = oui.setParam(targetUrl,'loadMenusUrl',oui.getParam('loadMenusUrl'));
                    targetUrl = oui.addParams(targetUrl,{
                        iframeId: c.id,
                        url:url,
                        scripts:oui.parseString(oneMenu.scripts||[]),
                        initPath:oneMenu.initPath
                    });
                }else if(url.indexOf('.vue.html')>0 || (url.indexOf('.art.html')>0)){
                    targetUrl = oui.getContextPath()+'portal4vue.html';
                    targetUrl = oui.setParam(targetUrl,'loadMenusUrl',oui.getParam('loadMenusUrl'));
                    targetUrl = oui.addParams(targetUrl,{
                        iframeId: c.id,
                        url:url,
                        scripts:oui.parseString(oneMenu.scripts||[]),
                        initPath:oneMenu.initPath||""
                    });
                    //模板加载
                }else{
                    //普通页面
                }
            }
            this.isAllowClose = c.isAllowClose, this.id = c.id, d = this.isInArry(c.id, this.idList),
                d ? (e = this.allList.getIndex(c.name),
                    this.event.find("#tabList li").eq(e).addClass("active").siblings().removeClass("active"),
                    this.getPostion(this.event.find("#tabList li").eq(e), this),
                    b("#" + this.event.find("#tabList li").eq(e).attr("data-id")).show().siblings("iframe").hide(),
                    this.refresh(c.id, targetUrl)) : (this.idList.push(c.id), this.allList.push(c.name),
                    this.fillTab(c.name, c.url, c.id, c.urlcode, c.classNameDemo, c.menuId), f = b("#bodyAutoHeight").height() - b(".main-header").height() - 45,

                    b("#content-wrapper").append('<iframe data-urlcode="' + c.urlcode + '" class="_iframe" id="' + c.id + '" src="' + targetUrl + '" style="width: 100%;height: ' + f + 'px;display:block" frameborder="0" scrolling="auto" name="content_iframe"></iframe>'),
                    b("#" + c.id).show().siblings("iframe").hide());


        };
        this.fillTab = function (a, b, c, urlcode, classNameDemo,menuId) {

            var e,
                d = '<li class="active ' + classNameDemo + '" data-urlcode="' + urlcode + '" data-name="' + a + '" data-menu-id="'+menuId+'" data-url=' + b + " data-id=" + c + " data-isAllowClose = " + this.isAllowClose + ">";
            d += '<a href="javascript:void(0)">', d += '<i class="refresh"></i><span class="tabNameText">' + a + "</span>",
            this.isAllowClose && (d += '<span class="tabClose"></span>'), d += "</a></li>",
                this.event.find("#tabList").find("li").removeClass("active"), this.event.find("#tabList").append(d),
                e = this.event.find("#tabList").find("li").eq(-1).position().left - (this.event.width() - this.event.find("#tabList").find("li.active").width()) + this.event.find(".tabMenu").innerWidth() - this.left,
            e > 0 && (this.left = -e, this.allPostion = -e, this.event.find("#tabList").stop(!0, !0).animate({
                marginLeft: "-" + e + "px"
            }, 200));
        };
        this.refresh = function (a, c) {
            b("#" + a).attr("src", c);
        };
        this.delete = function (a) {
            var c = b(a).parents("li").index(), d = b(a).parents("li").attr("data-id");
            _that.allList.remove(c), _that.idList.remove(c), c == _that.event.find("#tabList li.active").index() ? (_that.allPostion = _that.allPostion + b(a).parents("li").innerWidth() < 0 ? _that.allPostion + b(a).parents("li").innerWidth() : 0,
                c >= _that.allList.length ? (b(a).parents("li").prev().addClass("active").siblings().removeClass("active"),
                0 != b(a).parents("li").index() && _that.getPostion(b(a).parents("li").prev(), _that),
                    b("#" + b(a).parents("li").attr("data-id")).prev().show().siblings("iframe").hide()) : (b(a).parents("li").next().addClass("active").siblings().removeClass("active"),
                    _that.getPostion(b(a).parents("li").next(), _that), b("#" + b(a).parents("li").attr("data-id")).next().show().siblings("iframe").hide())) : (_that.allPostion = _that.allPostion + _that.event.find("#tabList li.active").innerWidth() < 0 ? _that.allPostion + _that.event.find("#tabList li.active").innerWidth() : 0,
                _that.getPostion(_that.event.find("#tabList .active"), _that)), b(a).parents("li").remove(),
                b("#" + d).remove();
        };
        this.bindEvent = function () {
            var tab = this;
            _that = this, this.event.find("#tabList").on("click", "li", function () {
                b(this).addClass("active").siblings().removeClass("active"), _that.getPostion(this, _that),
                    b("#" + b(this).attr("data-id")).show().siblings("iframe").hide();
            }), this.event.find("#tabList").on("click", ".refresh", function () {
                var a = b(this);
                var dataId = _that.event.find("#tabList li").eq(b(this).parents("li").index()).attr('data-menu-id');
                var oneMenu = oui.findOneFromArrayBy(com.startwe.models.portal.web.PortalController.data.menus,function(menu){
                    if(menu.id == dataId){
                        return true;
                    }
                });
                var url = tab.findUrl(_that.event.find("#tabList li").eq(b(this).parents("li").index()).attr("data-url"),oneMenu);
                b(this).addClass("getRefresh"), _that.event.find("#tabList li").eq(b(this).parents("li").index()).addClass("active").siblings().removeClass("active"),
                    _that.getPostion(_that.event.find("#tabList li").eq(b(this).parents("li").index()), _that),
                    b("#" + b(this).parents("li").attr("data-id")).attr("src", url),
                    setTimeout(function () {
                        a.removeClass("getRefresh");
                    }, 1e3);
            }),
                this.event.find("#tabList").on("click", ".tabClose", function (a) {
                    a.stopPropagation(), _that.delete(this);
                }),
                //右键绑定事件
                this.event.find("#tabList").on("contextmenu", "li", function () {
                    var $this = $(this);
                    var c, d;
                    $this.hasClass("demo_code") || $this.attr('data-urlcode') == 'undefined' ? $("#popup_menu").find("li").eq(0).hide() : $("#popup_menu").find("li").eq(0).show();
                    return "true" == b(this).attr("data-isAllowClose") ? b("#popup_menu").find('li[data-class="closeSelf"]').show() : b("#popup_menu").find('li[data-class="closeSelf"]').hide(),
                        c = b(this).offset().top + b(this).height(), d = b(this).offset().left, b("#popup_menu").attr("data-index", b(this).index()).css({
                        width: b(this).innerWidth() > 100 ? b(this).innerWidth() - 4 : "95px",
                        left: d + "px",
                        top: c + 2 + "px"
                    }).show(), !1;
                }), b(document).on("click", function () {
                b("#popup_menu").hide(), b("#more_menu").hide();
            }), this.iframe.on("click", this.iframe.contents(), function () {
                b("#popup_menu").hide(), b("#more_menu").hide();
            }), b("#popup_menu").on("click", "li", function () {

                var e, f, a = b(this).attr("data-class"), c = parseInt(b("#popup_menu").attr("data-index")),
                    d = _that.event.find("#tabList").find("li").eq(c);
                switch (d.addClass("active").siblings().removeClass("active"), a) {
                    case "refresh":
                        b("#" + d.attr("data-id")).attr("src", d.attr("data-url")).show().siblings("iframe").hide(),
                            b("#popup_menu").hide();
                        break;

                    case "closeLeft":
                        c > 0 && "true" == d.prev().attr("data-isAllowClose") && (_that.allList.remove(c - 1),
                            _that.idList.remove(c - 1), _that.getPostion(d, _that), b("#" + d.prev().attr("data-id")).remove(),
                            b("#" + d.attr("data-id")).show().siblings("iframe").hide(), d.prev().remove()),
                            b("#popup_menu").hide();
                        break;

                    case "closeRight":
                        c < _that.event.find("#tabList").find("li").length - 1 && "true" == d.next().attr("data-isAllowClose") && (_that.allList.remove(c + 1),
                            _that.idList.remove(c + 1), b("#" + d.next().attr("data-id")).remove(), b("#" + d.attr("data-id")).show().siblings("iframe").hide(),
                            d.next().remove()), b("#popup_menu").hide();
                        break;

                    case "closeOther":
                        for (_that.allList = [], _that.idList = [], e = 0; e < _that.event.find("#tabList").find("li").length; e++) f = _that.event.find("#tabList").find("li").eq(e).attr("data-isAllowClose"),
                            d.index() != e ? "true" == f ? b("#" + _that.event.find("#tabList").find("li").eq(e).attr("data-id")).remove() : (_that.allList.push(_that.event.find("#tabList").find("li").eq(e).attr("data-name")),
                                _that.idList.push(_that.event.find("#tabList").find("li").eq(e).attr("data-id"))) : (_that.allList.push(_that.event.find("#tabList").find("li").eq(e).attr("data-name")),
                                _that.idList.push(_that.event.find("#tabList").find("li").eq(e).attr("data-id")));
                        d.siblings('li[data-isAllowClose="true"]').remove(), b("#popup_menu").hide(), b("#" + d.attr("data-id")).show().siblings("iframe").hide(),
                            _that.event.find("#tabList").css({
                                marginLeft: "0px"
                            });
                        break;

                    case "closeSelf":
                        c + 1 >= _that.allList.length ? (d.prev().addClass("active").siblings().removeClass("active"),
                            b("#" + d.attr("data-id")).prev().show().siblings("iframe").hide()) : (d.next().addClass("active").siblings().removeClass("active"),
                            b("#" + d.attr("data-id")).next().show().siblings("iframe").hide()), b("#" + d.attr("data-id")).remove(),
                            _that.allList.remove(c), _that.idList.remove(c), b("#popup_menu").hide(), d.remove();
                        break;

                    default:
                        b("#popup_menu").hide();
                }
            }), b(".tabMenu").on("click", function (a) {
                var c, d;
                for (a.stopPropagation(), c = "", d = 0; d < _that.allList.length; d++) c += '<li><i class="fa fa-navicon icon"></i>' + _that.allList[d],
                "true" == _that.event.find("#tabList").find("li").eq(d).attr("data-isAllowClose") && (c += '<span class="fa fa-close tabListClose"><span>'),
                    c += "</li>";
                b("#more_menu").find("ul").empty().append(c), b("#more_menu").css({
                    top: b(this).offset().top + b(this).innerHeight(),
                    left: b(this).offset().left - 200 + b(this).innerWidth()
                }).toggle();
            }), b("#more_menu").on("click", ".moreCloseAll", function () {
                _that.idList = [], _that.allList = [], _.each(_that.event.find("#tabList").find("li"), function (a) {
                    console.log(a), "true" !== b(a).attr("data-isAllowclose") ? (_that.allList.push(b(a).attr("data-name")),
                        _that.idList.push(b(a).attr("data-id")), b(a).addClass("active").siblings().remove("active"),
                        b("#" + b(a).attr("data-id")).show()) : (b(a).remove(), b("#" + b(a).attr("data-id")).remove());
                });
            }), b("#more_menu").find("ul").on("click", "li .tabListClose", function (a) {
                a.stopPropagation();
                var c = b(this).parents("li").index();
                c == _that.event.find("#tabList li.active").index() ? (_that.allPostion = _that.allPostion + _that.event.find("#tabList li").eq(c).innerWidth() < 0 ? _that.allPostion + _that.event.find("#tabList li").eq(c).innerWidth() : 0,
                    c + 1 >= _that.allList.length ? (_that.event.find("#tabList li").eq(c - 1).addClass("active").siblings().removeClass("active"),
                        _that.getPostion(_that.event.find("#tabList li").eq(c - 1), _that), b("#" + _that.event.find("#tabList li").eq(c - 1).attr("data-id")).show().siblings("iframe").hide()) : (_that.event.find("#tabList li").eq(c + 1).addClass("active").siblings().removeClass("active"),
                        _that.getPostion(_that.event.find("#tabList li").eq(c + 1), _that), b("#" + _that.event.find("#tabList li").eq(c + 1).attr("data-id")).show().siblings("iframe").hide())) : (_that.allPostion = _that.allPostion + _that.event.find("#tabList li.active").innerWidth() < 0 ? _that.allPostion + _that.event.find("#tabList li.active").innerWidth() : 0,
                    _that.getPostion(_that.event.find("#tabList .active"), _that)), _that.allList.remove(c),
                    _that.idList.remove(c), b("#" + _that.event.find("#tabList li").eq(c).attr("data-id")).remove(),
                    b("#more_menu").hide(), _that.event.find("#tabList li").eq(c).remove(), b(this).parents("li").remove();
            }), b("#more_menu").find("ul").on("click", "li", function () {
                _that.event.find("#tabList li").eq(b(this).index()).addClass("active").siblings().removeClass("active"),
                    _that.getPostion(_that.event.find("#tabList li").eq(b(this).index()), _that), b("#" + _that.event.find("#tabList li").eq(b(this).index()).attr("data-id")).show().siblings("iframe").hide();
            }), b("body").on("resize", function () {
                _.map(_that.idList, function (a) {
                    console.log(b(document.body).height() - b(".main-header").height() - 45 + "px"),
                        b("#" + a).css("height", b(document.body).height() - b(".main-header").height() - 45 + "px");
                });
            });
        };
        this.getPostion = function (a, c) {
            var d = b(a).position().left, e = c.event.width();
            b(a).width(), d > e / 2 ? (c.left = c.left - (d - e / 2), c.allPostion >= c.left && (c.left = c.allPostion),
                b(a).parents("ul").animate({
                    marginLeft: c.left + "px"
                })) : e / 2 >= d && (c.left = c.left - (d - e / 2), c.left >= 0 && (c.left = 0),
                b(a).parents("ul").animate({
                    marginLeft: c.left + "px"
                }));
        };
    };
    $('.main-sidebar,.childrenBar').on("click", ".tabBtn", function () {
        com.startwe.models.portal.web.Tab.tab.addTab({
            name: $(this).attr('data-name'),
            url: $(this).attr('data-href'),
            menuId:$(this).attr('data-id'),
            id: $.md5($(this).attr('data-id')),
            isAllowClose: true,
            urlcode: $(this).attr('data-hrefcode')
        });
        $('.childrenBar').hide();
    });

    $('.wrapper').on('click', '.childrenBar  .treeview', function (e) {
        e.stopPropagation();
        if ($(this).find('ul.treeview-menu')) {
            $(this).find('ul.treeview-menu').toggle()
        }
    })
    $(".childrenBar").on("mouseleave", function () {
        $(this).hide();
    });
    //$('.faster-sidebar').on("click", ".workBench", function () {
    //    com.startwe.models.portal.web.Tab.tab.addTab({
    //        name: '工作台',
    //        url: 'https://www.baidu.com/',
    //        id: 'edit',
    //        isAllowClose: false
    //    })
    //})
})(oui.ns('com.startwe.models.portal.web'), jQuery);
