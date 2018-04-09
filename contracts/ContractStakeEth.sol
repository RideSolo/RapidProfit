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
        require(msg.sender == owner);
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

contract ContractStakeEth is Ownable {
    using SafeMath for uint256;
    enum State {Active, Closed}
    State public state;
    enum TypeStake {DAY, WEEK, MONTH}
    TypeStake public typeStake;
    enum StatusStake {ACTIVE, COMPLETED, CANCEL}

    struct TransferInStructETH {
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

    StakeStruct[] public arrayStakesETH;

    uint256[] public rates = [101, 109, 136];

    uint256 public totalDepositEthAll;

    uint256 public totalWithdrawEthAll;

    mapping (address => uint256) balancesETH;
    mapping (address => uint256) totalDepositEth;
    mapping (address => uint256) totalWithdrawEth;
    mapping (address => TransferInStructETH[]) public transferInsEth;
    mapping (address => bool) public contractAdmins;

    event Withdraw(address indexed receiver, uint256 amount);

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

    function ContractStakeEth(address _owner) public {
        require(_owner != address(0));
        owner = _owner;
    }

    /**
    * @dev Add an contract admin
    */
    function setContractAdmin(address _admin, bool _isAdmin) public onlyOwner {
        contractAdmins[_admin] = _isAdmin;
    }

    function depositETH(address _investor, TypeStake _stakeType, uint256 _time) public inState(State.Active) payable returns (bool){
        require(_investor != address(0));
        require(msg.sender != address(0));
        require(msg.value > 0);
        require(transferInsEth[_investor].length < 31);
        balancesETH[_investor] = balancesETH[_investor].add(msg.value);
        totalDepositEth[_investor] = totalDepositEth[_investor].add(msg.value);
        totalDepositEthAll = totalDepositEthAll.add(msg.value);

        uint256 indexStake = arrayStakesETH.length;

        arrayStakesETH.push(StakeStruct({
            owner : _investor,
            amount : msg.value,
            stakeType : _stakeType,
            time : _time,
            status : StatusStake.ACTIVE
            }));
        transferInsEth[_investor].push(TransferInStructETH(indexStake, false));

        return true;
    }

    /**
 * @dev Function checks how much you can remove the ETH
 * @param _address The address of depositor.
 * @param _now The current time.
 * @return the amount of wei that can be withdrawn from contract
 */
    function validWithdrawETH(address _address, uint256 _now) public inState(State.Active) returns (uint256){
        require(_address != address(0));
        uint256 amount = 0;

        if (balancesETH[_address] <= 0 || transferInsEth[_address].length <= 0) {
            return amount;
        }

        for (uint i = 0; i < transferInsEth[_address].length; i++) {
            uint256 indexCurStake = transferInsEth[_address][i].indexStake;
            TypeStake stake = arrayStakesETH[indexCurStake].stakeType;
            uint256 stakeTime = arrayStakesETH[indexCurStake].time;
            uint256 stakeAmount = arrayStakesETH[indexCurStake].amount;
            uint8 currentStake = 0;
            if (arrayStakesETH[transferInsEth[_address][i].indexStake].status == StatusStake.CANCEL) {
                amount = amount.add(stakeAmount);
                transferInsEth[_address][i].isRipe = true;
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
            //uint256 amountDays = _now.sub(stakeTime).div(1 days);
            //stakeAmount = calculator(currentStake, stakeAmount, amountDays);
            stakeAmount = stakeAmount.mul(rates[currentStake]).div(100);

            amount = amount.add(stakeAmount);
            transferInsEth[_address][i].isRipe = true;
            arrayStakesETH[transferInsEth[_address][i].indexStake].status = StatusStake.COMPLETED;
        }
        return amount;
    }

    function getBalanceEthContract() public view returns (uint256){
        return this.balance;
    }

    function withdrawETH(address _address) public inState(State.Active) returns (bool){
        require(_address != address(0));
        uint256 _currentTime = now;
        //_currentTime = 1523491200; // for test
        uint256 _amount = validWithdrawETH(_address, _currentTime);
        require(_amount > 0);
        require(this.balance >= _amount);
        require(balancesETH[_address] >= _amount);
        _address.transfer(_amount);
        balancesETH[_address] = balancesETH[_address].sub(_amount);
        totalWithdrawEth[_address] = totalWithdrawEth[_address].add(_amount);
        totalWithdrawEthAll = totalWithdrawEthAll.add(_amount);
        while (clearTransferInsEth(_address) == false) {
            clearTransferInsEth(_address);
        }
        Withdraw(_address, _amount);
    }

    function clearTransferInsEth(address _owner) private returns (bool) {
        for (uint i = 0; i < transferInsEth[_owner].length; i++) {
            if (transferInsEth[_owner][i].isRipe == true) {
                removeMemberArrayEth(_owner, i);
                return false;
            }
        }
        return true;
    }

    function removeMemberArrayEth(address _address, uint index) private {
        if (index >= transferInsEth[_address].length) return;
        for (uint i = index; i < transferInsEth[_address].length - 1; i++) {
            transferInsEth[_address][i] = transferInsEth[_address][i + 1];
        }
        delete transferInsEth[_address][transferInsEth[_address].length - 1];
        transferInsEth[_address].length--;
    }

    function balanceOfETH(address _owner) public view returns (uint256 balance) {
        return balancesETH[_owner];
    }

    function cancel(uint256 _index) public returns (bool _result) {
        require(_index >= 0);
        require(msg.sender != address(0));
        arrayStakesETH[_index].status = StatusStake.CANCEL;
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

    function getETHStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        TypeStake _stakeType,
        uint256 _time,
        StatusStake _status
    ) {
        require(_index < arrayStakesETH.length);
        _owner = arrayStakesETH[_index].owner;
        _amount = arrayStakesETH[_index].amount;
        _stakeType = arrayStakesETH[_index].stakeType;
        _time = arrayStakesETH[_index].time;
        _status = arrayStakesETH[_index].status;
    }

    function getETHTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _indexStake,
        bool _isRipe
    ) {
        require(_index < transferInsEth[_address].length);
        _indexStake = transferInsEth[_address][_index].indexStake;
        _isRipe = transferInsEth[_address][_index].isRipe;
    }

    function getCountTransferInsEth(address _address) public view returns (uint256 _count) {
        _count = transferInsEth[_address].length;
    }

    function getCountStakesEth() public view returns (uint256 _count) {
        _count = arrayStakesETH.length;
    }

    function getTotalEthDepositByAddress(address _owner) public view returns (uint256 _amountEth) {
        return totalDepositEth[_owner];
    }

    function getTotalEthWithdrawByAddress(address _owner) public view returns (uint256 _amountEth) {
        return totalWithdrawEth[_owner];
    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }

    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountDays) public view returns (uint256){
        _amountDays = _amountDays*(1 days);
        uint256 stakeAmount = _amount.mul(rates[_currentStake]).div(100);
        return stakeAmount;
    }

}
