(function($) {
    "use strict";

    //support
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    //$.getTranslate = function (el, axis) {
    //    var matrix, curTransform, curStyle, transformMatrix;
    //
    //    // automatic axis detection
    //    if (typeof axis === 'undefined') {
    //        axis = 'x';
    //    }
    //
    //    curStyle = window.getComputedStyle(el, null);
    //    if (window.WebKitCSSMatrix) {
    //        // Some old versions of Webkit choke when 'none' is passed; pass
    //        // empty string instead in this case
    //        transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
    //    }
    //    else {
    //        transformMatrix = curStyle.MozTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    //        matrix = transformMatrix.toString().split(',');
    //    }
    //
    //    if (axis === 'x') {
    //        //Latest Chrome and webkits Fix
    //        if (window.WebKitCSSMatrix)
    //            curTransform = transformMatrix.m41;
    //        //Crazy IE10 Matrix
    //        else if (matrix.length === 16)
    //            curTransform = parseFloat(matrix[12]);
    //        //Normal Browsers
    //        else
    //            curTransform = parseFloat(matrix[4]);
    //    }
    //    if (axis === 'y') {
    //        //Latest Chrome and webkits Fix
    //        if (window.WebKitCSSMatrix)
    //            curTransform = transformMatrix.m42;
    //        //Crazy IE10 Matrix
    //        else if (matrix.length === 16)
    //            curTransform = parseFloat(matrix[13]);
    //        //Normal Browsers
    //        else
    //            curTransform = parseFloat(matrix[5]);
    //    }
    //
    //    return curTransform || 0;
    //};
    /* jshint ignore:start */
    //$.requestAnimationFrame = function (callback) {
    //    if (requestAnimationFrame) return requestAnimationFrame(callback);
    //    else if (webkitRequestAnimationFrame) return webkitRequestAnimationFrame(callback);
    //    else if (mozRequestAnimationFrame) return mozRequestAnimationFrame(callback);
    //    else {
    //        return setTimeout(callback, 1000 / 60);
    //    }
    //};
    //$.cancelAnimationFrame = function (id) {
    //    if (cancelAnimationFrame) return cancelAnimationFrame(id);
    //    else if (webkitCancelAnimationFrame) return webkitCancelAnimationFrame(id);
    //    else if (mozCancelAnimationFrame) return mozCancelAnimationFrame(id);
    //    else {
    //        return clearTimeout(id);
    //    }
    //};
    /* jshint ignore:end */

    //$.fn.dataset = function() {
    //    var dataset = {},
    //        ds = this[0].dataset;
    //    for (var key in ds) { // jshint ignore:line
    //        var item = (dataset[key] = ds[key]);
    //        if (item === 'false') dataset[key] = false;
    //        else if (item === 'true') dataset[key] = true;
    //        else if (parseFloat(item) === item * 1) dataset[key] = item * 1;
    //    }
    //    // mixin dataset and __eleData
    //    return $.extend({}, dataset, this[0].__eleData);
    //};
    //$.fn.data = function(key, value) {
    //    var tmpData = $(this).dataset();
    //    if (!key) {
    //        return tmpData;
    //    }
    //    // value may be 0, false, null
    //    if (typeof value === 'undefined') {
    //        // Get value
    //        var dataVal = tmpData[key],
    //            __eD = this[0].__eleData;
    //
    //        //if (dataVal !== undefined) {
    //        if (__eD && (key in __eD)) {
    //            return __eD[key];
    //        } else {
    //            return dataVal;
    //        }
    //
    //    } else {
    //        // Set value,uniformly set in extra ```__eleData```
    //        for (var i = 0; i < this.length; i++) {
    //            var el = this[i];
    //            // delete multiple data in dataset
    //            if (key in tmpData) delete el.dataset[key];
    //
    //            if (!el.__eleData) el.__eleData = {};
    //            el.__eleData[key] = value;
    //        }
    //        return this;
    //    }
    //};
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }
    $.fn.animationEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };
    $.fn.prevAll = function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return $(prevEls);
    };
    $.fn.nextAll = function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return $(nextEls);
    };

})(window.jQuery);

