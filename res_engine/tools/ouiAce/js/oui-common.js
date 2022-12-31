//退出页面时的确认提示
oui.confirmClose = function (e) {
    e = e || window.event;
    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = '确定退出吗1？';
    }
    // For Safari chrome
    return '确定退出吗2?';
};
oui.heartTime = 22 * 60 * 1000; //默认22分钟心跳
/** 判断某个对象是否是空对象****/
oui.isEmptyObject = function(obj){
    if(!obj){
        return true;
    }
    var name;
    for ( name in obj ) {
        return false;
    }
    return true;
};
/**
 * 检测客户端心跳
 */
var checkingTimer = null;
oui.checkHeart = function () {
    var url = oui_context.contextPath + 'common.do?method=time';
    if ((!location.port) || (!location.hostname)) {
        return;
    }
    oui.getData(url, {_t: new Date().getTime()}, function () {
        if (checkingTimer) {
            window.clearTimeout(checkingTimer);
            checkingTimer = null;
        }
        checkingTimer = window.setTimeout(oui.checkHeart, oui.heartTime);
    }, false);

};

oui.isObject = function(obj){
    return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] === 'Object';
};

oui.addOuiParams4Url = function (url) {
    if(window['oui_context']){
        if(oui_context['oui_params']){
            url = oui.setParam(url, "oui_params", oui_context['oui_params']);
        }
        var ouiCoreParams = oui_context['oui_core_params'];
        if (ouiCoreParams && oui.isObject(ouiCoreParams)) {//存在coreParams
            for(var paramKey in ouiCoreParams){
                if(ouiCoreParams.hasOwnProperty(paramKey)){
                    var paramValue = ouiCoreParams[paramKey];
                    url = oui.setParam(url, paramKey, paramValue);
                }
            }
        }
    }
    return url;
};

/**
 * 页面跳转不记录历史记录
 * @param url
 * @param params
 */
oui.go4replace = function (url, params) {
    if (!url) {
        return;
    }
    url = oui.addOuiParams4Url(url);
    var param = $.extend({}, params || {});
    param = $.param(param);
    if (param.length > 0) {
        if (url.indexOf('?') > 0) {
            url = url + '&' + param;
        } else {
            url = url + '?' + param;
        }
    }
    if(window.location.replace){
        window.location.replace(url);
    }else {
        window.location.href = url;
    }
};

/**
 * 页面调整
 * @param url
 * @param data 是否传入数据参数
 * @param isReplace 是否使用 replace
 * @param hasTime 是否跟时间戳
 */
oui.go = function (url, data, isReplace, hasTime) {
    if (!url) {
        return;
    }
    url = oui.addOuiParams4Url(url);
    if (!hasTime) {
        url = oui.setParam(url, "_t", new Date().getTime());
    }
    var param = $.extend({}, data || {});
    param = $.param(param);
    if (param.length > 0) {
        if (url.indexOf('?') > 0) {
            url = url + '&' + param;
        } else {
            url = url + '?' + param;
        }
    }
    if(isReplace){
        setTimeout(function(){
            if(window.location.replace){
                window.location.replace(url);
            } else {
                window.location.href = url;
            }
        },10);
    } else {
        setTimeout(function(){
            window.location.href = url;
        },10);
    }
};


// 框架常量
oui.constant = {
    BACK_URL_KEY: "oui_back_url" //返回函数所用的地址key
};
/**
 * 页面返回
 */
oui.back = function (win,url) {
    win = win || window;
    if(url){
        win.location.replace(url);
        return ;
    }
    var oui_back_url = oui.getParam(oui.constant.BACK_URL_KEY);
    if(oui_back_url && oui_back_url.length > 0){
        oui_back_url = decodeURIComponent(oui_back_url);
        window.location.href = oui_back_url;
        return ;
    }
    if(win.history){
        win.history.go(-1);
    } else {
        win.location.href = document.referrer;
    }
};
//登出系统的方法
oui.logout = function () {
    oui.getTop().location.href = oui_url.logout;
};
//判断当前页面是否是顶层页面
oui.isTop = function () {
    try {
        if (oui_isTop) {
            return true;
        }
        return true;
    } catch (e) {
        return false;
    }
};
/**
 * 获取静态图片访问路径
 */
oui.getImgUrl = function (imgId,width,height) {
    /** 对于base64的图片数据直接返回 ***/
    if(imgId && (imgId.indexOf('data:')>=0)){
        return imgId;
    }
    if (imgId && imgId.indexOf('/') > 0) { //如果是系统默认配置路径则返回路径

        var url ='';
        if((imgId.indexOf('/')==0) || (imgId.indexOf('http:')==0) || (imgId.indexOf('https:')==0)){
            url = oui.addOuiParams4Url(imgId);
        }else{
            url = oui.addOuiParams4Url(oui_context.contextPath + imgId);
        }
        if(width){
            url = oui.addParam(url,'width',width);
        }
        if(height){
            url = oui.addParam(url,'height',height);
        }
        return url;
    } else if (imgId && imgId.indexOf('.') > 0) { //只传入文件名的场景
        return oui_context.contextPath + 'res_apps/form/form-images/' + imgId;
    }

    return "";
    // if (!width) {
    //     width = "";
    // }
    // if (!height) {
    //     height = "";
    // }
    // var showImgUrl = oui.addOuiParams4Url(oui_context.contextPath + "file.do?method=showImage&id=" + imgId + "&width=" + width + "&height=" + height);
    // return showImgUrl;
};

/**
 * 生产二维码图片
 * @param content
 * @returns {string}
 */
oui.showQRcode = function (content) {
    content = encodeURIComponent(content);
    return oui_context.contextPath + "file.do?method=showQRcode&content=" + content;
};


oui.isPortal = function(){
    return false;
};
//oui.getUploadUrl =function(){
//	return  oui_context.contextPath + "file.do?method=doUpload";
//}
var topMainWin = null;
oui.getTopMain = function(){
    if(topMainWin){
        return topMainWin;
    }
    if(oui.getTop().$("#mainFrame").length > 0){
        topMainWin = oui.getTop().$("#mainFrame")[0].contentWindow;
    }else{
        topMainWin = oui.getTop();
    }
    return topMainWin;
};

//获取顶层页面
var topWin = null;
oui.getParent = function (win) {
    var p;
    try {
        p = win.parent;
        if (!p.oui) {
            return win;
        }
    } catch (e) {
        return win;
    }
    return p;
};
oui.getTop = function () {
    if (topWin) {
        return topWin;
    }
    topWin = (function (p, c) {
        while (p != c) {

            c = p;
            p = oui.getParent(p);
        }
        return c;
    })(oui.getParent(window), window);
    return topWin;
};
//获取在线人数
oui.getOnlineUser = function () {
    var url = "common.do";
    var count = oui.getData(url, "method=countOnlineUser");
    return count;
};

