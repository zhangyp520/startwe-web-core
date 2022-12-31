/**
 * 兼容鼠标滚轮事件
 */
_addEvent_ = (function (window, undefined) {
  var _eventCompat = function (event) {
    var type = event.type;
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
      event.delta = event.wheelDelta
        ? event.wheelDelta / 120
        : -(event.detail || 0) / 3;
    }
    //alert(event.delta);
    if (event.srcElement && !event.target) {
      event.target = event.srcElement;
    }
    if (!event.preventDefault && event.returnValue !== undefined) {
      event.preventDefault = function () {
        event.returnValue = false;
      };
    }
    /*......其他一些兼容性处理 */
    return event;
  };
  if (window.addEventListener) {
    return function (el, type, fn, capture) {
      if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll';
      }
      el.addEventListener (
        type,
        function (event) {
          fn.call (this, _eventCompat (event));
        },
        capture || false
      );
    };
  } else if (window.attachEvent) {
    return function (el, type, fn, capture) {
      el.attachEvent ('on' + type, function (event) {
        event = event || window.event;
        fn.call (el, _eventCompat (event));
      });
    };
  }
  return function () {};
}) (window);

/**
 * 表格组件
 */
(function (win, oui, $) {
  var ctrl = oui.$.ctrl;
  var Control = ctrl.basecontrol;

  oui.deleteHTMLTag = function (str) {
    return str.replace (/<[\/\!]*[^<>]*>/gi, '');
  };

  var defaultTablesAttrs = {
    cardShowType: '',
    styleHtml: '',
    headerCls: '',
    headerStyle: '',
    bodyCls: '',
    bodyStyle: '',
    footerCls: '',
    footerStyle: '',
    cellCls: '',
    cellStyle: '',
    data: '',
    dataUrl: '',
    defaultColumnWidth: '100',
    showColumns: true,
    showNumColumn: '',
    showHeaderLines: false,
    showHLines: false,
    showVLines: false,
    allowCellWrap: false,
    allowHeaderWrap: false,
    multiSelect: false,
    allowAlternating: false,
    emptyTips: '暂无数据',
    emptyTipsIcon: true,
    editModel: false, //编辑表格(根据各个列配置的编辑类型显示编辑控件)
    batchEdit: false,
    // "allowEdit": false,//是否允许编辑
    rowDrag: false, //行拖动（仿excel操作）TODO
    lockColumnSize: '-1',
    dataFieldName: 'dataList',
    showColumnsMenu: false,
    showSortIcon: false,
    allowColumnMove: false,
    allowColumnResize: false,
    popupDialogOperateRow: false, //操作行的时候是否弹出dialog,只有showType为1(卡片)的时候才生效
  };

  var defaultColumnAttrs = {
    columnType: '',
    fieldName: '',
    allowSort: false,
    sortField: null,
    width: defaultTablesAttrs.defaultColumnWidth || 100,
    visible: true,
    isEscape: false,
    hideable4menu: false,
    canNotBatchEdit: false,

    headerTitle: '',
    headerAlign: 'left',
    align: 'left',
    headerCls: '',
    cellCls: '',
    headerStyle: '',
    cellStyle: '',
    dataType: 'STRING',

    headerFormat: '',
    headerDotNum: -1,

    format: '',
    formatType: '',
    formatValue: '',
    formatDotNum: -1,

    summaryFormat: '',
    summaryField: null,
    summaryType: '', //count|min|max|sum|avg
    summaryDotNum: -1,
    summaryFilterNull: false, //统计的时候是否过滤空字符串，null等
    calcStr: '', //列计算式

    showTitle: true,
    onrender: null,
    ontitlerender: null,
    extendAttr: null,
    otherAttrs: {},
    onOuiFormClone: null,
    onCellclick: null,
    // render: function (cellData, rowData, rowIndex) {
    //     return cellData;
    // }
  };

  /**
     * 所有的事件属性
     * @type {{onRowclick: null, onRowdblclick: null, onCellclick: null, onCelldblclick: null, onBeforeLoad: null, onAfterLoad: null, onLoaderror: null, onRowSelect: null, onResize: null}}
     */
  var allEventsAttrs = {
    onRowclick: null,
    onRowover: null,
    onRowout: null,
    onRowdblclick: null,
    onCellclick: null,
    onCelldblclick: null,
    onBeforeLoad: null,
    onAfterLoad: null,
    onLoaderror: null,
    onRowSelect: null,
    onRowUnSelect: null,
    onResize: null,
    onColumnVisible: null,
    onColumnWidthChangeStart: null,
    onColumnWidthChangeEnd: null,
    onColumnMoveStart: null,
    onColumnMoveEnd: null,
    onColumnReceive: null,
    onColumnClick: null,
    onPopupDialogOk: null,
    onPopupDialogCancel: null,
    onPopupDialogShow: null,
    onPopupDialogHide: null,
  };

  var eventsAttrs4Str = (function (_eventsAttrs) {
    var str = '';
    for (var key in _eventsAttrs) {
      str += ',' + key;
    }
    if (str === ',') {
      str = '';
    }

    return str;
  }) (allEventsAttrs);

  /**
     * 特殊列的定义
     * @type {{INDEX_COLUMN: {type: string}, CHECKBOX_COLUMN: {type: string}, RADIO_COLUMN: {type: string}}}
     */
  var SpecialColumns = {
    INDEX_COLUMN: {
      tag: 'oui-column-index',
      type: 'indexcolumn',
    },
    CHECKBOX_COLUMN: {
      tag: 'oui-column-checkbox',
      type: 'checkboxcolumn',
    },
    RADIO_COLUMN: {
      tag: 'oui-column-radio',
      type: 'radiocolumn',
    },
  };

  var ORDER_TYPE = {
    DESC: 'desc',
    ASC: 'asc',
  };

  var evalFunc = window.eval;

  /**
     * 控件类构造器
     */
  var TableGrid = function (cfg) {
    Control.call (this, cfg); //必须继承控件超类
    /** 表格属性 **/
    this.attrs =
      this.attrs +
      ',batchEdit,editModel,showNumColumn,styleHtml,cardShowType,headerCls,headerStyle,bodyCls,bodyStyle,footerCls,footerStyle,cellCls,cellStyle,dataUrl,defaultColumnWidth,showColumns,showHeaderLines,showHLines,showVLines,allowCellWrap,allowHeaderWrap,multiSelect,allowAlternating,emptyTips,emptyTipsIcon,lockColumnSize,dataFieldName,showColumnsMenu,showSortIcon,allowColumnMove,allowColumnResize,popupDialogOperateRow';

    this.attrs = this.attrs + eventsAttrs4Str;
    /*当前控件自定义属性，无则去掉本行代码,这里配置了的属性，都可以通过模板引擎取得
         /**
         * 执行控件的初始化函数，完成对构造器new之后的对象进行初始化,如根据某些属性值进行值处理、转换等
         * 该函数，需要实现继承父类初始化的功能
         */

    this.init = init;
    this.afterRender = afterRender;
    this.sortBy = sortBy;
    this.renderByPager = renderByPager;
    this.load = load;
    this.query = query;
    this.updateRow = updateRow;
    this.removeRow = removeRow;
    this.removeRows = removeRows;
    this.addRows = addRows;
    this.addRow = addRow;
    this.moveRow = moveRow;
    this.moveUp = moveUp;
    this.moveDown = moveDown;
    this.clearRows = clearRows;
    this.indexOf = gridIndexOf;
    this.isSelected = isSelected;
    this.getSelecteds = getSelecteds;
    this.getSelected = getSelected;
    this.setSelected = setSelected;
    this.select = select;
    this.selects = selects;
    this.deselect = deselect;
    this.deselects = deselects;
    this.selectAll = selectAll;
    this.deselectAll = deselectAll;
    this.clearSelect = clearSelect;
    this.hideColumn = hideColumn;
    this.showColumn = showColumn;
    this.getRowByIndex = getRowByIndex;
    this.findRowBy = findRowBy;
    this.findRowDomByRow = findRowDomByRow;
    this.findRowsBy = findRowsBy;
    this.getSummaryCellEl = getSummaryCellEl;
    this.scrollIntoView = scrollIntoView;
    this.scrollX = scrollX;
    this.renderRows = renderRows;
    this.formControlUpdate = formControlUpdate;
    this.formControlUpdate4SingleEdit = formControlUpdate4SingleEdit;
    this.formControlUpdate4BatchEdit = formControlUpdate4BatchEdit;
    this.formControlUpdateAfter = formControlUpdateAfter;

    this.getDataByFieldName = getDataByFieldName;

    this.getDataByFieldIndex = getDataByFieldIndex;

    this.getData4Edited = getData4Edited;

    this.getData4Edited4Simple = getData4Edited4Simple;

    this.getPager = getPager;

    this.getRowLength = getRowLength;

    this.resize = resize;

    this.getRowDataByRow = getRowDataByRow;
    this.findControlByRowAndfieldName = findControlByRowAndfieldName;
    this.setColumnContextMenu = setColumnContextMenu;

    this.addColumn = addColumn;
    this.deleteColumn = deleteColumn;
    this.deleteColumnByIndex = deleteColumnByIndex;
    this.getColumnIndex = getColumnIndex;
    this.getColumnWidthByFieldName = getColumnWidthByFieldName;
    this.toggleNumColumn = toggleNumColumn;
    // this.getSourceHtml = getSourceHtml;
    this.editAction = editAction;
    this.findAllColumns = findAllColumns;
    this.findFieldValueByRowAndTitle = findFieldValueByRowAndTitle;
    /*根据行数据对象和title获取这一行的值*/
  };

  TableGrid.FullName = 'oui.$.ctrl.tablegrid'; //设置当前类全名
  ctrl['tablegrid'] = TableGrid; //将控件类指定到特定命名空间下

  TableGrid.proxyColumnTpl = '<div class="proxy-column"></div>';

  TableGrid.proxyTpl = '<div class="proxy"></div>';

  TableGrid.firstTrTpl =
    '<tr style="height: 0;">' +
    '<td style="width: 0;border:0;height: 0;"></td>' +
    '{{each columnsArray as column cIndex}}' +
    '{{if !(column.columns && column.columns.length > 0)}}' +
    '{{if column.visible + "" == "true"}}' +
    '<td id="{{column._id}}" style="height: 0;padding: 0;margin: 0;border: 0;{{if column.width && (column.width+\'\') == \'auto\'}}width: {{column.width}}; {{else}}width: {{column.width || defaultColumnWidth}}px;{{/if}}"></td>' +
    '{{/if}}' +
    '{{/if}}' +
    '{{/each}}' +
    '<td style="width: 0;border:0;"></td>' +
    '</tr>';

  /**
     * 全选的模板
     * @type {string}
     */
  TableGrid.tableCheckboxTpl =
    '<label for="table_{{ouiId}}_all_checkbox">' +
    '<div class="checkbox-wrapper"><input id="table_{{ouiId}}_all_checkbox" name="allCheckbox" type="checkbox" /><i class="selected-icon"></i></div>' +
    '</label>';

  /**
     * 每一行的checkbox 模板
     * @type {string}
     */
  TableGrid.tableCheckbox4TrTpl =
    '<label for="table_{{ouiId}}_checkbox_{{item._index}}">' +
    '<div class="checkbox-wrapper"><input id="table_{{ouiId}}_checkbox_{{item._index}}" {{if item._selected}}checked="checked"{{/if}} name="table_{{ouiId}}_checkbox" type="checkbox"><i class="selected-icon"></i></div>' +
    '</label>';

  /**
     * 表格头部的模板
     * @type {string}
     */
  TableGrid.tableHeaderTpl =
    TableGrid.firstTrTpl +
    '{{each headers as tr h_index }}' +
    '<tr class="oui-table-column-sortable">' +
    '    <td style="width: 0;border:0;"></td>' +
    '    {{each tr as td tr_index}}' +
    '        {{if td.visible + "" == "true"}}' +
    '            {{if td.columnType == "checkboxcolumn"}}' +
    '            <td id="{{td._id}}" theadId="theadId_{{td._id}}" class="text-{{td.headerAlign}} {{td.headerCls}}" style="{{td.headerStyle}}" rowspan="{{headers.length - h_index}}">' +
    '                <div class="header-cell-outer">' +
    "                    <div class=\"header-cell-inner {{if tableAttr['allowHeaderWrap']+'' != 'true'}}header-cell-nowrap{{/if}}\">" +
    TableGrid.tableCheckboxTpl +
    '                    </div>' +
    '                </div>' +
    "                {{if tableAttr['allowColumnResize']+'' == 'true'}}" +
    '                <div class="column-splitter"></div>' +
    '                {{/if}}' +
    '            </td>' +
    '            {{else if td.columnType == "indexcolumn"}}' +
    '            <td id="{{td._id}}" theadId="theadId_{{td._id}}" class="text-{{td.headerAlign}} {{td.headerCls}}" style="{{td.headerStyle}}" rowspan="{{headers.length - h_index}}">' +
    '                <div class="header-cell-outer">' +
    "                    <div class=\"header-cell-inner {{if tableAttr['allowHeaderWrap']+'' != 'true'}}header-cell-nowrap{{/if}}\">" +
    '                        {{=td.header}}' +
    '                    </div>' +
    '                </div>' +
    "                {{if tableAttr['allowColumnResize']+'' == 'true'}}" +
    '                <div class="column-splitter"></div>' +
    '                {{/if}}' +
    '            </td>' +
    '            {{else if td.fieldName && td.fieldName.length > 0}}' +
    '            <td id="{{td._id}}" theadId="theadId_{{td._id}}" class="text-{{td.headerAlign}} {{td.headerCls}}" title="{{td.header && oui.deleteHTMLTag(td.header)}}" style="{{td.headerStyle}}" rowspan="{{headers.length - h_index}}">' +
    "                {{if tableAttr['editModel'] !== 'false' && tableAttr['batchEdit'] + '' === 'true' && !!td.$ouiControlDom}}<div title=\"批量编辑\" class=\"column-batchEdit\"></div>{{/if}}" +
    '                <div class="header-cell-outer">' +
    "                    <div class=\"header-cell-inner {{if tableAttr['allowHeaderWrap']+'' != 'true'}}header-cell-nowrap{{/if}}\">" +
    '                        {{=td.header}}' +
    '                        <div class="grid-sortIcon"></div>' +
    '                    </div>' +
    '                </div>' +
    "                {{if tableAttr['allowColumnResize']+'' == 'true'}}" +
    '                <div class="column-splitter"></div>' +
    '                {{/if}}' +
    '            </td>' +
    '            {{else}}' +
    '                {{if td.columns && td.columns.length > 0}}' +
    '                <td id="{{td._id}}" theadId="theadId_{{td._id}}" title="{{td.header && oui.deleteHTMLTag(td.header)}}" class="text-{{td.headerAlign}} {{td.headerCls}}" style="{{td.headerStyle}}" colspan="{{td.colspan > 0 ? td.colspan:1}}">' +
    '                    <div class="header-cell-outer">' +
    "                        <div class=\"header-cell-inner {{if tableAttr['allowHeaderWrap']+'' != 'true'}}header-cell-nowrap{{/if}}\">" +
    '                            {{=td.header}}' +
    '                        </div>' +
    '                    </div>' +
    '                </td>' +
    '                {{else}}' +
    '                <td id="{{td._id}}" theadId="theadId_{{td._id}}" title="{{td.header && oui.deleteHTMLTag(td.header)}}" class="text-{{td.headerAlign}} {{td.headerCls}}" style="{{td.headerStyle}}">' +
    '                    <div class="header-cell-outer">' +
    "                        <div class=\"header-cell-inner {{if tableAttr['allowHeaderWrap']+'' != 'true'}}header-cell-nowrap{{/if}}\">" +
    '                            {{=td.header}}' +
    '                        </div>' +
    '                    </div>' +
    "                    {{if tableAttr['allowColumnResize']+'' == 'true'}}" +
    '                    <div class="column-splitter"></div>' +
    '                    {{/if}}' +
    '                </td>' +
    '                {{/if}}' +
    '            {{/if}}' +
    '        {{/if}}' +
    '    {{/each}}' +
    '</tr>' +
    '{{/each}}';

  TableGrid.tableRowsTpl = [];
  TableGrid.tableRowsTpl[0] =
    "{{if noNeedFirstTr +'' != 'true'}}" +
    TableGrid.firstTrTpl +
    '{{/if}}' +
    '{{if data && data.length > 0}}' +
    '    {{each data as item index }}' +
    '    <tr id="table_{{ouiId}}_tr_{{item._index}}" class="oui-table-grid-row {{item.cls}}">' +
    '        <td style="width: 0;border:0;"></td>' +
    '        {{each item.trData as td }}' +
    '        {{if td.visible + "" == "true"}}' +
    '        {{if td.columnType == "checkboxcolumn"}}' +
    '        <td id="{{ouiId}}cell_{{td._index}}" class="oui-table-grid-cell {{td.cls}}" style="{{td.cellStyle}}">' +
    "            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">" +
    '                {{if td.text != null && td.text != undefined}}' +
    '                {{=td.text}}' +
    '                {{else}}' +
    TableGrid.tableCheckbox4TrTpl +
    '{{/if}}' +
    '            </div>' +
    '        </td>' +
    '        {{else if td.columnType == "indexcolumn"}}' +
    '        <td id="{{ouiId}}cell_{{td._index}}" class="oui-table-grid-cell {{td.cls}}" style="{{td.cellStyle}}">' +
    "            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}} index-number-cell\">" +
    '                {{if td.text != null && td.text != undefined}}' +
    '                {{=td.text}}' +
    '                {{else}}' +
    '                {{index+1}}' +
    '                {{/if}}' +
    '            </div>' +
    '        </td>' +
    '        {{else}}' +
    "        {{if td.showTitle +'' == 'true'}}" +
    '        <td id="{{ouiId}}cell_{{td._index}}" class="oui-table-grid-cell {{td.cls}}" style="{{td.cellStyle}}" title="{{=(td.title && oui.deleteHTMLTag(td.title))}}">' +
    '            {{else}}' +
    '        <td id="{{ouiId}}cell_{{td._index}}" class="oui-table-grid-cell {{td.cls}}" style="{{td.cellStyle}}">' +
    '            {{/if}}' +
    "            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">{{if" +
    '                td.ouiControlDomHTML}}{{=td.ouiControlDomHTML}}{{else}}{{=td.text}}{{/if}}' +
    '            </div>' +
    '            {{if td.isEdited}}<i class="oui-class-cell-edited"></i>{{/if}}' +
    '        </td>' +
    '        {{/if}}' +
    '        {{/if}}' +
    '        {{/each}}' +
    '    </tr>' +
    '    {{/each}}' +
    '{{else}}' +
    '    {{if emptyTips && emptyTips.length > 0}}' +
    '    <tr id="table_{{ouiId}}_tr_noData" class="oui-table-grid-row">' +
    '        <td style="width: 0;border:0;"></td>' +
    "        <td colspan=\"{{columnsArray.length}}\" class=\"text-center grid-emptyText {{emptyTipsIcon+'' === 'true' ? '':'grid-emptyText-noIcon'}}\">" +
    '            <div class="cell-inner ">{{=emptyTips}}</div>' +
    '        </td>' +
    '    </tr>' +
    '    {{/if}}' +
    '{{/if}}';

  TableGrid.columnChooseListTpl =
    '{{each columnList as column index}}' +
    '<li>' +
    '    <label for="columnChooseList_{{column._id}}">' +
    '        <div class="checkbox-wrapper">' +
    '            {{if column["visible"]+"" == "true"}}' +
    '            <input id="columnChooseList_{{column._id}}" checked="checked" value="{{column._id}}" type="checkbox" />' +
    '            {{else}}' +
    '            <input id="columnChooseList_{{column._id}}" value="{{column._id}}" type="checkbox" />' +
    '            {{/if}}' +
    '            <i class="selected-icon"></i>' +
    '        </div>' +
    '        {{=column.header}}' +
    '    </label>' +
    '</li>' +
    '{{/each}}';

  TableGrid.tableSummaryRowsTpl = [];
  TableGrid.tableSummaryRowsTpl[0] =
    TableGrid.firstTrTpl +
    '{{if data && data.length > 0}}' +
    '    {{each data as item index}}' +
    '        <tr id="table_{{ouiId}}_summary_{{index}}" class="oui-table-grid--summary-row {{item.cls}}">' +
    '            <td style="width: 0;border:0;"></td>' +
    '            {{each item.trData as td }}' +
    '                {{if td.visible + "" == "true"}}' +
    '                    {{if td.columnType == "checkboxcolumn"}}' +
    '                        <td id="{{ouiId}}summary_cell_{{td._index}}" class="oui-table-grid-summary-cell {{td.cls}}" style="{{td.cellStyle}}">' +
    "                            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">&nbsp;</div>" +
    '                        </td>' +
    '                    {{else if td.columnType == "indexcolumn"}}' +
    '                        <td id="{{ouiId}}summary_cell_{{td._index}}" class="oui-table-grid-summary-cell {{td.cls}}" style="{{td.cellStyle}}">' +
    "                            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">&nbsp;</div>" +
    '                        </td>' +
    '                    {{else}}' +
    '                        <td id="{{ouiId}}summary_cell_{{td._index}}" class="oui-table-grid-summary-cell {{td.cls}}" style="{{td.cellStyle}}" title="{{=(td.title && oui.deleteHTMLTag(td.title))}}">' +
    "                            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">" +
    '                               {{if td.ouiControlDomHTML}}&nbsp;{{else}}{{=td.text}}{{/if}}' +
    '                            </div>' +
    '                        </td>' +
    '                    {{/if}}' +
    '                {{/if}}' +
    '            {{/each}}' +
    '        </tr>' +
    '    {{/each}}' +
    '{{/if}}';

  TableGrid.tableSummaryRowsTpl[1] =
    '{{if data && data.length > 0}}' +
    '{{each data as item index}}' +
    '    <dl id="table_{{ouiId}}_summary_{{index}}" class="oui-table-grid--summary-row {{item.cls}}">' +
    '    <dt class="dt-number-cell" style="width:100%;"  >' +
    '        <div class="cell-inner  index-number-cell">统计项:</div>' +
    '        </dt>' +
    '    </dl>' +
    '    <dl id="table_{{ouiId}}_summary_{{index}}" class="oui-table-grid--summary-row {{item.cls}}">' +
    '        {{each item.trData as td }}' +
    '            {{if (td.visible + "" == "true") && (td.summary + "" == "true") }}' +
    '            <dd id="{{ouiId}}summary_cell_{{td._index}}" class="oui-table-grid-summary-cell {{td.cls}}" style="{{td.cellStyle}}" title="{{=(td.title && oui.deleteHTMLTag(td.title))}}" >' +
    "                {{if tableAttr['showColumns']+'\=== 'true'}}" +
    "                <div class=\"oui-grid-column {{if tableAttr['allowHeaderWrap']+'\!= 'true'}}header-cell-nowrap{{/if}} \" title=\"{{td.header && oui.deleteHTMLTag(td.header)}}\">{{=td.header}}</div>" +
    '                {{/if}}' +
    "                <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'\!= 'true'}}rows-cell-nowrap{{/if}}\">{{if td.ouiControlDomHTML}}&nbsp;{{else}}{{=td.text}}{{/if}}</div>" +
    '                </dd>' +
    '            {{/if}}' +
    '        {{/each}}' +
    '    </dl>' +
    '{{/each}}' +
    '{{/if}}';

  // TableGrid.template4HtBorder =
  //     '<!--表格高亮线-->' +
  //     '<div class="htBorders" style="display: none;">' +
  //     '    <!--批量修改-->' +
  //     '    <div style="position: absolute; top: 0; left: 0;">' +
  //     '        <div class="wtBorder fill" style="background-color: red; height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder fill" style="background-color: red; height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder fill" style="background-color: red; height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder fill" style="background-color: red; height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder fill corner" style="background-color: red; height: 5px; width: 5px; border: 2px solid rgb(255, 255, 255); display: none;"></div>' +
  //     '    </div>' +
  //     '    <!--拖动选中-->' +
  //     '    <div style="position: absolute; top: 0; left: 0;">' +
  //     '        <div class="wtBorder area" style="background-color: rgb(137, 175, 249); height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder area" style="background-color: rgb(137, 175, 249); height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder area" style="background-color: rgb(137, 175, 249); height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder area" style="background-color: rgb(137, 175, 249); height: 1px; width: 1px; display: none;"></div>' +
  //     '        <div class="wtBorder area corner" style="background-color: rgb(137, 175, 249); height: 5px; width: 5px; border: 2px solid rgb(255, 255, 255); display: none;"></div>' +
  //     '    </div>' +
  //     '    <!--选中高亮-->' +
  //     '    <div style="position: absolute; top: 0; left: 0;">' +
  //     '        <div class="wtBorder current" style="background-color: rgb(82, 146, 247); height: 2px; width: 2px; display: block;"></div>' +
  //     '        <div class="wtBorder current" style="background-color: rgb(82, 146, 247); height: 2px; width: 2px; display: block;"></div>' +
  //     '        <div class="wtBorder current" style="background-color: rgb(82, 146, 247); height: 2px; width: 2px; display: block;"></div>' +
  //     '        <div class="wtBorder current" style="background-color: rgb(82, 146, 247); height: 2px; width: 2px; display: block;"></div>' +
  //     '        <div class="wtBorder current corner" style="background-color: rgb(82, 146, 247); height: 5px; width: 5px; border: 2px solid rgb(255, 255, 255); display: block;"></div>' +
  //     '    </div>' +
  //     '</div>';

  TableGrid.template4HtBorderItem =
    '<div class="{{cls }}_parent" style="position: absolute; top: 0; left: 0;">' +
    '   <div class="wtBorder {{cls }}" style="background-color: {{color }}; height: {{borderWidth }}px; width: {{width }}px;top:{{top }}px;left:{{left}}px;"></div>' + //上
    '   <div class="wtBorder {{cls }}" style="background-color: {{color }}; height: {{height }}px; width: {{borderWidth }}px;top:{{top }}px;left:{{left}}px"></div>' + //左
    '   <div class="wtBorder {{cls }}" style="background-color: {{color }}; height: {{borderWidth }}px; width: {{width }}px;top:{{top+height-borderWidth }}px;left:{{left }}px"></div>' + //下
    '   <div class="wtBorder {{cls }}" style="background-color: {{color }}; height: {{height }}px; width: {{borderWidth }}px;top:{{top}}px;left:{{left+width-borderWidth }}px"></div>' + //右
    '   <div class="wtBorder {{cls }} corner" style="background-color: {{color }}; height: 5px; width: 5px; border: 2px solid rgb(255, 255, 255); display: none;left:{{left+width-5}}px;top:{{top+height-5}}px"></div>' +
    '</div>';

  /**
     * 定义 html模板,
     * 控件类必须要定义控件模板 属于当前作用域全局变量
     */
  TableGrid.templateHtml = [];

  TableGrid.templateHtml[0] =
    '{{if styleHtml && styleHtml.length > 0}}' +
    '    <style type="text/css">{{styleHtml}}</style>' +
    '{{/if}}' +
    '<div class="table-grid-viewport">' +
    '    <div class="oui-grid-columns">' +
    '        <div class="contextMenu" id="ouiTableColumnContextMenu" style="display:none">' +
    '            <ul>' +
    '            </ul>' +
    '        </div>' +
    '        <div  id="columnOperateBtns" class="column-operate" style="display: none;">' +
    '           <div id="showOrHideColumnBtn" title="隐藏/显示列" class="column-screen" style="display: none;"></div>' +
    '        </div>' +
    '        <div class="column-screen-list" id="columnChooseList" style="display: none;">' +
    '            <ul>' +
    '            </ul>' +
    '            <div class="column-screen-list-btns">' +
    '                <button class="btn-ok">确定</button>' +
    '                <button class="btn-cancel">取消</button>' +
    '            </div>' +
    '        </div>' +
    '        <div class="oui-grid-columns-lock" style="display: none;">' +
    '            <table class="oui-grid-table {{headerCls}}" style="{{headerStyle}}" cellspacing="0" cellpadding="0" border="0">' +
    '                <tbody>' +
    '                <tr style="height: 0;">' +
    '                    <td style="height: 0;width: 0;"></td>' +
    '                    <td style="width: 0;"></td>' +
    '                </tr>' +
    '                </tbody>' +
    '            </table>' +
    '            <div class="header-topRightCell"></div>' +
    '        </div>' +
    '        <div class="oui-grid-columns-view">' +
    '            <table class="oui-grid-table {{headerCls}}" style="{{headerStyle}}" cellspacing="0" cellpadding="0" border="0">' +
    '                <tbody>' +
    '                <tr style="height: 0;">' +
    '                    <td style="height: 0;width: 0;"></td>' +
    '                    <td style="width: 0;"></td>' +
    '                </tr>' +
    '                </tbody>' +
    '            </table>' +
    '            <div class="header-topRightCell"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="oui-grid-body oui-grid-rows">' +
    '        <div class="oui-grid-rows-lock" style="display:none;">' +
    '            <div class="oui-grid-rows-content">' +
    '                <table class="oui-grid-table oui-grid-rowstable {{bodyCls}}" style="{{bodyStyle}}" cellspacing="0" cellpadding="0" border="0">' +
    '                    <tbody>' +
    '                    <tr style="height: 0;">' +
    '                        <td style="height: 0;width: 0;"></td>' +
    '                        <td style="width: 0;"></td>' +
    '                    </tr>' +
    '                    </tbody>' +
    '                </table>' +
    '            </div>' +
    '        </div>' +
    '        <div class="oui-grid-rows-view">' +
    '            <div class="oui-grid-rows-content">' +
    '                <table class="oui-grid-table oui-grid-rowstable {{bodyCls}}" style="{{bodyStyle}}" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">' +
    '                    <tbody>' +
    '                    <tr style="height: 0;">' +
    '                        <td style="height: 0;width: 0;"></td>' +
    '                        <td style="width: 0;"></td>' +
    '                    </tr>' +
    '                    </tbody>' +
    '               </table>' +
    '               <div class="htBorders" style="display: none;"></div>' +
    '            </div>' +
    '        </div>' +
    '        <div class="oui-grid-rows-view-edit"></div>' +
    '    </div>' +
    '    <div class="oui-grid-summaryRow" style="display:none;">' +
    '        <div class="oui-grid-summaryRow-lock" style="display:none;">' +
    '            <table class="oui-grid-table oui-grid-rowstable {{footerCls}}" style="{{footerStyle}}" cellspacing="0" cellpadding="0" border="0">' +
    '                <tbody>' +
    '                <tr style="height: 0;">' +
    '                    <td style="height: 0;width: 0;"></td>' +
    '                    <td style="width: 0;"></td>' +
    '                </tr>' +
    '                </tbody>' +
    '            </table>' +
    '            <div class="header-topRightCell"></div>' +
    '        </div>' +
    '        <div class="oui-grid-summaryRow-view">' +
    '            <table class="oui-grid-table oui-grid-rowstable {{footerCls}}" style="{{footerStyle}}" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">' +
    '                <tbody>' +
    '                <tr style="height: 0;">' +
    '                    <td style="height: 0;width: 0;"></td>' +
    '                    <td style="width: 0;"></td>' +
    '                </tr>' +
    '                </tbody>' +
    '            </table>' +
    '            <div class="header-topRightCell"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="oui-grid-footer"></div>' +
    '</div>';

  TableGrid.templateHtml[1] =
    '{{if styleHtml && styleHtml.length > 0}}<style type="text/css">{{styleHtml}}</style>{{/if}}' +
    '<div class="table-grid-viewport {{if cardShowType !== ""}} table-grid-viewport-card-{{cardShowType}} {{/if}}">' +
    '<div class="oui-grid-body oui-grid-rows">' +
    '   <div class="oui-grid-rows-view">' +
    '      <div class="oui-grid-rows-content">' +
    '           <div class="oui-grid-table oui-grid-rowstable">' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>' +
    '<div class="oui-grid-summaryRow" style="display:none;">' +
    '   <div class="oui-grid-summaryRow-view">' +
    '       <div class="oui-grid-table oui-grid-rowstable">' +
    '       </div>' +
    '   </div>' +
    '</div>' +
    '<div class="oui-grid-footer"></div>' +
    '</div>' +
    '<div class="rowEdit-buttons-content">' +
    '</div>';

  TableGrid.tableRowsTpl[1] =
    "{{if noNeedFirstTr +'' != 'true'}}" +
    '<dl style="height: 0;padding: 0;margin: 0;"></dl>' +
    '{{/if}}' +
    '{{if data && data.length > 0}}' +
    '    {{each data as item index }}' +
    '    <dl id="table_{{ouiId}}_tr_{{item._index}}" class="oui-table-grid-row {{item.cls}}">' +
    '        {{each item.trData as td }}' +
    '        {{if td.visible + "" == "true"}}' +
    '        {{if td.columnType == "checkboxcolumn"}}' +
    '        <dt id="{{ouiId}}cell_{{td._index}}" class="dt-checkbox {{td.cls}}" style="{{td._width}}{{td.cellStyle}}">' +
    "            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">" +
    '                {{if td.text != null && td.text != undefined}}' +
    '                {{=td.text}}' +
    '                {{else}}' +
    TableGrid.tableCheckbox4TrTpl +
    '                {{/if}}' +
    '            </div>' +
    '        </dt>' +
    '        {{else if td.columnType == "indexcolumn"}}' +
    '        <dt id="{{ouiId}}cell_{{td._index}}" class="dt-number-cell {{td.cls}}" style="{{td._width}}{{td.cellStyle}}">' +
    "            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}} index-number-cell\">" +
    '                {{if td.text != null && td.text != undefined}}' +
    '                {{=td.text}}' +
    '                {{else}}' +
    '                {{index+1}}' +
    '                {{/if}}' +
    '            </div>' +
    '        </dt>' +
    '        {{else}}' +
    "        {{if td.showTitle +'' == 'true'}}" +
    '        <dd id="{{ouiId}}cell_{{td._index}}" class="oui-table-grid-cell {{td.cls}}" style="{{td.cellStyle}}" title="{{=(td.title && oui.deleteHTMLTag(td.title))}}">' +
    '            {{else}}' +
    '        <dd id="{{ouiId}}cell_{{td._index}}" class="oui-table-grid-cell {{td.cls}}" style="{{td.cellStyle}}">' +
    '            {{/if}}' +
    "            {{if tableAttr['showColumns']+'' === 'true'}}" +
    "            <div class=\"oui-grid-column {{if tableAttr['allowHeaderWrap']+'' != 'true'}}header-cell-nowrap{{/if}} \" title=\"{{td.header && oui.deleteHTMLTag(td.header)}}\">" +
    '                {{=td.header}}' +
    '            </div>' +
    '            {{/if}}' +
    "            <div class=\"cell-inner {{if tableAttr['allowCellWrap']+'' != 'true'}}rows-cell-nowrap{{/if}}\">{{if" +
    '                td.ouiControlDomHTML}}{{=td.ouiControlDomHTML}}{{else}}{{=td.text}}{{/if}}' +
    '            </div>' +
    '        </dd>' +
    '        {{/if}}' +
    '        {{/if}}' +
    '        {{/each}}' +
    '    </dl>' +
    '    {{/each}}' +
    '{{else}}' +
    '    {{if emptyTips && emptyTips.length > 0}}' +
    '    <dl id="table_{{ouiId}}_tr_noData" class="oui-table-grid-row">' +
    "        <dd colspan=\"{{columnsArray.length}}\" class=\"text-center grid-emptyText {{emptyTipsIcon+'' === 'true' ? '':'grid-emptyText-noIcon'}}\">" +
    '            <div class="cell-inner ">{{=emptyTips}}</div>' +
    '        </dd>' +
    '    </dl>' +
    '    {{/if}}' +
    '{{/if}}';

  /**
     * 为属性方法增加getter setter 方法
     */
  var configSetterGetter4Attr = function () {
    var self = this;
    var attrs = self.attrs;
    var attrsArray = attrs.split (',');
    var attr = '';
    var tempAttr = '';
    for (var i = 0, len = attrsArray.length; i < len; i++) {
      attr = attrsArray[i];
      tempAttr = attr.replace (/\b\w+\b/g, function (word) {
        return word.substring (0, 1).toUpperCase () + word.substring (1);
      });
      //添加setter
      self['set' + tempAttr] = (function (attr) {
        return function (value) {
          self.attr (attr, value);
          if (attr === 'dataUrl') {
            if (self._pagerControl) {
              self._pagerControl.attr (attr, value);
            }
          }
        };
      }) (attr);

      //添加getter
      self['get' + tempAttr] = (function (attr) {
        return function () {
          return self.attr (attr);
        };
      }) (attr);
    }

    //重写getData函数
    self['getData'] = function (isEdit) {
      var self = this;
      var data = self.attr ('data') || [];
      var editColumnsArray = self.attr ('editColumnsArray');
      var newData = [];
      var oldObj = null;
      for (var i = 0, len = data.length; i < len; i++) {
        var newObj = {};
        oldObj = data[i];
        if (typeof isEdit === 'undefined' || !isEdit) {
          //如果不是获取可编辑的则将全部字段继承到新的对象中
          newObj = $.extend (true, {}, rowObjectFilter (oldObj));
        }
        for (var j = 0, jLen = editColumnsArray.length; j < jLen; j++) {
          //将可编辑的字段，都编程value display 的对象
          var fieldName = editColumnsArray[j]['fieldName'];
          var fieldValue = oui.JsonPathUtil.getJsonByPath (fieldName, oldObj);
          if (fieldValue) {
            if (typeof fieldValue !== 'object') {
              oui.JsonPathUtil.setObjByPath (fieldName, newObj, {
                display: '',
                data4DB: '',
                value: fieldValue,
              });
            } else {
              oui.JsonPathUtil.setObjByPath (fieldName, newObj, fieldValue);
            }
          } else {
            oui.JsonPathUtil.setObjByPath (fieldName, newObj, {
              display: '',
              data4DB: '',
              value: '',
            });
          }
        }
        newObj = rowDataObjectFilter (newObj);
        newData.push (newObj);
      }
      return newData;
    };

    self['setData'] = function (data) {
      var _data = [];
      if (data && data.length > 0) {
        for (var i = 0, len = data.length; i < len; i++) {
          var obj = $.extend (true, {}, data[i]);
          _data.push (obj);
        }
      }
      self.attr ('data', _data);
    };
  };

  var getData4Edited = function () {
    var self = this;
    var data = self.attr ('data') || [];
    var editColumnsArray = self.attr ('editColumnsArray');
    var newData = [];
    var oldObj = null;
    var column = null;
    for (var i = 0, len = data.length; i < len; i++) {
      var newObj = {};
      oldObj = data[i];
      newObj = $.extend (true, {}, rowObjectFilter (oldObj));
      if (oldObj['_isEdited']) {
        for (var j = 0, jLen = editColumnsArray.length; j < jLen; j++) {
          //将可编辑的字段，都编程value display 的对象
          column = editColumnsArray[j];
          var fieldName = column['fieldName'];
          var fieldValue = oui.JsonPathUtil.getJsonByPath (fieldName, oldObj);
          if (typeof fieldValue !== 'undefined' && fieldValue !== null) {
            if (typeof fieldValue !== 'object') {
              oui.JsonPathUtil.setObjByPath (fieldName, newObj, {
                display: '',
                data4DB: '',
                value: fieldValue + '',
              });
            } else {
              oui.JsonPathUtil.setObjByPath (
                fieldName,
                newObj,
                fieldValue + ''
              );
            }
          } else {
            oui.JsonPathUtil.setObjByPath (fieldName, newObj, {
              display: '',
              data4DB: '',
              value: '',
            });
          }
        }
        newObj = rowDataObjectFilter (newObj);
        newData.push (newObj);
      }
    }
    return newData;
  };

  var getData4Edited4Simple = function (includeColumns) {
    var self = this;
    var data = self.attr ('data') || [];
    var editColumnsArray = self.attr ('editColumnsArray');
    var newData = [];
    var oldObj = null;
    var column = null;
    if (includeColumns && includeColumns.length > 0) {
      includeColumns = includeColumns.split (',');
    } else {
      includeColumns = [];
    }
    for (var i = 0, len = data.length; i < len; i++) {
      var newObj = {};
      oldObj = data[i];
      newObj = {};
      for (var includeColumnsKey in includeColumns) {
        var key = includeColumns[includeColumnsKey];
        newObj[key] = oui.JsonPathUtil.getJsonByPath (key, oldObj);
      }
      if (oldObj['_isEdited']) {
        for (var j = 0, jLen = editColumnsArray.length; j < jLen; j++) {
          //将可编辑的字段，都编程value display 的对象
          column = editColumnsArray[j];
          var fieldName = column['fieldName'];
          var fieldValue = oui.JsonPathUtil.getJsonByPath (fieldName, oldObj);
          if (typeof fieldValue !== 'undefined' && fieldValue !== null) {
            if (typeof fieldValue !== 'object') {
              oui.JsonPathUtil.setObjByPath (
                fieldName,
                newObj,
                fieldValue + ''
              );
            } else {
              oui.JsonPathUtil.setObjByPath (
                fieldName,
                newObj,
                fieldValue.value + ''
              );
            }
          }
        }
        newData.push (newObj);
      }
    }
    return newData;
  };

  var rowDataObjectFilter = function (rowData) {
    var newRowData = $.extend (true, {}, rowData);
    for (var key in newRowData) {
      var rowDataFieldData = newRowData[key];
      if (rowDataFieldData && 'object' === typeof rowDataFieldData) {
        var newRowDataFiledData = {};
        for (var fieldKey in rowDataFieldData) {
          if (
            fieldKey + '' === 'display' ||
            fieldKey + '' === 'data4DB' ||
            fieldKey + '' === 'value'
          ) {
            newRowDataFiledData[fieldKey] = rowDataFieldData[fieldKey];
          }
        }
        newRowData[key] = newRowDataFiledData;
      }
    }
    return newRowData;
  };

  /**
     * 配置事件属性
     */
  var configEventsAttr = function () {
    var self = this;
    for (var key in allEventsAttrs) {
      var eventStr = self.attr (key);
      if (typeof eventStr === 'string') {
        var _eventFunc = evalFunc (eventStr);
        self.attr (key, _eventFunc);
      }
    }
  };

  /**
     * 初始化默认的配置信息
     */
  var checkConfigs = function () {
    var self = this;
    //设置getter setter
    configSetterGetter4Attr.call (self);

    //循环增加默认值
    var _config;
    for (var key in defaultTablesAttrs) {
      _config = self.attr (key);
      if (key === 'emptyTips') {
        if (typeof _config === 'undefined') {
          self.attr (key, defaultTablesAttrs[key]);
        }
      } else if (typeof _config === 'undefined' || _config === '') {
        self.attr (key, defaultTablesAttrs[key]);
      } else {
        if (key === 'defaultColumnWidth') {
          defaultColumnAttrs['width'] = _config;
        }
      }
    }
    configEventsAttr.call (self);
  };

  /**
     * 控件初始化函数
     */
  var init = function () {
    var self = this;
    checkConfigs.call (self);
  };

  var _parseColumn = function () {
    var self = this;
    var columns = self.attr ('columns') || [];
    if (columns && columns.length > 0) {
      var level = 0;
      _parseColumnsIdByArray (0, 0, -1, columns, level);
      var columnsArray = [];
      var columnsFieldsArray = [];
      var columnsMap = {};
      var editColumnsArray = [];
      var edit4ReadOnlyColumnsArray = [];
      _parseColumnsPutArrayAndMap (
        columnsArray,
        columnsFieldsArray,
        columnsMap,
        columns,
        editColumnsArray,
        edit4ReadOnlyColumnsArray
      );
      self.attr ('maxHeaderLevel', level);
      self.attr ('columns', columns);
      self.attr ('columnsFieldsArray', columnsFieldsArray);
      self.attr ('columnsArray', columnsArray);
      self.attr ('edit4ReadOnlyColumnsArray', edit4ReadOnlyColumnsArray);
      self.attr ('editColumnsArray', editColumnsArray);
      self.attr ('columnsMap', columnsMap);
      var _specialColumns = [];
      var column = null;
      for (var i = 0, len = columnsArray.length; i < len; i++) {
        column = columnsArray[i];
        if (column.columnType === SpecialColumns.INDEX_COLUMN.type) {
          _specialColumns.push (column);
        } else if (column.columnType === SpecialColumns.CHECKBOX_COLUMN.type) {
          _specialColumns.push (column);
        } else if (column.columnType === SpecialColumns.RADIO_COLUMN.type) {
          _specialColumns.push (column);
        }
      }
      self.attr ('specialColumns', _specialColumns);
    } else {
    }
  };

  /**
     * 解析oui-table 标签中的内容 解析出 列 和 tbody 数据
     * @param $dom
     * @private
     */
  var _parseTagHtmlContent = function ($dom) {
    var self = this;
    if ($dom.length > 0) {
      $dom.each (function () {
        var _$dom = $ (this);
        if (_$dom.is ('oui-columns')) {
          //解析列
          var columns = [];
          var _specialColumns = [];
          _parseColumnsByTag (columns, _$dom, 0, _specialColumns);
          self.attr ('columns', columns);
          _parseColumn.call (self);
        } else if (_$dom.is ('oui-tbody')) {
          self.attr ('isTbodyLoad', true);
          var $table = _$dom.find ('table');
          var tr = [];
          // var fieldColumns = self.attr("columnsFieldsArray");//getFieldColumns.call(self);
          $table.find ('tr').each (function () {
            var $tr = $ (this);
            var trObj = {};
            $tr.find ('td').each (function () {
              var $td = $ (this);
              var fieldName = $td.attr ('fieldName'); //fieldColumns[cellIndex];
              if (fieldName && fieldName.length > 0) {
                var data = $td.attr ('data');
                var data4DB = $td.attr ('data4DB');
                var _value = $td.attr ('value');
                var _tdValue = $td.html ();
                if (_value && _value.length > 0) {
                  _tdValue = _value;
                } else {
                  _tdValue = _tdValue && _tdValue.replace (/&amp;/g, '&');
                }
                if (typeof data !== 'undefined' && data !== null) {
                  oui.JsonPathUtil.setObjByPath (fieldName, trObj, {
                    data: data, //$td.html(),
                    data4DB: data4DB,
                    value: _tdValue,
                  });
                } else {
                  oui.JsonPathUtil.setObjByPath (fieldName, trObj, _tdValue);
                }
              } else {
                throw new Error ('tbody 的td 必须配置fieldName');
              }
            });
            tr.push (trObj);
          });
          self.attr ('data', tr);
        } else if (_$dom.is ('oui-style')) {
          var styleHtml = _$dom.html ();
          self.attr ('styleHtml', styleHtml);
        } else if (_$dom.is ('oui-pager')) {
          self._OuiPager$Dom = _$dom;
          // self.attr("oui-pager", _$dom);
        }
      });
    } else {
      throw new Error ('请在oui-table标签中配置列的定义!');
    }
  };

  /**
     * 根据标签解析column配置
     * @param columns
     * @param columns$Dom
     * @param level
     * @param _specialColumns 特殊列数组
     * @returns {*}
     * @private
     */
  var _parseColumnsByTag = function (
    columns,
    columns$Dom,
    level,
    _specialColumns
  ) {
    if (columns$Dom.is ('oui-columns')) {
      var $children = columns$Dom.children ();
      $children.each (function () {
        var column = {};
        var $child = $ (this);
        column['_level'] = level;

        //循环所有的列的属性key，并从html配置中去获取属性值，如果是有属性值就使用html配置的，如果没有则使用默认的属性值
        for (var key in defaultColumnAttrs) {
          // column[key] = typeof $child.attr(key) === 'undefined' ? defaultColumnAttrs[key] : $child.attr(key);
          if (key === 'align' || key === 'headerAlign') {
            var align = $child.attr (key);
            if (typeof align === 'undefined') {
              var dataType = $child.attr ('dataType');
              if (dataType && dataType.toLocaleLowerCase () === 'number') {
                align = 'right';
              } else {
                align = defaultColumnAttrs[key];
              }
            }
            column[key] = align;
          } else {
            column[key] = typeof $child.attr (key) === 'undefined'
              ? defaultColumnAttrs[key]
              : $child.attr (key);
          }
          if (key == 'otherAttrs') {
            column[key] = oui.parseJson (column[key] || '{}');
          }
        }
        if ($child.is ('oui-column')) {
          if ($child.find ('oui-columns').length > 0) {
            //如果含有下子列配置
            column.header =
              $child
                .contents ()
                .filter (function () {
                  return this.nodeType === 3;
                })
                .text ()
                .replace (/\r/g, '')
                .replace (/\n/g, '')
                .replace (/\s/g, '') || ''; // 获取主节点的文本
            //递归获取下一子列配置
            column.columns = [];
            _parseColumnsByTag (
              column.columns,
              $child.children (),
              level + 1,
              _specialColumns
            );
          } else {
            if ($child.find (oui.$.constant.controlTagName).length > 0) {
              column.$ouiControlDom = $child.find (
                oui.$.constant.controlTagName
              )[0];
              $child.find (oui.$.constant.controlTagName).remove ();
            } else {
              column.$ouiControlDom = null;
            }
            var fieldName = $child.attr ('fieldName');

            column.headerTitle = $child.attr ('headerTitle');
            column.header = $child.html ();

            column['fieldName'] = fieldName;
          }
        } else if ($child.is (SpecialColumns.INDEX_COLUMN.tag)) {
          column.columnType = SpecialColumns.INDEX_COLUMN.type;
          column.header = $child.html ();
          _specialColumns.push (column);
        } else if ($child.is (SpecialColumns.CHECKBOX_COLUMN.tag)) {
          column.columnType = SpecialColumns.CHECKBOX_COLUMN.type;
          _specialColumns.push (column);
        } else if ($child.is (SpecialColumns.RADIO_COLUMN.tag)) {
          column.columnType = SpecialColumns.RADIO_COLUMN.type;
          _specialColumns.push (column);
        }
        column.header = formatNumber (
          column['headerFormat'],
          column.header,
          column['headerDotNum']
        );
        columns.push (column);
      });
    }
    return level;
  };

  /**
     * 解析列为列加上id和索引字段
     * @param index
     * @param id
     * @param pId
     * @param columns
     * @param level
     * @returns {{id: *, index: *}}
     * @private
     */
  var _parseColumnsIdByArray = function (index, id, pId, columns, level) {
    for (var i = 0, len = columns.length; i < len; i++) {
      var _column = columns[i];
      var _columns = _column['columns'];
      _column['_id'] = id++;
      _column['_pId'] = pId;
      _column['_level'] = level;
      //循环所有的列的属性key，并从html配置中去获取属性值，如果是有属性值就使用html配置的，如果没有则使用默认的属性值

      for (var key in defaultColumnAttrs) {
        if (key === 'align' || key === 'headerAlign') {
          var align = _column[key];
          if (typeof align === 'undefined') {
            var dataType = _column['dataType'];
            if (dataType && dataType.toLocaleLowerCase () === 'number') {
              align = 'right';
            } else {
              align = defaultColumnAttrs[key];
            }
          }
          _column[key] = align;
        } else {
          _column[key] = typeof _column[key] === 'undefined'
            ? defaultColumnAttrs[key]
            : _column[key];
        }
      }

      if (_columns && _columns.length > 0) {
        level = level + 1;
        var obj = _parseColumnsIdByArray (
          index,
          id,
          _column['_id'],
          _columns,
          level
        );
        id = obj.id;
        index = obj.index;
      } else {
        _column['_index'] = index++;
      }
    }
    return {id: id, index: index};
  };

  /**
     * 根据列配置，将所有的列放到数组和map中方便后面操作
     * @param columnsArray
     * @param columnsFieldsArray
     * @param columnsMap
     * @param columns
     * @param editColumnsArray
     * @param edit4ReadOnlyColumnsArray
     * @private
     */
  var _parseColumnsPutArrayAndMap = function (
    columnsArray,
    columnsFieldsArray,
    columnsMap,
    columns,
    editColumnsArray,
    edit4ReadOnlyColumnsArray
  ) {
    for (var i = 0, len = columns.length; i < len; i++) {
      var _column = columns[i];

      var _columns = _column['columns'];
      columnsArray.push (_column);

      if (_column['fieldName'] && _column['fieldName'].length > 0) {
        columnsFieldsArray.push (_column);
        columnsMap[_column['fieldName']] = _column;
        if (_column.$ouiControlDom) {
          var right = $ (_column.$ouiControlDom).attr ('right');
          if (
            !right ||
            right === 'edit' ||
            right === 'edit4ReadOnly' ||
            right === 'edit4View'
          ) {
            //编辑不可改也属于编辑
            editColumnsArray.push (_column);
            if (right === 'edit4ReadOnly') {
              edit4ReadOnlyColumnsArray.push (_column);
            }
          }
        }
      }

      if (_columns && _columns.length > 0) {
        _parseColumnsPutArrayAndMap (
          columnsArray,
          columnsFieldsArray,
          columnsMap,
          _columns,
          editColumnsArray,
          edit4ReadOnlyColumnsArray
        );
      }
    }
  };

  /**
     * 获取列的colspan，需要用递归来使用
     * @param colspan
     * @param column
     * @returns {*}
     */
  var getColumnColspan = function (colspan, column) {
    var _columns = column['columns'];
    if (_columns && _columns.length > 0) {
      for (var i = 0, len = _columns.length; i < len; i++) {
        if (_columns[i]['visible'] + '' === 'true') {
          if (_columns[i]['columns'] && _columns[i]['columns'].length > 0) {
            colspan += getColumnColspan (colspan, _columns[i]); //如果还有下一级就加上下一级的colspan
          } else {
            colspan++; //如果没有下一级了就直接累加1
          }
        }
      }
    }
    return colspan;
  };

  /**
     * 递归解析表头行
     * @param headers
     * @param columns
     */
  var parseHeaderRows = function (headers, columns) {
    var self = this;
    var tr = [];
    var nextTrColumns = [];
    var visible = false;
    var _pId = -1;
    for (var i = 0, len = columns.length; i < len; i++) {
      var _column = columns[i];
      var _columns = _column['columns'] || [];
      _pId = _column['_pId'];
      if (_column['visible'] + '' === 'true') {
        _column.colspan = getColumnColspan (0, _column);
        tr.push (_column);
        if (_columns && _columns.length > 0) {
          nextTrColumns = nextTrColumns.concat (_columns);
        }
        visible = true;
      } else {
        setColumnsByArray (_columns, {visible: false, lock: true});
      }
    }

    if (_pId > -1) {
      setColumnsById.call (self, _pId, {visible: visible});
    }
    //TODO 多列头锁定
    // var tempTr = [];
    // var tempColumn = null;
    // for (var i = 0, len = tr.length; i < len; i++) {
    //     tempColumn = tr[i];
    //     var flag = false;
    //     for(var j = 0,jLen = nextTrColumns.length;j < jLen;j++){
    //         if(tempColumn["_id"] === nextTrColumns[j]["_id"]) {
    //             flag = true;
    //             // tempTr.push(tempColumn);
    //             break;
    //         }
    //     }
    //     if(!flag){
    //         tempTr.push(tempColumn);
    //     }
    // }
    // headers.push(tempTr);

    headers.push (tr);
    if (nextTrColumns && nextTrColumns.length > 0) {
      parseHeaderRows.call (self, headers, nextTrColumns);
    }
  };

  var getColumnByFieldName = function (fieldName) {
    var self = this;
    var columnsMap = self.attr ('columnsMap');
    if (fieldName) {
      return columnsMap[fieldName];
    }
    return null;
  };

  var getColumnByIndex = function (index, isField) {
    var self = this;
    var columnsArray = self.attr ('columnsArray');
    var column = columnsArray[index];
    if (column) {
      if (isField === true) {
        if (column['fieldName'] && column['fieldName'].length > 0) {
          return column;
        }
      } else {
        return column;
      }
    }
    return null;
  };

  var getRowsUUid = function () {
    var self = this;
    return self.rowsUUId++;
  };

  var setColumnsByArray = function (columns, temColumn) {
    for (var i = 0, len = columns.length; i < len; i++) {
      var _column = columns[i];
      $.extend (true, _column, temColumn);
    }
  };

  var setColumnsById = function (id, tempColumn) {
    var self = this;
    var columnsArray = self.attr ('columnsArray');
    var column = null;
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (columnsArray[i]['_id'] + '' === id + '') {
        column = columnsArray[i];
        if (tempColumn) {
          $.extend (true, column, tempColumn);
          if (columnsArray[i]['_pId'] > -1) {
            setColumnsById.call (self, columnsArray[i]['_pId'], tempColumn);
          }
        }
        break;
      }
    }
    return column;
  };

  var setColumnsByObject = function (object, tempColumn) {
    var self = this;
    var columnsArray = self.attr ('columnsArray');
    var column = null;
    var flag = true;
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      flag = true;
      for (var key in object) {
        if (columnsArray[i][key] !== object[key]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        column = columnsArray[i];
        if (tempColumn) {
          $.extend (true, column, tempColumn);
          if (columnsArray[i]['_pId'] > -1) {
            setColumnsById.call (self, columnsArray[i]['_pId'], tempColumn);
          }
        }
        break;
      }
    }
    return column;
  };

  var replaceFiledName = function (calcFormula) {
    // var reg = /\{([^{]+)}/ig;
    var reg = /\{([^{]+)}|\{([^{]+)}/gi;
    var fields = calcFormula.match (reg);
    if (fields && fields.length > 0) {
      for (var i = 0, len = fields.length; i < len; i++) {
        var field = fields[i];
        var fieldName = field.replace ('{', '').replace ('}', '');

        calcFormula = calcFormula.replace (
          field,
          "this.getValueByFieldName('" + fieldName + "')"
        );
        // calcFormula = calcFormula.replace(field, "oui.formatNumber(formatType,Number(oui.JsonPathUtil.getJsonByPath('" + fieldName + "',item)),dotNum)");
      }
    }
    return calcFormula;
  };

  /**
     * 服务器获取的数据转换成表格所需要的数据
     * @param data
     * @param columnFields
     * @param oldDataLength
     */
  var serverData2tableData = function (data, columnFields, oldDataLength) {
    var self = this;
    columnFields = columnFields || self.attr ('columnsArray') || [];
    if (!columnFields || columnFields.length <= 0) {
      // Logger.warin("字段名值为空");
      console.error ('没有可用的字段');
      return [];
    }

    var sortCfg = self.sortCfg;
    if (sortCfg && sortCfg.sortField && sortCfg.sortField.length > 0) {
      var sortColumn = getColumnByFieldName.call (self, sortCfg.sortField);
      var fieldDataType = sortColumn['dataType'];
      var sortOrder = sortCfg.sortOrder;
      var sortFiledName = sortColumn['sortField'] || sortColumn['fieldName'];

      data = data.sort (function (a, b) {
        var calcStr = sortColumn['calcStr'];
        if (calcStr && calcStr.length > 0) {
          calcStr = replaceFiledName (calcStr);
          calcStr = 'return ' + calcStr;
          var calcObjA = {
            item: a,
            table: self,
            getValueByFieldName: function (fieldName) {
              var value = oui.JsonPathUtil.getJsonByPath (fieldName, this.item);
              return Number (value);
            },
          };

          var calcObjB = {
            item: b,
            table: self,
            getValueByFieldName: function (fieldName) {
              var value = oui.JsonPathUtil.getJsonByPath (fieldName, this.item);
              return Number (value);
            },
          };
          var calcFunc = new Function (calcStr);
          a = calcFunc.call (calcObjA);
          if (a + '' === 'Infinity') {
            a = 0;
          }
          b = calcFunc.call (calcObjB);
          if (b + '' === 'Infinity') {
            b = 0;
          }
        } else {
          a = oui.JsonPathUtil.getJsonByPath (sortFiledName, a); //a[sortCfg.sortField];
          b = oui.JsonPathUtil.getJsonByPath (sortFiledName, b); //b[];
        }

        if (fieldDataType.toLowerCase () === 'number') {
          if (typeof a !== 'undefined') {
            a = (a + '').replace (',', '');
          }
          if (typeof b !== 'undefined') {
            b = (b + '').replace (',', '');
          }
          a = Number (a || '0');
          b = Number (b || '0');
        }

        if (a === b) {
          return 0;
        }

        if (typeof a === typeof b) {
          return a < b
            ? sortOrder === 'asc' ? 1 : -1
            : sortOrder === 'asc' ? -1 : 1;
        }
        return typeof a < typeof b
          ? sortOrder === 'asc' ? 1 : -1
          : sortOrder === 'asc' ? -1 : 1;
      });
    }

    // var tableDataMap = self.tableDataMap || {};
    var tableOuiId = self.attr ('ouiId');
    var tableData = [];

    var cellCls4Table = self.attr ('cellCls');
    var cellStyle4Table = self.attr ('cellStyle');

    var trData = [];
    for (var i = 0, len = data.length; i < len; i++) {
      trData = [];
      var item = data[i] || {};
      // item["_id"] = UUId;//i + oldDataLength + 1;
      // item["_index"] = UUId;//i + oldDataLength;
      // item["_uuid"] = UUId;

      for (var j = 0, jlen = columnFields.length; j < jlen; j++) {
        var columnField = columnFields[j];
        var tdData = {cls: 'text-' + columnField['align']};

        tdData['header'] = columnField['header'];

        if (cellCls4Table) {
          tdData['cls'] += ' ' + cellCls4Table;
        }
        if (columnField['cellCls']) {
          tdData['cls'] += ' ' + columnField['cellCls'];
        }
        tdData['cellStyle'] = oui.styleExtend (
          cellStyle4Table,
          columnField['cellStyle']
        );

        tdData['visible'] = columnField['visible']; //getVisibleByColumn.call(self, columnField);
        if (!(columnField['columns'] && columnField['columns'].length > 0)) {
          tdData['_index'] = columnField['_id'];
          var columnRenderFunc = columnField['onrender'];
          var isEscape = columnField['isEscape'];

          if (columnField.columnType && columnField.columnType.length > 0) {
            //如果是特殊列
            tdData['columnType'] = columnField.columnType;
            var sText = null, _stext;
            if (columnRenderFunc) {
              //如果有渲染函数
              if (typeof columnRenderFunc === 'function') {
                _stext = columnRenderFunc (null, item, item['_index']);
              } else if (typeof columnRenderFunc === 'string') {
                try {
                  var f = evalFunc (columnRenderFunc);
                  _stext = f (
                    null,
                    item,
                    item['_index'],
                    columnField,
                    tableOuiId
                  );
                } catch (e) {
                  throw new Error (columnRenderFunc + ' 执行异常');
                }
              }

              if (typeof _stext !== 'undefined') {
                sText = _stext;
              }
            }
            if (self.attr ('specialColumns').length === 1) {
              tdData['_width'] = 'width:100%;';
            } else {
              tdData['_width'] = '';
            }
            tdData['text'] = sText;
          } else {
            var fieldName = columnField['fieldName'] || '';
            var columnTitleRenderFunc = columnField['ontitlerender'];

            var formatType = columnField['format'];

            var text = oui.JsonPathUtil.getJsonByPath (fieldName, item); //item[fieldName]

            try {
              var calcStr = columnField['calcStr'];
              if (calcStr && calcStr.length > 0) {
                calcStr = replaceFiledName (calcStr);
                calcStr = 'return ' + calcStr;
                var calcObj = {
                  item: item,
                  table: self,
                  getValueByFieldName: function (fieldName) {
                    var value = oui.JsonPathUtil.getJsonByPath (
                      fieldName,
                      this.item
                    );
                    return Number (value);
                  },
                };
                var calcFunc = new Function (
                  'formatType',
                  'item',
                  'dotNum',
                  calcStr
                );
                text = calcFunc.call (
                  calcObj,
                  formatType,
                  item,
                  columnField['formatDotNum']
                );
                if (text + '' === 'Infinity') {
                  text = 0;
                }
              }
            } catch (e) {
              console.error (e);
            }
            text = formatNumber (formatType, text, columnField['formatDotNum']);
            var title = text || '';
            var _text;
            var editModel = self.attr ('editModel');
            var $ouiControlDom = columnField['$ouiControlDom'];
            if (!$ouiControlDom) {
              if (columnRenderFunc) {
                //如果有渲染函数
                if (typeof columnRenderFunc === 'function') {
                  _text = columnRenderFunc (text, item, item['_index']);
                } else if (typeof columnRenderFunc === 'string') {
                  try {
                    var f = evalFunc (columnRenderFunc);
                    _text = f (
                      text,
                      item,
                      item['_index'],
                      columnField,
                      tableOuiId
                    );
                  } catch (e) {
                    throw new Error (columnRenderFunc + ' 执行异常');
                  }
                }
                text = _text;
                // TODO
                // if (typeof _text !== 'undefined') {
                //     text = ((isEscape + "" === "true") ? oui.escapeStringToHTML(_text, false) : _text);
                // }
              }
              tdData['text'] = $.trim (text).length > 0
                ? isEscape + '' === 'true'
                    ? oui.escapeStringToHTML (text, false)
                    : text
                : '&nbsp;';
            } else {
              text = text && typeof text.value !== 'undefined'
                ? text
                : {
                    value: text,
                    data: '',
                  };
              title = text.value || '';
              if (editModel !== 'all') {
                var textDisplay = getTdDisplay (columnField, text);
                title = textDisplay;
                textDisplay = $.trim (textDisplay).length > 0
                  ? isEscape + '' === 'true'
                      ? oui.escapeStringToHTML (textDisplay, false)
                      : textDisplay
                  : '&nbsp;';
                tdData['text'] = textDisplay;
                tdData['isEdited'] = !!text.isEdited;
              } else {
                var ouiFormId =
                  self.attr ('id') +
                  'rows' +
                  item['_index'] +
                  'cell' +
                  tdData['_index'] +
                  '_control';
                var _$ouiControlDom = $ ($ouiControlDom)
                  .clone ()
                  .attr ('id', ouiFormId);
                var onUpdateStr = _$ouiControlDom.attr ('onupdate');
                var formUpdate =
                  'oui.getByOuiId(' +
                  self.attr ('ouiId') +
                  ').formControlUpdate';
                if (onUpdateStr && onUpdateStr.length > 0) {
                  onUpdateStr += ',' + formUpdate;
                } else {
                  onUpdateStr = formUpdate;
                }
                _$ouiControlDom.attr ('onUpdate', onUpdateStr);

                var onAfterUpdateStr = _$ouiControlDom.attr ('onafterupdate');
                var formControlUpdateAfter =
                  'oui.getByOuiId(' +
                  self.attr ('ouiId') +
                  ').formControlUpdateAfter';
                if (onAfterUpdateStr && onAfterUpdateStr.length > 0) {
                  onAfterUpdateStr += ',' + formControlUpdateAfter;
                } else {
                  onAfterUpdateStr = formControlUpdateAfter;
                }
                _$ouiControlDom.attr ('onAfterUpdate', onAfterUpdateStr);
                var name = _$ouiControlDom.attr ('name');
                _$ouiControlDom.attr ('name', name);

                var onOuiFormClone = columnField['onOuiFormClone'];
                if (onOuiFormClone) {
                  onOuiFormClone = evalFunc (onOuiFormClone);
                  onOuiFormClone &&
                    onOuiFormClone.call (
                      self,
                      self,
                      _$ouiControlDom,
                      item['_index'],
                      tdData['_index']
                    );
                }
                if (text.data) {
                  _$ouiControlDom.attr (
                    'data',
                    typeof text.data === 'string'
                      ? text.data
                      : oui.parseString (text.data)
                  );
                }
                if (text.data4DB) {
                  _$ouiControlDom.attr (
                    'data4DB',
                    typeof text.data4DB === 'string'
                      ? text.data4DB
                      : oui.parseString (text.data4DB)
                  );
                }
                if (typeof text.value !== 'undefined' && text.value !== null) {
                  _$ouiControlDom.attr (
                    'value',
                    oui.escapeHTMLToString (text.value)
                  );
                }
                tdData['ouiControlDomHTML'] = _$ouiControlDom[0].outerHTML;
                tdData['text'] = $.trim (text.value).length > 0
                  ? text
                  : '&nbsp;';
              }
            }
            var showTitle = columnField['showTitle'];
            if (showTitle + '' === 'true') {
              var _title;
              if (columnTitleRenderFunc) {
                if (typeof columnTitleRenderFunc === 'function') {
                  _title = columnTitleRenderFunc (title, item, item['_index']);
                } else if (typeof columnTitleRenderFunc === 'string') {
                  try {
                    var f = evalFunc (columnTitleRenderFunc);
                    _title = f (
                      title,
                      item,
                      item['_index'],
                      columnField,
                      tableOuiId
                    );
                  } catch (e) {
                    throw new Error (columnTitleRenderFunc + ' 执行异常');
                  }
                }

                if (typeof _title !== 'undefined') {
                  title = _title;
                }
              }
              tdData['showTitle'] = showTitle;
              title = isEscape + '' === 'true'
                ? oui.escapeStringToHTML (title, false)
                : title;
              if (title + '' !== 'null') {
                tdData['title'] = title + ''; //$(text).text();
              } else {
                tdData['title'] = ''; //$(text).text();
              }
            }
          }
          trData.push (tdData);
        }
      }

      var cls = '';
      var allowAlternating = self.attr ('allowAlternating') || false;
      if (allowAlternating + '' === 'true') {
        cls = i % 2 !== 0 ? 'grid-row-alt' : '';
      }
      var trObj = {
        cls: cls,
        _index: item['_index'],
        _selected: item['_selected'],
        trData: trData,
      };
      tableData.push (trObj);
    }
    return tableData;
  };

  var getTdDisplay = function (columnField, text) {
    var controlDom = columnField.$ouiControlDom;
    var $controlDom = $ (controlDom);
    var type = $controlDom.attr ('type');
    var textValue = text.value;
    var data = $controlDom.attr ('data');
    data = oui.parseJson (data || '[]');
    var item = null;
    var i, len;
    var data4DB;
    switch (type) {
      case 'singleselect':
        item = null;
        for ((i = 0), (len = data.length); i < len; i++) {
          item = data[i];
          if (textValue + '' === item.value + '') {
            textValue = item.display;
            break;
          }
        }
        break;
      case 'multiselect':
        item = null;
        var _textValue = [];
        for ((i = 0), (len = data.length); i < len; i++) {
          item = data[i];
          if (textValue && textValue.indexOf (item.value) > -1) {
            _textValue.push (item.display);
          }
        }
        textValue = _textValue.join (',');
        break;
      case 'selectperson':
        data = text.data;
        if (!data) {
          throw '请传入选人的data';
        }
        data = oui.parseJson (data || '[]');
        displayArray = [];
        if (data && data.length > 0) {
          var displayArray = [];
          for ((i = 0), (len = data.length); i < len; i++) {
            displayArray.push (data[i].name);
          }
        }
        textValue = displayArray.join (',');
        break;
      case 'lbs':
        //不需要做特殊处理，直接使用value值就可以回显到表格上
        // data4DB = text.data4DB;
        // if(!data4DB){
        //     throw "请传入地理位置控件的data4DB";
        // }
        break;
      // case "multiselect":
      //     item = null;
      //     var _textValue = [];
      //     for (i = 0, len = data.length; i < len; i++) {
      //         item = data[i];
      //         if ((textValue) && (textValue.indexOf(item.value) > -1)) {
      //             _textValue.push(item.display);
      //         }
      //     }
      //     textValue = _textValue.join(",");
      //     break;
      //TODO ..more
      default:
        break;
    }
    return textValue;
  };

  /**
     * 服务器获取的数据转换成表格所需要的数据
     * @param data
     * @param columnFields
     */
  var getSummaryTableData = function (data, columnFields) {
    var self = this;
    columnFields = columnFields || self.attr ('columnsArray') || [];
    if (!columnFields || columnFields.length <= 0) {
      // Logger.warin("字段名值为空");
      console.error ('没有可用的字段');
      return [];
    }

    var tableData = [];

    var trData = [];

    for (var j = 0, jlen = columnFields.length; j < jlen; j++) {
      var columnField = columnFields[j];
      var tdData = {cls: 'text-' + columnField['align']};

      tdData['header'] = columnField['header'];

      if (columnField['cellCls']) {
        tdData['cls'] += ' ' + columnField['cellCls'];
      }

      if (columnField['cellStyle']) {
        tdData['cellStyle'] = columnField['cellStyle'];
      }

      tdData['visible'] = columnField['visible'];

      if (!(columnField['columns'] && columnField['columns'].length > 0)) {
        tdData['_index'] = columnField['_id'];

        if (columnField.columnType && columnField.columnType.length > 0) {
          //如果是特殊列
          tdData['columnType'] = columnField.columnType;
        } else {
          var fieldName =
            columnField['summaryField'] || columnField['fieldName'] || '';
          var summaryType = columnField['summaryType'];
          var format = columnField['summaryFormat'];
          var summaryDotNum = columnField['summaryDotNum'];
          if (summaryType && summaryType.length > 0) {
            var $ouiControlDom = columnField['$ouiControlDom'];
            var filedDataArray = self.getDataByFieldName (fieldName);
            var summaryFilterNull = columnField['summaryFilterNull'];
            var summaryTypes = summaryType.split (',');
            var text = '';
            var i, len;
            var minValue, maxValue, sumValue, avgValue;
            if (!$ouiControlDom) {
              text = '';
              if (summaryFilterNull + '' === 'true') {
                filedDataArray = handleNull (filedDataArray);
              }

              for ((i = 0), (len = summaryTypes.length); i < len; i++) {
                switch (summaryTypes[i]) {
                  case 'count':
                    text += '计数:' + filedDataArray.length + '<br/>';
                    break;
                  case 'min':
                    minValue = oui.CalcMath.min (filedDataArray);
                    minValue = formatNumber (format, minValue, summaryDotNum);
                    text += '最小值:' + minValue + '<br/>';
                    break;
                  case 'max':
                    maxValue = oui.CalcMath.max (filedDataArray);
                    maxValue = formatNumber (format, maxValue, summaryDotNum);
                    text += '最大值:' + maxValue + '<br/>';
                    break;
                  case 'sum':
                    sumValue = oui.CalcMath.sum (filedDataArray);
                    sumValue = formatNumber (format, sumValue, summaryDotNum);
                    text += '合计:' + sumValue + '<br/>';
                    break;
                  case 'avg':
                    avgValue = oui.CalcMath.avg (filedDataArray);
                    avgValue = formatNumber (format, avgValue, summaryDotNum);
                    text += '平均:' + avgValue + '<br/>';
                    break;
                  default:
                    break;
                }
              }
              tdData['text'] =
                text.substring (0, text.lastIndexOf ('<br/>')) || '&nbsp;';
              tdData['title'] = tdData['text'];
            } else {
              filedDataArray = (function (filedDataArray) {
                filedDataArray = filedDataArray || [];
                var _newArray = [];
                for (var i = 0, len = filedDataArray.length; i < len; i++) {
                  if (filedDataArray[i] && filedDataArray[i]['value']) {
                    try {
                      _newArray.push (Number (filedDataArray[i]['value']));
                    } catch (e) {
                      console.error ('字段字不是数字类型');
                      _newArray.push (null);
                    }
                  } else {
                    _newArray.push (null);
                  }
                }
                return _newArray;
              }) (filedDataArray);
              text = '';
              if (summaryFilterNull + '' === 'true') {
                filedDataArray = handleNull (filedDataArray);
              }
              for ((i = 0), (len = summaryTypes.length); i < len; i++) {
                switch (summaryTypes[i]) {
                  case 'count':
                    text += '计数:' + filedDataArray.length + '<br/>';
                    break;
                  case 'min':
                    minValue = oui.CalcMath.min (filedDataArray);
                    minValue = formatNumber (format, minValue, summaryDotNum);
                    text += '最小值:' + minValue + '<br/>';
                    break;
                  case 'max':
                    maxValue = oui.CalcMath.max (filedDataArray);
                    maxValue = formatNumber (format, maxValue, summaryDotNum);
                    text += '最大值:' + maxValue + '<br/>';
                    break;
                  case 'sum':
                    sumValue = oui.CalcMath.sum (filedDataArray);
                    sumValue = formatNumber (format, sumValue, summaryDotNum);
                    text += '合计:' + sumValue + '<br/>';
                    break;
                  case 'avg':
                    avgValue = oui.CalcMath.avg (filedDataArray);
                    avgValue = formatNumber (format, avgValue, summaryDotNum);
                    text += '平均:' + avgValue + '<br/>';
                    break;
                  default:
                    break;
                }
              }
              tdData['text'] =
                text.substring (0, text.lastIndexOf ('<br/>')) || '&nbsp;';
              tdData['title'] = tdData['text'];
            }
            tdData['summary'] = true;
          } else {
            tdData['summary'] = false;
            tdData['text'] = '&nbsp;';
            tdData['title'] = '';
          }
        }
        trData.push (tdData);
      }
    }

    var trObj = {
      cls: '',
      trData: trData,
    };

    tableData.push (trObj);

    return tableData;
  };

  var formControlUpdateAfter = function (control) {
    var tableOuiId = control.attr ('tableOuiId');
    var tableControl = oui.getByOuiId (tableOuiId);
    tableControl._RSummaryRow ();
    if (
      control.attr ('type') === 'uploadfile' ||
      control.attr ('type') === 'lbs'
    ) {
      tableControl._RRowsHeight ();
    }
  };

  var formControlUpdate = function (control, isEdited, isBatchEdit) {
    var controlValue = control.attr ('value');
    var controlDisplay = control.getData4DB ();
    var controlId = control.attr ('id');

    var fieldName = control.attr ('name');
    // var nameSuffix = control.attr("nameSuffix");
    var controlData = control.attr ('data');
    // fieldName = fieldName.replace(nameSuffix, "");
    var tableOuiId = control.attr ('tableOuiId');
    var tableControl = oui.getByOuiId (tableOuiId);
    var tableData = tableControl.attr ('data');
    var rowIndex = null;
    var rowIds = [];
    var i, len;
    if (!isBatchEdit) {
      rowIndex = controlId.substring (
        controlId.indexOf ('rows') + 4,
        controlId.indexOf ('cell')
      );
    } else {
      var selectedData = tableControl.getSelecteds ();
      if (selectedData.length > 0) {
        for ((i = 0), (len = selectedData.length); i < len; i++) {
          rowIds.push (selectedData[i]['_index']);
        }
      }
    }
    var rowData = null;
    var fileData = null;
    for ((i = 0), (len = tableData.length); i < len; i++) {
      rowData = tableData[i];
      if (
        (isBatchEdit &&
          (rowIds.length <= 0 || rowIds.indexOf (rowData['_index']) > -1)) ||
        rowData['_index'] + '' === rowIndex + ''
      ) {
        fileData = oui.JsonPathUtil.getJsonByPath (fieldName, rowData);
        // fileData = rowData[fieldName];
        if (fileData && 'object' === typeof fileData) {
          fileData['controlOuiId'] = control.attr ('ouiId');
          fileData['controlType'] = control.attr ('type');
          fileData['value'] = controlValue;
          fileData['data'] = typeof controlData === 'string'
            ? controlData
            : oui.parseString (controlData);
          fileData['data4DB'] = controlDisplay;
          fileData['display'] = controlDisplay;
        } else {
          fileData = {
            controlOuiId: control.attr ('ouiId'),
            controlType: control.attr ('type'),
            value: controlValue,
            data: typeof controlData === 'string'
              ? controlData
              : oui.parseString (controlData),
            display: controlDisplay,
            data4DB: controlDisplay,
          };
        }
        if (isEdited) {
          fileData['isEdited'] = true;
          rowData['_isEdited'] = true;
        }
        oui.JsonPathUtil.setObjByPath (fieldName, rowData, fileData, true);
        // rowData[fieldName] = fileData;
      }
      tableData[i] = rowData;
    }
  };

  var formControlUpdate4SingleEdit = function (control) {
    var tableOuiId = control.attr ('tableOuiId');
    var controlId = control.attr ('id');
    var tableControl = oui.getByOuiId (tableOuiId);
    formControlUpdate.call (tableControl, control, true);
    var rowIndex = controlId.substring (
      controlId.indexOf ('rows') + 4,
      controlId.indexOf ('cell')
    );
    var row = tableControl.findRowBy ({_index: Number (rowIndex)});
    tableControl.updateRow (row, row, true);
  };

  var formControlUpdate4BatchEdit = function (control) {
    var tableOuiId = control.attr ('tableOuiId');
    var tableControl = oui.getByOuiId (tableOuiId);
    formControlUpdate.call (tableControl, control, true, true);
    tableControl._RRowsView ();
    tableControl._RSummaryRow ();
  };

  /**
     * 表格初始化后执行函数
     */
  var afterRender = function () {
    var self = this;

    //根据oui-table 标签内定义的 oui-columns 和 oui-tbody解析配置和数据
    var configsHTML = self.attr ('value') || '';

    //解析列配置
    if ($.trim (configsHTML).length > 0) {
      //使用html方式进行配置
      var $config = $ (configsHTML);
      _parseTagHtmlContent.call (this, $config);
    } else {
      var columns = self.attr ('columns');
      if (columns && columns.length > 0) {
        _parseColumn.call (self);
      } else {
        throw new Error ('请配置列信息！');
      }
    }

    var showType = self.attr ('showType');

    self.isCard = showType + '' === '1';

    self.rowsUUId = 0;

    self.sortCfg = {};

    initView.call (self);

    initStyle.call (self);

    initOuiPager.call (self);

    initRenderFunc.call (self);

    initEvents.call (self);

    render$gridLines.call (self);

    render$Columns.call (self);

    var isTbodyLoad = self.attr ('isTbodyLoad');

    initData.call (self, false, isTbodyLoad);

    if (self.attr ('showNumColumn') + '' !== '') {
      toggleNumColumn.call (self);
    }

    //监听窗口，或者iframe 大小改变事件后 重新计算宽度
    $ (window).on ('resize', function () {
      self && self.resize && self.resize ();
    });
  };

  var initStyle = function () {
    var self = this;
    var styleHtml = self.attr ('styleHtml');
    if (styleHtml && styleHtml.length > 0) {
      var $style = self._$tableGridView.find ('style');
      if ($style.length <= 0) {
        self._$tableGridView.prepend (
          '<style type="text/css">' + styleHtml + '</style>'
        );
      }
    }
  };

  /**
     * 解析控件是否包含分页控件，如果有则初始化分页控件并绑定
     */
  var initOuiPager = function () {
    var self = this;
    var ouiPagerDom = self._OuiPager$Dom;
    if (ouiPagerDom) {
      var pagerControlId = ouiPagerDom.attr ('id');
      self._$gridFooter.append (ouiPagerDom);
      oui.parseByDom (self._$gridFooter.find ('#' + pagerControlId)[0]);
      self._$gridFooter.show ();
      self._pagerControl = oui.getById (pagerControlId);
      self._pagerControl.oldGoPageOK = self._pagerControl.attr ('onGo2pageOk');
      self._pagerControl.attr ('dataUrl', self.getDataUrl ());
      self._pagerControl.attr ('onGo2pageOk', function (pager, result) {
        if (oui.os.mobile) {
          //FIXME 移动端只存在下一页和回到顶部的按钮事件功能,如果是第一页则执行html全部替换否则执行append
          if (
            pager.attr ('pageIndex') !== 0 &&
            pager.attr ('pageIndex') !== 1
          ) {
            renderByPager4phone.call (self, pager, result);
          } else {
            self.renderByPager (pager, result);
            self.scrollIntoView (0);
          }
        } else {
          self._$columns
            .find ('#table_' + self.attr ('ouiId') + '_all_checkbox')
            .prop ('checked', false);
          self.renderByPager (pager, result);
          self.scrollIntoView (0);
        }
        self._pagerControl.oldGoPageOK &&
          self._pagerControl.oldGoPageOK (pager, result);
      });
      if (oui.os.mobile) {
        self._pagerControl.attr (
          'onScroll2Top',
          function (/*pager*/) {
            self.scrollIntoView (0);
          }
        );
      }
    } else {
      self._$gridFooter.hide ();
    }
  };

  var getPager = function () {
    var self = this;
    if (self._pagerControl) {
      return self._pagerControl;
    } else {
      return null;
    }
  };

  var initView = function () {
    var self = this;

    self._$tableGridView = $ (self.getEl ());

    self._$viewport = self._$tableGridView.find ('.table-grid-viewport');

    self._$columns = self._$tableGridView.find ('.oui-grid-columns');
    self._$columnsLock = self._$columns.find ('.oui-grid-columns-lock');
    self._$columnsView = self._$columns.find ('.oui-grid-columns-view');

    self._$columnsOperateBtns = self._$columns.find ('#columnOperateBtns');
    self._$showOrHideColumnBtns = self._$columns.find ('#showOrHideColumnBtn');

    self._$columnChooseList = self._$columns.find ('#columnChooseList');
    self._$columnsChooseOperateBtns = self._$columnChooseList.find (
      '.column-screen-list-btns'
    );

    self._$rows = self._$tableGridView.find ('.oui-grid-rows');

    self._$rowsLock = self._$rows.find ('.oui-grid-rows-lock');
    self._$rowsLockContent = self._$rowsLock.find ('.oui-grid-rows-content');

    self._$rowsView = self._$rows.find ('.oui-grid-rows-view');
    self._$rowsViewContent = self._$rowsView.find ('.oui-grid-rows-content');

    self._$rowsViewEdit = self._$rows.find ('.oui-grid-rows-view-edit');

    self._$summaryRow = self._$tableGridView.find ('.oui-grid-summaryRow');
    self._$summaryRowLock = self._$summaryRow.find (
      '.oui-grid-summaryRow-lock'
    );
    self._$summaryRowView = self._$summaryRow.find (
      '.oui-grid-summaryRow-view'
    );

    self._$gridFooter = self._$tableGridView.find ('.oui-grid-footer');

    self._getTableEditView = function (isCreate) {
      // var tableOuiId = self.attr("ouiId");
      var $editView = self._$viewport.find ('#ouiTableEditView');
      if ($editView.length <= 0 && isCreate) {
        self._$viewport.append (
          "<div id='ouiTableEditView' style='position: absolute;display: none;z-index: 99;'></div>"
        );
      }
      $editView = self._$viewport.find ('#ouiTableEditView');
      return $editView;
    };
    self._getTableBatchEditView = function (isCreate) {
      var html =
        '<div class="column-batchEdit-area">' +
        '<div class="batchEdit-area-input">' +
        // '<oui-form id="testData" name="data" type="datepicker" showType="2"></oui-form>'  +
        '</div>' +
        '<div class="batchEdit-area-btn">' +
        '<button class="batchEdit-btn batchEdit-btn-submit">确定</button>' +
        '<button class="batchEdit-btn batchEdit-btn-cancel">取消</button>' +
        '</div>' +
        '</div>';
      var $div = $ (html);
      $div.attr ('id', 'ouiTableBatchEditView');
      $div.css ({
        position: 'absolute',
      });
      var $editView = self._$viewport.find ('#ouiTableBatchEditView');
      var $input = $editView.find ('.batchEdit-area-input');
      if (isCreate) {
        if ($editView.length <= 0) {
          self._$viewport.append ($div);
        } else {
          if ($input.length <= 0) {
            $editView.html ($div.html ());
          }
        }
      }
      $editView = self._$viewport.find ('#ouiTableBatchEditView');
      return $editView;
    };
  };

  var getVisibleColumns = function (columnsArray) {
    var newArray = [];
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (columnsArray[i]['visible'] + '' === 'true') {
        newArray.push (columnsArray[i]);
      }
    }
    return newArray;
  };

  var getSummaryColumn = function (columnsArray) {
    var flag = false;
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (
        columnsArray[i]['summaryType'] &&
        columnsArray[i]['summaryType'].length > 0
      ) {
        flag = true;
        break;
      }
    }
    return flag;
  };

  var getLockColumns = function (columnsArray, lockSize) {
    var lockArray = [];
    var noLockArray = [];
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (i < lockSize) {
        lockArray.push (columnsArray[i]);
      } else {
        noLockArray.push (columnsArray[i]);
      }
    }
    return {
      lockArary: lockArray,
      noLockArray: noLockArray,
    };
  };

  var dataPutIdAndIndex = function (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      data[i]['_uuid'] = data[i]['_index'] = data[i]['_id'] = getRowsUUid.call (
        this
      );
    }
  };

  var initRenderFunc;
  initRenderFunc = function () {
    var self = this;

    var showType = self.attr ('showType');

    self._R_columnsTable = template.compile (TableGrid.tableHeaderTpl);
    self._R_RowsTable = template.compile (TableGrid.tableRowsTpl[showType]);
    self._R_columnChooseList = template.compile (TableGrid.columnChooseListTpl);

    self._R_summaryRow = template.compile (
      TableGrid.tableSummaryRowsTpl[showType]
    );

    self._R_HtBorder = template.compile (TableGrid.template4HtBorderItem);
    var rowsContentSelector = '.oui-grid-table tbody';
    var rowDomSelector = '.oui-grid-table tbody tr';
    if (self.isCard) {
      rowsContentSelector = '.oui-grid-table';
      rowDomSelector = '.oui-grid-table dl';
    }

    /**
         * 渲染整个表格的宽度，包括列和行的
         * @private
         */
    self._RGridWidth = function () {
      var _self = this;
      var columns = _self.attr ('columns');
      var defaultColumnWidth = self.attr ('defaultColumnWidth');
      var columnsArray = _self.attr ('columnsArray');
      var lockColumnSize = _self.attr ('lockColumnSize');

      var showColumnsArray = [];
      var lockColumnsObj = [];
      var lockColumnsArray = [];
      var noLockColumnsArray = [];

      if (lockColumnSize > 0) {
        showColumnsArray = getVisibleColumns (columnsArray);
        lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
        lockColumnsArray = lockColumnsObj.lockArary;
        noLockColumnsArray = lockColumnsObj.noLockArray;
      }
      var rowMarginLeft = 0;
      if (
        lockColumnSize > 0 &&
        lockColumnSize < columnsArray.length &&
        noLockColumnsArray.length > 0
      ) {
        var headerColumnsViewWidth = 0;
        for (var i = 0, len = lockColumnsArray.length; i < len; i++) {
          headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
        }

        _self._$columnsLock.css ({
          left: 0,
          width: headerColumnsViewWidth,
        });
        _self._$columnsView.css ({
          'margin-left': headerColumnsViewWidth,
          width: _self._$columns.width () - headerColumnsViewWidth,
        });

        _self._$rowsLock.css ({
          left: 0,
          height: '100%',
          width: headerColumnsViewWidth,
        });

        _self._$summaryRowLock.css ({
          left: 0,
          width: headerColumnsViewWidth,
        });

        _self._$summaryRowView.css ({
          'margin-left': headerColumnsViewWidth,
          width: _self._$summaryRow.width () - headerColumnsViewWidth,
        });

        _self._$columnsView
          .find ('.oui-grid-table')
          .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
        _self._$rowsView.css (
          'width',
          _self._$columns.width () - headerColumnsViewWidth
        );
        _self._$summaryRowView
          .find ('.oui-grid-table')
          .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
        rowMarginLeft = headerColumnsViewWidth;
      } else {
        _self._$columnsView.css ({
          'margin-left': 0,
          // width: _self._$columns.width()
        });
        _self._$rowsView.css ('width', 'auto');
        rowMarginLeft = 0;
      }
      _self._$columnsView
        .find ('.oui-grid-table')
        .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
      _self._$summaryRowView
        .find ('.oui-grid-table')
        .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
      _self._$columnsView.width (_self._$rowsViewContent.width ());
      _self._$summaryRowView.width (_self._$rowsViewContent.width ());
      _self._$rowsView.css ({
        'margin-left': rowMarginLeft,
      });

      // self._calcColumns();
      // var columnsArray = self.attr('columnsArray');
      // for(var i = 0,len = columnsArray.length;i < len;i++){
      //     var column = columnsArray[i];
      //     if(column){
      //         self._$columns.find("td#" + column["_id"]).css("width", column["width"]);
      //         self._$rows.find("td#" + column["_id"]).css("width", column["width"]);
      //         self._$summaryRow.find("td#" + column["_id"]).css("width", column["width"]);
      //     }
      // }
    };

    // self._getColumnsWidth = function () {
    //
    // };

    self._calcColumns = function () {
      var self = this;
      var columns = self.attr ('columns');
      var oldColumnsArray = self.attr ('columnsArray');
      var columnsArray = getVisibleColumns (oldColumnsArray);

      var allWidth = 0; //设置的宽度
      var i, len;
      var specialColumnWidth = 0; //特殊列的宽度不允许修改
      var column = null;
      for ((i = 0), (len = columnsArray.length); i < len; i++) {
        column = columnsArray[i];
        if (
          column.columnType === SpecialColumns.INDEX_COLUMN.type ||
          column.columnType === SpecialColumns.CHECKBOX_COLUMN.type ||
          column.columnType === SpecialColumns.RADIO_COLUMN.type
        ) {
          //特殊列不指定平均宽度
          specialColumnWidth += Number (columnsArray[i]['width']);
        } else {
          allWidth += Number (columnsArray[i]['width']);
        }
      }
      var _s = self._$columns.width (); //现有宽度
      //FIXME 如果出现竖向滚动条 横向也出现滚动条
      if (allWidth < _s) {
        _s = _s - 17;
        _s = _s - specialColumnWidth;
        for ((i = 0), (len = columnsArray.length); i < len; i++) {
          column = columnsArray[i];
          if (
            column.columnType === SpecialColumns.INDEX_COLUMN.type ||
            column.columnType === SpecialColumns.CHECKBOX_COLUMN.type ||
            column.columnType === SpecialColumns.RADIO_COLUMN.type
          ) {
          } else {
            columnsArray[i]['width'] =
              _s * (columnsArray[i]['width'] / allWidth);
          }
        }
      }
      // console.log(columnsArray);
    };

    /**
         * 计算表格行的高度,支持max-height
         * @private
         */
    self._RRowsHeight = function () {
      var _self = this;
      // 加载表格中间区域的高度
      var tableGird = self._$tableGridView;
      if (
        tableGird.attr ('style') &&
        tableGird.attr ('style').indexOf ('height') > -1
      ) {
        var maxHeight = tableGird.css ('max-height');
        var viewHeight = self._$viewport.height ();
        maxHeight =
          Number (maxHeight ? (maxHeight + '').replace ('px', '') : 0) || 0;
        if (maxHeight < 300) {
          maxHeight = 300;
        }
        if (maxHeight) {
          var viewContent = self._$rowsViewContent.height ();
          if (maxHeight <= viewHeight || viewContent >= maxHeight) {
            _self._$summaryRow.addClass ('oui-grid-summaryRow-fixed');
            offsetHeight =
              maxHeight -
              self._$columns.outerHeight () -
              self._$summaryRow.outerHeight () -
              self._$gridFooter.outerHeight ();
            self._$rows.height (offsetHeight);
            self._$rowsLock.css ('max-height', 'auto');
            self._$rowsView.css ('max-height', 'auto');
          } else {
            offsetHeight =
              maxHeight -
              self._$columns.outerHeight () -
              self._$summaryRow.outerHeight () -
              self._$gridFooter.outerHeight ();
            if (viewContent > offsetHeight) {
              self._$rows.height (offsetHeight);
              self._$rowsLock.css ('max-height', 'auto');
              self._$rowsView.css ('max-height', 'auto');
            } else {
              self._$rowsLock.css ('max-height', offsetHeight + 'px');
              self._$rowsView.css ('max-height', offsetHeight + 'px');
              self._$rows.height ('auto');
            }
          }
        } else {
          _self._$summaryRow.addClass ('oui-grid-summaryRow-fixed');
          var offsetHeight =
            tableGird.height () -
            self._$columns.outerHeight () -
            self._$summaryRow.outerHeight () -
            self._$gridFooter.outerHeight ();
          self._$rows.height (offsetHeight);
        }
      } else {
        self._$rows.height ('auto');
      }
    };

    /**
         * 渲染列的视图
         * @private
         */
    self._RColumnsView = function (notCalc) {
      var _self = this;
      if (!notCalc) {
        _self._calcColumns ();
      }
      var columns = _self.attr ('columns');
      var defaultColumnWidth = self.attr ('defaultColumnWidth');
      var columnsArray = _self.attr ('columnsArray');
      var lockColumnSize = _self.attr ('lockColumnSize');

      var showColumnsArray = [];
      var lockColumnsObj = [];
      var lockColumnsArray = [];
      var noLockColumnsArray = [];

      if (lockColumnSize > 0) {
        showColumnsArray = getVisibleColumns (columnsArray);
        lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
        lockColumnsArray = lockColumnsObj.lockArary;
        noLockColumnsArray = lockColumnsObj.noLockArray;
      }
      if (
        lockColumnSize > 0 &&
        lockColumnSize < columnsArray.length &&
        noLockColumnsArray.length > 0
      ) {
        var lockColumnHeaderData = [];
        var noLockColumnHeaderData = [];
        parseHeaderRows.call (_self, lockColumnHeaderData, lockColumnsArray);
        parseHeaderRows.call (
          _self,
          noLockColumnHeaderData,
          noLockColumnsArray
        );
        var lockColumnHtml = self._R_columnsTable ({
          tableAttr: _self.getMap (),
          headers: lockColumnHeaderData,
          columnsArray: lockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
        });
        _self._$columnsLock.find ('.oui-grid-table').css ('width', '100%');
        _self._$columnsLock
          .find (rowsContentSelector)
          .empty ()
          .html (lockColumnHtml);

        var headerColumnsViewWidth = 0;

        for (var i = 0, len = lockColumnsArray.length; i < len; i++) {
          headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
        }

        _self._$columnsLock.show ().css ({
          left: 0,
          width: headerColumnsViewWidth,
        });

        var noLockColumnHtml = self._R_columnsTable ({
          tableAttr: _self.getMap (),
          headers: noLockColumnHeaderData,
          columnsArray: noLockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
        });

        _self._$columnsView
          .find (rowsContentSelector)
          .empty ()
          .html (noLockColumnHtml);
        setTimeout (function () {
          _self._$rowsView.css (
            'width',
            _self._$columns.width () - headerColumnsViewWidth
          );
          _self._$columnsView.css ({
            'margin-left': headerColumnsViewWidth,
            width: _self._$columns.width () - headerColumnsViewWidth,
          });
        }, 0);
      } else {
        _self._$columnsLock.hide ();
        var headerData = [];
        parseHeaderRows.call (_self, headerData, columns);
        var html = self._R_columnsTable ({
          tableAttr: _self.getMap (),
          headers: headerData,
          columnsArray: _self.attr ('columnsArray'),
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
        });
        _self._$columnsView.find (rowsContentSelector).empty ().html (html);
        setTimeout (function () {
          _self._$columnsView.css ({
            'margin-left': 0,
            width: _self._$columns.width (),
          });
        }, 0);
      }

      var showColumns = _self.attr ('showColumns');
      if (showColumns + '' !== 'true') {
        _self._$columns.hide ();
      }

      var columnContextMenuConfig = self.attr ('columnContextMenu');
      if (columnContextMenuConfig) {
        self.setColumnContextMenu (columnContextMenuConfig);
      }
      var level = self.attr ('maxHeaderLevel');
      var allowColumnMove = self.attr ('allowColumnMove');
      if (level === 0 && allowColumnMove + '' === 'true') {
        var $trTwo = self._$columnsView.find ('.oui-grid-table tr').eq (1);
        $trTwo.sortable ({
          receive: function (event, ui) {
            triggerEvent.call (self, 'onColumnReceive', ui);
          },
          cancel: '.column-splitter',
          tolerance: 'pointer',
          helper: 'clone',
          zIndex: 100,
          axis: 'x',
          start: function () {
            triggerEvent.call (_self, 'onColumnMoveStart', _self);
          },
          stop: function (event, ui) {
            var $item = ui.item;
            if ($item.find ('.header-cell-outer').length <= 0) {
              return;
            }
            var $next = $item.next ();
            var currId = $item.attr ('id');
            var nextId = $next.attr ('id');

            var allowColumnMove = self.attr ('allowColumnMove');
            var currColumnIndex = null, nextColumnIndex = null, currColumnObj;
            var i, len, columnObj = null, _id;
            for ((i = 0), (len = columns.length); i < len; i++) {
              columnObj = columns[i];
              _id = columnObj['_id'];
              if (_id === currId) {
                currColumnObj = columnObj;
                currColumnIndex = i;
              }
            }
            columns.splice (currColumnIndex, 1);
            for ((i = 0), (len = columns.length); i < len; i++) {
              columnObj = columns[i];
              _id = columnObj['_id'];
              if (_id === nextId) {
                nextColumnIndex = i;
              }
            }
            if (nextId) {
              columns.splice (nextColumnIndex, 0, currColumnObj); // 如果当前标签存在，则插入到指定位置
            } else {
              columns.push (currColumnObj); // 如果当前标签存在，则插入到指定位置
            }

            (function (columns) {
              _parseColumnsIdByArray (0, 0, -1, columns, 0);
              var columnsArray = [];
              var columnsFieldsArray = [];
              var columnsMap = {};
              var editColumnsArray = [];
              var edit4ReadOnlyColumnsArray = [];
              _parseColumnsPutArrayAndMap (
                columnsArray,
                columnsFieldsArray,
                columnsMap,
                columns,
                editColumnsArray,
                edit4ReadOnlyColumnsArray
              );
              self.attr ('maxHeaderLevel', level);
              self.attr ('columns', columns);
              self.attr ('columnsFieldsArray', columnsFieldsArray);
              self.attr ('columnsArray', columnsArray);
              self.attr (
                'edit4ReadOnlyColumnsArray',
                edit4ReadOnlyColumnsArray
              );
              self.attr ('editColumnsArray', editColumnsArray);
              self.attr ('columnsMap', columnsMap);
            }) (columns);

            _self._RColumnsView ();
            _self._RRowsView ();
            triggerEvent.call (_self, 'onColumnMoveEnd', _self);
          },
        });
      }
    };

    /**
         * 渲染行视图
         * @param noNeedTips noNeedTips
         * @private
         */
    self._RRowsView = function (noNeedTips) {
      var _self = this;
      var defaultColumnWidth = self.attr ('defaultColumnWidth');
      var lockColumnSize = _self.attr ('lockColumnSize');
      var columnsArray = _self.attr ('columnsArray');

      var data = self.attr ('data') || [];
      triggerEvent.call (self, 'onBeforeLoad', _self, data);
      var bodyData;
      var rowMarginLeft = 0;

      var showColumnsArray = [];
      var lockColumnsObj = [];
      var lockColumnsArray = [];
      var noLockColumnsArray = [];

      if (lockColumnSize > 0) {
        showColumnsArray = getVisibleColumns (columnsArray);
        lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
        lockColumnsArray = lockColumnsObj.lockArary;
        noLockColumnsArray = lockColumnsObj.noLockArray;
      }

      dataPutIdAndIndex.call (self, data);
      var $rowsContentView = null;
      if (
        lockColumnSize > 0 &&
        lockColumnSize < columnsArray.length &&
        noLockColumnsArray.length > 0
      ) {
        bodyData = serverData2tableData.call (self, data, lockColumnsArray);

        var lockHtml = self._R_RowsTable ({
          tableAttr: _self.getMap (),
          emptyTips: '',
          emptyTipsIcon: _self.attr ('emptyTipsIcon'),
          data: bodyData,
          columnsArray: lockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
          noNeedFirstTr: false,
        });

        $rowsContentView = _self._$rowsLockContent.find (rowsContentSelector);
        oui.clearByContainer ($rowsContentView);
        $rowsContentView.html (lockHtml);
        var headerColumnsViewWidth = 0;
        for (var i = 0, len = lockColumnsArray.length; i < len; i++) {
          headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
        }
        _self._$rowsLock.show ().css ({
          left: 0,
          height: '100%',
          width: headerColumnsViewWidth,
        });

        bodyData = serverData2tableData.call (self, data, noLockColumnsArray);
        var nolockHtml = self._R_RowsTable ({
          tableAttr: _self.getMap (),
          emptyTips: noNeedTips ? '' : _self.attr ('emptyTips'),
          emptyTipsIcon: _self.attr ('emptyTipsIcon'),
          data: bodyData,
          columnsArray: noLockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
          noNeedFirstTr: false,
        });
        $rowsContentView = _self._$rowsViewContent.find (rowsContentSelector);
        oui.clearByContainer ($rowsContentView);
        $rowsContentView.html (nolockHtml);
        // _self._$rowsViewContent.find(rowsContentSelector).empty();
        // oui.clear4notUse();
        // _self._$rowsViewContent.find(rowsContentSelector).html(nolockHtml);
        // _self._$columnsView.find(".oui-grid-table").width(_self._$rowsViewContent.find(".oui-grid-table").width());
        // _self._$columnsView.width(_self._$rowsViewContent.width());
        // _self._$summaryRowView.find(".oui-grid-table").width(_self._$rowsViewContent.find(".oui-grid-table").width());
        rowMarginLeft = headerColumnsViewWidth;
        // _self._$rowsView.css({
        //     "margin-left": headerColumnsViewWidth
        // });
      } else {
        _self._$rowsLock.hide ();
        bodyData = serverData2tableData.call (self, data);
        var html = self._R_RowsTable ({
          tableAttr: _self.getMap (),
          emptyTips: noNeedTips ? '' : _self.attr ('emptyTips'),
          emptyTipsIcon: _self.attr ('emptyTipsIcon'),
          data: bodyData,
          columnsArray: columnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
          noNeedFirstTr: false,
        });

        $rowsContentView = _self._$rowsViewContent.find (rowsContentSelector);
        oui.clearByContainer ($rowsContentView);
        $rowsContentView.html (html);
        // _self._$rowsViewContent.find(rowsContentSelector).empty();
        // _self._$rowsViewContent.find(rowsContentSelector).html(html);
        rowMarginLeft = 0;
        // _self._$columnsView.find(".oui-grid-table").width(_self._$rowsViewContent.find(".oui-grid-table").width());
        // _self._$columnsView.width(_self._$rowsViewContent.width());
        // _self._$summaryRowView.find(".oui-grid-table").width(_self._$rowsViewContent.find(".oui-grid-table").width());
        // _self._$rowsView.css({
        //     "margin-left": 0
        // });
      }
      var tableOuiId = self.attr ('ouiId');
      self._$rows.find (oui.$.constant.controlTagName).each (function () {
        oui.parseByDom (this, null, function (control) {
          control.attr ({
            tableOuiId: tableOuiId,
          });
          //第一次加载必须执行update，需要触发formControlUpdate，来为data行添加ouiId等属性
          control.triggerUpdate ();
        });
      });
      // oui.parse();

      triggerEvent.call (self, 'onAfterLoad', _self, data);

      self._RSummaryRow ();
      // 加载表格中间区域的高度
      self._RRowsHeight ();
      setTimeout (function () {
        _self._$columnsView
          .find ('.oui-grid-table')
          .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
        _self._$columnsView.width (_self._$rowsViewContent.width ());
        _self._$summaryRowView
          .find ('.oui-grid-table')
          .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
        _self._$summaryRowView.width (_self._$rowsViewContent.width ());
        _self._$rowsView.css ({
          'margin-left': rowMarginLeft,
        });
      }, 0);
    };

    self._RRowsViewByData = function (data, noAppend) {
      var _self = this;
      var defaultColumnWidth = self.attr ('defaultColumnWidth');
      var lockColumnSize = _self.attr ('lockColumnSize');
      var columnsArray = _self.attr ('columnsArray');
      var oldData = self.attr ('data');
      var oldDataLength = oldData.length;
      data = data || [];
      if (!noAppend) {
        oldData = oldData.concat (data);
      }
      self.attr ('data', oldData);
      triggerEvent.call (self, 'onBeforeLoad', _self, data);

      var bodyData;
      var showColumnsArray = [];
      var lockColumnsObj = [];
      var lockColumnsArray = [];
      var noLockColumnsArray = [];
      var rowMarginLeft = 0;

      if (lockColumnSize > 0) {
        showColumnsArray = getVisibleColumns (columnsArray);
        lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
        lockColumnsArray = lockColumnsObj.lockArary;
        noLockColumnsArray = lockColumnsObj.noLockArray;
      }

      dataPutIdAndIndex.call (self, data);
      var $rowsContentView = null;
      if (
        lockColumnSize > 0 &&
        lockColumnSize < columnsArray.length &&
        noLockColumnsArray.length > 0
      ) {
        bodyData = serverData2tableData.call (
          self,
          data,
          lockColumnsArray,
          oldDataLength
        );

        var lockHtml = self._R_RowsTable ({
          tableAttr: _self.getMap (),
          emptyTips: '',
          emptyTipsIcon: _self.attr ('emptyTipsIcon'),
          data: bodyData,
          columnsArray: lockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
          noNeedFirstTr: !noAppend,
          oldDataLength: oldDataLength,
        });

        if (noAppend + '' === 'true') {
          $rowsContentView = _self._$rowsLockContent.find (rowsContentSelector);
          oui.clearByContainer ($rowsContentView);
          $rowsContentView.html (lockHtml);
          // _self._$rowsLockContent.find(rowsContentSelector).empty();
          // oui.clear4notUse();
          // _self._$rowsLockContent.find(rowsContentSelector).html(lockHtml);
          var headerColumnsViewWidth = 0;
          for (var i = 0, len = lockColumnsArray.length; i < len; i++) {
            headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
          }
          _self._$rowsLock.show ().css ({
            left: 0,
            height: '100%',
            width: headerColumnsViewWidth,
          });
        } else {
          _self._$rowsLockContent.find (rowsContentSelector).append (lockHtml);
        }

        bodyData = serverData2tableData.call (
          self,
          data,
          noLockColumnsArray,
          oldDataLength
        );
        var nolockHtml = self._R_RowsTable ({
          tableAttr: _self.getMap (),
          emptyTips: _self.attr ('emptyTips'),
          emptyTipsIcon: _self.attr ('emptyTipsIcon'),
          data: bodyData,
          columnsArray: noLockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
          noNeedFirstTr: !noAppend,
          oldDataLength: oldDataLength,
        });

        rowMarginLeft = headerColumnsViewWidth;

        if (noAppend + '' === 'true') {
          $rowsContentView = _self._$rowsViewContent.find (rowsContentSelector);
          oui.clearByContainer ($rowsContentView);
          $rowsContentView.html (nolockHtml);
          // _self._$rowsViewContent.find(rowsContentSelector).empty();
          // oui.clear4notUse();
          // _self._$rowsViewContent.find(rowsContentSelector).html(nolockHtml);
        } else {
          _self._$rowsViewContent
            .find (rowsContentSelector)
            .append (nolockHtml);
        }
      } else {
        _self._$rowsLock.hide ();

        bodyData = serverData2tableData.call (self, data, null, oldDataLength);
        var html = self._R_RowsTable ({
          tableAttr: _self.getMap (),
          emptyTips: _self.attr ('emptyTips'),
          emptyTipsIcon: _self.attr ('emptyTipsIcon'),
          data: bodyData,
          columnsArray: columnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
          noNeedFirstTr: !noAppend,
          oldDataLength: oldDataLength,
        });
        if (noAppend + '' === 'true') {
          $rowsContentView = _self._$rowsViewContent.find (rowsContentSelector);
          oui.clearByContainer ($rowsContentView);
          $rowsContentView.html (html);
          // _self._$rowsViewContent.find(rowsContentSelector).empty();
          // oui.clear4notUse();
          // _self._$rowsViewContent.find(rowsContentSelector).html(html);
        } else {
          _self._$rowsViewContent.find (rowsContentSelector).append (html);
        }
        rowMarginLeft = 0;
      }
      var tableOuiId = self.attr ('ouiId');
      self._$rows.find (oui.$.constant.controlTagName).each (function () {
        oui.parseByDom (this, null, function (control) {
          control.attr ({
            tableOuiId: tableOuiId,
          });
          //第一次加载必须执行update，需要触发formControlUpdate，来为data行添加ouiId等属性
          control.triggerUpdate ();
        });
      });

      triggerEvent.call (self, 'onAfterLoad', _self, data);

      self._RIndexColumn4Rows ();
      self._RSummaryRow ();
      self._RRowsHeight ();
      _self._$columnsView
        .find ('.oui-grid-table')
        .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
      _self._$columnsView.width (_self._$rowsViewContent.width ());
      _self._$summaryRowView
        .find ('.oui-grid-table')
        .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
      _self._$summaryRowView.width (_self._$rowsViewContent.width ());
      _self._$rowsView.css ({
        'margin-left': rowMarginLeft,
      });
      // 加载表格中间区域的高度
    };

    /**
         * 根据数据渲染行
         * @param data 需要渲染的数据
         * @param index add 的时候的位置
         * @param renderType 渲染方式 ， 0:add,1:delete
         * @private
         */
    self._RRowsViewByIndex = function (data, renderType, index) {
      var _self = this;
      var defaultColumnWidth = self.attr ('defaultColumnWidth');
      var lockColumnSize = _self.attr ('lockColumnSize');
      var columnsArray = _self.attr ('columnsArray');
      var oldData = self.attr ('data') || [];
      var oldDataLength = oldData.length;
      var bodyData = [];
      var showColumnsArray = [];
      var lockColumnsObj = [];
      var lockColumnsArray = [];
      var noLockColumnsArray = [];
      var rowMarginLeft = 0;
      var i, len;
      var lockHtml = '';
      var nolockHtml = '';
      var html = '';
      var $indexTr = null;
      var headerColumnsViewWidth = 0;
      data = data || [];

      if (data.length <= 0) {
      }
      var row4IndexData = oldData[index - 1] || {_index: -1};
      if (renderType === 0) {
        for ((i = 0), (len = data.length); i < len; i++) {
          oldData.splice (
            (index || 0) + i,
            0,
            $.extend (true, {}, rowObjectFilter (data[i]))
          );
        }
        var _dlength = data.length;
        data = [];
        for (i = 0; i < _dlength; i++) {
          var __row = oldData[(index || 0) + i];
          dataPutIdAndIndex.call (self, [__row]);
          data.push (__row);
        }
      } else if (renderType === 1) {
        for ((i = 0), (len = data.length); i < len; i++) {
          index = getRowIndexByRow4Data.call (self, data[i]);
          if (index >= 0) {
            var rowIndex = getRowIndexByRow.call (self, data[i]);
            oldData.splice (index, 1);
            var tableTrID = 'table_' + _self.attr ('ouiId') + '_tr_' + rowIndex;
            var $lockContentView = _self._$rowsLockContent.find (
              '#' + tableTrID
            );
            var $rowsContentView = _self._$rowsViewContent.find (
              '#' + tableTrID
            );
            oui.clearByContainer ($lockContentView);
            oui.clearByContainer ($rowsContentView);
            $lockContentView.remove ();
            $rowsContentView.remove ();
          }
        }
      } else if (renderType === 2) {
        //修改支持修改第一条数据
        index = getRowIndexByRow.call (self, data[0]);
      }

      self.attr ('data', oldData);

      if (renderType === 0) {
        triggerEvent.call (self, 'onBeforeLoad', _self, data);
        bodyData = [];
        showColumnsArray = [];
        lockColumnsObj = [];
        lockColumnsArray = [];
        noLockColumnsArray = [];
        rowMarginLeft = 0;
        if (lockColumnSize > 0) {
          showColumnsArray = getVisibleColumns (columnsArray);
          lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
          lockColumnsArray = lockColumnsObj.lockArary;
          noLockColumnsArray = lockColumnsObj.noLockArray;
        }

        if (
          lockColumnSize > 0 &&
          lockColumnSize < columnsArray.length &&
          noLockColumnsArray.length > 0
        ) {
          bodyData = serverData2tableData.call (
            self,
            data,
            lockColumnsArray,
            oldDataLength
          );
          lockHtml = self._R_RowsTable ({
            tableAttr: _self.getMap (),
            emptyTips: '',
            emptyTipsIcon: _self.attr ('emptyTipsIcon'),
            data: bodyData,
            columnsArray: lockColumnsArray,
            ouiId: _self.attr ('ouiId'),
            defaultColumnWidth: defaultColumnWidth,
            noNeedFirstTr: true,
            oldDataLength: oldDataLength,
          });

          $indexTr = _self._$rowsLockContent.find (
            '#table_' + _self.attr ('ouiId') + '_tr_' + row4IndexData['_index']
          );

          if ($indexTr.length <= 0) {
            _self._$rowsLockContent
              .find (rowDomSelector + ':eq(0)')
              .after (lockHtml);
          } else {
            $indexTr.after (lockHtml);
          }

          headerColumnsViewWidth = 0;
          for ((i = 0), (len = lockColumnsArray.length); i < len; i++) {
            headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
          }
          _self._$rowsLock.show ().css ({
            left: 0,
            height: '100%',
            width: headerColumnsViewWidth,
          });

          bodyData = serverData2tableData.call (
            self,
            data,
            noLockColumnsArray,
            oldDataLength
          );
          nolockHtml = self._R_RowsTable ({
            tableAttr: _self.getMap (),
            emptyTips: '',
            emptyTipsIcon: _self.attr ('emptyTipsIcon'),
            data: bodyData,
            columnsArray: noLockColumnsArray,
            ouiId: _self.attr ('ouiId'),
            defaultColumnWidth: defaultColumnWidth,
            noNeedFirstTr: true,
            oldDataLength: oldDataLength,
          });

          $indexTr = _self._$rowsViewContent.find (
            '#table_' + _self.attr ('ouiId') + '_tr_' + row4IndexData['_index']
          );

          rowMarginLeft = headerColumnsViewWidth;

          if ($indexTr.length <= 0) {
            _self._$rowsViewContent
              .find (rowDomSelector + ':eq(0)')
              .after (nolockHtml);
          } else {
            $indexTr.after (nolockHtml);
          }
          _self._$rowsViewContent
            .find ('#table_' + _self.attr ('ouiId') + '_tr_noData')
            .remove ();
        } else {
          _self._$rowsLock.hide ();

          bodyData = serverData2tableData.call (
            self,
            data,
            null,
            oldDataLength
          );
          html = self._R_RowsTable ({
            tableAttr: _self.getMap (),
            emptyTips: '',
            emptyTipsIcon: _self.attr ('emptyTipsIcon'),
            data: bodyData,
            columnsArray: columnsArray,
            ouiId: _self.attr ('ouiId'),
            defaultColumnWidth: defaultColumnWidth,
            noNeedFirstTr: true,
            oldDataLength: oldDataLength,
          });
          $indexTr = _self._$rowsViewContent.find (
            '#table_' + _self.attr ('ouiId') + '_tr_' + row4IndexData['_index']
          );
          if ($indexTr.length <= 0) {
            _self._$rowsViewContent
              .find (rowDomSelector + ':eq(0)')
              .after (html);
          } else {
            $indexTr.after (html);
          }
          _self._$rowsViewContent
            .find ('#table_' + _self.attr ('ouiId') + '_tr_noData')
            .remove ();
          rowMarginLeft = 0;
        }
        var tableOuiId = self.attr ('ouiId');
        self._$rows.find (oui.$.constant.controlTagName).each (function () {
          oui.parseByDom (this, null, function (control) {
            control.attr ({
              tableOuiId: tableOuiId,
            });
            //第一次加载必须执行update，需要触发formControlUpdate，来为data行添加ouiId等属性
            control.triggerUpdate ();
          });
        });
        triggerEvent.call (self, 'onAfterLoad', _self, data);
      } else if (renderType === 1) {
      } else if (renderType === 2) {
        //修改
        triggerEvent.call (self, 'onBeforeLoad', _self, data);

        bodyData = [];
        showColumnsArray = [];
        lockColumnsObj = [];
        lockColumnsArray = [];
        noLockColumnsArray = [];
        rowMarginLeft = 0;

        if (lockColumnSize > 0) {
          showColumnsArray = getVisibleColumns (columnsArray);
          lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
          lockColumnsArray = lockColumnsObj.lockArary;
          noLockColumnsArray = lockColumnsObj.noLockArray;
        }

        oldDataLength = index;

        if (
          lockColumnSize > 0 &&
          lockColumnSize < columnsArray.length &&
          noLockColumnsArray.length > 0
        ) {
          bodyData = serverData2tableData.call (
            self,
            data,
            lockColumnsArray,
            oldDataLength
          );

          lockHtml = self._R_RowsTable ({
            tableAttr: _self.getMap (),
            emptyTips: '',
            emptyTipsIcon: _self.attr ('emptyTipsIcon'),
            data: bodyData,
            columnsArray: lockColumnsArray,
            ouiId: _self.attr ('ouiId'),
            defaultColumnWidth: defaultColumnWidth,
            noNeedFirstTr: true,
            oldDataLength: oldDataLength,
          });
          $indexTr = _self._$rowsLockContent.find (
            '#table_' + _self.attr ('ouiId') + '_tr_' + index
          );
          oui.clearByContainer ($indexTr);
          $indexTr.html ($ (lockHtml).html ());
          // $indexTr.replaceWith(lockHtml);
          headerColumnsViewWidth = 0;
          for ((i = 0), (len = lockColumnsArray.length); i < len; i++) {
            headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
          }
          _self._$rowsLock.show ().css ({
            left: 0,
            height: '100%',
            width: headerColumnsViewWidth,
          });

          bodyData = serverData2tableData.call (
            self,
            data,
            noLockColumnsArray,
            oldDataLength
          );
          nolockHtml = self._R_RowsTable ({
            tableAttr: _self.getMap (),
            emptyTips: _self.attr ('emptyTips'),
            emptyTipsIcon: _self.attr ('emptyTipsIcon'),
            data: bodyData,
            columnsArray: noLockColumnsArray,
            ouiId: _self.attr ('ouiId'),
            defaultColumnWidth: defaultColumnWidth,
            noNeedFirstTr: true,
            oldDataLength: oldDataLength,
          });

          $indexTr = _self._$rowsViewContent.find (
            '#table_' + _self.attr ('ouiId') + '_tr_' + index
          );
          oui.clearByContainer ($indexTr);
          // $indexTr.replaceWith(nolockHtml);
          $indexTr.html ($ (nolockHtml).html ());
          rowMarginLeft = headerColumnsViewWidth;
        } else {
          _self._$rowsLock.hide ();

          bodyData = serverData2tableData.call (
            self,
            data,
            null,
            oldDataLength
          );
          html = self._R_RowsTable ({
            tableAttr: _self.getMap (),
            emptyTips: _self.attr ('emptyTips'),
            emptyTipsIcon: _self.attr ('emptyTipsIcon'),
            data: bodyData,
            columnsArray: columnsArray,
            ouiId: _self.attr ('ouiId'),
            defaultColumnWidth: defaultColumnWidth,
            noNeedFirstTr: true,
            oldDataLength: oldDataLength,
          });

          $indexTr = _self._$rowsViewContent.find (
            '#table_' + _self.attr ('ouiId') + '_tr_' + index
          );
          oui.clearByContainer ($indexTr);
          // $indexTr.replaceWith(html);
          $indexTr.html ($ (html).html ());
          rowMarginLeft = 0;
        }

        var tableOuiId = self.attr ('ouiId');
        self._$rows.find (oui.$.constant.controlTagName).each (function () {
          var $controlDom = $ (this);
          if (self.isCard) {
            var _$tr = $controlDom.closest ('dl');
            var right = $controlDom.attr ('right');
            if (
              _$tr.length > 0 &&
              _$tr.hasClass ('row-edit-layout') &&
              right === 'edit4ReadOnly'
            ) {
              $controlDom.attr ('right', 'edit');
            }
          }
          oui.parseByDom (this, null, function (control) {
            control.attr ({
              tableOuiId: tableOuiId,
            });
            //第一次加载必须执行update，需要触发formControlUpdate，来为data行添加ouiId等属性
            control.triggerUpdate ();
          });
        });
        triggerEvent.call (self, 'onAfterLoad', _self, data);
      }

      self._RIndexColumn4Rows ();
      self._RSummaryRow ();
      if (renderType === 0 || renderType === 1) {
        self._RRowsHeight ();
      }
      _self._$columnsView
        .find ('.oui-grid-table')
        .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
      _self._$columnsView.width (_self._$rowsViewContent.width ());
      _self._$summaryRowView
        .find ('.oui-grid-table')
        .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
      _self._$summaryRowView.width (_self._$rowsViewContent.width ());
      _self._$rowsView.css ({
        'margin-left': rowMarginLeft,
      });
      // 加载表格中间区域的高度

      return data;
    };

    self._RSummaryRow = function () {
      var _self = this;
      var columns = _self.attr ('columns');
      var defaultColumnWidth = self.attr ('defaultColumnWidth');
      var columnsArray = _self.attr ('columnsArray');
      var lockColumnSize = _self.attr ('lockColumnSize');

      var data = self.attr ('data') || [];

      var showColumnsArray = [];
      var lockColumnsObj = [];
      var lockColumnsArray = [];
      var noLockColumnsArray = [];
      var needSummartRow = false;
      if (lockColumnSize > 0) {
        showColumnsArray = getVisibleColumns (columnsArray);
        needSummartRow = getSummaryColumn (showColumnsArray);
        lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
        lockColumnsArray = lockColumnsObj.lockArary;
        noLockColumnsArray = lockColumnsObj.noLockArray;
      } else {
        needSummartRow = getSummaryColumn (columnsArray);
      }
      if (!needSummartRow) {
        self._$summaryRow.hide ();
        return;
      }

      var bodyData = [];

      if (
        lockColumnSize > 0 &&
        lockColumnSize < columnsArray.length &&
        noLockColumnsArray.length > 0
      ) {
        bodyData = getSummaryTableData.call (self, data, lockColumnsArray);

        var lockColumnHtml = self._R_summaryRow ({
          tableAttr: _self.getMap (),
          data: bodyData,
          columnsArray: lockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
        });

        _self._$summaryRowLock.find ('.oui-grid-table').css ('width', '100%');
        _self._$summaryRowLock
          .find (rowsContentSelector)
          .empty ()
          .html (lockColumnHtml);

        var headerColumnsViewWidth = 0;

        for (var i = 0, len = lockColumnsArray.length; i < len; i++) {
          headerColumnsViewWidth += Number (lockColumnsArray[i]['width']);
        }

        _self._$summaryRowLock.show ().css ({
          left: 0,
          width: headerColumnsViewWidth,
        });

        bodyData = getSummaryTableData.call (self, data, noLockColumnsArray);

        var noLockColumnHtml = self._R_summaryRow ({
          tableAttr: _self.getMap (),
          data: bodyData,
          columnsArray: noLockColumnsArray,
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
        });

        // _self._$summaryRow.width(_self._$columns.width());
        _self._$summaryRowView
          .find (rowsContentSelector)
          .empty ()
          .html (noLockColumnHtml);
        setTimeout (function () {
          _self._$summaryRowView.css ({
            'margin-left': headerColumnsViewWidth,
            width: _self._$summaryRow.width () - headerColumnsViewWidth,
          });
        }, 0);
      } else {
        _self._$summaryRowLock.hide ();

        bodyData = getSummaryTableData.call (
          self,
          data,
          _self.attr ('columnsArray')
        );

        var html = self._R_summaryRow ({
          tableAttr: _self.getMap (),
          data: bodyData,
          columnsArray: _self.attr ('columnsArray'),
          ouiId: _self.attr ('ouiId'),
          defaultColumnWidth: defaultColumnWidth,
        });

        _self._$summaryRowView.find (rowsContentSelector).empty ().html (html);
        // _self._$summaryRow.width(_self._$columns.width());
        setTimeout (function () {
          _self._$summaryRowView.css ({
            'margin-left': 0,
            width: _self._$summaryRow.width (),
          });
        }, 0);
      }
      self._$summaryRow.show ();
    };

    /**
         * 渲染行的序号列
         * @private
         */
    self._RIndexColumn4Rows = function () {
      /**
             * 渲染当前页的序号字段内容
             */
      var self = this;
      var ouiId = self.attr ('ouiId');
      var allNumbers = self._$rows.find ('div.index-number-cell');
      allNumbers.each (function (rowIndex) {
        $ (this).html (rowIndex + 1);
      });
    };

    /**
         * 渲染网格线
         * @private
         */
    self._RGridLines = function () {
      var self = this;
      var showHLines = self.attr ('showHLines');
      var showVLines = self.attr ('showVLines');
      var showHeaderLines = self.attr ('showHeaderLines');

      if (showHeaderLines + '' === 'true') {
        self._$columns.addClass ('table-td-rightBorder');
        // self._$columns.addClass("table-td-bottomBorder");
      } else {
        self._$columns.removeClass ('table-td-rightBorder');
      }

      self._$columns.removeClass ('table-td-bottomBorder');

      if (showHLines + '' === 'true') {
        self._$rows.addClass ('table-td-bottomBorder');
      } else {
        self._$rows.removeClass ('table-td-bottomBorder');
      }

      if (showVLines + '' === 'true') {
        self._$rows.addClass ('table-td-rightBorder');
      } else {
        self._$rows.removeClass ('table-td-rightBorder');
      }
    };

    /**
         * 渲染所有的视图
         * @private
         */
    self._RAllView = function () {
      self._RGridLines ();
      self._RColumnsView ();
      self._RRowsView ();
    };
  };

  /**
     * 初始化事件
     */
  var initEvents = function () {
    var self = this;
    var ouiId = self.attr ('ouiId');
    var isCard = self.isCard;

    if (!isCard) {
      if (self.attr ('lockColumnSize') > 0) {
        /**
                 * 为锁定区增加滚轮事件
                 */
        _addEvent_ (self._$rowsLock[0], 'mousewheel', function (event) {
          var oldScrollTop = self._$rowsView.scrollTop ();
          var scrollHeight = self._$rowsView[0].scrollHeight;
          var offsetHeight = self._$rowsView.height ();
          var offsetY = 100;
          if (event.delta > 0) {
            offsetY = -offsetY;
          }
          var scrollTop = oldScrollTop + offsetY;
          if (scrollTop > scrollHeight - offsetHeight) {
            scrollTop = scrollHeight - offsetHeight;
          } else if (scrollTop < 0) {
            scrollTop = 0;
          }
          self._$rowsView.scrollTop (scrollTop);
          self._$rowsLock.scrollTop (scrollTop);
          self._getTableEditView ().html ('').hide ();
        });
      }
      //表格向左滑动的时候，表头跟着滑动
      self._$rowsView.on ('scroll', function () {
        self._$columnsView.scrollLeft ($ (this).scrollLeft ());
        self._$summaryRowView.scrollLeft ($ (this).scrollLeft ());
        self._$rowsLock.scrollTop ($ (this).scrollTop ());
        self._getTableEditView ().html ('').hide ();
      });
    }

    self._$columns
      .find ('.oui-grid-table')
      .on ('mousedown', '.column-splitter', function (e) {
        var $td = $ (this).closest ('td');
        if (parseInt ($td.attr ('colspan')) > 1) {
          return;
        }

        var allowColumnResize = self.attr ('allowColumnResize');

        if (allowColumnResize + '' !== 'true') {
          return false;
        }
        triggerEvent.call (self, 'onColumnWidthChangeStart', self);
        var columnsIndex = $td.attr ('id');
        var columnsArray = self.attr ('columnsArray');
        var column = columnsArray[columnsIndex];
        var $nextTd = $td.next ();
        var nextColumn = null;
        if ($nextTd && $nextTd.length > 0 && $nextTd.attr ('id')) {
          nextColumn = columnsArray[$nextTd.attr ('id')];
        }
        var $proxyColumn = $ (TableGrid.proxyTpl);
        var thOffset = $td.offset ();
        var tableViewOffset = self._$viewport.offset ();
        var left = thOffset.left - tableViewOffset.left;

        var startX = e.clientX;
        var startWidth = $td.width ();

        $proxyColumn.css ({
          width: startWidth,
          height: self._$columns.height () + self._$rowsView.height (),
          left: left,
          top: 0,
        });
        self._$viewport.append ($proxyColumn);

        self._$tableGridView.on ('mousemove', function (e) {
          $proxyColumn.width (
            e.clientX - startX + startWidth < 50
              ? 50
              : e.clientX - startX + startWidth
          );
          document.onselectstart = function () {
            return false;
          };
          window.getSelection
            ? window.getSelection ().removeAllRanges ()
            : document.selection.empty ();
        });

        self._$tableGridView.on ('mouseup', function () {
          self._$tableGridView.off ('mousemove');
          self._$tableGridView.off ('mouseup');
          var cWidth = column['width'];
          var offsetWidth = $proxyColumn.width () - cWidth;
          column['width'] = $proxyColumn.width ();

          $proxyColumn.remove ();
          var scrollerWidth =
            self._$rowsViewContent.find ('.oui-grid-table').width () -
            self._$rowsViewContent.width ();

          self._$columns
            .find ('td#' + column['_id'])
            .css ('width', column['width']);
          self._$rows
            .find ('td#' + column['_id'])
            .css ('width', column['width']);
          self._$summaryRow
            .find ('td#' + column['_id'])
            .css ('width', column['width']);

          if (offsetWidth < 0) {
            if (Math.abs (offsetWidth) > scrollerWidth) {
              offsetWidth = scrollerWidth - Math.abs (offsetWidth);
              scrollerWidth = 0;
            }
          }

          if (nextColumn && offsetWidth < 0 && scrollerWidth <= 0) {
            nextColumn['width'] = Number (nextColumn['width']) - offsetWidth;
            self._$columns
              .find ('td#' + nextColumn['_id'])
              .css ('width', nextColumn['width']);
            self._$rows
              .find ('td#' + nextColumn['_id'])
              .css ('width', nextColumn['width']);
            self._$summaryRow
              .find ('td#' + nextColumn['_id'])
              .css ('width', nextColumn['width']);
          }

          self._RGridWidth ();
          triggerEvent.call (self, 'onColumnWidthChangeEnd', self);
          document.onselectstart = function () {
            return false;
          };
        });
      });

    self._$columns.find ('.oui-grid-table').on ('mouseover', 'td', function () {
      var showColumnsMenu = self.attr ('showColumnsMenu');
      if (showColumnsMenu + '' === 'true') {
        var $td = $ (this);
        var columnId = $td.attr ('id');
        var columnsArray = self.attr ('columnsArray');
        var _column = columnsArray[columnId];
        if (_column) {
          var columnType = _column['columnType'];
          // 这里判断了下是否是父列，如果是父列不支持显示,如果是特殊列也不显示
          if (
            columnType !== SpecialColumns.INDEX_COLUMN.type &&
            columnType !== SpecialColumns.CHECKBOX_COLUMN.type &&
            columnType !== SpecialColumns.RADIO_COLUMN.type &&
            !(_column['columns'] && _column['columns'].length >= 0)
          ) {
            var canShowColumns4Menu =
              showColumnsMenu + '' === 'true' &&
              _column['hideable4menu'] + '' === 'false';
            if (canShowColumns4Menu) {
              self._$showOrHideColumnBtns.css ('display', 'inline-block');
              var position = $td.position ();
              var left =
                $td.offset ().left -
                self._$columns.offset ().left +
                $td.width () -
                self._$columnsOperateBtns.width ();
              var top = position.top;
              self._$columnsOperateBtns.css ({
                left: left,
                top: top,
                height: $td.outerHeight (),
                display: 'inline-block',
              });
            } else {
              self._$showOrHideColumnBtns.css ('display', 'none');
            }
          }
        }
      }
    });

    self._$columns.find ('.oui-grid-table').on ('mouseout', 'td', function (e) {
      var showColumnsMenu = self.attr ('showColumnsMenu');
      if (showColumnsMenu + '' === 'true') {
        var target = e.relatedTarget;
        if (
          !oui.isInDom (target, '#columnOperateBtns') &&
          this !== target &&
          !$.contains (this, target) &&
          !oui.isInDom (target, '#columnChooseList')
        ) {
          self._$columnsOperateBtns.hide ();
          self._$showOrHideColumnBtns.hide ();
          self._$columnChooseList.hide ();
        }
      }
    });

    self._$columnChooseList.on ('mouseout', function (e) {
      var showColumnsMenu = self.attr ('showColumnsMenu');
      var target = e.relatedTarget;
      if (showColumnsMenu + '' === 'true') {
        if (
          !oui.isInDom (target, '#columnOperateBtns') &&
          this !== target &&
          !$.contains (this, target) &&
          !oui.isInDom (target, '#columnChooseList')
        ) {
          self._$columnsOperateBtns.hide ();
          self._$showOrHideColumnBtns.hide ();
          self._$columnChooseList.hide ();
        }
      }
    });

    self._$showOrHideColumnBtns.on ('click', function () {
      var showColumnsMenu = self.attr ('showColumnsMenu');
      if (showColumnsMenu + '' === 'true') {
        var $btns = $ (this).parent ();
        var postion = $btns.position ();
        var columnsArray = self.attr ('columnsArray');
        var show4menuArray = [];
        var _column = null;
        for (var i = 0, len = columnsArray.length; i < len; i++) {
          _column = columnsArray[i];
          var columnType = _column['columnType'];
          // 这里判断了下是否是父列，如果是父列不支持显示,如果是特殊列也不显示
          if (
            _column['hideable4menu'] + '' === 'false' &&
            (columnType !== SpecialColumns.INDEX_COLUMN.type &&
              columnType !== SpecialColumns.CHECKBOX_COLUMN.type &&
              columnType !== SpecialColumns.RADIO_COLUMN.type) &&
            !(_column['columns'] && _column['columns'].length >= 0)
          ) {
            show4menuArray.push (_column);
          }
        }
        var columnChooseListHtml = self._R_columnChooseList ({
          columnList: show4menuArray,
        });

        self._$columnChooseList.find ('ul').html (columnChooseListHtml);

        self._$columnChooseList
          .css ({left: postion.left - 5, top: postion.top + $btns.height ()})
          .show ();
      }
    });

    self._$columnsChooseOperateBtns.find ('.btn-ok').on ('click', function () {
      var $inputCheckboxs = self._$columnChooseList
        .find ('ul')
        .find ("input[type='checkbox']");
      $inputCheckboxs.each (function () {
        var $checkbox = $ (this);
        var visible = $checkbox.prop ('checked');
        var columnId = $checkbox.val ();
        setColumnsById.call (self, columnId, {visible: visible});
      });
      self._$columnChooseList.hide ();
      self._RColumnsView ();
      self._RRowsView ();
      var columnsArray = self.attr ('columnsArray');
      var show4menuArray = [];
      var _column = null;
      for (var i = 0, len = columnsArray.length; i < len; i++) {
        _column = columnsArray[i];
        var columnType = _column['columnType'];
        // 这里判断了下是否是父列，如果是父列不支持显示,如果是特殊列也不显示
        if (
          _column['hideable4menu'] + '' === 'false' &&
          (columnType !== SpecialColumns.INDEX_COLUMN.type &&
            columnType !== SpecialColumns.CHECKBOX_COLUMN.type &&
            columnType !== SpecialColumns.RADIO_COLUMN.type) &&
          !(_column['columns'] && _column['columns'].length >= 0)
        ) {
          show4menuArray.push (_column);
        }
      }
      triggerEvent.call (self, 'onColumnVisible', show4menuArray);
    });

    self._$columnsChooseOperateBtns
      .find ('.btn-cancel')
      .on ('click', function () {
        self._$columnChooseList.hide ();
      });

    self._$columns
      .find ('.oui-grid-table')
      .on ('click', '.column-batchEdit', function (e) {
        var editModel = self.attr ('editModel');
        var batchEdit = self.attr ('batchEdit');
        batchEdit = editModel !== 'false' && batchEdit;
        if (batchEdit + '' === 'true') {
          var $this = $ (this);
          var $td = $this.parent (); //self._$columns.find("[theadId='theadId_" + columnId + "']");
          var columnId = $td.attr ('id');
          var columnsArray = self.attr ('columnsArray');
          var column = columnsArray[columnId];
          createOuiForm4edit (column, null, $td, true);
          e.stopPropagation ();
        }
      });

    /**
         * 表格td的点中事件（排序）
         */
    self._$columns.find ('.oui-grid-table').on ('click', 'td', function () {
      var $td = $ (this);
      var columnsIndex = $td.attr ('id');
      var columnsArray = self.attr ('columnsArray');
      var column = columnsArray[columnsIndex];

      triggerEvent.call (self, 'onColumnClick', column, $td);

      if (
        column['allowSort'] + '' === 'true' &&
        column['fieldName'] &&
        column['fieldName'].length > 0
      ) {
        var sortOrder = ORDER_TYPE.ASC;
        if ($td.hasClass ('grid-sort-desc')) {
          self._$columns
            .find ('.grid-sort-desc')
            .removeClass ('grid-sort-desc');
          self._$columns.find ('.grid-sort-asc').removeClass ('grid-sort-asc');
          sortOrder = ORDER_TYPE.ASC;
          $td.removeClass ('grid-sort-desc').addClass ('grid-sort-asc');
        } else if ($td.hasClass ('grid-sort-asc')) {
          self._$columns
            .find ('.grid-sort-desc')
            .removeClass ('grid-sort-desc');
          self._$columns.find ('.grid-sort-asc').removeClass ('grid-sort-asc');
          sortOrder = ORDER_TYPE.DESC;
          $td.removeClass ('grid-sort-asc').addClass ('grid-sort-desc');
        } else {
          self._$columns
            .find ('.grid-sort-desc')
            .removeClass ('grid-sort-desc');
          self._$columns.find ('.grid-sort-asc').removeClass ('grid-sort-asc');
          sortOrder = ORDER_TYPE.DESC;
          $td.removeClass ('grid-sort-asc').addClass ('grid-sort-desc');
        }
        self.sortBy (column['fieldName'], sortOrder);
      }
    });

    var rowSelector = 'tr.oui-table-grid-row';
    if (self.isCard) {
      rowSelector = 'dl.oui-table-grid-row';
    }

    //全选复选框的改变事件
    self._$columns.on (
      'change',
      '#table_' + ouiId + '_all_checkbox',
      function () {
        var multiSelect = self.attr ('multiSelect');
        var $inputCheckbox = $ (this);
        if (multiSelect + '' === 'true') {
          if ($inputCheckbox.prop ('checked')) {
            self._$rows
              .find ("input[name='table_" + ouiId + "_checkbox']")
              .prop ('checked', true);
            self._$rows
              .find (rowSelector)
              .not ('#table_' + ouiId + '_tr_noData')
              .addClass ('selected');
            triggerAllDataRowSelected.call (self, true);
          } else {
            self._$rows
              .find ("input[name='table_" + ouiId + "_checkbox']")
              .prop ('checked', false);
            self._$rows.find (rowSelector).removeClass ('selected');
            triggerAllDataRowSelected.call (self, false);
          }
        } else {
          $inputCheckbox.prop ('checked', false);
          return false;
        }
      }
    );

    var getTdPosition = function ($td) {
      var endTrId = $td.parent ().attr ('id');
      var endTdId = $td.attr ('id');
      var endX = endTrId.replace ('table_' + ouiId + '_tr_', '');
      endX = parseInt (endX);
      var endY = endTdId.replace (ouiId + 'cell_', '');
      endY = parseInt (endY);
      return {
        x: endX,
        y: endY,
      };
    };

    /**
         * 行上面的input checkbox 选中和取消选中事件
         */
    self._$rows.on (
      'change',
      "input[name='table_" + ouiId + "_checkbox']",
      function () {
        var $inputCheckbox = $ (this);

        var allowUnselect = self.attr ('allowUnselect');

        var multiSelect = self.attr ('multiSelect');
        var $tr = $inputCheckbox.closest ('tr');
        if (isCard) {
          $tr = $inputCheckbox.closest ('dl');
        }

        if ($tr.hasClass ('row-edit-layout')) {
          return;
        }
        var id = $tr.attr ('id');
        var index = id.replace ('table_' + ouiId + '_tr_', '');
        if (index === 'noData') return;
        index = $tr.index () - 1;
        var data = self.attr ('data');
        var row = data[index];

        if ($inputCheckbox.prop ('checked')) {
          if (multiSelect + '' !== 'true') {
            self._$rows
              .find ("input[name='table_" + ouiId + "_checkbox']:checked")
              .prop ('checked', false);
            self._$rows
              .find (rowSelector + '.selected')
              .removeClass ('selected');
            triggerAllDataRowSelected.call (self, false);
          }
          row._selected = true;
          $inputCheckbox.prop ('checked', true);
          if (isAllSelected.call (self)) {
            self._$columns
              .find ('#table_' + ouiId + '_all_checkbox')
              .prop ('checked', true);
          }
          triggerEvent.call (self, 'onRowSelect', self, row, $tr);

          self._$rowsLock.find ('#' + id).addClass ('selected');
          self._$rowsView.find ('#' + id).addClass ('selected');
        } else {
          self._$columns
            .find ('#table_' + ouiId + '_all_checkbox')
            .prop ('checked', false);
          row._selected = false;
          $inputCheckbox.prop ('checked', false);
          triggerEvent.call (self, 'onRowUnSelect', self, row, $tr);
          self._$rowsLock.find ('#' + id).removeClass ('selected');
          self._$rowsView.find ('#' + id).removeClass ('selected');
        }
      }
    );

    if (!oui.os.mobile) {
      self._$rows.on ('mouseover', 'tr.oui-table-grid-row', function () {
        var $tr = $ (this);
        var id = $tr.attr ('id');
        if (id.indexOf ('noData') < 0) {
          //var index = id.replace("table_" + ouiId + "_tr_", "");
          var index = $tr.index () - 1;
          var data = self.attr ('data');
          var row = data[index];
          self._$rowsLock.find ('#' + id).addClass ('tr-hover');
          self._$rowsView.find ('#' + id).addClass ('tr-hover');
          triggerEvent.call (self, 'onRowover', self, row, $tr);
        }
      });

      self._$rows.on ('mouseout', 'tr.oui-table-grid-row', function () {
        var $tr = $ (this);
        var id = $tr.attr ('id');
        if (id.indexOf ('noData') < 0) {
          // var index = id.replace("table_" + ouiId + "_tr_", "");
          var index = $tr.index () - 1;
          var data = self.attr ('data');
          var row = data[index];
          self._$rowsLock.find ('#' + id).removeClass ('tr-hover');
          self._$rowsView.find ('#' + id).removeClass ('tr-hover');
          triggerEvent.call (self, 'onRowout', self, row, $tr);
        }
      });
    }

    var rowClickSelector = 'tr.oui-table-grid-row td';

    if (isCard) {
      rowClickSelector = 'dl.oui-table-grid-row dd,dl.oui-table-grid-row dt';
    }

    self.checkForm = true;
    /**
         * 点击行选中和取消选中事件
         */
    self._$rows.on ('click', rowClickSelector, function (e) {
      var $td = $ (this);
      //以下处理 行的选中和 取消选中
      var $tr = $td.closest ('tr');
      if (isCard) {
        $tr = $td.closest ('dl');
      }
      if ($tr.hasClass ('row-edit-layout')) {
        return;
      }
      var id = $tr.attr ('id');
      var index = id.replace ('table_' + ouiId + '_tr_', '');
      if (index === 'noData') return;
      var _trIndex = $tr.index ();
      index = _trIndex - 1;
      var data = self.attr ('data');
      var row = data[index];

      if ($ (e.target).hasClass ('selected-icon')) return;

      //处理单元格
      var columnsIndex = $td.attr ('id').replace (ouiId + 'cell_', '');
      var column = getColumnByIndex.call (self, columnsIndex);
      var hasCellClick = false;
      if (column) {
        var cValue = '';
        if (column['fieldName'] && column['fieldName'].length > 0) {
          cValue = oui.JsonPathUtil.getJsonByPath (column['fieldName'], row);
        }
        var columnClick = column['onCellclick'];
        if (columnClick) {
          columnClick = evalFunc (columnClick);
          columnClick &&
            columnClick.call (self, self, row, cValue, column, $td, $tr);
          hasCellClick = true;
        } else {
          if (self.attr ('onCellclick')) {
            hasCellClick = true;
          }
          triggerEvent.call (
            self,
            'onCellclick',
            self,
            row,
            cValue,
            column,
            $td,
            $tr
          );
        }
      }
      //FIXME 移动端如果是复选框TD则不触发rowClick
      if (
        column.columnType !== SpecialColumns.CHECKBOX_COLUMN.type &&
        !hasCellClick
      ) {
        triggerEvent.call (self, 'onRowclick', self, row, $tr, column);
      }
      var editModel = self.attr ('editModel');
      if (editModel === 'click') {
        //如果是双击编辑模式
        // var flag = oui.checkForm($(self._getTableEditView()));
        // if (!flag) {
        //     self.checkForm = false;
        //     e.stopPropagation();
        //     e.preventDefault();
        //     return false;
        // }
        var $ouiControlDom = column.$ouiControlDom;
        if ($ouiControlDom) {
          createOuiForm4edit.call (this, column, row, $td);
          e.stopPropagation (); //不冒泡，阻止全局事件
        }
      }
    });

    /**
         * 行的双击事件
         * 单元格的双击事件
         */
    self._$rows.on ('dblclick', rowSelector + ' td', function (e) {
      var $td = $ (this);
      var $tr = $td.closest ('tr');
      var id = $tr.attr ('id');
      var index = id.replace ('table_' + ouiId + '_tr_', '');
      if (index === 'noData') return;
      index = $tr.index () - 1;
      var data = self.attr ('data');
      var row = data[index];

      var columnsIndex = $td.attr ('id').replace (ouiId + 'cell_', '');
      var column = getColumnByIndex.call (self, columnsIndex, true);
      if (column) {
        triggerEvent.call (
          self,
          'onCelldblclick',
          self,
          row,
          oui.JsonPathUtil.getJsonByPath (column['fieldName'], row),
          column,
          $td
        );
      }
      triggerEvent.call (self, 'onRowdblclick', self, row, $tr);
      var editModel = self.attr ('editModel');
      if (editModel === 'dblClick') {
        //如果是双击编辑模式
        createOuiForm4edit.call (this, column, row, $td);
      }
    });

    var winWidth = $ (window).width ();

    var createOuiForm4edit = function (column, row, $td, isBatchEdit) {
      var $ouiControlDom = column.$ouiControlDom;
      if (!$ouiControlDom) {
        return;
      }
      var text = null;
      var ouiFormId = null;
      var formControlUpdateAfter = null;
      var offset = $td.offset ();
      var left = offset.left;
      var top = offset.top;
      var _$ouiControlDom = $ ($ouiControlDom).clone ();
      if (!isBatchEdit) {
        formControlUpdateAfter =
          'oui.getByOuiId(' +
          self.attr ('ouiId') +
          ').formControlUpdate4SingleEdit';
        text = oui.JsonPathUtil.getJsonByPath (column['fieldName'], row); //row[column['fieldName']];
        ouiFormId =
          self.attr ('id') +
          'rows' +
          row['_index'] +
          'cell' +
          column['_index'] +
          '_control';
        var onAfterUpdateStr = _$ouiControlDom.attr ('onafterupdate');
        if (onAfterUpdateStr && onAfterUpdateStr.length > 0) {
          onAfterUpdateStr += ',' + formControlUpdateAfter;
        } else {
          onAfterUpdateStr = formControlUpdateAfter;
        }
        _$ouiControlDom.attr ('onAfterUpdate', onAfterUpdateStr);

        if (text) {
          if ($.isPlainObject (text)) {
            if (text.data4DB) {
              _$ouiControlDom.attr (
                'data4DB',
                typeof text.data4DB === 'string'
                  ? text.data4DB
                  : oui.parseString (text.data4DB)
              );
            }
            if (text.data) {
              _$ouiControlDom.attr (
                'data',
                typeof text.data === 'string'
                  ? text.data
                  : oui.parseString (text.data)
              );
            }
            if (typeof text.value !== 'undefined' && text.value !== null) {
              _$ouiControlDom.attr (
                'value',
                oui.escapeHTMLToString (text.value)
              );
            }
          } else {
            _$ouiControlDom.attr ('value', oui.escapeHTMLToString (text));
          }
        }
      } else {
        // formControlUpdateAfter = "oui.getByOuiId(" + self.attr("ouiId") + ").formControlUpdate4BatchEdit";
        ouiFormId =
          self.attr ('id') + 'batchEditCell' + column['_index'] + '_control';
        top += $td.outerHeight ();
      }
      _$ouiControlDom.attr ('id', ouiFormId);

      var $rowEditView = null;
      var outHtml = _$ouiControlDom[0].outerHTML;
      var width = 0;
      var tdWidth = $td.outerWidth ();
      if (isBatchEdit) {
        $rowEditView = self._getTableBatchEditView (true);
        $rowEditView.find ('.batchEdit-area-input').html (outHtml);
        $rowEditView.show ();
        if (tdWidth <= 360) {
          width = 360;
        } else {
          width = tdWidth;
        }
        //确定按钮
        $rowEditView
          .find ('.batchEdit-btn-submit')
          .off ('click')
          .on ('click', function () {
            var control = oui.getById (ouiFormId);
            self.formControlUpdate4BatchEdit (control);
            $rowEditView.html ('').hide ();
          });
        //取消按钮
        $rowEditView
          .find ('.batchEdit-btn-cancel')
          .off ('click')
          .on ('click', function () {
            //取消不显示
            $rowEditView.html ('').hide ();
          });
      } else {
        width = tdWidth;
        $rowEditView = self._getTableEditView (true);
        $rowEditView.html (outHtml).show ();
      }
      var right = '';
      var tableOffset = self._$tableGridView.offset ();
      var tableWidth = self._$tableGridView.outerWidth ();
      var tableTop = tableOffset.top;
      var tableLeft = tableOffset.left;
      var tableRight = tableLeft + tableWidth;
      top = top - tableTop;
      if (tableRight - left < $rowEditView.outerWidth ()) {
        right = tableRight - left - tdWidth;
        left = '';
      } else {
        left = left - tableLeft;
        right = '';
      }
      $rowEditView.css ({
        left: left,
        right: right,
        top: top,
        width: width,
        'z-index': '10',
      });
      var tableOuiId = self.attr ('ouiId');
      var $ouiEditForm = $rowEditView.find (oui.$.constant.controlTagName)[0];
      oui.parseByDom ($ouiEditForm, null, function (control) {
        control.attr ({
          tableOuiId: tableOuiId,
        });
        if (!isBatchEdit) {
          //第一次加载必须执行update，需要触发formControlUpdate，来为data行添加ouiId等属性
          control.triggerUpdate ();
        }
      });
    };

    $ (document).on ('click', function (e) {
      if (!oui.isInDom (e.target, '#ouiTableEditView')) {
        if (self && self._getTableEditView) {
          // if(self.checkForm){
          self._getTableEditView ().html ('').hide ();
          // }
        }
      }
    });

    $ ('html,body').on ('scroll', function () {
      if (self && self._getTableEditView) {
        self._getTableEditView ().html ('').hide ();
      }
    });
  };

  var triggerRowSelectedByRowIndex = function (rowIndex, fireEvent, flag) {
    var self = this;
    var ouiId = self.attr ('ouiId');
    //以下处理 行的选中和 取消选中
    var $tr = self._$rowsViewContent.find (
      '#table_' + ouiId + '_tr_' + rowIndex
    ); //.closest("tr");
    var id = $tr.attr ('id');
    var index = id.replace ('table_' + ouiId + '_tr_', '');
    if (index + '' === 'noData') return;
    index = $tr.index () - 1;
    var data = self.attr ('data');
    var row = data[index];
    var multiSelect = self.attr ('multiSelect');
    var allowUnselect = self.attr ('allowUnselect');
    if (!!flag) {
      if (multiSelect + '' !== 'true') {
        self._$rows
          .find ("input[name='table_" + ouiId + "_checkbox']:checked")
          .prop ('checked', false);
        triggerAllDataRowSelected.call (self, false);
      }
      row._selected = true;
      self._$rowsLock
        .find ('#' + id)
        .addClass ('selected')
        .find ("input[name='table_" + ouiId + "_checkbox']")
        .prop ('checked', true);
      self._$rowsView
        .find ('#' + id)
        .addClass ('selected')
        .find ("input[name='table_" + ouiId + "_checkbox']")
        .prop ('checked', true);
      if (isAllSelected.call (self)) {
        self._$columns
          .find ('#table_' + ouiId + '_all_checkbox')
          .prop ('checked', true);
      }
      if (fireEvent) {
        triggerEvent.call (self, 'onRowSelect', self, row, $tr);
      }
    } else {
      row._selected = false;
      self._$rowsLock
        .find ('#' + id)
        .removeClass ('selected')
        .find ("input[name='table_" + ouiId + "_checkbox']")
        .prop ('checked', false);
      self._$rowsView
        .find ('#' + id)
        .removeClass ('selected')
        .find ("input[name='table_" + ouiId + "_checkbox']")
        .prop ('checked', false);
      self._$columns
        .find ('#table_' + ouiId + '_all_checkbox')
        .prop ('checked', false);
      if (fireEvent) {
        triggerEvent.call (self, 'onRowUnSelect', self, row, $tr);
      }
    }
  };

  var triggerAllDataRowSelected = function (flag) {
    var self = this;
    var data = self.attr ('data') || [];
    var ouiId = self.attr ('ouiId');
    var id = '';
    var $tr = null;
    for (var i = 0, len = data.length; i < len; i++) {
      id = '#table_' + ouiId + '_tr_' + data[i]['_index'];
      if (flag) {
        $tr = self._$rowsLock.find (id);
        if (
          $tr.find ("input[name='table_" + ouiId + "_checkbox']").length > 0
        ) {
          data[i]._selected = flag;
        } else {
          $tr = self._$rowsView.find (id);
          if (
            $tr.find ("input[name='table_" + ouiId + "_checkbox']").length > 0
          ) {
            data[i]._selected = flag;
          }
        }
        triggerEvent.call (self, 'onRowSelect', self, data[i], $tr);
      } else {
        $tr = self._$rowsLock.find (id);
        if ($tr.length <= 0) {
          $tr = self._$rowsView.find (id);
        }
        data[i]._selected = flag;
        triggerEvent.call (self, 'onRowUnSelect', self, data[i], $tr);
      }
    }
  };

  var isAllSelected = function () {
    var self = this;
    var data = self.attr ('data');
    var flag = true;
    if (data.length <= 0) {
      flag = false;
    } else {
      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i]['_selected'] + '' !== 'true') {
          flag = false;
          break;
        }
      }
    }
    return flag;
  };

  /**
     * 触发事件
     * @param eventName
     */
  var triggerEvent = function (eventName) {
    var self = this;
    var onEvent = self.attr (eventName);
    var args = [].slice.call (arguments);
    args.shift ();
    if (onEvent) {
      return onEvent.apply (self, args);
    }
  };

  /**
     * 渲染网格线
     */
  var render$gridLines = function () {
    var self = this;
    self._RGridLines ();
  };

  /**
     * 渲染列
     */
  var render$Columns = function () {
    var self = this;
    self._RColumnsView ();
  };

  /**
     * 表格获取数据
     * @param param
     * @param success
     * @param error
     */
  var tableGetData = function (param, success, error) {
    var self = this;
    var dataURL = self.getDataUrl ();
    if (dataURL && dataURL.length > 0) {
      oui.getData (
        dataURL,
        param,
        function (result) {
          result = oui.parseJson (result);
          if (result.success + '' === 'true') {
            result = result['msg'];
            result = oui.parseJson (result);
            success &&
              success (
                oui.JsonPathUtil.getJsonByPath (
                  self.getDataFieldName (),
                  result
                )
              );
          } else {
            if (self.attr ('onLoaderror')) {
              triggerEvent.call (self, 'onLoaderror', self, result);
            } else {
              oui.alert (result.msg);
            }
            error && error (result);
          }
        },
        '加载中...'
      );
    } else {
      error && error ([]);
    }
  };

  /**
     * 根据配置定义初始化数据
     */
  var initData = function (fromDataUrl, isTbodyLoad) {
    var self = this;
    self.attr ('oldData', []);
    var data = self.getData ();
    if (!isTbodyLoad && (!data || data.length <= 0 || fromDataUrl)) {
      if (self._pagerControl) {
        self._pagerControl.go2first ();
      } else {
        tableGetData.call (
          self,
          {},
          function (data) {
            data = oui.parseJson (data);
            self.setData (data);
            self._RRowsView ();
            self.scrollIntoView (0);
          },
          function () {
            self.setData ([]);
            self._RRowsView ();
          }
        );
      }
    } else {
      self._RRowsView ();
      self.scrollIntoView (0);
    }
  };

  var filterData = function (data, queryParam) {
    var flag = true;
    var _paramCondition = null;
    for (var i = 0, len = queryParam.length; i < len; i++) {
      _paramCondition = queryParam[i];
      var trueData = oui.JsonPathUtil.getJsonByPath (
        _paramCondition['field'],
        data
      );
      // var trueData = data[_paramCondition['field']];
      var conditionData = _paramCondition['value'];
      if (typeof trueData !== 'undefined') {
        switch (_paramCondition['expression']) {
          case '=':
            flag = trueData === conditionData;
            break;
          case 'like':
            flag = trueData.indexOf (conditionData) > -1;
            break;
          case '<':
            flag = trueData < conditionData;
            break;
          case '>':
            flag = trueData > conditionData;
            break;
          case '>=':
            flag = trueData >= conditionData;
            break;
          case '<=':
            flag = trueData <= conditionData;
            break;
          case 'in':
          case 'all':
            flag = conditionData.indexOf (trueData) > -1;
            break;
          default:
            break;
        }
      } else {
        flag = false;
      }

      if (!flag) break;
    }
    return flag;
  };

  /** Methods **/

  var resize = function () {
    var _self = this;
    var tableGird = _self._$tableGridView;
    _self._$columnsView
      .find ('.oui-grid-table')
      .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
    _self._$columnsView.width (_self._$rowsViewContent.width ());
    _self._$summaryRowView
      .find ('.oui-grid-table')
      .width (_self._$rowsViewContent.find ('.oui-grid-table').width ());
    _self._$summaryRowView.width (_self._$rowsViewContent.width ());
    if (
      tableGird.attr ('style') &&
      tableGird.attr ('style').indexOf ('height') > -1
    ) {
      var maxHeight = tableGird.css ('max-height');
      var viewHeight = _self._$viewport.height ();
      maxHeight =
        Number (maxHeight ? (maxHeight + '').replace ('px', '') : 0) || 0;
      if (maxHeight) {
        if (maxHeight <= viewHeight) {
          _self._$summaryRow.addClass ('oui-grid-summaryRow-fixed');
          offsetHeight =
            maxHeight -
            _self._$columns.outerHeight () -
            _self._$summaryRow.outerHeight () -
            _self._$gridFooter.outerHeight ();
          _self._$rows.height (offsetHeight);
        } else {
          _self._$rows.height ('auto');
        }
      } else {
        _self._$summaryRow.addClass ('oui-grid-summaryRow-fixed');
        var offsetHeight =
          tableGird.height () -
          _self._$columns.outerHeight () -
          _self._$summaryRow.outerHeight () -
          _self._$gridFooter.outerHeight ();
        _self._$rows.height (offsetHeight);
      }
    } else {
      _self._$rows.height ('auto');
    }
    _self._RGridWidth ();
    triggerEvent.call (_self, 'onResize');
  };

  var getRowLength = function () {
    return (this.attr ('data') || []).length || 0;
  };

  var noDataTr =
    '{{if emptyTips && emptyTips.length > 0}}' +
    '<tr id="table_{{ouiId}}_tr_noData" class="oui-table-grid-row">' +
    '<td style="width: 0;border:0;"></td>' +
    "<td colspan=\"{{columnsArray.length}}\" class=\"text-center grid-emptyText {{emptyTipsIcon+'' === 'true' ? '':'grid-emptyText-noIcon'}}\">" +
    '<div class="cell-inner ">{{=emptyTips}}</div>' +
    '</td>' +
    '</tr>' +
    '{{/if}}';

  var filterByQueryParam = function (queryParam) {
    var self = this;
    var oldData = self.attr ('data');
    var ouiId = self.attr ('ouiId');
    // var _oldData = self.attr("oldData") || [];
    // if (_oldData && _oldData.length > 0) {
    //     oldData = _oldData;
    // } else {
    //     _oldData = oldData;
    //     self.attr("oldData", _oldData);
    // }
    var data = [];
    if (oldData && oldData.length > 0) {
      for (var i = 0, len = oldData.length; i < len; i++) {
        var _d = oldData[i];
        if (filterData (_d, queryParam)) {
          var cls = '';
          var allowAlternating = self.attr ('allowAlternating') || false;
          if (allowAlternating + '' === 'true') {
            cls = data.length % 2 !== 0 ? 'grid-row-alt' : '';
          }
          data.push (_d);

          self._$rowsLockContent
            .find ('#table_' + self.attr ('ouiId') + '_tr_' + _d['_index'])
            .removeClass ('grid-row-alt')
            .addClass (cls)
            .show ();
          self._$rowsViewContent
            .find ('#table_' + self.attr ('ouiId') + '_tr_' + _d['_index'])
            .removeClass ('grid-row-alt')
            .addClass (cls)
            .show ();
        } else {
          self._$rowsLockContent
            .find ('#table_' + self.attr ('ouiId') + '_tr_' + _d['_index'])
            .hide ();
          self._$rowsViewContent
            .find ('#table_' + self.attr ('ouiId') + '_tr_' + _d['_index'])
            .hide ();
        }
      }
    }

    if (data.length <= 0) {
      if (
        self._$tableGridView.find ('#table_' + ouiId + '_tr_noData').length <= 0
      ) {
        var rowsContentSelector = '.oui-grid-table tbody';
        if (self.isCard) {
          rowsContentSelector = '.oui-grid-table';
        }
        if (!self.noDataRender) {
          self.noDataRender = template.compile (noDataTr);
        }
        var lockColumnSize = self.attr ('lockColumnSize');
        var columnsArray = self.attr ('columnsArray');
        var showColumnsArray = [];
        var lockColumnsObj = [];
        var noLockColumnsArray = [];

        if (lockColumnSize > 0) {
          showColumnsArray = getVisibleColumns (columnsArray);
          lockColumnsObj = getLockColumns (showColumnsArray, lockColumnSize);
          noLockColumnsArray = lockColumnsObj.noLockArray;
        } else {
          noLockColumnsArray = columnsArray;
        }
        var nolockHtml = self.noDataRender ({
          tableAttr: self.getMap (),
          emptyTips: self.attr ('emptyTips'),
          emptyTipsIcon: self.attr ('emptyTipsIcon'),
          columnsArray: noLockColumnsArray,
          ouiId: self.attr ('ouiId'),
        });
        self._$rowsViewContent.find (rowsContentSelector).append (nolockHtml);
      }
    } else {
      self._$tableGridView.find ('#table_' + ouiId + '_tr_noData').remove ();
    }
    // self.attr("data", data);
    // self._RRowsView();
    self._RGridWidth ();
    self.scrollIntoView (0);
  };

  /**
     * 排序方法
     * @param sortField
     * @param sortOrder
     */
  var sortBy = function (sortField, sortOrder) {
    var self = this;
    if (sortField) {
      self.sortCfg.sortField = sortField; //column["fieldName"];
    }
    self.sortCfg.sortOrder = sortOrder || ORDER_TYPE.ASC;
    self._RRowsView ();
  };

  /**
     * 根据分页渲染表格
     * @param pager
     * @param result
     */
  var renderByPager = function (pager, result) {
    var self = this;
    var dataFieldName = self.attr ('dataFieldName');
    var data = oui.JsonPathUtil.getJsonByPath (dataFieldName, result); //result[dataFieldName] || [];
    data = oui.parseJson (data || '[]');
    self.attr ('data', data);
    self._RRowsView ();
  };

  /**
     * 根据分页渲染表格
     * @param pager
     * @param result
     */
  var renderByPager4phone = function (pager, result) {
    var self = this;
    var dataFieldName = self.attr ('dataFieldName');
    var data = oui.JsonPathUtil.getJsonByPath (dataFieldName, result); //result[dataFieldName] || [];
    self._RRowsViewByData (data);
  };

  var getRowObjByRow = function (row) {
    var data = this.attr ('data');
    for (var i = 0, len = data.length; i < len; i++) {
      if (row['_id'] === data[i]['_id']) {
        return data[i];
      }
    }
    return null;
  };

  var getRowIndexByRow = function (row) {
    var data = this.attr ('data');
    for (var i = 0, len = data.length; i < len; i++) {
      if (row['_id'] === data[i]['_id']) {
        return row['_index'];
      }
    }
    return -1;
  };

  var getRowIndexByRow4Data = function (row) {
    if (!row) {
      return -1;
    }
    var data = this.attr ('data');
    for (var i = 0, len = data.length; i < len; i++) {
      if (row['_id'] === data[i]['_id']) {
        return i;
      }
    }
    return -1;
  };

  var renderRows = function () {
    var self = this;
    var ouiId = self.attr ('ouiId');
    self._RGridLines ();
    self._RRowsView ();
    if (isAllSelected.call (self)) {
      self._$columns
        .find ('#table_' + ouiId + '_all_checkbox')
        .prop ('checked', true);
    } else {
      self._$columns
        .find ('#table_' + ouiId + '_all_checkbox')
        .prop ('checked', false);
    }
  };

  /**
     * 根据参数加载表格
     * @param params
     */
  var load = function (params) {
    var self = this;
    if (self._pagerControl) {
      if (typeof params === 'undefined' || params === null) {
        self._pagerControl.go2currPage ();
      } else if (typeof params === 'string') {
        self.attr ('dataUrl', params);
        self._pagerControl.attr ('dataUrl', params);
        self._pagerControl.go2first ();
        self.scrollIntoView (0);
      } else if (typeof params === 'number') {
        self._pagerControl.go2page (params);
      }
    } else {
      self.attr ('data', []);
      if (typeof params === 'undefined' || params === null) {
        //self._pagerControl.go2currPage();
        initData.call (self);
      } else if (typeof params === 'string') {
        self.attr ('dataUrl', params);
        initData.call (self, params);
        // self._pagerControl.go2first();
      } else if (typeof params === 'number') {
        initData.call (self);
      }
    }
  };

  var rowKeys = ['_id', '_index', '_uuid', '_isEdited'];
  var rowObjectFilter = function (row) {
    var rowData = {};
    if (row) {
      for (var key in row) {
        if (rowKeys.indexOf (key) < 0) {
          rowData[key] = row[key];
        }
      }
    }
    return rowData;
  };

  var updateRow = function (row, rowData, noShowEdit) {
    var self = this;
    var rowObj = getRowObjByRow.call (this, row);
    rowData = $.extend (true, {}, rowObjectFilter (rowData));
    $.extend (true, rowObj, rowData);
    var newData = this._RRowsViewByIndex ([rowObj], 2);
    var popupDialogOperateRow = self.attr ('popupDialogOperateRow');
    if (
      popupDialogOperateRow + '' === 'true' &&
      self.attr ('showType') === '1' &&
      !noShowEdit
    ) {
      var newRow = newData[0]; //添加行直接获取第一条
      showEditPageByRow.call (self, newRow, true);
    }
  };

  var removeRow = function (row) {
    if (row) {
      this._RRowsViewByIndex ([row], 1);
    }
    // var data = this.attr("data");
    // if (index >= 0) {
    //     data.splice(index, 1);
    //     this._RRowsView();
    // }
  };

  var removeRows = function (rows) {
    if (rows && rows.length > 0) {
      this._RRowsViewByIndex (rows, 1);
    }
  };

  /**
     * 添加行
     * @param row  要添加的行数据
     * @param index 索引
     * @param notShowEdit 不需要显示编辑界面
     */
  var addRow = function (row, index, notShowEdit) {
    var self = this;
    index = index || 0;
    if (row) {
      if (index !== 0 && index > self.getRowLength ()) {
        return;
      }
      var newData = self._RRowsViewByIndex ([row], 0, index);
      var popupDialogOperateRow = self.attr ('popupDialogOperateRow');
      if (
        popupDialogOperateRow + '' === 'true' &&
        self.attr ('showType') === '1' &&
        !notShowEdit
      ) {
        var newRow = newData[0]; //添加行直接获取第一条
        showEditPageByRow.call (self, newRow, false);
      }
    }
  };

  var btnTemplateHTML =
    '<span class="span-btn">' +
    '<button onclick="oui.getByOuiId({{ouiId}}).editAction(0);" >确定</button>' +
    '</span>' +
    '<span class="span-btn">' +
    '<button onclick="oui.getByOuiId({{ouiId}}).editAction(1);" class="btntype-2" >取消</button>' +
    '</span>';

  var editAction = function (actionIndex) {
    var self = this;
    var $tr = self._$tableGridView.find ('.row-edit-layout');
    var isUpdate = $tr.hasClass ('row-edit-update');
    var _trIndex = $tr.index ();
    var index = _trIndex - 1;
    var data = self.attr ('data');
    var row = data[index];
    // try{
    //     alert(document.activeElement);
    //     $(document.activeElement).blur(function(){
    //         self.resize();
    //         //$('.contact').css('position','fixed');
    //     });
    //     document.activeElement.blur();
    // }catch (e){
    //
    // }

    // 外部逻辑
    if (actionIndex === 0) {
      //确定
      var flag = triggerEvent.call (
        self,
        'onPopupDialogOk',
        self,
        isUpdate,
        row
      );
      if (flag === false) {
        return false;
      }
    }

    self._$tableGridView
      .find ('.rowEdit-buttons-content')
      .removeClass ('show-rowEdit-buttons');
    var $allControl = $tr.find ('div[ouiId]');
    $allControl.each (function () {
      var $this = $ (this);
      var ouiId = $this.attr ('ouiId');
      var control = oui.getByOuiId (ouiId);
      if (control.attr ('right') === 'edit') {
        control.attr ('right', 'edit4ReadOnly');
        control.render ();
      }
    });
    triggerEvent.call (self, 'onPopupDialogHide', self);
    $tr.removeClass ('row-edit-layout');
    $ ('body').css ('overflow', 'auto');

    if (!isUpdate) {
      //新增
      if (actionIndex === 1) {
        //取消按钮
        removeRow.call (self, row); //新增，取消删除
      }
    } else {
      //修改
      if (actionIndex === 1) {
        //取消按钮
        var oldRow = self.attr ('oldEditRow');
        $tr.removeClass ('row-edit-update');
        updateRow.call (self, row, oldRow, true);
      }
    }

    if (actionIndex === 1) {
      //取消
      triggerEvent.call (self, 'onPopupDialogCancel', self, isUpdate, row);
    }

    setTimeout (function () {
      self.resize ();
    }, 150);
    return false;
  };

  /**
     * 显示编辑页面
     * @param row 行对象
     * @param isUpdate 是否修改
     */
  var showEditPageByRow = function (row, isUpdate) {
    var self = this;
    var rowIndex = row['_index'];
    var ouiId = self.attr ('ouiId');
    var trId = 'table_' + ouiId + '_tr_' + rowIndex;
    var $tr = self._$rowsViewContent.find ('#' + trId);
    if ($tr.length <= 0) return;

    var $allControl = $tr.find ('div[ouiId]');
    $allControl.each (function () {
      var $this = $ (this);
      var ouiId = $this.attr ('ouiId');
      var control = oui.getByOuiId (ouiId);
      if (control.attr ('right') === 'edit4ReadOnly') {
        control.attr ('right', 'edit');
        control.render ();
      }
    });

    if (!self.editBtnRender) {
      self.editBtnRender = template.compile (btnTemplateHTML);
    }

    var html = self.editBtnRender ({
      ouiId: ouiId,
    });

    triggerEvent.call (self, 'onPopupDialogShow', self);

    $tr.addClass ('row-edit-layout');

    if (isUpdate) {
      $tr.addClass ('row-edit-update');
      var oldEditRow = rowObjectFilter (row);
      oldEditRow = $.extend (true, {}, oldEditRow);
      self.attr ('oldEditRow', oldEditRow);
    }
    var $btnContent = self._$tableGridView.find ('.rowEdit-buttons-content');
    var zIndex = -1;
    if (oui.$.ctrl.dialog) {
      var Dialog = oui.$.ctrl.dialog;
      Dialog.dialogMaxZIndex++;
      Dialog.zIndex++;
      zIndex = Dialog.zIndex;
    }
    if (zIndex > 0) {
      $tr.css ('z-index', zIndex);
      $btnContent.css ('z-index', zIndex);
    }
    $btnContent.html (html).addClass ('show-rowEdit-buttons');
    $ ('body').css ('overflow', 'hidden');
  };

  var addRows = function (rows, index) {
    var self = this;
    index = index || 0;
    // var data = self.attr("data");
    if (rows && rows.length > 0) {
      if (index !== 0 && index > self.getRowLength ()) {
        return;
      }
      self._RRowsViewByIndex (rows, 0, index);
      //
      // for (var i = 0, len = rows.length; i < len; i++) {
      //     data.splice(index + i, 0, $.extend(true, {}, rowObjectFilter(rows[i])));
      // }
      // self._RRowsView();
    }
  };

  var moveRow = function (row, _index) {
    if (row) {
      var self = this;
      var data = self.attr ('data');
      if (_index > -1 && _index + 1 < data.length) {
        var index = getRowIndexByRow4Data.call (self, row);
        var tempRow = self.getRowByIndex (_index);
        if (tempRow) {
          var ouiId = self.attr ('ouiId');
          var d = null;
          var tempLockTr = self._$rowsLockContent.find (
            '#table_' + ouiId + '_tr_' + tempRow['_index']
          );
          var tempRowTr = self._$rowsViewContent.find (
            '#table_' + ouiId + '_tr_' + tempRow['_index']
          );
          var currLoctTr = self._$rowsLockContent.find (
            '#table_' + ouiId + '_tr_' + row['_index']
          );
          var currRowTr = self._$rowsViewContent.find (
            '#table_' + ouiId + '_tr_' + row['_index']
          );
          if (index > _index) {
            d = data.splice (index, 1)[0];
            data.splice (_index, 0, d);
            currLoctTr.insertBefore (tempLockTr);
            currRowTr.insertBefore (tempRowTr);
          } else if (index < _index) {
            d = data.splice (index, 1)[0];
            data.splice (_index, 0, d);
            currLoctTr.insertAfter (tempLockTr);
            currRowTr.insertAfter (tempRowTr);
          }
          self._RIndexColumn4Rows ();
        }
      }
    }
  };

  var moveUp = function (row) {
    var self = this;
    // var data = self.attr("data");
    // var index = getRowIndexByRow4Data.call(self, row);
    // data[index] = data.splice(index - 1, 1, data[index])[0];
    // self._RRowsView();
    if (row) {
      var data = self.attr ('data');
      var index = getRowIndexByRow4Data.call (self, row);
      if (index > 0) {
        var oldRow = data[index];
        data[index] = data.splice (index - 1, 1, oldRow)[0];
        var rowIndex = oldRow['_index'];
        var ouiId = self.attr ('ouiId');
        var oldLockTr = self._$rowsLockContent.find (
          '#table_' + ouiId + '_tr_' + rowIndex
        );
        var oldRowTr = self._$rowsViewContent.find (
          '#table_' + ouiId + '_tr_' + rowIndex
        );
        oldLockTr.insertBefore (oldLockTr.prev ());
        oldRowTr.insertBefore (oldRowTr.prev ());
        self._RIndexColumn4Rows ();
      }
    }
  };

  var moveDown = function (row) {
    var self = this;
    if (row) {
      var data = self.attr ('data');
      var index = getRowIndexByRow4Data.call (self, row);
      if (index >= 0 && index + 1 < data.length) {
        var oldRow = data[index];
        data[index] = data.splice (index + 1, 1, oldRow)[0];
        var rowIndex = oldRow['_index'];
        var ouiId = self.attr ('ouiId');
        var oldLockTr = self._$rowsLockContent.find (
          '#table_' + ouiId + '_tr_' + rowIndex
        );
        var oldRowTr = self._$rowsViewContent.find (
          '#table_' + ouiId + '_tr_' + rowIndex
        );
        oldLockTr.insertAfter (oldLockTr.next ());
        oldRowTr.insertAfter (oldRowTr.next ());
        self._RIndexColumn4Rows ();
      }
    }
  };

  var clearRows = function () {
    var self = this;
    self.attr ('data', []);
    self._RRowsView ();
  };

  var gridIndexOf = function (row) {
    return getRowIndexByRow4Data.call (this, row);
  };

  var isSelected = function (row) {
    var self = this;
    var rowObj = getRowObjByRow.call (self, row);
    return !!rowObj._selected;
  };

  var getSelecteds = function () {
    var self = this;
    var data = self.attr ('data') || [];
    var selecteds = [];
    for (var i = 0, len = data.length; i < len; i++) {
      if (!!data[i]._selected) {
        selecteds.push (data[i]);
      }
    }
    return selecteds;
  };

  var getSelected = function () {
    var self = this;
    var selecteds = getSelecteds.call (self);
    if (selecteds.length > 0) {
      return selecteds[selecteds.length - 1];
    } else {
      return null;
    }
  };

  var setSelected = function (row) {
    var self = this;
    var rowObj = getRowObjByRow.call (self, row);
    rowObj._selected = true;
  };

  var select = function (row) {
    var self = this;
    if (row) {
      var rowIndex = getRowIndexByRow.call (self, row);
      if (rowIndex > -1) {
        triggerRowSelectedByRowIndex.call (self, rowIndex, true, true);
      }
    }
  };

  var deselect = function (row) {
    var self = this;
    if (row) {
      var rowIndex = getRowIndexByRow.call (self, self.findRowBy (row));
      if (rowIndex > -1) {
        triggerRowSelectedByRowIndex.call (self, rowIndex, true, false);
      }
    }
  };

  var selects = function (rows) {
    var self = this;
    if (rows && rows.length > 0) {
      for (var i = 0, len = rows.length; i < len; i++) {
        select.call (self, rows[i]);
      }
    }
  };

  var deselects = function (rows) {
    var self = this;
    if (rows && rows.length > 0) {
      for (var i = 0, len = rows.length; i < len; i++) {
        deselect.call (self, rows[i]);
      }
    }
  };
  var selectAll = function () {
    var self = this;
    var rowSelector = 'tr.oui-table-grid-row';
    if (self.isCard) {
      rowSelector = 'dl.oui-table-grid-row';
    }
    var ouiId = self.attr ('ouiId');
    self._$columns
      .find ('#table_' + ouiId + '_all_checkbox')
      .prop ('checked', true);
    self._$rowsLockContent
      .find ("input[name='table_" + ouiId + "_checkbox']")
      .prop ('checked', true);
    self._$rowsLockContent.find (rowSelector).addClass ('selected');
    self._$rowsViewContent
      .find ("input[name='table_" + ouiId + "_checkbox']")
      .prop ('checked', true);
    self._$rowsViewContent.find (rowSelector).addClass ('selected');
    triggerAllDataRowSelected.call (self, true);
  };

  var deselectAll = function () {
    var self = this;
    var rowSelector = 'tr.oui-table-grid-row';
    if (self.isCard) {
      rowSelector = 'dl.oui-table-grid-row';
    }
    var ouiId = self.attr ('ouiId');
    self._$columns
      .find ('#table_' + ouiId + '_all_checkbox')
      .prop ('checked', false);
    self._$rowsLockContent
      .find ("input[name='table_" + ouiId + "_checkbox']")
      .prop ('checked', true);
    self._$rowsLockContent.find (rowSelector).addClass ('selected');
    self._$rowsViewContent
      .find ("input[name='table_" + ouiId + "_checkbox']")
      .prop ('checked', false);
    self._$rowsViewContent.find (rowSelector).removeClass ('selected');
    triggerAllDataRowSelected.call (self, false);
  };

  var clearSelect = function () {
    var self = this;
    var rowSelector = 'tr.oui-table-grid-row';
    if (self.isCard) {
      rowSelector = 'dl.oui-table-grid-row';
    }
    var ouiId = self.attr ('ouiId');
    self._$columns
      .find ('#table_' + ouiId + '_all_checkbox')
      .prop ('checked', false);
    self._$rowsLockContent
      .find ("input[name='table_" + ouiId + "_checkbox']")
      .prop ('checked', true);
    self._$rowsLockContent.find (rowSelector).addClass ('selected');
    self._$rowsViewContent
      .find ("input[name='table_" + ouiId + "_checkbox']")
      .prop ('checked', false);
    self._$rowsViewContent.find (rowSelector).removeClass ('selected');
    triggerAllDataRowSelected.call (self, false);
  };

  var getRowByIndex = function (index) {
    var self = this;
    var data = self.attr ('data');
    if (!data || data.length === 0) {
      return null;
    }
    return data[index];
  };

  var findRowDomByRow = function (row) {
    var self = this;
    var $rowDom = null;
    if (row) {
      var ouiId = self.attr ('ouiId');
      var rowIndex = row['_index'];
      var trId = 'table_' + ouiId + '_tr_' + rowIndex;
      $rowDom = self._$rowsViewContent.find ('#' + trId);
      if ($rowDom.length > 0) {
        return $rowDom;
      }
    }
    return $rowDom;
  };

  var findRowBy = function (condition) {
    var self = this;
    var data = self.attr ('data');
    if (!data || data.length === 0) {
      return;
    }
    var row = null;
    var i, len;
    if (typeof condition === 'function') {
      for ((i = 0), (len = data.length); i < len; i++) {
        if (condition (data[i])) {
          row = data[i];
          break;
        }
      }
    } else if (!!(condition && 'object' === typeof condition)) {
      for ((i = 0), (len = data.length); i < len; i++) {
        var _row = data[i];
        var _flag = true;
        for (var key in condition) {
          if (_row[key] !== condition[key]) {
            _flag = false;
            break;
          }
        }
        if (_flag) {
          row = data[i];
          break;
        }
      }
    }
    return row;
  };

  var findRowsBy = function (condition) {
    var self = this;
    var data = self.attr ('data');
    if (!data || data.length === 0) {
      return;
    }
    var rows = [];
    var i, len;
    if (condition && typeof condition === 'function') {
      for ((i = 0), (len = data.length); i < len; i++) {
        if (condition (data[i])) {
          rows.push (data[i]);
        }
      }
    } else if (!!(condition && 'object' === typeof condition)) {
      for ((i = 0), (len = data.length); i < len; i++) {
        var _row = data[i];
        var _flag = true;
        for (var key in condition) {
          if (_row[key] !== condition[key]) {
            _flag = false;
          }
        }
        if (_flag) {
          rows.push (_row);
        }
      }
    }
    return rows;
  };

  var showOrHideColumn = function (param, visible) {
    var self = this;
    if (typeof param !== 'undefined') {
      var column = null;
      if (typeof param === 'number') {
        column = getColumnByIndex.call (self, param);
        setColumnsById.call (self, column['_id'], {visible: !!visible});
        self._RColumnsView (true);
        self._RRowsView ();
      } else if (typeof param === 'string') {
        setColumnsByObject.call (
          self,
          {fieldName: param},
          {visible: !!visible}
        );
        self._RColumnsView (true);
        self._RRowsView ();
      }
    }
  };

  var showOrHideColumns = function (fieldNames, visible) {
    var self = this;
    if (fieldNames && fieldNames.length > 0) {
      var fieldName = null;
      for (var i = 0, len = fieldNames.length; i < len; i++) {
        fieldName = fieldNames[i];
        setColumnsByObject.call (
          self,
          {fieldName: fieldName},
          {visible: !!visible}
        );
      }
      self._RColumnsView (true);
      self._RRowsView ();
    }
  };

  var hideColumn = function (param) {
    var self = this;
    if ($.isArray (param)) {
      showOrHideColumns.call (self, param, false);
    } else {
      showOrHideColumn.call (self, param, false);
    }
  };

  var showColumn = function (param) {
    var self = this;
    if ($.isArray (param)) {
      showOrHideColumns.call (self, param, true);
    } else {
      showOrHideColumn.call (self, param, true);
    }
  };

  var getSummaryCellEl = function (column) {};

  var scrollIntoView = function (rowIndex) {
    var self = this;
    var ouiId = self.attr ('ouiId');
    if (typeof rowIndex !== 'undefined') {
      var $scrollWrap = self._$rowsView;
      var $tableGrid = self._$tableGridView;

      //FIXME 解决移动端列表 没有配置height的情况
      if (
        $tableGrid.attr ('style') &&
        $tableGrid.attr ('style').indexOf ('height') > -1
      ) {
      } else {
        $scrollWrap = $tableGrid.closest ('.general-scrooll');
      }

      if (rowIndex + '' !== '0') {
        var trId = 'table_' + ouiId + '_tr_' + rowIndex;
        var $tr = self._$rowsViewContent.find ('#' + trId);
        if ($tr.length > 0) {
          $scrollWrap.scrollTop ($tr.position ().top);
        }
      } else {
        $scrollWrap.scrollTop (0);
      }
    }
  };

  var scrollX = function (x) {
    var self = this;
    if (arguments.length > 0) {
      self._$rowsView.scrollLeft (x);
      return x;
    } else {
      return self._$rowsView.scrollLeft ();
    }
  };

  var query = function (queryParam) {
    var self = this;
    if (self._pagerControl) {
      self._pagerControl.setQueryParam (queryParam);
      self._pagerControl.go2first ();
      self.scrollIntoView (0);
    } else {
      if (queryParam && $.isArray (queryParam)) {
        filterByQueryParam.call (self, queryParam);
      }
    }
  };

  var getDataByFieldName = function (fieldName) {
    var self = this;
    if (fieldName && (fieldName + '').length > 0) {
      var data = self.getData ();
      if (data && data.length > 0) {
        // if (data[0].hasOwnProperty(fieldName + "")) {
        var newData = [];
        var v = null;
        for (var i = 0, len = data.length; i < len; i++) {
          v = oui.JsonPathUtil.getJsonByPath (fieldName, data[i]);
          newData.push (v);
        }
        return newData;
        // } else {
        //     console.error("对象没有该字段");
        //     return [];
        // }
      }
      return [];
    }
    return [];
  };

  var getDataByFieldIndex = function (index, rowData) {
    var self = this;
    var columns = self.attr ('columnsArray');
    var columnObj = null;
    if (!isNaN (index) && Number (index) > -1) {
      columnObj = columns[index];
      var fieldName = columnObj['fieldName'];
      if (fieldName) {
        var v = null;
        if (rowData) {
          v = oui.JsonPathUtil.getJsonByPath (fieldName, rowData);
          return v;
        } else {
          var data = self.getData ();
          if (data && data.length > 0) {
            // if (data[0].hasOwnProperty(fieldName + "")) {
            var newData = [];
            for (var i = 0, len = data.length; i < len; i++) {
              v = oui.JsonPathUtil.getJsonByPath (fieldName, data[i]);
              newData.push (v);
            }
            return newData;
          }
        }
        return null;
      }
      return null;
    } else {
      return null;
    }
  };

  var getRowDataByRow = function (row, isEdit) {
    if (row) {
      var self = this;
      var editColumnsArray = self.attr ('editColumnsArray');
      var newObj = {};
      var j, jLen;
      if (typeof isEdit !== 'undefined' && isEdit) {
        for ((j = 0), (jLen = editColumnsArray.length); j < jLen; j++) {
          var fieldName = editColumnsArray[j]['fieldName'];
          newObj[fieldName] = row[fieldName];
        }
        for ((j = 0), (jLen = rowKeys.length); j < jLen; j++) {
          newObj[rowKeys[j]] = row[rowKeys[j]];
        }
        newObj = $.extend (true, {}, newObj); //rowDataObjectFilter(newObj);
      } else {
        newObj = $.extend (true, {}, row);
      }
      return newObj;
    } else {
      return null;
    }
  };

  var findControlByRowAndfieldName = function (rowData, fieldName) {
    var columnsArray = this.attr ('columnsArray');
    var columnsField = null;
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (fieldName === columnsArray[i]['fieldName']) {
        columnsField = columnsArray[i];
        break;
      }
    }
    var rowIndx = getRowIndexByRow.call (this, rowData);
    var cellIndex = -1;
    if (columnsField) {
      cellIndex = columnsField['_index'];
    }
    var ouiFormId =
      this.attr ('id') + 'rows' + rowIndx + 'cell' + cellIndex + '_control';
    return oui.getById (ouiFormId);
  };

  var getColumnIndex = function (_id) {
    var self = this;
    var columns = self.attr ('columns');
    var columnObj = null;
    if (_id || _id === 0) {
      for (var i = 0, len = columns.length; i < len; i++) {
        columnObj = columns[i];
        if (columnObj['_id'] === _id) {
          return i;
        }
      }
    }
    return -1;
  };

  var parseColumnByDom = function (obj) {
    var column = {};
    var $child = $ (obj);
    column['_level'] = 0;
    //循环所有的列的属性key，并从html配置中去获取属性值，如果是有属性值就使用html配置的，如果没有则使用默认的属性值
    for (var key in defaultColumnAttrs) {
      if (key === 'align' || key === 'headerAlign') {
        var align = $child.attr (key);
        if (typeof align === 'undefined') {
          var dataType = $child.attr ('dataType');
          if (dataType && dataType.toLocaleLowerCase () === 'number') {
            align = 'right';
          } else {
            align = defaultColumnAttrs[key];
          }
        }
        column[key] = align;
      } else {
        column[key] = typeof $child.attr (key) === 'undefined'
          ? defaultColumnAttrs[key]
          : $child.attr (key);
      }
    }
    if ($child.is ('oui-column')) {
      // if ($child.find("oui-columns").length > 0) {//如果含有下子列配置
      //     column.header = $child.contents().filter(function () {
      //             return this.nodeType === 3;
      //         }).text().replace(/\r/g, "").replace(/\n/g, "").replace(/\s/g, "") || "";// 获取主节点的文本
      //     //递归获取下一子列配置
      //     column.columns = [];
      //     _parseColumnsByTag(column.columns, $child.children(), level + 1);
      // } else {
      if ($child.find (oui.$.constant.controlTagName).length > 0) {
        column.$ouiControlDom = $child.find (oui.$.constant.controlTagName)[0];
        $child.find (oui.$.constant.controlTagName).remove ();
      } else {
        column.$ouiControlDom = null;
      }
      column.otherAttrs = oui.parseJson ($child.attr ('otherAttrs') || '{}');
      var fieldName = $child.attr ('fieldName');

      column.header = $child.html ();

      column['fieldName'] = fieldName;
      // }
    } else if ($child.is (SpecialColumns.INDEX_COLUMN.tag)) {
      column.columnType = SpecialColumns.INDEX_COLUMN.type;
      column.header = $child.html ();
    } else if ($child.is (SpecialColumns.CHECKBOX_COLUMN.tag)) {
      column.columnType = SpecialColumns.CHECKBOX_COLUMN.type;
    } else if ($child.is (SpecialColumns.RADIO_COLUMN.tag)) {
      column.columnType = SpecialColumns.RADIO_COLUMN.type;
    }
    return column;
  };

  var addColumn = function (column, index) {
    var self = this;
    var level = self.attr ('maxHeaderLevel');
    if (level !== 0) {
      return;
    }
    if (typeof column === 'string') {
      column = parseColumnByDom (column);
    }
    if (!column) {
      return;
    }

    var newColumnObj = $.extend (true, {}, defaultColumnAttrs, column);

    var columns = self.attr ('columns');
    if (index === -1) {
      columns.splice (0, 0, newColumnObj);
    } else if (index || index === 0) {
      columns.splice (index + 1, 0, newColumnObj);
    } else {
      columns.push (newColumnObj);
    }
    _parseColumnsIdByArray (0, 0, -1, columns, 0);
    var columnsArray = [];
    var columnsFieldsArray = [];
    var columnsMap = {};
    var editColumnsArray = [];
    _parseColumnsPutArrayAndMap (
      columnsArray,
      columnsFieldsArray,
      columnsMap,
      columns,
      editColumnsArray
    );
    self.attr ('maxHeaderLevel', level);
    self.attr ('columns', columns);
    self.attr ('columnsFieldsArray', columnsFieldsArray);
    self.attr ('columnsArray', columnsArray);
    self.attr ('editColumnsArray', editColumnsArray);
    self.attr ('columnsMap', columnsMap);

    self._RColumnsView ();
    self._RRowsView ();
  };

  var deleteColumnByIndex = function (index) {
    var self = this;
    var level = self.attr ('maxHeaderLevel');
    if (level !== 0) {
      return;
    }
    var columns = self.attr ('columns');
    if (index || index === 0) {
      columns.splice (index, 1);
    }
    _parseColumnsIdByArray (0, 0, -1, columns, 0);
    var columnsArray = [];
    var columnsFieldsArray = [];
    var columnsMap = {};
    var editColumnsArray = [];
    var edit4ReadOnlyColumnsArray = [];
    _parseColumnsPutArrayAndMap (
      columnsArray,
      columnsFieldsArray,
      columnsMap,
      columns,
      editColumnsArray,
      edit4ReadOnlyColumnsArray
    );
    self.attr ('maxHeaderLevel', level);
    self.attr ('columns', columns);
    self.attr ('columnsFieldsArray', columnsFieldsArray);
    self.attr ('columnsArray', columnsArray);
    self.attr ('editColumnsArray', editColumnsArray);
    self.attr ('edit4ReadOnlyColumnsArray', edit4ReadOnlyColumnsArray);
    self.attr ('columnsMap', columnsMap);

    self._RColumnsView ();
    self._RRowsView ();
  };

  var deleteColumn = function (_id) {
    var self = this;
    if (!_id) {
      return;
    }
    var index = self.getColumnIndex (_id);
    deleteColumnByIndex.call (self, index);
  };

  var setColumnContextMenu = function (config) {
    var self = this;
    self.attr ('columnContextMenu', config);
    if (config) {
      var html = '';
      var bindings = {};
      var count = 0;
      for (var key in config) {
        var cfgObj = config[key];
        html += "<li id='" + key + "'>" + cfgObj['title'] + '</li>';
        bindings[key] = (function (cfgObj) {
          return function (t) {
            cfgObj['callback'].call (self, $ (t).parent ());
          };
        }) (cfgObj);
        count++;
      }
      if (count > 0) {
        self._$columns.find ('#ouiTableColumnContextMenu ul').html (html);
        var $trTwo = self._$columnsView.find ('.oui-grid-table tr').eq (1);
        $trTwo
          .find ('.header-cell-outer')
          .contextMenu ('ouiTableColumnContextMenu', {
            bindings: bindings,
          });
      }
    }
  };

  var getColumnWidthByFieldName = function (fieldName) {
    var columnsArray = this.attr ('columnsArray');
    var columnsField = null;
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (fieldName === columnsArray[i]['fieldName']) {
        columnsField = columnsArray[i];
        break;
      }
    }
    if (columnsField) {
      return columnsField['width'] || 0;
    } else {
      return 0;
    }
  };

  var findAllColumns = function () {
    return this.attr ('columnsArray');
  };

  var findFieldValueByRowAndTitle = function (row, title) {
    if (row && title) {
      var columns = this.attr ('columnsArray');
      var column = null;
      for (var i = 0, len = columns.length; i < len; i++) {
        if (columns[i].headerTitle + '' === title + '') {
          column = columns[i];
          break;
        }
      }
      if (column) {
        var fieldValue = row[column['fieldName']];
        if (column.$ouiControlDom) {
          fieldValue = fieldValue.value;
        }
        return fieldValue;
      }
    }
    return null;
  };

  var toggleNumColumn = function () {
    var self = this;
    var showNumColumn = self.attr ('showNumColumn');
    var columnsArray = self.attr ('columnsArray') || [];
    var indexColumn = null;
    for (var i = 0, len = columnsArray.length; i < len; i++) {
      if (columnsArray[i].columnType === SpecialColumns.INDEX_COLUMN.type) {
        indexColumn = columnsArray[i];
        break;
      }
    }
    if (showNumColumn + '' === 'true') {
      if (!indexColumn) {
        addColumn.call (
          self,
          '<oui-column-index width="70" >序号</oui-column-index>',
          -1
        );
      }
    } else {
      if (indexColumn) {
        deleteColumnByIndex.call (self, indexColumn['_index']);
      }
    }
  };

  function handleNull (valueArray) {
    var newArray = [];
    if (valueArray && valueArray.length > 0) {
      var _v = null;
      for (var i = 0, len = valueArray.length; i < len; i++) {
        _v = valueArray[i];
        if (_v !== null && _v !== '' && _v !== undefined) {
          newArray.push (_v);
        }
      }
    }
    return newArray;
  }

  function toThousands (nStr) {
    nStr += '';
    var x = nStr.split ('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test (x1)) {
      x1 = x1.replace (rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  function formatNumber (format, text, dotNum) {
    var formatType = format;
    if (
      formatType &&
      formatType.length > 0 &&
      (text !== null &&
        typeof text !== 'object' &&
        typeof text !== 'undefined' &&
        text !== '')
    ) {
      if (!isNaN (text)) {
        text = Number (text + '');
        if (formatType === ',') {
          //千分位
          text = toThousands (text);
        } else if (formatType === '%') {
          //百分数
          var sText = text + '';
          var sArray = [];
          var _dotNum = 0;
          if (sText.indexOf ('.') > 0) {
            sArray = sText.split ('.');
            _dotNum = sArray[1].length - 2;
            if (_dotNum <= 0) {
              _dotNum = 0;
            }
          }
          if (
            dotNum !== null &&
            typeof dotNum !== 'undefined' &&
            dotNum !== '' &&
            dotNum + '' !== '-1'
          ) {
            _dotNum = Number (dotNum);
          }
          text = (text * 100).toFixed (_dotNum) + '%';
        }
      }
    } else {
      if (
        dotNum !== null &&
        typeof dotNum !== 'undefined' &&
        dotNum !== '' &&
        dotNum + '' !== '-1' &&
        (text !== null &&
          typeof text !== 'object' &&
          typeof text !== 'undefined' &&
          text !== '')
      ) {
        text = text.toFixed (Number (dotNum));
      }
    }
    return text;
  }
}) (window, window.oui, window.jQuery);
