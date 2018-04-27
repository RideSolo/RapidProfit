var walletTokens = 0;
var walletEth = 0;
var decimalToken = Number(10**18);

var contractRapidProfit;
var addressContractRapidProfit = "0x0bcb42defa1ebeeaa02359e866eeb4d8cb93ef45";
var abiContractRapidProfit = [{"constant":true,"inputs":[],"name":"contractErc20Token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressContract","type":"address"}],"name":"setContractStakeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBalanceEthContract","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"cancelToken","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBalanceTokenContract","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"balanceTokenContract","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalTokenDepositByAddress","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_stakeType","type":"uint8"},{"name":"_value","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTokenStakeByIndex","outputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractStakeToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_now","type":"uint256"}],"name":"validWithdrawToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getCountTransferInsToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"withdrawToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addressContract","type":"address"}],"name":"setContractErc20Token","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_index","type":"uint256"}],"name":"getTokenTransferInsByAddress","outputs":[{"name":"_indexStake","type":"uint256"},{"name":"_isRipe","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdrawOwnerToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCountStakesToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdrawOwnerEth","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOfToken","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_currentStake","type":"uint8"},{"name":"_amount","type":"uint256"},{"name":"_amountHours","type":"uint256"}],"name":"calculator","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_numberRate","type":"uint8"},{"name":"_percent","type":"uint256"}],"name":"changeRatesToken","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalTokenWithdrawByAddress","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"removeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawEther","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}];

var contractStakeToken;
var addressContractStakeToken = "0x30847ced91523a7dfc54a91800e1a0761b4a3769";
var abiContractStakeToken = [{"constant":true,"inputs":[],"name":"totalWithdrawTokenAll","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_numberRate","type":"uint8"},{"name":"_percent","type":"uint256"}],"name":"changeRates","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalTokenDepositByAddress","outputs":[{"name":"_amountToken","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"},{"name":"_address","type":"address"}],"name":"cancel","outputs":[{"name":"_result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTokenStakeByIndex","outputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdrawOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_now","type":"uint256"}],"name":"validWithdrawToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getCountTransferInsToken","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"withdrawToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_index","type":"uint256"}],"name":"getTokenTransferInsByAddress","outputs":[{"name":"_indexStake","type":"uint256"},{"name":"_isRipe","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_isUser","type":"bool"}],"name":"setContractUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCountStakesToken","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contractUsers","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOfToken","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_currentStake","type":"uint8"},{"name":"_amount","type":"uint256"},{"name":"_amountHours","type":"uint256"}],"name":"calculator","outputs":[{"name":"stakeAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalDepositTokenAll","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"rates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalTokenWithdrawByAddress","outputs":[{"name":"_amountToken","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"removeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}];

var contractTokenErc20;
var addressContractTokenErc20 = "0x556e0c6f38cceac9241b2ea507f424b8286d4040";
var abiContractTokenErc20 = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fundBountyAndTeam","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_investor","type":"address"}],"name":"getDeposited","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hardWeiCap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAllocated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"ownerBurnToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"fundForSale","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"startSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"transfersEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"deposited","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countInvestor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"claimTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stopSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"saleToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"}],"name":"buyTokens","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"weiMinSale","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_weiAmount","type":"uint256"}],"name":"validPurchaseTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"removeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenRaised","type":"uint256"},{"indexed":false,"name":"purchasedToken","type":"uint256"}],"name":"TokenLimitReached","type":"event"},{"anonymous":false,"inputs":[],"name":"HardCapReached","type":"event"},{"anonymous":false,"inputs":[],"name":"Finalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];


window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log("Web3 detected!");
        window.web3 = new Web3(web3.currentProvider);
        // Now you can start your app & access web3 freely:
        var currentNetwork = web3.version.network;
        if (currentNetwork == 3 || currentNetwork == 1) {
            $('#divDappInfo').removeClass("alert-danger");
            $('#divDappInfo').addClass("alert-success");
            $('#dappInfo').html("You are connected to the Blockchain of the Ethereum");
        } else {
            $('#divDappInfo').removeClass("alert-success");
            $('#divDappInfo').addClass("alert-danger");
            $('#dappInfo').html("You are not connected to the network of the Ethereum");
        }
        startApp();
    } else {
        $('#divDappInfo').removeClass("alert-success");
        $('#divDappInfo').addClass("alert-danger");
        $('#dappInfo').html("Please use Chrome or Firefox, install the Metamask extension and retry the request!");
    }
})