oui.urlParam = {
    map: {},
    inited: false,
    /**
     * 设置 获取 全局属性
     */
    attr: function (k, v) {
        var len = arguments.length;
        if (len == 2) {
            this.map[k] = v;
            return;
        }
        if (len == 1) {
            return this.map[k];
        }
        if (!len) {
            return this.map;
        }
    },
    /**
     * 初始化url参数
     */
    initUrlParam: function () {
        this.inited = true;
        var url = location.search; //获取url中"?"符后的字串
        if (url.indexOf("?") != -1) {
            var str = url.substr(url.indexOf("?")+1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                this.map[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
    }
};
/**
 * 获取页面参数
 */
oui.getParam = function (key) {
    if (oui.urlParam.inited == false) {
        oui.urlParam.initUrlParam();
    }
    if (typeof key == 'undefined') {
        if(oui.getNS() != window){
            return oui.getNS()._params;
        }else{
            return oui.urlParam.attr();
        }
    }
    if(oui.getNS() != window){
        return oui.getNS()._params[key];
    }else{
        return oui.urlParam.attr(key);
    }
};

/***设置页面参数 **/
oui.setPageParam = function(key,v){
    if(!oui.getNS()._params){
        oui.getNS()._params = {};
    }
    if(typeof key=='object'){
        oui.getNS()._params = $.extend(true,oui.getNS()._params,key);
    }else{
        oui.getNS()._params[key] = v;
    }
    return  oui.getNS()._params;
};
/**获取页面参数 ***/
oui.getPageParam=function(key){
    if(!oui.getNS()._params){
        oui.getNS()._params = {};
    }
    return  oui.getNS()._params[key];
};
/** 获取加密后的url，keys为顺序的加密字段列表多个以逗号隔开**/
oui.getEncodeUrl = function(url,keys){
    if(typeof keys =='string'){
       keys = keys.split(',');
    }
    var param ='';
    for(var i= 0,len=keys.length;i<len;i++){
        param+=(oui.getPageParam(keys[i])||"");
    }
    url = attachSecurityParam(url,param);
    return url;
};

/** 根据url获取参数****/
oui.getParamByUrl = function(url,key){
    var cfg = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?")+1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            if(strs[i].split("=")[0]){
                cfg[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
    }
    if(key){
        return cfg[key]||"";
    }
    return cfg;
};
//修改URL里面的参数
oui.setParam = function (url, paramName, paramValue,backUrl) {
    var cfg = oui.getParamByUrl(url);
    cfg[paramName] = paramValue;
    var first;
    if(url.indexOf("?")>-1){
        first = url.substring(0,url.indexOf("?"));
    }else{
        first = url;
    }
    var paramStr = $.param(cfg);
    url = first+'?'+paramStr;

    if (backUrl) {
        url = oui.setBackUrl(url, backUrl);
    }

    return url;
};
//清楚URL中某个参数
oui.delParam = function (url, paramName) {
    var cfg = oui.getParamByUrl(url);
    delete cfg[paramName];
    var first;
    if(url.indexOf("?")>-1){
        first = url.substring(0,url.indexOf("?"));
    }else{
        first = url;
    }
    var paramStr = $.param(cfg);
    url = first+'?'+paramStr;
    return url;
};

//往URL中添加一组参数
oui.addParams = function (url, params,backUrl) {
    var paramStr = "";
    if (typeof params === 'object') {
        paramStr = $.param(params);
    }
    if (url.indexOf("?") >= 0) {
        url += "&" + paramStr;
    } else {
        url += "?" + paramStr;
    }
    if (backUrl) {
        url = oui.setBackUrl(url, backUrl);
    }
    return url;
};
//往URL中添加一个参数
oui.addParam = function (url, paramName, paramValue, backUrl) {
    var paramStr = paramName + "=" + paramValue;
    if (url.indexOf("?") >= 0) {
        url += "&" + paramStr;
    } else {
        url += "?" + paramStr;
    }
    if (backUrl) {
        url = oui.setBackUrl(url, backUrl);
    }
    return url;
};

/**
 * 设置返回地址
 * @param url
 * @param backUrl
 */
oui.setBackUrl = function (url, backUrl) {
    if(!backUrl){
        backUrl = window.location.href;
    }
    backUrl = encodeURIComponent(backUrl);
    return oui.setParam(url, oui.constant.BACK_URL_KEY, backUrl);
};

oui.uploadURL = oui.addOuiParams4Url(oui_context.contextPath + "file.do?method=doUpload");

//返回国际化语言
oui.i18n = function (key) {
    var str = oui.$.i18nResources[key];
    if (str == null) {
        return key;
    } else {
        return str;
    }
};
//将对象转JSON字符串
oui.parseString = function (obj) {
    if(typeof obj =='string'){
        return obj;
    }
    return JSON.stringify(obj);
};
//将字符串转换成JSON对象
oui.parseJson = function (str) {
    if (typeof str == 'undefined') {
        return {};
    }
    if (!str) {
        return {};
    }
    if (typeof str == 'object') {
        return str;
    }
    if (str.indexOf('[') == 0) {
        return eval(str);
    }
    return eval("(" + str + ")");
};
//关闭层对话框
oui.closeDialog = function (dialogId) {
    mini.hideMessageBox(dialogId);
};
//进度条
oui.progress = function (msg) {
    if (msg == null || msg == undefined) {
        msg = oui.i18n("common_wait_tip");
    }
    return mini.loading(msg);
};
//提示信息
oui.alert = function (msg, callback) {
    return mini.alert(msg, oui.i18n("common_msgBox_alert_title"), callback);
};
//确认对话框
oui.confirmDialog = function (msg, okCallback, cancelCallBack) {
    return mini.confirm(msg, oui.i18n("common_msgBox_confirm_title"), function (action) {
        if (action == "ok") {
            okCallback();
        } else {
            cancelCallBack && cancelCallBack();
        }
    });
};
//输入对话框
/**
 *
 * @param title
 * @param callback 如果data不是Array 返回一个字符串
 *  function(data){
 *      data = [
 *          'value1','value2',...
 *      ]
 *  }
 * @param inputs 不传入代表只有一个文本框
 *  [
 *      {
 *          title:'',
 *          value:'',
 *          validate:
 *          {
 *
 *          },
 *          type:'',//文本框（text），数字框(number)，日期(date)，日期时间(datetime) 文本域 默认 文本框
 *      },
 *      {
 *          title:'',
 *          value:'',
 *          type:'',//文本框，数字框，日期，日期时间 文本域
 *      }
 *  ]
 * @returns {*}
 */
oui.showInputDialog = function (title, callback, inputs) {
    if (title == "" || title == null) {
        title = oui.i18n("common_msgBox_alert_title");
    }
    return mini.prompt("", title, callback, false);
};
//屏幕右下方弹出一个消息框
oui.showRightDialog = function (options) {
//	options = {
//		    content: options.content,    
//		    state: (options.state==null?default: options.state),      //default|success|info|warning|danger
//		    x: (options.x==null?right:options.x),          //left|center|right
//		    y: (options.y==null?buttom:options.y),          //top|center|bottom
//		    timeout: 0     //自动消失间隔时间。默认2000（2秒）。
//	}
    mini.showTips(options);
};
//HTML对话框
oui.showHTMLDialog = function (options) {
    return mini.showMessageBox(options);
};
//通过一个URL构造对话框
oui.showUrlDialog = function (options) {
//	var param = {
//	    url: String,        //页面地址
//	    title: String,      //标题
//	    iconCls: String,    //标题图标
//	    width: Number,      //宽度
//	    height: Number,     //高度
//	    allowResize: Boolean,       //允许尺寸调节
//	    allowDrag: Boolean,         //允许拖拽位置
//	    showCloseButton: Boolean,   //显示关闭按钮
//	    showMaxButton: Boolean,     //显示最大化按钮
//	    showModal: Boolean,         //显示遮罩
//	    onload: function () {       //弹出页面加载完成
//	        var iframe = this.getIFrameEl(); 
//	        var data = {};       
//	        //调用弹出页面方法进行初始化
//	        iframe.contentWindow.SetData(data); 
//	                        
//	    },
//	    ondestroy: function (action) {  //弹出页面关闭前
//	        if (action == "ok") {       //如果点击“确定”
//	            var iframe = this.getIFrameEl();
//	            //获取选中、编辑的结果
//	            var data = iframe.contentWindow.GetData();
//	            data = mini.clone(data);    //必须。克隆数据。
//	            ......
//	        }                        
//	    }
//
//	}
    mini.open(options);
};
//关闭url对话框
oui.close = function (action) {
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
};
/**
 * 获取Blob
 * @param {stirng} base64
 */
function getBlob(base64) {
    var contentType = /data:([^;]*);/i.exec(base64)[1];
    var baseData = base64.substr(base64.indexOf("base64,") + 7, base64.length);
    return b64toBlob(baseData,contentType);
}
oui.getBlob = getBlob;
/**
 * base64转Blob
 * @param {string} b64Data
 * @param {string} contentType
 * @param {number} sliceSize
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
/**
 *
 * base64文件下载
 * ***/
oui.downloadFile4base64 = function(url,fileName){
    var blob = getBlob(url);
    if (navigator.msSaveBlob) {

        navigator.msSaveBlob(blob, fileName);
    } else {
        var uuid = oui.getUUIDLong();
        $('body').append('<a id="btnDownLoad-'+uuid+'" style="display:none"></a>');
        var btnDownload = $('#btnDownLoad-'+uuid)[0];
        btnDownload.download = fileName;
        btnDownload.href = URL.createObjectURL(blob);
        btnDownload.click();
        $(btnDownload).remove();
    }
};
//下载文件的函数
oui.downloadFile = function (url, jsonParam) {
    var param = $.param(jsonParam || {});
    if (param) {
        param = '&' + param;
    }
    var downloadUrl = url + param;
    downloadUrl = oui.addOuiParams4Url(downloadUrl);
    if(oui.os.mobile){
        oui.go(downloadUrl);
    } else {
        if ($("#_downloadFrame").size() == 0) {
            $("body").append("<iframe id='_downloadFrame' src='' width=0 height=0 style='display:none'></iframe>");
        }
        $("#_downloadFrame").attr("src", downloadUrl);
    }

};
var getFileSize = function (fSize) {
    var nSize = 0;
    if ((fSize + "").indexOf(" ") > 0) {
        var a_fSize = fSize.split(" ");
        var i_fSize = a_fSize[0];
        var s_sizeType = a_fSize[1];
        switch (s_sizeType) {
            case 'B':
                nSize = i_fSize / 1024;
                break;
            case 'KB':
                nSize = i_fSize;
                break;
            case 'MB':
                nSize = i_fSize * 1024;
                break;
            case  'GB':
                nSize = i_fSize * 1024 * 1024;
                break;
            default :
                break;
        }
    } else {
        nSize = fSize;
    }
    return nSize * 1024;
};

/**
 * confirm, 截图完成后，确定事件 function(base64,boxData,o){},第一个参数返回base64，第二个参数截图宽高位置信息，第三个参数截图对象
 * cancel, 取消事件，关闭窗口
 * cropBoxResizable, 是否允许改变截图框大小，默认值false
 * boxWidth, 截图框默认宽
 * boxHeight,截图框默认高
 * showPreview,是否显示预览区域，默认值true
 * panelStyle 截图组件外框样式
 * ***/
oui.showCutImg = function(options){
    var topId = oui.getUUIDLong();
    var outerHtml = '<oui-cutimg showType="1"  ></oui-cutimg>';
    var props = 'cropBoxResizable,boxWidth,boxHeight,showPreview,panelStyle'.split(',');
    var $outer = oui.getTop().$(outerHtml);
    for(var i= 0,len=props.length;i<len;i++){
        var key = props[i];
        var v = options[key]||"";
        $outer.attr(key,v);
    }
    var confirmFun = options.confirm ||function(){};
    if(confirmFun && (typeof confirmFun =='string')){
        confirmFun = eval(confirmFun);
    }
    oui.getTop().oui.setPageParam('tempfun_confirm_'+topId,function(base64,boxData,o){
        confirmFun && confirmFun(base64,boxData,o);
        var el = o.getEl();
        oui.getTop().oui.clearByOuiId(topId);
        oui.getTop().$(el).remove();
    });

    var cancelFun = options.cancel ||function(){};
    if(cancelFun && (typeof cancelFun =='string')){
        cancelFun = eval(cancelFun);
    }
    oui.getTop().oui.setPageParam('tempfun_cancel_'+topId,function(o){
        cancelFun&&cancelFun(o);
        var el = o.getEl();
        oui.getTop().oui.clearByOuiId(topId);
        oui.getTop().$(el).remove();
    });
    $outer.attr('confirm','oui.getTop().oui.getPageParam("tempfun_confirm_'+topId+'")');
    $outer.attr('cancel','oui.getTop().oui.getPageParam("tempfun_cancel_'+topId+'")');
    $outer.attr('class','cutimg-hide oui-class-cutimg');
    $outer.attr('id',topId);
    oui.getTop().$(oui.getTop().document.body).append($outer);
    oui.getTop().oui.parse();
    var topObj = oui.getTop().oui.getById(topId);
    topObj&&topObj.showCutImg();
};
//TODO SHANGC
oui.upload4ajax = function(options){
    var _options = {
        url: oui.uploadURL,
        file: null,
        fileSizeLimit: oui.uploadConfig.defaultFileSizeLimit || "5 MB",
        fileNameMaxLength: 100,
        data: {
            isEncoder: false,
            bucket: ''
        },
        success: null,
        error: null,
        progress: null
    };

    $.extend(_options, options);

    if (options.hasOwnProperty("isEncoder")) {
        _options.isEncoder = options.isEncoder;
    }
    if (options.hasOwnProperty("bucket")) {
        _options.bucket = options.bucket;
    }

    var data;

    if (_options.file) {
        var fileSize = _options.file.size || 0;
        var fileName = _options.file.name || '';

        if (fileName.indexOf(".") < 0) {
            oui.getTop().oui.alert("上传文件命名需要后缀名");
            _options.error && _options.error();
            return;
        }

        if (fileName.length > _options.fileNameMaxLength && fileName.length !== 0) {
            oui.getTop().oui.alert("上传文件名超出" + _options.fileNameMaxLength + "个字符,请修改文件名后上传!");
            _options.error && _options.error();
            return;
        }
        var fileSizeLimit = getFileSize(_options.fileSizeLimit);
        if (fileSize > fileSizeLimit) {
            oui.getTop().oui.alert('上传文件超过' + _options.fileSizeLimit + '限制，请重新选择上传!');
            _options.error && _options.error();
            return;
        }
        data = new FormData();
        data.append('file', _options.file, fileName);
    }

    if (_options.data && data) {
        var _d = _options.data;
        for (var key in _d) {
            data.append(key, _d[key]);
        }
        _d = null;
    }

    if (!data) {
        oui.getTop().oui.alert('您还没有选择上传文件哦！');
        _options.error && _options.error();
        return;
    }

    $.ajax({
        url: _options.url,
        type: 'POST',
        data: data,
        dataType: "json",
        processData: false,
        contentType: false,
        //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
        //xhr: function () {
        //    var xhr = $.ajaxSettings.xhr();
        //    if (_options.progress && xhr.upload) {
        //        xhr.upload.addEventListener("progress", _options.progress, false);
        //        return xhr;
        //    }
        //},
        success: function (data) {
            data = oui.parseJson(data);
            _options.success && _options.success(data);
        },
        error: function (e) {
            _options.error && _options.error(e);
        }
    });
};
/**
 * 获取当前页面上下文
 */
oui.getContextPath = function () {
    if (oui_context && oui_context.contextPath) {
        return oui_context.contextPath;
    }
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0, index + 1) + "/";
    if (!oui_context) {
        oui_context = {};

    }
    oui_context.contextPath = result;
    return result;
};

/**
 * 获取当前页面全路径
 * @returns {string}
 */
oui.getFullPath = function (noContextPath) {
    var protocol = location.protocol;
    var host = location.hostname;
    var port = location.port;
    if(!noContextPath){
        return protocol + "//" + host + ((port == "") ? "" : (":" + port)) + oui.getContextPath();
    } else {
        return protocol + "//" + host + ((port == "") ? "" : (":" + port));
    }
};

/**
 * 计算图片高度和宽度
 * @param options
 * 1、如果没有传高、宽显示原图大小
 * 2、如果只传了宽：以‘宽度’缩小尺度为标准，来重新计算缩小的‘高度’
 * 3、如果只传了高：以‘高度’缩小尺度为标准，来重新计算缩小的‘宽度’
 * 4、如果都传了，并且高或宽，有其一小于原始大小，则进行缩小
 *      如果‘宽度’缩小尺度大于‘高度’缩小，就以‘宽度’缩小尺度为标准，来重新计算缩小的‘高度’
 *      如果‘高度’缩小尺度大于‘宽度’缩小，就以‘高度’缩小尺度为标准，来重新计算缩小的‘宽度’
 * 5、如果都穿了，值都比原始图片大：显示原图大小
 */
oui.calculateImg = function (options) {
    var _options = {
        url: '',
        obj: null,
        w: 0,
        h: 0
    };

    $.extend(_options, options);

    if (!_options.url || _options.url.length < 0) {
        return;
    }

    var imgObj = new Image();
    imgObj.src = _options.url;

    //利用图片对象加载完成的事件 获取图片的高宽
    imgObj.onload = function () {
        (function (obj, _options) {
            var iW = parseFloat(obj.width);
            var iH = parseFloat(obj.height);

            if ((!_options.w || _options.w <= 0) && (!_options.h || _options.h <= 0)) {
                //不做处理

            } else if (_options.w && _options.w > 0 && (!_options.h || _options.h <= 0)) {
                iH = iH * (_options.w / iW);
                iW = _options.w;
            } else if (_options.h && _options.h > 0 && (!_options.w || _options.w <= 0)) {
                iW = iW * (_options.h / iH);
                iH = _options.h;
            } else if (_options.w && _options.w > 0 && _options.h && _options.h > 0) {
                if (iW > _options.w || iH > _options.h) {
                    if (_options.w / iW >= _options.h / iH) {
                        //iW = iW;
                        iH = iH * (_options.w / iW);
                        iW = _options.w;
                    } else {
                        iW = iW * (_options.h / iH);
                        iH = _options.h;
                    }
                }
            }

            $(_options.obj).width(iW);
            $(_options.obj).height(iH);

            imgObj = null;
        })(this, _options);
    };

    imgObj.onerror = function () {
        imgObj = null;
    };
};

oui.escapeStringToHTML = function (str, isEscapeSpace) {
    if (!str) {
        return "";
    }
    str = str + "";
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/\r/g, "");
    str = str.replace(/\n/g, "<br/>");
    str = str.replace(/\'/g, "&#039;");
    str = str.replace(/"/g, "&quot;");
    if (typeof(isEscapeSpace) != 'undefined' && (isEscapeSpace == true || isEscapeSpace == "true")) {
        // str = str.replace(/\s/g, "&nbsp;");
        str = str.replace(/\s/g, "&ensp;");
    }
    return str;
};

oui.escapeHTMLToString = function (str) {
    if (!str) {
        return "";
    }
    str = str + "";
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/&ensp;/g, " ");
    str = str.replace(/&#39;/g, "\'");
    str = str.replace(/&#039;/g, "\'");
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/<br>/g, "\n");
    str = str.replace(/<br\/>/g, "\n");
    str = str.replace(/<br \/>/g, "\n");
    return str;
};

oui.escapeStringToJavascript = function (str) {
    if (!str) {
        return str;
    }
    str = str + "";
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/\r/g, "");
    str = str.replace(/\n/g, "");
    str = str.replace(/\'/g, "\\\'");
    str = str.replace(/"/g, "\\\"");
    return str;
};

/**
 * 字符串trim
 */
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};
/**
 * 根据对象和 key 获取对象中的属性值
 * @param obj
 * @param key
 * @returns {*}
 */
oui.getJsonAttr = function (obj, key) { // getObjAttr  ----> getJsonAttr
    var json = oui.parseJson(obj);
    var kv = json[key];
    if (typeof kv == 'undefined') { //未定义
        return "";
    }
    if (typeof kv == 'number' || typeof kv == 'boolean') {// 数字 or bool
        return kv;
    }
    if (!kv) {
        return "";
    }
    return kv;
};
/**
 * 简单的复制实现
 * 依赖 jquery.zeroclipboard.min.js
 */
$.fn.clipboard = function (options) {//
    $(this).on("copy", function (e) {
        e.clipboardData.clearData();
        e.clipboardData.setData("text/plain", $(options.target).val());
        e.preventDefault();
        var success = options.success;
        if (typeof success == 'function') {
            success();
        }
    });
};
/**
 * 判断一个js对象是否为 dom对象
 */
oui.isDom = ( typeof HTMLElement === 'object' ) ? function (obj) {
    return obj instanceof HTMLElement;
} : function (obj) {
    return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
};
/**
 * 判断 目标元素是否在容器中或者本身
 * @param target 目标元素
 @param el 容器元素
 */
oui.isInDom = function (target, el) {
    if (!target) {
        return false;
    }
    if (!el) {
        return false;
    }
    if ($(target).closest(el).length > 0) { //判断当前事件的元素 是否在指定元素范围内
        return true;
    }
    return false;
};
/**
 *  根据容器渲染图片
 *  <img src='pre.png' oui-img-src='' />
 *   TODO 待完善 功能未实现
 * @param el
 */
oui.renderImgs = function (el) {
    //$(el).find('[form-img-src]').each(function(){ //图片渲染方式
    //    if($(this).attr('src') == $(this).attr('form-img-src')){
    //        return ;
    //    }
    //    $(this).attr('src',$(this).attr('form-img-src'));
    //});
};
/**
 * cavas 转图片对象
 */
oui.canvas2Image = function (el) {
    if (!el) {
        return null;
    }
    if ($(el).length == 0) {
        return null;
    }
    var cavas = $(el)[0];
    var image = new Image();
    image.src = cavas.toDataURL("image/png");
    return image;
};
/**
 * jqery qrcode支持table 和 canvas渲染 扩展image
 * @param el
 * @param options
 */
oui.qrcode = function (el, options) {
    if(!$.fn.qrcode){
        /** 按需加载处理二维码***/
        oui.require([oui.getContextPath()+'res_common/third/jquery/jquery.qrcode.min.js'],function(){
            if($.fn.qrcode){
                oui.qrcode(el,options);
            }
        },function(){
            console.log('按需加载二维码失败');
        },(oui_context&&oui_context.debug?false:true));
    }else{
        var target = $(el);
        var image = options.render === 'image';
        if (image) {
            options.render = 'canvas';
        }
        target.qrcode(options);
        if (image) {
            var imageObject = oui.canvas2Image(target.find('canvas'));
            target.empty().append(imageObject);
        }
    }
};
oui.barcode = function (el, value, options) {
    if(!$.fn.barcode){
        /** 按需加载处理条形码***/
        oui.require([oui.getContextPath()+'res_common/third/jquery/jquery-barcode.js'],function(){
            if($.fn.barcode){
                oui.barcode(el,value,options);
            }
        },function(){
            console.log('按需加载条形码失败');
        },(oui_context&&oui_context.debug?false:true));

    }else{
        var  target = $(el);
        var image = options.output === 'image';
        if (image) {
            el.append("<canvas id='canvasTarget'></canvas>");
            target = el.find("#canvasTarget");
            options.output = 'canvas';
        }
        target.barcode(value, "code128", options);
        if (image) {
            var imageObject = oui.canvas2Image(target);
            el.empty().append(imageObject);
        }
    }

};
oui.svg2Image = function (el) {
    var svgXml = $(el)[0].outerHTML();

    var image = new Image();
    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流
    return image;
};

/*** 转换字符串 函数为 函数的参数列表 ***/
oui.parseString2FunctionParams = function(str){
    var resultParams =[] ;
    if(str){
        /** 解析代码参数****/
        var paramStr = str.substring(0,str.indexOf('{'));
        paramStr = paramStr.substring(paramStr.lastIndexOf('('),paramStr.lastIndexOf(')')+1);
        paramStr = paramStr.replace('(','');
        paramStr = paramStr.replace(')','');
        if(paramStr){
            /** 剔除参数中的注释**/
            var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n|$))|(\/\*(\n|.)*?\*\/)/g;
            paramStr =paramStr.replace(reg, function(word) {
                // 去除注释后的文本
                return (/^\/{2,}/.test(word) || /^\/\*/.test(word) )? "" : word;
            });
            paramStr = paramStr.split(','); //分割逗号
            /** 变量trim***/
            for(var i= 0,len=paramStr.length;i<len;i++){
                paramStr[i] = $.trim(paramStr[i]);
            }
            /** 连接变量***/
            resultParams= resultParams.concat(paramStr);
        }
        /** 解析 代码内容***/
        var start = str.indexOf('{')+1;
        var end = str.lastIndexOf('}');
        var codeBody = str.substring(start,end);
        resultParams.push(codeBody);//添加 代码内容
    }
    return resultParams;
};
/** 转换字符串 为可执行函数***/
oui.parseString2Function = function(str){
    var params = oui.parseString2FunctionParams(str);
    var fun = Function.apply(null,params);
    return fun;
};
/** 转换json对象配置为 可执行函数****/
oui.parseJson2Function = function(json){
    json = oui.parseJson(json);
    var params = json.params ||[];
    var startCode =json.startCode ||'';
    var bodyCode = json.bodyCode ||'';
    var endCode =json.endCode ||'';
    var code = startCode + bodyCode + endCode;
    var arr = [].concat(params);
    arr.push(code);
    var fun = Function.apply(null,arr);
    return fun;
};
/***
 *
 * @param json{startCode,bodyCode,endCode,returnType},json格式对象
 * @param callback:function(json){}//回调返回json格式与 输入json格式相同
 * @param options dialog 样式相关属性
 */
