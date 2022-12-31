<script type="text/html" id="flow-tpl-contextMenus">
    {{if isLine}}
        {{if FlowBiz.isEdit}}
            <div class="flow-ui-contextMenus">
            <ul class="flow-ul-operation">
              <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2setAutoBranch">
                <span class="auto"></span>
                <i>自动分支条件</i>
              </li>
              <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2setSelectBranch">
                 <span class="manual"></span>
                 <i>手动选择分支</i>
              </li>
              <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2deleteBranch">
                  <span class="delete"></span>
                  <i>删除分支条件</i>
              </li>
            </ul>
            </div>
        {{/if}}
    {{/if}}

	{{if (FlowBiz.isEdit)&& (!isLine)}}
	<div class="flow-ui-contextMenus">
	<ul class="flow-ul-operation">
      <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2addNode">
        <span class="childNode"></span>
        <i>添加节点</i>
      </li>
      {{if isRoot }}
        {{if !FlowBiz.design4Runtime}}
        <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2editProp">
      		<span class="edit"></span>
      		<i>编辑</i>
      	</li>
      	{{/if}}
      {{/if}}
      {{if (!isRoot)&&(!node.isJoin)}}
		  <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2addBrotherNode">
			<span class="brotherNode"></span>
			<i>添加同级节点</i>
		  </li>

		  <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2editProp">
			<span class="edit"></span>
			<i>编辑</i>
		  </li>
		  <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2replaceNode">
			<span class="replace"></span>
			<i>替换</i>
		  </li>
		  <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2delCurrNode">
          	<span class="delete"></span>
          	<i>删除节点</i>
          </li>
      {{/if}}
      <li nodeId="{{nodeId}}" oui-e-{{menuClick}}="event2cancelEditProp" class="operation-cancel">
        <span class=""></span>
        <i>取消</i>
      </li>
    </ul>
    </div>
    {{/if}}
    <!-- 运行态流程 点击模板  意见列表 如果是多人节点 则需要显示 多人状态 -->
    {{if !FlowBiz.isEdit }}
    {{include 'flow-tpl-handle'}}
    {{/if}}

</script>
<script type="text/html" id="flow-tpl-branchSetting">

	    {{if !oui.os.mobile}}
    		<style type="text/css">
    		.oui-dialog-bd{
    		    padding:15px 15px 0 15px;
    		}
            .flow-ui-nodeProps-nodeBranch{
                width: 100%;
                text-align: left;
                font-size: 14px;
                color:#515151;
                overflow:hidden;
                margin-bottom:10px;
            }
            .flow-ui-nodeProps-nodeBranch .oui-class-condition-3 .group-condition-area .oui-condition-content ul.oui-condition-root {
                 max-height:215px;
                 overflow-y:auto;
            }
            .flow-ui-nodeProps-nodeBranch .oui-class-condition-3 .group-condition-area{
                max-width: 660px;
                min-width: 660px;
                }
            </style>
    	{{/if}}
        <div class="flow-ui-nodeProps-nodeBranch">
        		<span class="nodeProps-title">分支描述信息：</span>
        		<div id="condition4branch-error" class="error-info"></div>
        		<span class="nodeProps-option">
        			<oui-form type="textarea" id="nodeBranchDes" otherAttrs="{title:'分支描述'}" name="nodeBranchDes" value="{{(node.branchObject&&node.branchObject)?node.branchObject.des:''}}"></oui-form>
        		</span>
        </div>
        {{if FlowBiz.isAutoBranch}}
        <div class="flow-ui-nodeProps-nodeBranch">
            <span class="nodeProps-title">分支条件：</span>
            <div id="condition4branch-error-condition" class="error-info"></div>
            <oui-condition id="condition4branch" showType="3" type="condition"
                                                        align="center"
                                                        useOrRule="true"
                                                        settingBtnText="分支条件"
                                                        title="分支条件"
                                                        confirmName="确认"
                                                        maxConditionLength="8"   >
             {{each FlowBiz.processVarFields as field index}}
              		<oui-field title="{{field.title}}" dataType="STRING" opt="{{field.opt}}" controlType="{{field.controlType}}" name="{{field.id}}" data="{{oui.parseString(field.data)||''}}" dotNum="{{field.dotNum}}" otherAttrs="{{field.otherAttrs}}"></oui-field>
             {{/each}}
             {{=FlowBiz.formFieldsHtml}}
            </oui-condition>
        </div>
        {{/if}}
