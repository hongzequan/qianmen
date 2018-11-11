var conceal_close;


/* 定时隐藏活动弹窗 */
function conceal() {
    $('#publicity').css('display', 'none');
    clearInterval(conceal_close);
}

function initElement() {
    conceal_close = setTimeout('conceal()', 3000);
}

$(function() {
    initElement();
    initMap();
    countTime();
})
window.onload = function() {
    stop_animation();
}

$('#my_tab2 .am-tabs-nav').find('a').click(function() {
    $(this).closest('ul').find('li').removeClass('am-active');
    $(this).closest('li').addClass('am-active');
    $(this).closest('.am-tabs').find('.am-tab-panel').removeClass('am-active');
    $("" + $(this).attr('data-href')).addClass('am-active');
});
$('#my_tab1 .am-tabs-nav').find('a').click(function() {
    $(this).closest('ul').find('li').removeClass('am-active');
    $(this).closest('li').addClass('am-active');
    $(this).closest('.am-tabs').find('.am-tab-panel').removeClass('am-active');
    $("" + $(this).attr('data-href')).addClass('am-active');
});
//图片滚动加载初始化
$("#my_tab1 img").lazyload({
    placeholder: 'images/loading-img.gif',
    effect: "fadeIn",
    threshold: 50,
    failurelimit: 1
});

/* 加载动画停止 */
function stop_animation() {
    //图片滚动加载初始化
    $('.Load_Animation').css('display', 'none');
}

$(".main_report_footer .footer_save").on('click',function(){
    layer.open({
        type: 0,
        content: "举报成功！<br/>您已行使了门前三包监督权力",
    })
});
// $(".main_report_footer .footer_save").on('click',function(){
//     layer.open({
//         type: 0,
//         content: "该问题刚被举报过<br/>商家正在积极处理中~",
//     })
// });

//群众举报－tab
$('#people_tab .report_tab').find('a').click(function(){
    $(this).closest('.report_tab').find('a').removeClass('tab_active');
    $(this).addClass('tab_active');
    $(this).closest('.people_tab').find('.people_panel').removeClass('tab_active');
    $(""+$(this).attr('data-href')).addClass('tab_active');
});

/* 百度地图调用方法 */
function initMap(){
    // 百度地图API功能
    var map = new BMap.Map("allmap");    // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别

    function myFun(result){
        var cityName = result.name;
        map.setCenter(cityName);
    }
    var myCity = new BMap.LocalCity();
    myCity.get(myFun);

    var geolocation = new BMap.Geolocation();  //实例化浏览器定位对象。
    geolocation.getCurrentPosition(function(r){   //定位结果对象会传递给r变量

        if(this.getStatus() == BMAP_STATUS_SUCCESS){  //通过Geolocation类的getStatus()可以判断是否成功定位。

            var mk = new BMap.Marker(r.point);    //基于定位的这个点的点位创建marker

            map.addOverlay(mk);    //将marker作为覆盖物添加到map地图上

            map.panTo(r.point);   //将地图中心点移动到定位的这个点位置。注意是r.point而不是r对象。

        } else {
            alert('failed'+this.getStatus());
        }

    },{enableHighAccuracy: true})
    // map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
}

// 获取当前地址信息
function getAddress(){
    var geolocation = new BMap.Geolocation();  //实例化浏览器定位对象。
    geolocation.getCurrentPosition(function(r) {   //定位结果对象会传递给r变量
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {  //通过Geolocation类的getStatus()可以判断是否成功定位。
            var geoc = new BMap.Geocoder();
            var pt = r.point;
            geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                document.getElementById('address').innerHTML = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            });
        } else {
            document.getElementById('address').innerHTML = "获取定位失败"
        }
    })
}

//获取当前时间
var date = new Date();
var now = date.getTime();
function countTime() {
    //设置截止时间
    var end = now+30*24*3600;

    //时间差
    var leftTime = end-(new Date().getTime());
    //定义变量 d,h,m,s保存倒计时的时间
    var d,h,m,s;
    if (leftTime>=0) {
        d = Math.floor(leftTime/1000/60/60/24);
        h = Math.floor(leftTime/1000/60/60%24);
        m = Math.floor(leftTime/1000/60%60);
        s = Math.floor(leftTime/1000%60);
    }
    //将倒计时赋值到div中
    document.getElementById("_h").innerHTML = h>9?h:'0'+h;
    document.getElementById("_m").innerHTML = m>9?m:'0'+m;
    document.getElementById("_s").innerHTML = s>9?s:'0'+s;
    //递归每秒调用countTime方法，显示动态时间效果
    setTimeout(countTime,1000);
}