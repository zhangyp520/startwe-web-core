 // banner
 var swiper = new Swiper(".mySwiper", {
     spaceBetween: 0,
     effect: 'slide',
     speed: 1000,
     loop: true,
     //   autoplay:false,
     autoplay: {
         delay: 2000,
         stopOnLastSlide: false,
         disableOnInteraction: false,
     },
     lazy: {
         loadPrevNext: true,
     },
     navigation: {
         nextEl: ".swiper-button-next",
         prevEl: ".swiper-button-prev",
     },
     pagination: {
         el: ".swiper-pagination",
         clickable: true,
     },
     on: {
         slideChangeTransitionEnd: function () {

         },
     },
 });

 //窗口显示才加载
 var isEffect = true;
 $(window).on("scroll",
     function () {
         var wrapTop = $("#content_box_synergy").offset().top;
         var s = $(window).scrollTop();
         if (s > wrapTop - ($(window).height() - $("#content_box_synergy").outerHeight() + 50) && isEffect) {
             isEffect = false;
             $('.countToNum').countUp({
                 delay: 10, //动画延迟执行
                 time: 1000, //动画持续时间
             });
         }
     })

 // 向上移动动画效果
 AOS.init({
     easing: 'ease-in-out-sine'
 });

 // 锚点滚动
 function goSomeWhere(id, obj) {
     $('div.menu > ul > li').removeClass('active');
     $(obj).addClass('active');
     $("html,body").animate({
         scrollTop: $("#" + id).offset().top - 65
     }, 1500);
 }

 //  判断设备类型
 function fIsMobile() {
     return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent);
 }

//  $(document).ready(function () {
//      if (fIsMobile()) window.location.href = 'https://www.startwe.cn/wap.html';
//  });

 $(function(){
    if (fIsMobile()) window.location.href = 'https://www.startwe.cn/wap.html';
 });

 // 案列效果
 var text = '';
 $('div.case-box').mouseenter(function () {
     $('div.case-desc', $(this)).animate({
         top: 0
     }, 500);
     text = $('div.title', $(this)).html();
     $('div.title', $(this)).animate({
         height: 0
     }, 500).html('');
 }).mouseleave(function () {
     $('div.case-desc', $(this)).animate({
         top: 255
     }, 500);
     $('div.title', $(this)).animate({
         height: 50
     }, 500).html(text);
 });

 // 引擎切换
 $('div.ul_position > ul > li').click(function (index) {
     var index = $(this).index();
     $('.engine_box_li_bg').removeClass('engine_box_li_bg');
     $(this).addClass('engine_box_li_bg');
     $("div[id^='engine_container_']").hide();
     $('#engine_container_' + (index + 1)).show();
 });

 var yinqin = setInterval(function () {
     $('div.ul_position > ul').data('next', 3);
     var swIndex = $('div.ul_position > ul > li.engine_box_li_bg').index() + 1;
     swIndex = swIndex == 5 ? 1 : (swIndex + 1);
     $('#switch_' + swIndex).click();
 }, 3000);

// 百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?83a767bae990dd8b47386457063458cb";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

