const app = require('express')();
const mysql = require('mysql');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const msg = [];

app.set('view engine', 'ejs');

const pool = mysql.createPool({
	connectinLimit : 100,
	host     : 'remotemysql.com',
	user     : 'RQSHf32ICl',
	password : 'uuKtBkypJs',
	database : 'RQSHf32ICl',
	debug : false
})

app.get('/', function (req, res) {
	res.render('index');
})

io.on('connection', function (socket) {
	console.log('a user is connected');
	// io.emit('init datatable', msg);
	socket.on('status added', function (status) {
		add_status(status, function (res) {
			io.emit('refresh feed', res);
		})
	})

	socket.on('delete item', function (index) {
		var data = msg[index];
		io.emit("item deleted", data);
		msg.splice(index, 1);
	})

	socket.on('edit data', function (index, newValue) {
		var data = msg[index];
		data.text = newValue;
		io.emit('item edited', data);
	})

})


var add_status = function (status, cb) {
	var data = {
		index : msg.length,
		id : Date.now() + Math.floor(Math.random(100, 1000)* 100000),
		text : status
	}

	msg.push(data);
	cb(data)
}

http.listen(3000, function () {
	console.log('listening on 3000')
})