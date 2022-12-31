/**
 * @author oui
 * @date 2015/12/24 0024
 */
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
        this.showImg = showImg;
        this.getImageUrl = getImageUrl;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/

    };
    ctrl["imagegroup"] = ImageGroup;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    ImageGroup.FullName = "oui.$.ctrl.imagegroup";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    ImageGroup.templateHtml = [];

    ImageGroup.templateHtml[0] = ImageGroup.templateHtml[1] =
        '<div class="swiper-container swiper-container-{{ouiId}} {{if right==\'design\'}}swiper-container-horizontal{{/if}}" style="width: 100%;height: 240px;">' +
        '<div class="swiper-wrapper" style="line-height: 225px;height:225px;">' +
        '{{if data.length > 0 }}' +
        '{{each data as item index}}' +
        '<div onTap="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\',\'{{item.display}}\')" class="swiper-slide" style="text-align: center;">' +
        '{{if right == "design" }}'+
        '<img src="{{oui.getByOuiId(ouiId).getImageUrl(item.url)}}"/>' +
        '{{else}}'+
        '<img src="{{oui.getContextPath()}}res_common/oui/ui/ui_pc/images/placeholder-image.png" data-src="{{oui.getByOuiId(ouiId).getImageUrl(item.url)}}" />' +
        '{{/if}}'+
        '{{if item.display && item.display.length > 0}}<span class="swiper-img-text">{{=item.display}}</span>{{/if}}' +
        '</div>' +
        '{{/each}}' +
        '{{else}}' +
        '<div class="swiper-slide" style="background: #f1f2f2;"><span class="swiper-img-text">图片组说明</span></div>' +
        '{{/if}}' +
        '</div>' +
        '{{if data && data.length > 1 }}' +
        '<div class="swiper-pagination oui-class-swiper-pagination swiper-pagination-{{ouiId}}">' +
        '{{each data as item index}}' +
        '<span class="swiper-pagination-bullet {{if index == 0}}swiper-pagination-bullet-active{{/if}}"></span>' +
        '{{/each}}' +
        '</div>' +
        '{{/if}}' +
        '</div>';

    ImageGroup.templateHtml4readOnly = [];
    ImageGroup.templateHtml4readOnly[0] =
        ImageGroup.templateHtml4readOnly[1] = '{{if data && data.length > 0}}<img style="max-height:{{fixedHeight}}px;max-width:100%; vertical-align: top;" src="{{oui.getByOuiId(ouiId).getImageUrl(data[0].url)}}" />{{/if}}';

    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(ImageGroup,'edit4ReadOnly,edit4View','0,1',ImageGroup.templateHtml4readOnly[0]);


    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/


    //1.显示分页器（类型有两种：数字类型，点点类型） pagerType
    //2.是否自动播放 autoPlay

    var init = function () {
        var zoomView = this.attr("zoomView");
        zoomView = !(zoomView === 'false' || zoomView === false);
        this.attr("zoomView", zoomView);

        this.attr("allowInput", false);

        var fixedWidth = this.attr("fixedWidth");
        var fixedHeight = this.attr("fixedHeight");

        if (!fixedWidth && (fixedWidth+"" !== '0')) {
            this.attr("fixedWidth", 320);
        }

        if (!fixedHeight && (fixedHeight+"" !== '0')) {
            this.attr("fixedHeight", 240);
        }

        // this.attr("fixedWidth", 0);
        // this.attr("fixedHeight", 240);
        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("data", []);
            //oui.log("图片组 需要配置data属性");
        }

        console.log(this.attr("right"));

        //var autoPlay = this.attr("autoPlay");
        //if (autoPlay) {
        //    this.attr("autoPlay", true);
        //} else {
        //    this.attr("autoPlay", false);
        //}
        //var delayTime = this.attr("delayTime");
        //if (!delayTime) {
        //    this.attr("delayTime", 750);
        //}
        //var loop = this.attr("loop");
        //if (loop) {
        //    this.attr("loop", true);
        //} else {
        //    this.attr("loop", false);
        //}

        this.attr("loop", true);
        this.attr("delayTime", 3000);
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
        var self = this;
        var id = this.attr('ouiId');
        var autoPlay = this.attr("autoPlay") ? true : false;
        var delayTime = this.attr("delayTime");
        if (!delayTime) {
            delayTime = 3000;
        }
        var loop = this.attr("loop") ? true : false;

        var data = this.attr("data");
        if (data && data.length <= 1) {
            autoPlay = false;
            loop = false;
        }

        var $el = $(this.getEl());
        var initWidth = $el.width();
        $el.width(initWidth);

        var initSWiper = function(){
            new Swiper(".swiper-container-" + id, {
                //分页器
                autoplay: (autoPlay && delayTime) ? delayTime : false,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination-' + id,
                lazyLoading: false,
                speed: 1000,
                loop: loop
            });
        };
        if (!win['Swiper']) {
            oui.require([
                oui.getContextPath() + 'res_common/third/swiper/swiper.css',
                oui.getContextPath() + 'res_common/third/swiper/swiper.js'
            ], function () {
                initSWiper();
            }, null);
        } else {
            initSWiper();
        }
    };


    var showImg = function (imgURL, imgContent) {
        var zoomView = this.attr("zoomView");
        if (zoomView) {
            if (!oui.os.mobile && this.attr("right") === "preview") {
                oui.getTop().open(imgURL);
            } else {
                var data = this.attr("data");
                var urls = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    var d = data[i];
                    urls.push(oui.getImgUrl(d.url));
                }
                oui.previewImageDialog({
                    current: imgURL,
                    items: urls
                });
            }
        }
    };
    /*******************************控件类的自定义函数 end******************************************/
})(window);





