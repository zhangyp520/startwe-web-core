/**
 * Created by oui on 2016/4/6.
 *
 */
(function ($, doc, oui) {

    var SelectPersonUI = {
        renders: {}
    };

    var templateHTML = [];
    //liActive
    templateHTML['spTabsTpl'] =
        '{{each data as tab index}}\
            <div>\
                <label class="selectcheckbox">\
                    {{if tab.enableCheck }}\
                            <div class="selectperson-checkbox">\
                                <input type="checkbox">\
                                <i class="selected-icon"></i>\
                            </div>\
                    {{/if}}\
                </label>\
                <div class="selectInfo" link="#/{{=tab.key}}/" key="{{=tab.key}}">\
                    <span class="selectportrait {{=tab.icon}}-icon">&nbsp;</span>\
                    <span class="selectFlex">{{tab.name }}</span>\
                    <i class="select-user-info"></i>\
                </div>\
            </div>\
        {{/each}}';


    //onclick="oui.SelectPerson.optionChange(this,\'{{item.typeFlag}}\')"
    //<span>（兼）积木云产品与运营组</span>\
    templateHTML['spSelectTpl'] =
        '{{if data.length > 0}}\
            {{each data as item index}}\
                {{if item.typeFlag != "person" && item.typeFlag != "contact" && item.typeFlag != "relativeRole" && oui.ORG_TYPE_ENUM[item.typeFlag]}}\
                    <div>\
                        <label class="selectcheckbox" for="sp_{{item.id}}">\
                            {{if selectPerson.checkSelectType(item)}}\
                                {{if item.level == 0 }}\
                                <div class="selectperson-checkbox" itemId="{{item.id}}" id="allSelectedCheckbox">\
                                    <input id="sp_{{item.id}}" onchange="oui.SelectPerson.checkChange(this,{{oui.parseString(item)}})" type="checkbox" {{if selectPerson.isSelected(item)}}checked="checked"{{/if}} >\
                                    <i class="selected-icon"></i>\
                                </div>\
                                {{else}}\
                                <div class="selectperson-checkbox">\
                                    <input id="sp_{{item.id}}" onchange="oui.SelectPerson.checkChange(this,{{oui.parseString(item)}})" type="checkbox" {{if selectPerson.isSelected(item)}}checked="checked"{{/if}} >\
                                    <i class="selected-icon"></i>\
                                </div>\
                                {{/if}}\
                            {{/if}}\
                        </label>\
                        {{if item.typeFlag == "department" || item.typeFlag == "company"}}\
                            <div toView="spR" class="selectInfo" spData=\'{{oui.parseString(item)}}\' link="#/department/spData/" >\
                                <span class="selectportrait depart-icon">&nbsp;</span>\
                                <span class="selectFlex">{{item.name}}</span>\
                                <i class="select-user-info"></i>\
                            </div>\
                        {{else}}\
                            <div toView="spR" class="selectInfo" spData=\'{{oui.parseString(item)}}\' link="{{if item.typeFlag=="team"}}#/team/spData/{{else}}#/child/spData{{/if}}" >\
                                {{if item.typeFlag=="team"}}\
                                <span class="selectportrait team-icon">&nbsp;</span>\
                                {{else}}\
                                <span class="selectportrait userIcon-bgColor-{{oui.SelectPerson.getIconBgNum(item)}}">{{item.name.substring(0,1)}}</span>\
                                {{/if}}\
                                <span class="selectFlex">{{item.name}}</span>\
                                <i class="select-user-info"></i>\
                            </div>\
                        {{/if}}\
                    </div>\
                {{else}}\
                    <div>\
                        <label class="selectcheckbox" for="sp_{{item.id}}">\
                            {{if selectPerson.checkSelectType(item)}}\
                                <div class="selectperson-checkbox">\
                                    <input id="sp_{{item.id}}" onchange="oui.SelectPerson.checkChange(this,{{oui.parseString(item)}})" type="checkbox" {{if selectPerson.isSelected(item)}}checked="checked"{{/if}} >\
                                    <i class="selected-icon"></i>\
                                </div>\
                            {{/if}}\
                        </label>\
                        <div toView="spR" class="selectInfo" spData=\'{{oui.parseString(item)}}\' {{if selectPerson.checkSelectType(item)}}onclick="oui.SelectPerson.optionChange(this,\'{{item.typeFlag}}\')"{{/if}}>\
                            {{if item.typeFlag == "relativeRole"}}\
                            <span class="selectportrait userIcon-bgColor-{{oui.SelectPerson.getIconBgNum(item)}}">{{item.name.substring(0,1)}}</span>\
                            {{else}}\
                            <span class="selectportrait userIcon-bgColor-{{oui.SelectPerson.getIconBgNum(item)}}">{{item.name.substring(0,1)}}</span>\
                            {{/if}}\
                            <span class="selectFlex">{{item.name}}</span>\
                        </div>\
                    </div>\
                {{/if}}\
            {{/each}}\
        {{else}}\
            <span class="no_sp_data"><i>暂无信息</i></span>\
        {{/if}}';

    templateHTML['spLFTpl'] = templateHTML['spLT4ContactTpl'] = templateHTML['spSelectTpl'];

    templateHTML['spSelectedTpl'] =
        '{{each data as item index}}\
            <li id="sp_selected_{{item.id}}" onclick="oui.SelectPerson.removeItem({{oui.parseString(item)}})">\
                {{if item.typeFlag=="team"}}\
                    <span class="userimg team-icon">&nbsp;</span>\
                {{else if item.typeFlag=="department"}}\
                    <span class="userimg depart-icon">&nbsp;</span>\
                {{else if item.typeFlag=="relativeRole"}}\
                    <span class="userimg userIcon-bgColor-{{oui.SelectPerson.getIconBgNum(item)}}">{{item.name.substring(0,1)}}</span>\
                {{else}}\
                    <span class="userimg userIcon-bgColor-{{oui.SelectPerson.getIconBgNum(item)}}">{{item.name.substring(0,1)}}</span>\
                {{/if}}\
                <span class="username">{{item.name}}</span>\
            </li>\
        {{/each}}';

    templateHTML['spNavigationTpl'] =
        '{{each data as item index}}\
        {{if index != (data.length-1) || data.length == 1}}\
        <span link="{{item.linkTo}}" spData="{{oui.parseString(item.spData)}}"><i>{{item.name}}</i></span>{{if data.length != 1}}&gt;{{/if}}\
        {{else}}\
        <span>{{item.name}}</span>\
        {{/if}}\
        {{/each}}\
        ';

    templateHTML['spOptionTpl'] =
        '{{if data.isFlow || data.isFlow=="true" || data.isFlow == true}}\
            <div>\
                <button onclick="oui.SelectPerson.click2Ok(0);">并发</button>\
            </div>\
            <div>\
                <button onclick="oui.SelectPerson.click2Ok(1);">串发</button>\
            </div>\
        {{else}}\
            <div>\
                <button onclick="oui.SelectPerson.click2Ok();">确认</button>\
            </div>\
        {{/if}}';

    templateHTML['spSearchSelectTpl'] =
        '{{if data && data.length > 0}}' +
        '{{each data as item index}}\
             <div>\
                <label class="selectcheckbox" for="sp_s_{{item.id}}">\
                    <div class="selectperson-checkbox">\
                        <input id="sp_s_{{item.id}}" sp_search="true" onchange="oui.SelectPerson.checkChange(this,{{oui.parseString(item)}})" type="checkbox" {{if selectPerson.isSelected(item)}}checked="checked"{{/if}} >\
                        <i class="selected-icon"></i>\
                    </div>\
                </label>\
                <div toView="spR" class="selectInfo" spData=\'{{oui.parseString(item)}}\' onclick="oui.SelectPerson.optionChange(this,\'{{item.typeFlag}}\')" >\
                    <span class="selectportrait userIcon-bgColor-{{oui.SelectPerson.getIconBgNum(item)}}">{{item.name.substring(0,1)}}</span>\
                    <span class="selectFlex">{{item.name}}</span>\
                </div>\
            </div>\
        {{/each}}\
        {{else}}\
        <span class="no_sp_data"><i>暂无信息</i></span>\
        {{/if}}\
        ';

    templateHTML['spSearchHistoryTpl'] =
        '<div class="search-history">搜索记录</div>'
        + templateHTML['spSearchSelectTpl'] +
        '<button onclick="oui.SelectPerson.clearSearchHistory()" class="clear-history">清除历史记录</button>\
        ';

    /**
     * 初始化UI
     */
    SelectPersonUI.init = function (selectPerson) {
        template.helper("console", console);
        template.helper("oui", oui);
        template.helper("Math", Math);
        template.helper("selectPerson", selectPerson);
        template.helper("encodeURIComponent", encodeURIComponent);

        this.SelectPerson = selectPerson;

        this.initDom();

        this.initUI();

        this.initEvents();
    };


    /**
     * 初始化界面
     */
    SelectPersonUI.initUI = function () {
        this.render("spOption", {isFlow: this.SelectPerson.options.isFlow});
    };


    /**
     * 根据Key和数据渲染html结构
     * @param key
     * @param data
     * @param noReplace
     */
    SelectPersonUI.render = function (key, data, noReplace) {
        var renderFunc = this.renders[key];
        if (!renderFunc) {
            renderFunc = template.compile(templateHTML[key + "Tpl"]);
            this.renders[key] = renderFunc;
        }

        if (key.indexOf("4") > 0) {
            key = key.substring(0, key.indexOf('4'));
        }
        var html = renderFunc({data: data});
        if (!noReplace) {
            this[key + "View"].html(renderFunc({data: data}));
        }
        return html;
    };

    /**
     * 初始化dom接口
     */
    SelectPersonUI.initDom = function () {
        //选人盒子
        this.spContentView = $(".selectwrap");

        this.spMainView = this.spContentView.find("#spMainView");

        this.spSearchLayerView = this.spContentView.find("#spSearchView");

        this.spNavigationView = this.spContentView.find(".selectOrganize-name .organize");


        //tab区域
        this.spTabsView = this.spMainView.find("#sp_tabContent");

        //待选区
        this.spSelectView = this.spMainView.find("#sp_tabContent");
        this.spLFView = this.spSelectView;


        this.spSearchBtnView = this.spMainView.find(".selectSearch");
        this.spSearchBtn = this.spSearchBtnView.find(".search-btn");

        //搜素dom结构
        this.spSearchView = this.spSearchLayerView.find(".selectSearch");
        this.spSearchInput = this.spSearchView.find("input");
        this.spSearchConfirmBtn = this.spSearchView.find(".search-submit");
        this.spSearchCancleBtn = this.spSearchView.find(".search-cancle");

        //搜索待选区
        this.spSearchSelectView = this.spSearchLayerView.find(".searchmain");
        this.spSearchHistoryView = this.spSearchSelectView;


        this.spFView = this.spContentView.find(".selectFooter");

        this.spDeleteTips = this.spFView.find(".delete-tips");

        this.spSelectedView = this.spFView.find(".selectActive-user ul");

        //串联并联选择区域
        this.spOptionView = this.spFView.find(".selectOption");
    };

    /**
     * 绑定事件
     */
    SelectPersonUI.initEvents = function () {
        var self = this;
        var $obj = null, link;

        self.spContentView.on("click", "[link]", function () {
            $obj = $(this);
            var link = $obj.attr("link");
            self.SelectPerson.linkTo(link, $obj);
            return false;
        });

        self.spSearchBtn.on("click", function () {
            self.SelectPerson.linkTo("#/search/");
            return false;
        });

        self.spSearchConfirmBtn.on("click", function () {
            self.SelectPerson.search();
            return false;
        });

        self.spSearchCancleBtn.on("click", function () {
            self.SelectPerson.linkTo("#/closeSearch/");
            return false;
        });
    };


    oui.SelectPersonUI = SelectPersonUI;

})(jQuery, document, oui);





