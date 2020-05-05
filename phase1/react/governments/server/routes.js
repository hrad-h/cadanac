let express = require('express');
let router = express.Router();
let submitTemplate = require('cadanaclib/hlf/transactiontemplate');
let hlfTransaction = require('cadanaclib/hlf/transaction');

'use strict';

router.get('/', function (req, res) {
    res.render('index')
});
router.route('/api/cadanacv1/actors/government/finance')
    .post(async function (req, res) {
        res.send(await submitTemplate('channelhealthfinance', 'healthfinance', hlfTransaction.createHealthFinance, req.body.pkHealthFinanceID, req.body.remediationID, req.body.financialAmount, req.body.virusType));
    })
router.route('/api/cadanacv1/actors/government/location')
    .post(async function (req, res) {
        res.send(await submitTemplate('channelpersonlocation', 'personlocation', hlfTransaction.createPersonLocation, req.body.pkPersonLocationID));
    })
router.route('/api/cadanacv1/actors/government/patient')
    .put(async function (req, res) {
        res.send(await submitTemplate('channelpersonhealth', 'personhealth', hlfTransaction.updateRemediationIDPersonStatus, req.body.pkPersonHealthID, req.body.remediationID, req.body.personStatus, req.body.virusType));
    });
router.route('/api/cadanacv1/actors/government/finance')
    .put(async function (req, res) {
        res.send(await submitTemplate('channelhealthfinance', 'healthfinance', hlfTransaction.updateRemediationIDFinancialAmount, req.body.pkHealthFinanceID, req.body.remediationID, req.body.financialAmount, req.body.virusType));
    });
router.get('/api/cadanacv1/actors/government/patient/history/:pkPersonHealthID/:virusType', async function (req, res) {
    res.json("" + await submitTemplate('channelpersonhealth', 'personhealth', hlfTransaction.getHistoryForPersonHealth, req.params.pkPersonHealthID, req.params.virusType));
});
router.get('/api/cadanacv1/actors/government/finance/history/:pkHealthFinanceID', async function (req, res) {
    res.json("" + await submitTemplate('channelhealthfinance', 'healthfinance', hlfTransaction.getHistoryForHealthFinance, req.params.pkHealthFinanceID));
});
router.get('/api/cadanacv1/actors/government/location/history/:pkPersonLocationID', async function (req, res) {
    res.json("" + await submitTemplate('channelpersonlocation', 'personlocation', hlfTransaction.getHistoryForPersonLocation, req.params.pkPersonLocationID));
});
router.get('/api/cadanacv1/actors/government/location/:pkPersonLocationID', async function (req, res) {
    res.json("" + await submitTemplate('channelpersonlocation', 'personlocation', hlfTransaction.readPersonLocation, req.params.pkPersonLocationID));
});

module.exports = router;
