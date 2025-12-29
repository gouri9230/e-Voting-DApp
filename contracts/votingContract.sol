// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract VotingContract {
    address public admin;
    enum ElectionPhase {Registration, Voting, Ended}
    ElectionPhase public currentPhase;

    struct Candidate {
        string name;
        uint256 voteCount;
        address candidateAddress;
    }

    Candidate[] public candidates;
    mapping(address => bool) public approvedVoters;
    mapping(address => bool) public iscandidate;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public registrationRequested;
    address[] public voterRequests;

    event CandidateRegistered(uint256 indexed candidateId, string name);
    event VoterApproved(address indexed voter);
    event VoteCast(address indexed voter, uint256 candidateId);
    event PhaseChanged(ElectionPhase previous, ElectionPhase current);

    constructor() {
        admin = msg.sender;
        currentPhase = ElectionPhase.Registration;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender, "Only admin can call this function");
        _;
    }

    modifier checkPhase(ElectionPhase phase) {
        require(currentPhase == phase, "Wrong election phase");
        _;
    }

    // change election phase 
    function changePhase(ElectionPhase phase) external onlyAdmin {
        require(phase != currentPhase, "Already in this phase of election");
        emit PhaseChanged(currentPhase, phase);
        currentPhase = phase;
    }

    // Register a candidate
    function registerCandidate(address _candidate, string calldata _name) external onlyAdmin checkPhase(ElectionPhase.Registration){
        require(!iscandidate[_candidate], "Candidate already registered");
        candidates.push(Candidate(_name, 0, _candidate));
        iscandidate[_candidate] = true;
        emit CandidateRegistered(candidates.length - 1, _name);
    }

    // Voter requests for registration 
    function requestRegistration() external checkPhase(ElectionPhase.Registration) {
        require(!registrationRequested[msg.sender], "Already requested");
        require(!approvedVoters[msg.sender], "Already approved");
        registrationRequested[msg.sender] = true;
        voterRequests.push(msg.sender);
    }

    // Approve requested voter to vote
    function approveVoter(address _voter) external onlyAdmin checkPhase(ElectionPhase.Registration) {
        require(registrationRequested[_voter], "No registration request");
        approvedVoters[_voter] = true;
        registrationRequested[_voter] = false;
        emit VoterApproved(_voter);
    }

    // Cast vote
    function vote(uint256 candidateId) external checkPhase(ElectionPhase.Voting) {
        require(approvedVoters[msg.sender], "Not an approved voter");
        require(!hasVoted[msg.sender], "Already voted!");
        require(candidateId < candidates.length, "Not a registered candidate!");
        require(msg.sender != admin, "Admin of the contract cannot vote!");
        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;    
        emit VoteCast(msg.sender, candidateId);    
    }

    // declare winner after voting ends
    function declareWinner() external view checkPhase(ElectionPhase.Ended) returns (string memory winner) {
        uint256 maxVotes = 0;
        uint256 winnerIndex;
        for (uint8 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return candidates[winnerIndex].name;
    }

    // get list of all candidates
    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    // get list of all voter requests
    function getVoterRequests() external view returns (address[] memory) {
        return voterRequests;
    }
}