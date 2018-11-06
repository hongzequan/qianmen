var u=GetQueryString("u");
var type=GetQueryString("type");
var load_time = 0;
var isPrize;
var patrol_page=2;
var report_page=2;
var conceal_close;
var isPrize;
var publicity = $('#publicity');
var compiler = juicer($('#template').html());
var report_compiler = juicer($('#report_template').html());
var patrol_compiler = juicer($('#patrol_template').html());
var prodcuctCompiler = juicer($('#productTemplate').html());
var moreProdcuctCompiler = juicer($('#moreProductTemplate').html());
$(function(){
	$.post("store/detail",{uCode:u,id:1},function(data){
		callBack(data);
	});
})

function callBack(data){
	if(!data.success){
		location.href="/jsp/upgrade.jsp";
	}
	initHandlebars()
	var html = compiler.render(data);// 加载装填模板
	$('#html_content').html(html);
	if(data.principalProduct!=undefined && data.principalProduct!=null){
		var pHtml=prodcuctCompiler.render(data.principalProduct);//主营商品
		$('#productDiv').html(pHtml);
		$('#product_stars').html(starsList(data.principalProduct.recommended));
		var mpHtml=moreProdcuctCompiler.render(data.principalProduct.imgs);//更多
		$('#image-gallery1').html(mpHtml);
		gallery();//初始化图片滑动插件
	}else{
		$("#productMain").hide();
	}
	$('#stars').html(starsList(data.store.stars));
	$("#community_marquee").text(data.community.announcement);
	console.debug(data);
	isPrize=data.isPrize;
	initElement();
	stop_animation(1);
}

/* 定时隐藏活动弹窗 */
function conceal(){
	$('#publicity').css('display','none');
	if(!isPrize || isPrize=='false'){
		$("#luckyDrawDiv").hide();
	}else{
		$('.lottery_entrance').css('display','block');
	}
	clearInterval(conceal_close);
}

/* 加载事件方法 */
function morereport(eventType){
	var pageNum;
	if(eventType==0){
		pageNum=patrol_page;
	}else{
		pageNum=report_page;
	}
	
	if(pageNum==0){
		return;
	}
	
	$.ajax({
		type : "get",
		dataType : "json",
		url : "store/loadEventPage",
		data : {eventType:eventType,pageNum:pageNum,storeId:$('#storeId').val()},
		success : function(data) {
			var htm;
			if(eventType==0){
				if(data.patrol.length<1){
					patrol_page=0;
					$("#patrolMore").html("加载完毕");
					return;
				}
				htm=patrol_compiler.render(data);
				$("#patorlDiv").append(htm);
				patrol_page++;
			}else{
				if(data.report.length<1){
					report_page=0;
					$("#reportMore").html("加载完毕");
					return;
				}
				htm=report_compiler.render(data);
				$("#reportDiv").append(htm);
				report_page++;
			}
		}
	});
}

/* 加载动画停止 */
function stop_animation(index){
	load_time++
	if(load_time==index){
		//图片滚动加载初始化
		$('.Load_Animation').css('display','none');
	}
}

/* 初始化事件绑定 */
function initElement(){
	$('#max_img').css('height',$(window).height()+'px');
	$('#max_img').css('line-height',$(window).height()*1.3+'px');
	$('#max_img').click(function(){
		$('#max_img').css('display','none');
	});
	
	$("#LuckyDraw").on('click',function(){
		window.location.href="/r/user/pv/inPrize?uCode="+u+"&storeId="+$("#storeId").val();
	});
	
	$('#productDiv').on('click','img',function(){
		$('#max_img').css('display','block');
		$('#max_img img').attr('src',$(this).attr('src'));
	});
	
	conceal_close = setTimeout('conceal()',3000);
    if(type=='false'){
		publicity.css('display','none');
	}else{
		publicity.css('display','block');
	}
	
	$('#my_tab1 .am-tabs-nav').find('a').click(function(){
		$(this).closest('ul').find('li').removeClass('am-active');
		$(this).closest('li').addClass('am-active');
		$(this).closest('.am-tabs').find('.am-tab-panel').removeClass('am-active');
		$(""+$(this).attr('data-href')).addClass('am-active');
	});
	$('#tab3').find('img').click(function(){
		$('#max_img').css('display','block');
		$('#max_img img').attr('src',$(this).attr('src'));
	});
	$('#tab4').find('img').click(function(){
		$('#max_img').css('display','block');
		$('#max_img img').attr('src',$(this).attr('src'));
	});
	
	//图片滚动加载初始化
	$("#my_tab1 img").lazyload({
		placeholder: App.staticPath+'images/loading-img.gif',
		effect: "fadeIn",
		threshold: 50,
		failurelimit : 1
	});
	$('#my_tab2 .am-tabs-nav').find('a').click(function(){
		$(this).closest('ul').find('li').removeClass('am-active');
		$(this).closest('li').addClass('am-active');
		$(this).closest('.am-tabs').find('.am-tab-panel').removeClass('am-active');
		$(""+$(this).attr('data-href')).addClass('am-active');
	});
}

