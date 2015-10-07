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

router.get("/export-all.json", function(req,res){
  var pages = req.db.collection('pages');
  var aliases = req.db.collection('aliases');
  var collections = req.db.collection('collections');
  pages.find().toArray(function(err1, arrPages) {
    if(err1) console.log(err1);
    else{
      aliases.find().toArray(function(err2, arrAliases) {
        if(err2) console.log(err2);
        else{
            collections.find().toArray(function(err3, arrCollections) {
            if(err3) console.log(err3);
            else{
              res.json({
                pages: arrPages,
                aliases: arrAliases,
                collections: arrCollections
              });
            }
          });
        }
      });
    }
  });
});


module.exports = router;