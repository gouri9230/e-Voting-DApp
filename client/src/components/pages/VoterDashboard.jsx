import { useWallet } from '../../context/WalletContext';
import EligibilityCheck from '../Voter/EligibilityCheck';
import VotingPanel from '../Voter/VotingPanel';
import RegisterVoter from '../Voter/RegisterVoter';

const VoterDashboard = () => {
    const { account, admin } = useWallet();
    
    return (<>
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