/**
 * Created by oui on 2016/4/6.
 */
(function ($, oui) {


    var SELECT_PERSON_MAXSIZE = 400;

    //缓存选人组件界面的html结构
    var selectPersonMainFrameHTML = null;

    //选人对象类型枚举
    oui.ORG_TYPE_ENUM = {
        all: "all",//全体人员
        person: "person",//人员
        department: "department",//部门
        company: "company",//单位
        group: "group",//集团
        level: "level",//职务级别
        post: "post",//岗位
        role: "role",//角色
        relativeRole: "relativeRole",//相对角色
        orgTeam: "orgTeam",//组织机构组
        team: "team",//组
        contact: "contact"//联系人
    };

    oui.RANGE_TYPE = {
        company: 'company',
        currentDept: 'currentDept'
    };

    oui.SP_SEARCH_TYP_EENUM = {
        TEAM_PERSON: 'team_person',//团队选人
        ORG_PERSON: 'org_person'//组织机构选人
    };

    var selectPerson4AppClz = function (cfg) {
        oui.$.ctrl.ouiformcontrol.call(this, cfg);
    };

    /**
     *
     * @param options
     *   {
     *       tabs: '1,2',
     *       fillback: [],//回填选中数据
     *       maxSize: -1,//选人多少限制
     *       attr: {},
     *       duplicate: true,//是否允许重复
     *       afterInit: oui._noop,//初始化完成
     *       beforeSelect: oui._noop,//从左到右的移过去前拦截 返回false将不会移动过去
     *       afterSelect: oui._noop,//从左到右的移过去后拦截
     *       callbackOk: oui._noop,//确定回调 返回false将不会关闭窗口
     *       callbackCancel: oui._noop,//取消回调
     *       }
     * @param isClient isClient
     */
    oui._selectPerson = function (options, isClient) {
        var _options = {

            includeChildType: 1, //包含子节点类型,0 给出提示让用户自己选择，1 不包含任何子部门 ,默认 0

            filterSelf: true,//过滤自己

            showType: 0,// 0 联系人人的选择 1 联系人组的选择 2 联系人组和人选择 3 组织机构的选人 4 组织机构的选择 5 组织机构选择和选人

            isAll: true,//是否允许全选

            onlyRange: false,//是否置顶范围 只允许在传入部门的id下进行选择，部门id不传则此属性不生效

            rangeId: 'company',//范围Id,company 则代表全部,currentDept 当前登陆人Id,其他则代表固定部门Id 如果onlyRange为false该id只打开的时候展开到那一级;

            allowCompany: false,//是否允许选择单位（根节点）

            enableSelectNoGroup: true,//启用选择未分组

            defaultTabIndex: 1,

            tabs: '3,4,5,6,7,1,2',

            chooseType: null,//自定义选择类型

            fillback: [],//回填选中数据

            isMulti: true, // 是否多选

            maxSize: -1,//选人多少限制

            isFlow: false,

            extend: null,

            afterInit: oui._noop,//初始化完成

            beforeSelect: oui._noop,//从左到右的移过去前拦截 返回false将不会移动过去

            afterSelect: oui._noop,//从左到右的移过去后拦截

            callbackOk: oui._noop,//确定回调 返回false将不会关闭窗口

            callbackCancel: oui._noop,//取消回调
        };

        _options = $.extend(true, _options, options);

        var chooseType4Param = _options.chooseType;

        //根据showType 设置chooseType 参数，此参数不对外暴露
        var chooseType = [];
        switch (_options.showType || 0) {
            case 0:
                chooseType.push(oui.ORG_TYPE_ENUM.contact);
                break;
            case 1:
                chooseType.push(oui.ORG_TYPE_ENUM.team);
                break;
            case 2:
                chooseType.push(oui.ORG_TYPE_ENUM.contact);
                chooseType.push(oui.ORG_TYPE_ENUM.team);
                break;
            case 3:
                chooseType.push(oui.ORG_TYPE_ENUM.person);
                _options.allowCompany = false;
                break;
            case 4:
                chooseType.push(oui.ORG_TYPE_ENUM.department);
                chooseType.push(oui.ORG_TYPE_ENUM.relativeRole);
                chooseType.push(oui.ORG_TYPE_ENUM.level);
                chooseType.push(oui.ORG_TYPE_ENUM.post);
                chooseType.push(oui.ORG_TYPE_ENUM.role);
                _options.isAll = false;
                break;
            case 5://这里可以代表全部都可以选择
                break;
            case 6://这里代表自定义chooseType
                chooseType = [];
                var tempChooseType = [];
                if (chooseType4Param && chooseType4Param.length > 0) {
                    tempChooseType = chooseType4Param.split(",");
                }
                for(var i = 0,len = tempChooseType.length;i < len;i++){
                    var typeEnumKey = tempChooseType[i];
                    if(typeEnumKey !== 'all' && typeEnumKey !== 'company' && typeEnumKey !== 'group' && typeEnumKey !== 'orgTeam'){
                        if(oui.ORG_TYPE_ENUM[typeEnumKey]){
                            chooseType.push(typeEnumKey);
                        }
                    }
                }
                if(!chooseType || chooseType.length <= 0){
                    oui.getTop().oui.alert("请传入选择类型");
                    return;
                }
                break;
            default:
                break;
        }

        _options = $.extend(true, _options, {"chooseType": chooseType});
        if (_options.showType && _options.showType >= 3) {
            //FIXME 企业微信使用我们自己的选人界面 2018-3-14
            // navigator.userAgent.indexOf("wxwork") > -1
            if (isClient) {
                oui.$.ctrl.dialog.SelectPersonDialog = new selectPerson4AppClz(_options);
                selectPerson4App(_options);
                return oui.$.ctrl.dialog.SelectPersonDialog;
            }
        }
        _options.isFlow = (_options.isFlow + "" !== "false");

        if(!selectPersonMainFrameHTML){
            selectPersonMainFrameHTML = oui.loadUrl(oui_url.selectPerson);
        }

        var SelectPersonDialog = oui.showHTMLDialog4Div({  //创建唯一SelectPerson弹出框对象
            content: selectPersonMainFrameHTML,
            isClose: false
        });

        SelectPersonDialog.attr("selectPersonOptions", _options);
        SelectPersonDialog.attr(_options);

        oui.$.ctrl.dialog.SelectPersonDialog = SelectPersonDialog;

        oui.SelectPerson.init(SelectPersonDialog.attr("selectPersonOptions"));

        return SelectPersonDialog;
    };

    oui.selectPerson = function (options) {
        return oui._selectPerson(options, false);
    };

    oui.selectPerson4Client = function (options) {
        return oui._selectPerson(options, true);
    };

    oui.selectPerson.TypeEnum = {
        COMMON: 0,//普通选人
        FLOW: 1//流程选人
    };

    var selectPersonVo = function (obj, type) {
        if (oui.appType.qing || oui.appType.enterpriseKdweibo) {
            this.name = obj.name;
            this.id = obj.openId;
            //this.icon = obj.avatarUrl;
            this.typeFlag = oui.ORG_TYPE_ENUM.person;
        } else if (oui.appType.enterpriseWechat) {
            this.name = obj.name;
            this.id = obj.id;
            this.typeFlag = type;
        } else if (oui.appType.dingtalk) {
            this.name = obj.name;
            this.id = (type == oui.ORG_TYPE_ENUM.person ? obj.emplId : obj.id);
            this.typeFlag = type;
            //this.icon = (type == oui.ORG_TYPE_ENUM.person ? obj.avatar : "");
        } else if (oui.appType.qyquan) { /*企业圈、M3*/
            this.name = obj.name;
            this.id = obj.accNbr;
            this.typeFlag = oui.ORG_TYPE_ENUM.person;
        } else if (oui.appType.m3) {
            this.name = obj.name;
            this.id = obj.id;
            this.typeFlag = oui.ORG_TYPE_ENUM.person;
        }
    };

    /**
     * 端的选人结果转成oui结果
     * @param items
     * @param type
     */
    var appSpData2OuiVo = function (items, type) {
        if (!items) return [];
        var currentClientContext = oui.getCurrentClientContext();
        var i, len, newItems = [], newItem;
        if (currentClientContext && currentClientContext.selectPersonConfig) {
            var selectPersonConfig = currentClientContext.selectPersonConfig;
            if (selectPersonConfig && selectPersonConfig.selectPersonVo) {
                for (i = 0, len = items.length; i < len; i++) {
                    newItem = selectPersonConfig.selectPersonVo(items[i], type);
                    newItems.push(newItem);
                }
                return newItems;
            }
        }
        for (i = 0, len = items.length; i < len; i++) {
            newItem = new selectPersonVo(items[i], type);
            newItems.push(newItem);
        }
        return newItems;
    };

    oui.appSpData2OuiVo = appSpData2OuiVo;

    /**
     * 检查选中的人员是否在我们的帐号体系内
     * @param result
     * @param callback
     * @param filterSelf
     */
    var checkSelectPersons = function (result, filterSelf, callback) {
        if (result && result.length > 0) {
            var param = {
                filterSelf: !!filterSelf
            };
            //if (result == 'all') {//如果是全选
            //    //param['type'] = "all";
            //
            //    callback && callback({data: [allResult]});
            //} else {
            var __appName = oui.appType.qing ? "云表单" : "云积木";
            param['users'] = result;

            oui.postData(oui_url.selectPerson_userId2AccountId, param, function (res) {
                res = oui.parseJson(res);
                if (res.success) {
                    var data = res.msg;
                    data = oui.parseJson(data);
                    var notInsideList = data.notInsidePersonList;
                    if (notInsideList.length > 0) {
                        var notInsideNameStr = [];
                        var notInsideName4DeptStr = [];
                        var notVo = null;
                        for (var i = 0, len = notInsideList.length; i < len; i++) {
                            notVo = notInsideList[i];
                            if (notVo.typeFlag === oui.ORG_TYPE_ENUM.person) {
                                notInsideNameStr.push(notVo["name"]);
                                // notInsideNameStr += notVo["name"] + ",";
                            } else {
                                notInsideName4DeptStr.push(notVo["name"]);
                                // notInsideName4DeptStr += notVo["name"] + ",";
                            }
                        }
                        var msgTips = "";
                        if (notInsideNameStr.length > 0 && notInsideName4DeptStr.length > 0) {
                            msgTips = "选择部门或人员未授权同步到当前应用的组织架构内，无法选择。";
                        } else {
                            if (notInsideNameStr.length > 0) {
                                msgTips = notInsideNameStr.join(",") + "未授权同步到当前应用的组织架构内，无法选择。";
                            }
                            if (notInsideName4DeptStr.length > 0) {
                                msgTips = notInsideName4DeptStr.join(",")+ "部门未授权同步到当前应用的组织架构内，无法选择。";
                            }
                        }

                        oui.alert(msgTips, function () {
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
            //}
        } else {
            callback && callback({data: result});
        }
    };

    /**
     * accountId转成userId
     * @param result
     * @param callback
     */
    var accountId2userId = function (result, callback) {
        if (result && result.length > 0) {
            var param = {};
            param['users'] = result;
            oui.postData(oui_url.selectPerson_accountId2UserId, param, function (res) {
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

    var selectPerson4App = function (options) {
        var maxSize = options.maxSize;
        var filterSelf = (options.filterSelf + "" != "false");
        var isMulti = (options.isMulti + "" != "false");//!(maxSize == 1);
        if ((isMulti && maxSize <= 1) || maxSize > SELECT_PERSON_MAXSIZE) {
            maxSize = SELECT_PERSON_MAXSIZE;
        }
        if (!isMulti) {
            maxSize = 1;
        }

        var isAll = (options.isAll + "" == "true");
        var allowCompany = (options.allowCompany+"" === "true");
        var _callbackOk = options.callbackOk;
        options.callbackOk = function (obj) {
            obj = obj || {data: []};
            if (options.isFlow) {
                obj.flowType = 1;//默认串发
            }
            _callbackOk && _callbackOk(obj);
        };
        var selectTypes = options.chooseType;
        var canSelectUser = true;
        var canSelectDep = true;
        if (selectTypes && selectTypes.length > 0) {
            if (selectTypes.indexOf(oui.ORG_TYPE_ENUM.person) < 0) {
                canSelectUser = false;
            }
            if (selectTypes.indexOf(oui.ORG_TYPE_ENUM.department) < 0) {
                canSelectDep = false;
            }
        }

        var maxSizeErrorTip = "";
        if (canSelectUser && !canSelectDep) {
            maxSizeErrorTip = "选择人员不能超过" + maxSize + "人";
        } else if (canSelectDep && !canSelectUser) {
            maxSizeErrorTip = "选择部门不能超过" + maxSize + "个";
        } else {
            maxSizeErrorTip = "选择部门和人员不能超过" + maxSize + "项";
        }

        var _fillbackData = options.fillback;

        //将回填数据中的accountId转化成openId
        accountId2userId(_fillbackData, function (fillbackData) {
            var selectedDepIds = [];
            var selectedUserIds = [];
            //组装回填值
            try {
                if (fillbackData && fillbackData.length > 0) {
                    var item = null;
                    for (var i = 0, len = fillbackData.length; i < len; i++) {
                        item = fillbackData[i];
                        var itemOpenIDs = item.id.split("_");
                        var id = itemOpenIDs[itemOpenIDs.length - 1];
                        if (item.typeFlag == oui.ORG_TYPE_ENUM.person) {
                            selectedUserIds.push(id);
                        } else if (item.typeFlag == oui.ORG_TYPE_ENUM.department) {
                            selectedDepIds.push(id);
                        }else if(item.typeFlag == oui.ORG_TYPE_ENUM.company || item.typeFlag == oui.ORG_TYPE_ENUM.all){
                            selectedDepIds.push(id);
                        }
                    }
                }
            } catch (e) {
                oui.alert("回调数据出错" + oui.parseString(e));
            }
            var currentClientContext = oui.getCurrentClientContext();
            if (currentClientContext && currentClientContext.selectPersonConfig) {
                var selectPersonConfig = currentClientContext.selectPersonConfig;
                if (selectPersonConfig) {
                    selectPersonConfig.callSelectFunc(options, {
                        canSelectUser: canSelectUser,
                        canSelectDep: canSelectDep,
                        isMulti: isMulti,
                        maxSize: maxSize,
                        maxSizeErrorTip: maxSizeErrorTip,
                        selectedDepIds: selectedDepIds,
                        selectedUserIds: selectedUserIds,
                        isAll: isAll,
                        allowCompany:allowCompany
                    }, function (spDatas) {
                        checkSelectPersons(spDatas, filterSelf, options.callbackOk);
                    });
                }
            }
        });
    };
})(jQuery, oui);
/************ oui-form 控件  ***************/
(function (win) {
    /*******************************依赖的Js类 start***********************************************************/
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    /*******************************依赖的Js类 end************************************************************/

    var selectPersonAttrs = "includeChildType,enableSelectNoGroup,tabs,chooseType,defaultTabIndex,maxSize,isMulti,isAll,allowCompany";


    /**
     * 控件类构造器
     */
    var SelectPerson = function (cfg) {
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",otherAttrs,fillback,filterSelf,tabs,chooseType,isMulti,extend,isAll,allowCompany";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
        /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */
        this.init = init;
        this.showSelectPerson = showSelectPerson;
        this.getData4DB = getData4DB;
        this.getDisplay4readOnly = getDisplay4readOnly;
        this.setValue = setValue;
        /***************************三 控件的自定义函数:根据具体控件业务场景开发和暴露对象api ************************/

    };
    ctrl["selectperson"] = SelectPerson;

    /*******************************实现控件类的静态属性:类全名、类名、父类属性、html模板定义(控件类.templateHtml 格式固定) start****************/
    SelectPerson.FullName = "oui.$.ctrl.selectperson";//设置当前类全名 静态变量
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    SelectPerson.templateHtml = [];

    SelectPerson.templateHtml[0] =
        '<input type="hidden" validate="{{validate}}" targetHighBorderEl="oui.getNS().$(\'#oui_selectperson_{{id}}\')" id="{{id}}" name="{{name}}" value="{{value}}" />\
        <div id="oui_selectperson_{{id}}" class="{{isMulti ? \'multi-\':\'\'}}personarea" onclick="oui.getByOuiId({{ouiId}}).showSelectPerson(this);">{{oui.getByOuiId(ouiId).getDisplay4readOnly();}}</div>\
        <i class="right-arrow"></i>\
        ';

    SelectPerson.templateHtml[1] = SelectPerson.templateHtml[0];
    SelectPerson.templateHtml[2] = SelectPerson.templateHtml[0];
    SelectPerson.templateHtml[3] = SelectPerson.templateHtml[0];
    SelectPerson.templateHtml[4] = SelectPerson.templateHtml[0];
    SelectPerson.templateHtml[5] = SelectPerson.templateHtml[0];
    SelectPerson.templateHtml[6] = SelectPerson.templateHtml[0];


    SelectPerson.templateHtml4readOnly = [];
    SelectPerson.templateHtml4readOnly[0] = '{{oui.getByOuiId(ouiId).getDisplay4readOnly();}}';

    SelectPerson.templateHtml4readOnly[1] = SelectPerson.templateHtml4readOnly[0];//联系人
    SelectPerson.templateHtml4readOnly[2] = SelectPerson.templateHtml4readOnly[0];//联系人和组
    SelectPerson.templateHtml4readOnly[3] = SelectPerson.templateHtml4readOnly[0];//组织机构人
    SelectPerson.templateHtml4readOnly[4] = SelectPerson.templateHtml4readOnly[0];//组织机构 机构
    SelectPerson.templateHtml4readOnly[5] = SelectPerson.templateHtml4readOnly[0];//组织机构 机构 和人
    SelectPerson.templateHtml4readOnly[6] = SelectPerson.templateHtml4readOnly[0];//组织机构 机构 和人

    /** 创建 编辑不可改，浏览可提交的控件模板 指定为同一个模板******/
    Control.buildTemplate(SelectPerson,'edit4ReadOnly,edit4View','0,1,2,3,4,5,6',SelectPerson.templateHtml4readOnly[0]);

    var init = function () {
        var data = this.attr('data');
        if (!data) {
            data = '[]';
        }
        data = oui.parseJson(data);
        this.attr('data', data);
        var value = this.attr("value");
        if(value){
            var data4DB = this.attr("data4DB");
            data4DB = oui.parseJson(data4DB || '{}');
            if(typeof data4DB === 'object'){
                data4DB = data4DB.items;
            }
            if(!data4DB){
                data4DB = [];
            }
            if (data4DB && data4DB.length > 0) {
                this.attr("data", data4DB);
            }
            // else {
            //     this.attr("value","");
            // }
        }
        var fillback = this.attr("fillback");
        if (fillback === undefined || fillback === "undefined" || fillback === "") {
            this.attr("fillback", true);
        }
        var otherAttrs = oui.parseJson(this.attr("otherAttrs") || "{}");
        var isMulti = this.attr("isMulti");
        if(typeof isMulti !== 'undefined' && (isMulti+"").length > 0 ){
            this.attr("isMulti", isMulti+"" === "true");
        } else {
            this.attr("isMulti", otherAttrs['isMulti'] + "" === "true");
        }
        this.attr("isAll", otherAttrs['isAll'] + "" === "true");
        this.attr("allowCompany", otherAttrs['allowCompany'] + "" === "true");
    };

    //打开选人界面
    var showSelectPerson = function (obj) {
        var self = this,
            showType = parseInt(this.attr("showType") || 0),
            value = this.attr("value"),
            data = oui.parseJson(this.attr("data") || '[]'),
            fillback = this.attr("fillback"),
            filterSelf = this.attr("filterSelf"),
            tabs = this.attr("tabs") || "",
            sExtend = this.attr("extend") || "{}",
            otherAttrs = this.attr("otherAttrs") || "{}",
            chooseType = this.attr("chooseType");
        var right = self.attr("right");
        if (right === "preview") {
            return false;
        }

        if ((fillback === "true" || fillback === "fillback" || fillback === true) && data.length > 0) {
            fillback = data;
        } else {
            fillback = [];
        }

        var spPrivateAttrs = selectPersonAttrs.split(",");
        var _options = {};
        for (var i = 0, len = spPrivateAttrs.length; i < len; i++) {
            if (typeof this.attr(spPrivateAttrs[i]) !== "undefined" && (this.attr(spPrivateAttrs[i]) + "").length > 0) {
                _options[spPrivateAttrs[i]] = this.attr(spPrivateAttrs[i]);
            }
        }

        otherAttrs = oui.parseJson(otherAttrs);

        for (var key in otherAttrs) {
            if (typeof otherAttrs[key] !== "undefined" && (otherAttrs[key] + "").length > 0) {
                _options[key] = otherAttrs[key];
            }
        }

        var controlOptions = {};
        if (tabs.length > 0) {
            controlOptions["tabs"] = tabs;
        }
        if (sExtend) {
            controlOptions["extend"] = oui.parseJson(sExtend);
        }
        if (filterSelf.length > 0) {
            controlOptions["filterSelf"] = filterSelf;
        }
        if (showType + '' === '3') {
            _options.isAll = false;
        } else if (showType + '' === '4') {
            _options.allowCompany = false;//选部门控件不允许选择单位
        }
        //
        // if (typeof _options['rangeId'] === 'undefined' || _options['rangeId'] === "") {
        //     _options['rangeId'] = oui.RANGE_TYPE.currentDept;
        // }

        var rangeType = otherAttrs.rangeType;
        if (rangeType === "company") {//如果全部选人
            _options["onlyRange"] = false;
            _options["rangeId"] = oui.RANGE_TYPE.currentDept;//不限定范围，但是展开当前部门
        } else if (rangeType === "currentDept") {
            _options["onlyRange"] = true;
            _options["rangeId"] = oui.RANGE_TYPE.currentDept;//不限定范围，但是展开当前部门
        } else if (rangeType === "formControl") {
            _options["onlyRange"] = true;
            var deptId = "";
            var flag = false;//标记是否能找到选部门控件
            var data4DB = null;
            var item = null;
            var selectDeptControl = oui.getById(otherAttrs.rangeId);
            if (selectDeptControl) {//源控件不存在页面上，说明当前表单是明细表，且不是原样表单
                deptId = selectDeptControl.getValue();
                if (deptId) {
                    data4DB = selectDeptControl.getData4DB();
                    try {
                        item = data4DB.items[0];
                    }catch (e){
                    }
                    if(item && item.typeFlag !== oui.ORG_TYPE_ENUM.company){
                        flag = true;
                        _options["rangeId"] = selectDeptControl.getValue();
                    }
                }
            } else {
                var tableOuiId = self.attr("tableOuiId");
                var table = oui.getByOuiId(tableOuiId);
                var $tr = $(self.getEl()).closest(".oui-table-grid-row");
                if(table && $tr.length > 0){
                    var _trIndex = $tr.index();
                    var index = _trIndex - 1;
                    var _data = table.attr("data");
                    var row = _data[index];
                    if(row[otherAttrs.rangeId]){//选部门控件是明细表的
                        selectDeptControl = oui.getByOuiId(row[otherAttrs.rangeId].controlOuiId);
                        if(selectDeptControl){
                            deptId = selectDeptControl.getValue();
                            if (deptId) {
                                data4DB = selectDeptControl.getData4DB();
                                try {
                                    item = data4DB.items[0];
                                }catch (e){
                                }
                                if(item && item.typeFlag !== oui.ORG_TYPE_ENUM.company){
                                    flag = true;
                                    _options["rangeId"] = selectDeptControl.getValue();
                                }
                            }
                        }
                    }
                }
            }
            if(!flag){
                _options["onlyRange"] = false;
                _options["rangeId"] = oui.RANGE_TYPE.currentDept;//不限定范围，但是展开当前部门
            }
        } else if (rangeType === "fixedDept") {
            _options["onlyRange"] = true;
            _options["rangeId"] = otherAttrs.rangeId;
        } else {
            _options["onlyRange"] = false;
            _options["rangeId"] = oui.RANGE_TYPE.currentDept;//不限定范围，但是展开当前部门
        }


        if(this.attr("isMulti")+"" === "true"){
            _options.maxSize = 50;
        }
        oui.selectPerson($.extend(true, {
            showType: showType,
            fillback: fillback,
            callbackOk: function (result) {
                var data = result.data;
                var ids = [];
                if (data && data.length > 0) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        ids.push(data[i].id);
                    }
                }

                self.attr("value", ids.join(","));
                self.attr("data", data);
                self.render();
                self.triggerUpdate();
                self.triggerAfterUpdate();
                oui.validate($(self.getEl()).find('#' + self.attr('id'))[0]);
            }
        }, controlOptions, _options));
        //
        //oui.selectPerson({
        //    showType: showType,
        //    fillback: fillback,
        //    filterSelf: !(filterSelf + "" == "false"),
        //    callbackOk: function (result) {
        //        var data = result.data;
        //        self.attr("value", oui.parseString(data));
        //        self.attr("data", data);
        //        self.render();
        //        oui.validate($(self.getEl()).find('#' + self.attr('id'))[0])
        //    }
        //});
        return false;
    };

    var setValue = function (v) {
        this.attr('value', v);
        if (!v) {
            this.attr('data', '[]');
        }
        this.render();
        this.triggerAfterUpdate();
    };

    var getDisplay4readOnly = function () {
        var d = this.attr('data');
        d = oui.parseJson(d);
        var showTextArray = [];
        var v = this.attr("value");
        for (var i = 0, len = d.length; i < len; i++) {
            if (v.indexOf(d[i].id) > -1) {
                showTextArray.push(oui.escapeStringToHTML(d[i].name));
            }
        }
        return showTextArray.join(",");
    };

    var getData4DB = function () {
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var d = this.attr('data');
        var v = this.attr('value');
        d = oui.parseJson(d || '[]');
        var newD = [];
        for (var i = 0, len = d.length; i < len; i++) {
            if (v.indexOf(d[i].id) > -1) {
                newD.push(d[i]);
            }
        }
        data4DB.items = newD;
        return data4DB;
    };

})(window);;
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
})(jQuery, document, oui);;
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

})(jQuery, document, oui);;
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





