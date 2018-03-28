var RapidProfit = artifacts.require("./RapidProfit.sol");
//import assertRevert from './helpers/assertRevert';

contract('RapidProfit', (accounts) => {
    var contract;
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await RapidProfit.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

});



