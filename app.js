var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var mongojs = require('mongojs');
var session = require('express-session');
var connectMongoStore = require('connect-mongo')(session);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  store:  new connectMongoStore({ url: process.env.DBURL })
}))

var db = mongojs(process.env.DBURL);
app.use(function (req, res, next){
  req.db = db;
  req.ObjectId = mongojs.ObjectId;
  next();
});

app.locals.site = {
  title: process.env.SITE_TITLE || "My Shop"
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/about', function(req, res) {
  res.render('message', {
    title: 'About',
    message: 'This is an experimental cart-less shoppping system.'
  });
});

app.use('/products', require("./routes/products"));

if(process.env.ADMIN_PANEL=="false"){
  // Admin Panel is disabled, and is therefore inaccessible.
}else{
  app.use('/admin', require("./routes/admin"));
}

module.exports = app;
