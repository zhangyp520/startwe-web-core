!(function(win){

    /****
     * excel 每次导出最大行数，超过则根据该参数进行分割
     * @type {number}
     */
    var DataSplitLength =10000;
    var exportHtml='' +
        '<div class="export-head">' +
        '   <label class="export-head-title">文件名</label>' +
        '   <div class="export-head-info">' +
        '       <oui-form otherAttrs="{paramKey:\'{{paramKey}}\'}" id="fileName" type="textfield" value="{{name}}" onUpdate="oui.updateExportFileNames"></oui-form>' +
        '   </div>' +
        '</div>' +
        '<div class="export-prompt-text">' +
        '{{if batchFiles&&(batchFiles.length>1)}}' +
        '   <span class="moreFile-info">由于文件过大，已为您自动拆分为多个文件,请点击相应文件下载！</span>' +
        '{{else}}' +
        '   <span class="moreFile-info">已为您生成以下文件,请点击相应文件下载！</span>' +
        '{{/if}}' +
        '</div>' +
        '<div class="export-list">' +
        '   <ul id="export-batch-files">' +
        '   {{each batchFiles as item index}}' +
        '   <li start-index="{{item.start}}" class="submit-button" file-name="{{item.name}}" page-index="{{item.pageIndex}}" datas-param-key="{{paramKey}}" end-index="{{item.end}}" onclick="oui.event4exportExcels(this);">' +
        '       <div class="export-list-item" title="{{item.name}}.xlsx">{{item.name}}.xlsx</div>' +
        '   </li>' +
        '   {{/each}}' +
        '   </ul>' +
        '</div>';
    var render4ExportHtml=null;
    /***
     * 弹出导出 excel 框
     * @param options
     * @returns {*}
     */
    var showExportDialogByOptions = function(options){
        if(!render4ExportHtml){
            render4ExportHtml = template.compile(exportHtml);
        }
        var dialog = oui.getTop().oui.showHTMLDialog({
            content:render4ExportHtml(options),
            contentStyle:options.contentStyle||'width:600px',
            title:options.title ||'导出Excel',
            callback:function(action){
                if(action=='close'){
                    console.log('remove paramKey:');
                    console.log(options);
                    var paramKey = options.paramKey;
                    if(paramKey){
                        oui.getTop().oui.removePageParam(paramKey);
                    }
                }
            }
        });
        oui.getTop().oui.parse({
            container:dialog.getEl(),
            callback:function(){}
        });
        return dialog;
    };
    /*****
     * 文件名变更，更新所有文件名
     * @param control
     */
    oui.updateExportFileNames= function(control){
        var v = control.getValue();
        v = v||'default';
        var otherAttrs = control.attr('otherAttrs');
        otherAttrs = oui.parseJson(otherAttrs);
        var paramKey = otherAttrs.paramKey;
        var options = oui.getPageParam(paramKey);
        var batchFiles = options.batchFiles ||[];
        var fileSuffix = '.xlsx';
        if((!batchFiles)||(!batchFiles.length)||(batchFiles&&(batchFiles.length==1))){
            //只有一个分组
            $('#export-batch-files').find('li').each(function(){
                $(this).attr('file-name',v);
                $(this).find('div').attr('title',v+fileSuffix);
                $(this).find('div').html(v+fileSuffix);
            });
        }else{
            //存在多个分组
            $('#export-batch-files').find('li').each(function(idx){
                var s = (idx+1)+' ';
                $(this).attr('file-name',s+v);
                $(this).find('div').attr('title',s+v+fileSuffix);
                $(this).find('div').html(s+v+fileSuffix);
            });
        }

    };
    /***
     * 根据ajax导出
     * @param el
     */
    var event4exportExcels4Ajax = function(el){
        var dataKey = $(el).attr('datas-param-key');
        var fileName = $(el).attr('file-name');
        var pageIndex = $(el).attr('page-index');
        pageIndex = parseInt(pageIndex);
        var options = oui.getPageParam(dataKey);
        var dataType =options.dataType||'listMap';//listString;
        var pager = options.pager||{};
        if(pager){
            if(pageIndex ===pager.pageIndex){
                //已经在当前页中，直接导出对应json,否则 ajax获取
                exportByTargetData(dataType,fileName,options.heads,pager.dataList||[]);
                return ;
            }
        }
        var url = options.data;
        url = oui.setParam(url,'pageIndex',pageIndex);//设置页数进行下载
        var dataSplitLength = options.dataSplitLength||DataSplitLength;
        url = oui.setParam(url,'pageSize',dataSplitLength);
        oui.getData(url,{},function(res){
            if(res.success){
                var pager4ajax = oui.parseJson(res.msg);
                exportByTargetData(dataType,fileName,options.heads,pager4ajax.dataList||[]);
            }else{
                oui.getTop().oui.alert(res.msg);
            }
        });

    };
    /****
     * 根据目标数据 进行 excel导出
     * @param dataType
     * @param fileName
     * @param heads
     * @param dataList
     */
    var exportByTargetData = function(dataType,fileName,heads,dataList){
        if(dataType =='listMap'){
            //预制空行
            if((!dataList)||(!dataList.length)){
                dataList = [{}];
            }
            oui.exportExcel4ListObj(fileName,heads,dataList);
        }else{
            var arr = [];
            oui.findManyFromArrayBy(heads,function(item){
                arr.push(item.name);
            });
            //预制空行
            if((!dataList)||(!dataList.length)){
                dataList = [[]];
            }
            var results = [arr];
            results = results.concat(dataList);
            oui.exportExcel4ListString(fileName,results);
        }
    };
    /****
     * 根据数据进行导出
     * @param el
     */
    var event4exportExcels4DataArray = function(el){
        var dataKey = $(el).attr('datas-param-key');
        var start = $(el).attr('start-index');
        var end = $(el).attr('end-index');
        var fileName = $(el).attr('file-name');
        start = parseInt(start);
        end = parseInt(end);
        var options = oui.getPageParam(dataKey);
        var dataType =options.dataType||'listMap';//listString;
        var data = options.data ||[];
        var targetData = data.slice(start,end);
        exportByTargetData(dataType,fileName,options.heads, targetData);
    };
    /** ***
     * 用于多文件分段导出其中一个
     * @param el
     */
    oui.event4exportExcels = function(el){
        var dataKey = $(el).attr('datas-param-key');
        var options = oui.getPageParam(dataKey);
        if(!$(el).hasClass('selected')){
            $(el).addClass('selected');
        }
        if(options.isDataArray){
            event4exportExcels4DataArray(el);
        }else{
            event4exportExcels4Ajax(el);
        }
    };



    /***
     * 根据ajax分页 显示dialog
     * @param options
     * @param callback
     */
    var showExportDialog4pagerAjax = function(options,callback){
        var data=options.data,fileName=options.name,paramKey=options.paramKey,dataType=options.dataType;
        var dataSplitLength = options.dataSplitLength||DataSplitLength;
        oui.getData(data,{},function(res){
            if(res.success){
                var json = oui.parseJson(res.msg);
                var dataList = json.dataList;
                var pageIndex = json.pageIndex;

                var pageSize =dataSplitLength;
                var total = parseInt(json.total+'');

                var batchFiles= oui.buildBatch(total,dataSplitLength);
                if(batchFiles.length >1){
                    oui.findManyFromArrayBy(batchFiles,function(item,idx){
                        item.name= (idx+1)+' '+fileName;
                        item.pageIndex = idx+1;
                        item.pageSize = dataSplitLength;
                    });
                }else{
                    oui.findManyFromArrayBy(batchFiles,function(item,idx){
                        item.name=  fileName;
                        item.pageIndex = idx+1;
                        item.pageSize = dataSplitLength;
                    });
                }
                options.batchFiles = batchFiles;
                options.pager = json;
                var newHeads =options.heads;
                if(options.pager.otherAttrs){
                    if(options.pager.otherAttrs.heads){
                        newHeads = options.pager.otherAttrs.heads;
                    }
                }
                options.heads = newHeads || options.heads||[];
                oui.getTop().oui.setPageParam(paramKey,options);
                callback&&callback(options);
            }else{
                oui.getTop().oui.alert(res.msg);
            }

        });
    };
    /***
     * 根据数据分页显示
     * @param options
     * @param callback
     */
    var showExportDialog4dataArray = function(options,callback){
        var data = options.data,fileName=options.name,paramKey=options.paramKey;
        var dataSplitLength = options.dataSplitLength||DataSplitLength;
        var batchFiles= oui.buildBatch(data.length,dataSplitLength);
        if(batchFiles.length >1){
            oui.findManyFromArrayBy(batchFiles,function(item,idx){
                item.name= (idx+1)+' '+fileName;
                item.pageIndex = idx+1;
                item.pageSize = dataSplitLength;
            });
        }else{
            oui.findManyFromArrayBy(batchFiles,function(item,idx){
                item.name=  fileName;
                item.pageIndex = idx+1;
                item.pageSize = dataSplitLength;
            });
        }
        options.batchFiles = batchFiles;
        oui.getTop().oui.setPageParam(paramKey,options);
        callback&&callback(options);
    };
    /**
     * {
     *    heads,//表头
     *    data, //数据
     *    dataType //数据类型 listMap,listString
     *  }
     * @param options
     */
    oui.showExportExcelDialog4Require = function(options){

        var data = options.data||[];
        var heads = options.heads||[];
        if(!data.length){
            data = [{}];
        }
        if(heads){
            if(!(heads instanceof Array)){
                var arr = [];
                for(var key in heads){
                    arr.push({
                        key:key,
                        name:heads[key]
                    });
                }
                heads= arr;
            }
        }
        var paramKey = '_export_'+oui.getUUIDLong();
        var tempOptions = $.extend(true,{
            paramKey:paramKey,
            name:'default',
            dataType:'listMap'
        },options);
        if(typeof data =='object'){
            tempOptions.isDataArray = true;
            if(!heads.length) {
                throw  new Error('列头不能为空');
            }
            showExportDialog4dataArray(tempOptions,function(newOptions){
                showExportDialogByOptions(newOptions);
            });
        }else{
            tempOptions.isDataArray = false;
            showExportDialog4pagerAjax(tempOptions,function(newOptions){
                heads = newOptions.heads||[];
                if(!heads.length) {
                    throw  new Error('列头不能为空');
                }
                showExportDialogByOptions(newOptions);
            });
        }
    };
})(window);