var express = require('express');
var router = express.Router();

router.get("/export-pages.json", function(req,res){
  var pages = req.db.collection('pages');
  pages.find().toArray(function(err, docs) {
    if(err) console.log(err);
    else{
      res.json(docs);
    }
  });
});

router.get("/export-collections.json", function(req,res){
  var collections = req.db.collection('collections');
  collections.find().toArray(function(err, docs) {
    if(err) console.log(err);
    else{
      res.json(docs);
    }
  });
});

router.get("/export-aliases.json", function(req,res){
  var aliases = req.db.collection('aliases');
  aliases.find().toArray(function(err, docs) {
    if(err) console.log(err);
    else{
      res.json(docs);
    }
  });
});

module.exports = router;