;(function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
            (ipod || iphone) &&
            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }

    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // keng..
    device.isWeixin = /MicroMessenger/i.test(ua);

    $.device = device;
})(window.jQuery);
+ function($) {
    'use strict';
    $.initPullToRefresh = function(pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var isTouched, isMoved, touchesStart = {},
            isScrolling, touchesDiff, touchStartTime, container, refresh = false,
            useTranslate = false,
            startTranslate = 0,
            translate, scrollTop, wasScrolled, triggerDistance, dynamicTriggerDistance;

        container = eventsTarget;

        // Define trigger distance
        if (container.attr('data-ptr-distance')) {
            dynamicTriggerDistance = true;
        } else {
            triggerDistance = 44;
        }

        function handleTouchStart(e) {
            e = e.originalEvent || e;
            if (isTouched) {
                if ($.device.android) {
                    if ('targetTouches' in e && e.targetTouches.length > 1) return;
                } else return;
            }
            container.trigger('refreshStart');
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;
            wasScrolled = undefined;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();
            /*jshint validthis:true */
            container = $(this);
        }

        function handleTouchMove(e) {
            e = e.originalEvent || e;
            if (!isTouched) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (!isScrolling) {
                isTouched = false;
                return;
            }

            scrollTop = container[0].scrollTop;
            if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true;

            if (!isMoved) {
                /*jshint validthis:true */
                container.removeClass('transitioning');
                if (scrollTop > container[0].offsetHeight) {
                    isTouched = false;
                    return;
                }
                if (dynamicTriggerDistance) {
                    triggerDistance = container.attr('data-ptr-distance');
                    if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
                }
                startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
                useTranslate = true;
            }
            isMoved = true;
            touchesDiff = pageY - touchesStart.y;

            if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
                // iOS 8 fix
                if ($.device.ios && parseInt($.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

                if (useTranslate) {
                    e.preventDefault();
                    translate = (Math.pow(touchesDiff, 0.85) + startTranslate);
                    container.transform('translate3d(0,' + translate + 'px,0)');
                } else {}
                if ((useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance) || (!useTranslate && touchesDiff >= triggerDistance * 2)) {
                    refresh = true;
                    container.addClass('pull-up').removeClass('pull-down');
                } else {
                    refresh = false;
                    container.removeClass('pull-up').addClass('pull-down');
                }
            } else {

                container.removeClass('pull-up pull-down');
                refresh = false;
                return;
            }
        }

        function handleTouchEnd() {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            if (translate) {
                container.addClass('transitioning');
                translate = 0;
            }
            container.transform('');
            if (refresh) {
                //防止二次触发
                if(container.hasClass('refreshing')) return;
                container.addClass('refreshing');
                container.trigger('refresh');
            } else {
                container.removeClass('pull-down');
            }
            isTouched = false;
            isMoved = false;
        }

        // Attach Events
        eventsTarget.on($.touchEvents.start, handleTouchStart);
        eventsTarget.on($.touchEvents.move, handleTouchMove);
        eventsTarget.on($.touchEvents.end, handleTouchEnd);


        function destroyPullToRefresh() {
            eventsTarget.off($.touchEvents.start, handleTouchStart);
            eventsTarget.off($.touchEvents.move, handleTouchMove);
            eventsTarget.off($.touchEvents.end, handleTouchEnd);
        }
        eventsTarget[0].destroyPullToRefresh = destroyPullToRefresh;

    };
    $.pullToRefreshDone = function(container) {
        $(window).scrollTop(0);//解决微信下拉刷新顶部消失的问题
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        container.removeClass('refreshing').addClass('transitioning');
        container.transitionEnd(function() {
            container.removeClass('transitioning pull-up pull-down');
        });
    };
    $.pullToRefreshTrigger = function(container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('transitioning refreshing');
        container.trigger('refresh');
    };

    $.destroyPullToRefresh = function(pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].destroyPullToRefresh) pullToRefreshContent[0].destroyPullToRefresh();
    };

    //这里是否需要写到 scroller 中去？
/*    $.initPullToRefresh = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.initPullToRefresh(item);
            } else {
                initPullToRefresh(item);
            }
        });
    };


    $.pullToRefreshDone = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.pullToRefreshDone(item);
            } else {
                pullToRefreshDone(item);
            }
        });
    };


    $.pullToRefreshTrigger = function(pageContainer) {
       var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.pullToRefreshTrigger(item);
            } else {
                pullToRefreshTrigger(item);
            }
        });
    };

    $.destroyPullToRefresh = function(pageContainer) {
        var $pageContainer = $(pageContainer);
        $pageContainer.each(function(index, item) {
            if ($.detectScrollerType(item) === 'js') {
                $._pullToRefreshJSScroll.destroyPullToRefresh(item);
            } else {
                destroyPullToRefresh(item);
            }
        });
    };
*/

}(window.jQuery); //jshint ignore:line








