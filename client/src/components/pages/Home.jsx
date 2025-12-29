import "bootstrap/dist/css/bootstrap.min.css";
import CandidateList from '../Common/CandidateList';
import { useWallet } from '../../context/WalletContext';
import AdminDashboard from './AdminDashboard';
import VoterDashboard from './VoterDashboard';
import Results from '../Common/Results';
import {useEffect, useState} from 'react';

const Home = () => {
    // Get everything from context - no props needed!
    const {account, admin, connectWallet, currentPhase} = useWallet();
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(()=> {
        const savedAccount = localStorage.getItem("account");
        if (!account && savedAccount) {
            connectWallet();
        }
        else {
            localStorage.setItem("account", account);
        }
    }, [account, connectWallet]);

    // If not connected, always show public home
    if(!account) {
        return (
        <> 
        <h1 className="text-center">Welcome to e-Voting DApp</h1><hr></hr>
        <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button><hr/><br/>
            <CandidateList/>
            <h4>Current election phase:</h4> <p>{["Registration", "Voting", "Ended"][currentPhase]}</p>
            <h3>Election Results</h3>
            {currentPhase === 2 ? <Results/> : <p>Results will be declared once voting ends.</p>}
          </>);
    }
    // if account connected, & on dashboard page, then show back to home button, & based on the account, show its respective dashboard
    // if on dashboard page, then set it false
    if(showDashboard) {
        return (<> <button className="btn btn-secondary" onClick={() => setShowDashboard(false)}>
                    Back to Home
                </button>
                <hr />
                {!admin ? "Loading..." : admin.toLowerCase() === account.toLowerCase() ? <AdminDashboard/> : <VoterDashboard/>}
          </>);}
    //if account connected but on home page, then set show dashboard to true and give button go to dashboard.
    return (
        <><h1 className="text-center">Welcome to e-Voting DApp</h1>
            <hr />
            <button className="btn btn-primary" onClick={() => setShowDashboard(true)}>
                Go to Dashboard
            </button>
            <hr /><br />
            <CandidateList />
            <h4>Current election phase:</h4>
            <p>{["Registration", "Voting", "Ended"][currentPhase]}</p>
            <h3>Election Results</h3>
            {currentPhase === 2 ? <Results /> : <p>Results will be declared once voting ends.</p>}
        </>
    );
}; 

export default Home;