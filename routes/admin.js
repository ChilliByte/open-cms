var express = require('express');
var router = express.Router();
var format = require('util').format;
//DB DOCS ARE HERE https://github.com/mongodb/node-mongodb-native/blob/master/Readme.md
router.get("/", function(req,res){
  res.render("admin/index");
});

/* START PAGE ADMIN */

router.get("/pages", function(req,res){
  var pages = req.db.collection('pages');
  pages.find().toArray(function(err, docs) {
    if(err) throw err;
    console.log(err);
    console.log(docs);
    res.render('admin/pages', {
      docs: docs
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
  newpage.collection = req.body.collection;
  newpage.content = req.body.content;
  pages.insert(newpage, function(err, doc) {
    console.log(err);
    if(err){
      res.send("Error adding page. \n"+err)
    }else{
      res.redirect("/admin/pages?action=added");
    }
  });
});

router.get("/pages/edit", function(req,res){
  var updatedbool;
  var pages = req.db.collection('pages');
  pages.findOne({ _id: new req.ObjectId(req.query.id) },function(err, doc) {
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
  pages.update({ _id: new req.ObjectId(req.body.id)},
  {
    $set:{
      title:   req.body.title,
      collection: req.body.collection,
      content: req.body.content
    },
  },{upsert:false, multi:false, w:1}, function(err, doc) {
    console.log(req.body);
    console.log(err);
    console.log(doc);
      res.redirect("/admin/pages/edit?updated=true&id=" + req.body.id);
  });
});

/* END PAGE ADMIN */

/* START ALIAS ADMIN */
router.get("/aliases", function(req,res){
  var aliases = req.db.collection('aliases');
  aliases.find().toArray(function(err, docs) {
    if(err) throw err;
    console.log(docs);
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
  aliases.findOne({ _id: new req.ObjectId(req.query.id) }, function(err, doc) {
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
  aliases.update({ _id: new req.ObjectId(req.body.id) }, {$set:{
  path : req.body.path,
  type : req.body.type,
  pointer : req.body.pointer
  }},{upsert:false, multi:false, w:1}, function() {
      res.redirect("/admin/aliases");
  });
});

router.get("/collections", function(req,res){
  var collections = req.db.collection('collections');
  collections.find().toArray(function(err, docs) {
    if(err) throw err;
    console.log(err);
    console.log(docs);
    res.render('admin/collections', {
      docs: docs
    })
  });
});

router.get("/collections/add", function(req,res){
  res.render('admin/collections-add', {});
});

router.post("/collections/add", function(req,res){
  var collections = req.db.collection('collections');
  var newcollection = {};
  newcollection.name = req.body.name;
  collections.insert(newcollection, function(err, doc) {
    if(err){
      res.send("Error adding page. \n"+err)
    }else{
      res.redirect("/admin/collections");
    }
  });
});

router.post("/object/remove", function(req,res){
  var collection = req.db.collection(req.body.type);
  collection.remove({ _id:  new req.ObjectId(req.body.id) }, function(err,result) {
      res.redirect("/admin/"+req.body.type+"?action=deleted");
  });
});
/* END ALIAS ADMIN */

module.exports = router;
