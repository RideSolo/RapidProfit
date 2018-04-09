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

interface ContractStakeEth {

    function depositETH(address _investor, uint _stakeType, uint256 _time) public payable returns (bool);
    function validWithdrawETH(address _address, uint256 _now) public returns (uint256);
    function withdrawETH() public returns (bool);
    function cancel(uint256 _index) public returns (bool _result);
    function changeRates(uint8 _numberRate, uint256 _percent) public returns (bool);

    function getBalanceEthContract() public view returns (uint256);
    function balanceOfETH(address _owner) public view returns (uint256 balance);
    function getETHStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint _stakeType,
        uint256 _time,
        uint _status
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

    event Withdraw(address indexed receiver, uint256 amount);

}

interface ContractStakeToken {

    function depositToken(address _investor, uint256 _amount, uint _stakeType, uint256 _time) public payable returns (bool);
    function validWithdrawToken(address _address, uint256 _now) public returns (uint256);
    function withdrawToken() public returns (bool);
    function cancel(uint256 _index) public returns (bool _result);
    function changeRates(uint8 _numberRate, uint256 _percent) public returns (bool);

    function getBalanceTokenContract() public view returns (uint256);
    function balanceOfToken(address _owner) public view returns (uint256 balance);
    function getTokenStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint _stakeType,
        uint256 _time,
        uint _status
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

    event Withdraw(address indexed receiver, uint256 amount);

    }


contract RapidProfit is Ownable {
    using SafeMath for uint256;
    ContractStakeEth public contractStakeEth;
    ContractStakeToken public contractStakeToken;

    enum State {Active, Closed}
    State public state;
    uint256[] public rates = [101, 109, 136];

    event Withdraw(address indexed receiver, uint256 amount);

    function RapidProfit(address _owner) public {
        require(_owner != address(0));
        owner = _owner;
    }

    // fallback function can be used to buy tokens
    function() payable public {
        //deposit(msg.sender, msg.value, TypeStake.DAY, now);
    }

/*
    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountDays) public view returns (uint256){
        _amountDays = _amountDays*(1 days);
        uint256 stakeAmount = _amount.mul(rates[_currentStake]).div(100);
        return stakeAmount;
    }
*/

    function setContractStakeEth (address _addressContract) public onlyOwner {
        require(_addressContract != address(0));
        contractStakeEth = ContractStakeEth(_addressContract);
    }

    function setContractStakeToken (address _addressContract) public onlyOwner {
        require(_addressContract != address(0));
        contractStakeToken = ContractStakeToken(_addressContract);
    }

    function withdrawOwner(uint256 _amount) public onlyOwner returns (bool) {
        require(this.balance >= _amount);
        owner.transfer(_amount);
        Withdraw(owner, _amount);
    }

    function changeRates(uint8 _numberRate, uint256 _percent) public onlyOwner returns (bool) {
        require(_percent >= 0);
        require(0 <= _numberRate && _numberRate < 3);
        rates[_numberRate] = _percent.add(100);
        return true;

    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }
}

