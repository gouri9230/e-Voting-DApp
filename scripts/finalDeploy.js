import { network } from "hardhat";

const {ethers} = await network.connect();

async function main() {
    const deployedContract = await ethers.deployContract("VotingContract");
    await deployedContract.waitForDeployment();
    const votingContractAddress = await deployedContract.target;
    console.log("contract address: ", votingContractAddress); // 0x3eE92A8a9BBbC1Fe8CdE9c3665CB4679B10a9233
}

main()
.catch(console.error);