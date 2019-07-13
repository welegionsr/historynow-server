var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('./auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventRouter = require('./routes/events');
var wishlistRouter = require('./routes/wishlist');

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'my-super-secret-string',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.body);
    if(req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(403).send('login failed!');
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventRouter);
app.use('/wishlist', wishlistRouter);

module.exports = app;
