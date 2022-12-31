!(function(win,$){
  /**
   * 错误码配置

   */
  oui.errorCode={
    'go2login':'1001', //需要转到登陆页
    'go2reg':'1002'// 需要转到注册页
  };
  /**
   * 回到登陆页
   */
  oui.go2login=function(ret){
    if((typeof ret =='object')&&(!ret.success) && (ret.errorType == 'not_login')){
      oui.getTop().oui.confirmDialog('当前会话已失效,回到首页登录',function(){
        let loginType = oui.cookie('loginType');
        if(loginType == 'admin'){
          oui.cookie('loginType',"");
          window.location.replace(oui.getContextPath()+'index4vue.html#res_startwe/html/admin.vue.html');
        } else {
          window.location.replace(oui.getContextPath()+'index4vue.html#res_startwe/html/login.vue.html');
        }
      },function(){},{title:'登录超时'});
      return true;
    }
    return false;
  };
  /*** 数据类型枚举*****/
  oui.dataTypeEnum={
    STRING:{
      name:'STRING',
      value:0,
      showType:0,
      opt:'=,!=,like,startWith,notStartWith,endWith,notEndWith,Null,NotNull,NullOrEmpty,NotNullAndEmpty',
      assign:'=',
      controlType:'textfield',
      desc:'字符串'
    },
    NUMBER_INTEGER:{
      name:'NUMBER_INTEGER',
      value:1,
      showType:0,
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      controlType:'number',
      dotNum:0,
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      desc:'数字Integer'
    },
    NUMBER_LONG:{
      name:'NUMBER_LONG',
      value:2,
      showType:0,
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      controlType:'number',
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      dotNum:0,
      desc:'数字Long'
    },
    NUMBER_DOUBLE:{
      name:'NUMBER_DOUBLE',
      value:3,
      showType:0,
      dotNum:5,
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      controlType:'number',
      desc:'数字DOUBLE'
    },
    BOOLEAN:{
      name:'BOOLEAN',
      opt:'=,!=,Null,NotNull',
      showType:0,
      controlType:'switch',
      assign:'=,&=,|=',
      value:4,
      desc:'布尔'
    },
    DATE:{
      name:'DATE',
      controlType:'datepicker',
      showType:0,//yMd
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      assign:'=',
      value:5,
      desc:'日期'
    },
    DATETIME:{//时间格式 yyyy-MM-dd HH:mm
      name:'DATETIME',
      controlType:'datepicker',
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      assign:'=',
      showType:7,
      value:6,
      desc:'日期时间'
    },
    ARRAYS_INTEGER:{ // Integer数组
      name:'ARRAYS_INTEGER',
      value:7,
      opt:'=,>,>=,<,<=,!=,in,notIn,between,notBetween,Null,NotNull',
      assign:'=',
      showType:0,
      controlType:'number',
      dotNum:0,
      desc:'Integer数组'
    },
    ARRAYS_STRING:{
      name:'ARRAYS_STRING',
      value:8,
      opt:'=,!=,like,in,notIn,startWith,notStartWith,endWith,notEndWith,Null,NotNull,NullOrEmpty,NotNullAndEmpty',
      showType:0,
      assign:'=',
      controlType:'textfield',
      desc:'字符串数组'
    },
    TIME:{//时间类型 格式：HH:mm
      name:'TIME',
      controlType:'timepicker',
      showType:0,
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      assign:'=',
      value:9,
      desc:'时间'
    },
    ARRAYS_LONG:{// Long 数组
      name:'ARRAYS_LONG',
      controlType:'number',
      showType:0,
      opt:'=,>,>=,<,<=,!=,in,notIn,between,notBetween,Null,NotNull',
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      dotNum:0,
      value:10,
      desc:'Long数组'
    },
    TABLE:{ //表模型
      name:'TABLE',
      controlType:'outercontrol',
      showType:0,
      opt:'=,!=,Null,NotNull',
      assign:'=',
      dotNum:0,
      value:11,
      desc:'表模型'
    },
    TABLE_DATA:{//数据模型
      name:'TABLE_DATA',
      controlType:'outercontrol',
      showType:0,
      opt:'=,!=,Null,NotNull',
      assign:'=',
      dotNum:0,
      value:12,
      desc:'数据模型'
    },
    DATAMAP:{
      name:'DATAMAP',
      value:13,
      showType:0,
      opt:'=,!=,Null,NotNull',
      assign:'=',
      controlType:'outercontrol',
      desc:'DataMap'

    },
    DATAMAP_LIST:{
      name:'DATAMAP_LIST',
      value:14,
      showType:0,
      opt:'=,!=,Null,NotNull',
      assign:'=',
      controlType:'outercontrol',
      desc:'DataMapList'
    },
    NUMBER_DECIMAL:{
      name:'NUMBER_DECIMAL',
      value:15,
      showType:0,
      dotNum:5,
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      controlType:'number',
      desc:'数字BigDecimal'
    },
    CHAR:{
      name:'CHAR',
      value:16,
      showType:0,
      opt:'=,!=,Null,NotNull,NullOrEmpty,NotNullAndEmpty',
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      controlType:'textfield',
      desc:'Char'
    },
    NUMBER_FLOAT:{
      name:'NUMBER_FLOAT',
      value:17,
      showType:0,
      dotNum:5,
      opt:'=,>,>=,<,<=,!=,between,notBetween,Null,NotNull',
      assign:'=,+=,-=,*=,/=,%=,<<=,>>=,>>>=,&=,|=',
      controlType:'number',
      desc:'数字Float'
    },

    OBJECT:{
      name:'OBJECT',
      value:18,
      showType:0,
      opt:'=,!=,Null,NotNull',
      assign:'=',
      controlType:'editree',
      desc:'Object'
    },
    TREE_NODE:{
      name:'TREE_NODE',
      value:19,
      showType:0,
      opt:'=,!=,Null,NotNull',
      assign:'=',
      controlType:'edittree',
      desc:'TreeNode'
    }
  };
  oui.fieldTypeEnum ={
    "int_type":{
      "name":"int_type",
      "desc":"int",
      "dataType":"NUMBER_INTEGER"
    },
    "double_type":{
      "name":"double_type",
      "desc":"double",
      "dataType":"NUMBER_DOUBLE"
    },
    "float_type":{
      "name":"float_type",
      "desc":"float",
      "dataType":"NUMBER_DOUBLE"
    },
    "long_type":{
      "name":"long_type",
      "desc":"long",
      "dataType":"NUMBER_LONG"
    },
    "short_type":{
      "name":"short_type",
      "desc":"short",
      "dataType":"NUMBER_INTEGER"
    },
    "byte_type":{
      "name":"byte_type",
      "desc":"byte",
      "dataType":"NUMBER_INTEGER"
    },
    "boolean_type":{
      "name":"boolean_type",
      "desc":"boolean",
      "dataType":"BOOLEAN"
    },
    "char_type":{
      "name":"char_type",
      "desc":"char",
      "dataType":"STRING"
    },
    "string_type":{
      "name":"string_type",
      "desc":"string",
      "dataType":"STRING"
    },
    "decimal_type":{
      "name":"decimal_type",
      "desc":"decimal",
      "dataType":"NUMBER_DECIMAL"
    },
    "date_type":{
      "name":"date_type",
      "desc":"date",
      "dataType":"DATE"
    },
    "datetime_type":{
      "name":"datetime_type",
      "desc":"datetime",
      "dataType":"DATETIME"
    },
    "time_type":{
      "name":"time_type",
      "desc":"time",
      "dataType":"TIME"
    },
    "table_type":{
      "name":"table_type",
      "desc":"实体",
      "dataType":"TABLE"
    },
    "tableData_type":{
      "name":"tableData_type",
      "desc":"实体列表",
      "dataType":"TABLE_DATA"
    },
    "object_type":{
      "name":"object_type",
      "desc":"Object",
      "dataType":"OBJECT"
    },
    "tree_node_type":{
      "name":"tree_node_type",
      "desc":"TreeNode",
      "dataType":"TREE_NODE"
    },
    "upload_file_type":{
      "name":"upload_file_type",
      "desc":"附件",
      "dataType":"UPLOAD_FILE"
    }

  };

  /**
   * 发送短信验证码
   * @param phone
   * @param sendingReason
   */
  oui.sendPhoneCode = function(phone,owner,bizType){
    var url = oui_url.smsSendUrl||'';
    if(!url){
      throw  new Error('短信验证码发送路径不能为空');
    }
    /** 极验成功 后会设置 极验 验证码 到 ouiValidateCode,和对应手机号码  ouiValidatePhone***/
    var ouiValidateVerify = oui.getPageParam('ouiValidateVerify');
    var ouiValidatePhone = oui.getPageParam('ouiValidatePhone');
    /** 如果没有收到极验时的极验 验证码 则返回****/
    if(!ouiValidateVerify){
      oui.getTop().oui.alert("极验失败，不能发送短信验证码");
      return ;
    }
    /** 如果没有收到极验时用的 手机号码 则返回 ***/
    if((!ouiValidatePhone) || (ouiValidatePhone != phone)){
      oui.getTop().oui.alert("极验失败，不能发送短信验证码");
      return ;
    }
    if(!owner){
      throw new Error('发送短信验证码失败，owner不能为空');
    }
    if(!bizType){
      throw new Error('发送短信验证码失败，bizType不能为空');
    }
    var param = {
      phone:phone,
      ouiValidatePhone:ouiValidatePhone,
      owner:owner,
      bizType:bizType,
      verify_code:oui.parseString(ouiValidateVerify)
    };
    oui.getData(url,param ,function(res){
      if(res.success){ //成功发送验证码到手机

      }else{ //发送验证码失败
        oui.getTop().oui.alert(res.msg);
      }
    });
  };
  /**
   * 回到注册页
   */
  oui.go2reg=function(ret){
    if((typeof ret =='object')&&(!ret.success) && ((ret.msg + "")==oui.errorCode.go2reg)){
      oui.confirmDialog('您还未注册,进入注册页',function(){
        //积木云 JMY-893在线查看的预览和查看模版不可用
        //window.location.href = oui.getContextPath()+'login.do?method=reg';

        window.location.href = oui.getContextPath()+'index.html?method=reg';

      },function(){},{title:'温馨提示'});
      return true;
    }
    return false;
  };
  /**
   * 向服务器端请求数据
   * 第一个参数url 传入null调用统一控制器
   * 第二个参数params url后跟的参数
   * 第三个参数callback 回调函数(回调函数为null就是同步请求，并将服务器发来的数据作为返回值，同步申请也不需要滚动条
   * 给了回调函数的话，将它作为请求成功的回调函数，并将服务器返回的值作为回调函数的第一个参数)
   * 第四个参数progressBar 进度条（不给出表示使用默认进度条，null表示不需要进度条，ProgressBar对象表示需要自己控制进度条）
   */
  oui.getData = function(url,params,callback,progressBar,error){

    var options = {};
    if(typeof url =='object'){
      options = url;
      url = options.url;
      params = options.params || params;
      callback = options.callback || callback;
      progressBar = options.progressBar ||progressBar;
      error = options.error || error;
    }
    if(progressBar){
      oui.progress(typeof progressBar =='string' ?progressBar:'加载中...');
    }else if(typeof progressBar =='undefined'){
      oui.progress('加载中...');
    }
    var ajaxResult=null;
    url = oui.addOuiParams4Url(url);
    if(params){
      var json = oui.parseJson(params);
      for(var i in json){
        if(json.hasOwnProperty(i)){
          url = oui.setParam(url,i,oui.parseString(json[i]));
        }
      }
    }
    $.ajax({
      url : url,
      data : {},
      timeout:10000000,
      success : function(text) {
        try{
          var obj = oui.parseJson(text);
          ajaxResult = obj;
        }catch(e){
          ajaxResult = text;
        }
        //login.do?method=index
        //判断是否是自动登陆返回的信息，如果是重新刷新页面
        //session消失逻辑判断
        if (oui.go2login(ajaxResult)) { //登陆拦截
          oui.progress.hide();
          return;
        }
        if (oui.go2reg(ajaxResult)) { //注册拦截
          oui.progress.hide();
          return;
        }
        if($.isPlainObject(ajaxResult)){
          if (ajaxResult.hasOwnProperty("success") && ajaxResult.hasOwnProperty("msg")) {
            if (ajaxResult.success != true) {
              if(error){
                error(ajaxResult);
              } else {
                oui.errorCallback(ajaxResult);
              }
              try{
                oui.progress.hide();
              }catch(e){
              }
              return;
            }
          }
        }
        callback && callback(ajaxResult);
        try{
          oui.progress.hide();
        }catch(e){
        }
        //callback&&callback(ajaxResult);
        //progressObj&&progressObj.hide();
        //console.log(new Date() - startData);
      },
      error : function(o) {
        if(error){
          error(o);
        } else {
          oui.errorCallback(o);
        }
        try {
          oui.progress.hide();
        }catch (e) {

        }
      },
      type : "GET",
      cache : false,
      contentType : 'text/json',
      dataType : "text",
      async:!callback?false:true
    });

    return ajaxResult;
  };
  /**
   *  ajax请求失败的执行方法
   *
   */
  oui.errorCallback = function(ret){
    var _oui = oui.getTop().oui || oui;
    console.log(ret);
    if(!ret){
      _oui.alert('请求失败，可能由于网络或者服务器无响应！');
      return ;
    }
    if(typeof ret =='string'){
      ret = _oui.parseJson(ret);
      if(!ret.msg){
        _oui.alert('请求失败，可能由于网络或者服务器无响应！');
      }
    }else if(typeof ret =='object'){
      if(ret.responseText && ((ret.status+'') =='404')){
        _oui.alert('请求失败，可能由于网络或者服务器无响应！');
        return ;
      }
    }
    if(!ret.msg){
      _oui.alert('请求失败，可能由于网络或者服务器无响应！');
      return ;
    }
    if(ret.errorType&&ret.errorType=='not_login'){
      _oui.alert(ret.msg,function(){
        //TODO 	跳转到登录
      });
    }else{
      _oui.alert(ret.msg);
    }
  };
  /**
   * 根据 html文本  截取body中的内容
   * @param text
   * @returns {string}
   */
  oui.getPageBodyHtml = function(text,filter){
    return oui.subHtml(text,'<body','</body>',filter);
  };
  /**截取html内容 ****/
  oui.subHtml = function(text,startTag,endTag,filter){
    if(startTag&&endTag){
      if( (text.indexOf(startTag)<0) || (text.lastIndexOf(endTag)<0)){
        return text;
      }else{
        var result = text.substring(text.indexOf(startTag),text.lastIndexOf(endTag));
        result=result+endTag;
        result = $(result);
        var arr =[];
        $(result).each(function(){
          if(filter){
            var flag = filter(this);
            if(typeof flag =='boolean'){
              //如果需要过滤 和排除则返回false
              if(!flag){
                return ;
              }
            }
          }
          arr.push(this.outerHTML);
        });
        result = arr.join('');
        return result;
      }
    }else{
      return text;
    }
  };
  /**截取html内容类型 ***/
  oui.SubContentType={
    subBody:1, //截取body中内容
    subHtml:2, //截取 整个html内容
    subBodyExcludeJSCss:3 //截取body中内容，剔除应用中js css资源
  };
  /* 根据内容截取****/
  oui.subContentBy=function(text,startTag,endTag,subContentType){
    var result='';
    try{
      if(startTag&& endTag){
        result = oui.subHtml(text,startTag,endTag);
      }else{
        switch (subContentType){
          case oui.SubContentType.subHtml:
            result = text;
            break;
          case oui.SubContentType.subBody:
            result = oui.getPageBodyHtml(text);
            break;
          case oui.SubContentType.subBodyExcludeJSCss:
            result = oui.getPageBodyHtml(text,function(el){
              if($(el).is('link')){
                return false;
              }
              if($(el).is('script') && ($(el).attr('src'))){
                return false;
              }
            });
            break;
        }
      }
    }catch(e){
      result = text ;
    }
    return result;
  };
  oui.callbacks={};
  oui.loadUrl4ThirdInclude = function(url,subContentType,progressBar,startTag,endTag,callback){
    if(typeof url=='object'){
      var temp = url;
      subContentType= temp.subContentType,progressBar=temp.progressBar,startTag=temp.startTag,endTag=temp.endTag,callback=temp.callback;
      var tempUrl=temp.url;
      url=tempUrl;
    }
    var callbackId = 'callback_'+oui.getUUIDLong();
    oui.callbacks[callbackId] = callback; //设置回调
    var iframeUrl = oui_context.contextPath+'webrobot-inner.html';
    iframeUrl = oui.setParam(iframeUrl,'_t',new Date().getTime());
    var iframe = document.getElementById('oui-third-iframe');
    if(iframe == null){
      $(document.body).append('<iframe style="width:1px;height:1px;visibility:hidden;" onload="oui.getPageParam(\''+callbackId+'\')();" id="oui-third-iframe" src="'+iframeUrl+'" ></iframe>');
      iframe = document.getElementById('oui-third-iframe');
      oui.setPageParam(callbackId,function(){
        setTimeout(function(){
          if(!iframe.contentWindow){
            iframe = document.getElementById('oui-third-iframe');
          }
          iframe.contentWindow.postMessage(  {//向子页面发送消息 用于ajax请求
                cmd:'loadUrl',
                param:{
                  url:url,
                  subContentType:subContentType,
                  progressBar:progressBar,
                  startTag:startTag,
                  endTag:endTag
                },
                callbackId:callbackId
              },
              '*');
        },1);
      });

    }else{
      iframe.contentWindow.postMessage(  {//向子页面发送消息 用于ajax请求
            cmd:'loadUrl',
            param:{
              url:url,
              subContentType:subContentType,
              progressBar:progressBar,
              startTag:startTag,
              endTag:endTag
            },
            callbackId:callbackId
          },
          '*');
    }
  };
  oui.loadUrl4ChromeExt = function(url,subContentType,progressBar,startTag,endTag,callback){
    if(typeof url=='object'){
      var temp = url;
      subContentType= temp.subContentType,progressBar=temp.progressBar,startTag=temp.startTag,endTag=temp.endTag,callback=temp.callback;
      var tempUrl=temp.url;
      url=tempUrl;
    }
    chrome.runtime.sendMessage(
        {
          cmd:'loadUrl',
          param:{
            url:url,
            subContentType:subContentType,
            progressBar:progressBar,
            startTag:startTag,
            endTag:endTag,
            callback:callback
          }
        },
        function(response) {
          callback&&callback(response);
        }
    );
  };

  /***
   * 根据url获取 url的html 内容 ，默认只有url一个参数 则截取body里面的内容，如果有startTag和endTag则获取 开始位置到endTag的位置进行截取
   * @param url
   * @param subContentType 值定义
   * 			oui.SubContentType.subBody --1、截取body中内容,
   * 			oui.SubContentType.subHtml--2、返回整个html,
   * 			oui.SubContentType.subBodyExcludeJSCss-- 3、截取body中内容，并且排除js和css的路径
   * @param progressBar
   * @param startTag
   * @param endTag
   * @param callback 含有callback则为异步回调
   * @param config 用法：oui.loadUrl(config); //支持一个对象配置参数，要求只能传入一个参数，并且参数中含有相关属性配置
   */
  oui.loadUrl = function(url,subContentType,progressBar,startTag,endTag,callback,postParam){

    if(typeof url=='object'){
      var temp = url;
      var subContentType= temp.subContentType,progressBar=temp.progressBar,startTag=temp.startTag,endTag=temp.endTag,callback=temp.callback,tempUrl=temp.url;
      url=tempUrl;
      postParam = temp.postParam;
    }
    if(postParam){
      oui.postData(url,postParam,function(res){
        callback&&callback(res);
      },function(res){
        callback&&callback(res);
      });
      return;
    }
    if(typeof subContentType=='undefined'){
      /** 默认值截取body***/
      subContentType= oui.SubContentType.subBody;
    }else{
      if(!subContentType){
        /** 截取整个html内容***/
        subContentType = oui.SubContentType.subHtml;
      }else{
        if(typeof subContentType =='boolean'){
          if(subContentType){
            subContentType= oui.SubContentType.subBody;
          }else{
            subContentType= oui.SubContentType.subHtml;
          }
        }
      }
    }
    var  progressObj=null;
    if(progressBar){

      progressObj = oui.progress(progressBar);
    }
    if(callback){
      oui.getData(url,{isHtml:true},function(ajaxResult){
        if(progressObj){
          progressObj.hide();
        }
        //异步处理
        var text = oui.subContentBy(ajaxResult,startTag,endTag,subContentType);
        callback(text);
      },false);
      return null;
    }else{
      var ajaxResult = oui.getData(url,{isHtml:true},null,false);
      ajaxResult = oui.subContentBy(ajaxResult,startTag,endTag,subContentType);
      if(progressObj){
        progressObj.hide();
      }
      return ajaxResult;
    }
  };
  /**
   * 将字符串转换成Unicode字符串
   * @param {} str 要转换的字符串
   * @return {String} Unicode字符串
   */
  function str2UnicodeHex(str){
    if(str==null || str==""){
      return "";
    }
    var tempBuffer = [];
    for(var i=0; i<str.length; i++){
      var tempChar = str.charCodeAt(i);
      //38是&号，61是=号
      //if(tempChar==38 || tempChar==61){
      if(tempChar<128){
        tempBuffer.push(str.charAt(i));
      }else{
        tempBuffer.push(addLength(Number(tempChar).toString(16)));
      }
    }
    return tempBuffer.join("");
  };
  var DataUtilZeroArray = ["\\u","\\u0","\\u00","\\u000"];
  function addLength(str){
    var count = 4-str.length;
    return DataUtilZeroArray[4-str.length]+str;
  }

//判断一个对象是否是是数组，如果不是，赋值，如果是，添加进去
  function putToArray(obj,name,value){
    if(obj[name]==null){//第一次是个属性
      obj[name] = value;
    }else if($.isArray(obj[name])){//第三次是数组，不用构造数组， 直接赋值
      obj[name].push(value);
    }else{//第二次 是数组，构造数组并且赋值
      var firstObj = obj[name];
      obj[name] = [];
      obj[name].push(firstObj);
      obj[name].push(value);
    }
  };
//将属性放入JSON对象中， 包含嵌套对象
  function putToObj(obj,item){
    var name = item.name;
    var value = item.value;

    var objNames = name.split(".");
    var nameLength = objNames.length;
    if(nameLength==0){//主对象
      obj[name] = value;
    }else{//子对象
      var preObj = obj;//上一级对象
      for(var i=0;i<nameLength;i++){
        var objName  = objNames[i];
        if(i==nameLength-1){//属性
          putToArray(preObj,objName,value);
        }else if(i==0){//第一级子对象
          if(obj[objName]==null||obj[objName]==""){
            obj[objName] = new Object();
          }
          preObj = obj[objName];
        }else{//其他级子对象
          preObj[objName] = new Object();
        }
      }
    }
  };
//获取表单数据的JSON格式
  $.fn.getFormValue = function(options){
    if(this[0].tagName.toLowerCase()!="form"){
      alert("当前对象不是form!");
      return;
    }
    var tempData = this.serializeArray();
    var result = {};
    if(tempData!=null && tempData.length>0){
      for(var i=0,len=tempData.length; i<len; i++){
        putToObj(result,tempData[i]);
      }
    }
    result = JSON.stringify(result);
    return result;
  };
  /***
   *
   *
   * 根据数组 拆分成多组
   * @param arr
   * @param groupSize
   * @returns {Array}
   */
  oui.splitArray = function(arr,batchSize,fun){
    var groups=[];
    if((!arr) ||(!arr.length)){
      throw new Error('分组数据不能为空');
    }
    batchSize = batchSize||500;
    if(arr.length<batchSize){
      groups.push( arr);
      fun&&fun(arr);
    }else{
      for(var startIndex= 0,max=arr.length;startIndex<max;startIndex+=batchSize){
        var endIndex = startIndex+batchSize;
        if(endIndex>max){
          endIndex = max;
        }
        var currArr = arr.slice(startIndex,endIndex);
        groups.push(currArr);
        fun&&fun(currArr);
      }
    }
    return groups;
  };
  oui.buildBatch = function(length,batchLength,fun){
    var groups=[];
    if( ! length ){
      throw new Error('分组数据不能为空');
    }
    batchLength = batchLength||500;
    if( length<batchLength){
      var temp = {start:0,end:length};
      groups.push( temp);
      fun&&fun(temp);
    }else{
      for(var startIndex= 0,max=length;startIndex<max;startIndex+=batchLength){
        var endIndex = startIndex+batchLength;
        if(endIndex>max){
          endIndex = max;
        }
        var curr = {start:startIndex,end:endIndex};
        groups.push(curr);
        fun&&fun(curr);
      }
    }
    return groups;
  };
  oui.runBatch = function(arr,run,over){
    var tasks = [];
    if(!arr){
      return ;
    }
    if(!arr.length){
      return ;
    }
    for(var i= 0,len=arr.length;i<len;i++){
      tasks.push({
        idx:i,
        source:arr[i],
        run:function(){
          var me = this;
          run&&run(me);
        },
        next:function(){
          var me = this;
          var idx = me.idx;
          if(idx==len-1){
            over&&over(me,arr);
          }else{
            tasks[idx+1].run();
          }
        }
      });
    }
    tasks[0].run();
  };
//请求数据状态
// var postDataRequestState = false;
  /*****
   * 提交参数
   * url, //业务提交url
   * mqUrl, //查询业务url对应mq队列的Url
   * data,//业务提交的数据
   * success,//在业务url提交成功后，自动会走队列查询轮询，查询队列url成功回调，成功后轮询结束
   * fail, //提交业务Url失败回调 //1、需要保证业务url提交成功才走 队列查询 2、如果队列查询超时也会执行失败逻辑
   * progress //进度
   * @param config
   */
  oui.postData4mq = function(config){
    var url = config.url;
    var data = config.data ||{};
    var success = config.success;
    var fail = config.fail;
    var progress = config.progress;
    var mqUrl = config.mqUrl;
    oui.postData(url,data,function(ret){
      config.result = ret;
      oui.postData4timer(config);
    },function(msg,ret){
      fail&&fail(msg,ret);
    },progress);
  };
  /** 轮询数据提交****/
  oui.postData4timer = function(config){
    if(oui.tempTimer){
      //当前存在 定时请求timer
      return;
    }
    var timeOut = config.timeOut || 1000*30;//默认尝试30秒查询队列结果
    var timeStep = config.timeStep ||1000;//默认间隔一秒轮询一次
    config.timeOut = timeOut;
    config.timeStep = timeStep;
    config.start = config.start || new Date().getTime();//默认值为0
    config.end = new Date().getTime();
    oui.tempTimer = setTimeout(function(){
      /** mq 结果查询****/
      var mqUrl = config.mqUrl;
      var result = config.result;
      oui.postData(mqUrl,result,function(mqResult){
        config.mqResult = mqResult;
        //成功回调后 处理
        config.success&&config.success(config.mqResult,config.result,config);
        oui.tempTimer = null;
      },function(msg,mqResult){
        config.mqResult = mqResult;
        config.mqMsg = msg;
        //失败回调后 轮询
        oui.tempTimer = null;
        config.end = new Date().getTime(); //重置end时间
        if(config.end - config.start>config.timeOut){ //超时退出
          config.fail&&config.fail('查询队列消息超时',mqResult);
          return ;
        }
        oui.postData4timer(config);
      },progress);
    },timeStep);
  };
//数据提交函数
  oui.postData = function(url,data,successCallBack,failedCallBack,progress){
    // if(postDataRequestState){
    // 	console.log(url);
    // 	oui.alert("不能重复提交,请稍候");
    // 	return;
    // }
    // if(postDataRequestState === false){
    //    postDataRequestState = true;
    // }
    if(successCallBack==null){
      oui.alert("回调函数为空!");
      // postDataRequestState = false;
      return;
    }

    if(typeof(data)=="string"){
      data = ((data==null)?"":(data));
    }else if(typeof(data)=="object"){
      data = JSON.stringify(data);
    }
    if(typeof progress=='undefined'){
      progress = '保存中';
    }
    if(progress){
      if(typeof progress=='string'){
        oui.progress(progress);
      }else{
        oui.progress('保存中');
      }
    }
    url = oui.addOuiParams4Url(url);
    $.ajax({
      url: url,
      type: "post",
      data: { ouiData: data },
      timeout:10000000,
      cache : false,
      //contentType : 'text/json',
      dataType : "json",
      error : function(ret){
        // postDataRequestState = false;
          oui.progress.hide();
   		  if(failedCallBack==null||failedCallBack==undefined){//不成功时，又无失败回调函数，则系统提示
            oui.errorCallback(ret);
          }else{//不成功时，有回调函数，执行回调函数
   			failedCallBack(ret);
   		  }
      },
      success: function (text) {
        // postDataRequestState = false;
        oui.progress.hide();
        var ret = text;



        console.log(ret);

        if(ret.success==true){//成功后执行成功回调函数


          successCallBack(ret);
        }else{//不成功时
          if(oui.go2login(ret)){ //登陆拦截
            return ;
          }
          if(oui.go2reg(ret)){ //注册拦截
            return ;
          }
          if(failedCallBack==null||failedCallBack==undefined){//不成功时，又无失败回调函数，则系统提示
            oui.getTop().oui.alert(ret.msg);
          }else{//不成功时，有回调函数，执行回调函数
            failedCallBack(ret.msg, ret);
          }
        }
      }
    });
  };
  /**
   * post 模拟表单提交
   * @param url 地址
   * @param data 数据
   * @param target 跳转target
   */
  oui.postForm = function (url, data, target) {
    var form = $("<form method='post' style='display: none;'></form>");
    form.attr({"action":url});
    var arg = null;
    for (arg in data) {
      var input = $("<input type='hidden' />");
      input.attr({"name":arg});
      input.val(data[arg]);
      form.append(input);
    }
    $(document.body).append(form);
    form.submit();
  };
  /*****
   * jsonutil
   */
  (function(_){
    var JsonPathUtil = {
      /**
       * init 初始化输入数据； 初始化事件 初始化执行
       */
      init : function() {

        $.fn.serializeObj = function(){
          var o = {};
          var a = this.serializeArray();
          $.each(a, function() {
            JsonPathUtil.setObjByPath(this.name,o,this.value||"");
          });
          return o;
        };
      },
      /**
       * 支持含数组的jsonpath
       * @param attr
       * @param obj
       * @param v
       */
      setObjByPath:function(attr,obj,v,notArray){
        if(typeof  notArray =='undefined'){
          notArray = false;
        }
        var arrStart = attr.indexOf("\[");
        var arrEnd = attr.indexOf("\]");
        if(arrStart<0 || arrEnd<0 || arrEnd < arrStart){
          return JsonPathUtil.setObjByPathNoArr(attr, obj, v,notArray);
        }
        var parts = attr.split("\.");
        var start =0,end = parts.length;
        var container = obj;
        try{
          for(start = 0; start < end; start++) {
            var part = parts[start];
            var arrStart = part.indexOf("\[");
            var arrEnd = part.indexOf("\]");
            if(arrStart>0 && arrEnd>arrStart){//含数组字符
              /*
               * 解析数组,对数组的值进行设置
               */
              var strIdx = part.substring(arrStart+1,arrEnd);
              var idx = parseInt(strIdx);
              var arrPart = part.substring(0,arrStart);
              if (!container[arrPart]){
                container[arrPart] = [];
              }
              if(!container[arrPart][idx] ){
                container[arrPart][idx] = {};
              }
              if(start == end -1){
                container[arrPart][idx] = v;
              }else{
                container = container[arrPart][idx];
              }
            }else{
              /*
               * 普通对象属性设置
               */
              if(start == end -1){
                JsonPathUtil.putToArray(container,part,v,notArray);
              }else{
                if (!container[part]){
                  container[part] = {};
                }
                container = container[part];
              }
            }
          }
        }catch(e){ //如果解析含数组jsonpath产生异常，则采用无数组jsonPath解析
          return JsonPathUtil.setObjByPathNoArr(attr, obj, v,notArray);
        }

        return obj;
      },
      /**
       * 无数组 存jsonpath的对象设置
       * @param attr
       * @param obj
       * @param v
       */
      setObjByPathNoArr:function(attr,obj,v,notArray){
        var parts = attr.split("\.");
        var start =0,end = parts.length;
        var container = obj;
        for(start = 0; start < end; start++) {
          var part = parts[start];
          if(start == end -1){//最后一个节点为属性
            JsonPathUtil.putToArray(container,part,v,notArray);
          }else{
            if (!container[part]){
              container[part] = {};
            }
            container = container[part];
          }
        }
        return obj;
      },
      /**
       * 给对象传入值，如果元素多次出现，则表现为数组
       */
      putToArray:function (obj,name,value,notArray){
        if(obj[name]==null){//第一次是个属性
          obj[name] = value;
        }else if(obj[name] instanceof Array){//第三次是数组，不用构造数组， 直接赋值
          //TODO 解决数组整体赋值的bug
          if(notArray){//不是数组，直接赋值
            obj[name] = value
          }else{//是数组追加值
            obj[name].push(value);
          }
        }else{//第二次 是数组，构造数组并且赋值
          if(notArray){
            obj[name] = value;
          }else{
            var firstObj = obj[name];
            obj[name] = [];
            obj[name].push(firstObj);
            obj[name].push(value);

          }
        }
      },

      getJsonByPath:function(attr, obj){
        if ((typeof obj == 'object') && (obj instanceof Array)) {
          return obj[attr];
        }
        if(typeof attr =='undefined'){
          return null;
        }
        var attrs = attr.split("\.");
        var temps = [ obj ];
        var idx = 0;
        for ( var k = 0; k < attrs.length; k += 1) {
          var item = temps[idx];
          if ((typeof item[attrs[k]]) == "undefined") {
            return null;
          }
          temps.push(item[attrs[k]]);
          idx += 1;
        }
        return temps[idx];
      }

    };
    _.JsonPathUtil = JsonPathUtil;
  })(oui);
  /*支持将form数据转多级对象的json*/
  oui.JsonPathUtil.init();






})(window,window.$$||window.$);