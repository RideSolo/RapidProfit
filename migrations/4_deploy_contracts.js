const RapidProfit = artifacts.require('./RapidProfit.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";

    deployer.deploy(RapidProfit, owner);

};

// ContractStakeEth
// https://ropsten.etherscan.io/address/0xd9c4ac82a2f6069ef9808ae45fb696ffb0cdf234

// ContractStakeToken
//  https://ropsten.etherscan.io/address/0x30847ced91523a7dfc54a91800e1a0761b4a3769

// !!! Rapid Profit
// https://ropsten.etherscan.io/address/0x758ccd5fcfecd8052ad0eaadae5ae9c01ac843b9#code

// await contractRP.setContractStakeEth(contractEth.address);


// 0xC6209690b79DDB25d12EE7eD659B705eB6607879
// 0xA06A5f58D9cD4292Bcba99996aCD3f56d9C0BB66