</script>

<script type="text/html" id="flow-tpl-handle">
    {{if isLine}}

        <div class="flow-ui-branch-info">
        	<div class="branch-info-triangle">
                <em></em>
                <i class="info-triangle-arrow"></i>
            </div>
        	<ul>
        		<li>
        			<span class="branch-info-title">分支条件属性：</span>
        			<span class="branch-info-cont">
        			{{if (node&&node.branchObject&&node.branchObject.autoBranch)}}
        			    自动分支条件
        			{{/if}}
        			{{if (node&&node.branchObject&&(!node.branchObject.autoBranch)) }}
                        手动分支
                    {{/if}}
                    {{if (node)&& !(node.branchObject) }}
                        无分支条件
                    {{/if}}

        			</span>
        		</li>
        		<li>
        			<span class="branch-info-title">分支描述信息：</span>
        			<span class="branch-info-cont">
        			{{if (node&&node.branchObject ) }}
                        {{node.branchObject.des ||''}}
                    {{/if}}
                    </span>
        		</li>
        		{{if (node&&node.branchObject&&node.branchObject.autoBranch)}}
                <li>
                    <span class="branch-info-title">分支条件规则：</span>
                    <span class="branch-info-cont">
                    {{if (node&&node.branchObject ) }}
                        {{=node.branchObject.conditionInfo ||''}}
                    {{/if}}
                    </span>
                </li>
                {{/if}}

        	</ul>
        </div>
    {{/if}}
    {{if !isLine}}
	<div class="flow-ui-handle">
            <ul>
            	{{if hasNodeMembers&&hasComments}}
                {{each node.nodePersonList as item}}
                <li>
                    <i class="handle-icon {{FlowBiz.getStatusImgName({nodeType:'person', nodeState:node.state, personState:item.state, personAttitude:item.attitude||1, isCurrent:false, isFirst:isFirst})}}"></i>
                    <div class="handle-info">
                        <span class="handle-info-username" title="{{item.personName}}">{{item.personName}} </span>
                        {{if item.modifyTime&&(item.state==FlowBiz.WorkFlowPersonState.state_done.value)}}
                        <span>{{item.modifyTime.substr(5,11)}}</span>
                        {{/if}}
                        <span class="handle-info-view" title="{{item.comment||''}}">{{item.comment||""}}</span>
                    </div>
                </li>
                {{/each}}
                {{else if hasComments}}
                	{{each node.comments as itemComment}}
                    <li>
                        <div class="handle-info">
                         {{if node.modifyTime&& (node.state==FlowBiz.WorkFlowNodeState.state_done.value)}}
                         	<span>{{node.modifyTime.substr(5,11)}}</span>
                         {{/if}}
                        <span class="handle-info-view" title="{{itemComment||''}}" >{{itemComment}}</span>
                        </div>
                    </li>
                    {{/each}}
                 {{else if hasNodeMembers}}
                    {{each node.nodePersonList as item}}
                    <li>
                       <i class="handle-icon {{FlowBiz.getStatusImgName({nodeType:'person', nodeState:node.state, personState:item.state, personAttitude:item.attitude||1, isCurrent:false, isFirst:isFirst})}}"></i>
                       <div class="handle-info">
                       		<span class="handle-info-username" title="{{item.personName}}">{{item.personName}}</span>
                       		{{if item.modifyTime&&(item.state==FlowBiz.WorkFlowPersonState.state_done.value)}}
                       		<span>{{item.modifyTime.substr(5,11)}}</span>
                       		{{/if}}
                       </div>
                    </li>
                 	{{/each}}
                  {{else }}
                  	{{if (!node.nodePersonList) || (!node.nodePersonList.length)}}
                     <li>
                        	<div class="handle-info">
                               {{if node.modifyTime &&( node.state == FlowBiz.WorkFlowNodeState.state_done.value)}}
                                <span>{{node.modifyTime.substr(5,11)}}</span>
                               {{/if}}
                             </div>
                      </li>
                  	{{/if}}

                     {{each node.nodePersonList as item}}
                     <li>
                        	<div class="handle-info">
                               {{if item.modifyTime&&(item.state==FlowBiz.WorkFlowPersonState.state_done.value || item.state==FlowBiz.WorkFlowPersonState.state_sent.value)}}
                                <span>{{item.modifyTime.substr(5,11)}}</span>
                               {{/if}}
                             </div>
                      </li>
                      {{/each}}
                {{/if}}

            </ul>
    </div>
    {{/if}}
