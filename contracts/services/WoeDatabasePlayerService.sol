pragma solidity ^0.4.18;

interface WoeDatabasePlayerService {
    /************************************* Player getters/setters *****************************************/
    function getHasRedeemedCrystal(address player) view external returns(bool);

    function getHasPurchasedEgg(address player) view external returns(bool);

    function setPlayerHasRedeemedCrystal(address player) external;
}