
!(function(win){
    var oui = win.oui||{};
    win.oui = oui;
    // 配置公共的请求头的访问端口号
    oui.baseUrl = oui.getContextPath()+'service/carservice/';
    oui.loadIframe = function(iframe) {
        let height = iframe.contentDocument.body.clientHeight;
        console.log(height)
         
        iframe.style.height = height+ 'px';
    };

    oui.ajaxPost = function(url,param,success,error,loadding){
        axios({
            method:'post',
            headers:{
                "token": window.localStorage.getItem("token")
            },
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
       

    // oui.postData(oui.baseUrl+'ccc/xx',{

    // },function(res){
    //     if(res.success){ 


    //     }else{
    //         //error   
    //     }
    // },function(res){
    //      //error
    // },'加载中...');  //保存中

  
        // oui.postData(oui.baseUrl+url,param,function(res){
        //     if(res.success){ 
        //         callback(res);
        //     }else{
        //         error&&error(res); 
        //     }
        // },error,loadding);  //保存中
    };
})(window);
