pragma solidity ^0.4.18;

import "../tokens/WoeCrystal.sol";
 
contract WoeDeathCrystal is WoeCrystal {
    function WoeDeathCrystal() WoeCrystal("World of Ether | Death Crystal", "WOE_DEATH", 0) public {}

    function useCrystal(uint etherianIdOne, uint etherianIdTwo, uint etherianIdThree) external whenNotPaused nonReentrant {
        require(transfer(inventoryService, 1));
        inventoryService.useDeathCrystal(msg.sender, etherianIdOne, etherianIdTwo, etherianIdThree);
    }
}