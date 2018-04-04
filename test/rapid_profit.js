var RapidProfit = artifacts.require("./RapidProfit.sol");

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

    it('verification of ETH deposition', async ()  => {
        var OneETH = 1*10**18;
        //deposit(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time)
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contract.balanceOfETH(accounts[1]);
        await contract.depositETH(accounts[1], OneETH, 0, currentTime, {from:accounts[0]});
        balanceAccountOneAfter = await contract.balanceOfETH(accounts[1]);
        //console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        assert.equal(0, balanceAccountOneBefore);
        assert.equal(OneETH, balanceAccountOneAfter);
    });

    it('verification of Token deposition', async ()  => {
        var OneToken = 1*10**18;
        //deposit(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time)
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contract.balanceOfToken(accounts[1]);
        await contract.depositToken(accounts[1], OneToken, 0, currentTime, {from:accounts[0]});
        balanceAccountOneAfter = await contract.balanceOfToken(accounts[1]);
        //console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        assert.equal(0, balanceAccountOneBefore);
        assert.equal(OneToken, balanceAccountOneAfter);
    });

    it('verification of ETH validWithdraw', async ()  => {
        var OneETH = 1*10**18;
        var currentTime = 1522800000; // Wed, 04 Apr 2018 00:00:00 GMT
        balanceAccountOneBefore = await contract.balanceOfETH(accounts[1]);
        await contract.depositETH(accounts[1], OneETH, 1, currentTime, {from:accounts[0]});
        balanceAccountOneAfter = await contract.balanceOfETH(accounts[1]);
        var newTime = 1522972800; //Fri, 06 Apr 2018 00:00:00 GMT
        //validWithdrawETH(address _address, uint256 _now)
        var amount = await contract.validWithdrawETH.call(accounts[1], newTime, {from:accounts[1]});
        console.log("amount=" + amount);

        var countStakes = await contract.getCountStakes();
        console.log("countStakes=" + countStakes);

        var stakeETH = await contract.getETHStakeByIndex(2);
        console.log("stakeETH=" + JSON.stringify(stakeETH));

        var countTransferIns = await contract.getCountTransferIns(accounts[1]);
        console.log("countTransferIns=" + countTransferIns);
        var transferInsETH = await contract.getETHTransferInsByAddress(accounts[1], 1);
        console.log("transferInsETH=" + JSON.stringify(transferInsETH));

//console.log("balanceAccountOneBefore=" + balanceAccountOneBefore);
        //console.log("balanceAccountOneAfter=" + balanceAccountOneAfter);
        //assert.equal(0, balanceAccountOneBefore);
        //assert.equal(OneETH, balanceAccountOneAfter);
    });


});



