const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/', function (req, res) {
  console.log("Reached here to get amount for user");
  console.log(req.query.willid);
  db.query('SELECT * from discount where promo_code=? and activity_flag="Active"', [req.body.promo_code], function (error, results, fields) {
    console.log(results);
    if(!results.length){
      res.send({
        "result":false,
        "msg":"Invalid code"
      });
    }
    else {
      var discount_value= results[0].discount_value;
      var discount_type= results[0].discount_type;
      if(discount_type=="Whole"){
        db.query('SELECT (annual_sub_price-discount_value) as price from subscription_model, discount where discount_type=? and discount_value=? and activity_flag="Active"', [discount_type, discount_value], function (error, results, fields) {
     	  if (error) throw error;
        var price= results[0].price;
        res.send({
          "result":true,
          "price":price
        });
     	  //res.end(JSON.stringify(results));
     	});
      }
      else if (discount_type=="Percent") {
        db.query('SELECT (annual_sub_price-(discount_value*0.01*annual_sub_price)) as price from subscription_model, discount where discount_type=? and discount_value=? and activity_flag="Active"', [discount_type, discount_value], function (error, results, fields) {
     	  if (error) throw error;
        var price= results[0].price;
        res.send({
          "result":true,
          "price":price
        });
     	});
      }
      else {
        db.query('SELECT annual_sub_price as price from subscription_model', [discount_type, discount_value], function (error, results, fields) {
     	  if (error) throw error;
        var price= results[0].price;
        res.send({
          "result":true,
          "price":price
        });
     	});
      }
    }
  });
});

module.exports = router;
