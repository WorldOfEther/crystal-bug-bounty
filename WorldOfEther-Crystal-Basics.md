# Basics of World of Ether Crystals:

Crystal contracts are composed of 5 public facing ERC20 contracts, 1 Random number generator contract, and 1 Sale contract. Below we'll provide an overview on these contracts: 

##### `WoeSunCrystal.sol` - `0x0abe19a63066e09995f4c1690ca3c1eca6860c8a`
##### `WoeOceanCrystal.sol` - `0xd6571eb2f202be631f92e47728c195380a8d8298`
##### `WoeLifeCrystal.sol` - `0x87229904ab8185fc569bfd9238a1679a455c1b7d`
##### `WoeDeathCrystal.sol` - `0x0a784dc442333390c85b3ee375a071fc4eb80d48`
##### `WoeAstralCrystal.sol` - `0x587d6096724dffdc6cba081a5ba5e3cb06f068c2`

These are the main contracts. Although there are 5 of these contracts, they are all children of WoeCrystal.sol with different parameters passed in for token name and symbol. In addition, each has a unique function for Crystal usage that call a proxy contract.

##### `WoeRandom.sol` - `0x8b66b08be26858add451f30298b21ab2a6a29020`

This contract is a RNG using a combination of information from the block. Additional information about this random can be found here: https://github.com/axiomzen/eth-random

##### `WoeCrystalSale.sol` - `0x6ad4e0d97c76b3807b19e9e37d753cbb248cddb0`

A sale contract that generates a random Crystal (Sun, Ocean, Life, Death, Astral) upon purchase. Bulk purchases allowed and there are 2 prices for each set of purchases (pre-launch & post-launch prices). This contract also allows for a free 1 time redemption of a Crystal if the player has the proper values set on their account.

## Base Contracts

Many of the contracts inherit base functionality from well known Open-Zeppelin contracts, such as: Pausable/Ownable, Standard Token. For more information please see imports along with open-zeppelins github: https://github.com/OpenZeppelin/openzeppelin-solidity/tree/master/contracts/


## Basic Crystal Rules

- Crystal tokens have no decimal values
- users have the option to purchase Crystals in 1, 5, or 25 sets. Crystal choices are generated at different random percentages with Sun being most common and Astral being least common. Everytime a users chance wins a Sun Crystal they get 2 instead of 1. All other Crystals they get 1.

for example: purchasing 5 Crystals gets you 5 rolls. If 2 of those rolls were for Sun and 3 were for Ocean the player would receive 4 Sun Crystals and 3 Ocean Crystals.

- Users that have purchased an egg will have the ability to redeem a random Crystal for free, 1 time.

- Crystals can be used at any time with the useCrystal(). The use function operates differently on each contract and costs different amounts

- New Crystals can only be minted from either the set crystalSale contract address or the set crystalInventory contract address

## Trading

Because Crystals are ERC20 you can either transfer to another Ethereum address, or approve to another address.

# Additional Information


The `WoeCrystalInventory` & `WoeDatabase` contracts are not deployed on rinkeby for this beta testing. This means that the redeemCrystal() function should not be able to be triggered on rinkeby.

However, there is a `TestableWoeDatabase.sol` used to mimic its functionality for truffle testing. Additionally, there is a `TestableRandom.sol` contract used to mimic predictable test scenarios for truffle testing.

There are more rules and comments on the source code, please refer to the code and tests in case things don't work as first expected.

## Running Tests

The only pre-dependency is **NODE**

We are using [Truffle framework to develop](http://truffleframework.com/docs/), all dependencies are installed via `npm install`

Run the the test suite: `npm run test:contracts`
