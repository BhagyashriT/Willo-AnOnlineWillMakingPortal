const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../db');

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.get('/', function (req, res) {
  console.log("Reached here home API;");
   console.log(req.query.willid);
   var query1 = 'SELECT a.will_id as willid, COUNT(CASE WHEN party_type = "beneficiary" THEN 1 END) AS beneficiary_count, COUNT(CASE WHEN party_type LIKE "%witness" THEN 1 END) AS witness_count, COUNT(CASE WHEN party_type LIKE "%executor" THEN 1 END) AS executor_count, COUNT(CASE WHEN party_type LIKE "%guardian" THEN 1 END) AS guardian_count FROM parties a WHERE a.will_id=? GROUP BY willid';
   var query2 = 'SELECT b.will_id as willid, COUNT(belongings_id) as belongings_count FROM beneficiary_belongings b WHERE b.will_id=? GROUP BY willid';
   var query3 = 'SELECT log_details, DATE(log_ts) as last_updated_dt from log where will_id=? order by log_ts desc limit 1';
   db.query(query1, [req.query.willid], function (error, results1, fields) {
	 db.query(query2, [req.query.willid], function (error, results2, fields) {
	 db.query(query3, [req.query.willid], function (error, results3, fields) {
     if(results1.length==0){
       console.log("Reached 1");
       console.log(results1[0].guardian_count);
       res.send({
         "code":400,
         "result":true,
         "willid":0,
         "beneficiary_count":0,
         "witness_count":0,
         "executor_count":0,
         "guardian_count":0,
         "belongings_count":0,
         "log_details": null,
         "last_updated_dt": null
       });
     }
     else if(results2.length==0){
       console.log("Reached 2");
       console.log(results1[0].guardian_count);
       res.send({
         "code":400,
         "result":true,
         "willid":results1[0].willid,
         "beneficiary_count":results1[0].beneficiary_count,
         "witness_count":results1[0].witness_count,
         "executor_count":results1[0].executor_count,
         "guardian_count":results1[0].guardian_count,
         "belongings_count":0,
         "log_details": results3[0].log_details,
         "last_updated_dt": results3[0].last_updated_dt
       });
     }
     else{
       console.log("Reached 3");
       console.log(results1[0].guardian_count);
       res.send({
         "code":400,
         "result":true,
         "willid":results1[0].willid,
         "beneficiary_count":results1[0].beneficiary_count,
         "witness_count":results1[0].witness_count,
         "executor_count":results1[0].executor_count,
         "guardian_count":results1[0].guardian_count,
         "belongings_count":results2[0].belongings_count,
         "log_details": results3[0].log_details,
         "last_updated_dt": results3[0].last_updated_dt
       });
     }
  });
  });
	});
});

module.exports = router;
