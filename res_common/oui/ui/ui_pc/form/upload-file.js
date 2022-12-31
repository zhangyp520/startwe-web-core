(function (win) {
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
        this.attrs = this.attrs + ",data,isSingle,fileTypes,fileSizeLimit,boxStyle,fileNameMaxLength,fileInterceptor,camera,useBase64,useCutImg,cropBoxResizable,boxWidth,boxHeight,showPreview,panelStyle";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.afterRender = afterRender;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/
        this.showFileDialog = showFileDialog;
        this.deleteFile = deleteFile;
        this.updateValue = updateValue;//更新value
        this.getData4DB = getData4DB;
        this.getUploadDisplay = getUploadDisplay;
        this.showImg = showImg;
        this.downloadFile = downloadFile;
    };
    ctrl["uploadfile"] = UploadFile;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    UploadFile.FullName = "oui.$.ctrl.uploadfile";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    UploadFile.templateHtml = [];
    UploadFile.templateHtml4readOnly = [];
    try{
        /* 默认上传文件数限制******/
        var defaultFileUploadLimit = oui.uploadConfig.defaultFileUploadLimit;
        /***默认文件名最大长度限制 **/
        var defaultFileNameMaxLength= oui.uploadConfig.defaultFileNameMaxLength;

    }catch(e){
        /* 默认上传文件数限制******/
        var defaultFileUploadLimit = "500 MB";
        /***默认文件名最大长度限制 **/
        var defaultFileNameMaxLength= 200;
    }

    /**
     * 浏览态模板
     */
    UploadFile.templateHtml4readOnly[0] = '<div class="oui-uploadfile" {{=events||""}} style="{{boxStyle}}">' +
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '{{if value}}' +
        '{{each data as item index}}' +
        '<div class="oui-upload-item">' +
        '<a onclick="oui.getByOuiId({{ouiId}}).downloadFile({{index}});">{{item.display}}</a>' +
        '<span></span>' +
        '</div>' +
        '{{/each}}' +
        '{{/if}}' +
        '</div>';
    UploadFile.templateHtml4readOnly[1] = '<div class="oui-upload-img" {{=events||""}} style="{{boxStyle}}">' +
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '{{if value}}' +
        '{{each data as item index}}' +
        '<div class="oui-upload-img-item">' +
        '<a onclick="oui.getByOuiId({{ouiId}}).showImg({{index}});">' +
        '<img src="{{oui.getImgUrl(item.url,0,75)}}" title="{{oui.getImgUrl(item.url)}}" /> ' +
        '</a>' +
        '<span>{{item.display}}<i class="download-img" title="下载" onclick="oui.getByOuiId({{ouiId}}).downloadFile({{index}});"></i></span>' +

        '</div>' +
        '{{/each}}' +
        '{{/if}}' +
        '</div>';
    Control.buildTemplate(UploadFile,'edit4ReadOnly,edit4View','0',UploadFile.templateHtml4readOnly[0]);//对应0模板
    Control.buildTemplate(UploadFile,'edit4ReadOnly,edit4View','1',UploadFile.templateHtml4readOnly[1]);//对应1模板

    /** 附件上传 */
    UploadFile.templateHtml[0] = '<div class="oui-uploadfile" {{=events||""}} style="{{boxStyle}}">' +
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '{{if value}}' +
        '{{each data as item index}}' +
        '<div class="oui-upload-item">' +
        '<a onclick="oui.getByOuiId({{ouiId}}).downloadFile({{index}});">{{item.display}}</a>' +
        '<span></span>' +
        /**添加上传成功的时间**/
        '<i onclick="oui.getByOuiId({{ouiId}}).deleteFile({{index}})"></i>' +
        '</div>' +
        '{{/each}}' +
        '{{/if}}' +
        '<div class="oui-upload-item">' +
        '<div class="oui-upload-item-button" ' +
        '{{if right&&(right=="design" || right=="preview" ||(camera))}}disabled="disabled" ' +
        '{{else}}' +
        'onclick="oui.getByOuiId({{ouiId}}).showFileDialog({{ouiId}});" ' +
        '{{/if}}' +
        '>{{=oui.getByOuiId(ouiId).getUploadDisplay()}}</div>' +
        '</div>' +
        '</div>';
    /** 图片上传**/
    UploadFile.templateHtml[1] = '<div class="oui-upload-img" {{=events||""}} style="{{boxStyle}}">' +
        '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '{{if value}}' +
        '{{each data as item index}}' +
        '<div class="oui-upload-img-item">' +
        '<a  onclick="oui.getByOuiId({{ouiId}}).showImg({{index}});" >' +
        '<img src="{{oui.getImgUrl(item.url,0,75)}}" title="{{oui.getImgUrl4Title(item.url)}}"/> ' +
        '</a>' +
        '<span>{{item.display}} <i class="download-img" title="下载" onclick="oui.getByOuiId({{ouiId}}).downloadFile({{index}});"></i></span>' +
        '<i onclick="oui.getByOuiId({{ouiId}}).deleteFile({{index}})"></i>' +
        '</div>' +
        '{{/each}}' +
        '{{/if}}' +
        '<div class="oui-upload-img-item">' +
        '<div class="oui-upload-img-button" ' +
        '{{if right&&(right=="design" || right=="preview" || (camera))}}disabled="disabled" ' +
        '{{else}}' +
        'onclick="oui.getByOuiId({{ouiId}}).showFileDialog({{ouiId}});"' +
        '{{/if}}' +
        '>{{=oui.getByOuiId(ouiId).getUploadDisplay()}}</div>' +
        '</div>' +
        '</div>';
    /*******************************实实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) end****************/
    /*******************************控件类的自定义函数 start******************************************/

    var init = function () {
        var d = this.attr("data");

        if (d) {
            this.attr("data", oui.parseJson(d));
        } else {
            this.attr("data", []);
            //oui.log("上传图片 需要配置data属性");
        }
        /** 上传后 是否使用base64预览图片，默认值true****/
        var useBase64 = this.attr('useBase64');
        if(useBase64 && useBase64=='false'){
            this.attr('useBase64',false);
        }else{
            this.attr('useBase64',true);
        }
        /** 是否使用截图组件 截图上传，默认为false***/
        var useCutImg = this.attr('useCutImg');
        if(useCutImg && useCutImg =='true'){
            this.attr('useCutImg',true);
        }else{
            this.attr('useCutImg',false);
        }
        var isSingle = this.attr('isSingle');

        /**从其他属性中将限制 追加的验证组件中 **/
        var otherAttrs = this.attr('otherAttrs');
        var cameraAttr = this.attr('camera') || false;
        if(typeof cameraAttr =='string'){
            if(cameraAttr =='true'){
                cameraAttr = true;
            }else{
                cameraAttr = false;
            }
        }
        if(otherAttrs){
            var validate = oui.parseJson(this.attr('validate') ||"{}");
            var json = oui.parseJson(otherAttrs);
            var camera = json.camera||"";
            if(camera){
                if(typeof camera =='string'){
                    if(camera  =='true'){
                        camera = true;
                    }else{
                        camera = false;
                    }
                }
            }else{
                camera = false;
            }
            cameraAttr = camera || cameraAttr;
            var fileUploadLimit = validate.fileUploadLimit || json.fileUploadLimit;
            var imageUploadLimit = validate.imageUploadLimit || json.imageUploadLimit;
            validate.fileUploadLimit = fileUploadLimit;
            validate.imageUploadLimit = imageUploadLimit;
            this.attr('validate',oui.parseString(validate));
            if(typeof json.isSingle =='string'){
                if(typeof isSingle =='string'){
                    isSingle  = isSingle || json.isSingle;
                }
            }
            if(typeof json.isSingle =='boolean'){
                if((typeof isSingle =='string') && (!isSingle)){
                    isSingle = json.isSingle;
                }
            }
        }
        this.attr('camera',cameraAttr);
        if(typeof isSingle=='string'){
            if(isSingle=='true'){
                isSingle = true;
            }else {
                isSingle = false;
            }
        }
        if(fileUploadLimit){
            if(parseInt(fileUploadLimit+"")>1){
                isSingle = false;
            }else{
                isSingle = true;
            }
        }
        if(imageUploadLimit){
            if(parseInt(imageUploadLimit+"")>1){
                isSingle = false;
            }else{
                isSingle = true;
            }
        }
        this.attr('isSingle', isSingle);

    };
    var uploadTextCfg = {
        '0-0': '请上传附件',
        '0-1': '替换附件',
        '1-0': '请上传图片',
        '1-1': '替换图片',
        msg4camera:'仅移动端拍照上传'
    };
    var downloadFile = function(idx){
        var data = this.attr('data')||'[]';
        data = oui.parseJson(data);
        if(data[idx]){
            var url = data[idx].url;
            if(url.indexOf('data:')>-1){
                oui.downloadFile4base64(url,data[idx].display );
            }else{
                var showType = this.attr("showType");
                if(showType+"" === "1"){//图片
                    url = data[idx].downloadUrl;
                }
                oui.downloadFile(url);
            }
        }
    };
    var showImg = function(idx){
        var data = this.attr('data');
        data = oui.parseJson(data);
        if(data&&data[idx]){
            var url = data[idx].url;
            url = oui.getImgUrl(url);
            //FIXME 默认处理移动使用原比例压缩一次，解决图片旋转问题
            if(url.indexOf("data:")  < 0){//非 base64
                url = oui.setParam(url, "scale", 1);
            }
            oui.getTop().oui.showImgDialog({imgUrl: url});
        }
    };
    /**
     * 获取当前控件对象按钮的显示文本
     */
    var getUploadDisplay = function () {
        if(this.attr('camera')){
            return uploadTextCfg.msg4camera;
        }
        if (this.attr('isSingle') && this.attr('data').length > 0) {
            return uploadTextCfg[this.attr('showType') + '-1'];
        }
        return uploadTextCfg[this.attr('showType') + '-0'];
    };
    /**
     * 显示弹出窗,上传文件
     * isSingle,fileTypes,fileSizeLimit
     */
    var showFileDialog = function (ouiId) {

        if(this.attr('camera')){
            console.log('pc 不支持拍照');
            return ;
        }
        if ((!this.attr('fileTypes')) && (('' + this.attr('showType')) == '1')) {
            this.attr('fileTypes', '*.jpg;*.png;*.gif;*.jpeg;*.bmp');
        }
        var fds = this.attr('data');
        var validate = oui.parseJson(this.attr('validate') || '{}');
        //fileUploadLimit_error_msg:'{{title}}附件不能超过{{validateValue}}个',
        //imageUploadLimit_error_msg:'{{title}}图片不能超过{{validateValue}}个'

        var upLimit = ((this.attr('showType') + '') == '0') ? (validate.fileUploadLimit || defaultFileUploadLimit) : (validate.imageUploadLimit || defaultFileUploadLimit);
        var uploadLimit = upLimit - fds.length;
        if (uploadLimit <= 0 && (!this.attr('isSingle'))) { //多文件上传时的限制

            if (('' + this.attr('showType')) == '1') {
                oui.getTop().oui.alert('图片不能超过' + upLimit + '个');
            } else {
                oui.getTop().oui.alert('附件不能超过' + upLimit + '个');

            }
            return;
        }
        var isImg =  ( (this.attr('showType') + '') == '1')?true:false;

        var uploadOptions = {
            useBase64:this.attr('useBase64'),
            useCutImg:this.attr('useCutImg'),
            fileNameMaxLength: this.attr('fileNameMaxLength')|| defaultFileNameMaxLength,
            isSingle: (this.attr('isSingle') == 'false' || this.attr('isSingle') === false) ? false : true,
            fileTypes: this.attr('fileTypes') || "*.*", //'*.jpg;*.png;*.gif;*.jpeg;*.bmp',
            fileSizeLimit: this.attr('fileSizeLimit')||oui.uploadConfig.defaultFileSizeLimit, //默认不设置最大限制
            fileUploadMaxLimit:upLimit,
            fileUploadLimit: uploadLimit, //默认7个限制
            completeSuccess: function (data, swfObj) {

                if (!data) {
                    return;
                }
                if (data.length == 0) {
                    return;
                }
                var upObj = oui.getByOuiId(ouiId);
                var imgs = upObj.attr('data');
                if (!imgs) {
                    imgs = [];
                    upObj.attr('data', imgs);
                }
                if (upObj.attr('isSingle')) { //如果是单文件上传 则只支持一张图片
                    imgs.length = 0;
                    upObj.attr('value', '');
                }
                var sortValue = imgs.length;
                var sv = upObj.attr('value');
                var vals = sv ? sv.split(',') : [];

                for (var i = 0, len = data.length; i < len; i++) {
                    //data[i].imgId,
                    imgs.push({
                        display: data[i].name,
                        value: data[i].imgId,
                        size:data[i].size,
                        sortValue: (++sortValue),
                        url:(isImg?data[i].previewUrl:data[i].downloadUrl)
                    });
                    vals.push(data[i].imgId);
                }
                upObj.attr('value', vals.join(','));

                upObj.render();

                oui.validate($(upObj.getEl()).find('#' + upObj.attr('id'))[0]);
                upObj.triggerUpdate();
                upObj.triggerAfterUpdate();
                /*
                 *
                 DesignBiz.attr(imgName,data[0].name);
                 DesignBiz.attr(imgId,data[0].imgId);
                 // 上传完成后的后置脚本,渲染对应位置
                 if(after && DesignBiz[after]){
                 DesignBiz[after](cfg);
                 }
                 */
            }
        };
        //附件上传拦截器
        var fileInterceptor = this.attr("fileInterceptor");
        if (fileInterceptor) {
            uploadOptions['fileInterceptor'] = fileInterceptor;
        }

        /** 判断是否是图片 上传并且 使用截图组件***/
        if(uploadOptions.useCutImg && isImg && uploadOptions.isSingle){
            /** 截图组件需要的属性****/
            var cropBoxResizable = this.attr('cropBoxResizable');
            var boxWidth = this.attr('boxWidth');
            var boxHeight = this.attr('boxHeight');
            var showPreview = this.attr('showPreview');
            var panelStyle = this.attr('panelStyle');
            var useBase64 = this.attr('useBase64');
            oui.showCutImg({
                /****
                 * 截图完成后进行上传
                 * @param base64
                 * @param box
                 * @param o
                 */
                confirm:function(base64,box,o){
                    var sourceFile = o&&o.attr('file');//原始图片的图片流

                    var file = oui.getBlob(base64);
                    file.name = sourceFile.name;
                    oui.upload4ajax({
                        file: file,
                        fileSizeLimit: uploadOptions.fileSizeLimit,
                        fileNameMaxLength: uploadOptions.fileNameMaxLength,
                        data: {
                            //isEncoder: uploadOptions.isEncoder,
                            //bucket: uploadOptions.bucket
                        },
                        success: function(result){
                            var sdata = oui.parseJson(result);
                            if(sdata.success){
                                sdata.msg = oui.parseJson(sdata.msg);
                            }
                            var previewUrl = sdata.msg.previewUrl;
                            var downloadUrl =sdata.msg.downloadUrl;
                            if(useBase64){ //如果使用base64时需要传入该参数
                                previewUrl = base64 ;
                                downloadUrl = base64;
                            }
                            uploadOptions.completeSuccess([{
                                imgId:sdata.msg.id,
                                downloadUrl:downloadUrl,
                                previewUrl:previewUrl,
                                success:result.success,
                                size:file.size || 0,
                                name:file.name,
                                clientFile:file
                            }]);
                        },
                        error: null,
                        progress: null
                    });
                }, //截图完成后，确定事件 function(base64,boxData,o){},第一个参数返回base64，第二个参数截图宽高位置信息，第三个参数截图对象
                cancel:function(o){

                }, //取消事件，关闭窗口
                cropBoxResizable:cropBoxResizable, //是否允许改变截图框大小，默认值false
                boxWidth:boxWidth,// 截图框默认宽
                boxHeight:boxHeight,//截图框默认高
                showPreview:showPreview,//是否显示预览区域，默认值true
                panelStyle:panelStyle //截图组件外框样式
            });
        }else{
            oui.getTop().oui.upload4html(uploadOptions);
        }
    };
    /**
     * 删除文件
     */
    var deleteFile = function (idx) {
        var imgs = this.attr('data');
        if (!imgs) {
            return;
        }
        imgs.splice(idx, 1);
        this.updateValue();
        this.render();
        oui.validate($(this.getEl()).find('#' + this.attr('id'))[0]);
        this.triggerUpdate();
        this.triggerAfterUpdate();
    };
    /**
     * 更新控件对象value
     */
    var updateValue = function () {
        var imgs = this.attr('data');
        if (!imgs) {
            imgs = [];
            this.attr('data', imgs);
        }
        var vals = [];
        for (var i = 0, len = imgs.length; i < len; i++) {
            vals.push(imgs[i].value);
        }
        this.attr('value', vals.join(','));
    };
    var afterRender = function () {
        var el = this.getEl();
    };
    template.helper('oui', oui);
    /*******************************控件类的自定义函数 end******************************************/

    var getData4DB = function(){
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
                dataObj={
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

})(window);





