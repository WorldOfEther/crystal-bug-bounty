import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";

const WoeCrystal = artifacts.require("./WoeCrystal.sol");

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

contract('WoeCrystal', (accounts) => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    let woeCrystal;
    beforeEach(async () => {
        woeCrystal = await WoeCrystal.new("test name", "test symbol", 0);
    });

    describe("Should", () => {
        it("get token name", async () => {
            //get token name
            var tokenName = await woeCrystal.name.call();
            assert.equal(tokenName, "test name");
        }); 

        it("get token symbol", async () => {
            //get token symbol
            var tokenSymbol = await woeCrystal.symbol.call();
            assert.equal(tokenSymbol, "test symbol");
        }); 

        it("get token decimals", async () => {
            //get token name
            var tokenDecimals = await woeCrystal.decimals.call();
            assert.equal(tokenDecimals, 0);
        }); 

        it("fail to mint unless assigned address", async () => {
            await expectThrow(woeCrystal.mintCrystal(account_two, 3,{ from: account_one }));
            await expectThrow(woeCrystal.mintCrystal(account_two, 3,{ from: account_two }));
            await expectThrow(woeCrystal.mintCrystal(account_two, 3,{ from: account_three }));
        });

        it("mint crystals", async () => {
            //no tokens yet
            var totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 0);

            await woeCrystal.setWoeServices(account_one, 0, account_three);

            //mint 3 tokens for account two
            await woeCrystal.mintCrystal(account_two, 3);

            //check account twos balance
            var tokenOwner = await woeCrystal.balanceOf(account_two);
            assert.equal(tokenOwner.toNumber(), 3);

            //total tokens now at 3
            totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 3);
        });    

        it("burn crystals", async () => {
            //no tokens yet
            var totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 0);

            await woeCrystal.setWoeServices(account_one, 0, account_three);

            //mint 30 tokens for account one
            await woeCrystal.mintCrystal(account_one, 30);

            //check account one balance
            var tokenOwner = await woeCrystal.balanceOf(account_one);
            assert.equal(tokenOwner.toNumber(), 30);

            //total tokens now at 30
            totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 30);

            //burn 20 tokens for account one
            await woeCrystal.burn(20);

            //check account one balance
            var tokenOwner = await woeCrystal.balanceOf(account_one);
            assert.equal(tokenOwner.toNumber(), 10);

            //total tokens now at 10
            totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 10);
        });

        it("transfer crystals from one user to another", async () => {            
            //no tokens yet
            var totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 0);

            await woeCrystal.setWoeServices(account_one, 0, account_three);

            //mint 3 tokens for account two
            await woeCrystal.mintCrystal(account_two, 3);

            //check account twos balance
            var tokenOwner = await woeCrystal.balanceOf(account_two);
            assert.equal(tokenOwner.toNumber(), 3);

            //total tokens now at 3
            totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 3);

            await woeCrystal.setWoeServices(account_one, 0, account_three);

            //mint 3 tokens for account two
            await woeCrystal.mintCrystal(account_one, 245);

            //check account ones balance
            var tokenOwner = await woeCrystal.balanceOf(account_one);
            assert.equal(tokenOwner.toNumber(), 245);

            //total tokens now at 248
            totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 248);

            //transfer 50 tokens from account one to account two
            assert(await woeCrystal.transfer(account_two, 50));

            //check account ones balance
            var tokenOwner = await woeCrystal.balanceOf(account_one);
            assert.equal(tokenOwner.toNumber(), 195);

            //check account twos balance
            var tokenOwner = await woeCrystal.balanceOf(account_two);
            assert.equal(tokenOwner.toNumber(), 53);

            //total tokens should remain 248
            totalTokens = await woeCrystal.totalSupply.call();
            assert.equal(totalTokens.toNumber(), 248);
        });
    });

});