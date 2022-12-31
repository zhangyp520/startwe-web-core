(function(win){
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    var constant =oui.$.constant;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 手写签章 控件 ，有多种具体实现方式，如第三方免费签章，第三方收费签章 等，此处按照插件适配器机制实现控件
     *  参考插件api集成：res_common/oui/ui/ui_common/adapter/signature/jSignature.js
     *  在自定义插件api中 维护 与第三方插件的api集成，实现签章功能
     *
     * 控件类构造器
     */
    var Signature = function(cfg) {
        Control.call(this,cfg);//必须继承控件超类
        this.attrs = this.attrs+",title,useBase64,renderType,width,height,color,lineHeight,confirm,cancel";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.getOptionByRenderType = getOptionByRenderType;//根据渲染引擎获取对应引擎需要的参数配置
        this.setOptionByRenderType = setOptionByRenderType; //根据渲染引擎 设置对应需要的参数配置
        this.initByRenderType = initByRenderType;//根据渲染引擎 初始化对应引擎需要的参数
        this.showSignature = showSignature;
        this.clearSignature = clearSignature;
    };
    ctrl["signature"] = Signature;

    Signature.FullName = "oui.$.ctrl.signature";//设置当前类全名 静态变量
    Signature.templateHtml=[];

    Signature.templateHtml[0] = '' +
        '<input id="{{id}}" name="{{name}}" type="hidden" value="{{value}}"/>' +
        '<div class="signature-inner">' +
        '<img src="{{oui.getImgUrl(data.url,0,75)}}" title="{{oui.getImgUrl4Title(data.url)}}" />' +
        '<i class="signature-delete-icon" {{clickName}}="oui.getByOuiId({{ouiId}}).clearSignature()" ></i>' +
        '</div>' +
        '<button class="button" {{clickName}}="oui.getByOuiId({{ouiId}}).showSignature()" ><i class="signature-button-icon"></i> 手写签名</button>';

    Signature.templateHtml4readOnly = [];
    /**
     * 浏览态模板
     */
    Signature.templateHtml4readOnly[0] = '{{if value&&data.url}}<img src="{{oui.getImgUrl(data.url,0,75)}}" title="{{oui.getImgUrl4Title(data.url)}}" />{{/if}}';
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(Signature,'edit4ReadOnly,edit4View','0',Signature.templateHtml4readOnly[0]);

    /** 显示手写签章面板 在按需加载插件后，在弹出层中实现手写签章画布*****/
    var showSignature = function(){
        var renderType = this.attr('renderType');
        var me = this;
        oui.requireRenderEngine("signature",renderType,function(){
            me.initByRenderType();
            var options= me.getOptionByRenderType();
            var confirm = me.attr('confirm');
            if(confirm&& (typeof confirm =='string')){
                confirm = oui.JsonPathUtil.getJsonByPath(confirm,window);
            }
            var cancel = me.attr('cancel');
            if(cancel&&(typeof cancel =='string')){
                cancel = oui.JsonPathUtil.getJsonByPath(cancel,window);
            }
            var reset = me.attr('reset');

            if(reset && (typeof reset =='string')){
                reset = oui.JsonPathUtil.getJsonByPath(reset,window);
            }
            options = $.extend(true,{
                title:"手写签名",
                renderType:renderType,
                confirm:function(imgData){
                    var useBase64 = me.attr('useBase64');
                    var data = 'data:'+imgData.join(',');
                    $(me.getEl()).find('img').attr('src',data);
                    $(me.getEl()).find('.signature-inner').addClass('signature-inner-result');
                    oui.uploadBase64(data,function(result){
                        /*
                         imgId:sdata.msg.id,
                         downloadUrl:downloadUrl,
                         previewUrl:previewUrl,
                         success:result.success,
                         size:file.size || 0,
                         name:file.name,
                         clientFile:file
                         */
                        var value = result.imgId;
                        me.attr('value',value);
                        var data = me.attr('data');
                        data.url = result.previewUrl;
                        $(me.getEl()).find('#'+me.attr('id')).val(value);
                        confirm&&confirm(data,me);
                        me.triggerUpdate();
                        me.triggerAfterUpdate();
                    });
                },
                cancel:function(){
                    cancel&&cancel(me);
                },
                reset:function(){
                    //me.attr('value','');
                    //var data = me.attr('data');
                    //data.url = '';
                    //$(me.getEl()).find('#'+me.attr('id')).val('');
                    //$(me.getEl()).find('.signature-inner').removeClass('signature-inner-result');
                    reset&&reset(me);
                    //me.triggerUpdate();
                    //me.triggerAfterUpdate();
                }
            },options);
            oui.showSignature(options);
        },true);
    };
    var clearSignature = function(){
        var  me = this;
        me.attr('value','');
        var data = me.attr('data');
        data.url = '';
        $(me.getEl()).find('.signature-inner').find('img').removeAttr('src');
        $(me.getEl()).find('#'+me.attr('id')).val('');
        $(me.getEl()).find('.signature-inner').removeClass('signature-inner-result');
        me.triggerUpdate();
        me.triggerAfterUpdate();
    };

    /** 根据渲染引擎获取 对应引擎需要的参数****/
    var getOptionByRenderType = function(){
        var renderType = this.attr('renderType');
        return this.attr('option4'+renderType);
    };
    /** 根据渲染引擎 设置 对应的引擎需要的参数配置****/
    var setOptionByRenderType = function(option){
        var renderType = this.attr('renderType');
        this.attr('option4'+renderType,option);
    };

    /** 根据渲染引擎初始化**/
    var initByRenderType = function(){
        var renderType = this.attr('renderType');
        var renderEngine = oui.getRenderEngine('signature',renderType);
        renderEngine&&renderEngine.init(this);
    };

    /** 配置初始化****/
    var init=function(renderBeforeEl){
        var me = this;
        if(!this.attr('renderType')){
            this.attr('renderType','jSignature');//默认值处理
        }
        var useBase64 = this.attr('useBase64');
        if(typeof useBase64 !='boolean'){
            if(useBase64=='false'){
                useBase64 = false;
            }else{
                useBase64 = true;
            }
            this.attr('useBase64',useBase64);
        }

        var data = this.attr('data');
        data = oui.parseJson(data);
        this.attr('data',data);
    };
    /** 判断是否加载对应渲染引擎的资源***/

})(window);





