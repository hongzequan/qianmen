var app;
$(function() {
	initHandlebars();
	$.FormUtils.clearFormData('#paramForm');
	//底部导航栏选中
	$(".event_icon").parent().addClass('am-active');
	//上拉加载参数配置
    app = new EventsList(null, {
        api: App.ctx+'/r/event/findEventPage',
        params: {page: 1,rows: 5}
    });
    //上拉加载初始化
    app.init();
    //筛选按钮点击事件
    $('.screen_options').click(function(){
    	if($('.options_list').hasClass('block')){
    		$('.options_list').removeClass('block');
    		$('.shade').css('display','none');
    	}else{
    		$('.options_list').addClass('block');
    		$('.shade').css('display','block');
    	}
    });
    
    //空白区域点击关闭筛选框
    $('.options_list').click(function(){
    	if($('.options_list').hasClass('block')){
    		$('.options_list').removeClass('block');
    		$('.shade').css('display','none');
    	}else{
    		$('.options_list').addClass('block');
    		$('.shade').css('display','block');
    	}
    });
    //遮罩区域点击关闭筛选框
    $('.shade').click(function(){
    	if($('.options_list').hasClass('block')){
    		$('.options_list').removeClass('block');
    		$('.shade').css('display','none');
    	}else{
    		$('.options_list').addClass('block');
    		$('.shade').css('display','block');
    	}
    });
    //筛选按钮点击事件绑定
    $(".options_button").click(function(e){
    	var type= $(this).attr('data-val');
    	var $parent=$(this).parents("ul");
    	$("#"+$parent.attr('data-val')).val(type);
    	app.handlePullDown();
    	$(this).parents("ul").find('.options_button').removeClass("active");
        $(this).addClass("active");
        e.stopPropagation();
    });
    $(".screen_submit").on('click',function(){app.handlePullDown();});
	//滚动加载下一页
	rollUpload('pull-up',200,function(){
		app.handlePullUp();
	});
});

function initHandlebars(){
	Handlebars.registerHelper("isTimeout",function(val, options){
		if(val==1 || val==8){
			return options.fn(this);
		} 
	});
}

var EventsList = function(element, options) {
    var $main = $('#wrapper');
    var $list = $main.find('#html_content');

    this.page = options.params.page;
    this.next = options.params.rows;
    this.total = null;
    this.getURL = function(params,pageNum) {
    	params["pageNum"] = pageNum;
        params["pageSize"] = params.rows;
        params["handlUser.id"] = $("#patrol").val();
        return options.api + '?' + $.param(params);
    };

    this.renderList = function(page, type){
    	var _this = this;
        var param_ = {};
        $.FormUtils.convertFormDataToObj('#paramForm',param_);
        param_.pageNum=page;
        param_.pageSize=options.params.rows;
        $.ajax({
    		type : "post",
    		dataType : "json",
    		url : options.api,
    		data : param_,
    		success : function(res) {
    			var _page = res;
	            _this.total = _page.totalSize;
	            _this.page = _this.page + 1;
	            var compiler = Handlebars.compile($("#template").html());
	            var html='';
	            if(_page.results.length != 0){
	            	html = compiler(_page.results);
	            }else{
	            	html = '<div class="not_available" style="width: 100%; text-align: center; padding: 70px 0; background: #fff;">\
	            				<img alt="暂无数据" src="'+App.staticPath+'/images/not_available_list.png" width="100" />\
	            				<p class="not_available_text">暂无事件记录</p>\
            				</div>'
	            }
	            if (type === 'load') {
	            	$list.append(html);
	            } else {
	            	$list.html(html);
	            }
	            if(_page.results.length==0){
	            	$('#drop-down').remove();
	        		$('#pull-up-label').remove();
	        	}
	            if($('#html_content .line').length<Math.ceil($(window).height()/70)){
	            	$('#drop-down').remove();
	        		$('#pull-up-label').html('别刷了，没有了');
	        	}
	            index_ = 0;
    		}
    	});
    };

    this.init = function(){
        this.renderList(options.params.page,null);
    };

    this.handlePullDown = function() {
        this.next = options.params.rows;
        this.page = options.params.page;
        console.log('刷新');
		this.renderList(1, null);
    };

    this.handlePullUp = function() {
        console.log('加载');
        if (this.next < this.total) {
        	this.next += options.params.rows;
        	this.renderList(this.page, 'load');
        }else{
        	$('#drop-down').remove();
        	$('#pull-up-label').html('别刷了，没有了');
        }
    }
};