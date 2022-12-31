  (function (win,$) {
  /******
   * 控件的标签维护
   * @type {oui|{}}
   */
  var constant = oui.$.constant = {

    controlTagName: "oui-form",//我们表单控件标签名
    viewTagName:"oui-view", //页面模板框架
    reportTagName:"oui-report",//报表组件
    includeTagName: "oui-include",//我们的页面中的include标签
    tableTagName: "oui-table",//我们页面中的table标签
    pagerTagName: 'oui-pager', //分页标签
    conditionTagName: 'oui-condition',//查询条件标签
    controlClassNamePrefix: "oui-class-",//class前缀
    controlIdPrefix: "control_",//控件Id值前缀,由外部配置传入id值
    ouiIdName: "ouiId"//我们表单控件内部ID名
  };
  oui.parsingId=0;
  oui.parsingMap = {};
  /** 创建新的解析map,用于保证解析的回调调用***/
  oui.newParsingMap = function(){
    oui.parsingId++;
    oui.parsingMap[oui.parsingId] ={
      id:oui.parsingId,
      size:0,
      count:0
    };
    return oui.parsingMap[oui.parsingId];
  };
  /** 清空 解析map***/
  oui.clearParsingMap = function(map){
    oui.parsingMap[map.id] = null;
    delete oui.parsingMap[map.id];
    map = null;
  };
  /** 默认解析控件函数 ***/
  var defaultParse = function(container,callback){
    var tag = this.tag;
    var me = this;
    var paringMap = oui.newParsingMap();
    paringMap.tag = tag;
    container = container ||'body';
    var $tag =  $(tag,$(container));
    if($tag && $tag.length){
      paringMap.count = $tag.length;
      paringMap.size = $tag.length;
      $tag.each(function () {

        me.parseByDom(this,function(){
          paringMap.count--;
          if(paringMap.count<=0){
            callback&&callback(paringMap);
            oui.clearParsingMap(paringMap);// 清空解析map
          }
        }); // 根据dom进行解析控件对象
      });

    }else{
      if(paringMap&&(paringMap.count <=0)){
        callback&&callback(paringMap);
        oui.clearParsingMap(paringMap);// 清空解析map
      }
    }
  };
  /** 子枚举 默认解析函数,子枚举默认需要根据标签和 控件类型进行检索解析***/
  var defaultParse4childrenEnum = function(container,callback){
    var tag = this.tag;
    var me = this;
    var paringMap = oui.newParsingMap();
    paringMap.tag = tag;
    paringMap.controlClass = me.controlClass;
    container =container ||'body';
    var $tag = $(tag+'[type='+me.controlClass+']',$(container));
    if($tag&&$tag.length){
      paringMap.count = $tag.length;
      paringMap.size = $tag.length;
      $(tag+'[type='+me.controlClass+']',$(container)).each(function () {
        me.parseByDom(this,function(){
          paringMap.count--;
          if(paringMap.count<=0){
            callback&&callback(paringMap);
            oui.clearParsingMap(paringMap);// 清空解析map
          }
        }); // 根据dom进行解析控件对象
      });
    }else{
      if(paringMap&&(paringMap.count <=0)){
        callback&&callback(paringMap);
        oui.clearParsingMap(paringMap);// 清空解析map
      }
    }


  };
  /** 默认根据dom解析控件***/
  var defaultParseByDom = function(el,callback){
    var controlClass = this.controlClass;
    var Parser = oui.$.Parser;
    controlClass&&Parser.parseByDom(el,controlClass,callback); // 根据dom进行解析控件对象
  };
  /** 控件组件 依赖的css位置 ****/
  var CssTypeEnum={
    default:0, //默认可不指定，pc和移动适配
    noCss:1,//无样式，则该组件不需要显示引入css路径，或者由js组件内动态控制
    common:2//引入公共样式
  };
  /** 表单类控件枚举 TODO 列举表单类控件***/
  var FormControlEnum = {/** 枚举所有表单类控件**/
    /** pc 和移动公共的表单类控件**/
    address:{
      tag:constant.controlTagName,
      controlClass:'address',
      isCommon:true,
      cssType:CssTypeEnum.noCss
    },
    outercontrol:{
      tag:constant.controlTagName,
      controlClass:'outercontrol',
      isCommon:true,
      cssType:CssTypeEnum.noCss
    },
    /**pc 和 移动 都有的控件 */
    cellphone:{
      tag:constant.controlTagName,
      controlClass:'cellphone'
    },
    checkbox:{
      tag:constant.controlTagName,
      controlClass:'checkbox'
    },
    datepicker:{
      tag:constant.controlTagName,
      controlClass:'datepicker',
      fileName:'date-picker' //如果存在 文件名与类名不一致的情况配置，便于解析
    },
    hidden:{
      tag:constant.controlTagName,
      controlClass:'hidden'
    },

    multiselect:{
      tag:constant.controlTagName,
      controlClass:'multiselect',
      fileName:'multi-select'
    },
    number:{
      tag:constant.controlTagName,
      controlClass:'number'
    },
    password:{
      tag:constant.controlTagName,
      controlClass:'password'
    },
    radio:{
      tag:constant.controlTagName,
      controlClass:'radio'
    },
    score:{
      tag:constant.controlTagName,
      controlClass:'score'
    },
    singleselect:{
      tag:constant.controlTagName,
      controlClass:'singleselect',
      fileName:'single-select'
    },
    textarea:{
      tag:constant.controlTagName,
      controlClass:'textarea'
    },
    textfield:{
      tag:constant.controlTagName,
      controlClass:'textfield'
    },
    uploadfile:{
      tag:constant.controlTagName,
      controlClass:'uploadfile',
      fileName:'upload-file'
    },
    /** 只有pc有的控件 ****/
    htmleditor:{
      tag:constant.controlTagName,
      controlClass:'htmleditor',
      fileName:'html-editor'
    },
    richtext:{
      tag:constant.controlTagName,
      controlClass:'richtext'
    }

  };

  /** 自定义标签与控件类的配置枚举
   *  其中表单类控件，没有全部列举
   * ****/
  var TagEnum = {
    include:{ /** oui-include 引入html资源*****/
      tag:constant.includeTagName,
      noResource:true, //没有资源
      controlClass:null,/** 内容include没有控件类，单独处理解析标签函数****/
      /** oui-include单独处理****/
      parseByDom:function(el,callback){
        var Parser = oui.$.Parser;
        Parser.parseInclude(el,callback);
      }
    },
    ouiview:{/** oui-veiw 自定义渲染区域****/
      tag:constant.viewTagName,
      controlClass:'ouiview',
      fileName:'oui-view',
      isCommon:true,//公共组件
      cssType:CssTypeEnum.noCss//没有样式
    },
    tablegrid:{ /** oui-table 表格控件****/
      tag:constant.tableTagName,
      controlClass:'tablegrid',
      fileName:'oui-table',
      isCommon:true,//pc 移动公共
      cssType:CssTypeEnum.common//公共样式
    },
    pager:{/** 分页组件****/
      tag:constant.pagerTagName,
      controlClass:'pager',
      isCommon:true,
      cssType:CssTypeEnum.default//分页样式，pc移动 分别适配
    },
    condition:{ /** 条件组件****/
      tag:constant.conditionTagName,
      controlClass:'condition',
      isCommon:true,//是否是pc、移动公共组件
      cssType:CssTypeEnum.default // pc和移动分别适配样式
    },
    form:{ /** 表单类控件，统一为oui-form标签,不指定特定控件类****/
      tag:constant.controlTagName,
      controlClass:null,//表单类控件 单独实现解析
      childrenEnum:FormControlEnum,
      parseByDom:function(el,callback){
        var Parser = oui.$.Parser;
        Parser.parseByDom(el,$(el).attr('type'),callback);
      }//默认解析
    },
    report:{
      tag:constant.reportTagName,
      controlClass:'report',
      isCommon:true,//公共组件
      cssType:CssTypeEnum.common//公共样式
    }
  };

  var tags = [];
  var tagsWithType = [];
  var tagMap = {};
  !(function(){

    for(var i in TagEnum){
      /** 默认解析接口处理**/
      if(!TagEnum[i].parseByDom){
        TagEnum[i].parseByDom = defaultParseByDom;
      }
      /** 默认解析多个控件的接口处理**/
      if(!TagEnum[i].parse){
        TagEnum[i].parse = defaultParse;
      }
      /** 子枚举处理***/
      if(TagEnum[i].childrenEnum){
        var chEnum = TagEnum[i].childrenEnum;
        for(var j in chEnum ){
          /** 子枚举 单控件解析默认接口实现**/
          if(!chEnum[j].parseByDom){
            chEnum[j].parseByDom = defaultParseByDom;
          }
          /** 子枚举 默认解析多个控件的接口处理**/
          if(!chEnum[j].parse){// 子枚举中的控件的解析模式，按照 控件标签和控件类型组合解析 ,如 oui-form[type='textfield']
            chEnum[j].parse = defaultParse4childrenEnum;
          }
          /** 将子枚举放入枚举map, key 为父枚举[tag名-子枚举类型]**/
          tagMap[TagEnum[i].tag.toLowerCase()+'[type='+chEnum[j].controlClass+']'] = chEnum[j];//便于根据标签和类型找到对应的枚举 findTagEnumByTag
          tagsWithType.push(TagEnum[i].tag.toLowerCase()+'[type='+chEnum[j].controlClass+']');
        }
      }
      tagMap[TagEnum[i].tag.toLowerCase()] = TagEnum[i];
      tags.push(TagEnum[i].tag);//子枚举不用 将标签再追加到 标签列表中
      tagsWithType.push(TagEnum[i].tag);
    }
  })();
  var tagCfg={
    defaultParse:defaultParse,
    defaultParse4childrenEnum:defaultParse4childrenEnum,
    defaultParseByDom:defaultParseByDom,
    CssTypeEnum:CssTypeEnum,
    FormControlEnum:FormControlEnum,
    TagEnum:TagEnum,
    tags:tags,
    tagsWithType:tagsWithType,
    tagMap:tagMap
  };
  oui.$.tagCfg = tagCfg;

})(window,$);