oui.showCodeDialog = function(json,callback,options){
    /** 如果传入参数为字符串，字符串的函数模板,转换为包含内容的参数数组****/
    json = oui.parseJson(json);
    var params = [];
    params = params.concat(json.params||[]) ;
    var startTag = 'function('+params.join(',')+'){';
    var endTag = '}';
    var startCode =json.startCode ||'';
    var bodyCode = json.bodyCode ||'';
    var endCode =json.endCode ||'';
    var startCodeRows = startCode.split('\n').length ||1;
    var endCodeRows = endCode.split('\n').length||1;
    var returnType = json.returnType ||'string';
    var keys = ['startTag','startCode','bodyCode','endCode','endTag'];
    oui.showInputDialog(options&&options.title||'脚本编辑', function(result){
        var jsonResult = {
            params:params,
            startCode:startCode,
            bodyCode:bodyCode,
            endCode : endCode,
            returnType:returnType
        };
        for(var i= 0,len=result.length;i<len;i++){
            if(keys[i] =='bodyCode'){
                jsonResult[keys[i]] = result[i];
                break;
            }
        }
        if(callback){
            var flag = callback(jsonResult); //执行回调
            if((typeof flag =='boolean') && (!flag)){
                return false;
            }
        }
    }, [{
        type:"textfield",value:startTag,readOnly:true
    },{
        type:"textarea",value:startCode,readOnly:true,style:startCode?'':'display:none',rows:startCodeRows
    },{
        type:"textarea",value:bodyCode,readOnly:false
    },{
        type:"textarea",value:endCode,readOnly:true,style:endCode?'':'display:none',rows:endCodeRows
    },{
        type:"textfield",value:endTag,readOnly:true
    }], options);

};
/*****
 *
 * @param params 数组[],除了数组最后一项为函数内容外，前面的参数为变量定义列表
 * @param callback:function(params,funcString){} 返回 第一个参数数组 [] 除了数组最后一项为函数内容外，前面的参数为变量定义列表；第二个参数方法整体字符串
 * @param options 样式相关，dialog弹框样式
 */
