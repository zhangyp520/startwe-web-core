/**
 * 高德地图的api
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

    /***************************************** 高德地图Api 结束 *****************************************/
    var AMapApi = (function () {
        /**
         * 高德地图Api
         * @param mapContainerId
         * @param cfg
         * @constructor
         */
        var AMapApi = function (mapContainerId, cfg) {

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

        AMapApi.supportApi = {
            search: true,
        };

        AMapApi.JS_URL = 'https://webapi.amap.com/maps?v=1.4.5&key=cd8aef9ec3a7fadb2914bb8cbafab70a';


        AMapApi.ready = function (callback) {
            if (!oui._mapReadyState) {
                _mapReadyCallback.push(callback);
                if (!document.getElementById("mapJsTag")) {
                    var src = AMapApi.JS_URL;
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

        AMapApi.prototype = {
            /**
             * 初始化地图
             */
            initMap: function () {
                var self = this;
                var cfg = self.cfg;
                self.map = new AMap.Map(self.containerId, {
                    zooms: [3, 20],//放大缩小级别
                    resizeEnable: true,
                    expandZoomRange: true,
                    viewModel: cfg.viewModel || "2D"//显示模式
                });

                //卫星图显示
                if (cfg.satellite + '' === 'true') {
                    self.map.setLayers([
                        new AMap.TileLayer.Satellite(),
                        new AMap.TileLayer.RoadNet()
                    ]);
                }
                //实时交通
                if (cfg.traffic + '' === 'true') {
                    var trafficLayer = new AMap.TileLayer.Traffic();
                    trafficLayer.setMap(self.map);
                }


                //放大缩小控件
                self.map.plugin(['AMap.ToolBar'], function () {
                    var toolBar = new AMap.ToolBar({
                        liteStyle: true,
                        direction: false,
                        locate: false
                    });
                    self.map.addControl(toolBar);
                });
            },
            getCenter: function () {
                return this.map.getCenter();
            },
            /**
             * 为地图绑定事件
             * @param eventName
             * @param eventFun
             */
            on: function (eventName, eventFun) {
                this.map.on(eventName, function (e) {
                    var args = null;
                    if (e.lnglat) {
                        args = {
                            lng: e.lnglat.lng,
                            lat: e.lnglat.lat
                        }
                    }
                    eventFun && eventFun(args);
                });
            },
            geolocation: function (callback) {
                var self = this;
                if (!self.geolocationPlugin) {
                    //定位控件
                    self.map.plugin('AMap.Geolocation', function () {
                        self.geolocationPlugin = new AMap.Geolocation({
                            enableHighAccuracy: true,//是否使用高精度定位，默认:true
                            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                            buttonOffset: new AMap.Pixel(10, 30),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                            buttonPosition: 'LB',
                            panToLocation: true,
                            showMarker: false,
                            showButton: false,
                            // showCircle: false
                        });
                        self.map.addControl(self.geolocationPlugin);
                        AMap.event.addListener(self.geolocationPlugin, 'complete', function (e) {
                            if (e.info === "SUCCESS") {
                                callback && callback({
                                    position: {
                                        longitude: e.position.lng,
                                        latitude: e.position.lat
                                    },
                                    address: e.formattedAddress
                                });
                            } else {
                                callback && callback(null);
                            }
                        });//返回定位信息

                        AMap.event.addListener(self.geolocationPlugin, 'error', function (e) {
                            callback && callback(null);
                        });
                        self.geolocationPlugin.getCurrentPosition();
                        //返回定位出错信息
                        // var location = cfg.location;
                        // if (location + '' === 'true') {
                        //     self.geolocation.getCurrentPosition();
                        // } else if (location + '' !== 'false') {
                        //     location = oui.parseJson(location);
                        //     self.map.setZoomAndCenter(12, new AMap.LngLat(location.lng, location.lat));
                        // }
                    });
                } else {
                    self.geolocationPlugin.getCurrentPosition();
                }
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
                    markerConfig.position = new AMap.LngLat(markerObj.lng, markerObj.lat); //[markerObj.lng, markerObj.lat];
                    var icon = markerObj.icon;
                    if (icon) {
                        if (typeof icon === 'string') {
                            markerConfig.icon = icon;
                        } else if (icon.image) {
                            markerConfig.icon = new AMap.Icon({
                                image: icon.image,
                                imageSize: new AMap.Size(icon.width, icon.height)
                            });
                        }
                    }
                    if (markerObj.offset && markerObj.offset.length >= 2) {
                        markerConfig.offset = new AMap.Pixel(markerObj.offset[0], markerObj.offset[1]);
                    }
                    marker = new AMap.Marker(markerConfig);
                }
                //添加到地图
                if (marker) {
                    marker.setMap(self.map);
                    //生成UUID
                    markerObj._id = oui.getUUIDLong();
                    //绑定事件
                    if (clickFun && typeof clickFun === 'function') {
                        var c = function () {
                            clickFun.call(self, markerObj);
                        };
                        marker.off("click", marker._clickFun_).on("click", c);
                        marker._clickFun_ = c;
                    } else {
                        marker.off("click", marker._clickFun_);
                    }
                    this.markersMap[markerObj._id] = marker;
                    this.markers.push(marker);
                }
                return markerObj;
            },

            /**
             * 创建或者修改标点
             * @param markerObj
             * @param clickFunc
             * @returns {*}
             */
            createOrUpdateMarker: function (markerObj, clickFunc) {
                var self = this;
                var marker = null;
                if (markerObj) {
                    if (markerObj['_id']) {//如果存在Id
                        marker = this.markersMap[markerObj._id];
                        if (marker) {
                            marker.setPosition(new AMap.LngLat(markerObj.lng, markerObj.lat));
                            marker.setMap(self.map);
                            //绑定事件
                            if (clickFunc && typeof clickFunc === 'function') {
                                var c = function () {
                                    clickFunc.call(self, markerObj);
                                };
                                marker.off("click", marker._clickFun_).on("click", c);
                                marker._clickFun_ = c;
                            } else {
                                marker.off("click", marker._clickFun_);
                            }
                            this.markersMap[markerObj._id] = marker;
                        } else {
                            markerObj = this.createMarker(markerObj, clickFunc);
                        }
                    } else {
                        markerObj = this.createMarker(markerObj, clickFunc);
                    }
                }
                return markerObj;
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
                    self.infoWindow = new AMap.InfoWindow({
                        autoMove: false,
                        offset: new AMap.Pixel(0, -30),
                        closeWhenClickMap: true
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
                    self.infoWindow.open(self.map, new AMap.LngLat(cfg.lng, cfg.lat));
                }
            },
            /**
             * 清空信息窗体
             */
            clearInfoWindow: function () {
                if (this.infoWindow) {
                    this.infoWindow.close();
                    //this.infoWindow.setMap(null);
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
            searchNearBy: function (keyword, callback) {
                var self = this;
                self._initSearchService(function () {
                    var map = self.map;
                    self.searchPlugin.searchNearBy(keyword || "", map.getCenter(), 3000, function (status, result) {
                        var autoResult = [];
                        if (status + '' === "complete" && result.info + '' === 'OK') {
                            var poiList = result.poiList.pois;
                            if (poiList && poiList.length > 0) {
                                var pio = null;
                                for (var i = 0, len = poiList.length; i < len; i++) {
                                    pio = poiList[i];
                                    autoResult.push({
                                        location: pio.location,
                                        title: pio.name,
                                        address: pio.pname + pio.cityname + pio.adname + pio.name
                                    });
                                }
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
                var self = this;
                setTimeout(function () {
                    self.map.setZoomAndCenter(level, new AMap.LngLat(position.lng, position.lat));
                }, 10);
            },
            /**
             * 设置标点聚合
             */
            setMarkerClusterer: function () {//TODO 需要传markers吗？
                var self = this;
                var markers = this.markers;
                var count = markers.length;
                AMap.plugin(['AMap.MarkerClusterer'], function () {
                    var cluster = new AMap.MarkerClusterer(self.map, markers, {
                        renderCluserMarker: function (context) {
                            var factor = Math.pow(context.count / count, 1 / 18);
                            var div = document.createElement('div');
                            var Hue = 180 - factor * 180;
                            var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
                            var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
                            var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
                            div.style.backgroundColor = bgColor;
                            var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
                            div.style.width = div.style.height = size + 'px';
                            div.style.border = 'solid 1px ' + borderColor;
                            div.style.borderRadius = size / 2 + 'px';
                            div.style.boxShadow = '0 0 1px ' + shadowColor;
                            div.innerHTML = context.count;
                            div.style.lineHeight = size + 'px';
                            div.style.color = '#ffffff';
                            div.style.fontSize = '18px';
                            div.style.fontWeight = 'bold';
                            div.style.textAlign = 'center';
                            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
                            context.marker.setContent(div)
                        },
                        gridSize: 40
                    });
                    var array = cluster.getMarkers();
                    self.map.setFitView(array);
                });
            },
            /**
             * 设置地图显示完所有覆盖物
             */
            setFitView: function () {
                this.map.setFitView();
            },
            convertFrom: function (position, type, callback) {
                var _newPosition = null;
                AMap.convertFrom(position, type, function (b, c) {
                    if (c && c.locations) {
                        var d = c.locations[0];
                        _newPosition = {
                            longitude: d.lng,
                            latitude: d.lat
                        };
                    } else {
                        _newPosition = {
                            longitude: position[0],
                            latitude: position[1]
                        };
                    }
                    callback && callback(_newPosition);
                });
            }
        };
        return AMapApi;
    })();
    oui["_AMapApi"] = AMapApi;
})(oui);

