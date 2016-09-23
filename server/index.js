var app,
    bodyParser,
    cookieParser,
    environment,
    express,
    favicon,
    Handlebars,
    http,
    LocalStrategy,
    logger,
    mongoose,
    passport,
    port,
    routes,
    server,
    session,
    User;

express = require('express');
favicon = require('serve-favicon');
passport = require('passport');
bodyParser = require('body-parser');
cookieParser = require('cookie-parser');
LocalStrategy = require('passport-local').Strategy;
Handlebars = require('express-handlebars');
mongoose = require('mongoose');
session = require('express-session');
logger = require('morgan');
http = require('http');
routes = require(__dirname + '/routes');
User = require(__dirname + '/database/models/user');
port = process.env.PORT || '3000';
environment = process.env.NODE_ENV || 'development';
app = express();

app.engine('handlebars', Handlebars({
  defaultLayout: 'main',
  layoutsDir: './server/views/layouts'
}));

app.set('views', './server/views');
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon('./build/images/favicon.ico'));
app.use(express.static('./build'));
app.use(session({
  secret: 'holdontoyourbutts',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean-users');

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// (will print stacktrace)
if (environment === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// (no stacktraces leaked to user)
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', port);
server = http.createServer(app);
server.listen(port, function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
