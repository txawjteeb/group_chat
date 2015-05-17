var express = require("express");
var path = require("path");
var app = express();
// var routes = require('routes');
var server = app.listen(8000);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var history = [];

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
 res.render("index");
})

io.sockets.on('connection', function (socket) {
    var user = "";
    socket.on('got_a_new_user', function(name){
    	// console.log(name);
    	console.log('server history', history);
    	socket.emit('history', history);
		io.emit("new_user" , {name : name});
		user = name;	
	});
	// event.preventDefault(); 
	socket.on('send_text', function(data){
    	// console.log(data.text);
    	// console.log(data.name);
    	history.push(data);
		io.emit("new_text" , {text : data.text , name: data.name});
		console.log(history);
	});
	socket.on('disconnect', function () {
	    console.log('disconnect!');
	    console.log(socket.id);
	    console.log(user);
	    io.emit('user_left', user);
	});
	console.log('Listening to port:8000');
});

app.use(express.static(path.join(__dirname, "./static")));