// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface ITreasury {
    function withdraw(uint amount_) payable external;
}

contract Gov {
    address[] public owners;
    mapping(address => bool) public isOwner;
    // 提案通过的最少票数
    uint public numConfirmationsRequired;
    // 提案
    struct Transaction {
        address treasuryAddr;   // 金库地址
        uint amount;            // 取钱金额
        bytes data;             // 额外数据
        bool executed;          // 是否已执行
        uint numConfirmations;  // 获得的票数
    }

    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    receive() external payable {}

    // 发起提案
    function submitTransaction(
        address _treasuryAddr,
        uint _amount,
        bytes memory _data
    ) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({
                treasuryAddr: _treasuryAddr,
                amount: _amount,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );
    }

    // 投票提案
    function confirmTransaction(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;
    }

    // 执行提案
    function executeTransaction(uint _txIndex, uint _amount)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;
        // 取钱
        ITreasury(transaction.treasuryAddr).withdraw(_amount);
    }

    // 取消投票
    function revokeConfirmation(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (
            address treasuryAddr,
            uint amount,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.treasuryAddr,
            transaction.amount,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    // 查询余额
    function getBalance() public view returns(uint balance){
        balance = address(this).balance;
    }
}
