
!(function (win, $) {
    var PortalController = {
        "package": "com.startwe.models.portal.web",
        "class": "PortalController",
        data:{},
        init:function(){
            var me = this;
            template.helper('PortalController',this);
            me.loadMenus();
        },
        findRootMenus:function(){
            var me = this;
            var menus = me.data.menus||[];
            var arr = oui.findManyFromArrayBy(menus,function(item){
                if((item.id==item.parentId)||(!item.parentId)){
                    if(!item.defaultNotShow){
                        return true;
                    }
                }
            });
            return arr;
        },
        findChildMenus:function(id){
            var me = this;
            var menus = me.data.menus||[];
            var arr = oui.findManyFromArrayBy(menus,function(item){
                if(item.parentId == id){
                    if(!item.defaultNotShow){
                        return true;
                    }
                }
            });
            return arr;
        },
        loadMenus:function(){

            var me = this;
            var path = oui_context.checkUrl;
            var userId = oui.cookie("userId");
            var tokenId = oui.cookie("tokenId");
            var loadMenusUrl = oui.getParam('loadMenusUrl');
            var loginUrl = oui.getContextPath()+'res_apps/account/login.html';
            loginUrl = oui.setParam(loginUrl,'loadMenusUrl',loadMenusUrl);
            if((!tokenId) || (!tokenId)){
                win.location.href=loginUrl;
                return;
            }
            var iframeId = oui.getParam('iframeId');
            oui.getData(path,{
                userId:userId,
                tokenId:tokenId
            },function(res){
                if(!res.success){
                    win.location.href=loginUrl;
                }else{
                    if(loadMenusUrl){
                        oui.getData(loadMenusUrl,{},function(res){
                            var menus = res.menus||[];

                            me.data = {
                                clickName:oui.os.mobile?'tap':'click',
                                inIframe:iframeId,
                                menus:menus
                            };
                            oui.progress.hide();
                            me.bindEvents();
                            oui.parse({
                                callback:function(){
                                    //进入项目首页
                                    com.startwe.models.portal.web.PortalMenu.buildMenusByTree(menus);
                                }
                            });
                        },'加载中...');
                    }else{
                        var menus = res.menus||[];

                        me.data = {
                            clickName:oui.os.mobile?'tap':'click',
                            menus:menus
                        };
                        oui.progress.hide();
                        me.bindEvents();
                        oui.parse({
                            callback:function(){
                                var go2url = oui.getParam('go2url');

                                if(go2url=='project-list'){
                                    var circleId='';//TODO 圈子id
                                    com.startwe.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project-list.tpl.html",{
                                        circleId:circleId,
                                        projectListUrl:oui.getContextPath()+'com.startwe.models.project.web.ProjectController.query.biz'
                                    });
                                    return;
                                }

                                //默认进入startwe，查看所有圈子
                                var one = oui.findOneFromArrayBy(menus,function(item){
                                    if(item.url =='res_apps/circle/circle-startwe-list.tpl.html'){
                                        return true;
                                    }
                                });
                                com.startwe.models.portal.web.PortalMenu.buildMenusByTree(menus);
                            }
                        });
                    }

                }
            },'加载中',function(res){
                oui.progress.hide();//失败直接退出
                win.location.href=loginUrl;
            });
        },
        bindEvents:function(){
            var me = this;
            me.bindBeforeUnloadEvents();
        },
        /** 页面离开事件****/
        bindBeforeUnloadEvents: function () {
            var me = this;
            window.onbeforeunload = function(e){
                try{
                    if (me.changed) {
                        return (e || window.event).returnValue = '有信息未保存';
                    }
                }catch(err){}
                return ;
            };
        },
        findProjectName:function(pro){
            return pro?pro.name||'':'';
        },
        findMenuById:function(id){
            var me = this;
            var menus = me.data.menus||[];
            var currMenu = oui.findOneFromArrayBy(menus,function(item){
                if(item.id == id){
                    return true;
                }
            });
            return currMenu;
        },
        /**根据当前菜单Id获取当前菜单所在的菜单树 ***/
        findPathMenusByMenuId:function(id){
            var me = this;
            var menus = me.data.menus||[];
            var currMenu = me.findMenuById(id);
            var menuPath = currMenu.menuPath;
            var ids = menuPath.split('/');
            ids.length = ids.length-1;
            if(ids.length<=0){
                return [];
            }
            var results = oui.findManyFromArrayBy(menus,function(item){
                if(ids.indexOf(item.id)>-1){
                    return true;
                }
            }) ||[];
            return results;
        },
        getData:function(){
            var me = this;
            return me.data;
        },
        /*** 对导航菜单进行转向****/
        event2doMenuAction:function(cfg){
            var menuId = $(cfg.el).attr('menu-id');
            var me = this;
            var menu = me.findMenuById(menuId);
            var params = oui.getPageParam('_menu_page_'+menuId);//如果缓存中没有，则从原始菜单中获取参数
            me.doActionByMenuUrl(menu.url,params||menu.params);
        },
        doActionByMenuUrl:function(url,params){
            var me = this;
            var data = me.data||{};
            var menus = data.menus||[];
            var menu = oui.findOneFromArrayBy(menus,function(item){
                if(item.url){
                    if(item.url == url){
                        return true;
                    }
                    var tempUrl = item.url;
                    if(item.url.indexOf('?')>0){
                        tempUrl = item.url.substring(0,item.url.indexOf('?'));
                    }
                    if(url.indexOf(tempUrl)>-1){
                        return true;
                    }
                }

            });
            if(!menu){
                return;
            }
            me.doActionByMenuConfig(menu,params||menu.params);
        },
        /***
         * 删除某个script标签
         * @param urls
         */
        clearScriptTag:function(urls){
            if((!urls)||(!urls.length)){
                return ;
            }
            var scripts = document.getElementsByTagName('script');
            for(var i = 0; i < scripts.length; i++){//是否已加载
                var src =scripts[i].getAttribute('data-url') || scripts[i].src;
                src = src.substring(0,src.indexOf(oui_context.js_version));
                if(urls.indexOf(src)>-1){
                    scripts[i].parentNode.removeChild(scripts[i]);
                }
            }
        },
        doActionByMenuConfig:function(menuCfg,params,callback){
            console.info('doActionByMenuConfig');
            oui.setPageParam('urlParams',params||{});
            var me = this;
            var menu = menuCfg;
            var scripts = menu.scripts||[];
            var openType  = menu.openType||'inner';
            if(menu.action){
                menu.action();
            }else if(menu.url){
                if(openType =='inner'){
                    //内嵌模板打开

                    /***
                     * 根据模板配置 替换 某个容器里面的内容
                     * url,scripts,controller,initMethod,container,callback,params
                     * @param tplCfg
                     */
                    //oui.replaceByTplConfig({

                    //});
                    me.clearScriptTag(scripts);

                    oui.replaceByTplConfig({
                        url:menu.url,
                        scripts:menu.scripts||[],
                        container:'.pg-body',
                        callback:function(){
                            callback&&callback();
                        },
                        params:menu.params
                    });

                }else if(openType=='location'){//转向
                    //url转向
                    location.href = menu.url;
                }else if(openType=='openWindow'){
                    oui.openWindow({
                        url:oui.getContextPath()+menu.url,
                        openType:'_blank'
                    });
                    //新窗口打开
                }else if(openType =='htmlDialog'){
                    //htmlDialog 打开
                }else if(openType =='urlDialog'){
                    //urlDialog打开
                }else {
                    //暂时不支持其它方法打开
                    oui.getTop().oui.alert('暂时不支持[openType='+openType+']的打开方式');
                }
            }else{
                oui.getTop().oui.alert('菜单转向页面路径为空');
            }
        },
        /***
         * 执行菜单事件
         * @param cfg
         */
        event2doActionByMenu:function(cfg){
            var menuId = $(cfg.el).attr('menu-id');

            var me = this;
            var data = me.data||{};
            var menus = data.menus||[];
            var menu =oui.findOneFromArrayBy(menus,function(item){
                if(item.id ==menuId){
                    return true;
                }
            });
            var params = $(cfg.el).attr('menu-params');
            if(params){
                params = oui.parseJson(params);
            }else{
                params = {};
            }
            var $navMenu = $(cfg.el).closest('.pg-nav-menu');
            $navMenu.hide();
            me.doActionByMenuConfig(menu,params);
            setTimeout(function(){
                $navMenu.show();
            },300);
        },
        /*****
         * 添加菜单
         * @param menu
         */
        addMenu:function(menu){
            var me = this;
            var id = menu.id;
            if(!id){
                console.log('菜单id不能为空');
                return ;
            }
            var idx =-1;
            var one = oui.findOneFromArrayBy(me.data.menus,function(item,currIdx){
                if(item.id == menu.id){
                    idx = currIdx;
                    return true;
                }
            });
            if(one){
                me.data.menus[idx] = menu;//覆盖
            }else{
                me.data.menus.push(menu);//添加
            }
        },
        /***
         * 移除菜单
         * @param menuId
         */
        removeMenu:function(menuId){
            if(!menuId){
                return ;
            }
            var me  = this;
            oui.removeFromArrayBy(me.data.menus,function(item){
                if(item.id==menuId){
                    return true;
                }
            });
        }
    };
    PortalController = oui.biz.Tool.crateOrUpdateClass(PortalController);
})(window, jQuery);
