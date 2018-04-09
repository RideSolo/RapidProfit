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


contract ContractStakeToken is Ownable {
    using SafeMath for uint256;

    enum State {Active, Closed}
    State public state;

    enum TypeStake {DAY, WEEK, MONTH}
    TypeStake public typeStake;

    enum StatusStake {ACTIVE, COMPLETED, CANCEL}

    struct TransferInStructToken {
        uint256 indexStake;
        bool isRipe;
    }

    struct StakeStruct {
        address owner;
        uint256 amount;
        TypeStake stakeType;
        uint256 time;
        StatusStake status;
    }

    StakeStruct[] public arrayStakesToken;

    uint256[] public rates = [101, 109, 136];

    uint256 public totalDepositTokenAll;

    uint256 public totalWithdrawTokenAll;
    uint256 public balanceTokenContract;


    mapping (address => uint256) balancesToken;
    mapping (address => uint256) totalDepositToken;
    mapping (address => uint256) totalWithdrawToken;
    mapping (address => TransferInStructToken[]) transferInsToken;
    mapping (address => bool) public contractAdmins;

    event Withdraw(address indexed receiver, uint256 amount);

    function ContractStakeToken(address _owner) public {
        require(_owner != address(0));
        owner = _owner;
    }

    /**
    * @dev Add an contract admin
    */
    function setContractAdmin(address _admin, bool _isAdmin) public onlyOwner {
        contractAdmins[_admin] = _isAdmin;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || contractAdmins[msg.sender]);
        _;
    }

    // fallback function can be used to buy tokens
    function() payable public {
        //deposit(msg.sender, msg.value, TypeStake.DAY, now);
    }

    function depositToken(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time) public inState(State.Active) payable returns (bool){
        require(_investor != address(0));
        require(msg.sender != address(0));
        require(transferInsToken[_investor].length < 31);

        balancesToken[_investor] = balancesToken[_investor].add(_amount);
        uint256 indexStake = arrayStakesToken.length;
        totalDepositToken[_investor] = totalDepositToken[_investor].add(_amount);
        totalDepositTokenAll = totalDepositTokenAll.add(_amount);
        balanceTokenContract = balanceTokenContract.add(_amount);

        arrayStakesToken.push(StakeStruct({
            owner : _investor,
            amount : _amount,
            stakeType : _stakeType,
            time : _time,
            status : StatusStake.ACTIVE
            }));
        transferInsToken[_investor].push(TransferInStructToken(indexStake, false));

        return true;
    }

    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountDays) public view returns (uint256){
        _amountDays = _amountDays*(1 days);
        uint256 stakeAmount = _amount.mul(rates[_currentStake]).div(100);
        return stakeAmount;
    }

    /**
 * @dev Function checks how much you can remove the Token
 * @param _address The address of depositor.
 * @param _now The current time.
 * @return the amount of Token that can be withdrawn from contract
 */
    function validWithdrawToken(address _address, uint256 _now) public inState(State.Active) returns (uint256){
        require(_address != address(0));
        uint256 amount = 0;

        if (balancesToken[_address] <= 0 || transferInsToken[_address].length <= 0) {
            return amount;
        }

        for (uint i = 0; i < transferInsToken[_address].length; i++) {
            uint256 indexCurStake = transferInsToken[_address][i].indexStake;
            TypeStake stake = arrayStakesToken[indexCurStake].stakeType;
            uint256 stakeTime = arrayStakesToken[indexCurStake].time;
            uint256 stakeAmount = arrayStakesToken[indexCurStake].amount;
            uint8 currentStake = 0;
            if (arrayStakesToken[transferInsToken[_address][i].indexStake].status == StatusStake.CANCEL) {
                amount = amount.add(stakeAmount);
                transferInsToken[_address][i].isRipe = true;
                continue;
            }
            if (stake == TypeStake.DAY) {
                currentStake = 0;
                if (_now < stakeTime.add(1 days)) continue;
            }
            if (stake == TypeStake.WEEK) {
                currentStake = 1;
                if (_now < stakeTime.add(7 days)) continue;
            }
            if (stake == TypeStake.MONTH) {
                currentStake = 2;
                if (_now < stakeTime.add(730 hours)) continue;
            }
            stakeAmount = stakeAmount.mul(rates[currentStake]).div(100);
            amount = amount.add(stakeAmount);
            transferInsToken[_address][i].isRipe = true;
            arrayStakesToken[transferInsToken[_address][i].indexStake].status = StatusStake.COMPLETED;
        }
        return amount;
    }

    function getBalanceTokenContract() public view returns (uint256){
        return balanceTokenContract;
    }

    function withdrawToken() public inState(State.Active) returns (bool){
        address _address = msg.sender;
        require(_address != address(0));
        uint256 _currentTime = now;
        //_currentTime = 1523491200; // for test
        uint256 _amount = validWithdrawToken(_address, _currentTime);
        require(_amount > 0);
        require(balanceTokenContract >= _amount);
        require(balancesToken[_address] >= _amount);
        _address.transfer(_amount);
        balancesToken[_address] = balancesToken[_address].sub(_amount);
        balanceTokenContract = balanceTokenContract.sub(_amount);
        totalWithdrawToken[_address] = totalWithdrawToken[_address].add(_amount);
        totalWithdrawTokenAll = totalWithdrawTokenAll.add(_amount);
        while (clearTransferInsToken(_address) == false) {
            clearTransferInsToken(_address);
        }
        Withdraw(_address, _amount);
    }

    function clearTransferInsToken(address _owner) private returns (bool) {
        for (uint i = 0; i < transferInsToken[_owner].length; i++) {
            if (transferInsToken[_owner][i].isRipe == true) {
                removeMemberArrayToken(_owner, i);
                return false;
            }
        }
        return true;
    }

    function removeMemberArrayToken(address _address, uint index) private {
        if (index >= transferInsToken[_address].length) return;
        for (uint i = index; i < transferInsToken[_address].length - 1; i++) {
            transferInsToken[_address][i] = transferInsToken[_address][i + 1];
        }
        delete transferInsToken[_address][transferInsToken[_address].length - 1];
        transferInsToken[_address].length--;
    }

    function balanceOfToken(address _owner) public view returns (uint256 balance) {
        return balancesToken[_owner];
    }

    function cancel(uint256 _index) public returns (bool _result) {
        require(_index >= 0);
        require(msg.sender != address(0));
        arrayStakesToken[_index].status = StatusStake.CANCEL;
        _result = true;
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

    function getTokenStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        TypeStake _stakeType,
        uint256 _time,
        StatusStake _status
    ) {
        require(_index < arrayStakesToken.length);
        _owner = arrayStakesToken[_index].owner;
        _amount = arrayStakesToken[_index].amount;
        _stakeType = arrayStakesToken[_index].stakeType;
        _time = arrayStakesToken[_index].time;
        _status = arrayStakesToken[_index].status;
    }

    function getTokenTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _indexStake,
        bool _isRipe
    ) {
        require(_index < transferInsToken[_address].length);
        _indexStake = transferInsToken[_address][_index].indexStake;
        _isRipe = transferInsToken[_address][_index].isRipe;
    }

    function getCountTransferInsToken(address _address) public view returns (uint256 _count) {
        _count = transferInsToken[_address].length;
    }

    function getCountStakesToken() public view returns (uint256 _count) {
        _count = arrayStakesToken.length;
    }

    function getTotalTokenDepositByAddress(address _owner) public view returns (uint256 _amountEth) {
        return totalDepositToken[_owner];
    }

    function getTotalTokenWithdrawByAddress(address _owner) public view returns (uint256 _amountEth) {
        return totalWithdrawToken[_owner];
    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }
}
