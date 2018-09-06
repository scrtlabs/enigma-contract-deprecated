const EnigmaToken = artifacts.require ("EnigmaToken.sol");
const Enigma = artifacts.require ("Enigma.sol");
const data = require ('../test/data');
var fs = require('fs');

module.exports = function (deployer) {
    return deployer
        .then (() => {
            return deployer.deploy (EnigmaToken, {overwrite: false});
        })
        .then (() => {
            return web3.eth.getAccounts ()
        })
        .then ((accounts) => {
            // Setting the principal node to the first signer address in the data file
            const principal = data.principal[0];
            console.log ('using account', principal, 'as principal signer');
            return deployer.deploy (Enigma, EnigmaToken.address, principal, {overwrite: false});
        })
        .then(() => {
            // Writing enigma contracts to a file for other processes to retrieve
            fs.writeFile('enigmacontract.txt', Enigma.address, 'utf8', function(err) {
                if(err) {
                    return console.log(err);
                }
            });
            fs.writeFile('enigmatokencontract.txt', EnigmaToken.address, 'utf8', function(err) {
                if(err) {
                    return console.log(err);
                }
            });

        })
};
