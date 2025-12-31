import { useWallet } from '../../context/WalletContext';
import RegisterCandidate from '../Admin/RegisterCandidate';
import PhaseControl from '../Admin/PhaseControl';
import VoterRequest from '../Admin/VoterRequest';

const AdminDashboard = () => {
    const { admin, currentPhase, account } = useWallet();
    return (
  <>
    {account && (
      <>
        <div className="wallet">
          <p>Wallet Connected: {account}</p>
          <p>
            Role: {!admin
              ? "Loading..."
              : admin.toLowerCase() === account.toLowerCase()
              ? "Admin"
              : "Voter"}
          </p>
        </div>

        {currentPhase === 0 ? (
          <RegisterCandidate />
        ) : (
          <p>Candidates registration period is over!</p>
        )}
        <hr />

        <VoterRequest />

        <div>
          <PhaseControl />
        </div>
      </>
    )}
  </>
);
}

export default AdminDashboard;
