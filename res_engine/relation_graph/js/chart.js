var vm = new Vue({
  el: "#app",
  template: '<div id="drawDiv" style="height: 100%; display: flex; justify-content: flex-end">' +
    '        <div class="left-content" @mouseup="mouseUp">' +
    '         <div class="left-content-parent">' +
    '           <div class="drag-window" v-for="item in modelData"><h3>{{item.name}}</h3><div v-for="item1 in item.content" :id="item1.id" class="left-sub-title">{{item1.name}}</div></div>' +
    '             <div v-show="isDragging" class="show-div" ref="controlNode">{{showName}}</div>' +
    '         </div>' +
    '        </div>' +
    '         <div class="point-parent" id="points-parent" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp">' +
    '        <div class="panel-body points demo flow_chart" id="points" :style="calZoom" style="top: 0;left: 0;" ref="canvas">' +
    '          <div v-for="(val, point) in data.formMap" :id="point" class="point" :style="calPosition(point, val)">' +
    '            <div :id="`drag-${point}`" style="padding:0 0.5em; background: #409EFF; cursor: default; display: flex; justify-content: space-between"><span class="name-change" style="font-size: 12px;">{{val.name}}</span></div>' +
    '            <div class="add-content">' +
    '              <div v-for="(val1, m) in val.fieldMap" title="拖动可以进行连线" style="color:black; border-top: 1px solid #cccccc;display: flex;padding: 0 0.8em; justify-content: space-between" :id="point + \'-\' + m"><div class="param-name" style="font-size: 12px">{{val1.name}}</div></div>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '        </div>' +
    '         <div class="bottom-menu">' +
    '         <el-button type="primary" @click="saveChange" >保 存</el-button>' +
    '         <el-button @click="cancelChange" >重 置</el-button>' +
    '           </div>' +
    '        <el-dialog' +
    '                title="关联设置"' +
    '                :visible.sync="editVisible"' +
    '                 size="mini"' +
    '                 width="30%">' +
    '            <el-form v-if="tableForm" size="mini" ref="tableForm" :model="tableForm" label-width="100">' +
    '                <el-form-item prop="name" label="子表名：">' +
    '                    <el-input v-model="data.formMap[tableForm.formId].name" readonly/>' +
    '                </el-form-item>' +
    '                <el-form-item label="子表关联字段">' +
    '                  <el-input v-model="data.formMap[tableForm.formId].fieldMap[tableForm.fieldId].name" readonly/>' +
    '                </el-form-item>' +
    '              <el-form-item label="父表名：">' +
    '                <el-input v-model="data.formMap[tableForm.targetFormId].name" readonly/>' +
    '              </el-form-item>' +
    '              <el-form-item label="父表关联字段">' +
    '                <el-input v-model="data.formMap[tableForm.targetFormId].fieldMap[tableForm.targetFieldId].name" readonly/>' +
    '              </el-form-item>' +
    '              <el-form-item  label="父表关联显示字段">' +
    '                <el-select style="width: 100%" v-model="tableForm.targetDisplayFieldId" @change="changeSelect">' +
    '                  <el-option v-for="(val, key) in data.formMap[tableForm.targetFormId].fieldMap" :key="key" :value="val.id" :label="val.name"></el-option>' +
    '                </el-select>' +
    '              </el-form-item>' +
    '              <el-form-item  label="连线类型">' +
    '                <el-select style="width: 100%" v-model="tableForm.lineType" :disabled="optionChoose">' +
    '                  <el-option key="1" :value="1" label="关联">关联</el-option>' +
    '                  <el-option key="2" :value="2" label="推送">推送</el-option>' +
    '                </el-select>' +
    '              </el-form-item>' +
    '            </el-form>' +
    '            <div slot="footer" class="dialog-footer">' +
    '                <el-button size="mini" @click="editCancel">取 消</el-button>' +
    '                <el-button size="mini" type="danger" @click="deleteConnection">删 除</el-button>' +
    '                <el-button size="mini" type="primary" @click="tableChange">确 定</el-button>' +
    '            </div>' +
    '        </el-dialog>' +
    '    </div>',
  data: {
    lineAttr: {},
    overlay: null,
    newElements: null,
    newNodeEvent: null,
    isDragging: false,
    instance: {},
    isMoving: false,
    zoom: 1,
    currentPosition: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    lastMove: { x: 0, y: 0 },
    showName: '',
    tableForm: null,
    currentItem: 0,
    currentConn: null,
    editVisible: false,
    dialogVisible: false,
    // 左侧菜单
    modelData: [
      {
        id: 1,
        name: '公共信息模型',
        content: [{ id: 111, name: '数据字典' }, { id: 112, name: '公共数据源' }, { id: 113, name: '业务配置表' }, {
          id: 114, name: '组织模型'
        }, { id: 115, name: '角色模型' }, { id: 116, name: '权限模型' }, { id: 117, name: '人员模型' }]
      }, {
        id: 1,
        name: '业务模型',
        content: [{ id: 121, name: '客户信息表' }, { id: 122, name: '客户订单表' }]
      }, {
        id: 1,
        name: '业务组合模型',
        content: [{ id: 131, name: '客户订单物流信息表' }]
      }
    ],
    defaultProps: {
      children: 'content',
      label: 'name'
    },
    // 假数据
    data: {
      formIds: [],//表单的id列表
      formMap: { //以表单的id作为key的表单Map结构
        1: {
          name: '表单一',
          fieldIds: [1, 2],//字段id列表
          fieldMap: {//以字段id为key的字段map
            1: {
              id: 1, //字段id
              bizId: 'column1',//业务id，表字段名
              name: '表一第一列',//字段中文名
              otherAttrs: { //其它属性中
                targetLines: [{ // 连线都放到起点节点上，数组json结构存储,目标节点连线,支持多个
                  lineId: '1_1_2_2_1',// 联系id规则 ${formId}_${fieldId}_${targetFormId}_${targetFieldId}_${lineType};
                  lineType: 1,// 连线类型 1.关联;2.推送
                  //连线规则1：起点是本表字段，终点是他表字段，箭头都指向他表
                  //联系规则2：关联连线用实线，推送连线用虚线，连线颜色和样式进行区分
                  formId: 1,//本表表单id
                  fieldId: 1,//本表字段id
                  targetFormId: 2,//目标表单id
                  targetFieldId: 2,//目标字段id
                  targetDisplayFieldId: null
                }]
              }
            },
            2: {
              id: 1, //字段id
              bizId: 'column2',//业务id，表字段名
              name: '表一第二列',//字段中文名
              otherAttrs: { //其它属性中
                targetLines: []
              }
            }
          }
        },
        2: {
          name: '表单二',
          fieldIds: [1, 2],//字段id列表
          fieldMap: {//以字段id为key的字段map
            1: {
              id: 1, //字段id
              bizId: 'column1',//业务id，表字段名
              name: '第二表第一列',//字段中文名
              otherAttrs: {
                targetLines: []
              }
            },
            2: {
              id: 2, //字段id
              bizId: 'column2',//业务id，表字段名
              name: '第二表第二列',//字段中文名
              otherAttrs: { //其它属性中
                targetLines: []
              }
            },
          },
        },
      },
      lineIds: [],//联系id列表,所有字段连线,规则为 ${formId}_${fieldId}_${targetFormId}_${targetFieldId}_${lineType}
    }
  },
  created(){
    // 请求数据
    console.log(this.data)
  },
  mounted(){
    jsPlumb.ready(() => {
      this.createFlow(this.data);
    });
    document.onmousewheel = (e) => {
      if (e.target.id === 'points-parent' || e.target.id === 'points'){
        this.setZoom(e);
      }
    }
  },
  computed: {
    calZoom(e){
      if (e > 0){
        this.zoom += 0.1
      }else if (e < 0){
        this.zoom -= 0.1
      }
      let z = {
        "-webkit-transform": `scale(${this.zoom.toFixed(1)})`,
        "-moz-transform": `scale(${this.zoom.toFixed(1)})`,
        "-ms-transform": `scale(${this.zoom.toFixed(1)})`,
        "-o-transform": `scale(${this.zoom.toFixed(1)})`,
        "transform": `scale(${this.zoom.toFixed(1)})`
      };
      console.log(this.zoom);
      return z;
    },
    optionChoose(){
      let connectionList = vm.instance.getAllConnections();
      let repeat = false;
      connectionList.map(function (item){
        if (item.sourceId === vm.currentConn.sourceId && item.getOverlay("label").label === '关联' && vm.currentConn.getOverlay("label").label === '推送'){
          repeat = true;
          return;
        }
        if (item.targetId === vm.currentConn.targetId && item.getOverlay("label").label === '推送' && vm.currentConn.getOverlay("label").label === '关联'){
          repeat = true;
          return;
        }
      });
      return repeat;
    },
  },
  methods: {
    mouseUp(e){
      if (this.isMoving){
        this.lastPosition = { x: this.$refs.canvas.style.left, y: this.$refs.canvas.style.top }
        this.$refs.canvas.style.cursor = 'default';
        this.isMoving = false;
      }
      ;
    },
    mouseDown(e){
      this.isMoving = true
      this.currentPosition.x = e.x;
      this.currentPosition.y = e.y;
      this.lastMove.x = e.x;
      this.lastMove.y = e.y;
    },
    mouseMove(e){
      if (this.isMoving){
        this.$refs.canvas.style.cursor = 'grabbing';
        this.$refs.canvas.style.left = parseInt(this.lastPosition.x) + e.x - this.currentPosition.x + 'px';
        this.$refs.canvas.style.top = parseInt(this.lastPosition.y) + e.y - this.currentPosition.y + 'px';
        if (parseInt(this.$refs.canvas.style.left) < 0-(this.$refs.canvas.getBoundingClientRect().width - this.$refs.canvas.offsetWidth) / 2){
          this.$refs.canvas.style.left = (this.$refs.canvas.offsetWidth - this.$refs.canvas.getBoundingClientRect().width)/2 + 'px';
        }
        if (parseInt(this.$refs.canvas.style.left) > (this.$refs.canvas.getBoundingClientRect().width - this.$refs.canvas.offsetWidth) / 2){
          this.$refs.canvas.style.left = (this.$refs.canvas.getBoundingClientRect().width - this.$refs.canvas.offsetWidth) / 2 + 'px';
        }
        if (parseInt(this.$refs.canvas.style.top) < 0-(this.$refs.canvas.getBoundingClientRect().height - this.$refs.canvas.offsetHeight) / 2){
          this.$refs.canvas.style.top = (this.$refs.canvas.offsetHeight - this.$refs.canvas.getBoundingClientRect().height)/2 + 'px';
        }
        if (parseInt(this.$refs.canvas.style.top) > (this.$refs.canvas.getBoundingClientRect().height - this.$refs.canvas.offsetHeight) / 2){
          this.$refs.canvas.style.top = (this.$refs.canvas.getBoundingClientRect().height - this.$refs.canvas.offsetHeight) / 2 + 'px';
        }
      }
    },
    setZoom(e){
      if (e.deltaY < 0 && this.zoom < 2){
        this.zoom = this.zoom + 0.1
      }else if (e.deltaY > 0 && this.zoom > 1){
        this.$refs.canvas.style.left = '0px';
        this.$refs.canvas.style.top = '0px';
        this.lastPosition = {x:0, y:0};
        this.zoom = this.zoom - 0.1
      }else{
        return;
      }
    },
    cancelChange(){
      location.reload();
    },
    // 没有坐标生成1000 X 500 的随机坐标
    calPosition(point, val){
      if (val.x !== undefined && val.y !== undefined){
        return { left: val.x + '%', top: val.y + '%' }
      }else{
        let randomX = Math.ceil(Math.random() * 70);
        let randomY = Math.ceil(Math.random() * 70);
        this.data.formMap[point].x = randomX;
        this.data.formMap[point].y = randomY;
        return { left: randomX + '%', top: randomY + '%' }
      }
    },
    changeSelect(e){
      console.log(this.tableForm.targetDisplayFieldId);
      console.log(this.data.formMap[this.tableForm.targetFormId].fieldMap);
    },
    editCancel(){
      this.editVisible = false;
      this.tableForm = null;
    },
    tableChange(){
      // 保存修改后连线
      this.editVisible = false;
      this.currentConn.getOverlay("label").setLabel(this.tableForm.lineType === 1 ? '关联' : '推送');
      this.currentConn.setPaintStyle({ strokeWidth: 1, stroke: this.tableForm.lineType === 2 ? "#67C23A" : '#409EFF' });
      this.currentConn.setHoverPaintStyle({
        strokeWidth: 3,
        stroke: this.tableForm.lineType === 2 ? "#85ce61" : '#66b1ff'
      });
      this.tableForm.lineId = (this.tableForm.formId + '_' + this.tableForm.fieldId + '_' + this.tableForm.targetFormId + '_' + this.tableForm.targetFieldId + '_' + this.tableForm.lineType);
    },
    cancel(){
      this.dialogVisible = false;
    },
    // 增加字段项
    editTable(conn){
      let vm = this;
      vm.editVisible = true;
      vm.currentConn = conn;
      vm.data.formMap[conn.sourceId.split('-')[0]].fieldMap[conn.sourceId.split('-')[1]].otherAttrs.targetLines.forEach(element => {
        if (element.targetFormId == conn.targetId.split('-')[0] && element.targetFieldId == conn.targetId.split('-')[1]){
          vm.currentItem = vm.data.formMap[conn.sourceId.split('-')[0]].fieldMap[conn.sourceId.split('-')[1]].otherAttrs.targetLines.indexOf(element);
          vm.tableForm = element
        }
      })
    },
    deleteConnection(){
      let vm = this;
      vm.instance.deleteConnection(vm.currentConn);
      if (vm.data.formMap[vm.currentConn.sourceId.split('-')[0]].fieldMap[vm.currentConn.sourceId.split('-')[1]].otherAttrs.targetLines.splice(vm.currentItem, 1)){
        vm.editVisible = false;
        this.$message({
          message: '删除成功，请先保存，否则刷新页面后无效',
          type: 'success'
        });
      }else{
        this.$message({
          message: '删除错误',
          type: 'error'
        });
      }

    },
    saveChange(){
      console.log(this.data)
    },
    createFlow(){
      let vm = this;
      const color = '#409EFF';
      window.s = vm.instance = jsPlumb.getInstance({
        // notice the 'curviness' argument to this Bezier curve.
        // the curves on this page are far smoother
        // than the curves on the first demo, which use the default curviness value.
        Connector: ['Flowchart', { curviness: 50 }],
        DragOptions: { cursor: 'pointer', zIndex: 5000 },
        PaintStyle: { lineWidth: 5, stroke: color },
        HoverPaintStyle: { stroke: '#66b1ff', lineWidth: 20 },
        deleteEndpointsOnDetach: false,
        Container: 'points',
        Endpoint: ['Blank', { radius: 12 }],
        EndpointStyle: {
          stroke: "#aaa",
          fill: "#F2F2F2",
          radius: 3,
          strokeWidth: 1
        },
        ConnectionOverlays: [
          [
            "Arrow",
            {
              location: 1,
              visible: true,
              width: 11,
              length: 11,
              id: "ARROW",
            }
          ],
          [
            "Label",
            {
              location: 0.5,
              label: '关联',
              visible: true,
              id: "label",
              cssClass: "aLabel",
            }
          ]]
      });
      vm.instance.draggable(document.querySelectorAll('.point'), {
        containment: 'points',
        // 拖拽后改变位置
        stop: function (e){
          vm.data.formMap[e.el.id].x = (e.pos[0] / e.el.parentNode.offsetWidth).toFixed(2) * 100;
          vm.data.formMap[e.el.id].y = (e.pos[1] / e.el.parentNode.offsetHeight).toFixed(2) * 100;
        }
      });
      vm.instance.draggable(document.querySelectorAll('.left-sub-title'), {
        helper: 'clone',
        scope: 'ss',
        drag: function (e){
          vm.isDragging = true;
          vm.showName = e.el.textContent;
          vm.$refs.controlNode.style.left = e.el.style.left;
          vm.$refs.controlNode.style.top = e.el.style.top;
        }
      });
      // 拖拽新增
      vm.instance.droppable('points', {
        scope: 'ss',
        drop: function (event){
          let leftP = ((event.e.x - event.drag.el.offsetWidth) / event.drop.el.offsetWidth).toFixed(2) * 100;
          let topP = (event.e.y / event.drop.el.offsetHeight).toFixed(2) * 100;
          vm.$set(vm.data.formMap, event.drag.el.id, {
            x: leftP,
            y: topP,
            name: event.drag.el.textContent,
            fieldIds: [1, 2],//字段id列表
            fieldMap: {//以字段id为key的字段map
              1: {
                id: 1, //字段id
                bizId: 'column1',//业务id，表字段名
                name: 'xxx',//字段中文名
                otherAttrs: { //其它属性中
                  targetLines: [],
                }
              }
            },
          });
          vm.isDragging = false;
          vm.showName = '';
          vm.$nextTick(() => {
            vm.addNew();
          });
        }
      });
      vm.setjsPlumbAttr();
    },
    addNew(){
      // 为新的表添加事件
      let lastIndex = Object.keys(vm.data.formMap).length - 1
      let lastNode = vm.data.formMap[Object.keys(vm.data.formMap)[lastIndex]];
      vm.instance.draggable(document.querySelectorAll('.point')[lastIndex], {
        containment: 'points',
        // 拖拽后改变位置
        stop: function (e){
          vm.data.formMap[e.el.id].x = (e.pos[0] / e.el.parentNode.offsetWidth).toFixed(2) * 100;
          vm.data.formMap[e.el.id].y = (e.pos[1] / e.el.parentNode.offsetHeight).toFixed(2) * 100;
        }
      });
      vm.instance.batch(() => {
        for (const m in lastNode.fieldMap){
          vm.instance.makeSource(Object.keys(vm.data.formMap)[lastIndex] + '-' + m, {
            anchor: ["Continuous", { faces: ["left", "right"] }],
            endpoint: 'Dot',
          });
          vm.instance.makeTarget(Object.keys(vm.data.formMap)[lastIndex] + '-' + m, {
            anchor: ["Continuous", { faces: ["left", "right"] }],
            allowLoopback: false
          });
        }
      })
    },
    setjsPlumbAttr(){
      // suspend drawing and initialise.
      vm.instance.batch(() => {
        // init point
        for (const point in vm.data.formMap){
          for (const m in vm.data.formMap[point].fieldMap){
            vm.instance.makeSource(point + '-' + m, {
              anchor: ["Continuous", { faces: ["left", "right"] }],
              endpoint: 'Dot',
            });
            vm.instance.makeTarget(point + '-' + m, {
              anchor: ["Continuous", { faces: ["left", "right"] }],
              allowLoopback: false
            });
          }
        }
        // init transition
        for (const i in vm.data.formMap){
          // 有关系表
          for (const p in vm.data.formMap[i].fieldMap){
            let targetLines = vm.data.formMap[i].fieldMap[p].otherAttrs.targetLines;
            if (targetLines && targetLines.length > 0){
              for (const line in targetLines){
                vm.instance.connect({
                  source: targetLines[line].formId + '-' + targetLines[line].fieldId,
                  target: targetLines[line].targetFormId + '-' + targetLines[line].targetFieldId,
                  paintStyle: { strokeWidth: 1, stroke: targetLines[line].lineType === 1 ? '#409EFF' : '#67C23A' },
                  hoverPaintStyle: { stroke: targetLines[line].lineType === 1 ? '#66b1ff' : '#85ce61', strokeWidth: 3 },
                  overlays: [
                    [
                      "Arrow",
                      {
                        location: 1,
                        visible: true,
                        width: 11,
                        length: 11,
                        id: "ARROW",
                      }
                    ], [
                      "Label",
                      {
                        location: 0.5,
                        label: targetLines[line].lineType === 1 ? '关联' : '推送',
                        visible: true,
                        id: "label",
                        cssClass: "aLabel",
                      }
                    ]]
                });
              }
            }
          }
        }
        vm.instance.bind('click', function (conn, originalEvent){
          vm.editTable(conn);
        });
        vm.instance.bind('beforeDrop', function (conn){
          if (conn.sourceId.split('-')[0] === conn.targetId.split('-')[0]){
            vm.$message({
              message: '同表字段不能相连 ！',
              type: 'error'
            });
            return false;
          }
          vm.lineAttr = {
            lineId: (conn.sourceId + '_' + conn.targetId + '_1').replace(/-/g, '_'),
            lineType: 1,
            formId: parseInt(conn.sourceId.split('-')[0]),
            fieldId: parseInt(conn.sourceId.split('-')[1]),
            targetFormId: parseInt(conn.targetId.split('-')[0]),
            targetFieldId: parseInt(conn.targetId.split('-')[1]),
            targetDisplayFieldId: null
          }
          // 连线时判断是否已经有一根连线，每一个字段只能有一根关联类型的连线，其余均为推送
          let lineTargetLength = vm.data.formMap[conn.sourceId.split('-')[0]].fieldMap[conn.sourceId.split('-')[1]].otherAttrs.targetLines.length
          if (lineTargetLength < 1){
            // 该字段还没有连线时
          }else{
            // 有一条或多条时，需要判断
            let lineTypeOneTime = 0;
            let lineTypeTwoTime = 0;
            vm.data.formMap[conn.sourceId.split('-')[0]].fieldMap[conn.sourceId.split('-')[1]].otherAttrs.targetLines.map(function (item){
              if (item.lineType === 1){
                lineTypeOneTime++;
              }else{
                lineTypeTwoTime++;
              }
            });
            if (lineTypeOneTime > 0){
              // 出现至少一次的关联连线时， 下次的连线一定是推送
              vm.lineAttr.lineType = 2;
              vm.lineAttr.lineId = (conn.sourceId + '_' + conn.targetId + '_2').replace(/-/g, '_');
            }
            conn.connection.getOverlay("label").setLabel(vm.lineAttr.lineType === 1 ? '关联' : '推送');
            conn.connection.setPaintStyle({
              strokeWidth: 1,
              stroke: vm.lineAttr.lineType === 2 ? "#67C23A" : '#409EFF'
            });
            conn.connection.setHoverPaintStyle({
              strokeWidth: 3,
              stroke: vm.lineAttr.lineType === 2 ? "#85ce61" : '#66b1ff'
            });
          }
          let repeat = true;
          let connectionList = vm.instance.getAllConnections();
          connectionList.map(function (item){
            if (item.targetId === conn.targetId && item.getOverlay("label").label === '推送' && conn.connection.getOverlay("label").label === '推送'){
              repeat = false
              vm.$message({
                message: '一个字段只可以被推送一次 ！',
                type: 'error'
              });
              return;
            }
            if (item.targetId === conn.sourceId && item.sourceId === conn.targetId){
              repeat = false
              vm.$message({
                message: '两个字段之间不能相互连线 ！',
                type: 'error'
              });
              return;
            }
            if (item.targetId === conn.targetId && item.sourceId === conn.sourceId){
              repeat = false
              vm.$message({
                message: '相同的两个字段只能有一种关系 ！',
                type: 'error'
              });
              return;
            }
          })
          return repeat;
        });
        vm.instance.bind("connection", function (connInfo, originalEvent){
          vm.data.formMap[connInfo.connection.sourceId.split('-')[0]].fieldMap[connInfo.connection.sourceId.split('-')[1]].otherAttrs.targetLines.push(vm.lineAttr);
          vm.$message({
            message: '连接成功，请保存！！',
            type: 'success'
          });
        });
      });
      vm.instance.fire('jsPlumbDemoLoaded', vm.instance);
    }
  }

});
