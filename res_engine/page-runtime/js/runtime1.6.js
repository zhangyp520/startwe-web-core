!(function() {
  var PageRuntime = {
    package: "com.startwe.models.page.web", //com.startwe.models.page.web.PageRuntime
    class: "PageRuntime",
    data: { 
    },
    init: function() {
      var me = this;
      me.data = {};
      template.helper("PageRuntime", this);

      var nodeId = "3D301376127285161707";
      var nodeType = "pageList";
      

      me.data.pageId = nodeId; //页面id
      me.data.nodeId = nodeId + "-list";
      me.data.logic4query = "";

      var loadMenusUrl = oui.getParam("loadMenusUrl");
      var  renderUrl = oui.getParam("renderUrl");
      var nodeType4page = oui.getParamByUrl(loadMenusUrl, "nodeType");

      
      var Portal = com.startwe.models.portal.web.PortalController;
      
      var projectListTemplate = "";
      oui.getData(renderUrl,{},function(res){

        projectListTemplate = res.projectListTemplate.content 
        
        var content =  JSON.parse(res.projectListTemplate.controls)[0];

        console.info(content,'content')

        me.data.pageData = 
                oui.util.createPageData({
                    refresh:function(){
                        me.refresh&&me.refresh();
                    },
                    save:function(success,error){
                    me.saveFormData(success,error);
                    },  
                    mainData:{},//主表数据
                    designer:content,
                    detailData:{},//子表数据
                    getDesigner:me.getDesigner,
                    findCurrentPropslUrl:me.findCurrentPropslUrl,
                    findControlUrl:me.findControlUrl,
                });
        
        

        var tplRender = template.compile(projectListTemplate || ""); 
        var html = tplRender(me.data); 
        me.data.content = html; 
      
        
       

        oui.parse({
            callback: function() {
             // me.bindEvents();
            },
          });
 
      },'加载中...')

        

     
     
    },
    getDesigner(){
        console.info("getDesigner")
    },
    getData: function() {
      var me = this;
      return me.data;
    },
    findControlUrl: function(control) {
        //设计态和运行态 此处不同
        // if (control && control.otherAttrs.useRelation) {
        //   //存在关联关系
        //   //TODO 后续考虑 多端 的关联控件适配
        //   // return "res_common/oui/ui/ui_pc/components/association.vue.html";
        //   return (
        //     "res_common/oui/ui/ui_pc/components/" +
        //     control.controlType +
        //     ".vue.html"
        //   );
        // } else if (control) {
        //   //TODO 此处后续扩展多端
        //   return (
        //     "res_common/oui/ui/ui_pc/components/" +
        //     control.controlType +
        //     ".vue.html"
        //   );
        // }
        // 4/11所有类型的控件 都不判断是否存在关联关系，默认都可以在空间里面配置关联关系逻辑
        if (control) {
            //TODO 此处后续扩展多端
            return (
              "res_common/oui/ui/ui_pc/components/" +
              control.controlType +
              ".vue.html"
            );
          }
      },
    findCurrentPropslUrl() {
        let currentControldata =
          com.oui.absolute.AbsoluteDesign.data.currentControl;
        if (
          currentControldata &&
          currentControldata.id &&
          currentControldata.controlType
        ) {
          // console.log("---->", currentControldata.controlType); 
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
      bindEvents:function(){

      }
  };

  PageRuntime = oui.biz.Tool.crateOrUpdateClass(PageRuntime);
})();
