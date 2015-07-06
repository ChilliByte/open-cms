var express = require('express');
var router = express.Router();

function isAdmin(req,res,next){
  var sess = req.session;
  if(sess.isAdmin){
    next();
  }else {
    res.redirect("/admin/authorise?denied=true");
  }
}

router.get("/authorise", function(req,res){
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

router.post("/authorise", function(req,res) {
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

router.get("/admin/login", isAdmin, function(req,res){
  res.redirect("/admin/authorise");
});

router.get("/admin/deauthorise", function(req, res){
  var sess = req.session;
  sess.isAdmin = false;
  res.redirect("/");
});

router.get("/admin/logout", isAdmin, function(req,res){
  res.redirect("/admin/deauthorise");
});

router.get("/", isAdmin, function(req,res){
  res.render("admin/index");
});


module.exports = router;
