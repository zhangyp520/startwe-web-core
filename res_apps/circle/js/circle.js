!(function (win, $) {

    var CircleController4Edit = {
        "package": "com.startwe.models.circle.web",
        "class": "CircleController4Edit",
        data:{
        },
        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            oui.setPageParam('_menu_page_'+'circle',oui.parseJson(oui.parseString(urlParams)));

            var id = urlParams.id ||'';
            template.helper("CircleController4Edit",this);
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
                me.data.saveUrl = urlParams.saveUrl;
                me.data.loadUrl = urlParams.loadUrl;
                //编辑
                me.loadMyCircle({
                    id:id
                },function(){
                    oui.parse({
                        callback:function(){
                            me.bindEvents();
                        }
                    });
                });
            }else{
                me.data.saveUrl = urlParams.initPath;
                //新增
                oui.parse({
                    callback:function(){
                        me.bindEvents();
                    }
                });
            }
        },
        sendFile:function(file,editor,welEditable){
            oui.upload4ajax({
                file:file,
                url:'',
                success:function(res){
                    editor.insertImage(welEditable, res);
                },
                error:function(res){
                    oui.getTop().oui.alert(res);
                }
            });
        },
        bindEvents:function(){
            var me = this;
            $('.article-editor').summernote({
                height: 300,
                tabsize: 2,
                lang: 'zh-CN',
                onImageUpload: function(files,editor,welEditable) {
                    me.sendFile(files[0],editor,welEditable);
                }
            });

            $('.btn-save').click(function()
            {
                var a = $('.article-editor').summernote('code');
                console.log(a);
            });
        },
        getData:function(){
            var me = this;
            return me.data;
        },
        /**项目管理 **/
        event2projectMgr:function(cfg){
            var me = this;
            var circleId =me.data.circle.id;
            if(!circleId){
                oui.getTop().oui.alert('圈子参数不能为空');
                return ;
            }
            com.startwe.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project-list.tpl.html",{
                circleId:circleId,
                circleEnName:me.data.circle.enName,
                projectListUrl:me.data.projectListUrl
            });
        },
        /****
         * 保存 圈子
         * @param cfg
         */
        event2saveCircle:function(cfg){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Edit',''),'save');
            var code = $('.article-editor').summernote('code');
            me.data.circle.description = code;
            var param = {
                circle:me.data.circle
            };
            oui.postData(me.data.saveUrl||path,param,function(res){
                if(res.success){
                    me.data.circle.id = res.circleId;
                    oui.getTop().oui.alert('保存成功');
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            },'保存中...');
        },
        loadMyCircle:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Edit',''),'loadMyCircle');
            var id = oui.getParam('id');
            oui.getData(me.data.loadUrl||path,param,function(res){
                if(res.success){
                    var circle = res.circle||{};
                    me.data.circle = circle;
                    me.data.projectListUrl = res.projectListUrl;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...',function(err){
                oui.getTop().oui.alert(err);
            });
        }
    };
    CircleController4Edit = oui.biz.Tool.crateOrUpdateClass(CircleController4Edit);
})(window, jQuery);