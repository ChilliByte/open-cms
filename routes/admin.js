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

router.get("/login", isAdmin, function(req,res){
  res.redirect("/admin/authorise");
});

router.get("/deauthorise", function(req, res){
  var sess = req.session;
  sess.isAdmin = false;
  res.redirect("/");
});

router.get("/logout", isAdmin, function(req,res){
  res.redirect("/admin/deauthorise");
});

router.get("/", isAdmin, function(req,res){
  res.render("admin/index");
});

router.get("/pages", isAdmin, function(req,res){
  var pages = req.db.collection('pages');
  pages.find(function(err, docs) {
    var newDocs = [];
    // docs is an array of all the documents in mycollection
    for(var i in docs){
      var x = docs[i];
      newDocs.push(x);
    }
    res.render('admin/pages', {
      docs: newDocs
    })
  });
});

router.get("/pages/add", isAdmin, function(req,res){
  res.render('admin/pages-add', {});
});

router.post("/pages/add", isAdmin, function(req,res){
  var pages = req.db.collection('pages');
  var newpage = {};
  newpage.title = req.body.title;
  newpage.content = req.body.content;
  pages.insert(newpage, function(err, doc) {
    if(err){
      res.send("Error adding page. \n"+err)
    }else{
      res.redirect("/pages/"+doc._id);
    }
  });
});

router.get("/pages/edit", isAdmin, function(req,res){
  var updatedbool;
  var pages = req.db.collection('pages');
  pages.findOne({ _id: req.ObjectId(req.query.id) },function(err, doc) {
    console.log(doc);
    if(doc._id){
      if(req.query.updated=="true"){
        updatedbool = true;
      }else{
        updatedbool = false;
      }
      res.render('admin/page-edit', {
        doc: doc,
        updated: updatedbool
      });
    }else {
      res.render('message', {
        title:   '404',
        message: 'page not found.'
      });
    }
  });
});

router.post("/pages/edit", isAdmin, function(req,res){
  var pages = req.db.collection('pages');
  pages.update({ _id: req.ObjectId(req.body.id) }, {$set:{
    title:   req.body.title,
    content: req.body.content
  }}, function() {
      res.redirect("/admin/edit?updated=true&id=" + req.query.id);
  });
});



module.exports = router;
