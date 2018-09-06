import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";

const TestableRandom = artifacts.require("./TestableRandom.sol");

let inLogs = async (logs, eventName) => {
    const event = logs.find(function(e) {
        console.log(e);
        return e.event === eventName;
    });
    assert.exists(event);
};

let promisifyLogs = (instance)=>{
    return new Promise((resolve, reject)=>{
        instance.allEvents().get(function(error, logs){
            if(error)
            {
                reject(error);
            }
            else
            {
                resolve(logs);
            }
        }); 
    });
};

contract('TestableRandom', (accounts) => {
    let testableRandom;
    beforeEach(async () => {
        testableRandom = await TestableRandom.new();
    });

    describe('should', () => {
        it("throw when empty", async () => {
           return expectThrow(testableRandom.random(0));
        });

        it("return what it's given", async () => {
            await testableRandom.pushValue(10);
            await testableRandom.random(0);

            var logs = await promisifyLogs(testableRandom);
            assert.equal(logs[0].event, "RandomResult");
            assert.equal(logs[0].args.value, 10);
        });

        it("return multiple items given", async () => {
            await testableRandom.pushValue(10);
            await testableRandom.pushValue(20);
            await testableRandom.pushValue(30);

            await testableRandom.random(0);
            var logs = await promisifyLogs(testableRandom);
            assert.equal(logs[0].event, "RandomResult");
            assert.equal(logs[0].args.value.toNumber(), 10);

            await testableRandom.random(0);
            logs = await promisifyLogs(testableRandom);
            assert.equal(logs[0].event, "RandomResult");
            assert.equal(logs[0].args.value.toNumber(), 20);

            await testableRandom.random(0);
            logs = await promisifyLogs(testableRandom);
            assert.equal(logs[0].event, "RandomResult");
            assert.equal(logs[0].args.value.toNumber(), 30);
        });
    });
});
