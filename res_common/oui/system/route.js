/*
* author: https://github.com/biaochenxuying/route
* 使用方法：
  var config = {
      routerViewId: '#routerView', // 路由切换的挂载点 id
      stackPages: true, // 多级页面缓存
      animationName: "slide", // 多级页面缓存
      routes: [
          // {
          //   path: "/home",
          //   name: "home",
          //   callback: function(transition) {
          //       home()
          //   }
          // }
      ]
  }
  1：初始化 Router.init()
  2：跳转  router.push('/a/b/c');
  //如果无配置，默认为全路径解析 ajax获取模板代码然后动态加载组件渲染

*/

!(function(win) {

    var oui =win.oui ||{};
    win.oui = oui;
    var util =win.oui.util;
    function Router() {
        this.routes = {};
    }
    Router.prototype.route = function (path, callback) {
        this.routes[path] = callback || function () { };
    };
    /**
     * 处理 url参数
     * @param data
     * @returns {*}
     */
    Router.prototype.param =function(data){

        if ( typeof data != 'object') {
            return( ( data == null ) ? "" : data.toString() );
        }
        var buffer = [];
        // Serialize each key in the object.
        for ( var name in data ) {
            if ( ! data.hasOwnProperty( name ) ) {
                continue;
            }
            var value = data[ name ];
            buffer.push(
                encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
            );
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer.join( "&" ).replace( /%20/g, "+" );
        return( source );
    };
    Router.prototype.push = function(path,query,includeEl){
        //console.log('path :', path)
        var paramsStr=this.param(query);
        if(paramsStr){
            paramsStr= '&'+paramsStr;
        }
        this.includeEl = includeEl;
        if (path.indexOf("?") !== -1) {
            window.location.hash = path + '&key=' + util.genKey()+'&contextPath='+oui.getContextPath()+paramsStr;
        } else {
            window.location.hash = path + '?key=' + util.genKey()+'&contextPath='+oui.getContextPath()+paramsStr;
        }
    };
    Router.prototype.refresh = function () {
        //console.log('url change');
        //console.log(location.hash);


        var params = util.getParamsUrl();
        this.query = params.query;
        this.path = params.path;
        this.params = params.params;
        this.currentUrl = params.currentUrl;

        if(!this.path){
            //当前没有路由，则不做处理
            return;
        }
        var me = this;
        //如果存在自定义路由配置，则执行自定义路由逻辑，否则执行自动路由
        if(this.refreshBefore){
            var flag = this.refreshBefore();
            if(!flag){
                return ;
            }
        }
        if(this.routes[this.path]){
            this.routes[this.path]();
        }else{
            this.startTime = new Date(); // router 改变时间
            //存在点，则就说明是后缀名类型的模板
            var pathSuffix = this.path.substring(0,this.path.indexOf('.html'));
            if(pathSuffix.indexOf('.')>0){ // 指定模板类型的后缀
                //尝试通过ajax获取视图模板
                //跟上文件名后缀
                NProgress.start();

                util.loadComponent(this.path,{
                    $router:params
                },params,this.includeEl,function(options){
                    NProgress.set(0.5);
                    NProgress.done();
                    me.endTime = new Date();
                    //成功回调
                },function(error){
                    //失败回调
                    NProgress.set(0.5);
                    NProgress.done();
                    console.log(error);
                    console.log('路由['+me.currentUrl+']资源加载异常!!!');
                });
            }else{//原生html页面跳转，无模板类型的页面自动转向
                var url = this.path;
                var url4load = url;
                var contextPath = oui.getContextPath();
                if(url.indexOf('/')==0){ //以斜杠开头
                    if(url.indexOf(contextPath)!=0){
                        url4load= contextPath+url.substring(1);
                    }
                }else{//以相对路径 或者http路径开头
                    if(url.indexOf('http')!=0){//以相对路径开头
                        url4load = contextPath+url;
                    }
                }

                if(window.location.href ==this.currentUrl.substring(1)){
                    return ;
                }
                if(this.currentUrl.indexOf('?')>0){
                    url4load = url4load + this.currentUrl.substring(this.currentUrl.indexOf('?'));
                }
                window.location.replace( url4load);
            }
        }
    };
    Router.prototype.init = function () {
        var params = util.getParamsUrl();
        this.query = params.query;
        this.path = params.path;
        this.params = params.params;
        this.currentUrl = params.currentUrl;
        window.addEventListener('load', this.refresh.bind(this), false);
        window.addEventListener('hashchange', this.refresh.bind(this), false);
    };
    //默认文件全路径自动路由机制
    win.Router = Router;
    win.oui.router = new Router();
    win.oui.router.init();


})(window);
