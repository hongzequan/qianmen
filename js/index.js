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