'use strict';


var config = require('./config.js'),
    io = require('socket.io').listen(config.io.port, config.io.options),
    mongoose = require('mongoose');


mongoose.connect(config.db.URI);


mongoose.connection.on('connected', function() {
    var Models = require('./models'),
        Middleware = require('./middleware')(io);


    io.use(Middleware.Permissions);
    io.use(Middleware.Authorization);
    io.use(Middleware.Channels);
    io.use(Middleware.InitialEmit);
    io.use(Middleware.SocketEvents);


    console.log('Server now listening on port ' + config.io.port + '.');
});