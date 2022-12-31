zip.workerScriptsPath = "/res_engine/tools/ouiAce/zip/";
/**
 * @desc 压缩文件;
 * @event onprogress, onend, onerror;
 * */
var ZipArchive = function () {
    function noop() {
    };
    this.name = "未命名文件";
    this.zippedBlob = {};
    var _this = this;
    this.length = 0;
    this.onend = noop;
    this.onerror = noop;
    this.onprogress = noop;
    //创建一个延迟对象;
    var def = this.defer = new $.Deferred();
    zip.createWriter(new zip.BlobWriter("application/zip"), function (zipWriter) {
        _this.zipWriter = zipWriter;
        //继续执行队列;
        def.resolve();
    }, this.error);
};

ZipArchive.blob = function (filename, content) {
    return new Blob([content], {
        type: zip.getMimeType(filename)
    });
};

$.extend(ZipArchive.prototype, {
    /**
     * @desc 添加文件
     * @param String filename为文件的名字;
     * @param String content;
     * @param Object options 传参
     *   例如：{ level : 0} 压缩的等级，0 到 9；
     *   例如：{ comment : "提示文字" }
     *   例如：{ lastModDate : "最后编辑时间" }
     * */
    "addFile": function (filename, content, options) {
        var _this = this;
        //为了产生链式的效果， 必须把deferrer赋值给新的defer
        this.defer = this.defer.then(function () {
            var def = $.Deferred();
            var blob = ZipArchive.blob(filename, content);
            _this.zipWriter.add(filename, new zip.BlobReader(blob)
                , function () { // reader
                    console.log("addFile success!!");
                    def.resolve();
                    //zipWriter.close(callback);
                }, function (size, total) { //onend
                    _this.onend(filename, blob, total);
                    _this.length += total;
                }, function () { //onprogress
                    _this.onprogress(filename, blob, total);
                }, options || {
                    //options
                });

            return def;
        });
    },

    /**
     * @desc 添加文件夹, 我发现这个文件无法创建;
     * @desc 创建文件夹功能不好用, 需要创建文件夹你通过 zipWriter.addFile("directory/filename.txt", blob())创建文件夹和对应文件;;
     * */
    "_addFolder": function (foldername, options) {
        //创建文件夹功能目前不能用;
        //创建文件夹功能不好用, 直接通过 zipWriter.addFile("directory/filename.txt", blob())创建文件夹和文件
        return this;
    },

    "size": function () {
        return this.length;
    },

    /**
     * @desc 获取blob文件
     * */
    "get": function () {
        return this.zippedBlob;
    },

    /**
     * @desc 导出为zip文件
     * */
    "export": function (name) {
        name = name || this.name;
        var _this = this;
        this.defer.then(function () {
            _this.zipWriter.close(function (zippedBlob) {
                if (typeof name === "string" || typeof name === "number") {
                    var downloadButton = document.createElement("a"),
                        URL = window.webkitURL || window.mozURL || window.URL;
                    downloadButton.href = URL.createObjectURL(zippedBlob);
                    downloadButton.download = name + ".zip";
                    downloadButton.click();
                } else {
                    name(zippedBlob);
                }
                ;
            });
        });
    },

    "error": function () {
        this.onerror(this);
        throw new Error("压缩文件创建失败");
    }
});

/**
 * @desc 解压缩文件的类;
 * @return UnZipArchive 的实例;
 * */
var UnZipArchive = function( blob ) {
    if( !blob ) {
        alert("参数不正确, 需要一个Blob类型的参数");
        return ;
    };
    if( !(blob instanceof Blob) ) {
        alert("参数不是Blob类型");
        return ;
    };

    function noop() {};
    this.entries = {};
    this.zipReader = {};
    var _this = this;
    this.length = 0;
    this.onend = noop;
    this.onerror = noop;
    this.onprogress = noop;
    //创建一个延迟对象;
    var def = this.defer = new $.Deferred();
    zip.createReader( new zip.BlobReader( blob ), function(zipReader) {
        _this.zipReader = zipReader;
        zipReader.getEntries(function(entries) {
            _this.entries = entries;
            //继续执行队列;
            def.resolve();
        });
    }, this.error.bind(_this) );
};

/**
 * @desc 把blob文件转化为dataUrl;
 * */
UnZipArchive.readBlobAsDataURL = function (blob, callback) {
    var f = new FileReader();
    f.onload = function(e) {callback( e.target.result );};
    f.readAsDataURL(blob);
};

$.extend( UnZipArchive.prototype, {
    /**
     * @desc 获取压缩文件的所有入口;
     * @return ArrayList;
     * */
    "getEntries" : function() {
        var result = [];
        for(var i= 0, len = this.entries.length ; i<len; i++ ) {
            result.push( this.entries[i].filename );
        }
        return result;
    },

    /**
     * @desc 获取文件Entry;
     * @return Entry
     * */
    "getEntry" : function ( filename ) {
        var entrie;
        for(var i= 0, len = this.entries.length ; i<len; i++ ) {
            if( this.entries[i].filename === filename) {
                return this.entries[i];
            };
        }
    },

    /**
     * @desc 下载文件
     * @param filename;
     * @return void;
     * */
    "download" : function ( filename , cb , runoninit) {
        var _this = this;
        this.defer = this.defer.then(function() {
            var def = $.Deferred();
            if(!filename) return ;
            if(runoninit) {
                return runoninit();
            };
            var entry = _this.getEntry( filename );
            if(!entry)return;
            entry.getData(new zip.BlobWriter(zip.getMimeType(entry.filename)), function(data) {
                if( !cb ) {
                    UnZipArchive.readBlobAsDataURL(data, function( dataUrl ) {
                        var downloadButton = document.createElement("a"),
                            URL = window.webkitURL || window.mozURL || window.URL;
                        downloadButton.href = dataUrl;
                        downloadButton.download = filename;
                        downloadButton.click();
                        def.resolve( dataUrl );
                        _this.onend();
                    });
                }else{
                    cb( data ,filename);
                    def.resolve( data );
                }
            });
            return def;
        });
    },

    /**
     * @desc 获取对应的blob数据;
     * @param filename 文件名;
     * @param callback回调, 参数为 blob;
     * @desc 或者可以直接传一个函数作为zip解压缩完毕的回调;
     * */
    "getData" : function ( filename, fn ) {
        if( typeof filename === "string") {
            this.download(filename, function( blob ) {
                fn&&fn( blob );
            });
        }else if( typeof filename === "function") {
            this.download("test", null, function( blob ) {
                filename();
            });
        };
    },

    "error" : function() {
        this.onerror( this );
        throw new Error("压缩文件解压失败");
    }
});

