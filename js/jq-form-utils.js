;(function($){
	$.FormUtils = $.FormUtils || {};
	$.extend($.FormUtils,{
		fillFormData: function(selector, data){//填充数据
			//update by daihy at 2014-04-30 填充表单前清空表单数据
		//	this.clearFormData(selector);
			var formWidget = $(selector).find("input,select,textarea");
			$.each(formWidget,function(i){
				var currentWidget = $(formWidget[i]);
				var widgetName = currentWidget.attr("name");
				if(widgetName){
					if(currentWidget.is("input")){
						var widgetType = currentWidget.attr("type");
						if(!widgetType || widgetType == "text" || widgetType == "number" || widgetType == "hidden" ||
							widgetType == "password"){
							//日期控件 update at 20140512
							if(currentWidget.hasClass('datepicker')){
								if(!$.StringUtils.isEmpty(data[widgetName])&& typeof data[widgetName] == 'number'){
									var formatPattern = currentWidget.datepicker("option","dateFormat");
									var formatedDate = $.datepicker.formatDate(formatPattern, new Date(data[widgetName]));
									currentWidget.val(formatedDate);
								}else{
									//暂时不进行format
									if(!$.StringUtils.isEmpty(data[widgetName])){
										currentWidget.val(data[widgetName].substring(0,10));
									}
								}
							}else if(currentWidget.attr("dateFormat")){
								var formatPattern = currentWidget.attr("dateFormat");
								var formatedDate;
								//对于1927-12-31 之前的日期进行转换后少一天?
								if(typeof data[widgetName] == 'string'){
									currentWidget.val(data[widgetName]);
								}else{
									if(data[widgetName] != null ){
										if(data[widgetName] < -1325664000000){
											formatedDate = $.formatDate(new Date(data[widgetName]+352000), formatPattern);
										}else{
										    formatedDate = $.formatDate(new Date(data[widgetName]), formatPattern);
										}
									   currentWidget.val(formatedDate);
									}
								}
							}else{
								currentWidget.val(data[widgetName]);
							}
						}else if(widgetType == "checkbox"){
							if(typeof data[widgetName] ==1 || data[widgetName] == true){
								currentWidget.prop("checked","checked");//解决谷歌和火狐下radio无法选中问题 update at 20140512
							}else{
								currentWidget.removeAttr("checked");
							}
						}else if(widgetType == 'radio'){
							var radioValue = currentWidget.val();
							if(radioValue == (data[widgetName]+"")){
//								currentWidget.attr("checked", true);
								currentWidget.prop("checked", true);//解决谷歌和火狐下radio无法选中问题 update at 20140512
							}else{
								currentWidget.removeAttr("checked");
							}
						}else{
							currentWidget.val(data[widgetName]);
						}
					}else if(currentWidget.is("select")||currentWidget.is("textarea")){
						currentWidget.val(data[widgetName]);
					}
				}
			});
		},
		clearFormData: function(selector){//清空指定表单数据
			  var inputFields=$("input",selector);
			  var textareaFields=$("textarea",selector);
			  var selectFields=$("select",selector);
			  
			  inputFields.each(function(index,domObj){
				  var item = $(domObj);
				  if(item.attr("name")){
					  if(item.is("select")){
						  item.find("option:selected").removeAttr("selected");
						  item.find("option:first").attr("selected", "selected");
					  }else if(!item.attr("type")){//默认类型text
						  item.val("");
					  }else if(item.attr("type")&&item.attr("type").toLowerCase()=="radio"){	              
						  item.removeAttr("checked");	              
					  }else if(item.attr("type")&&item.attr("type").toLowerCase()=="checkbox"){	              
						  item.removeAttr("checked");
					  }else{
						  item.val("");
					  }
				  }
			 });
			 
			 textareaFields.each(function(index,domObj){
				  var item=$(domObj);
				  item.val("");
			 });
			 
			 selectFields.each(function(index,domObj){
				  var item = $(domObj);
				  $("option",item).eq(0).attr('selected','selected');
			 });
		},
		convertFormDataToObj: function(selector, rowData){
			if(rowData == undefined){
				rowData = {};
			}
			var formWidget = $(selector).find("input,select,textarea");
			$.each(formWidget,function(i){
				var currentWidget = $(formWidget[i]);
				var widgetName = currentWidget.attr("name");
				if(widgetName){
					if(currentWidget.is("input")){
						var widgetType = currentWidget.attr("type");
						if(!widgetType || widgetType == "text" || widgetType == "number" || widgetType == "hidden" ||widgetType == "password"){
							if(!$.StringUtils.isEmpty(currentWidget.val())){
								rowData[widgetName] = currentWidget.val();
							}
						}else if(widgetType == "checkbox"){
							if(currentWidget.is(":checked")){
								rowData[widgetName] = true;
							}else{
								rowData[widgetName] = false;
							}
						}else if(widgetType == "radio"&& currentWidget.is(":checked")){
							if(currentWidget.val() === 'true'){
								rowData[widgetName] = true;
							}else if(currentWidget.val() === 'false'){
								rowData[widgetName] = false;
							}else{
								rowData[widgetName] = currentWidget.val();
							}
						}
					}else if(currentWidget.is("select")||currentWidget.is("textarea")){
						if(!$.StringUtils.isEmpty(currentWidget.val())){
							rowData[widgetName] = currentWidget.val();
						}
					}
				}
			});
		},disabledForm: function(selector){//禁用表单所有元素
			  var inputFields=$("input",selector);
			  var textareaFields=$("textarea",selector);
			  var buttonFields=$("button",selector);
			  var selectFields=$("select",selector);
			  
			  inputFields.each(function(index,domObj){
				 $(domObj).attr("disabled",true);
				 
			 });
			 
			 textareaFields.each(function(index,domObj){
				 $(domObj).attr("disabled",true);
			 });
			 
			 buttonFields.each(function(index,domObj){
//				 var name=$(domObj).attr("name");
//				 if(name!="fileView" && name!="fileView2" && name!="fileView3"){
//				 }
				$(domObj).attr("disabled",true);
			 });
			 selectFields.each(function(index,domObj){
				 $(domObj).attr("disabled",true);
			 });
		},
		/**
		 * settings:{
		 * formSelector:表单选择器
		 * saveUrl:请求保存url
		 * customData:自定义数据
		 * afterSuccess:保存成功后回调函数
		 * errorHandler:异常处理器
		 * }
		 */
		saveFormData: function(settings){
			var customData = settings.customData;
			if(customData == null){
				customData = {};
			}
			$.FormUtils.convertFormDataToObj(settings.formSelector,customData);
			$.ajax({
				url: App.ctx+ settings.saveUrl,
				dataType: "json",
				type: "POST",
				data: customData
			}).done(function(data, textStatus, jqXHR){
				settings.afterSuccess.call(this, data);
			}).fail(function(XMLHttpRequest, textStatus, errorThrown){
				if(settings.errorHandler != null){
					settings.errorHandler.call(this, XMLHttpRequest.responseText);
				}else{
					$.ui.dialog4Error(XMLHttpRequest.responseText);
				}
			});
		}
	});
	//查询区收缩
	$(".shrink").click(function(){
		var $next = $(this).next();
		if($next.is(":visible")||$next.css("display")=="block"){
			$next.slideUp("fast");
			$(this).addClass("pic").children("span").removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
		}else{
			$next.slideDown("fast");
			$(this).removeClass("pic").children("span").removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
		}
        var resizeTableFunc = function(){
             $("div[id^=gview_]").each(function(i,elem){
                var viewId = $(elem).attr("id");
                $("#"+viewId.substr(6, viewId.length)).jqGrid("resetGridWidth", true);
              });
        };
        setTimeout(resizeTableFunc,500);
	});
})(jQuery);