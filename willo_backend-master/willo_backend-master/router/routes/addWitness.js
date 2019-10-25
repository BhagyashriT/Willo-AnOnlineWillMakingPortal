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
     db.query('SELECT * FROM parties WHERE will_id = ? and party_type in ("primary witness", "secondary witness", "tertiary witness")', [req.query.willid], function (error, results, fields) {
       if(results.length<3){
         db.query('SELECT user_id FROM user WHERE email = ?', [email], function (error, results, fields) {

           if (error) throw error;
           var resm = results[0].user_id;


             if(req.body.witnessid==1){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="primary witness") or (will_id=? and party_type like "%witness" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "primary witness";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added witness ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness"', [req.query.willid], function (error, results, fields) {
                       if(results[0].witness_count>0){
                         db.query('UPDATE will SET will_status="PENDING WITNESS VERIFICATION" where will_id=?', [req.query.willid], function (error, results, fields) {
                         });
                       }
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
                     "msg":"Primary witness already added/This user is already added as witness!"
                   });
                 }
               });
             }
             else if(req.body.witnessid==2){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="secondary witness") or (will_id=? and party_type like "%witness" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "secondary witness";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added secondary witness ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness"', [req.query.willid], function (error, results, fields) {
                       if(results[0].witness_count>0){
                         db.query('UPDATE will SET will_status="PENDING WITNESS VERIFICATION" where will_id=?', [req.query.willid], function (error, results, fields) {
                         });
                       }
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
                     "msg":"Secondary witness already added/This user is already added as witness!"
                   });
                 }
               });
             }
             else if(req.body.witnessid==3){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="tertiary witness") or (will_id=? and party_type like "%witness" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "tertiary witness";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added tertiary witness ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness"', [req.query.willid], function (error, results, fields) {
                       if(results[0].witness_count>0){
                         db.query('UPDATE will SET will_status="PENDING WITNESS VERIFICATION" where will_id=?', [req.query.willid], function (error, results, fields) {
                         });
                       }
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
                     "msg":"Tertiary witness already added/This user is already added as witness!"
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
           "msg":"Three Witnesses Already Added"
         });
       }
     });
   }
   else{
     db.query('SELECT * FROM parties WHERE will_id = ? and party_type in ("primary witness", "secondary witness", "tertiary witness")', [req.query.willid], function (error, results, fields) {
       if(results.length<3){
         db.query('INSERT INTO user (name, email, contact) VALUES(?,?,?)', [name, email, contact], function (error, results, fields) {
               if (error) throw error;
             });
         console.log("Inserting done");
         db.query('SELECT user_id FROM user WHERE email = ?', [email], function (error, results, fields) {

           if (error) throw error;
           var resm = results[0].user_id;


             if(req.body.witnessid==1){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="primary witness") or (will_id=? and party_type like "%witness" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "primary witness";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added witness ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness"', [req.query.willid], function (error, results, fields) {
                       if(results[0].witness_count>0){
                         db.query('UPDATE will SET will_status="PENDING WITNESS VERIFICATION" where will_id=?', [req.query.willid], function (error, results, fields) {
                         });
                       }
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
                     "msg":"Primary witness already added!"
                   });
                 }
               });
             }
             else if(req.body.witnessid==2){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="secondary witness") or (will_id=? and party_type like "%witness" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "secondary witness";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added secondary witness ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness"', [req.query.willid], function (error, results, fields) {
                       if(results[0].witness_count>0){
                         db.query('UPDATE will SET will_status="PENDING WITNESS VERIFICATION" where will_id=?', [req.query.willid], function (error, results, fields) {
                         });
                       }
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
                     "msg":"Secondary witness already added"
                   });
                 }
               });
             }
             else if(req.body.witnessid==3){
               db.query('SELECT * FROM parties WHERE (will_id = ? and party_type="tertiary witness") or (will_id=? and party_type like "%witness" and user_id=?)', [req.query.willid,req.query.willid,resm], function (error, results, fields) {
                 if(results.length===0){
                   var name = "tertiary witness";
                   var status = null;
                   db.query('INSERT INTO parties (party_type, will_id, user_id, user_status) VALUES (?,?,?,?)',[name, req.query.willid, resm, status], function (error, results, fields) {
                   if (error) throw error;
                   else{
                     var details = 'Added tertiary witness ' + req.body.name ;
                     db.query('INSERT INTO log (will_id, log_details) VALUES (?,?)',[req.query.willid, details], function (error, results, fields) {
                     });
                     db.query('SELECT count(*) as witness_count from parties where will_id=? and party_type like "%witness"', [req.query.willid], function (error, results, fields) {
                       if(results[0].witness_count>0){
                         db.query('UPDATE will SET will_status="PENDING WITNESS VERIFICATION" where will_id=?', [req.query.willid], function (error, results, fields) {
                         });
                       }
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
                     "msg":"Tertiary witness already added!"
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
           "msg":"Three Witnesses Already Added"
         });
       }
     });
   }
 });

});

module.exports = router;
