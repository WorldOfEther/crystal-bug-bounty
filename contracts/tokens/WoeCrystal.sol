pragma solidity ^0.4.18;

import "../tokens/WoeBurnableCrystal.sol";
import "../presale/WoeCrystalSale.sol";
import "../services/WoeCrystalInventoryService.sol";
import "../../node_modules/zeppelin-solidity/contracts/ReentrancyGuard.sol";

contract WoeCrystal is WoeBurnableCrystal, ReentrancyGuard {
    string public name;
    string public symbol;
    uint8 public decimals;

    WoeCrystalSale public crystalSale;
    WoeCrystalInventoryService public inventoryService;
    address woeExperience;

    function WoeCrystal(string _name, string _symbol, uint8 _decimals) public { 
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function setWoeServices(WoeCrystalSale crystalSaleAddress, WoeCrystalInventoryService inventorySaleAddress, address _woeExperience) onlyOwner external {
        crystalSale = crystalSaleAddress;
        inventoryService = inventorySaleAddress;
        woeExperience = _woeExperience;
    }

    function isCrystalSaleContract() internal returns (bool) {
        return crystalSale != address(0) && crystalSale == msg.sender;
    }

    function isExperienceContract() internal returns (bool) {
        return woeExperience != address(0) && woeExperience == msg.sender;
    }

    function mintCrystal(address _to, uint256 _amount) external whenNotPaused nonReentrant {
        require(isCrystalSaleContract() || isExperienceContract());
        mint(_to, _amount); 
    }
}