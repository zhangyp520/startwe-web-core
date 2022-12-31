/*-----------------------------------------------
 * 界面皮肤操作
 *---------------------------------------------*/
var skins_sidebar = function(){
    this.mySkins = [//皮肤选项
        'skin-default',
        'skin-blue',
        'skin-black',
        'skin-red',
        'skin-yellow',
        'skin-purple',
        'skin-green',
        'skin-blue-light',
        'skin-black-light',
        'skin-red-light',
        'skin-yellow-light',
        'skin-purple-light',
        'skin-green-light'
    ];
    //---------------更换皮肤--------------------------------------
    this.changeSkin= function(cls) {
        var self = this;
        $.each(self.mySkins, function (i) {
            $('body').removeClass(self.mySkins[i])//清除以前的皮肤设置
        })
        $('body').addClass(cls);//设置新的皮肤
        return false
    };
    //---------------选择皮肤--------------------------------------
    this.initSkinSelect = function(){
        var indx=0;
        var self = this;
        var html=[];
        html[indx++]= '<div class="tab-pane active" id="control-sidebar-stats-tab">皮肤设置</div>';
        html[indx++]= '<ul class="list-unstyled clearfix">';
        //------------default---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">';
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-default" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px; background: #367fa9"></span><span class="bg-light-blue" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #222d32"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin">默认</p>';
        html[indx++]='</li>';
        //------------Blue---------------------------------------
//        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
//        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-blue" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
//        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px; background: #367fa9"></span><span class="bg-light-blue" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
//        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #222d32"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
//        html[indx++]= '</a>';
//        html[indx++]= '<p class="text-center no-margin">蓝色</p>';
//        html[indx++]='</li>';
        //------------Black---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-red-light" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-red-active"></span><span class="bg-red" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #f9fafc"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin" style="font-size: 12px">红光</p>';
        html[indx++]= '</li>';
        //------------Purple---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-purple" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-purple-active"></span><span class="bg-purple" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #222d32"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin">紫色</p>';
        html[indx++]= '</li>';
        //------------Green---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-green" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-green-active"></span><span class="bg-green" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #222d32"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin">绿色</p>';
        html[indx++]= '</li>';
        //------------Red---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-red" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-red-active"></span><span class="bg-red" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #222d32"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin">红色</p>';
        html[indx++]= '</li>';
        //------------Yellow---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-yellow" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-yellow-active"></span><span class="bg-yellow" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #222d32"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin">黄色</p>';
        html[indx++]= '</li>';
        //------------Yellow---------------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-blue-light" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px; background: #367fa9"></span><span class="bg-light-blue" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #f9fafc"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin" style="font-size: 12px">蓝光</p>';
        html[indx++]= '</li>';
        //------------Purple Light----------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-purple-light" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-purple-active"></span><span class="bg-purple" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #f9fafc"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin" style="font-size: 12px">紫光</p>';
        html[indx++]= '</li>';
        //------------Green Light----------------------------------
        html[indx++]= '<li style="float:left; width: 33.33333%; padding: 5px;">'
        html[indx++]= '<a href="javascript:void(0)" data-skin="skin-green-light" style="display: block; box-shadow: 0 0 3px rgba(0,0,0,0.4)" class="clearfix full-opacity-hover">';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 7px;" class="bg-green-active"></span><span class="bg-green" style="display:block; width: 80%; float: left; height: 7px;"></span></div>';
        html[indx++]= '<div><span style="display:block; width: 20%; float: left; height: 20px; background: #f9fafc"></span><span style="display:block; width: 80%; float: left; height: 20px; background: #f4f5f7"></span></div>';
        html[indx++]= '</a>';
        html[indx++]= '<p class="text-center no-margin" style="font-size: 12px">绿光</p>';
        html[indx++]= '</li>';
        //-------------------------------------------------------
        html[indx++]= '</ul>';
        html[indx++]= '</div>';
        //------------Red Light----------------------------------
        $('#control-sidebar-settings-tab').prepend(html.join('')).trigger("create");//初始化选项
        $('[data-skin]').on('click', function (e) {//附加选择皮肤方法
            e.preventDefault()
            self.changeSkin($(this).data('skin'));//改变皮肤
            self.writecookie('nokaport_skin', $(this).data('skin'));//写入cookie
        });
        $('#right_sidebar').on("click",'.editWork',function(){
            var tab = new Tab($("#tab"),$('#content_iframe'));
            tab.addTab({
                name:'工作台',
                url:'https://www.baidu.com/',
                id:'index',
                isAllowClose:true
            })
        })
    };
    //-------------写入cookie--------------------------
    this.writecookie=function (name,value) {
        $.cookie(name,value,{
            expires:30//默认存储30天
        });
    };
    //------------从cookie里初始化skin----------------
    this.initskins=function(){
        var skin = $.cookie('nokaport_skin');
        var self = this;
        if(undefined!=skin) {//如果cookie里有皮肤设置，则初始化cookie里的皮肤样式
            self.changeSkin(skin);//改变皮肤
        }
    };
}
/*-----------------------------------------------
* 初始化皮肤设置
*----------------------------------------------*/
$(document).ready(function($){
    var skinssidebar = new skins_sidebar();
    skinssidebar.initSkinSelect();
    skinssidebar.initskins();
});
