/**
 * Author: Sergey Bondarenko (BR0kEN)
 * E-mail: broken@propeople.com.ua
 * Github: https://github.com/BR0kEN-/jTap
 * Updated: June 2, 2014
 * Version: 0.2.9
 */
(function ($, _) {
    'use strict';

    /**
     * @param (object) ev - extending object, which contain event properties.
     *  - (string) start - start event depending of @isTap.
     *  - (string) end - start event depending of @isTap.
     */
    var ev = {
        start: 'touchstart',
        end: 'touchend'
    };

    $.event.special[_] = {
        setup: function () {
            $(this).off('click').on(ev.start + ' ' + ev.end, function (e) {
                /**
                 * Adding jQuery event to @ev object depending of @isTap.
                 *
                 * Attention: value of this property will change two time
                 * per event: first time - on start, second - on end.
                 */
                ev.E = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
            }).on(ev.start, function (e) {
                /**
                 * Function stop if event is simulate by mouse.
                 */
                if (e.which && e.which !== 1) {
                    return;
                }

                /**
                 * Extend @ev object from event properties of initial phase.
                 */
                ev.target = e.target;
                ev.time = new Date().getTime();
                ev.X = ev.E.pageX;
                ev.Y = ev.E.pageY;
            }).on(ev.end, function (e) {
                /**
                 * Compare property values of initial phase with properties
                 * of this, final, phase. Execute event if values will be
                 * within the acceptable and set new properties for event.
                 */
                //ev.X === ev.E.pageX && ev.Y === ev.E.pageY
                if (
                    ev.target === e.target &&
                    ((new Date().getTime() - ev.time) < 750) &&
                    (Math.abs(ev.X - ev.E.pageX) <= 5 && Math.abs(ev.Y - ev.E.pageY) <= 5 )
                ) {

                    e.type = _;
                    e.pageX = ev.E.pageX;
                    e.pageY = ev.E.pageY;
                    $.event.dispatch.call(this, e);
                }
            });
        },

        /**
         * Disassembling event.
         */
        remove: function () {
            $(this).off(ev.start + ' ' + ev.end);
        }
    };

    $.fn[_] = function (fn) {
        return this[fn ? 'on' : 'trigger'](_, fn);
    };

    /**
     * 给 ontap 元素 绑定一个 事件
     */
    $(document).on('tap', '[onTap]', function (e) {
        //var cfg = {el: this, e: e, isCurrentDom: e.target != this};
        //console.log(sourceFun);
        //阻止事件冒泡，以及判断事件的作用对象如果不是当前元素也就直接return
        //if (e.target != this) return false;

        e = e.originalEvent || e;
        e.stopPropagation();

        var aTarget = document.activeElement;
        if (aTarget && aTarget != e.target) {
            $(aTarget).blur();
        }

        var sourceFun = $(this).attr('onTap');
        if (sourceFun.length > 0) {
            try {
                return eval(sourceFun);
            } catch (e) {
                //oui.log("tap事件:" + sourceFun + "不能被执行,");
                //oui.log(e);
                console.log("tap事件:" + sourceFun + "不能被执行,");
                console.log(e);
                return false;
            }
        }
    });
})(jQuery, 'tap');

///**
// * Author: Sergey Bondarenko (BR0kEN)
// * E-mail: broken@propeople.com.ua
// * Github: https://github.com/BR0kEN-/jTap
// * Updated: June 2, 2014
// * Version: 0.2.9
// */
//(function ($, _) {
//    'use strict';
//
//    /**
//     * @param (object) ev - extending object, which contain event properties.
//     *  - (string) start - start event depending of @isTap.
//     *  - (string) end - start event depending of @isTap.
//     */
//    var ev = {
//        start: 'touchstart',
//        end: 'touchend'
//    };
//
//    $.event.special[_] = {
//        setup: function () {
//            $(this).off('click').on(ev.start + ' ' + ev.end, function (e) {
//                /**
//                 * Adding jQuery event to @ev object depending of @isTap.
//                 *
//                 * Attention: value of this property will change two time
//                 * per event: first time - on start, second - on end.
//                 */
//                ev.E = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
//            }).on(ev.start, function (e) {
//                /**
//                 * Function stop if event is simulate by mouse.
//                 */
//                if (e.which && e.which !== 1) {
//                    return;
//                }
//
//                /**
//                 * Extend @ev object from event properties of initial phase.
//                 */
//                ev.target = e.target;
//                ev.time = new Date().getTime();
//                ev.X = ev.E.pageX;
//                ev.Y = ev.E.pageY;
//            }).on(ev.end, function (e) {
//                /**
//                 * Compare property values of initial phase with properties
//                 * of this, final, phase. Execute event if values will be
//                 * within the acceptable and set new properties for event.
//                 */
//                //ev.X === ev.E.pageX && ev.Y === ev.E.pageY
//                if (
//                    ev.target === e.target &&
//                    ((new Date().getTime() - ev.time) > 750) &&
//                    (Math.abs(ev.X - ev.E.pageX) <= 5 && Math.abs(ev.Y - ev.E.pageY) <= 5 )
//                ) {
//
//                    e.type = _;
//                    e.pageX = ev.E.pageX;
//                    e.pageY = ev.E.pageY;
//                    $.event.dispatch.call(this, e);
//                }
//            });
//        },
//
//        /**
//         * Disassembling event.
//         */
//        remove: function () {
//            $(this).off(ev.start + ' ' + ev.end);
//        }
//    };
//
//    $.fn[_] = function (fn) {
//        return this[fn ? 'on' : 'trigger'](_, fn);
//    };
//
//    /**
//     * 给 ontap 元素 绑定一个 事件
//     */
//    $(document).on('tap', '[onLongTap]', function (e) {
//        //var cfg = {el: this, e: e, isCurrentDom: e.target != this};
//        //console.log(sourceFun);
//        //阻止事件冒泡，以及判断事件的作用对象如果不是当前元素也就直接return
//        //if (e.target != this) return false;
//
//        e = e.originalEvent || e;
//        e.stopPropagation();
//
//        var aTarget = document.activeElement;
//        if (aTarget && aTarget != e.target) {
//            $(aTarget).blur();
//        }
//
//        var sourceFun = $(this).attr('onTap');
//        if (sourceFun.length > 0) {
//            try {
//                return eval(sourceFun);
//            } catch (e) {
//                //oui.log("tap事件:" + sourceFun + "不能被执行,");
//                //oui.log(e);
//                console.log("tap事件:" + sourceFun + "不能被执行,");
//                console.log(e);
//                return false;
//            }
//        }
//    });
//})(jQuery, 'longTap');








