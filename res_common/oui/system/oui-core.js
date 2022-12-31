/****
 *   前端框架核心组件
 */

/** 一 引入jquery 和字符串模板引擎artTemplate *****/
import '@/res_common/third/jquery/jquery-3.2.1.min.js';
/** 目前拉下来的 art-template需要调整 index.js require问题***/
import  '@/res_common/third/template/template_debug_3_0_0.js';
global = global ||{};
global.template = template;
window.template = template;
/** 二 定义oui,oui.$,oui.ctrl 命名空间*****/
import '@/res_common/oui/system/oui-define.js';
/** 三 枚举前端组件标签***/
import '@/res_common/oui/system/oui-tags.js';
/** 四 组件解析引擎,自动解析组件机制与简化前端控件开发的核心引擎****/
import '@/res_common/oui/system/parser.js';
/** 五 json处理,前后端api处理等工具***/
import '@/res_common/oui/system/oui-datautils.js';
/** 六 前端功能公共api处理***/
import '@/res_common/oui/system/oui-common.js';
/** 七 前端校验组件****/
import '@/res_common/oui/system/oui-checkform.js';
/** 八 模板类型枚举适配****/
import '@/res_common/oui/ui/tpl-type.js';

/** 九 前端组件 基础定义 *****/
import '@/res_common/oui/ui/base-control.js';
/** 10 前端组件 表单类控件定义 *****/
import '@/res_common/oui/ui/form-control.js';

export default oui




