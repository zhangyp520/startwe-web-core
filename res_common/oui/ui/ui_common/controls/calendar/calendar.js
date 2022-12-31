/** 简单搜索控件 */
(function(win, oui) {
    var Calendar;
    var ctrl = oui.$.ctrl;
    var Control = ctrl.basecontrol;
    /****
     * [{value:'2018-11-16',display:'自定义节假日',icons:[]}]
     * <oui-calendar id='calendar' showType='2' data='[{value:'2018-11-16',display:'自定义节假日,默认为空显示天',icons:[]}]'></oui-calendar>
     *
     *
     * [{value:'2018-11-16',display:'自定义时间柱名称',detail:'详细信息',iconCls:'hello'}]
     * <oui-calendar id='calendar' showType='0' data="[{value:'2018-11-16',display:'自定义时间柱名称',detail:'详细信息',iconCls:'hello'}]"></oui-calendar>
     * <oui-calendar id='calendar' showType='1' data="[{value:'2018-11-16',display:'自定义时间柱名称',detail:'详细信息',iconCls:'hello'}]"></oui-calendar>
     *
     * @param cfg
     * @constructor
     */
    Calendar = function (cfg) {
        Control.call(this, cfg);//必须继承控件超类
        this.attrs = this.attrs + ",onSelected" ;
        this.init = init;
        /*** showType=0,1 的方法列表 年月日程  *****************/
        this.init4timeline = init4timeline;//初始化时间柱
        this.findYearDisplay = findYearDisplay;
        this.findMonthDayDisplay =findMonthDayDisplay;
        this.findSimpleDisplay = findSimpleDisplay;
        this.findDetailDisplay = findDetailDisplay;
        this.event2select4timeline = event2select4timeline;
        /***showType=2, 日历日程 ****/
        this.event2prev = event2prev;
        this.event2next = event2next;
        this.findRows = findRows;
        this.findCurrentDate = findCurrentDate;
        this.eqToday =eqToday;
        this.event2select =event2select;
        this.findCellIcons = findCellIcons;
        this.findCellDisplay = findCellDisplay;



    };
    Calendar.FullName = "oui.$.ctrl.calendar";//设置当前类全名
    ctrl["calendar"] = Calendar;//将控件类指定到特定命名空间下

    Calendar.templateHtml = [];
    Calendar.templateHtml[0]=
        ''+
        '<ul class="time-axis-content">'+
        '{{each data as item index}}'+
        '<li class="time-axis-item" cell-date="{{item.value}}" {{clickName}}="oui.getByOuiId({{ouiId}}).event2select4timeline(this)" >'+
        '<span class="time-axis-item-year">{{oui.getByOuiId(ouiId).findYearDisplay(item)}}</span>'+
        ''+
        '<span class="time-axis-item-dot"><i class="dotStyle {{item.iconCls}}"></i> </span>'+
        ''+
        '<span class="time-axis-item-info">'+
        '<i class="time-axis-item-info-text textTime">{{oui.getByOuiId(ouiId).findMonthDayDisplay(item)}}</i>'+
        '<i class="time-axis-item-info-text">{{oui.getByOuiId(ouiId).findSimpleDisplay(item)}}</i>'+
        '</span>'+
        '{{if oui.getByOuiId(ouiId).findDetailDisplay(item)}}'+
        '<div class="time-axis-tips">'+
        '<div class="time-axis-tips-area">'+
        '{{=oui.getByOuiId(ouiId).findDetailDisplay(item)}}'+
        '</div>'+
        '</div>'+
        '{{/if}}'+
        '</li>'+
        '{{/each}}'+
        '</ul>'+
        '';
    Calendar.templateHtml[1]=Calendar.templateHtml[0];
    Calendar.templateHtml[2]=
        ''+
        '<div class="calendar-header textCenter">'+
        '<button  {{clickName}}="oui.getByOuiId({{ouiId}}).event2prev()" class="calendar-last">上月</button>'+
        '<div class="calendar-info">{{oui.getByOuiId(ouiId).findCurrentDate().y}}-{{oui.getByOuiId(ouiId).findCurrentDate().m}}</div>'+
        '<button  {{clickName}}="oui.getByOuiId({{ouiId}}).event2next()" class="calendar-next">下月</button>'+
        '</div>'+
        '<div class="calendar-content">'+
        '<table class="calendarTable">'+
        '<thead>'+
        '<tr>'+
        '<td>一</td>'+
        '<td>二</td>'+
        '<td>三</td>'+
        '<td>四</td>'+
        '<td>五</td>'+
        '<td>六</td>'+
        '<td>日</td>'+
        '</tr>'+
        '</thead>'+
        '<tbody>'+
        '{{each oui.getByOuiId(ouiId).findRows() as row index}}'+
        '<tr>'+
        '{{each row.cells as cell cellIndex}}'+
        '<td cell-date="{{cell.date}}" cell-day="{{cell.day}}" {{clickName}}="oui.getByOuiId({{ouiId}}).event2select(this)">'+
        '<div class="dateInfo {{if cell.siblings}}siblings{{/if}} {{if oui.getByOuiId(ouiId).eqToday(cell)}}today{{/if}} ">{{oui.getByOuiId(ouiId).findCellDisplay(cell)}}</div>'+
        '<div class="dateIdentification">'+
        '{{each oui.getByOuiId(ouiId).findCellIcons(cell) as cellIcon cellIconIndex}}'+
        '<i class="identification-dot dot-color-{{cellIconIndex+1}} {{cellIcon.cls}}"></i>'+
        '{{/each}}'+
        '</div>'+
        '</td>'+
        '{{/each}}'+
        '</tr>'+
        '{{/each}}'+
        '</tbody>'+
        '</table>'+
        '</div>'+
        '';



    var init = function(){
        var data = this.attr('data')||'[]';
        data = oui.parseJson(data);
        this.attr('data',data);
        var showType = this.attr('showType');
        showType = parseInt(showType+'');
        if(showType ==0 || (showType==1)){
            //初始化时间柱
            this.init4timeline();
        }else{
            this.dateWeek = new DateWeek();
            var date = new Date();
            this.dateWeek.setDate(date.getFullYear(),date.getMonth()+1);
            this.today ={
                y:date.getFullYear(),
                m:date.getMonth()+1,
                d:date.getDate()
            };
            this.currentDate= {
                y:date.getFullYear(),
                m:date.getMonth()+1,
                d:date.getDate()
            };
        }

    };
    /***
     *
     * @param el
     */
    var event2select = function (el) {
        $('.selected',this.getEl()).removeClass('selected');
        $(el).addClass("selected");
        var date = $(el).attr('cell-date');
        var onSelected = this.attr('onSelected');
        if(onSelected){
            onSelected = oui.parseJson(onSelected);
            onSelected&&onSelected(date,this);
        }
    };
    var event2select4timeline = function(el){
        $('.selected',this.getEl()).removeClass('selected');
        $(el).addClass("selected");
        var date = $(el).attr('cell-date');
        var onSelected = this.attr('onSelected');
        if(onSelected){
            onSelected = oui.parseJson(onSelected);
            onSelected&&onSelected(date,this);
        }
    };
    var event2prev=function(){
        var prev = this.dateWeek.getPrev(this.currentDate.y,this.currentDate.m);
        this.currentDate={
            y:prev.y,
            m:prev.m,
            d:prev.d
        };
        this.dateWeek.setDate(prev.y,prev.m);
        this.render();
    };
    var event2next = function(){
        var next = this.dateWeek.getNext(this.currentDate.y,this.currentDate.m);
        this.currentDate={
            y:next.y,
            m:next.m,
            d:next.d
        };
        this.dateWeek.setDate(next.y,next.m);
        this.render();
    };
    var findRows = function(){
        var arr = this.dateWeek.getDayList();
        var result = [];
        var temp = null;
        for(var i=0,len=arr.length;i<len;i++){
            if(i%7==0){
                temp = {};
                temp.cells = [];
                result.push(temp);
            }
            temp.cells.push(arr[i]);
        }
        return result;
    };
    /****
     * 当前设置的时间，非今天时间
     * @returns {{y: number, m: number, d: number}|*|{y: *, m: (number|*), d: *}}
     */
    var findCurrentDate = function(){
        return this.currentDate;
    };
    var eqToday = function (date) {
        var today = this.today;
        var name = this.dateWeek.getName(today.y,today.m,today.d);
        var flag = false;
        if(name == date.date){
            flag = true;
        }
        return flag;
    };
    /*****
     *
     *
     * {
     *  date,day,siblings,week
     * }
     * 获取当前
     */
    var findCellIcons= function(cellDate){
        /* [{value:'2018-11-16',display:'自定义节假日',icons:[{cls:'xx-icon'}]}] ***/
        var date = cellDate.date ||'';
        var data = this.attr('data');
        var icons = [];
        if(!date){
            return icons;
        }
        var one = oui.findOneFromArrayBy(data,function(item){
            if(item.value == date){
                return true;
            }
        });
        if(one){
            icons = one.icons||[];
        }
        return icons;
    };
    /*
        {
     *  date,day,siblings,week
     * }
     */
    var findCellDisplay = function(cellDate){
        var date = cellDate.date ||'';
        var data = this.attr('data');
        var display = '';
        if(!date){
            return '';
        }

        var one = oui.findOneFromArrayBy(data,function(item){
            if(item.value == date){
                return true;
            }
        });
        if(one){
            display = one.display ||cellDate.day;
        }else{
            display = cellDate.day;
        }
        return display;
    };


    /** 初始化时间柱***/
    var init4timeline = function(){
        var showType = this.attr('showType');
        showType = parseInt(showType+'');
        /** 横向或者纵向时间柱***/
        if((showType ==0) || (showType==1)){
            var data = this.attr('data');
            var yearMap ={};
            for(var i= 0,len=data.length;i<len;i++){
                var curr = data[i];
                var date = curr.value;
                var currArr = date.split('-');
                var year = currArr[0];
                if(!yearMap[year]){
                    yearMap[year] = date; //缓存这一年的第一个时间
                }
            }
            this.attr('yearMap',yearMap);
        }
    };
    /******
     * 获取 年显示值，如果同一年中的第一个才显示
     * @param item
     */
    var findYearDisplay = function(item){
        var yearMap = this.attr('yearMap');
        var date = item.value;
        var currYear = date.split('-')[0];
        var year = '';
        if(yearMap[currYear]&&(yearMap[currYear]==item.value)){
            year = currYear;
        }
        return year;
    };
    /****
     * 获取 当前时间事件 的 月-日 显示
     * @param item
     */
    var findMonthDayDisplay = function(item){
        var date = item.value;
        var arr = date.split('-');
        return arr[1]+'-'+arr[2];
    };

    /***
     * 获取当前时间事件的 简单信息
     * @param item
     */
    var findSimpleDisplay = function(item){
        return item.display;
    };

    /***
     * 获取当前时间事件详细显示信息
     * @param item
     */
    var findDetailDisplay = function(item){
        return item.detail;
    };



    /***日历 对象原型 ****/
    var proto = {
        getDay: function(y, m) {
            var mday = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) //判断是否是闰月
                mday[1] = 29;
            return mday[m - 1];
        },
        getWeek: function(y, m, d) {
            var wk;
            if (m <= 12 && m >= 1) {
                for (var i = 1; i < m; ++i) {
                    d += this.getDay(y, i);
                }
            }
            /*根据日期计算星期的公式*/
            wk = (y - 1 + (y - 1) / 4 - (y - 1) / 100 + (y - 1) / 400 + d) % 7;
            //0对应星期天，1对应星期一
            return parseInt(wk);
        },
        getName: function(year,month,day){
            var sm = ''+month;
            var sd = ''+day;
            if(month<10){
                sm = '0'+month;
            }
            if(day<10){
                sd = '0'+day;
            }
            return year + "-" + sm + "-" + sd;
        },
        getPrev: function(y,m){
            if( m-1 == 0){
                return {
                    y: y-1,
                    m: 12,
                    d: this.getDay(y-1, 12)
                };
            }else{
                return {
                    y: y,
                    m: m-1,
                    d: this.getDay(y, m-1)
                };
            }
        },
        getNext: function(y,m){
            if( m+1 > 12 ){
                return {
                    y: y+1,
                    m: 1,
                    d: this.getDay(y+1, 1)
                };
            }else{
                return {
                    y: y,
                    m: m+1,
                    d: this.getDay(y, m+1)
                };
            };
        },
        setDay: function(date,day,siblings){
            var tmp = date.match(/\d+/gi);
            this.dayList.push({
                date: date,
                day: day,
                week: this.getWeek(+tmp[0],+tmp[1],+tmp[2]),
                siblings: !!siblings,
            })
        },
        clear: function(){
            this.dayList = [];
        },
        setDate: function(year, month){
            var cache_name = year + "-" + month;
            if (this.cache[cache_name]) {
                this.dayList = this.cache[cache_name];
                return this;
            }
            //
            this.clear();
            var name = null,
                index = 0,
                year = parseInt(year),
                month = parseInt(month),
                dayTotal = this.getDay(year, month),
                weekFirst = this.getWeek(year,month,1),
                weekLast = this.getWeek(year,month,dayTotal);
            //上月的数据
            var prev = this.getPrev(year, month),
                prevDate = prev.d - weekFirst + 1+1; //+1，从星期一开始算
            for (var i=0; i<weekFirst-1; i++) { //减去1，少算一天，与周一对齐
                name = this.getName(prev.y, prev.m, prevDate);
                this.setDay(name,prevDate,1);
                prevDate++;
                index++;
            }
            //本月数据
            for (var i=1; i<=dayTotal; i++) {
                name = this.getName(year, month, i);
                this.setDay(name,i);
                index++;
            }
            //下月数据
            var next = this.getNext(year, month),
                day = 1;
            while (index<this.maxLen) {
                name = this.getName(next.y, next.m, day);
                this.setDay(name,day,1);
                index++;
                day++;
            };
            //缓存
            this.cache[cache_name] = JSON.parse(JSON.stringify(this.dayList));
            return this;
        },
        getDayList: function(bool) {
            var list = JSON.parse(JSON.stringify(this.dayList));
            if (bool) {
                var len = 7;
                count = 0;
                for (var i=list.length-1; len>=1; i--,len--) {
                    if (list[i]['siblings']) {
                        count++;
                    }
                }
                if (count==7) {
                    len = 7;
                    while (len) {
                        list.pop();
                        len--;
                    }
                }
            }
            return list;
        },
        init: function(){
            this.cache = {};
            this.dayList = [];
            this.maxLen = 42;
            return this;
        }
    };

    /*
     *   日历控件
     var Dw = new DateWeek(),
     dt = new Date();
     Dw.setDate(dt.getFullYear(),dt.getMonth()-0+1);
     var list = Dw.getDayList(bool); //bool:true，自适应长度，会删除首/尾不是当月的一周。bool:false，固定7行*6列=42条数据
     list = [
     {
     date:"2018-1-28"
     day:28
     siblings:true   //上月或者下月的日期，用于区分本月和非本月的日期
     week:0  //0:星期一，1:星期二。。。
     }
     ...
     ]
     */
    function DateWeek(){
        return this.init();
    }
    DateWeek.prototype = proto;
    DateWeek.prototype.constructor = DateWeek;
})(window, oui);





