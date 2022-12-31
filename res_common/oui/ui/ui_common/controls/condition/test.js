/****
 * 移动端屏幕横竖监听
 */
(function(){
    var supportOrientation = (typeof window.orientation === 'number' &&
    typeof window.onorientationchange === 'object');
    var init = function(){
        var htmlNode = document.body.parentNode,
            orientation;
        var updateOrientation = function(){
            if(supportOrientation){
                orientation = window.orientation;
                switch(orientation){
                    case 90:
                    case -90:
                        orientation = 'landscape';
                        break;
                    default:
                        orientation = 'portrait';
                        break;
                }
            }else{
                orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
            }
            htmlNode.setAttribute('class',orientation);

            var width = $('#grid').width();
            alert('当前 grid的宽度为:'+width);
        };
        if(supportOrientation){
            window.addEventListener('orientationchange',updateOrientation,false);
        }else{
//监听resize事件
            window.addEventListener('resize',updateOrientation,false);
        }
        updateOrientation();
    };
    window.addEventListener('DOMContentLoaded',init,false);
})();












