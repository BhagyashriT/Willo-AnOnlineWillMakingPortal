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
  //var postData  = req.body;
console.log("Reached add item");
db.query('SELECT belongings_id from belongings where belongings_name=?', [req.body.belongings_name], function (error, results, fields) {
   if (error) throw error;
   if(results.length===0){
     db.query('INSERT INTO belongings (belongings_name, belongings_category) VALUES(?, ?)', [req.body.belongings_name, req.body.belongings_category], function (error, results, fields) {
           if (error) throw error;
           else{
             db.query('SELECT belongings_id from belongings where belongings_name=?', [req.body.belongings_name], function (error, results, fields) {
              console.log(results[0].belongings_id);
               db.query('INSERT INTO beneficiary_belongings (belongings_id, will_id, belongings_desc) VALUES(?,?,?)', [results[0].belongings_id, req.query.willid, req.body.belongings_desc], function (error, results, fields) {
             });
           });

             var details = 'Added Item ' + req.body.belongings_name ;
             db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
               res.send({
                 "code":400,
                 "result":true
               })
             });

           }

         });
     console.log("Inserting done");
   }
   else{
     db.query('SELECT belongings_id from belongings where belongings_name=?', [req.body.belongings_name], function (error, results, fields) {
      console.log(results[0].belongings_id);
        console.log(req.body.belongings_desc);
       db.query('INSERT INTO beneficiary_belongings (belongings_id, will_id, belongings_desc) VALUES(?, ?, ?)', [results[0].belongings_id, req.query.willid, req.body.belongings_desc], function (error, results, fields) {
     });
     var details = 'Added Item ' + req.body.belongings_name;
     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
       res.send({
         "code":400,
         "result":true
       })
     });

   });
   }

});




});

module.exports = router;
