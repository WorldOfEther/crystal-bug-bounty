pragma solidity ^0.4.18;

import "../../node_modules/zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../../node_modules/zeppelin-solidity/contracts/ReentrancyGuard.sol";
import "../tokens/WoeCrystal.sol";
import "../services/WoeRandomService.sol";
import "../services/WoeDatabasePlayerService.sol";

contract WoeCrystalSale is Pausable, ReentrancyGuard {
    event CrystalPurchased(address indexed purchaser, uint256 value, uint quantityPurchased);
    
    uint256 constant public RANDOM_CRYSTAL_PRE_LAUNCH_PRICE = 35970035611891000;
    uint256 constant public RANDOM_CRYSTAL_FIVE_PRE_LAUNCH_PRICE = 161865160253509504;
    uint256 constant public RANDOM_CRYSTAL_TWENTY_FIVE_PRE_LAUNCH_PRICE = 719400712237820032;

    uint256 constant public RANDOM_CRYSTAL_POST_LAUNCH_PRICE = 53955053417836496;
    uint256 constant public RANDOM_CRYSTAL_FIVE_POST_LAUNCH_PRICE = 242797740380264256;
    uint256 constant public RANDOM_CRYSTAL_TWENTY_FIVE_POST_LAUNCH_PRICE = 1079101068356729984;

    uint256 public randomCrystalsSold; 
    bool public postLaunch;

    WoeRandomService woeRandomContract;
    WoeDatabasePlayerService woeDatabase;

    WoeCrystal private sunCrystalContract;
    WoeCrystal private oceanCrystalContract;
    WoeCrystal private lifeCrystalContract;
    WoeCrystal private deathCrystalContract;
    WoeCrystal private astralCrystalContract;

    function setCrystalContracts(
        WoeCrystal sunContractAddress, 
        WoeCrystal oceanContractAddress, 
        WoeCrystal lifeContractAddress, 
        WoeCrystal deathContractAddress, 
        WoeCrystal astralContractAddress,
        WoeRandomService woeRandomContractAddress
    ) onlyOwner external 
    {
        setSunCrystalContract(sunContractAddress);
        setOceanCrystalContract(oceanContractAddress);
        setLifeCrystalContract(lifeContractAddress);
        setDeathCrystalContract(deathContractAddress);
        setAstralCrystalContract(astralContractAddress);
        setWoeRandomContract(woeRandomContractAddress);
    }

    function setWoeRandomContract(WoeRandomService contractAddress) onlyOwner {
        woeRandomContract = contractAddress;
    }

    function setWoeDatabse(WoeDatabasePlayerService woeDatabseAddress) onlyOwner {
        woeDatabase = woeDatabseAddress;
    }

    function setSunCrystalContract(WoeCrystal contractAddress) onlyOwner {
        sunCrystalContract = contractAddress;
    }
    
    function setOceanCrystalContract(WoeCrystal contractAddress) onlyOwner {
        oceanCrystalContract = contractAddress;
    }

    function setLifeCrystalContract(WoeCrystal contractAddress) onlyOwner {
        lifeCrystalContract = contractAddress;
    }

    function setDeathCrystalContract(WoeCrystal contractAddress) onlyOwner {
        deathCrystalContract = contractAddress;
    }

    function setAstralCrystalContract(WoeCrystal contractAddress) onlyOwner {
        astralCrystalContract = contractAddress;
    }

    function launch() onlyOwner {
        require(!postLaunch);
        postLaunch = true;
    }

    function purchaseRandomCrystal() nonReentrant whenNotPaused payable external {
        if (postLaunch) {
            require(msg.value >= RANDOM_CRYSTAL_POST_LAUNCH_PRICE);
        } else {
            require(msg.value >= RANDOM_CRYSTAL_PRE_LAUNCH_PRICE);
        }

        giveRandomCrystal();
        CrystalPurchased(msg.sender, msg.value, 1);
    }

    function purchaseRandomCrystalFive() nonReentrant whenNotPaused payable external {
        if (postLaunch) {
            require(msg.value >= RANDOM_CRYSTAL_FIVE_POST_LAUNCH_PRICE);
        } else {
            require(msg.value >= RANDOM_CRYSTAL_FIVE_PRE_LAUNCH_PRICE);
        }
        
        giveRandomCrystalBulk();
        CrystalPurchased(msg.sender, msg.value, 5);
    }

    function purchaseRandomCrystalTwentyFive() nonReentrant whenNotPaused payable external {
        if (postLaunch) {
            require(msg.value >= RANDOM_CRYSTAL_TWENTY_FIVE_POST_LAUNCH_PRICE);
        } else {
            require(msg.value >= RANDOM_CRYSTAL_TWENTY_FIVE_PRE_LAUNCH_PRICE);
        }
        
        giveRandomCrystalBulk();
        giveRandomCrystalBulk();
        giveRandomCrystalBulk();
        giveRandomCrystalBulk();
        giveRandomCrystalBulk();

        CrystalPurchased(msg.sender, msg.value, 5);
    }

    function redeemCrystal() nonReentrant whenNotPaused external {
        require(woeDatabase != address(0));
        require(woeRandomContract != address(0));
        require(woeDatabase.getHasPurchasedEgg(msg.sender));
        require(!woeDatabase.getHasRedeemedCrystal(msg.sender));

        woeDatabase.setPlayerHasRedeemedCrystal(msg.sender);

        giveRandomCrystal();
    }

    function giveRandomCrystal() internal {
        uint random = woeRandomContract.random(100);
        uint base = 5; 
        
        if (random <= base) {
            // 5% reg
            astralCrystalContract.mintCrystal(msg.sender, 1);
        } else if (random <= base * 3) {
            // 10% reg
            deathCrystalContract.mintCrystal(msg.sender, 1);
        } else if (random <= base * 6) {
            // 15% reg
            lifeCrystalContract.mintCrystal(msg.sender, 1);
        } else if (random <= base * 10) {
            // 20% reg
            oceanCrystalContract.mintCrystal(msg.sender, 1);
        } else {
            // 50% reg
            sunCrystalContract.mintCrystal(msg.sender, 2);
        } 

        randomCrystalsSold++;
        CrystalPurchased(msg.sender, msg.value, 25);
    }

    function giveRandomCrystalBulk() internal {
        giveRandomCrystal();
        giveRandomCrystal();
        giveRandomCrystal();
        giveRandomCrystal();
        giveRandomCrystal();
    }

    function withdraw() onlyOwner {
        owner.transfer(this.balance);
    }

}