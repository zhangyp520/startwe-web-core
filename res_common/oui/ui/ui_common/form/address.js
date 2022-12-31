/**
 * Created by oui on 2016/3/31.
 */
(function (win) {
    var ctrl = oui.$.ctrl;
    var Control = ctrl.ouiformcontrol;
    var ProvinceData = oui.ProvinceData;
    var CityData = oui.CityData;
    var CountyData = oui.CountyData;
    /***省-市-区 属性 ***/
    var AddressProps= ['province','city','county'];
//控件构造器
    var Address = function (cfg) {
        Control.call(this, cfg);//执行控件类公共的构造函数,1,初始化对象属性默认值,基本函数attr 2,初始化构造参数
        this.attrs = this.attrs + ',value,data';
        this.init = init;
        this.afterRender = afterRender;
        this.afterRender4Design = afterRender;
        this.getProvinceData = getProvinceData;
        this.getCityData = getCityData;
        this.getCountyData = getCountyData;
        this.updateAddress = updateAddress;
        this.updateValue = updateValue;
        /**onAfterUpdate 事件绑定 ***/
        this.updateAddressAfter =updateAddressAfter;
        this.getDisplay4ReadOnly = getDisplay4ReadOnly;
        this.getData4DB = getData4DB;
        this.getValueByAddressData = getValueByAddressData;
        this.initAddressPropValue = initAddressPropValue;
        /** 根据地址控件属性获取 子枚举项列表***/
        this.getEnumDataByAddressProp = getEnumDataByAddressProp;

    };

    Address.FullName = "oui.$.ctrl.address";//设置当前类全名
    ctrl["address"] = Address;//将控件类指定到特定命名空间下
    /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
    Address.templateHtml = [];
    /** 省-市-区-地址 ***/
    Address.templateHtml[0] = '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '省:<oui-form id="province-{{id}}" validate="{{validate}}" otherAttrs="{addressOuiId:{{ouiId}} }" type="singleselect" hideInput="true" showType="0" data="[]" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" value="{{provinceValue}}" ></oui-form> '+

        '市:<oui-form id="city-{{id}}" validate="{{validate}}" parentControlId="province-{{id}}" type="singleselect" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" hideInput="true" showType="0" data="[]" value="{{cityValue}}" ></oui-form> '+

        '区:<oui-form id="county-{{id}}" parentControlId="city-{{id}}" type="singleselect" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress"  onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" hideInput="true" showType="0" data="[]" value="{{countyValue}}" ></oui-form> '+

        '地址:<oui-form id="address-{{id}}" validate="{{validate}}" type="textfield" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" value="{{oui.escapeStringToHTML(address)}}" ></oui-form> '+
        '';
    /** 省-市-区 ***/
    Address.templateHtml[1] =  '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '省:<oui-form id="province-{{id}}" validate="{{validate}}" otherAttrs="{addressOuiId:{{ouiId}} }" type="singleselect" hideInput="true" showType="0" data="[]" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" value="{{provinceValue}}" ></oui-form> '+

        '市:<oui-form id="city-{{id}}" validate="{{validate}}" parentControlId="province-{{id}}" type="singleselect" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" hideInput="true" showType="0" data="[]" value="{{cityValue}}" ></oui-form> '+

        '区:<oui-form id="county-{{id}}"  parentControlId="city-{{id}}" type="singleselect" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" hideInput="true" showType="0" data="[]" value="{{countyValue}}" ></oui-form> '
    ;
    /** 省-市 ***/
    Address.templateHtml[2] =  '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '省:<oui-form id="province-{{id}}" validate="{{validate}}" otherAttrs="{addressOuiId:{{ouiId}} }" type="singleselect" hideInput="true" showType="0" data="[]" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" value="{{provinceValue}}" ></oui-form> '+
        '市:<oui-form id="city-{{id}}" validate="{{validate}}" parentControlId="province-{{id}}" type="singleselect" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" hideInput="true" showType="0" data="[]" value="{{cityValue}}" ></oui-form> ';

    /** 省 ***/
    Address.templateHtml[3] =  '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '省:<oui-form id="province-{{id}}" otherAttrs="{addressOuiId:{{ouiId}} }" type="singleselect" hideInput="true" showType="0" data="[]" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" value="{{provinceValue}}" ></oui-form> ';
    /** 市 ***/
    Address.templateHtml[4] =  '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
        '市:<oui-form id="city-{{id}}" type="singleselect" otherAttrs="{addressOuiId:{{ouiId}}}" ' +
        'onUpdate="oui.getByOuiId({{ouiId}}).updateAddress" onAfterUpdate="oui.getByOuiId({{ouiId}}).updateAddressAfter" hideInput="true" showType="0" data="[]" value="{{cityValue}}" ></oui-form> ';

    /*********************控件初始化***********/
    var init = function(){
        /***初始化属性 provinceValue,cityValue,countyValue,address ***/
        //data4db
        var data4DB = this.attr('data4DB');
        if(data4DB){
            if(data4DB !='{}' && data4DB!='[]'){
                data4DB= oui.parseJson(data4DB);
                this.attr('data',data4DB);
            }
        }
        this.initAddressPropValue();
        var v = this.getValueByAddressData();
        this.attr('value',v);
    };
    /**** 初始化 属性值 ***/
    var initAddressPropValue = function(){
        var keys = AddressProps;
        var data = this.attr('data')||'{}';
        data = oui.parseJson(data);
        var _self =this;
        for(var i= 0,len=keys.length;i<len;i++){
            var propObj = data[keys[i]] ||{} ;
            _self.attr(keys[i]+'Value',propObj.value ||'');
        }
        _self.attr('address',data.address ||'');
        _self.attr('data',data);
    };
    /****获取value在枚举中的索引 ***/
    var getEnumIndexByValue = function(data,value){
        if(!value){
            return -1;
        }
        for(var i= 0,len=data.length;i<len;i++){
            if(data[i].value == value){
                return i;
            }
        }
        return -1;
    };
    /***获取 json对象 **/
    var getData4DB = function(){
        var data4DB = Control.getProtoType().getData4DB.call(this);
        var data = this.attr("data");
        data = oui.parseJson(data || '{}');
        for(var key in data){
            data4DB[key] = data[key];
        }
        return data4DB;
    };

    /***根据control下拉框控件值 更新到 地址控件中对应的属性 province,city,county **/
    var updateAddressMap = function(addressControl,control){
        var currId = control.attr('id');
        var data = addressControl.attr('data') ||{};
        /***更新详细地址信息 ***/
        if(currId.indexOf('address-')==0){
            /** 详细信息***/
            var addressValue = control.attr('value');
            addressControl.attr('address',addressValue);
            data.address = addressValue;
        }else{
            /****更新 省-市-区 信息 ****/
            var idPrefixs=AddressProps;
            var propKey ='';
            for(var i= 0,len=idPrefixs.length;i<len;i++){
                if(currId.indexOf(idPrefixs[i]+'-')==0){
                    propKey =idPrefixs[i];
                    break;
                }
            }
            /***如果没有更改对应的属性 则退出 ****/
            if(!propKey){
                return ;
            }
            /***当前控件枚举值 **/
            var enumValue = control.attr('value');
            var enumData = control.attr('data');
            addressControl.attr(propKey+'Value',enumValue);
            var idx = getEnumIndexByValue(enumData,enumValue);
            if(idx>=0){
                data[propKey] = {
                    id:enumData[idx].id,
                    value:enumData[idx].value,
                    py:enumData[idx].py,
                    display:enumData[idx].display
                };
            }else{
                data[propKey] = {
                    id:'',
                    value:'',
                    display:'',
                    py:''
                };
            }
        }
        /***最后将data设置到地址控件上 **/
        addressControl.attr('data',data);
    };
    /*** 更新value值 **/
    var updateAddress = function(control){
        if(!control){
            return ;
        }
        var otherAttrs = control.attr('otherAttrs') ||'{}';
        otherAttrs = oui.parseJson(otherAttrs);
        var addressOuiId = otherAttrs.addressOuiId;
        if(!addressOuiId){
            return ;
        }
        var addressControl = oui.getByOuiId(addressOuiId);
        if(!addressControl){
            return ;
        }
        var currId = control.attr('id');
        /** 省份信息***/
        var data = addressControl.attr('data') ||{};
        /*** 同步 省-市-区下拉枚举对象到 地址控件 **/
        updateAddressMap(addressControl,control);

        addressControl.updateValue();
    };
    /**触发 当前地址控件的 更新后事件 ***/
    var updateAddressAfter = function(control){
        if(!control){
            return ;
        }
        var otherAttrs = control.attr('otherAttrs') ||'{}';
        otherAttrs = oui.parseJson(otherAttrs);
        var addressOuiId = otherAttrs.addressOuiId;
        if(!addressOuiId){
            return ;
        }
        var addressControl = oui.getByOuiId(addressOuiId);
        if(!addressControl){
            return ;
        }
        addressControl.triggerAfterUpdate();
    };
    /***浏览态查看 ****/
    var getDisplay4ReadOnly = function(){
        return oui.escapeHTMLToString(this.attr('value'));
    };
    /*** 根据地址的data属性获取 value 拼接****/
    var getValueByAddressData =function(){
        var data = this.attr('data')||{} ;
        var newValue='';
        var newValueArr =[];
        var keys =AddressProps;
        for(var i= 0,len=keys.length;i<len;i++){
            var key = keys[i];
            if(data[key] && data[key].id){
                newValueArr.push(data[key].display);
            }
        }
        var address = $.trim(data.address||'');
        if(address){
            newValueArr.push(address);
        }
        newValue = newValueArr.join(' ');
        return newValue;
    };

    /** 更新value***/
    var updateValue = function(){
        var lastValue = this.attr('value');
        var newValue =  this.getValueByAddressData();
        if(lastValue != newValue){
            this.attr('value',newValue);
            // '<input type="hidden" id="{{id}}" name="{{name}}" value="{{value}}" validate="{{validate}}" />' +
            $(this.getEl()).find('#'+this.attr('id')).val(newValue);
            //执行 更新触发事件
            this.triggerUpdate();
        }
    };

    /** 获取省的数据***/
    var getProvinceData = function(){
        return ProvinceData;
    };
    /*** 根据当前 地址属性获取 子集合枚举 ***/
    var getEnumDataByAddressProp = function(prop){
        var arr = [];
        if(!prop){
            return arr;
        }
        var propValue = this.attr(prop+'Value');
        if(!propValue){
            return arr;
        }
        var data=[];
        var childrenData=[];
        switch( prop){
            case 'province':
                data = ProvinceData;
                childrenData = CityData;
                break;
            case'city':
                data = CityData;
                childrenData = CountyData;
                break;
            case 'county':
                data =CityData;
                break;
        }
        /***获取父枚举中的索引 **/
        var idx = getEnumIndexByValue(data,propValue);
        var currPro = data[idx];// 获取当前 父枚举的枚举项
        //根据当前父枚举Id在子枚举中过滤
        for(var i= 0,len = childrenData.length;i<len;i++){
            if(childrenData[i].parentId == currPro.id){
                arr.push(childrenData[i]);
            }
        }
        return arr;
    };
    /**获取市的数据 ***/
    var getCityData = function(){
        /** 根据父枚举属性获取子枚举列表***/
        return this.getEnumDataByAddressProp('province');
    };

    /**获取区域数据 ***/
    var getCountyData = function(){
        /** 根据父枚举属性获取子枚举列表***/
        return this.getEnumDataByAddressProp('city');
    };

    /** 控件渲染完成后***/
    var afterRender = function(){
        if(!ProvinceData){
            ProvinceData = oui.ProvinceData;
            CityData = oui.CityData;
            CountyData = oui.CountyData;
            var _self = this;
            oui.require([oui.getContextPath()+'res_common/oui/ui/ui_common/form/address-data.js'],function(){
                _self.afterRender();
            },function(){
                console.log('加载资源失败：'+oui.getContextPath()+'res_common/oui/ui/ui_common/form/address-data.js');
            },true);
            return ;
        }
        this.initAddressPropValue();
        var el =this.getEl();
        var id = this.attr('id');
        $(el).find('oui-form').each(function(){
            oui.parseByDom(this);
        });

        var provinceControl = oui.getById('province-'+id);
        var cityControl =  oui.getById('city-'+id);
        var countControl = oui.getById('county-'+id);
        var addressDetailControl = oui.getById('address-'+id);
        var showType = this.attr('showType')+'';
        showType = parseInt(showType);
        provinceControl&&provinceControl.attr('oldData',ProvinceData);
        cityControl&&cityControl.attr('oldData',CityData);
        countControl&&countControl.attr('oldData',CountyData);

        /***省市区 地址 值设置 ****/
        provinceControl&&provinceControl.attr('value',this.attr("provinceValue"));
        cityControl&&cityControl.attr('value',this.attr("cityValue"));
        countControl&&countControl.attr('value',this.attr("countyValue"));
        addressDetailControl&&addressDetailControl.attr('value',this.attr('address'));
        addressDetailControl&&addressDetailControl.render();
        switch (showType){
            case 0:
            case 1:
                provinceControl&&provinceControl.attr('data',this.getProvinceData());
                cityControl&&cityControl.attr('data',this.getCityData());
                countControl&&countControl.attr('data',this.getCountyData());
                break;
            case 2:
                provinceControl&&provinceControl.attr('data',this.getProvinceData());
                cityControl&&cityControl.attr('data',this.getCityData());
                break;
            case 3:
                provinceControl&&provinceControl.attr('data',this.getProvinceData());
                break;
            case 4:
                cityControl&&cityControl.attr('data',CityData);
                break;
        }

        provinceControl&&provinceControl.render();
        cityControl&&cityControl.render();
        countControl&&countControl.render();

    };
    /***********************************控件事件***********************************/


})(window);





