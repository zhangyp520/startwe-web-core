!(function(win){
    var oui = win.oui||{};
    win.oui=oui;
    //缓存 url路由对应的视图模板 ,key为url,value为{url,options}
    oui.viewsMap = {};
    //当前路由的视图
    oui.routerView =null;
    // 获取路由 内部viewid
    var getRouterViewInnerId = function(){
        var routerViewInnerId = (win.oui_context&&win.oui_context.routerViewInnerId)||"router-view-inner";
        return routerViewInnerId;
    };
    //获取 路由id
    var getRouterViewId = function(){
        var routerViewId = (win.oui_context&&win.oui_context.routerViewId)  || "routerView";
        return routerViewId;
    };
    /**
     * 组件渲染适配器
     * @type {{vue: {getConstructor: Function, render: Function}, art: {}}}
     */
    oui.componentAdapter = {
        //vue模板适配器
        'vue':{
            /**
             * 获取构造器
             * @param tplOptions
             */
            getConstructor:function(tplOptions){
                var clz = Vue.extend(tplOptions);
                clz.prototype.getView = function(){
                    var view = oui.util.eval(this.viewFullName);
                    return view;
                };
                clz.prototype.templateType='vue';
                //刷新当前组件
                clz.prototype.refresh = function(){
                    var view = this.getView();
                    view&&view.refresh&&view.refresh();
                };
                /***
                 * 获取依赖 子组件
                 * @param name
                 * @returns {*}
                 */
                clz.prototype.getRef = function(name){
                    var view = this.getView();
                    if(!view.refs){
                        view.refs = {};
                    }
                    return view.refs[name];
                };
                clz.prototype.putRef = function(name,ref){
                    var view = this.getView();
                    if(!view.refs){
                        view.refs = {};
                    }
                    view.refs[name] = ref;
                };
                clz.prototype.updateData = function(data){
                    if(data){
                        //合并当前数据到子组件
                        var temp = oui.getJsonAttr(data,this._dataPath);//vue include vue 的场景
                        temp = JSON.stringify(temp);
                        temp = JSON.parse(temp);
                        for(var k in temp){
                            this[k] = temp[k];
                        }
                    }
                };
                clz.prototype.destroy = function (){
                    this.getView().destroy&&this.getView().destroy();
                }
                clz.prototype.destroyChildren = function (){
                    this.getView().destroyChildren && this.getView().destroyChildren();
                }
                clz.prototype.$current = function(){
                    return this;
                };
                clz.prototype._data = function(){
                    return this;
                };
                return clz;
            },
            /**
             * 创建实例
             * @param clz
             * @param options
             * @returns {*}
             */
            createInstance:function(clz,options,isInclude){
                var id = 'v'+oui.getUUIDLong();//产生uuid 作为组件id
                var oDiv = new clz();
                for(var k in options){
                    if(k =='ref'){
                        continue;
                    }
                    oDiv[k] = options[k];
                }

                oDiv._id_ = id;
                oDiv._activeTabId = oui.getPortalActiveTabId();
                if(isInclude){
                    oDiv.FullName = 'oui.routerView.refs.'+id+'.instance';
                    oDiv.viewFullName ='oui.routerView.refs.'+id;
                    if(!oui.routerView){
                        oui.routerView={};
                    }
                    if(!oui.routerView.refs){
                        oui.routerView.refs ={};
                    }

                    oui.routerView.refs[id] = {
                        _id_:id,
                        instance:oDiv,
                        refs:{},
                        _activeTabId:oDiv._activeTabId,
                        FullName:'oui.routerView.refs.'+id,
                        refresh:function(){

                            for(var r in this.refs){
                                //更新子组件，再刷新组件
                                if(this.refs[r]&&this.refs[r].instance&&this.refs[r].instance.updateData){
                                    this.refs[r].instance.updateData(this.instance);
                                }
                                if(this.refs[r]&&this.refs[r].instance&&this.refs[r].instance.refresh){
                                    this.refs[r].instance.refresh();
                                }
                            }
                        },
                        destroy:function(){
                            var _id = this._id_;
                            for(var r in this.refs){
                                this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                                this.refs[r] =null;
                                delete this.refs[r];
                            }
                            try{
                                this.instance.$destroy&&this.instance.$destroy(true);
                                this.instance.$el.parentNode.removeChild(this.instance.$el);
                                for(var k in this.instance){
                                    this.instance[k] = null;
                                    delete this.instance[k];
                                }
                                this.instance = null;
                                oui.routerView.refs[_id]=null;
                                delete oui.routerView.refs[_id];
                            }catch(err){

                            }
                        },
                        destroyChildren:function(){
                            for(var r in this.refs){
                                this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                                this.refs[r] =null;
                                delete this.refs[r];
                            }
                        }
                    };
                }else{
                    oDiv.FullName = 'oui.routerView.instance';
                    oDiv.viewFullName ='oui.routerView';
                    oui.routerView = oui.routerView||{};
                    oui.routerView.instance = oDiv;
                    oui.routerView.FullName ='oui.routerView';
                    oui.routerView.refs =  oui.routerView.refs||{};
                    //刷新当前
                    oui.routerView.refresh = function(){

                        //this.instance.updateData&&this.instance.updateData();
                        //this.instance.$forceUpdate&&this.instance.$forceUpdate();
                        //当前作用域 this.instance

                        for(var r in this.refs){
                            //更新子组件，再刷新组件
                            if(this.refs[r]&&this.refs[r].instance&&this.refs[r].instance.updateData){
                                this.refs[r].instance.updateData(this.instance);
                            }
                            if(this.refs[r]&&this.refs[r].instance&&this.refs[r].instance.refresh){
                                this.refs[r].instance.refresh();
                            }
                        }
                    };
                    oui.routerView.destroy = function(){
                        //清空当前路由下的所有组件
                        for(var r in this.refs){
                            this.refs[r] &&this.refs[r].destroy&&this.refs[r].destroy();
                            this.refs[r] =null;
                            delete this.refs[r];
                        }
                        try{
                            //清空路由下的根组件
                            this.instance.$destroy&&this.instance.$destroy(true);
                            this.instance.$el.parentNode.removeChild(this.instance.$el);
                            for(var k in this.instance){
                                this.instance[k] = null;
                                delete this.instance[k];
                            }
                            this.instance = null;

                        }catch(err){

                        }
                    };
                    oui.routerView.destroyChildren = function (){
                        for(var r in this.refs){
                            this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                            this.refs[r] =null;
                            delete this.refs[r];
                        }
                    }
                }
                //switch 特殊情况处理
                var value = oDiv.value;
                //值为true的情况的vue组件 mount
                oDiv.$mount(); //必须使用$mount()进行挂载，否则所有的生命周期的函数都不会执行
                //错误信息记录，并响应出来
                if(oDiv.$errors&&oDiv.$errors.length){
                    console.error(oDiv.$errors);
                }
                if(value =='true'){
                    oDiv.value = true;
                }else if(value=='false'){
                    oDiv.value = false;
                }
                options.ref =oDiv;
                oDiv.$el.setAttribute && oDiv.$el.setAttribute('oui-controller',oDiv.FullName);
                return oDiv;
            },
            /***
             * 渲染 include组件
             * @param compClazz
             * @param options
             * @param success
             * @param error
             * @param el
             */
            render4include:function(compClazz,options,params,success,error,el){

                if(!oui.routerView){
                    oui.routerView={
                    };
                }
                var oDiv = this.createInstance(compClazz,options,true); //必须使用$mount()进行挂载，否则所有的生命周期的函数都不会执行
                if(oDiv.$router){
                    if(params){
                        for(var k in params){
                            oDiv.$router[k] = params[k];
                        }
                    }
                }else{
                    if(params){
                        oDiv.$router= params;
                    }
                }
                if(oDiv.$errors&&oDiv.$errors.length){
                    //实例化时存在错误
                    console.error(params.path,oDiv.$errors[0]);
                }
                this.render4Instance(oDiv,el,success,error);
            },
            render4Instance:function(instance,el,success,error){
                try{

                    var id = instance._id_;

                    if(el){
                        var parentEl = el.parentNode;
                        //获取 当前 组件的父组件
                        var refName =instance.ref || $(el).attr('ref')||id;
                        var parentController = oui.util.getController(parentEl);
                        if(parentController&&parentController.getView){
                            var parentView = parentController.getView();
                            if(parentView&& parentView.refs){
                                parentView.refs[refName] = oui.routerView.refs[id]; //父子组件依赖处理
                            }else{
                                console.error('父组件所在的View不存在');
                            }
                        }
                    }



                    if(instance.FullName =='oui.routerView.instance'){
                        document.getElementById(getRouterViewId()).innerHTML='';
                        document.getElementById(getRouterViewId()).appendChild(instance.$el);
                    }else{
                        el.parentNode.replaceChild(instance.$el,el);
                    }
                    oui.parse({
                        container:instance.$el,
                        callback:function(){
                            try{
                                success&&success(instance);
                            }catch(err){
                                console.error(err);
                                error&&error(err);
                            }

                        }
                    });
                }catch(err){
                    console.error(err);
                    error&&error(err);

                }
            },
            /***
             * 路由渲染方法
             * @param compClazz
             * @param options
             * @param success
             * @param error
             */
            render:function(compClazz,options,params,success,error){
                try{
                    //先销毁再创建
                    if(oui.routerView && oui.routerView.destroy){
                        oui.routerView.destroy();
                    }
                    var oDiv = this.createInstance(compClazz,options); //必须使用$mount()进行挂载，否则所有的生命周期的函数都不会执行
                    if(oDiv.$router){
                        if(params){
                            for(var k in params){
                                oDiv.$router[k] = params[k];
                            }
                        }
                    }else{
                        if(params){
                            oDiv.$router= params;
                        }
                    }
                    this.render4Instance(oDiv,null,success,error);
                }catch(err){
                    error&&error(err,oui.routerView);
                }
            }
        },
        // art模板适配器
        'art':{
            /***
             * 获取 art构造器
             * @param tplOptions
             * @returns {Function}
             */
            getConstructor:function(tplOptions){
                //console.log('art 构造器');
                var clz = function(cfg){
                    for(var k in cfg){
                        this[k] = cfg[k];
                    }
                    this.created&&this.created();//创建时触发
                };
                clz.prototype = tplOptions;
                var temp = tplOptions.data;
                clz.prototype.__tempData__= temp;
                clz.prototype._data = function(){
                    return this;
                };
                clz.prototype.data = function(){
                    var data = null;
                    if(this.__tempData__){
                        data = this.__tempData__.call(this);//处理默认值
                        for(var k in data){
                            if(typeof this[k] !='undefined'){
                                data[k] = this[k];
                            }
                        }
                    }else{
                        data = {};
                    }
                    return data;
                };
                if(tplOptions.methods){
                    for(var k in tplOptions.methods){
                        clz.prototype[k] = tplOptions.methods[k];
                    }
                }
                clz.prototype.updateData = function(data){
                    if(data){
                        //合并当前数据到子组件
                        var temp = oui.getJsonAttr(data,this._dataPath);//vue include vue 的场景
                        temp = JSON.stringify(temp);
                        temp = JSON.parse(temp);
                        for(var k in temp){
                            this[k] = temp[k];
                        }
                    }
                };
                clz.prototype.destroy = function (){
                    this.getView().destroy&&this.getView().destroy();
                }
                clz.prototype.destroyChildren = function (){
                    this.getView().destroyChildren && this.getView().destroyChildren();
                };
                clz.prototype.getView = function(){
                    var view = oui.util.eval(this.viewFullName);
                    return view;
                };
                //刷新当前组件
                clz.prototype.refresh = function(){
                    var view = this.getView();
                    view&&view.refresh&&view.refresh();
                };
                /***
                 * 获取依赖 子组件
                 * @param name
                 * @returns {*}
                 */
                clz.prototype.getRef = function(name){
                    var view = this.getView();
                    if(!view.refs){
                        view.refs = {};
                    }
                    return view.refs[name];
                };
                clz.prototype.putRef = function(name,ref){
                    var view = this.getView();
                    if(!view.refs){
                        view.refs = {};
                    }
                    view.refs[name] = ref;
                };
                clz.prototype.$current = function(){
                    return this;
                };
                clz.prototype.render = template.compile(tplOptions.template);
                return clz;
            },
            createInstance:function(compClazz,options,isInclude){
                var id = 'v'+ oui.getUUIDLong();
                var instance = new compClazz(options);
                instance._id_ = id;
                instance._activeTabId = oui.getPortalActiveTabId();

                if(isInclude){
                    if(!oui.routerView){
                        oui.routerView={};
                    }
                    if(!oui.routerView.refs){
                        oui.routerView.refs ={};
                    }
                    instance.FullName = 'oui.routerView.refs.'+id+'.instance';
                    instance.viewFullName =  'oui.routerView.refs.'+id;
                    oui.routerView.refs[id]= {
                        FullName:'oui.routerView.refs.'+id,
                        _id_:id,
                        instance:instance,
                        refs:{},
                        _activeTabId:instance._activeTabId,
                        getData:function(){
                            var data = this.instance.data();
                            data._styleTemplate_ = this.instance.styleTemplate;
                            var me = this;

                            data.$current = function(){
                                return me.instance;
                            };

                            return data;
                        },
                        refresh:function(){
                            if(!this._ouiId_){
                                return;
                            }
                            var control = oui.getByOuiId(this._ouiId_);
                            try{
                                WatchJS.unwatch&&WatchJS.unwatch(control.getMap(),'data');
                            }catch(err){}
                            control.attr('data',this.getData());
                            control&&control.render();//渲染控件
                        },
                        _init:function(){
                            var ouiId = $('#control_include-'+this._id_).attr('ouiid');
                            this._ouiId_ = ouiId;
                            this.instance.mounted&&this.instance.mounted();
                        },

                        destroy:function(){
                            for(var r in this.refs){
                                this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                                this.refs[r] =null;
                                delete this.refs[r];
                            }
                            try{
                                var  _id = this._id_;
                                this.instance.destroy && this.instance.destroy();

                                oui.clearByContainer('#control_include-'+this._id_);

                                var ouiId = $('#control_include-'+this._id_).attr('ouiid');
                                oui.clearByOuiId(ouiId);

                                document.getElementById('control_include-'+this._id_).innerHTML='';

                                for(var t in this){
                                    this[t] =null;
                                    delete this[t];
                                }
                                oui.routerView.refs[_id]=null;
                                delete oui.routerView.refs[_id];
                            }catch(err){

                            }
                        },
                        destroyChildren:function(){
                            for(var r in this.refs){
                                this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                                this.refs[r] =null;
                                delete this.refs[r];
                            }
                        }
                    };
                }else{
                    if(oui.routerView&&oui.routerView.destroy){
                        oui.routerView.destroy();
                    }
                    instance.FullName = 'oui.routerView.instance';
                    instance.viewFullName ='oui.routerView';
                    oui.routerView = {
                        FullName:'oui.routerView',
                        instance:instance,
                        refs:{},
                        getData:function(){
                            var data = this.instance.data();
                            data._styleTemplate_ = this.instance.styleTemplate;
                            var me = this;
                            data.$current = function(){
                                return me.instance;
                            };
                            return data;
                        },
                        refresh:function(){
                            var control = oui.getByOuiId(this._ouiId_); 
                            control.attr('data',this.getData());
                            control&&control.render();//渲染控件
                        },
                        _init:function(){
                            var ouiId = $('#control_'+getRouterViewInnerId()).attr('ouiid');
                            this._ouiId_ = ouiId;
                            this.instance.mounted&&this.instance.mounted();
                        },

                        destroy:function(){
                            //清空当前路由下的所有组件
                            for(var r in this.refs){
                                this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                                this.refs[r] =null;
                                delete this.refs[r];
                            }

                            try{
                                this.instance.destroy&&this.instance.destroy();

                                oui.clearByContainer('#'+getRouterViewId());
                                document.getElementById(getRouterViewId()).innerHTML='';
                                for(var t in this){
                                    this[t] =null;
                                    delete this[t];
                                }
                            }catch(err){

                            }
                        },
                        destroyChildren:function(){
                            for(var r in this.refs){
                                this.refs[r]&&this.refs[r].destroy&&this.refs[r].destroy();
                                this.refs[r] =null;
                                delete this.refs[r];
                            }
                        }
                    };
                }

                options.ref = instance;
                return instance;
            },

            //渲染实例
            render4Instance:function(instance,el,success,error){
                if(instance.FullName =='oui.routerView.instance'){
                    //router
                    document.getElementById(getRouterViewId()).innerHTML='<oui-view id="'+getRouterViewInnerId()+'" oui-controller="oui.routerView.instance" data="oui.routerView.getData()"></oui-view>' +
                        '<script type="text/html" id="'+getRouterViewInnerId()+'-tpl">  ' +
                        instance.template+
                        '{{=_styleTemplate_}}'+ //追加样式
                        '</script>';
                    oui.parse({
                        container:'#'+getRouterViewId(),
                        callback:function(){
                            try{
                                oui.routerView._init();
                                success&&success(oui.routerView);
                            }catch(err){
                                console.error(err);
                                error&&error(err,oui.routerView);
                            }

                        }
                    });


                }else{
                    //include
                    var id = instance._id_;

                    var parentEl = el.parentNode;
                    //获取 当前所在oui-view controller实例
                    var refName =instance.ref || $(el).attr('ref')||id;

                    var parentController = oui.util.getController(parentEl);
                    if(parentController&&parentController.getView){
                        var parentView = parentController.getView();
                        if(parentView&& parentView.refs){
                            parentView.refs[refName] = oui.routerView.refs[id]; //父子组件依赖处理
                        }else{
                            console.error('父组件所在的View不存在');
                        }
                    }
                    $(el).ready(function(){
                        $(el).replaceWith('<oui-view id=\'include-'+id+'\'' +
                            'oui-controller=\'oui.routerView.refs.'+id+'.instance\'' +
                            'data=\'oui.routerView.refs.'+id+'.getData()\'>' +
                            '</oui-view>' +
                            '<script type="text/html" id="include-'+id+'-tpl">  ' +
                            instance.template+
                            '{{=_styleTemplate_}}'+ //追加样式
                            '</script>');
                        el =$('#include-'+id)[0];
                        oui.parse({
                            container:parentEl,
                            callback:function(){
                                try{
                                    el = $('#control_include-'+id)[0];
                                    oui.routerView.refs[id]._init();
                                    success&&success(oui.routerView.refs[id]);
                                }catch(err){
                                    console.error(err);
                                    error&&error(err,oui.routerView.refs[id]);
                                }
                            }
                        });
                    });
                }
            },
            /**
             * 渲染include模板
             * @param compClazz
             * @param options
             * @param success
             * @param error
             * @param el
             */
            render4include:function(compClazz,options,params,success,error,el){
                //通过oui-view来渲染模板
                //console.log('渲染 artTemplate');
                if(!oui.routerView){
                    oui.routerView={};
                }
                try{
                    var instance =this.createInstance(compClazz,options,true);
                    if(instance.$router){
                        if(params){
                            for(var k in params){
                                instance.$router[k] = params[k];
                            }
                        }
                    }else{
                        if(params){
                            instance.$router= params;
                        }
                    }
                    var id = instance._id_;
                    var parentEl = el.parentNode;
                    //获取 当前所在oui-view controller实例
                    var refName =options.ref || $(el).attr('ref')||id;
                    var parentController = oui.util.getController(parentEl);
                    if(parentController&&parentController.getView){
                        var parentView = parentController.getView();
                        if(parentView&& parentView.refs){
                            parentView.refs[refName] = oui.routerView.refs[id]; //父子组件依赖处理
                        }else{
                            console.error('父组件所在的View不存在');
                        }
                    }else{
                        console.error('父组件所在的View不存在');
                    }
                    var useVDomStr ='';
                    if(instance.useVDom || (typeof instance.useVDom=='undefined')){ //默认使用虚拟DOM
                        useVDomStr ='useVDom=\'true\' ';
                    }
                    $(el).replaceWith('<oui-view id=\'include-'+id+'\'' +
                        useVDomStr+
                        'oui-controller=\'oui.routerView.refs.'+id+'.instance\'' +
                        'data=\'oui.routerView.refs.'+id+'.getData()\'>' +
                        '</oui-view>' +
                        '<script type="text/html" id="include-'+id+'-tpl">  ' +
                        instance.template+
                        '{{=_styleTemplate_}}'+ //追加样式
                        '</script>');
                    el =$('#include-'+id)[0];
                    oui.parse({
                        container:parentEl,
                        callback:function(){
                            try{
                                el = $('#control_include-'+id)[0];
                                oui.routerView.refs[id]._init();
                                success&&success(oui.routerView.refs[id]);
                            }catch(err){
                                console.error(err);
                                error&&error(err,oui.routerView.refs[id]);
                            }
                        }
                    });
                }catch(err){
                    console.error(err);
                    error&&error(err);
                }

            },
            /***
             * 渲染router 模板
             * @param compClazz
             * @param options
             * @param success
             * @param error
             */
            render:function(compClazz,options,params,success,error){
                //通过oui-view来渲染模板
                //console.log('渲染 artTemplate');
                try{
                    var instance = this.createInstance(compClazz,options);
                    if(instance.$router){
                        if(params){
                            for(var k in params){
                                instance.$router[k] = params[k];
                            }
                        }
                    }else{
                        if(params){
                            instance.$router= params;
                        }
                    }
                    document.getElementById(getRouterViewId()).innerHTML='<oui-view id="'+getRouterViewInnerId()+'" oui-controller="oui.routerView.instance" data="oui.routerView.getData()"></oui-view>' +
                        '<script type="text/html" id="'+getRouterViewInnerId()+'-tpl">  ' +
                        instance.template+
                        '{{=_styleTemplate_}}'+ //追加样式
                        '</script>';  
                    oui.parse({
                        container:'#'+getRouterViewId(),
                        callback:function(){
                            try{
                                oui.routerView._init();
                                success&&success(oui.routerView);
                            }catch(err){
                                console.error(err);
                                error&&error(err,oui.routerView);
                            }

                        }
                    });
                }catch(err){
                    console.error(err);
                    error&&error(err);
                }

            }
        }
    };

    /***
     * 根据url 和 参数 获取component实例
     * @param url
     * @param options
     */
    oui.getComponent = function(url,options,compParams,isInclude){
        /**资源不存在则执行 缓存 **/
        if((!this.viewsMap[url]) || (!this.viewsMap[url].options)){
            throw new Error('url['+url+']资源没有缓存');
            return null ;
        }

        var viewMap = this.viewsMap[url];
        var tplOptions = viewMap.options||{};
        var templateType = tplOptions.templateType ||'vue';//默认为vue模板

        var compClazz=null;
        if(viewMap.clz){ //已经缓存类构造器
            compClazz = viewMap.clz;
        }else{
            if(oui.componentAdapter[templateType]){
                compClazz = oui.componentAdapter[templateType].getConstructor(tplOptions);
            }
            viewMap.clz = compClazz;
        }

        if(compClazz ==null){
            console.log('资源['+url+']没有配置组件构造器适配方法');
            return null;
        }
        if(oui.componentAdapter[templateType].createInstance){
            var comp= oui.componentAdapter[templateType].createInstance(compClazz,options,isInclude);

            if(!comp.$router){
                comp.$router = oui.parseJson(oui.parseString(oui.router));
                comp.$router.query= compParams.query;
                comp.$router.params = compParams.params;
                comp.$router.path = compParams.path;
                comp.$router.currentUrl=compParams.currentUrl;
            }else{
                if(isInclude){
                    comp.$router = oui.parseJson(oui.parseString(comp.$router));
                    comp.$router.query= compParams.query;
                    comp.$router.params = compParams.params;
                    comp.$router.path = compParams.path;
                    comp.$router.currentUrl=compParams.currentUrl;

                    // console.log('router 内嵌组件判断');
                    // console.log(oui.router == comp.$router);
                    // console.log(oui.router);
                    // console.log(comp.$router);
                }
            }
            return comp;

        }else{
            console.log('资源['+url+']没有配置组件createInstance适配方法');
        }
        return null;
    };
    /***
     * 渲染组件实例
     * @param instance
     * @param el
     */
    oui.render4Instance = function(instance,el){
        var templateType = (instance&&instance.templateType&&instance.templateType)||'vue';
        oui.componentAdapter[templateType].render4Instance&&oui.componentAdapter[templateType].render4Instance(instance,el);
    };
    /***
     * 渲染 url组件
     * @param url
     * @param options
     * @param el 替换渲染的dom
     * @param success
     * @param error
     */
    oui.renderComponent = function(url,options,params,success,error,el){
        /**资源不存在则执行 缓存 **/
        if((!this.viewsMap[url]) || (!this.viewsMap[url].options)){
            throw new Error('url['+url+']资源没有缓存');
            return ;
        }


        var viewMap = this.viewsMap[url];
        var tplOptions = viewMap.options||{};
        //console.log('渲染解析的对象');
        //console.log(tplOptions);
        var templateType = tplOptions.templateType ||'vue';//默认为vue模板

        var compClazz=null;
        if(viewMap.clz){ //已经缓存类构造器
            compClazz = viewMap.clz;
        }else{
            if(oui.componentAdapter[templateType]){
                compClazz = oui.componentAdapter[templateType].getConstructor(tplOptions);
            }
            viewMap.clz = compClazz;
        }

        if(compClazz ==null){
            console.log('资源['+url+']没有配置组件构造器适配方法');
            error&&error(url,viewMap,options,el);
            return;
        }
        if(el){ // include
            if(oui.componentAdapter[templateType].render4include){
                oui.componentAdapter[templateType].render4include(compClazz,options,params,success,error,el);
            }else{
                console.log('资源['+url+']没有配置组件render4include适配方法');
                error&&error(url,viewMap,options,el);
            }
        }else{ //router
            if(oui.componentAdapter[templateType].render){
                oui.componentAdapter[templateType].render(compClazz,options,params,success,error);
            }else{
                console.log('资源['+url+']没有配置组件render适配方法');
                error&&error(url,viewMap,options,el);
            }
        }

    };

})(window);