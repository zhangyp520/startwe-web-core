/**
 * @author oui
 * @date 2015/12/24 0024
 */
(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var Img = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",src,contentCls,contentStyle,alt,title"; //当前控件自定义属性，无则去掉本行代码,\这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.getSrc = getSrc;
        this.setSrc = setSrc;
        this.renderBy = renderBy;
        this.show = show;
        this.hide = hide;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
    };
    ctrl["img"] = Img;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    Img.FullName = "oui.$.ctrl.img";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Img.templateHtml = [];

    Img.templateHtml[0] =
        '{{if sourceType === SOURCE_TYPE_ENUM.clsName}}' +//class类
        '<span class="{{contentCls}} {{src}}" style="{{contentStyle}}" title="{{title }}" ></span>' +
        '{{else}}' +//图片类
        '<div class="oui-img-content {{contentCls}}" style="{{contentStyle}}" >' +
        '<img src="{{src}}" alt="{{alt }}" title="{{title}}" />' +
        '</div>' +
        '{{/if}}';

    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/

    var SOURCE_TYPE_ENUM = {
        network: 1,
        local: 2,
        clsName: 3,
        base64:4
    };

    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
        template.helper("SOURCE_TYPE_ENUM", SOURCE_TYPE_ENUM);
        var self = this;
        var src = self.attr("src");
        var sourceType = getSourceType(src);
        self.attr("sourceType", sourceType);
        var title = self.attr("title");
        if(!title){
            if(sourceType !== SOURCE_TYPE_ENUM.base64 && sourceType !== SOURCE_TYPE_ENUM.clsName){
                title = src;
            }
        }
        self.attr("title", title);
    };

    var getSourceType = function(src){
        var sourceType;
        if (src.indexOf("http://") === 0 || src.indexOf("https://") === "0" || src.indexOf("//") === 0) {//外部网站地址
            sourceType = SOURCE_TYPE_ENUM.network;
        } else if (src.indexOf(".") >= 0) {//本地地址，包括直接图片和file.do 两种
            sourceType = SOURCE_TYPE_ENUM.local;
        } else if(oui.startWith(src,"data:image")){
            sourceType = SOURCE_TYPE_ENUM.base64;
        }else {//其余都是class名称
            sourceType = SOURCE_TYPE_ENUM.clsName;
        }
        return sourceType;
    };

    var getSrc = function () {
        return this.attr('src');
    };

    var setSrc = function(src){
        this.attr("src",src);
        this.attr("sourceType", getSourceType(src));
        this.render();
    };

    var renderBy = function (cfg, attrValue) {
        var _temp;
        if(arguments.length > 1){
            _temp = {};
            _temp[cfg] = attrValue;
            cfg = _temp;
        }
        if(cfg){
            for (var key in cfg) {
                this.attr(key, cfg[key]);
            }
            this.attr("sourceType", getSourceType(this.attr("src")));
            this.render();
        }
    };

    var show = function () {
        $(this.getEl()).show();
    };

    var hide = function () {
        $(this.getEl()).hide();
    };
    /*******************************控件类的自定义函数 end******************************************/
})(window);





