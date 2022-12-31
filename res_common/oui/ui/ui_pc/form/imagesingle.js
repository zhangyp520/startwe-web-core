(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var ImageSingle = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        // this.attrs = this.attrs + ",data,isSingle,fileTypes,fileSizeLimit,boxStyle,fileNameMaxLength,fileInterceptor";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
		this.radioClick = radioClick;
		this.validate = validate;
		this.isEnumControl=true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
		this.getData4DB = getData4DB;
        this.showImg = showImg;

    };
    ctrl["imagesingle"] = ImageSingle;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    ImageSingle.FullName = "oui.$.ctrl.imagesingle";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    ImageSingle.templateHtml = [];
    ImageSingle.templateHtml4readOnly = [];
    /**
     * 浏览态模板
     */
    ImageSingle.templateHtml4readOnly[0] = '{{each data as item index}}' +
		'{{if value&&((item.value+"")==(value+"")) }}'+
		'<div class="oui-class-imagesingle-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}}">'+
			'<a title="点击查看原图" onclick="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\');" href="javascript:void(0);" target="_blank">'+
				'<img src="{{oui.getImgUrl(item.url,0,75)}}" title="{{oui.getImgUrl(item.url)}}"/>'+
			'</a>'+
			'<label>'+
				'{{oui.escapeStringToHTML(item.display)}}'+
			'</label>'+
		'</div>'+
		'{{/if}}'+
	'{{/each}}';
    ImageSingle.templateHtml4readOnly[1] = ImageSingle.templateHtml4readOnly[0];
	/** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
	Control.buildTemplate(ImageSingle,'edit4ReadOnly,edit4View','0,1',ImageSingle.templateHtml4readOnly[0]);
    /** 图片单选 横向排列 */
    ImageSingle.templateHtml[0] ='{{if data.length==0}}'+
	    '<div class="oui-class-imagesingle-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}}">' +
	    	'<div class="oui-image-default" disabled="disabled">请添加图片</div>'+
		'</div>' +
	    '{{/if}}'+
    	'{{each data as item index}}' +
		'<div ' +
		'{{if value&&((item.value+"")==(value+""))}}'+
		'class="oui-class-imagesingle-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}} images-border-active" '+
		'{{else}}'+
		'class="oui-class-imagesingle-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}}" '+
		'{{/if}}'+
		'item-idx="{{index}}">'+
			'<a  title="点击查看原图"'+
				'{{if right&&(right=="design")}}disabled="disabled" '+
					'{{else}}'+
				' onclick="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\');" target="_blank"'+
				'{{/if}}'+
				'>'+
				'<img src="{{oui.getImgUrl(item.url,0,75)}}" title="{{oui.getImgUrl(item.url)}}"/>'+
			'</a>'+
			'<label title="{{oui.escapeStringToHTML(item.display)}}">'+
				'<div class="radio-button-wrapper">'+
					'<input type="radio" id="imagesingle_{{id}}_{{index}}" item-idx="{{index}}" name="{{name}}" '+
					'{{if right&&(right=="design")}}disabled="disabled" '+
					'{{else}}'+
					'onclick="oui.getByOuiId({{ouiId}}).radioClick(this);" '+
					'{{/if}}'+
					'value="{{item.value}}"'+
					'{{if value&&((item.value+"")==(value+""))}}checked="checked"{{/if}}  {{=commonEvent}} />'+
					'<i class="selected-icon"></i>'+
				'</div>'+
				'{{oui.escapeStringToHTML(item.display)}}'+
			'</label>'+
		'</div>'+
	'{{/each}}';
    /** 图片单选 纵向排列 */
    ImageSingle.templateHtml[1] = ImageSingle.templateHtml[0]; //横向/纵向模板相同

    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
		this.attr('isControlValidate',true);//图片单选 的验证属性需要输出到最外层的div上
        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("data", []);
            //oui.log("上传图片 需要配置data属性");
        }
        var data = this.attr("data");
        if(data && data.length > 0){
            var value = this.attr("value");
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].value + "" === value + "") {
                    this.attr("value", value);
                	break;
                }
                this.attr("value", "");
			}
        }else {
        	this.attr("value","");
		}

    };

    /*******************************控件类的自定义函数 end******************************************/
    var radioClick = function(el){
		var otherAttrs = this.attr("otherAttrs");
		var perSizeCls = (oui.getJsonAttr(otherAttrs,'perSize') || 0) > 0 ? ('-' + oui.getJsonAttr(otherAttrs,'perSize')):'';
		this.attr("value",$(el).val());
		var $containerEl =$(this.getEl());
		$containerEl.find('.oui-class-imagesingle-item'+perSizeCls).removeClass('images-border-active');
		var itemIdx = $(el).attr('item-idx');
		$containerEl.find('.oui-class-imagesingle-item'+perSizeCls+'[item-idx='+itemIdx+']').addClass('images-border-active');

		this.validate();
		this.triggerUpdate();
		this.triggerAfterUpdate();
	};
	var validate = function(){
		var el = this.getEl();
		return oui.validate(el);
	};

	var getData4DB = function(){
		var data4DB = Control.getProtoType().getData4DB.call(this);
		var vals = this.getValue() || "";
		if(vals){
			var data = this.attr("data");
			data = oui.parseJson(data || '[]');
            var item = null;
			for (var j = 0; j < data.length; j++) {
                item = data[j];
				if ((vals + '') == (item.value + '')) {
                    data4DB.display = item.display;
                    data4DB.value = item.value;
                    data4DB.id = item.id;
                    break;
				}
			}
		}
		return data4DB;
	};


    var showImg = function (imgURL) {
        oui.getTop().oui.showImgDialog({imgUrl: imgURL});
    };

})(window);





