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

    struct transferInStruct{
        uint256 amount;
        uint8 percent;
        uint64 time;
        bool isRipe;
    }

    mapping(address => uint256) balances;
    mapping(address => transferInStruct[]) transferIns;
    uint64 stakeDay = 1 days;
    uint64 stakeWeek = 1 weeks;
    uint64 stakeMonth = 31 days;

    event TokenPurchase(address indexed beneficiary, uint256 value, uint256 amount);

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
        deposit(msg.sender, 1);
    }

    function deposit(address _investor, uint256 _amount, uint8 _percent) public inState(State.Active) payable returns (bool){
        require(_investor != address(0));
        require(msg.sender != address(0));
        balances[_investor] = balances[_investor].add(_amount);
        transferIns[_investor].push(transferInStruct(uint256(_amount), uint8(_percent) ,uint64(now), false));
        return true;
    }

    //After test make private
    function validWithdraw(address _address, uint64 _now) public inState(State.Active) payable returns (uint256){
        require(_address != address(0));
        uint256 amount = 0;

        if(balances[_address] <= 0 || transferIns[_address].length <= 0){
            return amount;
        }

        for (uint i = 0; i < transferIns[msg.sender].length; i++){
            uint8 stake = uint8(transferIns[_address][i].percent);
            uint64 nCoinSeconds = _now.sub(uint(transferIns[_address][i].time));
            uint64 currentStakeAge = nCoinSeconds.div(1 days);

            if (stake == 1){
                if( _now < uint64(transferIns[_address][i].time).add(stakeDay) ) continue;
            }
            if (stake == 7){
                if( _now < uint64(transferIns[_address][i].time).add(stakeWeek) ) continue;
            }
            if (stake == 31){
                if( _now < uint64(transferIns[_address][i].time).add(stakeMonth) ) continue;
            }
            if(currentStakeAge > stake){
                amount = amount.add(uint256(transferIns[_address][i].amount));
                transferIns[_address][i].isRipe = true;
                //delete transferIns[_address][i];
            }
        }
        return amount;
    }

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
                delete transferIns[_address][i];
            }
        }
    }



    function balanceOf(address _owner) public returns (uint256 balance) {
        return balances[_owner];
    }

    function removeContract() public onlyOwner {
        selfdestruct(owner);
    }
}

