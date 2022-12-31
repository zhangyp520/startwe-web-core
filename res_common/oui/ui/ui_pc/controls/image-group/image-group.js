(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var ImageGroup = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",defaultIndex,autoPlay,loop,delayTime,fixedWidth,fixedHeight,fixedScale,zoomView";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.afterRender = afterRender;
        this.cWH = cWH;
        this.showImg = showImg;
        this.getImageUrl = getImageUrl;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
        //this.getDisplay = getDisplay;
    };
    ctrl["imagegroup"] = ImageGroup;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    ImageGroup.FullName = "oui.$.ctrl.imagegroup";//设置当前类全名 静态变量


    ImageGroup.templateHtml = [];

    ImageGroup.templateHtml4readOnly = [];
    ImageGroup.templateHtml4readOnly[0] =
        ImageGroup.templateHtml4readOnly[1] = '{{if data && data.length > 0}}<img style="max-height:{{fixedHeight}}px;max-width:100%; vertical-align: top;" src="{{oui.getByOuiId(ouiId).getImageUrl(data[0].url)}}" />{{/if}}';

    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(ImageGroup,'edit4ReadOnly,edit4View','0,1',ImageGroup.templateHtml4readOnly[0]);

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    ImageGroup.templateHtml = [];
    // ImageGroup.templateHtml[0] =
    //     '<div class="oui-imagegroup" {{=events||""}} style="{{boxStyle}}">' +
    //     '{{each data as item index}}' +
    //     '<div><img src="' + oui_context.contextPath + 'file.do?method=showImage&id={{item.id}}" /></div>' +
    //     '{{/each}}' +
    //     '</div>';

    ImageGroup.templateHtml[0] = ImageGroup.templateHtml[1] =
        '<div id="oui-img-group-{{id}}" class="fullSlide" >' +
        '<div class="bd" style="height:360px;line-height:360px;">' +
        '<ul>' +
        '{{if data.length > 0 }}' +
        '{{each data as item index}}' +
        '<li>' +
        '<a title="点击查看原图" onclick="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\');">'+
        '{{if right=="design"}}'+
        '<img src="{{oui.getByOuiId(ouiId).getImageUrl(item.url)}}" />'+
        '{{else}}'+
        '<img src="{{oui.getContextPath()}}res_common/oui/ui/ui_pc/images/placeholder-image.png" data-src="{{oui.getByOuiId(ouiId).getImageUrl(item.url)}}" />'+
        '{{/if}}'+
        '</a>' +
        '{{if item.display && item.display.length > 0}}<span>{{=item.display}}</span>{{/if}}' +
        '</li>' +
        '{{/each}}' +
        '{{else}}' +
        '<li>' +
        '<span>图片组说明</span>' +
        '</li>' +
        '{{/if}}' +
        '</ul>' +
        '</div>' +
        '{{if data && data.length > 1 }}' +
        '<div class="hd">' +
        '<ul>' +
        '{{each data as item index}}' +
        '<li {{if index == 0}}class="on"{{/if}}></li>' +
        '{{/each}}' +
        '</ul>' +
        '</div>' +
        '<a class="prev" ></a>' +
        '<a class="next" ></a>' +
        '{{/if}}' +
        '</div>';

    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
        //this.attr("right", "edit");
        this.attr('allowInput', false);
        var zoomView = this.attr("zoomView");
        zoomView = !(zoomView === 'false' || zoomView === false);
        this.attr("zoomView", zoomView);
        var fixedWidth = this.attr("fixedWidth");
        var fixedHeight = this.attr("fixedHeight");

        if (!fixedWidth && (fixedWidth+"" !== '0')) {
            this.attr("fixedWidth", 640);
        }

        if (!fixedHeight && (fixedHeight+"" !== '0')) {
            this.attr("fixedHeight", 360);
        }
        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            oui.log("图片组 需要配置data属性");
        }

        this.attr("loop", true);
        this.attr("delayTime", 1500);
        this.attr("autoPlay", true);
    };

    var getImageUrl = function(url){
        var fixedScale = this.attr("fixedScale");
        if(fixedScale){
            url = oui.getImgUrl(url);
            url = oui.setParam(url, "scale", fixedScale);
        } else {
            var fixedWidth = this.attr("fixedWidth");
            var fixedHeight = this.attr("fixedHeight");
            url = oui.getImgUrl(url, fixedWidth, fixedHeight);
        }
        return url;
    };

    var afterRender = function () {
        //$(this.getEl()).removeClass("form-simulation");
        var self = this;
        var defaultIndex = this.attr("defaultIndex") || 0;
        var autoPlay = this.attr("autoPlay") ? true : false;
        var delayTime = this.attr("delayTime");
        if (!delayTime) {
            delayTime = 1500;
        }
        var loop = this.attr("loop") ? "leftLoop" : "left";

        var data = this.attr("data");
        if (data && data.length <= 1) {
            autoPlay = false;
            loop = false;
        }
        var initSlide = function(){
            if(self.attr("right") !== 'readOnly'){
                //FIXME 字段逻辑影响,会渲染多个图片出来
                $("#oui-img-group-" + self.attr("id")).slide({
                    titCell: ".hd ul",
                    mainCell: ".bd ul",
                    effect: loop,
                    vis: "1",
                    delayTime: delayTime,
                    autoPlay: autoPlay,
                    autoPage: true,
                    trigger: "click",
                    mouseOverStop: true,
                    defaultIndex: defaultIndex
                });
            }
        };
        if(!$.fn.slide){
            oui.require([
                oui.getContextPath() + 'res_common/third/SuperSlide/css/slide.css',
                oui.getContextPath() + 'res_common/third/SuperSlide/js/jquery.SuperSlide.2.1.2.source.js'
            ], function () {
                initSlide();
            }, null);
        } else {
            initSlide();
        }
    };


    /* 计算图片高度 */
    var cWH = function (obj) {
        var fixedWidth = parseFloat(this.attr("fixedWidth")), fixedHeight = parseFloat(this.attr("fixedHeight"));
        var imgObj = new Image();
        imgObj.src = obj.src;

        //利用图片对象加载完成的事件 获取图片的高宽
        imgObj.onload = function () {
            var oWidth = parseFloat(this.width);
            var oHeight = parseFloat(this.height);
            fixedWidth = $(obj).parent().width() || fixedWidth;

            if (oWidth > fixedWidth || oHeight > fixedHeight) {
                if (oWidth / fixedWidth >= oHeight / fixedHeight) {
                    oHeight = (oHeight * fixedWidth) / oWidth;
                    oWidth = fixedWidth;
                } else {
                    oWidth = (oWidth * fixedHeight) / oHeight;
                    oHeight = fixedHeight;
                }
            }
            //减去边框宽度
            $(obj).width(oWidth);
            $(obj).height(oHeight);
            imgObj = null;
        };
        imgObj.onerror = function () {
            imgObj = null;
        };
    };
    /*******************************控件类的自定义函数 end******************************************/

    var showImg = function (imgURL) {
        var zoomView = this.attr("zoomView");
        if (zoomView) {
            oui.getTop().oui.showImgDialog({imgUrl: imgURL});
        }
    };
})(window);





