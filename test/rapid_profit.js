var RapidProfit = artifacts.require("./RapidProfit.sol");

contract('RapidProfit', (accounts) => {
    var contract;
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";
    var TwoETH = 2*10**18;
    var OneETH = 1*10**18;


    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await RapidProfit.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

/*
    it('verification of ETH deposition', async ()  => {
        //deposit(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time)
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contract.balanceOfETH(accounts[1]);
        await contract.depositETH(accounts[1], 0, currentTime, {value:OneETH, from:accounts[0]});
        balanceAccountOneAfter = await contract.balanceOfETH(accounts[1]);
        //console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        assert.equal(0, balanceAccountOneBefore);
        assert.equal(OneETH, balanceAccountOneAfter);
    });

    it('verification of Token deposition', async ()  => {
        //deposit(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time)
        var currentTime = 1522800001; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contract.balanceOfToken(accounts[1]);
        await contract.depositToken(accounts[1], OneETH, 0, currentTime, {from:accounts[0]});
        balanceAccountOneAfter = await contract.balanceOfToken(accounts[1]);
        //console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        assert.equal(0, balanceAccountOneBefore);
        assert.equal(OneETH, balanceAccountOneAfter);
    });

    it('verification of ETH validWithdraw', async ()  => {
        var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contract.balanceOfETH(accounts[1]);
        //await contract.depositETH(accounts[1], TwoETH, 1, currentTime, {from:accounts[0]});
        await contract.depositETH(accounts[1], 1, currentTime, {value:TwoETH, from:accounts[0]});
        balanceAccountOneAfter = await contract.balanceOfETH(accounts[1]);
        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        //validWithdrawETH(address _address, uint256 _now)
        var amount = await contract.validWithdrawETH.call(accounts[1], newTime, {from:accounts[1]});
        await contract.validWithdrawETH(accounts[1], newTime, {from:accounts[1]});
        //console.log("amount=" + amount);
        assert.equal(OneETH*1.01, amount);

        var countStakes = await contract.getCountStakesEth();
        assert.equal(2, countStakes);
        //console.log("countStakes=" + countStakes);
        for (var i = 0; i < countStakes; i++) {
            var stakeETH = await contract.getETHStakeByIndex(i);
            //console.log("stakeETH["+ i +"]=" + JSON.stringify(stakeETH));
        }

        var countTransferIns = await contract.getCountTransferInsEth(accounts[1]);
        assert.equal(2, countTransferIns);
        var transferInsETH_Two = await contract.getETHTransferInsByAddress(accounts[1], 1);
        var transferInsETH_One = await contract.getETHTransferInsByAddress(accounts[1], 0);
        assert.equal(true, transferInsETH_One[1]);
        assert.equal(false, transferInsETH_Two[1]);
        //console.log("transferInsETH(2).isRipe=" + transferInsETH_Two[1]);
        //console.log("countTransferIns=" + countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsETH = await contract.getETHTransferInsByAddress(accounts[1], j);
            //console.log("transferInsETH[" + j + "]=" + JSON.stringify(transferInsETH));
        }
    });


it('verification of Token validWithdraw', async ()  => {
    var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:00 GMT
    balanceAccountOneBefore = await contract.balanceOfToken(accounts[1]);
    await contract.depositToken(accounts[1], TwoETH, 1, currentTime, {from:accounts[0]});
    balanceAccountOneAfter = await contract.balanceOfToken(accounts[1]);
    var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
    var amount = await contract.validWithdrawToken.call(accounts[1], newTime, {from:accounts[1]});
    await contract.validWithdrawToken(accounts[1], newTime, {from:accounts[1]});
    //console.log("amount=" + amount);
    assert.equal(OneETH*1.01, amount);

    var countStakes = await contract.getCountStakesToken();
    assert.equal(2, countStakes);
    //console.log("countStakes=" + countStakes);
    for (var i = 0; i < countStakes; i++) {
        var stakeToken = await contract.getTokenStakeByIndex(i);
        //console.log("stakeToken["+ i +"]=" + JSON.stringify(stakeToken));
    }

    var countTransferIns = await contract.getCountTransferInsToken(accounts[1]);
    assert.equal(2, countTransferIns);
    var transferInsToken_Two = await contract.getTokenTransferInsByAddress(accounts[1], 1);
    var transferInsToken_One = await contract.getTokenTransferInsByAddress(accounts[1], 0);
    assert.equal(true, transferInsToken_One[1]);
    assert.equal(false, transferInsToken_Two[1]);
    //console.log("transferInsToken(2).isRipe=" + transferInsToken_Two[1]);
    //console.log("countTransferIns=" + countTransferIns);
    for (var j = 0; j < countTransferIns; j++) {
        var transferInsToken = await contract.getTokenTransferInsByAddress(accounts[1], j);
        //console.log("transferInsToken[" + j + "]=" + JSON.stringify(transferInsToken));
    }
});


    it('verification of ETH calculate of profit', async ()  => {
        var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:02 GMT
        balanceAccountForBefore = await contract.balanceOfETH(accounts[4]);
        //await contract.depositETH(accounts[4], OneETH, 0, currentTime, {from:accounts[0]});
        //await contract.depositETH(accounts[4], OneETH, 1, currentTime, {from:accounts[0]});
        //await contract.depositETH(accounts[4], OneETH, 2, currentTime, {from:accounts[0]});

        await contract.depositETH(accounts[4], 0, currentTime, {value:OneETH, from:accounts[0]});
        await contract.depositETH(accounts[4], 1, currentTime, {value:OneETH, from:accounts[0]});
        await contract.depositETH(accounts[4], 2, currentTime, {value:OneETH, from:accounts[0]});

        balanceAccountForAfter = await contract.balanceOfETH(accounts[4]);

        var newTime = 1522800022; //Fri, 04 Apr 2018 00:00:22 GMT
        var amount0Days = await contract.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});

        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        var amount2Days = await contract.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});

        var newTime = 1523491200; //Fri, 12 Apr 2018 00:00:00 GMT
        var amount8Days = await contract.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});
        //console.log("amount8Days = " + amount8Days)

        var newTime = 1525651200; //Fri, 07 May 2018 00:00:00 GMT
        var amount32Days = await contract.validWithdrawETH.call(accounts[4], newTime, {from:accounts[4]});

        assert.equal(0, amount0Days);
        assert.equal(OneETH*1.01, amount2Days);
        assert.equal(Number(OneETH*1.01 + OneETH*1.09), amount8Days);
        assert.equal(Number(OneETH*1.01 + OneETH*1.09 + OneETH*1.36), amount32Days);
    });

    it('verification of Token calculate of profit', async ()  => {
        var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:02 GMT
        balanceAccountForBefore = await contract.balanceOfToken(accounts[4]);
        await contract.depositToken(accounts[4], OneETH, 0, currentTime, {from:accounts[0]});
        await contract.depositToken(accounts[4], OneETH, 1, currentTime, {from:accounts[0]});
        await contract.depositToken(accounts[4], OneETH, 2, currentTime, {from:accounts[0]});


        balanceAccountForAfter = await contract.balanceOfToken(accounts[4]);

        var newTime = 1522800022; //Fri, 04 Apr 2018 00:00:22 GMT
        var amount0Days = await contract.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});

        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        var amount2Days = await contract.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});

        var newTime = 1523491200; //Fri, 12 Apr 2018 00:00:00 GMT
        var amount8Days = await contract.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
        //console.log("amount8Days = " + amount8Days)

        var newTime = 1525651200; //Fri, 07 May 2018 00:00:00 GMT
        var amount32Days = await contract.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});

        assert.equal(0, amount0Days);
        assert.equal(OneETH*1.01, amount2Days);
        assert.equal(Number(OneETH*1.01 + OneETH*1.09), amount8Days);
        assert.equal(Number(OneETH*1.01 + OneETH*1.09 + OneETH*1.36), amount32Days);
    });

    it('verification of ETH withdraw', async ()  => {
        var balanceEthContract = await contract.getBalanceEthContract.call();
        assert.equal(OneETH*6, balanceEthContract);
        var countTransferIns = await contract.getCountTransferInsEth(accounts[4]);
        assert.equal(3, countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsETH = await contract.getETHTransferInsByAddress(accounts[4], j);
            //console.log("transferInsETH[" + j + "]=" + JSON.stringify(transferInsETH));
        }
        await contract.withdrawETH({from:accounts[4]});
        var countTransferIns = await contract.getCountTransferInsEth(accounts[4]);
        //assert.equal(3, countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsETH = await contract.getETHTransferInsByAddress(accounts[4], j);
            //console.log("transferInsETH[" + j + "]=" + JSON.stringify(transferInsETH));
        }
        balanceEthContract = await contract.getBalanceEthContract.call();
        //assert.equal(Number(OneETH*6 - OneETH*1.01), balanceEthContract);
    });

    it('verification of Token withdraw', async ()  => {
        var balanceTokenContract = await contract.getBalanceTokenContract.call();
        assert.equal(OneETH*6, balanceTokenContract);
        var countTransferIns = await contract.getCountTransferInsToken(accounts[4]);
        assert.equal(3, countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsToken = await contract.getTokenTransferInsByAddress(accounts[4], j);
            //console.log("transferInsETH[" + j + "]=" + JSON.stringify(transferInsETH));
        }
        await contract.withdrawToken({from:accounts[4]});
        var countTransferIns = await contract.getCountTransferInsToken(accounts[4]);
        //assert.equal(3, countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsToken = await contract.getTokenTransferInsByAddress(accounts[4], j);
            //console.log("transferInsToken[" + j + "]=" + JSON.stringify(transferInsToken));
        }
        balanceTokenContract = await contract.getBalanceTokenContract.call();
        //assert.equal(Number(OneETH*6 - OneETH*1.01), balanceEthContract);
    });
*/

});



