pragma solidity ^0.4.18;

import "../tokens/WoeCrystal.sol";
 
contract WoeAstralCrystal is WoeCrystal {
    function WoeAstralCrystal() WoeCrystal("World of Ether | Astral Crystal", "WOE_ASTRAL", 0) public {}

    function useCrystal() external whenNotPaused nonReentrant {
        require(transfer(inventoryService, 1));
        inventoryService.useAstralCrystal(msg.sender);
    }
}