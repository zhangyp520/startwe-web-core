(function(win){
    /* *
 * 全局空间 Vcity
 * */
    var Vcity = win.Vcity || {};
    win.Vcity = Vcity;
    /* *
     * 静态方法集
     * @name _m
     * */
    Vcity._m = {
        /* 选择元素 */
        $:function (arg, context) {
            var tagAll, n, eles = [], i, sub = arg.substring(1);
            context = context || document;
            if (typeof arg == 'string') {
                switch (arg.charAt(0)) {
                    case '#':
                        return document.getElementById(sub);
                        break;
                    case '.':
                        if (context.getElementsByClassName) return context.getElementsByClassName(sub);
                        tagAll = Vcity._m.$('*', context);
                        n = tagAll.length;
                        for (i = 0; i < n; i++) {
                            if (tagAll[i].className.indexOf(sub) > -1) eles.push(tagAll[i]);
                        }
                        return eles;
                        break;
                    default:
                        return context.getElementsByTagName(arg);
                        break;
                }
            }
        },

        /* 绑定事件 */
        on:function (node, type, handler) {
            node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
        },

        /* 获取事件 */
        getEvent:function(event){
            return event || window.event;
        },

        /* 获取事件目标 */
        getTarget:function(event){
            return event.target || event.srcElement;
        },

        /* 获取元素位置 */
        getPos:function (node) {
            var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollt = document.documentElement.scrollTop || document.body.scrollTop;
            var pos = node.getBoundingClientRect();
            return {top:pos.top + scrollt, right:pos.right + scrollx, bottom:pos.bottom + scrollt, left:pos.left + scrollx, width:pos.width}
        },

        /* 添加样式名 */
        addClass:function (c, node) {
            if(!node)return;
            node.className = Vcity._m.hasClass(c,node) ? node.className : node.className + ' ' + c ;
        },

        /* 移除样式名 */
        removeClass:function (c, node) {
            var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
            if(!Vcity._m.hasClass(c,node))return;
            node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
        },

        /* 是否含有CLASS */
        hasClass:function (c, node) {
            if(!node || !node.className)return false;
            return node.className.indexOf(c)>-1;
        },

        /* 阻止冒泡 */
        stopPropagation:function (event) {
            event = event || window.event;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        },
        /* 去除两端空格 */
        trim:function (str) {
            return str.replace(/^\s+|\s+$/g,'');
        }
    };

    /* *
     * 格式化城市数组为对象oCity，按照a-h,i-p,q-z,hot热门城市分组：
     * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{i:[1.2.3],j:[1,2,3]},QRSTUVWXYZ:{}}
     * */
    (function () {
        var citys = Vcity.allCity,
            hotCitys = Vcity.hotCity,
            match,
            letter,
            regEx = Vcity.regEx,
            reg2 = /^[a-b]$/i,
            reg3 = /^[c-d]$/i,
            reg4 = /^[e-g]$/i,
            reg5 = /^[h]$/i,
            reg6 = /^[j]$/i,
            reg7 = /^[k-l]$/i,
            reg8 =  /^[m-p]$/i,
            reg9 =  /^[q-r]$/i,
            reg10 =  /^[s]$/i,
            reg11 =  /^[t]$/i,
            reg12 =  /^[w]$/i,
            reg13 =  /^[x]$/i,
            reg14 =  /^[y]$/i,
            reg15 =  /^[z]$/i;
        if (!Vcity.oCity) {
            Vcity.oCity = {hot:{},AB:{},CD:{},EFG:{},H:{},J:{},KL:{},MNP:{},QR:{},S:{},T:{},W:{},X:{},Y:{},Z:{}};
            //console.log(citys.length);
            var i,n;
            for (i = 0, n = citys.length; i < n; i++) {
                match = regEx.exec(citys[i]);
                letter = match[3].toUpperCase();
                if (reg2.test(letter)) {
                    if (!Vcity.oCity.AB[letter]) Vcity.oCity.AB[letter] = [];
                    Vcity.oCity.AB[letter].push(match[1]);
                } else if (reg3.test(letter)) {
                    if (!Vcity.oCity.CD[letter]) Vcity.oCity.CD[letter] = [];
                    Vcity.oCity.CD[letter].push(match[1]);
                } else if (reg4.test(letter)) {
                    if (!Vcity.oCity.EFG[letter]) Vcity.oCity.EFG[letter] = [];
                    Vcity.oCity.EFG[letter].push(match[1]);
                }else if (reg5.test(letter)) {
                    if (!Vcity.oCity.H[letter]) Vcity.oCity.H[letter] = [];
                    Vcity.oCity.H[letter].push(match[1]);
                }else if (reg6.test(letter)) {
                    if (!Vcity.oCity.J[letter]) Vcity.oCity.J[letter] = [];
                    Vcity.oCity.J[letter].push(match[1]);
                }else if (reg7.test(letter)) {
                    if (!Vcity.oCity.KL[letter]) Vcity.oCity.KL[letter] = [];
                    Vcity.oCity.KL[letter].push(match[1]);
                }else if (reg8.test(letter)) {
                    if (!Vcity.oCity.MNP[letter]) Vcity.oCity.MNP[letter] = [];
                    Vcity.oCity.MNP[letter].push(match[1]);
                }else if (reg9.test(letter)) {
                    if (!Vcity.oCity.QR[letter]) Vcity.oCity.QR[letter] = [];
                    Vcity.oCity.QR[letter].push(match[1]);
                }else if (reg10.test(letter)) {
                    if (!Vcity.oCity.S[letter]) Vcity.oCity.S[letter] = [];
                    Vcity.oCity.S[letter].push(match[1]);
                }else if (reg11.test(letter)) {
                    if (!Vcity.oCity.T[letter]) Vcity.oCity.T[letter] = [];
                    Vcity.oCity.T[letter].push(match[1]);
                }else if (reg12.test(letter)) {
                    if (!Vcity.oCity.W[letter]) Vcity.oCity.W[letter] = [];
                    Vcity.oCity.W[letter].push(match[1]);
                }else if (reg13.test(letter)) {
                    if (!Vcity.oCity.X[letter]) Vcity.oCity.X[letter] = [];
                    Vcity.oCity.X[letter].push(match[1]);
                }else if (reg14.test(letter)) {
                    if (!Vcity.oCity.Y[letter]) Vcity.oCity.Y[letter] = [];
                    Vcity.oCity.Y[letter].push(match[1]);
                }else if (reg15.test(letter)) {
                    if (!Vcity.oCity.Z[letter]) Vcity.oCity.Z[letter] = [];
                    Vcity.oCity.Z[letter].push(match[1]);
                }
            }

            /* 热门城市*/
            for (i = 0, n = hotCitys.length; i < n; i++) {
                match = regEx.exec(hotCitys[i]);
                //letter = match[3].toUpperCase();
                if(!Vcity.oCity.hot['hot']) Vcity.oCity.hot['hot'] = [];
                Vcity.oCity.hot['hot'].push(match[1]);
            }

        }
    })();


    /* 城市HTML模板 */
    Vcity._template = [
        '<p class="tip">直接输入可搜索城市(支持汉字/拼音)</p>',
        '<ul>',
        '<li class="on">热门城市</li>',
        '<li>AB</li>',
        '<li>CD</li>',
        '<li>EFG</li>',
        '<li>H</li>',
        '<li>J</li>',
        '<li>KL</li>',
        '<li>MNP</li>',
        '<li>QR</li>',
        '<li>S</li>',
        '<li>T</li>',
        '<li>W</li>',
        '<li>X</li>',
        '<li>Y</li>',
        '<li>Z</li>',
        '</ul>'
    ];

    /* *
     * 城市控件构造函数
     * @CitySelector
     * */

    Vcity.CitySelector = function () {
        this.initialize.apply(this, arguments);
    };

    Vcity.CitySelector.prototype = {

        constructor:Vcity.CitySelector,

        /* 初始化 */

        initialize :function (options) {
            var input = options.input;
            if(typeof input === "string"){
                this.input = Vcity._m.$('#'+ input);
            } else {
                this.input = input;
            }
            this.choose = options.choose || function(){};
            this.inputEvent();
        },

        /* *


        /* *
         * @createWarp
         * 创建城市BOX HTML 框架
         * */

        createWarp:function(){
            var div = this.rootDiv = document.createElement('div');
            var that = this;

            // 设置DIV阻止冒泡
            Vcity._m.on(this.rootDiv,'click',function(event){
                Vcity._m.stopPropagation(event);
            });

            // 设置点击文档隐藏弹出的城市选择框
            Vcity._m.on(document, 'click', function (event) {
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                if(target == that.input) return false;
                //console.log(target.className);
                if (that.cityBox)Vcity._m.addClass('hide', that.cityBox);
                if (that.ul)Vcity._m.addClass('hide', that.ul);
                if(that.myIframe)Vcity._m.addClass('hide',that.myIframe);
            });
            div.className = 'citySelector';
            div.style.position = 'absolute';

            var inputPos = Vcity._m.getPos(this.input);
            if (inputPos.left + 390 > window.innerWidth) {
                div.style.left = 'none';
                div.style.right = (window.innerWidth - inputPos.left - inputPos.width) + 'px';
            } else {
                div.style.right = 'none';
                div.style.left = inputPos.left + 'px';
            }

            div.style.top = inputPos.bottom + 5 + 'px';
            div.style.zIndex = 999999;

            // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
            var isIe = (document.all) ? true : false;
            var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
            if(isIE6){
                var myIframe = this.myIframe =  document.createElement('iframe');
                myIframe.frameborder = '0';
                myIframe.src = 'about:blank';
                myIframe.style.position = 'absolute';
                myIframe.style.zIndex = '-1';
                this.rootDiv.appendChild(this.myIframe);
            }

            var childdiv = this.cityBox = document.createElement('div');
            childdiv.className = 'cityBox';
            childdiv.id = 'cityBox';
            childdiv.innerHTML = Vcity._template.join('');
            var hotCity = this.hotCity =  document.createElement('div');
            hotCity.className = 'hotCity';
            childdiv.appendChild(hotCity);
            div.appendChild(childdiv);
            this.createHotCity();
        },

        /* *
         * @createHotCity
         * TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
         * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
         **/

        createHotCity:function(){
            var odiv,odl,odt,odd,odda=[],str,key,ckey,sortKey,regEx = Vcity.regEx,
                oCity = Vcity.oCity;
            for(key in oCity){
                odiv = this[key] = document.createElement('div');
                // 先设置全部隐藏hide
                odiv.className = key + ' ' + 'cityTab hide';
                sortKey=[];
                for(ckey in oCity[key]){
                    sortKey.push(ckey);
                    // ckey按照ABCDEDG顺序排序
                    sortKey.sort();
                }
                for(var j=0,k = sortKey.length;j<k;j++){
                    odl = document.createElement('dl');
                    odt = document.createElement('dt');
                    odd = document.createElement('dd');
                    odt.innerHTML = sortKey[j] == 'hot'?'&nbsp;':sortKey[j];
                    odda = [];
                    for(var i=0,n=oCity[key][sortKey[j]].length;i<n;i++){
                        str = '<a>' + oCity[key][sortKey[j]][i] + '</a>';
                        odda.push(str);
                    }
                    odd.innerHTML = odda.join('');
                    odl.appendChild(odt);
                    odl.appendChild(odd);
                    odiv.appendChild(odl);
                }

                // 移除热门城市的隐藏CSS
                Vcity._m.removeClass('hide',this.hot);
                this.hotCity.appendChild(odiv);
            }
            document.body.appendChild(this.rootDiv);
            /* IE6 */
            this.changeIframe();

            this.tabChange();
            this.linkEvent();
        },

        /* *
         *  tab按字母顺序切换
         *  @ tabChange
         * */

        tabChange:function(){
            var lis = Vcity._m.$('li',this.cityBox);
            var divs = Vcity._m.$('div',this.hotCity);
            var that = this;
            for(var i=0,n=lis.length;i<n;i++){
                lis[i].index = i;
                lis[i].onclick = function(){
                    for(var j=0;j<n;j++){
                        Vcity._m.removeClass('on',lis[j]);
                        Vcity._m.addClass('hide',divs[j]);
                    }
                    Vcity._m.addClass('on',this);
                    Vcity._m.removeClass('hide',divs[this.index]);
                    /* IE6 改变TAB的时候 改变Iframe 大小*/
                    that.changeIframe();
                };
            }
        },

        /* *
         * 城市LINK事件
         *  @linkEvent
         * */

        linkEvent:function(){
            var links = Vcity._m.$('a',this.hotCity);
            var that = this;
            for(var i=0,n=links.length;i<n;i++){
                links[i].onclick = function(){
                    var value = this.innerHTML;
                    that.input.value = value;
                    that.choose(value);
                    Vcity._m.addClass('hide',that.cityBox);
                    /* 点击城市名的时候隐藏myIframe */
                    Vcity._m.addClass('hide',that.myIframe);
                }
            }
        },

        /* *
         * INPUT城市输入框事件
         * @inputEvent
         * */

        inputEvent:function(){
            var that = this;
            Vcity._m.on(this.input,'click',function(event){
                event = event || window.event;
                if(!that.cityBox){
                    that.createWarp();
                }else if(!!that.cityBox && Vcity._m.hasClass('hide',that.cityBox)){
                    // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                    if(!that.ul || (that.ul && Vcity._m.hasClass('hide',that.ul))){
                        var inputPos = Vcity._m.getPos(that.input);
                        if (inputPos.left + 390 > window.innerWidth) {
                            that.rootDiv.style.left = '';
                            that.rootDiv.style.right = (window.innerWidth - inputPos.left - inputPos.width) + 'px';
                        } else {
                            that.rootDiv.style.right = '';
                            that.rootDiv.style.left = inputPos.left + 'px';
                        }
                        Vcity._m.removeClass('hide',that.cityBox);

                        /* IE6 移除iframe 的hide 样式 */
                        //alert('click');
                        Vcity._m.removeClass('hide',that.myIframe);
                        that.changeIframe();
                    }
                }
            });
            // Vcity._m.on(this.input,'focus',function(){
            //     that.input.select();
            //     if(that.input.value == '城市名') that.input.value = '';
            // });
            Vcity._m.on(this.input,'blur',function(){
                // if(that.input.value == '') that.input.value = '城市名';

                var value = Vcity._m.trim(that.input.value);
                if(value != ''){
                    var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
                    var flag=0;
                    for (var i = 0, n = Vcity.allCity.length; i < n; i++) {
                        if (reg.test(Vcity.allCity[i])) {
                            flag++;
                        }
                    }
                    if(flag==0){
                        that.input.value= '';
                        that.choose('');
                    }else{
                        if(that.ul){
                            var lis = Vcity._m.$('li',that.ul);
                            if(typeof lis == 'object' && lis['length'] > 0){
                                var li = lis[0];
                                var bs = li.children;
                                if(bs && bs['length'] > 1){
                                    that.input.value = bs[0].innerHTML;
                                    that.choose(bs[0].innerHTML);
                                }
                            }else{
                                that.input.value = '';
                                that.choose('');
                            }
                        }
                    }
                }

            });
            Vcity._m.on(this.input,'keyup',function(event){
                event = event || window.event;
                var keycode = event.keyCode;
                Vcity._m.addClass('hide',that.cityBox);
                that.createUl();

                /* 移除iframe 的hide 样式 */
                Vcity._m.removeClass('hide',that.myIframe);

                // 下拉菜单显示的时候捕捉按键事件
                if(that.ul && !Vcity._m.hasClass('hide',that.ul) && !that.isEmpty){
                    that.KeyboardEvent(event,keycode);
                }
            });
        },

        /* *
         * 生成下拉选择列表
         * @ createUl
         * */

        createUl:function () {
            //console.log('createUL');
            var str;
            var value = Vcity._m.trim(this.input.value);
            // 当value不等于空的时候执行
            if (value !== '') {
                var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
                // 此处需设置中文输入法也可用onpropertychange
                var searchResult = [];
                for (var i = 0, n = Vcity.allCity.length; i < n; i++) {
                    if (reg.test(Vcity.allCity[i])) {
                        var match = Vcity.regEx.exec(Vcity.allCity[i]);
                        if (searchResult.length !== 0) {
                            str = '<li><b class="cityname">' + match[1] + '</b><b class="cityspell">' + match[2] + '</b></li>';
                        } else {
                            str = '<li class="on"><b class="cityname">' + match[1] + '</b><b class="cityspell">' + match[2] + '</b></li>';
                        }
                        searchResult.push(str);
                    }
                }
                this.isEmpty = false;
                // 如果搜索数据为空
                if (searchResult.length == 0) {
                    this.isEmpty = true;
                    str = '<li class="empty">对不起，没有找到 "<em>' + value + '</em>"</li>';
                    searchResult.push(str);
                }
                // 如果slideul不存在则添加ul
                if (!this.ul) {
                    var ul = this.ul = document.createElement('ul');
                    ul.className = 'cityslide mCustomScrollbar';
                    this.rootDiv && this.rootDiv.appendChild(ul);
                    // 记录按键次数，方向键
                    this.count = 0;
                } else if (this.ul && Vcity._m.hasClass('hide', this.ul)) {
                    this.count = 0;
                    Vcity._m.removeClass('hide', this.ul);
                }
                this.ul.innerHTML = searchResult.join('');

                /* IE6 */
                this.changeIframe();

                // 绑定Li事件
                this.liEvent();
            }else{
                Vcity._m.addClass('hide',this.ul);
                Vcity._m.removeClass('hide',this.cityBox);

                Vcity._m.removeClass('hide',this.myIframe);

                this.changeIframe();
            }
        },

        /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
        changeIframe:function(){
            if(!this.isIE6)return;
            this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
            this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
        },

        /* *
         * 特定键盘事件，上、下、Enter键
         * @ KeyboardEvent
         * */

        KeyboardEvent:function(event,keycode){
            var lis = Vcity._m.$('li',this.ul);
            var len = lis.length;
            switch(keycode){
                case 40: //向下箭头↓
                    this.count++;
                    if(this.count > len-1) this.count = 0;
                    for(var i=0;i<len;i++){
                        Vcity._m.removeClass('on',lis[i]);
                    }
                    Vcity._m.addClass('on',lis[this.count]);
                    break;
                case 38: //向上箭头↑
                    this.count--;
                    if(this.count<0) this.count = len-1;
                    for(i=0;i<len;i++){
                        Vcity._m.removeClass('on',lis[i]);
                    }
                    Vcity._m.addClass('on',lis[this.count]);
                    break;
                case 13: // enter键
                    var value = Vcity.regExChiese.exec(lis[this.count].innerHTML)[0];
                    this.input.value = value;
                    this.choose(value);
                    Vcity._m.addClass('hide',this.ul);
                    Vcity._m.addClass('hide',this.ul);
                    /* IE6 */
                    Vcity._m.addClass('hide',this.myIframe);
                    break;
                default:
                    break;
            }
        },

        /* *
         * 下拉列表的li事件
         * @ liEvent
         * */

        liEvent:function(){
            var that = this;
            var lis = Vcity._m.$('li',this.ul);
            for(var i = 0,n = lis.length;i < n;i++){
                Vcity._m.on(lis[i],'click',function(event){
                    event = Vcity._m.getEvent(event);
                    var target = Vcity._m.getTarget(event);
                    var value = Vcity.regExChiese.exec(target.innerHTML)[0];
                    that.input.value = value;
                    that.choose(value);
                    Vcity._m.addClass('hide',that.ul);
                    /* IE6 下拉菜单点击事件 */
                    Vcity._m.addClass('hide',that.myIframe);
                });
                Vcity._m.on(lis[i],'mouseover',function(event){
                    event = Vcity._m.getEvent(event);
                    var target = Vcity._m.getTarget(event);
                    Vcity._m.addClass('on',target);
                });
                Vcity._m.on(lis[i],'mouseout',function(event){
                    event = Vcity._m.getEvent(event);
                    var target = Vcity._m.getTarget(event);
                    Vcity._m.removeClass('on',target);
                })
            }
        }
    };
})(window);

