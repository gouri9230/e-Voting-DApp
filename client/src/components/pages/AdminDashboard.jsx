import { useWallet } from '../../context/WalletContext';
import RegisterCandidate from '../Admin/RegisterCandidate';
import PhaseControl from '../Admin/PhaseControl';
import VoterRequest from '../Admin/VoterRequest';

const AdminDashboard = () => {
    const { admin, currentPhase, account } = useWallet();
    return (<>
    {account && (<>
    <div className='candidates'>
      <PhaseControl/>
    </div>
    <div className='candidate-voter'>
      <div className='register-candidate'>
        {currentPhase === 0 ? (<RegisterCandidate />) : (<p>Candidates registration period is over!</p>)} 
      </div>
      <VoterRequest />
    </div>
    </>
    )}
  </>
);
}

export default AdminDashboard;
