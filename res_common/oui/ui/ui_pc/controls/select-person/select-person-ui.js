/**
 * Created by oui on 2016/4/6.
 */
(function ($, doc, oui) {

    var SelectPersonUI = {
        renders: {}
    };

    var templateHTML = [];

    //liActive
    templateHTML['spTabsTpl'] = '{{each data as tab index}}<li onclick="oui.SelectPerson.tabChange(this);" key="{{=tab.key}}">{{tab.name }}<i class="selectriangle-left"></i></li>{{/each}}';

    templateHTML['spLT4departmentTpl'] = '<ul id="departmentTree" class="ztree"></ul>';

    templateHTML['spLT4roleTpl'] = '<ul id="roleTree" class="ztree"></ul>';

    templateHTML['spLT4teamTpl'] = '{{if data.length > 0}}\
                                    <select toView="spR" onchange="oui.SelectPerson.optionChange(this,\'team\')" multiple="multiple">\
                                    {{each data as item index}}\
                                    <option title="{{item.name}}" spData=\'{{oui.parseString(item)}}\'>\
                                        {{item.name}}\
                                    </option>\
                                    {{/each}}\
                                    </select>\
                                    {{else}}\
                                    <span class="no_sp_data"><i>暂无群组信息</i></span>\
                                    {{/if}}';
    templateHTML["spLT4relativeRoleTpl"] =
        '<div class="selectPerson-info"><i class="selectPerson-info-icon">i</i>组织架构中设置部门主管</div>\
        {{if data.length > 0}}\
        <select toView="spR" style="top: 30px;" onclick="oui.SelectPerson.optionChange(this,\'relativeRole\')" multiple="multiple">\
        {{each data as item index}}\
        <option title="{{item.name}}" spData=\'{{oui.parseString(item)}}\'>\
            {{item.name}}\
        </option>\
        {{/each}}\
        </select>\
        {{else}}\
        <span class="no_sp_data"><i>暂无相对角色</i></span>\
        {{/if}}';
    templateHTML['spLT4ContactTpl'] = '{{if data.length > 0}}\
                                    <select toView="spR" onchange="oui.SelectPerson.optionChange(this,\'contact\')" multiple="multiple">\
                                    {{each data as item index}}\
                                    <option title="{{item.name}}" spData=\'{{oui.parseString(item)}}\'>\
                                        {{item.name}}\
                                    </option>\
                                    {{/each}}\
                                    </select>\
                                    {{else}}\
                                    <span class="no_sp_data"><i>暂无联系人</i></span>\
                                    {{/if}}';

    templateHTML['spLT4ExtendTpl'] = '{{if data.des && data.des.length > 0}}<div class="selectPerson-info"><i class="selectPerson-info-icon">i</i>{{data.des}}</div>{{/if}}\
                                {{if data.result.length > 0}}\
                                <select toView="spR" {{if data.des && data.des.length > 0}} style="top:30px;" {{/if}} onchange="oui.SelectPerson.optionChange(this,\'{{data.type}}\')" multiple="multiple">\
                                {{each data.result as item index}}\
                                <option title="{{item.name}}" spData=\'{{oui.parseString(item)}}\'>\
                                    {{item.name}}\
                                </option>\
                                {{/each}}\
                                </select>\
                                {{else}}\
                                <span class="no_sp_data"><i>暂无{{data.name}}</i></span>\
                                {{/if}}';

    templateHTML['spLFTpl'] = '{{if data.result.length > 0}}\
                                <select toView="spR"  onchange="oui.SelectPerson.optionChange(this,\'{{data.type}}\')" onclick="oui.SelectPerson.optionChange(this,\'{{data.type}}\')" multiple="multiple">\
                                {{each data.result as item index}}\
                                <option title="{{item.name}}" spData=\'{{oui.parseString(item)}}\'>\
                                    {{item.name}}\
                                </option>\
                                {{/each}}\
                                </select>\
                                {{else}}\
                                <span class="no_sp_data"><i>暂无人员信息</i></span>\
                                {{/if}}';

    templateHTML['spSelectedTpl'] = '{{each data as item index}}\
                                    <dd spData="{{item.id}}" class="{{isFillback ? \'selected-fillback\':\'\'}}">\
                                        <p class="selected-item-icon {{item.typeFlag}}-icon"></p>\
                                        <span title="{{item.name}}">{{item.name}}</span>\
                                        <i name="deleteItem" onclick="oui.SelectPerson.optionDbClick(this,{{oui.parseString(item)}})"></i>\
                                    </dd>\
                                    {{/each}}';


    /**
     * 初始化UI
     */
    SelectPersonUI.init = function (selectPerson) {
        template.helper("console", console);
        template.helper("oui", oui);
        template.helper("selectPerson", selectPerson);

        this.SelectPerson = selectPerson;

        this.initDom();

        this.initUI();

        this.initEvents();
    };


    /**
     * 初始化界面
     */
    SelectPersonUI.initUI = function () {
        if (this.SelectPerson.options.isFlow === true) {
            this.spOptionView.show();
        }
    };


    /**
     * 根据Key和数据渲染html结构
     * @param key
     * @param data
     * @param noReplace
     * @param extendData 扩展数据
     */
    SelectPersonUI.render = function (key, data, noReplace, extendData) {
        var renderFunc = this.renders[key];
        if (!renderFunc) {
            renderFunc = template.compile(templateHTML[key + "Tpl"]);
            this.renders[key] = renderFunc;
        }

        if (key.indexOf("4") > 0) {
            key = key.substring(0, key.indexOf('4'));
        }
        var dataConfig = {data: data};
        if(extendData){
            dataConfig = $.extend(true, {}, {data: data}, extendData);
        }
        var html = renderFunc(dataConfig);
        if (!noReplace) {
            this[key + "View"].html(html);
        }
        return html;
    };

    /**
     * 初始化dom接口
     */
    SelectPersonUI.initDom = function () {
        //选人盒子
        this.spContentView = $(".selectPerson-cont-2");

        //tab区域
        this.spTabsView = this.spContentView.find(".selectPerson-tabs ul");

        //上下中间区域
        this.spMidView = this.spContentView.find(".selectPerson-mid");

        //搜素dom结构
        this.spSearchView = this.spMidView.find(".selectPerson-search");
        this.spSearchInput = this.spSearchView.find("input");
        this.spSearchbtn = this.spSearchView.find("button.selectPerson-search-btn");
        this.spSearchDelbtn = this.spSearchView.find("button.selectPerson-delete-btn");

        //左边区域
        this.spLView = this.spMidView.find(".selectPerson-mid-item-l");
        this.spLTView = this.spLView.find(".l-top .person-item");
        //this.spLmView = this.spLView.find(".l-middle");
        this.spLFView = this.spLView.find(".l-footer .person-item");

        //右边区域
        this.spRView = this.spMidView.find(".selectPerson-mid-item-r .person-item");

        //选中UI区域
        this.spSelectedView = this.spRView.find("#selected-ul-view");

        //下边区域
        this.spFView = this.spContentView.find(".selectPerson-footer");

        //串联并联选择区域
        this.spOptionView = this.spContentView.find(".select-option");

        //操作区域
        this.spOperationView = this.spFView.find(".selectPerson-footer-operation");
        this.spOKBtn = this.spOperationView.find(".selectPerson-ok");
        this.spCancelBtn = this.spOperationView.find(".selectPerson-cancel");
        this.spCloseBtn = this.spContentView.find(".selectPerson-close");
        this.spL2RArrowBtn = $(this.spContentView.find(".selectPerson-arrow").find("span")[0]);

        this.spArrowUp = this.spContentView.find(".selectPerson-arrow-up");
        this.spArrowDown = this.spContentView.find(".selectPerson-arrow-down");
    };

    /**
     * 绑定事件
     */
    SelectPersonUI.initEvents = function () {
        var self = this;
        this.spOKBtn.on("click", function () {
            self.SelectPerson.click2Ok();
        });

        this.spCancelBtn.on("click", function () {
            self.SelectPerson.click2Cancel();
        });

        this.spCloseBtn.on("click", function () {
            self.SelectPerson.click2Cancel();
        });

        this.spL2RArrowBtn.on("click", function () {
            self.SelectPerson.click4L2R();
        });

        this.spArrowUp.on("click", function () {
            self.SelectPerson.click4arrowUp();
        });

        this.spArrowDown.on("click", function () {
            self.SelectPerson.click4arrowDown();
        });

        this.spSearchInput.on("keypress", function (event) {
            var keycode = event.keycode || event.which;
            if (keycode === "13") {
                self.SelectPerson.search();
            }
        });

        this.spSearchbtn.on("click", function () {
            var val = self.spSearchInput.val();
            if(val){
                self.SelectPerson.search();
                $(this).hide();
                self.spSearchDelbtn.show();
            }
        });

        this.spSearchDelbtn.on("click",function () {
            self.SelectPerson.clearSearch();
            $(this).hide();
            self.spSearchbtn.show();
        });

        //选中区域拖动排序事件
        this.spSelectedView.sortable({
            axis: "y",
            containment: "parent",
            placeholder: "sp-ui-state-highlight",
            forcePlaceholderSize: true,
            scroll: true,
            tolerance: "pointer",
            update: function (event, ui) {
                self.SelectPerson.sortUpdate(event, ui);
            }
        }).disableSelection();
    };


    oui.SelectPersonUI = SelectPersonUI;

})(jQuery, document, oui);





