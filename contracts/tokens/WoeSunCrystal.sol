pragma solidity ^0.4.18;

import "../tokens/WoeCrystal.sol";
 
contract WoeSunCrystal is WoeCrystal {
    function WoeSunCrystal() WoeCrystal("World of Ether | Sun Crystal", "WOE_SUN", 0) public {}

    function useCrystal(uint amount) external whenNotPaused nonReentrant {
        require(transfer(address(inventoryService), amount));
        inventoryService.useSunCrystal(msg.sender, amount);
    }
}