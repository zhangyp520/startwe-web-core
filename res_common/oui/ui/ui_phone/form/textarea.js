(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var Textarea = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ',placeholder,rows,isAppend';
        this.init = init;
        this.click = click;

        this.afterRender = afterRender;
        this.showMore4ReadOnly = showMore4ReadOnly;
        this.hideMore4ReadOnly = hideMore4ReadOnly;
        this.showOrHideMore4ReadOnly = showOrHideMore4ReadOnly;
    };

    Textarea.FullName = "oui.$.ctrl.textarea";//设置当前类全名
    ctrl["textarea"] = Textarea;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Textarea.templateHtml = [];
    Textarea.templateHtml[0] = '<textarea name="{{name}}" onfocus="oui.hideErrorInfo(this);" rows="{{rows}}" ' +
        '{{=(isReadOnly)?"readonly=\'readonly\' ":""}}'+
        'onTap="oui.getByOuiId({{ouiId}}).click();" ' +
        ' validate="{{validate}}" id="{{id}}" style="{{fieldStyle}}" placeholder="{{placeholder}}" class="oui-form" {{=commonEvent}} >{{=value}}</textarea>';

    Textarea.templateHtml4readOnly=[];
    Textarea.templateHtml4readOnly[0] ='\
		<div class="form-collapse-item">\
			<div class="form-collapse-area collapse-hidden">\
			{{=oui.escapeStringToHTML(value||"")}}\
			</div>\
			<div class="collapse-more display_none">\
				<i class="collapse-btn-info" onTap="oui.getByOuiId({{ouiId}}).showOrHideMore4ReadOnly();"></i>\
			</div>\
		</div>\
		';
    Control.buildTemplate(Textarea,'edit4ReadOnly,edit4View','0',Textarea.templateHtml4readOnly[0]);
    /***********************************控件事件***********************************/

    var init = function(){
        var isReadOnly = this.attr('isReadOnly');
        if(typeof isReadOnly == 'string'){
            if(isReadOnly =='true'){
                isReadOnly = true;
            }else if(isReadOnly =='false'){
                isReadOnly = false;
            }else{
                isReadOnly = false;
            }
        }
        var otherAttrs = this.attr('otherAttrs') ||'{}';
        otherAttrs = oui.parseJson(otherAttrs);
        var isAppend = otherAttrs.isAppend ||this.attr('isAppend');
        if(typeof isAppend !='boolean'){
            if(isAppend =='true'){
                isAppend = true;
            }else{
                isAppend = false;
            }
        }
        if(isAppend){
            isReadOnly = true;
            this.attr('isAppend',true);
        }else{
            this.attr('isAppend',false);
        }
        this.attr('isReadOnly',isReadOnly);
    };

    var showMore4ReadOnly = function(){
        var el = this.getEl();
        $(el).find('.form-collapse-area').removeClass('collapse-hidden');
        $(el).find('.collapse-btn-info').attr('title','收起');
    };
    var hideMore4ReadOnly = function(){
        var el = this.getEl();
        $(el).find('.form-collapse-area').addClass('collapse-hidden');
        $(el).find('.collapse-btn-info').attr('title','展开');

    };
    /*** 显示或者隐藏 折叠按钮 ***/
    var showOrHideMore4ReadOnly = function(){
        var el = this.getEl();
        if($(el).find('.form-collapse-area').hasClass('collapse-hidden')){
            this.showMore4ReadOnly();
        }else{
            this.hideMore4ReadOnly();
        }
    };
    /** 渲染后置脚本，用于浏览态内容较多渲染处理****/
    var afterRender = function(){
        var right = this.attr('right');
        var rights = 'readOnly,edit4ReadOnly,edit4View'.split(',');
        if(rights.indexOf(right)<0){
            return ;
        }
        var el = this.getEl();
        $(el).find('.form-collapse-area').addClass('collapse-hidden');
        var scrollHeight = el.scrollHeight ||0;
        if(scrollHeight>155){
            $(el).find('.collapse-more').removeClass('display_none');
        }else{
            $(el).find('.collapse-more').addClass('display_none');
        }

    };
    var click = function(){
        var isAppend = this.attr('isAppend');
        var onclick = this.attr('onclick');
        if(typeof onclick =='string'){
            try{
                onclick = eval(onclick);
            }catch(e){}
        }
        onclick&&onclick(this);
        if(isAppend){
            //追加模式编辑
            var title = this.attr('title');
            var value = this.attr('value');
            var me = this;
            oui.getTop().oui.showInputDialog( title||'追加文本', function(result){
                if(result){
                    if(value){
                        value = value+'\n' ;
                    }
                    var userName = oui_context.userName||'';
                    if(userName =='null'){
                        userName = '';
                    }
                    var time = oui.getCurrTime();
                    var userMsg = userName +' '+time+'\n'+result;
                    value += userMsg;
                    me.attr('value',value);
                    me.render();
                    me.triggerUpdate();
                    me.triggerAfterUpdate();
                }
            }, [ {
                type:"textarea",
                value:''
            } ]);
        }
    };
})(window);





