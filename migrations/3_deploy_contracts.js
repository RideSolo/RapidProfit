const RapidProfit = artifacts.require('./RapidProfit.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";

    deployer.deploy(RapidProfit, owner);

};

// ContractStakeToken
//  https://ropsten.etherscan.io/address/0x30847ced91523a7dfc54a91800e1a0761b4a3769

// !!! Rapid Profit
// https://ropsten.etherscan.io/address/0x9ff21f276b1659dffc439baf75a52920503d0a1#code

// await contractRP.setContractStakeToken(contractToken.address);
// await contractRP.setContractErc20Token(contractErc20.address);
// await contractToken.setContractUser(contractRP.address, true);


// 0xC6209690b79DDB25d12EE7eD659B705eB6607879
// 0xA06A5f58D9cD4292Bcba99996aCD3f56d9C0BB66

//https://etherscan.io/address/0xbec8f6d667594fb181c9d68e5c80c910888be93d#code