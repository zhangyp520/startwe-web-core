(function(win){
    win.shapeTplCfg = {	'tpl-line-next' :
    ''+
    '{{if data.html }}'+
    '<div id="line-text-{{data.id}}" from-shape-id="{{data.fromShapeId}}" to-shape-id="{{data.toShapeId}}" line-id="{{data.lineId || data.id}}"  class="oui-line-text line-next {{data.cls}}" style="position: absolute;left:{{data.centerPoint.x}}px;top:{{data.centerPoint.y}}px;z-index:{{data.zIndex?data.zIndex+1:1}}">'+
    '<div class="text {{data.textCls}}" from-shape-id="{{data.fromShapeId}}" to-shape-id="{{data.toShapeId}}"  line-text-id="{{data.lineId || data.id}}"  '+
    'oui-e-click="{{data.click4text}}" oui-e-mouseenter="{{data.mouseenter4text}}" oui-e-mouseleave="{{data.mouseleave4text}}"  >{{data.html}}</div>'+
    '</div>'+
    '{{/if}}'+
    '',
        'tpl-line' :
        ''+
        '<div id="line-{{data.id}}" from-shape-id="{{data.fromShapeId}}" to-shape-id="{{data.toShapeId}}" line-id="{{data.lineId||data.id}}" oui-e-click="{{data.click}}" oui-e-mouseenter="{{data.mouseenter}}" oui-e-mouseleave="{{data.mouseleave}}"'+
        'class="oui-shape-line app-form-line {{data.hasRelation?"app-form-relation-line":""}} {{data.cls}}" style="left:{{data.left}}px;top:{{data.top}}px;width:{{data.width}}px;">'+
        '<style type="text/css" >'+
        '#line-{{data.id}}{' +
        'position:absolute;'+
        'border-bottom: {{data.lineHeight}}px {{data.lineStyle}} {{data.color}};'+
        '-webkit-transform:rotate({{data.rotate}}deg);'+
        '-moz-transform:rotate({{data.rotate}}deg);'+
        '-ms-transform:rotate({{data.rotate}}deg);'+
        '-o-transform:rotate({{data.rotate}}deg);'+
        'transform:rotate({{data.rotate}}deg);'+
        'z-index:{{data.zIndex}};'+
        '}'+
        '</style>'+
        ''+
        '{{if data.hasArrow}}'+
        '<div class="right-triangle {{if !data.hasArrow}}display_none{{/if}}"'+
        'style="border-top: {{(data.lineHeight+14)/2}}px {{data.lineStyle}} transparent;border-left: {{data.lineHeight+14}}px {{data.lineStyle}} {{data.color}}; border-bottom: {{(data.lineHeight+14)/2}}px {{data.lineStyle}} transparent; position: absolute; right: -{{(data.lineHeight+14)}}px; top: 50%;margin-top: -{{((data.lineHeight+14)-data.lineHeight)/2}}px;"></div>'+
        '{{/if}}'+
        '{{if data.hasFromArrow}}'+
        '<div class="left-triangle {{if !data.hasFromArrow}}display_none{{/if}}"'+
        'style="border-bottom: {{(data.lineHeight+14)/2}}px {{data.lineStyle}} transparent;border-right: {{data.lineHeight+14}}px {{data.lineStyle}} {{data.color||"blue"}}; border-top: {{(data.lineHeight+14)/2}}px {{data.lineStyle}} transparent; position: absolute; left: -{{(data.lineHeight+14)}}px; top: 50%;margin-top: -{{((data.lineHeight+14)-data.lineHeight)/2}}px;"></div>'+
        '{{/if}}'+
        '{{if data.isSmoothingPoints}}'+
        '<div class="right-circle" style="position: absolute;right:-{{data.lineHeight/2}}px;top:0px;width:{{data.lineHeight}}px;height:{{data.lineHeight}}px; -moz-border-radius:{{data.lineHeight/2}}px;-webkit-border-radius:{{data.lineHeight/2}}px;border-radius:{{data.lineHeight/2}}px;background: {{data.color}};z-index:{{data.zIndex}};">'+
        '</div>'+
        '{{/if}}'+
        '</div>'+
        '',
        'tpl-circle' :
        ''+
        '<div id="circle-{{data.id}}"   targets-json="{{data.targetsJson}}" to-ids="{{data.toIds.join(",")}}"  oui-e-click="{{data.click}}" oui-e-mouseenter="{{data.mouseenter}}" oui-e-mouseleave="{{data.mouseleave}}"'+
        'class="oui-shape app-form-circle  {{data.cls}}" style="left:{{data.left}}px;top:{{data.top}}px;width:{{data.r*2}}px;height:{{data.r*2}}px; -moz-border-radius:{{data.r+data.borderWidth}}px;-webkit-border-radius:{{data.r+data.borderWidth}}px;border-radius:{{data.r+data.borderWidth}}px;background: {{data.background}};border:{{data.borderWidth}}px {{data.borderStyle}} {{data.borderColor}};z-index:{{data.zIndex}};">'+
        ''+
        '{{if data.html}}'+
        '<div id="circle-text-{{data.id}}" class="oui-shape-text"><div class="text" style="max-height: {{data.r*2*70/100}}px">{{data.html}}</div> </div>'+
        '{{/if}}'+
        '</div>'+
        '',
        'tpl-shape' :
        ''+
        '<div id="shape-{{data.id}}"  targets-json="{{data.targetsJson}}" to-ids="{{data.toIds.join(",")}}"  oui-e-click="{{data.click}}" oui-e-mouseenter="{{data.mouseenter}}" oui-e-mouseleave="{{data.mouseleave}}"'+
        'class="oui-shape {{data.cls}}" style="left:{{data.left}}px;top:{{data.top}}px;width:{{data.width}}px;height:{{data.height}}px; -moz-border-radius:{{data.borderRadius}}px;-webkit-border-radius:{{data.borderRadius}}px;border-radius:{{data.borderRadius}}px;background: {{data.background}};border:{{data.borderWidth}}px {{data.borderStyle}} {{data.borderColor}};z-index:{{data.zIndex}}">'+
        '{{if data.html}}'+
        '{{=data.html}}'+
        '{{/if}}'+
        '</div>'+
        '',
        'tpl-rect' :
        ''+
        '<div id="rect-{{data.id}}"  targets-json="{{data.targetsJson}}" to-ids="{{data.toIds.join(",")}}"  oui-e-click="{{data.click}}" oui-e-mouseenter="{{data.mouseenter}}" oui-e-mouseleave="{{data.mouseleave}}"'+
        'class="oui-shape app-form-rect {{data.cls}}" style="left:{{data.left}}px;top:{{data.top}}px;width:{{data.width}}px;height:{{data.height}}px; -moz-border-radius:{{data.borderRadius}}px;-webkit-border-radius:{{data.borderRadius}}px;border-radius:{{data.borderRadius}}px;background: {{data.background}};border:{{data.borderWidth}}px {{data.borderStyle}} {{data.borderColor}};z-index:{{data.zIndex}}">'+
        '{{if data.html}}'+
        '<div id="rect-text-{{data.id}}" class="oui-shape-text"><div class="text" style="max-height: {{data.height*70/100}}px">{{data.html}}</div> </div>'+
        '{{/if}}'+
        '</div>'+
        '',
        'tpl-oval' :
        ''+
        '<div id="oval-{{data.id}}"  targets-json="{{data.targetsJson}}" to-ids="{{data.toIds.join(",")}}"  oui-e-click="{{data.click}}" oui-e-mouseenter="{{data.mouseenter}}" oui-e-mouseleave="{{data.mouseleave}}"'+
        'class="oui-shape app-form-oval {{data.cls}}" style="left:{{data.left}}px;top:{{data.top}}px;width:{{data.width}}px;height:{{data.height}}px; -moz-border-radius:50%;-webkit-border-radius:50%;border-radius:50%;background: {{data.background}};border:{{data.borderWidth}}px {{data.borderStyle}} {{data.borderColor}};z-index:{{data.zIndex}}">'+
        '{{if data.html}}'+
        '<div id="oval-text-{{data.id}}" class="oui-shape-text"><div class="text" style="max-height: {{data.height*70/100}}px">{{data.html}}</div> </div>'+
        '{{/if}}'+
        '</div>'+
        '',
        'tpl-star5' :
        ''+
        '<div id="star5-{{data.id}}"  targets-json="{{data.targetsJson}}"'+
        'to-ids="{{data.toIds.join(",")}}"  oui-e-click="{{data.click}}" oui-e-mouseenter="{{data.mouseenter}}" oui-e-mouseleave="{{data.mouseleave}}"'+
        'class="oui-shape app-form-star5  {{data.cls}}"  >'+
        '<div class="star-five-{{data.id}}"></div>'+
        '<style type="text/css" >'+
        '#star5-{{data.id}}{'+
        'position:absolute;'+
        'left:{{data.left}}px;'+
        'top:{{data.top}}px;'+
        'width:{{data.width}}px;'+
        'height:{{1.8*data.width/2}}px;'+
        '/*background:transparent;*/'+
        '}'+
        '.star-five-{{data.id}} {'+
        'margin: {{0.3*data.width}}px 0;'+
        'position: relative;'+
        'display: block;'+
        'color: {{data.color}};'+
        'width: 0px;'+
        'height: 0px;'+
        'border-right:  {{data.width/2}}px {{data.borderStyle}} transparent;'+
        'border-bottom: {{0.7*data.width/2}}px  {{data.borderStyle}} {{data.color}};'+
        'border-left:   {{data.width/2}}px {{data.borderStyle}} transparent;'+
        '-moz-transform:    rotate(35deg);'+
        '-webkit-transform: rotate(35deg);'+
        '-ms-transform:     rotate(35deg);'+
        '-o-transform:      rotate(35deg);'+
        '}'+
        '.star-five-{{data.id}}:before {'+
        'border-bottom: {{0.8*data.width/2}}px {{data.borderStyle}} {{data.color}};'+
        'border-left: {{0.3*data.width/2}}px {{data.borderStyle}} transparent;'+
        'border-right: {{0.3*data.width/2}}px {{data.borderStyle}} transparent;'+
        'position: absolute;'+
        'height: 0;'+
        'width: 0;'+
        'top: -{{0.45*data.width/2}}px;'+
        'left: -{{0.65*data.width/2}}px;'+
        'display: block;'+
        'content: "";'+
        '-webkit-transform: rotate(-35deg);'+
        '-moz-transform:    rotate(-35deg);'+
        '-ms-transform:     rotate(-35deg);'+
        '-o-transform:      rotate(-35deg);'+
        '}'+
        '.star-five-{{data.id}}:after {'+
        'position: absolute;'+
        'display: block;'+
        'color: {{data.color}};'+
        'top: {{0.03*data.width/2}}px;'+
        'left: -{{1.05*data.width/2}}px;'+
        'width: 0px;'+
        'height: 0px;'+
        'border-right: {{data.width/2}}px {{data.borderStyle}} transparent;'+
        'border-bottom: {{0.7*data.width/2}}px {{data.borderStyle}} {{data.color}};'+
        'border-left: {{data.width/2}}px {{data.borderStyle}} transparent;'+
        '-webkit-transform: rotate(-70deg);'+
        '-moz-transform:    rotate(-70deg);'+
        '-ms-transform:     rotate(-70deg);'+
        '-o-transform:      rotate(-70deg);'+
        'content: "";'+
        '}'+
        '#star5-text-{{data.id}}{'+
        'position:absolute;'+
        'left:50%;'+
        'top:50%;'+
        '-webkite-transform:translate(-50%,-50%);'+
        '-moz-transform:translate(-50%,-50%);'+
        '-ms-transform:translate(-50%,-50%);'+
        'transform:translate(-50%,-50%);'+
        '/*height:{{0.7*data.width}}px;*/'+
        'z-index:{{data.zIndex}};'+
        '}'+
        '</style>'+
        '{{if data.html}}'+
        '<div id="star5-text-{{data.id}}" class="oui-shape-text"><div class="text" style="max-height: {{data.width*70/100}}px">{{data.html}}</div> </div>'+
        '{{/if}}'+
        '</div>'+
        '',
        _:''
    } ;
})(window);
;

