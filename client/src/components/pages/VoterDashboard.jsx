import { useWallet } from '../../context/WalletContext';
import EligibilityCheck from '../Voter/EligibilityCheck';
import VotingPanel from '../Voter/VotingPanel';
import RegisterVoter from '../Voter/RegisterVoter';
import voters from '../Voter/voters.json';

const VoterDashboard = () => {
    const { account, admin } = useWallet();
    
    return (<>
        {account && (<>
            <div className='voters'>
              <EligibilityCheck/>
            <RegisterVoter/>
            <VotingPanel/>
          </div>
        </>)}</>
    );
};

export default VoterDashboard;