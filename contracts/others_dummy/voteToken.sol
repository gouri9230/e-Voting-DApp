// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract VoteToken is ERC20Capped, ERC20Burnable {
    address owner;
    address votingContract;

    constructor(string memory _name, string memory _symbol, uint256 _maxVoters) ERC20(_name, _symbol) ERC20Capped(_maxVoters * (10 ** decimals())) {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call.");
        _;
    }

    modifier onlyVotingContract {
        require(msg.sender == votingContract, "Only voting contract can call");
        _;
    }
    function setVotingContract(address _votingContract) external onlyOwner {
        votingContract = _votingContract;
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        // if there is some address in both 'from' and 'to', it means update is called for transfer
        // but we want to block any transfers to avoid vote stealing, so revert
        if(from != address(0) && to != address(0)) {
            revert("Transfers disabled");
        }
        super._update(from, to, value);
    }

    // only owner (or admin) can mint tokens and 1 token is sent to the registered voter to vote
    // 1 vote = 1 token
    function mint(address voter) public {
        _mint(voter, 1 * 10 ** decimals());
    }

    // once the voter has voted, 1 token of the voter is burned
    function burn(address voter) public onlyVotingContract {
        _burn(voter, 1 * 10 ** decimals());
    }

}