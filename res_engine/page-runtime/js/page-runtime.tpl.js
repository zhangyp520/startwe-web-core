/**
 *
 * 使用了缓存，在这过程中改变了打印模板或者改变了数据，需要刷新

 */
(function (win) {

    /**
     * 渲染某个控件
     * @param tpl 整个模板对象
     * @param control 当前控件对象
     * @param data 当前控件data 数据
     * @param controlMap 控件集合
     * @param dataMap 全数据（关联用）
     */
    var PageRuntimePlugin={};
    PageRuntimePlugin.renderControl = function (tpl, control, data, controlMap, dataMap) {
        var html = "";
        var controlType = control.controlType;
        if(controlType) {//自有控件
            if(controlType === 'QRCode' || controlType === 'barCode') {
                var content = "";
                if(control.otherAttrs && control.otherAttrs.refBizId) {
                    var refBizId = control.otherAttrs.refBizId;
                    var refData = dataMap[refBizId];
                    content = refData && refData.value;
                }
                if(content) {
                    var url = oui.showQRcode(content);
                    url = oui.setParam(url, "isBarCode", controlType === 'barCode');

                    if(controlType === 'QRCode') {// 二维码设置留白间距0
                        url = oui.setParam(url, "margin", 0);
                    }else if(controlType === 'barCode'){
                        var style = oui.parseJson(control.style);
                        url = oui.setParam(url, "width", style.width);
                        url = oui.setParam(url, "height", style.height);
                    }
                    html = oui.PageDesignControlRuntimeAdapter.render(control, {
                        url: url
                    });
                }
            } else {
                html = oui.PageDesignControlRuntimeAdapter.render(control, data);
            }

        } else {//设计器预置控件
            if(control.htmlType === 'image') {
                html = oui.PageDesignControlRuntimeAdapter.render(control, data);
            }
        }
        return html;
    };

    /********************  运行态 控件数据渲染接口定义 参考 ******************************************/
    var PageData = function (cfg) {
        var temp = {
            designer:null,
            mainData:null,
            detailData:null
        };
        $.extend(true,this,temp,cfg);
        this.getData =  getData;
        this.getHtml = getHtml;
        this.getControl = getControl;
        this.getDataList = getDataList;
        this.renderAfter = renderAfter;
        this.getDesigner = getDesigner;
    };
    /*** 根据id获取控件定义对象****/
    var getControl = function (id) {
        var controls= this.designer.controls||[];
        var one = oui.findOneFromArrayBy(controls,function(item){
            if(item.id == id){
                return true;
            }
        });
        return one ||{};
    };
    /** 获取主表数据*****/
    var getData = function () {
        return this.mainData||{};
    };
    /** 获取数据表格中数据******/
    var getDataList = function (detailId) {
        var detailData = this.detailData||{};
        return detailData[detailId]||[];
    };
    /**** 根据控件定义 和控件数据 获取 html内容 *****/
    var getHtml = function (control,dataMap) {
        return oui.PageDesignControlRuntimeAdapter.render(control,dataMap[control.id]);
    };

    /** 运行态获取 设计对象*****/
    var getDesigner = function(){
        return this.designer||{};
    };
    /**** 整个页面模板渲染完成的后置脚本,如处理 二次加工dom操作*****************/
    var renderAfter = function(){

    };
    var PageRuntimePageData= {
        "package": "com.startwe.models.page.web",//com.startwe.models.page.web.PageRuntimePageData
        "class": "PageRuntimePageData",
        create:function(options){
            //使用单例对象创建
            var me = this;
            me.pageData = new PageData({});
            $.extend(true,me.pageData,options);
            return me.pageData;
        }
    };
    PageRuntimePageData = oui.biz.Tool.crateOrUpdateClass(PageRuntimePageData);
})(window);