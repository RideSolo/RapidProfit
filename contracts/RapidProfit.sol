pragma solidity ^0.4.18;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    function max64(uint64 a, uint64 b) internal pure returns (uint64) {
        return a >= b ? a : b;
    }

    function min64(uint64 a, uint64 b) internal pure returns (uint64) {
        return a < b ? a : b;
    }

    function max256(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function min256(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;

    address public ownerTwo;

    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    function Ownable() public {
    }


    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == ownerTwo);
        _;
    }


    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param _newOwner The address to transfer ownership to.
     */
    function changeOwner(address _newOwner) onlyOwner public {
        require(_newOwner != address(0));
        OwnerChanged(owner, _newOwner);
        owner = _newOwner;
    }

}

interface IContractStakeEth {
    function depositETH(address _investor, uint8 _stakeType, uint256 _time, uint256 _value) external returns (bool);
    function validWithdrawETH(address _address, uint256 _now) public returns (uint256);
    function withdrawETH(address _address) public returns (uint256);
    function cancel(uint256 _index, address _address) public returns (bool _result);
    function changeRates(uint8 _numberRate, uint256 _percent) public returns (bool);


    function getBalanceEthContract() public view returns (uint256);
    function balanceOfETH(address _owner) external view returns (uint256 balance);
    function getETHStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint8 _stakeType,
        uint256 _time,
        uint8 _status
    );
    function getETHTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _indexStake,
        bool _isRipe
    );
    function getCountTransferInsEth(address _address) public view returns (uint256 _count);
    function getCountStakesEth() public view returns (uint256 _count);
    function getTotalEthDepositByAddress(address _owner) public view returns (uint256 _amountEth);
    function getTotalEthWithdrawByAddress(address _owner) public view returns (uint256 _amountEth);
    function setContractAdmin(address _admin, bool _isAdmin) public;

    function setContractUser(address _user, bool _isUser) public;
    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountHours) public view returns (uint256 stakeAmount);
}

interface IContractStakeToken {
    function depositToken(address _investor, uint8 _stakeType, uint256 _time, uint256 _value) external returns (bool);
    function validWithdrawToken(address _address, uint256 _now) public returns (uint256);
    function withdrawToken(address _address) public returns (uint256);
    function cancel(uint256 _index, address _address) public returns (bool _result);
    function changeRates(uint8 _numberRate, uint256 _percent) public returns (bool);


    function getBalanceTokenContract() public view returns (uint256);
    function balanceOfToken(address _owner) external view returns (uint256 balance);
    function getTokenStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint8 _stakeType,
        uint256 _time,
        uint8 _status
    );
    function getTokenTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _indexStake,
        bool _isRipe
    );
    function getCountTransferInsToken(address _address) public view returns (uint256 _count);
    function getCountStakesToken() public view returns (uint256 _count);
    function getTotalTokenDepositByAddress(address _owner) public view returns (uint256 _amountEth);
    function getTotalTokenWithdrawByAddress(address _owner) public view returns (uint256 _amountEth);
    function setContractAdmin(address _admin, bool _isAdmin) public;

    function setContractUser(address _user, bool _isUser) public;
    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountHours) public view returns (uint256 stakeAmount);
}

interface IERC20Token {
    function transfer(address _to, uint256 _value) returns (bool success);
    function balanceOf(address _owner) constant returns (uint256 balance);
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success);
    function test() public returns (address _address);
}

