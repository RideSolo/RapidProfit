const ContractStakeEth = artifacts.require('./ContractStakeEth.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";

    deployer.deploy(ContractStakeEth, owner);

};
