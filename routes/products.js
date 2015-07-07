var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
  var products = req.db.collection('products');
  products.find(function(err, docs) {
    var newDocs = [];
    // docs is an array of all the documents in mycollection
    for(var i in docs){
      var x = docs[i];
      // ... Add filter code here
      newDocs.push(x);
    }
    res.render('products/index', {
      docs: newDocs
    })
  });
});

router.get("/:id", function(req, res){
  var products = req.db.collection('products');
  products.findOne({ _id: req.params.id },function(err, doc) {
    res.render('products/item', {
      product: doc
    })
  });
});

module.exports = router;
