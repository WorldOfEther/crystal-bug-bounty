import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";

const WoeCrystalSale = artifacts.require("./WoeCrystalSale.sol");
const WoeSunCrystal = artifacts.require("./WoeSunCrystal.sol");
const WoeOceanCrystal = artifacts.require("./WoeOceanCrystal.sol");
const WoeLifeCrystal = artifacts.require("./WoeLifeCrystal.sol");
const WoeDeathCrystal = artifacts.require("./WoeDeathCrystal.sol");
const WoeAstralCrystal = artifacts.require("./WoeAstralCrystal.sol");
const TestableRandom = artifacts.require("./TestableRandom.sol");
const TestableWoeDatabase = artifacts.require("./TestableWoeDatabase.sol");

var ethjsABI = require('ethjs-abi');

let promisifyLogs = (instance) => {
    // console.log(instance);
    return new Promise((resolve, reject) => {
        instance.allEvents().get(function (error, logs) {
            if (error) {
                reject(error);
            }
            else {
                resolve(logs);
            }
        });
    });
};

contract('WoeCrystalSale', (accounts) => {
    function findMethod (abi, name, args) {
        for (var i = 0; i < abi.length; i++) {
          const methodArgs = _.map(abi[i].inputs, 'type').join(',');
          if ((abi[i].name === name) && (methodArgs === args)) {
            return abi[i];
          }
        }
      }

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];


    describe("Should", () => {
        let woeSunCrystal;
        let woeOceanCrystal;
        let woeLifeCrystal;
        let woeDeathCrystal;
        let woeAstralCrystal;
        let woeCrystalSale;
        let testableRandom;
        let woeDatabase;
        beforeEach(async () => {
            woeSunCrystal = await WoeSunCrystal.new();
            woeOceanCrystal = await WoeOceanCrystal.new();
            woeLifeCrystal = await WoeLifeCrystal.new();
            woeDeathCrystal = await WoeDeathCrystal.new();
            woeAstralCrystal = await WoeAstralCrystal.new();
            woeCrystalSale = await WoeCrystalSale.new();
            testableRandom = await TestableRandom.new();
            woeDatabase = await TestableWoeDatabase.new(); 
            await woeCrystalSale.setCrystalContracts(woeSunCrystal.address,woeOceanCrystal.address,woeLifeCrystal.address, woeDeathCrystal.address,woeAstralCrystal.address, testableRandom.address);
            await woeCrystalSale.setWoeDatabse(woeDatabase.address);
            await woeDatabase.setCrystalSaleContract(woeCrystalSale.address);
            await woeSunCrystal.setWoeServices(woeCrystalSale.address, 0, 0); 
            await woeOceanCrystal.setWoeServices(woeCrystalSale.address, 0, 0);
            await woeLifeCrystal.setWoeServices(woeCrystalSale.address, 0, 0);
            await woeDeathCrystal.setWoeServices(woeCrystalSale.address, 0, 0);
            await woeAstralCrystal.setWoeServices(woeCrystalSale.address, 0, 0);
        });

        it("fails to call ownerOnly functions from non-owner", async () => {
            await expectThrow(woeCrystalSale.setCrystalContracts(woeSunCrystal.address,woeOceanCrystal.address,woeLifeCrystal.address, woeDeathCrystal.address,woeAstralCrystal.address, testableRandom.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setSunCrystalContract(woeSunCrystal.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setOceanCrystalContract(woeOceanCrystal.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setLifeCrystalContract(woeLifeCrystal.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setDeathCrystalContract(woeDeathCrystal.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setAstralCrystalContract(woeAstralCrystal.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setWoeRandomContract(testableRandom.address, { from : account_two}));
            await expectThrow(woeCrystalSale.setWoeDatabse(testableRandom.address, { from : account_two})); // place holder address
            await expectThrow(woeCrystalSale.launch({ from : account_two}));
        });
        
        it("fail to purchase with too little funds: pre-launch", async () => {
            // set randoms
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(!isPostLaunch);

            //get price for 1 crystal
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_PRE_LAUNCH_PRICE.call();

            //fail purchase of 1 crystal with reduced funds
            await expectThrow(woeCrystalSale.purchaseRandomCrystal( { value : fee * .9 , from : account_four }));
            
            //get price for 5 crystals
            fee = await woeCrystalSale.RANDOM_CRYSTAL_FIVE_PRE_LAUNCH_PRICE.call();

            //fail purchase of 5 crystals with reduced funds
            await expectThrow(woeCrystalSale.purchaseRandomCrystalFive( { value : fee * .9 , from : account_four }));
            
            //get price for 25 crystals
            fee = await woeCrystalSale.RANDOM_CRYSTAL_TWENTY_FIVE_PRE_LAUNCH_PRICE.call();

            //fail purchase of 25 crystals with reduced funds
            await expectThrow(woeCrystalSale.purchaseRandomCrystalTwentyFive( { value : fee * .9 , from : account_four }));
        });

        it("fail to purchase with too little funds: POST-launch", async () => {
            // set randoms
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            // launch mainnet price
            await woeCrystalSale.launch();

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(isPostLaunch);

            //get price for 1 crystal
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_PRE_LAUNCH_PRICE.call();

            //fail purchase of 1 crystal with reduced funds
            await expectThrow(woeCrystalSale.purchaseRandomCrystal( { value : fee , from : account_four }));
            
            //get price for 5 crystals
            fee = await woeCrystalSale.RANDOM_CRYSTAL_FIVE_PRE_LAUNCH_PRICE.call();

            //fail purchase of 5 crystals with reduced funds
            await expectThrow(woeCrystalSale.purchaseRandomCrystalFive( { value : fee , from : account_four }));
            
            //get price for 25 crystals
            fee = await woeCrystalSale.RANDOM_CRYSTAL_TWENTY_FIVE_PRE_LAUNCH_PRICE.call();

            //fail purchase of 25 crystals with reduced funds
            await expectThrow(woeCrystalSale.purchaseRandomCrystalTwentyFive( { value : fee, from : account_four }));
        });

        it("purchase 1 random crystal | pre-launch", async () => {
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            //no crystal yet in account four
            var totalCrystals = await woeSunCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(!isPostLaunch);

            //get price for 1 crystal
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_PRE_LAUNCH_PRICE.call();

            //purchase 1 crystal
            await woeCrystalSale.purchaseRandomCrystal( { value : fee, from : account_four });
            await woeCrystalSale.purchaseRandomCrystal( { value : fee, from : account_one });

            // check account ones balance
            var crystalOwner = await woeSunCrystal.balanceOf(account_one);
            assert.equal(crystalOwner.toNumber(), 2);

            // check account fours balance
            crystalOwner = await woeSunCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 2);

            //total crystals now at 2
            totalCrystals = await woeSunCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 4);
        });

        it("purchase 1 random crystal | post-launch", async () => {
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(51); // roll to get SUN

            //no crystal yet in account four
            var totalCrystals = await woeSunCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            // launch mainnet price
            await woeCrystalSale.launch();

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(isPostLaunch);

            //get price for 1 crystal
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_POST_LAUNCH_PRICE.call();

            //purchase 1 crystal
            await woeCrystalSale.purchaseRandomCrystal( { value : fee, from : account_four });
            await woeCrystalSale.purchaseRandomCrystal( { value : fee, from : account_one });

            // check account ones balance
            var crystalOwner = await woeSunCrystal.balanceOf(account_one);
            assert.equal(crystalOwner.toNumber(), 2);

            // check account fours balance
            crystalOwner = await woeSunCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 2);

            //total crystals now at 2
            totalCrystals = await woeSunCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 4);
        });

        it("purchase 5 random crystals | pre-launch", async () => {
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(40); // roll to get OCEAN
            await testableRandom.pushValue(29); // roll to get LIFE
            await testableRandom.pushValue(14); // roll to get DEATH
            await testableRandom.pushValue(4); // roll to get ASTRAL

            //no SUN crystal yet in account four
            var totalCrystals = await woeSunCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no OCEAN crystal yet in account four
            totalCrystals = await woeOceanCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no LIFE crystal yet in account four
            totalCrystals = await woeLifeCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no DEATH crystal yet in account four
            totalCrystals = await woeDeathCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no ASTRAL crystal yet in account four
            totalCrystals = await woeAstralCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(!isPostLaunch);

            //get price for 5 crystals
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_FIVE_PRE_LAUNCH_PRICE.call();

            //purchase 5 crystals
            await woeCrystalSale.purchaseRandomCrystalFive( { value : fee, from : account_four });

            // check account fours SUN balance
            var crystalOwner = await woeSunCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 2);

            // check account fours OCEAN balance
            var crystalOwner = await woeOceanCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            // check account fours LIFE balance
            var crystalOwner = await woeLifeCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            // check account fours DEATH balance
            var crystalOwner = await woeDeathCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            // check account fours ASTRAL balance
            var crystalOwner = await woeAstralCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);
        });

        it("purchase 5 random crystals | pre-launch", async () => {
            await testableRandom.pushValue(51); // roll to get SUN
            await testableRandom.pushValue(40); // roll to get OCEAN
            await testableRandom.pushValue(29); // roll to get LIFE
            await testableRandom.pushValue(14); // roll to get DEATH
            await testableRandom.pushValue(4); // roll to get ASTRAL

            //no SUN crystal yet in account four
            var totalCrystals = await woeSunCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no OCEAN crystal yet in account four
            totalCrystals = await woeOceanCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no LIFE crystal yet in account four
            totalCrystals = await woeLifeCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no DEATH crystal yet in account four
            totalCrystals = await woeDeathCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //no ASTRAL crystal yet in account four
            totalCrystals = await woeAstralCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            // launch mainnet price
            await woeCrystalSale.launch();

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(isPostLaunch);

            //get price for 5 crystals
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_FIVE_POST_LAUNCH_PRICE.call();

            //purchase 5 crystals
            await woeCrystalSale.purchaseRandomCrystalFive( { value : fee, from : account_four });

            // check account fours SUN balance
            var crystalOwner = await woeSunCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 2);

            // check account fours OCEAN balance
            var crystalOwner = await woeOceanCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            // check account fours LIFE balance
            var crystalOwner = await woeLifeCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            // check account fours DEATH balance
            var crystalOwner = await woeDeathCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            // check account fours ASTRAL balance
            var crystalOwner = await woeAstralCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);
        });

        it("purchase 25 random crystals | pre-launch", async () => {
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            
            //no crystal yet in account four
            var totalCrystals = await woeAstralCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(!isPostLaunch);

            //get price for 1 crystal
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_TWENTY_FIVE_PRE_LAUNCH_PRICE.call();

            //purchase 25 crystals
            await woeCrystalSale.purchaseRandomCrystalTwentyFive( { value : fee, from : account_four });

            //total crystals now at 25
            var totalCrystals = await woeAstralCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 25);
        });

        it("purchase 25 random crystals | pre-launch", async () => {
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            await testableRandom.pushValue(4); // roll to get ASTRAL
            
            //no crystal yet in account four
            var totalCrystals = await woeAstralCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            // launch mainnet price
            await woeCrystalSale.launch();

            var isPostLaunch = await woeCrystalSale.postLaunch.call();
            assert(isPostLaunch);

            //get price for 1 crystal
            var fee = await woeCrystalSale.RANDOM_CRYSTAL_TWENTY_FIVE_POST_LAUNCH_PRICE.call();

            //purchase 25 crystals
            await woeCrystalSale.purchaseRandomCrystalTwentyFive( { value : fee, from : account_four });

            //total crystals now at 25
            var totalCrystals = await woeAstralCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 25);
        });

        it("fail without having purchased Egg", async () => {
            await testableRandom.pushValue(51); // value irrelevant

            //fail to redeem
            await expectThrow(woeCrystalSale.redeemCrystal( {from : account_four }));
        });

        it("redeem random crystal: sun", async () => {
            await testableRandom.pushValue(51); // roll to get SUN

            //no crystal yet in account four
            var totalCrystals = await woeSunCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);
            
            //set has purcahsed egg
            await woeDatabase.setHasPurchasedEgg(account_four);
            
            //redeem crystal
            await woeCrystalSale.redeemCrystal( { from : account_four });

            // check account fours balance
            var crystalOwner = await woeSunCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 2);

            //total crystals now at 1
            totalCrystals = await woeSunCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 2);
        });

        it("redeem crystal: ocean", async () => {
            await testableRandom.pushValue(40); // roll to get OCEAN

            //no crystal yet in account four
            var totalCrystals = await woeOceanCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            ///set has purcahsed egg
            await woeDatabase.setHasPurchasedEgg(account_four);
            
            //redeem crystal
            await woeCrystalSale.redeemCrystal( { from : account_four });

            // check account fours balance
            var crystalOwner = await woeOceanCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            //total crystals now at 1
            totalCrystals = await woeOceanCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 1);
        });

        it("redeem crystal: life", async () => {
            await testableRandom.pushValue(29); // roll to get LIFE

            //no crystal yet in account four
            var totalCrystals = await woeLifeCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //set has purcahsed egg
            await woeDatabase.setHasPurchasedEgg(account_four);
            
            //redeem crystal
            await woeCrystalSale.redeemCrystal( { from : account_four });

            // check account fours balance
            var crystalOwner = await woeLifeCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            //total crystals now at 1
            totalCrystals = await woeLifeCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 1);
        });

        it("redeem crystal: death", async () => {
            await testableRandom.pushValue(14); // roll to get death

            //no crystal yet in account four
            var totalCrystals = await woeDeathCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //set has purcahsed egg
            await woeDatabase.setHasPurchasedEgg(account_four);
            
            //redeem crystal
            await woeCrystalSale.redeemCrystal( { from : account_four });

            // check account fours balance
            var crystalOwner = await woeDeathCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            //total crystals now at 1
            totalCrystals = await woeDeathCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 1);
        });

        it("redeem crystal: astral", async () => {
            await testableRandom.pushValue(4); // roll to get astral

            //no crystal yet in account four
            var totalCrystals = await woeAstralCrystal.totalSupply.call({ from: account_four });
            assert.equal(totalCrystals.toNumber(), 0);

            //set has purcahsed egg
            await woeDatabase.setHasPurchasedEgg(account_four);
            
            //redeem crystal
            await woeCrystalSale.redeemCrystal( { from : account_four });

            // check account fours balance
            var crystalOwner = await woeAstralCrystal.balanceOf(account_four);
            assert.equal(crystalOwner.toNumber(), 1);

            //total crystals now at 1
            totalCrystals = await woeAstralCrystal.totalSupply.call();
            assert.equal(totalCrystals.toNumber(), 1);
        });
    });
});