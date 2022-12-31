!(function(win){
    var oui = win.oui ||{};
    win.oui = oui;
    /** 选中项列表模板****/
    oui._tpl4selectedItem = '<ul class=\"select-items\">'+
    '{{each findSelects(selects,onlyShowCurrTabSelected,tabs,tabIndex) as item index}}'+
    '<li sort-id=\"{{item.value}}\" title=\"{{oui.escapeHTMLToString(item.display)}}\"><span>{{index+1}}</span>'+
    '<div class=\"dialog-right-detail-name\" ondblclick=\'oui.getPageParam(\"select_item_dialog_temp\").delItem(\"{{item.value}}\",{{tabIndex}})\'>'+
    '<i class=\"right-item-icon\"></i>'+
    '{{item.display}}'+
    '<i onclick=\'oui.getPageParam(\"select_item_dialog_temp\").delItem(\"{{item.value}}\",{{tabIndex}})\' class=\"right-item-delete\"></i>'+
    '</div>'+
    '</li>'+
    '{{/each}}'+
    '</ul>';

    /** 页签模板****/
    oui._tpl4tabs_selectItem = '<div class=\"dialog-data-tab\" style=\"{{if notShowTabs}}display:none{{/if}}\">'+
        '<ul>'+
        '{{each tabs as tab index}}'+
        '<li {{if index==tabIndex}}class=\"selected\"{{/if}} onclick=\'oui.getPageParam(\"select_item_dialog_temp\").setTabIndex({{index}})\'>'+
        '{{tab.name}}'+
        '<i class=\"selectriangle-left\"></i>'+
        '</li>'+
        '{{/each}}'+
        '</ul>'+
        '</div>';


    oui._tpl4datas =  '<div class=\"dialog-data-left\" oui-controller=\'oui.getPageParam(\"select_item_dialog_temp\")\'>'+
    '<div class=\"dialog-data-title\"><span>默认选项</span></div>'+
    '{{if tabs[tabIndex]&& tabs[tabIndex].renderType==\'tree\' }}'+
    '<div class=\"tree-container-left\">' +
    '<oui-include type=\"module\" ref=\"tab_{{tabs[tabIndex].id}}\" url=\"res_common/oui/ui/ui_pc/components/tree.vue.html\" data=\'oui.getPageParam(\"select_item_dialog_temp\").findTreeData({{tabIndex}})\'></oui-include>'+
    '</div>'+
    '{{else}}'+
    '<ul>'+
    '{{each findData(tabIndex) as item index}}'+
    '{{if (tabs&&tabs[tabIndex]&&tabs[tabIndex].id == item.tabId)||(!tabs.length)}}'+
    '<li drag-id=\"{{item.value}}\" {{if hasSelect(item.value,selects)}}canuse=\"false\"{{/if}}  title=\"{{oui.escapeHTMLToString(item.display)}}\" ondblclick=\'oui.getPageParam(\"select_item_dialog_temp\").addItem(\"{{item.value}}\")\' >{{item.display}}</li>'+
    '{{/if}}'+
    '{{/each}}'+
    '</ul>'+
    '{{/if}}'+

    '</div>';

    /** 整个渲染模板 *****/
    oui._tpl4selectItem =


        '<link rel=\"stylesheet\" type=\"text/css\" href=\"{{oui.getContextPath()}}res_common/third/jquery-ui/css/jquery-ui.min.css\"/>'+
        '<link rel=\"stylesheet\" type=\"text/css\" href=\"{{oui.getContextPath()}}res_common/oui/ui/ui_pc/controls/select-item/css/select-item.css\"/>'+
        '<script type=\"text/javascript\" src=\"{{oui.getContextPath()}}res_common/third/jquery-ui/jquery-1.114-ui.min.js\"></script>'+
        '<div class=\"dataSet-content {{if tabs&&tabs.length}}dataSet-tab{{/if}}\">'+
        ''+
        '<div class=\"dialog-data-tab\" style=\"{{if notShowTabs}}display:none{{/if}}\" >'+
        '<ul>'+
        '{{each tabs as tab index}}'+
        '<li {{if index==tabIndex}}class=\"selected\"{{/if}} onclick=\'oui.getPageParam(\"select_item_dialog_temp\").setTabIndex({{index}})\'>'+
        '{{tab.name}}'+
        '<i class=\"selectriangle-left\"></i>'+
        '</li>'+
        '{{/each}}'+
        '</ul>'+
        '</div>'+
        '<div class=\"dataset-dialog-container\">'+
        '<div class=\"dataSet-head {{if isShowSearch}}dataSearch{{/if}}\">'+
        '<div class=\"dialog-warntips\">Tips:拖动或双击左侧的选项到右侧的次序位置进行排序，双击或者点击删除右侧选项进行删除。</div>'+
        '<div class=\"dataSet-search\">'+
        '<div class=\"searchArea\">'+
        '<input type=\"text\" class=\"dataInput\" onkeyup=\'oui.getPageParam(\"select_item_dialog_temp\").keyup(event,this)\' onkeydown=\'oui.getPageParam(\"select_item_dialog_temp\").keydown(event,this)\' placeholder=\"请输入...\"/>'+
        '<button type=\"button\" onclick=\'oui.getPageParam(\"select_item_dialog_temp\").search()\' class=\"dataSet-btn dataSet-btn-search\"></button>'+
        '</div>'+
        '<div class=\"selectItem-helper-info\">?<i class=\"triangle-up\"></i><span>拖动或双击左侧的选项到右侧的次序位置进行排序，双击或者点击删除右侧选项进行删除</span></div>'+
        '</div>'+ 
        '</div>'+
        '<div class=\"dialog-data-left\" oui-controller=\'oui.getPageParam(\"select_item_dialog_temp\")\'>'+
        '<div class=\"dialog-data-title\"><span>默认选项</span></div>'+


        '{{if tabs[tabIndex]&& tabs[tabIndex].renderType==\'tree\' }}'+
        '<div class=\"tree-container-left\">' +
        '<oui-include type=\"module\" ref=\"tab_{{tabs[tabIndex].id}}\" url=\"res_common/oui/ui/ui_pc/components/tree.vue.html\" data=\'oui.getPageParam(\"select_item_dialog_temp\").findTreeData({{tabIndex}})\'></oui-include>'+
        '</div>' +
        '{{else}}'+
        '<ul>'+
        '{{each findData(tabIndex) as item index}}'+
        '{{if (tabs&&tabs[tabIndex]&&tabs[tabIndex].id == item.tabId)||(!tabs.length)}}'+
        '<li drag-id=\"{{item.value}}\" {{if hasSelect(item.value,selects)}}canuse=\"false\"{{/if}}  title=\"{{oui.escapeHTMLToString(item.display)}}\" ondblclick=\'oui.getPageParam(\"select_item_dialog_temp\").addItem(\"{{item.value}}\")\' >{{item.display}}</li>'+
        '{{/if}}'+
        '{{/each}}'+
        '</ul>'+
        '{{/if}}'+

        '</div>'+
        '<div class=\"dialog-data-right\">'+
        '<div class=\"dialog-data-title\"><span>已选</span></div>'+
        '<ul class=\"select-items\">'+
        '{{each findSelects(selects,onlyShowCurrTabSelected,tabs,tabIndex) as item index}}'+
        '<li sort-id=\"{{item.value}}\" title=\"{{oui.escapeHTMLToString(item.display)}}\"><span>{{index+1}}</span>'+
        '<div class=\"dialog-right-detail-name\" ondblclick=\'oui.getPageParam(\"select_item_dialog_temp\").delItem(\"{{item.value}}\",{{tabIndex}})\'>'+
        '<i class=\"right-item-icon\"></i>'+
        '{{item.display}}'+
        '<i onclick=\'oui.getPageParam(\"select_item_dialog_temp\").delItem(\"{{item.value}}\",{{tabIndex}})\' class=\"right-item-delete\"></i>'+
        '</div>'+
        '</li>'+
        '{{/each}}'+
        '</ul>'+
        
        '</div>'+
        
        '</div>'+
        '<div class=\"oui-dialog-ft\">'+ 
        '<span class=\"oui-dialog-cancel\" onclick=\'oui.getPageParam(\"select_item_dialog_temp\").cancel()\'>取消</span>'+
        '<span class=\"oui-dialog-ok\" onclick=\'oui.getPageParam(\"select_item_dialog_temp\").ok()\' >确认</span>'+
        '</div>'+
        '</div>'+
        ''+
        '';
    /***
     * 绑定拖拽事件
     * win,container,dragSelector,connectSelector,containment,start,stop
     * @param cfg
     */
    oui.bindDraggable = function(cfg){
        var win = cfg.win ||window;
        var container = cfg.container ||win.document;
        var dragSelector=cfg.dragSelector;
        var connectSelector = cfg.connectSelector;
        var containment = cfg.containment ||'body';
        win.$(dragSelector,container).draggable({
            connectToSortable: connectSelector,
            //cancel: "[canuse=false]",
            helper: "clone", // helper可以指定为“original”, "clone"，其中"original"是默认值，即拖动自身；而clone表示创建自身的一个克隆用于拖拽。
            revertDuration: 10, // 动画持续的时间(单位:毫秒)
            revert: "invalid", // 当失败时source“飘”回原来的位置
            cursor: 'pointer',  // 指定鼠标指针的形状
            zIndex: 2000,       // 设置辅助在拖动时的z-index.
            scroll: false,     //拖动容器时禁止滚动
            containment: containment,
            distance: 30,
            // containment: document.body,

            //delay: 200,
            //拖动开始
            start: function (event, ui) {
                if(cfg.start){
                    return cfg.start(event,ui);
                }
            },
            drag: function (event, ui) {
                ui.helper.find('ul').remove();
                ui.helper.html(ui.helper.text());
            },
            //控件拖动完成后要做的调整
            stop: function (event, ui) {
                cfg.stop &&cfg.stop(event,ui);
            }
        });
    };
    /***
     * win,sortSelector
     * 绑定拖拽排序事件
     * @param cfg
     */
    oui.bindSortable = function(cfg){
        var win = cfg.win ||window;
        var container = cfg.container || win.document;
        var sortSelector=cfg.sortSelector;
        var selector = sortSelector;
        win.$(selector,container).scroll(function (e) {
            win.$(selector).sortable("refresh");  //同上，使用其中一个即可
        });
        win.$(selector,container).sortable({
            cancel: '.right-item-delete',
            scroll: true,
            // connectWith: connectWith,
            placeholder: "sort-highlight",
            //这个时间在一个已连接的sortable接收到来自另一个列表的元素时触发.
            receive: function (event, ui) {
                if(cfg.receiveBefore) {
                    var check = cfg.receiveBefore(event,ui);
                    if (typeof (check) == 'boolean') {
                        if (!check) {
                            return;
                        }
                    }
                }

                cfg.receive&&cfg.receive(event,ui);
            },
            tolerance: "pointer",
            // axis:'y',
            zIndex: 100,
            over: function (event, ui) { //拖动过程
                cfg.over &&cfg.over(event,ui);
            },
            update: function (event, ui) {
            },
            out: function (event, ui) {
            },
            stop: function (event, ui) {
                cfg.stop&&cfg.stop(event,ui,this);
            },
            start: function (event, ui) {
                cfg.start&&cfg.start(event,ui);
            }
        });
    };
    oui.showItemsSelectDialog = function(cfg){
        var temp = oui._tpl4selectItem;
        if(!oui._tpl4selectItem_render){
            //整个模板
            oui._tpl4selectItem_render = template.compile(temp);

            //页签tab
            oui._tpl4tabs_render = template.compile(oui._tpl4tabs_selectItem);

            //选中的模板
            oui._tpl4selectedItem_render = template.compile(oui._tpl4selectedItem);

            //待选模板
            oui._tpl4datas_render = template.compile(oui._tpl4datas);
        }

        var data = cfg.data ||[];
        var value = (cfg.value) ||'';
        value +='';
        var temp = value.split(',');
        var selects = [];
        /** 查找选中项***/
        var tempSelects = oui.findManyFromArrayBy(data,function(item){
            if(temp.indexOf(item.value+"")>-1){
                return true;
            }
        });
        /** 排序选中项****/
        for(var i= 0,len=temp.length;i<len;i++){
            var curr = temp[i];
            var tempOne = oui.findOneFromArrayBy(tempSelects||[],function(item){
                if((item.value+"") ==curr){
                    return true;
                }
            });
            if(tempOne){
                selects.push(tempOne);
            }
        }

        var defaultConfig = {
            canNotSelectTypeCode:'',
            data:data,
            notShowTabs:false,
            selects:selects,
            title:'请选择',
            isHideFooter:true,
            tabs:[],
            tabIndex:0,
            isMulti:true,
            isShowSearch:false,
            onlyShowCurrTabSelected:false,
            hasSelect :function(value,selects){


                var curr = oui.findOneFromArrayBy(selects||[],function(item){
                    if((item.value+"") == (value+"") ){
                        return true;
                    }
                });
                if(curr){
                    return true;
                }
                return false;
            },
            findData:function(tabIndex){
                var data = cfg.data ||[];
                var tabs = cfg.tabs||[];
                if(tabs[tabIndex]){
                    //存在页签 判断数据是否放在页签上
                    if((tabs[tabIndex].data && tabs[tabIndex].data.length) &&(tabs[tabIndex].renderType!='tree') ){
                        return tabs[tabIndex].data;
                    }
                }
                return data;
            },
            findSelects:function(selects,onlyShowCurrTabSelected,tabs,tabIndex){
                if(onlyShowCurrTabSelected){
                    var tab = tabs[tabIndex]||{};
                    var tabId = tab.id||"";
                    var arr = oui.findManyFromArrayBy(selects,function(item){
                        if(item.tabId == tabId){
                            return true;
                        }
                    });
                    return arr;
                }else{
                    return selects;
                }
            },
            contentStyle:'width:auto;',/*height:510px*/
            /* 外部调用需要实现的接口****/
            confirm:function(value,selects,obj){
                oui.getTop().oui.alert('请实现confirm(value,selects,obj)接口');
            }
        };

        cfg = $.extend(defaultConfig,cfg,true);

        var html = oui._tpl4selectItem_render(cfg);
        cfg.content = html;
        var obj = oui.getTop().oui.showHTMLDialog(cfg);
        oui.getTop().oui.setPageParam('select_item_dialog_temp',obj);
        /***
         * 设置当前页签
         */
        obj.setTabIndex = function(index){
            var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
            cfg.tabIndex = index;
            var html = oui._tpl4tabs_render(cfg);
            var el = oui.getTop().$('.dialog-data-tab',this.getEl())[0];
            el.outerHTML = html;
            var dataHtml = oui._tpl4datas_render(cfg);
            var el4data = oui.getTop().$('.dialog-data-left',this.getEl())[0];
            el4data.outerHTML = dataHtml;

            var objEl =this.getEl();
            var $input = oui.getTop().$('.dataInput',objEl);
            $input.val('');
            if(cfg.onlyShowCurrTabSelected){
                this.renderSelects();
            }else{
                oui.parse({
                    container:this.getEl(),
                    callback:function(){
                        me.bindDrag();
                    }
                });
            }
            oui.loadData4SelectTab(cfg,function(){

            });

        };
        obj.keyup = function(event,el){
            var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
            if (event.keyCode == 13 || event.keyCode == '13') {
                return ;
            }
            var objEl =me.getEl();
            var $input = oui.getTop().$('.dataInput',objEl);
            var display =$input.val();

            if(!display){
                if(me.tempTimer){
                    window.clearTimeout(me.tempTimer);
                }
                me.tempTimer = window.setTimeout(function(){
                    me.search();
                    me.tempTimer = null;
                },1);
            }
        };
        obj.keydown = function(event,el){
            var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
            event = window.event || event;
            var objEl =me.getEl();
            var $btn = oui.getTop().$('.dataSet-btn',objEl);
            /** 如果搜索按钮没有显示 就按enter 则不执行****/
            if($btn.hasClass('dataSet-btn-del')){
                $btn.removeClass('dataSet-btn-del');
            }
            if (event.keyCode == 13 || event.keyCode == '13') {
                if(oui.browser.ie == "9.0"){
                    return false;
                }
                if(me.tempTimer){
                    window.clearTimeout(me.tempTimer);
                }

                me.tempTimer = window.setTimeout(function(){
                    me.search();
                    me.tempTimer = null;
                },1);
            }
        };
        obj.search = function(){

            var objEl = this.getEl();
            var $input = oui.getTop().$('.dataInput',objEl);
            var display =$input.val();
            var data = cfg.data;
            var selector4show =[];
            var currTab = cfg.tabs[cfg.tabIndex]||{};
            var currTabId =currTab.id||"";
            var $btn = oui.getTop().$('.dataSet-btn',objEl);
            if($btn.hasClass('dataSet-btn-del')){
                //执行清空值
                display = '';
                $input.val('');
                $btn.removeClass('dataSet-btn-del');
            }else{
                if(display){
                    $btn.addClass('dataSet-btn-del');
                }else{
                    $btn.removeClass('dataSet-btn-del');
                }
            }
            if(currTab.renderType =='tree'){
                //todo 处理过滤
                if(display){
                    currTab.treeCfg.display4filter = display;
                }else{
                    currTab.treeCfg.display4filter = '';
                }
                currTab.treeCfg.ref.display4filter   = display;

            }else{
                //非树搜索

                if(!display){
                    oui.getTop().$('.dialog-data-left',objEl).find('li[drag-id]').show();
                    return ;
                }


                oui.findManyFromArrayBy(data,function(item){
                    var tempTabId = item.tabId||"";
                    if(tempTabId == currTabId){
                        if(item.display.indexOf(display)>-1){
                            selector4show.push('li[drag-id='+item.value+']');
                            return true;
                        }
                    }
                });
                oui.getTop().$('.dialog-data-left',objEl).find('li[drag-id]').hide();
                if(selector4show.length){
                    oui.getTop().$('.dialog-data-left',objEl).find(selector4show.join(',')).show();
                }
            }
        };
        obj.ok = function(){
            var selects = obj.attr('selects') ||[];
            var value = [];
            $.each(selects,function(){
                value.push(this.value);
            });
            value = value.join(',');
            var confirm = this.attr('confirm');
            var result = confirm(value,selects,obj);
            if(typeof result =='boolean'){
                if(!result){
                    return false;
                }
            }
            this.hide('ok');
        };
        obj.cancel = function(){
            this.hide('cancel');
        };
        /** 删除选择项***/
        obj.delItem = function(value,tabIndex){
            var currDialog = oui.getTop().oui.getPageParam('select_item_dialog_temp');
            var selects = currDialog.attr('selects');
            oui.removeFromArrayBy(selects,function(item){
                if((item.value+"") == (value+"") ){
                    return true;
                }
            });
            oui.getTop().$('[drag-id='+value+']',currDialog.getEl()).removeAttr('canuse');
            currDialog.renderSelects();
        };

        /** 添加项到右侧***/
        obj.addItem = function(value){
            var currDialog = oui.getTop().oui.getPageParam('select_item_dialog_temp');
            var selects = currDialog.attr('selects')||[];
            var curr = oui.findOneFromArrayBy(selects,function(item){
                if((item.value+"") == (value+"") ){
                    return true;
                }
            });
            if(curr){//不能重复添加
                return false;
            }
            var data = currDialog.attr('data');

            var temp = oui.findOneFromArrayBy(data,function(item){
                if((item.value+"") == (value+"") ){
                    return true;
                }
            });
            var isInTreeTab= false;
            if(!temp){
                var tabs = currDialog.attr('tabs')||[];
                oui.eachArray(tabs,function(tab){
                    var currData = tab.data || (tab.treeCfg?tab.treeCfg.nodes||[]:[])||[];
                    var flag = false;
                    oui.eachArray(currData,function(tempData){
                        if((tempData.value+'') == (value+'')){
                            flag = true;
                            temp = tempData;
                            return false;
                        }
                    });
                    if(flag){
                        if(tab.renderType =='tree'){
                            isInTreeTab = true;
                        }
                        return false;
                    }
                });
            }
            var canNotSelectTypeCode = currDialog.attr('canNotSelectTypeCode');
            if(canNotSelectTypeCode&&canNotSelectTypeCode.length){
                if(typeof canNotSelectTypeCode=='string'){
                    canNotSelectTypeCode = canNotSelectTypeCode.split(',');
                }
                if(temp && temp.typeCode &&( canNotSelectTypeCode.indexOf(temp.typeCode)>-1)){
                    return false;
                }
            }
            var isMulti = currDialog.attr('isMulti');
            if(!isMulti){
                if(selects.length){ //单选
                    selects[0] = temp;
                }else{
                    selects.push(temp);
                }
            }else{
                selects.push(temp);
            }
            oui.getTop().$('[drag-id='+value+']',currDialog.getEl()).attr('canuse',false);
            currDialog.renderSelects();
        };
        obj.bindSort = function(){
            var currDialog = oui.getTop().oui.getPageParam('select_item_dialog_temp');
            oui.bindSortable({
                win:oui.getTop(),
                container:currDialog.getEl(),
                sortSelector:'.dialog-data-right ul',
                receiveBefore:function(event,ui){

                },
                receive:function(event,ui){
                    var data = currDialog.attr('data') || [];
                    var selects = currDialog.attr('selects')||[];
                    var id = ui.helper.attr('drag-id');
                    var curr = oui.findOneFromArrayBy(data,function(item){
                        if((item.value+"") == (id+"") ){
                            return true;
                        }
                    });
                    var isInTreeTab = false;
                    if(!curr){
                        var tabs = currDialog.attr('tabs')||[];
                        oui.eachArray(tabs,function(tab){
                            var currData = tab.data || (tab.treeCfg?tab.treeCfg.nodes||[]:[])||[];
                            var flag = false;
                            oui.eachArray(currData,function(tempData){
                                if((tempData.value+'') == (id+'')){
                                    flag = true;
                                    curr = tempData;
                                    return false;
                                }
                            });
                            if(flag){
                                if(tab.renderType=='tree'){
                                    isInTreeTab = true;
                                }
                                return false;
                            }
                        });
                    }
                    if(curr){
                        var isMulti = currDialog.attr('isMulti');
                        if(!isMulti){
                            if(selects.length){ //只能单选
                                selects[0] = curr;
                            }else{
                                selects.push(curr);
                            }
                        }else{
                            selects.push(curr);
                        }
                    }
                    oui.getTop().$('[drag-id='+id+']',currDialog.getEl()).attr('canuse','false');

                    ui.helper.removeAttr('drag-id');
                    ui.helper.attr('sort-id',id);
                    currDialog.attr('selects',selects);
                    currDialog.currItem = oui.getTop().$('[sort-id='+id+']',currDialog.getEl());
                },
                stop:function(event,ui,$sorter){
                    var currDialog = oui.getTop().oui.getPageParam('select_item_dialog_temp');
                    currDialog.sort();
                    currDialog.renderSelects();
                },
                start:function(event,ui){
                    if(ui.item&&ui.item.attr('sort-id')){
                        currDialog.currItem = ui.item;
                    }
                }
            });
        };
        obj.bindDrag = function(){
            var currDialog = oui.getTop().oui.getPageParam('select_item_dialog_temp');

            var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
            oui.bindDraggable({
                win:oui.getTop(),
                container:currDialog.getEl(),
                dragSelector:'.dialog-data-left ul>li,.dialog-data-left li',
                connectSelector:'.dialog-data-right ul',
                containment:'.dataset-dialog-container',
                start:function(event,ui){
                    var currDialog = oui.getTop().oui.getPageParam('select_item_dialog_temp');
                    //var data = currDialog.attr('data')||[];
                    var selects = currDialog.attr('selects')||[];
                    var id = ui.helper.attr('drag-id');
                    var curr = oui.findOneFromArrayBy(selects,function(item){
                        if((item.value+"") == (id+"") ){
                            return true;
                        }
                    });
                    if(curr){//不能重复添加
                        return false;
                    }
                    var canNotSelectTypeCode = currDialog.attr('canNotSelectTypeCode');
                    if(canNotSelectTypeCode&&canNotSelectTypeCode.length){

                        var data = currDialog.attr('data');

                        var temp = oui.findOneFromArrayBy(data,function(item){
                            if((item.value+"") == (id+"") ){
                                return true;
                            }
                        });
                        var isInTreeTab= false;
                        if(!temp){
                            var tabs = currDialog.attr('tabs')||[];
                            oui.eachArray(tabs,function(tab){
                                var currData = tab.data || (tab.treeCfg?tab.treeCfg.nodes||[]:[])||[];
                                var flag = false;
                                oui.eachArray(currData,function(tempData){
                                    if((tempData.value+'') == (id+'')){
                                        flag = true;
                                        temp = tempData;
                                        return false;
                                    }
                                });
                                if(flag){
                                    if(tab.renderType =='tree'){
                                        isInTreeTab = true;
                                    }
                                    return false;
                                }
                            });
                        }



                        if(typeof canNotSelectTypeCode=='string'){
                            canNotSelectTypeCode = canNotSelectTypeCode.split(',');
                        }
                        if(temp && temp.typeCode && (canNotSelectTypeCode.indexOf(temp.typeCode)>-1)){
                            return false;
                        }
                    }
                },
                stop:function(event,ui){
                    var tabIndex = me.attr('tabIndex');
                    var tabs = me.attr('tabs')||[];
                    var tab = tabs[tabIndex];
                    if(tab&&tab.renderType=='tree'){
                    }
                }
            });
        };
        obj.renderSelects = function(){
            var scrollTop = oui.getTop().$(this.getEl()).find('.dialog-data-right ul')[0].scrollTop;

            var selects = this.attr('selects');
            var html = oui._tpl4selectedItem_render(cfg);
            var el = oui.getTop().$('.select-items',this.getEl())[0];
            el.outerHTML = html;
            var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
            oui.parse({container:obj.getEl(),callback:function(){
                oui.getTop().$(me.getEl()).find('.dialog-data-right ul')[0].scrollTop = scrollTop;
                me.bindDrag();
                me.bindSort();
            }});
        };
        obj.sort = function(){
            var _self = this;
            if(_self.currItem&&_self.currItem.length){
                var id = _self.currItem.attr('sort-id');
                var $next = _self.currItem.next();
                var nextId = '';
                if($next&&$next.length){
                    nextId =  $next.attr('sort-id');
                }
                var selects = _self.attr('selects');
                _self.sort2update(selects,id, nextId);
            }
        };
        /* 排序更新 **/
        obj.sort2update = function(items,id,nextId){
            var currObj = oui.findOneFromArrayBy(items,function(item){
                if((item.value+"") == (id+"") ){
                    return true;
                }
            });
            var nextObj = oui.findOneFromArrayBy(items,function(item){
                if((item.value+"") == (nextId+"") ){
                    return true;
                }
            });
            if(!currObj){
                return ;
            }

            var currIdx = items.indexOf(currObj);
            var nextIdx;

            if (currIdx != -1) {
                items.splice(currIdx, 1); //临时去除当前位置的id
            }

            if (!nextId) { //如果当前控件在拖拽排序后，其后面没有控件时 则直接将当前控件Id放置在当前排序最后
                items.push(currObj);
            }else{
                nextIdx = items.indexOf(nextObj);
                items.splice(nextIdx,0,currObj);
            }
        };
        obj.findTreeData = function(tabIndex){
            var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
            var currTab = cfg.tabs[cfg.tabIndex]||{};
            var parentIdKey = currTab.parentIdKey||'parentId';
            var temp = currTab.treeCfg||{};
            var treeCfg = {
                ref:'ref_'+currTab.id,
                display4filter:'',
                notClone4Component:true,

                setting:{

                    edit: {
                        enable: false,
                        showRemoveBtn: false,
                        showRenameBtn: false
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            pIdKey: parentIdKey
                        }
                    },
                    view: {
                        dblClickExpand:false,
                        showIcon: true,
                        addDiyDom:function(treeId,treeNode){
                            var aObj = $("#" + treeNode.tId + "_a");
                            aObj.parent().attr('drag-id',treeNode.value);
                            if(cfg.hasSelect(treeNode.value,cfg.selects)){
                                aObj.parent().attr('canuse','false');
                            }else{
                                aObj.parent().attr('canuse','true');
                            }
                        }
                    }
                },

                nodes:[],
                clickTimes:0,
                onBeforeDrag:function(treeId, treeNodes){

                    //var dom = $('#drag_'+treeId);
                    //if((!dom)||(!dom.length)){
                    //    $(obj.getEl()).append('<div id="drag_'+treeId+'" node-id="'+treeNodes[0].id+'">'+treeNodes[0].display+'</div>');
                    //    dom =  $('#drag_'+treeId);
                    //}
                    //dom.css({
                    //    'position':'absolute',
                    //    'z-index':oui.getTop().oui.$.ctrl.dialog.dialogMaxZIndex+1
                    //});
                    return true;
                },
                //通过单击事件模拟双击事件
                onClick:function(event,treeId,treeNode){

                    //  单击模拟双击操作
                    this.clickTimes++;
                    if (this.clickTimes === 2) { //当点击次数为2
                        this.clickTimes = 0; //记得清零
                        //  触发双击事件...
                        this.onDblClick(event,treeId,treeNode);
                    }
                    var _this = this;
                    setTimeout(function () {
                            if (_this.clickTimes === 1) {
                                _this.clickTimes = 0; // 单击清零
                                //  触发单击事件...
                            }
                        }, 250
                    );
                    event.stopPropagation&&event.stopPropagation();
                }
                ,
                onDrag:function(event,treeId,treeNodes){
                    console.log(event);
                    console.log(treeNodes);

                },
                onDblClick:function(event,treeId,treeNode){
                    oui.getPageParam("select_item_dialog_temp").addItem(treeNode.value);
                },
                onCreated:function(ztreeObj){
                    var me = oui.getTop().oui.getPageParam("select_item_dialog_temp");
                    ztreeObj&&ztreeObj.expandAll(true);
                    me.bindDrag();
                    me.bindSort();
                }
            } ; //default
            for(var k in temp){
                treeCfg[k] = temp[k];
            }
            currTab.treeCfg = treeCfg;

            return treeCfg;
        };
        obj.FullName = 'oui.getPageParam(\"select_item_dialog_temp\")';
        obj.data = function(){
            return window;
        };
        obj.bindDrag();
        obj.bindSort();
        oui.parse({
            container:obj.getEl(),
            callback:function(){

            }
        });
        oui.loadData4SelectTab(cfg,function(){
            //处理数据渲染
            //'currTab_'+currTab.id

        });
        return obj;

    };
    /***
     * 加载页签数据
     * @param cfg
     * @param callback
     */
    oui.loadData4SelectTab = function(cfg,callback){

        var tabIndex = cfg.tabIndex;
        if(typeof tabIndex=='undefined'){
            tabIndex =0;
        }

        if(cfg.tabs[tabIndex]&&cfg.tabs[tabIndex].url){ //根据url加载数据
            //loadDataUrl;
            var url = cfg.tabs[tabIndex].url;
            var renderType = cfg.tabs[tabIndex].renderType;
            var loadDataKey = cfg.tabs[tabIndex].loadDataKey||'data';
            var currTab = cfg.tabs[tabIndex];
            //
            oui.postData(url,{},function(res){
                var data = res[loadDataKey] ||[];
                if(renderType =='tree'){
                    currTab.treeCfg= currTab.treeCfg ||{};
                    currTab.treeCfg.nodes = data;
                }else{
                    currTab.data = data;
                }
                currTab.treeCfg.ref.nodes = data;
                callback&&callback();

            },function(){

            },'加载中。。。');
        }else{
            callback&&callback();
        }
    };
}(window));





