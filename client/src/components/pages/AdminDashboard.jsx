import { useWallet } from '../../context/WalletContext';
import RegisterCandidate from '../Admin/RegisterCandidate';
import PhaseControl from '../Admin/PhaseControl';
import VoterRequest from '../Admin/VoterRequest';

const AdminDashboard = () => {
    const { admin, currentPhase, account, disconnectWallet } = useWallet();
    return (<>
        <h2 className="text-center">Admin Dashboard</h2><hr></hr>
        <button className="btn btn-primary" onClick={disconnectWallet}>Disconnect</button><hr></hr>
        <VoterRequest/><hr></hr>
        {account && (
          <div className="container">
            <h5>Wallet Connected: {account}</h5><hr></hr>
            <p>Role: {!admin ? "Loading..." : admin.toLowerCase() === account.toLowerCase() ? "Admin" : "Voter"}</p>
            {currentPhase === 0 ? <RegisterCandidate/> : "Candidates Registration period is over!"}
          </div>
        )}<hr></hr>
        <div className="container">
          <PhaseControl/>
        </div>
    </>)
}

export default AdminDashboard;
