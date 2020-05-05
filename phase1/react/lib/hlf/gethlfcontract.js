'use strict';

const fs = require('fs');
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('wallet');

let contractMap = new Map();
let gateway;

async function getNewHlfContract(channelName, contractName) {

  if (gateway) {
    console.log('existing gateway.');
  } else {
    console.log('new gateway.');
    gateway = new Gateway();
  }

  let contract;

  // Main try/catch block
  try {

    // Specify userName for network access
    // const userName = 'isabella.issuer@magnetocorp.com';
    const userName = 'Admin@government1.example.com';

    console.log('open connection profile.');

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = JSON.parse(fs.readFileSync('../lib/hlf/cadanacConnectionProfile.json', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: false, asLocalhost: true }
    };

    // Connect to gateway using application specified parameters
    console.log('Connect to Fabric gateway.');

    await gateway.connect(connectionProfile, connectionOptions);

    // Access PaperNet network
    console.log('Use network channel: ' + channelName);

    const network = await gateway.getNetwork(channelName);

    // Get addressability to commercial paper contract
    console.log('Use org.papernet.commercialpaper smart contract.');
    contract = await network.getContract(contractName);

    // issue commercial paper
    console.log('getContract done.');
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    await gateway.disconnect();
  }
  return (contract);
}

module.exports = {
  getHlfContract: async (channelName, contractName) => {

    let contract = contractMap.get(channelName);
    if (contract) {
      console.log('existing contract.');
    } else {
      console.log('new contract.');
      contract = await getNewHlfContract(channelName, contractName);
      contractMap.set(channelName, contract);
    }
    return (contract);
  }
}
