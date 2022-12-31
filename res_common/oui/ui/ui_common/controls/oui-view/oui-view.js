(function(win,$){
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;
    var constant =oui.$.constant;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var OuiView = function(cfg) {
        Control.call(this,cfg);//必须继承控件超类
        this.attrs = this.attrs+",forceUpdate,content,tplId,useVDom,onAfterRender,onBeforeRender,oui-controller";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.notRenderOuterHtml = notRenderOuterHtml;//默认 parseByDom不渲染outerHtml
        this.hide=hide;
        this.show=show;
        this.render = render;
        this.afterRender=afterRender;
        this.beforeRender = beforeRender;
        this.renderByVirtualDom = renderByVirtualDom;
        this.getData = getData;
        this.setData = setData;
        this.bindVDom = bindVDom;
        this.getHtmlByTplId =getHtmlByTplId;
        this.refresh = refresh;
        this.patchDom = patchDom;// 虚拟dom渲染 其它dom的api
    };
    ctrl["ouiview"] = OuiView;
    OuiView.FullName = "oui.$.ctrl.ouiview";//设置当前类全名 静态变量
    OuiView.templateHtml=[];
    OuiView.templateHtml[0] = '{{=content}}';
    /**刷新所有节点 */
    var refresh = function(){
        if(this.attr('useVDom')){
            //this.attr('useVDom',false);
            //this.attr('elRoot','');
            this.render(true);
            //var me = this;
            //setTimeout(function(){
            //    me.attr('useVDom',true);
            //},10);
        }else{
            this.render(true);
        }
    };
    var getHtmlByTplId = function(tplId,data){
        var caches = this._cacheTpls;
        if(!caches){
            this._cacheTpls = {};
            caches = this._cacheTpls;
        }
        var currRender = caches[tplId];
        if(!currRender){
            var tpl = document.getElementById(tplId).innerHTML;
            currRender = template.compile(tpl);
            caches[tplId] = currRender;
        }
        return currRender(data);
    };

    var init=function(el){
        var data = this.attr('data');

        if(!data){
            data = {};
        }else{
            var controller = this.attr('oui-controller');
            var clz = '';
            if(controller){
                clz = oui.biz.Tool.getControllerClass(controller);
            }else{
                var clsFullName= $(el).closest('[oui-controller]').attr('oui-controller');
                if(clsFullName){
                    try{
                        clz = oui.biz.Tool.getControllerClass(clsFullName);
                    }catch(err){
                        try{
                            clz = oui.parseJson(clsFullName);
                        }catch(cerr){
                            clz = window;
                        }
                    }
                }
            }
            if(clz && (clz !=window)){
                if(typeof data =='string'){
                    if(data.indexOf('(')>-1){//方法调用
                        var funPath = data.substring(0,data.indexOf('('));
                        if(funPath.indexOf('.')<0){
                            data = clz.FullName+'.'+data;
                        }
                    }else{//属性调用
                        if(data.indexOf('.')<0){
                            data = clz.FullName+'.'+data;
                        }
                    }
                    if(oui.util&&oui.util.eval){
                        data = oui.util.eval(data);
                    }
                }
            }


            try{
                data = oui.parseJson(data);
            }catch(e){
                oui.log('oui-view[id='+this.attr('id')+']配置的data='+(this.attr('data'))+'解析异常');
                data = {};
            }
        }
        var content = this.attr('content');
        if(!content){
            var id = this.attr('id');
            var tpl = id+'-tpl';
            var tplId = this.attr('tplId');
            tpl = tplId || tpl;
            var tplDom = document.getElementById(tpl);
            if(tplDom){
                html = tplDom.innerHTML;
                if(html){
                    this.attr('content',html);
                }
            }else{
                var html = el.innerHTML;
                html = $.trim(html);
                if(html){
                    this.attr('content',html);
                }
            }
            content = html;
        }
        content= oui.escapeHTMLToString(content);
        this.attr('content','加载中...');//把内容处理为空，避免 脚本模板在页面中显示
        //var contentRender = template.compile(content,{escape:false});
        var contentRender = template.compile(content,{escape:true});

        this.attr('contentRender',contentRender);
        this.attr('data',data);
        var useVDom = this.attr('useVDom');
        if(useVDom && (useVDom=='true' ||(useVDom==true))){
            useVDom = true;
        }else{
            useVDom = false;
        }
        this.attr('useVDom',useVDom);
        var me = this;
        me.inited = false;
        me.watching =false;
        if(useVDom){
            if(!window.WatchJS){

                oui.require([oui.getContextPath()+'res_common/third/watch/watch.js'
                ],function(){
                    watchCurrData.call(me);
                });
            }else{
                watchCurrData.call(this);
            }
        }
    };
    var notRenderOuterHtml = function(){
        if(this.inited){
            return false;
        }
        return true;
    };
    /** 监听当前对象****/
    var watchCurrData = function(){
        var me = this;
        if(!this.getMap){
            return ;
        }
        WatchJS.watch(this.getMap(),'data',function(prop, action, newvalue, oldvalue) {
            if(!me.inited){
                return ;
            }
            var useVDom = me.attr('useVDom');
            if(!useVDom){
                return ;
            }
            if(me.updateTimer){
                try{
                    clearTimeout(me.updateTimer);
                }catch(e){

                }
            }
            var fun = function(){
                try{
                    var useVDom = me.attr('useVDom');
                    if(useVDom && (useVDom=='true' || (useVDom==true))){
                        useVDom = true;
                    }else{
                        useVDom = false;
                    }
                    if(useVDom){
                        return;
                    }
                    me.render && me.render();
                    me.updateTimer = null;
                }catch(err){
                }
            };
            me.updateTimer = setTimeout(fun,1);
        });
        me.onBindWatching&&me.onBindWatching();
        me.watching = true;
    };
    var getData = function(){
        return this.attr('data');
    };
    var setData = function(data,isNotRender){
        this.attr('data',data);
        if(!isNotRender){
            this.render();
        }
    };
    var runFuns = function(funParam,obj){
        var temp = funParam;
        if(temp){
            if(typeof temp =='string'){
                temp = temp.split(',');
                for(var i= 0,len=temp.length;i<len;i++){
                    var curr = oui.parseJson(temp[i]);
                    if(curr){
                        var flag = curr(obj);
                        if(flag){
                            if(typeof flag =='boolean'){
                                if(!flag){
                                    return flag;
                                }
                            }
                        }
                    }

                }
            }else{
                return temp(obj);
            }
        }
    };
    /*** 渲染之前，处理以前的控件 ***/
    var beforeRender = function(){
        var id = this.attr('id');
        var control = oui.getById(id);
        var onBeforeRender = this.attr('onBeforeRender');
        var flag = runFuns(onBeforeRender);
        if(control && control.getEl){
            /** 清除之前的渲染模板*****/
            var lastEl = control.getEl();
            oui.clearByContainer(lastEl);
        }
        return flag;
    };


    /**
     * 渲染当前控件对象的dom操作,
     * 可以由子类重写 实现对dom进行操作
     */
    var render = function(forceUpdate){
        var startDate = new Date();
        var me = this;
        var el = this.getEl();
        if(!el){return ;}
        var useVDom = this.attr('useVDom');
        if(!useVDom){
            if(this.beforeRender){
                var flag = this.beforeRender();
                if(typeof  flag =='boolean'){
                    if(!flag){
                        return false;
                    }
                }
            }
            var html = this.getHtml();
            el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
            el = null;
            this.afterRender&&this.afterRender();
            var endDate = new Date();
            //console.log('渲染时间 首次:'+(endDate-startDate));

        }else{
            if(!window.svd){
                //按需加载 虚拟dom所需js
                oui.require([oui.getContextPath()+'res_common/third/template/simple-virtual-dom/dist/bundle.js'
                ],function(){
                    me.renderByVirtualDom&&me.renderByVirtualDom(forceUpdate);
                });
            }else{
                me.renderByVirtualDom&&me.renderByVirtualDom(forceUpdate);
            }
        }

    };
    /* 绑定虚拟dom 自动更新****/
    var bindVDom = function(el){
        var elRoot = this.attr('elRoot'); //当前oui-view 根节点
        var vdom = this.attr('vdom'); //当前虚拟dom节点
        var useVDom = this.attr('useVDom');
        if(useVDom){
            if(elRoot && vdom){
                return ;
            }
        }
        el =  el || this.getEl();
        this.attr('elRoot',el);
        var virtualDom = parseDom2VDom(el);
        this.attr('vdom',virtualDom);
        //重写获取html的方法
        var tempHtml = this.getHtml;
        this.attr('tempHtml',tempHtml);
        this.getHtml = function(){
            var data = this.attr('data');
            var map = this.getMap();
            var contentRender = this.attr('contentRender');
            var h = contentRender(data);
            var controller = this.attr('oui-controller');
            var s = '<div ';
            if(controller){
                s+='oui-controller="'+controller+'" ';
            }
            s+= ('ouiId="'+map.ouiId+'" ');//ouiId定义
            s+= ('id="'+constant.controlIdPrefix+map.id+'" ');//id 定义
            s+= ('showType="'+map.showType+'" ');//showType 模板号
            if(map.style){ s+= ('style="'+map.style+'" '); } // 继承标签style定义
            var showTypeInCls ="";
            if(map.showType!=0){
                showTypeInCls ="-"+map.showType;
            }
            /***必填样式 ***/
            var require = oui.getJsonAttr(map,'validate.require');
            if(typeof require =='string'){
                if(require =='true'){
                    require = true;
                }else{
                    require = false;
                }
            }
            if(map.cls){
                if(require){
                    s+= ('class="'+map.cls+showTypeInCls+' oui-require"');
                }else{
                    s+= ('class="'+map.cls+showTypeInCls+'"');
                }
            }else{
                var names = OuiView.FullName.split('.');
                var controlName = names[names.length-1];
                if(require){
                    s+= ('class="'+constant.controlClassNamePrefix+controlName+showTypeInCls+' oui-require"');
                }else{
                    s+= ('class="'+constant.controlClassNamePrefix+controlName+showTypeInCls+'"');
                }
            }// 继承标签 class定义
            s+='>';
            s+=h;
            s+='</div>';
            return s ;//根据对象返回html内容
        };
    };
    /** 根据虚拟dom进行渲染****/
    var renderByVirtualDom = function(forceUpdate){
        var contentRender = this.attr('contentRender');
        var data = this.attr('data');
        var elRoot = this.attr('elRoot'); //当前oui-view 根节点
        var vdom = this.attr('vdom'); //当前虚拟dom节点
        if((!elRoot) || (!vdom)){
            var el = this.getEl();
            this.bindVDom(el);
            vdom = this.attr('vdom');
            elRoot = el;
        }else{
            var update = this.attr('forceUpdate');
            if(typeof update=='string'){
                if(update==='false' ){
                    update = false;
                }else{
                    update = true;
                }
            }
            if(update || forceUpdate){

                var el = this.getEl();
                elRoot = el;
                this.attr('elRoot',el);
                vdom = parseDom2VDom(el);
            }
        }

        var html = this.getHtml();
        var newVirdom  = parseString2VDom(html);
        this.attr('vdom',newVirdom); //更新虚拟dom
        var Diff = svd.diff ;
        var Patch = svd.patch ;
        var patches = Diff(vdom, newVirdom);
        /** 存在变化才更新 dom***/
        if(!oui.isEmptyObject(patches)){
            Patch(elRoot,patches); //差异处理并渲染
            oui.parse({container:elRoot});
        }


    };
    var patchDom = function(dom,html){
        var vdom = parseDom2VDom(dom);
        var newVirdom  = parseString2VDom(html);
        var Diff = svd.diff ;
        var Patch = svd.patch ;
        var patches = Diff(vdom, newVirdom);
        /** 存在变化才更新 dom***/
        if(!oui.isEmptyObject(patches)){
            Patch(dom,patches); //差异处理并渲染
        }
    };
    /** 字符串转dom****/
    var parseString2Dom = function (str) {
        var objE = document.createElement("div");
        objE.innerHTML = str;
        return objE.childNodes[0];
    };
    /*** dom转虚拟dom****/
    var parseDom2VDom = function(node){
        var Element = svd.el;
        var props = {};
        var children = [];
        //判断是否是元素节点
        if(node.nodeType == 1){
            var props= {};
            var attributes = node.attributes||[];
            for(var i = 0; i < attributes.length; i++){
                props[attributes[i].nodeName] = attributes[i].nodeValue;
            }
            var sonnodes = node.childNodes ||[];
            //遍历所哟的子节点
            for (var i = 0; i < sonnodes.length; i++) {
                //得到具体的某个子节点
                var sonnode = sonnodes.item(i);
                //递归遍历
                var son = parseDom2VDom(sonnode);
                children.push(son);
            }
        }else{
            return node.nodeValue;
        }
        var vdom = Element(node.tagName,props,children);
        return vdom;
    };
    /** 字符串转虚拟dom***/
    var parseString2VDom =function(str){
        var dom = parseString2Dom(str);
        var vd = parseDom2VDom(dom);
        return vd;
    };


    /*****
     * 后置脚本处理
     */
    var afterRender=function(){
        var el = this.getEl();
        var contentRender = this.attr('contentRender');
        var data = this.attr('data');
        var html = contentRender(data);
        $(el).html(html);
        oui.parse({container:el});
        this.inited = true;
        var onAfterRender = this.attr('onAfterRender');
        runFuns(onAfterRender);
    };
    var hide=function(){
        var el=this.getEl();
        $(el).addClass('display_none');
        this.attr("hidden",true);
    };
    var show=function(cfg){
        var el=this.getEl();
        $(el).removeClass('display_none');
        this.attr("hidden",false);
    };
    var changeFun= function(e){
        var $curr = $(e.target);
        var mvSelector ='.oui-class-ouiview';
        var $mv = $curr.closest(mvSelector);
        var blur4change = $curr.attr('blur4change');

        /** 失去焦点时才更新属性***/
        if((!$mv) || (!$mv.length)){
            return ;
        }
        var ouiId =$mv.attr('ouiid');
        if(!ouiId){
            return ;
        }
        var view = oui.getByOuiId(ouiId);
        if(!view){
            return ;
        }
        var map = view.getMap();
        var pageParam = map.data;
        if(!map.data){
            pageParam= {};
            map.data= pageParam;
        }
        var key = $curr.attr('bindprop');
        if(!key){
            return ;
        }
        var propType = $curr.attr('propType')||'';

        var v = oui.JsonPathUtil.getJsonByPath(key,pageParam)||null; //当前内存中的值
        var domValue = ''; //当前dom中的值
        if($curr.is('select')){
            domValue = $curr.val();
        }else if($curr.is('input')){
            var type = $curr.attr('type');
            if(type =='radio' || type=='checkbox'){ //radio或者checkbox必须指定name 并且指定value，否则不做数据同步绑定
                var name = $curr.attr('name');
                var tempV = [];
                $('input[type='+type+'][name='+name+']',$mv).each(function(){
                    var $currMv = $(this).closest(mvSelector);
                    if($currMv&&($currMv[0] ===$mv[0])){
                        if($(this).is(':checked')){
                            tempV.push($(this).val());
                        }
                    }
                });
                domValue = tempV.join(',');
            }else{
                domValue= $curr.val();
            }
        }else if($curr.is('textarea')){
            var value = $curr.val();
            domValue = value;
        }else{
            return ;
        }
        /** 属性类型处理，目前只有init类型场景***/
        if(propType =='int'){
            try{ domValue = parseInt(domValue); }catch(err){domValue=0; }
            if(isNaN(domValue)){
                domValue =0;
            }

        }else if(propType =='float'){
            try{
                domValue = parseFloat(domValue);
            }catch(err){
                domValue =0;
            }
            if(isNaN(domValue)){
                domValue =0;
            }

        }else if(propType =='number') {
            try {
                domValue = Number(domValue);
            } catch (err) {
                domValue = 0;
            }
            if(isNaN(domValue)){
                domValue =0;
            }
        }
        if(v !== domValue){
            oui.JsonPathUtil.setObjByPath(key,pageParam,domValue,true);
            var tag = $(e.target)[0].tagName;
            var bindPropAfter = $(e.target).attr('bindPropAfter');
            var cfg = {
                e:e,
                el: e.target
            };
            if(bindPropAfter){
                bindPropAfterFuns(bindPropAfter,cfg);
            }
            //console.log(tag+'[type='+$(e.target).attr('type')+'],值改变：'+v);
            //console.log(pageParam);
        }
        if((blur4change+'')){//判断失去焦点事件自定义脚本
            var cfg = {
                e:e,
                el: e.target
            };
            if(e.type =='focusout'){
                bindPropAfterFuns(blur4change,cfg);
            }
        }
    };
    var bindPropAfterFuns = function(arr,cfg){
        if(arr&& arr.length){
            if(typeof arr =='string'){
                arr = arr.split(',');
            }
            for(var i= 0,len =arr.length;i<len;i++){
                if(!arr[i]){
                    continue;
                }
                try{
                    var cdata = oui.biz.Tool.getClassAndFun(arr[i],cfg);
                    var param = $(cfg.e.target).attr('oui-e-param')||"";
                    oui.biz.Events.runGlobalFun({clz:cdata.clz ||"",fun:cdata.funName ||"",el: cfg.e.target,e:cfg.e,runFun:cdata.fun ||"",param:param});
                }catch(e){
                    if(arr[i].indexOf('.')>0){
                        var fun = eval(arr[i]);
                        fun&&fun(cfg);
                    }else{
                        var controlClz = $(cfg.e.target).closest('[oui-controller]').attr('oui-controller') ||"";
                        if(controlClz){
                            var fun = eval(controlClz+"."+arr[i]);
                            fun&&fun(cfg);
                        }
                    }

                }
            }
        }
    };
    /*** 输入类事件绑定 文本，文本域****/
    var changeFun4Input = function(e){
        var $el = $(e.target);
        /** 不是文本框或者 文本域，则退出***/
        if((!$el.is('input')) && (!$el.is('textarea')) ){
            return
        }
        var type = $el.attr('type');
        if(type =='checkbox' || type =='radio'){
            return ;
        }
        changeFun(e);
    };


    if(oui.browser.ie){
        $(document).on("keyup blur","textarea[bindprop]", changeFun4Input);
    }else{
        $(document).on("input propertychagne blur","textarea[bindprop]", changeFun4Input);
    }
    $(document).on("input propertychagne blur","input[bindprop]", changeFun4Input);
    $(document).on("change","select[bindprop],input[type=checkbox][bindprop],input[type=radio][bindprop]", changeFun);
})(window,window.$$||window.$);




