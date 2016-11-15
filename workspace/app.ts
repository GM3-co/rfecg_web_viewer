'use strict';
import * as express from 'express';
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let net = require('net');
let path = require('path');

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, './public')));

let routes = require('./app/routes/index');

app.use('/', routes);
app.use('/index.html', routes);
app.use('/index.htm', routes);

app.use((req, res, next) => {
  res.status(404);
  res.render('404');
});

io.on('connection', (socket) => {
});

/**
 * ECG中継器からのデータ受信・ブラウザへのsocket.ioを使用したデータ送信
 */
let tcpServer = net.createServer();
tcpServer.on('connection', (connection) => {
  connection.on('connect', () => { });
  connection.on('data', (data) => {
    // socket.ioを使ってデータ送信
    io.emit('data', data.toString());
    // console.log(data.toString());
  });
});

tcpServer.listen(50001);
http.listen(8080);
