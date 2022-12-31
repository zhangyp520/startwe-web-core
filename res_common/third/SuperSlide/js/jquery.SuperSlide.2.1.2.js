/*!
 * SuperSlide v2.1.2
 * 轻松解决网站大部分特效展示问题
 * 详尽信息请看官网：http://www.SuperSlide2.com/
 *
 * Copyright 2011-2015, 大话主席
 *
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途

 * v2.1.1：修复当调用多个SuperSlide，并设置returnDefault:true 时返回defaultIndex索引错误
 * v2.1.2：增加参数设置vis:"auto"，解决左滚动自适应窗口宽度问题。适应情况：vis:"auto",scroll:1, effect:"left或leftLoop"（注：此为临时解决方案，日后版本可能变动）
 * v2.1.2：修复 mouseOverStop 和 autoPlay均为false下，点击切换按钮后会自动播放bug

 */
(function(a){a.fn.slide=function(b){a.fn.slide.defaults={type:"slide",effect:"fade",autoPlay:false,delayTime:500,interTime:2500,triggerTime:150,defaultIndex:0,titCell:".hd li",mainCell:".bd",targetCell:null,trigger:"mouseover",scroll:1,vis:1,titOnClassName:"on",autoPage:false,prevCell:".prev",nextCell:".next",pageStateCell:".pageState",opp:false,pnLoop:true,easing:"swing",startFun:null,endFun:null,switchLoad:null,playStateCell:".playState",mouseOverStop:true,defaultPlay:true,returnDefault:false};return this.each(function(){var I=a.extend({},a.fn.slide.defaults,b);var g=a(this);var af=I.effect;var o=a(I.prevCell,g);var H=a(I.nextCell,g);var G=a(I.pageStateCell,g);var N=a(I.playStateCell,g);var B=a(I.titCell,g);var m=B.size();var aa=a(I.mainCell,g);var e=aa.children().size();var h=I.switchLoad;var ai=a(I.targetCell,g);var K=parseInt(I.defaultIndex);var z=parseInt(I.delayTime);var p=parseInt(I.interTime);var aq=parseInt(I.triggerTime);var ac=parseInt(I.scroll);var ab=(I.autoPlay=="false"||I.autoPlay==false)?false:true;var C=(I.opp=="false"||I.opp==false)?false:true;var s=(I.autoPage=="false"||I.autoPage==false)?false:true;var P=(I.pnLoop=="false"||I.pnLoop==false)?false:true;var ae=(I.mouseOverStop=="false"||I.mouseOverStop==false)?false:true;var x=(I.defaultPlay=="false"||I.defaultPlay==false)?false:true;var Q=(I.returnDefault=="false"||I.returnDefault==false)?false:true;var ag=isNaN(I.vis)?1:parseInt(I.vis);var an=!-[1,]&&!window.XMLHttpRequest;var J=0;var F=0;var q=0;var E=0;var R=I.easing;var ad=null;var M=null;var W=null;var ap=I.titOnClassName;var D=B.index(g.find("."+ap));var ao=K=D==-1?K:D;var f=K;var am=K;var r=e>=ag?(e%ac!=0?e%ac:ac):0;var V;var U=af=="leftMarquee"||af=="topMarquee"?true:false;var al=function(){if(a.isFunction(I.startFun)){I.startFun(K,m,g,a(I.titCell,g),aa,ai,o,H)}};var j=function(){if(a.isFunction(I.endFun)){I.endFun(K,m,g,a(I.titCell,g),aa,ai,o,H)}};var c=function(){B.removeClass(ap);if(x){B.eq(f).addClass(ap)}};if(I.type=="menu"){if(x){B.removeClass(ap).eq(K).addClass(ap)}B.hover(function(){V=a(this).find(I.targetCell);var i=B.index(a(this));M=setTimeout(function(){K=i;B.removeClass(ap).eq(K).addClass(ap);al();switch(af){case"fade":V.stop(true,true).animate({opacity:"show"},z,R,j);break;case"slideDown":V.stop(true,true).animate({height:"show"},z,R,j);break}},I.triggerTime)},function(){clearTimeout(M);switch(af){case"fade":V.animate({opacity:"hide"},z,R);break;case"slideDown":V.animate({height:"hide"},z,R);break}});if(Q){g.hover(function(){clearTimeout(W)},function(){W=setTimeout(c,z)})}return}if(m==0){m=e}if(U){m=2}if(s){if(e>=ag){if(af=="leftLoop"||af=="topLoop"){m=e%ac!=0?(e/ac^0)+1:e/ac}else{var S=e-ag;m=1+parseInt(S%ac!=0?(S/ac+1):(S/ac));if(m<=0){m=1}}}else{m=1}B.html("");var L="";if(I.autoPage==true||I.autoPage=="true"){for(var ak=0;ak<m;ak++){L+="<li>"+(ak+1)+"</li>"}}else{for(var ak=0;ak<m;ak++){L+=I.autoPage.replace("$",(ak+1))}}B.html(L);var B=B.children()}if(e>=ag){aa.children().each(function(){if(a(this).width()>q){q=a(this).width();F=a(this).outerWidth(true)}if(a(this).height()>E){E=a(this).height();J=a(this).outerHeight(true)}});var y=aa.children();var w=function(){for(var ar=0;ar<ag;ar++){y.eq(ar).clone().addClass("clone").appendTo(aa)}for(var ar=0;ar<r;ar++){y.eq(e-ar-1).clone().addClass("clone").prependTo(aa)}};switch(af){case"fold":aa.css({"position":"relative","width":F,"height":J}).children().css({"position":"absolute","width":q,"left":0,"top":0,"display":"none"});break;case"top":aa.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+ag*J+'px"></div>').css({"top":-(K*ac)*J,"position":"relative","padding":"0","margin":"0"}).children().css({"height":E});break;case"left":aa.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+ag*F+'px"></div>').css({"width":e*F,"left":-(K*ac)*F,"position":"relative","overflow":"hidden","padding":"0","margin":"0"}).children().css({"float":"left","width":q});break;case"leftLoop":case"leftMarquee":w();aa.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+ag*F+'px"></div>').css({"width":(e+ag+r)*F,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-(r+K*ac)*F}).children().css({"float":"left","width":q});break;case"topLoop":case"topMarquee":w();aa.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+ag*J+'px"></div>').css({"height":(e+ag+r)*J,"position":"relative","padding":"0","margin":"0","top":-(r+K*ac)*J}).children().css({"height":E});break}}var Z=function(ar){var i=ar*ac;if(ar==m){i=e}else{if(ar==-1&&e%ac!=0){i=-e%ac}}return i};var d=function(aw){var av=function(ay){for(var ax=ay;ax<(ag+ay);ax++){aw.eq(ax).find("img["+h+"]").each(function(){var aB=a(this);aB.attr("src",aB.attr(h)).removeAttr(h);if(aa.find(".clone")[0]){var aA=aa.children();for(var az=0;az<aA.size();az++){aA.eq(az).find("img["+h+"]").each(function(){if(a(this).attr(h)==aB.attr("src")){a(this).attr("src",a(this).attr(h)).removeAttr(h)}})}}})}};switch(af){case"fade":case"fold":case"top":case"left":case"slideDown":av(K*ac);break;case"leftLoop":case"topLoop":av(r+Z(am));break;case"leftMarquee":case"topMarquee":var at=af=="leftMarquee"?aa.css("left").replace("px",""):aa.css("top").replace("px","");var ar=af=="leftMarquee"?F:J;var i=r;if(at%ar!=0){var au=Math.abs(at/ar^0);if(K==1){i=r+au}else{i=r+au-1}}av(i);break}};var O=function(au){if(x&&ao==K&&!au&&!U){return}if(U){if(K>=1){K=1}else{if(K<=0){K=0}}}else{am=K;if(K>=m){K=0}else{if(K<0){K=m-1}}}al();if(h!=null){d(aa.children())}if(ai[0]){V=ai.eq(K);if(h!=null){d(ai)}if(af=="slideDown"){ai.not(V).stop(true,true).slideUp(z);V.slideDown(z,R,function(){if(!aa[0]){j()}})}else{ai.not(V).stop(true,true).hide();V.animate({opacity:"show"},z,function(){if(!aa[0]){j()}})}}if(e>=ag){switch(af){case"fade":aa.children().stop(true,true).eq(K).animate({opacity:"show"},z,R,function(){j()}).siblings().hide();break;case"fold":aa.children().stop(true,true).eq(K).animate({opacity:"show"},z,R,function(){j()}).siblings().animate({opacity:"hide"},z,R);break;case"top":aa.stop(true,false).animate({"top":-K*ac*J},z,R,function(){j()});break;case"left":aa.stop(true,false).animate({"left":-K*ac*F},z,R,function(){j()});break;case"leftLoop":var ar=am;aa.stop(true,true).animate({"left":-(Z(am)+r)*F},z,R,function(){if(ar<=-1){aa.css("left",-(r+(m-1)*ac)*F)}else{if(ar>=m){aa.css("left",-r*F)}}j()});break;case"topLoop":var ar=am;aa.stop(true,true).animate({"top":-(Z(am)+r)*J},z,R,function(){if(ar<=-1){aa.css("top",-(r+(m-1)*ac)*J)}else{if(ar>=m){aa.css("top",-r*J)}}j()});break;case"leftMarquee":var at=aa.css("left").replace("px","");if(K==0){aa.animate({"left":++at},0,function(){if(aa.css("left").replace("px","")>=0){aa.css("left",-e*F)}})}else{aa.animate({"left":--at},0,function(){if(aa.css("left").replace("px","")<=-(e+r)*F){aa.css("left",-r*F)}})}break;case"topMarquee":var i=aa.css("top").replace("px","");if(K==0){aa.animate({"top":++i},0,function(){if(aa.css("top").replace("px","")>=0){aa.css("top",-e*J)}})}else{aa.animate({"top":--i},0,function(){if(aa.css("top").replace("px","")<=-(e+r)*J){aa.css("top",-r*J)}})}break}}B.removeClass(ap).eq(K).addClass(ap);ao=K;if(!P){H.removeClass("nextStop");o.removeClass("prevStop");if(K==0){o.addClass("prevStop")}if(K==m-1){H.addClass("nextStop")}}G.html("<span>"+(K+1)+"</span>/"+m)};if(x){O(true)}if(Q){g.hover(function(){clearTimeout(W)},function(){W=setTimeout(function(){K=f;if(x){O()}else{if(af=="slideDown"){V.slideUp(z,c)}else{V.animate({opacity:"hide"},z,c)}}ao=K},300)})}var T=function(i){ad=setInterval(function(){C?K--:K++;O()},!!i?i:p)};var u=function(i){ad=setInterval(O,!!i?i:p)};var A=function(){if(!ae&&ab&&!N.hasClass("pauseState")){clearInterval(ad);T()}};var Y=function(){if(P||K!=m-1){K++;O();if(!U){A()}}};var v=function(){if(P||K!=0){K--;O();if(!U){A()}}};var t=function(){clearInterval(ad);U?u():T();N.removeClass("pauseState")};var aj=function(){clearInterval(ad);N.addClass("pauseState")};if(ab){if(U){C?K--:K++;u();if(ae){aa.hover(aj,t)}}else{T();if(ae){g.hover(aj,t)}}}else{if(U){C?K--:K++}N.addClass("pauseState")}N.click(function(){N.hasClass("pauseState")?t():aj()});if(I.trigger=="mouseover"){B.hover(function(){var i=B.index(this);M=setTimeout(function(){K=i;O();A()},I.triggerTime)},function(){clearTimeout(M)})}else{B.click(function(){K=B.index(this);O();A()})}if(U){H.mousedown(Y);o.mousedown(v);if(P){var n;var k=function(){n=setTimeout(function(){clearInterval(ad);u(p/10^0)},150)};var ah=function(){clearTimeout(n);clearInterval(ad);u()};H.mousedown(k);H.mouseup(ah);o.mousedown(k);o.mouseup(ah)}if(I.trigger=="mouseover"){H.hover(Y,function(){});o.hover(v,function(){})}}else{H.click(Y);o.click(v)}if(I.vis=="auto"&&ac==1&&(af=="left"||af=="leftLoop")){var X;var l=function(){if(an){aa.width("auto");aa.children().width("auto")}aa.parent().width("auto");F=aa.parent().width();if(an){aa.parent().width(F)}aa.children().width(F);if(af=="left"){aa.width(F*e);aa.stop(true,false).animate({"left":-K*F},0)}else{aa.width(F*(e+2));aa.stop(true,false).animate({"left":-(K+1)*F},0)}if(!an&&(F!=aa.parent().width())){l()}};a(window).resize(function(){clearTimeout(X);X=setTimeout(l,100)});l()}})}})(jQuery);jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

