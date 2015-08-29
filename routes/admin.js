var express = require('express');
var router = express.Router();

router.get("/", function(req,res){
  res.render("admin/index");
});

/* START PAGE ADMIN */

router.get("/pages", function(req,res){
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

router.get("/pages/add", function(req,res){
  res.render('admin/page-add', {});
});

router.post("/pages/add", function(req,res){
  var pages = req.db.collection('pages');
  var newpage = {};
  newpage.title = req.body.title;
  newpage.content = req.body.content;
  pages.insert(newpage, function(err, doc) {
    if(err){
      res.send("Error adding page. \n"+err)
    }else{
      res.redirect("/p/"+doc._id);
    }
  });
});

router.get("/pages/edit", function(req,res){
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

router.post("/pages/edit", function(req,res){
  var pages = req.db.collection('pages');
  pages.update({ _id: req.ObjectId(req.body.id) }, {$set:{
    title:   req.body.title,
    content: req.body.content
  }}, function() {
      res.redirect("/admin/pages/edit?updated=true&id=" + req.query.id);
  });
});

/* END PAGE ADMIN */

/* START ALIAS ADMIN */
router.get("/aliases", function(req,res){
  var aliases = req.db.collection('aliases');
  aliases.find(function(err, docs) {
    res.render('admin/aliases', {
      docs: docs
    })
  });
});

router.get("/aliases/add", function(req,res){
  res.render('admin/aliases-add', {});
});

router.post("/aliases/add", function(req,res){
  var aliases = req.db.collection('aliases');
  var newalias = {};
  newalias.path = req.body.path;
  newalias.type = req.body.type;
  newalias.pointer = req.body.pointer;
  aliases.insert(newalias, function(err, doc) {
    if(err){
      res.send("Error adding page. \n"+err)
    }else{
      res.redirect("/admin/aliases");
    }
  });
});

router.get("/aliases/edit", function(req,res){
  var aliases = req.db.collection('aliases');
  aliases.findOne({ _id: req.ObjectId(req.query.id) },function(err, doc) {
    console.log(doc);
    if(doc._id){
      res.render('admin/aliases-edit', {
        doc: doc
      });
    }else {
      res.render('message', {
        title:   '404',
        message: 'page not found.'
      });
    }
  });
});

router.post("/aliases/edit", function(req,res){
  var aliases = req.db.collection('aliases');
  aliases.update({ _id: req.ObjectId(req.body.id) }, {$set:{
  path : req.body.path,
  type : req.body.type,
  pointer : req.body.pointer
  }}, function() {
      res.redirect("/admin/aliases");
  });
});
/* END ALIAS ADMIN */

module.exports = router;
