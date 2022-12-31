/**
 * Created by YangH on 2018/11/24.
 */
(function (win) {
    /**
     * 全局空间 Vcity
     */
    var Vcity = win.Vcity || {};
    win.Vcity = Vcity;

    var templateHTML =
        '    <div class="cityKey">' +
        '        <ul>' +
        '            <li class="key-selector" key="hot">★</li>' +
        '            {{each firstCharList as key}}' +
        '            <li class="key-selector"  key="{{key}}">{{key }}</li>' +
        '            {{/each}}' +
        '        </ul>' +
        '    </div>' +
        '<div class="city-select">' +
        '    <div class="showCityKey">' +
        '        <span>A</span>' +
        '    </div>' +
        '    <div class="oui-city">' +
        '        <div class="oui-city-item" key="hot">' +
        '            <div class="oui-city-item-title">★热门城市</div>' +
        '            <ul class="hotCity">' +
        '                {{each oCity["hot"] as name i}}<li><span class="cityName">{{name }}</span></li>{{/each}}' +
        '            </ul>' +
        '        </div>' +
        '        {{each firstCharList as key}}' +
        '        <div class="oui-city-item" key="{{key }}">' +
        '            <div class="oui-city-item-title">{{key }}</div>' +
        '            <ul>' +
        '                {{each oCity[key] as name i}}<li><span class="cityName">{{name }}</span></li>{{/each}}' +
        '            </ul>' +
        '        </div>' +
        '        {{/each}}' +
        '    </div>' +
        '</div>';

    var cityFirstChart = [
        "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "p", "Q", "R", "S", "T", "W", "X", "Y", "Z"
    ];

    (function () {
        var citys = Vcity.allCity,
            hotCitys = Vcity.hotCity,
            match,
            letter,
            regEx = Vcity.regEx;
        // reg2 = /^[a-b]$/i,
        // reg3 = /^[c-d]$/i,
        // reg4 = /^[e-g]$/i,
        // reg5 = /^[h]$/i,
        // reg6 = /^[j]$/i,
        // reg7 = /^[k-l]$/i,
        // reg8 =  /^[m-p]$/i,
        // reg9 =  /^[q-r]$/i,
        // reg10 =  /^[s]$/i,
        // reg11 =  /^[t]$/i,
        // reg12 =  /^[w]$/i,
        // reg13 =  /^[x]$/i,
        // reg14 =  /^[y]$/i,
        // reg15 =  /^[z]$/i;

        if (!Vcity.oCity) {
            var i, n;
            Vcity.oCity = {};
            Vcity.oCity['hot'] = [];
            var cityConfig = {};
            for (i = 0, n = cityFirstChart.length; i < n; i++) {
                // Vcity.oCity[cityFirstChart[i]] = {};
                cityConfig[cityFirstChart[i]] = {
                    reg: new RegExp("^[" + cityFirstChart[i] + "]$", "i")
                }
            }
            for (i = 0, n = citys.length; i < n; i++) {
                match = regEx.exec(citys[i]);
                letter = match[3].toUpperCase();
                for (var key in cityConfig) {
                    if (cityConfig[key].reg.test(letter)) {
                        if (!Vcity.oCity[key]) {
                            Vcity.oCity[key] = [];
                        }
                        Vcity.oCity[key].push(match[1]);
                    }
                }
            }
            /* 热门城市*/
            for (i = 0, n = hotCitys.length; i < n; i++) {
                match = regEx.exec(hotCitys[i]);
                //letter = match[3].toUpperCase();
                if (!Vcity.oCity['hot']) Vcity.oCity['hot'] = [];
                Vcity.oCity['hot'].push(match[1]);
            }
        }
    })();

    Vcity.show = function (cfg) {
        var input = cfg.input;
        var choose = cfg.choose || function () {

        };
        if (input) {
            var render = template.compile(templateHTML);
            var html = render({firstCharList: cityFirstChart, oCity: Vcity.oCity});
            var $input = $(input);
            $input.on('tap', function () {
                var cityDialog = oui.showHTMLDialog({
                    center: false,
                    content: html
                });
                var $el = $(cityDialog.getEl());
                var $citySelect = $el.find(".city-select");
                var $cityItems = $el.find(".oui-city");
                var $showCity = $el.find(".showCityKey");
                $el.on("touchstart touchmove", ".cityKey ul li", function (e) {
                    e = e || window.event;
                    var touch = e.originalEvent.targetTouches[0];
                    var ele = document.elementFromPoint(touch.pageX, touch.pageY);
                    var $key = $(ele);
                    if ($key.hasClass("key-selector")) {
                        var key = $key.attr("key");
                        var cityItem = $cityItems.find(".oui-city-item[key='" + key + "']");
                        $citySelect.scrollTop(cityItem[0].offsetTop);
                        $showCity.find("span").html(key);
                        $showCity.show().delay(500).hide(0);
                    }
                    return false;
                });

                $el.on("touchend", ".cityKey ul li", function () {
                    $showCity.hide(0);
                    return false;
                });

                $cityItems.on("tap", ".cityName", function () {
                    var $item = $(this);
                    var cityName = $item.html();
                    $input.val(cityName);
                    choose && choose(cityName);
                    cityDialog.hide();
                    return false;
                });
                return false;
            });
        }
    };


})(window);

