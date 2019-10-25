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
console.log("Reached edit item to beneficiary");
console.log(req.query.willid);
console.log(req.body.belongings_id);
db.query('SELECT * from beneficiary_belongings where will_id=? and belongings_id=? and user_id=?', [req.query.willid, req.body.belongings_id, req.body.user_id], function (error, results, fields) {
    if (error) throw error;
    else if(results.length==0){
      console.log("Entered here 1");
      res.send({
        "code":400,
        "result":false,
        "msg": "This user is not allocated any Belongings yet!"
      });
    }
    else {
      var original_pct=results[0].pct_allocation;
      db.query('SELECT SUM(pct_allocation) as sum_pct_allocation from beneficiary_belongings where will_id=? and belongings_id=?', [req.query.willid, req.body.belongings_id], function (error, results, fields) {
          if(results[0].sum_pct_allocation+req.body.pct_allocation - original_pct>100){
            res.send({
              "code":400,
              "result":false,
              "msg": "Allocation exceeds 100%!"
            });
          }
          else{
            db.query('UPDATE beneficiary_belongings SET user_id =?, pct_allocation = ? where will_id=? and belongings_id=? and user_id=?', [req.body.user_id, req.body.pct_allocation, req.query.willid, req.body.belongings_id, req.body.user_id], function (error, results, fields) {
                  res.send({
                    "code":200,
                    "result":true,
                    "msg": "Sucessfully added"
                  });
            });
          }
        });
    }
});
});
module.exports = router;
