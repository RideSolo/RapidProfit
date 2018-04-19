var sizePackage = 40;
var walletTokens = 0;
var fromCsv;
var current_progress = 0;
var numberTimes;
var remain;
var realNumberTimes;
var step = 0;
var sentTokens = 0;
var lastAddress;
var decimalToken = 10**3;

var contractRapidProfit;
var addressContractRapidProfit = "0x758ccd5fcfecd8052ad0eaadae5ae9c01ac843b9";
var abiContractRapidProfit = [{"constant":true,"inputs":[],"name":"contractErc20Token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressContract","type":"address"}],"name":"setContractStakeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBalanceEthContract","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_currentStake","type":"uint8"},{"name":"_amount","type":"uint256"},{"name":"_amountHours","type":"uint256"}],"name":"calculatorToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"cancelToken","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBalanceTokenContract","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressContract","type":"address"}],"name":"setContractStakeEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"balanceTokenContract","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"}],"name":"depositETH","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalEthWithdrawByAddress","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalTokenDepositByAddress","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOfETH","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalEthDepositByAddress","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getTokenStakeByIndex","outputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractStakeToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_now","type":"uint256"}],"name":"validWithdrawETH","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"withdrawETH","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_index","type":"uint256"}],"name":"getETHTransferInsByAddress","outputs":[{"name":"_indexStake","type":"uint256"},{"name":"_isRipe","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_now","type":"uint256"}],"name":"validWithdrawToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getETHStakeByIndex","outputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerTwo","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getCountTransferInsToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"withdrawToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addressContract","type":"address"}],"name":"setContractErc20Token","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_index","type":"uint256"}],"name":"getTokenTransferInsByAddress","outputs":[{"name":"_indexStake","type":"uint256"},{"name":"_isRipe","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdrawOwnerToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCountStakesToken","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdrawOwnerEth","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_numberRate","type":"uint8"},{"name":"_percent","type":"uint256"}],"name":"changeRatesEth","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOfToken","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_currentStake","type":"uint8"},{"name":"_amount","type":"uint256"},{"name":"_amountHours","type":"uint256"}],"name":"calculator","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"cancelETH","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCountStakesEth","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractStakeEth","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getCountTransferInsEth","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_numberRate","type":"uint8"},{"name":"_percent","type":"uint256"}],"name":"changeRatesToken","outputs":[{"name":"result","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalTokenWithdrawByAddress","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"removeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawEther","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}];

var contractStakeEth;
var addressContractStakeEth = "0xd9c4ac82a2f6069ef9808ae45fb696ffb0cdf234";
var abiContractStakeEth = [{"constant":true,"inputs":[],"name":"getBalanceEthContract","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalDepositEthAll","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_numberRate","type":"uint8"},{"name":"_percent","type":"uint256"}],"name":"changeRates","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalEthWithdrawByAddress","outputs":[{"name":"_amountEth","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOfETH","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"},{"name":"_address","type":"address"}],"name":"cancel","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getTotalEthDepositByAddress","outputs":[{"name":"_amountEth","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_now","type":"uint256"}],"name":"validWithdrawETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"withdrawETH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_index","type":"uint256"}],"name":"getETHTransferInsByAddress","outputs":[{"name":"_indexStake","type":"uint256"},{"name":"_isRipe","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getETHStakeByIndex","outputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_isUser","type":"bool"}],"name":"setContractUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_investor","type":"address"},{"name":"_stakeType","type":"uint8"},{"name":"_time","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"depositETH","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"contractUsers","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_currentStake","type":"uint8"},{"name":"_amount","type":"uint256"},{"name":"_amountHours","type":"uint256"}],"name":"calculator","outputs":[{"name":"stakeAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountStakesEth","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getCountTransferInsEth","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalWithdrawEthAll","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"rates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"removeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"}];

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
    contract.balanceOf(contractRapidProfit, function (error, data) {
        walletTokens = Number(data) / decimalToken;
	    console.log("balance = " + data);
        $('#walletTokens').html(walletTokens.toFixed(4));
    });
//document.getElementById('numberTokens').value = Number(data)/10**18;
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
    var test;
    var data;

});

