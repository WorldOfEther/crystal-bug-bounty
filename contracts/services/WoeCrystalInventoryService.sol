pragma solidity ^0.4.18;

interface WoeCrystalInventoryService {
    function useSunCrystal(address owner, uint amount) external;
    function useOceanCrystal(address owner, uint etherianId) external;
    function useLifeCrystal(address owner, uint etherianId, uint amount) external;
    function useDeathCrystal(address owner, uint etherianIdOne, uint etherianIdTwo, uint etherianIdThree) external;
    function useAstralCrystal(address owner) external;
}