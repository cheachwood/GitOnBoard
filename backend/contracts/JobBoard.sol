// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";

// ========== Custom Errors ==========
error JobDoesNotExist();
error CandidateNameEmpty();
error CandidateEmailEmpty();
error InvalidCandidateAddress();
error CandidateAlreadyAssigned();
error JobNotOpenForAssignment();
error CannotChangeCompletedOrCancelledJob();
error StatusAlreadySet();
error CannotSetInProgressWithoutCandidate();
error InvalidTransitionFromOpen();
error InvalidTransitionFromInProgress();
error OnlyAuthorOrOwnerCanToggle();
error CannotApplyToOwnJob();
error OnlyAuthorCanPerformAction();

// JobBoard contract for managing job postings and applications
// Inherits from Ownable to manage ownership and access control
// Allows users to create jobs, assign candidates, change job status, and toggle job activity
// Emits events for job creation, updates, candidate assignments, and status toggling
// Provides functions to retrieve job details and lists of jobs
// Designed for a decentralized job marketplace
// Author : Jean-Charles Félicité
// Date   : December 2025
// Version: 0.0.1
contract JobBoard is Ownable {
    // Counter for job IDs
    // Starts from 0 and increments with each new job
    uint32 private _jobIdCounter;

    constructor() Ownable(msg.sender) {}

    // Enum representing the status of a job
    // Open: Job is open for applications
    // InProgress: Job is currently being worked on
    // Completed: Job has been completed
    // Cancelled: Job has been cancelled
    enum Status {
        Open,
        InProgress,
        Completed,
        Cancelled
    }

    // Struct representing a job posting
    // Contains details such as ID, creation date, daily rate, status, activity status, author, candidate, and description
    // Optimized for storage efficiency
    // SLOT 0: id, creationDate, dailyRate, status, isActive, author
    // SLOT 1: candidate
    // SLOT 2: description (dynamically sized)
    // Total size: 50 octets + dynamic description
    struct Job {
        // --- SLOT 0 (Total: 30 / 32 octets used) ---
        uint32 id; // 4 octets | de 0 à 4 294 967 295
        uint32 creationDate; // 4 octets | Timestamp (valid until 2106)
        uint32 dailyRate; // 2 octets | de 0 à 65 535 (TJM)
        Status status; // 1 octet  | job status
        bool isActive; // 1 octet  | job active or not
        address author; // 20 octets| author address
        // --- SLOT 1 (Total: 20 / 32 octets utilisés) ---
        address candidate; // 20 octets| freelancer address
        // --- SLOT 2 (Dynamique) ---
        string description; // description of the job
    }

    // Event who register a change of status for a job
    // @param jobId The ID of the job
    // @param newStatus The new status of the job
    // @param author The address of the job author who made the change
    event JobUpdated(
        uint32 indexed jobId,
        Status indexed newStatus,
        address indexed author
    );

    // Event who register the creation of a new job
    // @param jobId The ID of the new job
    // @param author The address of the job author
    // @param dailyRate The daily rate for the job
    // @param description The description of the job
    event NewJob(
        uint32 indexed jobId,
        address indexed author,
        uint32 dailyRate,
        string description
    );

    // Event who register the assignment of a candidate to a job
    // @param jobId The ID of the job
    // @param candidateAddress The address of the assigned candidate
    // @param candidateName The name of the assigned candidate
    // @param candidateEmail The email of the assigned candidate
    event CandidateAssigned(
        uint32 indexed jobId,
        address indexed candidateAddress,
        string candidateName,
        string candidateEmail
    );

    // Event who register the toggling of a job's active status
    // @param jobId The ID of the job
    // @param isActive The new active status of the job
    // @param author The address of the job author who made the change
    event JobToggled(
        uint32 indexed jobId,
        bool isActive,
        address indexed author
    );

    // Mapping from job ID to Job struct
    mapping(uint256 => Job) jobs;

    modifier onlyAuthor(uint32 _jobId) {
        if (jobs[_jobId].author != msg.sender)
            revert OnlyAuthorCanPerformAction();
        _;
    }

    modifier jobDoesExist(uint32 _jobId) {
        if (jobs[_jobId].id == 0) revert JobDoesNotExist();
        _;
    }

    modifier onlyAuthorOrOwner(uint32 _jobId) {
        if (msg.sender != jobs[_jobId].author && msg.sender != owner()) {
            revert OnlyAuthorOrOwnerCanToggle();
        }
        _;
    }

    // Function to create a new job
    // @param _dailyRate The daily rate for the job
    // @param _description The description of the job
    function createJob(
        uint32 _dailyRate,
        string calldata _description
    ) external {
        _jobIdCounter++;
        jobs[_jobIdCounter] = Job({
            id: uint32(_jobIdCounter),
            creationDate: uint32(block.timestamp),
            dailyRate: _dailyRate,
            status: Status.Open,
            isActive: true,
            author: msg.sender,
            candidate: address(0),
            description: _description
        });
        emit NewJob(_jobIdCounter, msg.sender, _dailyRate, _description);
    }

    // Function to assign a candidate to a job
    // @param _jobId The ID of the job
    // @param _candidateAddress The address of the candidate
    // @param _candidateName The name of the candidate
    function assigneCandidate(
        uint32 _jobId,
        string calldata _candidateName,
        string calldata _candidateEmail
    ) external jobDoesExist(_jobId) {
        if (jobs[_jobId].status != Status.Open) {
            revert JobNotOpenForAssignment();
        }
        if (jobs[_jobId].candidate != address(0)) {
            revert CandidateAlreadyAssigned();
        }
        if (msg.sender == jobs[_jobId].author) {
            revert CannotApplyToOwnJob();
        }
        if (bytes(_candidateName).length == 0) {
            revert CandidateNameEmpty();
        }
        if (bytes(_candidateEmail).length == 0) {
            revert CandidateEmailEmpty();
        }

        jobs[_jobId].candidate = msg.sender;
        emit CandidateAssigned(
            _jobId,
            msg.sender,
            _candidateName,
            _candidateEmail
        );
    }

    // Function to get a job by ID
    // @param _jobId The ID of the job
    function getJob(
        uint32 _jobId
    ) external view jobDoesExist(_jobId) returns (Job memory) {
        return jobs[_jobId];
    }

    // Function to get all jobs
    function getAllJobs() external view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](_jobIdCounter);
        for (uint32 i = 1; i <= _jobIdCounter; ) {
            allJobs[i - 1] = jobs[i];
            unchecked {
                i++;
            }
        }
        return allJobs;
    }

    // Function to get all active jobs
    function getActiveJobs() external view returns (Job[] memory) {
        uint32 activeCount = 0;
        for (uint32 i = 1; i <= _jobIdCounter; ) {
            if (jobs[i].isActive) {
                activeCount++;
            }
            unchecked {
                i++;
            }
        }

        Job[] memory activeJobs = new Job[](activeCount);

        uint32 currentIndex = 0;
        for (uint32 i = 1; i <= _jobIdCounter; ) {
            if (jobs[i].isActive) {
                activeJobs[currentIndex] = jobs[i];
                currentIndex++;
            }
            unchecked {
                i++;
            }
        }

        return activeJobs;
    }

    // Function to change the status of a job
    // @param _jobId The ID of the job
    // @param _newStatus The new status to set
    function changeJobStatus(
        uint32 _jobId,
        Status _newStatus
    ) external jobDoesExist(_jobId) onlyAuthor(_jobId) {
        Status currentStatus = jobs[_jobId].status;
        if (
            currentStatus == Status.Completed ||
            currentStatus == Status.Cancelled
        ) {
            revert CannotChangeCompletedOrCancelledJob();
        }
        if (currentStatus == _newStatus) {
            revert StatusAlreadySet();
        }

        if (
            _newStatus == Status.InProgress &&
            jobs[_jobId].candidate == address(0)
        ) {
            revert CannotSetInProgressWithoutCandidate();
        }

        if (currentStatus == Status.Open) {
            // "Si le nouveau statut n'est PAS InProgress ET n'est PAS Cancelled, alors c'est invalide"
            if (
                _newStatus != Status.InProgress &&
                _newStatus != Status.Cancelled
            ) {
                revert InvalidTransitionFromOpen();
            }
        } else if (currentStatus == Status.InProgress) {
            // "Si le nouveau statut n'est PAS Open ET n'est PAS Completed ET n'est PAS Cancelled..."
            if (
                _newStatus != Status.Open &&
                _newStatus != Status.Completed &&
                _newStatus != Status.Cancelled
            ) {
                revert InvalidTransitionFromInProgress();
            }
        }

        jobs[_jobId].status = _newStatus;
        emit JobUpdated(_jobId, _newStatus, msg.sender);
    }

    // Function to toggle the active status of a job
    // @param _jobId The ID of the job
    function toggleJobActive(
        uint32 _jobId
    ) external jobDoesExist(_jobId) onlyAuthorOrOwner(_jobId) {
        jobs[_jobId].isActive = !jobs[_jobId].isActive;

        emit JobToggled(_jobId, jobs[_jobId].isActive, msg.sender);
    }
}
