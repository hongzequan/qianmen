$(function(){
	init();
	loadEventInfo();
	initEvent();
	
	/*$("#evaluate_content").keyup(function(){
       var str=$(this).val();
	   str = str.replace(/[^\\u0000-\\uFFFF]/, "");    
	   $(this).val(str);   
    });*/
});
function initEvent(){
	$('.flow').on('click','li',function(){
		if($(this).attr('data-number') != undefined){
			$('.flow').find('li').removeClass('selected');
			$('#html_content').find('.state').removeClass('show');
			$(this).addClass('selected');
			$('#html_content').find('.state').eq($(this).attr('data-number')).addClass('show');
		}
	});

	$(".large_picture").on('click','img',function(){
		$('#max_img').css('display','block');
		$('#max_img img').attr('src',$(this).attr('src'));
	});
	
    $('#evaluate_grade').raty({
	  	number: 5,//多少个星星设置		
		targetType: 'number',//类型选择，number是数字值，hint，是设置的数组值
        path      : App.staticPath+'css/img',
		hints     : ['差','一般','好'],
        size      : 30,
        starHalf  : 'star-half.png',
        starOff   : 'cry-icon.png',
        starOn    : 'laugh-icon.png',
        target    : '',
		score	  : 3,
        cancel    : false,
        targetKeep: true,
		targetText: '请选择评分',
        click: function(score, evt) {
			$("#stars").val(score);
        }
     });
}
function submitEvent(state){
	var $eventId = $("#event_id");
	var ucode =$("#ucode").val();
	var dealStyle=0;
	if(state==2){
		dealStyle=1;
	}else{
		dealStyle=2;
	}
	$.ajax({
		type : "post",
		dataType : "json",
		url : getContextPath("/merchant/disposeEvent"),
		data : {id:$eventId.val(),state:state,dealStyle:dealStyle,ucode:ucode},
		success : function(data) {
			loadEventInfo();
		}
	});
}

function loadEventInfo(){
		var $list = $('#html_content');
		var compiler = Handlebars.compile($('#tpi-list-item').html());
	    $.ajax({
			type : "post",
			dataType : "json",
			url : getContextPath("/r/evaluate/resultView"),
			data : {id:$("#event_id").val()},
			success : function(data) {
				var res = data.data.event;
				console.debug(res);
				res.isUser=data.data.isUser;
				setMsg(res);
	            var html = compiler(res);// 加载装填模板
				$list.html(html);
				$("#storeStars").html(getStars(res.storeId.stars));
				$("#resultBtnDiv").html(getResultBtn(res));
				var evaluate=res.evaluate;
				if(evaluate!=undefined && evaluate!=null){
					$("#resultStars").html(getSmilingFace(evaluate.stars));
				}
				//初始化百度地图
				var lng = res.storeId.lng;
				var lat = res.storeId.lat;
				initialize(lng,lat);
			}
		});
}
function getResultBtn(res){
	var htm='<div class="bottom_fixed"><a class="dispose_button" href="javascript:history.go(-1)">返回</a></div>';
	var state=res.state;
	var accessType=$("#accessType").val();
	if(!$("#isView").val()){//视图模式
		if(state==0 && accessType=='merchant'){
	        if(res.eventType==0){
	            htm='<div class="bottom_fixed"><a class="return_button FL" href="javascript:history.go(-1)">返回</a><a class="evaluate_button" onclick="discretion()">立即处理</a></div>';
	        }else {
	            htm='<div class="bottom_fixed"><a class="sham_button FL" onclick="inveracious()"><i class="sham-icon await-icon"></i>虚假举报</a><a class="evaluate_button" onclick="discretion()">立即处理</a></div>';
	        }
	    }else if(res.isUser && state>3 && res.evaluate==null){
	    	htm='<div class="bottom_fixed"><a class="return_button FL" href="javascript:history.go(-1)">返回</a><a class="evaluate_button" id="evaluate_button" onclick="openEvaluate()">立即评价</a></div>';
		}
	}
	return htm;
}

function setMsg(res){
	var deal=res.deal;
	var state=res.state;
	var msg;
	if(state==2){
		msg='若问题仍旧存在则扣双倍分数';
	}else if(state==3){
		msg='若为真实问题，商家谎称虚假举报则双倍扣分';
	}else if(state==4){
		msg='商家自行处理完成';
	}else if(state==5){
		msg='该问题仍存在（商家谎报处理）';
	}else if(state==6){
		msg='该问题为真实问题,商家虚假举报双倍扣分处罚，该问题已转由职能人员处理';
	}else if(state==7){
		msg='确定为虚假问题';
	}else if(state==8 || state==1){
		msg='店主未在规定时间内对该问题进行处理';
	}
	res.msg=msg;
}
function getSmilingFace(num){
	var htm='';
	for(var i=0;i<5;i++){
		if(i>=num){
			htm+='<i class="cry-icon await-icon">&ensp;</i>';
		}else{
			htm+='<i class="laugh-icon await-icon">&ensp;</i>';
		}
	}
	return htm;
}
function getStars(num){
	var htm='';
	for(var i=0;i<5;i++){
		if(i>=num){
			htm+='<i class="star-icon await-icon">&ensp;</i>';
		}else{
			htm+='<i class="active-star-icon await-icon">&ensp;</i>';
		}
	}
	return htm;
}

