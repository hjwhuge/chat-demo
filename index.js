const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	// 用户新连接触发，全局提示有用户登录
	// io.emit('chat Notice','a user connected');
  	// console.log('a user connected');
  	// 用户关闭连接触发方法
	socket.on('disconnect', (data) => {
    	// console.log(data);
		// 全局提示有用户退出
		io.emit('chat Notice','user disconnected');
	});
	// 用户登录触发方法
  	socket.on('chat login', (nickname) => {
		io.emit('chat Notice',`欢迎${nickname}进入在线聊天室`); 
  	});
	// 用户发送消息触发方法
  	socket.on('chat message', (data) => {
    	console.log('message: ' + data);
		// socket.broadcast.emit('chat message',data);
		io.emit('chat message',data); 
  	});
});


http.listen(80, () => {
  console.log('listening on *:3000');
});