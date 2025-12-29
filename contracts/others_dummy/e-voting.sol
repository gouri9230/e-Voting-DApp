// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import {VoteToken} from "./voteToken.sol";

contract Voting1 {
    enum ElectionPhases {candidateRegistrationPhase, voterRegistrationPhase, votingPhase, endedPhase, resultsPhase}

    struct Candidate {
        string name;
        uint voteCount;
        bool candidateAdded;
    }
    address public admin;
    VoteToken public voteToken;
    address[] public candidatesList;
    address[] public votersList;
    mapping(address => Candidate) public candidates;
    mapping(address => bool) public isRegistered;
    mapping(address => bool) hasVoted;
    uint votingStarted;
    uint votingPeriod;
    uint voterRegistrationPeriod;
    uint voterRegistrationStarted;
    uint candidateRegistrationPeriod;
    uint candidateRegistrationStarted;
    string public winner;
    string[] public winners;

    // events
    event candidateRegistrationCompleted(address indexed candidate, string name);
    event voterRegistrationCompleted(address indexed voter);
    event votingPhaseStarted();
    event votingPhaseEnded();
    event resultsPhase(string winner);

    constructor(uint _candidateRegistrationPeriod, uint _voterRegistrationPeriod, uint _votingPeriod, address _voteToken) {
        admin = msg.sender;
        voteToken = VoteToken(_voteToken);
        candidateRegistrationPeriod = _candidateRegistrationPeriod;
        voterRegistrationPeriod = _voterRegistrationPeriod;
        votingPeriod = _votingPeriod;
        candidateRegistrationStarted = block.timestamp;
        voterRegistrationStarted = candidateRegistrationStarted + candidateRegistrationPeriod;
        votingStarted = voterRegistrationStarted + voterRegistrationPeriod;
    }

    function candidateRegistration(string memory _candidateName) public {
        require(!candidates[msg.sender].candidateAdded, "Already registered as candidate.");
        require(msg.sender != admin, "Admin cannot register as a candidate!");
        require(block.timestamp < candidateRegistrationStarted + candidateRegistrationPeriod, "Candidate registration has ended.");
        require(!isRegistered[msg.sender], "Candidate is already registered");

        candidates[msg.sender] = Candidate(_candidateName, 0, true);
        candidatesList.push(msg.sender);
        isRegistered[msg.sender] = true;
        emit candidateRegistrationCompleted(msg.sender, _candidateName);

        if (block.timestamp >= votingStarted) {
            emit votingPhaseStarted();
        }
    }

    function voterRegistration() public {
        require(msg.sender != admin, "Admin cannot be a voter!");
        require(block.timestamp < voterRegistrationStarted + voterRegistrationPeriod, "Voters registration phase has ended.");
        require(!isRegistered[msg.sender], "Voter is already registered");
        
        isRegistered[msg.sender] = true;
        votersList.push(msg.sender);
        emit voterRegistrationCompleted(msg.sender);
        if (block.timestamp >= votingStarted) {
            emit votingPhaseStarted();
        }
        
    }

    function currentPhase() public view returns(ElectionPhases) {
        if (block.timestamp <= candidateRegistrationStarted + candidateRegistrationPeriod) {
            return ElectionPhases.candidateRegistrationPhase;
        }
        else if(block.timestamp <= voterRegistrationStarted + voterRegistrationPeriod) {
            return ElectionPhases.voterRegistrationPhase;
        }
        else if(block.timestamp <= votingStarted + votingPeriod) {
            return ElectionPhases.votingPhase;
        }
        else {
            return ElectionPhases.endedPhase;
        }
    }

    function vote(address _candidate) public {
        require(isRegistered[msg.sender], "You are not a registered voter.");
        require(!hasVoted[msg.sender], "You have already casted your vote");
        require(block.timestamp < votingPeriod + votingStarted, "voting phase is completed!");
        require(candidates[_candidate].candidateAdded, "The candidate you are trying to vote is not registered candidate");
        
        candidates[_candidate].voteCount += 1;
        hasVoted[msg.sender] = true;
        // if this vote is the last allowed by time, emit voting end event
        if (block.timestamp + 1 >= votingStarted + votingPeriod) {
            emit votingPhaseEnded();
        }
    }

    function electionWinner() public returns(string memory) {
        require(block.timestamp >= votingPeriod + votingStarted, "Voting is still going on");
        
        delete winners;
        uint maxVotes = 0;
        uint counter = 0;
        address winner_address;
        for (uint i=0; i< candidatesList.length; i++) {
            if(candidates[candidatesList[i]].voteCount > maxVotes) {
                maxVotes = candidates[candidatesList[i]].voteCount;
                counter = 1;
                winner_address = candidatesList[i];
            }
            else if (candidates[candidatesList[i]].voteCount == maxVotes) {
                counter++;
            }
        }

        if ( maxVotes == 0) {
            winner = "Nobody Won";
        } else if (counter > 1) {
            for (uint i=0; i < candidatesList.length; i++) {
                if (candidates[candidatesList[i]].voteCount == maxVotes) {
                    winners.push(candidates[candidatesList[i]].name);
                }
            }
            winner = "TIE. No clear winner";
        }
        else {
            winner = candidates[winner_address].name;
        }
        emit resultsPhase(winner);
        return winner;
    }

    function listOfCandidates() public view returns(string[] memory) {
        string[] memory names = new string[](candidatesList.length);
        for (uint i=0; i < candidatesList.length; i++) {
            names[i] = candidates[candidatesList[i]].name;
        }
        return names;
    }
}
