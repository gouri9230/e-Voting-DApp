// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import {VoteToken} from "./voteToken.sol";

contract Voting {
    address public admin;
    enum electionPhase {Registration, Voting, Ended}
    electionPhase public currentPhase;
    VoteToken voteToken;

    struct Candidate {
        string name;
        uint256 voteCount;
    }
    Candidate[] public candidates;
    mapping(address => uint256) public candidateIndex;
    mapping(address => bool) public isVoter;
    mapping(address => bool) public iscandidate;
    mapping(address => bool) public hasVoted;

    event CandidateRegistered(address indexed candidate, string name);
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, address candidate);
    event PhaseChanged(electionPhase preious, electionPhase current);

    constructor(address _voteToken) {
        admin = msg.sender;
        voteToken = VoteToken(_voteToken);
        currentPhase = electionPhase.Registration;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender, "Only admin call this function");
        _;
    }

    modifier checkPhase(electionPhase phase) {
        require(currentPhase == phase, "Wrong election phase");
        _;
    }

    function changePhase(electionPhase phase) external onlyAdmin {
        require(phase != currentPhase, "Already in this phase of election");
        emit PhaseChanged(currentPhase, phase);
        currentPhase = phase;
    }
    function registerCandidate(address _candidate, string memory _name) external onlyAdmin checkPhase(electionPhase.Registration){
        require(!iscandidate[_candidate], "Candidate already registered");
        candidates.push(Candidate(_name, 0));
        candidateIndex[_candidate] = candidates.length;
        iscandidate[_candidate] = true;
        emit CandidateRegistered(_candidate, _name);
    }

    function registerVoter(address _voter) external onlyAdmin checkPhase(electionPhase.Registration){
        require(!isVoter[_voter], "Voter already registered");
        isVoter[_voter] = true;
        voteToken.mint(_voter);
        emit VoterRegistered(_voter);
    }

    function vote(address _candidate) external checkPhase(electionPhase.Voting) {
        require(isVoter[msg.sender], "You are not registered for voting!");
        require(!hasVoted[msg.sender], "You can vote only once!");
        require(iscandidate[_candidate], "Not a registered candidate!");
        require(msg.sender != admin, "Admin of the contract cannot vote!");
        candidates[candidateIndex[_candidate]].voteCount++;
        voteToken.burn(msg.sender);
        hasVoted[msg.sender] = true;
        emit VoteCast(msg.sender, _candidate);
    }

    function declareWinner() external view onlyAdmin checkPhase(electionPhase.Ended) returns (string memory winner) {
        uint256 maxVotes = 0;
        for (uint8 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winner = candidates[i].name;
            }
        }
        return winner;
    }

    function getCandidateVotes(address _candidate) external view returns(uint256) {
        return candidates[candidateIndex[_candidate]].voteCount;
    }
}