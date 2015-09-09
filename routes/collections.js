var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
  var collections = req.db.collection('collections');
  collections.find().toArray(function(err, docs) {
    var newDocs = [];
    // docs is an array of all the documents in mycollection
    for(var i in docs){
      var x = docs[i];
      // ... Add filter code here
      newDocs.push(x);
    }
    res.render('collections/index', {
      docs: newDocs
    })
  });
});

router.get("/:id", function(req, res){
  var collections = req.db.collection('collections');
  collections.findOne({ _id: req.ObjectId(req.params.id) },function(err, doc) {
    console.log(doc);
    console.log(doc.name);
    if(doc._id){
        var pages = req.db.collection('pages');
        pages.find({collection: {$eq:doc.name}}).toArray(function(err, docs) {
          console.log(docs);
          if(docs){
            console.log("There are docs in this collection!");
          }else{
            console.log("There aren't docs in this collection!");
            docs = [];
          }
          console.log(docs);
          res.render('collections/item', {
            collection: doc,
            pages: docs
          })
        });
      //res.render('collections/item', doc);
    }else {
      res.render('message', {
        title:   '404',
        message: 'Page not found.'
      });
    }
  });
});

module.exports = router;