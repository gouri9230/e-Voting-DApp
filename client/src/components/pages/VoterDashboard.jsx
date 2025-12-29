import { useWallet } from '../../context/WalletContext';
import EligibilityCheck from '../Voter/EligibilityCheck';
import VotingPanel from '../Voter/VotingPanel';
import RegisterVoter from '../Voter/RegisterVoter';

const VoterDashboard = () => {
    const { account, admin, currentPhase, disconnectWallet } = useWallet();
    
    return (<>
        <h1 className='text-center'>Voter Dashboard</h1><hr></hr> 
        <button className="btn btn-primary" onClick={disconnectWallet}>Disconnect</button><hr></hr>
        <RegisterVoter/><hr></hr>
        {account && (
          <div className="container">
            <h5>Wallet Connected: {account}</h5><hr></hr>
            <p>Role: {!admin ? "Loading..." : admin.toLowerCase() === account.toLowerCase() ? "Admin" : "User/Voter"}</p>
          </div>
        )}
        <EligibilityCheck/><hr></hr>
        <VotingPanel/>
        
    </>);
};

export default VoterDashboard;