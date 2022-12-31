!(function (win, $) {


    var AccountController = {
        "package": "com.oursui.models.account.web",
        "class": "AccountController",
        init:function(){

        },
        go2reg:function(cfg){
            win.location.href = oui.getContextPath()+'res_apps/account/reg.html';
        },
        login:function(cfg){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'login');
            var param = {
                name:$('[name=name]').val(),
                pass:$('[name=pass]').val()
            };
            oui.postData(path,param,function(res){
                if(res.success){
                    setTimeout(function(){
                        var msg = res.msg;

                        var tokenId = res.tokenId;
                        var userId = res.userId;
                        oui.cookie('tokenId',tokenId,30);
                        oui.cookie('userId',userId);
                        oui.cookie('userName',res.userName);
                        var loadMenusUrl = oui.getParam('loadMenusUrl');
                        var go2url = oui.getContextPath()+"index.html";
                        if(loadMenusUrl){
                            go2url = oui.setParam(go2url,'loadMenusUrl',loadMenusUrl);
                        }
                        location.replace(go2url);
                    },200);
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            },'登陆中...')
        },
        reg:function(cfg){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName,'reg');
            var param = {
                name:$('[name=name]').val(),
                pass:$('[name=pass]').val(),
                repass:$('[name=repass]').val()
            };
            oui.postData(path,param,function(res){
                if(res.success){
                    setTimeout(function(){
                        location.replace(oui.getContextPath()+"res_apps/account/login.html");
                    },200);
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            })
        }
    };
    AccountController = oui.biz.Tool.crateOrUpdateClass(AccountController);
})(window, jQuery);