/* 时间格式转换 */
function formatterDateTime(date) {
    var datetime = date.getFullYear()
            + "-"// "年"
            + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0"
                    + (date.getMonth() + 1))
            + "-"// "月"
            + (date.getDate() < 10 ? "0" + date.getDate() : date
                    .getDate())
            + " "
            + (date.getHours() < 10 ? "0" + date.getHours() : date
                    .getHours())
            + ":"
            + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                    .getMinutes())
            + ":"
            + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                    .getSeconds());
    return datetime;
}
/* 时间格式转换 */
function formatterDateTimes(date) {
    var datetime = ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0"
                    + (date.getMonth() + 1))
            + "-"// "月"
            + (date.getDate() < 10 ? "0" + date.getDate() : date
                    .getDate())
            + " "
            + (date.getHours() < 10 ? "0" + date.getHours() : date
                    .getHours())
            + ":"
            + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                    .getMinutes());
    return datetime;
}

/* 星星遍历打印标签 */
function starsList(val){
	var $starsList = '';
	for(var i=0;i<val; i++){
		$starsList += '<span class="star-icon">&ensp;</span>';
	}
	for(var n=0; n<5-val; n++){
		$starsList += '<span class="star-gray-icon">&ensp;</span>';
	}
	return $starsList;
};

/* 获取URL参数 */
function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

/* 查询事件消息方法 */
function getData(){
	 $.ajax({
		type : "post",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		url : "store/gettop",// 要访问的后台地址
		success : function(data) {// msg为返回的数据，在这里做数据绑定
			if(data.success){
				$("#log").css("display","block");
				$("#log").html("");
				$("#log").html(data.log);
			}else{
				$("#log").css("display","none");
			}
		}
	});
}

/* 模板框架扩展方法定义 */
function initHandlebars(){
	Date.prototype.Format = function(fmt){ //author: meizz
		var o = {
		  "M+" : this.getMonth()+1,                 //月份
		  "d+" : this.getDate(),                    //日
		  "h+" : this.getHours(),                   //小时
		  "m+" : this.getMinutes(),                 //分
		  "s+" : this.getSeconds(),                 //秒
		  "q+" : Math.floor((this.getMonth()+3)/3), //季度
		  "S"  : this.getMilliseconds()             //毫秒
		};
		if(/(y+)/.test(fmt))
		  fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
		  if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
	}
	
	//juicer格式化时间
	juicer.register("formatTimeYear",function(time){
		if(time==null || time==''){
			return '';
		}
	    var myDate = new Date(time);
	    return myDate.Format('yyyy-MM-dd hh:mm:ss');
	});
	//juicer格式化时间
	juicer.register("formatTime",function(time){
		if(time==null || time==''){
			return '';
		}
		var myDate = new Date(time);
		return myDate.Format('hh:mm:ss');
	});
	juicer.register("event",function(val){
		if(val=='0'){
			return '等待处理';
		}else if(val=='1'){
			return '正在处理';
		}else if(val=='2' || val=='3'){
			return '等待复查';
		}else{
			return '处理完成';
		}
	});
	juicer.register("events",function(val){
		if(val=='0'){
			return 'await';
		}else if(val=='1'){
			return 'underway';
		}else if(val=='2' || val=='3'){
			return 'review';//'accomplish';
		}else{
			return 'accomplish';
		}
	});
	juicer.register("problem",function(val){
		if(val=='0'){
			return '门前垃圾';
		}else if(val=='1'){
			return '违章占道';
		}else if(val=='2'){
			return '设施损坏';
		}else if(val=='3'){
			return '治安威胁';
		}else if(val=='4'){
			return '违章停车';
		}else if(val=='5'){
			return '其他';
		}
	});
	juicer.register("getScore",function(obj){
		var deal=obj.deal;
		var eventType=obj.eventType;
		var score=obj.score;
		var scoreProject=obj.scoreProject;
		var result=0;
		if(eventType==0){
			if(deal==1){
				result=scoreProject.score;
			}else{
				result=scoreProject.score*2;
			}
		}else{
			if(deal==1){
				result=score.score;
			}else{
				result=score.score*2;
			}
		}
		return result;
	});
}

