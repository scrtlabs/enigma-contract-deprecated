pragma solidity ^0.4.17; 

// Import Enigma contract
import "./Enigma.sol";

contract MillionairesProblem {
	// Millionaire struct containing name and netWorth properties
	struct Millionaire {
		bytes32 name; 
		bytes32 netWorth; 
	}

	uint public numMillionaires; 
	Millionaire[2] public millionaires; 
	bytes32 public richestMillionaire; 
	address public owner;
	Enigma public enigma;

	constructor(address _enigmaAddress, address _owner) public {
		owner = _owner; 
		enigma = Enigma(_enigmaAddress);
	}

	// Max of two millionaires in any comparison
	modifier maxMillionaires() {
		require(numMillionaires < 2); 
		_; 
	} 

	// Modifier to ensure only enigma contract can call function
	modifier onlyEnigma() {
        require(msg.sender == address(enigma));
        _;
    }

    // Function to send millionaire's name and encrypted net worth to contract storage
	function stateNetWorth(bytes32 _name, bytes32 _netWorth) public maxMillionaires() {
		Millionaire storage currentMillionaire = millionaires[numMillionaires]; 
		currentMillionaire.name = _name; 
		currentMillionaire.netWorth = _netWorth; 
		numMillionaires++; 
	}

	// Function to return tuple of lists containing millionaire names and encrypted net worths
	function getMillionaires() public view returns (bytes32[2], bytes32[2]) {
		bytes32[2] memory names; 
		bytes32[2] memory netWorths; 
		for (uint i = 0; i < numMillionaires; i++) {
			Millionaire memory currentMillionaire = millionaires[i]; 
			names[i] = currentMillionaire.name; 
			netWorths[i] = currentMillionaire.netWorth; 
		}
		return (names, netWorths); 
	}

	function getRichestAddress() public view returns (bytes32) {
		return richestMillionaire; 
	}
	
	// CALLABLE FUNCTION run in SGX to decipher encrypted net worths to determine richest millionaire
	function computeRichest(bytes32[2] _names, uint[2] _netWorths) public pure returns (bytes32) {
		if (_netWorths[1] >= _netWorths[0]) {
			return _names[1]; 
		}
		return _names[0]; 
	}

	// CALLBACK FUNCTION to change contract state tracking richest millionaire's name
	function setRichestAddress(bytes32 _name) public onlyEnigma() {
		richestMillionaire = _name; 
	}
}