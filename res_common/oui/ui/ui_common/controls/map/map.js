/**
 * 地图组件
 * Created by yangH on 2018/3/5.
 */
(function (win, oui, $) {

    /**
     * 标点最大数
     * @type {number}
     */
    var MAX_MARKER_LIMIT = 1000;

    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;

    /**
     * 地图配置
     */
    var OuiMap = {
        width: "100%",
        height: "100%",
        location: false,//true 自动定位,false 不自动定位,pos 定位到某个一个地点
        centerIsFixed: false,//定位的中心点是否固定，当为true的时候 地图移动和定位结束，中心会产生一个marker,并且随着地图移动中心点一直不动
        markers: null,//地图标点
        lines: null,//地图线
        viewModel: '2D',//2D,3D；FIXME 使用百度的时候该属性失效 该接口百度jsApi还没有开放
        satellite: false,//是否显示卫星地图
        traffic: false,//实时路况
        /** 数据请求地址，如果返回的对象是OuiMap对象，
         * 并且没有配置drawMap则组件负责draw，
         * 配置了则调用drawMap;
         * 如果不是OuiMap 则调用drawMap，
         * 如果没有配置，则不渲染
         */
        dataUrl: null,
        drawMap: null,//数据请求回调 和dataUrl 一起使用，如果没有配置dataUrl又配置了drawMap则执行一次
        onSearch: false,//搜索事件，false:不支持搜索，true:默认使用组件的搜索,其他:自定义搜索事件
        // 自定义搜索格式
        // onSearch: function (keyword, callback) {
        //     var result = [];
        //     result.push({
        //         location: {lng: 'xx', lat: 'xx'},
        //         title: 'title',
        //         address: 'address'
        //     });
        //     callback(result);
        // },
        onClick: false,//地图点击事件，true:默认添加标记,false:不支持点击事件,其他:自定义事件
        //自定义点击事件格式
        // onClick: function (markerObj) {
        //     //DO something...
        // }

        onMarkerInfoRender: null,//渲染标点点击后信息框显示事件,返回为 null 或者 "" 或者 false  都不会渲染
        //信息窗体渲染事件格式
        // onMarkerInfoRender: function (markerObj) {
        //     var html = "";
        //     //Do something....
        //     return html;
        // }//渲染

        //zoomControl: false,//是否需要放大缩小//TODO

    };

    /**
     * 标点
     * @type {{lng: null, lat: null, offset: [*], icon: null, info: null, infoNavigation: boolean}}
     */
    var OuiMapMarker = {
        lng: null,
        lat: null,
        offset: [16, -45],//[x,y]
        icon: null,// 标记点图标
        infoTitle: "",//信息title
        info: null,// 点击后具体显示内容（html内容）
        showDefaultInfo: false,//显示当前位置默认信息
        infoNavigation: true//是否显示导航按钮
    };

    /**
     * 地图上的标线
     * @type {{width: number, color: string, lineType: number, markers: Array}}
     */
    var OuiMapLine = {
        width: 2,
        color: "#19c468",
        lineType: 'solid',//solid:实线，dashed：虚线
        markers: []//线的拐点位置
    };

    /**
     * 判断对象是否是 OuiMap对象
     * @param obj
     * @returns {boolean}
     */
    var isOuiMapData = function (obj) {
        var flag = false;
        if (obj) {
            if (obj.hasOwnProperty("location") && (obj.hasOwnProperty("markers") || obj.hasOwnProperty("lines"))) {
                flag = true;
            }
        }
        return flag;
    };

    /**
     * 控件构造器
     * @param cfg
     * @constructor
     */
    var Map = function (cfg) {
        Control.call(this, cfg);//必须继承控件超类
        var newAttrs = "";
        for (var key in OuiMap) {
            newAttrs += "," + key;
        }
        this.attrs = this.attrs + newAttrs;
        this.init = init;
        this.afterRender = afterRender;

        /************************ 提供外部调用方法开始 **************************/

        /** 返回当前现现实的标点 */
        this.getCurrentShowMarker = getCurrentShowMarker;

        /************************ 提供外部调用方法结束 **************************/

    };

    Map.FullName = "oui.$.ctrl.map";//设置当前类全名
    ctrl["map"] = Map;//将控件类指定到特定命名空间下

    Map.templateHtml = [];
    Map.templateHtml[0] =
        '<div id="oui-map-{{ouiId}}" class="oui-map-area {{centerIsFixed ? \"oui-map-area-searchFixed\":\"\" }}">' +
        '   {{if onSearch+"" !== "false"}}' +
        '   <div class="oui-map-search">' +
        '       <div class="map-search-cnt">' +
        '           <input type="text" class="map-search-info" placeholder="搜索..."/>' +
        '           <button class="map-search-btn"></button>' +//delete-btn
        '       </div>' +
        '       <div class="map-search-result">' + //show-searchResult
        '           <ul>' +
        '           </ul>' +
        '       </div>' +
        '   </div>' +
        '   {{/if}}' +
        '   <div id="oui-map-container-{{ouiId}}" class="oui-map-content">' +
        '       <div class="oui-map-location-btn"></div>' +
        '   </div>' +
        '   {{if !isFormPC}}' +
        '   <div class="map-near-result">' +
        '       <ul></ul>' +
        '   </div>' +
        '   <div id="oui-map-info" class="oui-map-info"></div>' +
        '   {{/if}}' +
        '</div>';

    /**
     * 搜索结果展示模版
     * @type {string}
     */
    Map.templateHtml4SearchResult =
        '{{if data && data.length > 0}}' +
        '{{each data as item index}}' +
        '<li location="{{oui.parseString(item.location) }}">' +
        '   <div class="search-result-tit">{{item.title }}</div>' +
        '   <div class="search-result-info">{{item.address }}</div>' +
        '</li>' +
        '{{/each}}' +
        '{{else}}' +
        '<div style="padding-top: 50px;text-align: center;">暂无数据</div>' +
        '{{/if}}';

    Map.templateHtml4InfoWindow =
        '<div class="oui-map-layout">' +
        '{{if infoTitle && infoTitle.length > 0}}' +
        '<div class="oui-map-layout-tit" title="{{infoTitle }}">' +
        '{{=infoTitle }}' +
        '</div>' +
        '{{/if}}' +
        '{{if info && info.length > 0}}' +
        '<div class="oui-map-layout-box">' +
        '{{=info }}' +
        '</div>' +
        '{{/if}}' +
        '{{if oui.os.mobile && infoNavigation}}' +
        '<div class="oui-map-layout-btn">' +
        '<button currentPosition="{{oui.parseString(position) }}" currentAddress="{{infoTitle}}" class="oui-map-navigation">开始导航</button>' +
        '</div>' +
        '{{/if}}' +
        '</div>';


    /**
     * 控件初始化
     */
    var init = function () {
        var self = this;

        //设置默认属性
        var _v;
        for (var key in OuiMap) {
            _v = self.attr(key);
            if (typeof _v === 'undefined' || _v === '') {
                self.attr(key, OuiMap[key]);
            } else {
                self.attr(key, _v);
            }
        }

        //告知控件是否是PC端
        self.attr("isFormPC", !oui.os.mobile);

        //为控件最外层添加style属性(width, height)
        var parentStyle = "";
        var width = self.attr("width");
        var height = self.attr("height");
        if (width || height) {
            width = width + "";
            height = height + "";
            if (width.indexOf("px") < 0 && width.indexOf("%") < 0) {
                width = width + "px";
            }
            if (height.indexOf("px") < 0 && height.indexOf("%") < 0) {
                height = height + "px";
            }
            parentStyle = "width:" + width + ";height:" + height;
            var oldStyle = self.attr("style");
            if (oldStyle && oldStyle.length > 0) {
                parentStyle = oldStyle + ";" + parentStyle;
            }
            self.attr("style", parentStyle);
        }

        self.attr("markerCache", []);
        self.attr("searchMarkerCache", []);
    };

    /**
     * 控件渲染后
     */
    var afterRender = function () {
        var self = this;
        var mapApiName = oui.MapApiConfig.MapApiName;
        var ApiObj = oui["_" + mapApiName];
        if (!ApiObj) {//如果不存在接口存在
            oui.require4notSort([
                oui.getContextPath() + oui.MapApiConfig.BaseUrl + mapApiName + ".js"
            ], function () {
                //重新执行afterRender
                self.afterRender();
            });
            return;
        }
        var ouiId = self.attr("ouiId");
        var mapContainerId = "oui-map-container-" + ouiId;
        initView.call(self);
        if (ApiObj.supportApi && ApiObj.supportApi.search) {
            //var centerIsFixed = self.attr("centerIsFixed");
        } else {
            var $el = $(self.getEl());
            self.attr("onSearch", false);
            $el.find(".oui-map-search").remove();
            $el.find(".oui-map-area").removeClass("oui-map-area-searchFixed");
        }
        //使用第三方地图的Api
        ApiObj.ready(function () {
            self.mapApi = new ApiObj(mapContainerId, {
                traffic: self.attr("traffic") || OuiMap.traffic,
                satellite: self.attr("satellite") || OuiMap.satellite,
                location: self.attr("location") || OuiMap.location,
                initEnd: function (mapApi) {
                    if (mapApi) {
                        self.mapApi = mapApi;
                    }
                    initLocation.call(self);

                    initMarkerInfoRender.call(self);

                    initMarkers.call(self);

                    initLines.call(self);

                    initEvents.call(self);

                    initSearch.call(self);

                    initOnClick.call(self);

                    initDataUrl.call(self);

                    initMapEvents.call(self);
                }
            });
        });
    };

    var getLocation = function () {
        var self = this;
        oui.progress("定位中...");
        oui.getLocation(function (res) {
            if (res) {
                oui.progress.hide();
                self.mapApi.setZoomAndCenter(18, {
                    lng: res.longitude,
                    lat: res.latitude
                });
                // drawCenterMarker.call(self, {
                //     lng: res.longitude,
                //     lat: res.latitude
                // });
                clearInfoWindow.call(self);
                clearSearch.call(self);
            } else {
                self.mapApi.geolocation(function (res) {
                    oui.progress.hide();
                    if (res) {
                        self.mapApi.setZoomAndCenter(18, {
                            lng: res.position.longitude,
                            lat: res.position.latitude
                        });
                        // drawCenterMarker.call(self, res.position);
                        clearInfoWindow.call(self);
                        clearSearch.call(self);
                    }
                });
            }
        });
    };

    var initLocation = function () {
        var self = this;
        var location = self.attr("location");
        if (location + '' === 'true') {
            getLocation.call(self);
        } else if (location + '' !== 'false') {
            location = oui.parseJson(location);
            self.mapApi.setZoomAndCenter(18, location);
        }
    };

    /**
     * 根据dataUrl初始化地图
     */
    var initDataUrl = function () {
        var self = this;
        var dataUrl = self.attr("dataUrl");
        var drawMap = self.attr("drawMap");
        if (dataUrl && dataUrl.length > 0) {
            oui.getData(dataUrl, {}, function (result) {
                if (result.success) {
                    var _ouiMap = null;
                    var msg = oui.parseJson(result.msg);
                    var flag = isOuiMapData(msg);
                    if (drawMap) {//有配置drawMap
                        var drawMapFunc = null;
                        if (typeof drawMap === 'function') {
                            drawMapFunc = drawMap;
                        } else if (typeof drawMap === 'string') {
                            drawMapFunc = window.eval(drawMap);
                        }
                        if (drawMapFunc) {
                            _ouiMap = drawMapFunc.call(self, result);
                        }
                    } else {
                        if (flag) {//是OuiMap 对象
                            _ouiMap = msg;
                        }
                    }
                    if (_ouiMap) {
                        if (_ouiMap.markers) {
                            addMarkers.call(self, _ouiMap.markers);
                        }
                        //TODO 初始化Map
                    }
                }
            });
        } else {
            if (drawMap) {//有配置drawMap
                var _ouiMap = null;
                var drawMapFunc = null;
                if (typeof drawMap === 'function') {
                    drawMapFunc = drawMap;
                } else if (typeof drawMap === 'string') {
                    drawMapFunc = window.eval(drawMap);
                }
                if (drawMapFunc) {
                    _ouiMap = drawMapFunc.call(self);
                }
                if (_ouiMap) {
                    if (_ouiMap.markers) {
                        addMarkers.call(self, _ouiMap.markers);
                    }
                    //TODO 初始化Map
                }
            }
        }
    };

    /**
     * 获取当前显示的标点
     */
    var getCurrentShowMarker = function (callback) {
        var self = this;
        var currentMarker = self.attr("currentMarker");
        if (currentMarker) {
            if (!currentMarker.info) {
                var position = {lng: currentMarker.lng, lat: currentMarker.lat};
                self.mapApi.locationConvert2Address(position, function (result) {
                    if (result.status) {
                        currentMarker.info = result.address;
                        callback && callback(currentMarker);
                    } else {
                        callback && callback(currentMarker);
                    }
                });
            } else {
                callback && callback(currentMarker);
            }
        } else {
            callback && callback(null);
        }
    };

    /**
     * 初始化视图
     */
    var initView = function () {
        var self = this;
        self._RenderInfoWindow = template.compile(Map.templateHtml4InfoWindow);
        self._RenderSearchResult = template.compile(Map.templateHtml4SearchResult);

        var $el = $(self.getEl());
        self.$searchView = $el.find(".oui-map-search");
        self.$searchInput = self.$searchView.find("input.map-search-info");
        self.$searchBtn = self.$searchView.find(".map-search-btn");
        self.$searchResultView = self.$searchView.find(".map-search-result");

        self.$searchLocationBtn = $el.find(".oui-map-location-btn");

        self.$InfoWindowView = $el.find(".oui-map-info");

        self.$nearResultView = $el.find(".map-near-result");

    };

    /******************************** 标点点击后显示信息渲染事件 开始 ***********************************/
    var initMarkerInfoRender = function () {
        var self = this;
        var onMarkerInfoRender = self.attr("onMarkerInfoRender");
        if (onMarkerInfoRender) {
            var onMarkerInfoRenderFunc = window.eval(onMarkerInfoRender);
            if (onMarkerInfoRenderFunc && typeof onMarkerInfoRenderFunc === 'function') {
                self.markerInfoRenderFunc = onMarkerInfoRenderFunc;
            }
        }
    };
    /******************************** 标点点击后显示信息渲染事件 结束 ***********************************/

    /******************************** 点击事件开始 ***********************************/
    var initOnClick = function () {
        var self = this;
        var mapApi = self.mapApi;
        var onClick = self.attr("onClick");
        if (onClick + '' !== 'false') {
            mapApi.on("click", function (e) {
                clearInfoWindow.call(self);
                clearSearch.call(self);
                var markerObj = {
                    lng: e.lng,
                    lat: e.lat,
                    showDefaultInfo: true,
                    infoNavigation: true
                };
                if (onClick + '' === 'true') {
                    markerObj = $.extend(true, {}, self.clickMarkerObj || {}, markerObj);
                    self.clickMarkerObj = mapApi.createOrUpdateMarker(markerObj, function () {
                        markerClickFunc.call(self, markerObj);
                    });
                } else {
                    var onClickFunc = window.eval(onClick);
                    if (onClickFunc && typeof onClickFunc === 'function') {
                        onClickFunc.call(self, markerObj);
                    }
                }
            });
        }
    };
    /******************************** 点击事件结束 ***********************************/

    /******************************* 搜索相关开始 **********************************/

    /**
     * 初始化搜索
     */
    var initSearch = function () {
        var self = this;
        var mapApi = self.mapApi;
        var onSearch = self.attr("onSearch");
        if (onSearch + '' !== 'false') {//需要搜索
            initSearchEvents.call(self);
            if (onSearch + '' === 'true') {//组件搜索
                self.doSearch = function (keyword, callback) {
                    mapApi.autoComplete(keyword, function (autoResult) {
                        callback && callback(autoResult);
                    });
                }
            } else {//自定义搜索
                self.doSearch = function (keyword, callback) {
                    var self = this;
                    var searchFunc = window.eval(onSearch);
                    if (searchFunc && typeof searchFunc === 'function') {
                        //调用自定义的请求返回搜索列表
                        searchFunc.call(self, keyword, function (result) {
                            //TODO 校验result 是否合格
                            callback && callback(result);
                        });
                    }
                }
            }
        }
    };

    var initSearchEvents = function () {
        var self = this;
        var mapApi = self.mapApi;
        var clickType = oui.os.mobile ? 'tap' : 'click';
        self.$searchInput.off("focus").on("focus", function () {
            clearNear.call(self);
            clearInfoWindow.call(self);
        });

        /**
         * 搜索框输入事件，值变化事件触发搜索
         */
        self.$searchInput.off("input").on("input", function () {
            var $this = $(this);
            var keyword = $this.val();
            if (keyword && keyword.length > 0) {
                if (self.doSearch) {
                    self.doSearch.call(self, keyword, function (autoResult) {
                        clearNear.call(self);
                        clearInfoWindow.call(self);
                        var html = self._RenderSearchResult({data: autoResult});
                        self.$searchBtn.addClass("delete-btn");
                        self.$searchResultView.addClass("show-searchResult");
                        self.$searchResultView.find("ul").html(html);
                    });
                }
            } else {
                clearSearch.call(self);
            }
        });

        /**
         * 搜索按钮点击事件，如果有删除样式则点击后清除搜索状态和数据
         */
        self.$searchBtn.off(clickType).on(clickType, function () {
            var $this = $(this);
            if ($this.hasClass("delete-btn")) {
                clearSearch.call(self);
            }
            return false;
        });

        var resultViewCallback = function () {
            var $this = $(this);
            var location = $this.attr("location");
            location = oui.parseJson(location);
            var title = $this.find(".search-result-tit").html();
            var address = $this.find(".search-result-info").html();
            var markerCache = self.attr("searchMarkerCache");
            mapApi.removeMarkers(markerCache);
            self.attr("searchMarkerCache", []);
            var markerObj = {
                lng: location.lng,
                lat: location.lat,
                // info: address,
                // infoTitle: title,
                showDefaultInfo: true,
                infoNavigation: true
            };
            if (self.locationMarker) {
                markerObj = $.extend(true, self.locationMarker, markerObj);
            }
            self.locationMarker = markerObj = mapApi.createOrUpdateMarker(markerObj, function () {
                markerClickFunc.call(self, markerObj, true);
            });
            //自动触发一次点击
            if (self.attr("centerIsFixed") + '' !== 'true') {//如果中心不固定则不画中心的
                markerClickFunc.call(self, markerObj, true);
                clearSearch.call(self);
            } else {
                var position = {lng: markerObj.lng, lat: markerObj.lat};
                self.searchMove = true;
                // mapApi.map.panTo(new AMap.LngLat(markerObj.lng, markerObj.lat));
                mapApi.setZoomAndCenter(18, position);
                searchNearBy.call(self);
            }
            self.attr("searchMarkerCache").push(markerObj);

            self.attr("currentMarker", $.extend(true, {}, markerObj, {
                info: address,
                infoTitle: title
            }));
            return false;
        };
        self.$searchResultView.find("ul").off(clickType).on(clickType, "li", resultViewCallback);
        if (oui.os.mobile) {
            self.$nearResultView.find("ul").off(clickType).on(clickType, "li", resultViewCallback);
        }
    };

    /**
     * 清理搜索
     */
    var clearSearch = function () {
        var self = this;
        self.$searchInput.val("");
        self.$searchBtn.removeClass("delete-btn");
        self.$searchResultView.removeClass("show-searchResult");
        self.$searchResultView.find("ul").html("");
        if (!oui.os.mobile && self.attr("centerIsFixed") + '' === 'true') {//pc
            self.$searchResultView.find("ul").html("<div style='padding-top:50px;text-align: center;'>暂无数据</div>");
        }
    };

    /********************************搜索相关结束 *********************************/

    /**
     * 创建信息窗体
     * @param cfg
     * @returns {*}
     */
    var createInfoWindow = function (cfg) {
        var self = this;
        var mapApi = self.mapApi;
        var content = cfg.content;
        var position = cfg.position;
        var html = "";
        if (oui.os.mobile) {
            if (cfg.infoTitle || content) {
                html = self._RenderInfoWindow({
                    infoTitle: cfg.infoTitle || "",
                    info: content || '',
                    infoNavigation: cfg.infoNavigation || false,
                    position: position
                });
                self.$InfoWindowView.html(html);
            } else if (cfg.showDefaultInfo) {
                mapApi.locationConvert2Address(position, function (result) {
                    html = self._RenderInfoWindow({
                        infoTitle: cfg.infoTitle || '',
                        info: result.address,
                        infoNavigation: cfg.infoNavigation || false,
                        position: position
                    });
                    self.$InfoWindowView.html(html);
                });
            }
        } else {
            if (cfg.infoTitle || content) {
                html = self._RenderInfoWindow({
                    infoTitle: cfg.infoTitle || "",
                    info: content || '',
                    infoNavigation: cfg.infoNavigation || false,
                    position: position
                });
                mapApi.createInfoWindow({
                    content: html,
                    lng: position.lng,
                    lat: position.lat
                });
            } else if (cfg.showDefaultInfo) {
                mapApi.locationConvert2Address(position, function (result) {
                    html = self._RenderInfoWindow({
                        infoTitle: cfg.infoTitle || '',
                        info: result.address,
                        infoNavigation: cfg.infoNavigation || false,
                        position: position
                    });
                    mapApi.createInfoWindow({
                        content: html,
                        lng: position.lng,
                        lat: position.lat
                    });
                });
            }
        }
    };

    /**
     * 清除信息窗体
     */
    var clearInfoWindow = function () {
        var self = this;
        if (oui.os.mobile) {
            if (self.$InfoWindowView && self.$InfoWindowView.length > 0) {
                self.$InfoWindowView.html("");
            }
        } else {
            self.mapApi.clearInfoWindow();
        }
    };

    /**
     * 标点点击事件
     */
    var markerClickFunc = function (markerObj, isCenter) {
        var self = this;//地图组件
        var mapApi = self.mapApi;
        var position = {lng: markerObj.lng, lat: markerObj.lat};
        var content = markerObj.info || '';
        var info = "";
        if (self.markerInfoRenderFunc) {
            info = self.markerInfoRenderFunc(markerObj);
            if (info) {
                content = info;
            }
        }
        if (markerObj.infoTitle || (content && typeof content === 'string') || markerObj.showDefaultInfo) {
            createInfoWindow.call(self, {
                showDefaultInfo: markerObj.showDefaultInfo || false,
                infoTitle: markerObj.infoTitle || "",
                content: content || "",
                infoNavigation: markerObj.infoNavigation || false,
                position: position
            });
            //解析控件
            oui.parse();
        }
        if (isCenter) {
            mapApi.setZoomAndCenter(18, position);
        }
    };


    var addMarkers = function (newMarkers) {
        var self = this;
        var mapApi = self.mapApi;
        var markers = self.attr("markers") || [];
        markers = oui.parseJson(markers);
        var i, len;
        if (newMarkers && newMarkers.length > 0) {
            var oldLength = markers.length;
            var newLength = newMarkers.length;
            if (oldLength + newLength > MAX_MARKER_LIMIT) {
                oui.getTop().oui.alert("地图添加标点不能超过" + MAX_MARKER_LIMIT);
                return false;
            }
            var markerObj = null;
            for (i = 0, len = newMarkers.length; i < len; i++) {
                markerObj = $.extend(true, {}, OuiMapMarker, newMarkers[i]);
                markerObj = mapApi.createMarker(markerObj, function (markerObj) {
                    //点事件
                    markerClickFunc.call(self, markerObj, false);
                });
                markers.push(markerObj);
            }
            self.attr("markers", markers);
            //设置点聚合
            mapApi.setMarkerClusterer(markers);
            //设置地图显示全部的点
            mapApi.setFitView();
        }
    };

    /**
     * 初始化标点
     */
    var initMarkers = function () {
        var self = this;
        var markers = self.attr("markers");
        markers = oui.parseJson(markers);
        addMarkers.call(self, markers);
    };

    /**
     * 初始化线条
     */
    var initLines = function () {
        var self = this;
        var i, len;
        var lines = self.attr("lines");
        lines = oui.parseJson(lines);
        if (lines && lines.length > 0) {
            var lineObj = null;//控件数据对象
            for (i = 0, len = lines.length; i < len; i++) {
                lineObj = lines[i];
                lineObj = $.extend(true, {
                    color: OuiMapLine.color,
                    width: OuiMapLine.width,
                    lineType: OuiMapLine.lineType
                }, lines[i]);
                //创建标记点
                lineObj = createLine.call(self, lineObj);
            }
        }
    };

    /**
     * 创建线条
     * @param cfg @see OuiMapLine
     */
    var createLine = function (cfg) {
        var self = this;
        var mapApi = self.mapApi;
        var i, len;
        if (cfg && cfg.markers && cfg.markers.length > 0) {
            var lineArr = [];
            if (cfg.markers && cfg.markers.length > 0) {
                var marker = null;
                for (i = 0, len = cfg.markers.length; i < len; i++) {
                    marker = cfg.markers[i];
                    if (marker && marker.lng && marker.lat) {
                        lineArr.push([marker.lng, marker.lat]);
                    }
                }
            }
            cfg.lineArr = lineArr;
            mapApi.createLine(cfg);
        }
    };

    //初始化事件
    var initEvents = function () {
        var self = this;
        var $el = $(self.getEl());
        if (oui.os.mobile) {
            $el.on("click", ".oui-map-navigation", function () {
                var $this = $(this);
                var currentPosition = $this.attr("currentPosition");
                var title = $this.attr("currentAddress");
                currentPosition = oui.parseJson(currentPosition);
                oui.locationNavigation({
                    name: title || "导航到目的地",
                    lng: currentPosition.lng,
                    lat: currentPosition.lat
                });
                return false;
            });
        }

    };

    var drawCenterMarker = function (position) {
        var self = this;
        if (self.attr("centerIsFixed") + '' !== 'true') {//如果中心不固定则不画中心的
            return false;
        }
        var mapApi = self.mapApi;
        if (!position) {
            position = mapApi.getCenter();
        }
        var markerObj = null;
        if (!self.locationMarker) {
            markerObj = {
                lng: position.lng,
                lat: position.lat,
                // info: "",
                // infoTitle: "",
                showDefaultInfo: true,
                infoNavigation: false
            }
        } else {
            markerObj = $.extend(true, {}, self.locationMarker, {
                lng: position.lng,
                lat: position.lat,
                // info: "",
                // infoTitle: "",
                showDefaultInfo: true,
                infoNavigation: false
            });
        }
        self.locationMarker = mapApi.createOrUpdateMarker(markerObj, function () {
            markerClickFunc.call(self, markerObj);
        });
        clearInfoWindow.call(self);
        self.attr("currentMarker", markerObj);
    };

    var clearNear = function () {
        var self = this;
        self.$nearResultView.removeClass("show-near-result");
        self.$nearResultView.find("ul").html("");
    };

    var searchNearBy = function () {
        var self = this;
        var mapApi = self.mapApi;
        mapApi.searchNearBy("", function (autoResult) {
            clearInfoWindow.call(self);
            if (autoResult && autoResult.length > 0) {
                var html = self._RenderSearchResult({data: autoResult});
                if (oui.os.mobile) {
                    clearSearch.call(self);
                    self.$nearResultView.addClass("show-near-result");
                    self.$nearResultView.find("ul").html(html);
                } else {
                    self.$searchBtn.addClass("delete-btn");
                    self.$searchResultView.addClass("show-searchResult");
                    self.$searchResultView.find("ul").html(html);
                }
            }
        });
    };

    var initMapEvents = function () {
        var self = this;
        var mapApi = self.mapApi;
        //定位中心
        mapApi.on("moveend", function (e) {
            setTimeout(function () {
                if (!self.searchMove) {
                    drawCenterMarker.call(self);
                    if (self.attr("centerIsFixed") + '' === 'true') {
                        searchNearBy.call(self);
                    }
                } else {
                    self.searchMove = false;
                    if (self.attr("centerIsFixed") + '' === 'true') {
                        searchNearBy.call(self);
                    }
                }
            }, 10);
        });
        mapApi.on("mapmove", function (e) {
            if (!self.searchMove) {
                drawCenterMarker.call(self);
            }
        });
        mapApi.on("zoomend", function (e) {
            setTimeout(function () {
                drawCenterMarker.call(self);
                if (self.attr("centerIsFixed") + '' === 'true') {//如果中心不固定则不画中心的
                    searchNearBy.call(self);
                }
            }, 10);
        });
        var clickType = oui.os.mobile ? "tap" : "click";
        self.$searchLocationBtn.on(clickType, function () {
            getLocation.call(self);
        });
    };


})(window, window.oui, window.jQuery);

