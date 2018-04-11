var RapidProfit = artifacts.require("./RapidProfit.sol");
var ContractStakeEth = artifacts.require('./ContractStakeEth.sol');

var contractRP;
var contractEth;
var contractToken;

contract('ContractStakeEth', (accounts) => {

    it('should deployed ContractStakeEth', async ()  => {
        assert.equal(undefined, contractEth);
        contractEth = await ContractStakeEth.deployed();
        assert.notEqual(undefined, contractEth);
    });

    it('get address ContractStakeEth', async ()  => {
        assert.notEqual(undefined, contractEth.address);
        contractOwner = await contractEth.owner.call();
        //console.log("ContractStakeEth Owner = " + contractOwner);
    });

});

/*
contract('ContractStakeToken', (accounts) => {
    it('should deployed ContractStakeToken', async ()  => {
        assert.equal(undefined, contractStakeToken);
        contractStakeToken = await ContractStakeToken.deployed();
        assert.notEqual(undefined, contractStakeToken);
    });

    it('get address ContractStakeToken', async ()  => {
        assert.notEqual(undefined, contractStakeToken.address);
        contractOwner = await contractStakeEth.owner.call();
        console.log("contractOwner = " + contractOwner);
    });
});
*/


contract('RapidProfit', (accounts) => {
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";
    var TwoETH = 2*10**18;
    var OneETH = 1*10**18;


    it('should deployed contract RapidProfit', async ()  => {
        assert.equal(undefined, contractRP);
        contractRP = await RapidProfit.deployed();
        assert.notEqual(undefined, contractRP);
    });

    it('get address contract RapidProfit', async ()  => {
        assert.notEqual(undefined, contractRP.address);
        contractOwner = await contractRP.owner.call();
        //console.log("contractRP Owner = " + contractOwner);
    });

    it('check set ContractStakeEth', async ()  => {
        await contractRP.setContractStakeEth(contractEth.address);
    });

    it('verification of ETH deposition', async ()  => {
        //deposit(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time)
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contractRP.balanceOfETH(accounts[1]);
        await contractRP.depositETH(accounts[1], 0, currentTime, {value:OneETH, from:accounts[0]});
        balanceAccountOneAfter = await contractRP.balanceOfETH(accounts[1]);
        //console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        assert.equal(0, balanceAccountOneBefore);
        assert.equal(OneETH, balanceAccountOneAfter);
    });

    it('verification of ETH validWithdraw', async ()  => {
        var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contractRP.balanceOfETH(accounts[1]);
        //await contractRP.depositETH(accounts[1], TwoETH, 1, currentTime, {from:accounts[0]});
        await contractRP.depositETH(accounts[1], 1, currentTime, {value:TwoETH, from:accounts[0]});
        balanceAccountOneAfter = await contractRP.balanceOfETH(accounts[1]);
        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        //validWithdrawETH(address _address, uint256 _now)
        var amount = await contractRP.validWithdrawETH.call(accounts[1], newTime, {from:accounts[1]});
        await contractRP.validWithdrawETH(accounts[1], newTime, {from:accounts[1]});
        //console.log("amount=" + amount);
        assert.equal(OneETH*1.01, amount);

        var countStakes = await contractRP.getCountStakesEth();
        assert.equal(2, countStakes);
        //console.log("countStakes=" + countStakes);
        for (var i = 0; i < countStakes; i++) {
            var stakeETH = await contractRP.getETHStakeByIndex(i);
            //console.log("stakeETH["+ i +"]=" + JSON.stringify(stakeETH));
        }

        var countTransferIns = await contractRP.getCountTransferInsEth(accounts[1]);
        assert.equal(2, countTransferIns);
        var transferInsETH_Two = await contractRP.getETHTransferInsByAddress(accounts[1], 1);
        var transferInsETH_One = await contractRP.getETHTransferInsByAddress(accounts[1], 0);
        assert.equal(true, transferInsETH_One[1]);
        assert.equal(false, transferInsETH_Two[1]);
        //console.log("transferInsETH(2).isRipe=" + transferInsETH_Two[1]);
        //console.log("countTransferIns=" + countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsETH = await contractRP.getETHTransferInsByAddress(accounts[1], j);
            //console.log("transferInsETH[" + j + "]=" + JSON.stringify(transferInsETH));
        }
    });

});
