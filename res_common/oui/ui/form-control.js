/**
 * 表单可输入控件value 和 data的定义
 * <p>
 * 控件数据存储格式如下：
 * <ul>
 * 		<li><b>单行文本框：</b>value={ "field_8eff0858" : "单行文本框数据" } data=无</li>
 * 		<li><b>多行文本框：</b>value={ "field_8eff0858" : "多行文本框数据" } data=无</li>
 * 		<li><b>电话号码(验证码)：</b>value={ "field_8eff0858" : "电话号码数据" } data={code:'验证码'}</li>
 * 		<li><b>数字：</b>value={ "field_8eff0858" : 12340 } data=无</li>
 * 		<li><b>隐藏框：</b>value={ "field_8eff0858" : "隐藏框数据" } data=无</li>
 * 		<li><b>下拉框：</b>value={ "field_8eff0858" : 1 } data={ "field_8eff0858" : { "display" : "选项1", "id" : "4849541620753999324", value : 1}}</li>
 * 		<li><b>单选框：</b>value={ "field_8eff0858" : 1 } data={ "field_8eff0858" : { "display" : "选项1", "id" : "4849541620753999324", value : 1}}</li>
 * 		<li><b>多选框：</b>value={ "field_8eff0858" : [1, 2] } data={ "field_8eff0858" : [{ "display" : "选项1", "id" : "4849541620753999324", "value" : 1}, { "display" : "选项2", "id" : "4849541620753999321", "value" : 2}]}</li
 * 		<li><b>日期：</b>value={ "field_8eff0858" : （注：DateTime类型) } data={ "field_8eff0858" : { "year" : 2016, "month" : 11, "day" : 11, "startTime" : 11231231231, "endTime" : 1143213123132, "showType" : ？} }</li>
 * 		<li><b>时间：</b>value={ "field_8eff0858" : 10200（注：时间为2：00，数据库存储整型） } data={ "field_8eff0858" : { "display" : "2:00" } }</li>
 * 		<li><b>插入图片：</b>value={ "field_8eff0858" : "4849541620753999324" } data={ "field_8eff0858" : [ { "display" : "图片1.jpg", "size" : 111, "id" : "4849541620753999324"} ]}</li>
 * 		<li><b>插入附件：</b>value={ "field_8eff0858" : "4849541620753999324" } data={ "field_8eff0858" : [ { "display" : "图片2.jpg", "size" : 111, "id" : "4849541620753999324"} ]}</li>
 * 		<li><b>图片组：</b>value=无 data=无</li>
 * 		<li><b>开关：</b>value=false（注：Boolean型） data=无</li>
 * 		<li><b>评分：</b>value=4 data=无</li>
 * 		<li><b>分割线：</b>value=无 data=无</li>
 * 		<li><b>文字说明：</b>value=无 data=无</li>
 * 		<li><b>分页：</b>value=无 data=无</li>
 * 		<li><b>地理位置：</b>value={ "field_8eff0858" : "四川省乐山市市中区科技大楼(柏杨东路)" } data={ "field_8eff0858" :  { "longitude" : "103.760546", "latitude" : "29.581702" }}</li>//TODO
 * 		<li><b>图片多选：</b>value={ "field_8eff0858" : [1, 2] } data={ "field_8eff0858" : [{ "display" : "", "value" : 1, "id" : "4849541620753999324"}] }</li>
 * 		<li><b>图片单选：</b>value={ "field_8eff0858" : 2 }  data={ "field_8eff0858" : { "display" : "", "value" : 2, "id" : "4849541620753999324"} }</li
 * 		<li><b>流水号：</b>value={ "field_8eff0858" : "规则12016_11_1100000" }  data=无</li>
 * 		<li><b>选人：</b>value={ "field_8eff0858" : "4849541620753999324" }  data={ "field_8eff0858" : [{"name" : "张三", "id": "4849541620753999324", "state" : 1, "openId" : "4849541620753999324", "typeFlag" : "person"}] }</li>
 * 		<li><b>选部门：</b>value={ "field_8eff0858" : "5918732553721390304" }  data={ "field_8eff0858" : [{"name" : "部门1", "id": "5918732553721390304", "state" : 1, "openId" : "5918732553721390304", "typeFlag" : "department"}] }</li>
 * 		<li><b>地址：</b>value={ "field_8eff0858" : "四川省 成都市 双流 正兴镇火石岩村3组"} data={ "field_8eff0858" : { "province" :{ "id": "123123", "value" : "123123", "display" : "213123"}, "city":{ "id" : "213123","value" : "213123", "display" : "1223123"}, "area":{ "id" : "213123", "value" : "w123123", "display" : "123123"}, info:"具体地址"}}</li>
 * 		<li><b>外部控件：</b>value={ "field_8eff0858" : 实际值  } data={}</li>

 * </ul>
 */
