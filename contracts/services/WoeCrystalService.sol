pragma solidity ^0.4.18;

interface WoeCrystalService {
    /********************************** ERC20  **********************************/
    function balanceOf(address who) public view returns (uint256);
    function burn(uint256 _value) public;
    function mintCrystal(address _to, uint256 _amount) external;
}
