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

    struct transferInStructETH{
        uint256 amount;
        TypeStake stakeType;
        uint256 time;
        uint256 numberStake;
        bool isRipe;
    }

    struct transferInStructToken{
        uint256 amount;
        TypeStake stakeType;
        uint256 time;
        uint256 numberStake;
        bool isRipe;
    }

    struct stakeStruct{
        address owner;
        uint256 amount;
        TypeStake stakeType;
        uint256 time;
        StatusStake status;
    }

    stakeStruct[] arrayStakes;
    uint256[] public rates  = [101, 109, 136];


    mapping(address => uint256) balancesETH;
    mapping(address => uint256) balancesToken;

    mapping(address => transferInStructETH[]) transferInsETH;
    mapping(address => transferInStructToken[]) transferInsToken;

    uint256 stakeDay = 1 days;
    uint256 stakeWeek = 1 weeks;
    uint256 stakeMonth = 730 hours;

    event Withdraw(address indexed receiver, uint256 amount);

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
        //deposit(msg.sender, msg.value, TypeStake.DAY, now);
    }

    function depositETH(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time) public inState(State.Active) payable returns (bool){
        require(_investor != address(0));
        require(msg.sender != address(0));
        balancesETH[_investor] = balancesETH[_investor].add(_amount);
        uint256 numberStake = arrayStakes.length;

        arrayStakes.push(stakeStruct({
            owner: _investor,
            amount: _amount,
            stakeType: _stakeType,
            time: _time,
            status: StatusStake.ACTIVE
            }));
        transferInsETH[_investor].push(transferInStructETH(uint256(_amount), _stakeType ,uint256(now), numberStake, false));

        return true;
    }

    function depositToken(address _investor, uint256 _amount, TypeStake _stakeType, uint256 _time) public inState(State.Active) payable returns (bool){
        require(_investor != address(0));
        require(msg.sender != address(0));
        balancesToken[_investor] = balancesToken[_investor].add(_amount);
        uint256 numberStake = arrayStakes.length;

        arrayStakes.push(stakeStruct({
            owner: _investor,
            amount: _amount,
            stakeType: _stakeType,
            time: _time,
            status: StatusStake.ACTIVE
            }));
        transferInsToken[_investor].push(transferInStructToken(uint256(_amount), _stakeType ,uint256(now), numberStake, false));

        return true;
    }

    /**
     * @dev Function to mint tokens
     * @param _address The address of depositor.
     * @param _now The current time.
     * @return the amount of wei that can be withdrawn from contract
     */
    function validWithdrawETH(address _address, uint256 _now) public inState(State.Active) returns (uint256){
        require(_address != address(0));
        uint256 amount = 0;

        if(balancesETH[_address] <= 0 || transferInsETH[_address].length <= 0){
            return amount;
        }

        for (uint i = 0; i < transferInsETH[msg.sender].length; i++){
            TypeStake stake = transferInsETH[_address][i].stakeType;
            //uint256 nCoinSeconds = _now.sub(uint(transferIns[_address][i].time));
            //uint256 currentStakeAge = nCoinSeconds.div(1 days);
            uint256 currentStake = 0;
            if(arrayStakes[transferInsETH[_address][i].numberStake].status == StatusStake.CANCEL){
                amount = amount.add(uint256(transferInsETH[_address][i].amount));
                transferInsETH[_address][i].isRipe = true;
                continue;
            }

            if (stake == TypeStake.DAY){
                currentStake = 0;
                if( _now < uint256(transferInsETH[_address][i].time).add(stakeDay) ) continue;
            }
            if (stake == TypeStake.WEEK){
                currentStake = 1;
                if( _now < uint256(transferInsETH[_address][i].time).add(stakeWeek) ) continue;
            }
            if (stake == TypeStake.MONTH){
                currentStake = 2;
                if( _now < uint256(transferInsETH[_address][i].time).add(stakeMonth) ) continue;
            }
            amount = amount.add(transferInsETH[_address][i].amount);
            amount = amount.mul(rates[currentStake]).div(100);
            transferInsETH[_address][i].isRipe = true;
            arrayStakes[transferInsETH[_address][i].numberStake].status = StatusStake.COMPLETED;
        }
        amount = uint256(transferInsETH[_address][0].stakeType);
        return amount;
    }

    function withdrawETH() public inState(State.Active) returns (bool){
        address _address = msg.sender;
        require(_address != address(0));
        uint256 _currentTime = now;
        uint256 _amount = validWithdrawETH(_address, _currentTime);
        require(_amount > 0);
        require(this.balance >= _amount);
        require(balancesETH[_address] >= _amount);
        _address.transfer(_amount);
        balancesETH[_address] = balancesETH[_address].sub(_amount);
        for (uint i = 0; i < transferInsETH[msg.sender].length; i++){
            if(transferInsETH[_address][i].isRipe == true){
                delete arrayStakes[transferInsETH[_address][i].numberStake];
                arrayStakes.length--;
                delete transferInsETH[_address][i];
                transferInsETH[_address].length--;
            }
        }
        Withdraw(_address, _amount);
    }

    function balanceOfETH(address _owner) public view returns (uint256 balance) {
        return balancesETH[_owner];
    }

    function balanceOfToken(address _owner) public view returns (uint256 balance) {
        return balancesToken[_owner];
    }

    function cancel(uint256 _index) public returns (bool _result) {
        require(_index >= 0);
        require(msg.sender != address(0));
        arrayStakes[_index].status = StatusStake.CANCEL;
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
        require(_index < arrayStakes.length);
        _owner = arrayStakes[_index].owner;
        _amount = arrayStakes[_index].amount;
        _stakeType = arrayStakes[_index].stakeType;
        _time = arrayStakes[_index].time;
        _status = arrayStakes[_index].status;
    }

    function getETHTransferInsByAddress(address _address, uint256 _index) public view returns (
        uint256 _amount,
        TypeStake _stakeType,
        uint256 _time,
        uint256 _numberStake,
        bool _isRipe
    ) {
        require(_index < transferInsETH[_address].length);
        //len = transferInsETH[_address].length;
        _amount = transferInsETH[_address][_index].amount;
        _stakeType = transferInsETH[_address][_index].stakeType;
        _time = transferInsETH[_address][_index].time;
        _numberStake = transferInsETH[_address][_index].numberStake;
        _isRipe = transferInsETH[_address][_index].isRipe;
    }

    function getCountTransferIns(address _address) public view returns (uint256 _count) {
        _count = transferInsETH[_address].length;
    }

    function getCountStakes() public view returns (uint256 _count) {
        _count = arrayStakes.length;
    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }
}

