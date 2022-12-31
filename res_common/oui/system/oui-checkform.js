(function(win){
  var validateAttrName = "validate";
  /*
     *  验证组件
     *  必填
     *  最小长度
     *	最大长度
     最小值
     最大值
     多选：至少选择项
     多选：最多选择项
     多选：恰好选择项
     phone:手机号码
     email:邮箱地址
     */
  var validatorNames ="require,minLength,maxLength,minValue,maxValue,checkedSizeGt,checkedSizeLt,checkedSizeEq,phone,email,emailOrPhone,number,sixNumber,fourNumber,sixNumberAndEng,numberSixToEighteen,numberAndEngSixToEighteen,passForThreeCombinations,passStartWithEng,passForThreeCombWithoutSpecChar,passForThreeCombWithSpecChar,dotNum,specialChars,website,tel,fax,qq,fileUploadLimit,imageUploadLimit,lettersOrNumber,dateYMD,dateYM,dateY,dateYMDhms,dateYMDhm,dateYMDh,enumData".split(',');
  /**
   * 校验类
   */
  var Validator = {
    /*
         *支持属性 title validateValue
         */
    fax_error_msg:'{{title}}请输入正确的传真号码',
    tel_error_msg:'{{title}}请输入正确的固话号码（号码前加区号），如：028-66886688',
    qq_error_msg:'{{title}}请输入正确的QQ号码',
    specialChars_error_msg:'{{title}}包含特殊字符',
    website_error_msg:'{{title}}请输入正确的网址，如：http（或https）：//Formtalk.com',
    require_error_msg:'{{title}}此项必填',
    email_error_msg:'{{title}}请输入正确的E-mail地址，如：123@126.com，多个请用英文分号(;)隔开',
    phone_error_msg:'{{title}}请输入正确的手机号码',
    emailOrPhone_error_msg:'{{title}}请输入正确的手机号码或邮箱号码',
    cellphones_error_msg:'{{title}}手机号码不在特定范围内',
    checkMsgCode_error_msg:'{{title}}手机验证码不能为空',
    maxLength_error_msg:'{{title}}最多{{validateValue}}个字',
    minLength_error_msg:'{{title}}至少{{validateValue}}个字',
    maxValue_error_msg:'{{title}}不能大于{{validateValue}}{{(validate&&validate.percentNum)?"%":""}}',
    minValue_error_msg:'{{title}}不能小于{{validateValue}}{{(validate&&validate.percentNum)?"%":""}}',
    dotNum_error_msg:'{{title}}小数点后位数不能大于{{validateValue}}',
    checkedSizeGt_error_msg:'{{title}}至少选择{{validateValue}}个选项',
    checkedSizeLt_error_msg:'{{title}}最多选择{{validateValue}}个选项',
    checkedSizeEq_error_msg:'{{title}}只能选择{{validateValue}}个选项',
    fileUploadLimit_error_msg:'{{title}}附件不能超过{{validateValue}}个',
    imageUploadLimit_error_msg:'{{title}}图片不能超过{{validateValue}}个',
    number_error_msg:'{{title}}请输入数字',
    sixNumber_error_msg:'{{title}}请输入6位数字',
    fourNumber_error_msg:'{{title}}请输入4位数字',
    sixNumberAndEng_error_msg:'{{title}}请输入6位数字及英文字母组合',
    numberSixToEighteen_error_msg:'{{title}}请输入6至18位的纯数字',
    numberAndEngSixToEighteen_error_msg:'{{title}}密码须包含数字、字母两种元素，且密码位数为6-18位',
    passForThreeCombinations_error_msg:'{{title}}密码为数字，大、小写字母，特殊符号至少包含三种，长度为8-18位',
    passStartWithEng_error_msg:'{{title}}以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
    passForThreeCombWithoutSpecChar_error_msg:'{{title}}必须包含大小写字母和数字的组合，不能使用特殊字符，长度在6-18位之间',
    passForThreeCombWithSpecChar_error_msg:'{{title}}必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-18之间',
    lettersOrNumber_error_msg:'{{title}}请输入正确文本(字母、数字、字母和数字组合)',
    dateYMDhms_error_msg:'{{title}}请输入格式正确的日期时间,时间格式：yyyy-mm-dd HH:MM:ss; 例如：2008-08-08 08:08:08',
    dateYMDhm_error_msg:'{{title}}请输入格式正确的日期时间,时间格式：yyyy-mm-dd HH:MM; 例如：2008-08-08 08:08',
    dateYMDh_error_msg:'{{title}}请输入格式正确的日期时间,时间格式：yyyy-mm-dd HH; 例如：2008-08-08 08',
    dateYMD_error_msg:'{{title}}请输入格式正确的日期,日期格式：yyyy-mm-dd; 例如：2008-08-08 ',
    dateYM_error_msg:'{{title}}请输入格式正确的日期,日期格式：yyyy-mm; 例如：2008-08',
    dateY_error_msg:'{{title}}请输入格式正确的年份,日期格式：yyyy; 例如：2008',
    enumData_error_msg:'{{title}}不在枚举范围'
  };

  /**
   *@param container 指定表单范围校验
   *@param options {
		 isFindErrorBreak //是否在找到第一个验证错误时就终止校验, true:在遇到第一个校验错误则终止校验并返回,false:遇到校验错误项继续往下校验	 
		 failCallback //校验失败时触发 failCallback(failEls),触发参数为 失败的元素列表
	 }
   *@return true:校验通过; false:校验失败
   *调用方式如 oui.checkForm("#formid",{isFindErrorBreak:false,failCallback:function(failEls){ }});
   *如：
   var checkResult = oui.checkForm("#contentForm", {
		isFindErrorBreak: false,
		isNotCheckRequire:false,//默认为false ，需要校验 ，true：不校验必填项
		failCallback: function(failEls) {//校验失败回调
			if(!(failEls && failEls.length)){
				return ;
			} 
			var scrollCenterPos = ($(document.body).height()/2); 
			$(document.body).scrollTop($(failEls[0]).parent().offset().top-scrollCenterPos);
		}
	 });
   *-------------------------------------------------
   *该方法需要配合页面中配置元素的validate属性
   * 在html元素的validate上的配置项为
   * okMode:'no',//默认为无消息提示 ,1、oktips自动显示消息然后消失
   * failMode:'alert', //默认为alert ; 其中 1、alert为弹出框提示错误信息 ,
   2、msgPosEl在指定元素位置显示错误信息，如果failMode配置为msgPosEl，需要配置msgPosEl属性定位,如'#test'
   3、tips 自动显示消息然后消失
   * okMsg:'',//默认为空
   * msgPosEl: 消息显示位置,依赖与failMode属性值 msgPosEl
   * failMsg:'校验失败',//默认为校验失败
   failCallback: 配置校验失败的回调函数 接口参数分别为(el,key,json) 元素、校验属性、校验对象,
   msgPos:'inner' 默认值为 inner,不是必填项,结合faileMode、msgPosEl属性使用,支持值inner,before,after,append; inner：错误消息在指定元素内替换innerHTML;before:错误消息创建标签到指定元素的前面;after:错误消息创建标签到指定元素的后面;append:错误消息在指定元素里面显示 ;该配置依赖failMode和 msgPosEl属性用于元素定位显示

   * 验证所有
   *------------------------------------------------------------------------
   */
  oui.checkForm = function(container,options){
    var $container = null;
    if(typeof container=='string'){
      $container = $(container);
    }else{
      $container = $(container||document.body);
    }
    if((!$container) || ($container.length==0)){
      return true;
    }
    options = options ||{};
    var isFindErrorBreak = options.isFindErrorBreak?true:false;
    var isNotCheckRequire = options.isNotCheckRequire ||false; //是否不校验必填
    var failEls = [];
    var arr = $container.find('['+validateAttrName+']');
    var isCheckOk= false;
    var result = true;
    for(var i=0,len=arr.length;i<len;i++){
      isCheckOk = oui.validate(arr[i],isNotCheckRequire);
      if(!isCheckOk){
        result = false;
        failEls.push(arr[i]);
        if(isFindErrorBreak){
          window.setTimeout(function(){
            (options.failCallback &&failEls.length)&&options.failCallback(failEls);
          },1);
          return false;
        }
      }
    }
    window.setTimeout(function(){
      (options.failCallback &&failEls.length)&&options.failCallback(failEls);
    },1);
    return result;
  };
  /**
   * 根据数据 进行校验
   * json : key为 属性名 ,value为属性值
   * data: key为属性名,value 为验证对象
   */
  oui.checkData = function(json,data,isFindErrorBreak,isNotCheckRequire){
    var isCheckOk = true;
    var result = true;
    for(var i in data){ //根据校验配置进行遍历校验
      if(i=='require' && isNotCheckRequire){
        continue;
      }
      isCheckOk = oui.validate4value(json[i],data[i],i);
      if(!isCheckOk){
        result = false;
        if(isFindErrorBreak){
          return false;
        }
      }
    }
    return result;
  };
  /**
   * 根据值和验证对象、元素信息(可为元素对象、或者id、或者name,根据具体应用场景适配)进行验证
   */
  oui.validate4value = function(v,validate,el,isNotCheckRequire){

    var json = oui.parseJson(validate);
    var len = validatorNames.length;
    var key='',isCheckOk = true;//校验状态是否验证通过
    var validateErrorKey ='';
    for(var j=0;j<len;j++){
      key = validatorNames[j];
      if(!json[key]){
        if(typeof json[key] !='number'){
          continue;
        }
      }

      if(key =='require' && isNotCheckRequire){
        continue;
      }
      if((typeof Validator[key+'4value'] =='function') ){
        isCheckOk = Validator[key+'4value'](v,json);
      }
      if(!isCheckOk){//验证不通过直接退出循环
        validateErrorKey = key;
        break;
      }
    }

    /*
         * 如果有自定义验证方法，执行自定义验证；否则执行默认验证逻辑
         */
    var validateMethod = json.validateMethod || oui.showValidateMsg;
    validateMethod(json,isCheckOk,el,validateErrorKey);//执行验证逻辑
    return isCheckOk;
  };
  /** 校验值并获取消息内容*****/
  oui.validate4message = function(v,validate,isNotCheckRequire){
     
    var json = oui.parseJson(validate);
    var len = validatorNames.length;
    var key='',isCheckOk = true;//校验状态是否验证通过
    var validateErrorKey ='';
    for(var j=0;j<len;j++){
      key = validatorNames[j];
      if(!json[key]){
        if(typeof json[key] !='number'){
          continue;
        }
      }
      if(key =='require' && isNotCheckRequire){
        continue;
      }
      if((typeof Validator[key+'4value'] =='function') ){
        isCheckOk = Validator[key+'4value'](v,json);
      }
      if(!isCheckOk){//验证不通过直接退出循环
        validateErrorKey = key;
        break;
      }
    }
    var result = {success:true};
    if(validateErrorKey && (!isCheckOk)){
      result.success = false;
      var  failMsg=json.failMsg;
      failMsg = json[validateErrorKey+'_error_msg']|| failMsg|| (Validator[validateErrorKey+'_error_msg']||'');
      var obj = {title: json.title||'',validateValue:((typeof json[validateErrorKey]!='undefined')?json[validateErrorKey]:''),validate:json};
      var render = template.compile(failMsg);
      result.msg = render(obj);
    }
    if(!result.success){
      return result;
    }
    /* 自定义校验 配置**/
    if(validate.check){
      if(typeof validate.check=='string'){
        var check = oui.parseJson(validate.check);
        result = check&&check(v,validate);
      }else{
        result = validate.check(v,validate);
      }
    }
    return result;
  };
  oui.scroll2ErrorEl = function(el,isNotCheckRequire){
    $(el).focus();
    oui.validate(el,isNotCheckRequire);
  };
  /**
   *验证单个标签
   * 在html元素的validate上的配置项为
   * okMode:'no',//默认为无消息提示
   * failMode:'alert', //默认为alert
   * okMsg:'',//默认为空
   * failMsg:'校验失败',//默认为校验失败
   * validateMethod: oui.showValidateMsg //默认可不用配置；校验时的消息提示执行函数(第一个参数json,第二个参数isCheckOk,第三个参数el);不配置时执行验证方法为 oui.showValidateMsg = function(json,isCheckOk,el) {};可自定义
   */
  oui.validate= function(el,isNotCheckRequire){
    if(!el){ //错误元素,不验证
      return true;
    }

    var validate = $(el).attr(validateAttrName);
    if(!validate){//无验证配置，不需要验证
      return true;
    }
    var json = oui.parseJson(validate);
    var len = validatorNames.length;
    var key='',isCheckOk = true;//校验状态是否验证通过
    var validateErrorKey ='';
    for(var j=0;j<len;j++){
      key = validatorNames[j];
      if(!json[key]){
        if(typeof json[key] !='number'){
          continue;
        }
      }
      if((typeof Validator[key] =='function') ){
        if(key =='require' && isNotCheckRequire){ // 对必填项不进行校验
          continue;
        }
        if(key=='minLength' && isNotCheckRequire){ //对最小值不进行校验
          var v = $(el).val();
          if(!v.length){
            continue;
          }
        }
        isCheckOk = Validator[key](el,json);
      }
      if(!isCheckOk){//验证不通过直接退出循环
        validateErrorKey = key;
        break;
      }
    }

    /*
         * 如果有自定义验证方法，执行自定义验证；否则执行默认验证逻辑
         */
    var validateMethod = json.validateMethod || oui.showValidateMsg;
    validateMethod(json,isCheckOk,el,validateErrorKey);//执行验证逻辑
    return isCheckOk;
  };
  /**
   * 根据mode批量显示 消息
   */
  oui.showMsgByModes = function(modes,msg,sourceObj,key,json){
    var arr =[];
    if(typeof modes =='string'){
      arr = modes.split(',');
    }else{
      arr = modes ||[];
    }
    var mode ='';
    for(var i=0,len=arr.length;i<len;i++){
      mode =arr[i];
      oui.showMsgByMode(mode,msg,sourceObj,key,json);
    }
  };
  /**
   * 根据消息提示方式 提示信息
   */
  oui.showMsgByMode = function(mode,msg,sourceObj,key,json){
    mode = mode ||'alert';
    msg = oui.escapeStringToHTML(msg, false);
    switch(mode){

      case 'tips':
        //oui.showAutoTips(msg);
        oui.getTop().oui.showAutoTips({content:msg,boxStyle:'background-color:#e07365'});
        break;

      case 'oktips':
        oui.getTop().oui.showAutoTips({content:msg});
        break;

      case 'alert':
        if(oui.getTop().oui){

          oui.getTop().oui.alert(msg);
        }else{
          oui.alert(msg);
        }
        break;

      case 'msgPosEl': // 指定元素位置显示提示信息
        //oui.alert(msg);
        var el = json.msgPosEl;
        if (typeof el == 'string') {
          if (el.indexOf('oui.getNS') > -1) {
            try {
              el = oui.parseJson(el);
            } catch (err) {
            }
          }
        }
        if((!el) ||(!$(el).length)){
          break;
        }
        var $el = $(el);

        if(!json.msgPos){
          json.msgPos ='inner';
        }

        if(json.msgPos =='inner'){
          $el.html(msg||"");
          $el.attr('title',msg||'');
        }else if(json.msgPos=='before'){
          var $prev=$el.prev();
          if($prev&&$prev.length>0&& $prev.is('i')&&$prev.hasClass('oui-error-info')){
            $($prev[0]).html(msg||"");
            $($prev[0]).attr('title',msg||"");
          }else{
            $el.before('<i class="oui-error-info">'+(msg||"")+'</i>');
            $el.prev().attr('title',msg||'');
          }
          if(!msg){
            $el.prev().hide();
          }else{
            $el.prev().show();
          }
        }else if(json.msgPos=='after'){
          var $next=$el.next();
          if($next&&$next.length>0&& $next.is('i')&&$next.hasClass('oui-error-info')){
            $($next[0]).html(msg||"");
            $($next[0]).attr('title',msg||'');
          }else{
            $el.after('<i class="oui-error-info">'+(msg||"")+'</i>');
            $el.next().attr('title',msg||'');
          }
          if(!msg){
            $el.next().hide();
          }else{
            $el.next().show();
          }
        }else if(json.msgPos=='append'){
          var $innerEl=$el.find('.oui-error-info');
          if($innerEl.length>0){
            $($innerEl[0]).html(msg||"");
            $($innerEl[0]).attr('title',msg||"");
          }else{
            $el.append('<i class="oui-error-info">'+(msg||"")+'</i>');
            $el.find('i.oui-error-info').attr('title',msg||"");
          }
          if(!msg){
            $el.find('.oui-error-info').hide();
          }else{
            $el.find('.oui-error-info').show();
          }
        }
        break;

    }

  };
  /**
   * 根据校验元素 隐藏错误消息
   */
  oui.hideErrorInfo = function(valiateEl){
    if(!valiateEl){
      return ;
    }
    $(valiateEl).removeClass('error-border-highlight');
    var targetHighEl = $(valiateEl).attr('targetHighBorderEl');
    if(targetHighEl){
      $(getTargetHighEl(targetHighEl)).removeClass('error-border-highlight');
    }
    var validate = $(valiateEl).attr('validate');
    if(!validate){
      return ;
    }

    var json = oui.parseJson(validate);
    if(!json){
      return ;
    }
    if(!json.msgPosEl){
      return ;
    }
    if(!json.msgPos){ //默认为 inner
      // json.msgPos ='inner';
      return ;
    }
    var $el = $(getTargetHighEl(json.msgPosEl));
    if(json.msgPos=='before'){
      var $prev=$el.prev();
      if($prev&&$prev.length>0&& $prev.is('i')&&$prev.hasClass('oui-error-info')){
        $($prev[0]).hide();
      }else{
        return ;
      }
    }else if(json.msgPos=='after'){
      var $next=$el.next();
      if($next&&$next.length>0&& $next.is('i')&&$next.hasClass('oui-error-info')){
        $($next[0]).hide();
      }else{
        return ;
      }
    }else if(json.msgPos=='append'){
      var $innerEl=$el.find('.oui-error-info');
      if($innerEl.length>0){
        $($innerEl[0]).hide();
      }else{
        return ;
      }
    }
  };

  /**
   * 获取高亮目标元素
   * @param el
   */
  var getTargetHighEl = function(el){
    if (typeof el == 'string') {
      if (el.indexOf('oui.getNS') > -1) {
        try {
          el = oui.parseJson(el);
        } catch (err) {
        }
      }
    }
    return el;
  };

  /**
   * 根据，json对象,校验状态，元素进行提示
   * oui.showValidateMsg({"msgPosEl":validateJson.msgPosEl,"failMode":validateJson.failMode,"msgPos":validateJson.msgPos,failMsg:'hello123'},false,fieldObj[0],'error4unique');
   * okMode
   * failMode
   * okMsg
   * failMsg
   */
  oui.showValidateMsg = function(json,isCheckOk,el,key){
    var okMode = json.okMode,failMode=json.failMode,okMsg=json.okMsg,failMsg=json.failMsg;
    okMode=okMode ||'msgPosEl';
    failMode = failMode ||'alert,msgPosEl';
    //okMsg=okMsg || (Validator[key+'_ok_msg']||"");
    okMsg=json[key+'_ok_msg'] || okMsg || (Validator[key+'_ok_msg']||"");
    //failMsg = failMsg|| (Validator[key+'_error_msg']||'');
    failMsg = json[key+'_error_msg']|| failMsg|| (Validator[key+'_error_msg']||'');

    var okModes = okMode.split(',');
    var failModes = failMode.split(',');
    var currModes=[];
    var msg ='';
    var obj = {title: json.title||'',validateValue:((typeof json[key]!='undefined')?json[key]:''),validate:json};
    var resultMsg='';
    if(isCheckOk){
      currModes = okModes ||[];
      msg =okMsg;
      var render = template.compile(msg);
      resultMsg = render(obj);
      if(oui.isDom(el)){
        $(el).removeClass('error-border-highlight');
        var targetHighEl = $(el).attr('targetHighBorderEl');
        if(targetHighEl){
          $(getTargetHighEl(targetHighEl)).removeClass('error-border-highlight');
        }
      }
    }else{
      currModes = failModes ||[];
      msg = failMsg;
      var render = template.compile(msg);
      resultMsg = render(obj);
      if(oui.isDom(el)){
        $(el).addClass('error-border-highlight');
        var targetHighEl = $(el).attr('targetHighBorderEl');
        if(targetHighEl){
          $(getTargetHighEl(targetHighEl)).addClass('error-border-highlight');
        }
      }
      if(json.failCallback4noMsg){
        json.failCallback4noMsg(resultMsg,el,key,json);
        return ;
      }
    }
    for(var i=0,len=currModes.length;i<len;i++){

      oui.showMsgByMode(currModes[i], resultMsg,el,key,json);
      if(isCheckOk){
        continue;
      }
      if(typeof json.failCallback=='function'){
        json.failCallback(el,key,json);
      }else if((typeof json.failCallback=='string') && json.failCallback && (window[json.failCallback])){
        window[json.failCallback](el,key,json);
      }
    }
  };

  Validator.require4value = function(v,json,isNotCheckRequire){
    if((!json.require) ||((typeof json.require=='string' && json.require=='false'))){
      return true;
    }
    if(isNotCheckRequire){
      return true;
    }
    if(!v){
      if((typeof v =='boolean') || (typeof v=='number')){
        return true;
      }else {
        return false;
      }
    }else if(!$.trim(v)){
      return false;
    }else{

      return true;
    }
  };

  var specialCharsReg = new RegExp("[`~!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]");
  /**
   * 特殊字符校验
   *
   */
  Validator.specialChars = function(el,json){
    //^$*{}.?+\\d\\D\\s\\S\\w\\W\\b\\B\\A\\G\\Z\\z
    var v = $(el).val();
    return Validator.specialChars4value(v,json);
  };
  /**
   * 针对MongoDB特殊字符校验
   */
  Validator.specialChars4value = function(v,json){
    if((!json.specialChars) ||((typeof json.specialChars=='string' && json.specialChars=='false'))){
      return true;
    }
    if(specialCharsReg.test(v+'')){
      return false;
    }
    return true;
  };

  /***字母和数字组合校验 **/
  Validator.lettersOrNumber= function(el,json)
  {
    var v = $(el).val();
    return Validator.lettersOrNumber4value(v,json);
  };
  /***字母和数字组合校验 **/
  Validator.lettersOrNumber4value= function(v,json)
  {
    if((!json.lettersOrNumber) ||((typeof json.lettersOrNumber=='string' && json.lettersOrNumber=='false'))){
      return true;
    }
    var re =  /^[0-9a-zA-Z]*$/g;  //判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/
    if (re.test(v))
    {
      return true;
    }else{
      return false;
    }
  };
  /**
   * 必填校验
   *
   */
  Validator.require = function(el,json,isNotCheckRequire){
    if((!json.require) ||((typeof json.require=='string' && json.require=='false'))){
      return true;
    }
    if(isNotCheckRequire){
      return true;
    }
    var controlType = $(el).attr('type');
    /*
         * 单选必填校验
         */
    if($(el).is('div') && (controlType=='radio' || controlType =='imagesingle' )){
      var checkedLen = $(el).find('input[type="radio"]:checked').length;
      if(checkedLen<=0){
        return false;
      }else {
        return true;
      }
    }
    /*
         * 多选必填校验
         */
    if($(el).is('div') && (controlType=='multiselect' || controlType=='imagemulti')){
      var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
      if(checkedLen<=0){
        return false;
      }else {
        return true;
      }
    }
    return Validator.require4value($(el).val(),json);
  };
  /**
   * 对于富文本控件 ，根据值获取text内容
   * @param value
   */
  var getText4richtext = function(value){
    if(!document.getElementById("val-richtext4value")){
      $(document.body).append('<div style="display:none"  id="val-richtext4value"></div>');
    }
    var $val4richtext = $("#val-richtext4value");
    $val4richtext.html(value.replace(/<script/gi, "&lt;script").replace(/<\/script/gi, "&lt;\/script"));
    return $.trim($val4richtext.text());
  };
  Validator.maxLength4value=function(v,json){
    if(typeof v =='boolean'){
      return true;
    }
    if(typeof json.maxLength=='undefined'){
      return true;
    }
    if(typeof json.maxLength=='string' && (!json.maxLength)){
      return true;
    }
    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    json.maxLength = parseInt(json.maxLength);
    if(typeof v =='number'){
      v =v+'';
    }
    if(json.number){
      var vlen = v.length;
      if(v.indexOf('.')>=0){
        vlen--;
      }
      if(v.indexOf('-')==0){
        vlen--;
      }
      if(vlen>15){ //数字校验 长度15位
        return false;
      }else if(vlen>json.maxLength){
        return false;
      }else{
        return true;
      }
    }else if((typeof json.isHtmlText !='undefined') && (json.isHtmlText)){
      if(getText4richtext(v).length>json.maxLength){
        return false;
      }
    }else if(v.length>json.maxLength){
      return false;
    }
    return true;
  };
  /**
   * 最大长度校验
   *
   */
  Validator.maxLength = function(el,json){
    var v = $(el).val();
    return Validator.maxLength4value(v,json);
  };
  /**
   * 附件个数校验
   */
  Validator.fileUploadLimit = function(el,json){
    var v = $(el).val();
    return Validator.fileUploadLimit4value(v,json);
  };
  /**
   * 附件个数校验
   */
  Validator.fileUploadLimit4value = function(v,json){
    if(!v){
      return true;
    }
    var arr =v.split(',');

    if(!json.fileUploadLimit){
      return true;
    }
    var fulimit = parseInt(json.fileUploadLimit);
    if(!fulimit){
      return true;
    }

    if(arr.length>fulimit){
      return false;
    }
    return true;
  };
  /**
   * 图片个数校验
   */
  Validator.imageUploadLimit = function(el,json){
    var v = $(el).val();
    return Validator.imageUploadLimit4value(v,json);
  };
  /**
   * 图片个数校验
   */
  Validator.imageUploadLimit4value = function(v,json){
    if(!v){
      return true;
    }
    var arr =v.split(',');
    if(!json.imageUploadLimit){
      return true;
    }
    var fulimit = parseInt(json.imageUploadLimit);
    if(!fulimit){
      return true;
    }

    if(arr.length>fulimit){
      return false;
    }
    return true;
  };
  Validator.minLength4value=function(v,json){
    if(typeof v =='boolean'){
      return true;
    }
    if(typeof json.minLength=='undefined'){
      return true;
    }
    if(typeof json.minLength=='string' && (!json.minLength)){
      return true;
    }
    json.minLength = parseInt(json.minLength);
    if(typeof v =='number'){
      v =v+'';
    }

    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    if(v.length<json.minLength){
      return false;
    }
    return true;
  };
  /**
   * 至少填写长度校验
   *
   */
  Validator.minLength = function(el,json){
    var v = $(el).val();
    return Validator.minLength4value(v,json);
  };
  Validator.minValue4value = function(v,json){

    if(typeof json.minValue =='undefined'){
      return true;
    }
    if((typeof json.minValue =='string') && (!json.minValue)){
      return true;
    }
    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    if(typeof v =='undefined'){
      return true;
    }
    if(!(v+'')){
      return true;
    }
    var minValue = parseFloat(json.minValue);
    try{
      if(typeof v=='number'){
        if(typeof json.percentNum !='undefined'){
          if((json.percentNum=='true') || (json.percentNum===true)){
            if((v*100)<minValue){
              return false;
            }else{
              return true;
            }
          }
        }
        if(v<minValue){
          return false;
        }
      }
      if(typeof json.percentNum !='undefined') {
        if ((json.percentNum == 'true') ||( json.percentNum === true)) {
          if ((v)&&((parseFloat(v) * 100) < minValue ) ) {
            return false;
          }else{
            return true;
          }
        }
      }

      if((v)&&(parseFloat(v)<minValue)){
        return false;
      }

    }catch(e){

    }
    return true;
  };
  /**
   * 最小值验证
   */
  Validator.minValue = function(el,json){
    var v = $(el).val();
    return Validator.minValue4value(v,json);
  };
  Validator.maxValue4value = function(v,json){
    if(typeof json.maxValue =='undefined'){
      return true;
    }
    if((typeof json.maxValue =='string') && (!json.maxValue)){
      return true;
    }
    if((!json.require) &&((typeof v =='string'|| typeof v =='undefined') && (!v))){
      return true;
    }
    if(typeof v =='undefined'){
      return true;
    }
    if(!(v+'')){
      return true;
    }
    var maxValue = parseFloat(json.maxValue);

    try{
      if(typeof v=='number'){

        if(typeof json.percentNum !='undefined') {
          if (json.percentNum == 'true' || json.percentNum === true) {
            if ((v * 100) > maxValue ) {
              return false;
            }else{
              return true;
            }
          }
        }
        if(v>maxValue){
          return false;
        }
      }
      if(typeof json.percentNum !='undefined') {
        if ((json.percentNum == 'true') || (json.percentNum === true)) {
          if ((v)&&((parseFloat(v) * 100) > maxValue) ) {
            return false;
          }else{
            return true;
          }
        }
      }

      if((v)&&(parseFloat(v)>maxValue)){
        return false;
      }

    }catch(e){

    }
    return true;
  };
  /**
   * 最大值验证
   */
  Validator.maxValue = function(el,json){
    var v = $(el).val();
    return Validator.maxValue4value(v,json);
  };
  /**
   * 数字的小数点后位数校验
   */
  Validator.dotNum4value = function(v,json){
    var dotNum=4; //小数点最多4位
    if(typeof json.dotNum =='undefined'){
      return true;
    }

    if(typeof json.dotNum=='string'){
      if(!json.dotNum){
        return true;
      }
      dotNum = parseInt(json.dotNum);
    }else if(typeof json.dotNum=='number'){
      dotNum = json.dotNum;
    }
    if(!v){
      if(typeof v=='string'){
        return true;
      }
    }
    var str = v+'';
    var arr = str.split('.');
    if(arr.length>1){
      if(json.percentNum){//百分数校验
        if(arr[1].length>dotNum+2){
          return false;
        }else{
          return true;
        }
      }
      if(arr[1].length>dotNum){
        return false;
      }
    }
    return true;
  };
  /**
   * 数字的小数点后位数校验
   */
  Validator.dotNum = function(el,json){
    var v = $(el).val();
    return Validator.dotNum4value(v,json);
  };

  /**
   * 多选框 至少选择 多少项验证
   */
  Validator.checkedSizeGt4value = function(v,json){

    if(!json.checkedSizeGt){
      return true;
    }
    var gtLen = parseInt(json.checkedSizeGt);
    if(v){
      var arr = v.split(',');

      if(arr.length<gtLen){
        return false;
      }else{
        return true;
      }
    }else{
      if(!json.require){
        return true;
      }
      return false;
    }
  };
  /**
   * 多选框 至少选择 多少项验证
   */
  Validator.checkedSizeGt = function(el,json){

    if(!json.checkedSizeGt){
      return true;
    }
    var gtLen = parseInt(json.checkedSizeGt);
    var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
    if((!json.require)&&(checkedLen==0)){
      return true;
    }
    if(checkedLen<gtLen){ //小于 至少选择数 则返回false
      return false;
    }
    return true;
  };
  Validator.checkedSizeLt4value = function(v,json){
    if(!json.checkedSizeLt){
      return true;
    }
    if(!v){
      v = '';
    }
    var arr = v.split(',');

    var ltLen = parseInt(json.checkedSizeLt);
    if((!json.require)&&((!v) || arr.length==0)){
      return true;
    }
    if(arr.length>ltLen){ //大于 最多选择数 则返回false
      return false;
    }
    return true;
  };
  /**
   * 多选框 最多选择 多少项验证
   */
  Validator.checkedSizeLt = function(el,json){

    if(!json.checkedSizeLt){
      return true;
    }
    var ltLen = parseInt(json.checkedSizeLt);
    var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
    if((!json.require)&&checkedLen==0){
      return true;
    }
    if(checkedLen>ltLen){ //大于 最多选择数 则返回false
      return false;
    }
    return true;
  };
  /**
   * 多选框 恰好选择 多少项验证
   */
  Validator.checkedSizeEq = function(v,json){

    if(!json.checkedSizeEq){
      return true;
    }
    var eqLen = parseInt(json.checkedSizeEq);
    if(!v){
      v = '';
    }
    var arr = v.split(',');
    if((!json.require)&&((!v)||arr.length==0)){
      return true;
    }
    if(arr.length!=eqLen){ //不等于 配置的相等选择数 则返回false
      return false;
    }
    return true;
  };
  /**
   * 多选框 恰好选择 多少项验证
   */
  Validator.checkedSizeEq = function(el,json){

    if(!json.checkedSizeEq){
      return true;
    }
    var eqLen = parseInt(json.checkedSizeEq);
    var checkedLen = $(el).find('input[type="checkbox"]:checked').length;
    if((!json.require)&&checkedLen==0){
      return true;
    }
    if(checkedLen!=eqLen){ //不等于 配置的相等选择数 则返回false
      return false;
    }
    return true;
  };

  /**
   * 手机验证码不能为空的校验
   * @param el
   * @param json
   */
  Validator.checkMsgCode = function(el,json){
    var v = $(el).val();
    return Validator.checkMsgCode4value(v,json);
  };
  /**
   * 验证码非空校验
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.checkMsgCode4value = function(v,json){
    if(json.checkMsgCode){
      if(!v){
        return false;
      }
    }
    return true;
  };
  /****
   * 指定范围的手机号码验证
   * @param el
   * @param json
   */
  Validator.cellphones = function(el,json){
    var v = $(el).val();
    return Validator.cellphones4value(v,json);
  };
  /**
   * 校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.cellphones4value = function(el,json){
    var v = $(el).val();
    var phones = json.cellphones;
    if(!phones){
      return true;
    }
    if(!v){ //如果配置了电话号码范围，却没有值则表示不在范围内
      return false;
    }
    var arr = $.trim(phones).split(',');
    for(var i= 0,len=arr.length;i<len;i++){
      if($.trim(arr[i]) == v){
        return true;
      }
    }
    return false;
  };
  /** 校验值是否在枚举值范围内****/
  Validator.enumData = function(el,json){
    var v = $(el).val();
    return Validator.enumData4value(v,json);
  };
  /***
   * 枚举项 校验 {enumData:[{value:1,display:'hello1'},{value:2,display:'hello2'}]}
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.enumData4value = function(v,json){
    var flag = true;
    if(typeof v =='undefined'){
      return flag;
    }
    if(typeof v =='string'){
      if(!v){
        return flag;
      }
    }
    if(!json.enumData){
      return flag;
    }

    var data = oui.parseJson(json.enumData);
    if(!data.length){
      return flag;
    }
    if(json.isMulti){//多个枚举值
      var vs = v.split(',');

      for(var i= 0,len=vs.length;i<len;i++){
        var one = null;
        one = oui.findOneFromArrayBy(data,function(item){
          if((item.value+'') == (vs[i]+'')){
            return true;
          }
        });
        if(!one){
          flag = false;
          return flag;
        }
      }
    }else{
      var one = oui.findOneFromArrayBy(data,function(item){
        if((item.value+'') == (v+'')){
          return true;
        }
      });
      if(!one){
        flag = false;
      }
    }

    return flag;
  };
  /**
   * 手机号码或邮箱的校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.emailOrPhone = function(el,json){
    var v = $(el).val();
    return Validator.emailOrPhone4value(v,json);
  };

  /**
   * 手机号码或邮箱的校验
   */
  Validator.emailOrPhone4value = function(v,json){
    if(!json.emailOrPhone){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (mobileReg.test(value) != true) {
      var arr = v.split(';');
      var flag=false;
      for(var i=0,len=arr.length;i<len;i++){
        if(!arr[i]){
          continue;
        }
        flag = emailReg.test(arr[i]);
        if(!flag){
          return false;
        }
      }
      return true;
    }
    return true;
  };

  /**
   * 6-18位纯数字校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.numberSixToEighteen = function(el,json){
    var v = $(el).val();
    return Validator.numberSixToEighteen4value(v,json);
  };

  var numberSixToEighteenReg = /^[0-9]{6,18}$/;

  /**
   * 6-18位纯数字校验
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.numberSixToEighteen4value = function(v,json){
     
    if(!json.numberSixToEighteen){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (numberSixToEighteenReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 6-18位数字加英文字母校验
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.numberAndEngSixToEighteen = function(el,json){
    var v = $(el).val();
    return Validator.numberAndEngSixToEighteen4value(v,json);
  };
  var numberAndEngSixToEighteenReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
  /**
   * 6-18位数字加英文字母校验
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.numberAndEngSixToEighteen4value = function(v,json){
    if(!json.numberAndEngSixToEighteen){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (numberAndEngSixToEighteenReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 密码为数字，大、小写字母，特殊符号至少包含三种，长度为8-18位
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombinations = function(el,json){
    var v = $(el).val();
    return Validator.passForThreeCombinations4value(v,json);
  };
  var passForThreeCombinationsReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,18}$/;
  /**
   * 密码为数字，大、小写字母，特殊符号至少包含三种，长度为8-18位
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombinations4value = function(v,json){
    if(!json.passForThreeCombinations){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passForThreeCombinationsReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passStartWithEng = function(el,json){
    var v = $(el).val();
    return Validator.passStartWithEng4value(v,json);
  };
  var passStartWithEngReg = /^[a-zA-Z]\w{6,18}$/;

  /**
   * 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passStartWithEng4value = function(v,json){
    if(!json.passStartWithEng){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passStartWithEngReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-18 之间
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithoutSpecChar = function(el,json){
    var v = $(el).val();
    return Validator.passForThreeCombWithoutSpecChar4value(v,json);
  };
  var passForThreeCombWithoutSpecCharReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,18}$/;
  /**
   * 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-18之间
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithoutSpecChar4value = function(v,json){
    if(!json.passForThreeCombWithoutSpecChar){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passForThreeCombWithoutSpecCharReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-18 之间
   * @param el
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithSpecChar = function(el,json){
    var v = $(el).val();
    return Validator.passForThreeCombWithSpecChar4value(v,json);
  };
  var passForThreeCombWithSpecCharReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/;
  /**
   * 必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-18之间
   * @param v
   * @param json
   * @returns {boolean}
   */
  Validator.passForThreeCombWithSpecChar4value = function(v,json){
    if(!json.passForThreeCombWithSpecChar){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (passForThreeCombWithSpecCharReg.test(value) != true) {
      return false;
    }
    return true;
  };

  /**
   * 移动电话号码校验
   */
  Validator.phone = function(el,json){
    var v = $(el).val();
    return Validator.phone4value(v,json);
  };

  var mobileReg = /^1[3456789]\d{9}$/;
  /**
   * 移动电话号码校验
   */
  Validator.phone4value = function(v,json){
    if(!json.phone){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (mobileReg.test(value) != true) {
      return false;
    }
    return true;
  };
  // sixNumberAndEng sixNumber fourNumber
  /**
   * 6位数字及英文组合校验
   */
  Validator.sixNumberAndEng = function(el,json){
    var v = $(el).val();
    return Validator.sixNumberAndEng4value(v,json);
  };

  var sixNumberAndEngReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6}$/;
  /**
   * 6位数字及英文组合校验
   */
  Validator.sixNumberAndEng4value = function(v,json){
    if(!json.sixNumberAndEng){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (sixNumberAndEngReg.test(value) != true) {
      return false;
    }
    return true;
  };
  /**
   * 6位纯数字校验
   */
  Validator.sixNumber = function(el,json){
    var v = $(el).val();
    return Validator.sixNumber4value(v,json);
  };

  var sixNumberReg = /^[0-9]{6}$/;
  /**
   * 6位纯数字校验
   */
  Validator.sixNumber4value = function(v,json){
    if(!json.sixNumber){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (sixNumberReg.test(value) != true) {
      return false;
    }
    return true;
  };
  /**
   * 4位纯数字校验
   */
  Validator.fourNumber = function(el,json){
    var v = $(el).val();
    return Validator.fourNumber4value(v,json);
  };

  var fourNumberReg = /^[0-9]{4}$/;
  /**
   * 4位纯数字校验
   */
  Validator.fourNumber4value = function(v,json){
    if(!json.fourNumber){
      return true;
    }
    if(!v){
      return true;
    }
    var value = "" + v;
    if (fourNumberReg.test(value) != true) {
      return false;
    }
    return true;
  };
  /*
     *  网址正则规则
     */
  var websiteReg = new RegExp("^(http|https)\\://(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])|([a-zA-Z0-9_\\-\\.])+\\.(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum|uk|me))((:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\\-\\._\\?\\,\\'/\\\\\\+&amp;%\\$#\\=~])*)$");

  /**
   * 网址校验
   */
  Validator.website = function(el,json){
    var v = $(el).val();
    return Validator.website4value(v,json);
  };
  /**
   * 网址校验
   *
   */
  Validator.website4value=function(v,json){
    if(!json.website){ //没配置网址校验
      return true;
    }
    if(!v){ // 没有必填，并且值为空不用校验
      return true;
    }

    if(!websiteReg.test(v)){ //网址的正则校验
      return false;
    }
    return true;
  };
  // var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
  var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  /**
   * email 校验
   */
  Validator.email = function(el,json){
    var v = $(el).val();
    return Validator.email4value(v,json);
  };
  /**
   * 校验email
   */
  Validator.email4value = function(v,json){
    if(!json.email){
      return true;
    }
    if(!v){
      return true;
    }
    var arr = v.split(';');
    var flag=false;
    for(var i=0,len=arr.length;i<len;i++){
      if(!arr[i]){
        continue;
      }
      flag = emailReg.test(arr[i]);
      if(!flag){
        return false;
      }
    }
    return true;
  };
  /**
   * 固定电话校验
   */
  Validator.tel =function(el,json){
    var v = $(el).val();
    return Validator.tel4value(v,json);
  };
  /**
   * 固定电话校验
   */
  Validator.tel4value = function(v,json){
    if(!v){
      return true;
    }
    if(!json.tel){
      return true;
    }
    var result=v.match(/\d{3}-\d{8}|\d{4}-\d{7}/);
    if(result==null){
      return false;
    }
    return true;
  };
  /**
   * 传真号码正则
   */
  var faxReg = /^(\d{3,4}-)?\d{7,8}$/;
  /**
   * 传真号码校验
   */
  Validator.fax = function(el,json){
    var v = $(el).val();
    return Validator.fax4value(v,json);
  };
  /**
   * 传真号码校验值
   */
  Validator.fax4value = function(v,json){
    if(!v){
      return true;
    }
    if(!json.fax){
      return true;
    }
    return faxReg.test(v);
  };

  function isDate(dateString){
    if(dateString.trim()=="")return true;
    //年月日正则表达式
    var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(r==null){
      return false;
    }
    var d=new Date(r[1],r[3]-1,r[4]);
    var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
    return (num!=0);
  };
  function isDateTime(dateString)
  {
    if(dateString.trim()=="")return true;
    var result=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if(result==null) return false;
    var d= new Date(result[1], result[3]-1, result[4], result[5], result[6], result[7]);
    return (d.getFullYear()==result[1]&&(d.getMonth()+1)==result[3]&&d.getDate()==result[4]&&d.getHours()==result[5]&&d.getMinutes()==result[6]&&d.getSeconds()==result[7]);
  }
  function isDateYMDhm(dateString){
    if(dateString.trim()=="")return true;
    var str = dateString+':01';
    if(isDateTime(str)){
      return true;
    }else{
      return false;
    }
  }
  function isDateYMDh(dateString){
    if(dateString.trim()=="")return true;
    var str = dateString+':01:01';
    if(isDateTime(str)){
      return true;
    }else{
      return false;
    }
  }
  function isDateYM(dateString){
    if(dateString.trim()=="")return true;
    var str= dateString+"-01";
    if(isDate(str)){
      return true;
    }else{
      return false;
    }
  };
  function isDateY(dateString){
    if(dateString.trim()=="")return true;
    var str= dateString+"-01-01";
    if(isDate(str)){
      return true;
    }else{
      return false;
    }
  };


  /** 日期年月日 时:分:秒 验证**/
  Validator.dateYMDhms =function(el,json){
    var v =$(el).val();
    return Validator.dateYMDhms4value(v,json);
  };
  Validator.dateYMDhms4value = function(v,json){
    var flag = true;
    if(!json.dateYMDhms){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateTime(v+'');
      }
    }
    return flag;
  };
  /** 日期年月日 时:分 验证**/
  Validator.dateYMDhm =function(el,json){
    var v =$(el).val();
    return Validator.dateYMDhm4value(v,json);
  };
  Validator.dateYMDhm4value = function(v,json){
    var flag = true;
    if(!json.dateYMDhm){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateYMDhm(v+'');
      }
    }
    return flag;
  };

  /** 日期年月日 时 验证**/
  Validator.dateYMDh =function(el,json){
    var v =$(el).val();
    return Validator.dateYMDh4value(v,json);
  };
  Validator.dateYMDh4value = function(v,json){
    var flag = true;
    if(!json.dateYMDh){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateYMDh(v+'');
      }
    }
    return flag;
  };
  /** 日期年月日 验证**/
  Validator.dateYMD =function(el,json){
    var v =$(el).val();
    return Validator.dateYMD4value(v,json);
  };
  Validator.dateYMD4value = function(v,json){
    var flag = true;
    if(!json.dateYMD){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDate(v+'');
      }
    }
    return flag;
  };
  /** 年月 校验****/
  Validator.dateYM =function(el,json){
    var v =$(el).val();
    return Validator.dateYM4value(v,json);
  };
  Validator.dateYM4value = function(v,json){
    var flag = true;
    if(!json.dateYM){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateYM(v+'');
      }
    }
    return flag;
  };
  /** 年 校验****/
  Validator.dateY =function(el,json){
    var v =$(el).val();
    return Validator.dateY4value(v,json);
  };
  Validator.dateY4value = function(v,json){
    var flag = true;
    if(!json.dateY){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = isDateY(v+'');
      }
    }
    return flag;
  };
  /**
   *  整数：^-?\d+$
   非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$
   正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
   非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$
   负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
   浮点数 ^(-?\d+)(\.\d+)?$
   */
  /**
   * 数字校验
   */
  Validator.number = function(el,json){
    var v =$(el).val();
    return Validator.number4value(v,json);
  };
  /***
   * 是否为整数
   * @param v
   * @returns {boolean}
   */
  var intNumber = function(v){
    var intReg = /^-?\d+$/;
    var flag = true;
    if(typeof v !='undefined'){
      if(v+''){
        flag = intReg.test(v+'');
      }
    }
    return flag;
  };
  var floatNumber = function(v){
    var floatReg = /^(-?\d+)(\.\d+)?$/;
    var flag = true;
    if(typeof v !='undefined'){
      if(v+''){
        flag = floatReg.test(v+'');
      }
    }
    return flag;
  };
  Validator.number4value = function(v,json){
    var flag = true;
    if(!json.number){
      return flag;
    }
    if(typeof v !='undefined'){
      if(v+''){
        flag = intNumber(v)||floatNumber(v);
      }
    }
    return flag;
  };
  /**
   * qq号码校验规则
   */
  var qqReg = /^[1-9][0-9]{4,9}$/;
  /**
   * qq号码校验
   */
  Validator.qq = function(el,json){
    var v =$(el).val();
    return Validator.qq4value(v,json);
  };
  Validator.qq4value = function(v,json){
    if(!v){
      return true;
    }
    if(!json.qq){
      return true;
    }
    return qqReg.test(v);
  };
  oui.$.Validator = Validator;

  /**
   * pc端 清除非数字输入
   */
  oui.clearNotNum4pc = function(event,obj,isInt,canNotMinus,maxLength,isNotFocus){
    event = window.event || event;
    if (event.keyCode == 37 | event.keyCode == 39) {
      return;
    }
    var lastPos = oui.getCurPos(obj);
    var t = obj.value.charAt(0);
    //先把非数字的都替换掉，除了数字和.
    obj.value = obj.value.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是.
    obj.value = obj.value.replace(/^\./g, "");
    //保证只有出现一个.而没有多个.
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //如果第一位是负号，则允许添加   如果不允许添加负号 可以把这块注释掉

    if(isInt&&obj.value){//如果只支持整数
      obj.value = ''+obj.value;
      if(obj.value.indexOf('.')>=0){
        obj.value = obj.value.substring(0,obj.value.indexOf('.'));
      }

    }

    if (t == '-'&&(!canNotMinus)) {//如果支持负数
      obj.value = '-' + obj.value;
    }
    var v =obj.value;
    var vLen =v.length;
    if(vLen>15){ //数字校验，长度不能超过15
      var hasMinus=false,isNotInt=false;
      if(v.indexOf('-')==0){
        vLen--;
        hasMinus=true;
      }
      if(v.indexOf('.')>0){
        vLen--;
        isNotInt=true;
      }
      if(vLen>15){
        var numLen=15;
        if(hasMinus&&isNotInt){
          numLen+=2;
        }else if(hasMinus || isNotInt){
          numLen+=1;
        }
        v = v.substring(0,numLen);
        obj.value = v;
      }
    }
    if(maxLength){
      obj.value  = obj.value.substring(0,maxLength);
    }
    oui.setCurPos(obj,lastPos,lastPos,isNotFocus);
  };
  /**
   * 清除不是数字的字符
   * @param obj
   * @param isInt
   * @param canNotMinus
   * @param maxLength
   * @param dotNum
   */
  oui.clearNoNum = function(obj,isInt,canNotMinus,maxLength,dotNum){
    var sIndex = -1;
    try {
      sIndex = obj.selectionStart;
    }catch (e){

    }

    if(obj.value.length <= 0) return;
    var fh='';
    if(obj.value.indexOf('-')==0){
      fh='-';
    }

    //先把非数字的都替换掉，除了数字和.
    obj.value = obj.value.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是.
    obj.value = obj.value.replace(/^\./g, "");
    //保证只有出现一个.而没有多个.
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    if(isInt&&obj.value){//如果只支持整数
      obj.value = ''+parseInt(obj.value);
      if(obj.value.indexOf('.')>=0){
        obj.value = obj.value.substring(0,obj.value.indexOf('.'));
      }
    }

    if (!canNotMinus) {//如果支持负数
      obj.value = fh + obj.value;
    }

    var vIndex = obj.value.indexOf(".");
    var toalLen = 15;
    dotNum = dotNum || 4;
    var v = obj.value;
    var _v = v.split(".")[0];
    var __v = v.split(".")[1];
    if (vIndex > -1) {
      for (var __len = dotNum; __len >= 0; __len--) {
        if (__v && __v.length >= __len) {
          var _len = toalLen - __len;

          if (_v.length >= _len) {
            _v = _v.substring(0, _len);
          }

          if (__v.length > 0) {
            v = _v + '.' + __v.substring(0, __len);
          }
          break;
        }
      }
    } else {
      if (_v.length > toalLen) {
        v = _v.substring(0, toalLen);
      }
    }
    obj.value = v;

    if(maxLength){
      obj.value  = obj.value.substring(0,maxLength);
    }

    if(sIndex > -1){
      try {
        obj.setSelectionRange(sIndex, sIndex);
      }catch (e){
      }
    }
  };

})(window);





