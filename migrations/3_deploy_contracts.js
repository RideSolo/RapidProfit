const RapidProfit = artifacts.require('./RapidProfit.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";

    deployer.deploy(RapidProfit, owner);

};

/**
 * The order of installation of smart contracts:
 * 1. We deploy the contract ERC20Token and remember the address of the deployed contract.
 * 2. We deploy the contract StakeToken and remember the address of the deployed contract.
 * 3. Deploy a RapidProfit contract.
 * 4. In the RapidProfit contract, we call the function setContractStakeToken (). Set the address of the StakeToken contract.
 * 5. In the RapidProfit contract, we call the function setContractErc20Token (). Set the address of the contract ERC20Token.
 * 6. In the StakeToken contract, we call the function setContractUser (). Set the address of the RapidProfit contract.
 * 7. We copy the contents of the directory https://github.com/vpomo/RapidProfit/tree/master/web to the hosting
 * 8. In the metaScript.js file, configure the variables:
 *  addressContractRapidProfit, abiContractRapidProfit,
 *  addressContractStakeToken, abiContractStakeToken,
 *  addressContractTokenErc20, abiContractTokenErc20
 * In the decimalToken variable, set the number of decimal places.
 * In the variable maxRecordAllPlans we set the number of the last records at the output of Dashboard -> AllPlans
 */