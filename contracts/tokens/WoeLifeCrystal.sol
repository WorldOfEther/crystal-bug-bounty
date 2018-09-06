pragma solidity ^0.4.18;

import "../tokens/WoeCrystal.sol";
 
contract WoeLifeCrystal is WoeCrystal {
    function WoeLifeCrystal() WoeCrystal("World of Ether | Life Crystal", "WOE_LIFE", 0) public {}

    function useCrystal(uint etherianId, uint amount) external whenNotPaused nonReentrant {
        require(transfer(inventoryService, amount));
        inventoryService.useLifeCrystal(msg.sender, etherianId, amount);
    }
}