pragma solidity ^0.4.17; 
import "./MillionairesProblem.sol";

contract MillionairesProblemFactory {
	address public enigmaAddress; 
	address[] public millionairesProblems; 

	constructor(address _enigmaAddress) {
		enigmaAddress = _enigmaAddress; 
	}

    function createNewMillionairesProblem() public {
        address newMillionairesProblem = new MillionairesProblem(enigmaAddress, msg.sender); 
        millionairesProblems.push(newMillionairesProblem); 
    }

    function getMillionairesProblems() public returns (address[]) {
        return millionairesProblems; 
    }
}