oui.showCodeDialogByParams = function(params,callback,options){

    /** 如果传入参数为字符串，字符串的函数模板,转换为包含内容的参数数组****/
    if(typeof params =='string'){
        try{
            params = oui.parseString2FunctionParams(params);
        }catch(err){
            params = [];
        }
    }
    var fun = Function.apply(null,params);
    var paramStr = fun.toString().replace('anonymous',''); //初始化的 参数代码
    oui.showInputDialog(options&&options.title||'脚本编辑', function(result){
        var resultParams =[] ;
        if(result){
            resultParams = oui.parseString2FunctionParams(result);
        }
        if(callback){
            var resultFun = Function.apply(null,resultParams);
            var resultStr = resultFun.toString().replace('anonymous',''); //初始化的 参数代码
            var flag = callback(resultParams,resultStr,result); //执行回调
            if((typeof flag =='boolean') && (!flag)){
                return false;
            }
        }
    }, [{type:"textarea",value:paramStr}], options);

};
/**
 * 获取单行文本、多行文本中鼠标的位置
 */
oui.getCurPos = function (el) {
    var curCurPos = '';
    var all_range = '';
    if (navigator.userAgent.indexOf("MSIE") > -1) { //IE

        if ($(el).get(0).tagName == "TEXTAREA") {
            // 根据body创建textRange
            all_range = document.body.createTextRange();
            // 让textRange范围包含元素里所有内容
            all_range.moveToElementText($(el).get(0));
        } else {
            // 根据当前输入元素类型创建textRange
            all_range = $(el).get(0).createTextRange();
        }

        // 输入元素获取焦点
        $(el).focus();

        // 获取当前的textRange,如果当前的textRange是一个具体位置而不是范围,textRange的范围从start到end.此时start等于end
        var cur_range = document.selection.createRange();

        // 将当前的textRange的end向前移"选中的文本.length"个单位.保证start=end
        cur_range.moveEnd('character', -cur_range.text.length)

        // 将当前textRange的start移动到之前创建的textRange的start处, 此时当前textRange范围变为整个内容的start处到当前范围end处
        cur_range.setEndPoint("StartToStart", all_range);

        // 此时当前textRange的Start到End的长度,就是光标的位置
        curCurPos = cur_range.text.length;
    } else {
        // 文本框获取焦点
        $(el).focus();
        // 获取当前元素光标位置
        curCurPos = $(el).get(0).selectionStart;
    }
    // 返回光标位置
    return curCurPos;
};
// 设置当前光标位置方法
oui.setCurPos = function (el, start, end,isNotFocus) {
    if (navigator.userAgent.indexOf("MSIE") > -1) {
        var all_range = '';

        if ($(el).get(0).tagName == "TEXTAREA") {
            // 根据body创建textRange
            all_range = document.body.createTextRange();
            // 让textRange范围包含元素里所有内容
            all_range.moveToElementText($(el).get(0));
        } else {
            // 根据当前输入元素类型创建textRange
            all_range = $(el).get(0).createTextRange();
        }
        if(!isNotFocus){
            $(el).focus();
        }
        // 将textRange的start设置为想要的start
        all_range.moveStart('character', start);

        // 将textRange的end设置为想要的end. 此时我们需要的textRange长度=end-start; 所以用总长度-(end-start)就是新end所在位置
        all_range.moveEnd('character', -(all_range.text.length - (end - start)));

        // 选中从start到end间的文本,若start=end,则光标定位到start处
        all_range.select();
    } else {
        // 文本框获取焦点
        if(!isNotFocus){
            $(el).focus();
        }

        // 选中从start到end间的文本,若start=end,则光标定位到start处
        $(el).get(0).setSelectionRange(start, end);
    }
};


