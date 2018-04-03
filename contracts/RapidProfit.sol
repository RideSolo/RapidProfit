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


contract RapidProfit is Ownable {
    using SafeMath for uint256;

    enum State {Active, Closed}
    State public state;

    enum TypeStake {DAY, WEEK, MONTH}
    TypeStake public typeStake;

    enum StatusStake {ACTIVE, COMPLETED, CANCEL}

    struct transferInStruct{
        uint256 amount;
        uint8 stakeType;
        uint64 time;
        uint256 numberStake;
        bool isRipe;
    }

    struct stakeStruct{
        address owner;
        uint256 amount;
        uint8 stakeType;
        uint64 time;
        uint8 status;
    }

    stakeStruct[] arrayStakes;


    mapping(address => uint256) balances;
    mapping(address => transferInStruct[]) transferIns;
    uint64 stakeDay = 1 days;
    uint64 stakeWeek = 1 weeks;
    uint64 stakeMonth = 730 hours;

    event Withdraw(address indexed receiver, uint256 amount);
    event Deposit(address indexed investor, uint256 amount, uint8 stakeType);

    function RapidProfit(address _owner) public {
        require(_owner != address(0));
        owner = _owner;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    // fallback function can be used to buy tokens
    function() payable public {
        deposit(msg.sender, msg.value, TypeStake.DAY, now);
    }

    //Положить ЭТХ на вклад
    function deposit(address _investor, uint256 _amount, uint8 _stakeType, uint64 _time) public inState(State.Active) payable returns (bool){
        require(_investor != address(0));
        require(msg.sender != address(0));
        balances[_investor] = balances[_investor].add(_amount);
        uint256 numberStake = arrayStakes.length;

        arrayStakes.push(stakeStruct({
            owner: _investor,
            amount: _amount,
            stakeType: _stakeType,
            time: _time,
            status: StatusStake.ACTIVE
            }));
        transferIns[_investor].push(transferInStruct(uint256(_amount), uint8(_stakeType) ,uint64(now), numberStake, false));
        Deposit(_investor, _amount, _stakeType);

        return true;
    }

    //Проверить возможность снятия ЭТХ
    function validWithdraw(address _address, uint64 _now) public inState(State.Active) payable returns (uint256){
        require(_address != address(0));
        uint256 amount = 0;

        if(balances[_address] <= 0 || transferIns[_address].length <= 0){
            return amount;
        }

        for (uint i = 0; i < transferIns[msg.sender].length; i++){
            uint8 stake = uint8(transferIns[_address][i].stakeType);
            uint64 nCoinSeconds = _now.sub(uint(transferIns[_address][i].time));
            uint64 currentStakeAge = nCoinSeconds.div(1 days);

            if (stake == TypeStake.DAY){
                if( _now < uint64(transferIns[_address][i].time).add(stakeDay) ) continue;
            }
            if (stake == TypeStake.WEEK){
                if( _now < uint64(transferIns[_address][i].time).add(stakeWeek) ) continue;
            }
            if (stake == TypeStake.MONTH){
                if( _now < uint64(transferIns[_address][i].time).add(stakeMonth) ) continue;
            }
            amount = amount.add(uint256(transferIns[_address][i].amount));
            transferIns[_address][i].isRipe = true;
            arrayStakes[transferIns[_address][i].numberStake].status = StatusStake.COMPLETED;
        }
        return amount;
    }

    //Снятие наличных с вклада
    function withdraw() public inState(State.Active) payable returns (bool){
        address _address = msg.sender;
        require(_address != address(0));
        uint64 _currentTime = now;
        uint256 _amount = validWithdraw(_address, _currentTime);
        require(_amount > 0);
        require(this.balance >= _amount);
        require(balances[_address] >= _amount);
        _address.transfer(_amount);
        balances[_address] = balances[_address].sub(_amount);
        for (uint i = 0; i < transferIns[msg.sender].length; i++){
            if(transferIns[_address][i].isRipe == true){
                delete arrayStakes[transferIns[_address][i].numberStake];
                arrayStakes.length--;
                delete transferIns[_address][i];
            }
        }
        Withdraw(_address, _amount);
    }

    //Баланс пользователя
    function balanceOf(address _owner) public returns (uint256 balance) {
        return balances[_owner];
    }

    //Снятие ЭТХ для владельца контракта
    function withdrawOwner(uint256 _amount) public onlyOwner returns (bool) {
        require(this.balance >= _amount);
        owner.transfer(_amount);
        Withdraw(owner, _amount);
    }

    //Прекратить вклад
    function cancelStake(uint256 _index) public returns (bool) {
        require(_index >= 0);
        arrayStakes[_index].status = StatusStake.CANCEL;
    }


    //Возвращает вклад по индексу
    function getStakeByIndex(uint256 _index) public view returns (
        address _owner,
        uint256 _amount,
        uint8 _stakeType,
        uint64 _time,
        uint8 _status
    ) {
        require(_index < arrayStakes.length);
        _owner = arrayStakes[_index].owner;
        _amount = arrayStakes[_index].amount;
        _stakeType = arrayStakes[_index].stakeType;
        _time = arrayStakes[_index].time;
        _status = arrayStakes[_index].status;
    }

    //Возвращает общее количество сделанных вкладов
    function getCountStakes() public view returns (uint256 _count) {
        _count = arrayStakes.length;
    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }
}
// Сколько осталось ждать для снятия вклада (uint256 _index)

/**
Вопрос к заказчику:
Надо ли хранить историю вкладов?

*/

