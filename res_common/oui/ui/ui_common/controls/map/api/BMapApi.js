/**
 * 百度地图的Api
 * Created by yangH on 2018/4/13.
 */

(function (oui) {

    var _mapReadyCallback = [];

    oui._mapJSReady = function () {
        oui._mapReadyState = true;
        while (_mapReadyCallback && _mapReadyCallback.length > 0) {
            var cb = _mapReadyCallback.shift();
            if (cb && typeof cb === 'function') {
                cb();
            }
        }
    };

    /***************************************** 百度地图Api 结束 *****************************************/
    var BMapApi = (function () {
        /**
         * 高德地图Api
         * @param mapContainerId
         * @param cfg
         * @constructor
         */
        var BMapApi = function (mapContainerId, cfg) {

            this.containerId = mapContainerId;
            this.cfg = cfg;

            this.map = null;

            this.markersMap = {};
            this.markers = [];

            this.linesMap = {};
            this.lines = [];

            if (mapContainerId) {
                this.initMap();
            }
            if(cfg){
                var initEnd = cfg.initEnd;
                initEnd && initEnd(this);
            }
        };

        BMapApi.supportApi = {
            search: true,
        };

        // BMapApi.JS_URL = '//api.map.baidu.com/api?ak=uM9kyoRNEWcTWBRlOyjTqvyrZwbmpR8O&type=lite&v=1.0';

        BMapApi.JS_URL = 'https://api.map.baidu.com/api?v=3.0&ak=uM9kyoRNEWcTWBRlOyjTqvyrZwbmpR8O';

        var _loadJS = function (id, url, callback) {
            if (!document.getElementById(id)) {
                //加载js
                var src = url;
                var script = document.createElement("script");
                script.id = "mapJsTag";
                script.type = "text/javascript";
                script.src = src;
                if (script.readyState) { //ie
                    script.attachEvent('onreadystatechange', function () {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            script.className = 'loaded';
                            callback && callback();
                        }
                    });
                } else {
                    script.addEventListener('load', function () {
                        script.className = "loaded";
                        callback && callback();
                    }, false);
                }
                document.body.appendChild(script);
            } else {
                callback && callback();
            }
        };

        BMapApi.ready = function (callback) {
            if (!oui._mapReadyState) {
                _mapReadyCallback.push(callback);
                if (!document.getElementById("mapJsTag")) {
                    var src = BMapApi.JS_URL;
                    src = oui.setParam(src, "callback", "oui._mapJSReady");
                    var script = document.createElement("script");
                    script.id = "mapJsTag";
                    script.type = "text/javascript";
                    script.src = src;
                    document.body.appendChild(script);
                }
            } else {
                oui._mapReadyState = true;
                callback && callback();
            }
        };

        BMapApi.prototype = {
            /**
             * 初始化地图
             */
            initMap: function () {
                var self = this;
                var cfg = self.cfg;

                var mapType = BMAP_NORMAL_MAP;

                //卫星图显示
                if (cfg.satellite + '' === 'true') {
                    mapType = BMAP_SATELLITE_MAP;
                }

                var map = self.map = new BMap.Map(self.containerId, {
                    minZoom: 3,
                    maxZoom: 20,
                    mapType: mapType
                });

                map.enableScrollWheelZoom(true);

                map.addControl(new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                    type: BMAP_NAVIGATION_CONTROL_ZOOM,
                    showZoomInfo: false
                }));

                //实时交通
                if (cfg.traffic + '' === 'true') {
                    map.addTileLayer(new BMap.TrafficLayer());
                }

                var geolocationControl = new BMap.GeolocationControl();

                geolocationControl.addEventListener("locationSuccess", function (e) {
                    var location = e.point;
                    var point = new BMap.Point(location.lng, location.lat);
                    map.centerAndZoom(point, 18);
                });

                map.addControl(geolocationControl);
                var location = cfg.location;
                if (location + '' === 'true') {
                    geolocationControl.location();
                    //TODO 需要结合第三方定位
                } else if (location + '' !== 'false') {
                    location = oui.parseJson(location);
                    var point = new BMap.Point(location.lng, location.lat);
                    map.centerAndZoom(point, 18);
                    //TODO 是否需要一个标记
                } else {
                    //必须要一个中心的，默认给北京
                    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
                }
            },
            /**
             * 为地图绑定事件
             * @param eventName
             * @param eventFun
             */
            on: function (eventName, eventFun) {
                this.map.addEventListener(eventName, function (e) {
                    eventFun && eventFun({
                        lng: e.lnglat.lng,
                        lat: e.lnglat.lat
                    });
                });
            },

            /**
             * 创建marker
             * @param markerObj
             * @param clickFun
             * @returns {*}
             */
            createMarker: function (markerObj, clickFun) {
                var self = this;
                var markerConfig = {};
                var marker = null;
                if (markerObj && markerObj.lng && markerObj.lat) {
                    markerConfig.position = new BMap.Point(markerObj.lng, markerObj.lat);
                    markerConfig.icon = markerObj.icon;
                    if (markerObj.offset && markerObj.offset.length >= 2) {
                        markerConfig.offset = new BMap.Size(markerObj.offset[0], markerObj.offset[1]);
                    }
                    marker = new BMap.Marker(new BMap.Point(markerObj.lng, markerObj.lat), markerConfig);
                }
                //添加到地图
                if (marker) {
                    self.map.addOverlay(marker);
                    //生成UUID
                    markerObj._id = oui.getUUIDLong();
                    //绑定事件
                    if (clickFun && typeof clickFun === 'function') {
                        marker.addEventListener("click", function () {
                            clickFun.call(self, markerObj);
                        });
                    }
                    this.markersMap[markerObj._id] = marker;
                    this.markers.push(marker);
                }
                return markerObj;
            },

            /**
             * 创建或者修改标点
             * @param makerObj
             * @param clickFunc
             * @returns {*}
             */
            createOrUpdateMarker: function (makerObj, clickFunc) {
                var marker = null;
                if (makerObj) {
                    if (makerObj['_id']) {//如果存在Id
                        marker = this.markersMap[makerObj._id];
                        if (marker) {
                            marker.setPosition(new BMap.Point(markerObj.lng, markerObj.lat));
                        } else {
                            marker = this.createMarker(makerObj, clickFunc);
                        }
                    } else {
                        marker = this.createMarker(makerObj, clickFunc);
                    }
                }
                return marker;
            },
            /**
             * 移除marker
             * @param markers
             */
            removeMarkers: function (markers) {
                var self = this;
                var markerMap = self.markersMap;
                var removeMarkerArray = [];
                var markerObj = null;
                var marker = null;
                if (markers && markers.length > 0) {
                    for (var i = 0, len = markers.length; i < len; i++) {
                        markerObj = markers[i];
                        if (markerObj && markerObj["_id"]) {
                            marker = markerMap[markerObj._id];
                            if (marker) {
                                removeMarkerArray.push(marker);
                            }
                        }
                    }
                }
                if (removeMarkerArray && removeMarkerArray.length > 0) {
                    self.map.remove(removeMarkerArray);
                }
            },
            /**
             * 创建信息窗体
             * @param cfg
             */
            createInfoWindow: function (cfg) {
                var self = this;
                if (!self.infoWindow) {
                    self.infoWindow = new BMap.InfoWindow("", {
                        offset: new BMap.Size(0, 0),
                        enableAutoPan: true
                    });

                    //信息窗体打开时候 地图上的鼠标滚轮事件失效，关闭时生效
                    // self.infoWindow.on("open", function () {
                    //     self.map.setStatus({
                    //         scrollWheel: false
                    //     });
                    // });
                    // self.infoWindow.on("close", function () {
                    //     self.map.setStatus({
                    //         scrollWheel: true
                    //     });
                    // });

                    // this.map.on('mouseover',function() {
                    //     self.map.setStatus({scrollWheel: true});
                    // });
                    // this.map.on('mouseout',function() {
                    //     self.map.setStatus({scrollWheel: false});
                    // });
                }

                if (self.infoWindow) {
                    self.infoWindow.setContent(cfg.content);
                    self.map.openInfoWindow(self.infoWindow, new BMap.Point(cfg.lng, cfg.lat));
                    // self.infoWindow.open(self.map, new AMap.LngLat(cfg.lng, cfg.lat));
                }
            },
            /**
             * 清空信息窗体
             */
            clearInfoWindow: function () {
                if (this.infoWindow) {
                    this.infoWindow.setMap(null);
                }
            },
            /**
             * 创建线
             * @param lineObj
             * @returns {*}
             */
            createLine: function (lineObj) {
                if (lineObj && lineObj.lineArr) {
                    lineObj._id = oui.getUUIDLong();
                    var polyline = new AMap.Polyline({
                        path: lineObj.lineArr,          //设置线覆盖物路径
                        strokeColor: lineObj.color, //线颜色
                        strokeOpacity: 0.9,       //线透明度
                        lineCap: "round",
                        lineJoin: "round",
                        strokeWeight: lineObj.width,        //线宽
                        strokeStyle: lineObj.lineType,   //线样式
                        strokeDasharray: [10, 5] //补充线样式
                    });
                    polyline.setMap(this.map);
                    this.linesMap[lineObj._id] = polyline;
                    this.lines.push(polyline);
                }

                return lineObj;
            },

            /**
             * 初始化位置和地址转换服务插件
             * @param callback
             */
            _initGeocoder: function (callback) {
                var self = this;
                if (!self.geocoder) {
                    //TODO 考虑地图还未加载
                    AMap.plugin('AMap.Geocoder', function () {
                        self.geocoder = new AMap.Geocoder({
                            city: "010", //城市，默认：“全国”
                            radius: 1000, //范围，默认：500
                            extensions: "base"
                        });
                        callback && callback();
                    });
                } else {
                    callback && callback();
                }
            },
            /**
             * 经纬度转地址
             * @param location
             * @param callback
             */
            locationConvert2Address: function (location, callback) {
                var self = this;
                self._initGeocoder(function () {
                    self.geocoder.getAddress([location.lng, location.lat], function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callback && callback({
                                status: true,
                                address: result.regeocode.formattedAddress
                            });
                        } else {
                            callback && callback({
                                status: false,
                                msg: "获取失败!"
                            });
                        }
                    });
                });
            },
            /**
             * 地址转经纬度
             * @param address
             * @param callback
             */
            addressConvert2Location: function (address, callback) {
                var self = this;
                self._initGeocoder(function () {
                    self.geocoder.getLocation(address, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            //TODO 地址转经纬度 待实现
                            callback && callback();
                        } else {
                            console.error(arguments);
                            callback && callback({
                                status: false,
                                msg: "获取失败!"
                            });
                        }
                    });
                });
            },

            /**
             * 初始化搜索服务
             * @param callback
             */
            _initSearchService: function (callback) {
                var self = this;
                if (!self.searchPlugin || !self.autoCompletePlugin) {
                    AMap.plugin(['AMap.PlaceSearch', 'AMap.Autocomplete'], function () {
                        self.searchPlugin = new AMap.PlaceSearch({
                            pageIndex: 1,
                            pageSize: 15,
                            extensions: "all"
                            // city: self.city
                        });
                        self.autoCompletePlugin = new AMap.Autocomplete({});
                        callback && callback();
                    });
                } else {
                    callback && callback();
                }
            },

            /**
             * 根据关键字，自动补全
             * @param keyword
             * @param callback
             */
            autoComplete: function (keyword, callback) {
                var self = this;
                self._initSearchService(function () {
                    self.autoCompletePlugin.search(keyword, function (status, result) {
                        var autoResult = [];
                        if (status === 'complete' && result.info === "OK") {
                            var tips = result.tips;
                            var tip = null;
                            for (var i = 0, len = tips.length; i < len; i++) {
                                tip = tips[i];
                                autoResult.push({
                                    location: tip.location,
                                    title: tip.name,
                                    address: tip.district + tip.address
                                });
                            }
                        }
                        callback && callback(autoResult);
                    });
                });
            },

            /**
             * 设置缩放级别以及中心位置
             * @param level
             * @param position
             */
            setZoomAndCenter: function (level, position) {
                //TODO
                //this.map.setZoomAndCenter(level, new AMap.LngLat(position.lng, position.lat));
            },
            /**
             * 设置标点聚合
             */
            setMarkerClusterer: function () {//TODO 需要传markers吗？
                var self = this;
                var markers = this.markers;
                _loadJS("TextIconOverlay_minJSTag", "https://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js", function () {
                    _loadJS("MarkerClusterer_minJSTag", "https://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js", function () {
                        new BMapLib.MarkerClusterer(self.map, {markers: markers});
                    });
                });
            },
            /**
             * 设置地图显示完所有覆盖物
             */
            setFitView: function () {
                // this.map.setFitView();
            }

        };
        return BMapApi;
    })();

    oui["_BMapApi"] = BMapApi;
})();