/**
 * 日期格式化扩展
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
};


/**
 * 通过时间戳转化日期字符串
 * @param time
 * @param _format
 * @returns {*}
 */
oui.dateStrByTime = function (time, _format) {
    return new Date(time).format(_format || "yyyy-MM-dd HH:mm:ss");
};

/**
 * 将字符串转为日期对象
 * @param strDate
 * @returns {Object}
 */
oui.dateByDateStr = function (strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) {
                return parseInt(a, 10) - 1;
            }).match(/\d+/g) + ')');
    return date;
};

/**
 * 将字符串格式的时间转为想要的时间格式
 * @param strDate
 * @param _format
 * @returns {*}
 */
oui.dateStrByDateStr = function (strDate, _format) {
    return oui.dateByDateStr(strDate).format(_format || 'yyyy-MM-dd HH:mm:ss');
};

/**
 * 重写window.console 解决 IE 不支持的bug
 */
(function () {
    if (!window.console) {
        window.console = {};
        if (!window.console.log) {
            window.console.log = function (s) {
            }
        }
    } else {
        if (!window.console.log) {
            window.console.log = function (s) {
            }
        }
    }
})();


/**
 * 获取地理定位信息
 * 各个端在运行态会进行覆盖
 * @param callback
 */
oui.getLocation = function (callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = position.coords;
            callback && callback(coords);
        }, function (e) {
            callback && callback();
        }, {
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAccuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 5000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 3000
        });
    } else {
        alert("您的浏览器暂不支持定位服务!");
    }
};

