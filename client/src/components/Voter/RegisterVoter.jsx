import { useState, useEffect } from "react";
import { useWallet } from '../../context/WalletContext';

const RegisterVoter = () => {
    const { contract, account, currentPhase } = useWallet();
    const [isRequested, setIsRequested] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    // Check status on load
    useEffect(() => {
        const checkStatus = async () => {
            if (!contract || !account) return;
            
            const requested = await contract.registrationRequested(account);
            const approved = await contract.approvedVoters(account);
            setIsRequested(requested);
            setIsApproved(approved);
        };
        checkStatus();
    }, [contract, account]);

    // Request to register as voter
    const requestRegistration = async () => {
        if (!contract) return;
        
        try {
            const tx = await contract.requestRegistration();
            await tx.wait();
            setIsRequested(true);
            alert("Registration request sent!");
        } catch (error) {
            alert(error.reason || "Failed to request registration");
        }
    };

    return (
        <>
            {isApproved ? (
                <p>You are approved to vote!</p>
            ) : isRequested ? (
                <p>Pending admin approval...</p>
            ) : (
                <button className="btn btn-primary" onClick={requestRegistration} disabled={currentPhase===2}>
                    Request to Vote
                </button>
            )}
        </>
    );
};

export default RegisterVoter;