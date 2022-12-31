var layers = {
	capture: function(tit, con, size, btn, yesFunction,endFunction,val,index) {
		var btns = "";
		if(btn == undefined || btn == ""){
			btns = ["确定","取消"];
		}else{
			btns = btn
		};
		var index=layer.open({
			type: 1,
			title: tit,
			skin: 'define-layer',
			area: size,
            resize:false,
			btn: btns,
			yes: function(index,val) {
				if(yesFunction != undefined) {
					yesFunction(index,val);
				} else {
					layer.close(index);
				}
			},
			end: function() {
                if(endFunction != undefined) {
                    endFunction(index,val);
                } else {
                    $("#" + con).hide()
                }
				/*$("#" + con).hide();*/

			},
			content:$("#" + con)
		});
        return index
	}
	
}


