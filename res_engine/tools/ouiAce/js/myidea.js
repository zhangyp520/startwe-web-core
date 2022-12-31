!(function(){

    var MyIdea = {
        "package": "oui.myidea",
        "class": "MyIdea",
        init:function(){
            template.helper('MyIdea', MyIdea);
            MyIdea.buildLeftTree();
            MyIdea.buildLayout();
        },
        factoryJson:null,
        currNode:null,
        currSourceType:'view',
        jspTplHtml:'',
        javascriptTplHtml:'',
        pcTplHtml:'',
        phoneTplHtml:'',
        fileCache:{

        },
        undoMap:{ //历史代码,ctrl+z,ctrl+y实现切换获取历史代码信息

        },
        /**视图的相关模板文件 ****/
        viewTplConfig:{
            'phone':'res_engine/tools/ouiAce/js/phone.tpl.html',
            'pc':'res_engine/tools/ouiAce/js/pc.tpl.html',
            'design':'res_engine/tools/ouiAce/js/design.tpl.html',
            'view':'res_engine/tools/ouiAce/js/view.tpl.html',
            'jsp':'res_engine/tools/ouiAce/js/jsp.tpl.html',
            'js':'res_engine/tools/ouiAce/js/js.tpl.html',
            'css':'res_engine/tools/ouiAce/js/css.tpl.html',
            'images':'res_engine/tools/ouiAce/js/images.tpl.html',
            /** 设计态使用模板****/
            'nodeEditProp':'res_engine/tools/ouiAce/js/design/nodeEditProp.tpl.html'
        },
        /*** 节点类型枚举****/
        treeNodeTypeEnum : {
            proList:{
                name:'proList',
                value:1,
                desc:'项目列表'
            },
            industryCompList:{
                name:'industryCompList',
                value:2,
                desc:'行业组件列表'
            },
            industryComponent:{
                name:'industryComponent',
                value:3,
                desc:'行业组件',
                /**创建新节点对应的数据 ****/
                buildNewNodeData:function(parentNode,item){
                    return {
                        "id":oui.getUUIDLong(),
                        "desc":'', //描述信息
                        "pid":parentNode.id,
                        "name":"新建行业组件",
                        "fileName":"new",
                        "pkg":'com.new',
                        "webDir":'res_common/third',
                        "fullPath":parentNode.fullPath+'/'+'new',
                        "nodeType":MyIdea.treeNodeTypeEnum.industryComponent.value
                    };
                }
            },
            project:{
                name:'project',
                value:4,
                desc:'项目',
                /**创建新节点对应的数据 ****/
                buildNewNodeData:function(parentNode,item){
                    return {
                        "id":oui.getUUIDLong(),
                        "desc":'', //描述信息
                        "pid":parentNode.id,
                        "name":"新建项目",
                        "fileName":"new",
                        "pkg":'com.new',
                        "webDir":'res_apps',
                        "fullPath":parentNode.fullPath+'/'+'new',
                        "nodeType":MyIdea.treeNodeTypeEnum.project.value
                    };
                }
            },
            mod:{
                name:'mod',
                value:5,
                desc:'模块',
                /**创建新节点对应的数据 ****/
                buildNewNodeData:function(parentNode,item){
                    return {
                        "id":oui.getUUIDLong(),
                        "desc":'', //描述信息
                        "pid":parentNode.id,
                        "name":"新建模块",
                        "fileName":"new",
                        "pkg":parentNode.pkg+'.new',
                        "webDir":parentNode.webDir+'/new',
                        "fullPath":parentNode.fullPath+'/'+'new',
                        "nodeType":MyIdea.treeNodeTypeEnum.mod.value
                    };
                }
            },
            component:{
                name:'component',
                value:6,
                desc:'公共组件',
                /**创建新节点对应的数据 ****/
                buildNewNodeData:function(parentNode,item){
                    return {
                        "id":oui.getUUIDLong(),
                        "desc":'', //描述信息
                        "pid":parentNode.id,
                        "name":"新建公共组件",
                        "fileName":"new",
                        "pkg":parentNode.pkg+'.new',
                        "webDir":'res_engine',
                        "fullPath":parentNode.fullPath+'/'+'new',
                        "nodeType":MyIdea.treeNodeTypeEnum.component.value
                    };
                }
            },
            view:{
                name:'view',
                value:7,
                desc:'视图',
                /**创建新节点对应的数据 ****/
                buildNewNodeData:function(parentNode,item){
                    return {
                        "id":oui.getUUIDLong(),
                        "desc":'', //描述信息
                        "pid":parentNode.id,
                        "name":"新建视图",
                        "fileName":"new",
                        "pkg":parentNode.pkg,
                        "webDir":parentNode.webDir,
                        "fullPath":parentNode.fullPath+'/'+'new.view',
                        "nodeType":MyIdea.treeNodeTypeEnum.view.value
                    };
                }
            },
            factory:{
                name:'factory',
                value:8,
                desc:'我的工程'
            }
        },
        /***获取当前节点的图片  ****/
        findImagePaths:function(imageFolder){
            var fileCaches = MyIdea.fileCache;
            var paths = [];
            for(var i in fileCaches){
                if(!fileCaches[i]){
                    continue;
                }
                if(i.indexOf(imageFolder)>=0){
                    if(MyIdea.isPicture(i)){
                        paths.push(i);
                    }
                }
            }
            return paths;
        },
        /***
         * 获取视图节点配置
         * ***/
        findViewNodeConfig : function(treeNode){
            var pkg = treeNode.pkg;
            var dir =treeNode.webDir;
            var name =  treeNode.fileName;
            var cssPath = dir+'/css/'+name+'.css';
            var jsPath = dir+'/js/'+name+'.js';
            var htmlPcPath = dir+'/'+name+'.pc.html';
            var htmlPhonePath = dir+'/'+name+'.phone.html';
            var jspPath = dir+'/'+name+'.jsp';
            var jsInitCode = treeNode.jsInitCode || "oui.parse();";
            var jsDataJson= treeNode.jsDataJson || {};
            var jsMethods = treeNode.jsMethods||[];
            var jsEvents = treeNode.jsEvents ||[];

            var imageFolder = dir+'/images/';
            var imagePaths = MyIdea.findImagePaths(imageFolder);
            var controllerName = (name.toUpperCase().charAt(0)+name.substring(1,name.length));
            var data = {
                pkg:pkg,
                viewId:name,
                controllerName:controllerName,
                controller:pkg+'.'+controllerName,
                jsInitCode:jsInitCode,//,jsDataJsonString,jsMethods,jsEvents
                jsDataJson:jsDataJson,
                jsMethods:jsMethods,
                jsEvents:jsEvents,

                oui_contextPath:oui.getContextPath(),
                oui_css_version:'?t_='+(new Date().getTime()),
                oui_js_version:'?t_='+(new Date().getTime()),
                title:treeNode.name,
                htmlPcPath:htmlPcPath,
                htmlPhonePath:htmlPhonePath,
                jspPath:jspPath,
                content: MyIdea.fileCache[treeNode.fullPath] ||"" ,
                designContent:MyIdea.viewCode2DesignCode(MyIdea.fileCache[treeNode.fullPath] ||""),
                cssContent: MyIdea.fileCache[cssPath] ||"",
                jsContent:MyIdea.fileCache[jsPath] ||"",
                cssPath:cssPath,
                jsPath:jsPath,
                imageFolder:imageFolder,
                imagePaths:imagePaths,
                extCssPaths:[],
                extJsPaths:['res_common/oui/ui/ui_common/controls/oui-view/oui-view.js']
            };
            return data;
        },
        /* 根据当前树节点获取对应的文件内容****/
        findFileContent:function(treeNode){
            var content = '';
            var config = MyIdea.findViewNodeConfig(treeNode);
            switch (MyIdea.currSourceType){
                case 'view':
                    content = config.content;
                    break;
                case 'js':
                    content = config.jsContent ||"";
                    break;
                case  'css':
                    content = config.cssContent ||"";
                    break;
            }
            return content;
        },
        click2selectFile:function(){
            //触发文件选择
            $('#import-file').click();
        },
        /** 点击事件触发 文件选择***/
        click2addImgs:function(){
            if(!MyIdea.currNode){
                return;
            }
            $('#myidea-add-img-id').click();
        },
        /** 根据日期获取编号***/
        getStrByDate: function () {
            var date = new Date();
            var cfg = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hh: date.getHours(),
                mm: date.getMinutes(),
                ss: date.getSeconds()
            };
            var temp = {};
            for(var i in cfg){
                if(cfg[i] <10){
                    temp[i] = "0"+(""+cfg[i]);
                }else{
                    temp[i] =""+cfg[i];
                }
            }
            if(!MyIdea._renderDateStr){
                MyIdea._renderDateStr = template.compile("{{year}}_{{month}}_{{day}}_{{hh}}_{{mm}}_{{ss}}");
            }
            var str = MyIdea._renderDateStr(temp);
            return str;
        },
        /** 64 位图片路径转blob对象****/
        dataUrl2Blob:function(dataurl){
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        },
        files2Blob:function(files,fun){
            var blobs = [];
            $.each(files,function(){
                var fileName = this.name;
                var reader = new FileReader();
                reader.fileName=fileName;
                reader.onload = function(e) {
                    var blob = MyIdea.dataUrl2Blob(e.target.result);
                    blob.name = reader.fileName;
                    blobs.push(blob);
                    if(blobs.length == files.length){
                        fun&&fun(blobs);
                    }
                };
                reader.readAsDataURL(this);
            });
        },
        /** 图片路径转 dataUrl****/
        paths2dataUrlMap:function(paths,fun){
            var temp = {};
            var cfg= {count:paths.length};
            $.each(paths,function(){
                var reader = new FileReader(); //通过 FileReader 读取blob类型
                reader.path = this.toString();
                reader.onload = function(){
                    var result = this.result;
                    temp[this.path] = result;
                    cfg.count--;
                    if(cfg.count <=0){
                        fun&&fun(temp);
                        cfg =null;
                        delete cfg;
                    }
                }
                reader.readAsDataURL(MyIdea.fileCache[this.toString()]);
            });
        },
        /** 文件选择 值改变触发添加***/
        event2addImgs:function(cfg){
            if(!MyIdea.currNode){
                return;
            }
            var config = MyIdea.findViewNodeConfig(MyIdea.currNode);
            var imageFolder = config.imageFolder;
            var files = cfg.el.files;
            var fileCaches = MyIdea.fileCache;
            if(files&&files.length){
                MyIdea.files2Blob(files,function(blobs){
                    $.each(blobs,function(){
                        var fileName = this.name;
                        var prefixName= fileName.substring(0,fileName.lastIndexOf('.'));
                        var endx = fileName.replace(prefixName,'');
                        var currPath = imageFolder+this.name;
                        if(fileCaches[currPath]){
                            currPath = imageFolder+prefixName+MyIdea.getStrByDate()+endx;
                        }
                        fileCaches[currPath] = this;
                    });
                    MyIdea.event2ViewImages();//刷新图片显示
                });

            }
        },
        event2loadFactory:function(cfg){
            var files = cfg.el.files;
            if(files&&files.length){
                var file = files[0];
                if(MyIdea.factoryJson){
                    oui.getTop().oui.confirmDialog('当前工程没保存，确定导入',function(){
                        MyIdea.loadFactory(file,function(){//加载完成后，初始化设计器
                            $('#import-file').val('');//加载完成后清空
                            MyIdea.init();
                        });
                    },function(){
                        $('#import-file').val('');//加载完成后清空
                    });

                }else{
                    MyIdea.loadFactory(file,function(){//加载完成后，初始化设计器
                        $('#import-file').val('');//加载完成后清空
                        MyIdea.init();
                    });
                }
            }
        },
        /**判断一个路径是否为图片 *****/
        isPicture:function(src){
            var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|";
            if(src.indexOf(".")>-1)
            {
                var p = src.lastIndexOf(".");
                var strPostfix=src.substring(p,src.length) + '|';
                strPostfix = strPostfix.toLowerCase();
                if(strFilter.indexOf(strPostfix)>-1)
                {
                    return true;
                }
            }
            return false;
        },
        loadFactory:function(file,fun){
            MyIdea.currReadFileLength = 0;
            MyIdea.zipFile = new UnZipArchive( file );
            MyIdea.zipFile.getData( function() {
                var arr = MyIdea.zipFile.getEntries();
                MyIdea.currReadFileLength = arr.length;
                for(var i=0; i<arr.length; i++ ) {
                    MyIdea.zipFile.download(arr[i],function(blob,fileName){
                        MyIdea.readPath2fileCache(blob,fileName,fun);
                    });
                };
            });
        },
        /** 文件读取并缓存 到fileCache****/
        readPath2fileCache:function(blob,fileName,fun){
            var read=new FileReader(); //创建读取器对象FileReader
            if(MyIdea.isPicture(fileName)){//如果是图片则缓存blob数据
                MyIdea.fileCache[fileName] = blob;
                MyIdea.currReadFileLength--;
                if(MyIdea.currReadFileLength<=0){//加载完成
                    fun&&fun();
                }
                //read.readAsBinaryString(blob);
                //read.fileName = fileName;
                //read.onload=function () {
                //    MyIdea.fileCache[read.fileName] = read.result;
                //    MyIdea.currReadFileLength--;
                //    if(MyIdea.currReadFileLength<=0){//加载完成
                //        fun&&fun();
                //    }
                //}
            }else{
                read.readAsText(blob);  //开始读取文件
                read.fileName = fileName;
                read.onload=function () {
                    MyIdea.fileCache[read.fileName] = read.result;
                    MyIdea.currReadFileLength--;
                    if(MyIdea.currReadFileLength<=0){//加载完成
                        fun&&fun();
                    }
                }
            }
        },
        /*
         <button oui-e-click="event2ViewSource">视图源代码</button>
         */
        event2ViewSource:function(){
            if(!MyIdea.currNode){
                return ;
            }
            MyIdea.currSourceType ='view';
            MyIdea.buildAce();
        },
        /**
         *
         <button oui-e-click="event2ViewDesign" >视图设计器</button>
         *
         */
        event2ViewDesign:function(){
            if(!MyIdea.currNode){
                return ;
            }
            MyIdea.currSourceType ='design';
            MyIdea.buildAce();
        },
        /**
         *
         <button oui-e-click="event2ViewJs">JS</button>
         */
        event2ViewJs:function(){
            if(!MyIdea.currNode){
                return ;
            }
            MyIdea.currSourceType ='js';
            MyIdea.buildAce();
        },
        /**
         <button oui-e-click="event2ViewCss">CSS</button>
         */
        event2ViewCss:function(){
            if(!MyIdea.currNode){
                return ;
            }
            MyIdea.currSourceType ='css';
            MyIdea.buildAce();
        },
        /***
         <button oui-e-click="event2ViewImages">Images</button>
         */
        event2ViewImages:function(){
            if(!MyIdea.currNode){
                return ;
            }
            MyIdea.currSourceType ='images';
            MyIdea.buildAce();
        },
        export:function(){
            //解析当前文件json
            var json = MyIdea.factoryJson ;
            var treeNodeTypeEnum = MyIdea.treeNodeTypeEnum;
            if(!json){
                oui.getTop().alert('当前没有工程');
                return ;
            }
            var z = new ZipArchive();
            var cfg  ={};
            for(var i= 0,len=json.length;i<len;i++){
                if(json[i].nodeType == treeNodeTypeEnum.view.value){
                    z.addFile(json[i].fullPath, MyIdea.fileCache[json[i].fullPath]);
                    var config =  MyIdea.findViewNodeConfig(json[i]);
                    /** 导出静态 html文件时的contextPath根据斜杠计算相对路径****/

                    var htmlContextPath='../';
                    var tempContextPath ='';
                    var splitLen = config.htmlPcPath.split('\/').length;
                    splitLen = splitLen-1;
                    for(var k=0;k<splitLen;k++){
                        tempContextPath +=htmlContextPath;
                    }
                    config.oui_contextPath = tempContextPath;
                    z.addFile(config.jsPath,MyIdea.fileCache[config.jsPath]);
                    z.addFile(config.cssPath,MyIdea.fileCache[config.cssPath]);
                    var pcHtml = MyIdea.renderByTpl(config,'pc');
                    var phoneHtml = MyIdea.renderByTpl(config,'phone');
                    var jsp = MyIdea.renderByTpl(config,'jsp');
                    z.addFile(config.htmlPcPath,pcHtml);
                    z.addFile(config.htmlPhonePath,phoneHtml);
                    z.addFile(config.jspPath,jsp);
                    var imagesPaths = config.imagePaths||[];
                    $.each(imagesPaths,function(){
                        var imgPath = this.toString();
                        cfg[imgPath] = MyIdea.fileCache[imgPath];
                    });
                    if(!MyIdea.commonResource){
                        var scripts = [];
                        var links = [];
                        $(pcHtml+phoneHtml).each(function(){
                            if($(this).is('script') || $(this).is('link')){
                                var src = $(this).attr('src') || $(this).attr('href');
                                if(src){
                                    var path ='';
                                    if(src.indexOf('/')==0){
                                        path = src.substring(1,src.length);
                                    }else{
                                        path = src.substring(tempContextPath.length,src.lastIndexOf('?'));
                                    }
                                    if((!path) || (path == tempContextPath)){
                                        return ;
                                    }

                                    if(path == config.htmlPcPath || path == config.htmlPhonePath || path == config.jsPath || path == config.cssPath){
                                        return ;
                                    }
                                    var url = oui.getContextPath()+path;
                                    if(!cfg[path]){
                                        console.log(path);
                                        var content = oui.loadUrl(url,false);
                                        cfg[path] = content;
                                    }
                                }
                            }
                        });
                        MyIdea.commonResource = true;
                    }
                }
            }
            //common 公共资源 处理

            for(var i in cfg){
                if(cfg.hasOwnProperty(i)){
                    z.addFile(i,cfg[i]);
                }
            }
            z.addFile('factory/myidea.json',oui.parseString(json));
            z.export("myidea");
            MyIdea.commonResource = false;
        },
        /** 创建新工程****/
        event2createFactory:function(){
            var treeNodeTypeEnum = MyIdea.treeNodeTypeEnum;
            if(MyIdea.factoryJson){
                oui.getTop().oui.confirmDialog('当前工程没保存，确定新建',function(){

                    MyIdea.initEmptyFactory();
                },function(){

                });
            }else{
                MyIdea.initEmptyFactory();
            }
        },
        /* 初始化空工程*****/
        initEmptyFactory:function(){
            var treeNodeTypeEnum = MyIdea.treeNodeTypeEnum;
            MyIdea.factoryJson = [
                {id:-1, pid:-2, name: "我的工程",displayName:"我的工程",fileName:'factory',fullPath:'factory',nodeType:treeNodeTypeEnum.factory.value},
                {id:1, pid:-1, name: "项目列表",displayName:"项目列表", fileName:'projects',fullPath:'factory/projects', nodeType:treeNodeTypeEnum.proList.value},
                {id:2, pid:-1, name: "行业组件列表",displayName: "行业组件列表",fileName:'industryCompList',fullPath:'factory/industryCompList',nodeType:treeNodeTypeEnum.industryCompList.value},
                {id:21, pid:2, name: "行业组件1",displayName: "行业组件1",fileName:'industryComponent1',pkg:'com.industryComponent1',webDir:'res_common/third',fullPath:'factory/industryCompList/industryComponent1',nodeType:treeNodeTypeEnum.industryComponent.value},
                {id:211, pid:21, name: "组件模块1",displayName: "组件模块1",fileName:'mod1',pkg:'com.industryComponent1.mod1',webDir:'res_common/third/mod1',fullPath:'factory/industryCompList/industryComponent1/mod1',nodeType:treeNodeTypeEnum.mod.value},

                {id:11, pid:1, name: "我的项目1", displayName: "我的项目1",fileName:'myidea1',pkg:'com.myidea1',webDir:'res_apps',fullPath:'factory/projects/myidea1' ,nodeType:treeNodeTypeEnum.project.value},
                {id:111, pid:11, name: "公共组件", displayName: "公共组件",fileName:'common',pkg:'com.myidea1.common',webDir:'res_engine',fullPath:'factory/projects/myidea1/common',nodeType:treeNodeTypeEnum.component.value},
                {id:112, pid:11, name: "模块1",displayName: "模块1",fileName:'mod1',pkg:'com.myidea1.mod1',webDir:'res_apps/mod1',fullPath:'factory/projects/myidea1/mod1',nodeType:treeNodeTypeEnum.mod.value},
                {id:1121, pid:112, name: "视图1",displayName: "视图1",fileName:'view1',pkg:'com.myidea1.mod1',webDir:'res_apps/mod1',fullPath:'factory/projects/myidea1/mod1/view1.view',nodeType:treeNodeTypeEnum.view.value},

                {id:1122, pid:112, name: "视图2",displayName: "视图2",fileName:'view2',pkg:'com.myidea1.mod1',webDir:'res_apps/mod1',fullPath:'factory/projects/myidea1/mod1/view2.view',nodeType:treeNodeTypeEnum.view.value},
                {id:12, pid:1, name: "我的项目2", displayName: "我的项目2",fileName:'myidea2',pkg:'com.myidea2',webDir:'res_apps',fullPath:'factory/projects/myidea2',nodeType:treeNodeTypeEnum.project.value}
            ];
            MyIdea.fileCache = {};
            var json = MyIdea.factoryJson;
            var idx = 0;
            for(var i= 0,len=json.length;i<len;i++){
                if(json[i].nodeType == treeNodeTypeEnum.view.value){
                    idx++;
                    var config  = MyIdea.findViewNodeConfig(json[i]);
                    MyIdea.fileCache[json[i].fullPath] = MyIdea.renderByTpl(config,'view');
                    var jsContent = MyIdea.renderByTpl(config,'js');
                    var cssContent = MyIdea.renderByTpl(config,'css');
                    MyIdea.fileCache[config.jsPath] = jsContent;
                    MyIdea.fileCache[config.cssPath] = cssContent;

                }
            }
            MyIdea.fileCache['factory/myidea.json'] = oui.parseString(json);
            MyIdea.init();
        },
        findPos:function(obj){
            if(obj.getBoundingClientRect){
                var pos = obj.getBoundingClientRect();
                return pos;
            }
            var curleft = 0;
            var curtop = 0;
            if (obj.offsetParent) {
                curleft = obj.offsetLeft
                curtop = obj.offsetTop
                while (obj = obj.offsetParent) {
                    curleft += obj.offsetLeft
                    curtop += obj.offsetTop
                }
            }
            return {left:curleft,top:curtop};
        },
        getElPos:function (el) {
            var pos = MyIdea.findPos($(el)[0]);
            pos = {
                left:pos.left-MyIdea.treeWidth,
                top:pos.top-MyIdea.menuHeight
            };
            var width = $(el).outerWidth();
            var height = $(el).outerHeight();
            var currRight = width + pos.left;
            var currBottom = height + pos.top;
            var scrollLeft =$('#design-container')[0].scrollLeft;
            var scrollTop = $('#design-container')[0].scrollTop;
            var curr = {
                left: pos.left,
                top: pos.top,
                right: currRight,
                bottom: currBottom
            };
            //var curr = $(el)[0].getBoundingClientRect();
            return curr;
        },
        selectArea:function(area,isHover){
            isHover = !!isHover;
            var hoverEndx = isHover?'-hover':'';
            var leftSelector ='select-div-left'+hoverEndx;
            var topSelector = 'select-div-top'+hoverEndx;
            var rightSelector ='select-div-right'+hoverEndx;
            var bottomSelector = 'select-div-bottom'+hoverEndx;
            var containerSelector = 'design-container';
            var $left = $('#'+leftSelector);
            var $top = $('#'+topSelector);
            var $right = $('#'+rightSelector);
            var $bottom = $('#'+bottomSelector);
            var hoverBorder = isHover?'select-div-border-hover ':'';
            var border= 'select-div-border';
            if ((!$left) || (!$left.length)) {
                $('#'+containerSelector).append('<div id="'+leftSelector+'" class="'+border+' '+(hoverBorder)+'select-div-left"></div>');
                $('#'+containerSelector).append('<div id="'+topSelector+'" class="'+border+' '+(hoverBorder)+'select-div-top"></div>');
                $('#'+containerSelector).append('<div id="'+rightSelector+'" class="'+border+' '+(hoverBorder)+'select-div-right"></div>');
                $('#'+containerSelector).append('<div id="'+bottomSelector+'" class="'+border+' '+(hoverBorder)+'select-div-bottom"></div>');
                $left = $('#'+leftSelector);
                $top = $('#'+topSelector);
                $right = $('#'+rightSelector);
                $bottom = $('#'+bottomSelector);
            }
            $(['#'+leftSelector,'#'+topSelector,'#'+rightSelector,'#'+bottomSelector].join(',')).removeClass('display_none');
            $left.css({
                left: area.left,
                top: area.top,
                height: (area.bottom - area.top) + 'px'
            });
            $right.css({
                left: area.right - 2,
                top: area.top,
                height: (area.bottom - area.top) + 'px'
            });
            $top.css({
                left: area.left,
                top: area.top,
                width: (area.right - area.left) + 'px'
            });

            $bottom.css({
                left: area.left,
                top: area.bottom - 2,
                width: (area.right - area.left + 1) + 'px'
            });
        },
        /**事件触发选中控件 ****/
        event2selectedControl:function($el,isHover){
            if((!$el) || (!$el.length)){
                return ;
            }
            if(!isHover){
                console.log('selected..');
            }
            var area = MyIdea.getElPos($el);
            MyIdea.selectArea(area,isHover);
            var ouiId = $el.attr('ouiId');
            if(ouiId){
                var control = oui.getByOuiId(ouiId);
                if(control){
                    if(!isHover){
                        console.log(control);
                    }
                }
            }
        },
        /**隐藏选择区域 ****/
        event2hideSelectArea:function(isHover){
            isHover = !!isHover;
            var hoverEndx = isHover?'-hover':'';
            var leftSelector ='select-div-left'+hoverEndx;
            var topSelector = 'select-div-top'+hoverEndx;
            var rightSelector ='select-div-right'+hoverEndx;
            var bottomSelector = 'select-div-bottom'+hoverEndx;
            $(['#'+leftSelector,'#'+topSelector,'#'+rightSelector,'#'+bottomSelector].join(',')).addClass('display_none');
        },
        bindTimeOutFun:function(fun){
            if(MyIdea._timerTemp){
                window.clearTimeout(MyIdea._timerTemp);
                MyIdea._timerTemp = null;
            }
            MyIdea._timerTemp = window.setTimeout(
                function(){
                    fun&&fun();
                    MyIdea._timerTemp = null;
                },1
            );
        },
        bindScroll:function(el,scrollFun,fun){
            if(!el){
                return ;
            }
            if(MyIdea.scrollTimer){
                clearInterval(MyIdea.scrollTimer);
            }
            MyIdea.scrollTimer =null;
            MyIdea.scrollTopValue = 0;
            $(el).off('scroll');
            $(el).on('scroll',function(){
                scrollFun&&scrollFun();
                if(MyIdea.scrollTimer==null){
                    MyIdea.scrollTimer= setInterval(function(){
                        if(el.scrollTop==MyIdea.scrollTopValue){
                            clearInterval(MyIdea.scrollTimer);
                            fun&&fun();
                            MyIdea.scrollTimer=null;
                        }
                    },1000);//这里就是判定时间，当前是1秒一判定
                }
                MyIdea.scrollTopValue=el.scrollTop;
            });
        },
        /** 绑定视图设计器事件*****/
        bindDesignEvents:function(){
            var Events = oui.biz.Events;
            var selector ='#design-container *';
            $(document).off('click','.select-div-border-hover');
            $(document).on('click','.select-div-border-hover',function(e){
                var $el = $('.oui-active');
                MyIdea.bindTimeOutFun(function(){
                    MyIdea.event2selectedControl($el);
                });
            });
            $(document).off('click',selector);
            $(document).on('click',selector,function(e){
                $(selector).removeClass('oui-selected');
                $(selector).removeClass('oui-active');
                var target = Events.getEventTarget(e);
                var $el = $(target).closest('[ouiid]');
                $(selector).removeClass('oui-design');//保证还能继续选中控件
                $el.addClass('oui-design');//保证还能继续选中控件
                $el.addClass('oui-selected');
                $($el).addClass('oui-active');
                MyIdea.bindTimeOutFun(function(){
                    MyIdea.event2selectedControl($el);
                });
            });
            $(document).off('mouseenter',selector);
            $(document).on('mouseenter',selector,function(e){
                //e.originalEvent.preventDefault();
                //e.originalEvent.stopPropagation();
                if( MyIdea.isDesignScroll){
                    return ;
                }
                $(selector).removeClass('oui-active');
                var target = Events.getEventTarget(e);
                var $el = $(target).closest('[ouiid]');
                $($el).addClass('oui-active');
                MyIdea.bindTimeOutFun(function(){
                    MyIdea.event2selectedControl($el,true);
                });
            });

            $(document).off('mouseleave',selector);
            $(document).on('mouseleave',selector,function(e){
                //e.originalEvent.preventDefault();
                //e.originalEvent.stopPropagation();
                $(selector).removeClass('oui-active');
                $(selector).removeClass('oui-design');//保证还能继续选中控件
                MyIdea.bindTimeOutFun(function(){
                    MyIdea.event2hideSelectArea(true);
                });
            });
            MyIdea.bindScroll(document.getElementById('design-container'),function(){
                MyIdea.isDesignScroll = true;
                MyIdea.event2hideSelectArea();
            },function(){
                MyIdea.isDesignScroll = false;
                $('.oui-selected').trigger('click');
            });
        },
        /** parse完成后对图片进行处理 ****/
        replaceImgByFileCache:function(win,container,fun){
            var arr = [];
            var paths = [];
            var fileCache = this.fileCache;
            win.$('img,image',container).each(function(){
                var src = $(this).attr('src');
                src = src.replace(win.oui.getContextPath(),'');
                if(fileCache[src]){
                    arr.push(this);
                    if(paths.indexOf(src)<0){
                        paths.push(src);
                    }
                }
            });
            MyIdea.paths2dataUrlMap(paths,function(cfg){
                $.each(arr,function(){
                    var src = $(this).attr('src');
                    src = src.replace(win.oui.getContextPath(),'');
                    this.src = cfg[src];
                });
                fun&&fun();
            });

        },
        /***
         * 替换css内容中的 图片路径 为64位编码
         * @param cssText
         */
        replaceHtmlCssImgByFileCache:function(config,html,fun){
            var imageFolder = config.imageFolder;
            var imagePaths = config.imagePaths ;
            var reg=/(?=url\()[^)]+(?=\))/g;
            var cssText = html;
            var result = cssText.match(reg);
            if(!result){
                fun&&fun(cssText);
                return ;
            }
            var paths = [];
            for(var i = 0,len=result.length;i<len;i++){
                var strArr =result[i].split('../');
                if(strArr.length==2){
                    var currPath = strArr[1];
                    currPath = currPath.split('\/');
                    if(currPath.length==2){
                        currPath = currPath[1];
                        currPath = currPath.replace(/\"/g,"").replace(/\'/g,"");
                        currPath = imageFolder+currPath;
                    }
                    if(imagePaths.indexOf(currPath)>-1){
                        if(paths.indexOf(currPath)<0){
                            paths.push(currPath);
                        }
                    }
                }
            }
            if(paths&&paths.length){
                MyIdea.paths2dataUrlMap(paths,function(urlMap){
                    cssText = cssText.replace(reg,function(temp){
                        var strArr =temp.split('../');
                        if(strArr.length==2){
                            var currPath = strArr[1];
                            currPath = currPath.split('\/');
                            if(currPath.length==2){
                                currPath = currPath[1];
                                currPath = currPath.replace(/\"/g,"").replace(/\'/g,"");
                                currPath = imageFolder+currPath;
                            }
                            if(imagePaths.indexOf(currPath)>-1){
                                return  'url('+urlMap[currPath];
                            }
                        }
                        return temp;
                    });
                    fun&&fun(cssText);
                });
            }else{
                fun&&fun(cssText);
            }
        },
        buildDeign:function(){
            var Events = oui.biz.Events;
            MyIdea.bindDesignEvents();
            $('#editor').addClass('display_none');
            var $container =  $('#design-container');
            $container.removeClass('display_none');
            oui.clearByContainer($container);
            var controller =  $('#design-container').attr('oui-controller');
            try{
                if(controller){
                    oui.biz.Tool.Clear(oui.parseJson(controller));
                    window.__jsclazz_.Clz_Data[controller] = null;
                    oui.Tool.creating[controller] = false;
                    oui.JsonPathUtil.setObjByPath(controller,window,undefined,true);
                }
            }catch(e){

            }
            try{
                $('[oui-controller]',$container).each(function(){
                    var controller =  $(this).attr('oui-controller');
                    oui.biz.Tool.Clear(oui.parseJson(controller));
                    window.__jsclazz_.Clz_Data[controller] = null;
                    oui.Tool.creating[controller] = false;
                    oui.JsonPathUtil.setObjByPath(controller,window,undefined,true);
                });
            }catch(e){

            }
            var config = MyIdea.findViewNodeConfig(MyIdea.currNode);
            $('#design-container').attr('oui-controller',config.controller);
            var runcode = MyIdea.getDesignCode(MyIdea.currNode);
            MyIdea.replaceHtmlCssImgByFileCache(config,runcode,function(html){
                runcode = html;
                runcode = runcode.replace(/<oui-form/ig,'<oui-form right="design" ');
                try{
                    $('#design-container').html(runcode);
                    window.initAfter = function(){
                        oui.parse();
                        //初始化完成后 处理图片路径问题
                        MyIdea.replaceImgByFileCache(window,"#design-container",function(){

                        });
                    };
                }catch(e){
                    console.log(e);
                }
            });

        },
        /**
         * 删除图片选择器中选中的图片
         */
        deleteSelectedImgs:function(){
            if(!MyIdea.currNode){
                return ;
            }
            var config = MyIdea.findViewNodeConfig(MyIdea.currNode);
            var paths = config.imagePaths||[];
            var $container =  $('#design-container');
            var $itemImg =   $container.find('.img-item-selected');
            var selected= [];
            $itemImg.find('input:checked').each(function(){
                var value = $(this).val();
                selected.push(value);
            });
            $itemImg.remove();
            $.each(selected,function(){
                var v = this.toString();
                var currPath = paths[v];
                MyIdea.fileCache[currPath] = null;
                delete MyIdea.fileCache[currPath];
            })
        },
        event2deleteSelectedImgs:function(cfg){
            if(!MyIdea.currNode){
                return ;
            }
            var config = MyIdea.findViewNodeConfig(MyIdea.currNode);
            var paths = config.imagePaths||[];
            var $container =  $('#design-container');
            var $itemImg =   $container.find('.img-item-selected');
            if(!$itemImg){
                return ;
            }
            if(!$itemImg.length){
                return ;
            }
            oui.getTop().oui.confirmDialog('删除选中图片',function(){
                MyIdea.deleteSelectedImgs();
            },function(){

            });
        },
        /** 全选或者取消全选，图片选中器中的图片***/
        selectAllImgs:function(cfg){
            var el = cfg.el;
            var $container =  $('#design-container');
            var $itemImg =   $container.find('.img-item');
            var isChecked = $(el).is(':checked');
            $itemImg.find('input[type=checkbox]').each(function(){
                if(isChecked){
                    this.checked = 'checked';
                }else{
                    $(this).removeAttr('checked');
                }
            });
            if($(el).is(':checked')){
                $itemImg.addClass('img-item-selected');
            }else{
                $itemImg.removeClass('img-item-selected');
            }
        },
        /*** 事件触发选中图片 ***/
        event2selectImg:function(cfg){
            var el = cfg.el;
            var $itemImg = $(el).parent('.img-item');
            if($(el).is(':checked')){
                $itemImg.addClass('img-item-selected');
            }else{
                $itemImg.removeClass('img-item-selected');
            }
        },
        //    <input type="text" index="{{index}}" oui-e-blur="event2changeImgName" value="{{MyIdea.findFileName(item)}}"/><span>{{MyIdea.findFileEndix(item)}}</span>
        findFileName:function(path){
            var lastIndex = path.lastIndexOf('/');
            var fileName = path.substring(lastIndex+1,path.lastIndexOf('.'));
            return fileName;
        },
        /** 把div变成可编辑的****/
        event2editFileName:function(cfg){
            var edit = $(cfg.el).attr('contenteditable');
            if(edit&&(edit=='true')){
                return ;
            }
            $(cfg.el).addClass('img-name-edit');
            $(cfg.el).attr('contenteditable',true);
            $(cfg.el).focus();
        },
        event2enterblur:function(cfg){
            if (cfg.e.keyCode != 13) {
                return;
            }
            $(cfg.el).trigger('blur');
        },
        /** 失去焦点后 处理为普通div****/
        event2changeImgName:function(cfg){
            $(cfg.el).removeClass('img-name-edit');
            $(cfg.el).attr('contenteditable',false);
            $(cfg.el).html($(cfg.el).html());
        },
        /**
         * 找出文件的后缀名
         * @param path
         */
        findFileEndix:function(path){
            var lastIndex = path.lastIndexOf('.');
            var end = path.substring(lastIndex,path.length);
            return end;
        },
        /*** 显示当前节点下的图片 ***/
        showImages:function(fun){
            var Events = oui.biz.Events;
            $('#editor').addClass('display_none');
            var $container =  $('#design-container');
            $container.removeClass('display_none');
            oui.clearByContainer($container);
            var controller =  $('#design-container').attr('oui-controller');
            try{
                if(controller){
                    oui.biz.Tool.Clear(oui.parseJson(controller));
                    window.__jsclazz_.Clz_Data[controller] = null;
                    oui.Tool.creating[controller] = false;
                    oui.JsonPathUtil.setObjByPath(controller,window,undefined,true);
                }

            }catch(e){

            }
            try{
                $('[oui-controller]',$container).each(function(){
                    var controller =  $(this).attr('oui-controller');
                    oui.biz.Tool.Clear(oui.parseJson(controller));
                    window.__jsclazz_.Clz_Data[controller] = null;
                    oui.Tool.creating[controller] = false;
                    oui.JsonPathUtil.setObjByPath(controller,window,undefined,true);
                });

            }catch(e){

            }
            var config = MyIdea.findViewNodeConfig(MyIdea.currNode);
            $('#design-container').attr('oui-controller',"");
            var imagePaths = config.imagePaths ||[]; //图片路径列表
            var html = MyIdea.getImagesShowHtml(config);
            $('#design-container').html(html);
            var $imagesContainer = $('#design-container').find('.myidea-images');
            var cfg= {
                currLoadSize :imagePaths.length
            };
            var imgs= [];
            $imagesContainer.find('img').each(function(){
                var index = $(this).attr('index');
                var filePath = imagePaths[index];
                var reader    = new FileReader();
                var blob  = MyIdea.fileCache[filePath];
                reader.readAsDataURL(blob);
                imgs[index] = this;
                reader.currIndex = index;
                reader.onload = function(e) {
                    imgs[reader.currIndex].src = e.target.result;
                    cfg.currLoadSize--;
                    if(cfg.currLoadSize<=0){
                        fun&&fun(); //回调 加载完成
                    }else{
                        //loading..
                    }
                }
            });
        },
        /** 根据设计器代码获取 模板代码****/
        designCode2viewCode:function(code){
            var outer = '<div >'+code+'</div>';
            var $outer = $(outer);
            //.myidea-each,.myidea-each-expr,.myidea-if,.myidea-if-first,.myidea-else-if,.myidea-else
            var selector = '.myidea-each,.myidea-if-first,.myidea-else-if,.myidea-else';
            var selectorLen =10000 ;
            do{

                selectorLen = $outer.find(selector).length;
                $outer.find(selector).each(function(){
                    var $curr = $(this);
                    var temp = $curr.find(selector);
                    if(temp.length>0){
                        return ;
                    }
                    //处理最底层 循环、if-first、else-if、else
                    if($curr.hasClass('myidea-each')){
                        var id = $curr.attr('id');
                        var eachCode = MyIdea.codeCache[id] ||'';
                        eachCode = $.trim(eachCode);
                        var result  ='{{each '+eachCode+'}}';
                        $curr.find('[each-id='+id+']').remove();
                        var eachHtml = $curr.html();//正则寻找 _uuid_
                        var reg = /_([A-Za-z0-9]*)_/g ;
                        /***模板正常输出 ***/
                        eachHtml = eachHtml.replace(reg,function(a,b){
                            var temp = a;
                            if(typeof MyIdea.codeCache[b] !='undefined'){
                                return '{{'+MyIdea.codeCache[b]+'}}';
                            }
                            return temp;
                        });
                        result+=eachHtml;
                        result +='{{/each}}';
                        $curr[0].outerHTML = result;
                    }else if($curr.hasClass('myidea-if-first')){
                        var id = $curr.attr('id');
                        var expr = MyIdea.codeCache[id] ||'';
                        var exprCode = $.trim(expr);
                        var result  ='{{if '+exprCode+'}}';
                        $curr.find('[expr-id='+id+']').remove();
                        var html = $curr.html();//正则寻找 _uuid_
                        var reg = /_([A-Za-z0-9]*)_/g ;
                        /***模板正常输出 ***/
                        html = html.replace(reg,function(a,b){
                            var temp = a;
                            if(typeof MyIdea.codeCache[b] !='undefined'){
                                return '{{'+MyIdea.codeCache[b]+'}}';
                            }
                            return temp;
                        });
                        result+=html;
                        $curr[0].outerHTML = result;
                    }else if($curr.hasClass('myidea-else-if') ){
                        var id = $curr.attr('id');
                        var expr = MyIdea.codeCache[id] ||'';
                        var exprCode = $.trim(expr);
                        var result  ='{{else if '+exprCode+'}}';
                        $curr.find('[expr-id='+id+']').remove();
                        var html = $curr.html();//正则寻找 _uuid_
                        var reg = /_([A-Za-z0-9]*)_/g ;
                        /***模板正常输出 ***/
                        html = html.replace(reg,function(a,b){
                            var temp = a;
                            if(typeof MyIdea.codeCache[b] !='undefined'){
                                return '{{'+MyIdea.codeCache[b]+'}}';
                            }
                            return temp;
                        });
                        result+=html;
                        $curr[0].outerHTML = result;
                    }else if($curr.hasClass('myidea-else')){
                        var html = $curr.html();//正则寻找 _uuid_
                        var reg = /_([A-Za-z0-9]*)_/g ;
                        /***模板正常输出 ***/
                        html = html.replace(reg,function(a,b){
                            var temp = a;
                            if(typeof MyIdea.codeCache[b] !='undefined'){
                                return '{{'+MyIdea.codeCache[b]+'}}';
                            }
                            return temp;
                        });
                        var result = '{{else}}'+html;
                        $curr[0].outerHTML =result;
                    }
                });
            }while(selectorLen>0);
            var ifSelector = '.myidea-if';//if条件选择器集合
            var ifSelectorLen = 10000;
            do{
                var ifSelectorLen = $outer.find(ifSelector).each(function(){
                    var $curr = $(this);
                    if($curr.find(ifSelector).length>0){
                        return ;
                    }else{
                        var html = $curr.html();
                        html = html+'{{/if}}';
                        $curr[0].outerHTML = html ;
                    }
                }).length;
            }while(ifSelectorLen>0);
            var html = $outer.html();
            html= MyIdea.beautifyCode(html);
            return html;
        },

        /* TODO  根据不同的文件类型格式化****/
        beautifyCode:function(code,type){
            var js_source = code.replace(/^\s+/, '');
            var tabsize = 1;
            var tabchar = ' ';
            if (tabsize == 1) {
                tabchar = '\t';
            }
            var temp = '';
            if (js_source && js_source.charAt(0) === '<') {
                temp = style_html(js_source, tabsize, tabchar, 80);
            } else {
                temp= js_beautify(js_source, tabsize, tabchar);
            }
            return temp;
        },
        /** 根据模板代码获取设计器代码******/
        getParseTplCode : function(code){

            code = code.replace(/^\s/, ''); //替换空白字符串
            var split = code.split(' ');
            var key = split.shift();
            var args = split.join(' ');
            var uuid= oui.getUUIDLong();
            switch (key) {
                case 'if':
                    /*
                     * <div class="myidea-if" id="111" >
                     *     <div class="myidea-if-first" if-id="111" expr-id="123">
                     *        <div class="myidea-if-expr" if-id="111" target-expr-id="123">a>0</div>
                     *        <div class="myidea-val" expr-id="uuid">hello</div>
                     *     </div>
                     * </div>
                     */
                    var exprId= uuid;
                    code ='<div class="myidea-if" >';
                    code +='<div class="myidea-if-first" id="'+exprId+'" >';
                    code+='<div class="myidea-if-expr" expr-id="'+exprId+'">'+split.join(' ')+'</div> ';
                    MyIdea.codeCache[uuid]= split.join(' ');
                    break;
                case 'else':
                    var exprId= uuid;
                    if (split.shift() === 'if') {
                        code ='</div>';
                        code +='<div class="myidea-else-if" id="'+exprId+'" >';
                        code+='<div class="myidea-else-if-expr" expr-id="'+exprId+'">'+split.join(' ')+'</div> ';
                        MyIdea.codeCache[uuid]= split.join(' ');
                    } else {
                        split ='';
                        code ='</div>';
                        code +='<div class="myidea-else" >';
                    }

                    break;
                case '/if':
                    code ='</div>';
                    code +='</div>';
                    break;
                case 'each':
                    /*
                      {{each data as item index}}
                       {{/each}}
                       <div class='myidea-each' id='uuid'>
                            <div class="myidea-each-expr" each-id="uuid">data as item index</div>
                       </div>
                     *
                     */
                    //var object = split[0] || '$data';
                    //var as     = split[1] || 'as';
                    //var value  = split[2] || '$value';
                    //var index  = split[3] || '$index';
                    //var param   = value + ',' + index;
                    code = '<div class="myidea-each" id="'+uuid+'" >';
                    //each表达式
                    code += '<div class="myidea-each-expr" each-id="'+uuid+'" >'+split.join(' ')+'</div>';
                    MyIdea.codeCache[uuid]= split.join(' ');
                    break;
                case '/each':
                    code ='</div>';
                    break;
                case 'echo':
                    code = '<div class="myidea-print">'+args+'</div>';
                    break;
                case 'print':
                case 'include':
                    code = '<div class="myidea-include">'+args+'</div>';
                    //code = key + '(' + split.join(',') + ');';
                    break;
                default://默认变量输出
                    MyIdea.codeCache[uuid] = code;
                    code = "_"+uuid+"_";
                    break;
            }
            return code;
        },
        /**
         *  {{if a>0}}
         *      {{hello}}
         *  {{/if}}
         *
         * 转换为：
         * <div class="myidea-if" id="111" >
         *     <div class="myidea-if-first" target-if-id="111" expr-id="123">
         *        <div class="myidea-if-expr" target-expr-id="123">a>0</div>
         *        <div class="myidea-val" target-expr-id="123">hello</div>
         *     </div>
         * </div>
         * ***/
        viewCode2DesignCode:function(templateCode){
            //if,else,/if,/each,if else ,each, 正則获取
            var reg = new RegExp('{{([/]{0,1}[if|each|else|else if][ ]{0,1}[^\}|\{]*)}}','g');
            MyIdea.codeCache = {};
            var code = templateCode.replace(reg,function(curr,currMatch){
                var designCode = MyIdea.getParseTplCode(currMatch);
                return designCode;
            });

            //code= MyIdea.beautifyCode(code);无需美化
            //TODO 默认code 通过codeCache缓存
            return code;
        },
        /** 代码编辑器****/
        buildAce:function(){
            if(!MyIdea.currNode){
                $('.editor-container').addClass('visible_hidden');
                return ;
            }else{
                $('.editor-container').removeClass('visible_hidden');
            }
            if(MyIdea.currSourceType =='design'){
                //视图设计的场景无需显示  编辑器
                MyIdea.buildDeign();
                return ;
            }else if(MyIdea.currSourceType =='images'){
                //显示当前节点下的图片
                MyIdea.showImages(function(){

                });
                return ;
            }else{
                $('#editor').removeClass('display_none');
                $('#design-container').addClass('display_none');
            }
            // trigger extension
            ace.require("ace/ext/language_tools");
            var editor = ace.edit("editor");
            editor.getSession().setTabSize(4);
            MyIdea.editor = editor;
            switch (MyIdea.currSourceType){
                case 'view':
                    editor.session.setMode("ace/mode/html");
                    break;
                case 'js':
                    editor.session.setMode("ace/mode/javascript");
                    break;
                case  'css':
                    editor.session.setMode("ace/mode/css");
                    break;
            }
            editor.setTheme("ace/theme/tomorrow");
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
            editor.on("change",function(e){
                if( MyIdea.currNode){
                    var config = MyIdea.findViewNodeConfig(MyIdea.currNode);

                    switch (MyIdea.currSourceType){
                        case 'view':
                            MyIdea.fileCache[MyIdea.currNode.fullPath] = editor.getValue();
                            break;
                        case 'js':
                            MyIdea.fileCache[config.jsPath] = editor.getValue();
                            break;
                        case  'css':
                            MyIdea.fileCache[config.cssPath] = editor.getValue();
                            break;

                    }
                }

            });



            var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
            // create a simple selection status indicator
            var statusBar = new StatusBar(editor, document.getElementById("statusbar"));

            MyIdea.statusBar = statusBar;


            if (typeof ace == "undefined" && typeof require == "undefined") {
                document.body.innerHTML = "<p style='padding: 20px 50px;'>couldn't find ace.js file, <br>"
                    + "to build it run <code>node Makefile.dryice.js full<code>"
            } else if (typeof ace == "undefined" && typeof require != "undefined") {
                require(["ace/ace"], setValue)
            } else {
                require = ace.require;
                setValue();
            }

            function setValue() {
                var el = document.getElementById("editor");
                var value = MyIdea.findFileContent(MyIdea.currNode);
                el.env.editor.setValue(value, 1);
                el.env.editor.scrollToLine(0,true,true,scrollToLineCallBack);
                setTimeout(function(){

                    if(MyIdea.editor !=null){
                        var undoManager = MyIdea.editor.getSession().getUndoManager();
                        var currId= MyIdea.currNode.id;
                        var currStackCfg = MyIdea.undoMap[currId] ||{};
                        MyIdea.undoMap[currId] = currStackCfg;
                        MyIdea.undoMap[currId][MyIdea.currSourceType] =  [];
                        undoManager.$undoStack=  MyIdea.undoMap[currId][MyIdea.currSourceType] ;
                    }
                });
            }

            function scrollToLineCallBack(){console.log("scrollToLine end");}

            var highlight = ace.require("ace/ext/static_highlight")
            var dom = ace.require("ace/lib/dom")
            function querySelctor4ACE(sel) {
                return Array.apply(null, document.querySelectorAll(sel));
            }

            querySelctor4ACE(".code").forEach(function (codeEl) {
                highlight(codeEl, {
                    mode: codeEl.getAttribute("ace-mode"),
                    theme: codeEl.getAttribute("ace-theme"),
                    startLineNumber: 1,
                    showGutter: codeEl.getAttribute("ace-gutter"), //line number
                    trim: true
                }, function (highlighted) {

                });
            });
        },
        renderByTpl:function(data,tplName){
            var url = MyIdea.viewTplConfig[tplName];
            if(!url){
                return '';
            }
            if(!MyIdea['_tplcfg_'+tplName]){
                var contentTpl = oui.loadUrl(oui.getContextPath()+url,false);
                MyIdea['_tplcfg_'+tplName] =  template.compile(contentTpl);
            }
            return MyIdea['_tplcfg_'+tplName](data);
        },

        getDesignCode:function(node){
            var data =  MyIdea.findViewNodeConfig(node);
            data.isShowCssText = true;
            data.isShowJSText = true;

            var html = MyIdea.renderByTpl(data,'design');
            html = oui.getPageBodyHtml(html,function(el){
                if($(el).is('script')&& $(el).attr('src')){
                    var src = $(el).attr('src');
                    if(src.indexOf('oui-biz-ext.js')>0){
                        return false;
                    }
                    if(src.indexOf('oui-jsclazz.js')>0){
                        return false;
                    }
                }
            });
            return html;
        },
        /** 获取当前节点所有图片的显示代码*****/
        getImagesShowHtml : function(config){
            var html = MyIdea.renderByTpl(config,'images');
            return html;
        },
        runCode:function(cfg){
            console.log(cfg);
            var param = cfg.param;
            if(param){
                param = oui.parseJson(param);
            }else{
                param = {isPc:true};
            }
            //运行视图代码
            if((MyIdea.currNode) && (MyIdea.currNode.nodeType==MyIdea.treeNodeTypeEnum.view.value)){
                var win = oui.openWindow({
                    url:'',
                    openType:'_blank',
                    title:'运行窗口'
                });
                var data =  MyIdea.findViewNodeConfig(MyIdea.currNode);
                data.isShowCssText = true;
                data.isShowJSText = true;
                data.isRun = true;
                var html = MyIdea.renderByTpl(data,(!param.isPc)?'phone':'pc');
                MyIdea.replaceHtmlCssImgByFileCache(data,html,function(text){
                    html = text;
                    win.document.open();
                    win.document.write(html);
                    win.document.close();
                    /*** 初始化完成***/
                    win.initAfter = function(){
                        MyIdea.replaceImgByFileCache(win,"body",function(){

                        });
                    };
                });
            }
        },
        findTreeNodeEnum:function(nodeType){
            var treeNodeTypeEnum = MyIdea.treeNodeTypeEnum;
            for(var i in treeNodeTypeEnum){
                if(treeNodeTypeEnum[i].value == nodeType){
                    return treeNodeTypeEnum[i];
                }
            }
            return null;
        },
        buildLeftTree : function(selectId){
            $('html').removeClass('htmlCls');
            $('body').removeClass('bodyCls');

            var _this = {
                moreBtnClass:'oui_icon',
                findTreeNodeIconCls:function(treeNode){
                    var currEnum = MyIdea.findTreeNodeEnum(treeNode.nodeType);
                    if(currEnum){
                        return 'oui_icon_'+currEnum.name;
                    }
                    return '';
                }
            };

            _this.addDiyDom = function(treeId, treeNode){
                var spaceWidth = 20;
                // 折叠对象
                var switchObj = $("#" + treeNode.tId + "_switch"),
                // 图标对象
                    icoObj = $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass);
                icoObj.addClass(_this.findTreeNodeIconCls(treeNode));
                // 图标对象放到折叠对象前面
                icoObj.before(switchObj);
                // 如果层级在一级一下则添加缩进
                var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth *( treeNode.level+1))+ "px'></span>";
                switchObj.before(spaceStr);
                icoObj.attr("tid", treeNode.tId);
            };
            var orgTreeEl = $("#orgTree");
            // 默认显示全部按钮
            orgTreeEl.addClass("showIcon");
            var treeConfig = {
                view : {
                    showLine: false,
                    showIcon: true,
                    selectedMulti: false,
                    dblClickExpand: false,
                    addDiyDom: _this.addDiyDom
                },
                data : {
                    simpleData : {
                        enable : true,
                        idKey : "id",
                        pIdKey : "pid",
                        rootPId : "0"
                    }
                },
                key:{
                  name:'fileName'
                },
                callback: {
                    onDblClick:function(e, treeId, treeNode){
                        //console.log('双击选中了节点');
                        //console.log(treeNode);
                        //选中当前节点
                        if(treeNode.nodeType == treeNodeTypeEnum.view.value){
                            //双击时选中视图文件 ，并且 重新加载编辑器中内容
                            MyIdea.currNode = treeNode;
                            MyIdea.buildLayout();
                        }
                    },
                    onClick : function(e, treeId, treeNode){

                    },
                    onCollapse : function(e, treeId, treeNode) {
                        $("#" + treeNode.tId + "_ico").removeClass(_this.moreBtnClass+'_open');
                        $("#" + treeNode.tId + "_ico").removeClass(_this.moreBtnClass+'_close');
                        $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass);
                        $("#" + treeNode.tId + "_ico").addClass(_this.findTreeNodeIconCls(treeNode));
                        if(treeNode.open){
                            $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass+'_open');
                        }else{
                            $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass+'_close');
                        }
                    },
                    onExpand : function(e, treeId, treeNode) {
                        $("#" + treeNode.tId + "_ico").removeClass(_this.moreBtnClass+'_open');
                        $("#" + treeNode.tId + "_ico").removeClass(_this.moreBtnClass+'_close');
                        $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass);
                        $("#" + treeNode.tId + "_ico").addClass(_this.findTreeNodeIconCls(treeNode));
                        if(treeNode.open){
                            $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass+'_open');
                        }else{
                            $("#" + treeNode.tId + "_ico").addClass(_this.moreBtnClass+'_close');
                        }
                    }
                }
            };
            var treeNodeTypeEnum = MyIdea.treeNodeTypeEnum;
            /** 编辑文件信息业务***/
            var EditFileInfo = {
                /** 弹框显示 文件或者目录相关信息*****/
                showDialogByNode:function(parentNode,treeNode,isNew){
                    //TODO 弹框显示 文件 或者目录信息，提供 更新 包路径、更新文件名或者包名功能
                    _this.currEditNode = treeNode;
                    _this.isNew= isNew || false;
                    var actions = [{text:"确定",
                        id:"confirm-ok",
                        cls:'oui-dialog-ok',
                        action: function(){

                            _this.eidtDialog4NodeInfo.hide();
                        }
                    }, { cls:'oui-dialog-cancel',
                        text:"取消",
                        id:"cancel",
                        action:function(){

                            _this.eidtDialog4NodeInfo.hide();
                        }
                    }];
                    var html = '';
                    _this.eidtDialog4NodeInfo = oui.getTop().oui.showHTMLDialog({
                        title:"文件或者目录信息",
                        contentStyle: ('width:690px;'),
                        content:html,
                        center:false,
                        actions:actions
                    });
                }
            };
            var json = MyIdea.fileCache['factory/myidea.json'];
            json = oui.parseJson(json);
            MyIdea.factoryJson = json;
            // 初始化组织机构树
            $.fn.zTree.init($("#orgTree"), treeConfig , json);
            // 选中公司节点
            _this.proTreeObj = $.fn.zTree.getZTreeObj("orgTree");
            _this.rootNode = _this.proTreeObj.getNodes()[0];
            _this.proTreeObj.refresh();


            if(selectId){
                var node = _this.proTreeObj.getNodeByParam("id",selectId );
                _this.proTreeObj.selectNode(node,true);//指定选中ID的节点
                _this.proTreeObj.expandNode(node, true, false);//指定选中ID节点展开
                var currNode = node.getParentNode();
                do{
                    $("#" + currNode.tId + "_ico").addClass(_this.moreBtnClass);
                    $("#" +currNode.tId + "_ico").addClass(_this.findTreeNodeIconCls(currNode));
                    currNode = currNode.getParentNode();
                }while(currNode !=null);

            }else{
                _this.proTreeObj.selectNode(_this.rootNode);
                // 默认展开公司下一级部门
                _this.proTreeObj.expandNode(_this.rootNode);
                $("#" + _this.rootNode.tId + "_ico").addClass(_this.moreBtnClass);
                $("#" + _this.rootNode.tId + "_ico").addClass(_this.findTreeNodeIconCls(_this.rootNode));
            }
            $(".curSelectedNode").trigger("dblclick");


            /** 自定义按钮点击事件 */
            $("#orgTree").on("click", ".oui_icon", function(e){
                var curTId = $(e.currentTarget).attr("tid");
                var parentTreeNode = _this.proTreeObj.getNodeByTId(curTId);
                //console.log('当前节点');
                //console.log(parentTreeNode);
//                _this.proTreeObj.selectNode(parentTreeNode);
//                _this.proTreeObj.expandNode(parentTreeNode);
//                $("#" + parentTreeNode.tId + "_ico").addClass(_this.moreBtnClass);
//                $(".curSelectedNode").trigger("click");


                var menus = [];

                if(parentTreeNode.nodeType == treeNodeTypeEnum.proList.value){ //项目列表
                    menus.push({
                        cls:'',
                        nodeType:treeNodeTypeEnum.project.value,
                        text:'创建项目',
                        parentTreeNode:parentTreeNode,
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.createNewNodeDialog(item.parentTreeNode,item);
                        }
                    });
                }else if(parentTreeNode.nodeType == treeNodeTypeEnum.project.value){//项目
                    menus.push({
                        cls:'',
                        nodeType:treeNodeTypeEnum.component.value,
                        parentTreeNode:parentTreeNode,
                        text:'创建公共组件',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.createNewNodeDialog(item.parentTreeNode,item);
                        }
                    });
                    menus.push({
                        cls:'',
                        nodeType:treeNodeTypeEnum.mod.value,
                        parentTreeNode:parentTreeNode,
                        text:'创建模块',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.createNewNodeDialog(item.parentTreeNode,item);
                        }
                    });
                }else if (parentTreeNode.nodeType == treeNodeTypeEnum.industryCompList.value){ //组件列表
                    menus.push({
                        cls:'',
                        nodeType:treeNodeTypeEnum.industryComponent.value,
                        parentTreeNode:parentTreeNode,
                        text:'创建行业组件',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.createNewNodeDialog(item.parentTreeNode,item);
                        }
                    });
                }else if (parentTreeNode.nodeType == treeNodeTypeEnum.industryComponent.value || parentTreeNode.nodeType == treeNodeTypeEnum.component.value){ //组件列表
                    menus.push({
                        cls:'',
                        parentTreeNode:parentTreeNode,
                        nodeType:treeNodeTypeEnum.mod.value,
                        text:'创建模块',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.createNewNodeDialog(item.parentTreeNode,item);
                        }
                    });
                }else if( parentTreeNode.nodeType== treeNodeTypeEnum.mod.value){
                    menus.push({
                        cls:'',
                        parentTreeNode:parentTreeNode,
                        nodeType:treeNodeTypeEnum.view.value,
                        text:'创建视图',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.createNewNodeDialog(item.parentTreeNode,item);
                        }
                    });
                    //TODO 不止可以创建视图，还有其他逻辑
                }else if(parentTreeNode.nodeType== treeNodeTypeEnum.view.value){
                    //视图只有删除菜单
                }else {
                    return ;
                }
                /***行业组件列表和 项目列表 无需删除 ***/
                if((parentTreeNode.nodeType ==MyIdea.treeNodeTypeEnum.industryCompList.value)  || (parentTreeNode.nodeType == MyIdea.treeNodeTypeEnum.proList.value)){
                    menus.push({
                        cls:'',
                        parentTreeNode:parentTreeNode,
                        nodeType:parentTreeNode.nodeType,
                        text:'清空',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.clearConfirmDialog(item.parentTreeNode,item);
                        }
                    });

                }else{
                    menus.push({
                        cls:'',
                        parentTreeNode:parentTreeNode,
                        nodeType:parentTreeNode.nodeType,
                        text:'删除',
                        action:function(idx){
                            var item = menus[idx];
                            MyIdea.deleteConfirmDialog(item.parentTreeNode,item);
                        }
                    });
                }

                _this.expandBtnTip = oui.showTipsMenu({
                    el:e.currentTarget,
                    actions: menus
                });

            });
        },
        /** 根据树节点找出 在factory中的json 对象***/
        findNode:function(treeNode){
            var json = MyIdea.factoryJson ||[];
            return oui.findOneFromArrayBy(json,function(node){
                if(node.id == treeNode.id){
                    return true;
                }else{
                    return false;
                }
            });
        },
        /* 当工程json变更后，执行该保存方法，存储最新的工程json**/
        saveFactoryJson:function(json,nodeId){
            MyIdea.fileCache['factory/myidea.json'] = oui.parseString(json);
            MyIdea.factoryJson = oui.parseJson(json);
            MyIdea.buildLeftTree(nodeId);
        },
        /***根据父节点和当前要创建的节点菜单，创建新节点弹框 ***/
        buildNewNodeData:function(parentNode,item){
            var currEnum = MyIdea.findTreeNodeEnum(item.nodeType);
            var nodeData = (currEnum.buildNewNodeData) && currEnum.buildNewNodeData(parentNode,item);
            return nodeData;
        },
        /** 校验节点属性 文件名 和 显示名 重复校验与格式校验****/
        checkNodeEditProp:function(data){
            var fileName = data.fileName; //文件名
            var name = data.name;//显示名
            var currEnum = MyIdea.findTreeNodeEnum(data.nodeType);
            var desc =(currEnum&&currEnum.desc) ||'';
            var flag = true;
            if(!fileName){
                oui.getTop().oui.alert(desc+'名不能为空');
                flag = false;
                return flag;
            }
            if(!name){
                oui.getTop().oui.alert(desc+'显示名不能为空');
                flag = false;
                return flag;
            }
            if(!/^[A-Za-z_][A-Za-z_0-9]{0,20}$/.test(fileName)){
                oui.getTop().oui.alert(desc+'名格式以英文字母、数字、下划线组合,并且不能以数字开头,长度不能超过20位');
                flag = false;
                return flag;
            }
            var targetNode = oui.findOneFromArrayBy(MyIdea.factoryJson||[],function(item){
               var shouldCheck = false;
                /** 行业组件 公共组件、模块 需要检测是否有重名 ***/
                if(data.nodeType == MyIdea.treeNodeTypeEnum.industryComponent.value || (data.nodeType == MyIdea.treeNodeTypeEnum.component.value) || (data.nodeType ==MyIdea.treeNodeTypeEnum.mod.value ) ){
                    if(item.nodeType == MyIdea.treeNodeTypeEnum.industryComponent.value || (item.nodeType == MyIdea.treeNodeTypeEnum.component.value) || (item.nodeType ==MyIdea.treeNodeTypeEnum.mod.value ) ){
                        shouldCheck = true;
                    }
                }
                /** 行业组件名与 项目名重名检测***/
                if(data.nodeType == MyIdea.treeNodeTypeEnum.industryComponent.value || (data.nodeType == MyIdea.treeNodeTypeEnum.project.value)  ){
                    if(item.nodeType == MyIdea.treeNodeTypeEnum.industryComponent.value || (item.nodeType == MyIdea.treeNodeTypeEnum.project.value) ){
                        shouldCheck = true;
                    }
                }
                /** 同一种节点类型 需要 检测同名*****/
                if((item.nodeType == data.nodeType) || shouldCheck){
                    if((item.fileName.toLowerCase() == fileName.toLowerCase() )|| item.name == name ){
                        return true;
                    }
                }
            });
            if(targetNode){

                if(targetNode.name == name){
                    oui.getTop().oui.alert(desc+'显示名称不能重复,注意全工程内不能重复');
                    flag = false;
                    return flag ;
                }else if(targetNode.fileName.toLowerCase() == fileName.toLowerCase() ) {
                    oui.getTop().oui.alert(desc+'文件名不能重复，注意大小写:aaa与AAA属于相同命名,全工程内不能重复');
                    flag = false;
                    return flag;
                }
                return flag;
            }else{
                return flag;
            }
        },
        /** 根据新节点数据和父节点 创建节点****/
        createNodeByNewNodeData:function(newNode,parentNode){
            /** 指定位置插入节点***/
            var maxIdx = -1;
            var json = MyIdea.factoryJson ||[];
            oui.findManyFromArrayBy(json,function(node,idx){
                if(node.pid == parentNode.id){
                    if(maxIdx<idx){
                        maxIdx = idx;
                    }
                    return true;
                }else{
                    return false;
                }
            });
            var lastIdx = -1;
            if(maxIdx>-1){ //指定位置插入新节点
                lastIdx = maxIdx;
            }else{
                lastIdx = json.indexOf(parentNode);
            }

            /** 更新 工程json ，指定位置添加新节点****/
            MyIdea.factoryJson.splice(lastIdx+1,0,newNode);
            /***视图 需要特殊处理 factoryJson ***/
            if(newNode.nodeType == MyIdea.treeNodeTypeEnum.view.value){
                var config = MyIdea.findViewNodeConfig(newNode);
                MyIdea.fileCache[newNode.fullPath] = MyIdea.renderByTpl(config,'view');
                var jsContent = MyIdea.renderByTpl(config,'js');
                var cssContent = MyIdea.renderByTpl(config,'css');
                MyIdea.fileCache[config.jsPath] = jsContent;
                MyIdea.fileCache[config.cssPath] = cssContent;
            }
            MyIdea.saveFactoryJson(MyIdea.factoryJson,newNode.id);

        },
        /** 创建新节点****/
        createNewNodeDialog:function(parentTreeNode,item){
            var json = MyIdea.factoryJson ||[];
            var parentNode = MyIdea.findNode(parentTreeNode);
            var newNode = MyIdea.buildNewNodeData(parentNode,item);
            oui.setPageParam('tempNode',newNode);
            var html = MyIdea.renderByTpl(newNode,'nodeEditProp'); //编辑视图属性
            var actions = [{text:"确定",
                id:"confirm-ok",
                cls:'oui-dialog-ok',
                action: function(){
                    var $view = $(MyIdea.nodeEditPropDialog.getEl()).find('.oui-class-ouiview');
                    var viewControl = oui.getByOuiId($view.attr('ouiId'));
                    var data = viewControl.getData();
                    var flag = MyIdea.checkNodeEditProp(data);
                    if((typeof flag =='boolean') && (!flag)) {//校验不通过
                        return ;
                    }
                    MyIdea.createNodeByNewNodeData(data,parentNode);
                    MyIdea.nodeEditPropDialog.hide();
                }
            },
                { cls:'oui-dialog-cancel',
                text:"取消",
                id:"cancel",
                action:function(){
                    MyIdea.nodeEditPropDialog.hide();
                }
            }];
            oui.hideTips();
            var currEnum = MyIdea.findTreeNodeEnum(item.nodeType);
            var desc = (currEnum&&currEnum.desc) ||'';
            MyIdea.nodeEditPropDialog = oui.getTop().oui.showHTMLDialog({
                title:desc+'属性设置',
                contentStyle: ('width:690px;'),
                content:html,
                actions:actions
            });
            oui.getTop().oui.parse();
        },
        /** 删除当前节点 ***/
        deleteConfirmDialog:function(currTreeNode,item){
            var currNodeEnum = MyIdea.findTreeNodeEnum(item.nodeType);
            oui.getTop().oui.confirmDialog('删除当前'+currNodeEnum.desc,function(){
                    MyIdea.delCurrAndAllChildren(currTreeNode);
            });
        },
        /** 清空所有子节点或孙子节点******/
        clearConfirmDialog:function(currTreeNode,item){
            var currNodeEnum = MyIdea.findTreeNodeEnum(item.nodeType);
            oui.getTop().oui.confirmDialog('清空'+currNodeEnum.desc,function(){
                MyIdea.delAllChildren(currTreeNode);
            });
        },
        /** 删除所有子节点 ****/
        delAllChildren:function(currTreeNode){
            var json = MyIdea.factoryJson ||[];
            var currNode = MyIdea.findNode(currTreeNode);
            var id = currNode.id;
            var allIds = MyIdea.findAllChildren(currNode);
            oui.removeFromArrayBy(json,function(item){
                if(allIds.indexOf(item.id) < 0){
                    return false;
                }else{
                    return true;
                }
            });
            MyIdea.saveFactoryJson(json,id);
        },
        /** 删除当前节点和该节点的所有孙子节点******/
        delCurrAndAllChildren:function(currTreeNode){
            var json = MyIdea.factoryJson ||[];
            var currNode = MyIdea.findNode(currTreeNode);
            var pid = currNode.pid;
            var allIds = MyIdea.findAllChildren(currNode);
            allIds.push(currNode.id);
            oui.removeFromArrayBy(json,function(item){
                if(allIds.indexOf(item.id) < 0){
                    return false;
                }else{
                    return true;
                }
            });
            MyIdea.saveFactoryJson(json,pid);
        },
        findAllChildren:function(currNode,result){
            result = result ||[];
            var json = MyIdea.factoryJson ||[];
            var cfg= {};
            var tempArr = oui.findManyFromArrayBy(json,function(item){
                if(item.pid == currNode.id){
                    if(result.indexOf(item.id)<0){
                        result.push(item.id);
                    }
                    return true;
                }else{
                    return false;
                }
            });
            tempArr = tempArr ||[];
            for(var i= 0,len= tempArr.length;i<len;i++){
                MyIdea.findAllChildren(tempArr[i],result);
            }
            return result;
        },
        /** 更新显示名称***/
        changeDisplayName:function(control){
            var view = control.getView();
            var data = view.getData();
            data.displayName = data.name;
        },
        /* 视图的文件名改变事件***/
        changeFullPathByFileName:function(control){
            var view = control.getView();
            var data = view.getData();
            if(data.nodeType == MyIdea.treeNodeTypeEnum.view.value){ // 视图的 文件名改变 时修改 全路径
                var fullPath = data.fullPath;
                fullPath = fullPath.substring(0,fullPath.lastIndexOf('\/'));
                data.fullPath = fullPath+'/'+control.attr('value')+'.view';
            }else if((data.nodeType == MyIdea.treeNodeTypeEnum.mod.value)  ){//模块文件名改变 修改 pkg,webDir,fullPath
                /*
                 全路径修改
                 */
                var fullPath = data.fullPath;
                fullPath = fullPath.substring(0,fullPath.lastIndexOf('\/'));
                data.fullPath = fullPath+'/'+control.attr('value')+'';

                /*
                 包路径修改
                 */
                var pkg = data.pkg;
                pkg = pkg.substring(0,pkg.lastIndexOf('\.'));
                data.pkg = pkg+'.'+control.attr('value')+'';

                /*
                 web路径修改
                 */
                var webDir = data.webDir;
                webDir = webDir.substring(0,webDir.lastIndexOf('\/'));
                data.webDir = webDir+'/'+control.attr('value')+'';
            }else if((data.nodeType == MyIdea.treeNodeTypeEnum.component.value) || (data.nodeType == MyIdea.treeNodeTypeEnum.industryComponent.value ||  (data.nodeType == MyIdea.treeNodeTypeEnum.project.value))){
                //公共组件、行业组件 、项目的 文件名改变 修改 pkg,fullPath,webDir不变
                /*
                 全路径修改
                 */
                var fullPath = data.fullPath;
                fullPath = fullPath.substring(0,fullPath.lastIndexOf('\/'));
                data.fullPath = fullPath+'/'+control.attr('value')+'';

                /*
                 包路径修改
                 */
                var pkg = data.pkg;
                pkg = pkg.substring(0,pkg.lastIndexOf('\.'));
                data.pkg = pkg+'.'+control.attr('value')+'';
            }
        },
        buildMyIdeaUI:function(){
            $('.layout').borderLayout();
            var height = $('.layout-center').height()-$('.editor-menu').height();
            $('#editor').height(height-30);
            $('#design-container').height(height);
            MyIdea.treeWidth =$('#orgTree').parent().parent().outerWidth(true)+2;
            MyIdea.menuHeight = $('.editor-menu').outerHeight(true)+5;
            MyIdea.buildAce();
            $(document).ready(function(){
                $('.scrollbar-outer').scrollbar();
            });
        },
        buildLayout : function(){
            var _self = oui.myidea.MyIdea;
            ;(function ($){
                'use strict';
                function _isNumber(n) {
                    return n instanceof Number || (typeof n == "number");
                }
                $.fn.borderLayout = function() {
                    var setBounds = function(element, bounds){
                        element.style.position = 'absolute';
                        element.style.boxSizing = 'border-box';
                        for(var name in bounds){
                            var v = bounds[name];
                            if(_isNumber(v)){
                                v = parseInt(v) + 'px';
                            }
                            element.style[name] = v;
                        }
                        $(element).trigger('size.change');
                    };
                    var toNumber = function(sNumber, sum){
                        if(sNumber[sNumber.length - 1] === '%'){
                            return sum * parseInt(sNumber) / 100;
                        }
                        return parseInt(sNumber);
                    };
                    var calculateLength = function(sNumber, sum, min, max){
                        var n = toNumber(sNumber, sum);
                        if(min){
                            min = toNumber(min, sum);
                            if(n < min){
                                return min;
                            }
                        }
                        if(max){
                            max = toNumber(max, sum);
                            if(n > max){
                                return max;
                            }
                        }
                        return n;
                    };
                    return this.each(function() {
                        this.style.boxSizing = 'border-box';
                        this.style.overflow = 'hidden';
                        if(this == document.body || $(this).hasClass('layout--body')){
                            setBounds(this, {top: 0, bottom: 0, left: 0, right: 0})
                        }
                        var isH = $(this).hasClass('layout--h');

                        var width = this.clientWidth;
                        var height = this.clientHeight;
                        var i = 0;
                        var children = this.children;
                        var center, north, south, east, west;
                        while(i < children.length){
                            var child = children[i++];
                            var data = child.getAttribute('data-options');
                            if(!data){
                                continue;
                            }
                            //http://stackoverflow.com/questions/4210160/safely-parsing-a-json-string-with-unquoted-keys
                            data = data.replace(/(['"])?([a-zA-Z0-9\-]+)(['"])?:/g, '"$2":');
                            data = data.replace(/'/g, '"');
                            data = '{' + data + '}';
                            try{
                                data = JSON.parse(data);
                            }catch(error){
                                continue;
                            }
                            var region = data.region;
                            if(!region){
                                continue;
                            }
                            child._data = data;
                            if(/center/i.test(region)){
                                center = child;
                                continue;
                            }
                            if(/north/i.test(region)){
                                north = child;
                                continue;
                            }
                            if(/south/i.test(region)){
                                south = child;
                                continue;
                            }
                            if(/east/i.test(region)){
                                east = child;
                                continue;
                            }
                            if(/west/i.test(region)){
                                west = child;
                            }
                        }
                        var widthRest = width, heightRest = height, top = 0, left = 0, temp, temp2;
                        function setWestAndEast(){
                            if(west){
                                temp = west._data.width;
                                if(temp){
                                    temp = calculateLength(temp, width, west._data['min-width'], west._data['max-width']);
                                    left = temp;
                                    temp2 = parseInt(west._data.left) || 0;
                                    if(temp2){
                                        widthRest -= temp2;
                                        left += temp2;
                                    }
                                    widthRest -= temp;
                                    setBounds(west, {top: top, left: temp2, width: temp, height: heightRest});
                                }
                            }
                            if(east){
                                temp = east._data.width;
                                if(temp){
                                    temp = calculateLength(temp, width, east._data['min-width'], east._data['max-width']);
                                    temp2 = parseInt(east._data.right) || 0;
                                    if(temp2){
                                        widthRest -= temp2;
                                    }
                                    widthRest -= temp;
                                    setBounds(east, {top: top, right: temp2, width: temp, height: heightRest});
                                }
                            }
                        }
                        function setNorthAndSouth(){
                            if(north){
                                temp = north._data.height;
                                if(temp){
                                    temp = calculateLength(temp, height, north._data['min-height'], north._data['max-height']);
                                    heightRest -= temp;
                                    top = temp;
                                    setBounds(north, {top: 0, left: left, width: widthRest, height: temp});
                                }
                            }
                            if(south){
                                temp = south._data.height;
                                if(temp){
                                    temp = calculateLength(temp, height, south._data['min-height'], south._data['max-height']);
                                    heightRest -= temp;
                                    setBounds(south, {bottom: 0, left: left, height: temp, width: widthRest});
                                }
                            }
                        }
                        if(isH){
                            setWestAndEast();
                            setNorthAndSouth();
                        }else{
                            setNorthAndSouth();
                            setWestAndEast();
                        }
                        if(center){
                            setBounds(center, {top: top, left: left, width: widthRest, height: heightRest});
                        }
                    });
                };
                $(function(){
                    MyIdea.buildMyIdeaUI();
                    $(window).resize(function(){
                        if(MyIdea.currSourceType =='design'){
                            //设计区的场景 无需重新渲染
                            return ;
                        }
                        MyIdea.buildMyIdeaUI();
                    });
                });
            })(jQuery);
        }
    };
    MyIdea = oui.biz.Tool.crateOrUpdateClass(MyIdea);
}());


