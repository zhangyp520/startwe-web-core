/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';

    config.toolbar_Full =
        [
            {
                name: 'document',
                items: ['Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
            },
            {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']},
            {
                name: 'forms',
                items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'imageButton',
                    'HiddenField']
            },
            '/',
            {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            },
            {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
                    '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
            },
            {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
            {
                name: 'insert',
                items: ['simpleImg', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
            },
            '/',
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'tools', items: ['Maximize', 'ShowBlocks', '-', 'About']}
        ];

    config.toolbar_Default = [
        ['FontFormat', 'FontName', 'FontSize'],
        ['Cut', 'Copy', 'Paste', 'PasteText'],
        ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'RemoveFormat'],
        ['Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Subscript', 'Superscript'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight'],
        ['Link', 'Unlink', 'Anchor'],
        ['simpleImg', 'ctpassociate', 'Table', 'Rule', 'SpecialChar', 'PageBreak',]
    ];

    config.toolbar_Basic = [
        ['Font', 'FontSize', '-'],
        ['Bold', 'Italic', 'Underline'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', '-'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList', 'Outdent', 'Indent', '-'],
        //'/',
        ['simpleImg', 'ctpassociate', 'Table', 'HorizontalRule', 'Link', 'Unlink'],
        ['Undo', 'Redo'],
        //,['Save']
        // ['Preview','Source']
    ];
    config.toolbar_BasicAdmin = [
        ['Font', 'FontSize', '-'],
        ['Bold', 'Italic', 'Underline'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', '-'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList', 'Outdent', 'Indent', '-'],
        //'/',
        ['simpleImg', 'Table', 'HorizontalRule', 'Link', 'Unlink'],
        ['Undo', 'Redo']
        //,['Save']
        //['Preview']
    ];
    config.toolbar_Mail = [
        ['Font', 'FontSize', '-'],
        ['Bold', 'Italic', 'Underline'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', '-'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList', 'Outdent', 'Indent', '-'],
        //'/',
        ['simpleImg', 'Smiley', 'Table', 'HorizontalRule', 'Link', 'Unlink'],
        ['Undo', 'Redo']
    ];
    config.toolbar_Bbs = [
        ['Font', 'FontSize', '-'],
        ['Bold', 'Italic', 'Underline'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', '-'],
        ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList', 'Outdent', 'Indent', '-'],
        ['simpleImg', 'Smiley', 'Table', 'Link', 'Unlink'],
        ['Undo', 'Redo']
    ];

    config.toolbar_BbsSimple = [
        ['Font', 'FontSize', '-'],
        ['Bold', 'Italic', 'Underline'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', '-'],
        ['TextColor', 'BGColor'],
        ['simpleImg', 'Smiley', 'Link', 'Unlink'],
        ['Undo', 'Redo']
    ];

    config.toolbar_Simple = [
        ['Font', 'FontSize', '-'],
        ['Bold', 'Italic', 'Underline'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', '-'],
        ['TextColor', 'BGColor']
    ];

    config.toolbar_VerySimple = [
        ['Bold', 'Italic', 'Underline', 'TextColor', 'NumberedList', 'BulletedList']
    ];

    config.editingBlock = true;

    config.extraPlugins += (config.extraPlugins ? ',simpleImg' : 'simpleImg');//定义好的按钮，添加到工具栏

    config.removePlugins = 'image,elementspath,magicline,form';

    config.toolbar = 'Basic';

    config.resize_enabled = false;

    config.height = '0';

    config.image_previewText = " ";

    config.tabSpaces = 4;

    config.extraAllowedContent = 'img[!src,alt,title,oui_imgid,oui_ImgId](*){*};hr[style](*){*}';

};

/**
 * 自定义扩展图片插件 添加上传按钮
 */
// CKEDITOR.on('dialogDefinition', function (ev) {
    // var editor = ev.editor;
    // var dialogName = ev.data.name;
    // var dialogDefinition = ev.data.definition;
    // dialogDefinition.resizeable = CKEDITOR.DIALOG_RESIZE_NONE;
    // if (dialogName === 'image') {
    //     //隐藏或删除高级功能
    //     dialogDefinition.removeContents('advanced');
    //     dialogDefinition.removeContents('Link');
    //     dialogDefinition.removeContents('Upload');
    //     //获取图片信息tab
    //     var infoTab = dialogDefinition.getContents('info');
    //     //为选图片信息tab添加图片上传按钮
    //     infoTab.add({
    //         type: 'button',
    //         id: 'upload_image',
    //         align: 'center',
    //         label: '上传图片',
    //         style: "margin-top:19px;",
    //         onClick: function () {
    //             var thisDialog = this.getDialog();
    //             var txtUrlObj = thisDialog.getContentElement('info', 'txtUrl');
    //             var imageIddHidden = thisDialog.getContentElement('info', 'image_id_hidden');
    //             var uploadDialog = oui.getTop().oui.upload4html({
    //                 isSingle: true,//fileTypes: '*.jpg;*.png;*.gif;*.jpeg;*.bmp',
    //                 fileTypes: '*.jpg;*.png;*.gif;*.jpeg;*.bmp',
    //                 fileSizeLimit: "10 MB",
    //                 fileInterceptor: 'formFileInterceptor',
    //                 completeSuccess: function (data) {
    //                     if (!data) {
    //                         return;
    //                     }
    //                     if (data.length === 0) {
    //                         return;
    //                     }
    //                     var imgFile = data[0];
    //                     var imgId = imgFile.imgId;
    //                     txtUrlObj.setValue(imgFile.previewUrl);
    //                     // txtUrlObj.setAttribute("oui_imgName")
    //                     imageIddHidden.setValue(imgId);
    //                     if (editor.imgCache) {
    //                         editor.imgCache.push({id:imgId,name:imgFile.imgName});
    //                     } else {
    //                         editor.imgCache = [{id:imgId,name:imgFile.imgName}];
    //                     }
    //                 }
    //             });
    //             //设置上传控件浮动在编辑器弹窗之上
    //             $(uploadDialog.getEl()).find(".oui-dialog").css("z-index", 10403);
    //         }
    //     }, 'browse');
    //
    //     //增加存放id的文本框
    //     infoTab.add({
    //         type: 'text',
    //         id: 'image_id_hidden',
    //         align: 'center',
    //         label: '',
    //         hidden:true,
    //         style: "display:none"
    //     }, 'browse');
    //
    //     //重写确定按钮点击事件
    //     var oldOk = dialogDefinition.onOk;
    //     dialogDefinition.onOk = function(){
    //         oldOk.call(this);
    //         var image_id_hidden = this.getContentElement("info", "image_id_hidden");
    //          var imgId = image_id_hidden.getValue();
    //          this.imageElement.setAttribute("oui_ImgId",imgId);
    //     };
    //
    //     //重写窗口显示事件
    //     var oldOnShow = dialogDefinition.onShow;
    //     dialogDefinition.onShow = function(){
    //         oldOnShow.call(this);
    //         if(this.imageElement){
    //             var imgId = this.imageElement.getAttribute("oui_ImgId");
    //             var image_id_hidden = this.getContentElement("info", "image_id_hidden");
    //             image_id_hidden.setValue(imgId);
    //         }
    //     };
    // }
// });

/**
 * 编辑器实列化的时候计算编辑器高度
 */
CKEDITOR.on("instanceReady", function (ev) {
    //粘贴文件截图并显示
    // var editor = ev.editor;
    // editor.document.on("paste", function(e) {
    //     var items = e.data.$.clipboardData.items;
    //     for(var i = 0; i < items.length; ++i) {
    //         var item = items[i];
    //         if(item.kind == 'file' && item.type == 'image/png') {
    //             var imgFile = item.getAsFile();
    //             if(!imgFile) {
    //                 return true;
    //             }
    //             var reader = new FileReader();
    //             reader.readAsDataURL(imgFile);
    //             reader.onload = function(e) {
    //                 //显示文件
    //                 editor.insertHtml('<img src="' + this.result + '" alt="" />');
    //             };
    //             return false;
    //         }
    //     }
    // });

    // function getTop(e) {
    //     var offset = e.offsetTop;
    //     if (e.offsetParent !== null) offset += getTop(e.offsetParent);
    //     return offset;
    // }

    function resizeEditor() {
        var editor = ev.editor;
        editor.resizeEditor = resizeEditor;
        if (!editor) return;
        //内容区域
        var space = editor.ui.space('contents');
        if (space === null) return;
        //toolbar的高度
        var top = editor.ui.space("top");
        //最外框高度减去toolbar高度则为内容的高度
        var height = editor.container.getParent().$.offsetHeight - (top === null ? 0 : top.$.offsetHeight);
        height = height < 0 ? 0 : height;
        space.setStyle('height', height + 'px');
        if (navigator.userAgent.indexOf('MSIE') < 0) {
            try {
                document.getElementsByClassName("cke_contents cke_reset")[0].style.backgroundColor = "rgb(215,217,218)";
            } catch (e) {
            }
            editor.window.getFrame().$.style.display = "block";
            editor.window.getFrame().$.style.margin = "auto";
        }
    }

    resizeEditor();
    window.onresize = function (event) {
        resizeEditor();
    };


});








