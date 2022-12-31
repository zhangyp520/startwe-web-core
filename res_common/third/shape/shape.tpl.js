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








