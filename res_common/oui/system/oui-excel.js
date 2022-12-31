/****
 * ExcelUtil
 */
(function(_){
    var ExcelUtil= _.ExcelUtil= _.ExcelUtil||{};
    /***
     *
     * [{'姓名':'张三','年龄':'23'}]
     *
     * List<LinkedHashMap<String, Object>>
     * @param
     */
    ExcelUtil.export4ListMap = function(fileName,datas,options){
        
        if(oui.browser.ie || oui.browser.isEdge){
            var batchSize = 10000;
            if(datas.length>batchSize){
                var groups = oui.buildBatch(datas.length,batchSize);
                oui.runBatch(groups,function(item){
                    var source = item.source;
                    var excel = ExcelUtil.createExcel4ListMap(fileName+' '+(item.idx+1),datas.slice(source.start,source.end),options);
                    excel.export(function(){
                        item.next();
                    });
                });
            }
        }else{
            var excel = ExcelUtil.createExcel4ListMap(fileName,datas,options);
            excel.export();
        }
    };


    /**
     * List<List<String>>
     */
    ExcelUtil.export4ListString = function(fileName,datas,options){
        if(oui.browser.ie || oui.browser.isEdge){
            var batchSize = 10000;
            if(datas.length>batchSize){
                var groups = oui.buildBatch(datas.length,batchSize);
                oui.runBatch(groups,function(item){
                    var source = item.source;
                    var excel = ExcelUtil.createExcel4ListString(fileName+' '+(item.idx+1),datas.slice(source.start,source.end),options);
                    excel.export(function(){
                        item.next();
                    });
                });
            }
        }else{
            var excel = ExcelUtil.createExcel4ListString(fileName,datas,options);
            excel.export();
        }
    };
    /**
     *
     * @param fileName
     * @param heads (LinkedHashMap<String,String>)
     * @param datas
     */
    ExcelUtil.export4ListObj = function(fileName,heads,datas,options){
        if(oui.browser.ie || oui.browser.isEdge){
            var batchSize = 10000;
            if(datas.length>batchSize){
                var groups = oui.buildBatch(datas.length,batchSize);
                oui.runBatch(groups,function(item){
                    var source = item.source;
                    var excel = ExcelUtil.createExcel4ListObj(fileName+' '+(item.idx+1),datas.slice(source.start,source.end),options);
                    excel.export(function(){
                        item.next();
                    });
                });
            }
        }else{
            var excel = ExcelUtil.createExcel4ListObj(fileName,heads,datas,options);
            excel.export();
        }

    };

    /***
     * 读取文件
     * @param file
     * @param callback
     */
    ExcelUtil.readFile = function(file,headerCount,callback){
        oui.require([oui.getContextPath()+'res_common/third/js-excel/excel.core.min.js'],function(){
            var fileReader = new FileReader();
            fileReader.onload = function(ev) {
                var data = ev.target.result;
                var workbook;
                var datas=[];
                if(oui.browser.ie || oui.browser.isEdge){
                    workbook = OURS_IMPORT_XLSX.read(btoa(fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                }else{
                    workbook = OURS_IMPORT_XLSX.read(data, {
                        type: 'binary'
                    }); // 以二进制流方式读取得到整份excel表格对象
                }

                var sheets = [];
                // 表格的表格范围，可用于判断表头是否数量是否正确
                for (var sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        var jsonArr =OURS_IMPORT_XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{header:1});

                        if(jsonArr.length){
                            if(jsonArr[0].length ==1){
                                if(jsonArr[0][0] ==sheet){
                                    jsonArr.shift();
                                }
                            }
                            if(headerCount>1 && jsonArr.length>1){
                                if(sheet.lastIndexOf('说明')<0){
                                    var temp =jsonArr.slice(headerCount-1,jsonArr.length);
                                    if(jsonArr&&jsonArr.length){
                                        jsonArr = temp;
                                    }
                                }
                            }
                            if(jsonArr.length){
                                var headers=[];
                                oui.findManyFromArrayBy(jsonArr[0]||[],function(temp){
                                    temp = temp ||'';
                                    var curr =temp;
                                    if(typeof temp =='string'){
                                        if(temp.lastIndexOf('(必填)')>=0){
                                            curr = temp.substring(0,temp.lastIndexOf('(必填)'));
                                        }
                                    }else{
                                        curr =''+temp;
                                    }
                                    headers.push(curr);
                                });
                                jsonArr[0] = headers;
                            }

                            var curr = ExcelUtil.createExcelSheet4ListString(sheet,jsonArr);
                            sheets.push(curr);
                        }
                    }
                }
                var name = file.name;
                if(name){
                    name = name.split('.')[0];
                }
                var excelObject= ExcelUtil.createExcel({
                    name:name,
                    sheets:sheets
                });
                callback&&callback(excelObject);
//                console.log(workbook);
            };
            if(oui.browser.ie || oui.browser.isEdge){
                fileReader.readAsArrayBuffer(file);
            }else{
                // 以二进制方式打开文件
                fileReader.readAsBinaryString(file);
            }
        });
    };
    //ie下文件读取，转换位base64
    function fixdata(data){
        var o = "",
            l = 0,
            w = 10240;
        for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    // csv转sheet对象
    function csv2sheet(csv) {
        var sheet = {}; // 将要生成的sheet
        csv = csv.split('\n');
        csv.forEach(function(row, i) {
            row = row.split(',');
            if(i == 0) sheet['!ref'] = 'A1:'+oui.getCharCode(row.length-1)+(csv.length-1);
            row.forEach(function(col, j) {
                sheet[oui.getCharCode(j)+(i+1)] = {v: col};
            });
        });
        return sheet;
    }


    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }


    function getSheets(){
        return this.sheets;
    }

    /****
     * 根据sheet名称获取sheet对象
     * @param name
     * @returns {*|null}
     */
    function getSheet (name){
        return oui.findOneFromArrayBy(this.sheets,function(item){
            if(item.name == name){
                return true;
            }
        });
    }

    /*****
     * SheetObject对象 中的数据 转为Excel二进制需要的sheet对象
     * @returns {{}}
     */
    function sheet2workbookSheet (start,end){
        var options = this;
        var styles = this.styles;
        var heads=options.heads,data=options.data,name=options.name,info=options.info||'';
        var sheet = {}; // 将要生成的sheet
        var headRow = 1; //表头也要算入excel行数
        if(info){
            var infoRowSize=6;
            headRow=1+infoRowSize;
            sheet['!rows']=[{
                hpx:300
            }];
            sheet['!merges']=[{//合并第一列
                s: {//s为开始
                    c: 0,//开始列
                    r: 0//可以看成开始行,实际是取值范围
                },
                e: {//e结束
                    c: heads.length-1,//结束列
                    r: infoRowSize-1//结束行
                }
            }];
            //合并列和行的描述信息
            sheet[oui.getCharCode(0+1)+'1'] = {t:'s',v:info,
                s:{
                    alignment: {
                        vertical: "center",
                        horizontal: "left",
                        indent:0,
                        wrapText: true
                    },
                    numFmt:'@',//默认文本格式
                    border:{
                        top:{style: 'thin', color: { rgb: "333333" }}, left:{style: 'thin', color: { rgb: "333333" }},bottom:{style: 'thin', color: { rgb: "333333" }},right:{style: 'thin', color: { rgb: "333333" }}
                    },
                    font: { sz: 10, bold: true, color: { rgb: "00000000" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFFFF" } }
                }
            };
        }
        if(options['!merges']){
            sheet['!merges'] = options['!merges'];
        }
        var hasHeadInfo = false;
        var oneHeadIfInfo = oui.findOneFromArrayBy(heads,function(item){
            if(item.info){
                return true;
            }
        });
        if(oneHeadIfInfo){
            hasHeadInfo = true;
        }
        if(hasHeadInfo){
            //遍历表头说明信息
            oui.findManyFromArrayBy(heads,function(item,idx){
                var tempInfo = item.info||'';

                sheet[oui.getCharCode(idx+1)+''+headRow] = {t:'s',v:tempInfo,
                    s:{
                        alignment: {
                            vertical: "center",
                            horizontal: "center",
                            indent:0,
                            wrapText: true
                        },
                        numFmt:'@',//默认文本格式
                        border:{
                            top:{style: 'thin', color: { rgb: "c5c5c5" }}, left:{style: 'thin', color: { rgb: "c5c5c5" }},bottom:{style: 'thin', color: { rgb: "c5c5c5" }},right:{style: 'thin', color: { rgb: "c5c5c5" }}
                        },
                        font: { sz: 10, bold: true, color: { rgb: "00000000" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFFFF" } }
                    }
                };
            });
            headRow++;
        }
        sheet['!ref'] = 'A1:'+oui.getCharCode(heads.length)+''+(data.length+headRow);

        var cols =[];
        //表头信息
        oui.findManyFromArrayBy(heads,function(item,idx){
            cols.push({
                'wpx':120
            });

            var tempName = item.name;
            if(item&&item.validate&&item.validate.require){
                if(tempName.lastIndexOf('(必填)')<0){
                    tempName=tempName+'(必填)';
                }
            }
            sheet[oui.getCharCode(idx+1)+''+headRow] = {t:'s',v:tempName,
                s:{
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        indent:0,
                        wrapText: true
                    },
                    numFmt:'@',//默认文本格式
                    border:{
                        top:{style: 'thin', color: { rgb: "c5c5c5" }}, left:{style: 'thin', color: { rgb: "c5c5c5" }},bottom:{style: 'thin', color: { rgb: "c5c5c5" }},right:{style: 'thin', color: { rgb: "c5c5c5" }}
                    },
                    font: { sz: 14, bold: true, color: { rgb: "00000000" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFFFF" } }
                }
            };
        });
        sheet['!cols']=cols;
        //处理数据样式
        if(typeof start =='undefined'){
            start=0;
        }
        if(typeof end =='undefined'){
            end = data.length;
        }
        if(end>data.length){
            end = data.length;
        }
        if(start<0){
            start=0;
        }
        var targetData = data.slice(start,end);
        oui.findManyFromArrayBy(targetData,function(dataItem,dataIdx){
            oui.findManyFromArrayBy(heads,function(item,idx){
                var tempv = oui.JsonPathUtil.getJsonByPath(item.key,dataItem);
                if(tempv ===null){
                    tempv ='';
                }
                if(typeof tempv =='undefined'){
                    tempv ='';
                }
                var tempStyle = {t:'s',v:tempv,s:styles[idx+'_'+dataIdx]||{

                    border:{
                        top:{style: 'thin', color: { rgb: "c5c5c5" }}, left:{style: 'thin', color: { rgb: "c5c5c5" }},bottom:{style: 'thin', color: { rgb: "c5c5c5" }},right:{style: 'thin', color: { rgb: "c5c5c5" }}
                    },
                    font: { sz: 14, bold: true, color: { rgb: "00000000" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFFFF" } }

                }};
                if(!tempStyle.s.numFmt){ //默认文本格式
                    tempStyle.s.numFmt= '@';
                }
                sheet[oui.getCharCode(idx+1)+''+(dataIdx+headRow+1)] = tempStyle;
            });
        });
        return sheet;
    }

    /***
     * sheet对象构造器
     * @param options
     * @constructor
     */
    function SheetObject(options){
        var temp={
            dataType:'listMap',//默认为map对象列表
            name:'',
            heads:[],
            data:[],
            merges:[],
            info:'',//表头描述信息
            styles:{}
        };
        $.extend(true,this,temp,options);
        this.setRowStyle= setRowStyle;
        this.setColumnStyle =setColumnStyle;
        this.setCellStyle = setCellStyle;
        this.sheet2workbookSheet = sheet2workbookSheet;
        //获取头信息
        this.getHeads = function(){
            return this.heads||[];
        };
        this.getColumnIndexByName = function(name){
            var idx =-1;
            oui.findOneFromArrayBy(this.getHeads(),function(item,index){
                if(item.name == name){
                    idx = index;
                    return true;
                }
            });
            return idx;
        };
        this.getColumnIndexByKey = function(key){
            var idx =-1;
            oui.findOneFromArrayBy(this.getHeads(),function(item,index){
                if(item.key == key){
                    idx = index;
                    return true;
                }
            });
            return idx;
        };
        /****
         * 如果 excel对象 是通过 listMap创建的，传入的row数据格式 就是map;如果excel对象通过ListString创建的，传入的row为 字符串数组
         * @param row
         * @param rowIndex
         */
        this.addRow = function(row,rowIndex){
            //if(this.dataType =='listMap'){
            //
            //}else if(this.dataType =='listString'){
            //
            //}
            var data = this.data ||[];
            data.splice(rowIndex+1,row);
        };
        //二维数组
        this.addColumn = function(columnDatas,newColumnName,currColumnName) {
            var data = this.data ||[];
            var me = this;
            var heads = this.heads||[];
            var lastHeads = [];
            oui.findManyFromArrayBy(heads,function(head){
                lastHeads.push({
                    key:head.key,
                    name:head.name
                });
            });
            var currColumnIndex=-1;
            var newColumnIndex =-1;
            var hasColumn = oui.findOneFromArrayBy(heads,function(item,index){
                if(item.name == newColumnName){
                    newColumnIndex = index;
                    return true;
                }
            });
            var one = oui.findOneFromArrayBy(heads,function(item,index){
                if(item.name == currColumnName){
                    currColumnIndex = index;
                    return true;
                }
            });

            if(currColumnIndex ==-1){
                currColumnIndex = heads.length-1;
            }
            if(!hasColumn){
                if(this.dataType =='listMap'){
                    heads.push({
                        key:newColumnName,
                        name:newColumnName
                    });
                }else if(this.dataType =='listString'){
                    heads.splice(currColumnIndex+1,0,{
                        key:currColumnIndex+1,
                        name:newColumnName
                    });
                }
                newColumnIndex = currColumnIndex+1;
            }

            oui.findManyFromArrayBy(data,function(row,index){
                if(me.dataType =='listMap'){
                    row[newColumnName] = columnDatas[index]||"";
                }else if(me.dataType =='listString'){
                    if(hasColumn){
                        row[newColumnIndex] = columnDatas[index]||"";
                    }else{
                        var newRow = [];
                        oui.findManyFromArrayBy(lastHeads,function(head){
                            newRow[head.key] = row[head.key]||"";
                        });
                        newRow.splice(newColumnIndex,0,columnDatas[index]||"");
                        oui.findManyFromArrayBy(newRow,function(temp,ci){
                            row[ci] = temp;
                        });
                    }
                }
            });
        };
        this.getData4ListMap = function(){

            if(this.dataType=='listMap'){
                return this.data ||[];
            }else{
                var me = this;
                var arr = [];
                oui.findManyFromArrayBy(me.data||[],function(row){
                    var curr ={};
                    oui.findManyFromArrayBy(me.heads||[],function(head){
                        var temp = oui.JsonPathUtil.getJsonByPath(head.key,row);
                        if(temp !==null){
                            curr[head.name] =temp;
                        }else{
                            curr[head.name] ='';
                        }
                    });
                    arr.push(curr);
                });
                return arr;
            }
        };
        this.getData4ListString = function(){
            if(this.dataType =='listString'){
                return this.data||[];
            }else{
                var me = this;
                var arr = [];
                oui.findManyFromArrayBy(me.data||[],function(row){
                    var curr =[];
                    oui.findManyFromArrayBy(me.heads||[],function(head){
                        var temp = oui.JsonPathUtil.getJsonByPath(head.key,row);
                        if(temp !==null){
                            curr.push(temp);
                        }else{
                            curr.push('');
                        }
                    });
                    arr.push(curr);
                });
                return arr;
            }
        };
    }
    /****
     * 数据导出Excel
     * {dataType,name,heads,data}
     * @param options
     */
    ExcelUtil.export = function(excelObj,callback){

        var corePath = oui.getContextPath()+'res_common/third/js-excel/excel.core.min.js';
        var fullPath = oui.getContextPath()+'res_common/third/js-excel/excel.all.min.js';
        var fullStylePath = oui.getContextPath()+'res_common/third/js-excel/excel.style.min.js';
        oui.require([fullPath,fullStylePath],function(){
            if(oui.browser.ie || oui.browser.isEdge){
                //分批次下载
                var sheets = excelObj.getSheets();
                if(sheets.length==1){
                    //分批次下载只对一个sheet起作用
                    var dataLen = sheets[0].data.length;
                    var batchDataLength = 10000;
                    var groups =oui.buildBatch(dataLen,batchDataLength);
                    oui.runBatch(groups,function(item){
                        var source = item.source;
                        var blob = excelObj.toBlob(source.start,source.end);
                        openDownloadDialog(blob,excelObj.name+(' '+(item.idx+1))+excelObj.suffix,function(){
                            item.next();
                        });
                    },function(){
                        //下载完成多个
                        callback&&callback();
                    });
                }else{
                    var blob = excelObj.toBlob();
                    openDownloadDialog(blob,excelObj.name+excelObj.suffix,callback);
                }
            }else{
                var blob = excelObj.toBlob();
                openDownloadDialog(blob,excelObj.name+excelObj.suffix,callback);
            }
        });
    };
    /****
     * 导出Excel文件
     */
    function exportExcel(callback){
        ExcelUtil.export(this,callback);
    }

    /**
     * 设置 sheet的行样式，如果没有传入行号或者传入-1,则设置所有行样式
     * @param style {}
     * @param rowIndex
     */
    function setRowStyle(style,rowIndex){
        if(typeof rowIndex =='undefined'){
            rowIndex =-1;
        }
        var me = this;
        if(rowIndex ==-1){
            //设置所有

            oui.findManyFromArrayBy(me.data||[],function(row,rowIndex){
                oui.findManyFromArrayBy(me.heads||[],function(column,colIndex){
                    me.styles[colIndex+'_'+rowIndex] =style;
                });
            });
        }else{
            oui.findManyFromArrayBy(me.heads||[],function(column,colIndex){
                me.styles[colIndex+'_'+rowIndex] =style;
            });
        }
    }

    /***
     * 设置 sheet的列样式，如果没有传入列号，则设置所有列样式
     * @param style
     * @param columnIndex
     */
    function setColumnStyle(style,columnIndex){
        if(typeof columnIndex =='undefined'){
            columnIndex = -1;
        }
        var me = this;
        if(columnIndex ==-1){
            //设置所有列
            oui.findManyFromArrayBy(me.data||[],function(row,rowIndex){
                oui.findManyFromArrayBy(me.heads||[],function(column,colIndex){
                    me.styles[colIndex+'_'+rowIndex] =style;
                });
            });
        }else{
            oui.findManyFromArrayBy(me.data||[],function(row,rowIndex){
                me.styles[columnIndex+'_'+rowIndex] =style;
            });
        }

    }

    /**
     * 设置单元格样式
     * @param style
     * @param rowIndex
     * @param columnIndex
     */
    function setCellStyle(style,rowIndex,columnIndex){
        var me = this;
        if(typeof rowIndex == -1){
            rowIndex = -1;
        }
        if(columnIndex==-1){
            columnIndex=-1;
        }
        if((rowIndex==-1) || (columnIndex==-1)){
            if(rowIndex ==-1){
                me.setColumnStyle(style,columnIndex);
            }else{
                me.setRowStyle(style,rowIndex);
            }
        }else{
            me.styles[columnIndex+'_'+rowIndex] =style;
        }
    }
    /***
     *
     * {
	 * 	 name:'',
	 *   sheets:[]
	 * }
     * 构造Excel对象
     * @param options
     * @constructor
     */
    function ExcelObject(options){
        var temp={
            suffix:'.xlsx',//excel文件后缀
            name:'excel',//文件名
            sheets:[]
        };
        $.extend(true,this,temp,options);
        this.getSheets = getSheets;
        this.getSheet = getSheet;

        this.toWorkBook = function(start,end){
            var sheetNames = [];
            var sheetMap = {

            };
            oui.findManyFromArrayBy(this.getSheets()||[],function(item){
                sheetNames.push(item.name);
                sheetMap[item.name] = item.sheet2workbookSheet(start,end);
            });
            var workbook = {
                SheetNames: sheetNames,
                Sheets: sheetMap
            };
            return workbook;
        };
        this.toBlob = function(start,end){
            var workbook = this.toWorkBook(start,end);
            // 生成excel的配置项
            var wbout = OURS_EXPORT_XLSX.write(workbook,  {
                bookType: 'xlsx', // 要生成的文件类型
                bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                type: 'binary'
            });
            var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
            return blob;
        };
        this.setRowStyle= function(style,rowIndex,sheetName){
            if(typeof sheetName =='undefined'){
                oui.findManyFromArrayBy(this.getSheets()||[],function(item){
                    item.setRowStyle(style,rowIndex);
                });
            }else{
                var one = this.getSheet(sheetName);
                one&&one.setRowStyle(style,rowIndex);
            }
        };

        this.setColumnStyle =function(style,columnIndex,sheetName){
            if(typeof sheetName =='undefined'){
                oui.findManyFromArrayBy(this.getSheets()||[],function(item){
                    item.setColumnStyle(style,columnIndex);
                });
            }else{
                var one = this.getSheet(sheetName);
                one&&one.setColumnStyle(style,columnIndex);
            }
        };
        this.setCellStyle = function(style,rowIndex,columnIndex,sheetName){
            if(typeof sheetName =='undefined'){
                oui.findManyFromArrayBy(this.getSheets()||[],function(item){
                    item.setCellStyle(style,rowIndex,columnIndex);
                });
            }else{
                var one = this.getSheet(sheetName);
                one&&one.setCellStyle(style,rowIndex,columnIndex);
            }
        };
        this.getData4ListMap = function(sheetName){
            var arr = [];
            if(sheetName){
                var sheet = this.getSheet(sheetName);
                if(sheet){
                    arr = sheet.getData4ListMap();
                }
            }else{
                oui.findManyFromArrayBy(this.getSheets()||[],function(item){
                    arr = arr.concat(item.getData4ListMap());
                });
            }
            return arr;
        };
        this.getData4ListString = function(sheetName){
            var arr = [];
            if(sheetName){
                var sheet = this.getSheet(sheetName);
                if(sheet){
                    arr = sheet.getData4ListString();
                }
            }else{
                oui.findManyFromArrayBy(this.getSheets()||[],function(item){
                    arr = arr.concat(item.getData4ListString());
                });
            }
            return arr;
        };

        this.export = exportExcel;
        this.createError = function (cfg) {
            return new ExcelErrorObj(this, cfg);
        };
        this.addErrorMsg = function(sheetName,rowIndex,columnIndex,msg,isReplace){
            if(!this.excelErrorObj){
                this.excelErrorObj = this.createError();
            }
            this.excelErrorObj.addErrorMsg(sheetName,rowIndex,columnIndex,msg,isReplace);
        };
        this.exportErrorExcel =function(){
            if(this.excelErrorObj&&this.excelErrorObj.hasErrorMsg()){
                this.excelErrorObj.exportErrorExcel();
            }
        };
        this.hasErrorMsg = function(){
            if(this.excelErrorObj&&this.excelErrorObj.hasErrorMsg()){
                return true;
            }
            return false;
        };
    }

    /**
     *
     * @param name
     * @param sheets List<SheetObject>
     */
    ExcelUtil.createExcel = function(name,sheets){
        if(typeof name =='object'){
            var cfg = name;
            var obj = new ExcelObject(cfg);
            if(sheets){
                obj.sheets = sheets;
            }
        }else{
            var obj = new ExcelObject({
                name:name||'excel',
                sheets:sheets||[]
            });
        }

        return obj;
    };

    /****
     * 根据listObj创建单sheet的Excel对象
     */
    ExcelUtil.createExcel4ListObj = function(name,heads,datas,options){
        var sheet = ExcelUtil.createExcelSheet4ListObj('sheet',heads,datas,options);
        var obj = new ExcelObject({
            name:name||'excel',
            sheets:[sheet]
        });
        return obj;
    };
    /****
     * 根据 ListString 创建单sheet的Excel对象
     * @param name
     * @param datas
     * @param options
     */
    ExcelUtil.createExcel4ListString = function(name,datas,options){
        var sheet = ExcelUtil.createExcelSheet4ListString('sheet',datas,options);
        var obj = new ExcelObject({
            name:name||'excel',
            sheets:[sheet]
        });
        return obj;
    };
    /***
     * 根据ListMap 创建单sheet的Excel对象
     * @param name
     * @param datas
     * @param options
     */
    ExcelUtil.createExcel4ListMap = function(name,datas,options){
        var sheet = ExcelUtil.createExcelSheet4ListMap('sheet',datas,options);
        var obj = new ExcelObject({
            name:name||'excel',
            sheets:[sheet]
        });
        return obj;
    };
    //TODO 暂时放这，因为common里面还没有
    oui.isArray = function(value){
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        }else{
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    };
    /***
     * 根据 sheet名和数据 创建sheet对象
     * @param name
     * @param datas 数据格式为对象
     * @param options
     * @returns {SheetObject}
     */
    ExcelUtil.createExcelSheet4ListObj = function(name,heads,datas,options){
        if((!datas) ||(!datas.length)){
            throw new Error('创建Excel sheet失败，数据不能为空');
        }
        var headers= [];
        if(!heads){
            var firstHeader= datas[0] ||{};
            for(var key in firstHeader){
                headers.push({
                    key:key,
                    name:key
                });
            }
        }else{
            if(oui.isArray(heads)){
                headers = heads;
            }else {
                for(var key in heads){
                    headers.push({
                        key:key,
                        name:heads[key]
                    });
                }
            }

        }
        var tempOptions = $.extend(true,{
            name:name||'sheet' ,
            heads:headers,
            data:datas
        },options);
        var obj = new SheetObject(tempOptions);
        return obj;
    };
    /**
     * 根据sheet名 和数据，创建 Sheet对象
     * @param name
     * @param datas 数据格式为二维数组
     * @param options
     * @returns {SheetObject}
     */
    ExcelUtil.createExcelSheet4ListString = function(name,datas,options){
        if((!datas) ||(!datas.length) ){
            oui.getTop().oui.alert('excel模板错误');
            throw new Error('创建Excelsheet失败，数据为空');
        }
        if( ( datas.length==1) ){
            oui.getTop().oui.alert('excel模板错误');
            throw new Error('创建Excelsheet失败，Excel sheet数据格式错误');
        }
        var headers =[];
        var arr = datas[0]||[];

        for(var i= 0,len=arr.length;i<len;i++){
            var tempName = arr[i];
            if(tempName&&tempName.lastIndexOf('(必填)')>0){
                tempName = tempName.substring(0,arr[i].lastIndexOf('(必填)'));
                tempName= $.trim(tempName);
                if(!tempName){
                    tempName="(必填)";
                }
            }
            headers.push({
                key:i,
                name:tempName
            });
        }
        var data =datas.slice(1);//删除第一行
        var tempOptions = $.extend(true,{
            dataType:'listString',//默认为map对象列表
            name:name||'sheet',
            heads:headers,
            data:data,
            styles:{}
        },options);
        var obj = new SheetObject(tempOptions);
        return obj;
    };
    /****
     * 根据sheet名、数据创建Sheet对象
     * @param name
     * @param datas 数据格式为ListMap
     * @param options
     */
    ExcelUtil.createExcelSheet4ListMap = function(name,datas,options){
        if((!datas) ||(!datas.length)){
            oui.getTop().oui.alert('不能导出空数据');
            return ;
        }
        var firstHeader= datas[0] ||{};
        var heads = [];
        for(var key in firstHeader){
            heads.push({
                key:key,
                name:key
            });
        }
        var tempOptions = $.extend(true,{
            name:name||'sheet',//默认文件名
            heads:heads,
            data:datas
        },options);
        var obj = new SheetObject(tempOptions);
        return obj;
    };

    /**
     * 通用的打开下载对话框方法，没有测试过具体兼容性
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    function openDownloadDialog(url, saveName,callback) {

        if(typeof url == 'object' && url instanceof Blob)
        {
            if(oui.browser.ie || oui.browser.isEdge){
                window.navigator.msSaveBlob(url, saveName);
                callback&&callback();
                //ie特殊下载处理
                return ;
            }
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var id = oui.getUUIDLong();
        $(document.body).append('<a id="'+id+'"></a>');
        var $a = $('#'+id);
        $a.attr({
            'href':url,
            download:saveName||''
        });
        $a[0].click();
        setTimeout(function () {
            URL.revokeObjectURL(url);
            callback&&callback();
        }, 100);

    }
    ExcelUtil.findDefaultErrorStyle4Excel = function(){
        return {
            font: { sz: 11, bold: false, color: { rgb: "F65C78" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "feeef1" } },
            alignment: {
                vertical: "center",
                wrapText: true
            },
            border:{
                top:{style: 'thin', color: { rgb: "c5c5c5" }}, left:{style: 'thin', color: { rgb: "c5c5c5" }},bottom:{style: 'thin', color: { rgb: "c5c5c5" }},right:{style: 'thin', color: { rgb: "c5c5c5" }}
            }
        };
    };

    /**
     * excel错误处理对象
     * @param excelObj
     * @param cfg
     * @constructor
     */
    function ExcelErrorObj(excelObj, cfg) {
        if (!excelObj) {
            throw "excel对象不能为空!";
        }
        this.options = {};
        this.options = $.extend(true, {}, this.options, cfg);
        this.data = null;

        /**
         * 是否有错误信息
         * @returns {boolean}
         */
        this.hasErrorMsg = function () {
            return !!this.data;
        };

        /**
         * 添加错误消息
         * @param sheetName sheet
         * @param rowIndex 行号
         * @param columnIndex 列号
         * @param msg 消息
         * @returns {ExcelErrorObj} 返回错误对象方便链式调用
         */
        this.addErrorMsg = function (sheetName, rowIndex, columnIndex, msg,isReplace) {
            if (typeof rowIndex === "undefined" && typeof columnIndex === "undefined" && typeof msg === "undefined") {
                throw "参数不能为空！";
            }
            if (!this.data) {
                this.data = {};
            }
            var sheetError = this.data[sheetName];
            if (!sheetError) {
                sheetError = {};
            }
            if (!sheetError[rowIndex]) {
                sheetError[rowIndex] = {};
            }
            if(!isReplace){//默认执行 append错误消息
                var last = sheetError[rowIndex][columnIndex];
                if(last&&last.msg){
                    last.msg += (';'+msg);
                }else{
                    sheetError[rowIndex][columnIndex] = {
                        rowIndex: rowIndex,
                        columnIndex: columnIndex,
                        msg: msg
                    };
                }
            }else{//替换消息
                sheetError[rowIndex][columnIndex] = {
                    rowIndex: rowIndex,
                    columnIndex: columnIndex,
                    msg: msg
                };
            }

            this.data[sheetName] = sheetError;
            return this;
        };
        /**
         * 将错误excel导出
         * @param excelFileName
         */
        this.exportErrorExcel = function (excelFileName) {
            var errorDataMap = this.data;
            if (errorDataMap) {
                for (var sheetName in errorDataMap) {
                    var errorData = errorDataMap[sheetName];
                    var sheetObj = excelObj.getSheet(sheetName);
                    if (sheetObj) {//防护
                        var errorStyle = ExcelUtil.findDefaultErrorStyle4Excel();
                        var sheetDataList = sheetObj.data;
                        var length = sheetDataList.length;//循环i为row
                        var errorColumnDataList = [];
                        var heads = sheetObj.getHeads();
                        var lastColumnIndex = heads.length;
                        for (var i = 0; i < length; i++) {
                            var errorRowObj = errorData[i];//一行的错误
                            var errorStr = "";
                            if (errorRowObj) {
                                for (var columnIndex in errorRowObj) {
                                    var columnErrorObj = errorRowObj[columnIndex];
                                    var rowIndex = columnErrorObj.rowIndex;
                                    var column = heads[columnIndex];
                                    errorStr += "\n" + column.name + ":" + columnErrorObj.msg + ";";
                                    sheetObj.setCellStyle(errorStyle, rowIndex, columnIndex);
                                }
                                if (errorStr && errorStr.length > 0) {
                                    errorStr = errorStr.replace(/^(\n)/g, "");
                                }
                            }
                            errorColumnDataList.push(errorStr);
                        }
                        if (errorColumnDataList.length > 0) {
                            sheetObj.addColumn(errorColumnDataList, "错误信息");
                        }
                        sheetObj.setColumnStyle(errorStyle, lastColumnIndex);
                    }
                }
                if (!excelFileName) {
                    excelFileName = excelObj.name + "错误提示信息";
                }
                excelObj.name = excelFileName;
                excelObj.export();
            }
        };

        this.showErrorMsg = function () {
            //TODO 是否弹出显示
            return this;
        };
    }

    ExcelUtil.createExcelError = function (excelObj, cfg) {
        return new ExcelErrorObj(excelObj, cfg);
    };

    _.exportExcel4ListMap = ExcelUtil.export4ListMap;
    _.exportExcel4ListString = ExcelUtil.export4ListString;
    _.exportExcel4ListObj = ExcelUtil.export4ListObj;
    _.exportExcel = ExcelUtil.export;
    _.createExcel = ExcelUtil.createExcel;
    _.createExcel4ListMap = ExcelUtil.createExcel4ListMap;
    _.createExcel4ListString =ExcelUtil.createExcel4ListString;
    _.createExcel4ListObj = ExcelUtil.createExcel4ListObj;
    _.findDefaultErrorStyle4Excel = ExcelUtil.findDefaultErrorStyle4Excel;
})(oui);