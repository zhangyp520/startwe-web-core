/**
 * Created by oui on 2016/4/6.
 *
 */
(function ($, doc, oui) {

    var relativeRoles = {
        relRole_sender: "发起人",
        relRole_sender4Dep: "发起人部门成员",
        relRole_sender4DepMgr: "发起人部门主管",
        //relRole_sender4Dep4Pre: "发起人上级部门部门成员",
        relRole_sender4DepMgr4Pre: "发起人上级部门部门主管",
        relRole_preNode4Dep: "上节点部门成员",
        relRole_preNode4DepMgr: "上节点部门主管",
        //relRole_preNode4Dep4Pre: "上节点上级部门部门成员",
        relRole_preNode4DepMgr4Pre: "上节点上级部门部门主管"
    };

    /**
     * 选人所有服务器API地址
     */
    var ServiceApi = {
        getPerson: oui_url.selectPerson_getPerson,//获取人接口
        searchByName: oui_url.selectPerson_searchByName,//获取组织对象根据name（搜索接口）
        getOrg: oui_url.selectPerson_getOrg,//获取组织机构(id不传代表，type:company获取所有部门，传了id，type：department代表获取子部门)
        getCustomRole: oui_url.selectPerson_getCustomRole,
        userId2AccountId: oui_url.selectPerson_userId2AccountId,
        accountId2UserId: oui_url.selectPerson_accountId2UserId
    };

    /**
     * 根据key 获取请求服务器地址
     * @param key
     * @param params
     * @returns {*}
     */
    var getSeverURL = function (key, params) {
        var url = ServiceApi[key];
        if (params) {
            params = $.param(params);
            url += "&" + params;
        }
        return url;
    };

    var SelectPersonBiz = {};

    /**
     * 检查选中的人员是否在我们的帐号体系内
     * @param result
     * @param callback
     * @param filterSelf
     */
    SelectPersonBiz.userId2AccountId = function (result, filterSelf, callback) {
        if (result && result.length > 0) {
            var param = {
                filterSelf: filterSelf + "" !== "false"
            };
            if (result === 'all') {
                param['type'] = "all";
            } else {
                param['users'] = result;
            }
            var __appName = oui.appType.qing ? "云表单" : "云积木";
            oui.postData(getSeverURL("userId2AccountId"), param, function (res) {
                res = oui.parseJson(res);
                if (res.success) {
                    var data = res.msg;
                    data = oui.parseJson(data);
                    var notInsideList = data.notInsidePersonList;
                    if (notInsideList.length > 0) {
                        var notInsideNameStr = "";
                        for (var i = 0, len = notInsideList.length; i < len; i++) {
                            notInsideNameStr += notInsideList[i]["name"] + ",";
                        }
                        notInsideNameStr = notInsideNameStr.substring(0, notInsideNameStr.length - 1);
                        oui.alert(notInsideNameStr + "还没有注册" + __appName + "哦！", function () {
                            callback && callback({data: data.checkedVoList});
                        });
                    } else {
                        callback && callback({data: data.checkedVoList});
                    }
                } else {
                    oui.alert(res.msg);
                }
            }, function (error) {
                oui.alert(oui.parseString(error));
            });
        } else {
            callback && callback({data: result});
        }
    };

    /**
     * accountId转成userId
     * @param result
     * @param callback
     */
    SelectPersonBiz.accountId2userId = function (result, callback) {
        if (result && result.length > 0) {
            var param = {};
            param['users'] = result;
            oui.postData(getSeverURL("accountId2UserId"), param, function (res) {
                res = oui.parseJson(res);
                if (res.success) {
                    var data = res.msg;
                    data = oui.parseJson(data);
                    callback && callback(data.checkedVoList);
                } else {
                    oui.alert(res.msg);
                }
            }, function (error) {
                oui.alert(oui.parseString(error));
            });
        } else {
            callback && callback(result);
        }
    };

    /**
     * 根据组织对象获取人
     * @param orgObj
     * @param callback
     * @param otherParam
     */
    SelectPersonBiz.getPersonByOrgObj = function (orgObj, callback, otherParam) {
        var userCache = window.isFromCache || false;
        orgObj = oui.parseJson(orgObj);
        var param = {};
        if (orgObj) {
            param = {
                type: orgObj.typeFlag,
                id: orgObj.id,
                otherParam: orgObj.typeFlag + orgObj.id
            };
        }

        $.extend(true, param, otherParam);
        if (userCache && SelectPersonBiz.personMap && SelectPersonBiz.personMap[orgObj.id + '_' + orgObj.typeFlag]) {
            callback && callback(SelectPersonBiz.personMap[orgObj.id + '_' + orgObj.typeFlag]);
        } else {
            oui.getData(getSeverURL("getPerson", param), {}, function (res) {
                if (res.success) {
                    var result = res.msg;
                    result = oui.parseJson(result);
                    var name = null;
                    var display = null;
                    var post = null;
                    for (var i = 0, len = result.length; i < len; i++) {
                        post = result[i].post;
                        name = result[i].name;
                        display = result[i].name;
                        if(post && post.length > 0){
                            display = name + "（" + post + "）";
                        }
                        result[i]._name = name;
                        result[i].name = display;
                    }
                    if (userCache) {
                        if (!SelectPersonBiz.personMap) {
                            SelectPersonBiz.personMap = {};
                        }
                        SelectPersonBiz.personMap[orgObj.id + '_' + orgObj.typeFlag] = result;
                    }
                    callback && callback(result);
                } else {
                    oui.alert("获取联系人数据失败");
                }
            });
        }
    };


    SelectPersonBiz.clearCache = function () {
        SelectPersonBiz.firstDepartMent = null;
        SelectPersonBiz.allDepartments = null;
        SelectPersonBiz.departmentMap = null;
        SelectPersonBiz.personMap = null;
    };

    /**
     * 获取组织机构
     * @param type
     * @param id
     * @param callback
     * @param otherParam
     * @param isClickDepartment 是否是第一层
     */
    SelectPersonBiz.getOrg = function (type, id, callback, otherParam, isClickDepartment) {
        if (!type) return;

        var param = {
            type: type
        };
        param.otherParam = type;
        if (id) {
            param.id = id;
            param.otherParam = type + id;
        }

        $.extend(true, param, otherParam);

        if (type === oui.ORG_TYPE_ENUM.company || type === oui.ORG_TYPE_ENUM.department) {
            if (SelectPersonBiz.departmentMap) {
                if (type === oui.ORG_TYPE_ENUM.company || isClickDepartment) {
                    callback && callback(SelectPersonBiz.firstDepartMent);
                } else if (type === oui.ORG_TYPE_ENUM.department) {
                    if (SelectPersonBiz.departmentMap[param.id]["children"]) {
                        callback && callback(SelectPersonBiz.departmentMap[param.id]["children"]);
                    } else {
                        callback && callback([]);
                    }
                }
            } else {
                oui.getData(getSeverURL("getOrg", param), {}, function (res) {
                    if (res.success) {
                        var result = res.msg;
                        result = oui.parseJson(result);
                        var newArray = [];
                        var tmpMap = {};
                        var i, len;
                        for (i = 0, len = result.length; i < len; i++) {
                            tmpMap[result[i]["id"]] = result[i];
                        }
                        for (i = 0, len = result.length; i < len; i++) {
                            if (tmpMap[result[i]["parentId"]] && result[i]["id"] !== result[i]["parentId"]) {
                                if (!tmpMap[result[i]["parentId"]]["children"]) {
                                    tmpMap[result[i]["parentId"]]["children"] = [];
                                }
                                tmpMap[result[i]["parentId"]]["children"].push(result[i]);
                            } else {
                                newArray.push(result[i]);
                            }
                        }
                        var departResult = [];
                        for (i = 0, len = newArray.length; i < len; i++) {
                            departResult.push($.extend(true, {}, newArray[i], {children: (newArray[i].children && newArray[i].children.length)}));
                        }
                        SelectPersonBiz.firstDepartMent = departResult;
                        SelectPersonBiz.allDepartments = result;
                        SelectPersonBiz.departmentMap = tmpMap;
                        callback && callback(departResult);
                    } else {
                        callback && callback([]);
                        console.log(res);
                    }
                });
            }
        } else {
            if (SelectPersonBiz[type + "Map"]) {
                if (isClickDepartment) {
                    callback && callback(SelectPersonBiz["first" + type]);
                } else {
                    if (SelectPersonBiz[type + "Map"][param.id]["children"]) {
                        callback && callback(SelectPersonBiz[type + "Map"][param.id]["children"]);
                    } else {
                        callback && callback([]);
                    }
                }
            } else {
                oui.getData(getSeverURL("getOrg", param), {}, function (res) {
                    if (res.success) {
                        var result = res.msg;
                        result = oui.parseJson(result);
                        var newArray = [];
                        var tmpMap = {};
                        var i, len;
                        for (i = 0, len = result.length; i < len; i++) {
                            tmpMap[result[i]["id"]] = result[i];
                        }
                        for (i = 0, len = result.length; i < len; i++) {
                            if (tmpMap[result[i]["parentId"]] && result[i]["id"] !== result[i]["parentId"]) {
                                if (!tmpMap[result[i]["parentId"]]["children"]) {
                                    tmpMap[result[i]["parentId"]]["children"] = [];
                                }
                                tmpMap[result[i]["parentId"]]["children"].push(result[i]);
                            } else {
                                newArray.push(result[i]);
                            }
                        }
                        var departResult = [];
                        for (i = 0, len = newArray.length; i < len; i++) {
                            departResult.push($.extend(true, {}, newArray[i], {children: (newArray[i].children && newArray[i].children.length)}));
                        }
                        SelectPersonBiz["first" + type] = departResult;
                        SelectPersonBiz["all" + type] = result;
                        SelectPersonBiz[type + "Map"] = tmpMap;
                        callback && callback(departResult);
                    } else {
                        callback && callback([]);
                        console.log(res);
                    }
                });
            }
        }
    };

    SelectPersonBiz.getChildDepartmentByOrg = function (org) {
        if (org.typeFlag === oui.ORG_TYPE_ENUM.department) {
            if (SelectPersonBiz.departmentMap) {
                if (SelectPersonBiz.departmentMap[org.id]["children"]) {
                    return SelectPersonBiz.departmentMap[org.id]["children"];
                }
            }
        }
        return [];
    };

    SelectPersonBiz.getChildByOrg = function (org) {
        if (SelectPersonBiz[org.typeFlag + "Map"]) {
            if (SelectPersonBiz[org.typeFlag + "Map"][org.id]["children"]) {
                return SelectPersonBiz[org.typeFlag + "Map"][org.id]["children"];
            }
        }
        return [];
    };

    /**
     * 根据组织机构对象获取所有的子机构（子部门，部门下的人）
     * @param org
     * @param callback
     * @param noNeedPerson
     */
    SelectPersonBiz.getChildOrgByOrg = function (org, callback, noNeedPerson) {
        if (org.typeFlag === oui.ORG_TYPE_ENUM.department || org.typeFlag === oui.ORG_TYPE_ENUM.company) {
            SelectPersonBiz.getOrg(oui.ORG_TYPE_ENUM.department, org.id, function (_departResult) {
                var departResult = [];
                for (var i = 0, len = _departResult.length; i < len; i++) {
                    departResult.push($.extend(true, {}, _departResult[i], {children: (_departResult[i].children && _departResult[i].children.length)}));
                }
                if (noNeedPerson) {
                    callback && callback(departResult);
                } else {
                    SelectPersonBiz.getPersonByOrgObj(org, function (personResult) {
                        var allOrg = [].concat(departResult);
                        allOrg = allOrg.concat(personResult);
                        callback && callback(allOrg);
                    });
                }
            });
        }
    };

    SelectPersonBiz.getParentsById = function (id, deptArray) {
        var deptMap = SelectPersonBiz.departmentMap;
        if (deptMap) {
            var dept = deptMap[id];
            if (dept) {
                deptArray.push(dept);
                if (dept.parentId !== dept.id) {
                    SelectPersonBiz.getParentsById(dept.parentId, deptArray);
                }
            }
        }
        return deptArray;
    };

    /**
     * 获取相对角色
     * @param callback
     */
    SelectPersonBiz.getRelativeRoles = function (callback) {
        var _relativeRoleArray = [];
        for (var key in relativeRoles) {
            if (relativeRoles.hasOwnProperty(key)) {
                _relativeRoleArray.push({
                    id: key,
                    name: relativeRoles[key],
                    typeFlag: oui.ORG_TYPE_ENUM.relativeRole
                });
            }
        }
        callback && callback(_relativeRoleArray);
    };

    /**
     * 索搜接口（组织机构搜索）
     * @param type
     * @param keyword
     * @param id 部门id
     * @param callback
     */
    SelectPersonBiz.searchByName4Org = function (type, keyword, id, callback) {
        if (keyword.length <= 0) {
            oui.alert("请输入搜索内容");
            return;
        }
        if (!type) {
            return;
        }
        var param = {
            type: type ? type : '',
            name: keyword,
            deptId: id || ''
        };

        param.otherParam = param.type + param.name + param.deptId;

        oui.getData(getSeverURL("searchByName", param), {}, function (res) {
            if (res.success) {
                var result = res.msg;
                result = oui.parseJson(result);
                // result = result.sort(function (a, b) {
                //     return a.name.localeCompare(b.name)
                // });
                callback && callback(result);
            } else {
                console.log(res);
            }
        });
    };

    SelectPersonBiz.search4Extend = function (type, keyword, callback) {
        if (keyword.length <= 0) {
            oui.alert("请输入搜索内容");
            return;
        }
        if (!type) {
            return;
        }
        var newResult = [], newObj = null, i, len;
        if (SelectPersonBiz[type]) {
            var d = SelectPersonBiz[type];
            if (keyword && keyword.length > 0) {
                for (i = 0, len = d.length; i < len; i++) {
                    newObj = d[i];
                    if (newObj.name.indexOf(keyword) > -1) {
                        newResult.push(newObj);
                    }
                }
            } else {
                newResult = d;
            }
            callback && callback(newResult);
        }
    };

    /**
     * 获取tab数据
     * @param tab
     * @param callback
     */
    SelectPersonBiz.getDataByExtendTab = function (tab, callback) {
        if (tab.url && typeof tab.url === "string") {
            oui.getData(tab.url, {}, function (res) {
                if (res.success) {
                    var result = res.msg;
                    result = oui.parseJson(result);
                    SelectPersonBiz[tab.type] = result;
                    callback && callback(result);
                } else {
                    callback && callback([]);
                }
            });
        } else if (tab.data) {
            SelectPersonBiz[tab.type] = tab.data;
            callback && callback(tab.data);
        } else {
            callback && callback([]);
        }
    };

    oui.SelectPersonBiz = SelectPersonBiz;
})(jQuery, document, oui);