</script>
<script type="text/html" id="flow-tpl-item">
	<div id="flow-ui-item" >
		<!-- <div id="flow-ui-theme" class="flow-ui-theme">
			<span>选择配色：</span>
			<button flow-themeId="1" oui-e-{{Events.click}}="event2renderByThemeId" class="flow-top-button {{if (FlowBiz.themeId+'') =='1'}}flow-top-button-active{{/if}}">有底色</button>
			<button flow-themeId="2" oui-e-{{Events.click}}="event2renderByThemeId" class="flow-top-button {{if (FlowBiz.themeId+'') =='2'}}flow-top-button-active{{/if}}"  >无底色</button>
		</div> -->
		{{if (!FlowBiz.isPreview) && (!FlowBiz.isIndex)}}
		<div id="flow-ui-tabs" class="flow-ui-tabs">
        	<button oui-e-{{Events.click}}="event2processGraph" class="flow-top-button flow-top-button-l {{if FlowBiz.toProcessProps===false}}flow-top-button-active{{/if}}">流程设计</button>
        	<button oui-e-{{Events.click}}="event2processProps" class="flow-top-button flow-top-button-r {{if FlowBiz.toProcessProps ===true}}flow-top-button-active{{/if}}"> 流程属性</button>
        </div>
		{{/if}}
	</div>
</script>


<script type="text/html" id="flow-tpl-viewType">

    <div id="flow-ui-viewType" class="flow-ui-viewType"  >

        	<button oui-e-{{Events.click}}="event2vertical" class="flow-ui-direction-btn {{if FlowBiz.isVertical ===true}}flow-ui-direction-btn-active{{/if}}"> </button>
        	<div class="flow-ui-transverse-line"></div>
        	<button oui-e-{{Events.click}}="event2trans" class="flow-ui-transverse-btn {{if FlowBiz.isVertical===false}}flow-ui-transverse-btn-active{{/if}}"></button>

        </div>
</script>

<script type="text/html" id="flow-tpl-nodeProps">
	{{if !oui.os.mobile}}
		<style type="text/css">
		.oui-dialog-bd{
		padding:15px 15px 0 15px;
		}
.flow-ui-nodeProps-content{
    display:block;
    font-size:0;
    text-align:left;
}
.flow-ui-nodeProps-nodeDisplayName,.flow-ui-nodeProps-chooseType{
    width: 50%;
    display:inline-block;
    vertical-align: top;
    text-align: left;
    font-size: 14px;
    color:#515151;
    margin-bottom:10px;
}
.flow-ui-whether{
    width:50%
}
.flow-ui-nodeProps-formRight{
    width:100%;
}
.flow-ui-nodeProps-nodeDisplayName:after,.flow-ui-nodeProps-chooseType:after,.flow-ui-nodeProps-formRight:after{
    content: "";
    display: block;
    clear: both;
    visibility: hidden;
}
.flow-ui-nodeProps-formRight .appautho-layout-content{
    padding-left:0;
    padding-right:0;
}
.nodeProps-title{
    width: 170px;
    height: 36px;
    line-height: 36px;
    float: left;
    text-align:left;
}
.nodeProps-title-formRight,
.flow-ui-fullWidth{
    width:100%;
}
.nodeProps-title-formRightscorll{
     float: left;
}
.flow-ui-nodeProps-nodeDisplayName .nodeProps-title,
.flow-ui-nodeProps-chooseType .nodeProps-title,
.flow-ui-select-display .nodeProps-title{
    width:110px;
}
.flow-ui-whether .nodeProps-title{
    width:170px;
}
.flow-ui-nodeProps-nodeDisplayName .nodeProps-option,.flow-ui-nodeProps-chooseType .nodeProps-option{
    display:block;
    overflow:hidden;
    padding-right:23px;
}
.flow-ui-nodeProps-chooseType .nodeProps-option .oui-class-multiselect label{
    line-height: 36px;
    min-width: 70px;
    margin-right: 5px;
    margin-top:8px;
    display: inline-block;
}
.flow-ui-nodeProps-chooseType .nodeProps-option .oui-class-checkbox{
    margin-top:6px;
}
.flow-ui-fullWidth .nodeProps-option{
    line-height:36px;
}
.flow-ui-tips .nodeProps-option{
    background: #dfe9f5;
    padding-left:5px;
    height：30px;
    line-height:30px;
    margin-top:3px;
}
.nodeProps-option div.oui-class-radio{
   height:36px;
}
.nodeProps-option div.oui-class-radio label {
    margin-right: 15px;
    margin-top: 8px;
    display:inline-block;
}
.nodeProps-option div.oui-readOnly{
    background: #f9f9f9;
    width: 100%;
    padding: 0 5px;
    border: 1px solid #bdbdbd;
    outline: none;
    font-size: 14px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}
