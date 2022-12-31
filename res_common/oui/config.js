!(function(win){
    var oui = win.oui||{};
    win.oui = oui;
    // 配置公共的请求头的访问端口号
    oui.baseUrl = oui.getContextPath()+'service/startwe/';

 
    oui.ajaxPost = function(url,param,success,error,loadding){
        axios({
            method:'post',
            url: oui.baseUrl+url,
            data: param
        }).then(function(res){
            if(res&&res.data.success){
                success&&success(res.data);
            }else{
                error&&error(res.data);
            }
        }).catch(function (res) {
        });
    };
    oui.ajaxGet = function(url,success,error){
        axios({
            method:'get',
            url: oui.baseUrl+url,
        }).then(function(res){
            if(res&&res.data.success){
                success&&success(res.data);
            }else{
                error&&error(res.data);
            }
        }).catch(function (res) {
        });
    };
})(window);