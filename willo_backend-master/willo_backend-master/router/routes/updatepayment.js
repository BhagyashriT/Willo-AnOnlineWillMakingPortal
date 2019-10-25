const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


router.post('/', function (req, res) {
  console.log("Reached here update last payment dt");
   console.log(req.query.willid);

   db.query('select MAX(due_date)as due_date from finance where will_id=?', [req.query.willid], function (error, results, fields) {

   db.query('select annual_sub_price from subscription_model', function (error, results2, fields) {
     console.log(results);
     if(results[0].due_date==null){
         console.log("Reached first payment");
         db.query('INSERT into finance(will_id,last_payment_dt, amount)VALUES(?,CURRENT_DATE,?)', [req.query.willid, results2[0].annual_sub_price], function (error, results, fields) {
         });
         db.query('UPDATE finance set due_date= DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR) where due_date IS NULL and will_id=?', [req.query.willid], function (error, results, fields) {
           res.send({
             "code":400,
             "result":true,
             "msg": "payment updated"
           });
         });
     }
   else{
     console.log("second block");
     var due_date=results[0].due_date;
     db.query('INSERT into finance(will_id,last_payment_dt, amount)VALUES(?,CURRENT_DATE,?)', [req.query.willid, results2[0].annual_sub_price], function (error, results, fields) {
     });
     db.query('UPDATE finance set due_date= DATE_ADD(due_date, INTERVAL 1 YEAR) where due_date IS NULL and will_id=? and last_payment_dt=CURRENT_DATE', [req.query.willid], function (error, results, fields) {
       res.send({
         "code":400,
         "result":true,
         "msg": "payment updated"
       });
     });
   }

 });
});
});


module.exports = router;
