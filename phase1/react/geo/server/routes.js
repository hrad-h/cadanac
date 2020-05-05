let express = require('express');
let router = express.Router();
let submitTemplate = require('cadanaclib/hlf/transactiontemplate');
let hlfTransaction = require('cadanaclib/hlf/transaction');

'use strict';

router.get('/', function (req, res) {
  res.render('index')
});
router.route('/api/cadanacv1/actors/geo/location')
  .put(async function (req, res) {
    res.send(await submitTemplate('channelpersonlocation', 'personlocation', hlfTransaction.updateLatitudeLongitude, req.body.pkPersonLocationID, req.body.latitude, req.body.longitude));
  })
router.get('/api/cadanacv1/actors/geo/location/new', async function (req, res) {
  res.json("" + await submitTemplate('channelpersonlocation', 'personlocation', hlfTransaction.getNew));
});
module.exports = router;
