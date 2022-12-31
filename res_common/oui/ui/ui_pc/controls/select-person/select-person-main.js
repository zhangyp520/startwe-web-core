/**
 *
 */
(function ($, doc, oui, Biz, UI) {

    var tabsData = [
        {
            key: 'team',
            name: '组'
        },
        {
            key: 'contact',
            name: '联系人'
        },
        {
            key: 'department',
            name: '部门'
        },
        {
            key: "relativeRole",
            name: "相对角色"
        },
        {
            key: "role",
            name: "自定义角色"
        }
        //{
        //    key: 'level',
        //    name: '职务级别'
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


    var SelectPerson = {
        selectMap: {},
        selectedIds: [],
        selectedEl: null
    };

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

        this.options = $.extend(this.options, options);

        //初始化UI界面
        UI.init(this);

        this.initExtendTabClick();

        //初始化数据回填
        this.initFillBack();

        //初始化tab
        this.initTabs();

        //初始化完成回调
        this.options.afterInit(UI);
    };

    /**
     * 插入选中数据缓存
     * @param org
     */
    SelectPerson.insertSelectedMap = function (org) {
        SelectPerson.selectMap[org.id] = org;
        SelectPerson.selectedIds.splice(0, 0, org.id);
    };
    /**
     * 移除树的节点选中
     * @param org
     */
    SelectPerson.removeTreeNode = function (org) {
        if (this.departmentTree) {
            var node = this.departmentTree.getNodeByParam("id", org.id);
            this.departmentTree.checkNode(node, false);
        }
    };

    /**
     * 选中树节点
     * @param node
     */
    SelectPerson.checkTreeNode = function (node) {
        if (this.departmentTree) {
            node = this.departmentTree.getNodeByParam("id", node.id);
            this.departmentTree.checkNode(node, true);
        }
    };

    /**
     * 移除选中数据缓存
     * @param org
     */
    SelectPerson.removeSelectedMap = function (org) {
        var mapKey = org.id;
        SelectPerson.selectMap[mapKey] = null;
        delete SelectPerson.selectMap[mapKey];
        SelectPerson.selectedIds.splice(SelectPerson.selectedIds.indexOf(mapKey), 1);
    };

    /**
     * oui 帐号ID 转为第三方 userID
     * @param sourceData
     * @param callback
     */
    SelectPerson.accountId2userId = function (sourceData, callback) {
        //扫描登陆转
        var showType = this.options.showType;
        if (showType >= 3 && (sourceData[0].typeFlag !== oui.ORG_TYPE_ENUM.all)) {//如果为组织机构选人，需要走检查转换ID
            callback && callback(sourceData);
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
            self.accountId2userId(fillBack, function (result) {
                var _fillBack = result;
                var len = _fillBack.length, i, orgObj;
                for (i = 0; i < len; i++) {
                    orgObj = _fillBack[i];
                    SelectPerson.insertSelectedMap(orgObj);
                }
                UI.render('spSelected', _fillBack, false, {isFillback: true});
            });
        }
    };

    /**
     * 初始化tab
     */
    SelectPerson.initTabs = function () {
        var self = this;
        var showTabs = [],
            showType = self.options.showType,
            i,
            showTabsIndexStr = this.options.tabs,
            showTabsIndexArray = showTabsIndexStr.split(","),
            len = showTabsIndexArray.length,
            _tabIndex;

        for (i = 0; i < len; i++) {
            _tabIndex = showTabsIndexArray[i];
            _tabIndex = parseInt(_tabIndex);
            if (_tabIndex && tabsData[_tabIndex - 1]) {
                if (showType < 3) {// 只能选择团队的时候
                    if (_tabIndex === 1 || _tabIndex === 2) {
                        showTabs.push(tabsData[_tabIndex - 1]);
                    }
                } else if (showType >= 3) {//只能选择组织机构
                    if (_tabIndex !== 1 && _tabIndex !== 2) {
                        showTabs.push(tabsData[_tabIndex - 1]);
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
                    des: eTab.des
                };
                showTabs.push(tab);
            }
        }

        UI.render('spTabs', showTabs);
        if (showTabs.length > 0) {
            //如果默认为联系人选人，则defaultTabIndex 默认为2 联系人
            if (this.options.showType < 3) {
                this.options.defaultTabIndex = 2;
            }
            if (this.options.defaultTabIndex > 0 && $(UI.spTabsView.find("li")[this.options.defaultTabIndex - 1]).length > 0) {
                $(UI.spTabsView.find("li")[this.options.defaultTabIndex - 1]).trigger("click");
            } else {
                $(UI.spTabsView.find("li")[0]).trigger("click");
            }
        }
    };

    SelectPerson.initExtendTabClick = function () {
        var self = this;
        if (self.options.extend && self.options.extend.tabs && self.options.extend.tabs.length > 0) {
            var extendTabs = self.options.extend.tabs;
            var tab = null, eTab = null, i, len;
            for (i = 0, len = extendTabs.length; i < len; i++) {
                eTab = extendTabs[i];
                SelectPerson["click2" + eTab.type] = (function (eTab) {
                    // var data = eTab.data;
                    return function () {
                        this.setCurrentSelectType(eTab.type);
                        Biz.getDataByExtendTab(eTab, function (data) {
                            UI.render('spLT4Extend', {result: data, type: eTab.type, name: eTab.title, des: eTab.des});
                            UI.spLTView.parent().css("height", "467px");
                            UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
                            UI.spLFView.parent().hide();
                            UI.spLTView.parent().show();
                        });
                        return false;
                    }
                })(eTab);
            }
        }
    };

    /**
     * 设置当前选择的类型为搜索做好准备
     * @param type
     */
    SelectPerson.setCurrentSelectType = function (type) {
        this.currentSelectType = type;
        var showType = this.options.showType;
        switch (type) {
            case oui.ORG_TYPE_ENUM.role:
            case oui.ORG_TYPE_ENUM.relativeRole :
                UI.spSearchView.hide();
                break;
            case oui.ORG_TYPE_ENUM.department:
                if (showType === 4) {
                    UI.spSearchView.hide();
                } else {
                    UI.spSearchView.show();
                }
                break;
            default :
                UI.spSearchView.show();
                break;
        }
        UI.spSearchInput.val("");
    };

    /**
     * 点击部门选项卡
     */
    SelectPerson.click2department = function () {
        var self = this;
        self.setCurrentSelectType(oui.ORG_TYPE_ENUM.department);

        //判断当前是否使用当前用户部门id

        var rangeId = self.options.rangeId + '';
        var type = oui.ORG_TYPE_ENUM.company;
        var id = null;
        if (self.options.onlyRange + '' === 'true') {
            if (rangeId && rangeId !== oui.RANGE_TYPE.company && rangeId !== oui.RANGE_TYPE.currentDept) {
                type = oui.ORG_TYPE_ENUM.department;
                id = rangeId;
            } else if (rangeId === oui.RANGE_TYPE.currentDept) {
                type = oui.ORG_TYPE_ENUM.department;
                id = currentDepartmentID;
            }
        }

        Biz.getOrg(type, id, function (result) {
            UI.render('spLT4department');
            UI.spLTView.parent().css("height", "467px");
            UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
            UI.spLFView.parent().hide();
            UI.spLTView.parent().show();
            self.initDepartmentTree(result);
        });
    };

    /**
     * 初始化部门树
     * @param zNode
     */
    SelectPerson.initDepartmentTree = function (zNode) {

        var typeFlag = null;
        for (var i = 0, len = zNode.length; i < len; i++) {
            typeFlag = zNode[i].typeFlag;
            if (typeFlag === 'company' || typeFlag === "department" || typeFlag === "team") {
                zNode[i].iconSkin = 'pIcon01';
                zNode[i].isParent = true;
                zNode[i].isAsync = true;
                zNode[i].nocheck = true;
            } else {
                zNode[i].iconSkin = 'icon01';
                zNode[i].isParent = false;
                zNode[i].isAsync = false;
                zNode[i].nocheck = false;
            }
        }

        var departmentTreeFindPersonByParent = function (treeNode, callback) {
            var showType = self.options.showType;
            if (showType !== 4 && showType !== 1) {
                if (treeNode.isAsync) {
                    Biz.getPersonByOrgObj(treeNode, function (result) {
                        treeNode.isAsync = false;
                        if (result && result.length > 0) {
                            for (var i = 0, len = result.length; i < len; i++) {
                                result[i].iconSkin = 'icon01';
                                result[i].isAsync = false;
                                var name = result[i].name;
                                var display = result[i].name;
                                if (result[i].post && result[i].post.length > 0) {
                                    display = name + "（" + result[i].post + "）";
                                }
                                result[i]._name = name;
                                result[i].name = display;
                                result[i].checked = !!SelectPerson.selectMap[result[i].id];
                            }
                            callback && callback(result);
                            departmentTree.addNodes(treeNode, 0, result);
                        } else {
                            if (!(treeNode.children && treeNode.children.length > 0)) {
                                $("#" + treeNode.tId + "_switch").remove();
                            }
                            callback && callback([]);
                        }
                        departmentTree.updateNode(treeNode);
                    });
                }
            }
        };

        var self = this;
        var departmentTree = self.departmentTree = $.fn.zTree.init(UI.spLTView.find("ul"), {
            check: {
                enable: true
            },
            view: {
                showIcon: true,
                showLine: false,
                showTitle: true,
                dblClickExpand: false,
                selectedMulti: false,
                expandSpeed: "",
                addDiyDom: function (treeId, treeNode) {
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                        icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);
                }
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: "0"
                }
            },
            callback: {
                beforeExpand: function beforeExpand(treeId, treeNode) {
                    //父节点展开的时候，回去父节点下的子节点（人）
                    departmentTreeFindPersonByParent(treeNode, function (result) {

                    });
                },
                //节点点击事件
                onClick: function (e, treeId, treeNode) {
                    if (treeNode.typeFlag === oui.ORG_TYPE_ENUM.person) {
                        treeNode.name = treeNode._name || treeNode.name;//加岗位
                    }
                    SelectPerson.selectedItems = treeNode;
                    SelectPerson.click4L2R();
                },
                //禁止所有勾选操作，保持初始化的勾选状态
                beforeCheck: function (treeId, treeNode) {
                    if (!treeNode.checked && !SelectPerson.checkSelected(treeNode)) {
                        return false;
                    }
                },
                //复选框选中事件
                onCheck: function (e, treeId, treeNode) {
                    var checked = treeNode.checked;
                    if (checked) {
                        SelectPerson.selectedItems = treeNode;
                        SelectPerson.click4L2R();
                    } else {//TODO 是否移除呢
                        UI.spSelectedView.find("dd[spData='" + treeNode.id + "']").find("i").trigger("click");
                    }
                }
            }
        }, zNode);

        var rangeId = self.options.rangeId;
        if (self.options.onlyRange + '' !== 'true' && rangeId + '' !== oui.RANGE_TYPE.company) {
            var node = null;
            if (rangeId + '' === oui.RANGE_TYPE.currentDept) {//从当前部门开始
                node = departmentTree.getNodeByParam("id", currentDepartmentID, null);
            } else {
                node = departmentTree.getNodeByParam("id", rangeId, null);
            }
            if (node) {
                var tempNode = node;
                while (tempNode.getParentNode() !== null) {
                    departmentTree.expandNode(tempNode.getParentNode(), true, false, true, true);
                    tempNode = tempNode.getParentNode();
                }
                var isExpand = departmentTree.expandNode(node, true, false, true, true);
                if (isExpand) {
                    departmentTree.selectNode(node);
                    //self.getPersonByTreeNode(node);
                }
            }
        }
    };

    /**
     * 树节点转换为选人VO
     * @param treeNode
     * @returns {*}
     */
    var treeNode2SelectPersonVo = function (treeNode) {
        if (!treeNode) return null;
        return {
            id: treeNode.id,
            typeFlag: treeNode.typeFlag,
            name: treeNode.name,
            openId: treeNode.openId,
            parentId: treeNode.parentId
        };
    };

    // /**
    //  * 根据部门的树节点获取自部门的人员
    //  * @param treeNode
    //  */
    // SelectPerson.getPersonByTreeNode = function (treeNode) {
    //     var self = this,
    //         showType = self.options.showType;
    //     SelectPerson.selectedItems = treeNode;
    //     if (showType !== 4) {
    //         this.optionChange(treeNode, oui.ORG_TYPE_ENUM.department);
    //     }
    //     return false;
    // };

    /**
     * 组点击事件
     */
    SelectPerson.click2team = function () {
        this.setCurrentSelectType(oui.ORG_TYPE_ENUM.team);
        Biz.getTeams({}, function (teams) {
            UI.render('spLT4department');
            UI.spLTView.parent().css("height", "467px");
            UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
            UI.spLFView.parent().hide();
            UI.spLTView.parent().show();
            SelectPerson.initDepartmentTree(teams);
            // UI.render('spLT4team', teams);
            // UI.spLFView.parent().show();
            // UI.spLTView.parent().show();
            // UI.spLTView.parent().css("height", "230px");
            // UI.spLFView.parent().css("height", "230px");
            // UI.spLTView.parent().find(".selectPerson-arrow-up").show();
        });
        return false;
    };

    /**
     * 联系人
     */
    SelectPerson.click2contact = function () {
        this.setCurrentSelectType(oui.ORG_TYPE_ENUM.contact);
        Biz.getContact({}, function (contacts) {
            UI.render('spLT4Contact', contacts);
            UI.spLTView.parent().css("height", "467px");
            UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
            UI.spLFView.parent().hide();
            UI.spLTView.parent().show();
        });
        return false;
    };

    /**
     * 点击部门选项卡
     */
    SelectPerson.click2relativeRole = function () {
        this.setCurrentSelectType(oui.ORG_TYPE_ENUM.relativeRole);
        Biz.getRelativeRoles(function (result) {
            UI.render('spLT4relativeRole', result);
            UI.spLTView.parent().css("height", "467px");
            UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
            UI.spLFView.parent().hide();
            UI.spLTView.parent().show();
        });
    };

    /**
     * 初始化部门树
     * @param zNode
     */
    SelectPerson.initRoleTree = function (zNode) {

        var typeFlag = null;
        for (var i = 0, len = zNode.length; i < len; i++) {
            typeFlag = zNode[i].typeFlag;
            if (typeFlag === 'role') {
                zNode[i].openId = zNode.id;
                zNode[i].iconSkin = 'pIcon01';
                zNode[i].isParent = true;
                zNode[i].isAsync = true;
            } else {
                zNode[i].iconSkin = 'icon01';
                zNode[i].isParent = false;
                zNode[i].isAsync = false;
            }
        }

        var self = this;
        var departmentTree = self.roleTree = $.fn.zTree.init(UI.spLTView.find("ul"), {
            view: {
                showIcon: true,
                showLine: false,
                showTitle: true,
                dblClickExpand: false,
                selectedMulti: false,
                expandSpeed: "",
                addDiyDom: function (treeId, treeNode) {
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                        icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);
                }
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: "0"
                }
            },
            callback: {
                beforeExpand: function beforeExpand(treeId, treeNode) {
                    //父节点展开的时候，回去父节点下的子节点（人）
                    var showType = self.options.showType;
                    if (showType !== 4 && showType !== 1) {
                        if (treeNode.isAsync) {
                            Biz.getPersonByOrgObj(treeNode, function (result) {
                                treeNode.isAsync = false;
                                if (result && result.length > 0) {
                                    for (var i = 0, len = result.length; i < len; i++) {
                                        result[i].iconSkin = 'icon01';
                                        result[i].isAsync = false;
                                        var name = result[i].name;
                                        var display = result[i].name;
                                        if (result[i].post && result[i].post.length > 0) {
                                            display = name + "（" + result[i].post + "）";
                                        }
                                        result[i]._name = name;
                                        result[i].name = display;
                                    }
                                    departmentTree.addNodes(treeNode, 0, result);
                                } else {
                                    if (!(treeNode.children && treeNode.children.length > 0)) {
                                        $("#" + treeNode.tId + "_switch").remove();
                                    }
                                }
                                departmentTree.updateNode(treeNode);
                            });
                        }
                    }
                },
                onClick: function (e, treeId, treeNode) {
                    if (treeNode.typeFlag === oui.ORG_TYPE_ENUM.person) {
                        treeNode.name = treeNode._name || treeNode.name;
                    }
                    SelectPerson.selectedItems = treeNode;
                    SelectPerson.click4L2R();
                }
            }
        }, zNode);
    };

    /**
     * 自定角色选项卡
     */
    SelectPerson.click2role = function () {
        var self = this;
        this.setCurrentSelectType(oui.ORG_TYPE_ENUM.role);
        Biz.getOrg(oui.ORG_TYPE_ENUM.role, null, function (result) {
            UI.render('spLT4role');
            UI.spLTView.parent().css("height", "467px");
            UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
            UI.spLFView.parent().hide();
            UI.spLTView.parent().show();
            self.initRoleTree(result);
        });
    };

    /**
     * 改变tab
     * @param obj
     */
    SelectPerson.tabChange = function (obj) {
        var $obj = $(obj);
        var key = $obj.attr("key");
        if ($obj.hasClass("liActive")) {
            return false;
        }
        $obj.parent().find(".liActive").removeClass("liActive");
        $obj.addClass("liActive");
        SelectPerson["click2" + key]();
        return false;
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
        var mapLength = oui.getObjectLength(SelectPerson.selectMap); //UI.spSelectedView.find("li").length;
        var showType = this.options.showType;
        var chooseType = this.options.chooseType;
        var maxSize = this.options.maxSize;
        maxSize = parseInt(maxSize || "-1");
        var isMulti = this.options.isMulti;
        var enableSelectNoGroup = this.options.enableSelectNoGroup;
        var filterSelf = (this.options.filterSelf + "" !== "false");

        if (showType >= 3 && filterSelf) {//过滤自己,如果是自己则过滤不允许选择
            if (mapKey === currentAccountId) {
                return false;
            }
        }

        //判断是否存在
        if (SelectPerson.selectMap[mapKey]) {
            return false;
        }

        if (SelectPerson.orgId && SelectPerson.selectMap[SelectPerson.orgId]) {
            return false;
        }

        if (oui.ORG_TYPE_ENUM[item.typeFlag]) {//如果存在于组织机构枚举说明 不是扩展的
            if (item.typeFlag === oui.ORG_TYPE_ENUM.company) {
                var allowCompany = this.options.allowCompany;
                var isAll = this.options.isAll;
                if ((isAll + "" !== "true") && !allowCompany) {
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

        //判断选择的类型是未分组的情况，根据配置来判断是否允许选择
        if (!(enableSelectNoGroup + "" !== "false")) {
            if (item.typeFlag === oui.ORG_TYPE_ENUM.team && item.id === "-1") {
                return false;
            }
        }

        //判断最大值是否超过
        if (isMulti + "" !== "false") {
            if (maxSize > 1 && mapLength >= maxSize) {
                oui.alert("您只能选择" + maxSize + "个选项");
                return false;
            }
        } else {
            if (mapLength >= 1) {
                //TODO 修改提示语
                oui.alert("您只能选择1个选项");
                return false;
            }
        }
        return true;
    };

    SelectPerson.selectedItems = [];

    /**
     * 选人界面选项单击事件
     * @param obj
     * @param type
     */
    SelectPerson.optionChange = function (obj, type) {
        SelectPerson.selectedEl = obj;
        switch (type) {
            //case OrgTypeEnum.company:
            //case OrgTypeEnum.group://集团
            case oui.ORG_TYPE_ENUM.department:
                SelectPerson.selectedItems = obj;
                SelectPerson.click4L2R();
                break;
            case oui.ORG_TYPE_ENUM.role://角色
            case oui.ORG_TYPE_ENUM.level://职务级别
            case oui.ORG_TYPE_ENUM.relativeRole://相对角色
                SelectPerson.selectedItems = $(SelectPerson.selectedEl).find("option:selected");
                SelectPerson.click4L2R();
                break;
            case oui.ORG_TYPE_ENUM.team://联系人组
                var items = $(SelectPerson.selectedEl).find("option:selected");
                SelectPerson.selectedItems = items;
                SelectPerson.click4L2R();
                break;
            default ://人(或者外部)
                SelectPerson.selectedItems = $(SelectPerson.selectedEl).find("option:selected");
                SelectPerson.click4L2R();
                break;
        }

        return false;
    };

    SelectPerson.selectBlur = function (obj) {
        $(SelectPerson.selectedEl).val("");
    };

    /**
     * 选人界面选项双击事件
     * @param obj
     * @param item
     */
    SelectPerson.optionDbClick = function (obj, item) {

        var $obj, $p;
        if (item) {
            $obj = $(obj);
            $p = $obj.parent();
        } else {
            $p = $(obj);
            $obj = $p.find("option:selected");
            if ($obj.length <= 0) return false;
            $obj = $($obj[0]);
            item = $obj.attr("spData");
            item = oui.parseJson(item);
        }

        var toView = $p.attr("toView");

        if (toView !== 'spR') {//如果不是到最右边的框里
            if ($obj.attr("name") === "deleteItem") {
                $p.remove();
            } else {
                $obj.remove();
            }
            SelectPerson.removeSelectedMap(item);
            //TODO
            SelectPerson.removeTreeNode(item);
            return false;
        }

        //判断当前对象是否能被选中
        if (!SelectPerson.checkSelected(item)) {
            return false;
        }

        //调用选择移动之前的回调
        var isMove = this.options.beforeSelect(item);

        if (isMove === false) {
            return false;
        }

        var html = UI.render('spSelected', [item], true);
        UI.spSelectedView.prepend(html);
        // UI.spSelectedView.scrollTop(9999);
        //将当前对象加入到选中的缓存中去
        SelectPerson.insertSelectedMap(item);

        //调用移动之后的回调
        this.options.afterSelect(item);

        return false;
    };

    /**
     * 获取选中人员数据
     */
    SelectPerson.getSelectedData = function () {
        var selectData = [], selectItem, key;
        for (var i = 0, len = this.selectedIds.length; i < len; i++) {
            key = this.selectedIds[i];
            selectItem = this.selectMap[key];
            if (selectItem) {
                if (selectItem.typeFlag === oui.ORG_TYPE_ENUM.all) {
                    return [selectItem];
                }
                selectData.push(selectItem);
            }
        }
        return selectData;
    };

    /**
     * 点击箭头事件 从左到右的事件
     */
    SelectPerson.click4L2R = function () {
        var self = this;
        var $item = null,
            item = null,
            addItems = [],
            mapKey,
            showType = self.options.showType,
            isAll = (self.options.isAll + "" === "true");
        var includeChildType = parseInt(self.options.includeChildType || "1");
        if (SelectPerson.selectedItems.hasOwnProperty("context")) {//如果含有selector则默认为dom对象，则走循环操作
            if (SelectPerson.selectedItems.length > 0) {
                //遍历选中的项，并作是否能选中处理，并添加到数组中，使用一次性替换innerHTML替换选中区域
                SelectPerson.selectedItems.each(function (i, o) {
                    $item = $(o);
                    item = $item.attr("spData");
                    item = oui.parseJson(item);
                    mapKey = item.id;
                    //判断当前对象是否能被选中
                    if (SelectPerson.checkSelected(item)) {
                        //调用选择移动之前的回调
                        var isMove = self.options.beforeSelect(item);
                        if (isMove !== false) {
                            //将当前对象加入到选中的缓存中去
                            SelectPerson.insertSelectedMap(item);
                            //SelectPerson.selectMap[mapKey] = item;
                            addItems.push(item);
                            //调用移动之后的回调
                            self.options.afterSelect(item);
                        }
                    } else {
                        return false;
                    }
                });
            }
            if (addItems.length > 0) {
                var html = UI.render('spSelected', addItems, true);
                UI.spSelectedView.prepend(html);
                // UI.spSelectedView.scrollTop(9999);
            }
        } else {//如果不是则默认选中的是部门等不是dom对象的
            if (SelectPerson.selectedItems.length <= 0) return false;
            item = SelectPerson.selectedItems;
            mapKey = item.id;
            //判断当前对象是否能被选中
            if (SelectPerson.checkSelected(item)) {
                //如果单位的类型这里，又是选择部门需要将单位的类型转为部门类型
                // if (item.typeFlag == oui.ORG_TYPE_ENUM.company) {
                //     item.typeFlag = oui.ORG_TYPE_ENUM.department;
                // }
                //调用选择移动之前的回调
                var isMove = self.options.beforeSelect(item);
                if (isMove !== false) {
                    //var itemNode = self.departmentTree.getNodeByTId(item.tId);
                    // && item.children && item.children.length > 0
                    if (item.isParent && showType >= 3) {//如果是父节点
                        if (isAll && item.level === 0 && item.isFirstNode && item.typeFlag === oui.ORG_TYPE_ENUM.company) {
                            item = {
                                id: item.id,
                                typeFlag: oui.ORG_TYPE_ENUM.all,
                                name: "全体人员"
                            };
                            SelectPerson.orgId = item.id;
                            SelectPerson.checkTreeNode(item);//TODO 是否选中全部人
                            //将当前对象加入到选中的缓存中去
                            SelectPerson.insertSelectedMap(item);
                            //SelectPerson.selectMap[mapKey] = item;
                            addItems.push(item);
                            //调用移动之后的回调
                            self.options.afterSelect(item);
                            if (addItems.length > 0) {
                                var html = UI.render('spSelected', addItems, true);
                                UI.spSelectedView.prepend(html);
                                // UI.spSelectedView.append(html);
                                // UI.spSelectedView.scrollTop(9999);
                            }
                            return;
                        }

                        if (includeChildType === 0) {
                            oui.getTop().oui.confirmDialog("此部门下包含子部门，是否选中子部门", function () {
                                SelectPerson.findChild(addItems, item);
                                if (addItems.length > 0) {
                                    var html = UI.render('spSelected', addItems, true);
                                    UI.spSelectedView.prepend(html);
                                    // UI.spSelectedView.scrollTop(9999);
                                }
                            }, function () {
                                SelectPerson.checkTreeNode(item);
                                item = treeNode2SelectPersonVo(item);
                                //将当前对象加入到选中的缓存中去
                                SelectPerson.insertSelectedMap(item);
                                //SelectPerson.selectMap[mapKey] = item;
                                addItems.push(item);
                                //调用移动之后的回调
                                self.options.afterSelect(item);
                                if (addItems.length > 0) {
                                    var html = UI.render('spSelected', addItems, true);
                                    UI.spSelectedView.prepend(html);
                                    // UI.spSelectedView.scrollTop(9999);
                                }
                            });
                        } else {
                            SelectPerson.checkTreeNode(item);
                            item = treeNode2SelectPersonVo(item);
                            //将当前对象加入到选中的缓存中去
                            SelectPerson.insertSelectedMap(item);
                            //SelectPerson.selectMap[mapKey] = item;
                            addItems.push(item);
                            //调用移动之后的回调
                            self.options.afterSelect(item);
                            if (addItems.length > 0) {
                                var html = UI.render('spSelected', addItems, true);
                                UI.spSelectedView.prepend(html);
                                // UI.spSelectedView.scrollTop(9999);
                            }
                        }
                    } else {
                        SelectPerson.checkTreeNode(item);
                        item = treeNode2SelectPersonVo(item);
                        //将当前对象加入到选中的缓存中去
                        SelectPerson.insertSelectedMap(item);

                        //SelectPerson.selectMap[mapKey] = item;
                        addItems.push(item);
                        //调用移动之后的回调
                        self.options.afterSelect(item);
                        if (addItems.length > 0) {
                            var html = UI.render('spSelected', addItems, true);
                            UI.spSelectedView.prepend(html);
                            // UI.spSelectedView.scrollTop(9999);
                        }
                    }
                }
            } else {
                return false;
            }
        }
    };

    SelectPerson.findChild = function (addItems, item) {
        var childrens = item.children;
        if (item.isParent && childrens && childrens.length > 0) {
            if (SelectPerson.checkSelected(item)) {
                SelectPerson.checkTreeNode(item);
                item = treeNode2SelectPersonVo(item);
                //将当前对象加入到选中的缓存中去
                SelectPerson.insertSelectedMap(item);
                //SelectPerson.selectMap[mapKey] = item;
                addItems.push(item);
                //调用移动之后的回调
                //self.options.afterSelect(item);
            }
            for (var i = 0, len = childrens.length; i < len; i++) {
                SelectPerson.findChild(addItems, childrens[i]);
            }
        } else {
            if (SelectPerson.checkSelected(item)) {
                SelectPerson.checkTreeNode(item);
                item = treeNode2SelectPersonVo(item);
                //将当前对象加入到选中的缓存中去
                SelectPerson.insertSelectedMap(item);
                //SelectPerson.selectMap[mapKey] = item;
                addItems.push(item);
                //调用移动之后的回调
                //self.options.afterSelect(item);
            }
        }


    };


    /**
     * 上下箭头公共方法
     * @param LTHeight
     * @param direction
     */
    SelectPerson.arrowUpOrDown = function (LTHeight, direction) {
        LTHeight = LTHeight.replace("px", "");
        LTHeight = parseInt(LTHeight);
        if (direction === "up") {
            switch (LTHeight) {
                //case 0:
                //    break;
                case 230:
                    //UI.spLTView.parent().css("height", "0");
                    UI.spLTView.parent().hide();
                    UI.spLTView.parent().css("height", "0");
                    UI.spLFView.parent().css("height", "467px");
                    break;
                case 467:
                    UI.spLTView.parent().show();
                    UI.spLFView.parent().show();
                    UI.spLTView.parent().css("height", "230px");
                    UI.spLFView.parent().css("height", "230px");
                    break;
                default :
                    break;
            }
        } else {
            switch (LTHeight) {
                case 230:
                    //UI.spLTView.parent().css("height", "0");
                    UI.spLFView.parent().hide();
                    UI.spLFView.parent().css("height", "0");
                    UI.spLTView.parent().css("height", "467px");
                    break;
                case 20:
                    UI.spLFView.parent().show();
                    UI.spLTView.parent().show();
                    UI.spLFView.parent().css("height", "230px");
                    UI.spLTView.parent().css("height", "230px");
                    break;
                default :
                    break;
            }
        }

    };

    /**
     * 点击想上箭头
     */
    SelectPerson.click4arrowUp = function () {
        this.arrowUpOrDown(UI.spLTView.parent().css("height"), "up");
    };

    /**
     * 点击向下箭头
     */
    SelectPerson.click4arrowDown = function () {
        this.arrowUpOrDown(UI.spLTView.parent().css("height"), "down");
    };

    SelectPerson.clearSearch = function () {
        var self = this;
        UI.spSearchInput.val("");
        switch (self.currentSelectType) {
            case oui.ORG_TYPE_ENUM.team:
                self.click2team();
                break;
            case oui.ORG_TYPE_ENUM.contact:
                self.click2contact();
                break;
            case oui.ORG_TYPE_ENUM.department:
                self.click2department();
                break;
            case oui.ORG_TYPE_ENUM.relativeRole:
                self.click2relativeRole();
                break;
            default :
                if (SelectPerson["click2" + self.currentSelectType]) {
                    SelectPerson["click2" + self.currentSelectType]();
                }
                break;
        }
    };

    /**
     * 搜索
     */
    SelectPerson.search = function () {
        var self = this;
        var keyword = UI.spSearchInput.val();
        //判断当前是否使用当前用户部门id
        var rangeId = self.options.rangeId + '';
        var id = null;
        var isOnlyRange = self.options.onlyRange + '' === 'true';
        if (isOnlyRange) {//是否限定范围
            if (rangeId && rangeId !== oui.RANGE_TYPE.company && rangeId !== oui.RANGE_TYPE.currentDept) {
                id = rangeId;
            } else if (rangeId === oui.RANGE_TYPE.currentDept) {
                id = currentDepartmentID;
            }
        }

        Biz.search(self.currentSelectType, keyword, function (result) {
            switch (self.currentSelectType) {
                case oui.ORG_TYPE_ENUM.team:
                    //不存在索索组
                    UI.render('spLF', {result: result, type: oui.ORG_TYPE_ENUM.contact});
                    // UI.spLFView.parent().show();
                    // UI.spLTView.parent().show();
                    // UI.spLTView.parent().css("height", "230px");
                    // UI.spLFView.parent().css("height", "230px");
                    // UI.spLTView.parent().find(".selectPerson-arrow-up").show();
                    UI.spLFView.parent().css("height", "467px");
                    UI.spLFView.parent().find(".selectPerson-arrow-down").hide();
                    UI.spLFView.parent().show();
                    UI.spLTView.parent().hide();
                    break;
                case oui.ORG_TYPE_ENUM.contact:
                    UI.render('spLT4Contact', result);
                    UI.spLTView.parent().css("height", "467px");
                    UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
                    UI.spLFView.parent().hide();
                    UI.spLTView.parent().show();
                    break;
                default :
                    if (oui.ORG_TYPE_ENUM[self.currentSelectType]) {
                        UI.render("spLF", {result: result, type: oui.ORG_TYPE_ENUM.person});
                        UI.spLFView.parent().css("height", "467px");
                        UI.spLFView.parent().find(".selectPerson-arrow-down").hide();
                        UI.spLFView.parent().show();
                        UI.spLTView.parent().hide();
                    } else {
                        UI.render("spLT4Extend", {result: result, type: self.currentSelectType});
                        UI.spLTView.parent().css("height", "467px");
                        UI.spLTView.parent().find(".selectPerson-arrow-up").hide();
                        UI.spLFView.parent().hide();
                        UI.spLTView.parent().show();

                    }
                    break;
            }
        }, {deptId: id});
    };

    /**
     * 点击确定按钮
     */
    SelectPerson.click2Ok = function () {
        var self = this;
        var flowType = UI.spOptionView.find("input[name='Serial-concurrent']:checked").val();
        var selectedResult = this.getSelectedData();
        var flag = self.options.callbackOk({
            data: selectedResult,
            flowType: flowType
        });
        if (!(flag === false)) {
            self.close();
        }
        return false;
    };

    SelectPerson.sortUpdate = function (e, ui) {
        var item = ui.item;
        var $item = $(item);
        var id = $item.attr("spData");

        var nextId = $item.next().length > 0 ? $item.next().attr("spData") : null;

        var currIdx = this.selectedIds.indexOf('' + id),
            nextIdx; //获取当前控件在排序列表中的索引

        if (currIdx !== -1) {
            this.selectedIds.splice(currIdx, 1); //临时去除当前位置的id
        }

        if (!nextId) { //如果当前控件在拖拽排序后，其后面没有控件时 则直接将当前控件Id放置在当前排序最后
            this.selectedIds.push(id);
            return;
        }
        nextIdx = this.selectedIds.indexOf('' + nextId);//如果当前控件在拖拽排序后，存在控件则获取当前控件后面的索引; 理论上该值不能为-1
        this.selectedIds.splice(nextIdx, 0, id);//在指定位置增加id

    };

    /**
     * 点击取消按钮
     */
    SelectPerson.click2Cancel = function () {
        this.options.callbackCancel();
        this.close();
        return false;
    };

    /**
     * 关闭窗体
     */
    SelectPerson.close = function () {
        oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog.hide();
        return false;
    };


    oui.SelectPerson = SelectPerson;

    /**
     * 选人界面dom加载完成
     */
    $(doc).ready(function () {
        var SelectPersonDialog = oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog;
        SelectPerson.init(SelectPersonDialog.attr("selectPersonOptions"));

    });

})
(jQuery, document, oui, oui.SelectPersonBiz, oui.SelectPersonUI);





