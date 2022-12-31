!(function (win, $) {

    var Circle4StartweController4Query = {
        "package": "com.oursui.models.circle.web",
        "class": "Circle4StartweController4Query",
        data:{},
        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            template.helper('Circle4StartweController4Query',this);
            var urlParams = oui.getPageParam('urlParams');
            me.data.queryPath = urlParams.initPath||"";
            me.data.circleTypes= [
                {value:'growth',display:'个人成长'},
                {value:'education',display:'家庭教育'},
                {value:'science',display:'科学技术'},
                {value:'project',display:'项目孵化'},
                {value:'resource',display:'资源管理'},
                {value:'design',display:'产品设计'},
                {value:'service',display:'产品服务'}
            ];
            me.queryStartweCircles(function(){
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
        event2loadCircle:function(cfg){
            var circleId = $(cfg.el).attr('circle-id');
            var loadCircleUrl = $(cfg.el).attr('load-circle-url');
            com.oursui.models.portal.web.PortalController.doActionByMenuUrl("res_apps/circle/circle-startwe.tpl.html",{
                id:circleId,
                loadCircleUrl:loadCircleUrl
            });
        },

        queryStartweCircles:function(callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Query',''),'queryCircles');
            var param = {
            };
            oui.getData(me.data.queryPath||path,param,function(res){
                if(res.success){
                    var circles = res.circles||[];
                    me.data.circles = circles;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...');
        }
    };
    Circle4StartweController4Query = oui.biz.Tool.crateOrUpdateClass(Circle4StartweController4Query);

})(window, jQuery);