.nodeProps-title div.question-help,
.nodeProps-title span.question-help{
    z-index:initial;
}
.flow-ui-nodeProps-formRight iframe{
    width:100%;
    height:260px;
}
.nodeProps-option .nodeProps-tips-icon{
    background: #5990cf;
    font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    color: #ffffff;
    font-size: 12px;
    font-style: normal;
    display: inline-block;
    font-weight: bold;
    vertical-align: top;
    margin-right: 5px;
    margin-top: 7px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
}
        </style>
	{{/if}}
	<div class="flow-ui-nodeProps-content">
	{{if !node.isRoot}}
        <div class="flow-ui-nodeProps-nodeDisplayName">
            <span class="nodeProps-title">显示名称：</span>
            <span class="nodeProps-option">
                <oui-form showType="{{oui.os.mobile?1:0}}" type="textfield" id="nodeDisplayName" otherAttrs="{title:'节点显示名称'}" name="nodeDisplayName" value="{{node.nodeDisplayName}}"></oui-form>
            </span>
        </div>
        <div class="flow-ui-nodeProps-chooseType">
            <span class="nodeProps-title">执行人：</span>
            <span class="nodeProps-option">
                  <div class="oui-readOnly">{{node.nodeName}}</div>
            </span>
        </div>
        {{if !FlowBiz.design4Runtime}}
        <div class="flow-ui-nodeProps-chooseType" >
            <span class="nodeProps-title">执行模式：
                {{if !oui.os.mobile}}
                <div class="question-help">?
                     <div class="question-content">
                          <div class="question-wapper"></div>
                          单人执行：节点执行人中选择一个人处理。<br/>多人执行：节点执行人中选择多个人处理。<br/>全体执行：节点执行人所有人都需要处理。<br/>竞争执行：节点执行人中任意一个人处理。
                      </div>
                </div>
                {{/if}}
            </span>
            <span class="nodeProps-option">
                <oui-form {{if node.notifyNode || (node.nodeType ==FlowBiz.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender')||((node.nodeId.indexOf('member#')>-1 && node.nodeType !=FlowBiz.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 ) }}right="readOnly" {{/if}}  showType="{{oui.os.mobile?3:0}}" type="radio" id="chooseType" name="chooseType" value="{{node.chooseType|| (( (node.nodeType ==FlowBiz.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') )?FlowBiz.WorkFlowChooseType.single.value:FlowBiz.WorkFlowChooseType.all.value )  }}" data="{{FlowBiz.chooseTypeItemsJson}}"></oui-form>
            </span>
        </div>
        {{/if}}
        {{if FlowBiz.design4Runtime}}
         <div class="flow-ui-nodeProps-chooseType" style="display:none" >
                <span class="nodeProps-title">执行模式：
                    {{if !oui.os.mobile}}
                    <div class="question-help">?
                         <div class="question-content">
                              <div class="question-wapper"></div>
                              单人执行：节点执行人中选择一个人处理。<br/>多人执行：节点执行人中选择多个人处理。<br/>全体执行：节点执行人所有人都需要处理。<br/>竞争执行：节点执行人中任意一个人处理。
                          </div>
                    </div>
                    {{/if}}
                </span>
                <span class="nodeProps-option">
                    <oui-form {{if node.notifyNode || (node.nodeType ==FlowBiz.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender')||((node.nodeId.indexOf('member#')>-1 && node.nodeType !=FlowBiz.WorkFlowNodeType.formControl.value) || node.nodeId.indexOf('deptLeader#')>-1 ) }}right="readOnly" {{/if}}  showType="{{oui.os.mobile?3:0}}" type="radio" id="chooseType" name="chooseType" value="{{node.chooseType|| (( (node.nodeType ==FlowBiz.WorkFlowNodeType.person.value) || (node.nodeId=='relRole_sender') )?FlowBiz.WorkFlowChooseType.single.value:FlowBiz.WorkFlowChooseType.all.value )  }}" data="{{FlowBiz.chooseTypeItemsJson}}"></oui-form>
                </span>
            </div>
        {{/if}}
         <div class="flow-ui-nodeProps-chooseType flow-ui-whether">
                <span class="nodeProps-title">是否为知会节点：
                    {{if !oui.os.mobile}}
                    <div class="question-help">?
                         <div class="question-content">
                              <div class="question-wapper"></div>
                              知会节点可通知节点执行人查看流程，不必须处理流程；知会节点不允许设置分支条件。
                          </div>
                    </div>
                    {{/if}}
                </span>
                <span class="nodeProps-option">
                    <oui-form  type="checkbox" id="notifyNode" name="notifyNode" otherAttrs="{{FlowBiz.otherAttrs4notifyNodeJson}}" onUpdate="oui.getTop().oui.getPageParam('flow_node_update_isNotify')" value="{{node.notifyNode?'true':'false'}}"></oui-form>
                </span>
         </div>
        <div class="flow-ui-nodeProps-chooseType flow-ui-select-display">
            <span class="nodeProps-title">处理权限：
             {{if !oui.os.mobile}}
                <div class="question-help">?
                     <div class="question-content">
                          <div class="question-wapper"></div>
                          加签：处理人可添加流程节点，指定节点执行人。<br/>回退：处理人可将流程退到上节点或发起人。<br/>终止：处理人可将流程提前结束，后面节点不再执行。
                      </div>
                </div>
              {{/if}}
            </span>
            <span class="nodeProps-option">
                <oui-form type="multiselect" showType="{{oui.os.mobile?5:0}}" id="nodeRight" name="nodeRight" value="{{node.nodeRight}}" data="{{ (node.notifyNode)?FlowBiz.nodeRightItemsJson4notify:FlowBiz.nodeRightItemsJson }}"></oui-form>
            </span>
        </div>
        {{else}}
          <div class="flow-ui-nodeProps-chooseType flow-ui-select-display">
                <span class="nodeProps-title">处理权限：
                 {{if !oui.os.mobile}}
                    <div class="question-help">?
                         <div class="question-content">
                              <div class="question-wapper"></div>
                              加签：处理人可添加流程节点，指定节点执行人。<br/>回退：处理人可将流程退到上节点或发起人。<br/>终止：处理人可将流程提前结束，后面节点不再执行。
                          </div>
                    </div>
                  {{/if}}
                </span>
                <span class="nodeProps-option">
                    <oui-form type="multiselect" id="nodeRight" name="nodeRight" value="{{node.nodeRight}}" data="{{FlowBiz.nodeRightItemsJson4cancel}}"></oui-form>
                </span>
            </div>
        <oui-form type="hidden" id="nodeDisplayName" name="nodeDisplayName" value="{{node.nodeDisplayName}}"></oui-form>
        <oui-form type="hidden" id="chooseType" name="chooseType" value="{{node.chooseType||FlowBiz.WorkFlowChooseType.single.value}}" ></oui-form>
        {{/if}}
    </div>
    {{if !oui.os.mobile}}
        {{if !FlowBiz.design4Runtime}}
        <div class="flow-ui-nodeProps-chooseType flow-ui-fullWidth flow-ui-tips">
             <span class="nodeProps-title nodeProps-title-formRight">操作权限：</span>
             <span class="nodeProps-option"><i class="nodeProps-tips-icon">i</i>Tips：若已有字段权限不满足需要，请到属性设置--字段权限设置中新增或修改！</span>
         </div>
        <div class="flow-ui-nodeProps-formRight">
            <span class="nodeProps-option nodeProps-title-formRight nodeProps-title-formRightscorll">
                <iframe id="form-right-iframe-flow" src="{{oui.getPageParam('cellRightUrl')}}&rightId={{node.formRight||'-1'}}&_t_={{oui.getUUIDLong()}}" frameborder="0"></iframe>
            </span>
        </div>
        {{/if}}
    {{/if}}
    {{if oui.os.mobile}}
        {{if !FlowBiz.design4Runtime}}
    	<div class="flow-ui-nodeProps-formRight">
            <span class="nodeProps-option nodeProps-title-formRight nodeProps-title-formRightscorll">
    			{{=FlowBiz.formRightHtml}}
        	</span>
        </div>
        {{/if}}
    {{/if}}
</script>

<script type="text/html" id="flow-tpl-bottomButtons">
	<style type="text/css">

		.flow-body{
			text-align: center;
			position: absolute;
			top: 0 !important;
			left: 0;
			right: 0;
			bottom:{{FlowBiz.isHideSaveButton===false?'50px':'0px'}} !important;
			overflow: auto;
			padding-top: 30px;
		}
	</style>
	<div id="flow-ui-bottomButtons" class="flow-ui-bottomButtons" {{if FlowBiz.isHideSaveButton===true}} style="display: none" {{/if}}>
		{{if oui.os.mobile &&(!FlowBiz.design4Runtime)}}
		<button class="clear-button" oui-e-{{Events.click}}="clearNodes" >清空</button>
		{{if false}}
		<button class="tolist-button" oui-e-{{Events.click}}="event2formList" >返回列表</button>
        {{/if}}
        <button class="save-button" saveType="save" oui-e-{{Events.click}}="saveWorkFlow" >保存</button>
		{{/if}}


		{{if (!oui.os.mobile) &&(!FlowBiz.design4Runtime)}}
		<button class="save-button" saveType="save" oui-e-{{Events.click}}="saveWorkFlow" >保存</button>
		<button class="clear-button" oui-e-{{Events.click}}="clearNodes" >清空</button>
		{{/if}}

		{{if (FlowBiz.isTest+'')=='true'}}
		<button saveType="save4test" oui-e-{{Events.click}}="saveWorkFlow" class="disable">保存并测试</button>
		{{/if}}
	</div>
</script>

<script type="text/html" id="flow-tpl-processProp">
	<div id="flow-ui-processProp" class="flow-ui-processProp">
		<div class="flow-ui-processProp-item">
		{{if !oui.os.mobile}}
			<ul>
				<li>
                    <span class="processProp-name">流程名称</span>
                	<oui-form type="textfield" id="name" name="name" value="{{name}}"></oui-form>
                </li>
				<li>
					<span class="processProp-name">使用者</span>
					<oui-form type="selectperson" showType="5" tabs='3' id="selectPerson4right" filterSelf="false" name="selectPerson4right"  data="{{selectPerson4right}}" value='{{=selectPerson4rightValue}}'></oui-form>
				</li>
                <li>
                     <span class="processProp-name">重要程度</span>
					<oui-form type="radio" id="importance" name="importance" value="{{importance ||'1'}}" data="[{display:'非常重要',value:3},{display:'重要',value:2},{display:'一般',value:1}]"></oui-form>
                </li>
			</ul>
		{{/if}}
		{{if oui.os.mobile}}
			<ul>
            	<li>
                    <span class="processProp-name">流程名称</span>
                	<oui-form showType="1" type="textfield" id="name" otherAttrs="{title:'流程名称'}" name="name" value="{{name}}"></oui-form>
                </li>
            	<li>
            		<span class="processProp-name">使用者</span>
            		<oui-form type="selectperson" tabs="3" showType="5" id="selectPerson4right" filterSelf="false" fillBack="true" name="selectPerson4right" data='{{selectPerson4right}}' value='{{=selectPerson4rightValue}}'></oui-form>
            	</li>
                <li oui-e-{{FlowBiz.Events.click}}="event2selectImportance">
                    <span class="processProp-name">重要程度</span>
                    <oui-form showType="3" type="radio" id="importance" name="importance" value="{{importance ||'1'}}" data="[{display:'非常重要',value:3},{display:'重要',value:2},{display:'一般',value:1}]"></oui-form>
                </li>
            </ul>
		{{/if}}
		</div>
	</div>

</script>








