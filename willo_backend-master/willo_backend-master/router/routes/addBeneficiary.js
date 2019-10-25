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
 var email = req.body.email;
 var name = req.body.name;
 var dob =req.body.dob;
 var relationship = req.body.relationship;
 var contact = req.body.contact;
console.log("checking the will id", req.body.name);

db.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
   if (error) throw error;

   if(results.length!=0){
      var resm = results[0].user_id;
     console.log("Retrieved user id", results[0].user_id);
     db.query('SELECT * FROM parties WHERE user_id = ? and will_id=? and party_type="beneficiary"', [results[0].user_id, req.query.willid], function (error, results, fields) {
       if(results.length>0){
         res.send({
           "code":400,
           "result":false,
           "msg":"Already added as Beneficiary"
         });
       }
       else{
         console.log("Reaced here 5", resm);
         var party_name = "beneficiary";
         var status = null;
         db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[party_name, req.query.willid, resm, status], function (error, results, fields) {
         if (error) throw error;
         res.end(JSON.stringify(results));
         var details = 'Added Beneficiary ' + req.body.name ;
         db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
         });
      });
       }
     });
   }
   else{
     console.log("Reached here 2 ", name);
     db.query('INSERT INTO user (name, email, dob, relationship, contact) VALUES(?,?,?,?,?)', [name, email, dob, relationship, contact], function (error, results, fields) {
           if (error) throw error;
         });
     console.log("Inserting done");
     db.query('SELECT user_id FROM user WHERE email = ?', [email], function (error, results, fields) {

       if (error) throw error;
       var resm = results[0].user_id;
       var party_name = "beneficiary";
       var status = null;

       db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[party_name, req.query.willid, resm, status], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
       var details = 'Added Beneficiary ' + req.body.name ;
       db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
       });
    });
    });
   }
 });
});

module.exports = router;
