(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var Score = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs+",maxScore";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
		this.setScore =setScore; 
    };
    ctrl["score"] = Score;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    Score.FullName = "oui.$.ctrl.score";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Score.templateHtml = [];
    Score.templateHtml[0] = '<div class="oui-score" id="oui_score_{{id}}" >' +
			'<input id="{{id}}" name="{{name}}" {{=commonEvent}} validate="{{validate}}"  type="hidden" value="{{value}}" />'+
            '<ul>'+
				'{{each _starsArr as item index}}'+
				'<li {{if value> index}} class="oui-score-active" {{/if}} '+
				'{{if right&&(right=="design")}}disabled="disabled" '+
				'{{else}}'+
				'onclick="oui.getByOuiId({{ouiId}}).setScore({{index+1}});" '+
				'{{/if}}'+ 
				' ></li>'+
                '{{/each}}'+
            '<ul>'+
    '</div>'; 
	Score.templateHtml4readOnly = [];
    Score.templateHtml4readOnly[0] = '{{value?(value+"分"):"未评分"}}';
	Control.buildTemplate(Score,'edit4ReadOnly,edit4View','0',Score.templateHtml4readOnly[0]);
    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
	   /*
	   var showType=parseInt(this.attr('showType'));
	   if(showType>=3){ //初始化前需要根据showType进行 逻辑处理多少颗星星
			this.attr('maxScore',showType);
			this.attr('showType',0); //将showType设置为指定渲染模板
	   }else{
			var maxV= this.attr('maxScore') || '5';
			this.attr('maxScore',parseInt(maxV));
	   }
	    var _starsArr = [];
	   _starsArr.length = this.attr('maxScore');
	   */
	    var _starsArr = [];
	    _starsArr.length = 5;
	    this.attr('_starsArr',_starsArr);
	   
	    var v = this.attr('value');
	    if(v){
			this.attr('value',parseInt(v));
	    }else{
			this.attr('value', ''); //默认值为0
	    }
       
    };
	/**
	 * 设置分数
	 */
	var setScore = function(v){
		this.attr('value',v);
		this.render();
		var $container = $(this.getEl());
		/** 执行分数点击后校验 */
		oui.validate($container.find('#'+this.attr('id'))[0]);
		this.triggerUpdate();
		this.triggerAfterUpdate();
	};
    /*******************************控件类的自定义函数 end******************************************/
})(window);





