!(function (win, $) {

    var Circle4StartweController4Load = {
        "package": "com.oursui.models.circle.web",
        "class": "Circle4StartweController4Load",
        data:{
        },
        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';

            oui.setPageParam('_menu_page_'+'circle-startwe',oui.parseJson(oui.parseString(urlParams)));

            template.helper("Circle4StartweController4Load",this);
            me.data.clickName = oui.os.mobile?'tap':'click';
            me.data.permissionTypes = [{
                value:'self',
                display:'仅自己可看'
            },
            {
                value:'all',
                display:'所有人可看'
            }
            ];
            me.data.circleTypes= [
                {value:'growth',display:'个人成长'},
                {value:'education',display:'家庭教育'},
                {value:'science',display:'科学技术'},
                {value:'project',display:'项目孵化'},
                {value:'resource',display:'资源管理'},
                {value:'design',display:'产品设计'},
                {value:'service',display:'产品服务'}
            ];
            me.data.circle = {};
            if(id){
                me.data.loadCircleUrl = urlParams.loadCircleUrl;
                //编辑
                me.loadCircle({
                    id:id
                },function(){
                    oui.parse({
                        callback:function(){
                            me.bindEvents();
                        }
                    });
                });
            }else{
                oui.parse({
                    callback:function(){
                        me.bindEvents();
                    }
                });
            }
        },

        bindEvents:function(){

        },
        getData:function(){
            var me = this;
            return me.data;
        },

        loadCircle:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Load',''),'loadCircle');
            var id = oui.getParam('id');
            oui.getData(me.data.loadCircleUrl||path,param,function(res){
                if(res.success){
                    var circle = res.circle||{};
                    me.data.circle = circle;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...',function(err){
                oui.getTop().oui.alert(err);
            });
        }
    };
    Circle4StartweController4Load = oui.biz.Tool.crateOrUpdateClass(Circle4StartweController4Load);
})(window, jQuery);