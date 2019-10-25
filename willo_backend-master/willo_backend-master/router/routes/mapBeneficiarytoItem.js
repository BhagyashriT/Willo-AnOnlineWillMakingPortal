const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');
var nodemailer = require('nodemailer');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/', function (req, res) {
  var query= 'SELECT * from beneficiary_belongings where will_id=? and belongings_id=?';
  //var postData  = req.body;
console.log("Reached map item to beneficiary");
console.log(req.body[0]);
for(key in req.body){
  console.log(req.query.willid);
  console.log(req.body[key].belongings_id);
  console.log(req.body[key].pct_allocation);
  console.log(req.body[key].user_id);
  db.query(query, [req.query.willid, parseInt(req.body[key].belongings_id)], function (error, results123, fields) {
    console.log("Before UPDATE");
    console.log(results123);
  });
  db.query('SELECT SUM(pct_allocation) as sum_pct_allocation from beneficiary_belongings where will_id=? and belongings_id=?', [req.query.willid, parseInt(req.body[key].belongings_id)], function (error, results, fields) {

      console.log(results);
      if (error) throw error;
      else if(results[0].sum_pct_allocation===100){
        console.log("Entered here 1");
        // res.send({
        //   "code":400,
        //   "result":false,
        //   "msg": "This item is already allocated 100%"
        // });
      }
      else if((parseInt(req.body[key].pct_allocation)+ results[0].sum_pct_allocation)<=100 && results[0].sum_pct_allocation===0){
        console.log("Entered here 2");
        db.query('UPDATE beneficiary_belongings SET user_id =?, pct_allocation = ? where will_id=? and belongings_id=?', [parseInt(req.body[key].user_id), parseInt(req.body[key].pct_allocation), req.query.willid, (req.body[key].belongings_id)], function (error, results, fields) {
          db.commit(function(err) {
            if (err) {
          connection.rollback(function() {
            throw err;
          });
        }
        console.log('success!');
      });
          db.query(query, [req.query.willid, parseInt(req.body[key].belongings_id)], function (error, results123, fields) {
            console.log("Inside UPDATE");
            console.log(results123);
          });
              // res.send({
              //   "code":200,
              //   "result":true,
              //   "msg": "Sucessfully added"
              // });
        });
      }
      else if((parseInt(req.body[key].pct_allocation)+ results[0].sum_pct_allocation)<=100 && results[0].sum_pct_allocation!=0){
        console.log("Entered here 3");
        db.query('INSERT INTO beneficiary_belongings (belongings_id, will_id, user_id, pct_allocation) VALUES(?, ?, ?, ?)', [parseInt(req.body[key].belongings_id), req.query.willid, parseInt(req.body[key].user_id), parseInt(req.body[key].pct_allocation)], function (error, results, fields) {
            console.log("Inside Insert");
            db.commit(function(err) {
              if (err) {
            connection.rollback(function() {
              throw err;
            });
          }
          console.log('success!');
        });
              // res.send({
              //   "code":200,
              //   "result":true,
              //   "msg": "Successfully Added"
              // });
        });
      }
      else if((parseInt(req.body[key].pct_allocation)+ results[0].sum_pct_allocation)>100){
        console.log("Entered here 4");
        var remaining_pct =100- results[0].sum_pct_allocation;
              // res.send({
              //   "code":400,
              //   "result":false,
              //   "msg": "Pct Allocation exceeds 100%",
              //   "remaining_pct" : remaining_pct
              // });
      }
  });
}

res.send({
   "code":200,
   "result":true,
   "msg": "Successfully Added"
 });
});
module.exports = router;
