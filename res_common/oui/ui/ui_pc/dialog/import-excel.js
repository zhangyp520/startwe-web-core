!(function(win){

    var importExcelTpl =
        ''+
        '<div class=\"import-file\">'+
        '<div class=\"step-one\">'+
        '<div class=\"ouiFile-download\">'+
        '批量导入，您需要先'+
        '<button type=\"button\" download-url=\"{{downloadUrl}}\" onclick=\"oui.getPageParam_{{dialogViewId}}.downloadFile(this)\"  class=\"ouiFile-btn ouiFile-btn-download\">'+
        '<span>下载导入模板</span>'+
        '</button>'+
        '</div>'+
        '<button type=\"button\" class=\"ouiFile-import-file\">'+
        '<input id=\"fileupload\"  class=\"import-file-btn\" data-url=\"{{uploadURL}}\" accept=\"{{fileTypes}}\"  {{if !isSingle}}multiple=\"multiple\"{{/if}} type=\"file\" name=\"files[]\"  />'+
        '<span  onclick="oui.selectFile4Import(this);" ></span>'+
        ''+
        '<p  onclick="oui.selectFile4Import(this);"  >点击这里选择上传</p>'+
        '<p class=\"front-error-msg\"></p>'+
        '</button>'+
        '<div class=\"ouiFile-warn-info\">'+
        '<h3>温馨提示</h3>'+
        '<p>1.文件格式仅支持.xls或.xlsx</p>'+
        '<p>2.文件大小{{fileSizeLimit}}以内。每次导入行数不超过1000行</p>'+
        ''+
        '</div>'+
        '</div>'+
        ''+
        '<div class=\"step-two\" style=\"display: none\">'+
        '<ul class=\"ouiFile-load-file-list\">'+
        '<li class=\"ouiFile-load-file-item\">'+
        '<span class=\"icon\"></span>'+
        '<span class=\"file-name\"></span>'+
        '<span class=\"file-operation\" onclick=\"oui.getPageParam_{{dialogViewId}}.removeFile(this)\"></span>'+
        '</li>'+
        '</ul>'+
        '<div class=\"ouiFile-warn-info\">'+
        '<h3>温馨提示</h3>'+
        '<p>1.文件格式仅支持.xls或.xlsx</p>'+
        '<p>2.文件大小10M以内。每次导入行数不超过1000行</p>'+
        '</div>'+
        '</div>'+
        ''+
        '<div class=\"step-three\">'+
        '<div class=\"uploading\" style=\"display: none\">'+
        '<div class=\"ouiFile-importing\">'+
        '<span class=\"icon\"></span>'+
        '</div>'+
        '<div class=\"ouiFile-import-progress\">'+
        '<span class=\"ouiFile-import-active-progress\"></span>'+
        '</div>'+
        '<p class=\"ouiFile-importing-file\">'+
        '<span class=\"ouiFile-import-status ouiFile-import-ing\">正在上传'+
        '<span class=\"file-name\">xxx.xls</span>'+
        '</span>'+
        '</p>'+
        '</div>'+
        ''+
        '<div class=\"success\" style=\"display: none;\">'+
        '<div class=\"ouiFile-importing \">'+
        '<span class=\"icon\"></span>'+
        '</div>'+
        '<p class=\"ouiFile-importing-file\">'+
        '<span class=\"ouiFile-import-status ouiFile-import-success\">成功导入 <span class=\"file-name\">xxx.xls</span></span>'+
        '</p>'+
        '<p class=\"ouiFile-import-successData\">'+
        '成功导入员工数据180条'+
        '</p>'+
        '</div>'+
        ''+
        '<div class=\"fail\" style=\"display: none;\">'+
        '<div class=\"ouiFile-importing\">'+
        '<span class=\"icon\"></span>'+
        '</div>'+
        '<div class=\"ouiFile-import-progress\">'+
        '<span class=\"ouiFile-import-active-progress\"></span>'+
        '</div>'+
        '<p class=\"ouiFile-importing-file\">'+
        '<span class=\"ouiFile-import-status ouiFile-import-fail\">导入失败'+
        '<span class=\"file-name\">xxx.xls</span>'+
        '</span>'+
        '</p>'+
        '<p class=\"ouiFile-import-failData\">'+
        '导入失败，查看失败原因，点击'+
        '<button type=\"button\" onclick=\"oui.getPageParam_{{dialogViewId}}.downloadErrorFile(this)\" class=\"ouiFile-btn ouiFile-btn-download\"><span>下载</span></button>'+
        '</p>'+
        '</div>'+
        ''+
        '</div>'+
        '</div>'+
        '';
    oui.selectFile4Import=function(el){

        $(el).closest('.import-file').find('#fileupload').trigger('click');
    };
    /**
     * {
     *      uploadURL,
     *      downloadUrl, //下载excel的路径
     *      afterUploadUrl, //校验excel的路径 xxx.do?xxx&fileId=yyyy,失败返回{downloadUrl:'xxx'},成功返回{resultUrl:'xxx'} ==>查看消息返回 {msg:'xxx'}
     *  }
     * @param options
     */
    oui.showImportExcelDialog4Require = function(options){

        var UploadData = {
            newId:0,
            uploading:false,
            submitDatas:[],
            filesBase64:{}
        };
        var sessionId = oui_context.sessionId ||"";
        options =options || {};
        options.postParams= options.postParams || { sessionId:sessionId};
        //上传文件名的最大字符数限制(包含文件后缀名)
        /*if(!options.fileNameMaxLength){ //上传的文件名的最大字符数
         options.fileNameMaxLength=150;
         }else if(typeof options.fileNameMaxLength =='string'){
         options.fileNameMaxLength=parseInt(options.fileNameMaxLength);
         }*/
        if(!options.fileSizeLimit){
            //options.fileSizeLimit = '5 MB'; //默认不设置文件大小限制
        }
        if(!options.fileTypes){
            options.fileTypes = "*.*";
        }
        if(!options.fileUploadLimit){
            try{
                options.fileUploadLimit = (oui.uploadConfig.defaultFileUploadLimit); //默认文件限制
            }catch(e){}
        }
        if(options.fileInterceptor){
            options.postParams.fileInterceptor=options.fileInterceptor ;
        }

        var dialogViewId = oui.getUUIDLong();

        var tempOption={
            checkExcel:null,
            cls:'import-default',
            dialogViewId:dialogViewId,
            contentStyle: (options.contentStyle || 'width:600px;max-height:410px'),
            content:'<oui-view id="view-'+dialogViewId+'" data=\'oui.getPageParam(\"data_'+dialogViewId+'\")\'></oui-view>' +
                '<script type="text/html" id="view-'+dialogViewId+'-tpl">' +
                '' +importExcelTpl+
                '</script>',
            title:options.title || "导入Excel",
            callback:function(action){
                if(action=='close'){
                    //关闭时 清空缓存
                    oui.removePageParam('data_'+dialogViewId);
                    oui['getPageParam_'+dialogViewId]=null;
                    delete oui['getPageParam_'+dialogViewId];
                }

            },
            actions:[
                { cls:'oui-dialog-cancel',
                    text:"取消",
                    id:"upload-cancel",
                    action:function(){
                        if(UploadData.uploading){
                            return ;
                        }
                        UploadData.submitDatas.length =0;

                        upDialog&&upDialog.hide();
                        oui.removePageParam('data_'+dialogViewId);
                        oui['getPageParam_'+dialogViewId]=null;
                        delete oui['getPageParam_'+dialogViewId];
                    }
                },
                {text:"上传",
                    id:"upload-ok",
                    cls:'oui-dialog-ok',
                    action: function(){ //开始上传

                        if(UploadData.uploading){
                            return ;
                        }
                        var arr = UploadData.submitDatas;
                        if((!arr) ||(!arr.length)){
                            oui.alert('请选择文件Excel文件上传');
                            return ;
                        }
                        var startTime = new Date();
                        upDialog.attr('startTime',startTime);
                        upDialog.attr('uploading',true);
                        upDialog.attr({canNotClose:true});
                        upDialog.attr('successFiles',{});

                        UploadData.uploading = true;


                        var errorFiles = upDialog.attr('errorFiles');
                        if(!errorFiles){
                            errorFiles = [];
                            upDialog.attr('errorFiles',errorFiles);
                        }
                        if(errorFiles.length>0){ //存在错误文件不执行提交,必须要用户将错误文件剔除后再上传
                            return ;
                        }
                        $('.step-two',upDialog.getEl()).hide();
                        var fileName = $('.step-two',upDialog.getEl()).find('.file-name').html();
                        $('.step-three',upDialog.getEl()).find('.file-name').html(fileName);
                        $('.step-three',upDialog.getEl()).find('.uploading').show();
                        $('.step-three',upDialog.getEl()).find('.success').hide();
                        $('.step-three',upDialog.getEl()).find('.fail').hide();

                        /** 读取excel 判断是否太大****/
                        var runners = [];
                        var files = [];
                        oui.findManyFromArrayBy(arr,function(curr){
                            files = files.concat(curr.files);
                        });
                        var size = files.length;
                        upDialog.currentFileSize = size;
                        var submitFiles = function(arr,upDialog){
                            for(var i=0,len=arr.length;i<len;i++){
                                arr[i].submit();
                            }
                        };
                        upDialog.attr('selectedFiles',arr);
                        var readFileBack=function(results,upDialog){
                            upDialog.attr('excelResults',results);
                            //不管是否校验直接上传文件
                            var checkExcel = upDialog.attr('checkExcel');
                            if(checkExcel){
                                var flag = checkExcel(results,upDialog);
                                if(typeof flag =='boolean'){
                                    if(!flag){//校验失败,直接返回


                                        return ;
                                    }
                                }
                            }
                            var arr = upDialog.attr('selectedFiles')||[];
                            submitFiles(arr,upDialog);
                            //数据提交上限,上传文件
                            //if(data.length>=maxExcelDataLength){
                            //    //执行上传逻辑
                            //    submitFiles(arr,upDialog);
                            //}else{//数据post
                            //    afterUpload4data(results,upDialog);
                            //}
                        };
                        if(upDialog.attr('checkExcel')){
                            //需要校验，才解析excel
                            oui.findManyFromArrayBy(files,function(curr){
                                runners.push({
                                    file:curr,
                                    call:function(){
                                        var callme= this;
                                        oui.ExcelUtil.readFile(this.file,function(excelObject){
                                            callme.excelObject=excelObject;
                                            upDialog.currentFileSize--;
                                            if(upDialog.currentFileSize==0){
                                                //解析完成
                                                var result = [];
                                                oui.findManyFromArrayBy(runners,function(runnerTemp){
                                                    result.push({
                                                        isUploadFile:false,
                                                        clientFile:runnerTemp.file,
                                                        size:runnerTemp.file.size,
                                                        name:runnerTemp.file.name,
                                                        excelObject:runnerTemp.excelObject
                                                    });
                                                });
                                                readFileBack(result,upDialog);
                                            }
                                        });
                                    }
                                });
                            });
                            oui.findManyFromArrayBy(runners,function(currRunnerStart){
                                currRunnerStart.call();
                            });
                        }else{
                            //执行上传逻辑
                            submitFiles(arr,upDialog);
                        }
                    }
                },
                {
                    text:"继续导入",
                    id:"re-upload",
                    cls:'oui-dialog-ok import-success',
                    action: function(){ //
                        upDialog.reImport();
                    }
                },
                {
                    text:"重新导入",
                    id:"re-upload",
                    cls:'oui-dialog-ok import-fail',
                    action: function(){ //
                        upDialog.reImport();

                    }
                }
            ]
        };
        tempOption = $.extend(true,tempOption,options);
        var upDialog = oui.showHTMLDialog(tempOption);
        upDialog.reImport = function(){
            UploadData.uploading = false;
            UploadData.submitDatas=[];
            upDialog.attr('uploading',false);
            upDialog.attr({canNotClose:false});
            upDialog.attr('successFiles',{});
            var $fileupload = $('#fileupload',upDialog.getEl());
            $fileupload.val('');
            $( upDialog.getEl()).removeClass('import-success');
            $( upDialog.getEl()).removeClass('import-fail');
            $(upDialog.getEl()).addClass('import-default');
            $('.step-one',upDialog.getEl()).show();
            $('.step-three',upDialog.getEl()).find('.uploading').hide();
            $('.step-three',upDialog.getEl()).find('.success').hide();
            $('.step-three',upDialog.getEl()).find('.fail').hide();
        };//重新导入

        /**
         * 文件个数限制
         */
        var uploadLimitCheck = function(){
            var flag = true;
            var upDialog = this.upDialog;
            var maxLimit = upDialog.attr('fileUploadLimit'); //当前只能上传的附件数
            maxLimit = parseInt(maxLimit);
            var fileUploadMaxLimit = upDialog.attr('fileUploadMaxLimit');//上传总数限制
            if(maxLimit<0){
                maxLimit =0;
            }
            if(UploadData.submitDatas.length+1>maxLimit){
                window.parent.oui.alert('上传文件不能超过'+fileUploadMaxLimit+'个,还能上传'+maxLimit+'个');
                return false;
            }
            return flag;
        };
        var fileSizeLimit = upDialog.attr('fileSizeLimit')||'10 MB';
        upDialog.attr('fileSizeLimit',fileSizeLimit);
        var isSingle = upDialog.attr('isSingle');
        if(typeof isSingle !='boolean'){
            if(!isSingle){
                isSingle = true;
            }else {
                if(isSingle !='false'){
                    isSingle = true;
                }else{
                    isSingle = false;
                }
            }
        }
        upDialog.attr('isSingle',isSingle);

        var excelFileType ='*.xls;*.xlsx';
        var  excelReg = new RegExp('(\.|\/)('+excelFileType.split(';').join('|').replace(/\*\./ig,'')+')$','ig');

        var fileTypes = upDialog.attr('fileTypes')||excelFileType;
        upDialog.attr('fileTypes',fileTypes);


        var  acceptFileTypes = excelReg;
        var ignoreTypes = '*.exe;*.sh;*.bat;*.asp;*.jsp;*.php;*.cgi';
        var ignoreFileTypes = new RegExp('(\.|\/)('+ignoreTypes.split(';').join('|').replace(/\*\./ig,'')+')$','ig');
        if(fileTypes !='*.*'){
            acceptFileTypes = new RegExp('(\.|\/)('+upDialog.attr('fileTypes').split(';').join('|').replace(/\*\./ig,'')+')$','ig');
        }
        upDialog.attr('acceptFileTypes',acceptFileTypes);
        var fileCell = fileSizeLimit.split(' ').length==2 ?($.trim(fileSizeLimit.split(' ')[1])||'KB'):'KB';
        fileCell = fileCell.toLowerCase();
        var fileSizeLimitNumber = fileSizeLimit.split(' ')[0];

        switch(fileCell){
            case 'kb':
                fileSizeLimitNumber = parseInt(fileSizeLimitNumber)*1024;
                break;
            case 'mb':
                fileSizeLimitNumber = parseInt(fileSizeLimitNumber)*(1024*1024);
                break;
            case 'gb':
                fileSizeLimitNumber = parseInt(fileSizeLimitNumber)*(1024*1024*1024);
            default:
                fileSizeLimitNumber = parseInt(fileSizeLimitNumber)*(1024);
                break;
        }


        var maxFileSize = fileSizeLimitNumber;
        upDialog.attr('maxFileSize',maxFileSize);

        upDialog.attr('ignoreFileTypes',ignoreFileTypes);

        var fileNameMaxLength = upDialog.attr('fileNameMaxLength'); //文件名长度限制
        fileNameMaxLength = parseInt(fileNameMaxLength || '100');
        upDialog.attr('fileNameMaxLength',fileNameMaxLength);
        function removeFile(el){
            var newId = $(el).attr('new-id');
            var upDialog = this.upDialog;
            if(UploadData.uploading){
                return ;
            }
            var arr = UploadData.submitDatas;
            for(var i=0,len=arr.length;i<len;i++){
                if((''+newId)== $(arr[i]).attr('newId')){
                    arr.splice(i,1);
                }
            }
            var errorFiles = upDialog.attr('errorFiles');
            if(!errorFiles){
                errorFiles = [];
                upDialog.attr('errorFiles',errorFiles);
            }
            for(var j=0,elen = errorFiles.length;j<elen;j++){
                if((''+newId)== (errorFiles[j].newId+'')){
                    errorFiles.splice(j,1);
                }
            }
            $('.step-one',upDialog.getEl()).show();
            $('.step-two',upDialog.getEl()).hide();
            $(upDialog.getEl()).addClass('import-default');
        }

        /*****
         *
         * 下载错误反馈文件
         * @param el
         */
        function downloadErrorFile(el){
            var downLoadUrl = $(el).attr('download-url');
            if(downLoadUrl){
                oui.downloadFile(downLoadUrl);
            }
        }
        function downloadFile(el){
            var downLoadUrl = $(el).attr('download-url');
            if(downLoadUrl){
                oui.downloadFile(downLoadUrl);
            }
        }
        var downloadUrl = upDialog.attr('downloadUrl');//下载excel的模板路径
        var uploadUrl = upDialog.attr('uploadURL');//上传的url地址
        uploadUrl = uploadUrl || oui.uploadURL;
        oui.setPageParam('data_'+dialogViewId,{
            maxFileSize:maxFileSize,
            downloadUrl:downloadUrl,
            isSingle:isSingle,
            fileTypes:fileTypes,
            dialogViewId:dialogViewId,
            upDialog:upDialog,
            uploadURL: uploadUrl,
            fileSizeLimit:fileSizeLimit,
            fileNameMaxLength:fileNameMaxLength,
            uploadLimitCheck:uploadLimitCheck,
            downloadErrorFile:downloadErrorFile,
            downloadFile:downloadFile,
            removeFile:removeFile,
            UploadData:UploadData
        });
        oui['getPageParam_'+dialogViewId] =  oui.getPageParam('data_'+dialogViewId);

        /***
         * 数据上传回调
         * @param result
         */
        function afterUpload4data(result,upDialog){
            var afterUploadUrl = upDialog.attr('afterUploadUrl');
            if(afterUploadUrl){
                oui.postData(afterUploadUrl,{
                    excelData:result[0].excelObject.getData4ListMap()
                },function(res){
                    if(res.success){
                        var msg = oui.parseJson(res.msg);
                        if(msg.downLoadUrl){ //导入失败返回
                            $(upDialog.getEl()).addClass('import-fail');//校验失败
                            $('.step-three',upDialog.getEl()).find('.fail').find('.ouiFile-import-failData').find('button').attr('download-url',msg.downLoadUrl)
                            $('.step-three',upDialog.getEl()).find('.uploading').hide();
                            $('.step-three',upDialog.getEl()).find('.success').hide();
                            $('.step-three',upDialog.getEl()).find('.fail').show();
                        }else{

                            if(msg.resultUrl){
                                oui.progress("数据进入队列，处理中...");
                                setTimeout(function(){
                                    oui.progress.hide();
                                    oui.getData(msg.resultUrl,{},function(resmsg){
                                        if(resmsg.success){
                                            var resultMsg = resmsg.msg;
                                            $(upDialog.getEl()).addClass('import-success');//上传成功,等待消息返回
                                            $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                            $('.step-three',upDialog.getEl()).find('.fail').hide();
                                            $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html(resultMsg||"导入成功");
                                            $('.step-three',upDialog.getEl()).find('.success').show();
                                            oui.progress.hide();
                                        }else{
                                            //消息还没有入库
                                            $(upDialog.getEl()).addClass('import-success');//上传成功,等待消息返回
                                            $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                            $('.step-three',upDialog.getEl()).find('.fail').hide();
                                            $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html("数据进入队列，暂时看不到导入结果");
                                            $('.step-three',upDialog.getEl()).find('.success').show();
                                            oui.progress.hide();
                                        }

                                    },'数据进入队列，处理中',function(msg){
                                        oui.getTop().oui.alert(msg);
                                    });

                                },5*1000);
                            }else{
                                $(upDialog.getEl()).addClass('import-success');//上传成功,等待消息返回
                                $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                $('.step-three',upDialog.getEl()).find('.fail').hide();
                                $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html(msg.successMsg||"导入成功");
                                $('.step-three',upDialog.getEl()).find('.success').show();
                            }
                            upDialog.attr('completeSuccess')&& upDialog.attr('completeSuccess')(result,upDialog);

                        }
                    }else{
                        oui.getTop().oui.alert(res.msg||'导入失败');
                        oui.progress.hide();
                        $(upDialog.getEl()).addClass('import-fail');//上传失败
                        $('.step-three',upDialog.getEl()).find('.uploading').hide();
                        $('.step-three',upDialog.getEl()).find('.success').hide();
                        $('.step-three',upDialog.getEl()).find('.fail').show();
                    }
                },function(res){
                    oui.getTop().oui.alert(res);
                },'导入中');

            }else{
                oui.progress.hide();
                $(upDialog.getEl()).addClass('import-success');//上传成功
                $('.step-three',upDialog.getEl()).find('.uploading').hide();
                $('.step-three',upDialog.getEl()).find('.fail').hide();
                $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html("上传成功");
                $('.step-three',upDialog.getEl()).find('.success').show();
                upDialog.attr('completeSuccess')&& upDialog.attr('completeSuccess')(result,upDialog);
            }
        }
        /****
         * 文件上传回调
         * @param result
         */
        function afterUpload4file(result,upDialog){
            var excelResults = upDialog.attr('excelResults')||[];
            if(excelResults.length){
                oui.findManyFromArrayBy(excelResults,function(item,idx){
                    result[idx].excelObject= item.excelObject;
                });
            }
            var afterUploadUrl = upDialog.attr('afterUploadUrl');
            if(afterUploadUrl){
                oui.postData(afterUploadUrl,{
                    excelFileId:result[0].fileId
                },function(res){
                    if(res.success){
                        var msg = oui.parseJson(res.msg);
                        if(msg.downLoadUrl){ //导入失败返回
                            $(upDialog.getEl()).addClass('import-fail');//校验失败
                            $('.step-three',upDialog.getEl()).find('.fail').find('.ouiFile-import-failData').find('button').attr('download-url',msg.downLoadUrl)
                            $('.step-three',upDialog.getEl()).find('.uploading').hide();
                            $('.step-three',upDialog.getEl()).find('.success').hide();
                            $('.step-three',upDialog.getEl()).find('.fail').show();
                        }else{
                            if(msg.resultUrl){
                                oui.progress("数据进入队列，处理中...");
                                setTimeout(function(){
                                    oui.progress.hide();
                                    oui.getData(msg.resultUrl,{},function(resmsg){
                                        if(resmsg.success){
                                            var resultMsg = resmsg.msg;
                                            $(upDialog.getEl()).addClass('import-success');//上传成功,等待消息返回
                                            $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                            $('.step-three',upDialog.getEl()).find('.fail').hide();
                                            $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html(resultMsg||"导入成功");
                                            $('.step-three',upDialog.getEl()).find('.success').show();
                                            oui.progress.hide();
                                        }else{
                                            //消息还没有入库
                                            $(upDialog.getEl()).addClass('import-success');//上传成功,等待消息返回
                                            $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                            $('.step-three',upDialog.getEl()).find('.fail').hide();
                                            $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html("数据进入队列，暂时看不到导入结果");
                                            $('.step-three',upDialog.getEl()).find('.success').show();
                                            oui.progress.hide();
                                        }

                                    },'数据进入队列，处理中',function(msg){
                                        oui.getTop().oui.alert(msg);
                                    });

                                },5*1000);
                            }else{
                                $(upDialog.getEl()).addClass('import-success');//上传成功,等待消息返回
                                $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                $('.step-three',upDialog.getEl()).find('.fail').hide();
                                $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html(msg.successMsg||"导入成功");
                                $('.step-three',upDialog.getEl()).find('.success').show();
                            }
                            upDialog.attr('completeSuccess')&& upDialog.attr('completeSuccess')(result,upDialog);
                        }
                    }else{
                        oui.getTop().oui.alert(res.msg||'导入失败');
                        oui.progress.hide();
                        $(upDialog.getEl()).addClass('import-fail');//上传失败
                        $('.step-three',upDialog.getEl()).find('.uploading').hide();
                        $('.step-three',upDialog.getEl()).find('.success').hide();
                        $('.step-three',upDialog.getEl()).find('.fail').show();
                    }
                },function(res){
                    oui.getTop().oui.alert(res);
                },'导入中');

            }else{
                oui.progress.hide();
                $(upDialog.getEl()).addClass('import-success');//上传成功
                $('.step-three',upDialog.getEl()).find('.uploading').hide();
                $('.step-three',upDialog.getEl()).find('.fail').hide();
                $('.step-three',upDialog.getEl()).find('.success').find('.ouiFile-import-successData').html("上传成功");
                $('.step-three',upDialog.getEl()).find('.success').show();
                upDialog.attr('completeSuccess')&& upDialog.attr('completeSuccess')(result,upDialog);
            }
        }
        oui.parse({
            callback:function(){
                oui.require([oui.getContextPath()+'res_common/third/jQuery-File-Upload-8.8.5/js/vendor/jquery.ui.widget.js',
                    oui.getContextPath()+'res_common/third/jQuery-File-Upload-8.8.5/js/jquery.iframe-transport.js',
                    oui.getContextPath()+'res_common/third/jQuery-File-Upload-8.8.5/js/jquery.fileupload.js',
                    oui.getContextPath()+'res_common/third/jQuery-File-Upload-8.8.5/js/jquery.fileupload-process.js',
                    oui.getContextPath()+'res_common/third/jQuery-File-Upload-8.8.5/js/jquery.fileupload-validate.js',
                    oui.getContextPath()+'res_common/third/jQuery-File-Upload-8.8.5/js/jquery.fileupload-image.js'
                ],function(){
                    var $fileupload = $('#fileupload',upDialog.getEl());
                    $fileupload.attr('accept',upDialog.attr('fileTypes'));
                    $fileupload.fileupload({
                        dataType: 'json',
                        //maxFileSize: upDialog.attr('fileSizeLimit'),
                        autoUpload: true,
                        acceptFileTypes: upDialog.attr('acceptFileTypes'),
                        formData:upDialog.attr('postParams'),
                        onchange:function(e,data){
                            alert('changefile ');
                        },
                        add: function (e, data) {

                            $('.ouiFile-import-active-progress',upDialog.getEl()).css('width','0px');

                            $('.ouiFile-import-file',upDialog.getEl()).removeClass('ouiFile-import-file-error');

                            if(upDialog.attr('isSingle')){
                                UploadData.submitDatas = [data];
                            }else{
                                UploadData.submitDatas.push(data);
                            }

                            UploadData.newId++;
                            var newId = UploadData.newId;
                            $(data).attr('newId',UploadData.newId);
                            var fileNameMaxLength = upDialog.attr('fileNameMaxLength'); //文件名长度限制
                            var errorFiles = upDialog.attr('errorFiles');
                            if(!errorFiles){
                                errorFiles = [];
                                upDialog.attr('errorFiles',errorFiles);
                            }else{
                                errorFiles = [];
                                upDialog.attr('errorFiles',errorFiles);
                            }
                            fileNameMaxLength = parseInt(fileNameMaxLength || '100');
                            var maxFileSize = upDialog.attr('maxFileSize');
                            var fileName = '';
                            $.each(data.files, function (index, file) {
                                var error_msg ='';

                                var ignoreFileTypes = upDialog.attr('ignoreFileTypes');
                                var acceptFileTypes= upDialog.attr('acceptFileTypes');
                                var isIgnoreFile = file.name &&file.name.match(ignoreFileTypes);
                                if(((file.name &&acceptFileTypes)&& (!file.name.match(acceptFileTypes))) || isIgnoreFile){

                                    if(upDialog.attr('isSingle')){
                                        errorFiles[0] = {newId:newId,file:file};
                                    }else{
                                        errorFiles.push({newId:newId,file:file});
                                    }
                                    if(isIgnoreFile){
                                        error_msg ="文件不能为可执行程序，请重新选择"+upDialog.attr('fileTypes')+"的文件上传";
                                    }else{
                                        error_msg ="文件类型不匹配，请重新选择"+upDialog.attr('fileTypes')+"的文件上传";
                                    }

                                }else if(file.size && file.size> maxFileSize){

                                    if(upDialog.attr('isSingle')){
                                        errorFiles[0] = {newId:newId,file:file};
                                    }else{
                                        errorFiles.push({newId:newId,file:file});
                                    }
                                    error_msg ="文件超过"+upDialog.attr('fileSizeLimit');
                                }else if(upDialog.attr('isSingle')){
                                    errorFiles.length=0;
                                    upDialog.attr('errorFiles',errorFiles);
                                }
                                fileName = file.name;
                                var pageParam = oui.getPageParam('data_'+upDialog.attr('dialogViewId'));
                                pageParam.errorMsg = error_msg;
                                if(error_msg){
                                    $('.front-error-msg',upDialog.getEl()).html(error_msg);
                                }
                            });
                            if(errorFiles&&errorFiles.length){
                                $('.ouiFile-import-file',upDialog.getEl()).addClass('ouiFile-import-file-error');
                                $(upDialog.getEl()).addClass('import-default');
                                return ;
                            }else{
                                $('.ouiFile-import-file',upDialog.getEl()).removeClass('ouiFile-import-file-error');
                                $(upDialog.getEl()).removeClass('import-default');
                            }
                            $('.step-two',upDialog.getEl()).find('.file-name').html(fileName);
                            $('.step-two',upDialog.getEl()).find('.file-name').next('.file-operation').attr('new-id',newId);
                            $('.step-one',upDialog.getEl()).hide();
                            $('.step-two',upDialog.getEl()).show();
                            //data.submit();
                        },
                        fail:function(){
                            try{
                                oui.progress.hide();
                                oui.alert('由于网络问题，上传失败,请尝试重新上传');
                            }catch(e){

                            }
                        },
                        done: function (e, data) {
                            var serverData = data.result; //后端的响应数据
                            //if(!serverData.success){
                            //上传失败
                            //return ;
                            //}

                            //console.log(serverData.msg); //上传文件的Id
                            var newId = $(data).attr('newId');

                            var arr = UploadData.submitDatas;
                            var clientFile = null;
                            for(var i=0,len=arr.length;i<len;i++){
                                if($(arr[i]).attr('newId') ==$(data).attr('newId')){
                                    clientFile = arr[i].files[0]; //第一个文件
                                    arr.splice(i,1);
                                }
                            }
                            var successFiles = upDialog.attr("successFiles");

                            if(serverData.success){
                                if(!successFiles){
                                    successFiles = {};
                                    upDialog.attr("successFiles",successFiles);
                                }
                                successFiles[newId] = {file:clientFile,serverData:serverData};

                            }else{

                                UploadData.uploading = false;
                                upDialog.attr('uploading',false);
                                upDialog.attr({canNotClose:false});
                                oui.progress.hide();
                                $('.step-three',upDialog.getEl()).find('.uploading').hide();
                                $('.step-three',upDialog.getEl()).find('.success').hide();
                                $('.step-three',upDialog.getEl()).find('.fail').show();
                                $('.step-three',upDialog.getEl()).find('.fail').find('.ouiFile-import-failData').html(serverData.msg||'上传失败');
                                $(upDialog.getEl()).addClass('import-fail');//上传失败
                                return ;
                            }
                            if(arr.length ==0){
                                UploadData.uploading = false;
                                upDialog.attr('uploading',false);
                                upDialog.attr({canNotClose:false});
                                var useBase64 = upDialog.attr('useBase64');
                                var result = [];
                                for(var sf in successFiles){
                                    var sdata = oui.parseJson(successFiles[sf].serverData);
                                    sdata.msg = sdata.msg;
                                    var f= successFiles[sf].file;

                                    var previewUrl = sdata.previewUrl||'';
                                    var downloadUrl =sdata.downloadUrl||'';

                                    result.push({
                                        isUploadFile:true,
                                        fileId:sdata.fileId||'',
                                        downloadUrl:downloadUrl,
                                        previewUrl:previewUrl,
                                        success:sdata.success,
                                        size:f.size || 0,
                                        name:f.name,
                                        clientFile:f
                                    });
                                }
                                //上传成功，进入校验阶段
                                afterUpload4file(result,upDialog);
                            }
                            //console.log(arr.length);
                        },
                        progressall: function (e, data) { //进度功能
                            //console.log(data);
                            var progress = parseInt(data.loaded / data.total * 100, 10);
                            $('.up_progress .progress-bar').css('width',progress + '%');
                            //console.log(progress);

                        }
                    });
                });
            }
        });
        return upDialog;
    };
})(window);