(function(win){
    var oui = win.oui = win.oui||{};
    var GraphBiz= {};
    var defaultConfig = {
        lineColor:'#5990cf',
        lineStyle:'solid',
        lineHeight:3,
    };
    /** 图形模板函数****/
    var funCfg = {
    };
    /** 运行态静态模板配置***/
    var templateCfg= {};
    var loadTpl = function(debug){
        if(!win.shapeTplCfg){
            var html= oui.loadUrl(oui.getContextPath()+'res_common/third/shape/shape.tpl.html');
            $(document.body).append('<div id="shape-runtime-tpl">'+html+'</div>');
            var cfg = {};
            $('#shape-runtime-tpl').children().each(function(){cfg[this.id] = this.innerHTML});
            templateCfg = cfg;
        } else{
            templateCfg= win.shapeTplCfg||{};
        }
    };
    loadTpl(); //加载模板 ,运行态模板在shape.tpl.js中 执行js后产生字符串模板
    /**api与模板批准 ***/
    var funNameCfg = {
        "renderLine":"tpl-line",
        "renderCircle":"tpl-circle",
        "renderRect":"tpl-rect"
    };
    var getRenderByTpl= function(tplId){
        if(!funCfg[tplId]){
            if(!templateCfg[tplId]){
                throw new Error("图形模板["+tplId+"] 不存在!");
            }
            funCfg[tplId] = template.compile(templateCfg[tplId]);
        }
        return funCfg[tplId];
    };

    /** 初始化api定义***/
    for(var i in funNameCfg){
        if(funNameCfg.hasOwnProperty(i) && funNameCfg[i]){
            GraphBiz[i] = getRenderByTpl(funNameCfg[i]);
        }
    }
    /*****
     * 根据配置渲染图形
     **/
    GraphBiz.renderBy = function(cfg,isNotRender){
        if(!cfg){
            throw new Error('渲染图形配置不能为空');
        }
        if(!cfg.type){
            throw new Error('渲染图形类型不能为空');
        }
        if(!cfg.id){
            cfg.id = oui.getUUIDLong();
        }
        if(!cfg.fromIds){
            cfg.fromIds = [];
        }
        if(!cfg.targetsJson){
            cfg.targetsJson = oui.parseString([]);
        }
        if(!cfg.toIds){
            cfg.toIds = [];
        }
        if((typeof  cfg.left =='undefined') && (typeof cfg.x =='number') ){
            cfg.left = cfg.x;
        }
        if((typeof  cfg.top =='undefined') && (typeof cfg.y =='number') ){
            cfg.top = cfg.y;
        }
        var tplId = 'tpl-'+cfg.type;
        var _render = getRenderByTpl(tplId);
        var _renderNext = null;
        if(templateCfg[tplId+'-next']){ //配置了next模板的情况
            _renderNext = getRenderByTpl(tplId+'-next');
        }
        var html= _render({data:cfg});
        var elId = cfg.type+'-'+cfg.id;
        var $el = $('.app-layout-center').find('#'+elId);
        cfg.outerHTML = html;
        /***如果存在则更新 否则创建  */
        if(!isNotRender){
            if($el&&($el.length>0)){
                $el[0].outerHTML = html;
                if(_renderNext){
                    var $next = $el.next();
                    if($next&&$next.length){
                        if($next.hasClass(cfg.type+'-next')){
                            $next[0].outerHTML  = _renderNext({data:cfg});
                        }
                    }
                }
            }else{
                var $html = $(html);
                var container = cfg.container || '.app-layout-center';
                $(container).append($html);
                if(_renderNext){
                    var nextHtml = _renderNext({data:cfg});
                    $(container).append($(nextHtml));
                }
            }
        }else{
            if($el&&($el.length>0)){
                $el.remove();
                if(_renderNext){
                    var $next = $el.next();
                    if($next&&$next.length){
                        if($next.hasClass(cfg.type+'-next')){
                           $next.remove();
                        }
                    }
                }
            }
        }
        return cfg;
    };
    /*
     * 求圆周上等分点的坐标
     * ox,oy为圆心坐标
     * r为半径
     * count为等分个数
     */
    function getPoints4circle(r, ox, oy, count){
        var point = []; //结果
        var radians = (Math.PI / 180) * Math.round(360 / count), //弧度
            i = 0;
        for(; i < count; i++){
            var x = ox + r * Math.sin(radians * i),
                y = oy + r * Math.cos(radians * i);

            point.unshift({x:x,y:y}); //为保持数据顺时针
        }
        return point;
    }

    var buildLineWithPoints = function(fromPos,toPos,config){
        if((typeof  fromPos.left =='undefined') && (typeof fromPos.x =='number') ){
            fromPos.left = fromPos.x;
        }
        if((typeof  fromPos.top =='undefined') && (typeof fromPos.y =='number') ){
            fromPos.top = fromPos.y;
        }
        if((typeof  toPos.left =='undefined') && (typeof toPos.x =='number') ){
            toPos.left = toPos.x;
        }
        if((typeof  toPos.top =='undefined') && (typeof toPos.y =='number') ){
            toPos.top = toPos.y;
        }
        var points = config.points||[];
        var centerPointInfo= {};
        if(config.html){
            centerPointInfo= getCenterPointInfo(fromPos,toPos,points);
        }
        var lineIds = [];
        var lines = [];
        var cfg = {
            id:config.id||oui.getUUIDLong(),
            lines:lines,
            lineIds:lineIds,
            config:config
        };
        if(points.length){
            var tempCfg = $.extend(true,{},config);
            tempCfg.hasArrow = false;
            tempCfg.id= null;//清空id
            tempCfg.isSmoothingPoints = true;
            tempCfg.lineId = cfg.id;
            if((centerPointInfo.from == fromPos) && (centerPointInfo.to == points[0])){
                tempCfg.centerDistance = centerPointInfo.centerDistance;
                tempCfg.centerPoint = centerPointInfo;

            }else{
                tempCfg.html='';
            }
            var first = buildLine(fromPos,points[0],tempCfg);
            lineIds.push(first.id);
            lines.push(first);
            for(var i= 0,len=points.length-1;i<len;i++){
                var currTempCfg = $.extend(true,{},config);
                currTempCfg.hasArrow = false;
                currTempCfg.hasFromArrow = false;
                currTempCfg.id= null;//清空id
                currTempCfg.isSmoothingPoints = true;
                currTempCfg.lineId = cfg.id;
                if((centerPointInfo.from == points[i]) && (centerPointInfo.to == points[i+1])){
                    currTempCfg.centerDistance = centerPointInfo.centerDistance;
                    currTempCfg.centerPoint= centerPointInfo;
                }else{
                    currTempCfg.html ='';
                }
                currTempCfg = buildLine(points[i],points[i+1],currTempCfg);
                lineIds.push(currTempCfg.id);
                lines.push(currTempCfg);
            }
            var endCfg = $.extend(true,{},config);
            endCfg.hasFromArrow = false;
            endCfg.lineId = cfg.id;
            if((centerPointInfo.from == points[points.length-1]) && (centerPointInfo.to == toPos)){
                endCfg.centerDistance = centerPointInfo.centerDistance;
                endCfg.centerPoint= centerPointInfo;
            }else{
                endCfg.html = '';
            }
            var end = buildLine(points[points.length-1],toPos,endCfg);
            lineIds.push(end.id);
            lines.push(end);
            return cfg;
        }else{
            config.centerDistance = centerPointInfo.centerDistance;
            config.centerPoint= centerPointInfo;
            return buildLine(fromPos,toPos,config);
        }
    };
    /** 根据两个点画直线****/
    var buildLine = function(fromPos,toPos,config){
        if((typeof  fromPos.left =='undefined') && (typeof fromPos.x =='number') ){
            fromPos.left = fromPos.x;
        }
        if((typeof  fromPos.top =='undefined') && (typeof fromPos.y =='number') ){
            fromPos.top = fromPos.y;
        }
        if((typeof  toPos.left =='undefined') && (typeof toPos.x =='number') ){
            toPos.left = toPos.x;
        }
        if((typeof  toPos.top =='undefined') && (typeof toPos.y =='number') ){
            toPos.top = toPos.y;
        }
        fromPos.left = parseFloat(fromPos.left.toFixed(2));
        fromPos.top = parseFloat(fromPos.top.toFixed(2));
        toPos.left = parseFloat(toPos.left.toFixed(2));
        toPos.top = parseFloat(toPos.top.toFixed(2));

        /**求出 起始目标表单与目标表单的横竖距离 **/
        var tanHeight = (fromPos.top-toPos.top) ;
        var tanWidth= (((fromPos.left-toPos.left)));
        var lineWidth = Math.sqrt(tanWidth*tanWidth + tanHeight*tanHeight) ;
        var a= 0;
        if(fromPos.top==toPos.top){
            if(toPos.left>fromPos.left){
                a = 0;
            }else{
                a = 180;
            }
        }else if(fromPos.left == toPos.left){
            if(toPos.top>fromPos.top){
                a = 90;
            }else{
                a = 270;
            }
        }else{
            /** 求出 起始表单和目标表单直接角度****/
            a=Math.atan(tanHeight/tanWidth)*180/Math.PI;
            if(toPos.left<fromPos.left){
                a+=180;
            }
        }
        var line= {
            type:'line',
            hasRelation:true,
            left:  fromPos.left ,
            top: fromPos.top ,
            width:lineWidth,
            lineStyle:defaultConfig.lineStyle,
            lineHeight:defaultConfig.lineHeight,
            color:defaultConfig.lineColor,
            rotate:a
        };
        line = $.extend(true,{},line,config);
        /** 判断结尾是否有箭头***/
        if(line.hasArrow){
            var arrowWidth= line.lineHeight+14;
            line.width-= arrowWidth;
            if(line.width<0){
                line.width=1;
            }
        }

        line.top = line.top-line.lineHeight/2;
        /** 判断开始是否有箭头*/
        if(line.hasFromArrow){
            var arrowWidth= line.lineHeight+14;
            line.width-= arrowWidth;
            if(line.width<0){
                line.width=1;
            }
            var pos= {};
            try{
                pos = getPosOnline(fromPos,toPos,arrowWidth);

            }catch(e){
                pos= {
                    left:line.left,
                    top:line.top
                };
            }
//                    console.log('计算出的位置：'+oui.parseString(pos));
//                    console.log(line);
            line.left = pos.left;
            line.top = pos.top-line.lineHeight/2;
        }

        /*** 渲染连接线 ***/
        return GraphBiz.renderBy(line,config.isNotRender);
    };
    /**根据两个矩形 和两个矩形上连接两点进行智能避障画线 ****/
    var buildLine4rect = function(rectA,rectB,rectApos,rectBpos){

    };
    /**在直线上找某个点的坐标 fromLen为从起始点开始到目标点的距离 ****/
    var getPosOnline = function (fromPos, toPos, fromLen) {
        toPos.top = toPos.top || toPos.y;
        toPos.left = toPos.left || toPos.x;
        fromPos.top = fromPos.top || fromPos.y;
        fromPos.left = fromPos.left || fromPos.x;

        /**直线方程 */
        var lineExp = "(" + (toPos.top - fromPos.top).toFixed(2) + ")*(x-" + fromPos.left + ") = (" + (toPos.left - fromPos.left).toFixed(2) + ")*(y-" + (fromPos.top) + ")";
        var circleExp = "(x-" + fromPos.left + ")*(x-" + fromPos.left + ")+(y-" + fromPos.top + ")*(y-" + fromPos.top + ")=" + (fromLen * fromLen) + "";
        var lineEq = algebra.parse(lineExp);
        var xValue, yValue;
        var left, top;
        if (lineEq.toString().indexOf('y') < 0 && lineEq.toString().indexOf('x') < 0) {
            return {};
        }
        //console.log('线条方程');
        //console.log(lineEq.toString());
        if (lineEq.toString().indexOf('y') < 0) {
            /***如果是一条平行于 Y的直线 则没有 y变量则直接指定箭头位置 ****/
            left = fromPos.left;
            if (fromPos.top < toPos.top) {
                top = fromPos.top + fromLen;
            } else {
                top = fromPos.top - fromLen;
            }
        } else if (lineEq.toString().indexOf('x') < 0) {
            /****如果是一条 平行于X 的直线 则 没有 x变量 则直接指定 箭头坐标位置 ********/
            top = fromPos.top;
            if (fromPos.left < toPos.left) {
                left = fromPos.left + fromLen;
            } else {
                left = fromPos.left - fromLen;
            }
        } else {
            /**求二元一次方程 找出  箭头位置 ****/
            var yExp = lineEq.solveFor("y");

            var ellipseExp4x = circleExp.replace(/y/ig, '(' + yExp.toString() + ')');
            //console.log('距离计算');
            //console.log(yExp.toString());
            //console.log(ellipseExp4x);
            var xEq = algebra.parse(ellipseExp4x);

            var xEqStr = xEq.toString();
            //console.log('一元二次方程：');
            //console.log(xEqStr);
            var values = xEq.solveFor('x');
            if (values&&values.length==1) {
                xValue = values[0];
            } else if(values&&values.length==2) {
                xValue = values;
            }else{
                xValue=[];
            }
            yValue = [];
            if (xValue.length == 2 || xValue.length == 1) {
                var yExpStr = yExp.toString();
                var xFirstParam = yExpStr.substring(0, yExpStr.indexOf('x'));
                var xSecondParam = yExpStr.substring(yExpStr.indexOf('x') + 1, yExpStr.length);
                xFirstParam = xFirstParam.replace(/ /ig, '') || '1';
                xSecondParam = xSecondParam.replace(/ /ig, '') || '1';
                if (xFirstParam == '+') {
                    xFirstParam = "1";
                }
                if (xSecondParam == '+') {
                    xSecondParam = "1";
                }
                var paramA4x = eval(xFirstParam == '-' ? '-1' : xFirstParam);
                var paramB4x = eval(xSecondParam == '-' ? '-1' : xSecondParam);
                var left1 = parseFloat(xValue[0]);
                var left2 = parseFloat(xValue[1]);

                yValue[0] = paramA4x * left1 + paramB4x;
                yValue[1] = paramA4x * left2 + paramB4x;
                var top1 = eval(yValue[0]);
                var top2 = eval(yValue[1]);
                var minLeft = Math.min(fromPos.left, toPos.left);
                var maxLeft = (Math.max(fromPos.left, toPos.left));

                if ((xValue.length == 1) || (left1>=minLeft && left1<=maxLeft)) {
                    left = left1;
                    top = top1;
                } else {
                    left = left2;
                    top = top2;
                }
            }
        }
        //console.log('left:'+left+',top:'+top);
        return {
            x:left,
            y:top,
            left: left,
            top: top
        };
    };
    oui._shapeMap = {};
    oui.clearShapeMap = function(){
        oui._shapeMap = {};
    };
    /**根据连接访问获取坐标 ***/
    var getCoordinate = function (direction){
        if("nw" == direction.toLowerCase()){
            // North West
            return {x : this.x, y : this.y};
        }else if("nc" == direction.toLowerCase()){
            // North Center
            return {x : this.x + (this.w / 2), y : this.y};
        }else if("ne" == direction.toLowerCase()) {
            // North East
            return {x: this.x + this.w, y: this.y};
        }else if("em" == direction.toLowerCase()){
            // Ease Middle
            return {x : this.x + this.w, y : this.y + (this.h/2)};
        }else if("se" == direction.toLowerCase()){
            // South East
            return {x : this.x + this.w, y : this.y + this.h};
        }else if("sc" == direction.toLowerCase()){
            // South Center
            return {x : this.x + (this.w / 2), y : this.y + this.h};
        }else if("sw" == direction.toLowerCase()){
            // South West
            return {x : this.x, y : this.y + this.h};
        }else if("wm" == direction.toLowerCase()){
            // West Middle
            return {x : this.x, y : this.y + (this.h / 2)};
        }
        //console.log('没有找到坐标位置................................');
        return null;
    };
    /** 判断点是否在矩形内*****/
    var inRect = function (point){
        var distanceX = point.x - this.x;
        var distanceY = point.y - this.y;
        if(distanceX <= 0 || distanceX >= this.w){
            return false;
        }
        if(distanceY <= 0 || distanceY >= this.h){
            return false;
        }
        return true;
    };
    // 计算两个图形之间的连接方向
    var standardWidth = 20;
    /** 获取两个连线的位置****/
    var getConnectionDirection= function(sourceRect, targetRect){
        // 先计算是否两个图形之间有足够的距离绘制连接线
        var sourcePoint = sourceRect.getCoordinate("EM");
        var targetPoint = targetRect.getCoordinate("WM");
        if((targetPoint.x - sourcePoint.x) > standardWidth){
            return ["E", "W"];
        }

        sourcePoint = sourceRect.getCoordinate("WM");
        targetPoint = targetRect.getCoordinate("EM");
        if((sourcePoint.x - targetPoint.x) > standardWidth){
            return ["W", "E"];
        }

        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("SC");
        if((sourcePoint.y - targetPoint.y) > standardWidth){
            return ["N", "S"];
        }

        sourcePoint = sourceRect.getCoordinate("SC");
        targetPoint = targetRect.getCoordinate("NC");
        if((targetPoint.y - sourcePoint.y) > standardWidth){
            return ["S", "N"];
        }

        // 再是否可以通过拐点进行连接
        sourcePoint = sourceRect.getCoordinate("EM");
        targetPoint = targetRect.getCoordinate("NC");
        if(((targetPoint.x - sourcePoint.x) > 0.5 * standardWidth) && ((targetPoint.y - sourcePoint.y) > standardWidth)){
            return ["E", "N"];
        }
        targetPoint = targetRect.getCoordinate("SC");
        if(((targetPoint.x - sourcePoint.x) > 0.5 * standardWidth) && ((sourcePoint.y - targetPoint.y) > standardWidth)){
            return ["E", "S"];
        }

        sourcePoint = sourceRect.getCoordinate("WM");
        targetPoint = targetRect.getCoordinate("SC");
        if(((sourcePoint.x - targetPoint.x) > 0.5 * standardWidth) && ((sourcePoint.y - targetPoint.y) > standardWidth)){
            return ["W", "S"];
        }
        targetPoint = targetRect.getCoordinate("NC");
        if(((sourcePoint.x - targetPoint.x) > 0.5 * standardWidth) && ((targetPoint.y - sourcePoint.y) > standardWidth)){
            return ["W", "N"];
        }

        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("EM");
        if(((sourcePoint.y - targetPoint.y) > 0.5 * standardWidth) && ((sourcePoint.x - targetPoint.x) > standardWidth)){
            return ["N", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if(((sourcePoint.y - targetPoint.y) > 0.5 * standardWidth) && ((targetPoint.x - sourcePoint.x) > standardWidth)){
            return ["N", "W"];
        }

        sourcePoint = sourceRect.getCoordinate("SC");
        targetPoint = targetRect.getCoordinate("EM");
        if(((targetPoint.y - sourcePoint.y) > 0.5 * standardWidth) && ((sourcePoint.x - targetPoint.x) > standardWidth)){
            return ["S", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if(((targetPoint.y - sourcePoint.y) > 0.5 * standardWidth) && ((targetPoint.x - sourcePoint.x) > standardWidth)){
            return ["S", "W"];
        }

        // 最后计算可用的连接点，然后从中选择。两个连接点可连接优先级为：NN >> EE >> NE >> NW >> SE >> SW
        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("NC");
        if((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))){
            if((sourcePoint.y - targetPoint.y) < 0){
                if(Math.abs(sourcePoint.x - targetPoint.x) > ((sourceRect.getWidth() + standardWidth) / 2))
                    return ["N", "N"];
            }else{
                if(Math.abs(sourcePoint.x - targetPoint.x) > (targetRect.getWidth() / 2))
                    return ["N", "N"];
            }
        }

        sourcePoint = sourceRect.getCoordinate("EM");
        targetPoint = targetRect.getCoordinate("EM");
        if((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))){
            if((sourcePoint.x - targetPoint.x) > 0){
                if(Math.abs(sourcePoint.y - targetPoint.y) > ((sourceRect.getHeight() + standardWidth) / 2))
                    return ["E", "E"];
            }else{
                if(Math.abs(sourcePoint.y - targetPoint.y) > (targetRect.getHeight() / 2))
                    return ["E", "E"];
            }
        }

        // 其次判断NE、NW是否可用
        sourcePoint = sourceRect.getCoordinate("NC");
        targetPoint = targetRect.getCoordinate("EM");
        if((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))){
            return ["N", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))){
            return ["N", "W"];
        }

        // 最后判断SE、SW是否可用
        sourcePoint = sourceRect.getCoordinate("SC");
        targetPoint = targetRect.getCoordinate("EM");
        if((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))){
            return ["S", "E"];
        }
        targetPoint = targetRect.getCoordinate("WM");
        if((!targetRect.inRect(sourcePoint)) && (!sourceRect.inRect(targetPoint))){
            return ["S", "W"];
        }

        // 只能返回这个
        return ["E", "W"];
    };

    // 计算两个图形之间的拐点
    var calcBendPoints = function (sourceRect, targetRect, connectionDir){
        var points = [], startPoint, endPoint;
        if("E" == connectionDir[0]){
            startPoint = sourceRect.getCoordinate("EM");
            points.push(startPoint);
            if("S" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("SC");
                points.push({x: endPoint.x, y: startPoint.y});
                points.push(endPoint);
            }else if("N" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("NC");
                points.push({x: endPoint.x, y: startPoint.y});
                points.push(endPoint);
            }else if("E" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("EM");
                points.push({x: Math.max(startPoint.x, endPoint.x) + 1.5 * standardWidth, y: startPoint.y});
                points.push({x: Math.max(startPoint.x, endPoint.x) + 1.5 * standardWidth, y: endPoint.y});
                points.push(endPoint);
            }else{
                endPoint = targetRect.getCoordinate("WM");
                if(endPoint.y != startPoint.y){
                    points.push({x: (startPoint.x + endPoint.x) / 2, y: startPoint.y});
                    points.push({x: (startPoint.x + endPoint.x) / 2, y: endPoint.y});
                }
                points.push(endPoint);
            }
        }else if("W" == connectionDir[0]){
            startPoint = sourceRect.getCoordinate("WM");
            points.push(startPoint);
            if("S" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("SC");
                points.push({x: endPoint.x, y: startPoint.y});
                points.push(endPoint);
            }else if("N" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("NC");
                points.push({x: endPoint.x, y: startPoint.y});
                points.push(endPoint);
            }else{
                endPoint = targetRect.getCoordinate("EM");
                if(endPoint.y != startPoint.y){
                    points.push({x: (startPoint.x + endPoint.x) / 2, y: startPoint.y});
                    points.push({x: (startPoint.x + endPoint.x) / 2, y: endPoint.y});
                }
                points.push(endPoint);
            }
        }else if("N" == connectionDir[0]){
            startPoint = sourceRect.getCoordinate("NC");
            points.push(startPoint);
            if("E" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("EM");
                if((endPoint.x - startPoint.x) > 0){
                    points.push({x: startPoint.x, y: startPoint.y - standardWidth});
                    points.push({x: endPoint.x + 1.5 * standardWidth, y: startPoint.y - standardWidth});
                    points.push({x: endPoint.x + 1.5 * standardWidth, y: endPoint.y});
                }else{
                    points.push({x: startPoint.x, y: endPoint.y});
                }
                points.push(endPoint);
            }else if("W" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("WM");
                if((endPoint.x - startPoint.x) < 0){
                    points.push({x: startPoint.x, y: startPoint.y - standardWidth});
                    points.push({x: endPoint.x - 1.5 * standardWidth, y: startPoint.y - standardWidth});
                    points.push({x: endPoint.x - 1.5 * standardWidth, y: endPoint.y});
                }else{
                    points.push({x: startPoint.x, y: endPoint.y});
                }
                points.push(endPoint);
            }else if("N" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("NC");
                points.push({x: startPoint.x, y: Math.min(startPoint.y, endPoint.y) - 1.5 * standardWidth});
                points.push({x: endPoint.x, y: Math.min(startPoint.y, endPoint.y) - 1.5 * standardWidth});
                points.push(endPoint);
            }else{
                endPoint = targetRect.getCoordinate("SC");
                if(endPoint.x != startPoint.x){
                    points.push({x: startPoint.x, y: (startPoint.y + endPoint.y) / 2});
                    points.push({x: endPoint.x, y: (startPoint.y + endPoint.y) / 2});
                }
                points.push(endPoint);
            }
        }else if("S" == connectionDir[0]){
            startPoint = sourceRect.getCoordinate("SC");
            points.push(startPoint);
            if("E" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("EM");
                if((endPoint.x - startPoint.x) > 0){
                    points.push({x: startPoint.x, y: startPoint.y + standardWidth});
                    points.push({x: endPoint.x + 1.5 * standardWidth, y: startPoint.y + standardWidth});
                    points.push({x: endPoint.x + 1.5 * standardWidth, y: endPoint.y});
                }else{
                    points.push({x: startPoint.x, y: endPoint.y});
                }
                points.push(endPoint);
            }else if("W" == connectionDir[1]){
                endPoint = targetRect.getCoordinate("WM");
                if((endPoint.x - startPoint.x) < 0){
                    points.push({x: startPoint.x, y: startPoint.y + standardWidth});
                    points.push({x: endPoint.x - 1.5 * standardWidth, y: startPoint.y + standardWidth});
                    points.push({x: endPoint.x - 1.5 * standardWidth, y: endPoint.y});
                }else{
                    points.push({x: startPoint.x, y: endPoint.y});
                }
                points.push(endPoint);
            }else{
                endPoint = targetRect.getCoordinate("NC");
                if(endPoint.x != startPoint.x){
                    points.push({x: startPoint.x, y: (startPoint.y + endPoint.y) / 2});
                    points.push({x: endPoint.x, y: (startPoint.y + endPoint.y) / 2});
                }
                points.push(endPoint);
            }
        }
        return points;
    };
    /** 判断两个点是否在同一个点****/
    var isSamePoint = function(p1,p2){
        if(Math.abs(p1.x-p2.x) <1 && Math.abs(p1.y-p2.y)<1){
            return true;
        }
        return false;
    };
    /**线条类型 ****/
    var LineTypeEnum = {
        poly:1,//折线
        curve:2,//曲线
        linear:3//直线
    };
    /***线条端点类型 ***/
    var LinePortTypeEnum ={
        multi:1, //端点位置 多条线独自拥有端点
        one:2 //端点位置多条线同方位共用一个端点
    };
    /** 画线方式 ***/
    var LineDrawTypeEnum={
        auto:1,//自由定位，连线物体的 东西南北方向。。。
        center:2// 中心定位,连线物体的中心定位
    };
    /** 画折线,点 参数设置***/
    var calcPoints4drawPolyLine = function(cfg){
        var points = [];
        if(cfg.bendPoints.length ==0){
            var strDir = cfg.connectionDir[0]+''+cfg.connectionDir[1];
            strDir = strDir.toUpperCase();
            var temp = [];
            if(strDir =='EW' || strDir=='WE'){
                /** 同一条直线上 无拐点,不在同条直线上 需要增加拐点****/
                if(Math.abs(cfg.fromPoint.y-cfg.toPoint.y) <=0.5 ){
                    points = [];
                }else{
                    //东西方向
                    temp.push({
                        x:(cfg.fromPoint.x+cfg.toPoint.x)/2,
                        y:cfg.fromPoint.y
                    });
                    temp.push({
                        x:(cfg.fromPoint.x+cfg.toPoint.x)/2,
                        y:cfg.toPoint.y
                    });

                    points = temp;
                }
            }else if(strDir =='SN' || strDir=='NS'){
                // 南北方向
                if(Math.abs(cfg.fromPoint.y-cfg.toPoint.y) <1 ){
                    points = [];
                }else{
                    temp.push({
                        x:cfg.fromPoint.x,
                        y:(cfg.fromPoint.y+cfg.toPoint.y)/2
                    });
                    temp.push({
                        x:cfg.toPoint.x,
                        y:(cfg.fromPoint.y+cfg.toPoint.y)/2
                    });

                    points = temp;
                }
            }
        } else if(points.length==1){

        }else if(cfg.bendPoints.length == 2){

            var strDir = cfg.connectionDir[0]+''+cfg.connectionDir[1];
            strDir = strDir.toUpperCase();
            var temp = [];
            if(strDir =='EW' || strDir=='WE'){
                /** 同一条直线上 无拐点,不在同条直线上 需要增加拐点****/
                if(Math.abs(cfg.fromPoint.y-cfg.toPoint.y) <1 ){
                    points = [];
                }else{
                    //东西方向
                    temp.push({
                        x:(cfg.bendPoints[0].x+cfg.bendPoints[1].x)/2,
                        y:cfg.fromPoint.y
                    });
                    temp.push({
                        x:(cfg.bendPoints[0].x+cfg.bendPoints[1].x)/2,
                        y:cfg.toPoint.y
                    });

                    points = temp;
                }
            }else if(strDir =='SN' || strDir=='NS'){
                // 南北方向
                if(Math.abs(cfg.fromPoint.y-cfg.toPoint.y) <1 ){
                    points = [];
                }else{
                    temp.push({
                        x:cfg.fromPoint.x,
                        y:(cfg.fromPoint.y+cfg.toPoint.y)/2
                    });
                    temp.push({
                        x:cfg.toPoint.x,
                        y:(cfg.fromPoint.y+cfg.toPoint.y)/2
                    });

                    points = temp;
                }
            }
        }else if(cfg.bendPoints.length ==3){
            //points.length=1;
            var centerPoint = {x:(cfg.fromPoint.x+cfg.toPoint.x)/2,y:(cfg.fromPoint.y+cfg.toPoint.y)/2};
            if(cfg.connectionDir){
                var temp = [];

                var strDir = cfg.connectionDir[0]+''+cfg.connectionDir[1];
                strDir = strDir.toUpperCase();
                if(strDir =='EW' || strDir=='WE'){
                    //东西方向
                    temp.push({
                        x:centerPoint.x,
                        y:cfg.fromPoint.y
                    });
                    temp.push({
                        x:centerPoint.x,
                        y:cfg.toPoint.y
                    });
                    points = temp;
                }else if(strDir =='SN' || strDir=='NS'){
                    // 南北方向
                    temp.push({
                        x:cfg.fromPoint.x,
                        y:centerPoint.y
                    });
                    temp.push({
                        x:cfg.toPoint.x,
                        y:centerPoint.y
                    });
                    points = temp;
                }else if(strDir =='ES' || strDir=='SE'){
                    //东南方向 x1<x2 && y1>y2
                    if(cfg.fromPoint.x<cfg.toPoint.x && cfg.fromPoint.y>cfg.toPoint.y){
                        temp.push({
                            x:cfg.toPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:cfg.toPoint.y
                        });
                    }
                    points = temp;
                }else if(strDir=='SW' || strDir =='WS'){
                    //西南方向 x1<x2 && y1<y2
                    if(cfg.fromPoint.x<cfg.toPoint.x && cfg.fromPoint.y < cfg.toPoint.y){
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:cfg.toPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.toPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }
                    points = temp;

                }else if(strDir=='NW' || strDir =='WN'){
                    //西北方向 x1<x2 && y1>y2
                    if(cfg.fromPoint.x<cfg.toPoint.x && cfg.fromPoint.y > cfg.toPoint.y){
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:cfg.toPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.toPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }
                    points = temp;
                }else if(strDir=='EN' || strDir =='NE'){
                    //东北方向 x1<x2 && y1>y2
                    if(cfg.fromPoint.x<cfg.toPoint.x && cfg.fromPoint.y < cfg.toPoint.y){
                        temp.push({
                            x:cfg.toPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:cfg.toPoint.y
                        });
                    }
                    points = temp;
                }
            }

        }else if(cfg.bendPoints.length ==4){
            var temp = [];
            var strDir = cfg.connectionDir[0]+''+cfg.connectionDir[1];
            strDir = strDir.toUpperCase();
            if(strDir =='EE'){ //东东方向
                if( cfg.fromPoint.y > cfg.toPoint.y){
                    temp.push({
                        x:cfg.bendPoints[1].x,
                        y:cfg.fromPoint.y
                    });
                    temp.push({
                        x:cfg.bendPoints[1].x,
                        y:cfg.toPoint.y
                    });

                }else{
                    temp.push({
                        x:cfg.bendPoints[1].x,
                        y:cfg.fromPoint.y
                    });
                    temp.push({
                        x:cfg.bendPoints[1].x,
                        y:cfg.toPoint.y
                    });
                }
                points = temp;
            }else if(strDir =='NN'){ //东东方向
                if( cfg.fromPoint.x > cfg.toPoint.x){
                    temp.push({
                        x:cfg.fromPoint.x,
                        y:cfg.bendPoints[1].y
                    });
                    temp.push({
                        x:cfg.toPoint.x,
                        y:cfg.bendPoints[1].y
                    });

                }else{
                    temp.push({
                        x:cfg.fromPoint.x,
                        y:cfg.bendPoints[1].y
                    });
                    temp.push({
                        x:cfg.toPoint.x,
                        y:cfg.bendPoints[1].y
                    });

                }
                points = temp;
            }else if(strDir =='NS' || strDir =='SN'){ //南北方向
                temp.push({
                    x:cfg.fromPoint.x,
                    y:cfg.bendPoints[1].y
                });
                temp.push({
                    x:cfg.toPoint.x,
                    y:cfg.bendPoints[1].y
                });
                points = temp;

            }else if(strDir=='EW' || strDir =='WE'){//东西方向
                temp.push({
                    x:cfg.bendPoints[1].x,
                    y:cfg.fromPoint.y
                });
                temp.push({
                    x:cfg.bendPoints[1].x,
                    y:cfg.toPoint.y
                });
                points = temp;

            }
            //alert('4 node');
        }else if(points.length ==5 || cfg.bendPoints.length==5){
            /** 5个拐点情况 对拐点的更改****/

            var centerPoint = cfg.bendPoints[2];//中间那个点为 拐角的点
            if(cfg.connectionDir){
                var temp = [];
                var strDir = cfg.connectionDir[0]+''+cfg.connectionDir[1];
                strDir = strDir.toUpperCase();
                /**  西北方向的折线 规则****/
                if(strDir =='WN' || strDir=='NW'){

                    //x1>x2 && y1<y2
                    if((cfg.fromPoint.x>cfg.toPoint.x) &&( cfg.fromPoint.y<cfg.toPoint.y)){
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.toPoint.y
                        });


                    }else{
                        temp.push({
                            x:cfg.toPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.fromPoint.y
                        });

                    }
                    points = temp;

                }else if(strDir =='WS' || strDir=='SW'){
                    /**  西南方向的折线 规则****/
                    //x1>x2 && y1>y2
                    if((cfg.fromPoint.x>cfg.toPoint.x) && (cfg.fromPoint.y>cfg.toPoint.y)){
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.toPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.toPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }
                    points = temp;
                }else if(strDir =='ES' || strDir=='SE'){
                    /**  东南方向的折线 规则****/
                    //x1<x2 && y1>y2
                    if(cfg.fromPoint.x<cfg.toPoint.x && cfg.fromPoint.y>cfg.toPoint.y){
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.toPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.toPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }
                    points = temp;
                }else if(strDir =='EN' || strDir=='NE'){
                    /**  东北方向的折线 规则****/
                    //x1<x2 && y1<y2
                    if(cfg.fromPoint.x<cfg.toPoint.x && cfg.fromPoint.y<cfg.toPoint.y){
                        temp.push({
                            x:cfg.fromPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.toPoint.y
                        });
                    }else{
                        temp.push({
                            x:cfg.toPoint.x,
                            y:centerPoint.y
                        });
                        temp.push(centerPoint);
                        temp.push({
                            x:centerPoint.x,
                            y:cfg.fromPoint.y
                        });
                    }
                    points = temp;
                }


            }
        }
        cfg.points = points;
    };
    /*** 根据线条 和配置获取最终渲染的点***/
    var calcPoints4Line = function(cfg,fromRect,toRect,options){
        var bendPoints = cfg.bendPoints; //拐点
        var connectionDir = cfg.connectionDir;//方位
        var fromConnections = fromRect[connectionDir[0].toUpperCase()];  //方位的连接占位列表
        var toConnections = toRect[connectionDir[1].toUpperCase()];// 目标占位列表
        var connectionId = cfg.connectionId;//连接器id

        var lineType = options.lineType ||1; //默认为折线
        var linePortType = options.portType||1; //默认 多个端口，每条线各自拥有端点
        var lineDrawType = options.drawType ||1; //默认自由定位
        options.lineType = lineType;
        options.portType = linePortType;
        options.drawType = lineDrawType;

        cfg.fromPoint= calcPointBy(connectionId,fromConnections,connectionDir[0].toUpperCase(),fromRect,options);
        cfg.toPoint = calcPointBy(connectionId,toConnections,connectionDir[1].toUpperCase(),toRect,options);

        /** 折线方式画线****/
        if(options.lineType == LineTypeEnum.poly){
            //折线绘制前计算连接点
            calcPoints4drawPolyLine(cfg);
        }else if(options.lineType == LineTypeEnum.curve){
            //TODO 曲线
        }else if(options.lineType == LineTypeEnum.linear){
            //TODO  直线
        }

    };
    /** 缓存所有图形的位置的高宽****/
    var buildAllShapesAndConnections = function(selector,options){
        var connections = [];
        /** 构造div对应的位置缓存*****/
        $(selector).each(function(){
            var id = $(this).attr('id') ;
            if(id.indexOf('-')>-1){
                id = id.split('-');
                id.splice(0,1);
                id= id.join('-');
            }
            var pos = $(this).position();
            //var fromIds = $(this).attr('from-ids')||'';
            var toIds = $(this).attr('to-ids')||'';
            //if(fromIds){
            //    fromIds = fromIds.split(',');
            //}else{
            //    fromIds = [];
            //}
            if(toIds){
                toIds = toIds.split(',');
            }else{
                toIds = [];
            }
            var targetsJson = $(this).attr('targets-json')||'';
            if(!targetsJson){
                targetsJson = '[]';
            }
            var currConnections = [];
            $.each(toIds,function(idx){
                currConnections.push({fromId:id,toId:this.toString(),connectionId:oui.getUUIDLong(),toIdx:idx});
            });
            connections = connections.concat(currConnections);
            oui._shapeMap[id]={
                id:id,
                x:pos.left,
                y:pos.top,
                w:$(this).outerWidth(),
                h:$(this).outerHeight(),
                W:[],
                E:[],
                N:[],
                S:[],
                connections:currConnections,
                //fromIds:fromIds,
                toIds:toIds,
                targetsJson:targetsJson,
                getCoordinate:getCoordinate,
                inRect:inRect,
                getWidth:function(){
                    return this.w;
                },
                getHeight:function(){
                    return this.h;
                }
            };
        });
        /** 构造所有连接器的连线，多连接点在矩形上****/
        $.each(connections,function(){
            connectShape4flow(this); //会在各个矩形物体方位属性上增加连接器
        });
        /** 连接器构造完成后 ，根据方位占位数计算坐标，然后再根据连接器Id 进行 from和to的配对 ****/
        $.each(connections,function(idx){
            var cfg = this;
            var fromId = cfg.fromId;
            var toId = cfg.toId;
            var fromRect = oui._shapeMap[fromId]  ;
            var toRect = oui._shapeMap[toId]  ;
            if(!fromRect || !toRect){
                return ;
            }
            calcPoints4Line(cfg,fromRect,toRect,options);
            options = options||{};
            var config  = $.extend(true,{
            },options,{
                fromShapeId:fromRect.id,
                toShapeId:toRect.id,
                points: cfg.points
            });
            var getLineHtml = config.getLineHtml ||function(fromRect,toRect,toIdx){
                    var toIds = fromRect.toIds;
                    var targetsJson = fromRect.targetsJson;
                    targetsJson = oui.parseJson(targetsJson);
                    var tcfg = targetsJson[toIdx]||{};
                    var lineText = tcfg.lineText || '';
                    return lineText;
                };
            var findHasFromArrow = config.findHasFromArrow ||function(fromRect,toRect,toIdx){
                    var toIds = fromRect.toIds;
                    var targetsJson = fromRect.targetsJson;
                    targetsJson = oui.parseJson(targetsJson);
                    var tcfg = targetsJson[toIdx]||{};
                    var hasFromArrow = tcfg.hasFromArrow || false;
                    return hasFromArrow;
                };
            var findHasArrow = config.findHasArrow ||function(fromRect,toRect,toIdx){
                    var toIds = fromRect.toIds;
                    var targetsJson = fromRect.targetsJson;
                    targetsJson = oui.parseJson(targetsJson);
                    var tcfg = targetsJson[toIdx]||{};
                    var hasArrow = tcfg.hasArrow || false;
                    return hasArrow;
                };
            config.html = getLineHtml(fromRect,toRect,cfg.toIdx);
            config.hasFromArrow= findHasFromArrow(fromRect,toRect,cfg.toIdx)||config.hasFromArrow;
            config.hasArrow = findHasArrow(fromRect,toRect,cfg.toIdx)||config.hasArrow;
            var lineCls = config.cls ||'';
            lineCls = lineCls.split(' ');

            if(config.hasFromArrow){
                if(lineCls.indexOf('pull')<0){
                    lineCls.push('pull');

                }
            }
            if(config.hasArrow){
                if(lineCls.indexOf('push')<0) {
                    lineCls.push('push');
                }
            }
            config.cls = lineCls.join(' ');
            //console.log('from:'+oui.app.AppDesignBiz.getFormName(fromRect.id));
            //console.log('to:'+oui.app.AppDesignBiz.getFormName(toRect.id));
            //console.log('pull:'+(config.hasFromArrow));
            //console.log('push:'+(config.hasArrow));
            //console.log('拐点数:'+bendPoints.length);
            oui.buildLineWithPoints(cfg.fromPoint, cfg.toPoint, config);
        });
    };
    /** 根据方位 和连接占位计算坐标位置 根据 连接对象在方位组中的位置 计算出 对应位置的坐标点*****/
    var calcPointBy = function (connectionId, connections, connectionDir, rect,options) {
        var idx = -1, len = connections.length;
        for (var i = 0; i < len; i++) {
            if (connections[i].connectionId == connectionId) {
                idx = i;
                break;
            }
        }
        if (i < 0) {
            return null;
        }
        var x = 0;
        var y = 0;
        x = rect.x;
        y = rect.y;
        switch (connectionDir) {
            case 'N':

                if(options.portType == LinePortTypeEnum.one){ //多条线共用一个端点
                    x += (rect.w/2);
                }else{
                    if (rect.w > len) {
                        x += (rect.w * (idx + 1) / (len + 1));
                    } else {
                        x += ((idx+1) % (len+1));
                    }
                }
                break;
            case 'W':
                if(options.portType == LinePortTypeEnum.one) { //多条线共用一个端点
                    y+= (rect.h/2);
                }else{
                    if (rect.h > len) {
                        y += rect.h * (idx + 1) /( len + 1);
                    } else {
                        y += ((idx+1) % (len+1));
                    }

                }
                break;


            case 'E':
                x += rect.w;
                if(options.portType == LinePortTypeEnum.one) { //多条线共用一个端点
                    y+= (rect.h/2);
                }else{
                    if (rect.h > len) {
                        y += rect.h * (idx + 1) /( len + 1);
                    } else {
                        y += ((idx+1) % (len+1));
                    }

                }
                break;

            case 'S':
                y += rect.h;
                if(options.portType == LinePortTypeEnum.one) { //多条线共用一个端点
                    x += (rect.w/2);
                }else{
                    if (rect.w > len) {
                        x += (rect.w * (idx + 1) / (len + 1));
                    } else {
                        x += ((idx+1) % (len+1));
                    }
                }
                break;
        }
        return {
            x:x,
            y:y
        };
    };
    /**根据目标位置 排序 连接占位 ****/
    var sortPos = function(id,pos,dir){
        /** 东西方向判断top***/
        if(dir=='E' || dir=='W'){
            pos.sort(function(a,b){
                var calcRectA,calcRectB;
                if(id == a.fromId){
                    calcRectA =  oui._shapeMap[a.toId];
                }else{
                    calcRectA = oui._shapeMap[a.fromId];
                }

                if(id == b.fromId){
                    calcRectB =  oui._shapeMap[b.toId];
                }else{
                    calcRectB = oui._shapeMap[b.fromId];
                }
                return calcRectA.y - calcRectB.y;
            });
        }else{

            /** 南北方向判断 left*****/
            pos.sort(function(a,b){
                var calcRectA,calcRectB;
                if(id == a.fromId){
                    calcRectA =  oui._shapeMap[a.toId];
                }else{
                    calcRectA = oui._shapeMap[a.fromId];
                }

                if(id == b.fromId){
                    calcRectB =  oui._shapeMap[b.toId];
                }else{
                    calcRectB = oui._shapeMap[b.fromId];
                }
                return calcRectA.x-calcRectB.x;
            });
        }
    };
    /**根据连接器计算出两个物体之间的连线的连接点坐标 ***/
    var connectShape4flow = function(cfg){
        var fromId = cfg.fromId;
        var toId = cfg.toId;
        var fromRect = oui._shapeMap[fromId] ;
        var toRect = oui._shapeMap[toId] ;
        if(!toRect || !fromRect){
            return ;
        }
        var connectionDir = getConnectionDirection(fromRect, toRect);
        var bendPoints = calcBendPoints(fromRect,toRect,connectionDir); //根据方位计算出拐点坐标，用于后续画线使用
        cfg.bendPoints = bendPoints;
        cfg.connectionDir = connectionDir;
        /** 放入时需要考虑 占位顺序 根据 目标点的位置决定***/
        fromRect[connectionDir[0].toUpperCase()].push(cfg);//放入方位,为了占位用，在画线时只需要根据 connectionId去找对应的位置即可
        toRect[connectionDir[1].toUpperCase()].push(cfg);//放入方位,为了占位用
        sortPos(fromRect.id,fromRect[connectionDir[0].toUpperCase()],connectionDir[0]); //排序当前节点中的占位位置
        sortPos(toRect.id,toRect[connectionDir[1].toUpperCase()],connectionDir[1]); //排序当前节点中的占位位置
    };

    /***绘制所有图形的连线 ****/
    var buildShapeLines = function(selector,options){
        oui.clearShapeMap();
        buildAllShapesAndConnections(selector || ".oui-shape",options);
    };
    /** 计算两点距离****/
    var countDistance = function(p1,p2){
        var w = (p1.x-p2.x);
        var h = p1.y-p2.y;
        var dis = Math.sqrt(w*w+ h*h);
        return dis
    };
    /** 获取 线条中点 距离信息****/
    var getCenterPointInfo = function(p1,p2,points){
        if((!points) || (!points.length)){
            var dis = countDistance(p1,p2);
            return {
                currDis:dis,
                from:p1,
                to:p2,
                x:(p1.x+p2.x)/2,
                y:(p1.y+p2.y)/2,
                centerDistance :dis/2,
                distance:dis
            };
        }
        var tempArr = [];
        var distance=0;
        var firstDis= countDistance(p1,points[0]);
        distance+=firstDis;
        tempArr.push({
            currDis:firstDis,
            from:p1,
            to:points[0],
            distance:distance
        });
        for(var i= 1,len=points.length;i<len;i++){
            var currDis = countDistance(points[i-1],points[i]);
            distance+=currDis;
            tempArr.push({
                currDis:currDis,
                from:points[i-1],
                to:points[i],
                distance:distance
            });
        }
        var endDis = countDistance(points[points.length-1],p2);
        distance+=endDis;
        tempArr.push({
            currDis:endDis,
            from:points[points.length-1],
            to:p2,
            distance:distance
        });
        var targetDis;
        for(var i= 0,halfDis=distance/2,len=tempArr.length;i<len;i++){
            if(tempArr[i].distance>=halfDis){

                targetDis = tempArr[i];
                targetDis.centerDistance =targetDis.currDis+halfDis-targetDis.distance;
                var pos= {};
                try{
                    pos = getPosOnline(tempArr[i].from,tempArr[i].to, targetDis.centerDistance);
                }catch(e){
                    pos = {x:0,top:0};
                }
                targetDis.x = pos.x;
                targetDis.y = pos.y;
                break;
            }
        }
        return targetDis;
    };
    oui.buildLineWithPoints = buildLineWithPoints;
    oui.buildLine = buildLine;
    oui.buildShapeLines = buildShapeLines;
    oui.buildShape = GraphBiz.renderBy;
    oui.getPoints4circle = getPoints4circle;
})(window);








