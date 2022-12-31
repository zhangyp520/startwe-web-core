(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * buttonInfo, 按钮名称，默认值 选择图片
     * confirm, 截图完成后，确定事件 function(base64,boxData,o){},第一个参数返回base64，第二个参数截图宽高位置信息，第三个参数截图对象
     * cancel, 取消事件，关闭窗口
     * cropBoxResizable, 是否允许改变截图框大小，默认值false
     * boxWidth, 截图框默认宽
     * boxHeight,截图框默认高
     * showPreview,是否显示预览区域，默认值true
     * panelStyle 截图组件外框样式
     * 控件类构造器
     */
    var CutImg = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",buttonInfo,confirm,cancel,cropBoxResizable,boxWidth,boxHeight,showPreview,isHigh,panelStyle";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.afterRender = afterRender;
        this.showCutImg = showCutImg;//选择图片
        this.updateImg = updateImg;//选择文件
        this.loadImgFile = loadImgFile;//加载本地图片文件
        this.requireResources = requireResources; //按需加载资源
        this.clockwise = clockwise;//顺时针旋转
        this.antiClockwise = antiClockwise;//逆时针旋转
        this.level = level;//水平翻转
        this.vertical = vertical;//垂直翻转
        this.enlarge = enlarge;//放大
        this.narrow = narrow;//缩小
        this.edit = edit;//替换或者选择图片
        this.confirm = confirm;//确认
        this.cancel = cancel;//取消事件
        this.getImgBase64 = getImgBase64 ; // 获取图片base64的数据
    };
    ctrl["cutimg"] = CutImg;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    CutImg.FullName = "oui.$.ctrl.CutImg";//设置当前类全名 静态变量

    CutImg.templateHtml = [];
    CutImg.templateHtml[0]=

'<div class=\"cutimg-main\" style="z-index:{{oui.getTopMaxZIndex()+1}}">'+
    '<div class=\"cutimg-center\">'+
        '<input type=\"file\" style=\"display:none\" accept=\"image/*\" id=\"select-file-{{ouiId}}\" onchange=\"oui.getByOuiId({{ouiId}}).updateImg();\"  />'+
        '<div class=\"container cutimg-content {{showPreview?\'show-preview\':\'\'}}\" style=\"{{panelStyle}}\">'+
            '<div class=\"cutimg-content-area\">'+
                '<img src=\"\"/>'+
            '</div>'+
            '<div class=\"cutimg-content-preview\">'+
                '<div class=\"cutimg-preview-box\">'+
                    '<span class=\"preview-img-info\">预览图</span>'+
            '<span class=\"preview-img-area preview-img-area-{{ouiId}} img-area-large preview\">'+
            '</span>'+
''+
                '</div>'+
            '</div>'+
            '<div class=\"cutimg-content-toolbar\">'+
                '<span class=\"cutimg-toolbar-icon cutimg-clockwise\" onclick=\"oui.getByOuiId({{ouiId}}).clockwise();\" title=\"顺时针旋转\">顺时针旋转</span>'+
                '<span class=\"cutimg-toolbar-icon cutimg-anti-clockwise\" onclick=\"oui.getByOuiId({{ouiId}}).antiClockwise();\" title=\"逆时针旋转\">逆时针旋转</span>'+
                '<span class=\"cutimg-toolbar-icon cutimg-level\" onclick=\"oui.getByOuiId({{ouiId}}).level();\" title=\"水平翻转\">水平翻转</span>'+
                '<span class=\"cutimg-toolbar-icon cutimg-vertical\" onclick=\"oui.getByOuiId({{ouiId}}).vertical();\" title=\"垂直翻转\">垂直翻转</span>'+
                '<span class=\"cutimg-toolbar-icon cutimg-edit\" onclick=\"oui.getByOuiId({{ouiId}}).edit();\" title=\"更换\">更换</span>'+
            '</div>'+
            '<div class=\"cutimg-content-btns cutimg-clear\">'+
                '<button class=\"cutimg-btn-sub\" onclick=\"oui.getByOuiId({{ouiId}}).confirm();\">确定</button>'+
                '<button class=\"cutimg-btn-cancel\" onclick=\"oui.getByOuiId({{ouiId}}).cancel();\">取消</button>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>'+
