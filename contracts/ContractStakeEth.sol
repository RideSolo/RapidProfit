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

    enum TypeStake {DAY, WEEK, MONTH}
    TypeStake typeStake;
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

    StakeStruct[] arrayStakesETH;

    uint256[] public rates = [101, 109, 136];

    uint256 public totalDepositEthAll;

    uint256 public totalWithdrawEthAll;

    mapping (address => uint256) balancesETH;
    mapping (address => uint256) totalDepositEth;
    mapping (address => uint256) totalWithdrawEth;
    mapping (address => TransferInStructETH[]) transferInsEth;
    mapping (address => bool) public contractUsers;

    event Withdraw(address indexed receiver, uint256 amount);

    modifier onlyOwnerOrUser() {
        require(msg.sender == owner || contractUsers[msg.sender]);
        _;
    }

    // fallback function can be used to buy tokens
    function() payable public {
        //deposit(msg.sender, msg.value, TypeStake.DAY, now);
    }

    function ContractStakeEth(address _owner) public {
        require(_owner != address(0));
        //owner = _owner;
        owner = msg.sender; // for test's
    }

    /**
    * @dev Add an contract admin
    */
    function setContractUser(address _user, bool _isUser) public onlyOwner {
        contractUsers[_user] = _isUser;
    }

    function depositETH(address _investor, TypeStake _stakeType, uint256 _time, uint256 _value) external returns (bool){
        require(_investor != address(0));
        require(_value > 0);
        require(transferInsEth[_investor].length < 31);
        balancesETH[_investor] = balancesETH[_investor].add(_value);
        totalDepositEth[_investor] = totalDepositEth[_investor].add(_value);
        totalDepositEthAll = totalDepositEthAll.add(_value);
        uint256 indexStake = arrayStakesETH.length;

        arrayStakesETH.push(StakeStruct({
            owner : _investor,
            amount : _value,
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
    function validWithdrawETH(address _address, uint256 _now) public returns (uint256){
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
            uint256 amountHours = _now.sub(stakeTime).div(1 hours);
            stakeAmount = calculator(currentStake, stakeAmount, amountHours);
            //stakeAmount = stakeAmount.mul(rates[currentStake]).div(100);

            amount = amount.add(stakeAmount);
            transferInsEth[_address][i].isRipe = true;
            arrayStakesETH[transferInsEth[_address][i].indexStake].status = StatusStake.COMPLETED;
        }
        return amount;
    }

    function getBalanceEthContract() public view returns (uint256){
        return this.balance;
    }

    function withdrawETH(address _address) public returns (uint256){
        require(_address != address(0));
        uint256 _currentTime = now;
        _currentTime = 1525651200; // for test
        uint256 _amount = validWithdrawETH(_address, _currentTime);
        require(_amount > 0);
        //require(balancesETH[_address] >= _amount);
        //balancesETH[_address] = balancesETH[_address].sub(_amount);
        totalWithdrawEth[_address] = totalWithdrawEth[_address].add(_amount);
        totalWithdrawEthAll = totalWithdrawEthAll.add(_amount);
        while (clearTransferInsEth(_address) == false) {
            clearTransferInsEth(_address);
        }
        Withdraw(_address, _amount);

        return _amount;
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
/*
        uint256 amount = 0;
        for (uint i = 0; i < transferInsEth[_owner].length; i++) {
            amount.add(arrayStakesETH[transferInsEth[_owner][i].indexStake].amount);
        }

        return amount;
*/

    }

    function cancel(uint256 _index, address _address) public returns (bool) {
        require(_index >= 0);
        require(msg.sender != address(0));
        if(_address != arrayStakesETH[_index].owner){
            return false;
        }
        arrayStakesETH[_index].status = StatusStake.CANCEL;
        return true;
    }

    function changeRates(uint8 _numberRate, uint256 _percent) public returns (bool) {
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

    function calculator(uint8 _currentStake, uint256 _amount, uint256 _amountHours) public view returns (uint256 stakeAmount){
        uint32 i = 0;
        uint256 number = 0;
        stakeAmount = _amount;
        if (_currentStake == 0) {
            number = _amountHours.div(24);
        }
        if (_currentStake == 1) {
            number = _amountHours.div(168);
        }
        if (_currentStake == 2) {
            number = _amountHours.div(730);
        }
        while(i < number){
            stakeAmount= stakeAmount.mul(rates[_currentStake]).div(100);
            i++;
        }
    }

}
