/**
 *
 * Created by yangH on 2018/2/6.
 */

/**
 * 添加自定义图片上传组件
 */
CKEDITOR.plugins.add('simpleImg',{//调用add方法添加插件
    init : function (editor) { //初始化页面时调用方法，接收一个富文本对象实例
        var pluginName = 'simpleImg'; //插件名
        // var _file = document.getElementById('editFileInput'); //获取页面中的file文件选择器对象
        /**
         * 添加执行命令
         */
        editor.addCommand('simpleImg', {//添加命令
            exec : function (editor) {//命令调用时执行此函数
                var uploadDialog = oui.getTop().oui.upload4html({
                    isSingle: true,//fileTypes: '*.jpg;*.png;*.gif;*.jpeg;*.bmp',
                    fileTypes: '*.jpg;*.png;*.gif;*.jpeg;*.bmp',
                    fileSizeLimit: "10 MB",
                    fileInterceptor: 'formFileInterceptor',
                    completeSuccess: function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.length === 0) {
                            return;
                        }
                        var imgFile = data[0];
                        var imgId = imgFile.imgId;
                        // <img alt="" data-cke-saved-src="/file.do?method=showImage4Pri&amp;id=4879082281703021217&amp;oui_file_as=634448cf9c395b2fde8e667fad8b1bab0e85b746" src="/file.do?method=showImage4Pri&amp;id=4879082281703021217&amp;oui_file_as=634448cf9c395b2fde8e667fad8b1bab0e85b746" style="width: 500px; height: 288px;" oui_imgid="4879082281703021217">
                        //FIXME 新闻公告数据已经存的是img标签，所以暂时不改成oui-img
                        var element = CKEDITOR.dom.element.createFromHtml('<img style="width: 100%;" src="' + imgFile.previewUrl + '" oui_imgid="' + imgId + '" />');//上传成功后添加上传完成的图片元素到富文本内容中
                        editor.insertElement( element );//插入元素
                        // txtUrlObj.setValue(imgFile.previewUrl);
                        // txtUrlObj.setAttribute("oui_imgName")
                        // imageIddHidden.setValue(imgId);
                        if (editor.imgCache) {
                            editor.imgCache.push({id:imgId,name:imgFile.imgName});
                        } else {
                            editor.imgCache = [{id:imgId,name:imgFile.imgName}];
                        }
                    }
                });
            },
            async : true
        });

        editor.ui.addButton && editor.ui.addButton(pluginName, { //添加一个上传图片的按钮
            label: '图片上传',//按钮提示名
            command: 'simpleImg',//当按钮被点击时执行上面定义好的命令
            /**
             * 添加自定义按钮图片
             */
            // icon: this.path + 'images/hello_icon.png'
        });
    }
});








