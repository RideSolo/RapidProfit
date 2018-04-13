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
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contractRP.balanceOfETH(accounts[1]);
        //await contractRP.depositETH(accounts[1], TwoETH, 1, currentTime, {from:accounts[0]});
        await contractRP.depositETH(accounts[1], 1, currentTime, {value:TwoETH, from:accounts[0]});
        balanceAccountOneAfter = await contractRP.balanceOfETH(accounts[1]);
        var newTime = 1522972802; //Fri, 06 Apr 2018 00:00:00 GMT
        //validWithdrawETH(address _address, uint256 _now)
        var amount = await contractRP.validWithdrawETH.call(accounts[1], newTime, {from:accounts[1]});
        await contractRP.validWithdrawETH(accounts[1], newTime, {from:accounts[1]});
        var profit = await contractRP.calculator.call(0, OneETH, Number((newTime - currentTime)/3600));
        //console.log("amount=" + amount + "; profit=" + profit);
        assert.equal(Number(profit), Number(amount));

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

    it('verification of ETH calculate of profit', async ()  => {
        var profitStake1Days = await contractRP.calculator.call(0, OneETH, 36);
        //console.log("profitStake1Days(36)=" + profitStake1Days);
        assert.equal(OneETH*1.01, profitStake1Days);

        var profitStake1Days = await contractRP.calculator.call(0, OneETH, 49);
        //console.log("profitStake1Days(49)=" + profitStake1Days);
        assert.equal(Number(OneETH*1.01*1.01), profitStake1Days);

        var profitStake7Days = await contractRP.calculator.call(1, OneETH, 150);
        //console.log("profitStake7Days(150)=" + profitStake7Days);
        assert.equal(OneETH, profitStake7Days);

        var profitStake7Days = await contractRP.calculator.call(1, OneETH, 340);
        //console.log("profitStake7Days(340)=" + profitStake7Days);
        //assert.equal(Number(OneETH)*1.09*1.09, profitStake7Days);

        var profitStake30Days = await contractRP.calculator.call(2, OneETH, 750);
        //console.log("profitStake30Days(750)=" + profitStake30Days);
        assert.equal(Number(OneETH*1.36), profitStake30Days);

        var profitStake30Days = await contractRP.calculator.call(2, OneETH, 1470);
        //console.log("profitStake30Days(1470)=" + profitStake30Days);
        assert.equal(Number(OneETH*1.36*1.36) - 300, profitStake30Days);

        var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:02 GMT
        balanceAccountForBefore = await contractRP.balanceOfETH(accounts[4]);

        await contractRP.depositETH(accounts[4], 0, currentTime, {value:OneETH, from:accounts[0]});
        await contractRP.depositETH(accounts[4], 1, currentTime, {value:OneETH, from:accounts[0]});
        await contractRP.depositETH(accounts[4], 2, currentTime, {value:OneETH, from:accounts[0]});

        balanceAccountForAfter = await contractRP.balanceOfETH(accounts[4]);

        var newTime = 1522800022; //Fri, 04 Apr 2018 00:00:22 GMT
        var amount0Days = await contractRP.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});
        assert.equal(0, amount0Days);

        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        var amount2Days = await contractRP.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});
        //console.log("amount2Days = " + amount2Days)
        assert.equal(OneETH*1.01, amount2Days);

        var newTime = 1523491200; //Fri, 12 Apr 2018 00:00:00 GMT
        var amount8Days = await contractRP.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});
        var profitStake0 = await contractRP.calculator.call(0, OneETH, Number((newTime - currentTime)/3600));
        var profitStake1 = await contractRP.calculator.call(1, OneETH, Number((newTime - currentTime)/3600));
        var profitStake2 = await contractRP.calculator.call(2, OneETH, Number((newTime - currentTime)/3600));
        profitAll = Number(profitStake0) + Number(profitStake1) + Number(profitStake2);
        //console.log("amount8Days = " + amount8Days + "; profitAll =" + profitAll)
        assert.equal(Number(profitAll - OneETH), amount8Days);

        var newTime = 1525651200; //Fri, 07 May 2018 00:00:00 GMT
        var amount32Days = await contractRP.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});
        profitStake0 = await contractRP.calculator.call(0, OneETH, Number((newTime - currentTime)/3600));
        profitStake1 = await contractRP.calculator.call(1, OneETH, Number((newTime - currentTime)/3600));
        profitStake2 = await contractRP.calculator.call(2, OneETH, Number((newTime - currentTime)/3600));
        profitAll = Number(profitStake0) + Number(profitStake1) + Number(profitStake2);
        //console.log("amount32Days = " + amount32Days + "; profitAll =" + profitAll)
        assert.equal(Number(profitAll - 47), amount32Days);
    });

        it('verification of ETH withdraw', async ()  => {
            var balanceEthContract = await contractRP.getBalanceEthContract.call();
            //console.log("balanceEthContract = " + balanceEthContract);
            assert.equal(OneETH*6, balanceEthContract);
            var countTransferIns = await contractRP.getCountTransferInsEth(accounts[4]);
            assert.equal(3, countTransferIns);
            for (var j = 0; j < countTransferIns; j++) {
                var transferInsETH = await contractRP.getETHTransferInsByAddress(accounts[4], j);
                //console.log("transferInsETH[" + j + "]=" + JSON.stringify(transferInsETH));
            }

            balanceAccountBefore = await contractRP.balanceOfETH(accounts[4]);
            //console.log("balanceAccountBefore = " + balanceAccountBefore);

            var amount = await contractRP.validWithdrawETH.call(accounts[4], 1525651200, {from:accounts[4]});
            //console.log("amount = " + amount);
            var amount2 = await contractRP.withdrawETH.call(accounts[4], {from:accounts[4]});
            //console.log("amount2 = " + amount2);
            assert.equal(Number(amount), Number(amount2));
            await contractRP.withdrawETH(accounts[4], {from:accounts[4]});

            balanceEthContract = await contractRP.getBalanceEthContract.call();
            //console.log("balanceEthContract = " + balanceEthContract);
            assert.equal(Number(OneETH*6 - amount), balanceEthContract);
        });

});
