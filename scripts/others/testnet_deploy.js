import {network} from "hardhat";

const {ethers} = await network.connect();

async function main() {
    const deployContract1 = await ethers.deployContract("VoteToken", ["JustVotingToken", "JVT", 5]);
    await deployContract1.waitForDeployment();
    const voteTokenaddress = await deployContract1.target;
    const deployContract2 = await ethers.deployContract("Voting", [voteTokenaddress]);
    await deployContract2.waitForDeployment();
    const votingAddress = await deployContract2.target;
    console.log("voting contract address: ", votingAddress); // 0x39dD3d9f6791AbE519fC620e9EeA335eE3F012D8
    await deployContract1.setVotingContract(votingAddress);
}

main()
.catch(console.error);
