var load_time = 0;
var index_ = 0;//滚动加载标示,在滚动方法外部AJAX中重置
$(function(){
	$('body').append('<div class="Load_Animation"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>');
	if($('.weui-tabbar').length>0)$('body').css('padding-bottom','50px');
});

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

/**
 * 加载动画停止
 * @param index
 */
function stop_animation(index){
	load_time++
	if(load_time==index){
		//图片滚动加载初始化
		$('.Load_Animation').css('display','none');
	}
}

/**
 * 获取项目路径
 * @param path
 * @returns {string}
 */
function getContextPath(path){
	return App.ctx+path;
}

/**
 * 获取项目的跟路径
 * eg：http(s)://www.baidu.com[:8080]/
 * @param path	必须以"/"开头
 */
function getRootHost(path){
	return App.rootHost+path;
}
/*
 * 确定弹窗
 * hintText-弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内
 */
function toolTip(hintText){
	var $Dialog1 = $('#Dialog1');
	var html = '';
	if($Dialog1.length<=0){
		html = '<div class="js_dialog" id="Dialog1" style="display: none;">\
            <div class="weui-mask"></div>\
            <div class="weui-dialog">\
                <div class="weui-dialog__bd">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>\
                <div class="weui-dialog__ft">\
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>\
                </div>\
            </div>\
        </div>'
		$('body').append(html);
	}
	$Dialog1 = $('#Dialog1');
	$Dialog1.find('.weui-dialog__bd').html(hintText);
	$Dialog1.find('.weui-dialog__btn_primary').on('click',function(){$Dialog1.fadeOut(200);});
	$Dialog1.fadeIn(200);
}
/*
 * 确定弹窗
 * titleText-弹窗标题
 * hintText-弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内
 * defaultText-弹窗辅助操作按钮名称--默认取消
 * primaryText-弹窗主操作按钮名称--默认确定
 * defaultMethod-弹窗辅助操作按钮函数--默认关闭弹窗
 * primaryMethod-弹窗主操作按钮函数--必填方法
 * 示例
 * operationToolTip('测试1','测试文本','算了吧','好，就这样',undefined,function(){
		$(this).parents('.js_dialog').fadeOut(200);
	});
 */
function operationToolTip(titleText,hintText,defaultText,primaryText,defaultMethod,primaryMethod){
	var $Dialog2 = $('#Dialog2');
	var html = '';
	if($Dialog2.length<=0){
		html = '<div class="js_dialog" id="Dialog2" style="display: none;">\
            <div class="weui-mask"></div>\
            <div class="weui-dialog">\
                <div class="weui-dialog__hd"><strong class="weui-dialog__title">弹窗标题</strong></div>\
                <div class="weui-dialog__bd">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>\
                <div class="weui-dialog__ft">\
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">辅助操作</a>\
                    <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">主操作</a>\
                </div>\
            </div>\
        </div>'
		$('body').append(html);
	}
	$Dialog2 = $('#Dialog2');
	if(defaultText==undefined){defaultText = '取消'}
	if(primaryText==undefined){primaryText = '确定'}
	if(defaultMethod==undefined){defaultMethod = function(){$Dialog2.fadeOut(200);}}
	$Dialog2.find('.weui-dialog__hd .weui-dialog__title').html(titleText);//提示标题
	$Dialog2.find('.weui-dialog__bd').html(hintText);//提示文本
	$Dialog2.find('.weui-dialog__btn_default').html(defaultText);//辅助操作名称
	$Dialog2.find('.weui-dialog__btn_primary').html(primaryText);//主操作名称
	$Dialog2.find('.weui-dialog__btn_default').on('click',defaultMethod);//辅助操作
	$Dialog2.find('.weui-dialog__btn_primary').on('click',primaryMethod);//主操作
	$Dialog2.fadeIn(200);
}
/*
 * 成功弹窗弹窗
 * 示例
 * operationToolTip('测试1','测试文本','算了吧','好，就这样',undefined,function(){
		$(this).parents('.js_dialog').fadeOut(200);
	});
 */
