!(function(){
    oui.ns('com.oui.pagedesign');
    var PageDesignTypeEnum={
        printForm:{name:'printForm'},
        normalForm:{name:'normalForm'},
        tableForm:{name:'normalForm'},
        absoluteForm:{name:'absoluteForm'} 
    };
    PageDesignTypeEnum.findEnum = function(name){
        for(var i in PageDesignTypeEnum){
            if(PageDesignTypeEnum[i] && PageDesignTypeEnum[i].name==name){
                return  PageDesignTypeEnum[i];
            }
        }
        return null;
    };
    com.oui.pagedesign.PageDesignTypeEnum = PageDesignTypeEnum;
})();