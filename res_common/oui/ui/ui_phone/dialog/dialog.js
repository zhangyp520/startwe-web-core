(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;
    /**
     * 控件类构造器
     */
    var Dialog = function (cfg) {
        Control.call(this, cfg);//必须继承控件超类
        this.attrs = this.attrs + ",events,direction,success,error,ok,cancel,close,no,title,content,lValue,mValue,rValue,actions,contentStyle,items,cls";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */

        this.afterRender = afterRender;

        this.init = init;

        this.show = show;

        this.hide = hide;
        //this.ok = _ok;
    };

    ctrl["dialog"] = Dialog;//将控件类指定到特定命名空间下(类名小写后放到ctrl中 ,定义格式 ctrl[类名小写的字符串]=类名)

    Dialog.FullName = "oui.$.ctrl.dialog";//设置当前类全名 静态变量

    Dialog.msgIdx = 0;

    Dialog.direction = {
        left: "oui-inLeft",
        right: "oui-inRight",
        top: "oui-bounceInDown",
        down: "oui-bounceInUp",
        none: "oui-none"
    };

    Dialog.HTMLDialogDirection = {
        left: "left",
        right: "right",
        up: "up",
        down: "down"
    };

    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Dialog.templateHtml = [];

    Dialog.templateHtml[0] =
        Dialog.templateHtml[1] =
            '<div class="oui-dialog" style="z-index: {{zIndex}};">' +
            '<div class="oui-dialog-content">' +
            '{{if title &&　title.length > 0}}' +
            '<div class="oui-dialog-top">{{title}}</div>' +
            '{{/if}}' +
            '<div class="oui-dialog-mid {{cls || \'\'}}">{{=content}}</div>' +
            '{{if lValue ||　rValue}}' +
            '<div class="oui-dialog-bot">' +
            '{{if lValue && lValue.length > 0}}' +
            '<span onclick="oui.getByOuiId({{ouiId}}).cancel()">{{lValue}}</span>' +
            '{{/if}}' +
            '{{if rValue && rValue.length > 0}}' +
            '<span onclick="oui.getByOuiId({{ouiId}}).ok()">{{rValue}}</span>' +
            '{{/if}}' +
            '</div>' +
            '{{/if}}' +
            '</div>' +
            '</div>';
    Dialog.templateHtml[2] =
        '<div class="oui-dialog oui-dialog-loading" style="z-index: {{zIndex}};"><i class="loading-info">{{content}}</i></div>';
    Dialog.templateHtml[3] =
        '<div class="oui-dialog oui-dialog-loading" style="z-index: {{zIndex}};"><i class="loading-percentage"><p>{{content || 0}}%</p></i></div>';
    Dialog.templateHtml[4] =
        '<div class="oui-dialog" style="z-index: {{zIndex}};">' +
        '<div class="oui-dialog-content">' +
        '{{if title &&　title.length > 0}}' +
        '<div class="oui-dialog-top">{{title}}</div>' +
        '{{/if}}' +
        '<div class="oui-dialog-mid dialog-display-b">' +
        '{{each inputs as item index}}\
        <div class="dialog-input">\
            {{if item.title && item.title.length > 0}}\
                <label>{{=item.title}}</label>\
            {{/if}}\
            {{if item.type=="textarea"}}\
                <textarea name="" {{if item.rows}}rows="{{item.rows}}"{{/if}} {{if item.readOnly}}readOnly="readOnly"{{/if}} class="input-dialog-text {{item.cls}}" style="{{item.style}}" placeholder="{{item.placeholder || \'请输入...\'}}">{{item.value}}</textarea>\
            {{else}}\
                <input type="{{item.type || \'text\'}}" {{if item.readOnly}}readOnly="readOnly"{{/if}} name="" style="{{item.style}}" class="input-dialog-text {{item.cls}}" value="{{item.value}}" placeholder="{{item.placeholder || \'请输入...\'}}">\
            {{/if}}\
        </div>\
        {{/each}}' +
        '</div>' +
        '{{if lValue ||　rValue}}' +
        '<div class="oui-dialog-bot">' +
        '{{if lValue && lValue.length > 0}}' +
        '<span onTap="oui.getByOuiId({{ouiId}}).cancel()">{{lValue}}</span>' +
        '{{/if}}' +
        '{{if rValue && rValue.length > 0}}' +
        '<span onTap="oui.getByOuiId({{ouiId}}).ok()">{{rValue}}</span>' +
        '{{/if}}' +
        '</div>' +
        '{{/if}}' +
        '</div>' +
        '</div>';
    Dialog.templateHtml[5] =
        '{{if content && content.length > 0}}' +
        '<div class="oui-dialog oui-dialog-fullScreen {{if spied}}oui-dialog-spied{{/if}}" style="z-index: {{zIndex}};">' +
        '<i  onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');" class="fullScreen-close"></i>' +
        '{{=content}}' +
        '{{else}}' +//图片dialog
        '<div class="oui-dialog oui-dialog-fullScreen {{if spied}}oui-dialog-spied{{/if}}" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');" style="z-index: {{zIndex}};">' +
        '<div class="fullimg" style="bottom: 0;">' +
        '<div class="fullimg-table">' +
        '<div class="fullimg-table-area">' +
        '<img src="{{=imgUrl}}" />' +
        '{{if imgContent && imgContent.length > 0}}' +
        '<div class="fullImgContent">' +
        '{{imgContent}}' +
        '</div>' +
        '{{/if}}' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{/if}}' +
        '</div>';
    Dialog.templateHtml[6] =
        '<div class="oui-dialog" style="z-index: {{zIndex}};"></div>';
    Dialog.templateHtml[7] =
        '<div class="oui-dialog" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');" style="z-index: {{zIndex}};"></div>' +
        '<div class="oui-html-dialog-content boxDown-hide boxDown-show1" style="z-index: {{zIndex + 1}};height: auto;">' +
        '{{if isActionSheet}}' +
        '{{if items.length > 0}}' +
        '<div class="oui-actionShare-dialog-item-area">' +
        '{{each items as item index}}' +
        '<div class="oui-actionSheet-dialog-item border-bottom {{item.cls || \'\'}}" onTap="oui.getByOuiId({{ouiId}}).itemTap({{index}});" style="{{item.style || \'\'}}" >{{if item.html == true}}{{=item.title || \'\'}}{{else}}{{item.title || \'\'}}{{/if}}</div>' +
        '{{/each}}' +
        '</div>' +
        '<div class="oui-actionSheet-dialog-cancel" onTap="oui.getByOuiId({{ouiId}}).cancel()">取消</div>' +
        '{{else}}' +
        '{{=content}}' +
        '{{if notNeedCancel+"" == "true"}}' +
        '<div class="oui-actionSheet-dialog-cancel" onTap="oui.getByOuiId({{ouiId}}).cancel()">取消</div>' +
        '{{/if}}' +
        '{{/if}}' +
        '{{else}}' +
        '{{=content}}' +
        '{{/if}}' +
        '</div>';
    Dialog.templateHtml[8] =
        '<div class="oui-dialog" style="z-index: {{zIndex}};" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"></div>' +
        '<div class="oui-html-dialog-content boxDown-hide boxDown-show1" style="z-index: {{zIndex + 1}};">' +
        '{{=content}}' +
        '<div class="oui-actionSheet-dialog-cancel" onTap="oui.getByOuiId({{ouiId}}).cancel()">取消</div>' +
        '</div>';
    Dialog.templateHtml[9] =
        '<div class="oui-toast-bg" style="{{=style}};z-index: {{zIndex + 1}};"> ' +
        '<span class="oui-toast">' +
        '{{=content}}' +
        '</span>' +
        '</div>';
    Dialog.templateHtml[10] =
        '<div  class="oui-dialog" style="z-index: {{zIndex}};"></div>\
        {{if isUrl &&　(isClose+"" != "false")}}<i class="fullScreen-close fullScreen-close-bgtranslucent" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');" style="z-index: {{(zIndex + 2)}};"></i>{{/if}}\
        <div {{if !isUrl && isClose+"" != "false"}} onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"{{/if}} class="oui-html-dialog-content boxDown-hide box-show-{{direction || \'right\'}} {{noShowBg?\'oui-html-dialog-content-no-bg\':\'\'}} {{isUrl?\'oui-html-dialog-content-overflow\':\'\'}} {{cls}}" style="z-index: {{zIndex + 1}}; ">\
        {{if isUrl}}\
            <div class="oui-html-dialog-url-content">{{=content}}</div>\
            {{if actions && actions.length > 0}}\
            <div class="oui-dialog-common-btn">\
                {{each actions as action index}}\
                <span class="span-btn">\
                    <button class="{{action.cls || \"\"}}" onTap="oui.getByOuiId({{ouiId}}).attr(\'actions\')[{{index}}].action();">{{action.text || ""}}</button>\
                </span>\
                {{/each}}\
            </div>\
            {{/if}}\
        {{else}}\
            {{=content}}\
        {{/if}}\
        </div>';

    Dialog.templateHtml[11] =
        '<div style="z-index: {{zIndex}};" class="oui-dialog oui-dialog-fullScreen {{if actions && actions.length > 0}}oui-dialog-iframe-hasFooter{{/if}} boxDown-hide box-show-{{direction || \'right\'}}">\
            <i class="fullScreen-close fullScreen-close-bgtranslucent" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"></i>\
            <div class="oui-dialog-iframe">\
                <iframe src="{{url}}&ouiDialogId={{ouiId}}" frameborder="0" width="100%" height="100%"></iframe>\
            </div>\
            {{if actions && actions.length > 0}}\
            <div class="oui-html-dialog-btn">\
            {{each actions as action index}}\
            <span class="{{action.cls || \"\"}}" onclick="oui.getByOuiId({{ouiId}}).attr(\'actions\')[{{index}}].action();">{{action.text || ""}}</span>\
            {{/each}}\
            </div>\
            {{/if}}\
        </div>';
    //<i class="fullScreen-close"></i>
    //<div class="fullScreen-content-img oui-dialog-activity">
    Dialog.templateHtml[12] =
        '<div style="z-index: {{zIndex}};" class="oui-dialog">\
            <i class="fullScreen-close" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"></i>\
            <div class="fullScreen-content-img oui-dialog-activity">\
            {{=content}}\
            </div>\
        </div>';

    //由调用方完全自定义 HTMLDialog 模板
    Dialog.templateHtml[13] =
        '<div class="oui-dialog" style="z-index: {{zIndex}};">' +
        '<div class="oui-dialog-content">' +
        '{{if title &&　title.length > 0}}' +
        '<div class="oui-dialog-top">{{title}}</div>' +
        '{{/if}}' +
        '<div class="oui-dialog-mid {{cls || \'\'}}">{{=content}}</div>' +
        '{{if actions && actions.length > 0}}' +
        '<div class="oui-dialog-bot">' +
        '{{each actions as action index}}' +
        '<span class="{{action.cls || \"\"}}" onclick="oui.getByOuiId({{ouiId}}).attr(\'actions\')[{{index}}].action();">{{action.text || ""}}</span>' +
        '{{/each}}' +
        '</div>' +
        '{{/if}}' +
        '</div>' +
        '</div>';

    //由调用方完全自定义 HTMLDialog 模板
    Dialog.templateHtml[14] =
        '<div class="oui-dialog" {{if isClose +\'\' != \'true\'}}onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"{{/if}} style="z-index: {{zIndex}};"></div>' +
        '<div class="oui-html-dialog-content boxDown-hide box-show-{{direction || \'right\'}} {{cls}}" style="z-index: {{zIndex + 1}};">' +
        '{{if isClose+\'\' == \'true\'}}' +
        '<i class="fullScreen-close fullScreen-close-bgtranslucent" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"></i>' +
        '{{/if}}' +
        '<div class="oui-html-dialog-item">' +
        '{{=content}}' +
        '</div>' +
        '{{if actions && actions.length > 0}}' +
        '<div class="oui-html-dialog-btn">' +
        '{{each actions as action index}}' +
        '<span class="{{action.cls || \"\"}}" onclick="oui.getByOuiId({{ouiId}}).attr(\'actions\')[{{index}}].action();">{{action.text || ""}}</span>' +
        '{{/each}}' +
        '</div>' +
        '{{/if}}' +
        '</div>';

    //使用swiper制作查看图片详情并放大缩小效果,暂时不考虑和img-group整合
    Dialog.templateHtml[15] =
        '<div class="oui-dialog oui-dialog-fullScreen" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');" style="z-index: {{zIndex}};">' +
        '<div class="oui-html-dialog-content boxDown-hide box-show-{{direction || \'right\'}} {{cls}}" style="z-index: {{zIndex + 1}};">' +
        '<i class="fullScreen-close fullScreen-close-bgtranslucent" onTap="oui.getByOuiId({{ouiId}}).cancel(\'close\');"></i>' +
        '<div class="swiper-container swiper-container-{{ouiId}}" style="background-color:#000;width:100%;height:100%;">' +
        '<div class="swiper-wrapper">' +
        '{{each items as item index}}' +
        '<div class="swiper-slide" style="overflow: hidden;">' +
        '<div class="swiper-zoom-container">' +
        '<img  class="swiper-lazy" data-src="{{item}}">' +
        '<div class="swiper-lazy-preloader"></div>' +
        '</div>' +
        '</div>' +
        '{{/each}}' +
        '</div>' +
        '<div class="swiper-pagination swiper-pagination-{{ouiId}} swiper-pagination-white"></div>' +
        '</div>' +
        '</div>' +
        '</div>';


    var init = function () {

        this.attr("directionCls", Dialog.direction[this.attr("direction")] || "oui-zoomIn");

        this.attr("lValue", this.attr("lValue") || "取消");

        this.attr("rValue", this.attr("rValue") || "确定");

    };

    var show = function (cfg) {
        if (cfg) {
            this.attr(cfg);
        }
        //this.render();
        //TODO 重新渲染 diaolog 并添加到body上
        $('body').append(this.getHtml());
    };

    var hide = function () {
        _removeEl.call(this, {});
    };

    /**
     * 用于页面渲染后初始化事件得绑定
     */
    var afterRender = function () {
        //事件绑定，用户自定义的html事件绑定
        //this.attr("events") && this.attr("events")(this);
    };

    Dialog.zIndexDefault = 1000;
    Dialog.zIndex = Dialog.zIndexDefault;
    Dialog.dialogMaxZIndex = Dialog.zIndexDefault;

    /**
     *
     * @param cfg 传入一个dialog控件的属性配置参数，用于初始化dialog对象属性配置
     * @returns {Object} 返回一个通过cfg属性创建好的Dialog对象
     */
    Dialog.dialog = function (cfg) {
        Dialog.msgIdx++;
        var obj = oui.$.Parser.createControl(//创建我们的控件对象
            Dialog, //控件具体实现类
            {
                id: "dialog_" + Dialog.msgIdx,
                ouiId: oui.$.Parser.getNewId(),// 为控件自增ouiId
                type: "dialog",
                value: ""//需要为控件赋上的值
            });

        obj.init();
        obj.attr(cfg);
        Dialog.zIndex++;
        Dialog.dialogMaxZIndex++;

        obj.attr('zIndex', Dialog.dialogMaxZIndex);
        $('body').append(obj.getHtml());

        return obj;
    };
    /*******************************控件类的自定义函数 end******************************************/

    /**
     * 私有内部 点击 OK回调函数
     * @private
     */
    var _removeEl = function () {
        try {
            var self = this;
            var ouiId = self.attr('ouiId');
            if(self && self.getEl && self.getEl()){
                oui.clearByContainer(self.getEl());
                $(self.getEl()).length > 0 && $(self.getEl()).remove();
                oui.clearByOuiId(ouiId);
                self = null;
                delete self;
            }
        } catch (e) {
        }
        //TODO 这里如果是剪掉1层 如果存在actionsheet + urlDialog + imgDialog 种层次依次弹出 就会存在 imgDialog 的index 低于 urlDialog的额层次
        //var zIndex = this.attr('zIndex') - 1;
        //Dialog.zIndex = zIndex;
    };


    /**
     * alert 框控件
     * @param msg String 显示的信息
     * @param ok  Function当用户点击确定是的回调函数
     * @param param 扩展参数
     * {
     *  title:'',
     *  lValue:''
     * }
     * @returns {Object} 当前创建的对话框控件
     */
    oui.alert = function (msg, ok, param) {
        var cfg = {
            'content': msg,
            'showType': 0,
            'title': '',
            'lValue': null,
            'rValue': '确定'
        };

        $.extend(true, cfg, param);

        var obj = Dialog.dialog(cfg);

        obj.ok = function (cfg) {
            ok && ok('ok');
            _removeEl.call(obj, cfg);
            return false;
        };

        return obj;
    };


    /**
     * confirm 框控件
     * @param msg String 显示的信息
     * @param ok  Function当用户点击确定是的回调函数
     * @param cancel Function当用户点击取消的回调函数
     * @param param 扩展参数
     * {
     *  title:'',
     *  lValue:'',
     *  rValue:''
     * }
     * @returns {Object} 当前创建的对话框控件
     */
    oui.confirmDialog = function (msg, ok, cancel, param) {
        var cfg = {
            'content': msg,
            'showType': 1,
            'title': ''
            //'lValue': '确定',
            //'rValue': '取消'
        };
        $.extend(true, cfg, param);

        var obj = Dialog.dialog(cfg);

        obj.ok = function (cfg) {
            var flag = true;
            if (ok) {
                flag = ok('ok');
            }
            if (typeof flag == 'undefined' || flag) {
                _removeEl.call(obj, cfg);
            }
            return false;
        };

        obj.cancel = function (cfg) {
            var flag = true;
            if (cancel) {
                flag = cancel('cancel');
            }
            if (typeof flag == 'undefined' || flag) {
                _removeEl.call(obj, cfg);
            }
            return false;
        };

        return obj;
    };

    /**
     * 改变百分数
     * @private
     */
    var _changePercent = function () {
        $(this.getEl()).find("p").html((this.attr('content') || 0) + '%');
    };

    var currProgress = null;
    /**
     * 进度条
     * @param msg
     * @param callback
     * @returns {Object} 当前创建的对话框控件
     */
    oui.progress = function (msg, callback) {
        var cfg = {
            'content': msg,
            'showType': (typeof msg == 'number') ? 3 : 2
        };

        if (currProgress) {
            if (cfg.showType == 3) {
                currProgress.attr(cfg);
                currProgress.changePercent();
            }
            return currProgress;
        }

        currProgress = Dialog.dialog(cfg);

        currProgress.changePercent = function () {
            _changePercent.call(currProgress, {});
        };

        currProgress.finish = function () {
            callback && (typeof callback == 'function') && callback.call(this);
            _removeEl.call(currProgress);
            currProgress = null;
        };

        currProgress.hide = currProgress.close = function () {
            _removeEl.call(currProgress, cfg);
            currProgress = null;
        };

        return currProgress;
    };

    oui.progress.hide = function () {
        if (currProgress) {
            currProgress.hide();
        }
    };

    /**
     * 带输入框的对话框
     * @param title
     * @param callback
     * @param inputs
     * @param options
     */
    oui.showInputDialog = function (title, callback, inputs, options) {
        var cfg = {
            'showType': 4,
            'title': title
        };

        if (inputs && inputs instanceof Array && inputs.length > 0) {
            cfg['inputs'] = inputs;
        } else {
            cfg['inputs'] = [{type: 'text'}];
        }

        if (options) {
            cfg = $.extend(true, cfg, options);
        }

        var obj = Dialog.dialog(cfg);

        obj.ok = function (cfg) {
            var flag = true;
            if (callback) {
                var valuesArray = [];
                var values = $(obj.getEl()).find(".input-dialog-text");
                if (values.length > 0) {
                    //values.each(function (i, o) {
                    //    valuesArray.push($(this).val());
                    //});
                    var _flag = true;
                    values.each(function (i, o) {
                        if (inputs && inputs[i].validate) {
                            if (oui.validate4value($(this).val(), inputs[i].validate, this)) {
                                valuesArray.push($(this).val());
                            } else {
                                _flag = false;
                                return false;
                            }
                        } else {
                            valuesArray.push($(this).val());
                        }
                    });
                    if (_flag === false) {
                        return false;
                    }
                }
                if (valuesArray.length == 1) {
                    valuesArray = valuesArray[0];
                }
                flag = callback(valuesArray);
            }
            if (typeof flag == 'undefined' || flag) {
                _removeEl.call(obj, cfg);
            }
            return false;
        };

        obj.cancel = function (cfg) {
            _removeEl.call(obj, cfg);
            return false;
        };

        return obj;
    };

    /**
     * 图片显示dialog
     * @param param
     */
    oui.showImgDialog = function (param) {
        var cfg = {
            'showType': 5,
            'imgUrl': '',
            'imgContent': '',
            'spied': true
        };

        $.extend(true, cfg, param);
        return oui.showHTMLDialog(cfg);
    };

    var currMask;
    /**
     * 创建一个模态层
     */
    oui.createMask = function () {
        var cfg = {
            'showType': 6
        };

        if (currMask) {
            return currMask;
        }

        currMask = Dialog.dialog(cfg);

        currMask.close = function () {
            _removeEl.call(currMask, cfg);
            currMask = null;
        };

        return currMask;
    };

    /**
     * 关闭模态层
     */
    oui.closeMask = function () {
        if (currMask) {
            currMask.close();
        }
    };

    /**
     * 自动消失提示框
     * @param param
     * {
     *  content:'消息内容',
     *  time:1500,
     *  position:'bottom', // top,middle
     *  callback:function(){}// 消失回调
     * }
     */
    oui.toast = oui.showAutoTips = function (param) {
        if (typeof param == 'string') {
            param = {"content": param};
        }

        param = $.extend(true, {
            showType: 9,
            position: 'middle',
            upTime:1000,
            downTime:500,
            hideTime:800,
            time: 1500,
            callback: oui._noop
        }, param);

        switch (param.position) {
            case "bottom":
                param.style = 'bottom:.2rem;';
                param.animate = 'toastbot';
                break;
            case "top":
                param.style = 'top:0;';
                param.animate = 'toastop';
                break;
            case "middle":
                param.style = 'top:40%;';
                param.animate = 'toastmid';
                break;
            default :
                param.style = 'bottom:.2rem;';
                param.animate = 'toastbot';
                break;
        }

        var obj = Dialog.dialog(param);
        obj.hide = obj.close = function () {
            _removeEl.call(obj, param);
            obj = null;
        };

        setTimeout(function () {
            $(obj.getEl()).find(".oui-toast-bg").addClass(param.animate);
            setTimeout(function () {
                obj.hide();
                param.callback && param.callback();
            }, param.hideTime);
        }, param.time);

        return obj;
    };


    var ouiShareDialog = null;
    /**
     * HTML 对话框
     */
    oui.showShareDialog = function (cfg) {
        cfg = $.extend(true, {
            'showType': 8,
            'content': ''
        }, cfg);

        if (ouiShareDialog) {
            return ouiShareDialog;
        }

        ouiShareDialog = Dialog.dialog(cfg);

        ouiShareDialog.close = ouiShareDialog.cancel = function () {
            _removeEl.call(ouiShareDialog, cfg);
            ouiShareDialog = null;
        };

        return ouiShareDialog;
    };


    var htmlDialog = null;

    /**
     * 显示actionSheetDialog
     * @param cfg
     * @returns {*}
     */
    oui.showActionSheetDialog = function (cfg) {
        if (!cfg.items) {
            cfg.items = [];
        }
        var obj = oui.showHTMLDialog({isActionSheet: true, items: cfg.items, content: cfg.content});

        obj.close = obj.cancel = function (_cfg) {
            cfg.cancel && cfg.cancel('cancel');
            _removeEl.call(obj, _cfg);
            obj = null;
            return false;
        };

        /**
         * 每一项的点击事件，触发相应的action，并关闭actionsheet弹出框
         */
        obj.itemTap = function (index) {
            obj.attr('items')[index].action(index);
            obj.close();
            return false;
        };
        return obj;
    };

    /**
     * 使用div的方式显示 htmldialog
     * @param cfg
     * {
     * pos:'down', // left,right,down,up 默认：down
     * content:'html内容'//HTML内容
     * }
     * @returns {*}
     * @example
     * oui.showHTMLDialog4Div({
     *  content:'<div>test div 内容<div>'
     * })
     */
    oui.showHTMLDialog4Div = function (cfg) {
        var pos = Dialog.HTMLDialogDirection[cfg["pos"] || 'right'];
        cfg = $.extend(true, {'direction': pos}, cfg, {'showType': 10});
        return oui.showHTMLDialog(cfg);
    };

    /**
     * 活动
     * @param cfg
     */
    oui.showHTMLDialog4Activity = function (cfg) {
        cfg = $.extend(true, {}, cfg, {'showType': 12});
        return oui.showHTMLDialog(cfg);
    };

    /**
     * HTML 对话框
     */
    oui.showHTMLDialog = function (cfg) {
        cfg = $.extend(true, {
            'showType': 7
        }, cfg);

        //TODO 由于移动端流程选人存在多个dialog的情况，因此注释
        //if (htmlDialog) {
        //    return htmlDialog;
        //}

        if (cfg["center"] + "" === "true") {
            cfg["showType"] = 13;
        } else if (cfg["center"] + "" === "false") {
            cfg["showType"] = 14;
            var pos = Dialog.HTMLDialogDirection[cfg["pos"] || 'right'];
            cfg = $.extend(true, {'direction': pos}, cfg);
        }


        htmlDialog = Dialog.dialog(cfg);

        htmlDialog.hide = htmlDialog.cancel = htmlDialog.close = function (action) {
            if(action === 'close'){
                var closeCallback = this.attr("closeCallback");
                if(closeCallback){
                    closeCallback();
                } else {
                    var callback = this.attr("callback");
                    if(callback){
                        callback('close');
                    }
                }
            } else {
                this.attr("closeCallback") && this.attr("closeCallback")();
            }
            _removeEl.call(this);
            //_removeEl.call(htmlDialog ? htmlDialog : this, cfg);
            htmlDialog = null;
            return false;//防止事件穿透
        };
        return htmlDialog;
    };

    var previewImageDialog = null;
    /**
     * 预览图片dialog
     * @param cfg
     */
    oui.previewImageDialog = function (cfg) {
        cfg = $.extend(true, {
            'showType': 15
        }, cfg);

        var pos = Dialog.HTMLDialogDirection[cfg["pos"] || 'right'];
        cfg = $.extend(true, {'direction': pos}, cfg);
        previewImageDialog = Dialog.dialog(cfg);
        previewImageDialog.hide = previewImageDialog.cancel = previewImageDialog.close = function (action) {
            if(action === 'close'){
                var closeCallback = this.attr("closeCallback");
                if(closeCallback){
                    closeCallback();
                } else {
                    var callback = this.attr("callback");
                    if(callback){
                        callback('close');
                    }
                }
            } else {
                this.attr("closeCallback") && this.attr("closeCallback")();
            }
            _removeEl.call(this);
            previewImageDialog = null;
            return false;//防止事件穿透
        };
        var ouiId = previewImageDialog.attr("ouiId");
        var initialSlide = 0;
        if (cfg.current && cfg.items && cfg.items.length > 0) {
            initialSlide = cfg.items.indexOf(cfg.current);
        }
        initialSlide = initialSlide || 0;
        var swiper = new Swiper('.swiper-container-' + ouiId, {
            zoom: true,
            // zoomToggle: false,
            lazyLoading: true,
            initialSlide: initialSlide,
            pagination: '.swiper-pagination-' + ouiId
        });

        return previewImageDialog;
    };

    /**
     * URL 对话框
     * 除钉钉使用的是自己的打开一个webview窗口以外，其他的端都使用的是iframe模拟的对话框，由于iframe在移动端上表现的现象比较怪异，所以慎用此功能
     * @param cfg
     * @returns {*}
     * @ps
     * oui.showUrlDialog({url:"http://www.baidu.com",enableWebView:false});
     */
    oui.showUrlDialog = function (cfg) {
        var pos = Dialog.HTMLDialogDirection[cfg["pos"] || 'right'];

        if (typeof cfg.isShowClose !== 'undefined') {
            cfg.isClose = cfg.isShowClose;
        }

        cfg = $.extend(true, {
            "url": "",
            'direction': pos,
            'enableWebView': false,
            isClose: false,
            closeCallback: function () {
            }
        }, cfg, {"showType": 11, "content": "", isUrl: true});

        if (cfg.url) {
            cfg.url = oui.addOuiParams4Url(cfg.url);
            cfg.url = oui.setParam(cfg.url, "ouiInDialog", true);
        }
        if (cfg.enableWebView && oui.appType.dingtalk && oui.bridge && oui.bridge.hasOwnProperty("openWebView")) {
            oui.bridge.openWebView(cfg.url);
        } else {
            var testDialog = null;
            if (cfg.useIFrame) {
                testDialog = Dialog.dialog(cfg);
                testDialog.hide = testDialog.cancel = testDialog.close = function (action) {
                    if(action === 'close'){
                        var closeCallback = this.attr("closeCallback");
                        if(closeCallback){
                            closeCallback();
                        } else {
                            var callback = this.attr("callback");
                            if(callback){
                                callback('close');
                            }
                        }
                    } else {
                        this.attr("closeCallback") && this.attr("closeCallback")();
                    }
                    _removeEl.call(this);
                    testDialog = null;
                    return false;//防止事件穿透
                };
                testDialog.hideFooter = function () {
                    var self = this;
                    var $el = $(self.getEl());
                    $el.find(".oui-dialog").removeClass("oui-dialog-iframe-hasFooter");
                };

                testDialog.showFooter = function () {
                    var self = this;
                    var $el = $(self.getEl());
                    $el.find(".oui-dialog").addClass("oui-dialog-iframe-hasFooter");
                };
                testDialog.getWindow = function () {
                    var self = this;
                    var $el = $(self.getEl());
                    return $el.find("iframe")[0].contentWindow;
                };
            } else {
                testDialog = oui.showHTMLDialog4Div(cfg);
                var parentNS = oui.getNS();
                //创建命名空间
                oui.createNS();
                //FIXE 防止urldialog关闭和其他dialog关闭zindex冲突
                Dialog.zIndex++;
                Dialog.dialogMaxZIndex++;
                var _render = function (cfg) {
                    var NS = {};
                    NS.parentNS = parentNS;
                    NS._urlDialogOuiId = testDialog.attr("ouiId");
                    NS.$ = function (selector) {
                        var _urlDialog = oui.getByOuiId(NS._urlDialogOuiId);
                        if (_urlDialog) {
                            return $(_urlDialog.getEl()).find(selector);
                        } else {
                            return $(selector);
                        }
                    };
                    var _params = {};
                    if (cfg.url.indexOf("?") !== -1) {
                        var str = cfg.url.substr(cfg.url.indexOf("?") + 1);
                        var strs = str.split("&");
                        for (var i = 0; i < strs.length; i++) {
                            _params[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
                        }
                    }
                    NS._params = _params;
                    NS._url4dialog = cfg.url;
                    NS.oui = oui;

                    oui._setNS(NS);
                    cfg.url = oui.setParam(cfg.url, "ouiDialogId", NS._urlDialogOuiId);
                    var html = oui.loadUrl(cfg.url);
                    try {
                        // 如果是json直接输出提示信息
                        var _json = oui.parseJson(html);
                        var _html = '<div style="width:100%;margin:.6rem auto;margin-top:.8rem;font-size:0;text-align:center;">\
                    <img src="' + oui.getContextPath() + 'res_common/error/images/nodata-ico.png" style="width:48%; vertical-align: top;">\
                    <p style="color: #324d5b;font-size: .16rem;margin: 0;margin-bottom: .25rem;margin-top: .4rem;">' + _json.msg + '</p>\
                    </div>';
                        $(testDialog.getEl()).find(".oui-html-dialog-url-content").css({"font-size": ".14rem"}).html(_html);
                    } catch (e) {
                        $(testDialog.getEl()).find(".oui-html-dialog-url-content").html(html);
                        $('body').css({"overflow": "hidden", "height": "100%"});
                    }
                };

                _render(cfg);

                var _show = testDialog.show || function () {
                    };

                testDialog.show = function (_cfg) {
                    // _show.call(testDialog, _cfg);
                    _render(_cfg);
                };

                testDialog.go = function (url) {
                    _render({url: url});
                };

                testDialog.reload = function () {
                    _render(cfg);
                };

                testDialog.hide = testDialog.cancel = testDialog.close = function (action) {
                    if(action === 'close'){
                        var closeCallback = this.attr("closeCallback");
                        if(closeCallback){
                            closeCallback();
                        } else {
                            var callback = this.attr("callback");
                            if(callback){
                                callback('close');
                            }
                        }
                    } else {
                        this.attr("closeCallback") && this.attr("closeCallback")();
                    }
                    //关闭创建的命名空间
                    var currNameSpace = oui.getNS();
                    if (currNameSpace) {
                        var urlDialogOuiId = currNameSpace._urlDialogOuiId;
                        var ouiId = this.attr("ouiId");
                        if (urlDialogOuiId && ouiId == urlDialogOuiId) {
                            oui.clearNS();
                        }
                    }
                    _removeEl.call(this);
                    testDialog = null;
                    return false;//防止事件穿透
                };

                testDialog.getWindow = function () {
                    return oui.getNS();
                };
            }
            return testDialog;
        }
    };
})(window);