function init(){
	Handlebars.registerHelper("getScore",function(deal,eventType,score,scoreProject,options){
		var result=0;
		var suffix='分';
		if(eventType==0){
			if(deal==1){
				result=scoreProject.score;
			}else{
				result=scoreProject.score*2;
				suffix+='(双倍扣分)';
			}
		}else{
			if(deal==1){
				result=score.score;
			}else{
				result=score.score*2;
				suffix+='(双倍扣分)';
			}
		}
		return '扣'+result+suffix;
	});
	
	Handlebars.registerHelper("isReview",function(val, options){
		if(val==2 || val==3){
			return options.fn(this);
		} 
	});
	
	Handlebars.registerHelper("isTimeout",function(val, options){
		if(val==1 || val==8){
			return options.fn(this);
		} 
	});
	
	Handlebars.registerHelper("eventFlase",function(val, options){
		if(val>4 && val<=8 && val!=7){
			return options.fn(this);
		} 
	});
	Handlebars.registerHelper("eventTrue",function(val, options){
		if(val==4 || val==7){
			return options.fn(this);
		} 
	});
	
	Handlebars.registerHelper("isNotUser",function(state,isUser,evaluate,options){
		if(state<=3 || isUser!=true || evaluate!=null){
			return options.fn(this);
		} 
	});
	Handlebars.registerHelper("isUser",function(state,isUser,evaluate,options){
		if(state>3 && isUser==true && evaluate==null){
			return options.fn(this);
		} 
	});
	
	Handlebars.registerHelper("defaultHeadImg",function(val){
		if(!val){
			return "images/handfail.png";
		}
		return val;
	});
	
	Handlebars.registerHelper("evaluateContent",function(val){
		var str=entitiestoUtf16(val);
	//	$("#evaluate_content").val(str);
		return str;
	});
	
	//Handlebars格式化时间
	Handlebars.registerHelper("formatDealTime",function(time,format,dealStyle,shopTime){
		if(dealStyle!=0){
			if(shopTime==null || shopTime==undefined){
				return '';
			}
		    var myDate = new Date(shopTime);
		    return myDate.Format(format);
		}
		
		if(time==null || time==undefined){
			return '';
		}
	    var myDate = new Date(time);
	    return myDate.Format(format);
	});
}

function openEvaluate(){
	$('#evaluate_window').modal('open');
}

Handlebars.registerHelper("problemType",function(val){
	//问题类型(0:门前垃圾，1:违章占道, 2:设施损坏, 3:治安威胁, 4:违章停车, 5:其他)
	switch (val){
		case 0:return "门前垃圾";
			break;
		case 1:return "违章占道";
			break;
		case 2:return "设施损坏";
			break;
		case 3:return "治安威胁";
			break;
		case 4:return "违章停车";
			break;
		default:return "其他";
			break;
	}
});

Handlebars.registerHelper("fmtDate",function(val){
	try {
		if (val) {
			var date = new Date(val);
			return date.Format("yyyy-MM-dd hh:mm:ss");
		}
	} catch (e) {
		return "--";
	}
});
Handlebars.registerHelper("handleState",function(val){
	//处理状态(0.新建，1.不予处理，2.处理完成)
	switch (val){
		case 0:return "新建";
			break;
		case 1:return "其他情况";
			break;
		case 2:return "处理完成";
			break;
	}
});


/**
 * 提交评论
 */
function submitEvaluate($this){
	var $evaluateForm = $("#evaluate_form");
	$("#evaluate_content").val(utf16toEntities($("#evaluate_content").val()));
	//$evaluateForm.submit();
	
	$.ajax({
		type : "post",
		dataType : "json",
		url : getContextPath("/r/evaluate/pv/submit"),
		data : $evaluateForm.serialize(),
		success : function(data) {
			loadEventInfo();
		}
	});
}

/**
 * 自行处理弹窗方法
 */
function discretion(id){
	$('#discretion_window').modal({
		onConfirm: function(){
			
		},//确定按钮事件
		closeOnConfirm: false,
		closeViaDimmer: false
	});
}

/**
 * 虚假举报弹窗方法
 */
function inveracious(id){
	$('#inveracious_window').modal({
		onConfirm: function(){
			
		},//确定按钮事件
		closeOnConfirm: false,
		closeViaDimmer: false
	});
}


/**
 * 初始化百度地图
 */
var map, geocoder;
function initialize(lng,lat) {
	map = new BMap.Map('map_canvas');
	var point = new BMap.Point(lng, lat);
	map.centerAndZoom(point, 20);
//		map.addControl(new BMap.NavigationControl());
	map.enableScrollWheelZoom();
	map.clearOverlays();
	var marker1 = new BMap.Marker(new BMap.Point(lng, lat)); //标注点
	map.addOverlay(marker1);
}

function utf16toEntities(str) {
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g;
    // 检测utf16字符正则
    str = str.replace(patt, function(char){
        var H, L, code;
        if (char.length===2) {
            H = char.charCodeAt(0);
            // 取出高位
            L = char.charCodeAt(1);
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}

//表情解码
function entitiestoUtf16(str){
    // 检测出形如&#12345;形式的字符串
    var strObj=utf16toEntities(str);
    var patt = /&#\d+;/g;
    var H,L,code;
    var arr = strObj.match(patt)||[];
    for (var i=0;i<arr.length;i++){
        code = arr[i];
        code=code.replace('&#','').replace(';','');
        // 高位
        H = Math.floor((code-0x10000) / 0x400)+0xD800;
        // 低位
        L = (code - 0x10000) % 0x400 + 0xDC00;
        code = "&#"+code+";";
        var s = String.fromCharCode(H,L);
        strObj.replace(code,s);
    }
    return strObj;
} 
