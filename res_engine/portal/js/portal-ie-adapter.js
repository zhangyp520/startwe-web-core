(function() {

    classList();
    
})()


/**
 * @name classList
 * @class 给不支持classList的浏览器（ie9以及以下等）的元素添加classList属性
 */
function classList() {
    if (!("classList" in document.documentElement)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);
    
                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }
    
                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),
    
                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),
    
                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),
    
                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },
    
                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }
}


/**
 * @name closest
 * @class 对于不支持原生element.closest()的浏览器，可使用element.matches()
 * @param {String} el 当前元素
 * @param {String} selector 向上查找的元素
 */
function closest(el, selector) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}


/**
 * @name placeHolder
 * @class 跨浏览器placeHolder,对于不支持原生placeHolder的浏览器，通过value或插入span元素两种方案模拟
 * @param {Object} obj 要应用placeHolder的表单元素对象
 * @param {Boolean} span 是否采用悬浮的span元素方式来模拟placeHolder，默认值false,默认使用value方式模拟
 */
function placeHolder(obj, span) {
    if (!obj.getAttribute('placeholder')) return;
    var imitateMode = span === true ? true: false;
    var supportPlaceholder = 'placeholder' in document.createElement('input');
    if (!supportPlaceholder) {
        var defaultValue = obj.getAttribute('placeholder');
        if (!imitateMode) {
            obj.onfocus = function() { (obj.value == defaultValue) && (obj.value = '');
                obj.style.color = '';
            }
            obj.onblur = function() {
                if (obj.value == defaultValue) {
                    obj.style.color = '';
                } else if (obj.value == '') {
                    obj.value = defaultValue;
                    obj.style.color = '#ACA899';
                }
            }
            obj.onblur();
        } else {
            var placeHolderCont = document.createTextNode(defaultValue);
            var oWrapper = document.createElement('span');
            oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
            oWrapper.className = 'wrap-placeholder';
            oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
            oWrapper.style.fontSize = getStyle(obj, 'fontSize');
            oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px': 3 + 'px';
            oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop')) ? getStyle(obj, 'marginTop') : 1 + 'px';
            oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
            oWrapper.style.width = obj.offsetWidth - parseInt(getStyle(obj, 'marginLeft')) + 'px';
            oWrapper.style.height = obj.offsetHeight + 'px';
            oWrapper.style.lineHeight = obj.nodeName.toLowerCase() == 'textarea' ? '': obj.offsetHeight + 'px';
            oWrapper.appendChild(placeHolderCont);
            obj.parentNode.insertBefore(oWrapper, obj);
            oWrapper.onclick = function() {
                obj.focus();
            }
            //绑定input或onpropertychange事件
            if (typeof(obj.oninput) == 'object') {
                obj.addEventListener("input", changeHandler, false);
            } else {
                obj.onpropertychange = changeHandler;
            }
            function changeHandler() {
                oWrapper.style.display = obj.value != '' ? 'none': 'inline-block';
            }
            
        }
    }
}

/**
 * @name getStyle
 * @class 获取样式
 * @param {Object} obj 要获取样式的对象
 * @param {String} styleName 要获取的样式名
 */
function getStyle(obj, styleName) {
    var oStyle = null;
    if (obj.currentStyle) oStyle = obj.currentStyle[styleName];
    else if (window.getComputedStyle) oStyle = window.getComputedStyle(obj, null)[styleName];
    return oStyle;
}

