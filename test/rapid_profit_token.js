var RapidProfit = artifacts.require("./RapidProfit.sol");
var ContractStakeToken = artifacts.require('./ContractStakeToken.sol');
var ERC20Token = artifacts.require('./ERC20Token.sol');

var contractRP;
var contractToken;
var contractErc20;

contract('ContractStakeToken', (accounts) => {
    it('should deployed ContractStakeToken', async ()  => {
        assert.equal(undefined, contractToken);
        contractToken = await ContractStakeToken.deployed();
        assert.notEqual(undefined, contractToken);
    });

    it('get address ContractStakeToken', async ()  => {
        assert.notEqual(undefined, contractToken.address);
        contractOwner = await contractToken.owner.call();
        //console.log("contractOwner = " + contractOwner);
    });
});

contract('ERC20Token', (accounts) => {
    var OneToken = 1*10**18;
    it('should deployed ERC20Token', async ()  => {
        assert.equal(undefined, contractErc20);
        contractErc20 = await ERC20Token.deployed();
        assert.notEqual(undefined, contractErc20);
    });

    it('get address ERC20Token', async ()  => {
        assert.notEqual(undefined, contractErc20.address);
        var balanceOwner = await contractErc20.balanceOf.call(accounts[0]);
        //console.log("balanceOwner(ERC20Token) = " + balanceOwner);
        assert.equal(10000000000000000, balanceOwner);
    });
});


