/**
 * Created by polarsky on 15/7/26.
 */
var img=new Array();
var sw=0;
var g_count;
$(document).on("pageinit","#challenge",function(){
    wx.error(function(res){
        alert(res.errMsg);
        $('#guanzhu').slideDown('slow', function(){alert('请先关注我（长按二维码，选择“识别图中二维码”）,否则功能无法实现哦');});
    });
    wx.ready(function(){
        wx.onMenuShareTimeline({
            title: '［百姓网/测试］看看你的嘴有多利索', // 分享标题
            link: 'http://www.polarsky.cc/jump.html', // 分享链接
            imgUrl: 'http://www.polarsky.cc/favicon.ico', // 分享图标
            success: function () {
                alert("感谢你的支持！");
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            },
            fail: function(msg){
                alert(msg);
            }
        });
        wx.onMenuShareAppMessage({
            title: '［百姓网/测试］看看你的嘴有多利索', // 分享标题
            desc: '5秒钟内你能说多少次“百姓网”？', // 分享描述
            link: 'http://www.polarsky.cc/jump.html', // 分享链接
            imgUrl: 'http://www.polarsky.cc/favicon.ico', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            success: function () {
                // 用户确认分享后执行的回调函数
                alert("感谢你的支持！");
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
    wx.config({
        'debug': true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        'appId': 'wx26c652b1b427bcfd', // 必填，公众号的唯一标识
        'timestamp': timestamp, // 必填，生成签名的时间戳
        'nonceStr': nonceStr, // 必填，生成签名的随机串
        'signature': signature,// 必填，签名，见附录1
        'jsApiList': ['onMenuShareAppMessage','onMenuShareTimeline','chooseImage','previewImage','uploadImage','downloadImage', 'getLocation',
            'openLocation', 'scanQRCode', 'startRecord', 'stopRecord', 'translateVoice', 'playVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
});
function uploadImg(event)
{
    wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            function up(i) {
                if(i>=localIds.length)
                {
                    if(i==0)
                    {
                        alert("no picture chosen");
                    }
                    else
                    {
                        alert("all picture uploaded");
                    }
                    return;
                }
                wx.uploadImage({
                    localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        img.push(serverId);
                        $.post("upload",
                            serverId,
                            function (data, status) {
                            });
                        up(i+1);
                    }
                });
            }
            up(0);
        }
    });
}
$('#downloadImage').click(function ()
{
    function download(imgList, i) {
        if(i>=imgList.length)
        {
            if(i==0)
            {
                alert("no img uploaded, upload some imgs first");
            }
            else
            {
                alert("all img downloaded");
            }
            return;
        }
        wx.downloadImage({
            serverId: imgList[i],
            success: function (res) {
                $("body").prepend("<div class='container'><img src='"+res.localId+"' ></div>");
                download(i+1);
            }
        });
    }
    download(img, 0);
});

$('#getlocation').click(function()
{
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            alert("your position is:\nlatitude: "+latitude+"\n longtitude: "+longitude+"\n\
                speed: "+speed+"m/s\naccuracy: "+accuracy+"m");
        }
    });
})
$('#showmeonmap').click(function(){
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            wx.openLocation({
                latitude: res.latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: res.longitude, // 经度，浮点数，范围为180 ~ -180。
                name: 'me', // 位置名
                address: 'i am here', // 地址详情说明
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        }
    });
})
$('#saoyisao').click(function(){
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            alert(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
        }
    });
})
$('#tingting').click(function(){
    wx.startRecord();
    timeRest=5;
    alert($('#tingting h1').html());
    $('#tingting h1').html('录音还有'+timeRest+'s');
    $('#tingting').buttonMarkup('refresh');
    $('#tingting').button( "refresh" );
    countdown=setInterval("$('#opopop').html('录音还有'+(timeRest-=1)+'s')", 1000);
    setTimeout('uploadvoice()', 5000);
});

$('#showattached').click(function(){
    if (sw==0)
    {
        $('#showattached').html("<h1>隐藏附加功能</h1>");
        sw=1;
    }
    else
    {
        $('#showattached').html("<h1>显示附加功能</h1>");
        sw=0;
    }
    $('.attached').slideToggle('slow');
});

$('#savescore').click(function(){
    $.post("score",
        {
            'score': g_count,
            'nickname': getParameter('nickname'),
            'openid': getParameter('openid')
        },
        function (data, status) {
            alert('上传完成');
            showranking();
        });
});

$('#abundon').click(function(){
    $('.scoreboard').fadeOut();
});

$('#showranking').click(showranking);
function showranking(){
    $.get("ranking",
        {},
        function(data, status){
            alert(data);
            $('.rankingboard').html('');
            $('.rankingboard').append('<div class="row">\
                            <div class="col-xs-6"><div class="jumbotron"><h1>昵称</h1></div></div>\
                            <div class="col-xs-6"><div class="jumbotron"><h1>分数</h1></div></div>\
                            </div>');
            var rank=JSON.parse(data);
            for(var i=0;i<rank.length;++i)
            {
                $('.rankingboard').append('<div class="row">\
                            <div class="col-xs-6"><div class="jumbotron"><h1>'+rank[i]['nickname']+'</h1></div></div>\
                            <div class="col-xs-6"><div class="jumbotron"><h1>'+rank[i]['score']+'</h1></div></div>\
                            </div>');
            }
            $('.rankingboard').append('<div class="row">\
                            <div class="col-xs-6 col-xs-offset-3" id="hiderankingboard"><div class="jumbotron"><h1>隐藏</h1></div></div>\
                            </div>');
            $('.speakracer').slideUp('slow');
            $('.scoreboard').slideUp('slow', function(){$('.rankingboard').slideDown('slow');});
            $('#hiderankingboard').click(function(){
                $('.rankingboard').slideUp('slow', function(){
                    $('.speakracer').slideDown('slow');
                });
            });
        });
}
function countTimes(str, tar)
{
    var count=0;
    var last=0;
    while(str.indexOf(tar, last)!=-1)
    {
        last=str.indexOf(tar, last)+tar.length;
        count++;
    }
    return count;
}
function uploadvoice()
{
    clearInterval(countdown);
    $('#tingting h1').html('点我开始说话');
    wx.stopRecord({
        success: function (res) {
            //alert(res.localId);/*
            wx.translateVoice({
                localId: res.localId, // 需要识别的音频的本地Id，由录音相关接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res1) {
                    alert(res1.translateResult); // 语音识别的结果
                    g_count=countTimes(res1.translateResult, "百姓网");
                    showScore(g_count);
                },
                fail: function(res1){
                    alert(res.errMsg);
                }
            });
        }
    });
}

function showScore(count)
{
    $.get("ranking",
        {},
        function(data, status){
            var rank=JSON.parse(data);
            var total=rank.length;
            var number=1;
            while(parseInt(rank[number-1]['score'])>count)
            {
                number++;
                if(number==total) break;
            }
            //alert('i am here now');
            $('#noticeforscore').html("恭喜你，"+getParameter("nickname")+"！你在5秒时间内共说出"+count+"次“百姓网”，在"+total+"人中排名第"+number+"。" +
                "是否需要保留成绩？");
            $('.scoreboard').fadeIn('slow', function () {
                alert("快右上角分享给大家吧！");
            });
        });
}

function getParameter(name)
{
    if(location.search.indexOf(name)==-1){
        return null;
    }
    return location.search.slice(location.search.indexOf(name)+name.length+1,
        location.search.indexOf('&', location.search.indexOf(name))==-1?location.search.length:location.search.indexOf(
            '&', location.search.indexOf(name)));
}