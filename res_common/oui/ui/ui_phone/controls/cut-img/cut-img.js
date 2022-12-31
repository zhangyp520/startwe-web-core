/**
 * 切图组件
 */
(function () {
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
        this.attrs = this.attrs + ",buttonInfo,confirm,cancel,cropBoxResizable,boxWidth,boxHeight,showPreview,isHigh,panelStyle,imgSource";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.afterRender = afterRender;
        this.updateImg = updateImg;
        this.loadImgFile = loadImgFile;
        this.confirm = confirm;
        this.cancel = cancel;
        this.getImgBase64 = getImgBase64;
        this.clockwise = clockwise;//顺时针旋转
        this.antiClockwise = antiClockwise;//逆时针旋转
        this.level = level;//水平翻转
        this.vertical = vertical;//垂直翻转
        this.cut = cut;
    };
    ctrl["cutimg"] = CutImg;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    CutImg.FullName = "oui.$.ctrl.CutImg";//设置当前类全名 静态变量

    CutImg.templateHtml = [];
    CutImg.templateHtml[0] =
        '<div class="upload-multi-edit-cnt">' +
        '   <div class="upload-multi-edit-box">' +
        '       <div class="upload-multi-edit-area">' +
        '           <div class="upload-cutImg-area">' +
        '               <img id="cut-img-{{ouiId}}" {{if imgSource}}src="{{imgSource}}"{{/if}}/>' +
        '           </div>' +
        '           <div class="layout-box upload-cutImg-toolbar">' +
        '               <div class="layout-box-item upload-cutImg-toolbar-btn" onTap="oui.getByOuiId({{ouiId}}).cut();">' +
        '                   <i class="cutimg-toolbar-icon cutimg-cut">裁剪</i>' +
        '               </div>' +
        '               <div class="layout-box-item upload-cutImg-toolbar-btn" onTap="oui.getByOuiId({{ouiId}}).clockwise();">' +
        '                   <i class="cutimg-toolbar-icon cutimg-clockwise">顺时针</i>' +
        '               </div>' +
        '               <div class="layout-box-item upload-cutImg-toolbar-btn" onTap="oui.getByOuiId({{ouiId}}).antiClockwise();">' +
        '                   <i class="cutimg-toolbar-icon cutimg-anti-clockwise">逆时针</i>' +
        '               </div>' +
        '               <div class="layout-box-item upload-cutImg-toolbar-btn" onTap="oui.getByOuiId({{ouiId}}).level();">' +
        '                   <i class="cutimg-toolbar-icon cutimg-level">水平</i>' +
        '               </div>' +
        '               <div class="layout-box-item upload-cutImg-toolbar-btn" onTap="oui.getByOuiId({{ouiId}}).vertical();">' +
        '                   <i class="cutimg-toolbar-icon cutimg-vertical">垂直</i>' +
        '               </div>' +
        // '               <div class="layout-box-item upload-cutImg-toolbar-btn"><i class="cutimg-toolbar-icon cutimg-edit">更换图片</i></div>' +
        '           </div>' +
        '           <div class="upload-multi-edit-footer layout-box">' +
        '               <div class="layout-box-item">' +
        '                   <button class="upload-multi-cancel" onTap="oui.getByOuiId({{ouiId}}).cancel();">取消</button>' +
        '               </div>' +
        '               <div class="layout-box-item">' +
        '                   <button class="upload-multi-sub" onTap="oui.getByOuiId({{ouiId}}).confirm();">确定</button>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';
    //0,内嵌，1 弹框
    CutImg.templateHtml[1] = CutImg.templateHtml[0];
    /** 依賴資源**/
    CutImg.refs = [//指定依赖资源
        oui.getContextPath() + 'res_common/third/cropper/cropper.min.css',
        oui.getContextPath() + 'res_common/third/cropper/cropper.min.js'
    ];
    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
        this.attr('loaded', false);
        /** 是否允许 改变裁图框的大小,默认为true,设置为false后不能改变裁图框大小(固定大小)****/
        var cropBoxResizable = this.attr('cropBoxResizable');
        cropBoxResizable = !(cropBoxResizable && (cropBoxResizable === 'false'));
        this.attr('cropBoxResizable', cropBoxResizable);

        var showPreview = this.attr('showPreview');//是否显示预览，默认不显示
        showPreview = !(showPreview && showPreview === 'false');
        this.attr('showPreview', showPreview);

        /** 截图结果是否高精度获取图片，默认false，根据裁剪框等比例缩放；否则返回高精度截图图片***/
        var isHigh = this.attr('isHigh');

        isHigh = isHigh && isHigh === 'true';

        this.attr('isHigh', isHigh);

        var boxWidth = this.attr('boxWidth'), boxHeight = this.attr('boxHeight');
        if (boxWidth) {
            boxWidth = parseInt(boxWidth);
            this.attr('boxWidth', boxWidth);
        } else {
            this.attr('boxWidth', 200);//默认200
        }
        if (boxHeight) {
            boxHeight = parseInt(boxHeight);
            this.attr('boxHeight', boxHeight);
        } else {
            this.attr('boxHeight', 200);//默认200
        }
        var buttonInfo = this.attr('buttonInfo');
        if (!buttonInfo) {
            //指定默认按钮显示
            buttonInfo = '选择图片';
            this.attr('buttonInfo', buttonInfo);
        }
    };

    var afterRender = function () {
        var self = this;
        var imgSource = self.attr("imgSource");
        //如果是base64图片直接加载
        if (imgSource && imgSource.length > 0 && oui.startWith(imgSource, "data:image")) {
            self.updateImg();
        }
    };

    /**
     * 加载图片
     */
    var updateImg = function () {
        var self = this;
        /**
         * 加载第三方js
         */
        oui.require4notSort(CutImg.refs, function () {
            self.loadImgFile();
        });
    };

    /** 顺时针旋转***/
    var clockwise = function () {
        var cropper = this.attr('cropper');
        if (cropper) {
            cropper.rotate(90);
        }
    };
    /** 逆时针旋转****/
    var antiClockwise = function () {
        var cropper = this.attr('cropper');
        if (cropper) {
            cropper.rotate(-90);
        }
    };

    /** 水平翻转**/
    var level = function () {
        var cropper = this.attr('cropper');
        if (cropper) {
            var imageData = cropper.getImageData();
            if (imageData) {
                //切图为正方形后，在此打开 没有scaleX 和 scaleY 故加上默认值
                if (typeof imageData.scaleX === 'undefined' || typeof imageData.scaleY === 'undefined') {
                    imageData.scaleX = 1;
                    imageData.scaleY = 1;
                }
                cropper.scale(-imageData.scaleX, imageData.scaleY);
            }
        }
    };
    /** 垂直翻转****/
    var vertical = function () {
        var cropper = this.attr('cropper');
        if (cropper) {
            var imageData = cropper.getImageData();
            if (imageData) {
                //切图为正方形后，在此打开 没有scaleX 和 scaleY 故加上默认值
                if (typeof imageData.scaleX === 'undefined' || typeof imageData.scaleY === 'undefined') {
                    imageData.scaleX = 1;
                    imageData.scaleY = 1;
                }
                cropper.scale(imageData.scaleX, -imageData.scaleY);
            }
        }
    };

    /**
     * 设置图片裁剪
     */
    var cut = function () {
        var cropper = this.attr('cropper');
        var self = this;
        if (cropper) {
            if (self.cropModel) {
                self.cropModel = false;
                cropper.clear();
            }else {
                self.cropModel = true;
                cropper.crop();
            }
        }
    };

    var loadImgFile = function () {
        var self = this;
        var el = self.getEl();
        var $el = $(el);
        var ouiId = self.attr("ouiId");
        var imgSource = self.attr("imgSource");
        //如果是base64图片直接加载
        if (imgSource && imgSource.length > 0 && oui.startWith(imgSource, "data:image")) {
            var mineType = imgSource.split(";");
            if(mineType[0]){
                mineType = mineType[0].split(":");
                if (mineType.length >= 1 && mineType[1]) {
                    self.attr("fileType", mineType[1]);
                }
            }
            var $img = $el.find("#cut-img-" + ouiId);
            var cropper = self.attr('cropper');
            if (cropper) {
                cropper.destroy();
            }
            var boxWidth = self.attr('boxWidth');
            var boxHeight = self.attr('boxHeight');
            var cropBoxResizable = self.attr('cropBoxResizable');
            cropper = new Cropper($img[0], {
                aspectRatio: boxWidth / boxHeight,
                autoCrop:false,
                cropBoxResizable: cropBoxResizable,
                //preview: '.preview-img-area-' + self.attr('ouiId'), //预览样式
                //autoCropArea: 0.5,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
                dragCrop: false,//是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域,防止移动端触摸的时候不小心 新开一个剪裁框
                dragMode: 'move',//图片可拖拽，移动位置
                ready: function () {
                    var cropper = this.cropper;
                    cropper.setCropBoxData({width: boxWidth, height: boxHeight});
                },
                // crop: function (e) {
                //     // var data = e.detail;
                //     // var cropper = this.cropper;
                //     // var imageData = cropper.getImageData();
                //     // var previewAspectRatio = data.width / data.height;
                // }
            });
            self.attr('cropper', cropper);

        } else {
            //TODO 从input 里面取
        }
    };

    var confirm = function () {
        var cropper = this.attr('cropper');
        var self = this;
        var base64 = '';
        if (cropper) {
            base64 = self.getImgBase64();
            self.attr('value', base64);
        }
        var confirmFun = this.attr('confirm');
        if (confirmFun && (typeof confirmFun === 'string')) {
            confirmFun = eval(confirmFun);
        }

        var boxData = {width: self.attr('boxWidth'), height: self.attr('boxWidth')};
        if (cropper) {
            boxData = cropper.getCropBoxData();
        }
        confirmFun && confirmFun(base64, boxData, self);
    };

    var cancel = function () {
        var cancelFun = this.attr('cancel');
        if (cancelFun && (typeof cancelFun === 'string')) {
            cancelFun = eval(cancelFun);
        }
        cancelFun && cancelFun(this);
    };


    /** 根据宽度高度获取 图片 的base64
     *
     * @isHigh 是否获取高精度图片,默认等比例压缩
     *
     * 数据**/
    var getImgBase64 = function (isHighParam) {
        var cropper = this.attr('cropper');
        if (!cropper) {
            return '';
        }
        var canvasData;
        var fileType = this.attr('fileType');
        if(!fileType){
            fileType = "image/jpeg";
        }
        var isHigh = this.attr('isHigh');
        isHigh = isHigh || isHighParam;
        if (isHigh) {
            /** 获取高精度图片***/
            canvasData = cropper.getCroppedCanvas({
                fillColor: (fileType && fileType.toLowerCase().indexOf('png') >= 0) ? 'transparent' : '#ffffff'
            }); //获取实际截图

        } else {
            var boxData = cropper.getCropBoxData();
            /** 根据 裁剪框等比例缩放 图片****/
            canvasData = cropper.getCroppedCanvas({
                width: boxData.width,
                height: boxData.height,
                fillColor: (fileType && fileType.toLowerCase().indexOf('png') >= 0) ? 'transparent' : '#ffffff'
            }); //获取实际截图
        }
        // return canvasData && canvasData.toDataURL(fileType);
        return canvasData && canvasData.toDataURL(fileType);
    };


})();





