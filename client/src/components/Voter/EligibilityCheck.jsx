import { useWallet } from "../../context/WalletContext";
import {useState, useEffect} from 'react';

const EligibilityCheck = () => {
    const {contract, account} = useWallet();
    const [voted, setVoted] = useState(null);

    const VoterEligibility = async () => {
        if(!contract) return;
        const hasVoted = await contract.hasVoted(account);
        setVoted(hasVoted);
    } 

    useEffect(() => {
        VoterEligibility();
    }, [contract, account]);

    return (
        <div className="elegibility">
          <h3 className="header-text">Check Voting Eligibility</h3>
            <input type="button" onClick={VoterEligibility} value="Check Eligibility"/>
            {voted ? <p>You have already voted!</p> : <p>You are eligible to vote</p>}
        </div>
    )
}

export default EligibilityCheck;