pragma solidity ^0.4.18;

import "../tokens/WoeCrystal.sol";
 
contract WoeOceanCrystal is WoeCrystal {
    function WoeOceanCrystal() WoeCrystal("World of Ether | Ocean Crystal", "WOE_OCEAN", 0) public {}

    function useCrystal(uint etherianId) external whenNotPaused nonReentrant {
        require(transfer(inventoryService, 1));
        inventoryService.useOceanCrystal(msg.sender, etherianId);
    }
}