/**
 * Created by oui on 2016/4/6.
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
     * @type {{getTeams: string, getContact: string}}
     */
    var ServiceApi = {
        getTeams: oui_url.selectPerson_getTeams,//获取所有群组的接口
        getContact: oui_url.selectPerson_getContact,//获取所有联系人的接口
        getPerson: oui_url.selectPerson_getPerson,//获取人接口
        searchByName: oui_url.selectPerson_searchByName,//获取组织对象根据name（搜索接口）
        searchByName4Contact: oui_url.selectPerson_searchByName4Contact,//联系人的搜索根据name（搜索接口）
        getOrg: oui_url.selectPerson_getOrg,//获取组织机构(id不传代表，type:company获取所有部门，传了id，type：department代表获取子部门)
        userId2AccountId:oui_url.selectPerson_userId2AccountId,
        accountId2UserId:oui_url.selectPerson_accountId2UserId
    };

    /**
     * 根据key 获取请求服务器地址
     * @param key
     * @param params
     * @returns {*}
     */
    var getSeverURL = function (key, params) {
        var url = ServiceApi[key];
        // if (url) {
        //     url = oui.getContextPath() + url;
        // }

        if (params) {
            params = $.param(params);
            url += "&" + params;
        }
        return url;
    };

    var SelectPersonBiz = {};

    /**
     * 根据当前人员获取所有组
     * @param orgObj
     * @param callback
     */
    SelectPersonBiz.getTeams = function (orgObj, callback) {
        oui.getData(getSeverURL("getTeams"), {}, function (res) {
            if (res.success) {
                var result = res.msg;
                result = oui.parseJson(result);
                result = result.sort(function (a, b) {
                    return a.name.localeCompare(b.name)
                });
                SelectPersonBiz.teamsData = result;
                callback && callback(result);
            } else {
                oui.alert("获取个人组数据失败");
            }
        });
    };

    /**
     * 根据当前人员获取联系人
     * @param orgObj
     * @param callback
     */
    SelectPersonBiz.getContact = function (orgObj, callback) {
        oui.getData(getSeverURL("getContact"), {}, function (res) {
            if (res.success) {
                var result = res.msg;
                result = oui.parseJson(result);
                result = result.sort(function (a, b) {
                    return a.name.localeCompare(b.name)
                });
                SelectPersonBiz.contactData = result;
                callback && callback(result);
            } else {
                oui.alert("获取联系人数据失败");
            }
        });
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
     * 根据组织对象获取人
     * @param orgObj
     * @param callback
     * @param otherParam
     */
    SelectPersonBiz.getPersonByOrgObj = function (orgObj, callback, otherParam) {
        orgObj = oui.parseJson(orgObj);
        var param = {};
        if (orgObj) {
            param = {
                type: orgObj.typeFlag,
                id: orgObj.id,
                otherParam: orgObj.id + orgObj.typeFlag
            };
        }
        // if (dataType) {
        //     param.dataType = dataType;
        // }
        $.extend(true, param, otherParam);
        //getSeverURL("getPerson", param)
        //oui.getData(oui.getContextPath() + "/res_apps/test/selectPerson/person.json", {}, function (res) {
        oui.getData(getSeverURL("getPerson", param), {}, function (res) {
            if (res.success) {
                var result = res.msg;
                result = oui.parseJson(result);
                // result = result.sort(function (a, b) {
                //     return a.name.localeCompare(b.name)
                // });
                callback && callback(result);
            } else {
                oui.alert("获取组织机构人员数据失败");
            }
        });
    };

    /**
     * 获取组织机构
     * @param type
     * @param id
     * @param callback
     * @param otherParam
     */
    SelectPersonBiz.getOrg = function (type, id, callback, otherParam) {
        if (!type) return;

        var param = {
            type: type
        };
        param.otherParam = type;
        if (id) {
            param.id = id;
            param.otherParam = param.type + id;
        }

        $.extend(true, param, otherParam);


        //getSeverURL("getOrg", param
        //oui.getData(oui.getContextPath() + "/res_apps/test/selectPerson/department.json", {}, function (res) {
        oui.getData(getSeverURL("getOrg", param), {}, function (res) {
            if (res.success) {
                var result = res.msg;
                result = oui.parseJson(result);
                // result = result.sort(function (a, b) {
                //     return a.name.localeCompare(b.name)
                // });
                callback && callback(result);
            } else {
                callback && callback([]);
                console.log(res);
            }
        });
    };

    /**
     * 索搜接口
     * @param type
     * @param keyword
     * @param callback
     * @param otherParam
     */
    SelectPersonBiz.search = function (type, keyword, callback, otherParam) {
        var self = this;
        if (!type) {
            return;
        }
        var param = {
            type: type,
            name: keyword,
            otherParam: type + keyword
        };
        $.extend(true, param, otherParam);

        var newResult = [], newObj = null, i, len;
        switch (type) {
            case oui.ORG_TYPE_ENUM.team://搜索组不存在，只存在搜索人
            case oui.ORG_TYPE_ENUM.contact:
                if (self.contactData) {
                    if (keyword && keyword.length > 0) {
                        for (i = 0, len = self.contactData.length; i < len; i++) {
                            newObj = self.contactData[i];
                            if (newObj.name.indexOf(keyword) > -1) {
                                newResult.push(newObj);
                            }
                        }
                    } else {
                        newResult = self.contactData;
                    }
                    callback && callback(newResult);
                } else {
                    oui.getData(getSeverURL("searchByName4Contact", param), {}, function (res) {
                        if (res.success) {
                            var result = res.msg;
                            result = oui.parseJson(result);
                            result = result.sort(function (a, b) {
                                return a.name.localeCompare(b.name)
                            });
                            callback && callback(result);
                        } else {
                            console.log(res);
                        }
                    });
                }
                break;
            default :
                if (oui.ORG_TYPE_ENUM[type]) {
                    oui.getData(getSeverURL("searchByName", param), {deptId: otherParam.deptId || ''}, function (res) {
                        if (res.success) {
                            var result = res.msg;
                            result = oui.parseJson((result == null || result === "null") ? "[]" : result);
                            callback && callback(result);
                        } else {
                            console.log(res);
                        }
                    });
                } else {
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
                }
                break;
        }
    };

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
     * 检查选中的人员是否在我们的帐号体系内
     * @param result
     * @param callback
     * @param filterSelf
     */
    SelectPersonBiz.userId2AccountId = function (result, filterSelf, callback) {
        callback && callback({data: result});
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
                    oui.alert(res);
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
})
(jQuery, document, oui);





