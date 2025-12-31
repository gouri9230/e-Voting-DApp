import {useState, useEffect, createContext, useContext} from 'react';
import {ethers} from 'ethers';
import votingContractABI from '../contracts/VotingContract.json';

const CONTRACT_ADDRESS = "0x3eE92A8a9BBbC1Fe8CdE9c3665CB4679B10a9233";

const WalletContext = createContext();

export const useWallet = () => {
  return useContext(WalletContext);
};

const WalletProvider = ({children}) => {
    const [provider, setProvider] = useState(null);
    const [publicProvider, setPublicProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [contract, setContract] = useState(null);
    const [readOnlyContract, setreadOnlyContract] = useState(null);

    const connectWallet = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          setProvider(provider);
          setSigner(signer);
          setAccount(account);
        }
        else {
          alert("Please install MetaMask!");
        }
      }
      catch(error) {
        console.error(error);
        alert(error.message || "Failed to connect to wallet.");
      }
    };

    const disconnectWallet = async () => {
        setSigner(null);
        setAccount(null);
        localStorage.removeItem("account");
      }

    useEffect(() => {
      disconnectWallet();
    }, []);

    // dependency array-> variables we read inside the effect.
    // if we are just setting a variable then no need to include
    useEffect(()=>{
        const init = async () => {
            const readOnlyProvider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/tqt_wrhEkMeEFnUjDrXWh");
            const contract = new ethers.Contract(CONTRACT_ADDRESS, votingContractABI.abi, readOnlyProvider);
            setreadOnlyContract(contract);
            setPublicProvider(readOnlyProvider);
            const phase = await contract.currentPhase();
            const adminAddr = await contract.admin();
            setCurrentPhase(Number(phase));
            setAdmin(adminAddr);
        };
        init();
    }, []);
    // we should never put state in useEffect dependencies if we set it inside the effect
    // e.g. we are setting states: admin, contract & phase in this useEffect, 
    // so we should not use these states in dependecy array or else it causes loop
    useEffect(() => {
      const loadContract = async () => {
        // always check for null value if we are using it in dependency array
        if (!signer) return;
        // if signer is not null
        const votingContract = new ethers.Contract(CONTRACT_ADDRESS, votingContractABI.abi, signer);
        const phase = await votingContract.currentPhase();
        setContract(votingContract);
        // admin is fixed, so no need to fetch everytime signer is updated
        if (!admin) { 
          const adminAddr = await votingContract.admin();
          setAdmin(adminAddr);
        }
        
        setCurrentPhase(Number(phase));
      }
      loadContract();
      // never call methods on nullable state, so always check it like in if statement
    }, [signer, admin]); // here we are reading admin & signer so include both.

    // event listeners for account changed, network provider changed
    useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // 4. Value object - everything you want to share
  const value = {
    provider,
    publicProvider,
    signer,
    account,
    admin,
    currentPhase,
    contract,
    readOnlyContract,
    connectWallet,  // So any component can trigger wallet connection
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;