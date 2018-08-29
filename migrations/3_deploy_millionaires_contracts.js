const MillionairesProblemFactory = artifacts.require(
	"MillionairesProblemFactory.sol"
);

module.exports = function(deployer) {
	return deployer.then(() => {
		return deployer.deploy(
			MillionairesProblemFactory,
			"0x4019563906099327dB242a14606233b198D7ebc7"
		);
	});
};
