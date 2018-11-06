(function($) {
	var EventsList = function(element, options) {
	    var $main = $('#wrapper');
	    var $list = $main.find('#html_content');

	    this.page = options.params.page;
	    this.next = options.params.rows;
	    this.total = null;
	    this.getURL = function(params,pageNum) {
	    	params["pageNum"] = pageNum;
	        params["pageSize"] = params.rows;
	        params["state"] = $('.screen_tab.active').attr("data-val");
	        return options.api + '?' + $.param(params);
	    };

	    this.renderList = function(page, type){
	    	var _this = this;
	        $.getJSON(this.getURL(options.params, page)).then(function(res) {
	        	_this.total = res.totalSize;
	            _this.page = _this.page + 1;
	            var dealType = $('.screen .screen_tab.active').attr("data-val");
	            var compiler = Handlebars.compile($("script[data-val='"+dealType+"']").html());
	            var html = compiler(res);
	            if (type === 'load') {
					$list.append(html);
	            } else {
					$list.html(html);
	            }
	            $('.screen').removeClass('forbid');
	            if(res.results.length==0){
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
		
		Handlebars.registerHelper("Rank4",function(pageNum ,index,options){
			var serial = (pageNum-1)*10+(index+1);
				return options.fn(this);
		});
		
		Handlebars.registerHelper("getSerial",function(pageNum ,index){
			return (pageNum-1)*10+(index+1);
		});
		
		Handlebars.registerHelper("one",function(pageNum ,index,options){
			if((pageNum-1)*10+(index+1)==1){
				return options.fn(this);
			}
		});
		Handlebars.registerHelper("two",function(pageNum ,index,options){
			if((pageNum-1)*10+(index+1)==2){
				return options.fn(this);
			}
		});
		Handlebars.registerHelper("three",function(pageNum ,index,options){
			if((pageNum-1)*10+(index+1)==3){
				return options.fn(this);
			}
		});
		//底部导航栏选中
		$(".exposure_icon").parent().addClass('am-active');
		//上拉加载参数配置
	    var app = new EventsList(null, {
	        api: App.ctx+'/store/rankingStore',
	        params: {page: 1,rows: 10}
	    });
	    //上拉加载初始化
	    app.init();
	    //筛选按钮点击事件
	    $('.screen_tab').click(function(){
    		if(!$('.screen').hasClass('forbid')){
    			$('.screen_tab').removeClass('active');
    			$('.screen').addClass('forbid');
        		$(this).addClass('active');
        		app.handlePullDown()
        	}
	    });
	    //滚动加载下一页
		rollUpload('pull-up',200,function(){
			app.handlePullUp();
		});
	});
})(window.jQuery);