'<button class=\"cutimg-btn-default\" onclick=\"oui.getByOuiId({{ouiId}}).showCutImg();\">{{buttonInfo}}</button>'+
'';
    //0,内嵌，1 弹框
    CutImg.templateHtml[1] = CutImg.templateHtml[0];
    /** 依賴資源**/
    CutImg.refs=[//指定依赖资源
        oui.getContextPath()+'res_common/third/cropper/cropper.min.css',
        oui.getContextPath()+'res_common/third/cropper/cropper.min.js'
        //,
        //oui.getContextPath()+'res_common/third/jcrop/css/jquery.Jcrop.min.css',
        //oui.getContextPath()+'res_common/third/jcrop/js/jquery.Jcrop.min.js',
        //oui.getContextPath()+'res_common/oui/ui/ui_pc/controls/cut-img/cut-img-biz.js'
    ];
    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
        this.attr('loaded',false);
        /** 是否允许 改变裁图框的大小,默认为true,设置为false后不能改变裁图框大小(固定大小)****/
        var cropBoxResizable = this.attr('cropBoxResizable');
        if(cropBoxResizable && (cropBoxResizable =='false')){
            cropBoxResizable = false;
        }else{
            cropBoxResizable = true;
        }
        this.attr('cropBoxResizable',cropBoxResizable);

        var showPreview = this.attr('showPreview');//是否显示预览，默认不显示
        if(showPreview&& showPreview =='false'){
            showPreview = false;
        }else{
            showPreview = true;
        }
        this.attr('showPreview',showPreview);

        /** 截图结果是否高精度获取图片，默认false，根据裁剪框等比例缩放；否则返回高精度截图图片***/
        var isHigh = this.attr('isHigh');
        if(isHigh&&isHigh =='true'){
            isHigh = true;
        }else{
            isHigh = false;
        }
        this.attr('isHigh',isHigh);

        var boxWidth = this.attr('boxWidth'),boxHeight = this.attr('boxHeight');
        if(boxWidth){
            boxWidth = parseInt(boxWidth);
            this.attr('boxWidth',boxWidth);
        }else{
            this.attr('boxWidth',200);//默认200
        }
        if(boxHeight){
            boxHeight = parseInt(boxHeight);
            this.attr('boxHeight',boxHeight);
        }else{
            this.attr('boxHeight',200);//默认200
        }
        var buttonInfo = this.attr('buttonInfo');
        if(!buttonInfo){
            //指定默认按钮显示
            buttonInfo ='选择图片';
            this.attr('buttonInfo',buttonInfo);
        }
    };

    /** 加载所需资源**/
    var requireResources = function(callback){
        var showType = this.attr('showType');
        showType = parseInt(showType||"0");
        var resourceKey = 'oui.$.ctrl.cutimg.hasLoadThirdResource';
        var me = this;
        if(showType ==0){
            /** 内嵌模式 ，在当前页面加载依赖资源**/
            if(oui.getPageParam(resourceKey)){
                me.attr('loaded',true);
                callback&&callback();
                return ;
            }else{
                oui.setPageParam(resourceKey,true);
                oui.require4notSort(CutImg.refs,function(){
                    me.attr('loaded',true);
                    callback&&callback();
                });
            }
        }else if(showType==1){
            /** 顶层页面弹窗模式，在顶层页面加载依赖资源****/
            if(oui.getTop().oui.getPageParam(resourceKey)){
                me.attr('loaded',true);
                callback&&callback();
                return ;
            }else{
                oui.getTop().oui.setPageParam(resourceKey,true);
                oui.getTop().oui.require4notSort(CutImg.refs,function(){
                    me.attr('loaded',true);
                    callback&&callback();
                });
            }
        }
    };
    /** 渲染后置脚本***/
    var afterRender = function(){
    };
    /** 选择图片，选择完成后，显示图片***/
    var showCutImg = function(){
        var showType = this.attr('showType');
        if((showType+'') =='1' && (oui.getTop() != window)){
            var topId = this.attr('topId');
            if(!topId){
                topId = oui.getUUIDLong();
                this.attr('topId',topId);
            }
            var topObj = oui.getTop().oui.getById(topId);
            if(topObj){
                topObj.showCutImg();
            }else{
                var outerHtml = this.getSourceHtml();
                var $outer = oui.getTop().$(outerHtml);
                $outer.attr('id',topId);
                var confirmFun = this.attr('confirm');
                if(confirmFun && (typeof confirmFun =='string')){
                    confirmFun = eval(confirmFun);
                }
                oui.getTop().oui.setPageParam('tempfun_confirm_'+topId,function(base64,boxData,o){
                    confirmFun && confirmFun(base64,boxData,o);
                });

                var cancelFun = this.attr('cancel');
                if(cancelFun && (typeof cancelFun =='string')){
                    cancelFun = eval(cancelFun);
                }
                oui.getTop().oui.setPageParam('tempfun_cancel_'+topId,function(o){
                    cancelFun&&cancelFun(o);
                });
                $outer.attr('confirm','oui.getTop().oui.getPageParam("tempfun_confirm_'+topId+'")');
                $outer.attr('cancel','oui.getTop().oui.getPageParam("tempfun_cancel_'+topId+'")');
                $outer.attr('class','cutimg-hide oui-class-cutimg');
                $outer.attr('id',topId);
                oui.getTop().$(oui.getTop().document.body).append($outer);
                oui.getTop().oui.parse();
                topObj = oui.getTop().oui.getById(topId);
                topObj&&topObj.showCutImg();
            }
        }else{
            var el = this.getEl();
            $(el).find('input[type=file]').click();
        }
    };
    /** 加载本地图片文件***/
    var loadImgFile = function(){
        var me = this;
        var el = this.getEl();
        var inputFile = $(el).find('input[type=file]')[0];
        var files = inputFile.files;
        if((!files) ||(!files.length)){
            return ;
        }
        $(el).find('.cutimg-main').addClass('show-cutimg-main');
        var file = files[0];
        me.attr('fileType',file.type);
        this.attr('file',file);

        try{
            //创建读取文件的对象
            var reader = new FileReader();
            //创建文件读取相关的变量
            var imgFile;



            //为文件读取成功设置事件
            reader.onload=function(e) {
                imgFile = e.target.result;
                me.attr('src',imgFile);
                var showType = me.attr('showType');
                var $cutimgArea = $('.cutimg-content-area',el);
                if((!$cutimgArea)||(!$cutimgArea.length)){
                    $(el).find('.cutimg-main').prepend('<div class="cutimg-content-area"><img /></div>');
                }
                $('.cutimg-content-area',el).find('img').attr('src', imgFile);
                //$(me.getEl()).find('.preview-img-area').find('img').attr('src',imgFile);

                var image =$('.cutimg-content-area',el).find('img')[0];
                var cropper = me.attr('cropper');
                if(cropper){
                    cropper.destroy();
                    cropper = null;
                }
                var boxWidth = me.attr('boxWidth');
                var boxHeight = me.attr('boxHeight');
                var cropBoxResizable = me.attr('cropBoxResizable');
                cropper = new Cropper(image, {
                    aspectRatio:boxWidth/boxHeight,
                    cropBoxResizable:cropBoxResizable,
                    preview:'.preview-img-area-'+me.attr('ouiId'), //预览样式
                    dragMode:'move',//图片可拖拽，移动位置
                    ready:function(){
                        var cropper = this.cropper;
                        cropper.setCropBoxData({width:boxWidth,height:boxHeight});
                    },
                    crop: function (e) {
                        var data = e.detail;
                        var cropper = this.cropper;
                        var imageData = cropper.getImageData();
                        var previewAspectRatio = data.width / data.height;
                    }
                });
                me.attr('cropper',cropper);

            };
            //正式读取文件
            reader.readAsDataURL(file);
        }catch(e){
            oui.getTop().oui.alert('你的浏览器不支持 FileReader 对象');
        }
    };
    /*** 渲染文件选择的图片****/
    var updateImg = function(){
        var me = this;
        this.requireResources(function(){
            me.loadImgFile();
        });
    };
    /** 顺时针旋转***/
    var clockwise = function(){
        var cropper = this.attr('cropper');
        if(cropper){
            cropper.rotate(90);
        }
    };
    /** 逆时针旋转****/
    var antiClockwise = function(){
        var cropper = this.attr('cropper');
        if(cropper){
            cropper.rotate(-90);
        }
    };

    /** 水平翻转**/
    var level = function(){

        var cropper = this.attr('cropper');

        if(cropper){
            var imageData = cropper.getImageData();
            if(imageData){
                if(typeof imageData.scaleX =='undefined'){
                    imageData.scaleX= 1;
                }
                if(typeof  imageData.scaleY =='undefined'){
                    imageData.scaleY = 1;
                }
                cropper.scale(-imageData.scaleX,imageData.scaleY);
            }
        }
    };
    /** 垂直翻转****/
    var vertical = function(){
        var cropper = this.attr('cropper');
        if(cropper){

            var imageData = cropper.getImageData();
            if(imageData){
                if(typeof imageData.scaleX =='undefined'){
                    imageData.scaleX= 1;
                }
                if(typeof  imageData.scaleY =='undefined'){
                    imageData.scaleY = 1;
                }
                cropper.scale(imageData.scaleX,-imageData.scaleY);
            }
        }
    };

    /** 放大***/
    var enlarge = function(){

    };
    /** 缩小***/
    var narrow = function(){

    };
    /** 替换或者选择图片***/
    var edit = function(){
        var el = this.getEl();
        this.showCutImg();
    };
    /** 确认***/
    var confirm = function(){
        var el = this.getEl();
        var cropper = this.attr('cropper');
        var me = this;
        var base64='';
        if(cropper && this.attr('src')){
            base64 = me.getImgBase64();
            me.attr('value',base64);
        }
        $(el).find('.cutimg-main').removeClass('show-cutimg-main');
        var confirmFun = this.attr('confirm');
        if(confirmFun && (typeof confirmFun =='string')){
            confirmFun = eval(confirmFun);
        }
        var cropper = this.attr('cropper');
        var boxData = {width:me.attr('boxWidth'),height:me.attr('boxWidth')};
        if(cropper){
            boxData = cropper.getCropBoxData();
        }
        confirmFun && confirmFun(base64,boxData,this);
        $(el).find('input[type=file]').val('');
    };
    /** 根据宽度高度获取 图片 的base64
     *
     * @isHigh 是否获取高精度图片,默认等比例压缩
     *
     * 数据**/
    var getImgBase64 = function(isHighParam){

        var cropper = this.attr('cropper');
        if(!cropper){
            return '';
        }
        var base64='';
        var canvasData;
        var fileType = this.attr('fileType');
        var isHigh = this.attr('isHigh');
        isHigh = isHigh || isHighParam;
        if(isHigh){
            /** 获取高精度图片***/
            canvasData = cropper.getCroppedCanvas({
                fillColor:fileType.toLowerCase().indexOf('png')>=0?'transparent':'#ffffff'
            }); //获取实际截图

        }else{
            var boxData = cropper.getCropBoxData();
            /** 根据 裁剪框等比例缩放 图片****/
            canvasData = cropper.getCroppedCanvas({
                width:boxData.width,
                height:boxData.height,
                fillColor:fileType.toLowerCase().indexOf('png')>=0?'transparent':'#ffffff'
            }); //获取实际截图
        }
        base64= canvasData&&canvasData.toDataURL(fileType);
        return base64;
    };
    /** 取消****/
    var cancel = function(){
        var el = this.getEl();
        $(el).find('.cutimg-main').removeClass('show-cutimg-main');
        var cancelFun = this.attr('cancel');
        if(cancelFun && (typeof cancelFun =='string')){
            cancelFun = eval(cancelFun);
        }
        cancelFun&&cancelFun(this);
        $(el).find('input[type=file]').val('');
    };
})(window);





