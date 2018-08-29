var fs = require('fs');
const MillionairesProblemFactory = artifacts.require(
  "MillionairesProblemFactory.sol"
);

module.exports = function(deployer) {
    return deployer.then(() => {
          var enigmaAddress = fs.readFileSync('enigmacontract.txt', 'utf8');
          return deployer.deploy(
            MillionairesProblemFactory,
            enigmaAddress
          );
    })
};
