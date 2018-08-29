pragma solidity ^0.4.17; 

// Import Enigma contract
import "./Enigma.sol";

contract MillionairesProblem {
	uint public numMillionaires; 
	Millionaire[] millionaires; 
	address public richestMillionaire; 
	address public owner;
	Enigma public enigma;

	struct Millionaire {
		bytes myAddress; 
		bytes myNetWorth; 
	}

	event CallbackFinished(); 

	// Modifier to ensure only enigma contract can call function
	modifier onlyEnigma() {
        require(msg.sender == address(enigma));
        _;
    }

	constructor(address _enigmaAddress, address _owner) public {
		owner = _owner; 
		enigma = Enigma(_enigmaAddress);
	}

    function addMillionaire(bytes _encryptedAddress, bytes _encryptedNetWorth) public {
    	Millionaire memory millionaire = Millionaire({
    		myAddress: _encryptedAddress, 
    		myNetWorth: _encryptedNetWorth
    	}); 
    	millionaires.push(millionaire); 
    	numMillionaires++; 
    }

    function getInfoForMillionaire(uint index) public view returns (bytes, bytes) {
    	Millionaire memory millionaire = millionaires[index]; 
    	bytes memory encryptedAddress = millionaire.myAddress; 
    	bytes memory encryptedNetWorth = millionaire.myNetWorth; 
    	return (encryptedAddress, encryptedNetWorth); 
    }

	function getRichestAddress() public view returns (address) {
		return richestMillionaire; 
	}
	
	// CALLABLE FUNCTION run in SGX to decipher encrypted net worths to determine richest millionaire
	function computeRichest(address[] _addresses, uint[] _netWorths) public pure returns (address) {
		uint maxIndex; 
		uint maxValue; 
		for (uint i = 0; i < _netWorths.length; i++) {
			if (_netWorths[i] >= maxValue) {
				maxValue = _netWorths[i]; 
				maxIndex = i; 
			}
		}
		return _addresses[maxIndex]; 
	}

	// CALLBACK FUNCTION to change contract state tracking richest millionaire's name
	function setRichestAddress(address _address) public onlyEnigma() {
		richestMillionaire = _address; 
		emit CallbackFinished(); 
	}
}