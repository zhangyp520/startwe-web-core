!(function (win, $) {

    var CircleController4Query = {
        "package": "com.startwe.models.circle.web",
        "class": "CircleController4Query",
        data:{},
        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            template.helper('CircleController4Query',this);
            me.data.circleTypes= [
                {value:'growth',display:'个人成长'},
                {value:'education',display:'家庭教育'},
                {value:'science',display:'科学技术'},
                {value:'project',display:'项目孵化'},
                {value:'resource',display:'资源管理'},
                {value:'design',display:'产品设计'},
                {value:'service',display:'产品服务'}
            ];
            var urlParams = oui.getPageParam('urlParams');
            me.data.queryMyCirclePath = urlParams.initPath||"" ;
            me.queryMyCircles(function(){
                oui.parse({
                    callback:function(){

                    }
                });
            });
        },
        findCircleTypeName:function(circleType){
            var me = this;
            var temp = oui.findOneFromArrayBy(me.data.circleTypes,function(item){
                if(item.value == circleType){
                    return true;
                }
            });
            return temp?temp.display:circleType;
        },
        getData:function(){
            var me = this;
            return me.data ||{};
        },
        /** 创建圈子***/
        event2createCircle:function(cfg){
            /***
             * 根据模板配置 替换 某个容器里面的内容
             * url,scripts,controller,initMethod,container,callback,params
             */
            com.startwe.models.portal.web.PortalController.doActionByMenuUrl("res_apps/circle/circle.tpl.html");
        },
        event2loadCircle:function(cfg){
            var circleId = $(cfg.el).attr('circle-id');
            var loadUrl = $(cfg.el).attr('circle-load-url');
            var saveUrl = $(cfg.el).attr('circle-save-url');
            com.startwe.models.portal.web.PortalController.doActionByMenuUrl("res_apps/circle/circle.tpl.html",{
                id:circleId,
                loadUrl:loadUrl,
                saveUrl:saveUrl
            });
        },
        event2removeCircle:function(cfg){
            var circleId = $(cfg.el).attr('circle-id');

            var removeUrl = $(cfg.el).attr('circle-remove-url');
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Query',''),'removeCircle');
            var param = {
                id:circleId
            };
            oui.postData(removeUrl||path,param,function(res){
                if(res.success){
                    oui.getTop().oui.alert('删除成功');
                    oui.removeFromArrayBy(me.data.circles,function(item){
                        if(item.id == circleId){
                            return true;
                        }
                    });
                    if(me.data.circles.length){
                        $(cfg.el).closest('.pg-list-item').remove();
                    }else{
                        oui.getById('circle-list').render();
                    }
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            },'删除中...');
        },
        queryMyCircles:function(callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Query',''),'queryMyCircles');
            var param = {
            };
            oui.getData(me.data.queryMyCirclePath||path,param,function(res){
                if(res.success){
                    var circles = res.circles||[];
                    me.data.circles = circles;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...' );
        }
    };
    CircleController4Query = oui.biz.Tool.crateOrUpdateClass(CircleController4Query);

})(window, jQuery);