//初始化参数
var initialParameterInset = {
	state: 'succeed', //状态标识 succeed--成功 warn--失败
	insetTitle: '操作成功', //提示标题
	insetDesc: '内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现', //提示文字   
	insetPrimaryText: '返回首页', //主操作按钮名称
	insetDefaultText: '留在这里', //辅助操作按钮名称
	insetPrimaryMethod: function(){window.location.reload()}, //主操作按钮方法
	insetDefaultMethod: function(){window.location.reload()}, //辅助操作按钮方法
}
function Inset(userObj){
	for(var obj in userObj){
		initialParameterInset[obj]=userObj[obj]
	}
	var $Inset1 = $('#Inset1');
	var html = '';
	if($Inset1.length<=0){
		html = '<div id="Inset1" class="inset">\
		    <div class="weui-msg">\
		        <div class="weui-msg__icon-area"></div>\
		        <div class="weui-msg__text-area">\
		            <h2 class="weui-msg__title">操作成功</h2>\
		            <p class="weui-msg__desc">内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现</p>\
		        </div>\
		        <div class="weui-msg__opr-area">\
		            <p class="weui-btn-area">\
		                <a href="javascript:void(0);" class="weui-btn weui-btn_primary">推荐操作</a>\
		                <a href="javascript:void(0);" class="weui-btn weui-btn_default">辅助操作</a>\
		            </p>\
		        </div>\
		        <div class="weui-msg__extra-area">\
		            <div class="weui-footer">\
		                <p class="weui-footer__text">Copyright © 2008-2016 UID.io</p>\
		            </div>\
		        </div>\
		    </div>\
		</div>'
		$('body').append(html);
	}
	$Inset1 = $('#Inset1');
	if(initialParameterInset.state == 'succeed'){
		$Inset1.find('.weui-msg__icon-area').html('<i class="weui-icon-success weui-icon_msg"></i>');//提示状态
	}else{
		$Inset1.find('.weui-msg__icon-area').html('<i class="weui-icon-warn weui-icon_msg"></i>');//提示状态
	}
	$Inset1.find('.weui-msg__title').html(initialParameterInset.insetTitle);//提示标题
	$Inset1.find('.weui-msg__desc').html(initialParameterInset.insetDesc);//提示文本
	$Inset1.find('.weui-btn_default').html(initialParameterInset.insetDefaultText);//辅助操作名称
	$Inset1.find('.weui-btn_primary').html(initialParameterInset.insetPrimaryText);//主操作名称
	$Inset1.find('.weui-btn_default').on('click',initialParameterInset.insetDefaultMethod);//辅助操作
	$Inset1.find('.weui-btn_primary').on('click',initialParameterInset.insetPrimaryMethod);//主操作
	$Inset1.addClass('js_show');
}
/*
 * 成功提示
 * hintText-弹窗内容，告知当前状态，描述文字尽量控制在十个字符行内
 */
function succeedToolTip(hintText,succeedMethod){
	var $toast = $('#toast');
	var html = '';
	if($toast.length<=0){
		html = '<div id="toast" style="display: none;">\
	        <div class="weui-mask_transparent"></div>\
	        <div class="weui-toast">\
	            <i class="weui-icon-success-no-circle weui-icon_toast"></i>\
	            <p class="weui-toast__content">已完成</p>\
	        </div>\
	    </div>'
		$('body').append(html);
	}
	$toast = $('#toast');
	$toast.find('.weui-toast__content').html(hintText);
	if ($toast.css('display') != 'none') return;
    $toast.fadeIn(100);
    setTimeout(function(){
    	succeedMethod();
        $toast.fadeOut(100);
    }, 2000);
}
/*
 * 加载提示
 */
function loadToolTip(){
	var $loadingToast = $('#loadingToast');
	var html = '';
	if($('#loadingToast').length<=0){
		html = '<div id="loadingToast" style="display: none;">\
	        <div class="weui-mask_transparent"></div>\
	        <div class="weui-toast">\
	            <i class="weui-loading weui-icon_toast"></i>\
	            <p class="weui-toast__content">数据加载中</p>\
	        </div>\
	    </div>'
		$('body').append(html);
	}
	$loadingToast = $('#loadingToast');
	if ($loadingToast.css('display') != 'none') return;
	$loadingToast.fadeIn(100);
    return $('#loadingToast').get(0);
}
/*     web相关js代码片段     */

// 添加Cookie
function addCookie(name, value, options) {
	if (arguments.length > 1 && name != null) {
		if (options == null) {
			options = {};
		}
		if (value == null) {
			options.expires = -1;
		}
		if (typeof options.expires == "number") {
			var time = options.expires;
			var expires = options.expires = new Date();
			expires.setTime(expires.getTime() + time * 1000);
		}
		document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires ? "; expires=" + options.expires.toUTCString() : "") + (options.path ? "; path=" + options.path : "") + (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "");
	}
}

// 获取Cookie
function getCookie(name) {
	if (name != null) {
		var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
		return value ? decodeURIComponent(value[1]) : null;
	}
}

// 移除Cookie
function removeCookie(name, options) {
	addCookie(name, null, options);
}
//查看大图方法
function maxImg(obj){
	if($('#max_img').html()==undefined){
		$('body').append('<div id="max_img" onclick="$(\'#max_img\').css(\'display\',\'none\');" style="display: none; width: 100%; position: fixed; top: 0; left: 0; z-index: 999; background-color: rgba(0, 0, 0, 0.39);"><img alt="查看大图" src="images/default_shop_publicity_img.png" onerror="javascript:this.src = \'images/default_shop_publicity_img.png\'" style="width: 100%;position: absolute;top: 50%;left: 0;margin-top: -50%;"></div>')
	}
	$('#max_img').css('height',$(window).height()+'px');
	$('#max_img img').css('line-height',$(window).height()+'px');
	$('#max_img').css('display','block');
	$('#max_img img').attr('src',$(obj).attr('src'));
}

/*
 * 滚动加载分页
 * obj: 判断距离顶部高度的元素，取最底部元素
 * distance：距离可是窗口多少像素，加载下一页
 * method： 加载下一页方法
 */
function rollUpload(obj,distance,method){
	$('#'+obj).before('<div class="weui-loadmore">\
            <i class="weui-loading"></i>\
            <span class="weui-loadmore__tips">正在加载</span>\
        </div>')
	$(window).scroll(function() {
		//console.log(jQuery(window).scrollTop()+jQuery(window).height()+distance);
		if((jQuery(window).scrollTop()+jQuery(window).height()+distance)>=jQuery('#'+obj).offset().top && index_==0){
			index_++
			method();
		}
	});
};

/*
 * 时间格式化方法
 * date： 时间参数
 */
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