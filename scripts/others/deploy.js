import {network} from "hardhat";

const {ethers} = await network.connect();

async function main() {
    const [admin, addr1, addr2, addr3, ...others] = await ethers.getSigners();
    const deployedContract1 = await ethers.deployContract("VoteToken", ["VotingToken", "VT", 5]);
    await deployedContract1.waitForDeployment();
    const voteTokenaddress = await deployedContract1.target;
    console.log("voteToken contract address: ", voteTokenaddress);
    const deployedContract2 = await ethers.deployContract("Voting", [voteTokenaddress]);
    await deployedContract2.waitForDeployment();
    const votingAddress = await deployedContract2.target;
    console.log("voting contract address: ", votingAddress);
    await deployedContract1.setVotingContract(votingAddress);

    const candidates = [{addr: addr1, name: "Alice"}, 
                        {addr: addr2, name: "Bob"},
                        {addr: addr3, name: "John"}]
    
    for (const candidate of candidates) {
        await deployedContract2.connect(admin).registerCandidate(candidate.addr, candidate.name);
    } 

    console.log("List of candidates: ");
    for (let i= 0; i<candidates.length; i++) {
        console.log(`Candidate address: ${candidates[i].addr.address}, Candidate name: ${candidates[i].name}`);
    }
    for (let voter = 0; voter < 5; voter++) {
        await deployedContract2.connect(admin).registerVoter(others[voter].address);
        console.log("Voter registered: ", others[voter].address)
    }
    
    const phase = await deployedContract2.connect(admin).changePhase(1);
    await phase.wait();
    //console.log("Phase changed to: ", phase)
}

main()
.catch(console.error);
