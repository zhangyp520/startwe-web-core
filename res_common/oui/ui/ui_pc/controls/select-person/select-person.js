/**
 * 选人js
 */
(function ($, oui) {

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
        //team4Org: "team4Org"//企业组
    };

    oui.RANGE_TYPE = {
        company: 'company',
        currentDept: 'currentDept'
    };

    /**
     *
     * @param options
     *   {
            tabs: '1,2',
            fillback: [],//回填选中数据
            maxSize: -1,//选人多少限制
            attr: {},
            duplicate: true,//是否允许重复
            afterInit: oui._noop,//初始化完成
            beforeSelect: oui._noop,//从左到右的移过去前拦截 返回false将不会移动过去
            afterSelect: oui._noop,//从左到右的移过去后拦截
            callbackOk: oui._noop,//确定回调 返回false将不会关闭窗口
            callbackCancel: oui._noop,//取消回调
            }
     */


    oui.selectPerson = function (options) {

        var _options = {

            includeChildType: 1, //包含子节点类型,0 给出提示让用户自己选择，1 包含任何子部门 ,默认 1

            showType: 0,// 0 联系人人的选择 1 联系人组的选择 2 联系人组和人选择 3 组织机构的选人 4 组织机构的选择 5 组织机构选择和选人

            isAll: true,//选择第一级第一个部门节点是否是全选人员

            allowCompany: false, //是否允许选择单位(根节点)

            onlyRange: false,//是否置顶范围 只允许在传入部门的id下进行选择，部门id不传则此属性不生效

            rangeId: 'company',//范围Id,company 则代表全部,currentDept 当前登陆人Id,其他则代表固定部门Id 如果onlyRange为false该id只打开的时候展开到那一级;

            defaultTabIndex: 1,

            tabs: '3,4,5,6,7,8,1,2',

            chooseType: null,//自定义选择类型

            filterSelf: true,//过滤自己

            enableSelectNoGroup: true,//启用选择未分组

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
        switch (parseInt(_options.showType || "0")) {
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

        _options.defaultTabIndex = parseInt(_options.defaultTabIndex || "1");

        var SelectPersonDialog = oui.$.ctrl.dialog.SelectPersonDialog;
        SelectPersonDialog = oui.showUrlDialog({  //创建唯一SelectPerson弹出框对象
            contentStyle: 'width:808px;height:547px',
            url: oui_url.selectPerson + "&d=" + new Date().getTime(),
            isHideFooter: true,
            isHideHeader: true
        });

        setTimeout(function () {
            $(SelectPersonDialog.getEl()).find(".oui-dialog-area").css("background", "none");
            $(SelectPersonDialog.getEl()).find(".oui-dialog-iframe-content").css("background", "none");
        }, 10);

        SelectPersonDialog.attr("selectPersonOptions", _options);
        SelectPersonDialog.attr(_options);

        oui.getTop().oui.$.ctrl.dialog.SelectPersonDialog = SelectPersonDialog;
        return SelectPersonDialog;
    };

    oui.selectPerson.TypeEnum = {
        COMMON: 0,//普通选人
        FLOW: 1//流程选人
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
     *  oui.getFormData() 提交后台则返回 {code:'',value:''} 作为display传入后端 ,code 为验证码 value为电话号码
     * 控件类构造器
     */
    var SelectPerson = function (cfg) {
        //TODO 内嵌
        /***************************一 控件必须实现:控件继承call ****/
        Control.call(this, cfg);//必须继承控件超类
        /***************************二 控件可选实现:控件的自定义属性attrs、控件初始化函数init ***********************/
        this.attrs = this.attrs + ",otherAttrs,fillback,filterSelf,tabs,chooseType,isMulti,extend,isAll,allowCompany,includeChildType";//当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
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
        '<input type="hidden" validate="{{validate}}" targetHighBorderEl="#oui_selectperson_{{id}}" id="{{id}}" name="{{name}}" value="{{value}}" />\
        <div id="oui_selectperson_{{id}}" class="{{isMulti?\'multi-\':\'\'}}personarea" onclick="oui.getByOuiId({{ouiId}}).showSelectPerson(this);">{{oui.getByOuiId(ouiId).getDisplay4readOnly();}}</div>\
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
    Control.buildTemplate(SelectPerson, 'edit4ReadOnly,edit4View', '0,1,2,3,4,5,6', SelectPerson.templateHtml4readOnly[0]);

    var init = function () {
        // this.attr('data', this.attr('value'));
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
            /*else {
                this.attr("value","");
            }*/
        }

        var fillback = this.attr("fillback");
        if (fillback === undefined || fillback === "undefined" || fillback === "") {
            this.attr("fillback", true);
        }

        var otherAttrs = oui.parseJson(this.attr("otherAttrs") || "{}");
        var isMulti = this.attr("isMulti");
        if (typeof isMulti !== 'undefined' && (isMulti + "").length > 0) {
            this.attr("isMulti", isMulti + "" === "true");
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
            data = oui.parseJson(this.attr("data") || "[]"),
            fillback = this.attr("fillback"),
            filterSelf = this.attr("filterSelf"),
            tabs = this.attr("tabs") || "",
            sExtend = this.attr("extend") || "{}",
            otherAttrs = this.attr("otherAttrs") || "{}";

        var right = self.attr("right");
        if (right === "preview" || right === "design") {
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

        var _oui = oui.getTop().oui || oui;
        var controlOptions = {};
        if (tabs.length > 0) {
            controlOptions["tabs"] = tabs;
        }
        if (filterSelf.length > 0) {
            controlOptions["filterSelf"] = filterSelf;
        }

        if (sExtend) {
            controlOptions["extend"] = oui.parseJson(sExtend);
        }

        if (showType + '' === '3') {
            _options.isAll = false;
        } else if (showType + '' === '4') {
            _options.allowCompany = false;//选部门控件不允许选择单位
        }

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

        if (this.attr("isMulti") + "" === "true") {
            _options.maxSize = 50;
        }

        _oui.selectPerson($.extend(true, {
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
        var v = this.attr("value");
        d = oui.parseJson(d);
        var showTextArray = [];
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


})(window);





