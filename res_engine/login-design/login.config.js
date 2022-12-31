!(function (win) {
    var oui = win.oui ||{};
    win.oui = oui;
    oui.login = oui.login || {};
    oui.login.config = {
        config:{},//登录属性配置或者定义
        templates:[
            {
                style:{
                    css:'',
                    backgroundColor:'',
                    backgroundImage:''
                },
                boxStyle:{
                    css:''
                }
            }
        ]
    };
})(window);