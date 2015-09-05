var express = require('express');
var router = express.Router();

router.get("/*", function(req, res){
  var sess = req.session;
  var pages = req.db.collection('pages');
  var aliases = req.db.collection('aliases');
  aliases.findOne({ path: req.path },function(err, doc) {
    console.log(doc);
    if(!doc&&req.path=="/"){
        res.render('message', {
          title:   '500',
          message: 'Broken alias. An alias to a particular page needs to be created, for the path: /'
        });
    }else if(!doc){
      res.render('message', {
        title:   '404',
        message: 'Page not found.'
      });  
    }else{
      switch(doc.type){
        case "redirect":
          res.redirect(doc.pointer);
          break;
        case "mirror":
            pages.findOne({ _id: req.ObjectId(doc.pointer) },function(err, page) {
            if(page){
              res.render('pages/item', page);
            }else {
              res.render('message', {
                title:   '404',
                message: 'Page not found.'
              });
            }
          });
          break;
        default:
          res.render('message', {
            title:   '500',
            message: 'Broken alias.'
          });
      }
    }
   });
});

module.exports = router;