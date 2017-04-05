$(document).ready(function() {

    //上线信号
    socket.emit("online", { user: from });
    socket.on("online", function(data) {
        //显示系统消息
        console.log(data);
        if (data.user !== from) {
            var sys = '<div style="color:#f00">系统(' + now() + '):' + '用户 ' + data.user + ' 上线了！</div>';
        } else {
            var sys = '<div style="color:#f00">系统(' + now() + '):你进入了聊天室！</div>';
        }
        $("#contents").append(sys + "<br/>");
        //刷新在线列表
        flushUsers(data.users);
        //显示正在对谁对话
        showSayTo();
    })
});
    var socket = io.connect();
    var from = $.cookie("user");
    var to = "all";
//刷新在线用户
function flushUsers(users) {
    $("#list").empty().append('<li title="双击聊天" alt="all" class="sayingto" onselectstart="return false">所有人</li>');
    for (var i in users) {
        $("#list").append('<li alt="' + users[i] + '" title="双击聊天" onselectstart="return false">' + users[i] + '</li>');
    }
    //双击对某人聊天
    $("#list > li").dblclick(function() {
        //如果不是双击的自己的名字
        if ($(this).attr('alt') != from) {
            //设置被双击的用户为说话对象
            to = $(this).attr('alt');
            //清除之前的选中效果
            $("#list > li").removeClass('sayingto');
            //给被双击的用户添加选中效果
            $(this).addClass('sayingto');
            //刷新正在对谁说话
            showSayTo();
        }
    });
}
//显示正在对谁说话
function showSayTo() {
    $("#from").html(from);
    $("#to").html(to == "all" ? "所有人" : to);
} //获取当前时间
function now() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
}