contract RapidProfit is Ownable {
    using SafeMath for uint256;
    IContractStakeEth public contractStakeEth;
    IContractStakeToken public contractStakeToken;
    IERC20Token public contractErc20Token;

    uint256 public balanceTokenContract;

    event WithdrawEther(address indexed receiver, uint256 amount);
    event WithdrawToken(address indexed receiver, uint256 amount);

    function RapidProfit(address _owner) public {
        require(_owner != address(0));
        owner = _owner;
        owner = msg.sender; // for test's
    }

    // fallback function can be used to buy tokens
    function() payable public {
    }

    function setContractStakeEth (address _addressContract) public onlyOwner {
        require(_addressContract != address(0));
        contractStakeEth = IContractStakeEth(_addressContract);
    }

    function setContractStakeToken (address _addressContract) public onlyOwner {
        require(_addressContract != address(0));
        contractStakeToken = IContractStakeToken(_addressContract);
    }

    function setContractErc20Token (address _addressContract) public onlyOwner {
        require(_addressContract != address(0));
        contractErc20Token = IERC20Token(_addressContract);
    }

    function depositETH(address _investor, uint8 _stakeType, uint256 _time) external payable returns (bool){
        require(_investor != address(0));
        require(msg.value > 0);
        bool result = contractStakeEth.depositETH(_investor, _stakeType, _time, msg.value);

        return result;
    }

    function depositToken(address _investor, uint8 _stakeType, uint256 _time, uint256 _value) external payable returns (bool){
        require(_investor != address(0));
        require(_value > 0);
        bool result = contractStakeToken.depositToken(_investor, _stakeType, _time, _value);
        balanceTokenContract = balanceTokenContract.add(_value);
        //contractErc20Token.

        return result;
    }

    function validWithdrawETH(address _address, uint256 _now) public returns (uint256 result){
        require(_address != address(0));
        require(_now > 0);
        result = contractStakeEth.validWithdrawETH(_address, _now);
    }

    function validWithdrawToken(address _address, uint256 _now) public returns (uint256 result){
        require(_address != address(0));
        require(_now > 0);
        result = contractStakeToken.validWithdrawToken(_address, _now);
    }

    function balanceOfETH(address _owner) public view returns (uint256 balance) {
        return contractStakeEth.balanceOfETH(_owner);
    }

    function balanceOfToken(address _owner) public view returns (uint256 balance) {
        return contractStakeToken.balanceOfToken(_owner);
    }

    function getCountStakesEth() public view returns (uint256 result) {
        result = contractStakeEth.getCountStakesEth();
    }

    function getCountStakesToken() public view returns (uint256 result) {
        result = contractStakeToken.getCountStakesToken();
    }

    function getCountTransferInsEth(address _address) public view returns (uint256 result) {
        result = contractStakeEth.getCountTransferInsEth(_address);
    }

    function getCountTransferInsToken(address _address) public view returns (uint256 result) {
        result = contractStakeToken.getCountTransferInsToken(_address);
    }

    function getETHStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint8 _stakeType,
        uint256 _time,
        uint8 _status
    ) {
        (_owner, _amount, _stakeType, _time, _status) = contractStakeEth.getETHStakeByIndex(_index);
    }

    function getTokenStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint8 _stakeType,
        uint256 _time,
        uint8 _status
    ) {
        (_owner, _amount, _stakeType, _time, _status) = contractStakeToken.getTokenStakeByIndex(_index);
    }

    function getETHTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _indexStake,
        bool _isRipe
    ) {
        (_indexStake, _isRipe) = contractStakeEth.getETHTransferInsByAddress(_address, _index);
    }

    function getTokenTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _indexStake,
        bool _isRipe
    ) {
        (_indexStake, _isRipe) = contractStakeToken.getTokenTransferInsByAddress(_address, _index);
    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }

    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountHours) public view returns (uint256 result){
        result = contractStakeEth.calculator(_currentStake, _amount, _amountHours);
    }

    function calculatorToken(uint8 _currentStake, uint256 _amount, uint256 _amountHours) public view returns (uint256 result){
        result = contractStakeToken.calculator(_currentStake, _amount, _amountHours);
    }

    function getBalanceEthContract() public view returns (uint256){
        return this.balance;
    }

    function getBalanceTokenContract() public view returns (uint256 result){
        return contractErc20Token.balanceOf(this);
    }

    function withdrawETH(address _address) public returns (uint256 result){
        uint256 amount = contractStakeEth.withdrawETH(_address);
        require(this.balance >= amount);
        _address.transfer(amount);
        result = amount;
    }

    function withdrawToken(address _address) public returns (uint256 result){
        uint256 amount = contractStakeToken.withdrawToken(_address);
        //require(balanceTokenContract >= amount);
        //bool success = contractErc20Token.transfer(_address, amount);
        //require(success);
        //balanceTokenContract = balanceTokenContract.sub(amount);
        WithdrawToken(_address, amount);
        result = amount;
    }

    function cancelETH(uint256 _index) public returns (bool result) {
        require(_index >= 0);
        require(msg.sender != address(0));
        result = contractStakeEth.cancel(_index, msg.sender);
    }

    function cancelToken(uint256 _index) public returns (bool result) {
        require(_index >= 0);
        require(msg.sender != address(0));
        result = contractStakeToken.cancel(_index, msg.sender);
    }

    function changeRatesEth(uint8 _numberRate, uint256 _percent) public onlyOwner returns (bool result) {
        result = contractStakeEth.changeRates(_numberRate, _percent);
    }

    function changeRatesToken(uint8 _numberRate, uint256 _percent) public onlyOwner returns (bool result) {
        result = contractStakeToken.changeRates(_numberRate, _percent);
    }

    function getTotalEthDepositByAddress(address _owner) public view returns (uint256 result) {
        result = contractStakeEth.getTotalEthDepositByAddress(_owner);
    }

    function getTotalTokenDepositByAddress(address _owner) public view returns (uint256 result) {
        result = contractStakeToken.getTotalTokenDepositByAddress(_owner);
    }

    function getTotalEthWithdrawByAddress(address _owner) public view returns (uint256 result) {
        result = contractStakeEth.getTotalEthWithdrawByAddress(_owner);
    }

    function getTotalTokenWithdrawByAddress(address _owner) public view returns (uint256 result) {
        result = contractStakeToken.getTotalTokenWithdrawByAddress(_owner);
    }

    function withdrawOwnerEth(uint256 _amount) public onlyOwner returns (bool) {
        require(this.balance >= _amount);
        owner.transfer(_amount);
        WithdrawEther(owner, _amount);
    }

    function withdrawOwnerToken(uint256 _amount) public onlyOwner returns (bool) {
        require(getBalanceTokenContract() >= _amount);
        //TODO
        //owner.transfer(_amount);
        WithdrawToken(owner, _amount);
    }

}