(function(win,$){
  var ctrl = oui.$.ctrl;
  var constant =oui.$.constant;
  var common_attrs = "id,name,type,title,cls,bindProp,style,fieldStyle,enable,value,right,showType,data,validate,isControlValidate,otherAttrs,containerId,onAfterChange,onUpdate,onAfterUpdate,parentControlId,parentControlName,weakDependence,relationEvent,hasRelationBtn,relationReadOnly,data4DB,calc,calcStr,script4readOnlyClick,script4onChange";//隐藏属性valueObj,解析formData时传入
  var BaseControl = ctrl.basecontrol;
  var common_events="onUpdate";
  var common_methods="render";
  /**
   * 抽象类定义
   */
  var OuiFormControl = function(cfg) {
    /** 表单控件的默认固定属性设置 */
    var map ={ //底层抽象公共属性
      showType:"0",
      allowInput:true,
      isControlValidate:false,//验证标签最终是否输出到最外层div元素上
      right:"edit"
    };
    /** 继承抽象类 BaseControl */
    BaseControl.call(this, $.extend(true,map,cfg)); //继承抽象类

    /**重写BaseControl中的属性和方法 ***/
    this.attrs =common_attrs;//控件公共属性列表
    this.eventNames = common_events;
    this.methodNames = common_methods;
    this.getHtml = getHtml;//暴露获取控件最终HTML的接口
    this.render = render;

    /** 表单类控件的属性 或者方法 **/
    this.attr('commonEvent',getCommonEvent(this.getMap())); //设置changeEvent属性
    this.setValue = setValue;
    this.setValueBefore = function(){};
    this.getValue = getValue;
    this.getDisplay= getDisplay;
    this.getData4DB = getData4DB;
    this.validate = validate;
    this.click4readOnly = click4readOnly;//浏览态的点击事件

  };
  var _renderControlCode =null;

  /** 浏览态点击事件****/
  var click4readOnly = function(){
    var otherAttrs = this.attr('otherAttrs');
    otherAttrs = oui.parseJson(otherAttrs||'{}');
    var script4readOnlyClick = otherAttrs.script4readOnlyClick ||this.attr('script4readOnlyClick');
    if((typeof script4readOnlyClick !='undefined') && (script4readOnlyClick)){
      var click4readOnlyFun =this.attr('click4readOnly');
      if(!click4readOnlyFun){
        try{
          click4readOnlyFun = oui.parseJson2Function(script4readOnlyClick);
          this.attr('click4readOnly',click4readOnlyFun);
        }catch(e){
          oui.getTop().oui.alert('浏览态点击触发脚本解析异常，请联系管理员，检查脚本错误：'+e);
          throw e;
        }
      }

      try{
        click4readOnlyFun&&click4readOnlyFun(this);//执行点击事件
      }catch(e){
        oui.getTop().oui.alert('浏览态点击触发脚本执行异常，请联系管理员，检查脚本错误：'+e);
        throw e;
      }
    }
  };
  var getControlCode = function(obj){
    if(!_renderControlCode){
      _renderControlCode = template.compile('validate="{{validate}}"');
    }
    return _renderControlCode(obj);

  };

  /**
   * 验证当前控件是否通过公共接口
   */
  var validate = function(){

    //var el = this.getEl();
    //return oui.validate(el);
    return true;
  };
  /**
   * 获取控件将渲染的html内容,可提供子类重写
   */

  var getHtml = function(){
    this.attr("commonEvent",getCommonEvent(this.getMap()));
    var right = this.attr('right')||'edit';
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
    if(!tplType){
      throw  new Error(""+clazz.fullName+"模板类型没有指定,请联系前端控件维护人员");
    }
    if(!oui.TplTypeEnum[tplType]){
      throw  new Error(""+clazz.fullName+"模板类型不支持"+tplType+",请联系前端控件维护人员");
    }
    //规范要求 同一个showType在不同的权限下使用相同的 模板类型配置

    if(!clazz._getHtml[right+this.attr('showType')]){// 缓存编译函数
      var temp ='';
      if(right=='edit' || right=='design' || right=="preview"|| right=='disabled'){
        if(!clazz.templateHtml[this.attr('showType')]){
          oui.log('控件类:'+clazz.FullName+' 中没有定义控件模板templateHtml属性');
          throw e ;
        }
        temp = clazz.templateHtml[this.attr('showType')];
      }else{
        var temp = '';
        if(clazz['templateHtml4'+right]&&clazz['templateHtml4'+right][this.attr('showType')]){
          temp = clazz['templateHtml4'+right][this.attr('showType')];
        }
      }
      if(temp){
        clazz._getHtml[right+this.attr('showType')] =oui.TplTypeEnum[tplType].compile(temp); //编译模板并 缓存模板渲染函数
      }
    }
    var map = this.getMap();


    // || right=="preview" 预览可编辑 需要生成二维码数据
    if(right =='design' || right=='disabled'){

      var tempe = this.attr('commonEvent');
      this.attr('commonEvent',"");

      h = oui.TplTypeEnum[tplType].getHtml(this,clazz);
      this.attr('commonEvent',tempe);
    }else if(right =='edit'){
      h = oui.TplTypeEnum[tplType].getHtml(this,clazz);
    }else{

      if(this['getHtml4'+right]){ //如果存在自定义 right类型则根据right类型执行函数渲染对应状态
        h = this['getHtml4'+right]();
      }else if(clazz._getHtml[right+this.attr('showType')]){
        h = oui.TplTypeEnum[tplType].getHtml(this,clazz);
      }else if((right == oui.FieldRightEnum.view.name) || (right==oui.FieldRightEnum.edit4ReadOnly.name) || (right ==oui.FieldRightEnum.edit4View.name)){//只读状态只输出文本内容
        //对于浏览态的控件 1、如果传入了valueObj的display属性则显示控件内容
        //2、如果没有传入valueObj则使用默认value显示控件内容
        var vo = this.attr('valueObj');
        if(vo && vo.display){
          h= vo.display;
        }else{
          h = this.attr('value');
        }
        h = oui.escapeStringToHTML(h);
      }
    }
    //relationEvent,relationReadOnly
    var relationEvent = this.attr('relationEvent');
    /**判断是否显示 关联btn ****/
    var hasRelationBtn = this.attr('hasRelationBtn');
    var hasRelationBtnValue = false;
    if(hasRelationBtn ==='true'){
      hasRelationBtnValue = true;
    }else if(hasRelationBtn ==='false'){
      hasRelationBtn = false;
    }else if( hasRelationBtn && (typeof hasRelationBtn =='string')){
      try{
        var fun = eval(hasRelationBtn);
        if(fun){
          hasRelationBtnValue = fun(this);
        }
      }catch(e){
        hasRelationBtnValue = false;
      }
    }else if(typeof  hasRelationBtn =='function'){
      hasRelationBtnValue = hasRelationBtn(this);
    }

    //var relationReadOnly = this.attr('relationReadOnly');

    var s = '<div ';

    s+= ('ouiId="'+map.ouiId+'" ');//ouiId定义
    s+= ('id="'+constant.controlIdPrefix+map.id+'" ');//id 定义
    s+= ('type="'+map.type+'" ');//控件类型定义
    if(map.isControlValidate){

      s+=(getControlCode(map)+' ');//校验
    }
    s+= ('showType="'+map.showType+'" ');//showType 模板号
    if(map.style){ s+= ('style="'+map.style+'" '); } // 继承标签style定义
    var names = clazz.FullName.split('.');
    var controlName = names[names.length-1];
    var showTypeInCls =' '+constant.controlClassNamePrefix+controlName;
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
      s+= ('class="'+map.cls+showTypeInCls+' oui-'+right+' ');  //编辑权限根据 配置csss样式控制
    }else{
      s+= ('class="'+showTypeInCls+' oui-'+right+' ');

    }// 继承标签 class定义

    if(require){
      s+=('oui-require'+' ');
    }
    if(hasRelationBtnValue ){
      s+='oui-relation-readOnly" ';
    }else{
      s+='" ';
    }
    s+='>';

    /*** 关联控件的模板处理  ***/
    if(hasRelationBtnValue){
      if(!clazz._getHtml['readOnly'+this.attr('showType')]){// 缓存编译函数
        var temp = '';
        if(clazz['templateHtml4'+'readOnly']&&clazz['templateHtml4'+'readOnly'][this.attr('showType')]){
          temp = clazz['templateHtml4'+'readOnly'][this.attr('showType')];
        }
        if(temp){

          clazz._getHtml['readOnly'+this.attr('showType')] = oui.TplTypeEnum[tplType].compile(temp); //编译模板并 缓存模板渲染函数
        }
      }

      if(!relationEvent){
        relationEvent="oui._noop";
      }
      var rehtml='';
      if(this['getHtml4readOnly']){ //如果存在自定义 right类型则根据right类型执行函数渲染对应状态
        rehtml = this['getHtml4readOnly']();
      }else if(clazz._getHtml['readOnly'+this.attr('showType')]){
        rehtml = oui.TplTypeEnum[tplType].getHtml(this,clazz,'readOnly');
      }else{
        //只读状态只输出文本内容
        //对于浏览态的控件 1、如果传入了valueObj的display属性则显示控件内容
        //2、如果没有传入valueObj则使用默认value显示控件内容
        var vo = this.attr('valueObj');
        if(vo && vo.display){
          rehtml= vo.display;
        }else{
          rehtml= this.attr('value');
        }
        rehtml = oui.escapeStringToHTML(rehtml);
      }
      s+='<input id="'+map.id+'" class="oui-form" name="'+map.name+'" validate="'+oui.escapeStringToHTML(map.validate||"")+'"  type="hidden" value="'+map.value+'"/>';
      if(oui.os.mobile){
        s+='<div class="oui-relation">'+rehtml+'</div><i class="oui-relation-icon" onTap="'+relationEvent+'(oui.getByOuiId('+map.ouiId+'));"></i>';
      }else{
        s+='<div class="oui-relation">'+rehtml+'</div><i class="oui-relation-icon" onclick="'+relationEvent+'(oui.getByOuiId('+map.ouiId+'));" ></i>';
      }
    }else{

      var script4readOnlyClick = oui.getJsonAttr(map.otherAttrs||{},'script4readOnlyClick')||map.script4readOnlyClick||"";
      if(script4readOnlyClick){//只读，可点击
        /* 只读 可点击事件元素追加div***/
        if((right == oui.FieldRightEnum.view.name) || (right==oui.FieldRightEnum.edit4ReadOnly.name) || (right ==oui.FieldRightEnum.edit4View.name)){
          h = '<div target-oui-id="'+map.ouiId+'" class="oui-'+oui.FieldRightEnum.view.name+'-canclick">'+h+'</div>';
        }
      }
      s+=h;

    }
    s+='</div>';
    return s ;//根据对象返回html内容
  };

  /**************************************************公共事件处理start******************************************************/

  /**
   * 基本控件值 改变事件 value同步到控件对象缓存中, validate验证配置
   */
  var commonEventTemplate='oninput="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" onpropertychange="oui.$.ctrl.ouiformcontrol.change({{ouiId}},this);" onblur="oui.$.ctrl.ouiformcontrol.blur({{ouiId}},this);"';
  /**
   * 获取 值改变事件的绑定字符串
   */
  var getCommonEvent = function(cfg){
    if(!OuiFormControl._getCommonEventTemplate){
      OuiFormControl._getCommonEventTemplate = template.compile(commonEventTemplate);
    }
    return OuiFormControl._getCommonEventTemplate(cfg);
  };
  /**
   * 值改变事件触发 同步到控件对象缓存中
   */
  OuiFormControl.change = function(ouiId,el){
    var obj = oui.getByOuiId(ouiId);
    if(!obj){return ;}
    var lastV= obj.attr('value');
    var v = $(el).val();
    obj.attr('value',v);
    obj.triggerUpdate();
    obj.afterChange&&obj.afterChange(); // 如果子类控件对象上实现了afterChange 函数 则执行 缓存同步后置脚本
  };
  /**
   * 控件的焦点离开事件
   */
  OuiFormControl.blur = function(ouiId,el){
    var obj = oui.getByOuiId(ouiId);
    if(!obj){return ;}
    obj.blur&&obj.blur(); // 如果子类实现了blur方法，则执行
    obj.triggerUpdate&&obj.triggerUpdate();
    obj.triggerAfterUpdate && obj.triggerAfterUpdate();
    if(obj.attr&&obj.attr('onAfterChange')){
      eval(obj.attr('onAfterChange'));
    }
  };
  /**************************************************公共事件处理end******************************************************/
  /**
   * 改变值，执行控件渲染功能
   */
  var setValue = function(v,notTriggerUpdate){
    if(typeof v =='string' || typeof v === 'boolean' || typeof v === 'number'){
      this.attr("value",v);
    }else if(v){
      var value = v.value ||"";
      var data = v.data;
      var data4DB = v.data4DB;
      this.attr('value',value);
      this.attr('data',data);
      this.attr('data4DB',data4DB);
    }else{//空值
      this.attr('value','');
    }

    this.setValueBefore&&this.setValueBefore();
    this.render();
    if(!notTriggerUpdate){//默认执行 值改变后事件触发，如果用户配置了true，则不执行触发值改变后事件
      this.triggerAfterUpdate();
    }
  };

  /**
   * 获取控件的value值
   * @returns {*}
   */
  var getValue = function(){
    var v= this.attr('value');
    return v;
  };

  /**
   * 渲染当前控件对象的dom操作,
   * 可以由子类重写 实现对dom进行操作
   */
  var render = function(){
    var el = this.getEl();
    if(!el){return ;}
    var html = this.getHtml();

    var clazz = this.constructor;
    var config = clazz.tplTypeConfig||{};
    var showType = this.attr('showType');
    var tplType = config[showType];
    if(!tplType){
      tplType = oui.TplTypeEnum.artTemplate.name;
    }
    if(!tplType){
      throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
    }
    var tplTypeEnum = oui.TplTypeEnum[tplType];
    if(!tplTypeEnum){
      throw new Error(clazz.fullName+',控件中没有配置模板类型,请联系控件维护人员');
    }
    tplTypeEnum.beforeRender&&tplTypeEnum.beforeRender(this,el);//模板引擎渲染前处理
    this.beforeRender&&this.beforeRender();
    el.outerHTML = html;//将渲染后的HTML代码替换原始标签的outerHTML
    el = null;
    if(this.attr('right') =='design'){//设计期取消事件
      this.afterRender4Design && this.afterRender4Design();
      return ;
    }
    tplTypeEnum.render&&tplTypeEnum.render(this);//特定模板引擎渲染处理
    tplTypeEnum.afterRender&&tplTypeEnum.afterRender(this);//特定模板引擎渲染后处理
    this.afterRender&&this.afterRender();
  };
  /**
   * 获取显示属性
   */
  var getDisplay=function(){
    return '';
  };

  /**
   * 获取后端存储处数据
   * @returns {{}}
   */
  var getData4DB = function(){
    var data4DB = this.attr('data4DB');
    if(!data4DB){
      data4DB = {};
      this.attr('data4DB',data4DB);
    }else if(typeof data4DB =='string'){
      data4DB = oui.parseJson(data4DB);
      this.attr('data4DB',data4DB);
    }
    return data4DB;
  };
  var _currProType = null;
  OuiFormControl.getProtoType = function () {
    if (!_currProType) {
      _currProType = new OuiFormControl({});
    }
    return _currProType;
  };
  /** 创建模板方法 定义****/
  OuiFormControl.buildTemplate = function(ControlClz,right,showType,tpl,tplType){
    if(right&&(typeof right =='object')){
      showType = right.showType;
      tpl = right.tpl||'';
      tplType = right.tplType||'';
      right = right.right ||'';
    }
    if(!right){
      right ='edit';
    }
    BaseControl.buildTemplate(ControlClz,right,showType,tpl,tplType);
  };
  ctrl['ouiformcontrol'] = OuiFormControl;//将抽象控件类放入到oui.$.ctrl命名空间下

  var clickName = 'click';
  if(oui.os.mobile){
    clickName = 'tap';
  }
  //对浏览态的控件进行事件绑定
  var readOnlySelector = '.oui-'+oui.FieldRightEnum.view.name+'-canclick';
  $(document).on(clickName,readOnlySelector  ,function(e){
    var me = this;
    var ouiId = $(me).attr('target-oui-id');
    if(!ouiId){ //不是oui控件不做处理
      return;
    }
    var curr = oui.getByOuiId(ouiId);
    if((!curr) || (oui.isEmptyObject(curr))){ // 控件不存在不做处理
      return ;
    }
    me.disabled = 'disabled';
    $(me).addClass('submit-button-disabled');
    oui.bindTimer(function(){
      try{
        curr&&curr.click4readOnly&&curr.click4readOnly();
      }catch(err){
      }
      return true;
    },function(){
      $(me).removeAttr('disabled');
      $(me).removeClass('submit-button-disabled');
    },500);
  });

})(window,window.$$||window.$);





