var app,
    bodyParser,
    cookieParser,
    database,
    environment,
    errorHandler,
    express,
    favicon,
    Handlebars,
    http,
    LocalStrategy,
    logger,
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
session = require('express-session');
logger = require('morgan');
http = require('http');
database = require(__dirname + '/database');
routes = require(__dirname + '/middleware/routes');
errorHandler = require(__dirname + '/middleware/error-handler');
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
app.use(errorHandler);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

database.connect(function (uri) {
    console.log('Database connected to ' + uri);
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err;
    err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', port);
server = http.createServer(app);
server.listen(port, function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
