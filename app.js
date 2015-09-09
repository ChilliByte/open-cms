var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var connectMongoStore = require('connect-mongo')(session);
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var app = express();

//START X-Clacks-Overhead
app.use(function(req,res,next){
	res.setHeader('X-Clacks-Overhead', 'GNU Terry Pratchett');
	next();
});
//END   X-Clacks-Overhead

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib/medium-editor', express.static(path.join(__dirname, 'node_modules/medium-editor/dist')));
app.use('/lib/medium-editor-tables', express.static(path.join(__dirname, 'node_modules/medium-editor-tables/dist')));
app.use('/lib/font-awesome', express.static(path.join(__dirname, 'node_modules/font-awesome')));
app.use(session({
  secret: 'keyboard cat',
  store:  new connectMongoStore({ url: process.env.DBURL })
}));

/* NEW MONGODB SETUP */
// DOCS ARE HERE https://github.com/mongodb/node-mongodb-native/blob/master/Readme.md
app.use(function (req, res, next){
 MongoClient.connect(process.env.DBURL, function(err, db) {
   if(err) throw err;
   req.db = db;
   req.ObjectId = mongodb.ObjectID;
   next();
 });
});
/* END MONGODB SETUP */

app.locals.site = {
  title: process.env.SITE_TITLE || "My Site"
}
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

/* START ADMIN SETUP */

if(process.env.ADMIN_PANEL=="false"){
  // Admin Panel is disabled, and is therefore inaccessible.
}else{
    app.get("/admin/authorise", function(req,res){
    var sess = req.session;
    if(sess.isAdmin==true){
      res.redirect("/admin/")
    }
    var denied;
    if(req.query.denied=="true"){
      denied = true;
    }else{
      denied = false;
    }
    res.render("admin/authorise", {
      deniedAccess: denied
    });
  });

  app.post("/admin/authorise", function(req,res) {
    var sess = req.session;
    if(req.body.password==process.env.ADMIN_PASS){
      sess.isAdmin = true;
      res.redirect("/admin/");
    }else{
      if(sess.isAdmin){
        res.redirect("/admin/");
      }else{
        res.redirect("/admin/authorise?denied=true");
      }
    }
  });

  app.get("/admin/login", isAdmin, function(req,res){
    res.redirect("/admin/authorise");
  });

  app.get("/admin/deauthorise", function(req, res){
    var sess = req.session;
    sess.isAdmin = false;
    res.redirect("/");
  });

  app.get("/admin/logout", isAdmin, function(req,res){
    res.redirect("/admin/deauthorise");
  });
  
  function isAdmin(req,res,next){
    var sess = req.session;
    if(sess.isAdmin){
      next();
    }else {
      res.redirect("/admin/authorise?denied=true");
    }
  }
  app.use(function(req, res, next){
    var isAdminPage;
    var path = req.path;
    path.indexOf(1);
    path.toLowerCase();
    path = path.split("/")[1];
    if(path == "admin"){
      isAdminPage = true;
    }else{
      isAdminPage = false;
    }
    res.locals.isAdminPage = isAdminPage;
    next();
  });
  app.use('/admin', isAdmin, require("./routes/admin"));
}

/* END ADMIN SETUP */

// respond with "hello world" when a GET request is made to the homepage
/*
app.get('/', function(req, res) {
  res.render('index');
});*/

app.use('/p', require("./routes/pages"));

app.use('/c', require("./routes/collections"));

app.use('/', require("./routes/aliases"));

module.exports = app;
