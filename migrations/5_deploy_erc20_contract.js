const ERC20Token = artifacts.require('./ERC20Token.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm

    deployer.deploy(ERC20Token);

};
