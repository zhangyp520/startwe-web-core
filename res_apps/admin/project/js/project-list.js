!(function (win, $) {

    var ProjectController4List = {
        "package": "com.oursui.models.project.web",
        "class": "ProjectController4List",
        data:{},
        init:function(){
            var me = this;
            var urlParams = oui.getPageParam('urlParams')||{};
            me.urlParams = urlParams;
            oui.setPageParam('_menu_page_'+'project-list',oui.parseJson(oui.parseString(urlParams)));
            me.data.clickName=oui.os.mobile?'tap':'click';
            template.helper('ProjectController4List',this);
            me.data.projectListUrl =  urlParams.projectListUrl;
            me.data.projectTypes= [
                //{value:'growth',display:'个人成长'},
                //{value:'education',display:'家庭教育'},
                //{value:'science',display:'科学技术'},
                //{value:'project',display:'项目孵化'},
                //{value:'resource',display:'资源管理'},
                //{value:'design',display:'产品设计'},
                //{value:'service',display:'产品服务'}
            ];

            var params= {};
            if(urlParams.circleId){
                params.circleId = urlParams.circleId;
            }
            me.query(params,function(){
                oui.parse({
                    callback:function(){

                    }
                });
            });
        },
        findProjectTypeName:function(projectType){
            var me = this;
            var temp = oui.findOneFromArrayBy(me.data.projectTypes,function(item){
                if(item.value == projectType){
                    return true;
                }
            });
            return temp?temp.display:projectType;
        },
        getData:function(){
            var me = this;
            return me.data ||{};
        },
        /** 创建项目***/
        event2create:function(cfg){
            /***
             * 根据模板配置 替换 某个容器里面的内容
             * url,scripts,controller,initMethod,container,callback,params
             */
            var me = this;
            var params= $.extend(true,{
                saveProjectUrl:me.data.createProjectUrl
            },me.urlParams);
            com.oursui.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project.tpl.html",params);
        },
        event2edit:function(cfg){
            var me = this;
            var projectId = $(cfg.el).attr('project-id');
            var loadUrl =$(cfg.el).attr('project-load-url');
            com.oursui.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project.tpl.html",{
                circleId:me.urlParams.circleId||'',
                loadUrl:loadUrl,
                id:projectId
            });
        },
        event2projectPortal:function(cfg){
            var url= $(cfg.el).attr('project-portal-path');

            var htmlUrl =oui.getContextPath() + 'index.html' ;
            htmlUrl = oui.setParam(htmlUrl,"loadMenusUrl",url);
            oui.openWindow({
                url: htmlUrl,
                openType:'_blank'
            });
            //oui.getData(url,{},function(res){
            //    if(res.success){
            //        var name = res.name;
            //
            //    }else{
            //        oui.getTop().oui.alert(res.msg);
            //    }
            //});

        },
        /** 进入设计项目****/
        event2design:function(cfg){
            var me = this;
            var projectId = $(cfg.el).attr('project-id');
            var path = $(cfg.el).attr('design-path');
            com.oursui.models.portal.web.PortalController.doActionByMenuUrl("res_apps/project/project-design.tpl.html",{
                circleId:me.urlParams.circleId||'',
                id:projectId,
                loadProjectDesignPath:path
            });
        },
        event2remove:function(cfg){
            var projectId = $(cfg.el).attr('project-id');

            var url = $(cfg.el).attr('project-remove-url');
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4List',''),'remove');
            var param = {
                id:projectId
            };
            oui.postData(url||path,param,function(res){
                if(res.success){
                    oui.getTop().oui.alert('删除成功');
                    oui.removeFromArrayBy(me.data.projects,function(item){
                        if(item.id == projectId){
                            return true;
                        }
                    });
                    if(me.data.projects.length){
                        $(cfg.el).closest('.pg-list-item').remove();
                    }else{
                        oui.getById('project-list').render();
                    }
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },function(err){
                oui.getTop().oui.alert(err);
            },'删除中...');
        },
        query:function(param,callback){
            var me = this;
            var path = oui.biz.Tool.getApiPathByController(me.FullName.replace('4List',''),'query');
            oui.getData(me.data.projectListUrl||path,param,function(res){
                if(res.success){
                    var projects = res.projects||[];
                    me.data.projects = projects;
                    me.data.createProjectUrl = res.createProjectUrl;
                    callback&&callback();
                }else{
                    oui.getTop().oui.alert(res.msg);
                }
            },'加载中...');
        }
    };
    ProjectController4List = oui.biz.Tool.crateOrUpdateClass(ProjectController4List);

})(window, jQuery);