/* 滑动插件初始化方法 */
function gallery(){
	if($('#image-gallery1 li').length > 3){
		$('#image-gallery1').lightSlider({
			item: 3,                        //同时显示的slide的数量
	        autoWidth: false,               //定制每一个slide的宽度 
	        slideMove: 1,                   //同一时间被移动的slide的数量
	        slideMargin: 10,                //每一个slide之间的间距
	        addClass: '',                   //为幻灯片添加额外的class
	        mode: 'slide',                  //使用的模式
	        useCSS: true,                   //是否使用CSS样式
	        cssEasing: 'ease',              //CSS过渡动画使用的easing效果 easing string 'linear' jQuery过渡动画使用的easing效果
	        easing: 'linear',               //使用的动画效果
	        speed: 400,                     //动画时间
	        auto: false,                    //是否自动播放
	        pauseOnHover: true,             //鼠标滑过时停止自动播放
	        loop: false,                    //是否循环播入
	        slideEndAnimation: true,        //允许slideEnd动画
	        pause: 2000,                    //播放的间隔时间
	        keyPress: false,                //支持键盘操作
	        controls: false,                //显示按钮
	        prevHtml: '',                   //上一张按钮html内容
	        nextHtml: '',                   //下一张按钮html内容
	        rtl: false,                     //改变方向，从右到左
	        adaptiveHeight: false,          //基于各个slide的高度来动态调整幻灯片的高度
	        vertical: false,                //制作垂直幻灯片效果
	        verticalHeight: 394,            //垂直幻灯片模式中设置slide的高度（如果slide数量大于1）
	        vThumbWidth: 100,               //垂直幻灯片模式中缩略图的宽度
	        thumbItem: 5,                   //同时显示缩略图的数量
	        pager: true,                    //分页
	        gallery: true,                  //是否使用画廊
	        galleryMargin: 3,               //画廊和slide之间的间距
	        thumbMargin: 3,                 //缩略图间距
	        currentPagerPosition: 'middle', //当前页显示的方式
	        enableTouch: true,              //是否支持移动触摸
	        enableDrag: true,               //是否支持桌面设备中使用鼠标拖拽切换幻灯片
	        freeMove: true,                 //是否允许在swipe或drag的时候自由移动幻灯片
	        swipeThreshold: 40,             //动画缓冲阀值
	        responsive: [],                 //单独设置每一个breakpoint 
	        /* jshint ignore:start */
	        onBeforeStart: function ($el) {},
	        onBeforeSlide: function ($el, scene) {},
	        onAfterSlide: function ($el, scene) {},
	        onBeforeNextSlide: function ($el, scene) {},
	        onBeforePrevSlide: function ($el, scene) {},
	        onSliderLoad: function() {
	        	$('#image-gallery1').removeClass('cS-hidden');
	        	$('#image-gallery1').css('height',($(window).width()-20)/3+'px');
	        	$('.lSPager').css('display','none');
	        	$('#image-gallery1').find('img').click(function(){
	    			$('#max_img').css('display','block');
					$('#max_img img').attr('src',$(this).attr('src'));
	    		});
	        }  
	        /* jshint ignore:end */
	    });
	}else{
		var divf = $('#image-gallery1').closest('div');
    	var div1 = $('<div></div>').append($('#image-gallery1')).addClass('lSSlideWrapper usingCss');
		var div2 = $('<div></div>').append(div1).addClass('lSSlideOuter');
		divf.html(div2);
		$('#image-gallery1').addClass('lightSlider lSSlide').removeClass('cS-hidden');
		var width = ($(window).width()-40)/3;
		$('#image-gallery1 li').css('width',width+'px').css('margin-right','10px');
		$('#image-gallery1 li:last').css('margin-right','0px');
		$('#image-gallery1').find('img').click(function(){
			$('#max_img').css('display','block');
			$('#max_img img').attr('src',$(this).attr('src'));
		});
	}
}