!(function(win,
    json){
        if(json&&json.callback&&(typeof json.callback=='string')){
            var fun=new Function('param',
            'win',
            json.callback);fun(json,
            win);
        }else if(json&&json.callback&&(typeof json.callback=='function')){
            json.callback(json,
            win);
        }
    })(window,
    {
        "loadApproveFormUrl": "/ze6zIf.biz?m=startwe",
        "success": true,
        "js_version": "?_v=1.0.0",
        "loadPortal4RuntimeUrl": "/ZfMvQn.biz?m=startwe",
        "callback": "win.oui_context=param;param.callback=null;delete param.callback;",
        "version": "1.0.0",
        "checkUrl": "/BFBnEb.biz?m=startwe",
        "portalWebSite":"http://localhost:8080/",
    });