/**
 * 获取对象的长度
 */
oui.getObjectLength = function (o) {
    var n, count = 0;
    for (n in o) {
        if (o.hasOwnProperty(n) && o[n] != undefined && o[n] != null) {
            count++;
        }
    }
    return count;
};

(function (_) {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    _.uuid = function (len, radix) {
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    };

    _.uuidFast = function () {
        var chars = CHARS, uuid = new Array(36), rnd = 0, r;
        for (var i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                uuid[i] = '-';
            } else if (i == 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    };


    /**
     * 获取整型uuid
     */
    _.getUUIDLong = function () {
        //18 位防止后台转为long 超过 long 的最大值
        return oui.uuid(18, 10);
    };

    /**
     * 获取字符串类型的uuid
     */
    _.getUUIDString = function () {
        return oui.uuidFast();
    };
})(oui);


/**
 * 操作storage
 * @type {{get: oui.storage.get, set: oui.storage.set, remove: oui.storage.remove, clear: oui.storage.clear}}
 */
oui.storage = {
    get: function (key) {
        return window.localStorage.getItem(key);
    },
    save: function (key, value) {
        window.localStorage.setItem(key, value);
    },
    set: function (key, value) {
        window.localStorage.setItem(key, value);
    },
    remove: function (key) {
        window.localStorage.removeItem(key);
    },
    clear: function () {
        window.localStorage.clear();
    }
};

/*** dom元素吸附定位 ****/
oui.getScroll = function (type) {
    type = type ? 'scrollLeft' : 'scrollTop';
    return document.body[type] | document.documentElement[type];
};

oui.winArea = function (type) {
    return document.documentElement[type ? 'clientWidth' : 'clientHeight']
};

/** dom元素定位处理 **/
oui.orien = function (elem, obj, pos) {
    var tops, rect = elem.getBoundingClientRect();
    obj.style.left = rect.left + (pos ? 0 : oui.getScroll(1)) + 'px';
    if (rect.bottom + obj.offsetHeight + 2 <= oui.winArea()) {
        tops = rect.bottom - 1;
    } else {
        tops = rect.top > obj.offsetHeight + 2 ? rect.top - obj.offsetHeight + 1 : oui.winArea() - obj.offsetHeight;
    }
    obj.style.top = Math.max(tops + (pos ? 0 : oui.getScroll() ), 1) + 'px';
};
/** 吸附定位  下拉、下拉多选，条件组件  底部隐藏后 浮动显示 */
oui.flotTop4dropDown = function (elem, obj) {
    var rect = elem.getBoundingClientRect();
    $(obj).removeClass('dropdown-float-top');
    if (rect.bottom + obj.offsetHeight + 2 <= oui.winArea()) {
        //没有超出底部 高度
    } else {
        //超出底部高度
        $(obj).addClass('dropdown-float-top');
    }
};
/** 吸附定位  下拉、下拉多选，条件组件  底部隐藏后 浮动显示 */
oui.follow4fixed = function (elem, obj, isFix) {
    /** 不采用吸附算法 */
    if (!isFix) {
        oui.flotTop4dropDown(elem, obj);
    }
    /**采用 吸附算法 **/
    var width = $(obj).width();
    var height = $(obj).height();
    $(obj).css('position','fixed');
    //obj.style.position = 'fixed';
    //$(obj).css('z-index',500);
    oui.orien(elem, obj, 1);
    $(obj).width(width);
    $(obj).height(height);

};
oui.follow4absolute = function (elem, obj) {
    obj.style.position = 'absolute';
    oui.orien(elem, obj);
};

/** 触发当前在焦点的元素失去焦点 ***/
oui.targetElBlur = function () {
    if (oui.os.mobile) {
        var target = document.activeElement;
        if (target) {
            $(target).blur();
        }
    }
};
/** 将字节转 MB ****/
oui.transByte2FileSize = function (bytes) {
    var kb = (bytes / 1024).toFixed(2);
    var mb = (kb / 1024).toFixed(2);
    if (bytes < 1024 || kb < 1024) {
        return kb + 'KB';
    } else {
        return mb + 'MB';
    }
};
var OURS_NS = function (name){
    var parts = name.split('.');
    var container = window;
    for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (!container[part]) container[part] = {};
        container = container[part];
    }
    return container;
};
oui._NSIds =[];
/**命名空间创建 **/
oui.createNS=function(){
    var uuid = oui.getUUIDString();
    var namespace = OURS_NS('oui_namespace_'+uuid);
    oui._NSIds.push(uuid);
    return namespace;
};
/**获取当前命名空间Id ***/
oui._getNSId = function(){
    if(!oui._NSIds.length){
        return null;
    }else{
        return oui._NSIds[oui._NSIds.length-1];
    }
};
/***获取当前命名空间对象 ****/
oui.getNS = function(){
    var currId = oui._getNSId();
    if(currId == null){
        return window;
    }else {
        return window['oui_namespace_'+currId];
    }
};

oui._setNS = function (ns) {
    var currId = oui._getNSId();
    if (currId == null) {
    } else {
        window['oui_namespace_' + currId] = ns;
    }
};

/***清空当前命名空间对象 ***/
oui.clearNS = function(){
    var currId = oui._getNSId();
    if(currId){
        oui._NSIds.splice(oui._NSIds.length-1,1);
        window['oui_namespace_'+currId] =null;
        delete window['oui_namespace_'+currId];
    }
};
/****获取当前页面所在的dialog对象 ***/
oui.getCurrUrlDialog = function (isTop) {
    var ouiDialogId = "";
    if(oui.os.mobile){
        ouiDialogId = oui.getParam('ouiDialogId');
        if(ouiDialogId){
            return oui.getTop().oui.getByOuiId(ouiDialogId);
        }else{
            ouiDialogId = oui.getNS()._urlDialogOuiId;
            try{
                return oui.getByOuiId(ouiDialogId);
            }catch (e){
            }
        }
    }else{
        ouiDialogId = oui.getParam('ouiDialogId');
        if(isTop){
            try{
                return oui.getTop().oui.getByOuiId(ouiDialogId);
            }catch (e){
            }
        }else{
            try{
                return window.parent.oui.getByOuiId(ouiDialogId);
            }catch (e){
            }
        }

    }
    return null;
};
/**
 * cookie操作接口
 * @param key
 * @param value
 * @param days
 * @param path
 * @returns {null}
 */
