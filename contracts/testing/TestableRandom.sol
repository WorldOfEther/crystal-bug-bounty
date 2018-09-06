pragma solidity ^0.4.18;

import "../services/WoeRandomService.sol";

/**
    this is used to mimic the RNG contract used by World of Ether. It
    allows for manipulated values so that truffle tests can funciton in a 
    predictive manner
 */
contract TestableRandom {
    event RandomResult(uint256 value);

    uint256[] public values;
    uint256 private position;
    
    function pushValue (uint256 value) public {
        values.push(value);
    }

    function random(uint256 upper) public returns (uint256 randomNumber) {
        require(values.length + 1 > position);
        var result = values[position];

        RandomResult(result);

        position = position + 1;
        return result;
    }
}