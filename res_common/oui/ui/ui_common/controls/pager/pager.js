/**
 * 表格组件
 */
(function (win, oui, $) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;

    /**
     * 控件类构造器
     */
    var Pager = function (cfg) {
        Control.call(this, cfg);//必须继承控件超类
        this.attrs = this.attrs + ",pageIndex,total,pageSize,totalPage,showPageNumSize,pageInfo,sortModel,sortField,sortOrder,onGo2pageBefore,onGo2pageError,onGo2pageOk,dataUrl,data,queryParam,onScroll2Top,otherAttrs,keyData,beforePageIndex,perPageSizeData";
        this.init = init;
        this.go2page = go2page;
        this.go2first = go2first;
        this.go2prev = go2prev;
        this.go2next = go2next;
        this.go2end = go2end;
        this.getTotalPage = getTotalPage;
        this.go2page4ajax = go2page4ajax;
        this.updatePageIndex = updatePageIndex;
        this.setQueryParam = setQueryParam;
        this.getQueryParam = getQueryParam;
        this.getPageNums = getPageNums; //获取能显示的页数[3,4,5,6,7]
        this.go2currPage = go2currPage;// 跳转到当前页

        /** 移动端私有方法 */
        this.scroll2top = scroll2top;

        this.pageSizeChange = pageSizeChange;
    };

    /**
     * 设置查询参数
     * @param param
     */
    var setQueryParam = function(param){
        this.attr('queryParam',param ||[]);
    };
    var getQueryParam = function(){
        return this.attr('queryParam');
    };
    Pager.templateHtml =[];
    Pager.templateHtml4phone = '\
        {{if (!isPc) && (totalPage>1)}}\
        <div class="pager-btns">\
            {{if pageIndex != oui.getByOuiId(ouiId).getTotalPage()}}\
            <span class="btn-next" {{clickName}}="oui.getByOuiId({{ouiId}}).go2next();">加载更多</span>\
            {{else}}\
            <span class="btn-next" >没有了</span>\
            {{/if}}\
            <span class="btn-go-top" {{clickName}}="oui.getByOuiId({{ouiId}}).scroll2top();">回到顶部</span>\
        </div>\
        {{/if}}\
        ';

    // 页数跳转 <span class="btn-go" ><input type="text"  value="{{pageIndex || 1}}" onblur="oui.getByOuiId({{ouiId}}).go2page(parseInt(this.value))"/>/<span class="total_page">{{totalPage ||0}}</span></span>\
    Pager.templateHtml[0] =  '\
        {{if isPc }}<div class="pager-btns">\
                    <span class="btn-first" {{clickName}}="oui.getByOuiId({{ouiId}}).go2first()"><i></i> 首页 </span>\
                    <span class="btn-pre" {{clickName}}="oui.getByOuiId({{ouiId}}).go2prev()"><i></i> 上一页</span>\
                    {{each pageNums as pageNum index}}\
                        {{if pageNum == pageIndex}}\
                        <strong><span class=\"oui-pager-num\">{{pageNum}}</span></strong>\
                        {{else}}\
                        <a  {{clickName}}="oui.getByOuiId({{ouiId}}).go2page({{pageNum}})"><span class=\"oui-pager-num\">{{pageNum}}</span></a>\
                        {{/if}}\
                    {{/each}}\
                    <span class="btn-next" {{clickName}}="oui.getByOuiId({{ouiId}}).go2next()"><i></i>下一页</span>\
                    <span class="btn-last" {{clickName}}="oui.getByOuiId({{ouiId}}).go2end()"><i></i>尾页</span>\
                </div>\
                {{if pageInfo + "" == "true"}}\
                <div class="pager-info">\
                    <span>每页 <select onchange="oui.getByOuiId({{ouiId}}).pageSizeChange(this);">{{each perPageSizeData as ps}}<option value="{{ps}}" {{if (pageSize || 0) == ps }}selected="selected"{{/if}}>{{ps}}</option>{{/each}}</select> 条，总共 {{total || 0}} 条，共 {{totalPage||0}} 页</span>\
                </div>\
                {{/if}}\
        {{/if}}\
    '+Pager.templateHtml4phone;

    Pager.templateHtml[1] ='\
        <div class="pager-btns">\
            {{if pageIndex != oui.getByOuiId(ouiId).getTotalPage()}}\
            <span class="btn-next" {{clickName}}="oui.getByOuiId({{ouiId}}).go2next();">加载更多</span>\
            {{else}}\
            <span class="btn-next no-more" >没有了</span>\
            {{/if}}\
        </div>\
        ';
    Pager.FullName = "oui.$.ctrl.pager";//设置当前类全名
    ctrl["pager"] = Pager;//将控件类指定到特定命名空间下

    var init = function(){
        var pageIndex = this.attr('pageIndex') ||'1';
        var pageSize = this.attr('pageSize') ||"25";
        var total = this.attr('total') ||"0";
        var queryParam = this.attr('queryParam') ||'[]';
        var pageInfo = this.attr('pageInfo');
        var showPageNumSize = this.attr('showPageNumSize') ||"10"; //显示页数配置
        var perPageSizeData = this.attr('perPageSizeData');
        if(perPageSizeData){
            perPageSizeData = oui.parseJson(perPageSizeData);
            this.attr('perPageSizeData',perPageSizeData)
        }else{
            this.attr('perPageSizeData',[10,20,50,100]);
        }
        var otherAttrs = this.attr('otherAttrs')||'{}';
        if(otherAttrs=='null'){
            otherAttrs="{}";
        }
        otherAttrs = oui.parseJson(otherAttrs);
        showPageNumSize = parseInt(showPageNumSize);
        if(showPageNumSize ==0){
            showPageNumSize = 10;
        }
        if(pageInfo =='false'){
            pageInfo = false;
        }else{
            pageInfo = true;
        }
        this.attr('pageInfo',pageInfo);
        queryParam = oui.parseJson(queryParam);
        pageIndex = parseInt(pageIndex);
        pageSize = parseInt(pageSize);
        total = parseInt(total);
        var onGo2pageBefore=this.attr('onGo2pageBefore'),onGo2pageError=this.attr('onGo2pageError'),onGo2pageOk=this.attr('onGo2pageOk'),onScroll2Top = this.attr('onScroll2Top');
        if(onGo2pageBefore){
            onGo2pageBefore = win.eval(onGo2pageBefore);
        }
        if(onGo2pageError){
            onGo2pageError = win.eval(onGo2pageError);
        }
        if(onGo2pageOk){
            onGo2pageOk = win.eval(onGo2pageOk);
        }
        if(onScroll2Top){
            onScroll2Top = win.eval(onScroll2Top);
        }
        this.attr({
            pageIndex: pageIndex,
            pageSize: pageSize,
            total: total,
            showPageNumSize:showPageNumSize,
            queryParam:queryParam,
            otherAttrs:otherAttrs,
            onGo2pageBefore:onGo2pageBefore,
            onGo2pageError:onGo2pageError,
            onGo2pageOk:onGo2pageOk,
            onScroll2Top:onScroll2Top
        });
        this.attr('totalPage',this.getTotalPage());//获取总分页数
        this.attr('pageNums',this.getPageNums());//计算能显示的页数

    };

    var pageSizeChange = function (obj){
        var $sel = $(obj);
        var selPageSize = $sel.val();
        this.attr("pageSize", selPageSize);
        this.go2first();
    };

    /**
     * 更新分页
     */
    var updatePageIndex = function(pageIndex){
        pageIndex = pageIndex || this.attr('pageIndex');
        var totalPage = this.getTotalPage();
        if(pageIndex>  totalPage){
            pageIndex  = totalPage;
        }else if(pageIndex<1){
            pageIndex = 1;
        }
        this.attr('pageIndex',pageIndex);
        this.attr('totalPage',totalPage);
        this.attr('pageNums',this.getPageNums());
        //var $El = $(this.getEl());
        //$El.find('.btn-go').find('input[type=text]').val(pageIndex);
        this.render();
    };

    /** 移动端 滚动到顶部的功能 */
    var scroll2top = function(){
        var onScroll2Top = this.attr('onScroll2Top');
        onScroll2Top&& onScroll2Top(this);
        return false;
    };
    /**
     * 获取总页数
     * @returns {*}
     */
    var  getTotalPage = function(){
        var _self = this;
        var total = _self.attr('total');
        var pageSize = _self.attr('pageSize');
        if(total ==0){
            return 0;
        }
        return total % pageSize > 0 ? parseInt(total / pageSize) + 1 : parseInt(total / pageSize);
    };
    /***
     * 翻页 ajax调用
     * @param cfg
     */
    var go2page4ajax = function(cfg){
        var _self = this;
        var pageParamConfig = _self.attr("pageParamConfig");
        var pageParam = {
            beforePageIndex:this.attr('beforePageIndex')||1,
            pageIndex:this.attr('pageIndex'),
            pageSize:this.attr('pageSize'),
            keyData:this.attr('keyData')
        };
        var sortModel = this.attr("sortModel");
        var sortParam = {};
        if (sortModel + '' != 'client') {
            sortParam ={
                sortField:this.attr('sortField'),
                sortOrder:this.attr('sortOrder')
            };
        }
        var param = $.extend(true, {}, pageParam, sortParam, cfg);

        var url = _self.attr("dataUrl");
        if (url && url.length > 0) {
            var otherParam = param.otherParam ;
            url = oui.setParam(url,'otherParam',otherParam);

            var onGo2pageError = _self.attr("onGo2pageError");
            var onGo2pageOk =_self.attr("onGo2pageOk");
            oui.getData(url, param, function (result) {
                result = oui.parseJson(result);
                if (result.success + '' == 'true') {
                    _self.attr({
                        total:result["total"] || 0,
                        keyData:result["keyData"],
                        data:result
                    });
                    _self.updatePageIndex();
                    //_self.render4OuiTable();
                    onGo2pageOk&&onGo2pageOk(_self,result);
                    _self.isLoading = false;
                    _self.triggerUpdate();
                    _self.triggerAfterUpdate();
                } else {
                    onGo2pageError && onGo2pageError(_self,result);
                    _self.isLoading = false;
                }
            }, "加载中...");
        } else {
            oui.alert("请配置数据请求地址...");
            _self.isLoading = false;
        }
    };
    /** 获取中间页数的算法 */
    var getPageNums = function(){

        /*************** 索引页HTML拼装 *****************/
            // 获取页面起始索引，第一页为1
        var startIndex;// 页面索引起始值 例：从第2页开始
        var endIndex;// 页面索引结束值 例 第11页结束

        // 当前页导航要显示在导航栏最中间
        var isOddSize = false;//是否是显示奇数页
        var showPageNumSize = this.attr('showPageNumSize') ||10 ; //页面中显示几页
        if (showPageNumSize % 2 > 0){
            isOddSize = true;
        }
        var pageIndex = this.attr('pageIndex');
        var totalPage = this.getTotalPage();
        // 数据可分的总页数大于，一页默认最大分页数，并且当前页是第一页，并且小于(最大分页数的一半)
        if ((totalPage > showPageNumSize) && (pageIndex <= showPageNumSize / 2 + (isOddSize ? 0 : 1) )) {
            startIndex = 1;
            endIndex = showPageNumSize;
        }else if (totalPage <= showPageNumSize) { //数据可分的总页数不足一页默认最大分页数
            startIndex = 1;
            endIndex = totalPage;
        }else if ((totalPage - pageIndex) < (showPageNumSize / 2 - (isOddSize ? 0 : 1))) {
            //翻页翻到最后时，不增加分页索引了，只移动当前索引，此时当前页不显示在中间，而是在右边
            startIndex = totalPage - showPageNumSize + 1;
            endIndex = totalPage;
            //中间通用情况
        }else {
            if (!isOddSize) {// 偶数页
                startIndex = pageIndex - parseInt(showPageNumSize / 2);
                endIndex = pageIndex + parseInt(showPageNumSize / 2) - 1;
            } else {
                startIndex = pageIndex - parseInt(showPageNumSize / 2);
                endIndex = pageIndex + parseInt(showPageNumSize / 2);
            }
        }
        var arr = [];
        for (var n = startIndex; n <= endIndex; n++) {
            arr.push(n);
            //if (pageIndex == n) {
            //    arr.push("	<strong><span class=\"oui-pager-num\">" + n + "</span></strong>");
            //}else{
            //    arr.push("	<a  ><span class=\"oui-pager-num\">" + n + "</span></a>");
            //}
        }
        return arr;
    };
    ///**
    // * 为oui-table 渲染
    // */
    //var render4OuiTable = function(){
    //    var tableId = this.attr('tableId');
    //    if(!tableId){
    //        return ;
    //    }
    //    var table = oui.getById(tableId);
    //    if(table ==null){
    //        return ;
    //    }
    //    table.renderByPager&& table.renderByPager(this,this.attr('data')||{});
    //};
    /**
     * 跳转到当前页
     */
    var go2currPage = function(){
        this.go2page(this.attr('pageIndex') || 1);
    };
    /** 转向到指定页 **/
    var go2page = function(pageIndex){
        if(this.isLoading){
            return ;
        }
        this.isLoading = true;
        var onGo2pageBefore = this.attr('onGo2pageBefore');
        this.attr('beforePageIndex',this.attr('pageIndex'));
        if(onGo2pageBefore){
            var isGo2page = onGo2pageBefore(this,this.attr('pageIndex'));
            if(typeof isGo2page =='boolean'){
                if(!isGo2page){
                    this.isLoading = false;
                    return ;
                }
            }
        }
        var dataUrl = this.attr('dataUrl');
        if(!dataUrl){
            this.updatePageIndex(pageIndex);
            var onGo2pageOk = this.attr('onGo2pageOk');
            //this.render4OuiTable();
            onGo2pageOk&&onGo2pageOk(this,this.attr('data'));
            this.isLoading = false;
            this.triggerUpdate();
            this.triggerAfterUpdate();
            return ;
        }
        this.attr('pageIndex',pageIndex);

        this.go2page4ajax({
            otherParam:pageIndex,
            //otherAttrs:this.attr('otherAttrs'), //前端往后端发送otherAttrs
            queryParam:oui.parseString(this.attr('queryParam')||[])
        });
    };
    /***
     * 回到第一页
     */
    var go2first = function(){
        this.go2page(1);
    };
    /**
     * 回到上一页
     */
    var go2prev=function(){
        var pageIndex = this.attr('pageIndex');
        this.go2page((pageIndex - 1) || 1);
    };
    /**
     * 回到下一页
     */
    var go2next=function(){
        var pageIndex = this.attr('pageIndex');
        var maxPage = this.getTotalPage();
        var nextPage;
        if(pageIndex+1> maxPage){
            nextPage = maxPage;
        }else{
            nextPage = pageIndex+1;
        }
        this.go2page(nextPage);
        return false;
    };
    /**
     * 回到最后一页
     */
    var go2end = function(){
        var maxPage = this.getTotalPage();
        this.go2page(maxPage);
    };
})(window, window.oui, window.jQuery);