oui.cookie4second = function (key, value, second, path) {
    // var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if (value && value.length > 0) {
        second = second || 2;
        path = path || "/";
        var exp = new Date();
        exp.setTime(exp.getTime() + second * 1000);
        document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path;
    } else {

        var _value = null;
        var allcookies = document.cookie;
        var cookie_pos = allcookies.indexOf(key);   //索引的长度

        // 如果找到了索引，就代表cookie存在，
        // 反之，就说明不存在。
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可。
            cookie_pos += key.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
            var cookie_end = allcookies.indexOf(";", cookie_pos);

            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }

            _value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
        }
        return _value;
    }
};
/** iframe ready事件绑定 ****/
oui.bindIframeReady = function(iframe,fun){
    if(!iframe){
        return ;
    }
    if(iframe && ((!iframe.contentWindow) ||(!iframe.contentWindow.document) )){
        if(oui._currIframeTimer){
            window.clearTimeout(oui._currIframeTimer);
            oui._currIframeTimer = null;
        }
        oui._currIframeTimer =window.setTimeout(function(){
            oui.bindIframeReady(iframe,fun);
        },5);
        return ;
    }
    $(iframe.contentWindow).on('load',function(){
        var doc =iframe.contentDocument || iframe.contentWindow.document;
        fun&&fun(doc,iframe.contentWindow,window);
    });
    oui._currIframeTimer = null;
};
/**根据数字返回字母 ***/
oui.getCharCode=function(num){
    return String.fromCharCode(num+65);
};
/** 根据自定义条件查询数组中的元素  一个**/
oui.findOneFromArrayBy = function (arr,fun){
    if((!arr) ||(!arr.length)){
        return null;
    }
    for(var i= 0,len=arr.length;i<len;i++){
        if(fun&&fun(arr[i],i)){
            return arr[i];
        }
    }
    return null;
};
/** 根据自定义条件查询数组中的元素 多个 **/
oui.findManyFromArrayBy = function (arr,fun){
    if((!arr) ||(!arr.length)){
        return null;
    }
    var temp = [];
    for(var i= 0,len=arr.length;i<len;i++){
        if(fun&&fun(arr[i],i)){
            temp.push(arr[i]);
        }
    }
    return temp;
};

/**删除数组中的元素，根据 条件判断（条件是一个函数） ****/
oui.removeFromArrayBy =function(attrList,fun){
    for(var i=0,flag=true,len=attrList.length;i<len;flag ? i++ : i){
        if(attrList[i]&&fun(attrList[i])){
            attrList.splice(i,1);
            flag = false;
        }else{
            flag = true;
        }
    }
    return attrList;
};
/***样式继承 ****/
oui.styleExtend = function(style1,style2){
    if(style1 && style2){
        var style1Array = style1.split(";");
        var style2Array = style2.split(";");
        var i,len;
        var style1Object = {};
        var style2Object = {};
        var a;
        for (i = 0, len = style1Array.length; i < len; i++) {
            if(style1Array[i] && style1Array[i].indexOf(":") > -1){
                a = style1Array[i].split(":");
                style1Object[a[0]] = a[1];
            }
        }
        for (i = 0, len = style2Array.length; i < len; i++) {
            if(style2Array[i] && style2Array[i].indexOf(":") > -1){
                a = style2Array[i].split(":");
                style2Object[a[0]] = a[1];
            }
        }

        var styleNew = $.extend(true, {}, style1Object, style2Object);
        var styleArray = [];
        for(var key in styleNew){
            styleArray.push(key+":"+styleNew[key]);
        }
        return styleArray.join(";");
    }else if(style1){
        return style1;
    }else if(style2){
        return style2;
    }
    return ""
};

oui.startWith = function(input, str){
    if (str === null || str === "" || input.length === 0 || str.length > input.length) {
        return false;
    }
    return input.substr(0, str.length) === str;
};

