(function($) {
	Handlebars.registerHelper("Stats1",function(val,options){
		if(val==1){
			return options.fn(this);
		}
	});
	Handlebars.registerHelper("Stats2",function(val,options){
		if(val==2){
			return options.fn(this);
		}
	});
	Handlebars.registerHelper("Stats3",function(val,options){
		if(val==3){
			return options.fn(this);
		}
	});
	Handlebars.registerHelper("Stats4",function(val,options){
		if(val==4){
			return options.fn(this);
		}
	});
	Handlebars.registerHelper("Stats5",function(val,options){
		if(val==5){
			return options.fn(this);
		}
	});

	var EventsList = function(element, options) {
	    var $main = $('#wrapper');
	    var $list = $main.find('#html_content');

	    this.page = options.params.page;
	    this.next = options.params.rows;
	    this.total = null;
	    this.getURL = function(params,pageNum) {
			var $div = $(".options_button.active");
			params["pageNum"] = pageNum;
			params["pageSize"] = params.rows;
			params["shopName"] = $("#search_input").val();
			params["storeFirstOrder"] = "asc";
			if($div.attr("data-val")>=3 || $div.attr("data-val")==0){
				params["leStars"] = null;
				params["stars"] = $div.attr("data-val");
			}else if($div.attr("data-val")==-1) {
				params["stars"] = null;
				params["leStars"] = 2;
			}
	        return options.api + '?' + $.param(params);
	    };

	    this.renderList = function(page, type){
	    	var _this = this;
	        $.getJSON(this.getURL(options.params, page)).then(function(res) {
	            var _page = res.data.page;
	            _this.total = _page.totalSize;
	            _this.page = _this.page + 1;
	            var compiler = Handlebars.compile($("#template").html());
	            var html = compiler(_page);
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
	        }, function(e) {
	          	console.log(e);
	        }).always(function(){
	        	index_ = 0;
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
	$(function() {
		//底部导航栏选中
		$(".store_icon").parent().addClass('am-active');
		//上拉加载参数配置
	    var app = new EventsList(null, {
	        api: App.ctx+'/store/view/streetCentreData',
	        params: {page: 1,rows: 10}
	    });
	    //上拉加载初始化
	    app.init();
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
	    	$(this).parents("ul").find('.options_button').removeClass("active");
	        $(this).addClass("active");
	        app.handlePullDown();
	        e.stopPropagation();
	    });
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
		$("#search_submit").click(function () {
			app.handlePullDown();
		});
		//滚动加载下一页
		rollUpload('pull-up',200,function(){
			app.handlePullUp();
		});
	});
})(window.jQuery);