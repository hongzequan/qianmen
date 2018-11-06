var aiiUpload_id={};
(function($){
	$.fn.extend({
		aiiUpload : function(obj) {
			if (typeof obj != "object") {
				alert('参数错误');
				return;
			}
			aiiUpload_id[obj.plug_id] = 0;
			var file_num = 0;
			var fileInput = $(this);
			var fileInputId = fileInput.attr('id');
			createDoc('#' + fileInputId);
			$('#aii_file').on('change',function(){
				if(obj.astrict==undefined || $('input[name="'+obj.name+'"]').length<obj.astrict){
					var file = this.files[0];
					if (file){
						var orientation;
						//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
						EXIF.getData(file,function(){
						    orientation=EXIF.getTag(this,'Orientation');
						});
						var reader = new FileReader();
						reader.onload = function(e) {  
						    getImgData(this.result,orientation,function(data){
						    	imgBefore(data, file_num, obj.plug_id);
						    	add_doc(data, file_num, obj.formId, obj.plug_id, obj.name);
						    	if($('input[name="'+obj.name+'"]').length==obj.astrict){$('.fileBox').css('display','none');}
						    }); 
						}
						aiiUpload_id[obj.plug_id]=aiiUpload_id[obj.plug_id]+1;
						file_num++
						reader.readAsDataURL(file);
					}
				}
			});
		}
	});
})(jQuery);
function createDoc(objID) {
	var element = $(objID);
	element
			.append('<ul class="viewList"></ul>')
			.append(
					'<div class="fileBox"><i class="uploading-icon"></i><input type="file" accept="image/*" capture="camera" id="aii_file" /><div class="file_bg"></div></div>')
			.append('<canvas id="canvas" style="display: none;"></canvas>');
}
//建立一個可存取到該file的url
function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}
//图片预览
function imgBefore(objUrl, idnum, plug_id){
	var li = '<li class="view"><img src="'
			+ objUrl
			+ '" idnum="'
			+ plug_id +"_"+idnum
			+ '" plug_id="'
			+ plug_id
			+ '" onclick="maxImg(this)" /><div class="close" onclick="img_remove(this);"></div></li>'
	$('.viewList').append(li);
}
//form表单添加
function add_doc(base, idnum, formId, plug_id ,name){
	$('#'+formId).append(
			'<input type="hidden" name="'+name+'" id="f_' +plug_id+"_"+idnum
					+ '" value="' + base + '"/>');
}
function img_remove(element) {
	var num = $(element).prev().attr('idnum');
	var plug_id = $(element).prev().attr('plug_id');
	$(element).parent().remove();
	var name = $('#f_' + num).attr('name');
	$('#f_' + num).remove();
	aiiUpload_id[plug_id]=aiiUpload_id[plug_id]-1;
	$('.fileBox').css('display','block');
	console.log('已删除：#f_' + num);
}
// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img, dir, next) {
	var image = new Image();
	image.onload = function() {
		var degree = 0, drawWidth, drawHeight, width, height;
		drawWidth = this.naturalWidth;
		drawHeight = this.naturalHeight;
		//以下改变一下图片大小
		var maxSide = Math.max(drawWidth, drawHeight);
		if (maxSide > 1024) {
			var minSide = Math.min(drawWidth, drawHeight);
			minSide = minSide / maxSide * 1024;
			maxSide = 1024;
			if (drawWidth > drawHeight) {
				drawWidth = maxSide;
				drawHeight = minSide;
			} else {
				drawWidth = minSide;
				drawHeight = maxSide;
			}
		}
		var canvas = document.createElement('canvas');
		canvas.width = width = drawWidth;
		canvas.height = height = drawHeight;
		var context = canvas.getContext('2d');
		//判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
		switch (dir) {
		//iphone横屏拍摄，此时home键在左侧
		case 3:
			degree = 180;
			drawWidth = -width;
			drawHeight = -height;
			break;
		//iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
		case 6:
			canvas.width = height;
			canvas.height = width;
			degree = 90;
			drawWidth = width;
			drawHeight = -height;
			break;
		//iphone竖屏拍摄，此时home键在上方
		case 8:
			canvas.width = height;
			canvas.height = width;
			degree = 270;
			drawWidth = -width;
			drawHeight = height;
			break;
		}
		//使用canvas旋转校正
		context.rotate(degree * Math.PI / 180);
		context.drawImage(this, 0, 0, drawWidth, drawHeight);
		//返回校正图片
		next(canvas.toDataURL("image/jpeg", .8));
	}
	image.src = img;
}