function batchTransfer() {
    var contract = initContract();

    if (walletTokens == 0 && walletTokens < sentTokens) {
        $('#errorInfo').html("Not enough tokens to perform an operation!");
        $('#divErrorInfo').show();
    } else {
        $('#errorInfo').html("");
        $('#divDappInfo').hide();
        //console.log("numberTimes = " + numberTimes);
        //console.log("remain = " + remain);
        //console.log("realNumberTimes = " + realNumberTimes);

        if (step == numberTimes) {
            step++;
        }
        if (step < numberTimes) {
            console.log("step*sizePackage=" + step * sizePackage + " sizePackage" + sizePackage);
            //convertCsvToAddress(step * sizePackage, sizePackage);
            //convertCsvToValue(step * sizePackage, sizePackage);
             contract.batchTransfer(convertCsvToAddress(step*sizePackage, sizePackage),convertCsvToValue(step*sizePackage, sizePackage), function(error, data) {
                console.log("data = " + data);
             });
            current_progress = ((step + 1) * sizePackage / fromCsv.length) * 100;
            setProgressCount(current_progress);

            step++;
        }

        if (realNumberTimes > numberTimes && step == numberTimes + 1) {
            console.log("numberTimes*sizePackage=" + numberTimes * sizePackage + " remain" + remain);
            //convertCsvToAddress(numberTimes * sizePackage, remain);
            //convertCsvToValue(numberTimes * sizePackage, remain);
             contract.batchTransfer(convertCsvToAddress(numberTimes*sizePackage, remain),convertCsvToValue(numberTimes*sizePackage, remain), function(error, data) {
                console.log("data = " + data);
             });
            current_progress = 100;
            setProgressCount(current_progress);

        }

    }
}

function setProgressCount(countProgress) {
    $("#test").html("<h1> " + countProgress.toFixed(2) + "%</h1>");
    $("#dynamic")
        .css("width", countProgress + "%")
        .attr("aria-valuenow", countProgress)
        .text(countProgress + "% Complete");
    if (countProgress > 99.999) {
        $("#dynamic").removeClass("active");
        $("#dynamic").html("Done");
    }
}

function getAmountTokens() {
    var result = 0;
    for (var i = 0; i < fromCsv.length; i++) {
        result = result + Number(fromCsv[i].value);
    }
    return result;
}

function roundLessToPackage(num) {
    return Math.floor(num / sizePackage) * sizePackage;
}

function convertCsvToAddress(position, numberAdresses) {
    console.log("transfering adresses:");
    var arrayAdresses = [];
    for (var i = position; i < position + numberAdresses; i++) {
        arrayAdresses.push(fromCsv[i].address.toString());
        console.log("i=" + i + " address=" + fromCsv[i].address.toString() + "\n");
    }
    $('#lastAddress').html(fromCsv[i-1].address);
    return arrayAdresses
}

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate - date < millis);
}

function convertCsvToValue(position, numberValues) {
    console.log("transfering values:");
    var arrayValues = [];
    for (var i = position; i < position + numberValues; i++) {
        arrayValues.push(Number(fromCsv[i].value));
        console.log("i=" + i + " value=" + Number(fromCsv[i].value) + "\n");
    }
    return arrayValues;
}

function initContract() {
    var address = {
        "1": adrressContractBT // Ropsten
    }
    var current_network = web3.version.network;
    var myWalletAddress = web3.eth.accounts[0];
    if (myWalletAddress == undefined) {
        $('#errorInfo').html("Your wallet is closed!");
        $('#divErrorInfo').show();
    } else {
        $('#errorInfo').html("");
        $('#divErrorInfo').hide();
    }

    contractStakeEth = web3.eth.contract(abiContractStakeEth).at(addressContractStakeEth);
    contractStakeToken = web3.eth.contract(abiContractStakeToken).at(addressContractStakeToken);
    contractRapidProfit = web3.eth.contract(abiContractRapidProfit).at(addressContractRapidProfit);
    contractTokenErc20 = web3.eth.contract(abiContractTokenErc20).at(addressContractTokenErc20);

    console.log("Contract's initialized successfully");
    console.log("current_network = " + current_network);
    console.log("myWalletAddress = " + myWalletAddress);

}

function resetting() {
    location.reload();
}

//https://getbootstrap.com/docs/4.0/components/popovers/