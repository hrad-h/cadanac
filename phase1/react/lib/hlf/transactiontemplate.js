let hlf = require('./gethlfcontract');

'use strict';

async function submitTemplate(channelName, contractName, hlfFunction, ...data) {
  console.log('start transaction.' + channelName + "-" + contractName + ".");

  let contract = await hlf.getHlfContract(channelName, contractName);

  console.log('contract=' + contract.constructor.name);

  let response = '';
  try {
    response = await hlfFunction(contract, ...data);
  } catch (e) {
    console.error('err ' + e);
    response = e.message
  };

  if (response == '') response = "success";

  console.log('finish transaction response.' + response);

  return (response);
}
module.exports = submitTemplate;
