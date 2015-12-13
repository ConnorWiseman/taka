'use strict';


var config = require('./config.js'),
    io = require('socket.io').listen(config.port, { path: '/chat' }),
    mongoose = require('mongoose');


var dbURI = config.mongodb.dbURI();


mongoose.connect(dbURI);


mongoose.connection.on('connected', function() {
    var Models = require('./models'),
        Middleware = require('./middleware')(io);


    io.use(Middleware.Permissions);
    io.use(Middleware.Authorization);
    io.use(Middleware.SocketEvents);


    console.log('Server now listening on port ' + config.port + '.');
});