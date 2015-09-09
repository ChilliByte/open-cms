var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
  var pages = req.db.collection('pages');
  pages.find().toArray(function(err, docs) {
    var newDocs = [];
    // docs is an array of all the documents in mycollection
    for(var i in docs){
      var x = docs[i];
      // ... Add filter code here
      newDocs.push(x);
    }
    res.render('pages/index', {
      docs: newDocs
    })
  });
});

router.get("/:id", function(req, res){
  var pages = req.db.collection('pages');
  pages.findOne({ _id: req.ObjectId(req.params.id) },function(err, doc) {
    console.log(doc);
    if(doc._id){
      res.render('pages/item', doc);
    }else {
      res.render('message', {
        title:   '404',
        message: 'Page not found.'
      });
    }
  });
});

module.exports = router;
