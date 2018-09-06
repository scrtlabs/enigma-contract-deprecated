const CoinMixer = artifacts.require ("CoinMixer.sol");
const Billionare = artifacts.require("Billionare.sol");
var fs = require('fs');

module.exports = function (deployer) {
    return deployer.then(() => {
            var enigmaAddress = fs.readFileSync('enigmacontract.txt', 'utf8');
            return deployer.deploy (CoinMixer, enigmaAddress);
        })
        .then(() => {
            return deployer.deploy (Billionare);
        });
}
