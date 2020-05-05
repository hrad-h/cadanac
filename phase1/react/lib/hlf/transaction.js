'use strict';

module.exports = {
       createHealthFinance: async (contract, pkHealthFinanceID, remediationID, financialAmount, virustype) => {
              return (await contract.submitTransaction('createHealthFinance', pkHealthFinanceID, remediationID, financialAmount, virustype));
       },
       createPersonLocation: async (contract, pkPersonLocationID) => {
              return (await contract.submitTransaction('createPersonLocation', pkPersonLocationID));
       },
       createPersonHealth: async (contract, pkPersonHealthID, remediationID, personStatus, virustype) => {
              return (await contract.submitTransaction('createPersonHealth', pkPersonHealthID, remediationID, personStatus, virustype));
       },
       updateRemediationIDPersonStatus: async (contract, pkPersonHealthID, remediationID, personStatus, virustype) => {
              return (await contract.submitTransaction('updateRemediationIDPersonStatus', pkPersonHealthID, remediationID, personStatus, virustype));
       },
       updateRemediationIDFinancialAmount: async (contract, pkHealthFinanceID, remediationID, financialAmount, virustype) => {
              return (await contract.submitTransaction('updateRemediationIDFinancialAmount', pkHealthFinanceID, remediationID, financialAmount, virustype));
       },
       readPersonHealth: async (contract, pkPersonHealthID, virustype) => {
              return (await contract.submitTransaction('readPersonHealth', pkPersonHealthID, virustype));
       },
       getHistoryForPersonHealth: async (contract, pkPersonHealthID, virustype) => {
              return (await contract.submitTransaction('getHistoryForPersonHealth', pkPersonHealthID, virustype));
       },
       getHistoryForHealthFinance: async (contract, pkHealthFinanceID) => {
              return (await contract.submitTransaction('getHistoryForHealthFinance', pkHealthFinanceID));
       },
       readHealthFinance: async (contract, pkHealthFinanceID) => {
              return (await contract.submitTransaction('readHealthFinance', pkHealthFinanceID));
       },
       getHistoryForPersonLocation: async (contract, pkPersonLocationID) => {
              return (await contract.submitTransaction('getHistoryForPersonLocation', pkPersonLocationID));
       },
       readPersonLocation: async (contract, pkPersonLocationID) => {
              return (await contract.submitTransaction('readPersonLocation', pkPersonLocationID));
       },
       updateLatitudeLongitude: async (contract, pkPersonLocationID, latitude, longitude) => {
              return (await contract.submitTransaction('updateLatitudeLongitude', pkPersonLocationID, latitude, longitude));
       },
       getNew: async (contract) => {
              return (await contract.submitTransaction('getNew'));
       }
}
