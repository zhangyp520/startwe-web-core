!(function(win){
    var Validator = {
        config:{},
        keys:[],
        addConfig:function(key,cfg){
            var me = this;
            if(key&&key.indexOf(',')>0){//可以配置多个key到同一个配置上
                var keys = key.split(',');
                for(var i= 0,len=keys.length;i<len;i++){
                    me.addConfig(keys[i],cfg);
                }
                return ;
            }
            if(this.keys.indexOf(key)<0){
                this.keys.push(key);
                this.keyString = this.keys.join(',');
            }
            //TODO 根据key进行分组，用于 校验遍历时，控制具体需要校验的属性，无需遍历所有属性
            this.config[key]= {
                key:key,
                validate:cfg,
                check:function(value){
                    var arr = [];
                    if(typeof value !='undefined'){
                        var key = this.key;
                        var result = oui.validate4message(value,this.validate);
                        if(!result.success){
                            arr.push({
                                key:key,
                                msg:result.msg
                            });
                        }
                    }
                    return arr;
                }
            };
        },
        /** 遍历对象 进行属性校验****/
        check:function(data,oneErrorBreak,paramPath){
            if(!paramPath){
                paramPath = "";
            }
            var me = this;
            var config = me.config;
            var messages = [];
            for(var key in data){
                var curr = data[key];
                var currPath = paramPath;
                if(!currPath){
                    currPath = key;
                }else{
                    currPath+='.'+key;
                }
                var currConfig = config[currPath];

                if(currConfig){
                    messages = messages.concat(currConfig.check(curr));
                    if(oneErrorBreak){
                        if(messages&&messages.length){
                            return messages;
                        }
                    }
                }

                if(curr &&(typeof curr =='object')){

                    if((curr instanceof Array)){
                        if(me.keyString.indexOf(currPath+'[*]')<0){
                            continue;
                        }
                        for(var index= 0,len=curr.length;index<len;index++){
                            messages = messages.concat(me.check(curr[index],oneErrorBreak,currPath+'[*]'));
                            if(oneErrorBreak){
                                if(messages&&messages.length){
                                    return messages;
                                }
                            }
                        }
                    }else{

                        /** 处理当前对象****/
                        messages = messages.concat(me.check(curr,oneErrorBreak,currPath));
                        if(oneErrorBreak){
                            if(messages&&messages.length){
                                return messages;
                            }
                        }
                        if(me.keyString.indexOf(currPath+'[*]')<0){
                            continue;
                        }
                        for(var childKey in curr){
                            messages = messages.concat(me.check(curr[childKey],oneErrorBreak,currPath+'[*]'));
                            if(oneErrorBreak){
                                if(messages&&messages.length){
                                    return messages;
                                }
                            }
                        }
                    }
                }
            }
            return messages;
        },
        checkControl:function(control,oneErrorBreak){
            return this.check(control,oneErrorBreak,"controls[*]");
        },
        findCheckMessage:function(path,data){
            /** 以控件开始的属性校验****/
            var tempKey =path;
            var messages = [];
            var currConfig  = this.config[path];
            var me = com.oui.absolute.AbsoluteDesign;
            if(currConfig){
                if(path.indexOf('controls[*]')>=0){
                    if(data && data.currentControl && (data.controls.indexOf(data.currentControl)>-1) ){
                        //验证控件
                        tempKey = path.replace('controls[*].','');
                        messages = currConfig.check(oui.JsonPathUtil.getJsonByPath(tempKey,data.currentControl));
                    }else if(data && (!oui.isEmptyObject(data.currentControl))){
                        //验证全局控件设置
                        if(me.state !='draggingField'){
                            tempKey = path.replace('controls[*].','');
                            messages = currConfig.check(oui.JsonPathUtil.getJsonByPath(tempKey,data.currentControl));
                        }
                    }
                }else{
                    //表单属性校验
                    messages = currConfig.check(oui.JsonPathUtil.getJsonByPath(tempKey,data));
                }
            }
            if(messages&&messages.length){
                return messages[0].msg||'';
            }
            return '';
        }
    };

    //content,selectContent 由后端校验 TODO

    // 属性路径 配置 校验信息
    Validator.addConfig("name",{
        require: true
        ,require_error_msg:'表单标题必填'
        , maxLength_error_msg: '表单标题字符数不能大于{{validateValue}}'
        , maxLength: 40 // 表单标题最多字数
    });
    Validator.addConfig("description",{
        maxLength_error_msg: '表单描述字符数不能大于{{validateValue}}'
        , maxLength: 500 // 表单描述最多字数
    });
    Validator.addConfig("style.bgImgName",{
        maxLength_error_msg: '表单背景图名称符数不能大于{{validateValue}}'
        , maxLength: 30 // 表单背景图名称
    });
    Validator.addConfig("style.bgImg",{//TODO

    });

    Validator.addConfig("style.bgImgFillType",{ //填充类型
        require:true,
        require_error_msg:'表单背景图填充类型不能为空',
        maxLength_error_msg: '表单背景图填充类型字符数不能大于{{validateValue}}'
        , maxLength: 10 // 表单背景图填充 方式 repeat,cover,center
    });

    Validator.addConfig("style.backgroundColor",{
        maxLength_error_msg: '表单背景颜色字符数不能大于{{validateValue}}'
        , maxLength: 10
    });

    Validator.addConfig("style.width",{
        title:'表单宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 10

    });
    Validator.addConfig("style.height",{
        title:'表单高度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 10
    });
    Validator.addConfig("style.paperType",{
        title:'表单尺寸类型'
        ,require:true
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 10
    });

    Validator.addConfig("style.cellType",{
        title:'表单尺寸单位类型'
        ,require:true
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 5
    });

    // TODO 全局 样式具体属性 校验
    Validator.addConfig("innerStyle.styleTitle",{

    });

    Validator.addConfig("innerStyle.styleFieldOuter",{

    });
    Validator.addConfig("innerStyle.styleField",{

    });
    //控件相关 属性校验
    Validator.addConfig("controls[*].id",{
        title:'控件Id'
        ,require:true
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 30
    });

    Validator.addConfig("controls[*].name",{
        title:'控件名称'
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 30
    });
    Validator.addConfig("controls[*].title",{
        title:'控件标题'
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 50
    });

    Validator.addConfig("controls[*].description",{
        title:'控件描述'
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 100
    });
    Validator.addConfig("controls[*].htmlType",{
        title:'控件类型'
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 20
    });
    Validator.addConfig("controls[*].controlType",{
        title:'控件业务类型'
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 30
    });
    Validator.addConfig("controls[*].fieldType",{
        title:'控件字段类型'
        ,maxLength_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxLength: 20
    });

    Validator.addConfig("controls[*].showType",{
        title:'控件显示类型'
        ,require:true
        ,maxValue_error_msg: '{{title}}值不能大于{{validateValue}}'
        , maxValue: 20
    });
    Validator.addConfig("controls[*].formField",{
        title:'是否是表单字段'
        ,maxValue_error_msg: '{{title}}字符数不能大于{{validateValue}}'
        , maxValue: 10
    });
    Validator.addConfig("controls[*].style.left",{
        title:'控件距左'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: -20000

    });

    Validator.addConfig("controls[*].style.top",{
        title:'控件距上'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: -20000

    });

    Validator.addConfig("controls[*].style.width",{
        title:'控件宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 30
    });

    Validator.addConfig("controls[*].style.height",{
        title:'控件高度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 30
    });
    Validator.addConfig("controls[*].style.borderRadius,innerStyle.style.borderRadius",{
        title:'控件圆角设置'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 10000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0
    });

    Validator.addConfig("controls[*].style.borderLeftWidth,innerStyle.style.borderLeftWidth",{
        title:'控件左边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0
    });

    Validator.addConfig("controls[*].style.borderTopWidth,innerStyle.style.borderTopWidth",{
        title:'控件上边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0

    });

    Validator.addConfig("controls[*].style.borderRightWidth,innerStyle.style.borderRightWidth",{
        title:'控件右边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0

    });

    Validator.addConfig("controls[*].style.borderBottomWidth,innerStyle.style.borderRightWidth",{
        title:'控件下边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0

    });

    //- 边框颜色----------------------
    Validator.addConfig("controls[*].style.borderLeftColor",{
        title:'控件左边框颜色'
        ,maxLength_error_msg: '边框颜色字符数不能大于{{validateValue}}'
        ,maxLength:10
    });

    Validator.addConfig("controls[*].style.borderTopColor",{
        title:'控件上边框颜色'
        ,maxLength_error_msg: '边框颜色字符数不能大于{{validateValue}}'
        ,maxLength:10

    });

    Validator.addConfig("controls[*].style.borderRightColor",{
        title:'控件右边框颜色'
        ,maxLength_error_msg: '边框颜色字符数不能大于{{validateValue}}'
        ,maxLength:10

    });

    Validator.addConfig("controls[*].style.borderBottomColor",{
        title:'控件下边框颜色'
        ,maxLength_error_msg: '边框颜色字符数不能大于{{validateValue}}'
        ,maxLength:10
    });

    //----------------------------

    Validator.addConfig("controls[*].innerStyle.styleFieldOuter",{

    });

    Validator.addConfig("controls[*].innerStyle.styleField",{

    });

    Validator.addConfig("controls[*].innerStyle.styleField.borderRadius,innerStyle.styleField.borderRadius",{
        title:'控件值圆角设置'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 10000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0
    });
    Validator.addConfig("controls[*].innerStyle.styleTitle.fontSize,innerStyle.styleTitle.fontSize",{
        title:'标题字体大小'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        ,maxValue:99
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        ,minValue:12
    });

    Validator.addConfig("controls[*].innerStyle.styleField.fontSize,innerStyle.styleField.fontSize",{
        title:'控件值字体大小'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        ,maxValue:99
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        ,minValue:12
    });

    //控件值 边框设置--------------------
    Validator.addConfig("controls[*].innerStyle.styleField.borderLeftWidth,innerStyle.styleField.borderLeftWidth",{
        title:'控件左边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0
    });

    Validator.addConfig("controls[*].innerStyle.styleField.borderTopWidth,innerStyle.styleField.borderTopWidth",{
        title:'控件上边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0

    });

    Validator.addConfig("controls[*].innerStyle.styleField.borderRightWidth,innerStyle.styleField.borderRightWidth",{
        title:'控件右边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0

    });

    Validator.addConfig("controls[*].innerStyle.styleField.borderBottomWidth,innerStyle.styleField.borderBottomWidth",{
        title:'控件下边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0

    });
    //控件值 边框设置结束--------------------
    Validator.addConfig("controls[*].otherAttrs",{

    });
    Validator.addConfig("otherAttrs",{

    });

    //-------全局设置 校验--------------------------
    Validator.addConfig("innerStyle.style.borderRadius",{
        title:'控件圆角设置'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 10000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0
    });
    Validator.addConfig("innerStyle.styleField.borderRadius",{
        title:'控件值圆角设置'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 10000
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 0
    });
    //------ 临时属性 校验-----------------------
    Validator.addConfig('tempControl.style._borderWidth',{
        title:'控件边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 1
    });
    Validator.addConfig("tempControl.innerStyle.styleField._borderWidth",{
        title:'控件值边框宽度'
        ,maxValue_error_msg: '{{title}}不能大于{{validateValue}}'
        , maxValue: 20
        ,minValue_error_msg: '{{title}}不能小于{{validateValue}}'
        , minValue: 1
    });
    com.oui.absolute.AbsoluteDesign.Validator = Validator;

})(window);

