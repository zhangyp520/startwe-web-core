!(function(win){
    Vue.prototype.$router = win.oui.router;
    Vue.config.errorHandler = function(error,vm,info){

        //console.error(error,vm,info);
        //console.log(arguments);
        if(!vm.$errors){
            vm.$errors = [];
        }
        vm.$errors.push(error);
    };
    var app = new Vue({
        el: document.getElementById(oui_context.appId),
        data: function () {
            return {
                router:win.oui.router
            }
        },
        mounted:function(){

        },
        methods: {
            getSelected:function(){
                return this.router.path;
            },
            handleSelect : function(key, path) {
                //console.log(key, path)

                this.$router.push(key);
                //this.$router.push(key)
            }
        }
    });
    Vue.component('oui-include',{
        props: ['url','data','ref','type'],
        data: function() {
            return {
                currUrl:this.url,
                data:this.data,
                ref:this.ref,
                type:this.type,
                compFullName:null,
                comp:null
            }
        },
        created:function(){


        },
        methods:{
            init:function(){

            }
        },
        mounted:function(){
            var data ={};//vue include vue 的场景
            if(this.$parent.FullName){
                data = oui.getJsonAttr(this.$parent,this.data);//vue include vue 的场景
                if(typeof this.data =='object'){
                    data = this.data;
                }else if(typeof data =='string'){
                    data = oui.util.eval(this.$parent.FullName+'.'+this.data);
                }else{

                }
            }else if(this.$root.FullName){
                if(typeof this.data =='object'){
                    data = this.data;
                }else if(typeof this.data =='string'){
                    data = oui.util.eval(this.$root.FullName+'.'+this.data);
                }else{

                }
            }
            if(data){
                if(!data.notClone4Component){//不为组件克隆对象
                    var temp = {};
                    if(typeof data =='object'){
                        for(var k in data){
                            if(typeof data[k] =='function'){
                                temp[k] = data[k];
                            }
                        }
                    }
                    data = JSON.stringify(data);
                    data = JSON.parse(data);
                    //处理方法或者事件
                    for(var k in temp){
                        data[k] = temp[k];
                    }
                }

            }
            var params = oui.util.getParamsUrl(oui.getContextPath()+'index4vue.html#'+this.url);
            var path = params.path || this.url;
            var compOrThen = oui.util.loadComponent4Instance(path,data,params ,true);
            var me = this;

            if(compOrThen instanceof  Promise){
                compOrThen.then(function(resComp){
                    me.comp =resComp;

                    me.comp._ref = me.ref;
                    me.comp._dataPath= me.data;
                    me.comp._parentRef = me.$parent;
                    me.compFullName = me.comp.FullName;
                    me.$nextTick(function(){
                        oui.render4Instance(me.comp,me.$el);
                    });
                });
            }else{
                this.comp =compOrThen;
                this.comp._ref = this.ref;
                this.comp._dataPath= this.data;
                this.comp._parentRef = this.$parent;

                this.compFullName = this.comp.FullName;
                this.$nextTick(function(){
                    oui.render4Instance(this.comp,this.$el);
                });
            }


        },
        template:'<div class="vue-include" :data="data" :ref="ref" ></div>'
    });

    var oui =win.oui || {};
    /***
     * 用于vue include 处理 复杂对象include的场景
     * { //vue对象中这样使用
     *     getCache:oui.getCache4include,
     *     getData4Include:function(){
     *         return this.getCache('data4includeXXXX',{
     *             //需要传入组件的参数..... 这里是默认值
     *             a:1,
     *              //这里是更新回调，是在父组件中实现的
     *             onUpdate:function(k,v,ov,options){
     *
     *             }
     *         });
     *     },
     *     doSomething:function(){
     *         this.getData4Include().ref.a=2 //调用组件引用 对数据双向绑定的处理
     *     },
     *     onUpdate:function(key,v){ //如果父组件引入当前子组件时，会覆盖此方法；如果两处都有实现，则以父组件中定义的执行
     *         //这里是更新回调
     *     }
     * }
     * @param key
     * @param data
     * @returns {*}
     */
    oui.getCache4include = function (key,data){
        var me = this;
        if(arguments.length==0){
            return this._cache||{};
        }
        if(!this._cache){
            this._cache = {};
        }
        if(!this._cache[key]){
            this._cache[key] = {
                notClone4Component: true,//组件include时，不进行克隆处理
                bindProp:key,
                id:key,
                name:key
            };
            for(var k in data){
                this._cache[key][k] = data[k];
            }
            this._cache[key].isFirstGet= true;
            // me.$set(this._cache,key,this._cache[key]);
        }else{
            this._cache[key].isFirstGet=false;
        }
        console.log('cache:',key,this._cache[key]);
        return this._cache[key];
    };
    oui.destroyByCache  = function (key){
        var me = this;
        if(!key){
            return ;
        }
        var keys = [key];
        if(key.indexOf(',')>-1){
            keys = key.split(',');
        }
        oui.eachArray(keys,function (key){
            if(me._cache&& me._cache[key] ){
                if(me._cache[key].ref){
                    try{
                        me._cache[key].ref.destroyChildren&&me._cache[key].ref.destroyChildren();
                        // console.log('成功销毁:'+key);
                    }catch (err){
                        // console.log('销毁:'+key+' 失败');
                    }
                    try{
                        me._cache[key].ref.destroy&&me._cache[key].ref.destroy();
                        // console.log('成功销毁:'+key);
                    }catch (err){
                        // console.log('销毁:'+key+' 失败');
                    }
                    try {
                        me._cache[key] = null;
                        delete  me._cache[key];
                    }catch (e) {

                    }
                }
            }
        });
    };
    oui.destroyVueControllers = function (controllers){
        oui.eachArray(controllers||[],function (item){
            if(item){
                try{
                    var o = oui.parseJson(item);
                    o.destroy&&o.destroy();
                    if(o){
                        if(item.indexOf('oui.routerView.refs')>-1){
                            var key = item.replace('oui.routerView.refs.','').replace('.instance','');
                            if(oui.routerView.refs[key]){
                                oui.routerView.refs[key] = null;
                                delete oui.routerView.refs[key];
                            }
                        }
                        console.log('销毁对象成功');
                    }
                }catch (err){
                    if(item.indexOf('oui.routerView.refs')>-1){
                        var key = item.replace('oui.routerView.refs.','').replace('.instance','');
                        if(oui.routerView.refs[key]){
                            oui.routerView.refs[key] = null;
                            delete oui.routerView.refs[key];
                        }
                    }
                }
            }
        });
        //销毁无用对象 viewFullName 不存在 则说明已经被销毁了
        for(var k in oui.routerView.refs){
            if(oui.routerView.refs[k]&&oui.routerView.refs[k].instance &&(!oui.routerView.refs[k].instance.viewFullName)){
                if(oui.routerView.refs[k]){
                    oui.routerView.refs[k] = null;
                    delete oui.routerView.refs[k];
                }
            }
        }
    }

    win.oui = oui;
    oui.app =app;
})(window);