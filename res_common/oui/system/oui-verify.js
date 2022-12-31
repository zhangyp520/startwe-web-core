(function(window,oui,$,template,parseInt,Math,Date,setTimeout){
    oui = window.oui ||oui ||{};
    $ = window.$||window.jQuery;
    template = window.template||template;
    parseInt = window.parseInt || parseInt;
    Math = window.Math || Math;
    Date = window.Date || Date;
    setTimeout = window.setTimeout || setTimeout;
    window.oui= oui;
    /** 显示校验 的html
     * isLogin,
     * container
     * onSuccess(validate)
     *
     * *****/
    /** 极验功能 开始***/
    oui.destroyVerify=function(){

        var obj = oui.getVeriyObject();
        var params = {};
        if(obj && obj.opts && obj.opts.params){
            params = obj.opts.params;
        }
        params.container = params.container || 'body';
        $(params.container).find(".oui-verifyCode-content").remove();
        $(params.container).find(".oui-verifyCode-area").remove();
        oui.setPageParam('_verfify_obj',null);
    };
    /** 获取极验组件对象 *****/
    oui.getVeriyObject = function(){
        var v =  oui.getPageParam('_verfify_obj');
        return v||(function(){
                var obj ={};
                obj.getValidate = function(){
                    return {};
                };
                return  obj;
            })();
    };
    oui.showVerifyHtml = function(params){



        oui.setPageParam("ouiValidateVerify",null);

        var url = oui.getContextPath()+"service/startwe/login/verification/generateVerifyCode";
        //TODO 后端接口调整好后进行替换TODO
        // url = oui.getContextPath()+'res_common/oui/verify-code.json';

        var data = {};
        data.v_u_k_ = params.userId ||'';
        oui.getData(url,data,function(res){
            if(!res.success){
                oui.getTop().oui.alert('滑动验证请求失败，请尝试刷新页面');
                //oui.showVerifyHtml(params);
                return ;
            }
            var msg =res.resultObj;
            msg = oui.parseJson(msg);

            var imgUrl = msg.imgUrl;
            var tpl = ''+
                '<div class="oui-verifyCode-area">'+
                '<div class="oui-verifyCode-shade" onclick="oui.destroyVerify();"></div>'+
                '<div class="oui-verifyCode-fixed">'+
                '<div class="oui-verifyCode-content">'+
                '{{if imgUrl}}'+
                '<div class="oui-verifyCode-img">'+
                '<img src="{{imgUrl}}"/>'+
                '<div class="verifyCode-rect-end"></div>'+
                '<div class="verifyCode-rect-start"></div>'+
                '</div>'+
                '{{/if imgUrl}}'+
                '<div class="oui-verifyCode-slider">'+
                '<style type="text/css">'+
                '.oui-verifyCode-area{'+
                'width: 100%;'+
                'height: 100%;'+
                'position: fixed;'+
                'top: 0;'+
                'left: 0;'+
                'right: 0;'+
                'bottom: 0;'+
                'z-index: 9999;'+
                '}'+
                '.oui-verifyCode-area .oui-verifyCode-shade{'+
                'background: rgba(0,0,0,.5);'+
                'width: 100%;'+
                'height: 100%;'+
                'position: fixed;'+
                'z-index: 1;'+
                '}'+
                '.oui-verifyCode-fixed{'+
                'position: fixed;'+
                'top: 50%;'+
                'left: 50%;'+
                '-webkit-transform: translate(-50%,-50%);'+
                '-moz-transform: translate(-50%,-50%);'+
                '-ms-transform: translate(-50%,-50%);'+
                '-o-transform: translate(-50%,-50%);'+
                'transform: translate(-50%,-50%);'+
                'z-index: 2;'+
                '}'+
                '.oui-verifyCode-content{'+
                'width: 100%;'+
                'min-width: 300px;'+
                'text-align: center;'+
                '-webkit-border-radius: 2px;'+
                '-moz-border-radius: 2px;'+
                'border-radius: 2px;'+
                '}'+
                '.verifyCode-icon{'+
                'background-image: url("{{oui.getContextPath()}}res_common/oui/ui/ui_common/controls/verifycode/images/oui-verifyCode-icon.png");'+
                'background-color: #ffffff;'+
                'border: 1px solid #e6e6e6;'+
                'background-repeat: no-repeat;'+
                '}'+
                '.oui-verifyCode-content .oui-verifyCode-img{'+
                'width: 260px;'+
                'padding: 8px 0;'+
                'margin: 0 auto;'+
                'position: relative;'+
                '}'+
                '.oui-verifyCode-img img{'+
                'width: 100%;'+
                '}'+
                '.oui-verifyCode-img .verifyCode-rect-end,'+
                '.oui-verifyCode-img .verifyCode-rect-start{'+
                'width: 40px;'+
                'height: 40px;'+
                'display: inline-block;'+
                '}'+
                '.oui-verifyCode-img .verifyCode-rect-end{'+
                'background: rgba(0,0,0,.5);'+
                'position: absolute;'+
                'left: 120px;'+
                'top: 40px;'+
                '-webkit-box-shadow:0 0 10px #000 inset;'+
                '-moz-box-shadow:0 0 10px #000 inset;'+
                'box-shadow:0 0 10px #000 inset;'+
                '}'+
                '.oui-verifyCode-img .verifyCode-rect-start{'+
                'background: rgba(255,255,255,.8);'+
                'position: absolute;'+
                'left: 0;'+
                'top: 40px;'+
                '}'+
                '.oui-verifyCode-content .oui-verifyCode-slider{'+
                'display: block;'+
                'padding: 10px 0;'+
                '}'+
                '.oui-verifyCode-slider .verifyCode-slider-info{'+
                'width: 100%;'+
                'position: relative;'+
                '}'+
                '.verifyCode-slider-info .verifyCode-slider-area{'+
                'background: #eef3fa;'+
                'width: 100%;'+
                'height: 40px;'+
                'margin: 0 auto;'+
                'position: relative;'+
                'border-radius: 2px;'+
                'text-align: center;'+
                'overflow: hidden;'+
                'user-select: none;'+
                '-moz-user-select: none;'+
                '-webkit-user-select: none;'+
                '}'+
                ''+
                '.verifyCode-slider-area .slider-bg {'+
                'background-color: #b2cbe9;'+
                'border: 1px solid #2C82FC;'+
                'border-right: 0;'+
                'border-top-left-radius: 2px;'+
                'border-bottom-left-radius: 2px;'+
                'position: absolute;'+
                'left:0 ;'+
                'top: 0;'+
                'height: 100%;'+
                'z-index: 1;'+
                '}'+
                ''+
                '.verifyCode-slider-info .slider-warp {'+
                'background-position: 0 -40px;'+
                'background-color: #2C82FC;'+
                'border-color: #2C82FC;'+
                'width: 40px;'+
                'height: 40px;'+
                'position: absolute;'+
                'left: 0;'+
                'top: 50%;'+
                'margin-top: -20px;'+
                'border-radius: 2px;'+
                'z-index: 3;'+
                'cursor: pointer;'+
                'font-size: 16px;'+
                'font-weight: 900;'+
                'box-shadow: 0 0 3px rgba(0,0,0,.3);'+
                '}'+
                '.verifyCode-slider-info .slider-warp:hover{'+
                'background-color: #4878c5;'+
                '}'+
                '.verifyCode-slider-info .slider-warp:active{'+
                'border-top-left-radius: 0;'+
                'border-bottom-left-radius: 0;'+
                '}'+
                '.verifyCode-slider-info .slider-warp.slider-warp-error{'+
                'background-position: 0 0;'+
                'background-color: #e17366;'+
                'border-color: #e17366'+
                '}'+
                ''+
                '.labelTip {'+
                'position: absolute;'+
                'left: 0;'+
                'width: 100%;'+
                'height: 100%;'+
                'font-size: 13px;'+
                'color: #2C82FC;'+
                'line-height: 40px;'+
                'text-align: center;'+
                'z-index: 2;'+
                '}'+
                '.labelTip.loadingTip{'+
                'background: #eef3fa;'+
                'color: #2C82FC;'+
                '}'+
                '.labelTip.successTip{'+
                'background: #e6f4ee;'+
                'color: #84C9AB;'+
                '}'+
                '.labelTip.errorTip{'+
                'background: #fbf1ef;'+
                'color: #e17366;'+
                '}'+
                '@media screen and (max-width: 640px) {' +
                '.oui-verifyCode-fixed{width:100%;}'+
                '.oui-verifyCode-content {width: 75%;min-width: 200px;margin:0 auto;}' +
                '.verifyCode-slider-info .verifyCode-slider-area{height:54px;} '+
                '.labelTip {line-height:54px;font-size:16px;} '+
                '.verifyCode-slider-info .slider-warp {background-position:-40px -54px;width:54px;height:54px;margin-top:-27px;} '+
                '.verifyCode-slider-info .slider-warp.slider-warp-error{background-position:-40px 0;} '+
                '} '+
                '</style>'+
                '<div class="verifyCode-slider-info">'+
                '<div  class="verifyCode-slider-area">'+
                '<div class="slider-bg"></div>'+
                '<span  class="labelTip">拖动滑块验证</span>'+
                '</div>'+
                '<span class="verifyCode-icon slider-warp"></span>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '';
            var htmlRender = template.compile(tpl);
            var html = htmlRender(msg);

            params = params ||{};
            params.showType = params.showType || 0;
            /* 0为弹框，1为内嵌***/
            if(params.showType== 1){
                html = $(html).find(".oui-verifyCode-fixed").html();
            }
            params.container = params.container || 'body';
            $(params.container).find(".oui-verifyCode-content").remove();
            $(params.container).find(".oui-verifyCode-area").remove();
            $(params.container).append(html);

            var x = msg.v_x; // 解密 x位置 end块缺口位置
            var getValidate = function(){
                if(this.validateData){
                    return this.validateData;
                }
                return false;
            };
            var handerIn = function(){
                var me = this;
                me.swipestart = true;
                me.startTime = new Date().getTime();
                me.draging=[];
                me.min = 0;
                me.max = me.elm.width();
            };
            var handerOut  =  function () {
                var me = this;
                if(!me.swipestart){
                    /** 如果已经停止 则退出**/
                    return ;
                }
                //停止
                me.endTime = new Date().getTime();
                // me.swipestart = false;

                var dragSuccess=false; //拖拽完成首次验证
                var pos = me.opts.x;
                if(pos){
                    try{
                        pos = parseInt(pos);
                    }catch(e){
                        pos =0;
                    }
                }
                var dragSuccess = me.opts.imgUrl?(parseInt(Math.abs(pos-me.index)) ==6):(me.index==(me.max- me.labelWidth)); //偏差6像素可以接受

                /**没有拖拽时为false ****/
                if ((me.draging) &&(me.draging.length) && (dragSuccess)) {
                    me.$container.find('.verifyCode-rect-start').addClass('active');
                    me.swipestart = false;
                    me.isOk = true;
                    //解锁默认操作
                    $(me.$container.find('.slider-warp')).unbind().prev().find('.labelTip').addClass('loadingTip').
                        text(me.opts.waitingTip);
                    me.$container.find('.slider-warp').hide();
                    me.$container.find('.verifyCode-rect-start').hide();
                    me.$container.find('.verifyCode-rect-end').hide();

                    me.success();
                }else if(me.draging){
                    $(me.$container.find('.slider-warp')).unbind().prev().find('.labelTip').addClass('errorTip').
                        text(me.opts.errorLabelTip);
                    slider.$container.find('.slider-warp').addClass('slider-warp-error');
                    me.isOk = false;
                    me.error();
                    reset.call(me);
                }
            };
            var findPath= function(dragingPath,index){
                for(var i= 0,len=dragingPath.length;i<len;i++){
                    if(dragingPath[i][0] == index){
                        return dragingPath[i];
                    }
                }
            };
            /**随机整数 ***/
            var randomInt= function (under, over){
                switch(arguments.length){
                    case 1: return parseInt(Math.random()*under+1);
                    case 2: return parseInt(Math.random()*(over-under+1) + under);
                    default: return 0;
                }
            }
            var BigDecimal = oui.BD._oui_bd;
            /**获取当前位置坐标 ****/
            var getClientData = function(time,num){
                var me = this;
                var uk = me.opts.v_u_p_;
                var t = time- me.startTime;
                var x = me.index; // userkey 时间挫进行加密
                var x1 = parseInt(me.opts.x1);
                var y1 = parseInt(me.opts.x2);
                var x2= parseInt(me.opts.x3);
                var y2 = parseInt(me.opts.x4);
                var tempY = (y2-y1);
                var tempX = (x2-x1);
                var tempXX = x-x1;
                var y = y1+tempY*tempXX/tempX;
                num = num ||5;
                var rand = randomInt(num);
                y=(function(a,b,c,d,e,f,g,n){
                    var k = e.toFixed(5);//保留15位小数
                    //k = parseFloat(k);
                    var r = f;
                    var t=1;
                    if( r%n !== 0 ){
                        t = -1;
                    }
                    t*=randomInt(1,10);

                    if(r == 1){
                        k = new BigDecimal(k+"").add(new BigDecimal((t*parseInt(g.opts.x))+"")).toString();
                    }else if(r == 2){
                        k = new BigDecimal(k+"").add(new BigDecimal((t*parseInt(g.opts.x1))+"")).toString();
                    }else if(r ==3){
                        k = new BigDecimal(k+"").add(new BigDecimal((t*parseInt(g.opts.x2))+"")).toString();
                    }else if(r == 4){
                        k = new BigDecimal(k+"").add(new BigDecimal((t*parseInt(g.opts.x3))+"")).toString();
                    }else if(r==5){
                        k = new BigDecimal(k+"").add(new BigDecimal((t*parseInt(g.opts.x4))+"")).toString();
                    }
                    return k;
                })(x1,y1,x2,y2,y,rand,me,2);

                return [oui.encode4des(x+'',x+'::'+time+'::'+me.opts.v_u_p_),oui.encode4des(y+'',x+'::'+time+'::'+me.opts.v_u_p_)];
            };
            var handerMove  = function (event, type) {
                var me = this;
                if (me.swipestart&&me.draging) {
                    event.preventDefault();
                    event = event || window.event;
                    if (type == "mobile") {
                        me.index = event.originalEvent.touches[0].pageX - me.lableIndex;
                    } else {
                        me.index = event.clientX - me.lableIndex;
                    }
                    me.index = parseInt(me.index);
                    var curT= new Date().getTime();
                    var currDrag = findPath(me.draging,me.index);
                    if(currDrag){
                        currDrag[1] =curT-me.startTime;
                        var clientTemp = getClientData.call(me,curT);
                        var paramX =clientTemp[0];
                        var paramY = clientTemp[1];
                        currDrag[2] = paramX;
                        currDrag[3] = paramY;
                    }else{
                        var clientTemp = getClientData.call(me,curT);
                        var paramX =clientTemp[0];
                        var paramY = clientTemp[1];
                        me.draging.push([me.index,curT-me.startTime,paramX,paramY ]);
                    }
                    move.call(me);
                }
            };

            /**
             * 更新视图
             */
            var updateView = function () {
                var me = this;
                me.sliderBg.css('width', me.index);
                me.$container.find(".slider-warp").css("left", me.index + "px");
                var leftCfg = {};
                leftCfg.left = me.index+'px';
                me.$container.find('.slider-bg').css('width',me.index+"px");
                me.$container.find('.verifyCode-rect-start').css( leftCfg);
            };
            /**
             * 鼠标/手指移动过程
             */
            var move = function(){
                var me = this;
                if ((me.index + me.labelWidth) >= me.max) {
                    me.index = me.max - me.labelWidth ;
                    //解锁
                    me.isOk = false;
                }
                if (me.index < 0) {
                    me.index = me.min;
                    //未解锁
                    me.isOk = false;
                }
                updateView.call(me);
            };


            var reset =  function () {
                var me = this;

                me.index = 0;
                var widthCfg= {};
                widthCfg.width = 0;
                me.sliderBg .animate(widthCfg,me.opts.duration);
                var leftCfg = {};
                leftCfg.left = me.index +'px';
                me.$container.find('.verifyCode-rect-start').css( leftCfg);
                var aniCfg = {};
                aniCfg.opacity= 1;
                var posCfg = {};
                posCfg.left = me.index;
                me.$container.find(".slider-warp").animate(posCfg, me.opts.duration)
                    .prev().find(".lableTip").animate(aniCfg, me.opts.duration,null );
                init.call(me);
                setTimeout(function(){
                    me.$container.find('.labelTip').removeClass('errorTip').html(me.opts.defaultTip);
                    me.$container.find('.slider-warp').removeClass('slider-warp-error');
                },me.opts.duration*4);
            };

            /**
             * 检测元素是否存在
             * @param elm
             * @returns {boolean}
             */

            var checkElm = function (elm) {
                if($(elm).length > 0){
                    return true;
                }else{
                    throw "this element does not exist.";
                }
            };
            /**
             * 检测传入参数是否是function
             * @param fn
             * @returns {boolean}
             */
            var checkFn = function (fn) {
                if(typeof fn === "function"){
                    return true;
                }else{
                    throw "the param is not a function.";
                }
            };

            var SliderUnlock = function (elm, options, success,error){
                var me = this;
                var $elm = checkElm(elm) ? $(elm) : $;
                success = checkFn(success) ? success : function(){};
                error =  checkFn(error)?error:function(){};
                var opts= {};
                opts.errorLabelTip= '验证失败';
                opts.successLabelTip = 'Successfully Verified';
                opts.swipestart = false;
                opts.duration = 200;
                opts.min=0;
                opts.x=0;
                opts.defaultTip = '拖动滑块验证';
                opts.max = $elm.find('.verifyCode-slider-area').width();
                opts.index=0;
                opts.IsOk= false;
                opts.lableIndex= 0;
                opts = $.extend(opts, options||{});
                me.$container= $elm;
                //$elm
                me.elm = $elm.find('.verifyCode-slider-area');
                //opts
                me.opts = opts;
                //是否开始滑动
                me.swipestart = opts.swipestart;
                //最小值
                me.min = opts.min;
                //最大值
                me.max = opts.max;
                //当前滑动条所处的位置
                me.index = opts.index;
                //是否滑动成功
                me.isOk = opts.isOk;
                //滑块宽度
                me.labelWidth = me.$container.find('.slider-warp').width();
                //滑块背景
                me.sliderBg = me.$container.find('.slider_bg');
                //鼠标在滑动按钮的位置
                me.lableIndex = opts.lableIndex;
                //success
                me.success = success;
                me.error = error;
                me.getValidate = getValidate;
            }
            var init = function(me){
                var me = this;
                me.draging= null;
                updateView.call(me);
                var leftCfg = {};
                leftCfg.left = me.opts.x+"px";
                me.$container.find('.verifyCode-rect-end').css(leftCfg);
                me.$container.find(".slider-warp").on("mousedown", function (event) {
                    var e = event || window.event;
                    me.lableIndex = e.clientX - this.offsetLeft;
                    handerIn.call(me);
                }).on("mousemove", function (event) {
                    //handerMove.call(me,event);
                }).on("mouseup", function (event) {
                    handerOut.call(me);
                }).on("mouseout", function (event) {
                    //handerOut.call(me);
                }).on("touchstart", function (event) {
                    var e = event || window.event;
                    me.lableIndex = e.originalEvent.touches[0].pageX - this.offsetLeft;
                    handerIn.call(me);
                }).on("touchmove", function (event) {
                    handerMove.call(me,event, "mobile");
                }).on("touchend", function (event) {
                    handerOut.call(me);
                });
                $(document).on('mousemove',function(event){
                    handerMove.call(me,event);
                }).on('mouseup',function(event){
                    if(!me.draging){
                        return ;
                    }
                    if(me.tempHanderOutTimer){
                        window.clearTimeout(me.tempHanderOutTimer);
                        me.tempHanderOutTimer = null;
                    }
                    me.tempHanderOutTimer =window.setTimeout(function(){
                        handerOut.call(me);
                        me.tempHanderOutTimer = null;
                    },1);
                });
                oui.setPageParam('_verfify_obj',me);
            };
            var sliderCfg = {};
            sliderCfg.userId = msg.v_u_k_;
            sliderCfg.v_u_p_ = msg.v_u_p_;
            sliderCfg.v_x=msg.v_x;
            sliderCfg.v_x_1=msg.v_x_1;
            sliderCfg.v_x_2=msg.v_x_2;
            sliderCfg.v_x_3=msg.v_x_3;
            sliderCfg.v_x_4=msg.v_x_4;

            sliderCfg.imgUrl = imgUrl;
            sliderCfg.x = oui.decode4des(msg.v_x,msg.v_u_p_);
            sliderCfg.x1 = oui.decode4des(msg.v_x_1,msg.v_u_p_);
            sliderCfg.x2 = oui.decode4des(msg.v_x_2,msg.v_u_p_);
            sliderCfg.x3 = oui.decode4des(msg.v_x_3,msg.v_u_p_);
            sliderCfg.x4 = oui.decode4des(msg.v_x_4,msg.v_u_p_);

            sliderCfg.y = 0;
            sliderCfg.params = params;
            sliderCfg.errorLabelTip = '失败了，重新试试';
            sliderCfg.waitingTip = '正在验证...';
            sliderCfg.successLabelTip = '验证成功';

            var clientDataMinLength = 20;//客户端行为数据条数至少20条限制
            var clientDataMaxLength = 40; //客户端行为数据条数最大限制为50

            //加密解密结束
            var slider = new SliderUnlock(params.container,sliderCfg ,function(){
                var userId = oui.encode4des(slider.opts.userId,slider.opts.v_u_p_);
                var checkUrl = oui.getContextPath()+"service/startwe/login/verification/checkVerifyCode4First";
                //TODO 后端接口调整好后替换
                // checkUrl=oui.getContextPath()+"res_common/oui/verify-code-check.json";

                var postData = {};
                postData.v_u_k_ = userId;
                postData.v_u_p_ = slider.opts.v_u_p_;

                var size = randomInt(clientDataMinLength,clientDataMaxLength);
                if(slider.draging.length>size){
                    slider.draging.sort(function(){ return 0.5 - Math.random() }); //随机排序
                    slider.draging.length = size; //指定数组长度
                }
                slider.draging.sort(function(arr1,arr2){ //重新排序
                    return arr1[0]-arr2[0];
                });
                postData.v_d = oui.encode4des(oui.parseString(slider.draging),slider.opts.v_u_p_); //加密的客户端数据
                postData.v_x = oui.encode4des(slider.opts.v_x+"::"+slider.index,slider.opts.v_u_p_);//加密的拖拽位置
                postData.v_st = slider.startTime||0;//不加密的拖拽开始时间;
                postData.v_et= slider.endTime||0 ;//不加密的拖拽结束时间

                /***申请拖拽的第一次校验 成功则 执行业务回调，否则 重新显示验证码 ****/
                //后续调整为postData TODO
                oui.getData(checkUrl,postData,function(res){
                    var msg = res.resultObj;
                    msg = oui.parseJson(msg);
                    var validate = {};
                    validate.v_u_k_ = msg.v_u_k_;
                    validate.v_u_p_ = msg.v_u_p_;
                    validate.v_validate = msg.v_validate;
                    if(res.success){
                        $(slider.$container.find('.slider-warp')).prev().find('.labelTip').removeClass('loadingTip').addClass('successTip').
                            text(slider.opts.successLabelTip);
                        window.setTimeout(function(){
                            $(slider.opts.params.container).find(".oui-verifyCode-content").remove();
                            $(slider.opts.params.container).find(".oui-verifyCode-area").remove();
                            var verifyOnSuccess = slider.opts.params.onSuccess ||"";
                            slider.validateData = validate;
                            verifyOnSuccess&&verifyOnSuccess(validate);
                            oui.destroyVerify();
                        },slider.opts.duration);
                    }else{
                        $(slider.$container.find('.slider-warp')).prev().find('.labelTip').removeClass('loadingTip').removeClass('successTip').addClass('errorTip').
                            text(slider.opts.errorLabelTip);
                        slider.$container.find('.slider-warp').addClass('slider-warp-error');
                        window.setTimeout(function(){
                            oui.showVerifyHtml(slider.opts.params);
                        },slider.opts.duration);

                    }
                },function(res){
                    $(slider.$container.find('.slider-warp')).prev().find('.labelTip').removeClass('loadingTip').removeClass('successTip').addClass('errorTip').
                        text(slider.opts.errorLabelTip);
                    slider.$container.find('.slider-warp').addClass('slider-warp-error');
                    window.setTimeout(function(){
                        oui.showVerifyHtml(slider.opts.params);
                    },slider.opts.duration);
                },false);

            },function(){
                //拖拽不到位 自动reset

            });
            msg = null;
            delete msg;
            res= null;
            delete res;
            init.call(slider);

        });
    };
})(window);

