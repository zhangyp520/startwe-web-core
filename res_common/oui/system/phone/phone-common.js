/*切图组件*/
(function () {
    oui.showCutImg = function (options) {
        var controlId = oui.getUUIDLong();
        var outerHtml = '<oui-cutimg showType="0"></oui-cutimg>';
        var props = 'id,cropBoxResizable,boxWidth,boxHeight,showPreview,panelStyle,imgSource,isHigh'.split(',');
        var $outer = oui.getTop().$(outerHtml);
        for (var i = 0, len = props.length; i < len; i++) {
            var key = props[i];
            var v = options[key] || "";
            $outer.attr(key, v);
        }

        var confirmFun = options.confirm || function () {
            };
        if (confirmFun && (typeof confirmFun === 'string')) {
            confirmFun = eval(confirmFun);
        }
        oui.setPageParam('tempfun_confirm_' + controlId, function (base64, boxData, o) {
            confirmFun && confirmFun(base64, boxData, o);
            var el = o.getEl();
            oui.getTop().oui.clearByOuiId(controlId);
            oui.getTop().$(el).remove();
        });

        var cancelFun = options.cancel || function () {
            };
        if (cancelFun && (typeof cancelFun === 'string')) {
            cancelFun = eval(cancelFun);
        }
        oui.setPageParam('tempfun_cancel_' + controlId, function (o) {
            cancelFun && cancelFun(o);
            var el = o.getEl();
            oui.getTop().oui.clearByOuiId(controlId);
            oui.getTop().$(el).remove();
        });
        $outer.attr('confirm', 'oui.getPageParam("tempfun_confirm_' + controlId + '")');
        $outer.attr('cancel', 'oui.getPageParam("tempfun_cancel_' + controlId + '")');
        $outer.attr('id', controlId);
        $(document.body).append($outer);
        $outer = $("#"+controlId);
        oui.parseByDom($outer[0]);
    };

})();
/*上传文件 相关 移动端*/
(function () {

    var FileStatus = {
        WAITE_UPLOAD: 0,//等待上传
        UPLOAD_SUCCESS: 1,//上传完成并成功
        CHOOSE_ERROR: 2,//选择的文件不符合设置规范
        UPLOAD_ERROR: -1//上传错误
    };

    var FileUpload = function (cfg) {

        template.helper("FileStatus", FileStatus);

        var _cfg = {
            postParam: {},//上传时 服务器需要的额外参数
            fileSizeLimit: (oui.uploadConfig && oui.uploadConfig.defaultFileSizeLimit) || "5 M",//单个文件大小限制
            fileTypes: "*.*",//文件类型限制，多余的用;分开
            showType: 0,//上传组件类型，0：上传附件，1：上传图片
            camera: false,//图片只能使用照相机获取，camera,只有在imgUpload为true是生效
            useBase64: false,//TODO
            isSingle: false,//单个上传的时候 不需要使用 第三方的接口
            onlyUseInput: false,//是否只使用input type=file
            fileUploadLimit: 1,//文件上传多个限制，多个使用第三方接口,如果不能使用第三方接口则还是单个文件上传
            fileNameMaxLength: 100,//文件名称长度限制
            cutImg: false,//是否裁剪
            success: null,
            // progress: null,
            error: null
        };
        //重载参数
        cfg = $.extend(true, {}, _cfg, cfg);

        if (cfg.isSingle) {//拍照上传也只能一张一张上传
            cfg.fileUploadLimit = 1;
        }
        cfg.imgUpload = cfg.showType + '' === '1';
        this.cfg = cfg;
        this.chooseFile();
    };

    FileUpload.templateHtml =
        '<div id="upload4phonePreviewMulti" class="upload-multi-cnt">' +
        '   <div class="upload-multi-area">' +
        '   </div>' +
        '</div>';

    FileUpload.itemAddHtml =
        '<div class="upload-multi-item upload-multi-item-add">' +
        '   <div class="more-image"></div>' +
        '</div>';

    FileUpload.templateHtml4Item =
        '{{each data as item index}}' +
        '<div class="upload-multi-item" cacheId="{{item.uuid }}" id="preview_item_{{item.uuid}}">' +
        '   <div class="image-placeholder" style="width: 0;"></div>' +
        '   <i class="upload-multi-info">' +
        '   {{if item.status === FileStatus.UPLOAD_SUCCESS}}' +
        '   上传完成' +
        '   {{else if item.status === FileStatus.WAITE_UPLOAD}}' +
        '   等待上传' +
        '   {{else if item.status === FileStatus.CHOOSE_ERROR}}' +
        '   文件不符合规范' +
        '   {{else if item.status === FileStatus.UPLOAD_ERROR}}' +
        '   上传错误' +
        '   {{/if}}' +
        '   </i>' +
        '   <img id="previewId_{{item.uuid}}" class="compose-image"/>' +
        '   <i class="del-image-btn">' +
        '       <svg data-v-8edeee54="" viewBox="0 0 46 72" class="del-btn-icon">' +
        '           <path data-v-8edeee54="" d="M27.243 36l14.88-14.88c1.17-1.17 1.17-3.07 0-4.24-1.172-1.173-3.072-1.173-4.243 0L23 31.757 8.122 16.878c-1.17-1.17-3.07-1.17-4.242 0-1.172 1.172-1.172 3.072 0 4.243L18.758 36 3.878 50.88c-1.17 1.17-1.17 3.07 0 4.24.587.587 1.355.88 2.123.88s1.536-.293 2.122-.88L23 40.243l14.88 14.88c.585.585 1.353.878 2.12.878.768 0 1.535-.293 2.12-.88 1.173-1.17 1.173-3.07 0-4.24L27.244 36z"></path>' +
        '       </svg>' +
        '   </i>' +
        '   {{if cfg.cutImg && (item.status === FileStatus.WAITE_UPLOAD)}}' +
        '   <i class="edit-image-btn">编辑</i>' +
        '   {{/if}}' +
        '</div>' +
        '{{/each}}' +
        '{{if !noAddBtn && data && data.length < cfg.fileUploadLimit}}' +
        '   <div class="upload-multi-item upload-multi-item-add">' +
        '       <div class="more-image"></div>' +
        '   </div>' +
        '{{/if}}';

    var picFileType = '*.jpg;*.png;*.gif;*.jpeg;*.bmp';
    var picReg = new RegExp('(\.|\/)(' + picFileType.split(';').join('|').replace(/\*\./ig, '') + ')$', 'ig');

    FileUpload.prototype = {
        files: [],
        uuid: 0,
        _findFileByUUId: function (uuid) {
            var self = this,
                files = self.files;
            if (files && files.length > 0) {
                var file = null;
                for (var i = 0, len = files.length; i < len; i++) {
                    file = files[i];
                    if (file.uuid + '' === uuid + '') {
                        return file;
                    }
                }
            }
            return null;
        },
        _removeFileByUUId: function (uuid) {
            var self = this,
                files = self.files;
            if (files && files.length > 0) {
                var file = null;
                for (var i = 0, len = files.length; i < len; i++) {
                    file = files[i];
                    if (file.uuid + '' === uuid + '') {
                        files.splice(i, 1);
                        return;
                    }
                }
            }
        },
        createFileObj: function (files) {
            var self = this;
            var fs = [];
            for (var i = 0, len = files.length; i < len; i++) {
                self.uuid++;
                fs.push({
                    uuid: self.uuid,
                    status: FileStatus.WAITE_UPLOAD,
                    fileData: files[i]
                });
            }
            return fs;
        },
        checkFile: function (fileObj) {
            var cfg = this.cfg;
            if (!fileObj) {
                oui.toast("文件不存在");
                return false;
            }

            var fileName = fileObj.name || '';
            if (fileName.indexOf(".") < 0) {
                oui.toast("上传文件命名需要后缀名");
                return false;
            }

            if (fileName.length !== 0 && fileName.length > cfg.fileNameMaxLength) {
                oui.toast("上传文件名超出" + cfg.fileNameMaxLength + "个字符,请修改文件名后上传!");
                return false;
            }

            if (cfg.imgUpload) {
                if ((!/image\/\w+/.test(fileObj.type) || !fileName.match(picReg))) {
                    oui.toast("上传文件类型不符");
                    return false;
                }
            } else if (cfg.fileTypes !== '*.*') {
                var fileReg = new RegExp('(\.|\/)(' + cfg.fileTypes.split(';').join('|').replace(/\*\./ig, '') + ')$', 'ig');
                if (!fileName.match(fileReg)) {
                    oui.toast("上传文件类型不符");
                    return false;
                }
            }

            //将MB 等转化为 字节长度 用于比较
            var fileSizeLimit = oui.fileSize2Byte(cfg.fileSizeLimit);
            var fileSize = fileObj.size || 0;
            if (fileSize > fileSizeLimit) {
                oui.toast('上传文件大小超过' + cfg.fileSizeLimit + '限制，请重新选择上传!');
                return false;
            }
            return true;
        },
        //选择文件
        chooseFile: function () {
            var self = this,
                cfg = self.cfg;
            if (cfg.imgUpload) {//只允许图片上传并且
                if (!cfg.onlyUseInput) {//如果允许使用端的选择
                    self._chooseImage(cfg, function (files) {
                        files = self.createFileObj(files);
                        self.files = [].concat(files);
                        if (self.files.length > cfg.fileUploadLimit) {
                            files = self.files = self.files.slice(0, cfg.fileUploadLimit);
                        }
                        // if (cfg.fileUploadLimit > 1) {
                        self._previewImg4Multi(files);
                        // } else {//单图上传
                        //     self._previewImg4Single(files);
                        // }
                    });
                    return;
                }
            }
            //附件上传
            self._createInput(function (files) {//文件选择，也不存在多文件，不存在预览，直接上传
                files = self.createFileObj(files);
                if (files && files.length > 0) {
                    self.files = [].concat(files);
                    if (self.files.length > 1) {
                        files = self.files = self.files.slice(0, 1);
                    }
                    var file = files[0];
                    //TODO IOS端图片需要旋转
                    self._doUpload4Single(file, function () {
                        self.ok();
                    }, function () {

                    });
                }
            });
        },
        _chooseImage: function (cfg, success, error) {
            var self = this;
            oui.chooseImage({
                camera: cfg.camera,
                fileUploadLimit: cfg.camera ? 1 : cfg.fileUploadLimit || 1//拍照上次只能取1
            }, function (result) {
                if (result === 'none') {//没有用端的选图片接口
                    self._createInput(function (files) {
                        success(files);
                    });
                } else {
                    success(result);
                }
            });
        },
        _createInput: function (success) {
            var self = this,
                cfg = self.cfg,
                accept = "*",
                capture = "";
            if (cfg.imgUpload) {//只允许图片上传
                accept = "image/*";
                if (cfg.camera) {//如果图片只能从拍照
                    capture = " capture='camera' ";
                }
            }
            // " + ((!oui.os.mobile && cfg.fileUploadLimit > 1) ? 'multiple' : '') + "
            var $input = $('<input type="file" ' + capture + ' accept="' + accept + '" />');
            $input.on("change", function () {
                var files = this.files;
                if (files.length > 0) {
                    var newFiles = [];
                    var file = null;
                    var fileName = null;
                    for (var i = 0, len = files.length; i < len; i++) {
                        file = files[i];
                        fileName = file.name;
                        if (fileName + '' !== "/") {//FIXME 安卓手机拍照点击取消 返回 "/"
                            newFiles.push(file);
                        }
                    }
                    success(newFiles);
                } else {
                    //success([]);
                }
            });
            $input.click();
        },
        _bindPreviewAreaEvents: function () {
            var self = this,
                $preview = self.$preview,
                cfg = self.cfg;
            $preview.find(".upload-multi-area").off("tap", ".more-image").on("tap", ".more-image", function () {
                var $previewAddItem = $(this).parent();
                var uploadFileLimit = (cfg.fileUploadLimit - self.files.length) || 1;
                self._chooseImage({
                    camera: cfg.camera,
                    fileUploadLimit: uploadFileLimit
                }, function (files) {
                    files = self.createFileObj(files);
                    if (files.length > uploadFileLimit) {
                        files = files.slice(0, uploadFileLimit);
                    }
                    self.files = self.files.concat(files);
                    self._previewImg4Multi(files, true);
                    if (cfg.fileUploadLimit <= self.files.length) {
                        $previewAddItem.remove();
                    }
                });
                return false;
            });

            $preview.find(".upload-multi-area").off("tap", ".edit-image-btn").on("tap", ".edit-image-btn", function () {
                var $previewItem = $(this).closest(".upload-multi-item");
                var uuid = $previewItem.attr("cacheId");
                var file = self._findFileByUUId(uuid);
                if (cfg.cutImg) {//如果允许裁剪图片
                    oui.showCutImg({
                        isHigh: true,
                        imgSource: file.fileBase64Data,
                        confirm: function (base64Data, box, cutImg) {
                            var sourceFile = file.fileData;
                            file.fileBase64Data = base64Data;
                            file.fileData = oui.getBlob(base64Data);
                            file.fileData.name = sourceFile.name;
                            $previewItem.find("img").attr("src", base64Data);
                            //校验文件
                            if (self.checkFile(file.fileData)) {
                                file.status = FileStatus.WAITE_UPLOAD;
                            } else {
                                file.status = FileStatus.CHOOSE_ERROR;
                                $previewItem.find(".upload-multi-info").html("文件不符合规范");
                            }
                        },
                        cancel: function () {
                        }
                    });
                }
            });
            $preview.find(".upload-multi-area").off("tap", ".del-image-btn").on("tap", ".del-image-btn", function () {
                var $previewItem = $(this).closest(".upload-multi-item");
                var uuid = $previewItem.attr("cacheId");
                self._removeFileByUUId(uuid);
                $previewItem.remove();//是否需要setTimeout呢?
                if (cfg.fileUploadLimit > self.files.length && $preview.find(".upload-multi-area").find(".upload-multi-item-add").length <= 0) {
                    $preview.find(".upload-multi-area").append(FileUpload.itemAddHtml);
                }
                return false;
            });
            self.eventLoad = true;
            //}
        },
        _previewImg4Single: function (files) {
            var self = this;
            var cfg = self.cfg;
            var cutImg = cfg.cutImg;
            var file = null;
            if (files && files.length > 0) {
                file = files[0];
            }
            if (!file) {
                return;
            }
            //校验文件
            if (self.checkFile(file.fileData)) {
                file.status = FileStatus.WAITE_UPLOAD;
            } else {
                file.status = FileStatus.CHOOSE_ERROR;
                return;
            }

            if (cutImg) {
                if (file.status === FileStatus.WAITE_UPLOAD) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file.fileData);
                    fileReader.onload = function (e) {
                        file.fileBase64Data = e.target.result;
                        oui.showCutImg({
                            imgSource: file.fileBase64Data,
                            confirm: function (base64Data, box, cutImg) {
                                var sourceFile = file.fileData;
                                file.fileBase64Data = base64Data;
                                file.fileData = oui.getBlob(base64Data);
                                file.fileData.name = sourceFile.name;
                                self._doUpload4Single(file, function () {
                                    self.ok();
                                }, function () {
                                    self.error();
                                });
                            },
                            cancel: function () {
                            }
                        });
                    };
                } else {
                    self.error();
                }
            } else {
                self._doUpload4Single(file, function () {
                    self.ok();
                }, function () {
                    self.error();
                });
            }
        },
        _previewImg4Multi: function (files, isAdd) {
            var self = this;
            if (!self.$previewDialog) {
                self.$previewDialog = oui.getTop().oui.showHTMLDialog({
                    content: FileUpload.templateHtml,
                    center: false,
                    isClose: false,
                    actions: [
                        {
                            text: "取消",
                            action: function () {
                                self.$previewDialog.hide();
                                return false;
                            }
                        },
                        {
                            text: "确定",
                            action: function () {
                                self._previewOk(function () {
                                    self.ok();
                                    self.$previewDialog.hide();
                                });
                                return false;
                            }
                        }
                    ]
                });
                self.$preview = $(self.$previewDialog.getEl()).find("#upload4phonePreviewMulti");
                var cfg = self.cfg;
                if (cfg.fileUploadLimit >= 3) {
                    self.$preview.find(".upload-multi-area").addClass("upload-multi-3");
                } else if (cfg.fileUploadLimit > 0) {
                    self.$preview.find(".upload-multi-area").addClass("upload-multi-" + cfg.fileUploadLimit);
                } else {
                    self.$preview.find(".upload-multi-area").addClass("upload-multi-1");
                }
                self._bindPreviewAreaEvents();
            }
            if (!self._previewItemRender) {
                self._previewItemRender = template.compile(FileUpload.templateHtml4Item);
            }
            var i, len;
            for (i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                if (self.checkFile(file.fileData)) {
                    file.status = FileStatus.WAITE_UPLOAD;
                } else {
                    file.status = FileStatus.CHOOSE_ERROR;
                }
            }
            var html = self._previewItemRender({
                data: files,
                cfg: self.cfg,
                noAddBtn: !!isAdd
            });
            if (isAdd) {
                self.$preview.find(".upload-multi-item-add").before(html);
            } else {
                self.$preview.find(".upload-multi-area").html(html);
            }

            for (i = 0, len = files.length; i < len; i++) {
                (function (i) {
                    var file = files[i];
                    if (file.status === FileStatus.WAITE_UPLOAD) {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file.fileData);
                        fileReader.onload = function (e) {
                            file.fileBase64Data = e.target.result;
                            self.$preview.find(".upload-multi-area").find("#previewId_" + file.uuid).attr("src", e.target.result);
                        };
                    }
                })(i);
            }
        },
        /**
         * 预览提交
         * @private
         */
        _previewOk: function (callback) {
            var self = this,
                files = self.files,
                i, len;
            var newFiles = files.concat();
            if (!newFiles || newFiles.length <= 0) {
                return;
            }
            var file = null;
            var _p = oui.progress("上传中...");

            var count = newFiles.length;
            var errorCount = 0;
            for (i = 0, len = newFiles.length; i < len; i++) {
                file = newFiles[i];
                (function (files, file, i) {
                    if (file.status !== FileStatus.WAITE_UPLOAD) {
                        count--;
                        errorCount++;
                        if (count === 0) {
                            if (_p) {
                                _p.finish();
                            }
                        }
                        return;
                    }
                    var $previewItem = self.$preview.find("#preview_item_" + file.uuid);
                    self._doUpload(file.fileData,
                        function () {//uploadBefore
                            $previewItem.find(".upload-multi-info").html("上传中...");
                        }, function (data) {
                            if (data.success) {
                                files[i].status = FileStatus.UPLOAD_SUCCESS;
                                files[i].sData = oui.parseJson(data.msg);
                                count--;
                                if (count === 0) {
                                    if (_p) {
                                        _p.finish();
                                    }
                                    if (errorCount === 0) {
                                        callback && callback();
                                    }
                                }
                                $previewItem.find(".upload-multi-info").html("上传成功");
                                $previewItem.find(".edit-image-btn").remove();
                            } else {
                                files[i].status = FileStatus.UPLOAD_ERROR;
                                count--;
                                errorCount++;
                                if (count === 0) {
                                    if (_p) {
                                        _p.finish();
                                    }
                                }
                                $previewItem.find(".upload-multi-info").html("上传失败");
                                $previewItem.find(".edit-image-btn").remove();
                            }
                        }, function () {
                            files[i].status = FileStatus.UPLOAD_ERROR;
                            count--;
                            errorCount++;
                            if (count === 0) {
                                if (_p) {
                                    _p.finish();
                                }
                            }
                            $previewItem.find(".upload-multi-info").html("上传失败");
                            $previewItem.find(".edit-image-btn").remove();
                        }, function (per) {
                            $previewItem.find(".image-placeholder").css("width", per + "%");
                        });
                })(files, file, i);
            }
        },
        _doUpload4Single: function (file, callback, error) {
            var self = this;
            var _p = oui.progress("上传中...");
            self._doUpload(file.fileData,
                function () {//uploadBefore
                }, function (data) {
                    if (data.success) {
                        file.status = FileStatus.UPLOAD_SUCCESS;
                        file.sData = oui.parseJson(data.msg);
                        if (_p) {
                            _p.finish();
                        }
                        callback && callback();
                    } else {
                        file.status = FileStatus.UPLOAD_ERROR;
                        if (_p) {
                            _p.finish();
                        }
                        error && error();
                    }
                }, function () {
                    file.status = FileStatus.UPLOAD_ERROR;
                    if (_p) {
                        _p.finish();
                    }
                    error && error();
                }, function (per) {
                    _p = oui.progress(per + "%");
                });
        },
        _doUpload: function (file, uploadBefore, success, error, progress) {
            if (!file.name) {//图片
                file.name = oui.uuid(10) + ".jpeg";
            }
            var formData = new FormData();
            formData.append('file', file, file.name);
            uploadBefore();
            $.ajax({
                url: oui.uploadURL,
                type: 'POST',
                data: formData,
                dataType: "json",
                processData: false,
                contentType: false,
                //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener("progress", function (evt) {
                            var loaded = evt.loaded;     //已经上传大小情况
                            var tot = evt.total;      //附件总大小
                            var per = Math.floor(100 * loaded / tot);  //已经上传的百分比
                            progress(per);
                        }, false);
                        return xhr;
                    }
                },
                success: function (data) {
                    success(data);
                },
                error: function (e) {
                    error(e);
                }
            });
        },
        ok: function () {
            var self = this;
            var files = self.files;
            var file = null;
            var result = [];
            var cfg = self.cfg;
            var imageUpload = cfg.imgUpload;
            var useBase64 = cfg.useBase64;
            for (var i = 0, len = files.length; i < len; i++) {
                file = files[i];
                if (file.status === FileStatus.UPLOAD_SUCCESS) {
                    var sData = file.sData;//服务器返回结果

                    var previewUrl = sData.previewUrl;
                    if (imageUpload && useBase64) {//图片的处理
                        previewUrl = file.fileBase64Data;
                    }

                    result.push({
                        imgId: sData.id,
                        downloadUrl: sData.downloadUrl,
                        previewUrl: previewUrl,
                        success: true,
                        size: file.fileData.size || 0,
                        name: file.fileData.name,
                        clientFile: file.fileData
                    });
                }
            }
            var success = self.cfg.success;
            success && success(result);
        },
        error: function () {
            var self = this;
            var error = self.cfg.error;
            error && error();
        },
        cancel: function () {

        }
    };


    oui.uploadFile = oui.upload4html = function (cfg) {
        return new FileUpload(cfg);
    };

})(oui);


