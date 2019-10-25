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
 var contact = req.body.contact;
console.log("checking the will id", req.query.willid);
db.query('SELECT * FROM user WHERE email = ?', [email], function (error, results, fields) {
   if (error) throw error;
   if(results.length!=0){
     db.query('SELECT * FROM parties WHERE will_id = ? and party_type in ("primary guardian", "secondary guardian", "tertiary guardian")', [req.query.willid], function (error, results, fields) {
       if(results.length<3){
         db.query('SELECT user_id FROM user WHERE email = ?', [email], function (error, results, fields) {

           if (error) throw error;
           var resm = results[0].user_id;


             if(req.body.guardianid==1){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="primary guardian") or (will_id=? and party_type like "%guardian" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "primary guardian";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added guardian ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     res.send({
                       "code":400,
                       "result":true
                     });
                   }
                  });
                 }
                 else{
                   res.send({
                     "code":400,
                     "result":false,
                     "msg":"Primary guardian already added/This user is already added as guardian!"
                   });
                 }
               });
             }
             else if(req.body.guardianid==2){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="secondary guardian") or (will_id=? and party_type like "%guardian" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "secondary guardian";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added secondary guardian ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     res.send({
                       "code":400,
                       "result":true
                     });
                   }
                  });
                 }
                 else{
                   res.send({
                     "code":400,
                     "result":false,
                     "msg":"Secondary guardian already added/This user is already added as guardian!"
                   });
                 }
               });
             }
             else if(req.body.guardianid==3){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="tertiary guardian") or (will_id=? and party_type like "%guardian" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "tertiary guardian";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added tertiary guardian ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     res.send({
                       "code":400,
                       "result":true
                     });
                   }
                  });
                 }
                 else{
                   res.send({
                     "code":400,
                     "result":false,
                     "msg":"Tertiary guardian already added/This user is already added as guardian!"
                   });
                 }
               });
             }

        });
       }
       else{
         res.send({
           "code":400,
           "result":false,
           "msg":"Three guardianes Already Added"
         });
       }
     });
   }
   else{
     db.query('SELECT * FROM parties WHERE will_id = ? and party_type in ("primary guardian", "secondary guardian", "tertiary guardian")', [req.query.willid], function (error, results, fields) {
       if(results.length<3){
         db.query('INSERT INTO user (name, email, contact) VALUES(?,?,?)', [name, email, contact], function (error, results, fields) {
               if (error) throw error;
             });
         console.log("Inserting done");
         db.query('SELECT user_id FROM user WHERE email = ?', [email], function (error, results, fields) {

           if (error) throw error;
           var resm = results[0].user_id;


             if(req.body.guardianid==1){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="primary guardian") or (will_id=? and party_type like "%guardian" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "primary guardian";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added guardian ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     res.send({
                       "code":400,
                       "result":true
                     });
                   }
                  });
                 }
                 else{
                   res.send({
                     "code":400,
                     "result":false,
                     "msg":"Primary guardian already added!"
                   });
                 }
               });
             }
             else if(req.body.guardianid==2){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="secondary guardian") or (will_id=? and party_type like "%guardian" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "secondary guardian";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added secondary guardian ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     res.send({
                       "code":400,
                       "result":true
                     });
                   }
                  });
                 }
                 else{
                   res.send({
                     "code":400,
                     "result":false,
                     "msg":"Secondary guardian already added"
                   });
                 }
               });
             }
             else if(req.body.guardianid==3){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="tertiary guardian") or (will_id=? and party_type like "%guardian" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "tertiary guardian";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added tertiary guardian ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     res.send({
                       "code":400,
                       "result":true
                     });
                   }
                  });
                 }
                 else{
                   res.send({
                     "code":400,
                     "result":false,
                     "msg":"Tertiary guardian already added!"
                   });
                 }
               });
             }

        });
       }
       else{
         res.send({
           "code":400,
           "result":false,
           "msg":"Three guardianes Already Added"
         });
       }
     });
   }
 });
});

module.exports = router;
