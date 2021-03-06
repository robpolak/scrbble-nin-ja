var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var fileController = require('./src/fileController');
var scrabbleFileController = require('./src/scrabbleFileGenerator');
var app = express();
app.use(compression());

loadFile();

var logging = require('./src/core/logging');
global._logger = logging;

var config = require('./src/core/configuration');
global._config = config.getSettings();

global.scrabbleObj = {
    startsWith: {},
    endsWith: {},
    words: []
};


var checkDomain = function(req, res, next){
    if(req && req.headers && req.headers.host) {
        var fullUrl = req.protocol + '://' + req.headers.host + req.url;
        if(fullUrl.indexOf('www.') > 0) {
            fullUrl = fullUrl.replace('www.','');
            res.redirect(301, fullUrl);
            return;
        }
    }
    next();
}
app.use(checkDomain);

    var routes = require('./routes/index');


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', routes);




    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


    //get port from config
    var port = global._config.port;
    port = normalizePort(port || '3000');
    app.set('port', port);



    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });

    function loadFile(){
        var scrabbleController = require('./src/scrabbleFileGenerator');
        var path = require('path');
        scrabbleController.loadFile(path.join(__dirname, '/scrabble-files/wwf.txt'));
    }
