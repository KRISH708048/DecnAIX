// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecenAIX {
    address public owner;
    uint256 public taskCounter;
    uint256 public constant platformFeePercent = 5;

    enum TaskStatus { Created, Accepted, Completed, Paid }

    struct Task {
        uint256 id;
        address renter;
        address provider;
        string ipfsCodeHash;
        string weightDownloadKey;
        uint256 duration;
        TaskStatus status;
    }

    mapping(uint256 => Task) tasks;

    event TaskCreated(uint256 indexed taskId, address indexed renter);
    event TaskAccepted(uint256 indexed taskId, address indexed provider);
    event TaskCompleted(uint256 indexed taskId);
    event PaymentReleased(uint256 indexed taskId, address indexed provider, uint256 providerAmount);
    event DisputeRaised(uint256 indexed taskId);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyRenter(uint256 taskId) {
        require(msg.sender == tasks[taskId].renter, "Not renter");
        _;
    }

    modifier onlyProvider(uint256 taskId) {
        require(msg.sender == tasks[taskId].provider, "Not provider");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        taskCounter = 0;
    }

    function createTask( string calldata ipfsCodeHash, string memory filePassword, uint256 duration) external {
        taskCounter++;
        tasks[taskCounter] = Task({
            id: taskCounter,
            renter: msg.sender,
            provider: address(0),
            ipfsCodeHash: ipfsCodeHash,
            weightDownloadKey: filePassword,
            duration: duration,
            status: TaskStatus.Created
        });

        emit TaskCreated(taskCounter, msg.sender);
    }

    function acceptTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        require(task.renter != msg.sender, "Renter can not be provider");
        require(task.status == TaskStatus.Created, "Task not available");
        require(task.provider == address(0), "Already accepted");

        task.provider = msg.sender;
        task.status = TaskStatus.Accepted;

        emit TaskAccepted(taskId, msg.sender);
    }

    function markTaskCompleted(uint256 taskId) external onlyProvider(taskId) {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Accepted, "Not accepted yet");

        task.status = TaskStatus.Completed;

        emit TaskCompleted(taskId);
    }

    function payAndUnlock(uint256 taskId) external payable onlyRenter(taskId) {
        Task storage task = tasks[taskId];
        require(task.status == TaskStatus.Completed, "Task not complete");
        require(!taskExistsPaid(taskId), "Already paid");

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 providerAmount = msg.value - platformFee;

        // Send to provider
        (bool success, ) = task.provider.call{value: providerAmount}("");
        require(success, "Provider payment failed");

        // Platform fee stays in contract
        task.status = TaskStatus.Paid;

        emit PaymentReleased(taskId, task.provider, providerAmount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdraw failed");

        emit Withdrawn(owner, balance);
    }

    function taskExistsPaid(uint256 taskId) internal view returns (bool) {
        return tasks[taskId].status == TaskStatus.Paid;
    }

    function raiseDispute(uint256 taskId) external onlyRenter(taskId) {
        emit DisputeRaised(taskId);
    }

    function getDownloadKey(uint256 taskId) external view onlyRenter(taskId) returns (string memory) {
        require(tasks[taskId].status == TaskStatus.Paid, "Payment required");
        return tasks[taskId].weightDownloadKey;
    }

    function getTask(uint256 taskId) external view returns (
        address renter,
        address provider,
        uint256 duration,
        TaskStatus status
    ) {
        Task storage task = tasks[taskId];
        return (
            task.renter,
            task.provider,
            task.duration,
            task.status
        );
    }
}
