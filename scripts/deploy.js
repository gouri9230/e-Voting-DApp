import {network} from "hardhat";

const {ethers} = await network.connect();

async function main() {
    //const [admin, addr1, addr2, ...others] = await ethers.getSigners();
    const deployedContract = await ethers.deployContract("Voting", [300, 300, 240]);
    await deployedContract.waitForDeployment();
    const address = await deployedContract.target;
    console.log("contract address: ", address);
    
    //const registration = await deployedContract.connect(addr1).candidateRegistration("Python");
    //await registration.wait();
    //console.log("candidate Tx hash: ", registration.hash);
}

main()
.catch(console.error);