function startApp() {
    initContract();
    var myWalletAddress = web3.eth.accounts[0];
    var rateDayly = 0;
    var rateWeekly = 0;
    var rateMonthly = 0;

    contractTokenErc20.balanceOf(addressContractRapidProfit, function (error, data) {
        walletTokens = Number(data) / decimalToken;
        $('#totalStake').html(walletTokens.toFixed(4));
    });
    contractRapidProfit.getBalanceEthContract(function (error, data) {
        walletEth = Number(data) / decimalToken;
        $('#totalEth').html(walletEth.toFixed(4));
    });
    contractStakeToken.rates(0, function (error, data) {
        rateDayly = data - 100;
        $('#ratesDayly').html(rateDayly.toFixed(0));
        $('#ratesDailyButton').html(rateDayly.toFixed(0));
    });
    contractStakeToken.rates(1, function (error, data) {
        rateWeekly = data - 100;
        $('#ratesWeekly').html(rateWeekly.toFixed(0));
        $('#ratesWeeklyButton').html(rateWeekly.toFixed(0));
    });
    contractStakeToken.rates(2, function (error, data) {
        rateMonthly = data - 100;
        $('#ratesMonthly').html(rateMonthly.toFixed(0));
        $('#ratesMonthlyButton').html(rateMonthly.toFixed(0));
    });
    contractStakeToken.totalDepositTokenAll(function (error, data) {
        rateDayly = Number(data) / decimalToken;
        $('#totalDepositedStake').html(rateDayly.toFixed(4));
    });
    contractStakeToken.totalWithdrawTokenAll(function (error, data) {
        rateDayly = Number(data) / decimalToken;
        $('#totalWithdraweddStake').html(rateDayly.toFixed(4));
    });
    getAmountTokensErc20();
    readAllowance();
}

function getAmountTokensErc20() {
    var myWalletAddress = web3.eth.accounts[0];
    contractTokenErc20.balanceOf(myWalletAddress, function (error, data) {
        myAmountToken = Number(data) / decimalToken;
        $('#myStake').html(myAmountToken.toFixed(4));
        $('#balanceDailyAll').html(myAmountToken.toFixed(4));
        $('#balanceWeeklyAll').html(myAmountToken.toFixed(4));
        $('#balanceMonthlyAll').html(myAmountToken.toFixed(4));
        console.log("myWalletAddress=" + myWalletAddress + "; myAmountToken=" + myAmountToken);
    });
}

function makeTableMyPlans() {
    var walletAddress = web3.eth.accounts[0];
    var numberTransferIns = 0;
    var currTransferIns;
    var arrayStakes = [];
    var currentStake;
    var indexStake = 0;
    console.log("makeTableMyPlans ...");
    contractRapidProfit.getCountTransferInsToken(walletAddress, function (error, data) {
        numberTransferIns = data;
        arrayStakes = [];
        for (var j = 0; j < numberTransferIns; j++) {
            indexStake = numberTransferIns - 1 - j;
            contractRapidProfit.getTokenTransferInsByAddress(walletAddress, j, function (error, data) {
                currTransferIns = data;
                var currIndexStake = currTransferIns[0];
                contractRapidProfit.getTokenStakeByIndex(currTransferIns[0], function (error, data) {
                    currentStake = data;
                    arrayStakes.push({amount: currentStake[1]/decimalToken, stakeType: currentStake[2], time: currentStake[3],
                        status: currentStake[4], index: currIndexStake});
                    console.log("currIndexStake = " + currIndexStake);
                    if( indexStake == 0){
                        drawTableMyPlans(JSON.stringify(arrayStakes));
                    }
                });
            });
        }
    });
}

function makeTableAllPlans() {
    var walletAddress = web3.eth.accounts[0];
    var arrayStakes = [];
    var currentStake;
    var countStakes = 0;
    var indexStake = 0;
    console.log("makeTableAllPlans ...");
    contractRapidProfit.getCountStakesToken(function (error, data) {
        countStakes = data;
        for (var j = 0; j < countStakes; j++) {
            indexStake = countStakes - 1 - j;
            contractRapidProfit.getTokenStakeByIndex(indexStake, function (error, data) {
                currentStake = data;
                arrayStakes.push({address: currentStake[0], amount: currentStake[1]/decimalToken, stakeType: currentStake[2], time: currentStake[3], status: currentStake[4]});
                if(indexStake == 0){
                    drawTableAllPlans(JSON.stringify(arrayStakes));
                }
            });
        }
    });
}

