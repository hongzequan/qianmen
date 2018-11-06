;(function($){
	$.StringUtils = $.StringUtils || {};
	$.extend($.StringUtils,{
		firstLowerCase : function(str){
			return str.substring(0,1).toLowerCase()+str.substring(1,str.length);
		},
		firstUpperCase : function(str){
			return str.substring(0,1).toUpperCase()+str.substring(1,str.length);
		},
		isEmpty : function(str){
			if(str == undefined || str == "" || str === "" || str == null || str === null || str.length<1
			|| str == 'undefined'){
				return true;
			}else{
				return false;	
			}
		}
	});
})(jQuery);