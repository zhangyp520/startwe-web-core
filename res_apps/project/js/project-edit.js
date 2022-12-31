!(function (win, $) {

    var ProjectController4Edit = {
        "package": "com.startwe.models.project.web",
        "class": "ProjectController4Edit",
        data:{
        },
        init:function(){
            var me = this;
            me.data.clickName=oui.os.mobile?'tap':'click';
            var urlParams = oui.getPageParam('urlParams')||{};
            var id = urlParams.id ||'';
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'project',oui.parseJson(oui.parseString(urlParams)));

            template.helper("ProjectController4Edit",this);
            me.data.clickName = oui.os.mobile?'tap':'click';
            me.data.permissionTypes = [
            //    {
            //    value:'self',
            //    display:'仅自己可看'
            //},
            //{
            //    value:'all',
            //    display:'所有人可看'
            //}
            ];
            me.data.projectTypes= [
                {value:'java_web',display:'java web'}
            ];
            me.data.project = {};
            if(id){
                //编辑
                me.data.loadUrl =  urlParams.loadUrl;
                me.load({
                    id:id
                },function(){
                    oui.parse({
                        callback:function(){
                            me.bindEvents();
                        }
                    });
                });
            }else{
                me.data.saveUrl = urlParams.saveProjectUrl;
                me.data.project.circleId = urlParams.circleId||'';
                var circleEnName = urlParams.circleEnName||"";
                circleEnName= circleEnName+'_';
                me.data.project.enName=circleEnName;

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

        /****
         * 保存 项目
         * @param cfg
         */
        event2save:function(cfg){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Edit',''),'save');
            var code = $('.article-editor').summernote('code');
            me.data.project.description = code;
            var param = {
                project:me.data.project
            };
            oui.postData(me.data.saveUrl ||path,param,function(res){
                if(res.success){
                    me.data.project.id = res.projectId;
                    oui.getTop().oui.alert('保存成功');
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            },'保存中...');
        },
        event2projectMgr:function(){
            var me = this;
            com.startwe.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project-list.tpl.html",{
                circleId:me.urlParams.circleId
            });
        },
        load:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4Edit',''),'load');
            var id = oui.getParam('id');
            oui.getData(me.data.loadUrl||path,param,function(res){
                if(res.success){
                    var project = res.project||{};
                    me.data.saveUrl = res.saveUrl;
                    me.data.project = project;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...',function(err){
                oui.getTop().oui.alert(err);
            });
        }
    };
    ProjectController4Edit = oui.biz.Tool.crateOrUpdateClass(ProjectController4Edit);
})(window, jQuery);