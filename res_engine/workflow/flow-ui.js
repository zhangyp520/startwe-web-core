/**
 * FlowUi 创建
 */
(function () {
    var FlowBiz = null;


    var FlowUi = {
        "package": "oui.flow",
        "class": "FlowUi",
        prefix: "flow",
        tpls: {
            //"flow-tpl-item": "",
            "flow-tpl-viewType": "",
            "flow-tpl-bottomButtons": ""
        },
        setBiz: function (biz) {
            FlowBiz = biz;
        },
        getBiz: function () {
            return FlowBiz;
        },
        render: function (id, notUpdateEl) {
            if (!this.tpls) {
                this.tpls = {};
            }
            if (typeof id == "undefined") {
                var tpls = this.tpls
                for (var i in tpls) {
                    this.render(i);
                }
                return;
            }
            if (!id) {
                return;
            }
            if (id.indexOf(this.prefix + "-ui-") >= 0) {
                id = this.prefix + "-tpl-" + (id.replace(this.prefix + "-ui-", ""));
            }

            if (typeof this.tpls[id] == "" || !(this.tpls[id])) {

                this.tpls[id] = template.compile(document.getElementById(id).innerHTML);
                //console.log(this.tpls[id]);
            }
            var key = id.replace(this.prefix + "-tpl-", "");

            var html = this.tpls[id](this.getData.call({Events: FlowBiz.Events, FlowBiz: FlowBiz}, key));

            if (typeof notUpdateEl != 'undefined' && notUpdateEl == true) {
                return html;
            }
            var uiId = id.replace('-tpl-', '-ui-');
            //console.log(html);
            document.getElementById(uiId).outerHTML = html;
        },

        getData: function (key) {
            var FlowBiz = this.FlowBiz;
            if (!FlowBiz[key]) {
                return this;
            }
            this[key] = FlowBiz[key];
            return this[key];
        }
    };
    FlowUi = oui.createClass(FlowUi);
    FlowUi.themes = []; //样式皮肤配置
    FlowUi.config = {
        editable: true,
        lineHeight: 10, //15
        basePath: '',
        rect: {// 状态
            attr: {
                x: 10,
                y: 10,
                width: 100,
                height: 50,
                r: 3,
                fill: '#5990cf',
                stroke: '',
                "stroke-width": 1
            },
            showType: 'image&text',// image,text,image&text
            type: 'state',
            name: {
                text: 'state',
                'font-style': 'normal'
            },
            text: {
                text: '状态',
                fill: '#ffffff',
                'font-size': 13
            },
            margin: 5,
            props: [],
            img: {}
        },
        path: {// 路径转换
            attr: {
                path: {
                    path: 'M10 10L100 100',
                    stroke: '#5990cf',
                    fill: "none",
                    "stroke-width": 1
                },
                arrow: {
                    path: 'M10 10L10 10',
                    stroke: '#5990cf',
                    fill: "#5990cf",
                    "stroke-width": 1,
                    radius: 4
                },
                fromDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 1
                },
                toDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 1
                },
                bigDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                smallDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                text: {
                    cursor: "move",
                    'background': '#000'
                }
            },
            text: {
                patten: 'TO {to}',
                textPos: {
                    x: 0,
                    y: -10
                }
            },
            props: {
                text: {
                    name: 'text',
                    label: '显示',
                    value: '',
                    editor: function () {
                        return new FlowUi.editors.textEditor();
                    }
                }
            }
        },
        tools: {// 工具栏
            attr: {
                left: 10,
                top: 10
            },
            pointer: {},
            path: {},
            states: {},
            save: {
                onclick: function (data) {
                    alert(data);
                }
            }
        },
        props: {// 属性编辑器
            attr: {
                top: 10,
                right: 30
            },
            props: {}
        },
        restore: '',
        activeRects: {// 当前激活状态
            rects: [],
            rectAttr: {
                stroke: '#ff0000',
                "stroke-width": 2
            }
        },
        historyRects: {// 历史激活状态
            rects: [],
            pathAttr: {
                path: {
                    stroke: '#00ff00'
                },
                arrow: {
                    stroke: '#00ff00',
                    fill: "#00ff00"
                }
            }
        }
    };

    FlowUi.util = {
        isLine: function (p1, p2, p3) {// 三个点是否在一条直线上
            var s, p2y;
            if ((p1.x - p3.x) == 0)
                s = 1;
            else
                s = (p1.y - p3.y) / (p1.x - p3.x);
            p2y = (p2.x - p3.x) * s + p3.y;
            // $('body').append(p2.y+'-'+p2y+'='+(p2.y-p2y)+', ');
            if ((p2.y - p2y) < 10 && (p2.y - p2y) > -10) {
                p2.y = p2y;
                return true;
            }
            return false;
        },
        center: function (p1, p2) {// 两个点的中间点
            return {
                x: (p1.x - p2.x) / 2 + p2.x,
                y: (p1.y - p2.y) / 2 + p2.y
            };
        },
        nextId: (function () {
            var uid = 0;
            return function () {
                return ++uid;
            };
        })(),

        connPoint: function (rect, p) {// 计算矩形中心到p的连线与矩形的交叉点
            var start = p, end = {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2
            };
            // 计算正切角度
            var tag = (end.y - start.y) / (end.x - start.x);
            tag = isNaN(tag) ? 0 : tag;

            var rectTag = rect.height / rect.width;
            // 计算箭头位置
            var xFlag = start.y < end.y ? -1 : 1, yFlag = start.x < end.x
                ? -1
                : 1, arrowTop, arrowLeft;
            // 按角度判断箭头位置
            if (Math.abs(tag) > rectTag && xFlag == -1) {// top边
                arrowTop = end.y - rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) > rectTag && xFlag == 1) {// bottom边
                arrowTop = end.y + rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) < rectTag && yFlag == -1) {// left边
                arrowTop = end.y + yFlag * rect.width / 2 * tag;
                arrowLeft = end.x - rect.width / 2;
            } else if (Math.abs(tag) < rectTag && yFlag == 1) {// right边
                arrowTop = end.y + rect.width / 2 * tag;
                arrowLeft = end.x + rect.width / 2;
            }
            return {
                x: arrowLeft,
                y: arrowTop
            };
        },

        arrow: function (p1, p2, r) {// 画箭头，p1 开始位置,p2 结束位置, r前头的边长
            var atan = Math.atan2(p1.y - p2.y, p2.x - p1.x) * (180 / Math.PI);

            var centerX = p2.x - r * Math.cos(atan * (Math.PI / 180));
            var centerY = p2.y + r * Math.sin(atan * (Math.PI / 180));

            var x2 = centerX + r * Math.cos((atan + 120) * (Math.PI / 180));
            var y2 = centerY - r * Math.sin((atan + 120) * (Math.PI / 180));

            var x3 = centerX + r * Math.cos((atan + 240) * (Math.PI / 180));
            var y3 = centerY - r * Math.sin((atan + 240) * (Math.PI / 180));
            return [p2, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            }];
        }
    }

    /**流程节点画图 ***/
    FlowUi.rect = function (o, r) {

        var FlowUi = oui.flow.FlowUi;
        var FlowBiz = FlowUi.getBiz();
        var WorkFlowNodeState = FlowBiz.WorkFlowNodeState;
        var _this = this, _uid = FlowUi.util.nextId(), _o = $.extend(true, {}, FlowUi.config.rect, o), _id = 'rect' + _uid, _r = r, // Raphael画笔
            _rect, _img, _statusImg, _commentsImg,hastenWorkImg,notifyImg,splitImg,joinImg, // 图标
            _name, // 状态名称
            _text, // 显示文本
            circle_rect,//中间显示的头像
            _rect_text,// 文本的矩形
            _ox, _oy; // 拖动时，保存起点位置;
        //_o.text.text += _uid;
        var nodeMap = FlowBiz.nodeIdMap;
        var currNode = nodeMap[_o.id];
        var isEndNode = currNode&&currNode.nodeType&&(currNode.nodeType=='end');

        //_rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
        //    _o.attr.r).attr(_o.attr).attr({'fill': 'transparent'}); //透明色
        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
            _o.attr.r).attr(_o.attr).attr({'fill': '#ffffff'});
        var nodeWidth = FlowUi.getBiz().nodeWidth;
        if (_o.attr.width == nodeWidth) { //普通节点
            //if(FlowBiz.isVertical){
            //    circle_rect = _r.rect(_o.attr.x + (nodeWidth - 48) / 2, _o.attr.y, 48, 48, _o.attr.r).attr(_o.attr).attr({
            //        x: _o.attr.x + (nodeWidth - 48) / 2,
            //        y: _o.attr.y+FlowBiz.nodeSplitWidth/2,
            //        width: 48,
            //        height: 48
            //    });
            //}else{
            //
            //}
            circle_rect = _r.rect(_o.attr.x + (nodeWidth - 48) / 2, _o.attr.y, 48, 48, _o.attr.r).attr(_o.attr).attr({
                x: _o.attr.x + (nodeWidth - 48) / 2,
                y: _o.attr.y,
                width: 48,
                height: 48
            });
        } else if (_o.attr.width == 1) {//split 节点
            circle_rect = _r.rect(_o.attr.x, _o.attr.y, 5, 5, _o.attr.r).attr(_o.attr).attr({
                x: _o.attr.x - 3,
                y: _o.attr.y - 3,
                width: 7,
                height: 7
            });
        } else if (_o.attr.width == 15) { //join节点
            _rect.attr('fill', _o.attr.fill);
            if(FlowBiz.isIndex || FlowBiz.isPreview) {
                //运行态或者 预览态不做处理
            }else{
                joinImg =  _r.image(FlowUi.config.basePath + _o.joinImg.src, _o.attr.x , _o.attr.y  , _o.joinImg.width, _o.joinImg.height);
            }

        }

        /**节点图标 ****/
        if (_o.img && _o.img.src) {
            _img = _r.image(FlowUi.config.basePath + _o.img.src,
                _o.attr.x + _o.attr.width / 2 - _o.img.width / 2,
                _o.attr.y + (_o.attr.height - _o.img.height) / 2 - 9, _o.img.width,
                _o.img.height);
        }
        /** 状态图标***/
        //_o.statusImg = {src:_o.img.src,width:16,height:16};// 根据节点 在运行期状态给定不同的图标,此处暂时定制,后续完善配置项 TODO 需完善状态图标
        if (_o.statusImg && _o.statusImg.src) {
            _statusImg = _r.image(FlowUi.config.basePath + _o.statusImg.src,
                _o.attr.x - _o.statusImg.width / 2 + _o.attr.width / 2 + _o.attr.width / (2 * Math.sqrt(2)) - 5,
                _o.attr.y - _o.statusImg.height / 2 + _o.attr.height / 2 + _o.attr.height / (2 * Math.sqrt(2)) - 18, _o.statusImg.width,
                _o.statusImg.height);
        }
        /**意见 图标 ***/
        if (_o._commentsImg && _o._commentsImg.src) {
            _commentsImg = _r.image(FlowUi.config.basePath + _o.commentsImg.src,
                _o.attr.x - _o.commentsImg.width / 2 + _o.attr.width / 2 + _o.attr.width / (2 * Math.sqrt(2)) - 5,
                _o.attr.y - _o.commentsImg.height / 2 + _o.attr.height / 2 + _o.attr.height / (2 * Math.sqrt(2)), _o.commentsImg.width,
                _o.commentsImg.height);
        }
        /**TODO测试  催办功能 **/
        //_o.hastenWorkImg ={
        //    width:38,
        //    height:17,
        //    src:'img/16/hasten_work.png'
        //};
        /***催办图标和按钮 *****/
        if(_o.hastenWorkImg&& _o.hastenWorkImg.src){
            hastenWorkImg = _r.image(FlowUi.config.basePath + _o.hastenWorkImg.src,
                _o.attr.x + _o.attr.width-10 ,
                _o.attr.y   , _o.hastenWorkImg.width,
                _o.hastenWorkImg.height);
        }
        /** 知会图标显示****/
        if(_o.notifyImg&&_o.notifyImg.src){
            notifyImg = _r.image(FlowUi.config.basePath + _o.notifyImg.src,
                _o.attr.x + _o.attr.width-10 ,
                _o.attr.y   , _o.notifyImg.width,
                _o.notifyImg.height);
        }
        /***splitImg节点图标 ***/
        if(_o.splitImg && _o.splitImg.src){

            var currHasBranch = FlowBiz.hasBranch(FlowBiz.nodeIdMap[_o.id]);
            var shouldSplitImg = true;
            /** 运行态或者 预览态,自由流程编辑态， 没有分支条件，不需要分支图标****/
            if(FlowBiz.isIndex || FlowBiz.isPreview || FlowBiz.design4Runtime) {
                if (!currHasBranch) {
                    shouldSplitImg = false;
                }
            }
            if(shouldSplitImg){
                if(FlowBiz.isVertical){
                    splitImg =  _r.image(FlowUi.config.basePath + _o.splitImg.src,
                        _o.attr.x+25 ,
                        _o.attr.y-20   , _o.splitImg.width,
                        _o.splitImg.height);
                }else{
                    splitImg =  _r.image(FlowUi.config.basePath + _o.splitImg.src,
                        _o.attr.x -15 ,
                        _o.attr.y+25   , _o.splitImg.width,
                        _o.splitImg.height);

                }
            }

        }
        /*
         * 文字显示在节点矩形内
         _text = _r.text(
         _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
         _o.attr.y + (_o.attr.height - FlowUi.config.lineHeight) / 2
         + FlowUi.config.lineHeight, _o.text.text)
         .attr(_o.text);// 文本
         */
        /*
         * 文字显示在圆形节点下方
         */
        //_rect_text = _r.rect(_o.attr.x,_o.attr.y+_o.attr.height, _o.attr.width, _o.attr.height/2).attr({fill: "#000" });
        //.rect(100, 100*i, 80, 80, 5).attr({fill: "#fff"});
        _text = _r.text(
            _o.attr.x + _o.attr.width / 2,
            _o.attr.y + _o.attr.height - 5, _o.text.text)
            .attr(_o.text);// 文本
        if (_o.text.text && (_o.text.text.length > 6)) {
            _text.attr({
                text: _o.text.text.substring(0, 6) + '...'
            });
        }
        if ((_text && _text.node) && (_o.text.text.length > 0) && (!oui.os.mobile)) {
            $(_text.node).attr({
                'oui-e-mouseenter': 'showTipsMsg4nodeDisplayName',
                'oui-e-mouseleave': 'hideTips4nodeDisplayName'
            });
        }
        if (_o.text.text == 'split' || _o.text.text == 'join' || _o.text.text == 'end') {
            _text.attr({text: ''});
        }
        // 改变大小的边框
        var _bw = 5, _bbox = {
            x: _o.attr.x - _o.margin,
            y: _o.attr.y - _o.margin,
            width: _o.attr.width + _o.margin * 2,
            height: _o.attr.height + _o.margin * 2
        };

        //$([_rect.node, _text.node, _name.node, _img.node]).attr('oui-e-mousedown','event2contextMenu');

        var eConfig = {};

        $([_rect.node, _text.node]).attr({
            class:isEndNode?'end':'',
            nodeId: _o.id
        });

        // 绑定pc右键和移动端轻点触摸事件
        $([_rect.node, _text.node]).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
        $([_rect.node, _text.node]).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
        if(joinImg&&joinImg.node){
            $(joinImg.node).attr({
                nodeId: _o.id,
                style:'cursor:pointer;'
            });
            $(joinImg.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(joinImg.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
            if(!oui.os.mobile){
                $(joinImg.node).attr('oui-e-mouseenter','event2mouseenterJoin');
                $(joinImg.node).attr('oui-e-mouseleave','event2leaveJoin');
            }
        }
        if (circle_rect && circle_rect.node) {
            $(circle_rect.node).attr({
                class:isEndNode?'end':'',
                nodeId: _o.id
            });
            $(circle_rect.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(circle_rect.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
        }
        /**节点图标事件绑定 ***/
        if (_img && _img.node) {
            $(_img.node).attr({
                'node-img-src':FlowUi.config.basePath + _o.img.src,
                'node-img-high-src':FlowUi.config.basePath + 'img/16/flow-edit.png?_t='+oui.loadStartTime,
                class:isEndNode?'end':'',
                nodeId: _o.id
            });
            $(_img.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(_img.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
            $(_img.node).attr('oui-e-mouseenter', 'event2showEditIcon');
            $(_img.node).attr('oui-e-mouseleave', 'event2hideEditIcon');
        }
        /**状态图标事件绑定 **/
        if (_statusImg && _statusImg.node) {
            $(_statusImg.node).attr({
                nodeId: _o.id
            });
            $(_statusImg.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2contextMenu');
            $(_statusImg.node).attr('oui-e-' + FlowBiz.Events.click, 'event2contextMenu');
        }
        $([_text.node]).attr({
            nodeTextId: 'text-' + _o.id
        });
        /** 催办图标事件绑定*****/
        if(hastenWorkImg&&hastenWorkImg.node){
            $(hastenWorkImg.node).attr({
                nodeId: _o.id,
                style:'cursor:pointer;'
            });
            $(hastenWorkImg.node).attr('oui-e-' + FlowBiz.Events.actionMenu, 'event2HastenWork');
            $(hastenWorkImg.node).attr('oui-e-' + FlowBiz.Events.click, 'event2HastenWork');
        }
        /** splitImg split图标事件绑定****/
        if(splitImg&&splitImg.node){
            $(splitImg.node).attr({
                nodeId: _o.id,
                fromId:_o.splitImg.pid,
                toId:_o.id,
                style:(!FlowBiz.design4Runtime)?'cursor:pointer;':''
            });

            $(splitImg.node).attr('oui-e-'+FlowBiz.Events.click,'event2contextMenu');
            if(!oui.os.mobile){
                if(!FlowBiz.design4Runtime){
                    $(splitImg.node).attr('oui-e-mouseenter','event2mouseenterLine');
                    $(splitImg.node).attr('oui-e-mouseleave','event2leaveLine');
                }
            }
        }

        // 根据_bbox，更新位置信息
        function resize() {
            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                - _o.margin * 2, rh = _bbox.height - _o.margin * 2;

            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            switch (_o.showType) {
                case 'image' :
                    _img && _img.attr({
                        x: rx + (rw - _o.img.width) / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
                case 'text' :
                    _rect.show();
                    _text.attr({
                        x: rx + rw / 2,

                        y: ry + rh / 2
                    }).show();// 文本
                    break;
                case 'image&text' :
                    _rect.show();
                    /*
                     *_name.attr({
                     x : rx + _o.img.width + (rw - _o.img.width) / 2,
                     y : ry + FlowUi.config.lineHeight / 2
                     }).show();
                     */

                    _text.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + (rh - FlowUi.config.lineHeight) / 2
                        + FlowUi.config.lineHeight
                    }).show();// 文本
                    _img && _img.attr({
                        x: rx + _o.img.width / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
            }


            $(_r).trigger('rectresize', _this);
        };

        // 函数----------------
        // 转化json字串
        this.toJson = function () {
            var data = "{type:'" + _o.type + "',text:{text:'"
                + _text.attr('text') + "'}, attr:{ x:"
                + Math.round(_rect.attr('x')) + ", y:"
                + Math.round(_rect.attr('y')) + ", width:"
                + Math.round(_rect.attr('width')) + ", height:"
                + Math.round(_rect.attr('height')) + "}, props:{";
            for (var k in _o.props) {
                data += k + ":{value:'"
                    + _o.props[k].value + "'},";
            }
            if (data.substring(data.length - 1, data.length) == ',')
                data = data.substring(0, data.length - 1);
            data += "}}";
            return data;
        };
        // 从数据中恢复图
        this.restore = function (data) {
            var obj = data;
            // if (typeof data === 'string')
            // obj = eval(data);

            _o = $.extend(true, _o, data);

            _text.attr({
                text: obj.text.text
            });
            resize();
        };

        this.getBBox = function () {
            return _bbox;
        };
        this.getId = function () {
            return _id;
        };
        this.remove = function () {
            _rect.remove();
            _text.remove();
            _img && _img.remove();
            _statusImg && _statusImg.remove();
            _commentsImg && _commentsImg.remove();
            hastenWorkImg&&hastenWorkImg.remove();
            notifyImg&&notifyImg.remove();
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr)
                _rect.attr(attr);
        };

        //resize();// 初始化位置
    };

    FlowUi.path = function (o, r, from, to) {
        var workflowTreeNode= oui.flow.FlowBiz.workflowTreeNode ||{};
        var _this = this, _r = r, _o = $.extend(true, {}, FlowUi.config.path), _path, _arrow, _text, _textPos = _o.text.textPos, _ox, _oy, _from = from, _to = to, _id = 'path'
            + FlowUi.util.nextId(), _dotList;

        // 点
        function dot(type, pos, left, right) {
            var _this = this, _t = type, _n, _lt = left, _rt = right, _ox, _oy, // 缓存移动前时位置
                _pos = pos;// 缓存位置信息{x,y}, 注意：这是计算出中心点
            switch (_t) {
                case 'from' :

                    _n = _r.rect(pos.x - _o.attr.fromDot.width / 2,
                        pos.y - _o.attr.fromDot.height / 2,
                        _o.attr.fromDot.width, _o.attr.fromDot.height)
                        .attr(_o.attr.fromDot);
                    break;
                case 'big' :
                    _n = _r.rect(pos.x - _o.attr.bigDot.width / 2,
                        pos.y - _o.attr.bigDot.height / 2,
                        _o.attr.bigDot.width, _o.attr.bigDot.height)
                        .attr(_o.attr.bigDot);
                    break;
                case 'small' :
                    _n = _r.rect(pos.x - _o.attr.smallDot.width / 2,
                        pos.y - _o.attr.smallDot.height / 2,
                        _o.attr.smallDot.width, _o.attr.smallDot.height)
                        .attr(_o.attr.smallDot);
                    break;
                case 'to' :
                    _n = _r.rect(pos.x - _o.attr.toDot.width / 2,
                        pos.y - _o.attr.toDot.height / 2,
                        _o.attr.toDot.width, _o.attr.toDot.height)
                        .attr(_o.attr.toDot);

                    break;
            }
            $(_n.node).on(FlowBiz.Events.click, function () {
                return false;
            });

            this.type = function (t) {
                if (t)
                    _t = t;
                else
                    return _t;
            };
            this.node = function (n) {
                if (n)
                    _n = n;
                else
                    return _n;
            };
            this.left = function (l) {
                if (l)
                    _lt = l;
                else
                    return _lt;
            };
            this.right = function (r) {
                if (r)
                    _rt = r;
                else
                    return _rt;
            };
            this.remove = function () {
                _lt = null;
                _rt = null;
                _n.remove();
            };
            this.pos = function (pos) {

                if (pos) {
                    if (typeof pos.x == 'undefined') {
                        pos.x = _pos.x || 0;
                    }
                    if (typeof pos.y == 'undefined') {
                        pos.y = _pos.y || 0;
                    }
                    _pos = pos;
                    _n.attr({
                        x: _pos.x - _n.attr('width') / 2,
                        y: _pos.y - _n.attr('height') / 2
                    });
                    return this;
                } else {
                    return _pos
                }
            };

            this.moveTo = function (x, y) {
                this.pos({
                    x: x,
                    y: y
                });

                switch (_t) {
                    case 'from' :
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(FlowUi.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(FlowUi.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        break;
                    case 'big' :

                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(FlowUi.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(FlowUi.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(FlowUi.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(FlowUi.util.center(_pos, _lt.left().pos()));
                        }
                        // 三个大点在一条线上，移除中间的小点
                        var pos = {
                            x: _pos.x,
                            y: _pos.y
                        };
                        if (FlowUi.util.isLine(_lt.left().pos(), pos, _rt
                                .right().pos())) {
                            _t = 'small';
                            _n.attr(_o.attr.smallDot);
                            this.pos(pos);
                            var lt = _lt;
                            _lt.left().right(_lt.right());
                            _lt = _lt.left();
                            lt.remove();
                            var rt = _rt;
                            _rt.right().left(_rt.left());
                            _rt = _rt.right();
                            rt.remove();
                            // $('body').append('ok.');
                        }
                        break;
                    case 'small' :// 移动小点时，转变为大点，增加俩个小点
                        if (_lt && _rt && !FlowUi.util.isLine(_lt.pos(), {
                                x: _pos.x,
                                y: _pos.y
                            }, _rt.pos())) {

                            _t = 'big';

                            _n.attr(_o.attr.bigDot);
                            var lt = new dot('small', FlowUi.util.center(_lt
                                .pos(), _pos), _lt, _lt
                                .right());
                            _lt.right(lt);
                            _lt = lt;

                            var rt = new dot('small', FlowUi.util.center(_rt
                                    .pos(), _pos), _rt.left(),
                                _rt);
                            _rt.left(rt);
                            _rt = rt;

                        }
                        break;
                    case 'to' :
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(FlowUi.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(FlowUi.util.center(_pos, _lt.left().pos()));
                        }
                        break;
                }

                refreshpath();
            };
        }

        function dotList() {
            // if(!_from) throw '没有from节点!';
            var _fromDot, _toDot, _fromBB = _from.getBBox(), _toBB = _to
                .getBBox(), _fromPos, _toPos;

            _fromPos = FlowUi.util.connPoint(_fromBB, {
                x: _toBB.x + _toBB.width / 2,
                y: _toBB.y + _toBB.height / 2
            });
            _toPos = FlowUi.util.connPoint(_toBB, _fromPos);

            _fromDot = new dot('from', _fromPos, null, new dot('small', {
                x: (_fromPos.x + _toPos.x) / 2,
                y: (_fromPos.y + _toPos.y) / 2
            }));
            _fromDot.right().left(_fromDot);
            _toDot = new dot('to', _toPos, _fromDot.right(), null);
            _fromDot.right().right(_toDot);

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = 'M' + d.pos().x + ' ' + d.pos().y, arr = '';
                if (typeof d.pos() == 'undefined' || typeof d.pos().x == 'undefined') {
                    return '';
                }
                if (typeof d.pos() == 'undefined' || typeof d.pos().y == 'undefined') {
                    return '';
                }
                // 线的路径
                while (d.right()) {
                    d = d.right();
                    if (typeof d.pos() == 'undefined' || typeof d.pos().x == 'undefined') {
                        continue;
                    }
                    if (typeof d.pos() == 'undefined' || typeof d.pos().y == 'undefined') {
                        continue;
                    }
                    p += 'L' + d.pos().x + ' ' + d.pos().y;
                }
                // 箭头路径
                var arrPos = FlowUi.util.arrow(d.left().pos(), d.pos(),
                    _o.attr.arrow.radius);

                arr = 'M' + arrPos[0].x + ' ' + arrPos[0].y + 'L' + arrPos[1].x
                    + ' ' + arrPos[1].y + 'L' + arrPos[2].x + ' '
                    + arrPos[2].y + 'z';
                return [p, arr];
            };
            this.toJson = function () {
                var data = "[", d = _fromDot;

                while (d) {
                    if (d.type() == 'big')
                        data += "{x:" + Math.round(d.pos().x) + ",y:"
                            + Math.round(d.pos().y) + "},";
                    d = d.right();
                }
                if (data.substring(data.length - 1, data.length) == ',')
                    data = data.substring(0, data.length - 1);
                data += "]";
                return data;
            };
            this.restore = function (data) {
                //console.log(data);
                var obj = data, d = _fromDot.right();

                for (var i = 0; i < obj.length; i++) {
                    d.moveTo(obj[i].x, obj[i].y);
                    d.moveTo(obj[i].x, obj[i].y);
                    d = d.right();
                }
                this.hide();
            };

            this.fromDot = function () {
                return _fromDot;
            };
            this.toDot = function () {
                return _toDot;
            };
            this.midDot = function () {// 返回中间点
                var mid = _fromDot.right(), end = _fromDot.right().right();
                while (end.right() && end.right().right()) {
                    end = end.right().right();
                    mid = mid.right();
                }
                return mid;
            };
            this.show = function () {
                var d = _fromDot;
                while (d) {
                    d.node().show();
                    d = d.right();
                }
            };
            this.hide = function () {
                var d = _fromDot;
                while (d) {
                    d.node().hide();
                    d = d.right();
                }
            };
            this.remove = function () {
                var d = _fromDot;
                while (d) {
                    if (d.right()) {
                        d = d.right();
                        d.left().remove();
                    } else {
                        d.remove();
                        d = null;
                    }
                }
            };
        }

        // 初始化操作
        _o = $.extend(true, _o, o);

        _dotList = new dotList();
        var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
        _o.attr.path.path = p[0];
        _o.attr.arrow.path = p[1];
        _path = _r.path(p[0]).attr(_o.attr.path);
        // 线条事件绑定 线条样式 TODO
        if(_path){
            if(o&& o.from&& o.to){
                if(workflowTreeNode &&workflowTreeNode.states &&workflowTreeNode.states[o.from]&&workflowTreeNode.states[o.to]){
                    $(_path.node).attr('fromId',workflowTreeNode.states[o.from].id);
                    $(_path.node).attr('toId',  workflowTreeNode.states[o.to].id);
                    $(_path.node).attr('oui-e-'+FlowBiz.Events.click,'event2contextMenu');
                    if(!oui.os.mobile){
                        $(_path.node).attr('oui-e-mouseenter','event2mouseenterLine');
                        $(_path.node).attr('oui-e-mouseleave','event2leaveLine');

                    }
                    var currHasBranch = FlowBiz.hasBranch(FlowBiz.nodeIdMap[workflowTreeNode.states[o.to].id]);
                    if(currHasBranch){
                        /** 如果存在分支条件则 需要将线条画成虚线****/
                        FlowBiz.renderBranchLine(_path.node);
                    }
                    if(FlowBiz.nodeIdMap[workflowTreeNode.states[o.from].id].isSplit){
                        /*** 运行态非分支则 线条不能变粗 ***/
                        if(FlowBiz.isIndex || FlowBiz.isPreview){
                            if(!currHasBranch){
                                $(_path.node).attr('oui-e-'+FlowBiz.Events.click,'');
                                $(_path.node).attr('oui-e-mouseenter','');
                                $(_path.node).attr('oui-e-mouseleave','');
                                /****运行态非分支条件无需变粗 ****/
                                $(_path.node).attr('stroke-width','1');
                                $(_path.node).css('stroke-width','1');
                            }
                        }else{
                            /** 设计态分支线条都要变粗****/
                            $(_path.node).attr('stroke-width','3');
                            $(_path.node).css('stroke-width','3');
                        }
                    }else if(currHasBranch && FlowBiz.isIndex){
                        /*** 当前节点存在分支，并且父节点不是分支，并且在运行态 ******/
                    }else{
                        $(_path.node).attr('oui-e-mouseenter','');
                        $(_path.node).attr('oui-e-mouseleave','');
                        $(_path.node).attr('oui-e-'+FlowBiz.Events.click,'');
                    }
                }
            }
            _path.toBack();
        }
        //_arrow = _r.path(p[1]).attr(_o.attr.arrow); //不显示箭头

        // 函数-------------------------------------------------
        this.from = function () {
            return _from;
        };
        this.to = function () {
            return _to;
        };
        // 恢复
        this.restore = function (data) {
            var obj = data;
            _o = $.extend(true, _o, data);

            _dotList.restore(obj.dots);
        };
        // 删除
        this.remove = function () {
            _dotList.remove();
            _path.remove();
            _arrow && _arrow.remove();
            //_text.remove();

        };
        // 刷新路径
        function refreshpath() {
            var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
            if (p) {
                _path.attr({
                    path: p[0]
                });
                _arrow && _arrow.attr({
                    path: p[1]
                });
            }

            // $('body').append('refresh.');
        }

        this.getId = function () {
            return _id;
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr && attr.path)
                _path.attr(attr.path);
            if (attr && attr.arrow)
                _arrow.attr(attr.arrow);
            // $('body').append('aaaaaa');
        };

    };

    FlowUi.props = function (o, r) {

    };

    // 属性编辑器
    FlowUi.editors = {
        textEditor: function () {
        }
    };
    FlowUi.RaphaelObj = null;
    // 初始化流程
    FlowUi.init = function (c, o) {
        var _r;
        var _w = $(window).width(), _h = $(window).height(), _states = {}, _paths = {};
        if (FlowUi.RaphaelObj) {
            FlowUi.RaphaelObj.clear();
            FlowUi.RaphaelObj = null;
        }
        _r = Raphael(c, o.width, o.height);
        FlowUi.RaphaelObj = _r;
        $.extend(true, FlowUi.config, o);
        /**
         * 删除： 删除状态时，触发removerect事件，连接在这个状态上当路径监听到这个事件，触发removepath删除自身；
         * 删除路径时，触发removepath事件
         */
            // 模式
        $(_r).data('mod', 'point');
        // 恢复
        if (o.restore) {
            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
            // o.restore);
            var data = o.restore;
            var rmap = {};
            if (data.states) {
                var trect = new Date();
                for (var k in data.states) {
                    var t1 = new Date();
                    var extObj = $
                        .extend(
                        true,
                        {},
                        FlowUi.config.tools.states[data.states[k].type],
                        data.states[k]);

                    var rect = new FlowUi.rect(
                        extObj, _r);
                    var t2 = new Date();
                    //console.log('createrect:'+(t2-t1));

                    //rect.restore(data.states[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                    var t2 = new Date();
                    //console.log(t2-t1);

                }
                var trect2 = new Date();
                //console.log('recttime:'+(trect2-trect));
                //alert('recttime:'+(trect2-trect));
            }
            if (data.paths) {
                var tp = new Date();
                for (var k in data.paths) {
                    var pathObj = $.extend(true, {},
                        FlowUi.config.tools.path, data.paths[k]);
                    var p = new FlowUi.path(pathObj,
                        _r, rmap[data.paths[k].from],
                        rmap[data.paths[k].to]);
                    p.restore(data.paths[k]);
                    //_paths[p.getId()] = p;
                }
                var tp2 = new Date();
                //console.log('pathtime:'+(tp2-tp));
                //alert('pathtime:'+(tp2-tp));
            }
        }
        // 历史状态
        var hr = FlowUi.config.historyRects, ar = FlowUi.config.activeRects;
        if (hr.rects.length || ar.rects.length) {
            var pmap = {}, rmap = {};
            for (var pid in _paths) {// 先组织MAP
                if (!rmap[_paths[pid].from().text()]) {
                    rmap[_paths[pid].from().text()] = {
                        rect: _paths[pid].from(),
                        paths: {}
                    };
                }
                rmap[_paths[pid].from().text()].paths[_paths[pid].text()] = _paths[pid];
                if (!rmap[_paths[pid].to().text()]) {
                    rmap[_paths[pid].to().text()] = {
                        rect: _paths[pid].to(),
                        paths: {}
                    };
                }
            }
            for (var i = 0; i < hr.rects.length; i++) {
                if (rmap[hr.rects[i].name]) {
                    rmap[hr.rects[i].name].rect.attr(hr.rectAttr);
                }
                for (var j = 0; j < hr.rects[i].paths.length; j++) {
                    if (rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]) {
                        rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]
                            .attr(hr.pathAttr);
                    }
                }
            }
            for (var i = 0; i < ar.rects.length; i++) {
                if (rmap[ar.rects[i].name]) {
                    rmap[ar.rects[i].name].rect.attr(ar.rectAttr);
                }
                for (var j = 0; j < ar.rects[i].paths.length; j++) {
                    if (rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]) {
                        rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]
                            .attr(ar.pathAttr);
                    }
                }
            }
        }
    };

    // 添加jquery方法
    $.fn.FlowUi = function (o) {

        return this.each(function () {
            FlowUi.init(this, o);
        });
    };

    $.FlowUi = FlowUi;
})();