function drawTableMyPlans(arrayStakesMyPlan) {
    var stakeType = ["DAYLY", "WEEKLY", "MONTHLY"];
    var status = ["ACTIVE", "COMPLETED", "CANCEL"];
    var strHtml = "";
    if(arrayStakesMyPlan != ""){
        var parseArrayStakes = JSON.parse(arrayStakesMyPlan);
        for(var j = 0; j < parseArrayStakes.length; j++){
            strHtml = strHtml + '<tr>' + '<td>'+ parseArrayStakes[j].amount + '</td>' + '<td>'+ stakeType[parseArrayStakes[j].stakeType] +
                '</td>' + '<td>'+ timeConverter(parseArrayStakes[j].time) + '</td>' + '<td>'+ status[parseArrayStakes[j].status] + '</td>' +
                '<td><button onclick="cancel('+ parseArrayStakes[j].index +')" type="button" class="btn btn-outline-primary btn-sm">Cancel</button></td>' + '</tr>';
        }
        $('#myPlansBody').html(strHtml);
    }
}

function drawTableAllPlans(arrayStakesAllPlan) {
    var stakeType = ["DAYLY", "WEEKLY", "MONTHLY"];
    var status = ["ACTIVE", "COMPLETED", "CANCEL"];
    var strHtml = "";
    if(arrayStakesAllPlan != ""){
        var parseArrayStakes = JSON.parse(arrayStakesAllPlan);
        for(var j = 0; j < parseArrayStakes.length; j++){
            strHtml = strHtml + '<tr>' + '<td style="width: 160px;">'+ parseArrayStakes[j].address + '</td>' + '<td>'+ parseArrayStakes[j].amount + '</td>' + '<td>'+ stakeType[parseArrayStakes[j].stakeType] + '</td>' + '<td>'+ timeConverter(parseArrayStakes[j].time) + '</td>' + '<td>'+ status[parseArrayStakes[j].status] + '</td>' + '</tr>';
        }
        $('#allPlansBody').html(strHtml);
    }
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function checkAddress() {
    var contract = initContract();
    var checkingAddress = $('#testAddress').val();
    console.log("checkingAddress = " + checkingAddress);
    contract.balanceOf(checkingAddress, function (error, data) {
        $('#balanceTokens').html(Number(data) / decimalToken);
    });
    contract.userTransfered(checkingAddress, function (error, data) {
        if(data == true){
            $('#isSent').html("Yes");
        } else $('#isSent').html("No");
    });
}

$(document).ready(function () {
    initContract();
});

function changeRate(type) {
    console.log("changeRate ...");
    var newRate = 0;
    if (type == 0) {
        newRate = $('#rateDaily').val();
    }
    if (type == 1) {
        newRate = $('#rateWeekly').val();
    }
    if (type == 2) {
        newRate = $('#rateMonthly').val();
    }
    console.log("new rate = " + newRate);
    //contractRapidProfit.changeRatesToken(type, newRate, function (error, data) {
    contractStakeToken.changeRates(type, newRate, function (error, data) {
            result = data;
            console.log("result = " + data);
    });
}

function readAllowance() {
    var walletAddress = web3.eth.accounts[0];
    contractTokenErc20.allowance(walletAddress, addressContractRapidProfit, function (error, data) {
        result = data / decimalToken;
        console.log("result = " + result);
        var amount = result.toFixed(4);
        $('#balanceDailyDeposit').html(amount);
        $('#balanceWeeklyDeposit').html(amount);
        $('#balanceMonthlyDeposit').html(amount);

        $('#dailyAllowance').val(amount);
        $('#depositDaily').val(amount);

        $('#weeklyAllowance').val(amount);
        $('#depositWeekly').val(amount);

        $('#monthlyAllowance').val(amount);
        $('#depositMonthly').val(amount);

    });
}

function aprove() {
    var amount = $('#aproveDaily').val() * decimalToken;
    contractTokenErc20.approve(addressContractRapidProfit, amount, function (error, data) {
        result = data / decimalToken;
        console.log("result = " + result);
    });
}

function depositTokenForUser(stake) {
    var walletAddress = web3.eth.accounts[0];
    //var currentTime = parseInt(new Date().getTime()/1000);
    var result;
    var amountTokens = 0;
    var nonDeposit = false;
    var amount = 0;
    if (stake == 0) {
        amountTokens = $('#depositDaily').val();
        if ($('#dailyAllowance').val() < amountTokens) {
            nonDeposit = true;
            $('#divErrorInfoDaily').show();
        }
    }
    if (stake == 1) {
        amountTokens = $('#depositWeekly').val();
        if ($('#weeklyAllowance').val() < amountTokens) {
            console.log("$('#weeklyAllowance').val()" + $('#weeklyAllowance').val());
            nonDeposit = true;
            $('#divErrorInfoWeekly').show();
        }
    }
    if (stake == 2) {
        amountTokens = $('#depositMonthly').val();
        if ($('#monthlyAllowance').val() < amountTokens) {
            nonDeposit = true;
            $('#divErrorInfoMonthly').show();
        }
    }
    amount = amountTokens * decimalToken;
    console.log("amount = " + amount);
    if (!nonDeposit) {
        $('#divErrorInfoDaily').hide();
        $('#divErrorInfoWeekly').hide();
        $('#divErrorInfoMonthly').hide();
        contractRapidProfit.depositToken(walletAddress, stake, amount, function (error, data) {
            result = data;
            console.log("walletAddress = " + walletAddress + "amount = " + amount);
            console.log("currentTime = " + currentTime);
            console.log("result = " + data);
        });
    }
}

function depositTokenForOwner() {
    console.log("depositTokenForOwner ...");
    var amountTokens = $('#ownerAddTokens').val();
    var amount = Number(amountTokens * decimalToken);
    contractTokenErc20.transfer(addressContractRapidProfit, amount, function (error, data) {
        result = data;
        console.log("result = " + data);
    });
}

function withdrawTokenForOwner() {
    console.log("withdrawTokenForOwner ...");
    var amountTokens = $('#ownerWithdrawTokens').val();
    var amount = Number(amountTokens * decimalToken);
    contractRapidProfit.withdrawOwnerToken(amount, function (error, data) {
        result = data;
        console.log("result = " + data);
    });
}

function withdrawTokenForUser() {
    console.log("withdrawTokenForUser ...");
    var walletAddress = web3.eth.accounts[0];
    contractRapidProfit.withdrawToken(walletAddress, function (error, data) {
        result = data;
        console.log("result = " + data);
    });
}

function transferOwner() {
    var newOwner = $('#newOwner').val();
    console.log("Change owner to: " + newOwner);
    contractRapidProfit.changeOwner(newOwner, function (error, data) {
        result = data;
        console.log("result = " + data);
    });
}

function calculator() {
    console.log("calculate ...");
    var currentStake = $('input[name=radio]:checked').val();
    var amount = $('#amount').val();
    var days = $('#days').val();

    contractRapidProfit.calculator(currentStake, amount * decimalToken, days*24, function (error, data) {
        result = data / decimalToken;
        console.log("result = " + result.toFixed(4));
        $('#result').html(result.toFixed(4));
    });
}

function cancel(indexStake) {
    console.log("Cancel styke ...");
    contractRapidProfit.cancelToken(indexStake, function (error, data) {
        result = data;
        console.log("result = " + result);
    });

}

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate - date < millis);
}

