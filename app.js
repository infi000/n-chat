var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require("http");
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
var users = {};

io.sockets.on("connection", function(socket) {
    //有人上线
    socket.on("online", function(data) {
        socket.name = data.user;
        if (!users[data.user]) {
            users[data.user] = data.user;
        }
        io.sockets.emit("online", { users: users, user: data.user });
    })

});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);


app.get("/", function(req, res) {
    if (req.cookies.user == null) {
        res.redirect("/singin");
    } else {
        res.sendfile("views/index.html");
    }
});
app.get("/singin", function(req, res) {
    res.sendfile("views/singin.html");
});
app.post("/singin", function(req, res) {
    console.log(req);
    if (users[req.body.name]) {
        res.redirect("/signin");
    } else {
        res.cookie("user", req.body.name, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        res.redirect("/");
    }
});



server.listen(3000, function() {
    console.log("Express server listening on port 3000");
});
