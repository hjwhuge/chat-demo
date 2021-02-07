const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let numUsers = 0;

// js得到随机的颜色值
function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}

io.on('connection', (socket) => {
	// 用户新连接触发
  	// console.log('a user connected');
  	// 用户关闭连接触发方法
	socket.on('disconnect', (data) => {
    	// console.log(data);
		// 全局提示有用户退出
		io.emit('chat Notice',`${socket.username}离开在线聊天室`);
	});
	// 用户登录触发方法
  	socket.on('add user', (nickname) => {
  		// 用户登录记录昵称
  		socket.username = nickname;
  		socket.usercolor = randomColor();
  		// io.emit('chat Notice',`欢迎${socket.username}进入在线聊天室`); 
  		// 全局提示排除自己
		socket.broadcast.emit('chat Notice',`欢迎${socket.username}进入在线聊天室`); 
  	});
	// 用户发送消息触发方法
  	socket.on('new message', (msg) => {
    	// console.log('message: ' + msg);
		let data = {
          username: socket.username,
          usercolor: socket.usercolor,
          msg
        }
		io.emit('new message',data); 
  	});
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});