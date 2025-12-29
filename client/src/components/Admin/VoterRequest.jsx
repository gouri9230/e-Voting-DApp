import { useState, useEffect } from "react";
import { useWallet } from '../../context/WalletContext';

const VoterRequest = () => {
    const { contract, currentPhase, admin } = useWallet();
    const [pendingVoters, setPendingVoters] = useState([]);
   
    // Fetch all pending voter requests
    useEffect(() => {
        const fetchPendingVoters = async () => {
            if (!contract) return;
            
            const voters = await contract.getVoterRequests();
            const list = [];
            for (let i = 0; i<voters.length; i++) {
                if(voters[i].toLowerCase() === admin.toLowerCase()) continue;
                const tx = await contract.registrationRequested(voters[i]);
                if (tx) { list.push(voters[i]);}
            }
            setPendingVoters(list);
        }
        fetchPendingVoters();
    }, [contract]);

    const approveVoter = async (voterAddress) => {
        if (!contract) {
            alert("Contract not loaded!");
            return;
        }

        try {
            const tx = await contract.approveVoter(voterAddress);
            await tx.wait();
            setPendingVoters(pendingVoters => pendingVoters.filter(addr => addr !== voterAddress));
            
        } catch (error) {
            console.error("Error approving voter:", error);
            alert("Failed to approve voter: " + error.message);
        }
    };

    return (
        <div className="voter-requests">
            <h4>Pending Voter Requests</h4>
            {pendingVoters.length === 0 ? (
                <p>No pending voter requests</p>
            ) : (
                <ul className="list-group">
                    {pendingVoters.map((voter, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span className="text-truncate" style={{ maxWidth: "200px" }}>
                                {voter}
                            </span>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => approveVoter(voter)}
                                disabled={currentPhase !== 0}
                            >
                                Approve
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VoterRequest;