contract('RapidProfit', (accounts) => {
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";
    var TwoToken = 2*10**8;
    var OneToken = 1*10**8;


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


    it('check set ContractStakeToken & ContractErc20', async ()  => {
        await contractRP.setContractStakeToken(contractToken.address);
        await contractRP.setContractErc20Token(contractErc20.address);

        await contractToken.setContractUser(contractRP.address, true);
        //console.log("contractRP.address = " + contractRP.address);

        await contractErc20.transfer(contractRP.address, 50*OneToken, {from:accounts[0]});
        await contractErc20.transfer(accounts[1], 10*OneToken, {from:accounts[0]});
        await contractErc20.transfer(accounts[4], 10*OneToken, {from:accounts[0]});
        await contractErc20.approve(contractRP.address, 10*OneToken, {from:accounts[1]});
        await contractErc20.approve(contractRP.address, 10*OneToken, {from:accounts[4]});

    });

    it('verification of Token deposition', async ()  => {
        //deposit(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time)
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contractRP.balanceOfToken(accounts[1]);
        await contractRP.depositToken(accounts[1], 0, currentTime, OneToken, {from:accounts[0]});
        balanceAccountOneAfter = await contractRP.balanceOfToken(accounts[1]);
        //console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        assert.equal(0, balanceAccountOneBefore);
        assert.equal(OneToken, balanceAccountOneAfter);
    });

   it('verification of Token validWithdraw', async ()  => {
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contractRP.balanceOfToken(accounts[1]);
        await contractRP.depositToken(accounts[1], 1, currentTime, TwoToken, {from:accounts[0]});
        balanceAccountOneAfter = await contractRP.balanceOfToken(accounts[1]);
        var newTime = 1522972802; //Fri, 06 Apr 2018 00:00:00 GMT
        var amount = await contractRP.validWithdrawToken.call(accounts[1], newTime, {from:accounts[1]});

        await contractRP.validWithdrawToken(accounts[1], newTime, {from:accounts[1]});
        var profit = await contractRP.calculatorToken.call(0, OneToken, Number((newTime - currentTime)/3600));
        //console.log("amount=" + amount + "; profit=" + profit);
        assert.equal(Number(profit), Number(amount));

        var countStakes = await contractRP.getCountStakesToken();
        assert.equal(2, countStakes);
        //console.log("countStakes=" + countStakes);
        for (var i = 0; i < countStakes; i++) {
            var stakeToken = await contractRP.getTokenStakeByIndex(i);
            //console.log("stakeToken["+ i +"]=" + JSON.stringify(stakeToken));
        }

        var countTransferIns = await contractRP.getCountTransferInsToken(accounts[1]);
        assert.equal(2, countTransferIns);
        var transferInsToken_Two = await contractRP.getTokenTransferInsByAddress(accounts[1], 1);
        var transferInsToken_One = await contractRP.getTokenTransferInsByAddress(accounts[1], 0);
        assert.equal(true, transferInsToken_One[1]);
        assert.equal(false, transferInsToken_Two[1]);
        //console.log("transferInsToken(2).isRipe=" + transferInsToken_Two[1]);
        //console.log("countTransferIns=" + countTransferIns);
        for (var j = 0; j < countTransferIns; j++) {
            var transferInsToken = await contractRP.getTokenTransferInsByAddress(accounts[1], j);
            //console.log("transferInsToken[" + j + "]=" + JSON.stringify(transferInsToken));
        }

    });

    it('verification of Token calculate of profit', async ()  => {
        var profitStake1Days = await contractRP.calculatorToken.call(0, OneToken, 36);
        //console.log("profitStake1Days(36)=" + profitStake1Days);
        assert.equal(OneToken*1.01, profitStake1Days);

        var profitStake1Days = await contractRP.calculatorToken.call(0, OneToken, 49);
        //console.log("profitStake1Days(49)=" + profitStake1Days);
        assert.equal(Number(OneToken*1.01*1.01), profitStake1Days);

        var profitStake7Days = await contractRP.calculatorToken.call(1, OneToken, 150);
        //console.log("profitStake7Days(150)=" + profitStake7Days);
        assert.equal(OneToken, profitStake7Days);

        var profitStake7Days = await contractRP.calculatorToken.call(1, OneToken, 340);
        //console.log("profitStake7Days(340)=" + profitStake7Days);
        //assert.equal(Number(OneToken)*1.09*1.09, profitStake7Days);

        var profitStake30Days = await contractRP.calculatorToken.call(2, OneToken, 750);
        //console.log("profitStake30Days(750)=" + profitStake30Days);
        assert.equal(Number(OneToken*1.36), profitStake30Days);

        var profitStake30Days = await contractRP.calculatorToken.call(2, OneToken, 1470);
        //console.log("profitStake30Days(1470)=" + profitStake30Days);
        assert.equal(Number(OneToken*1.36*1.36), profitStake30Days);

        var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:02 GMT
        balanceAccountForBefore = await contractRP.balanceOfToken(accounts[4]);

        await contractRP.depositToken(accounts[4], 0, currentTime, OneToken, {from:accounts[0]});
        await contractRP.depositToken(accounts[4], 1, currentTime, OneToken, {from:accounts[0]});
        await contractRP.depositToken(accounts[4], 2, currentTime, OneToken, {from:accounts[0]});

        balanceAccountForAfter = await contractRP.balanceOfToken(accounts[4]);

        var newTime = 1522800022; //Fri, 04 Apr 2018 00:00:22 GMT
        var amount0Days = await contractRP.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
        assert.equal(0, amount0Days);

        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        var amount2Days = await contractRP.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
        //console.log("amount2Days = " + amount2Days)
        assert.equal(OneToken*1.01, amount2Days);

        var newTime = 1523491200; //Fri, 12 Apr 2018 00:00:00 GMT
        var amount8Days = await contractRP.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
        var profitStake0 = await contractRP.calculatorToken.call(0, OneToken, Number((newTime - currentTime)/3600));
        var profitStake1 = await contractRP.calculatorToken.call(1, OneToken, Number((newTime - currentTime)/3600));
        var profitStake2 = await contractRP.calculatorToken.call(2, OneToken, Number((newTime - currentTime)/3600));
        profitAll = Number(profitStake0) + Number(profitStake1) + Number(profitStake2);
        //console.log("amount8Days = " + amount8Days + "; profitAll =" + profitAll)
        assert.equal(Number(profitAll - OneToken), amount8Days);

        var newTime = 1525651200; //Fri, 07 May 2018 00:00:00 GMT
        var amount32Days = await contractRP.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
        profitStake0 = await contractRP.calculatorToken.call(0, OneToken, Number((newTime - currentTime)/3600));
        profitStake1 = await contractRP.calculatorToken.call(1, OneToken, Number((newTime - currentTime)/3600));
        profitStake2 = await contractRP.calculatorToken.call(2, OneToken, Number((newTime - currentTime)/3600));
        profitAll = Number(profitStake0) + Number(profitStake1) + Number(profitStake2);
        //console.log("amount32Days = " + amount32Days + "; profitAll =" + profitAll)
        assert.equal(Number(profitAll), amount32Days);
    });

        it('verification of Token withdraw', async ()  => {
            var balanceOwner = await contractErc20.balanceOf.call(accounts[0]);
            //console.log("balanceOwner(ERC20Token) = " + balanceOwner);

            var balanceRP = await contractErc20.balanceOf.call(contractRP.address);
            //console.log("balanceContractRP = " + balanceRP);
            var balanceTokenContract = await contractRP.getBalanceTokenContract.call();
            //console.log("balanceTokenContract = " + balanceTokenContract);

            //assert.equal(OneToken*6, balanceTokenContract);
            var countTransferIns = await contractRP.getCountTransferInsToken(accounts[4]);
            assert.equal(3, countTransferIns);
            for (var j = 0; j < countTransferIns; j++) {
                var transferInsToken = await contractRP.getTokenTransferInsByAddress(accounts[4], j);
                //console.log("transferInsToken[" + j + "]=" + JSON.stringify(transferInsToken));
            }

            balanceAccountBefore = await contractRP.balanceOfToken(accounts[4]);
            //console.log("balanceAccountBefore = " + balanceAccountBefore);
            assert.equal(OneToken*3, balanceAccountBefore);

            var amount = await contractRP.validWithdrawToken.call(accounts[4], 1525651200, {from:accounts[4]});
            //console.log("amount = " + amount);
            var amount2 = await contractRP.withdrawToken.call(accounts[4], {from:accounts[4]});
            //console.log("amount2 = " + amount2);
            assert.equal(Number(amount), Number(amount2));
            await contractRP.withdrawToken(accounts[4], {from:accounts[4]});

            //balanceTokenContract = await contractRP.getBalanceTokenContract.call();
            //console.log("balanceTokenContract = " + balanceTokenContract);
            //assert.equal(Number(OneToken*6 - amount), balanceTokenContract);
            balanceAccountAfter = await contractRP.balanceOfToken(accounts[4]);
            assert.equal(0, balanceAccountAfter);
            //console.log("balanceAccountAfter = " + balanceAccountAfter);
        });

        it('verification of Token cancel', async ()  => {
                var currentTime = 1522800002; // Wed, 04 Apr 2018 00:00:02 GMT
                balanceAccountForBefore = await contractRP.balanceOfToken(accounts[4]);
                //indexStake = await contractRP.depositToken.call(accounts[4], 2, currentTime, OneToken, {from:accounts[0]});
                //console.log("indexStake = " + indexStake);
                await contractRP.depositToken(accounts[4], 2, currentTime, OneToken, {from:accounts[0]});
                var countStakes = await contractRP.getCountStakesToken();
                assert.equal(6, countStakes);
                //console.log("countStakes=" + countStakes);
                for (var i = 0; i < countStakes; i++) {
                    var stakeToken = await contractRP.getTokenStakeByIndex(i);
                    //console.log("stakeToken["+ i +"]=" + JSON.stringify(stakeToken));
                }
                var newTime = 1523491200; //Fri, 12 Apr 2018 00:00:00 GMT
                var amountZero = await contractRP.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
                assert.equal(0, amountZero);
                //console.log("amount = " + amountZero);

                await contractRP.cancelToken(countStakes -1 , {from:accounts[4]});
                var amount = await contractRP.validWithdrawToken.call(accounts[4], newTime, {from:accounts[4]});
                //console.log("amount = " + amount);
                assert.equal(OneToken, amount);


        });


});
