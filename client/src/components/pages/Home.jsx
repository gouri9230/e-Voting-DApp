import "bootstrap/dist/css/bootstrap.min.css";
import CandidateList from '../Common/CandidateList';
import { useWallet } from '../../context/WalletContext';
import AdminDashboard from './AdminDashboard';
import VoterDashboard from './VoterDashboard';
import Results from '../Common/Results';
import {useEffect, useState} from 'react';

const Home = () => {
    const {account, admin, connectWallet, currentPhase} = useWallet();
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(()=> {
        const savedAccount = localStorage.getItem("account");
        if (!account && savedAccount) {
            connectWallet();
        }else if (account) {
            localStorage.setItem("account", account);
        }
        else {
            localStorage.removeItem("account");
        }
    }, [account, connectWallet]);

    useEffect(() => {
        if (!account) setShowDashboard(false);
    }, [account]);

    // If not connected, always show public home
    if(!account) {
        return (
        <> <div className="header">
        <div className="container"><CandidateList/></div>
        <div className="phase">
        <h4 style={{color:"black"}}>Current election phase:</h4> 
        <p style={{fontStyle:"italic"}}>{["Registration", "Voting", "Ended"][currentPhase]}</p></div>
        </div>
        <h3>Election Results</h3>
        {currentPhase === 2 ? <Results/> : <p>Results will be declared once voting ends.</p>}
          </>);
    }
    // if account connected, & on dashboard page, then show back to home button, & based on the account, show its respective dashboard
    // if on dashboard page, then set it false
    if(showDashboard) {
        return (<>
                {!admin ? "Loading..." : admin.toLowerCase() === account.toLowerCase() ? <AdminDashboard/> : <VoterDashboard/>}
          </>);}
    //if account connected but on home page, then set show dashboard to true and give button go to dashboard.
    return (
        <><div className="header">
            <div className="container"><CandidateList /></div>
            <div className="phase">
            <h4 style={{color:"black"}}>Current election phase:</h4>
            <p style={{fontStyle:"italic"}}>{["Registration", "Voting", "Ended"][currentPhase]}</p></div>
           </div> 
           <span className="election">
            <h3>Election Results</h3>
            <Results/>
            </span>
        </>
    );
}; 

export default Home;