(function(win){
  var ctrl = oui.$.ctrl;
  var constant =oui.$.constant;
  var common_attrs = "id,name,type,cls,bindProp,style,data,showType,otherAttrs,onUpdate,onAfterUpdate,parentControlId,parentControlName,weakDependence,script4onChange,oui-controller";

  var common_events="onUpdate";
  var common_methods="render";
  /**
   * 抽象类定义
   */
  var Control = function(cfg) {
    var map ={
      isPc:(!oui.os.mobile),
      clickName:(!oui.os.mobile)?'onclick':'onTap',
      showType:"0"
    };//装所有控件属性
    //right :edit,readOnly,hidden,design
    this._map_ = map;
    this.getMap = getMap;//获取所有控件属性
    this.attr = attr;//暴露控件属性获取与设置的接口
    this.attr(cfg);//初始化构造参数
    this.eventNames = common_events;
    this.methodNames = common_methods;
    this.attrs =common_attrs;//控件公共属性列表
    this.getEl = getEl;//获取当前控件元素
    this.getHtml = getHtml;//暴露获取控件最终HTML的接口
    this.render = render;//渲染控件元素
    this.putElAttr2Control = putElAttr2Control;//根据对象属性列表设置当前控件属性缓存
    this.clear = clear; //清楚缓存对象
    this.triggerUpdate = triggerUpdate;
    this.triggerAfterUpdate = triggerAfterUpdate; //值改变 后执行事件 一般 失去焦点，下拉、单选 、多选 则是 triggerUpdate后执行
    this.hasChildrenControl = hasChildrenControl;//判断当前控件是否有子控件列表
    this.change4enumControl = change4enumControl; //下拉，单选，多选 枚举项改变后触发
    this.getView = getView;// 获取当前控件所属视图
    this.getSourceHtml = getSourceHtml; //获取原始代码中配置html内容
    this.getSourceHtmlEscape = getSourceHtmlEscape;//获取转义后的html
    this.getSourceHtmlEscapeRuntime = getSourceHtmlEscapeRuntime; //获取运行态源码
    this.filterEnumDataByParentControlValue = filterEnumDataByParentControlValue;// 过滤当前控件的待选项(根据父控件的值)
    this.findEventNames = findEventNames;
    this.findMethodNames = findMethodNames;
  };
  var getMap = function(){
    return this._map_;
  };
  var findEventNames = function () {
    var eventNames= this.eventNames;
    if(!eventNames){
      return [];
    }
    return eventNames.split(',');
  };
  var findMethodNames = function () {
    var methodNames= this.methodNames;
    if(!methodNames){
      return [];
    }
    return methodNames.split(',');
  };
  /***判断当前控件是否有子控件 **/
  var hasChildrenControl = function(){
    var id = this.attr('id');
    var name = this.attr('name');
    var flag = oui.hasChildrenControl(id) || oui.hasChildrenControl(name);
    if(!flag){
      var $Parser = oui.$.Parser;
      var ids = $Parser.ids||[];
      var curr = oui.findOneFromArrayBy(ids,function(ouiId){
        var curr = oui.getByOuiId(ouiId);
        if(curr){
          var parentControlId = curr.attr('parentControlId');
          var parentControlName = curr.attr('parentControlName');
          if( parentControlId&&(parentControlId ==id) ){
            $Parser.hasChildrenControlIdMap[id] = true;
            return true;
          }
          if( parentControlName&&(parentControlName ==name)){
            $Parser.hasChildrenControlNameMap[name] = true;
            return true;
          }
        }
      });
      if(curr){
        flag = true;
      }
    }
    return flag;
  };
  /*** 值改变时触发 枚举级联的控件渲染******/
  var change4enumControl = function(){
    var isEnumControl = this.isEnumControl;
    if(!isEnumControl){
      return ;
    }
    var id = this.attr('id');
    var value = this.attr('value');
    var name = this.attr('name');
    /**没有子控件则返回 **/
    if(!this.hasChildrenControl()){
      return ;
    }
    var controls = oui.getChildrenControlsById(id) ||[];
    var controls4name = oui.getChildrenControlsByName(name) ||[];
    controls = controls.concat(controls4name);
    //判断当前 枚举控件 是否在条件组件中
    var otherAttrs = this.attr('otherAttrs') ||'{}';
    otherAttrs = oui.parseJson(otherAttrs);
    /*** 单独处理 在条件组件中的 下拉、单选 等控件,清理非条件组件下的级联控件****/
    if(otherAttrs && otherAttrs.conditionOuiId){
      //在条件组件中，则进行 判断条件组件中的字段之间级联处理
      var tempControls = [];
      var conditionControl = oui.getByOuiId(otherAttrs.conditionOuiId);
      if(conditionControl && conditionControl.ouiGroupControl){
        var conditionEl = conditionControl.getEl();
        $(conditionEl).parent('li').parent('ul').children('li').each(function(){
          var $curr = $(this);
          if($curr.hasClass('group-condition-rules-or-li')){
            return;
          }
          var $currEl = $curr.children('div[ouiid]');
          if($currEl.length && $currEl.length ==1){
            var currConditionControl = oui.getByOuiId($currEl.attr('ouiId'));
            if(currConditionControl&& currConditionControl.getSelectedFieldControl){
              var currFieldControl = currConditionControl.getSelectedFieldControl();
              if(controls.indexOf(currFieldControl)>-1){
                tempControls.push(currFieldControl);
              }
            }
          }
        });
      }
      controls = tempControls;
    }else{
      /** 清理条件组件下的 级联控件****/
      var tempControls = [];
      for(var i= 0,len=controls.length;i<len;i++){
        if(controls[i]&&controls[i].attr){
          var tempOtherAttrs = oui.parseJson(controls[i].attr('otherAttrs')||"{}");
          if(!(tempOtherAttrs && tempOtherAttrs.conditionOuiId)){
            tempControls.push(controls[i]);
          }
        }
      }
      controls = tempControls;
    }
    var hasCurrIdx = controls.indexOf(this);
    if(hasCurrIdx>-1){
      //剔除 本对象，防止 循环触发调用
      controls.splice(hasCurrIdx,1);
    }
    /**没有子控件则返回 **/
    if(!controls.length){
      return ;
    }
    /** 遍历找出当前枚举项***/
    var data = this.attr('data');

    var idx=-1;
    var enumIds = []; //需要考虑多选场景
    var enumId = null;
    var valueArr = (value+'')?(value+'').split(','):[];
    var isMulti = valueArr.length>1;
    if(value+''){
      if(isMulti){
        for(var i= 0,len=data.length;i<len;i++){
          if((valueArr.indexOf(data[i].value+'')>-1) &&(data[i].id)){
            enumIds.push(data[i].id);
          }
        }
        /** 没找到则返回**/
        if(!enumIds.length){
          return ;
        }
      }else{
        for(var i= 0,len=data.length;i<len;i++){
          if((value+'') == (data[i].value+'')){
            idx = i;
            break;
          }
        }
        /** 没找到则返回**/
        if(idx == -1){
          return ;
        }
        /*** 没有枚举id则返回**/
        enumId = data[idx].id;
        if(!enumId){
          return ;
        }
      }


    }

    /** 循环处理子控件的data属性，根据原始的data数据进行遍历找出子枚举项，渲染对应的枚举项****/
    for(var i= 0,len=controls.length;i<len;i++){
      var oldData = controls[i].attr('oldData')||[];
      var chData = [];
      if(enumId || (enumIds&&enumIds.length)){
        for(var j= 0,chLen=oldData.length;j<chLen;j++){
          if(isMulti){
            if(enumIds.indexOf(oldData[j].parentId)>-1){
              chData.push(oldData[j]);
            }
          }else{
            if(enumId ==oldData[j].parentId){
              chData.push(oldData[j]);
            }
          }
        }
      }
      if(!(value+'')){
        //父枚举值为空，对弱依赖关系的处理
        /*** 如果值为空，强依赖 则进行强依赖枚举 枚举过滤****/
        if((!controls[i].attr('weakDependence')) || (controls[i].attr('weakDependence')=='false')){
          controls[i].attr('value','');
          controls[i].attr('data',chData);
        }else{
          //值不存在，如果是弱依赖，则需要显示原始枚举项
          controls[i].attr('value','');
          controls[i].attr('data',oldData);
        }
      }else{
        //值存在，则进行枚举过滤
        controls[i].attr('value','');
        controls[i].attr('data',chData);
      }

      controls[i].render();
      controls[i].triggerUpdate();
    }
  };
  /** 根据父控件过滤枚举控件 待选项*****/
  var filterEnumDataByParentControlValue = function(){
    var parentControlName = this.attr('parentControlName');
    var parentControlId = this.attr('parentControlId');
    var oldData = this.attr('oldData')||this.attr('data') ||[];
    var currParantControl;
    var parentControl;
    if(parentControlId){
      currParantControl = oui.getById(parentControlId);
      parentControl = currParantControl;
    }else if(parentControlName){
      var otherAttrs = this.attr('otherAttrs') ||'{}';
      otherAttrs = oui.parseJson(otherAttrs);
      /*** 单独处理 在条件组件中的 下拉、单选 等控件****/
      //判断是否在条件组件中，如果在条件组件中，则进行筛选；如果不在条件中则 根据name找单个控件
      if(otherAttrs && otherAttrs.conditionOuiId){
        var controls = oui.getManyByName(parentControlName);
        //存在多个同名情况的处理
        var tempControls = [];
        var conditionControl = oui.getByOuiId(otherAttrs.conditionOuiId);
        if(conditionControl && conditionControl.ouiGroupControl){
          var conditionEl = conditionControl.getEl();
          $(conditionEl).parent('li').parent('ul').children('li').each(function(){
            var $curr = $(this);
            if($curr.hasClass('group-condition-rules-or-li')){
              return;
            }
            var $currEl = $curr.children('div[ouiid]');
            if($currEl.length && $currEl.length ==1){
              var currConditionControl = oui.getByOuiId($currEl.attr('ouiId'));
              if(currConditionControl&& currConditionControl.getSelectedFieldControl){
                var currFieldControl = currConditionControl.getSelectedFieldControl();
                if(controls.indexOf(currFieldControl)>-1){
                  tempControls.push(currFieldControl);
                }
              }
            }
          });
        }
        controls = tempControls;
        if(controls && controls.length >=1){
          parentControl = controls[0];
        }
      }else{
        //需要 业务保证 name使用的唯一性,否则可能找到多个同名的依赖父控件
        parentControl = oui.getByName(parentControlName);
      }

      /** 父控件不存在 则直接返回原始数据**/
      if(!parentControl){
        return oldData;
      }
    }else{
      return oldData;
    }
    var chData = [];
    /** 遍历找出当前枚举项***/
    var data = parentControl.attr('data') ||[];
    var value = parentControl.attr('value') ||"";

    var valueArr = (value+'')?(value+'').split(',') : [];
    var isMulti = valueArr&&(valueArr.length>1);
    var idx=-1;
    var enumId = null;
    var enumIds = [];
    if(value+''){
      if(isMulti){
        //value存在 则进行过滤
        for(var i= 0,len=data.length;i<len;i++){
          if(valueArr.indexOf(data[i].value+'')>-1){
            enumIds.push(data[i].id);
          }
        }
        /** 没找到则返回**/
        if(!enumIds.length){
          return oldData;
        }
      }else{
        //value存在 则进行过滤
        for(var i= 0,len=data.length;i<len;i++){
          if((value+'') == (data[i].value+'')){
            idx = i;
            break;
          }
        }
        /** 没找到则返回**/
        if(idx == -1){
          return oldData;
        }
        /*** 没有枚举id则返回**/
        enumId = data[idx].id;
        if(!enumId){
          return oldData;
        }
      }


    }else{
      //值不存在，则进行判断是否弱依赖
      if((!this.attr('weakDependence')) || (this.attr('weakDependence')=='false')){
        //强依赖 返回 空数组
        return chData;
      }else{
        //弱依赖 返回 原数据
        return oldData;
      }
    }
    if(enumId || (enumIds && enumIds.length)){
      for(var j= 0,chLen=oldData.length;j<chLen;j++){
        if(isMulti){
          if(enumIds.indexOf(oldData[j].parentId)>-1){
            chData.push(oldData[j]);
          }
        }else{
          if(enumId ==oldData[j].parentId){
            chData.push(oldData[j]);
          }
        }

      }
    }
    return chData;
  };
  /** 获取当前控件所属视图****/
  var getView = function(){
    var el = this.getEl();
    var mvSelector ='.oui-class-ouiview';
    var $mv = $(el).closest(mvSelector);
    var view = null;
    if(($mv) && ($mv.length)){
      var ouiId = $mv.attr('ouiid');
      if(ouiId){
        view = oui.getByOuiId(ouiId);
      }
    }
    return view;
  };
  /**
   * 触发更新事件
   */
  var triggerUpdate = function(){
    var bindProp = this.attr('bindProp'); //数据绑定
    if(bindProp){
      var value = this.attr('value');
      var view = this.getView();
      if(view){
        var data = view.getData();
        var oldV = oui.JsonPathUtil.getJsonByPath(bindProp,data) || null; //当前内存中的值
        if(oldV !== value){
          oui.JsonPathUtil.setObjByPath(bindProp,data,value,true);
        }
      }else{
        var oldV = oui.JsonPathUtil.getJsonByPath(bindProp,window) || null; //当前内存中的值
        if(oldV !== value){
          oui.JsonPathUtil.setObjByPath(bindProp,window,value,true);
        }
      }
    }

    this.change4enumControl();
    var onUpdate = this.attr('onUpdate');
    if(onUpdate){
      var el = this.getEl();
      var controller = $(el).closest('[oui-controller]').attr('oui-controller');
      if(controller){
        controller = oui.parseJson(controller);
      }else{
        controller = window;
      }
      var onUpdates = [];
      if(typeof onUpdate =='string'){
        var arr =  onUpdate.split(',');
        for(var i= 0,len=arr.length;i<len;i++){
          var fun = $.trim(arr[i]);
          if(fun){
            if(fun.indexOf('\.')>0){//全路径的类方法指定
              var tempFun;
              try{
                tempFun = win.eval(fun);
              }catch(err){
              }
              if(tempFun)
                onUpdates.push(tempFun);
            }else{//
              var tempFun = (controller&&controller[fun]) || window[fun];
              if(tempFun){
                onUpdates.push(tempFun);
              }
            }
          }
        }
      }else if(onUpdate){
        onUpdates.push(onUpdate);
      }
      for(var i= 0,len=onUpdates.length;i<len;i++){
        onUpdates[i]&& onUpdates[i](this);
      }
    }

  };

  /**
   * 触发更新后事件，一般在 失去焦点 ，点击后执行
   */
  var triggerAfterUpdate = function(){
    var onAfterUpdate = this.attr('onAfterUpdate');
    if(onAfterUpdate){
      var onAfterUpdates = [];
      if(typeof onAfterUpdate =='string'){
        var arr =  onAfterUpdate.split(',');
        for(var i= 0,len=arr.length;i<len;i++){
          if($.trim(arr[i])){
            try {
              onAfterUpdates.push(win.eval($.trim(arr[i])));
            }catch (e){
              if (window.oui_context && oui_context.debug + '' === 'true') {
                console.error("onAfterUpdate配置错误" + e);
              }
            }
          }
        }
      }else if(onAfterUpdate){
        onAfterUpdates.push(onAfterUpdate);
      }
      for(var i= 0,len=onAfterUpdates.length;i<len;i++){
        onAfterUpdates[i]&& onAfterUpdates[i](this);
      }
    }

    //值改变事件
    var script4onChange = this.attr('script4onChange');
    if((typeof script4onChange !='undefined') && (script4onChange)){
      var script4onChangeFun =this.attr('script4onChangeFun');
      if(!script4onChangeFun){
        try{
          script4onChangeFun = oui.parseJson2Function(script4onChange);
          this.attr('script4onChangeFun',script4onChangeFun);
        }catch(e){
          oui.getTop().oui.alert('值改变触发脚本解析异常，请联系管理员，检查脚本错误：'+e);
          throw e;
        }
      }

      try{
        script4onChangeFun&&script4onChangeFun(this);//执行值改变事件
      }catch(e){
        oui.getTop().oui.alert('值改变触发脚本执行异常，请联系管理员，检查脚本错误：'+e);
        throw e;
      }
    }
  };
  /**
   * 清楚控件对象  map中的缓存对象
   */
  var clear = function(){
    var map = this.getMap();
    for(var i in map){
      map[i] = null;
      delete map[i];
    }
    for( var i in this){
      this[i] = null;
      delete this[i];
    }
  };
  /**
   * 根据控件对象、属性列表、元素设置控件对象的属性值
   * @param el
   */
  var putElAttr2Control = function(el) {
    if (!el) {return;}
    var arr = this.attrs.split(',');
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] == 'value') {continue;}// 在解析引擎中默认会解析value属性
      var v = '';
      if (arr[i] == 'cls') {v = $(el).attr("class");}
      else {v = $(el).attr(arr[i]);}

      if(v){
        this.getMap()[arr[i]] = v;
      }else{
        this.getMap()[arr[i]] = this.getMap()[arr[i]] || "";
      }
      // 解析元素属性，并设置到对象map中
    }
  };
  /**
   * 获取控件将渲染的html内容,可提供子类重写
   */

  var getHtml = function(){
    var h = "";
    var clazz = this.constructor;
    if(!clazz._getHtml){
      clazz._getHtml = {};
    }
    var tplTypeConfig  =clazz.tplTypeConfig||{};
    clazz.tplTypeConfig = tplTypeConfig;
    var tplType = tplTypeConfig[this.attr('showType')];
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;
    }
    if(!clazz._getHtml[this.attr('showType')]){
      var temp = clazz.templateHtml[this.attr('showType')];
      if(!temp){
        oui.log('控件类:'+clazz.FullName+' 中没有定义控件模板templateHtml属性');
        throw e ;
      }

      if(!tplType){
        throw  new Error(""+clazz.fullName+"模板类型没有指定,请联系前端控件维护人员");
      }
      if(!oui.TplTypeEnum[tplType]){
        throw  new Error(""+clazz.fullName+"模板类型不支持"+tplType+",请联系前端控件维护人员");
      }
      clazz._getHtml[this.attr('showType')] = oui.TplTypeEnum[tplType].compile(temp);//根据模板类型进行编译模板并缓存
    }
    var map = this.getMap();
    h = oui.TplTypeEnum[tplType].getHtml(this,clazz);

    var s = '<div ';

    if(map['oui-controller']){
      s+='oui-controller="'+map['oui-controller']+'" ';
    }
    s+= ('ouiId="'+map.ouiId+'" ');//ouiId定义
    s+= ('id="'+constant.controlIdPrefix+map.id+'" ');//id 定义
    s+= ('showType="'+map.showType+'" ');//showType 模板号
    if(map.style){ s+= ('style="'+map.style+'" '); } // 继承标签style定义
    var names = clazz.FullName.split('.');
    var controlName = names[names.length-1];
    var showTypeInCls = ' '+constant.controlClassNamePrefix+controlName;
    if(map.showType!=0){
      showTypeInCls +="-"+map.showType;
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

      if(require){
        s+= ('class="'+showTypeInCls+' oui-require"');
      }else{
        s+= ('class="'+showTypeInCls+'"');
      }

    }// 继承标签 class定义
    s+='>';
    s+=h;
    s+='</div>';
    return s ;//根据对象返回html内容
  };
  /**
   * 获取当前控件对应的元素
   * @returns
   */
  var getEl = function(){
    var ouiId =this.attr(constant.ouiIdName);//获取当前元素
    return $("["+constant.ouiIdName+"='"+ouiId+"']")[0] || document.getElementById(this.attr('id'));
  };
  /**
   * 渲染当前控件对象的dom操作,
   * 可以由子类重写 实现对dom进行操作
   */
  var render = function(){
    var el = this.getEl();
    if(!el){return ;}
    var clazz = this.constructor;
    var config = clazz.tplTypeConfig||{};
    var showType = this.attr('showType');
    var tplType = config[showType];
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;
    }
    //if(!tplType){
    //  throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
    //}
    var tplTypeEnum = oui.TplTypeEnum[tplType];

    if(!tplTypeEnum){
      throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
    }
    tplTypeEnum.beforeRender&&tplTypeEnum.beforeRender(this,el);//模板引擎渲染前处理

    this.beforeRender&&this.beforeRender();//之前控件自身的渲染前处理
    var html = this.getHtml();
    el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
    el = null;
    tplTypeEnum.render&&tplTypeEnum.render(this);//特定模板引擎渲染处理
    tplTypeEnum.afterRender&&tplTypeEnum.afterRender(this);//特定模板引擎渲染后处理

    this.afterRender&&this.afterRender();//执行控件自身的后置渲染
  };
  /**
   * 获取或者设置对象属性值
   当输入参数有一个，如果参数类型为字符串；则返回该属性对应的值
   当输入参数有一个，如果参数类型为对象，则批量设置改对象的属性值
   当输入参数有两个,则设置对象的属性值
   * @param key
   * @param v
   */
  var attr = function(key,v){
    var len = arguments.length;
    if(len==1 && typeof key=='string'){//当输入参数有一个，如果参数类型为字符串；则返回该属性对应的值
      if(key =='value'){
        if(typeof this.getMap()[key]=='string'){
          return $.trim(this.getMap()[key]);
        }
      }
      return this.getMap()[key];
    }
    if(len==1 && typeof key=='object'){//当输入参数有一个，如果参数类型为对象，则批量设置改对象的属性值
      var o = key;
      for(var i in o){
        this.getMap()[i] = o[i];
      }
      return ;
    }
    if(len==2){//当输入参数有两个,则设置对象的属性值
      this.getMap()[key] = v;
    }
  };
  /** 获取原始代码的html内容**/
  var getSourceHtml = function(){
    return this.attr('sourceHtml');
  };
  /** 获取转义后的sourceHTML***/
  var getSourceHtmlEscape = function(){
    var s = this.attr('sourceHtml') ||'';
    var attrs = this.attrs;
    var keys = ['class'].concat(attrs.split(',')); // class默认没有在样式属性中
    var $s = $(s);
    var tag = $s[0].tagName.toLowerCase();
    var attrStrs = [];
    for(var i= 0,len=keys.length;i<len;i++){
      var key = keys[i];
      var v = $s.attr(key);

      if(v&&key){
        v = v.replace(/}}/g,' } } ').replace(/{{/g,' { { ');
        v = oui.escapeStringToHTML(v);//{{ }} 双层花括号是模板语法的特殊语法,不能有模板语法
        attrStrs.push(key+'="'+v+'"');
      }
    }
    var html ='<'+tag+' '+attrStrs.join(' ')+'>'+$s.html()+'</'+tag+'>';
    return html;
  };
  /** 获取当前控件运行态对应的源码****/
  var getSourceHtmlEscapeRuntime = function(){
    var s = this.attr('sourceHtml') ||'';
    var attrs = this.attrs;
    var keys = ['class'].concat(attrs.split(',')); // class默认没有在样式属性中
    var $s = $(s);
    var tag = $s[0].tagName.toLowerCase();
    var attrStrs = [];
    for(var i= 0,len=keys.length;i<len;i++){
      var key = keys[i];
      var v ='';
      if(key =='sourceHtml'){
        continue;
      }else if(key =='class'){
        v = $s.attr(key);
      }else{
        v = this.attr(key);
        if(typeof v =='object'){
          v = oui.parseString(v);
        }else if ((typeof v =='function') ||(v instanceof Function)){
          v = $s.attr(key);
        }else{
          v +='';
        }

      }
      if(v&&key){
        v = v.replace(/}}/g,' } } ').replace(/{{/g,' { { ');
        v = oui.escapeStringToHTML(v);//{{ }} 双层花括号是模板语法的特殊语法,不能有模板语法
        attrStrs.push(key+'="'+v+'"');
      }
    }
    var html ='<'+tag+' '+attrStrs.join(' ')+'>'+$s.html()+'</'+tag+'>';
    return html;
  };
  var _currProType = null;
  Control.getProtoType = function () {
    if (!_currProType) {
      _currProType = new Control({});
    }
    return _currProType;
  };
  /** 字段权限枚举
   *  hidden,invisible隐藏和不可见两种权限 控件不实现模板
   * *****/
  var FieldRightEnum={
    edit:{
      name:'edit',
      desc:'编辑',
      value:1
    }, //编辑
    view: {
      name:'readOnly',
      desc:'浏览',
      value:2
    },//浏览
    hidden:{
      name:'hidden',
      desc:'隐藏',
      value:3
    },//隐藏
    invisible:{
      name:'invisible',
      desc:'不可见',
      value:4
    },// 不可见
    edit4ReadOnly:{
      name:'edit4ReadOnly',
      desc:'编辑不可改',
      value:5
    },// 编辑不可改
    edit4View:{
      name:'edit4View',
      desc:'浏览可提交',
      value:6
    }//浏览可提交
  };
  oui.FieldRightEnum =FieldRightEnum;

  /** 创建控件类的模板 ****/
  /***
   *
   * @param ControlClz 指定控件类
   * @param right 指定权限模板
   * @param showType 指定模板编号
   * @param tempHtml 指定模板字符串内容
   * @param tplType 模板类型 ,参考 tpl-type.js ,TplTypeEnum{vue,react,artTemplate,...}中的name
   */
  Control.buildTemplate = function(ControlClz,right,showType,tempHtml,tplType){

    if(typeof right =='object'){
      showType = right.showType;
      tempHtml = right.tpl||'';
      tplType = right.tplType||'';
      right = right.right ||'';
    }
    if(typeof showType =='undefined'){
      showType =0;
    }else{
      if(!(showType+'')){
        showType=0;
      }
    }
    if(!right){
      right ='';
    }
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;//默认为artTemplate模板
    }
    if((right.indexOf(',')>0) || ((''+showType).indexOf(',')>0)){
      Control.buildBatchTemplate(ControlClz,right,showType,tempHtml,tplType);
    }else{
      if(!ControlClz.tplTypeConfig){
        ControlClz.tplTypeConfig = {};
      }
      ControlClz.tplTypeConfig[showType] = tplType;
      if(right == FieldRightEnum.edit.name){
        if(!ControlClz.templateHtml){
          ControlClz.templateHtml = [];
        }
        ControlClz.templateHtml[showType] = tempHtml;
      }else{
        if(!ControlClz['templateHtml4'+right]){
          ControlClz['templateHtml4'+right] = [];
        }
        ControlClz['templateHtml4'+right][showType] = tempHtml;
      }
    }
  };
  /** 批量创建模板，指定的模板引用相同时可以用批量创建模板*****/
  Control.buildBatchTemplate = function(ControlClz,right,showType,tempHtml,tplType){
    var rightArr = right.split(',');
    var showTypeArr = (''+showType).split(',');
    for(var i= 0,len=rightArr.length;i<len;i++){
      for(var j= 0,sLen=showTypeArr.length;j<sLen;j++){
        Control.buildTemplate(ControlClz,rightArr[i],showTypeArr[j],tempHtml,tplType);
      }
    }
  };
  ctrl['basecontrol'] = Control;//将抽象控件类放入到oui.$.ctrl命名空间下
})(window);





