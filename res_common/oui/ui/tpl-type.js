!(function (window,$) {
  oui.TplTypeEnum = {
    artTemplate:{
      value:1,
      name:'artTemplate',
      /*****
       * 模板编译并返回artTemplate编译函数
       * @param tpl
       * @returns {*|*|*|*}
       */
      compile:function (tpl) {
        return template.compile(tpl);
      },
      beforeRender:function(control,el){

      },
      render:function(control){

      },
      afterRender:function(control){

      },
      /***
       *  根据控件和控件类 渲染模板返回html内容
       * @param control
       * @param clazz
       * @returns {*}
       */
      getHtml:function(control,clazz,right){
         if(right){
             return clazz._getHtml[right+control.attr('showType')](control.getMap());
         }else{
           var right = control.attr('right')||'';
           return clazz._getHtml[right+control.attr('showType')](control.getMap());
         }
      }
    },
    vue:{
      value:2,
      name:'vue',
      /******
       * vue组件直接返回div占位即可,在render渲染前产生vue对象缓存并进行dom绑定
       *
       * @param control
       * @param clazz
       */
      getHtml:function(control,clazz,right){
        var controlOuiId = control.attr('ouiId');
        return '<div v-id="'+controlOuiId+'"></div>';
      },

      compile:function (tpl) {
        return oui.Vue.compile(tpl);
      },
      /** vue引擎 控件渲染前处理****/
      beforeRender:function(control,el){
      },
      /** vue引擎 控件渲染处理,绑定控件的数据与vue模板****/
      render:function(control){
        var clazz = control.constructor;
        var right = control.attr('right')||"";
        var render = clazz._getHtml[right+control.attr('showType')]; //获取缓存的渲染模板
        var data = control.getMap();
        //控件属性, 事件,方法维护由开发组件的人员维护
        // 事件名,方法名,属性名相互不能重复
        var eventNames = control.findEventNames();//事件维护
        var methodNames =control.findMethodNames();//方法维护
        var names = eventNames.concat(methodNames);
        var methods ={
          //获取当前控件
          getControl:function () {
            var ouiId = this.ouiId;
            return oui.getByOuiId(ouiId);
          }
        };
        /** 便利方法名和事件名 动态创建 vue的方法绑定*****/
        oui.eachArray(names,function (item,index) {
          if(!control[item]){
            return;
          }
          var tempFun = function () {
            var funName = arguments.callee.__funName__;
            var currControl = this.getControl();
            currControl[funName].apply(currControl, arguments);
          };
          tempFun.__funName__ = item;
          methods[item] = tempFun;
        });
        if(control.vue){

          control.vue.$destroy && control.vue.$destroy();
          control.vue = null;

        }
        control.vue = new oui.Vue({
          el:$(control.getEl()).children()[0],
          data:data,
          // watch:{value:function () {
          //     console.log(this);
          // }},
          methods:methods,
          render:render.render
        });
      },
      /** vue引擎 控件渲染后处理****/
      afterRender:function(control){

      }
    },
    react:{
      value:3,
      name:'react',
      compile:function (tpl) {
        throw new Error('目前不支持React模板');
        return oui.React.compile(tpl);
      }
    }
    // TODO 其它模板框架在这里扩展
  };
  oui.findTplTypeEnumByValue = function(value){
    var tplTypes = oui.TplTypeEnum;
    for(var i in tplTypes){
      if(tplTypes[i] && ((tplTypes[i].value+'')==(value+''))){
        return tplTypes[i];
      }
    }
    return null;
  };
})(window,window.$$||window.$);




