pragma solidity ^0.4.18;

import "../../node_modules/zeppelin-solidity/contracts/lifecycle/Pausable.sol";

//this contract and its functions are for testing purposes only and is not 
//the actual database that will be used. It mimicks functionality strictly for the purpose
//of CrystalSale.sol and its WoeCrystalSale.js tests.
contract TestableWoeDatabase is Pausable {

    bool hasPurchasedEgg;
    bool hasRedeemedCrystal;

    address public crystalSaleContract;
    
    function setCrystalSaleContract(address crystalSaleContractAddress) external {
        crystalSaleContract = crystalSaleContractAddress;
    }

    function isCrystalSaleContract() internal view returns (bool) {
        return (crystalSaleContract != address(0) && msg.sender == crystalSaleContract);
    }

    function getHasRedeemedCrystal(address player) view external returns(bool) {
        return hasRedeemedCrystal;
    }

    function getHasPurchasedEgg(address player) view external returns(bool) {
        return hasPurchasedEgg;
    }

    function setPlayerHasRedeemedCrystal(address player) external {
        require(isCrystalSaleContract());
        hasRedeemedCrystal = true;
    }

    function setHasPurchasedEgg(address account) external onlyOwner {
        hasPurchasedEgg = true;
    }
}