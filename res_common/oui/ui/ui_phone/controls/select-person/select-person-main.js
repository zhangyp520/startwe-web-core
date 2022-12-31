/**
 * Created by oui on 2016/4/6.
 *
 */
(function ($, doc, oui, Biz, UI) {

    var tabsData = [
        {
            key: 'team',
            name: '组',
            icon: 'team',
            enableCheck: false
        },
        {
            key: 'contact',
            name: '联系人',
            icon: 'contact',
            enableCheck: false
        },
        {
            key: 'department',
            name: '部门',
            icon: 'depart',
            enableCheck: false
        },
        {
            key: "relativeRole",
            name: "相对角色",
            icon: 'relative',
            enableCheck: false
        },
        {
            key: "role",
            name: "角色",
            icon: 'role',
            enableCheck: false
        }
        //{
        //    key: 'level',
        //    name: '职务级别'
        //},
        //{
        //    key: "role",
        //    name: "角色"
        //},
        //{
        //    key: "post",
        //    name: "岗位"
        //},
        //{
        //    key: 'orgTeam',
        //    name: '组'
        //},

    ];

    var SP_SEARCH_TYP_ENUM = {
        TEAM_PERSON: 'team_person',//团队选人
        ORG_PERSON: 'org_person'//组织机构选人
    };

    var SelectPerson = {};

    /**
     * 选人类型枚举
     * @type {{COMMON: number, FLOW: number}}
     */
    SelectPerson.TypeEnum = {
        COMMON: 0,//普通选人
        FLOW: 1//流程选人
    };


    /**
     * 组件初始化
     */
    SelectPerson.init = function (options) {

        $.extend(this, {
            selectMap: {},
            selectedItems: [],
            isSearch: false,
            navigationData: [
                {
                    name: "组织机构",
                    linkTo: "#/home/"
                }
            ]
        });

        Biz.clearCache();

        this.options = $.extend({}, options);

        //初始化UI界面
        UI.init(this);

        var showType = this.options.showType;
        if (showType + '' === '4') {
            UI.spSearchBtnView.hide();
        }

        window.location.hash = "#/selectPerson";

        this.initHashChange();
        this.linkTo("#/home/");

        //初始化数据回填
        this.initFillBack();

        //初始化完成回调
        this.options.afterInit(UI);
        this.isFristClick2department = true;
    };

    var closeSelectPerson = function () {
        if (window.location.href.indexOf("#/selectPerson") < 0) {
            SelectPerson.close();
        }
    };

    SelectPerson.initHashChange = function () {
        window.addEventListener("hashchange", closeSelectPerson, false);
    };


    /**
     * 点击选择部门
     */
    SelectPerson.click2department = function () {
        var self = this;
        self.setCurrentSelectType(SP_SEARCH_TYP_ENUM.ORG_PERSON);
        //判断当前是否使用当前用户部门id
        var rangeId = self.options.rangeId+'';
        var type = oui.ORG_TYPE_ENUM.company;
        var showType = self.options.showType;
        var id = null;
        var isOnlyRange = self.options.onlyRange + '' === 'true';
        if(isOnlyRange){//是否限定范围
            if (rangeId && rangeId !== oui.RANGE_TYPE.company && rangeId !== oui.RANGE_TYPE.currentDept) {
                type = oui.ORG_TYPE_ENUM.department;
                id = rangeId;
            } else if (rangeId === oui.RANGE_TYPE.currentDept) {
                type = oui.ORG_TYPE_ENUM.department;
                id = currentDepartmentID;
            }
        } else {
            if (rangeId && rangeId !== oui.RANGE_TYPE.company && rangeId !== oui.RANGE_TYPE.currentDept) {
                id = rangeId;
            } else if (rangeId === oui.RANGE_TYPE.currentDept) {
                id = currentDepartmentID;
            }
        }

        Biz.getOrg(type, id, function (result) {
            if (result && result.length > 0 && type === oui.ORG_TYPE_ENUM.company) {
                result[0]["level"] = 0;//如果是公司则指定第一个层级为公司，可以用作全体人员选择
            }
            if (!isOnlyRange && id !== null && id.length > 0 && self.isFristClick2department) {
                var parentsArray = Biz.getParentsById(id, []);
                var item = null;
                for (var i = parentsArray.length - 1; i >= 0; i--) {
                    item = parentsArray[i];
                    var newItem = $.extend(true, {}, item, {children: (item.children && item.children.length)});
                    self.navigation.add({name: newItem.name, linkTo: "#/department/spData/", spData: newItem});
                }
                self.isFristClick2department = false;
                Biz.getChildOrgByOrg({
                    id:id,
                    typeFlag:oui.ORG_TYPE_ENUM.department
                }, function (res) {
                    UI.render("spLF", res);
                }, showType + '' === '4');
            } else {
                UI.render("spLF", result);
            }
        }, null, true);
    };

    /**
     * 相对角色
     */
    SelectPerson.click2relativeRole = function () {
        this.setCurrentSelectType(SP_SEARCH_TYP_ENUM.ORG_PERSON);
        Biz.getRelativeRoles(function (result) {
            UI.render("spLF", result);
        });
    };

    /**
     * 自定义角色
     */
    SelectPerson.click2role = function(){
        this.setCurrentSelectType(SP_SEARCH_TYP_ENUM.ORG_PERSON);
        Biz.getOrg(oui.ORG_TYPE_ENUM.role, null, function (result) {
            UI.render("spLF", result);
        }, null, true);
    };

    /**
     * 第三方 userID 转为 oui 帐号ID
     * @param selectedResult
     * @param callback
     */
    SelectPerson.userId2AccountId = function (selectedResult, callback) {
        var filterSelf = (this.options.filterSelf + "" !== "false");
        var showType = this.options.showType;
        if (showType >= 3) {//如果为组织机构选人，需要走检查转换ID
            Biz.userId2AccountId(selectedResult, filterSelf, function (result) {
                callback && callback(result.data);
            });
        } else {
            //不需要转换ID
            callback && callback(selectedResult);
        }
    };

    /**
     * oui 帐号ID 转为第三方 userID
     * @param sourceData
     * @param callback
     */
    SelectPerson.accountId2UserId = function (sourceData, callback) {
        //扫描登陆转
        var showType = this.options.showType;
        if (showType >= 3 && (sourceData[0].typeFlag !== oui.ORG_TYPE_ENUM.all)) {//如果为组织机构选人，需要走检查转换ID
            callback && callback(sourceData);
            //FIXME  用我们自己的选人不需要将ouiId 转成 第三方的ID
            // Biz.accountId2userId(sourceData, function (result) {
            //     callback && callback(result);
            // });
        } else {
            if (sourceData[0].typeFlag === oui.ORG_TYPE_ENUM.all) {
                SelectPerson.orgId = sourceData[0].id;
            }
            //不需要转换ID
            callback && callback(sourceData);
        }
    };

    /**
     * 初始化回填数据
     */
    SelectPerson.initFillBack = function () {
        var self = this;
        var fillBack = this.options.fillback;
        if (fillBack && fillBack.length > 0) {
            self.accountId2UserId(fillBack, function (result) {
                fillBack = result;
                var len = fillBack.length, i, orgObj;
                for (i = 0; i < len; i++) {
                    orgObj = fillBack[i];
                    SelectPerson.selectMap[orgObj.id] = orgObj;
                }
                self.renderSelectedView(fillBack);
            });
        }
    };

    /**
     * 路由跳转地址
     * @param link
     * @param $el
     */
    SelectPerson.linkTo = function (link, $el) {
        var self = this;
        if (self.isSearch) {
            self.hideSearchLayer();
            self.isSearch = false;
            return;
        }
        var item = null;
        switch (link) {
            case "#/":
                if (self.isSearch) {
                    self.hideSearchLayer();
                    self.isSearch = false;
                    return;
                }
                self.click2Cancel();
                break;
            case "#/team/spData/":
                item = $el.attr('spData');
                item = oui.parseJson(item);
                self.navigation.add({name: item.name});
                Biz.getPersonByOrgObj(item, function (res) {
                    UI.render("spLF", res);
                });
                break;
            case "#/child/spData":
                item = $el.attr('spData');
                item = oui.parseJson(item);
                self.navigation.add({name: item.name});
                Biz.getPersonByOrgObj(item, function (res) {
                    UI.render("spLF", res);
                });
                break;
            case "#/contact/":
                self.navigation.clear().add({name: '联系人', linkTo: "#/contact/"});
                self.click2contact();
                break;
            case "#/search/":
                self.showSearchLayer();
                self.isSearch = true;
                break;
            case "#/closeSearch/":
                self.hideSearchLayer();
                self.isSearch = false;
                break;
            case "#/department/":
                self.navigation.clear().add({name: '部门', linkTo: "#/department/"});
                self.click2department();
                break;
            case "#/department/spData/":
                item = $el.attr('spData');
                item = oui.parseJson(item);
                var newItem = $.extend(true, {}, item, {children: (item.children && item.children.length)});
                if ($el.parent().hasClass("organize")) { //如果是导航的点击则清楚当前导航后的导航
                    self.navigation.removeByIndex($el.index());
                }
                self.navigation.add({name: newItem.name, linkTo: "#/department/spData/", spData: newItem});
                var showType = self.options.showType;
                //获取子部门和当前部门的人
                Biz.getChildOrgByOrg(newItem, function (res) {
                    UI.render("spLF", res);
                }, showType + '' === '4');
                break;
            case "#/relativeRole/":
                self.navigation.clear().add({name: '相对角色', linkTo: "#/relativeRole/"});
                self.click2relativeRole();
                break;
            case "#/role/":
                self.navigation.clear().add({name: '自定义角色', linkTo: "#/role/"});
                self.click2role();
                break;
            case "#/home/":
            default :
                var tempLink = link.replace("#/", "").replace("/", "");
                tempLink = "click2" + tempLink;
                if (SelectPerson[tempLink]) {
                    SelectPerson[tempLink]();
                } else {
                    self.initTabs();
                    self.initExtendTabClick();
                    self.currentByType = "";
                    self.navigation.clear();
                }
                break;

        }

    };

    /**
     * 初始化tab
     */
    SelectPerson.initTabs = function () {
        var self = this,
            showTabs = [],
            showType = this.options.showType,
            i,
            showTabsIndexStr = this.options.tabs,
            showTabsIndexArray = showTabsIndexStr.split(","),
            len = showTabsIndexArray.length,
            _tabIndex;

        for (i = 0; i < len; i++) {
            _tabIndex = showTabsIndexArray[i];
            _tabIndex = parseInt(_tabIndex);
            if (_tabIndex) {
                var _tabData = tabsData[_tabIndex - 1];
                if (_tabData) {
                    if (showType < 3) {// 只能选择团队的时候
                    } else if (showType >= 3) {//只能选择组织机构
                        if (_tabIndex !== 1 && _tabIndex !== 2) {
                            showTabs.push(_tabData);
                        }
                    }
                }
            }
        }

        if (self.options.extend && self.options.extend.tabs && self.options.extend.tabs.length > 0) {
            var extendTabs = self.options.extend.tabs;
            var tab = null, eTab = null;
            for (i = 0, len = extendTabs.length; i < len; i++) {
                eTab = extendTabs[i];
                tab = {
                    key: eTab.type,
                    name: eTab.title,
                    icon: eTab.icon
                };
                showTabs.push(tab);
            }
        }

        UI.render('spTabs', showTabs);
    };

    SelectPerson.initExtendTabClick = function () {
        var self = this;
        if (self.options.extend && self.options.extend.tabs && self.options.extend.tabs.length > 0) {
            var extendTabs = self.options.extend.tabs;
            var eTab = null, i, len;
            for (i = 0, len = extendTabs.length; i < len; i++) {
                eTab = extendTabs[i];
                SelectPerson["click2" + eTab.type] = (function (eTab) {
                    return function () {
                        self.navigation.clear().add({name: eTab.title, linkTo: "#/" + eTab.type + "/"});
                        this.setCurrentSelectType(eTab.type, eTab.type);
                        Biz.getDataByExtendTab(eTab, function (data) {
                            UI.render("spLF", data);
                        });
                        return false;
                    }
                })(eTab);
            }
        }
    };


    /**
     * 设置当前选择的类型为搜索做好准备
     * @param searchType searchType
     * @param byType byType
     */
    SelectPerson.setCurrentSelectType = function (searchType, byType) {
        this.currentSelectType = searchType;
        if (byType) {
            this.currentByType = byType;
        }
        UI.spSearchInput.val("");
    };

    /**
     * 导航操作
     * @type {{add: Function, remove: Function, render: Function}}
     */
    SelectPerson.navigation = {
        add: function (item) {
            SelectPerson.navigationData.push(item);
            this.render();
            return this;
        },
        removeByIndex: function (index) {
            SelectPerson.navigationData.splice(index, SelectPerson.navigationData.length - index);
            return this;
        },
        remove: function () {
            SelectPerson.navigationData.splice(SelectPerson.navigationData.length - 1, 1);
            this.render();
            return this;
        },
        clear: function () {
            SelectPerson.navigationData = [{name: '组织机构', linkTo: "#/home/"}];
            this.render();
            return this;
        },
        render: function () {
            UI.render("spNavigation", SelectPerson.navigationData);
            return this;
        }
    };


    /**
     * 搜索历史纪录操作对象
     * @type {{add: Function, clear: Function, get: Function}}
     */
    SelectPerson.searchHistory = {
        add: function (item) {
            //var historyData = this.get();
            //for (var i = 0, len = historyData.length; i < len; i++) {
            //    if (item.id == historyData[i].id) {
            //        return;
            //    }
            //}
            //historyData.push(item);
            //if (historyData.length > 10) {
            //    historyData.splice(0, 1);
            //}
            //historyData = oui.parseString(historyData);
            //oui.storage.save(SP_HISTORY_KEY, historyData);

        },
        clear: function () {
            //oui.storage.save(SP_HISTORY_KEY, "[]");
        },
        get: function () {
            //var historyData = oui.storage.get(SP_HISTORY_KEY);
            //historyData = oui.parseJson(historyData);
            //if (!(historyData instanceof Array)) {
            //    historyData = [];
            //}
            return [];
        }
    };

    /**
     * 清除搜索历史纪录
     */
    SelectPerson.clearSearchHistory = function () {
        SelectPerson.searchHistory.clear();
        UI.render("spSearchSelect", []);
    };

    /**
     * 显示搜索层
     */
    SelectPerson.showSearchLayer = function () {
        var showType = this.options.showType;
        var byType = this.currentByType;
        if (!byType || oui.ORG_TYPE_ENUM[byType]) {
            if (showType >= 3) {
                this.setCurrentSelectType(SP_SEARCH_TYP_ENUM.ORG_PERSON);
            }
        }
        UI.spMainView.hide();
        var historyData = SelectPerson.searchHistory.get();
        if (historyData && historyData.length > 0) {
            UI.render("spSearchHistory", SelectPerson.searchHistory.get());
        } else {
            SelectPerson.clearSearchHistory();
        }
        UI.spSearchLayerView.show();
        //UI.spSearchInput.focus();
    };

    /**
     * 隐藏搜索层
     */
    SelectPerson.hideSearchLayer = function () {
        UI.spMainView.show();
        UI.spSearchLayerView.hide();
        UI.spSearchInput.blur();
    };

    /**
     * 判断该项目是否需要选择,或能被选中
     * @param item
     */
    SelectPerson.checkSelectType = function (item) {
        var chooseType = this.options.chooseType;
        var isAll = this.options.isAll + '' === 'true';
        if (oui.ORG_TYPE_ENUM[item.typeFlag]) {
            if (oui.ORG_TYPE_ENUM.company === item.typeFlag) {
                var allowCompany = this.options.allowCompany;
                if (!isAll && !allowCompany) {
                    return false;
                }
            } else {
                //判断选择类型是否与指定类型一样
                if (chooseType && chooseType.length > 0) {
                    if (chooseType.indexOf(item.typeFlag) < 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    /**
     * 验证是否能选中
     * 目前只是添加了改对象是否被选中了
     * 后面可以添加根据权限等东西来校验
     * 也可以重写该函数
     * @param item
     */
    SelectPerson.checkSelected = function (item) {

        var mapKey = item.id;
        var mapLength = UI.spSelectedView.find("li").length;
        //var chooseType = this.options.chooseType;

        var isMulti = this.options.isMulti;
        isMulti = (isMulti + "" !== "false");

        var maxSize = this.options.maxSize;
        maxSize = parseInt(maxSize || "-1");

        if ((isMulti && maxSize <= 1) || maxSize > 200) {
            maxSize = 200;
        }
        if (!isMulti) {
            maxSize = 1;
        }

        //判断是否存在
        if (SelectPerson.selectMap[mapKey]) {
            return false;
        }

        //如果存在选择全部则不能再选
        if (SelectPerson.orgId && SelectPerson.selectMap[SelectPerson.orgId]) {
            return false;
        }

        if (!SelectPerson.checkSelectType(item)) return false;

        var showType = this.options.showType;

        //判断最大值是否超过
        if (isMulti) {
            if (maxSize > 1 && mapLength >= maxSize) {
                if (showType >= 3) {
                    if (showType + "" === "4") {
                        oui.alert("您只能选择" + maxSize + "个部门");
                    } else {
                        oui.alert("您只能选择" + maxSize + "个");
                    }
                }
                return false;
            }
        } else {
            if (mapLength >= 1) {
                if (showType >= 3) {
                    if (showType + "" === "4") {
                        oui.alert("您只能选择一个部门");
                    } else {
                        oui.alert("您只能选择一个！");
                    }
                }
                return false;
            }
        }
        return true;
    };

    /**
     * 渲染选中区域
     * @param obj
     * @param isDelete
     */
    SelectPerson.renderSelectedView = function (obj, isDelete) {
        if (isDelete+'' === 'true') {
            var mapKey = obj.id;
            UI.spSelectedView.find("li#sp_selected_" + mapKey).remove();
            if (UI.spSelectView.find("input#sp_" + mapKey).length > 0) {
                UI.spSelectView.find("input#sp_" + mapKey)[0].checked = false;
            }
            if (UI.spSearchSelectView.find("input#sp_s_" + mapKey).length > 0) {
                UI.spSearchSelectView.find("input#sp_s_" + mapKey)[0].checked = false;
            }
            delete SelectPerson.selectMap[mapKey];
            SelectPerson.selectMap[mapKey] = null;
        } else {
            if (!(obj instanceof Array)) {
                obj = [obj];
            }
            for (var i = 0, len = obj.length; i < len; i++) {
                SelectPerson.selectMap[obj[i].id] = obj[i];
                if(obj[i].typeFlag === oui.ORG_TYPE_ENUM.person){
                    obj[i].name = obj[i]._name || obj[i].name;
                }
            }
            var html = UI.render("spSelected", obj, true);
            UI.spSelectedView.append(html);
        }
        if (oui.getObjectLength(SelectPerson.selectMap) > 0) {
            UI.spDeleteTips.show();
        } else {
            UI.spDeleteTips.hide();
        }
        // UI.spSelectedView.css("width", (oui.getObjectLength(SelectPerson.selectMap) * 0.7 ) + "rem");
        UI.spSelectedView.parent().scrollLeft(9999);
    };


    /**
     * 删除已选中项
     * @param item
     */
    SelectPerson.removeItem = function (item) {
        this.renderSelectedView(item, true);
    };

    SelectPerson.findChild = function (addItems, item) {
        var childrens = Biz.getChildDepartmentByOrg(item);
        if (item.children || item.children.length > 0) {
            if (SelectPerson.checkSelected(item)) {
                addItems.push(item);
            }
            for (var i = 0, len = childrens.length; i < len; i++) {
                SelectPerson.findChild(addItems, childrens[i]);
            }
        } else {
            if (SelectPerson.checkSelected(item)) {
                addItems.push(item);
            }
        }
    };

    /**
     * checkbox控件状态改变事件
     * @param obj
     * @param item
     */
    SelectPerson.checkChange = function (obj, item) {
        var self = this;
        var isAll = (this.options.isAll + "" === "true");
        var includeChildType = parseInt(self.options.includeChildType || "1");

        var mapKey = item.id;
        if (obj.checked) {
            var isSearch = $(obj).attr('sp_search');
            if (self.checkSelected(item)) {
                if (item.typeFlag === oui.ORG_TYPE_ENUM.department || item.typeFlag === oui.ORG_TYPE_ENUM.company) {//如果是部门
                    if (item.children || item.typeFlag === oui.ORG_TYPE_ENUM.company) {
                        if (isAll && (item.level+'' ==='0')) {
                            item = {
                                id: item.id,
                                name: "全体人员",
                                typeFlag: oui.ORG_TYPE_ENUM.all
                            };
                            SelectPerson.orgId = item.id;
                            if (isSearch) {
                                SelectPerson.searchHistory.add(item);
                            }
                            self.renderSelectedView(item);
                            return false;
                        }

                        if (includeChildType + '' === '0') {
                            var addItems = [];
                            oui.getTop().oui.confirmDialog("此部门下包含子部门，是否选中子部门", function () {
                                SelectPerson.findChild(addItems, item);
                                if (addItems.length > 0) {
                                    if (isSearch) {
                                        SelectPerson.searchHistory.add(addItems);
                                    }
                                    self.renderSelectedView(addItems);
                                }
                            }, function () {
                                if (isSearch) {
                                    SelectPerson.searchHistory.add(item);
                                }
                                self.renderSelectedView(item);
                            });
                        } else {//不包含子部门
                            if (isSearch) {
                                SelectPerson.searchHistory.add(item);
                            }
                            self.renderSelectedView(item);
                        }
                    } else {
                        if (isSearch) {
                            SelectPerson.searchHistory.add(item);
                        }
                        self.renderSelectedView(item);
                    }
                } else {
                    if (isSearch) {
                        SelectPerson.searchHistory.add(item);
                    }
                    self.renderSelectedView(item);
                }
            } else {//不通过校验
                var $inputCheck = UI.spSelectView.find("input#sp_" + mapKey);
                if ($inputCheck.length > 0) {
                    $inputCheck[0].checked = false;
                }
                var $inputCheck4s = UI.spSearchSelectView.find("input#sp_s_" + mapKey);
                if ($inputCheck4s.length > 0) {
                    $inputCheck4s[0].checked = false;
                }
            }
        } else {
            this.renderSelectedView(item, true);
        }
        return false;
    };

    /**
     * 选人界面选项单击事件
     * @param obj
     * @param type
     */
    SelectPerson.optionChange = function (obj, type) {
        var item = null;
        switch (type) {
            //case OrgTypeEnum.company:
            //case OrgTypeEnum.group://集团
            case oui.ORG_TYPE_ENUM.role://角色
            case oui.ORG_TYPE_ENUM.level://职务级别
                item = $(obj).attr("spData");
                item = oui.parseJson(item);
                SelectPerson.navigation.add({name: item.name, linkTo: "#/team/spData/", spData: item});
                Biz.getPersonByOrgObj(item, function (res) {
                    UI.render("spLF", res);
                });
                break;
            default ://人
                item = $(obj).attr("spData");
                item = oui.parseJson(item);
                var mapKey = item.id;

                var $inputCheck = UI.spSelectView.find("input#sp_" + mapKey);
                var inputCheck = null;
                if ($inputCheck.length > 0) {
                    inputCheck = $inputCheck[0];
                    inputCheck.checked = !inputCheck.checked;
                }

                var $inputCheck4s = UI.spSearchSelectView.find("input#sp_s_" + mapKey);
                var inputCheck4s = null;
                if ($inputCheck4s.length > 0) {
                    inputCheck4s = $inputCheck4s[0];
                    inputCheck4s.checked = !inputCheck4s.checked;

                    $inputCheck = $inputCheck4s;
                }
                //最后执行 change
                $inputCheck.trigger("change");
                break;
        }

        return false;
    };

    /**
     * 判断是否存在选中
     * @param item
     * @returns {boolean}
     */
    SelectPerson.isSelected = function (item) {
        if (!item) {
            return false;
        }
        var mapKey = item.id;
        // var isAll = (this.options.isAll + "" == "true");
        // var showType = this.options.showType;
        // if (item.level == 0 && showType != 4 && isAll && (!(SelectPerson.options.isFlow + "" != "false"))) {
        //     return !!SelectPerson.selectMap[SelectPerson.orgId];
        // } else {
        return !!SelectPerson.selectMap[mapKey];
        // }
    };

    /**
     * 获取选中人员数据
     */
    SelectPerson.getSelectedData = function () {
        var selectData = [], selectItem, key;
        for (key in this.selectMap) {
            selectItem = this.selectMap[key];
            if (selectItem) {
                if (selectItem.typeFlag === oui.ORG_TYPE_ENUM.all) {
                    return [selectItem];
                }
                selectData.push(selectItem);
            }
            //TODO 去掉重复的逻辑
            //if (!this.options.duplicate) {
            //    console.log("提示并去掉重复!");
            //}
        }
        return selectData;
    };

    /**
     * 搜索
     */
    SelectPerson.search = function () {
        var self = this;
        var showType = self.options.showType;
        var keyword = UI.spSearchInput.val();
        switch (self.currentSelectType) {
            case SP_SEARCH_TYP_ENUM.ORG_PERSON:
                if (showType + '' === '4') {
                    UI.render('spSearchSelect', []);
                } else {
                    //判断当前是否使用当前用户部门id
                    var rangeId = self.options.rangeId+'';
                    var id = null;
                    var isOnlyRange = self.options.onlyRange + '' === 'true';
                    if(isOnlyRange){//是否限定范围
                        if (rangeId && rangeId !== oui.RANGE_TYPE.company && rangeId !== oui.RANGE_TYPE.currentDept) {
                            id = rangeId;
                        } else if (rangeId === oui.RANGE_TYPE.currentDept) {
                            id = currentDepartmentID;
                        }
                    }

                    Biz.searchByName4Org(oui.ORG_TYPE_ENUM.department, keyword, id, function (result) {
                        UI.render('spSearchSelect', result);
                    });
                }
                break;
            default :
                if (!oui.ORG_TYPE_ENUM[self.currentSelectType]) {
                    Biz.search4Extend(self.currentSelectType, keyword, function (result) {
                        UI.render('spSearchSelect', result);
                    });
                }
                break;
        }

    };

    /**
     * 点击确定按钮
     */
    SelectPerson.click2Ok = function (flowType) {
        var self = this;
        var selectedResult = this.getSelectedData();
        var flag = true;
        if (selectedResult && selectedResult.length === 1 && selectedResult[0].typeFlag === oui.ORG_TYPE_ENUM.all) {
            flag = self.options.callbackOk({
                data: selectedResult,
                flowType: flowType
            });
            if (!(flag === false)) {
                oui.back();
                self.close();
            }
        } else {
            // TODO 这里需要走一次，检查过滤自己 2016-10-21
            self.userId2AccountId(selectedResult, function (result) {
                var flag = self.options.callbackOk({
                    data: result,
                    flowType: flowType
                });

                if (!(flag === false)) {
                    oui.back();
                    self.close();
                }
            });
        }
        return false;
    };

    /**
     * 点击取消按钮
     */
    SelectPerson.click2Cancel = function () {
        this.options.callbackCancel();
        oui.back();
        this.close();
        return false;
    };

    /**
     * 关闭窗体
     */
    SelectPerson.close = function () {
        oui.$.ctrl.dialog.SelectPersonDialog.close();
        window.removeEventListener("hashchange", closeSelectPerson, false);
        return false;
    };

    /**
     * 根据id获取头像背景
     * @param item
     * @returns {number}
     */
    SelectPerson.getIconBgNum = function (item) {
        var lastId = item.id.substring(item.id.length - 1, item.id.length);
        lastId = parseInt(lastId);
        if (isNaN(lastId)) {
            lastId = item.id.length;
        }
        return lastId % 10;
    };

    oui.SelectPerson = SelectPerson;
})
(jQuery, document, oui, oui.SelectPersonBiz, oui.SelectPersonUI);





