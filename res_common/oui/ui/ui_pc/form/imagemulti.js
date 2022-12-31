(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var ImageMulti = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        // this.attrs = this.attrs + ",data,isSingle,fileTypes,fileSizeLimit,boxStyle,fileNameMaxLength,fileInterceptor";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
		this.multiSelectClick = multiSelectClick;
        this.validate = validate;
        this.sortValue = sortValue;
        this.isEnumControl=true; //是枚举项控件,用途：1对于子控件的枚举项的渲染
        this.getData4DB = getData4DB;
        this.showImg = showImg;

    };
    ctrl["imagemulti"] = ImageMulti;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    ImageMulti.FullName = "oui.$.ctrl.imagemulti";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    ImageMulti.templateHtml = [];
    ImageMulti.templateHtml4readOnly = [];
    /**
     * 浏览态模板
     */
    ImageMulti.templateHtml4readOnly[0] = '{{each data as item index}}' +
		'{{if value&&value.split(",").indexOf(item.value+"")>=0}}'+
		'<div class="oui-class-imagemulti-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}}">'+
			'<a title="点击查看原图"onclick="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\');" href="javascript:void(0);" target="_blank">'+
				'<img src="{{oui.getImgUrl(item.url,0,75)}}" title="{{oui.getImgUrl(item.url)}}"/>'+
			'</a>'+
			'<label>'+
				'{{oui.escapeStringToHTML(item.display)}}'+
			'</label>'+
		'</div>'+
		'{{/if}}'+
	'{{/each}}';
    ImageMulti.templateHtml4readOnly[1] = ImageMulti.templateHtml4readOnly[0];
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(ImageMulti,'edit4ReadOnly,edit4View','0,1',ImageMulti.templateHtml4readOnly[0]);
    /** 图片单选 横向排列 */
    ImageMulti.templateHtml[0] = '{{if data.length==0}}'+
	'<div class="oui-class-imagemulti-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}}">' +
		'<div class="oui-image-default" disabled="disabled">请添加图片</div>'+
	'</div>' +
	'{{/if}}'+
	'{{each data as item index}}' +
		'<div ' +
		'{{if value&&value.split(",").indexOf(item.value+"")>=0}}'+
		'class="oui-class-imagemulti-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}} images-border-active" '+
		'{{else}}'+
		'class="oui-class-imagemulti-item{{(oui.getJsonAttr(otherAttrs,\'perSize\') || 0) > 0 ? (\'-\' + oui.getJsonAttr(otherAttrs,\'perSize\')):\'\'}}" '+
		'{{/if}}'+
		'item-idx="{{index}}">'+
			'<a title="点击查看原图" '+
				'{{if right&&(right=="design")}}disabled="disabled" '+
					'{{else}}'+
				' onclick="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\');" target="_blank"'+
				'{{/if}}'+
				'>'+
				'<img src="{{oui.getImgUrl(item.url,0,75)}}" title="{{oui.getImgUrl(item.url)}}"/>'+
			'</a>'+
			'<label title="{{oui.escapeStringToHTML(item.display)}}">'+
				'<div class="checkbox-wrapper">'+
					'<input type="checkbox" id="imagemulti_{{id}}_{{index}}" item-idx="{{index}}" name="{{name}}" '+
					'{{if right&&(right=="design")}}disabled="disabled" '+
					'{{else}}'+
					'onclick="oui.getByOuiId({{ouiId}}).multiSelectClick(this);" '+
					'{{/if}}'+
					'value="{{item.value}}"'+
					'{{if value&&value.split(",").indexOf(item.value+"")>=0}}checked="checked"{{/if}} '+
					' />'+
					'<i class="selected-icon"></i>'+
				'</div>'+
				'{{oui.escapeStringToHTML(item.display)}}'+
			'</label>'+
		'</div>'+
	'{{/each}}';
    /** 图片单选 纵向排列 */
    ImageMulti.templateHtml[1] = ImageMulti.templateHtml[0]; //横向/纵向模板相同

    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
		this.attr('isControlValidate',true);//图片多选 的验证属性需要输出到最外层的div上
        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("data", []);
            //oui.log("上传图片 需要配置data属性");
        }
        this.sortValue();
    };

    /*******************************控件类的自定义函数 end******************************************/

    var multiSelectClick = function (el) {
        var containerEl = this.getEl();
        if (!el) {
            return;
        }
        var value = this.attr('value');
        var arr = [];
        if (value) {
            arr = value.split(",")
        }
        var v = $(el).val();
        var idx = arr.indexOf(v);
        if (el.checked) {//选中状态
            if (idx < 0) {
				arr.push(v);
				this.attr("value", arr.join(',')); //将当前选中值追加到value中
			}
            arr = null;

        } else {//非选中状态
            if (idx >= 0) { //移除当前取消选中的value
                arr.splice(idx, 1);
            }
            this.attr("value", arr.join(","));
            arr = null;
        }
        this.sortValue();
        var otherAttrs = this.attr("otherAttrs");
        var perSizeCls = (oui.getJsonAttr(otherAttrs,'perSize') || 0) > 0 ? ('-' + oui.getJsonAttr(otherAttrs,'perSize')):'';
		$(el).parents('.oui-class-imagemulti-item'+perSizeCls).removeClass('images-border-active');
		if((this.attr('value').split(',')).indexOf(v)>=0){
			$(el).parents('.oui-class-imagemulti-item'+perSizeCls).addClass('images-border-active');
		}
        this.validate(); //执行校验
        this.triggerUpdate();
        this.triggerAfterUpdate();
    };
    var sortValue = function () {
        var v = this.attr('value');
        if (!v) {
            return;
        }
        var data = this.attr('data');
        if (!data) {
            return;
        }
        var arr = v.split(',');
        var cfg = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            cfg[arr[i]] = arr[i];
        }
        var sorts = [];
        var dataKey = '';
        for (var k = 0, alen = data.length; k < alen; k++) {
            dataKey = data[k].value + '';
            if (dataKey == cfg[dataKey]) {
                sorts.push(dataKey);
            }
        }
        var nv = sorts.join(',');
        this.attr('value', nv);
    };
	var validate = function(){
		var el = this.getEl();
		return oui.validate(el);
	};

    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var vals = this.getValue() || "";
        vals = vals.split(",");
        var data = this.attr("data");
        data = oui.parseJson(data || '[]');
        var items = [];
        var item = null;
        for (var j = 0; j < data.length; j++) {
            item = data[j];
            if (vals.indexOf(item.value + '') > -1) {
                items.push({
                    display: item.display,
                    value: item.value,
                    id: item.id
                });
            }
        }
        data4DB.items = items;
        return data4DB;
    };

    var showImg = function (imgURL) {
        oui.getTop().oui.showImgDialog({imgUrl: imgURL});
    };

})(window);





