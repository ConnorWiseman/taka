'use strict';

var config = require('./config.js'),
    io = require('socket.io').listen(config.port, { path: '/chat' });

var mongoose = require('mongoose');
mongoose.connect(config.mongodb.dbURI());

var Models = require('./models');

var Middleware = require('./middleware')(io);

io.use(Middleware.SessionHandler);
io.use(Middleware.Permissions);
io.use(Middleware.BanManager);
io.use(Middleware.Channels);
io.use(Middleware.SocketEvents);