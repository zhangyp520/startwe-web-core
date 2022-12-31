/**
 * html编辑器控件
 * Created by oui on 2017/8/17.
 */
(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    //控件构造器
    var HtmlEditor = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ",imgCache,toolbar,onLoaded";
        this.init = init;
        this.setValue = setValue;
        this.getValue = getValue;
        this.getImgCache = getImgCache;
        this.afterRender = afterRender;
        this.resize = resize;
        this.getEditor = getEditor;
    };
    HtmlEditor.FullName = "oui.$.ctrl.htmleditor";//设置当前类全名
    ctrl["htmleditor"] = HtmlEditor;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    HtmlEditor.templateHtml = [];
    HtmlEditor.templateHtml[0] = '<div style="height: 100%"><textarea id="editor_{{id}}" name="editor_{{id}}" >{{value}}</textarea></div>';

    /***********************************控件事件***********************************/

    var init = function () {
        //var self = this;

    };

    var resize = function () {
        var self = this;
        if (self.editor) {
            self.editor.resizeEditor && self.editor.resizeEditor();
        }
    };

    var getEditor = function () {
        var self = this;
        return self.editor;
    };

    var afterRender = function () {
        var self = this;
        var id = self.attr("id");
        var $el = $(self.getEl());
        $el.css("height", "100%");
        var toolbar = self.attr("toolbar");

        toolbar = toolbar || 'Basic';
        var editor = self.editor;
        if (!self.editor) {
            /** 按需加载 ckeditor，不能缓存第三方库，存在配置路径问题***/
            oui.require([oui.getContextPath() + "res_common/third/ckeditor/ckeditor.js"], function () {
                self.editor = CKEDITOR.replace("editor_" + id, {
                    allowedContent: true,
                    startupFocus: false,
                    toolbar: toolbar
                });
                self.afterRender();
            }, function () {
            });
            return;
        }

        //初始图片
        var _imgMap = self.attr("imgCache");
        _imgMap = oui.parseJson(_imgMap || '[]');

        self.attr("imgCache", _imgMap);

        editor.imgCache = _imgMap || [];

        if (editor.imgCache.length > 0) {
            var imgMapArray = editor.imgCache;
            var $content = $el.find("#editor_" + id);
            var html = $content.val();
            var $html = $("<div></div>");
            $html.html(html);
            for (var i = 0, len = imgMapArray.length; i < len; i++) {
                var imgObj = imgMapArray[i];
                $html.find("img[oui_imgid='" + imgObj.id + "']").attr("src", imgObj.url).attr("data-cke-saved-src", imgObj.url);
            }
            setTimeout(function () {
                editor.setData($html.html());
            }, 10);
        }

        self.editor = editor;

        var loaded = self.attr("onLoaded");

        if (loaded) {
            if (typeof loaded === 'string') {
                var loadedFunc = window.eval(loaded);
                if (loadedFunc && typeof loadedFunc === 'function') {
                    loadedFunc.call(self, self);
                }
            } else if (typeof loaded === 'function') {
                loaded.call(self, self);
            }
        }

    };

    var setValue = function (v, imgCache) {
        var self = this;
        self.attr("imgCache", imgCache);
        self.attr("value", v);
        // self.render();
        if (self.editor) {
            self.editor.setData(v);
        }
        self.triggerAfterUpdate();
    };

    var getImgCache = function () {
        var self = this;
        var id = self.attr("id");
        var editor = CKEDITOR.instances["editor_" + id];
        var content = editor.getData();

        var $content = $(content);
        var $imgs = $content.find("img[oui_imgId]");
        var newImgMapArray = [];
        if ($imgs.length > 0) {
            $imgs.each(function () {
                var imgId = $(this).attr("oui_imgId");
                newImgMapArray.push({id: imgId});
            });
        }
        //
        // var imgMapArray = editor.imgCache || [];
        // var newImgMapArray = [];
        // for (var i = imgMapArray.length - 1; i >= 0; i--) {
        //     var fileObj = imgMapArray[i];
        //     if (content.indexOf(fileObj['id']) >= 0) {
        //         newImgMapArray.push(fileObj);
        //     }
        // }
        self.attr("imgCache", newImgMapArray);
        return self.attr("imgCache");
    };

    var getValue = function () {
        var self = this;
        var id = self.attr("id");
        // var $el = $(self.getEl());
        var editor = CKEDITOR.instances["editor_" + id];
        editor.updateElement();
        var content = editor.getData();
        self.attr("value", content);
        return content;
    }

})(window);