oui.toThousands = function(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

oui.formatNumber = function (formatType, value, dotNum) {
    if (formatType && formatType.length > 0 && (value !== null && typeof value !== 'object' && typeof value !== 'undefined' && value !== '') ) {
        if(!isNaN(value)){
            value = Number(value + "");
            if(formatType === ','){//千分位
                value = oui.toThousands(value)
            }else if(formatType === '%'){//百分数
                var sText = value+"";
                var sArray = [];
                var _dotNum = 0;
                if(sText.indexOf(".") > 0){
                    sArray = sText.split(".");
                    _dotNum = sArray[1].length - 2;
                    if(_dotNum <= 0){
                        _dotNum = 0;
                    }
                }
                if (dotNum !== null && typeof dotNum !== 'undefined' && dotNum !== '' && dotNum !== '-1') {
                    _dotNum = Number(dotNum);
                }
                value = (value * 100).toFixed(_dotNum) + "%";
            }
        }
    }else{
        if (dotNum !== null && typeof dotNum !== 'undefined' && dotNum !== '' && dotNum+'' !== '-1' && (value !== null && typeof value !== 'object' && typeof value !== 'undefined' && value !== '')) {
            value = value.toFixed(Number(dotNum));
        }
    }
    return value;
};
/*** 弹出显示webIM
 * userId,//用户登陆id或者临时uuid
 * title,//自定义聊天title
 * webSocketUrl,//支持自定义websocket路径
 * ****/
oui.showWebIm = function(cfg){
    var userId = cfg.userId ||oui.getUUIDString();
    var url = oui.getContextPath()+'res_common/oui/ui/ui_common/controls/webim/webim.html';
    url = oui.setParam(url,'userId',userId);
    var win = oui.openWindow({
        url:url,
        openType:'_blank',
        title:cfg.title||"客服为你服务中"
    });
    var socketUrl = cfg.webSocketUrl+'/'+userId;
    win.websocketUrl = socketUrl;
};
/** 根据OuiSelectPersonVO列表创建流程实例
 * {type,list,start}
 * ***/
oui.createWorkFlow = function(cfg){
    var process = {};
    var startArr = oui.createArrayNodesByPersonSelectedNodes([cfg.start]);
    var startNode = startArr[0];
    startNode.nodeRight = oui.WorkFlowNodeRight.cancel.name ;// 发起人默认权限允许撤回流程
    startNode.parentId = null;//第一个节点没有父节点 必须制定为null,因为后端会根据这个属性取开始节点
    var nodes =  oui.createArrayNodesByPersonSelectedNodes(cfg.list||[]);
    if(nodes&&(nodes.length ==1)){ //如果只有一个节点的情况，只能为串发
        cfg.type = oui.SelectPerson_ADD_TYPE.serial;
    }
    var type = cfg.type;
    if(typeof type=='undefined'){
        type = oui.SelectPerson_ADD_TYPE.serial; //默认串发
    }
    var workFlowNodeList = oui.createWorkFlowNodeListByType(startNode,nodes,type);
    process.workFlowNodeList = workFlowNodeList;
    var startName = startNode.nodeName;
    var names= [];
    names.push(startName);
    for(var i= 0,len=nodes.length;i<len;i++){
        names.push(nodes[i].nodeName);
    }
    process.workFlowNodeNames = names.join(',');
    return process;
};

/* 选人结果类型,并发，串发***/
oui.SelectPerson_ADD_TYPE ={
    concurrency: 0, //并发
    serial: 1 //串发
};
/** 根据开始节点，节点列表，类型 返回 workFlowNodeList***/
oui.createWorkFlowNodeListByType=function(startNode,nodes,type){
    var arr = [];
    var isSerial = false;
    if((type+"") == (oui.SelectPerson_ADD_TYPE.serial+"")){
        isSerial = true;
    }
    arr.push(startNode);
    /** 创建结束节点***/
    var endNode ={
        "id":oui.getUUIDLong(),
        "nodeType":"end",
        "parentId":[
        ],
        "isEnd":true
    };
    if(nodes&&nodes.length){
        //串发
        if(isSerial){
            nodes[0].parentId.push(startNode.id);
            arr.push(nodes[0]);
            for(var i= 1,len=nodes.length;i<len;i++){
                nodes[i].parentId.push(nodes[i-1].id);
                arr.push(nodes[i]);
            }
            endNode.parentId.push(nodes[nodes.length-1].id);
            arr.push(endNode);
        }else{//并发
            //split节点
            var splitNode = {
                "id":oui.getUUIDLong(),
                "name":"",
                "isSplit":true,
                "nodeType":"split",
                "parentId":[
                    startNode.id
                ]
            };
            arr.push(splitNode);
            var nodeIds = [];
            for(var i= 0,len=nodes.length;i<len;i++){
                nodes[i].parentId.push(splitNode.id);
                nodeIds.push(nodes[i].id);
                arr.push(nodes[i]);
            }
            var joinNode =  {
                "id":oui.getUUIDLong(),
                "name":"",
                "isJoin":true,
                "nodeType":"join",
                "parentId":nodeIds
            };
            arr.push(joinNode);
            endNode.parentId.push(joinNode.id);
            arr.push(endNode);
        }
    }else{
        endNode.parentId.push(startNode.id);
        arr.push(endNode);
    }
    return arr;
};
/** 根据选人列表获取节点列表****/
oui.createArrayNodesByPersonSelectedNodes = function(persons){
    if(!persons){
        return [];
    }
    var nodes = [];
    for (var i = 0, len = persons.length; i < len; i++) { //根据选择的人员、部门、角色等创建节点数据
        nodes.push({
            id:oui.getUUIDLong(),
            parentId:[],
            nodeId: persons[i].id,
            nodeName:persons[i].name,
            nodeRight:oui.findNodeRightValue({}),
            nodeDisplayName:persons[i].name,
            name: persons[i].name,
            chooseType:oui.getDefaultChooseTypeByNodeType(persons[i].id,persons[i].typeFlag),
            nodeType: persons[i].typeFlag
        });
    }
    return nodes;
};
/** 获取节点默认权限***/
oui.findNodeRightValue=function(node){
    if(node&&node.nodeRight){
        return node.nodeRight;
    }else{
        return [oui.WorkFlowNodeRight.addNodes.name,oui.WorkFlowNodeRight.rollBack.name,oui.WorkFlowNodeRight.stop.name,oui.WorkFlowNodeRight.notify.name].join(',')
    }
};
/** 流程节点权限配置*****/
oui.WorkFlowNodeRight = {
    addNodes:{
        name:'addNodes',
        value:11,
        desc:"加签"
    },
    rollBack:{
        name:'rollBack',
        value:9,
        desc:"回退"
    },
    stop:{
        name:'stop',
        value:6,
        desc:"终止"
    },
    notify:{
        name:'notify',
        value:18,
        desc:"知会"
    },
    cancel:{
        name:'cancel',
        value:5,
        desc:"允许发起人撤销已发流程"
    }
};
/**
 * 根据节点id和节点类型获取默认的执行模式
 * @param typeFlag
 */
oui.getDefaultChooseTypeByNodeType = function(nodeId,nodeType){
    /**相对角色发送者，单人 默认执行模式为单人;否则为 多人执行模式*/
    if(nodeType == oui.WorkFlowNodeType.person.value || nodeId =='relRole_sender' || (nodeId.indexOf('member#')>-1 || nodeId.indexOf('deptLeader#')>-1)){
        return oui.WorkFlowChooseType.single.value;
    }
    return oui.WorkFlowChooseType.all.value;
};
/** 流程节点执行模式***/
oui.WorkFlowChooseType ={
    single:{
        value:1,
        desc:"单人执行"
    },
    multi:{
        value:2,
        desc:"多人执行"
    },
    all:{
        value:3,
        desc:"全体执行"
    },
    competition:{
        value:4,
        desc:"竞争执行"
    }
};
/** 选人节点类型****/
oui.WorkFlowNodeType={
    all:{
        value:'all',
        desc:'全体人员'
    },
    person:{
        value:'person',
        desc:'人员'
    },
    department:{
        value:'department',
        desc:'部门'
    },
    company:{
        value:'company',
        desc:'单位'
    },
    group:{
        value:'group',
        desc:'集团'
    },
    level:{
        value:'level',
        desc:'职位级别'
    },
    post:{
        value:'post',
        desc:'岗位'
    },
    role:{
        value:'role',
        desc:'角色'
    },
    relativeRole:{
        value:'relativeRole',
        desc:'相对角色'
    },
    team:{
        value:'team',
        desc:'组'
    }
};



/** 流程图显示，并进行设计流程图
 * flowId,moduleId,design4Runtime,workflowJSON,confirm,cancel
 * **/
oui.showProcessGraph = function(cfg){
    var url = oui.getContextPath()+'workflow/workflow.do?method=showProcessGraph';
    url = oui.setParam(url,'hideSaveButton',true);//隐藏按钮
    if(cfg.flowId){
        url = oui.setParam(url,'flowId',cfg.flowId);
    }
    if(cfg.moduleId){
        url = oui.setParam(url,'moduleId',cfg.moduleId);
    }
    if(cfg.design4Runtime){
        url = oui.setParam(url,'design4Runtime',cfg.design4Runtime);
    }
    var actions = [{text:"确定",
        id:"confirm-ok",
        cls:'oui-dialog-ok',
        action: function(){

            var data = dialog.getWindow().oui.flow.FlowBiz.getFlowData();
            if(cfg.confirm){
                var flag = cfg.confirm(data);
                if(typeof flag =='boolean'){
                    if(!flag){
                        return ;
                    }
                }
            }
            dialog.hide();
            return false;
        }
    }, {
        text: "取消",
        cls:  "oui-dialog-cancel",
        action: function () {
            // BizForm.releaseSaveLabel();
            if(cfg.cancel){
                var flag = cfg.cancel();
                if(typeof flag =='boolean'){
                    if(!flag){
                        return ;
                    }
                }
            }
            dialog.hide();
            return false;
        }
    }];
    var mobileActions = [];
    if(oui.os.mobile){
        actions = mobileActions = [actions[1],actions[0]];
    }
    var dialog = oui.getTop().oui.showUrlDialog({
        url: url,
        isHideHeader: true,
        isHideFooter: false,
        isShowClose: true,
        isClose: true,
        useIFrame:true,
        workflowJSON:cfg.workflowJSON||"",
        actions:actions
    });
};
//给模板引擎添加oui调用助手
(function (template) {
    template && template.helper("oui", oui);
})(template);

(function(){
    /**
     * 事件机制
     * @type {{events: {}, on: _OuiEvent.on, trigger: _OuiEvent.trigger, off: _OuiEvent.off}}
     */
    var _OuiEvent = {
        //事件缓存对象
        events: {},
        /**
         * 绑定事件方法
         * @param eventName 事件名称
         * @param evenFunc 事件具体函数
         */
        on: function (eventName, evenFunc) {
            if (evenFunc && (typeof evenFunc == 'function')) {
                if (!_OuiEvent.events[eventName]) {
                    _OuiEvent.events[eventName] = [];
                }
                _OuiEvent.events[eventName].push(evenFunc);
            }
        },
        /**
         * 触发事件方法
         * @param eventName 事件名称
         */
        trigger: function (eventName) {
            var args = arguments;
            if (args.length >= 1) {
                if (args.length > 1) {
                    args = [].prototype.slice.call(args);
                    args = args.slice(1, args.length);
                }
                var events = _OuiEvent.events[eventName];
                if (events && events.length > 0) {
                    for (var i = 0, len = events.length; i < len; i++) {
                        var eventFunc = events[i];
                        if (eventFunc && (typeof eventFunc == 'function')) {
                            eventFunc.apply(eventFunc, args);
                        }
                    }
                }
            }
        },
        /**
         * 解除事件绑定
         * @param eventName 事件方法
         * @param eventFunc 具体事件，如果不传则取消所有相同事件名的事件
         */
        off: function (eventName, eventFunc) {
            if (_OuiEvent.events[eventName]) {
                var events = _OuiEvent.events[eventName];
                if (eventFunc) {
                    var eventFuncIndex = -1;
                    for (var i = 0, len = events.length; i < len; i++) {
                        if (events[i] == eventFunc) {
                            eventFuncIndex = i;
                            break;
                        }
                    }
                    if (eventFuncIndex > -1) {
                        events.splice(eventFuncIndex, 1);
                    }
                    _OuiEvent.events[eventName] = events;
                } else {
                    _OuiEvent.events[eventName] = [];
                }
            }
        }
    };

    //获取当前页面的event对象
    oui.getEvent = function(){
        var NS = oui.getNS();
        if(NS._event__){
            return NS._event__;
        } else {
            NS._event__ = _OuiEvent;
            return NS._event__;
        }
    };
})();

