(function(win,$){
    oui.ns('com.startwe.models.portal.web');
    com.startwe.models.portal.web.PortalMenu  = function (menu, node) {
        this.menus = menu;
        this.node = node;
        this.html = '';
        this.initMenu = function () {
            if (undefined != this.menus ) {
                this.fillHtml();
                this.bindEvent();
            }
        }
        this.fillHtml = function () {
            var _this = this;
            _.each(_this.menus.data, _this.fillFirst);
            this.node.append(this.html);
        }
        this.fillFirst = function (data, isSecond) {
            var _this = this;
            if (data.children !== undefined && data.children.length !== 0) {
                this.html += '<li class="treeview">';
                if (undefined != data.menuUrl) {
                    this.html += '<a href="javascript:void(0)"  data-id="' + data.id + '"  data-name="' + data.menuName + '" data-hrefCode="' + data.menuUrlCode + '"  data-href="' + data.menuUrl + '" >';
                } else {
                    this.html += '<a href="javascript:void(0)"  data-id="' + data.id + '"    data-hrefCode="' + data.menuUrlCode + '"  data-name="' + data.menuName + '" >';
                }
                // todo 图标保留
                // this.html += '<i class="fa fa-caret-right pull-left"></i><i class="nav-icon file"></i>';
                this.html += '<i class="fa fa-caret-right pull-left"></i>';
                this.html += '<span>' + data.menuName + '</span>';
                this.html += '</a>';
                this.html += '<ul class="treeview-menu">';
                if (isSecond !== 'second') {
                    _.each(data.children, _this.fillSecond)
                } else {
                }
                this.html += '</ul>'
                this.html += '</li>'
            } else {
                this.html += '<li>';
                if (undefined != data.menuUrl) {
                    this.html += '<a class="tabBtn" href="javascript:void(0)" data-id="' + data.id + '" data-hrefCode="' + data.menuUrlCode + '" data-name="' + data.menuName + '" data-href="' + data.menuUrl + '">';
                } else {
                    this.html[this.index++] = '<a class="tabBtn" href="javascript:void(0)"  data-hrefCode="' + data.menuUrlCode + '"  data-id="' + data.id + '" data-name="' + data.menuName + '" data-href="">';
                }
                this.html += '<span>' + data.menuName + '</span>';
                this.html += '</a></li>';
            }
        }.bind(this)

        this.fillSecond = function (data) {
            if (data.children !== undefined && data.children.length !== 0) {
                this.html += '<li class="second_tree">';
                if (undefined != data.menuUrl) {
                    this.html += '<a href="javascript:void(0)"  data-id="' + data.id + '" data-hrefCode="' + data.menuUrlCode + '"   data-name="' + data.menuName + '"  data-href="' + data.menuUrl + '" >';
                } else {
                    this.html += '<a href="javascript:void(0)"  data-id="' + data.id + '"  data-hrefCode="' + data.menuUrlCode + '"   data-name="' + data.menuName + '" >';
                }

                this.html += '<span>' + data.menuName + '</span>';
                this.html += '<i class="fa fa-caret-right pull-right"></i>';
                this.html += '</a>';
                this.html += '<ul class="hide">';
                _.each(data.children, this.fillSecond)
                this.html += '</ul>'
                this.html += '</li>'
            } else {
                this.html += '<li class="second_tree">';
                if (undefined != data.menuUrl) {
                    this.html += '<a class="tabBtn" href="javascript:void(0)"  data-hrefCode="' + data.menuUrlCode + '"   data-id="' + data.id + '"  data-name="' + data.menuName + '"  data-href="' + data.menuUrl + '" >';
                } else {
                    this.html += '<a href="javascript:void(0)"   data-hrefCode="' + data.menuUrlCode + '"   data-id="' + data.id + '"  data-name="' + data.menuName + '" >';
                }
                this.html += '<span>' + data.menuName + '</span>';
                this.html += '</a>';
                this.html += '<ul class="treeview-menu">';
                this.html += '</ul>'
                this.html += '</li>'
            }
        }.bind(this)
        this.bindEvent = function () {
            var _this = this
            _this.node.on("click", '.second_tree', function () {
                _this.node.find('.second_tree ').removeClass('active')
                $(this).addClass('active')
                $('.childrenBar').empty().append('<i class="childIcon"></i><ul>' + $(this).find('ul').html() + '</ul>').show();
                if ($(this).offset().top <= $(window).innerHeight() / 2) {
                    $('.childrenBar .childIcon').removeClass('bottoms')
                    $('.childrenBar').css({
                        'bottom': 'auto', 'top': $(this).offset().top + 'px',
                        'left': $(this).offset().left + 11 + $(this).innerWidth() + 'px'
                    })
                } else {
                    $('.childrenBar .childIcon').addClass('bottoms')
                    $('.childrenBar').css({
                        'top': 'auto', 'bottom': $('body').height() - $(this).offset().top - $(this).height() + 'px',
                        'left': $(this).offset().left + 11 + $(this).innerWidth() + 'px'
                    })

                }
            })
        }
    };

    com.startwe.models.portal.web.Tab.tab = new com.startwe.models.portal.web.Tab($("#tab"), $('#content_iframe'));
    oui.isNullOrEmpty = function(id){
        return id == null || id == '' || id.length == 0;
    };
// 树结构重构
    com.startwe.models.portal.web.PortalMenu.list2tree= function(menus) {
        if (menus == null || menus.length < 1) {
            return [];
        }
        var datas = [],
            trees = {},
            ready_nodes = [],
            all_nodes = [];
        all_nodes = [].concat(menus);
        do {
            for (var i = 0; i < all_nodes.length; i++) {
                ready_nodes = [];
                var menu = all_nodes[i];
                if(menu.defaultNotShow){
                    continue;
                }
                //根节点
                if (oui.isNullOrEmpty(menu.parentId)) {
                    var node = {
                        "id": menu.id,
                        "menuName": menu.display,
                        "menuUrl": menu.url,
                        "children": []
                    };
                    datas.push(node);
                    trees[menu.id] = node;
                    continue;
                }
                var parentNode = trees[menu.parentId];
                if (parentNode != null) {
                    var node = {
                        "id": menu.id,
                        "pId": parentNode.id,
                        "menuName": menu.display,
                        "menuUrl": menu.url,
                        "children": []
                    }
                    parentNode.children.push(node);
                    trees[menu.id] = node;
                    continue;
                }
                ready_nodes.push(menu);
            }
            if (ready_nodes.length == all_nodes.length) {
                break;
            }
            all_nodes = [];
            ready_nodes.length > 0 && (all_nodes = [].concat(ready_nodes));
            ready_nodes = [];
        } while (all_nodes.length > 0)
        return datas;
    }

    com.startwe.models.portal.web.PortalMenu.buildMenusByTree = function(menus){
        var menuData = {
            'data': com.startwe.models.portal.web.PortalMenu.list2tree(menus)
        };
        try {
            new com.startwe.models.portal.web.PortalMenu(menuData, $('.sidebar-menu')).initMenu();
        } catch (e) {
            alert(e)
        }
        setTimeout(function () {
            var tab = com.startwe.models.portal.web.Tab.tab;
            tab.init();
            tab.addTab({
                name: '工作台',
                // todo 第一次进来 工作台
                url:'workbench.html',
                id: 'workbench',
                isAllowClose: false
            });

        }, 200)
    };
})(window,$);