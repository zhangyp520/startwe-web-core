/**
 * Created by yangH on 2018/4/20.
 */
/**
 * 咸阳地图API
 * Created by yangH on 2018/4/16.
 */

dojoConfig = {
    parseOnLoad: true,
    packages: [{
        name: 'tdlib',
        location: "/res_common/oui/ui/ui_common/controls/map/api/taglib"
    }]
};

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

    //测试环境 http
    var MapConfig = {
        baseUrl: "http://js.arcgis.com/3.12/",
        TileServer4LabelMap: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgLabelMap/mCTA0mLK-84uFSMm/TileServer',
        TileServer4Map: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgMap/QwO2b6o16gof4c-q/TileServer'
    };


    //测试环境
    // var MapConfig = {
    //     baseUrl: "http://js.arcgis.com/3.12/",
    //     TileServer4LabelMap: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgLabelMap/vY4oH6wtDgX9CgBg/TileServer',
    //     TileServer4Map: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgMap/w4BJioNeODR74JkM/TileServer'
    // };
    //
    //本地环境
    // var MapConfig = {
    //     baseUrl: "/arcgis_js_api/4.6/",
    //     TileServer4LabelMap: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgLabelMap/ReOdzT95H0en-eNu/TileServer',
    //     TileServer4Map: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgMap/OZ3o2HSRlBHYANJH/TileServer'
    // };
    //
    // //咸阳环境
    // var MapConfig = {
    //     baseUrl: "http://js.arcgis.com/3.12/",
    //     TileServer4LabelMap: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgLabelMap/vY4oH6wtDgX9CgBg/TileServer',
    //     TileServer4Map: 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgMap/w4BJioNeODR74JkM/TileServer'
    // };

    /***************************************** 高德地图Api 结束 *****************************************/
    var XYMapApi = (function () {
        /**
         * 高德地图Api
         * @param mapContainerId
         * @param cfg
         * @constructor
         */
        var XYMapApi = function (mapContainerId, cfg) {
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
        };

        XYMapApi.supportApi = {
            search: false
        };

        XYMapApi.JS_URL = MapConfig.baseUrl + 'init.js';

        //西安影像注记
        XYMapApi.TileServer4LabelMap = MapConfig.TileServer4LabelMap;//'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgLabelMap/ReOdzT95H0en-eNu/TileServer';
        //西安影像底图
        XYMapApi.TileServer4Map = MapConfig.TileServer4Map;//'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgMap/OZ3o2HSRlBHYANJH/TileServer';

        // //testpro.startwe.net
        // XYMapApi.TileServer4LabelMap = 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgLabelMap/vY4oH6wtDgX9CgBg/TileServer';
        // //testpro.startwe.net
        // XYMapApi.TileServer4Map = 'http://1.85.55.27:8080/ServiceSystem2016/rest/service/SxImgMap/w4BJioNeODR74JkM/TileServer';

        XYMapApi.ready = function (callback) {
            if (!oui._mapReadyState) {
                _mapReadyCallback.push(callback);
                if (!document.getElementById("mapJsTag")) {
                    var src = XYMapApi.JS_URL;
                    var script = document.createElement("script");
                    script.id = "mapJsTag";
                    script.type = "text/javascript";
                    script.src = src;
                    if (script.readyState) { //ie
                        script.attachEvent('onreadystatechange', function () {
                            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                                script.className = 'loaded';
                                oui._mapJSReady();
                            }
                        });
                    } else {
                        script.addEventListener('load', function () {
                            script.className = "loaded";
                            oui._mapJSReady();
                        }, false);
                    }
                    document.body.appendChild(script);
                    oui.require4notSort([
                        // MapConfig.baseUrl + "dijit/themes/claro/claro.css",
                        MapConfig.baseUrl + "esri/css/main.css",
                        "/res_common/oui/ui/ui_common/controls/map/api/taglib/myModules/InfoWindow.css"
                    ], function () {

                    });
                }
            } else {
                oui._mapReadyState = true;
                callback && callback();
            }
        };

        XYMapApi.prototype = {
            /**
             * 初始化地图
             */
            initMap: function () {

                var self = this;
                var cfg = self.cfg;
                require([
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/views/ViewAnimation",
                    "esri/Basemap",
                    "esri/layers/GraphicsLayer",
                    "esri/symbols/PictureMarkerSymbol",
                    "esri/Graphic",
                    "esri/geometry/SpatialReference",
                    "esri/layers/TileLayer",
                    "esri/geometry/Point",
                    // "tdlib/myModules/InfoWindow",
                    // "tdlib/TDTLayer",//天地图全球影像地图
                    // "tdlib/TDTAnnoLayer",//天地图全球影像标注地图
                    "dojo/dom-construct",
                    "dojo/dom",
                    "dojo/domReady!"
                ], function (Map,
                             MapView,
                             ViewAnimation,
                             Basemap,
                             GraphicsLayer,
                             PictureMarkerSymbol,
                             Graphic,
                             SpatialReference,
                             TileLayer,
                             Point,
                             // InfoWindow,
                             // TDTLayer,
                             // TDTAnnoLayer,
                             domConstruct,
                             dom) {
                    self.spr = new SpatialReference({wkid: 4326});
                    // var infoWindow = new InfoWindow({domNode: domConstruct.create("div", null, dom.byId(self.containerId))});
                    var center = [108.70442564487458, 34.33059327602386];
                    // var location = cfg.location;
                    // if (location + '' !== 'false' && location + '' !== 'true') {
                    //     try {
                    //         location = oui.parseJson(location);
                    //         center = [location.lng, location.lat];
                    //     } catch (e) {
                    //         //location = cfg.location;
                    //     }
                    // }
                    var oolayer = new TileLayer(XYMapApi.TileServer4LabelMap);
                    var olayer = new TileLayer(XYMapApi.TileServer4Map);

                    var customBasemap = new Basemap({
                        baseLayers: [olayer, oolayer],
                        title: "Custom Basemap",
                        id: "myBasemap"
                    });

                    self.map = new Map({
                        basemap: customBasemap
                    });

                    var view = new MapView({
                        center: center, // long, lat
                        container: self.containerId,
                        map: self.map,
                        zoom: 6,
                        updating:true
                    });

                    view.watch("animation", function(response){
                        console.log(response.state);
                        // if(response && response.state === "running"){
                        //     console.log("Animation in progress");
                        // }
                        // else{
                        //     console.log("No animation");
                        // }
                    });

                    view.always(function(){
                        console.log("a");
                    });

                    // view.on("drag", function () {
                    //     console.log(arguments);
                    //     console.log(view.extent.center.x + "-----" + view.extent.center.y);
                    // });
                    //
                    // view.on("Pan", function () {
                    //     console.log("Pan");
                    // });
                    //
                    // view.on("updating", function () {
                    //     console.log("updating");
                    // });
                    // self.map = new Map(self.containerId, {
                    //     spatialReference: self.spr,
                    //     center: center,
                    //     // maxZoom: 18,//最大空间等级
                    //     // minZoom: 6,//最小空间等级
                    //     logo: false,
                    //     zoom: 15,
                    //     sliderstyle: "large",//放大缩小控件的样式
                    //     // infoWindow: infoWindow,
                    //     sliderPosition: "bottom-right"//设置放大缩小控件 在右下角出现
                    //     // basemap: "topo"
                    // });

                    // var basemap = new TDTLayer();
                    // var annolayer = new TDTAnnoLayer();


                    // self.map.addLayer(basemap);//全球底图
                    // self.map.addLayer(annolayer);//全球标注图
                    // self.map.add(olayer);//西安底图
                    // self.map.add(oolayer);//西安标注图
                    //
                    // //todo 需要更具外面定位来，如果没有则指定他中心点
                    // // var point = new Point([108.7, 34.3], spr);
                    // // self.map.centerAndZoom(point, 15);
                    //
                    // self.map.on("click", function (event) {
                    //     //self.map.centerAndZoom(event.mapPoint, 15);
                    // });
                    //
                    // self.map.on("load", function () {
                    //     self.map.graphics.on("click", function (e) {
                    //         var graphic = e.graphic;
                    //         if (graphic._clickFun_) {
                    //             graphic._clickFun_ && graphic._clickFun_();
                    //         }
                    //     });
                    //     cfg.initEnd && cfg.initEnd(self);
                    // });

                });
            },
            getCenter: function () {
                var point = this.map.extent.getCenter();
                return {
                    lng: point.x,
                    lat: point.y
                };
                // return this.map.getCenter();
            },
            /**
             * 为地图绑定事件
             * @param eventName
             * @param eventFun
             */
            on: function (eventName, eventFun) {
                var self = this;
                var name = "";
                switch (eventName) {
                    // case "mapmove":
                    //     name = "pan";
                    //     break;
                    case "moveend":
                        name = "pan-end";
                        break;
                    case "zoomend":
                        name = "zoom-end";
                        break;
                }
                if (!name) {
                    return;
                }
                this.map.on(name, function (e) {
                    var args = null;
                    //FIXME 平移更新中心点
                    // self.map.extent = e.extent;
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

                oui.showAutoTips("该地图不支持定位接口,使用HTML5的定位");
                callback && callback(self.getCenter());
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
                    var point = new esri.geometry.Point([markerObj.lng, markerObj.lat], self.spr);//new AMap.LngLat(markerObj.lng, markerObj.lat); //[markerObj.lng, markerObj.lat];
                    var icon = markerObj.icon;
                    if (icon) {
                        if (typeof icon === 'string') {
                            markerConfig.url = icon;
                        } else if (icon.image) {
                            markerConfig.url = icon.image;
                            markerConfig.width = icon.width;
                            markerConfig.height = icon.height;
                        }
                    } else {
                        markerConfig.url = oui.getContextPath() + "res_common/oui/ui/ui_common/controls/map/images/mark_bs.png";
                        markerConfig.width = 19;
                        markerConfig.height = 34;
                        markerConfig.yoffset = 10;
                        // markerConfig.yOffset = 22;
                    }
                    marker = new esri.Graphic(point, new esri.symbol.PictureMarkerSymbol(markerConfig));
                }
                //添加到地图
                if (marker) {
                    self.map.graphics.add(marker);
                    //生成UUID
                    markerObj._id = oui.getUUIDLong();
                    //绑定事件
                    if (clickFun && typeof clickFun === 'function') {
                        marker._clickFun_ = function () {
                            clickFun.call(self, markerObj);
                        };
                    } else {
                        marker._clickFun_ = null;
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
                            //重置经纬度
                            marker.setGeometry(new esri.geometry.Point([markerObj.lng, markerObj.lat], self.spr));
                            //绑定事件
                            if (clickFunc && typeof clickFunc === 'function') {
                                marker._clickFun_ = function () {
                                    clickFunc.call(self, markerObj);
                                };
                            } else {
                                marker._clickFun_ = null;
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
                var i, len;
                if (markers && markers.length > 0) {
                    for (i = 0, len = markers.length; i < len; i++) {
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
                    for (i = 0, len = removeMarkerArray.length; i < len; i++) {
                        self.map.graphics.remove(removeMarkerArray[i]);
                    }
                }
            },
            /**
             * 创建信息窗体
             * @param cfg
             */
            createInfoWindow: function (cfg) {
                var self = this;
                if (!self.infoWindow) {
                    self.infoWindow = self.map.infoWindow;
                }
                if (self.infoWindow) {
                    self.infoWindow.setContent("经度:" + cfg.lng + "<br/>纬度:" + cfg.lat);
                    self.infoWindow.show(new esri.geometry.Point([cfg.lng, cfg.lat], self.spr));
                }
            },
            /**
             * 清空信息窗体
             */
            clearInfoWindow: function () {
                if (this.infoWindow) {
                    this.infoWindow.close();
                }
            },
            /**
             * 创建线
             * TODO 暂时不做
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
                    // AMap.plugin('AMap.Geocoder', function () {
                    //     self.geocoder = new AMap.Geocoder({
                    //         city: "010", //城市，默认：“全国”
                    //         radius: 1000, //范围，默认：500
                    //         extensions: "base"
                    //     });
                    //     callback && callback();
                    // });
                    callback && callback();
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
                    callback && callback({
                        status: true,
                        address: "经度：" + location.lng + "；纬度：" + location.lat //oui.parseString({lng: location.lng, lat: location.lat})
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
                    callback && callback({
                        status: false,
                        msg: "获取失败!"
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
                    callback && callback();
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
                    callback && callback([]);
                });
            },
            searchNearBy: function (keyword, callback) {
                var self = this;
                self._initSearchService(function () {
                    callback && callback([]);
                });
            },
            /**
             * 设置缩放级别以及中心位置
             * @param level
             * @param position
             */
            setZoomAndCenter: function (level, position) {
                this.map.centerAndZoom(new esri.geometry.Point([position.lng, position.lat], this.spr), level);
            },
            /**
             * 设置标点聚合
             */
            setMarkerClusterer: function () {//TODO 需要传markers吗？
                var self = this;
                var markers = this.markers;
                var count = markers.length;
                //TODO 暂不实现
                // AMap.plugin(['AMap.MarkerClusterer'], function () {
                //     var cluster = new AMap.MarkerClusterer(self.map, markers, {
                //         renderCluserMarker: function (context) {
                //             var factor = Math.pow(context.count / count, 1 / 18);
                //             var div = document.createElement('div');
                //             var Hue = 180 - factor * 180;
                //             var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
                //             var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
                //             var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
                //             div.style.backgroundColor = bgColor;
                //             var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
                //             div.style.width = div.style.height = size + 'px';
                //             div.style.border = 'solid 1px ' + borderColor;
                //             div.style.borderRadius = size / 2 + 'px';
                //             div.style.boxShadow = '0 0 1px ' + shadowColor;
                //             div.innerHTML = context.count;
                //             div.style.lineHeight = size + 'px';
                //             div.style.color = '#ffffff';
                //             div.style.fontSize = '18px';
                //             div.style.fontWeight = 'bold';
                //             div.style.textAlign = 'center';
                //             context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
                //             context.marker.setContent(div)
                //         },
                //         gridSize: 40
                //     });
                //     var array = cluster.getMarkers();
                //     self.map.setFitView(array);
                // });
            },
            /**
             * 设置地图显示完所有覆盖物
             */
            setFitView: function () {
                //this.map.setFitView();
            },
            convertFrom: function (position, type, callback) {
                var _newPosition = {
                    longitude: position[0],
                    latitude: position[1]
                };
                callback && callback(_newPosition);
            }
        };
        return XYMapApi;
    })();
    oui['_XYMapApi'] = XYMapApi;
})(oui);

