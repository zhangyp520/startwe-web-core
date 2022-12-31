!(function(win){
    var oui = win.oui||{};
    win.oui = oui;
    // 配置公共的请求头的访问端口号
    oui.baseUrl = oui.getContextPath() ;

    //正式ajax请求地址
    oui.pptAjaxConfig = {
        //saveTranlateUrl:'API/Program/SaveTranlate',//保存编辑节目的数据包
        findPagesByPptIdUrl:'API/Program/FindPagesByTranslateId',//根据节目id获取 页面简要列表 [{id,name,pptId,templateId}]//页面id，页面名称，节目id，模板id
        loadPageByPageIdUrl:'API/Program/LoadPageByPageId', // 根据页面id获取页面完整对象{id,name,pptId,templateId,json};//页面id，页面名称，节目id，模板id，页面设计json
        newPageUrl:'API/Program/NewPage',//在节目下新增页面的设计{name,pptId,templateId,json }// 页面名称，节目id，模板id，页面设计json  ;需要返回页面id到前端
        savePageUrl:'API/Program/SavePage', //保存节目下某个页面的设计{id,name,pptId,templateId,json}//页面id,页面名称，节目id，模板id，页面设计json；
        removePageUrl:'API/Program/RemovePage', //删除页面url
        submitPPtUrl:'API/Program/SubmitTranslate',//提交节目审核 //{pptId} 节目id

        //TODO 保存页面顺序
        savePagesByPptIdUrl:'API/Program/SavePagesByTranslateId',//根据节目id 保存页面简要信息列表 [{id,name,pptId,templateId}] //完整的简要页面列表, {页面id,页面名称,节目id,模板id}

        updatePageImgUrl:'API/Program/UpdatePageImgUrl',//TODO 更新页面截图的接口 待提供 {页面id,节目Id,file:blob} 响应  页面id,url 图片地址url
        saveToTemplateUrl:'API/Program/SaveToTemplate',//另存页面为模板 {name,json}// 这个待讨论
        saveTranslateAsTemplate:'API/Program/SaveTranslateToTemplate',//另存节目为模板
        queryTemplatesUrl:'API/Program/QueryTemplatesByTagId',// 查询页面模板{keyword,isSelf}// {标签名,是否私有模板} 根据标签分类查询模板,为空查询所有
        queryCheckTagListUrl:'API/Program/CheckTagList',// 查询分组模板{keyword,isSelf}// {标签名,是否私有模板} 根据标签分类查询模板,为空查询所有
        SaveTemplateToTranslateUrl:'API/Program/SaveTemplateToTranslate'// 模板应用到节目


    };

    //testUrl  TODO 测试完成后 下面这行定义代码需要注释掉
    // oui.pptAjaxConfig = {
    //     saveTranlateUrl:'API/Program/SaveTranlate',//保存编辑节目的数据包
    //     findPagesByPptIdUrl:'res_engine/ppt_design/js/testPageList.json',//根据节目id获取 页面简要列表 [{id,name,pptId,templateId}]//页面id，页面名称，节目id，模板id
    //     savePagesByPptIdUrl:'res_engine/ppt_design/js/API_Program_savePageList.output.json',//根据节目id 保存页面简要信息列表 [{id,name,pptId,templateId}] //完整的简要页面列表, {页面id,页面名称,节目id,模板id}
    //     loadPageByPageIdUrl:'res_engine/ppt_design/js/test.json', // 根据页面id获取页面完整对象{id,name,pptId,templateId,json};//页面id，页面名称，节目id，模板id，页面设计json
    //     newPageUrl:'res_engine/ppt_design/js/API_Program_newPage.output.json',//在节目下新增页面的设计{name,pptId,templateId,json }// 页面名称，节目id，模板id，页面设计json  ;需要返回页面id到前端
    //     savePageUrl:'API/Program/SavePage', //保存节目下某个页面的设计{id,name,pptId,templateId,json}//页面id,页面名称，节目id，模板id，页面设计json；
    //     submitPPtUrl:'API/Program/SubmitTranslate',//提交节目审核 //{pptId} 节目id
    //     saveToTemplateUrl:'API/Program/SaveToTemplate',//另存页面为模板 {name,json}// 这个待讨论
    //     queryTemplatesUrl:'API/Program/QueryTemplates',// 查询页面模板{keyword,isSelf}// {标签名,是否私有模板} 根据标签分类查询模板,为空查询所有
    //
    //     removePageUrl:'res_engine/ppt_design/js/API_Program_removePage.output.json'//删除页面url
    // };
    oui.ajaxPost = function(url,param,success,error,loadding){
        if(loadding){
            oui.progress(loadding);
        }
        axios({
            method:'post',
            url: oui.baseUrl+url,
            data: param
        }).then(function(res){
            if(res&&res.data){
                if((!res.data['ErrorCode']) || res.data.ErrorCode=='0'){
                    res.data.success = true;
                }else{
                    res.data.success =false;
                }
            }
            if(res&&res.data.success){
                success&&success(res.data.Data||{},res.data);
            }else{
                error&&error(res.data.Data||{},res.data);
            }
            if(loadding){
                oui.progress.hide();
            }
        }).catch(function (res) {
            if(loadding){
                oui.progress.hide();
            }
        });
    };
    oui.ajaxGet = function(url,param,success,error,loadding){
        if(loadding){
            oui.progress(loadding);
        }
        axios({
            method:'get',
            url: oui.baseUrl+url,
            data:param
        }).then(function(res){
            if(res&&res.data){
                if((!res.data['ErrorCode']) || res.data.ErrorCode=='0'){
                    res.data.success = true;
                }else{
                    res.data.success =false;
                }
            }
            if(res&&res.data.success){
                success&&success(res.data.Data||{},res.data);
            }else{
                error&&error(res.data.Data||{},res.data);
            }
            if(loadding){
                oui.progress.hide();
            }
        }).catch(function (res) {
            if(loadding){
                oui.progress.hide();
            }
        });
    };
    oui.ajaxGetThird = function(url,success,error,loadding){
        if(loadding){
            oui.progress(loadding);
        }
        axios({
            method:'get',
            url: url,
        }).then(function(res){
            if(res&&res.data){
                success&&success(res||{},res);
            }else{
                error&&error(res||{},res);
            }
            if(loadding){
                oui.progress.hide();
            }
        }).catch(function (res) {
            if(loadding){
                oui.progress.hide();
            }
        });
    };
})(window);