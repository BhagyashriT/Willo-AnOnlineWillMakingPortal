const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));



// router.get('/check', function (req, res) {
//    db.query('select * from user', function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end(JSON.stringify(results));
// 	});
// });

var query = 'UPDATE user SET street_address = ?, county = ? , city = ?, state = ?, zip=?  WHERE  user_id = ?';
router.post('/', function (req, res) {
  var will_id = req.query.willid;
  var street_address = req.body.street_address;
  var county = req.body.county;
  var city = req.body.city;
  var state = req.body.state;
  //var own_property = req.body.own_property;
  var zip =req.body.zip;
  console.log("Reached here for updating profile 3");

  db.query('SELECT user_id from parties where will_id=? and party_type="owner"', [will_id], function (error, results, fields) {
   if (error) throw error;
   if(results.length>0){
     var user_id = results[0].user_id;
     db.query(query, [street_address, county, city, state, zip, user_id], function (error, results, fields) {
  	  if (error) throw error;
      res.send({
        "code":400,
        "result":true,
        "msg": "success"
      })
  	});
   }
 });

});

// router.get('/user/:id', function (req, res) {
//    console.log(req);
//    db.query('select * from user where user_id=?', [req.params.id], function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end(JSON.stringify(results));
// 	});
// });

module.exports = router;
