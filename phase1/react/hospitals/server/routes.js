let express = require('express');
let router = express.Router();
let submitTemplate = require('cadanaclib/hlf/transactiontemplate');
let hlfTransaction = require('cadanaclib/hlf/transaction');

'use strict';

router.get('/', function (req, res) {
    res.render('index')
});
router.route('/api/cadanacv1/actors/hospital/patient')
    .post(async function (req, res) {
        res.send(await submitTemplate('channelpersonhealth', 'personhealth', hlfTransaction.createPersonHealth, req.body.pkPersonHealthID, req.body.remediationID, req.body.personStatus, req.body.virusType));
    })
router.route('/api/cadanacv1/actors/hospital/patient')
    .put(async function (req, res) {
        res.send(await submitTemplate('channelpersonhealth', 'personhealth', hlfTransaction.updateRemediationIDPersonStatus, req.body.pkPersonHealthID, req.body.remediationID, req.body.personStatus, req.body.virusType));
    });
router.route('/api/cadanacv1/actors/hospital/finance')
    .put(async function (req, res) {
        res.send(await submitTemplate('channelhealthfinance', 'healthfinance', hlfTransaction.updateRemediationIDFinancialAmount, req.body.pkHealthFinanceID, req.body.remediationID, "" + (0 - req.body.financialAmount), req.body.virusType));
    });
router.get('/api/cadanacv1/actors/hospital/patient/history/:pkPersonHealthID/:virusType', async function (req, res) {
    res.json("" + await submitTemplate('channelpersonhealth', 'personhealth', hlfTransaction.getHistoryForPersonHealth, req.params.pkPersonHealthID, req.params.virusType));
});
router.get('/api/cadanacv1/actors/hospital/finance/history/:pkHealthFinanceID', async function (req, res) {
    res.json("" + await submitTemplate('channelhealthfinance', 'healthfinance', hlfTransaction.getHistoryForHealthFinance, req.params.pkHealthFinanceID));
});
router.get('/api/cadanacv1/actors/hospital/finance/:pkHealthFinanceID', async function (req, res) {
    res.json("" + await submitTemplate('channelhealthfinance', 'healthfinance', hlfTransaction.readHealthFinance, req.params.pkHealthFinanceID));
});
router.get('/api/cadanacv1/actors/hospital/patient/:pkPersonHealthID/:virusType', async function (req, res) {
    res.json("" + await submitTemplate('channelpersonhealth', 'personhealth', hlfTransaction.readPersonHealth, req.params.pkPersonHealthID, req.params.virusType));
});
module.exports = router;
