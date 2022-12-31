!(function(win, $) {
  var ControlTypeEnum = {
    //-------- 内部控件-----------------------
    button: {
      name: "button",
    },
    container: {
      name: "container",
    },
    table: {
      name: "tableLine",
    },
    customTable: {
      name: "customTable",
    },
    detail: {
      name: "detail",
    },
    selectArea: {
      name: "selectArea",
    }, //选择区域
    //插入图片
    image: {
      name: "image",
    },
    qrcode: {
      name: "qrcode",
    },
    barcode: {
      name: "barcode",
    },
    label: {
      name: "label",
    }, //文本输入
    //------- 外部接口传入控件类型 ---------------------
    textInput: {
      name: "textInput",
    },
    selectInput: {
      name: "selectInput",
    },
    repeatSelect: {
      name: "repeatSelect",
    },
    read: {
      name: "read",
    },
    other: {
      name: "other",
    },
  };
  /***     <option value="printForm" {{if AbsoluteDesign.data.pageDesignType=='print'}}selected="selected"{{/if}}>表单打印设计器</option>
     <option value="normalForm" {{if AbsoluteDesign.data.pageDesignType=='form'}}selected="selected"{{/if}}>瀑布流表单设计器</option>
     <option value="tableForm" {{if AbsoluteDesign.data.pageDesignType=='tableForm'}}selected="selected"{{/if}}>表格式表单设计器</option>
     <option value="absoluteForm" {{if AbsoluteDesign.data.pageDesignType=='absoluteForm'}}selected="selected"{{/if}}>绝对布局表单设计器</option>
     ***/
  var PageDesignTypeEnum = {
    printForm: { name: "printForm" },
    normalForm: { name: "normalForm" },
    tableForm: { name: "normalForm" },
    absoluteForm: { name: "absoluteForm" },
  };
  PageDesignTypeEnum.findEnum = function(name) {
    for (var i in PageDesignTypeEnum) {
      if (PageDesignTypeEnum[i] && PageDesignTypeEnum[i].name == name) {
        return PageDesignTypeEnum[i];
      }
    }
    return null;
  };
  // 此处配置 页面全局样式和页面内控件全局样式
  var PageGlobalStyles = {
    /** 页面默认样式**/
    style: {
      backgroundImageName: "", //默认图片
      backgroundImage: "", //'url(' + oui.getContextPath() + 'res_engine/page_design/pc/images/timg.jpg' + ')'
      backgroundImageFillType: "center",
      backgroundColor: "",
//      width: 100,
//      height: 100,
      paperType: "A4",
      theme: "",
      cellType: "%",
      currControlZIndex: 0,
    },
    innerStyle: {
      //页面内控件样式
      style: {
        //控件外框样式
        width: 230,
        height: 42,
        backgroundColor: "",
        borderRadius: 0,
        opacity: 1,
        zIndex: 0,
        layoutType: "oneLine", //默认并列显示
        /** 边框 粗细 ***/
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,

        /** 边框颜色***/
        borderLeftColor: "#e6e6e6",
        borderTopColor: "#e6e6e6",
        borderBottomColor: "#e6e6e6",
        borderRightColor: "#e6e6e6",

        /** 边框样式***/
        borderLeftStyle: "solid",
        borderTopStyle: "solid",
        borderBottomStyle: "solid",
        borderRightStyle: "solid",
      },
      styleTitle: {
        //控件标题样式
        color: "#333333",
        lineHeight: 1.6,
        backgroundColor: "",
        fontSize: 14,
        fontWeight: "normal",
        textAlign: "left",
        verticalAlign: "middle",
        whiteSpace: "normal",
      },
      styleFieldOuter: {
        //控件值外框
      },
      styleInnerOuter: {
        //控件值和控件标题共同外框
        verticalAlign: "middle",
      },
      styleField: {
        //控件值样式
        color: "#333333",
        backgroundColor: "",
        lineHeight: 1.6,
        fontSize: 14,
        fontWeight: "normal",
        textAlign: "left",

        /** 边框 粗细 ***/
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,

        /** 边框颜色***/
        borderLeftColor: "#e6e6e6",
        borderTopColor: "#e6e6e6",
        borderBottomColor: "#e6e6e6",
        borderRightColor: "#e6e6e6",

        /** 边框样式***/
        borderLeftStyle: "solid",
        borderTopStyle: "solid",
        borderBottomStyle: "solid",
        borderRightStyle: "solid",
        whiteSpace: "normal",
      },
    },
  };
  /*** 打印页面类型的 全局样式******/
  PageDesignTypeEnum.printForm.PageGlobalStyles = {
    style: {},
    innerStyle: {
      //页面内控件样式
      style: {
        //控件外框样式
      },
      styleTitle: {
        //控件标题样式
        textAlign: "right",
      },
      styleFieldOuter: {
        //控件值外框
      },
      styleInnerOuter: {
        //控件值和控件标题共同外框
        verticalAlign: "middle",
      },
      styleField: {
        //控件值样式
        /** 边框 粗细 ***/
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
      },
    },
  };
  /** 瀑布流类型默认全局样式 ***/
  //PageDesignTypeEnum.normalForm.PageGlobalStyles = {
  //    "style": {
  //    },
  //    "innerStyle": { //页面内控件样式
  //        "style": {//控件外框样式
  //        },
  //        "styleTitle": { //控件标题样式
  //        },
  //        "styleFieldOuter": {//控件值外框
  //        },
  //        "styleInnerOuter":{ //控件值和控件标题共同外框
  //        },
  //        "styleField": {//控件值样式
  //            /** 边框 粗细 ***/
  //            borderLeftWidth: 0,
  //            borderTopWidth: 0,
  //            borderBottomWidth: 0,
  //            borderRightWidth: 0
  //        }
  //    }
  //};
  /** dom style 二级属性名对应的css命名*****/
  /***
     *
     *
     * width 宽度
     height 高度
     position 定位元素
     left 距左
     top 距上

     *****默认属性*****

     *****用户设置属性*****

     background-color 背景色
     border-radius 圆角幅度
     border-style 边框样式
     border-width 边框宽度
     border-color 边框颜色
     font-size 字体大小
     color 字体颜色
     font-weight 字体粗细
     padding 内间距
     text-align 字体位置
     display 块状元素
     float 漂浮属性

     *****用户设置属性*****

     其它

     box-shadow 阴影

     *
     *
     * **/
  var CssAttrs = (
    "" +
    /** 基本属性****/
    "width,height,position,left,top,display,float," +
    /** 背景属性****/
    "background-color,background-image," +
    /** 圆角***/
    "border-radius," +
    /** 边框***/
    "border-left-style,border-top-style,border-right-style,border-bottom-style," +
    "border-left-color,border-top-color,border-right-color,border-bottom-color," +
    "border-left-width,border-top-width,border-right-width,border-bottom-width," +
    /** 内间距***/
    "padding-left,padding-top,padding-right,padding-bottom," +
    /** 字体样式***/
    "text-align,vertical-align,color,font-size,font-weight,font-family,font-style," +
    /** 阴影***/
    "box-shadow"
  ).split(",");

  var AbsoluteUtil = {
    /** 横杠属性命名规则 转 驼峰命名****/
    lineAttrToHump: function(para) {
      var result = [];
      var a = para.split("-");
      for (var i = 0, len = a.length; i < len; i++) {
        if (i == 0) {
          result.push(a[i].toLowerCase());
        } else {
          result.push(a[i].substring(0, 1).toUpperCase());
          result.push(a[i].substring(1).toLowerCase());
        }
      }
      return result.join("");
    },
    humpTolineAttr: function(para) {
      var result = [];
      var temp = 0; //定位
      for (var i = 0, len = para.length; i < len; i++) {
        var currChar = para.charAt(i);
        /** 大写字母***/
        if (currChar >= "A" && currChar <= "Z") {
          result.push("-" + currChar.toLowerCase());
        } else {
          result.push(currChar);
        }
      }
      return result.join("");
    },
    transHumpKeyObject2LineKeyObject: function(obj) {
      var temp = {};
      for (var key in obj) {
        var attr = AbsoluteUtil.humpTolineAttr(key);
        temp[attr] = obj[key];
      }
      return temp;
    },
    transLineKeyObject2HumpKeyObject: function(obj) {
      var temp = {};
      for (var key in obj) {
        var attr = AbsoluteUtil.lineAttrToHump(key);
        temp[attr] = obj[key];
      }
      return temp;
    },
  };
  var AbsoluteDesign = {
    package: "com.oui.absolute",
    class: "AbsoluteDesign", //com.oui.absolute.AbsoluteDesign
    pageCls: "page-abs",
    pageDomAttrPrefix: "page-abs-",
    controlDomAttrPrefix: "control-abs-",
    controlIdPrefix: "ctrl_",
    runTemplateType: "js", //支持java模板 和 js artTemplate模板
    startTemplateTag: "{{",
    endTemplateTag: "}}",
    data: {},
    activeTab: 0,
    currAccordingActiveId: "",
    tableLinesMap: null,
    tableLineMaxRect: null,
    operationAreaOffset: 2,
    /** 数据事件状态列表*****/
    states: "init,down2selectPage,down2selectField,drag2newField,draggingField,dragEndField,cloneField".split(
      ","
    ),
    styleStringKeys: (
      "" +
      "backgroundImage,backgroundColor," +
      "verticalAlign," +
      "borderLeftColor,borderTopColor,borderBottomColor,borderRightColor," +
      "borderLeftStyle,borderTopStyle,borderBottomStyle,borderRightStyle," +
      "color,fontFamily,fontWeight,textAlign,whiteSpace"
    ).split(","),
    defaultColumnSize: 3, //默认表格列数
    defaultRowSize: 3, //默认表格行数
    hasChange: false,
    getUtils: function() {
      return AbsoluteUtil;
    },

    findControlUrl: function(control) {
      //设计态和运行态 此处不同
      if (control && control.otherAttrs.useRelation) {
        //存在关联关系
        //TODO 后续考虑 多端 的关联控件适配
        return "res_common/oui/ui/ui_pc/components/association.vue.html";
      } else if (control) {
        //TODO 此处后续扩展多端
        return (
          "res_common/oui/ui/ui_pc/components/" +
          control.controlType +
          ".vue.html"
        );
      }
    },
    trimTplMap: {},
    /**
     * 根据模板id和数据渲染 模板并且trim返回
     * @param tplId
     * @param data
     */
    trimTpl: function(tplId, data) {
      if (!this.trimTplMap[tplId]) {
        this.trimTplMap[tplId] = template.compile(
          $.trim(document.getElementById(tplId).innerHTML)
        );
      }
      var html = this.trimTplMap[tplId](data);
      var content = $.trim(html);
      return content;
    },
    /**
         * 初始化参数入口
        var params = {
            //必须参数
            bizJs:cfg.bizJs||[],//注入脚本插件,自定义脚本扩展；如,保存事件的执行、打印事件的执行、等等扩展脚本的路径
            mainTemplate:cfg.mainTemplate,//页面设计中，页面的业务属性面板模板
            controls:cfg.controls||[],//已有的控件列表
            page:cfg.page,//页面设计对象，如果是打印则是打印模板设计对象
            saveCallBack:'',//保存回调

            //不必须参数
            bizCss:cfg.bizCss||[],注入设计器，自定义样式扩展,如，左侧控件的渲染图标等
            scriptPkg:cfg.scriptPkg||"com.oui.DesignBiz", //指定扩展脚本包,为了避免命名空间与页面设计的命名冲突，指定命名空间，实现业务与设计的代码命名隔离，api调用不冲突
            buttons:cfg.buttons||"", //按钮参数,如save,print 等按钮事件名
            useControls:cfg.useControls || false,//使用传入控件列表作为 待设计控件区域,否则待选区域的控件未全控件列表
            //其它业务参数调用传递,重要提示：cfg.params的参数最好使用简单map对象，不能包含任何dom对象或window对象等
            params:cfg.params||{}
        };
        ***/
    init: function() {
 
      var me = this;
      template.helper("AbsoluteDesign", this);
      template.helper("oui", oui);
      var getBoundingClientRect = Element.prototype.getBoundingClientRect;
      Element.prototype._getBoundingClientRect = getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function() {
        var rect = {};
        try {
          rect = this._getBoundingClientRect();
        } catch (err) {
          rect = {};
        }
        return rect;
      };
      me.clientType4Design = oui.getParam("clientType") || "pc";
      $(".design-container").addClass(
        "ab-design-clientType-" + me.clientType4Design
      );

      me.PageDesignTypeEnum = PageDesignTypeEnum;
      me.ControlTypeEnum = ControlTypeEnum;
     
      oui.loadApiConfig(
        oui.getContextPath() + "res_engine/page_design/pc/js/api-config.json",
        "oui.biz",
        function() {
          //根据url参数初始化 输入参数
          me.initByUrlParams(function() {
            var param = oui.getParam();
 
            if (param.projectId && param.portalId) {
              //加载表单定义
              

              // oui.biz.api(
              //   "loadPageDesign",
              //   {
              //     id: param.id,
              //   },
              //   function(res) {
              //     me.data = res.data;
              //     me.init4parse();
              //   },
              //   function(res) {
              //     console.log("加载表单失败");
              //     console.log(res);
              //   }
              // ); 
              //oui.getData,oui.postData
              //TODO AJAX 
              //处理数据
              me.init4parse();
              return;
            }
            
          });
        }
      );
    },
    getActiveCls: function(v) {
      var me = this;
      return me.clientType4Design == v ? "active" : "";
    },
    init4parse: function() {
      var me = this;
      me.initBefore();
      oui.parse({
        callback: function(result) {
          if (oui.browser.ie || oui.browser.isEdge) {
            oui.getById("absoluteProps").attr("useVDom", false);
          }
          me.bindEvents();
          me.initEnd();
        },
      });
    },
    getContextPath: function() {
      return oui.getContextPath();
    },
    /***
     *
     * @param control
     */
    findControlLayoutType: function(control) {
      var layoutType = control.style.layoutType;
      if (control.detailId) {
        //在明细表中
        //todo 暂时不考虑 设计区 明细表 所见即所得的问题
        ////最后一行隐藏标题，其他的只显示标题
        if (this.inDetailEndRow(control)) {
          layoutType = "hideTitle";
        } else {
          layoutType = "onlyTitle";
        }
        //layoutType ='onlyTitle';
      }
      return layoutType;
    },
    /*** 获取控件值dom上的样式*****/
    findFieldStyle4Dom: function(item, controlInTd) {
      var me = this;
      var str = me.findStyleString(
        item.innerStyle && item.innerStyle.styleField,
        "control-style-tpl",
        controlInTd
      );
      if (item.innerStyle && item.innerStyle.styleField) {
        item.innerStyle.styleFieldString = str;
      }
      return str;
    },
    /**获取字段外框样式 **/
    findStyleFieldOuter4Dom: function(item, controlInTd) {
      var me = this;
      var str = "";
      if (item.innerStyle && item.innerStyle.styleFieldOuter) {
        str = me.findStyleString(
          item.innerStyle && item.innerStyle.styleFieldOuter,
          "control-style-tpl",
          controlInTd
        );

        if (
          item.innerStyle &&
          item.innerStyle.styleInnerOuter &&
          item.innerStyle.styleInnerOuter.verticalAlign
        ) {
          str +
            ";vertical-align:" +
            item.innerStyle.styleInnerOuter.verticalAlign +
            ";";
        }
        if (
          item.innerStyle &&
          item.innerStyle.styleFieldOuter &&
          item.innerStyle.styleFieldOuter.textAlign
        ) {
          str +
            ";text-align:" +
            item.innerStyle.styleFieldOuter.textAlign +
            ";";
        }
        item.innerStyle.styleFieldOuterString = str;
      }
      return str;
    },

    //获取和设置输入框样式  L.T添加
    findStyleTextfield: function(item, controlInTd) {
      var me = this;
      var str = "";
      if (item.controlType == "textarea") {
        str = "#" + item.id + "  textarea{";
      } else {
        str = "#" + item.id + " input{";
      }

      if (
        item.innerStyle &&
        item.innerStyle.styleInput &&
        item.innerStyle.styleInput.fontColor
      ) {
        str += "color:" + item.innerStyle.styleInput.fontColor + ";";
      }
      if (
        item.innerStyle &&
        item.innerStyle.styleInput &&
        item.innerStyle.styleInput.borderColor
      ) {
        str += "border-color:" + item.innerStyle.styleInput.borderColor + ";";
      }

      if (
        item.innerStyle &&
        item.innerStyle.styleInput &&
        item.innerStyle.styleInput.bgColor
      ) {
        str += "background-color:" + item.innerStyle.styleInput.bgColor + ";";
      }

      str += "}";

      return str;
    },

    /** 获取控件外框样式***/
    findControlStyle4Dom: function(control, controlInTd) {
      var me = this;
      var str = "";
      if (control.style) {
        str = me.findStyleString(
          control.style,
          "control-style-tpl",
          controlInTd
        );
        control.styleString = str;
      }
      return str;
    },
    findControlStyle4DomDesign: function(control, controlInTd) {
      var me = this;
      var str = "";
      if (control.style) {
        str = me.findStyleString(
          control.style,
          "control-style-tpl",
          controlInTd
        );
        control.styleString = str;
        str = me.findStyleString(
          control.style,
          "control-style-tpl",
          controlInTd,
          true
        );
      }
      return str;
    },
    /****
     * 获取控件边框样式
     * @param control
     */
    findControlStyleBorder4Dom: function(control, controlInTd) {
      var me = this;
      var str = "";
      if (control.style) {
        str = me.findStyleString(
          control.style,
          "border-style-tpl",
          controlInTd
        );
        control.styleBorderString = str;
      }
      return str;
    },
    /**获取控件 外框里面的第一层样式 **/
    findControlStyleInnerOuter4Dom: function(control, controlInTd) {
      var str = "";
      if (control.innerStyle && control.innerStyle.styleInnerOuter) {
        str = this.findStyleString(
          control.innerStyle.styleInnerOuter,
          "control-style-tpl",
          controlInTd
        );
        control.innerStyle.styleInnerOuterString = str;
      }
      return str;
    },
    /**获取控件里面标题样式 ***/
    findControlInnerStyleTitle4Dom: function(control, controlInTd) {
      var str = "";
      if (control.innerStyle && control.innerStyle.styleTitle) {
        str = this.findStyleString(
          control.innerStyle && control.innerStyle.styleTitle,
          "control-style-tpl",
          controlInTd
        );
        control.innerStyle.styleTitleString = str;
      } 
      return str;
    },
    /** 更新页面调用处的原始参数*****/
    updateParamCfgSource: function(paramCfg) {
      var param = oui.getParam();
      if (param.ouiInWindowDialog && param.ouiInWindowDialog + "" == "true") {
        //openWindow
        var windowId = param.windowId;
        if (
          !window.opener ||
          !window.opener._openMap ||
          !window.opener._openMap[windowId]
        ) {
          //父窗体不存在，则关闭当前窗体
          oui
            .getTop()
            .oui.alert(
              "调用页面设计器入口页面已经刷新或者关闭，请尝试关闭当前页面后，重新打开"
            );
          //window.close();
          return;
        }
        paramCfg.viewType = "openWindow";
        window.opener._openMap[windowId].params = oui.parseString(paramCfg);
      } else if (param.ouiInDialog && param.ouiInDialog + "" == "true") {
        //urlDialog
        paramCfg.viewType = "urlDialog";
        var dialog = oui.getCurrUrlDialog();
        dialog.attr("params", oui.parseString(paramCfg));
      } else {
        //普通url打开
        var varParam = oui.getParam("param");
        if (varParam && window.parent[varParam]) {
          window.parent[varParam] = oui.parseString(paramCfg);
        }
      }
    },
    /** 设计器关闭方法****/
    close: function() {
      var param = oui.getParam();
      if (param.ouiInWindowDialog && param.ouiInWindowDialog + "" == "true") {
        //openWindow
        var windowId = param.windowId;
        if (
          !window.opener ||
          !window.opener._openMap ||
          !window.opener._openMap[windowId]
        ) {
          window.close();
          return;
        }
        try {
          if (window.opener._openMap[windowId].params) {
            window.opener._openMap[windowId].params = null;
            delete window.opener._openMap[windowId].params;
          }
          window.close();
        } catch (err) {}
      } else if (param.ouiInDialog && param.ouiInDialog + "" == "true") {
        //urlDialog
        var dialog = oui.getCurrUrlDialog();
        dialog && dialog.hide();
      } else {
        //普通url打开
        try {
          window.close();
        } catch (err) {}
      }
    },
    /** 根据url参数 处理 openWindow 新窗口打开设计器，urlDialog ifame窗口打开设计器***/
    initByUrlParams: function(callback) {
      var me = this;
      var param = oui.getParam();

      var paramCfg = {};

      if (param.ouiInWindowDialog && param.ouiInWindowDialog + "" == "true") {
        //openWindow
        var windowId = param.windowId;
        if (
          !window.opener ||
          !window.opener._openMap ||
          !window.opener._openMap[windowId]
        ) {
          //父窗体不存在，则关闭当前窗体
          oui
            .getTop()
            .oui.alert(
              "调用页面设计器入口页面已经刷新或者关闭，请尝试关闭当前页面后，重新打开"
            );
          //window.close();
          return;
        }
        if (window.opener._openMap[windowId].params) {
          paramCfg = oui.parseJson(window.opener._openMap[windowId].params);
        } 

        paramCfg.viewType = "openWindow";
      } else if (param.ouiInDialog && param.ouiInDialog + "" == "true") {
        //urlDialog
        var dialog = oui.getCurrUrlDialog();
        paramCfg = oui.parseJson(dialog.attr("params"));
        paramCfg.viewType = "urlDialog";
      } else {
        //普通url打开

        var varParam = oui.getParam("param");

        if (varParam && window.parent[varParam]) {
          paramCfg = oui.parseJson(window.parent[varParam]);
        } else {
          //普通demo
          paramCfg.isDefault =
            param.isDefault && param.isDefault == "false" ? false : true;
          /*
                     * <button class="design-top-btn top-btn-transparent" oui-e-click="event2preview">预览</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2save" >保存</button>
                     <button class="design-top-btn top-btn-transparent" id="btn-select-box" oui-e-click="event2selectBoxArea">截取区域</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2merge">合并</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2split">拆分</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2insertColumn4prev">添加列到前面</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2insertRow4prev">添加行到前面</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2removeColumn">删除列</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2removeRow">删除行</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2new">新建</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2import">导入</button>
                     <button class="design-top-btn top-btn-transparent" oui-e-click="event2export">导出</button>
                     <button class="design-top-btn top-btn-solid" oui-e-click="event2print">打印</button>
                     */
          paramCfg.buttons =
            param.buttons ||
            "preview,save,selectBoxArea,merge,split,insertColumn4prev,insertRow4prev,removeColumn,removeRow";
          paramCfg.pageBizPropsUrl = param.pageBizPropsUrl || "";
          paramCfg.controlBizPropsUrl = param.controlBizPropsUrl || "";
          paramCfg.saveCallBack = param.saveCallBack || "";
          paramCfg.page = {
            pageDesignType: "normalForm",
          };
          paramCfg.bizJs = param.bizJs || "";
        }
        paramCfg.viewType = "normal";
      }

      if (!paramCfg.callbackMethods) {
        paramCfg.callbackMethods = {};
      }
      console.info(paramCfg, "paramCfg");
      if (paramCfg.saveCallBack) {
        paramCfg.callbackMethods["saveCallbackMethod"] = paramCfg.saveCallBack;
      }

      me.paramCfg = paramCfg;
      //准备好输入参数后， 根据参数 ，加载插件资源
      paramCfg.scriptPkg = paramCfg.scriptPkg || "com.oui.DesignBiz";
      //默认的设计态模板
      var page = paramCfg.page || {};
      var pageDesignType =
        page.pageDesignType || paramCfg.pageDesignType || "printForm";

      var designTplUrl =
        oui.getContextPath() +
        "res_engine/page_design/common/portal-design-tpl.html";
      if (pageDesignType == "printForm") {
        //纯div占位 模板
        designTplUrl =
          oui.getContextPath() +
          "res_engine/page_design/common/page-design-tpl-space.html";
      }
      designTplUrl = page.designTplUrl || paramCfg.designTplUrl || designTplUrl;
      if (paramCfg.scriptPkg) {
        //设置自定义命名空间
        var plugin = {
          designTplUrl: designTplUrl,
          pkg: paramCfg.scriptPkg,
          getDesigner: function() {
            return me;
          },
        };
        oui.JsonPathUtil.setObjByPath(paramCfg.scriptPkg, window, plugin, true);
        me.plugin = plugin;
      }
      if (!paramCfg.bizJs) {
        paramCfg.bizJs = [];
      }

      var bizJsArr = [
        oui.getContextPath() +
          "res_engine/page_design/common/js/page-design.js",
      ]; //默认公共
      if (typeof paramCfg.bizJs == "string" && paramCfg.bizJs) {
        paramCfg.bizJs = paramCfg.bizJs.split(",");
        oui.eachArray(paramCfg.bizJs, function(item, index) {
          var contextPath = oui.getContextPath();
          if (item.indexOf(contextPath) != 0) {
            paramCfg.bizJs[index] = contextPath + item;
          }
        });
      }
      bizJsArr = bizJsArr.concat(paramCfg.bizJs);
      oui.require(
        bizJsArr,
        function() {
          callback && callback();
        },
        function() {
          oui
            .getTop()
            .oui.alert("加载插件资源 bizJs 中的资源失败,请联系管理员检查");
        },
        false
      );
    },
    isIconUrl: function(control) {
      var result = false;
      if (control.icon) {
        if (control.icon.indexOf(".") > 0) {
          result = true;
        }
      }
      return result;
    },
    isIconCss: function(control) {
      var result = false;
      if (control.icon) {
        if (control.icon.indexOf(".") < 0 && control.icon.indexOf("?") < 0) {
          result = true;
        }
      }
      return result;
    },

    /** 静态变量初始化***/
    init4static: function() {
      var me = this;
      /** 页面属性配置   ****/
      me.pageKeys = "id,name,bizId,projectId,enName,modelType,version,canCloneControl,backgroundImageId,backgroundImageName,backgroundImage,description,pageDesignType,listContent,content,selectContent,style,innerStyle,controls,otherAttrs,events".split(
        ","
      );
      /** 主题模板配置 与扩张 **/
      me.themeTypes = [
        {
          value: "1",
          display: "主题一",
        },
        {
          value: "2",
          display: "主题二",
        },
        {
          value: "3",
          display: "主题三",
        },
      ];

      /** 页面类型枚举*****/
      me.paperRuleTypes = [
        {
          width: 420,
          height: 594,
          value: "A2",
          cellType: "mm", //尺寸单位
        },
        {
          width: 297,
          height: 420,
          value: "A3",
          cellType: "mm",
        },
        {
          width: 210,
          height: 297,
          value: "A4",
          cellType: "mm",
        },
        {
          width: 148,
          height: 210,
          value: "A5",
          cellType: "mm",
        },
        {
          width: 105,
          height: 148,
          value: "A6",
          cellType: "mm",
        },
        {
          width: 500,
          height: 707,
          value: "B2",
          cellType: "mm",
        },
        {
          width: 353,
          height: 500,
          value: "B3",
          cellType: "mm",
        },
        {
          width: 250,
          height: 353,
          value: "B4",
          cellType: "mm",
        },
        {
          width: 176,
          height: 250,
          value: "B5",
          cellType: "mm",
        },
        {
          width: 125,
          height: 176,
          value: "B6",
          cellType: "mm",
        },
        {
          width: 210,
          height: 297,
          value: "self_edit",
          cellType: "mm",
        },
      ];
      /**
       *
       * 控件的属性列表 id,name,title,description,htmlType,controlType,showType,fieldType,formField,style,innerStyle,otherAttrs,events
       * ****/
      var strKeys =
        "id,parentId,bizId,detailId,name,description,configTemplate,htmlType,controlType,icon,fieldType";
      var keys = strKeys.split(",");
      me.controlProps = [];
      for (var i = 0, len = keys.length; i < len; i++) {
        me.controlProps.push({
          prop: keys[i],
        });
      }
      me.controlProps.push({
        prop: "canCloneControl",
        type: "boolean",
      });
      me.controlProps.push({
        prop: "showType",
        type: "int",
      });
      me.controlProps.push({
        prop: "formField",
        type: "boolean",
      });

      me.controlProps.push({
        prop: "style",
        type: "object",
      });

      me.controlProps.push({
        prop: "innerStyle",
        type: "object",
      });
      me.controlProps.push({
        prop: "otherAttrs",
        type: "object",
      });
      me.controlProps.push({
        prop: "events",
        type: "object",
      });

      /** 页面按钮 列表******/
      me.toolbars = [];
      /*
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2preview">预览</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2save" >保存</button>
             <button class="design-top-btn top-btn-transparent" id="btn-select-box" oui-e-click="event2selectBoxArea">截取区域</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2merge">合并</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2split">拆分</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2insertColumn4prev">添加列到前面</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2insertRow4prev">添加行到前面</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2removeColumn">删除列</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2removeRow">删除行</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2new">新建</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2import">导入</button>
             <button class="design-top-btn top-btn-transparent" oui-e-click="event2export">导出</button>
             <button class="design-top-btn top-btn-solid" oui-e-click="event2print">打印</button>
             */
      me.toolbars.push({
        name: "preview",
        display: "预览",
      });
      me.toolbars.push({
        name: "save",
        cls: "top-btn-solid",
        display: "保存",
      });
      me.toolbars.push({
        name: "selectBoxArea",
        display: "截取页面",
      });
      me.toolbars.push({
        name: "merge",
        display: "合并",
      });
      me.toolbars.push({
        name: "split",
        display: "拆分",
      });
      me.toolbars.push({
        name: "insertColumn4prev",
        display: "插入列到前面",
      });
      me.toolbars.push({
        name: "insertRow4prev",
        display: "插入行到前面",
      });
      me.toolbars.push({
        name: "removeColumn",
        display: "删除列",
      });
      me.toolbars.push({
        name: "removeRow",
        display: "删除行",
      });
      me.toolbars.push({
        name: "new",
        display: "新建",
      });
      me.toolbars.push({
        name: "import",
        display: "导入",
      });
      me.toolbars.push({
        name: "export",
        display: "导出",
      });
      me.toolbars.push({
        name: "print",
        display: "打印",
        cls: "top-btn-solid",
      });
    },
    findButtonsByNames: function(buttonNames) {
      var arr = [];
      var me = this;
      if (buttonNames) {
        if (typeof buttonNames == "string") {
          buttonNames = buttonNames.split(",");
        }
        arr = oui.findManyFromArrayBy(me.toolbars || [], function(item) {
          if (buttonNames.indexOf(item.name) > -1) {
            return true;
          } else {
            return false;
          }
        });
      }
      return arr;
    },
    /** 校验 页面属性****/
    checkData: function(notTips) {
      var me = this;
      /** 校验当前控件****/
      var messages = [];
      if (
        me.data.currentControl &&
        me.data.controls.indexOf(me.data.currentControl) > -1
      ) {
        //遇到第一个错误则退出
        return me.checkControl(me.data.currentControl, true, notTips);
      } else {
        messages = me.Validator.check(me.data, true);
        if (messages && messages.length) {
          me.setCurrPropsData4page();
        }
      }
      if (messages && messages.length) {
        if (!notTips) {
          oui.getTop().oui.showAutoTips({
            content: messages[0].msg,
            boxStyle: "background-color:#e07365",
          });
        }
        return false;
      }
      me.data.tempControl = {};
      return true;
    },

    /*** 校验控件属性***/
    checkControl: function(control, oneErrorBreak, noTips) {
      var me = this;
      /** 校验控件临时数据****/
      var messages = me.Validator.check(
        me.data.tempControl,
        oneErrorBreak,
        "tempControl"
      );
      if (messages && messages.length) {
        me.setCurrPropsData(control, "center", "down2selectField");
        if (!noTips) {
          oui.getTop().oui.showAutoTips({
            content: messages[0].msg,
            boxStyle: "background-color:#e07365",
          });
        }
        return false;
      }
      /** 校验控件实际数据****/
      messages = me.Validator.checkControl(control, oneErrorBreak);
      if (messages && messages.length) {
        me.setCurrPropsData(control, "center", "down2selectField");
        if (!noTips) {
          oui.getTop().oui.showAutoTips({
            content: messages[0].msg,
            boxStyle: "background-color:#e07365",
          });
        }
        return false;
      }
      me.data.tempControl = {};
      return true;
    },
    /** 获取属性校验信息****/
    findCheckMessage: function(key) {
      var me = this;
      return me.Validator.findCheckMessage(key, me.data);
    },

    /** 新建控件id****/
    newId: function() {
      var me = this;
      var temp = true;
      var id;
      do {
        id = me.controlIdPrefix + oui.getUUIDLong();

        temp = oui.findOneFromArrayBy(me.data.controls, function(item) {
          if (item.id == id) {
            return true;
          }
        });
        if (temp) {
          temp = true;
        } else {
          temp = false;
        }
      } while (temp);
      return id;
    },
    formField: function(control) {
      //判断控件是否是页面字段
      var flag = true;
      if (control.htmlType == "selectArea" || control.htmlType == "label") {
        flag = false;
      }
      return flag;
    },
    isShowPageProps: function() {
      var me = this;
      var state = me.state;
      var flag = false;
      if ("init,down2selectPage".split(",").indexOf(state) > -1) {
        flag = true;
      }
      return flag;
    },
    isShowControlProps: function() {
      var me = this;
      return !me.isShowPageProps();
    },
    findStateTypeName: function() {
      var me = this;
      var state = me.state;
      var titleName = "页面属性";
      if ("init,down2selectPage".split(",").indexOf(state) > -1) {
        titleName = "页面属性";
      } else {
        if (
          me.data.currentControl &&
          me.data.currentControl.htmlType == ControlTypeEnum.selectArea.name
        ) {
          titleName = "选择区域属性";
        } else {
          titleName = "控件属性";
        }
      }
      return titleName;
    },
    /** 获取页面设计在dom中的平铺属性 *****/
    findPageAttrsRepeat4Dom: function() {
      var me = this;
      var arr = [];
      arr.push({
        prop: "id",
      });
      arr.push({
        prop: "name",
      });
      arr.push({
        prop: "description",
      });
      arr.push({
        prop: "style",
        type: "object",
      });
      arr.push({
        prop: "innerStyle",
        type: "object",
      });
      arr.push({
        prop: "otherAttrs",
        type: "object",
      });
      return this.findObjectAttrsRepeat4Dom(arr, me.data, me.pageDomAttrPrefix);
    },
    /**
     * 根据控件对象 获取 在dom上的属性排列
     * ***/
    findControlAttrsRepeat4Dom: function(control) {
      var me = this;
      return me.findObjectAttrsRepeat4Dom(
        me.controlProps,
        control,
        me.controlDomAttrPrefix
      );
    },

    /** 结构化的样式对象 转 字符串 ****/
    findStyleString: function(style, tplId, controlInTd, rect4px) {
      tplId = tplId || "control-style-tpl";
      style = style || {};
      var me = this;
      if (!me.tpls) {
        me.tpls = {};
      }
      if (!me.tpls[tplId]) {
        me.tpls[tplId] = template.compile(
          document.getElementById(tplId).innerHTML
        );
      }
      var bgImg = style.backgroundImage;
      if (style.backgroundImage) {
        style.backgroundImage = "";
      }
      var html = me.tpls[tplId]({
        data: me.data,
        style: style,
        controlInTd: controlInTd,
        rect4px: rect4px,
      });
      html = html.substring(html.indexOf("{") + 1, html.lastIndexOf("}"));
      html = html.replace(/data\:image\/jpeg\;/gi, "_imagedata_");
      var arr = html.split(";");

      var strArr = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        var currItems = arr[i].split(":");
        var key = $.trim(currItems[0]);
        var value = $.trim(currItems[1]);
        if (key) {
          //data:image/jpeg;base64,
          strArr.push(key + ":" + value);
        }
      }
      if (bgImg) {
        style.backgroundImage = bgImg;
        strArr.push("background-image:" + bgImg);
      }
      html = strArr.join(";");
      html = html.replace(/_imagedata_/gi, "data:image/jpeg;");
      return html;
    },

    /** 根据样式对象 获取 配置值为字符串的所有配置项值存在的key列表****/
    findStyleStringKeys: function(styleObj) {
      var me = this;
      var keys = me.styleStringKeys;
      var arr = [];
      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        if (styleObj[key]) {
          arr.push(key);
        }
      }
      return arr;
    },

    /*****
     * 根据业务类型 返回 默认控件对象
     * @param controlType
     */
    findDefaultControlByBizControlType: function(controlType, htmlType, obj) {
      var me = this;
      var controls = me.defaultControls || [];
      var curr;
      if (controlType) {
        /** 根据业务控件类型 返回默认控件 ，无分类中查找配置,在到 默认控件列表中 查找配置***/
        curr = oui.findOneFromArrayBy(me.defaultControls4Normal, function(
          item
        ) {
          if (item.controlType == controlType) {
            return true;
          }
        });
        if (curr) {
          return curr;
        }
        /** 根据业务控件类型 返回默认控件***/
        curr = oui.findOneFromArrayBy(controls, function(item) {
          if (item.controlType == controlType) {
            return true;
          }
        });
        if (!curr) {
          curr = oui.findOneFromArrayBy(me.defaultControls4Normal, function(
            item
          ) {
            if (item.htmlType == htmlType) {
              return true;
            }
          });
        }
      } else {
        //根据htmlType进行查找
        curr = oui.findOneFromArrayBy(me.defaultControls4Normal, function(
          item
        ) {
          if (item.htmlType == htmlType) {
            return true;
          }
        });
      }
      /** 如果没有对应业务控件类型，则返回 默认其它类型的默认控件对象 **/
      if (!curr) {
        curr = oui.findOneFromArrayBy(controls, function(item) {
          if (item.htmlType == ControlTypeEnum.other.name) {
            return true;
          }
        });
      }
      return curr;
    },
    /** 获取对象平铺dom的 属性数组，[{key,value}]*****/
    findObjectAttrsRepeat4Dom: function(attrs, data, prefix) {
      var me = this;
      var currPrefix = prefix || me.pageDomAttrPrefix;
      var arr = [];
      if (!attrs || !attrs.length || !data) {
        return arr;
      }
      var props = attrs || [];
      for (var i = 0, len = props.length; i < len; i++) {
        var key = props[i].prop;
        var value = data[key];
        if (props[i].type) {
          if (props[i].type == "object") {
            value = oui.parseString(value || {});
            //解决对象含有 {{,或 }} 模板语法字符问题修复
            if (value.indexOf("}}") > -1) {
              value = value.replace(/\}\}/gi, "} }");
            }
            if (value.indexOf("{{") > -1) {
              value = value.replace(/{{/gi, "{ {");
            }
          } else if (props[i].type != "string") {
            if (typeof value != "undefined") {
              value = value + "";
            } else {
              value = "";
            }
          }
        }
        arr.push({
          key: currPrefix + key,
          value: value,
        });
      }
      return arr;
    },
    /******
     *
     * @param el 元素
     * @param keys 属性配置列表
     * @param prefix 元素中配置的属性前缀
     * @returns {{}}
     */
    getElConfigByKeys: function(el, keys, prefix) {
      prefix = prefix || this.pageDomAttrPrefix;
      if (typeof keys == "string") {
        keys = keys.split(",");
      }
      var cfg = {};
      if (keys && keys.length) {
        for (var i = 0, len = keys.length; i < len; i++) {
          var currKey = keys[i];
          if (typeof currKey == "string") {
            //字符串属性
            cfg[currKey] = el.getAttribute(prefix + currKey) || "";
          } else {
            //对象配置，指定了属性类型{prop,type}
            var tempV = el.getAttribute(prefix + currKey.prop) || "";
            var type = currKey.type || "string";
            if (type == "string") {
            } else if (type == "boolean") {
              tempV = tempV == "true" ? true : false;
            } else if (type == "int") {
              tempV = parseInt(tempV || "0");
            } else if (type == "float") {
              tempV = parseFloat(tempV || "0");
            } else if (type == "object") {
              tempV = oui.parseJson(tempV || "{}");
            }
            cfg[currKey.prop] = tempV;
          }
        }
      }
      return cfg;
    },
    /** 根据业务属性转换 样式属性相关得处理******/
    transStylePropsByBizProps: function() {
      var me = this;
      if (me.data.otherAttrs && me.data.otherAttrs.backgroundImageUrl) {
        var bgUrl = me.data.otherAttrs.backgroundImageUrl;
        me.data.style.backgroundImage = "url(" + bgUrl + ")";
      }
    },

    //初始化载入相关参数
    initBefore: function() {
      var me = this;
      var params = me.paramCfg;
      var canCloneControl = params.canCloneControl;
      if (typeof canCloneControl == "undefined") {
        canCloneControl = true;
      }
      me.oldParams = oui.parseJson(oui.parseString(params)); 
      me.init4static();

      var page = params.page || {};

      var pageDesignType =
        page.pageDesignType || params.pageDesignType || "printForm";

      var typeEnum = PageDesignTypeEnum.findEnum(pageDesignType);

      var typeGlobalStyle = {};
      if (typeEnum && typeEnum.PageGlobalStyles) {
        typeGlobalStyle = oui.parseJson(
          oui.parseString(typeEnum.PageGlobalStyles)
        );
      }

      var globalStyle = oui.parseJson(oui.parseString(PageGlobalStyles));

      if (typeof page.otherAttrs == "string") {
        if (page.otherAttrs.length) {
          page.otherAttrs = oui.parseJson(page.otherAttrs);
        }
      }

      me.data = $.extend(
        true,
        {
          //默认值设置
          id: "",
          bizId: "",
          canCloneControl: canCloneControl,
          modelType: 1,
          //attachments:[],
          version: "1.0",
          pageDesignType: "normalForm",
          enName: "",
          projectId: "",
          name: "页面名称",
          description: "",
          content: "",
          selectContent: "",
          controls: [],
          otherAttrs: {
            modelBindType: 3, //默认不绑定表模型
          },
          events: {}, //页面事件脚本
          currentControl: {},
          tempControl: {},
          tempData: {},
        },
        globalStyle,
        typeGlobalStyle,
        me.data,
        page
      ); //更新时,从page回填到前端页面

      /** 转换页面业务参数相关 到样式属性中转*****/
      me.transStylePropsByBizProps();
      /** 转换页面业务参数相关 到样式属性中转 结束*****/

      /** <script type="text/html" id="absoluteProps-pageProps-biz-tpl">

             </script>

             <script type="text/html" id="absoluteProps-fieldProps-biz-tpl">

             </script>
             **/
      if (!params.pageBizPropsUrl) {
        //自定义 页面业务属性的 html模板 url
        params.pageBizPropsUrl =
          "res_engine/page_design/pc/page-biz-tpl.art.html";
      }
      if (!params.controlBizPropsUrl) {
        //自定义 控件业务属性的 html模板 url
        params.controlBizPropsUrl =
          "res_engine/page_design/pc/components-biz-prop-art-tpl";
      }

      me.buttons = params.buttons || "";
      if (typeof params.useControls == "undefined") {
        if (params.controls && params.controls.length) {
          params.useControls = true;
        }
      }
      me.useControls = params.useControls; //使用已有控件列表作为 控件区域的列表，false，显示默认的控件列表，true：则启用
      
      if (me.useControls) {
        //通过已有的控件列表 在绝对布局设计器中设计

        var controls = params.controls || [];
        var subControlsMap = {};
        var mainCtrls = [];
        for (var i = 0, len = controls.length; i < len; i++) {
          if (controls[i].detailId) {
            //明细表中控件
            if (!subControlsMap[controls[i].detailId]) {
              subControlsMap[controls[i].detailId] = [];
            }
            subControlsMap[controls[i].detailId].push(controls[i]);
          } else {
            mainCtrls.push(controls[i]);
          }
        }
        me.ctrlAreaControls = mainCtrls;
        me.subControlsMap = subControlsMap;
      } else {
        //直接根据 默认的控件类型列表进行 设计
        me.ctrlAreaControls = me.defaultControls || [];
        me.subControlsMap = {};
      }
      //初始化 表格map
      me.initTableLinesMap4first();
    },
    initTableLinesMap4first: function() {
      var me = this;
      me.tableLinesMap = {};
      me.tableLineMaxRect = {
        left: 100000,
        top: 100000,
        right: -100000,
        bottom: -100000,
      };
      var controls = me.data.controls;
      oui.findManyFromArrayBy(controls, function(item) {
        if (item.htmlType == "tableLine") {
          me.tableLinesMap[item.id] = item;
          me.updateTableLineMaxRect(item);
          return true;
        }
      });
    },
    /** 查找表格线控件****/
    findTableLineControl: function(id) {
      var me = this;
      return me.tableLinesMap[id];
    },
    /*** 添加和删除表格控件时 更新 所有表格的最大区域范围****/
    updateTableLineMaxRect: function(control) {
      var me = this;
      if (!control) {
        return;
      }
      if (control.htmlType != "tableLine") {
        return;
      }
      if (control.style.left < me.tableLineMaxRect.left) {
        me.tableLineMaxRect.left = control.style.left;
      }
      if (control.style.top < me.tableLineMaxRect.top) {
        me.tableLineMaxRect.top = control.style.top;
      }
      if (
        control.style.width + control.style.left >
        me.tableLineMaxRect.right
      ) {
        me.tableLineMaxRect.right = control.style.width + control.style.left;
      }
      if (
        control.style.height + control.style.top >
        me.tableLineMaxRect.bottom
      ) {
        me.tableLineMaxRect.bottom = control.style.height + control.style.top;
      }
    },
    /** 根据id获取表格控件***/
    getTableLineControl: function(id) {
      var me = this;
      return me.tableLinesMap[id];
    },
    /** 添加表格控件 指定引用 到 tableLinesMap中****/
    addTableLineControl: function(control) {
      var me = this;
      if (control.htmlType == "tableLine") {
        me.tableLinesMap[control.id] = control;
        me.updateTableLineMaxRect(control);
      }
    },
    /*****
     * 判断表格单元格中是否存在控件
     * @param tableLineControl
     * @returns {boolean}
     */
    hasControlInTableLine: function(tableLineControl) {
      var cellsMap = tableLineControl.style.cellsMap || {};
      var flag = false;
      for (var i in cellsMap) {
        if (cellsMap[i] && cellsMap[i].controlId && cellsMap[i].tableLineId) {
          flag = true;
          break;
        }
      }
      return flag;
    },

    /** 删除表格控件 ，重新计算 所有表格控件的最大区域****/
    removeTableLineControl: function(id, notRemoveControls) {
      var me = this;
      var tableLineControl = me.findTableLineControl(id);
      var currIdx = -1;
      if (tableLineControl) {
        /** 如果传入参数不删除表格控件，则只时清除控件中与表格的单元格信息即可 ***/
        if (notRemoveControls) {
          var cellsMap = tableLineControl.style.cellsMap || {};
          for (var i in cellsMap) {
            //删除 单元格中的控件
            var rect = cellsMap[i];
            if (rect && rect.controlId && rect.tableLineId) {
              var curr = me.getControlById(rect.controlId);
              me.removeRect4Control(curr);
            }
          }
        } else {
          /*** 默认要删除 虚拟表格单元格中的控件****/
          /** 循环查找 并进行批量删除控件***/
          var cellsMap = tableLineControl.style.cellsMap || {};
          var controlIds = [];
          for (var i in cellsMap) {
            //删除 单元格中的控件
            var rect = cellsMap[i];
            if (rect && rect.controlId && rect.tableLineId) {
              controlIds.push(rect.controlId);
            }
          }
          me.removeControlsByIds(controlIds);
        }
        //判断 虚拟表格单元格中 是否存在控件
        me.tableLinesMap[id] = null;
        delete me.tableLinesMap[id];
        var size = 0;
        for (var i in me.tableLinesMap) {
          size++;
          me.updateTableLineMaxRect(me.tableLinesMap[i]);
        }
        if (size == 0) {
          me.tableLineMaxRect.left = 100000;
          me.tableLineMaxRect.top = 100000;
          me.tableLineMaxRect.right = -100000;
          me.tableLineMaxRect.bottom = -100000;
        }
        oui.findOneFromArrayBy(me.data.controls || [], function(item, index) {
          if (item.id == id) {
            currIdx = index;
            return true;
          }
        });
      }
      return currIdx;
    },
    /*** 判断某个点 是否在 所有表格范围的最大区域内 {left,top,width,height} 如果没有宽度和高度，就是判断某个点是否在最打表格区域范围****/
    inTableLineMaxRect: function(posOrRect) {
      var me = this;
      var left = posOrRect.left;
      var top = posOrRect.top;
      var width = posOrRect.width || 0;
      var height = posOrRect.height || 0;
      var right = posOrRect.left + width;
      var bottom = posOrRect.top + height;
      if (
        left < me.tableLineMaxRect.left ||
        right > me.tableLineMaxRect.right
      ) {
        return false;
      }
      if (
        top < me.tableLineMaxRect.top ||
        bottom > me.tableLineMaxRect.bottom
      ) {
        return false;
      }
      return true;
    },

    /*******
     * 判断位置是否在控件的上方
     * @param control
     * @param posOrRect
     */
    isPosAtControlHaffTop: function(control, posOrRect) {
      var top = posOrRect.top;
      var height = posOrRect.height || 0;
      var bottom = posOrRect.top + height;

      var controlTop = control.style.top;
      var controlBottom = control.style.top + control.style.height;
      var halfTop = (controlTop + controlBottom) / 2;
      if (top <= halfTop) {
        return true;
      }
      return false;
    },
    posInControl: function(control, posOrRect, justTop) {
      if (!control || !posOrRect) {
        return false;
      }
      if (justTop) {
        var top = posOrRect.top;
        var height = posOrRect.height || 0;
        var bottom = posOrRect.top + height;

        var controlTop = control.style.top;
        var controlBottom = control.style.top + control.style.height;
        if (top < controlTop || bottom > controlBottom) {
          return false;
        }
      } else {
        var left = posOrRect.left;
        var top = posOrRect.top;
        var width = posOrRect.width || 0;
        var height = posOrRect.height || 0;
        var right = posOrRect.left + width;
        var bottom = posOrRect.top + height;

        var controlLeft = control.style.left;
        var controlTop = control.style.top;
        var controlRight = control.style.left + control.style.width;
        var controlBottom = control.style.top + control.style.height;
        if (left < controlLeft || right > controlRight) {
          return false;
        }
        if (top < controlTop || bottom > controlBottom) {
          return false;
        }
      }

      return true;
    },
    inTableLineControl: function(control, posOrRect) {
      var me = this;
      if (!control || control.htmlType != "tableLine") {
        return false;
      }
      return me.posInControl(control, posOrRect);
    },
    /** 根据  某几个点或者某个 矩形位置 获取所在 的 表格控件
     *
     *  需要保证 表格控件与表格控件之间不能重叠
     *
     * ***/
    findTableLineByPosOrRect: function(posOrRect) {
      var me = this;
      var control = null;
      if (me.inTableLineMaxRect(posOrRect)) {
        var map = me.tableLinesMap || {};
        for (var i in map) {
          if (me.inTableLineControl(map[i], posOrRect)) {
            return map[i];
          }
        }
      }
      return control;
    },

    /** 根据某个点或某个矩形位置 获取所在的控件 ，与当前控件最近的控件
     *
     * 排除 表格布局、数据表格中的控件
     *
     * *****/
    findControlByPosOrRect: function(posOrRect, currControl) {
      // 根据鼠标位置 获取 控件定义 TODO 根据位置 指定控件
      //缓存 控件位置，根据位置 获取控件的索引
      //1、为了兼容 表格布局的场景， 统一用绝对布局 瀑布流，
      //2、拖拽结束后，使用 吸附算法 跟在占位控件的后面或前面，更新后续所有控件top值
      //3、根据top值排序
      var me = this;
      var controls = me.data.controls || [];
      var cfg4distance = {};
      var currMin = 1000000;
      for (var i = 0, len = controls.length; i < len; i++) {
        var curr = controls[i];
        /** 在表格布局 或者在数据表格 中的控件 不算****/
        if (curr && curr.style && curr.style.rect) {
          if (curr.style.rect.tableLineId) {
            continue;
          }
        }
        if (currControl && currControl.id != curr.id) {
          if (me.posInControl(curr, posOrRect, true)) {
            //只判断垂直方向是否在同一个位置
            return curr;
          } else {
            //console.log('当前位置');
            //console.log(posOrRect);
            var top = posOrRect.top;
            var currDistance = Math.min(
              Math.abs(top - curr.style.top),
              Math.abs(top - curr.style.top - curr.style.height)
            );
            currMin = Math.min(currDistance, currMin);

            //console.log('当前距离'+currDistance);
            cfg4distance[currDistance] = i;
          }
        }
      }
      if (typeof cfg4distance[currMin] != "undefined") {
        var findIdx = cfg4distance[currMin];
        if (controls[findIdx]) {
          return controls[findIdx];
        }
      }
      return null;
    },
    /*****
     *
     * 删除虚拟表格 单元格中的信息
     * @param tableLine
     * @param columnIndex
     * @param rowIndex
     */
    removeRectInTableLineByColumnAndRow: function(
      tableLine,
      columnIndex,
      rowIndex
    ) {
      var me = this;
      if (!tableLine) {
        return;
      }
      var cellsMap = tableLine.style.cellsMap || {};
      cellsMap[columnIndex + "_" + rowIndex] = null;
      delete cellsMap[columnIndex + "_" + rowIndex];
    },
    /*** 设置 表格中某个单元格的信息 ****/
    setRectInTableLineByColumnAndRow: function(tableLine, rect) {
      var me = this;
      if (!tableLine) {
        return;
      }
      var cellsMap = tableLine.style.cellsMap || {};
      cellsMap[rect.columnIndex + "_" + rect.rowIndex] = rect;
      tableLine.style.cellsMap = cellsMap;
    },
    /******
     * 删除控件上的单元格信息
     * @param control
     */
    removeRect4Control: function(control) {
      var me = this;
      if (!control) {
        control.style.rect = null;
        delete control.style.rect;
      }
    },
    findRectInTableLineByColumnAndRow: function(
      tableLine,
      columnIndex,
      rowIndex
    ) {
      var cellsMap = tableLine.style.cellsMap || {};
      return cellsMap[columnIndex + "_" + rowIndex];
    },
    /** 根据格子试着找出是否在合并格子中，如果在合并格子中 则 返回合并格子的区域****/
    findMergeCellByRect: function(tableLine, rect) {
      var mergeCellsMap = tableLine.style.mergeCellsMap || {};
      var startColumnIndex = rect.columnIndex;
      var startRowIndex = rect.rowIndex;
      var endColumnIndex;
      var endRowIndex;
      if (rect.colspan && rect.colspan > 1) {
        endColumnIndex = startColumnIndex + rect.colspan - 1;
      } else {
        endColumnIndex = startColumnIndex;
      }
      if (rect.rowspan && rect.rowspan > 1) {
        endRowIndex = startRowIndex + rect.rowspan - 1;
      } else {
        endRowIndex = startRowIndex;
      }

      for (var i in mergeCellsMap) {
        var mergeCell = mergeCellsMap[i];
        if (!mergeCell) {
          continue;
        }

        if (
          startColumnIndex >= mergeCell.startColumnIndex &&
          endColumnIndex <= mergeCell.endColumnIndex
        ) {
          if (
            startRowIndex >= mergeCell.startRowIndex &&
            endRowIndex <= mergeCell.endRowIndex
          ) {
            return mergeCell;
          }
        }
      }
      return null;
    },
    /** 根据点 或者矩形位置 获取在 表格控件中的矩形格子 *****/
    findRectInTableLine: function(tableLine, posOrRect, notCheckControl) {
      var me = this;
      var defaultCfg = {
        tableLineId: tableLine ? tableLine.id : "",
        columnIndex: -1,
        rowIndex: -1,
        left: 100000,
        top: 100000,
        right: -100000,
        bottom: -100000,
      };
      var rect = oui.parseJson(oui.parseString(defaultCfg));
      if (!tableLine || !posOrRect) {
        return rect;
      }
      var left = posOrRect.left - tableLine.style.left; //相对表格位置left计算
      var top = posOrRect.top - tableLine.style.top; //相对表格位置top计算
      var width = posOrRect.width || 0;
      var height = posOrRect.height || 0;
      var right = left + width;
      var bottom = top + height;

      var currLeft = 100000;
      var currRight = -100000;
      var currTop = 100000;
      var currBottom = -100000;

      var columnLines = tableLine.style.columnLines || [];
      var rowLines = tableLine.style.rowLines || [];
      var hasFindLeft = false;
      var hasFindTop = false;
      var columnIndex = -1;
      var rowIndex = -1;
      var borderLeftWidth = tableLine.style.borderLeftWidth;
      var borderTopWidth = tableLine.style.borderTopWidth;

      for (var i = 0, len = columnLines.length; i < len - 1; i++) {
        currLeft =
          columnLines[i].config.lineHeight +
          columnLines[i].fromPos.left +
          borderLeftWidth;
        currRight = columnLines[i + 1].fromPos.left + borderLeftWidth;
        if (
          left >= columnLines[i].fromPos.left &&
          right <= currRight + columnLines[i + 1].config.lineHeight
        ) {
          columnIndex = i;
          hasFindLeft = true;
          break;
        }
      }
      if (hasFindLeft) {
        rect.left = currLeft + tableLine.style.left;
        rect.right = currRight + tableLine.style.left;
        rect.columnIndex = columnIndex;
      }
      for (var i = 0, len = rowLines.length; i < len - 1; i++) {
        currTop =
          rowLines[i].config.lineHeight +
          rowLines[i].fromPos.top +
          borderTopWidth;
        currBottom = rowLines[i + 1].fromPos.top + borderTopWidth;
        if (
          top >= rowLines[i].fromPos.top &&
          bottom <= currBottom + rowLines[i + 1].config.lineHeight
        ) {
          rowIndex = i;
          hasFindTop = true;
          break;
        }
      }
      if (hasFindTop) {
        rect.top = currTop + tableLine.style.top;
        rect.bottom = currBottom + tableLine.style.top;
        rect.rowIndex = rowIndex;
      }
      //判断格子是否在合并单元格格中
      var mergeCell = me.findMergeCellByRect(tableLine, rect);
      if (mergeCell) {
        rect.left = mergeCell.left;
        rect.top = mergeCell.top;
        rect.right = mergeCell.right;
        rect.bottom = mergeCell.bottom;
        rect.columnIndex = mergeCell.startColumnIndex;
        rect.rowIndex = mergeCell.startRowIndex;
        rect.rowspan = mergeCell.endRowIndex - mergeCell.startRowIndex + 1;
        rect.colspan =
          mergeCell.endColumnIndex - mergeCell.startColumnIndex + 1;
      }
      //找出当前格子所在的合并单元格，如果存在合并单元格中,则使用合并单元格的位置

      /** 默认需要检测 是否存在控件， 在拖拽表格单元格选择区域时，则不需要检测是否存在控件*****/
      if (!notCheckControl) {
        var rectInTable = me.findRectInTableLineByColumnAndRow(
          tableLine,
          rect.columnIndex,
          rect.rowIndex
        );
        if (rectInTable && rectInTable.controlId) {
          var currField = me.data.currentControl;
          //当前拖拽中的控件，和表格中的单元格位置是同一个控件 则可以放置，否则不能在当前单元格放置控件了

          if (currField && currField.id != rectInTable.controlId) {
            //当前拖拽中的控件
            //判断 单元格是否存在控件 信息,存在则不能再拖拽入表格单元格中
            rect = defaultCfg;
          }
        }
      }
      return rect;
    },
    /** 根据起始位置 获取表格单元格的最大范围****/
    findMaxArea: function(tableLine, startRect, endRect) {
      var me = this;
      var result = null;
      var startColumnIndex =
        startRect.columnIndex < endRect.columnIndex
          ? startRect.columnIndex
          : endRect.columnIndex;
      var endColumnIndex1 =
        startRect.columnIndex +
        (startRect.colspan && startRect.colspan > 1
          ? startRect.colspan - 1
          : 0);
      var endColumnIndex2 =
        endRect.columnIndex +
        (endRect.colspan && endRect.colspan > 1 ? endRect.colspan - 1 : 0);
      var endColumnIndex =
        endColumnIndex1 > endColumnIndex2 ? endColumnIndex1 : endColumnIndex2;
      var startRowIndex =
        startRect.rowIndex < endRect.rowIndex
          ? startRect.rowIndex
          : endRect.rowIndex;
      var endRowIndex1 =
        startRect.rowIndex +
        (startRect.rowspan && startRect.rowspan > 1
          ? startRect.rowspan - 1
          : 0);
      var endRowIndex2 =
        endRect.rowIndex +
        (endRect.rowspan && endRect.rowspan > 1 ? endRect.rowspan - 1 : 0);
      var endRowIndex =
        endRowIndex1 > endRowIndex2 ? endRowIndex1 : endRowIndex2;
      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        return result;
      }

      result = {
        tableLineId: tableLine.id,
      };
      var left = startRect.left < endRect.left ? startRect.left : endRect.left;
      var top = startRect.top < endRect.top ? startRect.top : endRect.top;
      var right =
        startRect.right > endRect.right ? startRect.right : endRect.right;
      var bottom =
        startRect.bottom > endRect.bottom ? startRect.bottom : endRect.bottom;

      var mergeCellsMap = me.findMergeCellsMapByTableLine(tableLine);
      if (mergeCellsMap) {
        var hasChange = false;
        do {
          hasChange = false;
          var mergeCells = me.findMergeCellsByCellIndex4Inner(
            tableLine,
            startColumnIndex,
            startRowIndex,
            endColumnIndex,
            endRowIndex
          );
          if (mergeCells && mergeCells.length) {
            for (var i = 0, len = mergeCells.length; i < len; i++) {
              var curr = mergeCells[i];
              if (curr) {
                var currSC = curr.startColumnIndex;
                var currSR = curr.startRowIndex;
                var currEC = curr.endColumnIndex;
                var currER = curr.endRowIndex;
                if (currSC < startColumnIndex) {
                  startColumnIndex = currSC;
                  left = curr.left;
                  hasChange = true;
                }
                if (currSR < startRowIndex) {
                  startRowIndex = currSR;
                  top = curr.top;
                  hasChange = true;
                }
                if (currEC > endColumnIndex) {
                  endColumnIndex = currEC;
                  right = curr.right;
                  hasChange = true;
                }
                if (currER > endRowIndex) {
                  endRowIndex = currER;
                  bottom = curr.bottom;
                  hasChange = true;
                }
                if (hasChange) {
                  break;
                }
              }
            }
          }
        } while (hasChange);
      }
      result.left = left;
      result.top = top;
      result.right = right;
      result.bottom = bottom;
      result.startColumnIndex = startColumnIndex;
      result.startRowIndex = startRowIndex;
      result.endColumnIndex = endColumnIndex;
      result.endRowIndex = endRowIndex;
      return result;
    },
    /*** 表格控件 根据已有的 选择区域所在索引 更新 选择区域范围****/
    findRectBySelectRect: function(currField, selectRect) {
      var columnLines = currField.style.columnLines || [];
      var rowLines = currField.style.rowLines || [];
      var newSelectRect = oui.parseJson(oui.parseString(selectRect));
      if (selectRect.startColumnIndex > columnLines.length - 2) {
        newSelectRect.startColumnIndex = columnLines.length - 2;
      } else {
        if (newSelectRect.startColumnIndex < 0) {
          newSelectRect.startColumnIndex = 0;
        }
      }
      if (selectRect.endColumnIndex > columnLines.length - 2) {
        newSelectRect.endColumnIndex = columnLines.length - 2;
      } else {
        if (newSelectRect.endColumnIndex < 0) {
          newSelectRect.endColumnIndex = 0;
        }
      }
      if (selectRect.startRowIndex > rowLines.length - 2) {
        newSelectRect.startRowIndex = rowLines.length - 2;
      } else {
        if (newSelectRect.startRowIndex < 0) {
          newSelectRect.startRowIndex = 0;
        }
      }
      if (selectRect.endRowIndex > rowLines.length - 2) {
        newSelectRect.endRowIndex = rowLines.length - 2;
      } else {
        if (newSelectRect.endRowIndex < 0) {
          newSelectRect.endRowIndex = 0;
        }
      }
      if (selectRect.startSelectColumnIndex > -1) {
        newSelectRect.startRowIndex = 0;
        newSelectRect.endRowIndex = rowLines.length - 2;
        selectRect.startSelectColumnIndex = newSelectRect.startColumnIndex;
      } else if (selectRect.startSelectRowIndex > -1) {
        newSelectRect.startColumnIndex = 0;
        newSelectRect.endColumnIndex = columnLines.length - 2;
        selectRect.startSelectRowIndex = newSelectRect.startRowIndex;
      } else {
        //选择单元格
      }
      var startRect = {
        columnIndex: newSelectRect.startColumnIndex,
        rowIndex: newSelectRect.endRowIndex,
        left:
          currField.style.left +
          currField.style.borderLeftWidth +
          columnLines[newSelectRect.startColumnIndex].config.lineHeight +
          columnLines[newSelectRect.startColumnIndex].fromPos.left,
        right:
          currField.style.left +
          currField.style.borderLeftWidth +
          columnLines[newSelectRect.startColumnIndex + 1].fromPos.left,
        top:
          currField.style.top +
          currField.style.borderTopWidth +
          rowLines[newSelectRect.startRowIndex].config.lineHeight +
          rowLines[newSelectRect.startRowIndex].fromPos.top,
        bottom:
          currField.style.top +
          currField.style.borderTopWidth +
          rowLines[newSelectRect.startRowIndex + 1].fromPos.top,
      };
      var endRect = {
        columnIndex: newSelectRect.endColumnIndex,
        rowIndex: newSelectRect.endRowIndex,
        left:
          currField.style.left +
          currField.style.borderLeftWidth +
          columnLines[newSelectRect.endColumnIndex].config.lineHeight +
          columnLines[newSelectRect.endColumnIndex].fromPos.left,
        right:
          currField.style.left +
          currField.style.borderLeftWidth +
          columnLines[newSelectRect.endColumnIndex + 1].fromPos.left,
        top:
          currField.style.top +
          currField.style.borderTopWidth +
          rowLines[newSelectRect.endRowIndex].config.lineHeight +
          rowLines[newSelectRect.endRowIndex].fromPos.top,
        bottom:
          currField.style.top +
          currField.style.borderTopWidth +
          rowLines[newSelectRect.endRowIndex + 1].fromPos.top,
      };
      newSelectRect.left = startRect.left;
      newSelectRect.top = startRect.top;
      newSelectRect.right = endRect.right;
      newSelectRect.bottom = endRect.bottom;
      if (
        newSelectRect.startSelectColumnIndex > -1 ||
        newSelectRect.startSelectRowIndex > -1
      ) {
        newSelectRect.startRect = startRect;
        newSelectRect.endRect = endRect;
      }
      return newSelectRect;
    },
    /** 根据表格 的选择区域显示 占位层****/
    showOperationSelectByTableLineSelectRect: function(tableLine, rect) {
      var me = this;
      if (!me.$operation) {
        me.$operation = $("#operation-layer");
      }
      var $operation = me.$operation;
      if (rect) {
        $operation.find(".operation-select-area").css({
          display: "block",
          position: "absolute",
          background: "red",
          border: 0,
          left:
            rect.left -
            tableLine.style.left +
            tableLine.style.lineHeight +
            "px",
          top:
            rect.top - tableLine.style.top + tableLine.style.lineHeight + "px",
          width: rect.right - rect.left + "px",
          height: rect.bottom - rect.top + "px",
        });
        $operation.find(".column-active").removeClass("column-active");
        $operation.find(".row-active").removeClass("row-active");
        var columnSelector = [];
        var rowSelector = [];
        for (
          var columnIndex = rect.startColumnIndex;
          columnIndex <= rect.endColumnIndex;
          columnIndex++
        ) {
          columnSelector.push(
            ".control-column-num-abs[line-column-index=" + columnIndex + "]"
          );
        }
        for (
          var rowIndex = rect.startRowIndex;
          rowIndex <= rect.endRowIndex;
          rowIndex++
        ) {
          rowSelector.push(
            ".control-row-num-abs[line-row-index=" + rowIndex + "]"
          );
        }
        if (columnSelector.length) {
          $operation.find(columnSelector.join(",")).addClass("column-active");
        }
        if (rowSelector.length) {
          $operation.find(rowSelector.join(",")).addClass("row-active");
        }
      } else {
        $operation.find(".operation-select-area").css({
          display: "none",
        });
      }
    },
    /** 根据拖拽选择区域获取 拖拽选择部分的矩形区域,靠鼠标位置动态计算出行列索引位置***/
    findRectBySelectArea: function(currField, dragData) {
      var me = this;
      var sx = dragData.startMouseX;
      var sy = dragData.startMouseY;
      var x = dragData.mouseX;
      var y = dragData.mouseY;
      var dropPos = dragData.dropPos;
      var rsx = sx + dragData.scrollContainerLeft - dropPos.x;
      var rsy = sy + dragData.scrollContainerTop - dropPos.y;
      var rx = x + dragData.scrollContainerLeft - dropPos.x;
      var ry = y + dragData.scrollContainerTop - dropPos.y;

      var rect = {
        left: rsx < rx ? rsx : rx,
        top: rsy < ry ? rsy : ry,
        right: rx > rsx ? rx : rsx,
        bottom: ry > rsy ? ry : rsy,
      };
      /** 表格控件 需要 获取控件所在区域的单元格 位置****/
      if (currField.htmlType == "tableLine") {
        if (dragData.startSelectColumnIndex > -1) {
          //列选择
          var startColumnRect = me.findColumnRectByPosOrRect(currField, {
            left: rect.left,
            top: rect.top,
          });
          var endColumnRect = me.findColumnRectByPosOrRect(currField, {
            left: rect.right,
            top: rect.bottom,
          });
          var startRect = {
            rowIndex: 0,
            columnIndex: startColumnRect.columnIndex,
            left: startColumnRect.left,
            right: startColumnRect.right,
            top: startColumnRect.startTop,
            bottom: startColumnRect.startBottom,
          };
          var endRect = {
            rowIndex: currField.style.rowLines.length - 2,
            columnIndex: endColumnRect.columnIndex,
            left: endColumnRect.left,
            right: endColumnRect.right,
            top: endColumnRect.top,
            bottom: endColumnRect.bottom,
          };
          rect = {
            left: startRect.left,
            top: startRect.top,
            right: endRect.right,
            bottom: endRect.bottom,
            startRect: startRect, //startRect,endRect,me.findMaxArea(currField,startRect,endRect);,用于 合并拆分时调用获取最大范围后处理
            endRect: endRect,
          };
          /** 选择单列***/
          if (startRect.columnIndex == endRect.columnIndex) {
            rect.isSelectOneColumn = true;
          }
          rect.startColumnIndex = startRect.columnIndex;
          rect.endColumnIndex = endRect.columnIndex;
          rect.startRowIndex = 0;
          rect.endRowIndex = endRect.rowIndex;
          rect.isSelectColumn = true;
          rect.tableLineId = currField.id;
        } else if (dragData.startSelectRowIndex > -1) {
          //行选择
          var startRowRect = me.findRowRectByPosOrRect(currField, {
            left: rect.left,
            top: rect.top,
          });
          var endRowRect = me.findRowRectByPosOrRect(currField, {
            left: rect.right,
            top: rect.bottom,
          });
          var startRect = {
            columnIndex: 0,
            left: startRowRect.startLeft,
            right: startRowRect.startRight,

            rowIndex: startRowRect.rowIndex,
            top: startRowRect.top,
            bottom: startRowRect.bottom,
          };
          var endRect = {
            columnIndex: currField.style.columnLines.length - 2,
            left: endRowRect.left,
            right: endRowRect.right,
            rowIndex: endRowRect.rowIndex,
            top: endRowRect.top,
            bottom: endRowRect.bottom,
          };
          rect = {
            left: startRect.left,
            top: startRect.top,
            right: endRect.right,
            bottom: endRect.bottom,
            startRect: startRect, //startRect,endRect,me.findMaxArea(currField,startRect,endRect);,用于 合并拆分时调用获取最大范围后处理
            endRect: endRect,
          };
          /** 选择单列***/
          if (startRect.rowIndex == endRect.rowIndex) {
            rect.isSelectOneRow = true;
          }
          rect.startColumnIndex = 0;
          rect.endColumnIndex = endRect.columnIndex;
          rect.startRowIndex = startRect.rowIndex;
          rect.endRowIndex = endRect.rowIndex;
          rect.isSelectRow = true;
          rect.tableLineId = currField.id;
        } else {
          //单元格选择
          var startRect = me.findRectInTableLine(
            currField,
            { left: rect.left, top: rect.top },
            true
          );
          var endRect = me.findRectInTableLine(
            currField,
            { left: rect.right, top: rect.bottom },
            true
          );
          rect = me.findMaxArea(currField, startRect, endRect);
        }
      }
      return rect;
    },
    /** 根据点或者矩形位置 获取表格的列信息****/
    findColumnRectByPosOrRect: function(tableLine, posOrRect) {
      var me = this;
      var defaultCfg = {
        tableLineId: tableLine ? tableLine.id : "",
        columnIndex: -1,
        rowIndex: -1,
        left: 100000,
        top: 100000,
        right: -100000,
        bottom: -100000,
      };
      var rect = oui.parseJson(oui.parseString(defaultCfg));
      if (!tableLine || !posOrRect) {
        return rect;
      }
      var left = posOrRect.left - tableLine.style.left; //相对表格位置left计算
      var width = posOrRect.width || 0;
      var right = left + width;
      var currLeft = 100000;
      var currRight = -100000;
      var columnLines = tableLine.style.columnLines || [];
      var hasFindLeft = false;
      var columnIndex = -1;
      var borderLeftWidth = tableLine.style.borderLeftWidth;
      var borderTopWidth = tableLine.style.borderTopWidth;
      for (var i = 0, len = columnLines.length; i < len - 1; i++) {
        currLeft =
          columnLines[i].config.lineHeight +
          columnLines[i].fromPos.left +
          borderLeftWidth;
        currRight = columnLines[i + 1].fromPos.left + borderLeftWidth;
        if (
          left >= columnLines[i].fromPos.left &&
          right <= currRight + columnLines[i + 1].config.lineHeight
        ) {
          columnIndex = i;
          hasFindLeft = true;
          break;
        }
      }
      if (hasFindLeft) {
        var rowLines = tableLine.style.rowLines || [];
        rect.left = currLeft + tableLine.style.left;
        rect.right = currRight + tableLine.style.left;
        rect.columnIndex = columnIndex;
        rect.startTop =
          tableLine.style.top +
          rowLines[0].config.lineHeight +
          rowLines[0].fromPos.top +
          borderTopWidth;
        rect.startBottom =
          tableLine.style.top + rowLines[1].fromPos.top + borderTopWidth;
        rect.top =
          tableLine.style.top +
          rowLines[rowLines.length - 2].config.lineHeight +
          rowLines[rowLines.length - 2].fromPos.top +
          borderTopWidth;
        rect.bottom =
          tableLine.style.top +
          rowLines[rowLines.length - 1].fromPos.top +
          borderTopWidth;
      }
      return rect;
    },

    /** 根据点或者矩形位置 获取表格的行索引****/
    findRowRectByPosOrRect: function(tableLine, posOrRect) {
      var me = this;
      var defaultCfg = {
        tableLineId: tableLine ? tableLine.id : "",
        columnIndex: -1,
        rowIndex: -1,
        left: 100000,
        top: 100000,
        right: -100000,
        bottom: -100000,
      };
      var rect = oui.parseJson(oui.parseString(defaultCfg));
      if (!tableLine || !posOrRect) {
        return rect;
      }
      var top = posOrRect.top - tableLine.style.top; //相对表格位置top计算
      var height = posOrRect.height || 0;
      var bottom = top + height;
      var currTop = 100000;
      var currBottom = -100000;

      var rowLines = tableLine.style.rowLines || [];
      var hasFindTop = false;
      var rowIndex = -1;
      var borderTopWidth = tableLine.style.borderTopWidth;
      for (var i = 0, len = rowLines.length; i < len - 1; i++) {
        currTop =
          rowLines[i].config.lineHeight +
          rowLines[i].fromPos.top +
          borderTopWidth;
        currBottom = rowLines[i + 1].fromPos.top + borderTopWidth;
        if (
          top >= rowLines[i].fromPos.top &&
          bottom <= currBottom + rowLines[i + 1].config.lineHeight
        ) {
          rowIndex = i;
          hasFindTop = true;
          break;
        }
      }
      if (hasFindTop) {
        var columnLines = tableLine.style.columnLines || [];
        var borderLeftWidth = tableLine.style.borderLeftWidth;

        rect.startLeft =
          tableLine.style.left +
          columnLines[0].config.lineHeight +
          columnLines[0].fromPos.left +
          borderLeftWidth;
        rect.startRight =
          tableLine.style.left + columnLines[1].fromPos.left + borderLeftWidth;

        rect.left =
          tableLine.style.left +
          columnLines[columnLines.length - 2].config.lineHeight +
          columnLines[columnLines.length - 2].fromPos.left +
          borderLeftWidth;
        rect.right =
          tableLine.style.left +
          columnLines[columnLines.length - 1].fromPos.left +
          borderLeftWidth;

        rect.top = currTop + tableLine.style.top;
        rect.bottom = currBottom + tableLine.style.top;
        rect.rowIndex = rowIndex;
      }
      return rect;
    },
    /*** 根据 点位置 或者矩形位置  获取在表格控件中的 单元格 矩形位置 *****/
    findRectByPosOrRect: function(posOrRect) {
      var me = this;
      var control = me.findTableLineByPosOrRect(posOrRect);
      var rect = me.findRectInTableLine(control, posOrRect);
      return rect;
    },
    /** 通过画线算法 实现 表格画线******/
    createTableLines: function(currentControl) {
      var me = this;
      var cfg = {
        columnLines: me.createTableColumnLines(currentControl),
        rowLines: me.createTableRowLines(currentControl),
      };
      /** 暂时不用画线算法处理*****/
      //oui.buildLine(lines[i].fromPos,lines[i].toPos,lines[i].config)
      return cfg;
    },
    createTableColumnLines: function(currentControl) {
      var columnLines = [];
      var config = {
        color: currentControl.style.lineColor,
        lineHeight: currentControl.style.lineHeight,
      };
      var left = 0;
      var lineHeight = currentControl.style.lineHeight; //线条默认高度 1
      var width = currentControl.style.width;
      var height = currentControl.style.height;
      var columnSize = currentControl.style.columnSize;
      var widthStep =
        (width -
          lineHeight -
          currentControl.style.borderLeftWidth -
          currentControl.style.borderRightWidth) /
        columnSize;
      var tempTop = height - lineHeight;
      for (var i = 0, len = columnSize + 1; i < len; i++) {
        columnLines.push({
          fromPos: { left: left, top: 0 },
          toPos: { left: left, top: tempTop },
          config: oui.parseJson(oui.parseString(config)),
        });
        left += widthStep;
      }

      return columnLines;
    },
    createTableRowLines: function(currentControl) {
      var rowLines = [];
      var config = {
        color: currentControl.style.lineColor,
        lineHeight: currentControl.style.lineHeight,
      };
      var top = 0;
      var lineHeight = currentControl.style.lineHeight; //线条默认高度 1
      var width = currentControl.style.width;
      var height = currentControl.style.height;
      var rowSize = currentControl.style.rowSize;
      var heightStep =
        (height -
          lineHeight -
          currentControl.style.borderBottomWidth -
          currentControl.style.borderTopWidth) /
        rowSize;
      var leftTemp = width - lineHeight;
      for (var i = 0, len = rowSize + 1; i < len; i++) {
        rowLines.push({
          fromPos: { left: 0, top: top },
          toPos: { left: leftTemp, top: top },
          config: oui.parseJson(oui.parseString(config)),
        });
        top += heightStep;
      }

      return rowLines;
    },
    isControlInDetail: function(control) {
      var me = this;
      var flag = false;
      if (control && control.detailId) {
        flag = true;
      }
      return flag;
    },
    /**是否显示明细表中控件列表***/
    isShowDetailControls: function() {
      var me = this;
      var subId = me.findCurrPageBizId();
      if (subId) {
        return true;
      }
      return false;
    },
    findCurrPageBizId: function() {
      var me = this;
      var subId = "";
      if (me.useControls) {
        //使用控件回填的场景才会根据当前控件渲染可拖拽控件区域
        if (
          me.data &&
          me.data.currentControl &&
          (me.data.currentControl.controlType == "detail" ||
            me.data.currentControl.controlType == "detail")
        ) {
          if (me.data.currentControl.bizId) {
            subId = me.data.currentControl.bizId;
          }
        } else if (me.isControlInDetail(me.data.currentControl)) {
          //判断当前控件是否在明细表中
          subId = me.data.currentControl.detailId;
        }
      }
      return subId;
    },
    /** 根据子表名称****/
    findDetailName: function(subId) {
      var me = this;
      var curr = oui.findOneFromArrayBy(me.ctrlAreaControls || [], function(
        item
      ) {
        if (item.id == subId) {
          return true;
        } else {
          return false;
        }
      });
      if (curr) {
        return curr.name;
      }
      return "";
    },
    /*******
     * 获取控件区域 的控件类型分类列表
     * @returns {*[]}
     */
    findControlTypes: function() {
      var me = this;
      var subId = me.findCurrPageBizId();
      var findControls = function() {
        //this作用域 未控件类型对象
        var htmlType = this.name;
        if (!this.controls) {
          var targetControls = [];
          if (subId) {
            targetControls = me.subControlsMap[subId] || [];
          } else {
            targetControls = me.ctrlAreaControls || [];
          }
          this.controls =
            oui.findManyFromArrayBy(targetControls, function(item) {
              if (item.htmlType == htmlType) {
                return true;
              }
            }) || [];
        }
        return this.controls;
      };
      var findCls = function(item) {
        //this作用域在控件类型对象上
        var cls = "";
        //是否存在id来判断是否是从已有的控件左侧待拖拽列表
        if (item.id) {
          cls = "create-only-one";
          var me = com.oui.absolute.AbsoluteDesign; //作用域指定
          //在当前控件列表中
          var controlInDesign = oui.findOneFromArrayBy(
            me.data.controls || [],
            function(curr) {
              if (curr.id == item.id) {
                return true;
              }
            }
          );
          if (controlInDesign) {
            cls += " control-abs-disable"; //已经在设计区,则不不能拖拽
          }
        }

        return cls;
      };
      var arr = [
        {
          name: ControlTypeEnum.button.name,
          title: "按钮",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.table.name,
          title: "表格",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.customTable.name,
          title: "自定义表格",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.container.name,
          title: "容器",
          findControls: findControls,
          findCls: findCls,
        },

        {
          name: ControlTypeEnum.detail.name,
          title: "明细表",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.textInput.name,
          title: "文本输入类",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.qrcode.name,
          title: "二维码",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.barcode.name,
          title: "条形码",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.image.name,
          title: "图片查看",
          findControls: findControls,
          findCls: findCls,
        },

        {
          name: ControlTypeEnum.selectInput.name,
          title: "选择输入类",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.repeatSelect.name,
          title: "平铺选择类",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.read.name,
          title: "查看类",
          findControls: findControls,
          findCls: findCls,
        },
        {
          name: ControlTypeEnum.other.name,
          title: "其它",
          findControls: findControls,
          findCls: findCls,
        },
      ];
      return arr;
    },
    /***
     * 根据主题模板id 获取对应的主题名称
     * @param theme
     */
    findThemeName: function(theme) {
      var me = this;
      var curr = oui.findOneFromArrayBy(me.themeTypes, function(item) {
        if (item.value == theme) {
          return true;
        }
      });
      var desc = "请选择主题";
      if (curr.value) {
        if (curr.value != "self_edit") {
          desc = curr.display;
        } else {
          desc = "自定义";
        }
      }
      return desc;
    },
    /****
     * 获取纸张类型
     * @param paperType
     * @returns {string}
     */
    findPaperTypeName: function(paperType) {
      var me = this;
      var curr = oui.findOneFromArrayBy(me.paperRuleTypes, function(item) {
        if (item.value == paperType) {
          return true;
        }
      });
      var desc = "请选择尺寸";
      if (curr.value) {
        if (curr.value != "self_edit") {
          desc =
            curr.value +
            "（" +
            curr.width +
            curr.cellType +
            "*" +
            curr.height +
            curr.cellType +
            "）";
        } else {
          desc = "自定义";
        }
      }
      return desc;
    },
    //转向pc 设计器
    event2pc: function() {
      var me = this;
      if (me.clientType4Design == "pc") {
        return;
      }
      if (me.hasChange) {
        oui.getTop().oui.alert("当前设计器存在变更，请先保存");
        return;
      }
      var url = location.href;
      url = oui.setParam(url, "clientType", "pc");
      oui.go4replace(url);
    },
    //转向phone 设计器
    event2phone: function() {
      var me = this;
      if (me.clientType4Design == "phone") {
        return;
      }
      if (me.hasChange) {
        oui.getTop().oui.alert("当前设计器存在变更，请先保存");
        return;
      }
      var url = location.href;
      url = oui.setParam(url, "clientType", "phone");
      oui.go4replace(url);
    },
    /***
     * 自己投现在
     * @param cfg
     */
    event2showOrHideThemeSelect: function(cfg) {
      var $parent = $(cfg.el).closest(".design-select-paper");
      var $list = $parent.find(".select-paper-list");
      if ($list.hasClass("show-list")) {
        $list.removeClass("show-list");
      } else {
        $list.addClass("show-list");
      }
    },
    /** 纸张类型选择 */
    event2showOrHidePaperSizeSelect: function(cfg) {
      var $parent = $(cfg.el).closest(".design-select-paper");
      var $list = $parent.find(".select-paper-list");
      if ($list.hasClass("show-list")) {
        $list.removeClass("show-list");
      } else {
        $list.addClass("show-list");
      }
    },
    /** 设置主题类型 **/
    event2setTheme: function(cfg) {
      //隐藏下拉区域
      var $parent = $(cfg.el).closest(".design-select-paper");
      $parent.find(".select-paper-list").removeClass("show-list");

      var v = $(cfg.el).attr("value");
      var me = this;
      if (v) {
        var curr = oui.findOneFromArrayBy(me.themeTypes, function(item) {
          if (item.value == v) {
            return true;
          }
        });
        if (curr) {
          me.data.style.theme = curr.value;
          // 解决ie下不能自动渲染属性面板的问题
          if (oui.browser.ie || oui.browser.isEdge) {
            me.setCurrPropsData4page("props", "down2selectPage");
          }
          me.renderPaperStyle();
        }
      }
    },
    //获取 主题样式路径
    findThemeUrl: function() {
      var me = this;
      if (me.data.style.theme) {
        if (me.data.style.theme == "self_edit") {
          var url = me.data.style.themeUrl || ""; //样式主题路径
          if (url) {
            if (url.indexOf("http") != 0) {
              //本地工程相对路径
              url = oui.getContextPath() + url;
            }
          }
          return url;
        } else {
          var folder = oui.getContextPath() + "res_common/oui/themes/";
          var path = folder + me.data.style.theme + ".css";
          return path;
        }
      }
      return "";
    },
    /**设置纸张类型 **/
    event2setPageInfo: function(cfg) {
      //隐藏下拉区域
      var $parent = $(cfg.el).closest(".design-select-paper");
      $parent.find(".select-paper-list").removeClass("show-list");

      var v = $(cfg.el).attr("value");
      var me = this;
      if (v) {
        var curr = oui.findOneFromArrayBy(me.paperRuleTypes, function(item) {
          if (item.value == v) {
            return true;
          }
        });
        if (curr) {
          me.data.style.paperType = curr.value;
          me.data.style.cellType = curr.cellType;
          if (v != "self_edit") {
            me.data.style.width = curr.width;
            me.data.style.height = curr.height;
          } else {
            if (
              typeof me.data.style.width == "undefined" ||
              typeof me.data.style.height == "undefined"
            ) {
              var defPage = oui.findOneFromArrayBy(me.paperRuleTypes, function(
                temp
              ) {
                if (temp.value == "A4") {
                  return true;
                }
              });
              me.data.style.width = defPage.width; //默认 a4尺寸
              me.data.style.height = defPage.height; //默认 a4尺寸
            }
          }
          // 解决ie下不能自动渲染属性面板的问题
          if (oui.browser.ie || oui.browser.isEdge) {
            me.setCurrPropsData4page("props", "down2selectPage");
          }
          me.renderPaperStyle();
          //me.bindDragEvents();
        }
      }
    },
    event2setCurrTab2props: function(cfg) {
      var me = this;
      me.activeTab = 0;
      if (oui.browser.ie) {
        me.changePropsView();
      } else {
        oui.getById("absoluteProps").render();
      }
      oui.clear4notUse();
    },
    event2setCurrTab2bizProps: function(cfg) {
      var me = this;
      me.activeTab = 1;
      if (oui.browser.ie) {
        me.changePropsView();
      } else {
        oui.getById("absoluteProps").render();
      }
      oui.clear4notUse();
    },
    /** 属性面板渲染前处理****/
    onBeforeRender4Props: function() {
      var me = com.oui.absolute.AbsoluteDesign;
      if (me.timer4AfterRender4Props) {
        try {
          clearTimeout(me.timer4AfterRender4Props);
        } catch (err) {
          me.timer4AfterRender4Props = null;
        }
        return false;
      }
      me.count = (me.count || 0) + 1;
      if (oui.browser.ie || oui.browser.isEdge) {
        //ie下不用虚拟dom绑定更新
        var $attrContent = $(".design-set-content");
        if ($attrContent && $attrContent.length) {
          var lastScrollTop4props = $attrContent[0].scrollTop;

          me.lastScrollTop4props = lastScrollTop4props;
        }
      }
    },
    /** 属性遍布渲染后处理***/
    onAfterRender4Props: function() {
      var me = com.oui.absolute.AbsoluteDesign;
      if (me.timer4AfterRender4Props) {
        try {
          clearTimeout(me.timer4AfterRender4Props);
        } catch (err) {}
        me.timer4AfterRender4Props = null;
        return;
      }
      if (oui.browser.ie || oui.browser.isEdge) {
        //ie下不用虚拟dom绑定更新
        console.log("渲染次数" + me.count);
        me.timer4AfterRender4Props = setTimeout(function() {
          var $errorTabs = $(".fielderror-info").closest(
            ".design-attribute-item"
          );
          if ($errorTabs && $errorTabs.length) {
            $errorTabs
              .find(".design-set-attribute-tit")
              .addClass("attribute-tit-active");
            if (me.lastScrollTop4props) {
              if (me.timer4errorFocus) {
                try {
                  clearTimeout(me.timer4errorFocus);
                } catch (err) {}
              }
              me.timer4errorFocus = setTimeout(function() {
                var $attrContent = $(".design-set-content");
                //$errorTabs.find('.fielderror').prev().find('input,textarea').focus();
                document.body.onselectstart = function() {
                  return true;
                };

                $attrContent[0].scrollTop = me.lastScrollTop4props;
                //document.body.onselectstart=function(){return false;};
                me.timer4errorFocus = null;
              }, 50);
            }
          } else {
            var $attrContent = $(".design-set-content");
            $attrContent[0].scrollTop = me.lastScrollTop4props || 0;
          }
          me.timer4AfterRender4Props = null;
        }, 50);
      }
    },
    changePropsView: function() {
      var me = this;
      if (oui.browser.ie || oui.browser.isEdge) {
        //ie下不用虚拟dom绑定更新
        oui.getById("absoluteProps").setData(me.data);
      }
      me.refreshBizProps();
    },
    setCurrPropsData: function(data, type, state) {
      var me = this;
      if (me.currTimer4change) {
        try {
          clearTimeout(me.currTimer4change);
        } catch (err) {}
      }
      /** 延迟执行，解决双向绑定，元素值改变时触发非当前对象属性被改变的问题******/
      me.currTimer4change = setTimeout(function() {
        data = data || {};
        me.data.currentControl = data;
        //if(me.data.currentControl != data){
        //
        //}
        me.state = state;
        if (state != "init") {
          me.designChanged();
        }
        if (me.inited) {
          if (me.isShowDetailControls()) {
            oui.getById("ctrlAreas").render();
          } else {
            if ($(".design-ctrl-area").hasClass("detail-feilds")) {
              oui.getById("ctrlAreas").render();
            }
          }
          if (type == "props") {
            //属性变更 同步 中间区域
            me.renderCenterAll();
            me.changePropsView();
            setTimeout(function() {
              me.isRenderAll = false;
              /** 如果渲染正轨控件过程，正在拖拽 则进行拖拽重置***/
              if (me.currDragEl) {
                try {
                  if ($(me.currDragEl).attr("id")) {
                    $("#" + $(me.currDragEl).attr("id")).trigger("mousedown");
                  } else {
                    $(me.currDragEl).trigger("mousedown");
                  }
                  me.currDragEl = null;
                } catch (e) {}
              }
            }, 5);
          } else {
            //中间区域变更 同步属性
            if (oui.browser.ie || oui.browser.isEdge) {
              //ie下不用虚拟dom绑定更新
              me.changePropsView();
            } else {
              oui.getById("absoluteProps").attr("forceUpdate", true); //页面切换时强制刷新
              oui.getById("absoluteProps").setData(me.data, true);
              me.refreshBizProps();
            }
          }
        }
        me.currTimer4change = null;
      }, 10);
    },
    // 业务属性变更触发逻辑
    bizPropsUpdate: function(key, v) {
      oui.getById("absoluteProps").attr("forceUpdate", false);
      console.log("业务属性变更:" + key + ":" + oui.parseString(v));
    },
    refreshBizProps: function() {
      var bizPropsExtend = oui.getById("current-control-biz-props");
      var pagePropsExtend = oui.getById("current-pageProps-biz");
      if (this.data.currentControl && this.data.currentControl.id) {
        //刷新控件业务属性
        if (bizPropsExtend != null) {
          try {
            bizPropsExtend.refresh();
          } catch (err) {}
        } else {
          oui.getById("absoluteProps").render();
        }
      } else {
        //刷新页面业务属性
        if (pagePropsExtend != null) {
          try {
            pagePropsExtend.refresh();
          } catch (err) {}
        } else {
          //oui.getById('absoluteProps').attr('elRoot',''); //解决虚拟dom渲染问题, 使用刷新存在双向绑定问题
          oui.getById("absoluteProps").render();
        }
      }
    },
    /** 获取当前控件对象******/
    getCurrPropsData: function() {
      return this.data;
    },
    /** 拖拽底层事件绑定****/
    bindDrag: function(options) {
      var me = this;

      var $body = $("body");
      var $movingLayout = $(".design-moving-layout");
      var $doc = $(document);
      var $proxyDrag = $(options.proxyDragSelector);
      var $proxyPlaceholder = $(".proxy-drag-placeholder");
      var $scrollContainer = $(options.scrollContainer || "body");
      var $dropContainer = $(
        options.dropContainer || options.scrollContainer || "body"
      );
      var $dragScrollContainer = $(options.dragScrollContainer || "body"); //拖拽区域（新建）的滚动区域的容器
      var cancelSeletor = options.cancelSelector || ".control-abs-disable";
      var operationSelector = options.operationSelector || ".operation-layer";
      var dropPos = getElementPositionXY($dropContainer[0]);
      var scrollElPos = getElementPositionXY($scrollContainer[0]);
      var dragArea = options.dragArea || {
        left: 0,
        top: 0,
        right: 200000,
        bottom: 200000,
      };
      try {
        $doc.off("mousedown", options.dragSelector);
      } catch (e) {}

      function mouseX(evt) {
        if (evt.pageX) return evt.pageX;
        else if (evt.clientX)
          return (
            evt.clientX +
            (document.documentElement.scrollLeft
              ? document.documentElement.scrollLeft
              : document.body.scrollLeft)
          );
        else return 0;
      }

      function mouseY(evt) {
        if (evt.pageY) return evt.pageY;
        else if (evt.clientY)
          return (
            evt.clientY +
            (document.documentElement.scrollTop
              ? document.documentElement.scrollTop
              : document.body.scrollTop)
          );
        else return 0;
      }

      function getXY(event) {
        var e = event || window.event;
        var x = mouseX(e);
        var y = mouseY(e);
        return { x: x, y: y };
      }
      me.getXY = getXY;
      function getElementPositionX(offsetTrail) {
        var offsetLeft = 0;
        while (offsetTrail) {
          offsetLeft += offsetTrail.offsetLeft || 0;
          offsetTrail = offsetTrail.offsetParent;
        }
        if (
          navigator.userAgent.indexOf("Mac") != -1 &&
          typeof document.body.leftMargin != "undefined"
        ) {
          offsetLeft += document.body.leftMargin;
        }
        return offsetLeft;
      }

      function getElementPositionY(offsetTrail) {
        var offsetTop = 0;
        while (offsetTrail) {
          offsetTop += offsetTrail.offsetTop || 0;
          offsetTrail = offsetTrail.offsetParent;
        }
        if (
          navigator.userAgent.indexOf("Mac") != -1 &&
          typeof document.body.topMargin != "undefined"
        ) {
          offsetTop += document.body.topMargin;
        }
        return offsetTop;
      }

      function getElementPositionXY(offsetTrail) {
        var offsetLeft = 0;
        var offsetTop = 0;
        while (offsetTrail) {
          offsetLeft += offsetTrail.offsetLeft || 0;
          offsetTop += offsetTrail.offsetTop || 0;
          offsetTrail = offsetTrail.offsetParent;
        }
        if (
          navigator.userAgent.indexOf("Mac") != -1 &&
          typeof document.body.leftMargin != "undefined"
        ) {
          offsetLeft += document.body.leftMargin;
          offsetTop += document.body.topMargin;
        }
        return { x: offsetLeft, y: offsetTop };
      }
      $doc.on("mousedown", options.dragSelector, function(e) {
        var $dropContainer = $(
          options.dropContainer || options.scrollContainer || "body"
        );
        $dragScrollContainer = $(options.dragScrollContainer || "body");

        if (e.button == 1) {
          //左键
        } else if (e.button == 2) {
          //右键
          return false;
        }
        if (e.target.setCapture) {
          e.target.setCapture();
        }
        /** 拖拽代理层 事件禁用****/
        var $inProxyDrag = $(e.target).closest(".proxy-drag");
        if (
          $(e.target).is(".proxy-drag") ||
          ($inProxyDrag && $inProxyDrag.length)
        ) {
          return false;
        }
        var dropPos = getElementPositionXY($dropContainer[0]);

        var scrollContainerLeft = $scrollContainer[0].scrollLeft;
        var scrollContainerTop = $scrollContainer[0].scrollTop;

        var el = e.target || e.srcElement;

        var mousePos = me.getXY(e);
        var startMouseX = mousePos.x;
        var startMouseY = mousePos.y;
        var isResizer = $(el).hasClass("drag-resizer");
        var isResizerRow = $(el).hasClass("line-row-resizer");
        var isResizerColumn = $(el).hasClass("line-column-resizer");
        var isSelectArea = $(el).hasClass("drag-select-area"); //拖拽选择区域
        var isOnlyDrag4Table = $(el).hasClass("tableLine-drag-icon"); //仅有的拖拽表格功能
        var isSelectColumn = $(el).hasClass("control-column-num-abs"); //选择列
        var selectColumnEl = null;
        var selectRowEl = null;
        if (!isSelectColumn) {
          if ($(el).closest(".control-column-num-abs").length > 0) {
            isSelectColumn = true;
            selectColumnEl = $(el).closest(".control-column-num-abs")[0];
          }
        } else {
          selectColumnEl = el;
        }

        if (!isSelectRow) {
          var isSelectRow = $(el).hasClass("control-row-num-abs"); //选择行
          if ($(el).closest(".control-row-num-abs").length > 0) {
            isSelectRow = true;
            selectRowEl = $(el).closest(".control-row-num-abs")[0];
          }
        } else {
          selectRowEl = el;
        }
        var startSelectColumnIndex = -1;
        var startSelectRowIndex = -1;
        var resizeRowIndex = -1;
        var resizeColumnIndex = -1;
        var lineColumnLength = 0;
        var lineRowLength = 0;
        var fromResizeLeft = -1000000;
        var toResizeLeft = 1000000;
        var fromResizeTop = -1000000;
        var toResizeTop = 1000000;
        var lineWidth = 1;
        var resizerEl = null;
        if (isSelectColumn) {
          startSelectColumnIndex = parseInt(
            $(selectColumnEl).attr("line-column-index")
          );
        }
        if (isSelectRow) {
          startSelectRowIndex = parseInt($(selectRowEl).attr("line-row-index"));
        }

        if (isResizer) {
          resizerEl = el;
          if (isResizerRow) {
            resizeRowIndex = parseInt($(el).attr("line-row-index"));
            lineColumnLength = parseInt($(el).attr("line-column-length"));
            lineRowLength = parseInt($(el).attr("line-row-length"));
            lineWidth = $(resizerEl).outerHeight();
          } else if (isResizerColumn) {
            resizeColumnIndex = parseInt($(el).attr("line-column-index"));
            lineColumnLength = parseInt($(el).attr("line-column-length"));
            lineRowLength = parseInt($(el).attr("line-row-length"));
            lineWidth = $(resizerEl).outerWidth();
          }
        }

        var isUpdate = $(el).closest($scrollContainer).length > 0;
        //console.log(el);
        if (!isResizer) {
          if (!$(el).is(options.dragSelector)) {
            //如果不是拖拽元素则不能进行拖拽
            if ($(el).is(cancelSeletor)) {
              //不允许拖拽则返回
              return false;
            }
            var $el = $(el).closest(options.dragSelector);
            if ($el && $el.length) {
              el = $el[0];
            } else {
              return false;
            }
          }
        } else {
          el = $(el).closest(options.dragSelector)[0];
        }
        if ($(el).is(cancelSeletor)) {
          return false;
        }
        if ($(el).is(operationSelector) && isUpdate) {
          //判断是否是操作层 在拖拽
          el = $("#" + el.getAttribute("control-abs-id"))[0]; //指定拖拽对应的目标元素
        }

        var dragStatus = el.getAttribute("drag-status");
        if (dragStatus == "dragging") {
          return false;
        }
        el.setAttribute("drag-status", "down");
        if (!isOnlyDrag4Table && !isResizer) {
          //拖拽改变位置的状态下，并且不是拖拽按钮上则获取最外层是否是编辑状态，进行区域选择
          if ($(el).hasClass("drag-select-area")) {
            isSelectArea = true;
          }
        }
        //cfg :{resizeRowIndex,resizeColumnIndex,isResizer,e,el,isUpdate}

        if (resizerEl) {
          if (isResizerRow) {
            if (resizeRowIndex >= 0 && resizeRowIndex < lineRowLength) {
              if (resizeRowIndex > 0) {
                //第一个不做处理
                var $resizerRowPrev = $(resizerEl).prev(".line-row-resizer");
                if ($resizerRowPrev && $resizerRowPrev.length) {
                  fromResizeTop = Number(
                    $resizerRowPrev.css("top").replace("px", "") || "0"
                  );
                  fromResizeTop += $resizerRowPrev.outerHeight();
                }
              }

              if (resizeRowIndex != lineRowLength - 1) {
                //最后一个不做处理
                var $resizerRowNext = $(resizerEl).next(".line-row-resizer");
                if ($resizerRowNext && $resizerRowNext.length) {
                  toResizeTop = Number(
                    $resizerRowNext.css("top").replace("px", "") || "0"
                  );
                  toResizeTop -= $resizerRowNext.outerHeight();
                }
              }
            }
          }
          if (isResizerColumn) {
            if (
              resizeColumnIndex >= 0 &&
              resizeColumnIndex < lineColumnLength
            ) {
              if (resizeColumnIndex > 0) {
                //第一个不处理
                var $resizerColumnPrev = $(resizerEl).prev(
                  ".line-column-resizer"
                );
                if ($resizerColumnPrev && $resizerColumnPrev.length) {
                  fromResizeLeft = Number(
                    $resizerColumnPrev.css("left").replace("px", "") || "0"
                  );
                  fromResizeLeft += $resizerColumnPrev.outerWidth();
                }
              }

              if (resizeColumnIndex != lineColumnLength - 1) {
                //最后一个不处理
                var $resizerColumnNext = $(resizerEl).next(
                  ".line-column-resizer"
                );
                if ($resizerColumnNext && $resizerColumnNext.length) {
                  toResizeLeft = Number(
                    $resizerColumnNext.css("left").replace("px", "") || "0"
                  );
                  toResizeLeft -= $resizerColumnNext.outerWidth();
                }
              }
            }
          }
        }
        var dragCfg = me.dragCfg;
        if (!dragCfg) {
          me.dragCfg = {
            e: e,
            el: el,
            isUpdate: isUpdate,
            isResizer: isResizer,
            isSelectArea: isSelectArea,
            startSelectColumnIndex: startSelectColumnIndex,
            startSelectRowIndex: startSelectRowIndex,
            isSelectColumn: isSelectColumn,
            isSelectRow: isSelectRow,
            resizeRowIndex: resizeRowIndex,
            resizeColumnIndex: resizeColumnIndex,
            isResizerRow: isResizerRow,
            isResizerColumn: isResizerColumn,

            dropPos: dropPos,
            scrollContainerLeft: scrollContainerLeft,
            scrollContainerTop: scrollContainerTop,
            $proxyDrag: $proxyDrag,
            $proxyPlaceholder: $proxyPlaceholder,
          };
          dragCfg = me.dragCfg;
        } else {
          dragCfg.e = e;
          dragCfg.el = el;
          dragCfg.isUpdate = isUpdate;
          dragCfg.isResizer = isResizer;
          dragCfg.isSelectArea = isSelectArea;

          dragCfg.startSelectColumnIndex = startSelectColumnIndex;
          dragCfg.startSelectRowIndex = startSelectRowIndex;
          dragCfg.isSelectColumn = isSelectColumn;
          dragCfg.isSelectRow = isSelectRow;

          dragCfg.resizeRowIndex = resizeRowIndex;
          dragCfg.resizeColumnIndex = resizeColumnIndex;
          dragCfg.isResizerRow = isResizerRow;
          dragCfg.isResizerColumn = isResizerColumn;
          dragCfg.dropPos = dropPos;
          dragCfg.scrollContainerLeft = scrollContainerLeft;
          dragCfg.scrollContainerTop = scrollContainerTop;
          dragCfg.$proxyDrag = $proxyDrag;

          dragCfg.$proxyPlaceholder = $proxyPlaceholder;
        }
        var flag = options.down && options.down(me.dragCfg);
        if (typeof flag == "boolean") {
          if (!flag) {
            $body.removeClass("design-pointer-events");
            if (e.target.releaseCapture) {
              e.target.releaseCapture();
            }
            return false;
          }
        }
        var moveFun = function(ev) {
          var ev = ev || event;

          var dragStatus = el.getAttribute("drag-status");

          //console.log($(ev.target).closest('.control-abs-component')[0]&&$(ev.target).closest('.control-abs-component')[0].id);
          options.move && options.move(dragCfg);
          if (dragStatus == "down") {
            dragStatus = "start";
            el.setAttribute("drag-status", dragStatus);
            var dragStart = options.dragStart;
            if (dragStart) {
              dragCfg.e = ev;
              var flag = dragStart(dragCfg);
              if (typeof flag == "boolean") {
                if (!flag) {
                  dragStatus = "";
                  el.setAttribute("drag-status", "");
                  return;
                }
              }
            }
            return;
          }
          if (dragStatus == "start" || dragStatus == "dragging") {
            var isStart = dragStatus == "start";
            if (dragStatus == "start") {
              dropPos = getElementPositionXY($dropContainer[0]);
              scrollElPos = getElementPositionXY($scrollContainer[0]);
              dropPos.width = $dropContainer.width();
              dropPos.height = $dropContainer.height();
              $proxyDrag.addClass("proxy-dragging");

              $movingLayout.show();
              if (isResizer) {
                $proxyDrag.addClass("proxy-dragging-resize");
              } else {
                $proxyDrag.removeClass("proxy-dragging-resize");
              }
              if (isSelectArea) {
                $proxyDrag.addClass("proxy-dragging-select-area");
              } else {
                $proxyDrag.removeClass("proxy-dragging-select-area");
              }
              $proxyDrag[0].style.position = "absolute";
              $proxyDrag[0].style.zIndex = 1000;
              $proxyDrag.attr("tabindex", 0);
              $proxyDrag.focus();
              dragStatus = "dragging";
              el.setAttribute("drag-status", dragStatus);
              var width, height;
              if (!isUpdate) {
                var currField = me.getElConfigByKeys(
                  el,
                  me.controlProps,
                  me.controlDomAttrPrefix
                );
                 
                
                width = currField.style && currField.style.width;
                height = currField.style && currField.style.height;
                width = width || 230;
                height = height || 42;
              } else {
                width = $(el).outerWidth();
                height = $(el).outerHeight();
              }
        

              $proxyDrag.width(width);
              $proxyDrag.height(height);
              var elPos = getElementPositionXY(el);
              if (!isUpdate) {
                //新建时的拖拽 ，需要剔除新建区域 滚动条滚动位置
                if (oui.isInDom(el, $dragScrollContainer[0])) {
                  elPos.x -= $dragScrollContainer[0].scrollLeft;
                  elPos.y -= $dragScrollContainer[0].scrollTop;
                }
              }
              var startResizeLeft = 0;
              var startResizeTop = 0;
              if (resizerEl) {
                try {
                  startResizeTop = Number(
                    $(resizerEl)
                      .css("top")
                      .replace("px", "") || "0"
                  );
                } catch (err) {
                  startResizeTop = 0;
                }

                try {
                  startResizeLeft = Number(
                    $(resizerEl)
                      .css("left")
                      .replace("px", "") || "0"
                  );
                } catch (err) {
                  startResizeLeft = 0;
                }
                if (isResizerColumn || isResizerRow) {
                  $(resizerEl).addClass("line-dragging");
                  if (
                    resizeColumnIndex == 0 ||
                    resizeColumnIndex == lineColumnLength - 1 ||
                    resizeRowIndex == 0 ||
                    resizeRowIndex == lineRowLength - 1
                  ) {
                    //改变 大小
                    $proxyDrag.removeClass("proxy-dragging-change-cell");
                  } else {
                    //改变 单元格 间距
                    $proxyDrag.addClass("proxy-dragging-change-cell");
                  }
                } else {
                  $(resizerEl).removeClass("line-dragging");
                  $proxyDrag.removeClass("proxy-dragging-change-cell");
                }
              } else {
                $proxyDrag.removeClass("proxy-dragging-change-cell");
              }

              if (!me.dragData) {
                me.dragData = {
                  startWidth: width,
                  startHeight: height,
                  width: width,
                  height: height,
                  elPos: elPos,
                  dropPos: dropPos,
                  startX: elPos.x - dropPos.x,
                  startY: elPos.y - dropPos.y,
                  startMouseX: startMouseX,
                  startMouseY: startMouseY,
                  startSelectColumnIndex: startSelectColumnIndex,
                  startSelectRowIndex: startSelectRowIndex,
                  /**拖拽线条 调整 宽高 ****/
                  startResizeLeft: startResizeLeft,
                  startResizeTop: startResizeTop,
                  resizeRowIndex: resizeRowIndex,
                  resizeColumnIndex: resizeColumnIndex,
                  lineColumnLength: lineColumnLength,
                  lineRowLength: lineRowLength,
                  fromResizeLeft: fromResizeLeft,
                  toResizeLeft: toResizeLeft,
                  fromResizeTop: fromResizeTop,
                  toResizeTop: toResizeTop,
                  lineWidth: lineWidth,
                  scrollContainerLeft: scrollContainerLeft,
                  scrollContainerTop: scrollContainerTop,
                  resizerEl: resizerEl,
                };
              } else {
                var dragData = me.dragData;
                dragData.startWidth = width;
                dragData.startHeight = height;
                dragData.width = width;
                dragData.height = height;
                dragData.elPos = elPos;
                dragData.dropPos = dropPos;
                dragData.startX = elPos.x - dropPos.x;
                dragData.startY = elPos.y - dropPos.y;
                dragData.startMouseX = startMouseX;
                dragData.startMouseY = startMouseY;

                dragData.startSelectColumnIndex = startSelectColumnIndex;
                dragData.startSelectRowIndex = startSelectRowIndex;
                dragData.startResizeLeft = startResizeLeft;
                dragData.startResizeTop = startResizeTop;
                dragData.resizeRowIndex = resizeRowIndex;
                dragData.resizeColumnIndex = resizeColumnIndex;
                dragData.lineColumnLength = lineColumnLength;
                dragData.lineRowLength = lineRowLength;
                dragData.fromResizeLeft = fromResizeLeft;
                dragData.toResizeLeft = toResizeLeft;
                dragData.fromResizeTop = fromResizeTop;
                dragData.toResizeTop = toResizeTop;
                dragData.lineWidth = lineWidth;
                dragData.scrollContainerLeft = scrollContainerLeft;
                dragData.scrollContainerTop = scrollContainerTop;
                dragData.resizerEl = resizerEl;
              }

              //var $canvas_box = $('#canvas_box');
              //if($canvas_box.length>0){
              //    $body.addClass('design-pointer-events');
              //    $canvas_box.show();
              //}
            }
            var dragData = me.dragData;
            if (!dragData) {
              dragData = {};
              me.dragData = dragData;
            }
            var left, top;
            var currPos = getXY(ev);
            dragData.mouseX = currPos.x;
            dragData.mouseY = currPos.y;

            dragData.mouseX4relative =
              currPos.x + scrollContainerLeft - dropPos.x;
            dragData.mouseY4relative =
              currPos.y + scrollContainerTop - dropPos.y;
            if (isStart) {
              left = dragData.startX;
              top = dragData.startY;
            } else {
              left = dragData.startX + currPos.x - dragData.startMouseX; // Math.round((currPos.x- dragData.startMouseX)/2)*2 ;
              top = dragData.startY + currPos.y - dragData.startMouseY; // Math.round((currPos.y-dragData.startMouseY)/2)*2;

              left += scrollContainerLeft;
              top += scrollContainerTop;
              if (isUpdate) {
                //判断当前事件的元素 是否在指定元素范围内
                left -= scrollContainerLeft;
                top -= scrollContainerTop;
              }
            }
            var w = $proxyDrag.width();
            var h = $proxyDrag.height();

            /** 拖拽位置处理****/
            if (!isResizer && !isSelectArea) {
              if (isUpdate) {
                if (left < 0) {
                  left = 0;
                }
                if (top < 0) {
                  top = 0;
                }
                if (left + w > dropPos.width) {
                  left = dropPos.width - w;
                }
                if (top + h > dropPos.height) {
                  top = dropPos.height - h;
                }
              } else {
                if (left < dragArea.left - dropPos.x) {
                  left = dragArea.left - dropPos.x;
                }
                if (top < dragArea.top - dropPos.y) {
                  top = dragArea.top - dropPos.y;
                }
                if (left + w > dropPos.width) {
                  left = dropPos.width - w;
                }
                if (top + h > dropPos.height) {
                  top = dropPos.height - h;
                }
              }
              dragData.x = left;
              dragData.y = top;
            } else {
              if ((isResizerRow || isResizerColumn) && resizerEl) {
                if (isResizerRow) {
                  //改变行高
                  //拖拽改变行高的线
                  dragData.resizeTop =
                    top - dragData.startY + dragData.startResizeTop;

                  if (dragData.resizeTop < dragData.fromResizeTop) {
                    dragData.resizeTop = dragData.fromResizeTop;
                  }

                  if (dragData.resizeTop > dragData.toResizeTop) {
                    dragData.resizeTop = dragData.toResizeTop;
                  }
                  if (dragData.resizeTop + dragData.startY < 0) {
                    dragData.resizeTop = 0 - dragData.startY;
                  }
                  if (
                    dragData.resizeTop + dragData.startY >
                    dragData.dropPos.height
                  ) {
                    dragData.resizeTop =
                      dragData.dropPos.height -
                      dragData.startY -
                      dragData.lineWidth;
                  }

                  $(resizerEl).css("top", dragData.resizeTop + "px");

                  var resizeFix = dragData.resizeTop - dragData.startResizeTop;

                  //改变高度
                  if (
                    resizeRowIndex == 0 ||
                    resizeRowIndex == dragData.lineRowLength - 1
                  ) {
                    //改变 高度
                    if (resizeRowIndex == 0) {
                      /** 行高调整和位置调整****/
                      if (dragData.startHeight - resizeFix < 34) {
                        resizeFix = dragData.startHeight - 34;
                      }
                      if (dragData.startY + resizeFix < 0) {
                        resizeFix = -dragData.startY;
                      }
                      dragData.resizeHeight = dragData.startHeight - resizeFix;
                      dragData.resizeY = dragData.startY + resizeFix;
                    } else {
                      /** 调整高度即可***/
                      if (dragData.startHeight + resizeFix < 34) {
                        dragData.resizeHeight = 34 - resizeFix;
                      } else {
                        dragData.resizeHeight =
                          dragData.startHeight + resizeFix;
                      }
                      if (
                        dragData.resizeHeight + dragData.startY >
                        dropPos.height
                      ) {
                        dragData.resizeHeight =
                          dropPos.height - dragData.startY;
                      }
                    }
                  }
                } else {
                  //改变列宽
                  //拖拽改变行高的线
                  dragData.resizeLeft =
                    left - dragData.startX + dragData.startResizeLeft;
                  if (dragData.resizeLeft < dragData.fromResizeLeft) {
                    dragData.resizeLeft = dragData.fromResizeLeft;
                  }
                  if (dragData.resizeLeft > dragData.toResizeLeft) {
                    dragData.resizeLeft = dragData.toResizeLeft;
                  }
                  if (dragData.resizeLeft + dragData.startX < 0) {
                    dragData.resizeLeft = 0 - dragData.startX;
                  }
                  if (
                    dragData.resizeLeft + dragData.startX >
                    dragData.dropPos.width
                  ) {
                    dragData.resizeLeft =
                      dragData.dropPos.width - dragData.startX;
                  }
                  $(resizerEl).css("left", dragData.resizeLeft + "px");
                  var resizeFix =
                    dragData.resizeLeft - dragData.startResizeLeft;

                  //改变宽度
                  if (
                    resizeColumnIndex == 0 ||
                    resizeColumnIndex == dragData.lineColumnLength - 1
                  ) {
                    if (resizeColumnIndex == 0) {
                      /** 列宽调整****/
                      if (dragData.startWidth - resizeFix < 34) {
                        resizeFix = dragData.startWidth - 34;
                      }
                      if (dragData.startX + resizeFix < 0) {
                        resizeFix = -dragData.startX;
                      }
                      dragData.resizeWidth = dragData.startWidth - resizeFix;
                      dragData.resizeX = dragData.startX + resizeFix;
                    } else {
                      /** 调整宽度即可***/
                      if (dragData.startWidth + resizeFix < 34) {
                        dragData.resizeWidth = 34 - resizeFix;
                      } else {
                        dragData.resizeWidth = dragData.startWidth + resizeFix;
                      }
                      if (
                        dragData.resizeWidth + dragData.startX >
                        dropPos.width
                      ) {
                        dragData.resizeWidth = dropPos.width - dragData.startX;
                      }
                    }
                  }
                }
              } else if (isSelectArea) {
                dragData.x = dragData.startX;
                dragData.y = dragData.startY;
              } else {
                //宽度调整
                /*** 拖拽高宽处理****/
                var newWidth = left - dragData.startX + dragData.startWidth;
                var newHeight = top - dragData.startY + dragData.startHeight;
                if (newWidth + dragData.startX > dropPos.width) {
                  newWidth = dropPos.width - dragData.startX;
                }
                if (newHeight + dragData.startY > dropPos.height) {
                  newHeight = dropPos.height - dragData.startY;
                }
                dragData.width = newWidth;
                dragData.height = newHeight;
                if (dragData.width < 34) {
                  dragData.width = 34;
                }
                if (dragData.height < 34) {
                  dragData.height = 34;
                }
                if (dragData.x < 0) {
                  dragData.x = 0;
                }
                if (dragData.y < 0) {
                  dragData.y = 0;
                }
                if (dragData.width + dragData.x > dropPos.width) {
                  dragData.width = dropPos.width - dragData.x;
                }
                if (dragData.height + dragData.y > dropPos.height) {
                  dragData.height = dropPos.height - dragData.y;
                }
              }
              dragData.x = dragData.startX;
              dragData.y = dragData.startY;
              if (dragData.x < 0) {
                dragData.x = 0;
              }
              if (dragData.y < 0) {
                dragData.y = 0;
              }
            }
            var resizeCfg = {
              left: dragData.x,
              top: dragData.y,
              width: dragData.width,
              height: dragData.height,
            };
            if (isResizerColumn) {
              if (
                resizeColumnIndex == 0 ||
                resizeColumnIndex == lineColumnLength - 1
              ) {
                if (resizeColumnIndex == 0) {
                  resizeCfg.left = dragData.resizeX;
                }
                resizeCfg.width = dragData.resizeWidth;
              }
            } else if (isResizerRow) {
              if (resizeRowIndex == 0 || resizeRowIndex == lineRowLength - 1) {
                if (resizeRowIndex == 0) {
                  resizeCfg.top = dragData.resizeY;
                }
                resizeCfg.height = dragData.resizeHeight;
              }
            }
            //$proxyDrag[0].style.left = (resizeCfg.left - scrollContainerLeft + dropPos.x) + 'px';//拖拽代理层 位置需要追加相对拖拽区域的相对位置
            //$proxyDrag[0].style.top = (resizeCfg.top - scrollContainerTop + dropPos.y) + 'px';//拖拽代理层 位置需要追加相对拖拽区域的相对位置
            //$proxyDrag[0].style.width = (resizeCfg.width) + 'px';
            //$proxyDrag[0].style.height = (resizeCfg.height) + 'px';
            //if($proxyDrag[0].style.display !='block'){
            //    $proxyDrag[0].style.display = 'block';
            //}
            $proxyDrag.css({
              left: resizeCfg.left - scrollContainerLeft + dropPos.x + "px",
              top: resizeCfg.top - scrollContainerTop + dropPos.y + "px",
              width: resizeCfg.width + "px",
              height: resizeCfg.height + "px",
              display: "block",
            });
            var dragging = options.dragging;
            dragCfg.dragData = dragData;
            dragging && dragging(dragCfg);
            return;
          }
        };
        var moveHandler = function(ev) {
          //document.onmousemove=null;
          moveFun(ev);
          //document.onmousemove=null;
          //$doc.timer4move = setTimeout(function(){
          //    document.onmousemove = moveHandler;
          //},40);
          return false;
        };
        //document.onmousemove = moveHandler;

        var moveTimer = function() {
          document.onmousemove = function(e) {
            moveHandler.call(this, e);
            document.onmousemove = null;
            if (me.timer4move) {
              try {
                clearTimeout(me.timer4move);
                me.timer4move = null;
              } catch (err) {}
            }
            me.timer4move = window.setTimeout(function() {
              moveTimer();
              me.timer4move = null;
            }, 30); //16.7
            //if(window.requestAnimationFrame){
            //    if(me.timer4move){
            //        try{
            //            cancelAnimationFrame(me.timer4move);
            //            me.timer4move = null;
            //        }catch(err){}
            //    }
            //    me.timer4move = window.requestAnimationFrame(function(){
            //        moveTimer();
            //        me.timer4move = null;
            //    });
            //}else{
            //    if(me.timer4move){
            //        try{
            //            clearTimeout(me.timer4move);
            //            me.timer4move = null;
            //        }catch(err){}
            //    }
            //    me.timer4move = window.setTimeout(function(){
            //        moveTimer();
            //        me.timer4move = null;
            //    },16.7);
            //}
          };
        };
        moveTimer();
        /** mousemove 性能优化 调整****/

        //$doc.on('mousemove','body',moveHandler);
        var mouseup = function(ev) {
          //$doc.off('mousemove','body',moveHandler);
          //$doc.off('mouseup','body',mouseup);
          document.onmousemove = null;
          document.onmouseup = null;
          if (e.button == 1) {
            //左键
          } else if (e.button == 2) {
            //右键
            return false;
          }
          if (ev.target.releaseCapture) {
            ev.target.releaseCapture();
          }
          if (me.timer4move) {
            //if(window.requestAnimationFrame){
            //    try{
            //        cancelAnimationFrame(me.timer4move);
            //        me.timer4move = null;
            //    }catch(err){}
            //}else{
            //    try{
            //        clearTimeout(me.timer4move);
            //        me.timer4move = null;
            //    }catch(err){}
            //}
            try {
              clearTimeout(me.timer4move);
              me.timer4move = null;
            } catch (err) {}
          }
          var dragStatus = el.getAttribute("drag-status");
          dragCfg.e = ev;
          if (dragStatus == "dragging") {
            $proxyDrag.removeClass("proxy-dragging");
            $movingLayout.hide();
            $proxyPlaceholder.hide();
            $body.removeClass("design-pointer-events");
            if (isResizer) {
              $proxyDrag.removeClass("proxy-dragging-resize");
              if (isResizerColumn || isResizerRow) {
                $(resizerEl).removeClass("line-dragging");
              }
            }
            dragStatus = "end";
            el.setAttribute("drag-status", dragStatus);
            var dragEnd = options.dragEnd;

            dragEnd && dragEnd(dragCfg);
            el.setAttribute("drag-status", "");
            $proxyDrag.hide();
          }
          options.up && options.up(dragCfg);
          me.dragData = null;
          me.dragCfg = null;
          if ($proxyDrag[0].releaseCapture) {
            $proxyDrag[0].releaseCapture();
          }
          //setTimeout(function(){
          //    var canvas = document.createElement("canvas");
          //    canvas.width = $dropContainer[0].scrollWidth*2;
          //    canvas.height = $dropContainer[0].scrollHeight*2;
          //    canvas.style.width = $dropContainer[0].scrollWidth*2 + "px";
          //    canvas.style.height = $dropContainer[0].scrollHeight*2 + "px";
          //    var context = canvas.getContext("2d");//然后将画布缩放，将图像放大两倍画到画布上
          //    html2canvas($scrollContainer[0],{ canvas: canvas,width:canvas.width,height:canvas.height}).then(function(canvas) {
          //        $('#canvas_box').remove();
          //        var html='<div id="canvas_box" style="display:none;" class="paper-area-canvas" style="width:'+$dropContainer[0].scrollWidth+'px;height:'+$dropContainer[0].scrollHeight+'px"></div>';
          //        $dropContainer.after(html);
          //        $('#canvas_box').append(canvas);
          //        var $canvas = $('#canvas_box').find('canvas');
          //        $('#canvas_box').css({
          //            position:'absolute',
          //            left:(dropPos.x-scrollElPos.x),
          //            top:(dropPos.y-scrollElPos.y)
          //        });
          //        $canvas.css({
          //            position:'absolute',
          //            left:-(dropPos.x-scrollElPos.x-$('.ruler-left').width()/2+2),
          //            top:-(dropPos.y-scrollElPos.y)
          //        });
          //        //$scrollContainer[0].scrollLeft = scrollContainerLeft;
          //        //$scrollContainer[0].scrollTop = scrollContainerTop;
          //    });
          //});
          return false;
        };
        document.onmouseup = mouseup;
        //$doc.on('mouseup','body',mouseup);
        return false; //阻止默认行为
      });
    },
    /** 获取表格的合并单元格列表*****/
    findMergeCellsMapByTableLine: function(tableLine) {
      var mergeCellsMap = tableLine.style.mergeCellsMap || {};
      return mergeCellsMap;
    },
    /*** 添加合并单元格s***/
    addMergeCell: function(tableLine, mergeCell) {
      var mergeCellsMap = tableLine.style.mergeCellsMap;
      if (!mergeCellsMap) {
        mergeCellsMap = {};
        tableLine.style.mergeCellsMap = mergeCellsMap;
      }
      var startColumnIndex = mergeCell.startColumnIndex;
      var startRowIndex = mergeCell.startRowIndex;
      var endColumnIndex = mergeCell.endColumnIndex;
      var endRowIndex = mergeCell.endRowIndex;

      if (startColumnIndex > endColumnIndex) {
        startColumnIndex = endColumnIndex;
      }
      if (startRowIndex > endRowIndex) {
        startRowIndex = endRowIndex;
      }
      mergeCellsMap[startColumnIndex + "_" + startRowIndex] = mergeCell;
    },
    removeMergeCellsByCellIndex: function(
      tableLine,
      startColumnIndex,
      startRowIndex,
      endColumnIndex,
      endRowIndex
    ) {
      var me = this;
      var mergeCells = me.findMergeCellsByCellIndex(
        tableLine,
        startColumnIndex,
        startRowIndex,
        endColumnIndex,
        endRowIndex
      );
      if (mergeCells && mergeCells.length) {
        for (var i = 0, len = mergeCells.length; i < len; i++) {
          me.removeMergeCell(tableLine, mergeCells[i]);
        }
      }
    },
    /** 根据 单元格索引位置 判断是否在 合并单元格列表中并返回对应的合并单元格****/
    findMergeCellsByCellIndex4Inner: function(
      tableLine,
      startColumnIndex,
      startRowIndex,
      endColumnIndex,
      endRowIndex
    ) {
      var me = this;
      var arr = [];
      var mergeCellsMap = tableLine.style.mergeCellsMap;
      if (!mergeCellsMap) {
        return arr;
      }
      for (var key in mergeCellsMap) {
        var tempKeys = key.split("_");
        var sc = parseInt(tempKeys[0]);
        var sr = parseInt(tempKeys[1]);
        var ec = mergeCellsMap[key].endColumnIndex;
        var er = mergeCellsMap[key].endRowIndex;
        // 区间内任意一个格子 在 合并单元格中，则返回合并单元格
        inner: for (
          var currSC = startColumnIndex;
          currSC <= endColumnIndex;
          currSC++
        ) {
          for (var currSR = startRowIndex; currSR <= endRowIndex; currSR++) {
            if (currSC >= sc && currSC <= ec && currSR >= sr && currSR <= er) {
              arr.push(mergeCellsMap[key]);
              break inner;
            }
          }
        }
      }
      return arr;
    },
    /** 在指定区域内找出所有 的合并单元格*****/
    findMergeCellsByCellIndex: function(
      tableLine,
      startColumnIndex,
      startRowIndex,
      endColumnIndex,
      endRowIndex
    ) {
      var me = this;
      var arr = [];
      var mergeCellsMap = tableLine.style.mergeCellsMap;
      if (!mergeCellsMap) {
        return arr;
      }
      for (var key in mergeCellsMap) {
        var tempKeys = key.split("_");
        var sc = parseInt(tempKeys[0]);
        var sr = parseInt(tempKeys[1]);
        var ec = mergeCellsMap[key].endColumnIndex;
        var er = mergeCellsMap[key].endRowIndex;
        //开始位置大于区域开始位置，结束位置小于区域结束位置，则在区域内
        if (
          sc >= startColumnIndex &&
          ec <= endColumnIndex &&
          sr >= startRowIndex &&
          er <= endRowIndex
        ) {
          arr.push(mergeCellsMap[key]);
        }
      }
      return arr;
    },
    /** 删除 合并单元格****/
    removeMergeCell: function(tableLine, mergeCell) {
      var mergeCellsMap = tableLine.style.mergeCellsMap;
      if (!mergeCellsMap) {
        return;
      }
      var startColumnIndex = mergeCell.startColumnIndex;
      var startRowIndex = mergeCell.startRowIndex;
      mergeCellsMap[startColumnIndex + "_" + startRowIndex] = null;
      delete mergeCellsMap[startColumnIndex + "_" + startRowIndex];
    },
    /** 根据 开始结束位置 获取 控件列表 ****/
    findRectsInTableLineByCellIndex: function(
      tableLine,
      startColumnIndex,
      startRowIndex,
      endColumnIndex,
      endRowIndex
    ) {
      var me = this;
      var arr = [];
      /*** 行列遍历***/
      for (var c = startColumnIndex; c <= endColumnIndex; c++) {
        for (var r = startRowIndex; r <= endRowIndex; r++) {
          var curr = me.findRectInTableLineByColumnAndRow(tableLine, c, r);
          if (curr && curr.controlId) {
            arr.push(curr);
          }
        }
      }
      return arr;
    },
    /*** 找出单元格的跨列信息****/
    findCellColspan: function(tableLine, columnLineIndex, lineIndex) {
      var mergeCellsMap = tableLine.style.mergeCellsMap || {};
      var cell = mergeCellsMap[columnLineIndex + "_" + lineIndex];
      var colspan = 1;
      if (cell) {
        colspan = cell.endColumnIndex - cell.startColumnIndex + 1;
      }
      return colspan;
    },
    /*** 找出单元格的跨行信息****/
    findCellRowspan: function(tableLine, columnLineIndex, lineIndex) {
      var mergeCellsMap = tableLine.style.mergeCellsMap || {};
      var cell = mergeCellsMap[columnLineIndex + "_" + lineIndex];
      var rowspan = 1;
      if (cell) {
        rowspan = cell.endRowIndex - cell.startRowIndex + 1;
      }
      return rowspan;
    },
    /*** 判断 单元格中是否存在控件 *****/
    hasControlInTableCell: function(tableLine, columnLineIndex, lineIndex) {
      var flag = false;
      var cellsMap = tableLine.style.cellsMap || {};
      if (cellsMap[columnLineIndex + "_" + lineIndex]) {
        flag = true;
      }
      return flag;
    },
    inDetail: function(control) {
      var me = this;
      var flag = false;
      if (
        control.style &&
        control.style.rect &&
        control.style.rect.tableLineId
      ) {
        var tableLine = me.findTableLineControl(control.style.rect.tableLineId);
        if (tableLine && tableLine.controlType == "detail") {
          flag = true;
        }
      }
      return flag;
    },
    /****
     * 判断控件是否在明细表最后一行，需要单独处理
     * @param control
     */
    inDetailEndRow: function(control) {
      var me = this;
      var flag = false;
      if (
        control.style &&
        control.style.rect &&
        control.style.rect.tableLineId
      ) {
        var tableLine = me.findTableLineControl(control.style.rect.tableLineId);
        if (tableLine && tableLine.controlType == "detail") {
          var rowIndex = control.style.rect.rowIndex;
          var rowLength = tableLine.style.rowLines.length - 1;
          if (rowIndex == rowLength - 1) {
            flag = true;
          }
        }
      }
      return flag;
    },
    findControlInTableCell: function(tableLine, columnLineIndex, lineIndex) {
      var me = this;
      var cellsMap = tableLine.style.cellsMap || {};
      var control = null;
      if (cellsMap[columnLineIndex + "_" + lineIndex]) {
        var controlId = cellsMap[columnLineIndex + "_" + lineIndex].controlId;
        if (!controlId) {
          return control;
        }
        control = me.getControlById(controlId);
        //处理控件在单元格字段值样式
        me.findFieldStyle4Dom(control);
        me.findStyleFieldOuter4Dom(control);
        return control;
      }
      return control;
    },

    getClientType: function(clientType) {
      return oui.util.getClientType(clientType);
    },
    /****
     * 获取控件的渲染数据
     * @param controlId
     * @returns {{}}
     */
    getControlRenderDataById: function(controlId) {
      var me = this;
      var data = {};
      //获取控件的渲染数据
      var control = me.getControlById(controlId);
      if (control) {
        data.showType = control.showType;
        data.control = control;
        data.style = me.findFieldStyle4Dom(control);
        data.cls = "control-field-value-abs";
        data.id = "field-" + control.id;
        data.title = control.name;
        data.otherAttrs = control.otherAttrs || {};
        var placeholder =
          control.placeholder ||
          (control.otherAttrs && control.otherAttrs.placeholder) ||
          "";
        if (placeholder) {
          data.placeholder = placeholder;
        }
      }
      return data;
    },
    getView: function() {
      if (!this.refs) {
        this.refs = {};
      }
      return this;
    },
    /** 找出明细表中,最后行的所有列单元格信息*****/
    findCells4Detail: function(detailTable) {
      var me = this;
      var cells = [];
      var resultMap = {};
      var columnLines = detailTable.style.columnLines || [];
      var rowLines = detailTable.style.rowLines || [];
      var rowIndex = rowLines.length - 2; //获取最后行的列信息
      for (var i = 0, len = columnLines.length - 1; i < len; i++) {
        var cell = me.findTableCell(detailTable, i, rowIndex);
        if (!resultMap[cell.columnIndex + "_" + cell.rowIndex]) {
          resultMap[cell.columnIndex + "_" + cell.rowIndex] = cell;
          cells.push(cell);
        }
      }
      resultMap = null;
      delete resultMap;
      return cells;
    },
    /** 找出指定 行列索引对应的 单元格*****/
    findTableCell: function(tableLine, columnLineIndex, lineIndex) {
      var result = {
        columnIndex: columnLineIndex,
        rowIndex: lineIndex,
      };
      var cellsMap = tableLine.style.cellsMap || {};
      if (cellsMap[columnLineIndex + "_" + lineIndex]) {
        return result;
      }
      var mergeCellsMap = tableLine.style.mergeCellsMap;
      /** 在合并单元格中 判断是否被合并单元格包含****/
      if (mergeCellsMap) {
        for (var key in mergeCellsMap) {
          var cell = mergeCellsMap[key];
          if (!cell) {
            continue;
          }
          /** 找到合并单元格行列索引位置 直接 返回，存在****/
          if (
            cell.startColumnIndex == columnLineIndex &&
            cell.startRowIndex == lineIndex
          ) {
            result.columnIndex = cell.startColumnIndex;
            result.rowIndex = cell.startRowIndex;
            break;
          }
          /** 找到合并单元格，并且 被合并单元格包含，则 返回不存在*****/
          if (
            columnLineIndex >= cell.startColumnIndex &&
            columnLineIndex <= cell.endColumnIndex
          ) {
            if (
              lineIndex >= cell.startRowIndex &&
              lineIndex <= cell.endRowIndex
            ) {
              result.columnIndex = cell.startColumnIndex;
              result.rowIndex = cell.startRowIndex;
              break;
            }
          }
          //继续循环判断,如果遍历完都没有找到 则说明单元格存在
        }
      }
      return result;
    },
    /***
     * 判断 table中是否存在某个td单元格
     *
     * 如果被合并单元格包含，并且不是合并单元格的行列索引位置，则说明 单元格不存在
     * @param tableLine
     * @param columnLineIndex
     * @param lineIndex
     */
    hasTableCell: function(tableLine, columnLineIndex, lineIndex) {
      //先判断是否存在控件单元格，存在 则直接返回
      var flag = true;
      var cellsMap = tableLine.style.cellsMap || {};
      if (cellsMap[columnLineIndex + "_" + lineIndex]) {
        return flag;
      }
      var mergeCellsMap = tableLine.style.mergeCellsMap;
      /** 在合并单元格中 判断是否被合并单元格包含****/
      if (mergeCellsMap) {
        for (var key in mergeCellsMap) {
          var cell = mergeCellsMap[key];
          if (!cell) {
            continue;
          }
          /** 找到合并单元格行列索引位置 直接 返回，存在****/
          if (
            cell.startColumnIndex == columnLineIndex &&
            cell.startRowIndex == lineIndex
          ) {
            flag = true;
            break;
          }
          /** 找到合并单元格，并且 被合并单元格包含，则 返回不存在*****/
          if (
            columnLineIndex >= cell.startColumnIndex &&
            columnLineIndex <= cell.endColumnIndex
          ) {
            if (
              lineIndex >= cell.startRowIndex &&
              lineIndex <= cell.endRowIndex
            ) {
              flag = false;
              break;
            }
          }
          //继续循环判断,如果遍历完都没有找到 则说明单元格存在
        }
        return flag;
      }
      return flag;
    },
    /** 获取某列位置****/
    findColumnPos: function(tableLine, columnIndex, key) {
      var left = tableLine.style.columnLines[columnIndex].fromPos.left;
      var right = tableLine.style.columnLines[columnIndex + 1].fromPos.left;
      var width = right - left + AbsoluteDesign.operationAreaOffset / 2;
      var leftBorderWidth =
        tableLine.style.columnLines[columnIndex].config.lineHeight;
      var rightBorderWidth =
        tableLine.style.columnLines[columnIndex + 1].config.lineHeight;
      var borderLeftColor =
        tableLine.style.columnLines[columnIndex].config.color;
      var borderRightColor =
        tableLine.style.columnLines[columnIndex + 1].config.color;
      var columnLength = tableLine.style.columnLines.length;

      var pos = {
        left: left,
        width: width,
        borderLeftWidth: leftBorderWidth,
        borderLeftColor: borderLeftColor,
        borderRightColor: borderRightColor,
        borderLeftStyle:
          tableLine.style.columnLines[columnIndex].config.borderStyle ||
          "solid",
        borderRightStyle:
          tableLine.style.columnLines[columnIndex + 1].config.borderStyle ||
          "solid",
        borderRightWidth:
          columnIndex == columnLength - 2 ? rightBorderWidth : 0,
      };
      if (key) {
        return pos[key];
      }
      return pos;
    },
    /*** 获取某行位置****/
    findRowPos: function(tableLine, rowIndex, key) {
      var top = tableLine.style.rowLines[rowIndex].fromPos.top;
      var bottom = tableLine.style.rowLines[rowIndex + 1].fromPos.top;
      var height = bottom - top + AbsoluteDesign.operationAreaOffset / 2;
      var topBorderWidth = tableLine.style.rowLines[rowIndex].config.lineHeight;
      var bottomBorderWidth =
        tableLine.style.rowLines[rowIndex + 1].config.lineHeight;
      var borderTopColor = tableLine.style.rowLines[rowIndex].config.color;
      var borderBottomColor =
        tableLine.style.rowLines[rowIndex + 1].config.color;

      var rowLength = tableLine.style.rowLines.length;

      var pos = {
        top: top,
        height: height,
        borderTopWidth: topBorderWidth,
        borderTopColor: borderTopColor,
        borderBottomColor: borderBottomColor,
        borderTopStyle:
          tableLine.style.rowLines[rowIndex].config.borderStyle || "solid",
        borderBottomStyle:
          tableLine.style.rowLines[rowIndex + 1].config.borderStyle || "solid",

        borderBottomWidth: rowIndex == rowLength - 2 ? bottomBorderWidth : 0,
      };
      if (key) {
        return pos[key];
      }
      return pos;
    },
    /*
         *
         *   <button class="design-top-btn top-btn-transparent" oui-e-click="event2merge">合并</button>
         <button class="design-top-btn top-btn-transparent" oui-e-click="event2split">拆分</button>
         <button class="design-top-btn top-btn-transparent" oui-e-click="event2insertColumn">插入列</button>
         <button class="design-top-btn top-btn-transparent" oui-e-click="event2insertRow">插入行</button>
         <button class="design-top-btn top-btn-transparent" oui-e-click="event2removeColumn">删除列</button>
         <button class="design-top-btn top-btn-transparent" oui-e-click="event2removeRow">删除行</button>
         */
    /** 合并单元格***/
    event2merge: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      if (!currentControl || currentControl.htmlType != "tableLine") {
        return;
      }
      if (!me.selectRect) {
        return;
      }
      if (me.selectRect.isSelectColumn || me.selectRect.isSelectRow) {
        me.selectRect = me.findMaxArea(
          currentControl,
          me.selectRect.startRect,
          me.selectRect.endRect
        );
      }
      var startColumnIndex = me.selectRect.startColumnIndex;
      var startRowIndex = me.selectRect.startRowIndex;
      var endColumnIndex = me.selectRect.endColumnIndex;
      var endRowIndex = me.selectRect.endRowIndex;

      var canMerge = true;
      if (startColumnIndex == endColumnIndex && startRowIndex == endRowIndex) {
        //同一个单元格不用合并
        canMerge = false;
      }
      // 没有选择区域不用合并
      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        canMerge = false;
      }
      if (!canMerge) {
        return;
      }
      var mergeCellsMap = currentControl.style.mergeCellsMap;
      if (!mergeCellsMap) {
        mergeCellsMap = {};
        currentControl.style.mergeCellsMap = mergeCellsMap;
      }
      //一、判断 区域内是否有 多个控件，如果有多个控件 不能执行合并,或者提示删除后合并

      var rects = me.findRectsInTableLineByCellIndex(
        currentControl,
        startColumnIndex,
        startRowIndex,
        endColumnIndex,
        endRowIndex
      );
      if (rects && rects.length > 1) {
        oui.getTop().oui.alert("当前选择单元格区域含有多个控件不能进行合并");
        return;
      }
      //二、判断 区域内是否有 合并的单元格，需要执行删除，添加新的合并单元格信息
      me.removeMergeCellsByCellIndex(
        currentControl,
        startColumnIndex,
        startRowIndex,
        endColumnIndex,
        endRowIndex
      );
      me.addMergeCell(
        currentControl,
        oui.parseJson(oui.parseString(me.selectRect))
      );

      //三、更新 表格cellsMap中 单元格的矩形位置 和跨列跨行信息 【 拖放控件时需要检测是否在合并的单元格中，并给与正确的合并信息】
      if (rects.length == 1) {
        var newRect = {
          controlId: rects[0].controlId,
          tableLineId: rects[0].tableLineId,
        };
        newRect.columnIndex = startColumnIndex;
        newRect.rowIndex = startRowIndex;
        newRect.left = me.selectRect.left;
        newRect.top = me.selectRect.top;
        newRect.right = me.selectRect.right;
        newRect.bottom = me.selectRect.bottom;
        newRect.rowspan =
          me.selectRect.endRowIndex - me.selectRect.startRowIndex + 1; //跨行
        newRect.colspan =
          me.selectRect.endColumnIndex - me.selectRect.startColumnIndex + 1; //跨列
        // 删除之前的单元格信息,并设置新的单元格信息,更新控件的单元格位置和高宽
        var controlInCell = me.getControlById(newRect.controlId);
        me.removeRect4Control(controlInCell);
        me.removeRectInTableLineByColumnAndRow(
          currentControl,
          rects[0].columnIndex,
          rects[0].rowIndex
        );
        me.setRectInTableLineByColumnAndRow(currentControl, newRect); //设置 单元格信息

        controlInCell.style.rect = newRect; //设置控件上的单元格信息
        controlInCell.style.left = newRect.left;
        controlInCell.style.top = newRect.top;
        controlInCell.style.width = newRect.right - newRect.left;
        controlInCell.style.height = newRect.bottom - newRect.top;

        //四 更新单元格中的控件
        var controlEl = $("#" + controlInCell.id, ".paper-area")[0];
        controlEl.style.left = controlInCell.style.left + "px";
        controlEl.style.top = controlInCell.style.top + "px";
        controlEl.style.width = controlInCell.style.width + "px";
        controlEl.style.height = controlInCell.style.height + "px";
      }
      //五、 渲染表格控件 操作层占位变更
      me.hideOperationArea();
      me.changed4props(cfg);
    },
    /** 拆分单元格 ****/
    event2split: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      if (!currentControl || currentControl.htmlType != "tableLine") {
        return;
      }
      if (!me.selectRect) {
        return;
      }
      if (me.selectRect.isSelectColumn || me.selectRect.isSelectRow) {
        me.selectRect = me.findMaxArea(
          currentControl,
          me.selectRect.startRect,
          me.selectRect.endRect
        );
      }
      var startColumnIndex = me.selectRect.startColumnIndex;
      var startRowIndex = me.selectRect.startRowIndex;
      var endColumnIndex = me.selectRect.endColumnIndex;
      var endRowIndex = me.selectRect.endRowIndex;
      var canMerge = true;
      if (startColumnIndex == endColumnIndex && startRowIndex == endRowIndex) {
        //同一个单元格不用合并
        canMerge = false;
      }

      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        canMerge = false;
      }
      // 没有合并区域不用拆分
      var mergeCellsMap = currentControl.style.mergeCellsMap;
      if (!mergeCellsMap) {
        canMerge = false;
      }
      if (!canMerge) {
        return;
      }

      //一、找出选择区域的所有合并单元格

      var mergeCells = me.findMergeCellsByCellIndex(
        currentControl,
        startColumnIndex,
        startRowIndex,
        endColumnIndex,
        endRowIndex
      );
      var controlIds = [];
      var controlMap = {};
      if (!mergeCells || !mergeCells.length) {
        return;
      }

      var tableLeft = currentControl.style.left;
      var tableTop = currentControl.style.top;
      var borderLeftWidth = currentControl.style.borderLeftWidth;
      var borderTopWidth = currentControl.style.borderTopWidth;
      var rows = currentControl.style.rowLines || [];
      var columns = currentControl.style.columnLines || [];

      for (var i = 0, len = mergeCells.length; i < len; i++) {
        var rects = me.findRectsInTableLineByCellIndex(
          currentControl,
          mergeCells[i].startColumnIndex,
          mergeCells[i].startRowIndex,
          mergeCells[i].endColumnIndex,
          mergeCells[i].endRowIndex
        );
        if (rects && rects.length == 1) {
          //有且只有一个控件
          var newRect = {
            controlId: rects[0].controlId,
            tableLineId: rects[0].tableLineId,
          };
          newRect.columnIndex = mergeCells[i].startColumnIndex;
          newRect.rowIndex = mergeCells[i].startRowIndex;
          newRect.left = mergeCells[i].left;
          newRect.top = mergeCells[i].top;
          newRect.right =
            tableLeft +
            borderLeftWidth +
            columns[mergeCells[i].startColumnIndex + 1].fromPos.left;
          newRect.bottom =
            tableTop +
            borderTopWidth +
            rows[mergeCells[i].startRowIndex + 1].fromPos.top;
          // 删除之前的单元格信息,并设置新的单元格信息,更新控件的单元格位置和高宽
          var controlInCell = me.getControlById(newRect.controlId);
          me.removeRect4Control(controlInCell);
          me.removeRectInTableLineByColumnAndRow(
            currentControl,
            rects[0].columnIndex,
            rects[0].rowIndex
          );
          me.setRectInTableLineByColumnAndRow(currentControl, newRect); //设置 单元格信息

          controlInCell.style.rect = newRect; //设置控件上的单元格信息
          controlInCell.style.left = newRect.left;
          controlInCell.style.top = newRect.top;
          controlInCell.style.width = newRect.right - newRect.left;
          controlInCell.style.height = newRect.bottom - newRect.top;

          controlIds.push(controlInCell.id);
          controlMap[controlInCell.id] = controlInCell;
        } else {
          if (rects && rects.length > 1) {
            console.log("error:find many control in mergeCell");
            console.log(rects);
          }
        }
        me.removeMergeCell(currentControl, mergeCells[i]);
      }
      if (controlIds && controlIds.length) {
        //批量更新拆分后的控件 位置
        //
        var selector = "#" + controlIds.join(",#");
        $(selector, ".paper-area").each(function() {
          var id = this.getAttribute("id");
          var controlEl = this;
          controlInCell = controlMap[id];
          controlEl.style.left = controlInCell.style.left + "px";
          controlEl.style.top = controlInCell.style.top + "px";
          controlEl.style.width = controlInCell.style.width + "px";
          controlEl.style.height = controlInCell.style.height + "px";
        });
      }
      me.hideOperationArea();
      me.changed4props(cfg);
    },
    /** 插入列 到前面****/
    event2insertColumn4prev: function(cfg) {
      var me = this;
      var startDate = new Date();
      var currentControl = me.data.currentControl;
      if (!currentControl || currentControl.htmlType != "tableLine") {
        return;
      }
      if (!me.selectRect) {
        return;
      }
      var startColumnIndex = me.selectRect.startColumnIndex;
      var startRowIndex = me.selectRect.startRowIndex;
      var endColumnIndex = me.selectRect.endColumnIndex;
      var endRowIndex = me.selectRect.endRowIndex;
      var canInsert = true;
      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        canInsert = false;
      }
      if (!canInsert) {
        return;
      }
      /** 选择了列头 ,处理批量插入****/
      var addSize =
        me.selectRect.endColumnIndex - me.selectRect.startColumnIndex + 1;
      //一、增加线条一根在指定位置前面
      var lines = currentControl.style.columnLines;
      var currLine = currentControl.style.columnLines[startColumnIndex];
      //arr.splice.apply(arr,[1,0,2,3])
      var addArr = [];
      var defaultWidth = 50;
      var stepWidth = defaultWidth * addSize;
      var arrParam = [startColumnIndex, 0];
      for (var ai = 0; ai < addSize; ai++) {
        var tempAdd = oui.parseJson(oui.parseString(currLine));
        tempAdd.fromPos.left += defaultWidth * ai;
        if (tempAdd.toPos) {
          tempAdd.toPos.left = tempAdd.fromPos.left;
        }
        addArr.push(tempAdd);
      }
      arrParam = arrParam.concat(addArr);
      lines.splice.apply(lines, arrParam);
      //二、更新指定位置以及后面的所有线的信息
      // 默认列宽度=50
      //处理批量插入

      currentControl.style.width += stepWidth; //宽度增加50*addSize
      for (
        var i = startColumnIndex + addSize, len = lines.length;
        i < len;
        i++
      ) {
        var curr = currentControl.style.columnLines[i];
        curr.fromPos.left += stepWidth;
        if (curr.toPos) {
          curr.toPos.left = curr.fromPos.left;
        }
      }
      //三、更新 有控件的非合并单元格
      var cellsMap = currentControl.style.cellsMap || {};
      var newCellsMap = {};
      for (var key in cellsMap) {
        var rect = cellsMap[key];
        if (!rect) {
          continue;
        }
        //找到当前列，并把索引变大
        if (rect.columnIndex >= startColumnIndex) {
          rect.columnIndex += addSize;
          var control = me.getControlById(rect.controlId);
          if (control) {
            control.style.rect = rect;
          }
        } else {
          if (rect.colspan && rect.colspan > 1) {
            //跨列单元格判断
            if (
              startColumnIndex > rect.columnIndex &&
              rect.columnIndex + rect.colspan - 1 >= startColumnIndex
            ) {
              rect.colspan += addSize;
              var control = me.getControlById(rect.controlId);
              if (control) {
                control.style.rect = rect;
              }
            }
          }
        }
        newCellsMap[rect.columnIndex + "_" + rect.rowIndex] = rect;
      }
      currentControl.style.cellsMap = newCellsMap;
      //更新 合并单元格
      var mergeCellsMap = currentControl.style.mergeCellsMap;
      if (mergeCellsMap) {
        var newMergeCellsMap = {};
        for (var i in mergeCellsMap) {
          var rect = mergeCellsMap[i];
          //找到当前列，并把索引变大
          if (rect.startColumnIndex >= startColumnIndex) {
            rect.startColumnIndex += addSize;
            rect.endColumnIndex += addSize;
          } else {
            if (
              rect.startColumnIndex < startColumnIndex &&
              rect.endColumnIndex >= startColumnIndex
            ) {
              rect.endColumnIndex += addSize;
            }
          }
          newMergeCellsMap[
            rect.startColumnIndex + "_" + rect.startRowIndex
          ] = rect;
        }
        currentControl.style.mergeCellsMap = newMergeCellsMap;
      }
      me.updateControlsInTableLine(currentControl, {
        resizeColumnIndex: startColumnIndex == 0 ? -1 : startColumnIndex,
        resizeRowIndex: -1,
      });

      //更新选择区域
      me.selectRect = me.findRectBySelectRect(currentControl, me.selectRect);
      me.changed4props({}, function() {
        me.hideOperationArea();
        me.showOperationArea(currentControl);
        me.setCurrPropsData(currentControl, "center", "dragEndField"); //238列3行，103ms
        //console.log('测试添加列时间：'+(new Date()- startDate));
      });
    },
    /** 插入行 到前面****/
    event2insertRow4prev: function(cfg) {
      var me = this;
      var startDate = new Date();
      var currentControl = me.data.currentControl;
      if (!currentControl || currentControl.htmlType != "tableLine") {
        return;
      }
      if (!me.selectRect) {
        return;
      }
      var startColumnIndex = me.selectRect.startColumnIndex;
      var startRowIndex = me.selectRect.startRowIndex;
      var endColumnIndex = me.selectRect.endColumnIndex;
      var endRowIndex = me.selectRect.endRowIndex;
      var canInsert = true;
      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        canInsert = false;
      }
      if (!canInsert) {
        return;
      }
      var addSize = me.selectRect.endRowIndex - me.selectRect.startRowIndex + 1;
      //一、增加线条一根在指定位置前面
      var lines = currentControl.style.rowLines;
      var currLine = currentControl.style.rowLines[startRowIndex];
      var cloneLine = oui.parseJson(oui.parseString(currLine));
      var defaultHeight = 50;
      var stepHeight = defaultHeight * addSize;
      var arrParam = [startRowIndex, 0];
      var addArr = [];
      for (var ai = 0; ai < addSize; ai++) {
        var tempAdd = oui.parseJson(oui.parseString(currLine));
        tempAdd.fromPos.top += defaultHeight * ai;
        if (tempAdd.toPos) {
          tempAdd.toPos.top = tempAdd.fromPos.top;
        }
        addArr.push(tempAdd);
      }
      arrParam = arrParam.concat(addArr);
      lines.splice.apply(lines, arrParam);
      //二、更新指定位置以及后面的所有线的信息
      // 默认列宽度=50

      currentControl.style.height += stepHeight; //宽度增加50*addSize
      for (var i = startRowIndex + addSize, len = lines.length; i < len; i++) {
        var curr = currentControl.style.rowLines[i];
        curr.fromPos.top += stepHeight;
        if (curr.toPos) {
          curr.toPos.top = curr.fromPos.top;
        }
      }
      //三、更新 有控件的非合并单元格
      var cellsMap = currentControl.style.cellsMap || {};
      var newCellsMap = {};
      for (var key in cellsMap) {
        var rect = cellsMap[key];
        if (!rect) {
          continue;
        }
        //找到当前列，并把索引变大
        if (rect.rowIndex >= startRowIndex) {
          rect.rowIndex += addSize;
          var control = me.getControlById(rect.controlId);
          if (control) {
            control.style.rect = rect;
          }
        } else {
          if (rect.rowspan && rect.rowspan > 1) {
            //跨行单元格判断
            if (
              startRowIndex > rect.rowIndex &&
              rect.rowIndex + rect.rowspan - 1 >= startRowIndex
            ) {
              rect.rowspan += addSize;
              var control = me.getControlById(rect.controlId);
              if (control) {
                control.style.rect = rect;
              }
            }
          }
        }
        newCellsMap[rect.columnIndex + "_" + rect.rowIndex] = rect;
      }
      currentControl.style.cellsMap = newCellsMap;
      //更新 合并单元格
      var mergeCellsMap = currentControl.style.mergeCellsMap;
      if (mergeCellsMap) {
        var newMergeCellsMap = {};
        for (var i in mergeCellsMap) {
          var rect = mergeCellsMap[i];
          //找到当前列，并把索引变大
          if (rect.startRowIndex >= startRowIndex) {
            rect.startRowIndex += addSize;
            rect.endRowIndex += addSize;
          } else {
            if (
              rect.startRowIndex < startRowIndex &&
              rect.endRowIndex >= startRowIndex
            ) {
              rect.endRowIndex += addSize;
            }
          }
          newMergeCellsMap[
            rect.startColumnIndex + "_" + rect.startRowIndex
          ] = rect;
        }
        currentControl.style.mergeCellsMap = newMergeCellsMap;
      }
      me.updateControlsInTableLine(currentControl, {
        resizeColumnIndex: -1,
        resizeRowIndex: startRowIndex == 0 ? -1 : startRowIndex,
      });

      me.selectRect = me.findRectBySelectRect(currentControl, me.selectRect);
      me.changed4props({}, function() {
        me.hideOperationArea();
        me.showOperationArea(currentControl);
        me.setCurrPropsData(currentControl, "center", "dragEndField"); //238列3行，103ms
        //console.log('测试添加列时间：'+(new Date()- startDate));
      });
    },
    /** 删除列****/
    event2removeColumn: function(cfg) {
      var me = this;
      var startDate = new Date();
      var currentControl = me.data.currentControl;
      if (!currentControl || currentControl.htmlType != "tableLine") {
        return;
      }
      if (!me.selectRect) {
        return;
      }
      var startColumnIndex = me.selectRect.startColumnIndex;
      var startRowIndex = me.selectRect.startRowIndex;
      var endColumnIndex = me.selectRect.endColumnIndex;
      var endRowIndex = me.selectRect.endRowIndex;

      var canRemove = true;
      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        canRemove = false;
      }
      /*** 至少需要留一列 不能删除******/
      if (currentControl.style.columnLines.length - 2 <= 0) {
        canRemove = false;
        return;
      }
      if (startColumnIndex > currentControl.style.columnLines.length - 2) {
        canRemove = false;
      }
      if (!canRemove) {
        return;
      }
      var removeSize =
        me.selectRect.endColumnIndex - me.selectRect.startColumnIndex + 1;
      //一、删除指定位置的线条
      var lines = currentControl.style.columnLines;
      if (removeSize >= lines.length - 2) {
        removeSize = lines.length - 2;
      }

      var currLine = currentControl.style.columnLines[startColumnIndex];
      var currWidth =
        currentControl.style.columnLines[endColumnIndex + 1].fromPos.left -
        currLine.fromPos.left;
      lines.splice(startColumnIndex, removeSize);
      //二、更新指定位置以及后面的所有线的信息
      if (currentControl.style.width - currWidth < 30) {
        currWidth =
          currentControl.style.width -
          currentControl.style.columnLines[1].fromPos.left +
          currentControl.style.columnLines[0].fromPos.left;
      }

      currentControl.style.width -= currWidth; //宽度减少列的宽度

      for (var i = startColumnIndex, len = lines.length; i < len; i++) {
        var curr = currentControl.style.columnLines[i];
        curr.fromPos.left -= currWidth;
        if (curr.toPos) {
          curr.toPos.left -= currWidth;
        }
      }
      //三、更新 有控件的非合并单元格
      var cellsMap = currentControl.style.cellsMap || {};
      var newCellsMap = {};

      for (var key in cellsMap) {
        var rect = cellsMap[key];
        if (!rect) {
          continue;
        }
        var canUse = true;
        //找到当前列，并把索引变小
        if (rect.columnIndex >= startColumnIndex) {
          //如果是合并单元格，并且开始位置于当前位置相同，则需要减少合并单元格
          if (rect.columnIndex == startColumnIndex) {
            if (rect.colspan && rect.colspan > 1) {
              rect.colspan -= removeSize; //减少合并参数
              if (rect.colspan < 1) {
                canUse = false;
              }
              if (rect.colspan < 2) {
                delete rect.colspan; //剔除合并信息
              }
            } else {
              canUse = false;
              //should delete  curr rect
            }
          } else {
            rect.columnIndex -= removeSize;
            if (rect.columnIndex < 0) {
              canUse = false;
            }
          }
          var control = me.getControlById(rect.controlId);
          if (control) {
            if (canUse) {
              control.style.rect = rect;
            } else {
              control.style.rect = null;
              delete control.style.rect;
            }
          }
        } else {
          if (rect.colspan && rect.colspan > 1) {
            //跨列单元格判断
            if (
              startColumnIndex > rect.columnIndex &&
              rect.columnIndex + rect.colspan - 1 >= startColumnIndex
            ) {
              rect.colspan -= removeSize;
              if (rect.colspan < 1) {
                canUse = false;
              }
              if (rect.colspan < 2) {
                delete rect.colspan; //剔除合并信息
              }
              var control = me.getControlById(rect.controlId);
              if (control) {
                if (canUse) {
                  control.style.rect = rect;
                } else {
                  control.style.rect = null;
                  delete control.style.rect;
                }
              }
            }
          }
        }
        if (canUse) {
          newCellsMap[rect.columnIndex + "_" + rect.rowIndex] = rect;
        }
      }
      currentControl.style.cellsMap = newCellsMap;
      //更新 合并单元格
      var mergeCellsMap = currentControl.style.mergeCellsMap;
      if (mergeCellsMap) {
        var newMergeCellsMap = {};
        for (var i in mergeCellsMap) {
          var rect = mergeCellsMap[i];
          var canUse = true;
          //找到当前列，并把索引变大
          if (rect.startColumnIndex >= startColumnIndex) {
            if (rect.startColumnIndex == startColumnIndex) {
              rect.endColumnIndex -= removeSize;
              if (rect.startColumnIndex >= rect.endColumnIndex) {
                //should delete merge cell;
                canUse = false;
              }
            } else {
              rect.startColumnIndex -= removeSize;
              rect.endColumnIndex -= removeSize;
              if (rect.startColumnIndex < 0) {
                canUse = false;
              }
            }
          } else {
            if (
              rect.startColumnIndex < startColumnIndex &&
              rect.endColumnIndex >= startColumnIndex
            ) {
              rect.endColumnIndex -= removeSize;
              if (rect.startColumnIndex >= rect.endColumnIndex) {
                // should delete merge cell
                canUse = false;
              }
            }
          }
          if (canUse) {
            newMergeCellsMap[
              rect.startColumnIndex + "_" + rect.startRowIndex
            ] = rect;
          }
        }
        currentControl.style.mergeCellsMap = newMergeCellsMap;
      }
      me.updateControlsInTableLine(currentControl, {
        resizeColumnIndex: startColumnIndex == 0 ? -1 : startColumnIndex,
        resizeRowIndex: -1,
      });
      me.selectRect = me.findRectBySelectRect(currentControl, me.selectRect);
      me.changed4props({}, function() {
        me.hideOperationArea();
        me.showOperationArea(currentControl);
        me.setCurrPropsData(currentControl, "center", "dragEndField"); //238列3行，103ms
        //console.log('测试添加列时间：'+(new Date()- startDate));
      });
    },
    /** 删除行****/
    event2removeRow: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      if (!currentControl || currentControl.htmlType != "tableLine") {
        return;
      }
      if (!me.selectRect) {
        return;
      }
      var startColumnIndex = me.selectRect.startColumnIndex;
      var startRowIndex = me.selectRect.startRowIndex;
      var endColumnIndex = me.selectRect.endColumnIndex;
      var endRowIndex = me.selectRect.endRowIndex;

      var canRemove = true;
      if (
        startColumnIndex < 0 ||
        endColumnIndex < 0 ||
        startRowIndex < 0 ||
        endRowIndex < 0
      ) {
        canRemove = false;
      }
      /*** 至少需要留一列 不能删除******/
      if (currentControl.style.rowLines.length - 2 <= 0) {
        canRemove = false;
        return;
      }
      if (startRowIndex > currentControl.style.rowLines.length - 2) {
        canRemove = false;
      }
      if (!canRemove) {
        return;
      }
      var removeSize =
        me.selectRect.endRowIndex - me.selectRect.startRowIndex + 1;
      var lines = currentControl.style.rowLines;
      if (removeSize >= lines.length - 2) {
        removeSize = lines.length - 2;
      }
      //一、删除指定位置的线条
      var currLine = currentControl.style.rowLines[startRowIndex];
      var currHeight =
        currentControl.style.rowLines[endRowIndex + 1].fromPos.top -
        currLine.fromPos.top;
      if (currentControl.style.height - currHeight < 30) {
        currHeight =
          currentControl.style.height -
          currentControl.style.rowLines[1].fromPos.top +
          currentControl.style.rowLines[0].fromPos.top;
      }
      lines.splice(startRowIndex, removeSize);

      //二、更新指定位置以及后面的所有线的信息
      currentControl.style.height -= currHeight; //高度减少行的高度
      for (var i = startRowIndex, len = lines.length; i < len; i++) {
        var curr = lines[i];
        curr.fromPos.top -= currHeight;
        if (curr.toPos) {
          curr.toPos.top -= currHeight;
        }
      }
      //三、更新 有控件的非合并单元格
      var cellsMap = currentControl.style.cellsMap || {};
      var newCellsMap = {};

      for (var key in cellsMap) {
        var rect = cellsMap[key];
        if (!rect) {
          continue;
        }
        var canUse = true;
        //找到当前列，并把索引变小
        if (rect.rowIndex >= startRowIndex) {
          //如果是合并单元格，并且开始位置于当前位置相同，则需要减少合并单元格
          if (rect.rowIndex == startRowIndex) {
            if (rect.rowspan && rect.rowspan > 1) {
              rect.rowspan -= removeSize; //减少合并参数
              if (rect.rowspan < 1) {
                //单元格不存在场景
                canUse = false;
              }
              if (rect.rowspan < 2) {
                delete rect.rowspan; //剔除合并信息
              }
            } else {
              canUse = false;
              //should delete  curr rect
            }
          } else {
            rect.rowIndex -= removeSize;
            if (rect.rowIndex < 0) {
              canUse = false;
            }
          }
          var control = me.getControlById(rect.controlId);
          if (control) {
            if (canUse) {
              control.style.rect = rect;
            } else {
              control.style.rect = null;
              delete control.style.rect;
            }
          }
        } else {
          if (rect.rowspan && rect.rowspan > 1) {
            //跨行单元格判断
            if (
              startRowIndex > rect.rowIndex &&
              rect.rowIndex + rect.rowspan - 1 >= startRowIndex
            ) {
              rect.rowspan -= removeSize;
              if (rect.rowspan < 1) {
                canUse = false;
              }
              if (rect.rowspan < 2) {
                delete rect.rowspan; //剔除合并信息
              }

              var control = me.getControlById(rect.controlId);
              if (control) {
                if (canUse) {
                  control.style.rect = rect;
                } else {
                  control.style.rect = null;
                  delete control.style.rect;
                }
              }
            }
          }
        }
        if (canUse) {
          newCellsMap[rect.columnIndex + "_" + rect.rowIndex] = rect;
        }
      }
      currentControl.style.cellsMap = newCellsMap;
      //更新 合并单元格
      var mergeCellsMap = currentControl.style.mergeCellsMap;
      if (mergeCellsMap) {
        var newMergeCellsMap = {};
        for (var i in mergeCellsMap) {
          var rect = mergeCellsMap[i];
          var canUse = true;
          //找到当前列，并把索引变大
          if (rect.startRowIndex >= startRowIndex) {
            if (rect.startRowIndex == startRowIndex) {
              rect.endRowIndex -= removeSize;
              if (rect.startRowIndex >= rect.endRowIndex) {
                //should delete merge cell;
                canUse = false;
              }
            } else {
              rect.startRowIndex -= removeSize;
              rect.endRowIndex -= removeSize;
              if (rect.startRowIndex < 0) {
                canUse = false;
              }
            }
          } else {
            if (
              rect.startRowIndex < startRowIndex &&
              rect.endRowIndex >= startRowIndex
            ) {
              rect.endRowIndex -= removeSize;
              if (rect.startRowIndex >= rect.endRowIndex) {
                // should delete merge cell
                canUse = false;
              }
            }
          }
          if (canUse) {
            newMergeCellsMap[
              rect.startColumnIndex + "_" + rect.startRowIndex
            ] = rect;
          }
        }
        currentControl.style.mergeCellsMap = newMergeCellsMap;
      }
      me.updateControlsInTableLine(currentControl, {
        resizeColumnIndex: -1,
        resizeRowIndex: startRowIndex == 0 ? -1 : startRowIndex,
      });
      me.selectRect = me.findRectBySelectRect(currentControl, me.selectRect);
      me.changed4props({}, function() {
        me.hideOperationArea();
        me.showOperationArea(currentControl);
        me.setCurrPropsData(currentControl, "center", "dragEndField"); //238列3行，103ms
        //console.log('测试添加列时间：'+(new Date()- startDate));
      });
    },
    /*** 获取页面业务自定义配置 html******/
    //findPageBizPropsHtml:function(){
    //    var me = this;
    //    var mainTemplate = me.paramCfg.mainTemplate||"";
    //    var result = '';
    //    var templateHtml ='';
    //    if(!mainTemplate){
    //        return result;
    //    }
    //    if(!me._render4pagePizProp){
    //        if(mainTemplate.indexOf('.')<0){
    //            var findTemplate = me.plugin[mainTemplate];
    //            if(findTemplate){
    //                templateHtml = findTemplate.call(me.plugin,me.data);
    //            }
    //        }else{
    //            var fun = oui.JsonPathUtil.getJsonByPath(mainTemplate,window);
    //            if(fun){
    //                templateHtml = fun(me.data);
    //            }
    //        }
    //        me._render4pagePizProp = template.compile(templateHtml);
    //    }
    //    result = me._render4pagePizProp(me.data);
    //    return result;
    //},

    /** 获取控件业务自定义配置 html*****/
    //findControlBizPropsHtml:function(control){
    //    var me = this;
    //    var configTemplate = control.configTemplate||"";
    //    var result = '';
    //
    //    if((!control ) || (!control.controlType) ||(!configTemplate)){
    //        return result;
    //    }
    //    var templateHtml ='';
    //
    //    if(!me._render4controlPizProp){
    //        me._render4controlPizProp = {};
    //    }
    //    if(!me._render4controlPizProp[control.controlType]){
    //        if(configTemplate.indexOf('.')<0){
    //            var findTemplate = me.plugin[configTemplate];
    //            if(findTemplate){
    //                templateHtml = findTemplate.call(me.plugin,me.data);
    //            }
    //        }else{
    //            var fun = oui.JsonPathUtil.getJsonByPath(configTemplate,window);
    //            if(fun){
    //                templateHtml = fun(me.data);
    //            }
    //        }
    //        me._render4controlPizProp[control.controlType] = template.compile(templateHtml);
    //    }
    //    result =me._render4controlPizProp[control.controlType](me.data);
    //    return result;
    //},
    /*** 根据 控件定义 生成canvas对象****/
    buildCanvasByControlId: function(id, callback) {
      var me = this;
      var control = me.getControlById(id);
      var style = control.style;
      var innerStyle = control.innerStyle;
      var styleField = innerStyle.styleField;
      var styleFieldOuter = innerStyle.styleFieldOuter;
      var styleTitle = innerStyle.styleTitle;
      //TODO
      var width = style.width;
      var height = style.height;
      var left = style.left;
      var top = style.top;

      var borderRadius = style.borderRadius || 0;
      var borderLeftWidth = style.borderLeftWidth || 0;
      var borderTopWidth = style.borderTopWidth || 0;
      var borderBottomWidth = style.borderBottomWidth || 0;
      var borderRightWidth = style.borderRightWidth || 0;

      var borderLeftColor = style.borderLeftColor || 0;
      var borderTopColor = style.borderTopColor || 0;
      var borderBottomColor = style.borderBottomColor || 0;
      var borderRightColor = style.borderRightColor || 0;

      var backgroundColor = style.backgroundColor || "red";
      var backgroundImage = style.backgroundImage || "";
      var paddingLeft = style.paddingLeft || 0;
      var paddingTop = style.paddingTop || 0;
      var paddingRight = style.paddingRight || 0;
      var paddingBottom = style.paddingBottom || 0;
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.style.left = left + "px";
      canvas.style.top = top + "px";
      var context = canvas.getContext("2d");
      var r = borderRadius;
      if (width < 2 * r) {
        r = width / 2;
      }
      if (height < 2 * r) {
        r = height / 2;
      }
      context.beginPath();
      context.moveTo(x + r, y);
      if (borderRightWidth) {
        context.lineWidth = borderRightWidth;
        context.strokeStyle = borderRightColor;
        context.arcTo(x + width, y, x + width, y + height, r);
      }
      if (borderBottomWidth) {
        context.lineWidth = borderBottomWidth;
        context.strokeStyle = borderBottomColor;
        context.arcTo(x + width, y + height, x, y + height, r);
      }
      if (borderLeftWidth) {
        context.lineWidth = borderLeftWidth;
        context.strokeStyle = borderLeftColor;
        context.arcTo(x, y + height, x, y, r);
      }
      if (borderTopWidth) {
        context.lineWidth = borderTopWidth;
        context.strokeStyle = borderTopColor;
        context.arcTo(x, y, x + width, y, r);
      }
      context.closePath();

      var $paper = $(".paper-area");
      $paper.append(canvas);
    },
    /** 根据控件html 转为canvas对象****/
    buildHtmlCanvasByControlId: function(id, callback) {
      var me = this;
      var control = me.getControlById(id);
      var html = oui
        .getById("items")
        .getHtmlByTplId("item-canvas-div-tpl", { item: control });
      var canvasOuterHtml = oui
        .getById("items")
        .getHtmlByTplId("item-canvas-object-tpl", { item: control });
      var $paperArea = $(".paper-area");
      $paperArea.append(html);
      var $el = $paperArea.find("#canvas_div_" + id);
      var canvas = document.createElement("canvas");
      var canvasWidth = $el[0].scrollWidth * 3;
      var canvasHeight = $el[0].scrollHeight * 3;

      if (canvasWidth < 200) {
        canvasWidth = 200;
      }
      if (canvasHeight < 200) {
        canvasHeight = 200;
      }
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      me.eachDomStyle($el[0]);
      var $scroll = $(".design-middle");
      var scrollTop = $scroll[0].scrollTop;
      var scrollLeft = $scroll[0].scrollLeft;
      if (scrollLeft > 0) {
        $scroll[0].scrollLeft = 0;
      }
      if (scrollTop > 0) {
        $scroll[0].scrollTop = 0;
      }
      html2canvas($el[0], {
        canvas: canvas,
        width: canvas.width,
        height: canvas.height,
      }).then(function(canvas) {
        var newCanvas = document.createElement("canvas");
        var newCanvasWidth = $el[0].scrollWidth;
        var newCanvasHeight = $el[0].scrollHeight;
        newCanvas.width = newCanvasWidth;
        newCanvas.height = newCanvasHeight;
        newCanvas.style.width = newCanvasWidth + "px";
        newCanvas.style.height = newCanvasHeight + "px";
        var context = newCanvas.getContext("2d");
        var borderTop = $el.css("border-top-width") || "";
        borderTop = borderTop.replace("px", "");
        borderTop = parseInt(borderTop || 0);

        var borderLeft = $el.css("border-left-width") || "";
        borderLeft = borderLeft.replace("px", "");
        borderLeft = parseInt(borderLeft || 0);

        var borderRight = $el.css("border-right-width") || "";
        borderRight = borderRight.replace("px", "");
        borderRight = parseInt(borderRight || 0);

        var borderBottom = $el.css("border-bottom-width") || "";
        borderBottom = borderBottom.replace("px", "");
        borderBottom = parseInt(borderBottom || 0);

        var imgData = canvas
          .getContext("2d")
          .getImageData(
            borderLeft,
            borderTop,
            canvas.width - borderRight,
            canvas.height - borderBottom
          );

        context.putImageData(imgData, 0, 0);
        var newImgData = context.getImageData(
          0,
          0,
          newCanvasWidth,
          newCanvasHeight
        );

        context.putImageData(newImgData, 0, 0);
        //console.log(newImgData);
        $paperArea.append(canvasOuterHtml);
        $("#canvas_object_" + id).append(newCanvas);
        if (scrollLeft > 0) {
          $scroll[0].scrollLeft = scrollLeft;
        }
        if (scrollTop > 0) {
          $scroll[0].scrollTop = scrollTop;
        }
        callback && callback();
      });
    },
    canvasRunner: function(size) {
      var currIdx = 0;
      var queue = [];
      for (var i = 0, len = size; i < len; i++) {
        queue.push({
          idx: i,
          run: function() {
            currIdx = this.idx;
            com.oui.absolute.AbsoluteDesign.buildCanvasByControlId(
              com.oui.absolute.AbsoluteDesign.data.controls[0].id,
              function() {
                queue[currIdx + 1] && queue[currIdx + 1].run();
              }
            );
          },
        });
      }
      queue[0].run();
    },
    eachDomStyle: function(el) {
      var me = this;
      var style = el.style;
      if (el.currentStyle) {
        $.extend(true, style, el.currentStyle);
      } else if (window.getComputedStyle) {
        $.extend(true, style, getComputedStyle(el));
      }
      var $children = $(el).children();
      if ($children && $children.length) {
        $children.each(function() {
          me.eachDomStyle(this);
        });
      }
    },
    bindScrollEvents: function() {
      var $scrollEl = $(".design-middle");
      var me = this;
      $scrollEl.on("scroll", function(e) {
        try {
          if (me.scrollTimer) {
            window.clearTimeout(me.scrollTimer);
          }
        } catch (e) {}
        me.scrollTimer = window.setTimeout(function() {
          me.renderPaperStyle();
          window.scrollTimer = null;
        }, 1);
      });
    },
    getControlIdxById: function(id) {
      var me = this;
      var idx = -1;
      var currentControl = oui.findOneFromArrayBy(
        me.data.controls || [],
        function(item, index) {
          if (item.id == id) {
            idx = index;
            return true;
          }
        }
      );
      return idx;
    },
    /*** 根据id找到当前控件对象*****/
    getControlById: function(id) {
      var me = this;
      /*** 先从控件中找****/
      var currentControl = oui.findOneFromArrayBy(
        me.data.controls || [],
        function(item) {
          if (item.id == id) {
            return true;
          }
        }
      );
      return currentControl;
    },
    /** 批量删除控件****/
    removeControlsByIds: function(ids) {
      var me = this;
      if (!ids || !ids.length) {
        return;
      }
      var disableSelector = [];
      for (var i = 0, len = ids.length; i < len; i++) {
        var curr = me.getControlById(ids[i]);
        if (curr) {
          disableSelector.push(
            ".control-abs-disable[control-abs-id=" + curr.id + "]"
          );
        }
        me.removeControlById(ids[i]);
      }
      //$('.design-item[control-abs-bizControlid]')

      var selector = "#" + ids.join(",#");
      $(selector, ".paper-area").remove();
      if (disableSelector && disableSelector.length) {
        $(disableSelector.join(","), ".design-left").removeClass(
          "control-abs-disable"
        ); //取消禁用
      }
    },
    removeControlById: function(id) {
      var me = this;
      var currIdx = -1;
      var currentControl = oui.findOneFromArrayBy(
        me.data.controls || [],
        function(item, index) {
          if (item.id == id) {
            currIdx = index;
            return true;
          }
        }
      );
      me.data.tempControl = {}; //清除临时控件

      /** 更新当前最上层元素***/
      if (
        currentControl &&
        currentControl.style.zIndex == me.data.style.currControlZIndex
      ) {
        me.data.style.currControlZIndex--;
      }
      if (!me.data.controls.length) {
        me.data.style.currControlZIndex = 0;
      }
      if (currentControl && currentControl.htmlType == "tableLine") {
        /*** 先执行删除，否则可能导致 索引位置不对****/
        currIdx = me.removeTableLineControl(id); //虚拟表格 需要单独执行删除
      } else {
        //判断控件是否在某个虚拟表格单元格中
        if (
          currentControl &&
          currentControl.style.rect &&
          currentControl.style.rect.tableLineId
        ) {
          var tableLineControl = me.findTableLineControl(
            currentControl.style.rect.tableLineId
          );
          if (tableLineControl) {
            var rect = currentControl.style.rect;
            me.removeRectInTableLineByColumnAndRow(
              tableLineControl,
              rect.columnIndex,
              rect.rowIndex
            );
          }
        }
      }
      if (currIdx > -1) {
        me.data.controls.splice(currIdx, 1); //删除该元素
      }
    },
    /** 执行事件前 绑定 校验方法*****/
    bindCheckEvents: function() {
      var me = this;
      me.setInterceptFuns(
        "down2selectPaperArea,event2cloneControl,event2preview,event2save,event2selectBoxArea,event2print,event2triggerPaperDown",
        function() {
          return me.checkData();
        }
      );
    },
    setInterceptFuns: function(funNames, fun) {
      var arr;
      if (typeof funNames == "string") {
        arr = funNames.split(",");
      } else {
        arr = funNames || [];
      }
      var funName;
      var _self = this;
      for (var i = 0, len = arr.length; i < len; i++) {
        funName = arr[i];
        if (!funName) {
          continue;
        }
        this[funName + "Before"] = fun;

        this[funName + "Before"] = function(cfg) {
          var flag = fun.call(_self, cfg);
          if (!flag) {
            return false;
          }

          return true;
        };
      }
    },
    bindColorChangeEvents: function() {
      var _self = this;
      (function($) {
        var localization = ($.spectrum.localization["zh-cn"] = {
          cancelText: "取消",
          chooseText: "选择",
          clearText: "清除",
          togglePaletteMoreText: "更多选项",
          togglePaletteLessText: "隐藏",
          noColorSelectedText: "尚未选择任何颜色",
        });
        $.extend($.fn.spectrum.defaults, localization);
      })(jQuery);

      $(document).on("mouseenter", "[type=spectrum]", function() {
        if ($(this).data("initColor")) {
          return;
        }
        $(this).data("initColor", true);
        var color = $(this).attr("value");

        $(this).spectrum({
          //        theme: "sp-light",

          color: color,
          //        containerClassName:'awesome',
          preferredFormat: "hex",
          //                flat: true,
          showInput: true,
          //flat: true,
          showInput: true,
          //className: "full-spectrum",
          allowEmpty: true,
          showInitial: true,
          showPalette: true,
          showSelectionPalette: true,
          maxPaletteSize: 10,
          //localStorageKey: "spectrum.example",
          palette: [
            [
              "rgb(208,215,229)",
              "rgb(0, 0, 0)",
              "rgb(67, 67, 67)",
              "rgb(102, 102, 102)",
              "rgb(153, 153, 153)",
              "rgb(183, 183, 183)",
              "rgb(204, 204, 204)",
              "rgb(217, 217, 217)",
              "rgb(239, 239, 239)",
              "rgb(255, 255, 255)",
            ],

            [
              "rgb(152, 0, 0)",
              "rgb(255, 0, 0)",
              "rgb(255, 153, 0)",
              "rgb(255, 255, 0)",
              "rgb(0, 255, 0)",
              "rgb(0, 255, 255)",
              "rgb(74, 134, 232)",
              "rgb(0, 0, 255)",
              "rgb(153, 0, 255)",
              "rgb(255, 0, 255)",
            ],

            [
              "rgb(230, 184, 175)",
              "rgb(244, 204, 204)",
              "rgb(252, 229, 205)",
              "rgb(255, 242, 204)",
              "rgb(217, 234, 211)",
              "rgb(208, 224, 227)",
              "rgb(201, 218, 248)",
              "rgb(207, 226, 243)",
              "rgb(217, 210, 233)",
              "rgb(234, 209, 220)",
            ],
            [
              "rgb(221, 126, 107)",
              "rgb(234, 153, 153)",
              "rgb(249, 203, 156)",
              "rgb(255, 229, 153)",
              "rgb(182, 215, 168)",
              "rgb(162, 196, 201)",
              "rgb(164, 194, 244)",
              "rgb(159, 197, 232)",
              "rgb(180, 167, 214)",
              "rgb(76, 17, 48)",
            ],
            [
              "rgb(213, 166, 189)",
              "rgb(204, 65, 37)",
              "rgb(224, 102, 102)",
              "rgb(246, 178, 107)",
              "rgb(255, 217, 102)",
              "rgb(147, 196, 125)",
              "rgb(118, 165, 175)",
              "rgb(109, 158, 235)",
              "rgb(111, 168, 220)",
              "rgb(142, 124, 195)",
            ],
            [
              "rgb(194, 123, 160)",
              "rgb(166, 28, 0)",
              "rgb(204, 0, 0)",
              "rgb(230, 145, 56)",
              "rgb(241, 194, 50)",
              "rgb(106, 168, 79)",
              "rgb(69, 129, 142)",
              "rgb(60, 120, 216)",
              "rgb(61, 133, 198)",
              "rgb(103, 78, 167)",
            ],
            [
              "rgb(166, 77, 121)",
              "rgb(133, 32, 12)",
              "rgb(153, 0, 0)",
              "rgb(180, 95, 6)",
              "rgb(191, 144, 0)",
              "rgb(56, 118, 29)",
              "rgb(19, 79, 92)",
              "rgb(17, 85, 204)",
              "rgb(11, 83, 148)",
              "rgb(53, 28, 117)",
            ],
            [
              "rgb(116, 27, 71)",
              "rgb(91, 15, 0)",
              "rgb(102, 0, 0)",
              "rgb(120, 63, 4)",
              "rgb(127, 96, 0)",
              "rgb(39, 78, 19)",
              "rgb(12, 52, 61)",
              "rgb(28, 69, 135)",
              "rgb(7, 55, 99)",
              "rgb(32, 18, 77)",
            ],
          ],
          move: function(tinycolor) {
            _self.updateColor(this, tinycolor);
          },
          change: function(tinycolor) {
            _self.updateColor(this, tinycolor);
          },
          hide: function(tinycolor) {
            _self.updateColor(this, tinycolor);
          },
        });
      });
      if (oui.browser.ie && (oui.browser.ie + "").indexOf("9") >= 0) {
        $("[type=spectrum]").each(function() {
          $(this).data("initColor", true);
          var color = $(this).attr("value");

          $(this).spectrum({
            //        theme: "sp-light",
            color: color,
            //        containerClassName:'awesome',
            preferredFormat: "rgb",
            preferredFormat: "hex",
            //                flat: true,
            showInput: true,
            move: function(tinycolor) {
              _self.updateColor(this, tinycolor);
            },
            change: function(tinycolor) {
              _self.updateColor(this, tinycolor);
            },
            hide: function(tinycolor) {
              _self.updateColor(this, tinycolor);
            },
          });
        });
      }
    },
    updateColor: function(el, tinycolor) {
      var _self = this;
      var color_result;
      if (tinycolor) {
        color_result = tinycolor.toHexString();
      } else {
        color_result = "";
      }

      $(el).attr("value", color_result);
      $(el).css("background-color", color_result);
      $(el)
        .next(".set-color-info")
        .text(color_result || "transparent");
      var invokeProp = $(el).attr("invoke-prop");
      invokeProp &&
        oui.JsonPathUtil.setObjByPath(
          invokeProp,
          _self.data,
          color_result,
          true
        );
      var fun = $(el).attr("invoke-fun");
      if (fun && _self[fun]) {
        _self[fun]({
          el: el,
          value: color_result,
        });
      }
    },
    /** 重置表格布局，或明细表 的编辑状态*****/
    resetTableLineEditStateBy: function(fun) {
      var me = this;
      var map = me.tableLinesMap || {};
      var selector = [];
      for (var id in map) {
        var curr = map[id];

        if (curr) {
          if (fun) {
            if (fun(curr)) {
              curr.style.isDragging4SelectArea = false;
              selector.push("#" + id + ".drag-select-area");
            }
          } else {
            curr.style.isDragging4SelectArea = false;
            selector.push("#" + id + ".drag-select-area");
          }
        }
      }
      if (selector && selector.length) {
        $(selector.join(","))
          .removeClass("drag-select-area")
          .find("[oui-e-click=event2editTable]")
          .attr("title", "编辑完成");
      }
    },
    bindDragEvents: function() {
      var me = this;
      /** 比较 两个图形的位置，返回相同的位置 数组****/
      var compareRect = function(curr, item) {
        var arr = [];
        var currLeft = curr.style.left;
        var currTop = curr.style.top;
        var currWidth = curr.style.width;
        var currHeight = curr.style.height;

        var targetLeft = item.style.left;
        var targetTop = item.style.top;
        var targetWidth = item.style.width;
        var targetHeight = item.style.height;

        if (
          Math.abs(currLeft - targetLeft) < 1 ||
          Math.abs(currLeft - targetLeft - targetWidth) < 1
        ) {
          arr.push("left");
        }
        if (
          Math.abs(currLeft + currWidth - (targetLeft + targetWidth)) < 1 ||
          Math.abs(currLeft + currWidth - targetLeft) < 1
        ) {
          arr.push("right");
        }

        if (
          Math.abs(
            (currLeft * 2 + currWidth) / 2 - (targetLeft * 2 + targetWidth) / 2
          ) < 1
        ) {
          arr.push("center");
        }
        if (
          Math.abs(currTop - targetTop) < 1 ||
          Math.abs(currTop - targetTop - targetHeight) < 1
        ) {
          arr.push("top");
        }
        if (
          Math.abs(currTop + currHeight - (targetTop + targetHeight)) < 1 ||
          Math.abs(currTop + currHeight - targetTop) < 1
        ) {
          arr.push("bottom");
        }

        if (
          Math.abs(
            (currTop * 2 + currHeight) / 2 - (targetTop * 2 + targetHeight) / 2
          ) < 1
        ) {
          arr.push("middle");
        }
        return arr;
      };
      var compareRects = function(curr, items) {
        var arr = [];
        for (var i = 0, len = items.length; i < len; i++) {
          if (curr.id == items[i].id) {
            continue;
          }
          var currArr = compareRect(curr, items[i]);
          for (var j = 0, clen = currArr.length; j < clen; j++) {
            if (arr.indexOf(currArr[j]) < 0) {
              arr.push(currArr[j]);
            }
          }
        }
        return arr;
      };
      this.bindDrag({
        operationSelector: ".design-operation-layer", //操作层拖拽
        //disable不能拖拽，复制，删除，编辑表格不能拖拽
        cancelSelector:
          ".control-abs-disable,.design-copy-ctrl,.design-del-ctrl,.tableLine-edit-icon,.proxy-drag-placeholder,.proxy-dragging-select-area", //不允许拖拽元素
        dragSelector: ".design-item,.control-abs-component", //可拖拽元素
        proxyDragSelector: ".proxy-drag", //拖拽代理元素
        scrollContainer: ".design-middle", //内容容器，滚动条滚动所在的容器
        dragScrollContainer: ".design-ctrl-area", //拖拽元素区域的容器【新建控件区域列表】
        dropContainer: ".paper-area", //放置元素区域的容器
        down: function(cfg) {
          var e = cfg.e,
            el = cfg.el,
            isUpdate = cfg.isUpdate,
            isResizer = cfg.isResizer;
          /** 拖拽前校验**/
          var flag = me.checkData();
          if (me.isRenderAll) {
            me.currDragEl = el;
            return false;
          }
          if (!flag) {
            return false;
          }
          if (isUpdate) {
            if (
              me.currAccordingActiveId == "absoluteProps-pageProps-base" ||
              me.currAccordingActiveId == "absoluteProps-pageProps-setttings"
            ) {
              me.currAccordingActiveId = "";
            }
            //拖拽的是操作层
            //不同层做高亮
            $(".active", ".paper-area").removeClass("active");
            $(el).addClass("active");
            var id = el.getAttribute("id");
            if (id) {
              // 内容种的元素拖拽，选中时，显示属性面板
              me.resetTableLineEditStateBy(function(item) {
                if (item.id != id) {
                  return true;
                }
              });
              var currentControl = me.getControlById(id);
              if (me.data.currentControl.id != id) {
                me.currAccordingActiveId = "";
              }
              if (
                currentControl.htmlType == "tableLine" &&
                !me.isDragging4SelectArea(currentControl)
              ) {
                //非编辑状态 不用显示操作层
                me.hideOperationArea();
              } else {
                // 获取上一次 的区域选择
                //判断当前操作是否是右键操作
                // me.selectRect //TODO 待定右键菜单功能
                //选择单元格
                me.showOperationArea(currentControl, cfg);
              }
              me.setCurrPropsData(currentControl, "center", "down2selectField");
            }
          } else {
            me.resetTableLineEditStateBy(function(item) {
              return true;
            });
            //me.activeTab=0;
            //me.currAccordingActiveId='';
            //me.setCurrPropsData({},'center','drag2newField');
          }
          //console.log('isRenderAll:'+me.isRenderAll);
          me.data.tempControl = {}; //清空临时数据
        },
        //move:function(cfg){
        //    var e=cfg.e,el=cfg.el,isUpdate=cfg.isUpdate,isResizer=cfg.isResizer;
        //    console.log(cfg);
        //    //findRectByPosOrRect
        //},
        //up:function(e,el,isUpdate,isResizer){
        //
        //},
        dragStart: function(cfg) {
          var e = cfg.e,
            el = cfg.el,
            $proxy = cfg.$proxyDrag,
            isUpdate = cfg.isUpdate,
            isResizer = cfg.isResizer;
          /*
                     e:ev, el:el, isUpdate:isUpdate, isResizer:isResizer,
                     resizeRowIndex:resizeRowIndex,
                     resizeColumnIndex:resizeColumnIndex,
                     isResizerRow:isResizerRow,
                     isResizerColumn:isResizerColumn,
                     $proxyDrag:$proxyDrag
                     */

          //console.log('isRenderAll:'+me.isRenderAll);
          if (me.isRenderAll) {
            me.currDragEl = el;
            return false;
          }
          if ($(el).hasClass("control-abs-tableLine")) {
            //拖拽表格 场景 需要在代理层显示 按钮
            $proxy.find(".tableLine-drag-icon,.tableLine-edit-icon").show();
          } else {
            $proxy.find(".tableLine-drag-icon,.tableLine-edit-icon").hide();
          }
          if ($(el).hasClass("control-abs-component")) {
            $proxy.addClass("control-abs-component");
          } else {
            $proxy.removeClass("control-abs-component");
          }
          //console.log('dragStart');
          //console.log('curr:'+me.data.currentControl.id);
        },
        dragging: function(cfg) {
          var e = cfg.e,
            el = cfg.el,
            $proxy = cfg.$proxyDrag,
            dragData = cfg.dragData,
            isUpdate = cfg.isUpdate,
            isResizer = cfg.isResizer,
            $proxyPlaceholder = cfg.$proxyPlaceholder;

          if (me.isRenderAll) {
            me.currDragEl = el;
            return false;
          }
          //console.log('isRenderAll:'+me.isRenderAll);
 
          var id = el.getAttribute("id");
          var width = dragData.width;
          var height = dragData.height;
          var left = dragData.x;
          var top = dragData.y;
          if (
            cfg.isResizerColumn &&
            (dragData.resizeColumnIndex == 0 ||
              dragData.resizeColumnIndex == dragData.lineColumnLength - 1)
          ) {
            //宽度调整
            width = dragData.resizeWidth;
            if (dragData.resizeColumnIndex == 0) {
              left = dragData.resizeX;
            }
          }
          if (
            cfg.isResizerRow &&
            (dragData.resizeRowIndex == 0 ||
              dragData.resizeRowIndex == dragData.lineRowLength - 1)
          ) {
            //宽度调整
            height = dragData.resizeHeight;
            if (dragData.resizeRowIndex == 0) {
              top = dragData.resizeY;
            }
          }
          if (!(cfg.isResizerRow || cfg.isResizerColumn || cfg.isSelectArea)) {
            me.hideOperationArea();
          }
          var arr = [];
          if (!cfg.isSelectArea) {
            // 如果当前拖拽层 只是 选择表格中的区域 则 不用显示 参考线
            arr = compareRects(
              {
                id: id,
                style: {
                  left: left,
                  top: top,
                  width: width,
                  height: height,
                },
              },
              me.findItems()
            );
          } else {
            //拖拽选择区域 ,代理层高亮显示 处理
          }

          if (me.timer4proxyLine) {
            try {
              clearTimeout(me.timer4proxyLine);
              me.timer4proxyLine = null;
            } catch (err) {}
          }
          var hideLines = "left,center,right,top,middle,bottom".split(",");
          if (arr && arr.length) {
            //显示当前 代理层 对应的边线
            var selector = [];
            for (var i = 0, len = arr.length; i < len; i++) {
              selector.push(".proxy-line-" + arr[i]);
              var hideIdx = hideLines.indexOf(arr[i]);
              if (hideIdx > -1) {
                hideLines.splice(hideIdx, 1);
              }
            }
            if (selector.length) {
              /** 延迟显示线条 利于性能优化****/
              me.timer4proxyLine = setTimeout(function() {
                $proxy.find(selector.join(",")).addClass("display-block");
                me.timer4proxyLine = null;
              }, 16.7);
            }
          }
          if (hideLines && hideLines.length) {
            var hideLineSelector =
              ".proxy-line-" + hideLines.join(",.proxy-line-");
            $proxy.find(hideLineSelector).removeClass("display-block");
          }

          var currentControl;
          if (isUpdate) {
            if (!me.data.currentControl || me.data.currentControl.id != id) {
              currentControl = me.getControlById(id);
            } else {
              currentControl = me.data.currentControl;
            }
            if (left < 0) {
              left = 0;
            }
            if (top < 0) {
              top = 0;
            }
            currentControl.style.left = left;
            currentControl.style.top = top;
            currentControl.style.width = width;
            currentControl.style.height = height;
          } else {
            currentControl = {
              parentId: $(el).attr(me.controlDomAttrPrefix + "parentId"),
              detailId: $(el).attr(me.controlDomAttrPrefix + "detailId"),
              bizId: $(el).attr(me.controlDomAttrPrefix + "bizId"),
              htmlType: $(el).attr(me.controlDomAttrPrefix + "htmlType"),
              style: {
                left: left,
                top: top,
                width: width,
                height: height,
              },
            };
          }
          currentControl.otherAttrs = currentControl.otherAttrs || {}; //业务属性
          currentControl.name = currentControl.name || $.trim($(el).text());

          var mousePos4realtive = {
            left: dragData.mouseX4relative,
            top: dragData.mouseY4relative,
          };

          var isInTableLine = false;
          $proxyPlaceholder.removeClass("proxy-drag-placeholder-normalForm"); //非瀑布流占位
          /** 表格控件 内部不能再拖拽 表格控件 , 截取 页面*****/
          if (
            !isResizer &&
            currentControl.htmlType != "tableLine" &&
            currentControl.htmlType != "selectArea"
          ) {
            var rect = me.findRectByPosOrRect(mousePos4realtive);
            if (
              rect.tableLineId &&
              rect.columnIndex > -1 &&
              rect.rowIndex > -1
            ) {
              isInTableLine = true;
              //绘制 占位层 - scrollContainerLeft + dropPos.x
              $proxyPlaceholder.css({
                display: "block",
                "z-index": 999,
                left:
                  rect.left -
                  dragData.scrollContainerLeft +
                  dragData.dropPos.x +
                  "px",
                top:
                  rect.top -
                  dragData.scrollContainerTop +
                  dragData.dropPos.y +
                  "px",
                width: rect.right - rect.left + "px",
                height: rect.bottom - rect.top + "px",
              });
            } else {
              $proxyPlaceholder.css({
                display: "none",
              });
            }
          } else if (cfg.isSelectArea) {
            //当前拖拽的目的是选择区域 则进行 高亮占位计算处理
            //此处是 计算 拖拽区域的显示 用于 选择表格中的多个单元格，用于合并，拆分等 多个单元格的批量设置操作
            var rect = me.findRectBySelectArea(currentControl, dragData);
            if (rect) {
              //选择列
              //选择行
              //选择单元格
              //$proxyPlaceholder.css({
              //    display:'block',
              //    'z-index':999,
              //    left:(rect.left-dragData.scrollContainerLeft+dragData.dropPos.x)+'px',
              //    top:(rect.top-dragData.scrollContainerTop+dragData.dropPos.y)+'px',
              //    width:(rect.right-rect.left)+'px',
              //    height:(rect.bottom-rect.top)+'px'
              //});
              me.showOperationSelectByTableLineSelectRect(currentControl, rect);
            } else {
              $proxyPlaceholder.css({
                display: "none",
              });
            }
          }
          if (!cfg.isSelectArea && !isInTableLine) {
            //非选择区域，拖拽的目的 是为了放置控件
            if (
              me.data.pageDesignType &&
              me.data.pageDesignType == "normalForm" &&
              !isResizer
            ) {
              //查找控件占位
              var targetControl = me.findControlByPosOrRect(
                mousePos4realtive,
                currentControl
              ); //在指定控件位置下方放置占位
              if (targetControl) {
                $proxyPlaceholder.addClass("proxy-drag-placeholder-normalForm"); //瀑布流占位
                var atTop = me.isPosAtControlHaffTop(
                  targetControl,
                  mousePos4realtive
                ); 
            
                if (atTop) {
                  //插入到前面
                  $proxyPlaceholder.css({
                    display: "block",
                    "z-index": 999,
                    left:
                      targetControl.style.left -
                      dragData.scrollContainerLeft +
                      dragData.dropPos.x +
                      "px",
                    top:
                      targetControl.style.top -
                      dragData.scrollContainerTop +
                      dragData.dropPos.y +
                      "px",
                    width: currentControl.style.width + "px",
                    height: 20 + "px",
                  });
                } else {
                  //插入到后面
                  $proxyPlaceholder.css({
                    display: "block",
                    "z-index": 999,
                    left:
                      targetControl.style.left -
                      dragData.scrollContainerLeft +
                      dragData.dropPos.x +
                      "px",
                    top:
                      targetControl.style.top +
                      targetControl.style.height -
                      dragData.scrollContainerTop +
                      dragData.dropPos.y +
                      "px",
                    width: currentControl.style.width + "px",
                    height: 20 + "px",
                  });
                }
                //console.log('找到了占位控件:'+(targetControl&&targetControl.htmlType));
                //console.log(targetControl);
              } else {
                //没有找到占位，就插入到最后
                //console.log('没找到到了占位控件:'+(targetControl&&targetControl.htmlType));
                //console.log(targetControl);
              }
            }
          }
          // 拖拽过程不需要处理当前控件， 存在性能问题
          if (me.data.currentControl != currentControl) {
            me.setCurrPropsData(currentControl, "center", "draggingField");
          }
          //me.setCurrPropsData(currentControl, 'center', 'draggingField');
        },
        dragEnd: function(cfg) {
          var e = cfg.e,
            el = cfg.el,
            $proxy = cfg.$proxyDrag,
            dragData = cfg.dragData,
            isUpdate = cfg.isUpdate,
            isResizer = cfg.isResizer;
     
          /*
                     e:ev, el:el, isUpdate:isUpdate, isResizer:isResizer,
                     resizeRowIndex:resizeRowIndex,
                     resizeColumnIndex:resizeColumnIndex,
                     isResizerRow:isResizerRow,
                     isResizerColumn:isResizerColumn,
                     $proxyDrag:$proxyDrag,
                     dragData:dragData
                     */
          if (me.isRenderAll) {
            me.currDragEl = el;
            return false;
          }
          //console.log(cfg);
          me.dragEndControl(cfg);
        },
      });
    },
    bindEvents: function() {
      var me = this;
      //this.bindSortEvents();
      this.bindMessageEvents();
      this.bindDragEvents();
      this.bindControlPropsTitleEvents();
      this.bindScrollEvents();
      this.bindCheckEvents();
      this.bindColorChangeEvents();
      this.bindHidePaperTypeSelectEvents();
      this.bindBeforeUnloadEvents();
      this.bindHotKeyEvents();
    },
    bindMessageEvents: function() {
      //消息监听
      var me = this;
      window.addEventListener(
        "message",
        function(event) {
          var data = event.data;
          if (typeof data == "string") {
            return;
          }
          if (typeof data == "object") {
            //在本类中的方法负责接收消息处理
            if (data.cmd && data.param) {
              console.log("page-design:" + data.cmd);
              console.log(data);
              me[data.cmd] && me[data.cmd](data.param, event);
            }
          }
        },
        false
      );
    },
    bindSortEvents: function() {},
    bindEvent4ie: function() {
      if (oui.browser.ie || oui.browser.isEdge) {
      }
    },
    /** 快捷键事件绑定****/
    bindHotKeyEvents: function() {
      var me = this;
      $(document).bind("keydown", "up", function(e) {
        var currControl = me.data.currentControl;
        if (currControl && currControl.id) {
          currControl.style.top -= 1;
          if (currControl.style.top < 0) {
            currControl.style.top = 0;
          }
          me.updateCurrControlStyle();
        }
        return false;
      });
      $(document).bind("keydown", "left", function(e) {
        var currControl = me.data.currentControl;
        if (currControl && currControl.id) {
          currControl.style.left -= 1;
          if (currControl.style.left < 0) {
            currControl.style.left = 0;
          }
          me.updateCurrControlStyle();
        }

        return false;
      });
      $(document).bind("keydown", "down", function(e) {
        var currControl = me.data.currentControl;
        if (currControl && currControl.id) {
          currControl.style.top += 1;
          me.updateCurrControlStyle();
        }

        return false;
      });
      $(document).bind("keydown", "right", function(e) {
        var currControl = me.data.currentControl;
        if (currControl && currControl.id) {
          currControl.style.left += 1;
          me.updateCurrControlStyle();
        }
        return false;
      });
    },

    /** 页面离开事件****/
    bindBeforeUnloadEvents: function() {
      var me = this;
      window.onunload = function() {
        $("body").remove();
        $("html").remove();
        console.log("destroy...");
        oui.biz.Tool.Clear(window);
        window.setTimeout = function() {};
        window = null;
      };
      window.onbeforeunload = function(e) {
        if (me.hasSaveData()) {
          return;
        }
        return ((e || window.event).returnValue = "有信息未保存");
      };
    },
    hasSaveData: function() {
      return !this.hasChange;
    },
    changeDesignView: function() {
      //TODO 设计器调整后，变更设计器外观系列
    },
    designChanged: function() {
      if (this.inited) {
        this.hasChange = true;
        this.changeDesignView();
      }
    },
    bindHidePaperTypeSelectEvents: function() {
      $(document).on("mousedown", "body", function(e) {
        /** 下拉区域内不做处理***/
        if (oui.isInDom(e.target, ".design-select-paper")) {
          return;
        }
        $(".show-list").removeClass("show-list"); //隐藏下拉框
      });
    },
    refreshTableLineMergeCell: function(tableLine, columnIndex, rowIndex) {
      var mergeCellsMap = tableLine.style.mergeCellsMap || {};
      var tableLeft = tableLine.style.left;
      var tableTop = tableLine.style.top;
      var borderLeftWidth = tableLine.style.borderLeftWidth;
      var borderTopWidth = tableLine.style.borderTopWidth;
      var columns = tableLine.style.columnLines || [];
      var rows = tableLine.style.rowLines || [];

      var cell = mergeCellsMap[columnIndex + "_" + rowIndex];
      if (cell) {
        var sc = cell.startColumnIndex;
        var sr = cell.startRowIndex;
        var ec = cell.endColumnIndex + 1;
        var er = cell.endRowIndex + 1;
        var left =
          tableLeft +
          borderLeftWidth +
          columns[sc].config.lineHeight +
          columns[sc].fromPos.left;
        var top =
          tableTop +
          borderTopWidth +
          rows[sr].config.lineHeight +
          rows[sr].fromPos.top;
        var right = tableLeft + borderLeftWidth + columns[ec].fromPos.left;
        var bottom = tableTop + borderTopWidth + rows[er].fromPos.top;
        cell.left = left;
        cell.top = top;
        cell.right = right;
        cell.bottom = bottom;
      }
    },
    /** 刷新合并单元格 的 位置****/
    refreshTableLineMergeCells: function(tableLine, columnIndex, rowInex) {
      var me = this;
      if (tableLine.htmlType != "tableLine") {
        return;
      }
      /** 刷新指定 单元格****/
      if (typeof columnIndex != "undefined" && typeof rowInex != "undefined") {
        me.refreshTableLineMergeCell(tableLine, columnIndex, rowInex);
      } else {
        //更新所有
        var mergeCellsMap = tableLine.style.mergeCellsMap || {};
        for (var i in mergeCellsMap) {
          var cell = mergeCellsMap[i];
          if (cell) {
            var sc = cell.startColumnIndex;
            var sr = cell.startRowIndex;
            me.refreshTableLineMergeCell(tableLine, sc, sr);
          }
        }
      }
    },
    /** 刷新合并单元格 中控件 的 位置****/
    refreshTableLineMergeCellControls: function(
      tableLine,
      callback,
      filter,
      columnIndex,
      rowIndex
    ) {
      var me = this;
      if (tableLine.htmlType != "tableLine") {
        return;
      }
      /** 刷新指定 单元格****/
      if (typeof columnIndex != "undefined" && typeof rowIndex != "undefined") {
        me.refreshTableLineMergeCellControl(
          tableLine,
          columnIndex,
          rowIndex,
          callback,
          filter
        );
      } else {
        //更新所有
        var mergeCellsMap = tableLine.style.mergeCellsMap || {};
        for (var i in mergeCellsMap) {
          var cell = mergeCellsMap[i];
          if (cell) {
            var sc = cell.startColumnIndex;
            var sr = cell.startRowIndex;
            me.refreshTableLineMergeCellControl(
              tableLine,
              sc,
              sr,
              callback,
              filter
            );
          }
        }
      }
    },
    /** 刷新合并单元格中控件的位置****/
    refreshTableLineMergeCellControl: function(
      tableLine,
      columnIndex,
      rowIndex,
      callback,
      filter
    ) {
      var me = this;
      var mergeCellsMap = tableLine.style.mergeCellsMap || {};
      var tableLeft = tableLine.style.left;
      var tableTop = tableLine.style.top;
      var borderLeftWidth = tableLine.style.borderLeftWidth;
      var borderTopWidth = tableLine.style.borderTopWidth;
      var columns = tableLine.style.columnLines || [];
      var rows = tableLine.style.rowLines || [];

      var cell = mergeCellsMap[columnIndex + "_" + rowIndex];
      if (cell) {
        if (filter) {
          var flag = filter(cell, tableLine);
          if (typeof flag == "boolean") {
            if (!flag) {
              return;
            }
          }
        }
        var sc = cell.startColumnIndex;
        var sr = cell.startRowIndex;
        var ec = cell.endColumnIndex + 1;
        var er = cell.endRowIndex + 1;
        var left =
          tableLeft +
          borderLeftWidth +
          columns[sc].config.lineHeight +
          columns[sc].fromPos.left;
        var top =
          tableTop +
          borderTopWidth +
          rows[sr].config.lineHeight +
          rows[sr].fromPos.top;
        var right = tableLeft + borderLeftWidth + columns[ec].fromPos.left;
        var bottom = tableTop + borderTopWidth + rows[er].fromPos.top;
        cell.left = left;
        cell.top = top;
        cell.right = right;
        cell.bottom = bottom;
        var rect = me.findRectInTableLineByColumnAndRow(
          tableLine,
          columnIndex,
          rowIndex
        );
        if (rect && rect.controlId && rect.tableLineId) {
          var isChange = false;
          var control = me.getControlById(rect.controlId);
          if (rect.left != left) {
            rect.left = left;
            isChange = true;
          }
          if (rect.right != right) {
            rect.right = right;
            isChange = true;
          }
          if (rect.top != top) {
            rect.top = top;
            isChange = true;
          }
          if (rect.bottom != bottom) {
            rect.bottom = bottom;
            isChange = true;
          }

          if (control.style.left != rect.left) {
            control.style.left = rect.left;
            isChange = true;
          }
          if (control.style.top != rect.top) {
            control.style.top = rect.top;
            isChange = true;
          }
          if (control.style.width != rect.right - rect.left) {
            control.style.width = rect.right - rect.left;
            isChange = true;
          }
          if (control.style.height != rect.bottom - rect.top) {
            control.style.height = rect.bottom - rect.top;
            isChange = true;
          }
          control.style.rect = rect;
          me.setRectInTableLineByColumnAndRow(tableLine, rect);
          callback && callback(control, cell, isChange);
        }
      }
    },
    updateTableLines: function(currField, cfg) {
      var me = this;
      var e = cfg.e,
        el = cfg.el,
        $proxy = cfg.$proxyDrag,
        dragData = cfg.dragData,
        isUpdate = cfg.isUpdate,
        isResizer = cfg.isResizer,
        isResizerRow = cfg.isResizerRow,
        isResizerColumn = cfg.isResizerColumn;
      /** 对于 控件宽度调整的处理*****/
      if (
        cfg.isResizerColumn &&
        (dragData.resizeColumnIndex == 0 ||
          dragData.resizeColumnIndex == dragData.lineColumnLength - 1)
      ) {
        currField.style.width = dragData.resizeWidth;
        if (dragData.resizeColumnIndex == 0) {
          if (dragData.resizeX < 0) {
            dragData.resizeX = 0;
          }
          currField.style.left = dragData.resizeX;
        }
      }
      /** 对于 控件高度调整的处理*****/
      if (
        cfg.isResizerRow &&
        (dragData.resizeRowIndex == 0 ||
          dragData.resizeRowIndex == dragData.lineRowLength - 1)
      ) {
        //宽度调整
        currField.style.height = dragData.resizeHeight;
        if (dragData.resizeY < 0) {
          dragData.resizeY = 0;
        }
        if (dragData.resizeRowIndex == 0) {
          currField.style.top = dragData.resizeY;
        }
      }
      if (isResizerColumn) {
        var resizeColumnIndex = dragData.resizeColumnIndex;
        var resizeFix = dragData.resizeLeft - dragData.startResizeLeft;
        var lastLeft =
          currField.style.columnLines[resizeColumnIndex].fromPos.left;
        currField.style.columnLines[resizeColumnIndex].fromPos.left =
          lastLeft + resizeFix;

        //改变宽度
        if (
          resizeColumnIndex == 0 ||
          resizeColumnIndex == dragData.lineColumnLength - 1
        ) {
          if (resizeColumnIndex == 0) {
            /** 列宽调整****/
            var currLeft =
              currField.style.columnLines[resizeColumnIndex].fromPos.left;
            if (dragData.resizeWidth < 34) {
              resizeFix = 34 - dragData.resizeWidth;
            }

            var columnLines = currField.style.columnLines || [];

            if (dragData.startX + resizeFix < 0) {
              resizeFix = -dragData.startX;
              currField.style.columnLines[resizeColumnIndex].fromPos.left =
                lastLeft + resizeFix;
              currLeft =
                currField.style.columnLines[resizeColumnIndex].fromPos.left;
              currField.style.left = 0;
            } else {
              currField.style.width = dragData.startWidth - resizeFix;
              currField.style.left = dragData.startX + resizeFix;
            }

            for (var i = 0, len = columnLines.length; i < len; i++) {
              columnLines[i].fromPos.left -= currLeft;
              columnLines[i].toPos.left -= currLeft;
            }
            var rectNextWidth =
              columnLines[resizeColumnIndex + 1].fromPos.left -
              columnLines[resizeColumnIndex].fromPos.left -
              columnLines[resizeColumnIndex].config.lineHeight;
            if (rectNextWidth < 34) {
              rectNextWidth = 34;
              var newLeft =
                columnLines[resizeColumnIndex + 1].fromPos.left -
                columnLines[resizeColumnIndex].config.lineHeight -
                rectNextWidth;
              var fix = newLeft - columnLines[resizeColumnIndex].fromPos.left;
              columnLines[resizeColumnIndex].fromPos.left = newLeft;
              currLeft = newLeft;
              currField.style.width = currField.style.width - fix;
              currField.style.left = currField.style.left + fix;
              for (var i = 0, len = columnLines.length; i < len; i++) {
                columnLines[i].fromPos.left -= currLeft;
                columnLines[i].toPos.left -= currLeft;
              }
            }
          } else {
            /** 调整宽度即可***/
            if (dragData.resizeWidth < 34) {
              resizeFix = 34 - dragData.startWidth;
            }
            currField.style.width = dragData.startWidth + resizeFix;
            var rectCurrWidth =
              currField.style.columnLines[resizeColumnIndex].fromPos.left -
              currField.style.columnLines[resizeColumnIndex - 1].fromPos.left -
              currField.style.columnLines[resizeColumnIndex - 1].config
                .lineHeight;
            if (rectCurrWidth < 34) {
              rectCurrWidth = 34;
              var newLeft =
                rectCurrWidth +
                currField.style.columnLines[resizeColumnIndex - 1].fromPos
                  .left +
                currField.style.columnLines[resizeColumnIndex - 1].config
                  .lineHeight;
              var fix =
                newLeft -
                currField.style.columnLines[resizeColumnIndex].fromPos.left;
              currField.style.width = currField.style.width + fix;
              currField.style.columnLines[
                resizeColumnIndex
              ].fromPos.left = newLeft;
            }
          }
        } else {
          //中间线条改变的调整逻辑 处理 宽度 默认34
          //改变当前列宽度，并且改变后续所有线条位置，改变宽度位置
          var rectCurrWidth =
            currField.style.columnLines[resizeColumnIndex].fromPos.left -
            currField.style.columnLines[resizeColumnIndex - 1].fromPos.left -
            currField.style.columnLines[resizeColumnIndex - 1].config
              .lineHeight;
          if (rectCurrWidth < 34) {
            rectCurrWidth = 34;
            currField.style.columnLines[resizeColumnIndex].fromPos.left =
              currField.style.columnLines[resizeColumnIndex - 1].fromPos.left +
              currField.style.columnLines[resizeColumnIndex - 1].config
                .lineHeight +
              rectCurrWidth;
          }
          resizeFix =
            currField.style.columnLines[resizeColumnIndex].fromPos.left -
            lastLeft;
          currField.style.width += resizeFix;
          for (
            var i = resizeColumnIndex + 1;
            i < dragData.lineColumnLength;
            i++
          ) {
            currField.style.columnLines[i].fromPos.left += resizeFix;
            if (currField.style.columnLines[i].toPos) {
              currField.style.columnLines[i].toPos.left =
                currField.style.columnLines[i].fromPos.left;
            }
          }
        }
      } else if (isResizerRow) {
        var resizeRowIndex = dragData.resizeRowIndex;
        var resizeFix = dragData.resizeTop - dragData.startResizeTop;
        var lastTop = currField.style.rowLines[resizeRowIndex].fromPos.top;
        currField.style.rowLines[resizeRowIndex].fromPos.top =
          lastTop + resizeFix;
        //改变高度
        if (
          resizeRowIndex == 0 ||
          resizeRowIndex == dragData.lineRowLength - 1
        ) {
          //改变 高度
          if (resizeRowIndex == 0) {
            /** 行高调整和位置调整****/
            var currTop = currField.style.rowLines[resizeRowIndex].fromPos.top;
            if (dragData.resizeHeight < 34) {
              resizeFix = 34 - dragData.startHeight;
            }
            if (dragData.startY + resizeFix < 0) {
              resizeFix = -dragData.startY;
              currField.style.rowLines[resizeRowIndex].fromPos.top =
                lastTop + resizeFix;
              currTop = currField.style.rowLines[resizeRowIndex].fromPos.top;
              currField.style.top = 0;
            } else {
              currField.style.height = dragData.startHeight - resizeFix;
              currField.style.top = dragData.startY + resizeFix;
            }
            var rowLines = currField.style.rowLines || [];
            for (var i = 0, len = rowLines.length; i < len; i++) {
              rowLines[i].fromPos.top -= currTop;
              rowLines[i].toPos.top -= currTop;
            }

            var rectNextHeight =
              rowLines[resizeRowIndex + 1].fromPos.top -
              rowLines[resizeRowIndex].fromPos.top -
              rowLines[resizeRowIndex].config.lineHeight;
            if (rectNextHeight < 34) {
              rectNextHeight = 34;
              var newTop =
                rowLines[resizeRowIndex + 1].fromPos.top -
                rowLines[resizeRowIndex].config.lineHeight -
                rectNextHeight;
              var fix = newTop - rowLines[resizeRowIndex].fromPos.top;
              rowLines[resizeRowIndex].fromPos.top = newTop;
              currTop = newTop;
              currField.style.height = currField.style.height - fix;
              currField.style.top = currField.style.top + fix;
              for (var i = 0, len = rowLines.length; i < len; i++) {
                rowLines[i].fromPos.top -= currTop;
                rowLines[i].toPos.top -= currTop;
              }
            }
          } else {
            /** 调整高度即可***/
            if (dragData.resizeHeight < 34) {
              resizeFix = dragData.startHeight - 34;
            }
            currField.style.height = dragData.startHeight + resizeFix;

            var rectCurrHeight =
              currField.style.rowLines[resizeRowIndex].fromPos.top -
              currField.style.rowLines[resizeRowIndex - 1].fromPos.top -
              currField.style.rowLines[resizeRowIndex - 1].config.lineHeight;
            if (rectCurrHeight < 34) {
              rectCurrHeight = 34;
              var newTop =
                rectCurrHeight +
                currField.style.rowLines[resizeRowIndex - 1].fromPos.top +
                currField.style.rowLines[resizeRowIndex - 1].config.lineHeight;
              var fix =
                newTop - currField.style.rowLines[resizeRowIndex].fromPos.top;
              currField.style.height = currField.style.height + fix;
              currField.style.rowLines[resizeRowIndex].fromPos.top = newTop;
            }
          }
        } else {
          //中间线条改变的调整逻辑 处理 宽度 默认34
          var rectCurrHeight =
            currField.style.rowLines[resizeRowIndex].fromPos.top -
            currField.style.rowLines[resizeRowIndex - 1].fromPos.top -
            currField.style.rowLines[resizeRowIndex - 1].config.lineHeight;
          if (rectCurrHeight < 34) {
            rectCurrHeight = 34;
            currField.style.rowLines[resizeRowIndex].fromPos.top =
              currField.style.rowLines[resizeRowIndex - 1].fromPos.top +
              currField.style.rowLines[resizeRowIndex - 1].config.lineHeight +
              rectCurrHeight;
          }
          resizeFix =
            currField.style.rowLines[resizeRowIndex].fromPos.top - lastTop;
          currField.style.height += resizeFix;
          for (var i = resizeRowIndex + 1; i < dragData.lineRowLength; i++) {
            currField.style.rowLines[i].fromPos.top += resizeFix;
            if (currField.style.rowLines[i].toPos) {
              currField.style.rowLines[i].toPos.top =
                currField.style.rowLines[i].fromPos.top;
            }
          }
        }
      }
      me.updateTableLineControl4Border(currField); //外框处理,外框线条错位处理
    },
    updateControlRect4Border: function(currentControl) {
      var me = this;
      me.updateControlRect(currentControl, {
        dragData: {
          startWidth: currentControl.style.width,
          startHeight: currentControl.style.height,
          width: currentControl.style.width,
          height: currentControl.style.height,
        },
      });
      if (currentControl.htmlType == "tableLine") {
        //变更控件所有位置
        me.updateAllRectsInTableLine(currentControl);
      }
      me.hideOperationArea(); //隐藏 操作区域后，自动恢复显示
    },
    /** 更新表格控件 高宽和线条位置****/
    updateTableLineControl4Border: function(currField, dragData) {
      if (!dragData) {
        dragData = {
          startWidth: currField.style.width,
          startHeight: currField.style.height,
          width: currField.style.width,
          height: currField.style.height,
        };
      }

      var fixWidth = dragData.width - dragData.startWidth;
      var fixHeight = dragData.height - dragData.startHeight;
      //获取倒数第二根线条位置+ 线条宽度
      var lastMinLeft =
        currField.style.columnLines[currField.style.columnLines.length - 2]
          .fromPos.left +
        currField.style.columnLines[currField.style.columnLines.length - 2]
          .config.lineHeight;
      var currLeftValue =
        currField.style.columnLines[currField.style.columnLines.length - 1]
          .fromPos.left + fixWidth;
      if (currLeftValue < lastMinLeft) {
        currLeftValue = lastMinLeft;
      }
      currField.style.columnLines[
        currField.style.columnLines.length - 1
      ].fromPos.left = currLeftValue;
      currField.style.width = parseInt(
        currLeftValue +
          currField.style.columnLines[currField.style.columnLines.length - 1]
            .config.lineHeight +
          currField.style.borderLeftWidth +
          currField.style.borderRightWidth
      );

      //获取倒数第二根线条位置+ 线条宽度
      var lastMinTop =
        currField.style.rowLines[currField.style.rowLines.length - 2].fromPos
          .top +
        currField.style.rowLines[currField.style.rowLines.length - 2].config
          .lineHeight;
      var currTopValue =
        currField.style.rowLines[currField.style.rowLines.length - 1].fromPos
          .top + fixHeight;
      if (currTopValue < lastMinTop) {
        currTopValue = lastMinTop;
      }
      currField.style.rowLines[
        currField.style.rowLines.length - 1
      ].fromPos.top = currTopValue;
      currField.style.height = parseInt(
        currTopValue +
          currField.style.rowLines[currField.style.rowLines.length - 1].config
            .lineHeight +
          currField.style.borderTopWidth +
          currField.style.borderBottomWidth
      );

      // 单元格宽度不能小于34
      var rectCurrWidth =
        currField.style.columnLines[currField.style.columnLines.length - 1]
          .fromPos.left -
        currField.style.columnLines[currField.style.columnLines.length - 2]
          .fromPos.left -
        currField.style.columnLines[currField.style.columnLines.length - 2]
          .config.lineHeight;
      if (rectCurrWidth < 34) {
        rectCurrWidth = 34;
        var newLeft =
          rectCurrWidth +
          currField.style.columnLines[currField.style.columnLines.length - 2]
            .fromPos.left +
          currField.style.columnLines[currField.style.columnLines.length - 2]
            .config.lineHeight;
        var fix =
          newLeft -
          currField.style.columnLines[currField.style.columnLines.length - 1]
            .fromPos.left;
        currField.style.width = parseInt(currField.style.width + fix);
        currField.style.columnLines[
          currField.style.columnLines.length - 1
        ].fromPos.left = newLeft;
      }

      // 单元格高度不能小于34
      var rectCurrHeight =
        currField.style.rowLines[currField.style.rowLines.length - 1].fromPos
          .top -
        currField.style.rowLines[currField.style.rowLines.length - 2].fromPos
          .top -
        currField.style.rowLines[currField.style.rowLines.length - 2].config
          .lineHeight;
      if (rectCurrHeight < 34) {
        rectCurrHeight = 34;
        var newTop =
          rectCurrHeight +
          currField.style.rowLines[currField.style.rowLines.length - 2].fromPos
            .top +
          currField.style.rowLines[currField.style.rowLines.length - 2].config
            .lineHeight;
        var fix =
          newTop -
          currField.style.rowLines[currField.style.rowLines.length - 1].fromPos
            .top;
        currField.style.height = parseInt(currField.style.height + fix);
        currField.style.rowLines[
          currField.style.rowLines.length - 1
        ].fromPos.top = newTop;
      }
    },

    /*** 批量更新 虚拟表格 中控件位置高宽信息
     *
     *
     * TODO 待调整 插入列、删除列、插入行、删除行、调整列宽、调整行高 需要统一更新 所有控件在表格的位置，更新所有合并单元格位置
     *
     *
     * ******/
    updateControlsInTableLine: function(tableLine, cfg) {
      var me = this;
      var columnLines = tableLine.style.columnLines || [];
      var rowLines = tableLine.style.rowLines || [];
      var columnLength = columnLines.length;
      var rowLength = rowLines.length;
      var resizeColumnIndex = cfg.resizeColumnIndex; //改变某列 所有控件
      var resizeRowIndex = cfg.resizeRowIndex; //改变某行 所有控件
      var eachRules = [];
      if (resizeColumnIndex > -1) {
        /** 第一列或者最后一列 只影响  当前列***/
        if (resizeColumnIndex == 0 || resizeColumnIndex == columnLength - 1) {
          eachRules.push({
            startColumnIndex:
              resizeColumnIndex == columnLength - 1
                ? resizeColumnIndex - 1
                : resizeColumnIndex,
            startRowIndex: 0,
            endColumnIndex:
              resizeColumnIndex == columnLength - 1
                ? resizeColumnIndex - 1
                : resizeColumnIndex,
            endRowIndex: rowLength - 2,
          });
        } else {
          eachRules.push({
            startColumnIndex: resizeColumnIndex - 1,
            startRowIndex: 0,
            endColumnIndex: columnLength - 2,
            endRowIndex: rowLength - 2,
          });
        }
      }
      if (resizeRowIndex > -1) {
        /** 第一行或者最后一行 只影响  当前行***/
        if (resizeRowIndex == 0 || resizeRowIndex == rowLength - 1) {
          eachRules.push({
            startColumnIndex: 0,
            startRowIndex:
              resizeRowIndex == rowLength - 1
                ? resizeRowIndex - 1
                : resizeRowIndex,
            endColumnIndex: columnLength - 2,
            endRowIndex:
              resizeRowIndex == rowLength - 1
                ? resizeRowIndex - 1
                : resizeRowIndex,
          });
        } else {
          //影响当前行和后续所有行 调整
          eachRules.push({
            startColumnIndex: 0,
            startRowIndex: resizeRowIndex - 1,
            endColumnIndex: columnLength - 2,
            endRowIndex: rowLength - 2,
          });
        }
      }
      var updateControlsMap = {};
      var updateControlIds = [];
      me.refreshRectsAndMergeCells(tableLine, {
        eachRules: eachRules,
        callback: function() {
          me.refreshControlElsStyleBatch(updateControlIds, updateControlsMap);
        },
        filter: function(rect) {},
        onControlChange: function(control) {
          if (control && control.id) {
            updateControlIds.push(control.id);
            updateControlsMap[control.id] = control;
          }
        },
      });
    },
    /** 批量刷新 多个控件的样式*****/
    refreshControlElsStyleBatch: function(updateControlIds, updateControlsMap) {
      if (!updateControlIds.length) {
        return;
      }
      var selector = "#" + updateControlIds.join(",#");
      $(selector, ".paper-area").each(function() {
        var currEl = this;
        var id = currEl.getAttribute("id");
        var curr = updateControlsMap[id];
        currEl.style.left = curr.style.left + "px";
        currEl.style.top = curr.style.top + "px";
        currEl.style.width = curr.style.width + "px";
        currEl.style.height = curr.style.height + "px";
        updateControlsMap[id] = null;
        delete updateControlsMap[id];
      });
      updateControlIds.length = 0;
      updateControlIds = null;
      updateControlsMap = null;
    },
    updateControlRect: function(currField, cfg) {
      var me = this;
      var e = cfg.e,
        el = cfg.el,
        $proxy = cfg.$proxyDrag,
        dragData = cfg.dragData,
        isUpdate = cfg.isUpdate,
        isResizer = cfg.isResizer,
        isResizerRow = cfg.isResizerRow,
        isResizerColumn = cfg.isResizerColumn;
      if (isResizerColumn || isResizerRow) {
        //改变 表格单元格的宽度 或者高度调整
        //更新表格线条位置
        me.updateTableLines(currField, cfg);
        //改变单元格线条位置后，批量变更 控件位置和宽度
        me.updateControlsInTableLine(currField, cfg);
      } else if (currField.htmlType == "tableLine") {
        //表格控件的 高度或者宽度调整特殊处理
        me.updateTableLineControl4Border(currField, dragData);
        //改变单元格线条位置后，批量变更 控件位置和宽度
        me.updateControlsInTableLine(currField, {
          resizeColumnIndex: currField.style.columnLines.length - 1,
          resizeRowIndex: currField.style.rowLines.length - 1,
        });
        if (el) {
          el.style.width = currField.style.width + "px";
          el.style.height = currField.style.height + "px";
        }
      } else {
        //改变任意控件宽高
        //如果控件在 虚拟表格单元格中， 改变大小时直接剔除 关系
        /** 必须在拖拽过程中才做处理***/
        if (isUpdate && cfg.e) {
          me.clearControlAndTableLineRect(currField);
        }
        currField.style.width = dragData.width;
        currField.style.height = dragData.height;
        if (el) {
          el.style.width = currField.style.width + "px";
          el.style.height = currField.style.height + "px";
        }
        if (currField.htmlType == ControlTypeEnum.selectArea.name) {
          var $paper = $(".paper-area");
          var width4mm =
            (me.data.style.width / $paper.width()) * currField.style.width;
          var height4mm =
            (me.data.style.height / $paper.height()) * currField.style.height;
          currField.style.width4mm = width4mm;
          currField.style.height4mm = height4mm;
          var boxEl = document.getElementById(currField.id + "_box");
          boxEl.style.width = currField.style.width + "px";
          boxEl.style.height = currField.style.height + "px";
        }
      }
    },
    /***
     * 清除控件和 表格的单元格信息
     * @param currField
     */
    clearControlAndTableLineRect: function(currField) {
      var me = this;
      if (!currField || !currField.style || !currField.style.rect) {
        return;
      }
      var lastRect = currField.style.rect;
      if (lastRect && lastRect.controlId && lastRect.tableLineId) {
        var lastTable = me.findTableLineControl(lastRect.tableLineId);
        me.removeRectInTableLineByColumnAndRow(
          lastTable,
          lastRect.columnIndex,
          lastRect.rowIndex
        );
        currField.style.rect = null;
        currField.parentId = "";
        currField.detailId = "";
        delete currField.style.rect;
      }
    },
    /** 拖拽控件到表格单元格中***/
    dragControl2TableLine: function(currField, cfg) {
      var me = this;
      var rect = null;
      var dragData = cfg.dragData;
      var isDrag2Table = false;

      if (
        currField.htmlType == "tableLine" ||
        currField.htmlType == "selectArea"
      ) {
        return isDrag2Table;
      }
      var mousePos4realtive = {
        left: dragData.mouseX4relative,
        top: dragData.mouseY4relative,
      };
      rect = me.findRectByPosOrRect(mousePos4realtive);
      if (rect.tableLineId && rect.columnIndex > -1 && rect.rowIndex > -1) {
        //拖拽到 表格单元格中
        //判断 表格单元格中是否含有控件
        var tableLineControl = me.getTableLineControl(rect.tableLineId);
        var lastCellInTable = me.findRectInTableLineByColumnAndRow(
          tableLineControl,
          rect.columnIndex,
          rect.rowIndex
        );
        /** 判断表格单元格中 是否已经存在控件****/
        if (lastCellInTable && lastCellInTable.controlId) {
          //判断 单元格是否存在控件 信息
          //控件已经存在了，如果不是当前控件，则不能拖拽到当前单元格了
          if (lastCellInTable.controlId == currField.id) {
            isDrag2Table = true;
          }
        } else {
          var lastRect = oui.parseJson(
            oui.parseString(currField.style.rect || {})
          );
          //剔除控件在上一个表格单元格中的位置
          if (lastRect.tableLineId && lastRect.controlId) {
            var lastTableLine = me.getTableLineControl(lastRect.tableLineId);
            me.removeRectInTableLineByColumnAndRow(
              lastTableLine,
              lastRect.columnIndex,
              lastRect.rowIndex
            );
          }
          if (currField.style.zIndex < tableLineControl.style.zIndex) {
            me.data.style.currControlZIndex++;
            currField.style.zIndex = me.data.style.currControlZIndex;
          }
          var currRect = rect;
          currRect.controlId = currField.id;
          me.setRectInTableLineByColumnAndRow(tableLineControl, currRect);
          currField.style.rect = currRect; // 设置控件所在的单元格信息
          isDrag2Table = true;
        }
      }
      if (isDrag2Table) {
        //var tableLineControl = me.getControlById(rect.tableLineId);
        //var columnLine = tableLineControl.style.columnLines[rect.columnIndex];
        //var rowLine = tableLineControl.style.rowLines[rect.rowIndex];
        currField.style.left = rect.left;
        currField.style.top = rect.top;
        currField.style.width = rect.right - rect.left;
        currField.style.height = rect.bottom - rect.top;
        currField.parentId = rect.tableLineId;
        var tableControl = me.getTableLineControl(rect.tableLineId);
        if (tableControl.controlType == "detail") {
          currField.detailId = tableControl.bizId;
        } else {
          currField.detailId = "";
        }
      } else {
        /** 拖拽离开表格时，需要 清除 表格中的单元格信息，清除控件的单元格信息*****/
        me.clearControlAndTableLineRect(currField);
      }
      return isDrag2Table;
    },
    /** 更新 虚拟表格中所有单元格的控件的位置*****/
    updateAllRectsInTableLine: function(tableLineControl) {
      var me = this;
      if (tableLineControl.htmlType == "tableLine") {
        //currLeft = columnLines[i].config.lineHeight+columnLines[i].fromPos.left;
        //currRight = columnLines[i+1].fromPos.left;
        var columnLines = tableLineControl.style.columnLines || [];
        var rowLines = tableLineControl.style.rowLines || [];
        var cellsMap = tableLineControl.style.cellsMap || {};
        var tableLeft = tableLineControl.style.left;
        var tableTop = tableLineControl.style.top;
        var borderLeftWidth = tableLineControl.style.borderLeftWidth;
        var borderTopWidth = tableLineControl.style.borderTopWidth;
        var controlIds = [];
        var controlMap = {};

        for (var i in cellsMap) {
          var rect = cellsMap[i];
          if (rect && rect.controlId && rect.tableLineId) {
            var currLeft =
              columnLines[rect.columnIndex].config.lineHeight +
              columnLines[rect.columnIndex].fromPos.left +
              tableLeft +
              borderLeftWidth;
            var currTop =
              rowLines[rect.rowIndex].config.lineHeight +
              rowLines[rect.rowIndex].fromPos.top +
              tableTop +
              borderTopWidth;
            var currRight =
              columnLines[rect.columnIndex + 1].fromPos.left +
              tableLeft +
              borderLeftWidth; //默认取后一列
            var currBottom =
              rowLines[rect.rowIndex + 1].fromPos.top +
              tableTop +
              borderTopWidth; //默认取后一行
            /** 跨列 则获取跨列对应的位置***/
            if (rect.colspan && rect.colspan > 1) {
              currRight =
                columnLines[rect.columnIndex + rect.colspan].fromPos.left +
                tableLeft +
                borderLeftWidth; //获取列位置处理
            }
            /** 跨行 则获取跨行对应的位置***/
            if (rect.rowspan && rect.rowspan > 1) {
              currBottom =
                rowLines[rect.rowIndex + rect.rowspan].fromPos.top +
                tableTop +
                borderTopWidth; //获取行位置处理
            }
            rect.left = currLeft;
            rect.top = currTop;
            rect.right = currRight;
            rect.bottom = currBottom;

            var currControl = me.getControlById(rect.controlId);

            currControl.style.left = rect.left;
            currControl.style.top = rect.top;
            currControl.style.width = rect.right - rect.left;
            currControl.style.height = rect.bottom - rect.top;
            currControl.style.rect = rect;
            controlIds.push(rect.controlId);
            controlMap[rect.controlId] = currControl;
          }
        }
        if (controlIds && controlIds.length) {
          /** 批量更新控件位置***/
          var selector = "#" + controlIds.join(",#");
          $(selector, ".paper-area").each(function() {
            var currEl = this;
            var id = currEl.getAttribute("id");
            var style = controlMap[id].style;
            if (!style) {
              return;
            }
            currEl.style.left = style.left + "px";
            currEl.style.top = style.top + "px";
            currEl.style.width = style.width + "px";
            currEl.style.height = style.height + "px";
          });
        }
      }
    },
    dragEndControlByPageDesignType: function(
      currField,
      cfg,
      isDrag2Table,
      mousePos4realtive
    ) {
      var me = this;
      if (!cfg.isSelectArea && !isDrag2Table) {
        //非选择区域，拖拽的目的 是为了放置控件
        if (me.data.pageDesignType && me.data.pageDesignType == "normalForm") {
          //查找控件占位
          var index = me.getControlIdxById(currField.id);
          me.data.controls.splice(index, 1); //先移除再 插入
          var targetControl = me.findControlByPosOrRect(
            mousePos4realtive,
            currField
          ); //在指定控件位置下方放置占位
          if (targetControl) {
            var newIndex = me.getControlIdxById(targetControl.id);
            var atTop = me.isPosAtControlHaffTop(
              targetControl,
              mousePos4realtive
            );
            if (atTop) {
              //插入到前面
              me.data.controls.splice(newIndex, 0, currField); //先移除再 插入
            } else {
              //插入到后面
              me.data.controls.splice(newIndex + 1, 0, currField); //先移除再 插入
            }
          } else {
            //需要考虑一种场景，判断是否在 某个控件后面,将鼠标位置上移currField的高度

            me.data.controls.push(currField);
          }
          me.updateControlsByPageDesignType(currField);
        }
      }
    },
    /*** 更新所有控件的位置********/
    updateControlsByPageDesignType: function(currField) {
      var me = this;

      if (me.data.pageDesignType && me.data.pageDesignType == "normalForm") {
        //查找控件占位
        var controls = me.data.controls || [];
        var top = 0;
        var $curr = null;
        me.data.style.currControlZIndex = 0;
        //处理第一层控件
        for (var i = 0, len = controls.length; i < len; i++) {
          var curr = controls[i];

          if (!curr) {
            continue;
          }
          if (curr.style && curr.style.rect && curr.style.rect.tableLineId) {
            //在表格布局中 或者数据表格中
            continue;
          }
          me.data.style.currControlZIndex++;
          var lastTop = curr.style.top || 0;
          curr.style.top = top;
          curr.style.left = 0;
          curr.style.zIndex = me.data.style.currControlZIndex;
          var fix = top - lastTop;
          if (curr.htmlType == "tableLine") {
            //表格布局，修改所有内部控件的位置
            me.updateControlsInTableLine(curr, {
              resizeColumnIndex: -1,
              resizeRowIndex: -1,
            });
          }

          top += curr.style.height;
          //var html = oui.getById('items').getHtmlByTplId('item-tpl', {item: curr});
          $curr = document.getElementById(curr.id);
          $curr.style.left = curr.style.left + "px";
          $curr.style.top = curr.style.top + "px";
          $curr.style.zIndex = curr.style.zIndex;
        }
        //处理子容器控件
        for (var i = 0, len = controls.length; i < len; i++) {
          var curr = controls[i];

          if (!curr) {
            continue;
          }
          if (!(curr.style && curr.style.rect && curr.style.rect.tableLineId)) {
            //在表格布局中 或者数据表格中
            continue;
          }
          me.data.style.currControlZIndex++;
          curr.style.zIndex = me.data.style.currControlZIndex;
          $curr = document.getElementById(curr.id);
          $curr.style.zIndex = curr.style.currControlZIndex;
        }
      }
    },
    updateCurrControlStyle: function() {
      var me = this;
      var currField = me.data.currentControl;
      if (currField && currField.id) {
        //拖拽出表格后，取消单元格格信息
        var el = document.getElementById(currField.id);
        el.style.left = currField.style.left + "px";
        el.style.top = currField.style.top + "px";
        if (currField.htmlType == ControlTypeEnum.selectArea.name) {
          var boxEl = document.getElementById(currField.id + "_box");
          boxEl.style.left = currField.style.left + "px";
          boxEl.style.top = currField.style.top + "px";
        }
        me.clearControlAndTableLineRect(currField);
        me.updateTableLineMaxRect(currField); //更新表格最大范围
        //表格控件位置变更后，变更当前表格中所有控件的位置
        me.updateAllRectsInTableLine(currField);

        if (me.inDetail(currField)) {
          //明细表中的控件需要作为字段
          var $field = $("#" + currField.id).find(".control-container-abs");
          if ($field && $field.length) {
            $field.remove();
          }
        } else {
          //非明细表中的控件 需要正常显示控件，只有表单控件才执行更新
          if (currField.formField || currField.isFormField) {
            //只有表单控件才更新
            var html = oui
              .getById("items")
              .getHtmlByTplId("item-tpl", { item: currField });
            $("#" + currField.id).replaceWith(html);
            $("#" + currField.id).addClass("active");
          }
        }
        if (
          currField.htmlType == "tableLine" &&
          !me.isDragging4SelectArea(currField)
        ) {
          //非编辑状态 不用显示操作层
          me.refreshTableLineMergeCells(currField);
        }
        me.showOperationArea(currField);
        me.setCurrPropsData(currField, "center", "dragEndField");

        //TODO 瀑布流 表单快捷键 移动功能待定
      }
    },
    clearControlRefs: function() {
      if (oui.routerView && oui.routerView.refs) {
        var t = oui.routerView.refs;
        for (var k in t) {
          t[k] = null;
          delete t[k];
        }
      }
    },
    dragEndControl: function(cfg) {
      var e = cfg.e,
        el = cfg.el,
        $proxy = cfg.$proxyDrag,
        dragData = cfg.dragData,
        isUpdate = cfg.isUpdate,
        isResizer = cfg.isResizer,
        isResizerRow = cfg.isResizerRow,
        isResizerColumn = cfg.isResizerColumn;

      var me = this;
      $proxy.removeClass("control-abs-component");
      if (dragData.x < 0) {
        dragData.x = 0;
      }
      if (dragData.y < 0) {
        dragData.y = 0;
      }
      var currId = $(el).attr("id");
      var currField = "";
      /** 当前拖拽的是操作层****/
      if (isUpdate && currId) {
        currField = me.getControlById(currId);
      }
      me.clearControlRefs();
      oui.clearByContainer("#control_items");
      oui.clear4notUse();

      //根据位置变更，更新 内容和属性面板
      var isDrag2Table = false;
      if (isResizer) {
        //改变大小
        /** 变更 格子 位置***/
        me.updateControlRect(currField, cfg);
        me.updateTableLineMaxRect(currField); //更新表格最大范围
        me.updateControlsByPageDesignType(currField); //直接刷新位置即可
      } else {
        //改变位置
        var mousePos4realtive = {
          left: dragData.mouseX4relative,
          top: dragData.mouseY4relative,
        };
        if (isUpdate) {
          //update
          //改变元素位置，判断是否拖拽到 表格 单元格中
          isDrag2Table = me.dragControl2TableLine(currField, cfg);
          if (isDrag2Table) {
            el.style.left = currField.style.left + "px";
            el.style.top = currField.style.top + "px";
            el.style.width = currField.style.width + "px";
            el.style.height = currField.style.height + "px";
            el.style.zIndex = currField.style.zIndex;
          } else {
            //拖拽出表格后，取消单元格格信息
            currField.style.left = dragData.x;
            currField.style.top = dragData.y;
            el.style.left = currField.style.left + "px";
            el.style.top = currField.style.top + "px";
            if (currField.htmlType == ControlTypeEnum.selectArea.name) {
              var boxEl = document.getElementById(currField.id + "_box");
              boxEl.style.left = currField.style.left + "px";
              boxEl.style.top = currField.style.top + "px";
            }
          }
          me.updateTableLineMaxRect(currField); //更新表格最大范围
          //表格控件位置变更后，变更当前表格中所有控件的位置
          me.updateAllRectsInTableLine(currField);
          me.dragEndControlByPageDesignType(
            currField,
            cfg,
            isDrag2Table,
            mousePos4realtive
          ); //根据页面类型进行后置渲染
        } else {
          //new content el

          var canCloneControl = me.data.canCloneControl;
          var currField = me.getElConfigByKeys(
            el,
            me.controlProps,
            me.controlDomAttrPrefix
          );
          canCloneControl = canCloneControl || currField.canCloneControl;
          currField.canCloneControl = canCloneControl;
          //扩展默认设置
          var defaultField = me.findDefaultControlByBizControlType(
            currField.controlType,
            currField.htmlType,
            currField
          );
          var defaultCfg = oui.parseJson(oui.parseString(defaultField)); //克隆一个，避免修改到默认配置
          /** 获取默认全局配置，并进行克隆，避免修改到默认配置****/
          //目前 控件样式 没有对应的全局设置，所以，暂时从当前页面对象中获取相关配置
          var globalCfg = {
            style: me.data.innerStyle.style,
            innerStyle: {
              styleTitle: me.data.innerStyle.styleTitle,
              styleFieldOuter: me.data.innerStyle.styleFieldOuter,
              styleInnerOuter: me.data.innerStyle.styleInnerOuter,
              styleField: me.data.innerStyle.styleField,
            },
          };
          globalCfg = oui.parseJson(oui.parseString(globalCfg));

          /** 当前新增控件 覆盖控件类型的默认配置，控件类型默认配置再覆盖页面中控件全局配置 ***/

          currField = $.extend(true, globalCfg, defaultCfg, currField); //当前配置覆盖默认，对于已经有的控件，也是相同逻辑，进行默认样式赋值

          if (currField.htmlType == "label") {
            currField.description = currField.title || currField.description;
          }
          me.data.style.currControlZIndex++;
          currField.style.zIndex = me.data.style.currControlZIndex;

          var lastId = currField.id;
          currField.id = currField.id || me.newId();
          currField.bizId = currField.bizId || me.newId();
          currField.name = currField.name || $.trim($(el).text());
          currField.style.left = dragData.x;
          currField.style.top = dragData.y;
          /** 默认宽高处理****/
          currField.style.width = currField.style.width || 230;
          currField.style.height = currField.style.height || dragData.height;
          if (oui.isEmptyObject(currField.innerStyle)) {
            currField.innerStyle.styleField = {};
            currField.innerStyle.styleFieldOuter = {};
            currField.innerStyle.styleInnerOuter = {};
            currField.innerStyle.styleTitle = {};
          }

          isDrag2Table = me.dragControl2TableLine(currField, cfg);

          /*** 非表格控件可拖拽 到表格控件中****/
          me.data.controls.push(currField);
          me.addTableLineControl(currField); //添加时自动 更新表格最大范围
          if (lastId) {
            //如果左侧被拖拽的控件有id，则进行取消拖拽的能力
            $(el).addClass("control-abs-disable");
          }
          var html = oui
            .getById("items")
            .getHtmlByTplId("item-tpl", { item: currField });
          var container = oui.getById("items").getEl();
          $(container)
            .find(".paper-area")
            .append(html);
          me.dragEndControlByPageDesignType(
            currField,
            cfg,
            isDrag2Table,
            mousePos4realtive
          ); //根据页面类型进行后置渲染
          $(".active", ".paper-area").removeClass("active");
          $("#" + currField.id).addClass("active");
        }
      }
      if (isUpdate) {
        if (me.inDetail(currField)) {
          //TODO 明细表中的控件 根据最后一行显示字段控件，其他的显示标题，特殊情况显示按钮
          //明细表中的控件需要作为字段
          //var $field = $('#' + currField.id).find('.control-container-abs');
          //if($field&&$field.length){
          //    $field.remove();
          //}
          if (currField.formField || currField.isFormField) {
            //只有表单控件才更新
            var html = oui
              .getById("items")
              .getHtmlByTplId("item-tpl", { item: currField });
            $("#" + currField.id).replaceWith(html);
            $("#" + currField.id).addClass("active");
          }
        } else {
          //非明细表中的控件 需要正常显示控件，只有表单控件才执行更新
          if (currField.formField || currField.isFormField) {
            //只有表单控件才更新
            var html = oui
              .getById("items")
              .getHtmlByTplId("item-tpl", { item: currField });
            $("#" + currField.id).replaceWith(html);
            $("#" + currField.id).addClass("active");
          }
        }
      }

      if (isResizer) {
        me.refreshTableLineMergeCells(currField);
        me.changed4props({}, function() {
          me.hideOperationArea();
          me.showOperationArea(currField);
          me.setCurrPropsData(currField, "center", "dragEndField");
        });
      } else {
        /** 表格控件 内部不能再拖拽 表格控件*****/
        if (
          currField.htmlType == "tableLine" &&
          !me.isDragging4SelectArea(currField)
        ) {
          //非编辑状态 不用显示操作层
          me.refreshTableLineMergeCells(currField);
        } else {
          if (!cfg.isSelectArea) {
            me.refreshTableLineMergeCells(currField);
            //console.log('拖拽位置结束');
            //console.log(oui.parseString(currField.style.mergeCellsMap));
          }
          me.showOperationArea(currField, cfg);
        }
        me.setCurrPropsData(currField, "center", "dragEndField");
      }

      oui.parse();
    },
    /** 判断 控件所在的单元格是否 在遍历区域内，找到一个满足规则则满足*****/
    matchEachRules: function(rect, eachRules) {
      var me = this;
      var flag = false;
      if (!eachRules || !eachRules.length) {
        return true;
      }
      for (var i = 0, len = eachRules.length; i < len; i++) {
        if (me.matchEachRule(rect, eachRules[i])) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    /** 判断某个单元格是否 在遍历规则的包含的单元格范围内*****/
    matchEachRule: function(rect, eachRule) {
      var inColumn = false;
      var inRow = false;
      if (
        rect.columnIndex >= eachRule.startColumnIndex &&
        rect.columnIndex <= eachRule.endColumnIndex
      ) {
        inColumn = true;
      } else {
        if (rect.columnIndex < eachRule.startColumnIndex) {
          if (rect.colspan && rect.colspan > 1) {
            if (
              rect.columnIndex + rect.colspan - 1 >=
              eachRule.startColumnIndex
            ) {
              inColumn = true;
            }
          }
        }
      }
      if (
        rect.rowIndex >= eachRule.startRowIndex &&
        rect.rowIndex <= eachRule.endRowIndex
      ) {
        inRow = true;
      } else {
        if (rect.rowIndex < eachRule.startRowIndex) {
          if (rect.rowspan && rect.rowspan > 1) {
            if (rect.rowIndex + rect.rowspan - 1 >= eachRule.startRowIndex) {
              inRow = true;
            }
          }
        }
      }
      var flag = inColumn && inRow;
      return flag;
    },
    /*****
         * 根据表格控件中的 列线和行线 更新 合并单元格信息和控件信息
         * 更新当前表格控件 中所有的控件位置 和合并单元格位置
         * var controlIds=[];
         var controlMap = {};
         me.refreshRectsAndMergeCells(tableLineControl,{
                callback:function(){
                    if(!controlIds.length){
                        return ;
                    }
                    var selector = '#'+controlIds.join(',#');
                    $(selector,'.paper-area').each(function(){
                        var currEl = this;
                        var id = currEl.getAttribute('id');
                        var style =controlMap[id].style;
                        if(!style){
                            return ;
                        }
                        currEl.style.left = style.left+'px';
                        currEl.style.top = style.top+'px';
                        currEl.style.width =(style.width)+'px';
                        currEl.style.height = (style.height)+'px';
                    });
                },
                filter:function(rect){

                },
                onControlChange:function(control){
                    if(control&&control.id){
                        controlIds.push(control.id);
                        controlMap[control.id] = control;
                    }
                }
            });
         * @param currField
         */
    refreshRectsAndMergeCells: function(tableLineControl, funCfg) {
      funCfg = funCfg || {};
      var eachRules = funCfg.eachRules || [];
      var callback = funCfg.callback;
      var onControlChange = funCfg.onControlChange;
      var filter = funCfg.filter;
      var me = this;
      if (tableLineControl.htmlType != "tableLine") {
        return;
      }
      //一、更新最大范围
      me.updateTableLineMaxRect(tableLineControl);
      //二、更新控件在合并单元格信息
      var mergeCellsMap = tableLineControl.style.mergeCellsMap || {};
      for (var mk in mergeCellsMap) {
        var cell = mergeCellsMap[mk];
        if (cell) {
          var sc = cell.startColumnIndex;
          var sr = cell.startRowIndex;
          if (
            !me.matchEachRules(
              {
                columnIndex: sc,
                rowIndex: sr,
                colspan: cell.endColumnIndex - cell.startColumnIndex + 1,
                rowspan: cell.endRowIndex - cell.startRowIndex + 1,
              },
              eachRules
            )
          ) {
            continue;
          }
          me.refreshTableLineMergeCell(tableLineControl, sc, sr);
        }
      }
      me.refreshTableLineMergeCells(tableLineControl);

      //三、更新所有控件的信息
      var columnLines = tableLineControl.style.columnLines || [];
      var rowLines = tableLineControl.style.rowLines || [];
      var cellsMap = tableLineControl.style.cellsMap || {};
      var tableLeft = tableLineControl.style.left;
      var tableTop = tableLineControl.style.top;
      var borderLeftWidth = tableLineControl.style.borderLeftWidth;
      var borderTopWidth = tableLineControl.style.borderTopWidth;
      for (var i in cellsMap) {
        var rect = cellsMap[i];
        if (rect && rect.controlId && rect.tableLineId) {
          if (filter) {
            var flag = filter(rect);
            if (typeof flag == "boolean") {
              if (!flag) {
                continue;
              }
            }
          }
          var hasChange = false;
          if (eachRules && eachRules.length) {
            // 根据遍历规则遍历非合并单元格
            if (!me.matchEachRules(rect, eachRules)) {
              continue;
            }
          }
          var currControl = me.getControlById(rect.controlId);
          var currLeft =
            columnLines[rect.columnIndex].config.lineHeight +
            columnLines[rect.columnIndex].fromPos.left +
            tableLeft +
            borderLeftWidth;
          var currTop =
            rowLines[rect.rowIndex].config.lineHeight +
            rowLines[rect.rowIndex].fromPos.top +
            tableTop +
            borderTopWidth;
          var currRight =
            columnLines[rect.columnIndex + 1].fromPos.left +
            tableLeft +
            borderLeftWidth; //默认取后一列
          var currBottom =
            rowLines[rect.rowIndex + 1].fromPos.top + tableTop + borderTopWidth; //默认取后一行
          /** 跨列 则获取跨列对应的位置***/
          if (rect.colspan && rect.colspan > 1) {
            currRight =
              columnLines[rect.columnIndex + rect.colspan].fromPos.left +
              tableLeft +
              borderLeftWidth; //获取列位置处理
          }
          /** 跨行 则获取跨行对应的位置***/
          if (rect.rowspan && rect.rowspan > 1) {
            currBottom =
              rowLines[rect.rowIndex + rect.rowspan].fromPos.top +
              tableTop +
              borderTopWidth; //获取行位置处理
          }
          if (rect.left != currLeft) {
            rect.left = currLeft;
            hasChange = true;
          }
          if (rect.top != currTop) {
            rect.top = currTop;
            hasChange = true;
          }
          if (rect.right != currRight) {
            rect.right = currRight;
            hasChange = true;
          }
          if (rect.bottom != currBottom) {
            rect.bottom = currBottom;
            hasChange = true;
          }
          if (currControl.style.left != rect.left) {
            currControl.style.left = rect.left;
            hasChange = true;
          }
          if (currControl.style.top != rect.top) {
            currControl.style.top = rect.top;
            hasChange = true;
          }
          if (currControl.style.width != rect.right - rect.left) {
            currControl.style.width = rect.right - rect.left;
            hasChange = true;
          }
          if (currControl.style.height != rect.bottom - rect.top) {
            currControl.style.height = rect.bottom - rect.top;
            hasChange = true;
          }
          currControl.style.rect = rect;
          if (hasChange) {
            onControlChange && onControlChange(currControl);
          }
        }
      }
      callback && callback(tableLineControl);
    },
    /** 是否是拖拽选择区域****/
    isDragging4SelectArea: function(currField) {
      var me = this;
      return currField.style.isDragging4SelectArea;
    },
    /** 显示控件对应的操作区域****/
    showOperationArea: function(currField, cfg) {
      var me = this;
      if (!currField) {
        return;
      }

      var $operation = $("#operation-layer");
      var isSelectArea = me.isDragging4SelectArea(currField);
      var rect = null;
      /** 表格并 当前在选择多格单元格 ****/
      if (
        currField.htmlType == "tableLine" &&
        cfg &&
        cfg.isSelectArea &&
        !cfg.isResizer
      ) {
        var dragData = cfg.dragData;
        if (!dragData) {
          //是否选择列或者行
          //如果是选择列或行，则处理选择参数,否则根据鼠标位置获取单元格选择参数
          var mousePos = me.getXY(cfg.e);
          dragData = {
            startSelectColumnIndex: cfg.startSelectColumnIndex,
            startSelectRowIndex: cfg.startSelectRowIndex,
            dropPos: cfg.dropPos,
            startMouseX: mousePos.x,
            startMouseY: mousePos.y,
            scrollContainerLeft: cfg.scrollContainerLeft,
            scrollContainerTop: cfg.scrollContainerTop,
            mouseX: mousePos.x,
            mouseY: mousePos.y,
          };
        }
        rect = me.findRectBySelectArea(currField, dragData);
        if (rect) {
          me.selectRect = rect;
          me.showOperationSelectByTableLineSelectRect(currField, rect);
        }
      } else if (me.selectRect && me.selectRect.tableLineId == currField.id) {
        rect = me.findRectBySelectRect(currField, me.selectRect);
        if (rect) {
          me.selectRect = rect;
          me.showOperationSelectByTableLineSelectRect(currField, rect);
        }
      } else {
        $operation.find(".operation-select-area").css({ display: "none" });
      }
      if (isSelectArea) {
        $operation.addClass("drag-select-area");
      } else {
        $operation.removeClass("drag-select-area");
      }
      $operation.css({
        left: currField.style.left - me.operationAreaOffset + "px",
        top: currField.style.top - me.operationAreaOffset + "px",
        width: currField.style.width + me.operationAreaOffset * 2 + "px",
        height: currField.style.height + me.operationAreaOffset * 2 + "px",
      });
      if (!currField.canCloneControl) {
        $operation.find("[oui-e-click=event2cloneControl]").hide();
      } else {
        $operation.find("[oui-e-click=event2cloneControl]").show();
      }
      $operation.attr("control-abs-id", currField.id);
      if (currField.htmlType == "selectArea") {
        $operation.find(".ctrl-del-copy").hide();
      } else {
        $operation.find(".ctrl-del-copy").show();
      }
      if (currField.htmlType == "tableLine") {
        if (
          !$(".control-line-abs[control-abs-id=" + currField.id + "]").length
        ) {
          $operation.find(".merge-cell").remove();
          $operation.find(".control-line-abs").remove();
          $operation.find(".control-table-num-abs").remove();
          var html = oui
            .getById("items")
            .getHtmlByTplId("control-tableLine-drag-tpl", {
              item: currField,
              rect: rect,
            });
          $operation.append(html);
        }
      } else {
        $operation.find(".control-table-num-abs").remove();
        $operation.find(".merge-cell").remove();
        $operation.find(".control-line-abs").remove();
      }
      $operation.show();
    },
    isTableColumnActive: function(tableLine, columnIndex) {
      var me = this;
      var flag = false;
      if (!me.selectRect) {
        return flag;
      }
      if (
        columnIndex >= me.selectRect.startColumnIndex &&
        columnIndex <= me.selectRect.endColumnIndex
      ) {
        flag = true;
      }
      return flag;
    },
    isTableRowActive: function(tableLine, rowIndex) {
      var me = this;
      var flag = false;
      if (!me.selectRect) {
        return;
      }
      if (
        rowIndex >= me.selectRect.startRowIndex &&
        rowIndex <= me.selectRect.endRowIndex
      ) {
        flag = true;
      }
      return flag;
    },
    /** 隐藏操作区域***/
    hideOperationArea: function() {
      var $operation = $("#operation-layer");
      $operation.hide();
      $operation.find(".control-line-abs").remove();
      $operation.find(".control-table-num-abs").remove();
      var $proxyPlaceholder = $(".proxy-drag-placeholder");
      $proxyPlaceholder.hide();
    },
    /** 绑定 属性面板 中 属性分类标题的点击事件*****/
    bindControlPropsTitleEvents: function() {
      var propTitleSelector = "design-set-attribute-tit";
      var activeSelector = "attribute-tit-active";
      var me = this;
      $(document).on("click", "." + propTitleSelector, function(e) {
        var el = e.target || e.srcElement;
        var flag = me.checkData();
        if (!flag) {
          return false;
        }
        if (!$(el).is("." + propTitleSelector)) {
          el = $(el).closest("." + propTitleSelector)[0];
        }
        if (el) {
          if ($(el).hasClass(activeSelector)) {
            $(el).removeClass(activeSelector);
            $(el)
              .closest("." + "design-set-content")
              .find("." + activeSelector)
              .removeClass(activeSelector); //抽屉模式
          } else {
            $(el)
              .closest("." + "design-set-content")
              .find("." + activeSelector)
              .removeClass(activeSelector); //抽屉模式
            $(el).addClass(activeSelector);
            //记下当前active 的位置
            var $parent = $(el).parent();
            me.currAccordingActiveId = $parent.attr("id");
          }
        }
      });
    },
    findAccordingActiveCls: function(id, emptyActive) {
      var me = this;
      var activeCls = "";
      if (me.currAccordingActiveId == id) {
        activeCls = "attribute-tit-active";
      } else {
        if (!me.currAccordingActiveId) {
          if (emptyActive) {
            activeCls = "attribute-tit-active";
          }
        }
      }
      return activeCls;
    },
    renderPaperStyle: function() {
      var me = this;
      //页面更新
      var $paper = $(".paper-area");
      $paper.removeClass("bg-repeat");
      $paper.removeClass("bg-center");
      $paper.removeClass("bg-cover");
      var $link4paper = $paper.find("link[link-id]");
      if ($link4paper && $link4paper.length) {
        $link4paper.replaceWith(
          '<link link-id="page-link"  rel="stylesheet" type="text/css" href="' +
            me.findThemeUrl() +
            '" />'
        );
      } else {
        $paper.prepend(
          '<link link-id="page-link"  rel="stylesheet" type="text/css" href="' +
            me.findThemeUrl() +
            '" />'
        );
      }
      $paper.addClass("bg-" + me.data.style.backgroundImageFillType);
      var styleString = me.findStyleString(me.data.style, "common-style-tpl");
      $paper.attr("style", styleString);
      $paper.css({
        "background-image": me.data.backgroundImage
          ? "url(" + me.data.backgroundImage + ")"
          : "",
        //width: me.data.style.width + "mm",
        //height: me.data.style.height + "mm",
          width: "100%",
          height: me.data.style.height + "mm",

      });
      var defaultTopFixed = 18 + $paper[0].offsetTop;
      var defaultLeftFixed = 18 + $paper[0].offsetLeft;
      var left = defaultLeftFixed;
      var top = defaultTopFixed;
      var $scrollEl = $(".design-middle");
      var scrollTop = $scrollEl[0].scrollTop;
      var scrollLeft = $scrollEl[0].scrollLeft;
      top -= scrollTop;
      left -= scrollLeft;
      $(".ruler-left").css({
        //'height':me.data.style.height+'mm',
        "background-position": "top " + top + "px left 0",
      });
      $(".ruler-top").css({
        //'width':me.data.style.width+'mm',
        "background-position": "top 0 left " + left + "px",
      });
    },
    changeAllControls: function(key, value) {
      var me = this;
      key = key.replace("currentControl.", "");
      //var isLayoutTypeProp =false;
      //if(key.indexOf('layoutType')>=0){//布局类型 只对控件起作用
      //    isLayoutTypeProp= true; //排列属性只对 控件起作用
      //}
      var controls = me.data.controls || [];
      for (var i = 0, len = controls.length; i < len; i++) {
        if (!controls[i]) {
          continue;
        }
        if (controls[i].htmlType == "selectArea") {
          continue;
        }
        if (controls[i].htmlType == "tableLine") {
          continue;
        }
        //if(isLayoutTypeProp && (!controls[i].formField)){
        //    continue;
        //}
        try {
          oui.JsonPathUtil.setObjByPath(key, controls[i], value, true);
          me.changedControlProp(controls[i], key);
        } catch (err) {}
      }
    },
    changed4otherCellType: function(cfg) {
      var me = this;
      try {
        var $paper = $(".paper-area");
        var bindProp = $(cfg.el).attr("bindProp");

        var propValue = oui.JsonPathUtil.getJsonByPath(bindProp, me.data) || 0;
        if (me.data.style.cellType == "mm") {
          var tempKey = bindProp + "4mm"; //设置毫米刻度
          var propValue4mm = (me.data.style.width / $paper.width()) * propValue;
          oui.JsonPathUtil.setObjByPath(tempKey, me.data, propValue4mm, true);
        }
      } catch (err) {}
    },
    changed4propsRealTime: function(cfg, callback) {
      var me = this;
      var currentControl = me.data.currentControl;
      if ("init,down2selectPage".split(",").indexOf(me.state) > -1) {
        me.renderPaperStyle();
        //改变全局控件属性
        if (cfg && cfg.el) {
          var prop =
            $(cfg.el).attr("bindprop") || $(cfg.el).attr("invoke-prop") || "";
          if (prop) {
            if (prop.indexOf("currentControl") >= 0) {
              //对控件全局属性进行处理
              try {
                me.changeAllControls(
                  prop,
                  oui.JsonPathUtil.getJsonByPath(prop, me.data)
                );
              } catch (err) {}
              me.renderCenterAll();
            }
            //页面宽高调整导致的拖拽事件变更
            //if(prop.indexOf('style.width')>-1 || prop.indexOf('style.height')>-1){
            //    me.bindDragEvents();
            //}
          }
        }
        if (me.data.currentControl == currentControl) {
          //当前对象则执行相关逻辑
          callback && callback();
        } else {
          me.data.tempData = {};
          me.data.tempControl = {}; //非当前对象 ，需要清空临时属性，防止数据串改
        }
      } else {
        //字段更新
        if (currentControl.id) {
          //me.refreshBizProps(); //刷新业务配置
          var prop =
            $(cfg.el).attr("bindprop") || $(cfg.el).attr("invoke-prop") || "";
          if (prop) {
            me.changedControlProp(currentControl, prop);
          }
          var dragStatus = document
            .getElementById(currentControl.id)
            .getAttribute("drag-status");
          oui.clearByContainer("#" + currentControl.id);
          oui.clear4notUse();
          var html = oui
            .getById("items")
            .getHtmlByTplId("center-control-tpl", { item: currentControl });
          me.patchCurrControl(currentControl, html);
          document
            .getElementById(currentControl.id)
            .setAttribute("drag-status", dragStatus);
          oui.parse();
          setTimeout(function() {
            if (me.data.currentControl == currentControl) {
              //当前对象则执行相关逻辑
              $("#" + currentControl.id).addClass("active");
              callback && callback();
              me.showOperationArea(currentControl);
            } else {
              me.data.tempData = {};
              me.data.tempControl = {}; //非当前对象 ，需要清空临时属性，防止数据串改
            }
          }, 30);
        }
      }
    },
    /****
     * 控件样式属性改变处理
     * @param data
     * @param prop
     */
    changedControlProp: function(control, key) {
      var me = this;
      key = key.replace("currentControl.", "");
      //console.log('changed:'+key);
      /***
             * style: me.data.innerStyle.style,
             innerStyle: {
                        styleInnerOuter:me.data.innerStyle.styleInnerOuter,
                        styleTitle: me.data.innerStyle.styleTitle,
                        styleFieldOuter: me.data.innerStyle.styleFieldOuter,
                        styleField: me.data.innerStyle.styleField
                    }
             */
      if (!key) {
        return;
      }
      if (key.indexOf("style.") == 0) {
        //外框样式属性调整
        me.findControlStyle4Dom(control, control.parentId ? true : false);
      } else if (key.indexOf("innerStyle.styleInnerOuter.") == 0) {
        //控件内框样式
        me.findControlStyleInnerOuter4Dom(
          control,
          control.parentId ? true : false
        );
      } else if (key.indexOf("innerStyle.styleTitle.") == 0) {
        //控件标题样式
        me.findControlInnerStyleTitle4Dom(
          control,
          control.parentId ? true : false
        );
      } else if (key.indexOf("innerStyle.styleFieldOuter.") == 0) {
        //控件字段外框样式
        me.findStyleFieldOuter4Dom(control, control.parentId ? true : false);
      } else if (key.indexOf("innerStyle.styleField.") == 0) {
        //控件字段值样式
        me.findFieldStyle4Dom(control, control.parentId ? true : false);
      }
    },
    /** 该方法非常经典，当前对象离开后，验证是否是当前对象******/
    changed4props: function(cfg, callback) {
      var me = this;
      var currentControl = me.data.currentControl;
      var flag = me.checkData(true);
      if (!flag) {
        return;
      } else {
        //校验成功 则 剔除 错误信息，ie 下 没有使用虚拟dom绑定
        if (oui.browser.ie || oui.browser.isEdge) {
          $(".fielderror").remove();
        }
      }
      me.changed4propsRealTime(cfg, callback);
    },
    /** 更新属性面板**/
    patchCurrControl: function(currentControl, html) {
      if (oui.browser.ie || oui.browser.isEdge) {
        if (currentControl.htmlType == ControlTypeEnum.selectArea.name) {
          document.getElementById(currentControl.id).outerHTML = $.trim(html);

          var selectAreaBoxHtml = oui
            .getById("items")
            .getHtmlByTplId("selectArea-box-tpl", { item: currentControl });
          document.getElementById(
            currentControl.id + "_box"
          ).outerHTML = $.trim(selectAreaBoxHtml);
        } else {
          document.getElementById(currentControl.id).outerHTML = $.trim(html);
        }
      } else {
        if (currentControl.htmlType == ControlTypeEnum.selectArea.name) {
          oui
            .getById("absoluteProps")
            .patchDom(document.getElementById(currentControl.id), $.trim(html));

          var selectAreaBoxHtml = oui
            .getById("items")
            .getHtmlByTplId("selectArea-box-tpl", { item: currentControl });
          oui
            .getById("absoluteProps")
            .patchDom(
              document.getElementById(currentControl.id + "_box"),
              $.trim(selectAreaBoxHtml)
            );
        } else {
          /** 虚拟dom渲染 当前控件***/
          oui
            .getById("absoluteProps")
            .patchDom(document.getElementById(currentControl.id), $.trim(html));
        }
      }
    },
    findBorderWidth: function(currField, bindPropKey) {
      var me = this;
      var arr = [
        me.hasBorderLeft(currField, bindPropKey),
        me.hasBorderTop(currField, bindPropKey),
        me.hasBorderRight(currField, bindPropKey),
        me.hasBorderBottom(currField, bindPropKey),
      ];
      arr.sort();
      var border = arr[arr.length - 1];
      return border || 0;
    },
    findBorderRadius: function(currField, bindPropKey) {
      var objKey = bindPropKey
        .replace("tempControl.", "")
        .replace("._borders", "");
      var style = oui.JsonPathUtil.getJsonByPath(objKey, currField) || {};
      var borderRadius = style.borderRadius || 0;
      return borderRadius;
    },
    findBorderColor: function(currField, bindPropKey) {
      var objKey = bindPropKey
        .replace("tempControl.", "")
        .replace("._borders", "");
      var style = oui.JsonPathUtil.getJsonByPath(objKey, currField) || {};
      var color =
        style.borderLeftColor ||
        style.borderTopColor ||
        style.borderRightColor ||
        style.borderBottomColor;
      color = color || "#e6e6e6"; //默认颜色
      return color;
    },

    changed4setBorderStyle: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      var $el = $(cfg.el);
      var bindPropKey4Style = $el.attr("bindprop");
      var objKey = bindPropKey4Style
        .replace("._borderStyle", "")
        .replace("tempControl.", "");
      var borderStyle =
        oui.JsonPathUtil.getJsonByPath(bindPropKey4Style, me.data) || "solid";
      var styleObj =
        oui.JsonPathUtil.getJsonByPath(objKey, currentControl) || {};
      styleObj.borderLeftStyle = borderStyle;
      styleObj.borderTopStyle = borderStyle;
      styleObj.borderRightStyle = borderStyle;
      styleObj.borderBottomStyle = borderStyle;

      if (currentControl.id) {
        me.updateControlRect4Border(currentControl);
      }
      if ("init,down2selectPage".split(",").indexOf(me.state) > -1) {
        me.changed4props(cfg, function() {
          try {
            me.changeAllControls(objKey + ".borderLeftStyle", borderStyle);
            me.changeAllControls(objKey + ".borderTopStyle", borderStyle);
            me.changeAllControls(objKey + ".borderRightStyle", borderStyle);
            me.changeAllControls(objKey + ".borderBottomStyle", borderStyle);
            me.renderCenterAll();
          } catch (err) {}
          //me.renderPaperStyle();
        });
      } else {
        me.changed4props(cfg, function() {
          me.setCurrPropsData(currentControl, "center", "down2selectField");
        });
      }
    },
    findBorderStyle: function(currField, bindPropKey) {
      var me = this;
      var objKey = bindPropKey
        .replace("tempControl.", "")
        .replace("._borders", "");
      var style = oui.JsonPathUtil.getJsonByPath(objKey, currField) || {};
      var borderStyleValue = "";
      if (me.hasBorderLeft(currField, bindPropKey)) {
        borderStyleValue = style.borderLeftStyle || "solid";
      } else if (me.hasBorderTop(currField, bindPropKey)) {
        borderStyleValue = style.borderTopStyle || "solid";
      } else if (me.hasBorderRight(currField, bindPropKey)) {
        borderStyleValue = style.borderRightStyle || "solid";
      } else if (me.hasBorderBottom(currField, bindPropKey)) {
        borderStyleValue = style.borderBottomStyle || "solid";
      } else {
        borderStyleValue = "solid";
      }
      return borderStyleValue;
    },
    /** 设置边框颜色****/
    changed4setBorderColor: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      var $el = $(cfg.el);
      var bindPropKey4Color = $el.attr("invoke-prop");
      var objKey = bindPropKey4Color
        .replace("._borderColor", "")
        .replace("tempControl.", "");
      var color =
        oui.JsonPathUtil.getJsonByPath(bindPropKey4Color, me.data) || "";
      var styleObj =
        oui.JsonPathUtil.getJsonByPath(objKey, currentControl) || {};
      styleObj.borderLeftColor = color;
      styleObj.borderTopColor = color;
      styleObj.borderRightColor = color;
      styleObj.borderBottomColor = color;

      if (currentControl.id) {
        me.updateControlRect4Border(currentControl);
      }
      if ("init,down2selectPage".split(",").indexOf(me.state) > -1) {
        me.changed4propsRealTime(cfg, function() {
          try {
            me.changeAllControls(objKey + ".borderLeftColor", color);
            me.changeAllControls(objKey + ".borderTopColor", color);
            me.changeAllControls(objKey + ".borderRightColor", color);
            me.changeAllControls(objKey + ".borderBottomColor", color);
            me.renderCenterAll();
          } catch (err) {}
          //me.renderPaperStyle();
        });
      } else {
        me.changed4propsRealTime(cfg, function() {
          me.setCurrPropsData(currentControl, "center", "down2selectField");
        });
      }
    },
    changed4setBorderWidth: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      var $el = $(cfg.el);
      var bindPropKey4Width = $el.attr("bindprop");

      var objKey = bindPropKey4Width
        .replace("._borderWidth", "")
        .replace("tempControl.", "");

      var _borderWidth =
        oui.JsonPathUtil.getJsonByPath(bindPropKey4Width, me.data) || 0;
      var styleObj = oui.JsonPathUtil.getJsonByPath(objKey, currentControl);
      if (_borderWidth) {
        styleObj.borderLeftWidth && (styleObj.borderLeftWidth = _borderWidth);
        styleObj.borderTopWidth && (styleObj.borderTopWidth = _borderWidth);
        styleObj.borderRightWidth && (styleObj.borderRightWidth = _borderWidth);
        styleObj.borderBottomWidth &&
          (styleObj.borderBottomWidth = _borderWidth);
      } else {
        styleObj.borderLeftWidth && (styleObj.borderLeftWidth = 1);
        styleObj.borderTopWidth && (styleObj.borderTopWidth = 1);
        styleObj.borderRightWidth && (styleObj.borderRightWidth = 1);
        styleObj.borderBottomWidth && (styleObj.borderBottomWidth = 1);
      }

      if (currentControl.id) {
        me.updateControlRect4Border(currentControl);
      }
      if ("init,down2selectPage".split(",").indexOf(me.state) > -1) {
        me.changed4propsRealTime(cfg, function() {
          try {
            me.changeAllControls(
              objKey + ".borderLeftWidth",
              styleObj.borderLeftWidth
            );
            me.changeAllControls(
              objKey + ".borderTopWidth",
              styleObj.borderTopWidth
            );
            me.changeAllControls(
              objKey + ".borderRightWidth",
              styleObj.borderRightWidth
            );
            me.changeAllControls(
              objKey + ".borderBottomWidth",
              styleObj.borderBottomWidth
            );
            me.renderCenterAll();
            //me.setCurrPropsData4page('props','down2selectPage');
          } catch (err) {}
        });
      } else {
        me.changed4propsRealTime(cfg, function() {
          //me.setCurrPropsData(currentControl, 'center', 'down2selectField');
        });
      }
    },
    /** 改变控件边框***/
    changed4setBorders: function(cfg) {
      var me = this;
      var currentControl = me.data.currentControl;
      var $el = $(cfg.el);
      var bindProp = $el.attr("bindprop");
      var objKey = bindProp
        .replace("tempControl.", "")
        .replace("._borders", "");
      var bindProp4Width = bindProp.replace("._borders", "._borderWidth");
      var currStyleObj =
        oui.JsonPathUtil.getJsonByPath(objKey, currentControl) || {};
      var borders = oui.JsonPathUtil.getJsonByPath(bindProp, me.data) || "";
      if (borders == "none") {
        borders = "";
      }

      var last = {
        borderLeftWidth: currStyleObj.borderLeftWidth,
        borderTopWidth: currStyleObj.borderTopWidth,
        borderRightWidth: currStyleObj.borderRightWidth,
        borderBottomWidth: currStyleObj.borderBottomWidth,
      };
      currStyleObj.borderLeftWidth = 0;
      currStyleObj.borderTopWidth = 0;
      currStyleObj.borderRightWidth = 0;
      currStyleObj.borderBottomWidth = 0;
      if (borders && borders.length) {
        borders = borders.split(",");
        for (var i = 0, len = borders.length; i < len; i++) {
          var borderKey = borders[i];
          currStyleObj[borderKey] =
            last[borderKey] ||
            me.findBorderWidth(currentControl, bindProp) ||
            1;
        }
      } else {
        /** 选择框 需要特殊处理*****/
        oui.JsonPathUtil.setObjByPath(bindProp4Width, me.data, 1, true);
      }
      if (currentControl.id) {
        me.updateControlRect4Border(currentControl);
      }

      me.changed4props(cfg);
      if ("init,down2selectPage".split(",").indexOf(me.state) > -1) {
        if (bindProp.indexOf("tempControl") >= 0) {
          try {
            me.changeAllControls(
              objKey + ".borderLeftWidth",
              currStyleObj.borderLeftWidth
            );
            me.changeAllControls(
              objKey + ".borderTopWidth",
              currStyleObj.borderTopWidth
            );
            me.changeAllControls(
              objKey + ".borderRightWidth",
              currStyleObj.borderRightWidth
            );
            me.changeAllControls(
              objKey + ".borderBottomWidth",
              currStyleObj.borderBottomWidth
            );
            me.renderCenterAll();
            me.setCurrPropsData4page("props", "down2selectPage");
          } catch (err) {}
        }
      } else {
        //字段更新
        me.setCurrPropsData(currentControl, "center", "down2selectField");
      }
    },
    findSelectBox: function() {
      var me = this;
      var controls = me.data.controls || [];
      var curr = oui.findOneFromArrayBy(controls, function(item) {
        if (item.htmlType == ControlTypeEnum.selectArea.name) {
          return true;
        }
      });
      return curr;
    },
    hasSelectBox: function() {
      var me = this;
      var item = me.findSelectBox();
      var flag = false;
      if (item) {
        flag = true;
      }
      return flag;
    },
    isSelectBox: function(control) {
      var flag = false;
      if (control && control.htmlType == ControlTypeEnum.selectArea.name) {
        flag = true;
      }
      return flag;
    },
    removeSelectBox: function() {
      var me = this;
      var controls = me.data.controls || [];
      var $paper = $(".paper-area");
      oui.removeFromArrayBy(controls || [], function(item) {
        if (item.htmlType == ControlTypeEnum.selectArea.name) {
          $paper.find("#" + item.id + ",#" + item.id + "_box").remove();
          return true;
        }
      });
    },
    /** 判断当前控件是否含有边框***/
    hasBorder: function(currField, bindPropKey) {
      var me = this;
      var flag = true;
      if (!currField || !currField.style) {
        flag = false;
      } else {
        flag =
          me.hasBorderLeft(currField, bindPropKey) ||
          me.hasBorderTop(currField, bindPropKey) ||
          me.hasBorderRight(currField, bindPropKey) ||
          me.hasBorderBottom(currField, bindPropKey);

        if (typeof flag == "number") {
          if (flag != 0) {
            flag = true;
          } else {
            flag = false;
          }
        }
      }
      return flag;
    },
    /**
     * currField: 控件对象 或者页面对象
     * bindPropKey: 动态绑定的临时属性 tempControl.style._borders,tempControl.innerStyle.styleField._borders
     * prop:具体处理的属性值 ：borderTopWidth,borderRightWidth,borderLeftWidth,borderBottomWidth
     * ****/
    hasBorderByProp: function(currField, bindPropKey, prop) {
      var me = this;
      var objKey = bindPropKey
        .replace("._borders", "")
        .replace("tempControl.", "");
      var widthKey = bindPropKey.replace("._borders", "._borderWidth");
      var styleObj =
        currField && oui.JsonPathUtil.getJsonByPath(objKey, currField);
      var border = currField && styleObj && styleObj[prop];
      if (!border) {
        var tempBorder =
          oui.JsonPathUtil.getJsonByPath(bindPropKey, me.data) || "";
        if (tempBorder.indexOf(prop) >= 0) {
          return (
            border || oui.JsonPathUtil.getJsonByPath(widthKey, me.data) || 1
          );
        }
      }
      return border;
    },
    hasBorderLeft: function(currField, bindPropKey) {
      var me = this;
      return me.hasBorderByProp(currField, bindPropKey, "borderLeftWidth");
    },
    hasBorderTop: function(currField, bindPropKey) {
      var me = this;
      return me.hasBorderByProp(currField, bindPropKey, "borderTopWidth");
    },
    hasBorderRight: function(currField, bindPropKey) {
      var me = this;
      return me.hasBorderByProp(currField, bindPropKey, "borderRightWidth");
    },
    hasBorderBottom: function(currField, bindPropKey) {
      var me = this;
      return me.hasBorderByProp(currField, bindPropKey, "borderBottomWidth");
    },
    event2editTable: function(cfg) {
      var me = this;
      cfg.e && cfg.e.target.releaseCapture && cfg.e.target.releaseCapture();
      var $ctrl = $(cfg.el).closest(".control-abs-component");
      var id = $ctrl.attr("id");
      if (!id) {
        return;
      }
      var currField = me.getControlById(id);
      if (currField.style.isDragging4SelectArea) {
        currField.style.isDragging4SelectArea = false;
      } else {
        currField.style.isDragging4SelectArea = true;
      }
      $(".active", ".paper-area").removeClass("active");
      $ctrl.addClass("active");
      if (currField.style.isDragging4SelectArea) {
        //判断当前表格控件 是否是编辑状态
        $ctrl.addClass("drag-select-area");
        $(cfg.el).attr("title", "编辑中");
        me.selectRect = null;
        me.showOperationArea(currField);
      } else {
        $ctrl.removeClass("drag-select-area");
        $(cfg.el).attr("title", "编辑完成");
        me.hideOperationArea();
      }
    },
    findPageBgImg: function() {
      var me = this;
      if (me.data && me.data.backgroundImage) {
        return "background-image:url(" + me.data.backgroundImage + ")";
      }
      return "";
    },
    findPageBgImgTpl: function() {
      return "{{if pageData.getDesigner()&&pageData.getDesigner().backgroundImage}}background-image:url({{=pageData.getDesigner().backgroundImage}}){{/if}}";
    },
    /*** 获取字段值的渲染内容****/
    findFieldHtml: function(control, render4tpl) {
      var me = this;
      if (!control) {
        return "";
      }
      return (
        me.plugin.PageDesignControlAdapter.render(control, render4tpl) || ""
      );
    },
    /** 清空页面背景****/
    event2removePaperBgImg: function(cfg) {
      var me = this;
      var imgId = me.data.backgroundImageId;
      if (imgId) {
        //var attachments = me.data.attachments||[];
        //oui.removeFromArrayBy(attachments,function(item){
        //    if(item.id == imgId){
        //        return true;
        //    }
        //});
      }
      me.data.backgroundImageId = "";
      me.data.backgroundImageName = "";
      me.data.backgroundImage = "";
      me.renderPaperStyle();
      if (oui.browser.ie || oui.browser.isEdge) {
        $(cfg.el)
          .parent()
          .find("input")
          .val("");
      }
    },
    /** 复制控件****/
    event2cloneControl: function(cfg) {
      var me = this;
      //解决ie下 没有释放按钮操作事件导致卡死的问题
      cfg.e && cfg.e.target.releaseCapture && cfg.e.target.releaseCapture();

      var $control = $(cfg.el).closest(".control-abs-component");
      var id = $control.attr(me.controlDomAttrPrefix + "id");
      var control = me.getControlById(id);
      if (!control) {
        return;
      }
      var newControl = oui.parseJson(oui.parseString(control));

      newControl.id = me.newId();
      newControl.bizId = me.newId(); //更新业务id
      newControl.parentId = "";
      newControl.detailId = ""; //清空明细表Id
      //newControl.style.left+=50;
      var isCloneRight = true;
      if ($(cfg.el).hasClass("design-copy-ctrl-right")) {
        //向右复制
        newControl.style.left += newControl.style.width;
        newControl.style.left -= newControl.style.borderLeftWidth;
      } else {
        //向下复制
        newControl.style.top += newControl.style.height;
        newControl.style.top -= newControl.style.borderTopWidth;
        isCloneRight = false;
      }
      me.data.style.currControlZIndex++;
      newControl.style.zIndex = me.data.style.currControlZIndex;
      var childHtmls = [];
      /** 虚拟表格控件的 复制，需要复制 控件，并且需要变更 单元格信息*****/
      if (newControl.htmlType == "tableLine") {
        me.selectRect = null;
        var cellsMap = newControl.style.cellsMap || {};
        for (var i in cellsMap) {
          var rect = cellsMap[i];
          if (rect && rect.controlId && rect.tableLineId) {
            var childControl = me.getControlById(rect.controlId);
            if (childControl) {
              var newChildControl = oui.parseJson(
                oui.parseString(childControl)
              );
              newChildControl.id = me.newId();
              newChildControl.bizId = me.newId();

              me.data.controls.push(newChildControl); //新增控件
              rect.controlId = newChildControl.id;
              rect.tableLineId = newControl.id;
              newChildControl.parentId = newControl.id; //父Id为表格id
              if (newChildControl.detailId) {
                newChildControl.detailId = newControl.bizId; //父控件的业务Id
              }
              if (isCloneRight) {
                //向右复制
                rect.left += newControl.style.width;
                rect.left -= newControl.style.borderLeftWidth;

                rect.right += newControl.style.width;
                rect.right -= newControl.style.borderLeftWidth;
              } else {
                //向下复制
                rect.top += newControl.style.height;
                rect.top -= newControl.style.borderTopWidth;
                rect.bottom += newControl.style.height;
                rect.bottom -= newControl.style.borderTopWidth;
              }
              me.setRectInTableLineByColumnAndRow(newControl, rect);
              newChildControl.style.rect = rect;
              newChildControl.style.left = rect.left;
              newChildControl.style.top = rect.top;
              me.data.style.currControlZIndex++;
              newChildControl.style.zIndex = me.data.style.currControlZIndex;
              var tempHtml = oui
                .getById("items")
                .getHtmlByTplId("item-tpl", { item: newChildControl });
              childHtmls.push(tempHtml);
            } else {
              me.removeRectInTableLineByColumnAndRow(
                newControl,
                rect.columnIndex,
                rect.rowIndex
              );
            }
          }
        }
        me.refreshTableLineMergeCells(newControl); //刷新 克隆控件 的合并单元格的位置信息
      } else {
        //控件的复制 需要 删除虚拟表格单元格信息
        if (newControl && newControl.style && newControl.style.rect) {
          newControl.style.left = parseInt(newControl.style.left);
          newControl.style.top = parseInt(newControl.style.top);
          newControl.style.width = parseInt(newControl.style.width);
          newControl.style.height = parseInt(newControl.style.height);

          newControl.style.rect = null;
          delete newControl.style.rect;
        }
      }
      var currIdx = -1;
      if (control.parentId) {
        //在格子里面
        oui.findOneFromArrayBy(me.data.controls || [], function(item, index) {
          if (item.id == control.parentId) {
            currIdx = index;
            return true;
          }
        });
      } else {
        //在格子外面
        oui.findOneFromArrayBy(me.data.controls || [], function(item, index) {
          if (item.id == id) {
            currIdx = index;
            return true;
          }
        });
      }

      me.data.controls.splice(currIdx + 1, 0, newControl); //先移除再 插入
      me.addTableLineControl(newControl);

      var html = oui
        .getById("items")
        .getHtmlByTplId("item-tpl", { item: newControl });
      var container = oui.getById("items").getEl();
      $(container)
        .find(".paper-area")
        .append(html + childHtmls.join(""));
      $(".active", ".paper-area").removeClass("active");
      $("#" + newControl.id).addClass("active");
      me.updateControlsByPageDesignType(newControl);
      if (newControl.controlType == "detail") {
        me.renderCenterAll();
      } else {
        oui.parse();
      }
      me.showOperationArea(newControl);
      me.setCurrPropsData(newControl, "center", "cloneField");
    },
    /** 删除控件****/
    event2removeControl: function(cfg) {
      var me = this;
      var $control = $(cfg.el).closest(".control-abs-component");
      var id = $control.attr(me.controlDomAttrPrefix + "id");
      var curr = me.getControlById(id);
      var disableSelector = [];
      if (curr) {
        disableSelector.push(
          ".control-abs-disable[control-abs-id=" + curr.id + "]"
        );
      }
      var $focus = $(".design-right :focus");
      //失去焦点+延迟处理，解决属性面板中 输入框值改变事件导致更新所有控件的问题
      if ($focus && $focus.length) {
        $focus.blur();
      }

      setTimeout(function() {
        me.removeControlById(id);
        $("#" + id, ".paper-area").remove();
        if (disableSelector.length) {
          $(disableSelector.join(","), ".design-left").removeClass(
            "control-abs-disable"
          );
        }
        me.updateControlsByPageDesignType();
        me.hideOperationArea();
        me.renderCenterAll();
        me.setCurrPropsData4page();
      }, 50);
    },
    renderCenterAll: function() {
      var me = this;
      me.clearControlRefs();
      oui.clearByContainer("#control_items");
      oui.clear4notUse();
      oui.getById("items").render();
      oui.parse();
      me.$operation = null;
    },
    setCurrPropsData4page: function(type, state) {
      var me = this;
      if (type == "props") {
        me.isRenderAll = true;
      } else {
        me.isRenderAll = false;
      }
      /** 此行代码非常关键，用于 指定全局 页面对象*****/
      if (!me._globalPageData) {
        me._globalPageData = {
          style: me.data.innerStyle.style,
          innerStyle: {
            styleInnerOuter: me.data.innerStyle.styleInnerOuter,
            styleTitle: me.data.innerStyle.styleTitle,
            styleFieldOuter: me.data.innerStyle.styleFieldOuter,
            styleField: me.data.innerStyle.styleField,
          },
        };
      }
      me.setCurrPropsData(
        me._globalPageData,
        type || "center",
        state || "down2selectPage"
      );
    },
    /***
     * 获取当前业务属性配置
     */
    getCurrentBizConfig: function() {
      var me = this;
      var currentControl = me.data.currentControl || {};
      if (!this.currentBizConfig) {
        this.currentBizConfig = {};
      }
      this.currentBizConfig.id = currentControl.id;
      this.currentBizConfig.designFullName = me.FullName;
      return this.currentBizConfig;
    },
    getPageBizConfig: function() {
      var me = this;
      if (!this.pageBizConfig) {
        this.pageBizConfig = {};
      }
      this.pageBizConfig.designFullName = me.FullName;

      return this.pageBizConfig;
    },
    /***选择图片 ***/
    event2showCutImg: function(cfg) {
      var me = this;
      /**
       * confirm, 截图完成后，确定事件 function(base64,boxData,o){},第一个参数返回base64，第二个参数截图宽高位置信息，第三个参数截图对象
       * cancel, 取消事件，关闭窗口
       * cropBoxResizable, 是否允许改变截图框大小，默认值false
       * boxWidth, 截图框默认宽
       * boxHeight,截图框默认高
       * showPreview,是否显示预览区域，默认值true
       * panelStyle 截图组件外框样式
       * ***/
      var $scrollEl = $(".design-middle");

      //静态页面 跨 window、iframe、传入动态上传路径
      oui.uploadURL =
        oui.uploadURL || me.paramCfg.uploadUrl || oui.getTop().oui.uploadURL;

      var propKey = $(cfg.el).attr("changeProp");

      oui.showCutImg({
        cropBoxResizable: true,
        boxWidth: 500,
        boxHeight: 300,
        showPreview: true,
        panelStyle:
          "width:" +
          $scrollEl.width() +
          "px;height:" +
          $scrollEl.height() +
          "px",
        confirm: function(base64, boxData, o) {
          oui.uploadBase64(
            base64,
            function(result) {
              var imgId = result.imgId;
              var imgName = o.attr("file").name;
              var previewUrl = result.previewUrl;
              //me.data.attachments.push({
              //    id:imgId,
              //    name:imgName
              //});
              if (!propKey) {
                //默认改变页面背景
                me.data.backgroundImageId = imgId;
                me.data.backgroundImageName = imgName;
                me.data.backgroundImage = previewUrl;

                me.renderPaperStyle();
              } else {
                //otherAttrs.imgId
                //otherAttrs.imgName
                //ohterAttrs.img
                oui.JsonPathUtil.setObjByPath(
                  propKey + "Id",
                  me.data,
                  imgId,
                  true
                ); //设置图片Id
                oui.JsonPathUtil.setObjByPath(
                  propKey + "Name",
                  me.data,
                  imgName,
                  true
                ); //设置图片名称
                oui.JsonPathUtil.setObjByPath(
                  propKey,
                  me.data,
                  previewUrl,
                  true
                ); //设置图片url
                me.changed4props({}, function() {
                  me.setCurrPropsData(
                    me.data.currentControl,
                    "center",
                    "down2selectField"
                  );
                });
              }
            },
            o.attr("file").name
          );
        },
        cancel: function() {},
      });
    },

    /** 创建选择区域,取消选择区域****/
    event2selectBoxArea: function(cfg) {
      var me = this;
      me.hideOperationArea();
      if (me.hasSelectBox()) {
        //取消选择区域
        me.removeSelectBox();
        $(cfg.el).text("选取区域");
        me.setCurrPropsData4page();
      } else {
        //创建选择区域
        var $scrollEl = $(".design-middle");
        var $paper = $(".paper-area");

        var componentId = me.newId();
        var currField = {};
        currField.id = componentId;
        currField.name = "";
        currField.htmlType = ControlTypeEnum.selectArea.name;
        currField.controlType = ControlTypeEnum.selectArea.name;
        currField.style = {
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
          opacity: 1,
          borderLeftColor: "#e6e6e6",
          borderTopColor: "#e6e6e6",
          borderRightColor: "#e6e6e6",
          borderBottomColor: "#e6e6e6",
          borderLeftStyle: "solid",
          borderTopStyle: "solid",
          borderRightStyle: "solid",
          borderBottomStyle: "solid",
        };
        currField.style.width = 360;
        currField.style.height = 270;

        var width4mm =
          (me.data.style.width / $paper.width()) * currField.style.width;
        var height4mm =
          (me.data.style.height / $paper.height()) * currField.style.height;
        currField.style.width4mm = width4mm;
        currField.style.height4mm = height4mm;
        var left =
          $scrollEl[0].scrollLeft +
          ($scrollEl.width() - currField.style.width) / 2 -
          $paper[0].offsetLeft;
        var top =
          $scrollEl[0].scrollTop +
          ($scrollEl.height() - currField.style.height) / 2 -
          $paper[0].offsetTop;
        left = parseInt(left);
        top = parseInt(top);
        if (left < 0) {
          left = 0;
        }
        if (top < 0) {
          top = 0;
        }
        currField.style.left = left;
        currField.style.top = top;

        me.data.controls.push(currField);
        var html = oui
          .getById("items")
          .getHtmlByTplId("item-tpl", { item: currField });
        var container = oui.getById("items").getEl();
        $(container)
          .find(".paper-area")
          .append(html);
        $(".active", ".paper-area").removeClass("active");
        $("#" + currField.id).addClass("active");
        $(cfg.el).text("取消选取");
        me.showOperationArea(currField);
        me.setCurrPropsData(currField, "center", "down2selectField");
      }
    },
    /** 预览逻辑****/
    event2preview: function() {
      var me = this;
      var url =
        oui.getContextPath() + "res_engine/page_design/pc/page-runtime.html";
      url = oui.addParams(url, {
        contextPath: oui.getContextPath(),
      });
      var win = oui.openWindow({
        url: url,
        //openType:'_blank',
        title: "预览",
      });
      if (oui.browser.ie || oui.browser.isEdge) {
        window.designDataJson = oui.parseString(me.getDesignData());
      } else {
        win.designDataJson = oui.parseString(me.getDesignData());
      }
    },
    /***
     * 查看运行态表单效果
     */
    event2runForm: function() {
      var me = this;
      var html = "";
      if (me.hasSelectBox()) {
        html = me.findSelectAreaHtml();
      } else {
        html = oui.getById("items").getEl().innerHTML;
      }
      var win = oui.openWindow({
        url:
          oui.getContextPath() + "res_engine/page_design/pc/page-preview.html",
        //openType:'_blank',
        title: "预览",
      });
      win.bodyHtml = html;
    },
    checkSaved: function(ok, cancel, title) {
      var me = this;
      if (me.hasChange) {
        oui.getTop().oui.confirmDialog(
          title || "当前页面没保存",
          function() {
            ok && ok();
          },
          function() {
            cancel && cancel();
          }
        );
        return false;
      }
      ok && ok();
      return true;
    },
    event2loadFile: function(cfg) {
      var me = this;
      var files = cfg.el.files;
      if (files && files.length) {
        var file = files[0];

        if (me.hasChange) {
          oui.getTop().oui.alert("当前页面没保存，请导出备份后再导入");
          return;
        } else {
          var read = new FileReader(); //创建读取器对象FileReader
          read.readAsText(file); //开始读取文件

          read.onload = function() {
            var result = read.result;
            $("#import-file").val("");

            var json = null;
            try {
              json = oui.parseJson(result);
            } catch (err) {
              json = {};
            }
            if (!json.id) {
              oui.getTop().oui.alert("导入失败");
              return;
            } else {
              var data = json;
              window.localStorage[data.id] = oui.parseString(data);
              var cacheExpireDate = new Date() - 1 + 30 * 24 * 60 * 60 * 1000; //默认缓存30天
              var ver = {
                exp: cacheExpireDate,
              };
              window.localStorage[data.id + "_version"] = oui.parseString(ver);
              var url = location.href;
              url = oui.setParam(url, "successTips", "true");
              url = oui.setParam(url, "message", "导入成功");
              url = oui.setParam(url, "id", data.id);
              oui.go(url);
            }
          };
        }
      }
    },
    event2new: function() {
      var me = this;
      me.checkSaved(
        function() {
          var url = location.href;
          url = oui.setParam(url, "successTips", "");
          url = oui.setParam(url, "message", "");
          url = oui.setParam(url, "id", "");
          oui.go(url);
        },
        function() {}
      );
    },
    /** 导入***/
    event2import: function() {
      $("#import-file").click();
    },

    /** 导出****/
    event2export: function() {
      var me = this;
      // 引入上边的js后，就可以调用生成文本的方法 另外ie下会有中文乱码的问题
      var data = me.getDesignData();
      if (!data.id) {
        oui.getTop().oui.alert("当前页面没有保存");
        return;
      }
      var blob = new Blob([oui.parseString(data)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, data.name + ".json");
    },
    event2triggerPaperDown: function(cfg) {
      $(".paper-area").trigger("mousedown");
    },
    down2selectPaperArea: function(cfg) {
      var me = this;
      if (!$(cfg.e.target).is(".paper-area")) {
        return;
      }
      me.currAccordingActiveId = "";
      //选中当前页，并进行属性渲染
      $(".active", ".paper-area").removeClass("active");
      $(cfg.el).addClass("active");
      if (
        me.data.currentControl &&
        me.data.currentControl.htmlType == "tableLine"
      ) {
        if (me.data.currentControl.style.isDragging4SelectArea) {
          me.data.currentControl.style.isDragging4SelectArea = false;
          var $ctrl = $("#" + me.data.currentControl.id, ".paper-area");
          $ctrl.removeClass("drag-select-area");
          $ctrl.find(".tableLine-edit-icon").attr("title", "编辑完成");
          me.hideOperationArea();
        }
      }
      me.hideOperationArea();

      me.setCurrPropsData4page();
    },
    findItems: function() {
      var me = this;
      return me.data.controls || [];
    },
    /****
     * 获取列表字段
     */
    findItems4list: function() {
      var me = this;
      var arr = oui.findManyFromArrayBy(me.data.controls || [], function(item) {
        if (item.formField || item.isFormField) {
          if (!item.detailId) {
            //主表字段
            return true;
          }
        }
      });
      return arr;
    },
    findSelectAreaItems: function() {
      var me = this;
      var arr = [];
      if (!me.hasSelectBox()) {
        return arr;
      }
      var selectBox = me.findSelectBox();
      var boxLeft = selectBox.style.left + selectBox.style.borderLeftWidth;
      var boxTop = selectBox.style.top + selectBox.style.borderTopWidth;
      var boxRight =
        selectBox.style.left +
        selectBox.style.width +
        selectBox.style.borderRightWidth;
      var boxBottom =
        selectBox.style.top +
        selectBox.style.height +
        selectBox.style.borderBottomWidth;
      var items = me.findItems();

      for (var i = 0, len = items.length; i < len; i++) {
        var curr = items[i];
        if (curr == selectBox) {
          var temp = $.extend(true, {}, curr);
          temp.style.left -= boxLeft;
          temp.style.top -= boxTop;
          arr.push(temp);
        } else {
          var currLeft = curr.style.left;
          var currTop = curr.style.top;
          var currRight = curr.style.left + curr.style.width;
          var currBottom = curr.style.top + curr.style.height;
          if (
            currRight > boxLeft &&
            currBottom > boxTop &&
            currLeft < boxRight &&
            currBottom > boxTop &&
            currTop < boxBottom
          ) {
            //在区域内
            var temp = $.extend(true, {}, curr);
            temp.style.left -= boxLeft;
            temp.style.top -= boxTop;
            arr.push(temp);
          }
        }
      }
      return arr;
    },
    /** 获取选择区域html*****/
    findSelectAreaHtml: function(render4tpl) {
      var me = this;
      if (!me.hasSelectBox()) {
        return "";
      }
      if (!me._renderSelectAreaHtml) {
        me._renderSelectAreaHtml = template.compile(
          document.getElementById("items-select-tpl").innerHTML
        );
      }
      var html = me._renderSelectAreaHtml({ render4tpl: render4tpl });
      return html;
    },
    /*** 获取正个内容区域 html****/
    findContentAreaHtml: function(render4tpl) {
      //items-server-tpl
      var me = this;

      if (!me._renderContentAreaHtml) {
        me._renderContentAreaHtml = template.compile(
          document.getElementById("items-content-tpl").innerHTML
        );
      }
      var html = me._renderContentAreaHtml({ render4tpl: render4tpl });
      return html;
    },
    /** 获取当前 页面设计的属性配置列表****/
    getDesignData: function() {
      var data = {};
      var me = this;
      var keys = me.pageKeys;

      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        data[key] = me.data[key];
      }
      data.content = me.findContentAreaHtml(true);
      data.selectContent = me.findSelectAreaHtml(true);
      data.listContent = me.findContent4list(true);
      return data;
    },
    /****
     * 渲染列表内容
     * @param flag
     */
    findContent4list: function(flag) {
      var me = this;
      var content = me.plugin.PageDesignControlAdapter.renderPageList(flag);
      content = $.trim(content);
      return content;
    },
    /** 保存逻辑*****/
    event2save: function() {
      var me = this;
      var data = me.getDesignData();
      me.paramCfg.page = data;
      me.updateParamCfgSource(me.paramCfg); //更新调用处参数
      var saveCallbackMethod = me.findCallbackByName("save");
      var plugin = me.plugin || {};
      me.hasChange = false;
      var param = oui.getParam();
      console.info(saveCallbackMethod, "param");

      if (param.id) {
        //加载表单定义
        oui.biz.api(
          "savePageDesign",
          data,
          function(res) {
            me.data.id = data.id = res.data.id; //成功回调

            if (saveCallbackMethod) {
              var controlConfig = {};
              var controls = data.controls || [];
              for (var i = 0, len = controls.length; i < len; i++) {
                if (controls[i].controlType) {
                  //存在业务的控件类型才处理
                  controlConfig[controls[i].id] = controls[i].otherAttrs || {};
                }
              }
              saveCallbackMethod.call(
                plugin,
                data.otherAttrs || {},
                controlConfig,
                data
              );
            }
          },
          function(res) {
            console.log("保存表单失败");
            console.log(res);
          }
        );
      } else {
        if (saveCallbackMethod) {
          var controlConfig = {};
          var controls = data.controls || [];
          for (var i = 0, len = controls.length; i < len; i++) {
            if (controls[i].controlType) {
              //存在业务的控件类型才处理
              controlConfig[controls[i].id] = controls[i].otherAttrs || {};
            }
          }
          saveCallbackMethod.call(
            plugin,
            data.otherAttrs || {},
            controlConfig,
            data
          );
        }
      }
    },

    /** 根据url参数中的 数据Id 和 表单id进行打印 ,TODO demo 使用 待删除*****/
    printFormData: function() {
      var me = this;
      var dataIds = oui.getParam("dataIds");
      var formId = oui.getParam("formId");

      //  提交模板 和数据id到后台，后台 根据查询数据信息进行控件显示值渲染，进入打印页面
      var url = oui.getContextPath() + "form/bizFormData.do?method=index4print";
      url = oui.setParam(url, "formId", formId);
      url = oui.setParam(url, "dataIds", dataIds);
      var templateHtml = "";
      var data = me.getDesignData();
      var templateHtml = data.selectContent || data.content;
      oui.postData(
        url,
        {
          formId: formId,
          dataIds: dataIds,
          template: templateHtml,
        },
        function(res) {
          if (res.success) {
            var json = oui.parseJson(res.msg);
            var html = json.html;
            if (!win.oui_url) {
              win.oui_url = {
                print_preview: oui.getContextPath() + "common.do?method=print", //打印预览
              };
            }
            var content =
              '<link href="' +
              oui.getContextPath() +
              'res_engine/page_design/pc/css/page-common.css" type="text/css" rel="stylesheet"/>';
            content +=
              '<style type="text/css"> .paper-area {overflow:hidden;} .control-abs{position:absolute;}</style>';
            content += html;
            //oui.printIt({
            //    content: content
            //});
            $.printContentInIFrame(content, {
              globalStyles: true,
              mediaPrint: false,
              stylesheet: null,
              noPrintSelector: ".no-print",
              iframe: true,
              append: null,
              prepend: null,
              manuallyCopyFormValues: true,
              deferred: $.Deferred(),
              timeout: 750,
              title: null,
              doctype: "<!doctype html>",
            });
          } else {
            oui.getTop().oui.alert("数据转换成html失败");
          }
        },
        function(res) {
          oui.getTop().oui.alert("由于网络问题，打印模板提交失败");
        },
        "打印页面生成中..."
      );
    },
    findCallbackByName: function(name) {
      var me = this;
      var callbackMethods = me.paramCfg.callbackMethods || {};
      console.info(callbackMethods, "callbackMethods");
      var method = callbackMethods[name + "CallbackMethod"] || "";
      var plugin = me.plugin || {};
      console.info(plugin, "pluginplugin");
      if (method) {
        if (method.indexOf(".") > -1) {
          method = oui.JsonPathUtil.getJsonByPath(method, window);
        } else {
          method = plugin[method];
        }
      }

      return method;
    },

    /** TODO  需要调整****/
    event2print: function(cfg) {
      var me = this;
      var data = me.getDesignData();
      var method = me.findCallbackByName("print");
      var plugin = me.plugin || {};
      if (method) {
        var controlConfig = {};
        var controls = data.controls || [];
        for (var i = 0, len = controls.length; i < len; i++) {
          if (controls[i].controlType) {
            //存在业务的控件类型才处理
            controlConfig[controls[i].id] = controls[i].otherAttrs || {};
          }
        }
        method.call(plugin, data.otherAttrs || {}, controlConfig, data);
      }

      //var content = '<link href="' + oui.getContextPath() + 'res_engine/page_design/pc/css/page-common.css" type="text/css" rel="stylesheet"/>';
      //content+='<style type="text/css"> .paper-area {overflow:hidden;} .control-abs{position:absolute;}</style>';
      //content += html;
      ///** 进入打印页面 ***/
      //$.printContentInIFrame(content,{
      //    globalStyles: true,
      //    mediaPrint: false,
      //    stylesheet: null,
      //    noPrintSelector: ".no-print",
      //    iframe: true,
      //    append: null,
      //    prepend: null,
      //    manuallyCopyFormValues: true,
      //    deferred: $.Deferred(),
      //    timeout: 750,
      //    title: null,
      //    doctype: '<!doctype html>'
      //});
    },
    /***测试批量打印 ****/
    event2printBatch: function(cfg) {
      var me = this;
      if (!win.oui_url) {
        win.oui_url = {
          print_preview: oui.getContextPath() + "common.do?method=print", //打印预览
        };
      }
      var content =
        '<link href="' +
        oui.getContextPath() +
        'res_engine/page_design/pc/css/page-common.css" type="text/css" rel="stylesheet"/>';
      content +=
        '<style type="text/css"> .paper-area {overflow:hidden;} .control-abs{position:absolute;}</style>';
      var itemHtml = "";
      if (me.hasSelectBox()) {
        itemHtml = me.findSelectAreaHtml();
      } else {
        itemHtml = oui.getById("items").getEl().innerHTML;
      }
      var s = "";
      s += content;
      for (var i = 0; i < 5; i++) {
        s += itemHtml;
      }
      //oui.printIt({
      //    content:s
      //});
      //$.printContentInNewWindow
      $.printContentInIFrame(s, {
        globalStyles: true,
        mediaPrint: false,
        stylesheet: null,
        noPrintSelector: ".no-print",
        iframe: true,
        append: null,
        prepend: null,
        manuallyCopyFormValues: true,
        deferred: $.Deferred(),
        timeout: 750,
        title: null,
        doctype: "<!doctype html>",
      });
    },
    initEnd: function() {
      this.inited = true;
      var me = this;

      if (me.hasSelectBox()) {
        $("#btn-select-box").text("取消选取");
      }

      me.renderPaperStyle();

      setTimeout(function() {
        me.setCurrPropsData4page("center", "init");
        var $paper = $(".paper-area");
        var width = $paper.width();
        var height = $paper.height();
        me.data.style.width4px = width;
        me.data.style.height4px = height;
      }, 30);
    },
    getWidthPercent: function(width4px) {
      var me = this;
      if (me.data.style.width4px < width4px) {
        return "100%";
      }
      var percent = (10000 * width4px) / me.data.style.width4px;
      percent = percent / 100;
      percent = percent.toFixed(4);
      return percent + "%";
    },
    findCurrentPropslUrl() {
      let currentControldata =
        com.oui.absolute.AbsoluteDesign.data.currentControl;
      if (
        currentControldata &&
        currentControldata.id &&
        currentControldata.controlType
      ) {
        console.log("---->", currentControldata.controlType); 
        //组件属性面板地址
        return (
          "res_engine/page_design/pc/components-biz-prop-tpl/detail/" +
          currentControldata.controlType +
          ".vue.html"
        );
      } else {
        return "res_engine/page_design/pc/components-biz-prop-tpl/default.vue.html";
      }
    },
  };
  AbsoluteDesign = oui.biz.Tool.crateOrUpdateClass(AbsoluteDesign);
})(window, window.$$ || window.$);