/**
 * @author oui
 * @date 2016/1/11 0011
 */
(function (_) {


    /**
     * 页面跳转到指定路径
     * @param url/pageURL(的key)
     * @param params
     * @param isReplace
     */
    _.go = function (url, params, isReplace) {
        if (!url) {
            return;
        }
        url = oui.addOuiParams4Url(url);
        if (params) {
            params = $.param(params);
            url = url + (url.indexOf("?") >= 0 ? "&" : "?") + params;
        }

        if (isReplace) {
            window.location.replace(url);
        } else {
            window.location.href = url;
        }
    };

    /**
     * 页面返回上一页
     */
    _.back = function () {
        window.history.back();
    };


    var _p = null;
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


    /* 图片上传旋转 start */
    // @param {string} img 图片的base64
    // @param {int} dir exif获取的方向信息
    // @param {function} next 回调方法，返回校正方向后的base64
    var getImgData = function (img, dir, next) {
        var image = new Image();
        image.onload = function () {
            var degree = 0, drawWidth, drawHeight, width, height;
            drawWidth = this.naturalWidth;
            drawHeight = this.naturalHeight;
            //以下改变一下图片大小
            var maxSide = Math.max(drawWidth, drawHeight);
            if (maxSide > 2048) {
                var minSide = Math.min(drawWidth, drawHeight);
                minSide = minSide / maxSide * 1024;
                maxSide = 1024;
                if (drawWidth > drawHeight) {
                    drawWidth = maxSide;
                    drawHeight = minSide;
                } else {
                    drawWidth = minSide;
                    drawHeight = maxSide;
                }
            }
            var canvas = document.createElement('canvas');
            canvas.width = width = drawWidth;
            canvas.height = height = drawHeight;
            var context = canvas.getContext('2d');
            //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
            switch (dir) {
                //iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree = 180;
                    drawWidth = -width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 90;
                    drawWidth = width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在上方
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    degree = 270;
                    drawWidth = -width;
                    drawHeight = height;
                    break;
            }
            //使用canvas旋转校正
            context.rotate(degree * Math.PI / 180);
            context.drawImage(this, 0, 0, drawWidth, drawHeight);
            //返回校正图片
            next(canvas.toDataURL("image/jpeg", 1));
        };
        image.src = img;
    };
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    var convertBase64UrlToBlob = function (urlData, type) {

        var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], $.extend({type: 'image/png'}, type || {}));
    };

    var uploadFile4Fix = function (options, callback) {
        var fileObj = options.file;
        var orientation;
        if (/image\/\w+/.test(fileObj.type)) {
            var render = null;
            EXIF.getData(fileObj, function () {
                orientation = EXIF.getTag(this, 'Orientation');
                if (orientation && orientation !== '1') {
                    render = new FileReader();
                    render.onload = function () {
                        getImgData(this.result, orientation, function (data) {
                            var newFile = $.extend(convertBase64UrlToBlob(data), fileObj);
                            callback && callback($.extend(options, {
                                file: newFile,
                                fileBase64: data
                            }));
                        });
                    };
                    render.readAsDataURL(fileObj);
                } else {
                    render = new FileReader();
                    render.onload = function () {
                        var _s = this;
                        callback && callback($.extend(options, {
                            fileBase64: _s.result
                        }));
                    };
                    render.readAsDataURL(fileObj);
                }
            });
        } else {
            callback && callback(options);
        }

    };

    /**
     * 文件上传
     * @param options
     */
    _.uploadFileForPhone = function (options) {

        uploadFile4Fix(options, function (options) {
            var _options = {
                url: _.uploadURL,
                file: null,
                useBase64: false,
                fileSizeLimit: oui.uploadConfig.defaultFileSizeLimit || "5 MB",
                fileNameMaxLength: 100,
                data: {},
                success: null,
                error: null,
                progress: null
            };

            $.extend(_options, options);

            var data;

            if (_options.file) {
                var fileSize = _options.file.size || 0;
                var fileName = _options.file.name || '';
                if (fileName.length <= 0 || fileName === "/") {//FIXME 安卓手机拍照点击取消 返回 "/"
                    _options.error && _options.error();
                    return;
                }
                if (fileName.indexOf(".") < 0) {
                    oui.toast("上传文件命名需要后缀名");
                    _options.error && _options.error();
                    return;
                }

                if (fileName.length > _options.fileNameMaxLength && fileName.length !== 0) {
                    oui.toast("上传文件名超出" + _options.fileNameMaxLength + "个字符,请修改文件名后上传!");
                    _options.error && _options.error();
                    return;
                }
                var fileSizeLimit = getFileSize(_options.fileSizeLimit);
                if (fileSize > fileSizeLimit) {
                    oui.toast('上传文件超过' + _options.fileSizeLimit + '限制，请重新选择上传!');
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
                oui.toast('您还没有选择上传文件哦！');
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
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (_options.progress && xhr.upload) {
                        xhr.upload.addEventListener("progress", _options.progress, false);
                        return xhr;
                    }
                },
                success: function (data) {
                    data = oui.parseJson(data);
                    var msg = data.msg;
                    msg = oui.parseJson(msg);
                    var previewUrl = msg.previewUrl;
                    if (_options.fileBase64 && _options.useBase64) {//图片的处理
                        previewUrl = _options.fileBase64;
                        msg.previewUrl = previewUrl;
                    }
                    msg.size = _options.file.size;
                    data.msg = oui.parseString(msg);
                    _options.success && _options.success(data);
                },
                error: function (e) {
                    _options.error && _options.error(e);
                }
            });
        });
    };

    /**
     * 将图片转成base64
     * @param url 图片地址
     * @param callback 成功回掉
     * @param outputFormat 输出格式
     */
    _.img2base64 = function (url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback && callback.call(this, dataURL);
            // Clean up
            canvas = null;
            img = null;
        };
        img.onerror = function () {
            callback();
            img = null;
        };
        img.src = url;
    }

})(oui);








