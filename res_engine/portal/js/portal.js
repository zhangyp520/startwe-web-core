!(function (win, $) {
    /**
     * com.oui.portal.PortalController
     * 首页PortalController
     * **/
    var PortalController = {
        "package": "com.oui.portal",
        "class": "PortalController",
        data:{},
        init:function(){
            var me = this;
            me.data.clickName=oui.browser.mobile?'tap':'click';
            template.helper('PortalController',this);
            template.helper('oui',oui);
            var isIframeInclude = oui.getParam('isIframeInclude');
            var isChromeExt = oui.getParam('isChromeExt');
            if(isIframeInclude=='true'){
                isIframeInclude=true;
            }else{
                isIframeInclude = false;
            }
            if(isChromeExt =='true'){
                isChromeExt = true;
            }else{
                isChromeExt = false;
            }
            me.data.isChromeExt = isChromeExt;
            me.data.isIframeInclude = isIframeInclude;
            //加载系统再加载菜单
            me.loadSys(function(){
                //系统加载完成后，加载菜单
                me.loadMenus();
            });

        },

        /** 获取所有的主菜单*****/
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
        _data:function(){
            return this;
        },
        /*******
         * 根据主菜单找子菜单
         * @param id
         */
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
        hasChildMenus:function(id){
            var me = this;
            var menus = me.data.menus||[];
            var one = oui.findOneFromArrayBy(menus,function(item){
                if(item.parentId == id){
                    if(!item.defaultNotShow){
                        return true;
                    }
                }
            });
            return one;
        },
        /** 值改变后 更新当前系统，切换到指定系统 **/
        event2selectSys:function(cfg){
            var me = this;
            var selectedValue = cfg.el.value;
            me.data.sysId = selectedValue;
            var url = oui.getContextPath()+'index-1.html';
            url = oui.setParam(url,'contextPath',oui.getContextPath());
            url = oui.setParam(url,'sysId',selectedValue);
            url = oui.setParam(url,'isChromeExt',me.data.isChromeExt);
            url = oui.setParam(url,'isIframeInclude',me.data.isIframeInclude);

            oui.go4replace(url);
        },
        /**
         * 加载系统配置
         * */
        loadSys:function(callback){
            var me = this;
            var path = oui_context.sysUrl; //加载系统配置
            var userId = oui.cookie("userId");
            var tokenId = oui.cookie("tokenId");
            if(path){
                oui.getData(path,{
                    userId:userId,
                    tokenId:tokenId
                },function(res){
                    if(res.success && res.sys){
                        var sys = res.sys ||[];
                        //加载系统
                        me.data.sys = sys;
                    }
                    callback&&callback();
                },'加载中',function(res){
                    oui.progress.hide();
                    callback&&callback();
                });
            }else{
                //默认从本地系统中查询
                setTimeout(function(){
                    oui.db.sys_config.selectOne('root',function(res){
                        //处理树形结构
                        if(res){

                            oui.require([oui.getContextPath()+"res_engine/graph-common/js/tree-map.js"],function(){
                                var treeMap = me.newTreeMap(res);
                                var tempArr = com.oui.TreeMap.treeMap2array(treeMap);
                                var arr= [];
                                for(var i= 0,len=tempArr.length;i<len;i++){
                                    if(tempArr[i].id!='root'){
                                        var curr= tempArr[i];
                                        var menuPathArr = com.oui.TreeMap.getNodePath(treeMap,treeMap.map[curr.id]);
                                        var parentId = curr.parentId;
                                        if(parentId&&parentId =='root'){
                                            parentId = '';
                                        }
                                        arr.push({
                                            id:curr.id,

                                            isDesignMenu:true, //设计态设计产生的动态菜单
                                            display:curr.name,
                                            menuPath:menuPathArr.join('/'),
                                            parentId:parentId,
                                            icon:curr.icon,
                                            scripts:curr.scripts,
                                            url:curr.url
                                        });
                                    }
                                }
                                me.data.sys = arr;
                                if(arr.length){
                                    if((!me.data.sysId) || me.data.sysId=='root'){
                                        me.data.sysId = arr[0].id;
                                    }
                                }
                                callback&&callback();
                                console.log('自定义业务系统列表配置结束');
                            },function(){},true);

                        }else{
                            callback&&callback();
                        }

                    },function(){
                        callback&&callback();
                    });
                },10);

            }

        },
        /***
         * 加载所有的菜单
         */
        loadMenus:function(){
            var me = this;
            var path = oui_context.checkUrl;
            var userId = oui.cookie("userId");
            var tokenId = oui.cookie("tokenId");
            var loadMenusUrl = oui.getParam('loadMenusUrl');
            var loginUrl = oui.getContextPath()+'res_apps/account/login.html';
            loginUrl = oui.setParam(loginUrl,'loadMenusUrl',loadMenusUrl);
            if((!userId) || (!tokenId)){
                win.location.href=loginUrl;
                return;
            }
            var sysId = oui.getParam('sysId');
            if(!sysId){
                if(me.data.sys&&me.data.sys.length){
                    sysId=me.data.sys[0].id;
                }
            }
            if(!sysId){
                sysId='root';
            }
            me.data.sysId= sysId;
            oui.getData(path,{
                sysId:sysId,
                userId:userId,
                tokenId:tokenId
            },function(res){
                if(!res.success){
                    win.location.href=loginUrl;
                }else{
                    if(loadMenusUrl){
                        oui.getData(loadMenusUrl,{},function(res){
                            var menus = res.menus||[];
                            me.data.clickName = oui.os.mobile?'tap':'click';
                            me.data.menus = menus;
                            oui.progress.hide();
                            me.bindEvents();
                            oui.parse({
                                callback:function(){
                                    //进入项目首页
                                    var one =menus[0];
                                    if(one){
                                        me.doActionByMenuConfig(one,one.params);
                                    }
                                }
                            });
                        },'加载中...');
                    }else{
                        var menus = res.menus||[];
                        var loadMenuUrl4Design = res.loadMenuUrl4Design ||''; //加载自定义设计的菜单列表,默认没有则从本地存储获取
                        me.loadMenuUrl4Design = loadMenuUrl4Design;
                        var welcomeTab = oui.findOneFromArrayBy(menus,function(item){
                            //默认进入欢迎页
                            if(item.id =='welcome' || item.active){
                                return true;
                            }
                        });
                        me.data.clickName = oui.os.mobile?'tap':'click';
                        me.data.menus = menus;
                        if(welcomeTab){

                            me.data.activeTabId = welcomeTab.id;
                            me.data.tabs =[welcomeTab];
                        }else{
                            me.data.tabs = [];
                        }
                        me.data.isMultiTabs = true;

                        me.loadDesignMenus(function(){
                            //加载自定义设计的菜单列表后渲染 菜单列表
                            //加载完菜单之后 处理 当前系统信息和菜单信息 发送到父页面
                            if(me.data.isIframeInclude&&me.data.isChromeExt){ //chrome插件扩展，往父页面发送消息，用于显示系统列表和菜单列表
                                window.parent.postMessage({
                                    cmd:'cmd4load',//加载系统和系统菜单
                                    param:{
                                        sys:me.data.sys,
                                        menus:me.data.menus,
                                        sysId:me.data.sysId
                                    }
                                },'*');//跨域处理
                            }
                            oui.progress.hide();
                            me.bindEvents();
                            oui.parse({
                                callback:function(){
                                    //默认进入页面
                                    if(welcomeTab){
                                        me.doActionByMenuConfig(welcomeTab,welcomeTab.params);
                                    }
                                }
                            });
                        });

                    }

                }
            },'加载中',function(res){
                oui.progress.hide();//失败直接退出
                win.location.href=loginUrl;
            });
        },
        //刷新portal头部
        refreshHeader:function(){
            var me = this;
            me.loadSys(function(){
                var el = document.getElementById('main-header');
                var view = oui.getById("portal-view");
                var html = view.getHtmlByTplId('portal-view-header-tpl',{ });
                el.outerHTML = html;
            });
        },
        //刷新菜单列表
        refreshMenus:function(){
            var me = this;
            var menus = me.data.menus||[];
            //删除自定义的所有菜单
            oui.removeFromArrayBy(menus,function(item){
                if(item.isDesignMenu){
                    return true;
                }
            });
            //重新获取自定义的菜单列表
            me.loadDesignMenus(function(){
                var el = document.getElementById('portal-view-root-menu');
                var view = oui.getById("portal-view");
                var html = view.getHtmlByTplId('portal-view-root-menu-tpl',{ });
                el.outerHTML = html;

            });
        },
        /** 加载自定义菜单列表到内置菜单后面*/
        loadDesignMenus:function(callback){
            var me = this;
            var url = me.loadMenuUrl4Design;
            var userId = oui.cookie("userId");
            var tokenId = oui.cookie("tokenId");

            if(url){ //从 后台api加载菜单
                oui.getData(url,{
                    userId:userId,
                    tokenId:tokenId
                },function(res){
                    //成功回调
                    if(res.success){
                        var currMenus = res.menus ||[];
                        me.data.menus= me.data.menus.concat(currMenus);
                    }
                    callback&&callback();
                })
            }else{ //尝试从本地数据库获取，如果没有则为空数组，如果存在则合并本地数据库中的菜单到当前系统菜单中
                //加载菜单，尝试从当前系统对应的菜单获取
                var sysId = me.data.sysId;
                oui.db.sys_menu.selectOne(sysId,function(res){
                    //处理树形结构
                    if(res){

                        oui.require([oui.getContextPath()+"res_engine/graph-common/js/tree-map.js"],function(){
                            var treeMap = me.newTreeMap(res);
                            var tempArr = com.oui.TreeMap.treeMap2array(treeMap);
                            var arr= [];
                            for(var i= 0,len=tempArr.length;i<len;i++){
                                if(tempArr[i].id!='root'){
                                    var curr= tempArr[i];
                                    var menuPathArr = com.oui.TreeMap.getNodePath(treeMap,treeMap.map[curr.id]);
                                    var parentId = curr.parentId;
                                    if(parentId&&parentId =='root'){
                                        parentId = '';
                                    }
                                    arr.push({
                                        id:curr.id,

                                        isDesignMenu:true, //设计态设计产生的动态菜单
                                        display:curr.name,
                                        menuPath:menuPathArr.join('/'),
                                        parentId:parentId,
                                        icon:curr.icon,
                                        scripts:curr.scripts,
                                        url:curr.url,
                                        page:curr.page||null
                                    });
                                }
                            }

                            me.data.menus = me.data.menus.concat(arr);
                            callback&&callback();
                            console.log('自定义加载菜单结束');
                        },function(){},true);

                    }else{
                        callback&&callback();
                    }

                },function(){
                    callback&&callback();
                });
            }
        },
        newTreeMap:function(treeMapObj,idKey,parentIdKey,nameKey){
            var me = this;
            treeMapObj.idKey = idKey||'id';
            treeMapObj.parentIdKey = parentIdKey||'parentId';
            treeMapObj.nameKey = nameKey||'name';
            treeMapObj.clickName = oui.os.mobile?'tap':'click';
            var treeMap = com.oui.TreeMap.newTreeMap(treeMapObj);
            return treeMap;
        },
        /****
         * 根据treeMap 获取 节点Path
         * @param treeMap
         */
        getParentPath:function(treeMap,nodeId,arr){
            var me = this;
            var map = treeMap.map ||{};
            var node = map[nodeId];
            var parentId = node.parentId;
            if(!arr){
                arr =[];
            }
            if(parentId){
                me.getParentPath(treeMap,parentId,arr);
            }else{
                return arr;
            }
            return arr;

        },
        /****
         * 绑定事件
         */
        bindEvents:function(){
            var me = this;
            me.bindBeforeUnloadEvents();
            me.bindMessageEvents();
        },
        /***
         * 绑定消息监听
         */
        bindMessageEvents:function(){
            var me = this;
            /*
             * 消息监听
             */
            window.addEventListener("message", function(event) {
                var data = event.data;
                if(typeof data =='string'){
                    return;
                }
                if(typeof data =='object'){
                    if(data.callbackId){
                        if(data.cmd&&data.param){
                            me[data.cmd]&&me[data.cmd](data.param,event,data.callbackId);
                        }
                    }else{
                        if(data.cmd&&data.param){
                            me[data.cmd]&&me[data.cmd](data.param,event);
                        }
                    }

                }
            }, false);
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
        /**
         * 根据id找出菜单
         * @param id
         */
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
        findProjectName:function(pro){
            return pro?pro.name||'':'';
        },
        /**根据当前菜单Id获取当前菜单所在的菜单树 ***/
        findPathMenusByMenuId:function(id){
            var me = this;
            var menus = me.data.menus||[];
            var currMenu = me.findMenuById(id);
            if(!currMenu){
                return [];
            }
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
        /***
         * 获取当前数据
         * @returns {PortalController.data|{}}
         */
        getData:function(){
            var me = this;
            return me.data;
        },
        /*** 对导航菜单进行转向****/
        event2doMenuAction:function(cfg){
            var menuId = $(cfg.el).attr('node-menu-id');
            var me = this;
            var menu = me.findMenuById(menuId);
            var params = oui.getPageParam('_menu_page_'+menuId);//如果缓存中没有，则从原始菜单中获取参数
            me.doActionByMenuUrl(menu.url,params||menu.params);
        },

        /*****
         * 根据url和参数执行菜单跳转
         * @param url
         * @param params
         */
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
            var scripts = $('script[data-url]');
            for(var i = 0; i < scripts.length; i++){//是否已加载
                var src =scripts[i].getAttribute('data-url') || scripts[i].src;
                src = src.substring(0,src.indexOf(oui_context.js_version));
                if(urls.indexOf(src)>-1){
                    scripts[i].parentNode.removeChild(scripts[i]);
                    scripts[i]=null;
                }
            }
        },
        /****
         *
         *
         * 显示动态菜单
         * com.oui.portal.PortalController.showDynaMenu({url:'xxx/aaa/bbb.tpl.html',display:'BBB菜单名称'},{});
         * @param menuCfg
         * {
         *  url,//必填
         *  display, //必填
         *  id, //对于动态菜单,非必填
         *  menuPath,//对于动态菜单，非必填
         *  icon, //非必填
         *  openType //默认 inner
         * }
         * @param params
         */
        showDynaMenu:function(menuCfg,params){
            var me = this;
            var id ='';
            if(!menuCfg.id){
                //动态id规则
                id = 'oui-dyna-'+oui.getUUIDLong();
            }
            /**菜单对象 ***/
            var menu ={
                "id": id, /**菜单id **********/
                "menuPath": id,/** 菜单路径**********/
                "icon": "",/** 菜单自定义icon**********/
                "url": "", /** 菜单的模板路径url**********/
                "openType": "inner",/** 页面打开方式**********/
                "display": "动态页面:"+id
            };
            $.extend(true,menu,menuCfg);
            /** 没有配置菜单 脚本的情况，默认根据模板路径规则产生对应的js资源路径 ****/
            if((!menu.scripts)||(!menu.scripts.length)){
                var url = menu.url;
                menu.scripts = [];
                if(url){
                    /** 根据斜杠分割模板路径 **/
                    var strs = url.split('\/');
                    var fileName = strs[strs.length-1];
                    //获取模块名
                    var moduleName = fileName.substring(0,fileName.lastIndexOf('.tpl.html'));
                    //获取模块按需加载资源路径
                    var scriptRequireName = moduleName+'-require.js';
                    //更新 js资源路径
                    strs[strs.length-1] = 'js/'+scriptRequireName;
                    //产生脚本路径
                    var scriptUrl = strs.join('/');
                    if(scriptUrl.indexOf('/')!=0){
                        scriptUrl = '/'+scriptUrl;
                    }
                    //设置菜单配置的脚本路径
                    menu.scripts.push(scriptUrl);
                }
            }
            me.doActionByMenuConfig(menu,params);
        },
        /****
         * 根据菜单配置和参数进行跳转
         * @param menuCfg
         * @param params
         */
        doActionByMenuConfig:function(menuCfg,params){
            console.info('doActionByMenuConfig3')
            oui.setPageParam('urlParams',params||{});
            var me = this;
            var menu = menuCfg;
            var scripts = menu.scripts||[];
            var openType  = menu.openType||'inner';
            
            if(menu.action){
                menu.action();
            }else if(menu.url){//配置了页面url 直接通过url规则跳转
                if(openType =='inner'){
                    //内嵌模板打开

                    me.showContent(menuCfg);
                }else if(openType =='iframe'){
                    //通过iframe打开模板
                    me.showContent(menuCfg);
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
            }else if(menu.page){//判断当前菜单是否存在 页面设计，如果有则渲染
                //渲染页面
                me.showContent(menuCfg);
            }else{
                //oui.getTop().oui.alert('菜单转向页面路径为空');
            }
        },
        getTabTitleHtml:function(menu){
            //TODO 获取 页签标题
            var view = oui.getById("portal-view");

            var html = view.getHtmlByTplId('content-body-tab-label-tpl',{
                innerTab:menu
            });
            return html;
        },
        getTabContentHtml:function(menu){
            var view = oui.getById("portal-view");
            var html = view.getHtmlByTplId('content-body-tab-content-tpl',{
                innerTab:menu
            });
            return html;
        },
        /** 添加新页签**/
        addTab:function(menu){
            var me = this;
            var tabTitleHtml = me.getTabTitleHtml(menu);
            var tabContentHtml =me.getTabContentHtml(menu);
            $('.box-tabs').append(tabTitleHtml);
            $('.box-content').append(tabContentHtml);
            me.data.tabs.push(menu);
        },
        getTabController:function(menu){
            var $controler = $('[oui-controller]','.box-content [node-menu-id='+menu.id+']');
            var currController = null;
            if($controler&&$controler.length){
                var currControllerPath = $($controler[0]).attr('oui-controller');
                if(currControllerPath){
                    currController = oui.biz.Tool.getControllerClass(currControllerPath);
                }
            }
            return currController;
        },
        /***
         * 销毁菜单对应的控制器
         * @param menu
         * @param callback
         */
        destroyTabController:function(menu,callback){
            var me = this;
            var controller =me.getTabController(menu);
            if(controller&&controller.init){

                var pkg = controller.PACKAGE;
                var className = controller.CLASSNAME;
                var fullName = controller.FullName;
                if(!controller.destroy){
                    alert('类['+fullName+']没有实现销毁方法');
                    return;
                }
                if(controller.resourceUrls&&controller.resourceUrls.length){
                    me.clearScriptTag(controller.resourceUrls.concat(menu.scripts||[]));
                }
                var currView = controller.getView&&controller.getView();//获取当前被include的动态view
                var view =  this.getView(menu.id);//获取当前active的view
                var currTabId = view.currTabId;
                // 获取所有控制器并清理
                if(currView){
                    var $controllers = $('[oui-controller]','[oui-controller^=\''+currView.FullName+'\']');
                    var arr=[];
                    $controllers.each(function(){
                        arr.push(this.getAttribute('oui-controller'));
                    });
                    arr = arr.reverse();//倒叙处理
                    for(var i= 0,len=arr.length;i<len;i++){
                        try{

                            var controller = oui.util.eval(arr[i]);
                            if(controller){
                                var view =controller.getView();
                                var fullName = view.FullName;
                                view&&view.destroy();
                                if(fullName.indexOf('oui.routerView.refs')>=0){
                                    var paths = fullName.split('.');
                                    var end =  paths[paths.length-1];
                                    paths.length = paths.length-1;
                                    var start = paths.join('.');
                                    var pControl = oui.util.eval(start);
                                    pControl[end] = null;
                                    delete pControl[end];
                                }
                            }
                        }catch(err){
                        }
                    }

                }
                currView&&currView.destroy&&currView.destroy();

                if(currTabId &&this.refs&& this.refs[currTabId]){
                    var refs = view.refs ;
                    for(var k in refs){
                        refs[k].destroy&& refs[k].destroy();
                        refs[k]= null;
                        delete refs[k];
                    }
                    this.refs[currTabId] = null;
                    delete this.refs[currTabId];
                }

                controller.destroy&&controller.destroy(menu);

                //清理当前页签下的所有控件
                var refsInRouter = oui.routerView&&oui.routerView.refs||{};
                for(var k in refsInRouter){
                    var curr = refsInRouter[k];
                    if(oui.isEmptyObject(curr)){
                        refsInRouter[k]=null;
                        delete  refsInRouter[k];
                    }
                    if(curr&&curr._activeTabId &&(curr._activeTabId ==currTabId)){
                        if(curr._ouiId_){
                            oui.clearByOuiId(curr._ouiId_);
                        }
                        curr.destroy&&curr.destroy();
                        refsInRouter[k]=null;
                        delete refsInRouter[k];
                    }
                }
                //销毁 包缓存
                if(oui.NS(pkg)){
                    oui.NS(pkg)[className] =null;
                    delete oui.NS(pkg)[className];
                }


                //销毁 类缓存
                window.__jsclazz_.Clz_Data[fullName]=null;
                delete window.__jsclazz_.Clz_Data[fullName];

                //销毁 类创建状态缓存
                oui.Tool.creating[fullName]=false;
                delete oui.Tool.creating[fullName];
            }
            callback&&callback(menu);
        },
        /** 添加新页签**/
        removeTab:function(menu){
            var me = this;
            //删除页签前，需要销毁对应菜单的容器
            me.destroyTabController(menu);

            oui.clearByContainer('.box-content [node-menu-id='+menu.id+']');
            $('.box-tabs').find('[node-menu-id='+menu.id+']').remove();
            $('.box-content').find('[node-menu-id='+menu.id+']').remove();

            /** 获取上一次的索引位置 */
            var lastIdx = -1;
            oui.findOneFromArrayBy(me.data.tabs,function(item,index){
                if(item.id == menu.id){
                    lastIdx = index;
                    return true;
                }
            });
            /** 删除指定页签***/
            oui.removeFromArrayBy(me.data.tabs,function(item){
                if(item.id == menu.id){
                    return true;
                }
            });

            me.data.activeTabId ='';
            var targetMenu=null;
            if(lastIdx !=-1){
                /** 指定当前页签为 上一个页签*****/
                var targetIdx = lastIdx-1;
                if(targetIdx <0){//如果当前页签是第一个，则仍然显示第一个
                    targetIdx=0;
                }
                /** 索引在 页签中存在 则指定***/
                if(me.data.tabs[targetIdx] ){
                    targetMenu = me.data.tabs[targetIdx];
                    me.data.activeTabId = targetMenu.id||'';
                }
            }
            if(me.data.activeTabId&&targetMenu){
                me.showTab(targetMenu);
            }
        },
        /** 显示页签****/
        showTab:function(menu){
            //node-menu-id
            $('.tab-active').removeClass("tab-active");

            $('.tab-label[node-menu-id='+menu.id+']').addClass("tab-active");
            $('.pg-body[node-menu-id='+menu.id+']').addClass("tab-active");
        },
        /** 事件触发 页签打开***/
        event2showTabContent:function(cfg){
            var me = this;
            var data = me.data||{};
            var menus = data.menus||[];
            var menuId = $(cfg.el).attr('node-menu-id');
            var menu =oui.findOneFromArrayBy(menus,function(item){
                if(item.id ==menuId){
                    return true;
                }
            });
            if(!menu){
                var menuJson = $(cfg.el).attr('node-menu-json');
                if(!menuJson){
                    return
                }
                menu = oui.parseJson(menuJson);
            }
            me.showContent(menu);
        },
        /*** 显示菜单的url对应的内容到渲染区域中 ***/
        showContent:function(menu,isRefresh){

            var me = this;
            //菜单高亮
            $('li.node-menu.active','.sidebar-menu').removeClass('active');
            $('li.node-menu[node-menu-id='+menu.id+']','.sidebar-menu').addClass('active');
            if((!menu.url) && (!menu.page)){ //无url则不执行处理
                return ;
            }
            var lastMenuId = me.data.activeTabId;
            me.data.activeTabId = menu.id; //指定当前活动页签
            var container = '.pg-body'; //单标签默认替换位置
            //判断是否在已有页签中，如果存在则显示即可;如果不存在则添加新页签并显示
            var tabs = this.data.tabs ||[];
            var one = oui.findOneFromArrayBy(tabs,function(item){
                if(menu.id == item.id){
                    return true;
                }
            });

            //支持多标签
            if(me.data.isMultiTabs){
                container = '.pg-body[node-menu-id='+menu.id+']'; //多标签位置替换
                if(!one){ //不存在 页签,添加页签占位，后执行模板替换
                    me.addTab(menu);
                }else{
                    //如果已经打开页签，则判断是否需要强制刷新；如果强制刷新，则销毁缓存菜单，否则直接显示菜单；
                    if(isRefresh){
                        //销毁当前存在控制器
                        me.destroyTabController(menu);
                    }else{
                        //获取内容页渲染前的dom
                        var $ch = $(container).children('.pg-body-loading');

                        //如果不存在则说明已经执行过dom渲染
                        if((!$ch)||(!$ch.length)){//排除第一次加载的情况

                            //如果已经渲染过dom，并且活动页签没有变化，则直接退出，无需做任何操作
                            if(lastMenuId == me.data.activeTabId){
                                //如果当前活动的页签跟上一次活动的页签相同，则无需执行其它操作
                                return ;
                            }
                            // 如果已经渲染过dom，但是并不是活动页签，则执行内容显示即可，不做模板替换操作
                            //直接显示菜单即可
                            me.showTab(menu);
                            return ;
                        }
                    }
                }
                me.showTab(menu);
            }

            // iframe 打开的页面 不做 脚本处理
            if(menu.openType !='iframe'){
                //openType 为 inner 需要清除 脚本标签
                //以下为强制执行 脚本清除，模板替换机制
                var scripts = menu.scripts ||[];
                me.clearScriptTag(scripts); //清楚脚本标签
            }
            if(menu.page){//动态设计页面
                oui.clearByContainer(container);

                //var pageData = oui.util.createPageData({
                //    refresh:function(){
                //        //me.refresh&&me.refresh();
                //    },
                //    save:function(success,error){
                //        //me.saveFormData(success,error);
                //    },
                //    designer:menu.page,
                //    mainData:{},//主表数据
                //    detailData:{}//子表数据
                //});
                //pageData.beforeInit(); //初始化前
                //me.data.content = pageData.render(); //渲染

                //这里一定要指定控制器 的数据，否则不能解析
                $(container).html('<oui-include url="res_engine/page_design/pc/page-runtime-edit.art.html" data="__data().data" type="module" ></oui-include>');
                //<oui-include url="res_engine/page_design/pc/page-runtime-edit.art.html" ref="hello" type="module" data="menuData"></oui-include>
                //$(container).html(me.data.content);

                oui.parse(container);
            }else{
                oui.replaceByTplConfig({
                    url:menu.url,
                    openType:menu.openType,
                    scripts:menu.scripts||[],
                    container:container,
                    callback:function(){
                    },
                    params:menu.params
                });
            }
        },
        getCurrMenuControllerData:function(){
            var me = this;
            var tabs = this.data.tabs ||[];
            var one = oui.findOneFromArrayBy(tabs,function(item){
                if( me.data.activeTabId == item.id){
                    return true;
                }
            });
            //获取当前活动页的表单定义相关
            return {
                designData:one.page||{},
                mainData:{},
                detailData:{}
            }

        },
        getView:function(menuId){
            var activeId =  menuId || this.data.activeTabId;
            if(!this.refs){
                this.refs = {};
            }
            var view4currTab  = this.refs[activeId];
            if(!view4currTab){
                view4currTab = {
                    currTabId:activeId
                };
                this.refs[activeId] =view4currTab;
            }

            if(!view4currTab.refs){
                view4currTab.refs = {};
            }
            if(!view4currTab.data){
                view4currTab.data = {
                    currTabId:activeId
                };
            }
            return view4currTab;
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

            me.doActionByMenuConfig(menu,params);
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
        },


        /**** portal 多页签管理****************************/
        findActiveCls:function(tab){//判断当前是否是否激活状态
            if(tab.id&&tab.id == this.data.activeTabId){
                return 'tab-active';
            }
            return '';
        },
        findMenuActiveCls:function(tab){
            if(tab.id&&tab.id == this.data.activeTabId){
                return 'active';
            }
            return '';
        },
        /** 触发菜单点击事件****/
        event2clickMenu:function(cfg){
            var el = cfg.el;
            var menuId = $(el).attr('node-menu-id');
            var me = this;
            var menu = me.findMenuById(menuId);

            var level = me.findMenuLevel(menu);
            //第一级菜单，并且存在子菜单 则执行 子菜单展开
            $('li.active','.sidebar-menu').removeClass('active');
            /* 一级菜单执行显示隐藏控制***/
            if(level==1 && me.hasChildMenus(menuId)){
                var $ulCurrent = $(el).parent().children('ul');
                if($ulCurrent.hasClass('treeview-menu')){

                    if($ulCurrent.hasClass('show')){
                        $ulCurrent.removeClass('show');
                    }else{
                        $ulCurrent.addClass('show');
                    }
                }
            }else{
                //叶子菜单执行菜单执行逻辑
                me.doActionByMenuConfig(menu);
            }
            //$('li.node-menu[node-menu-id='+menuId+']','.sidebar-menu').addClass('active');
        },
        /****
         * 获取子菜单的容器层级样式，大于第3级的按照第3级样式处理
         * @param menu
         * @returns {string}
         */
        findChildMenusContainerCls:function(menu){
            var me = this;
            var size = me.findMenuLevel(menu);
            if(size>3){
                size = 3;
            }
            var s= '';
            if(size>=2){
                s+='rightview-menu ';
            }
            s+= 'tree-menu-'+size;
            if(size==1){
                s+=' show'; //第一层菜单默认展开
            }
            return s;
        },
        /*****
         * 获取菜单的层级
         * @param menu
         * @returns {*|o|i}
         */
        findMenuLevel:function(menu){
            var menuPath = menu.menuPath ||'';
            var size = menuPath.split('/').length;
            return size;
        },
        findInnerTabs:function(){//获取所有页签
            return this.data.tabs||[];
        },
        event2addTab:function(cfg){ //添加新页签

        },
        /** 删除页签 ***/
        event2removeTab:function(cfg){ //删除页签
            var me = this;
            var menuId = $(cfg.el).attr('node-menu-id');
            var menu = oui.findOneFromArrayBy(me.data.menus,function(item){
                if(item.id == menuId){
                    return true;
                }
            });
            if(!menu){
                var menuJson = $(cfg.el).attr('node-menu-json');
                if(!menuJson){
                    return
                }
                menu = oui.parseJson(menuJson);
            }
            menu&&me.removeTab(menu);
        },
        event2showTab:function(cfg){ //显示页签
            var menuId = $(cfg.el).attr('node-menu-id');
            var me = this;
            var one = oui.findOneFromArrayBy(this.data.menus,function(item){
                if(item.id == menuId){
                    return true;
                }
            });
            me.showTab(one);
        }
        /**** portal 多页签管理结束****************************/


    };
    PortalController = oui.biz.Tool.crateOrUpdateClass(PortalController);
})(window,window.$$||window.$);


