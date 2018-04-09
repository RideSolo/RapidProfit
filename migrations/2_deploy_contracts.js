//const RapidProfit = artifacts.require('./RapidProfit.sol');
const ContractStakeEth = artifacts.require('./ContractStakeEth.sol');
//const ContractStakeToken = artifacts.require('./ContractStakeToken.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";

    deployer.deploy(ContractStakeEth, owner, {gas: 4700000});
    //deployer.deploy(ContractStakeToken, owner);
    //deployer.deploy(RapidProfit, owner);

};
