$(function(){
    $('.headerMenus>li').click(function(){

        $(this).addClass('active').siblings().removeClass('active');
        
        // 获取索引
        let index = $(this).index();
        if(index==0){
            $("html, body").animate({ scrollTop: $(".header").offset().top }, 500)
        }else if(index==1){
            $("html, body").animate({ scrollTop: $(".characteristic").offset().top }, 500)
        }else if(index==2){
            $("html, body").animate({ scrollTop: $(".actualCombat").offset().top }, 1000)
        }else if(index==3){
            $("html, body").animate({ scrollTop: $(".transaction").offset().top }, 1000)
        }else if(index==4){
            $("html, body").animate({ scrollTop: $(".contactUsBox").offset().top }, 1000)
        }
        
        
        
    })
})