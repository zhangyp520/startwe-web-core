/**
 * @author oui
 * @date 2015/12/26 0026
 */
(function () {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/
    /**
     * 控件类构造器
     */
    var UploadFile = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",data,isSingle,fileTypes,fileSizeLimit,boxStyle,fileUploadLimit,fileNameMaxLength,fileInterceptor,camera,useBase64";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        //this.afterRender = afterRender;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
        //this.showFileDialog = showFileDialog;

        this.deleteFile = deleteFile;

        this.selectFile = selectFile;
        this.getData4DB = getData4DB;
        this.getFileURL = getFileURL;
        this.showImg = showImg;
        this.downloadFile = downloadFile;
    };
    ctrl["uploadfile"] = UploadFile;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    UploadFile.FullName = "oui.$.ctrl.uploadfile";//设置当前类全名 静态变量

    /**
     * 定义 控件浏览态的模板
     * @type {Array}
     */
    UploadFile.templateHtml4readOnly = [];
    UploadFile.templateHtml4readOnly[0] =
        '{{if value && data.length > 0}}' +
        '{{each data as item index}}' +
        '<p onclick="oui.getByOuiId({{ouiId}}).downloadFile({{index}})">' +
        '<span class="uploadfile-info uploadfile-success" >{{item.display}}</span>' +
        '</p>' +
        '{{/each}}' +
        '{{/if}}';

    UploadFile.templateHtml4readOnly[1] =
        '{{if value && data.length > 0}}' +
        '<div class="oui-class-uploadimg uploadimg-p-padding">' +
        '{{each data as item index}}' +
        '<p onTap="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\',\'{{item.display}}\')">' +
        '<span class="upload-img-src">' +
        '<img id="oui_img_{{ouiId}}_{{index}}" src="{{oui.getImgUrl(item.url,320,320)}}" />' +
        '</span>' +
        '<span class="upload-img-name">{{item.display}}</span>' +
        '</p>' +
        '{{/each}}' +
        '</div>' +
        '{{/if}}';
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(UploadFile, 'edit4ReadOnly,edit4View', '0', UploadFile.templateHtml4readOnly[0]);
    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(UploadFile, 'edit4ReadOnly,edit4View', '1', UploadFile.templateHtml4readOnly[1]);

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    UploadFile.templateHtml = [];
    /** 附件上传 **/
    UploadFile.templateHtml[0] =
        '<input type="hidden" id="{{id}}" validate="{{validate}}" name="{{name}}" value="{{value}}" />' +
        '{{if value}}' +
        '{{each data as item index}}' +
        '<p>' +
        '<span class="uploadfile-info uploadfile-success" >{{item.display}}</span>' +
        '<span class="uploadfile-delete" onclick="oui.getByOuiId({{ouiId}}).deleteFile(this,{{ouiId}},{{index}})"></span>' +
        '</p>' +
        '{{/each}}' +
        '{{/if}}' +
        '{{if (!(isSingle && value && data.length == 1)) && fileUploadLimit > data.length}}' +
        '<p id="addUploadFileBtn_{{ouiId}}" onTap="oui.getByOuiId({{ouiId}}).selectFile();">' +
        // '{{if !(right&&(right=="design" || right=="preview"))}}' +
        // '<input type="file" onchange="oui.getByOuiId({{ouiId}}).selectFile(this,{{ouiId}})" accept="*" />' +
        // '{{/if}}' +
        '<span class="uploadfile-info">请选择小于{{fileSizeLimit}}的文件上传</span>' +
        '<span class="uploadfile-add"></span>' +
        '</p>' +
        '{{/if}}';
    /** 图片上传**/
    UploadFile.templateHtml[1] =
        '<input type="hidden" id="{{id}}" validate="{{validate}}" name="{{name}}" value="{{value}}" />' +
        '<div class="oui-class-uploadimg">' +
        '{{if value}}' +
        '{{each data as item index}}' +
        '<p onTap="oui.getByOuiId({{ouiId}}).showImg(\'{{oui.getImgUrl(item.url)}}\',\'{{item.display}}\')">' +
        '<img id="oui_img_{{ouiId}}_{{index}}" src="{{oui.getByOuiId(ouiId).getFileURL(oui.getImgUrl(item.url),ouiId)}}" />' +
        '<i class="uploadimg-del-btn" ontap="oui.getByOuiId({{ouiId}}).deleteFile(this,{{ouiId}},{{index}})"></i>' +
        '</p>' +
        '{{/each}}' +
        '{{/if}}' +
        '{{if (!(isSingle && value && data.length == 1)) && fileUploadLimit > data.length}}' +
        '<p id="addUploadFileBtn_{{ouiId}}" >' +
        '<span onTap="oui.getByOuiId({{ouiId}}).selectFile();">请上传图片</span>' +
        // '{{if !(right&&(right=="design" || right=="preview"))}}' +
        // '{{if camera}}' +
        // '<input type="file" onchange="oui.getByOuiId({{ouiId}}).selectFile(this,{{ouiId}})" ' +
        // ' capture="camera"' +
        // ' accept="image/*" />' +
        // '{{else}}' +
        // '<input type="file" onchange="oui.getByOuiId({{ouiId}}).selectFile(this,{{ouiId}})" ' +
        // ' accept="image/*" />' +
        // '{{/if}}' +
        // '{{/if}}' +
        '</p>' +
        '</div>' +
        '{{/if}}';
    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/
    var defualtFileSizeLimit = oui.uploadConfig.defaultFileSizeLimit;
    var defaultLimit = oui.uploadConfig.defaultFileUploadLimit;

    var getFileURL = function (url, ouiId) {
        if (url && (url.indexOf('data:') > -1)) {
            return url;
        }
        var _obj = oui.getByOuiId(ouiId);
        var tImg = $(_obj.getEl()).find("#addUploadFileBtn_" + ouiId);
        url = oui.setParam(url, "width", tImg.width() || '');
        url = oui.setParam(url, "height", tImg.height() || '');
        return url;
    };

    var init = function () {
        var d = this.attr("data");
        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("data", []);
        }
        var useBase64 = this.attr('useBase64') + '';
        if (useBase64 && useBase64 === 'false') {
            this.attr('useBase64', false);
        } else {
            this.attr('useBase64', true);
        }

        var isSingle = this.attr('isSingle') + '';
        isSingle = isSingle !== 'false';
        this.attr('isSingle', isSingle);

        var showType = this.attr("showType") + '';
        var upLimit = defaultLimit;
        var validate = oui.parseJson(this.attr("validate") || '{}');
        var otherAttrs = oui.parseJson(this.attr("otherAttrs") || '{}');

        //是否只允许拍照上传
        var cameraAttr = (this.attr('camera') + '') || 'false';
        cameraAttr = cameraAttr === 'true';
        var camera = (otherAttrs.camera + '') || 'false';
        camera = camera === 'true';
        cameraAttr = camera || cameraAttr;
        this.attr('camera', cameraAttr);

        if (showType === '0') {
            upLimit = validate.fileUploadLimit || otherAttrs.fileUploadLimit || defaultLimit;
            validate.fileUploadLimit = upLimit;
        } else if (showType === '1') {
            upLimit = validate.imageUploadLimit || otherAttrs.imageUploadLimit || defaultLimit;
            validate.imageUploadLimit = upLimit;
        }

        if (upLimit > 1) {
            this.attr("isSingle", false);
        } else {
            this.attr("isSingle", true);
        }

        this.attr('validate', oui.parseString(validate));
        this.attr('fileUploadLimit', upLimit);
        var fileSizeLimit = this.attr("fileSizeLimit") || defualtFileSizeLimit;
        this.attr("fileSizeLimit", fileSizeLimit);
        var fileNameMaxLength = this.attr("fileNameMaxLength") || oui.uploadConfig.defaultFileNameMaxLength;
        this.attr("fileNameMaxLength", fileNameMaxLength);
    };


    /**
     * 选择文件并上传
     * @returns {boolean}
     */
    var selectFile = function () {
        var self = this;
        var right = self.attr("right") + '';
        if (right && (right === "design" || right === "preview")) {//如果是设计图或者预览态 则不能选择文件
            return false;
        }
        var showType = self.attr("showType") + '';//上传类型
        var isSingle = self.attr("isSingle");//是否单个上传
        var fileUploadLimit = self.attr("fileUploadLimit") || defaultLimit;//上传限制
        var _data = self.attr('data') || [];
        if (!isSingle) {
            if (_data.length >= fileUploadLimit) {
                if (showType === '0') {
                    oui.toast("附件不能超过" + fileUploadLimit + "个!");
                } else if (showType === '1') {
                    oui.toast("图片不能超过" + fileUploadLimit + "个!");
                } else {
                    oui.toast("文件不能超过" + fileUploadLimit + "个!");
                }
                return false;
            }
        }
        var postParam = {};
        //附件上传拦截器
        var fileInterceptor = self.attr("fileInterceptor");
        if (fileInterceptor) {
            postParam['fileInterceptor'] = fileInterceptor;
        }
        var fileSizeLimit = self.attr("fileSizeLimit") || defualtFileSizeLimit;
        var fileNameMaxLength = self.attr("fileNameMaxLength") || oui.uploadConfig.defaultFileNameMaxLength;
        var camera = this.attr('camera');
        if(showType === '0'){
            camera =false;
        }
        oui.upload4html({
            showType: showType,
            postParam: postParam,
            useBase64: false,
            fileSizeLimit: fileSizeLimit,
            fileUploadLimit: fileUploadLimit - _data.length,
            fileNameMaxLength: fileNameMaxLength,
            cutImg: true,
            camera: camera + '' === 'true',
            success: function (files) {
                if (files && files.length > 0) {
                    var file = null;
                    var data = self.attr('data');
                    var sv = self.attr('value');
                    var valArray = sv ? sv.split(',') : [];
                    var fileUrl = null;
                    for (var i = 0, len = files.length; i < len; i++) {
                        file = files[i];
                        if (file.success) {
                            fileUrl = file.previewUrl;
                            if (showType === '0') {//上传文件
                                fileUrl = file.downloadUrl;
                            }
                            data.push({
                                display: file.name,
                                value: file.imgId,
                                size: file.size || 0,
                                url: fileUrl
                            });
                            valArray.push(file.imgId);
                        }
                    }
                    var valStr = valArray.join(",");
                    self.attr("value", valStr);
                    self.render();
                    oui.validate($(self.getEl()).find('#' + self.attr('id'))[0]);
                    self.triggerUpdate();
                    self.triggerAfterUpdate();
                }
            },
            error: function () {

            }
        });
        return false;
    };

    /**
     * 删除文件
     */
    var deleteFile = function (obj, ouiId, indexs) {
        var self = this;
        var imgs = this.attr('data');
        if (!imgs) {
            return;
        }
        imgs.splice(indexs, 1);

        if (!imgs) {
            imgs = [];
            this.attr('data', imgs);
        }
        var vals = [];
        for (var i = 0, len = imgs.length; i < len; i++) {
            vals.push(imgs[i].value);
        }
        var s_vals = vals.join(',');

        self.attr('value', s_vals);

        self.render();
        self.triggerUpdate();
        self.triggerAfterUpdate();
        return false;
    };
    /*******************************控件类的自定义函数 end******************************************/


    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var d = this.attr('data');
        var v = this.attr('value') || '';
        var arr = [];
        var currText, currV;
        v = v.split(',');
        var dataObj = {};
        for (var i = 0, len = d.length; i < len; i++) {
            currText = d[i].display;
            currV = d[i].value;
            if ((currText) && (v.indexOf(currV) > -1)) {
                dataObj = {
                    display: currText,
                    id: d[i].value,
                    size: d[i].size
                };
                arr.push(dataObj);
            }
        }
        data4DB.items = arr;
        return data4DB;
    };

    var downloadFile = function(index){
        var data = this.attr("data");
        var item = data[index];
        if(item){
            oui.downloadFile(item.url,null,{size:item.size || 0,name:item.display});
        }
        return false;
    };

    var showImg = function (imgURL) {
        imgURL = oui.setParam(imgURL, "scale", 1);
        if (!oui.os.mobile && this.attr("right") === "preview") {
            oui.getTop().open(imgURL);
        } else {
            var data = this.attr("data");
            var urls = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var d = data[i];
                var dUrl = oui.getImgUrl(d.url);
                //FIXME 默认处理移动使用原比例压缩一次，解决图片旋转问题
                if(dUrl.indexOf("data:")  < 0){//非 base64
                    dUrl = oui.setParam(dUrl, "scale", 1);
                }
                urls.push(dUrl);
            }
            oui.previewImageDialog({
                current: imgURL,
                items: urls
            });
        }
    };

})();