function initContract() {
    var current_network = web3.version.network;
    var myWalletAddress = web3.eth.accounts[0];
    if (myWalletAddress == undefined) {
        $('#errorInfo').html("Your wallet is closed!");
        $('#divErrorInfo').show();
    } else {
        $('#errorInfo').html("");
        $('#divErrorInfo').hide();
    }

    $('#divErrorInfoDaily').hide();
    $('#divErrorInfoWeekly').hide();
    $('#divErrorInfoMonthly').hide();

    contractStakeToken = web3.eth.contract(abiContractStakeToken).at(addressContractStakeToken);
    contractRapidProfit = web3.eth.contract(abiContractRapidProfit).at(addressContractRapidProfit);
    contractTokenErc20 = web3.eth.contract(abiContractTokenErc20).at(addressContractTokenErc20);

    console.log("Contract's initialized successfully");
    console.log("current_network = " + current_network);
    console.log("myWalletAddress = " + myWalletAddress);
    contractRapidProfit.owner(function (error, data) {
        result = data;
        console.log("owner = " + result);
        if (result == myWalletAddress) {
            $('#adminPanel').show();
        } else {
            $('#adminPanel').hide();
        }
    });

    makeTableMyPlans();
    makeTableAllPlans();
    getAmountTokensErc20();
    readAllowance();
}

function resetting() {
    location.reload();
}
